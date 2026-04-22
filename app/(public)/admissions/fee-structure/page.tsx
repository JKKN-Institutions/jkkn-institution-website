import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getInstitutionId } from '@/lib/config/multi-tenant'
import EngineeringFeeStructurePage from './_engineering-fee-structure'

// ─── Static Generation ───────────────────────────────────────────────────────
// Fee structure updates once per year — daily revalidation is safe.
export const revalidate = 86400

// ─── Metadata (institution-aware) ────────────────────────────────────────────
export function generateMetadata(): Metadata {
  const id = getInstitutionId()

  if (id === 'engineering') {
    return {
      title: 'Fee Structure 2026-27 | JKKN College of Engineering and Technology',
      description:
        'Branch-wise annual tuition fees for B.E / B.Tech, M.E, M.B.A and Lateral Entry programmes at JKKN Engineering College. Government Quota (GQ) and Management Quota (MQ) fees for CSE, IT, ECE, EEE, MECH — AICTE approved, Anna University affiliated.',
      keywords: [
        'JKKN engineering fees',
        'JKKN engineering college fee structure',
        'B.E fee structure Tamil Nadu',
        'B.Tech fees Namakkal',
        'engineering college fees 2026',
        'management quota fees engineering',
        'TNEA government quota fees',
        'CSE fee JKKN',
        'M.E CSE fees',
        'M.B.A fees JKKN',
        'lateral entry engineering fees',
        'AICTE approved engineering college fees',
      ],
      alternates: { canonical: 'https://engg.jkkn.ac.in/admissions/fee-structure' },
      openGraph: {
        title: 'Fee Structure 2026-27 — JKKN College of Engineering and Technology',
        description:
          'Transparent annual tuition fees for all UG, PG, and Lateral Entry engineering programmes. Government Quota and Management Quota details.',
        url: 'https://engg.jkkn.ac.in/admissions/fee-structure',
        siteName: 'JKKN College of Engineering and Technology',
        type: 'website',
        locale: 'en_IN',
        images: [
          {
            url: '/og/engineering-admissions.jpg',
            width: 1200,
            height: 630,
            alt: 'JKKN Engineering — Fee Structure 2026-27',
          },
        ],
      },
    }
  }

  return {
    title: 'Fee Structure | JKKN Institutions',
    description: 'Fee structure details for JKKN institution programmes.',
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function FeeStructureRoutePage() {
  const id = getInstitutionId()

  if (id === 'engineering') {
    return <EngineeringFeeStructurePage />
  }

  // Non-engineering deployments do not have this sub-page yet.
  notFound()
}
