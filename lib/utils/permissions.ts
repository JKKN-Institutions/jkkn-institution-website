/**
 * Check if a user has a required permission
 * Supports wildcard matching for flexible permission hierarchies
 *
 * @param userPermissions - Array of permissions the user has
 * @param requiredPermission - Permission required to access a resource
 * @returns true if user has permission, false otherwise
 *
 * @example
 * ```typescript
 * // Exact match
 * hasPermission(['users:profiles:view'], 'users:profiles:view') // true
 *
 * // Super admin wildcard
 * hasPermission(['*:*:*'], 'users:profiles:view') // true
 *
 * // Module wildcard
 * hasPermission(['users:*:*'], 'users:profiles:view') // true
 *
 * // Action wildcard
 * hasPermission(['users:profiles:*'], 'users:profiles:view') // true
 * ```
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission?: string
): boolean {
  // No permission required - allow access
  if (!requiredPermission) return true

  // Super admin - full access
  if (userPermissions.includes('*:*:*')) return true

  // Exact permission match
  if (userPermissions.includes(requiredPermission)) return true

  // Wildcard matching (users:*:*, users:profiles:*, etc.)
  const requiredParts = requiredPermission.split(':')

  // Permission format validation
  if (requiredParts.length !== 3) {
    console.warn(
      `Invalid permission format: "${requiredPermission}". Expected format: "module:resource:action"`
    )
    return false
  }

  for (const perm of userPermissions) {
    const permParts = perm.split(':')

    // Only check permissions with correct format
    if (permParts.length !== 3) continue

    // Check if permission matches with wildcards
    const match = permParts.every((part, i) => part === '*' || part === requiredParts[i])

    if (match) return true
  }

  return false
}

/**
 * Check if a user has ANY of the required permissions
 *
 * @param userPermissions - Array of permissions the user has
 * @param requiredPermissions - Array of permissions, user needs at least one
 * @returns true if user has any of the required permissions
 *
 * @example
 * ```typescript
 * hasAnyPermission(
 *   ['users:profiles:view'],
 *   ['users:profiles:view', 'users:profiles:edit']
 * ) // true
 * ```
 */
export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some((req) => hasPermission(userPermissions, req))
}

/**
 * Check if a user has ALL of the required permissions
 *
 * @param userPermissions - Array of permissions the user has
 * @param requiredPermissions - Array of permissions, user needs all of them
 * @returns true if user has all required permissions
 *
 * @example
 * ```typescript
 * hasAllPermissions(
 *   ['users:profiles:view', 'users:profiles:edit'],
 *   ['users:profiles:view', 'users:profiles:edit']
 * ) // true
 * ```
 */
export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((req) => hasPermission(userPermissions, req))
}

/**
 * Filter an array of items by permission
 * Removes items where user doesn't have required permission
 *
 * @param items - Array of items with optional permission property
 * @param userPermissions - Array of permissions the user has
 * @returns Filtered array of items user can access
 *
 * @example
 * ```typescript
 * const navItems = [
 *   { id: 'dashboard', label: 'Dashboard' }, // No permission required
 *   { id: 'users', label: 'Users', permission: 'users:profiles:view' },
 *   { id: 'settings', label: 'Settings', permission: 'settings:*:*' }
 * ]
 *
 * const filtered = filterByPermission(navItems, ['users:profiles:view'])
 * // Returns: [dashboard, users] - settings is excluded
 * ```
 */
export function filterByPermission<T extends { permission?: string }>(
  items: T[],
  userPermissions: string[]
): T[] {
  return items.filter((item) => hasPermission(userPermissions, item.permission))
}
