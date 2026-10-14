// lib/services/resume-autofill-max.ts
//
// Resume auto-fill through MyJKKN's Claude Max lane (no API key, no per-call cost).
// Browser-side, like the apply itself (public-careers-apply.ts): MyJKKN's public
// careers API trusts https://*.jkkn.ac.in origins, so no key or proxy is needed.
//
//   POST {MyJKKN}/api/public/careers/resume-read   multipart { resume }
//     202 { status:'pending', job_id, token, quick:{email,phone} } | 200 { status:'manual', reason, quick }
//   GET  {MyJKKN}/api/public/careers/resume-read?job=&t=
//     202 { status:'pending' } | 200 { status:'done', fill } | 200 { status:'manual', reason } | 404
//
// MyJKKN reads the file's text and queues it for the Max runners; email and phone
// come back at once (onQuick), the rest in seconds to a couple of minutes. The
// answer goes through normalizeResumeFields like the API reader's, so the form's
// own rules decide what is written. Never throws.

import type { ResumeExtraction } from '@/lib/schemas/resume-extraction'
import {
  normalizeResumeFields, type AutofillFailure, type ResumeAutofillResult,
} from '@/lib/utils/resume-fields'

/** What MyJKKN's resume-read returns as `fill`. */
export interface MaxResumeFill {
  first_name: string | null
  last_name: string | null
  qualification: string | null
  experience_months: number | null
  current_job_title: string | null
  current_company: string | null
  current_job_duration_months: number | null
  worked_cities: string[]
}

type Quick = { email: string | null; phone: string | null } | null | undefined

export const MAX_READ_DEADLINE_MS = 150_000

export interface ReadViaMaxOptions {
  baseUrl: string
  /** Email/phone, as soon as MyJKKN has them (before the AI answers). */
  onQuick?: (result: ResumeAutofillResult) => void
  /** False once the candidate picked another file or left upload mode. */
  isCurrent?: () => boolean
  fetchImpl?: typeof fetch
  sleep?: (ms: number) => Promise<void>
  now?: () => number
  deadlineMs?: number
}

/** MyJKKN's 'manual' reasons → the panel's failure messages. */
function failureFor(reason: unknown): AutofillFailure {
  switch (reason) {
    case 'rate_limited':
      return 'rate_limited'
    case 'no_text': // a scan or photo: no text to read
    case 'doc_not_supported':
    case 'unparseable':
    case 'model_error':
      return 'unreadable'
    default:
      return 'unavailable' // queue down, timeout, anything unknown
  }
}

/** quick + fill → form values held to the form's rules; null when nothing usable. */
export function maxResultToValues(quick: Quick, fill: MaxResumeFill | null): ResumeAutofillResult | null {
  const raw: ResumeExtraction = {
    first_name: fill?.first_name ?? null,
    last_name: fill?.last_name ?? null,
    email: quick?.email ?? null,
    phone: quick?.phone ?? null,
    highest_qualification: fill?.qualification ?? null,
    total_experience_months: fill?.experience_months ?? null,
    current_job_title: fill?.current_job_title ?? null,
    current_company: fill?.current_company ?? null,
    current_job_duration_months: fill?.current_job_duration_months ?? null,
    worked_cities: Array.isArray(fill?.worked_cities) ? fill.worked_cities : [],
  }
  const { values, filled } = normalizeResumeFields(raw)
  return filled.length > 0 ? { ok: true, values, filled } : null
}

/** The AI could not help: keep whatever email/phone we already have, else the reason. */
function settle(quick: Quick, reason: AutofillFailure): ResumeAutofillResult {
  return maxResultToValues(quick, null) ?? { ok: false, reason }
}

async function json(res: Response): Promise<Record<string, unknown>> {
  try {
    const body = (await res.json()) as unknown
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function readResumeViaMax(file: File, opts: ReadViaMaxOptions): Promise<ResumeAutofillResult> {
  const fetchImpl = opts.fetchImpl ?? fetch
  const sleep = opts.sleep ?? ((ms: number) => new Promise<void>(r => setTimeout(r, ms)))
  const now = opts.now ?? Date.now
  const isCurrent = opts.isCurrent ?? (() => true)
  const deadline = now() + (opts.deadlineMs ?? MAX_READ_DEADLINE_MS)
  const endpoint = `${opts.baseUrl.replace(/\/+$/, '')}/api/public/careers/resume-read`

  let quick: Quick = null
  let job: { id: string; token: string }
  try {
    const fd = new FormData()
    fd.set('resume', file)
    const res = await fetchImpl(endpoint, { method: 'POST', body: fd })
    const body = await json(res)
    if (res.status === 413) return { ok: false, reason: 'too_large' }
    if (res.status === 400) return { ok: false, reason: 'unsupported_type' }
    quick = body.quick as Quick
    if (res.status !== 202 || typeof body.job_id !== 'string' || typeof body.token !== 'string') {
      return settle(quick, failureFor(body.reason))
    }
    job = { id: body.job_id, token: body.token }
  } catch {
    return { ok: false, reason: 'unavailable' } // network / CORS
  }

  const early = maxResultToValues(quick, null)
  if (early && isCurrent()) opts.onQuick?.(early)

  const started = now()
  const qs = new URLSearchParams({ job: job.id, t: job.token }).toString()
  while (now() < deadline) {
    await sleep(now() - started < 60_000 ? 5_000 : 10_000)
    if (!isCurrent()) return { ok: false, reason: 'unavailable' } // ignored by the caller
    try {
      const res = await fetchImpl(`${endpoint}?${qs}`, { cache: 'no-store' })
      const body = await json(res)
      if (res.status === 202) continue
      if (body.status === 'done' && body.fill && typeof body.fill === 'object') {
        return maxResultToValues(quick, body.fill as MaxResumeFill) ?? settle(quick, 'unreadable')
      }
      return settle(quick, res.ok ? failureFor(body.reason) : 'unavailable')
    } catch {
      // a dropped poll is not the job failing: try again until the deadline
    }
  }
  return settle(quick, 'unavailable')
}
