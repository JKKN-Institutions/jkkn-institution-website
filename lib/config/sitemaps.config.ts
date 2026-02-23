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
 * - sitemap-institutions.xml (institution/college pages)
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
  institutions: SitemapEntry[]
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
      { loc: `${siteUrl}/sitemap-institutions.xml`, lastmod: '2026-02-16' },
      { loc: `${siteUrl}/sitemap-courses.xml`, lastmod: '2026-02-16' },
      { loc: `${siteUrl}/sitemap-blog.xml`, lastmod: '2026-02-16' },
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
 * Get institutions sitemap for an institution
 */
export function getInstitutionsSitemap(siteUrl: string, institutionId: string): SitemapEntry[] {
  if (institutionId === 'main') {
    return getMainInstitutions(siteUrl)
  }

  return []
}

/**
 * Get courses sitemap for an institution
 */
export function getCoursesSitemap(siteUrl: string, institutionId: string): SitemapEntry[] {
  if (institutionId === 'engineering') {
    return getEngineeringCourses(siteUrl)
  }

  if (institutionId === 'main') {
    return getMainCourses(siteUrl)
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

  if (institutionId === 'main') {
    return getMainBlog(siteUrl)
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
 * Main Institution - Pages Sitemap
 */
function getMainPages(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}`, lastmod: '2026-02-16', changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/home`, lastmod: '2026-02-16', changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/about`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/contact`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/our-trust`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-management`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/vision-and-mission`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.7 },
    { loc: `${siteUrl}/careers`, lastmod: '2026-02-16', changefreq: 'weekly', priority: 0.8 },
    { loc: `${siteUrl}/placements`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/facilities`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/hostel`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/transport`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/auditorium`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/seminar-hall`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/sports`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities/food-court-stationery-shop`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/emergency-care`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/ambulance-services`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/microsoft-360`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/more`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/privacy-policy`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.3 },
    { loc: `${siteUrl}/terms-and-conditions`, lastmod: '2026-02-16', changefreq: 'yearly', priority: 0.3 },
  ]
}

/**
 * Main Institution - Institutions Sitemap
 */
function getMainInstitutions(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/our-institutions`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/our-colleges`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/our-schools`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/jkkn-dental-college`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/jkkn-college-of-pharmacy`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/jkkn-college-of-nursing`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/jkkn-college-of-allied-health-sciences`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/jkkn-college-of-engineering`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/jkkn-college-of-arts-and-science`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/jkkn-college-of-education`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/jkkn-matriculation-higher-secondary-school`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/nattraja-vidhyalya`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.8 },
  ]
}

/**
 * Main Institution - Courses Sitemap
 */
function getMainCourses(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/courses-offered`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/dental-courses`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/pharmacy-courses`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/nursing-courses`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/allied-health-sciences-courses`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/engineering-courses`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/arts-and-science-courses`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/education-courses`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.9 },
  ]
}

/**
 * Main Institution - Blog Sitemap
 */
function getMainBlog(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/blog`, lastmod: '2026-02-16', changefreq: 'daily', priority: 0.7 },
    { loc: `${siteUrl}/blog/tell-us-how-salt-keeps-dental-problems-away-complete-evidence-based-guide-2026`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/dental-braces-before-and-after-complete-transformation-guide-2026`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/what-is-a-3-way-syringe-in-dentistry-complete-guide-to-the-dental-air-water-syringe-2026`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/bmp-full-form-in-dental-complete-guide-to-bone-morphogenetic-proteins-2026`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/rvg-dental-full-form-complete-guide-to-radiovisiography-rvg-in-modern-dentistry-2026`, lastmod: '2026-02-16', changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/kumarapalayam-bypass-marathon-2025`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/alumni-meet-2025-reconnect-relive`, lastmod: '2025-02-22', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/onam-celebrations-ahs-campus`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/campus-recruitment-drive-2025-a-step-towards-bright-futures`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/blog/industry-connect-ai-process-consulting-new-engine-of-business-success`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/linkedin-live-webinar-classroom-to-shopfloor-ai-aedp-perspective`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/placement-day-celebration-2025`, lastmod: '2025-04-25', changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/blog/jkkncets-initiative-mental-health-suicide-awareness`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/pongal-2025-celebrations-sresakthimayeil-institute-nursing-research`, lastmod: '2025-01-15', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/inauguration-senior-internship-program`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/pot-painting-event-2025-at-jkkn-arts-college-event-recap`, lastmod: '2025-01-01', changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/blog/news-2022-04-20-convocation`, lastmod: '2022-04-20', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-09-16-periyar-event-1`, lastmod: '2022-09-16', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-12-18-top100-award`, lastmod: '2022-12-18', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2023-02-11-dental-camp`, lastmod: '2023-02-11', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-09-16-periyar-event`, lastmod: '2022-09-16', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-11-26-convocation-makkal-1`, lastmod: '2022-11-26', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-11-26-convocation-thanthi`, lastmod: '2022-11-26', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-07-31-sports-dinakaran`, lastmod: '2022-07-31', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-11-18-cycle-rally`, lastmod: '2022-11-18', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-07-31-sports-kaalai`, lastmod: '2022-07-31', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-07-31-sports-maalaimalar`, lastmod: '2022-07-31', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-11-26-convocation-makkal`, lastmod: '2022-11-26', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-07-22-convocation-dinakaran`, lastmod: '2022-07-22', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-07-22-convocation-kaalai`, lastmod: '2022-07-22', changefreq: 'yearly', priority: 0.4 },
    { loc: `${siteUrl}/blog/news-2022-07-22-convocation-maalaimalar`, lastmod: '2022-07-22', changefreq: 'yearly', priority: 0.4 },
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
