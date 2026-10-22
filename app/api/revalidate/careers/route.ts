// app/api/revalidate/careers/route.ts
//
// Called by MyJKKN (a pg_net trigger on hr_recruitment_jobs) whenever HR
// creates, edits, publishes, closes or deletes a job, so /careers shows the
// change on the next request instead of after the 300s data-cache window.
// Auth: Authorization: Bearer ${CAREERS_REVALIDATE_SECRET}. Fails closed when
// the env var is unset — an open endpoint would let anyone flush the cache.

import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { CAREERS_CACHE_TAG } from '@/lib/services/public-careers-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isAuthorized(authHeader: string | null, secret: string | undefined): boolean {
  if (!secret || !authHeader) return false
  const given = Buffer.from(authHeader)
  const expected = Buffer.from(`Bearer ${secret}`)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req.headers.get('authorization'), process.env.CAREERS_REVALIDATE_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // { expire: 0 }: never serve the stale list — the caller is a webhook, so
  // updateTag (Server Actions only) is not available.
  revalidateTag(CAREERS_CACHE_TAG, { expire: 0 })
  return NextResponse.json({ ok: true, revalidated: CAREERS_CACHE_TAG })
}
