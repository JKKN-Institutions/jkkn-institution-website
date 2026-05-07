// app/api/cron/sync-faculty-from-api/route.ts
//
// Vercel Cron entrypoint. Runs every 15 minutes per vercel.json.
// Auth: Authorization: Bearer ${CRON_SECRET} — mirrors the existing
// /api/cron/publish-scheduled pattern, reuses the same env var.

import { NextRequest, NextResponse } from 'next/server'
import { syncFacultyFromMyJKKN } from '@/lib/sync/faculty-sync'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function verifyCronSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  // Allow unauth in development only (mirrors publish-scheduled pattern)
  if (!cronSecret) return process.env.NODE_ENV === 'development'
  return authHeader === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const report = await syncFacultyFromMyJKKN()
    return NextResponse.json({ ok: true, ...report })
  } catch (e) {
    console.error('[cron/sync-faculty] failed:', e)
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}

// Allow manual POST with the same auth — useful for ad-hoc cron triggers.
export async function POST(req: NextRequest) {
  return GET(req)
}
