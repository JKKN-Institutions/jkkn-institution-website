import { MBACoursePage } from '@/components/cms-blocks/content/mba-course-page'
import { MBA_SAMPLE_DATA } from '@/lib/cms/templates/mba-data'
import { MBACourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'

/**
 * MBA (Master of Business Administration) Course Page
 * JKKN Institutions
 * Route: /courses-offered/pg/mba
 */

export const metadata: Metadata = {
  title: 'MBA - Master of Business Administration | JKKN Institutions',
  description:
    'Pursue MBA at JKKN Institutions. AICTE approved 2-year postgraduate program with specializations in Marketing, Finance, HR, and Operations. 95%+ placement record with top corporate recruiters. Transform your career with strategic business education.',
  keywords: [
    'MBA',
    'Master of Business Administration',
    'JKKN MBA',
    'MBA Tamil Nadu',
    'AICTE approved MBA',
    'MBA admissions',
    'MBA placements',
    'MBA specializations',
    'Marketing MBA',
    'Finance MBA',
    'HR MBA',
    'Operations Management MBA',
    'Business school Tamil Nadu',
    'Best MBA college',
    'MBA course details',
    'MBA eligibility',
    'MBA fee structure',
    'Postgraduate management',
  ],
  openGraph: {
    title: 'MBA - Master of Business Administration | JKKN',
    description:
      'Launch your management career with MBA at JKKN. Industry-integrated curriculum, expert faculty, case-based learning, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'JKKN MBA Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBA - Master of Business Administration | JKKN',
    description:
      'AICTE approved MBA program with 95%+ placement success. Transform your career with strategic business education and industry exposure.',
    images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=630&fit=crop'],
  },
}

export default function Page() {
  return (
    <>
      <MBACourseSchema />
      <main>
        <MBACoursePage {...MBA_SAMPLE_DATA} />
      </main>
    </>
  )
}
