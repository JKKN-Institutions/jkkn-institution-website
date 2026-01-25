import { BEITCoursePage } from '@/components/cms-blocks/content/be-it-course-page'
import { BE_IT_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-it-data'
import type { Metadata } from 'next'

/**
 * B.Tech Information Technology Course Page
 * JKKN College of Engineering & Technology
 */

export const metadata: Metadata = {
  title: 'B.Tech Information Technology | JKKN College of Engineering',
  description: 'Comprehensive B.Tech Information Technology program at JKKN College of Engineering & Technology. NBA accredited, affiliated to Anna University. Specializations in AI/ML, Cloud Computing, Cybersecurity, Full Stack Development, Data Science, and more.',
  keywords: [
    'B.Tech IT',
    'Information Technology',
    'IT course',
    'JKKN Engineering',
    'Anna University',
    'NBA accredited',
    'Artificial Intelligence',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Full Stack Development',
    'Data Science',
    'Software Engineering',
    'Engineering admission',
    'IT placements',
    'Information Technology college',
    'Computer Science and IT',
    'DevOps',
    'Mobile App Development',
  ],
  openGraph: {
    title: 'B.Tech Information Technology | JKKN College',
    description: 'Shape the future with our comprehensive B.Tech IT program. Specializations in AI/ML, Cloud Computing, Cybersecurity, and Full Stack Development. 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: 'https://source.unsplash.com/1200x630/?information-technology,computers,programming',
        width: 1200,
        height: 630,
        alt: 'JKKN IT Laboratory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.Tech Information Technology | JKKN',
    description: 'NBA accredited IT program with specializations in AI/ML, Cloud Computing, Cybersecurity. 95%+ placement rate with packages up to ₹18 LPA.',
    images: ['https://source.unsplash.com/1200x630/?information-technology,computers,programming'],
  },
}

export default function ITCoursePage() {
  return (
    <main>
      <BEITCoursePage {...BE_IT_SAMPLE_DATA} />
    </main>
  )
}
