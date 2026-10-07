import {
  DesignationLanding, designationMetadata, type DesignationConfig,
} from '@/components/public/careers/designation-landing'

// List page for "lecturer jobs" searches near Erode and Namakkal: Lecturer,
// Senior Lecturer and Reader posts. Jobs come from the cached MyJKKN feed,
// grouped by college. Main site only. Takes precedence over /careers/[id].
export const dynamic = 'force-dynamic'

const CONFIG: DesignationConfig = {
  key: 'lecturer',
  path: '/careers/lecturer-jobs',
  title: 'Lecturer Jobs in Namakkal, near Erode | JKKN Careers',
  description:
    'Lecturer, Senior Lecturer and Reader jobs at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode. Apply online.',
  h1: 'Lecturer, Senior Lecturer and Reader Jobs at JKKN Institutions, Komarapalayam',
  crumb: 'Lecturer Jobs',
  noun: 'Lecturer and Reader',
  introTail: 'The list covers Lecturer, Senior Lecturer and Reader posts.',
  lead: 'Lecturer, Senior Lecturer and Reader vacancies at the JKKN colleges',
}

export const generateMetadata = () => designationMetadata(CONFIG)

export default function LecturerJobsPage() {
  return <DesignationLanding config={CONFIG} />
}
