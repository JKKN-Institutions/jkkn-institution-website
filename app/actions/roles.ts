'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from './permissions'

// Validation schemas
const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(50, 'Role name is too long')
    .regex(/^[a-z_]+$/, 'Role name must be lowercase with underscores only'),
  display_name: z.string().min(1, 'Display name is required').max(100),
  description: z.string().optional(),
})

const UpdateRoleSchema = CreateRoleSchema.partial().extend({
  id: z.string().uuid('Invalid role ID'),
})

const ManagePermissionSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
  permission: z.string().min(1, 'Permission is required'),
})

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Get all roles with their permissions
 */
export async function getRoles() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('roles')
    .select(
      `
      *,
      role_permissions (
        id,
        permission
      ),
      user_roles (
        id
      )
    `
    )
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching roles:', error)
    throw new Error('Failed to fetch roles')
  }

  // Transform to include user count and permission count
  return (data || []).map((role) => ({
    ...role,
    permission_count: role.role_permissions?.length || 0,
    user_count: role.user_roles?.length || 0,
    permissions: role.role_permissions?.map((rp: { id: string; permission: string }) => rp.permission) || [],
  }))
}

/**
 * Get a single role by ID with full details
 */
export async function getRoleById(roleId: string) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('roles')
    .select(
      `
      *,
      role_permissions (
        id,
        permission
      )
    `
    )
    .eq('id', roleId)
    .single()

  if (error) {
    console.error('Error fetching role:', error)
    return null
  }

  return {
    ...data,
    permissions: data.role_permissions?.map((rp: { id: string; permission: string }) => rp.permission) || [],
  }
}

/**
 * Create a new role
 */
export async function createRole(
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
  const hasPermission = await checkPermission(user.id, 'users:roles:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create roles' }
  }

  // Validate input
  const validation = CreateRoleSchema.safeParse({
    name: formData.get('name'),
    display_name: formData.get('display_name'),
    description: formData.get('description'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  // Check if role name already exists
  const { data: existing } = await supabase
    .from('roles')
    .select('id')
    .eq('name', validation.data.name)
    .single()

  if (existing) {
    return { success: false, message: 'A role with this name already exists' }
  }

  // Create role
  const { data, error } = await supabase
    .from('roles')
    .insert({
      name: validation.data.name,
      display_name: validation.data.display_name,
      description: validation.data.description,
      is_system_role: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating role:', error)
    return { success: false, message: 'Failed to create role. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'users',
    resourceType: 'role',
    resourceId: data.id,
    metadata: { name: validation.data.name },
  })

  revalidatePath('/admin/roles')

  return { success: true, message: 'Role created successfully' }
}

/**
 * Update an existing role
 */
export async function updateRole(
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
  const hasPermission = await checkPermission(user.id, 'users:roles:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to edit roles' }
  }

  // Validate input
  const validation = UpdateRoleSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    display_name: formData.get('display_name'),
    description: formData.get('description'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  // Check if it's a system role
  const { data: role } = await supabase
    .from('roles')
    .select('is_system_role')
    .eq('id', validation.data.id)
    .single()

  if (role?.is_system_role) {
    return {
      success: false,
      message: 'System roles cannot be modified',
    }
  }

  // Update role
  const { error } = await supabase
    .from('roles')
    .update({
      display_name: validation.data.display_name,
      description: validation.data.description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', validation.data.id)

  if (error) {
    console.error('Error updating role:', error)
    return { success: false, message: 'Failed to update role. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'edit',
    module: 'users',
    resourceType: 'role',
    resourceId: validation.data.id,
    metadata: { changes: validation.data },
  })

  revalidatePath('/admin/roles')
  revalidatePath(`/admin/roles/${validation.data.id}`)

  return { success: true, message: 'Role updated successfully' }
}

/**
 * Delete a role (only non-system roles)
 */
export async function deleteRole(roleId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:roles:delete')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete roles' }
  }

  // Check if it's a system role
  const { data: role } = await supabase
    .from('roles')
    .select('is_system_role, name')
    .eq('id', roleId)
    .single()

  if (!role) {
    return { success: false, message: 'Role not found' }
  }

  if (role.is_system_role) {
    return { success: false, message: 'System roles cannot be deleted' }
  }

  // Check if any users have this role
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('id')
    .eq('role_id', roleId)
    .limit(1)

  if (userRoles && userRoles.length > 0) {
    return {
      success: false,
      message: 'Cannot delete role that is assigned to users. Remove role assignments first.',
    }
  }

  // Delete role (cascade will handle role_permissions)
  const { error } = await supabase.from('roles').delete().eq('id', roleId)

  if (error) {
    console.error('Error deleting role:', error)
    return { success: false, message: 'Failed to delete role. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'delete',
    module: 'users',
    resourceType: 'role',
    resourceId: roleId,
    metadata: { name: role.name },
  })

  revalidatePath('/admin/roles')

  return { success: true, message: 'Role deleted successfully' }
}

/**
 * Add a permission to a role
 */
export async function addPermissionToRole(
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
  const hasPermission = await checkPermission(user.id, 'users:permissions:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage role permissions' }
  }

  // Validate input
  const validation = ManagePermissionSchema.safeParse({
    roleId: formData.get('roleId'),
    permission: formData.get('permission'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { roleId, permission } = validation.data

  // Check if permission already exists
  const { data: existing } = await supabase
    .from('role_permissions')
    .select('id')
    .eq('role_id', roleId)
    .eq('permission', permission)
    .single()

  if (existing) {
    return { success: false, message: 'Role already has this permission' }
  }

  // Add permission
  const { error } = await supabase.from('role_permissions').insert({
    role_id: roleId,
    permission,
  })

  if (error) {
    console.error('Error adding permission:', error)
    return { success: false, message: 'Failed to add permission. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'add_permission',
    module: 'users',
    resourceType: 'role_permission',
    resourceId: roleId,
    metadata: { permission },
  })

  revalidatePath('/admin/roles')
  revalidatePath(`/admin/roles/${roleId}`)

  return { success: true, message: 'Permission added successfully' }
}

/**
 * Remove a permission from a role
 */
export async function removePermissionFromRole(
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
  const hasPermission = await checkPermission(user.id, 'users:permissions:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage role permissions' }
  }

  // Validate input
  const validation = ManagePermissionSchema.safeParse({
    roleId: formData.get('roleId'),
    permission: formData.get('permission'),
  })

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Invalid fields. Please check the form.',
    }
  }

  const { roleId, permission } = validation.data

  // Check if it's the wildcard permission for super_admin
  const { data: role } = await supabase
    .from('roles')
    .select('name')
    .eq('id', roleId)
    .single()

  if (role?.name === 'super_admin' && permission === '*:*:*') {
    return {
      success: false,
      message: 'Cannot remove wildcard permission from super_admin role',
    }
  }

  // Remove permission
  const { error } = await supabase
    .from('role_permissions')
    .delete()
    .eq('role_id', roleId)
    .eq('permission', permission)

  if (error) {
    console.error('Error removing permission:', error)
    return { success: false, message: 'Failed to remove permission. Please try again.' }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'remove_permission',
    module: 'users',
    resourceType: 'role_permission',
    resourceId: roleId,
    metadata: { permission },
  })

  revalidatePath('/admin/roles')
  revalidatePath(`/admin/roles/${roleId}`)

  return { success: true, message: 'Permission removed successfully' }
}

/**
 * Toggle a permission for a role (add if not present, remove if present)
 */
export async function togglePermission(
  roleId: string,
  permission: string,
  currentlyHas: boolean
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
  const hasPermission = await checkPermission(user.id, 'users:permissions:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to manage role permissions' }
  }

  // Check if it's a system role
  const { data: role } = await supabase
    .from('roles')
    .select('name, is_system_role')
    .eq('id', roleId)
    .single()

  if (!role) {
    return { success: false, message: 'Role not found' }
  }

  if (role.is_system_role) {
    return { success: false, message: 'Cannot modify system role permissions' }
  }

  // Protect super_admin wildcard
  if (role.name === 'super_admin' && permission === '*:*:*' && currentlyHas) {
    return { success: false, message: 'Cannot remove wildcard permission from super_admin' }
  }

  if (currentlyHas) {
    // Remove permission
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission', permission)

    if (error) {
      console.error('Error removing permission:', error)
      return { success: false, message: 'Failed to remove permission' }
    }

    await logActivity({
      userId: user.id,
      action: 'remove_permission',
      module: 'users',
      resourceType: 'role_permission',
      resourceId: roleId,
      metadata: { permission },
    })
  } else {
    // Add permission
    const { error } = await supabase.from('role_permissions').insert({
      role_id: roleId,
      permission,
    })

    if (error) {
      console.error('Error adding permission:', error)
      return { success: false, message: 'Failed to add permission' }
    }

    await logActivity({
      userId: user.id,
      action: 'add_permission',
      module: 'users',
      resourceType: 'role_permission',
      resourceId: roleId,
      metadata: { permission },
    })
  }

  revalidatePath('/admin/roles')
  revalidatePath(`/admin/roles/${roleId}`)

  return {
    success: true,
    message: currentlyHas ? 'Permission removed' : 'Permission added',
  }
}

/**
 * Duplicate a role with all its permissions
 */
export async function duplicateRole(roleId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'users:roles:create')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create roles' }
  }

  // Get original role with permissions
  const { data: originalRole, error: fetchError } = await supabase
    .from('roles')
    .select('*, role_permissions(permission)')
    .eq('id', roleId)
    .single()

  if (fetchError || !originalRole) {
    return { success: false, message: 'Role not found' }
  }

  // Generate new name - find unique suffix
  let suffix = 1
  let newName = `${originalRole.name}_copy`
  let newDisplayName = `${originalRole.display_name} (Copy)`

  // Check if name already exists and increment suffix
  const { data: existingRoles } = await supabase
    .from('roles')
    .select('name')
    .like('name', `${originalRole.name}_copy%`)

  if (existingRoles && existingRoles.length > 0) {
    const existingNames = existingRoles.map((r) => r.name)
    while (existingNames.includes(newName)) {
      suffix++
      newName = `${originalRole.name}_copy_${suffix}`
      newDisplayName = `${originalRole.display_name} (Copy ${suffix})`
    }
  }

  // Create new role
  const { data: newRole, error: createError } = await supabase
    .from('roles')
    .insert({
      name: newName,
      display_name: newDisplayName,
      description: originalRole.description,
      is_system_role: false, // Duplicated roles are never system roles
    })
    .select()
    .single()

  if (createError) {
    console.error('Error creating duplicated role:', createError)
    return { success: false, message: createError.message }
  }

  // Copy permissions
  if (originalRole.role_permissions?.length > 0) {
    const permissions = originalRole.role_permissions.map(
      (rp: { permission: string }) => ({
        role_id: newRole.id,
        permission: rp.permission,
      })
    )

    const { error: permError } = await supabase.from('role_permissions').insert(permissions)

    if (permError) {
      console.error('Error copying permissions:', permError)
      // Role was created but permissions failed - still return success with warning
    }
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'duplicate',
    module: 'users',
    resourceType: 'role',
    resourceId: newRole.id,
    metadata: { original_role_id: roleId, new_role_name: newName },
  })

  revalidatePath('/admin/roles')
  return { success: true, message: `Role duplicated as "${newDisplayName}"` }
}

/**
 * Get all available permissions (for permission picker)
 */
export async function getAvailablePermissions() {
  // Define available permissions for the system
  const permissions = [
    // Users module
    { module: 'users', resource: 'profiles', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'users', resource: 'roles', actions: ['view', 'create', 'edit', 'delete', 'assign'] },
    { module: 'users', resource: 'permissions', actions: ['view', 'edit'] },
    { module: 'users', resource: 'activity', actions: ['view'] },
    { module: 'users', resource: 'emails', actions: ['view', 'create', 'delete'] },

    // Content module
    { module: 'content', resource: 'pages', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
    { module: 'content', resource: 'media', actions: ['view', 'upload', 'delete'] },
    { module: 'content', resource: 'templates', actions: ['view', 'create', 'edit', 'delete'] },

    // Dashboard module
    { module: 'dashboard', resource: 'widgets', actions: ['view', 'customize'] },
    { module: 'dashboard', resource: 'analytics', actions: ['view'] },
    { module: 'dashboard', resource: 'reports', actions: ['view', 'export'] },

    // System module
    { module: 'system', resource: 'modules', actions: ['view', 'toggle'] },
    { module: 'system', resource: 'settings', actions: ['view', 'edit'] },
  ]

  // Generate permission strings
  const permissionList: { permission: string; label: string; module: string }[] = []

  permissions.forEach(({ module, resource, actions }) => {
    // Add wildcard for module
    permissionList.push({
      permission: `${module}:*:*`,
      label: `All ${module} permissions`,
      module,
    })

    // Add wildcard for resource
    permissionList.push({
      permission: `${module}:${resource}:*`,
      label: `All ${resource} actions in ${module}`,
      module,
    })

    // Add individual actions
    actions.forEach((action) => {
      permissionList.push({
        permission: `${module}:${resource}:${action}`,
        label: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`,
        module,
      })
    })
  })

  return permissionList
}
