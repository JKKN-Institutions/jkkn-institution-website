import { LocalPdfLinkConfig } from '@/lib/utils/local-pdf'

/**
 * Approvals and Affiliations PDFs Configuration
 *
 * Store PDFs in: public/pdfs/approvals/
 */

export const LOCAL_APPROVALS_PDFS: LocalPdfLinkConfig[] = [
  {
    title: 'Anna University Affiliation Order (2008-2023)',
    pdfPath: 'approvals/Anna-University-Affiliation-order-2008-2023.pdf',
    description: 'Anna University affiliation order from 2008 to 2023',
    category: 'Affiliations',
    year: '2008-2023',
    fileSize: '17.3 MB',
  },
  {
    title: 'Anna University Examination Regulation 2021',
    pdfPath: 'approvals/Anna-university-Examination-Regulation-2021 (1).pdf',
    description: 'Anna University examination regulation 2021',
    category: 'Examination Rules',
    year: '2021',
    fileSize: '662 KB',
  },
  {
    title: 'Anna University Affiliation 2023-24',
    pdfPath: 'approvals/AU-Aff-23-24.pdf',
    description: 'Anna University affiliation for academic year 2023-24',
    category: 'Affiliations',
    year: '2023-2024',
    fileSize: '557 KB',
  },
  {
    title: 'EOA Report 2024-2025',
    pdfPath: 'approvals/EOA-Report-2024-2025.pdf',
    description: 'Extension of Approval (EOA) report for academic year 2024-2025',
    category: 'AICTE Approvals',
    year: '2024-2025',
    fileSize: '214 KB',
  },
  {
    title: 'Right to Information (RTI)',
    pdfPath: 'approvals/RTI-Final.pdf',
    description: 'Right to Information Act details and procedures',
    category: 'Transparency',
    fileSize: '17 KB',
  },
]
