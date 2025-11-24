'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

// Type for role relation from Supabase join
type RoleRelation = { name: string } | { name: string }[] | null

function getRoleName(roles: RoleRelation): string | undefined {
  if (!roles) return undefined
  if (Array.isArray(roles)) return roles[0]?.name
  return roles.name
}

/**
 * Check if a user has a specific permission
 * Uses the database function has_permission for efficient checking
 */
export async function checkPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.rpc('has_permission', {
    user_uuid: userId,
    required_permission: permission,
  })

  if (error) {
    console.error('Permission check error:', error)
    return false
  }

  return data || false
}

/**
 * Get all permissions for the current user
 */
export async function getCurrentUserPermissions(): Promise<string[]> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  // Get all role_ids for this user
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role_id, roles(name)')
    .eq('user_id', user.id)

  if (rolesError || !userRoles) return []

  // Check if super_admin - they have all permissions
  const isSuperAdmin = userRoles.some(
    (ur) => getRoleName(ur.roles as RoleRelation) === 'super_admin'
  )
  if (isSuperAdmin) return ['*:*:*']

  // Get all permissions for these roles
  const roleIds = userRoles.map((ur) => ur.role_id)
  const { data: permissions, error: permError } = await supabase
    .from('role_permissions')
    .select('permission')
    .in('role_id', roleIds)

  if (permError || !permissions) return []

  // Return unique permissions
  return [...new Set(permissions.map((p) => p.permission))]
}

/**
 * Get user roles with their details
 */
export async function getCurrentUserRoles() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: userRoles, error } = await supabase
    .from('user_roles')
    .select(
      `
      id,
      assigned_at,
      roles (
        id,
        name,
        display_name,
        description,
        is_system_role
      )
    `
    )
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }

  return userRoles || []
}

/**
 * Check if user is a guest (only has guest role)
 */
export async function isGuestUser(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()

  const { data: userRoles, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId)

  if (error || !userRoles || userRoles.length === 0) return true

  // Check if ALL roles are 'guest'
  return userRoles.every(
    (ur) => getRoleName(ur.roles as RoleRelation) === 'guest'
  )
}

/**
 * Check if user has super_admin role
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()

  const { data: userRoles, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId)

  if (error || !userRoles) return false

  return userRoles.some(
    (ur) => getRoleName(ur.roles as RoleRelation) === 'super_admin'
  )
}
