'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Server action to sign out the current user
 */
export async function signOut() {
  const supabase = await createServerSupabaseClient()

  // Sign out from Supabase - this will clear the session and cookies
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    throw error
  }

  // Revalidate all paths to clear any cached data
  revalidatePath('/', 'layout')

  // Redirect to login page
  redirect('/auth/login')
}
