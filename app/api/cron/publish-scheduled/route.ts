import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for cron operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // If no CRON_SECRET is set, allow in development
  if (!cronSecret) {
    return process.env.NODE_ENV === 'development'
  }

  return authHeader === `Bearer ${cronSecret}`
}

/**
 * Scheduled Publishing Cron Job
 *
 * This endpoint should be called periodically (e.g., every minute) by a cron service.
 * It publishes pages that have:
 * - status = 'scheduled'
 * - scheduled_publish_at <= now()
 *
 * Vercel Cron configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/publish-scheduled",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  // Verify authorization
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date().toISOString()

    // Find all scheduled pages that should be published
    const { data: scheduledPages, error: fetchError } = await supabase
      .from('cms_pages')
      .select('id, title, slug, scheduled_publish_at')
      .eq('status', 'scheduled')
      .not('scheduled_publish_at', 'is', null)
      .lte('scheduled_publish_at', now)

    if (fetchError) {
      console.error('Error fetching scheduled pages:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!scheduledPages || scheduledPages.length === 0) {
      return NextResponse.json({
        message: 'No pages to publish',
        published: 0,
        timestamp: now,
      })
    }

    // Publish each page
    const results = await Promise.allSettled(
      scheduledPages.map(async (page) => {
        const { error: updateError } = await supabase
          .from('cms_pages')
          .update({
            status: 'published',
            published_at: now,
            updated_at: now,
          })
          .eq('id', page.id)

        if (updateError) {
          throw new Error(`Failed to publish page ${page.id}: ${updateError.message}`)
        }

        // Log the publish action
        await supabase.from('user_activity_logs').insert({
          user_id: null, // System action
          action: 'publish',
          module: 'cms',
          resource_type: 'page',
          resource_id: page.id,
          ip_address: null,
          user_agent: 'Cron Job',
          metadata: {
            title: page.title,
            slug: page.slug,
            scheduled_at: page.scheduled_publish_at,
            published_at: now,
            action: 'scheduled_publish',
          },
        })

        return { id: page.id, title: page.title, slug: page.slug }
      })
    )

    // Process results
    const published = results
      .filter((r): r is PromiseFulfilledResult<{ id: string; title: string; slug: string }> => r.status === 'fulfilled')
      .map((r) => r.value)

    const failed = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => r.reason?.message || 'Unknown error')

    return NextResponse.json({
      message: `Published ${published.length} page(s)`,
      published,
      failed: failed.length > 0 ? failed : undefined,
      timestamp: now,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggering from admin panel
export async function POST(request: NextRequest) {
  return GET(request)
}
