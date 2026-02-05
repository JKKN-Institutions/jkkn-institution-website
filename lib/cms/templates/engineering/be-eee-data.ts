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
      icon: 'CheckCircle',
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
      icon: 'CheckCircle',
      title: 'Industry-Aligned Curriculum',
      description: 'Our curriculum is designed to meet current industry standards covering power systems, renewable energy, smart grids, electric vehicles, and automation technologies used globally.',
    },
    {
      icon: 'CheckCircle',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified professors with Ph.D. degrees and extensive industry experience in power systems, electrical machines, control systems, and power electronics.',
    },
    {
      icon: 'CheckCircle',
      title: 'Advanced Laboratories',
      description: 'Access state-of-the-art laboratories for electrical machines, power systems, power electronics, control systems, renewable energy, and high voltage engineering with modern equipment.',
    },
    {
      icon: 'CheckCircle',
      title: 'Placement Opportunities',
      description: 'Strong placement record with recruitment from TNEB, BHEL, Siemens, ABB, L&T, Schneider Electric, and other leading power and automation companies.',
    },
    {
      icon: 'CheckCircle',
      title: 'Research & Innovation',
      description: 'Engage in cutting-edge research in renewable energy systems, smart grids, electric vehicles, power quality, and energy management systems.',
    },
    {
      icon: 'CheckCircle',
      title: 'Industry Partnerships',
      description: 'Gain practical experience through internships and industrial visits to thermal power plants, substations, manufacturing units, and renewable energy installations.',
    },
  ],

  // ==========================================
  // Curriculum (4 Years) - Updated 2025 Syllabus
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
            { code: 'MA25C01', name: 'Applied Calculus', credits: 4 },
            { code: 'EE25C03', name: 'Fundamentals of Electrical and Electronics Engineering', credits: 3 },
            { code: 'UC25H01', name: 'தமிழர் மரபு / Heritage of Tamils', credits: 1 },
            { code: 'EN25C01', name: 'English Essentials – I', credits: 2 },
            { code: 'PH25C01', name: 'Applied Physics – I', credits: 3 },
            { code: 'CY25C01', name: 'Applied Chemistry – I', credits: 3 },
            { code: 'CS25C01', name: 'Computer Programming:C', credits: 2 },
            { code: 'ME25C04', name: 'Makerspace', credits: 1 },
            { code: 'UC25A01', name: 'Life Skills for Engineers – I*', credits: 0 },
            { code: 'UC25A02', name: 'Physical Education – I*', credits: 0 },
          ],
        },
        {
          semester: 2,
          credits: 20,
          subjects: [
            { code: 'MA25C03', name: 'Transforms and its Applications', credits: 4 },
            { code: 'UC25H02', name: 'தமிழ்நாடும் தொழில்நுட்பமும் / Tamilnadu and Technology', credits: 1 },
            { code: 'GE25C01', name: 'Basic Civil and Mechanical Engineering', credits: 3 },
            { code: 'PH25C04', name: 'Applied Physics (EE) – II', credits: 3 },
            { code: 'ME25C01', name: 'Engineering Drawing', credits: 3 },
            { code: 'EN25C02', name: 'English Essentials – II', credits: 2 },
            { code: 'CS25C04', name: 'Data Structures and Algorithms', credits: 3 },
            { code: 'ME25C05', name: 'Re-Engineering for Innovation', credits: 1 },
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
          credits: 20,
          subjects: [
            { name: 'Matrices for Engineers' },
            { name: 'Electromagnetic Theory' },
            { name: 'Digital Electronics' },
            { name: 'Electric Circuit Analysis' },
            { name: 'Electronic Devices & Circuits' },
            { name: 'Skill Development Course – I' },
            { name: 'English Communication Skills Laboratory – II' },
          ],
        },
        {
          semester: 4,
          credits: 21,
          subjects: [
            { name: 'Probability and Statistics' },
            { name: 'Power Generation, Transmission & Distribution' },
            { name: 'Control Systems' },
            { name: 'Applied Data Science' },
            { name: 'DC Machines and Transformers' },
            { name: 'Linear Integrated Circuits' },
            { name: 'Skill Development Course – II' },
            { name: 'English Communication Skills Laboratory – III' },
            { name: 'DC Machines and Transformers Laboratory' },
            { name: 'Electronics Laboratory' },
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
            { name: 'Programme Elective – I' },
            { name: 'Programme Elective – II' },
            { name: 'AC Machines' },
            { name: 'Power System Analysis' },
            { name: 'Measurements and Instrumentation' },
            { name: 'Skill Development Course – III' },
            { name: 'Industry Oriented Course – I' },
            { name: 'AC Machines Laboratory' },
            { name: 'Control and Instrumentation Laboratory' },
          ],
        },
        {
          semester: 6,
          credits: 18,
          subjects: [
            { name: 'Electrical Machine Design' },
            { name: 'Microprocessors & Microcontrollers' },
            { name: 'Power System Protection and Switch Gear' },
            { name: 'Programme Elective – III (from Emerging Technology)' },
            { name: 'Open Elective' },
            { name: 'Introduction to Standards in Electrical Engineering' },
            { name: 'Power Electronics' },
            { name: 'Industry Oriented Course – II' },
            { name: 'Self-Learning Course' },
          ],
        },
      ],
    },
    {
      year: 4,
      semesters: [
        {
          semester: 7,
          credits: 17,
          subjects: [
            { name: 'Engineering Entrepreneurship Development' },
            { name: 'Climate Change and Sustainability' },
            { name: 'High Voltage Engineering' },
            { name: 'Programme Elective – IV' },
            { name: 'Programme Elective – V' },
            { name: 'Project Management' },
            { name: 'Power System Laboratory' },
            { name: 'Summer Internship' },
          ],
        },
        {
          semester: 8,
          credits: 10,
          subjects: [
            { name: 'Project Work / Internship cum Project Work' },
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
      icon: 'Zap',
      title: 'Power Systems Engineering',
      description: 'Master power generation, transmission, distribution, grid management, smart grid technologies, and power system protection and control.',
    },
    {
      icon: 'Plug',
      title: 'Power Electronics & Drives',
      description: 'Learn advanced power electronic converters, motor drives, electric vehicle technology, and industrial automation systems.',
    },
    {
      icon: 'Sun',
      title: 'Renewable Energy Systems',
      description: 'Develop expertise in solar power, wind energy, hydroelectric systems, energy storage technologies, and microgrid design.',
    },
    {
      icon: 'Bot',
      title: 'Industrial Automation',
      description: 'Gain proficiency in PLC programming, SCADA systems, industrial robotics, process control, and factory automation.',
    },
    {
      icon: 'Battery',
      title: 'Electric Vehicles',
      description: 'Explore EV technology, battery management systems, charging infrastructure, motor control, and sustainable transportation.',
    },
    {
      icon: 'Antenna',
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
      icon: 'Zap',
      title: 'Electrical Engineer',
      description: 'Design, develop, and maintain electrical systems for power generation plants, substations, transmission networks, and industrial facilities.',
      avgSalary: '₹3.5-8 LPA',
    },
    {
      icon: 'Plug',
      title: 'Power Systems Engineer',
      description: 'Work on power system planning, operation, control, and protection. Analyze power flow, stability, and optimize grid performance.',
      avgSalary: '₹4-9 LPA',
    },
    {
      icon: 'Factory',
      title: 'Automation Engineer',
      description: 'Design and implement automation solutions using PLCs, SCADA, DCS, and robotics for manufacturing and process industries.',
      avgSalary: '₹3.5-8 LPA',
    },
    {
      icon: 'Battery',
      title: 'Power Electronics Engineer',
      description: 'Develop power electronic converters, inverters, motor drives, and control systems for renewable energy and electric vehicles.',
      avgSalary: '₹4-10 LPA',
    },
    {
      icon: 'Sun',
      title: 'Renewable Energy Engineer',
      description: 'Design and implement solar power plants, wind farms, and hybrid renewable energy systems. Work on energy storage and microgrid projects.',
      avgSalary: '₹3.5-9 LPA',
    },
    {
      icon: 'Construction',
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
      title: 'Apply Online',
      description: 'Fill out the online application form with your academic details, personal information, and upload required documents through our official admission portal.',
    },
    {
      step: 2,
      icon: 'CheckCircle',
      title: 'Document Verification',
      description: 'Submit required documents including mark sheets, certificates, and ID proof for verification. Our admission team will review and validate your documents.',
    },
    {
      step: 3,
      icon: 'GraduationCap',
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
      image: '/images/courses/be-eee/JKKN EEE - Electrical Machines Laboratory.png',
    },
    {
      name: 'Power Systems Laboratory',
      description: 'Advanced lab with power system simulation software (ETAP, PSCAD), protection relays, circuit breakers, and equipment for studying power generation, transmission, and distribution.',
      image: '/images/courses/be-eee/JKKN EEE - Power Systems Laboratory.png',
    },
    {
      name: 'Power Electronics Laboratory',
      description: 'Modern lab featuring converters, inverters, choppers, cycloconverters, motor drives, and DSP-based control systems for practical training in power electronics applications.',
      image: '/images/courses/be-eee/JKKN EEE - Electrical Machines Laboratory.png',
    },
    {
      name: 'Control Systems Laboratory',
      description: 'Equipped with PLC trainers, SCADA systems, servo motors, process control trainers, and simulation software for studying linear and nonlinear control systems.',
      image: '/images/courses/be-eee/JKKN EEE - Control Systems Laboratory.png',
    },
    {
      name: 'High Voltage Engineering Laboratory',
      description: 'Specialized lab with high voltage testing equipment, impulse generators, transformer testing setups, and insulation testing facilities for understanding HV phenomena.',
      image: '/images/courses/be-eee/JKKN EEE - High Voltage Engineering Laboratory.png',
    },
    {
      name: 'Renewable Energy Laboratory',
      description: 'Dedicated lab with solar panels, wind turbines, battery storage systems, charge controllers, and hybrid renewable energy setups for sustainable energy education.',
      image: '/images/courses/be-eee/JKKN EEE - Renewable Energy Laboratory.png',
    },
    {
      name: 'Measurements & Instrumentation Lab',
      description: 'Comprehensive lab with analog and digital measuring instruments, transducers, signal conditioning equipment, and data acquisition systems for precision measurements.',
      image: '/images/courses/be-eee/JKKN EEE - Measurements & Instrumentation Lab.png',
    },
    {
      name: 'Microprocessor & Microcontroller Lab',
      description: 'Advanced lab with 8085, 8086 microprocessor kits, 8051 microcontroller trainers, ARM processors, and embedded development tools for programming and interfacing practice.',
      image: '/images/courses/be-eee/JKKN EEE - Microprocessor & Microcontroller Laboratory.png',
    },
    {
      name: 'Project Laboratory',
      description: 'Dedicated space for final year projects and research work with access to advanced equipment, design software, fabrication facilities, and mentorship from faculty.',
      image: '/images/courses/be-eee/JKKN EEE - Project Laboratory.png',
    },
  ],

  // ==========================================
  // Faculty
  // ==========================================
  facultyTitle: 'Our Experienced Faculty',
  faculty: [
    {
      name: 'Dr. C. Kathirvel',
      designation: 'Professor & Principal',
      qualification: 'M.E., Ph.D.',
      specialization: 'Power Systems, Electrical Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Dr. M. R. Mohanraj',
      designation: 'Associate Professor & Head',
      qualification: 'M.E., Ph.D.',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. K. Aruljothi',
      designation: 'Assistant Professor',
      qualification: 'M.E. (Ph.D)',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. M. Vignesh',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Miss. M. Vaishnavi',
      designation: 'Assistant Professor',
      qualification: 'M.E. (Ph.D)',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mr. S. Vijayaprabakaran',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. R. Deepika',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. V. M. Jeevitha',
      designation: 'Assistant Professor',
      qualification: 'M.E. (Ph.D)',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. S. Sindhuja',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
    },
    {
      name: 'Mrs. M. Dharshini Devi',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
      specialization: 'Electrical & Electronics Engineering',
      image: '/images/faculty/placeholder-avatar.jpg',
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
  ctaButtonLabel: 'Apply Now for 2026-27',
  ctaButtonLink: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8',

  // ==========================================
  // Styling
  // ==========================================
  primaryColor: '#0b6d41', // JKKN Brand Green
  accentColor: '#ffde59', // JKKN Brand Gold
}

export default BE_EEE_SAMPLE_DATA
