/**
 * Video JSON-LD Schema for JKKN Institutions
 *
 * This component renders structured data for search engines.
 * It has NO visual impact on the page - only visible in HTML source.
 *
 * Used for:
 * - Video rich snippets in search results
 * - Video carousel eligibility
 * - Video knowledge panels
 */
export function VideoSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "JKKN Institutions Campus Overview",
    "description": "Discover JKKN Institutions - India's First AI-Integrated Campus, NAAC A Accredited, celebrating 100 years of excellence (JKKN100). Explore our 7 colleges and 2 schools offering 50+ programs with 92%+ placement success in Erode Region, Tamil Nadu.",
    "thumbnailUrl": "https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/da8f1f46-9a54-4d92-9627-dbff837b8a5a.jpg",
    "uploadDate": "2025-01-01",
    "duration": "PT1M30S",
    "contentUrl": "https://pmqodbfhsejbvfbmsfeq.supabase.co/storage/v1/object/public/cms-media/general/6ef059f6-e05c-4c16-bf7b-a7c79c04a218.mp4",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "JKKN Institutions",
      "url": "https://jkkn.ac.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jkkn.ac.in/images/logo.png"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}
