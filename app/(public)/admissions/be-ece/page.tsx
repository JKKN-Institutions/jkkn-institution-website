import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { BE_ECE_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'B.E ECE Admission 2026-27 | Eligibility, Fees, Apply Online — JKKN Engineering',
  description:
    'Apply for B.E Electronics & Communication Engineering at JKKN College of Engineering & Technology for 2026-27. AICTE approved, NAAC accredited. 60 seats, VLSI/Embedded/Telecom specializations, TNEA + Management Quota admission. Check eligibility, fees, scholarships and important dates.',
  keywords: [
    'BE ECE admission 2026',
    'JKKN ECE admission',
    'B.E Electronics Communication admission Tamil Nadu',
    'TNEA ECE counselling 2026',
    'ECE management quota admission',
    'BE ECE eligibility',
    'BE ECE fee structure 2026',
    'apply BE ECE online',
  ],
  openGraph: {
    title: 'B.E ECE Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '60 seats · ₹70,000/yr · VLSI · Embedded · Telecom specializations. Eligibility, application steps, documents and scholarships for B.E ECE admission.',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630, alt: 'JKKN B.E ECE Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/be-ece' },
}

export default function Page() {
  return <CourseAdmissionPage {...BE_ECE_ADMISSION} />
}
