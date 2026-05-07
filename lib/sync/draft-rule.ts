// lib/sync/draft-rule.ts
//
// The "auto-draft on incomplete data" forcing function. Synced rows that fail
// this check get status='draft' regardless of MyJKKN's published flag — keeps
// half-finished profiles off the public site until MyJKKN admins fill them in.

import type { FacultyFormData } from '@/lib/schemas/faculty'

export interface CompletenessResult {
  isComplete: boolean
  missing: string[]
}

const REQUIRED_FIELDS = [
  'photo_url',
  'professional_summary',
  'qualifications',
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
  if (!formData.professional_summary || formData.professional_summary.trim() === '') missing.push('professional_summary')
  if (!formData.qualifications || formData.qualifications.length === 0) missing.push('qualifications')
  if (!formData.email || formData.email.trim() === '') missing.push('email')
  if (!formData.designation || formData.designation.trim() === '') missing.push('designation')
  if (!formData.department || formData.department.trim() === '') missing.push('department')

  return { isComplete: missing.length === 0, missing }
}

export const FACULTY_REQUIRED_FIELDS = REQUIRED_FIELDS
