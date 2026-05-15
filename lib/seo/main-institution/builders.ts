/**
 * MAIN-INSTITUTION-SCOPED schema builders.
 *
 * These builders are imported ONLY by main-scoped pages or by the
 * <MainInstitutionPageSchema /> component that gates on isMainInstitution().
 *
 * Engineering / Dental / Pharmacy / etc. deployments never read this file.
 *
 * All Organization references use @id anchoring to the root organization
 * schema already emitted from app/layout.tsx (generateOrganizationSchema).
 */

import { getSiteUrl } from '@/lib/utils/site-url'
import { getInstitutionSEOConfig } from '@/lib/seo/institution-seo-config'
import type { BreadcrumbItem } from '@/lib/seo/types'

// =============================================================================
// SHARED IDs (aligns with generateOrganizationSchema's anchors)
// =============================================================================

export function orgId() {
  return `${getSiteUrl()}/#organization`
}

export function websiteId() {
  return `${getSiteUrl()}/#website`
}

export function webpageIdFor(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${clean}#webpage`
}

// =============================================================================
// BASE WebPage + Breadcrumb (used by every page builder)
// =============================================================================

export interface WebPageInput {
  path: string          // e.g. '/admissions'
  name: string
  description?: string
  keywords?: string[]
  lastReviewed?: string // YYYY-MM-DD
  breadcrumbs?: BreadcrumbItem[]
  /** CSS selectors that voice assistants should read aloud */
  speakableSelectors?: string[]
  /** Page-type override (default WebPage) */
  pageType?:
    | 'WebPage'
    | 'AboutPage'
    | 'ContactPage'
    | 'CollectionPage'
    | 'FAQPage'
    | 'ProfilePage'
    | 'ImageGallery'
}

export function buildWebPage(input: WebPageInput) {
  const SITE_URL = getSiteUrl()
  const config = getInstitutionSEOConfig()
  const url = `${SITE_URL}${input.path.startsWith('/') ? input.path : `/${input.path}`}`
  const schema: Record<string, unknown> = {
    '@type': input.pageType || 'WebPage',
    '@id': webpageIdFor(input.path),
    url,
    name: input.name,
    isPartOf: { '@id': websiteId() },
    about: { '@id': orgId() },
    inLanguage: 'en-IN',
    publisher: { '@id': orgId() },
  }
  if (input.description) schema.description = input.description
  if (input.keywords?.length) schema.keywords = input.keywords.join(', ')
  if (input.lastReviewed) schema.lastReviewed = input.lastReviewed
  if (input.breadcrumbs?.length) {
    schema.breadcrumb = buildBreadcrumbList(input.breadcrumbs)
  }
  if (input.speakableSelectors?.length) {
    schema.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: input.speakableSelectors,
    }
  }
  return schema
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  const SITE_URL = getSiteUrl()
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

// =============================================================================
// FAQPage (main-scoped, natural 40–60 word answers)
// =============================================================================

export interface FAQ {
  q: string
  a: string
}

export function buildFAQPage(faqs: FAQ[], anchorPath: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${getSiteUrl()}${anchorPath}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

// =============================================================================
// HowTo (step-by-step — voice + AI-search friendly)
// =============================================================================

export interface HowToStep {
  name: string
  text: string
  url?: string
}

export function buildHowTo(opts: {
  name: string
  description: string
  anchorPath: string
  totalTimeISO?: string
  steps: HowToStep[]
  estimatedCost?: { value: string; currency: string }
}) {
  const schema: Record<string, unknown> = {
    '@type': 'HowTo',
    '@id': `${getSiteUrl()}${opts.anchorPath}#howto`,
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  }
  if (opts.totalTimeISO) schema.totalTime = opts.totalTimeISO
  if (opts.estimatedCost) {
    schema.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: opts.estimatedCost.currency,
      value: opts.estimatedCost.value,
    }
  }
  return schema
}

// =============================================================================
// Offer (fees / admission offers)
// =============================================================================

export function buildOffer(opts: {
  name: string
  description?: string
  priceCurrency?: string
  price?: string
  priceValidUntil?: string
  url: string
  availability?: string
  category?: string
}) {
  return {
    '@type': 'Offer',
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    url: opts.url,
    priceCurrency: opts.priceCurrency || 'INR',
    ...(opts.price ? { price: opts.price } : {}),
    ...(opts.priceValidUntil ? { priceValidUntil: opts.priceValidUntil } : {}),
    availability: opts.availability || 'https://schema.org/InStock',
    ...(opts.category ? { category: opts.category } : {}),
    seller: { '@id': orgId() },
  }
}

// =============================================================================
// Person (faculty / director / leadership)
// =============================================================================

export interface PersonInput {
  name: string
  jobTitle: string
  slug?: string
  description?: string
  image?: string
  email?: string
  telephone?: string
  sameAs?: string[]
  knowsAbout?: string[]
  alumniOf?: Array<{ name: string; url?: string }>
  memberOf?: Array<{ name: string; url?: string }>
  award?: string[]
  /** Years of experience (for yearsOfExperience soft field) */
  experienceYears?: number
}

export function buildPerson(p: PersonInput) {
  const SITE_URL = getSiteUrl()
  const url = p.slug ? `${SITE_URL}/faculty/${p.slug}` : undefined
  const schema: Record<string, unknown> = {
    '@type': 'Person',
    name: p.name,
    jobTitle: p.jobTitle,
    worksFor: { '@id': orgId() },
    affiliation: { '@id': orgId() },
  }
  if (url) {
    schema.url = url
    schema['@id'] = `${url}#person`
  }
  if (p.description) schema.description = p.description
  if (p.image) schema.image = p.image
  if (p.email) schema.email = p.email
  if (p.telephone) schema.telephone = p.telephone
  if (p.sameAs?.length) schema.sameAs = p.sameAs
  if (p.knowsAbout?.length) schema.knowsAbout = p.knowsAbout
  if (p.alumniOf?.length) {
    schema.alumniOf = p.alumniOf.map((a) => ({
      '@type': 'EducationalOrganization',
      name: a.name,
      ...(a.url ? { url: a.url } : {}),
    }))
  }
  if (p.memberOf?.length) {
    schema.memberOf = p.memberOf.map((m) => ({
      '@type': 'Organization',
      name: m.name,
      ...(m.url ? { url: m.url } : {}),
    }))
  }
  if (p.award?.length) schema.award = p.award
  return schema
}

// =============================================================================
// CollectionPage — directories / listings (faculty list, gallery index, PDFs)
// =============================================================================

export function buildCollectionPage(opts: {
  path: string
  name: string
  description: string
  itemCount?: number
  keywords?: string[]
  breadcrumbs?: BreadcrumbItem[]
  speakableSelectors?: string[]
}) {
  const base = buildWebPage({
    ...opts,
    pageType: 'CollectionPage',
  })
  if (typeof opts.itemCount === 'number') {
    ;(base as Record<string, unknown>).numberOfItems = opts.itemCount
  }
  return base
}

// =============================================================================
// ItemList (faculty directory items, approvals PDFs, policies, etc.)
// =============================================================================

export function buildItemList(opts: {
  anchorPath: string
  name: string
  items: Array<{ name: string; url: string; description?: string }>
}) {
  const SITE_URL = getSiteUrl()
  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}${opts.anchorPath}#itemlist`,
    name: opts.name,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
      ...(it.description ? { description: it.description } : {}),
    })),
  }
}

// =============================================================================
// Article / NewsArticle (for news, announcements, press items)
// =============================================================================

export function buildArticle(opts: {
  headline: string
  description?: string
  image?: string
  datePublished: string
  dateModified?: string
  url: string
  authorName?: string
  articleSection?: string
  keywords?: string[]
}) {
  return {
    '@type': 'Article',
    headline: opts.headline,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    mainEntityOfPage: opts.url,
    url: opts.url,
    publisher: { '@id': orgId() },
    author: opts.authorName
      ? { '@type': 'Person', name: opts.authorName, affiliation: { '@id': orgId() } }
      : { '@id': orgId() },
    ...(opts.articleSection ? { articleSection: opts.articleSection } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(', ') } : {}),
  }
}

// =============================================================================
// Dataset (placement statistics, accreditation data)
// =============================================================================

export function buildDataset(opts: {
  name: string
  description: string
  url: string
  keywords?: string[]
  datePublished?: string
  license?: string
  measurementTechnique?: string
  distribution?: Array<{ encodingFormat: string; contentUrl: string }>
}) {
  const schema: Record<string, unknown> = {
    '@type': 'Dataset',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    creator: { '@id': orgId() },
    publisher: { '@id': orgId() },
  }
  if (opts.keywords?.length) schema.keywords = opts.keywords
  if (opts.datePublished) schema.datePublished = opts.datePublished
  if (opts.license) schema.license = opts.license
  if (opts.measurementTechnique) schema.measurementTechnique = opts.measurementTechnique
  if (opts.distribution?.length) {
    schema.distribution = opts.distribution.map((d) => ({
      '@type': 'DataDownload',
      encodingFormat: d.encodingFormat,
      contentUrl: d.contentUrl.startsWith('http')
        ? d.contentUrl
        : `${getSiteUrl()}${d.contentUrl}`,
    }))
  }
  return schema
}

// =============================================================================
// Place (facilities / buildings)
// =============================================================================

export function buildPlace(opts: {
  name: string
  description?: string
  image?: string
  addressLocality?: string
  amenityFeature?: string[]
}) {
  const config = getInstitutionSEOConfig()
  return {
    '@type': 'Place',
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.address.streetAddress,
      addressLocality: opts.addressLocality || config.address.addressLocality,
      addressRegion: config.address.addressRegion,
      postalCode: config.address.postalCode,
      addressCountry: config.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    },
    ...(opts.amenityFeature?.length
      ? {
          amenityFeature: opts.amenityFeature.map((name) => ({
            '@type': 'LocationFeatureSpecification',
            name,
            value: true,
          })),
        }
      : {}),
  }
}

// =============================================================================
// LocalBusiness variant for contact page (maps + hours)
// =============================================================================

export function buildLocalBusiness() {
  const config = getInstitutionSEOConfig()
  return {
    '@type': 'EducationalOrganization',
    '@id': orgId(),
    name: config.name,
    telephone: config.contactPoint.telephone,
    email: config.email,
    url: `${getSiteUrl()}/`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.address.streetAddress,
      addressLocality: config.address.addressLocality,
      addressRegion: config.address.addressRegion,
      postalCode: config.address.postalCode,
      addressCountry: config.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    hasMap: `https://maps.google.com/?q=${config.geo.latitude},${config.geo.longitude}`,
    sameAs: config.sameAs,
    areaServed: config.areaServed.map((a) => ({ '@type': a.type, name: a.name })),
  }
}

// =============================================================================
// Graph helper
// =============================================================================

export function buildGraph(...nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}
