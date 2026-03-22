/**
 * SEO Utilities
 * Export all SEO-related utilities from a single entry point
 */

// Types
export type {
  BreadcrumbConfig,
  BreadcrumbItem,
  BreadcrumbList,
  ContactPoint,
  EducationalOrganization,
  ListItem,
  OrganizationConfig,
  PostalAddress,
  SchemaGraph,
  Thing,
  WebPage,
  // Course Catalog Schema Types
  GeoCoordinates,
  Place,
  CollegeOrUniversity,
  CourseInstance,
  EducationalOccupationalCredential,
  AggregateRating,
  EducationalAudience,
  Offer,
  Course,
  EducationalOccupationalProgram,
  SpeakableSpecification,
  EntryPoint,
  ApplyAction,
  EducationalWebPage,
  ItemListElement,
  CourseCatalogItemList,
} from './types'

// Schema generation utilities
export {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateSchemaGraph,
  generateWebPageSchema,
  getSiteUrl,
  serializeSchema,
} from './structured-data'

// Institution SEO config
export {
  getInstitutionSEOConfig,
  getInstitutionSEOConfigById,
  getCopyrightYear,
  getGAMeasurementId,
  getMetaPixelId,
  getGoogleSiteVerification,
} from './institution-seo-config'
export type { InstitutionSEOConfig } from './institution-seo-config'

// Schema resolver
export { resolvePageSchemas } from './schema-resolver'
export type { PageSchemaSet } from './schema-resolver'

// Breadcrumb configuration
export {
  BREADCRUMB_CONFIG,
  getBreadcrumbsForPath,
  hasStaticBreadcrumbs,
} from './breadcrumb-config'

// Course Catalog configuration
export { courseCatalogConfig } from './course-catalog-config'
export type { CourseCatalogConfig } from './course-catalog-config'

// Sitemap configuration
export {
  SITE_URL,
  STATIC_ROUTES,
  PATTERN_PRIORITIES,
  DEFAULT_CONFIG,
  getSitemapConfig,
  formatSitemapDate,
  buildSitemapUrl,
  shouldExcludeUrl,
} from './sitemap-config'
export type {
  ChangeFrequency,
  SitemapUrlConfig,
  PatternPriorityConfig,
} from './sitemap-config'
