import { BEEEECoursePage } from '@/components/cms-blocks/content/be-eee-course-page'
import { BE_EEE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-eee-data'
import { BEEEECourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'

/**
 * B.E. Electrical & Electronics Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-eee
 */

export const metadata: Metadata = {
  title: 'B.E. Electrical & Electronics Engineering | JKKN College of Engineering',
  description:
    'Pursue B.E. in Electrical & Electronics Engineering at JKKN College of Engineering & Technology. AICTE approved, NAAC accredited 4-year program with 95%+ placement record. Industry-aligned curriculum covering Power Systems, Electrical Machines, Power Electronics, Renewable Energy, and Smart Grid Technologies.',
  keywords: [
    'BE EEE',
    'Electrical Electronics Engineering',
    'JKKN Engineering College',
    'EEE course Tamil Nadu',
    'AICTE approved engineering',
    'NAAC accredited EEE',
    'Anna University',
    'Engineering admission',
    'EEE placements',
    'Power Systems engineering',
    'Electrical Machines course',
    'Power Electronics program',
    'Renewable Energy',
    'Smart Grid Technology',
    'Best engineering college Tamil Nadu',
    'Namakkal engineering college',
    'best college for eee in tamilnadu',
    'best eee colleges in tamilnadu',
    'eee best colleges in tamilnadu',
    'top eee engineering colleges in tamilnadu',
    'top 10 engineering colleges in tamilnadu for eee',
    'top eee colleges in tamilnadu',
  ],
  openGraph: {
    title: 'B.E. Electrical & Electronics Engineering | JKKN College',
    description:
      'Power your future with B.E. EEE at JKKN. Industry-aligned curriculum, state-of-the-art labs, expert faculty, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: '/images/courses/be-eee/labs/eee-lab-11.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN EEE Laboratory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E. Electrical & Electronics Engineering | JKKN',
    description:
      'AICTE approved, NAAC accredited EEE program with 95%+ placement success. Transform your future with cutting-edge electrical engineering education.',
    images: ['/images/courses/be-eee/labs/eee-lab-11.jpg'],
  },
}

export default function EEECoursePage() {
  return (
    <>
      <BEEEECourseSchema />
      <main>
        <BEEEECoursePage {...BE_EEE_SAMPLE_DATA} />
      </main>
    </>
  )
}
