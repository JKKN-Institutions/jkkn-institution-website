import React from 'react'
import Link from 'next/link'
import { ExternalLink, Award, BadgeCheck, Sparkles } from 'lucide-react'
import {
  SCHOLARSHIP_TABLE,
  CONTACT_INFO,
  type ScholarshipTableRow,
} from '@/lib/institutions/engineering/admissions-data'

const phoneContact = CONTACT_INFO.find((c) => c.type === 'phone')

const APPLY_URL = 'https://www.jkkn.ai/apply/jkkn-admission-2026'

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

function BreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Admissions', item: '/admissions' },
      { '@type': 'ListItem', position: 3, name: 'Scholarships', item: '/scholarships' },
    ],
  }
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
      <div className="max-w-6xl mx-auto px-4 md:px-8">{children}</div>
    </section>
  )
}

function CategoryHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Award
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

// ─── Scholarship Table (desktop) ─────────────────────────────────────────────

function ScholarshipTable({ rows }: { rows: ScholarshipTableRow[] }) {
  // Renders a "—" for null cells to keep the table balanced and readable.
  const cell = (v: string | null) =>
    v ? (
      <span className="font-semibold text-gray-800 tabular-nums">{v}</span>
    ) : (
      <span className="text-gray-300">—</span>
    )

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg shadow-gray-900/5 bg-white">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            {/* Top header row — category groups */}
            <tr style={{ backgroundColor: '#0b6d41' }}>
              <th
                rowSpan={2}
                style={{ color: '#ffde59' }}
                className="text-center px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] border-r border-white/20 align-middle"
              >
                S No
              </th>
              <th
                rowSpan={2}
                style={{ color: '#ffde59' }}
                className="text-center px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] border-r border-white/20 align-middle"
              >
                College
              </th>
              <th
                rowSpan={2}
                style={{ color: '#ffde59' }}
                className="text-center px-4 py-3 text-xs font-extrabold uppercase tracking-[0.08em] border-r border-white/20 align-middle"
              >
                Course
              </th>
              <th
                colSpan={2}
                style={{ color: '#ffde59' }}
                className="text-center px-3 py-3 text-[12px] font-extrabold uppercase tracking-[0.08em] border-r border-b border-white/20 leading-tight"
              >
                SC / SCA / ST / BC-CC
                <span className="block text-[10px] font-medium normal-case tracking-normal mt-0.5" style={{ color: '#fff8d0' }}>
                  PMSS (Community Scholarship)
                </span>
              </th>
              <th
                colSpan={3}
                style={{ color: '#ffde59' }}
                className="text-center px-3 py-3 text-[12px] font-extrabold uppercase tracking-[0.08em] border-r border-b border-white/20 leading-tight"
              >
                BC / MBC / DNC / BCM
              </th>
              <th
                colSpan={2}
                style={{ color: '#ffde59' }}
                className="text-center px-3 py-3 text-[12px] font-extrabold uppercase tracking-[0.08em] border-b border-white/20 leading-tight"
              >
                All Community
              </th>
            </tr>
            {/* Second header row — sub-columns */}
            <tr style={{ backgroundColor: '#0a5634' }}>
              <th style={{ color: '#ffffff' }} className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border-r border-white/20">
                GQ
              </th>
              <th style={{ color: '#ffffff' }} className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border-r border-white/20 leading-tight">
                MQ
                <span className="block text-[9px] font-medium normal-case tracking-normal mt-0.5" style={{ color: '#d1ead9' }}>
                  Maintenance
                </span>
              </th>
              <th style={{ color: '#ffffff' }} className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border-r border-white/20 leading-tight">
                First Graduate
              </th>
              <th style={{ color: '#ffffff' }} className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border-r border-white/20 leading-tight">
                Community
                <span className="block text-[9px] font-medium normal-case tracking-normal mt-0.5" style={{ color: '#d1ead9' }}>
                  Scholarship
                </span>
              </th>
              <th style={{ color: '#ffffff' }} className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border-r border-white/20 leading-tight">
                Trust Scholarship
                <span className="block text-[9px] font-medium normal-case tracking-normal mt-0.5" style={{ color: '#d1ead9' }}>
                  (Merit Based) MQ / GQ
                </span>
              </th>
              <th style={{ color: '#ffffff' }} className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider border-r border-white/20 leading-tight">
                GHSS
                <span className="block text-[9px] font-medium normal-case tracking-normal mt-0.5" style={{ color: '#d1ead9' }}>
                  Govt-Aided (6–12) Tamil
                </span>
              </th>
              <th style={{ color: '#ffffff' }} className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider leading-tight">
                Naan Mudhalvan
                <span className="block text-[9px] font-medium normal-case tracking-normal mt-0.5" style={{ color: '#d1ead9' }}>
                  Boys / Girls
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, idx) => (
              <tr
                key={row.sNo}
                className={`group transition-colors ${
                  idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                } hover:bg-[#f6faf7]`}
              >
                <td className="px-4 py-4 text-center text-gray-600 font-medium border-r border-gray-100">
                  {row.sNo}
                </td>
                <td className="px-4 py-4 text-center text-gray-700 font-semibold border-r border-gray-100">
                  Engineering
                </td>
                <td className="px-4 py-4 border-r border-gray-100">
                  <div className="flex flex-col">
                    <span className="font-bold text-[15px] text-[#0b6d41] group-hover:text-[#0a5634] transition-colors">
                      {row.course}
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                      {row.courseFull}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 text-center border-r border-gray-100 whitespace-nowrap">
                  {cell(row.pmssGQ)}
                </td>
                <td className="px-3 py-4 text-center border-r border-gray-100 whitespace-nowrap bg-[#ffde59]/5">
                  {cell(row.maintenanceMQ)}
                </td>
                <td className="px-3 py-4 text-center border-r border-gray-100 whitespace-nowrap">
                  {cell(row.bcFirstGraduate)}
                </td>
                <td className="px-3 py-4 text-center border-r border-gray-100 whitespace-nowrap">
                  {cell(row.bcCommunity)}
                </td>
                <td className="px-3 py-4 text-center border-r border-gray-100 whitespace-nowrap bg-[#ffde59]/5">
                  {cell(row.trustMerit)}
                </td>
                <td className="px-3 py-4 text-center border-r border-gray-100 whitespace-nowrap">
                  {cell(row.ghssGovtAided)}
                </td>
                <td className="px-3 py-4 text-center whitespace-nowrap">
                  {cell(row.naanMudhalvan)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet card layout */}
      <div className="lg:hidden divide-y divide-gray-100">
        <div className="px-5 py-3 bg-gradient-to-r from-[#0b6d41] to-[#0a5634] text-white text-xs font-bold uppercase tracking-wider">
          Scholarship Details — Engineering
        </div>
        {rows.map((row) => (
          <div key={`m-${row.sNo}`} className="px-5 py-5">
            <div className="mb-4">
              <p className="font-bold text-[#0b6d41] text-lg leading-tight">
                {row.course}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{row.courseFull}</p>
            </div>

            <div className="space-y-3">
              <CardCategory
                title="SC / SCA / ST / BC-CC"
                subtitle="PMSS — Community Scholarship"
              >
                <CardRow label="GQ" value={row.pmssGQ} />
                <CardRow label="MQ · Maintenance" value={row.maintenanceMQ} />
              </CardCategory>

              <CardCategory title="BC / MBC / DNC / BCM" subtitle="Government Quota benefits">
                <CardRow label="First Graduate" value={row.bcFirstGraduate} />
                <CardRow label="Community Scholarship" value={row.bcCommunity} />
                <CardRow label="Trust Scholarship (Merit)" value={row.trustMerit} />
              </CardCategory>

              <CardCategory title="All Community" subtitle="Special category">
                <CardRow label="GHSS · Govt-Aided (6–12) Tamil" value={row.ghssGovtAided} />
                <CardRow label="Naan Mudhalvan · Boys / Girls" value={row.naanMudhalvan} />
              </CardCategory>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CardCategory({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-[#0b6d41]/5 px-3 py-2 border-b border-gray-200">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0b6d41] leading-tight">
          {title}
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  )
}

function CardRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5">
      <span className="text-xs text-gray-600 leading-tight">{label}</span>
      {value ? (
        <span className="text-sm font-semibold text-gray-800 tabular-nums whitespace-nowrap">
          {value}
        </span>
      ) : (
        <span className="text-gray-300 text-sm">—</span>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EngineeringScholarshipPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema()) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0b6d41] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block bg-[#ffde59] text-[#0b6d41] text-xs font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-5">
            Scholarships 2026-27
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Scholarship Details
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Government, Trust, and Naan Mudhalvan scholarship benefits available
            for B.E / B.Tech, M.B.A, and M.E students at JKKN College of
            Engineering and Technology.
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
              href="/admissions/fee-structure"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-7 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-colors"
            >
              View Fee Structure
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quota / Category Explainer ───────────────────────────────────── */}
      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-[#0b6d41]/15 bg-[#f6faf7] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b6d41]/10 text-[#0b6d41]">
                <BadgeCheck className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-gray-900">
                Government Schemes
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              PMSS, First Graduate, Community Scholarship, and Maintenance grants —
              funded by Tamil Nadu and Central Government for SC / SCA / ST / BC-CC
              and BC / MBC / DNC / BCM category students.
            </p>
          </div>
          <div className="rounded-xl border border-[#0b6d41]/15 bg-[#f6faf7] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b6d41]/10 text-[#0b6d41]">
                <Award className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-gray-900">
                Trust Merit Scholarship
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Awarded by JKKN Trust to academically outstanding students. Open to
              both Management Quota (MQ) and Government Quota (GQ) admissions —
              from ₹5,000 to a full 100% tuition fee waiver.
            </p>
          </div>
          <div className="rounded-xl border border-[#0b6d41]/15 bg-[#f6faf7] p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0b6d41]/10 text-[#0b6d41]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-gray-900">
                Naan Mudhalvan
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Tamil Nadu Government initiative — ₹1,000 / month for Boys and Girls
              from Government / Government-aided schools who studied Class 6–12 in
              Tamil medium.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Scholarship Table ────────────────────────────────────────────── */}
      <Section gray id="scholarship-table">
        <CategoryHeading
          icon={Award}
          title="Scholarship Comparison"
          subtitle="Course-wise scholarship benefits across all eligible categories"
        />
        <ScholarshipTable rows={SCHOLARSHIP_TABLE} />

        <p className="mt-5 text-xs md:text-sm text-gray-500 leading-relaxed">
          * All scholarship amounts are approximate and subject to change as per
          government norms. <strong className="text-gray-700">GQ</strong> = Government Quota,{' '}
          <strong className="text-gray-700">MQ</strong> = Management Quota. A dash (—)
          indicates the scheme does not apply to that course.
        </p>
      </Section>

      {/* ── CTA / Contact ─────────────────────────────────────────────────── */}
      <Section gray id="contact">
        <div className="rounded-2xl bg-[#0b6d41] text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Need help applying for a scholarship?
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Our admissions counsellors will check your eligibility across every
            applicable scheme and guide you through the entire application — start
            to finish. Talk to us before the academic-year cutoff.
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
          </div>
        </div>
      </Section>
    </>
  )
}
