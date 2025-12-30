/**
 * Organization JSON-LD Schema for JKKN Institutions
 *
 * This component renders structured data for search engines.
 * It has NO visual impact on the page - only visible in HTML source.
 *
 * Used for:
 * - Google Knowledge Panel
 * - Rich search results
 * - Organization information in search
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://jkkn.ac.in/#organization",
    "name": "JKKN Institutions",
    "alternateName": [
      "JKKN Educational Institutions",
      "JKKN Institutions",
      "J. K. K. Nattraja Educational Institutions",
      "JKKN",
      "J.K.K. Nattraja Group of Institutions",
      "JKKN Group of Institutions"
    ],
    "legalName": "J.K.K. Rangammal Charitable Trust",
    "description": "JKKN Institutions stands for J.K.K. Nattraja Educational Institutions, a premier educational group established in 1952 by the J.K.K. Rangammal Charitable Trust. Located in Komarapalayam, Tamil Nadu, India, JKKN offers 50+ career-focused programs across 7 colleges including Dental, Pharmacy, Nursing, Allied Health Sciences, Engineering, Arts & Science, and Education with 92%+ placement success rate. NAAC accredited institution with 74+ years of excellence in education.",
    "url": "https://jkkn.ac.in/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://jkkn.ac.in/images/logo.png",
      "contentUrl": "https://jkkn.ac.in/images/logo.png",
      "caption": "JKKN Educational Institutions Logo"
    },
    "image": [
      "https://jkkn.ac.in/images/logo.png"
    ],
    "foundingDate": "1952",
    "founder": {
      "@type": "Person",
      "name": "Kodai Vallal Shri. J.K.K. Natarajah",
      "alternateName": [
        "J.K.K. Nataraja Chettiar",
        "Kodaivallal J.K.K. Nataraja Chettiyar"
      ],
      "description": "Visionary philanthropist who established the J.K.K. Rangammal Charitable Trust with a strong commitment to advancing girls' education"
    },
    "slogan": "Dream Big, Achieve Bigger",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 400,
      "maxValue": 500,
      "unitText": "employees"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Natarajapuram, NH-544 (Salem to Coimbatore National Highway)",
      "addressLocality": "Komarapalayam",
      "addressRegion": "Tamil Nadu",
      "postalCode": "638183",
      "addressCountry": {
        "@type": "Country",
        "name": "India",
        "sameAs": "https://en.wikipedia.org/wiki/India"
      }
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "11.445400813968119",
      "longitude": "77.73060452273064"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Komarapalayam",
        "sameAs": "https://en.wikipedia.org/wiki/Kumarapalayam"
      },
      {
        "@type": "City",
        "name": "Erode",
        "sameAs": "https://en.wikipedia.org/wiki/Erode"
      },
      {
        "@type": "City",
        "name": "Salem",
        "sameAs": "https://en.wikipedia.org/wiki/Salem,_Tamil_Nadu"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Namakkal District",
        "sameAs": "https://en.wikipedia.org/wiki/Namakkal_district"
      },
      {
        "@type": "State",
        "name": "Tamil Nadu",
        "sameAs": "https://en.wikipedia.org/wiki/Tamil_Nadu"
      },
      {
        "@type": "Country",
        "name": "India"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9345855001",
        "contactType": "Admissions",
        "areaServed": "IN",
        "availableLanguage": ["English", "Tamil"]
      }
    ],
    "email": "info@jkkn.ac.in",
    "sameAs": [
      "https://www.facebook.com/myjkkn",
      "https://www.instagram.com/jkkninstitutions/",
      "https://www.youtube.com/@JKKNINSTITUTIONS",
      "https://www.linkedin.com/school/jkkninstitutions/",
      "https://en.wikipedia.org/wiki/J._K._K._Nattraja_Educational_Institutions",
      "https://alumni.jkkn.ac.in/"
    ],
    "parentOrganization": {
      "@type": "Organization",
      "name": "J.K.K. Rangammal Charitable Trust",
      "foundingDate": "1969",
      "description": "Charitable trust dedicated to empowering women through literacy and providing quality education",
      "@id": "https://jkkn.ac.in/#trust"
    },
    "subOrganization": [
      {
        "@type": "CollegeOrUniversity",
        "name": "JKKN Dental College and Hospital",
        "url": "https://dental.jkkn.ac.in/",
        "description": "Dental college established in 1987, affiliated to Tamil Nadu Dr. M.G.R. Medical University, recognized by Dental Council of India",
        "foundingDate": "1987"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "JKKN College of Pharmacy",
        "url": "https://pharmacy.jkkn.ac.in/",
        "description": "Pharmacy college established in 1985, approved by Pharmacy Council of India and AICTE",
        "foundingDate": "1985"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "JKKN College of Engineering and Technology",
        "url": "https://engg.jkkn.ac.in/",
        "description": "Engineering college established in 2008, affiliated with Anna University, approved by AICTE",
        "foundingDate": "2008"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "JKKN College of Arts and Science",
        "url": "https://cas.jkkn.ac.in/",
        "description": "Arts and Science college established in 1974, affiliated with Periyar University, recognized by UGC",
        "foundingDate": "1974"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "JKKN College of Allied Health Science",
        "url": "https://ahs.jkkn.ac.in/",
        "description": "Allied Health Sciences college established in 2019, affiliated to Tamil Nadu Dr. M.G.R. Medical University",
        "foundingDate": "2019"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "Sresakthimayeil Institute of Nursing and Research",
        "url": "https://nursing.sresakthimayeil.jkkn.ac.in/",
        "description": "Nursing college established in 2006, recognized by Indian Nursing Council and Tamil Nadu State Nurses & Midwives Council",
        "foundingDate": "2006"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "JKKN College of Education",
        "url": "https://edu.jkkn.ac.in/",
        "description": "Teacher training college established in 2016, approved by NCTE and affiliated with TNTEU",
        "foundingDate": "2016"
      },
      {
        "@type": "School",
        "name": "JKKN Matriculation Higher Secondary School",
        "url": "https://school.jkkn.ac.in/",
        "description": "Matriculation school founded in 1969, recognized by Government of Tamil Nadu",
        "foundingDate": "1969"
      },
      {
        "@type": "School",
        "name": "Nattraja Vidhyalaya",
        "url": "https://nv.jkkn.ac.in/",
        "description": "Elementary school founded in 2009 offering Pre-KG through Grade 10",
        "foundingDate": "2009"
      },
      {
        "@type": "School",
        "name": "J.K.K. Rangammal Girls Higher Secondary School",
        "description": "Government-aided girls' higher secondary school founded in 1965, recognized by Government of Tamil Nadu",
        "foundingDate": "1965"
      },
      {
        "@type": "School",
        "name": "J.K.K. Rangammal Elementary School",
        "description": "Elementary school founded in 1952, the first institution established by the founder",
        "foundingDate": "1952"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Accreditation",
        "name": "NAAC Accreditation",
        "recognizedBy": {
          "@type": "Organization",
          "name": "National Assessment and Accreditation Council",
          "alternateName": "NAAC"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Approval",
        "name": "AICTE Approval",
        "recognizedBy": {
          "@type": "Organization",
          "name": "All India Council for Technical Education",
          "alternateName": "AICTE"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Recognition",
        "name": "Dental Council of India Recognition",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Dental Council of India",
          "alternateName": "DCI"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Approval",
        "name": "Pharmacy Council of India Approval",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Pharmacy Council of India",
          "alternateName": "PCI"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Recognition",
        "name": "Indian Nursing Council Recognition",
        "recognizedBy": {
          "@type": "Organization",
          "name": "Indian Nursing Council",
          "alternateName": "INC"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Approval",
        "name": "NCTE Approval",
        "recognizedBy": {
          "@type": "Organization",
          "name": "National Council for Teacher Education",
          "alternateName": "NCTE"
        }
      }
    ],
    "knowsAbout": [
      "Higher Education",
      "Dental Education",
      "Pharmacy Education",
      "Engineering Education",
      "Nursing Education",
      "Allied Health Sciences",
      "Arts and Science Education",
      "Teacher Training",
      "BDS (Bachelor of Dental Surgery)",
      "MDS (Master of Dental Surgery)",
      "B.Pharm",
      "M.Pharm",
      "Pharm.D",
      "B.E. (Bachelor of Engineering)",
      "B.Tech",
      "MBA",
      "B.Sc Nursing",
      "M.Sc Nursing",
      "B.Ed (Bachelor of Education)",
      "Allied Health Science Programs",
      "Undergraduate Programs",
      "Postgraduate Programs",
      "Professional Education in Tamil Nadu"
    ],
    "award": [
      "NAAC A Accreditation  (Dental College)",
      "74+ Years of Educational Excellence",
      "Selected under Unnat Bharat Abhiyan by Ministry of HRD"
    ],
    "alumni": {
      "@type": "QuantitativeValue",
      "minValue": 50000,
      "unitText": "alumni worldwide"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Smart Classrooms",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wi-Fi Campus",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Hostel Accommodation",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Sports Facilities",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Library",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Laboratories",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Dental Hospital",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Auditorium",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Seminar Hall",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Food Court",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Bank & Post Office",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Ambulance Services",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Transport Facility",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Emergency Care",
        "value": true
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Dental Programs",
          "educationalProgramMode": "full-time",
          "programType": "BDS, MDS"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Pharmacy Programs",
          "educationalProgramMode": "full-time",
          "programType": "B.Pharm, M.Pharm, Pharm.D, Ph.D"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Engineering Programs",
          "educationalProgramMode": "full-time",
          "programType": "B.E., B.Tech, M.E., MBA"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Nursing Programs",
          "educationalProgramMode": "full-time",
          "programType": "B.Sc Nursing, P.B.B.Sc Nursing, M.Sc Nursing"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Arts and Science Programs",
          "educationalProgramMode": "full-time",
          "programType": "B.A., B.Sc., B.Com., B.B.A., B.C.A., M.C.A., M.A., M.A., M.A., M.Sc., M.Com., Ph.D"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Allied Health Science Programs",
          "educationalProgramMode": "full-time",
          "programType": "B.Sc Allied Health Sciences"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Education Programs",
          "educationalProgramMode": "full-time",
          "programType": "B.Ed"
        }
      }
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Anna University",
        "sameAs": "https://www.annauniv.edu/"
      },
      {
        "@type": "Organization",
        "name": "Tamil Nadu Dr. M.G.R. Medical University",
        "sameAs": "https://www.tnmgrmu.ac.in/"
      },
      {
        "@type": "Organization",
        "name": "Periyar University",
        "sameAs": "https://www.periyaruniversity.ac.in/"
      },
      {
        "@type": "Organization",
        "name": "Tamil Nadu Teachers Education University",
        "alternateName": "TNTEU"
      }
    ],
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
        "@type": "ApplyAction",
        "name": "Apply for Admission",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://jkkn.in/admission-form",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "Thing",
          "name": "Admission Application"
        }
      }
    ],
    "hasMap": "https://maps.google.com/?q=11.445400813968119,77.73060452273064",
    "isAccessibleForFree": false,
    "publicAccess": true
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
