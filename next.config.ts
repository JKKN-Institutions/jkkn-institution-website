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

  // Turbopack configuration (Next.js 16 default)
  // Empty config to silence webpack compatibility warning
  turbopack: {},

  // Server Actions configuration (under experimental in Next.js 16)
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb' // Increase from default 1MB to support large blog posts
    }
  },

  // Cache headers for static assets (PageSpeed optimization)
  async headers() {
    return [
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
              test: /[\\/]node_modules[\\/](recharts|html2canvas|jspdf)[\\/]/,
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
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
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
    ],
  },
};

export default bundleAnalyzer(nextConfig);
