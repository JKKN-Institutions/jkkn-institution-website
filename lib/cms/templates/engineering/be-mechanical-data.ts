import { BEMechanicalCoursePageProps } from '@/components/cms-blocks/content/be-mechanical-course-page'

/**
 * BE Mechanical Engineering Course Page Data Template
 *
 * This file contains all the content for the BE Mechanical Engineering course page
 * Used with BEMechanicalCoursePage component
 *
 * Institution: JKKN College of Engineering
 * Program: B.E. Mechanical Engineering
 * Duration: 4 Years (8 Semesters)
 * Accreditation: NAAC Accredited
 */

export const beMechanicalCourseData: BEMechanicalCoursePageProps = {
  // ===========================================
  // Hero Section
  // ===========================================
  heroTitle: 'BE Mechanical Engineering',
  heroSubtitle: 'Engineering excellence in mechanical systems, manufacturing, and innovation with 60+ years of academic legacy',
  affiliatedTo: 'Affiliated to Anna University | Approved by AICTE | NAAC Accredite',

  heroStats: [
    { icon: '🎓', label: 'Years Duration', value: '4' },
    { icon: '💺', label: 'Seats Available', value: '60' },
    { icon: '📈', label: 'Placement Rate', value: '95%' },
    { icon: '💰', label: 'Highest Package', value: '₹12L' },

  ],

  heroCTAs: [
    {
      label: 'Apply Now',
      link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8',
      variant: 'primary',
    },
    {
      label: 'Download Brochure',
      link: '/downloads/be-mechanical-brochure.pdf',
      variant: 'secondary',
    },
  ],

  // ===========================================
  // Course Overview
  // ===========================================
  overviewTitle: 'Program Overview',

  overviewCards: [
    {
      icon: '⏱️',
      title: 'Duration',
      value: '4 Years',
      description: '8 semesters of comprehensive mechanical engineering education with industry exposure',
    },
    {
      icon: '📋',
      title: 'Eligibility',
      value: '10+2 PCM',
      description: 'Physics, Chemistry, and Mathematics with minimum 50% aggregate marks',
    },
    {
      icon: '💼',
      title: 'Mode',
      value: 'Full-time',
      description: 'Campus-based program with hands-on laboratory sessions and industrial training',
    },
    {
      icon: '🌐',
      title: 'Medium',
      value: 'English',
      description: 'All courses taught in English with comprehensive study materials and resources',
    },
  ],

  // ===========================================
  // Why Choose Section
  // ===========================================
  whyChooseTitle: 'Why Choose Mechanical Engineering at JKKN?',

  benefits: [
    {
      icon: '📚',
      title: 'Industry-Relevant Curriculum',
      description: 'Updated syllabus aligned with current industry standards, covering traditional mechanical engineering fundamentals and emerging technologies like additive manufacturing, Industry 4.0, and sustainable energy systems.',
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Faculty',
      description: 'Learn from experienced professors with Ph.D. qualifications, extensive industry experience, and active research in areas like thermal engineering, design optimization, and advanced manufacturing technologies.',
    },
    {
      icon: '🔧',
      title: 'Hands-on Learning',
      description: 'State-of-the-art laboratories including CAD/CAM, CNC machining, thermal engineering, fluid mechanics, manufacturing processes, and robotics labs with latest equipment and software tools.',
    },
    {
      icon: '💡',
      title: 'Research Opportunities',
      description: 'Active research culture with projects funded by government agencies. Students participate in conferences, publish papers, and work on cutting-edge technologies in renewable energy, automotive systems, and smart manufacturing.',
    },
    {
      icon: '🤝',
      title: 'Industry Collaborations',
      description: 'Strong partnerships with leading automotive, aerospace, manufacturing, and energy companies. Regular industry visits, guest lectures, internships, and live projects provide real-world exposure and networking opportunities.',
    },
    {
      icon: '🎯',
      title: 'Placement Support',
      description: 'Dedicated placement cell with 95% placement record. Training in aptitude, soft skills, technical interviews, and resume building. Top recruiters include Tata Motors, Ashok Leyland, TVS, Mahindra, L&T, and MNCs.',
    },
  ],

  // ===========================================
  // Curriculum
  // ===========================================
  curriculumTitle: 'Curriculum Structure',

  curriculumYears: [
    {
      year: 1,
      semesters: [
        {
          semester: 1,
          credits: 25,
          syllabusImage: '/images/courses/be-mech/syllabus/sem1.png',
          subjects: [
            { code: 'MA25C01', name: 'Applied Calculus', credits: 4 },
            { code: 'ME25C03', name: 'Introduction to Mechanical Engineering', credits: 3 },
            { code: 'ME25C01', name: 'Engineering Drawing', credits: 4 },
            { code: 'PH25C01', name: 'Applied Physics – I', credits: 4 },
            { code: 'CY25C01', name: 'Applied Chemistry – I', credits: 4 },
            { code: 'UC25H01', name: 'தமிழர் மரபு / Heritage of Tamils', credits: 1 },
            { code: 'EN25C01', name: 'English Essentials – I', credits: 2 },
            { code: 'CS25C02', name: 'Computer Programming: Python', credits: 3 },
            { code: 'MF25C04', name: 'Makerspace', credits: 2 },
            { code: 'UC25A01', name: 'Life Skills for Engineers – I*', credits: 1 },
            { code: 'UC25A02', name: 'Physical Education – I*', credits: 1 },
          ],
        },
        {
          semester: 2,
          credits: 25,
          syllabusImage: '/images/courses/be-mech/syllabus/sem2.png',
          subjects: [
            { code: 'MA25C02', name: 'Linear Algebra', credits: 4 },
            { code: 'ME25C02', name: 'Engineering Mechanics', credits: 4 },
            { code: 'EE25C01', name: 'Basic Electrical and Electronics Engineering', credits: 4 },
            { code: 'PH25C05', name: 'Applied Physics (ME) – II', credits: 3 },
            { code: 'CY25C03', name: 'Applied Chemistry (ME) – II', credits: 3 },
            { code: 'UC25H02', name: 'தமிழ்மொழிகம் தொழிற்படுப்பும் / Tamils and Technology', credits: 1 },
            { code: 'ME25C05', name: 'Re-Engineering for Innovation', credits: 2 },
            { code: 'EN25C02', name: 'English Essentials – II', credits: 2 },
            { code: 'UC25A03', name: 'Life Skills for Engineers – II', credits: 1 },
            { code: 'UC25A04', name: 'Physical Education – II*', credits: 1 },
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
          syllabusImage: '/images/courses/be-mech/syllabus/sem3.png',
          subjects: [
            { code: '', name: 'Computational Differential Equations', credits: 4 },
            { code: '', name: 'Applied Engineering Mechanics', credits: 4 },
            { code: '', name: 'Engineering Thermodynamics', credits: 4 },
            { code: '', name: 'Strength of Materials', credits: 4 },
            { code: '', name: 'Manufacturing Processes – I', credits: 3 },
            { code: '', name: 'Embedded Systems', credits: 3 },
            { code: '', name: 'English Communication Skills Laboratory – II', credits: 1 },
            { code: '', name: 'Skill Development Course – I', credits: 1 },
          ],
        },
        {
          semester: 4,
          credits: 25,
          syllabusImage: '/images/courses/be-mech/syllabus/sem4.png',
          subjects: [
            { code: '', name: 'Applied Data Science', credits: 4 },
            { code: '', name: 'Kinematics and Dynamics of Machines', credits: 4 },
            { code: '', name: 'Fluid Mechanics & Machinery', credits: 4 },
            { code: '', name: 'Manufacturing Processes – II', credits: 3 },
            { code: '', name: 'Thermal Engineering – I', credits: 4 },
            { code: '', name: 'Power Generation Technologies', credits: 3 },
            { code: '', name: 'Standards in Mechanical Engineering', credits: 1 },
            { code: '', name: 'English Communication Skills Laboratory – III', credits: 1 },
            { code: '', name: 'Skill Development Course – II', credits: 1 },
          ],
        },
      ],
    },
    {
      year: 3,
      semesters: [
        {
          semester: 5,
          credits: 23,
          syllabusImage: '/images/courses/be-mech/syllabus/sem5.png',
          subjects: [
            { code: '', name: 'Design of Machine Elements', credits: 4 },
            { code: '', name: 'Metallurgy and Materials Science', credits: 4 },
            { code: '', name: 'Thermal Engineering – II', credits: 4 },
            { code: '', name: 'Measurements and Instrumentation', credits: 3 },
            { code: '', name: 'Programme Elective - I', credits: 3 },
            { code: '', name: 'Open Elective', credits: 3 },
            { code: '', name: 'Skill Development Course – III', credits: 1 },
            { code: '', name: 'Industry Oriented Course – I', credits: 1 },
          ],
        },
        {
          semester: 6,
          credits: 24,
          syllabusImage: '/images/courses/be-mech/syllabus/sem6.png',
          subjects: [
            { code: '', name: 'Design of Transmission Systems', credits: 4 },
            { code: '', name: 'Heat and Mass Transfer', credits: 4 },
            { code: '', name: 'FEM applications in Mechanical Engineering', credits: 3 },
            { code: '', name: 'Programme Elective - II', credits: 3 },
            { code: '', name: 'Programme Elective - III', credits: 3 },
            { code: '', name: 'Computer Aided Modelling Laboratory', credits: 2 },
            { code: '', name: 'Self-Learning Course', credits: 1 },
            { code: '', name: 'Industry Oriented Course - II', credits: 1 },
          ],
        },
      ],
    },
    {
      year: 4,
      semesters: [
        {
          semester: 7,
          credits: 20,
          syllabusImage: '/images/courses/be-mech/syllabus/sem7.png',
          subjects: [
            { code: '', name: 'Climate Change and Sustainability', credits: 3 },
            { code: '', name: 'Industrial Automation', credits: 3 },
            { code: '', name: 'Programme Elective – IV', credits: 3 },
            { code: '', name: 'Programme Elective – V', credits: 3 },
            { code: '', name: 'Project Management', credits: 3 },
            { code: '', name: 'Industrial Training', credits: 2 },
          ],
        },
        {
          semester: 8,
          credits: 15,
          syllabusImage: '/images/courses/be-mech/syllabus/sem8.png',
          subjects: [
            { code: '', name: 'Project Work / Internship cum Project Work', credits: 15 },
          ],
        },
      ],
    },
  ],

  // ===========================================
  // Specializations
  // ===========================================
  specializationsTitle: 'Specialization Tracks',

  specializations: [
    {
      icon: '🔥',
      title: 'Thermal Engineering',
      description: 'Focus on heat transfer, refrigeration and air conditioning, power plant engineering, combustion technology, and sustainable energy systems. Ideal for careers in energy sector, HVAC industry, and power generation companies.',
    },
    {
      icon: '🎨',
      title: 'Design Engineering',
      description: 'Specialize in machine design, finite element analysis, CAD/CAM/CAE tools, product development, and optimization techniques. Pursue careers in automotive design, aerospace engineering, and product development companies.',
    },
    {
      icon: '⚙️',
      title: 'Manufacturing Engineering',
      description: 'Advanced manufacturing processes, CNC machining, automation, quality control, production planning, and Industry 4.0 technologies. Opportunities in manufacturing industries, production management, and operations.',
    },
    {
      icon: '🚗',
      title: 'Automobile Engineering',
      description: 'Vehicle dynamics, engine design, automotive electronics, electric vehicles, hybrid technology, and autonomous systems. Career paths in automotive companies, EV startups, and vehicle testing facilities.',
    },
    {
      icon: '🤖',
      title: 'Robotics & Automation',
      description: 'Industrial robotics, programmable logic controllers, mechatronics, sensors and actuators, and intelligent manufacturing systems. Work in automation companies, robotics startups, and smart manufacturing units.',
    },
    {
      icon: '⚡',
      title: 'Energy Systems',
      description: 'Renewable energy technologies, solar thermal systems, wind energy, energy management, green building systems, and sustainable engineering solutions. Careers in renewable energy sector and environmental consulting.',
    },
  ],

  // ===========================================
  // Career Opportunities
  // ===========================================
  careerTitle: 'Career Opportunities',

  careerPaths: [
    {
      icon: '🎨',
      title: 'Mechanical Design Engineer',
      description: 'Design and develop mechanical systems, components, and products using advanced CAD software. Work on innovative solutions for automotive, aerospace, and industrial machinery applications.',
      avgSalary: '4-8 LPA',
    },
    {
      icon: '🏭',
      title: 'Production Engineer',
      description: 'Manage manufacturing processes, optimize production lines, implement quality control measures, and improve efficiency. Essential role in automotive, FMCG, and heavy industries.',
      avgSalary: '3.5-7 LPA',
    },
    {
      icon: '✅',
      title: 'Quality Control Engineer',
      description: 'Ensure product quality through testing, inspection, and adherence to standards. Implement quality management systems and continuous improvement methodologies in manufacturing environments.',
      avgSalary: '3-6 LPA',
    },
    {
      icon: '🚗',
      title: 'Automotive Engineer',
      description: 'Design, develop, and test vehicles and vehicle systems. Work on engine design, vehicle dynamics, safety systems, and emerging technologies like electric and autonomous vehicles.',
      avgSalary: '5-10 LPA',
    },
    {
      icon: '💻',
      title: 'CAD/CAM Engineer',
      description: 'Develop 3D models, engineering drawings, and manufacturing programs using advanced software. Bridge the gap between design and manufacturing in product development companies.',
      avgSalary: '4-8 LPA',
    },
    {
      icon: '🔧',
      title: 'Maintenance Engineer',
      description: 'Plan and execute preventive and corrective maintenance of industrial equipment. Minimize downtime, extend equipment life, and ensure smooth operations in manufacturing facilities.',
      avgSalary: '3.5-7 LPA',
    },
    {
      icon: '🔬',
      title: 'R&D Engineer',
      description: 'Conduct research, develop new technologies, and innovate products. Work in advanced technology domains like additive manufacturing, materials science, and sustainable engineering.',
      avgSalary: '5-12 LPA',
    },
    {
      icon: '💼',
      title: 'Project Manager',
      description: 'Lead engineering projects from conception to completion. Manage teams, budgets, timelines, and stakeholders in manufacturing, construction, and infrastructure projects.',
      avgSalary: '8-15 LPA',
    },
  ],

  // ===========================================
  // Top Recruiters
  // ===========================================
  recruitersTitle: 'Top Recruiters',

  recruiters: [
    'LGB',
    'Foxconn',
    'TVS Group',
    'Sourcesys',
    'Infinix',
    'Pronoia Insurance',
  ],

  // ===========================================
  // Facilities
  // ===========================================
  facilitiesTitle: 'World-Class Laboratories & Facilities',

  facilities: [
    {
      name: 'CAD/CAM/CAE Laboratory',
      image: '/images/courses/be-mech/JKKN Mech - CAD CAM CAE Laboratory.png',
      description: 'State-of-the-art computer lab equipped with AutoCAD, SolidWorks, CATIA, Mastercam, ANSYS, and other industry-standard software for design, analysis, and manufacturing simulation.',
    },
    {
      name: 'Thermal Engineering Laboratory',
      image: '/images/courses/be-mech/JKKN Mech - Thermal Engineering Laboratory.png',
      description: 'Advanced lab with multi-cylinder diesel engines, refrigeration systems, air conditioning trainers, boiler setup, and heat transfer equipment for practical thermal engineering experiments.',
    },
    {
      name: 'Fluid Mechanics Laboratory',
      image: '/images/courses/be-mech/JKKN Mech - Fluid Mechanics Laboratory.png',
      description: 'Comprehensive fluid mechanics lab featuring various pumps, turbines, flow measurement devices, pipe networks, and hydraulic machines for hands-on learning of fluid dynamics principles.',
    },
    {
      name: 'Strength of Materials Laboratory',
      image: '/images/courses/be-mech/JKKN Mech - Strength of Materials Laboratory.png',
      description: 'Well-equipped lab with universal testing machine, impact testing machine, hardness testers, torsion apparatus, and beam testing setups for material properties analysis and testing.',
    },
    {
      name: 'Manufacturing Technology Laboratory',
      image: '/images/courses/be-mech/JKKN Mech - Manufacturing Technology Laboratory.png',
      description: 'Modern manufacturing lab with CNC machines, lathe, milling, welding, casting equipment, and precision measuring instruments for practical training in various manufacturing processes.',
    },
    {
      name: 'Mechatronics and IOT Laboratory',
      image: '/images/courses/be-mech/JKKN Mech (1).png',
      description: 'Cutting-edge lab with industrial robots, PLC trainers, pneumatic and hydraulic circuits, sensors, actuators, and automation equipment for Industry 4.0 skill development.',
    },
  ],

  // ===========================================
  // Faculty
  // ===========================================
  facultyTitle: 'Our Expert Faculty',

  faculty: [
    {
      name: 'Dr. R. Sasikumar',
      designation: 'Associate Professor',
      qualification: 'Ph.D',
    },
    {
      name: 'Mr. S. RanjithKumar',
      designation: 'Assistant Professor',
      qualification: 'M.E',
    },
    {
      name: 'Mr. M. Sivashankar',
      designation: 'Assistant Professor',
      qualification: 'M.E',
    },
    {
      name: 'Mr. S. Sivabalan',
      designation: 'Assistant Professor',
      qualification: 'M.E',
    },
    {
      name: 'Mr. M. Kandasamy',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
    },
    {
      name: 'Mr. Shanmugam Ponnusamy',
      designation: 'Assistant Professor',
      qualification: 'M.E',
    },
    {
      name: 'Mr. D. Yaalarasan',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
    },
    {
      name: 'Mr. P. Jeyaprakash',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
    },
    {
      name: 'Mr. Meiyazhagan',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
    },
    {
      name: 'Mr. L. Gokula Vasan',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
    },
    {
      name: 'Mr. V. D. Janarthanan',
      designation: 'Assistant Professor',
      qualification: 'M.E.',
    },
  ],

  // ===========================================
  // Admission Process
  // ===========================================
  admissionTitle: 'Admission Process',

  admissionSteps: [
    {
      step: 1,
      title: 'Check Eligibility',
      description: 'Ensure you have passed 10+2 with Physics, Chemistry, and Mathematics with minimum 50% aggregate marks (45% for reserved categories). Age should be minimum 17 years.',
      icon: 'check',
    },
    {
      step: 2,
      title: 'Apply Online',
      description: 'Complete the online application form on our admission portal with accurate details. Upload required documents including mark sheets, transfer certificate, and community certificate if applicable.',
      icon: 'form',
    },
    {
      step: 3,
      title: 'Entrance Exam',
      description: 'Qualify in TNEA counseling (Tamil Nadu students) or appear for JEE Main / Institution entrance test. Merit-based selection for eligible candidates based on entrance exam scores.',
      icon: 'exam',
    },
    {
      step: 4,
      title: 'Counseling & Document Verification',
      description: 'Attend counseling session with original documents for verification. Receive provisional allotment letter and complete the admission formalities with fee payment.',
      icon: 'verify',
    },
    {
      step: 5,
      title: 'Admission Confirmation',
      description: 'Pay the admission fee online or at the college. Receive admission confirmation, student ID, and joining instructions. Report to college on the specified date for orientation.',
      icon: 'confirm',
    },
  ],

  // ===========================================
  // Fee Structure
  // ===========================================
  feeTitle: 'Fee Structure (Per Annum)',

  feeBreakdown: [
    {
      component: 'Tuition Fee',
      amount: '₹85,000',
    },
    {
      component: 'Development Fee',
      amount: '₹10,000',
    },
    {
      component: 'Laboratory Fee',
      amount: '₹8,000',
    },
    {
      component: 'Library Fee',
      amount: '₹3,000',
    },
    {
      component: 'Sports & Cultural Fee',
      amount: '₹2,000',
    },
    {
      component: 'Exam Fee',
      amount: '₹2,000',
    },
    {
      component: 'Total Annual Fee',
      amount: '₹1,10,000',
      isTotal: true,
    },
  ],

  // ===========================================
  // FAQs
  // ===========================================
  faqTitle: 'Frequently Asked Questions',

  faqs: [
    {
      question: 'What is the eligibility criteria for B.E. Mechanical Engineering?',
      answer: 'Candidates must have passed 10+2 examination with Physics, Chemistry, and Mathematics as core subjects with a minimum of 50% aggregate marks (45% for reserved categories). The minimum age requirement is 17 years as on December 31st of the admission year.',
    },
    {
      question: 'Is the B.E. Mechanical Engineering program NAAC accredited?',
      answer: 'Yes, our B.E. Mechanical Engineering program is accredited by the National Assessment and Accreditation Council (NAAC), ensuring that the curriculum and teaching quality meet international standards. The program is also affiliated to Anna University and approved by AICTE.',
    },
    {
      question: 'What are the career opportunities after completing this program?',
      answer: 'Graduates can work in diverse sectors including automotive, aerospace, manufacturing, energy, construction, and consulting. Job roles include Mechanical Design Engineer, Production Engineer, Quality Control Engineer, R&D Engineer, CAD/CAM Engineer, Automotive Engineer, and Project Manager. Our placement cell assists students with competitive salary packages ranging from ₹3.5 to 15 LPA.',
    },
    {
      question: 'What specializations are available in Mechanical Engineering?',
      answer: 'Students can choose from six specialization tracks: Thermal Engineering (energy systems, HVAC), Design Engineering (CAD/CAM, product development), Manufacturing Engineering (CNC, automation), Automobile Engineering (vehicle design, EVs), Robotics & Automation (industrial robotics, PLC), and Energy Systems (renewable energy, sustainability).',
    },
    {
      question: 'What kind of laboratories and facilities are available?',
      answer: 'We have state-of-the-art laboratories including CAD/CAM/CAE Lab with industry-standard software, Thermal Engineering Lab with engines and HVAC equipment, Fluid Mechanics Lab with pumps and turbines, Strength of Materials Lab with testing machines, Manufacturing Technology Lab with CNC machines, and Robotics & Automation Lab with industrial robots and PLCs.',
    },
    {
      question: 'Are there internship opportunities during the program?',
      answer: 'Yes, industrial training is a mandatory component in the 6th semester. Students undergo 4-6 weeks internship in reputed companies to gain practical industry experience. The Training and Placement Cell facilitates internship opportunities with our industry partners in automotive, manufacturing, energy, and engineering services sectors.',
    },
    {
      question: 'What is the placement record for Mechanical Engineering?',
      answer: 'Our Mechanical Engineering department consistently achieves 95% placement rate. Top recruiters include Tata Motors, Ashok Leyland, TVS, Mahindra, L&T, Hyundai, Bosch, Siemens, and other leading automotive and manufacturing companies. Average salary package is ₹5.8 LPA with highest going up to ₹24 LPA.',
    },
    {
      question: 'Is hostel facility available for students?',
      answer: 'Yes, we provide separate hostel facilities for boys and girls with modern amenities including furnished rooms, mess with nutritious food, Wi-Fi connectivity, recreation facilities, and 24/7 security. Hostel fees are separate from tuition fees and can be paid semester-wise or annually.',
    },
    {
      question: 'What research opportunities are available for students?',
      answer: 'Students can participate in faculty-guided research projects, present papers in national and international conferences, and publish in journals. The department has ongoing research in renewable energy, advanced manufacturing, automotive systems, and sustainable engineering. Final year students must complete a major project involving research or product development.',
    },
    {
      question: 'Can I pursue higher studies after B.E. Mechanical Engineering?',
      answer: 'Absolutely! Graduates can pursue M.E./M.Tech in specialized areas like Thermal Engineering, Manufacturing, CAD/CAM, Automobile Engineering, Energy Engineering, or pursue MBA for management roles. Many students also prepare for competitive exams like GATE, GRE for higher studies in India or abroad. Our faculty provides guidance for higher education pathways.',
    },
  ],

  // ===========================================
  // Placement Statistics
  // ===========================================
  placementStatsTitle: 'Placement Statistics 2023-24',

  placementStats: [
    {
      icon: '📈',
      label: 'Placement Rate',
      value: '95.2%',
      description: 'Students placed in reputed companies',
    },
    {
      icon: '💰',
      label: 'Average Package',
      value: '₹5.8 LPA',
      description: 'Competitive salary packages',
    },
    {
      icon: '🏆',
      label: 'Highest Package',
      value: '₹24 LPA',
      description: 'Offered by leading MNC',
    },
    {
      icon: '🏢',
      label: 'Top Recruiters',
      value: '75+',
      description: 'Companies participated',
    },
  ],

  // ===========================================
  // MOUs
  // ===========================================
  mousTitle: 'Memorandums of Understanding (MOUs)',

  mous: [
    {
      sno: 1,
      industryName: 'ABR Engineering Company',
      address: '1/351 A, Kunnathur village, Kunnathur-post, SS Kulam via, Coimbatore, 641107.',
      duration: '31st of March, 2023\nto\n31st March, 2033',
    },
    {
      sno: 2,
      industryName: 'DSR Industries',
      address: '1/351 A, Kunnathur village, Kunnathur-post, SS Kulam via, Coimbatore, 641107.',
      duration: '31st of March, 2023\nto\n31st March, 2033',
    },
  ],

  // ===========================================
  // Final CTA
  // ===========================================
  ctaTitle: 'Ready to Start Your Engineering Journey?',
  ctaDescription: 'Join JKKN College of Engineering and build a successful career in Mechanical Engineering with industry-relevant skills and world-class education.',
  ctaButtonLabel: 'Apply Now',
  ctaButtonLink: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8',

  // ===========================================
  // Styling
  // ===========================================
  primaryColor: '#0b6d41',
  accentColor: '#0b6d41', // Using brand green instead of orange
}
