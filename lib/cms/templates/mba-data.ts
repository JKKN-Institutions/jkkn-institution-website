import type { MBACoursePageProps } from '@/components/cms-blocks/content/mba-course-page'

/**
 * Comprehensive MBA Course Data
 * JKKN Institutions
 *
 * Master of Business Administration program with specializations in
 * Marketing, Finance, HR, and Operations Management
 */
export const MBA_SAMPLE_DATA: MBACoursePageProps = {
  // ==========================================
  // Hero Section
  // ==========================================
  heroTitle: 'Master of Business Administration',
  heroSubtitle:
    'Transform your career with our comprehensive MBA program. Develop strategic thinking, leadership skills, and business acumen to excel in today\'s dynamic corporate world. Our AICTE-approved program combines rigorous academics with practical industry exposure.',
  heroStats: [
    { icon: '', label: 'Program Duration', value: '2 Years' },
    { icon: '', label: 'Specializations', value: '4' },
    { icon: '', label: 'Placement Cell', value: 'On-Campus' },
    { icon: '', label: 'Approval', value: 'AICTE' },
  ],
  heroCTAs: [
    { label: 'Enquire for 2027-28', link: 'https://www.jkkn.ai/apply/jkkn-admission-2026', variant: 'primary' },
    { label: 'View Learning Framework', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: 'AICTE Approved',
  admissionBadge: '2027-28 Enquiry Open',

  // ==========================================
  // Program Overview
  // ==========================================
  overviewTitle: 'Program Overview',
  overviewSubtitle: 'Why Choose MBA at JKKN?',
  overviewDescription: [
    'Our MBA program is designed to create future business leaders who can navigate the complexities of modern business environments. With a perfect blend of theoretical knowledge and practical application, we prepare our learners for senior management roles across industries.',
    'The learning framework emphasizes case-based learning, live projects, and industry interactions. Learners gain exposure to real-world business challenges through internships with leading corporations, consulting projects, and entrepreneurship initiatives.',
    'Our senior learners comprises experienced academicians and industry practitioners who bring diverse perspectives to the learning studio. The program also features regular guest lectures from CEOs, entrepreneurs, and business leaders, providing invaluable insights into current business practices and trends.',
  ],
  overviewImage:
    '/images/courses/mba/JKKN MBA (1).png',

  // ==========================================
  // Key Highlights
  // ==========================================
  highlightsTitle: 'Program Highlights',
  highlights: [
    {
      icon: 'Award',
      title: 'AICTE Approved',
      description:
        'Recognized by AICTE with rigorous quality standards ensuring excellent education and industry acceptance.',
    },
    {
      icon: 'Users',
      title: 'Industry Integration',
      description:
        'Guest lectures and workshops with industry practitioners as part of the learning framework.',
    },
    {
      icon: 'GraduationCap',
      title: 'Expert Senior Learners',
      description:
        'Learn from experienced senior learners and industry practitioners with deep expertise in their domains.',
    },
    {
      icon: 'Briefcase',
      title: 'Placement Support',
      description:
        'Dedicated placement cell coordinating on-campus recruitment drives and interview preparation.',
    },
    {
      icon: 'Target',
      title: 'Case-Based Learning',
      description:
        'Case-study based classes built on real business scenarios to develop analytical and problem-solving skills.',
    },
    {
      icon: 'BarChart3',
      title: 'Skill Development',
      description:
        'Comprehensive soft skills training including leadership, communication, negotiation, and presentation skills.',
    },
  ],

  // ==========================================
  // Specializations
  // ==========================================
  specializationsTitle: 'MBA Specializations',
  specializations: [
    {
      title: 'Marketing Management',
      description:
        'Master the art of creating customer value through strategic brand management, digital marketing, consumer behavior analysis, and market research.',
      icon: 'TrendingUp',
      courses: [
        'Digital Marketing & Social Media',
        'Brand Management',
        'Consumer Behavior',
        'Sales & Distribution Management',
        'Marketing Analytics',
      ],
    },
    {
      title: 'Financial Management',
      description:
        'Develop expertise in corporate finance, investment analysis, financial markets, risk management, and strategic financial decision-making.',
      icon: 'DollarSign',
      courses: [
        'Corporate Finance',
        'Investment Analysis',
        'Financial Markets',
        'Risk Management',
        'Mergers & Acquisitions',
      ],
    },
    {
      title: 'Human Resource Management',
      description:
        'Learn talent acquisition, performance management, organizational behavior, team member relations, and HR analytics to build high-performing teams.',
      icon: 'Users',
      courses: [
        'Talent Management',
        'Performance Management',
        'Organizational Behavior',
        'HR Analytics',
        'Industrial Relations',
      ],
    },
    {
      title: 'Operations Management',
      description:
        'Optimize business processes through supply chain management, project management, quality control, and data-driven operational strategies.',
      icon: 'Package',
      courses: [
        'Supply Chain Management',
        'Project Management',
        'Quality Management',
        'Operations Research',
        'Logistics Management',
      ],
    },
  ],

  // ==========================================
  // Curriculum (2 Years - 4 Semesters)
  // ==========================================
  curriculumTitle: 'MBA Learning Framework Structure',
  curriculumYears: [
    {
      year: 1,
      semesters: [
        {
          semester: 1,
          credits: 30,
          subjects: [
            { code: 'MB25C01', name: 'Statistics for Management', credits: 3 },
            { code: 'MB25C02', name: 'Management Concepts and Organizational Behavior', credits: 3 },
            { code: 'MB25C03', name: 'Managerial Economics', credits: 3 },
            { code: 'MB25101', name: 'Accounting for Decision Making', credits: 3 },
            { code: 'MB25C04', name: 'Legal Aspects of Business', credits: 3 },
            { code: 'MB25C05', name: 'Information Management', credits: 3 },
            { code: 'MB25103', name: 'Indian ethos and Business Ethics', credits: 3 },
            { code: 'MB25104', name: 'Contemporary Business Communication', credits: 3 },
            { code: 'MB25C06', name: 'Entrepreneurship Development', credits: 3 },
            { code: 'MB25107', name: 'Event Management', credits: 3 },
          ],
        },
        {
          semester: 2,
          credits: 27,
          subjects: [
            { code: 'MB25C07', name: 'Applied Operations', credits: 3 },
            { code: 'MB25201', name: 'Financial Management', credits: 3 },
            { code: 'MB25C09', name: 'Human Resource Management', credits: 3 },
            { code: 'MB25C11', name: 'Operations Management', credits: 3 },
            { code: 'MB25C08', name: 'Business Research Methods', credits: 3 },
            { code: 'MB25202', name: 'Business Analytics', credits: 3 },
            { code: 'MB25C10', name: 'Marketing Management', credits: 3 },
            { code: 'MB25203', name: 'Creativity and Innovation Learning Lab', credits: 3 },
            { code: 'MB25204', name: 'Data analysis and Business Modelling', credits: 3 },
          ],
        },
      ],
    },
    {
      year: 2,
      semesters: [
        {
          semester: 3,
          credits: 27,
          subjects: [
            { code: 'MB25C12', name: 'Strategic Management', credits: 3 },
            { code: 'MB25301', name: 'International Business', credits: 3 },
            { code: 'MB25PE1', name: 'Programme Elective I', credits: 3 },
            { code: 'MB25PE2', name: 'Programme Elective II', credits: 3 },
            { code: 'MB25PE3', name: 'Programme Elective III', credits: 3 },
            { code: 'MB25PE4', name: 'Programme Elective IV', credits: 3 },
            { code: 'MB25PE5', name: 'Programme Elective V', credits: 3 },
            { code: 'MB25PE6', name: 'Programme Elective VI', credits: 3 },
            { code: 'MB25302', name: 'Capstone Simulation', credits: 3 },
            { code: 'MB25303', name: 'Summer Internship', credits: 0 },
          ],
        },
        {
          semester: 4,
          credits: 6,
          subjects: [
            { code: 'MB25401', name: 'Project Work', credits: 6 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // Eligibility & Admission
  // ==========================================
  eligibilityTitle: 'Eligibility Criteria',
  eligibilityItems: [
    {
      criteria:
        'Bachelor\'s degree in any discipline from a recognized university with minimum 50% marks (45% for SC/ST candidates)',
    },
    {
      criteria:
        'Valid scores in entrance learning assessments: TANCET, CAT, MAT, XAT, CMAT, or ATMA',
    },
    {
      criteria:
        'Work experience is not mandatory but preferred (especially for Executive MBA track)',
    },
    {
      criteria:
        'Candidates appearing for final year learning assessments can apply provisionally',
    },
    {
      criteria:
        'Group discussion and personal interview performance will be considered for final selection',
    },
  ],
  documentsTitle: 'Required Documents',
  requiredDocuments: [
    'UG Degree Certificate and Mark Sheets (all semesters)',
    '10th and 12th Standard Mark Sheets & Certificates',
    'Entrance Learning Assessment Scorecard (TANCET/CAT/MAT/XAT/CMAT/ATMA)',
    'Transfer Certificate (TC) from previous institution',
    'Community Certificate (if applicable for reserved category)',
    'Passport size photographs (8 copies)',
    'Aadhar Card and PAN Card copies',
    'Work Experience Certificate (if applicable)',
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionProcessTitle: 'Admission Process',
  admissionSteps: [
    {
      step: 1,
      title: 'Online Application',
      description:
        'Fill out the online application form with personal and academic details. Upload required documents and entrance learning assessment scores.',
      icon: 'FileText',
    },
    {
      step: 2,
      title: 'Entrance Learning Assessment',
      description:
        'Submit valid TANCET/CAT/MAT/XAT/CMAT/ATMA scores. Candidates will be shortlisted based on entrance learning assessment performance.',
      icon: 'UserCheck',
    },
    {
      step: 3,
      title: 'Group Discussion',
      description:
        'Shortlisted candidates participate in group discussions to assess communication skills, teamwork, and analytical thinking.',
      icon: 'Users',
    },
    {
      step: 4,
      title: 'Personal Interview',
      description:
        'Face-to-face interview with selection committee to evaluate motivation, career goals, and overall fit for the program.',
      icon: 'Clock',
    },
    {
      step: 5,
      title: 'Document Verification',
      description:
        'Submit original documents for verification. Candidates must provide all certificates, mark sheets, and required documents.',
      icon: 'Check',
    },
    {
      step: 6,
      title: 'Admission Confirmation',
      description:
        'Pay admission fees and confirm your seat. Receive admission letter and join orientation program before classes begin.',
      icon: 'Award',
    },
  ],

  // ==========================================
  // Fee Structure
  // ==========================================
  feeTitle: 'Fee Structure (Annual)',
  feeBreakdown: [
    { component: 'Tuition Fee (Management Quota, 2026-27)', amount: '₹65,000' },
    { component: 'Tuition Fee (Government Quota)', amount: 'As per Govt. norms' },
    { component: 'Examination Fee & Caution Deposit', amount: 'As notified by the university' },
    { component: 'Hostel Fee (Optional)', amount: 'As quoted by the admissions office' },
    { component: 'Annual Tuition (Management Quota)', amount: '₹65,000', isTotal: true },
  ],
  feeDisclaimer:
    '*Annual tuition from the 2026-27 JKKN course fee sheet. Fee structure is subject to change.',

  // ==========================================
  // Career Opportunities
  // ==========================================
  careerTitle: 'Career Opportunities After MBA',
  careerPaths: [
    {
      icon: 'Briefcase',
      title: 'Business Development Manager',
      description:
        'Drive business growth through strategic partnerships, market expansion, and new revenue streams.',
    },
    {
      icon: 'BarChart3',
      title: 'Marketing Manager',
      description:
        'Lead marketing campaigns, brand strategies, and digital marketing initiatives for products and services.',
    },
    {
      icon: 'DollarSign',
      title: 'Financial Analyst',
      description:
        'Analyze financial data, prepare reports, and provide insights for investment and business decisions.',
    },
    {
      icon: 'Users',
      title: 'HR Manager',
      description:
        'Manage talent acquisition, team member development, performance management, and organizational culture.',
    },
    {
      icon: 'Target',
      title: 'Operations Manager',
      description:
        'Optimize business processes, manage supply chains, and ensure operational efficiency and quality.',
    },
    {
      icon: 'TrendingUp',
      title: 'Management Consultant',
      description:
        'Advise organizations on strategy, operations, and transformation to solve complex business challenges.',
    },
    {
      icon: 'Briefcase',
      title: 'Product Manager',
      description:
        'Define product vision, strategy, and roadmap while collaborating with cross-functional teams.',
    },
    {
      icon: 'Building2',
      title: 'Investment Banking Analyst',
      description:
        'Support M&A deals, IPOs, and corporate finance transactions with financial modeling and analysis.',
    },
    {
      icon: 'Lightbulb',
      title: 'Entrepreneur/Startup Founder',
      description:
        'Launch and scale your own venture with comprehensive business knowledge and entrepreneurial skills.',
    },
    {
      icon: 'Award',
      title: 'Business Analyst',
      description:
        'Bridge business needs and technology solutions through data analysis and process improvement.',
    },
    {
      icon: 'BarChart3',
      title: 'Sales Manager',
      description:
        'Lead sales teams, develop strategies, manage client relationships, and drive revenue growth.',
    },
    {
      icon: 'Target',
      title: 'Strategy Manager',
      description:
        'Develop corporate strategies, analyze market trends, and guide long-term business planning.',
    },
  ],

  // ==========================================
  // Placement Statistics
  // ==========================================
  placementTitle: 'Placement Support',
  placementStats: [
    { label: 'Placement Cell', value: 'On-Campus', icon: 'Award' },
    { label: 'Placement Training', value: 'Included', icon: 'TrendingUp' },
  ],

  // ==========================================
  // Top Recruiters
  // ==========================================
  recruitersTitle: 'Our Top Recruiters',
  // Emptied 2026-10-01 (GL6-371): unverified recruiter names; restore only from a
  // placement-office verified list. The section does not render while this is empty.
  recruiters: [],

  // ==========================================
  // Facilities
  // ==========================================
  facilitiesTitle: 'World-Class Facilities',
  facilities: [
    {
      name: 'Smart Learning Studios',
      description:
        'Technology-enabled learning studios with projectors, audio systems, and video conferencing for interactive learning experiences.',
      image:
        '/images/engineering/classrooms/classroom-01.jpg',
    },
    {
      name: 'Computer Learning Labs',
      description:
        'State-of-the-art computer learning labs with latest software for analytics, simulations, and business applications.',
      image:
        '/images/engineering/labs/cse/cse-lab-01.jpg',
    },
    {
      name: 'Digital Library',
      description:
        'Extensive collection of books, journals, and e-resources.',
      image:
        '/images/engineering/library/library-02.jpg',
    },
    {
      name: 'Seminar Halls',
      description:
        'Spacious auditoriums and seminar halls for guest lectures, conferences, and learner presentations.',
      image:
        '/images/engineering/senthuraja-hall/senthuraja-hall-02.jpg',
    },
    {
      name: 'Placement Cell',
      description:
        'Dedicated placement cell with training facilities, mock interview rooms, and corporate interface lounge.',
    },
    {
      name: 'Sports & Recreation',
      description:
        'Indoor and outdoor sports facilities, gymnasium, and recreation areas for holistic development.',
    },
    {
      name: 'Cafeteria & Food Court',
      description:
        'Multi-cuisine cafeteria and food court serving nutritious meals and snacks in a hygienic environment.',
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Our Distinguished Senior Learners',
  faculty: [
    {
      name: 'Dr.G.MOHANRAJ',
      designation: 'Associate Senior Learner',
      qualification: 'MBA., Ph.D',
      specialization: 'HR & Marketing',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs.C.VIMALA',
      designation: 'Assistant Senior Learner',
      qualification: 'MBA., M.Phil',
      specialization: 'Finance and Systems',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr.V.P.ARUN',
      designation: 'Assistant Senior Learner',
      qualification: 'MBA',
      specialization: 'HR & Marketing',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs.G.SARANYA',
      designation: 'Assistant Senior Learner',
      qualification: 'MBA',
      specialization: 'HR and Finance',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs.V.RAJESWARI',
      designation: 'Assistant Senior Learner',
      qualification: 'MBA',
      specialization: 'HR and Finance',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs.B.RAMYA',
      designation: 'Assistant Senior Learner',
      qualification: 'MBA',
      specialization: 'HR & Marketing',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
  ],

  // ==========================================
  // FAQ
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'Is JKKN an MBA college in Namakkal district?',
      answer: 'Yes. JKKN College of Engineering and Technology is in Komarapalayam, Namakkal District, and offers a full-time 2-year MBA with 60 AICTE-approved seats, specializations in Marketing, Finance, HR and Operations, and an annual tuition fee of Rs 65,000 (2026-27). Its Tamil Nadu MBA counselling code is 2647. The campus is 65 km from Namakkal town and 18 km from Erode on NH-544.',
    },
    {
      question: 'What is the Tamil Nadu MBA counselling code of JKKN?',
      answer: 'The college code is 2647 in the Tamil Nadu MBA / MCA Admissions run by the Directorate of Technical Education (listed as J.K.K. Nataraja College of Engineering and Technology, Komarapalayam). Use code 2647 when you choose JKKN MBA in the state counselling.',
    },
    {
      question: 'Is JKKN a good MBA college for students from Erode?',
      answer: 'For students from Erode, JKKN College of Engineering and Technology in Komarapalayam, Namakkal District, is 18 km from Erode on NH-544 and offers a full-time 2-year MBA with 60 AICTE-approved seats, four specializations (Marketing, Finance, HR, Operations) and an annual tuition fee of Rs 65,000. The college is in Namakkal District, not Erode District. Colleges inside Erode District also offer MBA, so compare fees, specializations and travel time before you choose.',
    },
    {
      question: 'Is there a good MBA college near Salem?',
      answer: 'For students from Salem, JKKN College of Engineering and Technology in Komarapalayam, Namakkal District, is 57 km from Salem on NH-544 (Salem to Coimbatore National Highway) and offers a full-time 2-year MBA with 60 AICTE-approved seats, four specializations and an annual tuition fee of Rs 65,000. Its Tamil Nadu MBA counselling code is 2647, and separate hostels are available for boys and girls. Salem District also has its own MBA colleges, so compare fees, specializations and daily travel before you choose.',
    },
    {
      question: 'How far is the JKKN MBA campus from Erode?',
      answer: 'The campus is at Natarajapuram, NH-544 (Salem to Coimbatore National Highway), Komarapalayam, Namakkal District, Tamil Nadu 638183 - about 18 km from Erode by road on NH-544.',
    },
    {
      question: 'How do I get MBA admission at JKKN?',
      answer: 'Take TANCET (conducted by Anna University) or another accepted entrance test such as CAT, MAT, XAT, CMAT or ATMA. Government Quota MBA seats in Tamil Nadu are allotted through the Tamil Nadu MBA / MCA Admissions counselling based on TANCET scores (JKKN college code 2647); Management Quota admission is direct at the college. A bachelor\'s degree in any discipline with at least 50% marks (45% for SC / ST) is required.',
    },
    {
      question: 'What is the duration of the MBA program?',
      answer:
        'The MBA program is a 2-year full-time course divided into 4 semesters. Each academic year consists of two semesters with learning assessments at the end of each semester.',
    },
    {
      question: 'What specializations are offered in the MBA program?',
      answer:
        'We offer four specializations: Marketing Management, Financial Management, Human Resource Management, and Operations Management. Learners choose their specialization in the second year after completing core courses in the first year.',
    },
    {
      question: 'What are the eligibility criteria for MBA admission?',
      answer:
        'Candidates must have a bachelor\'s degree in any discipline from a recognized university with minimum 50% marks (45% for SC/ST). Valid scores in TANCET, CAT, MAT, XAT, CMAT, or ATMA are required. Work experience is preferred but not mandatory.',
    },
    {
      question: 'How much is the MBA program fee?',
      answer:
        'For 2026-27 the annual tuition fee for MBA is ₹65,000 (JKKN course fee sheet). Examination fees and caution deposit are charged as notified by the university; hostel is optional and quoted by the admissions office. Government scholarships apply for eligible learners.',
    },
    {
      question: 'What is the placement record for MBA graduates?',
      answer:
        'Our MBA learners are supported by a dedicated placement cell that coordinates on-campus recruitment drives and interview preparation. Placement data for the college is published in its NIRF filing on the NIRF page of this website.',
    },
    {
      question: 'Can I pursue MBA without work experience?',
      answer:
        'Yes, work experience is not mandatory for admission. However, candidates with relevant work experience may have an advantage during the selection process and can bring practical perspectives to learning studio discussions. We welcome both fresh graduates and experienced professionals.',
    },
    {
      question: 'What is the admission process?',
      answer:
        'The admission process includes online application submission with entrance learning assessment scores, followed by group discussion and personal interview for shortlisted candidates. Final selection is based on entrance learning assessment scores, GD-PI performance, and academic records. Document verification is done before final admission.',
    },
    {
      question: 'Are there internship opportunities during the MBA program?',
      answer:
        'Yes, a summer internship project is mandatory after the first year. Learners work with companies for 8-10 weeks on live projects. Our placement cell helps learners secure internships with reputed organizations.',
    },
    {
      question: 'What kind of campus facilities are available?',
      answer:
        'MBA learners use the campus learning studios with audio-visual aids, computer learning labs, the library, seminar halls, the placement cell, sports facilities and the food court.',
    },
    {
      question: 'Is hostel accommodation available?',
      answer:
        'Yes, separate hostel facilities are available for boys and girls with modern amenities including Wi-Fi, mess, recreation rooms, and 24/7 security. Hostel fees are separate from academic fees. Priority is given to outstation learners, and accommodation is subject to availability.',
    },
  ],

  // ==========================================
  // Final CTA Section
  // ==========================================
  ctaTitle: 'Ready to Start Your MBA Journey?',
  ctaDescription:
    'Full-time MBA at Komarapalayam, 18 km from Erode. 2026-27 admissions are closed; enquiries for 2027-28 are open.',
  ctaPrimaryButtonLabel: 'Send a 2027-28 Enquiry',
  ctaPrimaryButtonLink: 'https://www.jkkn.ai/apply/jkkn-admission-2026',
  ctaSecondaryButtonLabel: 'Talk to Counselor',
  ctaSecondaryButtonLink: 'tel:+919345855001',

  // ==========================================
  // Styling (JKKN Brand Colors)
  // ==========================================
  primaryColor: '#16a34a', // JKKN Bright Green
  accentColor: '#ffde59', // JKKN Yellow
}
