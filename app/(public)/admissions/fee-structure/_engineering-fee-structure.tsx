import React from 'react'
import Link from 'next/link'
import { ExternalLink, Info, GraduationCap, BookOpen, Layers } from 'lucide-react'
import { FEE_STRUCTURE, CONTACT_INFO, type FeeEntry } from '@/lib/institutions/engineering/admissions-data'

const phoneContact = CONTACT_INFO.find((c) => c.type === 'phone')
const emailContact = CONTACT_INFO.find((c) => c.type === 'email')

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

function BreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Admissions', item: '/admissions' },
      { '@type': 'ListItem', position: 3, name: 'Fee Structure', item: '/admissions/fee-structure' },
    ],
  }
}

function OfferCatalogSchema(fees: FeeEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'JKKN College of Engineering and Technology',
    url: 'https://engg.jkkn.ac.in',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Engineering Programme Fees 2026-27',
      itemListElement: fees.map((f) => ({
        '@type': 'Offer',
        name: `${f.category} — ${f.program}`,
        price: f.mqFee,
        priceCurrency: 'INR',
        category: f.category,
      })),
    },
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const APPLY_URL = 'https://www.jkkn.ai/apply/jkkn-admission-2026'

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

// Expanded programme labels for display
const PROGRAM_LABELS: Record<string, string> = {
  CSE: 'B.E Computer Science & Engineering',
  'B.Tech IT': 'B.Tech Information Technology',
  ECE: 'B.E Electronics & Communication Engineering',
  EEE: 'B.E Electrical & Electronics Engineering',
  MECH: 'B.E Mechanical Engineering',
  MBA: 'M.B.A Master of Business Administration',
  'ME CSE': 'M.E Computer Science & Engineering',
}

function programLabel(p: string) {
  return PROGRAM_LABELS[p] ?? p
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
    <section id={id} className={`py-12 md:py-16 ${gray ? 'bg-[#f6faf7]' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">{children}</div>
    </section>
  )
}

function CategoryHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof GraduationCap
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0b6d41] to-[#0a5634] text-white flex items-center justify-center shadow-md shadow-[#0b6d41]/20">
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0b6d41] leading-tight">
            {title}
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="h-1 w-20 bg-gradient-to-r from-[#0b6d41] to-[#ffde59] rounded-full ml-[72px]" />
    </div>
  )
}

function FeeTable({ rows }: { rows: FeeEntry[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg shadow-gray-900/5 bg-white">
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#0b6d41] via-[#0a5634] to-[#0b6d41] text-white">
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.08em]">
                Programme
              </th>
              <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] whitespace-nowrap">
                Government Quota
                <span className="block text-[10px] font-normal text-white/70 normal-case tracking-normal mt-0.5">via TNEA counselling</span>
              </th>
              <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] whitespace-nowrap bg-[#ffde59]/15">
                Management Quota
                <span className="block text-[10px] font-normal text-white/70 normal-case tracking-normal mt-0.5">direct admission</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((fee, idx) => (
              <tr
                key={`${fee.category}-${fee.program}`}
                className={`group transition-colors ${idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'} hover:bg-[#f6faf7]`}
              >
                <td className="px-6 py-4 text-gray-900">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[15px] group-hover:text-[#0b6d41] transition-colors">
                      {programLabel(fee.program)}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 font-medium tracking-wide">
                      {fee.program}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  {fee.gqFee === fee.mqFee ? (
                    <span className="font-semibold text-gray-800 text-[15px]">
                      {formatINR(fee.gqFee)}
                    </span>
                  ) : (
                    <span className="inline-block text-gray-600 text-xs italic bg-gray-100 px-2.5 py-1 rounded-md">
                      As per Govt. norms
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap bg-[#ffde59]/5 group-hover:bg-[#ffde59]/15 transition-colors">
                  <span className="font-bold text-[#0b6d41] text-base tabular-nums">
                    {formatINR(fee.mqFee)}
                  </span>
                  <span className="block text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                    per year
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden divide-y divide-gray-100">
        <div className="px-5 py-3 bg-gradient-to-r from-[#0b6d41] to-[#0a5634] text-white text-xs font-bold uppercase tracking-wider">
          Programme Fees
        </div>
        {rows.map((fee) => (
          <div key={`m-${fee.category}-${fee.program}`} className="px-5 py-4">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 leading-tight">
                  {programLabel(fee.program)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{fee.program}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-gray-200 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                  Govt. Quota
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-800 tabular-nums">
                  {fee.gqFee === fee.mqFee ? formatINR(fee.gqFee) : 'As per Govt.'}
                </div>
              </div>
              <div className="rounded-lg border border-[#0b6d41]/25 bg-[#ffde59]/10 px-3 py-2.5">
                <div className="text-[10px] uppercase tracking-wider text-[#0b6d41] font-bold">
                  Mgmt. Quota
                </div>
                <div className="mt-1 text-base font-bold text-[#0b6d41] tabular-nums">
                  {formatINR(fee.mqFee)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EngineeringFeeStructurePage() {
  const ug = FEE_STRUCTURE.filter((f) => f.category === 'UG')
  const pg = FEE_STRUCTURE.filter((f) => f.category === 'PG')
  const lateral = FEE_STRUCTURE.filter((f) => f.category === 'Lateral Entry')

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(OfferCatalogSchema(FEE_STRUCTURE)) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0b6d41] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block bg-[#ffde59] text-[#0b6d41] text-xs font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-5">
            Fee Structure 2026-27
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Engineering Fee Structure
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Branch-wise annual tuition fees for all UG, PG, and Lateral Entry programmes — Government Quota (GQ) and Management Quota (MQ) — at JKKN College of Engineering and Technology.
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
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-7 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-colors"
            >
              Admission Process
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quota Explainer ───────────────────────────────────────────────── */}
      <Section>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[#0b6d41]/15 bg-[#f6faf7] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b6d41]/10 text-[#0b6d41] text-xs font-bold">GQ</span>
              <h3 className="text-base font-semibold text-gray-900">Government Quota</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Allotted through TNEA counselling by Anna University, Chennai. Tuition fees are regulated by the Tamil Nadu Government and may be revised each academic year. Eligible learners pay as per government norms.
            </p>
          </div>
          <div className="rounded-xl border border-[#0b6d41]/15 bg-[#f6faf7] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b6d41]/10 text-[#0b6d41] text-xs font-bold">MQ</span>
              <h3 className="text-base font-semibold text-gray-900">Management Quota</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Direct admission through the college admissions office, subject to AICTE and Tamil Nadu Government norms. Fee shown is the annual tuition payable at the time of admission.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Engineering UG ────────────────────────────────────────────────── */}
      <Section gray id="ug">
        <CategoryHeading
          icon={GraduationCap}
          title="Engineering UG — B.E / B.Tech"
          subtitle="4-year full-time undergraduate engineering programmes"
        />
        <FeeTable rows={ug} />
      </Section>

      {/* ── Engineering PG ────────────────────────────────────────────────── */}
      <Section id="pg">
        <CategoryHeading
          icon={BookOpen}
          title="Engineering PG — M.E / M.B.A"
          subtitle="2-year full-time postgraduate programmes"
        />
        <FeeTable rows={pg} />
      </Section>

      {/* ── Lateral Entry ─────────────────────────────────────────────────── */}
      <Section gray id="lateral-entry">
        <CategoryHeading
          icon={Layers}
          title="Engineering Lateral Entry"
          subtitle="Direct entry to 2nd year for Diploma holders — 3-year programme"
        />
        <FeeTable rows={lateral} />
      </Section>

      {/* ── Notes ─────────────────────────────────────────────────────────── */}
      <Section>
        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-[#0b6d41] flex-shrink-0 mt-0.5" />
            <h2 className="text-lg font-semibold text-gray-900">Important Notes</h2>
          </div>
          <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0b6d41] mt-2" />
              <span>All figures shown are <strong>annual tuition fees</strong> in Indian Rupees (₹) for the 2026-27 academic year. Fees are payable at the start of each academic year.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0b6d41] mt-2" />
              <span><strong>Hostel accommodation is optional</strong> and charged separately — all-inclusive (meals, utilities, Wi-Fi, laundry). Separate hostels for boys and girls with 24/7 security.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0b6d41] mt-2" />
              <span>Tuition fee is <strong>subject to revision</strong> as per Tamil Nadu Government and AICTE norms. Scholarships (merit, government, and need-based) can significantly reduce the amount payable.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0b6d41] mt-2" />
              <span>Fees can be paid via <strong>Demand Draft (DD), NEFT / RTGS, or the online portal</strong>. No cash payment is accepted for tuition.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0b6d41] mt-2" />
              <span>Learning Assessment fees, caution deposits, and other university-mandated fees are charged additionally as notified by Anna University.</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* ── CTA / Contact ─────────────────────────────────────────────────── */}
      <Section gray id="contact">
        <div className="rounded-2xl bg-[#0b6d41] text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Have questions about fees or scholarships?</h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Our admissions team will walk you through the fee structure, scholarships available for your category, and payment options. Reach out — we&apos;re happy to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {phoneContact && (
              <a
                href={phoneContact.href}
                className="inline-flex items-center gap-2 bg-[#ffde59] text-[#0b6d41] font-bold text-sm px-7 py-3 rounded-full shadow hover:bg-[#f5c518] transition-colors"
              >
                Call {phoneContact.displayValue}
              </a>
            )}
            {emailContact && (
              <a
                href={emailContact.href}
                className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-7 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-colors"
              >
                Email Admissions Office
              </a>
            )}
            <Link
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#0b6d41] font-bold text-sm px-7 py-3 rounded-full shadow hover:bg-gray-50 transition-colors"
            >
              Apply Online
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
