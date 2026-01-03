import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is available but requires all data fetches to use
  // Suspense boundaries or "use cache" directive. Enable when ready:
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
    ],
  },
};

export default nextConfig;
