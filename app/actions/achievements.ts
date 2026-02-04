/**
 * Server Actions for Achievements Module
 *
 * CRUD operations for faculty achievements, student achievements, and categories.
 * All mutations use Next.js 16 Server Actions with proper validation and cache invalidation.
 */

'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  CreateAchievementCategorySchema,
  UpdateAchievementCategorySchema,
  CreateFacultyAchievementSchema,
  UpdateFacultyAchievementSchema,
  CreateStudentAchievementSchema,
  UpdateStudentAchievementSchema,
  type AchievementFormState,
} from '@/types/achievements'

// =============================================================================
// ACHIEVEMENT CATEGORIES
// =============================================================================

/**
 * Create a new achievement category
 */
export async function createAchievementCategory(
  prevState: AchievementFormState | null,
  formData: FormData
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Validate form data
    const rawData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description') || null,
      icon: formData.get('icon') || null,
      color: formData.get('color') || '#3b82f6',
      sort_order: formData.get('sort_order')
        ? parseInt(formData.get('sort_order') as string)
        : 0,
      is_active: formData.get('is_active') === 'true',
    }

    const validation = CreateAchievementCategorySchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check all fields.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Get college_id from colleges table (for now, get first college)
    const { data: colleges } = await supabase
      .from('colleges')
      .select('id')
      .limit(1)
      .single()

    if (!colleges) {
      return { success: false, message: 'No college found. Please contact support.' }
    }

    // Insert category
    const { error } = await supabase
      .from('achievement_categories')
      .insert([
        {
          ...validation.data,
          college_id: colleges.id,
        },
      ])

    if (error) {
      console.error('Error creating achievement category:', error)
      return {
        success: false,
        message: error.message || 'Failed to create category. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('achievement-categories')
    revalidatePath('/admin/achievements/categories')

    return {
      success: true,
      message: 'Achievement category created successfully!',
    }
  } catch (error) {
    console.error('Unexpected error creating category:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Update an existing achievement category
 */
export async function updateAchievementCategory(
  id: string,
  prevState: AchievementFormState | null,
  formData: FormData
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Validate form data
    const rawData = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => {
        if (key === 'sort_order') {
          return [key, value ? parseInt(value as string) : undefined]
        }
        if (key === 'is_active') {
          return [key, value === 'true']
        }
        return [key, value || undefined]
      })
    )

    const validation = UpdateAchievementCategorySchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check all fields.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Update category
    const { error } = await supabase
      .from('achievement_categories')
      .update(validation.data)
      .eq('id', id)

    if (error) {
      console.error('Error updating achievement category:', error)
      return {
        success: false,
        message: error.message || 'Failed to update category. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('achievement-categories')
    updateTag(`category-${id}`)
    revalidatePath('/admin/achievements/categories')

    return {
      success: true,
      message: 'Achievement category updated successfully!',
    }
  } catch (error) {
    console.error('Unexpected error updating category:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Delete an achievement category
 */
export async function deleteAchievementCategory(
  id: string
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Delete category
    const { error } = await supabase
      .from('achievement_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting achievement category:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete category. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('achievement-categories')
    updateTag(`category-${id}`)
    revalidatePath('/admin/achievements/categories')

    return {
      success: true,
      message: 'Achievement category deleted successfully!',
    }
  } catch (error) {
    console.error('Unexpected error deleting category:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

// =============================================================================
// FACULTY ACHIEVEMENTS
// =============================================================================

/**
 * Create a new faculty achievement
 */
export async function createFacultyAchievement(
  prevState: AchievementFormState | null,
  formData: FormData
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Validate form data
    const rawData = {
      course_id: formData.get('course_id') || null,
      category_id: formData.get('category_id') || null,
      title: formData.get('title'),
      description: formData.get('description'),
      faculty_name: formData.get('faculty_name'),
      faculty_designation: formData.get('faculty_designation') || null,
      achievement_date: formData.get('achievement_date') || null,
      display_order: formData.get('display_order')
        ? parseInt(formData.get('display_order') as string)
        : 0,
      is_featured: formData.get('is_featured') === 'true',
      is_active: formData.get('is_active') !== 'false', // Default to true
    }

    const validation = CreateFacultyAchievementSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check all fields.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Get college_id
    const { data: colleges } = await supabase
      .from('colleges')
      .select('id')
      .limit(1)
      .single()

    if (!colleges) {
      return { success: false, message: 'No college found. Please contact support.' }
    }

    // Insert achievement
    const { error } = await supabase.from('faculty_achievements').insert([
      {
        ...validation.data,
        college_id: colleges.id,
        created_by: user.id,
      },
    ])

    if (error) {
      console.error('Error creating faculty achievement:', error)
      return {
        success: false,
        message: error.message || 'Failed to create achievement. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('faculty-achievements')
    updateTag('featured-achievements')
    revalidatePath('/admin/achievements/faculty')
    revalidatePath('/achievements')

    return {
      success: true,
      message: 'Faculty achievement created successfully!',
    }
  } catch (error) {
    console.error('Unexpected error creating faculty achievement:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Update an existing faculty achievement
 */
export async function updateFacultyAchievement(
  id: string,
  prevState: AchievementFormState | null,
  formData: FormData
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Build update object from form data
    const rawData = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => {
        if (key === 'display_order') {
          return [key, value ? parseInt(value as string) : undefined]
        }
        if (key === 'is_featured' || key === 'is_active') {
          return [key, value === 'true']
        }
        if (value === '' || value === null) {
          return [key, null]
        }
        return [key, value]
      })
    )

    const validation = UpdateFacultyAchievementSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check all fields.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Update achievement
    const { error } = await supabase
      .from('faculty_achievements')
      .update(validation.data)
      .eq('id', id)

    if (error) {
      console.error('Error updating faculty achievement:', error)
      return {
        success: false,
        message: error.message || 'Failed to update achievement. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('faculty-achievements')
    updateTag(`faculty-achievement-${id}`)
    updateTag('featured-achievements')
    revalidatePath('/admin/achievements/faculty')
    revalidatePath('/achievements')

    return {
      success: true,
      message: 'Faculty achievement updated successfully!',
    }
  } catch (error) {
    console.error('Unexpected error updating faculty achievement:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Delete a faculty achievement
 */
export async function deleteFacultyAchievement(
  id: string
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Delete achievement
    const { error } = await supabase
      .from('faculty_achievements')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting faculty achievement:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete achievement. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('faculty-achievements')
    updateTag(`faculty-achievement-${id}`)
    updateTag('featured-achievements')
    revalidatePath('/admin/achievements/faculty')
    revalidatePath('/achievements')

    return {
      success: true,
      message: 'Faculty achievement deleted successfully!',
    }
  } catch (error) {
    console.error('Unexpected error deleting faculty achievement:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

// =============================================================================
// STUDENT ACHIEVEMENTS
// =============================================================================

/**
 * Create a new student achievement
 */
export async function createStudentAchievement(
  prevState: AchievementFormState | null,
  formData: FormData
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Validate form data
    const rawData = {
      course_id: formData.get('course_id') || null,
      category_id: formData.get('category_id') || null,
      title: formData.get('title'),
      description: formData.get('description'),
      student_name: formData.get('student_name'),
      student_roll_number: formData.get('student_roll_number') || null,
      achievement_date: formData.get('achievement_date') || null,
      display_order: formData.get('display_order')
        ? parseInt(formData.get('display_order') as string)
        : 0,
      is_featured: formData.get('is_featured') === 'true',
      is_active: formData.get('is_active') !== 'false',
    }

    const validation = CreateStudentAchievementSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check all fields.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Get college_id
    const { data: colleges } = await supabase
      .from('colleges')
      .select('id')
      .limit(1)
      .single()

    if (!colleges) {
      return { success: false, message: 'No college found. Please contact support.' }
    }

    // Insert achievement
    const { error } = await supabase.from('student_achievements').insert([
      {
        ...validation.data,
        college_id: colleges.id,
        created_by: user.id,
      },
    ])

    if (error) {
      console.error('Error creating student achievement:', error)
      return {
        success: false,
        message: error.message || 'Failed to create achievement. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('student-achievements')
    updateTag('featured-achievements')
    revalidatePath('/admin/achievements/students')
    revalidatePath('/achievements')

    return {
      success: true,
      message: 'Student achievement created successfully!',
    }
  } catch (error) {
    console.error('Unexpected error creating student achievement:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Update an existing student achievement
 */
export async function updateStudentAchievement(
  id: string,
  prevState: AchievementFormState | null,
  formData: FormData
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Build update object from form data
    const rawData = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => {
        if (key === 'display_order') {
          return [key, value ? parseInt(value as string) : undefined]
        }
        if (key === 'is_featured' || key === 'is_active') {
          return [key, value === 'true']
        }
        if (value === '' || value === null) {
          return [key, null]
        }
        return [key, value]
      })
    )

    const validation = UpdateStudentAchievementSchema.safeParse(rawData)

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid form data. Please check all fields.',
        errors: validation.error.flatten().fieldErrors,
      }
    }

    // Update achievement
    const { error } = await supabase
      .from('student_achievements')
      .update(validation.data)
      .eq('id', id)

    if (error) {
      console.error('Error updating student achievement:', error)
      return {
        success: false,
        message: error.message || 'Failed to update achievement. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('student-achievements')
    updateTag(`student-achievement-${id}`)
    updateTag('featured-achievements')
    revalidatePath('/admin/achievements/students')
    revalidatePath('/achievements')

    return {
      success: true,
      message: 'Student achievement updated successfully!',
    }
  } catch (error) {
    console.error('Unexpected error updating student achievement:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Delete a student achievement
 */
export async function deleteStudentAchievement(
  id: string
): Promise<AchievementFormState> {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: 'Unauthorized. Please sign in.' }
    }

    // Delete achievement
    const { error } = await supabase
      .from('student_achievements')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting student achievement:', error)
      return {
        success: false,
        message: error.message || 'Failed to delete achievement. Please try again.',
      }
    }

    // Instant cache invalidation
    updateTag('student-achievements')
    updateTag(`student-achievement-${id}`)
    updateTag('featured-achievements')
    revalidatePath('/admin/achievements/students')
    revalidatePath('/achievements')

    return {
      success: true,
      message: 'Student achievement deleted successfully!',
    }
  } catch (error) {
    console.error('Unexpected error deleting student achievement:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
