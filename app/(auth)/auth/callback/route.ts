import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/admin'

  // DEBUG: Log all cookies to understand OAuth flow state
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  console.log('🍪 [OAuth Debug] Available cookies:', allCookies.map(c => ({
    name: c.name,
    hasValue: !!c.value,
    valueLength: c.value?.length || 0
  })))

  // DEBUG: Log critical Supabase auth cookies
  const authCookies = allCookies.filter(c =>
    c.name.includes('sb-') ||
    c.name.includes('pkce') ||
    c.name.includes('auth')
  )
  console.log('🔐 [OAuth Debug] Auth-related cookies:', authCookies.map(c => ({
    name: c.name,
    hasValue: !!c.value,
    valueLength: c.value?.length || 0
  })))

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // Add comprehensive error logging
      console.error('🔴 OAuth Code Exchange Failed:', {
        errorMessage: error.message,
        errorStatus: error.status,
        errorCode: error?.code,
        errorDetails: error,
        requestedCode: code ? 'present' : 'missing',
        requestURL: requestUrl.toString(),
        timestamp: new Date().toISOString()
      })

      return NextResponse.redirect(
        new URL('/auth/login?error=authentication_failed', requestUrl.origin)
      )
    }

    // SECURITY: Use getUser() instead of getSession() to verify token with Supabase Auth server
    // getSession() reads from cookies directly and may not be authentic
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const email = user.email

      // 1. Check if user email is from @jkkn.ac.in domain
      if (!email?.endsWith('@jkkn.ac.in')) {
        await supabase.auth.signOut()
        return NextResponse.redirect(
          new URL('/auth/login?error=unauthorized_domain', requestUrl.origin)
        )
      }

      // 2. Check if email is in approved_emails whitelist
      console.log('🔍 Checking approved_emails for:', email)
      const { data: approvedEmail, error: approvalError } = await supabase
        .from('approved_emails')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .single()

      console.log('📧 Approved email query result:', { approvedEmail, approvalError })

      if (approvalError || !approvedEmail) {
        // Email not in whitelist - sign out and redirect to access denied
        console.log('❌ Email not approved. Error:', approvalError?.message, 'Data:', approvedEmail)
        await supabase.auth.signOut()
        return NextResponse.redirect(
          new URL('/auth/access-denied?reason=not_approved', requestUrl.origin)
        )
      }

      console.log('✅ Email approved! Continuing to dashboard...')

      // 3. User is authenticated and approved
      // Profile, member, and guest role are auto-created by trigger

      // 4. Update last login timestamp
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', user.id)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
