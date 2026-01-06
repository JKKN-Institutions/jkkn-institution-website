'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from './permissions'
import { NotificationHelpers, sendNotification } from '@/lib/utils/notification-sender'
import {
  logError,
  getErrorCode,
  getActionableMessage,
  serializeError,
} from '@/lib/utils/error-logger'
import { validateSupabaseEnv } from '@/lib/utils/env-validator'

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

const CreateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine((email) => email.endsWith('@jkkn.ac.in'), {
      message: 'Email must be from @jkkn.ac.in domain',
    }),
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  institution: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  role_id: z.string().uuid('Invalid role ID').optional(),
})

const UpdateAvatarSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  avatarUrl: z.string().url('Invalid URL').nullable(),
})

const AssignRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  roleId: z.string().uuid('Invalid role ID'),
})

const BulkUserIdsSchema = z.object({
  userIds: z.array(z.string().uuid('Invalid user ID')).min(1, 'Select at least one user'),
})

const BulkAssignRoleSchema = z.object({
  userIds: z.array(z.string().uuid('Invalid user ID')).min(1, 'Select at least one user'),
  roleId: z.string().uuid('Invalid role ID'),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  errorCode?: string // NEW: Error classification
  errorDetails?: string // NEW: Detailed error information
  correlationId?: string // NEW: Tracking ID for support
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

  // If filtering by role, we need to get the user IDs first
  let filteredUserIds: string[] | null = null

  if (roleId) {
    const { data: userRolesData } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role_id', roleId)

    if (userRolesData && userRolesData.length > 0) {
      filteredUserIds = userRolesData.map((ur) => ur.user_id)
    } else {
      // No users have this role - return empty result
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      }
    }
  }

  // If filtering by status, we need to get profiles with matching member status
  let statusFilteredIds: string[] | null = null

  if (status) {
    const { data: membersData } = await supabase
      .from('members')
      .select('profile_id')
      .eq('status', status)

    if (membersData && membersData.length > 0) {
      statusFilteredIds = membersData
        .map((m) => m.profile_id)
        .filter(Boolean) as string[]
    } else {
      // No members with this status - return empty result
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      }
    }
  }

  // Combine filters: if both role and status filters exist, intersect the IDs
  let combinedFilterIds: string[] | null = null

  if (filteredUserIds && statusFilteredIds) {
    // Intersection of both filters
    const statusSet = new Set(statusFilteredIds)
    combinedFilterIds = filteredUserIds.filter((id) => statusSet.has(id))
    if (combinedFilterIds.length === 0) {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      }
    }
  } else if (filteredUserIds) {
    combinedFilterIds = filteredUserIds
  } else if (statusFilteredIds) {
    combinedFilterIds = statusFilteredIds
  }

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

  // Apply combined ID filter
  if (combinedFilterIds) {
    query = query.in('id', combinedFilterIds)
  }

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
 * Create a new user directly with profile and member records
 * This is an alternative to the approved emails flow
 */
export async function createUser(data: {
  email: string
  full_name: string
  phone?: string
  institution?: string
  department?: string
  designation?: string
  role_id?: string
}): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:profiles:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create users' }
  }

  // Validate input
  const validation = CreateUserSchema.safeParse(data)

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { email, full_name, phone, institution, department, designation, role_id } = validation.data

  // ===========================
  // NEW: Pre-flight Checks
  // ===========================

  // Validate environment before proceeding
  const envValidation = validateSupabaseEnv()
  if (!envValidation.isValid) {
    const correlationId = crypto.randomUUID()

    await logError(
      new Error('Environment validation failed'),
      'create_user_preflight',
      {
        correlationId,
        validation: envValidation,
        email,
        userId: user.id,
      }
    )

    return {
      success: false,
      message: 'System misconfiguration detected. Please contact administrator.',
      errorCode: 'ENV_MISSING',
      errorDetails: `Missing or invalid environment variables. Reference: ${correlationId}`,
      correlationId,
    }
  }

  // Check if guest role exists (required for trigger)
  const { data: guestRole, error: guestRoleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'guest')
    .single()

  if (guestRoleError || !guestRole) {
    const correlationId = crypto.randomUUID()

    await logError(guestRoleError, 'create_user_preflight', {
      correlationId,
      check: 'guest_role',
      email,
      userId: user.id,
    })

    return {
      success: false,
      message: 'System configuration error: Default role not found.',
      errorCode: 'ROLE_NOT_FOUND',
      errorDetails: `Guest role is missing from database. Reference: ${correlationId}`,
      correlationId,
    }
  }

  // Check if email already exists in profiles
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingProfile) {
    return {
      success: false,
      message: 'A user with this email already exists',
      errorCode: 'DUPLICATE_EMAIL',
    }
  }

  // ===========================
  // Create Auth User
  // ===========================

  // Import admin client (imported at top of file)
  const { createAdminSupabaseClient } = await import('@/lib/supabase/server')

  let adminSupabase
  try {
    adminSupabase = await createAdminSupabaseClient()
  } catch (error) {
    const correlationId = crypto.randomUUID()

    await logError(error, 'create_admin_client', {
      correlationId,
      email,
      userId: user.id,
    })

    const errorCode = getErrorCode(error)
    const actionableMessage = getActionableMessage(errorCode)

    return {
      success: false,
      message: actionableMessage,
      errorCode,
      errorDetails: `Failed to create admin client. Reference: ${correlationId}`,
      correlationId,
    }
  }

  // Create user in auth.users using Auth Admin API
  const { data: authUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    email_confirm: true, // Auto-confirm email (no verification needed)
    user_metadata: {
      full_name,
    },
  })

  if (authError || !authUser.user) {
    const correlationId = crypto.randomUUID()

    // Extract comprehensive error details
    const errorDetails = {
      message: authError?.message,
      status: authError?.status,
      name: authError?.name,
      code: (authError as any)?.code,
      details: (authError as any)?.details,
      hint: (authError as any)?.hint,
    }

    // Comprehensive error logging
    await logError(authError, 'create_auth_user', {
      correlationId,
      email,
      userId: user.id,
      errorDetails,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKeyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      envValidation,
    })

    // Classify error and get actionable message
    const errorCode = getErrorCode(authError)
    const actionableMessage = getActionableMessage(errorCode)

    return {
      success: false,
      message: actionableMessage,
      errorCode,
      errorDetails: `${errorDetails.message || 'Unknown error'}. Reference: ${correlationId}`,
      correlationId,
    }
  }

  const newUserId = authUser.user.id

  // ===========================
  // Verify Trigger Completion
  // ===========================

  // Wait for trigger to complete
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Verify profile was created by trigger
  const { data: profile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', newUserId)
    .single()

  if (profileCheckError || !profile) {
    const correlationId = crypto.randomUUID()

    await logError(profileCheckError, 'create_user_trigger_check', {
      correlationId,
      userId: user.id,
      newUserId,
      check: 'profile_creation',
      email,
    })

    return {
      success: false,
      message: 'User account created but profile setup failed. Contact administrator.',
      errorCode: 'TRIGGER_FAILED',
      errorDetails: `Profile creation failed for user ${newUserId}. Reference: ${correlationId}`,
      correlationId,
    }
  }

  // ===========================
  // Update Profile & Member
  // ===========================

  // Update profile with additional fields (trigger already created basic profile)
  if (phone || department || designation) {
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        phone: phone || null,
        department: department || null,
        designation: designation || null,
      })
      .eq('id', newUserId)

    if (profileUpdateError) {
      console.error('Error updating profile:', profileUpdateError)
      // Don't fail the entire operation, just log the error
    }
  }

  // Update member record with institution (trigger already created member)
  if (institution) {
    const { error: memberUpdateError } = await supabase
      .from('members')
      .update({
        chapter: institution,
      })
      .eq('user_id', newUserId)

    if (memberUpdateError) {
      console.error('Error updating member:', memberUpdateError)
      // Don't fail the entire operation, just log the error
    }
  }

  // ===========================
  // Role Assignment
  // ===========================

  // If a different role is specified, replace the guest role
  if (role_id && role_id !== guestRole.id) {
    // Remove guest role
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', newUserId)
      .eq('role_id', guestRole.id)

    // Assign new role
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: newUserId,
      role_id,
      assigned_by: user.id,
    })

    if (roleError) {
      console.error('Error assigning role:', roleError)
      // Don't fail the entire operation, user still has guest role
    }
  }

  // ===========================
  // Approved Emails & Activity
  // ===========================

  // Add to approved_emails for future Google OAuth login (use upsert to handle duplicates)
  const { error: approvedEmailError } = await supabase
    .from('approved_emails')
    .upsert(
      {
        email,
        notes: `Created by admin: ${user.email}`,
        added_by: user.id,
        status: 'active',
      },
      {
        onConflict: 'email',
        ignoreDuplicates: false, // Update if exists
      }
    )

  if (approvedEmailError) {
    console.error('Error adding to approved_emails:', approvedEmailError)
    // Don't fail the entire operation, just log the error
    // The user is already created, this is a secondary operation
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'users',
    resourceType: 'user',
    resourceId: newUserId,
    metadata: { email, full_name, institution, department },
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/users/approved-emails')

  return { success: true, message: 'User created successfully' }
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

  // Get role name for notification
  const { data: roleData } = await supabase
    .from('roles')
    .select('display_name')
    .eq('id', roleId)
    .single()

  // Send notification to user about role change
  if (roleData) {
    await NotificationHelpers.roleChanged(targetUserId, roleData.display_name)
  }

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

  // Get role name for notification before removing
  const { data: roleData } = await supabase
    .from('roles')
    .select('display_name')
    .eq('id', roleId)
    .single()

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

  // Send notification to user about role removal
  if (roleData) {
    await sendNotification({
      userId: targetUserId,
      title: 'Role Removed',
      message: `Your "${roleData.display_name}" role has been removed. Some features may no longer be accessible.`,
      type: 'warning',
      link: '/admin',
    })
  }

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

  // Notify user that their account has been reactivated
  await sendNotification({
    userId,
    title: 'Account Reactivated',
    message: 'Your account has been reactivated. You now have full access to the system.',
    type: 'success',
    link: '/admin',
  })

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
 * Permanently delete a user (DESTRUCTIVE - use with caution)
 * Only super_admin can perform this action
 */
export async function deleteUser(userId: string): Promise<FormState> {
  // Create regular Supabase client for auth checks and queries
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission (only super_admin should have users:users:delete)
  const hasPermission = await checkPermission(user.id, 'users:users:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete users' }
  }

  // Prevent self-deletion
  if (userId === user.id) {
    return { success: false, message: 'Cannot delete your own account' }
  }

  try {
    // Create admin Supabase client for deletion (requires service role key)
    let adminSupabase
    try {
      adminSupabase = await createAdminSupabaseClient()
    } catch (adminError) {
      console.error('Failed to create admin client:', adminError)
      return {
        success: false,
        message: 'Admin client misconfigured - check service role key configuration',
      }
    }

    // Get user details before deletion for logging
    const { data: userToDelete, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', userId)
      .single()

    if (fetchError || !userToDelete) {
      console.error('Error fetching user to delete:', {
        userId,
        error: fetchError,
        errorDetails: fetchError?.details,
        errorHint: fetchError?.hint,
        errorMessage: fetchError?.message,
      })

      return {
        success: false,
        message: fetchError
          ? `Failed to fetch user details: ${fetchError.message}`
          : 'User not found in profiles table',
      }
    }

    // Archive user data before deletion (for audit and compliance)
    const { error: archiveError } = await supabase.from('deleted_users_archive').insert({
      user_id: userId,
      email: userToDelete.email,
      full_name: userToDelete.full_name,
      deleted_by: user.id,
      deleted_at: new Date().toISOString(),
      deletion_reason: 'Manual deletion via admin panel',
    })

    if (archiveError) {
      console.error('Error archiving user data:', archiveError)
      return { success: false, message: 'Failed to archive user data before deletion' }
    }

    // Log activity BEFORE deletion (so we can still reference the user)
    await logActivity({
      userId: user.id,
      action: 'delete',
      module: 'users',
      resourceType: 'user',
      resourceId: userId,
      metadata: {
        email: userToDelete.email,
        full_name: userToDelete.full_name,
      },
    })

    // Delete user from auth.users using admin client (requires service role)
    // This should cascade to profiles, members, user_roles via ON DELETE CASCADE
    console.log('About to delete user with admin client:', userId)
    const { data: deleteData, error: authError } = await adminSupabase.auth.admin.deleteUser(userId)

    console.log('Delete result:', {
      userId,
      hasData: !!deleteData,
      hasError: !!authError,
      errorType: typeof authError,
      errorKeys: authError ? Object.keys(authError) : [],
      error: authError,
      errorString: authError ? String(authError) : null,
      errorJSON: authError ? JSON.stringify(authError) : null,
    })

    if (authError) {
      console.error('Error deleting user from auth:', {
        userId,
        error: authError,
        message: authError.message,
        status: authError.status,
        name: authError.name,
      })

      return {
        success: false,
        message: `Failed to delete user: ${authError.message || 'Unknown error'}`,
      }
    }

    // Verify deletion actually happened by checking if user still exists
    const { data: stillExists, error: verifyError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (verifyError) {
      console.warn('Could not verify deletion:', verifyError)
      // Don't fail - deletion might have succeeded
    } else if (stillExists) {
      console.error('User deletion appeared successful but user still exists:', {
        userId,
        email: userToDelete.email,
      })
      return {
        success: false,
        message: 'Deletion failed - user records still present in database',
      }
    }

    // Revalidate paths
    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)

    return { success: true, message: 'User permanently deleted' }
  } catch (error) {
    console.error('Delete user error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
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

  // Build base query - user_activity_logs.user_id references auth.users.id
  // profiles.id also references auth.users.id (same UUID), so we can join manually
  let query = supabase
    .from('user_activity_logs')
    .select('*', { count: 'exact' })

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

  const { data: logs, error, count } = await query

  if (error) {
    console.error('Error fetching activity logs:', error)
    throw new Error('Failed to fetch activity logs')
  }

  // If no logs, return early
  if (!logs || logs.length === 0) {
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    }
  }

  // Get unique user IDs and fetch their profiles
  const userIds = [...new Set(logs.map((log) => log.user_id).filter(Boolean))]

  let profilesMap: Record<string, { full_name: string | null; email: string | null; avatar_url: string | null }> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', userIds)

    if (profiles) {
      profilesMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = {
          full_name: profile.full_name,
          email: profile.email,
          avatar_url: profile.avatar_url,
        }
        return acc
      }, {} as typeof profilesMap)
    }
  }

  // Enrich logs with profile data
  const enrichedLogs = logs.map((log) => ({
    ...log,
    profiles: log.user_id ? profilesMap[log.user_id] || null : null,
  }))

  return {
    data: enrichedLogs,
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
    .select('*')
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

  const { data: logs, error } = await query

  if (error) {
    console.error('Error fetching activity logs:', error)
    throw new Error('Failed to fetch activity logs')
  }

  if (!logs || logs.length === 0) {
    throw new Error('No data to export')
  }

  // Get unique user IDs and fetch their profiles
  const userIds = [...new Set(logs.map((log) => log.user_id).filter(Boolean))]

  let profilesMap: Record<string, { full_name: string | null; email: string | null }> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', userIds)

    if (profiles) {
      profilesMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = {
          full_name: profile.full_name,
          email: profile.email,
        }
        return acc
      }, {} as typeof profilesMap)
    }
  }

  // Enrich logs with profile data
  const data = logs.map((log) => ({
    ...log,
    profiles: log.user_id ? profilesMap[log.user_id] || null : null,
  }))

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

/**
 * Bulk assign a role to multiple users
 */
export async function bulkAssignRole(
  userIds: string[],
  roleId: string
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
  const validation = BulkAssignRoleSchema.safeParse({ userIds, roleId })
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.flatten().fieldErrors.userIds?.[0] || 'Invalid input',
    }
  }

  // Filter out users who already have this role
  const { data: existingRoles } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role_id', roleId)
    .in('user_id', userIds)

  const existingUserIds = new Set(existingRoles?.map((r) => r.user_id) || [])
  const usersToAssign = userIds.filter((id) => !existingUserIds.has(id))

  if (usersToAssign.length === 0) {
    return { success: false, message: 'All selected users already have this role' }
  }

  // Assign role to each user
  const insertData = usersToAssign.map((userId) => ({
    user_id: userId,
    role_id: roleId,
    assigned_by: user.id,
  }))

  const { error } = await supabase.from('user_roles').insert(insertData)

  if (error) {
    console.error('Error bulk assigning role:', error)
    return { success: false, message: 'Failed to assign role to some users. Please try again.' }
  }

  // Log role changes for each user
  const roleChangeData = usersToAssign.map((userId) => ({
    user_id: userId,
    role_id: roleId,
    action: 'assigned',
    changed_by: user.id,
  }))
  await supabase.from('user_role_changes').insert(roleChangeData)

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_assign_role',
    module: 'users',
    resourceType: 'user_roles',
    resourceId: roleId,
    metadata: { targetUserIds: usersToAssign, roleId, count: usersToAssign.length },
  })

  revalidatePath('/admin/users')

  return {
    success: true,
    message: `Role assigned to ${usersToAssign.length} user${usersToAssign.length > 1 ? 's' : ''} successfully`,
  }
}

/**
 * Bulk activate multiple users
 */
export async function bulkActivateUsers(userIds: string[]): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to activate users' }
  }

  // Validate input
  const validation = BulkUserIdsSchema.safeParse({ userIds })
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.flatten().fieldErrors.userIds?.[0] || 'Invalid input',
    }
  }

  // Filter out current user if included
  const usersToActivate = userIds.filter((id) => id !== user.id)

  if (usersToActivate.length === 0) {
    return { success: false, message: 'No valid users to activate' }
  }

  // Update member status for all users
  const { error } = await supabase
    .from('members')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .in('user_id', usersToActivate)

  if (error) {
    console.error('Error bulk activating users:', error)
    return { success: false, message: 'Failed to activate some users. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_activate',
    module: 'users',
    resourceType: 'users',
    resourceId: user.id,
    metadata: { targetUserIds: usersToActivate, count: usersToActivate.length },
  })

  revalidatePath('/admin/users')

  return {
    success: true,
    message: `${usersToActivate.length} user${usersToActivate.length > 1 ? 's' : ''} activated successfully`,
  }
}

/**
 * Update user avatar URL
 */
export async function updateAvatarUrl(
  userId: string,
  avatarUrl: string | null
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission (can edit own avatar or need users:profiles:edit)
  const canEdit =
    user.id === userId || (await checkPermission(user.id, 'users:profiles:edit'))
  if (!canEdit) {
    return { success: false, message: 'You do not have permission to update this avatar' }
  }

  // Validate input
  const validation = UpdateAvatarSchema.safeParse({ userId, avatarUrl })
  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid input',
    }
  }

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating avatar:', error)
    return { success: false, message: 'Failed to update avatar. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: avatarUrl ? 'update_avatar' : 'remove_avatar',
    module: 'users',
    resourceType: 'profile',
    resourceId: userId,
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)

  return { success: true, message: 'Avatar updated successfully' }
}

/**
 * Export users to CSV
 */
export async function exportUsersToCSV(params?: {
  userIds?: string[]
  search?: string
  roleId?: string
  status?: string
}) {
  const supabase = await createServerSupabaseClient()
  const { userIds, search, roleId, status } = params || {}

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
    `
  )

  // If specific user IDs are provided, filter by them
  if (userIds && userIds.length > 0) {
    query = query.in('id', userIds)
  } else {
    // Build filter IDs based on roleId and status filters
    let filterUserIds: string[] | null = null

    // Filter by role
    if (roleId) {
      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role_id', roleId)

      if (userRolesData && userRolesData.length > 0) {
        filterUserIds = userRolesData.map((ur) => ur.user_id)
      } else {
        // No users have this role - return empty
        throw new Error('No users to export')
      }
    }

    // Filter by status
    if (status) {
      const { data: membersData } = await supabase
        .from('members')
        .select('profile_id')
        .eq('status', status)

      if (membersData && membersData.length > 0) {
        const statusUserIds = membersData
          .map((m) => m.profile_id)
          .filter(Boolean) as string[]

        if (filterUserIds) {
          // Intersect with role filter
          const statusSet = new Set(statusUserIds)
          filterUserIds = filterUserIds.filter((id) => statusSet.has(id))
          if (filterUserIds.length === 0) {
            throw new Error('No users to export')
          }
        } else {
          filterUserIds = statusUserIds
        }
      } else {
        throw new Error('No users to export')
      }
    }

    // Apply combined ID filter
    if (filterUserIds) {
      query = query.in('id', filterUserIds)
    }

    // Apply search filter
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,department.ilike.%${search}%`
      )
    }
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching users for export:', error)
    throw new Error('Failed to fetch users for export')
  }

  if (!data || data.length === 0) {
    throw new Error('No users to export')
  }

  // Convert to CSV format
  const headers = [
    'Name',
    'Email',
    'Department',
    'Designation',
    'Employee ID',
    'Roles',
    'Status',
    'Chapter',
    'Membership Type',
    'Phone',
    'Joined Date',
  ]

  const csvRows = [headers.join(',')]

  data.forEach((user: any) => {
    const member = user.members?.[0]
    const roles = user.user_roles
      ?.map((ur: any) => ur.roles?.display_name)
      .filter(Boolean)
      .join('; ')

    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const escapeCSV = (str: string | null | undefined) => {
      if (str === null || str === undefined) return ''
      const strValue = String(str)
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`
      }
      return strValue
    }

    const row = [
      escapeCSV(user.full_name),
      escapeCSV(user.email),
      escapeCSV(user.department),
      escapeCSV(user.designation),
      escapeCSV(user.employee_id),
      escapeCSV(roles),
      escapeCSV(member?.status || 'pending'),
      escapeCSV(member?.chapter),
      escapeCSV(member?.membership_type),
      escapeCSV(user.phone),
      escapeCSV(formatDate(user.created_at)),
    ]

    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}

/**
 * Get all approved emails with pagination
 */
export async function getApprovedEmails(params?: {
  search?: string
  status?: string
  page?: number
  limit?: number
}) {
  const supabase = await createServerSupabaseClient()
  const { search, status, page = 1, limit = 50 } = params || {}

  // Note: added_by references auth.users, but profiles.id matches auth.users.id
  // We use a manual join hint to link added_by to profiles
  let query = supabase
    .from('approved_emails')
    .select('*, added_by_profile:profiles(full_name, email)', {
      count: 'exact',
    })

  // Apply search filter
  if (search) {
    query = query.ilike('email', `%${search}%`)
  }

  // Apply status filter
  if (status) {
    query = query.eq('status', status)
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order('added_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching approved emails:', error)
    throw new Error('Failed to fetch approved emails')
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
 * Revoke an approved email
 */
export async function revokeApprovedEmail(emailId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:emails:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to revoke approved emails' }
  }

  // Get the email info first for logging
  const { data: emailData } = await supabase
    .from('approved_emails')
    .select('email')
    .eq('id', emailId)
    .single()

  // Update status to revoked
  const { error } = await supabase
    .from('approved_emails')
    .update({ status: 'revoked' })
    .eq('id', emailId)

  if (error) {
    console.error('Error revoking approved email:', error)
    return { success: false, message: 'Failed to revoke email. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'revoke',
    module: 'users',
    resourceType: 'approved_email',
    resourceId: emailId,
    metadata: { email: emailData?.email },
  })

  revalidatePath('/admin/users/approved-emails')

  return { success: true, message: 'Email revoked successfully' }
}

/**
 * Reactivate a revoked approved email
 */
export async function reactivateApprovedEmail(emailId: string): Promise<FormState> {
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
    return { success: false, message: 'You do not have permission to reactivate approved emails' }
  }

  // Get the email info first for logging
  const { data: emailData } = await supabase
    .from('approved_emails')
    .select('email')
    .eq('id', emailId)
    .single()

  // Update status to active
  const { error } = await supabase
    .from('approved_emails')
    .update({ status: 'active' })
    .eq('id', emailId)

  if (error) {
    console.error('Error reactivating approved email:', error)
    return { success: false, message: 'Failed to reactivate email. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'reactivate',
    module: 'users',
    resourceType: 'approved_email',
    resourceId: emailId,
    metadata: { email: emailData?.email },
  })

  revalidatePath('/admin/users/approved-emails')

  return { success: true, message: 'Email reactivated successfully' }
}

/**
 * Delete an approved email permanently
 */
export async function deleteApprovedEmail(emailId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:emails:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete approved emails' }
  }

  // Get the email info first for logging
  const { data: emailData } = await supabase
    .from('approved_emails')
    .select('email')
    .eq('id', emailId)
    .single()

  // Delete the email
  const { error } = await supabase
    .from('approved_emails')
    .delete()
    .eq('id', emailId)

  if (error) {
    console.error('Error deleting approved email:', error)
    return { success: false, message: 'Failed to delete email. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'users',
    resourceType: 'approved_email',
    resourceId: emailId,
    metadata: { email: emailData?.email },
  })

  revalidatePath('/admin/users/approved-emails')

  return { success: true, message: 'Email deleted successfully' }
}

/**
 * Bulk deactivate multiple users
 */
export async function bulkDeactivateUsers(userIds: string[]): Promise<FormState> {
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

  // Validate input
  const validation = BulkUserIdsSchema.safeParse({ userIds })
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.flatten().fieldErrors.userIds?.[0] || 'Invalid input',
    }
  }

  // Filter out current user if included
  const usersToDeactivate = userIds.filter((id) => id !== user.id)

  if (usersToDeactivate.length === 0) {
    return { success: false, message: 'You cannot deactivate your own account' }
  }

  // Update member status for all users
  const { error } = await supabase
    .from('members')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .in('user_id', usersToDeactivate)

  if (error) {
    console.error('Error bulk deactivating users:', error)
    return { success: false, message: 'Failed to deactivate some users. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'bulk_deactivate',
    module: 'users',
    resourceType: 'users',
    resourceId: user.id,
    metadata: { targetUserIds: usersToDeactivate, count: usersToDeactivate.length },
  })

  revalidatePath('/admin/users')

  return {
    success: true,
    message: `${usersToDeactivate.length} user${usersToDeactivate.length > 1 ? 's' : ''} deactivated successfully`,
  }
}

/**
 * Get role change history for a user
 */
export type RoleHistoryEntry = {
  id: string
  action: 'assigned' | 'removed'
  changed_at: string
  reason: string | null
  role: {
    id: string
    name: string
    display_name: string
  } | null
  changed_by_user: {
    id: string
    full_name: string | null
    email: string
  } | null
}

export async function getRoleHistory(userId: string): Promise<RoleHistoryEntry[]> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  // Allow viewing own history OR require permission
  const canView = user.id === userId || (await checkPermission(user.id, 'users:profiles:view'))
  if (!canView) {
    return []
  }

  // Fetch role change history with related data
  const { data, error } = await supabase
    .from('user_role_changes')
    .select(
      `
      id,
      action,
      changed_at,
      reason,
      role:roles!role_id (
        id,
        name,
        display_name
      ),
      changed_by_user:profiles!changed_by (
        id,
        full_name,
        email
      )
    `
    )
    .eq('user_id', userId)
    .order('changed_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching role history:', error)
    return []
  }

  return (data as unknown as RoleHistoryEntry[]) || []
}
