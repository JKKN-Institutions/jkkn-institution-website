import { lazy, type ComponentType } from 'react'
import { z } from 'zod'
import type {
  ComponentRegistry,
  ComponentRegistryEntry,
  ComponentCategory,
  BaseBlockProps,
  EditableProp,
} from './registry-types'
import { SHADCN_COMPONENTS } from './shadcn-components-registry'

// ==========================================
// Custom Component Registry (Dynamic)
// ==========================================

/**
 * JSON Schema property definition
 */
interface JsonSchemaProperty {
  type: string
  title?: string
  description?: string
  default?: unknown
  enum?: string[]
  minimum?: number
  maximum?: number
  format?: string
  items?: {
    type: string
    properties?: Record<string, JsonSchemaProperty>
    required?: string[]
  }
}

/**
 * JSON Schema structure from props_schema
 */
interface JsonSchema {
  type: string
  properties?: Record<string, JsonSchemaProperty>
  required?: string[]
}

/**
 * Interface for custom component data from database
 */
export interface CustomComponentData {
  id: string
  name: string
  display_name: string
  description?: string
  category: string
  icon?: string
  preview_image?: string
  code: string
  default_props: Record<string, unknown>
  props_schema?: JsonSchema
  is_active: boolean
}

/**
 * Runtime registry for custom components
 * This gets populated when custom components are loaded from the database
 */
const CUSTOM_COMPONENT_REGISTRY: Map<string, {
  entry: ComponentRegistryEntry
  customData: CustomComponentData
}> = new Map()

/**
 * Subscribers that get notified when custom components are registered
 */
const registrySubscribers: Set<() => void> = new Set()

/**
 * Subscribe to custom component registry changes
 * Returns an unsubscribe function
 */
export function subscribeToCustomComponentRegistry(callback: () => void): () => void {
  registrySubscribers.add(callback)
  return () => registrySubscribers.delete(callback)
}

/**
 * Notify all subscribers of registry changes
 */
function notifyRegistrySubscribers(): void {
  registrySubscribers.forEach(callback => callback())
}

/**
 * Convert JSON Schema property type to EditableProp type
 */
function mapSchemaTypeToEditableType(
  schemaType: string,
  format?: string,
  hasEnum?: boolean,
  hasItems?: boolean
): EditableProp['type'] {
  if (hasEnum) return 'enum'
  if (hasItems) return 'array'

  switch (schemaType) {
    case 'string':
      if (format === 'uri' || format === 'url') return 'url'
      if (format === 'color') return 'color'
      if (format === 'image') return 'image'
      if (format === 'video') return 'video'
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      return 'array'
    default:
      return 'string'
  }
}

/**
 * Detect if an array schema represents an image array
 * (items have 'src' property with uri format, or 'src' and 'alt' properties)
 */
function isImageArraySchema(items: JsonSchemaProperty['items']): boolean {
  if (!items || items.type !== 'object' || !items.properties) {
    return false
  }
  const props = items.properties
  // Check if it has 'src' property (with uri format) - typical for image arrays
  if (props.src && (props.src.format === 'uri' || props.src.type === 'string')) {
    // Additional check: should also have 'alt' for accessibility
    if (props.alt) {
      return true
    }
    // Or just 'src' is enough if it's clearly an image URL
    return true
  }
  return false
}

/**
 * Convert JSON Schema to EditableProp array for the Props Panel
 */
function convertPropsSchemaToEditableProps(
  propsSchema: JsonSchema | undefined,
  defaultProps: Record<string, unknown>
): EditableProp[] {
  if (!propsSchema || !propsSchema.properties) {
    return []
  }

  const editableProps: EditableProp[] = []
  const requiredFields = propsSchema.required || []

  for (const [name, prop] of Object.entries(propsSchema.properties)) {
    const editableProp: EditableProp = {
      name,
      label: prop.title || formatPropertyName(name),
      type: mapSchemaTypeToEditableType(
        prop.type,
        prop.format,
        !!prop.enum,
        !!prop.items
      ),
      description: prop.description,
      required: requiredFields.includes(name),
      defaultValue: prop.default ?? defaultProps[name],
    }

    // Add enum options
    if (prop.enum) {
      editableProp.options = prop.enum
    }

    // Add number constraints
    if (prop.type === 'number' || prop.type === 'integer') {
      if (prop.minimum !== undefined) editableProp.min = prop.minimum
      if (prop.maximum !== undefined) editableProp.max = prop.maximum
    }

    // For array types, detect item type and pass item schema
    if (prop.items) {
      if (isImageArraySchema(prop.items)) {
        editableProp.itemType = 'image'
      } else if (prop.items.type === 'object' && prop.items.properties) {
        editableProp.itemType = 'object'
      } else {
        editableProp.itemType = 'string'
      }

      // Pass the item schema for object arrays
      if (prop.items.type === 'object' && prop.items.properties) {
        editableProp.itemSchema = {
          properties: Object.fromEntries(
            Object.entries(prop.items.properties).map(([key, val]) => [
              key,
              {
                type: val.type,
                label: val.title || formatPropertyName(key),
                required: prop.items?.required?.includes(key),
                format: val.format,
              }
            ])
          ),
          required: prop.items.required,
        }
      }
    }

    editableProps.push(editableProp)
  }

  return editableProps
}

/**
 * Convert property name to display label (camelCase to Title Case)
 */
function formatPropertyName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Register a custom component into the runtime registry
 */
export function registerCustomComponent(customComponent: CustomComponentData): void {
  // Create a lazy-loaded wrapper for the custom component
  const CustomComponentWrapper = lazy(() =>
    import('@/components/cms-blocks/custom/custom-component-wrapper').then(module => ({
      default: module.createCustomComponent(customComponent)
    }))
  )

  // Convert props_schema from database to editableProps for Props Panel
  const editableProps = convertPropsSchemaToEditableProps(
    customComponent.props_schema,
    customComponent.default_props || {}
  )

  const entry: ComponentRegistryEntry = {
    name: customComponent.name,
    displayName: customComponent.display_name,
    description: customComponent.description || `Custom component: ${customComponent.display_name}`,
    category: 'custom' as ComponentCategory,
    icon: customComponent.icon || 'Puzzle',
    component: CustomComponentWrapper as unknown as ComponentType<BaseBlockProps>,
    propsSchema: z.record(z.string(), z.unknown()), // Custom components accept any props
    defaultProps: customComponent.default_props || {},
    previewImage: customComponent.preview_image,
    supportsChildren: false,
    isCustomComponent: true,
    editableProps, // Include editableProps converted from props_schema
  }

  CUSTOM_COMPONENT_REGISTRY.set(customComponent.name, {
    entry,
    customData: customComponent,
  })

  // Notify subscribers that a component was registered
  notifyRegistrySubscribers()
}

/**
 * Unregister a custom component from the runtime registry
 */
export function unregisterCustomComponent(name: string): void {
  CUSTOM_COMPONENT_REGISTRY.delete(name)
  notifyRegistrySubscribers()
}

/**
 * Register multiple custom components
 * Note: Each registerCustomComponent call notifies subscribers individually.
 * For batch registration, this is acceptable since the canvas will just
 * re-render a few times as components are added.
 */
export function registerCustomComponents(components: CustomComponentData[]): void {
  components.forEach(registerCustomComponent)
}

/**
 * Clear all custom components from the registry
 */
export function clearCustomComponentRegistry(): void {
  CUSTOM_COMPONENT_REGISTRY.clear()
}

/**
 * Get custom component data by name
 */
export function getCustomComponentData(name: string): CustomComponentData | null {
  return CUSTOM_COMPONENT_REGISTRY.get(name)?.customData || null
}

/**
 * Check if a component is a custom component
 */
export function isCustomComponent(name: string): boolean {
  return CUSTOM_COMPONENT_REGISTRY.has(name)
}
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
const EventsList = lazy(() => import('@/components/cms-blocks/data/events-list'))
const FacultyDirectory = lazy(() => import('@/components/cms-blocks/data/faculty-directory'))
const AnnouncementsFeed = lazy(() => import('@/components/cms-blocks/data/announcements-feed'))
const BlogPostsGrid = lazy(() => import('@/components/cms-blocks/data/blog-posts-grid'))

// Modern blocks (enhanced components with animations and brand colors)
const AnimatedCounter = lazy(() => import('@/components/cms-blocks/modern/animated-counter'))
const BentoGrid = lazy(() => import('@/components/cms-blocks/modern/bento-grid'))
const GradientCard = lazy(() => import('@/components/cms-blocks/modern/gradient-card'))

// News ticker / announcements
const NewsTicker = lazy(() => import('@/components/cms-blocks/content/news-ticker'))

// About section
const AboutSection = lazy(() => import('@/components/cms-blocks/content/about-section'))

// Google Drive video embed
const GoogleDriveVideo = lazy(() => import('@/components/cms-blocks/media/google-drive-video'))

// Institutions Grid
const InstitutionsGrid = lazy(() => import('@/components/cms-blocks/content/institutions-grid'))

// Stats Counter (Our Strength)
const StatsCounter = lazy(() => import('@/components/cms-blocks/content/stats-counter'))

// College News
const CollegeNews = lazy(() => import('@/components/cms-blocks/content/college-news'))

// Latest Buzz
const LatestBuzz = lazy(() => import('@/components/cms-blocks/content/latest-buzz'))

// Past Events
const PastEvents = lazy(() => import('@/components/cms-blocks/content/past-events'))

// Campus Videos
const CampusVideos = lazy(() => import('@/components/cms-blocks/content/campus-videos'))

// Partners Logos
const PartnersLogos = lazy(() => import('@/components/cms-blocks/content/partners-logos'))

// Vision Mission
const VisionMission = lazy(() => import('@/components/cms-blocks/content/vision-mission'))

// Our Trust
const OurTrust = lazy(() => import('@/components/cms-blocks/content/our-trust'))

// shadcn/ui blocks
const ShadcnButtonBlock = lazy(() => import('@/components/cms-blocks/shadcn/button-block'))
const ShadcnInputBlock = lazy(() => import('@/components/cms-blocks/shadcn/input-block'))
const ShadcnTextareaBlock = lazy(() => import('@/components/cms-blocks/shadcn/textarea-block'))
const ShadcnCheckboxBlock = lazy(() => import('@/components/cms-blocks/shadcn/checkbox-block'))
const ShadcnSwitchBlock = lazy(() => import('@/components/cms-blocks/shadcn/switch-block'))
const ShadcnSliderBlock = lazy(() => import('@/components/cms-blocks/shadcn/slider-block'))
const ShadcnCardBlock = lazy(() => import('@/components/cms-blocks/shadcn/card-block'))
const ShadcnBadgeBlock = lazy(() => import('@/components/cms-blocks/shadcn/badge-block'))
const ShadcnAlertBlock = lazy(() => import('@/components/cms-blocks/shadcn/alert-block'))
const ShadcnProgressBlock = lazy(() => import('@/components/cms-blocks/shadcn/progress-block'))
const ShadcnSeparatorBlock = lazy(() => import('@/components/cms-blocks/shadcn/separator-block'))
const ShadcnAvatarBlock = lazy(() => import('@/components/cms-blocks/shadcn/avatar-block'))
const ShadcnTabsBlock = lazy(() => import('@/components/cms-blocks/shadcn/tabs-block'))
const ShadcnBreadcrumbBlock = lazy(() => import('@/components/cms-blocks/shadcn/breadcrumb-block'))
const ShadcnTooltipBlock = lazy(() => import('@/components/cms-blocks/shadcn/tooltip-block'))
const ShadcnAccordionBlock = lazy(() => import('@/components/cms-blocks/shadcn/accordion-block'))
const ShadcnCollapsibleBlock = lazy(() => import('@/components/cms-blocks/shadcn/collapsible-block'))

// ==========================================
// shadcn Block Components Map
// Maps shadcn component names to their lazy-loaded block components
// ==========================================
const SHADCN_BLOCK_COMPONENTS: Record<string, ComponentType<BaseBlockProps>> = {
  ShadcnButton: ShadcnButtonBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnInput: ShadcnInputBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnTextarea: ShadcnTextareaBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnCheckbox: ShadcnCheckboxBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnSwitch: ShadcnSwitchBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnSlider: ShadcnSliderBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnCard: ShadcnCardBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnBadge: ShadcnBadgeBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnAlert: ShadcnAlertBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnProgress: ShadcnProgressBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnSeparator: ShadcnSeparatorBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnAvatar: ShadcnAvatarBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnTabs: ShadcnTabsBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnBreadcrumb: ShadcnBreadcrumbBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnTooltip: ShadcnTooltipBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnAccordion: ShadcnAccordionBlock as unknown as ComponentType<BaseBlockProps>,
  ShadcnCollapsible: ShadcnCollapsibleBlock as unknown as ComponentType<BaseBlockProps>,
}

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
      subtitle: 'Excellence in Education Since 1971',
      titleColor: '#ffffff',
      titleFontSize: '5xl',
      titleFontWeight: 'bold',
      titleFontStyle: 'normal',
      subtitleColor: '#fbfbee', // Brand cream for better visibility
      subtitleFontSize: 'xl',
      subtitleFontWeight: 'normal',
      subtitleFontStyle: 'normal',
      backgroundType: 'gradient',
      backgroundGradient: 'linear-gradient(135deg, #0b6d41, #085032)', // JKKN Green gradient
      alignment: 'center',
      overlay: true,
      overlayOpacity: 0.3,
      ctaButtons: [
        { label: 'Explore Programs', link: '/programs', variant: 'primary' },
        { label: 'Apply Now', link: '/apply', variant: 'secondary' },
      ],
      minHeight: '100vh',
    },
    supportsChildren: false,
    isFullWidth: true,
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

  NewsTicker: {
    name: 'NewsTicker',
    displayName: 'News Ticker',
    category: 'content',
    description: 'Scrolling news ticker/marquee for announcements and updates - perfect below hero sections',
    icon: 'Megaphone',
    previewImage: '/cms-previews/NewsTicker.png',
    component: NewsTicker,
    propsSchema: z.object({
      label: z.string().default('NEWS'),
      items: z.array(z.object({
        text: z.string(),
        link: z.string().optional(),
        isHighlight: z.boolean().default(false),
      })).default([]),
      separator: z.string().default('|'),
      backgroundColor: z.string().default('#0b6d41'),
      labelBackgroundColor: z.string().default('#085032'),
      textColor: z.string().default('#ffffff'),
      highlightColor: z.string().default('#ffde59'),
      icon: z.enum(['megaphone', 'newspaper', 'bell', 'alert', 'sparkles', 'none']).default('megaphone'),
      speed: z.enum(['slow', 'normal', 'fast']).default('normal'),
      pauseOnHover: z.boolean().default(true),
      direction: z.enum(['left', 'right']).default('left'),
      height: z.enum(['sm', 'md', 'lg']).default('md'),
      showLabel: z.boolean().default(true),
    }),
    defaultProps: {
      label: 'NEWS',
      items: [
        { text: 'Apply Now!', link: '/apply', isHighlight: true },
        { text: 'Limited Seats Available', link: '/programs', isHighlight: false },
        { text: 'Early Bird Discount Available', link: '/admissions', isHighlight: true },
        { text: 'Breaking News: Admissions Open for Academic Year 2025-2026', link: '/admissions', isHighlight: false },
      ],
      separator: '|',
      backgroundColor: '#0b6d41',
      labelBackgroundColor: '#085032',
      textColor: '#ffffff',
      highlightColor: '#ffde59',
      icon: 'megaphone',
      speed: 'normal',
      pauseOnHover: true,
      direction: 'left',
      height: 'md',
      showLabel: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['news', 'ticker', 'marquee', 'announcements', 'updates', 'scrolling', 'breaking news'],
    editableProps: [
      { name: 'label', type: 'string', label: 'Label Text', description: 'e.g., NEWS, UPDATES, ALERTS' },
      { name: 'items', type: 'array', label: 'News Items', description: 'Add news items with text and optional link' },
      { name: 'separator', type: 'string', label: 'Separator', description: 'Character between items (e.g., |, •, -)' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'labelBackgroundColor', type: 'color', label: 'Label Background' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
      { name: 'highlightColor', type: 'color', label: 'Highlight Color' },
      { name: 'icon', type: 'enum', label: 'Icon', options: ['megaphone', 'newspaper', 'bell', 'alert', 'sparkles', 'none'] },
      { name: 'speed', type: 'enum', label: 'Scroll Speed', options: ['slow', 'normal', 'fast'] },
      { name: 'pauseOnHover', type: 'boolean', label: 'Pause on Hover' },
      { name: 'direction', type: 'enum', label: 'Direction', options: ['left', 'right'] },
      { name: 'height', type: 'enum', label: 'Height', options: ['sm', 'md', 'lg'] },
      { name: 'showLabel', type: 'boolean', label: 'Show Label' },
    ],
  },

  AboutSection: {
    name: 'AboutSection',
    displayName: 'About Section',
    category: 'content',
    description: 'Two-column about section with split-color header, content paragraphs, and image with overlays',
    icon: 'BookOpen',
    previewImage: '/cms-previews/AboutSection.png',
    component: AboutSection,
    propsSchema: z.object({
      headerPart1: z.string().default('About'),
      headerPart2: z.string().default('JKKN Institution'),
      headerPart1Color: z.string().default('#000000'),
      headerPart2Color: z.string().default('#0b6d41'),
      subtitle: z.string().optional(),
      sectionTitle: z.string().default('Building Excellence Since 1998'),
      paragraph1: z.string().default(''),
      paragraph2: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().default('About JKKN'),
      imageBadge: z.string().optional(),
      imageTitle: z.string().optional(),
      imageSubtitle: z.string().optional(),
      backgroundColor: z.string().default('#ffffff'),
      badgeColor: z.string().default('#0b6d41'),
      showDecorative: z.boolean().default(true),
      layout: z.enum(['default', 'reversed']).default('default'),
    }),
    defaultProps: {
      headerPart1: 'About',
      headerPart2: 'JKKN Institution',
      headerPart1Color: '#000000',
      headerPart2Color: '#0b6d41',
      subtitle: 'A legacy of excellence in education, shaping futures and transforming lives',
      sectionTitle: 'Building Excellence Since 1998',
      paragraph1: 'JKKN Institution stands as a pioneering educational institution committed to providing world-class education and holistic development. With a rich legacy spanning over two decades, we have consistently delivered excellence in academics, research, and character building.',
      paragraph2: 'Our institution is built on the foundation of integrity, innovation, and inclusivity. We believe in nurturing not just students, but future leaders who will make a positive impact on society.',
      image: '',
      imageAlt: 'JKKN Campus',
      imageBadge: 'Est. 1998',
      imageTitle: 'JKKN Institution',
      imageSubtitle: 'Premier Educational Excellence',
      backgroundColor: '#ffffff',
      badgeColor: '#0b6d41',
      showDecorative: true,
      layout: 'default',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['about', 'institution', 'history', 'story', 'introduction', 'overview'],
    editableProps: [
      // Header
      { name: 'headerPart1', type: 'string', label: 'Header Part 1', required: true, description: 'First part of the header' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2', required: true, description: 'Second part (colored)' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      // Content
      { name: 'sectionTitle', type: 'string', label: 'Section Title', required: true },
      { name: 'paragraph1', type: 'string', label: 'Paragraph 1', multiline: true, required: true },
      { name: 'paragraph2', type: 'string', label: 'Paragraph 2', multiline: true },
      // Image
      { name: 'image', type: 'image', label: 'Image' },
      { name: 'imageAlt', type: 'string', label: 'Image Alt Text' },
      { name: 'imageBadge', type: 'string', label: 'Badge Text', description: 'e.g., "Est. 1998"' },
      { name: 'imageTitle', type: 'string', label: 'Image Overlay Title' },
      { name: 'imageSubtitle', type: 'string', label: 'Image Overlay Subtitle' },
      // Styling
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'badgeColor', type: 'color', label: 'Badge Color' },
      { name: 'showDecorative', type: 'boolean', label: 'Show Decorative Element' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['default', 'reversed'], description: 'Image on right (default) or left (reversed)' },
    ],
  },

  InstitutionsGrid: {
    name: 'InstitutionsGrid',
    displayName: 'Institutions Grid',
    category: 'content',
    description: 'Grid of institution cards with images and links - perfect for showcasing member institutions',
    icon: 'Building2',
    previewImage: '/cms-previews/InstitutionsGrid.png',
    component: InstitutionsGrid,
    propsSchema: z.object({
      headerPart1: z.string().default('Our JKKN'),
      headerPart2: z.string().default('Institutions'),
      headerPart1Color: z.string().default('#000000'),
      headerPart2Color: z.string().default('#0b6d41'),
      subtitle: z.string().optional(),
      institutions: z.array(z.object({
        name: z.string(),
        image: z.string(),
        link: z.string().optional(),
        description: z.string().optional(),
      })).default([]),
      columns: z.enum(['2', '3', '4']).default('3'),
      gap: z.enum(['sm', 'md', 'lg']).default('md'),
      backgroundColor: z.string().default('#ffffff'),
      cardStyle: z.enum(['modern', 'minimal', 'bordered']).default('modern'),
      showHoverEffect: z.boolean().default(true),
      accentColor: z.string().default('#0b6d41'),
    }),
    defaultProps: {
      headerPart1: 'Our JKKN',
      headerPart2: 'Institutions',
      headerPart1Color: '#000000',
      headerPart2Color: '#0b6d41',
      subtitle: 'Excellence across diverse educational disciplines',
      institutions: [
        { name: 'JKKN College of Engineering & Technology', image: '', link: '/institutions/engineering', description: 'Engineering excellence since 2006' },
        { name: 'JKKN College of Pharmacy', image: '', link: '/institutions/pharmacy', description: 'Leading pharmaceutical education' },
        { name: 'JKKN Dental College & Hospital', image: '', link: '/institutions/dental', description: 'Premier dental education' },
        { name: 'JKKN College of Arts & Science', image: '', link: '/institutions/arts-science', description: 'Arts and sciences education' },
        { name: 'JKKN College of Nursing', image: '', link: '/institutions/nursing', description: 'Compassionate nursing care' },
        { name: 'JKKN College of Allied Health Sciences', image: '', link: '/institutions/allied-health', description: 'Healthcare professionals' },
      ],
      columns: '3',
      gap: 'md',
      backgroundColor: '#ffffff',
      cardStyle: 'modern',
      showHoverEffect: true,
      accentColor: '#0b6d41',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['institutions', 'colleges', 'grid', 'cards', 'showcase', 'schools', 'departments'],
    editableProps: [
      // Header
      { name: 'headerPart1', type: 'string', label: 'Header Part 1', required: true, description: 'First part of header' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2', required: true, description: 'Second part (colored)' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      // Institutions array
      {
        name: 'institutions',
        type: 'array',
        label: 'Institutions',
        description: 'Add institution cards with name, image, and optional link',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Institution Name', required: true },
            image: { type: 'string', label: 'Image URL', format: 'uri' },
            link: { type: 'string', label: 'Link URL' },
            description: { type: 'string', label: 'Description' },
          },
          required: ['name', 'image'],
        },
      },
      // Layout
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '3', '4'] },
      { name: 'gap', type: 'enum', label: 'Gap', options: ['sm', 'md', 'lg'] },
      // Styling
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['modern', 'minimal', 'bordered'] },
      { name: 'showHoverEffect', type: 'boolean', label: 'Show Hover Effect' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  StatsCounter: {
    name: 'StatsCounter',
    displayName: 'Stats Counter',
    category: 'content',
    description: 'Animated statistics display with numbers and labels - perfect for showcasing achievements',
    icon: 'BarChart3',
    previewImage: '/cms-previews/StatsCounter.png',
    component: StatsCounter,
    propsSchema: z.object({
      headerPart1: z.string().default('Our'),
      headerPart2: z.string().default('Strength'),
      headerPart1Color: z.string().default('#ffffff'),
      headerPart2Color: z.string().default('#ffde59'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().default('Numbers that speak volumes about our commitment to excellence'),
      stats: z.array(z.object({
        value: z.string(),
        label: z.string(),
      })).default([]),
      tagline: z.string().optional(),
      columns: z.enum(['2', '3', '4', '6']).default('6'),
      backgroundColor: z.string().default('#0b6d41'),
      backgroundGradient: z.boolean().default(true),
      gradientFrom: z.string().default('#0b6d41'),
      gradientTo: z.string().default('#1a8f5c'),
      statValueColor: z.string().default('#ffffff'),
      statLabelColor: z.string().default('#ffffff'),
      cardBackgroundColor: z.string().default('rgba(255,255,255,0.1)'),
      showAnimation: z.boolean().default(true),
      showDecorations: z.boolean().default(true),
      rows: z.enum(['1', '2']).default('2'),
    }),
    defaultProps: {
      headerPart1: 'Our',
      headerPart2: 'Strength',
      headerPart1Color: '#ffffff',
      headerPart2Color: '#ffde59',
      headerPart2Italic: true,
      subtitle: 'Numbers that speak volumes about our commitment to excellence',
      stats: [
        { value: '25', label: 'Years of Excellence' },
        { value: '15000', label: 'Students Trained' },
        { value: '95', label: 'Placement Rate' },
        { value: '50', label: 'Courses Offered' },
        { value: '500', label: 'Expert Faculty' },
        { value: '100', label: 'Industry Partners' },
      ],
      columns: '6',
      backgroundColor: '#0b6d41',
      backgroundGradient: true,
      gradientFrom: '#0b6d41',
      gradientTo: '#1a8f5c',
      statValueColor: '#ffffff',
      statLabelColor: '#ffffff',
      cardBackgroundColor: 'rgba(255,255,255,0.1)',
      showAnimation: true,
      showDecorations: true,
      rows: '2',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['stats', 'numbers', 'counter', 'achievements', 'strength', 'facts'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'stats',
        type: 'array',
        label: 'Statistics',
        itemType: 'object',
        itemSchema: {
          properties: {
            value: { type: 'string', label: 'Value', required: true },
            label: { type: 'string', label: 'Label', required: true },
          },
          required: ['value', 'label'],
        },
      },
      { name: 'tagline', type: 'string', label: 'Tagline' },
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '3', '4', '6'] },
      { name: 'rows', type: 'enum', label: 'Rows', options: ['1', '2'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'backgroundGradient', type: 'boolean', label: 'Use Gradient Background' },
      { name: 'gradientFrom', type: 'color', label: 'Gradient Start Color' },
      { name: 'gradientTo', type: 'color', label: 'Gradient End Color' },
      { name: 'statValueColor', type: 'color', label: 'Value Color' },
      { name: 'statLabelColor', type: 'color', label: 'Label Color' },
      { name: 'showAnimation', type: 'boolean', label: 'Animate Numbers' },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorative Circles' },
    ],
  },

  CollegeNews: {
    name: 'CollegeNews',
    displayName: 'College News',
    category: 'content',
    description: 'News section with date badges and carousel/grid layout',
    icon: 'Newspaper',
    previewImage: '/cms-previews/CollegeNews.png',
    component: CollegeNews,
    propsSchema: z.object({
      headerPart1: z.string().default('College'),
      headerPart2: z.string().default('News'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().optional(),
      newsItems: z.array(z.object({
        title: z.string(),
        image: z.string(),
        date: z.string(),
        link: z.string().optional(),
        excerpt: z.string().optional(),
      })).default([]),
      layout: z.enum(['carousel', 'grid']).default('carousel'),
      columns: z.enum(['2', '3', '4']).default('4'),
      backgroundColor: z.string().default('#ffffff'),
      dateBadgeColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#0b6d41'),
      autoplaySpeed: z.number().default(3000),
    }),
    defaultProps: {
      headerPart1: 'College',
      headerPart2: 'News',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      headerPart2Italic: true,
      subtitle: 'Stay updated with the latest happenings, achievements, and announcements from JKKN Institution',
      newsItems: [],
      layout: 'carousel',
      columns: '4',
      backgroundColor: '#ffffff',
      dateBadgeColor: '#0b6d41',
      accentColor: '#0b6d41',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['news', 'articles', 'updates', 'announcements', 'blog'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'newsItems',
        type: 'array',
        label: 'News Items',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Title', required: true },
            image: { type: 'string', label: 'Image URL' },
            date: { type: 'string', label: 'Date', required: true },
            link: { type: 'string', label: 'Link URL' },
            excerpt: { type: 'string', label: 'Excerpt' },
          },
          required: ['title', 'date'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['2', '3', '4'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'dateBadgeColor', type: 'color', label: 'Date Badge Color' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
    ],
  },

  LatestBuzz: {
    name: 'LatestBuzz',
    displayName: 'Latest Buzz',
    category: 'content',
    description: 'Trending content showcase with image cards',
    icon: 'Zap',
    previewImage: '/cms-previews/LatestBuzz.png',
    component: LatestBuzz,
    propsSchema: z.object({
      headerPart1: z.string().default('Latest'),
      headerPart2: z.string().default('Buzz'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().optional(),
      buzzItems: z.array(z.object({
        title: z.string(),
        image: z.string(),
        link: z.string().optional(),
      })).default([]),
      layout: z.enum(['carousel', 'grid']).default('carousel'),
      columns: z.enum(['2', '3', '4']).default('4'),
      backgroundColor: z.string().default('#ffffff'),
      cardStyle: z.enum(['simple', 'overlay', 'bordered']).default('simple'),
      accentColor: z.string().default('#0b6d41'),
      autoplaySpeed: z.number().default(3000),
    }),
    defaultProps: {
      headerPart1: 'Latest',
      headerPart2: 'Buzz',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      headerPart2Italic: true,
      subtitle: "What's trending at JKKN - Stay connected with the most exciting updates and announcements",
      buzzItems: [],
      layout: 'carousel',
      columns: '4',
      backgroundColor: '#ffffff',
      cardStyle: 'simple',
      accentColor: '#0b6d41',
      autoplaySpeed: 3000,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['buzz', 'trending', 'highlights', 'features', 'updates'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'buzzItems',
        type: 'array',
        label: 'Buzz Items',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Title', required: true },
            image: { type: 'string', label: 'Image URL' },
            link: { type: 'string', label: 'Link URL' },
          },
          required: ['title'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['2', '3', '4'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['simple', 'overlay', 'bordered'] },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
    ],
  },

  PastEvents: {
    name: 'PastEvents',
    displayName: 'Past Events',
    category: 'content',
    description: 'Event showcase with date and image cards',
    icon: 'CalendarDays',
    previewImage: '/cms-previews/PastEvents.png',
    component: PastEvents,
    propsSchema: z.object({
      headerPart1: z.string().default('Past'),
      headerPart2: z.string().default('Events'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().optional(),
      events: z.array(z.object({
        title: z.string(),
        image: z.string(),
        date: z.string(),
        link: z.string().optional(),
        description: z.string().optional(),
      })).default([]),
      layout: z.enum(['carousel', 'grid']).default('carousel'),
      columns: z.enum(['2', '3', '4']).default('4'),
      backgroundColor: z.string().default('#ffffff'),
      cardBackgroundColor: z.string().default('#ffffff'),
      dateBadgeColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#0b6d41'),
      autoplaySpeed: z.number().default(3000),
    }),
    defaultProps: {
      headerPart1: 'Past',
      headerPart2: 'Events',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      headerPart2Italic: true,
      subtitle: 'Celebrating moments of excellence, creativity, and community spirit at JKKN',
      events: [],
      layout: 'carousel',
      columns: '4',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#ffffff',
      dateBadgeColor: '#0b6d41',
      accentColor: '#0b6d41',
      autoplaySpeed: 3000,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['events', 'past', 'gallery', 'celebrations', 'programs'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'events',
        type: 'array',
        label: 'Events',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Title', required: true },
            image: { type: 'string', label: 'Image URL' },
            date: { type: 'string', label: 'Date', required: true },
            link: { type: 'string', label: 'Link URL' },
            description: { type: 'string', label: 'Description' },
          },
          required: ['title', 'date'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['2', '3', '4'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'dateBadgeColor', type: 'color', label: 'Date Badge Color' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
    ],
  },

  CampusVideos: {
    name: 'CampusVideos',
    displayName: 'Campus Videos',
    category: 'content',
    description: 'Video gallery with thumbnails and play buttons',
    icon: 'Video',
    previewImage: '/cms-previews/CampusVideos.png',
    component: CampusVideos,
    propsSchema: z.object({
      headerPart1: z.string().default('Campus'),
      headerPart2: z.string().default('Videos'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().optional(),
      videos: z.array(z.object({
        title: z.string(),
        thumbnail: z.string(),
        videoUrl: z.string(),
        category: z.string().optional(),
        description: z.string().optional(),
      })).default([]),
      layout: z.enum(['carousel', 'grid']).default('carousel'),
      columns: z.enum(['2', '3', '4']).default('4'),
      backgroundColor: z.string().default('#ffffff'),
      categoryBadgeColor: z.string().default('#0b6d41'),
      playButtonColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#0b6d41'),
      autoplaySpeed: z.number().default(3000),
    }),
    defaultProps: {
      headerPart1: 'Campus',
      headerPart2: 'Videos',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      headerPart2Italic: true,
      subtitle: 'Experience JKKN Institution through our campus video tours',
      videos: [],
      layout: 'carousel',
      columns: '4',
      backgroundColor: '#ffffff',
      categoryBadgeColor: '#0b6d41',
      playButtonColor: '#0b6d41',
      accentColor: '#0b6d41',
      autoplaySpeed: 3000,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['videos', 'campus', 'tours', 'media', 'gallery'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'videos',
        type: 'array',
        label: 'Videos',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Title', required: true },
            thumbnail: { type: 'string', label: 'Thumbnail URL' },
            videoUrl: { type: 'string', label: 'Video URL', required: true },
            category: { type: 'string', label: 'Category' },
            description: { type: 'string', label: 'Description' },
          },
          required: ['title', 'videoUrl'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['2', '3', '4'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'categoryBadgeColor', type: 'color', label: 'Category Badge Color' },
      { name: 'playButtonColor', type: 'color', label: 'Play Button Color' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
    ],
  },

  PartnersLogos: {
    name: 'PartnersLogos',
    displayName: 'Partners & Logos',
    category: 'content',
    description: 'Partner logo showcase with carousel, grid, or marquee layout',
    icon: 'Handshake',
    previewImage: '/cms-previews/PartnersLogos.png',
    component: PartnersLogos,
    propsSchema: z.object({
      headerPart1: z.string().default('Supporting'),
      headerPart2: z.string().default('Partners'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().optional(),
      partners: z.array(z.object({
        name: z.string(),
        logo: z.string(),
        link: z.string().optional(),
      })).default([]),
      layout: z.enum(['carousel', 'grid', 'marquee']).default('carousel'),
      columns: z.enum(['4', '5', '6', '8']).default('6'),
      backgroundColor: z.string().default('#ffffff'),
      cardBackgroundColor: z.string().default('#ffffff'),
      showBorder: z.boolean().default(true),
      grayscale: z.boolean().default(false),
      accentColor: z.string().default('#0b6d41'),
      autoplaySpeed: z.number().default(2000),
    }),
    defaultProps: {
      headerPart1: 'Supporting',
      headerPart2: 'Partners',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      headerPart2Italic: true,
      subtitle: 'Collaborating with leading organizations to provide world-class opportunities and resources',
      partners: [],
      layout: 'carousel',
      columns: '6',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#ffffff',
      showBorder: true,
      grayscale: false,
      accentColor: '#0b6d41',
      autoplaySpeed: 2000,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['partners', 'logos', 'sponsors', 'collaborations', 'companies'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'partners',
        type: 'array',
        label: 'Partners',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Name', required: true },
            logo: { type: 'string', label: 'Logo URL' },
            link: { type: 'string', label: 'Website URL' },
          },
          required: ['name'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid', 'marquee'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['4', '5', '6', '8'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'showBorder', type: 'boolean', label: 'Show Border' },
      { name: 'grayscale', type: 'boolean', label: 'Grayscale Logos' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
    ],
  },

  VisionMission: {
    name: 'VisionMission',
    displayName: 'Vision & Mission',
    category: 'content',
    description: 'Modern Vision, Mission, and Values page with gradient background, animations, and glassmorphism design',
    icon: 'Eye',
    previewImage: '/cms-previews/VisionMission.png',
    component: VisionMission,
    propsSchema: z.object({
      pageTitle: z.string().default('OUR VISION AND MISSION'),
      pageTitleColor: z.string().default('#ffffff'),
      visionTitle: z.string().default('Vision'),
      visionText: z.string().default('To be a Leading Global Innovative Solutions provider for the ever changing needs of the society.'),
      missionTitle: z.string().default('Mission'),
      missionText: z.string().default('Enabling a Platform for all to seize exponential opportunities through bioconvergence, thereby facilitating them to become Dynamic Leaders who shape the future.'),
      valuesTitle: z.string().default('Our Core Values'),
      values: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string().optional(),
      })).default([]),
      backgroundColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
      iconColor: z.string().default('#ffffff'),
      textColor: z.string().default('#ffffff'),
    }),
    defaultProps: {
      pageTitle: 'OUR VISION AND MISSION',
      pageTitleColor: '#ffffff',
      visionTitle: 'Vision',
      visionText: 'To be a Leading Global Innovative Solutions provider for the ever changing needs of the society.',
      missionTitle: 'Mission',
      missionText: 'Enabling a Platform for all to seize exponential opportunities through bioconvergence, thereby facilitating them to become Dynamic Leaders who shape the future.',
      valuesTitle: 'Our Core Values',
      values: [
        { icon: 'Lightbulb', title: 'Innovation', description: 'Embracing new ideas and creative solutions' },
        { icon: 'Award', title: 'Commitment to Excellence', description: 'Striving for the highest standards' },
        { icon: 'Rocket', title: 'Think Big', description: 'Aiming for transformative impact' },
        { icon: 'Shield', title: 'Integrity', description: 'Acting with honesty and transparency' },
        { icon: 'Users', title: 'Teamwork', description: 'Collaborating to achieve common goals' },
      ],
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      iconColor: '#ffffff',
      textColor: '#ffffff',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['vision', 'mission', 'values', 'about', 'purpose', 'goals'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title' },
      { name: 'pageTitleColor', type: 'color', label: 'Page Title Color' },
      { name: 'visionTitle', type: 'string', label: 'Vision Title' },
      { name: 'visionText', type: 'string', label: 'Vision Text', multiline: true },
      { name: 'missionTitle', type: 'string', label: 'Mission Title' },
      { name: 'missionText', type: 'string', label: 'Mission Text', multiline: true },
      { name: 'valuesTitle', type: 'string', label: 'Values Title' },
      {
        name: 'values',
        type: 'array',
        label: 'Core Values',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: { type: 'string', label: 'Icon (Lucide name)', required: true },
            title: { type: 'string', label: 'Value Title', required: true },
            description: { type: 'string', label: 'Description' },
          },
          required: ['icon', 'title'],
        },
      },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'iconColor', type: 'color', label: 'Icon Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  OurTrust: {
    name: 'OurTrust',
    displayName: 'Our Trust',
    category: 'content',
    description: 'Modern Trust page with founder tribute, animated stats, timeline, and story section',
    icon: 'Heart',
    previewImage: '/cms-previews/OurTrust.png',
    component: OurTrust,
    propsSchema: z.object({
      pageTitle: z.string().default('OUR TRUST'),
      pageSubtitle: z.string().default('J.K.K. Rangammal Charitable Trust'),
      founderName: z.string().default('SHRI. J.K.K. NATARAJAH'),
      founderTitle: z.string().default('Founder of J.K.K. Rangammal Charitable Trust'),
      founderImage: z.string().default('https://jkkn.ac.in/wp-content/uploads/2023/04/ft1-293x300-1.webp'),
      founderImageAlt: z.string().default('Shri J.K.K. Natarajah - Founder'),
      storyTitle: z.string().default('Our Story'),
      storyContent: z.string().default(''),
      stats: z.array(z.object({
        icon: z.string(),
        value: z.string(),
        label: z.string(),
      })).default([]),
      milestonesTitle: z.string().default('Key Milestones'),
      milestones: z.array(z.object({
        year: z.string(),
        title: z.string(),
        description: z.string().optional(),
      })).default([]),
      backgroundColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
      textColor: z.string().default('#ffffff'),
    }),
    defaultProps: {
      pageTitle: 'OUR TRUST',
      pageSubtitle: 'J.K.K. Rangammal Charitable Trust',
      founderName: 'SHRI. J.K.K. NATARAJAH',
      founderTitle: 'Founder of J.K.K. Rangammal Charitable Trust',
      founderImage: 'https://jkkn.ac.in/wp-content/uploads/2023/04/ft1-293x300-1.webp',
      founderImageAlt: 'Shri J.K.K. Natarajah - Founder',
      storyTitle: 'Our Story',
      storyContent: '',
      stats: [
        { icon: 'Calendar', value: '1969', label: 'Year Established' },
        { icon: 'Building2', value: '10+', label: 'Institutions' },
        { icon: 'GraduationCap', value: '50000+', label: 'Alumni' },
        { icon: 'Users', value: '5000+', label: 'Current Students' },
      ],
      milestonesTitle: 'Key Milestones',
      milestones: [
        { year: '1965', title: 'Girls School Founded', description: 'Started the first girls school in Kumarapalayam' },
        { year: '1969', title: 'Trust Established', description: 'J.K.K. Rangammal Charitable Trust officially registered' },
        { year: '1985', title: 'College Expansion', description: 'First professional college established' },
        { year: '2000', title: 'Multi-Disciplinary Growth', description: 'Expanded to 10+ institutions' },
      ],
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['trust', 'about', 'founder', 'history', 'charity', 'institution'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title' },
      { name: 'pageSubtitle', type: 'string', label: 'Page Subtitle' },
      { name: 'founderName', type: 'string', label: 'Founder Name' },
      { name: 'founderTitle', type: 'string', label: 'Founder Title' },
      { name: 'founderImage', type: 'image', label: 'Founder Image' },
      { name: 'founderImageAlt', type: 'string', label: 'Founder Image Alt' },
      { name: 'storyTitle', type: 'string', label: 'Story Section Title' },
      { name: 'storyContent', type: 'string', label: 'Story Content', multiline: true },
      {
        name: 'stats',
        type: 'array',
        label: 'Statistics',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: { type: 'string', label: 'Icon (Lucide name)', required: true },
            value: { type: 'string', label: 'Value', required: true },
            label: { type: 'string', label: 'Label', required: true },
          },
          required: ['icon', 'value', 'label'],
        },
      },
      { name: 'milestonesTitle', type: 'string', label: 'Milestones Title' },
      {
        name: 'milestones',
        type: 'array',
        label: 'Milestones',
        itemType: 'object',
        itemSchema: {
          properties: {
            year: { type: 'string', label: 'Year', required: true },
            title: { type: 'string', label: 'Title', required: true },
            description: { type: 'string', label: 'Description' },
          },
          required: ['year', 'title'],
        },
      },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
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

  GoogleDriveVideo: {
    name: 'GoogleDriveVideo',
    displayName: 'Google Drive Video',
    category: 'media',
    description: 'Embed a video from Google Drive - just paste the share link',
    icon: 'PlayCircle',
    previewImage: '/cms-previews/GoogleDriveVideo.png',
    component: GoogleDriveVideo,
    propsSchema: z.object({
      videoUrl: z.string().describe('Google Drive video URL or share link'),
      title: z.string().optional(),
      description: z.string().optional(),
      aspectRatio: z.enum(['16:9', '4:3', '1:1', '9:16']).default('16:9'),
      maxWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('lg'),
      rounded: z.boolean().default(true),
      shadow: z.boolean().default(true),
      showThumbnail: z.boolean().default(false),
      thumbnailUrl: z.string().optional(),
      alignment: z.enum(['left', 'center', 'right']).default('center'),
    }),
    defaultProps: {
      videoUrl: '',
      title: '',
      description: '',
      aspectRatio: '16:9',
      maxWidth: 'lg',
      rounded: true,
      shadow: true,
      showThumbnail: false,
      alignment: 'center',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['video', 'google drive', 'embed', 'media', 'player'],
    editableProps: [
      { name: 'videoUrl', type: 'video', label: 'Google Drive Video URL', required: true, description: 'Paste Google Drive share link' },
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      { name: 'aspectRatio', type: 'enum', label: 'Aspect Ratio', options: ['16:9', '4:3', '1:1', '9:16'] },
      { name: 'maxWidth', type: 'enum', label: 'Max Width', options: ['sm', 'md', 'lg', 'xl', 'full'] },
      { name: 'rounded', type: 'boolean', label: 'Rounded Corners' },
      { name: 'shadow', type: 'boolean', label: 'Show Shadow' },
      { name: 'showThumbnail', type: 'boolean', label: 'Show Thumbnail Before Play' },
      { name: 'thumbnailUrl', type: 'image', label: 'Custom Thumbnail' },
      { name: 'alignment', type: 'enum', label: 'Alignment', options: ['left', 'center', 'right'] },
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
    isFullWidth: true,
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
    isFullWidth: true,
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
    isFullWidth: true,
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

  // ==========================================
  // Modern Blocks (Enhanced with animations & brand colors)
  // ==========================================
  AnimatedCounter: {
    name: 'AnimatedCounter',
    displayName: 'Animated Counter',
    category: 'data',
    description: 'Animated counting numbers for statistics and achievements - perfect for "50+ Years", "10000+ Students"',
    icon: 'TrendingUp',
    previewImage: '/cms-previews/AnimatedCounter.png',
    component: AnimatedCounter,
    propsSchema: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      counters: z.array(z.object({
        value: z.number(),
        label: z.string(),
        prefix: z.string().optional(),
        suffix: z.string().optional(),
        icon: z.string().optional(),
      })).default([]),
      layout: z.enum(['row', 'grid', 'cards']).default('row'),
      columns: z.number().default(4),
      animationDuration: z.number().default(2000),
      animateOnScroll: z.boolean().default(true),
      variant: z.enum(['default', 'glass', 'gradient', 'minimal']).default('default'),
      colorScheme: z.enum(['brand', 'dark', 'light', 'custom']).default('brand'),
      numberColor: z.string().default('#0b6d41'),
      labelColor: z.string().default('#4a4a4a'),
      backgroundColor: z.string().default('transparent'),
    }),
    defaultProps: {
      title: 'Our Achievements',
      subtitle: 'Numbers that define our excellence',
      counters: [
        { value: 50, label: 'Years of Excellence', suffix: '+', icon: 'Award' },
        { value: 15000, label: 'Students', suffix: '+', icon: 'Users' },
        { value: 98, label: 'Placement Rate', suffix: '%', icon: 'Briefcase' },
        { value: 500, label: 'Faculty Members', suffix: '+', icon: 'GraduationCap' },
      ],
      layout: 'row',
      columns: 4,
      animationDuration: 2000,
      animateOnScroll: true,
      variant: 'default',
      colorScheme: 'brand',
      numberColor: '#0b6d41',
      labelColor: '#4a4a4a',
      backgroundColor: '#fbfbee',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['counter', 'stats', 'numbers', 'achievements', 'animated', 'statistics'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['row', 'grid', 'cards'] },
      { name: 'columns', type: 'number', label: 'Columns', min: 2, max: 6 },
      { name: 'variant', type: 'enum', label: 'Visual Style', options: ['default', 'glass', 'gradient', 'minimal'] },
      { name: 'colorScheme', type: 'enum', label: 'Color Scheme', options: ['brand', 'dark', 'light', 'custom'] },
      { name: 'numberColor', type: 'color', label: 'Number Color' },
      { name: 'labelColor', type: 'color', label: 'Label Color' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'animationDuration', type: 'number', label: 'Animation Duration (ms)', min: 500, max: 5000 },
      { name: 'animateOnScroll', type: 'boolean', label: 'Animate on Scroll' },
    ],
  },

  BentoGrid: {
    name: 'BentoGrid',
    displayName: 'Bento Grid',
    category: 'layout',
    description: 'Modern asymmetric grid layout with variable cell sizes - great for showcasing programs, features, or achievements',
    icon: 'LayoutGrid',
    previewImage: '/cms-previews/BentoGrid.png',
    component: BentoGrid,
    propsSchema: z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        icon: z.string().optional(),
        link: z.string().optional(),
        size: z.enum(['1x1', '2x1', '1x2', '2x2']).default('1x1'),
        variant: z.enum(['default', 'glass', 'gradient', 'image']).default('default'),
      })).default([]),
      columns: z.number().default(4),
      gap: z.number().default(4),
      variant: z.enum(['default', 'glass', 'gradient', 'mixed']).default('default'),
      backgroundColor: z.string().default('transparent'),
      accentColor: z.string().default('#0b6d41'),
      hoverEffect: z.enum(['none', 'lift', 'glow', 'scale']).default('lift'),
    }),
    defaultProps: {
      title: 'Our Programs',
      subtitle: 'Explore our diverse range of academic programs',
      items: [
        { title: 'Engineering', description: 'World-class engineering programs', size: '2x2', variant: 'gradient', icon: 'Cog' },
        { title: 'Medical Sciences', description: 'Excellence in healthcare education', size: '1x1', variant: 'default', icon: 'Stethoscope' },
        { title: 'Arts & Sciences', description: 'Nurturing creative minds', size: '1x1', variant: 'default', icon: 'Palette' },
        { title: 'Business', description: 'Future business leaders', size: '2x1', variant: 'glass', icon: 'TrendingUp' },
      ],
      columns: 4,
      gap: 4,
      variant: 'mixed',
      backgroundColor: '#fbfbee',
      accentColor: '#0b6d41',
      hoverEffect: 'lift',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['bento', 'grid', 'layout', 'asymmetric', 'cards', 'modern', 'showcase'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'columns', type: 'number', label: 'Columns', min: 2, max: 6 },
      { name: 'gap', type: 'number', label: 'Gap', min: 2, max: 8 },
      { name: 'variant', type: 'enum', label: 'Overall Style', options: ['default', 'glass', 'gradient', 'mixed'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'hoverEffect', type: 'enum', label: 'Hover Effect', options: ['none', 'lift', 'glow', 'scale'] },
    ],
  },

  GradientCard: {
    name: 'GradientCard',
    displayName: 'Gradient Card',
    category: 'content',
    description: 'Modern card with gradient effects, glassmorphism, and glow animations - perfect for featured content',
    icon: 'Square',
    previewImage: '/cms-previews/GradientCard.png',
    component: GradientCard,
    propsSchema: z.object({
      title: z.string().default('Card Title'),
      description: z.string().optional(),
      image: z.string().optional(),
      icon: z.string().optional(),
      badge: z.string().optional(),
      link: z.string().optional(),
      ctaText: z.string().optional(),
      variant: z.enum(['default', 'glass', 'gradient-border', 'gradient-bg', 'glow']).default('default'),
      size: z.enum(['sm', 'md', 'lg']).default('md'),
      gradient: z.string().default('linear-gradient(135deg, #0b6d41, #085032)'),
      backgroundColor: z.string().default('#ffffff'),
      accentColor: z.string().default('#0b6d41'),
      hoverEffect: z.enum(['none', 'lift', 'glow', 'scale', 'border-glow']).default('lift'),
    }),
    defaultProps: {
      title: 'Featured Program',
      description: 'Discover our cutting-edge program designed to prepare you for the future.',
      badge: 'Popular',
      ctaText: 'Learn More',
      variant: 'gradient-border',
      size: 'md',
      gradient: 'linear-gradient(135deg, #0b6d41, #085032)',
      backgroundColor: '#ffffff',
      accentColor: '#0b6d41',
      hoverEffect: 'lift',
    },
    supportsChildren: false,
    keywords: ['card', 'gradient', 'glass', 'glow', 'modern', 'featured'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      { name: 'image', type: 'image', label: 'Header Image' },
      { name: 'icon', type: 'string', label: 'Icon Name (Lucide)' },
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'link', type: 'url', label: 'Link URL' },
      { name: 'ctaText', type: 'string', label: 'CTA Button Text' },
      { name: 'variant', type: 'enum', label: 'Card Style', options: ['default', 'glass', 'gradient-border', 'gradient-bg', 'glow'] },
      { name: 'size', type: 'enum', label: 'Card Size', options: ['sm', 'md', 'lg'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'hoverEffect', type: 'enum', label: 'Hover Effect', options: ['none', 'lift', 'glow', 'scale', 'border-glow'] },
    ],
  },
}

// ==========================================
// Helper Functions
// ==========================================

/**
 * Get a component from the registry by name
 * Checks both built-in and custom component registries
 */
export function getComponent(name: string): ComponentType<BaseBlockProps> | null {
  // First check built-in registry
  const builtinEntry = COMPONENT_REGISTRY[name]
  if (builtinEntry) {
    return builtinEntry.component
  }

  // Then check shadcn component registry
  const shadcnComponent = SHADCN_BLOCK_COMPONENTS[name]
  if (shadcnComponent) {
    return shadcnComponent
  }

  // Finally check custom component registry
  const customEntry = CUSTOM_COMPONENT_REGISTRY.get(name)
  if (customEntry) {
    return customEntry.entry.component
  }

  console.warn(`Component "${name}" not found in registry`)
  return null
}

/**
 * Convert ShadcnComponentEntry to ComponentRegistryEntry format
 * This allows shadcn components to work with the Properties Panel
 */
function convertShadcnToRegistryEntry(
  shadcnEntry: typeof SHADCN_COMPONENTS[keyof typeof SHADCN_COMPONENTS],
  component: ComponentType<BaseBlockProps> | undefined
): ComponentRegistryEntry {
  // Generate editableProps from defaultProps
  const editableProps: EditableProp[] = Object.entries(shadcnEntry.defaultProps).map(([key, value]) => {
    const prop: EditableProp = {
      name: key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
      type: inferPropType(value),
    }

    // Add default value
    prop.defaultValue = value

    // Special handling for common prop names
    if (key === 'variant' || key === 'size' || key === 'side' || key === 'orientation' || key === 'type' || key === 'mode') {
      prop.type = 'enum'
      // Try to get options from the schema
      const schemaOptions = getSchemaEnumOptions(shadcnEntry.propsSchema, key)
      if (schemaOptions.length > 0) {
        prop.options = schemaOptions
      }
    }

    return prop
  })

  return {
    name: shadcnEntry.name,
    displayName: shadcnEntry.displayName,
    description: shadcnEntry.description,
    category: 'shadcn' as ComponentCategory,
    icon: shadcnEntry.icon,
    previewImage: shadcnEntry.previewImage,
    component: component || ((() => null) as unknown as ComponentType<BaseBlockProps>),
    propsSchema: shadcnEntry.propsSchema,
    defaultProps: shadcnEntry.defaultProps,
    keywords: shadcnEntry.keywords,
    supportsChildren: false,
    editableProps,
    isShadcnComponent: true,
  }
}

/**
 * Infer EditableProp type from a value
 */
function inferPropType(value: unknown): EditableProp['type'] {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') {
    if (value.startsWith('http') || value.startsWith('/')) return 'url'
    if (value.startsWith('#') || /^(rgb|hsl)/.test(value)) return 'color'
    return 'string'
  }
  if (Array.isArray(value)) return 'array'
  return 'string'
}

/**
 * Extract enum options from a Zod schema for a specific property
 */
function getSchemaEnumOptions(schema: z.ZodSchema, propName: string): string[] {
  try {
    // Access the shape of the schema if it's an object schema
    const schemaAny = schema as { _def?: { shape?: () => Record<string, z.ZodTypeAny> } }
    if (schemaAny._def?.shape) {
      const shape = schemaAny._def.shape()
      const propSchema = shape[propName]
      if (propSchema) {
        // Check if it's an enum or has options
        const propDef = propSchema as { _def?: { values?: string[]; innerType?: { _def?: { values?: string[] } } } }
        if (propDef._def?.values) {
          return propDef._def.values
        }
        // Check for default wrapped enums
        if (propDef._def?.innerType?._def?.values) {
          return propDef._def.innerType._def.values
        }
      }
    }
  } catch {
    // Silently fail if schema introspection doesn't work
  }
  return []
}

/**
 * Get component entry from registry
 * Checks built-in, shadcn, and custom component registries
 */
export function getComponentEntry(name: string): ComponentRegistryEntry | null {
  // First check built-in registry
  const builtinEntry = COMPONENT_REGISTRY[name]
  if (builtinEntry) {
    return builtinEntry
  }

  // Then check shadcn component registry
  const shadcnEntry = SHADCN_COMPONENTS[name]
  if (shadcnEntry) {
    const shadcnComponent = SHADCN_BLOCK_COMPONENTS[name]
    return convertShadcnToRegistryEntry(shadcnEntry, shadcnComponent)
  }

  // Finally check custom component registry
  const customEntry = CUSTOM_COMPONENT_REGISTRY.get(name)
  if (customEntry) {
    return customEntry.entry
  }

  return null
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
 * Checks both built-in and custom component registries
 */
export function getDefaultProps(componentName: string): Record<string, unknown> {
  // First check built-in registry
  const builtinEntry = COMPONENT_REGISTRY[componentName]
  if (builtinEntry) {
    return builtinEntry.defaultProps as Record<string, unknown>
  }

  // Then check shadcn component registry
  const shadcnEntry = SHADCN_COMPONENTS[componentName]
  if (shadcnEntry) {
    return shadcnEntry.defaultProps as Record<string, unknown>
  }

  // Finally check custom component registry
  const customEntry = CUSTOM_COMPONENT_REGISTRY.get(componentName)
  if (customEntry) {
    return customEntry.customData.default_props || {}
  }

  console.warn(`Component "${componentName}" not found in registry`)
  return {}
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
  return ['content', 'media', 'layout', 'data', 'shadcn']
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
    shadcn: 'shadcn/ui',
    custom: 'Custom',
  }
  return names[category]
}

/**
 * Check if a component supports children (nested blocks)
 * Checks both built-in and custom component registries
 */
export function supportsChildren(componentName: string): boolean {
  // First check built-in registry
  const builtinEntry = COMPONENT_REGISTRY[componentName]
  if (builtinEntry) {
    return builtinEntry.supportsChildren ?? false
  }

  // Custom components don't support children by default
  const customEntry = CUSTOM_COMPONENT_REGISTRY.get(componentName)
  if (customEntry) {
    return customEntry.entry.supportsChildren ?? false
  }

  return false
}

/**
 * Check if a component is full-width (should not be wrapped in a container)
 */
export function isFullWidthComponent(componentName: string): boolean {
  const entry = COMPONENT_REGISTRY[componentName]
  return entry?.isFullWidth ?? false
}
