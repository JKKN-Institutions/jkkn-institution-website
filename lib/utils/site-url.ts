/**
 * Centralized Site URL Utilities
 *
 * All URL generation must use these utilities to ensure:
 * - No hardcoded localhost URLs
 * - No hardcoded domain URLs
 * - Multi-institution architecture compliance
 * - Environment-driven configuration
 */

/**
 * Gets the site URL from environment variables
 * @returns The site URL without trailing slash
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (!url) {
    console.warn('⚠️  NEXT_PUBLIC_SITE_URL not set, using fallback')
    return 'https://jkkn.ac.in'
  }
  return url.replace(/\/$/, '') // Remove trailing slash
}

/**
 * Builds an absolute URL from a path
 * @param path - The path to append to the site URL (with or without leading slash)
 * @returns Full absolute URL
 */
export function buildAbsoluteUrl(path: string): string {
  const base = getSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

/**
 * Validates the site URL configuration
 * @returns Validation result with warnings
 */
export function validateSiteUrl(): {
  isValid: boolean
  url: string
  warnings: string[]
} {
  const url = process.env.NEXT_PUBLIC_SITE_URL || ''
  const warnings: string[] = []

  if (!url) {
    warnings.push('❌ NEXT_PUBLIC_SITE_URL is not set')
  }

  if (url.includes('localhost')) {
    warnings.push('❌ URL points to localhost - will corrupt production data')
  }

  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    warnings.push('❌ URL must start with http:// or https://')
  }

  if (url.endsWith('/')) {
    warnings.push('⚠️  URL has trailing slash - will be automatically removed')
  }

  return {
    isValid: warnings.filter(w => w.startsWith('❌')).length === 0,
    url: url.replace(/\/$/, ''),
    warnings
  }
}

/**
 * Gets the current institution ID from environment
 * @returns Institution ID (e.g., 'main', 'engineering', 'dental')
 */
export function getInstitutionId(): string {
  return process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
}

/**
 * Checks if running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Checks if running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}
