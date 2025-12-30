'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  STATIC_ROUTES,
  buildSitemapUrl,
  formatSitemapDate,
  getSitemapConfig,
  shouldExcludeUrl,
} from '@/lib/seo/sitemap-config'
import type { MetadataRoute } from 'next'

/**
 * Sitemap URL entry type
 */
export type SitemapUrl = MetadataRoute.Sitemap[number]

/**
 * Fetches all URLs that should be included in the sitemap
 * Combines static routes with dynamic content from the database
 */
export async function getSitemapUrls(): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = []

  // Add static routes
  for (const [path, config] of Object.entries(STATIC_ROUTES)) {
    urls.push({
      url: buildSitemapUrl(path),
      lastModified: new Date(),
      changeFrequency: config.changeFrequency,
      priority: config.priority,
    })
  }

  // Fetch dynamic content from database
  const [cmsPages, blogPosts, careerJobs] = await Promise.all([
    getCmsPageUrls(),
    getBlogPostUrls(),
    getCareerJobUrls(),
  ])

  urls.push(...cmsPages, ...blogPosts, ...careerJobs)

  return urls
}

/**
 * Fetch published CMS pages for sitemap
 */
async function getCmsPageUrls(): Promise<SitemapUrl[]> {
  const supabase = await createServerSupabaseClient()

  const { data: pages, error } = await supabase
    .from('cms_pages')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .not('slug', 'is', null)

  if (error) {
    console.error('Error fetching CMS pages for sitemap:', error)
    return []
  }

  return (pages || [])
    .filter((page) => {
      // Skip homepage (already in static routes) and excluded paths
      if (!page.slug || page.slug === '' || page.slug === '/') return false
      return !shouldExcludeUrl(`/${page.slug}`)
    })
    .map((page) => {
      const path = `/${page.slug}`
      const config = getSitemapConfig(path)
      return {
        url: buildSitemapUrl(path),
        lastModified: formatSitemapDate(page.updated_at || page.published_at),
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      }
    })
}

/**
 * Fetch published blog posts for sitemap
 */
async function getBlogPostUrls(): Promise<SitemapUrl[]> {
  const supabase = await createServerSupabaseClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, published_at, updated_at')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .not('slug', 'is', null)

  if (error) {
    console.error('Error fetching blog posts for sitemap:', error)
    return []
  }

  return (posts || [])
    .filter((post) => post.slug)
    .map((post) => {
      const path = `/blog/${post.slug}`
      const config = getSitemapConfig(path)
      return {
        url: buildSitemapUrl(path),
        lastModified: formatSitemapDate(post.updated_at || post.published_at),
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      }
    })
}

/**
 * Fetch active career job postings for sitemap
 */
async function getCareerJobUrls(): Promise<SitemapUrl[]> {
  const supabase = await createServerSupabaseClient()

  // Only include jobs that are published and not expired
  const { data: jobs, error } = await supabase
    .from('career_jobs')
    .select('slug, updated_at, published_at, deadline')
    .eq('status', 'published')
    .or(`deadline.is.null,deadline.gt.${new Date().toISOString()}`)
    .not('slug', 'is', null)

  if (error) {
    console.error('Error fetching career jobs for sitemap:', error)
    return []
  }

  return (jobs || [])
    .filter((job) => job.slug)
    .map((job) => {
      const path = `/careers/${job.slug}`
      const config = getSitemapConfig(path)
      return {
        url: buildSitemapUrl(path),
        lastModified: formatSitemapDate(job.updated_at || job.published_at),
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      }
    })
}

/**
 * Get sitemap stats for admin dashboard
 */
export async function getSitemapStats(): Promise<{
  totalUrls: number
  cmsPages: number
  blogPosts: number
  careerJobs: number
  staticRoutes: number
}> {
  const supabase = await createServerSupabaseClient()

  const [cmsCount, blogCount, careerCount] = await Promise.all([
    supabase
      .from('cms_pages')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('visibility', 'public'),
    supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('visibility', 'public'),
    supabase
      .from('career_jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .or(`deadline.is.null,deadline.gt.${new Date().toISOString()}`),
  ])

  const staticRoutes = Object.keys(STATIC_ROUTES).length

  return {
    totalUrls:
      staticRoutes +
      (cmsCount.count || 0) +
      (blogCount.count || 0) +
      (careerCount.count || 0),
    cmsPages: cmsCount.count || 0,
    blogPosts: blogCount.count || 0,
    careerJobs: careerCount.count || 0,
    staticRoutes,
  }
}
