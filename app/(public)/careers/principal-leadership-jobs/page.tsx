import {
  DesignationLanding, designationMetadata, type DesignationConfig,
} from '@/components/public/careers/designation-landing'

// List page for Principal, Vice Principal and group leadership posts.
// Jobs come from the cached MyJKKN feed. Main site only. This static segment
// takes precedence over /careers/[id].
export const dynamic = 'force-dynamic'

const CONFIG: DesignationConfig = {
  key: 'leadership',
  path: '/careers/principal-leadership-jobs',
  title: 'Principal & Leadership Jobs in Namakkal | JKKN Careers',
  description:
    'Principal, Vice Principal and leadership jobs at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode. Apply online.',
  h1: 'Principal and Leadership Jobs at JKKN Institutions, Komarapalayam',
  crumb: 'Principal and Leadership Jobs',
  noun: 'Principal and leadership',
  introTail: 'The list covers Principal and Vice Principal posts at the JKKN colleges and school, and group leadership posts.',
  lead: 'Principal, Vice Principal and leadership vacancies at JKKN Institutions',
}

export const generateMetadata = () => designationMetadata(CONFIG)

export default function PrincipalLeadershipJobsPage() {
  return <DesignationLanding config={CONFIG} />
}
