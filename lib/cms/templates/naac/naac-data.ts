import type { NAACPageProps } from './types'

/**
 * Main Institution NAAC Data
 *
 * Complete NAAC accreditation content for JKKN Institutions
 * 13 sections covering all NAAC criteria and assessments
 */

export const MAIN_NAAC_DATA: NAACPageProps = {
  heroTitle: 'NAAC Accreditation',
  heroSubtitle: 'National Assessment and Accreditation Council',
  heroDescription:
    'Committed to excellence in quality education and continuous improvement through rigorous assessment and accreditation processes.',

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
        'The IIQA is a comprehensive document that provides complete institutional information as part of the NAAC accreditation process. It serves as the foundation for quality assessment and includes detailed data about institutional profile, governance structure, academic programs, infrastructure, student strength, faculty details, and institutional resources.',
      documents: [
        {
          title: 'IIQA Report 2024',
          description: 'Complete institutional information for quality assessment',
          fileUrl: '/documents/naac/iiqa-report-2024.pdf',
          fileType: 'pdf',
          size: '4.2 MB',
          uploadDate: '2024-01-15',
        },
        {
          title: 'IIQA Data Template',
          description: 'Institutional data in structured format',
          fileUrl: '/documents/naac/iiqa-data-template.xlsx',
          fileType: 'excel',
          size: '856 KB',
          uploadDate: '2024-01-15',
        },
        {
          title: 'Institutional Profile',
          description: 'Comprehensive institutional profile document',
          fileUrl: '/documents/naac/institutional-profile.pdf',
          fileType: 'pdf',
          size: '2.8 MB',
          uploadDate: '2024-01-10',
        },
      ],
      metrics: [
        { label: 'Total Students', value: '8,500+' },
        { label: 'Faculty Members', value: '450+' },
        { label: 'Programs Offered', value: '75+' },
        { label: 'Research Projects', value: '120+' },
      ],
    },
    {
      id: 'criterion-1',
      heading: 'Criterion I: Curricular Aspects',
      overview:
        'This criterion evaluates curricular planning and implementation, academic flexibility, curriculum enrichment, and feedback mechanisms. It assesses how the institution designs, develops, and implements curricula that are aligned with institutional vision and mission while meeting stakeholder expectations and industry requirements.',
      documents: [
        {
          title: 'Curriculum Design Framework',
          description: 'Framework for curriculum planning and development',
          fileUrl: '/documents/naac/criterion-1-curriculum-framework.pdf',
          fileType: 'pdf',
          size: '3.1 MB',
          uploadDate: '2024-02-01',
        },
        {
          title: 'Academic Flexibility Report',
          description: 'Choice-based credit system and elective courses',
          fileUrl: '/documents/naac/criterion-1-academic-flexibility.pdf',
          fileType: 'pdf',
          size: '2.4 MB',
          uploadDate: '2024-02-01',
        },
        {
          title: 'Curriculum Enrichment Activities',
          description: 'Value-added courses and skill development programs',
          fileUrl: '/documents/naac/criterion-1-enrichment.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-02-05',
        },
        {
          title: 'Feedback Analysis Report',
          description: 'Stakeholder feedback on curriculum effectiveness',
          fileUrl: '/documents/naac/criterion-1-feedback.pdf',
          fileType: 'pdf',
          size: '1.8 MB',
          uploadDate: '2024-02-10',
        },
      ],
    },
    {
      id: 'criterion-2',
      heading: 'Criterion II: Teaching-Learning and Evaluation',
      overview:
        'This criterion focuses on student enrollment and profile, catering to student diversity, teaching-learning processes, teacher quality and professional development, and evaluation processes and reforms. It examines the effectiveness of teaching-learning methodologies and assessment practices.',
      documents: [
        {
          title: 'Student Admission Policy',
          description: 'Transparent and merit-based admission processes',
          fileUrl: '/documents/naac/criterion-2-admission-policy.pdf',
          fileType: 'pdf',
          size: '1.6 MB',
          uploadDate: '2024-03-01',
        },
        {
          title: 'Teaching-Learning Methodology',
          description: 'Innovative pedagogical practices and ICT integration',
          fileUrl: '/documents/naac/criterion-2-teaching-methodology.pdf',
          fileType: 'pdf',
          size: '3.5 MB',
          uploadDate: '2024-03-05',
        },
        {
          title: 'Faculty Development Programs',
          description: 'Professional development initiatives for faculty',
          fileUrl: '/documents/naac/criterion-2-faculty-development.pdf',
          fileType: 'pdf',
          size: '2.7 MB',
          uploadDate: '2024-03-10',
        },
        {
          title: 'Evaluation Process Report',
          description: 'Continuous assessment and evaluation reforms',
          fileUrl: '/documents/naac/criterion-2-evaluation.pdf',
          fileType: 'pdf',
          size: '2.2 MB',
          uploadDate: '2024-03-15',
        },
      ],
    },
    {
      id: 'criterion-3',
      heading: 'Criterion III: Research, Innovations and Extension',
      overview:
        'This criterion evaluates the institution\'s efforts in promoting research culture and innovation, resource mobilization for research, research publications and awards, extension activities, and collaborations. It assesses the quality and impact of research output and community engagement.',
      documents: [
        {
          title: 'Research Promotion Policy',
          description: 'Framework for promoting research culture',
          fileUrl: '/documents/naac/criterion-3-research-policy.pdf',
          fileType: 'pdf',
          size: '2.1 MB',
          uploadDate: '2024-04-01',
        },
        {
          title: 'Research Publications Report',
          description: 'Scholarly publications in peer-reviewed journals',
          fileUrl: '/documents/naac/criterion-3-publications.pdf',
          fileType: 'pdf',
          size: '4.8 MB',
          uploadDate: '2024-04-05',
        },
        {
          title: 'Innovation and Incubation',
          description: 'Startup incubation and innovation initiatives',
          fileUrl: '/documents/naac/criterion-3-innovation.pdf',
          fileType: 'pdf',
          size: '3.2 MB',
          uploadDate: '2024-04-10',
        },
        {
          title: 'Extension Activities Report',
          description: 'Community outreach and social responsibility',
          fileUrl: '/documents/naac/criterion-3-extension.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-04-15',
        },
        {
          title: 'Collaborations and Linkages',
          description: 'MoUs, partnerships, and academic collaborations',
          fileUrl: '/documents/naac/criterion-3-collaborations.pdf',
          fileType: 'pdf',
          size: '2.5 MB',
          uploadDate: '2024-04-20',
        },
      ],
    },
    {
      id: 'criterion-4',
      heading: 'Criterion IV: Infrastructure and Learning Resources',
      overview:
        'This criterion assesses the physical infrastructure, library as a learning resource, IT infrastructure, and maintenance of infrastructure. It evaluates the adequacy and optimal utilization of physical and academic support facilities for teaching-learning and research activities.',
      documents: [
        {
          title: 'Infrastructure Facilities Report',
          description: 'Comprehensive overview of physical infrastructure',
          fileUrl: '/documents/naac/criterion-4-infrastructure.pdf',
          fileType: 'pdf',
          size: '5.2 MB',
          uploadDate: '2024-05-01',
        },
        {
          title: 'Library Resources and Services',
          description: 'Library holdings, digital resources, and services',
          fileUrl: '/documents/naac/criterion-4-library.pdf',
          fileType: 'pdf',
          size: '3.8 MB',
          uploadDate: '2024-05-05',
        },
        {
          title: 'IT Infrastructure Report',
          description: 'Computing facilities, network, and digital resources',
          fileUrl: '/documents/naac/criterion-4-it-infrastructure.pdf',
          fileType: 'pdf',
          size: '3.1 MB',
          uploadDate: '2024-05-10',
        },
        {
          title: 'Maintenance and Utilization',
          description: 'Infrastructure maintenance and optimal utilization',
          fileUrl: '/documents/naac/criterion-4-maintenance.pdf',
          fileType: 'pdf',
          size: '2.4 MB',
          uploadDate: '2024-05-15',
        },
      ],
    },
    {
      id: 'criterion-5',
      heading: 'Criterion V: Student Support and Progression',
      overview:
        'This criterion focuses on student support services, student progression and outcomes, student participation and activities, and alumni engagement. It evaluates how the institution supports students throughout their academic journey and facilitates their holistic development and career progression.',
      documents: [
        {
          title: 'Student Support Services',
          description: 'Scholarships, counseling, and support mechanisms',
          fileUrl: '/documents/naac/criterion-5-support-services.pdf',
          fileType: 'pdf',
          size: '2.8 MB',
          uploadDate: '2024-06-01',
        },
        {
          title: 'Student Progression Report',
          description: 'Academic progression and placement statistics',
          fileUrl: '/documents/naac/criterion-5-progression.pdf',
          fileType: 'pdf',
          size: '3.4 MB',
          uploadDate: '2024-06-05',
        },
        {
          title: 'Student Activities and Achievements',
          description: 'Co-curricular and extracurricular participation',
          fileUrl: '/documents/naac/criterion-5-activities.pdf',
          fileType: 'pdf',
          size: '4.1 MB',
          uploadDate: '2024-06-10',
        },
        {
          title: 'Alumni Engagement Report',
          description: 'Alumni network and contribution to institution',
          fileUrl: '/documents/naac/criterion-5-alumni.pdf',
          fileType: 'pdf',
          size: '2.6 MB',
          uploadDate: '2024-06-15',
        },
      ],
    },
    {
      id: 'criterion-6',
      heading: 'Criterion VI: Governance, Leadership and Management',
      overview:
        'This criterion evaluates institutional vision and leadership, strategy development and deployment, faculty empowerment strategies, financial management and resource mobilization, and internal quality assurance systems. It assesses the effectiveness of governance structures and leadership in achieving institutional goals.',
      documents: [
        {
          title: 'Institutional Vision and Leadership',
          description: 'Mission, vision, and strategic leadership',
          fileUrl: '/documents/naac/criterion-6-vision-leadership.pdf',
          fileType: 'pdf',
          size: '2.3 MB',
          uploadDate: '2024-07-01',
        },
        {
          title: 'Strategic Plan 2024-2029',
          description: 'Five-year institutional strategic plan',
          fileUrl: '/documents/naac/criterion-6-strategic-plan.pdf',
          fileType: 'pdf',
          size: '3.7 MB',
          uploadDate: '2024-07-05',
        },
        {
          title: 'Faculty Empowerment Strategies',
          description: 'Professional growth and welfare measures',
          fileUrl: '/documents/naac/criterion-6-faculty-empowerment.pdf',
          fileType: 'pdf',
          size: '2.1 MB',
          uploadDate: '2024-07-10',
        },
        {
          title: 'Financial Management Report',
          description: 'Budget allocation and financial sustainability',
          fileUrl: '/documents/naac/criterion-6-financial.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-07-15',
        },
        {
          title: 'IQAC Activities and Initiatives',
          description: 'Internal Quality Assurance Cell functioning',
          fileUrl: '/documents/naac/criterion-6-iqac.pdf',
          fileType: 'pdf',
          size: '3.5 MB',
          uploadDate: '2024-07-20',
        },
      ],
    },
    {
      id: 'criterion-7',
      heading: 'Criterion VII: Institutional Values and Best Practices',
      overview:
        'This criterion focuses on gender equity, environmental consciousness and sustainability, inclusivity and human values, code of conduct, professional ethics, and institutional best practices. It evaluates how the institution promotes core values and contributes to sustainable development.',
      documents: [
        {
          title: 'Gender Equity Initiatives',
          description: 'Women empowerment and gender sensitization programs',
          fileUrl: '/documents/naac/criterion-7-gender-equity.pdf',
          fileType: 'pdf',
          size: '2.7 MB',
          uploadDate: '2024-08-01',
        },
        {
          title: 'Environmental Sustainability Report',
          description: 'Green campus initiatives and carbon neutrality',
          fileUrl: '/documents/naac/criterion-7-sustainability.pdf',
          fileType: 'pdf',
          size: '4.3 MB',
          uploadDate: '2024-08-05',
        },
        {
          title: 'Inclusivity and Diversity',
          description: 'Support for differently-abled and inclusive practices',
          fileUrl: '/documents/naac/criterion-7-inclusivity.pdf',
          fileType: 'pdf',
          size: '2.4 MB',
          uploadDate: '2024-08-10',
        },
        {
          title: 'Code of Conduct',
          description: 'Professional ethics and conduct policies',
          fileUrl: '/documents/naac/criterion-7-code-of-conduct.pdf',
          fileType: 'pdf',
          size: '1.9 MB',
          uploadDate: '2024-08-15',
        },
      ],
    },
    {
      id: 'best-practices',
      heading: 'Best Practices',
      overview:
        'This section highlights unique institutional practices that have had a significant impact on institutional performance and student outcomes. These best practices demonstrate innovation, sustainability, and replicability, serving as models for other institutions.',
      documents: [
        {
          title: 'Best Practice 1: Student Mentoring Program',
          description: 'Comprehensive faculty-student mentoring framework',
          fileUrl: '/documents/naac/best-practice-mentoring.pdf',
          fileType: 'pdf',
          size: '2.5 MB',
          uploadDate: '2024-09-01',
        },
        {
          title: 'Best Practice 2: Industry-Academia Collaboration',
          description: 'Innovative partnership model with industry',
          fileUrl: '/documents/naac/best-practice-industry.pdf',
          fileType: 'pdf',
          size: '3.1 MB',
          uploadDate: '2024-09-01',
        },
        {
          title: 'Best Practices Compilation',
          description: 'Complete documentation of all institutional best practices',
          fileUrl: '/documents/naac/best-practices-compilation.pdf',
          fileType: 'pdf',
          size: '4.7 MB',
          uploadDate: '2024-09-05',
        },
      ],
    },
    {
      id: 'distinctiveness',
      heading: 'Institutional Distinctiveness',
      overview:
        'This section describes the unique features that distinguish the institution from others. These distinctive characteristics reflect the institution\'s focus areas, special initiatives, and contributions that create a distinct identity and niche in higher education.',
      documents: [
        {
          title: 'Institutional Distinctiveness Report',
          description: 'Unique features and institutional strengths',
          fileUrl: '/documents/naac/institutional-distinctiveness.pdf',
          fileType: 'pdf',
          size: '3.8 MB',
          uploadDate: '2024-09-10',
        },
        {
          title: 'Special Initiatives and Programs',
          description: 'Innovative programs and community impact',
          fileUrl: '/documents/naac/special-initiatives.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-09-15',
        },
      ],
    },
    {
      id: 'feedback',
      heading: 'Stakeholder Feedback',
      overview:
        'Comprehensive feedback collected from students, faculty, employers, alumni, and other stakeholders across five academic years, demonstrating our commitment to continuous quality improvement.',
      documents: [
        {
          title: '2018-2019 Feedback',
          description: 'Stakeholder feedback analysis for academic year 2018-19',
          fileUrl: '/iqac/feedback/2018-2019',
          fileType: 'link',
        },
        {
          title: '2019-2020 Feedback',
          description: 'Stakeholder feedback analysis for academic year 2019-20',
          fileUrl: '/iqac/feedback/2019-2020',
          fileType: 'link',
        },
        {
          title: '2020-2021 Feedback',
          description: 'Stakeholder feedback analysis for academic year 2020-21',
          fileUrl: '/iqac/feedback/2020-2021',
          fileType: 'link',
        },
        {
          title: '2021-2022 Feedback',
          description: 'Stakeholder feedback analysis for academic year 2021-22',
          fileUrl: '/iqac/feedback/2021-2022',
          fileType: 'link',
        },
        {
          title: '2022-2023 Feedback',
          description: 'Stakeholder feedback analysis for academic year 2022-23',
          fileUrl: '/iqac/feedback/2022-2023',
          fileType: 'link',
        },
      ],
    },
    {
      id: 'dvv',
      heading: 'Data Validation and Verification (DVV)',
      overview:
        'The DVV process ensures accuracy, authenticity, and compliance of data submitted for NAAC assessment. This section contains verified data, supporting documents, and clarifications provided during the data validation and verification process.',
      documents: [
        {
          title: 'DVV Clarification Report',
          description: 'Responses to DVV queries and clarifications',
          fileUrl: '/documents/naac/dvv-clarifications.pdf',
          fileType: 'pdf',
          size: '5.1 MB',
          uploadDate: '2024-11-01',
        },
        {
          title: 'Verified Data Template',
          description: 'DVV-verified institutional data',
          fileUrl: '/documents/naac/dvv-verified-data.xlsx',
          fileType: 'excel',
          size: '1.2 MB',
          uploadDate: '2024-11-05',
        },
        {
          title: 'Supporting Documents Index',
          description: 'Index of documents submitted for DVV',
          fileUrl: '/documents/naac/dvv-documents-index.pdf',
          fileType: 'pdf',
          size: '2.3 MB',
          uploadDate: '2024-11-10',
        },
      ],
    },
    {
      id: 'ssr',
      heading: 'Self Study Report (SSR) - Cycle 1',
      overview:
        'The Self Study Report is a comprehensive institutional self-assessment document prepared for NAAC accreditation. It provides detailed information across all seven criteria, demonstrates institutional quality, and reflects on strengths and areas for improvement.',
      documents: [
        {
          title: 'Complete SSR Report - Cycle 1',
          description: 'Full Self Study Report submitted to NAAC',
          fileUrl: '/documents/naac/ssr-complete-cycle1.pdf',
          fileType: 'pdf',
          size: '12.8 MB',
          uploadDate: '2024-12-01',
        },
        {
          title: 'SSR Executive Summary',
          description: 'Executive summary of institutional profile',
          fileUrl: '/documents/naac/ssr-executive-summary.pdf',
          fileType: 'pdf',
          size: '2.4 MB',
          uploadDate: '2024-12-01',
        },
        {
          title: 'SSR Annexures',
          description: 'Supporting annexures and documentation',
          fileUrl: '/documents/naac/ssr-annexures.pdf',
          fileType: 'pdf',
          size: '8.6 MB',
          uploadDate: '2024-12-05',
        },
        {
          title: 'NAAC Peer Team Report',
          description: 'Report from NAAC peer team visit',
          fileUrl: '/documents/naac/peer-team-report.pdf',
          fileType: 'pdf',
          size: '3.9 MB',
          uploadDate: '2024-12-20',
        },
      ],
      metrics: [
        { label: 'NAAC Grade', value: 'A+' },
        { label: 'CGPA', value: '3.51' },
        { label: 'Accreditation Valid Till', value: '2029' },
      ],
    },
  ],

  contactInfo: {
    name: 'Dr. A. Rajagopal',
    role: 'IQAC Coordinator',
    email: 'iqac@jkkn.ac.in',
    phone: '+91-4286-274741',
    officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM',
  },
}
