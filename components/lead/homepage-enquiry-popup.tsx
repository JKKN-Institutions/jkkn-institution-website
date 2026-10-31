'use client'

// Homepage popup: the enquiry dialog opens one second after the homepage loads (the timing the
// old Engineering poster popup used), on the main site and on Engineering. Once a visitor has
// submitted the enquiry form anywhere on the site, it stops. Leads are tagged <prefix>-home-popup.
//
// NO POSTER, ON PURPOSE (2026-10-31). The college sites show their admission poster beside the
// form. Engineering's only poster, /images/engineering/campaign-2026.jpg, prints "Admissions Open
// 2026-27", an MBA code 2619 where the DoTE list gives 2647 (lib/institutions/engineering/
// official-data.ts) and an "India's first AI empowered college" line with no source - so it is not
// carried into the new popup. Add a poster here once a corrected one exists.

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useEnquiryModal } from '@/components/lead/enquiry-modal'
import { ENQUIRY_DONE_KEY, readStore, sendLeadEvent } from '@/lib/enquiry/lead-events'

export function HomepageEnquiryPopup() {
  const modal = useEnquiryModal()
  const isHome = usePathname() === '/'

  useEffect(() => {
    if (!modal || !isHome || readStore(ENQUIRY_DONE_KEY)) return
    const timer = window.setTimeout(() => {
      sendLeadEvent('popup_view', { popup_variant: 'form', page_path: window.location.pathname })
      modal.openEnquiry('home-popup')
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [modal, isHome])

  return null
}
