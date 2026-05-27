import { NextRequest, NextResponse } from 'next/server'

/**
 * SEO Cleanup Middleware — WordPress Hack Remediation
 *
 * The old jkkn.ac.in WordPress site was compromised with gambling/betting
 * spam injection (~58 URLs: Megapari, Dafabet, 20Bet, Stake, Batery, etc.).
 * This middleware returns 410 Gone for all spam and WordPress legacy patterns
 * to accelerate Google de-indexing and protect domain authority.
 *
 * Also normalizes trailing slashes for canonical URL consistency.
 *
 * Order of operations in Next.js:
 *   1. next.config.ts headers
 *   2. next.config.ts redirects (301s for legitimate page migrations)
 *   3. THIS middleware (410 for spam, trailing-slash normalization)
 *   4. Filesystem routes / catch-all CMS handler
 */

// ── Gambling/betting spam prefixes (WordPress hack injection) ─────────────
// These URL prefixes cover ~58 spam pages injected by attackers.
// Pattern matches the START of the pathname to catch all numbered variants
// (e.g., /megapari-app-download-15/, /megapari-registration-get-49-000-bonus-18/)
const SPAM_REGEX = /^\/(megapari|dafabet|download-dafabet|download-megapari|download-helabet|download-the-latest-version-of-20bet|20bet|22bet|stake-bet|stake-casino|stake-com|stake-online|batery-|1xbit|access-online-casino|exceptional-casino|unrivaled-gaming|available-deposit|100-first-deposit|official-20bet|best-betting|welcome-offer-games|actual-link-to-download|win-in-real-time|how-to-download-dafabet|app-download-\d|minecraft-beta-preview|types-of-batteries-and-cells|ai-process-consulting-the-new-engine)/

// ── WordPress archive pages (author, tag, category, account) ──────────────
// WordPress auto-generates these thin-content pages. The new site uses
// /blog/tag/[slug] and /blog/category/[slug] (different paths, unaffected).
const WP_ARCHIVE_REGEX = /^\/(author|tag|category|account)\//

// ── WordPress system paths ────────────────────────────────────────────────
const WP_SYSTEM_REGEX = /^\/(wp-content|wp-includes|wp-json|wp-admin|xmlrpc\.php)/

// ── WordPress RSS feed URLs (paths ending in /feed) ───────────────────────
const FEED_SUFFIX_REGEX = /\/feed\/?$/

// ── Specific junk/test URLs from old site ─────────────────────────────────
const JUNK_URLS = new Set([
  '/;l',
  '/__trashed-9__trashed',
  '/test-career-page',
  '/test-careers',
  '/test-3',
  '/test-latest',
  '/psychometric-career-test',
  '/info',
  '/camu',
  '/canva',
  '/outlook',
  '/excel',
  '/access',
])

// ── Old WordPress blog/event posts → redirect to /blog ────────────────────
// These are legitimate event announcements and awareness posts from the old
// WordPress site. Instead of returning 404, redirect to /blog to preserve
// link equity and send visitors to the right content section.
const OLD_BLOG_POSTS = new Set([
  '/sresakthimayeil-institute-of-nursing-and-research-conducted-earth-day',
  '/world-kidney-cancer-day',
  '/workshop-on-corticobasal-implants',
  '/e-library-orientation-program',
  '/placement-day-celebration-2025',
  '/resuscitation-india-sumit-2023',
  '/onam-celebrations-ahs-campus',
  '/celebrating-the-98th-birthday-of-jkk-nattaraja-sir-founders-day-at-jkk-nattaraja-college',
  '/kumarapalayam-bypass-marathon',
  '/25th-ips-pg-convention',
  '/national-vaccination-day',
  '/15th-sports-day-event',
  '/world-hepatitis-day',
  '/2-board-examination-in-2022-2023',
  '/road-safety-awareness',
  '/intellectual-property-rights-day-2',
  '/curtain-raiser-jkkn-global-alumni-utsav',
  '/jkkn-college-of-engineering-and-technology-sports-day-2023',
  '/cbct-inauguration',
  '/national-service-scheme',
  '/international-plastic-bag-free-day-2',
  '/world-health-days',
  '/jkkncets-initiative-on-mental-health-and-suicide-awareness',
  '/national-level-technical-symposium-technovation-23',
  '/world-malaria-day',
  '/anti-ragging-seminar-program',
  '/best-poster-award-at-a-national-level-seminar-organized-by-psg-college-of-pharmacy',
  '/world-homeopathy-day',
  '/jkk-nataraja-colleges-first-year-commencement-ceremony-2023',
  '/onam-celebration-at-ahs-campus',
  '/national-conference-race-2k23',
  '/faculty-development-program',
  '/national-level-poster-presentation',
  '/field-visit-day-by-ssm-group-of-schools-to-our-jkkn-dental-college',
  '/national-level-seminar-conducted-by-psg-college-of-pharmacy',
  '/electoral-literacy-club',
  '/world-health-day-celebration',
  '/world-health-day-2',
  '/the-national-level-symposium-technovation-23',
  '/campus-recruitment-drive-2025-a-step-towards-bright-futures',
  '/happy-labour-day',
  '/world-breastfeeding-week-celebration-promoting-maternal-child-health',
  '/alumni-meet-2025-reconnect-relive',
  '/alumni-meet',
  '/internship-workshop-orientation-for-our-final-year-students',
  '/environmental-talks',
  '/jkkn-college-of-engineering-and-technology-15th-annual-day',
])

// ── 410 Gone HTML response ────────────────────────────────────────────────
const GONE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>410 Gone</title>
  <meta name="robots" content="noindex">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:system-ui,sans-serif;max-width:500px;margin:80px auto;text-align:center;color:#333;padding:0 20px">
  <h1 style="font-size:48px;margin-bottom:8px">410</h1>
  <p style="font-size:18px;color:#666;margin-bottom:24px">This page has been permanently removed.</p>
  <a href="/" style="color:#16a34a;text-decoration:underline;font-size:16px">Go to Homepage</a>
</body>
</html>`

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Step 1: Normalize trailing slashes ──────────────────────────────────
  // Redirect /path/ → /path (301) for canonical URL consistency.
  // This ensures each page has exactly one URL and prevents duplicate-content
  // signals in Google. Also ensures subsequent requests hit 301 redirects
  // in next.config.ts that only match non-trailing-slash paths.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  // ── Step 2: Redirect old blog/event posts to /blog ───────────────────────
  if (OLD_BLOG_POSTS.has(pathname)) {
    return NextResponse.redirect(new URL('/blog', request.url), 301)
  }

  // ── Step 3: Return 410 Gone for spam and legacy URLs ────────────────────
  if (
    SPAM_REGEX.test(pathname) ||
    WP_ARCHIVE_REGEX.test(pathname) ||
    WP_SYSTEM_REGEX.test(pathname) ||
    FEED_SUFFIX_REGEX.test(pathname) ||
    JUNK_URLS.has(pathname)
  ) {
    return new NextResponse(GONE_HTML, {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }
}

export const config = {
  matcher: [
    // Run on all paths EXCEPT static assets, API routes, and sitemaps
    '/((?!_next/static|_next/image|api/|sitemap|robots\\.txt|favicon\\.ico|og-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|avif|mp4|pdf)$).*)',
  ],
}
