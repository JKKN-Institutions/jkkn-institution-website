import type { BEEEECoursePageProps } from '@/components/cms-blocks/content/be-eee-course-page'

/**
 * Comprehensive B.E. Electrical & Electronics Engineering Course Data
 * JKKN College of Engineering & Technology
 *
 * This data matches the layout with cream color backgrounds
 */
export const BE_EEE_SAMPLE_DATA: BEEEECoursePageProps = {
  // ==========================================
  // Hero Section
  // ==========================================
  heroTitle: 'B.E. Electrical & Electronics Engineering',
  heroSubtitle: 'Power your future with expertise in electrical systems, power generation, automation, and control systems. Our AICTE-approved, NAAC-accredited program prepares you to design, develop, and maintain the electrical infrastructure that powers the modern world.',
  heroStats: [
    { icon: '', label: 'Years Duration', value: '4' },
    { icon: '', label: 'Seats Available', value: '60' },
    { icon: '', label: 'Placement Rate', value: '95%' },
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
      icon: '⚡',
      title: 'About the Program',
      value: 'Power Engineering',
      description: 'Our B.E. Electrical & Electronics Engineering program covers power systems, electrical machines, control systems, power electronics, renewable energy, and smart grid technologies.',
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
      value: 'AICTE & NAAC',
      description: 'Our program is approved by AICTE (All India Council for Technical Education) and accredited by NAAC, ensuring quality education standards.',
    },
    {
      icon: '📚',
      title: 'Eligibility',
      value: '10+2 with PCM',
      description: 'Candidates must have passed 10+2 with Physics, Chemistry & Mathematics with minimum 50% aggregate (45% for reserved categories).',
    },
  ],

  // ==========================================
  // Why Choose EEE
  // ==========================================
  whyChooseTitle: 'Why Choose Electrical & Electronics Engineering?',
  benefits: [
    {
      icon: '✅',
      title: 'Industry-Aligned Curriculum',
      description: 'Our curriculum is designed to meet current industry standards covering power systems, renewable energy, smart grids, electric vehicles, and automation technologies used globally.',
    },
    {
      icon: '✅',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified professors with Ph.D. degrees and extensive industry experience in power systems, electrical machines, control systems, and power electronics.',
    },
    {
      icon: '✅',
      title: 'Advanced Laboratories',
      description: 'Access state-of-the-art laboratories for electrical machines, power systems, power electronics, control systems, renewable energy, and high voltage engineering with modern equipment.',
    },
    {
      icon: '✅',
      title: 'Placement Opportunities',
      description: 'Strong placement record with recruitment from TNEB, BHEL, Siemens, ABB, L&T, Schneider Electric, and other leading power and automation companies.',
    },
    {
      icon: '✅',
      title: 'Research & Innovation',
      description: 'Engage in cutting-edge research in renewable energy systems, smart grids, electric vehicles, power quality, and energy management systems.',
    },
    {
      icon: '✅',
      title: 'Industry Partnerships',
      description: 'Gain practical experience through internships and industrial visits to thermal power plants, substations, manufacturing units, and renewable energy installations.',
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
            { code: 'GE3152', name: 'தமிழர் மரபு / Heritage of Tamils', credits: 1 },
            { code: 'GE3171', name: 'Problem Solving and Python Programming Laboratory', credits: 2 },
            { code: 'BS3171', name: 'Physics and Chemistry Laboratory', credits: 2 },
            { code: 'GE3172', name: 'English Laboratory', credits: 1 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA3251', name: 'Statistics and Numerical Methods', credits: 4 },
            { code: 'PH3256', name: 'Physics for Information Science', credits: 3 },
            { code: 'BE3251', name: 'Basic Electrical and Electronics Engineering', credits: 3 },
            { code: 'GE3251', name: 'Engineering Graphics', credits: 4 },
            { code: 'GE3252', name: 'தமிழ் இலக்கியம் / Tamil Literature', credits: 1 },
            { code: 'GE3271', name: 'Engineering Practices Laboratory', credits: 2 },
            { code: 'BE3271', name: 'Basic Electrical and Electronics Engineering Laboratory', credits: 2 },
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
            { code: 'EE3301', name: 'Electromagnetic Theory', credits: 4 },
            { code: 'EE3302', name: 'Electric Circuit Analysis', credits: 4 },
            { code: 'EE3303', name: 'Analog and Digital Electronics', credits: 3 },
            { code: 'EE3304', name: 'Electrical Machines - I', credits: 3 },
            { code: 'EE3311', name: 'Electrical Machines Laboratory - I', credits: 2 },
            { code: 'GE3361', name: 'Professional English - I', credits: 1 },
          ],
        },
        {
          semester: 4,
          credits: 21,
          subjects: [
            { code: 'MA3391', name: 'Probability and Statistics', credits: 4 },
            { code: 'EE3401', name: 'Electrical Machines - II', credits: 4 },
            { code: 'EE3402', name: 'Transmission and Distribution', credits: 4 },
            { code: 'EE3403', name: 'Measurements and Instrumentation', credits: 3 },
            { code: 'EE3404', name: 'Signals and Systems', credits: 3 },
            { code: 'EE3411', name: 'Electrical Machines Laboratory - II', credits: 2 },
            { code: 'GE3451', name: 'Environmental Sciences and Sustainability', credits: 2 },
          ],
        },
      ],
    },
    {
      year: 3,
      semesters: [
        {
          semester: 5,
          credits: 20,
          subjects: [
            { code: 'EE3501', name: 'Power System Analysis', credits: 4 },
            { code: 'EE3502', name: 'Power Electronics', credits: 4 },
            { code: 'EE3503', name: 'Linear and Digital Control Systems', credits: 4 },
            { code: 'EE3504', name: 'Microprocessors and Microcontrollers', credits: 3 },
            { code: 'EE3511', name: 'Control Systems Laboratory', credits: 2 },
            { code: 'EE3512', name: 'Microprocessors and Microcontrollers Laboratory', credits: 2 },
            { code: 'GE3571', name: 'Professional English - II', credits: 1 },
          ],
        },
        {
          semester: 6,
          credits: 19,
          subjects: [
            { code: 'EE3601', name: 'Power System Operation and Control', credits: 3 },
            { code: 'EE3602', name: 'Protection and Switchgear', credits: 3 },
            { code: 'EE3603', name: 'Solid State Drives', credits: 3 },
            { code: 'EE3604', name: 'Design of Electrical Machines', credits: 3 },
            { code: 'EE3611', name: 'Power Electronics and Drives Laboratory', credits: 2 },
            { code: 'EE3612', name: 'Comprehension', credits: 1 },
            { code: 'EE3613', name: 'Mini Project', credits: 2 },
            { code: 'GE3651', name: 'Professional English - III', credits: 1 },
            { code: 'HS3252', name: 'Professional Ethics', credits: 1 },
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
            { code: 'EE3701', name: 'High Voltage Engineering', credits: 3 },
            { code: 'EE3702', name: 'Renewable Energy Systems', credits: 3 },
            { code: 'OE3701', name: 'Open Elective - I', credits: 3 },
            { code: 'PE3701', name: 'Professional Elective - I', credits: 3 },
            { code: 'PE3702', name: 'Professional Elective - II', credits: 3 },
            { code: 'EE3711', name: 'Power Systems Simulation Laboratory', credits: 2 },
            { code: 'EE3712', name: 'Renewable Energy Laboratory', credits: 2 },
          ],
        },
        {
          semester: 8,
          credits: 10,
          subjects: [
            { code: 'PE3801', name: 'Professional Elective - III', credits: 3 },
            { code: 'PE3802', name: 'Professional Elective - IV', credits: 3 },
            { code: 'EE3811', name: 'Project Work', credits: 10 },
          ],
        },
      ],
    },
  ],

  // ==========================================
  // Specializations (Optional)
  // ==========================================
  specializationsTitle: 'Specializations Offered',
  specializations: [
    {
      icon: '⚡',
      title: 'Power Systems Engineering',
      description: 'Master power generation, transmission, distribution, grid management, smart grid technologies, and power system protection and control.',
    },
    {
      icon: '🔌',
      title: 'Power Electronics & Drives',
      description: 'Learn advanced power electronic converters, motor drives, electric vehicle technology, and industrial automation systems.',
    },
    {
      icon: '🌞',
      title: 'Renewable Energy Systems',
      description: 'Develop expertise in solar power, wind energy, hydroelectric systems, energy storage technologies, and microgrid design.',
    },
    {
      icon: '🤖',
      title: 'Industrial Automation',
      description: 'Gain proficiency in PLC programming, SCADA systems, industrial robotics, process control, and factory automation.',
    },
    {
      icon: '🔋',
      title: 'Electric Vehicles',
      description: 'Explore EV technology, battery management systems, charging infrastructure, motor control, and sustainable transportation.',
    },
    {
      icon: '📡',
      title: 'Embedded Systems',
      description: 'Master microcontrollers, IoT devices, embedded C programming, real-time operating systems, and industrial embedded applications.',
    },
  ],

  // ==========================================
  // Career Opportunities
  // ==========================================
  careerTitle: 'Career Opportunities',
  careerPaths: [
    {
      icon: '⚡',
      title: 'Electrical Engineer',
      description: 'Design, develop, and maintain electrical systems for power generation plants, substations, transmission networks, and industrial facilities.',
      avgSalary: '₹3.5-8 LPA',
    },
    {
      icon: '🔌',
      title: 'Power Systems Engineer',
      description: 'Work on power system planning, operation, control, and protection. Analyze power flow, stability, and optimize grid performance.',
      avgSalary: '₹4-9 LPA',
    },
    {
      icon: '🏭',
      title: 'Automation Engineer',
      description: 'Design and implement automation solutions using PLCs, SCADA, DCS, and robotics for manufacturing and process industries.',
      avgSalary: '₹3.5-8 LPA',
    },
    {
      icon: '🔋',
      title: 'Power Electronics Engineer',
      description: 'Develop power electronic converters, inverters, motor drives, and control systems for renewable energy and electric vehicles.',
      avgSalary: '₹4-10 LPA',
    },
    {
      icon: '🌞',
      title: 'Renewable Energy Engineer',
      description: 'Design and implement solar power plants, wind farms, and hybrid renewable energy systems. Work on energy storage and microgrid projects.',
      avgSalary: '₹3.5-9 LPA',
    },
    {
      icon: '🏗️',
      title: 'Project Engineer',
      description: 'Manage electrical projects including design, procurement, installation, testing, and commissioning of electrical systems and equipment.',
      avgSalary: '₹3-7 LPA',
    },
  ],

  // ==========================================
  // Top Recruiters
  // ==========================================
  recruitersTitle: 'Our Top Recruiters',
  recruiters: [
    'TNEB',
    'BHEL',
    'Siemens',
    'ABB',
    'L&T',
    'Schneider Electric',
    'CG Power',
    'Crompton Greaves',
    'Bosch',
    'Emerson',
    'Honeywell',
    'GE Power',
    'Tata Power',
    'Adani Power',
    'NTPC',
    'Suzlon Energy',
    'Thermax',
    'Kirloskar Electric',
    'Voltas',
    'Forbes Marshall',
  ],

  // ==========================================
  // Admission Process
  // ==========================================
  admissionTitle: 'Admission Process',
  admissionSteps: [
    {
      step: 1,
      icon: '📝',
      title: 'Apply Online',
      description: 'Fill out the online application form with your academic details, personal information, and upload required documents through our official admission portal.',
    },
    {
      step: 2,
      icon: '✅',
      title: 'Document Verification',
      description: 'Submit required documents including mark sheets, certificates, and ID proof for verification. Our admission team will review and validate your documents.',
    },
    {
      step: 3,
      icon: '🎓',
      title: 'Admission Confirmation',
      description: 'Pay the admission fees online or offline, confirm your seat, and attend the orientation program to begin your engineering journey with us.',
    },
  ],

  // ==========================================
  // Fee Structure
  // ==========================================
  feeTitle: 'Fee Structure (Annual)',
  feeBreakdown: [
    { component: 'Tuition Fee', amount: '70,000' },
    { component: 'Lab Fee', amount: '5,000' },
    { component: 'Library Fee', amount: '2,000' },
    { component: 'Exam Fee', amount: '3,000' },
    { component: 'Development Fee', amount: '5,000' },
    { component: 'Other Fees', amount: '5,000' },
    { component: 'TOTAL', amount: '90,000', isTotal: true },
  ],

  // ==========================================
  // Facilities
  // ==========================================
  facilitiesTitle: 'State-of-the-Art Laboratories',
  facilities: [
    {
      name: 'Electrical Machines Laboratory',
      description: 'Well-equipped lab with DC machines, transformers, induction motors, synchronous machines, and testing equipment for comprehensive hands-on training in electrical machine operations.',
      image: 'https://source.unsplash.com/800x600/?electrical,motor,machinery',
    },
    {
      name: 'Power Systems Laboratory',
      description: 'Advanced lab with power system simulation software (ETAP, PSCAD), protection relays, circuit breakers, and equipment for studying power generation, transmission, and distribution.',
      image: 'https://source.unsplash.com/800x600/?power,substation,electrical',
    },
    {
      name: 'Power Electronics Laboratory',
      description: 'Modern lab featuring converters, inverters, choppers, cycloconverters, motor drives, and DSP-based control systems for practical training in power electronics applications.',
      image: 'https://source.unsplash.com/800x600/?electronics,power,engineering',
    },
    {
      name: 'Control Systems Laboratory',
      description: 'Equipped with PLC trainers, SCADA systems, servo motors, process control trainers, and simulation software for studying linear and nonlinear control systems.',
      image: 'https://source.unsplash.com/800x600/?automation,control,industrial',
    },
    {
      name: 'High Voltage Engineering Laboratory',
      description: 'Specialized lab with high voltage testing equipment, impulse generators, transformer testing setups, and insulation testing facilities for understanding HV phenomena.',
      image: 'https://source.unsplash.com/800x600/?electricity,voltage,testing',
    },
    {
      name: 'Renewable Energy Laboratory',
      description: 'Dedicated lab with solar panels, wind turbines, battery storage systems, charge controllers, and hybrid renewable energy setups for sustainable energy education.',
      image: 'https://source.unsplash.com/800x600/?solar,renewable,energy',
    },
    {
      name: 'Measurements & Instrumentation Lab',
      description: 'Comprehensive lab with analog and digital measuring instruments, transducers, signal conditioning equipment, and data acquisition systems for precision measurements.',
      image: 'https://source.unsplash.com/800x600/?measurement,instrument,precision',
    },
    {
      name: 'Microprocessor & Microcontroller Lab',
      description: 'Advanced lab with 8085, 8086 microprocessor kits, 8051 microcontroller trainers, ARM processors, and embedded development tools for programming and interfacing practice.',
      image: 'https://source.unsplash.com/800x600/?microprocessor,embedded,technology',
    },
    {
      name: 'Project Laboratory',
      description: 'Dedicated space for final year projects and research work with access to advanced equipment, design software, fabrication facilities, and mentorship from faculty.',
      image: 'https://source.unsplash.com/800x600/?engineering,workshop,project',
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Our Experienced Faculty',
  faculty: [
    {
      name: 'Dr. Senthil Kumar M.',
      designation: 'Professor & HOD',
      qualification: 'Ph.D. in Power Systems',
      specialization: 'Smart Grids, Power Quality',
      image: '/images/faculty/hod-eee.jpg',
    },
    {
      name: 'Dr. Meena Devi R.',
      designation: 'Professor',
      qualification: 'Ph.D. in Power Electronics',
      specialization: 'Motor Drives, Renewable Energy',
      image: '/images/faculty/meena-devi.jpg',
    },
    {
      name: 'Dr. Ramesh Babu K.',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in High Voltage Engineering',
      specialization: 'Insulation, Lightning Protection',
      image: '/images/faculty/ramesh-babu.jpg',
    },
    {
      name: 'Dr. Bharathi S.',
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Control Systems',
      specialization: 'Industrial Automation, PLC',
      image: '/images/faculty/bharathi-s.jpg',
    },
    {
      name: 'Mr. Vignesh Kumar P.',
      designation: 'Assistant Professor',
      qualification: 'M.E. in Power Systems Engineering',
      specialization: 'Transmission & Distribution',
      image: '/images/faculty/vignesh-kumar.jpg',
    },
    {
      name: 'Ms. Priya Darshini M.',
      designation: 'Assistant Professor',
      qualification: 'M.E. in Power Electronics',
      specialization: 'Electric Vehicles, Battery Systems',
      image: '/images/faculty/priya-darshini.jpg',
    },
    {
      name: 'Mr. Selvam R.',
      designation: 'Assistant Professor',
      qualification: 'M.E. in Applied Electronics',
      specialization: 'Embedded Systems, IoT',
      image: '/images/faculty/selvam-r.jpg',
    },
    {
      name: 'Ms. Kavitha L.',
      designation: 'Assistant Professor',
      qualification: 'M.E. in Electrical Machines',
      specialization: 'Machine Design, Finite Element Analysis',
      image: '/images/faculty/kavitha-l.jpg',
    },
  ],

  // ==========================================
  // FAQs
  // ==========================================
  faqTitle: 'Frequently Asked Questions',
  faqs: [
    {
      question: 'What is the eligibility criteria for B.E. EEE admission?',
      answer: 'Candidates must have passed 10+2 with Physics, Chemistry, and Mathematics with a minimum of 50% aggregate marks (45% for reserved categories). Valid TNEA rank is required for Tamil Nadu students.',
    },
    {
      question: 'What is the difference between EEE and ECE?',
      answer: 'EEE focuses on power systems, electrical machines, power generation, transmission, distribution, and industrial automation. ECE focuses on electronics, telecommunications, signal processing, and embedded systems. EEE deals with heavy current applications while ECE deals with low current electronics.',
    },
    {
      question: 'What are the career opportunities after B.E. EEE?',
      answer: 'EEE graduates can work in power generation companies (TNEB, NTPC), electrical equipment manufacturers (BHEL, Siemens, ABB), automation companies (Rockwell, Honeywell), renewable energy firms, electric vehicle companies, and consulting firms. Government jobs in electricity boards and PSUs are also available.',
    },
    {
      question: 'What are the placement opportunities?',
      answer: 'Our department has a strong placement record with 92%+ placement rate. Top companies like TNEB, BHEL, Siemens, ABB, L&T, Schneider Electric, and CG Power visit our campus. The highest package offered is ₹10 LPA and average package is ₹4 LPA.',
    },
    {
      question: 'What practical skills will I learn?',
      answer: 'You will gain hands-on experience in electrical machine testing, power system simulation, PLC programming, SCADA operation, motor drive control, renewable energy system design, AutoCAD electrical design, and project management.',
    },
    {
      question: 'Are there government job opportunities?',
      answer: 'Yes! EEE graduates are highly sought after for government jobs in TNEB, TANGEDCO, Indian Railways, BHEL, NTPC, PGCIL, and other PSUs. You can also prepare for GATE and pursue M.Tech followed by PSU recruitment through GATE score.',
    },
    {
      question: 'What are the laboratory facilities?',
      answer: 'We have 9 specialized laboratories including Electrical Machines Lab, Power Systems Lab, Power Electronics Lab, Control Systems Lab, High Voltage Lab, Renewable Energy Lab, Measurements Lab, Microprocessor Lab, and Project Lab with latest equipment and software.',
    },
    {
      question: 'Can I specialize in renewable energy?',
      answer: 'Yes! We offer specialization in renewable energy systems covering solar, wind, hydro power, energy storage, and microgrid technologies. You can also do your final year project in this area and pursue higher studies or careers in the renewable energy sector.',
    },
    {
      question: 'What is the fee structure?',
      answer: 'The annual fee is ₹90,000 which includes tuition, lab fees, library fees, and other charges. We offer various scholarships including merit-based scholarships, government scholarships, and financial assistance with up to 100% fee waiver for eligible students.',
    },
    {
      question: 'Are internships available?',
      answer: 'Yes, we facilitate internships at thermal power plants, substations, manufacturing companies like BHEL and Siemens, automation companies, and renewable energy installations. Industrial training is mandatory in 6th semester with full support from the department.',
    },
  ],

  // ==========================================
  // Final CTA Section
  // ==========================================
  ctaTitle: 'Ready to Power Your Future?',
  ctaDescription: 'Join our B.E. Electrical & Electronics Engineering program and become part of the team that designs, develops, and maintains the electrical infrastructure powering our nation. Apply now and transform your career in the exciting field of electrical engineering.',
  ctaButtonLabel: 'Apply Now for 2025-26',
  ctaButtonLink: '/apply',

  // ==========================================
  // Styling
  // ==========================================
  primaryColor: '#0b6d41', // JKKN Brand Green
  accentColor: '#ffde59', // JKKN Brand Gold
}

export default BE_EEE_SAMPLE_DATA
