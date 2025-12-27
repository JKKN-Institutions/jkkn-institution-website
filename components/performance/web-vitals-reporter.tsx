'use client'

import { useEffect } from 'react'

/**
 * Client component that initializes Web Vitals reporting
 * Only active in development mode
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // Only report in development to avoid performance overhead in production
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/utils/web-vitals').then(({ reportWebVitals }) => {
        reportWebVitals()
      })
    }
  }, [])

  return null
}
