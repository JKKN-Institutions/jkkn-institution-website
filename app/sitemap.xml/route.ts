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

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jkkn.ac.in'

  const sitemapXML = generateSitemapIndexXML(siteUrl, institutionId)

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
