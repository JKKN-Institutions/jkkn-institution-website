/**
 * Events Calendar JSON-LD Schema for JKKN Institutions
 *
 * This component renders structured data for search engines.
 * It has NO visual impact on the page - only visible in HTML source.
 *
 * Contains:
 * - ItemList (Events Calendar) with 12 event links
 * - 10 Event entities + 1 SportsEvent
 * - 1 EventSeries (JKKN100 Centenary)
 * - 1 WebPage for /events
 *
 * Used for:
 * - Rich event snippets in search results
 * - Event knowledge panels
 * - Voice search optimization
 * - Google Events carousel eligibility
 *
 * Events covered: 2025-26 academic year + #JKKN100 centenary celebration
 */

export function EventsCalendarSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // ============================================
      // ItemList - Events Calendar
      // ============================================
      {
        "@type": "ItemList",
        "@id": "https://jkkn.ac.in/#events-calendar",
        "name": "JKKN Institutions Events Calendar 2025-26",
        "description": "Comprehensive calendar of academic events, admission drives, placement activities, and #JKKN100 centenary celebrations at JKKN Institutions, Komarapalayam - Best College in Erode, Tamil Nadu",
        "numberOfItems": 12,
        "itemListOrder": "https://schema.org/ItemListOrderAscending",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "JKKN100 Centenary Inauguration",
            "url": "https://jkkn.ac.in/events/jkkn100-centenary-inauguration",
            "item": {
              "@id": "https://jkkn.ac.in/#event-centenary-inauguration"
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Admissions Open House 2026-27",
            "url": "https://jkkn.ac.in/events/admissions-open-house-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-admissions-open-house"
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "JKKN Campus Recruitment Drive 2026",
            "url": "https://jkkn.ac.in/events/campus-recruitment-drive-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-placement-drive"
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "National Dental Awareness Camp",
            "url": "https://jkkn.ac.in/events/dental-awareness-camp-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-dental-camp"
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "JKKN Annual Sports Meet 2026",
            "url": "https://jkkn.ac.in/events/annual-sports-meet-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-sports-meet"
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "International Conference on Pharmaceutical Sciences",
            "url": "https://jkkn.ac.in/events/pharma-conference-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-pharma-conference"
            }
          },
          {
            "@type": "ListItem",
            "position": 7,
            "name": "JKKN Techfest - Innovation Summit 2026",
            "url": "https://jkkn.ac.in/events/techfest-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-techfest"
            }
          },
          {
            "@type": "ListItem",
            "position": 8,
            "name": "Founder's Day - J.K.K. Nataraja Chettiar Memorial",
            "url": "https://jkkn.ac.in/events/founders-day-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-founders-day"
            }
          },
          {
            "@type": "ListItem",
            "position": 9,
            "name": "JKKN Annual Convocation 2026",
            "url": "https://jkkn.ac.in/events/convocation-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-convocation"
            }
          },
          {
            "@type": "ListItem",
            "position": 10,
            "name": "National Nursing Week Celebration",
            "url": "https://jkkn.ac.in/events/nursing-week-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-nursing-week"
            }
          },
          {
            "@type": "ListItem",
            "position": 11,
            "name": "JKKN Cultural Fest - Nattraja Utsav 2026",
            "url": "https://jkkn.ac.in/events/nattraja-utsav-2026",
            "item": {
              "@id": "https://jkkn.ac.in/#event-cultural-fest"
            }
          },
          {
            "@type": "ListItem",
            "position": 12,
            "name": "JKKN100 Centenary Grand Finale",
            "url": "https://jkkn.ac.in/events/jkkn100-grand-finale",
            "item": {
              "@id": "https://jkkn.ac.in/#event-centenary-finale"
            }
          }
        ]
      },

      // ============================================
      // Event 1: JKKN100 Centenary Inauguration
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-centenary-inauguration",
        "name": "JKKN100 Centenary Inauguration - 100th Birth Anniversary of Founder J.K.K. Nataraja Chettiar",
        "alternateName": [
          "#JKKN100 Launch Event",
          "JKKN Centenary Celebration Inauguration",
          "Founder's 100th Anniversary Launch"
        ],
        "description": "Grand inauguration of the year-long #JKKN100 centenary celebration marking the 100th birth anniversary of visionary founder Kodai Vallal Shri. J.K.K. Nataraja Chettiar (1925-1995). Join us in honoring his extraordinary legacy of transforming education in Tamil Nadu through his 'Dream Big, Achieve Bigger' philosophy. Event features heritage exhibition, documentary screening, commemorative book launch, and tribute performances by Learners from all 7 JKKN colleges.",
        "url": "https://jkkn.ac.in/events/jkkn100-centenary-inauguration",
        "image": [
          "https://jkkn.ac.in/images/events/jkkn100-inauguration-banner.jpg",
          "https://jkkn.ac.in/images/events/jkkn100-poster.jpg"
        ],
        "startDate": "2025-11-13T09:00:00+05:30",
        "endDate": "2025-11-13T18:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
        "location": [
          {
            "@type": "Place",
            "name": "JKKN Institutions Main Auditorium",
            "description": "State-of-the-art 2000-seater auditorium at JKKN Campus",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
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
            "hasMap": "https://maps.google.com/?q=11.445400813968119,77.73060452273064"
          },
          {
            "@type": "VirtualLocation",
            "url": "https://jkkn.ac.in/live/jkkn100-inauguration",
            "name": "JKKN100 Live Stream"
          }
        ],
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions",
          "url": "https://jkkn.ac.in/"
        },
        "performer": [
          {
            "@type": "PerformingGroup",
            "name": "JKKN Cultural Club",
            "description": "Learners from 7 JKKN colleges performing tribute acts"
          }
        ],
        "sponsor": {
          "@type": "Organization",
          "name": "J.K.K. Rangammal Charitable Trust",
          "@id": "https://jkkn.ac.in/#trust"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://jkkn.ac.in/events/jkkn100-centenary-inauguration/register",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-10-01",
          "validThrough": "2025-11-12"
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "Alumni, Learners, Learning Facilitators, Parents, Community Members, Education Leaders"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "JKKN100",
          "Centenary Celebration",
          "J.K.K. Nataraja Chettiar",
          "JKKN Founder",
          "Education Pioneer Tamil Nadu",
          "Komarapalayam Events",
          "Best College Erode Events"
        ],
        "superEvent": {
          "@type": "EventSeries",
          "@id": "https://jkkn.ac.in/#jkkn100-series",
          "name": "#JKKN100 Year-Long Centenary Celebration",
          "startDate": "2025-11-13",
          "endDate": "2026-11-13"
        }
      },

      // ============================================
      // Event 2: Admissions Open House 2026-27
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-admissions-open-house",
        "name": "JKKN Admissions Open House 2026-27 | Explore 50+ Courses",
        "alternateName": [
          "JKKN Campus Visit Day",
          "JKKN Admission Counseling Event",
          "College Open Day Erode"
        ],
        "description": "Discover your future at JKKN Institutions! Join our Admissions Open House to explore 50+ career-focused programs across Dental (BDS/MDS), Pharmacy (B.Pharm/M.Pharm/Pharm.D), Engineering (B.E./B.Tech/MBA), Nursing (B.Sc/M.Sc), Allied Health Sciences, Arts & Science, and Education (B.Ed). Meet Learning Facilitators, tour state-of-the-art facilities, interact with current Learners, and get on-the-spot admission guidance. Special early bird discounts for registrants!",
        "url": "https://jkkn.ac.in/events/admissions-open-house-2026",
        "image": [
          "https://jkkn.ac.in/images/events/admissions-open-house-2026.jpg",
          "https://jkkn.ac.in/images/campus/aerial-view.jpg"
        ],
        "startDate": "2026-01-15T09:00:00+05:30",
        "endDate": "2026-01-15T17:00:00+05:30",
        "doorTime": "08:30:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "JKKN Institutions Campus",
          "description": "60-acre integrated residential campus with 7 colleges, hostels, and world-class facilities",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
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
          "hasMap": "https://maps.google.com/?q=11.445400813968119,77.73060452273064",
          "amenityFeature": [
            {
              "@type": "LocationFeatureSpecification",
              "name": "Free Parking",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Refreshments",
              "value": true
            },
            {
              "@type": "LocationFeatureSpecification",
              "name": "Wheelchair Accessible",
              "value": true
            }
          ]
        },
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions",
          "url": "https://jkkn.ac.in/"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://jkkn.in/admission-form",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-12-01",
          "validThrough": "2026-01-14",
          "description": "Free registration. Early bird application fee waiver for attendees."
        },
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "audienceType": "Prospective Learners, Parents, Career Counselors"
        },
        "typicalAgeRange": "16-35",
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "College Admission 2026",
          "Best College Erode",
          "JKKN Admission",
          "BDS Admission Tamil Nadu",
          "B.Pharm Admission",
          "Engineering Admission Namakkal",
          "Nursing College Admission",
          "Open House College Event"
        ],
        "subEvent": [
          {
            "@type": "Event",
            "name": "Campus Tour - Dental College & Hospital",
            "description": "Guided tour of JKKN Dental College facilities including the 300-bed dental hospital, clinics, and laboratories.",
            "startDate": "2026-01-15T10:00:00+05:30",
            "endDate": "2026-01-15T11:00:00+05:30",
            "duration": "PT1H",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN Dental College & Hospital",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN Institutions",
              "url": "https://jkkn.ac.in/"
            },
            "isAccessibleForFree": true
          },
          {
            "@type": "Event",
            "name": "One-on-One Counseling Sessions",
            "description": "Personal admission counseling sessions with faculty members to discuss course options, career paths, and admission requirements.",
            "startDate": "2026-01-15T11:00:00+05:30",
            "endDate": "2026-01-15T15:00:00+05:30",
            "duration": "PT4H",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN Institutions Admission Center",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN Institutions",
              "url": "https://jkkn.ac.in/"
            },
            "isAccessibleForFree": true
          },
          {
            "@type": "Event",
            "name": "Scholarship Information Session",
            "description": "Detailed presentation on available scholarships, financial aid options, and application procedures for deserving students.",
            "startDate": "2026-01-15T14:00:00+05:30",
            "endDate": "2026-01-15T15:00:00+05:30",
            "duration": "PT1H",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN Institutions Main Auditorium",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN Institutions",
              "url": "https://jkkn.ac.in/"
            },
            "isAccessibleForFree": true
          }
        ],
        "potentialAction": {
          "@type": "RegisterAction",
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
            "name": "Open House Registration Confirmation"
          }
        }
      },

      // ============================================
      // Event 3: Campus Recruitment Drive 2026
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-placement-drive",
        "name": "JKKN Campus Recruitment Drive 2026 | 100+ Companies | 92%+ Placement Rate",
        "alternateName": [
          "JKKN Placement Fair 2026",
          "Campus Hiring Event Erode",
          "JKKN Job Fair"
        ],
        "description": "Annual mega campus recruitment drive at JKKN Institutions featuring 100+ top recruiters including Foxconn, Bosch, TCS, Cipla, Apex Pharma, Apotex, Apollo Hospitals, and more. Open to final year Learners and recent graduates from all 7 JKKN colleges. Excellent opportunities across IT, Healthcare, Pharmaceutical, Manufacturing, and Service sectors. JKKN maintains 92%+ placement success rate with competitive salary packages.",
        "url": "https://jkkn.ac.in/events/campus-recruitment-drive-2026",
        "image": [
          "https://jkkn.ac.in/images/events/placement-drive-2026.jpg",
          "https://jkkn.ac.in/images/placements/recruiters-collage.jpg"
        ],
        "startDate": "2026-02-10T08:00:00+05:30",
        "endDate": "2026-02-12T18:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "JKKN Placement & Training Center",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
            "addressLocality": "Komarapalayam",
            "addressRegion": "Tamil Nadu",
            "postalCode": "638183",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "11.445400813968119",
            "longitude": "77.73060452273064"
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": "JKKN Placement Cell",
          "parentOrganization": {
            "@id": "https://jkkn.ac.in/#organization"
          },
          "email": "placements@jkkn.ac.in"
        },
        "contributor": [
          {
            "@type": "Organization",
            "name": "Foxconn",
            "description": "Top recruiter - Manufacturing"
          },
          {
            "@type": "Organization",
            "name": "Bosch",
            "description": "Top recruiter - Engineering"
          },
          {
            "@type": "Organization",
            "name": "Cipla",
            "description": "Top recruiter - Pharmaceutical"
          },
          {
            "@type": "Organization",
            "name": "Apollo Hospitals",
            "description": "Top recruiter - Healthcare"
          },
          {
            "@type": "Organization",
            "name": "TCS",
            "description": "Top recruiter - IT Services"
          }
        ],
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "audienceType": "Final Year Learners, Fresh Graduates from JKKN Institutions"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en"],
        "keywords": [
          "Campus Placement 2026",
          "Job Fair Erode",
          "JKKN Placements",
          "Engineering Jobs Tamil Nadu",
          "Pharmacy Jobs",
          "Nursing Jobs",
          "Fresher Jobs Namakkal",
          "Campus Recruitment"
        ],
        "workPerformed": {
          "@type": "CreativeWork",
          "name": "Pre-Placement Training Program",
          "description": "Comprehensive training including aptitude, technical skills, and interview preparation"
        }
      },

      // ============================================
      // Event 4: National Dental Awareness Camp
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-dental-camp",
        "name": "National Dental Awareness Camp 2026 | Free Dental Checkup | JKKN Dental College",
        "alternateName": [
          "Free Dental Camp Erode",
          "JKKN Dental Outreach Program",
          "Community Dental Health Camp"
        ],
        "description": "JKKN Dental College and Hospital organizes a comprehensive National Dental Awareness Camp offering free dental checkups, consultations, and basic treatments for the community. Services include oral cancer screening, dental X-rays, scaling, extractions, and awareness sessions on oral hygiene. Expert dental surgeons and MDS specialists from all 7 dental departments available. Part of JKKN's commitment to community health and social responsibility.",
        "url": "https://jkkn.ac.in/events/dental-awareness-camp-2026",
        "image": [
          "https://jkkn.ac.in/images/events/dental-camp-2026.jpg",
          "https://jkkn.ac.in/images/dental-hospital/treatment-room.jpg"
        ],
        "startDate": "2026-03-06T08:00:00+05:30",
        "endDate": "2026-03-07T17:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Hospital",
          "name": "JKKN Dental College and Hospital",
          "description": "300-bed dental hospital with state-of-the-art facilities",
          "medicalSpecialty": [
            "Dentistry",
            "Orthodontics",
            "Periodontics",
            "Oral Surgery",
            "Prosthodontics"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
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
          "telephone": "+91-9345855001"
        },
        "organizer": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN Dental College and Hospital",
          "url": "https://dental.jkkn.ac.in/",
          "parentOrganization": {
            "@id": "https://jkkn.ac.in/#organization"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "description": "Free dental checkup and basic treatments for all attendees"
        },
        "audience": {
          "@type": "PeopleAudience",
          "audienceType": "General Public",
          "geographicArea": {
            "@type": "AdministrativeArea",
            "name": "Erode, Namakkal, Salem Districts"
          }
        },
        "typicalAgeRange": "All ages",
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "Free Dental Camp",
          "Dental Checkup Erode",
          "Oral Health Camp",
          "Community Health Event",
          "JKKN Dental Hospital",
          "Free Dental Treatment Tamil Nadu",
          "Dentist Komarapalayam"
        ],
        "about": {
          "@type": "MedicalCondition",
          "name": "Dental Health",
          "associatedAnatomy": {
            "@type": "AnatomicalStructure",
            "name": "Teeth and Oral Cavity"
          }
        }
      },

      // ============================================
      // Event 5: Annual Sports Meet (SportsEvent)
      // ============================================
      {
        "@type": "SportsEvent",
        "@id": "https://jkkn.ac.in/#event-sports-meet",
        "name": "JKKN Annual Sports Meet 2026 - Inter-College Athletic Championship",
        "alternateName": [
          "JKKN Sports Day",
          "Inter-College Sports Championship",
          "JKKN Athletic Meet"
        ],
        "description": "Annual inter-college sports championship featuring athletic events, team sports, and recreational activities for Learners from all 7 JKKN colleges. Events include track and field, basketball, volleyball, cricket, football, badminton, table tennis, chess, and traditional games. Promotes physical fitness, team spirit, and healthy competition aligned with JKKN's holistic education philosophy.",
        "url": "https://jkkn.ac.in/events/annual-sports-meet-2026",
        "image": "https://jkkn.ac.in/images/events/sports-meet-2026.jpg",
        "startDate": "2026-01-25T07:00:00+05:30",
        "endDate": "2026-01-27T18:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "sport": [
          "Athletics",
          "Basketball",
          "Volleyball",
          "Cricket",
          "Football",
          "Badminton",
          "Table Tennis",
          "Chess"
        ],
        "location": {
          "@type": "StadiumOrArena",
          "name": "JKKN Sports Complex & Athletic Ground",
          "description": "Multi-sport complex with synthetic track, indoor and outdoor facilities",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
            "addressLocality": "Komarapalayam",
            "addressRegion": "Tamil Nadu",
            "postalCode": "638183",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "11.445400813968119",
            "longitude": "77.73060452273064"
          }
        },
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions"
        },
        "competitor": [
          {
            "@type": "SportsTeam",
            "name": "JKKN Dental College Team"
          },
          {
            "@type": "SportsTeam",
            "name": "JKKN Pharmacy College Team"
          },
          {
            "@type": "SportsTeam",
            "name": "JKKN Engineering College Team"
          },
          {
            "@type": "SportsTeam",
            "name": "JKKN Arts & Science Team"
          },
          {
            "@type": "SportsTeam",
            "name": "JKKN Nursing College Team"
          },
          {
            "@type": "SportsTeam",
            "name": "JKKN Allied Health Sciences Team"
          },
          {
            "@type": "SportsTeam",
            "name": "JKKN Education College Team"
          }
        ],
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "audienceType": "JKKN Learners, Learning Facilitators, Parents, Alumni"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "College Sports Meet",
          "Athletic Championship",
          "Inter-College Sports",
          "JKKN Sports",
          "College Sports Event Erode"
        ]
      },

      // ============================================
      // Event 6: International Pharma Conference
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-pharma-conference",
        "name": "International Conference on Pharmaceutical Sciences (ICPS 2026) | JKKN College of Pharmacy",
        "alternateName": [
          "JKKN Pharma Conference",
          "ICPS 2026",
          "Pharmaceutical Research Symposium"
        ],
        "description": "Prestigious international conference hosted by JKKN College of Pharmacy bringing together pharmaceutical researchers, industry leaders, academicians, and Learners from across the globe. Theme: 'Innovations in Drug Discovery and Pharmaceutical Technology'. Features keynote addresses, research paper presentations, poster sessions, industry exhibitions, and networking opportunities. PCI-recognized continuing education credits available.",
        "url": "https://jkkn.ac.in/events/pharma-conference-2026",
        "image": "https://jkkn.ac.in/images/events/icps-2026-banner.jpg",
        "startDate": "2026-03-20T09:00:00+05:30",
        "endDate": "2026-03-21T17:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
        "location": [
          {
            "@type": "Place",
            "name": "JKKN College of Pharmacy Conference Hall",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
              "addressLocality": "Komarapalayam",
              "addressRegion": "Tamil Nadu",
              "postalCode": "638183",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "11.445400813968119",
              "longitude": "77.73060452273064"
            }
          },
          {
            "@type": "VirtualLocation",
            "url": "https://jkkn.ac.in/icps2026/virtual",
            "name": "ICPS 2026 Virtual Platform"
          }
        ],
        "organizer": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN College of Pharmacy",
          "url": "https://pharmacy.jkkn.ac.in/",
          "parentOrganization": {
            "@id": "https://jkkn.ac.in/#organization"
          }
        },
        "offers": [
          {
            "@type": "Offer",
            "name": "Early Bird Registration - Learners",
            "price": "500",
            "priceCurrency": "INR",
            "validFrom": "2025-12-01",
            "validThrough": "2026-01-31",
            "eligibleCustomerType": "Student"
          },
          {
            "@type": "Offer",
            "name": "Early Bird Registration - Professionals",
            "price": "2000",
            "priceCurrency": "INR",
            "validFrom": "2025-12-01",
            "validThrough": "2026-01-31"
          },
          {
            "@type": "Offer",
            "name": "Regular Registration - Professionals",
            "price": "3000",
            "priceCurrency": "INR",
            "validFrom": "2026-02-01",
            "validThrough": "2026-03-15"
          }
        ],
        "audience": {
          "@type": "Audience",
          "audienceType": "Pharmaceutical Researchers, Academicians, Industry Professionals, Pharmacy Learners"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Drug Discovery"
          },
          {
            "@type": "Thing",
            "name": "Pharmaceutical Technology"
          },
          {
            "@type": "Thing",
            "name": "Clinical Pharmacy"
          },
          {
            "@type": "Thing",
            "name": "Pharmacology Research"
          }
        ],
        "inLanguage": ["en"],
        "keywords": [
          "Pharmacy Conference 2026",
          "Pharmaceutical Research Conference",
          "Drug Discovery Symposium",
          "JKKN Pharmacy Events",
          "Pharma Industry Conference Tamil Nadu",
          "PCI Conference"
        ],
        "recordedIn": {
          "@type": "CreativeWork",
          "name": "ICPS 2026 Proceedings",
          "description": "Conference proceedings with published research papers"
        }
      },

      // ============================================
      // Event 7: JKKN Techfest 2026
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-techfest",
        "name": "JKKN Techfest 2026 - Innovation Summit & Project Expo",
        "alternateName": [
          "JKKN Technical Festival",
          "Engineering Innovation Summit",
          "JKKN Project Exhibition"
        ],
        "description": "Annual technical festival organized by JKKN College of Engineering and Technology featuring innovative project exhibitions, hackathons, coding competitions, robotics challenges, paper presentations, and industry expert talks. Theme: 'Engineering Tomorrow: AI, IoT & Sustainable Solutions'. Open to engineering Learners from colleges across Tamil Nadu. Cash prizes worth \u20b95 lakhs and industry internship opportunities.",
        "url": "https://jkkn.ac.in/events/techfest-2026",
        "image": "https://jkkn.ac.in/images/events/techfest-2026-banner.jpg",
        "startDate": "2026-02-20T09:00:00+05:30",
        "endDate": "2026-02-22T18:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "JKKN College of Engineering and Technology",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
            "addressLocality": "Komarapalayam",
            "addressRegion": "Tamil Nadu",
            "postalCode": "638183",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "11.445400813968119",
            "longitude": "77.73060452273064"
          }
        },
        "organizer": {
          "@type": "CollegeOrUniversity",
          "name": "JKKN College of Engineering and Technology",
          "url": "https://engg.jkkn.ac.in/",
          "parentOrganization": {
            "@id": "https://jkkn.ac.in/#organization"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": "200",
          "priceCurrency": "INR",
          "description": "Registration fee per participant. Team discounts available.",
          "availability": "https://schema.org/InStock"
        },
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "audienceType": "Engineering Learners from Tamil Nadu colleges"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Artificial Intelligence"
          },
          {
            "@type": "Thing",
            "name": "Internet of Things"
          },
          {
            "@type": "Thing",
            "name": "Robotics"
          },
          {
            "@type": "Thing",
            "name": "Sustainable Engineering"
          }
        ],
        "inLanguage": ["en"],
        "keywords": [
          "Engineering Techfest",
          "College Technical Festival",
          "Hackathon Tamil Nadu",
          "Robotics Competition",
          "Project Exhibition",
          "JKKN Engineering Events",
          "Anna University Events"
        ],
        "subEvent": [
          {
            "@type": "Event",
            "name": "24-Hour Hackathon",
            "description": "Intensive 24-hour coding competition to solve real-world problems using technology.",
            "startDate": "2026-02-20T18:00:00+05:30",
            "endDate": "2026-02-21T18:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN College of Engineering - Computer Lab Block",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN College of Engineering and Technology",
              "url": "https://engg.jkkn.ac.in/"
            }
          },
          {
            "@type": "Event",
            "name": "Robotics Challenge",
            "description": "Robotics competition featuring autonomous robots competing in various tasks and challenges.",
            "startDate": "2026-02-21T10:00:00+05:30",
            "endDate": "2026-02-21T17:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN College of Engineering - Robotics Arena",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN College of Engineering and Technology",
              "url": "https://engg.jkkn.ac.in/"
            }
          },
          {
            "@type": "Event",
            "name": "Project Expo & Judging",
            "description": "Exhibition and evaluation of innovative student projects across various engineering disciplines.",
            "startDate": "2026-02-22T09:00:00+05:30",
            "endDate": "2026-02-22T17:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN College of Engineering - Main Hall",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN College of Engineering and Technology",
              "url": "https://engg.jkkn.ac.in/"
            }
          }
        ]
      },

      // ============================================
      // Event 8: Founder's Day 2026
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-founders-day",
        "name": "Founder's Day 2026 - Tribute to J.K.K. Nataraja Chettiar (1925-1995)",
        "alternateName": [
          "JKKN Founder's Memorial Day",
          "J.K.K. Nataraja Chettiar Remembrance Day"
        ],
        "description": "Annual commemoration of JKKN founder Kodai Vallal Shri. J.K.K. Nataraja Chettiar's (1925-1995) death anniversary. Special tribute program featuring documentary screening, legacy talks, scholarship awards to meritorious Learners, and community service activities. Part of the #JKKN100 centenary celebration year, honoring the visionary who transformed education in Tamil Nadu through his 'Dream Big, Achieve Bigger' philosophy.",
        "url": "https://jkkn.ac.in/events/founders-day-2026",
        "image": "https://jkkn.ac.in/images/events/founders-day-2026.jpg",
        "startDate": "2026-09-25T08:00:00+05:30",
        "endDate": "2026-09-25T17:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "JKKN Institutions Main Auditorium",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
            "addressLocality": "Komarapalayam",
            "addressRegion": "Tamil Nadu",
            "postalCode": "638183",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "11.445400813968119",
            "longitude": "77.73060452273064"
          }
        },
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions"
        },
        "about": {
          "@type": "Person",
          "name": "J.K.K. Nataraja Chettiar",
          "alternateName": "Kodai Vallal Shri. J.K.K. Natarajah",
          "birthDate": "1925",
          "deathDate": "1995-09-25",
          "description": "Visionary founder of JKKN Institutions who established J.K.K. Rangammal Charitable Trust to promote education",
          "award": "Thirupani Arasu (honored by Sivaji Ganesan)"
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "JKKN Community - Learners, Learning Facilitators, Alumni, Staff, Trustees"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "JKKN Founder",
          "J.K.K. Nataraja Chettiar",
          "Founder's Day",
          "JKKN100",
          "Education Pioneer Tamil Nadu"
        ],
        "superEvent": {
          "@type": "EventSeries",
          "@id": "https://jkkn.ac.in/#jkkn100-series",
          "name": "#JKKN100 Year-Long Centenary Celebration"
        }
      },

      // ============================================
      // Event 9: Annual Convocation 2026
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-convocation",
        "name": "JKKN Annual Convocation 2026 - Graduation Ceremony",
        "alternateName": [
          "JKKN Graduation Day",
          "Degree Award Ceremony"
        ],
        "description": "Prestigious annual convocation ceremony celebrating the achievements of graduating Learners from all 7 JKKN colleges. Award of degrees in Dental (BDS/MDS), Pharmacy (B.Pharm/M.Pharm/Pharm.D), Engineering (B.E./B.Tech/MBA), Nursing (B.Sc/M.Sc), Allied Health Sciences, Arts & Science, and Education (B.Ed). Features chief guest address, gold medal presentations, and honorary awards.",
        "url": "https://jkkn.ac.in/events/convocation-2026",
        "image": "https://jkkn.ac.in/images/events/convocation-2026.jpg",
        "startDate": "2026-08-15T10:00:00+05:30",
        "endDate": "2026-08-15T14:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
        "location": [
          {
            "@type": "Place",
            "name": "JKKN Convocation Ground",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
              "addressLocality": "Komarapalayam",
              "addressRegion": "Tamil Nadu",
              "postalCode": "638183",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "11.445400813968119",
              "longitude": "77.73060452273064"
            }
          },
          {
            "@type": "VirtualLocation",
            "url": "https://jkkn.ac.in/live/convocation-2026",
            "name": "Live Stream for Parents & Alumni"
          }
        ],
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions"
        },
        "audience": {
          "@type": "EducationalAudience",
          "educationalRole": "student",
          "audienceType": "Graduating Learners, Parents, Alumni, Invitees"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "Convocation 2026",
          "Graduation Ceremony",
          "JKKN Degrees",
          "College Graduation Tamil Nadu",
          "Degree Award Ceremony"
        ]
      },

      // ============================================
      // Event 10: National Nursing Week
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-nursing-week",
        "name": "National Nursing Week Celebration 2026 | Sresakthimayeil Institute of Nursing",
        "alternateName": [
          "International Nurses Day Celebration",
          "JKKN Nursing Week"
        ],
        "description": "Week-long celebration of nursing profession at Sresakthimayeil Institute of Nursing and Research, coinciding with International Nurses Day (May 12). Events include health camps, awareness programs, workshops on advanced nursing practices, guest lectures by eminent nursing professionals, Nightingale Award presentations, and community health outreach activities.",
        "url": "https://jkkn.ac.in/events/nursing-week-2026",
        "image": "https://jkkn.ac.in/images/events/nursing-week-2026.jpg",
        "startDate": "2026-05-08T09:00:00+05:30",
        "endDate": "2026-05-14T17:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "Sresakthimayeil Institute of Nursing and Research",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
            "addressLocality": "Komarapalayam",
            "addressRegion": "Tamil Nadu",
            "postalCode": "638183",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "11.445400813968119",
            "longitude": "77.73060452273064"
          }
        },
        "organizer": {
          "@type": "CollegeOrUniversity",
          "name": "Sresakthimayeil Institute of Nursing and Research",
          "url": "https://nursing.sresakthimayeil.jkkn.ac.in/",
          "parentOrganization": {
            "@id": "https://jkkn.ac.in/#organization"
          }
        },
        "about": {
          "@type": "Person",
          "name": "Florence Nightingale",
          "description": "Founder of modern nursing, born May 12, 1820"
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "Nursing Learners, Healthcare Professionals, Community Members"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "Nursing Week",
          "International Nurses Day",
          "Florence Nightingale",
          "Nursing College Events",
          "Healthcare Week Erode"
        ]
      },

      // ============================================
      // Event 11: Nattraja Utsav (Cultural Festival)
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-cultural-fest",
        "name": "Nattraja Utsav 2026 - JKKN Annual Cultural Festival",
        "alternateName": [
          "JKKN Cultural Fest",
          "Nattraja Festival",
          "JKKN Arts Festival"
        ],
        "description": "Grand annual cultural festival celebrating art, music, dance, drama, and literary talents of Learners from all 7 JKKN colleges. Named after Lord Nataraja (cosmic dancer) and founder J.K.K. Nataraja Chettiar. Features classical and contemporary performances, inter-college competitions, celebrity guest performances, fashion show, and food festival. Three days of vibrant cultural celebration showcasing the holistic development of JKKN Learners.",
        "url": "https://jkkn.ac.in/events/nattraja-utsav-2026",
        "image": "https://jkkn.ac.in/images/events/nattraja-utsav-2026.jpg",
        "startDate": "2026-02-27T17:00:00+05:30",
        "endDate": "2026-03-01T22:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "JKKN Open Air Amphitheatre & Campus Grounds",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
            "addressLocality": "Komarapalayam",
            "addressRegion": "Tamil Nadu",
            "postalCode": "638183",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "11.445400813968119",
            "longitude": "77.73060452273064"
          }
        },
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions"
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "JKKN Learners, Learning Facilitators, Alumni, Parents, General Public"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "Cultural Festival",
          "College Fest",
          "Nattraja Utsav",
          "JKKN Cultural",
          "College Events Tamil Nadu",
          "Dance Competition",
          "Music Festival Erode"
        ],
        "subEvent": [
          {
            "@type": "Event",
            "name": "Classical Dance Competition",
            "description": "Inter-college classical dance competition featuring Bharatanatyam, Kuchipudi, and other traditional dance forms.",
            "startDate": "2026-02-27T18:00:00+05:30",
            "endDate": "2026-02-27T21:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN Open Air Amphitheatre",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN Institutions",
              "url": "https://jkkn.ac.in/"
            }
          },
          {
            "@type": "Event",
            "name": "Battle of Bands",
            "description": "Inter-college music band competition showcasing contemporary and fusion music talents.",
            "startDate": "2026-02-28T19:00:00+05:30",
            "endDate": "2026-02-28T22:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN Open Air Amphitheatre",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN Institutions",
              "url": "https://jkkn.ac.in/"
            }
          },
          {
            "@type": "Event",
            "name": "Fashion Show - Ethnic Fusion",
            "description": "Grand fashion show featuring ethnic and fusion designs created and modeled by JKKN students.",
            "startDate": "2026-03-01T19:00:00+05:30",
            "endDate": "2026-03-01T21:00:00+05:30",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": "JKKN Open Air Amphitheatre",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
                "addressLocality": "Komarapalayam",
                "addressRegion": "Tamil Nadu",
                "postalCode": "638183",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.445400813968119",
                "longitude": "77.73060452273064"
              }
            },
            "organizer": {
              "@type": "EducationalOrganization",
              "name": "JKKN Institutions",
              "url": "https://jkkn.ac.in/"
            }
          }
        ]
      },

      // ============================================
      // Event 12: JKKN100 Grand Finale
      // ============================================
      {
        "@type": "Event",
        "@id": "https://jkkn.ac.in/#event-centenary-finale",
        "name": "JKKN100 Centenary Grand Finale - Closing Ceremony",
        "alternateName": [
          "#JKKN100 Closing Event",
          "Centenary Year Conclusion"
        ],
        "description": "Grand finale of the year-long #JKKN100 centenary celebration marking the completion of 100th birth anniversary commemorations of founder J.K.K. Nataraja Chettiar. Features retrospective exhibition, documentary premiere, time capsule ceremony, commemorative publications release, alumni grand reunion, cultural extravaganza, and announcement of legacy projects. A momentous conclusion to a year of honoring the visionary's transformative impact on education.",
        "url": "https://jkkn.ac.in/events/jkkn100-grand-finale",
        "image": "https://jkkn.ac.in/images/events/jkkn100-finale-banner.jpg",
        "startDate": "2026-11-13T09:00:00+05:30",
        "endDate": "2026-11-13T21:00:00+05:30",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
        "location": [
          {
            "@type": "Place",
            "name": "JKKN Institutions Main Campus",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
              "addressLocality": "Komarapalayam",
              "addressRegion": "Tamil Nadu",
              "postalCode": "638183",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "11.445400813968119",
              "longitude": "77.73060452273064"
            }
          },
          {
            "@type": "VirtualLocation",
            "url": "https://jkkn.ac.in/live/jkkn100-finale",
            "name": "JKKN100 Finale Live Stream"
          }
        ],
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions"
        },
        "sponsor": {
          "@type": "Organization",
          "name": "J.K.K. Rangammal Charitable Trust",
          "@id": "https://jkkn.ac.in/#trust"
        },
        "audience": {
          "@type": "Audience",
          "audienceType": "JKKN Community, Alumni, Dignitaries, Education Leaders, Media"
        },
        "isAccessibleForFree": true,
        "inLanguage": ["en", "ta"],
        "keywords": [
          "JKKN100",
          "Centenary Finale",
          "Alumni Reunion",
          "JKKN Celebration",
          "Education Legacy Tamil Nadu"
        ],
        "superEvent": {
          "@type": "EventSeries",
          "@id": "https://jkkn.ac.in/#jkkn100-series",
          "name": "#JKKN100 Year-Long Centenary Celebration"
        }
      },

      // ============================================
      // EventSeries: JKKN100 Centenary Year
      // ============================================
      {
        "@type": "EventSeries",
        "@id": "https://jkkn.ac.in/#jkkn100-series",
        "name": "#JKKN100 - Centenary Celebration Year (2025-2026)",
        "alternateName": [
          "JKKN Centenary Program",
          "100th Anniversary Celebration"
        ],
        "description": "Year-long celebration (November 2025 - November 2026) commemorating the 100th birth anniversary of JKKN founder Kodai Vallal Shri. J.K.K. Nataraja Chettiar (1925-1995). The centenary program includes heritage exhibitions, cycle rallies, community outreach, documentary screenings, scholarship programs, and culminates in a grand finale. Theme: 'Maximize Impact, Not Expense' - honoring the founder's philosophy of accessible, progressive education.",
        "url": "https://jkkn.ac.in/jkkn100",
        "image": "https://jkkn.ac.in/images/jkkn100/centenary-logo.jpg",
        "startDate": "2025-11-13",
        "endDate": "2026-11-13",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "JKKN Institutions Campus",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Natarajapuram, NH-544 (Salem-Coimbatore Highway)",
            "addressLocality": "Komarapalayam",
            "addressRegion": "Tamil Nadu",
            "postalCode": "638183",
            "addressCountry": "IN"
          }
        },
        "organizer": {
          "@type": "EducationalOrganization",
          "@id": "https://jkkn.ac.in/#organization",
          "name": "JKKN Institutions"
        },
        "subEvent": [
          {
            "@id": "https://jkkn.ac.in/#event-centenary-inauguration"
          },
          {
            "@id": "https://jkkn.ac.in/#event-founders-day"
          },
          {
            "@id": "https://jkkn.ac.in/#event-centenary-finale"
          }
        ],
        "about": {
          "@type": "Person",
          "name": "J.K.K. Nataraja Chettiar",
          "birthDate": "1925-11-13",
          "deathDate": "1995-09-25"
        },
        "keywords": [
          "JKKN100",
          "Centenary Celebration",
          "J.K.K. Nataraja Chettiar",
          "100th Birth Anniversary",
          "Education Pioneer"
        ]
      },

      // ============================================
      // WebPage: Events Page
      // ============================================
      {
        "@type": "WebPage",
        "@id": "https://jkkn.ac.in/events",
        "name": "Events at JKKN Institutions | Academic & Cultural Events | Best College Erode",
        "description": "Discover upcoming events at JKKN Institutions - admissions open house, placement drives, technical fests, cultural programs, health camps, conferences, and #JKKN100 centenary celebrations. Stay updated with events at the best college in Erode, Tamil Nadu.",
        "url": "https://jkkn.ac.in/events",
        "isPartOf": {
          "@id": "https://jkkn.ac.in/#website"
        },
        "about": {
          "@id": "https://jkkn.ac.in/#events-calendar"
        },
        "mainEntity": {
          "@id": "https://jkkn.ac.in/#events-calendar"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://jkkn.ac.in/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Events",
              "item": "https://jkkn.ac.in/events"
            }
          ]
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [".event-title", ".event-date", ".event-description"]
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
