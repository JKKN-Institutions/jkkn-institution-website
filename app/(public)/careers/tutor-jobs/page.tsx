import {
  DesignationLanding, designationMetadata, type DesignationConfig,
} from '@/components/public/careers/designation-landing'

// List page for Tutor posts, grouped by college.
// Jobs come from the cached MyJKKN feed. Main site only. This static segment
// takes precedence over /careers/[id].
export const dynamic = 'force-dynamic'

const CONFIG: DesignationConfig = {
  key: 'tutor',
  path: '/careers/tutor-jobs',
  title: 'Tutor Jobs in Namakkal, near Erode | JKKN Careers',
  description:
    'Tutor jobs at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode. Openings across JKKN colleges. Apply online.',
  h1: 'Tutor Jobs at JKKN Institutions, Komarapalayam, Namakkal District',
  crumb: 'Tutor Jobs',
  noun: 'Tutor',
  introTail: 'The Tutor posts are at the JKKN colleges of allied health sciences, pharmacy, nursing, dentistry and others.',
  lead: 'Tutor vacancies across the JKKN colleges',
}

export const generateMetadata = () => designationMetadata(CONFIG)

export default function TutorJobsPage() {
  return <DesignationLanding config={CONFIG} />
}
