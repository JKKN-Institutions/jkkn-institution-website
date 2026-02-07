/**
 * Automated Facilities Pages Publishing Script
 *
 * This script creates 10 facility submenu pages for the Engineering College CMS.
 *
 * Features:
 * - Creates 10 facility pages as children of "Facilities" parent page
 * - Inserts content blocks with appropriate components (FacilityPage, HostelPage, TransportPage)
 * - Creates SEO metadata for each page
 * - Creates FAB configuration for quick actions
 * - Publishes all pages immediately
 * - Provides rollback capability
 *
 * Usage:
 *   npx tsx scripts/publish-facilities-pages.ts
 *
 * Rollback:
 *   npx tsx scripts/publish-facilities-pages.ts --rollback
 *
 * Requirements:
 * - Engineering College Supabase credentials in .env.local
 * - Parent "Facilities" page must exist (ID: 96f3bbba-23e2-4753-b202-0680009f6fc7)
 * - Components registered: FacilityPage, HostelPage, TransportPage
 */

import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Check for rollback flag
const isRollback = process.argv.includes('--rollback')

// Parent page ID (Facilities page)
const PARENT_PAGE_ID = '96f3bbba-23e2-4753-b202-0680009f6fc7'

// Facilities data
interface Facility {
  title: string
  slug: string
  componentName: string
  sortOrder: number
  description: string
  seo: {
    meta_title: string
    meta_description: string
    og_title: string
    og_description: string
    og_image: string
  }
  props: Record<string, any>
  fab: {
    is_enabled: boolean
    primary_action?: Record<string, any>
    secondary_actions?: Record<string, any>[]
  }
}

const FACILITIES: Facility[] = [
  // 1. Ambulance Services
  {
    title: 'Ambulance Services',
    slug: 'facilities/ambulance-services',
    componentName: 'FacilityPage',
    sortOrder: 1,
    description: '24/7 emergency medical services with advanced equipment and trained paramedics',
    seo: {
      meta_title: 'Ambulance Services - JKKN College of Engineering',
      meta_description: '24/7 emergency medical services with advanced equipment and trained paramedics. Ensuring student and staff safety at JKKN Engineering College.',
      og_title: 'Ambulance Services - JKKN Engineering College',
      og_description: 'Round-the-clock emergency medical care facility with modern equipment and professional paramedical staff.',
      og_image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=1200&h=630'
    },
    props: {
      facilityTitle: 'AMBULANCE SERVICES',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">Our state-of-the-art ambulance services provide 24/7 emergency medical care to ensure the safety and well-being of our students, faculty, and staff. Equipped with modern life-support systems and staffed by trained paramedics, our ambulances are always ready to respond to medical emergencies.</p><p class="text-lg text-gray-700 leading-relaxed">We understand that health emergencies can occur at any time, which is why our ambulance service is operational round-the-clock, ensuring immediate medical assistance whenever needed.</p>',
      images: [
        'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'
      ],
      features: [
        {
          title: '24/7 Availability',
          description: 'Round-the-clock emergency medical services for students, faculty, and staff with immediate response capability.'
        },
        {
          title: 'Advanced Equipment',
          description: 'Fully equipped with modern medical devices, oxygen support, defibrillators, and life-support systems for critical care.'
        },
        {
          title: 'Trained Paramedics',
          description: 'Professional medical staff with emergency care certification and extensive experience in handling medical emergencies.'
        },
        {
          title: 'Rapid Response',
          description: 'Quick response time to ensure timely medical assistance during emergencies, minimizing health risks.'
        },
        {
          title: 'Direct Hospital Connectivity',
          description: 'Established connections with nearby multi-specialty hospitals for seamless patient transfer and treatment.'
        },
        {
          title: 'GPS Tracking',
          description: 'Real-time GPS tracking system for efficient navigation and faster emergency response.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Emergency Call',
        icon: 'phone',
        action: 'tel:+914565226001',
        variant: 'primary'
      },
      secondary_actions: [
        {
          label: 'Medical Help',
          icon: 'ambulance',
          action: '/contact?service=medical',
          variant: 'secondary'
        }
      ]
    }
  },

  // 2. Auditorium
  {
    title: 'Auditorium',
    slug: 'facilities/auditorium',
    componentName: 'FacilityPage',
    sortOrder: 2,
    description: 'Modern auditorium with advanced audiovisual systems for events, conferences, and seminars',
    seo: {
      meta_title: 'Auditorium - JKKN College of Engineering',
      meta_description: 'Modern auditorium facility with advanced audiovisual systems, comfortable seating, and professional event management for conferences and seminars.',
      og_title: 'Auditorium Facilities - JKKN Engineering College',
      og_description: 'State-of-the-art auditorium for hosting academic events, cultural programs, and professional conferences.',
      og_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630'
    },
    props: {
      facilityTitle: 'AUDITORIUM',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">Our modern auditorium serves as the centerpiece for academic, cultural, and professional events at JKKN Engineering College. With a seating capacity of over 500 people, the auditorium is equipped with cutting-edge audiovisual technology and professional lighting systems.</p><p class="text-lg text-gray-700 leading-relaxed">The facility hosts guest lectures, technical seminars, cultural programs, placement drives, and international conferences, providing students with exposure to industry leaders and academic experts.</p>',
      images: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800'
      ],
      features: [
        {
          title: 'Large Seating Capacity',
          description: 'Comfortable seating for 500+ attendees with ergonomic chairs and optimal viewing angles for all audience members.'
        },
        {
          title: 'Advanced AV Systems',
          description: 'High-definition projection systems, professional sound systems, wireless microphones, and video conferencing facilities.'
        },
        {
          title: 'Professional Lighting',
          description: 'State-of-the-art stage lighting with customizable color schemes and intensity control for various event requirements.'
        },
        {
          title: 'Air-Conditioned Hall',
          description: 'Climate-controlled environment ensuring comfort during long events and conferences.'
        },
        {
          title: 'Green Room Facilities',
          description: 'Dedicated preparation rooms for speakers and performers with amenities and privacy.'
        },
        {
          title: 'Recording Capability',
          description: 'Professional recording and live streaming equipment for virtual event broadcasting and archival purposes.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Book Auditorium',
        icon: 'calendar',
        action: '/contact?service=auditorium-booking',
        variant: 'primary'
      }
    }
  },

  // 3. Transport
  {
    title: 'Transport',
    slug: 'facilities/transport',
    componentName: 'TransportPage',
    sortOrder: 3,
    description: 'Comprehensive bus transport facilities connecting major locations with the campus',
    seo: {
      meta_title: 'Transport Facilities - JKKN College of Engineering',
      meta_description: 'Comprehensive bus transport services covering major routes in Namakkal and surrounding districts. Safe, comfortable, and punctual transportation for students.',
      og_title: 'Transport Services - JKKN Engineering College',
      og_description: 'Well-maintained bus fleet connecting students from various locations to the campus with regular schedules.',
      og_image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&h=630'
    },
    props: {
      facilityTitle: 'TRANSPORT FACILITIES',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">JKKN Engineering College provides comprehensive transportation facilities to ensure safe and comfortable travel for students from various locations. Our fleet of well-maintained buses covers major routes across Namakkal and surrounding districts.</p><p class="text-lg text-gray-700 leading-relaxed">All buses are equipped with GPS tracking systems, first-aid kits, and are driven by experienced drivers who prioritize student safety. The transport service operates on fixed schedules to ensure punctuality.</p>',
      busImages: [
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'
      ],
      routes: [
        {
          routeNumber: 'Route 1',
          from: 'Namakkal Town',
          to: 'JKKN Engineering College',
          stops: ['Bus Stand', 'Mohanur Road', 'Paramathi', 'College Junction'],
          timing: '7:00 AM - 6:30 PM',
          frequency: 'Every 30 minutes'
        },
        {
          routeNumber: 'Route 2',
          from: 'Salem',
          to: 'JKKN Engineering College',
          stops: ['Salem New Bus Stand', 'Attur', 'Namakkal', 'College'],
          timing: '6:30 AM - 7:00 PM',
          frequency: 'Every 45 minutes'
        },
        {
          routeNumber: 'Route 3',
          from: 'Rasipuram',
          to: 'JKKN Engineering College',
          stops: ['Rasipuram', 'Tiruchengode', 'Paramathi', 'College'],
          timing: '7:15 AM - 6:00 PM',
          frequency: 'Every 40 minutes'
        },
        {
          routeNumber: 'Route 4',
          from: 'Erode',
          to: 'JKKN Engineering College',
          stops: ['Erode', 'Kangayam', 'Namakkal', 'College Junction'],
          timing: '6:45 AM - 6:45 PM',
          frequency: 'Every 50 minutes'
        }
      ],
      features: [
        {
          title: 'GPS Tracking',
          description: 'Real-time bus tracking system for parents and students to monitor bus location and estimated arrival time.'
        },
        {
          title: 'Experienced Drivers',
          description: 'Professional drivers with clean driving records and extensive experience in student transportation.'
        },
        {
          title: 'Safety Features',
          description: 'First-aid kits, fire extinguishers, emergency exits, and CCTV cameras in all buses for student safety.'
        },
        {
          title: 'Comfortable Seating',
          description: 'Cushioned seats with adequate legroom and proper ventilation for a comfortable journey.'
        },
        {
          title: 'Regular Maintenance',
          description: 'All buses undergo regular servicing and maintenance checks to ensure reliability and safety.'
        },
        {
          title: 'Affordable Fares',
          description: 'Subsidized transport fees making it economical for students to commute daily.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Transport Inquiry',
        icon: 'bus',
        action: '/contact?service=transport',
        variant: 'primary'
      }
    }
  },

  // 4. Classroom
  {
    title: 'Classroom',
    slug: 'facilities/classroom',
    componentName: 'FacilityPage',
    sortOrder: 4,
    description: 'Modern smart classrooms with advanced teaching aids and comfortable learning environment',
    seo: {
      meta_title: 'Classroom Facilities - JKKN College of Engineering',
      meta_description: 'Modern smart classrooms equipped with interactive boards, projectors, and audio systems for enhanced learning experience at JKKN Engineering College.',
      og_title: 'Smart Classrooms - JKKN Engineering College',
      og_description: 'Technology-enabled classrooms designed for interactive and effective learning.',
      og_image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=630'
    },
    props: {
      facilityTitle: 'CLASSROOM FACILITIES',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">Our classrooms are designed to create an optimal learning environment with modern teaching aids and comfortable infrastructure. Each classroom is equipped with smart boards, high-quality projection systems, and excellent acoustics to enhance the educational experience.</p><p class="text-lg text-gray-700 leading-relaxed">With adequate natural lighting, proper ventilation, and ergonomic furniture, our classrooms ensure that students can focus on learning in a comfortable and conducive atmosphere.</p>',
      images: [
        'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'
      ],
      features: [
        {
          title: 'Smart Boards',
          description: 'Interactive digital boards enabling multimedia presentations, digital note-taking, and collaborative learning sessions.'
        },
        {
          title: 'Audio-Visual Systems',
          description: 'High-quality projectors, sound systems, and document cameras for effective delivery of course content.'
        },
        {
          title: 'Comfortable Seating',
          description: 'Ergonomic chairs and desks arranged for optimal viewing and note-taking comfort during long lectures.'
        },
        {
          title: 'Proper Lighting',
          description: 'LED lighting systems combined with natural light to reduce eye strain and create a pleasant learning atmosphere.'
        },
        {
          title: 'Climate Control',
          description: 'Air-conditioned classrooms maintaining comfortable temperature throughout the academic sessions.'
        },
        {
          title: 'Internet Connectivity',
          description: 'High-speed Wi-Fi access enabling online resources, virtual labs, and digital learning platforms.'
        }
      ]
    },
    fab: {
      is_enabled: false
    }
  },

  // 5. Food Court
  {
    title: 'Food Court',
    slug: 'facilities/food-court',
    componentName: 'FacilityPage',
    sortOrder: 5,
    description: 'Hygienic food court serving nutritious meals and snacks throughout the day',
    seo: {
      meta_title: 'Food Court - JKKN College of Engineering',
      meta_description: 'Hygienic food court offering nutritious meals, snacks, and beverages. Multiple cuisines, affordable prices, and clean dining environment.',
      og_title: 'Food Court Facilities - JKKN Engineering College',
      og_description: 'Spacious cafeteria serving quality food in a clean and comfortable environment.',
      og_image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200&h=630'
    },
    props: {
      facilityTitle: 'FOOD COURT',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">Our spacious food court provides a hygienic and comfortable dining experience for students and staff. Serving a variety of nutritious meals, snacks, and beverages throughout the day, the cafeteria ensures that healthy food options are always available on campus.</p><p class="text-lg text-gray-700 leading-relaxed">With multiple food counters offering different cuisines, affordable pricing, and a pleasant ambiance, the food court serves as a popular gathering spot for students between classes.</p>',
      images: [
        'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
      ],
      features: [
        {
          title: 'Hygienic Environment',
          description: 'Strictly maintained cleanliness standards with regular sanitization and proper food handling practices.'
        },
        {
          title: 'Nutritious Menu',
          description: 'Balanced meal options prepared by trained cooks using fresh ingredients and healthy cooking methods.'
        },
        {
          title: 'Multiple Cuisines',
          description: 'Variety of food options including South Indian, North Indian, Chinese, and continental dishes.'
        },
        {
          title: 'Affordable Pricing',
          description: 'Subsidized rates for students making quality food accessible and economical.'
        },
        {
          title: 'Spacious Seating',
          description: 'Comfortable dining area with adequate seating capacity for students to relax and socialize.'
        },
        {
          title: 'Extended Hours',
          description: 'Operating from early morning to evening, ensuring food availability throughout college hours.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'View Menu',
        icon: 'utensils',
        action: '/contact?service=cafeteria-menu',
        variant: 'primary'
      }
    }
  },

  // 6. Hostel
  {
    title: 'Hostel',
    slug: 'hostel',
    componentName: 'HostelPage',
    sortOrder: 6,
    description: 'Separate hostel facilities for boys and girls with modern amenities and 24/7 security',
    seo: {
      meta_title: 'Hostel Facilities - JKKN College of Engineering',
      meta_description: 'Separate hostel facilities for boys and girls with modern amenities, mess, recreation rooms, and round-the-clock security at JKKN Engineering College.',
      og_title: 'Hostel Accommodation - JKKN Engineering College',
      og_description: 'Safe and comfortable hostel facilities providing home away from home for students.',
      og_image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=630'
    },
    props: {
      pageTitle: 'Hostel',
      defaultTab: 'boys',
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff',
      boysHostel: {
        title: 'Boys Hostel',
        images: [
          { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', alt: 'Boys studying in hostel' },
          { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', alt: 'Hostel activities' },
          { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', alt: 'Student life' }
        ],
        paragraphs: [
          'Our hostel is located within the campus premises, making it an ideal choice for students who prefer a hassle-free commute to their classes. The hostel is well-maintained and equipped with all the necessary amenities to cater to your needs. We offer single and shared rooms that are spacious and well-ventilated, ensuring a comfortable living experience for our residents.',
          'At JKKN, we understand the importance of academics, and hence we provide an environment that is conducive to studying. Our hostel provides a peaceful and quiet atmosphere, enabling students to concentrate on their studies without any distractions. With our high-speed internet connectivity, students can easily access online resources and complete their academic assignments with ease.'
        ],
        highlights: [
          "JKKN Educational Institutions' Boys Hostel is a community where you can make lifelong friendships and memories.",
          "The hostel's dedicated staff is always available to assist you with any issues you may face during your stay.",
          'The Boys Hostel offers a comfortable and safe living experience for students.',
          'State-of-the-art facilities and amenities are available to ensure a memorable stay.',
          'Ideal for students looking for a supportive and conducive living environment during their academic journey.'
        ],
        warden: {
          name: 'Mr. Srinivasan',
          mobile: '+91 6374967302'
        }
      },
      girlsHostel: {
        title: 'Girls Hostel',
        images: [
          { src: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800', alt: 'Girls hostel room' },
          { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', alt: 'Common area' },
          { src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', alt: 'Study room' }
        ],
        paragraphs: [
          'Our Girls Hostel provides a safe, secure, and nurturing environment for female students. Located within the campus premises, it offers modern amenities and comfortable living spaces designed specifically for the needs of young women pursuing their education.',
          'With 24/7 security, CCTV surveillance, and dedicated female wardens, parents can be assured of their daughter\'s safety. The hostel features well-furnished rooms, hygienic mess facilities, recreation areas, and study rooms to support both academic excellence and personal well-being.'
        ],
        highlights: [
          'Enhanced security with CCTV surveillance, biometric access, and 24/7 security personnel.',
          'Comfortable rooms with modern furniture, attached bathrooms, and hot water facility.',
          'Specially designed nutritious menu focusing on health and balanced diet.',
          'Well-furnished common rooms for socializing, group studies, and recreational activities.',
          'In-house medical facility with first-aid and emergency medical care arrangements.'
        ],
        warden: {
          name: 'Mrs. Lakshmi',
          mobile: '+91 6374967303'
        }
      }
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Hostel Admission',
        icon: 'home',
        action: '/contact?service=hostel-admission',
        variant: 'primary'
      }
    }
  },

  // 7. Library
  {
    title: 'Library',
    slug: 'facilities/library',
    componentName: 'FacilityPage',
    sortOrder: 7,
    description: 'Central library with extensive collection of books, journals, and digital resources',
    seo: {
      meta_title: 'Library - JKKN College of Engineering',
      meta_description: 'Central library with 50,000+ books, e-journals, digital resources, and quiet study areas. Open access system for students and faculty.',
      og_title: 'Library Facilities - JKKN Engineering College',
      og_description: 'Comprehensive library resources supporting academic excellence and research activities.',
      og_image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=630'
    },
    props: {
      facilityTitle: 'LIBRARY',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">The JKKN Engineering College Central Library houses an extensive collection of over 50,000 books, national and international journals, magazines, and digital resources. The library follows an open access system, enabling students and faculty to browse and select books directly from shelves.</p><p class="text-lg text-gray-700 leading-relaxed">With dedicated reading rooms, digital library section, and subscription to major online databases, the library serves as the knowledge hub of the institution, supporting academic learning and research activities.</p>',
      images: [
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800'
      ],
      features: [
        {
          title: 'Extensive Collection',
          description: '50,000+ books covering engineering subjects, reference materials, competitive exam guides, and general reading.'
        },
        {
          title: 'Digital Library',
          description: 'Access to e-books, e-journals, IEEE Xplore, Springer, and other international online databases.'
        },
        {
          title: 'Reading Rooms',
          description: 'Spacious and quiet reading areas with comfortable seating for focused study and research work.'
        },
        {
          title: 'Open Access System',
          description: 'Freedom to browse shelves and select books independently, encouraging self-directed learning.'
        },
        {
          title: 'Digital Catalog',
          description: 'Online library management system for book search, availability check, and reservation.'
        },
        {
          title: 'Extended Hours',
          description: 'Library operates from early morning to late evening, accommodating student study schedules.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Search Catalog',
        icon: 'book-open',
        action: '/contact?service=library-catalog',
        variant: 'primary'
      }
    }
  },

  // 8. Seminar Hall
  {
    title: 'Seminar Hall',
    slug: 'facilities/seminar-hall',
    componentName: 'FacilityPage',
    sortOrder: 8,
    description: 'Multiple seminar halls equipped with modern presentation facilities for workshops and conferences',
    seo: {
      meta_title: 'Seminar Halls - JKKN College of Engineering',
      meta_description: 'Modern seminar halls with advanced AV equipment, comfortable seating, and air-conditioning for technical workshops and academic conferences.',
      og_title: 'Seminar Hall Facilities - JKKN Engineering College',
      og_description: 'Well-equipped seminar halls for hosting workshops, guest lectures, and department events.',
      og_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=630'
    },
    props: {
      facilityTitle: 'SEMINAR HALLS',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">JKKN Engineering College is equipped with multiple seminar halls designed to facilitate technical workshops, guest lectures, symposiums, and academic conferences. Each hall is fitted with modern presentation equipment and comfortable seating arrangements.</p><p class="text-lg text-gray-700 leading-relaxed">These venues regularly host industry experts, alumni, and academic professionals who share their knowledge and experience with students, enriching the learning ecosystem beyond regular classroom instruction.</p>',
      images: [
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
        'https://images.unsplash.com/photo-1559223607-a43c990c41ee?w=800'
      ],
      features: [
        {
          title: 'Multiple Halls',
          description: 'Several seminar halls with varying capacities (50-200 seats) to accommodate different event sizes.'
        },
        {
          title: 'Presentation Equipment',
          description: 'Projectors, screens, wireless presenters, laser pointers, and podiums for professional presentations.'
        },
        {
          title: 'Audio Systems',
          description: 'Quality sound systems with microphones, speakers, and recording capability for clear audio delivery.'
        },
        {
          title: 'Air-Conditioned',
          description: 'Climate-controlled environment ensuring comfort during extended sessions and workshops.'
        },
        {
          title: 'Internet Access',
          description: 'High-speed Wi-Fi enabling live demonstrations, online collaborations, and virtual participation.'
        },
        {
          title: 'Flexible Seating',
          description: 'Movable furniture allowing various seating arrangements for workshops, panel discussions, and group activities.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Book Seminar Hall',
        icon: 'presentation',
        action: '/contact?service=seminar-hall-booking',
        variant: 'primary'
      }
    }
  },

  // 9. Sports
  {
    title: 'Sports',
    slug: 'facilities/sports',
    componentName: 'FacilityPage',
    sortOrder: 9,
    description: 'Comprehensive sports facilities including indoor and outdoor courts for various games',
    seo: {
      meta_title: 'Sports Facilities - JKKN College of Engineering',
      meta_description: 'Comprehensive sports infrastructure including cricket, football, basketball, volleyball, badminton, and indoor games. Promoting fitness and sportsmanship.',
      og_title: 'Sports and Athletics - JKKN Engineering College',
      og_description: 'World-class sports facilities encouraging physical fitness and competitive spirit among students.',
      og_image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=630'
    },
    props: {
      facilityTitle: 'SPORTS FACILITIES',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">JKKN Engineering College believes in holistic development and provides excellent sports infrastructure to encourage physical fitness and competitive spirit among students. Our campus features both indoor and outdoor sports facilities for various games and athletic activities.</p><p class="text-lg text-gray-700 leading-relaxed">Regular inter-departmental tournaments, annual sports day, and participation in university-level competitions ensure that students have ample opportunities to showcase their athletic talents alongside their academic pursuits.</p>',
      images: [
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'
      ],
      features: [
        {
          title: 'Outdoor Facilities',
          description: 'Cricket ground, football field, basketball court, volleyball court, and athletic track for various sports.'
        },
        {
          title: 'Indoor Games',
          description: 'Badminton courts, table tennis, chess, carrom, and gymnasium with modern fitness equipment.'
        },
        {
          title: 'Qualified Coaches',
          description: 'Experienced sports coaches providing professional training and guidance for competitive sports.'
        },
        {
          title: 'Regular Tournaments',
          description: 'Inter-departmental competitions, annual sports day, and university-level tournament participation.'
        },
        {
          title: 'Fitness Center',
          description: 'Well-equipped gymnasium with cardio machines, weight training equipment, and yoga facilities.'
        },
        {
          title: 'Sports Equipment',
          description: 'Quality sports equipment and gear available for student use across all games and activities.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Sports Schedule',
        icon: 'trophy',
        action: '/contact?service=sports-info',
        variant: 'primary'
      }
    }
  },

  // 10. Wi-Fi Campus
  {
    title: 'Wi-Fi Campus',
    slug: 'facilities/wi-fi-campus',
    componentName: 'FacilityPage',
    sortOrder: 10,
    description: 'Campus-wide high-speed internet connectivity enabling digital learning and research',
    seo: {
      meta_title: 'Wi-Fi Campus - JKKN College of Engineering',
      meta_description: 'Campus-wide high-speed Wi-Fi connectivity with secure network, 24/7 availability, and access to online learning resources and digital libraries.',
      og_title: 'Wi-Fi Enabled Campus - JKKN Engineering College',
      og_description: 'Complete wireless network coverage across campus supporting digital education and research.',
      og_image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=630'
    },
    props: {
      facilityTitle: 'WI-FI CAMPUS',
      introduction: '<p class="text-lg text-gray-700 leading-relaxed mb-4">JKKN Engineering College provides campus-wide high-speed wireless internet connectivity, enabling students and faculty to access digital learning resources, online libraries, and educational platforms from anywhere on campus.</p><p class="text-lg text-gray-700 leading-relaxed">The robust network infrastructure supports thousands of concurrent users, ensuring seamless connectivity for academic activities, research work, and collaborative projects. Secure authentication ensures safe internet usage for the college community.</p>',
      images: [
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800'
      ],
      features: [
        {
          title: 'Complete Coverage',
          description: 'Wi-Fi access points distributed across classrooms, labs, library, hostels, and common areas for uninterrupted connectivity.'
        },
        {
          title: 'High-Speed Internet',
          description: 'Dedicated high-bandwidth internet leased line ensuring fast download and upload speeds for all users.'
        },
        {
          title: 'Secure Network',
          description: 'WPA2 enterprise authentication, firewall protection, and content filtering for safe internet access.'
        },
        {
          title: '24/7 Availability',
          description: 'Round-the-clock network uptime with redundant connections and backup systems for maximum availability.'
        },
        {
          title: 'Digital Resources',
          description: 'Access to e-learning platforms, online journals, IEEE Xplore, virtual labs, and cloud-based applications.'
        },
        {
          title: 'Technical Support',
          description: 'Dedicated IT support team for troubleshooting network issues and assisting with connectivity problems.'
        }
      ]
    },
    fab: {
      is_enabled: true,
      primary_action: {
        label: 'Wi-Fi Support',
        icon: 'wifi',
        action: '/contact?service=wifi-support',
        variant: 'primary'
      }
    }
  }
]

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(emoji: string, message: string, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`)
}

function error(emoji: string, message: string) {
  console.error(`${colors.red}${emoji} ${message}${colors.reset}`)
}

function success(emoji: string, message: string) {
  console.log(`${colors.green}${emoji} ${message}${colors.reset}`)
}

async function rollbackFacilitiesPages() {
  log('🔄', 'Starting rollback of facilities pages...', colors.cyan)

  // Validate environment
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    error('❌', 'Missing Supabase environment variables')
    error('💡', 'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // Find facilities pages
  log('🔍', 'Finding facilities pages...')
  const { data: pages, error: findError } = await supabase
    .from('cms_pages')
    .select('id, title')
    .eq('parent_id', PARENT_PAGE_ID)

  if (findError) {
    error('❌', `Failed to find pages: ${findError.message}`)
    process.exit(1)
  }

  if (!pages || pages.length === 0) {
    error('⚠️', 'No facilities pages found to rollback')
    process.exit(0)
  }

  log('📄', `Found ${pages.length} facilities pages to delete`)
  pages.forEach(page => log('  ├─', page.title, colors.blue))
  console.log('')

  // Delete all facilities pages (cascading deletes will handle blocks, SEO, FAB)
  const { error: deleteError } = await supabase
    .from('cms_pages')
    .delete()
    .eq('parent_id', PARENT_PAGE_ID)

  if (deleteError) {
    error('❌', `Failed to rollback: ${deleteError.message}`)
    process.exit(1)
  }

  success('✅', 'All facilities pages deleted successfully')
  log('🗑️', 'Related blocks, SEO metadata, and FAB configs also removed (cascading delete)')
  console.log('')
}

async function publishFacilitiesPages() {
  log('🚀', 'Starting Facilities Pages Publishing Script', colors.bright)
  log('📋', `Creating ${FACILITIES.length} facilities pages`, colors.cyan)
  log('🏛️', `Parent Page ID: ${PARENT_PAGE_ID}`, colors.cyan)
  console.log('')

  // Step 1: Validate environment
  log('🔍', 'Step 1: Validating environment...', colors.cyan)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    error('❌', 'Missing Supabase environment variables')
    error('💡', 'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    error('💡', 'Run: npm run dev:engineering')
    process.exit(1)
  }

  success('✅', 'Environment variables found')
  console.log('')

  // Step 2: Create Supabase client
  log('🔧', 'Step 2: Creating Supabase admin client...', colors.cyan)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  success('✅', 'Supabase client created')
  console.log('')

  // Step 3: Verify parent page exists
  log('🏠', 'Step 3: Verifying parent "Facilities" page...', colors.cyan)

  const { data: parentPage, error: parentError } = await supabase
    .from('cms_pages')
    .select('id, title')
    .eq('id', PARENT_PAGE_ID)
    .single()

  if (parentError || !parentPage) {
    error('❌', 'Parent "Facilities" page not found')
    error('💡', `Expected page ID: ${PARENT_PAGE_ID}`)
    error('💡', 'Make sure the Facilities page exists in cms_pages table')
    process.exit(1)
  }

  success('✅', `Parent page found: "${parentPage.title}"`)
  console.log('')

  // Step 4: Get creator user
  log('👤', 'Step 4: Getting creator user...', colors.cyan)

  const { data: users } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single()

  const creatorId = users?.id || '00000000-0000-0000-0000-000000000000'

  log('✓', `Using creator ID: ${creatorId}`, colors.blue)
  console.log('')

  // Step 5: Create pages with blocks, SEO, and FAB
  log('📝', `Step 5: Creating ${FACILITIES.length} facilities pages...`, colors.cyan)
  console.log('')

  let successCount = 0
  let failureCount = 0

  for (const facility of FACILITIES) {
    try {
      log('🏗️', `Creating: ${facility.title}`, colors.bright)

      // Create page
      const pageId = uuidv4()
      const { error: pageError } = await supabase
        .from('cms_pages')
        .insert({
          id: pageId,
          title: facility.title,
          slug: facility.slug,
          description: facility.description,
          parent_id: PARENT_PAGE_ID,
          status: 'published',
          visibility: 'public',
          show_in_navigation: true,
          sort_order: facility.sortOrder,
          created_by: creatorId,
          updated_by: creatorId,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (pageError) {
        throw new Error(`Page creation failed: ${pageError.message}`)
      }

      // Create block
      const { error: blockError } = await supabase
        .from('cms_page_blocks')
        .insert({
          id: uuidv4(),
          page_id: pageId,
          component_name: facility.componentName,
          props: facility.props,
          sort_order: 1,
          is_visible: true,
        })

      if (blockError) {
        throw new Error(`Block creation failed: ${blockError.message}`)
      }

      // Create SEO metadata
      const { error: seoError } = await supabase
        .from('cms_seo_metadata')
        .insert({
          id: uuidv4(),
          page_id: pageId,
          meta_title: facility.seo.meta_title,
          meta_description: facility.seo.meta_description,
          og_title: facility.seo.og_title,
          og_description: facility.seo.og_description,
          og_image: facility.seo.og_image,
          twitter_card: 'summary_large_image',
          canonical_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${facility.slug}`,
        })

      if (seoError) {
        log('  ⚠️', `SEO metadata warning: ${seoError.message}`, colors.yellow)
      }

      // Create FAB config
      const { error: fabError } = await supabase
        .from('cms_page_fab_config')
        .insert({
          id: uuidv4(),
          page_id: pageId,
          is_enabled: facility.fab.is_enabled,
          primary_action: facility.fab.primary_action || null,
          secondary_actions: facility.fab.secondary_actions || null,
          position: 'bottom-right',
        })

      if (fabError) {
        log('  ⚠️', `FAB config warning: ${fabError.message}`, colors.yellow)
      }

      success('  ✅', `${facility.title} created successfully`)
      log('  ├─', `Slug: ${facility.slug}`, colors.blue)
      log('  ├─', `Component: ${facility.componentName}`, colors.blue)
      log('  └─', `Sort Order: ${facility.sortOrder}`, colors.blue)
      console.log('')

      successCount++
    } catch (err: any) {
      error('  ❌', `Failed to create ${facility.title}`)
      error('  └─', err.message)
      console.log('')
      failureCount++
    }
  }

  // Step 6: Summary
  console.log('')
  log('📊', 'Step 6: Publishing Summary', colors.cyan)
  log('  ├─', `Total facilities: ${FACILITIES.length}`)
  log('  ├─', `Successful: ${successCount}`, colors.green)
  log('  └─', `Failed: ${failureCount}`, failureCount > 0 ? colors.red : colors.blue)
  console.log('')

  if (successCount === FACILITIES.length) {
    success('🎉', 'All facilities pages published successfully!')
  } else {
    log('⚠️', 'Some pages failed to publish', colors.yellow)
  }

  // Step 7: Verification
  log('✔️', 'Step 7: Verification...', colors.cyan)

  const { data: verifyPages, error: verifyError } = await supabase
    .from('cms_pages')
    .select('id, title, slug, status')
    .eq('parent_id', PARENT_PAGE_ID)
    .order('sort_order', { ascending: true })

  if (verifyError || !verifyPages) {
    error('❌', 'Verification failed')
  } else {
    success('✅', `Verified ${verifyPages.length} pages in database`)
    console.log('')
    verifyPages.forEach((page, i) => {
      log(`  ${i + 1}.`, `${page.title} (${page.status})`, colors.blue)
    })
  }

  console.log('')
  console.log('')
  log('🌐', 'Pages are now live at:', colors.bright)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  FACILITIES.forEach(f => {
    log('  ├─', `${baseUrl}/${f.slug}`, colors.cyan)
  })
  console.log('')
  log('📋', 'Next steps:', colors.bright)
  log('  1.', 'Visit each page to verify rendering')
  log('  2.', 'Check FACILITIES dropdown menu shows all 10 items')
  log('  3.', 'Test navigation links work correctly')
  log('  4.', 'Replace placeholder images with real facility photos')
  log('  5.', 'Customize content as needed')
  console.log('')
  log('💡', 'To rollback:', colors.yellow)
  log('  └─', 'npx tsx scripts/publish-facilities-pages.ts --rollback', colors.yellow)
  console.log('')
}

// Main execution
async function main() {
  try {
    if (isRollback) {
      await rollbackFacilitiesPages()
    } else {
      await publishFacilitiesPages()
    }
  } catch (err) {
    error('💥', 'Fatal error occurred')
    console.error(err)
    process.exit(1)
  }
}

main()
