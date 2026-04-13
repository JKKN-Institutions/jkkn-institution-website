import React from 'react'
import Link from 'next/link'
import { ExternalLink, Phone, Mail, Check } from 'lucide-react'
import { EngineeringAdmissionsFAQ } from '@/components/public/admissions/engineering-admissions-faq'
import { CONTACT_INFO } from '@/lib/institutions/engineering/admissions-data'
import { fetchEngineeringAdmissionsData } from '@/lib/institutions/engineering/fetch-admissions'

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────

function FAQPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

function BreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Admissions', item: '/admissions/engineering' },
    ],
  }
}

function EducationalOrgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'JKKN College of Engineering and Technology',
    url: 'https://engg.jkkn.ac.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Natarajapuram, NH-544 (Salem–Coimbatore Highway), Komarapalayam',
      addressLocality: 'Namakkal',
      addressRegion: 'Tamil Nadu',
      postalCode: '638183',
      addressCountry: 'IN',
    },
    telephone: '+919345855001',
    accreditationBody: 'NAAC',
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const APPLY_URL = 'https://www.jkkn.ai/apply/jkkn-admission-2026'

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function Section({
  id,
  gray = false,
  children,
}: {
  id?: string
  gray?: boolean
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`py-12 md:py-16 ${gray ? 'bg-[#f6faf7]' : 'bg-white'}`}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">{children}</div>
    </section>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">{title}</h2>
      <div className="mt-3 h-1 w-10 rounded-full bg-[#0b6d41] mx-auto" />
    </div>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function EngineeringAdmissionsMain() {
  const {
    overview,
    programs,
    eligibility,
    steps,
    guidelines,
    documents,
    feeStructure,
    dates,
    scholarshipGroups,
    faqs,
  } = await fetchEngineeringAdmissionsData()

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQPageSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(EducationalOrgSchema()) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0b6d41] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block bg-[#ffde59] text-[#0b6d41] text-xs font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-5">
            Admissions Open 2026
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Admission Process 2026
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Complete guide to admissions for B.E / B.Tech and M.E / MBA programmes at JKKN College of Engineering and Technology, Namakkal
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ffde59] text-[#0b6d41] font-bold text-sm px-7 py-3 rounded-full shadow hover:bg-[#f5c518] transition-colors"
            >
              Apply Online
              <ExternalLink className="w-4 h-4" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-7 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-colors"
            >
              Contact Admissions
            </a>
          </div>
        </div>
      </section>

      {/* ── 01: Overview ──────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading title="Admission 2026 Overview" />
        <div className="prose prose-sm md:prose-base max-w-none text-gray-600 leading-relaxed space-y-4">
          {overview.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {/* Accreditation badges */}
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            'AICTE Approved',
            'Anna University Affiliated',
            'NAAC A Accredited',
            'Autonomous College',
            'UGC Recognized',
          ].map((badge) => (
            <span
              key={badge}
              className="inline-block bg-[#0b6d41]/8 text-[#0b6d41] text-xs font-semibold px-3 py-1 rounded-full border border-[#0b6d41]/20"
            >
              {badge}
            </span>
          ))}
        </div>
      </Section>

      {/* ── 02: Programmes Offered ────────────────────────────────────────── */}
      <Section gray>
        <SectionHeading title="Programmes Offered 2026" />
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0b6d41] text-white text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Programme</th>
                <th className="text-center px-4 py-3">Years</th>
                <th className="text-right px-5 py-3">Intake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {/* UG header */}
              <tr className="bg-gray-50">
                <td
                  colSpan={3}
                  className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest"
                >
                  Undergraduate Programmes (UG)
                </td>
              </tr>
              {programs.filter((p) => p.level === 'UG').map((p) => (
                <tr key={p.programme} className="hover:bg-[#f6faf7] transition-colors">
                  <td className="px-5 py-3.5 text-gray-800 font-medium">{p.programme}</td>
                  <td className="px-4 py-3.5 text-center text-gray-600">{p.duration}</td>
                  <td className="px-5 py-3.5 text-right text-gray-600">{p.intake}</td>
                </tr>
              ))}
              {/* PG header */}
              <tr className="bg-gray-50">
                <td
                  colSpan={3}
                  className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest"
                >
                  Postgraduate Programmes (PG)
                </td>
              </tr>
              {programs.filter((p) => p.level === 'PG').map((p) => (
                <tr key={p.programme} className="hover:bg-[#f6faf7] transition-colors">
                  <td className="px-5 py-3.5 text-gray-800 font-medium">{p.programme}</td>
                  <td className="px-4 py-3.5 text-center text-gray-600">{p.duration}</td>
                  <td className="px-5 py-3.5 text-right text-gray-600">{p.intake}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          * Refer to the Fee Structure section below for branch-wise Government Quota (GQ) and Management Quota (MQ) tuition fees.
        </p>
      </Section>

      {/* ── 03: Eligibility Criteria ──────────────────────────────────────── */}
      <Section>
        <SectionHeading title="Eligibility Criteria" />
        <div className="space-y-8">
          {eligibility.map((item) => (
            <div key={item.programme} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-[#0b6d41]/6 px-5 py-3 border-b border-gray-200">
                <h3 className="font-semibold tracking-tight text-[#0b6d41] text-sm">{item.programme}</h3>
              </div>
              <ul className="px-5 py-4 space-y-2.5">
                {item.criteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#0b6d41]/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#0b6d41]" strokeWidth={3} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 04: Step-by-Step Admission Process ───────────────────────────── */}
      <Section gray>
        <SectionHeading title="Step-by-Step Admission Process" />
        <div className="space-y-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex gap-5">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0b6d41] text-white font-bold text-sm flex items-center justify-center shadow">
                  {step.number}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[#0b6d41]/20 my-1" />
                )}
              </div>
              {/* Content */}
              <div className={`pb-8 ${idx === steps.length - 1 ? '' : ''}`}>
                <h3 className="font-semibold tracking-tight text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important Process Guidelines */}
        <div className="mt-4 border border-amber-200 bg-amber-50 rounded-xl p-5">
          <h4 className="font-semibold tracking-tight text-amber-800 text-sm mb-3">⚠ Important Process Guidelines</h4>
          <ul className="space-y-2">
            {guidelines.map((guideline, i) => (
              <li key={i} className="text-xs text-amber-700 flex items-start gap-2 leading-relaxed">
                <span className="flex-shrink-0 mt-0.5">•</span>
                {guideline}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── 05: Required Documents Checklist ─────────────────────────────── */}
      <Section>
        <SectionHeading title="Required Documents Checklist" />
        <div className="space-y-8">
          {/* Common */}
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0b6d41] inline-block" />
              Documents Required for All Applicants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.common.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                >
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 border-[#0b6d41] bg-[#0b6d41]/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#0b6d41]" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                    {doc.note && <p className="text-xs text-gray-400 mt-0.5">{doc.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UG Only */}
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              Additional Documents — UG Applicants (B.E / B.Tech)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.ugOnly.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 bg-blue-50 rounded-lg px-4 py-3 border border-blue-200"
                >
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 border-blue-500 bg-blue-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-500" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                    {doc.note && <p className="text-xs text-gray-400 mt-0.5">{doc.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PG Only */}
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              Additional Documents — PG Applicants (M.E / MBA)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.pgOnly.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 bg-purple-50 rounded-lg px-4 py-3 border border-purple-200"
                >
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 border-purple-500 bg-purple-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-500" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                    {doc.note && <p className="text-xs text-gray-400 mt-0.5">{doc.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-400 border-t border-gray-100 pt-4">
          Note: All documents must be submitted as clear photocopies. Originals are required for verification at the time of in-person admission / counselling. Bring additional copies as needed by Anna University.
        </p>
      </Section>

      {/* ── 06: Fee Structure ─────────────────────────────────────────────── */}
      <Section gray>
        <SectionHeading title="Fee Structure 2026" />
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0b6d41] text-white text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Course</th>
                <th className="text-left px-4 py-3">Programme</th>
                <th className="text-right px-4 py-3">Government Quota (GQ)</th>
                <th className="text-right px-5 py-3">Management Quota (MQ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {(['UG', 'PG', 'Lateral Entry'] as const).flatMap((cat) => {
                const rows = feeStructure.filter((f) => f.category === cat)
                if (rows.length === 0) return []
                const label =
                  cat === 'UG'
                    ? 'Engineering UG'
                    : cat === 'PG'
                      ? 'Engineering PG'
                      : 'Engineering Lateral Entry'
                return rows.map((fee, idx) => (
                  <tr
                    key={`${cat}-${fee.program}`}
                    className="hover:bg-[#f6faf7] transition-colors"
                  >
                    {idx === 0 && (
                      <td
                        rowSpan={rows.length}
                        className="px-5 py-4 text-gray-900 font-bold bg-[#f6faf7] border-r border-gray-100 align-middle"
                      >
                        {label}
                      </td>
                    )}
                    <td className="px-4 py-4 text-gray-800 font-medium">
                      {fee.program}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600 text-xs italic">
                      As per Govt. norms
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-[#0b6d41]">
                      {formatINR(fee.mqFee)}
                    </td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-5 space-y-2 text-xs text-gray-400">
          <p>* GQ = Government Quota (TNEA counselling). MQ = Management Quota (direct admission). All fees shown are annual tuition in Indian Rupees (₹).</p>
          <p>* Hostel accommodation is optional and charged separately — all-inclusive (meals, utilities, Wi-Fi, laundry). Separate hostels for boys and girls with 24/7 security.</p>
          <p>* Tuition fee is subject to revision as per Tamil Nadu Government and AICTE norms. Scholarships can significantly reduce the tuition amount.</p>
          <p>* Fee can be paid via Demand Draft (DD), NEFT / RTGS, or online portal. No cash payment accepted for tuition.</p>
        </div>
      </Section>

      {/* ── 07: Important Dates ───────────────────────────────────────────── */}
      <Section>
        <SectionHeading title="Important Dates 2026" />
        <div className="space-y-0">
          {dates.map((item, idx) => (
            <div
              key={item.event}
              className={`flex items-center justify-between py-4 ${
                idx < dates.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#0b6d41]" />
                <span className="text-sm font-medium text-gray-800">{item.event}</span>
              </div>
              <span className="text-sm font-semibold text-[#0b6d41] whitespace-nowrap ml-4">
                {item.date}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-[#0b6d41]/6 border border-[#0b6d41]/20 rounded-xl px-5 py-4 text-xs text-[#0b6d41]">
          <span className="font-semibold">Note:</span> Dates for TNEA counselling are set by Anna University and may vary. Always check the official{' '}
          <Link
            href="https://www.annauniv.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Anna University website
          </Link>{' '}
          for the latest TNEA schedule. Management Quota direct admission is open from May 1 — contact our admissions office for current seat availability.
        </div>
      </Section>

      {/* ── 08: Scholarships & Financial Assistance ───────────────────────── */}
      <Section gray>
        <SectionHeading title="Scholarships & Financial Assistance" />
        <p className="text-sm text-gray-500 mb-8 -mt-4">
          Approximately <span className="font-semibold text-gray-700">75% of our students</span> receive some form of financial aid. Our admissions team actively helps every student apply for the scholarships they qualify for.
        </p>
        <div className="space-y-8">
          {scholarshipGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold tracking-tight text-gray-900 text-base mb-1">{group.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{group.description}</p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-4 py-2.5">Scholarship</th>
                      <th className="text-left px-4 py-2.5">Benefit</th>
                      <th className="text-left px-4 py-2.5">Who Qualifies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {group.schemes.map((scheme) => (
                      <tr key={scheme.name} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {scheme.name}
                          {scheme.ctaUrl && (
                            <>
                              {' '}
                              <Link
                                href={scheme.ctaUrl}
                                target={scheme.ctaUrl.startsWith('http') ? '_blank' : undefined}
                                rel={scheme.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="text-[#0b6d41] text-xs underline underline-offset-2"
                              >
                                Apply →
                              </Link>
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#0b6d41] font-semibold">{scheme.benefit}</td>
                        <td className="px-4 py-3 text-gray-500">{scheme.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 09: FAQ ───────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading title="Frequently Asked Questions" />
        <p className="text-sm text-gray-500 -mt-4 mb-8">
       
        </p>
        <EngineeringAdmissionsFAQ faqs={faqs} />
      </Section>

      {/* ── 10: Contact ───────────────────────────────────────────────────── */}
      <Section gray id="contact">
        <SectionHeading title="Contact for Campus Queries" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {CONTACT_INFO.map((item) => (
            <a
              key={item.type}
              href={item.href}
              target={item.type === 'whatsapp' ? '_blank' : undefined}
              rel={item.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
              className="flex flex-col items-center text-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-6 hover:border-[#0b6d41] hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[#0b6d41]/10 flex items-center justify-center group-hover:bg-[#0b6d41] transition-colors">
                {item.type === 'phone' && (
                  <Phone className="w-5 h-5 text-[#0b6d41] group-hover:text-white transition-colors" />
                )}
                {item.type === 'email' && (
                  <Mail className="w-5 h-5 text-[#0b6d41] group-hover:text-white transition-colors" />
                )}
                {item.type === 'whatsapp' && (
                  <WhatsAppIcon className="w-5 h-5 text-[#0b6d41] group-hover:text-white transition-colors" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className="font-semibold text-gray-900 text-sm">{item.displayValue}</p>
                <p className="text-xs text-gray-400 mt-1">{item.note}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Campus Address */}
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
          <h3 className="font-semibold tracking-tight text-gray-900 text-sm mb-2">🏫 Admissions Office</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            JKKN College of Engineering and Technology
            <br />
            Natarajapuram, NH-544 (Salem–Coimbatore Highway), Komarapalayam
            <br />
            Namakkal District, Tamil Nadu — 638 183
          </p>
          <p className="text-xs text-gray-400 mt-2">Monday to Saturday · 9:00 AM – 5:00 PM</p>
        </div>
      </Section>

      {/* Mobile Sticky CTA Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <a
          href="tel:+919345855001"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-semibold text-gray-700 hover:text-[#0b6d41] transition-colors border-r border-border"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
        <a
          href="https://wa.me/919345855001"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-semibold text-gray-700 hover:text-[#0b6d41] transition-colors border-r border-border"
        >
          <WhatsAppIcon className="w-4 h-4" />
          WhatsApp
        </a>
        <Link
          href={APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-bold text-white bg-[#0b6d41] hover:bg-[#095c36] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Apply Online
        </Link>
      </div>
    </>
  )
}
