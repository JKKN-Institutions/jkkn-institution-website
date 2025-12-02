import { lazy, type ComponentType } from 'react'
import { z } from 'zod'
import type {
  ComponentRegistry,
  ComponentRegistryEntry,
  ComponentCategory,
  BaseBlockProps,
} from './registry-types'
import {
  HeroSectionPropsSchema,
  TextEditorPropsSchema,
  HeadingPropsSchema,
  CallToActionPropsSchema,
  TestimonialsPropsSchema,
  FAQAccordionPropsSchema,
  TabsBlockPropsSchema,
  TimelinePropsSchema,
  PricingTablesPropsSchema,
  ImageBlockPropsSchema,
  ImageGalleryPropsSchema,
  VideoPlayerPropsSchema,
  ImageCarouselPropsSchema,
  BeforeAfterSliderPropsSchema,
  LogoCloudPropsSchema,
  ContainerPropsSchema,
  GridLayoutPropsSchema,
  FlexboxLayoutPropsSchema,
  SpacerPropsSchema,
  DividerPropsSchema,
  SectionWrapperPropsSchema,
  // Data block schemas
  StatsCounterPropsSchema,
  EventsListPropsSchema,
  FacultyDirectoryPropsSchema,
  AnnouncementsFeedPropsSchema,
  BlogPostsGridPropsSchema,
} from './registry-types'

// Re-export types
export * from './registry-types'

// ==========================================
// Lazy-loaded component imports
// ==========================================

// Content blocks
const HeroSection = lazy(() => import('@/components/cms-blocks/content/hero-section'))
const TextEditor = lazy(() => import('@/components/cms-blocks/content/text-editor'))
const Heading = lazy(() => import('@/components/cms-blocks/content/heading'))
const CallToAction = lazy(() => import('@/components/cms-blocks/content/call-to-action'))
const Testimonials = lazy(() => import('@/components/cms-blocks/content/testimonials'))
const FAQAccordion = lazy(() => import('@/components/cms-blocks/content/faq-accordion'))
const TabsBlock = lazy(() => import('@/components/cms-blocks/content/tabs-block'))
const Timeline = lazy(() => import('@/components/cms-blocks/content/timeline'))
const PricingTables = lazy(() => import('@/components/cms-blocks/content/pricing-tables'))

// Media blocks
const ImageBlock = lazy(() => import('@/components/cms-blocks/media/image-block'))
const ImageGallery = lazy(() => import('@/components/cms-blocks/media/image-gallery'))
const VideoPlayer = lazy(() => import('@/components/cms-blocks/media/video-player'))
const ImageCarousel = lazy(() => import('@/components/cms-blocks/media/image-carousel'))
const BeforeAfterSlider = lazy(() => import('@/components/cms-blocks/media/before-after-slider'))
const LogoCloud = lazy(() => import('@/components/cms-blocks/media/logo-cloud'))

// Layout blocks
const Container = lazy(() => import('@/components/cms-blocks/layout/container'))
const GridLayout = lazy(() => import('@/components/cms-blocks/layout/grid-layout'))
const FlexboxLayout = lazy(() => import('@/components/cms-blocks/layout/flexbox-layout'))
const Spacer = lazy(() => import('@/components/cms-blocks/layout/spacer'))
const Divider = lazy(() => import('@/components/cms-blocks/layout/divider'))
const SectionWrapper = lazy(() => import('@/components/cms-blocks/layout/section-wrapper'))

// Data blocks
const StatsCounter = lazy(() => import('@/components/cms-blocks/data/stats-counter'))
const EventsList = lazy(() => import('@/components/cms-blocks/data/events-list'))
const FacultyDirectory = lazy(() => import('@/components/cms-blocks/data/faculty-directory'))
const AnnouncementsFeed = lazy(() => import('@/components/cms-blocks/data/announcements-feed'))
const BlogPostsGrid = lazy(() => import('@/components/cms-blocks/data/blog-posts-grid'))

// ==========================================
// Component Registry
// ==========================================

export const COMPONENT_REGISTRY: ComponentRegistry = {
  // ==========================================
  // Content Blocks
  // ==========================================
  HeroSection: {
    name: 'HeroSection',
    displayName: 'Hero Section',
    category: 'content',
    description: 'Full-width hero section with background image/video, title, subtitle, and CTA buttons',
    icon: 'Image',
    previewImage: '/cms-previews/HeroSection.png',
    component: HeroSection,
    propsSchema: HeroSectionPropsSchema,
    defaultProps: {
      title: 'Welcome to JKKN',
      subtitle: 'Excellence in Education',
      titleColor: '#ffffff',
      titleFontSize: '5xl',
      titleFontWeight: 'bold',
      titleFontStyle: 'normal',
      subtitleColor: '#e5e5e5',
      subtitleFontSize: 'xl',
      subtitleFontWeight: 'normal',
      subtitleFontStyle: 'normal',
      backgroundType: 'image',
      alignment: 'center',
      overlay: true,
      overlayOpacity: 0.5,
      ctaButtons: [],
      minHeight: '100vh',
    },
    supportsChildren: false,
    keywords: ['hero', 'banner', 'header', 'landing'],
    editableProps: [
      // Title settings
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'titleFontSize', type: 'enum', label: 'Title Font Size', options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] },
      { name: 'titleFontWeight', type: 'enum', label: 'Title Font Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
      { name: 'titleFontStyle', type: 'enum', label: 'Title Font Style', options: ['normal', 'italic'] },
      // Subtitle settings
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'subtitleFontSize', type: 'enum', label: 'Subtitle Font Size', options: ['sm', 'md', 'lg', 'xl', '2xl'] },
      { name: 'subtitleFontWeight', type: 'enum', label: 'Subtitle Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'subtitleFontStyle', type: 'enum', label: 'Subtitle Font Style', options: ['normal', 'italic'] },
      // Background settings
      { name: 'backgroundType', type: 'enum', label: 'Background Type', options: ['image', 'video', 'gradient'] },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
      { name: 'backgroundVideo', type: 'video', label: 'Background Video' },
      { name: 'alignment', type: 'enum', label: 'Alignment', options: ['left', 'center', 'right'] },
      { name: 'overlay', type: 'boolean', label: 'Show Overlay' },
      { name: 'overlayOpacity', type: 'number', label: 'Overlay Opacity', min: 0, max: 1, step: 0.1 },
      { name: 'minHeight', type: 'string', label: 'Min Height', placeholder: '100vh' },
    ],
  },

  TextEditor: {
    name: 'TextEditor',
    displayName: 'Rich Text',
    category: 'content',
    description: 'Rich text editor with formatting options',
    icon: 'Type',
    previewImage: '/cms-previews/TextEditor.png',
    component: TextEditor,
    propsSchema: TextEditorPropsSchema,
    defaultProps: {
      content: '',
      alignment: 'left',
      maxWidth: 'prose',
    },
    supportsChildren: false,
    keywords: ['text', 'paragraph', 'content', 'wysiwyg'],
    editableProps: [
      { name: 'content', type: 'string', label: 'Content', multiline: true, required: true },
      { name: 'alignment', type: 'enum', label: 'Alignment', options: ['left', 'center', 'right', 'justify'] },
      { name: 'maxWidth', type: 'enum', label: 'Max Width', options: ['sm', 'md', 'lg', 'xl', 'full', 'prose'] },
    ],
  },

  Heading: {
    name: 'Heading',
    displayName: 'Heading',
    category: 'content',
    description: 'Configurable heading with various levels and styles',
    icon: 'Heading',
    previewImage: '/cms-previews/Heading.png',
    component: Heading,
    propsSchema: HeadingPropsSchema,
    defaultProps: {
      text: 'Heading',
      level: 'h2',
      alignment: 'left',
    },
    supportsChildren: false,
    keywords: ['heading', 'title', 'h1', 'h2', 'h3'],
    editableProps: [
      { name: 'text', type: 'string', label: 'Text', required: true },
      { name: 'level', type: 'enum', label: 'Level', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      { name: 'alignment', type: 'enum', label: 'Alignment', options: ['left', 'center', 'right'] },
      { name: 'color', type: 'color', label: 'Color' },
    ],
  },

  CallToAction: {
    name: 'CallToAction',
    displayName: 'Call to Action',
    category: 'content',
    description: 'CTA section with title, description and buttons',
    icon: 'MousePointerClick',
    previewImage: '/cms-previews/CallToAction.png',
    component: CallToAction,
    propsSchema: CallToActionPropsSchema,
    defaultProps: {
      title: 'Ready to Get Started?',
      description: 'Join thousands of students who have chosen JKKN',
      buttons: [],
      alignment: 'center',
    },
    supportsChildren: false,
    keywords: ['cta', 'action', 'button', 'conversion'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      { name: 'buttons', type: 'array', label: 'Buttons', description: 'Add CTA buttons' },
      { name: 'alignment', type: 'enum', label: 'Alignment', options: ['left', 'center', 'right'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'variant', type: 'enum', label: 'Style Variant', options: ['default', 'gradient', 'outlined', 'minimal'] },
    ],
  },

  Testimonials: {
    name: 'Testimonials',
    displayName: 'Testimonials',
    category: 'content',
    description: 'Display testimonials in carousel or grid layout',
    icon: 'Quote',
    previewImage: '/cms-previews/Testimonials.png',
    component: Testimonials,
    propsSchema: TestimonialsPropsSchema,
    defaultProps: {
      testimonials: [],
      layout: 'carousel',
      autoplay: true,
      showRating: true,
    },
    supportsChildren: false,
    keywords: ['testimonial', 'review', 'quote', 'feedback'],
    editableProps: [
      { name: 'testimonials', type: 'array', label: 'Testimonials', description: 'Add testimonials with name, role, company, image, and content' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid', 'single'] },
      { name: 'columns', type: 'number', label: 'Columns (Grid)', min: 1, max: 4 },
      { name: 'autoplay', type: 'boolean', label: 'Auto-play (Carousel)' },
      { name: 'autoplayInterval', type: 'number', label: 'Interval (ms)', min: 1000, max: 10000 },
      { name: 'showRating', type: 'boolean', label: 'Show Star Rating' },
      { name: 'showAvatar', type: 'boolean', label: 'Show Avatar' },
    ],
  },

  FAQAccordion: {
    name: 'FAQAccordion',
    displayName: 'FAQ Accordion',
    category: 'content',
    description: 'Expandable FAQ section with search',
    icon: 'HelpCircle',
    previewImage: '/cms-previews/FAQAccordion.png',
    component: FAQAccordion,
    propsSchema: FAQAccordionPropsSchema,
    defaultProps: {
      faqs: [],
      searchEnabled: true,
      allowMultiple: false,
    },
    supportsChildren: false,
    keywords: ['faq', 'accordion', 'questions', 'help'],
    editableProps: [
      { name: 'faqs', type: 'array', label: 'FAQ Items', description: 'Add questions and answers' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'searchEnabled', type: 'boolean', label: 'Enable Search' },
      { name: 'searchPlaceholder', type: 'string', label: 'Search Placeholder' },
      { name: 'allowMultiple', type: 'boolean', label: 'Allow Multiple Open' },
      { name: 'defaultOpen', type: 'number', label: 'Default Open Index', min: -1, description: '-1 for none' },
    ],
  },

  TabsBlock: {
    name: 'TabsBlock',
    displayName: 'Tabs',
    category: 'content',
    description: 'Tabbed content sections',
    icon: 'LayoutList',
    previewImage: '/cms-previews/TabsBlock.png',
    component: TabsBlock,
    propsSchema: TabsBlockPropsSchema,
    defaultProps: {
      tabs: [],
      variant: 'default',
    },
    supportsChildren: false,
    keywords: ['tabs', 'tabbed', 'sections'],
    editableProps: [
      { name: 'tabs', type: 'array', label: 'Tabs', description: 'Add tabs with title and content' },
      { name: 'defaultTab', type: 'number', label: 'Default Active Tab', min: 0 },
      { name: 'variant', type: 'enum', label: 'Style', options: ['default', 'underline', 'pills', 'boxed'] },
      { name: 'orientation', type: 'enum', label: 'Orientation', options: ['horizontal', 'vertical'] },
      { name: 'fullWidth', type: 'boolean', label: 'Full Width Tabs' },
    ],
  },

  Timeline: {
    name: 'Timeline',
    displayName: 'Timeline',
    category: 'content',
    description: 'Vertical timeline for events or milestones',
    icon: 'Calendar',
    previewImage: '/cms-previews/Timeline.png',
    component: Timeline,
    propsSchema: TimelinePropsSchema,
    defaultProps: {
      events: [],
      alternating: true,
    },
    supportsChildren: false,
    keywords: ['timeline', 'history', 'events', 'milestones'],
    editableProps: [
      { name: 'events', type: 'array', label: 'Timeline Events', description: 'Add events with date, title, description' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'alternating', type: 'boolean', label: 'Alternating Layout' },
      { name: 'lineColor', type: 'color', label: 'Line Color' },
      { name: 'showConnectors', type: 'boolean', label: 'Show Connectors' },
      { name: 'animated', type: 'boolean', label: 'Animate on Scroll' },
    ],
  },

  PricingTables: {
    name: 'PricingTables',
    displayName: 'Pricing Tables',
    category: 'content',
    description: 'Compare pricing plans with features',
    icon: 'CreditCard',
    previewImage: '/cms-previews/PricingTables.png',
    component: PricingTables,
    propsSchema: PricingTablesPropsSchema,
    defaultProps: {
      plans: [],
      columns: 3,
    },
    supportsChildren: false,
    keywords: ['pricing', 'plans', 'subscription', 'compare'],
    editableProps: [
      { name: 'plans', type: 'array', label: 'Pricing Plans', description: 'Add plans with name, price, features' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      { name: 'columns', type: 'number', label: 'Columns', min: 1, max: 4 },
      { name: 'currency', type: 'string', label: 'Currency Symbol', placeholder: '₹' },
      { name: 'billingPeriod', type: 'string', label: 'Billing Period', placeholder: '/month' },
      { name: 'highlightPopular', type: 'boolean', label: 'Highlight Popular Plan' },
    ],
  },

  // ==========================================
  // Media Blocks
  // ==========================================
  ImageBlock: {
    name: 'ImageBlock',
    displayName: 'Image',
    category: 'media',
    description: 'Single image with caption and link',
    icon: 'Image',
    previewImage: '/cms-previews/ImageBlock.png',
    component: ImageBlock,
    propsSchema: ImageBlockPropsSchema,
    defaultProps: {
      src: '',
      alt: '',
      objectFit: 'cover',
      alignment: 'center',
      lightbox: false,
    },
    supportsChildren: false,
    keywords: ['image', 'photo', 'picture'],
    editableProps: [
      { name: 'src', type: 'image', label: 'Image', required: true },
      { name: 'alt', type: 'string', label: 'Alt Text', required: true },
      { name: 'caption', type: 'string', label: 'Caption' },
      { name: 'width', type: 'number', label: 'Width (px)' },
      { name: 'height', type: 'number', label: 'Height (px)' },
      { name: 'objectFit', type: 'enum', label: 'Object Fit', options: ['cover', 'contain', 'fill', 'none'] },
      { name: 'alignment', type: 'enum', label: 'Alignment', options: ['left', 'center', 'right'] },
      { name: 'link', type: 'url', label: 'Link URL' },
      { name: 'lightbox', type: 'boolean', label: 'Enable Lightbox' },
    ],
  },

  ImageGallery: {
    name: 'ImageGallery',
    displayName: 'Image Gallery',
    category: 'media',
    description: 'Grid or masonry gallery with lightbox',
    icon: 'Images',
    previewImage: '/cms-previews/ImageGallery.png',
    component: ImageGallery,
    propsSchema: ImageGalleryPropsSchema,
    defaultProps: {
      images: [],
      layout: 'grid',
      columns: 3,
      lightbox: true,
      gap: 4,
    },
    supportsChildren: false,
    keywords: ['gallery', 'images', 'photos', 'grid'],
    editableProps: [
      { name: 'images', type: 'array', label: 'Images', description: 'Add images with src, alt, and caption' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['grid', 'masonry', 'justified'] },
      { name: 'columns', type: 'number', label: 'Columns', min: 1, max: 6 },
      { name: 'gap', type: 'number', label: 'Gap (px)', min: 0, max: 32 },
      { name: 'lightbox', type: 'boolean', label: 'Enable Lightbox' },
      { name: 'showCaptions', type: 'boolean', label: 'Show Captions' },
      { name: 'aspectRatio', type: 'enum', label: 'Aspect Ratio', options: ['auto', '1/1', '4/3', '16/9', '3/2'] },
    ],
  },

  VideoPlayer: {
    name: 'VideoPlayer',
    displayName: 'Video Player',
    category: 'media',
    description: 'Embed YouTube, Vimeo or self-hosted videos',
    icon: 'Video',
    previewImage: '/cms-previews/VideoPlayer.png',
    component: VideoPlayer,
    propsSchema: VideoPlayerPropsSchema,
    defaultProps: {
      src: '',
      provider: 'youtube',
      autoplay: false,
      controls: true,
      loop: false,
      muted: false,
      aspectRatio: '16/9',
    },
    supportsChildren: false,
    keywords: ['video', 'youtube', 'vimeo', 'embed'],
    editableProps: [
      { name: 'src', type: 'url', label: 'Video URL', required: true, description: 'YouTube/Vimeo URL or video file' },
      { name: 'provider', type: 'enum', label: 'Provider', options: ['youtube', 'vimeo', 'self-hosted'] },
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'autoplay', type: 'boolean', label: 'Auto-play' },
      { name: 'controls', type: 'boolean', label: 'Show Controls' },
      { name: 'loop', type: 'boolean', label: 'Loop' },
      { name: 'muted', type: 'boolean', label: 'Start Muted' },
      { name: 'aspectRatio', type: 'enum', label: 'Aspect Ratio', options: ['16/9', '4/3', '1/1', '9/16'] },
      { name: 'poster', type: 'image', label: 'Poster Image' },
    ],
  },

  ImageCarousel: {
    name: 'ImageCarousel',
    displayName: 'Image Carousel',
    category: 'media',
    description: 'Sliding image carousel with navigation',
    icon: 'GalleryHorizontal',
    previewImage: '/cms-previews/ImageCarousel.png',
    component: ImageCarousel,
    propsSchema: ImageCarouselPropsSchema,
    defaultProps: {
      images: [],
      autoplay: true,
      interval: 5000,
      showDots: true,
      showArrows: true,
    },
    supportsChildren: false,
    keywords: ['carousel', 'slider', 'slideshow'],
    editableProps: [
      { name: 'images', type: 'array', label: 'Carousel Images', description: 'Add images with src, alt, caption, and optional link' },
      { name: 'autoplay', type: 'boolean', label: 'Auto-play' },
      { name: 'interval', type: 'number', label: 'Interval (ms)', min: 1000, max: 10000 },
      { name: 'showDots', type: 'boolean', label: 'Show Navigation Dots' },
      { name: 'showArrows', type: 'boolean', label: 'Show Navigation Arrows' },
      { name: 'pauseOnHover', type: 'boolean', label: 'Pause on Hover' },
      { name: 'effect', type: 'enum', label: 'Transition Effect', options: ['slide', 'fade', 'zoom'] },
      { name: 'aspectRatio', type: 'enum', label: 'Aspect Ratio', options: ['auto', '16/9', '4/3', '21/9'] },
    ],
  },

  BeforeAfterSlider: {
    name: 'BeforeAfterSlider',
    displayName: 'Before/After Slider',
    category: 'media',
    description: 'Compare two images with a slider',
    icon: 'SplitSquareHorizontal',
    previewImage: '/cms-previews/BeforeAfterSlider.png',
    component: BeforeAfterSlider,
    propsSchema: BeforeAfterSliderPropsSchema,
    defaultProps: {
      beforeImage: '',
      afterImage: '',
      beforeLabel: 'Before',
      afterLabel: 'After',
      startPosition: 50,
    },
    supportsChildren: false,
    keywords: ['before', 'after', 'compare', 'slider'],
    editableProps: [
      { name: 'beforeImage', type: 'image', label: 'Before Image', required: true },
      { name: 'afterImage', type: 'image', label: 'After Image', required: true },
      { name: 'beforeLabel', type: 'string', label: 'Before Label' },
      { name: 'afterLabel', type: 'string', label: 'After Label' },
      { name: 'startPosition', type: 'number', label: 'Start Position (%)', min: 0, max: 100 },
      { name: 'orientation', type: 'enum', label: 'Orientation', options: ['horizontal', 'vertical'] },
      { name: 'showLabels', type: 'boolean', label: 'Show Labels' },
    ],
  },

  LogoCloud: {
    name: 'LogoCloud',
    displayName: 'Logo Cloud',
    category: 'media',
    description: 'Display partner/sponsor logos',
    icon: 'Shapes',
    previewImage: '/cms-previews/LogoCloud.png',
    component: LogoCloud,
    propsSchema: LogoCloudPropsSchema,
    defaultProps: {
      logos: [],
      layout: 'grid',
      grayscale: true,
      columns: 6,
    },
    supportsChildren: false,
    keywords: ['logos', 'partners', 'sponsors', 'clients'],
    editableProps: [
      { name: 'logos', type: 'array', label: 'Logos', description: 'Add logos with image, name, and optional link' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['grid', 'row', 'carousel'] },
      { name: 'columns', type: 'number', label: 'Columns (Grid)', min: 2, max: 8 },
      { name: 'grayscale', type: 'boolean', label: 'Grayscale Effect' },
      { name: 'hoverColor', type: 'boolean', label: 'Color on Hover' },
      { name: 'maxLogoHeight', type: 'number', label: 'Max Logo Height (px)', min: 20, max: 200 },
    ],
  },

  // ==========================================
  // Layout Blocks
  // ==========================================
  Container: {
    name: 'Container',
    displayName: 'Container',
    category: 'layout',
    description: 'Content wrapper with max-width and padding',
    icon: 'Box',
    previewImage: '/cms-previews/Container.png',
    component: Container,
    propsSchema: ContainerPropsSchema,
    defaultProps: {
      maxWidth: 'xl',
      padding: '4',
      centered: true,
    },
    supportsChildren: true,
    keywords: ['container', 'wrapper', 'section'],
    editableProps: [
      { name: 'maxWidth', type: 'enum', label: 'Max Width', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] },
      { name: 'padding', type: 'string', label: 'Padding', placeholder: '4' },
      { name: 'centered', type: 'boolean', label: 'Centered' },
      { name: 'background', type: 'color', label: 'Background Color' },
    ],
  },

  GridLayout: {
    name: 'GridLayout',
    displayName: 'Grid Layout',
    category: 'layout',
    description: 'Responsive grid container',
    icon: 'LayoutGrid',
    previewImage: '/cms-previews/GridLayout.png',
    component: GridLayout,
    propsSchema: GridLayoutPropsSchema,
    defaultProps: {
      columns: 3,
      gap: 4,
      responsive: { sm: 1, md: 2, lg: 3 },
    },
    supportsChildren: true,
    keywords: ['grid', 'columns', 'layout'],
    editableProps: [
      { name: 'columns', type: 'number', label: 'Columns', min: 1, max: 12, description: 'Number of columns on desktop' },
      { name: 'gap', type: 'number', label: 'Gap', min: 0, max: 16, description: 'Spacing between items' },
      { name: 'columnsSm', type: 'number', label: 'Columns (Mobile)', min: 1, max: 4 },
      { name: 'columnsMd', type: 'number', label: 'Columns (Tablet)', min: 1, max: 6 },
      { name: 'columnsLg', type: 'number', label: 'Columns (Desktop)', min: 1, max: 12 },
      { name: 'alignItems', type: 'enum', label: 'Align Items', options: ['start', 'center', 'end', 'stretch'] },
    ],
  },

  FlexboxLayout: {
    name: 'FlexboxLayout',
    displayName: 'Flexbox Layout',
    category: 'layout',
    description: 'Flexible box container',
    icon: 'LayoutPanelLeft',
    previewImage: '/cms-previews/FlexboxLayout.png',
    component: FlexboxLayout,
    propsSchema: FlexboxLayoutPropsSchema,
    defaultProps: {
      direction: 'row',
      justify: 'start',
      align: 'center',
      wrap: true,
      gap: 4,
    },
    supportsChildren: true,
    keywords: ['flex', 'flexbox', 'layout', 'row', 'column'],
    editableProps: [
      { name: 'direction', type: 'enum', label: 'Direction', options: ['row', 'row-reverse', 'column', 'column-reverse'] },
      { name: 'justify', type: 'enum', label: 'Justify Content', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
      { name: 'align', type: 'enum', label: 'Align Items', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
      { name: 'wrap', type: 'boolean', label: 'Wrap Items' },
      { name: 'gap', type: 'number', label: 'Gap', min: 0, max: 16, description: 'Spacing between items' },
      { name: 'reverseOnMobile', type: 'boolean', label: 'Reverse on Mobile' },
    ],
  },

  Spacer: {
    name: 'Spacer',
    displayName: 'Spacer',
    category: 'layout',
    description: 'Vertical spacing element',
    icon: 'ArrowUpDown',
    previewImage: '/cms-previews/Spacer.png',
    component: Spacer,
    propsSchema: SpacerPropsSchema,
    defaultProps: {
      height: '8',
      responsive: { sm: '4', md: '6', lg: '8' },
    },
    supportsChildren: false,
    keywords: ['spacer', 'spacing', 'gap', 'margin'],
    editableProps: [
      { name: 'height', type: 'string', label: 'Height', placeholder: '8', description: 'Tailwind spacing value (4, 8, 16, etc.)' },
    ],
  },

  Divider: {
    name: 'Divider',
    displayName: 'Divider',
    category: 'layout',
    description: 'Horizontal line separator',
    icon: 'Minus',
    previewImage: '/cms-previews/Divider.png',
    component: Divider,
    propsSchema: DividerPropsSchema,
    defaultProps: {
      style: 'solid',
      thickness: 1,
      width: 'full',
    },
    supportsChildren: false,
    keywords: ['divider', 'separator', 'line', 'hr'],
    editableProps: [
      { name: 'style', type: 'enum', label: 'Style', options: ['solid', 'dashed', 'dotted'] },
      { name: 'color', type: 'color', label: 'Color' },
      { name: 'thickness', type: 'number', label: 'Thickness', min: 1, max: 10 },
      { name: 'width', type: 'enum', label: 'Width', options: ['full', '3/4', '1/2', '1/4'] },
    ],
  },

  SectionWrapper: {
    name: 'SectionWrapper',
    displayName: 'Section Wrapper',
    category: 'layout',
    description: 'Full-width section with background options',
    icon: 'Square',
    previewImage: '/cms-previews/SectionWrapper.png',
    component: SectionWrapper,
    propsSchema: SectionWrapperPropsSchema,
    defaultProps: {
      padding: '16',
      fullWidth: true,
    },
    supportsChildren: true,
    keywords: ['section', 'wrapper', 'background', 'full-width'],
    editableProps: [
      { name: 'padding', type: 'string', label: 'Padding', placeholder: '16', description: 'Tailwind spacing value' },
      { name: 'paddingTop', type: 'string', label: 'Padding Top' },
      { name: 'paddingBottom', type: 'string', label: 'Padding Bottom' },
      { name: 'fullWidth', type: 'boolean', label: 'Full Width' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
      { name: 'backgroundOverlay', type: 'boolean', label: 'Dark Overlay' },
      { name: 'overlayOpacity', type: 'number', label: 'Overlay Opacity', min: 0, max: 1, step: 0.1 },
      { name: 'minHeight', type: 'string', label: 'Min Height', placeholder: '400px' },
    ],
  },

  // ==========================================
  // Data Blocks
  // ==========================================
  StatsCounter: {
    name: 'StatsCounter',
    displayName: 'Stats Counter',
    category: 'data',
    description: 'Animated statistics counter with icons',
    icon: 'BarChart3',
    previewImage: '/cms-previews/StatsCounter.png',
    component: StatsCounter,
    propsSchema: StatsCounterPropsSchema,
    defaultProps: {
      stats: [],
      layout: 'row',
      columns: 4,
      animate: true,
      showIcons: true,
      variant: 'default',
    },
    supportsChildren: false,
    keywords: ['stats', 'counter', 'numbers', 'metrics', 'animated'],
    editableProps: [
      { name: 'stats', type: 'array', label: 'Statistics', description: 'Add statistics to display' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['row', 'grid'] },
      { name: 'columns', type: 'number', label: 'Columns (Grid)', min: 1, max: 6 },
      { name: 'animate', type: 'boolean', label: 'Animate Numbers' },
      { name: 'showIcons', type: 'boolean', label: 'Show Icons' },
      { name: 'variant', type: 'enum', label: 'Style', options: ['default', 'cards', 'minimal'] },
    ],
  },

  EventsList: {
    name: 'EventsList',
    displayName: 'Events List',
    category: 'data',
    description: 'Display upcoming events in list or grid format',
    icon: 'Calendar',
    previewImage: '/cms-previews/EventsList.png',
    component: EventsList,
    propsSchema: EventsListPropsSchema,
    defaultProps: {
      title: 'Upcoming Events',
      events: [],
      layout: 'list',
      showPastEvents: false,
      maxItems: 5,
      showViewAll: true,
      viewAllLink: '/events',
    },
    supportsChildren: false,
    keywords: ['events', 'calendar', 'upcoming', 'schedule'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'events', type: 'array', label: 'Events', description: 'Add events manually' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['list', 'grid', 'calendar'] },
      { name: 'showPastEvents', type: 'boolean', label: 'Show Past Events' },
      { name: 'maxItems', type: 'number', label: 'Max Items', min: 1, max: 20 },
      { name: 'showViewAll', type: 'boolean', label: 'Show View All Link' },
      { name: 'viewAllLink', type: 'url', label: 'View All URL' },
    ],
  },

  FacultyDirectory: {
    name: 'FacultyDirectory',
    displayName: 'Faculty Directory',
    category: 'data',
    description: 'Display faculty members with contact information',
    icon: 'Users',
    previewImage: '/cms-previews/FacultyDirectory.png',
    component: FacultyDirectory,
    propsSchema: FacultyDirectoryPropsSchema,
    defaultProps: {
      title: 'Our Faculty',
      faculty: [],
      layout: 'grid',
      columns: 4,
      showDepartmentFilter: true,
      showSearchBox: true,
      maxItems: 12,
    },
    supportsChildren: false,
    keywords: ['faculty', 'staff', 'team', 'directory', 'teachers'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'faculty', type: 'array', label: 'Faculty Members', description: 'Add faculty manually' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['grid', 'list', 'compact'] },
      { name: 'columns', type: 'number', label: 'Columns (Grid)', min: 1, max: 5 },
      { name: 'showDepartmentFilter', type: 'boolean', label: 'Show Department Filter' },
      { name: 'showSearchBox', type: 'boolean', label: 'Show Search Box' },
      { name: 'maxItems', type: 'number', label: 'Max Items', min: 1, max: 50 },
      { name: 'departmentFilter', type: 'string', label: 'Filter by Department' },
    ],
  },

  AnnouncementsFeed: {
    name: 'AnnouncementsFeed',
    displayName: 'Announcements Feed',
    category: 'data',
    description: 'Display announcements with priority and categories',
    icon: 'Bell',
    previewImage: '/cms-previews/AnnouncementsFeed.png',
    component: AnnouncementsFeed,
    propsSchema: AnnouncementsFeedPropsSchema,
    defaultProps: {
      title: 'Announcements',
      announcements: [],
      layout: 'list',
      maxItems: 5,
      showDate: true,
      showCategory: true,
      showViewAll: true,
      viewAllLink: '/announcements',
      autoScroll: false,
    },
    supportsChildren: false,
    keywords: ['announcements', 'news', 'notifications', 'updates', 'notices'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'announcements', type: 'array', label: 'Announcements', description: 'Add announcements manually' },
      { name: 'layout', type: 'enum', label: 'Display Style', options: ['list', 'cards', 'ticker'] },
      { name: 'maxItems', type: 'number', label: 'Max Items', min: 1, max: 20 },
      { name: 'showDate', type: 'boolean', label: 'Show Date' },
      { name: 'showCategory', type: 'boolean', label: 'Show Category' },
      { name: 'showViewAll', type: 'boolean', label: 'Show View All Link' },
      { name: 'viewAllLink', type: 'url', label: 'View All URL' },
      { name: 'autoScroll', type: 'boolean', label: 'Auto Scroll (Ticker)' },
    ],
  },

  BlogPostsGrid: {
    name: 'BlogPostsGrid',
    displayName: 'Blog Posts Grid',
    category: 'data',
    description: 'Display blog posts in grid, list, or featured layout',
    icon: 'FileText',
    previewImage: '/cms-previews/BlogPostsGrid.png',
    component: BlogPostsGrid,
    propsSchema: BlogPostsGridPropsSchema,
    defaultProps: {
      title: 'Latest News',
      posts: [],
      layout: 'grid',
      columns: 3,
      showExcerpt: true,
      showAuthor: true,
      showDate: true,
      showCategory: true,
      maxItems: 6,
      showViewAll: true,
      viewAllLink: '/blog',
    },
    supportsChildren: false,
    keywords: ['blog', 'posts', 'articles', 'news', 'content'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'posts', type: 'array', label: 'Blog Posts', description: 'Add posts manually' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['grid', 'list', 'featured'] },
      { name: 'columns', type: 'number', label: 'Columns (Grid)', min: 1, max: 4 },
      { name: 'showExcerpt', type: 'boolean', label: 'Show Excerpt' },
      { name: 'showAuthor', type: 'boolean', label: 'Show Author' },
      { name: 'showDate', type: 'boolean', label: 'Show Date' },
      { name: 'showCategory', type: 'boolean', label: 'Show Category' },
      { name: 'maxItems', type: 'number', label: 'Max Items', min: 1, max: 20 },
      { name: 'categoryFilter', type: 'string', label: 'Filter by Category' },
      { name: 'showViewAll', type: 'boolean', label: 'Show View All Link' },
      { name: 'viewAllLink', type: 'url', label: 'View All URL' },
    ],
  },
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get a component from the registry by name
 */
export function getComponent(name: string): ComponentType<BaseBlockProps> | null {
  const entry = COMPONENT_REGISTRY[name]
  if (!entry) {
    console.warn(`Component "${name}" not found in registry`)
    return null
  }
  return entry.component
}

/**
 * Get component entry from registry
 */
export function getComponentEntry(name: string): ComponentRegistryEntry | null {
  return COMPONENT_REGISTRY[name] || null
}

/**
 * Validate component props against its schema
 */
export function validateProps<T>(
  componentName: string,
  props: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const entry = COMPONENT_REGISTRY[componentName]
  if (!entry) {
    return {
      success: false,
      errors: new z.ZodError([
        {
          code: 'custom',
          path: [],
          message: `Component "${componentName}" not found in registry`,
        },
      ]),
    }
  }

  const result = entry.propsSchema.safeParse(props)
  if (result.success) {
    return { success: true, data: result.data as T }
  }
  return { success: false, errors: result.error }
}

/**
 * Get default props for a component
 */
export function getDefaultProps(componentName: string): Record<string, unknown> {
  const entry = COMPONENT_REGISTRY[componentName]
  if (!entry) {
    console.warn(`Component "${componentName}" not found in registry`)
    return {}
  }
  return entry.defaultProps as Record<string, unknown>
}

/**
 * Get all components in a category
 */
export function getComponentsByCategory(
  category: ComponentCategory
): ComponentRegistryEntry[] {
  return Object.values(COMPONENT_REGISTRY).filter(
    (entry) => entry.category === category
  )
}

/**
 * Search components by name or keywords
 */
export function searchComponents(query: string): ComponentRegistryEntry[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(COMPONENT_REGISTRY).filter((entry) => {
    const matchesName =
      entry.name.toLowerCase().includes(lowerQuery) ||
      entry.displayName.toLowerCase().includes(lowerQuery)
    const matchesDescription = entry.description?.toLowerCase().includes(lowerQuery)
    const matchesKeywords = entry.keywords?.some((kw) =>
      kw.toLowerCase().includes(lowerQuery)
    )
    return matchesName || matchesDescription || matchesKeywords
  })
}

/**
 * Get all component names
 */
export function getComponentNames(): string[] {
  return Object.keys(COMPONENT_REGISTRY)
}

/**
 * Get all available categories
 */
export function getCategories(): ComponentCategory[] {
  return ['content', 'media', 'layout', 'data']
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: ComponentCategory): string {
  const names: Record<ComponentCategory, string> = {
    content: 'Content',
    media: 'Media',
    layout: 'Layout',
    data: 'Data',
  }
  return names[category]
}

/**
 * Check if a component supports children (nested blocks)
 */
export function supportsChildren(componentName: string): boolean {
  const entry = COMPONENT_REGISTRY[componentName]
  return entry?.supportsChildren ?? false
}
