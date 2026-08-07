// lib/sync/faculty-sync.ts
//
// The orchestrator. Called by:
//   - app/api/cron/sync-faculty-from-api/route.ts (every 15 min)
//   - app/api/sync-faculty-now/route.ts            (HMAC manual trigger)
//   - app/(admin)/admin/api/trigger-sync/route.ts  (admin button proxy)
//
// Pipeline (per row):
//   listEngineeringTeachingStaff → adapter → dedupeSlugs → skip-if-unchanged
//   → rehostPhoto → completenessCheck → upsert
// Plus:
//   detect orphans (API rows that disappeared) → soft-delete locally
//   detect slug renames (local slug != API slug) → log to faculty_slug_history

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { listEngineeringTeachingStaff, type SkippedRecord } from '@/lib/services/staff-api'
import { staffToFacultyRow, type AdaptResult } from '@/lib/adapters/staff-to-faculty'
import { rehostFacultyPhoto } from '@/lib/sync/photo-rehost'
import { checkFacultyCompleteness } from '@/lib/sync/draft-rule'

export interface SyncReport {
  fetched: number
  /** Rows the API returned before the is_teaching filter. */
  totalReturned: number
  /** Rows dropped because category.is_teaching !== true. */
  nonTeachingFiltered: number
  /** Rows that failed Zod validation and were skipped. */
  schemaSkipped: SkippedRecord[]
  upserted: number
  /** Rows skipped because MyJKKN hasn't touched them since our last sync. */
  unchanged: number
  drafts: number
  published: number
  orphansSoftDeleted: number
  slugRenames: number
  /** Slugs that collided inside this batch and were suffixed to disambiguate. */
  slugDeduped: Array<{ name: string; from: string; to: string }>
  errors: string[]
  rows: Array<{
    id: string
    name: string
    status: 'draft' | 'published'
    missing: string[]
    sparse: string[]
  }>
  durationMs: number
}

export interface SyncOptions {
  /**
   * Re-process every row even if MyJKKN's updated_at is older than our
   * last_synced_at. Use after changing the adapter, the completeness rule or
   * the slug logic — otherwise unchanged rows keep their stale mapping.
   */
  force?: boolean
}

function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('[faculty-sync] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

/**
 * Resolve slug collisions *within* the incoming batch.
 *
 * The per-row guard further down handles a synced row colliding with a legacy
 * local row — it renames the legacy row out of the way. That doesn't work here:
 * when two API rows want the same slug, neither is a "loser", and the upsert's
 * ON CONFLICT (id) clause can't resolve a UNIQUE (slug) violation.
 *
 * First occurrence keeps the bare slug so existing URLs stay put; later ones
 * get a `-{staff_id}` suffix (falling back to a short UUID prefix). Order is
 * the API's, which is stable, so the same person keeps the same slug run over
 * run.
 */
export function dedupeSlugs(
  adapted: AdaptResult[]
): Array<{ name: string; from: string; to: string }> {
  const seen = new Set<string>()
  const renames: Array<{ name: string; from: string; to: string }> = []

  for (const { formData, meta } of adapted) {
    if (!seen.has(formData.slug)) {
      seen.add(formData.slug)
      continue
    }
    const suffix = (meta.staffId ?? meta.apiId.slice(0, 8)).toLowerCase()
    let candidate = `${formData.slug}-${suffix}`
    let n = 2
    while (seen.has(candidate)) {
      candidate = `${formData.slug}-${suffix}-${n++}`
    }
    renames.push({ name: formData.full_name, from: formData.slug, to: candidate })
    formData.slug = candidate
    seen.add(candidate)
  }

  return renames
}

export async function syncFacultyFromMyJKKN(options: SyncOptions = {}): Promise<SyncReport> {
  const start = Date.now()
  const sb = getServiceClient()

  const report: SyncReport = {
    fetched: 0,
    totalReturned: 0,
    nonTeachingFiltered: 0,
    schemaSkipped: [],
    upserted: 0,
    unchanged: 0,
    drafts: 0,
    published: 0,
    orphansSoftDeleted: 0,
    slugRenames: 0,
    slugDeduped: [],
    errors: [],
    rows: [],
    durationMs: 0,
  }

  // 1. Pull live API state (all active staff, filtered to category.is_teaching)
  const { records: apiRows, skipped, totalReturned, nonTeachingFiltered } =
    await listEngineeringTeachingStaff()
  report.fetched = apiRows.length
  report.totalReturned = totalReturned
  report.nonTeachingFiltered = nonTeachingFiltered
  report.schemaSkipped = skipped
  for (const s of skipped) {
    report.errors.push(`schema ${s.name ?? s.ref}: ${s.issues.join('; ')}`)
  }

  // 2. Snapshot current API-managed rows for rename detection + change detection
  const { data: currentLocal } = await sb
    .from('faculty')
    .select('id, slug, last_synced_at')
    .eq('synced_from_api', true)
  const localById = new Map(
    (currentLocal ?? []).map(r => [
      r.id as string,
      { slug: r.slug as string, lastSyncedAt: r.last_synced_at as string | null },
    ])
  )

  // 3. Adapt everything up front so slug collisions can be resolved across the
  //    whole batch before any write happens.
  const adapted: AdaptResult[] = []
  for (const apiRow of apiRows) {
    try {
      adapted.push(staffToFacultyRow(apiRow))
    } catch (e) {
      report.errors.push(`adapt ${apiRow.id}: ${(e as Error).message}`)
    }
  }
  report.slugDeduped = dedupeSlugs(adapted)

  // 4. Per-row pipeline
  for (const { formData, meta } of adapted) {
    try {
      const local = localById.get(meta.apiId)

      // Change detection — skip rows MyJKKN hasn't touched since our last sync.
      // At 64 rows every 15 minutes an unconditional photo rehost is ~6,100
      // download+upload round-trips a day; this drops steady-state cost to zero.
      // A slug change still has to go through, so compare that too.
      if (
        !options.force &&
        local?.lastSyncedAt &&
        new Date(meta.apiUpdatedAt) <= new Date(local.lastSyncedAt) &&
        local.slug === formData.slug
      ) {
        report.unchanged++
        continue
      }

      // Photo rehost (soft-fails to null)
      const photoUrl = await rehostFacultyPhoto(meta.apiPhotoUrl, meta.staffId, meta.apiId)

      // Completeness rule — overrides MyJKKN's status when fields are missing
      const { isComplete, missing, sparse } = checkFacultyCompleteness(formData, photoUrl)
      const finalStatus: 'draft' | 'published' =
        isComplete && meta.apiStatus === 'published' ? 'published' : 'draft'

      // Slug-rename detection
      const oldSlug = local?.slug
      if (oldSlug && oldSlug !== formData.slug && oldSlug !== '') {
        const { error: slugErr } = await sb
          .from('faculty_slug_history')
          .upsert(
            {
              old_slug: oldSlug,
              new_slug: formData.slug,
              faculty_id: meta.apiId,
              changed_at: new Date().toISOString(),
            },
            { onConflict: 'old_slug' }
          )
        if (slugErr) {
          report.errors.push(`slug history ${meta.apiId}: ${slugErr.message}`)
        } else {
          report.slugRenames++
        }
      }

      // ── Slug-collision guard ────────────────────────────────────────
      // The faculty table has a UNIQUE constraint on slug. If a non-API
      // local row already holds the slug we want, we have to free it first
      // (rename + soft-delete) — the upsert ON CONFLICT (id) clause won't
      // resolve a slug collision because the ID is different.
      if (formData.slug) {
        const { data: collision } = await sb
          .from('faculty')
          .select('id, slug, synced_from_api')
          .eq('slug', formData.slug)
          .neq('id', meta.apiId)
          .maybeSingle()
        if (collision && !collision.synced_from_api) {
          const newLegacySlug = `${collision.slug}-legacy-${(collision.id as string).slice(0, 8)}`
          const { error: renameErr } = await sb
            .from('faculty')
            .update({
              slug: newLegacySlug,
              is_active: false,
              status: 'draft',
            })
            .eq('id', collision.id as string)
          if (renameErr) {
            throw new Error(`free slug "${formData.slug}" from legacy ${collision.id}: ${renameErr.message}`)
          }
          console.log(
            `[faculty-sync] freed slug "${formData.slug}" by renaming legacy ${collision.id} -> "${newLegacySlug}" (soft-deleted)`
          )
        }
      }

      // Upsert into faculty (id == API UUID = stable identity)
      const row = {
        id: meta.apiId,
        ...formData,
        photo_url: photoUrl,
        status: finalStatus,
        synced_from_api: true,
        staff_id: meta.staffId,
        last_synced_at: new Date().toISOString(),
      }
      const { error } = await sb.from('faculty').upsert(row, { onConflict: 'id' })
      if (error) throw new Error(`upsert ${meta.apiId}: ${error.message}`)

      report.upserted++
      if (finalStatus === 'published') report.published++
      else report.drafts++

      report.rows.push({
        id: meta.apiId,
        name: formData.full_name,
        status: finalStatus,
        missing,
        sparse,
      })
    } catch (e) {
      report.errors.push(`${meta.apiId}: ${(e as Error).message}`)
    }
  }

  // 5. Orphan sweep — API rows that disappeared (deleted in MyJKKN, moved to a
  //    non-teaching category, deactivated, etc.).
  //    Soft-delete by setting is_active=false and status=draft. Reversible.
  //    NEVER touches synced_from_api=false rows (manual legacy data).
  //
  //    Guard: if the fetch returned nothing, skip the sweep entirely. An empty
  //    API response (auth failure, upstream outage) would otherwise soft-delete
  //    the whole directory in one tick.
  if (apiRows.length === 0) {
    report.errors.push('orphan sweep skipped: API returned 0 teaching rows')
  } else {
    const apiIds = new Set(apiRows.map(r => r.id))
    const orphanIds = (currentLocal ?? [])
      .filter(r => !apiIds.has(r.id as string))
      .map(r => r.id as string)
    if (orphanIds.length > 0) {
      const { error } = await sb
        .from('faculty')
        .update({
          is_active: false,
          status: 'draft',
          last_synced_at: new Date().toISOString(),
        })
        .eq('synced_from_api', true) // safety belt: never touch manual rows
        .in('id', orphanIds)
      if (error) report.errors.push(`orphan sweep: ${error.message}`)
      else report.orphansSoftDeleted = orphanIds.length
    }
  }

  report.durationMs = Date.now() - start

  // Structured log line — greppable in Vercel logs.
  // `rows` is omitted: at 64 entries it bloats every log line and the counts
  // above carry the signal.
  const { rows: _rows, ...summary } = report
  console.log(
    JSON.stringify({
      event: 'faculty_sync_completed',
      ...summary,
      ts: new Date().toISOString(),
    })
  )

  return report
}
