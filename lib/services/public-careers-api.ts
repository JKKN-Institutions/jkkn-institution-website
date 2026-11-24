// lib/services/public-careers-api.ts
//
// Single network boundary to the MyJKKN Public Careers API (read side).
// Server-only — import from Server Components / route handlers, never from a
// 'use client' file (the browser-side apply lives in public-careers-apply.ts).
//
// No auth: the endpoints are public by design (MyJKKN whitelists columns and
// only returns jobs HR marked "Show on website"). Responses are cached by
// Next's data cache for 300s, matching the API's own s-maxage. Every fetch is
// tagged CAREERS_CACHE_TAG so MyJKKN can expire it the moment HR saves a job
// (POST /api/revalidate/careers); the 300s window is only the fallback.
// Contract: MyJKKN docs/public-careers-api.md

import {
  JobDetailResponseSchema,
  JobListResponseSchema,
  JOB_TYPES,
  type JobListResponse,
  type PublicJob,
} from '@/lib/schemas/public-careers'
import { HR_SALARY } from '@/lib/services/careers-hr-salary'

const DEFAULT_BASE = 'https://www.jkkn.ai'
const REVALIDATE_SECONDS = 300
export const CAREERS_CACHE_TAG = 'myjkkn-careers'

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
    next: { revalidate: REVALIDATE_SECONDS, tags: [CAREERS_CACHE_TAG] },
  })
  // A real "job not found" is a JSON 404 from the route. An HTML 404 means the
  // route itself is missing (API not deployed) — that is an outage, not a
  // missing job, and must never render as "no longer accepting applications".
  const isJson = (res.headers.get('content-type') ?? '').includes('application/json')
  if (res.status === 404 && isJson) return { status: 404, body: null }
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
  return toPublicList(JobListResponseSchema.parse(body))
}

export async function getPublicJob(id: string, fetchImpl: typeof fetch = fetch): Promise<PublicJob | null> {
  if (!isUuid(id) || HIDDEN_JOB_IDS.has(id.toLowerCase())) return null
  const { status, body } = await getJson(`${getMyJkknBaseUrl()}/api/public/careers/jobs/${id}`, fetchImpl)
  if (status === 404) return null
  return toPublicJob(JobDetailResponseSchema.parse(body).data)
}

// ── Website-side corrections to the feed (added 2026-11-17) ─────────────────
// The website team has no MyJKKN access, so these fixes live here until MyJKKN
// is corrected at the source (HR's salary sheet joined them 2026-11-24). All of
// them apply at this one boundary, so the list, the job page, the sitemap,
// search, facets and JobPosting all agree.

/**
 * Jobs kept off the website although MyJKKN still returns them. Remove an id
 * once MyJKKN stops returning it.
 *  - 6a957709-...: title "testing", job code "adfsd" - a test record, not a vacancy.
 */
export const HIDDEN_JOB_IDS: ReadonlySet<string> = new Set([
  '6a957709-c5cd-4e94-8ca7-6415243606cd',
])

/**
 * Public employer names. "JKKN Main Office" is MyJKKN's internal name for the
 * group office; candidates (and Google Jobs) see "JKKN Institutions", the name
 * used everywhere else on the site.
 */
const PUBLIC_INSTITUTION_NAME: Readonly<Record<string, string>> = {
  'JKKN Main Office': 'JKKN Institutions',
}

const publicName = (name: string) => PUBLIC_INSTITUTION_NAME[name] ?? name

/**
 * HR's salary for a job, from HR's own sheet (added 2026-11-24). It replaces
 * MyJKKN's salary for the listed jobs; see lib/services/careers-hr-salary.ts.
 */
function hrSalary(id: string): PublicJob['salary'] | undefined {
  const s = HR_SALARY[id.toLowerCase()]
  if (!s) return undefined
  return { min: s.min, max: s.max, currency: 'INR', duration: 'per_month', ...(s.basis ? { basis: s.basis } : {}) }
}

export function toPublicJob(job: PublicJob): PublicJob {
  let out = job
  const salary = hrSalary(job.id)
  if (salary) out = { ...out, salary }
  if (out.institution) {
    const name = publicName(out.institution.name)
    if (name !== out.institution.name) out = { ...out, institution: { ...out.institution, name } }
  }
  return out
}

function toPublicList(res: JobListResponse): JobListResponse {
  const hiddenPerInstitution = new Map<string, number>()
  for (const j of res.data) {
    if (j.institution && HIDDEN_JOB_IDS.has(j.id.toLowerCase())) {
      hiddenPerInstitution.set(j.institution.id, (hiddenPerInstitution.get(j.institution.id) ?? 0) + 1)
    }
  }
  return {
    ...res,
    data: res.data.filter(j => !HIDDEN_JOB_IDS.has(j.id.toLowerCase())).map(toPublicJob),
    institutions: res.institutions.map(i => ({
      ...i,
      name: publicName(i.name),
      open_jobs: Math.max(0, i.open_jobs - (hiddenPerInstitution.get(i.id) ?? 0)),
    })),
  }
}
