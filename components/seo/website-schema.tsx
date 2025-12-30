/**
 * WebSite JSON-LD Schema for JKKN Institutions
 *
 * This component renders structured data for the website entity.
 * It has NO visual impact on the page - only visible in HTML source.
 *
 * Used for:
 * - Google Sitelinks Search Box
 * - Website information in search results
 * - Site navigation hints for search engines
 */
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jkkn.ac.in/#website",
    "url": "https://jkkn.ac.in/",
    "name": "JKKN Institutions",
    "alternateName": [
      "J.K.K. Nattraja Educational Institutions",
      "JKKN",
      "JKKN Group of Institutions",
      "JKKN Educational Institutions",
      "Best College in Erode"
    ],
    "description": "JKKN Institutions stands for J.K.K. Nattraja Educational Institutions, a premier educational group established in 1952 by the J.K.K. Rangammal Charitable Trust. Located in Komarapalayam, Tamil Nadu, India, JKKN offers 50+ career-focused programs across 7 colleges including Dental, Pharmacy, Nursing, Allied Health Sciences, Engineering, Arts & Science, and Education with 92%+ placement success rate. NAAC accredited institution with 74+ years of excellence in education.",
    "publisher": {
      "@type": "EducationalOrganization",
      "@id": "https://jkkn.ac.in/#organization",
      "name": "JKKN Institutions",
      "legalName": "J.K.K. Rangammal Charitable Trust",
      "url": "https://jkkn.ac.in/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://jkkn.ac.in/images/logo.png",
        "contentUrl": "https://jkkn.ac.in/images/logo.png",
        "caption": "JKKN Educational Institutions Logo"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Natarajapuram, NH-544 (Salem to Coimbatore National Highway)",
        "addressLocality": "Komarapalayam",
        "addressRegion": "Tamil Nadu",
        "postalCode": "638183",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "11.445400813968119",
        "longitude": "77.73060452273064"
      },
      "telephone": "+91-9345855001",
      "email": "info@jkkn.ac.in",
      "sameAs": [
        "https://www.facebook.com/myjkkn",
        "https://www.instagram.com/jkkninstitutions/",
        "https://www.youtube.com/@JKKNINSTITUTIONS",
        "https://www.linkedin.com/school/jkkninstitutions/",
        "https://en.wikipedia.org/wiki/J._K._K._Nattraja_Educational_Institutions"
      ]
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://jkkn.ac.in/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      {
        "@type": "ReadAction",
        "target": [
          "https://jkkn.ac.in/",
          "https://jkkn.ac.in/about/our-trust",
          "https://jkkn.ac.in/about/our-management",
          "https://jkkn.ac.in/about/our-institutions",
          "https://jkkn.ac.in/courses-offered/dental-courses",
          "https://jkkn.ac.in/courses-offered/allied-health-science-courses",
          "https://jkkn.ac.in/courses-offered/nursing-courses",
          "https://jkkn.ac.in/courses-offered/pharmacy-courses",
          "https://jkkn.ac.in/courses-offered/engineering-courses",
          "https://jkkn.ac.in/courses-offered/arts-and-science-courses",
          "https://jkkn.ac.in/courses-offered/education-courses",
          "https://jkkn.ac.in/contact"
        ]
      }
    ],
    "mainEntity": {
      "@id": "https://jkkn.ac.in/#organization"
    },
    "about": {
      "@type": "Thing",
      "name": "Higher Education in Tamil Nadu",
      "description": "Quality higher education programs in Dental, Pharmacy, Engineering, Nursing, and Arts & Science"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "Students seeking higher education in Tamil Nadu"
    },
    "inLanguage": [
      {
        "@type": "Language",
        "name": "English",
        "alternateName": "en"
      },
      {
        "@type": "Language",
        "name": "Tamil",
        "alternateName": "ta"
      }
    ],
    "copyrightYear": "1952-2025",
    "copyrightNotice": "© 1952-2025 J.K.K. Rangammal Charitable Trust. All rights reserved.",
    "copyrightHolder": {
      "@id": "https://jkkn.ac.in/#organization"
    },
    "creator": {
      "@id": "https://jkkn.ac.in/#organization"
    },
    "dateCreated": "2020-01-01",
    "dateModified": "2025-12-24",
    "keywords": [
      "JKKN",
      "JKKN Institutions",
      "Best College in Erode",
      "best distance education institute",
      "colleges in erode district",
      "erode college list",
      "top colleges in erode",
      "top 10 colleges in erode",
      "erode college",
      "best degree colleges near me",
      "best private colleges",
      "private colleges near me",
      "best colleges near me",
      "Dental College Komarapalayam",
      "Pharmacy College Tamil Nadu",
      "Engineering College Namakkal",
      "Nursing College Erode",
      "NAAC Accredited College",
      "Top College in Tamil Nadu",
      "BDS Admission Tamil Nadu",
      "B.Pharm College",
      "Anna University Affiliated College",
      "MGR Medical University College"
    ],
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "contentRating": "General Audience"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
