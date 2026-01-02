/**
 * Multi-Tenant SEO Configuration
 *
 * This module provides site-wide SEO defaults that are:
 * 1. Institution-specific (from environment variables)
 * 2. Database-driven (from settings table)
 * 3. Used as fallbacks when page-specific SEO is not set
 *
 * IMPORTANT: SEO content is stored in each institution's Supabase database.
 * The codebase only provides the STRUCTURE for reading and rendering SEO.
 * Actual SEO content (titles, descriptions, keywords) comes from:
 * - cms_seo_metadata table (per-page SEO)
 * - settings table (site-wide SEO defaults)
 * - Environment variables (institution identity)
 */

import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// =============================================================================
// TYPES
// =============================================================================

export interface SiteSEOSettings {
  // Basic
  siteName: string
  siteDescription: string
  siteKeywords: string[]

  // Default templates
  titleTemplate: string // e.g., "%s | JKKN Dental"
  defaultTitle: string

  // Open Graph defaults
  ogImage: string | null
  ogType: string

  // Twitter defaults
  twitterHandle: string | null
  twitterCardType: 'summary' | 'summary_large_image'

  // Technical
  canonicalBase: string
  robotsDefault: string

  // Verification
  googleSiteVerification: string | null
  bingSiteVerification: string | null

  // Structured data
  organizationType: string
  organizationLogo: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  } | null
}

// =============================================================================
// ENVIRONMENT-BASED DEFAULTS
// =============================================================================

/**
 * Get institution identity from environment variables.
 * These are set per Vercel deployment.
 */
function getInstitutionIdentity() {
  return {
    id: process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main',
    name: process.env.NEXT_PUBLIC_INSTITUTION_NAME || 'JKKN Institutions',
    shortName: process.env.NEXT_PUBLIC_INSTITUTION_SHORT_NAME || 'JKKN',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://jkkn.ac.in',
  }
}

/**
 * Get default SEO settings based on environment.
 * These are used as fallbacks when database settings are not available.
 */
function getDefaultSEOSettings(): SiteSEOSettings {
  const identity = getInstitutionIdentity()

  return {
    siteName: identity.name,
    siteDescription: `Official website of ${identity.name}. Excellence in education since 1994.`,
    siteKeywords: [identity.name, identity.shortName, 'Education', 'Tamil Nadu', 'India'],

    titleTemplate: `%s | ${identity.shortName}`,
    defaultTitle: `${identity.name} | Excellence in Education`,

    ogImage: null,
    ogType: 'website',

    twitterHandle: null,
    twitterCardType: 'summary_large_image',

    canonicalBase: identity.siteUrl,
    robotsDefault: 'index, follow',

    googleSiteVerification: null,
    bingSiteVerification: null,

    organizationType: 'EducationalOrganization',
    organizationLogo: null,
    contactEmail: null,
    contactPhone: null,
    address: null,
  }
}

// =============================================================================
// DATABASE-DRIVEN SEO SETTINGS
// =============================================================================

/**
 * Fetch SEO settings from the institution's Supabase database.
 * Each institution has its own settings in its own Supabase project.
 *
 * The `settings` table stores:
 * - general: site name, contact info, address
 * - seo: site-wide SEO defaults
 * - appearance: logo, colors
 */
export async function getSiteSEOSettings(): Promise<SiteSEOSettings> {
  const defaults = getDefaultSEOSettings()

  try {
    const supabase = await createServerSupabaseClient()

    // Fetch all relevant settings
    const { data: settings } = await supabase
      .from('settings')
      .select('category, data')
      .in('category', ['general', 'seo', 'appearance'])

    if (!settings || settings.length === 0) {
      return defaults
    }

    // Parse settings by category
    const general = settings.find(s => s.category === 'general')?.data as Record<string, any> || {}
    const seo = settings.find(s => s.category === 'seo')?.data as Record<string, any> || {}
    const appearance = settings.find(s => s.category === 'appearance')?.data as Record<string, any> || {}

    // Merge with defaults (database takes precedence)
    return {
      // Basic (from general settings)
      siteName: general.site_name || defaults.siteName,
      siteDescription: seo.site_description || general.site_description || defaults.siteDescription,
      siteKeywords: seo.site_keywords || defaults.siteKeywords,

      // Templates (from SEO settings)
      titleTemplate: seo.title_template || defaults.titleTemplate,
      defaultTitle: seo.default_title || defaults.defaultTitle,

      // Open Graph (from SEO settings + appearance)
      ogImage: seo.og_image || appearance.hero_background_url || defaults.ogImage,
      ogType: seo.og_type || defaults.ogType,

      // Twitter (from SEO settings)
      twitterHandle: seo.twitter_handle || general.social_links?.twitter || defaults.twitterHandle,
      twitterCardType: seo.twitter_card_type || defaults.twitterCardType,

      // Technical
      canonicalBase: seo.canonical_base || process.env.NEXT_PUBLIC_SITE_URL || defaults.canonicalBase,
      robotsDefault: seo.robots_default || defaults.robotsDefault,

      // Verification
      googleSiteVerification: seo.google_site_verification || defaults.googleSiteVerification,
      bingSiteVerification: seo.bing_site_verification || defaults.bingSiteVerification,

      // Organization (from general settings)
      organizationType: seo.organization_type || defaults.organizationType,
      organizationLogo: appearance.logo_url || defaults.organizationLogo,
      contactEmail: general.contact_email || defaults.contactEmail,
      contactPhone: general.contact_phone || defaults.contactPhone,
      address: general.address || defaults.address,
    }
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error)
    return defaults
  }
}

// =============================================================================
// METADATA GENERATION HELPERS
// =============================================================================

/**
 * Generate base metadata for the entire site.
 * Use this in the root layout.tsx
 */
export async function generateSiteMetadata(): Promise<Metadata> {
  const seo = await getSiteSEOSettings()

  return {
    // Basic metadata
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.siteDescription,
    keywords: seo.siteKeywords,

    // Metadata base for relative URLs
    metadataBase: new URL(seo.canonicalBase),

    // Open Graph defaults
    openGraph: {
      type: 'website',
      siteName: seo.siteName,
      locale: 'en_IN',
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },

    // Twitter defaults
    twitter: {
      card: seo.twitterCardType,
      site: seo.twitterHandle || undefined,
    },

    // Robots
    robots: seo.robotsDefault,

    // Verification
    verification: {
      google: seo.googleSiteVerification || undefined,
      other: seo.bingSiteVerification
        ? { 'msvalidate.01': seo.bingSiteVerification }
        : undefined,
    },

    // Other metadata
    authors: [{ name: seo.siteName }],
    creator: seo.siteName,
    publisher: seo.siteName,
  }
}

/**
 * Generate page-specific metadata with fallbacks to site defaults.
 * Use this in individual page.tsx files.
 */
export async function generatePageMetadata(options: {
  title?: string
  description?: string
  keywords?: string | string[]
  image?: string
  noIndex?: boolean
  canonical?: string
  type?: 'website' | 'article'
}): Promise<Metadata> {
  const seo = await getSiteSEOSettings()

  const keywords = Array.isArray(options.keywords)
    ? options.keywords
    : options.keywords?.split(',').map(k => k.trim())

  return {
    title: options.title, // Will use template from layout
    description: options.description || seo.siteDescription,
    keywords: keywords || seo.siteKeywords,

    openGraph: {
      title: options.title,
      description: options.description || seo.siteDescription,
      images: options.image ? [{ url: options.image }] : (seo.ogImage ? [{ url: seo.ogImage }] : undefined),
      type: options.type || 'website',
    },

    twitter: {
      card: seo.twitterCardType,
      title: options.title,
      description: options.description || seo.siteDescription,
      images: options.image ? [options.image] : (seo.ogImage ? [seo.ogImage] : undefined),
    },

    robots: options.noIndex ? 'noindex, nofollow' : seo.robotsDefault,

    alternates: options.canonical ? { canonical: options.canonical } : undefined,
  }
}

// =============================================================================
// STRUCTURED DATA HELPERS
// =============================================================================

/**
 * Generate Organization structured data (JSON-LD).
 * This is institution-specific and comes from database.
 */
export async function generateOrganizationSchema() {
  const seo = await getSiteSEOSettings()

  return {
    '@context': 'https://schema.org',
    '@type': seo.organizationType,
    name: seo.siteName,
    url: seo.canonicalBase,
    logo: seo.organizationLogo,
    email: seo.contactEmail,
    telephone: seo.contactPhone,
    address: seo.address ? {
      '@type': 'PostalAddress',
      streetAddress: seo.address.streetAddress,
      addressLocality: seo.address.addressLocality,
      addressRegion: seo.address.addressRegion,
      postalCode: seo.address.postalCode,
      addressCountry: seo.address.addressCountry,
    } : undefined,
  }
}

/**
 * Generate WebSite structured data (JSON-LD).
 */
export async function generateWebsiteSchema() {
  const seo = await getSiteSEOSettings()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seo.siteName,
    url: seo.canonicalBase,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seo.canonicalBase}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
