import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

// ==========================================================================
// SEO CLEANUP: WordPress Hack Remediation (2026-05)
// ==========================================================================
// The old jkkn.ac.in WordPress site was compromised with gambling/betting
// spam injection. These patterns return 410 Gone or 301 redirects BEFORE
// any auth work to avoid wasting Supabase calls on spam/legacy URLs.
// ==========================================================================

const SPAM_REGEX = /^\/(megapari|dafabet|download-dafabet|download-megapari|download-helabet|download-the-latest-version-of-20bet|20bet|22bet|stake-bet|stake-casino|stake-com|stake-online|batery-|1xbit|access-online-casino|exceptional-casino|unrivaled-gaming|available-deposit|100-first-deposit|official-20bet|best-betting|welcome-offer-games|actual-link-to-download|win-in-real-time|how-to-download-dafabet|app-download-\d|minecraft-beta-preview|types-of-batteries-and-cells|ai-process-consulting-the-new-engine)/

const WP_ARCHIVE_REGEX = /^\/(author|tag|category|account)\//

const WP_SYSTEM_REGEX = /^\/(wp-content|wp-includes|wp-json|wp-admin|xmlrpc\.php)/

const FEED_SUFFIX_REGEX = /\/feed\/?$/

const JUNK_URLS = new Set([
  '/;l',
  '/__trashed-9__trashed',
  '/test-career-page',
  '/test-careers',
  '/test-3',
  '/test-latest',
  '/psychometric-career-test',
  '/info',
  '/camu',
  '/canva',
  '/outlook',
  '/excel',
  '/access',
])

const OLD_BLOG_POSTS = new Set([
  '/sresakthimayeil-institute-of-nursing-and-research-conducted-earth-day',
  '/world-kidney-cancer-day',
  '/workshop-on-corticobasal-implants',
  '/e-library-orientation-program',
  '/placement-day-celebration-2025',
  '/resuscitation-india-sumit-2023',
  '/onam-celebrations-ahs-campus',
  '/celebrating-the-98th-birthday-of-jkk-nattaraja-sir-founders-day-at-jkk-nattaraja-college',
  '/kumarapalayam-bypass-marathon',
  '/25th-ips-pg-convention',
  '/national-vaccination-day',
  '/15th-sports-day-event',
  '/world-hepatitis-day',
  '/2-board-examination-in-2022-2023',
  '/road-safety-awareness',
  '/intellectual-property-rights-day-2',
  '/curtain-raiser-jkkn-global-alumni-utsav',
  '/jkkn-college-of-engineering-and-technology-sports-day-2023',
  '/cbct-inauguration',
  '/national-service-scheme',
  '/international-plastic-bag-free-day-2',
  '/world-health-days',
  '/jkkncets-initiative-on-mental-health-and-suicide-awareness',
  '/national-level-technical-symposium-technovation-23',
  '/world-malaria-day',
  '/anti-ragging-seminar-program',
  '/best-poster-award-at-a-national-level-seminar-organized-by-psg-college-of-pharmacy',
  '/world-homeopathy-day',
  '/jkk-nataraja-colleges-first-year-commencement-ceremony-2023',
  '/onam-celebration-at-ahs-campus',
  '/national-conference-race-2k23',
  '/faculty-development-program',
  '/national-level-poster-presentation',
  '/field-visit-day-by-ssm-group-of-schools-to-our-jkkn-dental-college',
  '/national-level-seminar-conducted-by-psg-college-of-pharmacy',
  '/electoral-literacy-club',
  '/world-health-day-celebration',
  '/world-health-day-2',
  '/the-national-level-symposium-technovation-23',
  '/campus-recruitment-drive-2025-a-step-towards-bright-futures',
  '/happy-labour-day',
  '/world-breastfeeding-week-celebration-promoting-maternal-child-health',
  '/alumni-meet-2025-reconnect-relive',
  '/alumni-meet',
  '/internship-workshop-orientation-for-our-final-year-students',
  '/environmental-talks',
  '/jkkn-college-of-engineering-and-technology-15th-annual-day',
])

const GONE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>410 Gone</title>
  <meta name="robots" content="noindex">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:system-ui,sans-serif;max-width:500px;margin:80px auto;text-align:center;color:#333;padding:0 20px">
  <h1 style="font-size:48px;margin-bottom:8px">410</h1>
  <p style="font-size:18px;color:#666;margin-bottom:24px">This page has been permanently removed.</p>
  <a href="/" style="color:#16a34a;text-decoration:underline;font-size:16px">Go to Homepage</a>
</body>
</html>`

// ==========================================================================
// END SEO CLEANUP CONSTANTS
// ==========================================================================

// Lightweight anon client for faculty slug-history lookups.
// Public-read RLS on faculty_slug_history makes the anon key sufficient,
// and the module-level instance avoids re-initialising on every request.
const slugLookupClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)

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
  '/editor/[id]': 'cms:pages:edit',
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
const guestAllowedRoutes = new Set(['/admin', '/auth/access-denied'])

// Engineering-only routes that live in the shared codebase but should 404 on
// non-Engineering deployments (e.g. Main jkkn.ac.in). These page files live
// under app/(public)/admissions/be-*, app/(public)/admissions/{mba,engineering,
// fee-structure,me-cse,btech-it} and app/(public)/courses/{ece,it,me-cse}.
// Matching is done against the leading path segment so deeper subpaths are
// caught too (e.g. /admissions/be-cse/syllabus).
const engineeringOnlyPathPrefixes = [
  '/admissions/be-cse',
  '/admissions/be-ece',
  '/admissions/be-eee',
  '/admissions/be-mechanical',
  '/admissions/btech-it',
  '/admissions/me-cse',
  '/admissions/mba',
  '/admissions/engineering',
  '/admissions/fee-structure',
  '/courses/ece',
  '/courses/it',
  '/courses/me-cse',
]

function isEngineeringOnlyPath(pathname: string): boolean {
  const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return engineeringOnlyPathPrefixes.some(
    prefix => normalized === prefix || normalized.startsWith(prefix + '/')
  )
}

export async function proxy(request: NextRequest) {
  // CRITICAL: Extract pathname FIRST, before creating any clients
  const pathname = request.nextUrl.pathname

  // ── SEO: Normalize trailing slashes ─────────────────────────────────────
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  // ── SEO: Redirect old blog/event posts to /blog ─────────────────────────
  if (OLD_BLOG_POSTS.has(pathname)) {
    return NextResponse.redirect(new URL('/blog', request.url), 301)
  }

  // ── SEO: Return 410 Gone for spam and WordPress legacy URLs ─────────────
  if (
    SPAM_REGEX.test(pathname) ||
    WP_ARCHIVE_REGEX.test(pathname) ||
    WP_SYSTEM_REGEX.test(pathname) ||
    FEED_SUFFIX_REGEX.test(pathname) ||
    JUNK_URLS.has(pathname)
  ) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }

  // Engineering-only route guard.
  // On non-Engineering deployments (Main, Dental, etc.) these page paths must
  // return 404 instead of rendering Engineering content. Engineering's own
  // deployment passes through (institutionId === 'engineering'). Runs before
  // any auth work so we don't pay session-check costs to 404 a public route.
  // Rewrites to a synthetic non-existent path so the framework renders the
  // global app/not-found.tsx UI with proper branding instead of a blank 404.
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  if (institutionId !== 'engineering' && isEngineeringOnlyPath(pathname)) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = '/__engineering_only_404'
    return NextResponse.rewrite(rewriteUrl)
  }

  // Faculty slug-rename redirect.
  // When MyJKKN admins rename a faculty slug, the sync engine records the
  // old->new mapping in public.faculty_slug_history. Run this BEFORE any
  // auth work so public faculty pages don't pay the cost of a session check.
  const facultySlugMatch = pathname.match(/^\/faculty\/([^/]+)\/?$/)
  if (facultySlugMatch) {
    const oldSlug = decodeURIComponent(facultySlugMatch[1])
    try {
      const { data } = await slugLookupClient
        .from('faculty_slug_history')
        .select('new_slug')
        .eq('old_slug', oldSlug)
        .maybeSingle()
      if (data?.new_slug) {
        const url = request.nextUrl.clone()
        url.pathname = `/faculty/${data.new_slug}`
        return NextResponse.redirect(url, 301)
      }
    } catch {
      // Lookup failure — fall through to normal handling so we never
      // block a valid request because of a transient DB error.
    }
    // No history match: faculty pages are public, skip auth pipeline.
    return NextResponse.next()
  }

  // CRITICAL: Skip ALL middleware logic for OAuth callback
  // Must happen BEFORE creating Supabase client to avoid cookie interference
  // The callback route handles its own auth verification
  // Creating the client would call getUser() which interferes with OAuth flow state
  if (pathname === '/auth/callback') {
    console.log('✅ [Middleware] Bypassing OAuth callback - cookies preserved')
    return NextResponse.next()
  }

  // Only create Supabase client if NOT callback route
  const { supabase, response } = createMiddlewareClient(request)

  // IMPORTANT: Use getUser() instead of getSession() to properly refresh the session
  // getUser() verifies the token with Supabase Auth and refreshes expired tokens
  // This ensures Server Actions can read the user from cookies
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = pathname.startsWith('/auth')
  const isAdminPage = pathname.startsWith('/admin')
  const isEditorPage = pathname.startsWith('/editor')

  // If user is not authenticated and trying to access admin or editor pages, redirect to auth
  if (!user && (isAdminPage || isEditorPage)) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to admin
  if (user && isAuthPage && pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Check if user email is from @jkkn.ac.in domain for admin and editor access
  if (user && (isAdminPage || isEditorPage)) {
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
