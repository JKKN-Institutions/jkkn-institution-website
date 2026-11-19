// app/api/revalidate/blog/route.ts
//
// Called by MyJKKN (the blog_notify_website trigger, through pg_net) whenever a
// blog post, category or comment changes, so /blog shows the change on the next
// request instead of after the 300s data-cache window. Only matters when
// BLOG_SOURCE=myjkkn (see lib/blog/myjkkn.ts).
// Auth: Authorization: Bearer ${BLOG_REVALIDATE_SECRET}. Fails closed when
// the env var is unset — an open endpoint would let anyone flush the cache.

import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { BLOG_CACHE_TAG } from '@/lib/blog/myjkkn'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isAuthorized(authHeader: string | null, secret: string | undefined): boolean {
  if (!secret || !authHeader) return false
  const given = Buffer.from(authHeader)
  const expected = Buffer.from(`Bearer ${secret}`)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req.headers.get('authorization'), process.env.BLOG_REVALIDATE_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // { expire: 0 }: never serve the stale post — the caller is a webhook, so
  // updateTag (Server Actions only) is not available.
  revalidateTag(BLOG_CACHE_TAG, { expire: 0 })
  return NextResponse.json({ ok: true, revalidated: BLOG_CACHE_TAG })
}
