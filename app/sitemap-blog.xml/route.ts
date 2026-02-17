/**
 * Blog Sitemap Route Handler
 *
 * Serves the sitemap-blog.xml containing all blog/news/events pages
 *
 * URL: /sitemap-blog.xml
 */

import { getBlogSitemap, generateSitemapXML } from '@/lib/config/sitemaps.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  const entries = getBlogSitemap(siteUrl, institutionId)

  // Return 404 if institution has no blog sitemap
  if (entries.length === 0) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const sitemapXML = generateSitemapXML(entries)

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
