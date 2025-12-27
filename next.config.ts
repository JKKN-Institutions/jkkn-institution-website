import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is available but requires all data fetches to use
  // Suspense boundaries or "use cache" directive. Enable when ready:
  // cacheComponents: true,
  images: {
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
    ],
  },
};

export default nextConfig;
