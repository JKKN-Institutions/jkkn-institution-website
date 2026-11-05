'use client'
// Lead option 12 (2026-11-05): the CMS block "AdmissionInquiryForm" now sends its leads to the CRM.
//
// Until today the block (admission-inquiry-form.tsx) saved enquiries ONLY into the Supabase table
// admission_inquiries (app/actions/admission-inquiry.ts) - the CRM at jkkn.ai never saw them, so a counsellor
// would never call. A 2026-11-05 scan found it on 0 of 26 live admission / course / contact pages, so nothing
// was lost yet; this closes the risk before anyone places it. The CMS registries now load THIS component for
// the block name: the same props (the CMS editor and any saved page keep working), the section title and
// subtitle as before, and the site's own CRM enquiry form (components/lead/enquiry-form.tsx, with the
// Call / WhatsApp buttons). The old file stays for its props schema and the editor preview.
import { usePathname } from 'next/navigation'
import { EnquiryForm } from '@/components/lead/enquiry-form'
import { sourcePageFromPath } from '@/lib/enquiry/site'
import { cn } from '@/lib/utils'
import type { AdmissionInquiryFormProps } from './admission-inquiry-form'

export default function AdmissionInquiryCrm({
  sectionTitle = 'Start Your Journey with JKKN',
  sectionSubtitle = 'Get personalized guidance from our admission counsellors',
  showHeader = true,
  className,
  id,
}: AdmissionInquiryFormProps) {
  const pathname = usePathname() || '/'
  const sourcePage = `cms-inquiry-${sourcePageFromPath(pathname)}`.slice(0, 60)
  return (
    <section id={id} className={cn('bg-gradient-to-br from-[#0b6d41] to-[#0f8f56] py-16', className)}>
      <div className="max-w-3xl mx-auto px-4">
        {showHeader && (
          <>
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-2">{sectionTitle}</h2>
            <p className="text-white/80 text-center text-sm mb-8">{sectionSubtitle}</p>
          </>
        )}
        <EnquiryForm sourcePage={sourcePage} />
      </div>
    </section>
  )
}
