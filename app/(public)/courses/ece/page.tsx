import { BEECECoursePage } from '@/components/cms-blocks/content/be-ece-course-page'
import { BE_ECE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-ece-data'
import type { Metadata } from 'next'

/**
 * B.E. Electronics & Communication Engineering Course Page
 * JKKN College of Engineering & Technology
 */

export const metadata: Metadata = {
  title: 'B.E. Electronics & Communication Engineering | JKKN College of Engineering',
  description: 'Comprehensive B.E. Electronics & Communication Engineering program at JKKN College of Engineering & Technology. NAAC accredited, affiliated to Anna University. Specializations in Embedded Systems, VLSI, Wireless Communication, IoT, and more.',
  keywords: [
    'B.E. ECE',
    'Electronics and Communication Engineering',
    'ECE course',
    'JKKN Engineering',
    'Anna University',
    'NAAC accredited',
    'Embedded Systems',
    'VLSI Design',
    'Wireless Communication',
    'IoT',
    'Engineering admission',
    'ECE placements',
    'Electronics engineering college',
    'Communication engineering',
  ],
  openGraph: {
    title: 'B.E. Electronics & Communication Engineering | JKKN College',
    description: 'Shape the future with our comprehensive B.E. ECE program. Specializations in Embedded Systems, VLSI, Wireless Communication, and IoT. 90%+ placement rate.',
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
    description: 'NAAC accredited ECE program with specializations in Embedded Systems, VLSI, IoT. 90%+ placement rate.',
    images: ['https://source.unsplash.com/1200x630/?electronics,communication,engineering'],
  },
}

export default function ECECoursePage() {
  return (
    <main>
      <BEECECoursePage {...BE_ECE_SAMPLE_DATA} />
    </main>
  )
}
