# Public Careers Pages (website consumer) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the CVViz iframe on `/careers` with native listing, detail and apply pages that read public jobs from the MyJKKN Public Careers API and post applications straight from the applicant's browser.

**Architecture:** Two server-rendered pages (`/careers`, `/careers/[id]`) fetch from MyJKKN with `next: { revalidate: 300 }` through one server-only client (`lib/services/public-careers-api.ts`, Zod-validated). One client component (`apply-form.tsx`) posts `multipart/form-data` to MyJKKN using a browser-safe module (`lib/services/public-careers-apply.ts`) that maps every documented status code to a typed result. No Supabase, no Server Actions, no API key — the API is the trust boundary.

**Tech Stack:** Next.js 16 App Router (`cacheComponents: false`), React 19, Zod 4, React Hook Form + `@hookform/resolvers`, Tailwind v4 with JKKN semantic tokens, Vitest (new devDependency), JSON-LD `JobPosting`.

**Spec:** `D:\Sangeetha_V\MyJKKN\docs\superpowers\specs\2026-09-21-public-careers-api-design.md` (API design) and `D:\Sangeetha_V\MyJKKN\.claude\worktrees\public-careers\docs\public-careers-api.md` (contract for this website). Analysis of the API-side plan: this repo is "the website team"; the API is complete on MyJKKN branch `feat/public-careers-api` (unmerged as of 2026-09-22).

## Global Constraints

- API base: `NEXT_PUBLIC_MYJKKN_URL` (default `https://www.jkkn.ai`), no trailing slash. Endpoints: `GET /api/public/careers/jobs`, `GET /api/public/careers/jobs/{id}`, `POST /api/public/careers/jobs/{id}/apply`.
- The apply `POST` runs in the **browser only** (the API rate-limits 5 applications / IP / hour; a server-side call would share one IP for all applicants). This is a deliberate exception to the project's "mutations via Server Actions" rule — comment it at the call site.
- Never set `Content-Type` on the apply request; the browser adds the multipart boundary.
- Per-college scoping: `MYJKKN_INSTITUTION_ID` (server env, MyJKKN `institutions.id` uuid) filters the listing; empty/unset (main site) shows all jobs with an institution filter.
- Field names sent must match the API table exactly: `first_name, last_name, email, phone, qualification, experience_months, current_job_title, current_company, current_job_duration_months, worked_cities, resume, consent ("true"), utm_source, website` (honeypot — rendered hidden, always empty).
- Resume client pre-check: ≤ 2 MB (`2 * 1024 * 1024`), extension `.pdf/.doc/.docx`. The API re-checks by magic bytes; the client check is UX only.
- Status mapping: `201 → success(reference)`, `400 → fields`, `403 → origin`, `404 → not_found`, `409 → duplicate`, `429 → rate_limited`, `503 → unavailable`, anything else → `error`.
- Listing/detail fetches use `next: { revalidate: 300 }` (matches the API's `s-maxage=300`). Detail 404 → `notFound()`.
- Styling: JKKN semantic tokens only (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary`, `border-border`, `font-sans`). No brand hex in TSX. Poppins is already global.
- Feature flag `careers` already exists; `lib/utils/navigation-filter.ts` hides `/careers` when it is off. No flag code in this plan.
- The published CMS page `cms_pages.slug = 'careers'` (MORE menu, CVViz iframe) stays in the DB; the coded route shadows `[...slug]`, so nav + sitemap keep working with no DB change.
- Work on branch `feat/public-careers-pages` in a worktree. `master` has unrelated uncommitted edits — do not touch them.
- Unit tests: `npx vitest run <path>`. Build check: `npm run build` (also runs `tsc`).

## File Map

| File | Status | Responsibility |
|---|---|---|
| `vitest.config.ts`, `package.json` | create / modify | Vitest runner with `@/` alias; `test:unit` script |
| `lib/schemas/public-careers.ts` | create | Zod schemas + types for `PublicJob`, list/detail envelopes, `JOB_TYPES` |
| `lib/utils/careers-format.ts` | create | Pure display formatters (job type, experience, salary, location, dates) |
| `lib/services/public-careers-api.ts` | create | Server-only client: `listPublicJobs`, `getPublicJob`, env readers |
| `lib/services/public-careers-apply.ts` | create | Browser-safe: `buildApplyFormData`, `submitApplication`, `ApplyResult` |
| `components/public/careers/job-card.tsx` | create | One job in the listing |
| `components/public/careers/job-filters.tsx` | create | Client: search / job type / institution chips → URL search params |
| `components/public/careers/job-list.tsx` | create | Server: list + empty state |
| `components/public/careers/careers-unavailable.tsx` | create | Friendly state when MyJKKN is unreachable |
| `components/public/careers/job-detail.tsx` | create | Detail body (description, requirements, meta) |
| `components/public/careers/apply-form.tsx` | create | Client: RHF + Zod form, honeypot, resume input, result panel |
| `components/seo/job-posting-schema.tsx` | create | `JobPosting` JSON-LD for Google Jobs |
| `app/(public)/careers/page.tsx` | create | Listing page (`searchParams`) |
| `app/(public)/careers/[id]/page.tsx` | create | Detail + apply page, `generateMetadata`, `notFound()` |
| `components/public/resume-file-upload.tsx` | delete | Orphan from the removed 2026-01 careers module (uploads to a dropped bucket) |
| `.env.example`, `scripts/switch-institution.ts` | modify | Document `NEXT_PUBLIC_MYJKKN_URL`, `MYJKKN_INSTITUTION_ID` (sidecar `.env.<id>.jkkn-api`) |
| `docs/PUBLIC-CAREERS-INTEGRATION.md` | create | How the pages work, env per institution, MyJKKN prerequisites |
| `__tests__/careers/*.test.ts` | create | Unit tests |

---

### Task 0: Worktree + Vitest

**Files:** Create `vitest.config.ts`; Modify `package.json` (devDependencies, scripts); Test `__tests__/careers/smoke.test.ts`

- [ ] **Step 1:** Use superpowers:using-git-worktrees to create worktree `.claude/worktrees/public-careers-pages` on new branch `feat/public-careers-pages` from `master`.
- [ ] **Step 2:** Copy this plan into the worktree at `docs/superpowers/plans/2026-09-22-public-careers-pages.md` and commit: `git add docs/superpowers/plans/2026-09-22-public-careers-pages.md && git commit -m "docs(careers): public careers pages plan"`.
- [ ] **Step 3:** Install vitest: `npm install -D vitest` (Node 24 provides `File`/`FormData`/`fetch` globally; no jsdom needed).
- [ ] **Step 4:** Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Unit tests only. Playwright (tests/e2e) stays on `npm run test`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname) },
  },
})
```

- [ ] **Step 5:** Add script to `package.json` `"scripts"`: `"test:unit": "vitest run"`.
- [ ] **Step 6:** Create `__tests__/careers/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

describe('vitest wiring', () => {
  it('resolves the @ alias and runs', async () => {
    const mod = await import('@/lib/utils')
    expect(typeof mod.cn).toBe('function')
  })
})
```

- [ ] **Step 7:** Run `npx vitest run __tests__/careers/smoke.test.ts` → PASS.
- [ ] **Step 8:** Commit: `git add vitest.config.ts package.json package-lock.json __tests__/careers/smoke.test.ts && git commit -m "test: add vitest for unit tests"`.

---

### Task 1: Schemas + display formatters

**Files:** Create `lib/schemas/public-careers.ts`, `lib/utils/careers-format.ts`; Test `__tests__/careers/careers-format.test.ts`

**Interfaces — Produces:**
```ts
// lib/schemas/public-careers.ts
export const JOB_TYPES: readonly ['full_time','part_time','contract','internship','freelance']
export type JobType
export const PublicJobSchema; export type PublicJob
export const InstitutionFacetSchema; export type InstitutionFacet
export const JobListResponseSchema; export type JobListResponse   // { data: PublicJob[]; institutions: InstitutionFacet[] }
export const JobDetailResponseSchema                                 // { data: PublicJob }
// lib/utils/careers-format.ts
export function formatJobType(t: string | null): string
export function formatRoleCategory(c: string): string
export function formatExperience(min: number | null, max: number | null): string
export function formatSalary(s: PublicJob['salary']): string | null
export function formatLocation(j: Pick<PublicJob,'city'|'state'|'country'>): string
export function formatDate(iso: string | null): string | null
export function daysUntil(iso: string | null, now?: Date): number | null
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import {
  daysUntil, formatDate, formatExperience, formatJobType, formatLocation, formatRoleCategory, formatSalary,
} from '@/lib/utils/careers-format'

describe('careers-format', () => {
  it('formats job type and role category from snake_case', () => {
    expect(formatJobType('full_time')).toBe('Full-time')
    expect(formatJobType('part_time')).toBe('Part-time')
    expect(formatJobType('contract')).toBe('Contract')
    expect(formatJobType(null)).toBe('')
    expect(formatRoleCategory('teaching_faculty')).toBe('Teaching Faculty')
    expect(formatRoleCategory('non_teaching')).toBe('Non Teaching')
  })

  it('formats experience ranges', () => {
    expect(formatExperience(null, null)).toBe('')
    expect(formatExperience(0, null)).toBe('Freshers welcome')
    expect(formatExperience(2, null)).toBe('2+ years')
    expect(formatExperience(1, 5)).toBe('1–5 years')
    expect(formatExperience(3, 3)).toBe('3 years')
    expect(formatExperience(null, 4)).toBe('Up to 4 years')
  })

  it('formats salary or returns null', () => {
    expect(formatSalary(null)).toBeNull()
    expect(formatSalary({ min: 30000, max: 50000, currency: 'INR', duration: 'per_month' })).toBe('₹30,000 – ₹50,000 per month')
    expect(formatSalary({ min: 30000, max: null, currency: 'INR', duration: 'per_month' })).toBe('₹30,000+ per month')
    expect(formatSalary({ min: null, max: null, currency: 'INR', duration: 'per_month' })).toBeNull()
    expect(formatSalary({ min: 1000, max: 2000, currency: 'USD', duration: 'per_year' })).toBe('USD 1,000 – USD 2,000 per year')
  })

  it('formats location from available parts', () => {
    expect(formatLocation({ city: 'Komarapalayam', state: 'Tamil Nadu', country: 'India' })).toBe('Komarapalayam, Tamil Nadu')
    expect(formatLocation({ city: null, state: 'Tamil Nadu', country: 'India' })).toBe('Tamil Nadu')
    expect(formatLocation({ city: null, state: null, country: null })).toBe('')
  })

  it('formats dates and days-until', () => {
    expect(formatDate('2026-09-01T00:00:00Z')).toBe('1 Sept 2026')
    expect(formatDate(null)).toBeNull()
    expect(daysUntil('2026-09-25T00:00:00Z', new Date('2026-09-22T10:00:00Z'))).toBe(3)
    expect(daysUntil(null)).toBeNull()
  })
})
```

- [ ] **Step 2:** `npx vitest run __tests__/careers/careers-format.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement `lib/schemas/public-careers.ts`**

```ts
// lib/schemas/public-careers.ts
//
// Zod schemas mirroring the MyJKKN Public Careers API (contract:
// MyJKKN docs/public-careers-api.md). `.passthrough()` tolerates new fields the
// API may add later; missing/renamed fields still fail loudly at the boundary.

import { z } from 'zod'

export const JOB_TYPES = ['full_time', 'part_time', 'contract', 'internship', 'freelance'] as const
export type JobType = (typeof JOB_TYPES)[number]

const NamedRefSchema = z.object({ id: z.string(), name: z.string() }).passthrough()

export const PublicJobSchema = z.object({
  id: z.string(),
  job_code: z.string().nullable(),
  title: z.string(),
  role_category: z.string(),
  job_type: z.string().nullable(),
  description: z.string().nullable(),
  institution: NamedRefSchema.nullable(),
  department: NamedRefSchema.nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  education_level: z.string().nullable(),
  min_experience_years: z.number().nullable(),
  max_experience_years: z.number().nullable(),
  qualifications: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  positions_open: z.number(),
  posted_at: z.string().nullable(),
  closes_at: z.string().nullable(),
  salary: z
    .object({
      min: z.number().nullable(),
      max: z.number().nullable(),
      currency: z.string(),
      duration: z.string(),
    })
    .nullable(),
}).passthrough()
export type PublicJob = z.infer<typeof PublicJobSchema>

export const InstitutionFacetSchema = z.object({
  id: z.string(),
  name: z.string(),
  open_jobs: z.number(),
}).passthrough()
export type InstitutionFacet = z.infer<typeof InstitutionFacetSchema>

export const JobListResponseSchema = z.object({
  data: z.array(PublicJobSchema),
  institutions: z.array(InstitutionFacetSchema).default([]),
})
export type JobListResponse = z.infer<typeof JobListResponseSchema>

export const JobDetailResponseSchema = z.object({ data: PublicJobSchema })
```

- [ ] **Step 4: Implement `lib/utils/careers-format.ts`**

```ts
// lib/utils/careers-format.ts
//
// Pure display helpers for the public careers pages. No React, no env —
// safe to import from server and client components and trivially unit-tested.

import type { PublicJob } from '@/lib/schemas/public-careers'

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
}

const titleCase = (s: string) =>
  s.split('_').filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

export function formatJobType(t: string | null): string {
  if (!t) return ''
  return JOB_TYPE_LABELS[t] ?? titleCase(t)
}

export function formatRoleCategory(c: string): string {
  return titleCase(c)
}

export function formatExperience(min: number | null, max: number | null): string {
  if (min === null && max === null) return ''
  if (min !== null && max !== null) return min === max ? `${min} years` : `${min}–${max} years`
  if (min !== null) return min === 0 ? 'Freshers welcome' : `${min}+ years`
  return `Up to ${max} years`
}

const DURATION_LABELS: Record<string, string> = {
  per_month: 'per month',
  per_year: 'per year',
  per_annum: 'per year',
  per_hour: 'per hour',
  per_day: 'per day',
}

function money(amount: number, currency: string): string {
  const n = amount.toLocaleString('en-IN')
  return currency === 'INR' ? `₹${n}` : `${currency} ${n}`
}

export function formatSalary(s: PublicJob['salary']): string | null {
  if (!s || (s.min === null && s.max === null)) return null
  const duration = DURATION_LABELS[s.duration] ?? s.duration.replace(/_/g, ' ')
  if (s.min !== null && s.max !== null) return `${money(s.min, s.currency)} – ${money(s.max, s.currency)} ${duration}`
  if (s.min !== null) return `${money(s.min, s.currency)}+ ${duration}`
  return `Up to ${money(s.max as number, s.currency)} ${duration}`
}

/** City + state; country is implied for an Indian institution group. */
export function formatLocation(j: Pick<PublicJob, 'city' | 'state' | 'country'>): string {
  return [j.city, j.state].filter(Boolean).join(', ')
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
}

export function daysUntil(iso: string | null, now: Date = new Date()): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return null
  return Math.ceil((t - now.getTime()) / 86_400_000)
}
```

- [ ] **Step 5:** Re-run → PASS. (If `formatDate` yields `1 Sep 2026` on this Node ICU, change the test expectation to whatever `en-GB` short month prints — the assertion is about wiring, not ICU.)
- [ ] **Step 6: Commit** `git add lib/schemas/public-careers.ts lib/utils/careers-format.ts __tests__/careers/careers-format.test.ts && git commit -m "feat(careers): public job schema + display formatters"`

---

### Task 2: Server-only API client

**Files:** Create `lib/services/public-careers-api.ts`; Test `__tests__/careers/public-careers-api.test.ts`

**Interfaces:**
- Consumes: `JobListResponseSchema`, `JobDetailResponseSchema`, `JOB_TYPES`, types (Task 1).
- Produces:
```ts
export function getMyJkknBaseUrl(): string                       // NEXT_PUBLIC_MYJKKN_URL ?? 'https://www.jkkn.ai', no trailing slash
export function getCareersInstitutionId(): string | null        // MYJKKN_INSTITUTION_ID or null
export function isUuid(v: string): boolean
export interface JobListFilters { q?: string | null; jobType?: string | null; institutionId?: string | null }
export async function listPublicJobs(filters?: JobListFilters, fetchImpl?: typeof fetch): Promise<JobListResponse>
export async function getPublicJob(id: string, fetchImpl?: typeof fetch): Promise<PublicJob | null>
```

- [ ] **Step 1: Write the failing test**

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMyJkknBaseUrl, getPublicJob, isUuid, listPublicJobs } from '@/lib/services/public-careers-api'

const JOB_ID = '11111111-1111-4111-8111-111111111111'
const JOB = {
  id: JOB_ID, job_code: 'JOB-007', title: 'Lab Assistant', role_category: 'non_teaching', job_type: 'full_time',
  description: 'Run the lab.', institution: { id: 'i1', name: 'JKKN College of Pharmacy' }, department: null,
  city: 'Komarapalayam', state: 'Tamil Nadu', country: 'India', education_level: 'bachelors',
  min_experience_years: 1, max_experience_years: 3, qualifications: ['B.Pharm'], skills: [],
  positions_open: 1, posted_at: '2026-09-01T00:00:00Z', closes_at: null, salary: null,
}

function fetchStub(status: number, body: unknown) {
  const calls: string[] = []
  const impl = vi.fn(async (input: RequestInfo | URL) => {
    calls.push(String(input))
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
  }) as unknown as typeof fetch
  return { impl, calls }
}

afterEach(() => {
  delete process.env.NEXT_PUBLIC_MYJKKN_URL
  delete process.env.MYJKKN_INSTITUTION_ID
})

describe('getMyJkknBaseUrl', () => {
  it('defaults and strips a trailing slash', () => {
    expect(getMyJkknBaseUrl()).toBe('https://www.jkkn.ai')
    process.env.NEXT_PUBLIC_MYJKKN_URL = 'http://localhost:4000/'
    expect(getMyJkknBaseUrl()).toBe('http://localhost:4000')
  })
})

describe('isUuid', () => {
  it('validates', () => {
    expect(isUuid(JOB_ID)).toBe(true)
    expect(isUuid('nope')).toBe(false)
  })
})

describe('listPublicJobs', () => {
  it('builds the query string from filters and parses the envelope', async () => {
    const { impl, calls } = fetchStub(200, { data: [JOB], institutions: [{ id: 'i1', name: 'X', open_jobs: 1 }] })
    const res = await listPublicJobs({ q: 'lab', jobType: 'full_time', institutionId: 'i1' }, impl)
    expect(res.data[0].title).toBe('Lab Assistant')
    expect(res.institutions[0].open_jobs).toBe(1)
    const url = new URL(calls[0])
    expect(url.pathname).toBe('/api/public/careers/jobs')
    expect(url.searchParams.get('q')).toBe('lab')
    expect(url.searchParams.get('job_type')).toBe('full_time')
    expect(url.searchParams.get('institution_id')).toBe('i1')
  })
  it('drops unknown job types and blank filters', async () => {
    const { impl, calls } = fetchStub(200, { data: [], institutions: [] })
    await listPublicJobs({ q: '  ', jobType: 'evil', institutionId: '' }, impl)
    expect(new URL(calls[0]).search).toBe('')
  })
  it('throws on a non-2xx response', async () => {
    const { impl } = fetchStub(500, { error: 'boom' })
    await expect(listPublicJobs({}, impl)).rejects.toThrow(/500/)
  })
})

describe('getPublicJob', () => {
  it('returns null for a malformed id without fetching', async () => {
    const { impl } = fetchStub(200, { data: JOB })
    expect(await getPublicJob('x', impl)).toBeNull()
    expect(impl).not.toHaveBeenCalled()
  })
  it('returns null on 404', async () => {
    const { impl } = fetchStub(404, { error: 'Job not found.' })
    expect(await getPublicJob(JOB_ID, impl)).toBeNull()
  })
  it('returns the parsed job on 200', async () => {
    const { impl } = fetchStub(200, { data: JOB })
    expect((await getPublicJob(JOB_ID, impl))?.job_code).toBe('JOB-007')
  })
})
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implement**

```ts
// lib/services/public-careers-api.ts
//
// Single network boundary to the MyJKKN Public Careers API (read side).
// Server-only — import from Server Components / route handlers, never from a
// 'use client' file (the browser-side apply lives in public-careers-apply.ts).
//
// No auth: the endpoints are public by design (MyJKKN whitelists columns and
// only returns jobs HR marked "Show on website"). Responses are cached by
// Next's data cache for 300s, matching the API's own s-maxage.
// Contract: MyJKKN docs/public-careers-api.md

import {
  JobDetailResponseSchema,
  JobListResponseSchema,
  JOB_TYPES,
  type JobListResponse,
  type PublicJob,
} from '@/lib/schemas/public-careers'

const DEFAULT_BASE = 'https://www.jkkn.ai'
const REVALIDATE_SECONDS = 300

// Env reads are function-level so the module is safe to import in tests/CLIs.
export function getMyJkknBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_MYJKKN_URL || DEFAULT_BASE).replace(/\/+$/, '')
}

/** MyJKKN institutions.id for this deployment; null = show every college (main site). */
export function getCareersInstitutionId(): string | null {
  const v = process.env.MYJKKN_INSTITUTION_ID?.trim()
  return v ? v : null
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const isUuid = (v: string): boolean => UUID_RE.test(v)

export interface JobListFilters {
  q?: string | null
  jobType?: string | null
  institutionId?: string | null
}

async function getJson(url: string, fetchImpl: typeof fetch): Promise<{ status: number; body: unknown }> {
  const res = await fetchImpl(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (res.status === 404) return { status: 404, body: null }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`[public-careers] ${res.status} ${res.statusText} — ${text.slice(0, 200)}`)
  }
  return { status: res.status, body: await res.json() }
}

export async function listPublicJobs(
  filters: JobListFilters = {},
  fetchImpl: typeof fetch = fetch,
): Promise<JobListResponse> {
  const url = new URL(`${getMyJkknBaseUrl()}/api/public/careers/jobs`)
  const q = filters.q?.trim().slice(0, 100)
  if (q) url.searchParams.set('q', q)
  if (filters.jobType && (JOB_TYPES as readonly string[]).includes(filters.jobType)) {
    url.searchParams.set('job_type', filters.jobType)
  }
  if (filters.institutionId && isUuid(filters.institutionId)) {
    url.searchParams.set('institution_id', filters.institutionId)
  }
  const { body } = await getJson(url.toString(), fetchImpl)
  return JobListResponseSchema.parse(body)
}

export async function getPublicJob(id: string, fetchImpl: typeof fetch = fetch): Promise<PublicJob | null> {
  if (!isUuid(id)) return null
  const { status, body } = await getJson(`${getMyJkknBaseUrl()}/api/public/careers/jobs/${id}`, fetchImpl)
  if (status === 404) return null
  return JobDetailResponseSchema.parse(body).data
}
```

- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git add lib/services/public-careers-api.ts __tests__/careers/public-careers-api.test.ts && git commit -m "feat(careers): server client for MyJKKN public careers API"`

---

### Task 3: Browser-side apply client

**Files:** Create `lib/services/public-careers-apply.ts`; Test `__tests__/careers/public-careers-apply.test.ts`

**Interfaces — Produces:**
```ts
export const MAX_RESUME_BYTES = 2 * 1024 * 1024
export const RESUME_EXTENSIONS: readonly ['pdf','doc','docx']
export function resumeClientError(file: File | null | undefined): string | null
export interface ApplyValues {
  first_name: string; last_name: string; email: string; phone: string; qualification: string;
  experience_months: number; current_job_title?: string; current_company?: string;
  current_job_duration_months?: number | null; worked_cities?: string; consent: boolean;
  utm_source?: string; website?: string; resume: File
}
export function buildApplyFormData(v: ApplyValues): FormData
export type ApplyFailureKind = 'validation' | 'origin' | 'not_found' | 'duplicate' | 'rate_limited' | 'unavailable' | 'error'
export type ApplyResult =
  | { ok: true; reference: string }
  | { ok: false; kind: ApplyFailureKind; message: string; fields: Record<string, string> }
export async function submitApplication(baseUrl: string, jobId: string, fd: FormData, fetchImpl?: typeof fetch): Promise<ApplyResult>
```

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from 'vitest'
import {
  buildApplyFormData, MAX_RESUME_BYTES, resumeClientError, submitApplication,
} from '@/lib/services/public-careers-apply'

const PDF = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], 'cv.pdf', { type: 'application/pdf' })
const VALUES = {
  first_name: 'Priya', last_name: 'R', email: 'priya@example.com', phone: '9876543210',
  qualification: 'M.Pharm', experience_months: 24, consent: true, resume: PDF,
  current_job_title: '', worked_cities: 'Salem, Erode', utm_source: 'jkkn.ac.in',
}

function fetchStub(status: number, body: unknown) {
  const seen: { url: string; init?: RequestInit }[] = []
  const impl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    seen.push({ url: String(input), init })
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
  }) as unknown as typeof fetch
  return { impl, seen }
}

describe('resumeClientError', () => {
  it('accepts pdf/doc/docx under 2 MB', () => {
    expect(resumeClientError(PDF)).toBeNull()
    expect(resumeClientError(new File(['x'], 'cv.DOCX'))).toBeNull()
  })
  it('rejects missing, oversize and wrong extensions', () => {
    expect(resumeClientError(null)).toMatch(/attach/i)
    expect(resumeClientError(new File([new Uint8Array(MAX_RESUME_BYTES + 1)], 'cv.pdf'))).toMatch(/2 MB/)
    expect(resumeClientError(new File(['x'], 'cv.exe'))).toMatch(/PDF, DOC or DOCX/)
  })
})

describe('buildApplyFormData', () => {
  it('uses the exact API field names and stringifies consent/numbers', () => {
    const fd = buildApplyFormData(VALUES)
    expect(fd.get('first_name')).toBe('Priya')
    expect(fd.get('experience_months')).toBe('24')
    expect(fd.get('consent')).toBe('true')
    expect(fd.get('worked_cities')).toBe('Salem, Erode')
    expect(fd.get('utm_source')).toBe('jkkn.ac.in')
    expect((fd.get('resume') as File).name).toBe('cv.pdf')
    expect(fd.get('website')).toBe('')          // honeypot always present, always empty
    expect(fd.has('current_job_title')).toBe(false) // blanks are omitted
  })
})

describe('submitApplication', () => {
  const JOB = '11111111-1111-4111-8111-111111111111'

  it('posts multipart without a manual Content-Type and returns the reference', async () => {
    const { impl, seen } = fetchStub(201, { reference: 'JOB-007-AB12CD34' })
    const r = await submitApplication('https://my.example', JOB, buildApplyFormData(VALUES), impl)
    expect(r).toEqual({ ok: true, reference: 'JOB-007-AB12CD34' })
    expect(seen[0].url).toBe(`https://my.example/api/public/careers/jobs/${JOB}/apply`)
    expect(seen[0].init?.method).toBe('POST')
    expect(seen[0].init?.body).toBeInstanceOf(FormData)
    expect(seen[0].init?.headers).toBeUndefined()
  })

  it.each([
    [400, { error: 'Fix fields', fields: { email: 'Enter a valid email address.' } }, 'validation'],
    [403, { error: 'Origin not allowed.' }, 'origin'],
    [404, { error: 'Closed' }, 'not_found'],
    [409, { error: 'Already applied' }, 'duplicate'],
    [429, { error: 'Slow down' }, 'rate_limited'],
    [503, { error: 'Down' }, 'unavailable'],
    [500, { error: 'Oops' }, 'error'],
  ])('maps %s to %s', async (status, body, kind) => {
    const { impl } = fetchStub(status, body)
    const r = await submitApplication('https://my.example', JOB, new FormData(), impl)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.kind).toBe(kind)
    expect(r.message).toBe((body as { error: string }).error)
    if (status === 400) expect(r.fields.email).toMatch(/valid email/)
  })

  it('maps a network failure to error without throwing', async () => {
    const impl = vi.fn(async () => { throw new TypeError('Failed to fetch') }) as unknown as typeof fetch
    const r = await submitApplication('https://my.example', JOB, new FormData(), impl)
    expect(r).toMatchObject({ ok: false, kind: 'error' })
  })
})
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implement**

```ts
// lib/services/public-careers-apply.ts
//
// Browser-side apply for the MyJKKN Public Careers API. This file must stay
// free of server imports: the POST is made from the applicant's own browser
// on purpose. MyJKKN limits applications per IP (5/hour); routing through a
// Server Action would put every applicant behind one Vercel egress IP.
// Contract: MyJKKN docs/public-careers-api.md §3.

export const MAX_RESUME_BYTES = 2 * 1024 * 1024
export const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'] as const

/** UX-only pre-check; MyJKKN verifies the bytes (magic numbers) server-side. */
export function resumeClientError(file: File | null | undefined): string | null {
  if (!file || file.size === 0) return 'Please attach your resume.'
  if (file.size > MAX_RESUME_BYTES) return 'Resume must be under 2 MB.'
  const ext = file.name.toLowerCase().split('.').pop() ?? ''
  if (!(RESUME_EXTENSIONS as readonly string[]).includes(ext)) return 'Resume must be a PDF, DOC or DOCX file.'
  return null
}

export interface ApplyValues {
  first_name: string
  last_name: string
  email: string
  phone: string
  qualification: string
  experience_months: number
  current_job_title?: string
  current_company?: string
  current_job_duration_months?: number | null
  worked_cities?: string
  consent: boolean
  utm_source?: string
  /** Honeypot. Rendered hidden; a real user never fills it. */
  website?: string
  resume: File
}

export function buildApplyFormData(v: ApplyValues): FormData {
  const fd = new FormData()
  const set = (k: string, val: string | number | null | undefined) => {
    if (val === null || val === undefined) return
    const s = String(val).trim()
    if (s !== '') fd.set(k, s)
  }
  set('first_name', v.first_name)
  set('last_name', v.last_name)
  set('email', v.email)
  set('phone', v.phone)
  set('qualification', v.qualification)
  set('experience_months', v.experience_months)
  set('current_job_title', v.current_job_title)
  set('current_company', v.current_company)
  set('current_job_duration_months', v.current_job_duration_months)
  set('worked_cities', v.worked_cities)
  set('utm_source', v.utm_source)
  fd.set('consent', v.consent ? 'true' : 'false')
  fd.set('website', v.website ?? '')
  fd.set('resume', v.resume, v.resume.name)
  return fd
}

export type ApplyFailureKind =
  | 'validation' | 'origin' | 'not_found' | 'duplicate' | 'rate_limited' | 'unavailable' | 'error'

export type ApplyResult =
  | { ok: true; reference: string }
  | { ok: false; kind: ApplyFailureKind; message: string; fields: Record<string, string> }

const KIND_BY_STATUS: Record<number, ApplyFailureKind> = {
  400: 'validation', 403: 'origin', 404: 'not_found', 409: 'duplicate', 429: 'rate_limited', 503: 'unavailable',
}

const GENERIC = 'Something went wrong. Please try again.'

export async function submitApplication(
  baseUrl: string,
  jobId: string,
  fd: FormData,
  fetchImpl: typeof fetch = fetch,
): Promise<ApplyResult> {
  let res: Response
  try {
    // No headers: the browser sets multipart/form-data with its boundary.
    res = await fetchImpl(`${baseUrl.replace(/\/+$/, '')}/api/public/careers/jobs/${jobId}/apply`, {
      method: 'POST',
      body: fd,
    })
  } catch {
    return { ok: false, kind: 'error', message: 'Could not reach the careers service. Check your connection and try again.', fields: {} }
  }

  const body = (await res.json().catch(() => ({}))) as { reference?: string; error?: string; fields?: Record<string, string> }
  if (res.status === 201 && body.reference) return { ok: true, reference: body.reference }

  return {
    ok: false,
    kind: KIND_BY_STATUS[res.status] ?? 'error',
    message: body.error || GENERIC,
    fields: body.fields ?? {},
  }
}
```

- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git add lib/services/public-careers-apply.ts __tests__/careers/public-careers-apply.test.ts && git commit -m "feat(careers): browser apply client with status mapping"`

---

### Task 4: Listing page — `/careers`

**Files:** Create `components/public/careers/job-card.tsx`, `components/public/careers/job-filters.tsx`, `components/public/careers/job-list.tsx`, `components/public/careers/careers-unavailable.tsx`, `app/(public)/careers/page.tsx`

**Interfaces — Consumes:** `listPublicJobs`, `getCareersInstitutionId` (Task 2); `PublicJob`, `InstitutionFacet`, `JOB_TYPES` (Task 1); formatters (Task 1); `isMainInstitution`, `getCurrentInstitution` from `@/lib/config/multi-tenant`.

- [ ] **Step 1: `job-card.tsx`** (server-compatible; no hooks)

```tsx
import Link from 'next/link'
import { ArrowRight, Briefcase, Building2, CalendarClock, MapPin } from 'lucide-react'
import type { PublicJob } from '@/lib/schemas/public-careers'
import { daysUntil, formatExperience, formatJobType, formatLocation, formatRoleCategory } from '@/lib/utils/careers-format'

export function JobCard({ job }: { job: PublicJob }) {
  const location = formatLocation(job)
  const experience = formatExperience(job.min_experience_years, job.max_experience_years)
  const closing = daysUntil(job.closes_at)

  return (
    <Link
      href={`/careers/${job.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{formatRoleCategory(job.role_category)}</p>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-foreground">{job.title}</h3>
        </div>
        {job.job_type && (
          <span className="shrink-0 rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">
            {formatJobType(job.job_type)}
          </span>
        )}
      </div>

      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {job.institution && (
          <li className="flex items-center gap-2"><Building2 className="h-4 w-4 shrink-0" /> <span className="truncate">{job.institution.name}</span></li>
        )}
        {job.department && (
          <li className="flex items-center gap-2"><Briefcase className="h-4 w-4 shrink-0" /> <span className="truncate">{job.department.name}</span></li>
        )}
        {location && (
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> {location}</li>
        )}
        {experience && (
          <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4 shrink-0" /> {experience}</li>
        )}
      </ul>

      <div className="mt-auto flex items-center justify-between pt-2 text-sm">
        <span className="text-muted-foreground">
          {job.positions_open > 1 ? `${job.positions_open} openings` : '1 opening'}
          {closing !== null && closing >= 0 && closing <= 7 && (
            <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {closing === 0 ? 'Closes today' : `Closes in ${closing}d`}
            </span>
          )}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-primary group-hover:gap-2 transition-all">
          View &amp; apply <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: `job-filters.tsx`** (client; state lives in the URL so the server page refetches)

```tsx
'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { JOB_TYPES, type InstitutionFacet } from '@/lib/schemas/public-careers'
import { formatJobType } from '@/lib/utils/careers-format'

interface JobFiltersProps {
  institutions: InstitutionFacet[]
  /** When false (college sites) the institution chips are hidden. */
  showInstitutions: boolean
}

export function JobFilters({ institutions, showInstitutions }: JobFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  const q = params.get('q') ?? ''
  const jobType = params.get('job_type') ?? ''
  const institutionId = params.get('institution_id') ?? ''
  const [search, setSearch] = useState(q)

  const update = useCallback((patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(patch)) v ? next.set(k, v) : next.delete(k)
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ''}`, { scroll: false }))
  }, [params, pathname, router])

  // Debounce typing → URL so we don't refetch on every keystroke.
  useEffect(() => {
    if (search === q) return
    const t = setTimeout(() => update({ q: search.trim() }), 350)
    return () => clearTimeout(t)
  }, [search, q, update])

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all ${
      active ? 'bg-primary text-primary-foreground shadow-md' : 'border border-border bg-card text-foreground hover:border-primary/40'
    }`

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative w-full max-w-md">
          <span className="sr-only">Search jobs by title</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by job title…"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary/50 focus:outline-none"
          />
        </label>
        <label className="text-sm text-muted-foreground">
          <span className="sr-only">Job type</span>
          <select
            value={jobType}
            onChange={e => update({ job_type: e.target.value })}
            className="rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none"
          >
            <option value="">All job types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{formatJobType(t)}</option>)}
          </select>
        </label>
        {pending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Updating results" />}
      </div>

      {showInstitutions && institutions.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => update({ institution_id: '' })} className={chip(!institutionId)}>
            All institutions
          </button>
          {institutions.map(i => (
            <button key={i.id} type="button" onClick={() => update({ institution_id: i.id })} className={chip(institutionId === i.id)}>
              {i.name} <span className="opacity-70">({i.open_jobs})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: `job-list.tsx`** and **`careers-unavailable.tsx`**

```tsx
// components/public/careers/job-list.tsx
import { SearchX } from 'lucide-react'
import type { PublicJob } from '@/lib/schemas/public-careers'
import { JobCard } from './job-card'

export function JobList({ jobs, filtered }: { jobs: PublicJob[]; filtered: boolean }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          {filtered ? 'No jobs match your filters' : 'No open positions right now'}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {filtered
            ? 'Try clearing the search or choosing a different job type.'
            : 'New roles are posted here as soon as they open. Please check back soon.'}
        </p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  )
}
```

```tsx
// components/public/careers/careers-unavailable.tsx
import { CloudOff } from 'lucide-react'

/** Shown when MyJKKN cannot be reached. The rest of the page still renders. */
export function CareersUnavailable() {
  return (
    <div role="status" className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
      <CloudOff className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Job listings are temporarily unavailable</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t load open positions right now. Please refresh in a few minutes.
      </p>
    </div>
  )
}
```

- [ ] **Step 4: `app/(public)/careers/page.tsx`**

```tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Skeleton } from '@/components/ui/skeleton'
import { JobFilters } from '@/components/public/careers/job-filters'
import { JobList } from '@/components/public/careers/job-list'
import { CareersUnavailable } from '@/components/public/careers/careers-unavailable'
import { getCareersInstitutionId, listPublicJobs } from '@/lib/services/public-careers-api'
import { getCurrentInstitution, isMainInstitution } from '@/lib/config/multi-tenant'

// Jobs come from MyJKKN (HR's system of record), not this site's Supabase.
// Filters live in the URL; the data cache revalidates every 300s.
export const dynamic = 'force-dynamic'

const institution = getCurrentInstitution()

export const metadata: Metadata = {
  title: `Careers | ${institution.name}`,
  description: `Open teaching and non-teaching positions at ${institution.name}. Browse current vacancies and apply online.`,
  openGraph: {
    title: `Careers | ${institution.name}`,
    description: `Open positions at ${institution.name}. Apply online.`,
    type: 'website',
  },
}

interface CareersPageProps {
  searchParams: Promise<{ q?: string; job_type?: string; institution_id?: string }>
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[220px] rounded-2xl" />)}
    </div>
  )
}

async function CareersContent({ searchParams }: CareersPageProps) {
  const sp = await searchParams
  const showInstitutions = isMainInstitution()
  // College sites are pinned to their own MyJKKN institution; the main site
  // lets the visitor pick one.
  const institutionId = getCareersInstitutionId() ?? (showInstitutions ? sp.institution_id ?? null : null)

  try {
    const { data, institutions } = await listPublicJobs({ q: sp.q, jobType: sp.job_type, institutionId })
    const filtered = Boolean(sp.q || sp.job_type || sp.institution_id)
    return (
      <>
        <JobFilters institutions={institutions} showInstitutions={showInstitutions} />
        <JobList jobs={data} filtered={filtered} />
      </>
    )
  } catch (err) {
    console.error('[careers] listing failed', err)
    return <CareersUnavailable />
  }
}

export default function CareersPage(props: CareersPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[2.5px] text-primary">
            <span className="mr-2 inline-block h-0.5 w-6 bg-primary align-middle" />
            Careers
          </p>
          <h1 className="font-sans font-bold text-foreground">Join {institution.name}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Explore open teaching and non-teaching positions and apply online in minutes. No account needed.
          </p>
        </div>

        <Suspense fallback={<ListSkeleton />}>
          <CareersContent {...props} />
        </Suspense>
      </div>
    </div>
  )
}
```

- [ ] **Step 5:** `npm run dev` (any institution), open `http://localhost:3000/careers`. With no `MYJKKN_INSTITUTION_ID`, expect either the live list (if MyJKKN's branch is deployed and a job is public) or the "temporarily unavailable" / empty state — never a crash. Type in search → URL gets `?q=` and the list refetches.
- [ ] **Step 6: Commit** `git add "app/(public)/careers/page.tsx" components/public/careers/job-card.tsx components/public/careers/job-filters.tsx components/public/careers/job-list.tsx components/public/careers/careers-unavailable.tsx && git commit -m "feat(careers): /careers listing from MyJKKN public API"`

---

### Task 5: Detail page + JobPosting JSON-LD — `/careers/[id]`

**Files:** Create `components/seo/job-posting-schema.tsx`, `components/public/careers/job-detail.tsx`, `app/(public)/careers/[id]/page.tsx`; Test `__tests__/careers/job-posting-schema.test.ts`

**Interfaces:**
- Consumes: `getPublicJob` (Task 2); `PublicJob` (Task 1); formatters (Task 1); `getSiteUrl` from `@/lib/utils/site-url`; `ApplyForm` (Task 6 — import it now; Task 6 creates the file before build).
- Produces: `buildJobPostingJsonLd(job: PublicJob, pageUrl: string): Record<string, unknown>` and `<JobPostingSchema job pageUrl />`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest'
import { buildJobPostingJsonLd } from '@/components/seo/job-posting-schema'
import type { PublicJob } from '@/lib/schemas/public-careers'

const JOB: PublicJob = {
  id: 'j1', job_code: 'JOB-007', title: 'Lab Assistant', role_category: 'non_teaching', job_type: 'full_time',
  description: 'Run the lab.', institution: { id: 'i1', name: 'JKKN College of Pharmacy' }, department: null,
  city: 'Komarapalayam', state: 'Tamil Nadu', country: 'India', education_level: 'bachelors',
  min_experience_years: 1, max_experience_years: 3, qualifications: ['B.Pharm'], skills: ['GLP'],
  positions_open: 2, posted_at: '2026-09-01T00:00:00Z', closes_at: '2026-10-01T00:00:00Z',
  salary: { min: 30000, max: 50000, currency: 'INR', duration: 'per_month' },
}

describe('buildJobPostingJsonLd', () => {
  it('emits the Google JobPosting essentials', () => {
    const ld = buildJobPostingJsonLd(JOB, 'https://jkkn.ac.in/careers/j1')
    expect(ld['@type']).toBe('JobPosting')
    expect(ld.title).toBe('Lab Assistant')
    expect(ld.datePosted).toBe('2026-09-01T00:00:00Z')
    expect(ld.validThrough).toBe('2026-10-01T00:00:00Z')
    expect(ld.employmentType).toBe('FULL_TIME')
    expect(ld.hiringOrganization).toMatchObject({ '@type': 'Organization', name: 'JKKN College of Pharmacy' })
    expect(ld.jobLocation).toMatchObject({ address: { addressLocality: 'Komarapalayam', addressRegion: 'Tamil Nadu', addressCountry: 'IN' } })
    expect(ld.baseSalary).toMatchObject({ currency: 'INR', value: { minValue: 30000, maxValue: 50000, unitText: 'MONTH' } })
    expect(ld.totalJobOpenings).toBe(2)
    expect(ld.identifier).toMatchObject({ value: 'JOB-007' })
    expect(ld.url).toBe('https://jkkn.ac.in/careers/j1')
  })
  it('omits salary and validThrough when unknown', () => {
    const ld = buildJobPostingJsonLd({ ...JOB, salary: null, closes_at: null }, 'https://x/careers/j1')
    expect(ld).not.toHaveProperty('baseSalary')
    expect(ld).not.toHaveProperty('validThrough')
  })
})
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: `components/seo/job-posting-schema.tsx`**

```tsx
/**
 * JobPosting JSON-LD — enables Google for Jobs listings for /careers/[id].
 * Built from the MyJKKN PublicJob shape (whitelisted fields only).
 * @see https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
import type { PublicJob } from '@/lib/schemas/public-careers'

const EMPLOYMENT_TYPE: Record<string, string> = {
  full_time: 'FULL_TIME', part_time: 'PART_TIME', contract: 'CONTRACTOR', internship: 'INTERN', freelance: 'CONTRACTOR',
}
const UNIT_TEXT: Record<string, string> = {
  per_month: 'MONTH', per_year: 'YEAR', per_annum: 'YEAR', per_hour: 'HOUR', per_day: 'DAY',
}
const COUNTRY_CODE: Record<string, string> = { india: 'IN' }

export function buildJobPostingJsonLd(job: PublicJob, pageUrl: string): Record<string, unknown> {
  const description = [
    job.description ?? '',
    job.qualifications.length ? `Qualifications: ${job.qualifications.join(', ')}.` : '',
    job.skills.length ? `Skills: ${job.skills.join(', ')}.` : '',
  ].filter(Boolean).join('\n\n') || job.title

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description,
    datePosted: job.posted_at ?? new Date().toISOString(),
    url: pageUrl,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.institution?.name ?? 'JKKN Institutions',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city ?? undefined,
        addressRegion: job.state ?? undefined,
        addressCountry: job.country ? (COUNTRY_CODE[job.country.toLowerCase()] ?? job.country) : 'IN',
      },
    },
    totalJobOpenings: job.positions_open,
    directApply: true,
  }
  if (job.closes_at) ld.validThrough = job.closes_at
  if (job.job_type && EMPLOYMENT_TYPE[job.job_type]) ld.employmentType = EMPLOYMENT_TYPE[job.job_type]
  if (job.job_code) ld.identifier = { '@type': 'PropertyValue', name: 'Job code', value: job.job_code }
  if (job.salary && (job.salary.min !== null || job.salary.max !== null)) {
    ld.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary.min ?? undefined,
        maxValue: job.salary.max ?? undefined,
        unitText: UNIT_TEXT[job.salary.duration] ?? 'MONTH',
      },
    }
  }
  if (job.education_level) ld.educationRequirements = { '@type': 'EducationalOccupationalCredential', credentialCategory: job.education_level }
  if (job.min_experience_years !== null) ld.experienceRequirements = { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: job.min_experience_years * 12 }
  return ld
}

export function JobPostingSchema({ job, pageUrl }: { job: PublicJob; pageUrl: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingJsonLd(job, pageUrl)) }}
    />
  )
}
```

- [ ] **Step 4:** Run → PASS.

- [ ] **Step 5: `components/public/careers/job-detail.tsx`**

```tsx
import Link from 'next/link'
import { ArrowLeft, Briefcase, Building2, CalendarDays, CalendarClock, GraduationCap, IndianRupee, MapPin, Users } from 'lucide-react'
import type { PublicJob } from '@/lib/schemas/public-careers'
import { formatDate, formatExperience, formatJobType, formatLocation, formatRoleCategory, formatSalary } from '@/lib/utils/careers-format'

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

export function JobDetail({ job }: { job: PublicJob }) {
  const salary = formatSalary(job.salary)
  return (
    <article className="space-y-8">
      <Link href="/careers" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All openings
      </Link>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{formatRoleCategory(job.role_category)}</p>
        <h1 className="mt-1 font-sans font-bold text-foreground">{job.title}</h1>
        {job.job_code && <p className="mt-1 text-sm text-muted-foreground">Job code: {job.job_code}</p>}
      </header>

      <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <Fact icon={Building2} label="Institution" value={job.institution?.name ?? null} />
        <Fact icon={Briefcase} label="Department" value={job.department?.name ?? null} />
        <Fact icon={MapPin} label="Location" value={formatLocation(job) || null} />
        <Fact icon={CalendarClock} label="Job type" value={formatJobType(job.job_type) || null} />
        <Fact icon={GraduationCap} label="Experience" value={formatExperience(job.min_experience_years, job.max_experience_years) || null} />
        <Fact icon={Users} label="Openings" value={String(job.positions_open)} />
        <Fact icon={IndianRupee} label="Salary" value={salary} />
        <Fact icon={CalendarDays} label="Posted" value={formatDate(job.posted_at)} />
        <Fact icon={CalendarDays} label="Apply by" value={formatDate(job.closes_at)} />
      </dl>

      {job.description && (
        <section>
          <h2 className="text-xl font-semibold text-foreground">About the role</h2>
          <div className="prose prose-sm mt-3 max-w-none whitespace-pre-line text-foreground/90">{job.description}</div>
        </section>
      )}

      {(job.qualifications.length > 0 || job.skills.length > 0) && (
        <section className="grid gap-6 sm:grid-cols-2">
          {job.qualifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Qualifications</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/90">
                {job.qualifications.map(q => <li key={q}>{q}</li>)}
              </ul>
            </div>
          )}
          {job.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Skills</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {job.skills.map(s => (
                  <li key={s} className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </article>
  )
}
```

- [ ] **Step 6: `app/(public)/careers/[id]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JobDetail } from '@/components/public/careers/job-detail'
import { ApplyForm } from '@/components/public/careers/apply-form'
import { JobPostingSchema } from '@/components/seo/job-posting-schema'
import { getMyJkknBaseUrl, getPublicJob } from '@/lib/services/public-careers-api'
import { getSiteUrl } from '@/lib/utils/site-url'
import { formatLocation } from '@/lib/utils/careers-format'

export const dynamic = 'force-dynamic'

interface JobPageProps { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params
  const job = await getPublicJob(id).catch(() => null)
  if (!job) return { title: 'Job not found', robots: { index: false } }

  const where = job.institution?.name ?? 'JKKN Institutions'
  const title = `${job.title} — ${where}`
  const description = `${job.title} at ${where}${formatLocation(job) ? `, ${formatLocation(job)}` : ''}. Apply online.`
  const url = `${getSiteUrl()}/careers/${job.id}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'en_IN' },
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params
  // A MyJKKN outage surfaces as a 500 here (error boundary), not a false 404
  // — a job that exists must never be told "no longer accepting applications".
  const job = await getPublicJob(id)
  if (!job) notFound()

  const pageUrl = `${getSiteUrl()}/careers/${job.id}`

  return (
    <div className="min-h-screen bg-background">
      <JobPostingSchema job={job} pageUrl={pageUrl} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_420px]">
        <JobDetail job={job} />
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ApplyForm jobId={job.id} jobTitle={job.title} apiBaseUrl={getMyJkknBaseUrl()} />
        </aside>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Commit** (the build will pass only after Task 6 supplies `apply-form.tsx`; commit anyway so the task boundary is clean) `git add components/seo/job-posting-schema.tsx components/public/careers/job-detail.tsx "app/(public)/careers/[id]/page.tsx" __tests__/careers/job-posting-schema.test.ts && git commit -m "feat(careers): job detail page with JobPosting JSON-LD"`

---

### Task 6: Apply form (client)

**Files:** Create `components/public/careers/apply-form.tsx`

**Interfaces — Consumes:** `buildApplyFormData`, `submitApplication`, `resumeClientError`, `ApplyResult` (Task 3); `Input`, `Label`, `Textarea`, `Checkbox`, `Button` from `@/components/ui/*`.
**Produces:** `<ApplyForm jobId jobTitle apiBaseUrl />`.

- [ ] **Step 1: Implement**

```tsx
'use client'

// Posts straight from the browser to MyJKKN (see lib/services/public-careers-apply.ts
// for why this deliberately bypasses Server Actions). Client Zod rules mirror the
// API's field table; the API's own 400 `fields` map is merged onto the inputs.

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  buildApplyFormData, resumeClientError, submitApplication, type ApplyResult,
} from '@/lib/services/public-careers-apply'

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.').max(100),
  last_name: z.string().trim().min(1, 'Last name is required.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(200),
  phone: z.string().trim().refine(v => /^\d{10,15}$/.test(v.replace(/[\s+\-()]/g, '')), 'Enter a valid phone number (10-15 digits).'),
  qualification: z.string().trim().min(1, 'Qualification is required.').max(200),
  experience_months: z.coerce.number().int('Whole months only.').min(0).max(720, 'Enter 0–720 months.'),
  current_job_title: z.string().trim().max(150).optional(),
  current_company: z.string().trim().max(150).optional(),
  current_job_duration_months: z.union([z.literal(''), z.coerce.number().int().min(0).max(720)]).optional(),
  worked_cities: z.string().trim().max(1000).optional(),
  consent: z.literal(true, { message: 'Please accept the privacy consent to apply.' }),
  website: z.string().max(0).optional(), // honeypot
})
type FormValues = z.infer<typeof schema>

interface ApplyFormProps {
  jobId: string
  jobTitle: string
  apiBaseUrl: string
}

const FAILURE_TITLES: Record<Exclude<ApplyResult, { ok: true }>['kind'], string> = {
  validation: 'Please correct the highlighted fields',
  origin: 'This form can only be submitted from the JKKN website',
  not_found: 'This job is no longer accepting applications',
  duplicate: 'You have already applied for this job',
  rate_limited: 'Too many applications from this connection',
  unavailable: 'Applications are temporarily unavailable',
  error: 'Something went wrong',
}

export function ApplyForm({ jobId, jobTitle, apiBaseUrl }: ApplyFormProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [result, setResult] = useState<ApplyResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { consent: undefined as unknown as true, website: '' },
  })
  const { register, handleSubmit, setError, setValue, watch, formState: { errors } } = form

  async function onSubmit(values: FormValues) {
    const resume = fileRef.current?.files?.[0] ?? null
    const fileErr = resumeClientError(resume)
    setResumeError(fileErr)
    if (fileErr || !resume) return

    setSubmitting(true)
    setResult(null)
    const fd = buildApplyFormData({
      ...values,
      current_job_duration_months: values.current_job_duration_months === '' ? null : values.current_job_duration_months,
      consent: true,
      resume,
      utm_source: typeof window !== 'undefined' ? window.location.hostname : undefined,
    })
    const r = await submitApplication(apiBaseUrl, jobId, fd)
    setSubmitting(false)
    setResult(r)

    if (!r.ok && r.kind === 'validation') {
      for (const [field, message] of Object.entries(r.fields)) {
        if (field === 'resume') setResumeError(message)
        else setError(field as keyof FormValues, { type: 'server', message })
      }
    }
  }

  if (result?.ok) {
    return (
      <div role="status" className="rounded-2xl border border-primary/30 bg-card p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-3 text-lg font-semibold text-foreground">Application received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for applying for <strong>{jobTitle}</strong>. We&apos;ve emailed you a confirmation.
        </p>
        <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">Your reference</p>
        <p className="font-mono text-lg font-semibold text-foreground">{result.reference}</p>
      </div>
    )
  }

  const field = (name: keyof FormValues, label: string, opts: { required?: boolean; type?: string; placeholder?: string; hint?: string } = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}{opts.required && <span className="text-destructive"> *</span>}</Label>
      <Input id={name} type={opts.type ?? 'text'} placeholder={opts.placeholder} aria-invalid={Boolean(errors[name])} {...register(name)} />
      {opts.hint && !errors[name] && <p className="text-xs text-muted-foreground">{opts.hint}</p>}
      {errors[name] && <p className="text-xs text-destructive">{errors[name]?.message as string}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Apply for this role</h2>
        <p className="text-sm text-muted-foreground">Takes about two minutes. No account needed.</p>
      </div>

      {result && !result.ok && result.kind !== 'validation' && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">{FAILURE_TITLES[result.kind]}</p>
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field('first_name', 'First name', { required: true })}
        {field('last_name', 'Last name', { required: true })}
      </div>
      {field('email', 'Email', { required: true, type: 'email' })}
      {field('phone', 'Phone', { required: true, type: 'tel', placeholder: '+91 98765 43210' })}
      {field('qualification', 'Highest qualification', { required: true, placeholder: 'e.g. M.Pharm' })}
      {field('experience_months', 'Total experience (months)', { required: true, type: 'number', hint: 'Enter 0 if you are a fresher.' })}

      <details className="rounded-xl border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium text-foreground">Current employment (optional)</summary>
        <div className="mt-4 space-y-4">
          {field('current_job_title', 'Current job title')}
          {field('current_company', 'Current employer')}
          {field('current_job_duration_months', 'Time in current role (months)', { type: 'number' })}
          {field('worked_cities', 'Cities you have worked in', { hint: 'Comma-separated, e.g. Salem, Erode' })}
        </div>
      </details>

      <div className="space-y-1.5">
        <Label htmlFor="resume">Resume<span className="text-destructive"> *</span></Label>
        <input
          id="resume"
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={e => setResumeError(resumeClientError(e.target.files?.[0] ?? null))}
          className="block w-full text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
        />
        <p className="text-xs text-muted-foreground">PDF, DOC or DOCX, up to 2 MB.</p>
        {resumeError && <p className="text-xs text-destructive">{resumeError}</p>}
      </div>

      {/* Honeypot: invisible to people, irresistible to bots. Never remove `name`. */}
      <input {...register('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={watch('consent') === true}
          onCheckedChange={v => setValue('consent', (v === true) as true, { shouldValidate: true })}
        />
        <Label htmlFor="consent" className="text-sm font-normal leading-snug text-muted-foreground">
          I consent to JKKN Institutions storing and processing my details and resume for recruitment purposes.
          <span className="text-destructive"> *</span>
        </Label>
      </div>
      {errors.consent && <p className="-mt-3 text-xs text-destructive">{errors.consent.message as string}</p>}

      <Button type="submit" disabled={submitting} className="w-full rounded-full">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {submitting ? 'Submitting…' : 'Submit application'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2:** `npm run build` → compiles with 0 TypeScript errors in the new files (if `z.literal(true, { message })` is rejected by the installed Zod 4 build, use `z.boolean().refine(v => v === true, 'Please accept the privacy consent to apply.')` and change `consent` type to `boolean`).
- [ ] **Step 3: Manual check** on `http://localhost:3000/careers/<id>`: submit empty → inline errors; choose `.exe` → resume error; valid submit against MyJKKN → success panel or a mapped failure banner (403 if MyJKKN doesn't list `http://localhost:3000` in `PUBLIC_CAREERS_EXTRA_ORIGINS` — that's expected and proves the mapping).
- [ ] **Step 4: Commit** `git add components/public/careers/apply-form.tsx && git commit -m "feat(careers): browser apply form posting to MyJKKN"`

---

### Task 7: Cleanup, env, docs

**Files:** Delete `components/public/resume-file-upload.tsx`; Modify `.env.example`, `scripts/switch-institution.ts`; Create `docs/PUBLIC-CAREERS-INTEGRATION.md`

- [ ] **Step 1:** `git rm components/public/resume-file-upload.tsx` (orphan: zero importers; targets the `resumes` bucket dropped in 2026-01 — confirm with `grep -rn "resume-file-upload" app components lib` → 0 hits).
- [ ] **Step 2: `.env.example`** — append after `FACULTY_SYNC_SECRET`:

```env
# MyJKKN Public Careers API (jobs listed on /careers; applications post from the browser)
NEXT_PUBLIC_MYJKKN_URL=https://www.jkkn.ai
# MyJKKN institutions.id for this college. Leave empty on the main site to show every college.
MYJKKN_INSTITUTION_ID=
```

- [ ] **Step 3: `scripts/switch-institution.ts`** — in the header comment block that lists `.env.{institutionId}.jkkn-api` expected keys (lines ~18–23), add two lines:

```
 *                                         NEXT_PUBLIC_MYJKKN_URL        (optional, default https://www.jkkn.ai)
 *                                         MYJKKN_INSTITUTION_ID         (careers page: this college's MyJKKN id)
```
and change the comment `// Check for JKKN Staff API sync sidecar (engineering uses this; others may add it later)` to `// Check for the MyJKKN sidecar (staff sync + public careers scoping)`. No behaviour change: the sidecar already merges arbitrary KEY=VALUE lines into `.env.local`.

- [ ] **Step 4: `docs/PUBLIC-CAREERS-INTEGRATION.md`**

```markdown
# Public Careers Integration (jkkn.ac.in ↔ MyJKKN)

`/careers` and `/careers/[id]` read open, public jobs from the MyJKKN Public Careers API and post
applications directly from the applicant's browser. This site stores nothing: HR manages jobs and
screens applications in MyJKKN (`/hr/recruitment`).

## Endpoints used
- `GET  {NEXT_PUBLIC_MYJKKN_URL}/api/public/careers/jobs?institution_id&q&job_type` — listing (server, revalidate 300s)
- `GET  {NEXT_PUBLIC_MYJKKN_URL}/api/public/careers/jobs/{id}` — detail (server, 404 → notFound)
- `POST {NEXT_PUBLIC_MYJKKN_URL}/api/public/careers/jobs/{id}/apply` — apply (**browser only**)

Contract: MyJKKN `docs/public-careers-api.md`.

## Environment (per Vercel project)
| Var | Main site | College sites |
|---|---|---|
| `NEXT_PUBLIC_MYJKKN_URL` | `https://www.jkkn.ai` | same |
| `MYJKKN_INSTITUTION_ID` | *(empty — all colleges, with a filter)* | that college's MyJKKN `institutions.id` |

Locally, put both in `.env.<institution>.jkkn-api`; `npm run switch <institution>` merges them into `.env.local`.

## Why the apply POST is not a Server Action
MyJKKN rate-limits applications per IP (5/hour). A Server Action would send every applicant from
one Vercel egress IP. See `lib/services/public-careers-apply.ts`.

## Prerequisites on the MyJKKN side
1. Branch `feat/public-careers-api` merged and deployed; its migration applied.
2. HR turns on **Show on website (jkkn.ac.in)** for a job with status **Open**.
3. For local dev / Vercel previews: `PUBLIC_CAREERS_EXTRA_ORIGINS=http://localhost:3000,https://<preview>.vercel.app`
   on MyJKKN (production origins `https://jkkn.ac.in` and `https://*.jkkn.ac.in` are built in).

## Code map
| File | Role |
|---|---|
| `lib/schemas/public-careers.ts` | Zod contract |
| `lib/services/public-careers-api.ts` | server reads |
| `lib/services/public-careers-apply.ts` | browser apply + status mapping |
| `lib/utils/careers-format.ts` | display formatters |
| `components/public/careers/*` | UI |
| `components/seo/job-posting-schema.tsx` | Google for Jobs JSON-LD |
| `app/(public)/careers/**` | routes (shadow the CMS `careers` page, which still holds the old CVViz iframe) |

## History
The native careers module (own tables + admin) was removed on 2026-01-08 (`docs/CAREER-MODULE-REMOVAL.md`).
From 2026-01 to 2026-09 `/careers` was a CMS page embedding `jobs.cvviz.com`.
```

- [ ] **Step 5: Commit** `git add -A .env.example scripts/switch-institution.ts docs/PUBLIC-CAREERS-INTEGRATION.md components/public/resume-file-upload.tsx && git commit -m "chore(careers): env docs, integration guide, drop orphaned resume uploader"`

---

### Task 8: Verification

- [ ] **Step 1:** `npx vitest run __tests__/careers` → all files PASS; report counts verbatim.
- [ ] **Step 2:** `npm run lint` → no new warnings in touched files.
- [ ] **Step 3:** `npm run build` → success (this runs `tsc` too). Compare any pre-existing errors against `master` before claiming a regression.
- [ ] **Step 4: Live check** (`npm run dev:main`, no `MYJKKN_INSTITUTION_ID`):
  1. `/careers` renders header + filters + list/empty/unavailable state; `?q=x&job_type=full_time` survives reload.
  2. `/careers/not-a-uuid` → 404 page.
  3. If MyJKKN's branch is deployed with a public job: `/careers/<id>` shows details, `view-source` contains `"@type":"JobPosting"`, and the form maps a 403/201 correctly.
  4. Feature flag: `NEXT_PUBLIC_FEATURES` without `careers` → `/careers` link disappears from nav (existing behaviour).
- [ ] **Step 5:** Use superpowers:finishing-a-development-branch (push, PR against `master`). PR body must say: pages return nothing in production until MyJKKN `feat/public-careers-api` is merged/deployed and HR marks jobs public; set `MYJKKN_INSTITUTION_ID` on each college's Vercel project.
