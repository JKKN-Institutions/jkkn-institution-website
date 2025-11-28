/**
 * Component Preview Capture Page
 *
 * This page renders CMS components for automated screenshot capture.
 * Access via: /admin/preview-capture?component=ComponentName
 *
 * Used by: scripts/generate-component-previews.ts
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { COMPONENT_REGISTRY, getComponent } from '@/lib/cms/component-registry'

interface PageProps {
  searchParams: Promise<{ component?: string }>
}

export default async function PreviewCapturePage({ searchParams }: PageProps) {
  const params = await searchParams
  const componentName = params.component

  // If no component specified, show list of all components
  if (!componentName) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Component Preview Capture</h1>
        <p className="text-gray-600 mb-4">
          This page is used for automated screenshot generation.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(COMPONENT_REGISTRY).map((name) => (
            <a
              key={name}
              href={`/admin/preview-capture?component=${name}`}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">{COMPONENT_REGISTRY[name].displayName}</p>
              <p className="text-sm text-gray-500">{name}</p>
            </a>
          ))}
        </div>
      </div>
    )
  }

  // Get the component
  const entry = COMPONENT_REGISTRY[componentName]
  if (!entry) {
    notFound()
  }

  const Component = getComponent(componentName)
  if (!Component) {
    notFound()
  }

  // Get sample props for preview
  const sampleProps = getSampleProps(componentName, entry.defaultProps)

  return (
    <div
      id="preview-container"
      className="w-[800px] h-[600px] bg-[#f8f9fa] overflow-hidden flex items-center justify-center"
      style={{ margin: 0, padding: 0 }}
    >
      <div className="w-full h-full relative">
        <Suspense fallback={<PreviewSkeleton />}>
          <Component {...sampleProps} />
        </Suspense>
      </div>
    </div>
  )
}

function PreviewSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  )
}

/**
 * Generate sample props for each component to create meaningful previews
 */
function getSampleProps(componentName: string, defaultProps: Record<string, unknown>): Record<string, unknown> {
  const sampleData: Record<string, Record<string, unknown>> = {
    HeroSection: {
      ...defaultProps,
      title: 'Welcome to JKKN Institution',
      subtitle: 'Excellence in Education, Innovation in Learning',
      backgroundImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop',
      backgroundType: 'image',
      alignment: 'center',
      overlay: true,
      overlayOpacity: 0.5,
      minHeight: '600px',
      ctaButtons: [
        { label: 'Apply Now', link: '#', variant: 'primary' },
        { label: 'Learn More', link: '#', variant: 'secondary' },
      ],
    },
    TextEditor: {
      ...defaultProps,
      content: `<h2>About Our Institution</h2>
        <p>JKKN Group of Institutions is a premier educational organization committed to providing quality education. Our mission is to nurture young minds and prepare them for the challenges of tomorrow.</p>
        <ul>
          <li>World-class faculty</li>
          <li>Modern infrastructure</li>
          <li>Industry partnerships</li>
        </ul>`,
      alignment: 'left',
      maxWidth: 'prose',
    },
    Heading: {
      ...defaultProps,
      text: 'Our Programs & Courses',
      level: 'h2',
      alignment: 'center',
      color: '#0b6d41',
    },
    CallToAction: {
      ...defaultProps,
      title: 'Ready to Start Your Journey?',
      description: 'Join thousands of successful students who have built their careers with JKKN.',
      alignment: 'center',
      buttons: [
        { label: 'Get Started', link: '#', variant: 'primary' },
        { label: 'Contact Us', link: '#', variant: 'outline' },
      ],
    },
    Testimonials: {
      ...defaultProps,
      testimonials: [
        {
          quote: 'JKKN provided me with the foundation to build a successful career in healthcare.',
          author: 'Dr. Priya Sharma',
          role: 'Alumni, Class of 2018',
          avatar: 'https://i.pravatar.cc/150?img=1',
          rating: 5,
        },
        {
          quote: 'The faculty and infrastructure are world-class. I highly recommend JKKN.',
          author: 'Rajesh Kumar',
          role: 'Current Student',
          avatar: 'https://i.pravatar.cc/150?img=2',
          rating: 5,
        },
      ],
      layout: 'carousel',
      showRating: true,
    },
    FAQAccordion: {
      ...defaultProps,
      faqs: [
        { question: 'What courses are offered?', answer: 'We offer programs in Engineering, Medicine, Pharmacy, and Arts & Science.' },
        { question: 'How do I apply?', answer: 'You can apply online through our admissions portal or visit the campus.' },
        { question: 'Are scholarships available?', answer: 'Yes, we offer merit-based and need-based scholarships to deserving students.' },
      ],
      searchEnabled: true,
      allowMultiple: false,
    },
    TabsBlock: {
      ...defaultProps,
      tabs: [
        { label: 'Undergraduate', content: 'B.Tech, MBBS, B.Pharm, BBA, BCA programs available.' },
        { label: 'Postgraduate', content: 'M.Tech, MD, M.Pharm, MBA, MCA programs available.' },
        { label: 'Research', content: 'Ph.D programs in various disciplines with research grants.' },
      ],
      variant: 'default',
    },
    Timeline: {
      ...defaultProps,
      events: [
        { year: '1994', title: 'Foundation', description: 'JKKN was established with a vision for excellence.' },
        { year: '2000', title: 'Expansion', description: 'Added Engineering and Medical colleges.' },
        { year: '2010', title: 'Recognition', description: 'Received NAAC A+ accreditation.' },
        { year: '2024', title: 'Today', description: '50,000+ students across multiple campuses.' },
      ],
      alternating: true,
    },
    PricingTables: {
      ...defaultProps,
      plans: [
        { name: 'Day Scholar', price: '50,000', period: 'year', features: ['Tuition', 'Library', 'Labs'], highlighted: false },
        { name: 'Hostel', price: '1,20,000', period: 'year', features: ['Tuition', 'Accommodation', 'Meals', 'Library', 'Labs'], highlighted: true },
        { name: 'International', price: '2,50,000', period: 'year', features: ['All Inclusive', 'Airport Pickup', 'Visa Support'], highlighted: false },
      ],
      columns: 3,
    },
    ImageBlock: {
      ...defaultProps,
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      alt: 'JKKN Campus',
      caption: 'Our beautiful green campus spread across 100 acres',
      objectFit: 'cover',
      lightbox: true,
    },
    ImageGallery: {
      ...defaultProps,
      images: [
        { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop', alt: 'Campus 1' },
        { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop', alt: 'Campus 2' },
        { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop', alt: 'Students' },
        { src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop', alt: 'Library' },
        { src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop', alt: 'Books' },
        { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop', alt: 'Lab' },
      ],
      layout: 'grid',
      columns: 3,
      lightbox: true,
      gap: 4,
    },
    VideoPlayer: {
      ...defaultProps,
      src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      provider: 'youtube',
      autoplay: false,
      controls: true,
      aspectRatio: '16/9',
    },
    ImageCarousel: {
      ...defaultProps,
      images: [
        { src: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop', alt: 'Slide 1' },
        { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop', alt: 'Slide 2' },
        { src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop', alt: 'Slide 3' },
      ],
      autoplay: false,
      showDots: true,
      showArrows: true,
    },
    BeforeAfterSlider: {
      ...defaultProps,
      beforeImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop',
      afterImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      beforeLabel: 'Before',
      afterLabel: 'After',
      startPosition: 50,
    },
    LogoCloud: {
      ...defaultProps,
      logos: [
        { src: 'https://via.placeholder.com/150x60?text=Partner+1', alt: 'Partner 1', link: '#' },
        { src: 'https://via.placeholder.com/150x60?text=Partner+2', alt: 'Partner 2', link: '#' },
        { src: 'https://via.placeholder.com/150x60?text=Partner+3', alt: 'Partner 3', link: '#' },
        { src: 'https://via.placeholder.com/150x60?text=Partner+4', alt: 'Partner 4', link: '#' },
        { src: 'https://via.placeholder.com/150x60?text=Partner+5', alt: 'Partner 5', link: '#' },
        { src: 'https://via.placeholder.com/150x60?text=Partner+6', alt: 'Partner 6', link: '#' },
      ],
      layout: 'grid',
      grayscale: true,
      columns: 6,
    },
    Container: {
      ...defaultProps,
      maxWidth: 'xl',
      padding: '8',
      centered: true,
      background: '#ffffff',
      children: (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Container Component</h2>
          <p className="text-gray-600">This is a content wrapper with configurable max-width and padding.</p>
        </div>
      ),
    },
    GridLayout: {
      ...defaultProps,
      columns: 3,
      gap: 4,
      children: (
        <>
          <div className="bg-primary/10 p-6 rounded-lg text-center">Column 1</div>
          <div className="bg-primary/10 p-6 rounded-lg text-center">Column 2</div>
          <div className="bg-primary/10 p-6 rounded-lg text-center">Column 3</div>
        </>
      ),
    },
    FlexboxLayout: {
      ...defaultProps,
      direction: 'row',
      justify: 'space-between',
      align: 'center',
      gap: 4,
      children: (
        <>
          <div className="bg-primary/10 p-6 rounded-lg">Flex Item 1</div>
          <div className="bg-primary/10 p-6 rounded-lg">Flex Item 2</div>
          <div className="bg-primary/10 p-6 rounded-lg">Flex Item 3</div>
        </>
      ),
    },
    Spacer: {
      ...defaultProps,
      height: '16',
    },
    Divider: {
      ...defaultProps,
      style: 'solid',
      color: '#0b6d41',
      thickness: 2,
      width: 'full',
    },
    SectionWrapper: {
      ...defaultProps,
      padding: '16',
      fullWidth: true,
      background: '#f0fdf4',
      children: (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Section Wrapper</h2>
          <p className="text-gray-600">Full-width section with background options.</p>
        </div>
      ),
    },
    StatsCounter: {
      ...defaultProps,
      stats: [
        { value: 50000, label: 'Students', icon: 'Users', suffix: '+' },
        { value: 500, label: 'Faculty', icon: 'GraduationCap', suffix: '+' },
        { value: 30, label: 'Years', icon: 'Calendar', suffix: '' },
        { value: 95, label: 'Placement Rate', icon: 'TrendingUp', suffix: '%' },
      ],
      layout: 'row',
      columns: 4,
      animate: true,
      showIcons: true,
      variant: 'cards',
    },
    EventsList: {
      ...defaultProps,
      title: 'Upcoming Events',
      events: [
        { title: 'Annual Sports Day', date: '2024-02-15', location: 'Main Ground', category: 'Sports' },
        { title: 'Tech Symposium', date: '2024-02-20', location: 'Auditorium', category: 'Academic' },
        { title: 'Cultural Fest', date: '2024-03-01', location: 'Campus', category: 'Cultural' },
      ],
      layout: 'list',
      maxItems: 3,
      showViewAll: true,
    },
    FacultyDirectory: {
      ...defaultProps,
      title: 'Our Faculty',
      faculty: [
        { name: 'Dr. Ramesh Kumar', designation: 'Principal', department: 'Administration', image: 'https://i.pravatar.cc/150?img=11', email: 'ramesh@jkkn.edu' },
        { name: 'Dr. Lakshmi Devi', designation: 'HOD', department: 'Computer Science', image: 'https://i.pravatar.cc/150?img=12', email: 'lakshmi@jkkn.edu' },
        { name: 'Prof. Suresh Babu', designation: 'Professor', department: 'Electronics', image: 'https://i.pravatar.cc/150?img=13', email: 'suresh@jkkn.edu' },
        { name: 'Dr. Anita Singh', designation: 'Associate Professor', department: 'Pharmacy', image: 'https://i.pravatar.cc/150?img=14', email: 'anita@jkkn.edu' },
      ],
      layout: 'grid',
      columns: 4,
      showDepartmentFilter: false,
      showSearchBox: false,
    },
    AnnouncementsFeed: {
      ...defaultProps,
      title: 'Latest Announcements',
      announcements: [
        { title: 'Admission Open for 2024-25', date: '2024-01-15', priority: 'high', category: 'Admissions' },
        { title: 'Holiday Notice: Republic Day', date: '2024-01-20', priority: 'normal', category: 'Holiday' },
        { title: 'Exam Schedule Released', date: '2024-01-25', priority: 'high', category: 'Exams' },
      ],
      layout: 'list',
      maxItems: 3,
      showDate: true,
      showCategory: true,
    },
    BlogPostsGrid: {
      ...defaultProps,
      title: 'Latest News',
      posts: [
        {
          title: 'JKKN Ranked Among Top Institutions',
          excerpt: 'Our institution has been ranked among the top educational institutions in South India.',
          date: '2024-01-10',
          author: 'Admin',
          category: 'News',
          image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop',
        },
        {
          title: 'New Research Lab Inaugurated',
          excerpt: 'State-of-the-art research facility for advanced studies has been inaugurated.',
          date: '2024-01-08',
          author: 'Admin',
          category: 'Infrastructure',
          image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
        },
        {
          title: 'Campus Placement Drive Success',
          excerpt: 'Over 500 students placed in top companies during the annual placement drive.',
          date: '2024-01-05',
          author: 'Admin',
          category: 'Placements',
          image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop',
        },
      ],
      layout: 'grid',
      columns: 3,
      showExcerpt: true,
      showAuthor: false,
      showDate: true,
      showCategory: true,
    },
  }

  return sampleData[componentName] || defaultProps
}
