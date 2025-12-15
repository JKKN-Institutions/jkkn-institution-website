'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { checkPermission } from '@/app/actions/permissions'
import { logActivity } from '@/lib/utils/activity-logger'

// Types
export interface CareerDepartment {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  head_id: string | null
  sort_order: number
  is_active: boolean
  job_count: number
  created_at: string
  updated_at: string
}

export interface CareerDepartmentWithHead extends CareerDepartment {
  head?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
}

// Form state type
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: CareerDepartment
}

// Validation schemas
const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  color: z.string().max(7).optional().nullable(),
  head_id: z.string().uuid().optional().nullable(),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
})

const updateDepartmentSchema = createDepartmentSchema.extend({
  id: z.string().uuid(),
})

// Get all departments
export async function getCareerDepartments(options?: {
  includeInactive?: boolean
  includeHead?: boolean
}): Promise<CareerDepartmentWithHead[]> {
  const supabase = await createServerSupabaseClient()

  // Use different queries based on includeHead option
  if (options?.includeHead) {
    let query = supabase.from('career_departments').select(`
      *,
      head:profiles!career_departments_head_id_fkey(id, full_name, email, avatar_url)
    `)

    if (!options?.includeInactive) {
      query = query.eq('is_active', true)
    }

    query = query.order('sort_order', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching career departments:', error)
      return []
    }

    return (data as unknown as CareerDepartmentWithHead[]) || []
  } else {
    let query = supabase.from('career_departments').select('*')

    if (!options?.includeInactive) {
      query = query.eq('is_active', true)
    }

    query = query.order('sort_order', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching career departments:', error)
      return []
    }

    return (data as unknown as CareerDepartmentWithHead[]) || []
  }
}

// Get department by ID
export async function getCareerDepartment(
  id: string
): Promise<CareerDepartmentWithHead | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('career_departments')
    .select(`
      *,
      head:profiles!career_departments_head_id_fkey(id, full_name, email, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching career department:', error)
    return null
  }

  return data
}

// Get department by slug
export async function getCareerDepartmentBySlug(
  slug: string
): Promise<CareerDepartmentWithHead | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('career_departments')
    .select(`
      *,
      head:profiles!career_departments_head_id_fkey(id, full_name, email, avatar_url)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching career department by slug:', error)
    return null
  }

  return data
}

// Create department
export async function createCareerDepartment(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:create')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const rawData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    icon: formData.get('icon') as string || null,
    color: formData.get('color') as string || null,
    head_id: formData.get('head_id') as string || null,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }

  // Validate
  const result = createDepartmentSchema.safeParse(rawData)
  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const data = result.data

  // Check slug uniqueness
  const { data: existingSlug } = await supabase
    .from('career_departments')
    .select('id')
    .eq('slug', data.slug)
    .single()

  if (existingSlug) {
    return {
      success: false,
      message: 'A department with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Create department
  const { data: department, error } = await supabase
    .from('career_departments')
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      color: data.color,
      head_id: data.head_id || null,
      sort_order: data.sort_order,
      is_active: data.is_active,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating career department:', error)
    return {
      success: false,
      message: 'Failed to create department',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'careers',
    resourceType: 'department',
    resourceId: department.id,
    metadata: { name: data.name },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/admin/content/careers/departments')

  return {
    success: true,
    message: 'Department created successfully',
    data: department,
  }
}

// Update department
export async function updateCareerDepartment(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:edit')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  const rawData = {
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    icon: formData.get('icon') as string || null,
    color: formData.get('color') as string || null,
    head_id: formData.get('head_id') as string || null,
    sort_order: formData.get('sort_order') as string,
    is_active: formData.get('is_active') === 'true',
  }

  // Validate
  const result = updateDepartmentSchema.safeParse(rawData)
  if (!result.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: result.error.flatten().fieldErrors,
    }
  }

  const data = result.data

  // Check slug uniqueness (excluding current)
  const { data: existingSlug } = await supabase
    .from('career_departments')
    .select('id')
    .eq('slug', data.slug)
    .neq('id', data.id)
    .single()

  if (existingSlug) {
    return {
      success: false,
      message: 'A department with this slug already exists',
      errors: { slug: ['Slug must be unique'] },
    }
  }

  // Update department
  const { data: department, error } = await supabase
    .from('career_departments')
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      color: data.color,
      head_id: data.head_id || null,
      sort_order: data.sort_order,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating career department:', error)
    return {
      success: false,
      message: 'Failed to update department',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'update',
    module: 'careers',
    resourceType: 'department',
    resourceId: department.id,
    metadata: { name: data.name },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/admin/content/careers/departments')

  return {
    success: true,
    message: 'Department updated successfully',
    data: department,
  }
}

// Delete department
export async function deleteCareerDepartment(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:delete')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get department for logging
  const { data: department } = await supabase
    .from('career_departments')
    .select('name, job_count')
    .eq('id', id)
    .single()

  if (!department) {
    return { success: false, message: 'Department not found' }
  }

  // Check if department has jobs
  if (department.job_count > 0) {
    return {
      success: false,
      message: `Cannot delete department with ${department.job_count} job(s). Please reassign or delete the jobs first.`,
    }
  }

  // Delete department
  const { error } = await supabase
    .from('career_departments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting career department:', error)
    return {
      success: false,
      message: 'Failed to delete department',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'careers',
    resourceType: 'department',
    resourceId: id,
    metadata: { name: department.name },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/admin/content/careers/departments')

  return {
    success: true,
    message: 'Department deleted successfully',
  }
}

// Toggle department active status
export async function toggleCareerDepartmentStatus(id: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:edit')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Get current status
  const { data: current } = await supabase
    .from('career_departments')
    .select('is_active, name')
    .eq('id', id)
    .single()

  if (!current) {
    return { success: false, message: 'Department not found' }
  }

  // Toggle status
  const { error } = await supabase
    .from('career_departments')
    .update({
      is_active: !current.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error toggling department status:', error)
    return {
      success: false,
      message: 'Failed to update department status',
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: current.is_active ? 'deactivate' : 'activate',
    module: 'careers',
    resourceType: 'department',
    resourceId: id,
    metadata: { name: current.name },
  })

  revalidatePath('/admin/content/careers')
  revalidatePath('/admin/content/careers/departments')

  return {
    success: true,
    message: `Department ${current.is_active ? 'deactivated' : 'activated'} successfully`,
  }
}

// Reorder departments
export async function reorderCareerDepartments(
  orderedIds: string[]
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Check authentication and permission
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const hasPermission = await checkPermission(user.id, 'cms:careers:edit')
  if (!hasPermission) {
    return { success: false, message: 'Permission denied' }
  }

  // Update sort order for each department
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('career_departments')
      .update({ sort_order: index, updated_at: new Date().toISOString() })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const hasError = results.some((r) => r.error)

  if (hasError) {
    return {
      success: false,
      message: 'Failed to reorder departments',
    }
  }

  revalidatePath('/admin/content/careers')
  revalidatePath('/admin/content/careers/departments')

  return {
    success: true,
    message: 'Departments reordered successfully',
  }
}
