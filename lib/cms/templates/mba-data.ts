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
    { icon: '', label: 'Placement Rate', value: '95%' },
    { icon: '', label: 'Top Recruiters', value: '60+' },
  ],
  heroCTAs: [
    { label: 'Apply Now for 2025-26', link: '/apply', variant: 'primary' },
    { label: 'View Curriculum', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: 'AICTE Approved',
  admissionBadge: 'Admissions Open 2025-26',

  // ==========================================
  // Program Overview
  // ==========================================
  overviewTitle: 'Program Overview',
  overviewSubtitle: 'Why Choose MBA at JKKN?',
  overviewDescription: [
    'Our MBA program is designed to create future business leaders who can navigate the complexities of modern business environments. With a perfect blend of theoretical knowledge and practical application, we prepare our students for senior management roles across industries.',
    'The curriculum emphasizes case-based learning, live projects, and industry interactions. Students gain exposure to real-world business challenges through internships with leading corporations, consulting projects, and entrepreneurship initiatives.',
    'Our faculty comprises experienced academicians and industry practitioners who bring diverse perspectives to the classroom. The program also features regular guest lectures from CEOs, entrepreneurs, and business leaders, providing invaluable insights into current business practices and trends.',
  ],
  overviewImage:
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop',

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
        'Strong corporate partnerships with regular guest lectures, workshops, and live projects from leading companies.',
    },
    {
      icon: 'GraduationCap',
      title: 'Expert Faculty',
      description:
        'Learn from experienced professors and industry practitioners with deep expertise in their domains.',
    },
    {
      icon: 'Briefcase',
      title: 'Placement Support',
      description:
        'Dedicated placement cell with 95%+ placement record and tie-ups with top recruiters across sectors.',
    },
    {
      icon: 'Target',
      title: 'Case-Based Learning',
      description:
        'Harvard case methodology with real business scenarios to develop analytical and problem-solving skills.',
    },
    {
      icon: 'Lightbulb',
      title: 'Entrepreneurship Cell',
      description:
        'Incubation support, mentorship, and funding assistance for students aspiring to start their own ventures.',
    },
    {
      icon: 'BookOpen',
      title: 'Research Opportunities',
      description:
        'Engage in cutting-edge research with faculty guidance and present papers at national and international conferences.',
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
        'Learn talent acquisition, performance management, organizational behavior, employee relations, and HR analytics to build high-performing teams.',
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
  curriculumTitle: 'MBA Curriculum Structure',
  curriculumYears: [
    {
      year: 1,
      semesters: [
        {
          semester: 1,
          credits: 24,
          subjects: [
            { code: 'MBA101', name: 'Management Principles & Practices', credits: 3 },
            { code: 'MBA102', name: 'Managerial Economics', credits: 3 },
            { code: 'MBA103', name: 'Accounting for Managers', credits: 3 },
            { code: 'MBA104', name: 'Quantitative Methods', credits: 3 },
            { code: 'MBA105', name: 'Organizational Behavior', credits: 3 },
            { code: 'MBA106', name: 'Business Communication', credits: 3 },
            { code: 'MBA107', name: 'Information Technology for Managers', credits: 3 },
            { code: 'MBA108', name: 'Business Environment', credits: 3 },
          ],
        },
        {
          semester: 2,
          credits: 24,
          subjects: [
            { code: 'MBA201', name: 'Marketing Management', credits: 3 },
            { code: 'MBA202', name: 'Financial Management', credits: 3 },
            { code: 'MBA203', name: 'Human Resource Management', credits: 3 },
            { code: 'MBA204', name: 'Operations Management', credits: 3 },
            { code: 'MBA205', name: 'Research Methodology', credits: 3 },
            { code: 'MBA206', name: 'Business Ethics & Corporate Governance', credits: 3 },
            { code: 'MBA207', name: 'Entrepreneurship Development', credits: 3 },
            { code: 'MBA208', name: 'Summer Internship Project', credits: 3 },
          ],
        },
      ],
    },
    {
      year: 2,
      semesters: [
        {
          semester: 3,
          credits: 24,
          subjects: [
            { code: 'MBA301', name: 'Strategic Management', credits: 3 },
            { code: 'MBA302', name: 'Business Analytics', credits: 3 },
            { code: 'MBA303', name: 'Specialization Elective I', credits: 3 },
            { code: 'MBA304', name: 'Specialization Elective II', credits: 3 },
            { code: 'MBA305', name: 'Specialization Elective III', credits: 3 },
            { code: 'MBA306', name: 'General Elective I', credits: 3 },
            { code: 'MBA307', name: 'General Elective II', credits: 3 },
            { code: 'MBA308', name: 'Case Study Analysis', credits: 3 },
          ],
        },
        {
          semester: 4,
          credits: 18,
          subjects: [
            { code: 'MBA401', name: 'International Business', credits: 3 },
            { code: 'MBA402', name: 'Project Management', credits: 3 },
            { code: 'MBA403', name: 'Specialization Elective IV', credits: 3 },
            { code: 'MBA404', name: 'Specialization Elective V', credits: 3 },
            { code: 'MBA405', name: 'Comprehensive Viva Voce', credits: 2 },
            { code: 'MBA406', name: 'Dissertation/Project Work', credits: 4 },
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
        'Valid scores in entrance exams: TANCET, CAT, MAT, XAT, CMAT, or ATMA',
    },
    {
      criteria:
        'Work experience is not mandatory but preferred (especially for Executive MBA track)',
    },
    {
      criteria:
        'Candidates appearing for final year exams can apply provisionally',
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
    'Entrance Exam Scorecard (TANCET/CAT/MAT/XAT/CMAT/ATMA)',
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
        'Fill out the online application form with personal and academic details. Upload required documents and entrance exam scores.',
      icon: 'FileText',
    },
    {
      step: 2,
      title: 'Entrance Exam',
      description:
        'Submit valid TANCET/CAT/MAT/XAT/CMAT/ATMA scores. Candidates will be shortlisted based on entrance exam performance.',
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
    { component: 'Tuition Fee', amount: '₹1,20,000' },
    { component: 'Examination Fee', amount: '₹5,000' },
    { component: 'Library Fee', amount: '₹3,000' },
    { component: 'Computer Lab Fee', amount: '₹4,000' },
    { component: 'Sports & Extracurricular', amount: '₹2,000' },
    { component: 'Insurance', amount: '₹1,000' },
    { component: 'Alumni Association Fee', amount: '₹500' },
    { component: 'Development Fund', amount: '₹4,500' },
    { component: 'Total Annual Fee', amount: '₹1,40,000', isTotal: true },
  ],
  feeDisclaimer:
    '*Fee structure is subject to change. Installment payment options available. Scholarships available for meritorious students.',

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
      avgSalary: '6-10 LPA',
    },
    {
      icon: 'BarChart3',
      title: 'Marketing Manager',
      description:
        'Lead marketing campaigns, brand strategies, and digital marketing initiatives for products and services.',
      avgSalary: '5-9 LPA',
    },
    {
      icon: 'DollarSign',
      title: 'Financial Analyst',
      description:
        'Analyze financial data, prepare reports, and provide insights for investment and business decisions.',
      avgSalary: '6-11 LPA',
    },
    {
      icon: 'Users',
      title: 'HR Manager',
      description:
        'Manage talent acquisition, employee development, performance management, and organizational culture.',
      avgSalary: '5-9 LPA',
    },
    {
      icon: 'Target',
      title: 'Operations Manager',
      description:
        'Optimize business processes, manage supply chains, and ensure operational efficiency and quality.',
      avgSalary: '6-10 LPA',
    },
    {
      icon: 'TrendingUp',
      title: 'Management Consultant',
      description:
        'Advise organizations on strategy, operations, and transformation to solve complex business challenges.',
      avgSalary: '8-15 LPA',
    },
    {
      icon: 'Briefcase',
      title: 'Product Manager',
      description:
        'Define product vision, strategy, and roadmap while collaborating with cross-functional teams.',
      avgSalary: '7-12 LPA',
    },
    {
      icon: 'Building2',
      title: 'Investment Banking Analyst',
      description:
        'Support M&A deals, IPOs, and corporate finance transactions with financial modeling and analysis.',
      avgSalary: '8-15 LPA',
    },
    {
      icon: 'Lightbulb',
      title: 'Entrepreneur/Startup Founder',
      description:
        'Launch and scale your own venture with comprehensive business knowledge and entrepreneurial skills.',
      avgSalary: 'Variable',
    },
    {
      icon: 'Award',
      title: 'Business Analyst',
      description:
        'Bridge business needs and technology solutions through data analysis and process improvement.',
      avgSalary: '5-9 LPA',
    },
    {
      icon: 'BarChart3',
      title: 'Sales Manager',
      description:
        'Lead sales teams, develop strategies, manage client relationships, and drive revenue growth.',
      avgSalary: '6-11 LPA',
    },
    {
      icon: 'Target',
      title: 'Strategy Manager',
      description:
        'Develop corporate strategies, analyze market trends, and guide long-term business planning.',
      avgSalary: '8-14 LPA',
    },
  ],

  // ==========================================
  // Placement Statistics
  // ==========================================
  placementTitle: 'Placement Statistics 2024',
  placementStats: [
    { label: 'Placement Rate', value: '95%', icon: 'Award' },
    { label: 'Average Package', value: '₹6.5 LPA', icon: 'TrendingUp' },
    { label: 'Highest Package', value: '₹18 LPA', icon: 'BarChart3' },
    { label: 'Top Recruiters', value: '60+', icon: 'Building2' },
  ],

  // ==========================================
  // Top Recruiters
  // ==========================================
  recruitersTitle: 'Our Top Recruiters',
  recruiters: [
    'Infosys',
    'TCS',
    'Wipro',
    'Cognizant',
    'Accenture',
    'Deloitte',
    'EY',
    'KPMG',
    'PwC',
    'ICICI Bank',
    'HDFC Bank',
    'Axis Bank',
    'Kotak Mahindra',
    'Amazon',
    'Flipkart',
    'Myntra',
    'Swiggy',
    'Zomato',
    'Ola',
    'Uber',
    'Reliance Industries',
    'Aditya Birla Group',
    'Mahindra & Mahindra',
    'Tata Consultancy Services',
    'L&T Infotech',
    'HCL Technologies',
    'Tech Mahindra',
    'Mindtree',
    'Mphasis',
    'Capgemini',
    'IBM',
    'Oracle',
    'Microsoft',
    'Google',
    'Cisco',
    'SAP Labs',
    'Adobe',
    'Intel',
    'Qualcomm',
    'Broadcom',
    'Asian Paints',
    'ITC Limited',
    'Hindustan Unilever',
    'Nestle',
    'Procter & Gamble',
    'Colgate-Palmolive',
    'Godrej Consumer',
    'Marico',
    'Dabur',
    'Emami',
    'Bajaj Auto',
    'Hero MotoCorp',
    'TVS Motors',
    'Maruti Suzuki',
    'Hyundai',
    'Ford',
    'Bharti Airtel',
    'Vodafone Idea',
    'Jio',
    'BSNL',
    'Tata Communications',
  ],

  // ==========================================
  // Facilities
  // ==========================================
  facilitiesTitle: 'World-Class Facilities',
  facilities: [
    {
      name: 'Smart Classrooms',
      description:
        'Technology-enabled classrooms with projectors, audio systems, and video conferencing for interactive learning experiences.',
      image:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
    },
    {
      name: 'Computer Labs',
      description:
        'State-of-the-art computer labs with latest software for analytics, simulations, and business applications.',
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
    },
    {
      name: 'Digital Library',
      description:
        'Extensive collection of books, journals, e-resources, and databases including Harvard Business Review and EBSCO.',
      image:
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop',
    },
    {
      name: 'Seminar Halls',
      description:
        'Spacious auditoriums and seminar halls for guest lectures, conferences, and student presentations.',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    },
    {
      name: 'Placement Cell',
      description:
        'Dedicated placement cell with training facilities, mock interview rooms, and corporate interface lounge.',
    },
    {
      name: 'Entrepreneurship Cell',
      description:
        'Incubation center with mentorship programs, funding assistance, and co-working spaces for student startups.',
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
  facultyTitle: 'Our Distinguished Faculty',
  faculty: [
    {
      name: 'Dr. Rajesh Kumar',
      designation: 'Professor & HOD',
      qualification: 'Ph.D., MBA',
      specialization: 'Strategic Management & Marketing',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
    },
    {
      name: 'Dr. Priya Sharma',
      designation: 'Associate Professor',
      qualification: 'Ph.D., M.Com, MBA',
      specialization: 'Financial Management & Accounting',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
    },
    {
      name: 'Dr. Arun Patel',
      designation: 'Associate Professor',
      qualification: 'Ph.D., MBA',
      specialization: 'Human Resource Management',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    },
    {
      name: 'Dr. Meera Reddy',
      designation: 'Assistant Professor',
      qualification: 'Ph.D., MBA',
      specialization: 'Operations & Supply Chain Management',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    },
    {
      name: 'Prof. Sanjay Verma',
      designation: 'Assistant Professor',
      qualification: 'MBA, FCA',
      specialization: 'Corporate Finance & Taxation',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop',
    },
    {
      name: 'Dr. Anjali Desai',
      designation: 'Assistant Professor',
      qualification: 'Ph.D., MBA',
      specialization: 'Digital Marketing & Analytics',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop',
    },
    {
      name: 'Prof. Vikram Singh',
      designation: 'Visiting Faculty',
      qualification: 'MBA, CFA',
      specialization: 'Investment Banking & Portfolio Management',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    },
    {
      name: 'Dr. Kavita Joshi',
      designation: 'Assistant Professor',
      qualification: 'Ph.D., MBA',
      specialization: 'Organizational Behavior & Leadership',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop',
    },
    {
      name: 'Prof. Rahul Mehta',
      designation: 'Assistant Professor',
      qualification: 'MBA, PGDM',
      specialization: 'Entrepreneurship & Innovation',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    },
    {
      name: 'Dr. Sneha Gupta',
      designation: 'Assistant Professor',
      qualification: 'Ph.D., MBA',
      specialization: 'Business Analytics & Research',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    },
  ],

  // ==========================================
  // FAQ
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the duration of the MBA program?',
      answer:
        'The MBA program is a 2-year full-time course divided into 4 semesters. Each academic year consists of two semesters with examinations at the end of each semester.',
    },
    {
      question: 'What specializations are offered in the MBA program?',
      answer:
        'We offer four specializations: Marketing Management, Financial Management, Human Resource Management, and Operations Management. Students choose their specialization in the second year after completing core courses in the first year.',
    },
    {
      question: 'What are the eligibility criteria for MBA admission?',
      answer:
        'Candidates must have a bachelor\'s degree in any discipline from a recognized university with minimum 50% marks (45% for SC/ST). Valid scores in TANCET, CAT, MAT, XAT, CMAT, or ATMA are required. Work experience is preferred but not mandatory.',
    },
    {
      question: 'How much is the MBA program fee?',
      answer:
        'The total annual fee is ₹1,40,000, which includes tuition, examination, library, computer lab, and other charges. Installment payment options are available. Scholarships and fee concessions are provided for meritorious students and reserved categories.',
    },
    {
      question: 'What is the placement record for MBA graduates?',
      answer:
        'Our MBA program consistently achieves 95%+ placement rate. The average package is ₹6.5 LPA with the highest package reaching ₹18 LPA. We have tie-ups with 60+ top recruiters across various sectors including IT, BFSI, FMCG, consulting, and manufacturing.',
    },
    {
      question: 'Can I pursue MBA without work experience?',
      answer:
        'Yes, work experience is not mandatory for admission. However, candidates with relevant work experience may have an advantage during the selection process and can bring practical perspectives to classroom discussions. We welcome both fresh graduates and experienced professionals.',
    },
    {
      question: 'What is the admission process?',
      answer:
        'The admission process includes online application submission with entrance exam scores, followed by group discussion and personal interview for shortlisted candidates. Final selection is based on entrance exam scores, GD-PI performance, and academic records. Document verification is done before final admission.',
    },
    {
      question: 'Are there internship opportunities during the MBA program?',
      answer:
        'Yes, a summer internship project is mandatory after the first year. Students work with companies for 8-10 weeks on live projects. Our placement cell helps students secure internships with reputed organizations. Many students receive pre-placement offers based on their internship performance.',
    },
    {
      question: 'What kind of campus facilities are available?',
      answer:
        'We offer world-class facilities including smart classrooms with audio-visual aids, computer labs with business software, digital library with e-resources, seminar halls, dedicated placement cell, entrepreneurship incubation center, sports facilities, and hygienic cafeteria.',
    },
    {
      question: 'Is hostel accommodation available?',
      answer:
        'Yes, separate hostel facilities are available for boys and girls with modern amenities including Wi-Fi, mess, recreation rooms, and 24/7 security. Hostel fees are separate from academic fees. Priority is given to outstation students, and accommodation is subject to availability.',
    },
  ],

  // ==========================================
  // Final CTA Section
  // ==========================================
  ctaTitle: 'Ready to Start Your MBA Journey?',
  ctaDescription:
    'Transform your career with our comprehensive MBA program. Apply now for 2025-26 admissions and join a community of future business leaders.',
  ctaPrimaryButtonLabel: 'Apply Now',
  ctaPrimaryButtonLink: '/apply',
  ctaSecondaryButtonLabel: 'Contact Admissions',
  ctaSecondaryButtonLink: '/contact',
  contactPhone: '+91 98765 43210',
  contactEmail: 'admissions@jkkn.edu.in',
  contactAddress: 'JKKN Campus, Komarapalayam, Namakkal District, Tamil Nadu - 638183',

  // ==========================================
  // Styling
  // ==========================================
  primaryColor: '#003D5B',
  accentColor: '#FF6B35',
}
