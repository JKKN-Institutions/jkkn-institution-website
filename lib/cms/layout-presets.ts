/**
 * Layout Presets for Non-Technical Users
 *
 * These presets provide ready-to-use page sections that can be quickly added
 * to a page. Each preset is a collection of pre-configured blocks.
 */

import type { BlockData } from './registry-types'

export type PresetCategory = 'hero' | 'content' | 'features' | 'testimonials' | 'cta' | 'gallery' | 'data' | 'contact'

// Block data for presets - using simpler types that don't require null
interface PresetBlockData {
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  parent_block_id?: string
  is_visible: boolean
  responsive_settings?: Record<string, unknown>
  custom_css?: string
  custom_classes?: string
}

export interface LayoutPreset {
  id: string
  name: string
  description: string
  category: PresetCategory
  icon: string // Lucide icon name
  thumbnail?: string
  blocks: PresetBlockData[]
}

// Helper to generate unique IDs
const generateId = () => `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const LAYOUT_PRESETS: LayoutPreset[] = [
  // ============================================
  // HERO PRESETS
  // ============================================
  {
    id: 'hero-standard',
    name: 'Hero with CTA',
    description: 'Full-height hero section with title, subtitle, and call-to-action buttons',
    category: 'hero',
    icon: 'Layout',
    blocks: [
      {
        component_name: 'HeroSection',
        props: {
          title: 'Welcome to JKKN Institution',
          subtitle: 'Excellence in Education, Innovation in Learning',
          backgroundImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920',
          overlay: true,
          overlayOpacity: 0.5,
          height: 'full',
          alignment: 'center',
          ctaButtons: [
            { label: 'Apply Now', link: '/apply', variant: 'primary' },
            { label: 'Learn More', link: '#about', variant: 'secondary' }
          ]
        },
        sort_order: 0,
        is_visible: true
      }
    ]
  },
  {
    id: 'hero-split',
    name: 'Split Hero',
    description: 'Two-column hero with text on left and image on right',
    category: 'hero',
    icon: 'Columns',
    blocks: [
      {
        component_name: 'FlexboxLayout',
        props: {
          direction: 'row',
          justify: 'between',
          align: 'center',
          gap: 0,
          wrap: false
        },
        sort_order: 0,
        is_visible: true,
        custom_classes: 'min-h-[80vh]'
      }
    ]
  },

  // ============================================
  // FEATURES PRESETS
  // ============================================
  {
    id: 'features-3col',
    name: 'Features Grid (3 Columns)',
    description: 'Three-column grid showcasing key features with icons',
    category: 'features',
    icon: 'Grid3X3',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#f8f9fa',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Why Choose Us',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true
      },
      {
        component_name: 'TextEditor',
        props: {
          content: '<p style="text-align: center; color: #6b7280;">Discover what makes our institution stand out from the rest.</p>',
          alignment: 'center',
          maxWidth: '600px'
        },
        sort_order: 2,
        is_visible: true,
        custom_classes: 'mx-auto mb-12'
      },
      {
        component_name: 'GridLayout',
        props: {
          columns: 3,
          gap: 32
        },
        sort_order: 3,
        is_visible: true,
        responsive_settings: {
          tablet: { columns: 2 },
          mobile: { columns: 1 }
        },
        custom_classes: 'max-w-6xl mx-auto px-10'
      }
    ]
  },

  // ============================================
  // STATS PRESETS
  // ============================================
  {
    id: 'stats-bar',
    name: 'Stats Counter Bar',
    description: 'Animated statistics with icons showing key achievements',
    category: 'data',
    icon: 'BarChart3',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: 'linear-gradient(135deg, #0b6d41 0%, #085032 100%)',
          padding: '60',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'StatsCounter',
        props: {
          layout: 'row',
          animate: true,
          stats: [
            { value: 5000, suffix: '+', label: 'Students Enrolled', icon: 'users' },
            { value: 50, suffix: '+', label: 'Programs Offered', icon: 'book-open' },
            { value: 95, suffix: '%', label: 'Placement Rate', icon: 'briefcase' },
            { value: 30, suffix: '+', label: 'Years of Excellence', icon: 'award' }
          ]
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'text-white'
      }
    ]
  },

  // ============================================
  // TESTIMONIALS PRESETS
  // ============================================
  {
    id: 'testimonials-carousel',
    name: 'Testimonials Carousel',
    description: 'Auto-rotating carousel of student/parent testimonials',
    category: 'testimonials',
    icon: 'MessageSquareQuote',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#ffffff',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'What Our Students Say',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-12'
      },
      {
        component_name: 'Testimonials',
        props: {
          layout: 'carousel',
          autoplay: true,
          autoplayInterval: 5000,
          showRating: true,
          items: [
            {
              quote: 'JKKN provided me with the best learning experience. The faculty is exceptional and the campus life is amazing.',
              author: 'Priya Sharma',
              role: 'B.Tech Graduate, 2023',
              avatar: undefined,
              rating: 5
            },
            {
              quote: 'The practical exposure and industry connections helped me land my dream job right after graduation.',
              author: 'Rahul Kumar',
              role: 'MBA Graduate, 2022',
              avatar: undefined,
              rating: 5
            },
            {
              quote: 'World-class infrastructure and supportive environment made my academic journey memorable.',
              author: 'Anitha Devi',
              role: 'M.Sc Graduate, 2023',
              avatar: undefined,
              rating: 5
            }
          ]
        },
        sort_order: 2,
        is_visible: true,
        custom_classes: 'max-w-4xl mx-auto px-4'
      }
    ]
  },

  // ============================================
  // FAQ PRESETS
  // ============================================
  {
    id: 'faq-section',
    name: 'FAQ Accordion',
    description: 'Expandable FAQ section with search functionality',
    category: 'content',
    icon: 'HelpCircle',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#f8f9fa',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Frequently Asked Questions',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-12'
      },
      {
        component_name: 'FAQAccordion',
        props: {
          showSearch: true,
          allowMultiple: false,
          items: [
            {
              question: 'What programs do you offer?',
              answer: 'We offer a wide range of undergraduate, postgraduate, and doctoral programs across engineering, management, pharmacy, nursing, and allied health sciences.'
            },
            {
              question: 'How can I apply for admission?',
              answer: 'You can apply online through our admissions portal or visit our campus for direct admission. Our admission counselors are available to guide you through the process.'
            },
            {
              question: 'Are scholarships available?',
              answer: 'Yes, we offer merit-based and need-based scholarships. Sports and cultural achievers are also eligible for special scholarships.'
            },
            {
              question: 'What is the campus placement record?',
              answer: 'We have a strong placement cell with over 95% placement rate. Top companies like TCS, Infosys, Wipro, and many more recruit from our campus.'
            },
            {
              question: 'Is hostel accommodation available?',
              answer: 'Yes, we have separate hostel facilities for boys and girls with all modern amenities including WiFi, gym, and recreational areas.'
            }
          ]
        },
        sort_order: 2,
        is_visible: true,
        custom_classes: 'max-w-3xl mx-auto px-4'
      }
    ]
  },

  // ============================================
  // CTA PRESETS
  // ============================================
  {
    id: 'cta-banner',
    name: 'CTA Banner',
    description: 'Full-width call-to-action banner with gradient background',
    category: 'cta',
    icon: 'Megaphone',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: 'linear-gradient(135deg, #0b6d41 0%, #085032 50%, #0b6d41 100%)',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'CallToAction',
        props: {
          title: 'Ready to Start Your Journey?',
          description: 'Join thousands of students who have transformed their careers with us. Applications for the new academic year are now open.',
          variant: 'centered',
          buttons: [
            { label: 'Apply Now', link: '/apply', variant: 'primary' },
            { label: 'Contact Us', link: '/contact', variant: 'secondary' }
          ]
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'text-white max-w-3xl mx-auto text-center px-4'
      }
    ]
  },

  // ============================================
  // GALLERY PRESETS
  // ============================================
  {
    id: 'image-gallery',
    name: 'Image Gallery Grid',
    description: 'Responsive image gallery with lightbox',
    category: 'gallery',
    icon: 'Images',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#ffffff',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Campus Gallery',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-12'
      },
      {
        component_name: 'ImageGallery',
        props: {
          layout: 'grid',
          columns: 4,
          gap: 16,
          lightbox: true,
          images: [
            { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600', alt: 'Campus Building', caption: 'Main Campus' },
            { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', alt: 'Library', caption: 'Central Library' },
            { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600', alt: 'Students', caption: 'Student Life' },
            { src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600', alt: 'Lab', caption: 'Research Lab' }
          ]
        },
        sort_order: 2,
                is_visible: true,
        responsive_settings: {
          tablet: { columns: 2 },
          mobile: { columns: 1 }
        },
                custom_classes: 'max-w-6xl mx-auto px-4'
      }
    ]
  },

  // ============================================
  // DATA/DYNAMIC PRESETS
  // ============================================
  {
    id: 'events-section',
    name: 'Upcoming Events',
    description: 'Display upcoming events from the database',
    category: 'data',
    icon: 'Calendar',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#ffffff',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Upcoming Events',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-12'
      },
      {
        component_name: 'EventsList',
        props: {
          filter: 'upcoming',
          limit: 6,
          layout: 'grid',
          showPastEvents: false
        },
        sort_order: 2,
        is_visible: true,
        custom_classes: 'max-w-6xl mx-auto px-4'
      }
    ]
  },
  {
    id: 'faculty-grid',
    name: 'Faculty Directory',
    description: 'Display faculty members in a grid layout',
    category: 'data',
    icon: 'Users',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#f8f9fa',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Our Faculty',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-12'
      },
      {
        component_name: 'FacultyDirectory',
        props: {
          layout: 'grid',
          columns: 4,
          showDepartment: true,
          showEmail: true,
          department: 'all'
        },
        sort_order: 2,
                is_visible: true,
        responsive_settings: {
          tablet: { columns: 2 },
          mobile: { columns: 1 }
        },
                custom_classes: 'max-w-6xl mx-auto px-4'
      }
    ]
  },

  // ============================================
  // CONTENT PRESETS
  // ============================================
  {
    id: 'two-column-text-image',
    name: 'Text + Image Section',
    description: 'Two-column layout with text on left and image on right',
    category: 'content',
    icon: 'LayoutPanelLeft',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#ffffff',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'FlexboxLayout',
        props: {
          direction: 'row',
          justify: 'between',
          align: 'center',
          gap: 64,
          wrap: true
        },
        sort_order: 1,
        is_visible: true,
        responsive_settings: {
          mobile: { direction: 'column', gap: 32 }
        },
        custom_classes: 'max-w-6xl mx-auto px-10'
      }
    ]
  },
  {
    id: 'timeline-history',
    name: 'Timeline / History',
    description: 'Vertical timeline for showing milestones or history',
    category: 'content',
    icon: 'GitBranch',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#ffffff',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Our Journey',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-12'
      },
      {
        component_name: 'Timeline',
        props: {
          layout: 'alternating',
          showIcons: true,
          events: [
            { year: '1990', title: 'Foundation', description: 'JKKN Institution was established with a vision to provide quality education.', icon: 'flag' },
            { year: '2000', title: 'Expansion', description: 'Added new programs in engineering and management.', icon: 'building' },
            { year: '2010', title: 'Recognition', description: 'Achieved NAAC accreditation with A grade.', icon: 'award' },
            { year: '2020', title: 'Digital Transformation', description: 'Launched online learning platforms and smart classrooms.', icon: 'laptop' },
            { year: '2024', title: 'New Horizons', description: 'Expanding with new research centers and international collaborations.', icon: 'globe' }
          ]
        },
        sort_order: 2,
        is_visible: true,
        custom_classes: 'max-w-4xl mx-auto px-4'
      }
    ]
  },
  {
    id: 'tabs-content',
    name: 'Tabbed Content',
    description: 'Content organized in switchable tabs',
    category: 'content',
    icon: 'Layers',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#ffffff',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Program Details',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-12'
      },
      {
        component_name: 'TabsBlock',
        props: {
          variant: 'default',
          defaultTab: 0,
          tabs: [
            { label: 'Overview', content: '<p>This program offers comprehensive education with a focus on practical skills and industry readiness.</p>' },
            { label: 'Curriculum', content: '<p>The curriculum includes core subjects, electives, and hands-on projects designed by industry experts.</p>' },
            { label: 'Eligibility', content: '<p>Candidates must have completed 10+2 with minimum 60% marks in relevant subjects.</p>' },
            { label: 'Fees', content: '<p>Tuition fee: ₹1,50,000 per year. Scholarships available for meritorious students.</p>' }
          ]
        },
        sort_order: 2,
        is_visible: true,
        custom_classes: 'max-w-4xl mx-auto px-4'
      }
    ]
  },

  // ============================================
  // CONTACT PRESETS
  // ============================================
  {
    id: 'contact-section',
    name: 'Contact Section',
    description: 'Contact information with call-to-action buttons',
    category: 'contact',
    icon: 'Phone',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#f8f9fa',
          padding: '80',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Get in Touch',
          level: 'h2',
          alignment: 'center',
          color: undefined
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-4'
      },
      {
        component_name: 'TextEditor',
        props: {
          content: '<p style="text-align: center; color: #6b7280;">Have questions? We\'d love to hear from you. Reach out to us through any of the channels below.</p>',
          alignment: 'center',
          maxWidth: '600px'
        },
        sort_order: 2,
        is_visible: true,
        custom_classes: 'mx-auto mb-12'
      },
      {
        component_name: 'GridLayout',
        props: {
          columns: 3,
          gap: 32
        },
        sort_order: 3,
        is_visible: true,
        responsive_settings: {
          mobile: { columns: 1 }
        },
                custom_classes: 'max-w-4xl mx-auto'
      }
    ]
  },

  // ============================================
  // LOGO CLOUD PRESET
  // ============================================
  {
    id: 'logo-cloud',
    name: 'Partner Logos',
    description: 'Display partner, recruiter, or sponsor logos',
    category: 'content',
    icon: 'Building2',
    blocks: [
      {
        component_name: 'SectionWrapper',
        props: {
          background: '#ffffff',
          padding: '60',
          fullWidth: true
        },
        sort_order: 0,
        is_visible: true
      },
      {
        component_name: 'Heading',
        props: {
          text: 'Our Recruiters',
          level: 'h3',
          alignment: 'center',
          color: '#6b7280'
        },
        sort_order: 1,
        is_visible: true,
        custom_classes: 'mb-8'
      },
      {
        component_name: 'LogoCloud',
        props: {
          layout: 'grid',
          columns: 6,
          grayscale: true,
          logos: [
            { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png', link: '#', alt: 'TCS' },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Infosys_logo.svg/200px-Infosys_logo.svg.png', link: '#', alt: 'Infosys' },
            { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png', link: '#', alt: 'Wipro' }
          ]
        },
        sort_order: 2,
                is_visible: true,
        responsive_settings: {
          tablet: { columns: 4 },
          mobile: { columns: 3 }
        },
                custom_classes: 'max-w-5xl mx-auto px-4'
      }
    ]
  },

  // ============================================
  // SPACING PRESETS
  // ============================================
  {
    id: 'spacer-large',
    name: 'Large Spacer',
    description: 'Add vertical spacing between sections (80px)',
    category: 'content',
    icon: 'SeparatorHorizontal',
    blocks: [
      {
        component_name: 'Spacer',
        props: {
          height: 80
        },
        sort_order: 0,
                is_visible: true,
        responsive_settings: {
          mobile: { height: 40 }
        },
                custom_classes: undefined
      }
    ]
  },
  {
    id: 'divider-simple',
    name: 'Simple Divider',
    description: 'Horizontal line to separate content',
    category: 'content',
    icon: 'Minus',
    blocks: [
      {
        component_name: 'Divider',
        props: {
          style: 'solid',
          color: '#e5e7eb',
          width: 100,
          thickness: 1
        },
        sort_order: 0,
        is_visible: true,
        custom_classes: 'my-8 max-w-4xl mx-auto'
      }
    ]
  }
]

// Get presets by category
export function getPresetsByCategory(category: LayoutPreset['category']): LayoutPreset[] {
  return LAYOUT_PRESETS.filter(preset => preset.category === category)
}

// Get all preset categories
export function getPresetCategories(): Array<{ id: LayoutPreset['category']; label: string; icon: string }> {
  return [
    { id: 'hero', label: 'Hero Sections', icon: 'Layout' },
    { id: 'features', label: 'Features', icon: 'Grid3X3' },
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'testimonials', label: 'Testimonials', icon: 'MessageSquareQuote' },
    { id: 'cta', label: 'Call to Action', icon: 'Megaphone' },
    { id: 'gallery', label: 'Gallery', icon: 'Images' },
    { id: 'data', label: 'Data & Stats', icon: 'BarChart3' },
    { id: 'contact', label: 'Contact', icon: 'Phone' },
  ]
}

// Search presets
export function searchPresets(query: string): LayoutPreset[] {
  const lowerQuery = query.toLowerCase()
  return LAYOUT_PRESETS.filter(
    preset =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.description.toLowerCase().includes(lowerQuery)
  )
}
