import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components requires all data fetches to use Suspense boundaries
  // Enable when the codebase is fully migrated to this pattern:
  // cacheComponents: true,
  async redirects() {
    return [
      // Existing redirect
      {
        source: '/more/careers',
        destination: '/careers',
        permanent: true,
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
    ],
  },
};

export default nextConfig;
