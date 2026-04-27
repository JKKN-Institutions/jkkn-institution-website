/**
 * Blog Sitemap Route Handler — Database-Driven
 *
 * Fetches blog posts directly from database for accurate URLs and lastmod dates.
 * Falls back to static config if database is unavailable.
 *
 * URL: /sitemap-blog.xml
 */

import { getBlogSitemap, generateSitemapXML, type SitemapEntry } from '@/lib/config/sitemaps.config'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1-hour edge cache; env vars read at request time

export async function GET() {
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in'

  let entries: SitemapEntry[] = []

  // Try to fetch blog posts from database (real lastmod dates)
  try {
    const supabase = await createServerSupabaseClient()
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .not('slug', 'is', null)

    if (posts && posts.length > 0) {
      entries = posts
        .filter(post => post.slug)
        .map(post => ({
          loc: `${siteUrl}/blog/${post.slug}`,
          lastmod: post.updated_at
            ? new Date(post.updated_at).toISOString().split('T')[0]
            : post.published_at
              ? new Date(post.published_at).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
          changefreq: 'weekly' as const,
          priority: 0.6,
        }))

      // Also add the blog index page
      entries.unshift({
        loc: `${siteUrl}/blog`,
        lastmod: entries[0]?.lastmod || new Date().toISOString().split('T')[0],
        changefreq: 'daily' as const,
        priority: 0.7,
      })
    }
  } catch {
    // Fall back to static config
  }

  // If database fetch returned nothing, use static config
  if (entries.length === 0) {
    entries = getBlogSitemap(siteUrl, institutionId)
  }

  // Return 404 if no blog entries at all
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
