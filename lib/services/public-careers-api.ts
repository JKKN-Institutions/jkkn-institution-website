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
  return JobListResponseSchema.parse(body)
}

export async function getPublicJob(id: string, fetchImpl: typeof fetch = fetch): Promise<PublicJob | null> {
  if (!isUuid(id)) return null
  const { status, body } = await getJson(`${getMyJkknBaseUrl()}/api/public/careers/jobs/${id}`, fetchImpl)
  if (status === 404) return null
  return JobDetailResponseSchema.parse(body).data
}
