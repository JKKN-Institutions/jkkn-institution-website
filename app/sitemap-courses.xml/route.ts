/**
 * Courses Sitemap Route Handler
 *
 * Serves the sitemap-courses.xml containing all course/department pages
 * (programs, departments, NAAC, NIRF, etc.). Hybrid: starts from the static
 * config, then overlays real `updated_at` dates from cms_pages so each
 * <lastmod> reflects actual content freshness.
 *
 * URL: /sitemap-courses.xml
 */

import { getCoursesSitemap, generateSitemapXML } from '@/lib/config/sitemaps.config'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jkkn.ac.in'

  const entries = getCoursesSitemap(siteUrl, institutionId)

  // Return 404 if institution has no courses sitemap
  if (entries.length === 0) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Overlay real lastmod dates from CMS where the slug matches.
  try {
    const supabase = await createServerSupabaseClient()
    const { data: pages } = await supabase
      .from('cms_pages')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .not('slug', 'is', null)

    if (pages && pages.length > 0) {
      const dbDateMap = new Map<string, string>()
      for (const page of pages) {
        if (page.slug) {
          const date = page.updated_at || page.published_at
          if (date) {
            dbDateMap.set(page.slug, new Date(date).toISOString().split('T')[0])
          }
        }
      }
      for (const entry of entries) {
        const slug = entry.loc
          .replace(siteUrl, '')
          .replace(/^\//, '')
          .replace(/\/$/, '')
        const realDate = dbDateMap.get(slug) || dbDateMap.get(slug + '/')
        if (realDate) {
          entry.lastmod = realDate
        }
      }
    }
  } catch {
    // Static dates remain if DB lookup fails — non-fatal.
  }

  const sitemapXML = generateSitemapXML(entries)

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
