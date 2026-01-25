import type { BEECECoursePageProps } from '@/components/cms-blocks/content/be-ece-course-page'

/**
 * Comprehensive B.E. Electronics & Communication Engineering Course Data
 * JKKN College of Engineering & Technology
 *
 * This data matches the layout with cream color backgrounds
 */
export const BE_ECE_SAMPLE_DATA: BEECECoursePageProps = {
  // ==========================================
  // Hero Section
  // ==========================================
  heroTitle: 'B.E. Electronics & Communication Engineering',
  heroSubtitle: 'Shape the future of communication technology with expertise in embedded systems, VLSI, wireless communication, and IoT. Our AICTE-approved, NBA-accredited program prepares you to design, develop, and innovate in the rapidly evolving world of electronics and communication.',
  heroStats: [
    { icon: '', label: 'Years Duration', value: '4' },
    { icon: '', label: 'Seats Available', value: '60' },
    { icon: '', label: 'Placement Rate', value: '90%+' },
    { icon: '', label: 'Highest Package', value: '₹10L' },
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
      icon: '📡',
      title: 'About the Program',
      value: 'Communication Engineering',
      description: 'Our B.E. Electronics & Communication Engineering program covers embedded systems, VLSI design, wireless communication, signal processing, IoT, and network security technologies.',
    },
    {
      icon: '⏱️',
      title: 'Duration & Credits',
      value: '4 Years | 8 Semesters',
      description: 'The program spans 4 years with 8 semesters totaling 160 credits. Comprehensive curriculum balancing theory, laboratory work, and industrial training.',
    },
    {
      icon: '✅',
      title: 'Accreditation',
      value: 'AICTE & NBA',
      description: 'Our program is approved by AICTE (All India Council for Technical Education) and accredited by NBA, ensuring quality education standards.',
    },
    {
      icon: '📚',
      title: 'Eligibility',
      value: '10+2 with PCM',
      description: 'Candidates must have passed 10+2 with Physics, Chemistry & Mathematics with minimum 50% aggregate (45% for reserved categories).',
    },
  ],

  // ==========================================
  // Why Choose ECE
  // ==========================================
  whyChooseTitle: 'Why Choose Electronics & Communication Engineering?',
  benefits: [
    {
      icon: '✅',
      title: 'Industry-Aligned Curriculum',
      description: 'Our curriculum is designed to meet current industry standards covering embedded systems, IoT, VLSI design, 4G/5G wireless communication, and smart systems used globally.',
    },
    {
      icon: '✅',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified professors with Ph.D. degrees and extensive industry experience in embedded systems, VLSI, communication systems, and signal processing.',
    },
    {
      icon: '✅',
      title: 'State-of-the-Art Laboratories',
      description: 'Access advanced laboratories for digital electronics, microprocessors, communication systems, VLSI design, embedded systems, and IoT with modern equipment including FPGA boards and EDA tools.',
    },
    {
      icon: '✅',
      title: 'Excellent Placements',
      description: 'Strong placement record with recruitment from TCS, Infosys, Wipro, Bosch, Samsung, LG, Airtel, Jio, Nokia, and other leading electronics and IT companies.',
    },
    {
      icon: '✅',
      title: 'Research Opportunities',
      description: 'Engage in cutting-edge research in wireless communication, IoT systems, VLSI design, signal processing, embedded systems, and network security.',
    },
    {
      icon: '✅',
      title: 'Industry Collaboration',
      description: 'Gain practical experience through internships and industrial visits to electronics manufacturing units, telecom companies, R&D centers, and semiconductor fabrication facilities.',
    },
  ],

  // ==========================================
  // Curriculum (4 Years)
  // ==========================================
  curriculumTitle: 'Course Curriculum',
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
            { code: 'GE3152', name: 'Heritage of Tamils', credits: 1 },
            { code: 'GE3171', name: 'Problem Solving and Python Programming Laboratory', credits: 2 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA3251', name: 'Statistics and Numerical Methods', credits: 4 },
            { code: 'PH3256', name: 'Physics for Electronics Engineering', credits: 3 },
            { code: 'BE3251', name: 'Basic Electrical and Electronics Engineering', credits: 3 },
            { code: 'GE3251', name: 'Engineering Mechanics', credits: 3 },
            { code: 'GE3252', name: 'Tamils and Technology', credits: 1 },
            { code: 'BE3271', name: 'Basic Electrical and Electronics Engineering Laboratory', credits: 2 },
            { code: 'GE3271', name: 'Engineering Practices Laboratory', credits: 2 },
            { code: 'GE3272', name: 'Communication Laboratory', credits: 2 },
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
            { code: 'MA3354', name: 'Complex Variables and Partial Differential Equations', credits: 4 },
            { code: 'EC3301', name: 'Digital Logic Design', credits: 3 },
            { code: 'EC3302', name: 'Networks and Security', credits: 3 },
            { code: 'EC3303', name: 'Electronic Devices and Circuits', credits: 3 },
            { code: 'EC3304', name: 'Signals and Systems', credits: 4 },
            { code: 'EC3311', name: 'Electronic Devices and Circuits Laboratory', credits: 2 },
            { code: 'EC3312', name: 'Digital Logic Design Laboratory', credits: 2 },
          ],
        },
        {
          semester: 4,
          credits: 20,
          subjects: [
            { code: 'MA3391', name: 'Probability and Random Processes', credits: 4 },
            { code: 'EC3401', name: 'Electromagnetic Fields and Waves', credits: 3 },
            { code: 'EC3402', name: 'Linear Integrated Circuits and Applications', credits: 3 },
            { code: 'EC3403', name: 'Microprocessors and Microcontrollers', credits: 3 },
            { code: 'EC3404', name: 'Communication Theory', credits: 3 },
            { code: 'EC3411', name: 'Linear Integrated Circuits Laboratory', credits: 2 },
            { code: 'EC3412', name: 'Microprocessors and Microcontrollers Laboratory', credits: 2 },
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
            { code: 'EC3501', name: 'Digital Signal Processing', credits: 4 },
            { code: 'EC3502', name: 'Communication Networks', credits: 3 },
            { code: 'EC3503', name: 'VLSI Design', credits: 3 },
            { code: 'EC3504', name: 'Digital Communication', credits: 3 },
            { code: 'EC3511', name: 'Digital Signal Processing Laboratory', credits: 2 },
            { code: 'EC3512', name: 'Communication Networks Laboratory', credits: 2 },
            { code: 'GE3513', name: 'Environmental Sciences and Sustainability', credits: 2 },
          ],
        },
        {
          semester: 6,
          credits: 19,
          subjects: [
            { code: 'EC3601', name: 'Wireless Communication', credits: 3 },
            { code: 'EC3602', name: 'Embedded Systems', credits: 3 },
            { code: 'EC3603', name: 'Control Systems', credits: 3 },
            { code: 'EC3604', name: 'Professional Elective I', credits: 3 },
            { code: 'EC3611', name: 'Wireless Communication Laboratory', credits: 2 },
            { code: 'EC3612', name: 'Embedded Systems Laboratory', credits: 2 },
            { code: 'EC3613', name: 'Mini Project', credits: 1 },
            { code: 'HS3611', name: 'Interpersonal Skills', credits: 2 },
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
            { code: 'EC3701', name: 'Microwave and Optical Communication', credits: 3 },
            { code: 'EC3702', name: 'Internet of Things', credits: 3 },
            { code: 'EC3703', name: 'Professional Elective II', credits: 3 },
            { code: 'EC3704', name: 'Professional Elective III', credits: 3 },
            { code: 'EC3705', name: 'Open Elective I', credits: 3 },
            { code: 'EC3711', name: 'IoT Laboratory', credits: 2 },
            { code: 'HS3711', name: 'Professional English', credits: 1 },
          ],
        },
        {
          semester: 8,
          credits: 10,
          subjects: [
            { code: 'EC3801', name: 'Professional Elective IV', credits: 3 },
            { code: 'EC3802', name: 'Open Elective II', credits: 3 },
            { code: 'EC3811', name: 'Project Work', credits: 10 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // Specializations
  // ==========================================
  specializationsTitle: 'Specialization Areas',
  specializations: [
    {
      icon: '🔧',
      title: 'Embedded Systems & Microcontrollers',
      description: 'Master ARM processors, Arduino, Raspberry Pi, real-time operating systems (RTOS), firmware development, and embedded C programming for smart device applications.',
    },
    {
      icon: '💾',
      title: 'VLSI Design',
      description: 'Learn digital and analog VLSI design, chip architecture, physical design, EDA tools (Cadence, Xilinx), FPGA programming, and ASIC verification techniques.',
    },
    {
      icon: '📡',
      title: 'Wireless Communication',
      description: 'Explore 4G/5G technologies, RF and microwave engineering, antenna design, mobile communication systems, and next-generation wireless networks.',
    },
    {
      icon: '🌐',
      title: 'IoT & Smart Systems',
      description: 'Design sensor networks, cloud integration, edge computing, smart home automation, industrial IoT applications, and machine-to-machine communication systems.',
    },
    {
      icon: '📊',
      title: 'Signal & Image Processing',
      description: 'Study DSP algorithms, audio/video processing, computer vision, image enhancement, pattern recognition, and MATLAB-based signal analysis.',
    },
    {
      icon: '🔒',
      title: 'Network Security',
      description: 'Understand cryptography, secure communication protocols, network defense mechanisms, ethical hacking, and cybersecurity for communication systems.',
    },
  ],

  // ==========================================
  // Career Opportunities
  // ==========================================
  careerTitle: 'Career Opportunities',
  careerPaths: [
    {
      icon: '💼',
      title: 'Electronics Design Engineer',
      description: 'Design and develop electronic circuits, PCB layouts, and hardware systems for consumer electronics, automotive, and industrial applications.',
      avgSalary: '₹4-8 LPA',
    },
    {
      icon: '💼',
      title: 'VLSI Design Engineer',
      description: 'Work on chip design, verification, and testing using advanced EDA tools for semiconductor companies and R&D organizations.',
      avgSalary: '₹5-10 LPA',
    },
    {
      icon: '💼',
      title: 'Embedded Systems Engineer',
      description: 'Develop firmware and software for embedded devices in automotive, aerospace, consumer electronics, and medical equipment industries.',
      avgSalary: '₹4-9 LPA',
    },
    {
      icon: '💼',
      title: 'Network Engineer',
      description: 'Design, implement, and maintain communication networks, routers, switches, and network security infrastructure for enterprises.',
      avgSalary: '₹4-7 LPA',
    },
    {
      icon: '💼',
      title: 'Telecommunications Engineer',
      description: 'Work with telecom service providers on network optimization, 4G/5G deployment, RF engineering, and wireless infrastructure.',
      avgSalary: '₹4-8 LPA',
    },
    {
      icon: '💼',
      title: 'IoT Solutions Architect',
      description: 'Design end-to-end IoT ecosystems, sensor networks, cloud platforms, and smart device integration for industry 4.0 applications.',
      avgSalary: '₹6-12 LPA',
    },
  ],

  // ==========================================
  // Top Recruiters
  // ==========================================
  recruitersTitle: 'Our Top Recruiters',
  recruiters: [
    'TCS',
    'Infosys',
    'Wipro',
    'Tech Mahindra',
    'Bosch',
    'Samsung Electronics',
    'LG Electronics',
    'Philips',
    'Airtel',
    'Reliance Jio',
    'Nokia',
    'Ericsson',
    'BHEL',
    'Siemens',
    'ABB',
    'Schneider Electric',
    'L&T Technology',
    'HCL Technologies',
    'Cognizant',
    'Capgemini',
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionTitle: 'Admission Process',
  admissionSteps: [
    {
      step: 1,
      icon: '📝',
      title: 'Application Submission',
      description: 'Complete the online application form with academic documents including 10th, 12th mark sheets, transfer certificate, and community certificate if applicable.',
    },
    {
      step: 2,
      icon: '📊',
      title: 'Entrance Exam / Merit',
      description: 'Selection based on TNEA (Tamil Nadu Engineering Admissions) rank or 10+2 merit-based marks in Physics, Chemistry, and Mathematics.',
    },
    {
      step: 3,
      icon: '✅',
      title: 'Counseling & Enrollment',
      description: 'Attend counseling session, complete document verification, pay admission fee, and complete enrollment formalities to confirm your seat.',
    },
  ],

  // ==========================================
  // Fee Structure
  // ==========================================
  feeTitle: 'Fee Structure (Annual)',
  feeBreakdown: [
    { component: 'Tuition Fee', amount: '₹60,000' },
    { component: 'Laboratory Fee', amount: '₹10,000' },
    { component: 'Library Fee', amount: '₹2,000' },
    { component: 'Examination Fee', amount: '₹3,000' },
    { component: 'Total Annual Fee', amount: '₹75,000', isTotal: true },
  ],

  // ==========================================
  // Facilities & Laboratories
  // ==========================================
  facilitiesTitle: 'Laboratories & Facilities',
  facilities: [
    {
      name: 'Digital Electronics Laboratory',
      image: 'https://source.unsplash.com/800x600/?electronics,circuit,laboratory',
      description: 'Equipped with logic gate trainers, IC testers, digital design kits, breadboards, and multimeters for hands-on learning of digital circuits and logic design.',
    },
    {
      name: 'Analog Electronics Laboratory',
      image: 'https://source.unsplash.com/800x600/?electronics,oscilloscope,engineering',
      description: 'State-of-the-art facility with oscilloscopes, function generators, power supplies, and electronic components for amplifier and oscillator circuit experiments.',
    },
    {
      name: 'Microprocessor & Microcontroller Lab',
      image: 'https://source.unsplash.com/800x600/?microcontroller,arduino,technology',
      description: 'Features 8085, 8086, ARM processor kits, Arduino boards, and assembly language programming tools for embedded systems development.',
    },
    {
      name: 'Communication Systems Laboratory',
      image: 'https://source.unsplash.com/800x600/?communication,antenna,technology',
      description: 'Advanced lab with AM/FM modulation kits, fiber optic communication systems, antenna testing equipment, and signal generators.',
    },
    {
      name: 'VLSI Design Laboratory',
      image: 'https://source.unsplash.com/800x600/?microchip,circuit,design',
      description: 'Equipped with Cadence EDA tools, ModelSim, Xilinx ISE, FPGA boards (Spartan, Virtex), and chip design software for VLSI coursework.',
    },
    {
      name: 'Embedded Systems Laboratory',
      image: 'https://source.unsplash.com/800x600/?embedded,raspberry-pi,electronics',
      description: 'Contains Arduino, Raspberry Pi, ESP32 boards, IoT sensor kits, RTOS tools, and embedded development environments.',
    },
    {
      name: 'Signal Processing Laboratory',
      image: 'https://source.unsplash.com/800x600/?signal,processing,technology',
      description: 'MATLAB-equipped workstations, DSP processors (TMS320 series), audio/video processing kits, and image processing software.',
    },
    {
      name: 'Network & Security Laboratory',
      image: 'https://source.unsplash.com/800x600/?network,servers,technology',
      description: 'Cisco routers, switches, network simulators (Packet Tracer, GNS3), firewalls, and network monitoring tools for practical networking experience.',
    },
    {
      name: 'Project Laboratory',
      image: 'https://source.unsplash.com/800x600/?engineering,project,laboratory',
      description: 'Dedicated workspace for final year projects with access to all equipment, 3D printers, PCB fabrication tools, and prototyping resources.',
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Our Expert Faculty',
  faculty: [
    {
      name: 'Dr. Rajkumar S.',
      designation: 'Professor & Head',
      qualification: 'Ph.D. in Communication Systems',
      specialization: 'Wireless Communication, 5G Networks',
      image: '/images/faculty/ece-hod.jpg',
    },
    {
      name: 'Dr. Priya Devi M.',
      designation: 'Professor',
      qualification: 'Ph.D. in VLSI Design',
      specialization: 'Digital VLSI, Low Power Design',
      image: '/images/faculty/ece-prof-1.jpg',
    },
    {
      name: 'Dr. Senthil Kumar K.',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Embedded Systems',
      specialization: 'IoT, Embedded Linux, RTOS',
      image: '/images/faculty/ece-prof-2.jpg',
    },
    {
      name: 'Ms. Divya Bharathi R.',
      designation: 'Associate Professor',
      qualification: 'M.E. in Communication Engineering',
      specialization: 'Signal Processing, Image Processing',
      image: '/images/faculty/ece-prof-3.jpg',
    },
    {
      name: 'Dr. Anand Kumar P.',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in RF Engineering',
      specialization: 'Antenna Design, Microwave Engineering',
      image: '/images/faculty/ece-prof-4.jpg',
    },
    {
      name: 'Mr. Karthik Raj V.',
      designation: 'Assistant Professor',
      qualification: 'M.E. in VLSI Design',
      specialization: 'FPGA, Digital Design',
      image: '/images/faculty/ece-prof-5.jpg',
    },
    {
      name: 'Ms. Lakshmi Priya S.',
      designation: 'Assistant Professor',
      qualification: 'M.E. in Embedded Systems',
      specialization: 'ARM, Arduino, Microcontrollers',
      image: '/images/faculty/ece-prof-6.jpg',
    },
    {
      name: 'Mr. Naveen Kumar T.',
      designation: 'Assistant Professor',
      qualification: 'M.E. in Network Security',
      specialization: 'Cryptography, Cybersecurity',
      image: '/images/faculty/ece-prof-7.jpg',
    },
  ],

  // ==========================================
  // FAQs
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the eligibility criteria for B.E. ECE admission?',
      answer: 'Candidates must have passed 10+2 examination with Physics, Chemistry, and Mathematics as core subjects with a minimum of 50% aggregate marks (45% for reserved categories). Admission is based on TNEA rank or merit-based selection.',
    },
    {
      question: 'What are the career prospects after completing B.E. ECE?',
      answer: 'ECE graduates can pursue careers as Electronics Design Engineers, VLSI Engineers, Embedded Systems Engineers, Network Engineers, Telecommunications Engineers, IoT Architects, and more. Average starting salaries range from ₹4-10 LPA depending on skills and company.',
    },
    {
      question: 'Is the ECE program NBA accredited?',
      answer: 'Yes, our B.E. Electronics & Communication Engineering program is accredited by the National Board of Accreditation (NBA), ensuring quality education that meets international standards.',
    },
    {
      question: 'What laboratory facilities are available for ECE students?',
      answer: 'We have 9 specialized laboratories including Digital Electronics Lab, Analog Electronics Lab, Microprocessor Lab, Communication Lab, VLSI Lab, Embedded Systems Lab, Signal Processing Lab, Network Lab, and Project Lab with modern equipment.',
    },
    {
      question: 'What is the placement record for ECE department?',
      answer: 'Our ECE department maintains a placement rate of 90%+ with students being recruited by top companies like TCS, Infosys, Wipro, Bosch, Samsung, LG, Airtel, Jio, Nokia, Siemens, and many more. The highest package offered is ₹10 LPA.',
    },
    {
      question: 'Can students pursue higher studies after B.E. ECE?',
      answer: 'Yes, students can pursue M.E./M.Tech in specializations like VLSI Design, Embedded Systems, Communication Systems, Signal Processing, or opt for MBA. Many students also qualify for GATE and pursue higher education in top IITs and NITs.',
    },
    {
      question: 'Are there research opportunities for ECE students?',
      answer: 'Yes, students can participate in research projects in areas like wireless communication, IoT, VLSI design, embedded systems, signal processing, and network security under faculty guidance. We encourage students to publish papers in conferences and journals.',
    },
    {
      question: 'Which companies recruit ECE students from your college?',
      answer: 'Top recruiters include IT companies (TCS, Infosys, Wipro, Tech Mahindra), electronics companies (Bosch, Samsung, LG, Philips), telecom companies (Airtel, Jio, Nokia, Ericsson), and core engineering companies (BHEL, Siemens, ABB, L&T).',
    },
    {
      question: 'Is hostel facility available for ECE students?',
      answer: 'Yes, we provide separate hostel facilities for boys and girls with modern amenities including 24/7 security, mess facilities, wifi, study rooms, and recreational areas. Hostel charges are separate from tuition fees.',
    },
    {
      question: 'What is the total fee structure for B.E. ECE program?',
      answer: 'The annual tuition fee is ₹75,000 which includes tuition (₹60,000), laboratory fee (₹10,000), library fee (₹2,000), and examination fee (₹3,000). Hostel and transport charges are additional and optional.',
    },
  ],

  // ==========================================
  // Final CTA Section
  // ==========================================
  ctaTitle: 'Ready to Start Your ECE Journey?',
  ctaDescription: 'Join JKKN College of Engineering & Technology and become a skilled electronics and communication engineer. Apply now for 2025-26 admissions!',
  ctaButtonLabel: 'Apply Now',
  ctaButtonLink: '/apply',

  // ==========================================
  // Styling
  // ==========================================
  primaryColor: '#0b6d41',
  accentColor: '#ffde59',
}
