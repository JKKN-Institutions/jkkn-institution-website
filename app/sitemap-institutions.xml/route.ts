/**
 * Institutions Sitemap Route Handler
 *
 * Serves the sitemap-institutions.xml containing all institution/college pages
 * (colleges, schools, individual institution pages)
 *
 * URL: /sitemap-institutions.xml
 */

import { getInstitutionsSitemap, generateSitemapXML } from '@/lib/config/sitemaps.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  const entries = getInstitutionsSitemap(siteUrl, institutionId)

  // Return 404 if institution has no institutions sitemap
  if (entries.length === 0) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const sitemapXML = generateSitemapXML(entries)

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
