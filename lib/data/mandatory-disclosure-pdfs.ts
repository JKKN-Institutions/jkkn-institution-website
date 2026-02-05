import { PdfLinkConfig } from '@/lib/utils/google-drive-pdf'

/**
 * Mandatory Disclosure PDFs Configuration
 *
 * As per AICTE/UGC requirements for mandatory disclosures.
 * Replace the driveUrl values with your actual Google Drive links.
 */

export const MANDATORY_DISCLOSURE_PDFS: PdfLinkConfig[] = [
  // General Information
  {
    title: 'Institution Details',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Name, address, phone, email, and website details',
    category: 'General Information',
  },
  {
    title: 'Approvals and Affiliations',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'AICTE approval letter, university affiliation certificate',
    category: 'General Information',
  },
  {
    title: 'Trust/Society/Company Details',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Registration certificate and details',
    category: 'General Information',
  },

  // Governance
  {
    title: 'Governing Body Members',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'List of governing body members with qualifications',
    category: 'Governance',
    year: '2024-2025',
  },
  {
    title: 'Principal/Director Information',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Details of principal/director with qualifications and experience',
    category: 'Governance',
  },

  // Academic Information
  {
    title: 'Programs and Intake',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'List of approved programs with sanctioned intake',
    category: 'Academic Information',
    year: '2024-2025',
  },
  {
    title: 'Faculty List with Qualifications',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Complete faculty list with qualifications and experience',
    category: 'Academic Information',
    year: '2024-2025',
  },
  {
    title: 'Student-Teacher Ratio',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Department-wise student-teacher ratio',
    category: 'Academic Information',
    year: '2024-2025',
  },
  {
    title: 'Academic Calendar',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Annual academic calendar with important dates',
    category: 'Academic Information',
    year: '2024-2025',
  },

  // Infrastructure
  {
    title: 'Campus Infrastructure',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Details of classrooms, labs, library, and facilities',
    category: 'Infrastructure',
  },
  {
    title: 'Laboratory Facilities',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Department-wise laboratory details with equipment list',
    category: 'Infrastructure',
  },
  {
    title: 'Library Resources',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Number of books, journals, e-resources',
    category: 'Infrastructure',
  },
  {
    title: 'Hostel Facilities',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Boys and girls hostel details with capacity',
    category: 'Infrastructure',
  },

  // Financial Information
  {
    title: 'Fee Structure',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Approved fee structure for all programs',
    category: 'Financial Information',
    year: '2024-2025',
  },
  {
    title: 'Scholarships and Financial Aid',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Available scholarships and financial assistance schemes',
    category: 'Financial Information',
    year: '2024-2025',
  },
  {
    title: 'Audited Financial Statement',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Latest audited financial statement',
    category: 'Financial Information',
    year: '2023-2024',
  },

  // Admission & Placements
  {
    title: 'Admission Process',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Detailed admission process and eligibility criteria',
    category: 'Admissions',
    year: '2024-2025',
  },
  {
    title: 'Admission Statistics',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Previous year admission statistics',
    category: 'Admissions',
    year: '2023-2024',
  },
  {
    title: 'Placement Statistics',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Department-wise placement statistics',
    category: 'Placements',
    year: '2023-2024',
  },
  {
    title: 'Recruiters List',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'List of companies visiting for campus recruitment',
    category: 'Placements',
    year: '2023-2024',
  },

  // Examination & Results
  {
    title: 'Examination Results',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Pass percentage and university ranks',
    category: 'Results',
    year: '2023-2024',
  },
  {
    title: 'Topper Details',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'List of university rank holders',
    category: 'Results',
    year: '2023-2024',
  },

  // Committees & Cells
  {
    title: 'Anti-Ragging Committee',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Anti-ragging committee members and policies',
    category: 'Committees',
    year: '2024-2025',
  },
  {
    title: 'Internal Complaints Committee',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'ICC members and guidelines',
    category: 'Committees',
    year: '2024-2025',
  },
  {
    title: 'Grievance Redressal Committee',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Grievance redressal mechanism and committee',
    category: 'Committees',
    year: '2024-2025',
  },
  {
    title: 'SC/ST Cell',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'SC/ST cell members and welfare schemes',
    category: 'Committees',
    year: '2024-2025',
  },

  // Policies
  {
    title: 'Code of Conduct',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Code of conduct for students and staff',
    category: 'Policies',
  },
  {
    title: 'Anti-Ragging Policy',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Complete anti-ragging policy',
    category: 'Policies',
  },
  {
    title: 'Sexual Harassment Prevention Policy',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'POSH policy and guidelines',
    category: 'Policies',
  },
  {
    title: 'Reservation Policy',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Reservation policy for SC/ST/OBC/EWS',
    category: 'Policies',
  },

  // Others
  {
    title: 'NBA/NAAC Accreditation',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Accreditation certificates and reports',
    category: 'Accreditation',
  },
  {
    title: 'NIRF Ranking',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'NIRF ranking details and data',
    category: 'Rankings',
    year: '2024',
  },
  {
    title: 'Annual Report',
    driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
    description: 'Institutional annual report',
    category: 'Reports',
    year: '2023-2024',
  },
]
