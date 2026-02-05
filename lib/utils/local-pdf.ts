/**
 * Local PDF Utilities
 *
 * Handles PDFs stored in the project's public directory.
 * PDFs should be stored in public/pdfs/ directory.
 *
 * Directory structure:
 * public/
 * └── pdfs/
 *     ├── committees/
 *     │   ├── anti-ragging/
 *     │   ├── icc/
 *     │   └── ...
 *     ├── alumni/
 *     ├── mandatory-disclosure/
 *     └── others/
 */

/**
 * PDF Link Configuration for local files
 */
export interface LocalPdfLinkConfig {
  title: string
  pdfPath: string // Path relative to public/pdfs/ (e.g., "committees/anti-ragging/members.pdf")
  description?: string
  category?: string
  year?: string
  icon?: string
  fileSize?: string // e.g., "2.5 MB"
  lastUpdated?: string // e.g., "2024-01-15"
}

/**
 * Convert a relative PDF path to a public URL
 * @param pdfPath - Path relative to public/pdfs/ directory
 * @returns Public URL for the PDF
 */
export function getPdfUrl(pdfPath: string): string {
  // Remove leading slash if present
  const cleanPath = pdfPath.startsWith('/') ? pdfPath.slice(1) : pdfPath

  // If path already includes /pdfs/, use as-is
  if (cleanPath.startsWith('pdfs/')) {
    return `/${cleanPath}`
  }

  // Otherwise, prepend /pdfs/
  return `/pdfs/${cleanPath}`
}

/**
 * Get the download URL for a local PDF
 * For local PDFs, this is the same as the view URL
 */
export function getPdfDownloadUrl(pdfPath: string): string {
  return getPdfUrl(pdfPath)
}

/**
 * Process a local PDF link configuration
 */
export function processLocalPdfLink(config: LocalPdfLinkConfig) {
  const url = getPdfUrl(config.pdfPath)

  return {
    ...config,
    viewUrl: url,
    downloadUrl: url,
    publicPath: url,
  }
}

/**
 * Validate that a PDF file exists in the expected location
 * Note: This is a build-time check, not runtime
 */
export function getExpectedPdfPath(pdfPath: string): string {
  return `public/pdfs/${pdfPath}`
}

/**
 * Helper to generate PDF configuration
 */
export function createPdfConfig(
  title: string,
  pdfPath: string,
  options?: {
    description?: string
    category?: string
    year?: string
    fileSize?: string
    lastUpdated?: string
  }
): LocalPdfLinkConfig {
  return {
    title,
    pdfPath,
    ...options,
  }
}

/**
 * Instructions for organizing local PDFs
 */
export const LOCAL_PDF_ORGANIZATION_GUIDE = `
PDF Organization Guide:

1. Store all PDFs in public/pdfs/ directory
2. Organize by category:

public/
└── pdfs/
    ├── committees/
    │   ├── anti-ragging-committee/
    │   │   ├── members-2024-2025.pdf
    │   │   ├── policy.pdf
    │   │   └── affidavit-form.pdf
    │   ├── anti-ragging-squad/
    │   │   └── members.pdf
    │   └── ...
    ├── alumni/
    │   ├── bylaws.pdf
    │   ├── registration-form.pdf
    │   └── newsletters/
    │       ├── 2024-12.pdf
    │       └── 2024-06.pdf
    ├── mandatory-disclosure/
    │   ├── general/
    │   │   ├── institution-details.pdf
    │   │   └── approvals.pdf
    │   ├── academic/
    │   │   ├── faculty-list.pdf
    │   │   └── programs.pdf
    │   └── financial/
    │       ├── fee-structure.pdf
    │       └── scholarships.pdf
    └── others/
        ├── academic-calendar/
        │   └── 2024-2025.pdf
        └── circulars/

3. Use descriptive filenames
4. Include year in filename when relevant
5. Use lowercase and hyphens (not spaces)

Example paths in configuration:
- "committees/anti-ragging-committee/members-2024-2025.pdf"
- "alumni/bylaws.pdf"
- "mandatory-disclosure/general/institution-details.pdf"
`.trim()
