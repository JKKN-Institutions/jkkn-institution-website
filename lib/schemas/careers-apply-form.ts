// lib/schemas/careers-apply-form.ts
//
// The apply form's field rules (mirrors the MyJKKN apply field table,
// MyJKKN docs/public-careers-api.md §3). Shared by the form in the browser
// and the resume auto-fill on the server, so a value read from a resume is
// held to exactly the rules a typed value is. Pure; safe on both sides.

import { z } from 'zod'

export const MAX_CITIES_LENGTH = 1000

const optionalMonths = z
  .string()
  .trim()
  .refine(v => v === '' || /^\d{1,3}$/.test(v), 'Whole months only.')
  .refine(v => v === '' || Number(v) <= 720, 'Enter 0–720 months.')

export const applyFormSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.').max(100),
  last_name: z.string().trim().min(1, 'Last name is required.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(200),
  phone: z.string().trim().refine(
    v => /^\d{10,15}$/.test(v.replace(/[\s+\-()]/g, '')),
    'Enter a valid phone number (10-15 digits).',
  ),
  qualification: z.string().trim().min(1, 'Qualification is required.').max(200),
  experience_months: z
    .string()
    .trim()
    .refine(v => /^\d{1,3}$/.test(v), 'Enter your experience as whole months (0 for freshers).')
    .refine(v => Number(v) <= 720, 'Enter 0–720 months.'),
  current_job_title: z.string().trim().max(150),
  current_company: z.string().trim().max(150),
  current_job_duration_months: optionalMonths,
  worked_cities: z.string().trim().max(MAX_CITIES_LENGTH),
  consent: z.boolean().refine(v => v === true, 'Please accept the privacy consent to apply.'),
  website: z.string().max(0), // honeypot
})
export type ApplyFormValues = z.infer<typeof applyFormSchema>

/** The fields a candidate types — and that a resume may fill. */
export const AUTOFILL_FIELDS = [
  'first_name', 'last_name', 'email', 'phone', 'qualification', 'experience_months',
  'current_job_title', 'current_company', 'current_job_duration_months', 'worked_cities',
] as const satisfies ReadonlyArray<keyof ApplyFormValues>
export type AutofillField = (typeof AUTOFILL_FIELDS)[number]
