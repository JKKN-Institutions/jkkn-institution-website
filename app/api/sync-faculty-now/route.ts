// app/api/sync-faculty-now/route.ts
//
// Manual sync trigger. Two callers planned:
//  1. The "Sync from MyJKKN" button in /admin/faculty (proxied through
//     /admin/api/trigger-sync which injects the secret server-side).
//  2. A future MyJKKN webhook for staff.{created,updated,deleted}.
//
// Auth: header `x-sync-secret` matched against FACULTY_SYNC_SECRET via
// constant-time compare. Plain Bearer token would also work but a custom
// header keeps the surface smaller (no `authorization: bearer ...` pattern
// for log scrubbers / proxies to confuse with other endpoints).

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { syncFacultyFromMyJKKN } from '@/lib/sync/faculty-sync'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function constantTimeEqual(a: string, b: string): boolean {
  // crypto.timingSafeEqual requires equal-length inputs — guard explicitly
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(req: NextRequest) {
  const SECRET = process.env.FACULTY_SYNC_SECRET ?? ''
  if (!SECRET) {
    return NextResponse.json(
      { error: 'FACULTY_SYNC_SECRET not configured' },
      { status: 500 }
    )
  }

  const provided = req.headers.get('x-sync-secret') ?? ''
  if (!constantTimeEqual(provided, SECRET)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const report = await syncFacultyFromMyJKKN()
    return NextResponse.json({ ok: true, ...report })
  } catch (e) {
    console.error('[sync-faculty-now] failed:', e)
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}
