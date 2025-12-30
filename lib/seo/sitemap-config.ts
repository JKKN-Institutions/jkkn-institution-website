/**
 * Sitemap Configuration
 * Defines URL priorities and change frequencies for the dynamic sitemap
 */

export const SITE_URL = 'https://jkkn.ac.in'

/**
 * Change frequency hints for search engines
 * Note: Google largely ignores these, but other search engines may use them
 */
export type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

/**
 * Sitemap entry configuration
 */
export interface SitemapUrlConfig {
  priority: number
  changeFrequency: ChangeFrequency
}

/**
 * Static routes with their sitemap configurations
 * These are routes that always exist regardless of database content
 */
export const STATIC_ROUTES: Record<string, SitemapUrlConfig> = {
  // Homepage - highest priority
  '/': {
    priority: 1.0,
    changeFrequency: 'weekly',
  },
  // Main navigation pages
  '/blog': {
    priority: 0.7,
    changeFrequency: 'daily',
  },
  '/careers': {
    priority: 0.7,
    changeFrequency: 'daily',
  },
}

/**
 * Pattern-based priority configuration
 * Used for dynamic content from database
 */
export interface PatternPriorityConfig {
  pattern: RegExp
  priority: number
  changeFrequency: ChangeFrequency
}

/**
 * Priority configurations based on URL patterns
 * Order matters - first match wins
 */
export const PATTERN_PRIORITIES: PatternPriorityConfig[] = [
  // About section - important institutional pages
  {
    pattern: /^\/about\/?$/,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    pattern: /^\/about\/.+/,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  // Course pages - high priority for prospective students
  {
    pattern: /^\/courses-offered\/?$/,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    pattern: /^\/courses-offered\/.+/,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  // Admissions - high priority during admission season
  {
    pattern: /^\/admissions/,
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  // Facilities - moderate priority
  {
    pattern: /^\/facilities\/?$/,
    priority: 0.7,
    changeFrequency: 'monthly',
  },
  {
    pattern: /^\/facilities\/.+/,
    priority: 0.6,
    changeFrequency: 'monthly',
  },
  // Contact - important for conversions
  {
    pattern: /^\/contact/,
    priority: 0.8,
    changeFrequency: 'yearly',
  },
  // Blog posts - individual articles
  {
    pattern: /^\/blog\/.+/,
    priority: 0.6,
    changeFrequency: 'never',
  },
  // Career job postings
  {
    pattern: /^\/careers\/.+/,
    priority: 0.6,
    changeFrequency: 'weekly',
  },
  // Colleges and schools
  {
    pattern: /^\/our-colleges/,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    pattern: /^\/our-schools/,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  // Legal/Policy pages - low priority
  {
    pattern: /^\/more\/privacy-policy/,
    priority: 0.3,
    changeFrequency: 'yearly',
  },
  {
    pattern: /^\/more\/.+/,
    priority: 0.4,
    changeFrequency: 'yearly',
  },
]

/**
 * Default configuration for unmatched URLs
 */
export const DEFAULT_CONFIG: SitemapUrlConfig = {
  priority: 0.5,
  changeFrequency: 'monthly',
}

/**
 * Get sitemap configuration for a given URL path
 */
export function getSitemapConfig(path: string): SitemapUrlConfig {
  // Check static routes first
  if (STATIC_ROUTES[path]) {
    return STATIC_ROUTES[path]
  }

  // Check pattern matches
  for (const config of PATTERN_PRIORITIES) {
    if (config.pattern.test(path)) {
      return {
        priority: config.priority,
        changeFrequency: config.changeFrequency,
      }
    }
  }

  // Return default configuration
  return DEFAULT_CONFIG
}

/**
 * Format a date for sitemap lastmod
 * Returns ISO date string (YYYY-MM-DD)
 */
export function formatSitemapDate(date: Date | string | null): string {
  if (!date) {
    return new Date().toISOString().split('T')[0]
  }
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

/**
 * Build full URL from path
 */
export function buildSitemapUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}

/**
 * Check if a URL should be excluded from the sitemap
 */
export function shouldExcludeUrl(path: string): boolean {
  const excludePatterns = [
    /^\/admin/,
    /^\/auth/,
    /^\/api/,
    /^\/careers\/apply/,
    /^\/private/,
    /\?/, // Query parameters
  ]

  return excludePatterns.some((pattern) => pattern.test(path))
}
