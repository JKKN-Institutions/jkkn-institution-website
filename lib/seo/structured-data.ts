/**
 * Structured Data Generation Utilities
 * Generates JSON-LD schemas for SEO
 *
 * SINGLE SOURCE OF TRUTH for all Organization schema generation.
 * Uses centralized config from institution-seo-config.ts.
 */

import type {
  BreadcrumbItem,
  BreadcrumbList,
  ListItem,
  SchemaGraph,
  WebPage,
} from './types'
import { getSiteUrl } from '@/lib/utils/site-url'
import { getInstitutionSEOConfig } from './institution-seo-config'
import { isMainInstitution } from '@/lib/config/multi-tenant'

/**
 * Generate comprehensive EducationalOrganization schema for the root layout.
 *
 * This is the SINGLE organization schema — no other component should
 * emit a competing EducationalOrganization JSON-LD block.
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  const SITE_URL = getSiteUrl()
  const config = getInstitutionSEOConfig()

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': config.schemaType,
    '@id': `${SITE_URL}/#organization`,
    'name': config.name,
    'alternateName': config.alternateName,
    'url': `${SITE_URL}/`,
    'logo': {
      '@type': 'ImageObject',
      'url': `${SITE_URL}/images/logo.png`,
      'contentUrl': `${SITE_URL}/images/logo.png`,
      'caption': `${config.name} Logo`,
    },
    'image': [`${SITE_URL}/images/logo.png`],
    'foundingDate': config.foundingDate,
    'description': config.description,

    // Address — uses actual street address, NOT org name
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': config.address.streetAddress,
      'addressLocality': config.address.addressLocality,
      'addressRegion': config.address.addressRegion,
      'postalCode': config.address.postalCode,
      'addressCountry': config.address.addressCountry,
    },

    // GeoCoordinates
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': config.geo.latitude,
      'longitude': config.geo.longitude,
    },

    // Area Served — critical for "Best College Near Erode" claim
    'areaServed': config.areaServed.map(area => ({
      '@type': area.type,
      'name': area.name,
      ...(area.sameAs ? { sameAs: area.sameAs } : {}),
    })),

    // Contact — multiple contact points for admissions and general enquiry
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': config.contactPoint.telephone,
        'contactType': 'admissions',
        'areaServed': 'IN',
        'availableLanguage': config.contactPoint.availableLanguage,
        'hoursAvailable': {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          'opens': '09:00',
          'closes': '17:00',
        },
      },
      {
        '@type': 'ContactPoint',
        'telephone': config.contactPoint.telephone,
        'contactType': 'customer support',
        'areaServed': 'IN',
        'availableLanguage': config.contactPoint.availableLanguage,
      },
    ],
    'email': config.email,

    // Opening hours for the campus
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'opens': '09:00',
        'closes': '17:00',
      },
    ],

    // Social & identity links
    'sameAs': config.sameAs,

    // Parent Organization — links child institutions to JKKN trust/main
    'parentOrganization': {
      '@type': config.parentOrganization.type,
      'name': config.parentOrganization.name,
      '@id': config.parentOrganization.id,
      ...(config.parentOrganization.foundingDate ? { foundingDate: config.parentOrganization.foundingDate } : {}),
      ...(config.parentOrganization.description ? { description: config.parentOrganization.description } : {}),
    },

    // Credentials (NAAC, AICTE, etc.)
    'hasCredential': config.hasCredential.map(cred => ({
      '@type': 'EducationalOccupationalCredential',
      'credentialCategory': cred.credentialCategory,
      'name': cred.name,
      'recognizedBy': {
        '@type': 'Organization',
        'name': cred.recognizedBy.name,
        ...(cred.recognizedBy.alternateName ? { alternateName: cred.recognizedBy.alternateName } : {}),
      },
    })),

    // University affiliations
    'memberOf': config.memberOf.map(org => ({
      '@type': 'Organization',
      'name': org.name,
      ...(org.alternateName ? { alternateName: org.alternateName } : {}),
      ...(org.sameAs ? { sameAs: org.sameAs } : {}),
    })),

    // Programs offered
    'makesOffer': config.programs.map(prog => ({
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'EducationalOccupationalProgram',
        'name': prog.name,
        'educationalProgramMode': 'full-time',
        'programType': prog.programType,
      },
    })),

    // Amenities
    'amenityFeature': config.amenityFeature.map(name => ({
      '@type': 'LocationFeatureSpecification',
      'name': name,
      'value': true,
    })),

    // Awards
    'award': config.awards,

    // Google Maps link
    'hasMap': `https://maps.google.com/?q=${config.geo.latitude},${config.geo.longitude}`,

    'isAccessibleForFree': false,
    'publicAccess': true,
  }

  // Slogan (if set)
  if (config.slogan) {
    schema.slogan = config.slogan
  }

  // Legal name (if set)
  if (config.legalName) {
    schema.legalName = config.legalName
  }

  // Employee count (if set)
  if (config.numberOfEmployees) {
    schema.numberOfEmployees = {
      '@type': 'QuantitativeValue',
      'minValue': config.numberOfEmployees.min,
      'maxValue': config.numberOfEmployees.max,
      'unitText': 'employees',
    }
  }

  // Alumni count (if set)
  if (config.alumniCount) {
    schema.alumni = {
      '@type': 'QuantitativeValue',
      'minValue': config.alumniCount,
      'unitText': 'alumni worldwide',
    }
  }

  // Sub-organizations (main institution only)
  if (config.subOrganizations && config.subOrganizations.length > 0) {
    schema.subOrganization = config.subOrganizations.map(sub => ({
      '@type': sub.type,
      'name': sub.name,
      ...(sub.url ? { url: sub.url } : {}),
      'description': sub.description,
      'foundingDate': sub.foundingDate,
    }))
  }

  // Founder (main institution only)
  if (isMainInstitution()) {
    schema.founder = {
      '@type': 'Person',
      'name': 'Kodai Vallal Shri. J.K.K. Natarajah',
      'alternateName': ['J.K.K. Nataraja Chettiar', 'Kodaivallal J.K.K. Nataraja Chettiyar'],
      'description': "Visionary philanthropist who established the J.K.K. Rangammal Charitable Trust with a strong commitment to advancing girls' education",
    }

    // Search and Apply actions (main only)
    schema.potentialAction = [
      {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      {
        '@type': 'ApplyAction',
        'name': 'Apply for Admission',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${SITE_URL}/admissions`,
          'actionPlatform': [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        'result': {
          '@type': 'Thing',
          'name': 'Admission Application',
        },
      },
    ]
  }

  return schema
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
  const config = getInstitutionSEOConfig()

  const schema: WebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}${url}#webpage`,
    name,
    url: `${SITE_URL}${url}`,
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: config.name,
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
