import { Metadata } from 'next'
import { MECSECoursePage } from '@/components/cms-blocks/content/me-cse-course-page'
import { meCSECourseData } from '@/lib/cms/templates/engineering/me-cse-data'

export const metadata: Metadata = {
  title: 'ME Computer Science and Engineering (CSE) | JKKN College of Engineering - AICTE Approved',
  description: 'ME Computer Science and Engineering (CSE) at JKKN College of Engineering - AICTE approved 2-year postgraduate program. Specialize in AI, ML, Data Science, Cybersecurity. NAAC accredited with 95% placement record.',
  keywords: [
    'ME CSE',
    'Master of Engineering Computer Science',
    'postgraduate engineering',
    'JKKN College',
    'AI specialization',
    'Machine Learning',
    'Data Science',
    'Cybersecurity',
    'Cloud Computing',
    'Anna University',
    'NAAC accredited',
    'AICTE approved',
    'research program',
    'PhD faculty',
    'placement'
  ],
  openGraph: {
    title: 'ME Computer Science and Engineering (CSE) | JKKN College of Engineering',
    description: 'Advance your career with our AICTE-approved ME CSE program. Specialize in AI, ML, Data Science, and more. 95% placement with ₹12L average package.',
    images: ['https://source.unsplash.com/1200x630/?graduate,research,computer-science'],
    url: 'https://jkkn.ac.in/courses-offered/pg/me-cse',
    type: 'website',
    siteName: 'JKKN College of Engineering'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ME Computer Science and Engineering | JKKN College',
    description: 'AICTE approved 2-year ME CSE program with 6 specializations. Join industry leaders.',
    images: ['https://source.unsplash.com/1200x630/?graduate,research,computer-science']
  },
  alternates: {
    canonical: 'https://jkkn.ac.in/courses-offered/pg/me-cse'
  }
}

export default function MECSEPage() {
  return <MECSECoursePage {...meCSECourseData} />
}
