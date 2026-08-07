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

/** Honorifics stripped from generated slugs so URLs stay consistent. */
const HONORIFIC_REGEX = /\b(dr|mr|mrs|ms|miss|prof|professor)\b\.?/gi

/**
 * Derive a URL slug from a person's name.
 *
 * Only used when MyJKKN has no slug of its own — which is the common case
 * (37 of 64 teaching staff have none). faculty.slug is UNIQUE NOT NULL and is
 * the public /faculty/[slug] URL, so an empty string here would both collide
 * on the unique index and produce an unroutable page.
 *
 * Honorifics are dropped because they're inconsistently present upstream:
 * keeping them would yield a mix of `mr-prakash-p` and bare `sathish-s`.
 *
 * Returns '' if nothing usable survives — the caller must handle that.
 */
export function slugifyName(name: string): string {
  return name
    .replace(HONORIFIC_REGEX, ' ')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

  // 4b. Slug: MyJKKN's slug wins so existing public URLs never move. Only 5 of
  //     64 teaching staff have one, so the rest are derived from the name.
  //     Last resort is the staff_id (or API UUID) — guarantees a non-empty
  //     value for faculty.slug, which is UNIQUE NOT NULL.
  //     Cross-row collisions are resolved by the sync engine, which is the only
  //     layer that can see the whole batch at once.
  const apiSlug = clean(staff.slug ?? '')
  const slug =
    apiSlug ||
    slugifyName(fullName) ||
    slugifyName(staff.staff_id ?? '') ||
    staff.id

  const formData: FacultyFormData = {
    full_name: fullName,
    slug,
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
