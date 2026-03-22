/**
 * FAQ JSON-LD Schema — Multi-Tenant Aware
 *
 * Renders institution-specific FAQ structured data.
 * FAQ content is sourced from the centralized institution SEO config.
 *
 * Used for:
 * - Google Rich Results (FAQ snippets)
 * - Search result enhancements
 * - Voice assistant answers
 */

import { getInstitutionSEOConfig } from '@/lib/seo/institution-seo-config'

export function FAQSchema() {
  const config = getInstitutionSEOConfig()

  // Use institution-specific FAQs from the centralized config
  if (!config.faqs || config.faqs.length === 0) {
    return null
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
