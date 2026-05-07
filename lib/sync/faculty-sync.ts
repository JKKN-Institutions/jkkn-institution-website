// lib/sync/faculty-sync.ts
//
// The orchestrator. Called by:
//   - app/api/cron/sync-faculty-from-api/route.ts (every 15 min)
//   - app/api/sync-faculty-now/route.ts            (HMAC manual trigger)
//   - app/(admin)/admin/api/trigger-sync/route.ts  (admin button proxy)
//
// Pipeline (per row):
//   listEngineeringLeadership → adapter → rehostPhoto → completenessCheck → upsert
// Plus:
//   detect orphans (API rows that disappeared) → soft-delete locally
//   detect slug renames (local slug != API slug) → log to faculty_slug_history

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { listEngineeringLeadership } from '@/lib/services/staff-api'
import { staffToFacultyRow } from '@/lib/adapters/staff-to-faculty'
import { rehostFacultyPhoto } from '@/lib/sync/photo-rehost'
import { checkFacultyCompleteness } from '@/lib/sync/draft-rule'

export interface SyncReport {
  fetched: number
  upserted: number
  drafts: number
  published: number
  orphansSoftDeleted: number
  slugRenames: number
  errors: string[]
  rows: Array<{
    id: string
    name: string
    status: 'draft' | 'published'
    missing: string[]
  }>
  durationMs: number
}

function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('[faculty-sync] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function syncFacultyFromMyJKKN(): Promise<SyncReport> {
  const start = Date.now()
  const sb = getServiceClient()

  const report: SyncReport = {
    fetched: 0,
    upserted: 0,
    drafts: 0,
    published: 0,
    orphansSoftDeleted: 0,
    slugRenames: 0,
    errors: [],
    rows: [],
    durationMs: 0,
  }

  // 1. Pull live API state
  const apiRows = await listEngineeringLeadership()
  report.fetched = apiRows.length

  // 2. Snapshot current API-managed slugs for rename detection
  const { data: currentLocal } = await sb
    .from('faculty')
    .select('id, slug')
    .eq('synced_from_api', true)
  const currentSlugById = new Map<string, string>(
    (currentLocal ?? []).map(r => [r.id as string, r.slug as string])
  )

  // 3. Per-row pipeline
  for (const apiRow of apiRows) {
    try {
      const { formData, meta } = staffToFacultyRow(apiRow)

      // Photo rehost (soft-fails to null)
      const photoUrl = await rehostFacultyPhoto(meta.apiPhotoUrl, meta.staffId, meta.apiId)

      // Completeness rule — overrides MyJKKN's status when fields are missing
      const { isComplete, missing } = checkFacultyCompleteness(formData, photoUrl)
      const finalStatus: 'draft' | 'published' =
        isComplete && meta.apiStatus === 'published' ? 'published' : 'draft'

      // Slug-rename detection
      const oldSlug = currentSlugById.get(meta.apiId)
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
      })
    } catch (e) {
      report.errors.push(`${apiRow.id}: ${(e as Error).message}`)
    }
  }

  // 4. Orphan sweep — API rows that disappeared (deleted in MyJKKN, status=draft, etc.)
  //    Soft-delete by setting is_active=false and status=draft. Reversible.
  //    NEVER touches synced_from_api=false rows (manual legacy data).
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

  report.durationMs = Date.now() - start

  // Structured log line — greppable in Vercel logs
  console.log(
    JSON.stringify({
      event: 'faculty_sync_completed',
      ...report,
      ts: new Date().toISOString(),
    })
  )

  return report
}
