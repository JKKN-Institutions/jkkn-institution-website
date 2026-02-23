/**
 * Institution-Specific robots.txt Configuration
 *
 * This file stores the complete robots.txt content for each institution.
 * The app/robots.txt/route.ts dynamically serves the correct content
 * based on NEXT_PUBLIC_INSTITUTION_ID.
 *
 * Strategy: Preserve original formatting, comments, and documentation
 * from each institution's robots.txt file.
 */

export type InstitutionId = 'main' | 'engineering' | 'dental' | 'pharmacy' | 'arts-science' | 'nursing'

/**
 * Get robots.txt content for a specific institution
 */
export function getRobotsTxt(institutionId: string, siteUrl: string): string {
  const normalizedId = institutionId.toLowerCase()

  switch (normalizedId) {
    case 'engineering':
      return getEngineeringRobotsTxt(siteUrl)
    case 'dental':
      return getDentalRobotsTxt(siteUrl)
    case 'pharmacy':
      return getPharmacyRobotsTxt(siteUrl)
    case 'arts-science':
      return getArtsScienceRobotsTxt(siteUrl)
    case 'nursing':
      return getNursingRobotsTxt(siteUrl)
    case 'main':
    default:
      return getMainRobotsTxt(siteUrl)
  }
}

/**
 * Engineering College robots.txt (Version 2.0 - Full AI Crawler Support)
 */
function getEngineeringRobotsTxt(siteUrl: string): string {
  return `# =============================================================================
# robots.txt — JKKN College of Engineering and Technology
# Website: ${siteUrl}
# Framework: Next.js (App Router)
# Last Updated: 2026-02-16
# Version: 2.0 (Improved — expanded AI coverage + detailed blocking)
# =============================================================================
# Purpose: Control search engine and AI crawler access to maximise SEO, AEO,
# GEO, LLMO, and AAO visibility while protecting internal/build paths
# and saving crawl budget.
# =============================================================================
# AI Crawler Strategy: ALLOW ALL — maximises brand presence in AI-generated
# answers across ChatGPT, Gemini, Claude, Perplexity, Grok, Copilot, Siri,
# Meta AI, and all emerging AI search platforms.
# =============================================================================


# ---------------------------------------------------------------------------
# 1. GENERAL RULES (All Crawlers)
# ---------------------------------------------------------------------------
# Default: Allow all bots to crawl all public pages.
# Block only paths that waste crawl budget, expose internal routes,
# create duplicate content, or leak sensitive files.

User-agent: *

# --- ALLOW: Important SEO pages (explicit positive signals) ---
Allow: /
Allow: /about/
Allow: /academics/
Allow: /admissions/
Allow: /research/
Allow: /facilities/
Allow: /contact/
Allow: /accreditation/
Allow: /committees/
Allow: /gallery/
Allow: /placements/
Allow: /blog/
Allow: /news/
Allow: /events/
Allow: /sitemap.xml

# --- DISALLOW: Next.js internal/build paths (zero SEO value) ---
Disallow: /_next/             # Build assets — JS chunks, CSS, webpack output
Disallow: /api/               # API routes — server-side only, not indexable
Disallow: /*.json$            # Next.js data routes — _next/data/*.json files
Disallow: /_error             # Next.js error boundary page
Disallow: /_not-found         # Next.js 404 catch-all (App Router)

# --- DISALLOW: Admin, CMS & internal paths ---
Disallow: /admin/             # Admin panel
Disallow: /admin              # Admin without trailing slash
Disallow: /login/             # Login pages
Disallow: /login
Disallow: /signin/            # Alternative sign-in path
Disallow: /signup/            # Registration paths
Disallow: /register/          # Student/staff registration portal
Disallow: /dashboard/         # Internal dashboards
Disallow: /cms/               # CMS management interface
Disallow: /panel/             # Control panel
Disallow: /preview/           # CMS preview/draft pages (not ready for public)
Disallow: /draft/             # Unpublished draft content
Disallow: /staging/           # Staging environment pages
Disallow: /test/              # Test pages
Disallow: /debug/             # Debug routes
Disallow: /tmp/               # Temporary files
Disallow: /temp/              # Temporary directory
Disallow: /private/           # Private/internal content
Disallow: /internal/          # Internal pages
Disallow: /staff/             # Staff-only portal
Disallow: /student-portal/    # Student login area (not for crawlers)
Disallow: /faculty-portal/    # Faculty login area

# --- DISALLOW: Duplicate content & parameter pollution ---
Disallow: /search             # Internal site search results (thin/duplicate content)
Disallow: /search/            # Internal search with trailing slash
Disallow: /*?q=               # Search query parameters
Disallow: /*?s=               # Alternative search parameters
Disallow: /*?ref=             # Referral tracking parameters
Disallow: /*?utm_             # UTM campaign parameters (duplicates clean URLs)
Disallow: /*?utm_source=      # Explicit UTM source
Disallow: /*?utm_medium=      # Explicit UTM medium
Disallow: /*?utm_campaign=    # Explicit UTM campaign
Disallow: /*?fbclid=          # Facebook click ID (auto-appended by FB)
Disallow: /*?gclid=           # Google Ads click ID
Disallow: /*?gad_source=      # Google Ads source parameter
Disallow: /*?msclkid=         # Microsoft Ads click ID
Disallow: /*?mc_cid=          # Mailchimp campaign ID
Disallow: /*?mc_eid=          # Mailchimp email ID
Disallow: /*?_ga=             # Google Analytics cross-domain parameter
Disallow: /*?_gl=             # Google Linker parameter
Disallow: /*?sort=            # Sort/filter parameters
Disallow: /*?filter=          # Filter parameters
Disallow: /*?order=           # Ordering parameters
Disallow: /*?page=0           # Pagination page 0 (usually an error)
Disallow: /*?sessionid=       # Session ID in URL (security + duplicate)
Disallow: /*?sid=             # Short session ID parameter
Disallow: /*?preview=         # Preview mode parameter
Disallow: /*?draft=           # Draft mode parameter
Disallow: /*&                 # Catch URLs with multiple query parameters

# --- DISALLOW: Print, feed & utility pages ---
Disallow: /print/             # Print-friendly versions (duplicate content)
Disallow: /*?print=           # Print parameter versions
Disallow: /feed/              # RSS/Atom feeds (not for indexing)
Disallow: /feed               # Feed without trailing slash
Disallow: /rss/               # RSS feed path
Disallow: /atom/              # Atom feed path
Disallow: /trackback/         # Trackback URLs (legacy)
Disallow: /embed/             # Embedded content frames
Disallow: /thank-you          # Form submission confirmation pages (thin content)
Disallow: /thankyou           # Alternative thank-you path
Disallow: /confirmation       # Generic confirmation pages
Disallow: /success            # Form success pages
Disallow: /unsubscribe        # Email unsubscribe pages
Disallow: /redirect/          # Redirect handler pages
Disallow: /go/                # URL shortener/redirect paths
Disallow: /out/               # External redirect tracker

# --- DISALLOW: Error & status pages ---
Disallow: /404                # 404 error page
Disallow: /500                # 500 server error page
Disallow: /403                # 403 forbidden page
Disallow: /error/             # Error directory
Disallow: /maintenance        # Maintenance mode page
Disallow: /offline            # Offline fallback page (PWA)

# --- DISALLOW: Source code & sensitive files (security hardening) ---
Disallow: /.git/              # Git repository (if accidentally exposed)
Disallow: /.git               # Git without trailing slash
Disallow: /.env               # Environment variables file
Disallow: /.next/             # Next.js build output directory
Disallow: /node_modules/      # Node.js dependencies
Disallow: /.vscode/           # VS Code config
Disallow: /.idea/             # JetBrains IDE config
Disallow: /*.sql$             # Database dump files
Disallow: /*.bak$             # Backup files
Disallow: /*.log$             # Log files
Disallow: /*.config$          # Config files
Disallow: /package.json       # Package manifest
Disallow: /package-lock.json  # Lock file
Disallow: /tsconfig.json      # TypeScript config
Disallow: /next.config.js     # Next.js config
Disallow: /next.config.mjs    # Next.js config (ESM)
Disallow: /.htaccess          # Apache config (if any)
Disallow: /web.config         # IIS config (if any)
Disallow: /server.js          # Server entry file
Disallow: /Dockerfile         # Docker config
Disallow: /docker-compose.yml # Docker Compose config

# --- DISALLOW: Legacy CMS paths (defensive — in case old URLs still resolve) ---
Disallow: /wp-admin/          # WordPress admin
Disallow: /wp-login.php       # WordPress login
Disallow: /wp-content/        # WordPress uploads/themes/plugins
Disallow: /wp-includes/       # WordPress core files
Disallow: /wp-json/           # WordPress REST API
Disallow: /xmlrpc.php         # WordPress XML-RPC (security risk if exposed)
Disallow: /cgi-bin/           # Legacy CGI scripts
Disallow: /phpmyadmin/        # phpMyAdmin (if exposed)


# ---------------------------------------------------------------------------
# 2. GOOGLEBOT (Primary Search Engine — #1 Traffic Source)
# ---------------------------------------------------------------------------
# Google is the dominant traffic source for Indian education websites.
# Full access. No crawl-delay — Google self-manages crawl rate.
# Specific Disallow for internal paths to focus Google's crawl budget.

User-agent: Googlebot
Allow: /
Disallow: /_next/
Disallow: /api/
Disallow: /admin/
Disallow: /preview/
Disallow: /draft/
Disallow: /search
Disallow: /print/

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-Video
Allow: /

User-agent: Googlebot-News
Allow: /blog/
Allow: /news/
Allow: /events/


# ---------------------------------------------------------------------------
# 3. BINGBOT (Bing Search + Microsoft Copilot + DuckDuckGo)
# ---------------------------------------------------------------------------
# Bing powers: Bing Search, Microsoft Copilot, Bing Chat, DuckDuckGo,
# Yahoo Search (partially). Critical for AEO and GEO visibility.

User-agent: Bingbot
Allow: /
Disallow: /_next/
Disallow: /api/
Disallow: /admin/
Disallow: /search
Crawl-delay: 2


# ---------------------------------------------------------------------------
# 4. AI CRAWLERS — ALLOW ALL (AEO + GEO + LLMO + AAO Strategy)
# ---------------------------------------------------------------------------
# Total: 30+ AI crawlers explicitly allowed.
#
# Why allow all? Each AI platform is a discovery channel:
# - Google AI Overviews → 40%+ of Google searches now show AI answers
# - ChatGPT Search → fastest growing search alternative
# - Perplexity → top AI-native search engine
# - Claude → used by professionals & researchers
# - Grok → integrated with X (Twitter), growing user base
# - Meta AI → 500M+ users via WhatsApp, Instagram, Facebook
# - Apple Intelligence → every iPhone/iPad/Mac user
# - Microsoft Copilot → enterprise & education users
#
# BLOCKING these = invisible in AI-generated answers.
# For an engineering college competing for student admissions, AI visibility
# is now as critical as Google page 1 ranking.
# =======================================================================

# --- Google AI (Gemini, AI Overviews, SGE, Vertex AI, Project Mariner) ---
User-agent: Google-Extended
Allow: /

User-agent: Google-CloudVertexBot
Allow: /

User-agent: Gemini-Deep-Research
Allow: /

User-agent: GoogleAgent-Mariner
Allow: /

# --- OpenAI (ChatGPT, ChatGPT Search, GPT-4, Operator, DALL-E) ---
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# --- Anthropic (Claude AI, Claude Search, Claude Web) ---
User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: claude-web
Allow: /

# --- Perplexity AI (Perplexity Search, Perplexity Browsing) ---
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# --- xAI / Grok (Grok AI, Grok Search, Grok DeepSearch) ---
User-agent: GrokBot
Allow: /

User-agent: xAI-Grok
Allow: /

User-agent: Grok-DeepSearch
Allow: /

# --- Meta AI (Llama, Meta AI Assistant, WhatsApp AI, Instagram AI) ---
User-agent: FacebookBot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: meta-externalfetcher
Allow: /

User-agent: Meta-WebIndexer
Allow: /

# --- Microsoft / Bing AI ---
User-agent: DuckAssistBot
Allow: /

# --- Apple (Siri, Safari Suggestions, Apple Intelligence, Spotlight) ---
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# --- Amazon (Alexa, Amazon Q, voice search) ---
User-agent: Amazonbot
Allow: /

# --- Mistral AI ---
User-agent: MistralAI-User
Allow: /

# --- Cohere AI ---
User-agent: cohere-ai
Allow: /

# --- You.com (YouChat AI search) ---
User-agent: YouBot
Allow: /

# --- Allen Institute for AI (AI2 — academic/research AI) ---
User-agent: AI2Bot
Allow: /

User-agent: AI2Bot-Dolma
Allow: /

# --- Common Crawl (open dataset — trains many AI models) ---
User-agent: CCBot
Allow: /

# --- ByteDance (TikTok search, Doubao AI) ---
User-agent: Bytespider
Allow: /

User-agent: TikTokSpider
Allow: /

# --- Diffbot (AI-powered web data extraction — feeds many AI systems) ---
User-agent: Diffbot
Allow: /

# --- Yandex (Russian search + YandexGPT AI) ---
User-agent: YandexBot
Allow: /
Crawl-delay: 5

# --- Baidu (Chinese search + Ernie AI — small but growing globally) ---
User-agent: Baiduspider
Allow: /
Crawl-delay: 5

# --- Naver (Korean search + HyperCLOVA AI) ---
User-agent: Yeti
Allow: /
Crawl-delay: 5

# --- Huawei (Petal Search) ---
User-agent: PetalBot
Allow: /
Crawl-delay: 3

# --- Webz.io (Data feeds used by AI platforms) ---
User-agent: webzio-extended
Allow: /

# --- ICC Crawler (International Computing Centre — research AI) ---
User-agent: ICC-Crawler
Allow: /

# --- Timpi (Decentralised search engine) ---
User-agent: Timpibot
Allow: /

# --- Omgili (Blog/forum indexer — feeds AI aggregators) ---
User-agent: omgili
Allow: /

# --- ImagesiftBot (AI image indexing) ---
User-agent: ImagesiftBot
Allow: /


# ---------------------------------------------------------------------------
# 5. SOCIAL MEDIA CRAWLERS (Link Previews & Sharing)
# ---------------------------------------------------------------------------
# These bots generate link previews (title + image + description) when
# URLs are shared on social platforms. Blocking = broken/ugly previews.

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Slackbot
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: Discordbot
Allow: /

User-agent: PinterestBot
Allow: /

User-agent: Quora-Bot
Allow: /


# ---------------------------------------------------------------------------
# 6. SEO TOOL CRAWLERS
# ---------------------------------------------------------------------------
# Allow SEO tools for auditing and monitoring. Crawl-delay applied
# to prevent server overload from aggressive tool crawling.

User-agent: Screaming Frog SEO Spider
Allow: /

User-agent: SemrushBot
Allow: /
Crawl-delay: 3

User-agent: AhrefsBot
Allow: /
Crawl-delay: 3

User-agent: DotBot
Allow: /
Crawl-delay: 5

User-agent: MJ12bot
Allow: /
Crawl-delay: 5

User-agent: SiteAuditBot
Allow: /
Crawl-delay: 3

User-agent: Moz
Allow: /
Crawl-delay: 3


# ---------------------------------------------------------------------------
# 7. BLOCK KNOWN SPAM / SCRAPER / LOW-VALUE BOTS
# ---------------------------------------------------------------------------
# These bots provide zero SEO or marketing value, waste server resources,
# and some are known for aggressive scraping behaviour.

User-agent: MauiBot
Disallow: /

User-agent: SeznamBot
Disallow: /

User-agent: SemrushBot-BA
Disallow: /

User-agent: SemrushBot-OCOB
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: DataForSeoBot
Disallow: /

User-agent: magpie-crawler
Disallow: /

User-agent: AhrefsSiteAudit
Disallow: /

User-agent: Sogou
Disallow: /

User-agent: AspiegelBot
Disallow: /

User-agent: PanguBot
Disallow: /

User-agent: Sentibot
Disallow: /

User-agent: AwarioBot
Disallow: /

User-agent: AwarioSmartBot
Disallow: /

User-agent: AwarioRssBot
Disallow: /

User-agent: VelenPublicWebCrawler
Disallow: /

User-agent: TurnitinBot
Disallow: /

User-agent: img2dataset
Disallow: /

User-agent: Kangaroo Bot
Disallow: /

User-agent: zoominfobot
Disallow: /

User-agent: Seekport
Disallow: /

User-agent: Buck
Disallow: /

User-agent: newspaper
Disallow: /


# ---------------------------------------------------------------------------
# 8. SITEMAP & HOST
# ---------------------------------------------------------------------------

Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}

# =============================================================================
# END OF robots.txt
# Total: 50+ bot-specific directives | 80+ block rules | 30+ AI crawlers
# Strategy: Maximum AI/search visibility + zero crawl budget waste
# =============================================================================
`
}

/**
 * Main Institution robots.txt (Full AI Crawler Support)
 */
function getMainRobotsTxt(siteUrl: string): string {
  return generateFullRobotsTxt({
    siteUrl,
    institutionName: 'JKKN Group of Institutions',
    extraAllowPaths: [
      'Allow: /about-the-institutions/',
      'Allow: /about-the-trust/',
      'Allow: /colleges/',
      'Allow: /courses-offered/',
    ],
  })
}

/**
 * Dental College robots.txt (Full AI Crawler Support)
 */
function getDentalRobotsTxt(siteUrl: string): string {
  return generateFullRobotsTxt({
    siteUrl,
    institutionName: 'JKKN Dental College and Hospital',
    extraAllowPaths: [
      'Allow: /departments/',
      'Allow: /hospital/',
      'Allow: /specialties/',
      'Allow: /outreach/',
    ],
  })
}

/**
 * Pharmacy College robots.txt (Full AI Crawler Support)
 */
function getPharmacyRobotsTxt(siteUrl: string): string {
  return generateFullRobotsTxt({
    siteUrl,
    institutionName: 'JKKN College of Pharmacy',
    extraAllowPaths: [
      'Allow: /departments/',
      'Allow: /research/',
      'Allow: /clinical-pharmacy/',
    ],
  })
}

/**
 * Arts & Science College robots.txt (Full AI Crawler Support)
 */
function getArtsScienceRobotsTxt(siteUrl: string): string {
  return generateFullRobotsTxt({
    siteUrl,
    institutionName: 'JKKN College of Arts and Science',
    extraAllowPaths: [
      'Allow: /departments/',
      'Allow: /research/',
      'Allow: /cultural/',
    ],
  })
}

/**
 * Nursing College robots.txt (Full AI Crawler Support)
 */
function getNursingRobotsTxt(siteUrl: string): string {
  return generateFullRobotsTxt({
    siteUrl,
    institutionName: 'JKKN College of Nursing',
    extraAllowPaths: [
      'Allow: /departments/',
      'Allow: /clinical-training/',
      'Allow: /specializations/',
    ],
  })
}

/**
 * Shared generator for full-featured robots.txt with AI crawler support
 */
function generateFullRobotsTxt({
  siteUrl,
  institutionName,
  extraAllowPaths = [],
}: {
  siteUrl: string
  institutionName: string
  extraAllowPaths?: string[]
}): string {
  const extraPaths = extraAllowPaths.length > 0 ? '\n' + extraAllowPaths.join('\n') : ''
  return `# =============================================================================
# robots.txt — ${institutionName}
# Website: ${siteUrl}
# Framework: Next.js (App Router)
# Last Updated: 2026-02-16
# Version: 2.0 (Improved — expanded AI coverage + detailed blocking)
# =============================================================================
# Purpose: Control search engine and AI crawler access to maximise SEO, AEO,
# GEO, LLMO, and AAO visibility while protecting internal/build paths
# and saving crawl budget.
# =============================================================================
# AI Crawler Strategy: ALLOW ALL — maximises brand presence in AI-generated
# answers across ChatGPT, Gemini, Claude, Perplexity, Grok, Copilot, Siri,
# Meta AI, and all emerging AI search platforms.
# =============================================================================


# ---------------------------------------------------------------------------
# 1. GENERAL RULES (All Crawlers)
# ---------------------------------------------------------------------------

User-agent: *

# --- ALLOW: Important SEO pages (explicit positive signals) ---
Allow: /
Allow: /about/
Allow: /academics/
Allow: /admissions/
Allow: /research/
Allow: /facilities/
Allow: /contact/
Allow: /accreditation/
Allow: /committees/
Allow: /gallery/
Allow: /placements/
Allow: /blog/
Allow: /news/
Allow: /events/
Allow: /sitemap.xml${extraPaths}

# --- DISALLOW: Next.js internal/build paths (zero SEO value) ---
Disallow: /_next/
Disallow: /api/
Disallow: /*.json$
Disallow: /_error
Disallow: /_not-found

# --- DISALLOW: Admin, CMS & internal paths ---
Disallow: /admin/
Disallow: /admin
Disallow: /login/
Disallow: /login
Disallow: /signin/
Disallow: /signup/
Disallow: /register/
Disallow: /dashboard/
Disallow: /cms/
Disallow: /panel/
Disallow: /preview/
Disallow: /draft/
Disallow: /staging/
Disallow: /test/
Disallow: /debug/
Disallow: /tmp/
Disallow: /temp/
Disallow: /private/
Disallow: /internal/
Disallow: /staff/
Disallow: /student-portal/
Disallow: /faculty-portal/

# --- DISALLOW: Duplicate content & parameter pollution ---
Disallow: /search
Disallow: /search/
Disallow: /*?q=
Disallow: /*?s=
Disallow: /*?ref=
Disallow: /*?utm_
Disallow: /*?utm_source=
Disallow: /*?utm_medium=
Disallow: /*?utm_campaign=
Disallow: /*?fbclid=
Disallow: /*?gclid=
Disallow: /*?gad_source=
Disallow: /*?msclkid=
Disallow: /*?mc_cid=
Disallow: /*?mc_eid=
Disallow: /*?_ga=
Disallow: /*?_gl=
Disallow: /*?sort=
Disallow: /*?filter=
Disallow: /*?order=
Disallow: /*?page=0
Disallow: /*?sessionid=
Disallow: /*?sid=
Disallow: /*?preview=
Disallow: /*?draft=
Disallow: /*&

# --- DISALLOW: Print, feed & utility pages ---
Disallow: /print/
Disallow: /*?print=
Disallow: /feed/
Disallow: /feed
Disallow: /rss/
Disallow: /atom/
Disallow: /trackback/
Disallow: /embed/
Disallow: /thank-you
Disallow: /thankyou
Disallow: /confirmation
Disallow: /success
Disallow: /unsubscribe
Disallow: /redirect/
Disallow: /go/
Disallow: /out/

# --- DISALLOW: Error & status pages ---
Disallow: /404
Disallow: /500
Disallow: /403
Disallow: /error/
Disallow: /maintenance
Disallow: /offline

# --- DISALLOW: Source code & sensitive files ---
Disallow: /.git/
Disallow: /.git
Disallow: /.env
Disallow: /.next/
Disallow: /node_modules/
Disallow: /*.sql$
Disallow: /*.bak$
Disallow: /*.log$
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /tsconfig.json
Disallow: /next.config.js
Disallow: /next.config.mjs

# --- DISALLOW: Legacy CMS paths ---
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /wp-content/
Disallow: /wp-includes/
Disallow: /wp-json/
Disallow: /xmlrpc.php
Disallow: /cgi-bin/
Disallow: /phpmyadmin/


# ---------------------------------------------------------------------------
# 2. GOOGLEBOT (Primary Search Engine)
# ---------------------------------------------------------------------------

User-agent: Googlebot
Allow: /
Disallow: /_next/
Disallow: /api/
Disallow: /admin/
Disallow: /preview/
Disallow: /draft/
Disallow: /search
Disallow: /print/

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-Video
Allow: /

User-agent: Googlebot-News
Allow: /blog/
Allow: /news/
Allow: /events/


# ---------------------------------------------------------------------------
# 3. BINGBOT (Bing Search + Microsoft Copilot + DuckDuckGo)
# ---------------------------------------------------------------------------

User-agent: Bingbot
Allow: /
Disallow: /_next/
Disallow: /api/
Disallow: /admin/
Disallow: /search
Crawl-delay: 2


# ---------------------------------------------------------------------------
# 4. AI CRAWLERS — ALLOW ALL (AEO + GEO + LLMO + AAO Strategy)
# ---------------------------------------------------------------------------

# --- Google AI (Gemini, AI Overviews, SGE, Vertex AI) ---
User-agent: Google-Extended
Allow: /

User-agent: Google-CloudVertexBot
Allow: /

User-agent: Gemini-Deep-Research
Allow: /

User-agent: GoogleAgent-Mariner
Allow: /

# --- OpenAI (ChatGPT, ChatGPT Search, GPT-4, Operator) ---
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# --- Anthropic (Claude AI, Claude Search) ---
User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: claude-web
Allow: /

# --- Perplexity AI ---
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# --- xAI / Grok ---
User-agent: GrokBot
Allow: /

User-agent: xAI-Grok
Allow: /

User-agent: Grok-DeepSearch
Allow: /

# --- Meta AI (Llama, WhatsApp AI, Instagram AI) ---
User-agent: FacebookBot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: meta-externalfetcher
Allow: /

User-agent: Meta-WebIndexer
Allow: /

# --- Microsoft / Bing AI ---
User-agent: DuckAssistBot
Allow: /

# --- Apple (Siri, Apple Intelligence) ---
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# --- Amazon (Alexa, Amazon Q) ---
User-agent: Amazonbot
Allow: /

# --- Mistral AI ---
User-agent: MistralAI-User
Allow: /

# --- Cohere AI ---
User-agent: cohere-ai
Allow: /

# --- You.com ---
User-agent: YouBot
Allow: /

# --- Allen Institute for AI ---
User-agent: AI2Bot
Allow: /

User-agent: AI2Bot-Dolma
Allow: /

# --- Common Crawl ---
User-agent: CCBot
Allow: /

# --- ByteDance (TikTok search, Doubao AI) ---
User-agent: Bytespider
Allow: /

User-agent: TikTokSpider
Allow: /

# --- Diffbot ---
User-agent: Diffbot
Allow: /

# --- Yandex (YandexGPT AI) ---
User-agent: YandexBot
Allow: /
Crawl-delay: 5

# --- Baidu (Ernie AI) ---
User-agent: Baiduspider
Allow: /
Crawl-delay: 5

# --- Naver (HyperCLOVA AI) ---
User-agent: Yeti
Allow: /
Crawl-delay: 5

# --- Huawei (Petal Search) ---
User-agent: PetalBot
Allow: /
Crawl-delay: 3

# --- Webz.io ---
User-agent: webzio-extended
Allow: /

# --- ICC Crawler ---
User-agent: ICC-Crawler
Allow: /

# --- Timpi ---
User-agent: Timpibot
Allow: /

# --- Omgili ---
User-agent: omgili
Allow: /

# --- ImagesiftBot ---
User-agent: ImagesiftBot
Allow: /


# ---------------------------------------------------------------------------
# 5. SOCIAL MEDIA CRAWLERS (Link Previews & Sharing)
# ---------------------------------------------------------------------------

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Slackbot
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: Discordbot
Allow: /

User-agent: PinterestBot
Allow: /

User-agent: Quora-Bot
Allow: /


# ---------------------------------------------------------------------------
# 6. SEO TOOL CRAWLERS
# ---------------------------------------------------------------------------

User-agent: Screaming Frog SEO Spider
Allow: /

User-agent: SemrushBot
Allow: /
Crawl-delay: 3

User-agent: AhrefsBot
Allow: /
Crawl-delay: 3

User-agent: DotBot
Allow: /
Crawl-delay: 5

User-agent: MJ12bot
Allow: /
Crawl-delay: 5

User-agent: SiteAuditBot
Allow: /
Crawl-delay: 3

User-agent: Moz
Allow: /
Crawl-delay: 3


# ---------------------------------------------------------------------------
# 7. BLOCK KNOWN SPAM / SCRAPER / LOW-VALUE BOTS
# ---------------------------------------------------------------------------

User-agent: MauiBot
Disallow: /

User-agent: SeznamBot
Disallow: /

User-agent: SemrushBot-BA
Disallow: /

User-agent: SemrushBot-OCOB
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: DataForSeoBot
Disallow: /

User-agent: magpie-crawler
Disallow: /

User-agent: AhrefsSiteAudit
Disallow: /

User-agent: Sogou
Disallow: /

User-agent: AspiegelBot
Disallow: /

User-agent: PanguBot
Disallow: /

User-agent: Sentibot
Disallow: /

User-agent: AwarioBot
Disallow: /

User-agent: AwarioSmartBot
Disallow: /

User-agent: AwarioRssBot
Disallow: /

User-agent: VelenPublicWebCrawler
Disallow: /

User-agent: TurnitinBot
Disallow: /

User-agent: img2dataset
Disallow: /

User-agent: Kangaroo Bot
Disallow: /

User-agent: zoominfobot
Disallow: /

User-agent: Seekport
Disallow: /

User-agent: Buck
Disallow: /

User-agent: newspaper
Disallow: /


# ---------------------------------------------------------------------------
# 8. SITEMAP & HOST
# ---------------------------------------------------------------------------

Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}

# =============================================================================
# END OF robots.txt
# Total: 50+ bot-specific directives | 80+ block rules | 30+ AI crawlers
# Strategy: Maximum AI/search visibility + zero crawl budget waste
# =============================================================================
`
}
