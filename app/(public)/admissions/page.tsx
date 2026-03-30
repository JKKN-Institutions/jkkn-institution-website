import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import MainAdmissionsPage from './_main-page'
import EngineeringAdmissionsMain from './engineering/_engineering-page'

// ─── Static Generation ───────────────────────────────────────────────────────
export const revalidate = 86400

// ─── Metadata (institution-aware) ────────────────────────────────────────────
export function generateMetadata(): Metadata {
  const id = getInstitutionId()

  if (id === 'main') {
    return {
      title: 'Admissions 2026-27 | JKKN Institutions — Apply Now',
      description:
        'Apply for JKKN Institutions admission 2026-27. NAAC A accredited, 7 colleges, 95%+ placements, scholarships available. Komarapalayam, Namakkal, Tamil Nadu.',
      keywords: [
        'JKKN admissions 2026',
        'JKKN Institutions admission',
        'JKKN college admission',
        'Komarapalayam college admission',
        'Namakkal college admission',
        'JKKN dental admission',
        'JKKN engineering admission',
        'JKKN pharmacy admission',
        'JKKN nursing admission',
        'best college Namakkal',
        'NAAC accredited college Tamil Nadu',
        'JKKN fee structure',
      ],
      alternates: { canonical: 'https://jkkn.ac.in/admissions' },
      openGraph: {
        title: 'Admissions 2026-27 | JKKN Institutions — Apply Now',
        description:
          'Apply for JKKN Institutions admission 2026-27. NAAC A accredited, 7 colleges, 95%+ placements, scholarships available.',
        url: 'https://jkkn.ac.in/admissions',
        siteName: 'JKKN Institutions',
        type: 'website',
        locale: 'en_IN',
      },
    }
  }

  if (id === 'engineering') {
    return {
      title: 'Admission Process 2026 | JKKN College of Engineering and Technology',
      description:
        'Complete guide to admissions for B.E / B.Tech and M.E / MBA programmes at JKKN College of Engineering — AICTE approved, Anna University affiliated, NAAC A accredited.',
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
      alternates: { canonical: 'https://engg.jkkn.ac.in/admissions' },
    }
  }

  return {}
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdmissionsPage() {
  const institutionId = getInstitutionId()

  // Main institution: umbrella admissions page covering all 7 colleges
  if (institutionId === 'main') {
    return <MainAdmissionsPage />
  }

  // Engineering institution: same content as /admissions/engineering
  // Both URLs work: engg.jkkn.ac.in/admissions and engg.jkkn.ac.in/admissions/engineering
  if (institutionId === 'engineering') {
    return <EngineeringAdmissionsMain />
  }

  // All other institution deployments — no admissions page yet
  notFound()
}
