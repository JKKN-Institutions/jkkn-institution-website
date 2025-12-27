/**
 * Web Vitals Performance Monitoring
 * Reports Core Web Vitals metrics for performance tracking
 */

import type { Metric } from 'web-vitals'

// Threshold values for good performance (Google's recommendations)
const thresholds = {
  CLS: 0.1,    // Cumulative Layout Shift: < 0.1 is good
  INP: 200,    // Interaction to Next Paint: < 200ms is good
  LCP: 2500,   // Largest Contentful Paint: < 2.5s is good
  FCP: 1800,   // First Contentful Paint: < 1.8s is good
  TTFB: 800,   // Time to First Byte: < 800ms is good
}

type VitalsRating = 'good' | 'needs-improvement' | 'poor'

function getRating(metric: Metric): VitalsRating {
  const threshold = thresholds[metric.name as keyof typeof thresholds]
  if (!threshold) return 'good'

  if (metric.value <= threshold) return 'good'
  if (metric.value <= threshold * 2.5) return 'needs-improvement'
  return 'poor'
}

/**
 * Log metrics to console in development
 */
function logMetric(metric: Metric) {
  const rating = getRating(metric)
  const ratingColors = {
    good: '\x1b[32m', // green
    'needs-improvement': '\x1b[33m', // yellow
    poor: '\x1b[31m', // red
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`,
      `color: ${rating === 'good' ? 'green' : rating === 'needs-improvement' ? 'orange' : 'red'}`
    )
  }
}

/**
 * Send metrics to analytics endpoint (optional)
 * Uncomment and configure if you have an analytics backend
 */
// function sendToAnalytics(metric: Metric) {
//   const body = JSON.stringify({
//     name: metric.name,
//     value: metric.value,
//     rating: getRating(metric),
//     id: metric.id,
//     navigationType: metric.navigationType,
//     delta: metric.delta,
//     timestamp: Date.now(),
//   })
//
//   // Use sendBeacon for reliability
//   if (navigator.sendBeacon) {
//     navigator.sendBeacon('/api/analytics/vitals', body)
//   } else {
//     fetch('/api/analytics/vitals', {
//       body,
//       method: 'POST',
//       keepalive: true,
//     })
//   }
// }

/**
 * Initialize Web Vitals reporting
 * Call this in your root layout or app component
 */
export async function reportWebVitals() {
  // Only run in browser
  if (typeof window === 'undefined') return

  // Dynamic import to avoid SSR issues
  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')

  // Report all Core Web Vitals
  onCLS(logMetric)
  onINP(logMetric)
  onLCP(logMetric)
  onFCP(logMetric)
  onTTFB(logMetric)
}

/**
 * Get the current performance summary
 * Useful for debugging or displaying in dev tools
 */
export function getPerformanceSummary() {
  if (typeof window === 'undefined') return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  const fcp = paint.find(p => p.name === 'first-contentful-paint')
  const fp = paint.find(p => p.name === 'first-paint')

  return {
    // Navigation timing
    dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    tcp: navigation?.connectEnd - navigation?.connectStart,
    ttfb: navigation?.responseStart - navigation?.requestStart,
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.startTime,
    load: navigation?.loadEventEnd - navigation?.startTime,

    // Paint timing
    firstPaint: fp?.startTime,
    firstContentfulPaint: fcp?.startTime,

    // Resource counts
    resourceCount: performance.getEntriesByType('resource').length,
  }
}
