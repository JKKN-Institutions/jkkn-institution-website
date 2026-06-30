import { SHCoursePage } from '@/components/cms-blocks/content/sh-course-page'
import { SH_SAMPLE_DATA } from '@/lib/cms/templates/engineering/sh-data'
import type { Metadata } from 'next'

/**
 * Science and Humanities Department Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/sh
 */

export const metadata: Metadata = {
  title: 'Department of Science and Humanities | JKKN College of Engineering',
  description:
    'Explore the Science and Humanities department at JKKN College of Engineering & Technology. Established in 2008, offering comprehensive foundation in Physics, Chemistry, Mathematics, and English with state-of-the-art learning lab facilities and outcome-based education.',
  keywords: [
    'Science and Humanities',
    'JKKN Engineering College',
    'Physics department',
    'Chemistry department',
    'Mathematics department',
    'English department',
    'AICTE approved',
    'NAAC accredited',
    'Anna University',
    'Engineering foundation',
    'Basic sciences',
    'Namakkal engineering college',
    'S&H department',
    'Fundamental sciences',
  ],
  openGraph: {
    title: 'Science and Humanities Department | JKKN College',
    description:
      'Build your engineering foundation with comprehensive education in Physics, Chemistry, Mathematics, and English at JKKN. Established in 2008 with state-of-the-art learning labs and expert senior learners.',
    type: 'website',
    images: [
      {
        url: '/images/engineering/library/library-01.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN Science and Humanities Learning Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science and Humanities Department | JKKN',
    description:
      'AICTE approved, NAAC accredited program providing strong foundation in fundamental sciences. Expert senior learners and excellent learning lab facilities.',
    images: ['/images/engineering/library/library-01.jpg'],
  },
}

export default function ScienceHumanitiesPage() {
  return (
    <main>
      <SHCoursePage {...SH_SAMPLE_DATA} />
    </main>
  )
}
