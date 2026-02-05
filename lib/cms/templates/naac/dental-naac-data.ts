import type { NAACPageProps } from './types'

/**
 * Dental College NAAC Data
 *
 * NAAC accreditation content specific to JKKN Dental College
 */

export const DENTAL_NAAC_DATA: NAACPageProps = {
  heroTitle: 'NAAC Accreditation',
  heroSubtitle: 'JKKN Dental College & Hospital',
  heroDescription:
    'Committed to excellence in dental education, patient care, and research through continuous quality improvement and rigorous assessment.',

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
        'Comprehensive institutional information for JKKN Dental College covering dental education programs, clinical facilities, faculty expertise, research infrastructure, and patient care services.',
      documents: [
        {
          title: 'IIQA Report 2024 - Dental College',
          description: 'Complete institutional information for quality assessment',
          fileUrl: '/documents/naac/dental/iiqa-report-2024.pdf',
          fileType: 'pdf',
          size: '4.8 MB',
          uploadDate: '2024-01-15',
        },
        {
          title: 'Dental Programs and Specializations',
          description: 'BDS and MDS program details',
          fileUrl: '/documents/naac/dental/programs-overview.pdf',
          fileType: 'pdf',
          size: '2.3 MB',
          uploadDate: '2024-01-15',
        },
      ],
      metrics: [
        { label: 'Dental Students', value: '600+' },
        { label: 'Faculty Members', value: '85+' },
        { label: 'Dental Chairs', value: '120+' },
        { label: 'Annual Patients', value: '50,000+' },
      ],
    },
    {
      id: 'criterion-1',
      heading: 'Criterion I: Curricular Aspects',
      overview:
        'Dental curriculum aligned with DCI regulations and global dental education standards. Focus on competency-based education, integrated teaching, and evidence-based dentistry.',
      documents: [
        {
          title: 'Dental Curriculum Framework',
          description: 'DCI-compliant curriculum for BDS and MDS programs',
          fileUrl: '/documents/naac/dental/curriculum-framework.pdf',
          fileType: 'pdf',
          size: '3.6 MB',
          uploadDate: '2024-02-01',
        },
        {
          title: 'Competency-Based Medical Education (CBME)',
          description: 'CBME implementation in dental education',
          fileUrl: '/documents/naac/dental/cbme-implementation.pdf',
          fileType: 'pdf',
          size: '2.8 MB',
          uploadDate: '2024-02-01',
        },
      ],
    },
    {
      id: 'criterion-2',
      heading: 'Criterion II: Teaching-Learning and Evaluation',
      overview:
        'Patient-centric clinical training with emphasis on hands-on experience, case-based learning, and continuous professional development for faculty and students.',
      documents: [
        {
          title: 'Clinical Training Program',
          description: 'Structured clinical exposure and skill development',
          fileUrl: '/documents/naac/dental/clinical-training.pdf',
          fileType: 'pdf',
          size: '4.2 MB',
          uploadDate: '2024-03-01',
        },
        {
          title: 'Faculty Development in Medical Education',
          description: 'FDPs and workshops for dental faculty',
          fileUrl: '/documents/naac/dental/faculty-development.pdf',
          fileType: 'pdf',
          size: '3.1 MB',
          uploadDate: '2024-03-05',
        },
      ],
    },
    {
      id: 'criterion-3',
      heading: 'Criterion III: Research, Innovations and Extension',
      overview:
        'Active research culture in oral health, dental materials, and community dentistry. Regular dental health camps and community outreach programs serving rural populations.',
      documents: [
        {
          title: 'Dental Research Publications',
          description: 'Indexed publications in dental journals',
          fileUrl: '/documents/naac/dental/research-publications.pdf',
          fileType: 'pdf',
          size: '4.9 MB',
          uploadDate: '2024-04-01',
        },
        {
          title: 'Community Dental Health Camps',
          description: 'Outreach programs and rural health initiatives',
          fileUrl: '/documents/naac/dental/community-programs.pdf',
          fileType: 'pdf',
          size: '3.7 MB',
          uploadDate: '2024-04-05',
        },
      ],
    },
    {
      id: 'criterion-4',
      heading: 'Criterion IV: Infrastructure and Learning Resources',
      overview:
        'Modern dental hospital with 120+ dental chairs, advanced diagnostic equipment, specialized departments, digital dental lab, and comprehensive library resources.',
      documents: [
        {
          title: 'Clinical Infrastructure Report',
          description: 'Details of dental departments and facilities',
          fileUrl: '/documents/naac/dental/clinical-infrastructure.pdf',
          fileType: 'pdf',
          size: '5.8 MB',
          uploadDate: '2024-05-01',
        },
        {
          title: 'Advanced Dental Equipment',
          description: 'Digital X-ray, CBCT, CAD/CAM systems',
          fileUrl: '/documents/naac/dental/equipment-details.pdf',
          fileType: 'pdf',
          size: '4.1 MB',
          uploadDate: '2024-05-05',
        },
      ],
    },
    {
      id: 'criterion-5',
      heading: 'Criterion V: Student Support and Progression',
      overview:
        'Comprehensive student support through mentoring, career guidance, competitive exam coaching, and strong alumni network. Focus on holistic development of dental professionals.',
      documents: [
        {
          title: 'Student Support Services',
          description: 'Mentoring, counseling, and welfare measures',
          fileUrl: '/documents/naac/dental/student-support.pdf',
          fileType: 'pdf',
          size: '2.9 MB',
          uploadDate: '2024-06-01',
        },
        {
          title: 'MDS Entrance Coaching',
          description: 'Preparation for postgraduate entrance exams',
          fileUrl: '/documents/naac/dental/mds-coaching.pdf',
          fileType: 'pdf',
          size: '2.1 MB',
          uploadDate: '2024-06-05',
        },
      ],
    },
    {
      id: 'criterion-6',
      heading: 'Criterion VI: Governance, Leadership and Management',
      overview:
        'Effective governance with participatory management involving faculty, students, and stakeholders. Strong IQAC ensuring continuous quality enhancement in academic and clinical activities.',
      documents: [
        {
          title: 'Institutional Governance Structure',
          description: 'Decision-making bodies and committees',
          fileUrl: '/documents/naac/dental/governance.pdf',
          fileType: 'pdf',
          size: '2.6 MB',
          uploadDate: '2024-07-01',
        },
        {
          title: 'IQAC Annual Report 2023-24',
          description: 'Quality assurance initiatives and outcomes',
          fileUrl: '/documents/naac/dental/iqac-report.pdf',
          fileType: 'pdf',
          size: '4.1 MB',
          uploadDate: '2024-07-05',
        },
      ],
    },
    {
      id: 'criterion-7',
      heading: 'Criterion VII: Institutional Values and Best Practices',
      overview:
        'Commitment to biomedical waste management, infection control, eco-friendly practices, and ethical dental care. Focus on gender equity and accessible healthcare services.',
      documents: [
        {
          title: 'Biomedical Waste Management',
          description: 'Compliance with biomedical waste regulations',
          fileUrl: '/documents/naac/dental/waste-management.pdf',
          fileType: 'pdf',
          size: '3.2 MB',
          uploadDate: '2024-08-01',
        },
        {
          title: 'Infection Control Protocol',
          description: 'Sterilization and cross-infection prevention',
          fileUrl: '/documents/naac/dental/infection-control.pdf',
          fileType: 'pdf',
          size: '2.7 MB',
          uploadDate: '2024-08-05',
        },
      ],
    },
    {
      id: 'best-practices',
      heading: 'Best Practices',
      overview:
        'Innovative practices including tele-dentistry consultations, mobile dental units for rural areas, and comprehensive oral health education programs in schools.',
      documents: [
        {
          title: 'Mobile Dental Clinic Initiative',
          description: 'Rural dental care through mobile units',
          fileUrl: '/documents/naac/dental/mobile-dental-clinic.pdf',
          fileType: 'pdf',
          size: '3.4 MB',
          uploadDate: '2024-09-01',
        },
        {
          title: 'School Oral Health Program',
          description: 'Preventive dentistry in schools',
          fileUrl: '/documents/naac/dental/school-health-program.pdf',
          fileType: 'pdf',
          size: '2.8 MB',
          uploadDate: '2024-09-01',
        },
      ],
    },
    {
      id: 'distinctiveness',
      heading: 'Institutional Distinctiveness',
      overview:
        'Distinguished by comprehensive patient care across all dental specialties, strong community outreach programs, and excellence in clinical training with high patient footfall.',
      documents: [
        {
          title: 'Institutional Distinctiveness Report',
          description: 'Unique features of dental college',
          fileUrl: '/documents/naac/dental/distinctiveness.pdf',
          fileType: 'pdf',
          size: '3.9 MB',
          uploadDate: '2024-09-10',
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
        'Verified institutional data with supporting documentation for patient statistics, clinical procedures, research output, and academic performance metrics.\n\nFor detailed DVV clarifications with findings and responses for all criteria and metrics, please visit our comprehensive DVV Clarifications page.',
      documents: [
        {
          title: 'View Detailed DVV Clarifications',
          description: 'Complete DVV findings and responses for all 7 criteria organized by metrics',
          fileUrl: '/naac/dvv',
          fileType: 'link',
          size: '',
          uploadDate: '2024-02-05',
        },
        {
          title: 'DVV Clarification Report',
          description: 'Responses to data validation queries',
          fileUrl: '/documents/naac/dental/dvv-clarifications.pdf',
          fileType: 'pdf',
          size: '5.7 MB',
          uploadDate: '2024-11-01',
        },
        {
          title: 'Verified Clinical Data',
          description: 'Patient statistics and clinical procedures',
          fileUrl: '/documents/naac/dental/verified-data.xlsx',
          fileType: 'excel',
          size: '1.1 MB',
          uploadDate: '2024-11-05',
        },
      ],
    },
    {
      id: 'ssr',
      heading: 'Self Study Report (SSR) - Cycle 1',
      overview:
        'Comprehensive self-assessment for JKKN Dental College covering academic excellence, clinical training quality, research output, and community service contributions.',
      documents: [
        {
          title: 'Complete SSR Report - Dental College',
          description: 'Full Self Study Report for dental college',
          fileUrl: '/documents/naac/dental/ssr-complete.pdf',
          fileType: 'pdf',
          size: '13.5 MB',
          uploadDate: '2024-12-01',
        },
        {
          title: 'SSR Executive Summary',
          description: 'Executive summary and institutional profile',
          fileUrl: '/documents/naac/dental/ssr-summary.pdf',
          fileType: 'pdf',
          size: '2.8 MB',
          uploadDate: '2024-12-01',
        },
        {
          title: 'NAAC Peer Team Report',
          description: 'Assessment report from NAAC peer team',
          fileUrl: '/documents/naac/dental/peer-team-report.pdf',
          fileType: 'pdf',
          size: '4.2 MB',
          uploadDate: '2024-12-20',
        },
      ],
      metrics: [
        { label: 'NAAC Grade', value: 'A' },
        { label: 'CGPA', value: '3.35' },
        { label: 'Accreditation Valid Till', value: '2029' },
      ],
    },
  ],

  contactInfo: {
    name: 'Dr. S. Kumaran',
    role: 'IQAC Coordinator - Dental College',
    email: 'iqac.dental@jkkn.ac.in',
    phone: '+91-4286-274745',
    officeHours: 'Monday - Saturday: 9:00 AM - 5:00 PM',
  },
}
