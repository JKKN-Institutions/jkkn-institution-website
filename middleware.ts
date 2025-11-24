import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isPublicPage = !isAuthPage && !isAdminPage

  // If user is not authenticated and trying to access admin pages, redirect to auth
  if (!session && isAdminPage) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to admin
  if (session && isAuthPage) {
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
  }

  return response
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
