import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { MBA_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'MBA Admission 2026-27 | Eligibility, Fees, TANCET — JKKN Engineering',
  description:
    'MBA at JKKN College of Engineering and Technology: 60 AICTE seats, ₹65,000 a year. Government Quota through TANCET counselling, college code 2647.',
  keywords: [
    'MBA admission 2026',
    'JKKN MBA admission',
    'MBA admission Tamil Nadu',
    'TANCET MBA counselling 2026',
    'MBA management quota admission',
    'MBA eligibility JKKN',
    'MBA fee structure 2026',
    'MBA Namakkal',
    'best MBA college Tamil Nadu',
  ],
  openGraph: {
    title: 'MBA Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '60 seats · ₹65,000/yr · Government Quota through TANCET counselling, college code 2647 · Finance · Marketing · HRM.',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630, alt: 'JKKN MBA Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/mba' },
}

export default function Page() {
  return <CourseAdmissionPage {...MBA_ADMISSION} />
}
