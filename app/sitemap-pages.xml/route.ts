/**
 * Pages Sitemap Route Handler — Hybrid Static + Dynamic
 *
 * Combines static page URLs from config with dynamic CMS pages from database.
 * Uses real `updated_at` timestamps for lastmod instead of build date.
 *
 * URL: /sitemap-pages.xml
 */

import { getPagesSitemap, generateSitemapXML, type SitemapEntry } from '@/lib/config/sitemaps.config'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  // Start with static config entries (known routes)
  const staticEntries = getPagesSitemap(siteUrl, institutionId)

  // Fetch CMS pages from database for real lastmod dates
  let dynamicEntries: SitemapEntry[] = []
  try {
    const supabase = await createServerSupabaseClient()
    const { data: pages } = await supabase
      .from('cms_pages')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .not('slug', 'is', null)

    if (pages) {
      // Create a map of slug → real lastmod from database
      const dbDateMap = new Map<string, string>()
      for (const page of pages) {
        if (page.slug) {
          const date = page.updated_at || page.published_at
          if (date) {
            dbDateMap.set(page.slug, new Date(date).toISOString().split('T')[0])
          }
        }
      }

      // Update static entries with real lastmod dates where available
      for (const entry of staticEntries) {
        const slug = entry.loc.replace(siteUrl, '').replace(/^\//, '')
        const realDate = dbDateMap.get(slug) || dbDateMap.get(slug + '/')
        if (realDate) {
          entry.lastmod = realDate
        }
      }

      // Add CMS pages that aren't already in static config
      const staticSlugs = new Set(staticEntries.map(e =>
        e.loc.replace(siteUrl, '').replace(/^\//, '').replace(/\/$/, '')
      ))

      dynamicEntries = pages
        .filter(p => {
          if (!p.slug || p.slug === '' || p.slug === '/') return false
          const normalized = p.slug.replace(/^\//, '').replace(/\/$/, '')
          return !staticSlugs.has(normalized)
            && !normalized.startsWith('admin')
            && !normalized.startsWith('blog/')
            && !normalized.startsWith('careers/')
        })
        .map(p => ({
          loc: `${siteUrl}/${p.slug}`,
          lastmod: p.updated_at
            ? new Date(p.updated_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          changefreq: 'monthly' as const,
          priority: 0.6,
        }))
    }
  } catch {
    // If DB fetch fails, fall back to static entries only
  }

  const allEntries = [...staticEntries, ...dynamicEntries]
  const sitemapXML = generateSitemapXML(allEntries)

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
