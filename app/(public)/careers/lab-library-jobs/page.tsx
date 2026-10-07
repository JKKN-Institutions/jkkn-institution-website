import {
  DesignationLanding, designationMetadata, type DesignationConfig,
} from '@/components/public/careers/designation-landing'

// List page for lab assistant, lab technician and librarian searches near
// Erode and Namakkal. Jobs come from the cached MyJKKN feed. Main site only.
// This static segment takes precedence over /careers/[id].
export const dynamic = 'force-dynamic'

const CONFIG: DesignationConfig = {
  key: 'lab-library',
  path: '/careers/lab-library-jobs',
  title: 'Lab Assistant & Librarian Jobs in Namakkal | JKKN Careers',
  description:
    'Lab Assistant, Lab Technician and Librarian jobs at JKKN Institutions, Komarapalayam, Namakkal District, 18 km from Erode. Apply online.',
  h1: 'Lab Assistant, Lab Technician and Librarian Jobs at JKKN Institutions, Komarapalayam',
  crumb: 'Lab and Library Jobs',
  noun: 'Lab and library',
  introTail: 'The list covers Lab Assistant, Lab Technician and Librarian posts at the JKKN colleges.',
  lead: 'Lab and library vacancies at the JKKN colleges',
}

export const generateMetadata = () => designationMetadata(CONFIG)

export default function LabLibraryJobsPage() {
  return <DesignationLanding config={CONFIG} />
}
