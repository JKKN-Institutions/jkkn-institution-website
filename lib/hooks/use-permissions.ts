'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Custom hook to check if the current user has a specific permission
 * This is for CLIENT-SIDE UI display only (hiding/showing buttons, links, etc.)
 * NEVER rely on this for security - always validate permissions server-side
 *
 * @param permission - The permission to check in format "module:resource:action"
 * @returns Object with hasPermission boolean and loading state
 *
 * @example
 * const { hasPermission, isLoading } = usePermission('users:profiles:edit')
 * if (hasPermission) return <EditButton />
 */
export function usePermission(permission: string) {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setHasPermission(false)
          setIsLoading(false)
          return
        }

        // Call database function to check permission
        const { data, error } = await supabase.rpc('has_permission', {
          user_uuid: user.id,
          required_permission: permission,
        })

        if (error) {
          console.error('Error checking permission:', error)
          setHasPermission(false)
        } else {
          setHasPermission(data || false)
        }
      } catch (error) {
        console.error('Error in usePermission:', error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermission()
  }, [permission, supabase])

  return { hasPermission, isLoading }
}

/**
 * Custom hook to check if the current user has ANY of the specified permissions
 * Useful when multiple permissions can grant access to a feature
 *
 * @param permissions - Array of permissions to check
 * @returns Object with hasPermission boolean and loading state
 *
 * @example
 * const { hasPermission } = usePermissions(['users:profiles:edit', 'users:profiles:delete'])
 */
export function usePermissions(permissions: string[]) {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setHasPermission(false)
          setIsLoading(false)
          return
        }

        // Check all permissions in parallel
        const checks = await Promise.all(
          permissions.map((permission) =>
            supabase.rpc('has_permission', {
              user_uuid: user.id,
              required_permission: permission,
            })
          )
        )

        // User has permission if ANY check returns true
        const anyPermission = checks.some((check) => check.data === true)
        setHasPermission(anyPermission)
      } catch (error) {
        console.error('Error in usePermissions:', error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkPermissions()
  }, [permissions, supabase])

  return { hasPermission, isLoading }
}

/**
 * Custom hook to get all permissions for the current user
 * Useful for advanced permission-based UI logic
 *
 * @returns Object with permissions array and loading state
 *
 * @example
 * const { permissions, isLoading } = useUserPermissions()
 * const canEdit = permissions.includes('users:profiles:edit')
 */
export function useUserPermissions() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setPermissions([])
          setIsLoading(false)
          return
        }

        // Get all user roles with permissions
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('roles(role_permissions(permissions(permission)))')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching user permissions:', error)
          setPermissions([])
        } else {
          // Flatten permissions array
          const allPermissions: string[] = []
          userRoles?.forEach((ur: any) => {
            ur.roles?.role_permissions?.forEach((rp: any) => {
              if (rp.permissions?.permission) {
                allPermissions.push(rp.permissions.permission)
              }
            })
          })
          setPermissions([...new Set(allPermissions)]) // Remove duplicates
        }
      } catch (error) {
        console.error('Error in useUserPermissions:', error)
        setPermissions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPermissions()
  }, [supabase])

  return { permissions, isLoading }
}

/**
 * Custom hook to check if the current user has a specific role
 *
 * @param roleName - The role name to check (e.g., 'super_admin', 'member')
 * @returns Object with hasRole boolean and loading state
 *
 * @example
 * const { hasRole } = useRole('super_admin')
 * if (hasRole) return <SuperAdminPanel />
 */
export function useRole(roleName: string) {
  const [hasRole, setHasRole] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    const checkRole = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setHasRole(false)
          setIsLoading(false)
          return
        }

        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error checking role:', error)
          setHasRole(false)
        } else {
          const roleNames = userRoles?.map((ur: any) => ur.roles?.name) || []
          setHasRole(roleNames.includes(roleName))
        }
      } catch (error) {
        console.error('Error in useRole:', error)
        setHasRole(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkRole()
  }, [roleName, supabase])

  return { hasRole, isLoading }
}
