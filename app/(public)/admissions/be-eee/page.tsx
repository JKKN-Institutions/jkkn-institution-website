import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { BE_EEE_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'B.E EEE Admission 2026-27 | Eligibility, Fees, Process — JKKN Engineering',
  description:
    'Apply for B.E Electrical & Electronics Engineering at JKKN College of Engineering & Technology for 2026-27. Check eligibility, ₹45,000 fee, 60 seats, TNEA + Management Quota counselling, required documents, scholarships and important dates.',
  keywords: [
    'BE EEE admission 2026',
    'JKKN EEE admission',
    'B.E Electrical Electronics admission Tamil Nadu',
    'TNEA EEE counselling 2026',
    'EEE management quota admission',
    'BE EEE eligibility',
    'BE EEE fee structure 2026',
    'apply BE EEE online',
  ],
  openGraph: {
    title: 'B.E EEE Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '60 seats · ₹45,000/yr · AICTE · NAAC · Anna University affiliated. Eligibility, application steps, documents, scholarships and dates for B.E EEE admission.',
    type: 'website',
    images: [{ url: '/images/courses/be-eee/labs/eee-lab-11.jpg', width: 1200, height: 630, alt: 'JKKN B.E EEE Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/be-eee' },
}

export default function Page() {
  return <CourseAdmissionPage {...BE_EEE_ADMISSION} />
}
