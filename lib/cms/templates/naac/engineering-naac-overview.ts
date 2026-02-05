import type { NAACPageProps } from './types'

/**
 * NAAC Overview Data for Engineering College
 *
 * Complete NAAC accreditation documentation including:
 * - IIQA (Institutional Information for Quality Assessment)
 * - All 7 Criteria with metrics and documents
 * - Best Practices
 * - Institution Distinctiveness
 * - Feedback Systems
 * - DVV Clarifications
 * - SSR Cycle-1
 *
 * Source: Previous JKKN Engineering College website
 */

export const ENGINEERING_NAAC_OVERVIEW_DATA: NAACPageProps = {
  heroTitle: 'NAAC Accreditation',
  heroSubtitle: 'National Assessment and Accreditation Council',
  heroDescription:
    'Comprehensive documentation of NAAC accreditation process, quality benchmarks, and institutional excellence at JKKN College of Engineering.',

  navigationSections: [
    {
      id: 'iiqa',
      label: 'IIQA',
      description: 'Institutional Information',
    },
    {
      id: 'criterion-1',
      label: 'Criterion I',
      description: 'Curricular Aspects',
    },
    {
      id: 'criterion-2',
      label: 'Criterion II',
      description: 'Teaching-Learning',
    },
    {
      id: 'criterion-3',
      label: 'Criterion III',
      description: 'Research & Extension',
    },
    {
      id: 'criterion-4',
      label: 'Criterion IV',
      description: 'Infrastructure',
    },
    {
      id: 'criterion-5',
      label: 'Criterion V',
      description: 'Student Support',
    },
    {
      id: 'criterion-6',
      label: 'Criterion VI',
      description: 'Governance',
    },
    {
      id: 'criterion-7',
      label: 'Criterion VII',
      description: 'Institutional Values',
    },
    {
      id: 'best-practices',
      label: 'Best Practices',
      description: 'Innovative Practices',
    },
    {
      id: 'institution-distinctiveness',
      label: 'Institution Distinctiveness',
      description: 'Unique Initiatives',
    },
    {
      id: 'feedback',
      label: 'Feedback',
      description: 'Stakeholder Feedback',
    },
    {
      id: 'dvv',
      label: 'DVV',
      description: 'DVV Clarifications',
    },
    {
      id: 'ssr-cycle-1',
      label: 'SSR CYCLE-1',
      description: 'Self Study Report',
    },
  ],

  contentSections: [
    // =============================================================================
    // IIQA Section
    // =============================================================================
    {
      id: 'iiqa',
      heading: 'Institutional Information for Quality Assessment (IIQA)',
      overview:
        'The IIQA provides comprehensive information about the institution, including infrastructure, academic programs, faculty profile, governance structure, and quality initiatives undertaken by the institution.',
      documents: [
        {
          title: 'IIQA Document',
          description: 'Complete Institutional Information for Quality Assessment - April 18, 2024',
          fileUrl: '/pdfs/naac/iiqa/iiqa-april-2024.pdf',
          fileType: 'pdf',
          uploadDate: '2024-04-18',
        },
      ],
    },

    // =============================================================================
    // Criterion 1 - Curricular Aspects
    // =============================================================================
    {
      id: 'criterion-1',
      heading: 'Criterion I – Curricular Aspects',
      overview:
        'Focuses on curricular planning, academic flexibility, curriculum enrichment, and feedback systems to ensure effective teaching-learning processes.',
      metrics: [
        { label: 'Total Marks', value: '100' },
      ],
      documents: [],
      subsections: [
        {
          id: 'criterion-1-1',
          title: '1.1 Curricular Planning and Implementation (20 Marks)',
          content:
            'The Institution ensures effective curriculum planning and delivery through a well-planned and documented process including Academic calendar and conduct of continuous internal Assessment.',
          documents: [
            {
              title: '1.1.1 Curricular Planning Implementation',
              description: 'QLM - Documented curriculum planning process',
              fileUrl: '/pdfs/naac/criterion-1/1-1-1-curricular-planning.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-1-2',
          title: '1.2 Academic Flexibility (30 Marks)',
          content:
            'Certificate/Value added courses, MOOCs, SWAYAM, NPTEL enrollment and completion statistics.',
          documents: [
            {
              title: '1.2.1 & 1.2.2 Academic Flexibility',
              description: 'QNM - Certificate courses and online learning statistics',
              fileUrl: '/pdfs/naac/criterion-1/1-2-academic-flexibility.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-1-3',
          title: '1.3 Curriculum Enrichment (30 Marks)',
          content:
            'Integration of crosscutting issues (Professional Ethics, Gender, Human Values, Environment) and project work/field work/internships.',
          documents: [
            {
              title: '1.3.1 & 1.3.2 Curriculum Enrichment',
              description: 'QLM - Crosscutting issues and project work statistics',
              fileUrl: '/pdfs/naac/criterion-1/criteriaa1.3.2curriculam.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-1-4',
          title: '1.4 Feedback System (20 Marks)',
          content:
            'Feedback collected from stakeholders (Students, Teachers, Employers, Alumni), analysis, action taken, and communication.',
          documents: [
            {
              title: '1.4.1 Feedback Systems',
              description: 'QNM - Comprehensive feedback mechanism',
              fileUrl: '/pdfs/naac/criterion-1/criteria1.1.4-Feedback-Systems.pdf',
              fileType: 'pdf',
            },
          ],
        },
      ],
    },

    // =============================================================================
    // Criterion 2 - Teaching-Learning and Evaluation
    // =============================================================================
    {
      id: 'criterion-2',
      heading: 'Criterion II – Teaching-Learning and Evaluation',
      overview:
        'Evaluates student enrollment, teacher profile, teaching-learning processes, evaluation mechanisms, and student satisfaction.',
      metrics: [
        { label: 'Total Marks', value: '350' },
      ],
      documents: [],
      subsections: [
        {
          id: 'criterion-2-1',
          title: '2.1 Student Enrollment and Profile (40 Marks)',
          content: 'Enrollment percentage and reserved category seat filling statistics.',
          documents: [
            {
              title: '2.1.1 Enrollment Percentage',
              description: 'QNM - Student enrollment statistics',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.1.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '2.1.2 Reserved Category Seats',
              description: 'QNM - SC/ST/OBC seat filling data',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.1.2-final.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-2-2',
          title: '2.2 Student-Teacher Ratio (40 Marks)',
          content: 'Student to full-time teacher ratio for the latest academic year.',
          documents: [
            {
              title: '2.2.1 Student-Teacher Ratio',
              description: 'QNM - Current student-teacher ratio data',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-2-3',
          title: '2.3 Teaching-Learning Process (40 Marks)',
          content:
            'Student-centric methods (experiential learning, participative learning, problem-solving) and ICT-enabled tools.',
          documents: [
            {
              title: '2.3.1 Teaching Methods',
              description: 'QLM - Innovative teaching-learning practices',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.3.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-2-4',
          title: '2.4 Teacher Profile and Quality (40 Marks)',
          content: 'Full-time teachers against sanctioned posts and qualified teachers with NET/SET/PhD.',
          documents: [
            {
              title: '2.4.1 Full-time Teachers',
              description: 'QNM - Teacher recruitment statistics',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.4.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '2.4.2 Qualified Teachers',
              description: 'QNM - Teachers with NET/SET/PhD qualifications',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.4.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-2-5',
          title: '2.5 Evaluation Process and Reforms (40 Marks)',
          content: 'Transparent internal/external assessment and efficient grievance redressal system.',
          documents: [
            {
              title: '2.5.1 Evaluation Process',
              description: 'QLM - Assessment transparency and grievance mechanism',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.5.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-2-6',
          title: '2.6 Student Performance and Learning Outcome (90 Marks)',
          content: 'Programme Outcomes (POs), Course Outcomes (COs), attainment evaluation, and pass percentage.',
          documents: [
            {
              title: '2.6.1 POs and COs',
              description: 'QLM - Learning outcomes documentation',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.6.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '2.6.2 Attainment Evaluation',
              description: 'QLM - PO and CO attainment assessment',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.6.2.pdf',
              fileType: 'pdf',
            },
            {
              title: '2.6.3 Pass Percentage',
              description: 'QNM - Student pass percentage (5 years)',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.6.3.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-2-7',
          title: '2.7 Student Satisfaction Survey (60 Marks)',
          content: 'Online student satisfaction survey regarding teaching-learning process.',
          documents: [
            {
              title: '2.7.1 Student Satisfaction Survey',
              description: 'QNM - Teaching-learning satisfaction data',
              fileUrl: '/pdfs/naac/criterion-2/criteria2-2.7.pdf',
              fileType: 'pdf',
            },
          ],
        },
      ],
    },

    // =============================================================================
    // Criterion 3 - Research, Innovations and Extension
    // =============================================================================
    {
      id: 'criterion-3',
      heading: 'Criterion III – Research, Innovations and Extension',
      overview:
        'Assesses resource mobilization for research, innovation ecosystem, research publications, extension activities, and collaborations.',
      metrics: [
        { label: 'Total Marks', value: '110' },
      ],
      documents: [],
      subsections: [
        {
          id: 'criterion-3-1',
          title: '3.1 Resource Mobilization for Research (10 Marks)',
          content: 'Grants received from government and non-governmental agencies for research projects.',
          documents: [
            {
              title: '3.1.1 Research Grants',
              description: 'QNM - Funding sources and project grants',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.1.1.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-3-2',
          title: '3.2 Innovation Ecosystem (15 Marks)',
          content:
            'Innovation initiatives including IPR awareness, IPR cell, Incubation centre, Indian Knowledge System (IKS), and workshops on research methodology.',
          documents: [
            {
              title: '3.2.1 Innovation Ecosystem',
              description: 'QLM - IPR cell, incubation, and IKS initiatives',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.2.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '3.2.2 Research Workshops',
              description: 'QNM - Workshops on IPR and entrepreneurship',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.2.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-3-3',
          title: '3.3 Research Publication and Awards (25 Marks)',
          content: 'Research papers in UGC CARE journals, books, chapters, and conference publications.',
          documents: [
            {
              title: '3.3.1 Research Papers',
              description: 'QNM - UGC CARE journal publications',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.3.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '3.3.2 Books and Conference Papers',
              description: 'QNM - Books, chapters, and conference proceedings',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.3.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-3-4',
          title: '3.4 Extension Activities (40 Marks)',
          content:
            'Community extension programs, NSS/NCC activities, social impact, and recognition received.',
          documents: [
            {
              title: '3.4.1 Extension Outcomes',
              description: 'QLM - Community impact and student development',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.4.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '3.4.2 Awards for Extension',
              description: 'QLM - Government recognition for extension work',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.4.2.pdf',
              fileType: 'pdf',
            },
            {
              title: '3.4.3 Extension Programs',
              description: 'QNM - NSS/NCC programs with community involvement',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.4.3.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-3-5',
          title: '3.5 Collaboration (20 Marks)',
          content:
            'MoUs and linkages with institutions/industries for internships, training, exchange programs, and collaborative research.',
          documents: [
            {
              title: '3.5.1 MoUs and Linkages',
              description: 'QNM - Functional collaborations and partnerships',
              fileUrl: '/pdfs/naac/criterion-3/Criteria-3-3.5.1.pdf',
              fileType: 'pdf',
            },
          ],
        },
      ],
    },

    // =============================================================================
    // Criterion 4 - Infrastructure and Learning Resources
    // =============================================================================
    {
      id: 'criterion-4',
      heading: 'Criterion IV – Infrastructure and Learning Resources',
      overview:
        'Evaluates physical facilities, library resources, IT infrastructure, and campus maintenance.',
      metrics: [
        { label: 'Total Marks', value: '100' },
      ],
      documents: [],
      subsections: [
        {
          id: 'criterion-4-1',
          title: '4.1 Physical Facilities (30 Marks)',
          content:
            'Adequate infrastructure for teaching-learning (classrooms, labs, computing), ICT facilities, and sports/cultural amenities.',
          documents: [
            {
              title: '4.1.1 Infrastructure Adequacy',
              description: 'QLM - Comprehensive facility documentation',
              fileUrl: '/pdfs/naac/criterion-4/criteria4-4.1.1-infrastructure.pdf',
              fileType: 'pdf',
            },
            {
              title: '4.1.2 Infrastructure Expenditure',
              description: 'QNM - Development and augmentation spending',
              fileUrl: '/pdfs/naac/criterion-4/criteria4-4.1.2-expenditure.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-4-2',
          title: '4.2 Library as a Learning Resource (20 Marks)',
          content:
            'Library automation with ILMS, e-resources subscriptions, journals, and optimal utilization by faculty and students.',
          documents: [
            {
              title: '4.2.1 Library Automation',
              description: 'QLM - Digital library facilities and resources',
              fileUrl: '/pdfs/naac/criterion-4/citeria4-4.2.1-library-1.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-4-3',
          title: '4.3 IT Infrastructure (30 Marks)',
          content: 'Regular IT facility updates, internet bandwidth, and student-computer ratio.',
          documents: [
            {
              title: '4.3.1 IT Facilities',
              description: 'QLM - IT infrastructure and internet connectivity',
              fileUrl: '/pdfs/naac/criterion-4/criteria4-4.3.1-itinfra.pdf',
              fileType: 'pdf',
            },
            {
              title: '4.3.2 Student-Computer Ratio',
              description: 'QNM - Computing resource availability',
              fileUrl: '/pdfs/naac/criterion-4/criteria4-4.3.2-students.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-4-4',
          title: '4.4 Maintenance of Campus Infrastructure (20 Marks)',
          content: 'Expenditure on maintenance of physical and academic support facilities.',
          documents: [
            {
              title: '4.4.1 Maintenance Expenditure',
              description: 'QNM - Infrastructure maintenance spending',
              fileUrl: '/pdfs/naac/criterion-4/criteria4-4.4.1-cacopy.pdf',
              fileType: 'pdf',
            },
          ],
        },
      ],
    },

    // =============================================================================
    // Criterion 5 - Student Support and Progression
    // =============================================================================
    {
      id: 'criterion-5',
      heading: 'Criterion V – Student Support and Progression',
      overview:
        'Assesses student support services, progression to higher education/employment, participation in activities, and alumni engagement.',
      metrics: [
        { label: 'Total Marks', value: '140' },
      ],
      documents: [],
      subsections: [
        {
          id: 'criterion-5-1',
          title: '5.1 Student Support (50 Marks)',
          content:
            'Scholarships/freeships, capacity development programs (soft skills, life skills, career counseling), and grievance redressal mechanisms.',
          documents: [
            {
              title: '5.1.1 Scholarships',
              description: 'QNM - Financial aid and scholarship beneficiaries',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.1.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '5.1.2 Capacity Development',
              description: 'QNM - Soft skills, communication, life skills programs',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.1.2.pdf',
              fileType: 'pdf',
            },
            {
              title: '5.1.3 Career Counseling',
              description: 'QNM - Competitive exam guidance and counseling',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.1.3.pdf',
              fileType: 'pdf',
            },
            {
              title: '5.1.4 Grievance Redressal',
              description: 'QNM - Student grievance and anti-ragging mechanisms',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.1.4.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-5-2',
          title: '5.2 Student Progression (35 Marks)',
          content: 'Placement statistics, progression to higher education, and qualifying in competitive exams.',
          documents: [
            {
              title: '5.2.1 Placement and Higher Education',
              description: 'QNM - Outgoing students placement and progression data',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.2.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '5.2.2 Competitive Exams',
              description: 'QNM - State/national/international exam qualifications',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.2.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-5-3',
          title: '5.3 Student Participation and Activities (45 Marks)',
          content: 'Awards in sports/cultural activities and participation in university/state/national/international events.',
          documents: [
            {
              title: '5.3.1 Sports and Cultural Awards',
              description: 'QNM - Student achievements and medals',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.3.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '5.3.2 Program Participation',
              description: 'QNM - Sports and cultural program involvement',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.3.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-5-4',
          title: '5.4 Alumni Engagement (10 Marks)',
          content: 'Registered Alumni Association and contributions to institutional development.',
          documents: [
            {
              title: '5.4.1 Alumni Association',
              description: 'QLM - Alumni network and support services',
              fileUrl: '/pdfs/naac/criterion-5/criteria5-main-page-5.4.pdf',
              fileType: 'pdf',
            },
          ],
        },
      ],
    },

    // =============================================================================
    // Criterion 6 - Governance, Leadership and Management
    // =============================================================================
    {
      id: 'criterion-6',
      heading: 'Criterion VI – Governance, Leadership and Management',
      overview:
        'Evaluates institutional vision and leadership, strategy deployment, faculty empowerment, financial management, and quality assurance systems.',
      metrics: [
        { label: 'Total Marks', value: '100' },
      ],
      documents: [],
      subsections: [
        {
          id: 'criterion-6-1',
          title: '6.1 Institutional Vision and Leadership (15 Marks)',
          content:
            'Governance and leadership aligned with vision and mission, NEP implementation, and institutional perspective plan.',
          documents: [
            {
              title: '6.1.1 Governance and Leadership',
              description: 'QLM - Vision-mission alignment and strategic planning',
              fileUrl: '/pdfs/naac/criterion-6/criteria6-6.1-institutional-governance-and-leadership.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-6-2',
          title: '6.2 Strategy Development and Deployment (12 Marks)',
          content: 'Perspective plan deployment, institutional bodies functioning, and e-governance implementation.',
          documents: [
            {
              title: '6.2.1 Perspective Plan',
              description: 'QLM - Strategic plan deployment and administrative setup',
              fileUrl: '/pdfs/naac/criterion-6/6.2.1-1.pdf',
              fileType: 'pdf',
            },
            {
              title: '6.2.2 E-Governance',
              description: 'QNM - Digital systems for administration, finance, admissions, exams',
              fileUrl: '/pdfs/naac/criterion-6/6.2.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-6-3',
          title: '6.3 Faculty Empowerment Strategies (33 Marks)',
          content:
            'Performance appraisal, welfare measures, career development, financial support for conferences, and FDP participation.',
          documents: [
            {
              title: '6.3.1 Performance Appraisal',
              description: 'QLM - Appraisal system and welfare measures',
              fileUrl: '/pdfs/naac/criterion-6/6.3.1-1.pdf',
              fileType: 'pdf',
            },
            {
              title: '6.3.2 Conference Financial Support',
              description: 'QNM - Teacher support for conferences and professional bodies',
              fileUrl: '/pdfs/naac/criterion-6/criteria6-6.3.2-Percentage-of-teachers-provided-with-financial-support.pdf',
              fileType: 'pdf',
            },
            {
              title: '6.3.3 FDP Participation',
              description: 'QNM - Faculty and staff training programs',
              fileUrl: '/pdfs/naac/criterion-6/6.3.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-6-4',
          title: '6.4 Financial Management and Resource Mobilization (10 Marks)',
          content: 'Resource mobilization strategies and regular financial audits (internal and external).',
          documents: [
            {
              title: '6.4.1 Financial Management',
              description: 'QLM - Resource mobilization and audit practices',
              fileUrl: '/pdfs/naac/criterion-6/6.4.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-6-5',
          title: '6.5 Internal Quality Assurance System (30 Marks)',
          content:
            'IQAC contributions, quality review processes, academic/administrative audits, collaborative initiatives, and NIRF participation.',
          documents: [
            {
              title: '6.5.1 IQAC Contributions',
              description: 'QLM - Quality assurance institutionalization',
              fileUrl: '/pdfs/naac/criterion-6/6.5.1.pdf',
              fileType: 'pdf',
            },
            {
              title: '6.5.2 Quality Initiatives',
              description: 'QNM - IQAC meetings, audits, collaborations, NIRF, accreditation',
              fileUrl: '/pdfs/naac/criterion-6/6.5.2.pdf',
              fileType: 'pdf',
            },
          ],
        },
      ],
    },

    // =============================================================================
    // Criterion 7 - Institutional Values and Best Practices
    // =============================================================================
    {
      id: 'criterion-7',
      heading: 'Criterion VII – Institutional Values and Best Practices',
      overview:
        'Focuses on institutional values, social responsibilities, environmental initiatives, gender equity, best practices, and institutional distinctiveness.',
      metrics: [
        { label: 'Total Marks', value: '100' },
      ],
      documents: [],
      subsections: [
        {
          id: 'criterion-7-1',
          title: '7.1 Institutional Values and Social Responsibilities (50 Marks)',
          content:
            'Gender audit, energy conservation, waste management, water conservation, green campus, disabled-friendly environment, environmental audits, and constitutional sensitization.',
          documents: [
            {
              title: '7.1.1 Gender Audit',
              description: 'QLM - Gender equity measures and initiatives',
              fileUrl: '/pdfs/naac/criterion-7/criteria7-7.1.1-gender-audit-2.pdf',
              fileType: 'pdf',
            },
            {
              title: '7.1.2 Institutional Facilities',
              description: 'QNM - Energy, waste, water, green campus, accessibility',
              fileUrl: '/pdfs/naac/criterion-7/criteria7-7.1.2institution-facilities-.pdf',
              fileType: 'pdf',
            },
            {
              title: '7.1.3 Quality Audits',
              description: 'QNM - Green audit, energy audit, environmental initiatives',
              fileUrl: '/pdfs/naac/criterion-7/criteria7-7.1.3-Audit-and-Beyond-Campus.pdf',
              fileType: 'pdf',
            },
            {
              title: '7.1.4 Inclusive Environment',
              description: 'QLM - Cultural tolerance and constitutional values',
              fileUrl: '/pdfs/naac/criterion-7/criteria7-7.1.4-Constitutional-_-Tolerance-Celebration.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-7-2',
          title: '7.2 Best Practices (30 Marks)',
          content: 'Two successfully implemented best practices following NAAC format.',
          documents: [
            {
              title: 'Best Practice I',
              description: 'Innovative institutional practice',
              fileUrl: '/pdfs/naac/best-practices/criteria7-7.2.1-best-practices-1.pdf',
              fileType: 'pdf',
            },
            {
              title: 'Best Practice II',
              description: 'Distinctive institutional initiative',
              fileUrl: '/pdfs/naac/best-practices/criteria7-7.2.1-best-practices-2.pdf',
              fileType: 'pdf',
            },
          ],
        },
        {
          id: 'criterion-7-3',
          title: '7.3 Institutional Distinctiveness (20 Marks)',
          content: 'Performance in one distinctive area aligned with institutional priority and thrust.',
          documents: [
            {
              title: '7.3.1 Institutional Distinctiveness',
              description: 'QLM - Unique institutional strengths and achievements',
              fileUrl: '/pdfs/naac/criterion-7/criteria7-7.3.1-Institution-distinctiveness.pdf',
              fileType: 'pdf',
            },
          ],
        },
      ],
    },

    // =============================================================================
    // Best Practices Section
    // =============================================================================
    {
      id: 'best-practices',
      heading: 'Best Practices',
      overview:
        'Detailed documentation of innovative and distinctive practices implemented at JKKN College of Engineering that have demonstrated significant impact on academic excellence and institutional development.',
      documents: [
        {
          title: 'Best Practices I',
          description: 'Comprehensive documentation of first institutional best practice',
          fileUrl: 'https://engg.jkkn.ac.in/best-practices-i/',
          fileType: 'link',
        },
        {
          title: 'Best Practices II',
          description: 'Comprehensive documentation of second institutional best practice',
          fileUrl: 'https://engg.jkkn.ac.in/best-practices-2/',
          fileType: 'link',
        },
      ],
    },

    // =============================================================================
    // Institution Distinctiveness Section
    // =============================================================================
    {
      id: 'institution-distinctiveness',
      heading: 'Institution Distinctiveness',
      overview:
        'JKKN College of Engineering\'s distinctive performance in areas that set it apart from peer institutions, reflecting our commitment to innovation, quality, and societal impact.',
      documents: [
        {
          title: 'Institution Distinctiveness',
          description: 'Comprehensive documentation of institutional unique features including programmes efficiency, entrepreneurship initiatives, social responsibility, and civic engagement',
          fileUrl: '/institution-distinctiveness',
          fileType: 'link',
        },
        {
          title: 'Institution Distinctiveness PDF',
          description: 'Download the complete document in PDF format',
          fileUrl: '/pdfs/naac/criterion-7/criteria7-7.3.1-Institution-distinctiveness.pdf',
          fileType: 'pdf',
        },
      ],
    },

    // =============================================================================
    // Feedback Section
    // =============================================================================
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

    // =============================================================================
    // DVV Clarifications Section
    // =============================================================================
    {
      id: 'dvv',
      heading: 'DVV Clarifications',
      overview:
        'Data Validation and Verification (DVV) clarifications submitted to NAAC, addressing queries and providing additional documentation for metric substantiation.',
      documents: [
        {
          title: 'DVV Clarification Document',
          description: 'Complete DVV responses and supporting documentation',
          fileUrl: 'https://engg.jkkn.ac.in/dvv',
          fileType: 'link',
        },
      ],
    },

    // =============================================================================
    // SSR Cycle-1 Section
    // =============================================================================
    {
      id: 'ssr-cycle-1',
      heading: 'Self Study Report - Cycle 1',
      overview:
        'Comprehensive Self Study Report (SSR) submitted for the first cycle of NAAC accreditation, containing detailed analysis of all seven criteria and institutional performance.',
      documents: [
        {
          title: 'SSR Cycle-1 (TNCOGN111259)',
          description: 'Complete Self Study Report for NAAC Cycle 1',
          fileUrl: '/pdfs/naac/ssr/TNCOGN111259.pdf',
          fileType: 'pdf',
          uploadDate: '2024-10-01',
        },
      ],
    },
  ],

  contactInfo: {
    name: 'Dr. IQAC Coordinator',
    role: 'IQAC Coordinator',
    email: 'iqac@jkkn.ac.in',
    phone: '+91-4288-274741',
    officeHours: 'Monday to Friday, 9:00 AM - 5:00 PM',
  },
}
