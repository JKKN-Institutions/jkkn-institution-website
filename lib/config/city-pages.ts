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

export interface CityPageConfig {
  // Identity
  slug: string
  displayName: string

  // Distance & Travel
  distanceKm: string
  travelTime: string

  // Hero
  heroSubheading: string
  heroStats: {
    placements: string
    lpaHighest: string
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
  'https://maps.google.com/?q=JKKN+Institutions+Komarapalayam'

// ─────────────────────────────────────────────────────────────────────────────
// All 5 City Configurations
// ─────────────────────────────────────────────────────────────────────────────

export const CITY_PAGES_CONFIG: CityPageConfig[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // COIMBATORE
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'coimbatore',
    displayName: 'Coimbatore',
    distanceKm: '100-110 km',
    travelTime: '2-2.5 hours',
    heroSubheading:
      'Better value, better campus, better you — just 2 hours from Coimbatore. JKKN College of Engineering and Technology offers top-tier engineering programmes with 85%+ placement support — world-class education at a fraction of Coimbatore city college fees.',
    heroStats: {
      placements: '85%+',
      lpaHighest: '10-12',
      distanceStat: '105km',
      distanceLabel: 'from Coimbatore',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Coimbatore%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Coimbatore Students Choose JKKNCET',
    whyChooseSubtitle:
      'While Coimbatore has many colleges, JKKN offers a distinct advantage: world-class education at significantly lower costs, a peaceful campus away from city congestion, personalised attention with smaller class sizes, and strong placement support. Hostel and transport facilities make the transition easy.',
    reachHeadline: 'How to Reach from Coimbatore',
    reachSummary: '100-110 km · 2-2.5 hours',
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
        question: 'What is the best engineering college in Coimbatore?',
        answer:
          'JKKN College of Engineering and Technology, located just 100-110 km from Coimbatore on NH-544, is widely regarded as one of the top engineering colleges accessible from Coimbatore. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai, it offers excellent programmes with strong placement support.',
      },
      {
        question: 'How far is JKKNCET from Coimbatore?',
        answer:
          'JKKNCET is approximately 100-110 km from Coimbatore city centre, which takes about 2-2.5 hours by road via NH-544 (Coimbatore-Salem Highway) — direct route. Regular bus services are available from Coimbatore.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Civil Engineering. All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'Does JKKNCET have good campus placements?',
        answer:
          'Yes, JKKN College of Engineering and Technology has an active placement cell bringing top companies to campus every year. The college focuses on on-campus placements and career development training including aptitude, soft skills, and technical interview preparation.',
      },
      {
        question: 'Does JKKNCET provide hostel for Coimbatore students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Coimbatore can also opt for daily commute as the campus is just 2-2.5 hours away. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '80-90 km', emoji: '🎯' },
    ],
    seo: {
      title: 'Best Engineering College in Coimbatore | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Coimbatore? JKKN College of Engineering and Technology is just 100-110 km away. AICTE, NBA, NAAC approved. 85%+ placements. Apply now for 2026-27!',
      canonicalPath: '/best-engineering-college-in-coimbatore/',
      ogImage: '/images/city/coimbatore-og.jpg',
      twitterDescription:
        'Top engineering college near Coimbatore. Just 100-110 km away. Admissions open 2026-27.',
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
    distanceKm: '30-40 km',
    travelTime: '50-70 minutes',
    heroSubheading:
      'Just 30-40 km from Erode — your gateway to quality engineering education. JKKN College of Engineering and Technology offers top-tier engineering programmes with 85%+ placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '85%+',
      lpaHighest: '10-12',
      distanceStat: '35km',
      distanceLabel: 'from Erode',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Erode%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Erode Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKN is one of the closest quality engineering colleges for students from Erode. With a peaceful campus, smaller class sizes for personalised attention, strong industry connections, and affordable fees, JKKNCET is a smart choice for Erode students.',
    reachHeadline: 'How to Reach from Erode',
    reachSummary: '30-40 km · 50-70 minutes',
    transport: {
      routeDescription: 'NH-544 / State Highway via Komarapalayam',
      busTerminal:
        'Buses available from Erode New Bus Stand to Komarapalayam — frequent services',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
    faqs: [
      {
        question: 'What is the best engineering college in Erode?',
        answer:
          'JKKN College of Engineering and Technology, located just 30-40 km from Erode on NH-544, is widely regarded as one of the top engineering colleges accessible from Erode. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Erode?',
        answer:
          'JKKNCET is approximately 30-40 km from Erode city centre, which takes about 50-70 minutes by road via NH-544 / State Highway via Komarapalayam. Regular bus services are available from Erode.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Civil Engineering. All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'Does JKKNCET have good campus placements?',
        answer:
          'Yes, JKKN College of Engineering and Technology has an active placement cell bringing top companies to campus every year. The college focuses on on-campus placements and career development training including aptitude, soft skills, and technical interview preparation.',
      },
      {
        question: 'Does JKKNCET provide hostel for Erode students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Erode can also commute daily as the campus is just 50-70 minutes away. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '100-110 km', emoji: '🌆' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '80-90 km', emoji: '🎯' },
    ],
    seo: {
      title: 'Best Engineering College in Erode | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Erode? JKKN College of Engineering and Technology is just 30-40 km away. AICTE, NBA, NAAC approved. 85%+ placements. Apply now for 2026-27!',
      canonicalPath: '/best-engineering-college-in-erode/',
      ogImage: '/images/city/erode-og.jpg',
      twitterDescription:
        'Top engineering college near Erode. Just 30-40 km away. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Erode',
      areaServedCity: 'Erode',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // NAMAKKAL
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'namakkal',
    displayName: 'Namakkal',
    distanceKm: '5-10 km',
    travelTime: '15-20 minutes',
    heroSubheading:
      'Just 5-10 km from Namakkal — your nearest engineering college! JKKN College of Engineering and Technology offers top-tier engineering programmes with 85%+ placement support. AICTE, NBA, NAAC approved. Located right here in Namakkal district.',
    heroStats: {
      placements: '85%+',
      lpaHighest: '10-12',
      distanceStat: '8km',
      distanceLabel: 'from Namakkal',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Namakkal%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Namakkal Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is located right in Namakkal district — no long commutes, no relocation stress. Get a world-class engineering education from your home district with strong placement support and modern campus facilities.',
    reachHeadline: 'How to Reach from Namakkal',
    reachSummary: '5-10 km · 15-20 minutes',
    transport: {
      routeDescription: 'Local route via Komarapalayam (within Namakkal District)',
      busTerminal:
        'Frequent local bus services from Namakkal Town Bus Stand to Komarapalayam',
      nearestRailway: 'Salem Junction Railway Station (~50 km from campus)',
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
        question: 'What is the best engineering college in Namakkal?',
        answer:
          'JKKN College of Engineering and Technology, located just 5-10 km from Namakkal town in Komarapalayam, is widely regarded as the top engineering college in Namakkal district. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Namakkal?',
        answer:
          'JKKNCET is approximately 5-10 km from Namakkal town centre, which takes about 15-20 minutes by road. Regular local bus services are available from Namakkal Bus Stand to Komarapalayam.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Civil Engineering. All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'Does JKKNCET have good campus placements?',
        answer:
          'Yes, JKKN College of Engineering and Technology has an active placement cell bringing top companies to campus every year. The college focuses on on-campus placements and career development training including aptitude, soft skills, and technical interview preparation.',
      },
      {
        question: 'Does JKKNCET provide hostel for Namakkal students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. However, Namakkal students can also easily commute daily as the campus is just 15-20 minutes away. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly — just 5-10 km from Namakkal. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '100-110 km', emoji: '🌆' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '80-90 km', emoji: '🎯' },
    ],
    seo: {
      title: 'Best Engineering College in Namakkal | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college in Namakkal? JKKN College of Engineering and Technology is just 5-10 km away in Komarapalayam. AICTE, NBA, NAAC approved. 85%+ placements. Apply now for 2026-27!',
      canonicalPath: '/best-engineering-college-in-namakkal/',
      ogImage: '/images/city/namakkal-og.jpg',
      twitterDescription:
        'Top engineering college in Namakkal. Just 5-10 km away. Admissions open 2026-27.',
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
    distanceKm: '40-50 km',
    travelTime: '50-60 minutes',
    heroSubheading:
      'Just 40-50 km from Salem — quality engineering education within easy reach. JKKN College of Engineering and Technology offers top-tier engineering programmes with 85%+ placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '85%+',
      lpaHighest: '10-12',
      distanceStat: '45km',
      distanceLabel: 'from Salem',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Salem%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Salem Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is one of the closest accredited engineering colleges for Salem students. With affordable fees, strong placement record, and just under an hour by road, JKKN is the smart alternative to costlier Salem city colleges.',
    reachHeadline: 'How to Reach from Salem',
    reachSummary: '40-50 km · 50-60 minutes',
    transport: {
      routeDescription: 'NH-544 (Salem-Coimbatore Highway) — direct route',
      busTerminal:
        'Frequent buses from Salem New Bus Stand and Shevapet to Komarapalayam/Namakkal route',
      nearestRailway: 'Salem Junction Railway Station (~45 km from campus)',
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
        question: 'What is the best engineering college in Salem?',
        answer:
          'JKKN College of Engineering and Technology, located just 40-50 km from Salem on NH-544, is widely regarded as one of the top engineering colleges accessible from Salem. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Salem?',
        answer:
          'JKKNCET is approximately 40-50 km from Salem city centre, which takes about 50-60 minutes by road via NH-544 (Salem-Coimbatore Highway) — direct route. Regular bus services are available from Salem.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Civil Engineering. All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'Does JKKNCET have good campus placements?',
        answer:
          'Yes, JKKN College of Engineering and Technology has an active placement cell bringing top companies to campus every year. The college focuses on on-campus placements and career development training including aptitude, soft skills, and technical interview preparation.',
      },
      {
        question: 'Does JKKNCET provide hostel for Salem students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Salem can also opt for daily commute as the campus is just 50-60 minutes away. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '100-110 km', emoji: '🌆' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '80-90 km', emoji: '🎯' },
    ],
    seo: {
      title: 'Best Engineering College in Salem | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Salem? JKKN College of Engineering and Technology is just 40-50 km away. AICTE, NBA, NAAC approved. 85%+ placements. Apply now for 2026-27!',
      canonicalPath: '/best-engineering-college-in-salem/',
      ogImage: '/images/city/salem-og.jpg',
      twitterDescription:
        'Top engineering college near Salem. Just 40-50 km away. Admissions open 2026-27.',
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
    distanceKm: '80-90 km',
    travelTime: '1.5-2 hours',
    heroSubheading:
      'Just 80-90 km from Tiruppur — quality engineering education within reach. JKKN College of Engineering and Technology offers top-tier engineering programmes with 85%+ placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '85%+',
      lpaHighest: '10-12',
      distanceStat: '85km',
      distanceLabel: 'from Tiruppur',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Tiruppur%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Tiruppur Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET offers Tiruppur students a quality engineering education without the premium fees of larger city colleges. With hostel facilities and strong placement support, it is a practical and smart choice for Tiruppur students aspiring to build strong engineering careers.',
    reachHeadline: 'How to Reach from Tiruppur',
    reachSummary: '80-90 km · 1.5-2 hours',
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
        question: 'What is the best engineering college in Tiruppur?',
        answer:
          'JKKN College of Engineering and Technology, located just 80-90 km from Tiruppur on NH-544, is widely regarded as one of the top engineering colleges accessible from Tiruppur. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Tiruppur?',
        answer:
          'JKKNCET is approximately 80-90 km from Tiruppur city centre, which takes about 1.5-2 hours by road via Erode on NH-544, then State Highway towards Komarapalayam. Regular bus services are available from Tiruppur.',
      },
      {
        question: 'What is the TNEA counselling code for JKKNCET?',
        answer:
          'The TNEA counselling code for JKKN College of Engineering and Technology can be found on the official TNEA website. Use this code during TNEA counselling to select JKKNCET as your preferred college. Contact the admission office for guidance.',
      },
      {
        question: 'Which engineering branches are available?',
        answer:
          'JKKN College of Engineering and Technology offers B.E. programmes in Computer Science and Engineering (CSE), Electronics and Communication (ECE), Mechanical Engineering, Electrical and Electronics (EEE), and Civil Engineering. All programmes are AICTE approved and affiliated to Anna University.',
      },
      {
        question: 'Does JKKNCET have good campus placements?',
        answer:
          'Yes, JKKN College of Engineering and Technology has an active placement cell bringing top companies to campus every year. The college focuses on on-campus placements and career development training including aptitude, soft skills, and technical interview preparation.',
      },
      {
        question: 'Does JKKNCET provide hostel for Tiruppur students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Students from Tiruppur can also opt for daily commute as the campus is just 1.5-2 hours away. College transport services are available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '100-110 km', emoji: '🌆' },
    ],
    seo: {
      title: 'Best Engineering College in Tiruppur | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Tiruppur? JKKN College of Engineering and Technology is just 80-90 km away. AICTE, NBA, NAAC approved. 85%+ placements. Apply now for 2026-27!',
      canonicalPath: '/best-engineering-college-in-tiruppur/',
      ogImage: '/images/city/tiruppur-og.jpg',
      twitterDescription:
        'Top engineering college near Tiruppur. Just 80-90 km away. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Tiruppur',
      areaServedCity: 'Tiruppur',
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
