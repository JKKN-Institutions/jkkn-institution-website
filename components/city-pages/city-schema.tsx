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
  const collegeSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'JKKN College of Engineering and Technology',
    alternateName: 'JKKNCET',
    url: 'https://engg.jkkn.ac.in/',
    description:
      'JKKN College of Engineering and Technology is a leading engineering institution in Tamil Nadu. Approved by AICTE, NBA, NAAC. Located in Komarapalayam, Namakkal District.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Natarajapuram, NH-544 (Salem To Coimbatore National Highway)',
      addressLocality: 'Komarapalayam',
      addressRegion: 'Tamil Nadu',
      postalCode: '638183',
      addressCountry: 'IN',
    },
    telephone: '+91-9345855001',
    parentOrganization: {
      '@type': 'EducationalOrganization',
      name: 'JKKN Institutions',
      url: 'https://jkkn.ac.in/',
    },
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
