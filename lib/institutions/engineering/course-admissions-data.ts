import { Cpu, Zap, Antenna, Cog, Code2, Server, Briefcase } from 'lucide-react'
import type { CourseAdmissionData } from '@/components/public/admissions/course-admission-page'

const APPLY_URL = 'https://www.jkkn.ai/apply/jkkn-admission-2026'
const APPLY_DEADLINE = 'May 31, 2026'

// ─── Shared building blocks ──────────────────────────────────────────────────

const UG_ELIGIBILITY_BASE = [
  'Passed 10+2 (HSC) with Physics, Chemistry, and Mathematics from a recognized board',
  'Minimum 45% aggregate marks (40% for SC / ST / OBC / MBC reserved categories)',
  'Tamil Nadu candidates: TNEA rank required for Government Quota seats',
  'Other state candidates: Direct admission under Management Quota with HSC marks',
  'Age: 17–25 years as of July 1, 2026',
]

const UG_COUNSELLING_PATHS = [
  {
    type: 'Government Quota (TNEA)',
    badge: 'Merit-based',
    color: 'blue' as const,
    points: [
      'Register on the TNEA portal at www.tneaonline.org',
      'Submit 10+2 marks, community certificate, and supporting documents online',
      'Receive merit rank based on HSC cut-off (PCM marks calculation)',
      'During online counselling, choose JKKN College of Engineering as preferred college and the branch',
      'Seat allotment based on rank + availability',
      'Report to JKKN campus with allotment order for verification + fee payment',
    ],
  },
  {
    type: 'Management Quota (Direct)',
    badge: 'Open May 1 – July 31',
    color: 'green' as const,
    points: [
      'Contact JKKN admissions office directly (no TNEA rank needed)',
      'Verify seat availability for the chosen branch',
      'Submit application + required documents at campus or online',
      'Pay fee and confirm seat — earlier confirmation = higher branch preference',
      'Receive admission letter + orientation schedule',
    ],
  },
]

const PG_ME_COUNSELLING_PATHS = [
  {
    type: 'TANCET-based Admission',
    badge: 'Merit + TANCET score',
    color: 'blue' as const,
    points: [
      'Appear for TANCET (Tamil Nadu Common Entrance Test) conducted by Anna University',
      'Apply to JKKN with valid TANCET score card',
      'Document verification and merit-based shortlisting',
      'Counselling intimation and provisional admission letter issued',
      'Fee payment and seat confirmation',
    ],
  },
  {
    type: 'Direct Merit Admission',
    badge: 'Open year-round',
    color: 'green' as const,
    points: [
      'Apply directly to JKKN with B.E / B.Tech degree (50%+ aggregate)',
      'Subject equivalency check as per Anna University regulations',
      'Personal interview with department senior learners',
      'Provisional admission based on academic merit',
      'Fee payment, document verification, and enrolment',
    ],
  },
]

const MBA_COUNSELLING_PATHS = [
  {
    type: 'Entrance Learning Assessment Route',
    badge: 'TANCET / CAT / MAT / XAT',
    color: 'blue' as const,
    points: [
      'Appear for any one: TANCET (Anna Univ) / CAT / MAT / XAT',
      'Apply to JKKN MBA with valid entrance learning assessment score',
      'Get shortlisted based on score + academic background',
      'Attend Group Discussion (GD) + Personal Interview (PI) at JKKN campus',
      'Final selection based on combined score (entrance + GD + PI + academics)',
      'Fee payment and enrolment confirmation',
    ],
  },
  {
    type: 'Direct Admission (Management Quota)',
    badge: 'Limited seats',
    color: 'green' as const,
    points: [
      'Apply directly to JKKN MBA with Bachelor\'s degree (50%+)',
      'Submit application + statement of purpose',
      'Attend personal interview with MBA senior learners / Director',
      'Provisional admission based on academic merit + interview',
      'Fee payment and seat confirmation',
    ],
  },
]

// ─── Course Data ──────────────────────────────────────────────────────────────

export const BE_CSE_ADMISSION: CourseAdmissionData = {
  slug: 'be-cse',
  level: 'UG',
  shortName: 'B.E CSE',
  fullName: 'B.E Computer Science & Engineering',
  duration: '4 Years',
  seats: 60,
  affiliated: 'Affiliated to Anna University, Chennai',
  CourseIcon: Cpu,
  heroIntro:
    'Apply for B.E Computer Science & Engineering at JKKN College of Engineering & Technology, Komarapalayam — AICTE approved, NAAC accredited,',
  applyUrl: APPLY_URL,
  applyDeadline: APPLY_DEADLINE,
  approvalsLabel: 'Approval',
  approvalsValue: 'AICTE · NAAC',
  eligibility: [
    ...UG_ELIGIBILITY_BASE,
    'Lateral entry to 2nd year — Diploma in Computer Science / IT with minimum 50%',
  ],
  counsellingPaths: UG_COUNSELLING_PATHS,
  documentsAdditionalLabel: 'for UG (B.E CSE) Applicants',
  feeBreakdown: [
    { item: 'Tuition Fee (Management Quota)', amount: '₹80,000', note: 'Highest demand branch — premium fee' },
    { item: 'Tuition Fee (Government Quota)', amount: 'As Per Government Norms', note: 'Fixed by Tamil Nadu Govt / Anna University' },
    { item: 'Hostel (Optional)', amount: '₹60,000', note: 'All-inclusive: meals, utilities, Wi-Fi' },
    { item: 'Application Fee', amount: 'FREE', note: 'No charge for application' },
  ],
  faqs: [
    {
      question: 'What is the eligibility for B.E CSE admission at JKKN?',
      answer:
        '10+2 (HSC) with Physics, Chemistry, Mathematics — minimum 45% aggregate (40% for reserved categories). Admission via TNEA counselling (Government Quota) or direct Management Quota.',
    },
    {
      question: 'How many B.E CSE seats are available in 2026-27?',
      answer:
        '60 sanctioned seats at JKKN College of Engineering. Split between Government Quota (TNEA, ~65%) and Management Quota (~35%) per Tamil Nadu Government norms.',
    },
    {
      question: 'What is the B.E CSE fee at JKKN?',
      answer:
        'Management Quota: ₹80,000/year (highest among engineering branches due to demand). Government Quota: as per Tamil Nadu Government norms. Hostel (optional, all-inclusive): ₹60,000/year. Zero application fee.',
    },
    {
      question: 'Does B.E CSE cover AI / Machine Learning?',
      answer:
        'Yes. Specializations include Artificial Intelligence, Machine Learning, Cloud Computing, Data Science, Cybersecurity. Learning Framework updated regularly per industry needs.',
    },
    {
      question: 'What are placement opportunities after B.E CSE?',
      answer:
        '92%+ placement rate. Recruiters: TCS, Infosys, Wipro, Cognizant, HCL, Accenture, Capgemini, and 500+ companies. Average package ₹3.5L; highest ₹8.5L+.',
    },
    {
      question: 'Is TNEA mandatory for B.E CSE?',
      answer:
        'Mandatory for Government Quota only. For Management Quota, apply directly to JKKN admissions office without TNEA rank.',
    },
    {
      question: 'Can I apply lateral entry to 2nd year B.E CSE?',
      answer:
        'Yes. Diploma in Computer Science / IT holders with minimum 50% can apply for lateral entry to 2nd year via ECET counselling or Management Quota.',
    },
    {
      question: 'When is the application deadline?',
      answer:
        'Application portal opens April 1, 2026 and closes May 31, 2026. TNEA counselling June-July; Direct/MQ window May 1 – July 31; fee payment deadline August 15.',
    },
    {
      question: 'Are scholarships available for B.E CSE learners?',
      answer:
        'Yes. JKKN Trust Merit (up to 100% waiver), Government scholarships (SC/ST/OBC/MBC categories), Naan Mudhalvan (₹12,000/yr Tamil-medium govt school learners), Need-based aid (up to 50% for income <₹2.5L).',
    },
    {
      question: 'Is there any application fee?',
      answer: 'No. Application is completely free — online portal or campus counter, both zero cost.',
    },
  ],
  courseDetailsUrl: '/courses-offered/ug/be-cse',
  courseDetailsLabel: 'View full B.E CSE learning framework, learning labs, senior learners, and placements',
}

export const BE_EEE_ADMISSION: CourseAdmissionData = {
  slug: 'be-eee',
  level: 'UG',
  shortName: 'B.E EEE',
  fullName: 'B.E Electrical & Electronics Engineering',
  duration: '4 Years',
  seats: 60,
  affiliated: 'Affiliated to Anna University, Chennai',
  CourseIcon: Zap,
  heroIntro:
    'Apply for B.E Electrical & Electronics Engineering at JKKN College of Engineering & Technology, Komarapalayam — AICTE approved, NAAC accredited,',
  applyUrl: APPLY_URL,
  applyDeadline: APPLY_DEADLINE,
  approvalsLabel: 'Approval',
  approvalsValue: 'AICTE · NAAC',
  eligibility: [
    ...UG_ELIGIBILITY_BASE,
    'Lateral entry to 2nd year — Diploma in Electrical / Electronics with minimum 50%',
  ],
  counsellingPaths: UG_COUNSELLING_PATHS,
  documentsAdditionalLabel: 'for UG (B.E EEE) Applicants',
  feeBreakdown: [
    { item: 'Tuition Fee (Management Quota)', amount: '₹45,000', note: 'One of our most affordable branches' },
    { item: 'Tuition Fee (Government Quota)', amount: 'As Per Government Norms', note: 'Fixed by Tamil Nadu Govt / Anna University' },
    { item: 'Hostel (Optional)', amount: '₹60,000', note: 'All-inclusive: meals, utilities, Wi-Fi' },
    { item: 'Application Fee', amount: 'FREE', note: 'No charge for application' },
  ],
  faqs: [
    {
      question: 'What is the eligibility for B.E EEE admission at JKKN?',
      answer:
        '10+2 (HSC) with Physics, Chemistry, Mathematics — minimum 45% aggregate (40% for reserved categories). Admission via TNEA counselling (Anna University) or direct Management Quota.',
    },
    {
      question: 'How many seats are available for B.E EEE in 2026-27?',
      answer:
        '60 sanctioned seats. Split between Government Quota (TNEA, ~65%) and Management Quota (~35%) as per Tamil Nadu Government norms.',
    },
    {
      question: 'What is the fee for B.E EEE — Government and Management Quota?',
      answer:
        'Management Quota: ₹45,000/year (one of the most affordable engineering branches at JKKN). Government Quota: as per Tamil Nadu Government norms. Hostel (optional, all-inclusive): ₹60,000/year.',
    },
    {
      question: 'How do I apply for B.E EEE — what is the process?',
      answer:
        'Apply online at the JKKN Admissions Portal or visit campus admissions counter (no application fee). For GQ: register on TNEA portal and list JKKN. For MQ: contact admissions office directly — open May 1 to July 31, 2026.',
    },
    {
      question: 'Is TNEA counselling mandatory for B.E EEE admission?',
      answer:
        'Mandatory for Government Quota seats. For Management Quota, you can apply directly without a TNEA rank.',
    },
    {
      question: 'What documents are required for B.E EEE admission?',
      answer:
        '10th and 12th marksheets, TC, Community Certificate, 6 photos, Conduct Certificate, Aadhaar (learner + parent), Income Certificate (for scholarships), TNEA Rank Card (GQ), Eligibility Certificate (other state boards).',
    },
    {
      question: 'Are scholarships available for B.E EEE learners?',
      answer:
        'Yes. SC/ST/OBC/MBC/EWS get government scholarships (PMSS, Community, First Graduate). JKKN Trust Merit up to 100% tuition waiver. Need-based up to 50% for income <₹2.5L. Naan Mudhalvan: ₹12,000/yr for Tamil-medium govt school learners.',
    },
    {
      question: 'When does B.E EEE admission close for 2026-27?',
      answer:
        'Application portal opens April 1, 2026. Regular last date May 31, 2026. TNEA counselling June-July 2026. Direct/MQ window May 1 – July 31, 2026. Fee deadline August 15, 2026. Classes commence August 2026.',
    },
    {
      question: 'Is there any application fee for B.E EEE at JKKN?',
      answer: 'No. Zero application fee. Apply online via JKKN Admissions Portal or at campus.',
    },
    {
      question: 'What is the difference between Government Quota and Management Quota?',
      answer:
        'GQ seats allotted through TNEA counselling based on 10+2 cutoff (Anna University). MQ seats filled directly by college on merit-cum-preference basis. For B.E EEE both quotas have the same Management Quota fee — Government fee is per government norms.',
    },
  ],
  courseDetailsUrl: '/courses-offered/ug/be-eee',
  courseDetailsLabel: 'View full B.E EEE learning framework, learning labs, senior learners, and placements',
}

export const BE_ECE_ADMISSION: CourseAdmissionData = {
  slug: 'be-ece',
  level: 'UG',
  shortName: 'B.E ECE',
  fullName: 'B.E Electronics & Communication Engineering',
  duration: '4 Years',
  seats: 60,
  affiliated: 'Affiliated to Anna University, Chennai',
  CourseIcon: Antenna,
  heroIntro:
    'Apply for B.E Electronics & Communication Engineering at JKKN College of Engineering & Technology, Komarapalayam — AICTE approved, NAAC accredited,',
  applyUrl: APPLY_URL,
  applyDeadline: APPLY_DEADLINE,
  approvalsLabel: 'Approval',
  approvalsValue: 'AICTE · NAAC',
  eligibility: [
    ...UG_ELIGIBILITY_BASE,
    'Lateral entry to 2nd year — Diploma in Electronics / ECE with minimum 50%',
  ],
  counsellingPaths: UG_COUNSELLING_PATHS,
  documentsAdditionalLabel: 'for UG (B.E ECE) Applicants',
  feeBreakdown: [
    { item: 'Tuition Fee (Management Quota)', amount: '₹70,000', note: 'High-demand electronics branch' },
    { item: 'Tuition Fee (Government Quota)', amount: 'As Per Government Norms', note: 'Fixed by Tamil Nadu Govt / Anna University' },
    { item: 'Hostel (Optional)', amount: '₹60,000', note: 'All-inclusive: meals, utilities, Wi-Fi' },
    { item: 'Application Fee', amount: 'FREE', note: 'No charge for application' },
  ],
  faqs: [
    {
      question: 'What is the eligibility for B.E ECE admission at JKKN?',
      answer:
        '10+2 with Physics, Chemistry, Mathematics — minimum 45% aggregate (40% reserved). Admission via TNEA counselling or direct Management Quota.',
    },
    {
      question: 'How many B.E ECE seats at JKKN in 2026-27?',
      answer:
        '60 sanctioned seats, split between Government Quota (~65%) and Management Quota (~35%) per Tamil Nadu Government norms.',
    },
    {
      question: 'What is the B.E ECE fee?',
      answer:
        'Management Quota: ₹70,000/year. Government Quota: as per Tamil Nadu Government norms. Hostel (optional): ₹60,000/year. Zero application fee.',
    },
    {
      question: 'What specializations does B.E ECE offer?',
      answer:
        'VLSI Design, Embedded Systems, Telecommunications, Signal Processing, IoT, RF & Microwave Engineering. Industry-aligned with semiconductor & telecom sector needs.',
    },
    {
      question: 'What are ECE career options at JKKN?',
      answer:
        'Embedded systems engineer, VLSI engineer, RF engineer, telecom engineer, signal processing engineer. Companies: Intel, Qualcomm, Texas Instruments, Samsung, Bharti, Jio. Govt: BSNL, DRDO, ISRO.',
    },
    {
      question: 'Is TNEA mandatory for B.E ECE?',
      answer: 'Mandatory for Government Quota only. Management Quota = apply directly to JKKN without TNEA rank.',
    },
    {
      question: 'Can diploma holders join 2nd year B.E ECE?',
      answer:
        'Yes. Diploma in Electronics / ECE with 50%+ aggregate can apply lateral entry to 2nd year via ECET counselling or Management Quota.',
    },
    {
      question: 'When does admission close?',
      answer:
        'Application portal: April 1 – May 31, 2026. TNEA counselling June-July. Direct/MQ window May 1 – July 31. Fee deadline August 15, 2026.',
    },
    {
      question: 'Scholarships for B.E ECE?',
      answer:
        'JKKN Trust Merit (up to 100% waiver), Government scholarships (SC/ST/OBC/MBC/EWS), Naan Mudhalvan (₹12,000/yr Tamil-medium govt school learners), Need-based aid (up to 50% for income <₹2.5L).',
    },
    {
      question: 'Application fee for B.E ECE?',
      answer: 'Zero. Application is free at JKKN — online portal or campus.',
    },
  ],
  courseDetailsUrl: '/courses-offered/ug/be-ece',
  courseDetailsLabel: 'View full B.E ECE learning framework, learning labs, senior learners, and placements',
}

export const BE_MECHANICAL_ADMISSION: CourseAdmissionData = {
  slug: 'be-mechanical',
  level: 'UG',
  shortName: 'B.E Mechanical',
  fullName: 'B.E Mechanical Engineering',
  duration: '4 Years',
  seats: 120,
  affiliated: 'Affiliated to Anna University, Chennai',
  CourseIcon: Cog,
  heroIntro:
    'Apply for B.E Mechanical Engineering at JKKN College of Engineering & Technology, Komarapalayam — AICTE approved, NAAC accredited,',
  applyUrl: APPLY_URL,
  applyDeadline: APPLY_DEADLINE,
  approvalsLabel: 'Approval',
  approvalsValue: 'AICTE · NAAC',
  eligibility: [
    ...UG_ELIGIBILITY_BASE,
    'Lateral entry to 2nd year — Diploma in Mechanical / Automobile / Production with minimum 50%',
  ],
  counsellingPaths: UG_COUNSELLING_PATHS,
  documentsAdditionalLabel: 'for UG (B.E Mechanical) Applicants',
  feeBreakdown: [
    { item: 'Tuition Fee (Management Quota)', amount: '₹45,000', note: 'Most affordable engineering branch' },
    { item: 'Tuition Fee (Government Quota)', amount: 'As Per Government Norms', note: 'Fixed by Tamil Nadu Govt / Anna University' },
    { item: 'Hostel (Optional)', amount: '₹60,000', note: 'All-inclusive: meals, utilities, Wi-Fi' },
    { item: 'Application Fee', amount: 'FREE', note: 'No charge for application' },
  ],
  faqs: [
    {
      question: 'What is the eligibility for B.E Mechanical?',
      answer:
        '10+2 with Physics, Chemistry, Mathematics — minimum 45% aggregate (40% reserved). Admission via TNEA counselling or direct Management Quota.',
    },
    {
      question: 'How many B.E Mechanical seats are available?',
      answer:
        '120 sanctioned seats — the largest engineering branch at JKKN. Split between Government Quota (~65%) and Management Quota (~35%) per Tamil Nadu norms.',
    },
    {
      question: 'What is the fee for B.E Mechanical?',
      answer:
        'Management Quota: ₹45,000/year — most affordable engineering branch at JKKN. Government Quota: as per Tamil Nadu Government norms. Hostel: ₹60,000/year (optional). Zero application fee.',
    },
    {
      question: 'What specializations does B.E Mechanical offer?',
      answer:
        'CAD/CAM, Thermal Engineering, Manufacturing Technology, Automotive Engineering, Industrial Engineering, Mechatronics, Robotics & Automation.',
    },
    {
      question: 'What are placement opportunities for Mechanical Engineers?',
      answer:
        'Core: TVS, Ashok Leyland, Mahindra, L&T, BHEL, Hindustan Motors. Manufacturing: Tata Motors, Bosch, Foxconn, LGB. IT-Mechanical: TCS, Infosys. Government: PSUs via GATE, Indian Railways.',
    },
    {
      question: 'Is TNEA mandatory for B.E Mechanical?',
      answer: 'Yes for Government Quota. For Management Quota — direct admission, no TNEA needed.',
    },
    {
      question: 'Can I do lateral entry to B.E Mechanical?',
      answer:
        'Yes. Diploma in Mechanical / Automobile / Production with 50%+ can apply lateral entry to 2nd year via ECET or Management Quota.',
    },
    {
      question: 'When does admission close?',
      answer:
        'Portal: April 1 – May 31, 2026. TNEA counselling June-July. Direct/MQ window May 1 – July 31. Fee deadline August 15, 2026.',
    },
    {
      question: 'Scholarships for Mechanical learners?',
      answer:
        'Same as other branches: JKKN Trust Merit (up to 100% waiver), Government schemes (SC/ST/OBC/MBC/EWS), Naan Mudhalvan (₹12,000/yr), Need-based (up to 50% for income <₹2.5L).',
    },
    {
      question: 'Application fee?',
      answer: 'Zero. Application is completely free.',
    },
  ],
  courseDetailsUrl: '/courses-offered/ug/be-mechanical',
  courseDetailsLabel: 'View full B.E Mechanical learning framework, learning labs, senior learners, and placements',
}

export const BTECH_IT_ADMISSION: CourseAdmissionData = {
  slug: 'btech-it',
  level: 'UG',
  shortName: 'B.Tech IT',
  fullName: 'B.Tech Information Technology',
  duration: '4 Years',
  seats: 60,
  affiliated: 'Affiliated to Anna University, Chennai',
  CourseIcon: Code2,
  heroIntro:
    'Apply for B.Tech Information Technology at JKKN College of Engineering & Technology, Komarapalayam — AICTE approved, NAAC accredited,',
  applyUrl: APPLY_URL,
  applyDeadline: APPLY_DEADLINE,
  approvalsLabel: 'Approval',
  approvalsValue: 'AICTE · NAAC',
  eligibility: [
    ...UG_ELIGIBILITY_BASE,
    'Lateral entry to 2nd year — Diploma in Computer Science / IT with minimum 50%',
  ],
  counsellingPaths: UG_COUNSELLING_PATHS,
  documentsAdditionalLabel: 'for UG (B.Tech IT) Applicants',
  feeBreakdown: [
    { item: 'Tuition Fee (Management Quota)', amount: '₹80,000', note: 'High-demand IT branch' },
    { item: 'Tuition Fee (Government Quota)', amount: 'As Per Government Norms', note: 'Fixed by Tamil Nadu Govt / Anna University' },
    { item: 'Hostel (Optional)', amount: '₹60,000', note: 'All-inclusive: meals, utilities, Wi-Fi' },
    { item: 'Application Fee', amount: 'FREE', note: 'No charge for application' },
  ],
  faqs: [
    {
      question: 'What is the eligibility for B.Tech IT?',
      answer:
        '10+2 with Physics, Chemistry, Mathematics — minimum 45% aggregate (40% reserved). Admission via TNEA counselling or direct Management Quota.',
    },
    {
      question: 'How many B.Tech IT seats are there?',
      answer:
        '60 sanctioned seats. Split between Government Quota (~65%) and Management Quota (~35%) per Tamil Nadu Government norms.',
    },
    {
      question: 'What is the B.Tech IT fee at JKKN?',
      answer:
        'Management Quota: ₹80,000/year. Government Quota: as per Tamil Nadu Government norms. Hostel (optional, all-inclusive): ₹60,000/year. Zero application fee.',
    },
    {
      question: 'What is the difference between B.E CSE and B.Tech IT?',
      answer:
        'B.E CSE focuses on computer science fundamentals, theory, algorithms, systems programming. B.Tech IT focuses on applied IT — networking, web technologies, cybersecurity, IT infrastructure, enterprise systems. Career paths overlap; both lead to software jobs.',
    },
    {
      question: 'What are B.Tech IT career options?',
      answer:
        'Network engineer, cybersecurity analyst, full-stack developer, IT consultant, cloud engineer, database administrator. Recruiters: TCS, Infosys, Wipro, Cognizant, IBM, Accenture, Capgemini. Average package ₹3.5L; highest ₹8L+.',
    },
    {
      question: 'Is TNEA mandatory for B.Tech IT?',
      answer: 'Mandatory only for Government Quota. For Management Quota = apply directly without TNEA rank.',
    },
    {
      question: 'Lateral entry to B.Tech IT?',
      answer:
        'Yes. Diploma in Computer Science / IT with 50%+ aggregate can apply lateral entry to 2nd year via ECET counselling or Management Quota.',
    },
    {
      question: 'When does B.Tech IT admission close?',
      answer:
        'Portal: April 1 – May 31, 2026. TNEA counselling June-July. Direct/MQ May 1 – July 31. Fee deadline August 15, 2026. Classes from August 2026.',
    },
    {
      question: 'Scholarships available for B.Tech IT?',
      answer:
        'JKKN Trust Merit (up to 100% waiver), Government scholarships (SC/ST/OBC/MBC/EWS), Naan Mudhalvan (₹12,000/yr Tamil-medium govt school), Need-based aid (up to 50% for income <₹2.5L).',
    },
    {
      question: 'Application fee?',
      answer: 'Zero. Application is completely free at JKKN.',
    },
  ],
  courseDetailsUrl: '/courses-offered/ug/btech-it',
  courseDetailsLabel: 'View full B.Tech IT learning framework, learning labs, senior learners, and placements',
}

export const ME_CSE_ADMISSION: CourseAdmissionData = {
  slug: 'me-cse',
  level: 'PG',
  shortName: 'M.E CSE',
  fullName: 'M.E Computer Science & Engineering',
  duration: '2 Years',
  seats: 60,
  affiliated: 'Affiliated to Anna University, Chennai',
  CourseIcon: Server,
  heroIntro:
    'Apply for M.E Computer Science & Engineering at JKKN College of Engineering & Technology, Komarapalayam — AICTE approved, NAAC accredited,',
  applyUrl: APPLY_URL,
  applyDeadline: APPLY_DEADLINE,
  approvalsLabel: 'Approval',
  approvalsValue: 'AICTE · NAAC',
  eligibility: [
    'B.E / B.Tech in a relevant Engineering discipline from a recognized university',
    'Minimum 50% aggregate marks in the qualifying degree',
    'TANCET score preferred (Tamil Nadu Common Entrance Test); direct merit-based admission also available',
    'Must satisfy subject equivalency norms as per Anna University regulations',
    'No upper age limit',
  ],
  counsellingPaths: PG_ME_COUNSELLING_PATHS,
  documentsAdditionalLabel: 'for PG (M.E CSE) Applicants',
  feeBreakdown: [
    { item: 'Tuition Fee (All Quotas)', amount: '₹30,000', note: 'Subsidized PG fee — most affordable PG engineering' },
    { item: 'Hostel (Optional)', amount: '₹60,000', note: 'All-inclusive: meals, utilities, Wi-Fi' },
    { item: 'Application Fee', amount: 'FREE', note: 'No charge for application' },
  ],
  faqs: [
    {
      question: 'What is the eligibility for M.E CSE admission?',
      answer:
        'B.E / B.Tech in CSE / IT / ECE / EEE or related engineering discipline with minimum 50% aggregate from a recognized university. TANCET score preferred; direct merit-based admission available.',
    },
    {
      question: 'How many M.E CSE seats at JKKN?',
      answer: '60 sanctioned seats. Both TANCET-based and direct merit admissions accepted.',
    },
    {
      question: 'What is the M.E CSE fee?',
      answer:
        '₹30,000/year — the most affordable PG engineering fee. Hostel (optional, all-inclusive): ₹60,000/year. Zero application fee.',
    },
    {
      question: 'Is TANCET mandatory for M.E CSE?',
      answer:
        'TANCET is preferred but not mandatory. JKKN also accepts direct merit-based admissions based on UG aggregate marks and personal interview.',
    },
    {
      question: 'What specializations does M.E CSE offer?',
      answer:
        'Advanced Algorithms, Data Science, Network Security, Cloud Computing, Machine Learning, Big Data, Software Engineering. Research opportunities in AI and distributed systems.',
    },
    {
      question: 'Can I work while pursuing M.E CSE?',
      answer:
        'M.E is a full-time program with mandatory class attendance. However, part-time consultancy or research project work with the department is possible after coursework.',
    },
    {
      question: 'What are career options after M.E CSE?',
      answer:
        'Senior software engineer / architect roles, R&D positions, academia (assistant senior learner), GATE-based PSU jobs (BHEL, NTPC, BSNL), Ph.D. research, technical leadership roles in MNCs.',
    },
    {
      question: 'Scholarships for M.E CSE?',
      answer:
        'AICTE PG Scholarship (₹12,400/month for GATE-qualified candidates), JKKN Trust Merit Scholarship, Government scholarships for SC/ST categories, Need-based financial aid.',
    },
    {
      question: 'When does M.E CSE admission close?',
      answer:
        'TANCET typically held April-May 2026. JKKN application portal April 1 – May 31, 2026. Counselling June-July 2026. Direct merit admission window open till August 2026.',
    },
    {
      question: 'Application fee?',
      answer: 'Zero. Application is completely free.',
    },
  ],
  courseDetailsUrl: '/courses-offered/pg/me-cse',
  courseDetailsLabel: 'View full M.E CSE learning framework, learning labs, senior learners, and research',
}

export const MBA_ADMISSION: CourseAdmissionData = {
  slug: 'mba',
  level: 'PG',
  shortName: 'MBA',
  fullName: 'M.B.A — Master of Business Administration',
  duration: '2 Years',
  seats: 120,
  affiliated: 'Affiliated to Anna University, Chennai',
  CourseIcon: Briefcase,
  heroIntro:
    'Apply for M.B.A — Master of Business Administration at JKKN College of Engineering & Technology, Komarapalayam — AICTE approved, NAAC accredited,',
  applyUrl: APPLY_URL,
  applyDeadline: APPLY_DEADLINE,
  approvalsLabel: 'Approval',
  approvalsValue: 'AICTE · NAAC',
  eligibility: [
    "Bachelor's degree in any discipline from a recognized university (Engineering, Arts, Science, Commerce all eligible)",
    'Minimum 50% aggregate marks in the qualifying degree',
    'Valid score in TANCET / CAT / MAT / XAT (any one entrance learning assessment)',
    'Shortlisted candidates appear for Group Discussion (GD) + Personal Interview (PI)',
    'No upper age limit; final-year learners may apply provisionally',
  ],
  counsellingPaths: MBA_COUNSELLING_PATHS,
  documentsAdditionalLabel: 'for PG (MBA) Applicants',
  feeBreakdown: [
    { item: 'Tuition Fee (All Quotas)', amount: '₹65,000', note: 'Affordable MBA fee — industry-aligned learning framework' },
    { item: 'Hostel (Optional)', amount: '₹60,000', note: 'All-inclusive: meals, utilities, Wi-Fi' },
    { item: 'Application Fee', amount: 'FREE', note: 'No charge for application' },
  ],
  faqs: [
    {
      question: 'What is the eligibility for MBA at JKKN?',
      answer:
        "Bachelor's degree in ANY discipline (Engineering, Arts, Science, Commerce) with minimum 50% aggregate from a recognized university. Valid score in TANCET / CAT / MAT / XAT required. Final-year learners may apply provisionally.",
    },
    {
      question: 'How many MBA seats at JKKN?',
      answer: '120 sanctioned seats — the largest PG program at JKKN.',
    },
    {
      question: 'What is the MBA fee?',
      answer:
        '₹65,000/year for both quotas. Hostel (optional, all-inclusive): ₹60,000/year. Zero application fee.',
    },
    {
      question: 'Which entrance learning assessment is accepted for MBA?',
      answer:
        'Any one of: TANCET (Anna University), CAT, MAT, XAT. TANCET is most common for Tamil Nadu candidates. Direct Management Quota admission also available for limited seats.',
    },
    {
      question: 'What MBA specializations are offered?',
      answer:
        'Finance, Marketing, Human Resource Management (HRM), Operations Management, Business Analytics, Entrepreneurship. Dual specialization possible in 2nd year.',
    },
    {
      question: 'Is GD/PI conducted at JKKN for MBA?',
      answer:
        'Yes. Shortlisted candidates (based on entrance score + academic record) appear for Group Discussion (GD) and Personal Interview (PI) at JKKN campus. Final selection combines entrance + GD + PI + academics.',
    },
    {
      question: 'What are MBA placement opportunities at JKKN?',
      answer:
        'Recruiters across finance (HDFC, ICICI, Axis), marketing (Asian Paints, ITC), HR (TCS, Cognizant), consulting (Deloitte, KPMG), retail (Reliance, Tata). Average package ₹4L+; placement support throughout 2 years.',
    },
    {
      question: 'Can I do MBA without an entrance learning assessment?',
      answer:
        'Limited direct Management Quota seats available without entrance learning assessment — apply with Bachelor\'s degree (50%+), statement of purpose, and personal interview. Contact admissions office for availability.',
    },
    {
      question: 'Scholarships for MBA learners?',
      answer:
        'JKKN Trust Merit Scholarship (academic toppers), Government scholarships for SC/ST/OBC categories, Need-based financial aid (up to 50% for family income <₹2.5L), Sports/Cultural quota with fee benefit.',
    },
    {
      question: 'When does MBA admission close?',
      answer:
        'TANCET typically April-May 2026. JKKN application portal April 1 – May 31, 2026 (regular). Direct/MQ admission window open till August 2026. Classes commence August 2026.',
    },
  ],
  courseDetailsUrl: '/courses-offered/pg/mba',
  courseDetailsLabel: 'View full MBA learning framework, senior learners, specializations, and placements',
}
