/**
 * Schema Resolver — Context-Aware Structured Data Injection
 *
 * Determines which JSON-LD schemas are appropriate for each page type.
 * Prevents schema spam (e.g., FAQ + CourseCatalog on a privacy policy page).
 *
 * Google's guidelines: "Structured data should only be added to pages
 * for which it is directly relevant."
 *
 * Tenant note: CourseCatalogSchema describes the WHOLE JKKN group (Dental, Pharmacy,
 * Nursing, ...). It belongs to the parent tenant only. Emitting it on engg.jkkn.ac.in
 * made Google report a BDS Review snippet on the engineering courses page.
 */

import { isMainInstitution } from '@/lib/config/multi-tenant'

export type PageSchemaSet = {
  /** Include WebSite schema (homepage only) */
  website: boolean
  /** Include CourseCatalog ItemList schema */
  courseCatalog: boolean
  /** Include EventsCalendar schema */
  eventsCalendar: boolean
  /** Include FAQPage schema (general institution FAQs) */
  faqGeneral: boolean
  /** Include admissions-specific FAQ schema */
  faqAdmissions: boolean
  /** Include placements-specific FAQ schema */
  faqPlacements: boolean
  /** Include about-specific FAQ schema */
  faqAbout: boolean
  /** Include HowTo schema for step-by-step admission process (GEO/AEO signal) */
  howToAdmissions: boolean
  /** Include Review + AggregateRating schema (testimonials page) */
  testimonialsReview: boolean
  /** Include LocalBusiness schema (city-specific landing pages) */
  localBusiness: boolean
  /** Include Article schema (news, success stories, chairman message) */
  article: boolean
  /** Include BreadcrumbList schema (every page except the homepage and the city pages,
   *  which emit their own crumb trail from components/city-pages/city-schema.tsx) */
  breadcrumb: boolean
}

const EMPTY_SCHEMAS: PageSchemaSet = {
  website: false,
  courseCatalog: false,
  eventsCalendar: false,
  faqGeneral: false,
  faqAdmissions: false,
  faqPlacements: false,
  faqAbout: false,
  howToAdmissions: false,
  testimonialsReview: false,
  localBusiness: false,
  article: false,
  breadcrumb: false,
}

/**
 * City slugs that receive LocalBusiness schema for local SEO capture.
 * Keep in sync with the location landing pages created in Phase 5.
 */
const LOCATION_SLUGS = new Set([
  'salem',
  'erode',
  'namakkal',
  'coimbatore',
  'tiruppur',
  'karur',
  'tiruchengode',
  'perundurai',
  'dharmapuri',
  'rasipuram',
  'mettur',
  'trichy',
])

/**
 * Resolve which schemas should be injected for a given page slug.
 *
 * Note: Organization schema is always in the root layout <head>,
 * so it doesn't need to be resolved per-page.
 *
 * @param slug - The page slug (empty string for homepage)
 * @param isHomepage - Whether this is the homepage
 */
function resolvePageSchemasInner(slug: string, isHomepage: boolean = false): PageSchemaSet {
  // Homepage gets the full treatment
  if (isHomepage || slug === '') {
    return {
      ...EMPTY_SCHEMAS,
      website: true,
      courseCatalog: isMainInstitution(),
      faqGeneral: true,
    }
  }

  // Course-related pages — include FAQ alongside course catalog
  // GEO: FAQPage on course pages gives AI engines Q&A pairs to cite about programs
  if (slug === 'courses-offered' || slug.startsWith('courses-offered/')) {
    return {
      ...EMPTY_SCHEMAS,
      courseCatalog: isMainInstitution(),
      faqGeneral: true,
    }
  }

  // Department pages (e.g. /department-of-ece, /department-of-mba)
  // GEO: Engineering department pages are high-intent; FAQ improves AI citability
  if (slug.startsWith('department-of-')) {
    return {
      ...EMPTY_SCHEMAS,
      faqGeneral: true,
    }
  }

  // Events pages
  if (slug === 'events' || slug.startsWith('events/')) {
    return {
      ...EMPTY_SCHEMAS,
      eventsCalendar: true,
    }
  }

  // Admissions pages — FAQ + HowTo for step-by-step process
  // GEO: HowTo schema targets "how to apply" voice/PAA queries directly
  if (slug === 'admissions' || slug.startsWith('admissions/')) {
    return {
      ...EMPTY_SCHEMAS,
      faqAdmissions: true,
      howToAdmissions: true,
    }
  }

  // Placements pages
  if (slug === 'placements' || slug.startsWith('placements/')) {
    return {
      ...EMPTY_SCHEMAS,
      faqPlacements: true,
    }
  }

  // About pages
  if (slug === 'about' || slug.startsWith('about/')) {
    return {
      ...EMPTY_SCHEMAS,
      faqAbout: true,
    }
  }

  // ============================================
  // Phase 1 — AEO conversion pages
  // ============================================

  // Umbrella FAQ — primary AEO lever for PAA / AI Overviews
  if (slug === 'faq') {
    return { ...EMPTY_SCHEMAS, faqGeneral: true }
  }

  // Fee structure & scholarships — admission-intent queries
  if (slug === 'fee-structure' || slug === 'scholarships') {
    return { ...EMPTY_SCHEMAS, faqAdmissions: true }
  }

  // Step-by-step admission guides — HowTo schema for AI snippet capture
  if (
    slug === 'how-to-apply' ||
    slug === 'admission-guide' ||
    slug === 'counseling-guide'
  ) {
    return { ...EMPTY_SCHEMAS, howToAdmissions: true, faqAdmissions: true }
  }

  // ============================================
  // Phase 2 — GEO trust & E-E-A-T pages
  // ============================================

  if (slug === 'testimonials') {
    return { ...EMPTY_SCHEMAS, testimonialsReview: true }
  }

  if (slug === 'alumni-success-stories' || slug === 'international-placements') {
    return { ...EMPTY_SCHEMAS, article: true }
  }

  if (slug === 'accreditation') {
    // Organization schema already in layout includes accreditedBy;
    // surface FAQ-style answers for "Is JKKN accredited?" queries
    return { ...EMPTY_SCHEMAS, faqAbout: true }
  }

  // ============================================
  // Phase 3–4 — USPs & content hubs
  // ============================================

  if (slug === 'hospital' || slug === 'ai-campus' || slug === 'chairman-message') {
    return { ...EMPTY_SCHEMAS, article: true }
  }

  if (slug === 'why-jkkn') {
    return { ...EMPTY_SCHEMAS, faqGeneral: true, article: true }
  }

  if (slug === 'news' || slug.startsWith('news/')) {
    return { ...EMPTY_SCHEMAS, article: true }
  }

  // ============================================
  // Phase 5 — Location landing pages (Local SEO)
  // ============================================

  if (LOCATION_SLUGS.has(slug)) {
    return { ...EMPTY_SCHEMAS, localBusiness: true, faqGeneral: true }
  }

  // All other pages: no extra schemas (Organization is already in layout)
  return EMPTY_SCHEMAS
}

/**
 * Routes on a COLLEGE tenant that carry no visible FAQ block matching the generated
 * Q&A. Measured on engg.jkkn.ac.in 2026-09-18: these pages emitted FAQPage JSON-LD
 * asserting 5-9 question/answer pairs that appear nowhere in the rendered DOM.
 *
 * Google requires FAQPage content to be visible on the page, and since Aug 2023 FAQ
 * rich results are limited to authoritative government and health sites anyway - so a
 * college FAQPage earns no rich result while still carrying the policy risk. The
 * homepage is included because its visible FAQ (CMS-managed) is a DIFFERENT set of
 * questions from the generated schema.
 *
 * The parent tenant is untouched: it renders its own FAQ sections on these routes.
 */
const NO_VISIBLE_FAQ_ROUTES = new Set([
  '',
  'about',
  'placements',
  'fee-structure',
  'courses-offered',
  'courses-offered/ug',
  'courses-offered/pg',
])

export function resolvePageSchemas(slug: string, isHomepage: boolean = false): PageSchemaSet {
  const schemas = resolvePageSchemasInner(slug, isHomepage)

  const key = isHomepage ? '' : slug.replace(/^\/+|\/+$/g, '')

  // BreadcrumbList on every page except the homepage (a single "Home" crumb is not a
  // trail) and the city landing pages, which already emit their own from CitySchema.
  // Measured 2026-09-18: 76 of 101 live pages carried no BreadcrumbList at all.
  schemas.breadcrumb = !isHomepage && key !== '' && !LOCATION_SLUGS.has(key)
  if (!isMainInstitution() && NO_VISIBLE_FAQ_ROUTES.has(key)) {
    return {
      ...schemas,
      faqGeneral: false,
      faqAdmissions: false,
      faqPlacements: false,
      faqAbout: false,
    }
  }

  return schemas
}
