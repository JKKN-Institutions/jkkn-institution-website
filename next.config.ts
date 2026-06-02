import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Cache Components disabled - incompatible with admin layout that accesses cookies/auth
  // The admin layout requires dynamic rendering for all routes
  // Public routes can still use static generation via generateStaticParams
  cacheComponents: false,

  // Turbopack config (Next.js 16 default bundler)
  // Empty config silences the "webpack config without turbopack config" warning
  turbopack: {},

  // Compiler options for modern browser targeting
  // Reduces bundle size by ~14 KiB by removing legacy polyfills
  compiler: {
    // Strip ALL console calls in production — prevents user IDs, SQL errors, and
    // Supabase responses from leaking to the browser console.
    // In development, all console output remains available for debugging.
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Server Actions configuration (under experimental in Next.js 16)
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb' // Increase from default 1MB to support large blog posts
    },

    // Package import optimization - reduces bundle size by optimizing imports
    // from large libraries (tree-shaking improvements)
    optimizePackageImports: [
      'lucide-react',      // Icon library
      'date-fns',          // Date utilities
      'recharts',          // Charts
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
    ]
  },

  // Security + Cache headers
  async headers() {
    return [
      // ── Security headers applied to ALL routes ──────────────────────────
      // Protects against clickjacking, MIME sniffing, protocol downgrade, and
      // data leakage. Applied globally so no route is left unprotected.
      {
        source: '/:path*',
        headers: [
          // Prevent this site from being embedded in iframes on other origins
          // Blocks clickjacking attacks where an attacker overlays an invisible iframe
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

          // Stop browsers from MIME-sniffing a response away from declared Content-Type
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Enforce HTTPS for 2 years — browsers will refuse HTTP connections after first visit
          // preload: eligible for browser HSTS preload list (https://hstspreload.org)
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

          // Controls how much referrer info is sent with requests
          // strict-origin-when-cross-origin: full URL within same origin, only origin cross-origin
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Restrict browser feature APIs — disables camera/microphone/USB for untrusted contexts
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), usb=(), payment=(), geolocation=(self)' },

          // Basic Content Security Policy
          // - default-src 'self': blocks unexpected external content sources
          // - 'unsafe-inline' for scripts: required for GA4 init, Meta Pixel, and JSON-LD schema tags
          // - frame-ancestors 'self': secondary clickjacking protection alongside X-Frame-Options
          // - object-src 'none': blocks Flash/plugins entirely
          // - base-uri 'self': prevents base tag injection attacks
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // unpkg.com hosts @babel/standalone, loaded at runtime by custom-component-wrapper
              // because its 22 MB UMD bundle breaks Turbopack's chunk-item JSON serializer.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://unpkg.com https://js.stripe.com https://m.stripe.network",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' https:",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://api.stripe.com https://m.stripe.network",
              "frame-src 'self' https://www.youtube.com https://www.google.com https://calendar.google.com https://jobs.cvviz.com https://www.facebook.com https://js.stripe.com https://hooks.stripe.com https://m.stripe.network",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://www.facebook.com",
            ].join('; '),
          },
        ],
      },

      // ── Crawler exclusion for non-public routes ──────────────────────────
      // X-Robots-Tag header prevents search engines from indexing admin/auth pages
      // even if they somehow discover the URLs (e.g., via server logs or links)
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/auth/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },

      // ── Cache headers for static assets (PageSpeed optimization) ─────────
      // Cache static media assets for 1 year (immutable)
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache Next.js static files for 1 year (immutable)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache Next.js optimized images for 1 year with revalidation
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      // Cache images for 30 days (can be revalidated)
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      // Cache public folder assets for 1 year
      {
        source: '/:path*.{jpg,jpeg,png,gif,svg,ico,webp,avif}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts for 1 year
      {
        source: '/:path*.{woff,woff2,ttf,otf,eot}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Webpack configuration for bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Radix UI components (18 packages)
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Supabase client
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              priority: 25,
              reuseExistingChunk: true,
            },
            // TanStack (React Query + React Table)
            tanstack: {
              test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
              name: 'tanstack',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Form libraries (React Hook Form + Zod)
            forms: {
              test: /[\\/]node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/,
              name: 'forms',
              priority: 20,
              reuseExistingChunk: true,
            },
            // React core
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react-core',
              priority: 40,
              reuseExistingChunk: true,
            },
            // Utilities
            utils: {
              test: /[\\/]node_modules[\\/](clsx|class-variance-authority|tailwind-merge|date-fns|uuid)[\\/]/,
              name: 'utils',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Monaco Editor (code editor - admin only, ~500KB)
            monaco: {
              test: /[\\/]node_modules[\\/](@monaco-editor|monaco-editor)[\\/]/,
              name: 'monaco-editor',
              priority: 40,
              reuseExistingChunk: true,
            },
            // TipTap (rich text editor - admin only, ~400KB)
            tiptap: {
              test: /[\\/]node_modules[\\/](@tiptap|prosemirror-|@remirror)[\\/]/,
              name: 'tiptap-editor',
              priority: 40,
              reuseExistingChunk: true,
            },
            // Babel runtime (should be minimal in client bundle)
            babel: {
              test: /[\\/]node_modules[\\/](@babel)[\\/]/,
              name: 'babel-runtime',
              priority: 50,
              reuseExistingChunk: true,
            },
            // Framer Motion (animations)
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Page builder specific (only loads on page builder routes)
            pageBuilder: {
              test: /[\\/]node_modules[\\/](@dnd-kit|react-beautiful-dnd)[\\/]/,
              name: 'page-builder',
              priority: 35,
              reuseExistingChunk: true,
            },
            // Dashboard grid specific (only loads on dashboard routes)
            dashboardGrid: {
              test: /[\\/]node_modules[\\/](react-grid-layout)[\\/]/,
              name: 'dashboard-grid',
              priority: 35,
              reuseExistingChunk: true,
            },
            // Analytics specific (only loads on analytics routes)
            analytics: {
              test: /[\\/]node_modules[\\/](recharts|html2canvas|jspdf|core-js|canvg|rgbcolor|stackblur-canvas|css-line-break)[\\/]/,
              name: 'analytics',
              priority: 35,
              reuseExistingChunk: true,
            },
            // Default vendor chunk
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  async redirects() {
    return [
      // === OAuth Code Rescue ===
      // Supabase sends /?code=… to the Site URL when the redirectTo URL is not
      // in the Supabase Auth "Allowed redirect URLs" list. This redirect catches
      // that case and forwards the code to the proper /auth/callback handler
      // so the session can be established — no middleware required.
      {
        source: '/',
        has: [{ type: 'query', key: 'code', value: '(?<code>.+)' }],
        destination: '/auth/callback?code=:code',
        permanent: false,
      },

      // === Legacy Blog Content → /blog ===
      {
        source: '/the-rise-of-artificial-intelligence-in-healthcare',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/latest-news',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/design-thinking',
        destination: '/blog',
        permanent: true,
      },

      // === SEO Audit Fix: /courses → /courses-offered (C1) ===
      {
        source: '/courses',
        destination: '/courses-offered',
        permanent: true,
      },

      // === SEO Audit Fix: /admission → /admissions (C1) ===
      // Audit noted /admission (no 's') as a 404. Redirect to canonical admissions page.
      {
        source: '/admission',
        destination: '/admissions',
        permanent: true,
      },

      // === City Landing Pages: /best-engineering-college-in-{city} → /{city} ===
      // Old URLs were indexed by Google and linked externally. 301-redirect each
      // long-form city URL to the new short district-only URL to preserve SEO equity.
      // Also covers trailing-slash variant since canonical pages historically had it.
      {
        source: '/best-engineering-college-in-coimbatore',
        destination: '/coimbatore',
        permanent: true,
      },
      {
        source: '/best-engineering-college-in-erode',
        destination: '/erode',
        permanent: true,
      },
      {
        source: '/best-engineering-college-in-namakkal',
        destination: '/namakkal',
        permanent: true,
      },
      {
        source: '/best-engineering-college-in-salem',
        destination: '/salem',
        permanent: true,
      },
      {
        source: '/best-engineering-college-in-tiruppur',
        destination: '/tiruppur',
        permanent: true,
      },

      // === About Section Restructuring ===
      {
        source: '/about-the-institutions',
        destination: '/about/our-institutions',
        permanent: true,
      },
      {
        source: '/about-the-trust',
        destination: '/our-trust',
        permanent: true,
      },
      {
        source: '/about/our-trust',
        destination: '/our-trust',
        permanent: true,
      },

      // === Web Stories (WordPress Legacy) ===
      {
        source: '/web-stories/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php/web-stories/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php/:path*',
        destination: '/',
        permanent: true,
      },

      // === Spam/Malformed URLs → Homepage ===
      // Note: Some URLs with special characters are handled by the catch-all route
      {
        source: '/Accept-Language',
        destination: '/',
        permanent: true,
      },

      // === Legacy WordPress Pagination ===
      // These URLs were indexed from the old WordPress site
      {
        source: '/page/:number(\\d+)',
        destination: '/',
        permanent: true,
      },
      {
        source: '/page/:number(\\d+)/',
        destination: '/',
        permanent: true,
      },

      // === Specific Legacy Content ===
      {
        source: '/lamp-lighting-ceremony',
        destination: '/',
        permanent: true,
      },
      {
        source: '/lamp-lighting-ceremony/',
        destination: '/',
        permanent: true,
      },

      // === Legacy Buzz/Events/News URLs → Homepage ===
      // These URLs were previously indexed but content has been removed
      {
        source: '/buzz/campus-drive',
        destination: '/',
        permanent: true,
      },
      {
        source: '/buzz/industry-immersion',
        destination: '/',
        permanent: true,
      },
      {
        source: '/buzz/placement-celebration',
        destination: '/',
        permanent: true,
      },
      {
        source: '/events/internship',
        destination: '/',
        permanent: true,
      },
      {
        source: '/events/mental-health',
        destination: '/',
        permanent: true,
      },
      {
        source: '/events/pongal-2025',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/hackathon',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/naac',
        destination: '/',
        permanent: true,
      },
      {
        source: '/news/research-lab',
        destination: '/',
        permanent: true,
      },
      {
        source: '/llms.txt',
        destination: '/',
        permanent: true,
      },

      // === Pharmacy College URLs → Homepage ===
      // /pharmacy-college: CMS row exists but has zero content blocks (renders empty).
      // /jkkn-college-of-pharmacy: listed in sitemap but never created in the CMS.
      // Both are retired on the Main institution site — route to homepage.
      {
        source: '/pharmacy-college',
        destination: '/',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-pharmacy',
        destination: '/',
        permanent: true,
      },

      // === SEO: Non-www → www canonical (C4) ===
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jkkn.ac.in' }],
        destination: 'https://www.jkkn.ac.in/:path*',
        permanent: true,
      },

      // =================================================================
      // OLD SITE URL AUDIT (2026-05): Legitimate Page Migrations
      // =================================================================
      // These URLs were indexed on the old WordPress jkkn.ac.in site and
      // carry SEO equity (backlinks, rankings). 301 redirects preserve
      // that equity by transferring it to the new equivalent pages.
      // Spam/junk URLs are handled by middleware.ts (410 Gone).
      // =================================================================

      // --- Academic / Course pages ---
      {
        source: '/academics/programs/engineering',
        destination: '/courses-offered',
        permanent: true,
      },
      {
        source: '/allied-health-science-courses',
        destination: '/courses-offered',
        permanent: true,
      },
      {
        source: '/dental-nanotechnology-course',
        destination: '/courses-offered',
        permanent: true,
      },

      // --- Institution hub pages ---
      {
        source: '/institutions/nursing',
        destination: '/our-institutions',
        permanent: true,
      },
      {
        source: '/our-institutions-old',
        destination: '/our-institutions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-allied-health-science',
        destination: '/our-institutions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-allied-health',
        destination: '/our-institutions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-allied-health-sciences-7',
        destination: '/our-institutions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-allied-health-sciences-3',
        destination: '/our-institutions',
        permanent: true,
      },
      {
        source: '/sresakthimayeil-institute-of-nursing-and-research',
        destination: '/our-institutions',
        permanent: true,
      },
      {
        source: '/alumni-of-jkkn-dental-college-and-hospital',
        destination: '/alumni',
        permanent: true,
      },

      // --- Calendar ---
      {
        source: '/academic-calendar',
        destination: '/others/academic-calendar',
        permanent: true,
      },
      {
        source: '/calendar',
        destination: '/others/academic-calendar',
        permanent: true,
      },

      // --- Accreditation / Governance ---
      {
        source: '/curricular-aspects',
        destination: '/iqac',
        permanent: true,
      },
      {
        source: '/student-support-and-progression',
        destination: '/iqac',
        permanent: true,
      },
      {
        source: '/governance-leadership-and-management',
        destination: '/iqac',
        permanent: true,
      },

      // --- Admission announcement posts → /admissions ---
      {
        source: '/jkkn-dental-college-hospital-bds-mds-admissions-open-apply-now',
        destination: '/admissions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-allied-health-science-bsc-allied-technology-admissions-open-apply-now',
        destination: '/admissions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-arts-and-science-admissions-open-for-ug-courses-apply-now',
        destination: '/admissions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-education-admissions-open-apply-now',
        destination: '/admissions',
        permanent: true,
      },
      {
        source: '/jkkn-college-of-nursing-research-b-sc-nursingm-sc-p-b-b-sc-nursing-admissions-open-apply-now',
        destination: '/admissions',
        permanent: true,
      },
      {
        source: '/jkkn-matriculation-higher-secondary-school-2023-2024-admissions-open-apply-now',
        destination: '/admissions',
        permanent: true,
      },
      {
        source: '/nattraja-vidhyalya-2023-2024-admissions-open-apply-now',
        destination: '/admissions',
        permanent: true,
      },

      // --- Educational blog content → /blog ---
      {
        source: '/the-future-of-pharmacy-how-an-m-pharm-degree-can-help-you-succeed',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/from-student-to-dental-professional-how-a-bds-degree-can-help-you-succeed',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/innovation-and-expertise-why-pursuing-a-dental-mds-degree-is-a-smart-choice',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/the-role-of-creativity-in-engineering-problem-solving',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/oral-maxillofacial-surgery-at-jkkn-dental-college-and-hospital',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/mastering-the-csat-paper-for-upsc-cse-2024-8-proven-tips-for-a-successful-civil-services-exam',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/score-your-dream-job-with-appsc-group-2-hall-ticket-for-897-vacancies-exam-on-feb-25-direct-link-inside',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/unlocking-global-potential-inside-the-impactful-world-bank-supported-vidya-samiksha-kendra-in-gujarat',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/unlock-your-nift-score-with-the-latest-answer-key-2024-at-nta-ac-in-dont-miss-out',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/dont-miss-out-on-mahacet-2024-register-by-today-for-mca-mba-and-more-apply-now',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/unlocking-the-benefits-exploring-the-proposed-changes-to-cbse-credit-system-for-classes-9-12',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/empowering-awareness-celebrating-ivf-advancements-support',
        destination: '/blog',
        permanent: true,
      },

      // --- Misc pages ---
      {
        source: '/careers2',
        destination: '/careers',
        permanent: true,
      },
      // Blog/event content → /blog (NOT homepage)
      {
        source: '/linkdin-live-classroom-to-shopfloor-ai-aedp-perspective',
        destination: '/blog',
        permanent: true,
      },
      // Facility/institutional pages — removed from redirects, served by CMS
      // catch-all instead. If the slug exists in CMS, the page loads normally.
      // If not, it returns 404 (correct SEO signal).
      // Removed: /digital-campus, /digital-campus1, /our-vision-and-mission, /seminor-hall

      // =================================================================
      // END OF OLD SITE URL AUDIT REDIRECTS
      // =================================================================

      // =================================================================
      // OLD WORDPRESS SITE CLEANUP (Main_Institutions.csv, 2026-06)
      // Crawled old jkkn.ac.in URLs (SEO spam, dead events, retired pages)
      // 301-redirected to the homepage. Live pages of the same slug
      // (bank-post-office, privacy-policy, wi-fi-campus) are intentionally
      // NOT redirected, and URLs already handled above keep their specific
      // (more accurate) redirects. destination '/' is relative so each
      // institution redirects to its own homepage.
      // =================================================================

      // WordPress structural URL families — one wildcard each.
      { source: '/author/:path*', destination: '/', permanent: true },
      { source: '/tag/:path*', destination: '/', permanent: true },
      { source: '/category/:path*', destination: '/', permanent: true },
      { source: '/account/:path*', destination: '/', permanent: true },
      { source: '/wp-content/:path*', destination: '/', permanent: true },

      // Individual retired / spam URLs.
      { source: '/100-first-deposit-bonus-on-casino-entry-page-16', destination: '/', permanent: true },
      { source: '/15th-sports-day-event', destination: '/', permanent: true },
      { source: '/1xbit-review-top-crypto-gaming-platform-54', destination: '/', permanent: true },
      { source: '/2-board-examination-in-2022-2023', destination: '/', permanent: true },
      { source: '/20bet-app-download-for-android-ios-in-india-2025-22', destination: '/', permanent: true },
      { source: '/20bet-review-2025-bonus-promo-code-by-bet-experts-30', destination: '/', permanent: true },
      { source: '/20bet-software-with-consider-to-android-apk-plus-15', destination: '/', permanent: true },
      { source: '/22bet-app-for-android-download-the-apk-from-27', destination: '/', permanent: true },
      { source: '/25th-ips-pg-convention', destination: '/', permanent: true },
      { source: '/__trashed-9__trashed', destination: '/', permanent: true },
      { source: '/access', destination: '/', permanent: true },
      { source: '/access-online-casino-for-irish-players-13', destination: '/', permanent: true },
      { source: '/actual-link-to-download-on-ios-and-android-31', destination: '/', permanent: true },
      { source: '/ai-process-consulting-the-new-engine-of-business-success', destination: '/', permanent: true },
      { source: '/alumni-meet', destination: '/', permanent: true },
      { source: '/alumni-meet-2025-reconnect-relive', destination: '/', permanent: true },
      { source: '/anti-ragging-seminar-program', destination: '/', permanent: true },
      { source: '/app-download-13', destination: '/', permanent: true },
      { source: '/app-download-16', destination: '/', permanent: true },
      { source: '/available-deposit-and-withdrawal-options-on-22', destination: '/', permanent: true },
      { source: '/batery-aviator-game-play-in-the-app-and-on-the-37', destination: '/', permanent: true },
      { source: '/batery-bet-app-review-download-app-claim-inr-25000-58', destination: '/', permanent: true },
      { source: '/batery-casino-sports-betting-india-review-2025-23', destination: '/', permanent: true },
      { source: '/best-betting-sites-in-india-top-20-oct-2025-goal-26', destination: '/', permanent: true },
      { source: '/best-poster-award-at-a-national-level-seminar-organized-by-psg-college-of-pharmacy', destination: '/', permanent: true },
      { source: '/bus', destination: '/', permanent: true },
      { source: '/campus-recruitment-drive-2025-a-step-towards-bright-futures', destination: '/', permanent: true },
      { source: '/camu', destination: '/', permanent: true },
      { source: '/canva', destination: '/', permanent: true },
      { source: '/cbct-inauguration', destination: '/', permanent: true },
      { source: '/celebrating-the-98th-birthday-of-jkk-nattaraja-sir-founders-day-at-jkk-nattaraja-college', destination: '/', permanent: true },
      { source: '/curtain-raiser-jkkn-global-alumni-utsav', destination: '/', permanent: true },
      { source: '/dafabet-app-download-apk-login-india-9', destination: '/', permanent: true },
      { source: '/dafabet-mobile-app-2025-download-the-latest-5', destination: '/', permanent: true },
      { source: '/digital-campus', destination: '/', permanent: true },
      { source: '/digital-campus1', destination: '/', permanent: true },
      { source: '/download-dafabet-app-apk-for-android-in-india-2025-19', destination: '/', permanent: true },
      { source: '/download-dafabet-app-for-ios-android-apk-in-16', destination: '/', permanent: true },
      { source: '/download-helabet-app-for-android-apk-zambia-tz-10', destination: '/', permanent: true },
      { source: '/download-megapari-app-for-android-and-ios-latest-13', destination: '/', permanent: true },
      { source: '/download-megapari-app-for-android-apk-and-ios-2025-15', destination: '/', permanent: true },
      { source: '/download-megapari-app-for-android-ios-in-india-22', destination: '/', permanent: true },
      { source: '/download-the-latest-version-of-20bet-app-in-49', destination: '/', permanent: true },
      { source: '/e-library-orientation-program', destination: '/', permanent: true },
      { source: '/electoral-literacy-club', destination: '/', permanent: true },
      { source: '/emergancy-care', destination: '/', permanent: true },
      { source: '/environmental-talks', destination: '/', permanent: true },
      { source: '/excel', destination: '/', permanent: true },
      { source: '/exceptional-casino-experience-in-india-45', destination: '/', permanent: true },
      { source: '/facilities/seminar-hall', destination: '/', permanent: true },
      { source: '/faculty-development-program', destination: '/', permanent: true },
      { source: '/field-visit-day-by-ssm-group-of-schools-to-our-jkkn-dental-college', destination: '/', permanent: true },
      { source: '/food-court', destination: '/', permanent: true },
      { source: '/google-workspace', destination: '/', permanent: true },
      { source: '/happy-labour-day', destination: '/', permanent: true },
      { source: '/how-to-download-dafabet-mobile-app-17', destination: '/', permanent: true },
      { source: '/info', destination: '/', permanent: true },
      { source: '/intellectual-property-rights-day-2', destination: '/', permanent: true },
      { source: '/intellectual-property-rights-day-2/feed', destination: '/', permanent: true },
      { source: '/international-plastic-bag-free-day-2', destination: '/', permanent: true },
      { source: '/internship-workshop-orientation-for-our-final-year-students', destination: '/', permanent: true },
      { source: '/jkk-nataraja-colleges-first-year-commencement-ceremony-2023', destination: '/', permanent: true },
      { source: '/jkkn-college-of-engineering-and-technology-15th-annual-day', destination: '/', permanent: true },
      { source: '/jkkn-college-of-engineering-and-technology-sports-day-2023', destination: '/', permanent: true },
      { source: '/jkkncets-initiative-on-mental-health-and-suicide-awareness', destination: '/', permanent: true },
      { source: '/kumarapalayam-bypass-marathon', destination: '/', permanent: true },
      { source: '/lab', destination: '/', permanent: true },
      { source: '/laboratory', destination: '/', permanent: true },
      { source: '/medical-humanities', destination: '/', permanent: true },
      { source: '/megapari-affiliate-program-2025-10', destination: '/', permanent: true },
      { source: '/megapari-app-apk-download-india-13', destination: '/', permanent: true },
      { source: '/megapari-app-apk-download-india-15', destination: '/', permanent: true },
      { source: '/megapari-app-download-apk-bangladesh-10', destination: '/', permanent: true },
      { source: '/megapari-app-download-apk-for-android-and-ios-free-11', destination: '/', permanent: true },
      { source: '/megapari-app-download-for-android-apk-and-ios-31', destination: '/', permanent: true },
      { source: '/megapari-app-download-for-android-ios-free-new-15', destination: '/', permanent: true },
      { source: '/megapari-app-download-install-on-android-ios-in-45', destination: '/', permanent: true },
      { source: '/megapari-app-download-megapari-apk-for-android-ios-12', destination: '/', permanent: true },
      { source: '/megapari-app-review-how-to-download-use-megapari-28', destination: '/', permanent: true },
      { source: '/megapari-bookmaker-and-online-casino-16', destination: '/', permanent: true },
      { source: '/megapari-casino-review-expert-player-ratings-2025-19', destination: '/', permanent: true },
      { source: '/megapari-online-bookmaker-and-casino-200-bonus-and-16', destination: '/', permanent: true },
      { source: '/megapari-promo-code-in-india-2025-get-up-to-39-000-22', destination: '/', permanent: true },
      { source: '/megapari-registration-get-49-000-bonus-on-sign-up-18', destination: '/', permanent: true },
      { source: '/megapari-registration-get-49-000-bonus-on-sign-up-34', destination: '/', permanent: true },
      { source: '/megapari-review-how-to-bet-on-sport-in-bangladesh-8', destination: '/', permanent: true },
      { source: '/megapari-sign-up-offer-200-offered-bonus-october-10', destination: '/', permanent: true },
      { source: '/minecraft-beta-preview-1-20-70-21-24', destination: '/', permanent: true },
      { source: '/national-conference-race-2k23', destination: '/', permanent: true },
      { source: '/national-level-poster-presentation', destination: '/', permanent: true },
      { source: '/national-level-seminar-conducted-by-psg-college-of-pharmacy', destination: '/', permanent: true },
      { source: '/national-level-technical-symposium-technovation-23', destination: '/', permanent: true },
      { source: '/national-service-scheme', destination: '/', permanent: true },
      { source: '/national-vaccination-day', destination: '/', permanent: true },
      { source: '/official-20bet-login-link-9-000-inr-welcome-bonus-25', destination: '/', permanent: true },
      { source: '/onam-celebration-at-ahs-campus', destination: '/', permanent: true },
      { source: '/onam-celebrations-ahs-campus', destination: '/', permanent: true },
      { source: '/our-vision-and-mission', destination: '/', permanent: true },
      { source: '/outlook', destination: '/', permanent: true },
      { source: '/placement-day-celebration-2025', destination: '/', permanent: true },
      { source: '/portal', destination: '/', permanent: true },
      { source: '/psychometric-career-test', destination: '/', permanent: true },
      { source: '/resuscitation-india-sumit-2023', destination: '/', permanent: true },
      { source: '/road-safety-awareness', destination: '/', permanent: true },
      { source: '/seminor-hall', destination: '/', permanent: true },
      { source: '/smart-classroom', destination: '/', permanent: true },
      { source: '/sresakthimayeil-institute-of-nursing-and-research-conducted-earth-day', destination: '/', permanent: true },
      { source: '/stake-bet-on-sports-casino-games-with-bitcoin-and-20', destination: '/', permanent: true },
      { source: '/stake-casino-review-bonuses-games-and-support-16', destination: '/', permanent: true },
      { source: '/stake-casino-review-stake-india-bonuses-and-15', destination: '/', permanent: true },
      { source: '/stake-com-india-review-bonuses-withdrawals-real-or-13', destination: '/', permanent: true },
      { source: '/stake-online-casino-bonuses-and-promotions-62', destination: '/', permanent: true },
      { source: '/terms', destination: '/', permanent: true },
      { source: '/test-3', destination: '/', permanent: true },
      { source: '/test-career-page', destination: '/', permanent: true },
      { source: '/test-careers', destination: '/', permanent: true },
      { source: '/test-latest', destination: '/', permanent: true },
      { source: '/the-national-level-symposium-technovation-23', destination: '/', permanent: true },
      { source: '/types-of-batteries-and-cells-and-their-86', destination: '/', permanent: true },
      { source: '/unrivaled-gaming-experience-26', destination: '/', permanent: true },
      { source: '/welcome-offer-games-9', destination: '/', permanent: true },
      { source: '/win-in-real-time-with-megapari-on-ipl-2025-30', destination: '/', permanent: true },
      { source: '/workshop-on-corticobasal-implants', destination: '/', permanent: true },
      { source: '/world-breastfeeding-week-celebration-promoting-maternal-child-health', destination: '/', permanent: true },
      { source: '/world-health-day-2', destination: '/', permanent: true },
      { source: '/world-health-day-celebration', destination: '/', permanent: true },
      { source: '/world-health-days', destination: '/', permanent: true },
      { source: '/world-health-days/feed', destination: '/', permanent: true },
      { source: '/world-hepatitis-day', destination: '/', permanent: true },
      { source: '/world-homeopathy-day', destination: '/', permanent: true },
      { source: '/world-kidney-cancer-day', destination: '/', permanent: true },
      { source: '/world-malaria-day', destination: '/', permanent: true },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [35, 40, 50, 55, 75, 80, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    // Note: Image quality is controlled per-component via quality prop
    // Custom qualities list allows AVIF-optimized values (35-55) alongside standard (75)
    // Allow loading images from Supabase CDN (which may resolve to IPs flagged as private)
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pmqodbfhsejbvfbmsfeq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'wnmyvbnqldukeknnmnpl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'rwskookarbolpmtolqkd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'kyvfkyjmdbtyimtedkie.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'jkkn.ac.in',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      {
        protocol: 'https',
        hostname: 'jkkn-dental-college.vercel.app',
      },
      // Instagram CDN domains for thumbnails
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
        pathname: '/**',
      },
      // YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      // Placeholder images (for development/testing)
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};

export default bundleAnalyzer(nextConfig);
