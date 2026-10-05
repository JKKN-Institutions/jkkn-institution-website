import type { PublicJob } from '@/lib/schemas/public-careers'

let seq = 0

/** A PublicJob with sensible defaults; ids and job codes are unique per call. */
export function makeJob(overrides: Partial<PublicJob> = {}): PublicJob {
  seq += 1
  const n = String(seq).padStart(4, '0')
  return {
    id: `${n}aaaa-1111-4111-8111-111111111111`.padStart(36, '0'),
    job_code: `Job__17000${n}0`,
    title: 'Assistant Professor',
    role_category: 'teaching_faculty',
    job_type: 'full_time',
    description: 'Teach undergraduate courses.',
    institution: { id: 'inst-engg', name: 'JKKN College of Engineering and Technology' },
    department: null,
    city: 'Kumarapalayam',
    state: 'Tamil Nadu',
    country: 'India',
    education_level: null,
    min_experience_years: null,
    max_experience_years: null,
    qualifications: [],
    skills: [],
    positions_open: 1,
    posted_at: '2026-01-10T00:00:00Z',
    closes_at: null,
    salary: null,
    ...overrides,
  }
}

const dept = (name: string) => ({ id: `dept-${name}`, name })
const PHARMACY = { id: 'inst-pharm', name: 'JKKN College of Pharmacy' }
const NURSING = { id: 'inst-nursing', name: 'JKKN College of Nursing and Research' }
const OFFICE = { id: 'inst-office', name: 'JKKN Main Office' }

/** A small board shaped like the live feed: shouted titles, sparse fields, free-text degrees. */
export function sampleJobs(): PublicJob[] {
  return [
    makeJob({
      title: 'Assistant Professor — Computer Science & Engineering',
      department: dept('Computer Science and Engineering'),
      qualifications: ['M.E. / M.Tech in CSE or related discipline', 'Ph.D. (completed or pursuing) preferred'],
      min_experience_years: 2, max_experience_years: 8,
      description: 'Teach programming, data structures and Python to undergraduate students.',
      posted_at: '2026-09-20T00:00:00Z',
    }),
    makeJob({
      title: 'PROFESSOR',
      department: dept('Computer Science and Engineering'),
      qualifications: ['M.E., Ph.D'],
      min_experience_years: 12,
      posted_at: '2025-03-01T00:00:00Z',
    }),
    makeJob({
      title: 'PROFESSOR',
      institution: PHARMACY,
      department: dept('Pharmaceutics'),
      qualifications: ['M.Pharma., Ph.D'],
      min_experience_years: 5, max_experience_years: 10,
    }),
    makeJob({
      title: 'Assistant Professor',
      institution: PHARMACY,
      department: dept('Pharmaceutics'),
      qualifications: ['M.Pharm'],
      min_experience_years: 0, max_experience_years: 5,
    }),
    makeJob({
      title: 'Nursing Tutor',
      institution: NURSING,
      qualifications: ['B.Sc Nursing'],
      min_experience_years: 1,
      description: 'Clinical teaching for nursing students.',
    }),
    makeJob({
      title: 'Human Resources Coordinator(HR)',
      role_category: 'non_teaching',
      institution: OFFICE,
      qualifications: ['M.B.A.'],
      min_experience_years: 0, max_experience_years: 3,
      description: 'Run recruitment drives and onboarding.',
    }),
    makeJob({
      title: 'SYSTEM ADMIN',
      role_category: 'non_teaching',
      institution: OFFICE,
      job_code: null,
      posted_at: null,
      description: 'Maintain campus servers and networks.',
    }),
    makeJob({
      title: 'Principal JKKN College of Pharmacy',
      role_category: 'senior_leadership',
      institution: PHARMACY,
      qualifications: ['Ph.D'],
      education_level: 'phd',
      min_experience_years: 15,
    }),
  ]
}
