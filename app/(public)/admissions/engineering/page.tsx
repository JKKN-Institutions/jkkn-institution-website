import type { Metadata } from 'next'
import EngineeringAdmissionsMain from './_engineering-page'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Admission Process 2026 | JKKN College of Engineering and Technology',
  description:
    'Complete guide to admissions for B.E / B.Tech and M.E / MBA programmes at JKKN College of Engineering — AICTE approved, Anna University affiliated, NAAC A accredited. Eligibility, fee structure, important dates, and scholarships.',
  keywords: [
    'JKKN engineering admissions 2026',
    'engineering college admissions Tamil Nadu',
    'TNEA counselling 2026',
    'AICTE approved engineering college',
    'Anna University affiliated college',
    'B.E admissions Namakkal',
    'engineering college fee structure',
  ],
  openGraph: {
    title: 'JKKN Engineering Admissions 2026 — Complete Admission Guide',
    description:
      'NAAC A accredited · 5 UG + 2 PG programmes · 95%+ placement · Eligibility, fee, dates, scholarships.',
    type: 'website',
    images: [
      {
        url: '/og/engineering-admissions.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN College of Engineering — Admission Process 2026',
      },
    ],
  },
  alternates: { canonical: '/admissions/engineering' },
}

/**
 * Engineering College admissions page.
 * Canonical URL: /admissions/engineering
 * Always renders engineering-specific content regardless of NEXT_PUBLIC_INSTITUTION_ID.
 */
export default function EngineeringAdmissionsPage() {
  return <EngineeringAdmissionsMain />
}
