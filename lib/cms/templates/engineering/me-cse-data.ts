import { MECSECoursePageProps } from '@/components/cms-blocks/content/me-cse-course-page'

/**
 * ME CSE Course Page Data Template
 *
 * This file contains all the content for the ME Computer Science and Engineering course page
 * Used with MECSECoursePage component
 *
 * Institution: JKKN College of Engineering
 * Program: M.E. Computer Science and Engineering
 * Duration: 2 Years (4 Semesters)
 * Accreditation: AICTE Approved | NBA Accredited
 */

export const meCSECourseData: MECSECoursePageProps = {
  // ===========================================
  // Hero Section
  // ===========================================
  hero: {
    badge: 'AICTE Approved | NBA Accredited',
    title: 'Master of Engineering in',
    highlightedText: 'Computer Science & Engineering',
    subtitle: 'Elevate your career with cutting-edge expertise in AI, Machine Learning, Data Science, and advanced computing technologies. Join our research-oriented postgraduate program designed for innovation and industry leadership.',
    features: [
      {
        icon: 'calendar',
        text: '2-Year Program'
      },
      {
        icon: 'university',
        text: 'Anna University Affiliated'
      },
      {
        icon: 'clock',
        text: 'Full-Time Mode'
      },
      {
        icon: 'users',
        text: 'Expert Learning Facilitators'
      }
    ],
    ctaButtons: [
      {
        label: 'Apply Now',
        link: '/admissions/apply',
        variant: 'primary'
      },
      {
        label: 'Download Brochure',
        link: '#curriculum',
        variant: 'secondary'
      }
    ],
    image: '/images/courses/me-cse/hero-image.jpg',
    stats: [
      {
        number: '95%',
        label: 'Placement Rate'
      },
      {
        number: '₹12L',
        label: 'Avg. Package'
      },
      {
        number: '50+',
        label: 'Recruiters'
      }
    ]
  },

  // ===========================================
  // Program Overview Section
  // ===========================================
  overview: {
    label: 'Program Overview',
    title: 'Why Choose ME Computer Science and Engineering at JKKN?',
    content: [
      'The Master of Engineering (M.E.) in Computer Science and Engineering at JKKN College of Engineering is a premier postgraduate program designed to develop advanced expertise in cutting-edge computing technologies. Our curriculum focuses on emerging areas such as Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, Cloud Computing, and IoT.',
      'With a perfect blend of theoretical knowledge and practical research, our program prepares students for leadership roles in technology organizations, research institutions, and academia. Students work on real-world projects, publish research papers in international journals, and collaborate with industry partners on innovative solutions.',
      'Our state-of-the-art laboratories, experienced faculty with PhD qualifications, and strong industry connections ensure that graduates are well-equipped to tackle complex technological challenges and drive innovation in their respective domains.',
      'The program emphasizes research methodology, advanced problem-solving skills, and independent thinking, making it ideal for aspiring researchers, technology leaders, and innovators who want to make a significant impact in the field of computer science and engineering.'
    ],
    quickFacts: [
      {
        label: 'Duration',
        value: '2 Years (4 Semesters)'
      },
      {
        label: 'Mode',
        value: 'Full-Time'
      },
      {
        label: 'Intake',
        value: '18 Seats'
      },
      {
        label: 'Affiliation',
        value: 'Anna University'
      },
      {
        label: 'Approval',
        value: 'AICTE | NBA Accredited'
      },
      {
        label: 'Fee Structure',
        value: '₹75,000 per year'
      }
    ],
    importantDates: [
      {
        label: 'Applications Open',
        value: 'April 2024'
      },
      {
        label: 'Last Date to Apply',
        value: 'June 30, 2024'
      },
      {
        label: 'Counselling',
        value: 'July 2024'
      },
      {
        label: 'Classes Commence',
        value: 'August 2024'
      }
    ]
  },

  // ===========================================
  // Program Highlights
  // ===========================================
  highlights: {
    label: 'Program Highlights',
    title: 'Excellence in Postgraduate Education',
    description: 'Our ME CSE program stands out for its research focus, industry relevance, and commitment to academic excellence',
    cards: [
      {
        icon: 'award',
        number: 'NBA',
        label: 'Accreditation'
      },
      {
        icon: 'graduationCap',
        number: '15+',
        label: 'PhD Faculty'
      },
      {
        icon: 'testTube',
        number: '8+',
        label: 'Research Labs'
      },
      {
        icon: 'trophy',
        number: '95%',
        label: 'Placement'
      },
      {
        icon: 'indianRupee',
        number: '₹24L',
        label: 'Highest Package'
      },
      {
        icon: 'bookMarked',
        number: '100+',
        label: 'Publications'
      }
    ]
  },

  // ===========================================
  // Specializations
  // ===========================================
  specializations: {
    label: 'Specializations',
    title: 'Choose Your Domain of Expertise',
    description: 'Specialize in cutting-edge areas and become an expert in your chosen field',
    items: [
      {
        title: 'Artificial Intelligence & Machine Learning',
        badge: 'Most Popular',
        description: 'Deep dive into neural networks, deep learning, natural language processing, and computer vision. Work on AI-powered applications and intelligent systems.',
        image: '/images/courses/me-cse/ai-ml.jpg',
        topics: [
          'Deep Learning',
          'Neural Networks',
          'NLP',
          'Computer Vision',
          'Reinforcement Learning',
          'AI Ethics'
        ]
      },
      {
        title: 'Data Science & Big Data Analytics',
        badge: 'High Demand',
        description: 'Master data mining, predictive analytics, big data frameworks, and visualization techniques. Transform data into actionable insights.',
        image: '/images/courses/me-cse/data-science.jpg',
        topics: [
          'Hadoop',
          'Spark',
          'Data Mining',
          'Predictive Analytics',
          'Data Visualization',
          'Statistical Modeling'
        ]
      },
      {
        title: 'Cybersecurity & Network Security',
        badge: 'Industry Critical',
        description: 'Learn ethical hacking, cryptography, network defense, and security protocols. Protect systems from cyber threats and vulnerabilities.',
        image: '/images/courses/me-cse/cybersecurity.jpg',
        topics: [
          'Ethical Hacking',
          'Cryptography',
          'Network Security',
          'Security Protocols',
          'Penetration Testing',
          'Forensics'
        ]
      },
      {
        title: 'Cloud Computing & Distributed Systems',
        badge: 'Future Ready',
        description: 'Explore cloud architectures, distributed computing, virtualization, and containerization. Build scalable cloud-native applications.',
        image: '/images/courses/me-cse/cloud-computing.jpg',
        topics: [
          'AWS',
          'Azure',
          'Docker',
          'Kubernetes',
          'Microservices',
          'Serverless'
        ]
      },
      {
        title: 'Computer Vision & Image Processing',
        badge: 'Emerging Tech',
        description: 'Master image analysis, object detection, facial recognition, and video analytics. Apply vision technology to real-world problems.',
        image: '/images/courses/me-cse/computer-vision.jpg',
        topics: [
          'Image Processing',
          'Object Detection',
          'Facial Recognition',
          'Video Analytics',
          'OpenCV',
          'Pattern Recognition'
        ]
      },
      {
        title: 'Internet of Things & Embedded Systems',
        badge: 'Innovation Hub',
        description: 'Design smart devices, sensor networks, and embedded applications. Create connected systems for automation and monitoring.',
        image: '/images/courses/me-cse/iot.jpg',
        topics: [
          'Sensor Networks',
          'Embedded Systems',
          'Smart Devices',
          'MQTT',
          'Edge Computing',
          'Industrial IoT'
        ]
      }
    ]
  },

  // ===========================================
  // Curriculum
  // ===========================================
  curriculum: {
    label: 'Curriculum',
    title: 'Comprehensive 2-Year Curriculum',
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            credits: 20,
            courses: [
              {
                code: 'MA7155',
                name: 'Advanced Data Structures and Algorithms',
                credits: 4
              },
              {
                code: 'CS7101',
                name: 'Machine Learning Techniques',
                credits: 3
              },
              {
                code: 'CS7102',
                name: 'Cloud Computing Architecture',
                credits: 3
              },
              {
                code: 'CS7103',
                name: 'Advanced Database Management Systems',
                credits: 3
              },
              {
                code: 'CS7001',
                name: 'Research Methodology and IPR',
                credits: 3
              },
              {
                code: 'CS7111',
                name: 'Advanced Algorithms Lab',
                credits: 2
              },
              {
                code: 'CS7112',
                name: 'Machine Learning Lab',
                credits: 2
              }
            ]
          },
          {
            semester: 2,
            credits: 20,
            courses: [
              {
                code: 'CS7201',
                name: 'Artificial Intelligence and Expert Systems',
                credits: 3
              },
              {
                code: 'CS7202',
                name: 'Big Data Analytics',
                credits: 3
              },
              {
                code: 'CS7203',
                name: 'Advanced Computer Networks',
                credits: 3
              },
              {
                code: 'CS7204',
                name: 'Elective I - Specialization Course',
                credits: 3
              },
              {
                code: 'CS7205',
                name: 'Elective II - Specialization Course',
                credits: 3
              },
              {
                code: 'CS7211',
                name: 'AI and Big Data Lab',
                credits: 2
              },
              {
                code: 'CS7212',
                name: 'Mini Project',
                credits: 3
              }
            ]
          }
        ]
      },
      {
        year: 2,
        semesters: [
          {
            semester: 3,
            credits: 20,
            courses: [
              {
                code: 'CS7301',
                name: 'Deep Learning and Neural Networks',
                credits: 3
              },
              {
                code: 'CS7302',
                name: 'Cybersecurity and Cryptography',
                credits: 3
              },
              {
                code: 'CS7303',
                name: 'Elective III - Advanced Specialization',
                credits: 3
              },
              {
                code: 'CS7304',
                name: 'Elective IV - Advanced Specialization',
                credits: 3
              },
              {
                code: 'CS7311',
                name: 'Deep Learning Lab',
                credits: 2
              },
              {
                code: 'CS7312',
                name: 'Project Work - Phase I',
                credits: 6
              }
            ]
          },
          {
            semester: 4,
            credits: 20,
            courses: [
              {
                code: 'CS7401',
                name: 'Project Work - Phase II (Dissertation)',
                credits: 16
              },
              {
                code: 'CS7402',
                name: 'Comprehensive Viva Voce',
                credits: 2
              },
              {
                code: 'CS7403',
                name: 'Research Paper Publication',
                credits: 2
              }
            ]
          }
        ]
      }
    ]
  },

  // ===========================================
  // Eligibility & Admission
  // ===========================================
  eligibility: {
    label: 'Eligibility',
    title: 'Admission Requirements & Process',
    academicRequirements: [
      'BE/B.Tech in Computer Science, Information Technology, Electronics, or related branches',
      'Minimum 50% aggregate marks (45% for SC/ST candidates)',
      'Valid TANCET score or GATE qualification (preferred but not mandatory)',
      'Candidates with relevant work experience will be given preference',
      'Final year students can apply (admission subject to completion)'
    ],
    admissionProcess: [
      'Submit online application with academic transcripts and certificates',
      'Appear for entrance exam (TANCET) or submit GATE scorecard',
      'Attend counselling session (online or offline)',
      'Document verification and seat confirmation',
      'Complete admission formalities and fee payment'
    ]
  },

  // ===========================================
  // Labs & Infrastructure
  // ===========================================
  infrastructure: {
    label: 'Infrastructure',
    title: 'State-of-the-Art Research Facilities',
    labs: [
      {
        name: 'AI & Machine Learning Lab',
        description: 'High-performance computing systems with GPU clusters for deep learning research',
        image: '/images/courses/me-cse/labs/ai-ml-lab.jpg'
      },
      {
        name: 'Data Science Lab',
        description: 'Big data frameworks, analytics tools, and visualization software',
        image: '/images/courses/me-cse/labs/data-science-lab.jpg'
      },
      {
        name: 'Cybersecurity Lab',
        description: 'Ethical hacking tools, network security appliances, and forensic systems',
        image: '/images/courses/me-cse/labs/cybersecurity-lab.jpg'
      },
      {
        name: 'Cloud Computing Lab',
        description: 'AWS, Azure, and Google Cloud platforms with virtualization infrastructure',
        image: '/images/courses/me-cse/labs/cloud-lab.jpg'
      },
      {
        name: 'Research & Development Lab',
        description: 'Dedicated space for postgraduate research projects and innovation',
        image: '/images/courses/me-cse/labs/research-lab.jpg'
      },
      {
        name: 'IoT & Embedded Systems Lab',
        description: 'Sensors, microcontrollers, development boards, and smart devices',
        image: '/images/courses/me-cse/labs/iot-lab.jpg'
      },
      {
        name: 'High-Performance Computing Lab',
        description: 'Multi-core processors, parallel computing systems, and cluster computing',
        image: '/images/courses/me-cse/labs/hpc-lab.jpg'
      },
      {
        name: 'Project Development Lab',
        description: 'Collaborative workspace for final year dissertation projects',
        image: '/images/courses/me-cse/labs/project-lab.jpg'
      }
    ]
  },

  // ===========================================
  // Placement & Recruiters
  // ===========================================
  placement: {
    label: 'Placements',
    title: 'Outstanding Placement Record',
    stats: [
      {
        number: '95%',
        label: 'Placement Rate'
      },
      {
        number: '₹12L',
        label: 'Average Package'
      },
      {
        number: '₹24L',
        label: 'Highest Package'
      },
      {
        number: '50+',
        label: 'Top Recruiters'
      }
    ],
    recruiters: [
      { name: 'TCS', logo: '/images/recruiters/tcs.png' },
      { name: 'Infosys', logo: '/images/recruiters/infosys.png' },
      { name: 'Wipro', logo: '/images/recruiters/wipro.png' },
      { name: 'Cognizant', logo: '/images/recruiters/cognizant.png' },
      { name: 'Amazon', logo: '/images/recruiters/amazon.png' },
      { name: 'Microsoft', logo: '/images/recruiters/microsoft.png' },
      { name: 'Google', logo: '/images/recruiters/google.png' },
      { name: 'IBM', logo: '/images/recruiters/ibm.png' },
      { name: 'Oracle', logo: '/images/recruiters/oracle.png' },
      { name: 'Accenture', logo: '/images/recruiters/accenture.png' },
      { name: 'Capgemini', logo: '/images/recruiters/capgemini.png' },
      { name: 'HCL Technologies', logo: '/images/recruiters/hcl.png' },
      { name: 'Tech Mahindra', logo: '/images/recruiters/tech-mahindra.png' },
      { name: 'L&T Infotech', logo: '/images/recruiters/lti.png' },
      { name: 'Mindtree', logo: '/images/recruiters/mindtree.png' },
      { name: 'Adobe', logo: '/images/recruiters/adobe.png' },
      { name: 'Cisco', logo: '/images/recruiters/cisco.png' },
      { name: 'Dell', logo: '/images/recruiters/dell.png' }
    ]
  },

  // ===========================================
  // Faculty
  // ===========================================
  faculty: {
    label: 'Faculty',
    title: 'Learn from Industry Experts',
    members: [
      {
        name: 'Dr. Rajesh Kumar',
        designation: 'Professor & Head',
        qualification: 'PhD in Artificial Intelligence',
        photo: '/images/faculty/rajesh-kumar.jpg'
      },
      {
        name: 'Dr. Priya Sharma',
        designation: 'Associate Professor',
        qualification: 'PhD in Machine Learning',
        photo: '/images/faculty/priya-sharma.jpg'
      },
      {
        name: 'Dr. Arun Patel',
        designation: 'Associate Professor',
        qualification: 'PhD in Data Science',
        photo: '/images/faculty/arun-patel.jpg'
      },
      {
        name: 'Dr. Meera Reddy',
        designation: 'Assistant Professor',
        qualification: 'PhD in Cybersecurity',
        photo: '/images/faculty/meera-reddy.jpg'
      },
      {
        name: 'Dr. Vikram Singh',
        designation: 'Assistant Professor',
        qualification: 'PhD in Cloud Computing',
        photo: '/images/faculty/vikram-singh.jpg'
      },
      {
        name: 'Dr. Kavitha Nair',
        designation: 'Assistant Professor',
        qualification: 'PhD in Computer Vision',
        photo: '/images/faculty/kavitha-nair.jpg'
      },
      {
        name: 'Dr. Suresh Iyer',
        designation: 'Assistant Professor',
        qualification: 'PhD in IoT Systems',
        photo: '/images/faculty/suresh-iyer.jpg'
      },
      {
        name: 'Dr. Anita Desai',
        designation: 'Assistant Professor',
        qualification: 'PhD in Database Systems',
        photo: '/images/faculty/anita-desai.jpg'
      }
    ]
  },

  // ===========================================
  // FAQs
  // ===========================================
  faqs: {
    label: 'FAQs',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about our ME CSE program',
    items: [
      {
        question: 'What is the eligibility criteria for ME CSE admission?',
        answer: 'Candidates must have a BE/B.Tech degree in Computer Science, IT, Electronics, or related branches with a minimum of 50% aggregate marks (45% for SC/ST). TANCET or GATE score is preferred but not mandatory. Final year students can also apply.'
      },
      {
        question: 'What specializations are offered in the ME CSE program?',
        answer: 'We offer six specializations: AI & Machine Learning, Data Science & Big Data Analytics, Cybersecurity & Network Security, Cloud Computing & Distributed Systems, Computer Vision & Image Processing, and IoT & Embedded Systems. Students choose their specialization through elective courses.'
      },
      {
        question: 'What is the fee structure for the ME CSE program?',
        answer: 'The annual tuition fee is ₹75,000, making the total program fee ₹1,50,000 for two years. This includes lab fees, library access, and examination fees. Scholarships and financial aid are available for eligible students.'
      },
      {
        question: 'What is the placement record for ME CSE graduates?',
        answer: 'Our ME CSE program has an excellent placement record of 95%. The average package is ₹12 LPA, with the highest package reaching ₹24 LPA. Top recruiters include TCS, Infosys, Amazon, Microsoft, Google, and many other leading technology companies.'
      },
      {
        question: 'Is the program NBA accredited?',
        answer: 'Yes, our ME CSE program is NBA accredited and affiliated with Anna University. The program is also approved by AICTE, ensuring that it meets national quality standards and is recognized by employers and universities worldwide.'
      },
      {
        question: 'Are there research opportunities in the program?',
        answer: 'Absolutely! Research is a core component of our ME program. Students work on cutting-edge research projects, publish papers in international journals and conferences, and collaborate with industry partners. We have eight specialized research labs and experienced PhD faculty to guide students.'
      },
      {
        question: 'Is hostel accommodation available?',
        answer: 'Yes, we provide separate hostel facilities for boys and girls with modern amenities including Wi-Fi, recreational facilities, mess, and 24/7 security. Hostel accommodation is subject to availability and requires separate application.'
      },
      {
        question: 'Can I pursue PhD after completing ME CSE?',
        answer: 'Yes, ME CSE graduates are eligible to pursue PhD programs in computer science and related fields. Our program provides excellent preparation for doctoral research, and many of our alumni have successfully enrolled in PhD programs at prestigious universities in India and abroad.'
      }
    ]
  },

  // ===========================================
  // CTA Section
  // ===========================================
  cta: {
    title: 'Ready to Advance Your Career?',
    description: 'Join our ME CSE program and become a leader in cutting-edge technology. Limited seats available!',
    buttons: [
      {
        label: 'Apply Online',
        link: '/admissions/apply',
        variant: 'primary'
      },
      {
        label: 'Request Callback',
        link: '/contact',
        variant: 'secondary'
      }
    ]
  },

  // ===========================================
  // Contact Section
  // ===========================================
  contact: {
    label: 'Get in Touch',
    title: 'Have Questions? Contact Us',
    description: 'Our admissions team is here to help you with any queries about the ME CSE program',
    info: [
      {
        type: 'phone',
        title: 'Call Us',
        details: [
          '+91 4288 274741',
          '+91 4288 274742',
          'Mon - Sat: 9:00 AM - 5:00 PM'
        ]
      },
      {
        type: 'email',
        title: 'Email Us',
        details: [
          'admissions@jkkn.ac.in',
          'pgadmissions@jkkn.ac.in',
          'We reply within 24 hours'
        ]
      },
      {
        type: 'address',
        title: 'Visit Us',
        details: [
          'JKKN College of Engineering',
          'Komarapalayam - 638183',
          'Namakkal District, Tamil Nadu'
        ]
      }
    ]
  },

  // ===========================================
  // Color Theme
  // ===========================================
  colors: {
    primaryColor: '#0b6d41', // JKKN Green (Dark)
    accentColor: '#0f8f56'   // JKKN Green (Light)
  }
}
