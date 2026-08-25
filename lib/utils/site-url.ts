/**
 * Centralized Site URL Utilities
 *
 * All URL generation must use these utilities to ensure:
 * - No hardcoded localhost URLs
 * - No hardcoded domain URLs
 * - Multi-institution architecture compliance
 * - Environment-driven configuration
 *
 * WHY THE FALLBACK IS REGISTRY-DRIVEN AND NOT A LITERAL (changed 2026-08-25)
 * -------------------------------------------------------------------------
 * This file used to fall back to a hardcoded `https://jkkn.ac.in` whenever
 * NEXT_PUBLIC_SITE_URL was missing or pointed at localhost. In a shared,
 * multi-tenant codebase that fallback is not "safe" - it is a CROSS-TENANT
 * LEAK. On the Engineering deployment (whose env var was measured on
 * 2026-08-24 to be `http://localhost:3000`) every consumer of getSiteUrl()
 * silently emitted the PARENT group's domain, so Engineering's JSON-LD told
 * Google that Engineering's Organization and WebSite entities live on
 * jkkn.ac.in. A wrong-tenant canonical URL is worse than a localhost one,
 * because it is syntactically valid and therefore never trips a validator.
 *
 * INSTITUTION_REGISTRY already carries the correct domain for every tenant
 * (engineering -> engg.jkkn.ac.in, dental -> dental.jkkn.ac.in, ...), so the
 * fallback now resolves through it. The group domain survives only as the
 * last resort for an institution id that is not in the registry at all.
 *
 * PRODUCTION NEVER REACHES THE FALLBACK. `scripts/check-site-url.mjs` runs as
 * an npm `prebuild` step and FAILS the build when NEXT_PUBLIC_SITE_URL is
 * missing or localhost, so a deployment cannot ship in that state. The
 * fallback exists for local development and for preview builds - it must not
 * throw, because these functions are called from `force-dynamic` route
 * handlers (sitemap.xml, robots.txt, llms.txt) where a thrown error would
 * serve Googlebot a 500 instead of a slightly-wrong file.
 */

import { INSTITUTION_REGISTRY } from '@/lib/config/multi-tenant'

/**
 * Last-resort URL, used ONLY when the current institution id is absent from
 * INSTITUTION_REGISTRY. Every registered tenant resolves to its own domain.
 */
const GROUP_FALLBACK = 'https://jkkn.ac.in'

/**
 * Fallback origins that deliberately differ from INSTITUTION_REGISTRY.domain.
 *
 * `main`: the registry says `jkkn.ac.in`, but the live parent deployment
 * serves `https://www.jkkn.ac.in` in robots.txt and every sitemap loc
 * (measured 2026-08-25 10:33), `jkkn.ac.in` 308-redirects to www, and the
 * hardcoded fallback this function used before today was also the www form.
 * Its GSC property, however, is the NON-www host. Which host the parent should
 * canonicalise to is an open question and NOT one this change is entitled to
 * answer: a base-URL helper must not silently move a live site between hosts.
 *
 * So the parent keeps the exact fallback it had before. This makes the change
 * a strict no-op for the parent in both possible states - env var set to www
 * (the env var wins anyway) and env var absent (this map reproduces the old
 * hardcoded value). Delete this entry once the www / non-www decision is made
 * and the parent's env var is set explicitly.
 */
const FALLBACK_OVERRIDES: Record<string, string> = {
  main: 'https://www.jkkn.ac.in',
}

/** Tracks whether the localhost/missing URL warning has already been logged */
let hasWarnedAboutSiteUrl = false

/**
 * The correct production origin for the institution this deployment is
 * running as, read from INSTITUTION_REGISTRY.
 *
 * @returns Origin without trailing slash, e.g. `https://engg.jkkn.ac.in`
 */
function registryOrigin(): string {
  const id = getInstitutionId()

  const override = FALLBACK_OVERRIDES[id]
  if (override) {
    return override.replace(/\/$/, '')
  }

  const entry = INSTITUTION_REGISTRY.find(inst => inst.id === id)

  if (entry?.domain) {
    return `https://${entry.domain}`.replace(/\/$/, '')
  }

  // An unregistered institution id. Do not guess a subdomain - fall back to
  // the group domain and say so loudly, because this is a config error.
  console.warn(
    `⚠️  NEXT_PUBLIC_INSTITUTION_ID="${id}" is not in INSTITUTION_REGISTRY.`,
    `\n   Falling back to ${GROUP_FALLBACK}, which is almost certainly the wrong tenant.`,
    `\n   Fix: add this institution to lib/config/multi-tenant.ts, or set NEXT_PUBLIC_SITE_URL.`
  )
  return GROUP_FALLBACK
}

/**
 * Gets the site URL from environment variables.
 * Localhost URLs are always rejected (in both development and production) because
 * this function is used for JSON-LD @id / url fields which must be canonical
 * production URLs for search engines and AI crawlers — fixes SW-006.
 *
 * When the env var is missing or points at localhost, the value resolves from
 * INSTITUTION_REGISTRY for the CURRENT tenant - never from a hardcoded domain.
 *
 * @returns The site URL without trailing slash
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL

  if (!url) {
    const fallback = registryOrigin()
    if (!hasWarnedAboutSiteUrl) {
      hasWarnedAboutSiteUrl = true
      console.warn('⚠️  NEXT_PUBLIC_SITE_URL not set, using registry fallback:', fallback)
    }
    return fallback
  }

  if (url.includes('localhost')) {
    const fallback = registryOrigin()
    if (!hasWarnedAboutSiteUrl) {
      hasWarnedAboutSiteUrl = true
      console.warn(
        '⚠️  NEXT_PUBLIC_SITE_URL points to localhost — using registry fallback:',
        fallback,
        `\n   Fix: set NEXT_PUBLIC_SITE_URL=${fallback} in Vercel → Settings → Environment Variables,`,
        '\n   then Deployments → latest → Redeploy. A production build is blocked until this is done.'
      )
    }
    return fallback
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
