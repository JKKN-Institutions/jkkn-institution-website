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

/**
 * The sitemap INDEX may honestly carry today's date: every child sitemap route is
 * force-dynamic, so those documents really are regenerated on each request. Only the
 * per-URL entries must not claim a date they do not know.
 */
const GENERATED_ON = new Date().toISOString().split('T')[0]

/**
 * Deliberately UNDEFINED. A static config entry has no known modification date.
 *
 * This was `new Date().toISOString().split('T')[0]`, evaluated at module load and
 * re-evaluated on every request because the sitemap routes are force-dynamic. All 166
 * static entries therefore claimed they had been modified TODAY - every day, forever.
 *
 * Measured on engg.jkkn.ac.in 2026-09-10 (live fetch, cache bypassed): 39 of 106
 * sitemap URLs carried lastmod=2026-09-10. That set contained ALL 13 URLs that return a
 * hard 404 and ALL 10 /admissions/* pages. The one signal a sitemap has for "what
 * changed" was being spent equally on the dead URLs and on the money pages.
 *
 * Google's guidance is to omit lastmod when it is not known; an unreliable lastmod is
 * discounted and costs trust. The route layer still overwrites this with the real
 * cms_pages.updated_at wherever a CMS row matches the slug, so every page that has a
 * genuine date keeps it.
 *
 * Keeping the identifier name means the 166 call sites did not have to be touched in a
 * file that three other worktrees are editing today. Renaming it to UNKNOWN_LASTMOD is
 * a safe follow-up once those land.
 */
const TODAY = undefined

export interface SitemapEntry {
  loc: string
  /** Omitted from the XML when no real modification date is known - see TODAY above. */
  lastmod?: string
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
    // GENERATED_ON, not TODAY: an index entry's lastmod describes when the CHILD
    // SITEMAP DOCUMENT last changed, and those routes are force-dynamic, so "today" is
    // true here. SitemapIndex.lastmod stays a required string for the same reason.
    engineering: [
      { loc: `${siteUrl}/sitemap-pages.xml`, lastmod: GENERATED_ON },
      { loc: `${siteUrl}/sitemap-courses.xml`, lastmod: GENERATED_ON },
      { loc: `${siteUrl}/sitemap-blog.xml`, lastmod: GENERATED_ON },
    ],
    main: [
      { loc: `${siteUrl}/sitemap-pages.xml`, lastmod: GENERATED_ON },
      { loc: `${siteUrl}/sitemap-institutions.xml`, lastmod: GENERATED_ON },
      { loc: `${siteUrl}/sitemap-courses.xml`, lastmod: GENERATED_ON },
      { loc: `${siteUrl}/sitemap-blog.xml`, lastmod: GENERATED_ON },
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
    { loc: `${siteUrl}`, lastmod: TODAY, changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/about`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-trust`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-management`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-institutions`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/principals-message`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/institution-rules`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/organogram`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/gallery`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${siteUrl}/facilities/transport`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/facilities/sports`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities/food-court`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities/class-room`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/privacy-policy`, lastmod: TODAY, changefreq: 'yearly', priority: 0.3 },
    { loc: `${siteUrl}/mandatory-disclosure`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/policy`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/committee`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/others`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/academic-calendar`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/others/academic-calendar`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/admissions/engineering`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/admissions/fee-structure`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/admissions/be-cse`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/admissions/be-eee`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/admissions/be-ece`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/admissions/be-mechanical`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/admissions/btech-it`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/admissions/me-cse`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/admissions/mba`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    // City landing pages — served programmatically via [...slug] + getCityConfig,
    // not stored in cms_pages so the dynamic overlay can't surface them.
    { loc: `${siteUrl}/coimbatore`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/erode`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/namakkal`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/salem`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/tiruppur`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/karur`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/tiruchengode`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/perundurai`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/dharmapuri`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/rasipuram`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/mettur`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/trichy`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
  ]
}

/**
 * Engineering College - Courses Sitemap
 */
function getEngineeringCourses(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/courses-offered`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    // UG programmes — all 5 BE/BTech branches at parity priority
    { loc: `${siteUrl}/courses-offered/ug/be-cse`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/ug/be-ece`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/ug/be-eee`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/ug/be-mechanical`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/ug/btech-it`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/ug/sh`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    // PG programmes
    { loc: `${siteUrl}/courses-offered/pg/mba`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/pg/me-cse`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    // Accreditation / institutional pages
    { loc: `${siteUrl}/naac`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    // Canonical NIRF location is /iqac/nirf/nirf-<year>. Bare /nirf-2, /nirf2024,
    // /nirf-2025 dropped as duplicates that confused Google about the canonical.
    { loc: `${siteUrl}/iqac/nirf/nirf-2024`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/student-support-and-progression`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/electoral-literacy-club`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
  ]
}

/**
 * Engineering College - Blog Sitemap
 */
function getEngineeringBlog(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/orbitra26`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/technovanza-2k25`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/placement-day-celebration-2025`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/session-on-angel-investment`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/16th-sports-day`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/environmental-talk`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/environmental-talk-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/art-festival`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/safer-internet-day`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/safer-internet-day-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/world-water-day`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/world-population-day`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/international-yoga-day`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/international-happiness-day`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/international-plastic-bag-free-day-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${siteUrl}/inaipirai-inauguration-day`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/golden-hour-placement-training-program-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/solar-future-leaders-workshop-2025-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/solar-energy-innovation-workshop-2025-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/sustainable-energy-leaders-workshop-selw-2025-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/essentials-of-electric-vehicle-technology-2025-2`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/77th-independence-day-celebration-in-our-college-campus`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-student-led-conferences`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-learner-lead-conference-llc`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-conducted-cyber-security-workshop`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/department-of-cse-conducted-placement-training-internship-programe`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/the-impact-of-artificial-intelligence-on-healthcare`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/fostering-entrepreneurship-development-and-innovation`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/insights-into-non-destructive-testing`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/iot-driven-embedded-systems-from-prototype-to-deployment`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/technical-seminar-on-robotics-in-healthcare`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/suceess-storie-cook-without-fire`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
  ]
}

/**
 * Main Institution - Pages Sitemap
 */
function getMainPages(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}`, lastmod: TODAY, changefreq: 'daily', priority: 1.0 },
    { loc: `${siteUrl}/about`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/admissions`, lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    // /fee-structure and /scholarships are also surfaced by CMS, but hardcoded here
    // as belt-and-suspenders: high-funnel conversion pages must survive a Supabase
    // outage during a Google crawl. Priority just below /admissions intentionally.
    { loc: `${siteUrl}/fee-structure`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/scholarships`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/how-to-apply`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/contact`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/our-trust`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/our-management`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/vision-and-mission`, lastmod: TODAY, changefreq: 'yearly', priority: 0.7 },
    { loc: `${siteUrl}/chairman-message`, lastmod: TODAY, changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/careers`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${siteUrl}/placements`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/recruiters`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/industry-partnerships`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/student-life`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/rankings-and-recognitions`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/nirf`, lastmod: TODAY, changefreq: 'yearly', priority: 0.6 },
    { loc: `${siteUrl}/ai-campus`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    { loc: `${siteUrl}/faculty-directory`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/hostel`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/transport`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/auditorium`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/seminar-hall`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/sports`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/facilities/food-court-stationery-shop`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/emergency-care`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/ambulance-services`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/hospital`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/digital-classroom`, lastmod: TODAY, changefreq: 'yearly', priority: 0.5 },
    { loc: `${siteUrl}/events`, lastmod: TODAY, changefreq: 'weekly', priority: 0.6 },
    { loc: `${siteUrl}/more`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/privacy-policy`, lastmod: TODAY, changefreq: 'yearly', priority: 0.3 },
    { loc: `${siteUrl}/terms-and-conditions`, lastmod: TODAY, changefreq: 'yearly', priority: 0.3 },
  ]
}

/**
 * Main Institution - Institutions Sitemap
 */
function getMainInstitutions(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/our-institutions`, lastmod: TODAY, changefreq: 'monthly', priority: 0.95 },
    { loc: `${siteUrl}/our-colleges`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/our-schools`, lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
    // The six /jkkn-*-college hub paths were removed on 2026-09-09: every one returned a
    // hard 404 in two independent measurement passes, and /jkkn-college-of-pharmacy had
    // already been pulled for redirecting. Restore an entry only once its page is real.
    { loc: `${siteUrl}/jkkn-matriculation-higher-secondary-school`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    { loc: `${siteUrl}/nattraja-vidhyalya`, lastmod: TODAY, changefreq: 'monthly', priority: 0.85 },
    // Cross-host institution URLs were removed on 2026-09-09. A sitemap may only carry
    // URLs on its own host unless that host's robots.txt declares this sitemap; all five
    // sibling robots.txt files were read that day and none does, so Google was discarding
    // these entries. Each subdomain has its own sitemap and its own GSC property.
  ]
}

/**
 * Main Institution - Courses Sitemap
 */
function getMainCourses(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/courses-offered`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/dental-courses`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/pharmacy-courses`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/nursing-courses`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/courses-offered/allied-health-sciences-courses`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/engineering-courses`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/arts-and-science-courses`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/education-courses`, lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
    { loc: `${siteUrl}/fee-structure/nursing`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${siteUrl}/courses-offered/pg/me-cse`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
  ]
}

/**
 * Main Institution - Blog Sitemap
 */
function getMainBlog(siteUrl: string): SitemapEntry[] {
  return [
    { loc: `${siteUrl}/blog`, lastmod: TODAY, changefreq: 'daily', priority: 0.7 },
    { loc: `${siteUrl}/blog/tell-us-how-salt-keeps-dental-problems-away-complete-evidence-based-guide-2026`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/dental-braces-before-and-after-complete-transformation-guide-2026`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/what-is-a-3-way-syringe-in-dentistry-complete-guide-to-the-dental-air-water-syringe-2026`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/bmp-full-form-in-dental-complete-guide-to-bone-morphogenetic-proteins-2026`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/rvg-dental-full-form-complete-guide-to-radiovisiography-rvg-in-modern-dentistry-2026`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
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
    { loc: `${siteUrl}/blog/sarvam-galatta-day-1-highlights-jkkn-institutions`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${siteUrl}/blog/jkkn-sports-day-2026-recap-five-days-that-proved-jkkncet-builds-champions`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/smileathon-2026-recap-jkkn-dental-college`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    { loc: `${siteUrl}/blog/yugantar-26-ai-arena-human-vs-ai-art-jkkn`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
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
    <loc>${entry.loc}</loc>`

      // Emit <lastmod> ONLY when a real date is known. Without this guard an entry
      // whose lastmod is undefined would ship the literal string
      // <lastmod>undefined</lastmod>, which is worse than the wrong date it replaces.
      if (entry.lastmod) {
        xml += `\n    <lastmod>${entry.lastmod}</lastmod>`
      }

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
