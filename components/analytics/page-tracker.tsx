'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/app/actions/track-pageview'
import {
  getVisitorId,
  getDeviceType,
  getBrowserName,
  isDoNotTrackEnabled
} from '@/lib/analytics/visitor-id'

/**
 * PageTracker Component
 *
 * Tracks page views on the public website.
 * - Respects Do Not Track browser setting
 * - Uses anonymous visitor IDs (no PII)
 * - Debounces rapid navigation
 * - Runs only on client-side
 */
export function PageTracker() {
  const pathname = usePathname()
  const lastTrackedPath = useRef<string | null>(null)
  const trackingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Respect Do Not Track
    if (isDoNotTrackEnabled()) {
      return
    }

    // Debounce tracking to handle rapid navigation
    if (trackingTimeoutRef.current) {
      clearTimeout(trackingTimeoutRef.current)
    }

    trackingTimeoutRef.current = setTimeout(async () => {
      // Don't track the same path twice in succession
      if (pathname === lastTrackedPath.current) {
        return
      }

      lastTrackedPath.current = pathname

      try {
        const visitorId = await getVisitorId()
        const deviceType = getDeviceType()
        const browser = getBrowserName()

        // Get referrer (only on initial load, not SPA navigation)
        const referrer = document.referrer || undefined

        // Get page title
        const pageTitle = document.title || undefined

        await trackPageView({
          pagePath: pathname,
          pageTitle,
          referrer,
          visitorId,
          deviceType,
          browser
        })
      } catch (error) {
        // Silently fail - analytics should never break the site
        console.debug('Page tracking failed:', error)
      }
    }, 100) // 100ms debounce

    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current)
      }
    }
  }, [pathname])

  // This component renders nothing
  return null
}
