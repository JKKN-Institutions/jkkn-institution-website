import type { Metadata } from 'next'
import AdmissionHero from '@/components/cms-blocks/admissions/admission-hero'
import EligibilityCriteriaTable from '@/components/cms-blocks/admissions/eligibility-criteria-table'
import AdmissionDatesTable from '@/components/cms-blocks/admissions/admission-dates-table'
import { TrustBar } from '@/components/public/admissions/trust-bar'
import { EngineeringCoursesSection } from '@/components/public/admissions/engineering-courses-section'
import { FeeScholarshipsSection } from '@/components/public/admissions/fee-scholarships-section'
import { EngineeringAdmissionsFAQ } from '@/components/public/admissions/engineering-admissions-faq'
import { AdmissionsFinalCta } from '@/components/public/admissions/admissions-final-cta'
import {
  TRUST_STATS,
  ELIGIBILITY_CRITERIA,
  ADMISSION_DATES,
  PROGRAMS,
  FEE_STRUCTURE,
  SCHOLARSHIPS,
  FAQS,
} from '@/lib/institutions/engineering/admissions-data'

// ─── Static Generation ───────────────────────────────────────────────────────
// Rebuild daily — static config rarely changes; Phase 2 will add DB-driven dates
export const revalidate = 86400

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Engineering Admissions 2026–27 | JKKN College of Engineering and Technology',
  description:
    'Apply to JKKN College of Engineering — AICTE approved, Anna University affiliated, NAAC A accredited. B.E/B.Tech in CSE, ECE, EEE, Mechanical, IT. M.E & MBA postgraduate programs. 92%+ placement rate.',
  keywords: [
    'JKKN engineering admissions',
    'engineering college admissions 2026',
    'AICTE approved engineering college',
    'Anna University affiliated college',
    'B.E admissions Tamil Nadu',
    'TNEA counselling 2026',
    'engineering college Namakkal',
  ],
  openGraph: {
    title: 'JKKN Engineering Admissions 2026–27',
    description:
      'NAAC A accredited · 5 UG + 2 PG programs · 92%+ placement · Apply now.',
    type: 'website',
    images: [
      {
        url: '/og/engineering-admissions.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN College of Engineering and Technology — Admissions 2026–27',
      },
    ],
  },
  alternates: {
    canonical: '/admissions/engineering',
  },
}

// ─── Schema.org JSON-LD ───────────────────────────────────────────────────────

function FAQPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

function BreadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Admissions', item: '/admissions' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Engineering Admissions',
        item: '/admissions/engineering',
      },
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

const APPLY_URL =
  'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8'
const ADMISSIONS_PHONE = '+91 93458 55001'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EngineeringAdmissionsPage() {
  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQPageSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(EducationalOrgSchema()) }}
      />

      {/* ── Section 1: Hero ─────────────────────────────── */}
      <AdmissionHero
        badge={{ text: 'Admissions Open', emoji: '🎓' }}
        title="Engineering Admissions"
        titleAccentWord="Admissions"
        subtitle="AICTE Approved · Autonomous · Affiliated to Anna University · NAAC A Accredited"
        backgroundColor="gradient-dark"
        showAnimations={true}
        trustBadges={[
          { label: 'NAAC A Accredited' },
          { label: 'AICTE Approved' },
          { label: 'UGC Recognized' },
          { label: '74+ Years of Excellence' },
        ]}
        ctaButtons={[
          {
            label: 'Apply Online',
            link: APPLY_URL,
            variant: 'primary',
            isExternal: true,
            icon: 'external',
          },
          {
            label: 'View Programs',
            link: '#programs',
            variant: 'secondary',
            icon: 'arrow',
          },
        ]}
      />

      {/* ── Section 2: Trust Bar ────────────────────────── */}
      <TrustBar stats={TRUST_STATS} />

      {/* ── Section 3: Eligibility Criteria ────────────── */}
      <EligibilityCriteriaTable
        badge="ELIGIBILITY"
        title="Do You Qualify?"
        titleAccentWord="Qualify"
        subtitle="Check the eligibility requirements for UG and PG programs"
        criteria={ELIGIBILITY_CRITERIA}
        groupByCategory={false}
        expandableRows={false}
        backgroundColor="gradient-dark"
        showAnimations={true}
        accentColor="var(--gold-on-light)"
      />

      {/* ── Section 4: Programs Offered ─────────────────── */}
      <div id="programs">
        <EngineeringCoursesSection programs={PROGRAMS} />
      </div>

      {/* ── Section 5: Admission Dates ───────────────────── */}
      <AdmissionDatesTable
        badge="IMPORTANT DATES"
        title="Admission Calendar 2026–27"
        titleAccentWord="Calendar"
        subtitle="Mark these key dates for TNEA counselling and direct admission"
        dates={ADMISSION_DATES}
        backgroundColor="gradient-dark"
        showAnimations={true}
        alternatingRows={true}
        accentColor="var(--gold-on-light)"
      />

      {/* ── Section 6: Fee Structure + Scholarships ─────── */}
      <FeeScholarshipsSection fees={FEE_STRUCTURE} scholarships={SCHOLARSHIPS} />

      {/* ── Section 7: FAQ + Final CTA ───────────────────── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#0b6d41]/10 text-[#0b6d41] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              FAQs
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Frequently Asked{' '}
              <span className="text-[#0b6d41]">Questions</span>
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              Separate answers for students and parents
            </p>
          </div>
          <EngineeringAdmissionsFAQ faqs={FAQS} />
        </div>
      </section>

      {/* ── Final CTA + Mobile Sticky Footer ─────────────── */}
      <AdmissionsFinalCta applyUrl={APPLY_URL} phone={ADMISSIONS_PHONE} />
    </>
  )
}
