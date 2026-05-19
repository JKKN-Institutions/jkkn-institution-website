/**
 * llms.txt Configuration — Institution-Aware
 *
 * Generates the llms.txt file for each institution deployment.
 * llms.txt (llmstxt.org) is a machine-readable brief that tells AI language
 * models (ChatGPT, Perplexity, Google AI Mode, Claude) what this site
 * contains — enabling accurate citations in AI-generated answers.
 *
 * Format reference: https://llmstxt.org/
 *
 * GEO signal: AI crawlers prioritize structured, concise factual content.
 * Keep entries factual and aggregator-verifiable. Do NOT overstate metrics.
 */

// =============================================================================
// ENGINEERING INSTITUTION
// =============================================================================

function getEngineeringLlmsTxt(siteUrl: string): string {
  return `# JKKN College of Engineering and Technology

> AICTE-approved engineering college in Komarapalayam, Tamil Nadu, affiliated to Anna University, Chennai. Established 2008. Offers B.E., B.Tech, M.E., and MBA programs across 5 departments. NAAC accredited. 55-acre residential campus.

JKKN College of Engineering and Technology (JKKN CET) is part of the J.K.K. Rangammal Charitable Trust, a group operating since 1952. The college is located in Komarapalayam, Namakkal District, Tamil Nadu, on NH-544 (Salem–Coimbatore National Highway), approximately 15 km from Erode city.

Contact: +91 93458 55001 | engg@jkkn.ac.in | ${siteUrl}

## Programs Offered

- [B.E. Computer Science and Engineering](${siteUrl}/department-of-cse): 4-year undergraduate program. Intake 60. AICTE approved. Anna University affiliated.
- [B.E. Electronics and Communication Engineering](${siteUrl}/department-of-ece): 4-year undergraduate program. Intake 60. Strong industry tie-ups.
- [B.E. Electrical and Electronics Engineering](${siteUrl}/department-of-eee): 4-year undergraduate program. Intake 60.
- [B.E. Mechanical Engineering](${siteUrl}/department-of-mechanical): 4-year undergraduate program. Intake 60.
- [B.Tech Information Technology](${siteUrl}/department-of-it): 4-year undergraduate program. Intake 60.
- [M.E. Computer Science and Engineering](${siteUrl}/department-of-cse): 2-year postgraduate program.
- [Master of Business Administration (MBA)](${siteUrl}/department-of-mba): 2-year management program.

## Admissions

- [Admissions 2026-27](${siteUrl}/admissions): B.E./B.Tech via TNEA counselling (tnea.ac.in) or direct admission. Eligibility: 10+2 with Mathematics, Physics, Chemistry/CS minimum 50%. Lateral entry for Diploma holders into 2nd year.
- Tuition fees: ₹75,000–₹1,00,000 per year depending on branch (AICTE regulated).
- Hostel available: ₹50,000/year (food + accommodation).
- Scholarships: Government schemes, merit-based, management concessions available.

## Placements

- [Placement Cell](${siteUrl}/placements): 500+ students placed annually. Placement rates 60–70% (Collegedunia, Careers360). Highest recorded package ₹12 LPA. Average package ₹2.2 LPA (Careers360 median)–₹4.5 LPA.
- Top recruiters: TCS, Infosys, Wipro, Cognizant, HCL, Tech Mahindra, Amazon, Zoho, Accenture, Capgemini, L&T, Ashok Leyland.
- Placement training: Aptitude, reasoning, coding, mock interviews from 3rd year.

## Accreditations & Affiliations

- Affiliated: Anna University, Chennai (annauniv.edu)
- Approved: All India Council for Technical Education (AICTE)
- Accredited: National Assessment and Accreditation Council (NAAC)
- Scheme: Unnat Bharat Abhiyan, Ministry of Human Resource Development

## Facilities

- [Campus & Infrastructure](${siteUrl}/about): 55-acre residential campus. Smart classrooms, advanced computing lab, robotics lab, innovation centre, library (50,000+ books), Wi-Fi, auditorium, sports complex.
- Separate hostels for boys and girls with 24/7 security.
- Bus transport covering Erode, Salem, Namakkal, Tiruchengode routes.

## About

- [About JKKN CET](${siteUrl}/about): History, vision, mission, leadership team.
- [Faculty](${siteUrl}/faculty): 100+ experienced faculty. Student-teacher ratio 15:1.
- [Events & News](${siteUrl}/events): Technical symposia, cultural events, workshops.
- [Blog](${siteUrl}/blog): Articles on engineering education, campus updates, placement news.
- [Contact](${siteUrl}/contact): Admissions office, campus location map, enquiry form.

## Parent Organization

JKKN Institutions (jkkn.ac.in) — J.K.K. Rangammal Charitable Trust, established 1952. Operates 7 colleges and 2 schools on one integrated residential campus in Komarapalayam.
`
}

// =============================================================================
// MAIN / UMBRELLA INSTITUTION
// =============================================================================

function getMainLlmsTxt(siteUrl: string): string {
  return `# JKKN Institutions

> Premier educational group in Komarapalayam, Tamil Nadu, comprising 7 colleges and 2 schools. Established 1952 by the J.K.K. Rangammal Charitable Trust. NAAC accredited. 74+ years of educational excellence.

JKKN Institutions offers 50+ career-focused programs across Dental, Pharmacy, Engineering, Nursing, Allied Health Sciences, Arts & Science, and Education. All colleges are on one integrated 55-acre residential campus in Komarapalayam, Namakkal District, Tamil Nadu — 15 km from Erode city on NH-544.

Contact: +91 93458 55001 | info@jkkn.ac.in | ${siteUrl}

## Colleges Under JKKN

- [JKKN Dental College and Hospital](https://dental.jkkn.ac.in/): Established 1987. BDS, MDS programs. Affiliated to Tamil Nadu Dr. M.G.R. Medical University. Recognized by Dental Council of India. NAAC A accredited.
- [JKKN College of Pharmacy](https://pharmacy.jkkn.ac.in/): Established 1985. B.Pharm, M.Pharm, Pharm.D programs. PCI approved, AICTE approved.
- [JKKN College of Engineering and Technology](https://engg.jkkn.ac.in/): Established 2008. B.E., B.Tech, M.E., MBA programs. Anna University affiliated, AICTE approved, NAAC accredited.
- [JKKN College of Arts and Science](https://cas.jkkn.ac.in/): Established 1974. UG/PG programs. Periyar University affiliated. UGC recognized.
- [JKKN College of Allied Health Sciences](https://ahs.jkkn.ac.in/): Established 2019. B.Sc Allied Health Sciences. Tamil Nadu Dr. M.G.R. Medical University affiliated.
- [Sresakthimayeil Institute of Nursing and Research](https://nursing.sresakthimayeil.jkkn.ac.in/): Established 2006. B.Sc Nursing, P.B.B.Sc Nursing, M.Sc Nursing. Indian Nursing Council recognized.
- [JKKN College of Education](https://edu.jkkn.ac.in/): Established 2016. B.Ed. NCTE approved, TNTEU affiliated.

## Admissions

- [Admissions 2026-27](${siteUrl}/admissions): Programs across all 7 colleges. NEET required for Dental/Nursing/Allied Health; TNEA counselling for Engineering; merit-based for Arts & Science/Pharmacy.
- Online application: jkkn.in/admission-form.
- Contact admissions: +91 93458 55001.

## Accreditations

- NAAC Accreditation (Dental College: Grade A)
- AICTE Approval (Engineering, Pharmacy)
- Dental Council of India Recognition
- Pharmacy Council of India Approval
- Indian Nursing Council Recognition
- NCTE Approval (Education)
- Unnat Bharat Abhiyan — Ministry of HRD

## About

- [About JKKN](${siteUrl}/about): Trust history since 1952, leadership (Smt. N. Sendamaraai, Shri. S. Ommsharravana), vision and mission.
- [Blog](${siteUrl}/blog): Institutional news, program updates, student achievements.
- [Events](${siteUrl}/events): Inter-college events, cultural programs, workshops, seminars.
- [Contact](${siteUrl}/contact): Main campus address, enquiry forms, department contacts.
`
}

// =============================================================================
// DENTAL / PHARMACY / OTHER INSTITUTIONS (fallback)
// =============================================================================

function getGenericLlmsTxt(institutionId: string, siteUrl: string): string {
  return `# JKKN ${institutionId.charAt(0).toUpperCase() + institutionId.slice(1)} Institution

> Part of JKKN Institutions — J.K.K. Rangammal Charitable Trust, Komarapalayam, Tamil Nadu. Established 1952.

- [Home](${siteUrl}): Institution overview, programs, and admissions.
- [Admissions](${siteUrl}/admissions): Program eligibility, fees, and application process.
- [About](${siteUrl}/about): History, leadership, campus, and accreditations.
- [Contact](${siteUrl}/contact): Campus address, phone, and email.

Parent organization: JKKN Institutions (jkkn.ac.in)
`
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Returns the appropriate llms.txt content for the given institution.
 *
 * @param institutionId - The NEXT_PUBLIC_INSTITUTION_ID value
 * @param siteUrl - The canonical site URL (NEXT_PUBLIC_SITE_URL)
 */
export function getLlmsTxt(institutionId: string, siteUrl: string): string {
  switch (institutionId) {
    case 'engineering':
      return getEngineeringLlmsTxt(siteUrl)
    case 'main':
      return getMainLlmsTxt(siteUrl)
    default:
      return getGenericLlmsTxt(institutionId, siteUrl)
  }
}
