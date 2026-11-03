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

// Engineering's homepage carries the enquiry form inside its hero since 2026-11-03 (Step 3 of the
// 10,300-lead plan, user's choice). A popup over a form the visitor can already see is noise, so
// there the popup waits 20 s and never opens over a visitor who has started on the hero form. The
// main site keeps its 1 s popup - it has no form in its hero.
export const TOP_FORM_TOUCHED_KEY = 'jkkn_top_form_touched'

export function homePopupDelayMs(siteId: string | undefined): number {
  return siteId === 'engineering' ? 20_000 : 1_000
}

/** Per tab (sessionStorage): a new visit gets the popup again unless it submitted. */
export function markTopFormTouched(): void {
  try {
    window.sessionStorage.setItem(TOP_FORM_TOUCHED_KEY, '1')
  } catch {
    /* storage unavailable - the popup may still open; nothing breaks */
  }
}

export function topFormTouched(): boolean {
  try {
    return window.sessionStorage.getItem(TOP_FORM_TOUCHED_KEY) === '1'
  } catch {
    return false
  }
}

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
