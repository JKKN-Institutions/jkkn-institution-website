'use client'

// Homepage popup: the enquiry dialog opens one second after the homepage loads (the timing the
// old Engineering poster popup used), on the main site and on Engineering. Once a visitor has
// submitted the enquiry form anywhere on the site, it stops. Leads are tagged <prefix>-home-popup.
//
// ENGINEERING, 2026-11-03: the form now sits in Engineering's hero (components/lead/
// hero-enquiry-card.tsx), so there the popup waits 20 s and stays away from a visitor who has
// started typing in the hero form (lib/enquiry/lead-events.ts homePopupDelayMs / topFormTouched).
// The main site is unchanged.
//
// NO POSTER, ON PURPOSE (2026-10-31). The college sites show their admission poster beside the
// form. Engineering's only poster, /images/engineering/campaign-2026.jpg, prints "Admissions Open
// 2026-27", an MBA code 2619 where the DoTE list gives 2647 (lib/institutions/engineering/
// official-data.ts) and an "India's first AI empowered college" line with no source - so it is not
// carried into the new popup. Add a poster here once a corrected one exists.

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useEnquiryModal } from '@/components/lead/enquiry-modal'
import { currentEnquirySite } from '@/lib/enquiry/site'
import {
  ENQUIRY_DONE_KEY,
  homePopupDelayMs,
  readStore,
  sendLeadEvent,
  topFormTouched,
} from '@/lib/enquiry/lead-events'

export function HomepageEnquiryPopup() {
  const modal = useEnquiryModal()
  const isHome = usePathname() === '/'
  const siteId = currentEnquirySite()?.id

  useEffect(() => {
    if (!modal || !isHome || readStore(ENQUIRY_DONE_KEY)) return
    const timer = window.setTimeout(() => {
      // Checked again when the timer fires: within 20 s the visitor may have submitted or started
      // on the hero form.
      if (readStore(ENQUIRY_DONE_KEY) || topFormTouched()) return
      sendLeadEvent('popup_view', { popup_variant: 'form', page_path: window.location.pathname })
      modal.openEnquiry('home-popup')
    }, homePopupDelayMs(siteId))
    return () => window.clearTimeout(timer)
  }, [modal, isHome, siteId])

  return null
}
