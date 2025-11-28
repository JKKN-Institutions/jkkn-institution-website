'use client'

import { useAuth } from './use-auth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Permission format: module:resource:action
 * Examples:
 * - users:profiles:view
 * - users:roles:edit
 * - content:pages:publish
 * - users:*:*
 * - *:*:*
 */
export function usePermissions() {
  const { user, member } = useAuth()
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Fetch permissions when user/member changes
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user || !member?.roles) {
        setPermissions([])
        setLoading(false)
        return
      }

      try {
        // Fetch permissions for all user roles via role_permissions
        const { data: rolePerms, error } = await supabase
          .from('role_permissions')
          .select('permission, roles!inner(name)')
          .in('roles.name', member.roles)

        if (error) {
          console.error('Error fetching permissions:', error)
          setPermissions([])
        } else {
          const perms = rolePerms?.map((rp) => rp.permission) || []
          setPermissions([...new Set(perms)]) // Deduplicate
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
        setPermissions([])
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [user, member?.roles, supabase])

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user || !member) return false

    // Super admin has all permissions (check via roles)
    if (member.roles?.includes('super_admin')) return true

    // Check for exact match
    if (permissions.includes(requiredPermission)) return true

    // Check for wildcard permissions
    const [reqModule, reqResource, reqAction] = requiredPermission.split(':')

    return permissions.some((permission: string) => {
      const [module, resource, action] = permission.split(':')

      // Check for full wildcard
      if (module === '*' && resource === '*' && action === '*') return true

      // Check for module wildcard
      if (module === reqModule && resource === '*' && action === '*') return true

      // Check for resource wildcard
      if (
        module === reqModule &&
        resource === reqResource &&
        action === '*'
      ) {
        return true
      }

      return false
    })
  }

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((permission) => hasPermission(permission))
  }

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((permission) => hasPermission(permission))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    loading,
  }
}
