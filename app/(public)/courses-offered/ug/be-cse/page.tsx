import { BECSECoursePage } from '@/components/cms-blocks/content/be-cse-course-page'
import { BE_CSE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-cse-data'
import { BECSECourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { FAQSchemaGenerator } from '@/components/seo/faq-schema-admissions'

/**
 * B.E Computer Science & Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-cse
 */

export const metadata: Metadata = {
  title: 'B.E. CSE College in Namakkal, Tamil Nadu',
  description:
    'B.E. Computer Science and Engineering at JKKN College of Engineering and Technology (Autonomous), Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated, TNEA code 2647.',
  keywords: [
    'BE CSE',
    'Computer Science and Engineering',
    'JKKN Engineering College',
    'CSE engineering college Tamil Nadu',
    'CSE engineering college Namakkal',
    'Anna University',
    'TNEA CSE',
  ],
  alternates: {
    canonical: 'https://engg.jkkn.ac.in/courses-offered/ug/be-cse',
  },
  openGraph: {
    title: 'B.E Computer Science and Engineering | JKKN College',
    description:
      'Launch your tech career with B.E. CSE at JKKN. Industry-aligned learning framework, cutting-edge learning labs, expert senior learners, and on-campus placement support.',
    type: 'website',
    images: [
      {
        url: '/images/courses/be-cse/labs/cse-lab-01.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN CSE Learning Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E Computer Science and Engineering | JKKN',
    description:
      'B.E. CSE in Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated.',
    images: ['/images/courses/be-cse/labs/cse-lab-01.jpg'],
  },
}

export default function CSECoursePage() {
  return (
    <>
      <BreadcrumbSchema path="/courses-offered/ug/be-cse" />
      <BECSECourseSchema />
      <FAQSchemaGenerator faqs={BE_CSE_SAMPLE_DATA.faqs} />
      <main>
        <BECSECoursePage {...BE_CSE_SAMPLE_DATA} />
      </main>
    </>
  )
}
