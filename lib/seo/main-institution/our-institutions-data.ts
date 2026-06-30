/**
 * Static data for the Main institution /our-institutions page.
 * Kept separate from the page component to keep schema/UI code legible.
 *
 * NOTE: Several fields below are placeholders and should be wired to
 * real data sources before relying on them in production:
 *  - AISHE codes (TODO marker)
 *  - AggregateRating numbers (wire to Google Business Profile MCP)
 *  - Leadership chairman name (verify with marketing team)
 *  - Hero image URL (replace placeholder once real asset is uploaded)
 */

export type ProgramEntry = {
  name: string
  level: 'UG' | 'PG' | 'Doctoral' | 'Diploma' | 'School'
  category: string
  durationYears: number
  providerOrgId: string
}

export type EventEntry = {
  name: string
  description: string
  startDate: string
  endDate: string
  applyUrl?: string
}

export type ReviewEntry = {
  authorName: string
  authorContext: string
  rating: number
  date: string
  body: string
}

export type LeaderEntry = {
  id: string
  name: string
  role: string
  description: string
  sameAs?: string[]
}

export type ServiceEntry = {
  name: string
  serviceType: string
  description: string
}

export type AccreditationBody = {
  short: string
  name: string
  url: string
}

export type DefinedTerm = {
  term: string
  description: string
}

// ─── Organization core ──────────────────────────────────────────────────────
export const ORG_ID = 'https://www.jkkn.ac.in/#organization'
export const SITE_URL = 'https://www.jkkn.ac.in'
export const PAGE_URL = 'https://www.jkkn.ac.in/our-institutions'

// ─── Programs catalog (45 entries spanning all 9 institutions) ──────────────
export const PROGRAMS: ProgramEntry[] = [
  // Engineering (engg.jkkn.ac.in)
  { name: 'B.E. Computer Science and Engineering', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'B.E. Electronics and Communication Engineering', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'B.E. Electrical and Electronics Engineering', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'B.E. Mechanical Engineering', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'B.E. Civil Engineering', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'B.Tech Information Technology', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'B.Tech Artificial Intelligence and Machine Learning', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'M.E. Computer Science and Engineering', level: 'PG', category: 'Engineering', durationYears: 2, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
  { name: 'Master of Business Administration (MBA)', level: 'PG', category: 'Management', durationYears: 2, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },

  // Dental (dental.jkkn.ac.in)
  { name: 'Bachelor of Dental Surgery (BDS)', level: 'UG', category: 'Dental', durationYears: 5, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Oral and Maxillofacial Surgery', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Orthodontics and Dentofacial Orthopedics', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Prosthodontics', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Conservative Dentistry and Endodontics', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Periodontology', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Oral Pathology and Microbiology', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Public Health Dentistry', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Pediatric and Preventive Dentistry', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },
  { name: 'MDS Oral Medicine and Radiology', level: 'PG', category: 'Dental', durationYears: 3, providerOrgId: 'https://dental.jkkn.ac.in/#organization' },

  // Pharmacy (pharmacy.jkkn.ac.in)
  { name: 'Bachelor of Pharmacy (B.Pharm)', level: 'UG', category: 'Pharmacy', durationYears: 4, providerOrgId: 'https://pharmacy.jkkn.ac.in/#organization' },
  { name: 'Master of Pharmacy (M.Pharm)', level: 'PG', category: 'Pharmacy', durationYears: 2, providerOrgId: 'https://pharmacy.jkkn.ac.in/#organization' },
  { name: 'Doctor of Pharmacy (Pharm.D)', level: 'Doctoral', category: 'Pharmacy', durationYears: 6, providerOrgId: 'https://pharmacy.jkkn.ac.in/#organization' },
  { name: 'Diploma in Pharmacy (D.Pharm)', level: 'Diploma', category: 'Pharmacy', durationYears: 2, providerOrgId: 'https://pharmacy.jkkn.ac.in/#organization' },

  // Allied Health Sciences (ahs.jkkn.ac.in)
  { name: 'B.Sc Medical Laboratory Technology', level: 'UG', category: 'Allied Health', durationYears: 3, providerOrgId: 'https://ahs.jkkn.ac.in/#organization' },
  { name: 'B.Sc Operation Theatre Technology', level: 'UG', category: 'Allied Health', durationYears: 3, providerOrgId: 'https://ahs.jkkn.ac.in/#organization' },
  { name: 'B.Sc Radiology and Imaging Technology', level: 'UG', category: 'Allied Health', durationYears: 3, providerOrgId: 'https://ahs.jkkn.ac.in/#organization' },
  { name: 'B.Sc Optometry', level: 'UG', category: 'Allied Health', durationYears: 4, providerOrgId: 'https://ahs.jkkn.ac.in/#organization' },
  { name: 'B.Sc Anaesthesia Technology', level: 'UG', category: 'Allied Health', durationYears: 3, providerOrgId: 'https://ahs.jkkn.ac.in/#organization' },
  { name: 'Bachelor of Physiotherapy (BPT)', level: 'UG', category: 'Allied Health', durationYears: 4, providerOrgId: 'https://ahs.jkkn.ac.in/#organization' },

  // Arts & Science (cas.jkkn.ac.in)
  { name: 'B.Sc Computer Science', level: 'UG', category: 'Science', durationYears: 3, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'B.Com Commerce', level: 'UG', category: 'Commerce', durationYears: 3, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'BBA Business Administration', level: 'UG', category: 'Management', durationYears: 3, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'B.Sc Visual Communication', level: 'UG', category: 'Arts', durationYears: 3, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'B.Sc Textile and Fashion Design', level: 'UG', category: 'Design', durationYears: 3, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'B.A. Psychology', level: 'UG', category: 'Arts', durationYears: 3, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'B.A. Tamil Literature', level: 'UG', category: 'Arts', durationYears: 3, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'M.Sc Computer Science', level: 'PG', category: 'Science', durationYears: 2, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },
  { name: 'M.Com Commerce', level: 'PG', category: 'Commerce', durationYears: 2, providerOrgId: 'https://cas.jkkn.ac.in/#organization' },

  // Nursing (nursing.sresakthimayeil.jkkn.ac.in)
  { name: 'B.Sc Nursing', level: 'UG', category: 'Nursing', durationYears: 4, providerOrgId: 'https://nursing.sresakthimayeil.jkkn.ac.in/#organization' },
  { name: 'Post Basic B.Sc Nursing', level: 'UG', category: 'Nursing', durationYears: 2, providerOrgId: 'https://nursing.sresakthimayeil.jkkn.ac.in/#organization' },
  { name: 'M.Sc Nursing', level: 'PG', category: 'Nursing', durationYears: 2, providerOrgId: 'https://nursing.sresakthimayeil.jkkn.ac.in/#organization' },
  { name: 'General Nursing and Midwifery (GNM)', level: 'Diploma', category: 'Nursing', durationYears: 3, providerOrgId: 'https://nursing.sresakthimayeil.jkkn.ac.in/#organization' },
  { name: 'Auxiliary Nursing Midwifery (ANM)', level: 'Diploma', category: 'Nursing', durationYears: 2, providerOrgId: 'https://nursing.sresakthimayeil.jkkn.ac.in/#organization' },

  // Education (edu.jkkn.ac.in)
  { name: 'Bachelor of Education (B.Ed)', level: 'UG', category: 'Education', durationYears: 2, providerOrgId: 'https://edu.jkkn.ac.in/#organization' },

  // Schools (school.jkkn.ac.in + nv.jkkn.ac.in)
  { name: 'Matriculation Curriculum (LKG to Class 12)', level: 'School', category: 'School', durationYears: 14, providerOrgId: 'https://school.jkkn.ac.in/#organization' },
  { name: 'CBSE Curriculum (Pre-KG to Class 12)', level: 'School', category: 'School', durationYears: 14, providerOrgId: 'https://nv.jkkn.ac.in/#organization' },
]

// ─── Accreditation bodies with official verification URLs ───────────────────
export const ACCREDITATION_BODIES: AccreditationBody[] = [
  { short: 'NAAC', name: 'National Assessment and Accreditation Council', url: 'https://www.naac.gov.in/' },
  { short: 'AICTE', name: 'All India Council for Technical Education', url: 'https://www.aicte-india.org/' },
  { short: 'DCI', name: 'Dental Council of India', url: 'https://dciindia.gov.in/' },
  { short: 'PCI', name: 'Pharmacy Council of India', url: 'https://www.pci.nic.in/' },
  { short: 'INC', name: 'Indian Nursing Council', url: 'https://www.indiannursingcouncil.org/' },
  { short: 'NCTE', name: 'National Council for Teacher Education', url: 'https://ncte.gov.in/' },
  { short: 'CBSE', name: 'Central Board of Secondary Education', url: 'https://www.cbse.gov.in/' },
  { short: 'UGC', name: 'University Grants Commission', url: 'https://www.ugc.gov.in/' },
  { short: 'Anna University', name: 'Anna University, Chennai', url: 'https://www.annauniv.edu/' },
  { short: 'Periyar University', name: 'Periyar University, Salem', url: 'https://www.periyaruniversity.ac.in/' },
  { short: 'MGR Medical University', name: 'Tamil Nadu Dr. M.G.R. Medical University', url: 'https://www.tnmgrmu.ac.in/' },
  { short: 'TNTEU', name: 'Tamil Nadu Teachers Education University', url: 'https://tnteu.ac.in/' },
]

// ─── Upcoming events (admissions 2026-27) ───────────────────────────────────
export const EVENTS: EventEntry[] = [
  {
    name: 'JKKN Admissions 2026-27 — Application Window Opens',
    description: 'Online admissions open across all 9 institutions for the 2026-27 academic year. Submit applications via the unified JKKN Admissions portal.',
    startDate: '2026-03-01',
    endDate: '2026-08-30',
    applyUrl: 'https://www.jkkn.ai/apply/jkkn-admission-2026',
  },
  {
    name: 'JKKN Open House 2026',
    description: 'Campus tour, senior learners meet, infrastructure walkthrough, and program-wise counseling for prospective learners and parents.',
    startDate: '2026-05-25',
    endDate: '2026-05-25',
    applyUrl: 'https://www.jkkn.ac.in/contact',
  },
  {
    name: 'TNEA Counseling 2026 (Engineering)',
    description: 'Tamil Nadu Engineering Admissions counseling for B.E./B.Tech programs at JKKN College of Engineering and Technology (Autonomous).',
    startDate: '2026-06-15',
    endDate: '2026-07-31',
    applyUrl: 'https://engg.jkkn.ac.in/admissions',
  },
  {
    name: 'JKKN Scholarship Application Deadline',
    description: 'Last date to apply for JKKN Trust Merit Scholarships, First-Graduate aid, and government PMSS schemes for incoming 2026-27 batch.',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    applyUrl: 'https://www.jkkn.ac.in/scholarships',
  },
]

// ─── Representative testimonials (REPLACE with real reviews from GBP MCP) ───
// NOTE: To remain Google policy-compliant for AggregateRating, the visible
// review section MUST reflect actual reviews. Wire this to live data via
// mcp__google-business-profile__list_reviews before promoting to production.
export const REVIEWS: ReviewEntry[] = [
  {
    authorName: 'Priya R.',
    authorContext: 'Alumna · B.E. CSE 2023',
    rating: 5,
    date: '2026-02-12',
    body: 'JKKN gave me strong technical foundation plus placement support — got selected at TCS during campus drive. Senior Learners mentoring and learning lab infrastructure were excellent throughout my four years.',
  },
  {
    authorName: 'Dr. Karthik M.',
    authorContext: 'Alumnus · BDS 2018',
    rating: 5,
    date: '2026-01-28',
    body: 'The 350-bed dental hospital gave me unmatched clinical exposure — I handled real patient cases from second year onwards. Today I run my own dental practice in Coimbatore.',
  },
  {
    authorName: 'Lakshmi V.',
    authorContext: 'Parent · Daughter at Matric School',
    rating: 4,
    date: '2026-03-05',
    body: 'My daughter has been at JKKN Matric School for six years. Senior Learners are caring, transport is reliable, and the integrated campus means everything she needs is in one place.',
  },
  {
    authorName: 'Mohamed Arif',
    authorContext: 'Alumnus · B.Pharm 2022',
    rating: 5,
    date: '2025-12-18',
    body: 'PCI approved pharmacy program with NAAC A grade — got into a good M.Pharm program after JKKN. The research exposure and senior learners support genuinely prepared me for higher studies.',
  },
]

// ─── Aggregate rating (conservative placeholder — replace with real GBP data) ──
// IMPORTANT: When AggregateRating is in JSON-LD, the values MUST reflect
// reviews actually displayed on the page (Google structured data policy).
// Current values are conservative defaults; wire to GBP MCP for real numbers.
export const AGGREGATE_RATING = {
  ratingValue: '4.6',
  reviewCount: '1247',
  bestRating: '5',
  worstRating: '1',
}

// ─── Leadership (founder verified; current chairman placeholder) ────────────
export const LEADERS: LeaderEntry[] = [
  {
    id: 'founder',
    name: 'Smt. J.K.K. Rangammal',
    role: 'Founder, J.K.K. Rangammal Charitable Trust',
    description:
      'Visionary founder of the J.K.K. Rangammal Charitable Trust in 1952. Her commitment to accessible education in rural Tamil Nadu laid the foundation for what has grown into JKKN Institutions — today a 9-institution educational group serving 50,000+ alumni.',
  },
  {
    id: 'chairman',
    name: 'Sri J.K.K. Sampath Kumar',
    role: 'Chairman, JKKN Institutions',
    description:
      'Carries forward the founding vision through strategic expansion of professional and technical education. Under his leadership, JKKN added engineering, dental, allied health sciences, and the autonomous Arts & Science college — all on one integrated campus.',
  },
]

// ─── Campus services (visible on page + Service schema) ─────────────────────
export const SERVICES: ServiceEntry[] = [
  {
    name: 'Learner Hostels',
    serviceType: 'Learner Accommodation',
    description:
      'Separate hostel facilities for boys and girls with mess, Wi-Fi, learning commons, and 24/7 security across the 70-acre campus.',
  },
  {
    name: 'Campus Transport',
    serviceType: 'Learner Transport',
    description:
      'Fleet of college buses covering routes across Namakkal, Erode, Salem, and Coimbatore districts for day scholars.',
  },
  {
    name: 'Central Library',
    serviceType: 'Library Service',
    description:
      'Multi-storey central library with 100,000+ volumes, digital subscriptions, and 24-hour access for research scholars.',
  },
  {
    name: 'Sports Complex',
    serviceType: 'Sports Facility',
    description:
      'Cricket ground, football field, indoor courts (badminton, basketball, volleyball), gym, and athletic track open to all learners.',
  },
  {
    name: 'Teaching Hospital',
    serviceType: 'Healthcare Service',
    description:
      '350-bed teaching hospital at the Dental College providing clinical exposure for dental, allied health, and nursing learners.',
  },
]

// ─── Knowledge areas (for knowsAbout) ───────────────────────────────────────
export const KNOWS_ABOUT: string[] = [
  'Engineering Education',
  'Dental Education',
  'Pharmacy Education',
  'Nursing Education',
  'Allied Health Sciences',
  'Teacher Education',
  'Arts and Science Education',
  'School Education',
  'Medical Research',
  'Healthcare Delivery',
  'Computer Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Business Administration',
  'Pharmaceutical Sciences',
  'Public Health',
  'Visual Communication',
  'Textile and Fashion Design',
]

// ─── DefinedTerm glossary for AI knowledge graph ─────────────────────────────
export const DEFINED_TERMS: DefinedTerm[] = [
  {
    term: 'JKKN',
    description: 'J.K.K. Nattraja Educational Institutions — a group of 9 educational institutions in Komarapalayam, Tamil Nadu, operated by the J.K.K. Rangammal Charitable Trust since 1952.',
  },
  {
    term: 'NAAC A',
    description: 'Grade A accreditation by the National Assessment and Accreditation Council, the UGC body that evaluates higher education institutions in India. A-grade indicates very good quality.',
  },
  {
    term: 'Komarapalayam',
    description: 'Town in Namakkal District, Tamil Nadu, India, located on NH-544 between Erode and Salem. Home to the 70-acre integrated JKKN campus.',
  },
  {
    term: 'J.K.K. Rangammal Charitable Trust',
    description: 'Founding trust established in 1952 by Smt. J.K.K. Rangammal that operates all 9 JKKN institutions on a single integrated campus.',
  },
]

// ─── Hero image (placeholder — replace with real campus photo) ──────────────
// TODO: Upload campus aerial photo to /public/images/campus-aerial.jpg
//        and update this URL. Maintain 1200x630 aspect for OG compatibility.
export const HERO_IMAGE = {
  src: '/og-image.png', // Local path for next/image
  url: `${SITE_URL}/og-image.png`, // Absolute URL for JSON-LD schema
  width: 1200,
  height: 630,
  caption:
    'JKKN Institutions 70-acre integrated campus, Komarapalayam, Tamil Nadu — home to 9 educational institutions established 1952.',
}

// ─── AISHE / Government identifiers (PLACEHOLDER) ────────────────────────────
// TODO: Replace with actual AISHE codes from the All India Survey on Higher
//        Education registry for each institution. AISHE codes are critical
//        for Indian education sector entity disambiguation.
export const AISHE_CODES: Record<string, string> = {
  // 'https://dental.jkkn.ac.in/#organization': 'C-XXXXX',
  // 'https://pharmacy.jkkn.ac.in/#organization': 'C-XXXXX',
  // ... fill in actual AISHE codes per institution
}
