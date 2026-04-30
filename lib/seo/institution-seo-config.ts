/**
 * Centralized Per-Institution SEO Configuration
 *
 * Single source of truth for all institution-specific SEO data.
 * Used by structured-data.ts, schema components, and metadata generation.
 *
 * IMPORTANT: When adding a new institution, add its config here.
 * All other SEO systems read from this file.
 */

import { getSiteUrl } from '@/lib/utils/site-url'
import { getCurrentInstitution, isMainInstitution } from '@/lib/config/multi-tenant'

// =============================================================================
// TYPES
// =============================================================================

export interface InstitutionSEOConfig {
  /** Full legal/display name */
  name: string
  /** Alternate names for schema.org */
  alternateName: string[]
  /** Legal entity name */
  legalName?: string
  /** One-line description for schema */
  description: string
  /** Founding date of this specific institution (NOT the trust) */
  foundingDate: string
  /** Tagline / slogan */
  slogan?: string
  /** Institution type for schema.org */
  schemaType: 'EducationalOrganization' | 'CollegeOrUniversity' | 'School'

  // Address & Location
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo: {
    latitude: string
    longitude: string
  }
  areaServed: Array<{
    type: 'City' | 'AdministrativeArea' | 'State' | 'Country'
    name: string
    sameAs?: string
  }>

  // Contact
  contactPoint: {
    telephone: string
    contactType: string
    email: string
    availableLanguage: string[]
  }

  // Social & Identity
  sameAs: string[]
  email: string

  // Parent Organization
  parentOrganization: {
    type: string
    name: string
    id: string
    foundingDate?: string
    description?: string
  }

  // Credentials & Affiliations (institution-specific)
  hasCredential: Array<{
    name: string
    credentialCategory: string
    recognizedBy: { name: string; alternateName?: string }
  }>
  memberOf: Array<{
    name: string
    alternateName?: string
    sameAs?: string
  }>

  // Programs offered (for makesOffer)
  programs: Array<{
    name: string
    programType: string
  }>

  // Amenities
  amenityFeature: string[]

  // Awards
  awards: string[]

  // Sub-organizations (only for main institution)
  subOrganizations?: Array<{
    type: 'CollegeOrUniversity' | 'School'
    name: string
    url: string
    description: string
    foundingDate: string
  }>

  // Employee count
  numberOfEmployees?: { min: number; max: number }

  // Alumni count
  alumniCount?: number

  // FAQ content for this institution
  faqs: Array<{ question: string; answer: string }>

  // Website schema extras
  keywords: string[]

  // Google verification (per institution)
  googleSiteVerification?: string

  // Analytics IDs
  analytics?: {
    gaId?: string
    metaPixelId?: string
    gtmId?: string
  }
}

// =============================================================================
// SHARED DATA
// =============================================================================

const SHARED_ADDRESS = {
  streetAddress: 'Natarajapuram, NH-544 (Salem to Coimbatore National Highway)',
  addressLocality: 'Komarapalayam',
  addressRegion: 'Tamil Nadu',
  postalCode: '638183',
  addressCountry: 'IN',
}

const SHARED_GEO = {
  latitude: '11.445400813968119',
  longitude: '77.73060452273064',
}

const SHARED_AREA_SERVED: InstitutionSEOConfig['areaServed'] = [
  { type: 'City', name: 'Komarapalayam', sameAs: 'https://en.wikipedia.org/wiki/Kumarapalayam' },
  { type: 'City', name: 'Erode', sameAs: 'https://en.wikipedia.org/wiki/Erode' },
  { type: 'City', name: 'Salem', sameAs: 'https://en.wikipedia.org/wiki/Salem,_Tamil_Nadu' },
  { type: 'AdministrativeArea', name: 'Namakkal District', sameAs: 'https://en.wikipedia.org/wiki/Namakkal_district' },
  { type: 'State', name: 'Tamil Nadu', sameAs: 'https://en.wikipedia.org/wiki/Tamil_Nadu' },
  { type: 'Country', name: 'India' },
]

const SHARED_PARENT_ORG = {
  type: 'Organization',
  name: 'J.K.K. Rangammal Charitable Trust',
  id: 'https://www.jkkn.ac.in/#trust',
  foundingDate: '1969',
  description: 'Charitable trust dedicated to empowering women through literacy and providing quality education',
}

const SHARED_AMENITIES = [
  'Smart Classrooms',
  'Wi-Fi Campus',
  'Hostel Accommodation',
  'Sports Facilities',
  'Library',
  'Laboratories',
  'Auditorium',
  'Seminar Hall',
  'Food Court',
  'Transport Facility',
]

// =============================================================================
// INSTITUTION CONFIGS
// =============================================================================

const INSTITUTION_SEO_CONFIGS: Record<string, InstitutionSEOConfig> = {
  main: {
    name: 'JKKN Institutions',
    alternateName: [
      'JKKN Educational Institutions',
      'J. K. K. Nattraja Educational Institutions',
      'JKKN',
      'JKKN Group of Institutions',
    ],
    legalName: 'J.K.K. Rangammal Charitable Trust',
    description:
      'JKKN Institutions is a premier educational group established in 1952 by the J.K.K. Rangammal Charitable Trust. Located in Komarapalayam, Tamil Nadu, India, JKKN offers 50+ career-focused programs across 7 colleges including Dental, Pharmacy, Nursing, Allied Health Sciences, Engineering, Arts & Science, and Education with 92%+ placement success rate. NAAC accredited institution with 74+ years of excellence in education.',
    foundingDate: '1952',
    slogan: 'Dream Big, Achieve Bigger',
    schemaType: 'EducationalOrganization',

    address: SHARED_ADDRESS,
    geo: SHARED_GEO,
    areaServed: SHARED_AREA_SERVED,

    contactPoint: {
      telephone: '+91-9345855001',
      contactType: 'Admissions',
      email: 'info@jkkn.ac.in',
      availableLanguage: ['English', 'Tamil'],
    },
    email: 'info@jkkn.ac.in',

    sameAs: [
      'https://www.facebook.com/myjkkn',
      'https://www.instagram.com/jkkninstitutions/',
      'https://www.youtube.com/@JKKNINSTITUTIONS',
      'https://www.linkedin.com/school/jkkninstitutions/',
      'https://en.wikipedia.org/wiki/J._K._K._Nattraja_Educational_Institutions',
      'https://alumni.jkkn.ac.in/',
    ],

    parentOrganization: SHARED_PARENT_ORG,

    hasCredential: [
      { name: 'NAAC Accreditation', credentialCategory: 'Accreditation', recognizedBy: { name: 'National Assessment and Accreditation Council', alternateName: 'NAAC' } },
      { name: 'AICTE Approval', credentialCategory: 'Approval', recognizedBy: { name: 'All India Council for Technical Education', alternateName: 'AICTE' } },
      { name: 'Dental Council of India Recognition', credentialCategory: 'Recognition', recognizedBy: { name: 'Dental Council of India', alternateName: 'DCI' } },
      { name: 'Pharmacy Council of India Approval', credentialCategory: 'Approval', recognizedBy: { name: 'Pharmacy Council of India', alternateName: 'PCI' } },
      { name: 'Indian Nursing Council Recognition', credentialCategory: 'Recognition', recognizedBy: { name: 'Indian Nursing Council', alternateName: 'INC' } },
      { name: 'NCTE Approval', credentialCategory: 'Approval', recognizedBy: { name: 'National Council for Teacher Education', alternateName: 'NCTE' } },
    ],

    memberOf: [
      { name: 'Anna University', sameAs: 'https://www.annauniv.edu/' },
      { name: 'Tamil Nadu Dr. M.G.R. Medical University', sameAs: 'https://www.tnmgrmu.ac.in/' },
      { name: 'Periyar University', sameAs: 'https://www.periyaruniversity.ac.in/' },
      { name: 'Tamil Nadu Teachers Education University', alternateName: 'TNTEU' },
    ],

    programs: [
      { name: 'Dental Programs', programType: 'BDS, MDS' },
      { name: 'Pharmacy Programs', programType: 'B.Pharm, M.Pharm, Pharm.D, Ph.D' },
      { name: 'Engineering Programs', programType: 'B.E., B.Tech, M.E., MBA' },
      { name: 'Nursing Programs', programType: 'B.Sc Nursing, P.B.B.Sc Nursing, M.Sc Nursing' },
      { name: 'Arts and Science Programs', programType: 'B.A., B.Sc., B.Com., B.B.A., B.C.A., M.C.A., M.A., M.Sc., M.Com., Ph.D' },
      { name: 'Allied Health Sciences Programs', programType: 'B.Sc Allied Health Sciences' },
      { name: 'Education Programs', programType: 'B.Ed' },
    ],

    amenityFeature: [
      ...SHARED_AMENITIES,
      'Dental Hospital',
      'Bank & Post Office',
      'Ambulance Services',
      'Emergency Care',
    ],

    awards: [
      'NAAC A Accreditation (Dental College)',
      '74+ Years of Educational Excellence',
      'Selected under Unnat Bharat Abhiyan by Ministry of HRD',
    ],

    numberOfEmployees: { min: 400, max: 500 },
    alumniCount: 50000,

    subOrganizations: [
      { type: 'CollegeOrUniversity', name: 'JKKN Dental College and Hospital', url: 'https://dental.jkkn.ac.in/', description: 'Dental college established in 1987, affiliated to Tamil Nadu Dr. M.G.R. Medical University, recognized by Dental Council of India', foundingDate: '1987' },
      { type: 'CollegeOrUniversity', name: 'JKKN College of Pharmacy', url: 'https://pharmacy.jkkn.ac.in/', description: 'Pharmacy college established in 1985, approved by Pharmacy Council of India and AICTE', foundingDate: '1985' },
      { type: 'CollegeOrUniversity', name: 'JKKN College of Engineering and Technology', url: 'https://engg.jkkn.ac.in/', description: 'Engineering college established in 2008, affiliated with Anna University, approved by AICTE', foundingDate: '2008' },
      { type: 'CollegeOrUniversity', name: 'JKKN College of Arts and Science', url: 'https://cas.jkkn.ac.in/', description: 'Arts and Science college established in 1974, affiliated with Periyar University, recognized by UGC', foundingDate: '1974' },
      { type: 'CollegeOrUniversity', name: 'JKKN College of Allied Health Sciences', url: 'https://ahs.jkkn.ac.in/', description: 'Allied Health Sciences college established in 2019, affiliated to Tamil Nadu Dr. M.G.R. Medical University', foundingDate: '2019' },
      { type: 'CollegeOrUniversity', name: 'Sresakthimayeil Institute of Nursing and Research', url: 'https://nursing.sresakthimayeil.jkkn.ac.in/', description: 'Nursing college established in 2006, recognized by Indian Nursing Council', foundingDate: '2006' },
      { type: 'CollegeOrUniversity', name: 'JKKN College of Education', url: 'https://edu.jkkn.ac.in/', description: 'Teacher training college established in 2016, approved by NCTE and affiliated with TNTEU', foundingDate: '2016' },
      { type: 'School', name: 'JKKN Matriculation Higher Secondary School', url: 'https://school.jkkn.ac.in/', description: 'Matriculation school founded in 1969, recognized by Government of Tamil Nadu', foundingDate: '1969' },
      { type: 'School', name: 'Nattraja Vidhyalaya', url: 'https://nv.jkkn.ac.in/', description: 'Elementary school founded in 2009 offering Pre-KG through Grade 10', foundingDate: '2009' },
      { type: 'School', name: 'J.K.K. Rangammal Girls Higher Secondary School', url: '', description: 'Government-aided girls higher secondary school founded in 1965', foundingDate: '1965' },
      { type: 'School', name: 'J.K.K. Rangammal Elementary School', url: '', description: 'The first institution established by the founder in 1952', foundingDate: '1952' },
    ],

    faqs: [
      { question: 'What is JKKN Institutions?', answer: 'JKKN Institutions (JKKN) is a premier educational group in Komarapalayam, Tamil Nadu, comprising 7 colleges and 4 schools. Established in 1952, JKKN offers 50+ programs in dental, pharmacy, engineering, nursing, allied health sciences, and arts with 92%+ placement success.' },
      { question: 'Why is JKKN the best college near Erode?', answer: 'JKKN is recognized as the best college near Erode due to 74+ years of excellence, NAAC accreditation, 92%+ placement rate, and 50,000+ successful alumni. Top recruiters include Foxconn, Apex Pharma, Apotex, Cipla and Bosch.' },
      { question: 'Who founded JKKN Institutions?', answer: "JKKN was founded by visionary Kodai Vallal Shri. J.K.K. Natarajah, who started a school in 1952 to promote girls' education. His vision led to J.K.K. Rangammal Trust (1969), now led by Chairperson Smt. N. Sendamaraai and Director Shri. S. Ommsharravana." },
      { question: 'How many colleges are under JKKN?', answer: 'JKKN comprises 11 institutions: Dental College, Pharmacy College, Engineering College, Allied Health Sciences, Arts & Science College (Autonomous), Education College, Nursing College, Matriculation School, Nattraja Vidhyalaya, Elementary School and Girls Higher Secondary School — all located on one integrated residential campus in Komarapalayam.' },
      { question: 'What courses does JKKN offer?', answer: 'JKKN offers 50+ programs including BDS/MDS (Dental), B.Pharm/M.Pharm/Pharm.D (Pharmacy), B.E./B.Tech/MBA (Engineering), B.Sc/M.Sc Nursing, Allied Health Sciences, B.Ed, and various UG/PG Arts & Science degrees.' },
      { question: 'Which universities is JKKN affiliated with?', answer: 'JKKN colleges are affiliated with Tamil Nadu Dr. M.G.R. Medical University (Dental/Nursing/Pharmacy), Anna University Chennai (Engineering), and Periyar University Salem (Arts & Science). All programs are approved by AICTE, DCI, PCI, INC, and NAAC.' },
      { question: 'How do I apply for JKKN admission 2026-27?', answer: 'Apply online at jkkn.in/admission-form for 2026-27 admissions. Submit required documents, complete fee payment, and attend counseling if applicable. For Dental/Nursing, NEET scores are required; for Engineering, TNEA counseling applies.' },
      { question: "What is JKKN's placement rate?", answer: 'JKKN maintains an impressive 90%+ placement rate across institutions. The Dental College achieved 92% placements in 2024. The dedicated Placement Cell organizes campus drives, skill development programs, and mock interviews.' },
      { question: 'How do I reach JKKN from Erode?', answer: 'JKKN is located just 15 km from Erode City on NH-544 (Salem-Coimbatore Highway). Reach by bus from Erode Bus Stand (30 minutes), train to Erode Junction (18 km), or air via Salem Airport (60 km) or Coimbatore Airport (100 km).' },
      { question: "What is JKKN's address?", answer: 'JKKN Institutions, Natarajapuram, NH-544 (Salem-Coimbatore Highway), Komarapalayam, Namakkal District, Tamil Nadu - 638183. Contact: 9345855001 | Email: info@jkkn.ac.in.' },
      { question: 'Which areas does JKKN serve?', answer: 'JKKN primarily serves students from Erode, Salem, Namakkal, Komarapalayam, Tiruchengode, Sankagiri, Bhavani, Perundurai, and Gobichettipalayam. Students from across Tamil Nadu and neighboring states attend due to its excellent reputation.' },
    ],

    keywords: [
      'JKKN', 'JKKN Institutions', 'Best College Near Erode',
      'colleges in erode district', 'top colleges in erode',
      'Dental College Komarapalayam', 'Pharmacy College Tamil Nadu',
      'Engineering College Namakkal', 'Nursing College Erode',
      'NAAC Accredited College', 'Top College in Tamil Nadu',
    ],

    googleSiteVerification: 'y27BHDBypTLPOsApWrsud0u-UDAAT62rIvfM46VcID8',

    analytics: {
      gaId: 'G-CHXSXSC9YY',
      metaPixelId: '779817005468177',
    },
  },

  engineering: {
    name: 'JKKN College of Engineering and Technology',
    alternateName: [
      'JKKN CET',
      'JKKN Engineering College',
      'JKKN College of Engineering',
    ],
    description:
      'Premier engineering college in Tamil Nadu affiliated to Anna University. Established in 2008, offering UG and PG programs in Engineering, Technology and Management with excellent placement record. AICTE approved and NAAC accredited.',
    foundingDate: '2008',
    slogan: 'Engineering Excellence, Innovation First',
    schemaType: 'CollegeOrUniversity',

    address: {
      streetAddress: 'Natarajapuram, NH-544 (Salem To Coimbatore National Highway)',
      addressLocality: 'Komarapalayam',
      addressRegion: 'Tamil Nadu',
      postalCode: '638183',
      addressCountry: 'IN',
    },
    geo: SHARED_GEO,
    areaServed: SHARED_AREA_SERVED,

    contactPoint: {
      telephone: '+91-9345855001',
      contactType: 'Admissions',
      email: 'engg@jkkn.ac.in',
      availableLanguage: ['English', 'Tamil'],
    },
    email: 'engg@jkkn.ac.in',

    sameAs: [
      'https://www.facebook.com/myjkkn',
      'https://www.instagram.com/jkkninstitutions/',
      'https://www.youtube.com/@JKKNINSTITUTIONS',
      'https://www.linkedin.com/school/jkkninstitutions/',
    ],

    parentOrganization: {
      ...SHARED_PARENT_ORG,
      // Also link to parent JKKN organization
      type: 'EducationalOrganization',
      name: 'JKKN Institutions',
      id: 'https://www.jkkn.ac.in/#organization',
    },

    hasCredential: [
      { name: 'AICTE Approval', credentialCategory: 'Approval', recognizedBy: { name: 'All India Council for Technical Education', alternateName: 'AICTE' } },
      { name: 'NAAC Accreditation', credentialCategory: 'Accreditation', recognizedBy: { name: 'National Assessment and Accreditation Council', alternateName: 'NAAC' } },
    ],

    memberOf: [
      { name: 'Anna University', sameAs: 'https://www.annauniv.edu/' },
    ],

    programs: [
      { name: 'B.E. Computer Science and Engineering', programType: 'B.E. CSE' },
      { name: 'B.E. Electronics and Communication Engineering', programType: 'B.E. ECE' },
      { name: 'B.E. Electrical and Electronics Engineering', programType: 'B.E. EEE' },
      { name: 'B.E. Mechanical Engineering', programType: 'B.E. Mech' },
      { name: 'B.Tech Information Technology', programType: 'B.Tech IT' },
      { name: 'M.E. Computer Science and Engineering', programType: 'M.E. CSE' },
      { name: 'Master of Business Administration', programType: 'MBA' },
    ],

    amenityFeature: [
      ...SHARED_AMENITIES,
      'Advanced Computing Lab',
      'Robotics Lab',
      'Innovation Centre',
    ],

    awards: [
      'NAAC Accredited',
      'AICTE Approved',
      'Anna University Affiliated',
      'Selected under Unnat Bharat Abhiyan by Ministry of HRD',
    ],

    numberOfEmployees: { min: 80, max: 120 },

    faqs: [
      { question: 'How do I apply for JKKN Engineering College admission 2026-27?', answer: 'Apply online at jkkn.ac.in/admissions or visit our campus with required documents. You can also call +91 93458 55001 for admission guidance. Applications are accepted throughout the year, but seats are limited.' },
      { question: 'What are the eligibility criteria for B.E./B.Tech admission?', answer: '10+2 with Mathematics, Physics, and Chemistry/Computer Science/Biology with minimum 50% aggregate. Valid TNEA/counseling rank preferred. Direct admission also available based on merit.' },
      { question: 'What is the fee structure for engineering courses?', answer: 'Annual tuition fees range from ₹75,000 to ₹1,00,000 depending on the branch. Additional charges for hostel, transportation, and activities apply. Scholarships and fee concessions available for eligible students.' },
      { question: 'Does JKKN Engineering College provide hostel facilities?', answer: 'Yes, separate hostels for boys and girls with 24/7 security, Wi-Fi, mess facilities, and recreational rooms. Hostel fees are approximately ₹50,000 per year including food and accommodation.' },
      { question: 'Is JKKN Engineering College AICTE approved and Anna University affiliated?', answer: 'Yes, JKKN College of Engineering & Technology is AICTE approved and affiliated to Anna University, Chennai. We are also NAAC accredited with excellent placement records.' },
      { question: 'What is the placement record of JKKN Engineering College?', answer: 'JKKN Engineering College places 500+ students annually through campus recruitment. Placement rates range from 60–70% as reported by education aggregators (Collegedunia, Careers360). Top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, and Tech Mahindra.' },
      { question: 'What is the highest package offered at JKKN?', answer: 'The highest package recorded at JKKN Engineering College is ₹12 LPA. Average salary figures range from ₹2.2 LPA (Careers360 median) to ₹4.5 LPA depending on branch and batch. Dedicated placement training begins from the first year.' },
      { question: 'What courses are offered at JKKN College of Engineering?', answer: 'JKKN offers B.E. in CSE, ECE, EEE, Mechanical, and B.Tech in IT. Postgraduate programs include M.E. CSE and MBA. All programs are AICTE approved and affiliated to Anna University.' },
      { question: 'Where is JKKN College of Engineering located?', answer: 'JKKN College of Engineering & Technology is located in Komarapalayam, Namakkal District, Tamil Nadu, on the Salem-Coimbatore National Highway (NH-544). Just 15 km from Erode city.' },
      { question: 'What facilities are available at JKKN Engineering College?', answer: 'State-of-the-art laboratories, modern library with 50,000+ books, Wi-Fi campus, sports facilities, seminar halls, auditorium, cafeteria, bus transport, separate hostels, and 24/7 medical care.' },
    ],

    keywords: [
      'JKKN Engineering College', 'JKKN CET', 'Engineering College Namakkal',
      'Best Engineering College Near Erode', 'Anna University Affiliated College',
      'AICTE Approved Engineering College Tamil Nadu',
      'B.E. CSE Admission Tamil Nadu', 'B.Tech IT College',
      'Engineering College Komarapalayam', 'Top Engineering College Tamil Nadu',
    ],

    analytics: {
      gaId: 'G-WH0VZ5V4TL',
      metaPixelId: '365029645695967',
    },
  },
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get SEO config for the current institution (reads NEXT_PUBLIC_INSTITUTION_ID)
 */
export function getInstitutionSEOConfig(): InstitutionSEOConfig {
  const institution = getCurrentInstitution()
  return INSTITUTION_SEO_CONFIGS[institution.id] || INSTITUTION_SEO_CONFIGS.main
}

/**
 * Get SEO config for a specific institution by ID
 */
export function getInstitutionSEOConfigById(id: string): InstitutionSEOConfig | undefined {
  return INSTITUTION_SEO_CONFIGS[id]
}

/**
 * Get the current copyright year string
 */
export function getCopyrightYear(): string {
  const config = getInstitutionSEOConfig()
  const currentYear = new Date().getFullYear()
  return `${config.foundingDate}-${currentYear}`
}

/**
 * Get Google Analytics measurement ID for current institution
 * Falls back to environment variable, then to undefined (skip analytics)
 */
export function getGAMeasurementId(): string | undefined {
  const config = getInstitutionSEOConfig()
  return config.analytics?.gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || undefined
}

/**
 * Get Meta Pixel ID for current institution
 */
export function getMetaPixelId(): string | undefined {
  const config = getInstitutionSEOConfig()
  return config.analytics?.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined
}

/**
 * Get Google Site Verification code for current institution
 */
export function getGoogleSiteVerification(): string | undefined {
  const config = getInstitutionSEOConfig()
  return config.googleSiteVerification || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined
}
