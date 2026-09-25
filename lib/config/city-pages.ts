// lib/config/city-pages.ts
// City landing page configuration for engg.jkkn.ac.in
// These pages are ONLY rendered when NEXT_PUBLIC_INSTITUTION_ID === 'engineering'

export interface CityTransport {
  routeDescription: string
  busTerminal: string
  nearestRailway: string
  nearestAirport: string
  campusAddress: string
  googleMapsUrl: string
}

export interface CityFAQ {
  question: string
  answer: string
}

export interface CityCrossLink {
  displayName: string
  slug: string
  distanceLabel: string
  emoji: string
}

export interface CityHeroStat {
  num: string
  label: string
}

// An official list of the engineering colleges inside a district, rendered as a table on
// that city's page. Only for a district the campus is NOT in: it answers the "colleges in
// <district>" searches honestly and says where JKKNCET sits relative to that list.
export interface CityDistrictColleges {
  heading: string
  intro: string
  colleges: Array<{ name: string; tneaCode: string }>
  sourceLabel: string
  sourceUrl: string
  readOn: string
  jkknNote: string
}

export interface CityPageConfig {
  // Identity
  slug: string
  displayName: string

  // Optional overrides. When absent the shared template text is used.
  h1?: string
  heroStatItems?: CityHeroStat[]
  districtColleges?: CityDistrictColleges

  // Distance & Travel
  distanceKm: string
  travelTime: string

  // Hero
  heroSubheading: string
  heroStats: {
    distanceStat: string
    programmes: string
    distanceLabel: string
  }

  // WhatsApp
  whatsappMessage: string

  // Why Choose section
  whyChooseHeadline: string
  whyChooseSubtitle: string

  // How to Reach
  reachHeadline: string
  reachSummary: string
  transport: CityTransport

  // Testimonials (placeholder — TODO: replace with real testimonials)
  testimonials: Array<{
    quote: string
    author: string
    role: string
  }>

  // FAQs
  faqs: CityFAQ[]

  // Cross-city navigation
  crossLinks: CityCrossLink[]

  // SEO
  seo: {
    title: string
    description: string
    canonicalPath: string
    ogImage: string
    twitterDescription: string
  }

  // Schema.org
  schema: {
    breadcrumbLabel: string
    areaServedCity: string
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared constants across all city pages
// ─────────────────────────────────────────────────────────────────────────────

const CAMPUS_ADDRESS =
  'JKKN Institutions, Natarajapuram, NH-544 (Salem To Coimbatore National Highway), Komarapalayam (TK), Namakkal (DT), Tamil Nadu - 638183'

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=JKKN+College+of+Engineering+and+Technology%2C+Komarapalayam'

// ─────────────────────────────────────────────────────────────────────────────
// All 12 City Configurations
// ─────────────────────────────────────────────────────────────────────────────

export const CITY_PAGES_CONFIG: CityPageConfig[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // COIMBATORE
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'coimbatore',
    displayName: 'Coimbatore',
    distanceKm: '112 km',
    travelTime: 'About 2.5 hours',
    heroSubheading:
      'About 2.5 hours from Coimbatore on NH-544. JKKN College of Engineering and Technology in Komarapalayam offers AICTE-approved engineering programmes affiliated to Anna University, with a residential campus and hostel.',
    heroStats: {
      distanceStat: '112km',
      distanceLabel: 'from Coimbatore',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Coimbatore%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Coimbatore Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 112 km from Coimbatore on NH-544, in Komarapalayam, Namakkal district. Most learners from Coimbatore stay in the campus hostel; college transport is available.',
    reachHeadline: 'How to Reach from Coimbatore',
    reachSummary: '112 km · about 2.5 hours',
    transport: {
      routeDescription: 'NH-544 (Coimbatore-Salem Highway) — direct route',
      busTerminal:
        'Frequent inter-city buses from Gandhipuram and Ukkadam bus stands to Komarapalayam/Namakkal route',
      nearestRailway: 'Coimbatore Junction (~105 km from campus)',
      nearestAirport:
        'Coimbatore International Airport (Code: CJB) (~100 km)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Coimbatore to be added here. Include their experience at JKKNCET, what they liked about the campus, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Coimbatore to be added here. Focus on the ease of commute/hostel life and the quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Coimbatore?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 112 km from Coimbatore and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Coimbatore?',
        answer:
          'JKKNCET is about 112 km from Coimbatore city centre, which takes about 2.5 hours by road via NH-544 (Coimbatore-Salem Highway) — direct route. Regular bus services are available from Coimbatore.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Coimbatore students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Coimbatore can also opt for daily commute as the campus is about 2.5 hours away. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '67 km', emoji: '🎯' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '84 km', emoji: '🚗' },
    ],
    seo: {
      title: 'Best Engineering College in Coimbatore | JKKNCET — Admissions Open 2026-27',
      description:
        'JKKN College of Engineering and Technology is 112 km from Coimbatore on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/coimbatore',
      ogImage: '/images/city/coimbatore-og.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 112 km from Coimbatore on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Coimbatore',
      areaServedCity: 'Coimbatore',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ERODE
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'erode',
    displayName: 'Erode',
    // Distance: the user's Google Maps measurement, campus to Erode bus stand via NH-544,
    // 18.4 km / 28 min (2026-09-21, the same Natarajapuram campus the dental and pharmacy
    // Erode pages use). Erode Junction: 21 km, measured the same way for the pharmacy page.
    distanceKm: '18 km',
    travelTime: 'About 30 minutes',
    h1: 'Engineering College near Erode — 18 km on NH-544',
    heroSubheading:
      'JKKN College of Engineering and Technology is in Komarapalayam, Namakkal district, 18 km from Erode bus stand on NH-544. AICTE approved and affiliated to Anna University, with 372 approved seats in 2026-27.',
    heroStats: {
      distanceStat: '18km',
      distanceLabel: 'from Erode',
      programmes: '7',
    },
    // Every figure here is read from a document hosted on this site:
    // AICTE EOA 2026-27 (/pdfs/mandatory-disclosure/Mandatory-Disclosure.pdf) for the seats,
    // NIRF 2026 IR-E-C-37096 (/documents/nirf/2026/engineering.pdf) for the placement row.
    heroStatItems: [
      { num: '18 km', label: 'from Erode bus stand' },
      { num: '372', label: 'AICTE-approved seats, 2026-27' },
      { num: '7', label: 'UG + PG programmes' },
      { num: '23 of 53', label: 'placed, 2024-25 (NIRF 2026)' },
    ],
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Erode%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Erode Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 18 km from Erode on NH-544, in Komarapalayam, Namakkal district. Learners from Erode can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Erode',
    reachSummary: '18 km · about 30 minutes',
    transport: {
      routeDescription: 'NH-544 via Komarapalayam',
      busTerminal:
        'Buses available from Erode New Bus Stand to Komarapalayam — frequent services',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Coimbatore International Airport (~100 km)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Erode to be added here. Include their experience at JKKNCET, what they liked about the campus, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Erode to be added here. Focus on the ease of commute and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    // Names and TNEA codes copied from Anna University's own district page on 2026-09-25.
    // Kongu School of Architecture (TNEA 2344) is on that page too; it is left out because
    // this table lists engineering colleges.
    districtColleges: {
      heading: 'Engineering Colleges in Erode District',
      intro:
        'Anna University lists these engineering colleges in Erode district. JKKNCET is not on this list: it is in Namakkal district, 18 km from Erode.',
      colleges: [
        { name: 'Aishwarya College of Engineering and Technology', tneaCode: '2332' },
        { name: 'Al-Ameen Engineering College (Autonomous)', tneaCode: '2652' },
        { name: 'Bannari Amman Institute of Technology (Autonomous)', tneaCode: '2702' },
        { name: 'Erode Sengunthar Engineering College (Autonomous)', tneaCode: '2707' },
        {
          name: 'Government College of Engineering, Erode (formerly Institute of Road and Transport Technology)',
          tneaCode: '2709',
        },
        { name: 'J K K Munirajah College of Technology', tneaCode: '2758' },
        { name: 'Kongu Engineering College (Autonomous)', tneaCode: '2711' },
        { name: 'M.P. Nachimuthu M. Jaganathan Engineering College', tneaCode: '2713' },
        { name: 'Nandha College of Technology', tneaCode: '2752' },
        { name: 'Nandha Engineering College (Autonomous)', tneaCode: '2715' },
        { name: 'Shree Venkateshwara Hi-tech Engineering College', tneaCode: '2747' },
        { name: 'Surya Engineering College', tneaCode: '2748' },
        { name: 'Velalar College of Engineering and Technology (Autonomous)', tneaCode: '2723' },
      ],
      sourceLabel: 'Anna University, Centre for Affiliation of Institutions — Erode district list',
      sourceUrl: 'https://www.annauniv.edu/cai/District%20wise/district/Erode.php',
      readOn: '25 September 2026',
      jkknNote:
        'JKKN College of Engineering and Technology — Komarapalayam, Namakkal district, 18 km from Erode on NH-544.',
    },
    faqs: [
      {
        question: 'Is JKKN College of Engineering and Technology in Erode district?',
        answer:
          'No. JKKN College of Engineering and Technology is in Komarapalayam, Namakkal district, 18 km from Erode bus stand on NH-544. Many learners from Erode travel daily or stay in the campus hostel.',
      },
      {
        question: 'How many engineering colleges are there in Erode district?',
        answer:
          "Anna University's district list names 13 engineering colleges in Erode district, plus one school of architecture. The full list is on this page. JKKNCET is not one of them because it is in Namakkal district.",
      },
      {
        question: 'Is there a government engineering college in Erode?',
        answer:
          "Yes. Government College of Engineering, Erode, formerly the Institute of Road and Transport Technology, is on Anna University's Erode district list with TNEA code 2709.",
      },
      {
        question: 'How do I choose an engineering college near Erode?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees, and your daily travel time. JKKNCET publishes its AICTE approval and its NIRF filings on this website.',
      },
      {
        question:
          'Is JKKN College of Engineering and Technology the same as JKK Munirajah College of Technology?',
        answer:
          "No. They are different colleges. JKKN College of Engineering and Technology is in Komarapalayam, Namakkal district. J K K Munirajah College of Technology is in Erode district, TNEA code 2758 on Anna University's list.",
      },
      {
        question: 'How far is JKKNCET from Erode?',
        answer:
          'JKKNCET is 18 km from Erode bus stand, about 30 minutes by road on NH-544 via Komarapalayam. Erode Junction railway station is about 21 km from the campus. Regular buses run from Erode New Bus Stand to Komarapalayam.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'B.E. Computer Science and Engineering, B.E. Electronics and Communication, B.E. Electrical and Electronics, B.E. Mechanical Engineering and B.Tech Information Technology, 60 seats each in 2026-27, plus M.E. Computer Science and Engineering and MBA. All are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'Does JKKNCET provide hostel for Erode students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Erode can also travel daily, as the campus is about 30 minutes from Erode. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '112 km', emoji: '🌆' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '67 km', emoji: '🎯' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '84 km', emoji: '🚗' },
      { displayName: 'Perundurai', slug: 'perundurai', distanceLabel: '29 km', emoji: '🛤️' },
    ],
    seo: {
      title: 'Engineering Colleges near Erode - JKKNCET, 18 km on NH-544',
      description:
        'JKKNCET is 18 km from Erode on NH-544, in Namakkal district. AICTE approved, Anna University affiliated. With the official list of Erode district engineering colleges.',
      canonicalPath: '/erode',
      ogImage: '/images/city/erode-og.jpg',
      twitterDescription:
        'Engineering college near Erode: JKKNCET, 18 km on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering Colleges near Erode',
      areaServedCity: 'Erode',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // NAMAKKAL
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'namakkal',
    displayName: 'Namakkal',
    distanceKm: '65 km',
    travelTime: 'About 1 hour 20 minutes',
    heroSubheading:
      'JKKN College of Engineering and Technology is in Komarapalayam, Namakkal district, 65 km from Namakkal town on NH-544. AICTE approved and affiliated to Anna University, with support from the Training and Placement Cell.',
    heroStats: {
      distanceStat: '65km',
      distanceLabel: 'from Namakkal',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Namakkal%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Namakkal Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is in Namakkal district, in Komarapalayam on NH-544, about 1 hour 20 minutes from Namakkal town. Learners can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Namakkal',
    reachSummary: '65 km · about 1 hour 20 minutes',
    transport: {
      routeDescription: 'Local route via Komarapalayam (within Namakkal District)',
      busTerminal:
        'Frequent local bus services from Namakkal Town Bus Stand to Komarapalayam',
      nearestRailway: 'Salem Junction Railway Station (about 55 km from campus)',
      nearestAirport: 'Salem Airport (~60 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Namakkal to be added here. Include their experience at JKKNCET, the convenience of studying locally, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Namakkal to be added here. Focus on the proximity advantage and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Namakkal?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 65 km from Namakkal and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Namakkal?',
        answer:
          'JKKNCET is about 65 km from Namakkal town centre, which takes about 1 hour 20 minutes by road. Regular local bus services are available from Namakkal Bus Stand to Komarapalayam.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Namakkal students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. However, Namakkal students can also easily commute daily as the campus is about 1 hour 20 minutes away. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly — 65 km from Namakkal. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '112 km', emoji: '🌆' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '67 km', emoji: '🎯' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '84 km', emoji: '🚗' },
      { displayName: 'Rasipuram', slug: 'rasipuram', distanceLabel: '60 km', emoji: '🧵' },
    ],
    seo: {
      title: 'Best Engineering College in Namakkal | JKKNCET — Admissions Open 2026-27',
      description:
        'JKKN College of Engineering and Technology is in Namakkal district, 65 km from Namakkal town on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/namakkal',
      ogImage: '/images/city/namakkal-og.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 65 km from Namakkal on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Namakkal',
      areaServedCity: 'Namakkal',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SALEM
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'salem',
    displayName: 'Salem',
    distanceKm: '57 km',
    travelTime: 'About 1 hour',
    heroSubheading:
      '57 km from Salem — quality engineering education within easy reach. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '57km',
      distanceLabel: 'from Salem',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Salem%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Salem Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 57 km from Salem on NH-544, in Komarapalayam, Namakkal district. Learners from Salem can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Salem',
    reachSummary: '57 km · about 1 hour',
    transport: {
      routeDescription: 'NH-544 (Salem-Coimbatore Highway) — direct route',
      busTerminal:
        'Frequent buses from Salem New Bus Stand and Shevapet to Komarapalayam/Namakkal route',
      nearestRailway: 'Salem Junction Railway Station (~55 km by road from campus)',
      nearestAirport: 'Salem Airport (~55 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Salem to be added here. Include their experience at JKKNCET, what they liked about the campus, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Salem to be added here. Focus on the commute experience and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Salem?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 57 km from Salem and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Salem?',
        answer:
          'JKKNCET is about 57 km from Salem city centre, which takes about 1 hour by road via NH-544 (Salem-Coimbatore Highway) — direct route. Regular bus services are available from Salem.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Salem students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Salem can also opt for daily commute as the campus is about 1 hour away. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '112 km', emoji: '🌆' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '67 km', emoji: '🎯' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '84 km', emoji: '🚗' },
      { displayName: 'Mettur', slug: 'mettur', distanceLabel: '45 km', emoji: '💧' },
      { displayName: 'Dharmapuri', slug: 'dharmapuri', distanceLabel: '110 km', emoji: '🌄' },
    ],
    seo: {
      title: 'Best Engineering College in Salem | JKKNCET — Admissions Open 2026-27',
      description:
        'JKKN College of Engineering and Technology is 57 km from Salem on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/salem',
      ogImage: '/images/city/salem-og.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 57 km from Salem on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Salem',
      areaServedCity: 'Salem',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TIRUPPUR
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'tiruppur',
    displayName: 'Tiruppur',
    distanceKm: '67 km',
    travelTime: 'About 1.5 hours',
    heroSubheading:
      '67 km from Tiruppur — quality engineering education within reach. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '67km',
      distanceLabel: 'from Tiruppur',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Tiruppur%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Tiruppur Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 67 km from Tiruppur on NH-544, in Komarapalayam, Namakkal district. Learners from Tiruppur can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Tiruppur',
    reachSummary: '67 km · about 1.5 hours',
    transport: {
      routeDescription: 'Via Erode on NH-544, then State Highway towards Komarapalayam',
      busTerminal:
        'Buses available from Tiruppur New Bus Stand to Komarapalayam via Erode — change at Erode or direct services available',
      nearestRailway: 'Tiruppur Railway Station (~85 km from campus)',
      nearestAirport: 'Coimbatore International Airport (~95 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Tiruppur to be added here. Include their experience at JKKNCET, what they liked about the campus, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Tiruppur to be added here. Focus on hostel life and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Tiruppur?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 67 km from Tiruppur and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Tiruppur?',
        answer:
          'JKKNCET is about 67 km from Tiruppur city centre, which takes about 1.5 hours by road via Erode on NH-544, then State Highway towards Komarapalayam. Regular bus services are available from Tiruppur.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Tiruppur students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Tiruppur can also opt for daily commute as the campus is about 1.5 hours away. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '112 km', emoji: '🌆' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '84 km', emoji: '🚗' },
    ],
    seo: {
      title: 'Best Engineering College in Tiruppur | JKKNCET — Admissions Open 2026-27',
      description:
        'JKKN College of Engineering and Technology is 67 km from Tiruppur on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/tiruppur',
      ogImage: '/images/city/tiruppur-og.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 67 km from Tiruppur on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Tiruppur',
      areaServedCity: 'Tiruppur',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // KARUR
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'karur',
    displayName: 'Karur',
    h1: 'Engineering College near Karur — 84 km',
    distanceKm: '84 km',
    travelTime: 'About 1.5 hours',
    heroSubheading:
      '84 km from Karur — quality engineering education within easy reach. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '84km',
      distanceLabel: 'from Karur',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Karur%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Karur Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 84 km from Karur on NH-544, in Komarapalayam, Namakkal district. Most learners from Karur stay in the campus hostel; college transport is available.',
    reachHeadline: 'How to Reach from Karur',
    reachSummary: '84 km · about 1.5 hours',
    transport: {
      routeDescription:
        'Direct road route from Karur towards Komarapalayam; alternate route via Erode on NH-544',
      busTerminal:
        'Buses available from Karur Bus Stand towards Komarapalayam; alternatively travel to Erode and take a frequent local bus to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Coimbatore International Airport (~100 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Karur to be added here. Include their experience at JKKNCET, what they liked about the campus, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Karur to be added here. Focus on hostel life and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Karur?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 84 km from Karur and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Karur?',
        answer:
          'JKKNCET is about 84 km from Karur city centre, which takes about 1.5 hours by road. You can travel directly towards Komarapalayam or via Erode on NH-544. Bus services are available from Karur.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Karur students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Since the campus is about 1.5 hours from Karur, most Karur students prefer the hostel for a comfortable stay close to classes and campus life.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Trichy', slug: 'trichy', distanceLabel: '145 km', emoji: '🏙️' },
    ],
    seo: {
      title: 'Engineering College near Karur - JKKNCET, 84 km on NH-544',
      description:
        'JKKN College of Engineering and Technology is 84 km from Karur on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/karur',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 84 km from Karur on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering College near Karur',
      areaServedCity: 'Karur',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TIRUCHENGODE
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'tiruchengode',
    displayName: 'Tiruchengode',
    h1: 'Engineering College near Tiruchengode — 26 km',
    distanceKm: '26 km',
    travelTime: 'About 30 minutes',
    heroSubheading:
      '26 km from Tiruchengode, in the same Namakkal district. JKKN College of Engineering and Technology offers AICTE-approved engineering programmes affiliated to Anna University, with support from the Training and Placement Cell.',
    heroStats: {
      distanceStat: '26km',
      distanceLabel: 'from Tiruchengode',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Tiruchengode%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Tiruchengode Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 26 km from Tiruchengode on NH-544, in Komarapalayam, Namakkal district. Learners from Tiruchengode can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Tiruchengode',
    reachSummary: '26 km · about 30 minutes',
    transport: {
      routeDescription:
        'Direct local road from Tiruchengode to Komarapalayam (within Namakkal District)',
      busTerminal:
        'Buses available from Tiruchengode Bus Stand to Komarapalayam — short local route',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Salem Airport (~60 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Tiruchengode to be added here. Include their experience at JKKNCET, the convenience of the short commute, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Tiruchengode to be added here. Focus on the proximity advantage and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Tiruchengode?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 26 km from Tiruchengode and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Tiruchengode?',
        answer:
          'JKKNCET is about 26 km from Tiruchengode town centre, which takes about 30 minutes by road. Regular bus services are available from Tiruchengode Bus Stand to Komarapalayam.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Tiruchengode students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. However, Tiruchengode students can also easily commute daily as the campus is about 30 minutes away. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly — 26 km from Tiruchengode. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '84 km', emoji: '🚗' },
    ],
    seo: {
      title: 'Engineering College near Tiruchengode - JKKNCET, 26 km on NH-544',
      description:
        'JKKN College of Engineering and Technology is 26 km from Tiruchengode on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/tiruchengode',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 26 km from Tiruchengode on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering College near Tiruchengode',
      areaServedCity: 'Tiruchengode',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PERUNDURAI
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'perundurai',
    displayName: 'Perundurai',
    h1: 'Engineering College near Perundurai — 29 km',
    distanceKm: '29 km',
    travelTime: 'About 45 minutes',
    heroSubheading:
      '29 km from Perundurai on NH-544 — quality engineering education right on your highway. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '29km',
      distanceLabel: 'from Perundurai',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Perundurai%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Perundurai Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 29 km from Perundurai on NH-544, in Komarapalayam, Namakkal district. Learners from Perundurai can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Perundurai',
    reachSummary: '29 km · about 45 minutes',
    transport: {
      routeDescription:
        'Direct route on NH-544 (Salem–Coimbatore Highway) via Bhavani towards Komarapalayam',
      busTerminal:
        'Frequent NH-544 route buses from Perundurai towards Bhavani/Komarapalayam; also easy connections via Erode',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Coimbatore International Airport (~100 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Perundurai to be added here. Include their experience at JKKNCET, the convenience of the short commute, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Perundurai to be added here. Focus on the ease of commute and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Perundurai?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 29 km from Perundurai and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Perundurai?',
        answer:
          'JKKNCET is about 29 km from Perundurai, which takes about 45 minutes by road along NH-544 (Salem–Coimbatore Highway). Regular bus services run on this highway route.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Perundurai students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. However, Perundurai students can also easily commute daily as the campus is about 45 minutes away on NH-544. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly — 29 km from Perundurai. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '67 km', emoji: '🎯' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '112 km', emoji: '🌆' },
    ],
    seo: {
      title: 'Engineering College near Perundurai - JKKNCET, 29 km on NH-544',
      description:
        'JKKN College of Engineering and Technology is 29 km from Perundurai on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/perundurai',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 29 km from Perundurai on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering College near Perundurai',
      areaServedCity: 'Perundurai',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // DHARMAPURI
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'dharmapuri',
    displayName: 'Dharmapuri',
    h1: 'Engineering College near Dharmapuri — 110 km',
    distanceKm: '110 km',
    travelTime: 'About 3 hours',
    heroSubheading:
      'About 3 hours from Dharmapuri via Salem, with full residential facilities. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '110km',
      distanceLabel: 'from Dharmapuri',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Dharmapuri%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Dharmapuri Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 110 km from Dharmapuri on NH-544, in Komarapalayam, Namakkal district. Most learners from Dharmapuri stay in the campus hostel; college transport is available.',
    reachHeadline: 'How to Reach from Dharmapuri',
    reachSummary: '110 km · about 3 hours',
    transport: {
      routeDescription:
        'Via Salem — NH-44 from Dharmapuri to Salem, then NH-544 (Salem–Coimbatore Highway) to Komarapalayam',
      busTerminal:
        'Buses from Dharmapuri Bus Stand via Salem; direct Dharmapuri–Komarapalayam bus services take about 3 hours',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Salem Airport (~60 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Dharmapuri to be added here. Include their experience at JKKNCET, hostel life, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Dharmapuri to be added here. Focus on the residential campus experience and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Dharmapuri?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 110 km from Dharmapuri and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Dharmapuri?',
        answer:
          'JKKNCET is about 110 km from Dharmapuri, which takes about 3 hours by road via Salem (NH-44, then NH-544). Direct bus services are available from Dharmapuri.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Dharmapuri students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Since the campus is about 3 hours from Dharmapuri, most Dharmapuri students prefer the hostel for a comfortable residential campus life close to classes.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Mettur', slug: 'mettur', distanceLabel: '45 km', emoji: '💧' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
    ],
    seo: {
      title: 'Engineering College near Dharmapuri - JKKNCET, 110 km on NH-544',
      description:
        'JKKN College of Engineering and Technology is 110 km from Dharmapuri on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/dharmapuri',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 110 km from Dharmapuri on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering College near Dharmapuri',
      areaServedCity: 'Dharmapuri',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // RASIPURAM
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'rasipuram',
    displayName: 'Rasipuram',
    h1: 'Engineering College near Rasipuram — 60 km',
    distanceKm: '60 km',
    travelTime: 'About 1 hour 15 minutes',
    heroSubheading:
      'About 60 km from Rasipuram — quality engineering education in your own Namakkal district. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '60km',
      distanceLabel: 'from Rasipuram',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Rasipuram%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Rasipuram Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 60 km from Rasipuram on NH-544, in Komarapalayam, Namakkal district. Learners from Rasipuram can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Rasipuram',
    reachSummary: '60 km · about 1 hour 15 minutes',
    transport: {
      routeDescription:
        'Road route via Tiruchengode towards Komarapalayam (within Namakkal District)',
      busTerminal:
        'Buses from Rasipuram Bus Stand towards Tiruchengode with connections to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Salem Airport (~60 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Rasipuram to be added here. Include their experience at JKKNCET, the same-district advantage, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Rasipuram to be added here. Focus on hostel/commute experience and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Rasipuram?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 60 km from Rasipuram and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Rasipuram?',
        answer:
          'JKKNCET is about 60 km from Rasipuram by road, via Tiruchengode. The journey typically takes around about 1 hour 15 minutes. Bus connections are available from Rasipuram via Tiruchengode.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Rasipuram students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Rasipuram students can choose between the hostel and a daily commute of about 1 hour 15 minutes. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '26 km', emoji: '🏘️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
    ],
    seo: {
      title: 'Engineering College near Rasipuram - JKKNCET, 60 km on NH-544',
      description:
        'JKKN College of Engineering and Technology is 60 km from Rasipuram on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/rasipuram',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 60 km from Rasipuram on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering College near Rasipuram',
      areaServedCity: 'Rasipuram',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // METTUR
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'mettur',
    displayName: 'Mettur',
    h1: 'Engineering College near Mettur — 45 km',
    distanceKm: '45 km',
    travelTime: 'About 1 hour',
    heroSubheading:
      'About 45 km from Mettur. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '45km',
      distanceLabel: 'from Mettur',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Mettur%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Mettur Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 45 km from Mettur on NH-544, in Komarapalayam, Namakkal district. Learners from Mettur can travel daily or stay in the campus hostel.',
    reachHeadline: 'How to Reach from Mettur',
    reachSummary: '45 km · about 1 hour',
    transport: {
      routeDescription:
        'Road route from Mettur towards Bhavani/Komarapalayam along the Cauvery belt',
      busTerminal:
        'Buses from Mettur Bus Stand towards the Bhavani/Erode route with connections to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Salem Airport (~60 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Mettur to be added here. Include their experience at JKKNCET, what they liked about the campus, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Mettur to be added here. Focus on the commute/hostel experience and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Mettur?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 45 km from Mettur and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Mettur?',
        answer:
          'JKKNCET is about 45 km from Mettur, which takes about 1 hour by road towards Bhavani/Komarapalayam. Bus connections are available from Mettur.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Mettur students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Mettur students can choose between the hostel and a daily commute of about 1 hour. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Dharmapuri', slug: 'dharmapuri', distanceLabel: '110 km', emoji: '🌄' },
    ],
    seo: {
      title: 'Engineering College near Mettur - JKKNCET, 45 km on NH-544',
      description:
        'JKKN College of Engineering and Technology is 45 km from Mettur on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/mettur',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 45 km from Mettur on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering College near Mettur',
      areaServedCity: 'Mettur',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TRICHY (TIRUCHIRAPPALLI)
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'trichy',
    displayName: 'Trichy',
    h1: 'Engineering College near Trichy — 145 km',
    distanceKm: '145 km',
    travelTime: 'About 3 hours',
    heroSubheading:
      'About 145 km from Trichy — a fully residential engineering campus on the NH-544 corridor. JKKN College of Engineering and Technology offers engineering programmes with support from the Training and Placement Cell. AICTE approved.',
    heroStats: {
      distanceStat: '145km',
      distanceLabel: 'from Trichy',
      programmes: '7',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Trichy%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Trichy Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is 145 km from Trichy on NH-544, in Komarapalayam, Namakkal district. Most learners from Trichy stay in the campus hostel; college transport is available.',
    reachHeadline: 'How to Reach from Trichy',
    reachSummary: '145 km · about 3 hours',
    transport: {
      routeDescription:
        'Via Namakkal — road route from Tiruchirappalli through Namakkal and Tiruchengode to Komarapalayam',
      busTerminal:
        'Regular buses from Trichy Central Bus Stand towards the Salem/Erode routes with connections to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (about 21 km from campus)',
      nearestAirport: 'Salem Airport (~60 km from campus)',
      campusAddress: CAMPUS_ADDRESS,
      googleMapsUrl: GOOGLE_MAPS_URL,
    },
    testimonials: [
      {
        quote:
          '[Student testimonial from Trichy to be added here. Include their experience at JKKNCET, hostel life, and their career outcomes.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year] · Now at [Company]',
      },
      {
        quote:
          '[Second student testimonial from Trichy to be added here. Focus on the residential campus experience and quality of education.]',
        author: '[Student Name]',
        role: '[Course], Batch of [Year]',
      },
    ],
    faqs: [
      {
        question: 'How do I choose an engineering college near Trichy?',
        answer:
          'Compare AICTE approval, the NIRF data each college files, the TNEA cutoff for your branch and community, the fees and your daily travel time. JKKNCET is 145 km from Trichy and publishes its AICTE approval and NIRF filings on this website.',
      },
      {
        question: 'How far is JKKNCET from Trichy?',
        answer:
          'JKKNCET is about 145 km from Trichy city centre, which takes about 3 hours by road via Namakkal. Regular bus services connect Trichy with the Komarapalayam region.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Information Technology (B.Tech). All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'What placement data has JKKNCET filed?',
        answer:
          'In NIRF 2026 the college filed that 23 of 53 UG graduates were placed in 2024-25 (median salary Rs 2.40 lakh), 35 of 89 in 2023-24 (Rs 2.20 lakh) and 29 of 126 in 2022-23 (Rs 1.68 lakh).',
      },
      {
        question: 'Does JKKNCET provide hostel for Trichy students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Since the campus is about 3 hours from Trichy, Trichy students typically stay in the hostel and enjoy a fully residential campus life close to classes.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Karur', slug: 'karur', distanceLabel: '84 km', emoji: '🚗' },
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '65 km', emoji: '🏠' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '57 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '18 km', emoji: '🛣️' },
    ],
    seo: {
      title: 'Engineering College near Trichy - JKKNCET, 145 km on NH-544',
      description:
        'JKKN College of Engineering and Technology is 145 km from Trichy on NH-544, in Komarapalayam. AICTE approved, affiliated to Anna University. Admissions 2026-27.',
      canonicalPath: '/trichy',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'JKKNCET, Komarapalayam: 145 km from Trichy on NH-544. AICTE approved. Admissions 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Engineering College near Trichy',
      areaServedCity: 'Tiruchirappalli',
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getCityConfig(slug: string): CityPageConfig | undefined {
  return CITY_PAGES_CONFIG.find((c) => c.slug === slug)
}

export function getAllCitySlugs(): Array<{ city: string }> {
  return CITY_PAGES_CONFIG.map((c) => ({ city: c.slug }))
}
