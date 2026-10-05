// lib/analytics/careers-events.ts
//
// GA4 events for the careers pages (spec §7). Browser-only helper; safe to
// call from any client component. Does nothing when this institution has no
// GA measurement id, so one tenant's searches never land in another's property.
//
// GA is loaded with `lazyOnload` (components/analytics/google-analytics.tsx),
// so `window.gtag` may not exist yet when a page-load event fires. Until it
// does, events are queued on `dataLayer` in gtag's own format and picked up
// when the library boots.

import { getGAMeasurementId } from '@/lib/seo/institution-seo-config'

export type CareersEvent =
  | 'search'
  | 'share'
  | 'careers_no_results'
  | 'careers_filter'
  | 'careers_job_view'
  | 'careers_job_save'
  | 'careers_apply_click'
  | 'careers_apply_start'
  | 'careers_apply_complete'

type EventParams = Record<string, string | number | undefined>

interface GtagWindow {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

export function trackCareersEvent(name: CareersEvent, params: EventParams = {}): void {
  if (typeof window === 'undefined' || !getGAMeasurementId()) return
  const w = window as unknown as GtagWindow
  if (typeof w.gtag === 'function') {
    w.gtag('event', name, params)
    return
  }
  const queue = (w.dataLayer ??= [])
  // gtag.js only reads `arguments` objects from dataLayer — a plain array is ignored.
  const enqueue = function () {
    // eslint-disable-next-line prefer-rest-params
    queue.push(arguments)
  } as (...args: unknown[]) => void
  enqueue('event', name, params)
}
