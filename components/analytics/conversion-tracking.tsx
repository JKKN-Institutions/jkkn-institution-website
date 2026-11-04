'use client'

import { useEffect } from 'react'
import { sendLeadEvent } from '@/lib/enquiry/lead-events'

/**
 * phone_click / whatsapp_click for www.jkkn.ac.in and engg.jkkn.ac.in (2026-11-04).
 *
 * Ported from the six college sites (Dental components/analytics/ConversionTracking.tsx, DEP-14).
 * This codebase had no such listener, so a tap on a Call or WhatsApp link was never counted here,
 * while the college sites have counted it since 2026-08. Same events, same params as there, so the
 * figures compare across the estate.
 *
 * Params: link_url, link_text, page_path. Never a name, never a visitor's phone (the link_url is
 * the site's own number, the one printed on the page).
 *
 * Sent through sendLeadEvent (lib/enquiry/lead-events.ts), not a bare gtag() call: GA loads with
 * strategy "lazyOnload" in this codebase, so window.gtag may not exist yet when a visitor taps; a
 * bare call would drop that tap. sendLeadEvent waits up to 10 s for gtag and then sends.
 *
 * Counts the TAP, gated or not: the Call / WhatsApp form gate (enquiry-modal.tsx) opens the form
 * on a 93458 55001 link, and the tap is still a phone_click / whatsapp_click - so the numbers stay
 * comparable with the colleges, where the gate counts the same way.
 *
 * DO NOT ADD apply_click HERE. On the college GA4 properties apply_click is derived by a GA4
 * event-create rule from the enhanced-measurement click on jkkn.ai/apply; a code event would count
 * one click twice (the 2x over-count found on two properties 2026-07-29). Any move of apply_click
 * into code is a deliberate migration, not a one-line addition here.
 *
 * Mounted once in the public layout, capture phase, so it still fires when a component stops
 * propagation on its own click handler, and survives client-side navigation.
 */
export function ConversionTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const raw = (anchor.getAttribute('href') || '').trim()
      const href = raw.toLowerCase()
      const shared = {
        link_url: raw.slice(0, 100),
        link_text: (anchor.textContent || '').trim().slice(0, 60),
        page_path: window.location.pathname,
      }

      if (href.startsWith('tel:')) {
        sendLeadEvent('phone_click', shared)
        return
      }
      if (href.includes('wa.me/') || href.includes('api.whatsapp.com') || href.includes('web.whatsapp.com')) {
        sendLeadEvent('whatsapp_click', shared)
      }
      // Anything else is left alone on purpose - see the apply_click note above.
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
