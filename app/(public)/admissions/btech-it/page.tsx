import type { Metadata } from 'next'
import { CourseAdmissionPage } from '@/components/public/admissions/course-admission-page'
import { BTECH_IT_ADMISSION } from '@/lib/institutions/engineering/course-admissions-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'B.Tech IT Admission 2026-27 | Eligibility, Fees, Apply Online — JKKN Engineering',
  description:
    'Apply for B.Tech Information Technology at JKKN College of Engineering & Technology for 2026-27. AICTE approved, NAAC accredited. 60 seats, Networking/Cybersecurity/Web Tech specializations, TNEA + Management Quota admission.',
  keywords: [
    'BTech IT admission 2026',
    'JKKN B.Tech IT admission',
    'B.Tech Information Technology admission Tamil Nadu',
    'TNEA IT counselling 2026',
    'IT management quota admission',
    'BTech IT eligibility',
    'BTech IT fee structure 2026',
    'apply BTech IT online',
  ],
  openGraph: {
    title: 'B.Tech IT Admission 2026-27 — Apply Online | JKKN Engineering',
    description:
      '60 seats · Networking · Cybersecurity · Web Tech specializations. Eligibility, application steps, documents, scholarships and dates for B.Tech IT admission.',
    type: 'website',
    images: [{ url: '/og/engineering-admissions.jpg', width: 1200, height: 630, alt: 'JKKN B.Tech IT Admissions 2026-27' }],
  },
  alternates: { canonical: '/admissions/btech-it' },
}

export default function Page() {
  return <CourseAdmissionPage {...BTECH_IT_ADMISSION} />
}
