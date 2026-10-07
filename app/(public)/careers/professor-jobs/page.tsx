import {
  DesignationLanding, designationMetadata, type DesignationConfig,
} from '@/components/public/careers/designation-landing'

// List page for Professor and Associate Professor posts, grouped by college.
// Jobs come from the cached MyJKKN feed. Main site only. This static segment
// takes precedence over /careers/[id].
export const dynamic = 'force-dynamic'

const CONFIG: DesignationConfig = {
  key: 'professor',
  path: '/careers/professor-jobs',
  title: 'Professor Jobs in Namakkal, near Erode | JKKN Careers',
  description:
    'Professor and Associate Professor jobs at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode. Apply online.',
  h1: 'Professor and Associate Professor Jobs at JKKN Institutions, Komarapalayam',
  crumb: 'Professor Jobs',
  noun: 'Professor and Associate Professor',
  introTail: 'The list covers Professor and Associate Professor posts across the JKKN colleges.',
  lead: 'Professor and Associate Professor vacancies across the JKKN colleges',
}

export const generateMetadata = () => designationMetadata(CONFIG)

export default function ProfessorJobsPage() {
  return <DesignationLanding config={CONFIG} />
}
