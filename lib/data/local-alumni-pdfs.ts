import { LocalPdfLinkConfig } from '@/lib/utils/local-pdf'

/**
 * Alumni PDFs Configuration (Local Files)
 *
 * Store PDFs in: public/pdfs/alumni/
 */

export const LOCAL_ALUMNI_PDFS: LocalPdfLinkConfig[] = [
  // Alumni Association
  {
    title: 'Alumni Association',
    pdfPath: 'alumni/Alumni-Association-1.pdf',
    description: 'Alumni association information and details',
    category: 'Association Documents',
    year: '2024',
    fileSize: '13 KB',
  },
]
