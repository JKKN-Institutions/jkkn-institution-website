'use client'

/**
 * Preview Capture Page for Built-in Components
 *
 * This page renders built-in CMS components for screenshot capture.
 * URL: /admin/preview-capture/builtin?component=HeroSection
 */

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, AlertTriangle } from 'lucide-react'
import {
  COMPONENT_REGISTRY,
  getComponent,
  getDefaultProps,
  getComponentNames,
} from '@/lib/cms/component-registry'

// Sample data for components that need arrays
const SAMPLE_DATA = {
  // Testimonials sample data
  testimonials: [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Professor',
      company: 'JKKN College',
      content: 'Outstanding institution with excellent facilities and faculty.',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
    },
    {
      name: 'Priya Sharma',
      role: 'Alumni',
      company: 'Tech Corp',
      content: 'The education I received here shaped my career.',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    },
    {
      name: 'Amit Patel',
      role: 'Student',
      company: 'Final Year',
      content: 'Great learning environment and supportive teachers.',
      rating: 4,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
    },
  ],

  // FAQ sample data
  faqs: [
    {
      question: 'What courses are offered?',
      answer: 'We offer undergraduate and postgraduate programs in Engineering, Medicine, Pharmacy, and Arts & Science.',
    },
    {
      question: 'What are the admission requirements?',
      answer: 'Admission is based on entrance exam scores and academic performance in qualifying examinations.',
    },
    {
      question: 'Is hostel facility available?',
      answer: 'Yes, we have separate hostel facilities for boys and girls with modern amenities.',
    },
  ],

  // Tabs sample data
  tabs: [
    { title: 'Overview', content: 'JKKN Group of Institutions is a premier educational institution...' },
    { title: 'Programs', content: 'We offer various undergraduate and postgraduate programs...' },
    { title: 'Facilities', content: 'State-of-the-art laboratories, libraries, and sports facilities...' },
  ],

  // Timeline sample data
  events: [
    { date: '1990', title: 'Foundation', description: 'JKKN was established with a vision for excellence' },
    { date: '2000', title: 'Expansion', description: 'Added new colleges and departments' },
    { date: '2010', title: 'Accreditation', description: 'Received NAAC A+ accreditation' },
    { date: '2020', title: 'Digital Era', description: 'Launched online learning platforms' },
  ],

  // Pricing sample data
  plans: [
    {
      name: 'Basic',
      price: '50000',
      period: '/year',
      features: ['Quality Education', 'Library Access', 'Sports Facilities'],
      popular: false,
    },
    {
      name: 'Standard',
      price: '75000',
      period: '/year',
      features: ['Everything in Basic', 'Lab Access', 'Hostel Option', 'Placement Support'],
      popular: true,
    },
    {
      name: 'Premium',
      price: '100000',
      period: '/year',
      features: ['Everything in Standard', 'International Exchange', 'Personal Mentoring'],
      popular: false,
    },
  ],

  // Image Gallery sample data
  images: [
    { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop', alt: 'Campus', caption: 'Main Campus' },
    { src: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop', alt: 'Library', caption: 'Central Library' },
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop', alt: 'Students', caption: 'Student Life' },
    { src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop', alt: 'Lab', caption: 'Research Lab' },
  ],

  // Logo Cloud sample data
  logos: [
    { src: 'https://via.placeholder.com/150x60?text=Partner+1', name: 'Partner 1', link: '#' },
    { src: 'https://via.placeholder.com/150x60?text=Partner+2', name: 'Partner 2', link: '#' },
    { src: 'https://via.placeholder.com/150x60?text=Partner+3', name: 'Partner 3', link: '#' },
    { src: 'https://via.placeholder.com/150x60?text=Partner+4', name: 'Partner 4', link: '#' },
    { src: 'https://via.placeholder.com/150x60?text=Partner+5', name: 'Partner 5', link: '#' },
    { src: 'https://via.placeholder.com/150x60?text=Partner+6', name: 'Partner 6', link: '#' },
  ],

  // Stats sample data
  stats: [
    { value: 5000, label: 'Students', suffix: '+', icon: 'Users' },
    { value: 200, label: 'Faculty', suffix: '+', icon: 'GraduationCap' },
    { value: 50, label: 'Programs', suffix: '+', icon: 'BookOpen' },
    { value: 30, label: 'Years', suffix: '+', icon: 'Calendar' },
  ],

  // Faculty sample data
  faculty: [
    { name: 'Dr. Kumar', title: 'Professor', department: 'Computer Science', email: 'kumar@jkkn.ac.in', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kumar' },
    { name: 'Dr. Priya', title: 'Associate Professor', department: 'Electronics', email: 'priya@jkkn.ac.in', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya2' },
    { name: 'Dr. Amit', title: 'Assistant Professor', department: 'Mechanical', email: 'amit@jkkn.ac.in', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit2' },
    { name: 'Dr. Sneha', title: 'Professor', department: 'Civil', email: 'sneha@jkkn.ac.in', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha' },
  ],

  // Announcements sample data
  announcements: [
    { title: 'Admission Open 2024', date: '2024-01-15', category: 'Admission', priority: 'high', content: 'Applications are now open for the 2024 batch.' },
    { title: 'Annual Sports Day', date: '2024-02-20', category: 'Events', priority: 'medium', content: 'Join us for the annual sports day celebration.' },
    { title: 'Holiday Notice', date: '2024-03-01', category: 'Notice', priority: 'low', content: 'Campus will be closed on March 5th.' },
  ],

  // Blog Posts sample data
  posts: [
    {
      title: 'Excellence in Education',
      excerpt: 'Discover how JKKN is shaping future leaders...',
      author: 'Admin',
      date: '2024-01-10',
      category: 'News',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop',
      link: '#',
    },
    {
      title: 'Research Achievements',
      excerpt: 'Our faculty published 50+ papers this year...',
      author: 'Research Team',
      date: '2024-01-05',
      category: 'Research',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
      link: '#',
    },
    {
      title: 'Campus Life',
      excerpt: 'A day in the life of JKKN students...',
      author: 'Student Council',
      date: '2024-01-01',
      category: 'Campus',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop',
      link: '#',
    },
  ],
}

// Enhanced props for specific components
function getEnhancedProps(componentName: string): Record<string, unknown> {
  const baseProps = getDefaultProps(componentName)

  switch (componentName) {
    case 'HeroSection':
      return {
        ...baseProps,
        backgroundImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop',
        title: 'Welcome to JKKN',
        subtitle: 'Excellence in Education',
        minHeight: '400px',
      }

    case 'TextEditor':
      return {
        ...baseProps,
        content: '<p>Welcome to JKKN Group of Institutions. We provide quality education with state-of-the-art facilities and experienced faculty members.</p>',
      }

    case 'Heading':
      return {
        ...baseProps,
        text: 'Our Programs',
        level: 'h2',
      }

    case 'CallToAction':
      return {
        ...baseProps,
        title: 'Ready to Start Your Journey?',
        description: 'Join thousands of students who have chosen excellence.',
        buttons: [
          { label: 'Apply Now', variant: 'default', link: '#' },
          { label: 'Learn More', variant: 'outline', link: '#' },
        ],
      }

    case 'Testimonials':
      return {
        ...baseProps,
        testimonials: SAMPLE_DATA.testimonials,
        layout: 'grid',
        columns: 3,
      }

    case 'FAQAccordion':
      return {
        ...baseProps,
        faqs: SAMPLE_DATA.faqs,
        title: 'Frequently Asked Questions',
      }

    case 'TabsBlock':
      return {
        ...baseProps,
        tabs: SAMPLE_DATA.tabs,
      }

    case 'Timeline':
      return {
        ...baseProps,
        events: SAMPLE_DATA.events,
        title: 'Our Journey',
      }

    case 'PricingTables':
      return {
        ...baseProps,
        plans: SAMPLE_DATA.plans,
        title: 'Fee Structure',
        currency: '₹',
      }

    case 'ImageBlock':
      return {
        ...baseProps,
        src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
        alt: 'JKKN Campus',
        caption: 'Our Beautiful Campus',
        width: 600,
        height: 400,
      }

    case 'ImageGallery':
      return {
        ...baseProps,
        images: SAMPLE_DATA.images,
        columns: 2,
      }

    case 'VideoPlayer':
      return {
        ...baseProps,
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        provider: 'youtube',
        title: 'Campus Tour',
      }

    case 'ImageCarousel':
      return {
        ...baseProps,
        images: SAMPLE_DATA.images,
      }

    case 'BeforeAfterSlider':
      return {
        ...baseProps,
        beforeImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&h=400&fit=crop',
        beforeLabel: 'Before',
        afterLabel: 'After',
      }

    case 'LogoCloud':
      return {
        ...baseProps,
        logos: SAMPLE_DATA.logos,
        title: 'Our Partners',
      }

    case 'Container':
      return {
        ...baseProps,
        background: '#f8fafc',
      }

    case 'GridLayout':
      return {
        ...baseProps,
        columns: 3,
      }

    case 'FlexboxLayout':
      return {
        ...baseProps,
        gap: 4,
      }

    case 'Spacer':
      return {
        ...baseProps,
        height: '16',
      }

    case 'Divider':
      return {
        ...baseProps,
        style: 'solid',
        color: '#e5e7eb',
      }

    case 'SectionWrapper':
      return {
        ...baseProps,
        backgroundColor: '#f1f5f9',
        padding: '8',
      }

    case 'StatsCounter':
      return {
        ...baseProps,
        stats: SAMPLE_DATA.stats,
      }

    case 'EventsList':
      return {
        ...baseProps,
        events: SAMPLE_DATA.events.map((e, i) => ({
          id: i + 1,
          title: e.title,
          date: `2024-0${i + 1}-15`,
          location: 'Main Campus',
          description: e.description,
        })),
      }

    case 'FacultyDirectory':
      return {
        ...baseProps,
        faculty: SAMPLE_DATA.faculty,
        columns: 2,
      }

    case 'AnnouncementsFeed':
      return {
        ...baseProps,
        announcements: SAMPLE_DATA.announcements,
      }

    case 'BlogPostsGrid':
      return {
        ...baseProps,
        posts: SAMPLE_DATA.posts,
        columns: 3,
      }

    default:
      return baseProps
  }
}

function ComponentPreview({ componentName }: { componentName: string }) {
  const Component = getComponent(componentName)
  const props = getEnhancedProps(componentName)

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-red-500">
        <AlertTriangle className="w-12 h-12 mb-2" />
        <p>Component "{componentName}" not found</p>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <Component {...props} id="preview" isEditing={false} />
    </Suspense>
  )
}

function ComponentListView() {
  const componentNames = getComponentNames()

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Built-in Components Preview</h1>
      <p className="text-gray-600 mb-8">
        Click on a component name to view its preview for screenshot capture.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {componentNames.map((name) => {
          const entry = COMPONENT_REGISTRY[name]
          return (
            <a
              key={name}
              href={`?component=${name}`}
              className="p-4 border rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">{entry.displayName}</p>
              <p className="text-xs text-gray-500">{name}</p>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function SingleComponentView({ componentName }: { componentName: string }) {
  const entry = COMPONENT_REGISTRY[componentName]

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-500">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl">Component "{componentName}" not found</p>
          <a href="?" className="text-primary underline mt-4 block">
            View all components
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      data-preview-status="ready"
      data-component-name={componentName}
    >
      {/* Component Badge */}
      <div className="p-4 border-b bg-white/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {entry.displayName}
          </span>
          <span className="text-xs text-gray-500">{entry.category}</span>
        </div>
      </div>

      {/* Component Render Area */}
      <div
        className="bg-white shadow-lg mx-auto my-8 rounded-xl overflow-hidden max-w-4xl"
        data-preview-content="true"
      >
        <ComponentPreview componentName={componentName} />
      </div>
    </div>
  )
}

export default function BuiltinComponentPreviewCapture() {
  const searchParams = useSearchParams()
  const componentName = searchParams.get('component')

  // If no component specified, show list
  if (!componentName) {
    return <ComponentListView />
  }

  return <SingleComponentView componentName={componentName} />
}
