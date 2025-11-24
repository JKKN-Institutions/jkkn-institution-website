'use client'

import { useAuth } from './use-auth'

/**
 * Permission format: module:resource:action
 * Examples:
 * - users:read
 * - users:write
 * - users:delete
 * - events:*
 * - *:*
 */
export function usePermissions() {
  const { user, member } = useAuth()

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user || !member) return false

    // Super admin has all permissions
    if (member.role === 'super_admin') return true

    const permissions = member.permissions || []

    // Check for exact match
    if (permissions.includes(requiredPermission)) return true

    // Check for wildcard permissions
    const [reqModule, reqResource, reqAction] = requiredPermission.split(':')

    return permissions.some((permission) => {
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
  }
}
