/**
 * Multi-Institution Sitemap Configuration
 *
 * This file stores sitemap content for each institution.
 * Sitemaps are dynamically generated based on NEXT_PUBLIC_INSTITUTION_ID
 * and NEXT_PUBLIC_SITE_URL environment variables.
 *
 * Each institution can have:
 * - sitemap.xml (main index)
 * - sitemap-pages.xml (general pages)
 * - sitemap-courses.xml (courses/departments)
 * - sitemap-blog.xml (blog/events/news)
 */

export interface SitemapEntry {
  loc: string
  lastmod: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export interface SitemapIndex {
  loc: string
  lastmod: string
}

export interface InstitutionSitemaps {
  index: SitemapIndex[]
  pages: SitemapEntry[]
  courses: SitemapEntry[]
  blog: SitemapEntry[]
}

/**
 * Get sitemap index (main sitemap.xml) for an institution
 */
export function getSitemapIndex(siteUrl: string, institutionId: string): SitemapIndex[] {
  const config: { [key: string]: SitemapIndex[] } = {
    engineering: [
      { loc: `${siteUrl}/sitemap-pages.xml`, lastmod: '2026-02-16' },
      { loc: `${siteUrl}/sitemap-courses.xml`, lastmod: '2026-02-16' },
      { loc: `${siteUrl}/sitemap-blog.xml`, lastmod: '2026-02-16' },
    ],
    main: [
      { loc: `${siteUrl}/sitemap-pages.xml`, lastmod: '2026-02-16' },
    ],
  }

  return config[institutionId] || config.main
}

/**
 * Get pages sitemap for an institution
 */
export function getPagesSitemap(siteUrl: string, institutionId: string): SitemapEntry[] {
  if (institutionId === 'engineering') {
    return getEngineeringPages(siteUrl)
  }

  return getMainPages(siteUrl)
}

/**
 * Get courses sitemap for an institution
 */
export function getCoursesSitemap(siteUrl: string, institutionId: string): SitemapEntry[] {
  if (institutionId === 'engineering') {
    return getEngineeringCourses(siteUrl)
  }

  return []
}

/**
 * Get blog sitemap for an institution
 */
export function getBlogSitemap(siteUrl: string, institutionId: string): SitemapEntry[] {
  if (institutionId === 'engineering') {
    return getEngineeringBlog(siteUrl)
  }

  return []
}

/**
 * Engineering College - Pages Sitemap
 */
function getEngineeringPages(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}`, lastmod: '2026-02-16', changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/about`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/over-view`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-trust`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-management`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-institutions`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/principals-message`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/institution-rules`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/organogram`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/gallery`, lastmod: '2026-02-16', changefreq: 'weekly', priority: 0.7 },
    { loc: `${siteUrl}/library`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/auditorium`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/hospital`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities/transport`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/facilities/sports`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities/food-court`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities/class-room`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/career-opportunities`, lastmod: '2026-02-16', changefreq: 'weekly', priority: 0.8 },
    { loc: `${siteUrl}/sports-achievements`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/help-desk`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/privacy-policy`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.3 },
    { loc: `${siteUrl}/mandatory-disclosure`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/policy`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/committee`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/others`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/institutional-plan`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/academic-calendar`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/others/academic-calendar`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
  ]
}

/**
 * Engineering College - Courses Sitemap
 */
function getEngineeringCourses(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/courses-offered`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/department-of-ece`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/department-of-master-of-business-administration`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/ug/be-ece`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/ug/sh`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/courses-offered/pg/mba`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/naac`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/nirf-2`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/nirf2024`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/nirf-2025`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/program-outcomes-pos`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/program-specific-outcomes-psos`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/demo1`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/student-support-and-progression`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/criterion-5-student-support-and-progression-140`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/electoral-literacy-club`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/iqac/nirf/nirf-2024`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.5 },
  ]
}

/**
 * Engineering College - Blog Sitemap
 */
function getEngineeringBlog(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/orbitra26`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/technovanza-2k25`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/placement-day-celebration-2025`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/session-on-angel-investment`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/16th-sports-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/environmental-talk`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/environmental-talk-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/art-festival`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/safer-internet-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/safer-internet-day-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/world-water-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/world-population-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/international-yoga-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/international-happiness-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/international-plastic-bag-free-day-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/inaipirai-inauguration-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/golden-hour-placement-training-program-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/solar-future-leaders-workshop-2025-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/solar-energy-innovation-workshop-2025-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/sustainable-energy-leaders-workshop-selw-2025-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/essentials-of-electric-vehicle-technology-2025-2`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/77th-independence-day-celebration-in-our-college-campus`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-student-led-conferences`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-learner-lead-conference-llc`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-conducted-cyber-security-workshop`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-conducted-placement-training-internship-programe`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/the-impact-of-artificial-intelligence-on-healthcare`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/fostering-entrepreneurship-development-and-innovation`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/insights-into-non-destructive-testing`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/iot-driven-embedded-systems-from-prototype-to-deployment`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/technical-seminar-on-robotics-in-healthcare`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/suceess-storie-cook-without-fire`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/web-stories/independence-day-celebration`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/web-stories/electoral-literacy-club`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/web-stories/celebrated-26th-republic-day`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.4 },
  ]
}

/**
 * Main Institution - Pages Sitemap (Placeholder)
 */
function getMainPages(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}`, lastmod: '2026-02-16', changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/about`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
  ]
}

/**
 * Generate XML for sitemap index
 */
export function generateSitemapIndexXML(siteUrl: string, institutionId: string): string {
  const sitemaps = getSitemapIndex(siteUrl, institutionId)

  const sitemapEntries = sitemaps
    .map(
      (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>
`
}

/**
 * Generate XML for URL set sitemap
 */
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const urlEntries = entries
    .map((entry) => {
      let xml = `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>`

      if (entry.changefreq) {
        xml += `\n    <changefreq>${entry.changefreq}</changefreq>`
      }

      if (entry.priority !== undefined) {
        xml += `\n    <priority>${entry.priority}</priority>`
      }

      xml += `\n  </url>`
      return xml
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
}
