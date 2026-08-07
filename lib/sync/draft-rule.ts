// lib/sync/draft-rule.ts
//
// The "auto-draft on incomplete data" forcing function. Synced rows that fail
// this check get status='draft' regardless of MyJKKN's published flag — keeps
// half-finished profiles off the public site until MyJKKN admins fill them in.

import type { FacultyFormData } from '@/lib/schemas/faculty'

export interface CompletenessResult {
  isComplete: boolean
  /** Required fields that are absent — any entry here forces status='draft'. */
  missing: string[]
  /**
   * Optional-but-wanted fields that are absent. Does NOT block publishing;
   * surfaced in the sync report so MyJKKN admins have a worklist of thin
   * profiles to enrich.
   */
  sparse: string[]
}

/** Absent → profile still publishes, but is flagged as thin in the report. */
const ENRICHMENT_FIELDS = ['professional_summary', 'qualifications'] as const

// Fields a profile MUST have before it can go public.
//
// professional_summary and qualifications were required until 2026-08-07. That
// bar was set when only 4 leadership profiles synced, all of them hand-curated.
// Across the full 64-person teaching roster it hid 36 of 42 otherwise-valid
// people: 35/42 have no bio upstream and 25/42 have no qualifications array.
//
// A faculty card is still useful with a photo, designation and department, and
// the profile page renders only the sections that have data — so these two are
// now optional. Photo stays required because a card without one looks broken.
const REQUIRED_FIELDS = [
  'photo_url',
  'email',
  'designation',
  'department',
] as const

/**
 * Returns isComplete=true only if EVERY required field is non-empty.
 * `rehostedPhotoUrl` is passed separately because in the sync pipeline the
 * photo lives outside formData until rehost completes — we evaluate the rule
 * with the rehosted URL, not the API URL.
 */
export function checkFacultyCompleteness(
  formData: FacultyFormData,
  rehostedPhotoUrl: string | null
): CompletenessResult {
  const missing: string[] = []

  if (!rehostedPhotoUrl) missing.push('photo_url')
  if (!formData.email || formData.email.trim() === '') missing.push('email')
  if (!formData.designation || formData.designation.trim() === '') missing.push('designation')
  if (!formData.department || formData.department.trim() === '') missing.push('department')

  const sparse: string[] = []
  if (!formData.professional_summary || formData.professional_summary.trim() === '') {
    sparse.push('professional_summary')
  }
  if (!formData.qualifications || formData.qualifications.length === 0) {
    sparse.push('qualifications')
  }

  return { isComplete: missing.length === 0, missing, sparse }
}

export const FACULTY_REQUIRED_FIELDS = REQUIRED_FIELDS
export const FACULTY_ENRICHMENT_FIELDS = ENRICHMENT_FIELDS
