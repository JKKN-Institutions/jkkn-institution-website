// GA4 events for the enquiry form, plus the browser memory that stops the homepage popup after a
// submit. Browser-only; safe to call from any client component.
//
// WAIT FOR gtag, DO NOT QUEUE. GA loads lazily here (components/analytics/google-analytics.tsx), so
// window.gtag may not exist when the homepage popup opens. On the Pharmacy site (2026-10-16, live)
// events pushed to dataLayer before gtag's "config" were dropped, so this waits for gtag and then
// sends - the event lands after "config", in order.
//
// No name, no phone - ever. Callers pass only where something happened.

import { getGAMeasurementId } from '@/lib/seo/institution-seo-config'

type Gtag = (...args: unknown[]) => void

export function sendLeadEvent(eventName: string, params: Record<string, string>): void {
  if (typeof window === 'undefined' || !getGAMeasurementId()) return
  let tries = 0
  const fire = () => {
    const w = window as unknown as { gtag?: Gtag }
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, params)
      return
    }
    // 40 x 250 ms = 10 s for the GA script to arrive; after that the event is given up quietly.
    if (++tries < 40) window.setTimeout(fire, 250)
  }
  fire()
}

/** Set after a CRM-accepted submit, so the homepage popup stops interrupting this visitor. */
export const ENQUIRY_DONE_KEY = 'jkkn_enquiry_done'

// localStorage throws in some private windows and when site data is blocked. A popup rule must
// never take the page down with it, so every access is wrapped.
export function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStore(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable - behave as a first visit */
  }
}
