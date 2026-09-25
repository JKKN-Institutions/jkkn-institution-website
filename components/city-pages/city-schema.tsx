// components/city-pages/city-schema.tsx
// Server Component — renders JSON-LD structured data scripts

import type { CityPageConfig } from '@/lib/config/city-pages'

interface CitySchemaProps {
  cityConfig: CityPageConfig
}

export default function CitySchema({ cityConfig }: CitySchemaProps) {
  // 1. BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://engg.jkkn.ac.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Engineering College',
        item: 'https://engg.jkkn.ac.in/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cityConfig.schema.breadcrumbLabel,
        item: `https://engg.jkkn.ac.in${cityConfig.seo.canonicalPath}`,
      },
    ],
  }

  // 2. CollegeOrUniversity
  // The full college entity is already declared site-wide by the root layout under
  // the @id below. Re-declaring it here created a SECOND, anonymous college entity on
  // every city page. This node now only ADDS areaServed to the existing entity by
  // referencing the same @id, so the site describes one college, not two.
  const collegeSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    '@id': 'https://engg.jkkn.ac.in/#organization',
    areaServed: [
      { '@type': 'City', name: cityConfig.schema.areaServedCity },
      { '@type': 'State', name: 'Tamil Nadu' },
    ],
  }

  // 3. FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cityConfig.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
