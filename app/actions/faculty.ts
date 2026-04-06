'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createPublicSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { FacultyFormSchema, type FacultyFormData, type FacultyRow } from '@/lib/schemas/faculty'
import { z } from 'zod'

// ============================================
// READ operations
// ============================================

/**
 * Get all faculty (admin - includes drafts)
 */
export async function getAllFaculty(): Promise<FacultyRow[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching faculty:', error)
    return []
  }

  return (data || []) as FacultyRow[]
}

/**
 * Get published faculty (public pages)
 */
export async function getPublishedFaculty(department?: string): Promise<FacultyRow[]> {
  const supabase = createPublicSupabaseClient()

  let query = supabase
    .from('faculty')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (department) {
    query = query.eq('department', department)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching published faculty:', error)
    return []
  }

  return (data || []) as FacultyRow[]
}

/**
 * Get a single faculty by ID (admin)
 */
export async function getFacultyById(id: string): Promise<FacultyRow | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching faculty:', error)
    return null
  }

  return data as FacultyRow
}

/**
 * Get a single faculty by slug (public)
 */
export async function getFacultyBySlug(slug: string): Promise<FacultyRow | null> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching faculty by slug:', error)
    return null
  }

  return data as FacultyRow
}

/**
 * Get unique departments from published faculty
 */
export async function getFacultyDepartments(): Promise<string[]> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('faculty')
    .select('department')
    .eq('is_active', true)
    .eq('status', 'published')
    .order('department')

  if (error) {
    console.error('Error fetching departments:', error)
    return []
  }

  const departments = [...new Set((data || []).map(d => d.department))]
  return departments
}

/**
 * Get related faculty (same department, excluding current)
 */
export async function getRelatedFaculty(department: string, excludeSlug: string, limit = 4): Promise<FacultyRow[]> {
  const supabase = createPublicSupabaseClient()

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('department', department)
    .eq('is_active', true)
    .eq('status', 'published')
    .neq('slug', excludeSlug)
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching related faculty:', error)
    return []
  }

  return (data || []) as FacultyRow[]
}

// ============================================
// WRITE operations
// ============================================

type ActionResult = { success: boolean; error?: string; data?: FacultyRow }

/**
 * Create a new faculty member
 */
export async function createFaculty(payload: FacultyFormData): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const validated = FacultyFormSchema.parse(payload)

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('faculty')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'A faculty member with this URL slug already exists' }
    }

    const { data, error } = await supabase
      .from('faculty')
      .insert({
        ...validated,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating faculty:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/faculty')
    revalidatePath('/faculty')

    return { success: true, data: data as FacultyRow }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` }
    }
    return { success: false, error: 'Failed to create faculty' }
  }
}

/**
 * Update an existing faculty member
 */
export async function updateFaculty(id: string, payload: FacultyFormData): Promise<ActionResult> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const validated = FacultyFormSchema.parse(payload)

    // Check slug uniqueness (excluding current record)
    const { data: existing } = await supabase
      .from('faculty')
      .select('id')
      .eq('slug', validated.slug)
      .neq('id', id)
      .maybeSingle()

    if (existing) {
      return { success: false, error: 'A faculty member with this URL slug already exists' }
    }

    const { data, error } = await supabase
      .from('faculty')
      .update(validated)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating faculty:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/faculty')
    revalidatePath('/faculty')
    revalidatePath(`/faculty/${validated.slug}`)

    return { success: true, data: data as FacultyRow }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` }
    }
    return { success: false, error: 'Failed to update faculty' }
  }
}

/**
 * Delete a faculty member
 */
export async function deleteFaculty(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('faculty')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting faculty:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/faculty')
  revalidatePath('/faculty')

  return { success: true }
}

/**
 * Toggle faculty publish status (draft/published)
 */
export async function toggleFacultyStatus(id: string, status: 'draft' | 'published'): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('faculty')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error toggling faculty status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/faculty')
  revalidatePath('/faculty')

  return { success: true }
}

/**
 * Toggle faculty active/inactive
 */
export async function toggleFacultyActive(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('faculty')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Error toggling faculty active:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/faculty')
  revalidatePath('/faculty')

  return { success: true }
}

/**
 * Upload faculty photo to Supabase Storage
 */
export async function uploadFacultyPhoto(facultyId: string, formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const file = formData.get('photo') as File
  if (!file) return { success: false, error: 'No file provided' }

  // Validate file
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'File size must be under 5MB' }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Only JPG, PNG, and WebP images are allowed' }
  }

  const ext = file.name.split('.').pop()
  const filePath = `${facultyId}/photo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('faculty-photos')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error('Error uploading photo:', uploadError)
    return { success: false, error: uploadError.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('faculty-photos')
    .getPublicUrl(filePath)

  // Update the faculty record with the photo URL
  const { error: updateError } = await supabase
    .from('faculty')
    .update({ photo_url: publicUrl })
    .eq('id', facultyId)

  if (updateError) {
    console.error('Error updating photo URL:', updateError)
    return { success: false, error: updateError.message }
  }

  revalidatePath('/admin/faculty')
  revalidatePath('/faculty')

  return { success: true, url: publicUrl }
}
