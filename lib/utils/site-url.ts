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
 * Production fallback URL — used when env var is absent or points to localhost.
 * Must stay on the www host: next.config.ts 301-redirects jkkn.ac.in/* to
 * www.jkkn.ac.in/*, and app/layout.tsx uses the same www fallback for
 * metadataBase. A non-www value here made JSON-LD @id/url disagree with the
 * page's own canonical whenever NEXT_PUBLIC_SITE_URL was unset.
 */
const PRODUCTION_FALLBACK = 'https://www.jkkn.ac.in'

/** Tracks whether the localhost/missing URL warning has already been logged */
let hasWarnedAboutSiteUrl = false

/**
 * Gets the site URL from environment variables.
 * Localhost URLs are always rejected (in both development and production) because
 * this function is used for JSON-LD @id / url fields which must be canonical
 * production URLs for search engines and AI crawlers — fixes SW-006.
 *
 * @returns The site URL without trailing slash
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL

  if (!url) {
    if (!hasWarnedAboutSiteUrl) {
      hasWarnedAboutSiteUrl = true
      console.warn('⚠️  NEXT_PUBLIC_SITE_URL not set, using fallback:', PRODUCTION_FALLBACK)
    }
    return PRODUCTION_FALLBACK
  }

  if (url.includes('localhost')) {
    if (!hasWarnedAboutSiteUrl) {
      hasWarnedAboutSiteUrl = true
      console.warn(
        '⚠️  NEXT_PUBLIC_SITE_URL points to localhost — JSON-LD schemas will use:',
        PRODUCTION_FALLBACK,
        '\n   Fix: set NEXT_PUBLIC_SITE_URL=https://jkkn.ac.in in Vercel → Settings → Environment Variables'
      )
    }
    return PRODUCTION_FALLBACK
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
 * Normalizes a CMS-authored canonical URL.
 *
 * Mirrors the `normalize_canonical_url()` trigger on `cms_seo_metadata` — keep
 * the two in sync. The correct stored value for a page whose canonical is its
 * own URL is `null`: app/(public)/[...slug]/page.tsx falls back to the page's
 * own relative path, which Next resolves against each deployment's
 * metadataBase, so every institution emits its own host automatically.
 *
 * Editors routinely paste a full URL out of the address bar, so this repairs
 * rather than rejects:
 *  - trims whitespace, and collapses an empty value to `null`
 *  - rewrites an absolute URL on the jkkn.ac.in apex/www host to a relative
 *    path, keeping it host-agnostic across the six institution deployments
 *
 * Institution subdomains (dental./engg./pharmacy. …) are deliberately left
 * alone — a cross-domain canonical is a legitimate editorial choice.
 *
 * @param value - Raw canonical URL from the SEO panel
 * @returns Normalized relative path, a foreign absolute URL, or null
 */
export function normalizeCanonicalUrl(value: string | null | undefined): string | null {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const relative = trimmed.replace(/^https?:\/\/(www\.)?jkkn\.ac\.in/i, '')

  // A bare host with no path is the site root
  if (!relative) return '/'

  return relative
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
