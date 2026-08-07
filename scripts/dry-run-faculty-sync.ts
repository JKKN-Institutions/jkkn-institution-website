// scripts/dry-run-faculty-sync.ts
//
// Run: `npx tsx scripts/dry-run-faculty-sync.ts`
//
// READ-ONLY preview of what syncFacultyFromMyJKKN() would change. Reuses the
// real fetch, adapter, slug-dedupe and completeness rule so the preview can't
// drift from the orchestrator — only the writes are omitted.

import { config as loadEnv } from 'dotenv'
import path from 'path'
loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { listEngineeringTeachingStaff } from '../lib/services/staff-api'
import { staffToFacultyRow, type AdaptResult } from '../lib/adapters/staff-to-faculty'
import { checkFacultyCompleteness } from '../lib/sync/draft-rule'
import { dedupeSlugs } from '../lib/sync/faculty-sync'

async function main() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { records, skipped, totalReturned, nonTeachingFiltered } =
    await listEngineeringTeachingStaff()

  const { data: local } = await sb
    .from('faculty')
    .select('id, slug, full_name, status, is_active, synced_from_api')

  const localById = new Map((local ?? []).map(r => [r.id as string, r]))
  const apiIds = new Set(records.map(r => r.id))
  const line = '='.repeat(96)

  console.log(`\nAPI returned ${totalReturned} rows`)
  console.log(`  non-teaching filtered out : ${nonTeachingFiltered}`)
  console.log(`  schema-invalid skipped    : ${skipped.length}`)
  console.log(`  → teaching staff to sync  : ${records.length}`)
  console.log(`DB currently has ${local?.length ?? 0} faculty rows`)

  if (skipped.length) {
    console.log('\n' + line)
    console.log('SCHEMA-INVALID (skipped, would appear in report.errors)')
    console.log(line)
    skipped.forEach(s => console.log(`  ${s.name ?? s.ref}: ${s.issues.join('; ')}`))
  }

  const adapted: AdaptResult[] = records.map(staffToFacultyRow)
  const renames = dedupeSlugs(adapted)

  if (renames.length) {
    console.log('\n' + line)
    console.log('BATCH SLUG COLLISIONS RESOLVED')
    console.log(line)
    renames.forEach(r => console.log(`  ${r.name.padEnd(28)} ${r.from}  ->  ${r.to}`))
  }

  let willPublish = 0
  let willDraft = 0
  let inserts = 0
  let updates = 0
  const thin: string[] = []

  console.log('\n' + line)
  console.log('PLANNED UPSERTS')
  console.log(line)

  for (const { formData, meta } of adapted) {
    const wouldHavePhoto = meta.apiPhotoUrl ? 'REHOSTED_URL' : null
    const { isComplete, missing, sparse } = checkFacultyCompleteness(formData, wouldHavePhoto)
    const finalStatus = isComplete && meta.apiStatus === 'published' ? 'published' : 'draft'

    const existing = localById.get(meta.apiId)
    const action = existing ? 'UPDATE' : 'INSERT'
    existing ? updates++ : inserts++
    finalStatus === 'published' ? willPublish++ : willDraft++
    if (finalStatus === 'published' && sparse.length) {
      thin.push(`${formData.full_name} (no ${sparse.join(', no ')})`)
    }

    const before = existing
      ? `${existing.status}/${existing.is_active ? 'active' : 'inactive'}`
      : '(new)'

    console.log(
      `  [${action}] ${formData.full_name.padEnd(26)} /${formData.slug}` +
      `\n           ${before} -> ${finalStatus}` +
      (missing.length ? `   BLOCKED BY: ${missing.join(', ')}` : '') +
      (finalStatus === 'published' ? '   VISIBLE' : '   hidden')
    )
  }

  console.log('\n' + line)
  console.log('PLANNED ORPHAN SWEEP  (synced rows no longer returned as teaching)')
  console.log(line)
  const orphans = (local ?? []).filter(r => r.synced_from_api && !apiIds.has(r.id as string))
  if (!orphans.length) console.log('  (none)')
  orphans.forEach(o =>
    console.log(
      `  [SOFT-DELETE] ${String(o.full_name).padEnd(26)} (${o.slug})` +
      `  ${o.status}/${o.is_active ? 'active' : 'inactive'} -> draft/inactive`
    )
  )

  console.log('\n' + line)
  console.log('UNTOUCHED  (synced_from_api = false, manual legacy rows)')
  console.log(line)
  for (const r of (local ?? []).filter(r => !r.synced_from_api)) {
    console.log(`  ${String(r.full_name).padEnd(26)} ${r.status}/${r.is_active ? 'active' : 'inactive'}`)
  }

  const legacyPublished = (local ?? []).filter(
    r => !r.synced_from_api && r.status === 'published' && r.is_active
  ).length
  const currentPublic = (local ?? []).filter(r => r.status === 'published' && r.is_active).length

  console.log('\n' + line)
  console.log('NET EFFECT ON /faculty')
  console.log(line)
  console.log(`  inserts: ${inserts}   updates: ${updates}`)
  console.log(`  publish: ${willPublish}   draft: ${willDraft}`)
  console.log(`  now   : ${currentPublic} visible`)
  console.log(`  after : ${willPublish + legacyPublished} visible  (${willPublish} synced + ${legacyPublished} legacy)`)

  const emptySlug = adapted.filter(a => !a.formData.slug)
  if (emptySlug.length) {
    console.log(`\n  BLOCKER: ${emptySlug.length} rows still have an empty slug.`)
  }

  if (thin.length) {
    console.log(`\n  PUBLISHED BUT THIN — ${thin.length} profiles need enrichment in MyJKKN:`)
    thin.slice(0, 15).forEach(t => console.log(`    - ${t}`))
    if (thin.length > 15) console.log(`    ... and ${thin.length - 15} more`)
  }

  console.log('\n  DRY RUN COMPLETE - nothing was written.\n')
}

main().catch(e => {
  console.error('\n dry run failed:\n', e)
  process.exit(1)
})
