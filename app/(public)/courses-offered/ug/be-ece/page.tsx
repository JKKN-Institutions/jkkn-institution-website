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
    'Pursue B.E. in Electronics & Communication Engineering at JKKN College of Engineering & Technology. AICTE approved, NAAC accredited 4-year program with 95%+ placement record. Industry-aligned curriculum covering Embedded Systems, VLSI, Wireless Communication, IoT, and Signal Processing.',
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
  ],
  openGraph: {
    title: 'B.E. Electronics & Communication Engineering | JKKN College',
    description:
      'Launch your electronics career with B.E. ECE at JKKN. Industry-aligned curriculum, cutting-edge labs, expert faculty, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: 'https://source.unsplash.com/1200x630/?electronics,communication,engineering',
        width: 1200,
        height: 630,
        alt: 'JKKN ECE Laboratory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E. Electronics & Communication Engineering | JKKN',
    description:
      'AICTE approved, NAAC accredited ECE program with 95%+ placement success. Transform your future with cutting-edge electronics and communication education.',
    images: ['https://source.unsplash.com/1200x630/?electronics,communication,engineering'],
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
