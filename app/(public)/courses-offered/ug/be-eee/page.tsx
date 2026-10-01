import { BEEEECoursePage } from '@/components/cms-blocks/content/be-eee-course-page'
import { BE_EEE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-eee-data'
import { BEEEECourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { FAQSchemaGenerator } from '@/components/seo/faq-schema-admissions'

/**
 * B.E. Electrical & Electronics Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-eee
 */

export const metadata: Metadata = {
  title: 'B.E. EEE College in Namakkal, Tamil Nadu',
  description:
    'B.E. Electrical and Electronics Engineering at JKKN College of Engineering and Technology (Autonomous), Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated, TNEA code 2647.',
  keywords: [
    'BE EEE',
    'Electrical and Electronics Engineering',
    'JKKN Engineering College',
    'EEE engineering college Tamil Nadu',
    'EEE engineering college Namakkal',
    'Anna University',
    'TNEA EEE',
  ],
  alternates: {
    canonical: 'https://engg.jkkn.ac.in/courses-offered/ug/be-eee',
  },
  openGraph: {
    title: 'B.E. Electrical & Electronics Engineering | JKKN College',
    description:
      'Power your future with B.E. EEE at JKKN. Industry-aligned learning framework, state-of-the-art learning labs, expert senior learners, and on-campus placement support.',
    type: 'website',
    images: [
      {
        url: '/images/courses/be-eee/labs/eee-lab-11.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN EEE Learning Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E. Electrical & Electronics Engineering | JKKN',
    description:
      'B.E. EEE in Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated.',
    images: ['/images/courses/be-eee/labs/eee-lab-11.jpg'],
  },
}

export default function EEECoursePage() {
  return (
    <>
      <BreadcrumbSchema path="/courses-offered/ug/be-eee" />
      <BEEEECourseSchema />
      <FAQSchemaGenerator faqs={BE_EEE_SAMPLE_DATA.faqs} />
      <main>
        <BEEEECoursePage {...BE_EEE_SAMPLE_DATA} />
      </main>
    </>
  )
}
