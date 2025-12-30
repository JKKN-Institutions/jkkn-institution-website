/**
 * Robots.txt Generator
 * Tells search engines which pages to crawl and which to ignore
 */

import { MetadataRoute } from 'next'

const SITE_URL = 'https://jkkn.ac.in'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/api/',
          '/careers/apply/',
          '/_next/',
          '/private/',
        ],
      },
      // Googlebot specific rules (more aggressive crawling)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/api/',
          '/careers/apply/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
