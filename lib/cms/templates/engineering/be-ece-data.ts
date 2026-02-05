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
  heroSubtitle: 'Shape the future of communication technology with expertise in embedded systems, VLSI, wireless communication, and IoT. Our AICTE-approved, NAAC-accredited program prepares you to design, develop, and innovate in the rapidly evolving world of electronics and communication.',
  heroStats: [
    { icon: 'GraduationCap', label: 'Years Duration', value: '4' },
    { icon: 'Users', label: 'Seats Available', value: '60' },
    { icon: 'TrendingUp', label: 'Placement Rate', value: '95%' },
    { icon: 'Trophy', label: 'Highest Package', value: '₹10L' },
  ],
  heroCTAs: [
    { label: 'Apply Now for 2026-27', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8', variant: 'primary' },
    { label: 'Explore Curriculum', link: '#curriculum', variant: 'secondary' },
  ],
  affiliatedTo: 'Affiliated to Anna University, Chennai',

  // ==========================================
  // Course Overview
  // ==========================================
  overviewTitle: 'Course Overview',
  overviewCards: [
    {
      icon: 'Antenna',
      title: 'About the Program',
      value: 'Communication Engineering',
      description: 'Our B.E. Electronics & Communication Engineering program covers embedded systems, VLSI design, wireless communication, signal processing, IoT, and network security technologies.',
    },
    {
      icon: 'GraduationCap',
      title: 'Duration & Credits',
      value: '4 Years | 8 Semesters',
      description: 'The program spans 4 years with 8 semesters totaling 160 credits. Comprehensive curriculum balancing theory, laboratory work, and industrial training.',
    },
    {
      icon: 'CheckCircle',
      title: 'Accreditation',
      value: 'AICTE & NAAC',
      description: 'Our program is approved by AICTE (All India Council for Technical Education) and accredited by NAAC, ensuring quality education standards.',
    },
    {
      icon: 'BookOpen',
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
      icon: 'CheckCircle',
      title: 'Industry-Aligned Curriculum',
      description: 'Our curriculum is designed to meet current industry standards covering embedded systems, IoT, VLSI design, 4G/5G wireless communication, and smart systems used globally.',
    },
    {
      icon: 'CheckCircle',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified professors with Ph.D. degrees and extensive industry experience in embedded systems, VLSI, communication systems, and signal processing.',
    },
    {
      icon: 'CheckCircle',
      title: 'State-of-the-Art Laboratories',
      description: 'Access advanced laboratories for digital electronics, microprocessors, communication systems, VLSI design, embedded systems, and IoT with modern equipment including FPGA boards and EDA tools.',
    },
    {
      icon: 'CheckCircle',
      title: 'Excellent Placements',
      description: 'Strong placement record with recruitment from TCS, Infosys, Wipro, Bosch, Samsung, LG, Airtel, Jio, Nokia, and other leading electronics and IT companies.',
    },
    {
      icon: 'CheckCircle',
      title: 'Research Opportunities',
      description: 'Engage in cutting-edge research in wireless communication, IoT systems, VLSI design, signal processing, embedded systems, and network security.',
    },
    {
      icon: 'CheckCircle',
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
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem1.png',
          subjects: [
            { code: 'MA25C01', name: 'Applied Calculus' },
            { code: 'EN25C01', name: 'English Essentials – I' },
            { code: 'UC25H01', name: 'தமிழர் மரபு / Heritage of Tamils' },
            { code: 'EE25C04', name: 'Basic Electronics and Electrical Engineering' },
            { code: 'PH25C01', name: 'Applied Physics - I' },
            { code: 'CY25C01', name: 'Applied Chemistry - I' },
            { code: 'CS25C01', name: 'Computer Programming: C' },
            { code: 'ME25C04', name: 'Makerspace' },
            { code: 'UC25A01', name: 'Life Skills for Engineers – I' },
            { code: 'UC25A02', name: 'Physical Education – I' },
          ],
        },
        {
          semester: 2,
          credits: 20,
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem2.png',
          subjects: [
            { code: 'MA25C02', name: 'Linear Algebra' },
            { code: 'UC25H02', name: 'தமிழ்தகவல் தொழில்நுட்பம் / Tamils and Technology' },
            { code: 'EN25C02', name: 'English Essentials – II' },
            { code: 'EC25C01', name: 'Electron Devices' },
            { code: 'EC25C02', name: 'Circuits and Network Analysis' },
            { code: 'CS25C05', name: 'Data Structures using C++' },
            { code: 'ME25C05', name: 'Re-Engineering for Innovation' },
            { code: 'UC25A03', name: 'Life Skills for Engineers – II' },
            { code: 'EC25C03', name: 'Devices and Circuits Laboratory' },
            { code: 'UC25A04', name: 'Physical Education – II' },
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
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem3.png',
          subjects: [
            { code: '', name: 'Transforms and its Applications' },
            { code: '', name: 'Signals and Systems' },
            { code: '', name: 'Computer Architecture and Organization' },
            { code: '', name: 'Electronic Circuits and Analysis' },
            { code: '', name: 'Digital System Design' },
            { code: '', name: 'Problem solving using python' },
            { code: '', name: 'Electronic Circuits Laboratory' },
            { code: '', name: 'Skill Development Course-I' },
            { code: '', name: 'English Communication Skills Laboratory – II' },
          ],
        },
        {
          semester: 4,
          credits: 20,
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem4.png',
          subjects: [
            { code: '', name: 'Probability and Random Processes' },
            { code: '', name: 'Electro Magnetic Fields and Transmission Lines' },
            { code: '', name: 'Introduction to Standards in Electronics and Communication' },
            { code: '', name: 'Linear Integrated Circuits' },
            { code: '', name: 'Analog Communication' },
            { code: '', name: 'Digital Signal Processing' },
            { code: '', name: 'Skill Development Course – II' },
            { code: '', name: 'English Communication Skills Laboratory – III' },
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
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem5.png',
          subjects: [
            { code: '', name: 'Control Systems' },
            { code: '', name: 'Programme Elective – I' },
            { code: '', name: 'Data Communication Networks' },
            { code: '', name: 'Digital Communication' },
            { code: '', name: 'Microprocessor and Microcontroller' },
            { code: '', name: 'Artificial Intelligence & Machine Learning' },
            { code: '', name: 'Skill Development Course – III' },
            { code: '', name: 'Industry Oriented Course - I' },
          ],
        },
        {
          semester: 6,
          credits: 19,
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem6.png',
          subjects: [
            { code: '', name: 'Programme Elective – II' },
            { code: '', name: 'Programme Elective – III' },
            { code: '', name: 'Open Elective' },
            { code: '', name: 'Antenna Design' },
            { code: '', name: 'CMOS VLSI Design' },
            { code: '', name: 'Wireless Communication' },
            { code: '', name: 'Industry Oriented Course - II' },
            { code: '', name: 'Self-Learning Course' },
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
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem7.png',
          subjects: [
            { code: '', name: 'Engineering Entrepreneurship Development' },
            { code: '', name: 'Climate Change and Sustainability' },
            { code: '', name: 'RF and Microwave Engineering' },
            { code: '', name: 'Programme Elective – IV' },
            { code: '', name: 'Programme Elective – V' },
            { code: '', name: 'Project Management' },
            { code: '', name: 'Millimeter wave and Optical Communication' },
            { code: '', name: 'Embedded systems and Industrial IOT' },
            { code: '', name: 'Summer Internship*' },
          ],
        },
        {
          semester: 8,
          credits: 10,
          image: 'C:/Users/Admin/Pictures/Screenshots/ecesem8.png',
          subjects: [
            { code: '', name: 'Project Work / Internship cum Project Work' },
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
      icon: 'Wrench',
      title: 'Embedded Systems & Microcontrollers',
      description: 'Master ARM processors, Arduino, Raspberry Pi, real-time operating systems (RTOS), firmware development, and embedded C programming for smart device applications.',
    },
    {
      icon: 'HardDrive',
      title: 'VLSI Design',
      description: 'Learn digital and analog VLSI design, chip architecture, physical design, EDA tools (Cadence, Xilinx), FPGA programming, and ASIC verification techniques.',
    },
    {
      icon: 'Antenna',
      title: 'Wireless Communication',
      description: 'Explore 4G/5G technologies, RF and microwave engineering, antenna design, mobile communication systems, and next-generation wireless networks.',
    },
    {
      icon: 'Globe',
      title: 'IoT & Smart Systems',
      description: 'Design sensor networks, cloud integration, edge computing, smart home automation, industrial IoT applications, and machine-to-machine communication systems.',
    },
    {
      icon: 'BarChart3',
      title: 'Signal & Image Processing',
      description: 'Study DSP algorithms, audio/video processing, computer vision, image enhancement, pattern recognition, and MATLAB-based signal analysis.',
    },
    {
      icon: 'Lock',
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
      icon: 'Briefcase',
      title: 'Electronics Design Engineer',
      description: 'Design and develop electronic circuits, PCB layouts, and hardware systems for consumer electronics, automotive, and industrial applications.',
      avgSalary: '₹4-8 LPA',
    },
    {
      icon: 'Briefcase',
      title: 'VLSI Design Engineer',
      description: 'Work on chip design, verification, and testing using advanced EDA tools for semiconductor companies and R&D organizations.',
      avgSalary: '₹5-10 LPA',
    },
    {
      icon: 'Briefcase',
      title: 'Embedded Systems Engineer',
      description: 'Develop firmware and software for embedded devices in automotive, aerospace, consumer electronics, and medical equipment industries.',
      avgSalary: '₹4-9 LPA',
    },
    {
      icon: 'Briefcase',
      title: 'Network Engineer',
      description: 'Design, implement, and maintain communication networks, routers, switches, and network security infrastructure for enterprises.',
      avgSalary: '₹4-7 LPA',
    },
    {
      icon: 'Briefcase',
      title: 'Telecommunications Engineer',
      description: 'Work with telecom service providers on network optimization, 4G/5G deployment, RF engineering, and wireless infrastructure.',
      avgSalary: '₹4-8 LPA',
    },
    {
      icon: 'Briefcase',
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
    'LGB',
    'Foxconn',
    'TVS Group',
    'Sourcesys',
    'Infinix',
    'Pronoia Insurance',
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionTitle: 'Admission Process',
  admissionSteps: [
    {
      step: 1,
      icon: 'FileEdit',
      title: 'Application Submission',
      description: 'Complete the online application form with academic documents including 10th, 12th mark sheets, transfer certificate, and community certificate if applicable.',
    },
    {
      step: 2,
      icon: 'BarChart3',
      title: 'Entrance Exam / Merit',
      description: 'Selection based on TNEA (Tamil Nadu Engineering Admissions) rank or 10+2 merit-based marks in Physics, Chemistry, and Mathematics.',
    },
    {
      step: 3,
      icon: 'CheckCircle',
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
      image: '/images/courses/be-ece/JKKN ECE - Digital Electronics Laboratory.png',
      description: 'Equipped with logic gate trainers, IC testers, digital design kits, breadboards, and multimeters for hands-on learning of digital circuits and logic design.',
    },
    {
      name: 'Analog Electronics Laboratory',
      image: '/images/courses/be-ece/JKKN ECE - Analog Electronics Laboratory.png',
      description: 'State-of-the-art facility with oscilloscopes, function generators, power supplies, and electronic components for amplifier and oscillator circuit experiments.',
    },
    {
      name: 'Microprocessor & Microcontroller Lab',
      image: '/images/courses/be-eee/JKKN EEE - Microprocessor & Microcontroller Laboratory.png',
      description: 'Features 8085, 8086, ARM processor kits, Arduino boards, and assembly language programming tools for embedded systems development.',
    },
    {
      name: 'Communication Systems Laboratory',
      image: '/images/courses/be-ece/JKKN ECE - Communication Systems Laboratory.png',
      description: 'Advanced lab with AM/FM modulation kits, fiber optic communication systems, antenna testing equipment, and signal generators.',
    },
    {
      name: 'VLSI Design Laboratory',
      image: '/images/courses/be-ece/JKKN ECE - VLSI Design Laboratory.png',
      description: 'Equipped with Cadence EDA tools, ModelSim, Xilinx ISE, FPGA boards (Spartan, Virtex), and chip design software for VLSI coursework.',
    },
    {
      name: 'Embedded Systems Laboratory',
      image: '/images/courses/be-ece/Embed systemlab.png',
      description: 'Contains Arduino, Raspberry Pi, ESP32 boards, IoT sensor kits, RTOS tools, and embedded development environments.',
    },
    {
      name: 'Signal Processing Laboratory',
      image: '/images/courses/be-ece/signal processing.png',
      description: 'MATLAB-equipped workstations, DSP processors (TMS320 series), audio/video processing kits, and image processing software.',
    },
    {
      name: 'Network & Security Laboratory',
      image: '/images/courses/be-cse/labs/networks-security-lab.png',
      description: 'Cisco routers, switches, network simulators (Packet Tracer, GNS3), firewalls, and network monitoring tools for practical networking experience.',
    },
    {
      name: 'Project Laboratory',
      image: '/images/courses/be-eee/JKKN EEE - Project Laboratory.png',
      description: 'Dedicated workspace for final year projects with access to all equipment, 3D printers, PCB fabrication tools, and prototyping resources.',
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Our Expert Faculty',
  faculty: [
    {
      name: 'Dr. Rajesh K.P.',
      designation: 'Associate Professor & Head',
      qualification: 'M.E., Ph.D.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. Ponnarasi N',
      designation: 'Assistant Professor',
      qualification: 'M.E. (Ph.D)',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. Tamilselvi S',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. Palanisamy K',
      designation: 'Assistant Professor',
      qualification: 'M.E. (Ph.D)',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. Praveen Kumar K',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. Mekala',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. Dhineshkumar',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. Shaanthanu K',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Ms. Mouniga G',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. Vishvanathan',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electronics & Communication Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
  ],

  // ==========================================
  // MOUs
  // ==========================================
  mousTitle: 'MOUs 2022-23',
  mous: [
    {
      company: 'Megatronics',
      description: 'Memorandum of Understanding (MoU) is entered into on 24th of April, 2023, at Kumarapalayam, Namakkal Dist, Tamil Nadu for a period of 3 years up to 31st April, 2036. Between JKKN College of Engineering and Technology at Natarajapuram, NH-544, (Salem to Coimbatore), Kumarapalayam- 638 183. Namakkal Dist, Tamil Nadu is the first party and Megatronics has its office at 62, R.K. Mills \'B\' Colony, Peelamedu Pudur, Coimbatore – 641 004, Tamil Nadu.',
    },
    {
      company: 'SUNSHIV Electronics Solutions',
      description: 'Memorandum of Understanding (MoU) is entered into on 24th of April, 2023, at Kumarapalayam, Namakkal Dist, Tamil Nadu for a period of 3 years up to 31st April, 2036. Between JKKN College of Engineering and Technology at Natarajapuram, NH-544, (Salem to Coimbatore), Kumarapalayam- 638 183. Namakkal Dist, Tamil Nadu is the first party and SUNSHIV Electronics Solutions has its office at 245, Chinnasamy Naidu Rd, Opp. to Ayyappan temple, C.K.Colony, B.K.R Nagar, New Siddhapudur, Coimbatore, Tamil Nadu 641044.',
    },
    {
      company: 'C Cube Technologies',
      description: 'Memorandum of Understanding (MoU) is entered into on 24th of April, 2023, at Kumarapalayam, Namakkal Dist, Tamil Nadu for a period of 3 years up to 31st April, 2036. Between JKKN College of Engineering and Technology at Natarajapuram, NH-544, (Salem to Coimbatore), Kumarapalayam- 638 183. Namakkal Dist, Tamil Nadu is the first party and C Cube Technologies, Amman Complex, Erode.',
    },
    {
      company: 'Om Technocraft',
      description: 'Memorandum of Understanding (MoU) is entered into on 24th of April, 2023, at Kumarapalayam, Namakkal Dist, Tamil Nadu for a period of 3 years up to 31st April, 2036. Between JKKN College of Engineering and Technology at Natarajapuram, NH-544, (Salem to Coimbatore), Kumarapalayam- 638 183. Namakkal Dist, Tamil Nadu is the first party and Om Technocraft, B-395, Elango Nagar, Housing Unit Rd, East, Nehru Nagar West, Coimbatore, 641014',
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
      question: 'Is the ECE program NAAC accredited?',
      answer: 'Yes, our B.E. Electronics & Communication Engineering program is accredited by the National Assessment and Accreditation Council (NAAC), ensuring quality education that meets international standards.',
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
  ctaDescription: 'Join JKKN College of Engineering & Technology and become a skilled electronics and communication engineer. Apply now for 2026-27 admissions!',
  ctaButtonLabel: 'Apply Now',
  ctaButtonLink: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8',

  // ==========================================
  // Styling
  // ==========================================
  primaryColor: '#0b6d41',
  accentColor: '#ffde59',
}
