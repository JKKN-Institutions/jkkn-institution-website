import { LocalPdfLinkConfig } from '@/lib/utils/local-pdf'

/**
 * Mandatory Disclosure PDFs Configuration (Local Files)
 *
 * As per AICTE/UGC requirements for mandatory disclosures.
 * Store PDFs in: public/pdfs/mandatory-disclosure/
 */

export const LOCAL_MANDATORY_DISCLOSURE_PDFS: LocalPdfLinkConfig[] = [
  // Main Mandatory Disclosure
  {
    title: 'Mandatory Disclosure',
    pdfPath: 'mandatory-disclosure/Mandatory-Disclosure.pdf',
    description: 'Complete mandatory disclosure as per AICTE/UGC requirements',
    category: 'General Information',
    fileSize: '10.2 MB',
  },
]
