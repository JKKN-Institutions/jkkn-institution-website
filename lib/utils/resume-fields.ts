// lib/utils/resume-fields.ts
//
// Pure helpers for resume auto-fill on the apply form
// (spec docs/superpowers/specs/2026-10-12-careers-resume-autofill-design.md §3.4, §4.3).
// No I/O and no SDK imports: shared by the server service, the client form
// and the tests.

import type { ZodType } from 'zod'
import {
  AUTOFILL_FIELDS, MAX_CITIES_LENGTH, applyFormSchema, type AutofillField,
} from '@/lib/schemas/careers-apply-form'
import type { ResumeExtraction } from '@/lib/schemas/resume-extraction'

export type AutofillValues = Partial<Record<AutofillField, string>>

export type AutofillFailure = 'unsupported_type' | 'too_large' | 'unreadable' | 'rate_limited' | 'unavailable'

export type ResumeAutofillResult =
  | { ok: true; values: AutofillValues; filled: AutofillField[] }
  | { ok: false; reason: AutofillFailure }

// ── File type ───────────────────────────────────────────────────────────────

export type ResumeKind = 'pdf' | 'docx'

/** By content, not by name: a renamed file is read as what it really is. */
export function detectResumeKind(bytes: Uint8Array): ResumeKind | null {
  const startsWith = (signature: number[]) => signature.every((b, i) => bytes[i] === b)
  if (startsWith([0x25, 0x50, 0x44, 0x46, 0x2d])) return 'pdf' // "%PDF-"
  if (startsWith([0x50, 0x4b, 0x03, 0x04])) return 'docx' // ZIP container; mammoth rejects zips that are not DOCX
  return null // legacy .doc (OLE), images, anything else
}

/**
 * Best-effort page count from the raw bytes, to keep a 600-page "resume" from
 * reaching Claude. Takes the larger of the page objects found and the largest
 * page-tree /Count, since object streams can hide either one. 0 = unknown.
 */
export function pdfPageCount(bytes: Uint8Array): number {
  const text = new TextDecoder('latin1').decode(bytes)
  const pageObjects = text.match(/\/Type\s*\/Page(?![A-Za-z])/g)?.length ?? 0
  let largestCount = 0
  for (const m of text.matchAll(/\/Count\s+(\d+)/g)) largestCount = Math.max(largestCount, Number(m[1]))
  return Math.max(pageObjects, largestCount)
}

// ── Normalisation ───────────────────────────────────────────────────────────

const clean = (v: string | null | undefined): string => (v ?? '').replace(/\s+/g, ' ').trim()

const months = (n: number | null): string => (n === null || !Number.isFinite(n) ? '' : String(Math.round(n)))

/** De-duplicated, comma-joined, cut at the last whole city that fits the field. */
function joinCities(list: string[]): string {
  const seen = new Set<string>()
  let out = ''
  for (const raw of list) {
    const city = clean(raw)
    const key = city.toLowerCase()
    if (!city || seen.has(key)) continue
    const next = out ? `${out}, ${city}` : city
    if (next.length > MAX_CITIES_LENGTH) break
    seen.add(key)
    out = next
  }
  return out
}

/**
 * Claude's extraction → form values, held to the form's own rules. A value
 * that fails them is dropped and left for the candidate, never repaired.
 */
export function normalizeResumeFields(raw: ResumeExtraction): { values: AutofillValues; filled: AutofillField[] } {
  const candidates: Record<AutofillField, string> = {
    first_name: clean(raw.first_name),
    last_name: clean(raw.last_name),
    email: clean(raw.email),
    phone: clean(raw.phone),
    qualification: clean(raw.highest_qualification),
    experience_months: months(raw.total_experience_months),
    current_job_title: clean(raw.current_job_title),
    current_company: clean(raw.current_company),
    current_job_duration_months: months(raw.current_job_duration_months),
    worked_cities: joinCities(raw.worked_cities),
  }
  const values: AutofillValues = {}
  const filled: AutofillField[] = []
  for (const field of AUTOFILL_FIELDS) {
    const value = candidates[field]
    const rule: ZodType = applyFormSchema.shape[field]
    if (value && rule.safeParse(value).success) {
      values[field] = value
      filled.push(field)
    }
  }
  return { values, filled }
}

// ── Writing into the form ───────────────────────────────────────────────────

/**
 * The incoming values that may be written into the form (spec §3.4): a field is
 * written only when it is empty or still shows an unedited auto-filled value.
 * Anything the candidate typed — even while the resume was being read — stays.
 */
export function autofillWrites(
  current: AutofillValues,
  autofilled: ReadonlySet<AutofillField>,
  incoming: AutofillValues,
): AutofillValues {
  const writes: AutofillValues = {}
  for (const field of AUTOFILL_FIELDS) {
    const next = incoming[field]
    if (!next) continue
    const empty = (current[field] ?? '').trim() === ''
    if (empty || autofilled.has(field)) writes[field] = next
  }
  return writes
}
