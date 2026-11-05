'use client'
// Enquiry box inside a blog post and near the top of Engineering's course admission pages (lead options 1 + 2,
// 2026-11-05). The same white card + compact 3-box form the six college sites carry. The title is the site's own
// enquiry heading (lib/enquiry/site.ts). It is not a heading element, so the article's H2 outline stays as written.
import { EnquiryForm } from '@/components/lead/enquiry-form'
import { currentEnquirySite } from '@/lib/enquiry/site'

type Props = {
  /** Tags the lead in the CRM as utm_campaign <site prefix>-<sourcePage>. */
  sourcePage: string
  /** Pre-selected programme id (e.g. B.E. CSE on its own page). Optional: the reader picks. */
  programmeId?: string
  /** Card title; defaults to the site's enquiry heading. */
  title?: string
}

export function BlogEnquiryBox({ sourcePage, programmeId, title }: Props) {
  const site = currentEnquirySite()
  if (!site) return null
  return (
    <aside
      aria-label="Admission enquiry"
      className="not-prose my-10 max-w-xl mx-auto rounded-[20px] bg-white border border-[#d4f1e4] shadow-[0_18px_40px_rgba(3,40,22,0.35)] p-5 sm:p-6 lg:p-7"
    >
      <div className="mb-4">
        <div className="text-xl lg:text-2xl font-bold text-[#032816] leading-snug">{title ?? site.sectionHeading}</div>
        <div className="mt-2 text-base text-[#374151] leading-relaxed">
          Fill your details, then call or WhatsApp our admission team right away.
        </div>
      </div>
      <EnquiryForm sourcePage={sourcePage} defaultProgrammeId={programmeId} compact bare />
    </aside>
  )
}
