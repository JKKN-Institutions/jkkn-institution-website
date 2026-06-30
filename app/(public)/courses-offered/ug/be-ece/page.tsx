import { BEECECoursePage } from '@/components/cms-blocks/content/be-ece-course-page'
import { BE_ECE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-ece-data'
import { BEECECourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'

/**
 * B.E. Electronics & Communication Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-ece
 */

export const metadata: Metadata = {
  title: 'B.E. Electronics & Communication Engineering | JKKN College of Engineering',
  description:
    'Pursue B.E. in Electronics & Communication Engineering at JKKN College of Engineering & Technology. AICTE approved, NAAC accredited 4-year program with 95%+ placement record. Industry-aligned learning framework covering Embedded Systems, VLSI, Wireless Communication, IoT, and Signal Processing.',
  keywords: [
    'BE ECE',
    'Electronics and Communication Engineering',
    'JKKN Engineering College',
    'ECE course Tamil Nadu',
    'AICTE approved engineering',
    'NAAC accredited ECE',
    'Anna University',
    'Engineering admission',
    'ECE placements',
    'Embedded Systems',
    'VLSI Design',
    'Wireless Communication',
    'IoT Engineering',
    'Best engineering college Tamil Nadu',
    'Namakkal engineering college',
    'ece colleges in tamilnadu',
    'top 10 ece engineering colleges in tamilnadu',
    'best ece colleges in tamilnadu',
    'top 10 engineering colleges in tamilnadu for ece',
    'top ece engineering colleges in tamilnadu',
    'best engineering colleges for ece in tamilnadu',
    'top ece colleges in tamilnadu',
    'top engineering colleges in tamilnadu for ece',
  ],
  openGraph: {
    title: 'B.E. Electronics & Communication Engineering | JKKN College',
    description:
      'Launch your electronics career with B.E. ECE at JKKN. Industry-aligned learning framework, cutting-edge learning labs, expert senior learners, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: '/images/courses/be-ece/labs/ece-lab-33.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN ECE Learning Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E. Electronics & Communication Engineering | JKKN',
    description:
      'AICTE approved, NAAC accredited ECE program with 95%+ placement success. Transform your future with cutting-edge electronics and communication education.',
    images: ['/images/courses/be-ece/labs/ece-lab-33.jpg'],
  },
}

export default function ECECoursePage() {
  return (
    <>
      <BEECECourseSchema />
      <main>
        <BEECECoursePage {...BE_ECE_SAMPLE_DATA} />
      </main>
    </>
  )
}
