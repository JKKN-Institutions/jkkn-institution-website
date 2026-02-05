import { z } from 'zod'

/**
 * NAAC Page Type Definitions
 *
 * Type-safe schemas for NAAC accreditation page content
 * Following Next.js 16 patterns with Zod validation
 */

// Document schema
export const DocumentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  fileType: z.enum(['pdf', 'excel', 'doc', 'link']),
  size: z.string().optional(),
  uploadDate: z.string().optional(),
})

// Metric schema (for statistics display)
export const MetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string().optional(),
})

// Subsection schema (for nested content)
export const SubSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  documents: z.array(DocumentSchema).optional(),
})

// Navigation item schema
export const NavItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
})

// Content section schema
export const NAACContentSectionSchema = z.object({
  id: z.string(),
  heading: z.string(),
  overview: z.string(),
  documents: z.array(DocumentSchema),
  metrics: z.array(MetricSchema).optional(),
  subsections: z.array(SubSectionSchema).optional(),
})

// Contact info schema
export const ContactInfoSchema = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string().email(),
  phone: z.string(),
  office: z.string().optional(),
  officeHours: z.string().optional(),
})

// Main page props schema
export const NAACPagePropsSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  navigationSections: z.array(NavItemSchema),
  contentSections: z.array(NAACContentSectionSchema),
  contactInfo: ContactInfoSchema.optional(),
})

// TypeScript types inferred from schemas
export type Document = z.infer<typeof DocumentSchema>
export type Metric = z.infer<typeof MetricSchema>
export type SubSection = z.infer<typeof SubSectionSchema>
export type NavItem = z.infer<typeof NavItemSchema>
export type NAACContentSection = z.infer<typeof NAACContentSectionSchema>
export type ContactInfo = z.infer<typeof ContactInfoSchema>
export type NAACPageProps = z.infer<typeof NAACPagePropsSchema>

// Icon mapping for flexibility
export const FILE_TYPE_ICONS = {
  pdf: 'FileText',
  excel: 'Sheet',
  doc: 'FileType',
  link: 'Link',
} as const
