// lib/schemas/public-careers.ts
//
// Zod schemas mirroring the MyJKKN Public Careers API (contract:
// MyJKKN docs/public-careers-api.md). `.passthrough()` tolerates new fields the
// API may add later; missing/renamed fields still fail loudly at the boundary.

import { z } from 'zod'

export const JOB_TYPES = ['full_time', 'part_time', 'contract', 'internship', 'freelance'] as const
export type JobType = (typeof JOB_TYPES)[number]

const NamedRefSchema = z.object({ id: z.string(), name: z.string() }).passthrough()

export const PublicJobSchema = z.object({
  id: z.string(),
  job_code: z.string().nullable(),
  title: z.string(),
  role_category: z.string(),
  job_type: z.string().nullable(),
  description: z.string().nullable(),
  institution: NamedRefSchema.nullable(),
  department: NamedRefSchema.nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  education_level: z.string().nullable(),
  min_experience_years: z.number().nullable(),
  max_experience_years: z.number().nullable(),
  qualifications: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  positions_open: z.number(),
  posted_at: z.string().nullable(),
  closes_at: z.string().nullable(),
  salary: z
    .object({
      min: z.number().nullable(),
      max: z.number().nullable(),
      currency: z.string(),
      duration: z.string(),
    })
    .nullable(),
}).passthrough()
export type PublicJob = z.infer<typeof PublicJobSchema>

export const InstitutionFacetSchema = z.object({
  id: z.string(),
  name: z.string(),
  open_jobs: z.number(),
}).passthrough()
export type InstitutionFacet = z.infer<typeof InstitutionFacetSchema>

export const JobListResponseSchema = z.object({
  data: z.array(PublicJobSchema),
  institutions: z.array(InstitutionFacetSchema).default([]),
})
export type JobListResponse = z.infer<typeof JobListResponseSchema>

export const JobDetailResponseSchema = z.object({ data: PublicJobSchema })
