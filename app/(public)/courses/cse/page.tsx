import { BECSECoursePage } from '@/components/cms-blocks/content/be-cse-course-page'
import { BE_CSE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-cse-data'
import type { Metadata } from 'next'

/**
 * B.E. Computer Science & Engineering Course Page
 * JKKN College of Engineering & Technology
 */

export const metadata: Metadata = {
  title: 'B.E. Computer Science & Engineering | JKKN College of Engineering',
  description: 'Comprehensive B.E. Computer Science & Engineering program at JKKN College of Engineering & Technology. NBA accredited, affiliated to Anna University. Specializations in AI/ML, Data Science, Cyber Security, and Cloud Computing. 95%+ placement rate.',
  keywords: [
    'B.E. CSE',
    'Computer Science Engineering',
    'CSE course',
    'JKKN Engineering',
    'Anna University',
    'NBA accredited',
    'AI and Machine Learning',
    'Data Science',
    'Cyber Security',
    'Cloud Computing',
    'Engineering admission',
    'CSE placements',
    'Computer engineering college',
    'Software engineering',
  ],
  openGraph: {
    title: 'B.E. Computer Science & Engineering | JKKN College',
    description: 'Transform your passion for technology into a rewarding career. NBA accredited CSE program with specializations in AI/ML, Data Science, Cyber Security, and Cloud Computing. 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: '/images/cse-lab-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN CSE Laboratory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E. Computer Science & Engineering | JKKN',
    description: 'NBA accredited CSE program with specializations in AI/ML, Data Science, Cyber Security. 95%+ placement rate.',
    images: ['/images/cse-lab-hero.jpg'],
  },
}

export default function CSECoursePage() {
  return (
    <main>
      <BECSECoursePage {...BE_CSE_SAMPLE_DATA} />
    </main>
  )
}
