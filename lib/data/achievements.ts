/**
 * Achievements Data Layer
 *
 * Data fetching functions for achievements module.
 * Note: Cache Components disabled in next.config.ts due to admin layout requirements.
 */

import { createPublicSupabaseClient } from '@/lib/supabase/server'
import type {
  FacultyAchievementWithRelations,
  StudentAchievementWithRelations,
  AchievementCategory,
  AchievementFilters,
  PaginatedAchievementsResponse,
  CourseSummary,
} from '@/types/achievements'

// =============================================================================
// ACHIEVEMENT CATEGORIES
// =============================================================================

/**
 * Get all active achievement categories
 */
export async function getAchievementCategories(): Promise<AchievementCategory[]> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('achievement_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching achievement categories:', error)
    return []
  }

  return data || []
}

/**
 * Get achievement category by slug
 */
export async function getAchievementCategoryBySlug(
  slug: string
): Promise<AchievementCategory | null> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('achievement_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error(`Error fetching category ${slug}:`, error)
    return null
  }

  return data
}

// =============================================================================
// FACULTY ACHIEVEMENTS
// =============================================================================

/**
 * Get faculty achievements with filtering and pagination
 */
export async function getFacultyAchievements(
  filters: AchievementFilters = {}
): Promise<FacultyAchievementWithRelations[]> {
  const supabase = createPublicSupabaseClient()

  let query = supabase
    .from('faculty_achievements')
    .select(`
      *,
      category:achievement_categories(id, name, slug, icon, color),
      course:courses(id, name, code, level)
    `)

  // Apply filters
  if (filters.courseId) {
    query = query.eq('course_id', filters.courseId)
  }

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters.year) {
    query = query.eq('achievement_year', filters.year)
  }

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive)
  } else {
    // Default to showing only active achievements
    query = query.eq('is_active', true)
  }

  if (filters.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured)
  }

  // Apply search filter
  if (filters.search && filters.search.trim()) {
    query = query.textSearch('title', filters.search.trim(), {
      type: 'websearch',
      config: 'english'
    })
  }

  // Sort by custom priority order (lower number = higher priority)
  query = query.order('display_order', { ascending: true })
  query = query.order('achievement_date', { ascending: false, nullsFirst: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching faculty achievements:', error)
    return []
  }

  return data || []
}

/**
 * Get featured faculty achievements (for "All Courses" tab)
 */
export async function getFeaturedFacultyAchievements(
  limit = 10
): Promise<FacultyAchievementWithRelations[]> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('faculty_achievements')
    .select(`
      *,
      category:achievement_categories(id, name, slug, icon, color),
      course:courses(id, name, code, level)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .order('achievement_date', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured faculty achievements:', error)
    return []
  }

  return data || []
}

/**
 * Get faculty achievement by ID
 */
export async function getFacultyAchievementById(
  id: string
): Promise<FacultyAchievementWithRelations | null> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('faculty_achievements')
    .select(`
      *,
      category:achievement_categories(id, name, slug, icon, color),
      course:courses(id, name, code, level)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching faculty achievement ${id}:`, error)
    return null
  }

  return data
}

// =============================================================================
// STUDENT ACHIEVEMENTS
// =============================================================================

/**
 * Get student achievements with filtering
 */
export async function getStudentAchievements(
  filters: AchievementFilters = {}
): Promise<StudentAchievementWithRelations[]> {
  const supabase = createPublicSupabaseClient()

  let query = supabase
    .from('student_achievements')
    .select(`
      *,
      category:achievement_categories(id, name, slug, icon, color),
      course:courses(id, name, code, level)
    `)

  // Apply filters
  if (filters.courseId) {
    query = query.eq('course_id', filters.courseId)
  }

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters.year) {
    query = query.eq('achievement_year', filters.year)
  }

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive)
  } else {
    query = query.eq('is_active', true)
  }

  if (filters.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured)
  }

  // Apply search filter
  if (filters.search && filters.search.trim()) {
    query = query.textSearch('title', filters.search.trim(), {
      type: 'websearch',
      config: 'english'
    })
  }

  // Sort by custom priority order
  query = query.order('display_order', { ascending: true })
  query = query.order('achievement_date', { ascending: false, nullsFirst: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching student achievements:', error)
    return []
  }

  return data || []
}

/**
 * Get featured student achievements (for "All Courses" tab)
 */
export async function getFeaturedStudentAchievements(
  limit = 10
): Promise<StudentAchievementWithRelations[]> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('student_achievements')
    .select(`
      *,
      category:achievement_categories(id, name, slug, icon, color),
      course:courses(id, name, code, level)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .order('achievement_date', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured student achievements:', error)
    return []
  }

  return data || []
}

/**
 * Get student achievement by ID
 */
export async function getStudentAchievementById(
  id: string
): Promise<StudentAchievementWithRelations | null> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('student_achievements')
    .select(`
      *,
      category:achievement_categories(id, name, slug, icon, color),
      course:courses(id, name, code, level)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching student achievement ${id}:`, error)
    return null
  }

  return data
}

// =============================================================================
// COURSES (for filtering)
// =============================================================================

/**
 * Get all active courses for achievement filtering
 */
export async function getActiveCoursesForAchievements(): Promise<CourseSummary[]> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('courses')
    .select('id, name, code, level')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }

  return data || []
}

/**
 * Get courses that have achievements (for tab navigation)
 * Returns only courses that have at least one faculty or student achievement
 */
export async function getCoursesWithAchievements(): Promise<CourseSummary[]> {
  const supabase = createPublicSupabaseClient()

  // Get distinct course IDs from both faculty and student achievements
  const { data: facultyCourses, error: facultyError } = await supabase
    .from('faculty_achievements')
    .select('course_id')
    .eq('is_active', true)
    .not('course_id', 'is', null)

  const { data: studentCourses, error: studentError } = await supabase
    .from('student_achievements')
    .select('course_id')
    .eq('is_active', true)
    .not('course_id', 'is', null)

  if (facultyError || studentError) {
    console.error('Error fetching courses with achievements')
    return []
  }

  // Combine and deduplicate course IDs
  const courseIds = Array.from(
    new Set([
      ...(facultyCourses?.map((f) => f.course_id).filter(Boolean) || []),
      ...(studentCourses?.map((s) => s.course_id).filter(Boolean) || []),
    ])
  )

  if (courseIds.length === 0) {
    return []
  }

  // Fetch course details for these IDs
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, name, code, level')
    .in('id', courseIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (coursesError) {
    console.error('Error fetching course details:', coursesError)
    return []
  }

  return courses || []
}

// =============================================================================
// YEAR FILTERING
// =============================================================================

/**
 * Get distinct years with achievements (for year filter dropdown)
 */
export async function getAchievementYears(): Promise<number[]> {
  const supabase = createPublicSupabaseClient()

  // Get distinct years from faculty achievements
  const { data: facultyYears } = await supabase
    .from('faculty_achievements')
    .select('achievement_year')
    .eq('is_active', true)
    .not('achievement_year', 'is', null)

  // Get distinct years from student achievements
  const { data: studentYears } = await supabase
    .from('student_achievements')
    .select('achievement_year')
    .eq('is_active', true)
    .not('achievement_year', 'is', null)

  // Combine and deduplicate years
  const years = Array.from(
    new Set([
      ...(facultyYears?.map((f) => f.achievement_year).filter(Boolean) || []),
      ...(studentYears?.map((s) => s.achievement_year).filter(Boolean) || []),
    ])
  ).sort((a, b) => b - a) // Sort descending (newest first)

  return years as number[]
}

// =============================================================================
// COMBINED DATA FETCHING
// =============================================================================

/**
 * Get all achievements (faculty + student) for a specific course
 * Useful for displaying both sections on the achievements page
 */
export async function getAchievementsByCourse(courseId: string | null) {
  const filters: AchievementFilters = courseId ? { courseId } : {}

  const [facultyAchievements, studentAchievements] = await Promise.all([
    getFacultyAchievements(filters),
    getStudentAchievements(filters),
  ])

  return {
    faculty: facultyAchievements,
    students: studentAchievements,
  }
}

/**
 * Get featured achievements (for "All Courses" tab)
 */
export async function getFeaturedAchievements() {
  const [facultyAchievements, studentAchievements] = await Promise.all([
    getFeaturedFacultyAchievements(10),
    getFeaturedStudentAchievements(10),
  ])

  return {
    faculty: facultyAchievements,
    students: studentAchievements,
  }
}
