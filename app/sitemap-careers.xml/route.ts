/**
 * Careers Sitemap Route Handler — one entry per open job.
 *
 * Job pages are not linked from any static page list (the listing paginates
 * and its filtered views are noindex), so this file is how crawlers find them.
 * URLs come from the same cached MyJKKN feed and slug rules as the pages
 * themselves, so a sitemap entry can never point at a slug the site won't serve.
 *
 * URL: /sitemap-careers.xml
 */

import { NextResponse } from 'next/server'
import { generateSitemapXML, type SitemapEntry } from '@/lib/config/sitemaps.config'
import { getSiteCareers } from '@/lib/services/public-careers-search'
import { getSiteUrl } from '@/lib/utils/site-url'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const siteUrl = getSiteUrl()

  let entries: SitemapEntry[]
  try {
    const site = await getSiteCareers()
    entries = site.index.jobs.map(item => ({
      loc: `${siteUrl}/careers/${item.slug}`,
      // The posted date when HR recorded one, otherwise no lastmod at all —
      // never today's date as a filler (see sitemap-blog.xml for the reasoning).
      lastmod: item.postedTime ? new Date(item.postedTime).toISOString().split('T')[0] : undefined,
      changefreq: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (err) {
    // MyJKKN is unreachable. An empty sitemap would tell Google every job is
    // gone; a 503 tells it to keep what it has and come back.
    console.error('[sitemap-careers] feed unavailable', err)
    return new NextResponse('Service Unavailable', { status: 503, headers: { 'Retry-After': '600' } })
  }

  return new NextResponse(generateSitemapXML(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
