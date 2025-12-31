'use server'

import { createPublicSupabaseClient } from '@/lib/supabase/public'
import { z } from 'zod'

// ============================================
// Validation Schema
// ============================================

const PageViewSchema = z.object({
  pagePath: z.string().max(500),
  pageTitle: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  visitorId: z.string().length(64), // SHA-256 hash is always 64 chars
  deviceType: z.enum(['mobile', 'tablet', 'desktop']),
  browser: z.string().max(50).optional()
})

export type TrackPageViewInput = z.infer<typeof PageViewSchema>

// ============================================
// Rate Limiting (Simple in-memory)
// ============================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 30 // Max requests per window
const RATE_LIMIT_WINDOW = 60000 // 1 minute in ms

function checkRateLimit(visitorId: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(visitorId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(visitorId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

// Clean up old entries periodically
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key)
      }
    }
  }, 60000) // Clean up every minute
}

// ============================================
// Track Page View Action
// ============================================

/**
 * Track a page view from the public website
 * Uses anonymous Supabase client to insert (RLS allows anon inserts)
 */
export async function trackPageView(
  data: TrackPageViewInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validated = PageViewSchema.parse(data)

    // Check rate limit
    if (!checkRateLimit(validated.visitorId)) {
      // Silently ignore rate-limited requests
      return { success: true }
    }

    // Create anonymous Supabase client for public tracking
    const supabase = createPublicSupabaseClient()

    // Insert page view
    const { error } = await supabase.from('page_views').insert({
      page_path: validated.pagePath,
      page_title: validated.pageTitle || null,
      referrer: validated.referrer || null,
      visitor_id: validated.visitorId,
      device_type: validated.deviceType,
      browser: validated.browser || null
    })

    if (error) {
      console.error('Failed to track page view:', error.message)
      return { success: false, error: 'Failed to track page view' }
    }

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: 'Invalid page view data' }
    }

    console.error('Track page view error:', err)
    return { success: false, error: 'An error occurred' }
  }
}
