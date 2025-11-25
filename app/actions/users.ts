'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from './permissions'

// Validation schemas
const AddApprovedEmailSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine((email) => email.endsWith('@jkkn.ac.in'), {
      message: 'Email must be from @jkkn.ac.in domain',
    }),
  notes: z.string().optional(),
})

const UpdateProfileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  employee_id: z.string().optional(),
  date_of_joining: z.string().optional(),
})

const AssignRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  roleId: z.string().uuid('Invalid role ID'),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Get all users with their profiles, roles, and member info
 */
export async function getUsers(params?: {
  search?: string
  roleId?: string
  status?: string
  page?: number
  limit?: number
}) {
  const supabase = await createServerSupabaseClient()
  const { search, roleId, status, page = 1, limit = 50 } = params || {}

  let query = supabase.from('profiles').select(
    `
      *,
      members!members_profile_id_fkey (
        id,
        member_id,
        chapter,
        status,
        membership_type
      ),
      user_roles!user_roles_user_id_fkey (
        id,
        roles (
          id,
          name,
          display_name
        )
      )
    `,
    { count: 'exact' }
  )

  // Apply search filter
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,department.ilike.%${search}%`
    )
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Get a single user by ID with full details
 */
export async function getUserById(userId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      members!members_profile_id_fkey (
        id,
        member_id,
        chapter,
        status,
        membership_type,
        joined_at
      ),
      user_roles!user_roles_user_id_fkey (
        id,
        assigned_at,
        roles (
          id,
          name,
          display_name,
          description
        )
      )
    `
    )
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return data
}

/**
 * Add an email to the approved emails list
 */
export async function addApprovedEmail(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:emails:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to add approved emails' }
  }

  // Validate input
  const validation = AddApprovedEmailSchema.safeParse({
    email: formData.get('email'),
    notes: formData.get('notes'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  // Check if email already exists
  const { data: existing } = await supabase
    .from('approved_emails')
    .select('id')
    .eq('email', validation.data.email)
    .single()

  if (existing) {
    return {
      success: false,
      message: 'This email is already in the approved list',
    }
  }

  // Insert approved email
  const { data, error } = await supabase
    .from('approved_emails')
    .insert({
      email: validation.data.email,
      notes: validation.data.notes,
      added_by: user.id,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding approved email:', error)
    return { success: false, message: 'Failed to add email. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'users',
    resourceType: 'approved_email',
    resourceId: data.id,
    metadata: { email: validation.data.email },
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/users/approved-emails')

  return { success: true, message: 'Email added to approved list successfully' }
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(
  userId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission (can edit own profile or need users:profiles:edit)
  const canEdit =
    user.id === userId ||
    (await checkPermission(user.id, 'users:profiles:edit'))
  if (!canEdit) {
    return { success: false, message: 'You do not have permission to edit this profile' }
  }

  // Validate input
  const validation = UpdateProfileSchema.safeParse({
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
    department: formData.get('department'),
    designation: formData.get('designation'),
    employee_id: formData.get('employee_id'),
    date_of_joining: formData.get('date_of_joining'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  // Update profile
  const updateData = {
    ...validation.data,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, message: 'Failed to update profile. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'users',
    resourceType: 'profile',
    resourceId: userId,
    metadata: { changes: validation.data },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)

  return { success: true, message: 'Profile updated successfully' }
}

/**
 * Assign a role to a user
 */
export async function assignRole(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:roles:assign')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to assign roles' }
  }

  // Validate input
  const validation = AssignRoleSchema.safeParse({
    userId: formData.get('userId'),
    roleId: formData.get('roleId'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { userId: targetUserId, roleId } = validation.data

  // Check if role already assigned
  const { data: existing } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', targetUserId)
    .eq('role_id', roleId)
    .single()

  if (existing) {
    return { success: false, message: 'User already has this role' }
  }

  // Assign role
  const { data, error } = await supabase
    .from('user_roles')
    .insert({
      user_id: targetUserId,
      role_id: roleId,
      assigned_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error assigning role:', error)
    return { success: false, message: 'Failed to assign role. Please try again.' }
  }

  // Log role change
  await supabase.from('user_role_changes').insert({
    user_id: targetUserId,
    role_id: roleId,
    action: 'assigned',
    changed_by: user.id,
  })

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'assign_role',
    module: 'users',
    resourceType: 'user_role',
    resourceId: data.id,
    metadata: { targetUserId, roleId },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${targetUserId}`)

  return { success: true, message: 'Role assigned successfully' }
}

/**
 * Remove a role from a user
 */
export async function removeRole(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:roles:assign')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to remove roles' }
  }

  // Validate input
  const validation = AssignRoleSchema.safeParse({
    userId: formData.get('userId'),
    roleId: formData.get('roleId'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { userId: targetUserId, roleId } = validation.data

  // Check if this is the user's only role
  const { data: userRoles, error: countError } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', targetUserId)

  if (countError) {
    return { success: false, message: 'Failed to check user roles' }
  }

  if (userRoles && userRoles.length <= 1) {
    return {
      success: false,
      message: 'Cannot remove the last role from a user. Assign another role first.',
    }
  }

  // Remove role
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', targetUserId)
    .eq('role_id', roleId)

  if (error) {
    console.error('Error removing role:', error)
    return { success: false, message: 'Failed to remove role. Please try again.' }
  }

  // Log role change
  await supabase.from('user_role_changes').insert({
    user_id: targetUserId,
    role_id: roleId,
    action: 'removed',
    changed_by: user.id,
  })

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'remove_role',
    module: 'users',
    resourceType: 'user_role',
    resourceId: targetUserId,
    metadata: { targetUserId, roleId },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${targetUserId}`)

  return { success: true, message: 'Role removed successfully' }
}

/**
 * Deactivate a user (set member status to inactive)
 */
export async function deactivateUser(userId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:profiles:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to deactivate users' }
  }

  // Cannot deactivate yourself
  if (user.id === userId) {
    return { success: false, message: 'You cannot deactivate your own account' }
  }

  // Update member status
  const { error } = await supabase
    .from('members')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) {
    console.error('Error deactivating user:', error)
    return { success: false, message: 'Failed to deactivate user. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'deactivate',
    module: 'users',
    resourceType: 'user',
    resourceId: userId,
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)

  return { success: true, message: 'User deactivated successfully' }
}

/**
 * Reactivate a user (set member status to active)
 */
export async function reactivateUser(userId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:profiles:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to reactivate users' }
  }

  // Update member status
  const { error } = await supabase
    .from('members')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) {
    console.error('Error reactivating user:', error)
    return { success: false, message: 'Failed to reactivate user. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'reactivate',
    module: 'users',
    resourceType: 'user',
    resourceId: userId,
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)

  return { success: true, message: 'User reactivated successfully' }
}

/**
 * Get user activity logs
 */
export async function getUserActivityLogs(params?: {
  userId?: string
  module?: string
  action?: string
  page?: number
  limit?: number
}) {
  const supabase = await createServerSupabaseClient()
  const { userId, module, action, page = 1, limit = 50 } = params || {}

  let query = supabase
    .from('user_activity_logs')
    .select('*, profiles:user_id(full_name, email, avatar_url)', {
      count: 'exact',
    })

  // Apply filters
  if (userId) {
    query = query.eq('user_id', userId)
  }
  if (module) {
    query = query.eq('module', module)
  }
  if (action) {
    query = query.eq('action', action)
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching activity logs:', error)
    throw new Error('Failed to fetch activity logs')
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

/**
 * Export activity logs as CSV
 */
export async function exportActivityLogsToCSV(params?: {
  userId?: string
  module?: string
  action?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { userId, module, action } = params || {}

  // Fetch ALL matching logs (no pagination)
  let query = supabase
    .from('user_activity_logs')
    .select('*, profiles:user_id(full_name, email)')
    .order('created_at', { ascending: false })

  // Apply filters
  if (userId) {
    query = query.eq('user_id', userId)
  }
  if (module) {
    query = query.eq('module', module)
  }
  if (action) {
    query = query.eq('action', action)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching activity logs:', error)
    throw new Error('Failed to fetch activity logs')
  }

  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  // Convert to CSV format
  const headers = [
    'Date',
    'Time',
    'User Name',
    'User Email',
    'Action',
    'Module',
    'Resource Type',
    'Resource ID',
    'IP Address',
    'Metadata',
  ]

  const csvRows = [headers.join(',')]

  data.forEach((log: any) => {
    const date = new Date(log.created_at)
    const dateStr = date.toLocaleDateString('en-US')
    const timeStr = date.toLocaleTimeString('en-US')
    const userName = log.profiles?.full_name || 'Unknown User'
    const userEmail = log.profiles?.email || 'N/A'
    const action = log.action || ''
    const module = log.module || ''
    const resourceType = log.resource_type || ''
    const resourceId = log.resource_id || ''
    const ipAddress = log.ip_address || ''
    const metadata = log.metadata ? JSON.stringify(log.metadata).replace(/"/g, '""') : ''

    // Escape commas and quotes in CSV
    const escapeCSV = (str: string) => {
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str}"`
      }
      return str
    }

    const row = [
      escapeCSV(dateStr),
      escapeCSV(timeStr),
      escapeCSV(userName),
      escapeCSV(userEmail),
      escapeCSV(action),
      escapeCSV(module),
      escapeCSV(resourceType),
      escapeCSV(resourceId),
      escapeCSV(ipAddress),
      escapeCSV(metadata),
    ]

    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}
