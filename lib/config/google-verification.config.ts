/**
 * Google Search Console Verification Configuration
 *
 * This file stores Google Search Console verification files for each institution.
 * Each institution has its own verification file from Google Search Console.
 *
 * To add a new verification file:
 * 1. Add the institution's verification to the config below
 * 2. The route handler will automatically serve it at the root level
 */

export interface GoogleVerification {
  filename: string
  content: string
}

interface GoogleVerificationConfig {
  [institutionId: string]: GoogleVerification | null
}

const VERIFICATION_CONFIG: GoogleVerificationConfig = {
  engineering: {
    filename: 'googlee5e5c9d47bc383e1.html',
    content: 'google-site-verification: googlee5e5c9d47bc383e1.html',
  },
  main: {
    filename: 'googlee5e5c9d47bc383e1.html',
    content: 'google-site-verification: googlee5e5c9d47bc383e1.html',
  },
  dental: null, // Add when available
  pharmacy: null, // Add when available
  'arts-science': null, // Add when available
  nursing: null, // Add when available
}

/**
 * Get Google verification file for current institution
 */
export function getGoogleVerification(institutionId: string): GoogleVerification | null {
  return VERIFICATION_CONFIG[institutionId.toLowerCase()] || null
}

/**
 * Check if a filename matches any institution's verification file
 * Returns the verification content if found, null otherwise
 */
export function getVerificationByFilename(filename: string, institutionId: string): string | null {
  const verification = getGoogleVerification(institutionId)

  if (verification && verification.filename === filename) {
    return verification.content
  }

  return null
}

/**
 * Get all verification filenames (for debugging)
 */
export function getAllVerificationFilenames(): string[] {
  return Object.values(VERIFICATION_CONFIG)
    .filter((v): v is GoogleVerification => v !== null)
    .map((v) => v.filename)
}
