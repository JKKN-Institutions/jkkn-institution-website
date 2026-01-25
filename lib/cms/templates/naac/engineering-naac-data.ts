import type { NAACPageProps } from './types'

/**
 * Engineering College NAAC Data
 *
 * NAAC accreditation content specific to JKKN College of Engineering
 */

export const ENGINEERING_NAAC_DATA: NAACPageProps = {
  heroTitle: 'NAAC Accreditation',
  heroSubtitle: 'JKKN College of Engineering',
  heroDescription:
    'Committed to academic excellence and quality engineering education through rigorous assessment and continuous improvement.',

  navigationSections: [
    {
      id: 'overview',
      label: 'IIQA',
      description: 'Institutional Information for Quality Assessment',
    },
    {
      id: 'criterion-1',
      label: 'Criterion I',
      description: 'Curricular Aspects',
    },
    {
      id: 'criterion-2',
      label: 'Criterion II',
      description: 'Teaching-Learning and Evaluation',
    },
    {
      id: 'criterion-3',
      label: 'Criterion III',
      description: 'Research, Innovations and Extension',
    },
    {
      id: 'criterion-4',
      label: 'Criterion IV',
      description: 'Infrastructure and Learning Resources',
    },
    {
      id: 'criterion-5',
      label: 'Criterion V',
      description: 'Student Support and Progression',
    },
    {
      id: 'criterion-6',
      label: 'Criterion VI',
      description: 'Governance, Leadership and Management',
    },
    {
      id: 'criterion-7',
      label: 'Criterion VII',
      description: 'Institutional Values and Best Practices',
    },
    {
      id: 'best-practices',
      label: 'Best Practices',
      description: 'Unique Institutional Practices',
    },
    {
      id: 'distinctiveness',
      label: 'Institutional Distinctiveness',
      description: 'Distinctive Features and Strengths',
    },
    {
      id: 'feedback',
      label: 'Feedback',
      description: 'Stakeholder Feedback Analysis',
    },
    {
      id: 'dvv',
      label: 'DVV',
      description: 'Data Validation and Verification',
    },
    {
      id: 'ssr',
      label: 'SSR CYCLE-1',
      description: 'Self Study Report',
    },
  ],

  contentSections: [
    {
      id: 'overview',
      heading: 'Institutional Information for Quality Assessment (IIQA)',
      overview:
        'Comprehensive institutional information for JKKN College of Engineering covering academic programs, faculty strength, infrastructure facilities, research initiatives, and student support services as part of NAAC quality assessment.',
      documents: [
        {
          title: 'IIQA Report 2024 - Engineering College',
          description: 'Complete institutional information for quality assessment',
          fileUrl: '/documents/naac/engineering/iiqa-report-2024.pdf',
          fileType: 'pdf',
          size: '4.5 MB',
          uploadDate: '2024-01-15',
        },
        {
          title: 'Engineering Programs Overview',
          description: 'Details of all engineering programs and specializations',
          fileUrl: '/documents/naac/engineering/programs-overview.pdf',
          fileType: 'pdf',
          size: '2.1 MB',
          uploadDate: '2024-01-15',
        },
      ],
      metrics: [
        { label: 'Engineering Students', value: '3,200+' },
        { label: 'Faculty Members', value: '180+' },
        { label: 'Engineering Programs', value: '8' },
        { label: 'Research Labs', value: '45+' },
      ],
    },
    {
      id: 'criterion-1',
      heading: 'Criterion I: Curricular Aspects',
      overview:
        'Engineering curriculum aligned with AICTE guidelines, NBA accreditation requirements, and industry expectations. Focus on outcome-based education, choice-based credit system, and industry-integrated learning.',
      documents: [
        {
          title: 'Engineering Curriculum Framework',
          description: 'AICTE-compliant curriculum design and implementation',
          fileUrl: '/documents/naac/engineering/curriculum-framework.pdf',
          fileType: 'pdf',
          size: '3.8 MB',
          uploadDate: '2024-02-01',
        },
        {
          title: 'Choice Based Credit System (CBCS)',
          description: 'CBCS implementation and elective courses',
          fileUrl: '/documents/naac/engineering/cbcs-implementation.pdf',
          fileType: 'pdf',
          size: '2.6 MB',
          uploadDate: '2024-02-01',
        },
        {
          title: 'Industry-Integrated Curriculum',
          description: 'Industry collaboration in curriculum development',
          fileUrl: '/documents/naac/engineering/industry-curriculum.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-02-05',
        },
      ],
    },
    {
      id: 'criterion-2',
      heading: 'Criterion II: Teaching-Learning and Evaluation',
      overview:
        'Student-centric teaching-learning methodologies with focus on experiential learning, project-based learning, and continuous assessment. Faculty development programs ensure quality pedagogy.',
      documents: [
        {
          title: 'Teaching-Learning Practices',
          description: 'Innovative pedagogical methods and ICT integration',
          fileUrl: '/documents/naac/engineering/teaching-practices.pdf',
          fileType: 'pdf',
          size: '4.1 MB',
          uploadDate: '2024-03-01',
        },
        {
          title: 'Faculty Development Initiatives',
          description: 'FDPs, workshops, and professional development',
          fileUrl: '/documents/naac/engineering/faculty-development.pdf',
          fileType: 'pdf',
          size: '3.2 MB',
          uploadDate: '2024-03-05',
        },
      ],
    },
    {
      id: 'criterion-3',
      heading: 'Criterion III: Research, Innovations and Extension',
      overview:
        'Strong research culture with focus on innovation, patents, publications, and industry-sponsored projects. Active participation in community extension activities and social outreach programs.',
      documents: [
        {
          title: 'Research Publications Report',
          description: 'Scopus, Web of Science, and peer-reviewed publications',
          fileUrl: '/documents/naac/engineering/research-publications.pdf',
          fileType: 'pdf',
          size: '5.4 MB',
          uploadDate: '2024-04-01',
        },
        {
          title: 'Patents and Innovations',
          description: 'Patents filed, granted, and innovation projects',
          fileUrl: '/documents/naac/engineering/patents-innovations.pdf',
          fileType: 'pdf',
          size: '3.6 MB',
          uploadDate: '2024-04-05',
        },
        {
          title: 'Industry-Sponsored Projects',
          description: 'Consultancy and sponsored research projects',
          fileUrl: '/documents/naac/engineering/industry-projects.pdf',
          fileType: 'pdf',
          size: '2.8 MB',
          uploadDate: '2024-04-10',
        },
      ],
    },
    {
      id: 'criterion-4',
      heading: 'Criterion IV: Infrastructure and Learning Resources',
      overview:
        'State-of-the-art engineering laboratories, modern workshops, advanced computing facilities, and comprehensive library resources supporting academic and research activities.',
      documents: [
        {
          title: 'Engineering Laboratories Report',
          description: 'Details of 45+ specialized engineering labs',
          fileUrl: '/documents/naac/engineering/laboratories.pdf',
          fileType: 'pdf',
          size: '6.2 MB',
          uploadDate: '2024-05-01',
        },
        {
          title: 'Computing Infrastructure',
          description: 'High-performance computing and network facilities',
          fileUrl: '/documents/naac/engineering/computing-infrastructure.pdf',
          fileType: 'pdf',
          size: '3.9 MB',
          uploadDate: '2024-05-05',
        },
      ],
    },
    {
      id: 'criterion-5',
      heading: 'Criterion V: Student Support and Progression',
      overview:
        'Comprehensive student support through training and placement cell, career counseling, skill development programs, and strong industry partnerships ensuring excellent placement outcomes.',
      documents: [
        {
          title: 'Placement Statistics Report',
          description: 'Year-wise placement data and recruiting companies',
          fileUrl: '/documents/naac/engineering/placement-statistics.pdf',
          fileType: 'pdf',
          size: '3.7 MB',
          uploadDate: '2024-06-01',
        },
        {
          title: 'Skill Development Programs',
          description: 'Technical training and certification programs',
          fileUrl: '/documents/naac/engineering/skill-development.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-06-05',
        },
        {
          title: 'Alumni Achievements',
          description: 'Notable alumni and their contributions',
          fileUrl: '/documents/naac/engineering/alumni-achievements.pdf',
          fileType: 'pdf',
          size: '3.1 MB',
          uploadDate: '2024-06-10',
        },
      ],
    },
    {
      id: 'criterion-6',
      heading: 'Criterion VI: Governance, Leadership and Management',
      overview:
        'Effective governance structure with participatory management, transparent financial practices, and robust internal quality assurance mechanisms through active IQAC.',
      documents: [
        {
          title: 'Governance Structure',
          description: 'Organizational structure and decision-making process',
          fileUrl: '/documents/naac/engineering/governance-structure.pdf',
          fileType: 'pdf',
          size: '2.5 MB',
          uploadDate: '2024-07-01',
        },
        {
          title: 'IQAC Annual Report 2023-24',
          description: 'Quality initiatives and improvement measures',
          fileUrl: '/documents/naac/engineering/iqac-annual-report.pdf',
          fileType: 'pdf',
          size: '4.3 MB',
          uploadDate: '2024-07-05',
        },
      ],
    },
    {
      id: 'criterion-7',
      heading: 'Criterion VII: Institutional Values and Best Practices',
      overview:
        'Commitment to sustainability through green campus initiatives, solar energy systems, rainwater harvesting, and comprehensive waste management. Strong focus on gender equity and inclusivity.',
      documents: [
        {
          title: 'Green Campus Initiatives',
          description: 'Environmental sustainability and carbon neutrality',
          fileUrl: '/documents/naac/engineering/green-campus.pdf',
          fileType: 'pdf',
          size: '5.1 MB',
          uploadDate: '2024-08-01',
        },
        {
          title: 'Energy Audit Report',
          description: 'Solar power generation and energy conservation',
          fileUrl: '/documents/naac/engineering/energy-audit.pdf',
          fileType: 'pdf',
          size: '2.8 MB',
          uploadDate: '2024-08-05',
        },
      ],
    },
    {
      id: 'best-practices',
      heading: 'Best Practices',
      overview:
        'Innovative practices in engineering education including industry mentorship program, hackathon culture, innovation labs, and entrepreneurship development initiatives.',
      documents: [
        {
          title: 'Industry Mentorship Program',
          description: 'Structured mentorship by industry professionals',
          fileUrl: '/documents/naac/engineering/mentorship-program.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-09-01',
        },
        {
          title: 'Innovation and Entrepreneurship Cell',
          description: 'Startup incubation and entrepreneurship support',
          fileUrl: '/documents/naac/engineering/innovation-cell.pdf',
          fileType: 'pdf',
          size: '3.4 MB',
          uploadDate: '2024-09-01',
        },
      ],
    },
    {
      id: 'distinctiveness',
      heading: 'Institutional Distinctiveness',
      overview:
        'Distinguished by strong industry partnerships, focus on emerging technologies (AI, IoT, Robotics), active student innovation projects, and excellent placement record with top recruiters.',
      documents: [
        {
          title: 'Institutional Distinctiveness Report',
          description: 'Unique features of engineering college',
          fileUrl: '/documents/naac/engineering/distinctiveness.pdf',
          fileType: 'pdf',
          size: '4.2 MB',
          uploadDate: '2024-09-10',
        },
      ],
    },
    {
      id: 'feedback',
      heading: 'Stakeholder Feedback Analysis',
      overview:
        'Systematic collection and analysis of feedback from students, alumni, employers, and parents to drive continuous improvement in academic and administrative processes.',
      documents: [
        {
          title: 'Student Feedback Analysis',
          description: 'Course-wise and faculty-wise feedback analysis',
          fileUrl: '/documents/naac/engineering/student-feedback.pdf',
          fileType: 'pdf',
          size: '3.1 MB',
          uploadDate: '2024-10-01',
        },
        {
          title: 'Employer Feedback Report',
          description: 'Industry feedback on graduate competencies',
          fileUrl: '/documents/naac/engineering/employer-feedback.pdf',
          fileType: 'pdf',
          size: '2.3 MB',
          uploadDate: '2024-10-05',
        },
      ],
    },
    {
      id: 'dvv',
      heading: 'Data Validation and Verification (DVV)',
      overview:
        'Verified and authenticated data submitted for NAAC assessment with comprehensive supporting documentation and clarifications.',
      documents: [
        {
          title: 'DVV Clarification Report',
          description: 'Responses to data validation queries',
          fileUrl: '/documents/naac/engineering/dvv-clarifications.pdf',
          fileType: 'pdf',
          size: '6.3 MB',
          uploadDate: '2024-11-01',
        },
        {
          title: 'Verified Data Metrics',
          description: 'DVV-verified quantitative and qualitative data',
          fileUrl: '/documents/naac/engineering/verified-data.xlsx',
          fileType: 'excel',
          size: '1.4 MB',
          uploadDate: '2024-11-05',
        },
      ],
    },
    {
      id: 'ssr',
      heading: 'Self Study Report (SSR) - Cycle 1',
      overview:
        'Comprehensive self-assessment report for JKKN College of Engineering covering all NAAC criteria with detailed analysis of institutional strengths and quality enhancement measures.',
      documents: [
        {
          title: 'Complete SSR Report - Engineering',
          description: 'Full Self Study Report for engineering college',
          fileUrl: '/documents/naac/engineering/ssr-complete.pdf',
          fileType: 'pdf',
          size: '15.2 MB',
          uploadDate: '2024-12-01',
        },
        {
          title: 'SSR Executive Summary',
          description: 'Executive summary and institutional profile',
          fileUrl: '/documents/naac/engineering/ssr-summary.pdf',
          fileType: 'pdf',
          size: '3.1 MB',
          uploadDate: '2024-12-01',
        },
        {
          title: 'NAAC Peer Team Report',
          description: 'Assessment report from NAAC peer team',
          fileUrl: '/documents/naac/engineering/peer-team-report.pdf',
          fileType: 'pdf',
          size: '4.6 MB',
          uploadDate: '2024-12-20',
        },
      ],
      metrics: [
        { label: 'NAAC Grade', value: 'A+' },
        { label: 'CGPA', value: '3.48' },
        { label: 'Accreditation Valid Till', value: '2029' },
      ],
    },
  ],

  contactInfo: {
    name: 'Dr. K. Rajendran',
    role: 'IQAC Coordinator - Engineering College',
    email: 'iqac.engineering@jkkn.ac.in',
    phone: '+91-4286-274742',
    officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM',
  },
}
