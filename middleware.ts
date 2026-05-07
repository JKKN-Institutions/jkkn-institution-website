// middleware.ts
//
// Faculty slug-rename redirect.
//
// When MyJKKN admins rename a faculty slug, the sync engine records the
// old->new mapping in `public.faculty_slug_history`. This middleware
// 301-redirects any request to an old slug.
//
// Matcher is intentionally narrow (`/faculty/:slug`) so this middleware
// runs ONLY on faculty profile pages — no impact on other routes.

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Anon key + public-read RLS on faculty_slug_history is enough.
// (Service role would be overkill and would expose secrets to edge.)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const m = pathname.match(/^\/faculty\/([^/]+)\/?$/)
  if (!m) return NextResponse.next()

  const slug = decodeURIComponent(m[1])
  try {
    const { data } = await supabase
      .from('faculty_slug_history')
      .select('new_slug')
      .eq('old_slug', slug)
      .maybeSingle()

    if (data?.new_slug) {
      const url = req.nextUrl.clone()
      url.pathname = `/faculty/${data.new_slug}`
      return NextResponse.redirect(url, 301)
    }
  } catch {
    // Lookup failure — fall through to normal handling so we never block a
    // valid request because of a transient DB error.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/faculty/:slug'],
  // Use Node runtime (not edge) for compatibility with @supabase/supabase-js
  // and to avoid CSP issues with the edge runtime's strict env.
  runtime: 'nodejs',
}
