/**
 * FAQ Schema for Admissions & Placements Pages
 *
 * Generates FAQPage structured data (schema.org) for pages with frequently asked questions.
 * This enables FAQ rich results in Google Search.
 */

export interface FAQItem {
  question: string
  answer: string
}

/**
 * FAQ Schema Generator Component
 */
export function FAQSchemaGenerator({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Admissions FAQ Schema
 * For /admissions pages
 */
export function FAQSchemaAdmissions() {
  const faqs: FAQItem[] = [
    {
      question: 'How do I apply for JKKN Engineering College admission 2026-27?',
      answer: 'Apply online at jkkn.ac.in/admissions or visit our campus with required documents. You can also call +91 93458 55001 for admission guidance. Applications are accepted throughout the year, but seats are limited.'
    },
    {
      question: 'What are the eligibility criteria for B.E./B.Tech admission?',
      answer: '10+2 with Mathematics, Physics, and Chemistry/Computer Science/Biology with minimum 50% aggregate. Valid TNEA/counseling rank preferred. Direct admission also available based on merit.'
    },
    {
      question: 'What is the fee structure for engineering courses?',
      answer: 'Annual tuition fees range from ₹75,000 to ₹1,00,000 depending on the branch. Additional charges for hostel, transportation, and activities apply. Scholarships and fee concessions available for eligible students.'
    },
    {
      question: 'Does JKKN Engineering College provide hostel facilities?',
      answer: 'Yes, separate hostels for boys and girls with 24/7 security, Wi-Fi, mess facilities, and recreational rooms. Hostel fees are approximately ₹50,000 per year including food and accommodation.'
    },
    {
      question: 'Is JKKN Engineering College AICTE approved and Anna University affiliated?',
      answer: 'Yes, JKKN College of Engineering & Technology is AICTE approved and affiliated to Anna University, Chennai. We are also NAAC accredited with excellent placement records.'
    },
    {
      question: 'What documents are required for admission?',
      answer: '10th & 12th mark sheets, transfer certificate, conduct certificate, community certificate (if applicable), Aadhar card, passport size photos, and TNEA allotment order (if applicable).'
    },
    {
      question: 'Are scholarships available for engineering students?',
      answer: 'Yes, scholarships are available under Government schemes, merit-based scholarships for toppers, and management scholarships for economically weaker sections. Apply during admission process.'
    },
    {
      question: 'What is the admission process for lateral entry (Diploma holders)?',
      answer: 'Diploma holders can join directly in 2nd year B.E./B.Tech through TNEA counseling or direct admission. Minimum 50% aggregate required in diploma. Limited seats available per branch.'
    },
  ]

  return <FAQSchemaGenerator faqs={faqs} />
}

/**
 * Placements FAQ Schema
 * For /placements pages
 */
export function FAQSchemaPlacements() {
  const faqs: FAQItem[] = [
    {
      question: 'What is the placement record of JKKN Engineering College?',
      answer: 'JKKN Engineering College has achieved 95%+ placement success with 500+ students placed annually. Top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, Tech Mahindra, Amazon, and many more.'
    },
    {
      question: 'What is the highest package offered at JKKN?',
      answer: 'The highest package offered is ₹12 LPA by top tech companies. Average package is ₹4.5 LPA. Special training programs ensure students are industry-ready from day one.'
    },
    {
      question: 'Which companies visit JKKN for campus placements?',
      answer: 'Top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, Tech Mahindra, Amazon, Zoho, Accenture, Capgemini, L&T, Ashok Leyland, and 100+ other companies annually.'
    },
    {
      question: 'Does JKKN provide placement training and preparation?',
      answer: 'Yes, comprehensive placement training including aptitude, reasoning, verbal ability, technical skills, coding practice, mock interviews, group discussions, and resume building from 3rd year onwards.'
    },
    {
      question: 'Are internships available for students at JKKN?',
      answer: 'Yes, mandatory internships in 3rd/4th year with industry partners. Many students secure pre-placement offers (PPOs) through internships. Summer internships also arranged annually.'
    },
  ]

  return <FAQSchemaGenerator faqs={faqs} />
}

/**
 * About/General FAQ Schema
 * For /about pages
 */
export function FAQSchemaAbout() {
  const faqs: FAQItem[] = [
    {
      question: 'What courses are offered at JKKN College of Engineering?',
      answer: 'JKKN offers B.E. in CSE, ECE, EEE, Mechanical, and B.Tech in IT. Postgraduate programs include M.E. CSE and MBA. All programs are AICTE approved and affiliated to Anna University.'
    },
    {
      question: 'Where is JKKN College of Engineering located?',
      answer: 'JKKN College of Engineering & Technology is located in Kumarapalayam, Namakkal District, Tamil Nadu, on the Salem-Coimbatore National Highway (NH-544). Well connected by road and rail.'
    },
    {
      question: 'Is JKKN Engineering College accredited?',
      answer: 'Yes, JKKN is NAAC accredited, AICTE approved, and affiliated to Anna University, Chennai. We maintain high academic standards and excellent infrastructure for quality education.'
    },
    {
      question: 'What facilities are available at JKKN Engineering College?',
      answer: 'State-of-the-art laboratories, modern library with 50,000+ books, Wi-Fi campus, sports facilities, seminar halls, auditorium, cafeteria, bus transport, separate hostels, and 24/7 medical care.'
    },
    {
      question: 'What is the student strength at JKKN Engineering College?',
      answer: 'JKKN has 2000+ students across all branches and years. Faculty strength of 100+ experienced professors ensures personalized attention with optimal student-teacher ratio of 15:1.'
    },
  ]

  return <FAQSchemaGenerator faqs={faqs} />
}
