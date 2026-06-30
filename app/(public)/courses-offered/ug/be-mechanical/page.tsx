import { BEMechanicalCoursePage } from '@/components/cms-blocks/content/be-mechanical-course-page'
import { beMechanicalCourseData } from '@/lib/cms/templates/engineering/be-mechanical-data'
import { BEMechanicalCourseSchema } from '@/lib/seo/course-schema-generator'
import type { Metadata } from 'next'

/**
 * B.E. Mechanical Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-mechanical
 */

export const metadata: Metadata = {
  title: 'B.E. Mechanical Engineering | JKKN College of Engineering',
  description:
    'Pursue B.E. in Mechanical Engineering at JKKN College of Engineering & Technology. NAAC accredited, AICTE approved 4-year program with 95%+ placement record. Industry-aligned learning framework covering Thermal Engineering, Manufacturing, CAD/CAM, Automobile Engineering, and Robotics.',
  keywords: [
    'BE Mechanical',
    'Mechanical Engineering',
    'JKKN Engineering College',
    'Mechanical course Tamil Nadu',
    'AICTE approved engineering',
    'NAAC accredited Mechanical',
    'Anna University',
    'Engineering admission',
    'Mechanical placements',
    'CAD CAM engineering',
    'Automobile Engineering',
    'Manufacturing Engineering',
    'Thermal Engineering',
    'Best engineering college Tamil Nadu',
    'Namakkal engineering college',
    'best college for mechanical engineering in tamilnadu',
    'mechanical engineering colleges in tamilnadu',
    'top 10 mechanical engineering colleges in tamilnadu',
    'top mechanical engineering colleges in tamilnadu',
    'mechanical engineering best colleges in tamilnadu',
    'mechanical and automation engineering colleges in tamilnadu',
    'top 20 mechanical engineering colleges in tamilnadu',
    'which college is best for mechanical engineering in tamilnadu',
    'be mechanical engineering colleges in tamilnadu',
  ],
  openGraph: {
    title: 'B.E. Mechanical Engineering | JKKN College',
    description:
      'Build your engineering career with B.E. Mechanical at JKKN. Industry-aligned learning framework, state-of-the-art learning labs, expert senior learners, and exceptional placement support with 95%+ placement rate.',
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
      'NAAC accredited, AICTE approved Mechanical Engineering program with 95%+ placement success. Transform your future with cutting-edge engineering education.',
    images: ['/images/courses/be-mech/labs/mech-lab-01.jpg'],
  },
}

export default function MechanicalCoursePage() {
  return (
    <>
      <BEMechanicalCourseSchema />
      <main>
        <BEMechanicalCoursePage {...beMechanicalCourseData} />
      </main>
    </>
  )
}
