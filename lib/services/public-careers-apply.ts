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
