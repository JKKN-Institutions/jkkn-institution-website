/**
 * Multi-Tenant SEO Configuration
 *
 * This module provides site-wide SEO defaults that are:
 * 1. Institution-specific (from environment variables)
 * 2. Database-driven (from site_settings table)
 * 3. Used as fallbacks when page-specific SEO is not set
 *
 * IMPORTANT: SEO content is stored in each institution's Supabase database.
 * The codebase only provides the STRUCTURE for reading and rendering SEO.
 * Actual SEO content (titles, descriptions, keywords) comes from:
 * - cms_seo_metadata table (per-page SEO)
 * - site_settings table (site-wide SEO defaults)
 * - Environment variables (institution identity)
 */

import { Metadata } from 'next'
import { createPublicSupabaseClient } from '@/lib/supabase/server'

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
    siteDescription: `Official website of ${identity.name}. Excellence in education since 1952.`,
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
 * The `site_settings` table stores key-value pairs grouped by category:
 * - general: site name, contact info, address, social links
 * - seo: meta defaults, analytics IDs, verification codes
 * - appearance: logo, colors, favicon
 */
export async function getSiteSEOSettings(): Promise<SiteSEOSettings> {
  const defaults = getDefaultSEOSettings()

  try {
    // Use cookie-less client to allow static rendering of routes
    const supabase = createPublicSupabaseClient()

    // Fetch all relevant settings from site_settings (key-value pairs)
    const { data: rows } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value, category')
      .in('category', ['general', 'seo', 'appearance'])

    if (!rows || rows.length === 0) {
      return defaults
    }

    // Build lookup maps by category
    const settings: Record<string, Record<string, unknown>> = {}
    for (const row of rows) {
      if (!settings[row.category]) {
        settings[row.category] = {}
      }
      settings[row.category][row.setting_key] = row.setting_value
    }

    const general = settings.general || {}
    const seo = settings.seo || {}
    const appearance = settings.appearance || {}

    // Parse social links (stored as jsonb)
    const socialLinks = general.social_links as Record<string, string> | undefined
    // Parse address (stored as jsonb)
    const address = general.address as Record<string, string> | undefined

    // Merge with defaults (database takes precedence)
    return {
      // Basic (from general settings)
      siteName: (general.site_name as string) || defaults.siteName,
      siteDescription: (seo.default_meta_description as string) || (general.site_description as string) || defaults.siteDescription,
      siteKeywords: defaults.siteKeywords,

      // Templates (from SEO settings)
      titleTemplate: (seo.title_template as string) || defaults.titleTemplate,
      defaultTitle: (seo.default_meta_title as string) || defaults.defaultTitle,

      // Open Graph (from SEO settings + appearance)
      ogImage: (seo.og_image as string) || (appearance.hero_background_url as string) || defaults.ogImage,
      ogType: (seo.og_type as string) || defaults.ogType,

      // Twitter (from SEO settings)
      twitterHandle: (seo.twitter_handle as string) || socialLinks?.twitter || defaults.twitterHandle,
      twitterCardType: (seo.twitter_card_type as 'summary' | 'summary_large_image') || defaults.twitterCardType,

      // Technical
      canonicalBase: (seo.canonical_base as string) || process.env.NEXT_PUBLIC_SITE_URL || defaults.canonicalBase,
      robotsDefault: (seo.robots_default as string) || defaults.robotsDefault,

      // Verification
      googleSiteVerification: (seo.google_site_verification as string) || defaults.googleSiteVerification,
      bingSiteVerification: (seo.bing_site_verification as string) || defaults.bingSiteVerification,

      // Organization (from general settings)
      organizationType: (seo.organization_type as string) || defaults.organizationType,
      organizationLogo: (appearance.logo_url as string) || defaults.organizationLogo,
      contactEmail: (general.contact_email as string) || defaults.contactEmail,
      contactPhone: (general.contact_phone as string) || defaults.contactPhone,
      address: address ? {
        streetAddress: address.line1 || '',
        addressLocality: address.city || '',
        addressRegion: address.state || '',
        postalCode: address.pincode || '',
        addressCountry: address.country || 'IN',
      } : defaults.address,
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
// STRUCTURED DATA HELPERS (deprecated — use lib/seo/structured-data.ts instead)
// =============================================================================

/**
 * @deprecated Use generateOrganizationSchema() from lib/seo/structured-data.ts
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
 * @deprecated Use WebsiteSchema component from components/seo/website-schema.tsx
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
