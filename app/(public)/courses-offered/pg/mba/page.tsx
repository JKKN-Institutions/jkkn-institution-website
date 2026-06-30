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
    'top mba colleges in tamilnadu',
    'best mba colleges in tamilnadu',
    'mba colleges in tamilnadu',
    'top 10 mba colleges in tamilnadu',
    'mba distance education in tamilnadu',
    'mba correspondence course in tamilnadu',
    'mba courses in tamilnadu',
    'mba hospital management colleges in tamilnadu',
    'top 10 mba logistics colleges in tamilnadu',
    'top mba colleges in tamilnadu with fees structure',
    'best mba colleges in tamilnadu with low fees',
    'best university for mba distance education in tamilnadu',
    'mba colleges ranking in tamilnadu',
    'mba courses correspondence in tamilnadu',
    'mba logistics colleges in tamilnadu',
    'mba hr distance education in tamilnadu',
    'mba hr courses in tamilnadu',
    'private mba colleges in tamilnadu',
    'top 5 mba colleges in tamilnadu',
    'best distance education university in tamilnadu for mba',
    'best mba distance education university in tamilnadu',
    'best mba hr colleges in tamilnadu',
  ],
  openGraph: {
    title: 'MBA - Master of Business Administration | JKKN',
    description:
      'Launch your management career with MBA at JKKN. Industry-integrated learning framework, expert senior learners, case-based learning, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: '/images/engineering/senthuraja-hall/senthuraja-hall-07.jpg',
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
    images: ['/images/engineering/senthuraja-hall/senthuraja-hall-07.jpg'],
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
