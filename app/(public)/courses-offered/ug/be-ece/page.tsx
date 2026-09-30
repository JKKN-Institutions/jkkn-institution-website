import { BEECECoursePage } from '@/components/cms-blocks/content/be-ece-course-page'
import { BE_ECE_SAMPLE_DATA } from '@/lib/cms/templates/engineering/be-ece-data'
import { BEECECourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { FAQSchemaGenerator } from '@/components/seo/faq-schema-admissions'

/**
 * B.E. Electronics & Communication Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-ece
 */

export const metadata: Metadata = {
  title: 'B.E. ECE College in Namakkal, Tamil Nadu',
  description:
    'B.E. Electronics and Communication Engineering at JKKN College of Engineering and Technology (Autonomous), Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated, TNEA code 2647.',
  keywords: [
    'BE ECE',
    'Electronics and Communication Engineering',
    'JKKN Engineering College',
    'ECE engineering college Tamil Nadu',
    'ECE engineering college Namakkal',
    'Anna University',
    'TNEA ECE',
  ],
  alternates: {
    canonical: 'https://engg.jkkn.ac.in/courses-offered/ug/be-ece',
  },
  openGraph: {
    title: 'B.E. Electronics & Communication Engineering | JKKN College',
    description:
      'Launch your electronics career with B.E. ECE at JKKN. Industry-aligned learning framework, cutting-edge learning labs, expert senior learners, and on-campus placement support.',
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
      'B.E. ECE in Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated.',
    images: ['/images/courses/be-ece/labs/ece-lab-33.jpg'],
  },
}

export default function ECECoursePage() {
  return (
    <>
      <BreadcrumbSchema path="/courses-offered/ug/be-ece" />
      <BEECECourseSchema />
      <FAQSchemaGenerator faqs={BE_ECE_SAMPLE_DATA.faqs} />
      <main>
        <BEECECoursePage {...BE_ECE_SAMPLE_DATA} />
      </main>
    </>
  )
}
