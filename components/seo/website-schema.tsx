/**
 * WebSite JSON-LD Schema — Multi-Tenant Aware
 *
 * This component renders structured data for the website entity.
 * It has NO visual impact on the page - only visible in HTML source.
 *
 * Used for:
 * - Google Sitelinks Search Box
 * - Website information in search results
 * - Site navigation hints for search engines
 */

import { getSiteUrl } from '@/lib/utils/site-url'
import { getInstitutionSEOConfig, getCopyrightYear } from '@/lib/seo/institution-seo-config'

export function WebsiteSchema() {
  const siteUrl = getSiteUrl()
  const config = getInstitutionSEOConfig()
  const currentYear = new Date().getFullYear()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    'url': `${siteUrl}/`,
    'name': config.name,
    'alternateName': config.alternateName,
    'description': config.description,
    'publisher': {
      '@type': config.schemaType,
      '@id': `${siteUrl}/#organization`,
      'name': config.name,
      'url': `${siteUrl}/`,
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/images/logo.png`,
        'contentUrl': `${siteUrl}/images/logo.png`,
        'caption': `${config.name} Logo`,
      },
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': config.address.streetAddress,
        'addressLocality': config.address.addressLocality,
        'addressRegion': config.address.addressRegion,
        'postalCode': config.address.postalCode,
        'addressCountry': config.address.addressCountry,
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': config.geo.latitude,
        'longitude': config.geo.longitude,
      },
      'telephone': config.contactPoint.telephone,
      'email': config.email,
      'sameAs': config.sameAs,
    },
    'potentialAction': [
      {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      {
        '@type': 'ReadAction',
        'target': [`${siteUrl}/`],
      },
    ],
    'mainEntity': {
      '@id': `${siteUrl}/#organization`,
    },
    'about': {
      '@type': 'Thing',
      'name': 'Higher Education in Tamil Nadu',
      'description': `Quality higher education programs at ${config.name}`,
    },
    'audience': {
      '@type': 'EducationalAudience',
      'educationalRole': 'student',
      'audienceType': 'Students seeking higher education in Tamil Nadu',
    },
    'inLanguage': [
      { '@type': 'Language', 'name': 'English', 'alternateName': 'en' },
      { '@type': 'Language', 'name': 'Tamil', 'alternateName': 'ta' },
    ],
    'copyrightYear': getCopyrightYear(),
    'copyrightNotice': `\u00A9 ${getCopyrightYear()} ${config.legalName || config.name}. All rights reserved.`,
    'copyrightHolder': { '@id': `${siteUrl}/#organization` },
    'creator': { '@id': `${siteUrl}/#organization` },
    'keywords': config.keywords,
    'isAccessibleForFree': true,
    'isFamilyFriendly': true,
    'contentRating': 'General Audience',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
