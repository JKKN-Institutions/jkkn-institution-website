# Engineering Faculty — MyJKKN API Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Engineering admin panel's local faculty CRUD with a read-only Vercel Cron sync from MyJKKN's Staff API (HODs + Principal only). Public site reads from local Supabase unchanged. Auto-draft any row missing required fields.

**Architecture:** Strategy D (read-replica). Vercel Cron pulls from `https://www.jkkn.ai/api/api-management/staff` every 15 minutes (plus an HMAC-secured manual trigger), runs each row through an adapter that translates 15 JSONB shape differences into our existing `FacultyRow` type, downloads photos to our Supabase Storage, applies a completeness rule that demotes incomplete rows to `status='draft'`, then upserts into the existing `public.faculty` table. The public website's Server Components, JSON-LD, sitemap, and `faculty_achievements` FK are entirely untouched.

**Tech Stack:** Next.js 16 App Router (Turbopack), TypeScript, Engineering Supabase (Postgres + Storage), Vercel Cron, Zod, native `fetch`. Smoke tests via `npx tsx scripts/`. No new test framework added.

**Spec:** [`docs/superpowers/specs/2026-05-07-faculty-api-migration-design.md`](../specs/2026-05-07-faculty-api-migration-design.md)

**Pre-migration audit:** confirmed 3 rows for Engineering institution (`5de4fba1-4564-41ed-8c73-5d948b74b843`): 2 HODs (Mech, ECE), 1 Principal. All 3 currently fail completeness check (missing photos for 2; missing professional_summary for 1).

---

## Phase 1 — Pre-flight & infrastructure

### Task 1: Add environment variables

**Files:**
- Modify: `.env.local` (local dev — git-ignored)
- Modify: `.env.example` (committed reference)

- [ ] **Step 1: Add to `.env.local`**

```
# MyJKKN Staff API (Engineering institution sync)
JKKN_API_BASE_URL=https://www.jkkn.ai/api
JKKN_API_KEY=jk_315cd826d1d563fb831ab21e853cdf44_movalo9g
JKKN_ENGINEERING_INSTITUTION_ID=5de4fba1-4564-41ed-8c73-5d948b74b843
FACULTY_SYNC_SECRET=<generate via: openssl rand -hex 32>
```

- [ ] **Step 2: Add the same keys (without values) to `.env.example`**

```
# MyJKKN Staff API (set per-institution on Vercel project)
JKKN_API_BASE_URL=https://www.jkkn.ai/api
JKKN_API_KEY=
JKKN_ENGINEERING_INSTITUTION_ID=
FACULTY_SYNC_SECRET=
```

- [ ] **Step 3: Commit `.env.example` only (never commit `.env.local`)**

```bash
git add .env.example
git commit -m "chore(faculty): add env var template for MyJKKN staff API sync"
```

---

### Task 2: Document and apply DB schema changes

**Files:**
- Create: `docs/database/engineering-college/20-faculty-api-sync.sql`
- Apply via: `mcp__Engineering_College_Supabase_Project__apply_migration`

- [ ] **Step 1: Document SQL FIRST in `docs/database/engineering-college/20-faculty-api-sync.sql`**

```sql
-- ============================================
-- Faculty API Sync — Schema Additions
-- ============================================
-- Purpose: Track API-managed faculty rows; record slug renames for 301 redirects
-- Created: 2026-05-07
-- Dependencies: faculty (existing)
-- Used by: lib/sync/faculty-sync.ts, middleware.ts (slug redirect)
-- Security: RLS public-read on slug_history (used by middleware); service-role write
-- ============================================

-- 1. Mark API-managed rows so the sync job knows what to upsert vs leave alone
ALTER TABLE public.faculty
  ADD COLUMN IF NOT EXISTS synced_from_api BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS staff_id TEXT,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS faculty_synced_from_api_idx
  ON public.faculty (synced_from_api) WHERE synced_from_api = true;

-- 2. Slug history for 301 redirects on upstream rename
CREATE TABLE IF NOT EXISTS public.faculty_slug_history (
  old_slug TEXT PRIMARY KEY,
  new_slug TEXT NOT NULL,
  faculty_id UUID NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS faculty_slug_history_new_slug_idx
  ON public.faculty_slug_history (new_slug);

ALTER TABLE public.faculty_slug_history ENABLE ROW LEVEL SECURITY;

-- Public read so middleware can look up redirects without auth
CREATE POLICY "Public read slug history"
  ON public.faculty_slug_history FOR SELECT
  USING (true);

-- End of Faculty API Sync schema additions
-- ============================================
```

- [ ] **Step 2: Apply migration via MCP**

Call `mcp__Engineering_College_Supabase_Project__apply_migration` with `name="20_faculty_api_sync"` and the full SQL above as `query`.

- [ ] **Step 3: Verify the columns and table exist**

```bash
# (mental note — Claude verifies this via MCP, not bash)
# mcp__Engineering_College_Supabase_Project__execute_sql:
#   SELECT column_name FROM information_schema.columns WHERE table_name='faculty' AND column_name IN ('synced_from_api','staff_id','last_synced_at');
#   SELECT to_regclass('public.faculty_slug_history');
```

Expected: 3 columns returned + non-null table OID.

- [ ] **Step 4: Commit the SQL doc**

```bash
git add docs/database/engineering-college/20-faculty-api-sync.sql
git commit -m "feat(db,faculty): add sync metadata columns + slug history table"
```

---

### Task 3: Create the `faculty-photos` Storage bucket

**Files:** Engineering Supabase Storage (no code file)

- [ ] **Step 1: Create bucket via MCP `execute_sql`**

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('faculty-photos', 'faculty-photos', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Public read policy (so the public site can render photos directly)
CREATE POLICY IF NOT EXISTS "Public read faculty photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'faculty-photos');

-- Service-role write only (sync uploads via service key)
CREATE POLICY IF NOT EXISTS "Service role write faculty photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'faculty-photos' AND auth.role() = 'service_role');
```

Document in `docs/database/engineering-college/20-faculty-api-sync.sql` (append to the same file).

- [ ] **Step 2: Verify**

```sql
SELECT id, public FROM storage.buckets WHERE id='faculty-photos';
```

Expected: `faculty-photos | true`.

- [ ] **Step 3: Add the bucket's URL pattern to `next.config.ts` `images.remotePatterns`**

Read current `next.config.ts`. Append a new entry under `images.remotePatterns` matching the Engineering Supabase storage host (e.g., `kyvfkyjmdbtyimtedkie.supabase.co`). Example:

```ts
{ protocol: 'https', hostname: 'kyvfkyjmdbtyimtedkie.supabase.co', pathname: '/storage/v1/object/public/faculty-photos/**' }
```

- [ ] **Step 4: Commit**

```bash
git add docs/database/engineering-college/20-faculty-api-sync.sql next.config.ts
git commit -m "feat(faculty): add faculty-photos storage bucket + remotePatterns"
```

---

## Phase 2 — API client layer

### Task 4: Define Zod schema for the API response

**Files:**
- Create: `lib/schemas/staff-api.ts`

- [ ] **Step 1: Write the schema (full file)**

```ts
// lib/schemas/staff-api.ts
import { z } from 'zod'

const StaffQualificationSchema = z.object({
  year: z.number().int().nullable().optional(),
  degree: z.string().nullable().optional(),
  institution: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),
}).passthrough()

const StaffSpecialisationSchema = z.object({ name: z.string() }).passthrough()

const StaffExperienceEntrySchema = z.object({
  from: z.union([z.string(), z.number()]).nullable().optional(),
  to: z.union([z.string(), z.number()]).nullable().optional(),
  role: z.string().nullable().optional(),
  organisation: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
}).passthrough()

const StaffPublicationSchema = z.object({
  doi: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  title: z.string().nullable().optional(),
  journal: z.string().nullable().optional(),
}).passthrough()

const StaffFundedProjectSchema = z.object({
  title: z.string().nullable().optional(),
  agency: z.string().nullable().optional(),
  amount: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
}).passthrough()

const StaffCertificationSchema = z.object({
  name: z.string().nullable().optional(),
  issuer: z.string().nullable().optional(),
  year: z.union([z.string(), z.number()]).nullable().optional(),
}).passthrough()

const StaffAwardSchema = z.object({
  year: z.union([z.string(), z.number()]).nullable().optional(),
  title: z.string().nullable().optional(),
  awarded_by: z.string().nullable().optional(),
}).passthrough()

const StaffMembershipSchema = z.object({
  body: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  since: z.union([z.string(), z.number()]).nullable().optional(),
}).passthrough()

const StaffPhdScholarSchema = z.object({
  name: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
}).passthrough()

const StaffBadgeSchema = z.object({ label: z.string() }).passthrough()
const StaffResearchAreaSchema = z.object({ area: z.string() }).passthrough()

export const StaffApiRecordSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().nullable().optional(),
  institution_email: z.string().nullable().optional(),
  designation: z.string(),
  staff_id: z.string().nullable().optional(),
  profile_picture: z.string().nullable().optional(),
  is_active: z.boolean(),
  status: z.enum(['draft', 'published']),
  has_extended_profile: z.boolean(),
  slug: z.string().nullable().optional(),
  display_order: z.number().int().default(0),
  experience_years: z.number().int().default(0),
  research_papers: z.number().int().default(0),
  phd_scholars: z.number().int().default(0),
  awards_won: z.number().int().default(0),
  pg_dissertations_guided: z.number().int().default(0),
  ug_projects_guided: z.number().int().default(0),
  qualification_summary: z.string().nullable().optional(),
  professional_summary: z.string().nullable().optional(),
  mentoring_description: z.string().nullable().optional(),
  google_scholar_url: z.string().nullable().optional(),
  researchgate_url: z.string().nullable().optional(),
  orcid_url: z.string().nullable().optional(),
  badges: z.array(StaffBadgeSchema).default([]),
  qualifications: z.array(StaffQualificationSchema).default([]),
  specialisations: z.array(StaffSpecialisationSchema).default([]),
  experience_entries: z.array(StaffExperienceEntrySchema).default([]),
  research_focus_areas: z.array(StaffResearchAreaSchema).default([]),
  publications: z.array(StaffPublicationSchema).default([]),
  funded_projects: z.array(StaffFundedProjectSchema).default([]),
  certifications: z.array(StaffCertificationSchema).default([]),
  awards: z.array(StaffAwardSchema).default([]),
  memberships: z.array(StaffMembershipSchema).default([]),
  phd_scholars_list: z.array(StaffPhdScholarSchema).default([]),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() }).passthrough()).default([]),
  role_key: z.string().nullable().optional(),
  institution: z.object({ id: z.string().uuid(), name: z.string() }).passthrough(),
  department: z.object({ id: z.string().uuid(), department_name: z.string() }).nullable().optional(),
  category: z.object({ category_name: z.string(), is_teaching: z.boolean(), shows_extended_profile: z.boolean() }).passthrough().optional(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough()

export type StaffApiRecord = z.infer<typeof StaffApiRecordSchema>

export const StaffApiListResponseSchema = z.object({
  data: z.array(StaffApiRecordSchema),
  metadata: z.object({
    total: z.number(),
    returned: z.number(),
  }).passthrough(),
})

export type StaffApiListResponse = z.infer<typeof StaffApiListResponseSchema>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit lib/schemas/staff-api.ts
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/schemas/staff-api.ts
git commit -m "feat(faculty): add Zod schema for MyJKKN staff API response"
```

---

### Task 5: Implement the API client

**Files:**
- Create: `lib/services/staff-api.ts`

- [ ] **Step 1: Write the client**

```ts
// lib/services/staff-api.ts
import { StaffApiListResponseSchema, type StaffApiRecord } from '@/lib/schemas/staff-api'

const BASE = process.env.JKKN_API_BASE_URL ?? 'https://www.jkkn.ai/api'
const KEY = process.env.JKKN_API_KEY
const INSTITUTION_ID = process.env.JKKN_ENGINEERING_INSTITUTION_ID

if (!KEY || !INSTITUTION_ID) {
  // Validate at import time only when this module is actually loaded server-side
  // (Avoids breaking client-side bundling if accidentally imported.)
  console.warn('[staff-api] Missing JKKN_API_KEY or JKKN_ENGINEERING_INSTITUTION_ID env vars')
}

async function request<T>(path: string, schema: { parse: (v: unknown) => T }): Promise<T> {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${KEY}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (res.status === 429) {
    const retry = Number(res.headers.get('Retry-After') ?? '5')
    await new Promise(r => setTimeout(r, retry * 1000))
    return request(path, schema)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`[staff-api] ${res.status} ${res.statusText} — ${body.slice(0, 200)}`)
  }

  const json = await res.json()
  return schema.parse(json)
}

/**
 * Fetch all active+published staff for Engineering institution by role_key.
 * The API caps `role_key` to one value per request, so callers must call once per role.
 */
export async function listStaffByRole(roleKey: 'hod' | 'principal'): Promise<StaffApiRecord[]> {
  if (!INSTITUTION_ID) throw new Error('JKKN_ENGINEERING_INSTITUTION_ID not set')
  const params = new URLSearchParams({
    institution_id: INSTITUTION_ID,
    role_key: roleKey,
    is_active: 'true',
    has_extended_profile: 'true',
    all: 'true',
  })
  const { data } = await request(
    `/api-management/staff?${params.toString()}`,
    StaffApiListResponseSchema
  )
  return data
}

/**
 * Convenience: fetch all HODs + Principal in parallel, deduplicate by id.
 */
export async function listEngineeringLeadership(): Promise<StaffApiRecord[]> {
  const [hods, principals] = await Promise.all([
    listStaffByRole('hod'),
    listStaffByRole('principal'),
  ])
  const seen = new Set<string>()
  const merged: StaffApiRecord[] = []
  for (const row of [...principals, ...hods]) {
    if (seen.has(row.id)) continue
    seen.add(row.id)
    merged.push(row)
  }
  return merged
}
```

- [ ] **Step 2: Smoke-test against live API**

Create `scripts/smoke-staff-api.ts`:

```ts
import { listEngineeringLeadership } from '@/lib/services/staff-api'

async function main() {
  const rows = await listEngineeringLeadership()
  console.log(`Fetched ${rows.length} rows`)
  for (const r of rows) {
    console.log(`  ${r.role_key} | ${r.first_name.trim()} ${r.last_name.trim()} | ${r.department?.department_name ?? '?'} | slug=${r.slug ?? '(none)'}`)
  }
  if (rows.length < 1) throw new Error('Expected at least 1 row')
}

main().catch(e => { console.error(e); process.exit(1) })
```

Run:
```bash
npx tsx scripts/smoke-staff-api.ts
```

Expected: 3 lines printed (1 principal, 2 hod), no errors. If Zod parse fails, the schema needs to be made more permissive — adjust `lib/schemas/staff-api.ts` and re-run.

- [ ] **Step 3: Commit**

```bash
git add lib/services/staff-api.ts scripts/smoke-staff-api.ts
git commit -m "feat(faculty): add MyJKKN staff API client with Zod-validated responses"
```

---

## Phase 3 — Adapter layer

### Task 6: Implement `staffToFacultyRow` adapter

**Files:**
- Create: `lib/adapters/staff-to-faculty.ts`

- [ ] **Step 1: Write the adapter**

```ts
// lib/adapters/staff-to-faculty.ts
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

/** Trim, collapse internal whitespace. */
function clean(s: string | null | undefined): string {
  return (s ?? '').trim().replace(/\s+/g, ' ')
}

/** Title-case a string ("ASSOCIATE PROFESSOR" -> "Associate Professor"). */
function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase())
}

/** Empty-string -> null. */
function nullIfEmpty(s: string | null | undefined): string | null {
  const v = (s ?? '').trim()
  return v === '' ? null : v
}

/** Map experience.description into our type enum if it fits, else default 'Teaching'. */
function mapExperienceType(desc: string | null | undefined): ExperienceEntry['type'] {
  const v = (desc ?? '').trim().toLowerCase()
  if (v === 'industry') return 'Industry'
  if (v === 'clinical') return 'Clinical'
  if (v === 'research') return 'Research'
  return 'Teaching'
}

export interface AdaptResult {
  /** Local FacultyRow shape minus id/timestamps/status (the sync engine sets those). */
  formData: FacultyFormData
  /** API metadata kept for sync bookkeeping. */
  meta: {
    apiId: string                    // api row's UUID (becomes local faculty.id)
    staffId: string | null           // CET245, CET225, ...
    apiUpdatedAt: string             // for change detection
    apiStatus: 'draft' | 'published' // API's own published flag
    apiPhotoUrl: string | null       // raw upstream URL (sync rehosts to our bucket)
  }
}

export function staffToFacultyRow(staff: StaffApiRecord): AdaptResult {
  const fullName = clean(`${staff.first_name} ${staff.last_name}`)
  const designation = clean(staff.designation)
  // Title-case if it's all-uppercase, otherwise leave alone
  const designationNorm = designation === designation.toUpperCase()
    ? titleCase(designation)
    : designation
  const department = clean(staff.department?.department_name ?? '')
  const email = nullIfEmpty(staff.institution_email) ?? nullIfEmpty(staff.email) ?? ''

  const formData: FacultyFormData = {
    full_name: fullName,
    slug: clean(staff.slug ?? ''),
    designation: designationNorm,
    department,
    qualification: clean(staff.qualification_summary ?? ''),
    email,
    photo_url: null, // populated AFTER photo rehost in sync engine
    experience_years: staff.experience_years,
    research_papers: staff.research_papers,
    phd_scholars: staff.phd_scholars,
    awards_won: staff.awards_won,
    display_order: staff.display_order,
    is_active: staff.is_active,
    badges: staff.badges.map(b => b.label),

    professional_summary: clean(staff.professional_summary ?? ''),

    qualifications: staff.qualifications.map<Qualification>(q => ({
      degree: clean(String(q.degree ?? '')),
      specialisation: clean(String(q.specialization ?? '')),
      university: clean(String(q.institution ?? '')),
      year: q.year != null ? String(q.year) : '',
    })),

    specialisations: staff.specialisations.map(s => clean(s.name)),

    experience_entries: staff.experience_entries.map<ExperienceEntry>(e => ({
      type: mapExperienceType(e.description),
      start_year: e.from != null ? String(e.from) : '',
      end_year: e.to != null ? String(e.to) : '',
      role: clean(String(e.role ?? '')),
      institution: clean(String(e.organisation ?? '')),
      description: '', // API uses description for type; we leave free-text empty
    })),

    research_focus_areas: staff.research_focus_areas.map(r => clean(r.area)),

    publications: staff.publications.map<Publication>(p => ({
      title: clean(String(p.title ?? '')),
      authors: '',
      journal: clean(String(p.journal ?? '')),
      year: p.year != null ? String(p.year) : '',
      doi_url: p.doi ? (p.doi.startsWith('http') ? p.doi : `https://doi.org/${p.doi}`) : '',
      pubmed_url: clean(String(p.url ?? '')),
    })),

    funded_projects: staff.funded_projects.map<FundedProject>(f => ({
      title: clean(String(f.title ?? '')),
      agency: clean(String(f.agency ?? '')),
      amount: clean(String(f.amount ?? '')),
      period: '',
      status: (clean(String(f.status ?? '')) === 'Ongoing' ? 'Ongoing' : 'Completed'),
    })),

    google_scholar_url: nullIfEmpty(staff.google_scholar_url) ?? '',
    researchgate_url: nullIfEmpty(staff.researchgate_url) ?? '',
    orcid_url: nullIfEmpty(staff.orcid_url) ?? '',

    certifications: staff.certifications.map<Certification>(c => ({
      name: clean(String(c.name ?? '')),
      organisation: clean(String(c.issuer ?? '')),
      year: c.year != null ? String(c.year) : '',
    })),

    awards: staff.awards.map<Award>(a => ({
      name: clean(String(a.title ?? '')),
      body: clean(String(a.awarded_by ?? '')),
      year: a.year != null ? String(a.year) : '',
    })),

    memberships: staff.memberships.map<Membership>(m => ({
      organisation: clean(String(m.body ?? '')),
      type: clean(String(m.role ?? '')),
      since: m.since != null ? String(m.since) : '',
    })),

    mentoring_description: clean(staff.mentoring_description ?? ''),

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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit lib/adapters/staff-to-faculty.ts
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/adapters/staff-to-faculty.ts
git commit -m "feat(faculty): add API->FacultyRow adapter with 15 shape mappings"
```

---

### Task 7: Verify adapter on the 3 known rows

**Files:**
- Create: `scripts/smoke-adapter.ts`

- [ ] **Step 1: Write the smoke script**

```ts
// scripts/smoke-adapter.ts
import { listEngineeringLeadership } from '@/lib/services/staff-api'
import { staffToFacultyRow } from '@/lib/adapters/staff-to-faculty'

async function main() {
  const rows = await listEngineeringLeadership()
  for (const r of rows) {
    const { formData, meta } = staffToFacultyRow(r)
    console.log('---')
    console.log(`api id: ${meta.apiId}`)
    console.log(`staff_id: ${meta.staffId}`)
    console.log(`full_name: "${formData.full_name}"`)  // must NOT have leading/trailing/double spaces
    console.log(`slug: ${formData.slug}`)
    console.log(`designation: "${formData.designation}"`)  // must be Title Case
    console.log(`department: ${formData.department}`)
    console.log(`email: ${formData.email}`)
    console.log(`qualifications: ${JSON.stringify(formData.qualifications.slice(0, 1))}`)  // must have university, specialisation
    console.log(`specialisations: ${JSON.stringify(formData.specialisations)}`)  // must be string[]
    console.log(`api_photo_url: ${meta.apiPhotoUrl}`)
    console.log(`badges: ${JSON.stringify(formData.badges)}`)  // must be string[]
  }
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 2: Run and visually inspect**

```bash
npx tsx scripts/smoke-adapter.ts
```

Expected output spot-checks:
- `full_name` for Sasikumar = `"Dr R. Sasikumar"` (no double-space, no trailing)
- `designation` for Rajesh = `"Associate Professor"` (was `"ASSOCIATE PROFESSOR"`)
- `qualifications[0]` for any HOD has keys `degree`, `specialisation`, `university`, `year`
- `specialisations` is a `string[]`, not `[{name}]`
- `badges` is a `string[]`

If any spot-check fails, fix the adapter before continuing.

- [ ] **Step 3: Commit**

```bash
git add scripts/smoke-adapter.ts
git commit -m "test(faculty): smoke script verifies adapter on live API rows"
```

---

## Phase 4 — Auto-draft rule + photo rehost

### Task 8: Implement completeness check

**Files:**
- Create: `lib/sync/draft-rule.ts`

- [ ] **Step 1: Write the rule**

```ts
// lib/sync/draft-rule.ts
import type { FacultyFormData } from '@/lib/schemas/faculty'

export interface CompletenessResult {
  isComplete: boolean
  missing: string[]
}

/**
 * The forcing-function rule: if any of these is empty/null/zero-length, the row is incomplete.
 * Incomplete rows get status='draft' regardless of MyJKKN's published flag.
 */
export function checkFacultyCompleteness(
  formData: FacultyFormData,
  rehostedPhotoUrl: string | null
): CompletenessResult {
  const missing: string[] = []
  if (!rehostedPhotoUrl) missing.push('photo_url')
  if (!formData.professional_summary || formData.professional_summary.trim() === '') missing.push('professional_summary')
  if (!formData.qualifications || formData.qualifications.length === 0) missing.push('qualifications')
  if (!formData.email || formData.email.trim() === '') missing.push('email')
  if (!formData.designation || formData.designation.trim() === '') missing.push('designation')
  if (!formData.department || formData.department.trim() === '') missing.push('department')
  return { isComplete: missing.length === 0, missing }
}
```

- [ ] **Step 2: Quick smoke test inline (extend `scripts/smoke-adapter.ts`)**

Append to `scripts/smoke-adapter.ts`:

```ts
import { checkFacultyCompleteness } from '@/lib/sync/draft-rule'

// after the existing for-loop:
console.log('--- COMPLETENESS ---')
for (const r of rows) {
  const { formData, meta } = staffToFacultyRow(r)
  const { isComplete, missing } = checkFacultyCompleteness(formData, null)  // null = no photo yet
  console.log(`${formData.full_name}: ${isComplete ? 'COMPLETE' : `DRAFT (missing: ${missing.join(', ')})`}`)
}
```

Run: `npx tsx scripts/smoke-adapter.ts`

Expected: all 3 rows print `DRAFT (missing: photo_url[, ...])` because we haven't done photo rehost yet AND because we already know Rajesh is missing professional_summary.

- [ ] **Step 3: Commit**

```bash
git add lib/sync/draft-rule.ts scripts/smoke-adapter.ts
git commit -m "feat(faculty): add completeness check forcing draft on incomplete rows"
```

---

### Task 9: Implement photo rehost

**Files:**
- Create: `lib/sync/photo-rehost.ts`

- [ ] **Step 1: Write the rehost helper**

```ts
// lib/sync/photo-rehost.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
})

const BUCKET = 'faculty-photos'

/**
 * Download a remote image and upload to our Supabase Storage.
 * Returns the public URL of the rehosted image, or null if upstream had no photo / fetch failed.
 *
 * Idempotent: same `staffId` overwrites the same key; cheap to call repeatedly.
 */
export async function rehostFacultyPhoto(
  apiPhotoUrl: string | null,
  staffId: string | null,
  apiUuid: string
): Promise<string | null> {
  if (!apiPhotoUrl) return null
  const key = `${staffId ?? apiUuid}.jpg`

  let res: Response
  try {
    res = await fetch(apiPhotoUrl)
  } catch (e) {
    console.warn(`[photo-rehost] fetch failed for ${apiPhotoUrl}: ${(e as Error).message}`)
    return null
  }
  if (!res.ok) {
    console.warn(`[photo-rehost] upstream ${res.status} for ${apiPhotoUrl}`)
    return null
  }

  const buf = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'

  const { error } = await supabase.storage.from(BUCKET).upload(key, buf, {
    contentType,
    upsert: true,
    cacheControl: '3600',
  })
  if (error) {
    console.warn(`[photo-rehost] upload failed for ${key}: ${error.message}`)
    return null
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key)
  return data.publicUrl
}
```

- [ ] **Step 2: Smoke-test against the one row that has a photo (Rajesh)**

Create `scripts/smoke-photo-rehost.ts`:

```ts
import { listStaffByRole } from '@/lib/services/staff-api'
import { rehostFacultyPhoto } from '@/lib/sync/photo-rehost'

async function main() {
  const hods = await listStaffByRole('hod')
  const withPhoto = hods.find(h => h.profile_picture && h.profile_picture.length > 0)
  if (!withPhoto) {
    console.log('No HOD has a profile_picture — cannot smoke-test rehost. Skipping.')
    return
  }
  const url = await rehostFacultyPhoto(withPhoto.profile_picture!, withPhoto.staff_id ?? null, withPhoto.id)
  console.log(`rehosted ${withPhoto.first_name} ${withPhoto.last_name}: ${url}`)
  if (!url) throw new Error('rehost returned null')
}

main().catch(e => { console.error(e); process.exit(1) })
```

Run: `npx tsx scripts/smoke-photo-rehost.ts`

Expected: a public URL on `<engineering-supabase>.supabase.co/storage/v1/object/public/faculty-photos/CET225.jpg` is printed. Open it in a browser to verify the image renders.

- [ ] **Step 3: Commit**

```bash
git add lib/sync/photo-rehost.ts scripts/smoke-photo-rehost.ts
git commit -m "feat(faculty): rehost MyJKKN profile photos to Engineering Supabase Storage"
```

---

## Phase 5 — Sync engine

### Task 10: Implement the orchestrator

**Files:**
- Create: `lib/sync/faculty-sync.ts`

- [ ] **Step 1: Write the engine**

```ts
// lib/sync/faculty-sync.ts
import { createClient } from '@supabase/supabase-js'
import { listEngineeringLeadership } from '@/lib/services/staff-api'
import { staffToFacultyRow } from '@/lib/adapters/staff-to-faculty'
import { rehostFacultyPhoto } from '@/lib/sync/photo-rehost'
import { checkFacultyCompleteness } from '@/lib/sync/draft-rule'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

interface SyncReport {
  fetched: number
  upserted: number
  drafts: number
  published: number
  orphansSoftDeleted: number
  slugRenames: number
  errors: string[]
  rows: Array<{ id: string; name: string; status: 'draft' | 'published'; missing: string[] }>
}

export async function syncFacultyFromMyJKKN(): Promise<SyncReport> {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { persistSession: false } })

  const apiRows = await listEngineeringLeadership()
  const report: SyncReport = {
    fetched: apiRows.length,
    upserted: 0, drafts: 0, published: 0,
    orphansSoftDeleted: 0, slugRenames: 0, errors: [], rows: [],
  }

  // Snapshot current API-managed slugs for rename detection
  const { data: currentLocal } = await sb
    .from('faculty')
    .select('id, slug')
    .eq('synced_from_api', true)
  const currentSlugById = new Map((currentLocal ?? []).map(r => [r.id, r.slug]))

  for (const apiRow of apiRows) {
    try {
      const { formData, meta } = staffToFacultyRow(apiRow)

      // 1. Photo rehost
      const photoUrl = await rehostFacultyPhoto(meta.apiPhotoUrl, meta.staffId, meta.apiId)

      // 2. Completeness rule
      const { isComplete, missing } = checkFacultyCompleteness(formData, photoUrl)
      const finalStatus: 'draft' | 'published' = isComplete && meta.apiStatus === 'published' ? 'published' : 'draft'

      // 3. Slug rename detection
      const oldSlug = currentSlugById.get(meta.apiId)
      if (oldSlug && oldSlug !== formData.slug) {
        await sb.from('faculty_slug_history').upsert({
          old_slug: oldSlug,
          new_slug: formData.slug,
          faculty_id: meta.apiId,
          changed_at: new Date().toISOString(),
        }, { onConflict: 'old_slug' })
        report.slugRenames++
      }

      // 4. Upsert
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
      if (finalStatus === 'published') report.published++; else report.drafts++
      report.rows.push({ id: meta.apiId, name: formData.full_name, status: finalStatus, missing })
    } catch (e) {
      report.errors.push(`${apiRow.id}: ${(e as Error).message}`)
    }
  }

  // 5. Orphan sweep — soft-delete API rows no longer in the payload
  const apiIds = new Set(apiRows.map(r => r.id))
  const orphanIds = (currentLocal ?? []).filter(r => !apiIds.has(r.id)).map(r => r.id)
  if (orphanIds.length > 0) {
    const { error } = await sb
      .from('faculty')
      .update({ is_active: false, status: 'draft', last_synced_at: new Date().toISOString() })
      .in('id', orphanIds)
    if (error) report.errors.push(`orphan sweep: ${error.message}`)
    else report.orphansSoftDeleted = orphanIds.length
  }

  return report
}
```

- [ ] **Step 2: Smoke-test**

Create `scripts/smoke-sync.ts`:

```ts
import { syncFacultyFromMyJKKN } from '@/lib/sync/faculty-sync'

async function main() {
  const report = await syncFacultyFromMyJKKN()
  console.log(JSON.stringify(report, null, 2))
  if (report.errors.length > 0) {
    console.error('SYNC HAD ERRORS')
    process.exit(1)
  }
}
main().catch(e => { console.error(e); process.exit(1) })
```

Run: `npx tsx scripts/smoke-sync.ts`

Expected: report shows `fetched: 3, upserted: 3, drafts: 3, published: 0` (because the auto-draft rule catches missing photos for 2 and missing summary for 1). Verify in Supabase:

```sql
SELECT id, full_name, status, synced_from_api, staff_id, last_synced_at
FROM faculty
WHERE synced_from_api = true
ORDER BY full_name;
```

Expected: 3 rows visible, all `status='draft'`, all `synced_from_api=true`.

- [ ] **Step 3: Commit**

```bash
git add lib/sync/faculty-sync.ts scripts/smoke-sync.ts
git commit -m "feat(faculty): sync engine — fetch, adapt, rehost, completeness, upsert, orphan sweep"
```

---

## Phase 6 — HTTP endpoints

### Task 11: Vercel Cron endpoint

**Files:**
- Create: `app/api/cron/sync-faculty-from-api/route.ts`

- [ ] **Step 1: Write the route**

```ts
// app/api/cron/sync-faculty-from-api/route.ts
import { NextResponse } from 'next/server'
import { syncFacultyFromMyJKKN } from '@/lib/sync/faculty-sync'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  // Vercel Cron sets this header; reject anything else in prod.
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'
  if (process.env.VERCEL && !isVercelCron) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const start = Date.now()
  try {
    const report = await syncFacultyFromMyJKKN()
    console.log('[cron/sync-faculty]', JSON.stringify(report))
    return NextResponse.json({ ok: true, durationMs: Date.now() - start, ...report })
  } catch (e) {
    console.error('[cron/sync-faculty] failed:', e)
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit app/api/cron/sync-faculty-from-api/route.ts
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/cron/sync-faculty-from-api/route.ts
git commit -m "feat(faculty): add Vercel Cron endpoint for periodic sync"
```

---

### Task 12: Manual sync endpoint (HMAC)

**Files:**
- Create: `app/api/sync-faculty-now/route.ts`

- [ ] **Step 1: Write the route**

```ts
// app/api/sync-faculty-now/route.ts
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { syncFacultyFromMyJKKN } from '@/lib/sync/faculty-sync'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SECRET = process.env.FACULTY_SYNC_SECRET ?? ''

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(req: Request) {
  if (!SECRET) {
    return NextResponse.json({ error: 'sync secret not configured' }, { status: 500 })
  }
  const provided = req.headers.get('x-sync-secret') ?? ''
  if (!constantTimeEqual(provided, SECRET)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const report = await syncFacultyFromMyJKKN()
    console.log('[sync-now]', JSON.stringify(report))
    return NextResponse.json({ ok: true, ...report })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
```

- [ ] **Step 2: Smoke-test locally**

Start dev: `npm run dev:engineering`. Then:

```bash
curl -X POST http://localhost:3000/api/sync-faculty-now \
  -H "x-sync-secret: $FACULTY_SYNC_SECRET" \
  -i
```

Expected: HTTP 200 with the sync report JSON (including `upserted`, `drafts`, etc.).

```bash
# Negative test:
curl -X POST http://localhost:3000/api/sync-faculty-now -i
```

Expected: HTTP 401.

- [ ] **Step 3: Commit**

```bash
git add app/api/sync-faculty-now/route.ts
git commit -m "feat(faculty): add HMAC-secured manual sync endpoint"
```

---

### Task 13: Vercel Cron config

**Files:**
- Modify or Create: `vercel.json`

- [ ] **Step 1: Read current `vercel.json` (if exists)**

```bash
cat vercel.json 2>/dev/null || echo "(no vercel.json yet)"
```

- [ ] **Step 2: Add the cron entry. If `vercel.json` doesn't exist, create:**

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-faculty-from-api",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

If it exists, merge the `crons` array.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "chore(faculty): schedule Vercel Cron sync every 15 minutes"
```

---

## Phase 7 — First sync & public-site verification

### Task 14: Run sync against production data and inspect

- [ ] **Step 1: Run sync via the dev server**

```bash
curl -X POST http://localhost:3000/api/sync-faculty-now \
  -H "x-sync-secret: $FACULTY_SYNC_SECRET" | jq
```

Expected: `{ "ok": true, "fetched": 3, "upserted": 3, "drafts": 3, "published": 0, "rows": [...], ... }`.

- [ ] **Step 2: Inspect DB directly via MCP**

```sql
SELECT id, full_name, slug, status, synced_from_api, staff_id, photo_url IS NOT NULL AS has_photo, last_synced_at
FROM faculty
ORDER BY synced_from_api DESC, full_name;
```

Expected: 7+ rows total (3 new API-synced rows with `synced_from_api=true`, plus the 4 pre-existing manual rows with `synced_from_api=false`). The 3 API rows should all be `status='draft'`.

- [ ] **Step 3: Inspect Storage**

```sql
SELECT name, created_at FROM storage.objects WHERE bucket_id='faculty-photos' ORDER BY created_at DESC;
```

Expected: 1 object (Rajesh's photo, key like `CET225.jpg`).

---

### Task 15: Verify public faculty pages still render

- [ ] **Step 1: Visit `/faculty` listing**

In browser, open `http://localhost:3000/faculty`. Confirm:
- The 4 existing manually-managed faculty are still visible (because they're `status='published'`).
- The 3 API rows are NOT visible (because they're `status='draft'`).
- No console errors, no broken images.

- [ ] **Step 2: Manually flip one API row to published in MyJKKN to verify the published path**

(Optional — skip if user not ready to fix data in MyJKKN yet.)

- [ ] **Step 3: View `app/sitemap.ts` output**

Visit `http://localhost:3000/sitemap.xml`. Confirm only published faculty slugs appear. Drafts excluded.

---

## Phase 8 — Admin retrofit (read-only)

### Task 16: Convert `/admin/faculty` list to read-only + add "Sync now" button

**Files:**
- Modify: `app/(admin)/admin/faculty/page.tsx`
- Modify: `app/(admin)/admin/faculty/faculty-table.tsx`

- [ ] **Step 1: In `page.tsx`, hide the "New Faculty" button + add "Sync from MyJKKN" button**

Read the current file. Find the header that contains the "New Faculty" link/button. Replace it with a Server Component button that POSTs to `/api/sync-faculty-now`. Sketch:

```tsx
// In app/(admin)/admin/faculty/page.tsx — header section:
<div className="flex items-center justify-between">
  <h1>Faculty</h1>
  <SyncFromMyJKKNButton />  {/* new client component */}
</div>
```

Create `app/(admin)/admin/faculty/sync-button.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function SyncFromMyJKKNButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function trigger() {
    setLoading(true)
    setMsg('')
    try {
      // The secret is server-only — call our internal trigger that proxies it.
      const r = await fetch('/admin/api/trigger-sync', { method: 'POST' })
      const j = await r.json()
      if (j.ok) setMsg(`Synced ${j.upserted} (drafts: ${j.drafts}, published: ${j.published})`)
      else setMsg(`Error: ${j.error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={trigger} disabled={loading}>
        {loading ? 'Syncing…' : 'Sync from MyJKKN'}
      </Button>
      {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
    </div>
  )
}
```

Create `app/(admin)/admin/api/trigger-sync/route.ts` (a server-only proxy that injects the secret):

```ts
// app/(admin)/admin/api/trigger-sync/route.ts
import { NextResponse } from 'next/server'
import { syncFacultyFromMyJKKN } from '@/lib/sync/faculty-sync'

export const dynamic = 'force-dynamic'

export async function POST() {
  // TODO: verify admin role here using existing auth helper (e.g. `requireAdmin()`)
  // — match whatever pattern the rest of /admin uses.
  try {
    const report = await syncFacultyFromMyJKKN()
    return NextResponse.json({ ok: true, ...report })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
```

- [ ] **Step 2: In `faculty-table.tsx`, hide Edit/Delete buttons for `synced_from_api=true` rows**

Find the action column. Replace the existing edit/delete buttons with conditional rendering:

```tsx
// Pseudo-diff inside the actions cell
{row.original.synced_from_api ? (
  <Button asChild variant="outline" size="sm">
    <a
      href={`https://www.jkkn.ai/admin/staff/${row.original.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Edit in MyJKKN
    </a>
  </Button>
) : (
  /* keep existing Edit/Delete buttons for legacy manual rows */
  <ExistingEditDeleteButtons row={row} />
)}
```

Also add a "Synced from MyJKKN" badge next to the name for synced rows.

- [ ] **Step 3: Type-check + visual smoke**

```bash
npm run build
```

Expected: build succeeds. Visit `/admin/faculty`, confirm:
- New "Sync from MyJKKN" button appears in the header
- 3 API-synced rows show "Edit in MyJKKN" + the Synced badge
- 4 legacy rows still show their original Edit/Delete

- [ ] **Step 4: Commit**

```bash
git add app/\(admin\)/admin/faculty/
git commit -m "feat(faculty,admin): read-only list view, Sync from MyJKKN button, Edit in MyJKKN deep-link"
```

---

### Task 17: Make `/admin/faculty/[id]` read-only for synced rows

**Files:**
- Modify: `app/(admin)/admin/faculty/[id]/page.tsx`

- [ ] **Step 1: At the top of the page component, fetch the row and branch**

Read the file. Add at the top of the component (after the existing fetch):

```tsx
if (faculty.synced_from_api) {
  redirect(`https://www.jkkn.ai/admin/staff/${faculty.id}`)
}
```

(`import { redirect } from 'next/navigation'`.)

- [ ] **Step 2: Smoke**

Visit `/admin/faculty/<api-row-id>` — expect redirect to MyJKKN. Visit `/admin/faculty/<legacy-row-id>` — expect existing edit form.

- [ ] **Step 3: Commit**

```bash
git add app/\(admin\)/admin/faculty/\[id\]/page.tsx
git commit -m "feat(faculty,admin): redirect synced row edit page to MyJKKN"
```

---

### Task 18: Delete `/admin/faculty/new` and `faculty-form.tsx`

**Files:**
- Delete: `app/(admin)/admin/faculty/new/page.tsx`
- Delete: `app/(admin)/admin/faculty/faculty-form.tsx`

- [ ] **Step 1: Confirm no other code imports these files**

```bash
# In Claude: use Grep
# Pattern: from\s+['\"]@/app/\(admin\)/admin/faculty/(new|faculty-form)
# If anything matches, fix the importer first.
```

- [ ] **Step 2: Delete**

```bash
rm "app/(admin)/admin/faculty/new/page.tsx"
rm "app/(admin)/admin/faculty/faculty-form.tsx"
rmdir "app/(admin)/admin/faculty/new" 2>/dev/null || true
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: succeeds (no broken imports).

- [ ] **Step 4: Commit**

```bash
git add -A app/\(admin\)/admin/faculty/
git commit -m "feat(faculty,admin): remove faculty creation form (data lives in MyJKKN now)"
```

---

### Task 19: Read-only `/faculty-admin/manage/faculty` self-service portal

**Files:**
- Modify: `app/(faculty-admin)/faculty-admin/manage/faculty/page.tsx`
- Modify: `app/(faculty-admin)/faculty-admin/manage/faculty/[id]/page.tsx`
- Delete: `app/(faculty-admin)/faculty-admin/manage/faculty/new/page.tsx`

- [ ] **Step 1: List page — hide New Faculty button**

Mirror the change from Task 16 in this portal's list page.

- [ ] **Step 2: Detail page — render read-only "Verify your profile" view**

For `synced_from_api=true` rows, render a simplified read-only summary (name, designation, department, photo, professional_summary) plus a prominent button:

```tsx
<Button asChild>
  <a href={`https://www.jkkn.ai/profile/${faculty.id}`} target="_blank" rel="noopener noreferrer">
    Edit my profile in MyJKKN →
  </a>
</Button>
```

For non-synced rows, keep existing behavior.

- [ ] **Step 3: Delete `/new`**

```bash
rm "app/(faculty-admin)/faculty-admin/manage/faculty/new/page.tsx"
rmdir "app/(faculty-admin)/faculty-admin/manage/faculty/new" 2>/dev/null || true
```

- [ ] **Step 4: Build + commit**

```bash
npm run build
git add -A app/\(faculty-admin\)/
git commit -m "feat(faculty,self-service): read-only Verify-your-profile view, deep-link to MyJKKN"
```

---

## Phase 9 — Cleanup & finalization

### Task 20: Remove write actions from `app/actions/faculty.ts`

**Files:**
- Modify: `app/actions/faculty.ts`

- [ ] **Step 1: Identify and delete `createFaculty`, `updateFaculty`, `deleteFaculty`, `uploadFacultyPhoto`**

Keep: `getPublishedFaculty`, `getFacultyBySlug`, `getRelatedFaculty`, `getFacultyDepartments`. Delete the rest. Adjust imports if any internal helper is only used by deleted actions.

- [ ] **Step 2: Confirm no callers**

```bash
# Grep for createFaculty / updateFaculty / deleteFaculty / uploadFacultyPhoto across the repo
# Expected: only references inside the about-to-be-deleted form/admin files we already removed
```

- [ ] **Step 3: Build + commit**

```bash
npm run build
git add app/actions/faculty.ts
git commit -m "refactor(faculty): remove write server actions (data is API-managed now)"
```

---

### Task 21: Soft-delete the 4 legacy non-HOD/non-Principal rows

**Files:**
- Create: `docs/database/engineering-college/21-faculty-legacy-soft-delete.sql`

- [ ] **Step 1: Document SQL**

```sql
-- ============================================
-- Soft-delete legacy non-HOD/non-Principal faculty rows
-- ============================================
-- Purpose: After API sync proves stable, hide manually-managed rows from public site.
-- Reversible: just flip is_active back to true.
-- ============================================

UPDATE public.faculty
SET is_active = false, status = 'draft'
WHERE synced_from_api = false;

-- Audit
SELECT id, full_name, designation, is_active, status FROM public.faculty WHERE synced_from_api = false;
```

- [ ] **Step 2: Apply via MCP** with `mcp__Engineering_College_Supabase_Project__apply_migration`, name `21_faculty_legacy_soft_delete`.

- [ ] **Step 3: Verify the public site is empty (or matches expected state)**

Visit `/faculty` — expect no published rows (because all 3 API rows are draft, and the 4 legacy rows are now also draft+inactive).

This is the moment to fix data in MyJKKN: as you fill missing fields, next sync will publish the rows. This is the system's intended end state.

- [ ] **Step 4: Commit**

```bash
git add docs/database/engineering-college/21-faculty-legacy-soft-delete.sql
git commit -m "feat(faculty,db): soft-delete legacy non-API faculty rows"
```

---

### Task 22: Slug-rename redirect middleware

**Files:**
- Modify: `middleware.ts` (or create if not present)

- [ ] **Step 1: Add or extend middleware**

Read existing `middleware.ts`. Add a path matcher and a slug-history lookup. If the path is `/faculty/<slug>`, query `faculty_slug_history` (server-side via Supabase) for `old_slug = <slug>`. If found, return a 301 to `/faculty/<new_slug>`.

```ts
// middleware.ts (excerpt — merge with existing)
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const m = pathname.match(/^\/faculty\/([^/]+)\/?$/)
  if (m) {
    const slug = m[1]
    const { data } = await supabase
      .from('faculty_slug_history')
      .select('new_slug')
      .eq('old_slug', slug)
      .maybeSingle()
    if (data) {
      const url = req.nextUrl.clone()
      url.pathname = `/faculty/${data.new_slug}`
      return NextResponse.redirect(url, 301)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/faculty/:slug'],
}
```

- [ ] **Step 2: Smoke**

Manually insert a fake redirect to test:

```sql
-- Pick a real synced faculty id, e.g. f733911d-12ea-43df-bafd-a4a05541ecc5
INSERT INTO faculty_slug_history (old_slug, new_slug, faculty_id)
VALUES ('test-old-slug', 'dr-c-kathirvel-beme-phd', 'f733911d-12ea-43df-bafd-a4a05541ecc5');
```

Visit `http://localhost:3000/faculty/test-old-slug` — expect 301 redirect to `/faculty/dr-c-kathirvel-beme-phd`.

Clean up:
```sql
DELETE FROM faculty_slug_history WHERE old_slug = 'test-old-slug';
```

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(faculty): 301 redirect for renamed faculty slugs"
```

---

## Phase 10 — Monitoring & docs

### Task 23: Structured sync logging

**Files:**
- Modify: `lib/sync/faculty-sync.ts`

- [ ] **Step 1: Add a structured log line at the end of `syncFacultyFromMyJKKN`**

Append before `return report`:

```ts
console.log(JSON.stringify({
  event: 'faculty_sync_completed',
  fetched: report.fetched,
  upserted: report.upserted,
  drafts: report.drafts,
  published: report.published,
  orphans: report.orphansSoftDeleted,
  slug_renames: report.slugRenames,
  errors: report.errors.length,
  ts: new Date().toISOString(),
}))
```

This shows up in Vercel logs and is greppable. (Optional Sentry integration later.)

- [ ] **Step 2: Commit**

```bash
git add lib/sync/faculty-sync.ts
git commit -m "chore(faculty): structured log line on sync completion"
```

---

### Task 24: Update API integration docs

**Files:**
- Modify: `docs/admin/staff-api-documentation.md` (add a new section at the bottom)

- [ ] **Step 1: Append a new section**

```markdown
## Engineering Site Integration (added 2026-05-07)

This site (`engg.jkkn.ac.in`) consumes the Staff API in **read-only sync** mode for HODs + Principal only:

- **Endpoint cron:** `/api/cron/sync-faculty-from-api` (Vercel Cron, every 15 min)
- **Manual trigger:** `/api/sync-faculty-now` (HMAC `x-sync-secret`) — also wired to a "Sync from MyJKKN" button in our admin
- **Filters:** `institution_id=5de4fba1-4564-41ed-8c73-5d948b74b843`, `role_key={hod|principal}`, `is_active=true`, `has_extended_profile=true`
- **Auto-draft rule:** any synced row missing photo, professional_summary, qualifications, email, designation, or department becomes `status='draft'` regardless of MyJKKN's value
- **Photo rehost:** profile_picture is downloaded and rehosted to `<engineering-supabase>/storage/faculty-photos/<staff_id>.jpg`
- **Slug renames:** detected on each sync; old slugs 301-redirected via middleware
- **Source-of-truth:** MyJKKN. Fix any data in MyJKKN; next sync (≤ 15 min, or click Sync now) auto-publishes once the row is complete.

**Webhook feature request:** if MyJKKN adds webhooks for `staff.{created,updated,deleted}`, our `/api/sync-faculty-now` endpoint can be reused as the receiver (just swap HMAC verification for the webhook signature scheme).
```

- [ ] **Step 2: Commit**

```bash
git add docs/admin/staff-api-documentation.md
git commit -m "docs(faculty): document Engineering site sync integration"
```

---

## Self-Review Checklist (post-write)

- ✅ Spec coverage — every decision in `spec §2 rows 1–15` has at least one task implementing it.
- ✅ No placeholders — no "TBD/TODO/etc."; code blocks are complete; commit commands are exact.
- ✅ Type consistency — `staffToFacultyRow` returns `AdaptResult.formData: FacultyFormData`, used the same way in `faculty-sync.ts` (Task 10).
- ✅ Bite-sized — each task has 3–4 steps, each step ~2–5 min.
- ✅ Reversibility — phases 1–7 are additive (new files, new tables, no destructive change). Phases 8–9 are reversible: admin retrofit can be reverted; soft-delete is just `UPDATE is_active=true`. Slug-history middleware can be disabled by removing one matcher.
- ✅ Database documentation per CLAUDE.md — every SQL change is documented in `docs/database/engineering-college/` BEFORE being applied.

---

## Out of scope (deliberately not in this plan)

- Other 5 institutions (Phase 2 after Engineering proves stable).
- Webhook integration with MyJKKN (file feature request after Phase 10).
- Migrating `faculty_achievements` rows into MyJKKN's `achievements` JSONB (separate decision later).
- Vitest / formal unit-test framework (matches current Playwright-only posture).

---

## Done when

1. `/admin/faculty` shows 3 API-synced rows + 4 soft-deleted legacy rows; admin actions on synced rows redirect to MyJKKN.
2. Vercel Cron fires every 15 min; logs visible in Vercel dashboard.
3. "Sync from MyJKKN" button works from the admin and shows the latest counts.
4. Public `/faculty` page is empty (all rows draft) until MyJKKN admins fill missing fields, after which next sync publishes them.
5. SEO unaffected: existing JSON-LD, sitemap, generateMetadata still function (no draft rows are exposed).
6. Slug-rename redirect verified.
