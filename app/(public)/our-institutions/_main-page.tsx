import Link from 'next/link'
import {
  Award,
  GraduationCap,
  ArrowRight,
  Users,
  BookOpen,
  Sparkles,
  Calendar,
  ShieldCheck,
  Building2,
  Phone,
  CheckCircle2,
  ChevronDown,
  Star,
  Bus,
  Home,
  Library,
  Dumbbell,
  Hospital,
  Quote,
  Globe,
  MapPin,
} from 'lucide-react'
import {
  ORG_ID,
  SITE_URL,
  PAGE_URL,
  PROGRAMS,
  ACCREDITATION_BODIES,
  EVENTS,
  REVIEWS,
  AGGREGATE_RATING,
  LEADERS,
  SERVICES,
  KNOWS_ABOUT,
  DEFINED_TERMS,
  HERO_IMAGE,
  AISHE_CODES,
} from '@/lib/seo/main-institution/our-institutions-data'

// ─── Constants ──────────────────────────────────────────────────────────────
const DATE_PUBLISHED = '2026-05-19'
const DATE_MODIFIED = '2026-05-19'
// Real Google Maps query URL for the campus (Natarajapuram, Komarapalayam coordinates)
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=JKKN+Institutions+Komarapalayam+Tamil+Nadu'

// ─── Data Models ────────────────────────────────────────────────────────────
type Institution = {
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
  // Direct working URLs (external subdomain pages where they exist,
  // otherwise central JKKN hub pages). Verified against migration 36 doc.
  applyUrl: string
  feeUrl: string
  scholarshipUrl: string
}

const COLLEGES: Institution[] = [
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

const SCHOOLS: Institution[] = [
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

const ALL_INSTITUTIONS = [...COLLEGES, ...SCHOOLS]

const STATS = [
  { number: '9', label: 'Institutions' },
  { number: '50+', label: 'Programs Offered' },
  { number: '92%+', label: 'Placement Rate' },
  { number: '50,000+', label: 'Successful Alumni' },
]

const TOC_ITEMS = [
  { href: '#overview', label: 'Overview' },
  { href: '#colleges', label: 'Colleges' },
  { href: '#schools', label: 'Schools' },
  { href: '#comparison', label: 'Compare' },
  { href: '#services', label: 'Services' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQs' },
  { href: '#apply', label: 'Apply' },
]

const FAQS = [
  {
    q: 'How many institutions does JKKN have?',
    a: 'JKKN Institutions operates 9 educational institutions on one integrated 70-acre campus in Komarapalayam, Tamil Nadu — 7 colleges (Engineering, Dental, Pharmacy, Arts & Science, Allied Health Sciences, Nursing, Education) and 2 schools (Matriculation Higher Secondary and Nattraja Vidhyalya CBSE).',
  },
  {
    q: 'When was JKKN established and by whom?',
    a: 'JKKN Institutions was established in 1952 by the J.K.K. Rangammal Charitable Trust. The trust expanded from a single school in Komarapalayam to today\'s 9-institution group spanning kindergarten through doctoral research — one of Tamil Nadu\'s longest-running educational groups.',
  },
  {
    q: 'Where is the JKKN campus located?',
    a: 'JKKN Institutions occupies a 70-acre integrated campus at Natarajapuram on NH-544 (Salem–Coimbatore Highway), Komarapalayam, Namakkal District, Tamil Nadu — 638183. The campus sits between Erode and Salem, accessible by road and rail; Coimbatore International Airport is ~80 km away.',
  },
  {
    q: 'Is JKKN NAAC accredited?',
    a: 'Yes. JKKN holds NAAC A grade accreditation. Individual institutions also hold their respective regulatory approvals: AICTE (Engineering, Pharmacy, MBA), DCI (Dental), PCI (Pharmacy), INC (Nursing), NCTE (Education), and Tamil Nadu State Board / CBSE recognition (schools).',
  },
  {
    q: 'How many programs does JKKN offer?',
    a: 'JKKN offers 50+ academic programs across UG, PG, and doctoral levels — including B.E./B.Tech, M.Tech, MBA, BDS, MDS, B.Pharm, M.Pharm, Pharm.D, B.Sc/M.Sc Nursing, B.Ed, and diverse arts/science/commerce streams. Schools cover LKG to Class 12 in both Matriculation and CBSE curricula.',
  },
  {
    q: 'What is JKKN\'s placement rate?',
    a: 'JKKN Institutions reports 92%+ placement across professional courses, with 1000+ recruiting partners including TCS, Infosys, Wipro, Cognizant, and major dental/pharma/healthcare employers. Specific placement data varies by college and is published annually in each institution\'s placement report.',
  },
  {
    q: 'Which JKKN college is best for engineering?',
    a: 'JKKN College of Engineering and Technology (Autonomous), established 2008, is the engineering institution — AICTE approved, Anna University affiliated, NAAC A graded. It offers B.E./B.Tech/M.E./M.Tech/MBA across CSE, ECE, EEE, Mechanical, Civil, and AI/ML branches with a strong placement record.',
  },
  {
    q: 'How big is the JKKN campus?',
    a: 'JKKN\'s main campus spans 70 acres on a single integrated site at Komarapalayam, accommodating all 9 institutions — academic blocks, laboratories, libraries, separate hostels for boys and girls, sports facilities, a 350-bed dental teaching hospital, auditoriums, and transport hubs serving Erode and Salem corridors.',
  },
  {
    q: 'Are JKKN colleges autonomous?',
    a: 'Two JKKN colleges hold autonomous status: JKKN College of Engineering and Technology (Autonomous, under Anna University) and JKKN College of Arts and Science (Autonomous, under Periyar University). Other colleges follow their parent university curriculum while exercising independent academic governance.',
  },
  {
    q: 'How do I apply for JKKN admission?',
    a: 'Applications open in March each year via the unified JKKN Admissions portal at jkkn.ai/apply/jkkn-admission-2026. Eligibility, fee structure, scholarships, and counseling vary by program — see the Admissions page or contact +91 4288 274891 / admissions@jkkn.ac.in for college-specific guidance.',
  },
  {
    q: 'Does JKKN offer hostel and transport?',
    a: 'Yes. JKKN provides separate hostel facilities for boys and girls with mess, Wi-Fi, and 24/7 security. College buses cover routes across Namakkal, Erode, Salem, and Coimbatore districts. School-level transport extends to the surrounding Komarapalayam–Erode region.',
  },
  {
    q: 'What scholarships does JKKN provide?',
    a: 'JKKN offers multiple scholarships: Trust Merit Scholarships, First-Graduate aid, Government PMSS (Post-Matric Scholarship), Naan Mudhalvan support, and college-specific grants. Each institution publishes detailed eligibility on its scholarships page — collectively available up to 100% fee waiver for qualifying candidates.',
  },
]

const SERVICE_ICONS: Record<string, typeof Home> = {
  'Student Hostels': Home,
  'Campus Transport': Bus,
  'Central Library': Library,
  'Sports Complex': Dumbbell,
  'Teaching Hospital': Hospital,
}

// ─── JSON-LD @graph Schema ──────────────────────────────────────────────────

function pageGraphSchema() {
  const subOrgRefs = ALL_INSTITUTIONS.map((inst) => ({ '@id': inst.schemaId }))

  const accreditationOrgs = ACCREDITATION_BODIES.map((body) => ({
    '@type': 'Organization',
    name: body.name,
    alternateName: body.short,
    url: body.url,
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // ── CollectionPage (more specific than WebPage for catalog pages) ────
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Our Institutions — 9 Pillars of JKKN Excellence',
        description:
          'JKKN Institutions comprises 7 colleges and 2 schools on one integrated 70-acre campus in Komarapalayam, Tamil Nadu. Established 1952. NAAC A accredited. 92%+ placements.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': ORG_ID },
        mainEntity: { '@id': 'https://jkkn.ac.in/#institutions-catalog' },
        primaryImageOfPage: { '@id': `${PAGE_URL}#hero-image` },
        datePublished: DATE_PUBLISHED,
        dateModified: DATE_MODIFIED,
        inLanguage: 'en-IN',
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        hasPart: [
          { '@id': 'https://jkkn.ac.in/#institutions-catalog' },
          { '@id': `${PAGE_URL}#faq` },
          { '@id': `${PAGE_URL}#programs-catalog` },
        ],
        significantLink: ALL_INSTITUTIONS.map((inst) => inst.url),
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: [
            '[data-speakable="hero-heading"]',
            '[data-speakable="lead-paragraph"]',
            '[data-speakable="entity-definition"]',
            '[data-speakable="stat-number"]',
            '[data-speakable="faq-answer"]',
          ],
        },
      },

      // ── Hero ImageObject ──────────────────────────────────────────────────
      {
        '@type': 'ImageObject',
        '@id': `${PAGE_URL}#hero-image`,
        url: HERO_IMAGE.url,
        width: HERO_IMAGE.width,
        height: HERO_IMAGE.height,
        caption: HERO_IMAGE.caption,
        creditText: 'JKKN Institutions',
        creator: { '@id': ORG_ID },
        license: `${SITE_URL}/terms-and-conditions`,
        acquireLicensePage: `${SITE_URL}/contact`,
      },

      // ── EducationalOrganization (deep) ────────────────────────────────────
      {
        '@type': ['EducationalOrganization', 'CollegeOrUniversity'],
        '@id': ORG_ID,
        name: 'JKKN Institutions',
        alternateName: [
          'J.K.K. Nattraja Educational Institutions',
          'JKKN Group',
          'JKK Nattraja Institutions',
        ],
        url: SITE_URL,
        logo: { '@id': `${SITE_URL}/#logo` },
        image: { '@id': `${PAGE_URL}#hero-image` },
        foundingDate: '1952',
        founder: { '@id': `${SITE_URL}/leadership#founder` },
        employee: [
          { '@id': `${SITE_URL}/leadership#founder` },
          { '@id': `${SITE_URL}/leadership#chairman` },
        ],
        slogan: 'Your Success — Our Tradition',
        description:
          'JKKN Institutions is a group of 9 educational institutions — 7 colleges and 2 schools — on a 70-acre integrated campus in Komarapalayam, Tamil Nadu, India. Established 1952. NAAC A accredited. 50,000+ alumni.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Natarajapuram, NH-544 (Salem–Coimbatore Highway)',
          addressLocality: 'Komarapalayam',
          addressRegion: 'Tamil Nadu',
          postalCode: '638183',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 11.4456,
          longitude: 77.6964,
        },
        hasMap: GOOGLE_MAPS_URL,
        areaServed: [
          'Tamil Nadu',
          'Namakkal District',
          'Erode District',
          'Salem District',
          'Komarapalayam',
        ],
        telephone: '+91-4288-274891',
        email: 'admissions@jkkn.ac.in',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+91-4288-274891',
            email: 'admissions@jkkn.ac.in',
            contactType: 'admissions',
            areaServed: 'IN',
            availableLanguage: ['en', 'ta'],
          },
        ],
        availableLanguage: [
          { '@type': 'Language', name: 'English', alternateName: 'en' },
          { '@type': 'Language', name: 'Tamil', alternateName: 'ta' },
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '17:00',
          },
        ],
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 1500 },
        alumni: { '@type': 'QuantitativeValue', value: 50000 },
        knowsAbout: KNOWS_ABOUT,
        brand: {
          '@type': 'Brand',
          name: 'JKKN',
          logo: { '@id': `${SITE_URL}/#logo` },
          slogan: 'Your Success — Our Tradition',
        },
        memberOf: [
          {
            '@type': 'Organization',
            name: 'Association of Indian Universities (AIU)',
            url: 'https://www.aiu.ac.in/',
          },
        ],
        isAccreditedBy: accreditationOrgs,
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Accreditation',
            name: 'NAAC A Grade',
            recognizedBy: {
              '@type': 'Organization',
              name: 'National Assessment and Accreditation Council',
              url: 'https://www.naac.gov.in/',
            },
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Approval',
            name: 'AICTE Approved',
            recognizedBy: {
              '@type': 'Organization',
              name: 'All India Council for Technical Education',
              url: 'https://www.aicte-india.org/',
            },
          },
        ],
        identifier: Object.entries(AISHE_CODES).map(([orgId, code]) => ({
          '@type': 'PropertyValue',
          propertyID: 'AISHE',
          value: code,
          subjectOf: { '@id': orgId },
        })),
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: AGGREGATE_RATING.ratingValue,
          reviewCount: AGGREGATE_RATING.reviewCount,
          bestRating: AGGREGATE_RATING.bestRating,
          worstRating: AGGREGATE_RATING.worstRating,
        },
        review: REVIEWS.map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.authorName },
          datePublished: r.date,
          reviewBody: r.body,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(r.rating),
            bestRating: '5',
            worstRating: '1',
          },
        })),
        subOrganization: subOrgRefs,
        hasOfferCatalog: { '@id': `${PAGE_URL}#programs-catalog` },
        event: EVENTS.map((_, i) => ({ '@id': `${PAGE_URL}#event-${i}` })),
        makesOffer: SERVICES.map((s, i) => ({ '@id': `${PAGE_URL}#service-${i}` })),
        sameAs: [
          'https://www.facebook.com/myjkkn',
          'https://www.instagram.com/jkkninstitutions/',
          'https://www.linkedin.com/school/jkkninstitutions/',
          'https://www.youtube.com/@JKKNINSTITUTIONS',
          'https://x.com/jkkninstitution',
        ],
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Campus Size', value: '70 acres' },
          { '@type': 'PropertyValue', name: 'Number of Institutions', value: 9 },
          { '@type': 'PropertyValue', name: 'Number of Colleges', value: 7 },
          { '@type': 'PropertyValue', name: 'Number of Schools', value: 2 },
          { '@type': 'PropertyValue', name: 'Founded Year', value: 1952 },
          { '@type': 'PropertyValue', name: 'Programs Offered', value: '50+' },
          { '@type': 'PropertyValue', name: 'Placement Rate', value: '92%+' },
          { '@type': 'PropertyValue', name: 'Alumni Count', value: '50,000+' },
        ],
      },

      // ── Logo (ImageObject ref) ────────────────────────────────────────────
      {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo.png`,
        caption: 'JKKN Institutions logo',
      },

      // ── Person (Founder) ──────────────────────────────────────────────────
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/leadership#founder`,
        name: LEADERS[0].name,
        honorificPrefix: 'Smt.',
        jobTitle: LEADERS[0].role,
        description: LEADERS[0].description,
        worksFor: { '@id': ORG_ID },
        knowsAbout: ['Education Philanthropy', 'Rural Education', 'Charitable Trust Administration'],
      },

      // ── Person (Chairman) ─────────────────────────────────────────────────
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/leadership#chairman`,
        name: LEADERS[1].name,
        honorificPrefix: 'Sri',
        jobTitle: LEADERS[1].role,
        description: LEADERS[1].description,
        worksFor: { '@id': ORG_ID },
        memberOf: { '@id': ORG_ID },
      },

      // ── OfferCatalog with all 45+ programs ────────────────────────────────
      {
        '@type': 'OfferCatalog',
        '@id': `${PAGE_URL}#programs-catalog`,
        name: 'JKKN Academic Programs — Complete Catalog',
        description: `${PROGRAMS.length} academic programs across all 9 JKKN institutions, spanning UG, PG, Doctoral, Diploma, and School levels.`,
        numberOfItems: PROGRAMS.length,
        itemListElement: PROGRAMS.map((p, idx) => ({
          '@type': 'EducationalOccupationalProgram',
          '@id': `${PAGE_URL}#program-${idx}`,
          name: p.name,
          programType: p.level,
          educationalLevel: p.level,
          occupationalCategory: p.category,
          timeToComplete: `P${p.durationYears}Y`,
          provider: { '@id': p.providerOrgId },
          educationalCredentialAwarded: p.level,
        })),
      },

      // ── ItemList (the 9 institutions) ─────────────────────────────────────
      {
        '@type': 'ItemList',
        '@id': 'https://jkkn.ac.in/#institutions-catalog',
        name: 'JKKN Institutions — 9 Educational Pillars',
        description:
          'Complete list of all 9 institutions under JKKN: 7 colleges and 2 schools, established 1952, located in Komarapalayam, Tamil Nadu',
        numberOfItems: 9,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: ALL_INSTITUTIONS.map((inst) => ({
          '@type': 'ListItem',
          position: inst.position,
          item: {
            '@type': inst.schemaType,
            '@id': inst.schemaId,
            name: inst.name,
            alternateName: inst.alternateName,
            url: inst.url,
            description: inst.schemaDescription,
            foundingDate: String(inst.foundedYear),
            parentOrganization: { '@id': ORG_ID },
            identifier: AISHE_CODES[inst.schemaId]
              ? [
                  {
                    '@type': 'PropertyValue',
                    propertyID: 'AISHE',
                    value: AISHE_CODES[inst.schemaId],
                  },
                ]
              : undefined,
          },
        })),
      },

      // ── BreadcrumbList ────────────────────────────────────────────────────
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Our Institutions',
            item: PAGE_URL,
          },
        ],
      },

      // ── FAQPage ───────────────────────────────────────────────────────────
      {
        '@type': 'FAQPage',
        '@id': `${PAGE_URL}#faq`,
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },

      // ── EducationEvent entries ────────────────────────────────────────────
      ...EVENTS.map((e, i) => ({
        '@type': 'EducationEvent',
        '@id': `${PAGE_URL}#event-${i}`,
        name: e.name,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
        location: { '@id': ORG_ID },
        organizer: { '@id': ORG_ID },
        offers: e.applyUrl
          ? {
              '@type': 'Offer',
              url: e.applyUrl,
              validFrom: e.startDate,
              availability: 'https://schema.org/InStock',
              priceCurrency: 'INR',
              price: '0',
            }
          : undefined,
      })),

      // ── Service entries ───────────────────────────────────────────────────
      ...SERVICES.map((s, i) => ({
        '@type': 'Service',
        '@id': `${PAGE_URL}#service-${i}`,
        name: s.name,
        serviceType: s.serviceType,
        description: s.description,
        provider: { '@id': ORG_ID },
        areaServed: { '@id': ORG_ID },
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
        },
      })),

      // ── DefinedTermSet (for AI knowledge graph) ───────────────────────────
      {
        '@type': 'DefinedTermSet',
        '@id': `${PAGE_URL}#glossary`,
        name: 'JKKN Glossary',
        hasDefinedTerm: DEFINED_TERMS.map((t) => ({
          '@type': 'DefinedTerm',
          name: t.term,
          description: t.description,
          inDefinedTermSet: { '@id': `${PAGE_URL}#glossary` },
        })),
      },
    ],
  }
}

// ─── UI Components ──────────────────────────────────────────────────────────

function InstitutionLink({
  inst,
  className,
  children,
}: {
  inst: Institution
  className?: string
  children: React.ReactNode
}) {
  if (inst.isExternal) {
    return (
      <a href={inst.url} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={inst.url} className={className}>
      {children}
    </Link>
  )
}

function MicroStat({ icon: Icon, label }: { icon: typeof Calendar; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/5 px-2.5 py-1 text-[12px] font-medium text-primary/80">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  )
}

function StarRow({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${
            n <= rating ? 'fill-secondary text-secondary' : 'fill-none text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  )
}

function InstitutionCard({ inst }: { inst: Institution }) {
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-12px_rgba(11,109,65,0.25)]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary via-brand-primary-light to-secondary transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-brand-primary-light text-sm font-bold text-white shadow-md">
          {inst.position}
        </span>
        <span className="rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-on-light">
          {inst.schemaType === 'CollegeOrUniversity' ? 'College' : 'School'}
        </span>
      </div>

      <h3 className="mb-2.5 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
        <InstitutionLink inst={inst} className="hover:underline">
          {inst.name}
        </InstitutionLink>
      </h3>

      <p className="mb-4 text-[14.5px] leading-relaxed text-muted-foreground">
        {inst.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-1.5">
        <MicroStat icon={Calendar} label={`Est. ${inst.foundedYear}`} />
        <MicroStat icon={ShieldCheck} label={inst.approval} />
      </div>

      <div className="mt-auto space-y-3 border-t border-primary/10 pt-4">
        <InstitutionLink
          inst={inst}
          className="inline-flex items-center gap-1.5 border-b-2 border-transparent pb-0.5 text-sm font-semibold text-primary transition-all hover:border-secondary"
        >
          {inst.visitLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </InstitutionLink>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12.5px]">
          <a
            href={inst.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            Apply
          </a>
          <span className="text-muted-foreground/30">·</span>
          <a
            href={inst.feeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            Fees
          </a>
          <span className="text-muted-foreground/30">·</span>
          <a
            href={inst.scholarshipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted-foreground hover:text-primary hover:underline"
          >
            Scholarships
          </a>
        </div>
      </div>
    </li>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function MainOurInstitutionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraphSchema()) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-primary/10 bg-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-muted-foreground">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-muted-foreground/60">›</span>
            <span aria-current="page" className="text-muted-foreground">
              Our Institutions
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="section-green-gradient-diagonal relative overflow-hidden px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
        <div
          aria-hidden
          className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl from-secondary/10 to-transparent opacity-60"
        />
        <div className="relative mx-auto max-w-7xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
            <Award className="h-3.5 w-3.5" />
            NAAC A Accredited · Est. 1952
          </span>

          <h1
            data-speakable="hero-heading"
            className="mb-5 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Our Institutions —{' '}
            <span className="text-secondary">9 Pillars</span>
            <br className="hidden sm:block" />
            of JKKN Excellence
          </h1>

          <p
            data-speakable="lead-paragraph"
            className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            JKKN Institutions comprises{' '}
            <strong className="font-semibold text-secondary">
              7 colleges and 2 schools
            </strong>{' '}
            on one integrated 70-acre campus in Komarapalayam, Tamil Nadu — offering 50+
            career-focused programs from school education through doctoral research.
            Established 1952 by the J.K.K. Rangammal Charitable Trust, NAAC A accredited
            with 92%+ placement success and 50,000+ successful alumni.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
              Last reviewed: 19 May 2026
            </p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-sm hover:bg-white/20"
            >
              <MapPin className="h-3.5 w-3.5 text-secondary" />
              View campus on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <div className="relative -mt-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border-t-4 border-secondary bg-white shadow-[0_18px_45px_-12px_rgba(11,109,65,0.22)] md:grid-cols-4">
            {STATS.map((stat, idx) => {
              const isLastCol = (idx + 1) % 2 === 0
              const isLastRow = idx >= STATS.length - 2
              return (
                <div
                  key={stat.label}
                  className={[
                    'px-3 py-6 text-center sm:px-5 sm:py-7',
                    isLastCol ? '' : 'border-r border-primary/10',
                    isLastRow ? '' : 'border-b border-primary/10 md:border-b-0',
                    idx === STATS.length - 1 ? 'md:border-r-0' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div
                    data-speakable="stat-number"
                    className="text-3xl font-bold leading-none tracking-tight text-primary sm:text-4xl md:text-[34px]"
                  >
                    {stat.number}
                  </div>
                  <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Rating strip (visible component for AggregateRating schema compliance) */}
      <div className="border-b border-primary/10 bg-cream/40 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 text-sm">
          <StarRow rating={Math.round(parseFloat(AGGREGATE_RATING.ratingValue))} />
          <span className="font-bold text-foreground">
            {AGGREGATE_RATING.ratingValue}/5
          </span>
          <span className="text-muted-foreground">
            based on{' '}
            <a href="#reviews" className="font-semibold text-primary hover:underline">
              {AGGREGATE_RATING.reviewCount} reviews
            </a>
          </span>
        </div>
      </div>

      {/* On this page TOC */}
      <nav
        aria-label="On this page"
        className="sticky top-16 z-30 -mt-1 border-y border-primary/10 bg-white/95 backdrop-blur-sm sm:top-20"
      >
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex min-w-max items-center gap-1 py-3 text-sm">
            <li className="pr-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              On this page:
            </li>
            {TOC_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* GEO entity definition */}
      <section id="overview" className="bg-cream/40 px-4 py-14 sm:px-6 lg:px-8 scroll-mt-32">
        <div className="mx-auto max-w-4xl">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Building2 className="h-3.5 w-3.5" />
            About JKKN Institutions
          </span>
          <h2 className="mb-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-[2rem]">
            What is JKKN Institutions?
          </h2>
          <p
            data-speakable="entity-definition"
            className="text-base leading-relaxed text-foreground/80 sm:text-lg"
          >
            <strong className="font-semibold text-primary">JKKN Institutions</strong> is
            a group of <strong>9 educational institutions</strong> — 7 colleges and 2
            schools — operated by the{' '}
            <strong>J.K.K. Rangammal Charitable Trust</strong> on a{' '}
            <strong>70-acre integrated campus</strong> in{' '}
            <strong>Komarapalayam, Tamil Nadu, India</strong>. Established in{' '}
            <strong>1952</strong>, the group is <strong>NAAC A accredited</strong> and
            serves <strong>50,000+ alumni</strong> with <strong>50+ academic programs</strong>{' '}
            from school education through doctoral research — making it one of Tamil
            Nadu&apos;s longest-running and most comprehensive education groups.
          </p>

          {/* Accreditation strip */}
          <div className="mt-10">
            <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Accredited · Approved · Affiliated (Click to verify)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {ACCREDITATION_BODIES.map((a) => (
                <a
                  key={a.short}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${a.name} — Click to verify on official site`}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-white px-3 py-2 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-[13px] font-semibold text-foreground">
                    {a.short}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7 Colleges */}
      <section id="colleges" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 scroll-mt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              Higher Education
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.5rem]">
              Our <span className="text-secondary">7</span> Colleges
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Each college is independently accredited, affiliated to a recognized
              university, and operates with autonomous academic governance — offering
              specialized programs from undergraduate to doctoral level.
            </p>
          </div>

          <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {COLLEGES.map((inst) => (
              <InstitutionCard key={inst.position} inst={inst} />
            ))}
          </ul>
        </div>
      </section>

      {/* 2 Schools */}
      <section
        id="schools"
        className="bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 scroll-mt-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              School Education
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.5rem]">
              Our <span className="text-secondary">2</span> Schools
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Foundational education from kindergarten through Class 12, preparing
              students for higher education at JKKN&apos;s own colleges or elsewhere — with
              smart classrooms, sports facilities, and holistic development.
            </p>
          </div>

          <ul className="mx-auto grid max-w-5xl list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
            {SCHOOLS.map((inst) => (
              <InstitutionCard key={inst.position} inst={inst} />
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison Table */}
      <section
        id="comparison"
        className="bg-cream/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 scroll-mt-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              At a Glance
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.25rem]">
              Compare All <span className="text-secondary">9</span> Institutions
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Quick side-by-side reference — founding year, regulatory approvals,
              university affiliations, and key programs across every JKKN institution.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-[0_10px_30px_-12px_rgba(11,109,65,0.18)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider">#</th>
                    <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider">Institution</th>
                    <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider">Est.</th>
                    <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider">Approval</th>
                    <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider">Affiliation</th>
                    <th className="px-4 py-3.5 text-[11px] font-bold uppercase tracking-wider">Key Programs</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_INSTITUTIONS.map((inst, idx) => (
                    <tr
                      key={inst.position}
                      className={`border-t border-primary/10 transition-colors hover:bg-primary/5 ${
                        idx % 2 === 1 ? 'bg-cream/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5 font-bold text-primary">{inst.position}</td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        <InstitutionLink inst={inst} className="hover:text-primary hover:underline">
                          {inst.name}
                        </InstitutionLink>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {inst.schemaType === 'CollegeOrUniversity' ? 'College' : 'School'}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-foreground">{inst.foundedYear}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{inst.approval}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{inst.affiliation}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{inst.keyPrograms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Scroll horizontally on small screens · Click any institution name to visit its site
          </p>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="bg-cream/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 scroll-mt-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Building2 className="h-3.5 w-3.5" />
              Campus Services
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.25rem]">
              <span className="text-secondary">Student Services</span> & Facilities
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Everything a student needs on a single integrated 70-acre campus — housing,
              transport, libraries, sports, and a teaching hospital.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map((s) => {
              const Icon = SERVICE_ICONS[s.name] ?? Building2
              return (
                <div
                  key={s.name}
                  className="rounded-xl border border-primary/10 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-foreground">{s.name}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials */}
      <section
        id="reviews"
        className="bg-cream/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 scroll-mt-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Star className="h-3.5 w-3.5" />
              Student Voices
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.25rem]">
              What Students &amp; Parents <span className="text-secondary">Say</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <StarRow rating={Math.round(parseFloat(AGGREGATE_RATING.ratingValue))} />
              <span className="font-bold text-foreground">
                {AGGREGATE_RATING.ratingValue}/5
              </span>
              <span className="text-muted-foreground">
                · {AGGREGATE_RATING.reviewCount} verified reviews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {REVIEWS.map((r) => (
              <figure
                key={r.authorName + r.date}
                className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm"
              >
                <Quote className="mb-3 h-6 w-6 text-secondary" />
                <blockquote className="mb-4 text-[15px] leading-relaxed text-foreground/80">
                  {r.body}
                </blockquote>
                <figcaption className="flex items-center justify-between border-t border-primary/10 pt-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">{r.authorName}</p>
                    <p className="text-xs text-muted-foreground">{r.authorContext}</p>
                  </div>
                  <StarRow rating={r.rating} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24 scroll-mt-32"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Quick Answers
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.25rem]">
              Frequently Asked <span className="text-secondary">Questions</span>
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Quick answers to the most common questions about JKKN Institutions —
              admissions, accreditation, programs, campus, and more.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-primary/15 bg-white p-5 shadow-sm transition-all hover:shadow-md open:shadow-md sm:p-6"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-semibold text-foreground transition-colors group-open:text-primary sm:text-lg">
                  <span className="flex-1">
                    <span className="mr-2 text-primary/70">Q{idx + 1}.</span>
                    {faq.q}
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p
                  data-speakable="faq-answer"
                  className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base"
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/15 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-muted-foreground">
              Still have questions? Our admissions counselors are happy to help.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
              <a
                href="tel:+914288274891"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                +91 4288 274891
              </a>
              <span className="text-muted-foreground/40">·</span>
              <a
                href="mailto:admissions@jkkn.ac.in"
                className="font-semibold text-primary hover:underline"
              >
                admissions@jkkn.ac.in
              </a>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                Available in English &amp; Tamil
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="apply"
        className="section-green-gradient-diagonal relative overflow-hidden px-4 py-20 text-center text-white sm:px-6 sm:py-24 lg:px-8 scroll-mt-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,222,89,0.18),transparent_55%)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-secondary" />
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.5rem]">
            Take the <span className="text-secondary">Next Step</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Admissions 2026-27 are now open across all 9 institutions. Speak to our
            counselors today and secure your seat at JKKN — Tamil Nadu&apos;s most trusted
            education group since 1952.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-bold text-brand-primary-dark shadow-lg transition-all hover:-translate-y-0.5 hover:bg-brand-secondary-light hover:shadow-xl"
            >
              <Users className="h-4 w-4" />
              Apply for Admission
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/60 px-8 py-3.5 text-sm font-bold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Contact Counselor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
