import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { MBA_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'MBA Admission 2026-27 | Eligibility, Fees, TANCET/CAT/MAT — JKKN Engineering',
  description:
    'Apply for M.B.A — Master of Business Administration at JKKN College of Engineering & Technology for 2026-27. AICTE approved, NAAC accredited. 120 seats, ₹65,000 fee, TANCET/CAT/MAT/XAT entrance, GD/PI selection. Finance, Marketing, HRM specializations.',
  keywords: [
    'MBA admission 2026',
    'JKKN MBA admission',
    'MBA admission Tamil Nadu',
    'TANCET MBA counselling 2026',
    'CAT MAT XAT MBA admission',
    'MBA management quota admission',
    'MBA eligibility JKKN',
    'MBA fee structure 2026',
    'MBA Namakkal',
    'best MBA college Tamil Nadu',
  ],
  openGraph: {
    title: 'MBA Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '120 seats · ₹65,000/yr · TANCET / CAT / MAT / XAT · Finance · Marketing · HRM. GD + PI selection. Industry-aligned curriculum and placements.',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630, alt: 'JKKN MBA Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/mba' },
}

export default function Page() {
  return <CourseAdmissionPage {...MBA_ADMISSION} />
}
