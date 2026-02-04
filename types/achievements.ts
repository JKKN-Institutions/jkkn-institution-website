/**
 * Achievement Types and Validation Schemas
 *
 * This file contains TypeScript types and Zod validation schemas for the
 * achievements module (faculty achievements, student achievements, and categories).
 */

import { z } from 'zod'

// =============================================================================
// DATABASE TYPES (matching Supabase schema)
// =============================================================================

/**
 * Achievement Category
 * Tags for classifying achievements (Research, Teaching, Competition, etc.)
 */
export interface AchievementCategory {
  id: string
  college_id: string
  name: string
  slug: string
  description: string | null
  icon: string | null // Lucide icon name
  color: string // Hex color code
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Faculty Achievement
 * Accomplishments and recognitions for faculty members
 */
export interface FacultyAchievement {
  id: string
  college_id: string
  course_id: string | null
  category_id: string | null
  title: string
  description: string // Markdown format
  faculty_name: string
  faculty_designation: string | null
  achievement_date: string | null // Date string
  achievement_year: number | null
  display_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
}

/**
 * Student Achievement
 * Accomplishments and recognitions for students
 */
export interface StudentAchievement {
  id: string
  college_id: string
  course_id: string | null
  category_id: string | null
  title: string
  description: string // Markdown format
  student_name: string
  student_roll_number: string | null
  achievement_date: string | null // Date string
  achievement_year: number | null
  display_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
}

// =============================================================================
// EXTENDED TYPES (with relations)
// =============================================================================

/**
 * Faculty Achievement with related data
 */
export interface FacultyAchievementWithRelations extends FacultyAchievement {
  category?: AchievementCategory | null
  course?: {
    id: string
    name: string
    code: string
    level: string | null
  } | null
}

/**
 * Student Achievement with related data
 */
export interface StudentAchievementWithRelations extends StudentAchievement {
  category?: AchievementCategory | null
  course?: {
    id: string
    name: string
    code: string
    level: string | null
  } | null
}

// =============================================================================
// FILTER TYPES
// =============================================================================

/**
 * Filters for achievement queries
 */
export interface AchievementFilters {
  courseId?: string | null
  categoryId?: string | null
  year?: number | null
  search?: string | null
  isActive?: boolean
  isFeatured?: boolean
}

/**
 * Pagination and sorting parameters
 */
export interface AchievementQueryParams extends AchievementFilters {
  page?: number
  pageSize?: number
  sortBy?: 'display_order' | 'achievement_date' | 'created_at' | 'title'
  sortOrder?: 'asc' | 'desc'
}

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

/**
 * Validation schema for creating an achievement category
 */
export const CreateAchievementCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(100, 'Category name is too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string()
    .max(500, 'Description is too long')
    .optional()
    .nullable(),
  icon: z.string()
    .max(50, 'Icon name is too long')
    .optional()
    .nullable(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code (e.g., #3b82f6)')
    .default('#3b82f6'),
  sort_order: z.number()
    .int('Sort order must be an integer')
    .min(0, 'Sort order must be non-negative')
    .default(0),
  is_active: z.boolean().default(true),
})

export type CreateAchievementCategoryInput = z.infer<typeof CreateAchievementCategorySchema>

/**
 * Validation schema for updating an achievement category
 */
export const UpdateAchievementCategorySchema = CreateAchievementCategorySchema.partial()

export type UpdateAchievementCategoryInput = z.infer<typeof UpdateAchievementCategorySchema>

/**
 * Validation schema for creating a faculty achievement
 */
export const CreateFacultyAchievementSchema = z.object({
  course_id: z.string().uuid('Invalid course ID').optional().nullable(),
  category_id: z.string().uuid('Invalid category ID').optional().nullable(),
  title: z.string()
    .min(1, 'Title is required')
    .max(500, 'Title is too long'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(10000, 'Description is too long'),
  faculty_name: z.string()
    .min(1, 'Faculty name is required')
    .max(255, 'Faculty name is too long'),
  faculty_designation: z.string()
    .max(255, 'Designation is too long')
    .optional()
    .nullable(),
  achievement_date: z.coerce.date().optional().nullable(),
  display_order: z.number()
    .int('Display order must be an integer')
    .min(0, 'Display order must be non-negative')
    .default(0),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export type CreateFacultyAchievementInput = z.infer<typeof CreateFacultyAchievementSchema>

/**
 * Validation schema for updating a faculty achievement
 */
export const UpdateFacultyAchievementSchema = CreateFacultyAchievementSchema.partial()

export type UpdateFacultyAchievementInput = z.infer<typeof UpdateFacultyAchievementSchema>

/**
 * Validation schema for creating a student achievement
 */
export const CreateStudentAchievementSchema = z.object({
  course_id: z.string().uuid('Invalid course ID').optional().nullable(),
  category_id: z.string().uuid('Invalid category ID').optional().nullable(),
  title: z.string()
    .min(1, 'Title is required')
    .max(500, 'Title is too long'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(10000, 'Description is too long'),
  student_name: z.string()
    .min(1, 'Student name is required')
    .max(255, 'Student name is too long'),
  student_roll_number: z.string()
    .max(100, 'Roll number is too long')
    .optional()
    .nullable(),
  achievement_date: z.coerce.date().optional().nullable(),
  display_order: z.number()
    .int('Display order must be an integer')
    .min(0, 'Display order must be non-negative')
    .default(0),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export type CreateStudentAchievementInput = z.infer<typeof CreateStudentAchievementSchema>

/**
 * Validation schema for updating a student achievement
 */
export const UpdateStudentAchievementSchema = CreateStudentAchievementSchema.partial()

export type UpdateStudentAchievementInput = z.infer<typeof UpdateStudentAchievementSchema>

/**
 * Validation schema for achievement filter parameters
 */
export const AchievementFiltersSchema = z.object({
  courseId: z.string().uuid().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  search: z.string().max(255).optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

/**
 * Validation schema for achievement query parameters (with pagination)
 */
export const AchievementQueryParamsSchema = AchievementFiltersSchema.extend({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['display_order', 'achievement_date', 'created_at', 'title'])
    .default('display_order'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type AchievementQueryParamsInput = z.infer<typeof AchievementQueryParamsSchema>

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Response type for paginated achievement queries
 */
export interface PaginatedAchievementsResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

/**
 * Course summary for dropdowns/filters
 */
export interface CourseSummary {
  id: string
  name: string
  code: string
  level: string | null
}

/**
 * Achievement statistics
 */
export interface AchievementStats {
  totalFacultyAchievements: number
  totalStudentAchievements: number
  achievementsByCategory: Array<{
    category: AchievementCategory
    count: number
  }>
  achievementsByYear: Array<{
    year: number
    facultyCount: number
    studentCount: number
  }>
  achievementsByCourse: Array<{
    course: CourseSummary
    facultyCount: number
    studentCount: number
  }>
}

/**
 * Form state for Server Actions
 */
export interface AchievementFormState {
  success?: boolean
  message?: string
  errors?: {
    [key: string]: string[] | undefined
  }
}
