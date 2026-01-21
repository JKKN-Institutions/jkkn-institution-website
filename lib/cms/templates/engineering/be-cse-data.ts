import type { BECSECoursePageProps } from '@/components/cms-blocks/content/be-cse-course-page'

/**
 * Comprehensive B.E. Computer Science & Engineering Course Data
 * JKKN College of Engineering & Technology
 *
 * Redesigned with orange color scheme and table-based curriculum display
 */
export const BE_CSE_SAMPLE_DATA: BECSECoursePageProps = {
  // ==========================================
  // Hero Section with Breadcrumb
  // ==========================================
  heroTitle: 'B.E. Computer Science & Engineering',
  heroSubtitle: 'Transform your passion for technology into a rewarding career. Our AICTE-approved, NBA-accredited program combines cutting-edge curriculum with industry-ready skills to shape tomorrow\'s tech leaders.',
  breadcrumbItems: [
    { label: 'Home', link: '/' },
    { label: 'Courses', link: '/courses' },
    { label: 'B.E. Computer Science' },
  ],
  approvalBadge: 'Approved by AICTE | Accredited by NBA',
  heroStats: [
    { icon: 'calendar', label: 'Duration', value: '4 Years' },
    { icon: 'users', label: 'Seats', value: '120' },
    { icon: 'trending-up', label: 'Placement', value: '95%' },
    { icon: 'indian-rupee', label: 'Package', value: '₹12 LPA' },
  ],
  heroCTAs: [
    { label: 'Apply Now', link: '/apply', variant: 'primary' },
    { label: 'Download Brochure', link: '/brochure', variant: 'secondary' },
  ],
  affiliatedTo: 'Affiliated to Anna University, Chennai | Approved by AICTE',

  // ==========================================
  // Why Choose CSE
  // ==========================================
  whyChooseTitle: 'Why Choose B.E. CSE at JKKN?',
  benefits: [
    {
      icon: 'graduation-cap',
      title: 'Program Duration',
      description: '4 Years (8 Semesters) - Full-time undergraduate program with comprehensive curriculum.',
    },
    {
      icon: 'book-open',
      title: 'Total Credits',
      description: '160 Credits - Balanced distribution across core subjects, electives, labs, projects, and internships.',
    },
    {
      icon: 'award',
      title: 'Accreditation',
      description: 'AICTE & NBA - Approved by AICTE and accredited by NBA ensuring quality education standards.',
    },
    {
      icon: 'building',
      title: 'Industry Connect',
      description: '50+ Partners - Collaborations with leading tech companies for internships, guest lectures, and placement opportunities.',
    },
    {
      icon: 'code',
      title: 'Research Focus',
      description: 'AI, ML & IoT - Active research centers in Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, and IoT.',
    },
    {
      icon: 'briefcase',
      title: 'Career Support',
      description: 'Dedicated Cell - Comprehensive training, certification programs, mock interviews, and dedicated placement assistance throughout the program.',
    },
  ],

  // ==========================================
  // Program Highlights
  // ==========================================
  programHighlights: [
    {
      icon: 'award',
      title: 'Industry-Recognized Curriculum',
      description: 'Our curriculum is designed in collaboration with leading tech companies and updated regularly to match industry trends. Students learn the latest technologies including AI, Cloud Computing, and Blockchain.',
    },
    {
      icon: 'users',
      title: 'Expert Faculty with Industry Experience',
      description: 'Learn from professors who have worked at top tech companies like Google, Microsoft, and Amazon. Our faculty bring real-world insights into the classroom.',
    },
    {
      icon: 'briefcase',
      title: 'Guaranteed Internship Opportunities',
      description: 'Every student gets guaranteed internship placements in their 3rd year with our 200+ partner companies. Gain hands-on experience before graduation.',
    },
    {
      icon: 'code',
      title: 'State-of-the-Art Lab Facilities',
      description: 'Access to cutting-edge laboratories equipped with high-performance computing resources, AI/ML tools, cloud platforms, and the latest development software.',
    },
    {
      icon: 'check',
      title: '95%+ Placement Record',
      description: 'Our dedicated placement cell ensures that 95% of students secure job offers from top companies with average packages of ₹8-12 LPA.',
    },
    {
      icon: 'book-open',
      title: 'Research & Innovation Focus',
      description: 'Engage in cutting-edge research projects, publish papers in international journals, and present at conferences. We encourage innovation from day one.',
    },
  ],

  // ==========================================
  // Curriculum (Table Mode)
  // ==========================================
  curriculumTitle: 'Detailed Course Curriculum',
  curriculumYears: [
    {
      year: 1,
      semesters: [
        {
          semester: 1,
          credits: 20,
          subjects: [
            { code: 'MA3151', name: 'Matrices and Calculus', credits: 4 },
            { code: 'PH3151', name: 'Engineering Physics', credits: 3 },
            { code: 'CY3151', name: 'Engineering Chemistry', credits: 3 },
            { code: 'GE3151', name: 'Problem Solving and Python Programming', credits: 3 },
            { code: 'EG3151', name: 'Engineering Graphics', credits: 4 },
            { code: 'GE3171', name: 'Problem Solving and Python Programming Laboratory', credits: 2 },
            { code: 'BS3171', name: 'Physics and Chemistry Laboratory', credits: 1 },
          ],
        },
        {
          semester: 2,
          credits: 19,
          subjects: [
            { code: 'MA3251', name: 'Statistics and Numerical Methods', credits: 4 },
            { code: 'PH3256', name: 'Physics for Information Science', credits: 3 },
            { code: 'BE3251', name: 'Basic Electrical and Electronics Engineering', credits: 3 },
            { code: 'GE3251', name: 'Engineering Mechanics', credits: 3 },
            { code: 'CS3251', name: 'Programming in C', credits: 3 },
            { code: 'CS3271', name: 'Programming in C Laboratory', credits: 2 },
            { code: 'GE3271', name: 'Engineering Practices Laboratory', credits: 1 },
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
            { code: 'CS3351', name: 'Digital Principles and Computer Organization', credits: 4 },
            { code: 'CS3352', name: 'Foundations of Data Science', credits: 3 },
            { code: 'CS3301', name: 'Data Structures', credits: 3 },
            { code: 'CS3391', name: 'Object Oriented Programming', credits: 3 },
            { code: 'CS3311', name: 'Data Structures Laboratory', credits: 2 },
            { code: 'CS3381', name: 'Object Oriented Programming Laboratory', credits: 2 },
          ],
        },
        {
          semester: 4,
          credits: 20,
          subjects: [
            { code: 'MA3391', name: 'Probability and Statistics', credits: 4 },
            { code: 'CS3401', name: 'Algorithms', credits: 3 },
            { code: 'CS3402', name: 'Database Management Systems', credits: 3 },
            { code: 'CS3403', name: 'Computer Architecture', credits: 3 },
            { code: 'CS3452', name: 'Theory of Computation', credits: 4 },
            { code: 'CS3411', name: 'Database Management Systems Laboratory', credits: 2 },
            { code: 'GE3451', name: 'Environmental Sciences and Sustainability', credits: 1 },
          ],
        },
      ],
    },
    {
      year: 3,
      semesters: [
        {
          semester: 5,
          credits: 21,
          subjects: [
            { code: 'MA3492', name: 'Probability and Queuing Theory', credits: 4 },
            { code: 'CS3501', name: 'Compiler Design', credits: 3 },
            { code: 'CS3551', name: 'Distributed Computing', credits: 3 },
            { code: 'CS3591', name: 'Computer Networks', credits: 3 },
            { code: 'CS3502', name: 'Operating Systems', credits: 4 },
            { code: 'CS3512', name: 'Operating Systems Laboratory', credits: 2 },
            { code: 'CS3561', name: 'Data Science Laboratory', credits: 2 },
          ],
        },
        {
          semester: 6,
          credits: 19,
          subjects: [
            { code: 'CS3601', name: 'Software Engineering', credits: 3 },
            { code: 'CS3691', name: 'Artificial Intelligence and Machine Learning', credits: 4 },
            { code: 'CS3611', name: 'Software Engineering Laboratory', credits: 2 },
            { code: 'CS3681', name: 'Artificial Intelligence Laboratory', credits: 2 },
            { code: 'CS3XXX', name: 'Professional Elective I', credits: 3 },
            { code: 'CS3XXX', name: 'Professional Elective II', credits: 3 },
            { code: 'HS3152', name: 'Professional English II', credits: 2 },
          ],
        },
      ],
    },
    {
      year: 4,
      semesters: [
        {
          semester: 7,
          credits: 19,
          subjects: [
            { code: 'CS3792', name: 'Cloud Computing', credits: 3 },
            { code: 'CS3701', name: 'Cyber Security', credits: 3 },
            { code: 'CS3XXX', name: 'Professional Elective III', credits: 3 },
            { code: 'CS3XXX', name: 'Professional Elective IV', credits: 3 },
            { code: 'CS3XXX', name: 'Open Elective I', credits: 3 },
            { code: 'CS3791', name: 'Mini Project', credits: 2 },
            { code: 'HS3252', name: 'Technical English', credits: 2 },
          ],
        },
        {
          semester: 8,
          credits: 10,
          subjects: [
            { code: 'CS3811', name: 'Project Work', credits: 10 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // Specializations (2x2 Grid)
  // ==========================================
  specializationsTitle: 'Specialization Tracks',
  specializations: [
    {
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Master AI algorithms, deep learning, neural networks, and intelligent systems.',
    },
    {
      title: 'Data Science & Analytics',
      description: 'Learn big data technologies, statistical analysis, and predictive modeling.',
    },
    {
      title: 'Cyber Security',
      description: 'Specialize in ethical hacking, network security, and threat detection.',
    },
    {
      title: 'Cloud Computing & DevOps',
      description: 'Expertise in AWS, Azure, containerization, and CI/CD pipelines.',
    },
  ],

  // ==========================================
  // Career Opportunities
  // ==========================================
  careerTitle: 'Begin Your Engineering Journey',
  careerPaths: [
    {
      icon: 'briefcase',
      title: 'Software Engineer',
      description: 'Design, develop, test, and maintain software applications for various platforms and industries.',
      avgSalary: '6-12 LPA',
    },
    {
      icon: 'code',
      title: 'Data Scientist',
      description: 'Analyze complex data sets, build predictive models, and extract actionable insights for business growth.',
      avgSalary: '8-15 LPA',
    },
    {
      icon: 'briefcase',
      title: 'AI/ML Engineer',
      description: 'Develop artificial intelligence and machine learning solutions to solve real-world problems.',
      avgSalary: '10-18 LPA',
    },
    {
      icon: 'check',
      title: 'Cybersecurity Analyst',
      description: 'Protect organizations from cyber threats, perform vulnerability assessments, and ensure data security.',
      avgSalary: '7-14 LPA',
    },
    {
      icon: 'code',
      title: 'Cloud Architect',
      description: 'Design and implement scalable cloud infrastructure solutions using AWS, Azure, or Google Cloud Platform.',
      avgSalary: '9-16 LPA',
    },
    {
      icon: 'briefcase',
      title: 'Full Stack Developer',
      description: 'Build end-to-end web applications with expertise in both frontend and backend technologies.',
      avgSalary: '6-13 LPA',
    },
  ],

  // ==========================================
  // Top Recruiters (with Logo Support)
  // ==========================================
  recruitersTitle: 'Top Recruiters',
  recruiters: [
    { name: 'TCS', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=TCS' },
    { name: 'Infosys', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Infosys' },
    { name: 'Wipro', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Wipro' },
    { name: 'Cognizant', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Cognizant' },
    { name: 'Accenture', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Accenture' },
    { name: 'Amazon', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Amazon' },
    { name: 'Google', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Google' },
    { name: 'Microsoft', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Microsoft' },
    { name: 'Zoho', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=Zoho' },
    { name: 'HCL', logo: 'https://placehold.co/200x100/0b6d41/ffffff?text=HCL' },
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionTitle: 'Admission Process',
  admissionSteps: [
    {
      step: 1,
      title: 'Apply Online',
      description: 'Submit your application through our online portal with required documents and application fee.',
      icon: 'edit',
    },
    {
      step: 2,
      title: 'Document Verification',
      description: 'Our admissions team will verify your academic records and eligibility criteria.',
      icon: 'file-check',
    },
    {
      step: 3,
      title: 'Admission Confirmed',
      description: 'Receive your admission letter and complete the enrollment process with fee payment.',
      icon: 'check-circle',
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Our Experienced Faculty',
  faculty: [
    {
      name: 'Dr. Rajesh Kumar',
      designation: 'Professor & HOD',
      qualification: 'Ph.D. in Computer Science',
      specialization: 'Artificial Intelligence, Machine Learning',
      image: 'https://placehold.co/300x400/0b6d41/ffffff?text=Faculty+Member',
    },
    {
      name: 'Dr. Priya Sharma',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Data Science',
      specialization: 'Big Data Analytics, Cloud Computing',
      image: 'https://placehold.co/300x400/0b6d41/ffffff?text=Faculty+Member',
    },
    {
      name: 'Dr. Arun Patel',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Cyber Security',
      specialization: 'Network Security, Cryptography',
      image: 'https://placehold.co/300x400/0b6d41/ffffff?text=Faculty+Member',
    },
    {
      name: 'Prof. Lakshmi Narayanan',
      designation: 'Assistant Professor',
      qualification: 'M.Tech in Software Engineering',
      specialization: 'Software Development, DevOps',
      image: 'https://placehold.co/300x400/0b6d41/ffffff?text=Faculty+Member',
    },
    {
      name: 'Dr. Venkatesh Reddy',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in IoT',
      specialization: 'Internet of Things, Embedded Systems',
      image: 'https://placehold.co/300x400/0b6d41/ffffff?text=Faculty+Member',
    },
    {
      name: 'Dr. Meera Singh',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Algorithms',
      specialization: 'Data Structures, Algorithm Design',
      image: 'https://placehold.co/300x400/0b6d41/ffffff?text=Faculty+Member',
    },
  ],

  // ==========================================
  // Fee Structure
  // ==========================================
  feeTitle: 'Fee Structure',
  feeBreakdown: [
    { component: 'Tuition Fee (Per Year)', amount: '₹75,000' },
    { component: 'Development Fee (One-Time)', amount: '₹10,000' },
    { component: 'Laboratory Fee (Per Year)', amount: '₹5,000' },
    { component: 'Library Fee (Per Year)', amount: '₹2,000' },
    { component: 'Examination Fee (Per Semester)', amount: '₹1,500' },
    { component: 'Total (Approximate Per Year)', amount: '₹93,500', isTotal: true },
  ],

  // ==========================================
  // Placement Statistics
  // ==========================================
  placementStats: [
    {
      label: 'Placement Rate',
      value: '95%+',
      icon: 'trending-up',
    },
    {
      label: 'Companies Visited',
      value: '500+',
      icon: 'building',
    },
    {
      label: 'Average Package',
      value: '₹8.5 LPA',
      icon: 'indian-rupee',
    },
  ],

  // ==========================================
  // Facilities
  // ==========================================
  facilitiesTitle: 'Learning Facilities @ JKKN',
  facilities: [
    {
      name: 'AI & ML Laboratory',
      description: 'State-of-the-art lab equipped with high-performance GPUs, deep learning frameworks, and AI development tools.',
    },
    {
      name: 'Cloud Computing Lab',
      description: 'Access to AWS, Azure, and Google Cloud platforms for hands-on experience in cloud technologies.',
    },
    {
      name: 'Cyber Security Lab',
      description: 'Dedicated facility with penetration testing tools, network security equipment, and cyber range simulations.',
    },
    {
      name: 'Software Development Lab',
      description: 'Modern workstations with latest IDEs, version control systems, and collaborative development tools.',
    },
    {
      name: 'Research & Innovation Center',
      description: 'Dedicated space for final year projects, research activities, and innovation initiatives.',
    },
    {
      name: 'Digital Library',
      description: 'Vast collection of technical books, e-journals, online databases, and digital resources.',
    },
  ],

  // ==========================================
  // FAQ
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the eligibility criteria for B.E. CSE admission?',
      answer: 'Candidates must have passed 10+2 (or equivalent) with Physics, Chemistry, and Mathematics with a minimum of 50% aggregate marks (45% for reserved categories). Admission is through TNEA counseling or management quota.',
    },
    {
      question: 'What are the career prospects after completing B.E. CSE?',
      answer: 'CSE graduates have diverse career opportunities in software development, data science, AI/ML engineering, cybersecurity, cloud computing, web development, mobile app development, and IT consulting. You can also pursue higher studies like M.E., M.Tech, or MBA.',
    },
    {
      question: 'Does the college provide placement assistance?',
      answer: 'Yes, we have a dedicated Training & Placement Cell that conducts pre-placement training, aptitude tests, mock interviews, and facilitates campus recruitment drives. Our placement rate consistently exceeds 95% with top companies visiting for recruitment.',
    },
    {
      question: 'What is the total course fee for the entire program?',
      answer: 'The approximate fee is ₹93,500 per year, totaling around ₹3.74 lakhs for the 4-year program. This includes tuition, laboratory, library, and examination fees. Additional charges may apply for hostel and transportation if availed.',
    },
    {
      question: 'Are there opportunities for internships and industry exposure?',
      answer: 'Yes, we have tie-ups with leading tech companies for internships, industrial visits, and guest lectures. Students undergo mandatory internships in semester breaks to gain real-world experience and improve employability.',
    },
    {
      question: 'Can students pursue specializations within CSE?',
      answer: 'Yes, students can choose elective courses in specializations like AI & ML, Data Science, Cybersecurity, Cloud Computing, Full Stack Development, and IoT in their final years. This allows them to focus on their areas of interest.',
    },
    {
      question: 'What is the faculty-to-student ratio?',
      answer: 'We maintain a healthy faculty-to-student ratio of approximately 1:15, ensuring personalized attention and effective mentoring. Our faculty members hold Ph.D. degrees and have extensive industry and academic experience.',
    },
    {
      question: 'Are there research opportunities for undergraduate students?',
      answer: 'Yes, students can participate in research projects under faculty guidance, publish papers in conferences and journals, and present their work at national/international platforms. We encourage innovation and research from the early stages.',
    },
  ],

  // ==========================================
  // Final CTA Section
  // ==========================================
  ctaTitle: 'Ready to Begin Your Journey in Technology?',
  ctaDescription: 'Join JKKN College of Engineering and transform your career with our industry-aligned B.E. CSE program. Apply now for 2025-26 admission.',
  ctaButtonLabel: 'Apply for Admission',
  ctaButtonLink: '/apply',

  // ==========================================
  // Styling
  // ==========================================
  primaryColor: '#0b6d41',
  accentColor: '#ffde59',
}

export default BE_CSE_SAMPLE_DATA
