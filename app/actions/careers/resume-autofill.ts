'use server'

// "Upload resume" on /careers/<job> (spec docs/superpowers/specs/2026-10-12-careers-resume-autofill-design.md).
// Public and unauthenticated like the apply form itself. It only reads the
// resume to pre-fill the form: nothing is stored, nothing is logged about the
// applicant, and the application is still posted from the browser to MyJKKN.

import { headers } from 'next/headers'
import { handleResumeAutofill } from '@/lib/services/resume-autofill'
import type { ResumeAutofillResult } from '@/lib/utils/resume-fields'

export async function extractResumeFields(formData: FormData): Promise<ResumeAutofillResult> {
  const started = Date.now()
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const result = await handleResumeAutofill(formData.get('resume'), ip)
  // Outcome, time and a count only — warn because lint allows only warn/error. (Stripped from production builds by
  // next.config.ts `removeConsole`; GA's careers_resume_autofill is the production signal.)
  console.warn('[resume-autofill]', result.ok ? `filled ${result.filled.length}` : result.reason, `${Date.now() - started}ms`)
  return result
}
