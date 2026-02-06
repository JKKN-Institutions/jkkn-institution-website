import type { SHCoursePageProps } from '@/components/cms-blocks/content/sh-course-page'

/**
 * Science and Humanities Department Data
 * JKKN College of Engineering & Technology
 *
 * This data follows JKKN brand styling with cream backgrounds
 */
export const SH_SAMPLE_DATA: SHCoursePageProps = {
  // ==========================================
  // Hero Section
  // ==========================================
  heroTitle: 'Department of Science and Humanities',
  heroSubtitle: 'Building the foundation for engineering excellence through comprehensive education in Physics, Chemistry, Mathematics, and English. Established in 2008, we nurture aspiring engineers with strong fundamentals and outcome-based learning.',
  heroStats: [
    { icon: 'GraduationCap', label: 'Years Duration', value: '4' },
    { icon: 'BarChart3', label: 'Total Seats', value: '60' },
    { icon: 'Users', label: 'Faculty Members', value: '13' },
    { icon: 'CheckCircle', label: 'Semesters', value: '8' },
  ],
  heroCTAs: [
    { label: 'Apply Now for 2026-27', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8', variant: 'primary' },
    { label: 'Explore Curriculum', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: 'Affiliated to Anna University, Chennai',

  // ==========================================
  // Course Overview
  // ==========================================
  overviewTitle: 'Why Choose Science and Humanities at JKKN?',
  overviewCards: [
    {
      icon: 'GraduationCap',
      title: 'Program Duration',
      value: '4 Years (8 Semesters)',
      description: 'Full-time undergraduate program with structured curriculum spanning 8 semesters of comprehensive learning and skill development. Lateral entry available for diploma holders (3 years).',
    },
    {
      icon: 'BarChart3',
      title: 'Total Seats',
      value: '60 Seats',
      description: 'Limited intake ensuring personalized attention and quality education with excellent faculty-student ratio for effective learning.',
    },
    {
      icon: 'CheckCircle',
      title: 'Accreditation',
      value: 'AICTE & NAAC',
      description: 'Approved by AICTE and accredited by NAAC ensuring quality education standards and global recognition.',
    },
    {
      icon: 'Users',
      title: 'Expert Faculty',
      value: '13 Members',
      description: 'Energetic and consummate faculty members with Ph.D. qualifications and extensive teaching experience.',
    },
    {
      icon: 'Microscope',
      title: 'Laboratory Facilities',
      value: 'State-of-the-Art',
      description: 'Excellent infrastructural and laboratory facilities for Physics, Chemistry, and interdisciplinary research.',
    },
    {
      icon: 'Briefcase',
      title: 'Career Prospects',
      value: 'Higher Studies',
      description: 'Strong foundation for pursuing M.E/M.Tech./MS/M.B.A. with comprehensive knowledge of fundamental sciences.',
    },
  ],

  // ==========================================
  // Why Choose S&H (Department Highlights)
  // ==========================================
  whyChooseTitle: 'What Sets Our Department Apart',
  benefits: [
    {
      icon: 'Target',
      title: 'Outcome-Based Education',
      description: 'Our teaching and learning process is based on Outcome Based Education (OBE) with clearly defined learning outcomes aligned with engineering requirements.',
    },
    {
      icon: 'Laptop',
      title: 'Hands-on Learning',
      description: 'In addition to theoretical lecturing, we give more significance to practical sessions with state-of-the-art laboratory facilities.',
    },
    {
      icon: 'Globe',
      title: 'Interdisciplinary Support',
      description: 'Faculty members provide support for final year engineering projects and interdisciplinary research with laboratory facilities.',
    },
    {
      icon: 'ScrollText',
      title: 'Strong Fundamentals',
      description: 'Deeper and thorough knowledge about basic facts and fundamentals of science to excel in engineering disciplines.',
    },
    {
      icon: 'Trophy',
      title: 'Co-Curricular Activities',
      description: 'Students participate in various co-curricular activities throughout the year to develop their overall personality.',
    },
    {
      icon: 'GraduationCap',
      title: 'Research Opportunities',
      description: 'Faculty members pursuing research provide opportunities for students to engage in cutting-edge scientific investigations.',
    },
  ],

  // ==========================================
  // Curriculum (Foundational Subjects)
  // ==========================================
  curriculumTitle: 'Comprehensive Foundational Curriculum',
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
            { code: 'HS3151', name: 'Professional English I', credits: 3 },
            { code: 'GE3152', name: 'Engineering Graphics', credits: 4 },
            { code: 'BS3171', name: 'Physics & Chemistry Lab', credits: 2 },
            { code: 'HS3171', name: 'English Lab', credits: 1 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA3251', name: 'Engineering Mathematics II', credits: 4 },
            { code: 'PH3256', name: 'Physics for Information Science', credits: 3 },
            { code: 'CY3251', name: 'Engineering Chemistry II', credits: 3 },
            { code: 'HS3251', name: 'Technical English', credits: 3 },
            { code: 'GE3251', name: 'Engineering Mechanics', credits: 4 },
            { code: 'BS3271', name: 'Applied Physics Lab', credits: 2 },
            { code: 'HS3271', name: 'Communication Skills Lab', credits: 1 },
          ],
        },
      ],
    },
  ],

  // Course-wise Curriculum PDFs (Regulation 2025)
  courseTabs: [
    {
      code: 'EEE',
      name: 'EEE',
      pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/EEE/B.E.%20EEE.pdf',
    },
    {
      code: 'MECH',
      name: 'MECH',
      pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/Mech/B.E.%20Mechanical%20Engineering.pdf',
    },
    {
      code: 'ECE',
      name: 'ECE',
      pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/ECE/B.E%20ECE.pdf',
    },
    {
      code: 'IT',
      name: 'IT',
      pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/CSIE/B.Tech.%20IT%20.pdf',
    },
    {
      code: 'CSE',
      name: 'CSE',
      pdfUrl: 'https://cac.annauniv.edu/aidetails/afug_2025_fu/CSIE/BE%20CSE.pdf',
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
        '12th Standard (10+2) system of education',
        'Must have secured a pass in Physics, Chemistry and Mathematics',
        'Minimum 45% aggregate (40% for reserved)',
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
        'Lateral Entry (Diploma Holders - 3 Years)',
        'NRI/PIO Quota',
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
      { component: 'Tuition Fee (Annual)', govt: '₹40,000', mgmt: '₹75,000', nri: '₹1,40,000' },
      { component: 'Development Fee', govt: '₹10,000', mgmt: '₹10,000', nri: '₹15,000' },
      { component: 'Lab & Library Fee', govt: '₹8,000', mgmt: '₹8,000', nri: '₹10,000' },
      { component: 'Exam Fee (Approx.)', govt: '₹5,000', mgmt: '₹5,000', nri: '₹5,000' },
      { component: 'Hostel Fee (Optional)', govt: '₹60,000', mgmt: '₹60,000', nri: '₹75,000' },
    ],
    totals: {
      component: 'Total (Without Hostel)',
      govt: '₹63,000',
      mgmt: '₹98,000',
      nri: '₹1,70,000',
    },
  },
  scholarships: [
    { percentage: '100%', criteria: '12th Aggregate ≥ 95%' },
    { percentage: '75%', criteria: '12th Aggregate ≥ 90%' },
    { percentage: '50%', criteria: '12th Aggregate ≥ 85%' },
    { percentage: '25%', criteria: '12th Aggregate ≥ 80%' },
  ],

  // ==========================================
  // Career Paths
  // ==========================================
  careerTitle: 'Career Opportunities After Science & Humanities',
  careerPaths: [
    {
      icon: 'GraduationCap',
      title: 'M.E / M.Tech',
      salary: 'Higher Studies',
      description: 'Pursue advanced engineering degrees with strong foundation in mathematics, physics, and chemistry.',
      skills: ['Research', 'Analysis', 'Problem Solving'],
    },
    {
      icon: 'BarChart3',
      title: 'M.S (Master of Science)',
      salary: 'International Studies',
      description: 'Pursue master\'s programs abroad with excellent grounding in fundamental sciences.',
      skills: ['Scientific Research', 'Data Analysis'],
    },
    {
      icon: 'Briefcase',
      title: 'M.B.A',
      salary: 'Management Studies',
      description: 'Combine technical knowledge with business management for leadership roles.',
      skills: ['Leadership', 'Strategy', 'Management'],
    },
    {
      icon: 'Microscope',
      title: 'Research Scholar',
      salary: 'Academic Career',
      description: 'Pursue Ph.D. and contribute to scientific research and innovation.',
      skills: ['Research', 'Publication', 'Teaching'],
    },
  ],

  // ==========================================
  // Labs & Infrastructure
  // ==========================================
  infrastructureTitle: 'State-of-the-Art Laboratory Facilities',
  facilities: [
    {
      name: 'Physics Laboratory',
      description: 'Well-equipped physics lab with modern instruments for mechanics, optics, thermodynamics, and electronics experiments.',
      image: '/images/courses/s&h/JKKN Physics Laboratory.png',
      features: ['Modern Instruments', 'Experiment Kits', 'Measurement Tools'],
    },
    {
      name: 'Chemistry Laboratory',
      description: 'Advanced chemistry lab with analytical instruments, fume hoods, and comprehensive chemical analysis equipment.',
      image: '/images/courses/s&h/JKKN Chemistry Laboratory.png',
      features: ['Analytical Instruments', 'Safety Equipment', 'Chemical Storage'],
    },
    {
      name: 'Mathematics Lab',
      description: 'Computer-aided mathematics lab with software for numerical methods, statistics, and mathematical modeling.',
      image: '/images/courses/s&h/JKKN Mathematics Lab.png',
      features: ['MATLAB', 'Mathematica', 'Statistical Software'],
    },
    {
      name: 'English Language Lab',
      description: 'Modern language lab with audio-visual aids, communication tools, and interactive learning systems.',
      image: '/images/courses/s&h/JKKN English.png',
      features: ['Audio-Visual Equipment', 'Interactive Tools', 'Practice Software'],
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Experienced Faculty Members',
  faculty: [
    // Department of Physics
    {
      name: 'Dr. K.M. Rajendiran',
      designation: 'Associate Professor - Physics',
      qualification: 'M.Sc., M.Phil., Ph.D.',
      specialization: 'Physics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Dr. N. Latha',
      designation: 'Associate Professor - Physics',
      qualification: 'M.Sc., M.Phil., Ph.D.',
      specialization: 'Physics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. M. Baby',
      designation: 'Assistant Professor - Physics',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Physics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. R. Deepika',
      designation: 'Assistant Professor - Physics',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Physics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },

    // Department of Mathematics
    {
      name: 'Mrs. M. Muthulakshmi',
      designation: 'Assistant Professor - Mathematics',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Mathematics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. N. Sathya',
      designation: 'Assistant Professor - Mathematics',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Mathematics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. M. Bharathipriya',
      designation: 'Assistant Professor - Mathematics',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Mathematics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. R. Kasthuri',
      designation: 'Assistant Professor - Mathematics',
      qualification: 'M.Sc., B.Ed., M.Phil.',
      specialization: 'Mathematics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. M. Saraswathi',
      designation: 'Assistant Professor - Mathematics',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Mathematics',
      image: '/images/faculty/placeholder-avatar.jpg',
    },

    // Department of Chemistry
    {
      name: 'Mrs. S. Narmatha S',
      designation: 'Assistant Professor - Chemistry',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Chemistry',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. D. Panjami',
      designation: 'Assistant Professor - Chemistry',
      qualification: 'M.Sc., M.Phil.',
      specialization: 'Chemistry',
      image: '/images/faculty/placeholder-avatar.jpg',
    },

    // Department of English
    {
      name: 'Dr. A.D. Sasikala',
      designation: 'Assistant Professor - English',
      qualification: 'M.A., M.Phil., Ph.D.',
      specialization: 'English',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. R. Rajaratnam',
      designation: 'Assistant Professor - English',
      qualification: 'M.A., M.Phil.',
      specialization: 'English',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
  ],

  // ==========================================
  // FAQ
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the role of Science and Humanities department?',
      answer: 'The Science and Humanities department was established in 2008 to promote and develop teaching, research in Physics, Chemistry, Mathematics and English. We provide the fundamental knowledge base that is essential for all engineering disciplines, ensuring students have strong foundations in basic sciences and communication skills.',
    },
    {
      question: 'What is the duration of the program?',
      answer: 'The program duration is 4 years (8 semesters) for regular entry students. For lateral entry students (diploma holders), the duration is 3 years. The program follows Anna University\'s semester system with continuous assessment and end-semester examinations.',
    },
    {
      question: 'What are the eligibility criteria?',
      answer: 'Candidates must have completed 12th Standard (10+2) system of education with Physics, Chemistry, and Mathematics as core subjects. A minimum aggregate of 45% marks is required for general category candidates (40% for reserved categories). Valid TNEA rank is required for government quota admissions.',
    },
    {
      question: 'What laboratory facilities are available?',
      answer: 'We provide excellent infrastructural and laboratory facilities including state-of-the-art Physics laboratory, Chemistry laboratory with modern instruments, Computer-aided Mathematics lab, and English language lab with audio-visual aids. All labs are well-equipped to provide hands-on practical experience.',
    },
    {
      question: 'What is the teaching methodology?',
      answer: 'Our teaching and learning process is based on Outcome Based Education (OBE). In addition to theoretical lecturing, we give more significance to practical sessions. Faculty members are energetic and consummate professionals who provide personalized attention to each student.',
    },
    {
      question: 'What career opportunities are available?',
      answer: 'Students with strong foundation in Science and Humanities can pursue higher studies including M.E/M.Tech in engineering disciplines, M.S (Master of Science) in various specializations, M.B.A for management careers, or research programs (Ph.D.) in academic institutions. The fundamental knowledge gained opens doors to diverse career paths.',
    },
    {
      question: 'Do faculty support student research projects?',
      answer: 'Yes, our faculty members give additional support for final year engineering students for their projects. We have interdisciplinary staff members who are pursuing research and provide laboratory facilities for student projects and research activities.',
    },
    {
      question: 'What is the student-faculty ratio?',
      answer: 'With 13 energetic and well-qualified faculty members and an intake of 60 students, we maintain an excellent faculty-student ratio ensuring personalized attention and quality education. This allows for better interaction and mentoring of students.',
    },
  ],

  // ==========================================
  // CTA Section
  // ==========================================
  ctaTitle: 'Build Your Engineering Foundation with Science & Humanities',
  ctaDescription: 'Join JKKN College of Engineering & Technology and gain comprehensive knowledge in fundamental sciences. Applications for 2026-27 batch are now open!',
  ctaButtons: [
    { label: 'Apply Now', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8', variant: 'primary' },
    { label: 'Talk to Counselor', link: 'tel:+919345855001', variant: 'secondary' },
  ],
  ctaContact: [
    { icon: 'Phone', label: 'Call Us', value: '+91 9345855001', link: 'tel:+91 9345855001' },
    { icon: 'Mail', label: 'Email Us', value: 'engg@jkkn.ac.in', link: 'mailto:engg@jkkn.ac.in' },
    { icon: 'MapPin', label: 'Visit Us', value: 'Kumarapalayam, Namakkal - 638183', link: '#' },
  ],
}
