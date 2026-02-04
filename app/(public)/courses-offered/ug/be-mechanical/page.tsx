import { BEMechanicalCoursePage } from '@/components/cms-blocks/content/be-mechanical-course-page'
import { beMechanicalCourseData } from '@/lib/cms/templates/engineering/be-mechanical-data'
import type { Metadata } from 'next'

/**
 * B.E. Mechanical Engineering Course Page
 * JKKN College of Engineering & Technology
 * Route: /courses-offered/ug/be-mechanical
 */

export const metadata: Metadata = {
  title: 'B.E. Mechanical Engineering | JKKN College of Engineering',
  description:
    'Pursue B.E. in Mechanical Engineering at JKKN College of Engineering & Technology. NAAC accredited, AICTE approved 4-year program with 95%+ placement record. Industry-aligned curriculum covering Thermal Engineering, Manufacturing, CAD/CAM, Automobile Engineering, and Robotics.',
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
  ],
  openGraph: {
    title: 'B.E. Mechanical Engineering | JKKN College',
    description:
      'Build your engineering career with B.E. Mechanical at JKKN. Industry-aligned curriculum, state-of-the-art labs, expert faculty, and exceptional placement support with 95%+ placement rate.',
    type: 'website',
    images: [
      {
        url: 'https://placehold.co/1200x630/0b6d41/ffffff?text=JKKN+Mechanical+Engineering',
        width: 1200,
        height: 630,
        alt: 'JKKN Mechanical Engineering Laboratory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B.E. Mechanical Engineering | JKKN',
    description:
      'NAAC accredited, AICTE approved Mechanical Engineering program with 95%+ placement success. Transform your future with cutting-edge engineering education.',
    images: ['https://placehold.co/1200x630/0b6d41/ffffff?text=JKKN+Mechanical+Engineering'],
  },
}

export default function MechanicalCoursePage() {
  return (
    <main>
      <BEMechanicalCoursePage {...beMechanicalCourseData} />
    </main>
  )
}
