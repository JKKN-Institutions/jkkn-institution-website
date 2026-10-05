import { BEMechanicalCoursePage } from '@/components/cms-blocks/content/be-mechanical-course-page'
import { beMechanicalCourseData } from '@/lib/cms/templates/engineering/be-mechanical-data'
import { BEMechanicalCourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { FAQSchemaGenerator } from '@/components/seo/faq-schema-admissions'

/**
 * B.E. Mechanical Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-mechanical
 */

export const metadata: Metadata = {
  title: 'B.E. Mechanical Engineering College in Namakkal, Tamil Nadu',
  description:
    'B.E. Mechanical Engineering at JKKN College of Engineering and Technology (Autonomous), Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated, TNEA and Management Quota admission.',
  keywords: [
    'BE Mechanical',
    'Mechanical Engineering',
    'JKKN Engineering College',
    'Mechanical engineering college Tamil Nadu',
    'Mechanical engineering college Namakkal',
    'Anna University',
    'TNEA mechanical engineering',
  ],
  alternates: {
    canonical: 'https://engg.jkkn.ac.in/courses-offered/ug/be-mechanical',
  },
  openGraph: {
    title: 'B.E. Mechanical Engineering | JKKN College',
    description:
      'Build your engineering career with B.E. Mechanical at JKKN. Industry-aligned learning framework, state-of-the-art learning labs, expert senior learners, and on-campus placement support.',
    type: 'website',
    images: [
      {
        url: '/images/courses/be-mech/labs/mech-lab-01.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN Mechanical Engineering Learning Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E. Mechanical Engineering | JKKN',
    description:
      'B.E. Mechanical Engineering in Komarapalayam, Namakkal District, Tamil Nadu. 60 AICTE-approved seats, Anna University affiliated.',
    images: ['/images/courses/be-mech/labs/mech-lab-01.jpg'],
  },
}

export default function MechanicalCoursePage() {
  return (
    <>
      <BreadcrumbSchema path="/courses-offered/ug/be-mechanical" />
      <BEMechanicalCourseSchema />
      <FAQSchemaGenerator faqs={beMechanicalCourseData.faqs} />
      <main>
        <BEMechanicalCoursePage {...beMechanicalCourseData} />
      </main>
    </>
  )
}
