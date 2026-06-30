import { BEITCoursePage } from '@/components/cms-blocks/content/be-it-course-page'
import { BE_IT_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-it-data'
import { BTechITCourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'

/**
 * B.Tech Information Technology Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/btech-it
 */

export const metadata: Metadata = {
  title: 'B.Tech Information Technology | JKKN College of Engineering',
  description:
    'Pursue B.Tech in Information Technology at JKKN College of Engineering & Technology. AICTE approved, NAAC accredited 4-year program with 95%+ placement record. Industry-aligned learning framework covering Data Science, AI/ML, Full Stack Development, UI/UX Design, Cloud Computing, and IoT.',
  keywords: [
    'BTech IT',
    'Information Technology',
    'JKKN Engineering College',
    'IT course Tamil Nadu',
    'AICTE approved engineering',
    'NAAC accredited IT',
    'Anna University',
    'Engineering admission',
    'IT placements',
    'Data Science course',
    'Full Stack Development',
    'UI UX Design program',
    'Cloud Computing course',
    'IoT engineering',
    'Best engineering college Tamil Nadu',
    'Namakkal engineering college',
    'b tech information technology colleges in tamilnadu',
    'bsc information technology colleges in tamilnadu',
    'be information technology colleges in tamilnadu',
    'information technology colleges in tamilnadu',
    'top 10 information technology colleges in tamilnadu',
  ],
  openGraph: {
    title: 'B.Tech Information Technology | JKKN College',
    description:
      'Launch your tech career with B.Tech IT at JKKN. Industry-aligned learning framework, cutting-edge learning labs, expert senior learners, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: '/images/courses/btech-it/labs/it-lab-01.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN IT Learning Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.Tech Information Technology | JKKN',
    description:
      'AICTE approved, NAAC accredited IT program with 95%+ placement success. Transform your future with cutting-edge technology education.',
    images: ['/images/courses/btech-it/labs/it-lab-01.jpg'],
  },
}

export default function BTechITCoursePage() {
  return (
    <>
      <BTechITCourseSchema />
      <main>
        <BEITCoursePage {...BE_IT_SAMPLE_DATA} />
      </main>
    </>
  )
}
