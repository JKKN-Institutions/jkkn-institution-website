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
  { name: 'B.Tech Information Technology', level: 'UG', category: 'Engineering', durationYears: 4, providerOrgId: 'https://engg.jkkn.ac.in/#organization' },
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

  // Education (edu.jkkn.ac.in)
  { name: 'Bachelor of Education (B.Ed)', level: 'UG', category: 'Education', durationYears: 2, providerOrgId: 'https://edu.jkkn.ac.in/#organization' },

  // Schools (school.jkkn.ac.in + nv.jkkn.ac.in)
  { name: 'Matriculation Curriculum (LKG to Class 12)', level: 'School', category: 'School', durationYears: 14, providerOrgId: 'https://school.jkkn.ac.in/#organization' },
  { name: 'CBSE Curriculum (Pre-KG to Grade 10)', level: 'School', category: 'School', durationYears: 14, providerOrgId: 'https://nv.jkkn.ac.in/#organization' },
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

// ─── Upcoming events ────────────────────────────────────────────────────────
// EMPTIED 2026-09-12. The four entries that lived here had ALL expired (latest
// endDate 2026-08-30) while the page still said "Admissions 2026-27 open now",
// and none of them was rendered anywhere on the page — they existed only in
// JSON-LD. Expired, invisible Event markup is a Google structured-data policy
// problem, not just a stale date.
//
// Only add an event back when BOTH are true:
//   1. it is visible on the page, and
//   2. its endDate is in the future.
export const EVENTS: EventEntry[] = []

// ─── Testimonials ───────────────────────────────────────────────────────────
// EMPTIED 2026-09-12. The four entries here were placeholders that shipped to
// production — the original comment in this file said "REPLACE with real
// reviews from GBP MCP" and "wire this to live data ... before promoting to
// production", and that never happened. They were rendered BOTH as visible
// cards and as Review JSON-LD, so the site was publishing self-written reviews
// as review markup about itself.
//
// Only repopulate from a real source (Google Business Profile), and keep the
// visible cards and the JSON-LD in sync.
export const REVIEWS: ReviewEntry[] = []


// ─── Aggregate rating — MEASURED, no longer a placeholder ───────────────────
// Measured 2026-09-12 from Google local results (tbm=lcl, searched as if at
// Komarapalayam) across the Google Business Profiles of JKKN's seven colleges:
//   Dental 4.5 (429) · Arts & Science 4.8 (517) · Pharmacy 4.3 (238)
//   Engineering 4.6 (276) · Nursing 4.8 (208) · Allied Health 4.6 (127)
//   Education 4.2 (24)
// Review-weighted mean = 8,388.5 / 1,819 = 4.61 -> 4.6
// The previous reviewCount of 1247 was a placeholder and matched no real source.
export const AGGREGATE_RATING = {
  ratingValue: '4.6',
  reviewCount: '1819',
  bestRating: '5',
  worstRating: '1',
  /** Shown next to the rating so the number is never unsourced on the page. */
  sourceLabel: 'Google reviews across JKKN\u2019s seven colleges',
  measuredOn: '2026-09-12',
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
