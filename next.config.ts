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

      // === Legacy Content URLs → Homepage ===
      {
        source: '/the-rise-of-artificial-intelligence-in-healthcare',
        destination: '/',
        permanent: true,
      },
      {
        source: '/latest-news',
        destination: '/',
        permanent: true,
      },
      {
        source: '/design-thinking',
        destination: '/',
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
        destination: '/about/our-trust',
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

      // === SEO: Non-www → www canonical (C4) ===
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jkkn.ac.in' }],
        destination: 'https://www.jkkn.ac.in/:path*',
        permanent: true,
      },

      // === Spam URLs (WordPress hack remnants) ===
      {
        source: '/20bet-review-2025-bonus-promo-code-by-bet-experts-30-2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/20bet-review-2025-bonus-promo-code-by-bet-experts-30-2/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/20bet-review-2025-bonus-promo-code-by-bet-experts-30-3',
        destination: '/',
        permanent: true,
      },
      {
        source: '/20bet-review-2025-bonus-promo-code-by-bet-experts-30-3/',
        destination: '/',
        permanent: true,
      },
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
