import {
  DesignationLanding, designationMetadata, type DesignationConfig,
} from '@/components/public/careers/designation-landing'

// List page for "assistant professor jobs" searches near Erode and Namakkal.
// Jobs come from the cached MyJKKN feed, grouped by college. Main site only.
// This static segment takes precedence over /careers/[id].
export const dynamic = 'force-dynamic'

const CONFIG: DesignationConfig = {
  key: 'assistant-professor',
  path: '/careers/assistant-professor-jobs',
  title: 'Assistant Professor Jobs in Namakkal, near Erode | JKKN',
  description:
    'Assistant Professor jobs at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode. Openings across JKKN colleges. Apply online.',
  h1: 'Assistant Professor Jobs at JKKN Institutions, Komarapalayam, Namakkal District',
  crumb: 'Assistant Professor Jobs',
  noun: 'Assistant Professor',
  introTail:
    'The openings are spread across the JKKN colleges of engineering, arts and science, allied health sciences, pharmacy, education, nursing and dentistry.',
  lead: 'Assistant Professor vacancies across the JKKN colleges',
}

export const generateMetadata = () => designationMetadata(CONFIG)

export default function AssistantProfessorJobsPage() {
  return <DesignationLanding config={CONFIG} />
}
