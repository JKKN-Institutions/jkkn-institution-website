/**
 * Schema Resolver — Context-Aware Structured Data Injection
 *
 * Determines which JSON-LD schemas are appropriate for each page type.
 * Prevents schema spam (e.g., FAQ + CourseCatalog on a privacy policy page).
 *
 * Google's guidelines: "Structured data should only be added to pages
 * for which it is directly relevant."
 */

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
}

/**
 * Resolve which schemas should be injected for a given page slug.
 *
 * Note: Organization schema is always in the root layout <head>,
 * so it doesn't need to be resolved per-page.
 *
 * @param slug - The page slug (empty string for homepage)
 * @param isHomepage - Whether this is the homepage
 */
export function resolvePageSchemas(slug: string, isHomepage: boolean = false): PageSchemaSet {
  // Homepage gets the full treatment
  if (isHomepage || slug === '') {
    return {
      website: true,
      courseCatalog: true,
      eventsCalendar: false,
      faqGeneral: true,
      faqAdmissions: false,
      faqPlacements: false,
      faqAbout: false,
      howToAdmissions: false,
    }
  }

  // Course-related pages — include FAQ alongside course catalog
  // GEO: FAQPage on course pages gives AI engines Q&A pairs to cite about programs
  if (slug === 'courses-offered' || slug.startsWith('courses-offered/')) {
    return {
      ...EMPTY_SCHEMAS,
      courseCatalog: true,
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

  // All other pages: no extra schemas (Organization is already in layout)
  return EMPTY_SCHEMAS
}
