import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import EngineeringScholarshipPage from './_engineering-scholarship'

// ─── Static Generation ───────────────────────────────────────────────────────
// Scholarship amounts update on government-norm cycles (typically annual).
// Daily revalidation is safe.
export const revalidate = 86400

// ─── Metadata (institution-aware) ────────────────────────────────────────────
export function generateMetadata(): Metadata {
  const id = getInstitutionId()

  if (id === 'engineering') {
    return {
      title:
        'Scholarship Details 2026-27 | JKKN College of Engineering and Technology',
      description:
        'Government, Trust, and Naan Mudhalvan scholarship details for B.E / B.Tech, M.B.A, and M.E programmes at JKKN Engineering College. Covers PMSS (SC/SCA/ST/BC-CC), First Graduate (BC/MBC/DNC/BCM), Maintenance, and Merit-based Trust Scholarship.',
      keywords: [
        'JKKN engineering scholarships',
        'engineering college scholarships Tamil Nadu',
        'PMSS scholarship engineering',
        'First Graduate scholarship engineering',
        'Naan Mudhalvan scholarship',
        'Trust scholarship JKKN',
        'BC MBC DNC BCM scholarship',
        'SC ST scholarship engineering',
        'merit scholarship engineering 2026',
        'JKKN BE BTech scholarship',
        'MBA scholarship Namakkal',
        'engineering scholarship eligibility',
      ],
      alternates: { canonical: 'https://engg.jkkn.ac.in/scholarships' },
      openGraph: {
        title:
          'Scholarship Details 2026-27 — JKKN College of Engineering and Technology',
        description:
          'Complete scholarship details for engineering programmes — Government schemes, Trust Merit Scholarship, and Naan Mudhalvan benefits.',
        url: 'https://engg.jkkn.ac.in/scholarships',
        siteName: 'JKKN College of Engineering and Technology',
        type: 'website',
        locale: 'en_IN',
        images: [
          {
            url: '/og/engineering-admissions.jpg',
            width: 1200,
            height: 630,
            alt: 'JKKN Engineering — Scholarship Details 2026-27',
          },
        ],
      },
    }
  }

  return {
    title: 'Scholarships | JKKN Institutions',
    description: 'Scholarship details for JKKN institution programmes.',
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ScholarshipsRoutePage() {
  const id = getInstitutionId()

  if (id === 'engineering') {
    return <EngineeringScholarshipPage />
  }

  // Other institutions do not have this sub-page yet (per user request: engineering only).
  notFound()
}
