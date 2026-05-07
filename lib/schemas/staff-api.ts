// lib/schemas/staff-api.ts
//
// Zod schema mirroring the MyJKKN Staff API response shape.
// `.passthrough()` on every nested schema = unknown keys are tolerated rather
// than rejected, which protects us from breaking when MyJKKN adds new fields.
//
// Source of truth for API contract: docs/admin/staff-api-documentation.md

import { z } from 'zod'

const StaffQualificationSchema = z.object({
  year: z.number().int().nullable().optional(),
  degree: z.string().nullable().optional(),
  institution: z.string().nullable().optional(),
  specialization: z.string().nullable().optional(),
}).passthrough()

const StaffSpecialisationSchema = z.object({ name: z.string() }).passthrough()

const StaffExperienceEntrySchema = z.object({
  from: z.union([z.string(), z.number()]).nullable().optional(),
  to: z.union([z.string(), z.number()]).nullable().optional(),
  role: z.string().nullable().optional(),
  organisation: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
}).passthrough()

const StaffPublicationSchema = z.object({
  doi: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  title: z.string().nullable().optional(),
  journal: z.string().nullable().optional(),
}).passthrough()

const StaffFundedProjectSchema = z.object({
  title: z.string().nullable().optional(),
  agency: z.string().nullable().optional(),
  amount: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
}).passthrough()

const StaffCertificationSchema = z.object({
  name: z.string().nullable().optional(),
  issuer: z.string().nullable().optional(),
  year: z.union([z.string(), z.number()]).nullable().optional(),
}).passthrough()

const StaffAwardSchema = z.object({
  year: z.union([z.string(), z.number()]).nullable().optional(),
  title: z.string().nullable().optional(),
  awarded_by: z.string().nullable().optional(),
}).passthrough()

const StaffMembershipSchema = z.object({
  body: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  since: z.union([z.string(), z.number()]).nullable().optional(),
}).passthrough()

const StaffPhdScholarSchema = z.object({
  name: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
}).passthrough()

const StaffBadgeSchema = z.object({ label: z.string() }).passthrough()
const StaffResearchAreaSchema = z.object({ area: z.string() }).passthrough()

const StaffFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
}).passthrough()

export const StaffApiRecordSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().nullable().optional(),
  institution_email: z.string().nullable().optional(),
  designation: z.string(),
  staff_id: z.string().nullable().optional(),
  profile_picture: z.string().nullable().optional(),
  is_active: z.boolean(),
  status: z.enum(['draft', 'published']),
  has_extended_profile: z.boolean(),
  slug: z.string().nullable().optional(),
  display_order: z.number().int().default(0),
  experience_years: z.number().int().default(0),
  research_papers: z.number().int().default(0),
  phd_scholars: z.number().int().default(0),
  awards_won: z.number().int().default(0),
  pg_dissertations_guided: z.number().int().default(0),
  ug_projects_guided: z.number().int().default(0),
  qualification_summary: z.string().nullable().optional(),
  professional_summary: z.string().nullable().optional(),
  mentoring_description: z.string().nullable().optional(),
  google_scholar_url: z.string().nullable().optional(),
  researchgate_url: z.string().nullable().optional(),
  orcid_url: z.string().nullable().optional(),
  badges: z.array(StaffBadgeSchema).default([]),
  qualifications: z.array(StaffQualificationSchema).default([]),
  specialisations: z.array(StaffSpecialisationSchema).default([]),
  experience_entries: z.array(StaffExperienceEntrySchema).default([]),
  research_focus_areas: z.array(StaffResearchAreaSchema).default([]),
  publications: z.array(StaffPublicationSchema).default([]),
  funded_projects: z.array(StaffFundedProjectSchema).default([]),
  certifications: z.array(StaffCertificationSchema).default([]),
  awards: z.array(StaffAwardSchema).default([]),
  memberships: z.array(StaffMembershipSchema).default([]),
  phd_scholars_list: z.array(StaffPhdScholarSchema).default([]),
  faqs: z.array(StaffFaqSchema).default([]),
  role_key: z.string().nullable().optional(),
  institution: z.object({
    id: z.string().uuid(),
    name: z.string(),
  }).passthrough(),
  department: z.object({
    id: z.string().uuid(),
    department_name: z.string(),
  }).passthrough().nullable().optional(),
  category: z.object({
    category_name: z.string(),
    is_teaching: z.boolean(),
    shows_extended_profile: z.boolean(),
  }).passthrough().optional(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough()

export type StaffApiRecord = z.infer<typeof StaffApiRecordSchema>

export const StaffApiListResponseSchema = z.object({
  data: z.array(StaffApiRecordSchema),
  metadata: z.object({
    total: z.number(),
    returned: z.number(),
  }).passthrough(),
})

export type StaffApiListResponse = z.infer<typeof StaffApiListResponseSchema>
