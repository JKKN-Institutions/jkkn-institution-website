/**
 * Build-time guard: NEXT_PUBLIC_SITE_URL must be a real production origin.
 *
 * Runs as the npm `prebuild` step, so `npm run build` (and therefore every
 * Vercel deployment) executes it before Next.js starts.
 *
 * WHY THIS EXISTS
 * ---------------
 * Measured on 2026-08-24, the Engineering deployment (engg.jkkn.ac.in) had
 * NEXT_PUBLIC_SITE_URL set to `http://localhost:3000`. The consequences were
 * live and unnoticed for years:
 *
 *   - all 119 sitemap URLs published as http://localhost:3000/...
 *   - robots.txt advertising Sitemap: http://localhost:3000/sitemap.xml
 *   - 74 of 118 pages carrying a rel=canonical pointing at localhost
 *     (34 of them at the bare root, i.e. declaring themselves the homepage)
 *   - 46 pages with og:url on localhost
 *   - Google Search Console last downloaded the sitemap on 2022-09-02,
 *     reported 1 error, and associated 0 of 118 URLs with any sitemap
 *
 * Nothing failed. The build was green, the deploy was green, the pages
 * returned 200. That is precisely why a guard is needed: this class of defect
 * fails toward looking finished.
 *
 * WHY IT GUARDS THE BUILD AND NOT THE ROUTE HANDLERS
 * --------------------------------------------------
 * sitemap.xml, robots.txt and llms.txt are `export const dynamic =
 * 'force-dynamic'` route handlers. Throwing inside them would not fail a
 * build - it would serve Googlebot a 500 on the very files this is meant to
 * protect. The build is the only place where failing is strictly better than
 * continuing.
 *
 * SEVERITY IS SCOPED DELIBERATELY
 * -------------------------------
 *   VERCEL_ENV=production  -> HARD FAIL (exit 1). A production deployment
 *                             must never ship a localhost base URL.
 *   anything else          -> loud warning, exit 0. Local builds and preview
 *                             deployments stay unblocked; a throwaway preview
 *                             URL is not worth breaking a developer's build.
 *
 * ESCAPE HATCH
 * ------------
 * ALLOW_LOCALHOST_SITE_URL=1 downgrades the hard fail to a warning. It exists
 * so a genuine emergency deploy is not blocked by a config fix nobody is
 * awake to make. It prints a banner every single build, on purpose - a silent
 * escape hatch is how a temporary workaround becomes permanent.
 *
 * No dependencies and no imports: this must run before anything is compiled,
 * and must not fail for a tooling reason.
 */

const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const BOLD = '\x1b[1m'
const OFF = '\x1b[0m'

const url = process.env.NEXT_PUBLIC_SITE_URL
const institution = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
const vercelEnv = process.env.VERCEL_ENV || 'local'
const isProductionDeploy = vercelEnv === 'production'
const escapeHatch = process.env.ALLOW_LOCALHOST_SITE_URL === '1'

/** @returns {string[]} one entry per problem found; empty means the value is fine */
function problems() {
  const found = []
  if (!url) {
    found.push('NEXT_PUBLIC_SITE_URL is not set')
    return found
  }
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    found.push(`NEXT_PUBLIC_SITE_URL points at a local address: ${url}`)
  }
  if (!/^https?:\/\//.test(url)) {
    found.push(`NEXT_PUBLIC_SITE_URL must start with http:// or https:// (got: ${url})`)
  }
  if (isProductionDeploy && url.startsWith('http://')) {
    found.push(`NEXT_PUBLIC_SITE_URL must be https in production (got: ${url})`)
  }
  if (url.endsWith('/')) {
    found.push(`NEXT_PUBLIC_SITE_URL must not end with a slash (got: ${url})`)
  }
  return found
}

const found = problems()

if (found.length === 0) {
  console.log(`${GREEN}✓${OFF} NEXT_PUBLIC_SITE_URL ok for "${institution}": ${url}`)
  process.exit(0)
}

const fatal = isProductionDeploy && !escapeHatch
const colour = fatal ? RED : YELLOW
const label = fatal ? 'BUILD BLOCKED' : 'WARNING'

console.error('')
console.error(`${colour}${BOLD}${'='.repeat(74)}${OFF}`)
console.error(`${colour}${BOLD}  ${label} - NEXT_PUBLIC_SITE_URL is not a usable production origin${OFF}`)
console.error(`${colour}${BOLD}${'='.repeat(74)}${OFF}`)
console.error('')
console.error(`  institution : ${institution}`)
console.error(`  VERCEL_ENV  : ${vercelEnv}`)
console.error(`  value       : ${url === undefined ? '(not set)' : url}`)
console.error('')
found.forEach(p => console.error(`  ${colour}x${OFF} ${p}`))
console.error('')
console.error('  Fix, in the Vercel project for THIS institution only:')
console.error('    Settings -> Environment Variables -> NEXT_PUBLIC_SITE_URL')
console.error('    Set it to the production origin, no trailing slash, https, no www.')
console.error('    Then Deployments -> latest -> Redeploy.')
console.error('')
console.error('  Do NOT change another institution\'s project to make this pass.')
console.error('  Every tenant deploys from this same repository.')
console.error('')

if (escapeHatch && isProductionDeploy) {
  console.error(`${YELLOW}${BOLD}  ALLOW_LOCALHOST_SITE_URL=1 is set - shipping anyway.${OFF}`)
  console.error(`${YELLOW}  This deployment will publish wrong canonical, sitemap and og:url values.${OFF}`)
  console.error(`${YELLOW}  Remove this variable once NEXT_PUBLIC_SITE_URL is correct.${OFF}`)
  console.error('')
}

if (fatal) {
  process.exit(1)
}

console.error(`  Not a production deployment (VERCEL_ENV=${vercelEnv}) - continuing.`)
console.error('')
process.exit(0)
