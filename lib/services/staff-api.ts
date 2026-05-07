// lib/services/staff-api.ts
//
// Single network boundary to MyJKKN Staff API. All fetch calls live here.
// Server-only — never import from a 'use client' file.
//
// Auth: Authorization: Bearer ${JKKN_API_KEY}
// Base: https://www.jkkn.ai/api  (use www; bare jkkn.ai 307s and curl/clients
//       drop Authorization on cross-domain redirects)

import { StaffApiListResponseSchema, type StaffApiRecord } from '@/lib/schemas/staff-api'

// Env reads are intentionally lazy (function-level, not module-level) so this
// module is safe to import before dotenv/config loads in CLI scripts.

function getEnv() {
  const base = process.env.JKKN_API_BASE_URL ?? 'https://www.jkkn.ai/api'
  const key = process.env.JKKN_API_KEY
  const institutionId = process.env.JKKN_ENGINEERING_INSTITUTION_ID
  return { base, key, institutionId }
}

async function request<T>(path: string, schema: { parse: (v: unknown) => T }): Promise<T> {
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
 * Fetch all active+published staff for the configured Engineering institution
 * filtered by a single role_key. The API caps role_key to one value per request,
 * so callers must call once per role and merge.
 */
export async function listStaffByRole(roleKey: 'hod' | 'principal'): Promise<StaffApiRecord[]> {
  const { institutionId } = getEnv()
  if (!institutionId) throw new Error('[staff-api] JKKN_ENGINEERING_INSTITUTION_ID is not set')
  const params = new URLSearchParams({
    institution_id: institutionId,
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
 * Fetch HODs + Principal in parallel and dedupe by id (Principal-first wins
 * if the same UUID somehow appears in both lists — defensive only; shouldn't happen).
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
