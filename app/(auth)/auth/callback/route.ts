import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/admin/dashboard'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        new URL('/auth/login?error=authentication_failed', requestUrl.origin)
      )
    }

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      const email = session.user.email

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
        .eq('id', session.user.id)
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
