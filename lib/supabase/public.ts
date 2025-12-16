import { createClient } from '@supabase/supabase-js'

/**
 * Anonymous Supabase client for public data fetching.
 * Does NOT use cookies - safe for static generation.
 *
 * Use this for:
 * - FAB config (cms_page_fab_config)
 * - Public site settings
 * - Any data with RLS policies allowing anonymous access
 *
 * DO NOT use for:
 * - User-specific data
 * - Authenticated operations
 * - Data requiring session context
 */
export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
