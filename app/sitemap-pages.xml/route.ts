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
import { getSiteUrl } from '@/lib/utils/site-url'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

// CMS slugs that duplicate canonical routes — must never appear as separate URLs
// 'home' is a common CMS draft slug for '/' and would otherwise create a W7 duplicate
// 'blog' is emitted by getMainBlog() into sitemap-blog.xml; a CMS page of the same slug
// put https://www.jkkn.ac.in/blog into TWO child sitemaps at once (measured 2026-09-07)
const RESERVED_CMS_SLUGS = new Set(['home', 'blog'])

// Slugs that middleware 301-redirects (proxy.ts -> OLD_FACILITY_PAGES). A published CMS
// row can still exist for these, and it did for 'bank-post-office', which shipped in the
// sitemap while the live URL answered 301 to '/' (measured 2026-09-07, both passes).
// A sitemap must never advertise a redirecting URL.
// SOURCE OF TRUTH is proxy.ts. Kept as a literal here on purpose: importing from the
// middleware would pull its Supabase client into this route's bundle. If proxy.ts gains
// or loses an entry, mirror it here.
const MIDDLEWARE_REDIRECTED_SLUGS = new Set([
  'food-court', 'smart-classroom', 'wi-fi-campus', 'bus', 'portal', 'bank-post-office',
  'emergancy-care', 'lab', 'laboratory', 'digital-campus', 'digital-campus1',
  'our-vision-and-mission', 'seminor-hall', 'facilities/seminar-hall', 'google-workspace',
  'terms', 'world-health-days/feed', 'intellectual-property-rights-day-2/feed',
])

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = getSiteUrl()

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
          if (MIDDLEWARE_REDIRECTED_SLUGS.has(normalized)) return false
          if (otherSitemapSlugs.has(normalized)) return false
          // Engineering: legacy long-form city URLs are 301-redirected to short
          // canonicals (/{city}) by next.config.ts. Sitemap must never advertise
          // redirected URLs — wastes crawl budget and dilutes the short-URL signal.
          if (institutionId === 'engineering' && normalized.startsWith('best-engineering-college-in-')) {
            return false
          }
          return !staticSlugs.has(normalized)
            && !normalized.startsWith('admin')
            && !normalized.startsWith('blog/')
            && !normalized.startsWith('careers/')
        })
        .map(p => {
          // updated_at, then published_at, then NOTHING. The old code fell back to
          // new Date(), which stamped today's date on every CMS row whose updated_at is
          // NULL. On engineering that was all 13 rows whose slug 404s (measured
          // 2026-09-10): the sitemap told Google the dead URLs had changed today, every
          // day. published_at is already selected above and the dbDateMap a few lines up
          // already uses this same `updated_at || published_at` chain - the two paths
          // were simply inconsistent.
          const realDate = p.updated_at || p.published_at
          return {
            loc: `${siteUrl}/${p.slug}`,
            lastmod: realDate
              ? new Date(realDate).toISOString().split('T')[0]
              : undefined,
            changefreq: 'monthly' as const,
            priority: 0.6,
          }
        })
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
