import type { EligibilityCriteriaItem, AdmissionDateItem } from '@/lib/cms/registry-types'

// ─── Trust Stats (kept for backward-compat) ──────────────────────────────────

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

// ─── Overview ────────────────────────────────────────────────────────────────

export const OVERVIEW =
  'JKKN College of Engineering and Technology (JKKNCET) offers admissions to undergraduate (B.E / B.Tech) and postgraduate (M.E & MBA) programmes. Admissions are governed by TNEA counselling administered by Anna University, Chennai, and direct admission under Management Quota as per AICTE and Tamil Nadu Government norms.The college is AICTE approved, NAAC Accredited, and Autonomous — affiliated to Anna University. Students benefit from a placement-oriented curriculum, experienced faculty, state-of-the-art laboratories, and fully-residential hostel facilities for boys and girls.'

// ─── Programmes Table ────────────────────────────────────────────────────────

export interface ProgramTableRow {
  programme: string
  duration: string
  intake: number
  annualFee: number
  level: 'UG' | 'PG'
}

export const PROGRAMS_TABLE: ProgramTableRow[] = [
  {
    programme: 'B.E Computer Science & Engineering',
    duration: '4 Years',
    intake: 60,
    annualFee: 80000,
    level: 'UG',
  },
  {
    programme: 'B.E Electrical & Electronics Engineering',
    duration: '4 Years',
    intake: 60,
    annualFee: 45000,
    level: 'UG',
  },
  {
    programme: 'B.E Electronics & Communication Engineering',
    duration: '4 Years',
    intake: 60,
    annualFee: 70000,
    level: 'UG',
  },
  {
    programme: 'B.E Mechanical Engineering',
    duration: '4 Years',
    intake: 60,
    annualFee: 45000,
    level: 'UG',
  },
  {
    programme: 'B.Tech Information Technology',
    duration: '4 Years',
    intake: 60,
    annualFee: 80000,
    level: 'UG',
  },
  {
    programme: 'M.E Computer Science & Engineering',
    duration: '2 Years',
    intake: 12,
    annualFee: 30000,
    level: 'PG',
  },
  {
    programme: 'M.B.A — Master of Business Administration',
    duration: '2 Years',
    intake: 60,
    annualFee: 65000,
    level: 'PG',
  },
]

// ─── Eligibility Criteria (CMS block — kept for backward-compat) ──────────────

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

// ─── Detailed Eligibility (pharmacy-style, per programme) ────────────────────

export interface DetailedEligibilityItem {
  programme: string
  criteria: string[]
}

export const DETAILED_ELIGIBILITY: DetailedEligibilityItem[] = [
  {
    programme: 'For B.E / B.Tech — All Branches',
    criteria: [
      'Passed 10+2 (HSC) with Physics, Chemistry, and Mathematics from a recognized Board',
      'Minimum 45% aggregate marks (40% for SC / ST / OBC / MBC reserved categories)',
      'Admission through TNEA counselling (Anna University) or direct Management Quota',
      'Age: 17–25 years as of July 1 of the admission year',
    ],
  },
  {
    programme: 'For M.E Computer Science & Engineering',
    criteria: [
      'B.E / B.Tech in a relevant Engineering discipline from a recognized university',
      'Minimum 50% aggregate marks in the qualifying degree',
      'TANCET score preferred; direct merit-based admission also available',
      'Must satisfy subject equivalency norms as per Anna University regulations',
    ],
  },
  {
    programme: 'For M.B.A — Master of Business Administration',
    criteria: [
      "Bachelor's degree in any discipline from a recognized university",
      'Minimum 50% aggregate marks in the qualifying degree',
      'Valid score in TANCET / CAT / MAT / XAT (any one)',
      'Shortlisted candidates appear for Group Discussion (GD) + Personal Interview (PI)',
    ],
  },
]

// ─── Admission Steps ─────────────────────────────────────────────────────────

export interface AdmissionStep {
  number: number
  title: string
  description: string
}

export const ADMISSION_STEPS: AdmissionStep[] = [
  {
    number: 1,
    title: 'Check Eligibility',
    description:
      'Review the eligibility criteria for your chosen programme. Confirm you meet the minimum educational qualification, marks percentage, and age requirements before applying.',
  },
  {
    number: 2,
    title: 'Fill Application Form',
    description:
      'Apply online via the JKKN Admissions Portal or collect and submit the printed application form at the campus admissions counter. No application fee is charged.',
  },
  {
    number: 3,
    title: 'Submit Required Documents',
    description:
      'Upload clear scanned copies of all required academic and personal documents with your online application. Physical originals must be produced during in-person verification.',
  },
  {
    number: 4,
    title: 'Application Screening',
    description:
      'The admissions team verifies eligibility and document completeness. You will receive notification of your screening result within 3 working days of submission.',
  },
  {
    number: 5,
    title: 'Counselling & Selection',
    description:
      'UG candidates attend TNEA counselling conducted by Anna University. Management Quota and PG candidates attend direct counselling / GD+PI at the JKKN campus.',
  },
  {
    number: 6,
    title: 'Fee Payment & Enrolment',
    description:
      'Complete fee payment via DD, NEFT, or online transfer. Submit original documents for university verification, collect your enrolment confirmation and student ID card.',
  },
]

// ─── Process Guidelines ──────────────────────────────────────────────────────

export const PROCESS_GUIDELINES: string[] = [
  'The college follows Tamil Nadu Government and AICTE reservation norms and fee regulations strictly. No donation or capitation fee is charged.',
  'Admission is provisional until Anna University verifies original documents and confirms eligibility for the programme.',
  'Admissions will be cancelled without notice if submitted documents are found to be forged or incorrect.',
  'Fees paid are non-refundable after enrolment except as per AICTE / Government guidelines for seat cancellation.',
  'Under Management Quota, seats are allotted on a merit-cum-preference basis — no assurance of a specific preferred branch.',
  'Direct admission (Management Quota) windows open concurrently with TNEA counselling. Contact the admissions office for current seat availability.',
]

// ─── Required Documents ──────────────────────────────────────────────────────

export interface DocumentItem {
  name: string
  note?: string
}

export const REQUIRED_DOCUMENTS: {
  common: DocumentItem[]
  ugOnly: DocumentItem[]
  pgOnly: DocumentItem[]
} = {
  common: [
    { name: '10th Standard Marksheet & Passing Certificate' },
    { name: 'Transfer Certificate (TC)' },
    { name: 'Community Certificate' },
    { name: 'Passport Size Photographs', note: '6 copies, recent' },
    { name: 'Conduct Certificate', note: 'From last institution attended' },
    { name: 'Aadhaar Card', note: 'Self + parent' },
    { name: 'Income Certificate', note: 'Required for scholarship application' },
  ],
  ugOnly: [
    { name: '12th Standard (HSC) Marksheet & Certificate' },
    { name: 'Eligibility Certificate', note: 'If from a different state Board' },
    { name: 'TNEA Rank Card / Allotment Order', note: 'For TNEA counselling seats' },
    { name: 'Special Category Certificate', note: 'Sports / Ex-serviceman / NCC, if applicable' },
  ],
  pgOnly: [
    { name: 'Degree Certificate & Consolidated Marksheet' },
    { name: 'TANCET / CAT / MAT / XAT Score Card' },
    { name: 'Character Certificate', note: 'From graduating college' },
    { name: 'Migration Certificate', note: 'If from outside Tamil Nadu' },
  ],
}

// ─── Fee Structure ────────────────────────────────────────────────────────────

export interface FeeEntry {
  program: string
  gqFee: number
  mqFee: number
  category: 'UG' | 'PG' | 'Lateral Entry'
}

export const FEE_STRUCTURE: FeeEntry[] = [
  // Engineering UG
  { program: 'CSE', gqFee: 65000, mqFee: 80000, category: 'UG' },
  { program: 'B.Tech IT', gqFee: 65000, mqFee: 80000, category: 'UG' },
  { program: 'ECE', gqFee: 60000, mqFee: 70000, category: 'UG' },
  { program: 'EEE', gqFee: 45000, mqFee: 45000, category: 'UG' },
  { program: 'MECH', gqFee: 45000, mqFee: 45000, category: 'UG' },
  // Engineering PG
  { program: 'MBA', gqFee: 65000, mqFee: 65000, category: 'PG' },
  { program: 'ME CSE', gqFee: 30000, mqFee: 30000, category: 'PG' },
  // Engineering Lateral Entry
  { program: 'CSE', gqFee: 50000, mqFee: 60000, category: 'Lateral Entry' },
  { program: 'B.Tech IT', gqFee: 50000, mqFee: 60000, category: 'Lateral Entry' },
  { program: 'ECE', gqFee: 50000, mqFee: 60000, category: 'Lateral Entry' },
  { program: 'EEE', gqFee: 50000, mqFee: 60000, category: 'Lateral Entry' },
  { program: 'MECH', gqFee: 50000, mqFee: 60000, category: 'Lateral Entry' },
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
    event: 'Document Verification',
    date: 'July – August 2026',
    status: 'upcoming',
  },
  {
    event: 'Fee Payment Deadline',
    date: 'August 15, 2026',
    status: 'upcoming',
  },
  {
    event: 'Classes Commence',
    date: 'August 2026 (as per Anna University)',
    status: 'upcoming',
  },
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
    ctaUrl: '/admissions#contact',
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
    ctaUrl: '/admissions#contact',
  },
  {
    id: 'sports-cultural',
    name: 'Sports & Cultural Scholarship',
    icon: 'Award',
    benefit: 'Special seat quota + fee benefit',
    eligibility: 'State / National level achievers in sports or arts',
    ctaUrl: '/admissions#contact',
  },
]

// ─── Scholarship Sections (pharmacy-style grouped display) ───────────────────

export interface ScholarshipGroup {
  title: string
  description: string
  schemes: { name: string; benefit: string; eligibility: string; ctaUrl?: string }[]
}

export const SCHOLARSHIP_GROUPS: ScholarshipGroup[] = [
  {
    title: 'Government Scholarships (SC/SCA/ST/BC-CC)',
    description:
      'Funded by Tamil Nadu and Central Government schemes for Government Quota (GQ) students. Our admissions office assists with the complete application process at no charge.',
    schemes: [
      {
        name: 'PMSS (Community Scholarship)',
        benefit: 'BE/BTech: ₹50,000/Yr · MBA: ₹35,000/Yr · ME: ₹50,000/Yr',
        eligibility: 'SC/SCA/ST/BC-CC category students admitted under Government Quota (GQ)',
      },
      {
        name: 'Maintenance Scholarship',
        benefit: '₹5,000–₹10,000/Yr (all courses)',
        eligibility: 'SC/SCA/ST/BC-CC category GQ students for sustenance support',
      },
      {
        name: 'Community Scholarship (BC/MBC/DNC/BCM)',
        benefit: '₹5,000–₹10,000/Yr (all courses)',
        eligibility: 'BC, MBC, DNC, and BCM category students under Government Quota',
      },
      {
        name: 'First Graduate Scholarship',
        benefit: 'BE/BTech: ₹25,000/Yr',
        eligibility: 'First-generation college graduates admitted under Government Quota',
      },
    ],
  },
  {
    title: 'Trust Scholarship (Merit-Based)',
    description:
      'Awarded by JKKN Trust directly to academically outstanding students. Available for both Management Quota (MQ) and Government Quota (GQ) admissions.',
    schemes: [
      {
        name: 'JKKN Trust Merit Scholarship',
        benefit: 'BE/BTech: ₹5,000 to 100% tuition fee waiver/Yr',
        eligibility: 'High-performing students based on academic merit (MQ & GQ eligible)',
      },
    ],
  },
  {
    title: 'Naan Mudhalvan & Special Category',
    description:
      'Tamil Nadu Government initiative and dedicated support for students from Govt/Govt-aided schools (Class 6–12, Tamil medium) and other special categories.',
    schemes: [
      {
        name: 'Naan Mudhalvan Scholarship',
        benefit: 'BE/BTech: ₹1,000/month (₹12,000/Yr)',
        eligibility: 'Boys & Girls from Govt/Govt-aided schools (6th–12th Std), Tamil medium',
      },
      {
        name: 'Sports & Cultural Achievement',
        benefit: 'Special seat quota + fee benefit',
        eligibility: 'State / National level achievers (certificate from competent authority)',
      },
      {
        name: 'Need-Based Financial Aid',
        benefit: 'Up to 50% tuition fee reduction',
        eligibility: 'Family annual income below ₹2.5 lakhs (income certificate required)',
        ctaUrl: '/admissions#contact',
      },
    ],
  },
]

// ─── Contact Info ────────────────────────────────────────────────────────────

export interface ContactItem {
  type: 'phone' | 'email' | 'whatsapp'
  label: string
  displayValue: string
  href: string
  note: string
}

export const CONTACT_INFO: ContactItem[] = [
  {
    type: 'phone',
    label: 'Call Us',
    displayValue: '+91 93458 55001',
    href: 'tel:+919345855001',
    note: 'Mon – Sat, 9 AM – 5 PM',
  },
  {
    type: 'email',
    label: 'Email Us',
    displayValue: 'engg@jkkn.ac.in',
    href: 'mailto:engg@jkkn.ac.in',
    note: 'Reply within 24 hours',
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    displayValue: '+91 93458 55001',
    href: 'https://wa.me/919345855001',
    note: 'Quick response, 9 AM – 7 PM',
  },
]

// ─── Programs (kept for backward-compat) ─────────────────────────────────────

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
    seats: 60,
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
    seats: 12,
    specializations: ['Advanced Algorithms', 'Data Science', 'Network Security'],
    coursePageUrl: '/courses-offered/pg/me-cse',
  },
  {
    id: 'mba',
    name: 'M.B.A — Master of Business Administration',
    level: 'PG',
    duration: '2 Years (4 Semesters)',
    seats: 60,
    specializations: ['Finance', 'Marketing', 'Human Resource Management'],
    coursePageUrl: '/courses-offered/pg/mba',
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
    question: 'What is the application fee for pharmacy programmes?',
    answer:
      'There is no application fee. Apply online at the JKKN Admissions Portal or directly at the campus admissions office free of charge.',
    audience: 'student',
  },
  {
    question: 'What is the eligibility for B.E / B.Tech admission?',
    answer:
      'You must have passed 10+2 with Physics, Chemistry and Mathematics with a minimum of 45% aggregate marks (40% for SC/ST/OBC reserved categories). Admission is through TNEA (Tamil Nadu Engineering Admissions) counselling or direct admission under Management Quota.',
    audience: 'student',
  },
  {
    question: 'Can I apply for multiple programmes with one application?',
    answer:
      'Yes. You may indicate your programme preference order during TNEA counselling. For Management Quota, contact the admissions office to check availability across programmes.',
    audience: 'student',
  },
  {
    question: 'How does TNEA counselling work for engineering seats?',
    answer:
      'TNEA is conducted by Anna University. After registering on the TNEA portal, a merit rank is generated based on your 10+2 marks. You participate in online counselling, choose JKKN College of Engineering as your preferred college, and seats are allotted based on rank and availability.',
    audience: 'student',
  },
  {
    question: 'Is it mandatory to appear for TNEA for UG admission?',
    answer:
      'For government quota seats, TNEA counselling is mandatory. However, Management Quota seats are available for direct admission — contact the admissions office for current availability.',
    audience: 'student',
  },
  {
    question: 'Can I get admission after the last date?',
    answer:
      'Late applications may be considered subject to seat availability, especially under Management Quota. Contact the admissions office directly to check if seats are still open.',
    audience: 'student',
  },
  {
    question: 'How are case seats allocated for different categories?',
    answer:
      'Seats are allocated strictly as per Tamil Nadu Government and AICTE reservation norms: General, BC, MBC/DNC, SC/ST, and other categories. Sports, NCC, and Ex-serviceman quotas are also available as per government guidelines.',
    audience: 'student',
  },
  {
    question: 'What documents are needed for B.E / B.Tech admission?',
    answer:
      '10th and 12th marksheets, Transfer Certificate, Community Certificate, 6 passport photos, Conduct Certificate, Aadhaar Card, TNEA Rank Card (for counselling seats), and Income Certificate (for scholarships). PG candidates additionally need Degree Certificate, consolidated marksheet, and entrance score card.',
    audience: 'student',
  },
  {
    question: 'What is the total cost of education including hostel?',
    answer:
      'B.E / B.Tech annual tuition ranges from ₹45,000 (EEE / MECH) to ₹80,000 (CSE / IT Management Quota), depending on branch and quota (Government or Management). Hostel accommodation (optional, all-inclusive with meals and utilities) is ₹60,000 per year. Scholarships can significantly reduce tuition costs; approximately 75% of students receive some form of financial aid.',
    audience: 'parent',
  },
  {
    question: 'What percentage of students get placed after graduation?',
    answer:
      'JKKN College of Engineering maintains a 92%+ placement rate (verified 2025). Top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, and 500+ companies. Average package: ₹3.5L per annum; highest: ₹8.5L+.',
    audience: 'parent',
  },
  {
    question: 'Is the campus safe? What are the hostel facilities?',
    answer:
      'The campus has 24/7 CCTV surveillance, security personnel, and controlled entry. Separate hostels for boys and girls include Wi-Fi, hygienic mess (3 meals/day), recreation areas, and health check-ups. An on-campus medical clinic is available at all times.',
    audience: 'parent',
  },
  {
    question: 'Are there scholarships for financially weaker families?',
    answer:
      'Yes. Need-Based Financial Aid is available for families with annual income below ₹2.5L — up to 50% tuition reduction. Government scholarships (SC/ST/OBC/MBC/EWS/Minority) are supported with direct bank transfer. Around 75% of students receive some form of financial aid.',
    audience: 'parent',
  },
]
