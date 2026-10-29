/**
 * Official data for JKKN College of Engineering and Technology (engg.jkkn.ac.in), exactly as the
 * regulators and government lists print it. Read live on 2026-10-29.
 *
 * Every value names its source. Change a value only from a newer official document - never from
 * memory, an aggregator or our own older pages. Things the lists do not print (NAAC validity, the
 * autonomy period, a fee committee order) are left out on purpose until the office supplies the
 * document.
 */

export const ENGG_SOURCES = {
  aicteEoa: {
    body: 'All India Council for Technical Education (AICTE), Extension of Approval 2026-27',
    url: 'https://engg.jkkn.ac.in/pdfs/approvals/EOA-Report-2026-2027.pdf',
    asOn: '16-03-2026',
  },
  ugcAutonomous: {
    body: 'University Grants Commission (UGC), List of Approved Autonomous Colleges',
    url: 'https://www.ugc.gov.in/pdfnews/8688705_List-of-Autonomous-Colleges.pdf',
    asOn: '28-02-2026',
  },
  ugcColleges: {
    body: 'University Grants Commission (UGC), Colleges list under Section 2(f) and 12(B)',
    url: 'https://www.ugc.gov.in/colleges',
    asOn: '29-10-2026',
  },
  naac: {
    body: 'National Assessment and Accreditation Council (NAAC), Institutions having valid accreditation',
    url: 'https://www.naac.gov.in/images/docs/ACCREDITATION_STATUS/Institutions_accredited_by_NAAC_having_valid_accreditation-as_on_14082025_1.xlsx',
    asOn: '14-08-2025',
  },
  dote: {
    body: 'Directorate of Technical Education, Tamil Nadu - TNEA 2026 and TN MBA / MCA 2026 lists',
    url: 'https://dte.tn.gov.in/self-financing-engineering-colleges',
    asOn: '29-10-2026',
  },
  aishe: {
    body: 'AISHE Higher Education Institution Directory, Ministry of Education',
    url: 'https://dashboard.aishe.gov.in/hedirectory/',
    asOn: '29-10-2026',
  },
} as const

export const ENGG_OFFICIAL = {
  aicte: {
    academicYear: '2026-27',
    fileNo: 'F.No. Southern/1-46224546036/2026/EOA',
    approvalDate: '16 March 2026',
    permanentId: '1-8323181',
  },
  /** AICTE Extension of Approval 2026-27, intake per programme (sum 372: UG 300, PG 72). */
  intake: [
    { programme: 'B.E. Computer Science and Engineering', seats: 60 },
    { programme: 'B.E. Electronics and Communication Engineering', seats: 60 },
    { programme: 'B.E. Electrical and Electronics Engineering', seats: 60 },
    { programme: 'B.E. Mechanical Engineering', seats: 60 },
    { programme: 'B.Tech Information Technology', seats: 60 },
    { programme: 'M.E. Computer Science and Engineering', seats: 12 },
    { programme: 'MBA', seats: 60 },
  ],
  totalSeats: 372,
  programmeCount: 7,
  ugBranchCount: 5,
  naac: { grade: 'B+', cgpa: '2.67', cycle: 'first cycle', declared: '26 December 2024' },
  ugc: { autonomousSerialNo: '1174', section: '2(f)' },
  codes: { tnea: '2647', tnMba: '2647', aishe: 'C-37096', nirf: 'IR-E-C-37096' },
  /** The spellings each official list uses for this college. */
  officialNames: [
    { name: 'J.K.K. Natraja College of Engineering & Technology', list: 'AICTE' },
    { name: 'J.K.K. Nataraja College of Engineering and Technology', list: 'UGC, Anna University, DoTE' },
    { name: 'J.K.K. Nattraja College of Engineering & Technology', list: 'AISHE' },
    { name: 'JKK Nattraja College of Engineering and Technology', list: 'NAAC' },
  ],
} as const

export const NAAC_LABEL = `NAAC Accredited (${ENGG_OFFICIAL.naac.grade})`
export const UGC_SECTION_LABEL = `Listed by UGC under Section ${ENGG_OFFICIAL.ugc.section}`

export function sourceLine(source: { body: string; url: string; asOn: string }): string {
  return `Source: ${source.body}, ${source.url}, as on ${source.asOn}`
}

/** Top-of-page answer for /approvals-and-affiliation (47 words). */
export const APPROVALS_DIRECT_ANSWER =
  'JKKN College of Engineering and Technology, Komarapalayam, Namakkal District, Tamil Nadu, is an AICTE-approved autonomous college affiliated to Anna University, Chennai. For 2026-27 AICTE approved 372 seats across five B.E./B.Tech branches, M.E. CSE and MBA. Its TNEA counselling code is 2647 and its AISHE code is C-37096.'

export interface OfficialFact {
  label: string
  value: string
  source: string
}

export const APPROVALS_KEY_FACTS: OfficialFact[] = [
  {
    label: 'Approval',
    value: `AICTE Extension of Approval for the academic year ${ENGG_OFFICIAL.aicte.academicYear} (${ENGG_OFFICIAL.aicte.fileNo}, dated ${ENGG_OFFICIAL.aicte.approvalDate}). AICTE Permanent ID: ${ENGG_OFFICIAL.aicte.permanentId}.`,
    source: sourceLine(ENGG_SOURCES.aicteEoa),
  },
  {
    label: 'Approved intake 2026-27',
    value: `${ENGG_OFFICIAL.totalSeats} seats - B.E. CSE 60, B.E. ECE 60, B.E. EEE 60, B.E. Mechanical 60, B.Tech IT 60, M.E. CSE 12, MBA 60.`,
    source: sourceLine(ENGG_SOURCES.aicteEoa),
  },
  {
    label: 'Affiliation',
    value: 'Anna University, Chennai.',
    source: sourceLine(ENGG_SOURCES.aicteEoa),
  },
  {
    label: 'Autonomous status',
    value: `Autonomous status conferred by UGC, New Delhi and Anna University, Chennai. Listed in the UGC List of Approved Autonomous Colleges (S.No. ${ENGG_OFFICIAL.ugc.autonomousSerialNo}) under Anna University, Chennai.`,
    source: sourceLine(ENGG_SOURCES.ugcAutonomous),
  },
  {
    label: 'UGC listing',
    value: 'Listed by UGC under Section 2(f) of the UGC Act, 1956.',
    source: sourceLine(ENGG_SOURCES.ugcColleges),
  },
  {
    label: 'NAAC',
    value: `Accredited by NAAC with Grade ${ENGG_OFFICIAL.naac.grade} (CGPA ${ENGG_OFFICIAL.naac.cgpa}), ${ENGG_OFFICIAL.naac.cycle}, result declared ${ENGG_OFFICIAL.naac.declared}.`,
    source: sourceLine(ENGG_SOURCES.naac),
  },
  {
    label: 'Counselling codes',
    value: `TNEA (B.E. / B.Tech): ${ENGG_OFFICIAL.codes.tnea}. Tamil Nadu MBA / MCA admissions: ${ENGG_OFFICIAL.codes.tnMba}.`,
    source: sourceLine(ENGG_SOURCES.dote),
  },
  {
    label: 'Data codes',
    value: `AISHE code: ${ENGG_OFFICIAL.codes.aishe}. NIRF institute ID: ${ENGG_OFFICIAL.codes.nirf}.`,
    source: sourceLine(ENGG_SOURCES.aishe),
  },
  {
    label: 'Also listed as',
    value: ENGG_OFFICIAL.officialNames.map((entry) => `${entry.name} (${entry.list})`).join('; ') + '.',
    source: 'Source: the AICTE, UGC, Anna University, DoTE, AISHE and NAAC lists above, read on 29-10-2026',
  },
]

export interface OfficialFaq {
  question: string
  /** How a parent says it aloud; printed under the question, never in the JSON-LD. */
  alsoAsked: string
  answer: string
}

export const APPROVALS_FAQS: OfficialFaq[] = [
  {
    question: 'Is JKKN College of Engineering and Technology approved by AICTE?',
    alsoAsked: 'JKKN engineering college AICTE approved ah?',
    answer:
      "Yes. AICTE granted the college Extension of Approval for the academic year 2026-27 (F.No. Southern/1-46224546036/2026/EOA, dated 16 March 2026) for 372 seats across seven programmes. The college's AICTE Permanent ID is 1-8323181, and its affiliating university is Anna University, Chennai.",
  },
  {
    question: 'What is the TNEA counselling code of JKKN College of Engineering and Technology?',
    alsoAsked: 'JKKN engineering college TNEA code enna?',
    answer:
      'The TNEA counselling code is 2647. In the TNEA 2026 lists of the Directorate of Technical Education, the college appears as J.K.K. Nataraja College of Engineering and Technology (Autonomous), Komarapalayam, Namakkal, with B.E. CSE, ECE, EEE, Mechanical and B.Tech IT. The same code is used in Tamil Nadu MBA counselling.',
  },
  {
    question: 'Is JKKN College of Engineering and Technology an autonomous college?',
    alsoAsked: 'JKKN engineering college autonomous ah?',
    answer:
      'Yes. Autonomous status has been conferred by UGC, New Delhi and Anna University, Chennai. The college is listed in the UGC List of Approved Autonomous Colleges (as on 28 February 2026) under Anna University, Chennai, and it remains affiliated to Anna University.',
  },
  {
    question: 'What is the NAAC grade of JKKN College of Engineering and Technology?',
    alsoAsked: 'JKKN engineering college NAAC grade enna?',
    answer:
      "NAAC has accredited the college with Grade B+ (CGPA 2.67) in its first cycle, with the result declared on 26 December 2024. This appears in NAAC's list of institutions with valid accreditation (as on 14 August 2025), where the college is listed as JKK Nattraja College of Engineering and Technology.",
  },
  {
    question: 'How many seats does JKKN College of Engineering and Technology have for 2026-27?',
    alsoAsked: 'JKKN engineering la evlo seats iruku?',
    answer:
      'AICTE has approved 372 seats for 2026-27: 60 each in B.E. Computer Science and Engineering, B.E. Electronics and Communication Engineering, B.E. Electrical and Electronics Engineering, B.E. Mechanical Engineering and B.Tech Information Technology, 12 in M.E. Computer Science and Engineering, and 60 in MBA.',
  },
  {
    question: 'Does JKKN College of Engineering and Technology offer B.Tech AI & ML?',
    alsoAsked: 'JKKN la B.Tech AI ML course iruka?',
    answer:
      'Not for 2026-27. The AICTE Extension of Approval for 2026-27 lists seven programmes: B.E. CSE, ECE, EEE and Mechanical, B.Tech IT, M.E. CSE and MBA. For questions about courses, contact the admissions office directly at engg@jkkn.ac.in or +91 93458 55001.',
  },
]
