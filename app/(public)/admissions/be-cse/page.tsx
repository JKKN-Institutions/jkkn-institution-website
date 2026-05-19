import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { BE_CSE_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'B.E CSE Admission 2026-27 | Eligibility, Fees, Apply Online — JKKN Engineering',
  description:
    'Apply for B.E Computer Science & Engineering at JKKN College of Engineering & Technology for 2026-27. AICTE approved, NAAC accredited, Anna University affiliated. 60 seats, AI/ML/Cloud specializations, TNEA + Management Quota admission. Check eligibility, fees, scholarships and important dates.',
  keywords: [
    'BE CSE admission 2026',
    'JKKN CSE admission',
    'B.E Computer Science admission Tamil Nadu',
    'TNEA CSE counselling 2026',
    'CSE management quota admission',
    'BE CSE eligibility',
    'BE CSE fee structure 2026',
    'apply BE CSE online',
    'best CSE college Namakkal',
  ],
  openGraph: {
    title: 'B.E CSE Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '60 seats · AICTE · NAAC · AI/ML/Cloud specializations. Eligibility, application steps, documents, scholarships and dates for B.E Computer Science Engineering admission.',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630, alt: 'JKKN B.E CSE Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/be-cse' },
}

export default function Page() {
  return <CourseAdmissionPage {...BE_CSE_ADMISSION} />
}
