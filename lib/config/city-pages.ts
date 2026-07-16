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
    distanceKm: '100-110 km',
    travelTime: '2-2.5 hours',
    heroSubheading:
      'Better value, better campus, better you — just 2 hours from Coimbatore. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support — world-class education at a fraction of Coimbatore city college fees.',
    heroStats: {
      placements: '95%',
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
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '80-85 km', emoji: '🚗' },
    ],
    seo: {
      title: 'Best Engineering College in Coimbatore | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Coimbatore? JKKN College of Engineering and Technology is just 100-110 km away. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/coimbatore',
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
      'Just 30-40 km from Erode — your gateway to quality engineering education. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
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
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '80-85 km', emoji: '🚗' },
      { displayName: 'Perundurai', slug: 'perundurai', distanceLabel: '20-25 km', emoji: '🛤️' },
    ],
    seo: {
      title: 'Best Engineering College in Erode | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Erode? JKKN College of Engineering and Technology is just 30-40 km away. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/erode',
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
      'Just 5-10 km from Namakkal — your nearest engineering college! JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved. Located right here in Namakkal district.',
    heroStats: {
      placements: '95%',
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
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '80-85 km', emoji: '🚗' },
      { displayName: 'Rasipuram', slug: 'rasipuram', distanceLabel: '60-65 km', emoji: '🧵' },
    ],
    seo: {
      title: 'Best Engineering College in Namakkal | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college in Namakkal? JKKN College of Engineering and Technology is just 5-10 km away in Komarapalayam. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/namakkal',
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
      'Just 40-50 km from Salem — quality engineering education within easy reach. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
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
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '80-85 km', emoji: '🚗' },
      { displayName: 'Mettur', slug: 'mettur', distanceLabel: '43-48 km', emoji: '💧' },
      { displayName: 'Dharmapuri', slug: 'dharmapuri', distanceLabel: '90-105 km', emoji: '🌄' },
    ],
    seo: {
      title: 'Best Engineering College in Salem | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Salem? JKKN College of Engineering and Technology is just 40-50 km away. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/salem',
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
      'Just 80-90 km from Tiruppur — quality engineering education within reach. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
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
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '80-85 km', emoji: '🚗' },
    ],
    seo: {
      title: 'Best Engineering College in Tiruppur | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Tiruppur? JKKN College of Engineering and Technology is just 80-90 km away. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/tiruppur',
      ogImage: '/images/city/tiruppur-og.jpg',
      twitterDescription:
        'Top engineering college near Tiruppur. Just 80-90 km away. Admissions open 2026-27.',
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
    distanceKm: '80-85 km',
    travelTime: '1.5-2 hours',
    heroSubheading:
      'Just 80-85 km from Karur — quality engineering education within easy reach. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
      lpaHighest: '10-12',
      distanceStat: '80km',
      distanceLabel: 'from Karur',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Karur%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Karur Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET gives Karur students access to an accredited engineering education without moving to a distant metro. With hostel facilities, college transport, affordable fees, and strong placement support, JKKN is a practical and smart choice for students from Karur district.',
    reachHeadline: 'How to Reach from Karur',
    reachSummary: '80-85 km · 1.5-2 hours',
    transport: {
      routeDescription:
        'Direct road route from Karur towards Komarapalayam; alternate route via Erode on NH-544',
      busTerminal:
        'Buses available from Karur Bus Stand towards Komarapalayam; alternatively travel to Erode and take a frequent local bus to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
        question: 'What is the best engineering college in Karur?',
        answer:
          'JKKN College of Engineering and Technology, located about 80-85 km from Karur near Komarapalayam on NH-544, is widely regarded as one of the top engineering colleges accessible from Karur. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Karur?',
        answer:
          'JKKNCET is approximately 80-85 km from Karur city centre, which takes about 1.5-2 hours by road. You can travel directly towards Komarapalayam or via Erode on NH-544. Bus services are available from Karur.',
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
        question: 'Does JKKNCET provide hostel for Karur students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Since the campus is about 1.5-2 hours from Karur, most Karur students prefer the hostel for a comfortable stay close to classes and campus life.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Trichy', slug: 'trichy', distanceLabel: '140-150 km', emoji: '🏙️' },
    ],
    seo: {
      title: 'Best Engineering College in Karur | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Karur? JKKN College of Engineering and Technology is about 80-85 km away. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/karur',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'Top engineering college near Karur. About 80-85 km away. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Karur',
      areaServedCity: 'Karur',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TIRUCHENGODE
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'tiruchengode',
    displayName: 'Tiruchengode',
    distanceKm: '20-25 km',
    travelTime: '30-40 minutes',
    heroSubheading:
      'Just 20-25 km from Tiruchengode — your nearest accredited engineering college. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved. Right here in Namakkal district.',
    heroStats: {
      placements: '95%',
      lpaHighest: '10-12',
      distanceStat: '22km',
      distanceLabel: 'from Tiruchengode',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Tiruchengode%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Tiruchengode Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is one of the closest quality engineering colleges for Tiruchengode students — same Namakkal district, no relocation needed. With an easy daily commute, college transport, personalised attention through smaller class sizes, and strong placement support, JKKN is a smart choice for Tiruchengode students.',
    reachHeadline: 'How to Reach from Tiruchengode',
    reachSummary: '20-25 km · 30-40 minutes',
    transport: {
      routeDescription:
        'Direct local road from Tiruchengode to Komarapalayam (within Namakkal District)',
      busTerminal:
        'Buses available from Tiruchengode Bus Stand to Komarapalayam — short local route',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
        question: 'What is the best engineering college in Tiruchengode?',
        answer:
          'JKKN College of Engineering and Technology, located just 20-25 km from Tiruchengode in Komarapalayam, is widely regarded as one of the top engineering colleges near Tiruchengode. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Tiruchengode?',
        answer:
          'JKKNCET is approximately 20-25 km from Tiruchengode town centre, which takes about 30-40 minutes by road. Regular bus services are available from Tiruchengode Bus Stand to Komarapalayam.',
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
        question: 'Does JKKNCET provide hostel for Tiruchengode students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. However, Tiruchengode students can also easily commute daily as the campus is just 30-40 minutes away. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly — just 20-25 km from Tiruchengode. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Karur', slug: 'karur', distanceLabel: '80-85 km', emoji: '🚗' },
    ],
    seo: {
      title: 'Best Engineering College in Tiruchengode | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Tiruchengode? JKKN College of Engineering and Technology is just 20-25 km away in Komarapalayam. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/tiruchengode',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'Top engineering college near Tiruchengode. Just 20-25 km away. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College in Tiruchengode',
      areaServedCity: 'Tiruchengode',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PERUNDURAI
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'perundurai',
    displayName: 'Perundurai',
    distanceKm: '20-25 km',
    travelTime: '30-40 minutes',
    heroSubheading:
      'Just 20-25 km from Perundurai on NH-544 — quality engineering education right on your highway. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
      lpaHighest: '10-12',
      distanceStat: '22km',
      distanceLabel: 'from Perundurai',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Perundurai%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Perundurai Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is just a short hop up NH-544 from Perundurai — one of the closest accredited engineering colleges for Erode district students. With an easy daily commute, college transport, personalised attention through smaller class sizes, and strong placement support, JKKN is a smart choice for Perundurai students.',
    reachHeadline: 'How to Reach from Perundurai',
    reachSummary: '20-25 km · 30-40 minutes',
    transport: {
      routeDescription:
        'Direct route on NH-544 (Salem–Coimbatore Highway) via Bhavani towards Komarapalayam',
      busTerminal:
        'Frequent NH-544 route buses from Perundurai towards Bhavani/Komarapalayam; also easy connections via Erode',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
        question: 'What is the best engineering college near Perundurai?',
        answer:
          'JKKN College of Engineering and Technology, located just 20-25 km from Perundurai on NH-544 near Komarapalayam, is widely regarded as one of the top engineering colleges near Perundurai. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Perundurai?',
        answer:
          'JKKNCET is approximately 20-25 km from Perundurai, which takes about 30-40 minutes by road along NH-544 (Salem–Coimbatore Highway). Regular bus services run on this highway route.',
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
        question: 'Does JKKNCET provide hostel for Perundurai students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. However, Perundurai students can also easily commute daily as the campus is just 30-40 minutes away on NH-544. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly — just 20-25 km from Perundurai. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Tiruppur', slug: 'tiruppur', distanceLabel: '80-90 km', emoji: '🎯' },
      { displayName: 'Coimbatore', slug: 'coimbatore', distanceLabel: '100-110 km', emoji: '🌆' },
    ],
    seo: {
      title: 'Best Engineering College near Perundurai | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Perundurai? JKKN College of Engineering and Technology is just 20-25 km away on NH-544. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/perundurai',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'Top engineering college near Perundurai. Just 20-25 km away on NH-544. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College near Perundurai',
      areaServedCity: 'Perundurai',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // DHARMAPURI
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'dharmapuri',
    displayName: 'Dharmapuri',
    distanceKm: '90-105 km',
    travelTime: '2-2.5 hours',
    heroSubheading:
      'About 2 hours from Dharmapuri via Salem — quality engineering education with full residential facilities. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
      lpaHighest: '10-12',
      distanceStat: '100km',
      distanceLabel: 'from Dharmapuri',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Dharmapuri%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Dharmapuri Students Choose JKKNCET',
    whyChooseSubtitle:
      'For Dharmapuri students, JKKNCET offers an accredited engineering education about 2 hours away via Salem — a practical alternative to distant metro colleges. With separate hostels for boys and girls, affordable fees, smaller class sizes, and strong placement support, students settle in quickly and focus on their careers.',
    reachHeadline: 'How to Reach from Dharmapuri',
    reachSummary: '90-105 km · 2-2.5 hours',
    transport: {
      routeDescription:
        'Via Salem — NH-44 from Dharmapuri to Salem, then NH-544 (Salem–Coimbatore Highway) to Komarapalayam',
      busTerminal:
        'Buses from Dharmapuri Bus Stand via Salem; direct Dharmapuri–Komarapalayam bus services take about 2 hours',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
        question: 'What is the best engineering college accessible from Dharmapuri?',
        answer:
          'JKKN College of Engineering and Technology, located about 90-105 km from Dharmapuri near Komarapalayam on NH-544, is widely regarded as one of the top engineering colleges accessible from Dharmapuri. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Dharmapuri?',
        answer:
          'JKKNCET is approximately 90-105 km from Dharmapuri, which takes about 2-2.5 hours by road via Salem (NH-44, then NH-544). Direct bus services are available from Dharmapuri.',
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
        question: 'Does JKKNCET provide hostel for Dharmapuri students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Since the campus is about 2-2.5 hours from Dharmapuri, most Dharmapuri students prefer the hostel for a comfortable residential campus life close to classes.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Mettur', slug: 'mettur', distanceLabel: '43-48 km', emoji: '💧' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
    ],
    seo: {
      title: 'Best Engineering College near Dharmapuri | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college accessible from Dharmapuri? JKKN College of Engineering and Technology is about 2-2.5 hours away via Salem. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/dharmapuri',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'Top engineering college accessible from Dharmapuri. About 2-2.5 hours via Salem. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College near Dharmapuri',
      areaServedCity: 'Dharmapuri',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // RASIPURAM
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'rasipuram',
    displayName: 'Rasipuram',
    distanceKm: '60-65 km',
    travelTime: '1-1.5 hours',
    heroSubheading:
      'About 60-65 km from Rasipuram — quality engineering education in your own Namakkal district. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
      lpaHighest: '10-12',
      distanceStat: '60km',
      distanceLabel: 'from Rasipuram',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Rasipuram%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Rasipuram Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is in the same Namakkal district as Rasipuram — get a quality engineering education without leaving your home district. Choose between a daily commute via Tiruchengode or a comfortable hostel stay, with personalised attention through smaller class sizes and strong placement support.',
    reachHeadline: 'How to Reach from Rasipuram',
    reachSummary: '60-65 km · 1-1.5 hours',
    transport: {
      routeDescription:
        'Road route via Tiruchengode towards Komarapalayam (within Namakkal District)',
      busTerminal:
        'Buses from Rasipuram Bus Stand towards Tiruchengode with connections to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
        question: 'What is the best engineering college near Rasipuram?',
        answer:
          'JKKN College of Engineering and Technology, located about 60-65 km from Rasipuram in Komarapalayam (same Namakkal district), is widely regarded as one of the top engineering colleges near Rasipuram. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Rasipuram?',
        answer:
          'JKKNCET is approximately 60-65 km from Rasipuram by road, via Tiruchengode. The journey typically takes around 1-1.5 hours. Bus connections are available from Rasipuram via Tiruchengode.',
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
        question: 'Does JKKNCET provide hostel for Rasipuram students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Rasipuram students can choose between the hostel and a daily commute of about 1-1.5 hours. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Tiruchengode', slug: 'tiruchengode', distanceLabel: '20-25 km', emoji: '🏘️' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
    ],
    seo: {
      title: 'Best Engineering College near Rasipuram | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Rasipuram? JKKN College of Engineering and Technology is in the same Namakkal district, about 60-65 km away. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/rasipuram',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'Top engineering college near Rasipuram, same Namakkal district. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College near Rasipuram',
      areaServedCity: 'Rasipuram',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // METTUR
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'mettur',
    displayName: 'Mettur',
    distanceKm: '43-48 km',
    travelTime: '1-1.5 hours',
    heroSubheading:
      'About 43-48 km from Mettur — one of the closest accredited engineering colleges for the Mettur–Bhavani belt. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
      lpaHighest: '10-12',
      distanceStat: '45km',
      distanceLabel: 'from Mettur',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Mettur%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Mettur Students Choose JKKNCET',
    whyChooseSubtitle:
      'JKKNCET is about an hour from Mettur — one of the closest accredited engineering colleges for students from the Mettur–Bhavani belt of Salem district. With affordable fees, hostel and college transport facilities, and strong placement support, JKKN is a practical and smart choice for Mettur students.',
    reachHeadline: 'How to Reach from Mettur',
    reachSummary: '43-48 km · 1-1.5 hours',
    transport: {
      routeDescription:
        'Road route from Mettur towards Bhavani/Komarapalayam along the Cauvery belt',
      busTerminal:
        'Buses from Mettur Bus Stand towards the Bhavani/Erode route with connections to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
        question: 'What is the best engineering college near Mettur?',
        answer:
          'JKKN College of Engineering and Technology, located about 43-48 km from Mettur near Komarapalayam on NH-544, is widely regarded as one of the top engineering colleges near Mettur. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Mettur?',
        answer:
          'JKKNCET is approximately 43-48 km from Mettur, which takes about 1-1.5 hours by road towards Bhavani/Komarapalayam. Bus connections are available from Mettur.',
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
        question: 'Does JKKNCET provide hostel for Mettur students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Mettur students can choose between the hostel and a daily commute of about 1-1.5 hours. College transport services are also available.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Dharmapuri', slug: 'dharmapuri', distanceLabel: '90-105 km', emoji: '🌄' },
    ],
    seo: {
      title: 'Best Engineering College near Mettur | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for the best engineering college near Mettur? JKKN College of Engineering and Technology is about 43-48 km away near Komarapalayam. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/mettur',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'Top engineering college near Mettur. About 43-48 km away. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College near Mettur',
      areaServedCity: 'Mettur',
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // TRICHY (TIRUCHIRAPPALLI)
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: 'trichy',
    displayName: 'Trichy',
    distanceKm: '140-150 km',
    travelTime: '2.5-3 hours',
    heroSubheading:
      'About 140-150 km from Trichy — a fully residential engineering campus on the NH-544 corridor. JKKN College of Engineering and Technology offers top-tier engineering programmes with 95% placement support. AICTE, NBA, NAAC approved.',
    heroStats: {
      placements: '95%',
      lpaHighest: '10-12',
      distanceStat: '145km',
      distanceLabel: 'from Trichy',
      programmes: '5',
    },
    whatsappMessage:
      "Hi%2C%20I'm%20from%20Trichy%20and%20interested%20in%20Engineering%20programmes%20at%20JKKNCET.%20Please%20share%20admission%20details%20for%202026-27.",
    whyChooseHeadline: 'Why Trichy Students Choose JKKNCET',
    whyChooseSubtitle:
      'For Trichy students seeking a residential engineering college with personalised attention, JKKNCET offers accredited programmes with separate hostels for boys and girls, smaller class sizes, affordable fees, and strong placement support — a focused campus environment away from big-city distractions.',
    reachHeadline: 'How to Reach from Trichy',
    reachSummary: '140-150 km · 2.5-3 hours',
    transport: {
      routeDescription:
        'Via Namakkal — road route from Tiruchirappalli through Namakkal and Tiruchengode to Komarapalayam',
      busTerminal:
        'Regular buses from Trichy Central Bus Stand towards the Salem/Erode routes with connections to Komarapalayam',
      nearestRailway: 'Erode Junction Railway Station (~35 km from campus)',
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
        question: 'What is the best engineering college accessible from Trichy?',
        answer:
          'JKKN College of Engineering and Technology, located about 140-150 km from Tiruchirappalli near Komarapalayam on NH-544, is one of the top residential engineering colleges accessible from Trichy. Approved by AICTE, NBA, NAAC and affiliated to Anna University, Chennai.',
      },
      {
        question: 'How far is JKKNCET from Trichy?',
        answer:
          'JKKNCET is approximately 140-150 km from Trichy city centre, which takes about 2.5-3 hours by road via Namakkal. Regular bus services connect Trichy with the Komarapalayam region.',
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
        question: 'Does JKKNCET provide hostel for Trichy students?',
        answer:
          'Yes, JKKNCET provides separate hostel facilities for boys and girls. Since the campus is about 2.5-3 hours from Trichy, Trichy students typically stay in the hostel and enjoy a fully residential campus life close to classes.',
      },
      {
        question: 'How can I apply for admission at JKKNCET?',
        answer:
          'You can apply online through the official website at https://engg.jkkn.ac.in/ or visit the campus directly. Admissions for 2026-27 are currently open. Contact the admission office for guidance.',
      },
    ],
    crossLinks: [
      { displayName: 'Karur', slug: 'karur', distanceLabel: '80-85 km', emoji: '🚗' },
      { displayName: 'Namakkal', slug: 'namakkal', distanceLabel: '5-10 km', emoji: '🏠' },
      { displayName: 'Salem', slug: 'salem', distanceLabel: '40-50 km', emoji: '🚌' },
      { displayName: 'Erode', slug: 'erode', distanceLabel: '30-40 km', emoji: '🛣️' },
    ],
    seo: {
      title: 'Best Engineering College near Trichy | JKKNCET — Admissions Open 2026-27',
      description:
        'Looking for a residential engineering college accessible from Trichy? JKKN College of Engineering and Technology is about 140-150 km away via Namakkal. AICTE, NBA, NAAC approved. 95% placements. Apply now for 2026-27!',
      canonicalPath: '/trichy',
      ogImage: '/images/engineering/campus-hero.jpg',
      twitterDescription:
        'Residential engineering college accessible from Trichy. About 2.5-3 hours via Namakkal. Admissions open 2026-27.',
    },
    schema: {
      breadcrumbLabel: 'Best Engineering College near Trichy',
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
