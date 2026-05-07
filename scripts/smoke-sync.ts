// scripts/smoke-sync.ts
//
// Run: `npx tsx scripts/smoke-sync.ts`
//
// End-to-end sync smoke. Will FAIL with "Invalid Compact JWS" until a real
// Engineering Supabase service-role JWT is in .env.local. Re-run after the
// key lands and expect: fetched=3, upserted=3, drafts=3, published=0
// (because all 3 rows currently fail the auto-draft rule).
//
// To verify the result in DB:
//   SELECT id, full_name, status, synced_from_api, staff_id, last_synced_at
//   FROM faculty WHERE synced_from_api = true ORDER BY full_name;

import { config as loadEnv } from 'dotenv'
import path from 'path'

loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

import { syncFacultyFromMyJKKN } from '../lib/sync/faculty-sync'

async function main() {
  const report = await syncFacultyFromMyJKKN()
  console.log('\n=== SYNC REPORT ===\n')
  console.log(JSON.stringify(report, null, 2))
  if (report.errors.length > 0) {
    console.error('\n✗ Sync had errors')
    process.exit(1)
  }
  if (report.fetched < 1) throw new Error('Expected ≥1 row fetched')
  console.log('\n✓ Sync smoke passed\n')
}

main().catch(e => {
  console.error('\n✗ Smoke FAILED:\n', e)
  process.exit(1)
})
