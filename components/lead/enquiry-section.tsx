'use client'

// The enquiry form as a page section, above the footer of every public page (user's choice
// 2026-10-31: "full same pattern" as the college sites). The pages here come from the CMS, so one
// section in the layout is the only way to reach all of them without editing CMS content. Each
// lead is tagged with the page it came from (utm_campaign <prefix>-<path>).
//
// NOT SHOWN where a visitor is not choosing a college: job seekers (/careers), alumni, and the
// student-service and compliance pages. On Engineering's seven /admissions/<programme> pages the
// dropdown opens on that programme.

import { usePathname } from 'next/navigation'
import { EnquiryForm } from '@/components/lead/enquiry-form'
import { ENGG_DEFAULT_PROGRAMME_BY_SLUG } from '@/lib/enquiry/crm-programmes'
import { currentEnquirySite, sourcePageFromPath } from '@/lib/enquiry/site'

const HIDDEN_FIRST_SEGMENTS = new Set([
  'careers',
  'alumni',
  'alumni-constitution',
  'online-grievance-and-redressal',
  'grievance-and-redressal',
  'anti-ragging-committee',
  'examination',
  'help-desk',
  'privacy-policy',
  'policies',
  'mandatory-disclosure',
  'iqac',
  'naac',
  // 2026-11-14 (user's call after the www forms check): legal page, same as privacy-policy.
  'terms-and-conditions',
  // Same day: www /nirf (its twin /iqac/nirf is already hidden) and /others - www
  // /others/academic-calendar, engg /others and /others/academic-calendar (student-service pages).
  'nirf',
  'others',
])

export function EnquirySection() {
  const pathname = usePathname() || '/'
  const site = currentEnquirySite()
  if (!site) return null

  const segments = pathname.toLowerCase().split('/').filter(Boolean)
  if (segments[0] && HIDDEN_FIRST_SEGMENTS.has(segments[0])) return null

  const programmeId =
    site.id === 'engineering' && segments[0] === 'admissions' && segments[1]
      ? ENGG_DEFAULT_PROGRAMME_BY_SLUG[segments[1]]
      : undefined

  return (
    <section aria-labelledby="enquiry-section-title" className="bg-gradient-to-br from-[#0b6d41] to-[#0f8f56] py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 id="enquiry-section-title" className="text-white text-2xl md:text-3xl font-bold text-center mb-2">
          {site.sectionHeading}
        </h2>
        <p className="text-white/80 text-center text-sm mb-8">
          Fill your details, then call or WhatsApp our admission team right away.
        </p>
        {/* key: a client-side page change must give a fresh form, not the last page's success state. */}
        <EnquiryForm key={pathname} sourcePage={sourcePageFromPath(pathname)} defaultProgrammeId={programmeId} />
      </div>
    </section>
  )
}
