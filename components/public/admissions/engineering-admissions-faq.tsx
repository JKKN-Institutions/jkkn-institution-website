'use client'

import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { FAQItem } from '@/lib/institutions/engineering/admissions-data'

interface EngineeringAdmissionsFAQProps {
  faqs: FAQItem[]
}

export function EngineeringAdmissionsFAQ({ faqs }: EngineeringAdmissionsFAQProps) {
  const [activeAudience, setActiveAudience] = useState<'student' | 'parent'>('student')

  // Every FAQ is rendered, for both audiences. The inactive audience is hidden with the
  // `hidden` attribute instead of being filtered out of the tree, and answers are
  // force-mounted, so all question AND answer text is present in the server HTML.
  // Previously `.filter()` dropped the parent-audience questions and the accordion
  // unmounted every closed answer, so the FAQPage JSON-LD asserted 12 answers that no
  // crawler could find on the page. Googlebot renders JS but never clicks or toggles.
  return (
    <div>
      {/* Audience Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full border border-border bg-gray-50 p-1 gap-1">
          {(['student', 'parent'] as const).map((audience) => (
            <button
              key={audience}
              onClick={() => setActiveAudience(audience)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeAudience === audience
                  ? 'bg-[#0b6d41] text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {audience === 'student' ? 'For Learners' : 'For Parents'}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={`${faq.audience}-${index}`}
            value={`faq-${faq.audience}-${index}`}
            hidden={faq.audience !== activeAudience}
            className="bg-white border border-border rounded-xl px-6 overflow-hidden"
          >
            <AccordionTrigger className="text-left hover:no-underline py-5 text-sm font-semibold text-foreground hover:text-[#0b6d41] [&[data-state=open]]:text-[#0b6d41]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent
              forceMount
              className="text-sm text-muted-foreground leading-relaxed pb-5 data-[state=closed]:hidden"
            >
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
