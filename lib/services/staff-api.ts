// lib/services/staff-api.ts
//
// Single network boundary to MyJKKN Staff API. All fetch calls live here.
// Server-only — never import from a 'use client' file.
//
// Auth: Authorization: Bearer ${JKKN_API_KEY}
// Base: https://www.jkkn.ai/api  (use www; bare jkkn.ai 307s and curl/clients
//       drop Authorization on cross-domain redirects)

import {
  StaffApiListEnvelopeSchema,
  StaffApiRecordSchema,
  type StaffApiRecord,
} from '@/lib/schemas/staff-api'

// Env reads are intentionally lazy (function-level, not module-level) so this
// module is safe to import before dotenv/config loads in CLI scripts.

function getEnv() {
  const base = process.env.JKKN_API_BASE_URL ?? 'https://www.jkkn.ai/api'
  const key = process.env.JKKN_API_KEY
  const institutionId = process.env.JKKN_ENGINEERING_INSTITUTION_ID
  return { base, key, institutionId }
}

/** A record the API returned that failed schema validation. */
export interface SkippedRecord {
  /** staff.id if we could read it, else the array index. */
  ref: string
  /** Human-readable name if readable — helps identify the row in MyJKKN. */
  name?: string
  /** First few Zod issues, formatted as "path: message". */
  issues: string[]
}

export interface TeachingStaffResult {
  /** Records that validated AND are flagged is_teaching. */
  records: StaffApiRecord[]
  /** Records that failed schema validation — surfaced in the sync report. */
  skipped: SkippedRecord[]
  /** Total rows the API returned, before filtering. */
  totalReturned: number
  /** Rows dropped because category.is_teaching !== true. */
  nonTeachingFiltered: number
}

const MAX_429_RETRIES = 3

async function fetchJson(path: string, attempt = 0): Promise<unknown> {
  const { base, key } = getEnv()
  if (!key) throw new Error('[staff-api] JKKN_API_KEY is not set')
  const url = `${base}${path}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (res.status === 429) {
    if (attempt >= MAX_429_RETRIES) {
      throw new Error(`[staff-api] rate limited after ${MAX_429_RETRIES} retries`)
    }
    const retry = Number(res.headers.get('Retry-After') ?? '5')
    await new Promise(r => setTimeout(r, retry * 1000))
    return fetchJson(path, attempt + 1)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`[staff-api] ${res.status} ${res.statusText} — ${body.slice(0, 200)}`)
  }

  return res.json()
}

/**
 * Fetch every active staff member for the configured Engineering institution
 * and keep the ones MyJKKN itself categorises as teaching.
 *
 * Why `category.is_teaching` and not `role_key`:
 *   role_key is a job function, not a teaching flag. 22 staff carry
 *   role_key='admission_counselor' (or 'coe' / 'staff_counselor') while being
 *   designated Assistant Professor — MyJKKN classifies them as teaching, and
 *   a role_key allowlist would wrongly drop them. is_teaching is curated
 *   upstream, so recategorising someone in MyJKKN propagates here with no
 *   code change. It also correctly excludes Ayaah, Lab Technician, Library,
 *   Admin Office, Warden, Civil Supervisor and IT Support.
 *
 * One request, not one-per-role: the API caps role_key to a single value per
 * request, but omitting it returns everything, so we filter locally instead.
 */
export async function listEngineeringTeachingStaff(): Promise<TeachingStaffResult> {
  const { institutionId } = getEnv()
  if (!institutionId) throw new Error('[staff-api] JKKN_ENGINEERING_INSTITUTION_ID is not set')

  const params = new URLSearchParams({
    institution_id: institutionId,
    is_active: 'true',
    all: 'true',
  })

  const json = await fetchJson(`/api-management/staff?${params.toString()}`)
  const envelope = StaffApiListEnvelopeSchema.parse(json)

  const records: StaffApiRecord[] = []
  const skipped: SkippedRecord[] = []
  let nonTeachingFiltered = 0

  envelope.data.forEach((raw, i) => {
    const parsed = StaffApiRecordSchema.safeParse(raw)
    if (!parsed.success) {
      const r = raw as Record<string, unknown> | null
      skipped.push({
        ref: (r && typeof r.id === 'string' ? r.id : `index ${i}`),
        name: r ? `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim() || undefined : undefined,
        issues: parsed.error.issues
          .slice(0, 3)
          .map(iss => `${iss.path.join('.')}: ${iss.message}`),
      })
      return
    }
    if (parsed.data.category?.is_teaching !== true) {
      nonTeachingFiltered++
      return
    }
    records.push(parsed.data)
  })

  return {
    records,
    skipped,
    totalReturned: envelope.data.length,
    nonTeachingFiltered,
  }
}
