import { BECSECoursePage } from '@/components/cms-blocks/content/be-cse-course-page'
import { BE_CSE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-cse-data'
import { BECSECourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'

/**
 * B.E Computer Science & Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-cse
 */

export const metadata: Metadata = {
  title: 'B.E Computer Science and Engineering | JKKN College of Engineering',
  description:
    'Pursue B.E in Computer Science and Engineering at JKKN College of Engineering & Technology. AICTE approved, NAAC accredited 4-year program with 95%+ placement record. Industry-aligned curriculum covering AI, ML, Cloud Computing, Cybersecurity, and Full Stack Development.',
  keywords: [
    'BE CSE',
    'Computer Science Engineering',
    'JKKN Engineering College',
    'CSE course Tamil Nadu',
    'AICTE approved engineering',
    'NAAC accredited CSE',
    'Anna University',
    'Engineering admission',
    'CSE placements',
    'AI ML engineering',
    'Cloud Computing course',
    'Cybersecurity program',
    'Full Stack Development',
    'Best engineering college Tamil Nadu',
    'Namakkal engineering college',
  ],
  openGraph: {
    title: 'B.E Computer Science and Engineering | JKKN College',
    description:
      'Launch your tech career with B.E. CSE at JKKN. Industry-aligned curriculum, cutting-edge labs, expert faculty, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: 'https://source.unsplash.com/1200x630/?computer,science,engineering',
        width: 1200,
        height: 630,
        alt: 'JKKN CSE Laboratory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E Computer Science and Engineering | JKKN',
    description:
      'AICTE approved, NAAC accredited CSE program with 95%+ placement success. Transform your future with cutting-edge technology education.',
    images: ['https://source.unsplash.com/1200x630/?computer,science,engineering'],
  },
}

export default function CSECoursePage() {
  return (
    <>
      <BECSECourseSchema />
      <main>
        <BECSECoursePage {...BE_CSE_SAMPLE_DATA} />
      </main>
    </>
  )
}
