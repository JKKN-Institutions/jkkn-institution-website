/**
 * Dynamic robots.txt Route Handler
 *
 * This route handler serves institution-specific robots.txt files
 * based on the NEXT_PUBLIC_INSTITUTION_ID environment variable.
 *
 * Each institution can have its own customized robots.txt with
 * detailed comments, specific bot rules, and SEO strategy.
 *
 * Note: This route takes precedence over app/robots.ts
 * The old robots.ts is kept as a reference for the main institution.
 */

import { getRobotsTxt } from '@/lib/config/robots-txt.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jkkn.ac.in'

  // Get institution-specific robots.txt content
  const robotsTxt = getRobotsTxt(institutionId, siteUrl)

  // Return as plain text with proper content type
  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
