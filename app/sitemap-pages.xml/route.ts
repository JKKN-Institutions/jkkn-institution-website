/**
 * Pages Sitemap Route Handler — Hybrid Static + Dynamic
 *
 * Combines static page URLs from config with dynamic CMS pages from database.
 * Uses real `updated_at` timestamps for lastmod instead of build date.
 *
 * URL: /sitemap-pages.xml
 */

import {
  getPagesSitemap,
  getInstitutionsSitemap,
  getCoursesSitemap,
  generateSitemapXML,
  type SitemapEntry,
} from '@/lib/config/sitemaps.config'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

// CMS slugs that duplicate canonical routes — must never appear as separate URLs
// 'home' is a common CMS draft slug for '/' and would otherwise create a W7 duplicate
const RESERVED_CMS_SLUGS = new Set(['home'])

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jkkn.ac.in'

  // Start with static config entries (known routes)
  const staticEntries = getPagesSitemap(siteUrl, institutionId)

  // Build a unified exclusion set: pages already in this sitemap PLUS slugs that
  // live in the other sub-sitemaps (institutions, courses) so we never emit the
  // same URL across two child sitemaps in the same index.
  const slugFromLoc = (loc: string) =>
    loc.replace(siteUrl, '').replace(/^\//, '').replace(/\/$/, '')

  const otherSitemapSlugs = new Set([
    ...getInstitutionsSitemap(siteUrl, institutionId).map(e => slugFromLoc(e.loc)),
    ...getCoursesSitemap(siteUrl, institutionId).map(e => slugFromLoc(e.loc)),
  ])

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
        const slug = slugFromLoc(entry.loc)
        const realDate = dbDateMap.get(slug) || dbDateMap.get(slug + '/')
        if (realDate) {
          entry.lastmod = realDate
        }
      }

      // Add CMS pages that aren't already in static config or a sibling sitemap
      const staticSlugs = new Set(staticEntries.map(e => slugFromLoc(e.loc)))

      dynamicEntries = pages
        .filter(p => {
          if (!p.slug || p.slug === '' || p.slug === '/') return false
          const normalized = p.slug.replace(/^\//, '').replace(/\/$/, '')
          if (RESERVED_CMS_SLUGS.has(normalized)) return false
          if (otherSitemapSlugs.has(normalized)) return false
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
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
