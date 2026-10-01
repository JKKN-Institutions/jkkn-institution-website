import { MBACoursePage } from '@/components/cms-blocks/content/mba-course-page'
import { MBA_SAMPLE_DATA } from '@/lib/cms/templates/mba-data'
import { MBACourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { FAQSchemaGenerator } from '@/components/seo/faq-schema-admissions'

/**
 * MBA (Master of Business Administration) Course Page
 * JKKN Institutions
 * Route: /courses-offered/pg/mba
 */

export const metadata: Metadata = {
  title: 'MBA College near Erode, Tamil Nadu - Komarapalayam, 18 km',
  description:
    'Full-time 2-year MBA (Marketing, Finance, HR, Operations) at JKKN College of Engineering and Technology, Komarapalayam, Namakkal District - 18 km from Erode on NH-544. 60 AICTE-approved seats, TANCET admission, Rs 65,000 a year.',
  keywords: [
    'MBA',
    'Master of Business Administration',
    'JKKN MBA',
    'MBA college near Erode',
    'MBA college Komarapalayam',
    'MBA college Namakkal',
    'TANCET MBA admission',
    'MBA Marketing Finance HR Operations',
  ],
  alternates: {
    canonical: 'https://engg.jkkn.ac.in/courses-offered/pg/mba',
  },
  openGraph: {
    title: 'MBA - Master of Business Administration | JKKN',
    description:
      'Full-time MBA at JKKN College of Engineering and Technology, Komarapalayam - 18 km from Erode. Marketing, Finance, HR and Operations specializations, case-based classes and on-campus placement support.',
    type: 'website',
    images: [
      {
        url: '/images/engineering/senthuraja-hall/senthuraja-hall-07.jpg',
        width: 1200,
        height: 630,
        alt: 'JKKN MBA Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBA - Master of Business Administration | JKKN',
    description:
      'AICTE-approved full-time MBA in Komarapalayam, Namakkal District - 18 km from Erode on NH-544.',
    images: ['/images/engineering/senthuraja-hall/senthuraja-hall-07.jpg'],
  },
}

export default function Page() {
  return (
    <>
      <BreadcrumbSchema path="/courses-offered/pg/mba" />
      <MBACourseSchema />
      <FAQSchemaGenerator faqs={MBA_SAMPLE_DATA.faqs} />
      <main>
        <MBACoursePage {...MBA_SAMPLE_DATA} />
      </main>
    </>
  )
}
