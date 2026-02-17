/**
 * Google Search Console Verification Route Handler
 *
 * This dynamic route handles Google Search Console verification files
 * for all institutions. Each institution has its own verification file.
 *
 * Pattern: /google[hash].html
 * Example: /googlee5e5c9d47bc383e1.html (Main & Engineering)
 *
 * Note: Main and Engineering institutions share the same verification file
 * as they are in the same Google Search Console account.
 *
 * The route automatically serves the correct verification file based on
 * the NEXT_PUBLIC_INSTITUTION_ID environment variable.
 */

import { getVerificationByFilename } from '@/lib/config/google-verification.config'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 86400 // Cache for 24 hours

/**
 * Generate static params for all Google verification files
 * This ensures all verification files are pre-rendered at build time
 */
export async function generateStaticParams() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'

  // Only generate param for the current institution's verification file
  const verificationFiles: string[] = []

  // Add institution-specific verification file
  if (institutionId === 'engineering') {
    verificationFiles.push('googlee5e5c9d47bc383e1.html')
  }

  if (institutionId === 'main') {
    verificationFiles.push('googlee5e5c9d47bc383e1.html')
  }

  // Add more institutions as they get verification files
  // if (institutionId === 'dental') {
  //   verificationFiles.push('google[dental-hash].html')
  // }

  return verificationFiles.map((filename) => ({
    googleVerification: filename,
  }))
}

/**
 * Handle GET requests for Google verification files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { googleVerification: string } }
) {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const filename = params.googleVerification

  // Check if this filename matches the current institution's verification file
  const content = getVerificationByFilename(filename, institutionId)

  if (!content) {
    // File not found for this institution
    return new NextResponse('Not Found', { status: 404 })
  }

  // Return the verification content
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
