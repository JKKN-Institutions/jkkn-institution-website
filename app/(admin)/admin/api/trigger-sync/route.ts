// app/(admin)/admin/api/trigger-sync/route.ts
//
// Server-only proxy for the "Sync from MyJKKN" button in /admin/faculty.
// Uses the same auth pattern as the (admin) layout: getUser() + @jkkn.ac.in
// email check. We can't rely on the layout to gate API routes (Next.js
// layouts only apply to pages), so the check happens here.
//
// On success calls syncFacultyFromMyJKKN directly; the FACULTY_SYNC_SECRET
// is NEVER exposed to the browser — the button hits this same-origin route
// and we run the sync inline.

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { syncFacultyFromMyJKKN } from '@/lib/sync/faculty-sync'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  if (!user.email?.endsWith('@jkkn.ac.in')) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
  }

  try {
    const report = await syncFacultyFromMyJKKN()
    return NextResponse.json({ ok: true, ...report })
  } catch (e) {
    console.error('[admin/trigger-sync] failed:', e)
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    )
  }
}
