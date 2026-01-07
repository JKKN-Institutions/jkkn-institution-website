import type { GlobalTemplate } from '../types'

/**
 * Homepage Hero Template
 *
 * A modern landing page template with:
 * - Full-screen hero section with background image
 * - Call-to-action buttons
 * - Features/services section with icons
 * - Statistics counter
 * - Testimonials carousel
 *
 * Usage: Ideal for institutional homepages and landing pages
 */
const homepageHeroTemplate: GlobalTemplate = {
  id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  slug: 'global-homepage-hero',
  name: 'Homepage with Hero Section',
  description:
    'Modern landing page template with full-screen hero, call-to-action, features section, stats, and testimonials. Perfect for institutional homepages.',
  thumbnail_url: '/templates/homepage-hero-preview.jpg',
  category: 'landing',
  is_system: false,
  source: 'global',
  version: '2026-01-07',
  origin_institution: 'main',
  last_updated: '2026-01-07T00:00:00Z',
  author: {
    name: 'JKKN Institutions',
    email: 'admin@jkkn.ac.in',
  },
  tags: ['homepage', 'landing', 'hero', 'modern', 'institutional'],
  usage_notes:
    'Replace background images, text content, and statistics with institution-specific data. Customize colors using custom_classes.',
  default_blocks: [
    // Block 1: Hero Section
    {
      id: '10000000-0000-0000-0000-000000000001',
      component_name: 'HeroSection',
      sort_order: 1,
      parent_block_id: null,
      is_visible: true,
      props: {
        title: 'Welcome to JKKN Institution',
        subtitle: 'Empowering Excellence in Education Since 1985',
        backgroundImage: '/images/campus-hero.jpg',
        ctaButtons: [
          {
            label: 'Explore Programs',
            link: '/programs',
            variant: 'primary',
          },
          {
            label: 'Virtual Tour',
            link: '/tour',
            variant: 'secondary',
          },
        ],
        height: 'full', // full screen height
        overlay: true, // dark overlay for text readability
        overlayOpacity: 0.5,
        textAlign: 'center',
        animation: 'fade-in',
      },
      custom_classes: 'hero-section',
    },

    // Block 2: Features Grid Section
    {
      id: '10000000-0000-0000-0000-000000000002',
      component_name: 'SectionWrapper',
      sort_order: 2,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Why Choose Us',
        subheading: 'Discover what makes JKKN Institutions stand out',
        backgroundColor: 'white',
        padding: 'large',
      },
    },

    // Block 3: Features Grid (child of Section Wrapper)
    {
      id: '10000000-0000-0000-0000-000000000003',
      component_name: 'GridLayout',
      sort_order: 1,
      parent_block_id: '10000000-0000-0000-0000-000000000002',
      is_visible: true,
      props: {
        columns: 3,
        gap: 'large',
        items: [
          {
            icon: 'GraduationCap',
            title: 'World-Class Education',
            description:
              'Comprehensive programs designed to shape future leaders and innovators.',
          },
          {
            icon: 'Users',
            title: 'Expert Faculty',
            description:
              'Learn from industry experts and accomplished academicians with decades of experience.',
          },
          {
            icon: 'Building',
            title: 'Modern Infrastructure',
            description:
              'State-of-the-art facilities, laboratories, and learning spaces for holistic development.',
          },
          {
            icon: 'Award',
            title: 'Industry Recognition',
            description:
              'Accredited programs and partnerships with leading organizations worldwide.',
          },
          {
            icon: 'Globe',
            title: 'Global Opportunities',
            description:
              'International collaborations, exchange programs, and placement support.',
          },
          {
            icon: 'Lightbulb',
            title: 'Innovation Hub',
            description:
              'Cutting-edge research facilities and incubation centers for entrepreneurship.',
          },
        ],
      },
      responsive_settings: {
        mobile: { columns: 1 },
        tablet: { columns: 2 },
      },
    },

    // Block 4: Statistics Counter Section
    {
      id: '10000000-0000-0000-0000-000000000004',
      component_name: 'SectionWrapper',
      sort_order: 3,
      parent_block_id: null,
      is_visible: true,
      props: {
        backgroundColor: 'primary',
        padding: 'large',
        textColor: 'white',
      },
      custom_classes: 'stats-section',
    },

    // Block 5: Stats Counter (child of Section Wrapper)
    {
      id: '10000000-0000-0000-0000-000000000005',
      component_name: 'StatsCounter',
      sort_order: 1,
      parent_block_id: '10000000-0000-0000-0000-000000000004',
      is_visible: true,
      props: {
        stats: [
          {
            value: 10000,
            suffix: '+',
            label: 'Students Enrolled',
            icon: 'Users',
          },
          {
            value: 500,
            suffix: '+',
            label: 'Faculty Members',
            icon: 'UserCheck',
          },
          {
            value: 50,
            suffix: '+',
            label: 'Programs Offered',
            icon: 'BookOpen',
          },
          {
            value: 95,
            suffix: '%',
            label: 'Placement Rate',
            icon: 'TrendingUp',
          },
        ],
        animateOnScroll: true,
        duration: 2000,
      },
    },

    // Block 6: Testimonials Section
    {
      id: '10000000-0000-0000-0000-000000000006',
      component_name: 'SectionWrapper',
      sort_order: 4,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'What Our Students Say',
        subheading: 'Hear from our alumni and current students',
        backgroundColor: 'gray-50',
        padding: 'large',
      },
    },

    // Block 7: Testimonials Carousel (child of Section Wrapper)
    {
      id: '10000000-0000-0000-0000-000000000007',
      component_name: 'Testimonials',
      sort_order: 1,
      parent_block_id: '10000000-0000-0000-0000-000000000006',
      is_visible: true,
      props: {
        testimonials: [
          {
            id: 1,
            name: 'Priya Sharma',
            role: 'B.Tech Computer Science, Class of 2023',
            content:
              'JKKN provided me with not just education, but real-world skills and opportunities. The faculty support and industry connections helped me land my dream job at a leading tech company.',
            rating: 5,
            avatar: '/images/testimonials/student-1.jpg',
          },
          {
            id: 2,
            name: 'Rajesh Kumar',
            role: 'MBA Graduate, Class of 2022',
            content:
              'The holistic approach to education, combined with state-of-the-art infrastructure and mentorship, transformed my career trajectory. Forever grateful to JKKN.',
            rating: 5,
            avatar: '/images/testimonials/student-2.jpg',
          },
          {
            id: 3,
            name: 'Anita Desai',
            role: 'Pharmacy Graduate, Class of 2024',
            content:
              'The hands-on learning experience, modern laboratories, and dedicated faculty made my journey at JKKN unforgettable. I feel confident and prepared for my professional career.',
            rating: 5,
            avatar: '/images/testimonials/student-3.jpg',
          },
        ],
        autoplay: true,
        interval: 5000,
        showArrows: true,
        showDots: true,
      },
    },

    // Block 8: Call-to-Action Section
    {
      id: '10000000-0000-0000-0000-000000000008',
      component_name: 'CallToAction',
      sort_order: 5,
      parent_block_id: null,
      is_visible: true,
      props: {
        heading: 'Ready to Begin Your Journey?',
        description:
          'Join thousands of students who have transformed their lives at JKKN Institutions. Apply now for the upcoming academic year.',
        primaryButton: {
          label: 'Apply Now',
          link: '/admissions/apply',
        },
        secondaryButton: {
          label: 'Download Prospectus',
          link: '/downloads/prospectus.pdf',
        },
        backgroundColor: 'primary',
        textColor: 'white',
        backgroundImage: '/images/campus-cta.jpg',
        overlay: true,
      },
      custom_classes: 'cta-section',
    },
  ],
}

export default homepageHeroTemplate
