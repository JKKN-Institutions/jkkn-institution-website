/**
 * Video JSON-LD Schema — Conditionally Rendered
 *
 * Only renders on the main institution site (jkkn.ac.in) since the
 * campus overview video is specific to the main domain.
 *
 * Used for:
 * - Video rich snippets in search results
 * - Video carousel eligibility
 * - Video knowledge panels
 */

import { getSiteUrl } from '@/lib/utils/site-url'
import { isMainInstitution } from '@/lib/config/multi-tenant'

export function VideoSchema() {
  // Only render video schema for the main institution
  if (!isMainInstitution()) {
    return null
  }

  const siteUrl = getSiteUrl()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    'name': 'JKKN Institutions Campus Overview',
    // Checked facts only (2026-11-17). Removed: "India's First AI-Integrated
    // Campus" (no source), "NAAC A Accredited" (a college grade - Dental is A,
    // Arts and Science is B - not a group one), "100 years of excellence"
    // (JKKN100 is the founder's birth centenary; the institutions date from 1952)
    // and "92%+ placement success" (no published source for a group-wide rate).
    'description':
      'A campus overview of JKKN Institutions in Komarapalayam, Namakkal District, Tamil Nadu: 7 colleges and 2 schools on one campus, run by the J.K.K. Rangammal Charitable Trust since 1952.',
    'thumbnailUrl':
      'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/da8f1f46-9a54-4d92-9627-dbff837b8a5a.jpg',
    // When the video file was uploaded to the site's media storage (Last-Modified
    // of contentUrl, read 2026-11-17). Full ISO 8601 with timezone, as Google asks.
    'uploadDate': '2025-12-16T00:28:32+00:00',
    'duration': 'PT1M30S',
    'contentUrl':
      'https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/6ef059f6-e05c-4c16-bf7b-a7c79c04a218.mp4',
    'publisher': {
      '@type': 'EducationalOrganization',
      'name': 'JKKN Institutions',
      '@id': `${siteUrl}/#organization`,
      'url': siteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/images/logo.png`,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
