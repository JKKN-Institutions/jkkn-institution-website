/**
 * Pages Sitemap Route Handler
 *
 * Serves the sitemap-pages.xml containing all general pages
 * (about, facilities, policies, etc.)
 *
 * URL: /sitemap-pages.xml
 */

import { getPagesSitemap, generateSitemapXML } from '@/lib/config/sitemaps.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  const entries = getPagesSitemap(siteUrl, institutionId)
  const sitemapXML = generateSitemapXML(entries)

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
