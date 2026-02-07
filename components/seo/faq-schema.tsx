/**
 * FAQ JSON-LD Schema for JKKN Institutions
 *
 * This component renders structured data for search engines.
 * It has NO visual impact on the page - only visible in HTML source.
 *
 * Used for:
 * - Google Rich Results (FAQ snippets)
 * - Search result enhancements
 * - Voice assistant answers
 */
export function FAQSchema() {
  const faqs = [
    {
      question: 'What is JKKN Institutions?',
      answer:
        'JKKN Institutions (JKKN) is a premier educational group in Komarapalayam, Tamil Nadu, comprising 7 colleges and 4 schools. Established in 1952, JKKN offers 50+ programs in dental, pharmacy, engineering, nursing, allied and arts with 92%+ placement success.',
    },
    {
      question: 'Why is JKKN the best college in Erode region?',
      answer:
        "JKKN is recognized as Erode's best college due to 74+ years of excellence, NAAC accreditation, 92%+ placement rate, and 50,000+ successful alumni. Top recruiters include Foxconn, Apex Pharma, Apotex, Cipla and Bosch making it the preferred choice for career-focused Learners.",
    },
    {
      question: 'Who founded JKKN Institutions?',
      answer:
        "JKKN was founded by visionary Kodai Vallal Shri. J.K.K. Natarajah, who started a school in 1965 to promote girls' education. His vision led to J.K.K. Rangammal Trust (1969), now led by Chairperson Smt. N. Sendamaraai and Director Shri. S. Ommsharravana.",
    },
    {
      question: 'How many colleges are under JKKN?',
      answer:
        'JKKN comprises 11 institutions: Dental College, Pharmacy College, Engineering College, Allied Health Sciencess, Arts & Science College (Autonomous), Education College, Nursing College, Matriculation School, Nattraja Vidhyalaya, Elementary School and Girls Higher Secondary School \u2014all located on one integrated residential campus in Komarapalayam.',
    },
    {
      question: 'What courses does JKKN offer?',
      answer:
        'JKKN offers 50+ programs including BDS/MDS (Dental), B.Pharm/M.Pharm/Pharm.D (Pharmacy), B.E./B.Tech/MBA (Engineering), B.Sc/M.Sc Nursing, Allied Health Sciencess, B.Ed, and various UG/PG Arts & Science degrees with industry-relevant specializations.',
    },
    {
      question: 'Which universities is JKKN affiliated with?',
      answer:
        'JKKN colleges are affiliated with Tamil Nadu Dr. M.G.R. Medical University (Dental/Nursing/Pharmacy), Anna University Chennai (Engineering), and Periyar University Salem (Arts & Science). All programs are approved by AICTE, DCI, PCI, INC, and NAAC.',
    },
    {
      question: 'How do I apply for JKKN admission 2026-27?',
      answer:
        'Apply online at jkkn.in/admission-form for 2026-27 admissions. Submit required documents, complete fee payment, and attend counseling if applicable. For Dental/Nursing, NEET scores are required; for Engineering, TNEA counseling applies. Early bird discounts available for early applicants.',
    },
    {
      question: 'What is the BDS admission process at JKKN Dental College?',
      answer:
        'BDS admission requires qualifying NEET UG and participating in Tamil Nadu DME counseling. Candidates must be 17+ years old and have completed 10+2 with Physics, Chemistry, and Biology. Admission is based on NEET scores and seat availability.',
    },
    {
      question: 'What are engineering admission requirements at JKKN?',
      answer:
        'B.E./B.Tech admission is through TNEA (Tamil Nadu Engineering Admissions) counseling. Candidates need 10+2 with Mathematics, Physics, and Chemistry from a recognized board. The college follows Anna University guidelines. MBA have separate eligibility criteria.',
    },
    {
      question: "What is JKKN's placement rate?",
      answer:
        'JKKN maintains an impressive 90%+ placement rate across institutions. The Dental College achieved 92% placements in 2024. The dedicated Placement Cell organizes campus drives, skill development programs, and mock interviews to enhance Learner employability.',
    },
    {
      question: 'How do I reach JKKN from Erode?',
      answer:
        'JKKN is located just 15 km from Erode City on NH-544 (Salem-Coimbatore Highway). Reach by bus from Erode Bus Stand (30 minutes), train to Erode Junction (18 km), or air via Salem Airport (60 km) or Coimbatore Airport (100 km).',
    },
    {
      question: "What is JKKN's address?",
      answer:
        'JKKN Institutions, Natarajapuram, NH-544 (Salem-Coimbatore Highway), Komarapalayam, Namakkal District, Tamil Nadu - 638183. Contact: 9345855001 | Email: info@jkkn.ac.in. Located on the main highway for easy accessibility.',
    },
    {
      question: 'Which areas does JKKN serve?',
      answer:
        'JKKN primarily serves Learners from Erode, Salem, Namakkal, Komarapalayam, Tiruchengode, Sankagiri, Bhavani, Perundurai, and Gobichettipalayam. However, Learners from across Tamil Nadu, neighboring states locations attend due to its excellent reputation.',
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
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
