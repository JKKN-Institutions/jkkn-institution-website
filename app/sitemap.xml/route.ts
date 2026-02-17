/**
 * Main Sitemap Index Route Handler
 *
 * Serves the main sitemap.xml (sitemap index) dynamically based on
 * the institution. This file references all sub-sitemaps.
 *
 * URL: /sitemap.xml
 */

import { generateSitemapIndexXML } from '@/lib/config/sitemaps.config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  const sitemapXML = generateSitemapIndexXML(siteUrl, institutionId)

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
