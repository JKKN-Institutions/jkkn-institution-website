/**
 * Structured Data Generation Utilities
 * Generates JSON-LD schemas for SEO
 */

import type {
  BreadcrumbItem,
  BreadcrumbList,
  EducationalOrganization,
  ListItem,
  OrganizationConfig,
  SchemaGraph,
  WebPage,
} from './types'

// Site configuration
const SITE_URL = 'https://jkkn.ac.in'

// Organization configuration
const ORGANIZATION_CONFIG: OrganizationConfig = {
  name: 'JKKN Group of Institutions',
  alternateName: 'JKKN',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  foundingDate: '1952',
  description:
    'Leading educational institution in Tamil Nadu offering quality education since 1952. NAAC A accredited with 50,000+ alumni worldwide.',
  address: {
    streetAddress: 'JKKN Educational Institutions',
    addressLocality: 'Komarapalayam',
    addressRegion: 'Tamil Nadu',
    postalCode: '638183',
    addressCountry: 'IN',
  },
  contactPoint: {
    telephone: '+91-4288-234001',
    contactType: 'admissions',
    email: 'info@jkkn.ac.in',
  },
  sameAs: [
    'https://www.facebook.com/jkaboratory',
    'https://www.instagram.com/jkkn_institutions',
    'https://www.linkedin.com/company/jkkn-group-of-institutions',
    'https://www.youtube.com/@jkkngroupofinstitutions',
  ],
}

/**
 * Generate EducationalOrganization schema for global use
 */
export function generateOrganizationSchema(): EducationalOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: ORGANIZATION_CONFIG.name,
    alternateName: ORGANIZATION_CONFIG.alternateName,
    url: ORGANIZATION_CONFIG.url,
    logo: ORGANIZATION_CONFIG.logo,
    foundingDate: ORGANIZATION_CONFIG.foundingDate,
    description: ORGANIZATION_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION_CONFIG.address.streetAddress,
      addressLocality: ORGANIZATION_CONFIG.address.addressLocality,
      addressRegion: ORGANIZATION_CONFIG.address.addressRegion,
      postalCode: ORGANIZATION_CONFIG.address.postalCode,
      addressCountry: ORGANIZATION_CONFIG.address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: ORGANIZATION_CONFIG.contactPoint.telephone,
      contactType: ORGANIZATION_CONFIG.contactPoint.contactType,
      email: ORGANIZATION_CONFIG.contactPoint.email,
    },
    sameAs: ORGANIZATION_CONFIG.sameAs,
  }
}

/**
 * Generate BreadcrumbList schema from breadcrumb items
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbList {
  const itemListElement: ListItem[] = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

/**
 * Generate WebPage schema with optional breadcrumb
 */
export function generateWebPageSchema(
  name: string,
  url: string,
  description?: string,
  breadcrumbs?: BreadcrumbItem[]
): WebPage {
  const schema: WebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}${url}#webpage`,
    name,
    url: `${SITE_URL}${url}`,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: ORGANIZATION_CONFIG.name,
      url: SITE_URL,
    },
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(breadcrumbs)
  }

  return schema
}

/**
 * Generate a combined schema graph with multiple schemas
 */
export function generateSchemaGraph(...schemas: object[]): object {
  // Remove @context from individual schemas to avoid duplication
  const cleanedSchemas = schemas.map((schema) => {
    const { '@context': _, ...rest } = schema as Record<string, unknown>
    return rest
  })

  return {
    '@context': 'https://schema.org',
    '@graph': cleanedSchemas,
  }
}

/**
 * Serialize schema to JSON string for injection
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema, null, 0)
}

/**
 * Get the site URL constant
 */
export function getSiteUrl(): string {
  return SITE_URL
}
