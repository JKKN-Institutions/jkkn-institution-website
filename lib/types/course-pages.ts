import { z } from 'zod'

/**
 * Unified Course Page Type System
 *
 * This type system supports both:
 * - UG Courses (BE-CSE, BE-ECE, BE-IT, BE-Mechanical, BE-EEE) - Flat structure
 * - PG Courses (ME-CSE, MBA) - Nested structure
 *
 * Institution: JKKN Engineering College
 */

// ============================================
// Course Type Enum
// ============================================

export const COURSE_TYPES = {
  // Undergraduate Programs
  BE_CSE: 'be-cse',
  BE_ECE: 'be-ece',
  BE_EEE: 'be-eee',
  BE_IT: 'be-it',
  BE_MECHANICAL: 'be-mechanical',
  BE_CIVIL: 'be-civil',

  // Postgraduate Programs
  ME_CSE: 'me-cse',
  ME_APPLIED_ELECTRONICS: 'me-applied-electronics',
  MBA: 'mba',
} as const

export type CourseType = typeof COURSE_TYPES[keyof typeof COURSE_TYPES]

export const COURSE_CATEGORIES = {
  UNDERGRADUATE: 'undergraduate',
  POSTGRADUATE: 'postgraduate',
} as const

export type CourseCategory = typeof COURSE_CATEGORIES[keyof typeof COURSE_CATEGORIES]

// ============================================
// Common Schemas (Used by Both UG and PG)
// ============================================

export const HeroCTASchema = z.object({
  label: z.string(),
  link: z.string(),
  variant: z.enum(['primary', 'secondary', 'outline']),
})

export const FAQSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export const SubjectCourseSchema = z.object({
  code: z.string().optional(),
  name: z.string(),
  credits: z.number(),
})

export const SemesterSchema = z.object({
  semester: z.number(),
  credits: z.number(),
  subjects: z.array(SubjectCourseSchema).optional(),
  courses: z.array(SubjectCourseSchema).optional(),
})

export const CurriculumYearSchema = z.object({
  year: z.number(),
  semesters: z.array(SemesterSchema),
})

// ============================================
// UG-Specific Schemas (Flat Structure)
// ============================================

export const UGHeroStatSchema = z.object({
  icon: z.string(),
  label: z.string(),
  value: z.string(),
})

export const UGOverviewCardSchema = z.object({
  icon: z.string(),
  title: z.string(),
  value: z.string(),
  description: z.string(),
})

export const BenefitSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
})

export const SpecializationSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
})

export const CareerPathSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  avgSalary: z.string().optional(),
})

export const UGAdmissionStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  details: z.array(z.string()).optional(),
})

export const FeeComponentSchema = z.object({
  component: z.string(),
  amount: z.string(),
  isTotal: z.boolean().optional(),
})

export const FacilitySchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  description: z.string(),
  features: z.array(z.string()).optional(),
})

export const UGFacultySchema = z.object({
  name: z.string(),
  designation: z.string(),
  qualification: z.string(),
  specialization: z.string(),
  image: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
})

export const UGPlacementStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.string(),
  description: z.string().optional(),
})

// ============================================
// PG-Specific Schemas (Nested Structure)
// ============================================

export const PGHeroStatSchema = z.object({
  number: z.string(),
  label: z.string(),
})

export const HeroFeatureSchema = z.object({
  icon: z.string(),
  text: z.string(),
})

export const QuickFactSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const ImportantDateSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const HighlightCardSchema = z.object({
  icon: z.string(),
  number: z.string(),
  label: z.string(),
  description: z.string().optional(),
})

export const PGSpecializationSchema = z.object({
  title: z.string(),
  badge: z.string().optional(),
  description: z.string(),
  image: z.string().optional(),
  topics: z.array(z.string()),
})

export const LabSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  equipment: z.array(z.string()).optional(),
})

export const PGPlacementStatSchema = z.object({
  number: z.string(),
  label: z.string(),
  icon: z.string().optional(),
})

export const RecruiterSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
})

export const PGFacultySchema = z.object({
  name: z.string(),
  designation: z.string(),
  qualification: z.string(),
  photo: z.string().optional(),
  specialization: z.string().optional(),
  email: z.string().optional(),
})

export const ContactInfoSchema = z.object({
  type: z.enum(['phone', 'email', 'address', 'website']),
  title: z.string(),
  details: z.array(z.string()),
})

// ============================================
// UG Course Page Props Schema (Flat Structure)
// ============================================

export const UGCoursePagePropsSchema = z.object({
  // Hero Section (Flat)
  heroTitle: z.string(),
  heroSubtitle: z.string().optional(),
  heroStats: z.array(UGHeroStatSchema),
  heroCTAs: z.array(HeroCTASchema),
  affiliatedTo: z.string(),
  heroImage: z.string().optional(),

  // Course Overview
  overviewTitle: z.string(),
  overviewCards: z.array(UGOverviewCardSchema),

  // Why Choose Section
  whyChooseTitle: z.string(),
  benefits: z.array(BenefitSchema),

  // Curriculum
  curriculumTitle: z.string(),
  curriculumYears: z.array(CurriculumYearSchema),

  // Specializations (Optional)
  specializationsTitle: z.string().optional(),
  specializations: z.array(SpecializationSchema).optional(),

  // Career Opportunities
  careerTitle: z.string(),
  careerPaths: z.array(CareerPathSchema),

  // Top Recruiters
  recruitersTitle: z.string(),
  recruiters: z.array(z.string()),

  // Admission Process
  admissionTitle: z.string(),
  admissionSteps: z.array(UGAdmissionStepSchema),

  // Fee Structure
  feeTitle: z.string(),
  feeDescription: z.string().optional(),
  feeBreakdown: z.array(FeeComponentSchema),

  // Facilities
  facilitiesTitle: z.string(),
  facilities: z.array(FacilitySchema),

  // Faculty
  facultyTitle: z.string(),
  faculty: z.array(UGFacultySchema),

  // Placement
  placementsTitle: z.string(),
  placementStats: z.array(UGPlacementStatSchema).optional(),

  // FAQs
  faqTitle: z.string(),
  faqs: z.array(FAQSchema),

  // Final CTA
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtons: z.array(HeroCTASchema).optional(),
  ctaContact: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  }).optional(),

  // Styling
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  backgroundColor: z.string().optional(),
})

export type UGCoursePageProps = z.infer<typeof UGCoursePagePropsSchema>

// ============================================
// PG Course Page Props Schema (Nested Structure)
// ============================================

export const PGCoursePagePropsSchema = z.object({
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    highlightedText: z.string(),
    subtitle: z.string(),
    features: z.array(HeroFeatureSchema),
    ctaButtons: z.array(HeroCTASchema),
    image: z.string(),
    stats: z.array(PGHeroStatSchema),
  }),

  overview: z.object({
    label: z.string(),
    title: z.string(),
    content: z.array(z.string()),
    quickFacts: z.array(QuickFactSchema),
    importantDates: z.array(ImportantDateSchema).optional(),
  }),

  highlights: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
    cards: z.array(HighlightCardSchema),
  }),

  specializations: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(PGSpecializationSchema),
  }),

  curriculum: z.object({
    label: z.string(),
    title: z.string(),
    years: z.array(CurriculumYearSchema),
  }),

  eligibility: z.object({
    label: z.string(),
    title: z.string(),
    academicRequirements: z.array(z.string()),
    admissionProcess: z.array(z.string()),
  }),

  infrastructure: z.object({
    label: z.string(),
    title: z.string(),
    labs: z.array(LabSchema),
  }).optional(),

  placement: z.object({
    label: z.string(),
    title: z.string(),
    stats: z.array(PGPlacementStatSchema),
    recruiters: z.array(RecruiterSchema),
  }),

  faculty: z.object({
    label: z.string(),
    title: z.string(),
    members: z.array(PGFacultySchema),
  }),

  faqs: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string().optional(),
    items: z.array(FAQSchema),
  }),

  cta: z.object({
    title: z.string(),
    description: z.string(),
    buttons: z.array(HeroCTASchema),
  }).optional(),

  contact: z.object({
    label: z.string(),
    title: z.string(),
    description: z.string().optional(),
    info: z.array(ContactInfoSchema),
  }).optional(),

  colors: z.object({
    primaryColor: z.string(),
    accentColor: z.string(),
    backgroundColor: z.string().optional(),
  }).optional(),
})

export type PGCoursePageProps = z.infer<typeof PGCoursePagePropsSchema>

// ============================================
// Unified Course Page Schema (Discriminated Union)
// ============================================

export const CoursePageSchema = z.discriminatedUnion('category', [
  z.object({
    category: z.literal('undergraduate'),
    courseType: z.enum([
      COURSE_TYPES.BE_CSE,
      COURSE_TYPES.BE_ECE,
      COURSE_TYPES.BE_EEE,
      COURSE_TYPES.BE_IT,
      COURSE_TYPES.BE_MECHANICAL,
      COURSE_TYPES.BE_CIVIL,
    ]),
    data: UGCoursePagePropsSchema,
  }),
  z.object({
    category: z.literal('postgraduate'),
    courseType: z.enum([
      COURSE_TYPES.ME_CSE,
      COURSE_TYPES.ME_APPLIED_ELECTRONICS,
      COURSE_TYPES.MBA,
    ]),
    data: PGCoursePagePropsSchema,
  }),
])

export type CoursePage = z.infer<typeof CoursePageSchema>

// ============================================
// Course Metadata Schema
// ============================================

export const CourseMetadataSchema = z.object({
  id: z.string().uuid(),
  courseType: z.string(),
  category: z.enum(['undergraduate', 'postgraduate']),
  courseName: z.string(),
  courseCode: z.string().optional(),
  department: z.string(),
  duration: z.string(), // e.g., "4 Years", "2 Years"
  degreeAwarded: z.string(), // e.g., "B.E.", "M.E."
  affiliation: z.string(), // e.g., "Anna University"
  accreditations: z.array(z.string()).optional(), // e.g., ["AICTE", "NAAC"]
  intake: z.number().optional(), // Number of seats
  status: z.enum(['draft', 'published', 'archived']),
  slug: z.string(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid().optional(),
  version: z.number().optional(),
})

export type CourseMetadata = z.infer<typeof CourseMetadataSchema>

// ============================================
// Complete Course Record (Metadata + Content)
// ============================================

export const CourseRecordSchema = z.object({
  metadata: CourseMetadataSchema,
  content: z.union([UGCoursePagePropsSchema, PGCoursePagePropsSchema]),
})

export type CourseRecord = z.infer<typeof CourseRecordSchema>

// ============================================
// Helper Types for Image Management
// ============================================

export interface CourseImage {
  id: string
  courseId: string
  imageType: 'hero' | 'facility' | 'faculty' | 'lab' | 'specialization' | 'recruiter_logo'
  imageUrl: string
  imagePath: string
  altText?: string
  caption?: string
  displayOrder?: number
  width?: number
  height?: number
  fileSize?: number
  mimeType?: string
  uploadedAt: string
  uploadedBy?: string
}

export const CourseImageSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  imageType: z.enum(['hero', 'facility', 'faculty', 'lab', 'specialization', 'recruiter_logo', 'other']),
  imageUrl: z.string().url(),
  imagePath: z.string(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  displayOrder: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  uploadedAt: z.string().datetime(),
  uploadedBy: z.string().uuid().optional(),
})

// ============================================
// Course Page Version History
// ============================================

export const CourseVersionSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  versionNumber: z.number(),
  content: z.union([UGCoursePagePropsSchema, PGCoursePagePropsSchema]),
  metadata: CourseMetadataSchema.partial(),
  changeDescription: z.string().optional(),
  createdAt: z.string().datetime(),
  createdBy: z.string().uuid().optional(),
  status: z.enum(['current', 'archived', 'draft']),
})

export type CourseVersion = z.infer<typeof CourseVersionSchema>

// ============================================
// Type Guards
// ============================================

export function isUGCourse(course: CoursePage): course is Extract<CoursePage, { category: 'undergraduate' }> {
  return course.category === 'undergraduate'
}

export function isPGCourse(course: CoursePage): course is Extract<CoursePage, { category: 'postgraduate' }> {
  return course.category === 'postgraduate'
}

export function getCourseCategoryFromType(courseType: CourseType): CourseCategory {
  const ugTypes: CourseType[] = [
    COURSE_TYPES.BE_CSE,
    COURSE_TYPES.BE_ECE,
    COURSE_TYPES.BE_EEE,
    COURSE_TYPES.BE_IT,
    COURSE_TYPES.BE_MECHANICAL,
    COURSE_TYPES.BE_CIVIL,
  ]

  return ugTypes.includes(courseType) ? 'undergraduate' : 'postgraduate'
}

// ============================================
// Course Display Names
// ============================================

export const COURSE_DISPLAY_NAMES: Record<CourseType, string> = {
  [COURSE_TYPES.BE_CSE]: 'B.E. Computer Science and Engineering',
  [COURSE_TYPES.BE_ECE]: 'B.E. Electronics and Communication Engineering',
  [COURSE_TYPES.BE_EEE]: 'B.E. Electrical and Electronics Engineering',
  [COURSE_TYPES.BE_IT]: 'B.Tech Information Technology',
  [COURSE_TYPES.BE_MECHANICAL]: 'B.E. Mechanical Engineering',
  [COURSE_TYPES.BE_CIVIL]: 'B.E. Civil Engineering',
  [COURSE_TYPES.ME_CSE]: 'M.E. Computer Science and Engineering',
  [COURSE_TYPES.ME_APPLIED_ELECTRONICS]: 'M.E. Applied Electronics',
  [COURSE_TYPES.MBA]: 'Master of Business Administration',
}

// ============================================
// Default Values for New Courses
// ============================================

export const DEFAULT_UG_COURSE: Partial<UGCoursePageProps> = {
  heroStats: [],
  heroCTAs: [],
  affiliatedTo: 'Affiliated to Anna University | Approved by AICTE',
  overviewCards: [],
  benefits: [],
  curriculumYears: [],
  careerPaths: [],
  recruiters: [],
  admissionSteps: [],
  feeBreakdown: [],
  facilities: [],
  faculty: [],
  faqs: [],
  primaryColor: '#0b6d41',
  accentColor: '#ffde59',
  backgroundColor: '#fbfbee',
}

export const DEFAULT_PG_COURSE: Partial<PGCoursePageProps> = {
  hero: {
    badge: 'AICTE Approved | NAAC Accredited',
    title: '',
    highlightedText: '',
    subtitle: '',
    features: [],
    ctaButtons: [],
    image: '',
    stats: [],
  },
  colors: {
    primaryColor: '#0b6d41',
    accentColor: '#ffde59',
    backgroundColor: '#fbfbee',
  },
}
