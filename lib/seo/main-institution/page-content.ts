/**
 * Main-Institution page content — FAQs, HowTo steps, speakable selectors.
 *
 * Each entry is authored for voice/AEO: 40–60 word answers, natural
 * question phrasing ("what…", "how to…", "when…", "who…").
 *
 * Contact, address and program data come from institution-seo-config.ts —
 * never duplicated here.
 */

import type { FAQ, HowToStep } from './builders'

// =============================================================================
// ADMISSIONS — How-to + FAQ
// =============================================================================

export const ADMISSIONS_HOWTO_NAME =
  'How to Apply for Admission at JKKN Institutions 2026-27'

export const ADMISSIONS_HOWTO_DESCRIPTION =
  'Step-by-step guide to apply for undergraduate and postgraduate admissions at JKKN Institutions, Komarapalayam — covering course selection, online application, document submission, counselling, and fee payment.'

export const ADMISSIONS_HOWTO_STEPS: HowToStep[] = [
  {
    name: 'Choose your programme',
    text: 'Browse the 50+ programmes offered across JKKN\'s 7 colleges — Dental, Pharmacy, Engineering, Nursing, Allied Health Sciences, Arts & Science, and Education. Confirm eligibility criteria (minimum marks and qualifying examination) for your preferred course.',
    url: 'https://jkkn.ac.in/courses-offered',
  },
  {
    name: 'Fill the online application form',
    text: 'Visit jkkn.ac.in/admissions and complete the online application form. Provide personal details, academic records, and the programme(s) you wish to apply for. Application fee is payable online via UPI, card, or net banking.',
    url: 'https://jkkn.ac.in/admissions',
  },
  {
    name: 'Upload required documents',
    text: 'Scan and upload your 10th, 12th, and qualifying exam mark sheets, transfer certificate, community certificate, Aadhaar, and passport-size photograph. Ensure scans are clear and below the maximum file size listed on the form.',
  },
  {
    name: 'Attend counselling and entrance test (if applicable)',
    text: 'Professional programmes such as BDS, MDS, B.Pharm, Pharm.D, and engineering follow statutory counselling through TNEA / TN MGRMU / NEET. Arts & Science and management programmes allow direct admission based on academic merit.',
  },
  {
    name: 'Pay the course fee and confirm admission',
    text: 'On allotment, pay the first-year tuition and hostel fees within the given deadline to confirm your seat. Scholarships and education loans through approved banks are available for eligible students.',
    url: 'https://jkkn.ac.in/admissions',
  },
  {
    name: 'Complete joining formalities',
    text: 'Report to the campus on the joining date with original documents for verification. Collect your student ID, uniform (for professional programmes), hostel room allotment, and academic calendar. Orientation begins the same week.',
  },
]

export const ADMISSIONS_FAQS: FAQ[] = [
  {
    q: 'When do admissions open at JKKN Institutions for 2026-27?',
    a: 'Online applications for the 2026-27 academic year are open at jkkn.ac.in/admissions. Professional programmes close once statutory counselling rounds complete. Arts & Science and allied programmes continue until seats are filled.',
  },
  {
    q: 'What are the eligibility criteria for admission at JKKN?',
    a: 'Undergraduate programmes require a pass in 10+2 with subject-specific minimums. BDS, B.Pharm, and Pharm.D need PCB/PCM with qualifying NEET / statutory scores. Arts & Science programmes accept minimum 45% in 10+2.',
  },
  {
    q: 'Does JKKN Institutions offer scholarships?',
    a: 'Yes. JKKN offers merit-based scholarships, government SC/ST/BC/MBC scholarships, first-graduate assistance, and sports/sibling concessions. Bank education loans are available through SBI, IOB, Canara Bank, and Indian Bank in campus.',
  },
  {
    q: 'What is the fee structure at JKKN Institutions?',
    a: 'Fees vary by programme — Arts & Science UG courses start around ₹30,000 per year, Engineering ₹60,000+, Nursing ₹80,000+, Pharm.D and BDS follow state-fixed fees. Hostel and mess are charged separately. Contact admissions for exact figures.',
  },
  {
    q: 'How can I contact the JKKN admission office?',
    a: 'Call +91-9345855001 or email info@jkkn.ac.in. The admissions office is open Monday to Saturday, 9:00 AM to 6:00 PM at Natarajapuram, Komarapalayam, Namakkal District, Tamil Nadu — 638183.',
  },
  {
    q: 'Is hostel accommodation available at JKKN?',
    a: 'Yes. Separate hostels for boys and girls are available inside the campus with Wi-Fi, 24×7 security, dining, and medical support. Hostel allotment is on a first-come-first-served basis after admission confirmation.',
  },
]

export const ADMISSIONS_SPEAKABLE_SELECTORS = [
  'h1',
  '[data-speakable="admissions-intro"]',
  '[data-speakable="admissions-steps"]',
]

// =============================================================================
// HOMEPAGE speakable
// =============================================================================

export const HOME_SPEAKABLE_SELECTORS = [
  'h1',
  '[data-speakable="home-intro"]',
]

// =============================================================================
// ALUMNI
// =============================================================================

export const ALUMNI_FAQS: FAQ[] = [
  {
    q: 'How can I connect with the JKKN alumni network?',
    a: 'Join the JKKN Alumni Association via alumni.jkkn.ac.in or write to alumni@jkkn.ac.in. The network links 50,000+ JKKN graduates worldwide across dental, pharmacy, engineering, nursing, and arts & science fields.',
  },
  {
    q: 'How do I update my details with the JKKN alumni cell?',
    a: 'Log in to alumni.jkkn.ac.in and update your profile, or email alumni@jkkn.ac.in with your name, graduating batch, programme, and current role. Updated records help us invite you to alumni meets and reunions.',
  },
  {
    q: 'What events does the JKKN alumni association organise?',
    a: 'The alumni cell hosts annual reunions, decadal batch meets, mentorship talks, career-guidance sessions for current students, and convocation homecoming. Announcements go through email, WhatsApp groups, and the alumni portal.',
  },
]

// =============================================================================
// CONTACT
// =============================================================================

export const CONTACT_FAQS: FAQ[] = [
  {
    q: 'What is the phone number of JKKN Institutions?',
    a: 'The main admissions helpline is +91-9345855001. For general queries, email info@jkkn.ac.in. Lines are open Monday to Saturday between 9:00 AM and 6:00 PM Indian Standard Time.',
  },
  {
    q: 'Where is JKKN Institutions located?',
    a: 'JKKN Institutions is at Natarajapuram, NH-544 (Salem–Coimbatore highway), Komarapalayam, Namakkal District, Tamil Nadu, PIN 638183. The campus is 45 km from Erode and 75 km from Salem, easily reachable by bus or train.',
  },
  {
    q: 'How do I reach JKKN campus by public transport?',
    a: 'The nearest railway station is Erode Junction (45 km). The nearest airport is Salem (70 km) or Coimbatore (120 km). Government and private buses between Salem and Coimbatore stop at Komarapalayam bus stand, 3 km from the campus.',
  },
]

// =============================================================================
// FACULTY listing
// =============================================================================

export const FACULTY_FAQS: FAQ[] = [
  {
    q: 'How qualified are the faculty at JKKN Institutions?',
    a: 'JKKN faculty include PhD holders, postgraduate specialists, and industry-experienced professionals across dental, pharmacy, engineering, nursing, and arts & science disciplines. Many hold Anna University, Madras University, and Tamil Nadu MGR Medical University degrees.',
  },
  {
    q: 'Does JKKN faculty publish research and papers?',
    a: 'Yes. JKKN faculty publish in Scopus and UGC CARE listed journals, supervise PhD scholars, and lead funded research projects. Research activity is coordinated by the IQAC (Internal Quality Assurance Cell).',
  },
]

// =============================================================================
// ACHIEVEMENTS
// =============================================================================

export const ACHIEVEMENTS_FAQS: FAQ[] = [
  {
    q: 'What awards has JKKN Institutions received?',
    a: 'JKKN has received NAAC A accreditation (Dental College), recognition for 74+ years of educational excellence, and selection under Unnat Bharat Abhiyan by the Ministry of HRD. Faculty and students win state- and national-level competitions yearly.',
  },
  {
    q: 'What are JKKN student placement records?',
    a: 'JKKN records 92%+ placement success across programmes. Top recruiters include Foxconn, Apex Pharma, Apotex, Cipla, Bosch, and leading hospitals across South India. Campus drives begin in the pre-final year with placement training.',
  },
]

// =============================================================================
// NAAC / IQAC / Approvals
// =============================================================================

export const ACCREDITATION_FAQS: FAQ[] = [
  {
    q: 'Is JKKN Institutions NAAC accredited?',
    a: 'Yes. JKKN colleges hold NAAC accreditation from the National Assessment and Accreditation Council. The Dental College carries the NAAC A grade. Current NAAC certificates and SSR reports are published under the NAAC section of this website.',
  },
  {
    q: 'What approvals and recognitions does JKKN hold?',
    a: 'JKKN colleges are approved by AICTE, Dental Council of India (DCI), Pharmacy Council of India (PCI), Indian Nursing Council (INC), NCTE, and affiliated to Anna University, Tamil Nadu Dr. M.G.R. Medical University, and Periyar University.',
  },
  {
    q: 'What is the role of the IQAC at JKKN Institutions?',
    a: 'The Internal Quality Assurance Cell (IQAC) monitors academic quality, coordinates NAAC accreditation, runs feedback from students and stakeholders, and publishes the Annual Quality Assurance Report (AQAR). IQAC drives continuous improvement across departments.',
  },
]

// =============================================================================
// INSTITUTION DISTINCTIVENESS (about-style)
// =============================================================================

export const DISTINCTIVENESS_FAQS: FAQ[] = [
  {
    q: 'What makes JKKN Institutions unique?',
    a: 'JKKN was founded in 1952 to advance girls\' education in rural Tamil Nadu. 74+ years later it runs 7 colleges and 4 schools on a single campus, produces 50,000+ alumni, and keeps a 92%+ placement rate with NAAC-accredited quality.',
  },
  {
    q: 'Who founded JKKN Institutions?',
    a: 'Kodai Vallal Shri J.K.K. Natarajah founded the first school in 1952 and established the J.K.K. Rangammal Charitable Trust in 1969. Today the trust is led by Chairperson Smt. N. Sendamaraai and Director Shri. S. Ommsharravana.',
  },
]
