import { LocalPdfLinkConfig } from '@/lib/utils/local-pdf'

/**
 * Committee PDFs Configuration (Local Files)
 *
 * Store PDFs in: public/pdfs/committees/
 */

export const LOCAL_COMMITTEE_PDFS: Record<string, LocalPdfLinkConfig[]> = {
  'anti-ragging-committee': [
    {
      title: 'Anti-Ragging Committee',
      pdfPath: 'committees/ANTI-Ragging-Committee.pdf',
      description: 'Complete information about Anti-Ragging Committee members and procedures',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '221 KB',
    },
  ],
  'anti-ragging-squad': [
    {
      title: 'Anti-Ragging Squad',
      pdfPath: 'committees/ANTI-Ragging-Squad.pdf',
      description: 'Anti-Ragging Squad members and emergency response procedures',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '30 KB',
    },
  ],
  'anti-drug-club': [
    {
      title: 'Anti Drug Club',
      pdfPath: 'committees/ANTI-DRUG-CLUB.pdf',
      description: 'Anti Drug Club information and awareness programs',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '31 KB',
    },
  ],
  'anti-drug-committee': [
    {
      title: 'Drug-Free Tamil Nadu Orientation Programme',
      pdfPath: 'others/09.07.2025-Drug-Free-Tamil-Nadu-Orientation-Program-1.pdf',
      description: 'Drug-Free Tamil Nadu Orientation Programme details',
      category: 'Programs',
      year: '2025',
      fileSize: '23 MB',
    },
  ],
  'internal-complaint-committee': [
    {
      title: 'Internal Complaints Committee',
      pdfPath: 'committees/Internal-Complaint-Committee-1.pdf',
      description: 'Internal Complaints Committee members and complaint procedures',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '160 KB',
    },
  ],
  'grievance-and-redressal': [
    {
      title: 'Grievances and Redressal Committee',
      pdfPath: 'committees/GRIEVANCES-AND-REDRESSAL-COMMITTEE.pdf',
      description: 'Grievance redressal mechanism and committee details',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '205 KB',
    },
  ],
  'sc-st-committee': [
    {
      title: 'SC-ST Committee',
      pdfPath: 'committees/SC-ST-Committee.pdf',
      description: 'SC-ST Committee members and welfare schemes',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '203 KB',
    },
  ],
  'library-committee': [
    {
      title: 'Library Committee',
      pdfPath: 'committees/Library-Committee.pdf',
      description: 'Library committee members and policies',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '287 KB',
    },
  ],
  'library-advisory-committee': [
    {
      title: 'Library Advisory Committee',
      pdfPath: 'committees/Library-Committee-1.pdf',
      description: 'Library Advisory Committee details',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '287 KB',
    },
  ],
  'minority-committee': [
    {
      title: 'Minority Committee',
      pdfPath: 'others/Minority-committee.pdf',
      description: 'Minority welfare committee information',
      category: 'Committee Information',
      year: '2024-2025',
      fileSize: '52 KB',
    },
  ],
}
