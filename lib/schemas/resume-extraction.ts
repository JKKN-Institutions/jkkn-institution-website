// lib/schemas/resume-extraction.ts
//
// What Claude must return when it reads a resume (spec 2026-10-12 §4.2). It is
// sent as a structured-output format, so every response has exactly these keys.
// No length or range rules here — normalizeResumeFields applies the apply
// form's own rules afterwards. Every value is nullable: the model is told to
// return null rather than guess.

import { z } from 'zod'

export const ResumeExtractionSchema = z.object({
  first_name: z.string().nullable().describe('Given name(s)'),
  last_name: z.string().nullable().describe('Family name or initial(s)'),
  email: z.string().nullable(),
  phone: z.string().nullable().describe('One phone number, as written'),
  highest_qualification: z.string().nullable()
    .describe('Highest degree with its specialisation, e.g. "M.E. Computer Science and Engineering"'),
  total_experience_months: z.number().nullable().describe('Total months of employment up to today'),
  current_job_title: z.string().nullable(),
  current_company: z.string().nullable(),
  current_job_duration_months: z.number().nullable().describe('Months in the current role up to today'),
  worked_cities: z.array(z.string()).describe('Cities where the applicant was employed'),
})
export type ResumeExtraction = z.infer<typeof ResumeExtractionSchema>
