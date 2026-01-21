import type { BEITCoursePageProps } from '@/components/cms-blocks/content/be-it-course-page'

/**
 * Comprehensive B.Tech Information Technology Course Data
 * JKKN College of Engineering & Technology
 *
 * This data matches the layout with cream color backgrounds and IT-specific content
 */
export const BE_IT_SAMPLE_DATA: BEITCoursePageProps = {
  // ==========================================
  // Hero Section
  // ==========================================
  heroTitle: 'B.Tech Information Technology',
  heroSubtitle: 'Shape the future of technology with cutting-edge IT education. Our AICTE-approved, NBA-accredited program prepares you to excel in software development, cloud computing, artificial intelligence, cybersecurity, and emerging technologies driving the digital transformation.',
  heroStats: [
    { icon: '', label: 'Years Duration', value: '4' },
    { icon: '', label: 'Seats Available', value: '60' },
    { icon: '', label: 'Placement Rate', value: '95%+' },
    { icon: '', label: 'Highest Package', value: '₹18L' },
  ],
  heroCTAs: [
    { label: 'Apply Now for 2025-26', link: '/apply', variant: 'primary' },
    { label: 'Explore Curriculum', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: 'Affiliated to Anna University, Chennai',

  // ==========================================
  // Course Overview
  // ==========================================
  overviewTitle: 'Course Overview',
  overviewCards: [
    {
      icon: '💻',
      title: 'About the Program',
      value: 'Information Technology',
      description: 'Our B.Tech IT program blends computer science fundamentals with software engineering, database management, web technologies, cloud computing, AI/ML, and cybersecurity for comprehensive IT education.',
    },
    {
      icon: '⏱️',
      title: 'Duration & Credits',
      value: '4 Years | 8 Semesters',
      description: 'The program spans 4 years with 8 semesters totaling 160+ credits. Comprehensive curriculum with theory, practical labs, internships, and capstone projects.',
    },
    {
      icon: '✅',
      title: 'Accreditation',
      value: 'AICTE & NBA',
      description: 'Our program is approved by AICTE (All India Council for Technical Education) and accredited by NBA, ensuring world-class quality education standards.',
    },
    {
      icon: '📚',
      title: 'Eligibility',
      value: '10+2 with PCM',
      description: 'Candidates must have passed 10+2 with Physics, Chemistry & Mathematics with minimum 50% aggregate (45% for reserved categories).',
    },
  ],

  // ==========================================
  // Why Choose IT
  // ==========================================
  whyChooseTitle: 'Why Choose Information Technology?',
  benefits: [
    {
      icon: '✅',
      title: 'Industry-Aligned Curriculum',
      description: 'Updated syllabus matching current IT industry standards covering full-stack development, cloud computing (AWS/Azure), AI/ML, DevOps, blockchain, and modern software engineering practices.',
    },
    {
      icon: '✅',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified professors with Ph.D. degrees and extensive industry experience in software development, data science, cloud architecture, and cybersecurity.',
    },
    {
      icon: '✅',
      title: 'State-of-the-Art Labs',
      description: 'Access advanced computing labs with 400+ high-performance workstations, cloud computing infrastructure, AI/ML research center, cybersecurity lab, and modern development tools.',
    },
    {
      icon: '✅',
      title: 'Outstanding Placements',
      description: 'Strong placement record with recruitment from Google, Microsoft, Amazon, TCS, Infosys, Wipro, Cognizant, Accenture, and other leading IT companies with packages up to ₹18 LPA.',
    },
    {
      icon: '✅',
      title: 'Global Certifications',
      description: 'Opportunities to earn industry certifications in AWS, Azure, Google Cloud, Oracle, Cisco CCNA, Microsoft, and programming languages valued globally by employers.',
    },
    {
      icon: '✅',
      title: 'Hands-On Experience',
      description: 'Mandatory 6-month industry internships, live projects with IT companies, hackathons, coding competitions, and startup incubation support for entrepreneurial students.',
    },
  ],

  // ==========================================
  // Curriculum (4 Years)
  // ==========================================
  curriculumTitle: 'B.Tech IT Course Curriculum',
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
            { code: 'IT3101', name: 'Programming in C', credits: 4 },
            { code: 'GE3151', name: 'Problem Solving and Python Programming', credits: 3 },
            { code: 'GE3152', name: 'Heritage of Tamils', credits: 1 },
            { code: 'IT3111', name: 'Programming in C Laboratory', credits: 2 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA3251', name: 'Statistics and Numerical Methods', credits: 4 },
            { code: 'PH3256', name: 'Physics for Information Science', credits: 3 },
            { code: 'IT3201', name: 'Digital Principles and Computer Organization', credits: 4 },
            { code: 'IT3202', name: 'Data Structures', credits: 3 },
            { code: 'GE3251', name: 'Engineering Graphics', credits: 3 },
            { code: 'IT3211', name: 'Data Structures Laboratory', credits: 2 },
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
            { code: 'IT3301', name: 'Database Management Systems', credits: 3 },
            { code: 'IT3302', name: 'Object Oriented Programming', credits: 3 },
            { code: 'IT3303', name: 'Computer Networks', credits: 3 },
            { code: 'IT3304', name: 'Operating Systems', credits: 3 },
            { code: 'IT3311', name: 'Database Management Systems Laboratory', credits: 2 },
            { code: 'IT3312', name: 'Object Oriented Programming Laboratory', credits: 2 },
            { code: 'IT3313', name: 'Interpersonal Skills Laboratory', credits: 1 },
          ],
        },
        {
          semester: 4,
          credits: 20,
          subjects: [
            { code: 'MA3391', name: 'Probability and Queueing Theory', credits: 4 },
            { code: 'IT3401', name: 'Software Engineering', credits: 3 },
            { code: 'IT3402', name: 'Web Technologies', credits: 3 },
            { code: 'IT3403', name: 'Computer Architecture', credits: 3 },
            { code: 'IT3404', name: 'Theory of Computation', credits: 3 },
            { code: 'IT3411', name: 'Web Technologies Laboratory', credits: 2 },
            { code: 'IT3412', name: 'Operating Systems Laboratory', credits: 2 },
          ],
        },
      ],
    },
    {
      year: 3,
      semesters: [
        {
          semester: 5,
          credits: 19,
          subjects: [
            { code: 'IT3501', name: 'Full Stack Development', credits: 3 },
            { code: 'IT3502', name: 'Data Analytics', credits: 3 },
            { code: 'IT3503', name: 'Cloud Computing', credits: 3 },
            { code: 'IT3504', name: 'Cryptography and Network Security', credits: 3 },
            { code: 'IT3505', name: 'Professional Elective I', credits: 3 },
            { code: 'IT3511', name: 'Full Stack Development Laboratory', credits: 2 },
            { code: 'IT3512', name: 'Cloud Computing Laboratory', credits: 2 },
          ],
        },
        {
          semester: 6,
          credits: 19,
          subjects: [
            { code: 'IT3601', name: 'Artificial Intelligence and Machine Learning', credits: 3 },
            { code: 'IT3602', name: 'Mobile Application Development', credits: 3 },
            { code: 'IT3603', name: 'DevOps and Agile Methodologies', credits: 3 },
            { code: 'IT3604', name: 'Professional Elective II', credits: 3 },
            { code: 'IT3605', name: 'Open Elective I', credits: 3 },
            { code: 'IT3611', name: 'AI/ML Laboratory', credits: 2 },
            { code: 'IT3612', name: 'Mobile App Development Laboratory', credits: 2 },
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
            { code: 'IT3701', name: 'Big Data Analytics', credits: 3 },
            { code: 'IT3702', name: 'Internet of Things', credits: 3 },
            { code: 'IT3703', name: 'Blockchain Technology', credits: 3 },
            { code: 'IT3704', name: 'Professional Elective III', credits: 3 },
            { code: 'IT3705', name: 'Professional Elective IV', credits: 3 },
            { code: 'IT3711', name: 'IoT and Big Data Laboratory', credits: 2 },
            { code: 'IT3712', name: 'Mini Project', credits: 1 },
          ],
        },
        {
          semester: 8,
          credits: 14,
          subjects: [
            { code: 'IT3801', name: 'Professional Elective V', credits: 3 },
            { code: 'IT3802', name: 'Open Elective II', credits: 3 },
            { code: 'IT3811', name: 'Internship / Industrial Training', credits: 2 },
            { code: 'IT3812', name: 'Final Year Project', credits: 6 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // Specializations
  // ==========================================
  specializationsTitle: 'Specialization Tracks',
  specializations: [
    {
      icon: '🤖',
      title: 'Artificial Intelligence & Machine Learning',
      description: 'Master neural networks, deep learning, computer vision, natural language processing, TensorFlow, PyTorch, and AI model deployment for intelligent applications.',
    },
    {
      icon: '🔒',
      title: 'Cybersecurity & Ethical Hacking',
      description: 'Learn penetration testing, network security, cryptography, security operations, ethical hacking techniques, and cybersecurity frameworks like NIST and ISO 27001.',
    },
    {
      icon: '☁️',
      title: 'Cloud Computing & DevOps',
      description: 'Expertise in AWS, Azure, Google Cloud Platform, Docker, Kubernetes, CI/CD pipelines, infrastructure as code, and modern cloud-native application development.',
    },
    {
      icon: '📊',
      title: 'Data Science & Big Data',
      description: 'Study data mining, predictive analytics, Hadoop, Spark, data visualization, statistical modeling, and business intelligence for data-driven decision making.',
    },
    {
      icon: '🌐',
      title: 'Full Stack Web Development',
      description: 'Master MEAN/MERN stack, React, Angular, Node.js, MongoDB, PostgreSQL, RESTful APIs, GraphQL, and modern web application architecture patterns.',
    },
    {
      icon: '📱',
      title: 'Mobile App Development',
      description: 'Build native and cross-platform mobile applications using React Native, Flutter, Android (Kotlin/Java), iOS (Swift), and mobile app deployment strategies.',
    },
  ],

  // ==========================================
  // Career Opportunities
  // ==========================================
  careerTitle: 'Career Opportunities After B.Tech IT',
  careerPaths: [
    {
      icon: '💼',
      title: 'Software Engineer / Developer',
      description: 'Design and develop software applications, web services, and enterprise systems for IT companies and product-based organizations.',
      avgSalary: '₹6-12 LPA',
    },
    {
      icon: '💼',
      title: 'Data Scientist / Analyst',
      description: 'Analyze complex datasets, build predictive models, create data visualizations, and derive actionable insights for business intelligence.',
      avgSalary: '₹8-15 LPA',
    },
    {
      icon: '💼',
      title: 'Cloud Solutions Architect',
      description: 'Design and manage cloud infrastructure, implement scalable solutions on AWS/Azure/GCP, and optimize cloud resource utilization.',
      avgSalary: '₹10-18 LPA',
    },
    {
      icon: '💼',
      title: 'Cybersecurity Analyst',
      description: 'Protect systems from cyber threats, conduct security audits, implement security protocols, and respond to security incidents.',
      avgSalary: '₹7-14 LPA',
    },
    {
      icon: '💼',
      title: 'AI/ML Engineer',
      description: 'Build intelligent systems, develop machine learning models, implement AI algorithms, and deploy models in production environments.',
      avgSalary: '₹9-16 LPA',
    },
    {
      icon: '💼',
      title: 'Full Stack Developer',
      description: 'Develop end-to-end web applications using modern frameworks, manage databases, create APIs, and deploy scalable web solutions.',
      avgSalary: '₹6-13 LPA',
    },
    {
      icon: '💼',
      title: 'DevOps Engineer',
      description: 'Automate deployment pipelines, manage CI/CD workflows, orchestrate containers, and ensure reliable software delivery.',
      avgSalary: '₹7-14 LPA',
    },
    {
      icon: '💼',
      title: 'Mobile App Developer',
      description: 'Create native and hybrid mobile applications for Android and iOS platforms, publish apps, and maintain app performance.',
      avgSalary: '₹5-11 LPA',
    },
    {
      icon: '💼',
      title: 'Database Administrator',
      description: 'Design, implement, and maintain database systems, ensure data integrity, optimize queries, and manage database security.',
      avgSalary: '₹5-10 LPA',
    },
  ],

  // ==========================================
  // Top Recruiters
  // ==========================================
  recruitersTitle: 'Our Top Recruiters',
  recruiters: [
    'Google',
    'Microsoft',
    'Amazon',
    'IBM',
    'Oracle',
    'TCS',
    'Infosys',
    'Wipro',
    'Cognizant',
    'Accenture',
    'Tech Mahindra',
    'HCL Technologies',
    'Capgemini',
    'Deloitte',
    'Ernst & Young',
    'KPMG',
    'Zoho',
    'Freshworks',
    'PayPal',
    'Adobe',
    'VMware',
    'Dell Technologies',
    'HP Enterprise',
    'SAP Labs',
    'Salesforce',
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionTitle: 'Admission Process',
  admissionSteps: [
    {
      step: 1,
      icon: '📝',
      title: 'Online Application',
      description: 'Complete the online application form with academic documents including 10th, 12th mark sheets, transfer certificate, and community certificate if applicable.',
    },
    {
      step: 2,
      icon: '📊',
      title: 'Entrance Exam / Merit',
      description: 'Selection based on TNEA (Tamil Nadu Engineering Admissions) rank, JEE Main score, or merit-based marks in Physics, Chemistry, and Mathematics.',
    },
    {
      step: 3,
      icon: '✅',
      title: 'Document Verification & Enrollment',
      description: 'Attend counseling, complete document verification, pay admission fee, and complete enrollment formalities to confirm your seat in the program.',
    },
  ],

  // ==========================================
  // Fee Structure
  // ==========================================
  feeTitle: 'Fee Structure (Annual)',
  feeBreakdown: [
    { component: 'Tuition Fee', amount: '₹65,000' },
    { component: 'Laboratory & Computing Fee', amount: '₹12,000' },
    { component: 'Library & Digital Resources Fee', amount: '₹3,000' },
    { component: 'Examination Fee', amount: '₹3,000' },
    { component: 'Total Annual Fee', amount: '₹83,000', isTotal: true },
  ],

  // ==========================================
  // Facilities & Laboratories
  // ==========================================
  facilitiesTitle: 'Laboratories & Facilities',
  facilities: [
    {
      name: 'Advanced Computing Laboratory',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
      description: '400+ high-performance workstations with Intel i7/i9 processors, 16GB RAM, dual monitors, and latest software development tools including IDEs, compilers, and databases.',
    },
    {
      name: 'AI & Machine Learning Research Center',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      description: 'Dedicated center with GPU-enabled workstations (NVIDIA RTX), Jupyter notebooks, TensorFlow, PyTorch, scikit-learn, and cloud-based ML platforms for research projects.',
    },
    {
      name: 'Cybersecurity & Ethical Hacking Lab',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
      description: 'Specialized setup with Kali Linux, Metasploit, Wireshark, network security tools, firewalls, IDS/IPS systems, and virtual hacking environments for hands-on security training.',
    },
    {
      name: 'Cloud Computing Laboratory',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
      description: 'AWS Academy, Microsoft Azure for Students, Google Cloud credits, Docker, Kubernetes cluster, and cloud development tools for practical cloud computing experience.',
    },
    {
      name: 'Full Stack Development Lab',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
      description: 'Modern web development environment with MEAN/MERN stack tools, React, Angular, Node.js, MongoDB, PostgreSQL, Git, and deployment platforms for web projects.',
    },
    {
      name: 'Mobile App Development Lab',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      description: 'Android Studio, Xcode, React Native, Flutter, mobile testing devices, emulators, and app deployment platforms for iOS and Android development.',
    },
    {
      name: 'Data Science & Analytics Lab',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      description: 'R Studio, Python (Pandas, NumPy), Tableau, Power BI, Hadoop, Spark cluster, and big data tools for data analysis and visualization projects.',
    },
    {
      name: 'IoT & Smart Systems Lab',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
      description: 'Arduino, Raspberry Pi, ESP32 boards, sensors, actuators, IoT platforms (ThingSpeak, Blynk), and embedded systems development kits for smart device prototyping.',
    },
    {
      name: 'Innovation & Project Lab',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      description: 'Dedicated workspace for final year projects with access to all equipment, collaboration tools, version control systems, and mentorship for innovative IT solutions.',
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Our Expert Faculty',
  faculty: [
    {
      name: 'Dr. Arjun Kumar S.',
      designation: 'Professor & Head',
      qualification: 'Ph.D. in Computer Science & IT',
      specialization: 'Artificial Intelligence, Machine Learning',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    {
      name: 'Dr. Priya Sharma M.',
      designation: 'Professor',
      qualification: 'Ph.D. in Data Science',
      specialization: 'Big Data Analytics, Data Mining',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Dr. Karthik Rajan V.',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Cloud Computing',
      specialization: 'Cloud Architecture, DevOps, Microservices',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    },
    {
      name: 'Ms. Divya Lakshmi R.',
      designation: 'Associate Professor',
      qualification: 'M.Tech in Cybersecurity',
      specialization: 'Network Security, Ethical Hacking',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    },
    {
      name: 'Dr. Rajesh Kumar P.',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Software Engineering',
      specialization: 'Full Stack Development, Web Technologies',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    },
    {
      name: 'Mr. Naveen Prakash T.',
      designation: 'Assistant Professor',
      qualification: 'M.Tech in AI & ML',
      specialization: 'Deep Learning, Computer Vision',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Ms. Sangeetha Devi K.',
      designation: 'Assistant Professor',
      qualification: 'M.Tech in Mobile Computing',
      specialization: 'Android, iOS, React Native, Flutter',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    },
    {
      name: 'Mr. Vijay Kumar M.',
      designation: 'Assistant Professor',
      qualification: 'M.Tech in Database Systems',
      specialization: 'SQL, NoSQL, Database Optimization',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    },
  ],

  // ==========================================
  // FAQs
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the difference between B.Tech IT and B.Tech CSE?',
      answer: 'B.Tech IT focuses on information systems, databases, web technologies, cloud computing, and IT infrastructure management, while CSE emphasizes algorithms, programming languages, operating systems, and core computer science theory. IT is more application and business-focused, whereas CSE is more theoretical and research-oriented.',
    },
    {
      question: 'What are the career prospects after B.Tech IT?',
      answer: 'B.Tech IT graduates can work as Software Developers, Data Scientists, Cloud Architects, Cybersecurity Analysts, AI/ML Engineers, Full Stack Developers, DevOps Engineers, Mobile App Developers, and Database Administrators with starting packages ranging from ₹6-18 LPA depending on skills and company.',
    },
    {
      question: 'Is there any entrance exam required for admission?',
      answer: 'Yes, admissions are primarily based on TNEA (Tamil Nadu Engineering Admissions) rank, JEE Main score, or institution-level entrance tests. Eligibility: 10+2 with Physics, Chemistry, and Mathematics (50% minimum aggregate, 45% for reserved categories).',
    },
    {
      question: 'What certifications are offered during the B.Tech IT course?',
      answer: 'Students can earn industry certifications in AWS Certified Solutions Architect, Microsoft Azure, Google Cloud Professional, Oracle Database, Cisco CCNA, Python (PCAP), Java (OCA/OCP), Red Hat Linux, and many more through our academic partnerships.',
    },
    {
      question: 'Are internships mandatory in the B.Tech IT program?',
      answer: 'Yes, students undergo mandatory 6-month industry internships in the final year with leading IT companies. Many students also participate in summer internships between semesters to gain additional industry exposure.',
    },
    {
      question: 'What is the placement record for B.Tech IT students?',
      answer: 'Our B.Tech IT program has an outstanding 95%+ placement rate with an average package of ₹7.5 LPA and highest package of ₹18 LPA. Top recruiters include Google, Microsoft, Amazon, TCS, Infosys, Wipro, Cognizant, Accenture, and many more.',
    },
    {
      question: 'Can I pursue higher studies after B.Tech IT?',
      answer: 'Yes, graduates can pursue M.Tech/MS in specializations like Computer Science, Data Science, Artificial Intelligence, Cybersecurity, Cloud Computing, or opt for MBA. Many students also qualify for GATE, GRE and pursue higher education in top IITs, IIMs, and foreign universities.',
    },
    {
      question: 'What programming languages will I learn in B.Tech IT?',
      answer: 'You will learn C, C++, Java, Python, JavaScript, SQL, and other languages. Additionally, you will gain expertise in frameworks like React, Angular, Node.js, Django, Flask, and mobile development platforms like Android and iOS.',
    },
    {
      question: 'Are there opportunities for research and innovation?',
      answer: 'Yes, students can participate in research projects in AI/ML, cloud computing, cybersecurity, data science, and IoT under faculty guidance. We encourage students to publish papers in international conferences and journals, and provide startup incubation support.',
    },
    {
      question: 'What is the total fee structure for the B.Tech IT program?',
      answer: 'The annual tuition fee is ₹83,000 which includes tuition (₹65,000), laboratory & computing fee (₹12,000), library & digital resources fee (₹3,000), and examination fee (₹3,000). Hostel, transport, and mess charges are additional and optional.',
    },
  ],

  // ==========================================
  // Final CTA Section
  // ==========================================
  ctaTitle: 'Ready to Start Your IT Career Journey?',
  ctaDescription: 'Join JKKN College of Engineering & Technology and become a skilled IT professional equipped to excel in the digital era. Apply now for 2025-26 admissions and shape your future in technology!',
  ctaButtonLabel: 'Apply Now',
  ctaButtonLink: '/apply',

  // ==========================================
  // Styling (JKKN Brand Theme - Green)
  // ==========================================
  primaryColor: '#0b6d41', // JKKN Official Brand Green
  accentColor: '#ffde59', // JKKN Official Brand Yellow
}
