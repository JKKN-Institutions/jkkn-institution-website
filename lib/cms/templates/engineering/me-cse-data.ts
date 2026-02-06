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
 * Accreditation: AICTE Approved | NAAC Accredited
 */

export const meCSECourseData: MECSECoursePageProps = {
  // ===========================================
  // Hero Section
  // ===========================================
  hero: {
    badge: 'AICTE Approved | NAAC Accredited',
    title: 'M.E',
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
        link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8',
        variant: 'primary'
      },
      {
        label: 'Download Brochure',
        link: '#',
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
    title: 'Why Choose M.E Computer Science and Engineering at JKKN?',
    content: [
      'The Master of Engineering (M.E) in Computer Science and Engineering at JKKN College of Engineering is a premier postgraduate program designed to develop advanced expertise in cutting-edge computing technologies. Our curriculum focuses on emerging areas such as Artificial Intelligence, Machine Learning, Data Science, Cybersecurity, Cloud Computing, and IoT.',
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
        value: '12 Seats'
      },
      {
        label: 'Affiliation',
        value: 'Anna University'
      },
      {
        label: 'Approval',
        value: 'AICTE | NAAC Accredited'
      },
  
    ],
    importantDates: [
      {
        label: 'Applications Open',
        value: 'April 2026'
      },
      {
        label: 'Last Date to Apply',
        value: 'June 30, 2026'
      },
      {
        label: 'Counselling',
        value: 'July 2026'
      },
      {
        label: 'Classes Commence',
        value: 'August 2026'
      }
    ]
  },

  // ===========================================
  // Program Highlights
  // ===========================================
  highlights: {
    label: 'Program Highlights',
    title: 'Excellence in Postgraduate Education',
    description: 'Our M.E CSE program stands out for its research focus, industry relevance, and commitment to academic excellence',
    cards: [
      {
        icon: 'award',
        number: 'NAAC',
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
        image: '/images/courses/me-cse/ai-ml-lab copy.png',
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
    description: 'Anna University affiliated M.E. Computer Science and Engineering program with industry-oriented courses and research focus',
    years: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            credits: 20,
            courses: [
              {
                code: 'MA25C07',
                name: 'Advanced Mathematical Methods (CSIE)',
                credits: 4
              },
              {
                code: 'CP25C01',
                name: 'Advanced Data Structures and Algorithms',
                credits: 3
              },
              {
                code: 'CP25C02',
                name: 'Advanced Database Technologies',
                credits: 3
              },
              {
                code: 'CP25C03',
                name: 'Advanced Operating Systems',
                credits: 3
              },
              {
                code: 'CP25C04',
                name: 'Advanced Compiler Design',
                credits: 3
              },
              {
                code: 'CP25101',
                name: 'Technical Seminar',
                credits: 2
              }
            ]
          },
          {
            semester: 2,
            credits: 20,
            courses: [
              {
                code: 'CP25201',
                name: 'Multicore Architectures',
                credits: 3
              },
              {
                code: 'CP25C05',
                name: 'Artificial Intelligence and Machine Learning',
                credits: 3
              },
              {
                code: 'CP25C06',
                name: 'Cloud and Big Data Analytics',
                credits: 3
              },
              {
                code: 'CP25C07',
                name: 'Quantum Computing',
                credits: 3
              },
              {
                code: 'CP25xxx',
                name: 'Programme Elective I',
                credits: 3
              },
              {
                code: 'CP25xxx',
                name: 'Industry Oriented Course I',
                credits: 2
              },
              {
                code: 'CP25202',
                name: 'Industrial Training',
                credits: 1
              },
              {
                code: 'CP25xxx',
                name: 'Self-Learning Course',
                credits: 2
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
                code: 'CP25xxx',
                name: 'Programme Elective II',
                credits: 3
              },
              {
                code: 'CP25xxx',
                name: 'Programme Elective III',
                credits: 3
              },
              {
                code: 'CP25xxx',
                name: 'Programme Elective IV',
                credits: 3
              },
              {
                code: 'CP25xxx',
                name: 'Open Elective',
                credits: 3
              },
              {
                code: 'CP25xxx',
                name: 'Industry-Oriented Course II',
                credits: 2
              },
              {
                code: 'CP25301',
                name: 'Project Work I',
                credits: 6
              }
            ]
          },
          {
            semester: 4,
            credits: 20,
            courses: [
              {
                code: 'CP25401',
                name: 'Project Work II',
                credits: 20
              }
            ]
          }
        ]
      }
    ],
    // syllabusImages: [
    //   {
    //     semester: 'Semester 1',
    //     image: '/images/courses/me-cse/syllabus/semester-1.jpg',
    //     alt: 'M.E. CSE Semester 1 Course Structure'
    //   },
    //   {
    //     semester: 'Semester 2',
    //     image: '/images/courses/me-cse/syllabus/semester-2.jpg',
    //     alt: 'M.E. CSE Semester 2 Course Structure'
    //   },
    //   {
    //     semester: 'Semester 3',
    //     image: '/images/courses/me-cse/syllabus/semester-3.jpg',
    //     alt: 'M.E. CSE Semester 3 Course Structure'
    //   },
    //   {
    //     semester: 'Semester 4',
    //     image: '/images/courses/me-cse/syllabus/semester-4.jpg',
    //     alt: 'M.E. CSE Semester 4 Course Structure'
    //   }
    // ]
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
        image: '/images/courses/me-cse/ai-ml-lab copy.png'
      },

      {
        name: 'Cybersecurity Lab',
        description: 'Ethical hacking tools, network security appliances, and forensic systems',
        image: '/images/courses/me-cse/cloud-computing-lab.png'
      },
      {
        name: 'Cloud Computing Lab',
        description: 'AWS, Azure, and Google Cloud platforms with virtualization infrastructure',
        image: '/images/courses/me-cse/JKKN ME CSE (1).png'
      },
     
      {
        name: 'IoT & Embedded Systems Lab',
        description: 'Sensors, microcontrollers, development boards, and smart devices',
        image: '/images/courses/me-cse/JKKN B.Tech IT - AI & Machine Learning Research Center.png'
      },
      // {
      //   name: 'High-Performance Computing Lab',
      //   description: 'Multi-core processors, parallel computing systems, and cluster computing',
      //   image: '/images/courses/me-cse/networks-security-lab.png'
      // },
      // {
      //   name: 'Project Development Lab',
      //   description: 'Collaborative workspace for final year dissertation projects',
      //   image:'/images/courses/me-cse/programming-lab.png'
      // }
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
      { name: 'LGB', logo: '/images/recruiters/lgb.png' },
      { name: 'Foxconn', logo: '/images/recruiters/foxconn.png' },
      { name: 'TVS Group', logo: '/images/recruiters/tvs-group.jpg' },
      { name: 'Sourcesys', logo: '/images/recruiters/sourcesys.png' },
      { name: 'Infinix', logo: '/images/recruiters/infinix.png' },
      { name: 'Pronoia Insurance', logo: '/images/recruiters/pronoia-insurance.jpg' }
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
        name: 'Dr. J.S. Narmadha',
        designation: 'Professor',
        qualification: 'M.E-CSE., Ph.D',
        photo: '/images/faculty/narmadha.jpg'
      },
      {
        name: 'Mrs. O. Isvarya Lakshmi',
        designation: 'Assistant Professor',
        qualification: 'M.E-CSE.',
        photo: '/images/faculty/isvarya-lakshmi.jpg'
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
        question: 'Is the program NAAC accredited?',
        answer: 'Yes, our ME CSE program is NAAC accredited and affiliated with Anna University. The program is also approved by AICTE, ensuring that it meets national quality standards and is recognized by employers and universities worldwide.'
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
        link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8',
        variant: 'primary'
      },
      {
        label: 'Talk to Counselor',
        link: 'tel:+919345855001',
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
          '+91 93458 55001',
         
        ]
      },
      {
        type: 'email',
        title: 'Email Us',
        details: [
          'engg@jkkn.ac.in',
         
          'We reply within 24 hours'
        ]
      },
      {
        type: 'address',
        title: 'Visit Us',
        details: [
          'JKKN College of Engineering and Technology',
          'Natarajapuram, NH-544 (Salem To Coimbatore National Highway), Kumarapalayam (TK), Namakkal (DT). Tamil Nadu. 638183.',
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
