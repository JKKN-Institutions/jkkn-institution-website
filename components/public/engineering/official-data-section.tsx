import {
  APPROVALS_FAQS,
  APPROVALS_KEY_FACTS,
  ENGG_OFFICIAL,
} from '@/lib/institutions/engineering/official-data'

/**
 * Key facts and FAQ under the documents on /approvals-and-affiliation (engineering only).
 *
 * Every fact carries its source line, and the FAQPage JSON-LD repeats only the questions shown
 * here. The spoken Tanglish form of each question is printed under it, not added to the schema.
 * Server component: the text is in the HTML a crawler receives, not added after hydration.
 */
export function EngineeringOfficialDataSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: APPROVALS_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <section aria-labelledby="official-data-heading" className="w-full bg-[#fbfbee]">
      <div className="container mx-auto px-4 pt-4 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 id="official-data-heading" className="text-xl md:text-2xl font-bold text-[#0b6d41] mb-2">
            Key facts from the official lists
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            As printed by AICTE, UGC, NAAC, the Directorate of Technical Education, Tamil Nadu and AISHE.
            The AICTE Extension of Approval for {ENGG_OFFICIAL.aicte.academicYear} is linked above.
          </p>
          <dl className="grid gap-4 md:grid-cols-2">
            {APPROVALS_KEY_FACTS.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-[#0b6d41]/15 bg-white p-4 shadow-sm min-w-0">
                <dt className="font-semibold text-[#0b6d41]">{fact.label}</dt>
                <dd className="mt-1 text-gray-800 leading-relaxed">{fact.value}</dd>
                <dd className="mt-2 text-xs text-gray-500 leading-relaxed [overflow-wrap:anywhere]">{fact.source}</dd>
              </div>
            ))}
          </dl>

          <h2 className="text-xl md:text-2xl font-bold text-[#0b6d41] mt-12 mb-4">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {APPROVALS_FAQS.map((faq) => (
              <div key={faq.question} className="p-4 md:p-5">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-1 text-sm italic text-[#0b6d41]">Also asked: {faq.alsoAsked}</p>
                <p className="mt-2 text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  )
}
