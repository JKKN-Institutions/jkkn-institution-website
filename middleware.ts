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

// Routes that guests CAN access (even with pending approval)
const guestAllowedRoutes = ['/admin', '/admin/dashboard', '/auth/access-denied']

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/auth')
  const isAdminPage = pathname.startsWith('/admin')

  // If user is not authenticated and trying to access admin pages, redirect to auth
  if (!session && isAdminPage) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to admin
  if (session && isAuthPage && pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Check if user email is from @jkkn.ac.in domain for admin access
  if (session && isAdminPage) {
    const email = session.user.email
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
      .eq('user_id', session.user.id)

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
      console.warn(`User ${session.user.id} has multiple roles:`, roles)
    }

    // Guest user protection
    if (isGuestOnly) {
      const isAllowedRoute = guestAllowedRoutes.some(
        (route) => pathname === route || pathname === route + '/'
      )

      if (!isAllowedRoute) {
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
          session.user.id,
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
 */
function getRoutePermission(pathname: string): string | null {
  // Check for exact match
  if (routePermissions[pathname]) {
    return routePermissions[pathname]
  }

  // Check for dynamic routes (e.g., /admin/users/[id])
  for (const [route, permission] of Object.entries(routePermissions)) {
    // Convert route to regex pattern for matching
    const routePattern = route.replace(/\[.*?\]/g, '[^/]+')
    const regex = new RegExp(`^${routePattern}(?:/.*)?$`)

    if (regex.test(pathname)) {
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
  // Get all permissions for this user's roles
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)

  if (!userRoles || userRoles.length === 0) return false

  const roleIds = userRoles.map((ur) => ur.role_id)

  // Get permissions for these roles
  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('permission')
    .in('role_id', roleIds)

  if (!permissions || permissions.length === 0) return false

  // Check for matching permission
  const userPermissions = permissions.map((p) => p.permission)

  // Check exact match
  if (userPermissions.includes(permission)) return true

  // Check wildcard permissions
  const [module, resource, action] = permission.split(':')

  for (const userPerm of userPermissions) {
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
