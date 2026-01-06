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

// Lazy load layout components
const Section = lazy(() => import('@/components/cms-blocks/layout/section').then(m => ({ default: m.AdvancedSection })))



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

// Leadership Profile (Principal, VP, HOD, etc.)
const LeadershipProfile = lazy(() => import('@/components/cms-blocks/content/leadership-profile'))

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

// Terms and Conditions Page
const TermsAndConditionsPage = lazy(() => import('@/components/cms-blocks/content/terms-and-conditions-page'))

// Contact Page
const ContactPage = lazy(() => import('@/components/cms-blocks/content/contact-page'))

// Hostel Page
const HostelPage = lazy(() => import('@/components/cms-blocks/content/hostel-page'))

// Admission Inquiry Form
const AdmissionInquiryForm = lazy(() => import('@/components/cms-blocks/content/admission-inquiry-form'))

// Our Courses Section
const OurCoursesSection = lazy(() => import('@/components/cms-blocks/content/our-courses-section'))

// Admission Zone Section
const AdmissionZoneSection = lazy(() => import('@/components/cms-blocks/content/admission-zone-section'))

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

// ==========================================
// Component Registry (Clean Slate)
// ==========================================

// ==========================================
// Props Schemas
// ==========================================

const SectionPropsSchema = z.object({
  id: z.string().optional(),
  backgroundType: z.enum(['color', 'image', 'video', 'gradient']).default('color'),
  backgroundColor: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundGradient: z.string().optional(),
  paddingTop: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('md'),
  paddingBottom: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('md'),
  minHeight: z.enum(['auto', 'screen', 'half', 'large']).default('auto'),
})



export const COMPONENT_REGISTRY: ComponentRegistry = {
  // ==========================================
  // Layout Blocks
  // ==========================================
  Section: {
    name: 'Section',
    displayName: 'Section',
    category: 'layout',
    description: 'A responsive section wrapper with background and spacing controls',
    icon: 'Layout', // Ensure 'Layout' icon is available or use 'Square'
    previewImage: '/cms-previews/Section.png',
    component: Section,
    propsSchema: SectionPropsSchema,
    defaultProps: {
      backgroundType: 'color',
      backgroundColor: 'bg-background',
      paddingTop: 'md',
      paddingBottom: 'md',
      minHeight: 'auto',
    },
    supportsChildren: true,
    isFullWidth: true,
    keywords: ['section', 'wrapper', 'background', 'layout'],
    editableProps: [
      { name: 'id', type: 'string', label: 'Section ID' },
      { name: 'backgroundType', type: 'enum', label: 'Background Type', options: ['color', 'image', 'video', 'gradient'] },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
      { name: 'backgroundGradient', type: 'string', label: 'Gradient CSS' },
      { name: 'paddingTop', type: 'enum', label: 'Top Padding', options: ['none', 'sm', 'md', 'lg', 'xl'] },
      { name: 'paddingBottom', type: 'enum', label: 'Bottom Padding', options: ['none', 'sm', 'md', 'lg', 'xl'] },
      { name: 'minHeight', type: 'enum', label: 'Min Height', options: ['auto', 'screen', 'half', 'large'] },
    ],
  },

  Container: {
    name: 'Container',
    displayName: 'Container',
    category: 'layout',
    description: 'Centers content with max-width constraints',
    icon: 'Box',
    previewImage: '/cms-previews/Container.png',
    component: Container,
    propsSchema: ContainerPropsSchema,
    defaultProps: {
      maxWidth: 'xl',
      paddingX: 'md',
    },
    supportsChildren: true,
    isFullWidth: false,
    keywords: ['container', 'wrapper', 'center', 'layout'],
    editableProps: [
      { name: 'maxWidth', type: 'enum', label: 'Max Width', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'fluid'] },
      { name: 'paddingX', type: 'enum', label: 'Horizontal Padding', options: ['none', 'sm', 'md', 'lg'] },
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
