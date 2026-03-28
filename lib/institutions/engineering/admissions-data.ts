import type { EligibilityCriteriaItem, AdmissionDateItem } from '@/lib/cms/registry-types'

// ─── Trust Stats ────────────────────────────────────────────────────────────

export interface TrustStat {
  label: string
  value: string
  verifiedOn: string
}

export const TRUST_STATS: TrustStat[] = [
  { label: 'Placement Rate', value: '92%+', verifiedOn: '2025' },
  { label: 'Accreditation', value: 'NAAC A', verifiedOn: '2024' },
  { label: 'Average Package', value: '₹3.5L', verifiedOn: '2025' },
]

// ─── Eligibility Criteria ────────────────────────────────────────────────────

export const ELIGIBILITY_CRITERIA: EligibilityCriteriaItem[] = [
  {
    program: 'B.E / B.Tech (All Branches)',
    qualification:
      '10+2 with Physics, Chemistry & Mathematics — 45% aggregate (40% for reserved categories)',
    ageLimit: '17–25 years (as of July 1)',
    otherRequirements:
      'TNEA Counselling rank or Direct Admission (Management Quota)',
    category: 'engineering',
  },
  {
    program: 'M.E Computer Science & Engineering',
    qualification:
      "Bachelor's degree in Engineering / Technology — minimum 50% marks",
    ageLimit: 'No upper limit',
    otherRequirements:
      'TANCET score preferred. Merit-based direct admission available',
    category: 'engineering',
  },
  {
    program: 'M.B.A (Master of Business Administration)',
    qualification:
      "Bachelor's degree in any discipline — minimum 50% marks",
    ageLimit: 'No upper limit',
    otherRequirements:
      'TANCET / CAT / MAT / XAT score. Group Discussion + Personal Interview',
    category: 'engineering',
  },
]

// ─── Admission Dates ─────────────────────────────────────────────────────────

export const ADMISSION_DATES: AdmissionDateItem[] = [
  {
    event: 'Application Portal Opens',
    date: 'April 1, 2026',
    status: 'upcoming',
  },
  {
    event: 'Last Date to Apply (Regular)',
    date: 'May 31, 2026',
    status: 'upcoming',
  },
  {
    event: 'TNEA Counselling (Anna University)',
    date: 'June – July 2026',
    status: 'upcoming',
  },
  {
    event: 'Direct / Management Quota Window',
    date: 'May 1 – July 31, 2026',
    status: 'upcoming',
  },
  {
    event: 'Classes Commence',
    date: 'August 2026',
    status: 'upcoming',
  },
]

// ─── Programs ────────────────────────────────────────────────────────────────

export interface EngineeringProgram {
  id: string
  name: string
  level: 'UG' | 'PG'
  duration: string
  seats: number
  specializations: string[]
  coursePageUrl: string
}

export const PROGRAMS: EngineeringProgram[] = [
  {
    id: 'be-cse',
    name: 'B.E Computer Science & Engineering',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    seats: 60,
    specializations: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing'],
    coursePageUrl: '/courses-offered/ug/be-cse',
  },
  {
    id: 'be-eee',
    name: 'B.E Electrical & Electronics Engineering',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    seats: 60,
    specializations: ['Power Systems', 'Smart Grid', 'Industrial Automation'],
    coursePageUrl: '/courses-offered/ug/be-eee',
  },
  {
    id: 'be-ece',
    name: 'B.E Electronics & Communication Engineering',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    seats: 60,
    specializations: ['VLSI Design', 'Embedded Systems', 'Telecommunications'],
    coursePageUrl: '/courses-offered/ug/be-ece',
  },
  {
    id: 'be-mechanical',
    name: 'B.E Mechanical Engineering',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    seats: 120,
    specializations: ['CAD/CAM', 'Thermal Engineering', 'Manufacturing Technology'],
    coursePageUrl: '/courses-offered/ug/be-mechanical',
  },
  {
    id: 'btech-it',
    name: 'B.Tech Information Technology',
    level: 'UG',
    duration: '4 Years (8 Semesters)',
    seats: 60,
    specializations: ['Networking', 'Cybersecurity', 'Web Technologies'],
    coursePageUrl: '/courses-offered/ug/btech-it',
  },
  {
    id: 'me-cse',
    name: 'M.E Computer Science & Engineering',
    level: 'PG',
    duration: '2 Years (4 Semesters)',
    seats: 60,
    specializations: ['Advanced Algorithms', 'Data Science', 'Network Security'],
    coursePageUrl: '/courses-offered/pg/me-cse',
  },
  {
    id: 'mba',
    name: 'M.B.A — Master of Business Administration',
    level: 'PG',
    duration: '2 Years (4 Semesters)',
    seats: 120,
    specializations: ['Finance', 'Marketing', 'Human Resource Management'],
    coursePageUrl: '/courses-offered/pg/mba',
  },
]

// ─── Fee Structure ───────────────────────────────────────────────────────────

export interface FeeEntry {
  program: string
  annualTuition: number
  hostelFee: number
}

export const FEE_STRUCTURE: FeeEntry[] = [
  { program: 'B.E / B.Tech (all branches)', annualTuition: 95000, hostelFee: 60000 },
  { program: 'M.E Computer Science & Engineering', annualTuition: 85000, hostelFee: 60000 },
  { program: 'M.B.A', annualTuition: 80000, hostelFee: 60000 },
]

// ─── Scholarships ────────────────────────────────────────────────────────────

export interface ScholarshipScheme {
  id: string
  name: string
  icon: 'Trophy' | 'Building2' | 'Heart' | 'Award'
  benefit: string
  eligibility: string
  ctaUrl?: string
}

export const SCHOLARSHIPS: ScholarshipScheme[] = [
  {
    id: 'merit',
    name: 'Merit Scholarship',
    icon: 'Trophy',
    benefit: 'Up to 100% tuition fee waiver',
    eligibility: '90%+ in 10+2 or state / national rank holders',
    ctaUrl: '/admissions/engineering#contact',
  },
  {
    id: 'government',
    name: 'Government Scholarship',
    icon: 'Building2',
    benefit: 'Direct bank transfer — full / partial',
    eligibility: 'SC / ST / OBC / MBC / EWS / Minority categories',
    ctaUrl: 'https://www.scholarship.gov.in/',
  },
  {
    id: 'need-based',
    name: 'Need-Based Financial Aid',
    icon: 'Heart',
    benefit: 'Up to 50% tuition fee reduction',
    eligibility: 'Family annual income below ₹2.5L',
    ctaUrl: '/admissions/engineering#contact',
  },
  {
    id: 'sports-cultural',
    name: 'Sports & Cultural Scholarship',
    icon: 'Award',
    benefit: 'Special seat quota + fee benefit',
    eligibility: 'State / National level achievers in sports or arts',
    ctaUrl: '/admissions/engineering#contact',
  },
]

// ─── FAQs ────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string
  answer: string
  audience: 'student' | 'parent'
}

export const FAQS: FAQItem[] = [
  {
    question: 'What is the eligibility for B.E / B.Tech admission?',
    answer:
      'You must have passed 10+2 with Physics, Chemistry and Mathematics with a minimum of 45% aggregate marks (40% for SC/ST/OBC reserved categories). Admission is through TNEA (Tamil Nadu Engineering Admissions) counselling or direct admission under the Management Quota.',
    audience: 'student',
  },
  {
    question: 'How does TNEA counselling work for engineering seats?',
    answer:
      'TNEA is conducted by Anna University. After registering on the TNEA portal, a merit rank is generated based on your 10+2 marks. You then participate in online counselling, choose JKKN College of Engineering as your preferred college, and seats are allotted based on rank and availability.',
    audience: 'student',
  },
  {
    question: 'Is there a management quota for direct admission?',
    answer:
      'Yes. A limited number of seats are available under the Management Quota for direct admission. Candidates must meet the minimum eligibility criteria (10+2 with PCM, 45%+). Contact the admissions office at +91 93458 55001 for seat availability and the direct admission process.',
    audience: 'student',
  },
  {
    question: 'What entrance exams are accepted for M.E / MBA?',
    answer:
      'For M.E, a TANCET score is preferred. For MBA, we accept TANCET, CAT, MAT, or XAT scores. Direct merit-based admission is also available. Shortlisted candidates will be called for a Group Discussion and Personal Interview.',
    audience: 'student',
  },
  {
    question: 'Can students from outside Tamil Nadu apply?',
    answer:
      'Yes, students from all states are welcome. Out-of-state candidates can apply through the Management Quota or NRI quota. TNEA counselling is primarily for Tamil Nadu state students. Contact the admissions office for the complete out-of-state admission procedure.',
    audience: 'student',
  },
  {
    question: 'What is the total cost of education including hostel?',
    answer:
      'For B.E / B.Tech programs, the annual tuition fee is ₹95,000. Hostel accommodation (optional, all-inclusive with meals and utilities) is ₹60,000 per year. Scholarships can significantly reduce the tuition fee — approximately 75% of our students receive some form of financial aid.',
    audience: 'parent',
  },
  {
    question: 'What percentage of students get placed after graduation?',
    answer:
      'JKKN College of Engineering maintains a 92%+ placement rate (verified by our Placement Committee, 2025). Our top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, and 500+ companies. The average salary package is ₹3.5L per annum with the highest at ₹8.5L+.',
    audience: 'parent',
  },
  {
    question: 'Is the campus safe? What are the hostel facilities?',
    answer:
      'Campus safety is our top priority. The campus has 24/7 CCTV surveillance, security personnel, and a controlled entry gate. Separate hostels for boys and girls include Wi-Fi, hygienic mess (3 meals/day), recreation areas, and regular health check-ups. An on-campus medical clinic is always available.',
    audience: 'parent',
  },
  {
    question: 'Are there scholarships for financially weaker families?',
    answer:
      'Yes. JKKN offers Need-Based Financial Aid for families with annual income below ₹2.5L, providing up to 50% tuition fee reduction. Government scholarships (SC/ST/OBC/MBC/EWS/Minority) are fully supported with direct bank transfer. Around 75% of our students receive some form of financial aid.',
    audience: 'parent',
  },
  {
    question: 'How do I contact the admissions office?',
    answer:
      'Phone: +91 93458 55001 | Email: admissions@jkkn.ac.in | Campus: Natarajapuram, NH-544 (Salem–Coimbatore Highway), Komarapalayam, Namakkal District, Tamil Nadu — 638183. Office hours: Monday to Saturday, 9 AM to 5 PM.',
    audience: 'parent',
  },
]
