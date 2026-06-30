import { Metadata } from 'next'
import { MECSECoursePage } from '@/components/cms-blocks/content/me-cse-course-page'
import { meCSECourseData } from '@/lib/cms/templates/engineering/me-cse-data'
import { MECSECourseSchema } from '@/lib/seo/course-schema-generator'

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
    'PhD senior learners',
    'placement',
    'me computer science and engineering colleges in tamilnadu',
  ],
  openGraph: {
    title: 'ME Computer Science and Engineering (CSE) | JKKN College of Engineering',
    description: 'Advance your career with our AICTE-approved ME CSE program. Specialize in AI, ML, Data Science, and more. 95% placement with ₹12L average package.',
    images: ['/images/engineering/labs/rnd/rnd-lab-01.jpg'],
    url: 'https://jkkn.ac.in/courses-offered/pg/me-cse',
    type: 'website',
    siteName: 'JKKN College of Engineering'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ME Computer Science and Engineering | JKKN College',
    description: 'AICTE approved 2-year ME CSE program with 6 specializations. Join industry leaders.',
    images: ['/images/engineering/labs/rnd/rnd-lab-01.jpg']
  },
  alternates: {
    canonical: 'https://jkkn.ac.in/courses-offered/pg/me-cse'
  }
}

export default function MECSEPage() {
  return (
    <>
      <MECSECourseSchema />
      <MECSECoursePage {...meCSECourseData} />
    </>
  )
}
