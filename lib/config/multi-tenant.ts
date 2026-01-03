/**
 * Multi-Tenant Configuration System
 *
 * This module provides configuration for running multiple institution websites
 * from a single codebase with different Vercel + Supabase deployments.
 *
 * Architecture:
 * - ONE GitHub repository (source of truth)
 * - MULTIPLE Vercel projects (one per institution)
 * - MULTIPLE Supabase projects (one per institution)
 * - Configuration via environment variables
 */

// =============================================================================
// TYPES
// =============================================================================

export interface InstitutionConfig {
  /** Unique identifier for the institution (used in env: NEXT_PUBLIC_INSTITUTION_ID) */
  id: string
  /** Full name of the institution */
  name: string
  /** Short name/abbreviation */
  shortName: string
  /** Primary domain (e.g., jkkn.ac.in) */
  domain: string
  /** Type of institution */
  type: 'main' | 'college' | 'school' | 'hospital' | 'administration'
  /** Default theme colors */
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
  /** Institution-specific features enabled */
  features: FeatureFlag[]
  /** Supabase project reference (for migration scripts) */
  supabaseProjectRef?: string
}

export type FeatureFlag =
  | 'blog'
  | 'careers'
  | 'page-builder'
  | 'analytics'
  | 'comments'
  | 'newsletter'
  | 'events'
  | 'gallery'
  | 'testimonials'
  | 'admissions'
  | 'faculty-directory'
  | 'course-catalog'
  | 'research-publications'
  | 'alumni-network'
  | 'student-portal'
  | 'placements'

// =============================================================================
// INSTITUTION REGISTRY
// =============================================================================

/**
 * All institutions in the JKKN Group.
 * This is used for:
 * - Migration sync across all Supabase projects
 * - Documentation and reference
 * - Seeding and setup scripts
 *
 * Note: Runtime configuration comes from environment variables,
 * not from this static list.
 */
export const INSTITUTION_REGISTRY: InstitutionConfig[] = [
  {
    id: 'main',
    name: 'JKKN Institutions',
    shortName: 'JKKN',
    domain: 'jkkn.ac.in',
    type: 'main',
    theme: {
      primaryColor: '#1e3a8a',    // Deep blue
      secondaryColor: '#3b82f6',  // Blue
      accentColor: '#f59e0b',     // Amber
    },
    features: [
      'blog', 'careers', 'page-builder', 'analytics',
      'events', 'gallery', 'testimonials', 'newsletter',
    ],
    supabaseProjectRef: 'pmqodbfhsejbvfbmsfeq',
  },
  {
    id: 'arts-science',
    name: 'JKKN College of Arts and Science',
    shortName: 'JKKN CAS',
    domain: 'arts.jkkn.ac.in',
    type: 'college',
    theme: {
      primaryColor: '#166534',    // Green
      secondaryColor: '#22c55e',
      accentColor: '#fbbf24',
    },
    features: [
      'blog', 'careers', 'page-builder', 'analytics',
      'faculty-directory', 'course-catalog', 'admissions',
    ],
  },
  {
    id: 'engineering',
    name: 'JKKN College of Engineering and Technology',
    shortName: 'JKKN CET',
    domain: 'engg.jkkn.ac.in',
    type: 'college',
    theme: {
      primaryColor: '#1e40af',    // Blue
      secondaryColor: '#3b82f6',
      accentColor: '#f97316',
    },
    features: [
      'blog', 'careers', 'page-builder', 'analytics',
      'faculty-directory', 'course-catalog', 'admissions',
      'research-publications', 'placements',
    ],
  },
  {
    id: 'pharmacy',
    name: 'JKKN College of Pharmacy',
    shortName: 'JKKN CP',
    domain: 'pharmacy.jkkn.ac.in',
    type: 'college',
    theme: {
      primaryColor: '#7c2d12',    // Brown/Orange
      secondaryColor: '#ea580c',
      accentColor: '#22c55e',
    },
    features: [
      'blog', 'careers', 'page-builder', 'analytics',
      'faculty-directory', 'course-catalog', 'admissions',
      'research-publications',
    ],
  },
  {
    id: 'dental',
    name: 'JKKN Dental College and Hospital',
    shortName: 'JKKN DC',
    domain: 'dental.jkkn.ac.in',
    type: 'hospital',
    theme: {
      primaryColor: '#0d9488',    // Teal
      secondaryColor: '#14b8a6',
      accentColor: '#f43f5e',
    },
    features: [
      'blog', 'careers', 'page-builder', 'analytics',
      'faculty-directory', 'course-catalog', 'admissions',
      'testimonials',
    ],
    supabaseProjectRef: 'wnmyvbnqldukeknnmnpl',
  },
  {
    id: 'nursing',
    name: 'Sresakthimayeil Institute of Nursing and Research',
    shortName: 'SINR',
    domain: 'nursing.jkkn.ac.in',
    type: 'college',
    theme: {
      primaryColor: '#be185d',    // Pink
      secondaryColor: '#ec4899',
      accentColor: '#06b6d4',
    },
    features: [
      'blog', 'careers', 'page-builder', 'analytics',
      'faculty-directory', 'course-catalog', 'admissions',
    ],
  },
]

// =============================================================================
// RUNTIME CONFIGURATION (from environment variables)
// =============================================================================

/**
 * Get current institution configuration from environment variables.
 * This is the primary way to access institution config at runtime.
 */
export function getCurrentInstitution(): InstitutionConfig {
  const id = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'

  // Try to find in registry first (for full config)
  const fromRegistry = INSTITUTION_REGISTRY.find(inst => inst.id === id)

  // Override with environment variables where provided
  return {
    id,
    name: process.env.NEXT_PUBLIC_INSTITUTION_NAME || fromRegistry?.name || 'JKKN Institutions',
    shortName: process.env.NEXT_PUBLIC_INSTITUTION_SHORT_NAME || fromRegistry?.shortName || 'JKKN',
    domain: process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') || fromRegistry?.domain || 'jkkn.ac.in',
    type: fromRegistry?.type || 'main',
    theme: {
      primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || fromRegistry?.theme.primaryColor || '#1e3a8a',
      secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || fromRegistry?.theme.secondaryColor || '#3b82f6',
      accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || fromRegistry?.theme.accentColor || '#f59e0b',
    },
    features: getEnabledFeatures(),
    supabaseProjectRef: fromRegistry?.supabaseProjectRef,
  }
}

/**
 * Get the current institution ID.
 * Shorthand for accessing just the ID.
 */
export function getInstitutionId(): string {
  return process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
}

/**
 * Check if we're running as a specific institution.
 */
export function isInstitution(id: string): boolean {
  return getInstitutionId() === id
}

/**
 * Check if we're running as the main/umbrella institution.
 */
export function isMainInstitution(): boolean {
  return isInstitution('main')
}

// =============================================================================
// STORAGE CONFIGURATION
// =============================================================================

/**
 * Get the storage bucket name for media files.
 * Each institution can have its own bucket name configured via environment variable.
 *
 * @example
 * - Main Institution: 'cms-media'
 * - Dental College: 'media'
 */
export function getMediaBucket(): string {
  return process.env.NEXT_PUBLIC_MEDIA_BUCKET || 'cms-media'
}

// =============================================================================
// FEATURE FLAGS
// =============================================================================

/**
 * Get list of enabled features from environment variable.
 * Format: NEXT_PUBLIC_FEATURES=blog,careers,analytics
 */
export function getEnabledFeatures(): FeatureFlag[] {
  const featuresEnv = process.env.NEXT_PUBLIC_FEATURES || ''

  if (!featuresEnv) {
    // Default features if not specified
    return ['blog', 'careers', 'page-builder', 'analytics']
  }

  return featuresEnv.split(',').map(f => f.trim()) as FeatureFlag[]
}

/**
 * Check if a specific feature is enabled for current institution.
 * Use this to conditionally render features or routes.
 *
 * @example
 * ```tsx
 * if (hasFeature('blog')) {
 *   // Show blog navigation
 * }
 * ```
 */
export function hasFeature(feature: FeatureFlag): boolean {
  const enabledFeatures = getEnabledFeatures()
  return enabledFeatures.includes(feature)
}

/**
 * Check if multiple features are all enabled.
 */
export function hasAllFeatures(...features: FeatureFlag[]): boolean {
  return features.every(f => hasFeature(f))
}

/**
 * Check if at least one of the features is enabled.
 */
export function hasAnyFeature(...features: FeatureFlag[]): boolean {
  return features.some(f => hasFeature(f))
}

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Get CSS variables for current institution's theme.
 * Use in global styles or Tailwind config.
 */
export function getThemeCSSVariables(): Record<string, string> {
  const institution = getCurrentInstitution()

  return {
    '--color-primary': institution.theme.primaryColor,
    '--color-secondary': institution.theme.secondaryColor,
    '--color-accent': institution.theme.accentColor,
  }
}

/**
 * Get Tailwind-compatible theme colors.
 */
export function getTailwindTheme() {
  const institution = getCurrentInstitution()

  return {
    primary: {
      DEFAULT: institution.theme.primaryColor,
      foreground: '#ffffff',
    },
    secondary: {
      DEFAULT: institution.theme.secondaryColor,
      foreground: '#ffffff',
    },
    accent: {
      DEFAULT: institution.theme.accentColor,
      foreground: '#000000',
    },
  }
}

// =============================================================================
// METADATA UTILITIES
// =============================================================================

/**
 * Get default metadata for the current institution.
 * Use in layout.tsx or page.tsx metadata exports.
 */
export function getInstitutionMetadata() {
  const institution = getCurrentInstitution()

  return {
    title: {
      default: institution.name,
      template: `%s | ${institution.shortName}`,
    },
    description: `Official website of ${institution.name}`,
    keywords: [
      institution.name,
      institution.shortName,
      'JKKN',
      'Education',
      'Tamil Nadu',
    ],
    authors: [{ name: institution.name }],
    creator: 'JKKN Group of Institutions',
    publisher: institution.name,
    metadataBase: new URL(`https://${institution.domain}`),
    openGraph: {
      type: 'website',
      siteName: institution.name,
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

// =============================================================================
// ROUTE UTILITIES
// =============================================================================

/**
 * Get routes that should be hidden based on feature flags.
 * Use in middleware or navigation components.
 */
export function getHiddenRoutes(): string[] {
  const hidden: string[] = []

  if (!hasFeature('blog')) {
    hidden.push('/blog', '/admin/content/blog')
  }

  if (!hasFeature('careers')) {
    hidden.push('/careers', '/admin/content/careers')
  }

  if (!hasFeature('events')) {
    hidden.push('/events', '/admin/content/events')
  }

  if (!hasFeature('gallery')) {
    hidden.push('/gallery', '/admin/content/gallery')
  }

  if (!hasFeature('newsletter')) {
    hidden.push('/admin/communications/newsletter')
  }

  if (!hasFeature('analytics')) {
    hidden.push('/admin/analytics')
  }

  return hidden
}

/**
 * Check if a route should be visible based on feature flags.
 */
export function isRouteEnabled(path: string): boolean {
  const hiddenRoutes = getHiddenRoutes()
  return !hiddenRoutes.some(route => path.startsWith(route))
}

// =============================================================================
// EXPORTS FOR CONVENIENCE
// =============================================================================

export {
  // Re-export from institutions.ts for backwards compatibility
  INSTITUTIONS,
  getInstitutionById,
  getDepartmentsByInstitution,
  getInstitutionOptions,
  getDepartmentOptions,
} from './institutions'
