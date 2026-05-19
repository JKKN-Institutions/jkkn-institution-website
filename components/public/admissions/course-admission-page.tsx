import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  Check,
  Clock,
  ExternalLink,
  Heart,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  Users,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'
import {
  ADMISSION_DATES,
  ADMISSION_STEPS,
  CONTACT_INFO,
  PROCESS_GUIDELINES,
  REQUIRED_DOCUMENTS,
} from '@/lib/institutions/engineering/admissions-data'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CourseFeeRow {
  item: string
  amount: string
  note: string
}

export interface CounsellingPath {
  type: string
  badge: string
  color: 'blue' | 'green' | 'purple'
  points: string[]
}

export interface CourseFAQ {
  question: string
  answer: string
}

export interface CourseAdmissionData {
  // Identity
  slug: string
  level: 'UG' | 'PG'
  shortName: string
  fullName: string
  duration: string
  seats: number
  affiliated: string
  CourseIcon: LucideIcon

  // Hero
  heroIntro: string
  applyUrl: string
  applyDeadline: string

  // Quick facts (icon picked by key)
  approvalsLabel: string
  approvalsValue: string

  // Eligibility (Step 1)
  eligibility: string[]

  // Counselling paths (Step 3)
  counsellingPaths: CounsellingPath[]

  // Documents (Step 4)
  documentsAdditionalLabel: string

  // Fee structure (Step 5)
  feeBreakdown: CourseFeeRow[]

  // FAQs (Help)
  faqs: CourseFAQ[]

  // Course details URL (link from eligibility section)
  courseDetailsUrl: string
  courseDetailsLabel: string
}

// ─── Shared content ───────────────────────────────────────────────────────────

const SHARED_SCHOLARSHIPS = [
  {
    icon: Trophy,
    title: 'JKKN Trust Merit Scholarship',
    benefit: '₹5,000 to 100% tuition waiver/year',
    eligibility: 'High academic performance (MQ & GQ both eligible)',
  },
  {
    icon: Building2,
    title: 'Government Scholarships',
    benefit: 'PMSS · Community · First Graduate · Maintenance',
    eligibility: 'SC / SCA / ST / BC-CC / BC / MBC / DNC / BCM categories',
  },
  {
    icon: Award,
    title: 'Naan Mudhalvan Scholarship',
    benefit: '₹1,000/month (₹12,000/year)',
    eligibility: 'Boys & Girls from Govt/Govt-aided schools, Tamil medium (6th–12th)',
  },
  {
    icon: Heart,
    title: 'Need-Based Financial Aid',
    benefit: 'Up to 50% tuition fee reduction',
    eligibility: 'Family annual income below ₹2.5 lakhs',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function SectionHeading({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      {kicker && (
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#0b6d41]/70 mb-2">
          {kicker}
        </span>
      )}
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

function pathBorderClass(color: CounsellingPath['color']) {
  switch (color) {
    case 'blue':
      return 'border-blue-200'
    case 'purple':
      return 'border-purple-200'
    default:
      return 'border-[#0b6d41]/30'
  }
}

function pathHeaderClass(color: CounsellingPath['color']) {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 border-blue-200'
    case 'purple':
      return 'bg-purple-50 border-purple-200'
    default:
      return 'bg-[#0b6d41]/8 border-[#0b6d41]/20'
  }
}

function pathTitleClass(color: CounsellingPath['color']) {
  switch (color) {
    case 'blue':
      return 'text-blue-700'
    case 'purple':
      return 'text-purple-700'
    default:
      return 'text-[#0b6d41]'
  }
}

function pathBadgeClass(color: CounsellingPath['color']) {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-700'
    case 'purple':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-[#0b6d41]/15 text-[#0b6d41]'
  }
}

function pathNumberClass(color: CounsellingPath['color']) {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-700'
    case 'purple':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-[#0b6d41]/15 text-[#0b6d41]'
  }
}

// ─── JSON-LD generators (exported so pages can use them in <script>) ─────────

export function buildFAQSchema(faqs: CourseFAQ[]) {
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

export function buildBreadcrumbSchema(slug: string, shortName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://engg.jkkn.ac.in/' },
      { '@type': 'ListItem', position: 2, name: 'Admissions', item: 'https://engg.jkkn.ac.in/admissions/engineering' },
      { '@type': 'ListItem', position: 3, name: `${shortName} Admission`, item: `https://engg.jkkn.ac.in/admissions/${slug}` },
    ],
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CourseAdmissionPage(props: CourseAdmissionData) {
  const {
    slug,
    level,
    shortName,
    fullName,
    duration,
    seats,
    affiliated,
    CourseIcon,
    heroIntro,
    applyUrl,
    applyDeadline,
    approvalsLabel,
    approvalsValue,
    eligibility,
    counsellingPaths,
    documentsAdditionalLabel,
    feeBreakdown,
    faqs,
    courseDetailsUrl,
    courseDetailsLabel,
  } = props

  // First fee row's amount becomes the headline (typically MQ fee)
  const headlineFee = feeBreakdown[0]?.amount ?? '—'

  const quickFacts: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Users, label: 'Sanctioned Seats', value: String(seats) },
    { icon: IndianRupee, label: 'Annual Tuition', value: headlineFee },
    { icon: CalendarDays, label: 'Last Date to Apply', value: applyDeadline },
    { icon: ShieldCheck, label: approvalsLabel, value: approvalsValue },
  ]

  const additionalDocs = level === 'UG' ? REQUIRED_DOCUMENTS.ugOnly : REQUIRED_DOCUMENTS.pgOnly

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(slug, shortName)) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0b6d41] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block bg-[#ffde59] text-[#0b6d41] text-xs font-semibold uppercase tracking-wide px-4 py-1.5 rounded-full mb-5">
            Admissions Open · 2026-27
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            {shortName} Admission 2026-27
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-2xl mx-auto mb-6">
            {heroIntro} {affiliated}.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Link
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ffde59] text-[#0b6d41] font-bold text-sm px-7 py-3 rounded-full shadow hover:bg-[#f5c518] transition-colors"
            >
              Apply Online for {shortName}
              <ExternalLink className="w-4 h-4" />
            </Link>
            <a
              href="#eligibility"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-7 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-colors"
            >
              Check Eligibility
            </a>
          </div>
          <p className="text-white/60 text-xs">
            Application portal closes <span className="font-semibold text-white">{applyDeadline}</span> · Zero application fee
          </p>
        </div>
      </section>

      {/* ── Quick Facts strip ─────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="bg-white px-4 py-5 text-center">
              <fact.icon className="w-5 h-5 text-[#0b6d41] mx-auto mb-2" />
              <div className="text-xl md:text-2xl font-bold text-gray-900">{fact.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-gray-400 mt-0.5">{fact.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Eligibility ───────────────────────────────────────────────────── */}
      <Section id="eligibility">
        <SectionHeading kicker="Step 1" title={`Eligibility for ${shortName}`} />
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-[#0b6d41]/6 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
            <CourseIcon className="w-4 h-4 text-[#0b6d41]" />
            <h3 className="font-semibold tracking-tight text-[#0b6d41] text-sm">
              {fullName} ({duration} · {seats} Seats)
            </h3>
          </div>
          <ul className="px-5 py-4 space-y-2.5">
            {eligibility.map((criterion, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#0b6d41]/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0b6d41]" strokeWidth={3} />
                </span>
                {criterion}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 text-center">
          <Link
            href={courseDetailsUrl}
            className="inline-flex items-center gap-2 text-sm text-[#0b6d41] font-semibold hover:underline"
          >
            {courseDetailsLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* ── Admission Process Steps ──────────────────────────────────────── */}
      <Section gray>
        <SectionHeading kicker="Step 2" title="Step-by-Step Admission Process" />
        <div className="space-y-0">
          {ADMISSION_STEPS.map((step, idx) => (
            <div key={step.number} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0b6d41] text-white font-bold text-sm flex items-center justify-center shadow">
                  {step.number}
                </div>
                {idx < ADMISSION_STEPS.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[#0b6d41]/20 my-1" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-semibold tracking-tight text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 border border-amber-200 bg-amber-50 rounded-xl p-5">
          <h4 className="font-semibold tracking-tight text-amber-800 text-sm mb-3">⚠ Important Process Guidelines</h4>
          <ul className="space-y-2">
            {PROCESS_GUIDELINES.map((guideline, i) => (
              <li key={i} className="text-xs text-amber-700 flex items-start gap-2 leading-relaxed">
                <span className="flex-shrink-0 mt-0.5">•</span>
                {guideline}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Counselling Paths ────────────────────────────────────────────── */}
      <Section>
        <SectionHeading kicker="Step 3" title={`Paths to ${shortName} Admission`} />
        <div className={`grid ${counsellingPaths.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-5`}>
          {counsellingPaths.map((path) => (
            <div key={path.type} className={`border-2 rounded-xl overflow-hidden ${pathBorderClass(path.color)}`}>
              <div className={`px-5 py-3.5 border-b ${pathHeaderClass(path.color)}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className={`font-semibold tracking-tight text-sm ${pathTitleClass(path.color)}`}>
                    {path.type}
                  </h3>
                  <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${pathBadgeClass(path.color)}`}>
                    {path.badge}
                  </span>
                </div>
              </div>
              <ol className="px-5 py-4 space-y-2.5">
                {path.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${pathNumberClass(path.color)}`}>
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Required Documents ────────────────────────────────────────────── */}
      <Section gray>
        <SectionHeading kicker="Step 4" title="Required Documents Checklist" />
        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0b6d41] inline-block" />
              For All {shortName} Applicants
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REQUIRED_DOCUMENTS.common.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 border border-gray-200"
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

          <div>
            <h3 className="text-sm font-semibold tracking-tight text-gray-700 mb-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full inline-block ${level === 'UG' ? 'bg-blue-500' : 'bg-purple-500'}`} />
              Additional — {documentsAdditionalLabel}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {additionalDocs.map((doc) => (
                <div
                  key={doc.name}
                  className={`flex items-start gap-3 rounded-lg px-4 py-3 border ${
                    level === 'UG' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    level === 'UG' ? 'border-blue-500 bg-blue-100' : 'border-purple-500 bg-purple-100'
                  }`}>
                    <Check className={`w-3 h-3 ${level === 'UG' ? 'text-blue-500' : 'text-purple-500'}`} strokeWidth={3} />
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
        <p className="mt-6 text-xs text-gray-400 border-t border-gray-200 pt-4">
          All documents must be submitted as clear photocopies. Originals required for in-person verification.
        </p>
      </Section>

      {/* ── Fee Structure ─────────────────────────────────────────────────── */}
      <Section>
        <SectionHeading kicker="Step 5" title={`${shortName} Fee Structure`} />
        <div className="overflow-hidden border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0b6d41] text-white text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Fee Component</th>
                <th className="text-right px-5 py-3">Amount</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {feeBreakdown.map((row) => (
                <tr key={row.item} className="hover:bg-[#f6faf7]">
                  <td className="px-5 py-3.5 text-gray-800 font-medium">{row.item}</td>
                  <td className="px-5 py-3.5 text-right text-[#0b6d41] font-bold whitespace-nowrap">
                    {row.amount}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          As per Tamil Nadu Government & AICTE fee regulations. <span className="font-semibold text-gray-700">No donation or capitation fee.</span> Refer to <Link href="/admissions/fee-structure" className="text-[#0b6d41] underline">complete engineering fee structure</Link> for other branches.
        </p>
      </Section>

      {/* ── Scholarships ──────────────────────────────────────────────────── */}
      <Section gray>
        <SectionHeading kicker="Step 6" title={`Scholarships for ${shortName}`} />
        <div className="grid sm:grid-cols-2 gap-4">
          {SHARED_SCHOLARSHIPS.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#0b6d41] hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-5 h-5 text-[#0b6d41]" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm pt-2">{s.title}</h3>
              </div>
              <div className="text-sm text-[#0b6d41] font-bold mb-1">{s.benefit}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{s.eligibility}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs text-gray-500 text-center">
          ~75% of JKKN engineering students receive some form of financial aid.
        </p>
      </Section>

      {/* ── Important Dates ───────────────────────────────────────────────── */}
      <Section>
        <SectionHeading kicker="Calendar" title={`Important Dates · ${shortName} 2026-27`} />
        <div className="space-y-0">
          {ADMISSION_DATES.map((item, idx) => (
            <div
              key={item.event}
              className={`flex items-center justify-between py-4 ${
                idx < ADMISSION_DATES.length - 1 ? 'border-b border-gray-100' : ''
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
          <span className="font-semibold">Note:</span>{' '}
          {level === 'UG'
            ? <>TNEA counselling dates are set by Anna University and may vary. Always check <Link href="https://www.tneaonline.org" target="_blank" rel="noopener noreferrer" className="underline">www.tneaonline.org</Link> for the latest schedule.</>
            : <>TANCET / entrance exam dates are set by Anna University and may vary. Always check <Link href="https://www.annauniv.edu" target="_blank" rel="noopener noreferrer" className="underline">www.annauniv.edu</Link> for the latest schedule.</>
          }
        </div>
      </Section>

      {/* ── FAQs ──────────────────────────────────────────────────────────── */}
      <Section gray>
        <SectionHeading kicker="Help" title={`${shortName} Admission FAQs`} />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-gray-200 rounded-xl bg-white overflow-hidden"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">{faq.question}</h3>
                <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#0b6d41]/10 text-[#0b6d41] flex items-center justify-center text-xs font-bold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 -mt-1 text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ── Contact Admissions ────────────────────────────────────────────── */}
      <Section id="contact">
        <SectionHeading kicker="Contact" title={`Need Help with ${shortName} Admission?`} />
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
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#0b6d41] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold tracking-tight text-gray-900 text-sm mb-2">
                {shortName} Admissions Cell
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                JKKN College of Engineering & Technology<br />
                Natarajapuram, NH-544 (Salem–Coimbatore Highway), Komarapalayam<br />
                Namakkal District, Tamil Nadu — 638 183
              </p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Monday to Saturday · 9:00 AM – 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0b6d41] py-14">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to apply for {shortName} 2026-27?
          </h2>
          <p className="text-white/80 text-sm md:text-base mb-7">
            Limited seats · Application closes {applyDeadline} · Zero application fee
          </p>
          <Link
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#ffde59] text-[#0b6d41] font-bold text-sm px-8 py-3.5 rounded-full shadow hover:bg-[#f5c518] transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            Apply Online Now
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Mobile Sticky CTA ─────────────────────────────────────────────── */}
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
          href={applyUrl}
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
