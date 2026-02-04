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
  heroSubtitle: 'Transform your passion for technology into a rewarding career. Our AICTE-approved, NAAC-accredited program combines cutting-edge curriculum with industry-ready skills to shape tomorrow\'s tech leaders.',
  heroStats: [
    { icon: '', label: 'Years Duration', value: '4' },
    { icon: '', label: 'Seats Available', value: '60' },
    { icon: '', label: 'Placement Rate', value: '95%' },
    { icon: '', label: 'Highest Package', value: '₹12L' },
  ],
  heroCTAs: [
    { label: 'Apply Now for 2026-27', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8', variant: 'primary' },
    { label: 'Explore Curriculum', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: '',

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
      value: 'AICTE & NAAC',
      description: 'Approved by AICTE and accredited by NAAC ensuring quality education standards and global recognition.',
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
            { code: 'MA25C01', name: 'Applied Calculus', credits: 3 },
            { code: 'EN25C01', name: 'English Essentials – I', credits: 2 },
            { code: 'UC25H01', name: 'தமிழர் பண்பாடு / Heritage of Tamils', credits: 1 },
            { code: 'HP25L01', name: 'Applied Physics – I', credits: 3 },
            { code: 'CY25C01', name: 'Applied Chemistry – I', credits: 3 },
            { code: 'CS25C01', name: 'Computer Programming: C', credits: 3 },
            { code: 'CS25C03', name: 'Essentials of Computing', credits: 3 },
            { code: 'ME25C04', name: 'Makerspace', credits: 2 },
            { code: 'UC25A01', name: 'Life Skills for Engineers – I*', credits: 0 },
            { code: 'UC25A02', name: 'Physical Education – I*', credits: 0 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA25C02', name: 'Linear Algebra', credits: 3 },
            { code: 'EE25C01', name: 'Basic Electrical and Electronics Engineering', credits: 3 },
            { code: 'CS25C06', name: 'Digital Principles and Computer Organization', credits: 3 },
            { code: 'UC25H02', name: 'தமிழரும் தொழில்நுட்பம் / Tamils and Technology', credits: 1 },
            { code: 'PH25C03', name: 'Applied Physics (CSIE) – II', credits: 3 },
            { code: 'CS25C07', name: 'Object Oriented Programming', credits: 3 },
            { code: 'EN25C02', name: 'English Essentials – II', credits: 2 },
            { code: 'ME25C05', name: 'Re-Engineering for Innovation', credits: 2 },
            { code: 'UC25A03', name: 'Life Skills for Engineers – II*', credits: 0 },
            { code: 'UC25A04', name: 'Physical Education – II*', credits: 0 },
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
            { code: '', name: 'Discrete Mathematics', credits: 3 },
            { code: '', name: 'Operating Systems', credits: 3 },
            { code: '', name: 'Object Oriented Software Engineering', credits: 3 },
            { code: '', name: 'Data Structures', credits: 3 },
            { code: '', name: 'Java Programming', credits: 3 },
            { code: '', name: 'English Communication Skills Laboratory – II', credits: 2 },
            { code: '', name: 'Skill Development Course – I', credits: 1 },
          ],
        },
        {
          semester: 4,
          credits: 21,
          subjects: [
            { code: '', name: 'Probability and Statistics', credits: 4 },
            { code: '', name: 'Algorithms', credits: 3 },
            { code: '', name: 'Theory of Computation', credits: 3 },
            { code: '', name: 'Standards in Computer Science', credits: 3 },
            { code: '', name: 'Python for Data Science', credits: 3 },
            { code: '', name: 'Database Management Systems', credits: 3 },
            { code: '', name: 'Skill Development Course – II', credits: 1 },
            { code: '', name: 'English Communication Skills Laboratory – III', credits: 1 },
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
            { code: '', name: 'Computer Networks', credits: 3 },
            { code: '', name: 'Compiler Design', credits: 3 },
            { code: '', name: 'Programme Elective – I', credits: 3 },
            { code: '', name: 'Cryptography and Cyber Security', credits: 3 },
            { code: '', name: 'Artificial Intelligence and Machine Learning', credits: 3 },
            { code: '', name: 'Full stack Development', credits: 3 },
            { code: '', name: 'Skill Development Course – III', credits: 2 },
            { code: '', name: 'Industry Oriented Course - I', credits: 2 },
          ],
        },
        {
          semester: 6,
          credits: 22,
          subjects: [
            { code: '', name: 'Large Language Models', credits: 3 },
            { code: '', name: 'Programme Elective – II', credits: 3 },
            { code: '', name: 'Programme Elective – III', credits: 3 },
            { code: '', name: 'Open Elective', credits: 3 },
            { code: '', name: 'Industry Oriented Course - II', credits: 2 },
            { code: '', name: 'Deep Learning', credits: 3 },
            { code: '', name: 'Mobile App Development Laboratory', credits: 2 },
            { code: '', name: 'Self-Learning Course', credits: 3 },
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
            { code: '', name: 'Climate Change and Sustainability', credits: 2 },
            { code: '', name: 'Programme Elective – IV', credits: 3 },
            { code: '', name: 'Programme Elective – V', credits: 3 },
            { code: '', name: 'Engineering Entrepreneurship Development', credits: 2 },
            { code: '', name: 'Ethical Hacking and Penetration Testing', credits: 3 },
            { code: '', name: 'Summer Internship', credits: 5 },
          ],
        },
        {
          semester: 8,
          credits: 16,
          subjects: [
            { code: '', name: 'Project Work / Internship cum Project Work', credits: 16 },
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
  feeTitle: 'Fee Structure 2026-27',
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
    { label: 'Placement Rate', value: '95%' },
    { label: 'Highest Package', value: '₹12 LPA' },
    { label: 'Average Package', value: '₹4.5 LPA' },
    { label: 'Recruiting Companies', value: '6' },
  ],
  recruiters: [
    'LGB', 'Foxconn', 'TVS Group', 'Sourcesys', 'Infinix', 'Pronoia Insurance',
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
      image: '/images/courses/be-cse/labs/programming-lab.png',
      features: ['Visual Studio', 'Eclipse', 'PyCharm', 'VS Code'],
    },
    {
      name: 'Networks & Security Lab',
      description: 'Cisco-certified lab with routers, switches, and security appliances for hands-on networking experience.',
      image: '/images/courses/be-cse/labs/networks-security-lab.png',
      features: ['Cisco Devices', 'Wireshark', 'Firewalls'],
    },
    {
      name: 'AI & Machine Learning Lab',
      description: 'GPU-powered systems with TensorFlow, PyTorch, and specialized AI development environment.',
      image: '/images/courses/be-cse/labs/ai-ml-lab.png',
      features: ['NVIDIA GPUs', 'TensorFlow', 'Jupyter'],
    },
    {
      name: 'Cloud Computing Lab',
      description: 'Access to AWS, Azure, and Google Cloud platforms for cloud-native development and deployment.',
      image: '/images/courses/be-cse/labs/cloud-computing-lab.png',
      features: ['AWS Academy', 'Azure Lab', 'Docker'],
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Expert Learning Facilitators',
  faculty: [
    {
      name: 'Mr. G.M. Sathyaseelan',
      designation: 'Assistant Professor',
      qualification: 'M.Tech., (Ph.D)',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. V. Deepika',
      designation: 'Assistant Professor',
      qualification: 'M.Tech-IT',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. K.T. Mikelraj',
      designation: 'Assistant Professor',
      qualification: 'M.Tech-IT',
      specialization: 'Information Technology',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. N. Sunmathi',
      designation: 'Assistant Professor',
      qualification: 'M.E-CSE',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. B. Sharmila',
      designation: 'Assistant Professor',
      qualification: 'M.E-CSE',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. G. Porkodi',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. S. Suji',
      designation: 'Assistant Professor',
      qualification: 'M.E-CSE',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. L. Lavanya',
      designation: 'Assistant Professor',
      qualification: 'M.E-CSE',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. M. Gokilavani',
      designation: 'Assistant Professor',
      qualification: 'M.E-CSE',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. R. Dharsinapriya',
      designation: 'Assistant Professor',
      qualification: 'M.E-CSE',
      specialization: 'Computer Science & Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
  ],

  // ==========================================
  // MOUs (Memorandum of Understanding)
  // ==========================================
  mous: {
    title: 'MOUs',
    description: 'Our industry partnerships through Memorandums of Understanding (MOUs) provide students with valuable internship opportunities, industry exposure, and placement support.',
    data: [
      {
        sno: 1,
        company: 'SBM Software',
        address: 'SBM Software Solutions Bus Stand Opp., Sellappa Lodge Near, Velur-638 182, Namakkal(Dt) Tamilnadu, India.',
        validUpto: '2025',
      },
      {
        sno: 2,
        company: 'New Technologies',
        address: '25, SRK Complex, bus stand, near Indusind bank, opposite Singanallur, TNHB Housing Unit, Singanallur, Tamil Nadu 641005',
        validUpto: '2025',
      },
      {
        sno: 3,
        company: 'Smart Reach',
        address: '450/526 First Floor , Trichy Main Road, Gate, near Sakthi Kaali Amman Temple, Dadagapatty, Salem, Tamil Nadu 636010',
        validUpto: '2025',
      },
      {
        sno: 4,
        company: 'Effyies smart Technology',
        address: '10-62/7 (214-8B), South Street, Authivilai Eraniel Village,Kalkulam Taluk, Neyyoor, Tamil Nadu 629802',
        validUpto: '2025',
      },
      {
        sno: 5,
        company: 'ETS Acdacdy',
        address: ',Amman Complex,2nd Floor, Mettur Rd, Erode, Tamil Nadu 638011',
        validUpto: '2026',
      },
      {
        sno: 6,
        company: 'Connect Infy system',
        address: 'No 4/290, 1st Main Rd, MMDA Colony, Maduravoyal, Chennai, Tamil Nadu 600095',
        validUpto: '2025',
      },
    ],
  },

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
      question: 'Is B.E. CSE at JKKN AICTE approved and NAAC accredited?',
      answer: 'Yes, the B.E. Computer Science and Engineering program at JKKN College of Engineering & Technology is approved by AICTE (All India Council for Technical Education) and accredited by NAAC (National Board of Accreditation). This ensures that our program meets the highest quality standards in technical education and is recognized nationally and internationally for higher studies and employment opportunities.',
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
  ctaDescription: 'Join thousands of successful alumni who launched their tech careers from JKKN. Applications for 2026-27 batch are now open!',
  ctaButtons: [
    { label: 'Apply Now', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8', variant: 'primary' },
    { label: 'Talk to Counselor', link: '/contact', variant: 'secondary' },
  ],
  ctaContact: [
    { icon: 'Phone', label: 'Call Us', value: '+91 9345855001', link: 'tel:+91-9345855001' },
    { icon: 'Mail', label: 'Email Us', value: ' engg@jkkn.ac.in', link: 'mailto: engg@jkkn.ac.in' },
    { icon: 'MapPin', label: 'Visit Us', value: 'Kumarapalayam, Namakkal - 638183', link: '#' },
  ],
}
