import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

// Route permission mapping
const routePermissions: Record<string, string> = {
  '/admin/users': 'users:profiles:view',
  '/admin/users/new': 'users:profiles:create',
  '/admin/users/approved-emails': 'users:emails:view',
  '/admin/roles': 'users:roles:view',
  '/admin/roles/new': 'users:roles:create',
  '/admin/activity': 'users:activity:view',
  '/admin/analytics': 'dashboard:analytics:view',
  '/admin/analytics/users': 'dashboard:analytics:view',
  '/admin/analytics/content': 'dashboard:analytics:view',
  '/admin/analytics/engagement': 'dashboard:analytics:view',
  '/admin/content': 'content:pages:view',
  '/admin/content/pages': 'content:pages:view',
  '/admin/content/pages/new': 'content:pages:create',
  '/admin/content/media': 'content:media:view',
  '/admin/settings': 'system:settings:view',
  '/admin/settings/modules': 'system:modules:view',
}

// Pre-compile route patterns at module load time (not per-request)
// This avoids regex compilation overhead on each request
const compiledRoutePatterns: Array<{ pattern: RegExp; permission: string }> = Object.entries(
  routePermissions
).map(([route, permission]) => ({
  pattern: new RegExp(`^${route.replace(/\[.*?\]/g, '[^/]+')}(?:/.*)?$`),
  permission,
}))

// Routes that guests CAN access (even with pending approval)
const guestAllowedRoutes = new Set(['/admin', '/admin/dashboard', '/auth/access-denied'])

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // IMPORTANT: Use getUser() instead of getSession() to properly refresh the session
  // getUser() verifies the token with Supabase Auth and refreshes expired tokens
  // This ensures Server Actions can read the user from cookies
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/auth')
  const isAdminPage = pathname.startsWith('/admin')

  // If user is not authenticated and trying to access admin pages, redirect to auth
  if (!user && isAdminPage) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to admin
  if (user && isAuthPage && pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Check if user email is from @jkkn.ac.in domain for admin access
  if (user && isAdminPage) {
    const email = user.email
    if (!email?.endsWith('@jkkn.ac.in')) {
      // Redirect unauthorized users to a forbidden page or logout
      await supabase.auth.signOut()
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }

    // Get user roles
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)

    type RoleRelation = { name: string } | { name: string }[] | null
    const getRoleName = (roles: RoleRelation): string | undefined => {
      if (!roles) return undefined
      if (Array.isArray(roles)) return roles[0]?.name
      return roles.name
    }

    const roles = userRoles?.map((ur) => getRoleName(ur.roles as RoleRelation)).filter(Boolean) as string[] || []
    const isSuperAdmin = roles.includes('super_admin')
    const isGuestOnly = roles.length > 0 && roles.every((r) => r === 'guest')

    // SAFETY CHECK: If user has super_admin, grant full access immediately
    if (isSuperAdmin) {
      // Super admin has full access - skip all permission checks
      return response
    }

    // Log warning if multiple roles detected (excluding super admin case)
    if (roles.length > 1) {
      console.warn(`User ${user.id} has multiple roles:`, roles)
    }

    // Guest user protection - use Set for O(1) lookup
    if (isGuestOnly) {
      const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
      if (!guestAllowedRoutes.has(normalizedPath)) {
        return NextResponse.redirect(new URL('/auth/access-denied', request.url))
      }
    }

    // Skip permission checks for super_admin
    if (!isSuperAdmin && !isGuestOnly) {
      // Check route-specific permissions
      const requiredPermission = getRoutePermission(pathname)

      if (requiredPermission) {
        const hasPermission = await checkUserPermission(
          supabase,
          user.id,
          requiredPermission
        )

        if (!hasPermission) {
          return NextResponse.redirect(new URL('/auth/unauthorized', request.url))
        }
      }
    }
  }

  return response
}

/**
 * Get the required permission for a route
 * Uses pre-compiled regex patterns for better performance
 */
function getRoutePermission(pathname: string): string | null {
  // Check for exact match first (O(1) lookup)
  if (routePermissions[pathname]) {
    return routePermissions[pathname]
  }

  // Check for dynamic routes using pre-compiled patterns
  for (const { pattern, permission } of compiledRoutePatterns) {
    if (pattern.test(pathname)) {
      return permission
    }
  }

  return null
}

/**
 * Check if user has a specific permission
 */
async function checkUserPermission(
  supabase: ReturnType<typeof createMiddlewareClient>['supabase'],
  userId: string,
  permission: string
): Promise<boolean> {
  // OPTIMIZED: Fetch permissions in a single query using nested joins
  // user_roles -> roles -> role_permissions
  const { data: userPermissions } = await supabase
    .from('user_roles')
    .select('roles!inner(role_permissions!inner(permission))')
    .eq('user_id', userId) as unknown as {
      data: { roles: { role_permissions: { permission: string }[] } }[] | null
    }

  if (!userPermissions || userPermissions.length === 0) return false

  // Flatten structure: entries -> roles -> role_permissions(array) -> permission
  const permissions = userPermissions.flatMap(ur =>
    ur.roles?.role_permissions?.map(rp => rp.permission) || []
  )

  // Check exact match
  if (permissions.includes(permission)) return true

  // Check wildcard permissions
  const [module, resource, action] = permission.split(':')

  for (const userPerm of permissions) {
    const [permModule, permResource, permAction] = userPerm.split(':')

    // Full wildcard
    if (permModule === '*' && permResource === '*' && permAction === '*') {
      return true
    }

    // Module wildcard
    if (permModule === module && permResource === '*' && permAction === '*') {
      return true
    }

    // Resource wildcard
    if (permModule === module && permResource === resource && permAction === '*') {
      return true
    }
  }

  return false
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
