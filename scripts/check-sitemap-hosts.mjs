/**
 * Build-time guard: a sitemap must only advertise URLs on its OWN host.
 *
 * Runs as part of the npm `prebuild` step, so `npm run build` - and therefore
 * every Vercel deployment - executes it before Next.js starts.
 *
 * WHY THIS EXISTS
 * ---------------
 * Measured on 2026-09-07, the parent sitemap (www.jkkn.ac.in) carried five
 * hardcoded cross-host entries:
 *
 *     https://dental.jkkn.ac.in/   https://pharmacy.jkkn.ac.in/
 *     https://engg.jkkn.ac.in/     https://ahs.jkkn.ac.in/
 *     https://cas.jkkn.ac.in/
 *
 * Google accepts a cross-host <loc> only when the OTHER host's robots.txt
 * declares this sitemap. All five sibling robots.txt files were read that day
 * and none does, so Google was discarding every one of those entries. GSC
 * reported one WARNING on sitemap-institutions.xml and nothing else - the
 * build was green, the file was valid XML, the URLs returned 200.
 *
 * They were removed on 2026-09-09. On the same day a second working copy was
 * found with TWO MORE of them already typed in and uncommitted
 * (nursing.sresakthimayeil.jkkn.ac.in, edu.jkkn.ac.in). The fix and the
 * regression were being written at the same time by different people. That is
 * the whole reason this file exists: the intent behind those entries is
 * reasonable ("link the group's colleges from the parent"), so it will be
 * attempted again, and a sitemap is not where that belongs. Put a real link
 * on a real page instead - a sitemap entry Google discards is worth nothing.
 *
 * WHAT IT CHECKS
 * --------------
 * Every `loc:` template literal in lib/config/sitemaps.config.ts must begin
 * with ${siteUrl}. Any literal http:// or https:// origin is a hardcoded host
 * and is reported. This is a text check on purpose: it must run before
 * anything is compiled and must not need TypeScript, a database or a network.
 *
 * SEVERITY IS SCOPED, matching scripts/check-site-url.mjs
 * ------------------------------------------------------
 *   VERCEL_ENV=production  -> HARD FAIL (exit 1)
 *   anything else          -> loud warning, exit 0
 *
 * ESCAPE HATCH
 * ------------
 * ALLOW_CROSS_HOST_SITEMAP=1 downgrades the hard fail to a warning, and
 * prints a banner every build so a temporary workaround cannot go quiet.
 *
 * If the config file cannot be read this guard warns and exits 0. A guard
 * that blocks a deployment for its own tooling reason is worse than the
 * defect it looks for.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const BOLD = '\x1b[1m'
const OFF = '\x1b[0m'

const here = dirname(fileURLToPath(import.meta.url))
const CONFIG = join(here, '..', 'lib', 'config', 'sitemaps.config.ts')

const institution = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
const vercelEnv = process.env.VERCEL_ENV || 'local'
const isProductionDeploy = vercelEnv === 'production'
const escapeHatch = process.env.ALLOW_CROSS_HOST_SITEMAP === '1'

let source
try {
  source = readFileSync(CONFIG, 'utf8')
} catch (err) {
  console.error(`${YELLOW}!${OFF} sitemap host guard skipped - could not read ${CONFIG}: ${err.message}`)
  process.exit(0)
}

// Every entry looks like:  { loc: `${siteUrl}/path`, lastmod: ... }
// A hardcoded origin looks like:  { loc: `https://other.host/`, lastmod: ... }
const LOC = /loc:\s*`([^`]*)`/g

/** @returns {{value: string, line: number}[]} */
function crossHostEntries() {
  const found = []
  let m
  while ((m = LOC.exec(source)) !== null) {
    const value = m[1]
    if (!/^https?:\/\//i.test(value)) continue // starts with ${siteUrl} - fine
    const line = source.slice(0, m.index).split('\n').length
    found.push({ value, line })
  }
  return found
}

const found = crossHostEntries()

if (found.length === 0) {
  console.log(`${GREEN}✓${OFF} sitemap hosts ok for "${institution}": every loc is relative to \${siteUrl}`)
  process.exit(0)
}

const fatal = isProductionDeploy && !escapeHatch
const colour = fatal ? RED : YELLOW
const label = fatal ? 'BUILD BLOCKED' : 'WARNING'

console.error('')
console.error(`${colour}${BOLD}${'='.repeat(74)}${OFF}`)
console.error(`${colour}${BOLD}  ${label} - sitemap declares ${found.length} URL(s) on another host${OFF}`)
console.error(`${colour}${BOLD}${'='.repeat(74)}${OFF}`)
console.error('')
console.error(`  institution : ${institution}`)
console.error(`  VERCEL_ENV  : ${vercelEnv}`)
console.error(`  file        : lib/config/sitemaps.config.ts`)
console.error('')
found.forEach(f => console.error(`  ${colour}x${OFF} line ${f.line}: ${f.value}`))
console.error('')
console.error('  A sitemap may only list URLs on its own host, unless THAT host\'s')
console.error('  robots.txt declares this sitemap. None of the JKKN subdomains does,')
console.error('  so Google discards these entries and reports a warning in Search Console.')
console.error('')
console.error('  Fix: delete the entries. Each subdomain already has its own sitemap')
console.error('  and its own Search Console property. To link the colleges from the')
console.error('  parent, put real links on a real page - that is what Google follows.')
console.error('')

if (escapeHatch && isProductionDeploy) {
  console.error(`${YELLOW}${BOLD}  ALLOW_CROSS_HOST_SITEMAP=1 is set - shipping anyway.${OFF}`)
  console.error(`${YELLOW}  Google will discard these entries and warn on the sitemap.${OFF}`)
  console.error('')
}

if (fatal) {
  process.exit(1)
}

console.error(`  Not a production deployment (VERCEL_ENV=${vercelEnv}) - continuing.`)
console.error('')
process.exit(0)
