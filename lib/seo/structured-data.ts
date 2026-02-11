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
import { getSiteUrl } from '@/lib/utils/site-url'
import { getCurrentInstitution } from '@/lib/config/multi-tenant'

/**
 * Get organization configuration dynamically based on current institution
 */
function getOrganizationConfig(): OrganizationConfig {
  const institution = getCurrentInstitution()
  const SITE_URL = getSiteUrl()

  // Institution-specific configurations
  const configs: Record<string, Partial<OrganizationConfig>> = {
    main: {
      name: 'JKKN Group of Institutions',
      alternateName: 'JKKN',
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
    },
    engineering: {
      name: 'JKKN College of Engineering and Technology',
      alternateName: 'JKKN CET',
      foundingDate: '2008',
      description:
        'Premier engineering college in Tamil Nadu affiliated to Anna University. Offers UG and PG programs in Engineering and Technology with excellent placement record.',
      address: institution.contact ? {
        streetAddress: institution.contact.address.line1 + (institution.contact.address.line2 ? ', ' + institution.contact.address.line2 : ''),
        addressLocality: institution.contact.address.city,
        addressRegion: institution.contact.address.state,
        postalCode: institution.contact.address.pincode,
        addressCountry: 'IN',
      } : undefined,
      contactPoint: institution.contact ? {
        telephone: institution.contact.phoneFormatted,
        contactType: 'admissions',
        email: institution.contact.email,
      } : undefined,
    },
    dental: {
      name: 'JKKN Dental College and Hospital',
      alternateName: 'JKKN DC',
      foundingDate: '2005',
      description:
        'Leading dental college and hospital in Tamil Nadu affiliated to The Tamil Nadu Dr. M.G.R. Medical University. Offers BDS, MDS, and specialized dental care services.',
    },
    pharmacy: {
      name: 'JKKN College of Pharmacy',
      alternateName: 'JKKN CP',
      foundingDate: '2008',
      description:
        'AICTE approved pharmacy college in Tamil Nadu offering B.Pharm, M.Pharm, and Pharm.D programs with state-of-the-art facilities.',
    },
  }

  const specificConfig = configs[institution.id] || {}

  return {
    name: institution.name,
    alternateName: institution.shortName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    foundingDate: specificConfig.foundingDate || '1952',
    description: specificConfig.description || `Official website of ${institution.name}`,
    address: specificConfig.address || {
      streetAddress: 'JKKN Educational Institutions',
      addressLocality: 'Komarapalayam',
      addressRegion: 'Tamil Nadu',
      postalCode: '638183',
      addressCountry: 'IN',
    },
    contactPoint: specificConfig.contactPoint || {
      telephone: '+91-4288-234001',
      contactType: 'admissions',
      email: 'info@jkkn.ac.in',
    },
    sameAs: specificConfig.sameAs || [
      'https://www.facebook.com/jkaboratory',
      'https://www.instagram.com/jkkn_institutions',
      'https://www.linkedin.com/company/jkkn-group-of-institutions',
      'https://www.youtube.com/@jkkngroupofinstitutions',
    ],
  }
}

/**
 * Generate EducationalOrganization schema for global use
 */
export function generateOrganizationSchema(): EducationalOrganization {
  const SITE_URL = getSiteUrl()
  const ORGANIZATION_CONFIG = getOrganizationConfig()

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
  const SITE_URL = getSiteUrl()

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
  const SITE_URL = getSiteUrl()
  const ORGANIZATION_CONFIG = getOrganizationConfig()

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
 * Export getSiteUrl from utils for backwards compatibility
 */
export { getSiteUrl } from '@/lib/utils/site-url'
