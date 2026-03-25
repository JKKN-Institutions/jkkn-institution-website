/**
 * AggregateRating Schema (O4)
 *
 * Generates AggregateRating structured data (schema.org) for JKKN Institutions.
 * This enables star-rating rich results in Google Search.
 *
 * IMPORTANT: Only activate this component once genuine, verifiable reviews have been
 * collected (Google My Business, third-party platforms, or on-site surveys).
 * Using fake or unverifiable ratings risks a manual action from Google.
 *
 * Usage in layout or page:
 *   <AggregateRatingSchema
 *     enabled={true}          // set to true once reviews are collected
 *     ratingValue={4.5}
 *     reviewCount={320}
 *     bestRating={5}
 *     worstRating={1}
 *   />
 */

export interface AggregateRatingSchemaProps {
  /** Master switch — set false until real reviews are collected */
  enabled: boolean
  /** Average rating value (e.g. 4.5) */
  ratingValue: number
  /** Total number of reviews/ratings */
  reviewCount: number
  /** Maximum possible rating (default 5) */
  bestRating?: number
  /** Minimum possible rating (default 1) */
  worstRating?: number
  /** The entity being rated — defaults to JKKN Institutions */
  name?: string
  /** Canonical URL for the rated entity */
  url?: string
}

export function AggregateRatingSchema({
  enabled,
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
  name = 'JKKN Institutions',
  url = 'https://www.jkkn.ac.in',
}: AggregateRatingSchemaProps) {
  // Guard: do not inject schema until explicitly enabled with real review data
  if (!enabled || reviewCount < 1) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name,
    url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toFixed(1),
      reviewCount,
      bestRating,
      worstRating,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
