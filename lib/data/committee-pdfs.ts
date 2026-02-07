import { PdfLinkConfig } from '@/lib/utils/google-drive-pdf'

/**
 * Committee PDFs Configuration
 *
 * Replace the driveUrl values with your actual Google Drive links.
 *
 * How to get Google Drive links:
 * 1. Upload PDF to Google Drive
 * 2. Right-click → Share → Change to "Anyone with the link"
 * 3. Copy the link
 * 4. Paste it in driveUrl field below
 */

export const COMMITTEE_PDFS: Record<string, PdfLinkConfig[]> = {
  'anti-ragging-committee': [
    {
      title: 'Anti-Ragging Committee Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE', // Replace with actual link
      description: 'List of committee members and their responsibilities',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Anti-Ragging Policy',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Complete anti-ragging policy and procedures',
      category: 'Policies',
      year: '2024-2025',
    },
    {
      title: 'Anti-Ragging Affidavit Form',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Affidavit form to be filled by students',
      category: 'Forms',
    },
  ],
  'anti-ragging-squad': [
    {
      title: 'Anti-Ragging Squad Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'List of squad members and contact information',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Emergency Contact Numbers',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: '24/7 emergency contact numbers for ragging incidents',
      category: 'Contact Information',
    },
  ],
  'anti-drug-club': [
    {
      title: 'Anti Drug Club Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Club members and coordinators',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Drug Awareness Programs',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Annual calendar of awareness programs and workshops',
      category: 'Activities',
      year: '2024-2025',
    },
  ],
  'anti-drug-committee': [
    {
      title: 'Anti Drug Committee Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Committee composition and roles',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Drug Prevention Policy',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Institute policy on drug prevention and intervention',
      category: 'Policies',
      year: '2024-2025',
    },
  ],
  'internal-complaint-committee': [
    {
      title: 'ICC Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Internal Complaints Committee members',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'ICC Guidelines',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Guidelines for filing and addressing complaints',
      category: 'Policies',
    },
    {
      title: 'Complaint Form',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Official complaint registration form',
      category: 'Forms',
    },
  ],
  'grievance-and-redressal': [
    {
      title: 'Grievance Redressal Committee',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Committee members and contact details',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Grievance Filing Process',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Step-by-step process for filing grievances',
      category: 'Procedures',
    },
  ],
  'sc-st-committee': [
    {
      title: 'SC-ST Committee Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Committee members for SC-ST welfare',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'SC-ST Welfare Schemes',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Available welfare schemes and scholarships',
      category: 'Schemes',
      year: '2024-2025',
    },
  ],
  'library-committee': [
    {
      title: 'Library Committee Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Library committee composition',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Library Acquisition Policy',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Policy for acquiring new books and resources',
      category: 'Policies',
    },
  ],
  'library-advisory-committee': [
    {
      title: 'Library Advisory Committee Members',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Advisory committee members',
      category: 'Committee Information',
      year: '2024-2025',
    },
    {
      title: 'Library Development Plan',
      driveUrl: 'YOUR_GOOGLE_DRIVE_LINK_HERE',
      description: 'Strategic plan for library development',
      category: 'Planning',
      year: '2024-2025',
    },
  ],
}
