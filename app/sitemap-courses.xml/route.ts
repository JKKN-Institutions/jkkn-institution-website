/**
 * Courses Sitemap Route Handler
 *
 * Serves the sitemap-courses.xml containing all course/department pages
 * (programs, departments, NAAC, NIRF, etc.)
 *
 * URL: /sitemap-courses.xml
 */

import { getCoursesSitemap, generateSitemapXML } from '@/lib/config/sitemaps.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  const entries = getCoursesSitemap(siteUrl, institutionId)

  // Return 404 if institution has no courses sitemap
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
