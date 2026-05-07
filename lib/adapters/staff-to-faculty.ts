// lib/adapters/staff-to-faculty.ts
//
// Adapter — translates a MyJKKN StaffApiRecord into our local FacultyFormData
// shape. This is the *only* place in the codebase that knows about the API's
// JSONB shape differences. If MyJKKN's contract changes, fix it here and
// nothing else has to move.
//
// 15 distinct shape transformations are applied; see comments per field.

import type { StaffApiRecord } from '@/lib/schemas/staff-api'
import type {
  FacultyFormData,
  Qualification,
  ExperienceEntry,
  Publication,
  FundedProject,
  Certification,
  Award,
  Membership,
  PhdScholar,
  Faq,
} from '@/lib/schemas/faculty'

// ── Helpers ──────────────────────────────────────────────────────────────

/** Trim leading/trailing whitespace + collapse internal whitespace runs. */
function clean(s: string | null | undefined): string {
  return (s ?? '').trim().replace(/\s+/g, ' ')
}

/** Title-case a string. Used only for designations like "ASSOCIATE PROFESSOR". */
function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase())
}

/** Empty-string -> null, for optional URL/text fields. */
function nullIfEmpty(s: string | null | undefined): string | null {
  const v = (s ?? '').trim()
  return v === '' ? null : v
}

/**
 * Map the API's `description` value into our local `type` enum.
 * The API stores values like "Teaching" / "Industry" in `description`;
 * our local type field has the same values as an enum. Fall back to "Teaching".
 */
function mapExperienceType(desc: string | null | undefined): ExperienceEntry['type'] {
  const v = (desc ?? '').trim().toLowerCase()
  if (v === 'industry') return 'Industry'
  if (v === 'clinical') return 'Clinical'
  if (v === 'research') return 'Research'
  return 'Teaching'
}

// ── Public types ─────────────────────────────────────────────────────────

export interface AdaptResult {
  /**
   * Local FacultyRow shape minus id/timestamps/status.
   * The sync engine sets id (= API UUID), status (via completeness rule),
   * synced_from_api=true, staff_id, last_synced_at.
   */
  formData: FacultyFormData
  /**
   * API metadata kept for sync bookkeeping — not part of the local row shape.
   */
  meta: {
    apiId: string                     // staff.id UUID (becomes local faculty.id)
    staffId: string | null            // CET245, CET225, ... (display only)
    apiUpdatedAt: string              // for change detection in future deltas
    apiStatus: 'draft' | 'published'  // MyJKKN's published flag (input to completeness rule)
    apiPhotoUrl: string | null        // raw upstream URL — sync rehosts to our bucket
  }
}

// ── Adapter ──────────────────────────────────────────────────────────────

export function staffToFacultyRow(staff: StaffApiRecord): AdaptResult {
  // 1. Name: concat first+last, then trim+collapse (API has whitespace issues)
  const fullName = clean(`${staff.first_name} ${staff.last_name}`)

  // 2. Designation: normalize all-uppercase strings to title case ("ASSOCIATE PROFESSOR" -> "Associate Professor")
  const designation = clean(staff.designation)
  const designationNorm = designation === designation.toUpperCase()
    ? titleCase(designation)
    : designation

  // 3. Department: flatten the embed
  const department = clean(staff.department?.department_name ?? '')

  // 4. Email: prefer institution_email, fall back to email
  const email = nullIfEmpty(staff.institution_email) ?? nullIfEmpty(staff.email) ?? ''

  const formData: FacultyFormData = {
    full_name: fullName,
    slug: clean(staff.slug ?? ''),
    designation: designationNorm,
    department,
    // 5. qualification (singular text summary)
    qualification: clean(staff.qualification_summary ?? ''),
    email,
    // photo_url is set AFTER photo rehost — sync engine fills it in
    photo_url: null,
    experience_years: staff.experience_years,
    research_papers: staff.research_papers,
    phd_scholars: staff.phd_scholars,
    awards_won: staff.awards_won,
    display_order: staff.display_order,
    is_active: staff.is_active,

    // 6. badges: API [{label}] -> local string[]
    badges: staff.badges.map(b => b.label),

    professional_summary: clean(staff.professional_summary ?? ''),

    // 7. qualifications: API {year, degree, institution, specialization} ->
    //    local {degree, specialisation, university, year}
    //    (renames institution->university, specialization->specialisation;
    //    fixes the JSON-LD `alumniOf` path the SEO audit flagged.)
    qualifications: staff.qualifications.map<Qualification>(q => ({
      degree: clean(String(q.degree ?? '')),
      specialisation: clean(String(q.specialization ?? '')),
      university: clean(String(q.institution ?? '')),
      year: q.year != null ? String(q.year) : '',
    })),

    // 8. specialisations: API [{name}] -> local string[]
    specialisations: staff.specialisations.map(s => clean(s.name)),

    // 9. experience_entries: API {from, to, role, organisation, description}
    //    -> local {type, start_year, end_year, role, institution, description}
    experience_entries: staff.experience_entries.map<ExperienceEntry>(e => ({
      type: mapExperienceType(e.description),
      start_year: e.from != null ? String(e.from) : '',
      end_year: e.to != null ? String(e.to) : '',
      role: clean(String(e.role ?? '')),
      institution: clean(String(e.organisation ?? '')),
      // API uses `description` for type; our local description field stays empty
      description: '',
    })),

    // 10. research_focus_areas: API [{area}] -> local string[]
    research_focus_areas: staff.research_focus_areas.map(r => clean(r.area)),

    // 11. publications: API {doi, url?, year, title, journal} ->
    //     local {title, authors, journal, year, doi_url, pubmed_url}
    publications: staff.publications.map<Publication>(p => ({
      title: clean(String(p.title ?? '')),
      authors: '',
      journal: clean(String(p.journal ?? '')),
      year: p.year != null ? String(p.year) : '',
      doi_url: p.doi
        ? (p.doi.startsWith('http') ? p.doi : `https://doi.org/${p.doi}`)
        : '',
      pubmed_url: clean(String(p.url ?? '')),
    })),

    // 12. funded_projects: API {title, agency, amount, status} ->
    //     local {title, agency, amount, period, status} (period defaults '')
    funded_projects: staff.funded_projects.map<FundedProject>(f => ({
      title: clean(String(f.title ?? '')),
      agency: clean(String(f.agency ?? '')),
      amount: clean(String(f.amount ?? '')),
      period: '',
      status: clean(String(f.status ?? '')) === 'Ongoing' ? 'Ongoing' : 'Completed',
    })),

    google_scholar_url: nullIfEmpty(staff.google_scholar_url) ?? '',
    researchgate_url: nullIfEmpty(staff.researchgate_url) ?? '',
    orcid_url: nullIfEmpty(staff.orcid_url) ?? '',

    // 13. certifications: API {name, issuer, year?} -> local {name, organisation, year}
    certifications: staff.certifications.map<Certification>(c => ({
      name: clean(String(c.name ?? '')),
      organisation: clean(String(c.issuer ?? '')),
      year: c.year != null ? String(c.year) : '',
    })),

    // 14. awards: API {year, title, awarded_by} -> local {name, body, year}
    awards: staff.awards.map<Award>(a => ({
      name: clean(String(a.title ?? '')),
      body: clean(String(a.awarded_by ?? '')),
      year: a.year != null ? String(a.year) : '',
    })),

    // 15. memberships: API {body, role, since:int} -> local {organisation, type, since:string}
    memberships: staff.memberships.map<Membership>(m => ({
      organisation: clean(String(m.body ?? '')),
      type: clean(String(m.role ?? '')),
      since: m.since != null ? String(m.since) : '',
    })),

    mentoring_description: clean(staff.mentoring_description ?? ''),

    // phd_scholars_list: API {name, topic, status} -> local {scholar_name, research_topic, status}
    phd_scholars_list: staff.phd_scholars_list.map<PhdScholar>(p => ({
      scholar_name: clean(String(p.name ?? '')),
      research_topic: clean(String(p.topic ?? '')),
      status: clean(String(p.status ?? '')),
    })),

    pg_dissertations_guided: staff.pg_dissertations_guided,
    ug_projects_guided: staff.ug_projects_guided,

    faqs: staff.faqs.map<Faq>(f => ({
      question: clean(String(f.question ?? '')),
      answer: clean(String(f.answer ?? '')),
    })),
  }

  return {
    formData,
    meta: {
      apiId: staff.id,
      staffId: nullIfEmpty(staff.staff_id),
      apiUpdatedAt: staff.updated_at,
      apiStatus: staff.status,
      apiPhotoUrl: nullIfEmpty(staff.profile_picture),
    },
  }
}
