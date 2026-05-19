import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { ME_CSE_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'M.E CSE Admission 2026-27 | Eligibility, Fees, TANCET — JKKN Engineering',
  description:
    'Apply for M.E Computer Science & Engineering at JKKN College of Engineering & Technology for 2026-27. AICTE approved, NAAC accredited. 60 seats, ₹30,000 fee, TANCET + Direct Merit admission. Advanced Algorithms, Data Science, Network Security specializations.',
  keywords: [
    'ME CSE admission 2026',
    'JKKN M.E CSE admission',
    'M.E Computer Science admission Tamil Nadu',
    'TANCET CSE counselling 2026',
    'ME CSE direct admission',
    'ME CSE eligibility',
    'ME CSE fee structure 2026',
    'PG engineering admission Namakkal',
  ],
  openGraph: {
    title: 'M.E CSE Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '60 seats · ₹30,000/yr (most affordable PG engineering) · TANCET or Direct Merit. Advanced Algorithms, Data Science, Network Security.',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630, alt: 'JKKN M.E CSE Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/me-cse' },
}

export default function Page() {
  return <CourseAdmissionPage {...ME_CSE_ADMISSION} />
}
