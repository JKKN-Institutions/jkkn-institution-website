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
  FAQSectionPropsSchema,
  TabsBlockPropsSchema,
  TimelinePropsSchema,
  PricingTablesPropsSchema,
  TrustBadgesPropsSchema,
  AccreditationsSectionPropsSchema,
  WhyChooseJKKNPropsSchema,
  // Admissions schemas
  AdmissionHeroPropsSchema,
  CollegesGridPropsSchema,
  AdmissionProcessTimelinePropsSchema,
  AdmissionDatesTablePropsSchema,
  EligibilityCriteriaTablePropsSchema,
  FeeStructureTablePropsSchema,
  ScholarshipsSectionPropsSchema,
  DocumentsChecklistPropsSchema,
  WhyChooseSectionPropsSchema,
  CampusFeaturesGridPropsSchema,
  PlacementsHighlightsPropsSchema,
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
const FAQSectionBlock = lazy(() => import('@/components/cms-blocks/content/faq-section-block'))
const TabsBlock = lazy(() => import('@/components/cms-blocks/content/tabs-block'))
const Timeline = lazy(() => import('@/components/cms-blocks/content/timeline'))
const PricingTables = lazy(() => import('@/components/cms-blocks/content/pricing-tables'))
const TrustBadges = lazy(() => import('@/components/cms-blocks/content/trust-badges'))
const AccreditationsSection = lazy(() => import('@/components/cms-blocks/content/accreditations-section'))
const WhyChooseJKKN = lazy(() => import('@/components/cms-blocks/content/why-choose-jkkn'))

// Admissions blocks
const AdmissionHero = lazy(() => import('@/components/cms-blocks/admissions/admission-hero'))
const CollegesGrid = lazy(() => import('@/components/cms-blocks/admissions/colleges-grid'))
const AdmissionProcessTimeline = lazy(() => import('@/components/cms-blocks/admissions/admission-process-timeline'))
const AdmissionDatesTable = lazy(() => import('@/components/cms-blocks/admissions/admission-dates-table'))
const EligibilityCriteriaTable = lazy(() => import('@/components/cms-blocks/admissions/eligibility-criteria-table'))
const FeeStructureTable = lazy(() => import('@/components/cms-blocks/admissions/fee-structure-table'))
const ScholarshipsSection = lazy(() => import('@/components/cms-blocks/admissions/scholarships-section'))
const DocumentsChecklist = lazy(() => import('@/components/cms-blocks/admissions/documents-checklist'))
const WhyChooseSection = lazy(() => import('@/components/cms-blocks/admissions/why-choose-section'))
const CampusFeaturesGrid = lazy(() => import('@/components/cms-blocks/admissions/campus-features-grid'))
const PlacementsHighlights = lazy(() => import('@/components/cms-blocks/admissions/placements-highlights'))

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

// JKKN100 Centenary Celebration Section
const JKKN100CentenarySection = lazy(() => import('@/components/cms-blocks/content/jkkn100-centenary-section'))

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

// Education Videos (new inline player with playlist)
const EducationVideos = lazy(() => import('@/components/cms-blocks/content/education-videos'))

// Partners Logos
const PartnersLogos = lazy(() => import('@/components/cms-blocks/content/partners-logos'))

// Education Stories
const EducationStories = lazy(() => import('@/components/cms-blocks/content/education-stories'))

// College Alumni
const CollegeAlumni = lazy(() => import('@/components/cms-blocks/content/college-alumni'))

// Life at JKKN
const LifeAtJKKN = lazy(() => import('@/components/cms-blocks/content/life-at-jkkn'))

// Vision Mission
const VisionMission = lazy(() => import('@/components/cms-blocks/content/vision-mission'))

// Our Trust
const OurTrust = lazy(() => import('@/components/cms-blocks/content/our-trust'))

// Our Management
const OurManagement = lazy(() => import('@/components/cms-blocks/content/our-management'))

// Our Institutions
const OurInstitutions = lazy(() => import('@/components/cms-blocks/content/our-institutions'))

// Course Page
const CoursePage = lazy(() => import('@/components/cms-blocks/content/course-page'))

// Facility Page
const FacilityPage = lazy(() => import('@/components/cms-blocks/content/facility-page'))

// Gallery Page
const GalleryPage = lazy(() => import('@/components/cms-blocks/content/gallery-page'))

// Privacy Policy Page
const PrivacyPolicyPage = lazy(() => import('@/components/cms-blocks/content/privacy-policy-page'))

// Contact Page
const ContactPage = lazy(() => import('@/components/cms-blocks/content/contact-page'))

// Hostel Page
const HostelPage = lazy(() => import('@/components/cms-blocks/content/hostel-page'))

// Admission Inquiry Form
const AdmissionInquiryForm = lazy(() => import('@/components/cms-blocks/content/admission-inquiry-form'))

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
      title: 'JKKN INSTITUTIONS',
      subtitle: '',
      logoImage: '',
      logoImageAlt: '',
      logoPosition: 'top',
      logoSize: 'md',
      showAiBadge: true,
      titleColor: '#ffffff',
      titleFontSize: '6xl',
      titleFontWeight: 'bold',
      titleFontStyle: 'normal',
      subtitleColor: '#fbfbee', // Brand cream for better visibility
      subtitleFontSize: 24,
      subtitleFontWeight: 'normal',
      subtitleFontStyle: 'normal',
      showTrustBadges: false,
      trustBadgesStyle: 'glass',
      trustBadgesPosition: 'below-subtitle',
      trustBadge1Text: 'NAAC Accredited',
      trustBadge2Text: '95%+ Placements',
      trustBadge3Text: '100+ Top Recruiters',
      trustBadge4Text: '39 Years of Excellence',
      backgroundType: 'gradient',
      backgroundGradient: 'linear-gradient(135deg, #0b6d41, #085032)', // JKKN Green gradient
      backgroundImageAlt: '',
      alignment: 'center',
      overlay: true,
      overlayOpacity: 0.3,
      ctaButtons: [
        { label: 'Online Admissions 2025-2026', link: '/admissions', variant: 'primary' },
        { label: 'Academic Calendar', link: '/academic-calendar', variant: 'secondary' },
      ],
      minHeight: '100vh',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['hero', 'banner', 'header', 'landing'],
    editableProps: [
      // Logo settings
      { name: 'logoImage', type: 'image', label: 'Logo Image', description: 'Upload a custom logo to display above the title' },
      { name: 'logoImageAlt', type: 'string', label: 'Logo Image Alt Text', required: true, description: 'Alt text for accessibility (required)' },
      { name: 'logoPosition', type: 'enum', label: 'Logo Position', options: ['top', 'between-subtitle-button'], description: 'Where to display the logo' },
      { name: 'logoSize', type: 'enum', label: 'Logo Size', options: ['sm', 'md', 'lg', 'xl'], description: 'Size of the logo' },
      { name: 'showAiBadge', type: 'boolean', label: 'Show AI Badge', description: 'Show the default "India\'s First AI Empowered College" badge when no logo is uploaded' },
      // Title settings
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'titleFontSize', type: 'enum', label: 'Title Font Size', options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] },
      { name: 'titleFontWeight', type: 'enum', label: 'Title Font Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
      { name: 'titleFontStyle', type: 'enum', label: 'Title Font Style', options: ['normal', 'italic'] },
      // Subtitle settings
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'subtitleFontSize', type: 'number', label: 'Subtitle Font Size', unit: 'px', min: 8, max: 120 },
      { name: 'subtitleFontWeight', type: 'enum', label: 'Subtitle Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'subtitleFontStyle', type: 'enum', label: 'Subtitle Font Style', options: ['normal', 'italic'] },
      // Trust Badges settings
      { name: 'showTrustBadges', type: 'boolean', label: 'Show Trust Badges', description: 'Display trust badges (NAAC, Placements, etc.) in the hero section' },
      { name: 'trustBadgesStyle', type: 'enum', label: 'Trust Badges Style', options: ['glass', 'solid', 'outline'], description: 'Visual style of trust badges' },
      { name: 'trustBadgesPosition', type: 'enum', label: 'Trust Badges Position', options: ['below-subtitle', 'below-title', 'below-logo'], description: 'Where to display trust badges' },
      { name: 'trustBadge1Text', type: 'string', label: 'Trust Badge 1 Text', description: 'Text for first trust badge' },
      { name: 'trustBadge2Text', type: 'string', label: 'Trust Badge 2 Text', description: 'Text for second trust badge' },
      { name: 'trustBadge3Text', type: 'string', label: 'Trust Badge 3 Text', description: 'Text for third trust badge' },
      { name: 'trustBadge4Text', type: 'string', label: 'Trust Badge 4 Text', description: 'Text for fourth trust badge' },
      // CTA Buttons
      {
        name: 'ctaButtons',
        type: 'array',
        label: 'CTA Buttons',
        description: 'Add action buttons like Online Admissions, Academic Calendar',
        itemType: 'object',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Button Text', required: true },
            link: { type: 'string', label: 'Link URL', required: true },
            variant: { type: 'string', label: 'Style' },
          },
          required: ['label', 'link'],
        },
      },
      // Background settings
      { name: 'backgroundType', type: 'enum', label: 'Background Type', options: ['image', 'video', 'gradient'] },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
      { name: 'backgroundImageAlt', type: 'string', label: 'Background Image Alt Text', required: true, description: 'Alt text for accessibility (required)' },
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

  FAQSectionBlock: {
    name: 'FAQSectionBlock',
    displayName: 'FAQ Section',
    category: 'content',
    description: 'Full-featured FAQ section with header, animations, and CTA for landing pages',
    icon: 'HelpCircle',
    previewImage: '/cms-previews/FAQSectionBlock.png',
    component: FAQSectionBlock,
    propsSchema: FAQSectionPropsSchema,
    defaultProps: {
      badge: 'FAQ',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about JKKN Institutions',
      titleColor: '',
      subtitleColor: '',
      accentColor: '#D4AF37',
      faqs: [],
      showCTA: true,
      ctaTitle: 'Still have questions?',
      ctaDescription: "Can't find the answer you're looking for? Our admissions team is here to help.",
      ctaPhone: '+91 422 266 1100',
      ctaEmail: 'info@jkkn.ac.in',
      backgroundColor: 'gradient-dark',
      showAnimations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['faq', 'questions', 'help', 'section', 'landing', 'accordion'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text', description: 'Small badge above title' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleColor', type: 'color', label: 'Title Color', description: 'Leave empty for auto' },
      { name: 'accentColor', type: 'color', label: 'Accent Word Color', description: 'Color for last word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color', description: 'Leave empty for auto' },
      {
        name: 'faqs',
        type: 'array',
        label: 'FAQ Items',
        description: 'Add questions and answers with categories',
        itemType: 'object',
        itemSchema: {
          properties: {
            question: {
              type: 'string',
              label: 'Question',
              required: true,
              placeholder: 'Enter the FAQ question...',
            },
            answer: {
              type: 'string',
              label: 'Answer',
              required: true,
              multiline: true,
              placeholder: 'Provide a detailed answer...',
            },
            category: {
              type: 'enum',
              label: 'Category',
              options: ['general', 'admissions', 'academics', 'facilities', 'placements', 'fees'],
              defaultValue: 'general',
              description: 'Categorize this FAQ for better organization',
            },
          },
          required: ['question', 'answer'],
        },
      },
      { name: 'showCTA', type: 'boolean', label: 'Show Contact CTA' },
      { name: 'ctaTitle', type: 'string', label: 'CTA Title' },
      { name: 'ctaDescription', type: 'string', label: 'CTA Description' },
      { name: 'ctaPhone', type: 'string', label: 'Phone Number' },
      { name: 'ctaEmail', type: 'string', label: 'Email Address' },
      {
        name: 'backgroundColor',
        type: 'enum',
        label: 'Background Style',
        options: ['gradient-dark', 'gradient-light', 'solid', 'transparent'],
      },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Scroll Animations' },
    ],
  },

  AccreditationsSection: {
    name: 'AccreditationsSection',
    displayName: 'Accreditations & Approvals',
    category: 'content',
    description: 'Display accreditations, regulatory approvals, and trust badges with glassmorphism styling and scroll animations',
    icon: 'Award',
    previewImage: '/cms-previews/AccreditationsSection.png',
    component: AccreditationsSection,
    propsSchema: AccreditationsSectionPropsSchema,
    defaultProps: {
      badge: 'ACCREDITATIONS',
      title: 'Accreditations & Approvals',
      titleAccentWord: 'Approvals',
      subtitle: "Recognized for Excellence by India's Premier Regulatory Bodies",
      description: 'JKKN Institutions proudly holds approvals and accreditations from all major national regulatory bodies, ensuring our Learners receive education that meets the highest standards of quality, compliance, and industry relevance.',
      titleColor: '',
      subtitleColor: '',
      accentColor: '#D4AF37',
      accreditationCards: [],
      trustBadges: [],
      showAccreditationCards: true,
      showTrustBadges: true,
      cardsPerRow: '4',
      cardLayout: 'grid',
      badgeLayout: 'row',
      backgroundColor: 'gradient-dark',
      glassmorphismVariant: 'dark',
      cardStyle: 'glass',
      showAnimations: true,
      animationPreset: 'stagger',
      staggerDelay: 100,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['accreditation', 'approval', 'naac', 'aicte', 'ugc', 'nba', 'dci', 'pci', 'inc', 'trust', 'badges', 'recognition', 'regulatory', 'certification'],
    editableProps: [
      // Section Header
      { name: 'badge', type: 'string', label: 'Badge Text', description: 'Small badge above title' },
      { name: 'title', type: 'string', label: 'Section Title', required: true },
      { name: 'titleColor', type: 'color', label: 'Title Color', description: 'Leave empty for auto (white on dark, dark on light)' },
      { name: 'titleAccentWord', type: 'string', label: 'Title Accent Word', description: 'Word to highlight in gold/italic' },
      { name: 'accentColor', type: 'color', label: 'Accent Word Color', description: 'Color for the highlighted accent word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color', description: 'Leave empty for auto' },
      { name: 'description', type: 'string', label: 'Description Paragraph', multiline: true },
      // Header Typography
      { name: 'headerFontFamily', type: 'enum', label: 'Header Font', options: ['Default (Serif)', 'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Georgia'], description: 'Select font family' },
      { name: 'headerFontSize', type: 'enum', label: 'Header Size', options: ['3xl', '4xl', '5xl', '6xl'] },
      { name: 'headerFontWeight', type: 'enum', label: 'Header Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
      // Accreditation Cards Array
      {
        name: 'accreditationCards',
        type: 'array',
        label: 'Accreditation Cards',
        description: 'Add/edit accreditation cards (NAAC, AICTE, UGC, etc.)',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: {
              type: 'string',
              label: 'Icon',
              required: true,
              placeholder: 'Trophy, CheckCircle, Award, Shield, GraduationCap',
              description: 'Lucide icon name',
            },
            name: {
              type: 'string',
              label: 'Name',
              required: true,
              placeholder: 'e.g., NAAC A+ Accredited',
            },
            description: {
              type: 'string',
              label: 'Description',
              required: true,
              multiline: true,
              placeholder: 'Brief description of the accreditation',
            },
            order: {
              type: 'number',
              label: 'Display Order',
              defaultValue: 0,
            },
          },
          required: ['icon', 'name', 'description'],
        },
      },
      // Trust Badges Array
      {
        name: 'trustBadges',
        type: 'array',
        label: 'Trust & Recognition Badges',
        description: 'Add trust indicators (Years of Excellence, ISO, etc.)',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: {
              type: 'string',
              label: 'Icon',
              required: true,
              placeholder: 'Calendar, Heart, Shield, Leaf, TrendingUp',
            },
            text: {
              type: 'string',
              label: 'Main Text',
              required: true,
              placeholder: 'e.g., 74+ Years of Educational Excellence',
            },
            subtext: {
              type: 'string',
              label: 'Subtext',
              placeholder: 'e.g., (Est. 1951)',
            },
            order: {
              type: 'number',
              label: 'Display Order',
              defaultValue: 0,
            },
          },
          required: ['icon', 'text'],
        },
      },
      // Section Toggles
      { name: 'showAccreditationCards', type: 'boolean', label: 'Show Accreditation Cards' },
      { name: 'showTrustBadges', type: 'boolean', label: 'Show Trust Badges' },
      // Layout Configuration
      { name: 'cardsPerRow', type: 'enum', label: 'Cards Per Row', options: ['2', '3', '4'] },
      { name: 'cardLayout', type: 'enum', label: 'Card Layout', options: ['grid', 'slider'] },
      { name: 'badgeLayout', type: 'enum', label: 'Badge Layout', options: ['row', 'grid'] },
      // Styling
      {
        name: 'backgroundColor',
        type: 'enum',
        label: 'Background Style',
        options: ['gradient-dark', 'gradient-light', 'solid', 'transparent'],
        description: 'gradient-dark for JKKN green gradient',
      },
      {
        name: 'glassmorphismVariant',
        type: 'enum',
        label: 'Glassmorphism Style',
        options: ['dark', 'light', 'dark-elegant'],
      },
      {
        name: 'cardStyle',
        type: 'enum',
        label: 'Card Style',
        options: ['glass', 'solid', 'gradient'],
      },
      // Animation
      { name: 'showAnimations', type: 'boolean', label: 'Enable Scroll Animations' },
      {
        name: 'animationPreset',
        type: 'enum',
        label: 'Animation Style',
        options: ['stagger', 'fade-in-up', 'zoom-in', 'none'],
      },
      {
        name: 'staggerDelay',
        type: 'number',
        label: 'Stagger Delay (ms)',
        min: 50,
        max: 300,
        description: 'Delay between each card animation',
      },
    ],
  },

  WhyChooseJKKN: {
    name: 'WhyChooseJKKN',
    displayName: 'Why Choose JKKN',
    category: 'content',
    description: 'Modern card-based layout with USP cards and full typography customization for all text elements',
    icon: 'Sparkles',
    previewImage: '/cms-previews/WhyChooseJKKN.png',
    component: WhyChooseJKKN,
    propsSchema: WhyChooseJKKNPropsSchema,
    defaultProps: {
      // Content
      title: 'Why Choose JKKN?',
      subtitle: '73+ Years of Transforming Lives Through Progressive Education',
      tagline: 'Where Legacy Meets Innovation | Excellence Without Elitism',
      badgeText: 'Why Choose Us',
      additionalUspsHeading: 'And Much More...',
      // Badge Typography
      badgeColor: '#0b6d41',
      badgeBgColor: '#0b6d411a',
      badgeFontSize: 'sm',
      badgeFontWeight: 'semibold',
      // Title Typography
      titleColor: '#171717',
      titleFontSize: '5xl',
      titleFontWeight: 'bold',
      // Subtitle Typography
      subtitleColor: '#0b6d41',
      subtitleFontSize: '2xl',
      subtitleFontWeight: 'semibold',
      // Tagline Typography
      taglineColor: '#525252',
      taglineFontSize: 'lg',
      taglineFontWeight: 'normal',
      // Card Typography
      cardTitleColor: '#1f2937',
      cardTitleFontSize: 'md',
      cardTitleFontWeight: 'semibold',
      cardStatColor: '#0b6d41',
      cardStatFontSize: '3xl',
      cardStatFontWeight: 'bold',
      // Additional USPs Typography
      additionalUspsHeadingColor: '#1f2937',
      additionalUspsHeadingFontSize: 'lg',
      additionalUspsHeadingFontWeight: 'semibold',
      additionalUspsTextColor: '#374151',
      additionalUspsTextFontSize: 'sm',
      additionalUspsTextFontWeight: 'normal',
      // Legacy compatibility
      primaryColor: '#0b6d41',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['usp', 'why', 'choose', 'benefits', 'features', 'advantages', 'placement', 'legacy', 'typography'],
    editableProps: [
      // === CONTENT ===
      { name: 'badgeText', type: 'string', label: 'Badge Text', placeholder: 'Why Choose Us' },
      { name: 'title', type: 'string', label: 'Section Title', required: true, placeholder: 'Why Choose JKKN?' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', placeholder: '73+ Years of Transforming Lives...' },
      { name: 'tagline', type: 'string', label: 'Tagline', placeholder: 'Where Legacy Meets Innovation...' },
      { name: 'additionalUspsHeading', type: 'string', label: 'Additional USPs Heading', placeholder: 'And Much More...' },

      // === BADGE TYPOGRAPHY ===
      { name: 'badgeColor', type: 'color', label: 'Badge Text Color' },
      { name: 'badgeBgColor', type: 'color', label: 'Badge Background' },
      { name: 'badgeFontSize', type: 'enum', label: 'Badge Font Size', options: ['sm', 'md', 'lg'] },
      { name: 'badgeFontWeight', type: 'enum', label: 'Badge Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },

      // === TITLE TYPOGRAPHY ===
      { name: 'titleFontFamily', type: 'enum', label: 'Title Font', options: ['Default (Serif)', 'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Georgia'], description: 'Select font family' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'titleFontSize', type: 'enum', label: 'Title Font Size', options: ['2xl', '3xl', '4xl', '5xl', '6xl'] },
      { name: 'titleFontWeight', type: 'enum', label: 'Title Font Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },

      // === SUBTITLE TYPOGRAPHY ===
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'subtitleFontSize', type: 'enum', label: 'Subtitle Font Size', options: ['lg', 'xl', '2xl', '3xl'] },
      { name: 'subtitleFontWeight', type: 'enum', label: 'Subtitle Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },

      // === TAGLINE TYPOGRAPHY ===
      { name: 'taglineColor', type: 'color', label: 'Tagline Color' },
      { name: 'taglineFontSize', type: 'enum', label: 'Tagline Font Size', options: ['sm', 'md', 'lg', 'xl'] },
      { name: 'taglineFontWeight', type: 'enum', label: 'Tagline Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },

      // === CARD TYPOGRAPHY ===
      { name: 'cardStatColor', type: 'color', label: 'Card Stat Color' },
      { name: 'cardStatFontSize', type: 'enum', label: 'Card Stat Size', options: ['xl', '2xl', '3xl', '4xl'] },
      { name: 'cardStatFontWeight', type: 'enum', label: 'Card Stat Weight', options: ['medium', 'semibold', 'bold', 'extrabold'] },
      { name: 'cardTitleColor', type: 'color', label: 'Card Title Color' },
      { name: 'cardTitleFontSize', type: 'enum', label: 'Card Title Size', options: ['sm', 'md', 'lg', 'xl'] },
      { name: 'cardTitleFontWeight', type: 'enum', label: 'Card Title Weight', options: ['normal', 'medium', 'semibold', 'bold'] },

      // === ADDITIONAL USPS TYPOGRAPHY ===
      { name: 'additionalUspsHeadingColor', type: 'color', label: 'USPs Heading Color' },
      { name: 'additionalUspsHeadingFontSize', type: 'enum', label: 'USPs Heading Size', options: ['md', 'lg', 'xl'] },
      { name: 'additionalUspsHeadingFontWeight', type: 'enum', label: 'USPs Heading Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'additionalUspsTextColor', type: 'color', label: 'USPs Text Color' },
      { name: 'additionalUspsTextFontSize', type: 'enum', label: 'USPs Text Size', options: ['xs', 'sm', 'md'] },
      { name: 'additionalUspsTextFontWeight', type: 'enum', label: 'USPs Text Weight', options: ['normal', 'medium', 'semibold'] },

      // === USP CARDS ===
      {
        name: 'uspCards',
        type: 'array',
        label: 'USP Cards',
        description: '6 key differentiators with icons',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: {
              type: 'enum',
              label: 'Icon',
              options: ['heritage', 'career', 'excellence', 'expertise', 'facilities', 'value'],
              required: true,
            },
            title: {
              type: 'string',
              label: 'Card Title',
              required: true,
              placeholder: 'Years of Educational Legacy',
            },
            stat: {
              type: 'string',
              label: 'Stat Value',
              placeholder: '74+',
              description: 'Optional stat number',
            },
          },
          required: ['icon', 'title'],
        },
      },
      { name: 'additionalUsps', type: 'array', label: 'Additional USPs', itemType: 'string', description: 'Extra USP points shown as a list' },

      // === LEGACY (kept for compatibility) ===
      { name: 'primaryColor', type: 'color', label: 'Primary Accent Color', description: 'Legacy prop for accent color' },
    ],
  },

  // === ADMISSIONS PAGE BUILDER COMPONENTS ===
  AdmissionHero: {
    name: 'AdmissionHero',
    displayName: 'Admission Hero',
    category: 'admissions',
    description: 'Hero section for admissions page with animated badge, CTAs, and trust badges',
    icon: 'GraduationCap',
    previewImage: '/cms-previews/AdmissionHero.png',
    component: AdmissionHero,
    propsSchema: AdmissionHeroPropsSchema,
    defaultProps: {
      badge: {
        text: 'Celebrating #JKKN100 — Founder\'s Centenary Year',
        emoji: '🎉',
      },
      title: 'Admissions 2025-26',
      titleAccentWord: '2025-26',
      subtitle: 'Begin your transformative learning journey at J.K.K. Nattraja Educational Institutions — where 5000+ Learners discover their potential across 7 specialized colleges.',
      ctaButtons: [
        { label: 'Apply Now', link: 'https://apply.jkkn.ac.in', variant: 'primary', isExternal: true, icon: 'external' },
        { label: 'Explore Colleges', link: '#colleges', variant: 'secondary', icon: 'arrow' },
        { label: 'Download Prospectus', link: '/prospectus.pdf', variant: 'outline', icon: 'download' },
      ],
      trustBadges: [
        { icon: 'check', label: 'NAAC Accredited' },
        { icon: 'check', label: 'AICTE Approved' },
        { icon: 'check', label: 'UGC Recognized' },
        { icon: 'check', label: 'NBA Accredited' },
      ],
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['hero', 'admissions', 'apply', 'cta', 'trust', 'badges', 'welcome'],
    editableProps: [
      {
        name: 'badge',
        type: 'object',
        label: 'Badge',
        description: 'Animated badge shown above title',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Badge Text' },
            emoji: { type: 'string', label: 'Emoji (optional)' },
          },
        },
      },
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word', description: 'Word in title to highlight' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'ctaButtons',
        type: 'array',
        label: 'CTA Buttons',
        description: 'Up to 3 call-to-action buttons',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Button Label', required: true },
            link: { type: 'string', label: 'Link URL', required: true },
            variant: { type: 'enum', label: 'Style', options: ['primary', 'secondary', 'outline'] },
            isExternal: { type: 'boolean', label: 'Open in New Tab' },
            icon: { type: 'enum', label: 'Icon', options: ['arrow', 'download', 'external', 'none'] },
          },
          required: ['label', 'link'],
        },
      },
      {
        name: 'trustBadges',
        type: 'array',
        label: 'Trust Badges',
        description: 'Accreditation and certification badges',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Badge Label', required: true },
          },
          required: ['label'],
        },
      },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  CollegesGrid: {
    name: 'CollegesGrid',
    displayName: 'Colleges Grid',
    category: 'admissions',
    description: 'Grid of college cards with colored headers for admissions pages',
    icon: 'Building2',
    previewImage: '/cms-previews/CollegesGrid.png',
    component: CollegesGrid,
    propsSchema: CollegesGridPropsSchema,
    defaultProps: {
      badge: 'OUR COLLEGES',
      title: 'JKKN Institutions',
      titleAccentWord: 'Institutions',
      subtitle: 'Seven premier institutions under one trusted umbrella',
      colleges: [],
      columns: '3',
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['colleges', 'institutions', 'grid', 'admissions', 'cards'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text', description: 'Small badge above title' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word', description: 'Word in title to highlight with accent color' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'colleges',
        type: 'array',
        label: 'Colleges',
        description: 'List of colleges to display',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'College Name', required: true },
            description: { type: 'string', label: 'Description', required: true },
            headerColor: { type: 'color', label: 'Header Color' },
            link: { type: 'string', label: 'Link URL' },
            logo: { type: 'image', label: 'College Logo' },
          },
          required: ['name', 'description'],
        },
      },
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '3', '4'] },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-dark', 'solid-light', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  AdmissionProcessTimeline: {
    name: 'AdmissionProcessTimeline',
    displayName: 'Admission Process Timeline',
    category: 'admissions',
    description: 'Horizontal or vertical stepper showing admission process steps',
    icon: 'ListOrdered',
    previewImage: '/cms-previews/AdmissionProcessTimeline.png',
    component: AdmissionProcessTimeline,
    propsSchema: AdmissionProcessTimelinePropsSchema,
    defaultProps: {
      badge: 'HOW TO APPLY',
      title: 'Admission Process',
      titleAccentWord: 'Process',
      subtitle: 'Follow these simple steps to join JKKN Institutions',
      steps: [],
      orientation: 'horizontal',
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      stepColor: '#ffffff',
      activeColor: '#D4AF37',
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['admission', 'process', 'steps', 'timeline', 'apply', 'how to'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'steps',
        type: 'array',
        label: 'Process Steps',
        description: 'Admission process steps',
        itemSchema: {
          properties: {
            number: { type: 'number', label: 'Step Number', required: true },
            title: { type: 'string', label: 'Step Title', required: true },
            description: { type: 'string', label: 'Description', required: true },
            icon: { type: 'enum', label: 'Icon', options: ['FileText', 'ClipboardCheck', 'Receipt', 'GraduationCap', 'CheckCircle', 'Upload', 'CreditCard', 'Award'] },
          },
          required: ['number', 'title', 'description'],
        },
      },
      { name: 'orientation', type: 'enum', label: 'Orientation', options: ['horizontal', 'vertical'] },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-dark', 'solid-light', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'stepColor', type: 'color', label: 'Step Circle Color' },
      { name: 'activeColor', type: 'color', label: 'Active Step Color' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  AdmissionDatesTable: {
    name: 'AdmissionDatesTable',
    displayName: 'Admission Dates Table',
    category: 'admissions',
    description: 'Table showing important admission dates with status badges',
    icon: 'Calendar',
    previewImage: '/cms-previews/AdmissionDatesTable.png',
    component: AdmissionDatesTable,
    propsSchema: AdmissionDatesTablePropsSchema,
    defaultProps: {
      badge: 'IMPORTANT DATES',
      title: 'Admission Calendar',
      titleAccentWord: 'Calendar',
      subtitle: 'Mark your calendar with these important dates',
      dates: [],
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      alternatingRows: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['dates', 'calendar', 'admission', 'deadline', 'schedule', 'table'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'dates',
        type: 'array',
        label: 'Important Dates',
        description: 'List of admission events and dates',
        itemSchema: {
          properties: {
            event: { type: 'string', label: 'Event Name', required: true },
            date: { type: 'string', label: 'Date/Period', required: true },
            status: { type: 'enum', label: 'Status', options: ['upcoming', 'open', 'closed', 'extended'], required: true },
            notes: { type: 'string', label: 'Notes' },
          },
          required: ['event', 'date', 'status'],
        },
      },
      { name: 'alternatingRows', type: 'boolean', label: 'Alternating Row Colors' },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-dark', 'solid-light', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  EligibilityCriteriaTable: {
    name: 'EligibilityCriteriaTable',
    displayName: 'Eligibility Criteria Table',
    category: 'admissions',
    description: 'Table showing program eligibility requirements',
    icon: 'ClipboardList',
    previewImage: '/cms-previews/EligibilityCriteriaTable.png',
    component: EligibilityCriteriaTable,
    propsSchema: EligibilityCriteriaTablePropsSchema,
    defaultProps: {
      badge: 'ELIGIBILITY',
      title: 'Eligibility Criteria',
      titleAccentWord: 'Eligibility',
      subtitle: 'Check if you meet the requirements for your desired program',
      criteria: [],
      groupByCategory: false,
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['eligibility', 'criteria', 'requirements', 'qualification', 'admission', 'table'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'criteria',
        type: 'array',
        label: 'Eligibility Criteria',
        description: 'List of programs and their requirements',
        itemSchema: {
          properties: {
            program: { type: 'string', label: 'Program Name', required: true },
            qualification: { type: 'string', label: 'Qualification Required', required: true },
            ageLimit: { type: 'string', label: 'Age Limit' },
            otherRequirements: { type: 'string', label: 'Other Requirements' },
            category: { type: 'string', label: 'Category', description: 'Group programs by category' },
          },
          required: ['program', 'qualification'],
        },
      },
      { name: 'groupByCategory', type: 'boolean', label: 'Group by Category' },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-dark', 'solid-light', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  FeeStructureTable: {
    name: 'FeeStructureTable',
    displayName: 'Fee Structure Table',
    category: 'admissions',
    description: 'Table showing fee breakdown by program with currency formatting',
    icon: 'IndianRupee',
    previewImage: '/cms-previews/FeeStructureTable.png',
    component: FeeStructureTable,
    propsSchema: FeeStructureTablePropsSchema,
    defaultProps: {
      badge: 'FEE STRUCTURE',
      title: 'Fee Structure Overview',
      titleAccentWord: 'Structure',
      subtitle: 'Transparent and affordable fee structure for all programs',
      fees: [],
      currencySymbol: '₹',
      currencyLocale: 'en-IN',
      showHostelFee: true,
      showOtherFees: false,
      footerNotes: [],
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['fees', 'fee structure', 'tuition', 'hostel', 'cost', 'pricing', 'table'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'fees',
        type: 'array',
        label: 'Fee Structure',
        description: 'List of programs and their fees',
        itemSchema: {
          properties: {
            program: { type: 'string', label: 'Program Name', required: true },
            tuitionFee: { type: 'number', label: 'Tuition Fee', required: true },
            hostelFee: { type: 'number', label: 'Hostel Fee' },
            otherFees: { type: 'number', label: 'Other Fees' },
            total: { type: 'number', label: 'Total Fee', required: true },
          },
          required: ['program', 'tuitionFee', 'total'],
        },
      },
      { name: 'currencySymbol', type: 'string', label: 'Currency Symbol' },
      { name: 'currencyLocale', type: 'string', label: 'Currency Locale', description: 'e.g., en-IN for Indian formatting' },
      { name: 'showHostelFee', type: 'boolean', label: 'Show Hostel Fee Column' },
      { name: 'showOtherFees', type: 'boolean', label: 'Show Other Fees Column' },
      { name: 'footerNotes', type: 'array', label: 'Footer Notes', itemType: 'string', description: 'Additional notes below the table' },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-dark', 'solid-light', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  ScholarshipsSection: {
    name: 'ScholarshipsSection',
    displayName: 'Scholarships Section',
    category: 'admissions',
    description: 'Grid of scholarship cards with eligibility criteria',
    icon: 'Award',
    previewImage: '/cms-previews/ScholarshipsSection.png',
    component: ScholarshipsSection,
    propsSchema: ScholarshipsSectionPropsSchema,
    defaultProps: {
      badge: 'SCHOLARSHIPS',
      title: 'Scholarships & Financial Aid',
      titleAccentWord: 'Financial Aid',
      subtitle: 'We believe financial constraints should never limit your dreams',
      scholarships: [],
      showCTA: true,
      ctaText: 'Apply for Scholarship',
      ctaLink: '/scholarships/apply',
      columns: '4',
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['scholarships', 'financial aid', 'grants', 'awards', 'merit', 'need-based'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'scholarships',
        type: 'array',
        label: 'Scholarships',
        description: 'List of scholarship types',
        itemSchema: {
          properties: {
            icon: { type: 'enum', label: 'Icon', options: ['Trophy', 'Building2', 'Heart', 'Medal', 'Award'], required: true },
            title: { type: 'string', label: 'Scholarship Title', required: true },
            description: { type: 'string', label: 'Description', required: true },
            eligibility: { type: 'array', label: 'Eligibility Criteria', itemType: 'string' },
            type: { type: 'enum', label: 'Type', options: ['merit', 'government', 'need-based', 'sports-cultural'], required: true },
          },
          required: ['icon', 'title', 'description', 'type'],
        },
      },
      { name: 'showCTA', type: 'boolean', label: 'Show CTA Button' },
      { name: 'ctaText', type: 'string', label: 'CTA Button Text' },
      { name: 'ctaLink', type: 'string', label: 'CTA Button Link' },
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '4'] },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-dark', 'solid-light', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  DocumentsChecklist: {
    name: 'DocumentsChecklist',
    displayName: 'Documents Checklist',
    category: 'admissions',
    description: 'Two-column checklist for required admission documents',
    icon: 'FileCheck',
    previewImage: '/cms-previews/DocumentsChecklist.png',
    component: DocumentsChecklist,
    propsSchema: DocumentsChecklistPropsSchema,
    defaultProps: {
      badge: 'DOCUMENTS',
      title: 'Documents Required',
      titleAccentWord: 'Documents',
      subtitle: 'Keep these documents ready for a smooth admission process',
      leftColumnTitle: 'For All Programs',
      leftColumnDocuments: [],
      rightColumnTitle: 'Additional Documents',
      rightColumnDocuments: [],
      showCTA: true,
      ctaText: 'Download Complete Checklist',
      ctaLink: '/downloads/admission-checklist.pdf',
      checkIcon: 'checkbox',
      backgroundColor: 'gradient-dark',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['documents', 'checklist', 'required', 'admission', 'paperwork'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'leftColumnTitle', type: 'string', label: 'Left Column Title' },
      {
        name: 'leftColumnDocuments',
        type: 'array',
        label: 'Left Column Documents',
        description: 'Documents for all programs',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Document Name', required: true },
            required: { type: 'boolean', label: 'Required' },
          },
          required: ['text'],
        },
      },
      { name: 'rightColumnTitle', type: 'string', label: 'Right Column Title' },
      {
        name: 'rightColumnDocuments',
        type: 'array',
        label: 'Right Column Documents',
        description: 'Additional documents',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Document Name', required: true },
            required: { type: 'boolean', label: 'Required' },
          },
          required: ['text'],
        },
      },
      { name: 'showCTA', type: 'boolean', label: 'Show Download Button' },
      { name: 'ctaText', type: 'string', label: 'Button Text' },
      { name: 'ctaLink', type: 'string', label: 'Button Link' },
      { name: 'checkIcon', type: 'enum', label: 'Check Icon Style', options: ['check', 'checkbox', 'circle-check'] },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-dark', 'solid-light', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  WhyChooseSection: {
    name: 'WhyChooseSection',
    displayName: 'Why Choose Section',
    category: 'admissions',
    description: 'Feature cards grid showcasing reasons to choose JKKN',
    icon: 'Star',
    previewImage: '/cms-previews/WhyChooseSection.png',
    component: WhyChooseSection,
    propsSchema: WhyChooseSectionPropsSchema,
    defaultProps: {
      badge: 'WHY CHOOSE JKKN?',
      title: 'Why Choose JKKN?',
      titleAccentWord: 'JKKN',
      subtitle: 'Discover what makes J.K.K. Nattraja Educational Institutions the preferred choice for thousands of Learners every year.',
      features: [],
      columns: '3',
      backgroundColor: 'gradient-light',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['why choose', 'features', 'benefits', 'reasons', 'usp', 'admissions'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        description: 'Add feature cards with icon, title, and description',
        itemSchema: {
          properties: {
            icon: { type: 'string', label: 'Icon Name (Lucide)', required: true },
            title: { type: 'string', label: 'Title', required: true },
            description: { type: 'string', label: 'Description', required: true },
          },
          required: ['icon', 'title', 'description'],
        },
      },
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '3'] },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  CampusFeaturesGrid: {
    name: 'CampusFeaturesGrid',
    displayName: 'Campus Features Grid',
    category: 'admissions',
    description: 'Grid of campus amenities and facilities with emoji icons',
    icon: 'Building2',
    previewImage: '/cms-previews/CampusFeaturesGrid.png',
    component: CampusFeaturesGrid,
    propsSchema: CampusFeaturesGridPropsSchema,
    defaultProps: {
      badge: 'CAMPUS LIFE',
      title: 'Campus Life at JKKN',
      titleAccentWord: 'Campus Life',
      subtitle: 'Beyond academics — experience a vibrant campus life with world-class facilities.',
      features: [],
      columns: '4',
      backgroundColor: 'gradient-light',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['campus', 'facilities', 'amenities', 'hostel', 'library', 'sports', 'admissions'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'features',
        type: 'array',
        label: 'Campus Features',
        description: 'Add features with emoji, title, and description',
        itemSchema: {
          properties: {
            emoji: { type: 'string', label: 'Emoji', required: true },
            title: { type: 'string', label: 'Title', required: true },
            description: { type: 'string', label: 'Description', required: true },
          },
          required: ['emoji', 'title', 'description'],
        },
      },
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '4'] },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  PlacementsHighlights: {
    name: 'PlacementsHighlights',
    displayName: 'Placements Highlights',
    category: 'admissions',
    description: 'Placement statistics with animated counters and recruiter list',
    icon: 'Briefcase',
    previewImage: '/cms-previews/PlacementsHighlights.png',
    component: PlacementsHighlights,
    propsSchema: PlacementsHighlightsPropsSchema,
    defaultProps: {
      badge: 'PLACEMENTS',
      title: 'Placement Highlights',
      titleAccentWord: 'Placement',
      subtitle: 'From campus to career — JKKN Learners are recruited by top companies across industries.',
      stats: [],
      recruitersText: 'Top Recruiters: Apollo Hospitals • Infosys • TCS • Wipro • HCL • Dr. Reddy\'s • Cipla • Sun Pharma • L&T • Ashok Leyland • Cognizant • Tech Mahindra • and 500+ more',
      showCTA: true,
      ctaText: 'View Complete Placement Records',
      ctaLink: '/placements/',
      backgroundColor: 'gradient-light',
      showAnimations: true,
      accentColor: '#D4AF37',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['placements', 'jobs', 'recruiters', 'career', 'statistics', 'admissions'],
    editableProps: [
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'stats',
        type: 'array',
        label: 'Statistics',
        description: 'Add placement statistics with animated counters',
        itemSchema: {
          properties: {
            value: { type: 'string', label: 'Value', required: true },
            label: { type: 'string', label: 'Label', required: true },
            prefix: { type: 'string', label: 'Prefix (e.g., ₹)' },
            suffix: { type: 'string', label: 'Suffix (e.g., +, %, LPA)' },
          },
          required: ['value', 'label'],
        },
      },
      { name: 'recruitersText', type: 'string', label: 'Recruiters Text', multiline: true },
      { name: 'showCTA', type: 'boolean', label: 'Show CTA Button' },
      { name: 'ctaText', type: 'string', label: 'Button Text' },
      { name: 'ctaLink', type: 'string', label: 'Button Link' },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid', 'transparent'] },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
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

  TrustBadges: {
    name: 'TrustBadges',
    displayName: 'Trust Badges',
    category: 'content',
    description: 'Display trust indicators, achievements, and accolades with icons - perfect below hero sections',
    icon: 'Award',
    previewImage: '/cms-previews/TrustBadges.png',
    component: TrustBadges,
    propsSchema: TrustBadgesPropsSchema,
    defaultProps: {
      badges: [
        { icon: 'Award', text: 'NAAC Accredited' },
        { icon: 'TrendingUp', text: '95%+ Placements' },
        { icon: 'Users', text: '100+ Top Recruiters' },
        { icon: 'Calendar', text: '39 Years of Excellence' }
      ],
      alignment: 'center',
      badgeStyle: 'pill',
      backgroundColor: '#ffffff',
      textColor: '#171717',
      iconColor: '#0b6d41',
      borderColor: '#ffffff4d',
      gap: 'md',
      animated: true,
    },
    supportsChildren: false,
    isFullWidth: false,
    keywords: ['trust', 'badges', 'achievements', 'awards', 'accreditation', 'stats', 'social proof'],
    editableProps: [
      {
        name: 'badges',
        type: 'array',
        label: 'Trust Badges',
        description: 'Add trust indicators with icons and text',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: {
              type: 'string',
              label: 'Icon',
              required: true,
              format: 'icon-select',
            },
            text: {
              type: 'string',
              label: 'Text',
              required: true,
            },
          },
          required: ['icon', 'text'],
        },
      },
      { name: 'alignment', type: 'enum', label: 'Alignment', options: ['left', 'center', 'right'] },
      { name: 'badgeStyle', type: 'enum', label: 'Badge Style', options: ['pill', 'card', 'minimal'], description: 'Visual style of badges' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
      { name: 'iconColor', type: 'color', label: 'Icon Color' },
      { name: 'borderColor', type: 'color', label: 'Border Color' },
      { name: 'gap', type: 'enum', label: 'Gap Between Badges', options: ['sm', 'md', 'lg'] },
      { name: 'animated', type: 'boolean', label: 'Enable Animations', description: 'Hover effects and transitions' },
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
      headerPart1Font: z.string().optional(),
      headerPart2: z.string().default('JKKN Institution'),
      headerPart2Font: z.string().optional(),
      titleColor: z.string().optional(),
      subtitleColor: z.string().optional(),
      accentColor: z.string().optional(),
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
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark']).default('solid'),
      badgeColor: z.string().default('#0b6d41'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      showDecorative: z.boolean().default(true),
      layout: z.enum(['default', 'reversed']).default('default'),
      removeBottomPadding: z.boolean().default(false),
    }),
    defaultProps: {
      headerPart1: 'About',
      headerPart1Font: '',
      headerPart2: 'JKKN Institution',
      headerPart2Font: '',
      titleColor: '',
      subtitleColor: '',
      accentColor: '#D4AF37',
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
      backgroundStyle: 'solid',
      badgeColor: '#0b6d41',
      textColor: 'dark',
      showDecorative: true,
      layout: 'default',
      removeBottomPadding: false,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['about', 'institution', 'history', 'story', 'introduction', 'overview'],
    editableProps: [
      // Header
      { name: 'headerPart1', type: 'string', label: 'Header Part 1', required: true, description: 'First part of the header' },
      { name: 'headerPart1Font', type: 'enum', label: 'Header Part 1 Font', options: ['Default (Serif)', 'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Georgia'], description: 'Select font family' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2', required: true, description: 'Second part (colored)' },
      { name: 'headerPart2Font', type: 'enum', label: 'Header Part 2 Font', options: ['Default (Serif)', 'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Georgia'], description: 'Select font family' },
      { name: 'titleColor', type: 'color', label: 'Title Color', description: 'Leave empty for auto' },
      { name: 'accentColor', type: 'color', label: 'Accent Word Color', description: 'Color for Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color', description: 'Leave empty for auto' },
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
      { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Only used when Background Style is "solid"' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark'], description: 'Choose background style' },
      { name: 'badgeColor', type: 'color', label: 'Badge Color' },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'], description: 'Use "light" for gradient backgrounds' },
      { name: 'showDecorative', type: 'boolean', label: 'Show Decorative Element' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['default', 'reversed'], description: 'Image on right (default) or left (reversed)' },
      { name: 'removeBottomPadding', type: 'boolean', label: 'Remove Bottom Padding', description: 'Remove bottom padding for seamless section connection' },
    ],
  },

  JKKN100CentenarySection: {
    name: 'JKKN100CentenarySection',
    displayName: '#JKKN100 Centenary',
    category: 'content',
    description: 'Elegant two-column section celebrating JKKN 100th anniversary with gold-framed founder photo, quote, and call-to-action buttons',
    icon: 'Award',
    previewImage: '/cms-previews/JKKN100CentenarySection.png',
    component: JKKN100CentenarySection,
    propsSchema: z.object({
      badge: z.string().default('#JKKN100'),
      tagline: z.string().default('CELEBRATING A CENTURY OF EXCELLENCE'),
      founderImage: z.string().optional(),
      founderImageAlt: z.string().default('Kodai Vallal Shri. J.K.K. Nataraja Chettiar'),
      founderName: z.string().default('Kodai Vallal Shri. J.K.K. Nataraja Chettiar'),
      founderYears: z.string().default('1895 - 1995'),
      quote: z.string().default('Education is the foundation of a prosperous society'),
      timelineStart: z.string().default('November 2025'),
      timelineEnd: z.string().default('November 2026'),
      timelineSubtitle: z.string().default('Honoring 100 Years of Our Founder\'s Birth'),
      // CTA Buttons
      primaryCtaLabel: z.string().default('Watch Tribute Video'),
      tributeVideoUrl: z.string().default(''),
      secondaryCtaLabel: z.string().default('Our Heritage'),
      heritageUrl: z.string().default('/about/heritage'),
      openHeritageInNewTab: z.boolean().default(false),
      // Typography - Badge
      badgeFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('bold'),
      badgeFontStyle: z.enum(['normal', 'italic']).default('normal'),
      badgeColor: z.string().default('#0b6d41'),
      // Typography - Tagline
      taglineFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('medium'),
      taglineFontStyle: z.enum(['normal', 'italic']).default('normal'),
      taglineColor: z.string().default('#d4af37'),
      // Typography - Quote
      quoteFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
      quoteFontStyle: z.enum(['normal', 'italic']).default('italic'),
      quoteColor: z.string().default('#1a1a1a'),
      // Typography - Founder Name
      founderNameFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),
      founderNameColor: z.string().default('#1f2937'),
      // Typography - Timeline
      timelineFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),
      timelineColor: z.string().default('#0b6d41'),
      // Styling
      backgroundColor: z.string().default('#ffffff'),
      accentColor: z.string().default('#0b6d41'),
      goldColor: z.string().default('#d4af37'),
      showAnimations: z.boolean().default(true),
      paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
    }),
    defaultProps: {
      badge: '#JKKN100',
      tagline: 'CELEBRATING A CENTURY OF EXCELLENCE',
      founderImage: '',
      founderImageAlt: 'Kodai Vallal Shri. J.K.K. Nataraja Chettiar',
      founderName: 'Kodai Vallal Shri. J.K.K. Nataraja Chettiar',
      founderYears: '1895 - 1995',
      quote: 'Education is the foundation of a prosperous society',
      timelineStart: 'November 2025',
      timelineEnd: 'November 2026',
      timelineSubtitle: 'Honoring 100 Years of Our Founder\'s Birth',
      // CTA Buttons
      primaryCtaLabel: 'Watch Tribute Video',
      tributeVideoUrl: '',
      secondaryCtaLabel: 'Our Heritage',
      heritageUrl: '/about/heritage',
      openHeritageInNewTab: false,
      // Typography - Badge
      badgeFontWeight: 'bold',
      badgeFontStyle: 'normal',
      badgeColor: '#0b6d41',
      // Typography - Tagline
      taglineFontWeight: 'medium',
      taglineFontStyle: 'normal',
      taglineColor: '#d4af37',
      // Typography - Quote
      quoteFontWeight: 'normal',
      quoteFontStyle: 'italic',
      quoteColor: '#1a1a1a',
      // Typography - Founder Name
      founderNameFontWeight: 'semibold',
      founderNameColor: '#1f2937',
      // Typography - Timeline
      timelineFontWeight: 'semibold',
      timelineColor: '#0b6d41',
      // Styling
      backgroundColor: '#ffffff',
      accentColor: '#0b6d41',
      goldColor: '#d4af37',
      showAnimations: true,
      paddingY: 'lg',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['jkkn100', 'centenary', 'celebration', 'founder', 'tribute', 'anniversary', 'heritage', '100', 'hundred', 'nataraja', 'chettiar'],
    editableProps: [
      // Content
      { name: 'badge', type: 'string', label: 'Badge Text', description: 'Main badge (e.g., #JKKN100)' },
      { name: 'tagline', type: 'string', label: 'Tagline', description: 'Tagline below badge' },
      { name: 'founderImage', type: 'image', label: 'Founder Photo', description: 'Upload founder photograph' },
      { name: 'founderImageAlt', type: 'string', label: 'Photo Alt Text', required: true },
      { name: 'founderName', type: 'string', label: 'Founder Name' },
      { name: 'founderYears', type: 'string', label: 'Founder Years', description: 'e.g., 1895 - 1995' },
      { name: 'quote', type: 'string', label: 'Quote', multiline: true },
      { name: 'timelineStart', type: 'string', label: 'Timeline Start', description: 'e.g., November 2025' },
      { name: 'timelineEnd', type: 'string', label: 'Timeline End', description: 'e.g., November 2026' },
      { name: 'timelineSubtitle', type: 'string', label: 'Timeline Subtitle' },
      // CTA Buttons
      { name: 'primaryCtaLabel', type: 'string', label: 'Video Button Label' },
      { name: 'tributeVideoUrl', type: 'string', label: 'Tribute Video URL', description: 'YouTube or Vimeo URL' },
      { name: 'secondaryCtaLabel', type: 'string', label: 'Heritage Button Label' },
      { name: 'heritageUrl', type: 'string', label: 'Heritage Page URL', description: 'Link to heritage page' },
      { name: 'openHeritageInNewTab', type: 'boolean', label: 'Open Heritage in New Tab' },
      // Badge Typography
      { name: 'badgeFontWeight', type: 'enum', label: 'Badge Font Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
      { name: 'badgeFontStyle', type: 'enum', label: 'Badge Font Style', options: ['normal', 'italic'] },
      { name: 'badgeColor', type: 'color', label: 'Badge Color' },
      // Tagline Typography
      { name: 'taglineFontWeight', type: 'enum', label: 'Tagline Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'taglineFontStyle', type: 'enum', label: 'Tagline Font Style', options: ['normal', 'italic'] },
      { name: 'taglineColor', type: 'color', label: 'Tagline Color' },
      // Quote Typography
      { name: 'quoteFontWeight', type: 'enum', label: 'Quote Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'quoteFontStyle', type: 'enum', label: 'Quote Font Style', options: ['normal', 'italic'] },
      { name: 'quoteColor', type: 'color', label: 'Quote Color' },
      // Founder Typography
      { name: 'founderNameFontWeight', type: 'enum', label: 'Founder Name Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'founderNameColor', type: 'color', label: 'Founder Name Color' },
      // Timeline Typography
      { name: 'timelineFontWeight', type: 'enum', label: 'Timeline Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'timelineColor', type: 'color', label: 'Timeline Color' },
      // Styling
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', description: 'Button & accent color' },
      { name: 'goldColor', type: 'color', label: 'Gold Color', description: 'Gold accent for frame' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations' },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'] },
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
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      cardStyle: z.enum(['modern', 'minimal', 'bordered']).default('modern'),
      showHoverEffect: z.boolean().default(true),
      accentColor: z.string().default('#ffde59'),
      cardTitleColor: z.string().default('#0b6d41'),
      removeTopPadding: z.boolean().default(false),
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
        { name: 'Sresakthimayeil Institute Of Nursing And Research', image: '', link: '/institutions/nursing', description: 'Compassionate nursing care' },
        { name: 'JKKN College of Allied Health Sciences', image: '', link: '/institutions/allied-health', description: 'Healthcare professionals' },
      ],
      columns: '3',
      gap: 'md',
      backgroundColor: '#ffffff',
      backgroundStyle: 'solid',
      textColor: 'dark',
      cardStyle: 'modern',
      showHoverEffect: true,
      accentColor: '#ffde59',
      cardTitleColor: '#0b6d41',
      removeTopPadding: false,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['institutions', 'colleges', 'grid', 'cards', 'showcase', 'schools', 'departments'],
    editableProps: [
      // Header
      { name: 'headerPart1', type: 'string', label: 'Header Part 1', required: true, description: 'First part of header' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2', required: true, description: 'Second part (colored)' },
      { name: 'headerFontFamily', type: 'enum', label: 'Header Font', options: ['Default (Serif)', 'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Georgia'], description: 'Select font family' },
      { name: 'headerFontSize', type: 'enum', label: 'Header Size', options: ['3xl', '4xl', '5xl', '6xl'] },
      { name: 'headerFontWeight', type: 'enum', label: 'Header Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
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
      { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Only used when Background Style is "solid"' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark'], description: 'Choose background style' },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'], description: 'Use "light" for gradient backgrounds' },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['modern', 'minimal', 'bordered'] },
      { name: 'showHoverEffect', type: 'boolean', label: 'Show Hover Effect' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', description: 'Color for underlines and highlights (yellow recommended)' },
      { name: 'cardTitleColor', type: 'color', label: 'Card Title Color' },
      { name: 'removeTopPadding', type: 'boolean', label: 'Remove Top Padding', description: 'Remove top padding for seamless section connection' },
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
      titleColor: z.string().optional(),
      subtitleColor: z.string().optional(),
      accentColor: z.string().optional(),
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
      titleColor: '',
      subtitleColor: '',
      accentColor: '#D4AF37',
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
      { name: 'headerFontFamily', type: 'enum', label: 'Header Font', options: ['Default (Serif)', 'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Georgia'], description: 'Select font family' },
      { name: 'headerFontSize', type: 'enum', label: 'Header Size', options: ['3xl', '4xl', '5xl', '6xl'] },
      { name: 'headerFontWeight', type: 'enum', label: 'Header Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
      { name: 'titleColor', type: 'color', label: 'Title Color', description: 'Leave empty for auto' },
      { name: 'accentColor', type: 'color', label: 'Accent Word Color', description: 'Color for Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color', description: 'Leave empty for auto' },
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
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark', 'gradient-cream']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      dateBadgeColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
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
      backgroundStyle: 'solid',
      textColor: 'dark',
      dateBadgeColor: '#0b6d41',
      accentColor: '#ffde59',
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
      { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Only used when Background Style is solid' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark', 'gradient-cream'] },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'], description: 'Use light for gradient backgrounds' },
      { name: 'dateBadgeColor', type: 'color', label: 'Date Badge Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', description: 'Color for underlines and highlights' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
      { name: 'showViewAllButton', type: 'boolean', label: 'Show View All Button' },
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
      headerPart1Color: z.string().default('#ffde59'),
      headerPart2Color: z.string().default('#ffde59'),
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
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark', 'gradient-cream']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      cardStyle: z.enum(['simple', 'overlay', 'bordered']).default('simple'),
      accentColor: z.string().default('#ffde59'),
      autoplaySpeed: z.number().default(3000),
    }),
    defaultProps: {
      headerPart1: 'Latest',
      headerPart2: 'Buzz',
      headerPart1Color: '#ffde59',
      headerPart2Color: '#ffde59',
      headerPart2Italic: true,
      subtitle: "What's trending at JKKN - Stay connected with the most exciting updates and announcements",
      buzzItems: [],
      layout: 'carousel',
      columns: '4',
      backgroundColor: '#ffffff',
      backgroundStyle: 'solid',
      textColor: 'dark',
      cardStyle: 'simple',
      accentColor: '#ffde59',
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
      { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Only used when Background Style is solid' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark', 'gradient-cream'] },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'], description: 'Use light for gradient backgrounds' },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['simple', 'overlay', 'bordered'] },
      { name: 'accentColor', type: 'color', label: 'Accent Color', description: 'Color for underlines and highlights' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
      { name: 'showViewAllButton', type: 'boolean', label: 'Show View All Button' },
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
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark', 'gradient-cream']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      cardBackgroundColor: z.string().default('#ffffff'),
      dateBadgeColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
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
      backgroundStyle: 'solid',
      textColor: 'dark',
      cardBackgroundColor: '#ffffff',
      dateBadgeColor: '#0b6d41',
      accentColor: '#ffde59',
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
      { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Only used when Background Style is solid' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark', 'gradient-cream'] },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'], description: 'Use light for gradient backgrounds' },
      { name: 'dateBadgeColor', type: 'color', label: 'Date Badge Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', description: 'Color for underlines and highlights' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
      { name: 'showViewAllButton', type: 'boolean', label: 'Show View All Button' },
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
      headerPart1Color: z.string().default('#ffde59'),
      headerPart2Color: z.string().default('#ffde59'),
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
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark', 'gradient-cream']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      categoryBadgeColor: z.string().default('#0b6d41'),
      playButtonColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
      autoplaySpeed: z.number().default(3000),
    }),
    defaultProps: {
      headerPart1: 'Campus',
      headerPart2: 'Videos',
      headerPart1Color: '#ffde59',
      headerPart2Color: '#ffde59',
      headerPart2Italic: true,
      subtitle: 'Experience JKKN Institution through our campus video tours',
      videos: [],
      layout: 'carousel',
      columns: '4',
      backgroundColor: '#ffffff',
      backgroundStyle: 'solid',
      textColor: 'dark',
      categoryBadgeColor: '#0b6d41',
      playButtonColor: '#0b6d41',
      accentColor: '#ffde59',
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
      { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Only used when Background Style is solid' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark', 'gradient-cream'] },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'], description: 'Use light for gradient backgrounds' },
      { name: 'categoryBadgeColor', type: 'color', label: 'Category Badge Color' },
      { name: 'playButtonColor', type: 'color', label: 'Play Button Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', description: 'Color for underlines and highlights' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
      { name: 'showViewAllButton', type: 'boolean', label: 'Show View All Button' },
    ],
  },

  EducationVideos: {
    name: 'EducationVideos',
    displayName: 'Education Videos',
    category: 'content',
    description: 'YouTube video player with playlist sidebar - videos managed from admin panel',
    icon: 'Video',
    previewImage: '/cms-previews/EducationVideos.png',
    component: EducationVideos,
    propsSchema: z.object({
      headerPart1: z.string().default('Education'),
      headerPart2: z.string().default('Videos'),
      headerPart1Color: z.string().default('#ffde59'),
      headerPart2Color: z.string().default('#ffde59'),
      subtitle: z.string().optional(),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-dark'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      headerPart1: 'Education',
      headerPart2: 'Videos',
      headerPart1Color: '#ffde59',
      headerPart2Color: '#ffde59',
      subtitle: 'Watch educational content from JKKN Institution',
      variant: 'modern-dark',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['videos', 'youtube', 'education', 'player', 'playlist', 'media'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'variant', type: 'enum', label: 'Style Variant', options: ['modern-dark', 'modern-light'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
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
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark', 'gradient-cream']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      cardBackgroundColor: z.string().default('#ffffff'),
      showBorder: z.boolean().default(true),
      grayscale: z.boolean().default(false),
      accentColor: z.string().default('#ffde59'),
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
      backgroundStyle: 'solid',
      textColor: 'dark',
      cardBackgroundColor: '#ffffff',
      showBorder: true,
      grayscale: false,
      accentColor: '#ffde59',
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
            logo: { type: 'string', label: 'Logo', format: 'image' },
            link: { type: 'string', label: 'Website URL' },
          },
          required: ['name'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid', 'marquee'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['4', '5', '6', '8'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Only used when Background Style is solid' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark', 'gradient-cream'] },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'], description: 'Use light for gradient backgrounds' },
      { name: 'showBorder', type: 'boolean', label: 'Show Border' },
      { name: 'grayscale', type: 'boolean', label: 'Grayscale Logos' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', description: 'Color for underlines and highlights' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
    ],
  },

  EducationStories: {
    name: 'EducationStories',
    displayName: 'Education Stories',
    category: 'content',
    description: 'Circular profile carousel inspired by Instagram stories for showcasing student success stories',
    icon: 'GraduationCap',
    previewImage: '/cms-previews/EducationStories.png',
    component: EducationStories,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerPart1: z.string().default('Education'),
      headerPart2: z.string().default('Stories'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      stories: z.array(z.object({
        name: z.string(),
        image: z.string().optional(),
        role: z.string().optional(),
        video: z.string().optional(),
        link: z.string().optional(),
        isNew: z.boolean().optional().default(false),
      })).default([]),
      cardHeight: z.enum(['short', 'medium', 'tall']).default('medium'),
      showNames: z.boolean().default(true),
      variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light'),
      showDecorations: z.boolean().default(true),
      autoplay: z.boolean().default(true),
      autoplaySpeed: z.number().default(3000),
    }),
    defaultProps: {
      showHeader: true,
      headerPart1: 'Education',
      headerPart2: 'Stories',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      stories: [],
      cardHeight: 'medium',
      showNames: true,
      variant: 'modern-light',
      showDecorations: true,
      autoplay: true,
      autoplaySpeed: 3000,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['stories', 'carousel', 'profiles', 'students', 'success', 'education', 'circular'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      {
        name: 'stories',
        type: 'array',
        label: 'Stories',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Name', required: true },
            image: { type: 'string', label: 'Profile Image URL' },
            role: { type: 'string', label: 'Role/Department' },
            video: { type: 'string', label: 'Video URL' },
            link: { type: 'string', label: 'Link URL' },
            isNew: { type: 'boolean', label: 'Show as New' },
          },
          required: ['name'],
        },
      },
      { name: 'cardHeight', type: 'enum', label: 'Card Height', options: ['short', 'medium', 'tall'] },
      { name: 'showNames', type: 'boolean', label: 'Show Names' },
      { name: 'variant', type: 'enum', label: 'Visual Style', options: ['modern-dark', 'modern-light', 'classic'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
      { name: 'autoplay', type: 'boolean', label: 'Enable Autoplay' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
    ],
  },

  GalleryPage: {
    name: 'GalleryPage',
    displayName: 'Gallery Page',
    category: 'content',
    description: 'Full gallery page with photos, videos, and category filtering with lightbox support',
    icon: 'Images',
    previewImage: '/cms-previews/GalleryPage.png',
    component: GalleryPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Gallery'),
      headerSubtitle: z.string().optional(),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#ffde59'),
      items: z.array(z.object({
        id: z.string(),
        type: z.enum(['image', 'video']),
        title: z.string(),
        thumbnail: z.string(),
        thumbnailAlt: z.string(),
        fullSrc: z.string(),
        fullSrcAlt: z.string(),
        category: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
      })).default([]),
      categories: z.array(z.string()).default(['All', 'Events', 'Campus', 'Students', 'Faculty']),
      showCategoryFilter: z.boolean().default(true),
      columns: z.enum(['2', '3', '4']).default('4'),
      gap: z.enum(['sm', 'md', 'lg']).default('md'),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
      enableLightbox: z.boolean().default(true),
      enableVideoPlayback: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Gallery',
      headerSubtitle: 'Moments captured at JKKN',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#ffde59',
      items: [],
      categories: ['All', 'Events', 'Campus', 'Students', 'Faculty'],
      showCategoryFilter: true,
      columns: '4',
      gap: 'md',
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
      enableLightbox: true,
      enableVideoPlayback: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['gallery', 'photos', 'videos', 'images', 'albums', 'lightbox', 'grid', 'media'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'headerPart1Color', type: 'color', label: 'Title Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Accent Color' },
      {
        name: 'items',
        type: 'array',
        label: 'Gallery Items',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'ID', required: true },
            type: { type: 'string', label: 'Type (image/video)', required: true },
            title: { type: 'string', label: 'Title', required: true },
            thumbnail: { type: 'image', label: 'Thumbnail Image', required: true },
            thumbnailAlt: { type: 'string', label: 'Thumbnail Alt Text', required: true },
            fullSrc: { type: 'image', label: 'Full Image/Video URL', required: true },
            fullSrcAlt: { type: 'string', label: 'Full Image Alt Text', required: true },
            category: { type: 'string', label: 'Category', required: true },
            description: { type: 'string', label: 'Description', multiline: true },
            date: { type: 'string', label: 'Date' },
          },
          required: ['id', 'type', 'title', 'thumbnail', 'thumbnailAlt', 'fullSrc', 'fullSrcAlt', 'category'],
        },
      },
      {
        name: 'categories',
        type: 'array',
        label: 'Categories',
        itemType: 'string',
      },
      { name: 'showCategoryFilter', type: 'boolean', label: 'Show Category Filter' },
      { name: 'columns', type: 'enum', label: 'Grid Columns', options: ['2', '3', '4'] },
      { name: 'gap', type: 'enum', label: 'Grid Gap', options: ['sm', 'md', 'lg'] },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
      { name: 'enableLightbox', type: 'boolean', label: 'Enable Lightbox' },
      { name: 'enableVideoPlayback', type: 'boolean', label: 'Enable Video Playback' },
    ],
  },

  PrivacyPolicyPage: {
    name: 'PrivacyPolicyPage',
    displayName: 'Privacy Policy Page',
    category: 'content',
    description: 'Full privacy policy page with glassmorphism styling and brand gradients',
    icon: 'Shield',
    previewImage: '/cms-previews/PrivacyPolicyPage.png',
    component: PrivacyPolicyPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Privacy Policy'),
      headerSubtitle: z.string().optional(),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#ffde59'),
      lastUpdated: z.string().default('December 2024'),
      introduction: z.string().default(''),
      sections: z.array(z.object({
        id: z.string(),
        title: z.string(),
        icon: z.string().optional(),
        content: z.string(),
      })).default([]),
      showContactInfo: z.boolean().default(true),
      contactEmail: z.string().default('info@jkkn.ac.in'),
      contactPhone: z.string().default('+91 93455 85001'),
      contactAddress: z.string().default('JKKN Educational Institutions, Natarajapuram, NH-544, Kumarapalayam (Tk), Namakkal (Dt), Tamil Nadu 638183'),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Privacy Policy',
      headerSubtitle: 'Your privacy matters to us',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#ffde59',
      lastUpdated: 'December 2024',
      introduction: 'At JKKN Educational Institutions, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our services.',
      sections: [
        {
          id: 'information-collection',
          title: 'Information We Collect',
          icon: 'Database',
          content: 'We collect information you provide directly to us, such as when you:\n\n• Fill out admission forms or inquiries\n• Register for events or workshops\n• Subscribe to our newsletters\n• Contact us for support or information\n• Apply for positions or opportunities\n\nThis information may include your name, email address, phone number, educational background, and other relevant details.',
        },
        {
          id: 'how-we-use',
          title: 'How We Use Your Information',
          icon: 'Eye',
          content: 'We use the information we collect to:\n\n• Process admissions and registrations\n• Communicate with you about programs and events\n• Send important updates and announcements\n• Improve our services and website experience\n• Respond to your inquiries and requests\n• Comply with legal obligations',
        },
        {
          id: 'data-security',
          title: 'Data Security',
          icon: 'Lock',
          content: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:\n\n• Secure servers and encrypted connections\n• Regular security assessments\n• Access controls and authentication\n• Staff training on data protection',
        },
        {
          id: 'your-rights',
          title: 'Your Rights',
          icon: 'UserCheck',
          content: 'You have the right to:\n\n• Access your personal information\n• Request correction of inaccurate data\n• Request deletion of your data\n• Opt-out of marketing communications\n• Lodge a complaint with supervisory authorities\n\nTo exercise these rights, please contact us using the information provided below.',
        },
        {
          id: 'cookies',
          title: 'Cookies and Tracking',
          icon: 'Cookie',
          content: 'Our website uses cookies and similar technologies to:\n\n• Remember your preferences\n• Analyze website traffic and usage\n• Improve user experience\n• Provide personalized content\n\nYou can manage cookie preferences through your browser settings.',
        },
        {
          id: 'policy-changes',
          title: 'Changes to This Policy',
          icon: 'FileText',
          content: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by:\n\n• Posting the updated policy on our website\n• Updating the "Last Updated" date\n• Sending notifications where appropriate\n\nWe encourage you to review this policy periodically.',
        },
      ],
      showContactInfo: true,
      contactEmail: 'info@jkkn.ac.in',
      contactPhone: '+91 93455 85001',
      contactAddress: 'JKKN Educational Institutions, Natarajapuram, NH-544, Kumarapalayam (Tk), Namakkal (Dt), Tamil Nadu 638183',
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['privacy', 'policy', 'legal', 'terms', 'data', 'protection', 'gdpr'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'headerPart1Color', type: 'color', label: 'Title Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Accent Color' },
      { name: 'lastUpdated', type: 'string', label: 'Last Updated Date' },
      { name: 'introduction', type: 'string', label: 'Introduction Text', multiline: true },
      {
        name: 'sections',
        type: 'array',
        label: 'Policy Sections',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'ID', required: true },
            title: { type: 'string', label: 'Section Title', required: true },
            icon: { type: 'string', label: 'Icon Name (Shield, Lock, Eye, Database, UserCheck)' },
            content: { type: 'string', label: 'Content (supports **bold** and bullet points)', required: true, multiline: true },
          },
          required: ['id', 'title', 'content'],
        },
      },
      { name: 'showContactInfo', type: 'boolean', label: 'Show Contact Info' },
      { name: 'contactEmail', type: 'string', label: 'Contact Email' },
      { name: 'contactPhone', type: 'string', label: 'Contact Phone' },
      { name: 'contactAddress', type: 'string', label: 'Contact Address', multiline: true },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  ContactPage: {
    name: 'ContactPage',
    displayName: 'Contact Page',
    category: 'content',
    description: 'Full contact page with glassmorphism styling, contact info cards, and admission CTA',
    icon: 'Phone',
    previewImage: '/cms-previews/ContactPage.png',
    component: ContactPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Contact Us'),
      headerSubtitle: z.string().optional(),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#ffde59'),
      contactIntro: z.string().default(''),
      contactCards: z.array(z.object({
        id: z.string(),
        type: z.enum(['phone', 'email', 'address', 'hours', 'website']),
        title: z.string(),
        value: z.string(),
        link: z.string().optional(),
      })).default([]),
      showAdmissionSection: z.boolean().default(true),
      admissionTitle: z.string().default('Online Admission Form'),
      admissionSubtitle: z.string().optional(),
      admissionButtonText: z.string().default('Apply Now'),
      admissionButtonLink: z.string().default('/admissions'),
      showOfficeHours: z.boolean().default(true),
      officeHoursTitle: z.string().default('Office Hours'),
      officeHours: z.array(z.object({
        day: z.string(),
        hours: z.string(),
      })).default([]),
      showMap: z.boolean().default(true),
      mapEmbedUrl: z.string().optional(),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Contact Us',
      headerSubtitle: 'Welcome to our Website. We are glad to have you around.',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#ffde59',
      contactIntro: "Get in touch with us for any inquiries about admissions, programs, or general information. We're here to help you on your educational journey.",
      contactCards: [
        {
          id: 'phone',
          type: 'phone',
          title: 'Phone',
          value: '+(91) 93458 55001',
          link: 'tel:+919345855001',
        },
        {
          id: 'email',
          type: 'email',
          title: 'Email',
          value: 'info@jkkn.ac.in',
          link: 'mailto:info@jkkn.ac.in',
        },
        {
          id: 'address',
          type: 'address',
          title: 'Address',
          value: 'Natarajapuram, NH-544 (Salem to Coimbatore), Kumarapalayam - 638183, Namakkal (DT)',
          link: 'https://maps.google.com/?q=JKKN+Educational+Institutions',
        },
      ],
      showAdmissionSection: true,
      admissionTitle: 'Online Admission Form',
      admissionSubtitle: 'Ready to join JKKN? Start your application process today.',
      admissionButtonText: 'Apply Now',
      admissionButtonLink: '/admissions',
      showOfficeHours: true,
      officeHoursTitle: 'Office Hours',
      officeHours: [
        { day: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
        { day: 'Sunday', hours: 'Closed' },
      ],
      showMap: true,
      mapEmbedUrl: 'https://www.google.com/maps?q=JKKN+Educational+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed',
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['contact', 'phone', 'email', 'address', 'admission', 'form', 'map'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'headerPart1Color', type: 'color', label: 'Primary Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Accent Color' },
      { name: 'contactIntro', type: 'string', label: 'Introduction Text', multiline: true },
      {
        name: 'contactCards',
        type: 'array',
        label: 'Contact Cards',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'ID', required: true },
            type: { type: 'string', label: 'Type (phone, email, address, hours, website)', required: true },
            title: { type: 'string', label: 'Title', required: true },
            value: { type: 'string', label: 'Value', required: true },
            link: { type: 'string', label: 'Link URL' },
          },
          required: ['id', 'type', 'title', 'value'],
        },
      },
      { name: 'showAdmissionSection', type: 'boolean', label: 'Show Admission Section' },
      { name: 'admissionTitle', type: 'string', label: 'Admission Title' },
      { name: 'admissionSubtitle', type: 'string', label: 'Admission Subtitle' },
      { name: 'admissionButtonText', type: 'string', label: 'Button Text' },
      { name: 'admissionButtonLink', type: 'string', label: 'Button Link' },
      { name: 'showOfficeHours', type: 'boolean', label: 'Show Office Hours' },
      { name: 'officeHoursTitle', type: 'string', label: 'Office Hours Title' },
      {
        name: 'officeHours',
        type: 'array',
        label: 'Office Hours',
        itemType: 'object',
        itemSchema: {
          properties: {
            day: { type: 'string', label: 'Day(s)', required: true },
            hours: { type: 'string', label: 'Hours', required: true },
          },
          required: ['day', 'hours'],
        },
      },
      { name: 'showMap', type: 'boolean', label: 'Show Map' },
      { name: 'mapEmbedUrl', type: 'string', label: 'Google Maps Embed URL', multiline: true },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  CollegeAlumni: {
    name: 'CollegeAlumni',
    displayName: 'College Alumni',
    category: 'content',
    description: 'Showcase alumni success stories with profiles, testimonials, and career achievements',
    icon: 'GraduationCap',
    previewImage: '/cms-previews/CollegeAlumni.png',
    component: CollegeAlumni,
    propsSchema: z.object({
      headerPart1: z.string().default('Our'),
      headerPart2: z.string().default('College Alumni'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().optional(),
      alumni: z.array(z.object({
        name: z.string(),
        image: z.string().optional(),
        batch: z.string().optional(),
        department: z.string().optional(),
        currentRole: z.string().optional(),
        company: z.string().optional(),
        location: z.string().optional(),
        testimonial: z.string().optional(),
        link: z.string().optional(),
      })).default([]),
      layout: z.enum(['carousel', 'grid', 'testimonials']).default('carousel'),
      columns: z.enum(['2', '3', '4']).default('3'),
      backgroundColor: z.string().default('#ffffff'),
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark', 'gradient-cream']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      cardStyle: z.enum(['simple', 'bordered', 'elevated']).default('elevated'),
      accentColor: z.string().default('#ffde59'),
      autoplaySpeed: z.number().default(4000),
    }),
    defaultProps: {
      headerPart1: 'Our',
      headerPart2: 'College Alumni',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      headerPart2Italic: true,
      subtitle: 'Meet our successful graduates making a difference worldwide',
      alumni: [],
      layout: 'carousel',
      columns: '3',
      backgroundColor: '#ffffff',
      backgroundStyle: 'solid',
      textColor: 'dark',
      cardStyle: 'elevated',
      accentColor: '#ffde59',
      autoplaySpeed: 4000,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['alumni', 'graduates', 'success', 'testimonials', 'careers'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'alumni',
        type: 'array',
        label: 'Alumni',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Name', required: true },
            image: { type: 'string', label: 'Profile Photo URL' },
            batch: { type: 'string', label: 'Graduation Year' },
            department: { type: 'string', label: 'Department' },
            currentRole: { type: 'string', label: 'Current Role' },
            company: { type: 'string', label: 'Company' },
            location: { type: 'string', label: 'Location' },
            testimonial: { type: 'string', label: 'Testimonial' },
            link: { type: 'string', label: 'Profile Link' },
          },
          required: ['name'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['carousel', 'grid', 'testimonials'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['2', '3', '4'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark', 'gradient-cream'] },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['simple', 'bordered', 'elevated'] },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
      { name: 'showViewAllButton', type: 'boolean', label: 'Show View All Button' },
    ],
  },

  LifeAtJKKN: {
    name: 'LifeAtJKKN',
    displayName: 'Life @ JKKN',
    category: 'content',
    description: 'Showcase campus life with sports, culture, clubs, and student activities',
    icon: 'Heart',
    previewImage: '/cms-previews/LifeAtJKKN.png',
    component: LifeAtJKKN,
    propsSchema: z.object({
      headerPart1: z.string().default('Life @'),
      headerPart2: z.string().default('JKKN'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      headerPart2Italic: z.boolean().default(true),
      subtitle: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        image: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        video: z.string().optional(),
        link: z.string().optional(),
        icon: z.string().optional(),
      })).default([]),
      layout: z.enum(['masonry', 'carousel', 'grid']).default('masonry'),
      columns: z.enum(['2', '3', '4']).default('3'),
      backgroundColor: z.string().default('#f8fafc'),
      backgroundStyle: z.enum(['solid', 'gradient-green', 'gradient-dark', 'gradient-cream']).default('solid'),
      textColor: z.enum(['dark', 'light']).default('dark'),
      accentColor: z.string().default('#ffde59'),
      autoplaySpeed: z.number().default(3500),
    }),
    defaultProps: {
      headerPart1: 'Life @',
      headerPart2: 'JKKN',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      headerPart2Italic: true,
      subtitle: 'Experience vibrant campus life with diverse activities and opportunities',
      items: [],
      layout: 'masonry',
      columns: '3',
      backgroundColor: '#f8fafc',
      backgroundStyle: 'solid',
      textColor: 'dark',
      accentColor: '#ffde59',
      autoplaySpeed: 3500,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['campus', 'life', 'sports', 'culture', 'clubs', 'activities', 'students'],
    editableProps: [
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerFontFamily', type: 'enum', label: 'Header Font', options: ['Default (Serif)', 'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 'Georgia'], description: 'Select font family' },
      { name: 'headerFontSize', type: 'enum', label: 'Header Size', options: ['3xl', '4xl', '5xl', '6xl'] },
      { name: 'headerFontWeight', type: 'enum', label: 'Header Weight', options: ['normal', 'medium', 'semibold', 'bold', 'extrabold'] },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'headerPart2Italic', type: 'boolean', label: 'Italic Header Part 2' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      {
        name: 'items',
        type: 'array',
        label: 'Life Items',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Title', required: true },
            image: { type: 'string', label: 'Image URL' },
            category: { type: 'string', label: 'Category' },
            description: { type: 'string', label: 'Description' },
            video: { type: 'string', label: 'Video URL' },
            link: { type: 'string', label: 'Link URL' },
            icon: { type: 'string', label: 'Icon (Heart, Trophy, Music, etc.)' },
          },
          required: ['title'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['masonry', 'carousel', 'grid'] },
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '3', '4'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'backgroundStyle', type: 'enum', label: 'Background Style', options: ['solid', 'gradient-green', 'gradient-dark', 'gradient-cream'] },
      { name: 'textColor', type: 'enum', label: 'Text Color', options: ['dark', 'light'] },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'autoplaySpeed', type: 'number', label: 'Autoplay Speed (ms)' },
      { name: 'showViewAllButton', type: 'boolean', label: 'Show View All Button' },
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
      founderImage: z.string().default('/images/founder.webp'),
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
      founderImage: '/images/founder.webp',
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

  OurManagement: {
    name: 'OurManagement',
    displayName: 'Our Management',
    category: 'content',
    description: 'Modern management team page with elegant profile cards, decorative frames, and message sections',
    icon: 'Users',
    previewImage: '/cms-previews/OurManagement.png',
    component: OurManagement,
    propsSchema: z.object({
      pageTitle: z.string().default('OUR MANAGEMENT'),
      pageSubtitle: z.string().optional(),
      members: z.array(z.object({
        name: z.string(),
        title: z.string(),
        image: z.string(),
        imageAlt: z.string().optional(),
        message: z.string(),
        order: z.number().optional(),
      })).default([]),
      layout: z.enum(['grid', 'alternating', 'cards']).default('cards'),
      columnsDesktop: z.enum(['1', '2', '3']).default('2'),
      backgroundColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
      textColor: z.string().default('#ffffff'),
      cardStyle: z.enum(['elegant', 'modern', 'minimal']).default('elegant'),
      showFrameDecoration: z.boolean().default(true),
    }),
    defaultProps: {
      pageTitle: 'OUR MANAGEMENT',
      pageSubtitle: '',
      members: [
        {
          name: 'SMT. N. SENDAMARAAI',
          title: 'CHAIRPERSON - JKKN EDUCATIONAL INSTITUTIONS',
          image: '/images/chairperson.png',
          imageAlt: 'Smt. N. Sendamaraai - Chairperson',
          message: 'As the Chairperson of JKKN Educational Institutions, I am honoured to shoulder this immense responsibility, and I take great pride in our exceptional progress. We have earned the status of one of the most prestigious colleges in the region. "Leadership and Excellence" is not merely our motto but the foundation of our values, a testament to our state-of-the-art infrastructure, distinguished faculty, and unwavering commitment to quality education.',
          order: 1,
        },
        {
          name: 'SHRI. S. OMMSHARRAVANA',
          title: 'DIRECTOR - JKKN EDUCATIONAL INSTITUTIONS',
          image: '/images/director.png',
          imageAlt: 'Shri. S. Ommsharravana - Director',
          message: 'I extend my heartfelt congratulations to the college for its fervent and focused dedication to shaping future engineers of distinction. At JKKN, we are committed to innovative education methodologies that enable quality learning, foster independent thinking, and facilitate the development of well-rounded personalities. Our mission empowers students to contribute their best to society and the nation.',
          order: 2,
        },
      ],
      layout: 'cards',
      columnsDesktop: '2',
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff',
      cardStyle: 'elegant',
      showFrameDecoration: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['management', 'team', 'leadership', 'about', 'chairperson', 'director', 'staff'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title' },
      { name: 'pageSubtitle', type: 'string', label: 'Page Subtitle' },
      {
        name: 'members',
        type: 'array',
        label: 'Team Members',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Name', required: true },
            title: { type: 'string', label: 'Position/Title', required: true },
            image: { type: 'image', label: 'Profile Image', required: true },
            imageAlt: { type: 'string', label: 'Image Alt Text' },
            message: { type: 'string', label: 'Message/Quote', required: true },
            order: { type: 'number', label: 'Display Order' },
          },
          required: ['name', 'title', 'image', 'message'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['grid', 'alternating', 'cards'] },
      { name: 'columnsDesktop', type: 'enum', label: 'Columns (Desktop)', options: ['1', '2', '3'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['elegant', 'modern', 'minimal'] },
      { name: 'showFrameDecoration', type: 'boolean', label: 'Show Decorative Frame' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  OurInstitutions: {
    name: 'OurInstitutions',
    displayName: 'Our Institutions',
    category: 'content',
    description: 'Modern institutions page with title, large image, description paragraphs, and Why JKKN section on a gradient background',
    icon: 'Building2',
    previewImage: '/cms-previews/OurInstitutions.png',
    component: OurInstitutions,
    propsSchema: z.object({
      pageTitle: z.string().default('OUR INSTITUTIONS'),
      mainImage: z.string().default('/images/campus.png'),
      mainImageAlt: z.string().default('JKKN Group of Institutions Campus'),
      paragraphs: z.array(z.string()).default([]),
      whyJkknTitle: z.string().default('Why JKKN?'),
      whyJkknContent: z.string().default(''),
      backgroundColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
      textColor: z.string().default('#ffffff'),
    }),
    defaultProps: {
      pageTitle: 'OUR INSTITUTIONS',
      mainImage: '/images/campus.png',
      mainImageAlt: 'JKKN Group of Institutions Campus',
      paragraphs: [
        'At JKKN Institutions, our core teaching objective is to empower students with technical knowledge and essential skills to meet the growing challenges of today\'s competitive world. We implement cutting-edge teaching practices, laying a robust foundation for holistic education.',
        'Our state-of-the-art campus features meticulously designed academic blocks, advanced laboratory facilities, operation centers, knowledge-rich libraries, and comprehensive sports infrastructure. We also provide separate accommodations for boys and girls, as well as general and dental hospitals for healthcare services and practices. Our proactive Placement Cell assures successful placement opportunities for all our students.',
        'With contemporary facilities designed for the continuous enhancement of both students and faculty, we maintain tie-ups with leading manufacturing and commercial enterprises. These connections facilitate valuable industrial and corporate exposure, aligning our educational experiences with real-world applications.',
        'Situated at Komarapalayam, just 15 km from Erode City in Tamil Nadu, India, we are easily accessible via Erode railway station and Salem/Coimbatore airports.',
        'JKKN Institutions are home to some of the region\'s leading institutes of higher learning. We foster a culture that emphasises commitment, transparency, and teamwork. Our continuing success is marked by our reputation as a knowledge center, generating and nurturing exceptional levels of opportunity and initiative.',
      ],
      whyJkknTitle: 'Why JKKN?',
      whyJkknContent: 'At JKKN, we stand at the forefront of educational transformation as an "AI Empowered Institution." We believe in a future where artificial intelligence is not merely a subject to be studied, but a dynamic tool that enhances every facet of our students\' educational journey. We are unique in our approach to integrating AI across disciplines, preparing students to excel in a digitized world. Our commitment to AI extends into every corner of JKKN, where AI empowers events, vital day celebrations, and projects, fostering an environment where technology celebrates tradition and enriches learning. As a JKKN student, you are not just receiving an education; you are being equipped with a toolkit for the future. We nurture thinkers, innovators, and leaders who are ready to take on the challenges of tomorrow. Choosing JKKN means choosing a path where education meets aspiration, and where you can confidently step into a world where AI empowers every ambition.',
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['institutions', 'colleges', 'schools', 'education', 'campus', 'about', 'why jkkn'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title' },
      { name: 'mainImage', type: 'image', label: 'Main Image' },
      { name: 'mainImageAlt', type: 'string', label: 'Image Alt Text' },
      {
        name: 'paragraphs',
        type: 'array',
        label: 'Description Paragraphs',
        itemType: 'string',
      },
      { name: 'whyJkknTitle', type: 'string', label: 'Why JKKN Title' },
      { name: 'whyJkknContent', type: 'string', label: 'Why JKKN Content', multiline: true },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  CoursePage: {
    name: 'CoursePage',
    displayName: 'Course Page',
    category: 'content',
    description: 'Course detail page with college title, description, and course categories (Undergraduate/Postgraduate) on gradient background',
    icon: 'GraduationCap',
    previewImage: '/cms-previews/CoursePage.png',
    component: CoursePage,
    propsSchema: z.object({
      collegeTitle: z.string().default('JKKN College'),
      description: z.string().default(''),
      categories: z.array(z.object({
        title: z.string(),
        courses: z.array(z.object({
          name: z.string(),
          duration: z.string(),
          specializations: z.array(z.string()).optional(),
        })),
      })).default([]),
      backgroundColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
      textColor: z.string().default('#ffffff'),
    }),
    defaultProps: {
      collegeTitle: 'JKKN Dental College and Hospital',
      description: 'At JKKN Dental College & Hospital, we are dedicated to providing our students with the highest quality education in dental surgery. Established in 1987 and located in Tamil Nadu, our college is affiliated with Dr. MGR Medical University and approved by the Government of Tamil Nadu. We offer undergraduate and postgraduate courses in dental surgery that prepare our students for successful careers in the field.',
      categories: [
        {
          title: 'Undergraduate',
          courses: [
            {
              name: 'Bachelor of Dental Surgery (BDS)',
              duration: '4 years + 1 year Internship',
              specializations: [],
            },
          ],
        },
        {
          title: 'Postgraduate',
          courses: [
            {
              name: 'Master of Dental Surgery (MDS)',
              duration: '3 years',
              specializations: [
                'Prosthodontics Crown and Bridge',
                'Conservative Dentistry and Endodontics',
                'Periodontics',
                'Orthodontics and Dentofacial Orthopedics',
              ],
            },
          ],
        },
      ],
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['course', 'courses', 'program', 'degree', 'undergraduate', 'postgraduate', 'college', 'education'],
    editableProps: [
      { name: 'collegeTitle', type: 'string', label: 'College/Department Title' },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      {
        name: 'categories',
        type: 'array',
        label: 'Course Categories',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Category Title', required: true },
            courses: {
              type: 'array',
              label: 'Courses',
              itemType: 'object',
              itemSchema: {
                properties: {
                  name: { type: 'string', label: 'Course Name', required: true },
                  duration: { type: 'string', label: 'Duration', required: true },
                  specializations: { type: 'array', label: 'Specializations', itemType: 'string' },
                },
                required: ['name', 'duration'],
              },
            },
          },
          required: ['title'],
        },
      },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  FacilityPage: {
    name: 'FacilityPage',
    displayName: 'Facility Page',
    category: 'content',
    description: 'Full-page facility display with images, features, and descriptions - ideal for Transport, Library, Hostel pages',
    icon: 'Building2',
    previewImage: '/cms-previews/FacilityPage.png',
    component: FacilityPage,
    propsSchema: z.object({
      facilityTitle: z.string(),
      images: z.array(z.object({
        src: z.string(),
        alt: z.string().optional()
      })),
      introduction: z.string(),
      features: z.array(z.object({
        title: z.string(),
        description: z.string()
      })),
      conclusion: z.string().optional(),
      backgroundColor: z.string(),
      accentColor: z.string(),
      textColor: z.string()
    }),
    defaultProps: {
      facilityTitle: 'TRANSPORT',
      images: [
        { src: '/images/facilities/transport-1.jpg', alt: 'Transport facility' },
        { src: '/images/facilities/transport-2.jpg', alt: 'College buses' },
        { src: '/images/facilities/transport-3.jpg', alt: 'Bus fleet' }
      ],
      introduction: 'Transportation is an essential aspect of any educational institution. It provides students and faculty members with a convenient way to reach the campus and enhances the overall educational experience.',
      features: [
        { title: 'Well-Maintained Buses', description: 'The transport facility is equipped with a well-maintained fleet of buses that are regularly serviced and cleaned.' },
        { title: 'Trained Drivers', description: 'The drivers are highly trained and experienced with good understanding of local routes and traffic conditions.' }
      ],
      conclusion: 'The transport facility is well-equipped to provide safe, reliable, and affordable transportation to all students and faculty members.',
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff'
    },
    supportsChildren: false,
    keywords: ['facility', 'transport', 'library', 'hostel', 'infrastructure', 'amenities'],
    editableProps: [
      { name: 'facilityTitle', type: 'string', label: 'Facility Title', required: true },
      {
        name: 'images',
        type: 'array',
        label: 'Gallery Images',
        itemType: 'object',
        itemSchema: {
          properties: {
            src: { type: 'string', label: 'Image URL', required: true, format: 'image' },
            alt: { type: 'string', label: 'Alt Text' }
          },
          required: ['src'],
        },
      },
      { name: 'introduction', type: 'string', multiline: true, label: 'Introduction Paragraph', required: true },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Feature Title', required: true },
            description: { type: 'string', label: 'Feature Description', required: true }
          },
          required: ['title', 'description'],
        },
      },
      { name: 'conclusion', type: 'string', multiline: true, label: 'Conclusion Paragraph' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  HostelPage: {
    name: 'HostelPage',
    displayName: 'Hostel Page',
    category: 'content',
    description: 'Hostel facility page with Boys/Girls tabs - switchable content sections',
    icon: 'Home',
    previewImage: '/cms-previews/HostelPage.png',
    component: HostelPage,
    propsSchema: z.object({
      pageTitle: z.string(),
      boysHostel: z.object({
        title: z.string(),
        images: z.array(z.object({ src: z.string(), alt: z.string().optional() })),
        paragraphs: z.array(z.string()),
        highlights: z.array(z.string())
      }),
      girlsHostel: z.object({
        title: z.string(),
        images: z.array(z.object({ src: z.string(), alt: z.string().optional() })),
        paragraphs: z.array(z.string()),
        highlights: z.array(z.string())
      }),
      defaultTab: z.enum(['boys', 'girls']),
      backgroundColor: z.string(),
      accentColor: z.string(),
      textColor: z.string()
    }),
    defaultProps: {
      pageTitle: 'Hostel',
      boysHostel: {
        title: 'Boys Hostel',
        images: [],
        paragraphs: ['Our hostel is located within the campus premises, making it an ideal choice for students.'],
        highlights: ['Community living experience', 'Dedicated staff support']
      },
      girlsHostel: {
        title: 'Girls Hostel',
        images: [],
        paragraphs: ['Our girls hostel is equipped with all modern facilities.'],
        highlights: ['Safe and secure environment', 'Modern amenities']
      },
      defaultTab: 'boys',
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff'
    },
    supportsChildren: false,
    keywords: ['hostel', 'accommodation', 'boys', 'girls', 'dormitory', 'residence'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title', required: true },
      { name: 'defaultTab', type: 'enum', label: 'Default Tab', options: ['boys', 'girls'] },
      {
        name: 'boysHostel',
        type: 'object',
        label: 'Boys Hostel',
        properties: [
          { name: 'title', type: 'string', label: 'Section Title' },
          {
            name: 'images',
            type: 'array',
            label: 'Images',
            itemType: 'object',
            itemSchema: {
              properties: {
                src: { type: 'string', label: 'Image URL', required: true, format: 'image' },
                alt: { type: 'string', label: 'Alt Text' }
              },
              required: ['src'],
            },
          },
          {
            name: 'paragraphs',
            type: 'array',
            label: 'Paragraphs',
            itemType: 'string',
          },
          {
            name: 'highlights',
            type: 'array',
            label: 'Highlights',
            itemType: 'string',
          },
        ],
      },
      {
        name: 'girlsHostel',
        type: 'object',
        label: 'Girls Hostel',
        properties: [
          { name: 'title', type: 'string', label: 'Section Title' },
          {
            name: 'images',
            type: 'array',
            label: 'Images',
            itemType: 'object',
            itemSchema: {
              properties: {
                src: { type: 'string', label: 'Image URL', required: true, format: 'image' },
                alt: { type: 'string', label: 'Alt Text' }
              },
              required: ['src'],
            },
          },
          {
            name: 'paragraphs',
            type: 'array',
            label: 'Paragraphs',
            itemType: 'string',
          },
          {
            name: 'highlights',
            type: 'array',
            label: 'Highlights',
            itemType: 'string',
          },
        ],
      },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  AdmissionInquiryForm: {
    name: 'AdmissionInquiryForm',
    displayName: 'Admission Inquiry Form',
    category: 'content',
    description: 'Interactive admission inquiry form with glassmorphism styling, dynamic course selection, and success confirmation',
    icon: 'GraduationCap',
    previewImage: '/cms-previews/AdmissionInquiryForm.png',
    component: AdmissionInquiryForm,
    propsSchema: z.object({
      sectionTitle: z.string().default('Start Your Journey with JKKN'),
      sectionSubtitle: z.string().default('Get personalized guidance from our admission counsellors'),
      showHeader: z.boolean().default(true),
      badge: z.string().default('Admissions Open'),
      formLabels: z.object({
        fullName: z.string().optional(),
        mobileNumber: z.string().optional(),
        email: z.string().optional(),
        college: z.string().optional(),
        course: z.string().optional(),
        qualification: z.string().optional(),
        districtCity: z.string().optional(),
        contactTime: z.string().optional(),
        consent: z.string().optional(),
      }).optional(),
      collegeOptions: z.array(z.object({
        id: z.string(),
        name: z.string(),
        courses: z.array(z.string()),
      })).default([]),
      qualificationOptions: z.array(z.string()).default([]),
      contactTimeOptions: z.array(z.string()).default([]),
      successMessage: z.object({
        title: z.string().optional(),
        subtitle: z.string().optional(),
        callbackMessage: z.string().optional(),
        referencePrefix: z.string().optional(),
        emailConfirmation: z.string().optional(),
      }).optional(),
      whatsappNumber: z.string().default('+919345855001'),
      whatsappMessage: z.string().default('Hi, I just submitted an admission inquiry. My reference number is: '),
      successLinks: z.array(z.object({
        label: z.string(),
        url: z.string(),
        icon: z.string().optional(),
      })).default([]),
      variant: z.enum(['glass', 'solid']).default('glass'),
      theme: z.enum(['light', 'dark']).default('dark'),
      backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'solid-white', 'transparent']).default('gradient-dark'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showAnimations: z.boolean().default(true),
      layout: z.enum(['single-column', 'two-column']).default('two-column'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      sectionTitle: 'Start Your Journey with JKKN',
      sectionSubtitle: 'Get personalized guidance from our admission counsellors',
      showHeader: true,
      badge: 'Admissions Open',
      formLabels: {
        fullName: 'Full Name',
        mobileNumber: 'Mobile Number',
        email: 'Email Address',
        college: 'Select College',
        course: 'Course Interested',
        qualification: 'Current Qualification',
        districtCity: 'District / City',
        contactTime: 'Preferred Contact Time',
        consent: 'I agree to receive communications from JKKN regarding admissions',
      },
      collegeOptions: [
        { id: 'dental', name: 'JKKN Dental College & Hospital', courses: ['BDS', 'MDS - Orthodontics', 'MDS - Prosthodontics', 'MDS - Periodontics', 'MDS - Oral Surgery'] },
        { id: 'pharmacy', name: 'JKKN College of Pharmacy', courses: ['B.Pharm', 'M.Pharm', 'Pharm.D', 'D.Pharm'] },
        { id: 'engineering', name: 'JKKN College of Engineering & Technology', courses: ['B.E. CSE', 'B.E. ECE', 'B.E. EEE', 'B.E. Mechanical', 'M.E.', 'MBA'] },
        { id: 'arts', name: 'JKKN College of Arts & Science', courses: ['B.Sc', 'M.Sc', 'BBA', 'BCA', 'B.Com', 'BA'] },
        { id: 'nursing', name: 'Sresakthimayeil Institute Of Nursing And Research', courses: ['B.Sc Nursing', 'M.Sc Nursing', 'GNM', 'ANM'] },
        { id: 'allied', name: 'JKKN College of Allied Health Sciences', courses: ['BPT', 'BMLT', 'B.Sc Radiology', 'B.Sc Cardiac Technology'] },
        { id: 'education', name: 'JKKN College of Education', courses: ['B.Ed', 'M.Ed', 'D.El.Ed'] },
        { id: 'school', name: 'JKKN Matriculation Higher Secondary School', courses: ['Pre-KG to 12th Standard'] },
      ],
      qualificationOptions: [
        '10th / SSLC',
        '12th / HSC',
        'Diploma',
        "Undergraduate (Bachelor's)",
        "Postgraduate (Master's)",
        'Other',
      ],
      contactTimeOptions: [
        'Morning (9 AM - 12 PM)',
        'Afternoon (12 PM - 3 PM)',
        'Evening (3 PM - 6 PM)',
        'Any Time',
      ],
      successMessage: {
        title: 'Thank You for Your Interest!',
        subtitle: 'Your inquiry has been submitted successfully.',
        callbackMessage: 'Our admissions team will contact you within 24 hours.',
        referencePrefix: 'Your Reference Number:',
        emailConfirmation: 'A confirmation email has been sent to your email address.',
      },
      whatsappNumber: '+919345855001',
      whatsappMessage: 'Hi, I just submitted an admission inquiry. My reference number is: ',
      successLinks: [
        { label: 'Download Prospectus', url: '/downloads/prospectus.pdf', icon: 'Download' },
        { label: 'Virtual Campus Tour', url: '/virtual-tour', icon: 'Video' },
        { label: 'Scholarship Information', url: '/scholarships', icon: 'Award' },
      ],
      variant: 'glass',
      theme: 'dark',
      backgroundColor: 'gradient-dark',
      cardStyle: 'glass',
      showAnimations: true,
      layout: 'two-column',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['admission', 'inquiry', 'form', 'apply', 'enroll', 'contact', 'application', 'college'],
    editableProps: [
      // Section Header
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'sectionTitle', type: 'string', label: 'Section Title', required: true },
      { name: 'sectionSubtitle', type: 'string', label: 'Subtitle', multiline: true },
      // Form Labels
      { name: 'formLabels.fullName', type: 'string', label: 'Full Name Label' },
      { name: 'formLabels.mobileNumber', type: 'string', label: 'Mobile Number Label' },
      { name: 'formLabels.email', type: 'string', label: 'Email Label' },
      { name: 'formLabels.college', type: 'string', label: 'College Label' },
      { name: 'formLabels.course', type: 'string', label: 'Course Label' },
      { name: 'formLabels.qualification', type: 'string', label: 'Qualification Label' },
      { name: 'formLabels.districtCity', type: 'string', label: 'District/City Label' },
      { name: 'formLabels.contactTime', type: 'string', label: 'Contact Time Label' },
      { name: 'formLabels.consent', type: 'string', label: 'Consent Text', multiline: true },
      // College Options
      {
        name: 'collegeOptions',
        type: 'array',
        label: 'College Options',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'ID', required: true },
            name: { type: 'string', label: 'College Name', required: true },
            courses: { type: 'array', label: 'Courses', itemType: 'string' },
          },
          required: ['id', 'name'],
        },
      },
      // Qualification Options
      { name: 'qualificationOptions', type: 'array', label: 'Qualification Options', itemType: 'string' },
      // Contact Time Options
      { name: 'contactTimeOptions', type: 'array', label: 'Contact Time Options', itemType: 'string' },
      // Success Message
      { name: 'successMessage.title', type: 'string', label: 'Success Title' },
      { name: 'successMessage.subtitle', type: 'string', label: 'Success Subtitle' },
      { name: 'successMessage.callbackMessage', type: 'string', label: 'Callback Message' },
      { name: 'successMessage.referencePrefix', type: 'string', label: 'Reference Prefix' },
      { name: 'successMessage.emailConfirmation', type: 'string', label: 'Email Confirmation' },
      // WhatsApp
      { name: 'whatsappNumber', type: 'string', label: 'WhatsApp Number' },
      { name: 'whatsappMessage', type: 'string', label: 'WhatsApp Pre-fill Message', multiline: true },
      // Success Links
      {
        name: 'successLinks',
        type: 'array',
        label: 'Success Action Links',
        itemType: 'object',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Label', required: true },
            url: { type: 'string', label: 'URL', required: true },
            icon: { type: 'string', label: 'Icon Name' },
          },
          required: ['label', 'url'],
        },
      },
      // Styling
      { name: 'variant', type: 'enum', label: 'Form Style', options: ['glass', 'solid'] },
      { name: 'theme', type: 'enum', label: 'Theme', options: ['light', 'dark'] },
      { name: 'backgroundColor', type: 'enum', label: 'Background', options: ['gradient-dark', 'gradient-light', 'solid-white', 'transparent'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['single-column', 'two-column'] },
      { name: 'sectionTitleColor', type: 'color', label: 'Title Color' },
      { name: 'sectionSubtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations' },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
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
      thumbnailAlt: z.string().default(''),
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
      thumbnailAlt: '',
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
      { name: 'thumbnailAlt', type: 'string', label: 'Thumbnail Alt Text', required: true },
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
      posterAlt: '',
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
      { name: 'posterAlt', type: 'string', label: 'Poster Image Alt Text', required: true },
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
      beforeImageAlt: '',
      afterImage: '',
      afterImageAlt: '',
      beforeLabel: 'Before',
      afterLabel: 'After',
      startPosition: 50,
    },
    supportsChildren: false,
    keywords: ['before', 'after', 'compare', 'slider'],
    editableProps: [
      { name: 'beforeImage', type: 'image', label: 'Before Image', required: true },
      { name: 'beforeImageAlt', type: 'string', label: 'Before Image Alt Text', required: true },
      { name: 'afterImage', type: 'image', label: 'After Image', required: true },
      { name: 'afterImageAlt', type: 'string', label: 'After Image Alt Text', required: true },
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
      backgroundImageAlt: '',
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
      { name: 'backgroundImageAlt', type: 'string', label: 'Background Image Alt Text', required: true },
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
      imageAlt: z.string().default(''),
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
      imageAlt: '',
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
      { name: 'imageAlt', type: 'string', label: 'Image Alt Text', required: true },
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
  return ['content', 'media', 'layout', 'data', 'shadcn', 'admissions']
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
    admissions: 'Admissions',
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
