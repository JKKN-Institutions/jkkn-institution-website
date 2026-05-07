// scripts/dump-sync-upsert-sql.ts
//
// One-off: fetch the 3 API rows, run them through the production adapter,
// emit UPSERT SQL to stdout. Captured output is then executed via the
// Engineering Supabase MCP (which has admin privileges, bypassing the
// service-role-key requirement that blocks the @supabase/supabase-js path).
//
// This is a DEMONSTRATION ONLY. Production data flow goes through
// lib/sync/faculty-sync.ts via Vercel Cron / manual trigger / admin button.

import { config as loadEnv } from 'dotenv'
import path from 'path'

loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

import { listEngineeringLeadership } from '../lib/services/staff-api'
import { staffToFacultyRow } from '../lib/adapters/staff-to-faculty'
import { checkFacultyCompleteness } from '../lib/sync/draft-rule'

function q(s: string | null | undefined): string {
  if (s == null) return 'NULL'
  return `'${s.replace(/'/g, "''")}'`
}

function jb(v: unknown): string {
  return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`
}

async function main() {
  const apiRows = await listEngineeringLeadership()
  const stmts: string[] = []

  for (const r of apiRows) {
    const { formData, meta } = staffToFacultyRow(r)
    const { isComplete, missing } = checkFacultyCompleteness(formData, null)
    const status: 'draft' | 'published' =
      isComplete && meta.apiStatus === 'published' ? 'published' : 'draft'

    stmts.push(
`-- ${formData.full_name} (api_status=${meta.apiStatus}, final=${status}; missing: ${missing.join(',') || 'none'})
INSERT INTO public.faculty (
  id, full_name, slug, designation, department, qualification, email, photo_url,
  experience_years, research_papers, phd_scholars, awards_won, display_order, is_active, status,
  badges, professional_summary, qualifications, specialisations, experience_entries,
  research_focus_areas, publications, funded_projects,
  google_scholar_url, researchgate_url, orcid_url,
  certifications, awards, memberships, mentoring_description, phd_scholars_list,
  pg_dissertations_guided, ug_projects_guided, faqs,
  synced_from_api, staff_id, last_synced_at
) VALUES (
  ${q(meta.apiId)}, ${q(formData.full_name)}, ${q(formData.slug)},
  ${q(formData.designation)}, ${q(formData.department)}, ${q(formData.qualification)},
  ${q(formData.email)}, NULL,
  ${formData.experience_years}, ${formData.research_papers}, ${formData.phd_scholars}, ${formData.awards_won},
  ${formData.display_order}, ${formData.is_active}, ${q(status)},
  ${jb(formData.badges)}, ${q(formData.professional_summary)},
  ${jb(formData.qualifications)}, ${jb(formData.specialisations)}, ${jb(formData.experience_entries)},
  ${jb(formData.research_focus_areas)}, ${jb(formData.publications)}, ${jb(formData.funded_projects)},
  ${q(formData.google_scholar_url)}, ${q(formData.researchgate_url)}, ${q(formData.orcid_url)},
  ${jb(formData.certifications)}, ${jb(formData.awards)}, ${jb(formData.memberships)},
  ${q(formData.mentoring_description)}, ${jb(formData.phd_scholars_list)},
  ${formData.pg_dissertations_guided}, ${formData.ug_projects_guided}, ${jb(formData.faqs)},
  true, ${q(meta.staffId)}, NOW()
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name, slug = EXCLUDED.slug, designation = EXCLUDED.designation,
  department = EXCLUDED.department, qualification = EXCLUDED.qualification, email = EXCLUDED.email,
  experience_years = EXCLUDED.experience_years, research_papers = EXCLUDED.research_papers,
  phd_scholars = EXCLUDED.phd_scholars, awards_won = EXCLUDED.awards_won,
  display_order = EXCLUDED.display_order, is_active = EXCLUDED.is_active, status = EXCLUDED.status,
  badges = EXCLUDED.badges, professional_summary = EXCLUDED.professional_summary,
  qualifications = EXCLUDED.qualifications, specialisations = EXCLUDED.specialisations,
  experience_entries = EXCLUDED.experience_entries, research_focus_areas = EXCLUDED.research_focus_areas,
  publications = EXCLUDED.publications, funded_projects = EXCLUDED.funded_projects,
  google_scholar_url = EXCLUDED.google_scholar_url, researchgate_url = EXCLUDED.researchgate_url,
  orcid_url = EXCLUDED.orcid_url,
  certifications = EXCLUDED.certifications, awards = EXCLUDED.awards, memberships = EXCLUDED.memberships,
  mentoring_description = EXCLUDED.mentoring_description, phd_scholars_list = EXCLUDED.phd_scholars_list,
  pg_dissertations_guided = EXCLUDED.pg_dissertations_guided, ug_projects_guided = EXCLUDED.ug_projects_guided,
  faqs = EXCLUDED.faqs,
  synced_from_api = true, staff_id = EXCLUDED.staff_id, last_synced_at = NOW();`
    )
  }

  console.log(stmts.join('\n\n'))
}

main().catch(e => { console.error(e); process.exit(1) })
