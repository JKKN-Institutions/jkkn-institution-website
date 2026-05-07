// scripts/smoke-adapter.ts
//
// Run: `npx tsx scripts/smoke-adapter.ts`
//
// Verifies the adapter transforms each of the 3 known live API rows into
// a valid FacultyFormData shape. Spot-checks the trickier mappings:
// - whitespace cleanup on names
// - case normalization on designations
// - JSONB shape transformations (qualifications, specialisations, etc.)

import { config as loadEnv } from 'dotenv'
import path from 'path'

loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

import { listEngineeringLeadership } from '../lib/services/staff-api'
import { staffToFacultyRow } from '../lib/adapters/staff-to-faculty'

function header(label: string) {
  console.log(`\n${'─'.repeat(60)}\n  ${label}\n${'─'.repeat(60)}`)
}

async function main() {
  const rows = await listEngineeringLeadership()
  console.log(`\n✓ Fetched ${rows.length} rows; running through adapter…\n`)

  const issues: string[] = []

  for (const r of rows) {
    const { formData, meta } = staffToFacultyRow(r)
    header(`${meta.staffId ?? '(no staff_id)'} — ${formData.full_name}`)

    // ── Name cleanup ───────────────────────────────────────
    if (/^\s|\s$/.test(formData.full_name) || /\s{2,}/.test(formData.full_name)) {
      issues.push(`${formData.full_name}: full_name still has whitespace issues`)
    }
    console.log(`  full_name:        "${formData.full_name}"`)

    // ── Designation case ──────────────────────────────────
    if (formData.designation !== '' && formData.designation === formData.designation.toUpperCase()) {
      issues.push(`${formData.full_name}: designation is still all-uppercase`)
    }
    console.log(`  designation:      "${formData.designation}"`)

    console.log(`  department:       ${formData.department}`)
    console.log(`  email:            ${formData.email}`)
    console.log(`  slug:             ${formData.slug}`)
    console.log(`  api_status:       ${meta.apiStatus}`)
    console.log(`  api_photo_url:    ${meta.apiPhotoUrl ?? '(none — sync will skip rehost)'}`)

    // ── JSONB shape spot-checks ──────────────────────────
    if (formData.qualifications.length > 0) {
      const q0 = formData.qualifications[0]
      const expectedKeys = ['degree', 'specialisation', 'university', 'year'].sort()
      const actualKeys = Object.keys(q0).sort()
      console.log(`  qualifications[0]: ${JSON.stringify(q0)}`)
      if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
        issues.push(`${formData.full_name}: qualifications[0] keys ${actualKeys.join(',')} != ${expectedKeys.join(',')}`)
      }
    }

    if (formData.specialisations.length > 0) {
      console.log(`  specialisations:  ${JSON.stringify(formData.specialisations)}`)
      if (typeof formData.specialisations[0] !== 'string') {
        issues.push(`${formData.full_name}: specialisations is not string[]`)
      }
    }

    if (formData.badges.length > 0) {
      console.log(`  badges:           ${JSON.stringify(formData.badges)}`)
      if (typeof formData.badges[0] !== 'string') {
        issues.push(`${formData.full_name}: badges is not string[]`)
      }
    }

    if (formData.experience_entries.length > 0) {
      const e0 = formData.experience_entries[0]
      console.log(`  experience[0]:    type=${e0.type} role="${e0.role}" inst="${e0.institution}" ${e0.start_year}-${e0.end_year}`)
    }

    if (formData.publications.length > 0) {
      console.log(`  publications:     ${formData.publications.length} entries (first doi=${formData.publications[0].doi_url || '(none)'})`)
    }
  }

  console.log('')
  if (issues.length > 0) {
    console.error('\n✗ Adapter spot-checks FAILED:')
    for (const m of issues) console.error(`  - ${m}`)
    process.exit(1)
  }
  console.log('✓ All 3 rows transformed cleanly. Adapter spot-checks passed.\n')
}

main().catch(e => {
  console.error('\n✗ Smoke FAILED:\n', e)
  process.exit(1)
})
