/**
 * <HomepageInstitutionsItemListSchema />
 *
 * Emits a JSON-LD ItemList of all 9 JKKN institutions (7 colleges + 2 schools)
 * on the MAIN homepage only. Hard-gated by isMainInstitution() — engineering /
 * dental / pharmacy / nursing deployments render null and emit ZERO JSON-LD.
 *
 * Why self-contained (all data inline, no shared module):
 *  - A prior version (commit bc2e73d, reverted in 4f05aca) extracted this data
 *    into lib/seo/main-institution/institutions-list.ts AND refactored
 *    /our-institutions/_main-page.tsx to consume it. That broader change
 *    triggered a header crash. Re-implementing here as a single self-contained
 *    file keeps the blast radius small: /our-institutions stays untouched and
 *    no new shared imports are introduced.
 *  - Data is duplicated from /our-institutions/_main-page.tsx (acceptable for
 *    an SEO-only file with 9 stable entries).
 *
 * @id (`https://jkkn.ac.in/#institutions-catalog`) intentionally matches the
 * /our-institutions page's ItemList — entity reinforcement across pages helps
 * AI engines (ChatGPT / Perplexity / Gemini AI Overview) and Google's ItemList
 * carousel recognise this as the canonical "9 JKKN institutions" entity.
 */

import { isMainInstitution } from '@/lib/config/multi-tenant'
import { getSiteUrl } from '@/lib/utils/site-url'

type InstitutionEntry = {
  position: number
  name: string
  url: string
  alternateName: string[]
  schemaType: 'CollegeOrUniversity' | 'HighSchool' | 'School'
  schemaId: string
  schemaDescription: string
  foundedYear: number
}

const INSTITUTIONS: InstitutionEntry[] = [
  {
    position: 1,
    name: 'JKKN Dental College and Hospital',
    url: 'https://dental.jkkn.ac.in/',
    alternateName: ['JKK Nataraja Dental College', 'JKKN Dental'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://dental.jkkn.ac.in/#organization',
    schemaDescription:
      'BDS and MDS programs with 350-bed teaching hospital. DCI approved. Established 1987.',
    foundedYear: 1987,
  },
  {
    position: 2,
    name: 'JKKN College of Pharmacy',
    url: 'https://pharmacy.jkkn.ac.in/',
    alternateName: ['JKK Nattraja College of Pharmacy'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://pharmacy.jkkn.ac.in/#organization',
    schemaDescription:
      'PCI approved NAAC A grade pharmacy college. B.Pharm, M.Pharm, Pharm.D, D.Pharm programs. Established 1985.',
    foundedYear: 1985,
  },
  {
    position: 3,
    name: 'JKKN College of Engineering and Technology (Autonomous)',
    url: 'https://engg.jkkn.ac.in/',
    alternateName: ['JKKNCET', 'JKKN Engineering'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://engg.jkkn.ac.in/#organization',
    schemaDescription:
      'Autonomous engineering college affiliated with Anna University. B.E./B.Tech/M.E./M.Tech/MBA programs across CSE, ECE, Mechanical, EEE, Civil, AI/ML. Established 2008.',
    foundedYear: 2008,
  },
  {
    position: 4,
    name: 'JKKN College of Allied Health Sciences',
    url: 'https://ahs.jkkn.ac.in/',
    alternateName: ['JKKN AHS'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://ahs.jkkn.ac.in/#organization',
    schemaDescription:
      'Allied Health Sciences college established 2019. B.Sc programs in Medical Lab Technology, Operation Theatre, Radiology, Optometry, Anaesthesia, Physiotherapy.',
    foundedYear: 2019,
  },
  {
    position: 5,
    name: 'JKKN College of Arts and Science (Autonomous)',
    url: 'https://cas.jkkn.ac.in/',
    alternateName: ['JKKN CAS', 'JKKN Arts College'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://cas.jkkn.ac.in/#organization',
    schemaDescription:
      'Autonomous arts and science college established 1974. UG/PG in Computer Science, Commerce, Management, Visual Communication, Textile & Fashion, Psychology, Tamil literature.',
    foundedYear: 1974,
  },
  {
    position: 6,
    name: 'Sresakthimayeil Institute of Nursing and Research',
    url: 'https://nursing.sresakthimayeil.jkkn.ac.in/',
    alternateName: ['JKKN Nursing College', 'Sresakthimayeil Nursing'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://nursing.sresakthimayeil.jkkn.ac.in/#organization',
    schemaDescription:
      'INC approved nursing institute established 2006. B.Sc Nursing, M.Sc Nursing, GNM, ANM programs. Affiliated to Tamil Nadu Dr. M.G.R. Medical University.',
    foundedYear: 2006,
  },
  {
    position: 7,
    name: 'JKKN College of Education',
    url: 'https://edu.jkkn.ac.in/',
    alternateName: ['JKKN B.Ed College'],
    schemaType: 'CollegeOrUniversity',
    schemaId: 'https://edu.jkkn.ac.in/#organization',
    schemaDescription:
      'NCTE recognized B.Ed program established 2016. Trains future teachers across multiple subject specializations.',
    foundedYear: 2016,
  },
  {
    position: 8,
    name: 'JKKN Matriculation Higher Secondary School',
    url: 'https://school.jkkn.ac.in/',
    alternateName: ['JKKN Matric'],
    schemaType: 'HighSchool',
    schemaId: 'https://school.jkkn.ac.in/#organization',
    schemaDescription:
      'Tamil Nadu State Matriculation Board curriculum from LKG to Class 12. Established 1969.',
    foundedYear: 1969,
  },
  {
    position: 9,
    name: 'Nattraja Vidhyalya',
    url: 'https://nv.jkkn.ac.in/',
    alternateName: ['JKKN CBSE School', 'Nattraja Vidhyalaya'],
    schemaType: 'School',
    schemaId: 'https://nv.jkkn.ac.in/#organization',
    schemaDescription:
      'CBSE curriculum school established 2009. Holistic education with academic excellence, sports, and cultural development focus.',
    foundedYear: 2009,
  },
]

const INSTITUTIONS_CATALOG_ID = 'https://jkkn.ac.in/#institutions-catalog'

export function HomepageInstitutionsItemListSchema() {
  if (!isMainInstitution()) {
    return null
  }

  const SITE_URL = getSiteUrl()
  const ORG_ID = `${SITE_URL}/#organization`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': INSTITUTIONS_CATALOG_ID,
    name: 'JKKN Institutions — 9 Educational Pillars',
    description:
      'Complete list of all 9 institutions under JKKN: 7 colleges (Dental, Pharmacy, Engineering, Allied Health Sciences, Arts & Science, Nursing, Education) and 2 schools (Matriculation Higher Secondary, Nattraja Vidhyalya CBSE) on one integrated 70-acre campus in Komarapalayam, Tamil Nadu. Established 1952.',
    url: `${SITE_URL}/our-institutions`,
    numberOfItems: INSTITUTIONS.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': ORG_ID },
    itemListElement: INSTITUTIONS.map((inst) => ({
      '@type': 'ListItem',
      position: inst.position,
      url: inst.url,
      name: inst.name,
      item: {
        '@type': inst.schemaType,
        '@id': inst.schemaId,
        name: inst.name,
        alternateName: inst.alternateName,
        url: inst.url,
        description: inst.schemaDescription,
        foundingDate: String(inst.foundedYear),
        parentOrganization: { '@id': ORG_ID },
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
