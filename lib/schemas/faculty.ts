import { z } from 'zod'

// ============================================
// Sub-schemas for repeatable JSONB groups
// ============================================

export const QualificationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  specialisation: z.string().default(''),
  university: z.string().default(''),
  year: z.string().default(''),
})

export const ExperienceEntrySchema = z.object({
  type: z.enum(['Teaching', 'Clinical', 'Industry', 'Research']).default('Teaching'),
  start_year: z.string().default(''),
  end_year: z.string().default(''),
  role: z.string().default(''),
  institution: z.string().default(''),
  description: z.string().default(''),
})

export const PublicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.string().default(''),
  journal: z.string().default(''),
  year: z.string().default(''),
  doi_url: z.string().url().optional().or(z.literal('')),
  pubmed_url: z.string().url().optional().or(z.literal('')),
})

export const FundedProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  agency: z.string().default(''),
  amount: z.string().default(''),
  period: z.string().default(''),
  status: z.enum(['Ongoing', 'Completed']).default('Ongoing'),
})

export const CertificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  organisation: z.string().default(''),
  year: z.string().default(''),
})

export const AwardSchema = z.object({
  name: z.string().min(1, 'Award name is required'),
  body: z.string().default(''),
  year: z.string().default(''),
})

export const MembershipSchema = z.object({
  organisation: z.string().min(1, 'Organisation is required'),
  type: z.string().default(''),
  since: z.string().default(''),
})

export const PhdScholarSchema = z.object({
  scholar_name: z.string().min(1, 'Scholar name is required'),
  research_topic: z.string().default(''),
  status: z.string().default(''),
})

export const FaqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
})

// ============================================
// Designation options
// ============================================

export const DESIGNATION_OPTIONS = [
  'Principal',
  'Vice Principal',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Senior Lecturer',
  'Guest Faculty',
  'Physical Director',
  'Librarian',
  'Other',
] as const

// ============================================
// Main Faculty Schema (for create/update)
// ============================================

export const FacultyFormSchema = z.object({
  // Tab 1: Basic Info
  full_name: z.string().min(1, 'Full name is required'),
  slug: z.string().min(1, 'URL slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  email: z.string().email('Valid email is required'),
  photo_url: z.string().optional().nullable(),
  experience_years: z.coerce.number().int().min(0).default(0),
  research_papers: z.coerce.number().int().min(0).default(0),
  phd_scholars: z.coerce.number().int().min(0).default(0),
  awards_won: z.coerce.number().int().min(0).default(0),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  badges: z.array(z.string()).default([]),

  // Tab 2: Academic
  professional_summary: z.string().default(''),
  qualifications: z.array(QualificationSchema).default([]),
  specialisations: z.array(z.string()).default([]),

  // Tab 3: Experience
  experience_entries: z.array(ExperienceEntrySchema).default([]),

  // Tab 4: Research
  research_focus_areas: z.array(z.string()).default([]),
  publications: z.array(PublicationSchema).default([]),
  funded_projects: z.array(FundedProjectSchema).default([]),
  google_scholar_url: z.string().url().optional().or(z.literal('')),
  researchgate_url: z.string().url().optional().or(z.literal('')),
  orcid_url: z.string().url().optional().or(z.literal('')),

  // Tab 5: Achievements
  certifications: z.array(CertificationSchema).default([]),
  awards: z.array(AwardSchema).default([]),
  memberships: z.array(MembershipSchema).default([]),

  // Tab 6: Mentoring
  mentoring_description: z.string().default(''),
  phd_scholars_list: z.array(PhdScholarSchema).default([]),
  pg_dissertations_guided: z.coerce.number().int().min(0).default(0),
  ug_projects_guided: z.coerce.number().int().min(0).default(0),

  // Tab 7: FAQs
  faqs: z.array(FaqSchema).default([]),
})

export type FacultyFormData = z.infer<typeof FacultyFormSchema>
export type Qualification = z.infer<typeof QualificationSchema>
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>
export type Publication = z.infer<typeof PublicationSchema>
export type FundedProject = z.infer<typeof FundedProjectSchema>
export type Certification = z.infer<typeof CertificationSchema>
export type Award = z.infer<typeof AwardSchema>
export type Membership = z.infer<typeof MembershipSchema>
export type PhdScholar = z.infer<typeof PhdScholarSchema>
export type Faq = z.infer<typeof FaqSchema>

// ============================================
// Database row type (includes id, timestamps, status)
// ============================================

export interface FacultyRow extends FacultyFormData {
  id: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  // Sync metadata (added 2026-05-07 for MyJKKN API sync)
  synced_from_api: boolean
  staff_id: string | null
  last_synced_at: string | null
}

// ============================================
// Helper: generate slug from name
// ============================================

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
