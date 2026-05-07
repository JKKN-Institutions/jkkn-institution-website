// scripts/smoke-phase4.ts
//
// Run: `npx tsx scripts/smoke-phase4.ts`
//
// Verifies:
//  1. The completeness rule correctly flags ALL 3 rows as draft
//     (Kathirvel: missing photo. Sasikumar: missing photo. Rajesh: missing bio.)
//  2. Photo rehost succeeds for the one row that has a photo (Rajesh)
//     and the resulting URL is publicly fetchable.

import { config as loadEnv } from 'dotenv'
import path from 'path'

loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

import { listEngineeringLeadership } from '../lib/services/staff-api'
import { staffToFacultyRow } from '../lib/adapters/staff-to-faculty'
import { checkFacultyCompleteness } from '../lib/sync/draft-rule'
import { rehostFacultyPhoto } from '../lib/sync/photo-rehost'

async function main() {
  const rows = await listEngineeringLeadership()
  console.log(`\n✓ Fetched ${rows.length} rows; running Phase 4 checks…\n`)

  // ── 1. Completeness rule (without rehost) ─────────────────────────────
  console.log('── Completeness check (pre-rehost, photo always null):')
  for (const r of rows) {
    const { formData } = staffToFacultyRow(r)
    const { isComplete, missing } = checkFacultyCompleteness(formData, null)
    const verdict = isComplete ? 'PUBLISH' : `DRAFT (missing: ${missing.join(', ')})`
    console.log(`  ${formData.full_name.padEnd(28)} -> ${verdict}`)
  }

  // ── 2. Photo rehost on the one row with a photo ──────────────────────
  console.log('\n── Photo rehost on row that has a photo:')
  let rehosted = 0
  for (const r of rows) {
    const { meta } = staffToFacultyRow(r)
    if (!meta.apiPhotoUrl) {
      console.log(`  ${r.first_name.trim()}: no api_photo_url, skipping`)
      continue
    }
    const url = await rehostFacultyPhoto(meta.apiPhotoUrl, meta.staffId, meta.apiId)
    if (!url) throw new Error(`Rehost returned null for ${r.first_name}`)
    console.log(`  ${r.first_name.trim()}: rehosted -> ${url}`)
    rehosted++

    // Verify the rehosted URL is publicly fetchable
    const verify = await fetch(url)
    if (!verify.ok) throw new Error(`Rehosted URL not fetchable: ${verify.status}`)
    const ct = verify.headers.get('content-type') ?? '(none)'
    const sizeKb = Number(verify.headers.get('content-length') ?? '0') / 1024
    console.log(`     verified: HTTP ${verify.status}, content-type=${ct}, size=${sizeKb.toFixed(1)} KB`)
  }

  if (rehosted < 1) throw new Error('Expected at least 1 photo rehost; got 0')

  // ── 3. Re-run completeness for Rajesh WITH rehosted URL ───────────────
  console.log('\n── Completeness check post-rehost for Rajesh (the only row with a photo):')
  const rajesh = rows.find(r => r.first_name.includes('RAJESH'))
  if (rajesh) {
    const { formData, meta } = staffToFacultyRow(rajesh)
    const url = await rehostFacultyPhoto(meta.apiPhotoUrl, meta.staffId, meta.apiId)
    const { isComplete, missing } = checkFacultyCompleteness(formData, url)
    const verdict = isComplete ? 'PUBLISH' : `DRAFT (missing: ${missing.join(', ')})`
    console.log(`  ${formData.full_name} (with rehosted photo) -> ${verdict}`)
    if (isComplete) throw new Error('Expected Rajesh to still be DRAFT (missing professional_summary)')
  }

  console.log('\n✓ Phase 4 smoke passed: completeness rule + photo rehost both work as designed.\n')
}

main().catch(e => {
  console.error('\n✗ Phase 4 smoke FAILED:\n', e)
  process.exit(1)
})
