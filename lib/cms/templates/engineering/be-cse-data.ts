import type { BECSECoursePageProps } from '@/components/cms-blocks/content/be-cse-course-page'

/**
 * Comprehensive B.E. Computer Science & Engineering Course Data
 * JKKN College of Engineering & Technology
 *
 * This data follows JKKN brand styling with cream backgrounds
 */
export const BE_CSE_SAMPLE_DATA: BECSECoursePageProps = {
  // ==========================================
  // Hero Section
  // ==========================================
  heroTitle: 'B.E. Computer Science & Engineering',
  heroSubtitle: 'Transform your passion for technology into a rewarding career. Our AICTE-approved, NBA-accredited program combines cutting-edge curriculum with industry-ready skills to shape tomorrow\'s tech leaders.',
  heroStats: [
    { icon: '', label: 'Years Duration', value: '4' },
    { icon: '', label: 'Seats Available', value: '120' },
    { icon: '', label: 'Placement Rate', value: '95%+' },
    { icon: '', label: 'Highest Package', value: '₹12L' },
  ],
  heroCTAs: [
    { label: 'Apply Now for 2025-26', link: '/apply', variant: 'primary' },
    { label: 'Explore Curriculum', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: 'Affiliated to Anna University, Chennai',

  // ==========================================
  // Course Overview
  // ==========================================
  overviewTitle: 'Why Choose B.E. CSE at JKKN?',
  overviewCards: [
    {
      icon: '🎓',
      title: 'Program Duration',
      value: '4 Years (8 Semesters)',
      description: 'Full-time undergraduate program with structured curriculum spanning 8 semesters of comprehensive learning and skill development.',
    },
    {
      icon: '📊',
      title: 'Total Credits',
      value: '160 Credits',
      description: 'Balanced distribution across core subjects, electives, labs, projects, and internships following Anna University curriculum.',
    },
    {
      icon: '✅',
      title: 'Accreditation',
      value: 'AICTE & NBA',
      description: 'Approved by AICTE and accredited by NBA ensuring quality education standards and global recognition.',
    },
    {
      icon: '🏢',
      title: 'Industry Connect',
      value: '50+ Partners',
      description: 'Collaborations with leading tech companies for internships, guest lectures, workshops, and placement opportunities.',
    },
    {
      icon: '🔬',
      title: 'Research Focus',
      value: 'AI, ML & IoT',
      description: 'Active research centers in Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, and IoT.',
    },
    {
      icon: '💼',
      title: 'Career Support',
      value: 'Dedicated Cell',
      description: 'Comprehensive training, certification programs, mock interviews, and dedicated placement assistance throughout the program.',
    },
  ],

  // ==========================================
  // Why Choose CSE (Program Highlights)
  // ==========================================
  whyChooseTitle: 'What Sets Our Program Apart',
  benefits: [
    {
      icon: '🎯',
      title: 'Outcome-Based Education',
      description: 'Program designed with clearly defined Learning Outcomes aligned with industry requirements and global engineering standards.',
    },
    {
      icon: '💻',
      title: 'Hands-on Learning',
      description: 'Extensive practical sessions, real-world projects, hackathons, and coding challenges ensure strong programming fundamentals.',
    },
    {
      icon: '🌐',
      title: 'Industry-Ready Curriculum',
      description: 'Latest technologies including Cloud Computing, DevOps, Blockchain, AI/ML, and Full Stack Development integrated into curriculum.',
    },
    {
      icon: '📜',
      title: 'Certification Programs',
      description: 'Free industry certifications from Microsoft, AWS, Oracle, and Google integrated with the curriculum.',
    },
    {
      icon: '🏆',
      title: 'Experiential Learning',
      description: 'Mandatory internships, industry visits, tech fests, and participation in national-level competitions enhance practical exposure.',
    },
    {
      icon: '🎓',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified faculty with Ph.D. degrees and extensive industry experience in emerging technologies.',
    },
  ],

  // ==========================================
  // Curriculum (4 Years, 8 Semesters)
  // ==========================================
  curriculumTitle: 'Comprehensive 4-Year Curriculum',
  curriculumYears: [
    {
      year: 1,
      semesters: [
        {
          semester: 1,
          credits: 20,
          subjects: [
            { code: 'MA3151', name: 'Engineering Mathematics I', credits: 4 },
            { code: 'PH3151', name: 'Engineering Physics', credits: 3 },
            { code: 'CY3151', name: 'Engineering Chemistry', credits: 3 },
            { code: 'GE3151', name: 'Problem Solving & Python Programming', credits: 3 },
            { code: 'GE3152', name: 'Engineering Graphics', credits: 4 },
            { code: 'BS3171', name: 'Physics & Chemistry Lab', credits: 2 },
            { code: 'GE3171', name: 'Python Programming Lab', credits: 2 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA3251', name: 'Engineering Mathematics II', credits: 4 },
            { code: 'PH3256', name: 'Physics for Information Science', credits: 3 },
            { code: 'BE3251', name: 'Basic Electrical & Electronics Engineering', credits: 3 },
            { code: 'CS3251', name: 'Programming in C', credits: 3 },
            { code: 'HS3251', name: 'Technical English', credits: 3 },
            { code: 'CS3271', name: 'C Programming Lab', credits: 2 },
            { code: 'BE3271', name: 'Electrical Lab', credits: 2 },
          ],
        },
      ],
    },
    {
      year: 2,
      semesters: [
        {
          semester: 3,
          credits: 21,
          subjects: [
            { code: 'MA3354', name: 'Discrete Mathematics', credits: 4 },
            { code: 'CS3351', name: 'Data Structures', credits: 3 },
            { code: 'CS3352', name: 'Digital Principles & Computer Organization', credits: 4 },
            { code: 'CS3492', name: 'Database Management Systems', credits: 3 },
            { code: 'CS3391', name: 'Object Oriented Programming', credits: 3 },
            { code: 'CS3381', name: 'Data Structures Lab', credits: 2 },
            { code: 'CS3481', name: 'DBMS Lab', credits: 2 },
          ],
        },
        {
          semester: 4,
          credits: 21,
          subjects: [
            { code: 'MA3451', name: 'Probability & Statistics', credits: 4 },
            { code: 'CS3451', name: 'Operating Systems', credits: 3 },
            { code: 'CS3452', name: 'Theory of Computation', credits: 3 },
            { code: 'CS3401', name: 'Design & Analysis of Algorithms', credits: 3 },
            { code: 'CS3591', name: 'Software Engineering', credits: 3 },
            { code: 'CS3461', name: 'OS Lab', credits: 2 },
            { code: 'CS3491', name: 'OOP Lab', credits: 2 },
          ],
        },
      ],
    },
    {
      year: 3,
      semesters: [
        {
          semester: 5,
          credits: 22,
          subjects: [
            { code: 'CS3551', name: 'Computer Networks', credits: 3 },
            { code: 'CS3501', name: 'Compiler Design', credits: 4 },
            { code: 'CS3491', name: 'Artificial Intelligence', credits: 3 },
            { code: 'CS3552', name: 'Web Technology', credits: 3 },
            { code: 'PE-I', name: 'Professional Elective I', credits: 3 },
            { code: 'CS3591', name: 'Networks Lab', credits: 2 },
            { code: 'CS3581', name: 'Application Development Lab', credits: 2 },
          ],
        },
        {
          semester: 6,
          credits: 22,
          subjects: [
            { code: 'CS3651', name: 'Distributed Systems', credits: 3 },
            { code: 'CS3691', name: 'Machine Learning', credits: 3 },
            { code: 'CS3791', name: 'Cloud Computing', credits: 3 },
            { code: 'CS3652', name: 'Cryptography & Network Security', credits: 3 },
            { code: 'PE-II', name: 'Professional Elective II', credits: 3 },
            { code: 'CS3681', name: 'Mini Project', credits: 4 },
          ],
        },
      ],
    },
    {
      year: 4,
      semesters: [
        {
          semester: 7,
          credits: 18,
          subjects: [
            { code: 'CS3801', name: 'Deep Learning', credits: 3 },
            { code: 'CS3751', name: 'Internet of Things', credits: 3 },
            { code: 'PE-III', name: 'Professional Elective III', credits: 3 },
            { code: 'PE-IV', name: 'Professional Elective IV', credits: 3 },
            { code: 'OE-I', name: 'Open Elective I', credits: 3 },
            { code: 'CS3791', name: 'Internship / Industrial Training', credits: 3 },
          ],
        },
        {
          semester: 8,
          credits: 16,
          subjects: [
            { code: 'PE-V', name: 'Professional Elective V', credits: 3 },
            { code: 'PE-VI', name: 'Professional Elective VI', credits: 3 },
            { code: 'OE-II', name: 'Open Elective II', credits: 3 },
            { code: 'CS3891', name: 'Project Work / Dissertation', credits: 10 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionTitle: 'Begin Your Engineering Journey',
  admissionSteps: [
    {
      step: 1,
      title: 'Eligibility Criteria',
      description: 'Meet the minimum requirements to apply',
      icon: 'UserCheck',
      details: [
        '12th Standard (10+2) with PCM',
        'Minimum 45% aggregate (40% for reserved)',
        'Age: Below 21 years as of admission date',
        'Valid TNEA rank or equivalent',
      ],
    },
    {
      step: 2,
      title: 'Admission Modes',
      description: 'Multiple pathways to secure admission',
      icon: 'FileText',
      details: [
        'TNEA Counselling (Government Quota)',
        'Management Quota (Direct Admission)',
        'NRI/PIO Quota',
        'Lateral Entry (Diploma Holders)',
      ],
    },
    {
      step: 3,
      title: 'Required Documents',
      description: 'Keep these documents ready',
      icon: 'Award',
      details: [
        '10th & 12th Mark Sheets & Certificates',
        'Transfer Certificate & Conduct Certificate',
        'Community & Income Certificate',
        'Passport Size Photographs (8 nos)',
        'Aadhaar Card & Address Proof',
      ],
    },
  ],

  // ==========================================
  // Fee Structure
  // ==========================================
  feeTitle: 'Fee Structure 2025-26',
  feeDescription: 'Affordable quality education with multiple scholarship opportunities and flexible payment options.',
  feeTable: {
    headers: ['Fee Component', 'Government Quota', 'Management Quota', 'NRI Quota'],
    rows: [
      { component: 'Tuition Fee (Annual)', govt: '₹45,000', mgmt: '₹85,000', nri: '₹1,50,000' },
      { component: 'Development Fee', govt: '₹10,000', mgmt: '₹10,000', nri: '₹15,000' },
      { component: 'Lab & Library Fee', govt: '₹8,000', mgmt: '₹8,000', nri: '₹10,000' },
      { component: 'Exam Fee (Approx.)', govt: '₹5,000', mgmt: '₹5,000', nri: '₹5,000' },
      { component: 'Hostel Fee (Optional)', govt: '₹60,000', mgmt: '₹60,000', nri: '₹75,000' },
    ],
    totals: {
      component: 'Total (Without Hostel)',
      govt: '₹68,000',
      mgmt: '₹1,08,000',
      nri: '₹1,80,000',
    },
  },
  scholarships: [
    { percentage: '100%', criteria: '12th Aggregate ≥ 95%' },
    { percentage: '75%', criteria: '12th Aggregate ≥ 90%' },
    { percentage: '50%', criteria: '12th Aggregate ≥ 85%' },
    { percentage: '25%', criteria: '12th Aggregate ≥ 80%' },
  ],

  // ==========================================
  // Placements
  // ==========================================
  placementsTitle: 'Exceptional Placement Record',
  placementsStats: [
    { label: 'Placement Rate', value: '95%+' },
    { label: 'Highest Package', value: '₹12 LPA' },
    { label: 'Average Package', value: '₹4.5 LPA' },
    { label: 'Recruiting Companies', value: '100+' },
  ],
  recruiters: [
    'TCS', 'Infosys', 'Wipro', 'Cognizant', 'HCL', 'Tech Mahindra',
    'Accenture', 'Capgemini', 'IBM', 'Amazon', 'Zoho', 'Freshworks',
  ],

  // ==========================================
  // Career Paths
  // ==========================================
  careerTitle: 'Career Opportunities After B.E. CSE',
  careerPaths: [
    {
      icon: '💻',
      title: 'Software Engineer',
      salary: '₹4-15 LPA',
      description: 'Design, develop, and maintain software applications and systems for various industries.',
      skills: ['Java', 'Python', 'DSA', 'System Design'],
    },
    {
      icon: '📊',
      title: 'Data Scientist',
      salary: '₹6-20 LPA',
      description: 'Analyze complex data sets to derive actionable insights and drive business decisions.',
      skills: ['Python', 'ML', 'Statistics', 'SQL'],
    },
    {
      icon: '🤖',
      title: 'AI/ML Engineer',
      salary: '₹8-25 LPA',
      description: 'Build intelligent systems and models that can learn, predict, and automate tasks.',
      skills: ['TensorFlow', 'PyTorch', 'NLP', 'Deep Learning'],
    },
    {
      icon: '🌐',
      title: 'Full Stack Developer',
      salary: '₹5-18 LPA',
      description: 'Develop complete web applications handling both frontend and backend components.',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    },
    {
      icon: '☁️',
      title: 'Cloud Architect',
      salary: '₹10-30 LPA',
      description: 'Design and implement scalable cloud infrastructure and solutions.',
      skills: ['AWS', 'Azure', 'GCP', 'DevOps'],
    },
    {
      icon: '🔐',
      title: 'Cybersecurity Analyst',
      salary: '₹6-20 LPA',
      description: 'Protect organizations from cyber threats and ensure data security.',
      skills: ['Security', 'Networking', 'Ethical Hacking', 'SIEM'],
    },
  ],

  // ==========================================
  // Labs & Infrastructure
  // ==========================================
  infrastructureTitle: 'State-of-the-Art Learning Studios & Labs',
  facilities: [
    {
      name: 'Programming Lab',
      description: 'Equipped with 100+ high-performance workstations running the latest IDEs and development tools.',
      image: 'https://source.unsplash.com/800x600/?programming,computer,lab',
      features: ['Visual Studio', 'Eclipse', 'PyCharm', 'VS Code'],
    },
    {
      name: 'Networks & Security Lab',
      description: 'Cisco-certified lab with routers, switches, and security appliances for hands-on networking experience.',
      image: 'https://source.unsplash.com/800x600/?network,server,datacenter',
      features: ['Cisco Devices', 'Wireshark', 'Firewalls'],
    },
    {
      name: 'AI & Machine Learning Lab',
      description: 'GPU-powered systems with TensorFlow, PyTorch, and specialized AI development environment.',
      image: 'https://source.unsplash.com/800x600/?artificial,intelligence,technology',
      features: ['NVIDIA GPUs', 'TensorFlow', 'Jupyter'],
    },
    {
      name: 'Cloud Computing Lab',
      description: 'Access to AWS, Azure, and Google Cloud platforms for cloud-native development and deployment.',
      image: 'https://source.unsplash.com/800x600/?cloud,computing,technology',
      features: ['AWS Academy', 'Azure Lab', 'Docker'],
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Expert Learning Facilitators',
  faculty: [
    {
      name: 'Dr. Rajesh Kumar',
      designation: 'Professor & Head',
      qualification: 'Ph.D. in Computer Science, IIT Madras',
      specialization: 'Artificial Intelligence, Machine Learning',
      image: 'https://source.unsplash.com/400x400/?professor,male,indian',
    },
    {
      name: 'Dr. Priya Sharma',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Data Science, Anna University',
      specialization: 'Big Data Analytics, Cloud Computing',
      image: 'https://source.unsplash.com/400x400/?professor,female,indian',
    },
    {
      name: 'Mr. Karthik Sundaram',
      designation: 'Assistant Professor',
      qualification: 'M.Tech, 8 Years Industry Experience',
      specialization: 'Full Stack Development, DevOps',
      image: 'https://source.unsplash.com/400x400/?developer,male,indian',
    },
    {
      name: 'Dr. Meena Kumari',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Network Security, VIT',
      specialization: 'Cybersecurity, Blockchain Technology',
      image: 'https://source.unsplash.com/400x400/?teacher,female,indian',
    },
  ],

  // ==========================================
  // FAQ
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the eligibility criteria for B.E. CSE at JKKN?',
      answer: 'Candidates must have completed 12th Standard (10+2) or equivalent examination with Physics, Chemistry, and Mathematics as core subjects. A minimum aggregate of 45% marks is required for general category candidates, while reserved category candidates need a minimum of 40%. Additionally, candidates must have a valid TNEA counselling rank for government quota seats or can apply directly for management quota admission. The age limit is generally below 21 years as of the date of admission.',
    },
    {
      question: 'What is the duration of B.E. Computer Science and Engineering?',
      answer: 'B.E. Computer Science and Engineering is a 4-year (8 semesters) full-time undergraduate program. Each academic year consists of two semesters with continuous internal assessment and end-semester examinations conducted by Anna University. The program includes classroom lectures, laboratory sessions, seminars, industrial training, and a final year project.',
    },
    {
      question: 'Is B.E. CSE at JKKN AICTE approved and NBA accredited?',
      answer: 'Yes, the B.E. Computer Science and Engineering program at JKKN College of Engineering & Technology is approved by AICTE (All India Council for Technical Education) and accredited by NBA (National Board of Accreditation). This ensures that our program meets the highest quality standards in technical education and is recognized nationally and internationally for higher studies and employment opportunities.',
    },
    {
      question: 'What are the career opportunities after B.E. CSE?',
      answer: 'Graduates of B.E. CSE have diverse career opportunities across multiple industries. Popular roles include Software Engineer, Data Scientist, AI/ML Engineer, Full Stack Developer, Cloud Architect, Cybersecurity Analyst, DevOps Engineer, System Architect, Database Administrator, and Technical Consultant. Our top recruiters include TCS, Infosys, Wipro, Cognizant, HCL, Amazon, Google, Microsoft, Zoho, and many more. Students can also pursue higher studies like M.Tech, MBA, or MS abroad.',
    },
    {
      question: 'What is the placement record for B.E. CSE at JKKN?',
      answer: 'JKKN College of Engineering & Technology maintains an exceptional placement record with over 95% placement rate for B.E. CSE graduates. The highest package offered is ₹12 LPA with an average package of ₹4.5 LPA. Over 100+ companies visit our campus annually for recruitment. Our dedicated Training & Placement Cell provides comprehensive support including aptitude training, soft skills development, mock interviews, and industry certifications.',
    },
    {
      question: 'What are the fee structure and scholarship options?',
      answer: 'The annual tuition fee for B.E. CSE under government quota is approximately ₹45,000 and under management quota is ₹85,000. Merit scholarships ranging from 25% to 100% fee waiver are available based on 12th standard marks. Government scholarships for SC/ST/OBC/BC categories, first-generation graduate scholarships, and sports quotas are also applicable. We also offer flexible payment options and education loan assistance through partner banks.',
    },
    {
      question: 'Does JKKN provide hostel facilities for B.E. CSE students?',
      answer: 'Yes, JKKN provides separate hostel facilities for boys and girls within the campus. The hostels offer comfortable accommodation with facilities including furnished rooms, 24/7 Wi-Fi, mess with nutritious food, recreation areas, gymnasium, and round-the-clock security. The annual hostel fee is approximately ₹60,000 which includes accommodation and meals. Transportation facilities are also available for day scholars from nearby towns.',
    },
    {
      question: 'What certifications can I get during B.E. CSE at JKKN?',
      answer: 'JKKN has partnered with leading technology companies to offer industry-recognized certifications integrated with our curriculum. Students can earn certifications in AWS Cloud Practitioner, Microsoft Azure Fundamentals, Google IT Support, Oracle Database, Python Programming, Java SE, Cisco CCNA, and more. These certifications are provided at subsidized or no additional cost and significantly enhance employability.',
    },
  ],

  // ==========================================
  // CTA Section
  // ==========================================
  ctaTitle: 'Ready to Shape Your Future in Technology?',
  ctaDescription: 'Join thousands of successful alumni who launched their tech careers from JKKN. Applications for 2025-26 batch are now open!',
  ctaButtons: [
    { label: 'Apply Now', link: '/apply', variant: 'primary' },
    { label: 'Talk to Counselor', link: '/contact', variant: 'secondary' },
  ],
  ctaContact: [
    { icon: 'Phone', label: 'Call Us', value: '+91 4288 235636', link: 'tel:+914288235636' },
    { icon: 'Mail', label: 'Email Us', value: 'admissions@jkkn.ac.in', link: 'mailto:admissions@jkkn.ac.in' },
    { icon: 'MapPin', label: 'Visit Us', value: 'Kumarapalayam, Namakkal - 638183', link: '#' },
  ],
}
