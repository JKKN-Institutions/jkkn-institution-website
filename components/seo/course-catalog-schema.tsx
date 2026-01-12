/**
 * Course Catalog JSON-LD Schema for JKKN Institutions
 *
 * This component renders structured data for search engines.
 * It has NO visual impact on the page - only visible in HTML source.
 *
 * Contains:
 * - ItemList (Course Catalog) with 7 category links
 * - 7 EducationalOccupationalProgram entities
 * - 25+ Course entities with CourseInstance
 * - WebPage for /courses-offered
 *
 * Used for:
 * - Rich course snippets in search results
 * - Educational program knowledge panels
 * - Voice search optimization
 * - Course carousel eligibility
 *
 * @see lib/seo/course-catalog-config.ts for configurable dates
 */

import { courseCatalogConfig } from '@/lib/seo/course-catalog-config'

export function CourseCatalogSchema() {
  const config = courseCatalogConfig

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // ============================================
      // ItemList - Course Catalog
      // ============================================
      {
        "@type": "ItemList",
        "@id": `${config.site.url}/#course-catalog`,
        "name": `JKKN Institutions Course Catalog ${config.academicYear}`,
        "description": `Complete list of 50+ career-focused courses offered at JKKN Institutions, Komarapalayam - Best College in Erode region for Dental, Pharmacy, Engineering, Nursing, Allied Health Sciencess, Arts & Science, and Education programs`,
        "numberOfItems": 7,
        "itemListOrder": "https://schema.org/ItemListOrderDescending",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Dental Courses",
            "url": `${config.site.url}/courses-offered/dental-courses`,
            "item": {
              "@id": `${config.site.url}/#dental-programs`
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Pharmacy Courses",
            "url": `${config.site.url}/courses-offered/pharmacy-courses`,
            "item": {
              "@id": `${config.site.url}/#pharmacy-programs`
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Engineering Courses",
            "url": `${config.site.url}/courses-offered/engineering-courses`,
            "item": {
              "@id": `${config.site.url}/#engineering-programs`
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Nursing Courses",
            "url": `${config.site.url}/courses-offered/nursing-courses`,
            "item": {
              "@id": `${config.site.url}/#nursing-programs`
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Allied Health Sciences Courses",
            "url": `${config.site.url}/courses-offered/allied-health-sciences-courses`,
            "item": {
              "@id": `${config.site.url}/#allied-health-programs`
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Arts & Science Courses",
            "url": `${config.site.url}/courses-offered/arts-and-science-courses`,
            "item": {
              "@id": `${config.site.url}/#arts-science-programs`
            }
          },
          {
            "@type": "ListItem",
            "position": 7,
            "name": "Education Courses",
            "url": `${config.site.url}/courses-offered/education-courses`,
            "item": {
              "@id": `${config.site.url}/#education-programs`
            }
          }
        ]
      },

      // ============================================
      // Dental Programs
      // ============================================
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${config.site.url}/#dental-programs`,
        "name": "Dental Programs at JKKN Dental College",
        "description": "Comprehensive dental education programs including BDS and MDS with 7 specializations at JKKN Dental College & Hospital, Komarapalayam. DCI recognized, affiliated to Tamil Nadu Dr. M.G.R. Medical University with 92%+ placement rate.",
        "url": `${config.site.url}/courses-offered/dental-courses`,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN Dental College and Hospital",
          "url": "https://dental.jkkn.ac.in/",
          "parentOrganization": {
            "@id": `${config.site.url}/#organization`
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": config.address.streetAddress,
            "addressLocality": config.address.addressLocality,
            "addressRegion": config.address.addressRegion,
            "postalCode": config.address.postalCode,
            "addressCountry": config.address.addressCountry
          }
        },
        "educationalProgramMode": "full-time",
        "programType": "Professional Degree",
        "occupationalCategory": ["Dentist", "Dental Surgeon", "Orthodontist", "Periodontist", "Oral Surgeon"],
        "applicationDeadline": config.admissionDeadline,
        "programPrerequisites": {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "HighSchool",
          "competencyRequired": "10+2 with Physics, Chemistry, Biology and NEET UG qualification"
        },
        "hasCourse": [
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bds`,
            "name": "BDS - Bachelor of Dental Surgery",
            "description": "5-year undergraduate dental program (4 years + 1 year internship) at JKKN Dental College, Komarapalayam. DCI recognized program affiliated to Tamil Nadu Dr. M.G.R. Medical University. Ideal for Learners from Erode, Salem, Namakkal seeking top dental education.",
            "url": `${config.site.url}/courses-offered/dental-courses/bds`,
            "courseCode": "BDS",
            "provider": {
              "@type": "CollegeOrUniversity",
              "name": "JKKN Dental College and Hospital",
              "@id": "https://dental.jkkn.ac.in/#college"
            },
            "educationalCredentialAwarded": "Bachelor of Dental Surgery (BDS)",
            "occupationalCredentialAwarded": {
              "@type": "EducationalOccupationalCredential",
              "credentialCategory": "Professional Degree",
              "name": "BDS",
              "recognizedBy": {
                "@type": "Organization",
                "name": "Dental Council of India"
              }
            },
            "timeRequired": "P5Y",
            "numberOfCredits": {
              "@type": "StructuredValue",
              "value": "5 years including internship"
            },
            "teaches": [
              "General Dentistry",
              "Oral Surgery",
              "Orthodontics",
              "Periodontics",
              "Prosthodontics",
              "Oral Pathology",
              "Community Dentistry",
              "Pedodontics"
            ],
            "coursePrerequisites": "10+2 with PCB, NEET UG Qualified, Minimum 17 years age",
            "availableLanguage": ["English", "Tamil"],
            "inLanguage": "en",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `BDS ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "courseWorkload": "P5Y",
              "startDate": config.courseStartDates.dental,
              "endDate": config.courseEndDates.bds,
              "location": {
                "@type": "Place",
                "name": "JKKN Dental College and Hospital",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": `${config.address.streetAddress} (Salem-Coimbatore Highway)`,
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.geo.latitude,
                  "longitude": config.geo.longitude
                }
              },
              "instructor": {
                "@type": "Organization",
                "name": "JKKN Dental College Faculty"
              }
            },
            "offers": {
              "@type": "Offer",
              "category": "Admission",
              "availability": "https://schema.org/InStock",
              "url": config.site.admissionFormUrl,
              "validFrom": config.offerValidity.validFrom,
              "validThrough": config.offerValidity.validThrough,
              "eligibleRegion": {
                "@type": "Country",
                "name": "India"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.6",
              "bestRating": "5",
              "worstRating": "1",
              "ratingCount": "450"
            },
            "audience": {
              "@type": "EducationalAudience",
              "educationalRole": "student",
              "audienceType": "NEET qualified Learners seeking dental education"
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-mds`,
            "name": "MDS - Master of Dental Surgery",
            "description": "3-year postgraduate dental specialization programs at JKKN Dental College. 7 specializations available: Orthodontics, Periodontics, Prosthodontics, Oral Surgery, Conservative Dentistry, Oral Pathology, and Pedodontics. Best MDS college near Erode, Salem.",
            "url": `${config.site.url}/courses-offered/dental-courses/mds`,
            "courseCode": "MDS",
            "educationalCredentialAwarded": "Master of Dental Surgery (MDS)",
            "timeRequired": "P3Y",
            "coursePrerequisites": "BDS degree, NEET MDS Qualified",
            "availableLanguage": ["English"],
            "teaches": [
              "Advanced Orthodontics",
              "Periodontal Surgery",
              "Implantology",
              "Maxillofacial Surgery",
              "Advanced Prosthodontics"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `MDS ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.dental,
              "location": {
                "@type": "Place",
                "name": "JKKN Dental College and Hospital",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          }
        ]
      },

      // ============================================
      // Pharmacy Programs
      // ============================================
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${config.site.url}/#pharmacy-programs`,
        "name": "Pharmacy Programs at JKKN College of Pharmacy",
        "description": "PCI and AICTE approved pharmacy programs including B.Pharm, M.Pharm, Pharm.D and Ph.D at JKKN College of Pharmacy, Komarapalayam. Established in 1985, top pharmacy college in Erode, Namakkal region with excellent placement record.",
        "url": `${config.site.url}/courses-offered/pharmacy-courses`,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN College of Pharmacy",
          "url": "https://pharmacy.jkkn.ac.in/",
          "parentOrganization": {
            "@id": `${config.site.url}/#organization`
          }
        },
        "educationalProgramMode": "full-time",
        "programType": "Professional Degree",
        "occupationalCategory": ["Pharmacist", "Clinical Pharmacist", "Pharmaceutical Researcher", "Drug Inspector"],
        "applicationDeadline": config.admissionDeadline,
        "hasCourse": [
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bpharm`,
            "name": "B.Pharm - Bachelor of Pharmacy",
            "description": "4-year undergraduate pharmacy program at JKKN College of Pharmacy, Komarapalayam. PCI approved, AICTE recognized. Best B.Pharm college near Erode, Salem, Tiruchengode with strong industry connections to Cipla, Apex Pharma, Apotex.",
            "url": `${config.site.url}/courses-offered/pharmacy-courses/bpharm`,
            "courseCode": "B.PHARM",
            "educationalCredentialAwarded": "Bachelor of Pharmacy (B.Pharm)",
            "timeRequired": "P4Y",
            "coursePrerequisites": "10+2 with Physics, Chemistry, Mathematics/Biology",
            "teaches": [
              "Pharmaceutical Chemistry",
              "Pharmacology",
              "Pharmaceutics",
              "Pharmacognosy",
              "Pharmaceutical Analysis",
              "Hospital Pharmacy",
              "Industrial Pharmacy"
            ],
            "availableLanguage": ["English"],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Pharm ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.pharmacy,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Pharmacy",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": config.address.streetAddress,
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.geo.latitude,
                  "longitude": config.geo.longitude
                }
              }
            },
            "offers": {
              "@type": "Offer",
              "category": "Admission",
              "availability": "https://schema.org/InStock",
              "url": config.site.admissionFormUrl,
              "validFrom": config.offerValidity.validFrom,
              "validThrough": config.offerValidity.validThrough
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-mpharm`,
            "name": "M.Pharm - Master of Pharmacy",
            "description": "2-year postgraduate pharmacy program with specializations in Pharmaceutics, Pharmaceutical Chemistry, Pharmacology, and Pharmaceutical Analysis at JKKN College of Pharmacy.",
            "url": `${config.site.url}/courses-offered/pharmacy-courses/mpharm`,
            "courseCode": "M.PHARM",
            "educationalCredentialAwarded": "Master of Pharmacy (M.Pharm)",
            "timeRequired": "P2Y",
            "coursePrerequisites": "B.Pharm degree with valid GPAT score",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `M.Pharm ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.pharmacy,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Pharmacy",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-pharmd`,
            "name": "Pharm.D - Doctor of Pharmacy",
            "description": "6-year integrated clinical pharmacy program (5 years + 1 year internship) at JKKN College of Pharmacy. Focus on patient care, clinical therapeutics, and hospital pharmacy practice.",
            "url": `${config.site.url}/courses-offered/pharmacy-courses/pharmd`,
            "courseCode": "PHARM.D",
            "educationalCredentialAwarded": "Doctor of Pharmacy (Pharm.D)",
            "timeRequired": "P6Y",
            "coursePrerequisites": "10+2 with Physics, Chemistry, Biology/Mathematics",
            "teaches": [
              "Clinical Pharmacy",
              "Pharmacotherapeutics",
              "Hospital Pharmacy",
              "Community Pharmacy",
              "Drug Information Services"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `Pharm.D ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.pharmacy,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Pharmacy",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          }
        ]
      },

      // ============================================
      // Engineering Programs
      // ============================================
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${config.site.url}/#engineering-programs`,
        "name": "Engineering Programs at JKKN College of Engineering and Technology",
        "description": "AICTE approved engineering programs including B.E., B.Tech and MBA at JKKN College of Engineering, Komarapalayam. Anna University affiliated, established 2008. Top engineering college near Erode with placements at Foxconn, Bosch, TCS.",
        "url": `${config.site.url}/courses-offered/engineering-courses`,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN College of Engineering and Technology",
          "url": "https://engg.jkkn.ac.in/",
          "parentOrganization": {
            "@id": `${config.site.url}/#organization`
          }
        },
        "educationalProgramMode": "full-time",
        "programType": "Professional Degree",
        "occupationalCategory": ["Software Engineer", "Mechanical Engineer", "Civil Engineer", "Electronics Engineer", "Data Scientist", "Business Manager"],
        "applicationDeadline": config.admissionDeadline,
        "hasCourse": [
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-be-cse`,
            "name": "B.E. Computer Science and Engineering",
            "description": "4-year undergraduate computer science program at JKKN Engineering College, Komarapalayam. Anna University curriculum with focus on AI, Machine Learning, Cloud Computing. Best CSE college near Erode, Salem, Namakkal.",
            "url": `${config.site.url}/courses-offered/engineering-courses/be-cse`,
            "courseCode": "BE-CSE",
            "educationalCredentialAwarded": "Bachelor of Engineering in Computer Science",
            "timeRequired": "P4Y",
            "coursePrerequisites": "10+2 with Physics, Chemistry, Mathematics, TNEA Counseling",
            "teaches": [
              "Data Structures and Algorithms",
              "Artificial Intelligence",
              "Machine Learning",
              "Cloud Computing",
              "Web Development",
              "Database Management",
              "Software Engineering",
              "Cybersecurity"
            ],
            "availableLanguage": ["English"],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.E. CSE ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.engineering,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Engineering and Technology",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": config.address.streetAddress,
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.geo.latitude,
                  "longitude": config.geo.longitude
                }
              }
            },
            "offers": {
              "@type": "Offer",
              "category": "Admission",
              "availability": "https://schema.org/InStock",
              "url": config.site.admissionFormUrl,
              "validFrom": config.offerValidity.validFrom,
              "validThrough": config.offerValidity.validThrough
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-be-ece`,
            "name": "B.E. Electronics and Communication Engineering",
            "description": "4-year ECE program at JKKN Engineering College with focus on VLSI, Embedded Systems, IoT, and Communication Networks. Anna University affiliated.",
            "url": `${config.site.url}/courses-offered/engineering-courses/be-ece`,
            "courseCode": "BE-ECE",
            "educationalCredentialAwarded": "Bachelor of Engineering in Electronics and Communication",
            "timeRequired": "P4Y",
            "teaches": [
              "VLSI Design",
              "Embedded Systems",
              "IoT",
              "Signal Processing",
              "Communication Networks"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.E. ECE ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.engineering,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Engineering and Technology",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-be-mech`,
            "name": "B.E. Mechanical Engineering",
            "description": "4-year mechanical engineering program at JKKN Engineering College. Focus on CAD/CAM, Robotics, Thermal Engineering, and Manufacturing.",
            "url": `${config.site.url}/courses-offered/engineering-courses/be-mechanical`,
            "courseCode": "BE-MECH",
            "educationalCredentialAwarded": "Bachelor of Engineering in Mechanical Engineering",
            "timeRequired": "P4Y",
            "teaches": [
              "CAD/CAM",
              "Robotics",
              "Thermal Engineering",
              "Manufacturing Processes",
              "Automobile Engineering"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.E. Mechanical ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.engineering,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Engineering and Technology",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-be-civil`,
            "name": "B.E. Civil Engineering",
            "description": "4-year civil engineering program at JKKN Engineering College covering structural design, construction management, and environmental engineering.",
            "url": `${config.site.url}/courses-offered/engineering-courses/be-civil`,
            "courseCode": "BE-CIVIL",
            "educationalCredentialAwarded": "Bachelor of Engineering in Civil Engineering",
            "timeRequired": "P4Y",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.E. Civil ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.engineering,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Engineering and Technology",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-btech-aids`,
            "name": "B.Tech Artificial Intelligence and Data Science",
            "description": "4-year B.Tech AI&DS program at JKKN Engineering College. Industry-focused curriculum covering Machine Learning, Deep Learning, Big Data Analytics, and Natural Language Processing.",
            "url": `${config.site.url}/courses-offered/engineering-courses/btech-aids`,
            "courseCode": "BTECH-AIDS",
            "educationalCredentialAwarded": "Bachelor of Technology in AI and Data Science",
            "timeRequired": "P4Y",
            "teaches": [
              "Machine Learning",
              "Deep Learning",
              "Big Data Analytics",
              "Natural Language Processing",
              "Computer Vision",
              "Data Mining"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Tech AI&DS ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.engineering,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Engineering and Technology",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-mba`,
            "name": "MBA - Master of Business Administration",
            "description": "2-year MBA program at JKKN College of Engineering with specializations in Marketing, Finance, HR, and Operations. AICTE approved, best MBA college near Erode.",
            "url": `${config.site.url}/courses-offered/engineering-courses/mba`,
            "courseCode": "MBA",
            "educationalCredentialAwarded": "Master of Business Administration",
            "timeRequired": "P2Y",
            "coursePrerequisites": "Any bachelor's degree with valid TANCET/CAT/MAT score",
            "teaches": [
              "Marketing Management",
              "Financial Management",
              "Human Resource Management",
              "Operations Management",
              "Business Analytics",
              "Entrepreneurship"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `MBA ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.engineering,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Engineering and Technology",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          }
        ]
      },

      // ============================================
      // Nursing Programs
      // ============================================
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${config.site.url}/#nursing-programs`,
        "name": "Nursing Programs at Sresakthimayeil Institute of Nursing and Research",
        "description": "INC and TNSNMC recognized nursing programs including B.Sc Nursing, P.B.B.Sc Nursing, and M.Sc Nursing at JKKN's Sresakthimayeil Institute. Established 2006, best nursing college near Erode with hospital-based training.",
        "url": `${config.site.url}/courses-offered/nursing-courses`,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "Sresakthimayeil Institute of Nursing and Research",
          "url": "https://nursing.sresakthimayeil.jkkn.ac.in/",
          "parentOrganization": {
            "@id": `${config.site.url}/#organization`
          }
        },
        "educationalProgramMode": "full-time",
        "occupationalCategory": ["Registered Nurse", "Clinical Nurse", "Nurse Educator", "Nursing Administrator"],
        "applicationDeadline": config.admissionDeadline,
        "hasCourse": [
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bsc-nursing`,
            "name": "B.Sc Nursing",
            "description": "4-year undergraduate nursing program at Sresakthimayeil Institute of Nursing, Komarapalayam. INC recognized, affiliated to Tamil Nadu Dr. M.G.R. Medical University. NEET UG qualified candidates eligible.",
            "url": `${config.site.url}/courses-offered/nursing-courses/bsc-nursing`,
            "courseCode": "BSC-NURSING",
            "educationalCredentialAwarded": "Bachelor of Science in Nursing",
            "timeRequired": "P4Y",
            "coursePrerequisites": "10+2 with Physics, Chemistry, Biology, NEET UG Qualified, Age 17-35 years",
            "teaches": [
              "Medical-Surgical Nursing",
              "Obstetric Nursing",
              "Pediatric Nursing",
              "Mental Health Nursing",
              "Community Health Nursing"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Sc Nursing ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.nursing,
              "location": {
                "@type": "Place",
                "name": "Sresakthimayeil Institute of Nursing and Research",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": config.address.streetAddress,
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.geo.latitude,
                  "longitude": config.geo.longitude
                }
              }
            },
            "offers": {
              "@type": "Offer",
              "category": "Admission",
              "availability": "https://schema.org/InStock",
              "url": config.site.admissionFormUrl,
              "validFrom": config.offerValidity.validFrom,
              "validThrough": config.offerValidity.validThrough
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-msc-nursing`,
            "name": "M.Sc Nursing",
            "description": "2-year postgraduate nursing program with specializations in Medical-Surgical, OBG, Pediatrics, Mental Health, and Community Health Nursing.",
            "url": `${config.site.url}/courses-offered/nursing-courses/msc-nursing`,
            "courseCode": "MSC-NURSING",
            "educationalCredentialAwarded": "Master of Science in Nursing",
            "timeRequired": "P2Y",
            "coursePrerequisites": "B.Sc Nursing with 1 year clinical experience",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `M.Sc Nursing ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.nursing,
              "location": {
                "@type": "Place",
                "name": "Sresakthimayeil Institute of Nursing and Research",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-pbbsc-nursing`,
            "name": "P.B.B.Sc Nursing (Post Basic)",
            "description": "2-year post-basic B.Sc Nursing program for GNM diploma holders seeking bachelor's degree upgrade.",
            "url": `${config.site.url}/courses-offered/nursing-courses/pbbsc-nursing`,
            "courseCode": "PBBSC-NURSING",
            "educationalCredentialAwarded": "Post Basic Bachelor of Science in Nursing",
            "timeRequired": "P2Y",
            "coursePrerequisites": "GNM diploma with registration and 2 years experience",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `P.B.B.Sc Nursing ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.nursing,
              "location": {
                "@type": "Place",
                "name": "Sresakthimayeil Institute of Nursing and Research",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          }
        ]
      },

      // ============================================
      // Allied Health Sciences Programs
      // ============================================
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${config.site.url}/#allied-health-programs`,
        "name": "Allied Health Sciences Programs at JKKN College of Allied Health Sciences",
        "description": "Diverse allied health science programs including Medical Lab Technology, Radiology, Optometry, and more at JKKN Allied Health Sciencess College, Komarapalayam. Established 2019, affiliated to Tamil Nadu Dr. M.G.R. Medical University.",
        "url": `${config.site.url}/courses-offered/allied-health-sciences-courses`,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN College of Allied Health Sciences",
          "url": "https://ahs.jkkn.ac.in/",
          "parentOrganization": {
            "@id": `${config.site.url}/#organization`
          }
        },
        "educationalProgramMode": "full-time",
        "occupationalCategory": ["Medical Lab Technologist", "Radiographer", "Optometrist", "Cardiac Technologist", "Dialysis Technician"],
        "applicationDeadline": config.admissionDeadline,
        "hasCourse": [
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bsc-mlt`,
            "name": "B.Sc Medical Laboratory Technology",
            "description": "3-year MLT program at JKKN Allied Health Sciencess College. Learn clinical biochemistry, microbiology, pathology, and hematology laboratory techniques.",
            "url": `${config.site.url}/courses-offered/allied-health-sciences-courses/bsc-mlt`,
            "courseCode": "BSC-MLT",
            "educationalCredentialAwarded": "Bachelor of Science in Medical Laboratory Technology",
            "timeRequired": "P3Y",
            "coursePrerequisites": "10+2 with Physics, Chemistry, Biology",
            "teaches": [
              "Clinical Biochemistry",
              "Microbiology",
              "Pathology",
              "Hematology",
              "Immunology"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Sc MLT ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.alliedHealth,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Allied Health Sciences",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": config.address.streetAddress,
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.geo.latitude,
                  "longitude": config.geo.longitude
                }
              }
            },
            "offers": {
              "@type": "Offer",
              "category": "Admission",
              "availability": "https://schema.org/InStock",
              "url": config.site.admissionFormUrl,
              "validFrom": config.offerValidity.validFrom,
              "validThrough": config.offerValidity.validThrough
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bsc-radiology`,
            "name": "B.Sc Medical Imaging Technology / Radiology",
            "description": "3-year radiology program covering X-ray, CT, MRI, and ultrasound imaging techniques at JKKN Allied Health Sciencess.",
            "url": `${config.site.url}/courses-offered/allied-health-sciences-courses/bsc-radiology`,
            "courseCode": "BSC-MIT",
            "educationalCredentialAwarded": "Bachelor of Science in Medical Imaging Technology",
            "timeRequired": "P3Y",
            "teaches": [
              "X-ray Technology",
              "CT Imaging",
              "MRI Technology",
              "Ultrasound Imaging",
              "Radiation Safety"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Sc Radiology ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.alliedHealth,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Allied Health Sciences",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bsc-optometry`,
            "name": "B.Sc Optometry",
            "description": "4-year optometry program at JKKN Allied Health Sciencess covering vision science, contact lenses, and ocular disease management.",
            "url": `${config.site.url}/courses-offered/allied-health-sciences-courses/bsc-optometry`,
            "courseCode": "BSC-OPTOMETRY",
            "educationalCredentialAwarded": "Bachelor of Science in Optometry",
            "timeRequired": "P4Y",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Sc Optometry ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.alliedHealth,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Allied Health Sciences",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bsc-cardiac`,
            "name": "B.Sc Cardiac Technology",
            "description": "3-year cardiac technology program covering ECG, ECHO, cardiac catheterization, and cardiovascular diagnostics.",
            "url": `${config.site.url}/courses-offered/allied-health-sciences-courses/bsc-cardiac`,
            "courseCode": "BSC-CARDIAC",
            "educationalCredentialAwarded": "Bachelor of Science in Cardiac Technology",
            "timeRequired": "P3Y",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Sc Cardiac Tech ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.alliedHealth,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Allied Health Sciences",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bsc-dialysis`,
            "name": "B.Sc Dialysis Technology",
            "description": "3-year dialysis technology program for hemodialysis and renal care at JKKN Allied Health Sciencess.",
            "url": `${config.site.url}/courses-offered/allied-health-sciences-courses/bsc-dialysis`,
            "courseCode": "BSC-DIALYSIS",
            "educationalCredentialAwarded": "Bachelor of Science in Dialysis Technology",
            "timeRequired": "P3Y",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Sc Dialysis Tech ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.alliedHealth,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Allied Health Sciences",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          }
        ]
      },

      // ============================================
      // Arts & Science Programs
      // ============================================
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${config.site.url}/#arts-science-programs`,
        "name": "Arts & Science Programs at JKKN College of Arts and Science (Autonomous)",
        "description": "Comprehensive UG and PG programs at JKKN College of Arts and Science (Autonomous), established 1974. Periyar University affiliated, NAAC accredited. Offering B.A., B.Sc., B.Com., B.B.A., B.C.A., M.A., M.Sc., M.Com., and Ph.D programs.",
        "url": `${config.site.url}/courses-offered/arts-and-science-courses`,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN College of Arts and Science (Autonomous)",
          "url": "https://cas.jkkn.ac.in/",
          "parentOrganization": {
            "@id": `${config.site.url}/#organization`
          }
        },
        "educationalProgramMode": "full-time",
        "applicationDeadline": config.admissionDeadline,
        "hasCourse": [
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bca`,
            "name": "BCA - Bachelor of Computer Applications",
            "description": "3-year BCA program at JKKN Arts & Science College with focus on programming, software development, and IT skills. Best BCA college near Erode, Namakkal.",
            "url": `${config.site.url}/courses-offered/arts-and-science-courses/bca`,
            "courseCode": "BCA",
            "educationalCredentialAwarded": "Bachelor of Computer Applications",
            "timeRequired": "P3Y",
            "coursePrerequisites": "10+2 in any stream",
            "teaches": [
              "Programming Languages",
              "Web Development",
              "Database Management",
              "Software Engineering",
              "Mobile App Development"
            ],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `BCA ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.artsScience,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Arts and Science",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": config.address.streetAddress,
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.geo.latitude,
                  "longitude": config.geo.longitude
                }
              }
            },
            "offers": {
              "@type": "Offer",
              "category": "Admission",
              "availability": "https://schema.org/InStock",
              "url": config.site.admissionFormUrl,
              "validFrom": config.offerValidity.validFrom,
              "validThrough": config.offerValidity.validThrough
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bba`,
            "name": "BBA - Bachelor of Business Administration",
            "description": "3-year BBA program at JKKN Arts & Science College covering business fundamentals, management, and entrepreneurship.",
            "url": `${config.site.url}/courses-offered/arts-and-science-courses/bba`,
            "courseCode": "BBA",
            "educationalCredentialAwarded": "Bachelor of Business Administration",
            "timeRequired": "P3Y",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `BBA ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.artsScience,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Arts and Science",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bcom`,
            "name": "B.Com - Bachelor of Commerce",
            "description": "3-year B.Com program with specializations in Accounting, Finance, and Computer Applications at JKKN Arts & Science College.",
            "url": `${config.site.url}/courses-offered/arts-and-science-courses/bcom`,
            "courseCode": "BCOM",
            "educationalCredentialAwarded": "Bachelor of Commerce",
            "timeRequired": "P3Y",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Com ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.artsScience,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Arts and Science",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bsc-cs`,
            "name": "B.Sc Computer Science",
            "description": "3-year B.Sc CS program at JKKN Arts & Science College with comprehensive computer science curriculum.",
            "url": `${config.site.url}/courses-offered/arts-and-science-courses/bsc-cs`,
            "courseCode": "BSC-CS",
            "educationalCredentialAwarded": "Bachelor of Science in Computer Science",
            "timeRequired": "P3Y",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Sc CS ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.artsScience,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Arts and Science",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          },
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-mca`,
            "name": "MCA - Master of Computer Applications",
            "description": "2-year MCA program at JKKN Arts & Science College for advanced computer science and software development education.",
            "url": `${config.site.url}/courses-offered/arts-and-science-courses/mca`,
            "courseCode": "MCA",
            "educationalCredentialAwarded": "Master of Computer Applications",
            "timeRequired": "P2Y",
            "coursePrerequisites": "Bachelor's degree with Mathematics/Computer Science",
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `MCA ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.artsScience,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Arts and Science",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                }
              }
            }
          }
        ]
      },

      // ============================================
      // Education Programs
      // ============================================
      {
        "@type": "EducationalOccupationalProgram",
        "@id": `${config.site.url}/#education-programs`,
        "name": "Education Programs at JKKN College of Education",
        "description": "NCTE approved teacher training programs at JKKN College of Education, Komarapalayam. Established 2016, affiliated to Tamil Nadu Teachers Education University (TNTEU). Best B.Ed college near Erode, Salem.",
        "url": `${config.site.url}/courses-offered/education-courses`,
        "provider": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN College of Education",
          "url": "https://edu.jkkn.ac.in/",
          "parentOrganization": {
            "@id": `${config.site.url}/#organization`
          }
        },
        "educationalProgramMode": "full-time",
        "occupationalCategory": ["School Teacher", "Educator", "Education Administrator"],
        "applicationDeadline": config.admissionDeadline,
        "hasCourse": [
          {
            "@type": "Course",
            "@id": `${config.site.url}/#course-bed`,
            "name": "B.Ed - Bachelor of Education",
            "description": "2-year B.Ed program at JKKN College of Education, Komarapalayam. NCTE approved, TNTEU affiliated. Prepares candidates for teaching careers in schools. Best B.Ed college near Erode, Tiruchengode, Sankagiri.",
            "url": `${config.site.url}/courses-offered/education-courses/bed`,
            "courseCode": "B.ED",
            "educationalCredentialAwarded": "Bachelor of Education",
            "timeRequired": "P2Y",
            "coursePrerequisites": "Bachelor's degree with minimum 50% marks, TNTEU TANCET score",
            "teaches": [
              "Educational Psychology",
              "Pedagogy",
              "Curriculum Development",
              "Assessment & Evaluation",
              "Educational Technology",
              "Inclusive Education"
            ],
            "availableLanguage": ["English", "Tamil"],
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "name": `B.Ed ${config.academicYear} Batch`,
              "courseMode": "full-time",
              "startDate": config.courseStartDates.education,
              "location": {
                "@type": "Place",
                "name": "JKKN College of Education",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": config.address.streetAddress,
                  "addressLocality": config.address.addressLocality,
                  "addressRegion": config.address.addressRegion,
                  "postalCode": config.address.postalCode,
                  "addressCountry": config.address.addressCountry
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": config.geo.latitude,
                  "longitude": config.geo.longitude
                }
              }
            },
            "offers": {
              "@type": "Offer",
              "category": "Admission",
              "availability": "https://schema.org/InStock",
              "url": config.site.admissionFormUrl,
              "validFrom": config.offerValidity.validFrom,
              "validThrough": config.offerValidity.validThrough
            }
          }
        ]
      },

      // ============================================
      // WebPage - Courses Offered
      // ============================================
      {
        "@type": "WebPage",
        "@id": `${config.site.url}/courses-offered`,
        "name": `Courses Offered at JKKN Institutions | 50+ Programs | Best College Erode`,
        "description": "Explore 50+ courses at JKKN Institutions - Dental (BDS/MDS), Pharmacy (B.Pharm/M.Pharm/Pharm.D), Engineering (B.E./B.Tech/MBA), Nursing, Allied Health Sciencess, Arts & Science, Education. NAAC accredited, 92%+ placements.",
        "url": `${config.site.url}/courses-offered`,
        "isPartOf": {
          "@id": `${config.site.url}/#website`
        },
        "about": {
          "@id": `${config.site.url}/#course-catalog`
        },
        "mainEntity": {
          "@id": `${config.site.url}/#course-catalog`
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${config.site.url}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Courses Offered",
              "item": `${config.site.url}/courses-offered`
            }
          ]
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".course-name", ".course-description", ".admission-cta"]
        },
        "potentialAction": {
          "@type": "ApplyAction",
          "name": `Apply for Admission ${config.academicYear}`,
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": config.site.admissionFormUrl
          }
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
