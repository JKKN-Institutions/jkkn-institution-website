'use client'

// The enquiry form inside the Engineering homepage hero - Step 3 of the 10,300-lead plan ("homepage
// la mela form", user's choices 2026-11-03): on desktop it takes the hero's right column, where the
// campus photo was; on phones it sits straight under the Apply / Explore buttons. Measured before
// (headless Chromium, 2026-11-03): the first inline form was 15.05 phone screens / 9.81 desktop
// screens down the page. 95% of the homepage's disclosed Google clicks are brand searches (GSC
// Aug-Oct 2026), i.e. people who already chose JKKN and only need a box to type into.
//
// MAIN SITE (www), 2026-11-17: the same card sits in the homepage hero's right column from xl
// (1280 px) up, without the 1-2-3 strip (showSteps false), and stays under the hero on phones and
// tablets with the strip - app/(public)/page.tsx + components/cms-blocks/page-renderer.tsx.
//
// Same 3-box form as the popup (name, mobile, programme -> the jkkn.ai CRM form). Leads are tagged
// source_page "home-top". Focusing any field marks the tab so the homepage popup stays away.

import { EnquiryForm } from '@/components/lead/enquiry-form'
import { currentEnquirySite } from '@/lib/enquiry/site'
import { markTopFormTouched } from '@/lib/enquiry/lead-events'

export function HeroEnquiryCard({ showSteps = true }: { showSteps?: boolean } = {}) {
  const site = currentEnquirySite()
  if (!site) return null

  return (
    <div
      data-top-enquiry
      onFocusCapture={markTopFormTouched}
      className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto rounded-[20px] bg-white p-4 min-[640px]:p-6 shadow-[0_18px_40px_rgba(3,40,22,0.25)]"
    >
      <p className="font-bold leading-snug text-[#032816] text-lg mb-3">{site.dialogTitle}</p>
      <EnquiryForm sourcePage="home-top" compact bare showSteps={showSteps} />
    </div>
  )
}
