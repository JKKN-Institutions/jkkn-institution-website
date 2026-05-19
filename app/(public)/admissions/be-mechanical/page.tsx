import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { BE_MECHANICAL_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'B.E Mechanical Admission 2026-27 | Eligibility, Fees, Apply — JKKN Engineering',
  description:
    'Apply for B.E Mechanical Engineering at JKKN College of Engineering & Technology for 2026-27. AICTE approved, NAAC accredited. 120 seats, ₹45,000 fee, CAD/CAM/Thermal/Manufacturing specializations, TNEA + Management Quota admission.',
  keywords: [
    'BE Mechanical admission 2026',
    'JKKN Mechanical admission',
    'B.E Mechanical Engineering admission Tamil Nadu',
    'TNEA Mechanical counselling 2026',
    'Mechanical management quota admission',
    'BE Mechanical eligibility',
    'BE Mechanical fee structure 2026',
    'apply BE Mechanical online',
  ],
  openGraph: {
    title: 'B.E Mechanical Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '120 seats · ₹45,000/yr · CAD/CAM · Thermal · Manufacturing. Most affordable engineering branch. Eligibility, application steps, and scholarships.',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630, alt: 'JKKN B.E Mechanical Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/be-mechanical' },
}

export default function Page() {
  return <CourseAdmissionPage {...BE_MECHANICAL_ADMISSION} />
}
