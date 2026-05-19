/**
 * Canonical metadata for all 9 JKKN institutions (7 colleges + 2 schools).
 *
 * Single source of truth — consumed by:
 *  - `/our-institutions` page (UI cards + per-page JSON-LD graph)
 *  - Homepage ItemList JSON-LD (HomepageInstitutionsItemListSchema)
 *
 * Keep schemaId stable: it is the canonical entity URI for each
 * institution and is cross-referenced from multiple pages.
 */

export type InstitutionEntry = {
  position: number
  name: string
  shortName: string
  url: string
  isExternal: boolean
  description: string
  visitLabel: string
  alternateName: string[]
  schemaType: 'CollegeOrUniversity' | 'HighSchool' | 'School'
  schemaId: string
  schemaDescription: string
  foundedYear: number
  approval: string
  affiliation: string
  keyPrograms: string
  applyUrl: string
  feeUrl: string
  scholarshipUrl: string
}

export const COLLEGES: InstitutionEntry[] = [
  {
    position: 1,
    name: 'JKKN Dental College and Hospital',
    shortName: 'Dental College',
    url: 'https://dental.jkkn.ac.in/',
    isExternal: true,
    description:
      'BDS (Bachelor of Dental Surgery), MDS (Master of Dental Surgery) across 9 specialties. 350-bed teaching hospital. DCI approved.',
    visitLabel: 'Visit Dental College',
    alternateName: ['JKK Nataraja Dental College', 'JKKN Dental'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://dental.jkkn.ac.in/#organization',
    schemaDescription:
      'BDS and MDS programs with 350-bed teaching hospital. DCI approved. Established 1987.',
    foundedYear: 1987,
    approval: 'DCI Approved',
    affiliation: 'TN Dr. M.G.R. Medical University',
    keyPrograms: 'BDS, MDS (9 specialties)',
    applyUrl: 'https://dental.jkkn.ac.in/admissions',
    feeUrl: 'https://dental.jkkn.ac.in/fees-structure/',
    scholarshipUrl: 'https://dental.jkkn.ac.in/scholarships/',
  },
  {
    position: 2,
    name: 'JKKN College of Pharmacy',
    shortName: 'Pharmacy College',
    url: 'https://pharmacy.jkkn.ac.in/',
    isExternal: true,
    description:
      'B.Pharm, M.Pharm, Pharm.D, D.Pharm programs. PCI approved. NAAC A grade. Established 1985.',
    visitLabel: 'Visit Pharmacy College',
    alternateName: ['JKK Nattraja College of Pharmacy'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://pharmacy.jkkn.ac.in/#organization',
    schemaDescription:
      'PCI approved NAAC A grade pharmacy college. B.Pharm, M.Pharm, Pharm.D, D.Pharm programs. Established 1985.',
    foundedYear: 1985,
    approval: 'PCI Approved · NAAC A',
    affiliation: 'TN Dr. M.G.R. Medical University',
    keyPrograms: 'B.Pharm, M.Pharm, Pharm.D, D.Pharm',
    applyUrl: 'https://pharmacy.jkkn.ac.in/admissions',
    feeUrl: 'https://pharmacy.jkkn.ac.in/fee-structure/',
    scholarshipUrl: 'https://pharmacy.jkkn.ac.in/scholarships/',
  },
  {
    position: 3,
    name: 'JKKN College of Engineering and Technology (Autonomous)',
    shortName: 'Engineering College',
    url: 'https://engg.jkkn.ac.in/',
    isExternal: true,
    description:
      'B.E./B.Tech, M.E./M.Tech, MBA across CSE, ECE, Mechanical, EEE, Civil, AI/ML branches. AICTE approved, Anna University affiliated.',
    visitLabel: 'Visit Engineering College',
    alternateName: ['JKKNCET', 'JKKN Engineering'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://engg.jkkn.ac.in/#organization',
    schemaDescription:
      'Autonomous engineering college affiliated with Anna University. B.E./B.Tech/M.E./M.Tech/MBA programs across CSE, ECE, Mechanical, EEE, Civil, AI/ML. Established 2008.',
    foundedYear: 2008,
    approval: 'AICTE · Autonomous · NAAC A',
    affiliation: 'Anna University',
    keyPrograms: 'B.E./B.Tech, M.E./M.Tech, MBA',
    applyUrl: 'https://engg.jkkn.ac.in/admissions',
    feeUrl: 'https://engg.jkkn.ac.in/fee-structure',
    scholarshipUrl: 'https://engg.jkkn.ac.in/scholarships',
  },
  {
    position: 4,
    name: 'JKKN College of Allied Health Sciences',
    shortName: 'AHS College',
    url: 'https://ahs.jkkn.ac.in/',
    isExternal: true,
    description:
      'B.Sc programs in Medical Lab Technology, Operation Theatre, Radiology, Optometry, Anaesthesia, Physiotherapy.',
    visitLabel: 'Visit AHS College',
    alternateName: ['JKKN AHS'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://ahs.jkkn.ac.in/#organization',
    schemaDescription:
      'Allied Health Sciences college established 2019. B.Sc programs in Medical Lab Technology, Operation Theatre, Radiology, Optometry, Anaesthesia, Physiotherapy.',
    foundedYear: 2019,
    approval: 'MGR University Approved',
    affiliation: 'TN Dr. M.G.R. Medical University',
    keyPrograms: 'B.Sc MLT, OT, Radiology, Optometry, Physio',
    applyUrl: 'https://ahs.jkkn.ac.in/admissions',
    feeUrl: 'https://ahs.jkkn.ac.in/fee-structure',
    scholarshipUrl: 'https://ahs.jkkn.ac.in/scholarships',
  },
  {
    position: 5,
    name: 'JKKN College of Arts and Science (Autonomous)',
    shortName: 'Arts & Science College',
    url: 'https://cas.jkkn.ac.in/',
    isExternal: true,
    description:
      'UG/PG programs in Computer Science, Commerce, Management, Visual Communication, Textile & Fashion, Psychology, Tamil literature.',
    visitLabel: 'Visit Arts & Science College',
    alternateName: ['JKKN CAS', 'JKKN Arts College'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://cas.jkkn.ac.in/#organization',
    schemaDescription:
      'Autonomous arts and science college established 1974. UG/PG in Computer Science, Commerce, Management, Visual Communication, Textile & Fashion, Psychology, Tamil literature.',
    foundedYear: 1974,
    approval: 'UGC · Autonomous',
    affiliation: 'Periyar University',
    keyPrograms: 'UG/PG CS, Commerce, Management, VisCom',
    applyUrl: 'https://cas.jkkn.ac.in/admissions',
    feeUrl: 'https://cas.jkkn.ac.in/fee-structure',
    scholarshipUrl: 'https://cas.jkkn.ac.in/scholarships',
  },
  {
    position: 6,
    name: 'Sresakthimayeil Institute of Nursing and Research',
    shortName: 'Nursing College',
    url: 'https://nursing.sresakthimayeil.jkkn.ac.in/',
    isExternal: true,
    description:
      'B.Sc Nursing, M.Sc Nursing, GNM, ANM programs. INC approved. Tamil Nadu Dr. M.G.R. Medical University affiliated.',
    visitLabel: 'Visit Nursing College',
    alternateName: ['JKKN Nursing College', 'Sresakthimayeil Nursing'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://nursing.sresakthimayeil.jkkn.ac.in/#organization',
    schemaDescription:
      'INC approved nursing institute established 2006. B.Sc Nursing, M.Sc Nursing, GNM, ANM programs. Affiliated to Tamil Nadu Dr. M.G.R. Medical University.',
    foundedYear: 2006,
    approval: 'INC Approved',
    affiliation: 'TN Dr. M.G.R. Medical University',
    keyPrograms: 'B.Sc Nursing, M.Sc, GNM, ANM',
    applyUrl: 'https://nursing.sresakthimayeil.jkkn.ac.in/admissions',
    feeUrl: 'https://nursing.sresakthimayeil.jkkn.ac.in/fee-structure',
    scholarshipUrl: 'https://nursing.sresakthimayeil.jkkn.ac.in/scholarships',
  },
  {
    position: 7,
    name: 'JKKN College of Education',
    shortName: 'Education College',
    url: 'https://edu.jkkn.ac.in/',
    isExternal: true,
    description:
      'B.Ed (Bachelor of Education) program. NCTE recognized. Trains future teachers across multiple subject specializations.',
    visitLabel: 'Visit Education College',
    alternateName: ['JKKN B.Ed College'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://edu.jkkn.ac.in/#organization',
    schemaDescription:
      'NCTE recognized B.Ed program established 2016. Trains future teachers across multiple subject specializations.',
    foundedYear: 2016,
    approval: 'NCTE Recognized',
    affiliation: 'TNTEU',
    keyPrograms: 'B.Ed (multiple specializations)',
    applyUrl: 'https://edu.jkkn.ac.in/admissions',
    feeUrl: 'https://edu.jkkn.ac.in/fee-structure',
    scholarshipUrl: 'https://edu.jkkn.ac.in/scholarships',
  },
]

export const SCHOOLS: InstitutionEntry[] = [
  {
    position: 8,
    name: 'JKKN Matriculation Higher Secondary School',
    shortName: 'Matric School',
    url: 'https://school.jkkn.ac.in/',
    isExternal: true,
    description:
      'Matriculation Board curriculum from LKG to Class 12. Smart classrooms, sports facilities, transport coverage across Erode and Salem.',
    visitLabel: 'Visit Matric School',
    alternateName: ['JKKN Matric'],
    schemaType: 'HighSchool',
    schemaId: 'https://school.jkkn.ac.in/#organization',
    schemaDescription:
      'Tamil Nadu State Matriculation Board curriculum from LKG to Class 12. Established 1969.',
    foundedYear: 1969,
    approval: 'TN State Board',
    affiliation: 'Tamil Nadu Matriculation Board',
    keyPrograms: 'LKG to Class 12 (Matriculation)',
    applyUrl: 'https://school.jkkn.ac.in/',
    feeUrl: 'https://school.jkkn.ac.in/',
    scholarshipUrl: 'https://school.jkkn.ac.in/',
  },
  {
    position: 9,
    name: 'Nattraja Vidhyalya',
    shortName: 'Nattraja Vidhyalya',
    url: 'https://nv.jkkn.ac.in/',
    isExternal: true,
    description:
      'CBSE curriculum school offering holistic education with focus on academic excellence, sports, and cultural development.',
    visitLabel: 'Visit Nattraja Vidhyalya',
    alternateName: ['JKKN CBSE School', 'Nattraja Vidhyalaya'],
    schemaType: 'School',
    schemaId: 'https://nv.jkkn.ac.in/#organization',
    schemaDescription:
      'CBSE curriculum school established 2009. Holistic education with academic excellence, sports, and cultural development focus.',
    foundedYear: 2009,
    approval: 'CBSE Affiliated',
    affiliation: 'Central Board of Secondary Education',
    keyPrograms: 'Pre-KG to Class 12 (CBSE)',
    applyUrl: 'https://nv.jkkn.ac.in/',
    feeUrl: 'https://nv.jkkn.ac.in/',
    scholarshipUrl: 'https://nv.jkkn.ac.in/',
  },
]

export const ALL_INSTITUTIONS: InstitutionEntry[] = [...COLLEGES, ...SCHOOLS]

export const INSTITUTIONS_CATALOG_ID = 'https://jkkn.ac.in/#institutions-catalog'
