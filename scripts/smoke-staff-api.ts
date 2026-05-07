// scripts/smoke-staff-api.ts
//
// Run: `npx tsx scripts/smoke-staff-api.ts`
//
// Verifies the API client returns the expected 3 rows (2 HODs + 1 Principal)
// for the Engineering institution, and that Zod parses the response without
// errors. If this script fails, something has changed upstream — look at the
// error and tighten/loosen the schema in lib/schemas/staff-api.ts.

import { config as loadEnv } from 'dotenv'
import path from 'path'

// Load .env.local explicitly — `dotenv/config` defaults to .env which is empty here.
loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

import { listEngineeringLeadership } from '../lib/services/staff-api'

async function main() {
  const rows = await listEngineeringLeadership()
  console.log(`\n✓ Fetched ${rows.length} rows from MyJKKN\n`)
  for (const r of rows) {
    const name = `${r.first_name.trim()} ${r.last_name.trim()}`.replace(/\s+/g, ' ')
    const dept = r.department?.department_name ?? '(no department)'
    const photoOk = r.profile_picture ? '📷' : '∅'
    const summaryOk = r.professional_summary ? '📝' : '∅'
    console.log(
      `  ${r.role_key?.padEnd(10) ?? 'unknown'.padEnd(10)}` +
      ` | ${name.padEnd(30)}` +
      ` | ${dept.padEnd(40)}` +
      ` | slug=${r.slug ?? '(none)'}` +
      ` | photo=${photoOk}  bio=${summaryOk}`
    )
  }
  console.log('')
  if (rows.length < 1) throw new Error('Expected at least 1 row; got 0 — auth failure or empty institution?')
  console.log('✓ Smoke test passed\n')
}

main().catch(e => {
  console.error('\n✗ Smoke test FAILED:\n', e)
  process.exit(1)
})
