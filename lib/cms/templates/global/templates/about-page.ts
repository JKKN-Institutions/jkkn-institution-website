import type { GlobalTemplate } from '../types'

/**
 * About Page Template
 *
 * A comprehensive about page template with:
 * - Page header with banner image
 * - Mission, Vision, Values sections
 * - History timeline
 * - Leadership team grid
 * - Campus facilities gallery
 *
 * Usage: Ideal for institutional about/overview pages
 */
const aboutPageTemplate: GlobalTemplate = {
  id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  slug: 'global-about-page',
  name: 'About Page',
  description:
    'Comprehensive about page template with mission/vision, history timeline, leadership team, and facilities gallery. Perfect for institutional overview pages.',
  thumbnail_url: null,
  category: 'content',
  is_system: false,
  source: 'global',
  version: '2026-01-07',
  origin_institution: 'main',
  last_updated: '2026-01-07T00:00:00Z',
  author: {
    name: 'JKKN Institutions',
    email: 'admin@jkkn.ac.in',
  },
  tags: ['about', 'overview', 'institutional', 'content'],
  usage_notes:
    'Customize text content, timeline events, team members, and images for your institution. Sections can be reordered or hidden as needed.',
  default_blocks: [
    // Block 1: Page Header Banner
    {
      id: '20000000-0000-0000-0000-000000000001',
      component_name: 'ImageBlock',
      sort_order: 1,
      parent_block_id: null,
      is_visible: true,
      props: {
        src: '/images/about-banner.jpg',
        alt: 'About JKKN Institutions',
        width: '100%',
        height: 400,
        objectFit: 'cover',
        overlay: true,
        overlayContent: {
          heading: 'About Us',
          subheading: 'Shaping Futures, Building Excellence',
        },
      },
      custom_classes: 'page-banner',
    },

    // Block 2: Breadcrumbs Navigation
    {
      id: '20000000-0000-0000-0000-000000000002',
      component_name: 'Container',
      sort_order: 2,
      parent_block_id: null,
      is_visible: true,
      props: {
        maxWidth: '7xl',
        padding: 'medium',
      },
    },

    // Block 3: Introduction Section
    {
      id: '20000000-0000-0000-0000-000000000003',
      component_name: 'SectionWrapper',
      sort_order: 3,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Our Story',
        backgroundColor: 'white',
        padding: 'large',
      },
    },

    // Block 4: Introduction Text
    {
      id: '20000000-0000-0000-0000-000000000004',
      component_name: 'TextEditor',
      sort_order: 1,
      parent_block_id: '20000000-0000-0000-0000-000000000003',
      is_visible: true,
      props: {
        content: `
          <p class="text-lg text-gray-700 mb-4">
            Founded in 1985, JKKN Institutions has been a beacon of educational excellence for over three decades.
            What started as a vision to provide quality education has grown into a multi-disciplinary educational hub
            serving thousands of students across various fields.
          </p>
          <p class="text-gray-600 mb-4">
            Our journey is marked by continuous innovation, unwavering commitment to academic excellence, and a
            student-centric approach that has produced leaders, innovators, and change-makers across the globe.
          </p>
          <p class="text-gray-600">
            Today, we stand as a testament to the power of education in transforming lives and shaping futures,
            with state-of-the-art infrastructure, world-class faculty, and a legacy of excellence.
          </p>
        `,
      },
    },

    // Block 5: Mission, Vision, Values Grid Section
    {
      id: '20000000-0000-0000-0000-000000000005',
      component_name: 'SectionWrapper',
      sort_order: 4,
      parent_block_id: null,
      is_visible: true,
      props: {
        backgroundColor: 'gray-50',
        padding: 'large',
      },
    },

    // Block 6: MVV Grid
    {
      id: '20000000-0000-0000-0000-000000000006',
      component_name: 'GridLayout',
      sort_order: 1,
      parent_block_id: '20000000-0000-0000-0000-000000000005',
      is_visible: true,
      props: {
        columns: 3,
        gap: 'large',
        items: [
          {
            icon: 'Target',
            title: 'Our Mission',
            description:
              'To provide accessible, affordable, and quality education that empowers students with knowledge, skills, and values to excel in their chosen fields and contribute positively to society.',
            iconColor: 'primary',
          },
          {
            icon: 'Eye',
            title: 'Our Vision',
            description:
              'To be a globally recognized center of excellence in education, research, and innovation, nurturing future leaders who drive progress and transformation in their communities.',
            iconColor: 'secondary',
          },
          {
            icon: 'Heart',
            title: 'Our Values',
            description:
              'Integrity, Excellence, Innovation, Inclusivity, and Social Responsibility. These core values guide every aspect of our institution and shape the character of our students.',
            iconColor: 'accent',
          },
        ],
      },
      responsive_settings: {
        mobile: { columns: 1 },
        tablet: { columns: 1 },
      },
    },

    // Block 7: History Timeline Section
    {
      id: '20000000-0000-0000-0000-000000000007',
      component_name: 'SectionWrapper',
      sort_order: 5,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Our Journey',
        subheading: 'Milestones that shaped our institution',
        backgroundColor: 'white',
        padding: 'large',
      },
    },

    // Block 8: Timeline Component
    {
      id: '20000000-0000-0000-0000-000000000008',
      component_name: 'AdmissionProcessTimeline',
      sort_order: 1,
      parent_block_id: '20000000-0000-0000-0000-000000000007',
      is_visible: true,
      props: {
        steps: [
          {
            year: '1985',
            title: 'Foundation',
            description:
              'JKKN Institutions established with a vision to provide quality education to rural and semi-urban students.',
            icon: 'Flag',
          },
          {
            year: '1995',
            title: 'First Accreditation',
            description:
              'Received NAAC accreditation with A grade, marking a decade of educational excellence.',
            icon: 'Award',
          },
          {
            year: '2005',
            title: 'Expansion',
            description:
              'Expanded to include multiple disciplines: Engineering, Arts & Science, and Pharmacy colleges.',
            icon: 'Building',
          },
          {
            year: '2015',
            title: 'Autonomous Status',
            description:
              'Granted autonomous status, enabling curriculum innovation and academic flexibility.',
            icon: 'Star',
          },
          {
            year: '2020',
            title: 'Digital Transformation',
            description:
              'Completed digital transformation with smart classrooms, online learning platforms, and virtual labs.',
            icon: 'Laptop',
          },
          {
            year: '2025',
            title: 'Global Recognition',
            description:
              'Achieved international collaborations and rankings, establishing JKKN as a globally recognized institution.',
            icon: 'Globe',
          },
        ],
        orientation: 'vertical',
        alternating: false,
      },
    },

    // Block 9: Leadership Team Section
    {
      id: '20000000-0000-0000-0000-000000000009',
      component_name: 'SectionWrapper',
      sort_order: 6,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Leadership Team',
        subheading: 'Meet the visionaries guiding our institution',
        backgroundColor: 'gray-50',
        padding: 'large',
      },
    },

    // Block 10: Faculty/Leadership Grid
    {
      id: '20000000-0000-0000-0000-000000000010',
      component_name: 'FacultyDirectory',
      sort_order: 1,
      parent_block_id: '20000000-0000-0000-0000-000000000009',
      is_visible: true,
      props: {
        faculty: [
          {
            id: 1,
            name: 'Dr. J.K.K. Natarajan',
            designation: 'Founder & Chairman',
            department: 'Administration',
            image: '/images/leadership/chairman.jpg',
            qualifications: 'Ph.D., D.Sc. (Hon.)',
          },
          {
            id: 2,
            name: 'Dr. N. Sendil Kumar',
            designation: 'Principal',
            department: 'Administration',
            image: '/images/leadership/principal.jpg',
            qualifications: 'Ph.D., M.Tech',
          },
          {
            id: 3,
            name: 'Dr. R. Lakshmi',
            designation: 'Vice Principal (Academic)',
            department: 'Administration',
            image: '/images/leadership/vice-principal-academic.jpg',
            qualifications: 'Ph.D., M.Sc',
          },
          {
            id: 4,
            name: 'Prof. K. Rajendran',
            designation: 'Vice Principal (Administration)',
            department: 'Administration',
            image: '/images/leadership/vice-principal-admin.jpg',
            qualifications: 'M.E., MBA',
          },
        ],
        columns: 4,
        showBio: false,
        showContact: false,
      },
      responsive_settings: {
        mobile: { columns: 1 },
        tablet: { columns: 2 },
      },
    },

    // Block 11: Campus Facilities Section
    {
      id: '20000000-0000-0000-0000-000000000011',
      component_name: 'SectionWrapper',
      sort_order: 7,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Campus Facilities',
        subheading: 'Explore our world-class infrastructure',
        backgroundColor: 'white',
        padding: 'large',
      },
    },

    // Block 12: Facilities Image Gallery
    {
      id: '20000000-0000-0000-0000-000000000012',
      component_name: 'ImageGallery',
      sort_order: 1,
      parent_block_id: '20000000-0000-0000-0000-000000000011',
      is_visible: true,
      props: {
        images: [
          {
            src: '/images/facilities/library.jpg',
            alt: 'Central Library',
            caption: 'State-of-the-art library with 50,000+ books and digital resources',
          },
          {
            src: '/images/facilities/lab.jpg',
            alt: 'Research Laboratory',
            caption: 'Advanced research labs with cutting-edge equipment',
          },
          {
            src: '/images/facilities/auditorium.jpg',
            alt: 'Auditorium',
            caption: '1000-seater air-conditioned auditorium',
          },
          {
            src: '/images/facilities/sports.jpg',
            alt: 'Sports Complex',
            caption: 'Olympic-size swimming pool and multi-sport complex',
          },
          {
            src: '/images/facilities/hostel.jpg',
            alt: 'Hostel',
            caption: 'Separate hostels for boys and girls with modern amenities',
          },
          {
            src: '/images/facilities/cafeteria.jpg',
            alt: 'Cafeteria',
            caption: 'Hygienic cafeteria serving nutritious meals',
          },
        ],
        layout: 'grid',
        columns: 3,
        lightbox: true,
        showCaptions: true,
      },
      responsive_settings: {
        mobile: { columns: 1 },
        tablet: { columns: 2 },
      },
    },
  ],
}

export default aboutPageTemplate
