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
  EmbedBlockPropsSchema,
  ImageCarouselPropsSchema,
  BeforeAfterSliderPropsSchema,
  LogoCloudPropsSchema,
  ContainerPropsSchema,
  GridLayoutPropsSchema,
  FlexboxLayoutPropsSchema,
  SplitLayoutPropsSchema,
  SpacerPropsSchema,
  DividerPropsSchema,
  SectionWrapperPropsSchema,
  GridContainerPropsSchema,
  ContentCardPropsSchema,
  // Data block schemas
  StatsCounterPropsSchema,
  EventsListPropsSchema,
  FacultyDirectoryPropsSchema,
  AnnouncementsFeedPropsSchema,
  BlogPostsGridPropsSchema,
  // Modern component schemas
  ModernManagementSectionPropsSchema,
  ModernTrustSectionPropsSchema,
  ModernPrincipalMessagePropsSchema,
  ModernOrganogramSectionPropsSchema,
  ModernHeroSectionPropsSchema,
  ModernBentoGridPropsSchema,
  ModernEducationStoriesPropsSchema,
  ModernStatsBarPropsSchema,
  ModernLogoMarqueePropsSchema,
  ModernVideoHubPropsSchema,
  ModernAboutSectionPropsSchema,
  ModernTransportSectionPropsSchema,
} from './registry-types'

// Import BEEEECoursePage schema from component
import { BEEEECoursePagePropsSchema } from '@/components/cms-blocks/content/be-eee-course-page'

// Import BEECECoursePage schema from component
import { BEECECoursePagePropsSchema } from '@/components/cms-blocks/content/be-ece-course-page'

// Import BEMechanicalCoursePage schema from component
import { BEMechanicalCoursePagePropsSchema } from '@/components/cms-blocks/content/be-mechanical-course-page'

// Import BEITCoursePage schema from component
import { BEITCoursePagePropsSchema } from '@/components/cms-blocks/content/be-it-course-page'

// Import MECSECoursePage schema from component
import { MECSECoursePagePropsSchema } from '@/components/cms-blocks/content/me-cse-course-page'

// Import MBACoursePage schema from component
import { MBACoursePagePropsSchema } from '@/components/cms-blocks/content/mba-course-page'

// Import engineering component schemas
import { EngineeringHeroSectionPropsSchema } from '@/components/cms-blocks/content/engineering-hero-section'
import { EngineeringAccreditationsBarPropsSchema } from '@/components/cms-blocks/content/engineering-accreditations-bar'
import { EngineeringAboutSectionPropsSchema } from '@/components/cms-blocks/content/engineering-about-section'
import { EngineeringWhyChooseSectionPropsSchema } from '@/components/cms-blocks/content/engineering-why-choose-section'
import { EngineeringFacilitiesSectionPropsSchema } from '@/components/cms-blocks/content/engineering-facilities-section'
import { EngineeringCTASectionPropsSchema } from '@/components/cms-blocks/content/engineering-cta-section'

// Import sample data for course pages
import { BE_EEE_SAMPLE_DATA } from './templates/engineering/be-eee-data'
import { BE_ECE_SAMPLE_DATA } from './templates/engineering/be-ece-data'
import { BE_IT_SAMPLE_DATA } from './templates/engineering/be-it-data'
import { beMechanicalCourseData } from './templates/engineering/be-mechanical-data'
import { meCSECourseData } from './templates/engineering/me-cse-data'
import { MBA_SAMPLE_DATA } from './templates/mba-data'

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
const EmbedBlock = lazy(() => import('@/components/cms-blocks/media/embed-block'))
const ImageCarousel = lazy(() => import('@/components/cms-blocks/media/image-carousel'))
const BeforeAfterSlider = lazy(() => import('@/components/cms-blocks/media/before-after-slider'))
const LogoCloud = lazy(() => import('@/components/cms-blocks/media/logo-cloud'))

// Layout blocks
const Container = lazy(() => import('@/components/cms-blocks/layout/container'))
const GridLayout = lazy(() => import('@/components/cms-blocks/layout/grid-layout'))
const FlexboxLayout = lazy(() => import('@/components/cms-blocks/layout/flexbox-layout'))
const SplitLayout = lazy(() => import('@/components/cms-blocks/layout/split-layout'))
const Spacer = lazy(() => import('@/components/cms-blocks/layout/spacer'))
const Divider = lazy(() => import('@/components/cms-blocks/layout/divider'))
const SectionWrapper = lazy(() => import('@/components/cms-blocks/layout/section-wrapper'))
const GridContainer = lazy(() => import('@/components/cms-blocks/layout/grid-container'))
const ContentCard = lazy(() => import('@/components/cms-blocks/layout/content-card'))

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
const ModernManagementSection = lazy(() => import('@/components/cms-blocks/content/modern-management-section'))
const ModernTrustSection = lazy(() => import('@/components/cms-blocks/content/modern-trust-section'))
const ModernPrincipalMessage = lazy(() => import('@/components/cms-blocks/content/modern-principal-message'))
const ModernOrganogramSection = lazy(() => import('@/components/cms-blocks/content/modern-organogram-section'))
const ModernHeroSection = lazy(() => import('@/components/cms-blocks/content/modern-hero-section'))
const ModernBentoGrid = lazy(() => import('@/components/cms-blocks/content/modern-bento-grid'))
const ModernEducationStories = lazy(() => import('@/components/cms-blocks/content/modern-education-stories'))
const ModernStatsBar = lazy(() => import('@/components/cms-blocks/content/modern-stats-bar'))
const ModernLogoMarquee = lazy(() => import('@/components/cms-blocks/content/modern-logo-marquee'))
const ModernVideoHub = lazy(() => import('@/components/cms-blocks/content/modern-video-hub'))
const ModernAboutSection = lazy(() => import('@/components/cms-blocks/content/modern-about-section'))
const ModernTransportSection = lazy(() => import('@/components/cms-blocks/content/modern-transport-section'))

// Leadership Profile (Principal, VP, HOD, etc.)
const LeadershipProfile = lazy(() => import('@/components/cms-blocks/content/leadership-profile'))

// Our Institutions
const OurInstitutions = lazy(() => import('@/components/cms-blocks/content/our-institutions'))

// Course Page
const CoursePage = lazy(() => import('@/components/cms-blocks/content/course-page'))

// BE EEE Course Page
const BEEEECoursePage = lazy(() => import('@/components/cms-blocks/content/be-eee-course-page').then(m => ({ default: m.BEEEECoursePage })))

// BE ECE Course Page
const BEECECoursePage = lazy(() => import('@/components/cms-blocks/content/be-ece-course-page').then(m => ({ default: m.BEECECoursePage })))

// BE Mechanical Course Page
const BEMechanicalCoursePage = lazy(() => import('@/components/cms-blocks/content/be-mechanical-course-page').then(m => ({ default: m.BEMechanicalCoursePage })))

// BE IT Course Page
const BEITCoursePage = lazy(() => import('@/components/cms-blocks/content/be-it-course-page').then(m => ({ default: m.BEITCoursePage })))

// ME CSE Course Page
const MECSECoursePage = lazy(() => import('@/components/cms-blocks/content/me-cse-course-page').then(m => ({ default: m.MECSECoursePage })))

// MBA Course Page
const MBACoursePage = lazy(() => import('@/components/cms-blocks/content/mba-course-page').then(m => ({ default: m.MBACoursePage })))

// Facility Page
const FacilityPage = lazy(() => import('@/components/cms-blocks/content/facility-page'))

// Transport Page
const TransportPage = lazy(() => import('@/components/cms-blocks/content/transport-page'))

// Ambulance Service Page
const AmbulanceServicePage = lazy(() => import('@/components/cms-blocks/content/ambulance-service-page'))

// Food Court Page
const FoodCourtPage = lazy(() => import('@/components/cms-blocks/content/food-court-page'))

// Sports Page
const SportsPage = lazy(() => import('@/components/cms-blocks/content/sports-page'))

// Gallery Page
const GalleryPage = lazy(() => import('@/components/cms-blocks/content/gallery-page'))

// Privacy Policy Page
const PrivacyPolicyPage = lazy(() => import('@/components/cms-blocks/content/privacy-policy-page'))

// Terms and Conditions Page
const TermsAndConditionsPage = lazy(() => import('@/components/cms-blocks/content/terms-and-conditions-page'))

// Institutional Development Plan Page
const InstitutionalDevelopmentPlanPage = lazy(() => import('@/components/cms-blocks/content/institutional-development-plan-page'))

// Institution Policies Page
const InstitutionPoliciesPage = lazy(() => import('@/components/cms-blocks/content/institution-policies-page'))

// Institution Rules Page
const InstitutionRulesPage = lazy(() => import('@/components/cms-blocks/content/institution-rules-page'))

// Contact Page
const ContactPage = lazy(() => import('@/components/cms-blocks/content/contact-page'))

// Hostel Page
const HostelPage = lazy(() => import('@/components/cms-blocks/content/hostel-page'))

// Auditorium Page
const AuditoriumPage = lazy(() => import('@/components/cms-blocks/content/auditorium-page'))

// Seminar Hall Page
const SeminarHallPage = lazy(() => import('@/components/cms-blocks/content/seminar-hall-page'))

// Library Page
const LibraryPage = lazy(() => import('@/components/cms-blocks/content/library-page'))

// Digital Classroom Page
const DigitalClassroomPage = lazy(() => import('@/components/cms-blocks/content/digital-classroom-page'))

// Admission Inquiry Form
const AdmissionInquiryForm = lazy(() => import('@/components/cms-blocks/content/admission-inquiry-form'))

// Our Courses Section
const OurCoursesSection = lazy(() => import('@/components/cms-blocks/content/our-courses-section'))

// Admission Zone Section
const AdmissionZoneSection = lazy(() => import('@/components/cms-blocks/content/admission-zone-section'))

// Contact Info Section (Homepage compact contact)
const ContactInfoSection = lazy(() => import('@/components/cms-blocks/content/contact-info-section'))

// Approvals and Affiliation Section
const ApprovalsAffiliationSection = lazy(() => import('@/components/cms-blocks/content/approvals-affiliation-section'))

// Engineering-specific blocks
const EngineeringCenturySection = lazy(() => import('@/components/cms-blocks/content/engineering-century-section'))
const EngineeringProgramsSection = lazy(() => import('@/components/cms-blocks/content/engineering-programs-section'))
const EngineeringPlacementsSection = lazy(() => import('@/components/cms-blocks/content/engineering-placements-section'))
const EngineeringAdmissionSection = lazy(() => import('@/components/cms-blocks/content/engineering-admission-section'))
const EngineeringHeroSection = lazy(() => import('@/components/cms-blocks/content/engineering-hero-section'))
const EngineeringAccreditationsBar = lazy(() => import('@/components/cms-blocks/content/engineering-accreditations-bar'))
const EngineeringAboutSection = lazy(() => import('@/components/cms-blocks/content/engineering-about-section'))
const EngineeringWhyChooseSection = lazy(() => import('@/components/cms-blocks/content/engineering-why-choose-section'))
const EngineeringFacilitiesSection = lazy(() => import('@/components/cms-blocks/content/engineering-facilities-section'))
const EngineeringCTASection = lazy(() => import('@/components/cms-blocks/content/engineering-cta-section'))

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
  ModernHeroSection: {
    name: 'ModernHeroSection',
    displayName: 'Modern Hero (White)',
    category: 'content',
    description: 'Elite hero section with glassmorphism card and white/cream theme',
    icon: 'Maximize',
    component: ModernHeroSection,
    propsSchema: ModernHeroSectionPropsSchema as any,
    defaultProps: {
      title: 'JKKN COLLEGE OF ENGINEERING & TECHNOLOGY',
      subtitle: 'Innovate. Inspire. Impact.',
      titleColor: '#1A1A1A',
      subtitleColor: '#52525B',
      overlayOpacity: 0.2,
      minHeight: '100vh',
    },
    supportsChildren: false,
    isFullWidth: true,
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'logoImage', type: 'image', label: 'Logo Image' },
      { name: 'backgroundImage', type: 'image', label: 'Background Image' },
      { name: 'backgroundVideo', type: 'video', label: 'Background Video' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'overlayOpacity', type: 'number', label: 'Overlay Opacity', min: 0, max: 1, step: 0.1 },
    ],
  },

  ModernAboutSection: {
    name: 'ModernAboutSection',
    displayName: 'Modern About (Heritage)',
    category: 'content',
    description: 'Magazine-style split layout for campus heritage and mission',
    icon: 'Info',
    component: ModernAboutSection,
    propsSchema: ModernAboutSectionPropsSchema as any,
    defaultProps: {
      title: 'Founded on a legacy of excellence and innovation',
      experienceYear: '39+',
      subtitle: 'Elevating Minds, Empowering Futures',
    },
    supportsChildren: false,
    editableProps: [
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'experienceYear', type: 'string', label: 'Experience Years' },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      { name: 'image', type: 'image', label: 'About Image' },
    ],
  },

  ModernBentoGrid: {
    name: 'ModernBentoGrid',
    displayName: 'Modern Bento (News)',
    category: 'content',
    description: 'Advanced grid layout for combined News and Blogs',
    icon: 'LayoutGrid',
    component: ModernBentoGrid,
    propsSchema: ModernBentoGridPropsSchema as any,
    defaultProps: {
      title: 'Campus Buzz & Insights',
      subtitle: 'Stay updated with the latest happenings at JKKN',
    },
    supportsChildren: false,
    editableProps: [
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
    ],
  },

  ModernEducationStories: {
    name: 'ModernEducationStories',
    displayName: 'Modern Stories (Tiles)',
    category: 'content',
    description: 'High-fidelity story tiles with liquid hover animations',
    icon: 'Play',
    component: ModernEducationStories,
    propsSchema: ModernEducationStoriesPropsSchema as any,
    defaultProps: {
      title: 'Education Stories',
      subtitle: 'Real-World Impact Through Learning',
    },
    supportsChildren: false,
    editableProps: [
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
    ],
  },

  ModernStatsBar: {
    name: 'ModernStatsBar',
    displayName: 'Modern Stats (Bar)',
    category: 'data',
    description: 'Minimalist floating stats with animated counters',
    icon: 'TrendingUp',
    component: ModernStatsBar,
    propsSchema: ModernStatsBarPropsSchema as any,
    defaultProps: {
      stats: [],
    },
    supportsChildren: false,
    editableProps: [],
  },

  ModernVideoHub: {
    name: 'ModernVideoHub',
    displayName: 'Modern Video Hub',
    category: 'media',
    description: 'Cinema-style video player with playlist sidebar',
    icon: 'Video',
    component: ModernVideoHub,
    propsSchema: ModernVideoHubPropsSchema as any,
    defaultProps: {
      title: 'Video Hub: Experience JKKN',
    },
    supportsChildren: false,
    editableProps: [
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
    ],
  },

  ModernLogoMarquee: {
    name: 'ModernLogoMarquee',
    displayName: 'Modern Logo Marquee',
    category: 'media',
    description: 'Infinite scrolling partner logos with grayscale hover',
    icon: 'Repeat',
    component: ModernLogoMarquee,
    propsSchema: ModernLogoMarqueePropsSchema as any,
    defaultProps: {
      title: 'Our Global Placement Partners & Recruiters',
    },
    supportsChildren: false,
    editableProps: [
      { name: 'title', type: 'string', label: 'Title' },
    ],
  },

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
      titleLineHeight: 1.2,
      titleLetterSpacing: 0,
      titleTextAlign: 'center',
      titleManualBreakPosition: undefined,
      subtitleColor: '#fbfbee', // Brand cream for better visibility
      subtitleFontSize: 24,
      subtitleFontWeight: 'normal',
      subtitleFontStyle: 'normal',
      subtitleLineHeight: 1.5,
      subtitleLetterSpacing: 0,
      subtitleTextAlign: 'center',
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
      // Title Typography Controls
      { name: 'titleLineHeight', type: 'number', label: 'Title Line Height', min: 0.5, max: 3, step: 0.1, description: 'Spacing between lines (1.2 = tight, 1.5 = relaxed)' },
      { name: 'titleLetterSpacing', type: 'number', label: 'Title Letter Spacing', unit: 'px', min: -5, max: 20, step: 0.5, description: 'Character spacing (-2px for tight, +2px for loose)' },
      { name: 'titleTextAlign', type: 'enum', label: 'Title Alignment', options: ['left', 'center', 'right', 'justify'] },
      { name: 'titleManualBreakPosition', type: 'number', label: 'Line Break After Word', min: 0, step: 1, description: 'Split title after this word (0=first word, 1=second word, empty=no break)' },
      // Subtitle settings
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'subtitleColor', type: 'color', label: 'Subtitle Color' },
      { name: 'subtitleFontSize', type: 'number', label: 'Subtitle Font Size', unit: 'px', min: 8, max: 120 },
      { name: 'subtitleFontWeight', type: 'enum', label: 'Subtitle Font Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
      { name: 'subtitleFontStyle', type: 'enum', label: 'Subtitle Font Style', options: ['normal', 'italic'] },
      // Subtitle Typography Controls
      { name: 'subtitleLineHeight', type: 'number', label: 'Subtitle Line Height', min: 0.5, max: 3, step: 0.1, description: 'Spacing between lines' },
      { name: 'subtitleLetterSpacing', type: 'number', label: 'Subtitle Letter Spacing', unit: 'px', min: -5, max: 20, step: 0.5, description: 'Character spacing' },
      { name: 'subtitleTextAlign', type: 'enum', label: 'Subtitle Alignment', options: ['left', 'center', 'right', 'justify'] },
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      activeColor: 'var(--gold-decorative)',
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      accentColor: 'var(--gold-on-light)',
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
      { name: 'founderNameFontSize', type: 'number', label: 'Founder Name Font Size' },
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
        { name: 'JKKN College of Allied Health Sciencess', image: '', link: '/institutions/allied-health', description: 'Healthcare professionals' },
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
      accentColor: 'var(--gold-on-light)',
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
    description: 'YouTube video player with playlist sidebar - light theme (pharmacy.jkkn.ac.in style)',
    icon: 'Video',
    previewImage: '/cms-previews/EducationVideos.png',
    component: EducationVideos,
    propsSchema: z.object({
      // Section Header visibility
      showHeader: z.boolean().default(true),
      // Label/Badge configuration
      showLabel: z.boolean().default(true),
      labelText: z.string().default('VIDEO GALLERY'),
      labelColor: z.string().default('var(--gold-on-light)'),
      labelBgColor: z.string().default('rgba(212,175,55,0.2)'),
      // Title configuration
      title: z.string().default('Education Videos'),
      titleAccentWord: z.string().optional(),
      titleAccentColor: z.string().default('var(--gold-on-light)'),
      titleColor: z.string().default('#0b6d41'),
      titleFontSize: z.enum(['3xl', '4xl', '5xl']).default('5xl'),
      // Tagline configuration
      showTagline: z.boolean().default(true),
      tagline: z.string().default('Explore our collection of educational content'),
      taglineColor: z.string().default('#6b7280'),
      // Currently Playing section
      currentlyPlayingText: z.string().default('Currently Playing'),
      currentlyPlayingBgColor: z.string().default('#0b6d41'),
      // Player settings
      showLogoOverlay: z.boolean().default(true),
      logoText: z.string().default('JKKN'),
      showTitleOverlay: z.boolean().default(true),
      // Playlist settings
      showDuration: z.boolean().default(true),
      showActiveIndicator: z.boolean().default(true),
      activeIndicatorColor: z.string().default('#0b6d41'),
      // Styling
      backgroundColor: z.string().default('#ffffff'),
      playlistBgColor: z.string().default('#f5f5f5'),
    }),
    defaultProps: {
      showHeader: true,
      // Label/Badge
      showLabel: true,
      labelText: 'VIDEO GALLERY',
      labelColor: '#D4AF37',
      labelBgColor: 'rgba(212,175,55,0.2)',
      // Title
      title: 'Education Videos',
      titleAccentWord: 'Videos',
      titleAccentColor: '#D4AF37',
      titleColor: '#0b6d41',
      titleFontSize: '5xl',
      // Tagline
      showTagline: true,
      tagline: 'Explore our collection of educational content',
      taglineColor: '#6b7280',
      // Currently Playing
      currentlyPlayingText: 'Currently Playing',
      currentlyPlayingBgColor: '#0b6d41',
      // Player
      showLogoOverlay: true,
      logoText: 'JKKN',
      showTitleOverlay: true,
      // Playlist
      showDuration: true,
      showActiveIndicator: true,
      activeIndicatorColor: '#0b6d41',
      // Styling
      backgroundColor: '#ffffff',
      playlistBgColor: '#f5f5f5',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['videos', 'youtube', 'education', 'player', 'playlist', 'media', 'pharmacy'],
    editableProps: [
      // Section Header
      { name: 'showHeader', type: 'boolean', label: 'Show Section Header' },
      // Label/Badge
      { name: 'showLabel', type: 'boolean', label: 'Show Label Badge' },
      { name: 'labelText', type: 'string', label: 'Label Text' },
      { name: 'labelColor', type: 'color', label: 'Label Color' },
      { name: 'labelBgColor', type: 'color', label: 'Label Background' },
      // Title
      { name: 'title', type: 'string', label: 'Title' },
      { name: 'titleAccentWord', type: 'string', label: 'Accent Word (highlighted)' },
      { name: 'titleColor', type: 'color', label: 'Title Color' },
      { name: 'titleAccentColor', type: 'color', label: 'Accent Color' },
      { name: 'titleFontSize', type: 'enum', label: 'Title Size', options: ['3xl', '4xl', '5xl'] },
      // Tagline
      { name: 'showTagline', type: 'boolean', label: 'Show Tagline' },
      { name: 'tagline', type: 'string', label: 'Tagline' },
      { name: 'taglineColor', type: 'color', label: 'Tagline Color' },
      // Currently Playing
      { name: 'currentlyPlayingText', type: 'string', label: 'Currently Playing Label' },
      { name: 'currentlyPlayingBgColor', type: 'color', label: 'Currently Playing Background' },
      // Player settings
      { name: 'showLogoOverlay', type: 'boolean', label: 'Show Logo on Player' },
      { name: 'logoText', type: 'string', label: 'Logo Text' },
      { name: 'showTitleOverlay', type: 'boolean', label: 'Show Title Overlay' },
      // Playlist settings
      { name: 'showDuration', type: 'boolean', label: 'Show Duration' },
      { name: 'showActiveIndicator', type: 'boolean', label: 'Show Active Indicator' },
      { name: 'activeIndicatorColor', type: 'color', label: 'Active Indicator Color' },
      // Styling
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'playlistBgColor', type: 'color', label: 'Playlist Background' },
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

  InstitutionPoliciesPage: {
    name: 'InstitutionPoliciesPage',
    displayName: 'Institution Policies Page',
    category: 'content',
    description: 'Modern policies page with glassmorphism cards, category badges, and PDF download links',
    icon: 'FileText',
    previewImage: '/cms-previews/InstitutionPoliciesPage.png',
    component: InstitutionPoliciesPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Institution Policies'),
      headerSubtitle: z.string().optional(),
      policies: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        category: z.enum(['academic', 'administrative', 'hr', 'research', 'student', 'environment', 'communication', 'general']).default('general'),
        icon: z.string().optional(),
        pdfUrl: z.string(),
        fileSize: z.string().optional(),
        lastUpdated: z.string().optional(),
      })).default([]),
      layout: z.enum(['grid', 'list', 'categorized']).default('grid'),
      columns: z.enum(['2', '3', '4']).default('3'),
      showCategories: z.boolean().default(true),
      showFileSize: z.boolean().default(true),
      showLastUpdated: z.boolean().default(true),
      showSearch: z.boolean().default(false),
      showCategoryFilter: z.boolean().default(false),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient', 'outline']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Institution Policies',
      headerSubtitle: 'Guidelines and procedures for academic excellence',
      policies: [
        {
          id: '1',
          title: 'Incubation NLB Startup',
          description: 'Guidelines for startup incubation and New Learning Behaviour initiatives',
          category: 'research',
          icon: 'Lightbulb',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_1/view',
          fileSize: '2.4 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '2',
          title: 'Engineering Scholarship',
          description: 'Scholarship eligibility criteria and application procedures',
          category: 'academic',
          icon: 'Award',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_2/view',
          fileSize: '1.8 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '3',
          title: 'Students Play Book',
          description: 'Comprehensive guide for student conduct and campus life',
          category: 'student',
          icon: 'BookMarked',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_3/view',
          fileSize: '5.2 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '4',
          title: 'Solution-Oriented Research and Entrepreneurship',
          description: 'Framework for research initiatives and entrepreneurship programs',
          category: 'research',
          icon: 'Beaker',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_4/view',
          fileSize: '3.1 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '5',
          title: 'Solid Waste Management',
          description: 'Environmental guidelines for waste disposal and recycling',
          category: 'environment',
          icon: 'Recycle',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_5/view',
          fileSize: '1.5 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '6',
          title: 'Professional Body Memberships Sponsorship',
          description: 'Sponsorship policy for professional organization memberships',
          category: 'hr',
          icon: 'Users',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_6/view',
          fileSize: '0.9 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '7',
          title: 'HR Policy',
          description: 'Human resources guidelines, benefits, and procedures',
          category: 'hr',
          icon: 'Briefcase',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_7/view',
          fileSize: '4.7 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '8',
          title: 'Event Policy',
          description: 'Guidelines for organizing and conducting campus events',
          category: 'administrative',
          icon: 'Calendar',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_8/view',
          fileSize: '2.0 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '9',
          title: 'YUVA Policy',
          description: 'Youth development and engagement program guidelines',
          category: 'student',
          icon: 'Sparkles',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_9/view',
          fileSize: '1.6 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '10',
          title: 'Yuva Verticals SOP',
          description: 'Standard operating procedures for YUVA vertical activities',
          category: 'student',
          icon: 'FileStack',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_10/view',
          fileSize: '2.8 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '11',
          title: 'Engineering Green Theme SOP',
          description: 'Sustainability initiatives and green campus procedures',
          category: 'environment',
          icon: 'TreeDeciduous',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_11/view',
          fileSize: '1.3 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '12',
          title: 'JKKN IQAC - SOP',
          description: 'Internal Quality Assurance Cell standard operating procedures',
          category: 'academic',
          icon: 'ClipboardCheck',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_12/view',
          fileSize: '2.2 MB',
          lastUpdated: 'January 2026',
        },
        {
          id: '13',
          title: 'JKKN Institutions Comprehensive Communication Policy',
          description: 'Guidelines for internal and external communications',
          category: 'communication',
          icon: 'MessageCircle',
          pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_13/view',
          fileSize: '1.1 MB',
          lastUpdated: 'January 2026',
        },
      ],
      layout: 'grid',
      columns: '3',
      showCategories: true,
      showFileSize: true,
      showLastUpdated: true,
      showSearch: false,
      showCategoryFilter: false,
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['policies', 'documents', 'pdf', 'download', 'guidelines', 'rules', 'regulations', 'sop'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      {
        name: 'policies',
        type: 'array',
        label: 'Policy Documents',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'ID', required: true },
            title: { type: 'string', label: 'Policy Title', required: true },
            description: { type: 'string', label: 'Description' },
            category: { type: 'string', label: 'Category (academic, hr, research, student, environment, administrative, communication, general)' },
            icon: { type: 'string', label: 'Icon Name (Lightbulb, Award, BookMarked, Beaker, Recycle, Users, Briefcase, Calendar, Sparkles, FileStack, TreeDeciduous, ClipboardCheck, MessageCircle)' },
            pdfUrl: { type: 'string', label: 'PDF URL (Google Drive link)', required: true },
            fileSize: { type: 'string', label: 'File Size (e.g., 2.4 MB)' },
            lastUpdated: { type: 'string', label: 'Last Updated (e.g., January 2026)' },
          },
          required: ['id', 'title', 'pdfUrl'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['grid', 'list', 'categorized'] },
      { name: 'columns', type: 'enum', label: 'Columns', options: ['2', '3', '4'] },
      { name: 'showCategories', type: 'boolean', label: 'Show Category Badges' },
      { name: 'showFileSize', type: 'boolean', label: 'Show File Size' },
      { name: 'showLastUpdated', type: 'boolean', label: 'Show Last Updated' },
      { name: 'showSearch', type: 'boolean', label: 'Enable Search' },
      { name: 'showCategoryFilter', type: 'boolean', label: 'Enable Category Filter' },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient', 'outline'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  InstitutionRulesPage: {
    name: 'InstitutionRulesPage',
    displayName: 'Institution Rules Page',
    category: 'content',
    description: 'Comprehensive institutional rules page with conduct guidelines, anti-ragging policies, dress code, and attendance rules',
    icon: 'ClipboardList',
    previewImage: '/cms-previews/InstitutionRulesPage.png',
    component: InstitutionRulesPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Institution Rules'),
      headerSubtitle: z.string().optional(),
      lastUpdated: z.string().optional(),
      sections: z.array(z.object({
        id: z.string(),
        title: z.string(),
        icon: z.string().optional(),
        introduction: z.string().optional(),
        rules: z.array(z.object({
          text: z.string(),
          subItems: z.array(z.string()).optional(),
        })).optional(),
        content: z.string().optional(),
        subsections: z.array(z.object({
          title: z.string(),
          content: z.string(),
        })).optional(),
      })).default([]),
      showTableOfContents: z.boolean().default(false),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Institution Rules',
      headerSubtitle: 'Guidelines for conduct, discipline, and campus life',
      lastUpdated: 'January 2026',
      sections: [],
      showTableOfContents: false,
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['rules', 'regulations', 'conduct', 'discipline', 'ragging', 'dress code', 'attendance', 'identity card', 'mobile phone', 'helmet', 'guidelines'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'lastUpdated', type: 'string', label: 'Last Updated Date' },
      {
        name: 'sections',
        type: 'array',
        label: 'Rule Sections',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'Section ID', required: true },
            title: { type: 'string', label: 'Section Title', required: true },
            icon: { type: 'string', label: 'Icon Name (Info, ClipboardList, AlertTriangle, Gavel, Shirt, Clock, CreditCard, Bike, Smartphone, BookOpen, Shield, FileWarning)' },
            introduction: { type: 'string', label: 'Introduction Text' },
            content: { type: 'string', label: 'Content (for plain text sections)' },
          },
          required: ['id', 'title'],
        },
      },
      { name: 'showTableOfContents', type: 'boolean', label: 'Show Table of Contents' },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  TermsAndConditionsPage: {
    name: 'TermsAndConditionsPage',
    displayName: 'Terms & Conditions Page',
    category: 'content',
    description: 'Full terms and conditions page with glassmorphism styling, sticky TOC sidebar, and 20 legal sections',
    icon: 'Scale',
    previewImage: '/cms-previews/TermsAndConditionsPage.png',
    component: TermsAndConditionsPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Terms & Conditions'),
      headerSubtitle: z.string().optional(),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#ffde59'),
      showTableOfContents: z.boolean().default(false),
      tocTitle: z.string().default('Contents'),
      stickyToc: z.boolean().default(true),
      lastUpdated: z.string().default('January 03, 2026'),
      introduction: z.string().default(''),
      sections: z.array(z.object({
        id: z.string(),
        number: z.string(),
        title: z.string(),
        icon: z.string().optional(),
        content: z.string(),
        subsections: z.array(z.object({
          id: z.string(),
          number: z.string(),
          title: z.string(),
          content: z.string(),
        })).optional(),
      })).default([]),
      showContactInfo: z.boolean().default(true),
      contactEmail: z.string().default('info@jkkn.ac.in'),
      contactPhone: z.string().default('+91 93458 55001'),
      contactAddress: z.string().default('JKKN Institutions, Natarajapuram, NH-544 (Salem to Coimbatore National Highway), Komarapalayam (TK), Namakkal (DT), Tamil Nadu – 638183, India'),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Terms & Conditions',
      headerSubtitle: 'Please read carefully before using our services',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#ffde59',
      showTableOfContents: false,
      tocTitle: 'Contents',
      stickyToc: true,
      lastUpdated: 'January 03, 2026',
      introduction: 'Welcome to JKKN Institutions. These Terms and Conditions govern your use of our website, educational services, and digital platforms. By accessing or using our services, you agree to comply with these terms. Please read them carefully.',
      sections: [],
      showContactInfo: true,
      contactEmail: 'info@jkkn.ac.in',
      contactPhone: '+91 93458 55001',
      contactAddress: 'JKKN Institutions, Natarajapuram, NH-544 (Salem to Coimbatore National Highway), Komarapalayam (TK), Tamil Nadu – 638183, India',
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['terms', 'conditions', 'legal', 'agreement', 'policy', 'tos', 'terms of service'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'headerPart1Color', type: 'color', label: 'Title Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Accent Color' },
      { name: 'showTableOfContents', type: 'boolean', label: 'Show Table of Contents' },
      { name: 'tocTitle', type: 'string', label: 'TOC Title' },
      { name: 'stickyToc', type: 'boolean', label: 'Sticky TOC on Desktop' },
      { name: 'lastUpdated', type: 'string', label: 'Last Updated Date' },
      { name: 'introduction', type: 'string', label: 'Introduction Text', multiline: true },
      {
        name: 'sections',
        type: 'array',
        label: 'Terms Sections',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'ID', required: true },
            number: { type: 'string', label: 'Section Number (e.g., 1, 5.1)', required: true },
            title: { type: 'string', label: 'Section Title', required: true },
            icon: { type: 'string', label: 'Icon Name (Scale, Building2, Shield, etc.)' },
            content: { type: 'string', label: 'Content (supports **bold** and bullet points)', required: true, multiline: true },
          },
          required: ['id', 'number', 'title', 'content'],
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

  ModernManagementSection: {
    name: 'ModernManagementSection',
    displayName: 'Modern Management Section',
    category: 'content',
    description: 'Premium, modern layout for showcasing the leadership team (Chairperson, Director, Joint Director)',
    icon: 'Users',
    previewImage: '/cms-previews/ModernManagementSection.png',
    component: ModernManagementSection,
    propsSchema: ModernManagementSectionPropsSchema,
    defaultProps: {
      title: 'OUR MANAGEMENT',
      subtitle: 'Visionary Leadership Guiding JKKN',
      members: [
        {
          name: 'SMT. N. SENDAMARAAI',
          title: 'CHAIRPERSON',
          image: '/images/chairperson.png',
          message: 'Leadership and Excellence is not merely our motto but the foundation of our values, a testament to our state-of-the-art infrastructure and unwavering commitment to quality education.',
        },
        {
          name: 'SHRI. S. OMMSHARRAVANA',
          title: 'DIRECTOR',
          image: '/images/director.png',
          message: 'Our mission empowers students to contribute their best to society and the nation. We are committed to innovative education methodologies that enable quality learning.',
        },
        {
          name: 'MRS. O. ISVARYA LAKSHMI',
          title: 'JOINT DIRECTOR',
          image: '/images/joint-director-placeholder.png',
          message: 'Together, we strive to create an environment where excellence thrives and every student achieves their fullest potential.',
        }
      ],
      showPattern: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['management', 'leadership', 'modern', 'profile', 'team', 'chairperson', 'director'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'subtitle', type: 'string', label: 'Section Subtitle' },
      {
        name: 'members',
        type: 'array',
        label: 'Team Members',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Name', required: true },
            title: { type: 'string', label: 'Title', required: true },
            image: { type: 'image', label: 'Image URL', required: true },
            message: { type: 'string', label: 'Message', multiline: true },
          },
          required: ['name', 'title', 'image'],
        },
      },
      { name: 'showPattern', type: 'boolean', label: 'Show Background Pattern' },
    ],
  },

  ModernTrustSection: {
    name: 'ModernTrustSection',
    displayName: 'Modern Trust Section',
    category: 'content',
    description: 'Premium, modern layout for the "Our Trust" page with Founder spotlight and stats',
    icon: 'Building2',
    previewImage: '/cms-previews/ModernTrustSection.png',
    component: ModernTrustSection,
    propsSchema: ModernTrustSectionPropsSchema,
    defaultProps: {
      pageTitle: 'OUR TRUST',
      pageSubtitle: 'J.K.K. Rangammal Charitable Trust',
      founderName: 'SHRI. J.K.K. NATARAJAH',
      storyTitle: 'A Legacy of Service',
      showPattern: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['trust', 'founder', 'history', 'modern', 'about'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title' },
      { name: 'pageSubtitle', type: 'string', label: 'Page Subtitle' },
      { name: 'founderName', type: 'string', label: 'Founder Name' },
      { name: 'founderTitle', type: 'string', label: 'Founder Title' },
      { name: 'founderImage', type: 'image', label: 'Founder Image' },
      { name: 'founderStory', type: 'string', label: 'Founder Bio', multiline: true },
      { name: 'storyTitle', type: 'string', label: 'Story Title' },
      { name: 'storyContent', type: 'string', label: 'Story Content', multiline: true },
      { name: 'showPattern', type: 'boolean', label: 'Show Background Pattern' },
    ],
  },

  ModernPrincipalMessage: {
    name: 'ModernPrincipalMessage',
    displayName: 'Modern Principal Message',
    category: 'content',
    description: 'Premium, modern layout for the Principal\'s message with profile image and rich text',
    icon: 'UserCheck',
    previewImage: '/cms-previews/ModernPrincipalMessage.png',
    component: ModernPrincipalMessage,
    propsSchema: ModernPrincipalMessagePropsSchema,
    defaultProps: {
      title: "Principal's Message",
      name: 'Dr. C. Kathirvel',
      role: 'Principal',
      messagePart1: "J.K.K Nataraja College of Engineering and Technology is an emerging AI Powered institute, dedicated to providing top-tier education since its establishment in 2008.",
      showPattern: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['principal', 'message', 'profile', 'modern', 'management'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'name', type: 'string', label: 'Name' },
      { name: 'role', type: 'string', label: 'Role/Title' },
      { name: 'image', type: 'image', label: 'Profile Image' },
      { name: 'messagePart1', type: 'string', label: 'Message Part 1', multiline: true },
      { name: 'messagePart2', type: 'string', label: 'Message Part 2', multiline: true },
      { name: 'showPattern', type: 'boolean', label: 'Show Background Pattern' },
    ],
  },

  ModernOrganogramSection: {
    name: 'ModernOrganogramSection',
    displayName: 'Modern Organogram (Chart)',
    category: 'content',
    description: 'Code-based interactive organizational chart with collapsible nodes',
    icon: 'Network',
    previewImage: '/cms-previews/ModernOrganogramSection.png',
    component: ModernOrganogramSection,
    propsSchema: ModernOrganogramSectionPropsSchema,
    defaultProps: {
      title: 'Organizational Chart',
      subtitle: 'Hierarchy of JKKN Educational Institutions',
      showPattern: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['organogram', 'chart', 'hierarchy', 'structure', 'tree'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'members',
        type: 'array',
        label: 'Team Members',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'Unique ID (e.g. principal)', required: true },
            managerId: { type: 'string', label: 'Manager ID (Parent)' },
            name: { type: 'string', label: 'Name', required: true },
            role: { type: 'string', label: 'Role', required: true },
            variant: {
              type: 'select',
              label: 'Color Theme',
              options: ['green', 'orange', 'yellow', 'magenta', 'purple', 'red', 'maroon', 'blue', 'dark-purple']
            },
          }
        }
      },
      { name: 'showPattern', type: 'boolean', label: 'Show Background Pattern' },
    ],
  },

  ModernTransportSection: {
    name: 'ModernTransportSection',
    displayName: 'Modern Transport Section',
    category: 'content',
    description: 'Premium modern transport page with bus routes table, feature cards, image gallery, and transport incharge contact',
    icon: 'Bus',
    previewImage: '/cms-previews/ModernTransportSection.png',
    component: ModernTransportSection,
    propsSchema: ModernTransportSectionPropsSchema,
    defaultProps: {
      pageTitle: 'TRANSPORT',
      pageSubtitle: 'Safe & Reliable Transportation',
      introduction: 'Transportation is an essential aspect of any educational institution. It provides students and faculty members with a convenient way to reach the campus and enhances the overall educational experience. JKKN Educational Institutions understand the importance of transportation and have made significant efforts to improve their transport facilities.',
      images: [
        { src: '/images/facilities/transport-1.jpg', alt: 'College bus fleet' },
        { src: '/images/facilities/transport-2.jpg', alt: 'Modern buses' },
      ],
      features: [
        { icon: 'Wrench', title: 'Well-Maintained Buses', description: 'The transport facility at JKKN Educational Institutions is equipped with a well-maintained fleet of buses. These buses are regularly serviced and cleaned to ensure the safety and comfort of the passengers.' },
        { icon: 'UserCheck', title: 'Trained Drivers', description: 'The drivers who operate the buses at JKKN Educational Institutions are highly trained and experienced. They have a good understanding of the local routes and traffic conditions.' },
        { icon: 'Banknote', title: 'Affordable Fees', description: 'The transport facility is available to all students and faculty members at an affordable fee calculated based on the distance from the campus.' },
        { icon: 'Shield', title: 'Safe and Secure', description: 'The buses are equipped with CCTV cameras, and there are female attendants on board to ensure the safety of female passengers.' },
        { icon: 'Clock', title: 'Timely Service', description: 'The transport facility operates on a strict schedule, ensuring that the buses arrive and depart from the campus on time.' },
        { icon: 'Accessibility', title: 'Accessibility', description: 'The buses are equipped with wheelchair ramps and other accessibility features, making it easy for students with disabilities to use the service.' },
      ],
      busRoutes: [
        { route: 'Athani', distance: 51, buses: 1 },
        { route: 'Garusanenkkiyar', distance: 36, buses: 1 },
        { route: 'Poudenpatti', distance: 31, buses: 1 },
        { route: 'Pudupatti', distance: 30, buses: 1 },
        { route: 'Anthiyur', distance: 28, buses: 1 },
        { route: 'Komarapalayam', distance: 30, buses: 1 },
        { route: 'Namakkal', distance: 41, buses: 1 },
        { route: 'Rasiphu', distance: 46, buses: 1 },
        { route: 'Salem', distance: 57, buses: 2 },
        { route: 'Gobichettipalayam', distance: 37, buses: 1 },
        { route: 'Gorapalayam', distance: 86, buses: 1 },
        { route: 'Omalur', distance: 67, buses: 1 },
        { route: 'Cherampalli', distance: 43, buses: 1 },
        { route: 'Chittar', distance: 87, buses: 1 },
        { route: 'Nanjuneli', distance: 52, buses: 1 },
      ],
      districtsCovered: ['Namakkal', 'Salem', 'Erode', 'Tiruppur'],
      transportInchargeName: 'Mr. Mani',
      transportInchargePhone: '+91 9976772223, 9655177177',
      showPattern: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['transport', 'bus', 'travel', 'commute', 'facility', 'modern', 'safety', 'routes'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title' },
      { name: 'pageSubtitle', type: 'string', label: 'Page Subtitle' },
      { name: 'introduction', type: 'string', label: 'Introduction', multiline: true },
      {
        name: 'images',
        type: 'array',
        label: 'Gallery Images',
        itemType: 'object',
        itemSchema: {
          properties: {
            src: { type: 'image', label: 'Image URL', required: true },
            alt: { type: 'string', label: 'Alt Text' },
          },
          required: ['src'],
        },
      },
      {
        name: 'features',
        type: 'array',
        label: 'Transport Features',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: { type: 'string', label: 'Icon (Lucide name)', required: true },
            title: { type: 'string', label: 'Title', required: true },
            description: { type: 'string', label: 'Description', required: true },
          },
          required: ['icon', 'title', 'description'],
        },
      },
      {
        name: 'busRoutes',
        type: 'array',
        label: 'Bus Routes',
        itemType: 'object',
        itemSchema: {
          properties: {
            route: { type: 'string', label: 'Route Name', required: true },
            distance: { type: 'number', label: 'Distance (km)', required: true },
            buses: { type: 'number', label: 'Number of Buses', required: true },
          },
          required: ['route', 'distance', 'buses'],
        },
      },
      {
        name: 'districtsCovered',
        type: 'array',
        label: 'Districts Covered',
        itemType: 'string',
      },
      { name: 'transportInchargeName', type: 'string', label: 'Transport Incharge Name' },
      { name: 'transportInchargePhone', type: 'string', label: 'Transport Incharge Phone' },
      { name: 'showPattern', type: 'boolean', label: 'Show Background Pattern' },
    ],
  },

  LeadershipProfile: {
    name: 'LeadershipProfile',
    displayName: 'Leadership Profile',
    category: 'content',
    description: 'Modern profile page for Principal, Vice Principal, HODs, Directors with hero image, glass card, and message section',
    icon: 'UserCircle',
    previewImage: '/cms-previews/LeadershipProfile.png',
    component: LeadershipProfile,
    propsSchema: z.object({
      name: z.string().describe('Full name with title'),
      title: z.string().describe('Position title'),
      designation: z.string().describe('Institution name'),
      qualification: z.string().optional().describe('Qualifications'),
      image: z.string().describe('Profile photo URL'),
      imageAlt: z.string().optional().describe('Image alt text'),
      messageTitle: z.string().default("Principal's Message").describe('Message section title'),
      message: z.string().describe('The leadership message'),
      showDropCap: z.boolean().default(true).describe('Show drop-cap on first letter'),
      role: z.enum(['principal', 'vice-principal', 'hod', 'management', 'director']).default('principal'),
      accentColor: z.string().default('#ffde59').describe('Accent color'),
      showDecorations: z.boolean().default(true).describe('Show floating decorations'),
      showQuoteIcons: z.boolean().default(true).describe('Show quote icons'),
    }),
    defaultProps: {
      name: 'Dr. Principal Name',
      title: 'Principal',
      designation: 'JKKN College',
      qualification: 'Ph.D.',
      image: '/images/principal.png',
      imageAlt: 'Principal Photo',
      messageTitle: "Principal's Message",
      message: 'Welcome to our institution. We are committed to providing quality education and fostering a culture of excellence. Our dedicated faculty and state-of-the-art facilities ensure that every student receives the best possible learning experience.',
      showDropCap: true,
      role: 'principal',
      accentColor: '#ffde59',
      showDecorations: true,
      showQuoteIcons: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['principal', 'vice principal', 'hod', 'director', 'leader', 'profile', 'message', 'about'],
    editableProps: [
      { name: 'name', type: 'string', label: 'Full Name' },
      { name: 'title', type: 'string', label: 'Position Title' },
      { name: 'designation', type: 'string', label: 'Institution Name' },
      { name: 'qualification', type: 'string', label: 'Qualifications' },
      { name: 'image', type: 'image', label: 'Profile Photo' },
      { name: 'imageAlt', type: 'string', label: 'Photo Alt Text' },
      { name: 'messageTitle', type: 'string', label: 'Message Title' },
      { name: 'message', type: 'string', label: 'Message Content', multiline: true },
      { name: 'role', type: 'enum', label: 'Leadership Role', options: ['principal', 'vice-principal', 'hod', 'management', 'director'] },
      { name: 'showDropCap', type: 'boolean', label: 'Show Drop Cap' },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
      { name: 'showQuoteIcons', type: 'boolean', label: 'Show Quote Icons' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
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
      { name: 'collegeTitle', type: 'richtext', label: 'College/Department Title', placeholder: 'Enter college/department title...', inlineEditable: true },
      { name: 'description', type: 'string', label: 'Description', multiline: true, inlineEditable: true },
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

  BEEEECoursePage: {
    name: 'BEEEECoursePage',
    displayName: 'BE EEE Course Page (Cream)',
    category: 'content',
    description: 'Comprehensive B.E. Electrical & Electronics Engineering course page with cream color backgrounds. Includes hero, overview, benefits, curriculum, specializations, careers, recruiters, admission, fees, facilities, faculty, and FAQs.',
    icon: 'Zap',
    previewImage: '/cms-previews/BEEEECoursePage.png',
    component: BEEEECoursePage,
    propsSchema: BEEEECoursePagePropsSchema as any,
    defaultProps: BE_EEE_SAMPLE_DATA,
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['course', 'engineering', 'eee', 'electrical', 'electronics', 'be', 'bachelor', 'curriculum', 'placements', 'admission', 'cream'],
    editableProps: [
      { name: 'heroTitle', type: 'string', label: 'Hero Title', required: true, inlineEditable: true },
      { name: 'heroSubtitle', type: 'string', label: 'Hero Subtitle', multiline: true, inlineEditable: true },
      { name: 'affiliatedTo', type: 'string', label: 'Affiliated To', inlineEditable: true },
      { name: 'overviewTitle', type: 'string', label: 'Overview Section Title' },
      { name: 'whyChooseTitle', type: 'string', label: 'Why Choose Section Title' },
      { name: 'curriculumTitle', type: 'string', label: 'Curriculum Section Title' },
      { name: 'careerTitle', type: 'string', label: 'Career Section Title' },
      { name: 'recruitersTitle', type: 'string', label: 'Recruiters Section Title' },
      { name: 'admissionTitle', type: 'string', label: 'Admission Section Title' },
      { name: 'feeTitle', type: 'string', label: 'Fee Section Title' },
      { name: 'facilitiesTitle', type: 'string', label: 'Facilities Section Title' },
      { name: 'facultyTitle', type: 'string', label: 'Faculty Section Title' },
      { name: 'faqTitle', type: 'string', label: 'FAQ Section Title' },
      { name: 'ctaTitle', type: 'string', label: 'Final CTA Title', inlineEditable: true },
      { name: 'ctaDescription', type: 'string', label: 'Final CTA Description', multiline: true, inlineEditable: true },
      { name: 'ctaButtonLabel', type: 'string', label: 'Final CTA Button Label' },
      { name: 'ctaButtonLink', type: 'string', label: 'Final CTA Button Link' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  BEECECoursePage: {
    name: 'BEECECoursePage',
    displayName: 'BE ECE Course Page (Cream)',
    category: 'content',
    description: 'Comprehensive B.E. Electronics & Communication Engineering course page with cream color backgrounds. Includes hero, overview, benefits, curriculum, specializations, careers, recruiters, admission, fees, facilities, faculty, and FAQs.',
    icon: 'Cpu',
    previewImage: '/cms-previews/BEECECoursePage.png',
    component: BEECECoursePage,
    propsSchema: BEECECoursePagePropsSchema as any,
    defaultProps: BE_ECE_SAMPLE_DATA,
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['course', 'engineering', 'ece', 'electronics', 'communication', 'be', 'bachelor', 'curriculum', 'placements', 'admission', 'cream', 'vlsi', 'embedded', 'iot'],
    editableProps: [
      { name: 'heroTitle', type: 'string', label: 'Hero Title', required: true, inlineEditable: true },
      { name: 'heroSubtitle', type: 'string', label: 'Hero Subtitle', multiline: true, inlineEditable: true },
      { name: 'affiliatedTo', type: 'string', label: 'Affiliated To', inlineEditable: true },
      { name: 'overviewTitle', type: 'string', label: 'Overview Section Title' },
      { name: 'whyChooseTitle', type: 'string', label: 'Why Choose Section Title' },
      { name: 'curriculumTitle', type: 'string', label: 'Curriculum Section Title' },
      { name: 'careerTitle', type: 'string', label: 'Career Section Title' },
      { name: 'recruitersTitle', type: 'string', label: 'Recruiters Section Title' },
      { name: 'admissionTitle', type: 'string', label: 'Admission Section Title' },
      { name: 'feeTitle', type: 'string', label: 'Fee Section Title' },
      { name: 'facilitiesTitle', type: 'string', label: 'Facilities Section Title' },
      { name: 'facultyTitle', type: 'string', label: 'Faculty Section Title' },
      { name: 'faqTitle', type: 'string', label: 'FAQ Section Title' },
      { name: 'ctaTitle', type: 'string', label: 'Final CTA Title', inlineEditable: true },
      { name: 'ctaDescription', type: 'string', label: 'Final CTA Description', multiline: true, inlineEditable: true },
      { name: 'ctaButtonLabel', type: 'string', label: 'Final CTA Button Label' },
      { name: 'ctaButtonLink', type: 'string', label: 'Final CTA Button Link' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  BEMechanicalCoursePage: {
    name: 'BEMechanicalCoursePage',
    displayName: 'BE Mechanical Course Page (Cream)',
    category: 'content',
    description: 'Comprehensive B.E. Mechanical Engineering course page with cream color backgrounds. Includes hero, overview, benefits, curriculum, specializations, careers, recruiters, facilities, faculty, admission, fees, FAQs, and placement statistics.',
    icon: 'Settings',
    previewImage: '/cms-previews/BEMechanicalCoursePage.png',
    component: BEMechanicalCoursePage,
    propsSchema: BEMechanicalCoursePagePropsSchema as any,
    defaultProps: beMechanicalCourseData,
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['course', 'engineering', 'mechanical', 'be', 'bachelor', 'curriculum', 'placements', 'admission', 'cream', 'thermal', 'design', 'manufacturing', 'automobile', 'robotics', 'energy'],
    editableProps: [
      { name: 'heroTitle', type: 'string', label: 'Hero Title', required: true, inlineEditable: true },
      { name: 'heroSubtitle', type: 'string', label: 'Hero Subtitle', multiline: true, inlineEditable: true },
      { name: 'affiliatedTo', type: 'string', label: 'Affiliated To', inlineEditable: true },
      { name: 'overviewTitle', type: 'string', label: 'Overview Section Title' },
      { name: 'whyChooseTitle', type: 'string', label: 'Why Choose Section Title' },
      { name: 'curriculumTitle', type: 'string', label: 'Curriculum Section Title' },
      { name: 'specializationsTitle', type: 'string', label: 'Specializations Section Title' },
      { name: 'careerTitle', type: 'string', label: 'Career Section Title' },
      { name: 'recruitersTitle', type: 'string', label: 'Recruiters Section Title' },
      { name: 'facilitiesTitle', type: 'string', label: 'Facilities Section Title' },
      { name: 'facultyTitle', type: 'string', label: 'Faculty Section Title' },
      { name: 'admissionTitle', type: 'string', label: 'Admission Section Title' },
      { name: 'feeTitle', type: 'string', label: 'Fee Section Title' },
      { name: 'faqTitle', type: 'string', label: 'FAQ Section Title' },
      { name: 'placementStatsTitle', type: 'string', label: 'Placement Stats Section Title' },
      { name: 'ctaTitle', type: 'string', label: 'Final CTA Title', inlineEditable: true },
      { name: 'ctaDescription', type: 'string', label: 'Final CTA Description', multiline: true, inlineEditable: true },
      { name: 'ctaButtonLabel', type: 'string', label: 'Final CTA Button Label' },
      { name: 'ctaButtonLink', type: 'string', label: 'Final CTA Button Link' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  BEITCoursePage: {
    name: 'BEITCoursePage',
    displayName: 'B.Tech IT Course Page (Cream)',
    category: 'content',
    description: 'Comprehensive B.Tech Information Technology course page with cream color backgrounds. Includes hero, overview, benefits, curriculum, specializations, careers, recruiters, admission, fees, facilities, faculty, and FAQs.',
    icon: 'Laptop',
    previewImage: '/cms-previews/BEITCoursePage.png',
    component: BEITCoursePage,
    propsSchema: BEITCoursePagePropsSchema as any,
    defaultProps: BE_IT_SAMPLE_DATA,
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['course', 'engineering', 'it', 'information technology', 'btech', 'bachelor', 'curriculum', 'placements', 'admission', 'cream', 'ai', 'ml', 'cloud', 'cybersecurity', 'fullstack', 'data science'],
    editableProps: [
      { name: 'heroTitle', type: 'string', label: 'Hero Title', required: true, inlineEditable: true },
      { name: 'heroSubtitle', type: 'string', label: 'Hero Subtitle', multiline: true, inlineEditable: true },
      { name: 'affiliatedTo', type: 'string', label: 'Affiliated To', inlineEditable: true },
      { name: 'overviewTitle', type: 'string', label: 'Overview Section Title' },
      { name: 'whyChooseTitle', type: 'string', label: 'Why Choose Section Title' },
      { name: 'curriculumTitle', type: 'string', label: 'Curriculum Section Title' },
      { name: 'specializationsTitle', type: 'string', label: 'Specializations Section Title' },
      { name: 'careerTitle', type: 'string', label: 'Career Section Title' },
      { name: 'recruitersTitle', type: 'string', label: 'Recruiters Section Title' },
      { name: 'admissionTitle', type: 'string', label: 'Admission Section Title' },
      { name: 'feeTitle', type: 'string', label: 'Fee Section Title' },
      { name: 'facilitiesTitle', type: 'string', label: 'Facilities Section Title' },
      { name: 'facultyTitle', type: 'string', label: 'Faculty Section Title' },
      { name: 'faqTitle', type: 'string', label: 'FAQ Section Title' },
      { name: 'ctaTitle', type: 'string', label: 'Final CTA Title', inlineEditable: true },
      { name: 'ctaDescription', type: 'string', label: 'Final CTA Description', multiline: true, inlineEditable: true },
      { name: 'ctaButtonLabel', type: 'string', label: 'Final CTA Button Label' },
      { name: 'ctaButtonLink', type: 'string', label: 'Final CTA Button Link' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  MECSECoursePage: {
    name: 'MECSECoursePage',
    displayName: 'ME CSE Course Page (Postgraduate)',
    category: 'content',
    description: 'Comprehensive M.E. Computer Science and Engineering postgraduate course page. Includes hero with stats overlay, program overview, highlights, 6 specializations (AI/ML, Data Science, Cybersecurity, Cloud, Vision, IoT), 4-semester curriculum, eligibility criteria, research labs, placement record, faculty directory, FAQs, CTA section, and contact information. Designed for advanced computing programs.',
    icon: 'GraduationCap',
    previewImage: '/cms-previews/MECSECoursePage.png',
    component: MECSECoursePage,
    propsSchema: MECSECoursePagePropsSchema as any,
    defaultProps: meCSECourseData,
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['course', 'engineering', 'postgraduate', 'masters', 'me', 'cse', 'computer science', 'ai', 'machine learning', 'data science', 'cybersecurity', 'cloud computing', 'research', 'phd', 'anna university', 'nba', 'aicte'],
    editableProps: [
      { name: 'hero.badge', type: 'string', label: 'Hero Badge', inlineEditable: true },
      { name: 'hero.title', type: 'string', label: 'Hero Title', required: true, inlineEditable: true },
      { name: 'hero.highlightedText', type: 'string', label: 'Hero Highlighted Text', inlineEditable: true },
      { name: 'hero.subtitle', type: 'string', label: 'Hero Subtitle', multiline: true, inlineEditable: true },
      { name: 'overview.label', type: 'string', label: 'Overview Section Label' },
      { name: 'overview.title', type: 'string', label: 'Overview Title' },
      { name: 'highlights.label', type: 'string', label: 'Highlights Section Label' },
      { name: 'highlights.title', type: 'string', label: 'Highlights Title' },
      { name: 'specializations.label', type: 'string', label: 'Specializations Section Label' },
      { name: 'specializations.title', type: 'string', label: 'Specializations Title' },
      { name: 'curriculum.label', type: 'string', label: 'Curriculum Section Label' },
      { name: 'curriculum.title', type: 'string', label: 'Curriculum Title' },
      { name: 'eligibility.label', type: 'string', label: 'Eligibility Section Label' },
      { name: 'eligibility.title', type: 'string', label: 'Eligibility Title' },
      { name: 'infrastructure.label', type: 'string', label: 'Infrastructure Section Label' },
      { name: 'infrastructure.title', type: 'string', label: 'Infrastructure Title' },
      { name: 'placement.label', type: 'string', label: 'Placement Section Label' },
      { name: 'placement.title', type: 'string', label: 'Placement Title' },
      { name: 'faculty.label', type: 'string', label: 'Faculty Section Label' },
      { name: 'faculty.title', type: 'string', label: 'Faculty Title' },
      { name: 'faqs.label', type: 'string', label: 'FAQs Section Label' },
      { name: 'faqs.title', type: 'string', label: 'FAQs Title' },
      { name: 'cta.title', type: 'string', label: 'CTA Title', inlineEditable: true },
      { name: 'cta.description', type: 'string', label: 'CTA Description', multiline: true, inlineEditable: true },
      { name: 'contact.label', type: 'string', label: 'Contact Section Label' },
      { name: 'contact.title', type: 'string', label: 'Contact Title' },
      { name: 'colors.primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'colors.accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  MBACoursePage: {
    name: 'MBACoursePage',
    displayName: 'MBA Course Page (Business)',
    category: 'content',
    description: 'Comprehensive Master of Business Administration course page with cream color backgrounds. Includes hero with admission badge, program overview, key highlights, 4 specializations (Marketing, Finance, HR, Operations), 2-year curriculum (4 semesters), eligibility criteria, admission process, fee structure, career opportunities, placement statistics, top recruiters, facilities, faculty, FAQs, and final CTA with contact information. Perfect for MBA and business management programs.',
    icon: 'Briefcase',
    previewImage: '/cms-previews/MBACoursePage.png',
    component: MBACoursePage,
    propsSchema: MBACoursePagePropsSchema as any,
    defaultProps: MBA_SAMPLE_DATA,
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['mba', 'master', 'business', 'administration', 'course', 'management', 'postgraduate', 'marketing', 'finance', 'hr', 'human resource', 'operations', 'placements', 'admission', 'aicte', 'tancet', 'cat', 'mat', 'xat', 'specializations', 'cream', 'business school'],
    editableProps: [
      { name: 'heroTitle', type: 'string', label: 'Hero Title', required: true, inlineEditable: true },
      { name: 'heroSubtitle', type: 'string', label: 'Hero Subtitle', multiline: true, inlineEditable: true },
      { name: 'affiliatedTo', type: 'string', label: 'Affiliated To', inlineEditable: true },
      { name: 'admissionBadge', type: 'string', label: 'Admission Badge', inlineEditable: true },
      { name: 'overviewTitle', type: 'string', label: 'Overview Section Title' },
      { name: 'overviewSubtitle', type: 'string', label: 'Overview Subtitle' },
      { name: 'highlightsTitle', type: 'string', label: 'Highlights Section Title' },
      { name: 'specializationsTitle', type: 'string', label: 'Specializations Section Title' },
      { name: 'curriculumTitle', type: 'string', label: 'Curriculum Section Title' },
      { name: 'eligibilityTitle', type: 'string', label: 'Eligibility Section Title' },
      { name: 'documentsTitle', type: 'string', label: 'Documents Section Title' },
      { name: 'admissionProcessTitle', type: 'string', label: 'Admission Process Title' },
      { name: 'feeTitle', type: 'string', label: 'Fee Structure Title' },
      { name: 'feeDisclaimer', type: 'string', label: 'Fee Disclaimer', multiline: true },
      { name: 'careerTitle', type: 'string', label: 'Career Section Title' },
      { name: 'placementTitle', type: 'string', label: 'Placement Statistics Title' },
      { name: 'recruitersTitle', type: 'string', label: 'Recruiters Section Title' },
      { name: 'facilitiesTitle', type: 'string', label: 'Facilities Section Title' },
      { name: 'facultyTitle', type: 'string', label: 'Faculty Section Title' },
      { name: 'faqTitle', type: 'string', label: 'FAQ Section Title' },
      { name: 'ctaTitle', type: 'string', label: 'Final CTA Title', inlineEditable: true },
      { name: 'ctaDescription', type: 'string', label: 'Final CTA Description', multiline: true, inlineEditable: true },
      { name: 'ctaPrimaryButtonLabel', type: 'string', label: 'Primary CTA Button Label' },
      { name: 'ctaPrimaryButtonLink', type: 'string', label: 'Primary CTA Button Link' },
      { name: 'ctaSecondaryButtonLabel', type: 'string', label: 'Secondary CTA Button Label' },
      { name: 'ctaSecondaryButtonLink', type: 'string', label: 'Secondary CTA Button Link' },
      { name: 'contactPhone', type: 'string', label: 'Contact Phone' },
      { name: 'contactEmail', type: 'string', label: 'Contact Email' },
      { name: 'contactAddress', type: 'string', label: 'Contact Address', multiline: true },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
    ],
  },

  InstitutionalDevelopmentPlanPage: {
    name: 'InstitutionalDevelopmentPlanPage',
    displayName: 'Institutional Development Plan Page',
    category: 'content',
    description: 'Dedicated page component for displaying Institutional Development Plan with sections for vision, highlights, alignment, and contact information',
    icon: 'BookOpen',
    previewImage: '/cms-previews/InstitutionalDevelopmentPlanPage.png',
    component: InstitutionalDevelopmentPlanPage,
    propsSchema: z.object({
      pageTitle: z.string().default('Institutional Development Plan (IDP)'),
      subtitle: z.string().default('Commitment to Academic Excellence and National Educational Goals'),
      introduction: z.string().default(''),
      vision: z.string().default(''),
      highlights: z.array(z.string()).default([]),
      alignmentItems: z.array(z.string()).default([]),
      contactInfo: z.string().default(''),
      backgroundColor: z.string().default('#fbfbee'),
      primaryColor: z.string().default('#0b6d41'),
      accentColor: z.string().default('#ffde59'),
      textColor: z.string().default('#333333'),
    }),
    defaultProps: {
      pageTitle: 'Institutional Development Plan (IDP)',
      subtitle: 'Commitment to Academic Excellence and National Educational Goals',
      introduction: 'At JKKN Dental College and Hospital, we are deeply committed to holistic institutional growth guided by the University Grants Commission (UGC) framework for Institutional Development Plans (IDPs). Our IDP is designed to reflect the principles of NEP 2020, ensuring academic innovation, community engagement, digital transformation, and sustainable development.',
      vision: '"To be a Leading Global Innovative Solution Provider for the Ever-Changing Needs of Society."',
      highlights: [
        'Strategic goals focused on academic excellence, research, community health, and financial sustainability.',
        'Robust faculty development and interdisciplinary learning initiatives.',
        'Comprehensive community engagement through dental camps and outreach programs.',
        'Integration of digital technologies in learning and administration.',
        'Environmentally responsible infrastructure upgrades with green campus initiatives.'
      ],
      alignmentItems: [
        'University Grants Commission (UGC)',
        'Dental Council of India (DCI)',
        'Tamil Nadu Dr. M.G.R. Medical University',
        'National Education Policy 2020 (NEP)',
        'NAAC Accreditation Framework'
      ],
      contactInfo: 'For queries related to the Institutional Development Plan, please contact:\nEmail: dental@jkkn.ac.in\nPhone: +91 93458 55001\nOffice: Principal\'s Office, JKKN Dental College and Hospital',
      backgroundColor: '#fbfbee',
      primaryColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#333333',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['idp', 'institutional', 'development', 'plan', 'vision', 'policy', 'ugc', 'nep', 'accreditation'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'introduction', type: 'string', label: 'Introduction', multiline: true },
      { name: 'vision', type: 'string', label: 'Vision Statement', multiline: true },
      { name: 'highlights', type: 'array', label: 'Highlights', itemType: 'string' },
      { name: 'alignmentItems', type: 'array', label: 'Alignment Items', itemType: 'string' },
      { name: 'contactInfo', type: 'string', label: 'Contact Information', multiline: true },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
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
      backgroundColor: 'rgb(251, 251, 238)',
      accentColor: '#0b6d41',
      textColor: '#000000'
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
        highlights: z.array(z.string()),
        warden: z.object({ name: z.string(), mobile: z.string() }).optional()
      }),
      girlsHostel: z.object({
        title: z.string(),
        images: z.array(z.object({ src: z.string(), alt: z.string().optional() })),
        paragraphs: z.array(z.string()),
        highlights: z.array(z.string()),
        warden: z.object({ name: z.string(), mobile: z.string() }).optional()
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
        highlights: ['Community living experience', 'Dedicated staff support'],
        warden: { name: 'Mr. Srinivasan', mobile: '+91 6374967302' }
      },
      girlsHostel: {
        title: 'Girls Hostel',
        images: [],
        paragraphs: ['Our girls hostel is equipped with all modern facilities.'],
        highlights: ['Safe and secure environment', 'Modern amenities'],
        warden: { name: 'Mrs. Lakshmi', mobile: '+91 6374967303' }
      },
      defaultTab: 'boys',
      backgroundColor: 'rgb(251, 251, 238)',
      accentColor: '#0b6d41',
      textColor: '#000000'
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
          {
            name: 'warden',
            type: 'object',
            label: 'Hostel Warden',
            properties: [
              { name: 'name', type: 'string', label: 'Warden Name' },
              { name: 'mobile', type: 'string', label: 'Mobile Number' },
            ],
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
          {
            name: 'warden',
            type: 'object',
            label: 'Hostel Warden',
            properties: [
              { name: 'name', type: 'string', label: 'Warden Name' },
              { name: 'mobile', type: 'string', label: 'Mobile Number' },
            ],
          },
        ],
      },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  AuditoriumPage: {
    name: 'AuditoriumPage',
    displayName: 'Auditorium Page',
    category: 'content',
    description: 'Facility page for auditorium with hero image, description paragraphs, and features list',
    icon: 'Theater',
    previewImage: '/cms-previews/AuditoriumPage.png',
    component: AuditoriumPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Auditorium'),
      headerSubtitle: z.string().optional(),
      heroImage: z.string().default('/images/facilities/auditorium.jpg'),
      heroImageAlt: z.string().default('JKKN Auditorium'),
      showHeroImage: z.boolean().default(true),
      paragraphs: z.array(z.object({
        text: z.string(),
      })).default([]),
      showFeatures: z.boolean().default(true),
      featuresTitle: z.string().optional(),
      features: z.array(z.object({
        text: z.string(),
        icon: z.string().optional(),
      })).default([]),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Auditorium',
      headerSubtitle: 'A world-class venue for events and performances',
      heroImage: '/images/facilities/auditorium.jpg',
      heroImageAlt: 'JKKN Auditorium',
      showHeroImage: true,
      paragraphs: [
        {
          text: 'The JKKN auditorium is a spacious facility that can accommodate a large number of guests comfortably. The seating arrangement is well-designed to provide an uninterrupted view of the stage, and the acoustics are impeccable, ensuring that every note and word is heard clearly. The stage is equipped with the latest audio-visual technology, making it possible to host a wide range of events, including concerts, lectures, and theatrical performances.',
        },
        {
          text: 'In addition to its impressive features, the auditorium is designed with utmost attention to detail, making it a truly elegant space. The interior decor features a combination of modern and traditional elements that blend perfectly to create a warm and welcoming atmosphere. The lighting is also carefully selected to enhance the ambiance and mood of the event.',
        },
        {
          text: 'The JKKN auditorium is not just an impressive facility, but it is also a versatile one. It can be used for various purposes, including graduation ceremonies, workshops, and seminars, making it an essential resource for the institution. The auditorium is also well-maintained, ensuring that it remains in top condition at all times.',
        },
      ],
      showFeatures: true,
      featuresTitle: '',
      features: [
        { text: 'Spacious seating', icon: 'Users' },
        { text: 'High-tech sound and lighting systems', icon: 'Speaker' },
        { text: 'Stage equipment and props', icon: 'Theater' },
        { text: 'Excellent acoustics', icon: 'Volume2' },
        { text: 'Professional staff', icon: 'UserCheck' },
      ],
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['auditorium', 'facility', 'events', 'theater', 'stage', 'performances', 'venue', 'hall'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'heroImage', type: 'image', label: 'Hero Image URL' },
      { name: 'heroImageAlt', type: 'string', label: 'Hero Image Alt Text' },
      { name: 'showHeroImage', type: 'boolean', label: 'Show Hero Image' },
      {
        name: 'paragraphs',
        type: 'array',
        label: 'Content Paragraphs',
        itemType: 'object',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Paragraph Text', required: true },
          },
          required: ['text'],
        },
      },
      { name: 'showFeatures', type: 'boolean', label: 'Show Features List' },
      { name: 'featuresTitle', type: 'string', label: 'Features Section Title' },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        itemType: 'object',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Feature Text', required: true },
            icon: { type: 'string', label: 'Icon Name (Users, Speaker, Theater, Volume2, UserCheck, Sparkles, Award, Calendar, CheckCircle2)' },
          },
          required: ['text'],
        },
      },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  SeminarHallPage: {
    name: 'SeminarHallPage',
    displayName: 'Seminar Hall Page',
    category: 'content',
    description: 'Modern facility page for seminar hall with hero image, description, features, and stats',
    icon: 'Presentation',
    previewImage: '/cms-previews/SeminarHallPage.png',
    component: SeminarHallPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      badge: z.string().default('Premium Facility'),
      headerTitle: z.string().default('SEMINAR HALL'),
      headerSubtitle: z.string().optional(),
      heroImage: z.string().default('/images/facilities/seminar-hall.jpg'),
      heroImageAlt: z.string().default('JKKN Seminar Hall'),
      showHeroImage: z.boolean().default(true),
      introduction: z.string().default('Our seminar hall is designed to offer a comfortable and engaging learning environment to all attendees, with a generous seating capacity and modern amenities.'),
      additionalContent: z.string().optional(),
      paragraphs: z.array(z.object({
        text: z.string(),
      })).default([]),
      showFeatures: z.boolean().default(true),
      featuresTitle: z.string().default('Key Features'),
      features: z.array(z.object({
        text: z.string(),
        icon: z.string().optional(),
      })).default([]),
      showStats: z.boolean().default(true),
      stats: z.array(z.object({
        icon: z.string(),
        value: z.string(),
        label: z.string(),
      })).default([]),
      variant: z.enum(['modern-light', 'modern-dark']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      badge: 'Premium Facility',
      headerTitle: 'SEMINAR HALL',
      headerSubtitle: 'A modern space for learning and collaboration',
      heroImage: '/images/facilities/seminar-hall.jpg',
      heroImageAlt: 'JKKN Seminar Hall',
      showHeroImage: true,
      introduction: 'Our seminar hall is designed to offer a comfortable and engaging learning environment to all attendees, with a generous seating capacity and modern amenities.',
      additionalContent: '',
      paragraphs: [
        {
          text: 'Our seminar hall is designed to offer a comfortable and engaging learning environment to all attendees, with a generous seating capacity and modern amenities.',
        },
        {
          text: 'Fully air-conditioned and equipped with a stage, projector, sound system, and lighting equipment.',
        },
        {
          text: 'High-speed Wi-Fi and ample parking facilities.',
        },
        {
          text: 'Team of skilled technicians and support staff available.',
        },
      ],
      showFeatures: true,
      featuresTitle: 'Key Features',
      features: [
        { text: 'Spacious and well-lit', icon: 'Sun' },
        { text: 'Audio-visual equipment', icon: 'Projector' },
        { text: 'Internet connectivity', icon: 'Wifi' },
        { text: 'Comfortable seating', icon: 'Armchair' },
        { text: 'Air conditioning', icon: 'Wind' },
        { text: 'Hygiene standards', icon: 'ShieldCheck' },
      ],
      showStats: true,
      stats: [
        { icon: 'Users', value: '500+', label: 'Seating Capacity' },
        { icon: 'Calendar', value: '100+', label: 'Events Yearly' },
      ],
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['seminar', 'hall', 'facility', 'meeting', 'conference', 'presentation', 'events', 'venue'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'badge', type: 'string', label: 'Badge Text' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'heroImage', type: 'image', label: 'Hero Image URL' },
      { name: 'heroImageAlt', type: 'string', label: 'Hero Image Alt Text' },
      { name: 'showHeroImage', type: 'boolean', label: 'Show Hero Image' },
      { name: 'introduction', type: 'string', label: 'Introduction Text' },
      { name: 'additionalContent', type: 'string', label: 'Additional Content' },
      {
        name: 'paragraphs',
        type: 'array',
        label: 'Content Paragraphs',
        itemType: 'object',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Paragraph Text', required: true },
          },
          required: ['text'],
        },
      },
      { name: 'showFeatures', type: 'boolean', label: 'Show Features' },
      { name: 'featuresTitle', type: 'string', label: 'Features Section Title' },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        itemType: 'object',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Feature Text', required: true },
            icon: { type: 'string', label: 'Icon Name (Sun, Projector, Wifi, Armchair, Wind, ShieldCheck, Users, Calendar, CheckCircle2)' },
          },
          required: ['text'],
        },
      },
      { name: 'showStats', type: 'boolean', label: 'Show Stats Section' },
      {
        name: 'stats',
        type: 'array',
        label: 'Statistics',
        itemType: 'object',
        itemSchema: {
          properties: {
            icon: { type: 'string', label: 'Icon Name', required: true },
            value: { type: 'string', label: 'Stat Value', required: true },
            label: { type: 'string', label: 'Stat Label', required: true },
          },
          required: ['icon', 'value', 'label'],
        },
      },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-light', 'modern-dark'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  LibraryPage: {
    name: 'LibraryPage',
    displayName: 'Library Page',
    category: 'content',
    description: 'Facility page for library with resources, sections, services, and librarian contact information',
    icon: 'BookOpen',
    previewImage: '/cms-previews/LibraryPage.png',
    component: LibraryPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('LIBRARY'),
      headerSubtitle: z.string().default('LIBRARY AND INFORMATION RESOURCES CENTRE'),
      paragraphs: z.array(z.object({
        text: z.string(),
      })).default([]),
      timing: z.string().optional(),
      showResources: z.boolean().default(true),
      resourcesTitle: z.string().default('LIBRARY RESOURCES'),
      resources: z.array(z.object({
        label: z.string(),
        value: z.string(),
        icon: z.string().optional(),
      })).default([]),
      showSections: z.boolean().default(true),
      sectionsTitle: z.string().default('LIBRARY SECTIONS'),
      sections: z.array(z.object({
        title: z.string(),
        icon: z.string().optional(),
      })).default([]),
      showServices: z.boolean().default(true),
      servicesTitle: z.string().default('OTHER SERVICES'),
      services: z.array(z.object({
        title: z.string(),
        icon: z.string().optional(),
      })).default([]),
      showContact: z.boolean().default(true),
      contactTitle: z.string().default('CONTACT US'),
      librarian: z.object({
        name: z.string(),
        qualification: z.string(),
        phone: z.string(),
      }).optional(),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'LIBRARY',
      headerSubtitle: 'LIBRARY AND INFORMATION RESOURCES CENTRE',
      paragraphs: [
        {
          text: 'The library covers a wide range of subjects in Science, Humanities, Engineering, Management, Computer Applications, etc. The library is well equipped with infrastructure. With 175 seating capacity, 30 Mbps high-speed internet and CCTV surveillance are available. The library is automated using Koha software.',
        },
        {
          text: 'All the students and faculty can access online catalog, OPAC. The library uses barcode technology for its circulation and stock verification. The central collection represents a relatively small library. Special collection areas include Women\'s Studies, Total Quality Management, Competitive Exams etc., with special emphasis on local area studies.',
        },
        {
          text: 'JKKN library offers 6500 E-Journals through DELNET, E-GATE, NPTEL, NDL, SWAYAM, the online digital library. All books are covered with RFID tag. The library is open from 8:30 A.M. to 6:00 P.M. on all working days.',
        },
      ],
      timing: '8:30 A.M. to 6:00 P.M.',
      showResources: true,
      resourcesTitle: 'LIBRARY RESOURCES',
      resources: [
        { label: 'Volumes', value: '26,505', icon: 'BookOpen' },
        { label: 'Titles', value: '4,949', icon: 'BookMarked' },
        { label: 'Journals', value: '29', icon: 'Newspaper' },
        { label: 'E-Journals', value: '6,533', icon: 'Globe' },
        { label: 'Magazines', value: '25', icon: 'Newspaper' },
        { label: 'News Paper', value: '03', icon: 'Newspaper' },
        { label: 'Software', value: 'Koha', icon: 'Database' },
        { label: 'Internet Speed', value: '500 Mbps', icon: 'Wifi' },
        { label: 'E-Resources & Delnet', value: 'Available', icon: 'Globe' },
      ],
      showSections: true,
      sectionsTitle: 'LIBRARY SECTIONS',
      sections: [
        { title: 'Reference Books Section', icon: 'BookMarked' },
        { title: 'Circulation Section', icon: 'Library' },
        { title: 'Journals Section', icon: 'Newspaper' },
      ],
      showServices: true,
      servicesTitle: 'OTHER SERVICES',
      services: [
        { title: 'Reprographic Service', icon: 'Printer' },
        { title: 'Digital Library', icon: 'Monitor' },
      ],
      showContact: true,
      contactTitle: 'CONTACT US',
      librarian: {
        name: 'M. MUHAMMAD NAZAR',
        qualification: 'B.Sc., M.L.I.S., M.Phil.',
        phone: '9443472294',
      },
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['library', 'books', 'resources', 'journals', 'e-journals', 'facility', 'study', 'reading', 'digital library'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      {
        name: 'paragraphs',
        type: 'array',
        label: 'Introduction Paragraphs',
        itemType: 'object',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Paragraph Text', required: true },
          },
          required: ['text'],
        },
      },
      { name: 'timing', type: 'string', label: 'Operating Hours' },
      { name: 'showResources', type: 'boolean', label: 'Show Resources Section' },
      { name: 'resourcesTitle', type: 'string', label: 'Resources Section Title' },
      {
        name: 'resources',
        type: 'array',
        label: 'Library Resources',
        itemType: 'object',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Resource Label', required: true },
            value: { type: 'string', label: 'Resource Value', required: true },
            icon: { type: 'string', label: 'Icon Name (BookOpen, BookMarked, Newspaper, Globe, Database, Wifi, Library, etc.)' },
          },
          required: ['label', 'value'],
        },
      },
      { name: 'showSections', type: 'boolean', label: 'Show Library Sections' },
      { name: 'sectionsTitle', type: 'string', label: 'Sections Title' },
      {
        name: 'sections',
        type: 'array',
        label: 'Library Sections',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Section Title', required: true },
            icon: { type: 'string', label: 'Icon Name' },
          },
          required: ['title'],
        },
      },
      { name: 'showServices', type: 'boolean', label: 'Show Services Section' },
      { name: 'servicesTitle', type: 'string', label: 'Services Title' },
      {
        name: 'services',
        type: 'array',
        label: 'Library Services',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Service Title', required: true },
            icon: { type: 'string', label: 'Icon Name' },
          },
          required: ['title'],
        },
      },
      { name: 'showContact', type: 'boolean', label: 'Show Contact Section' },
      { name: 'contactTitle', type: 'string', label: 'Contact Section Title' },
      {
        name: 'librarian',
        type: 'object',
        label: 'Librarian Details',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Librarian Name', required: true },
            qualification: { type: 'string', label: 'Qualification', required: true },
            phone: { type: 'string', label: 'Phone Number', required: true },
          },
          required: ['name', 'qualification', 'phone'],
        },
      },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  DigitalClassroomPage: {
    name: 'DigitalClassroomPage',
    displayName: 'Digital Classroom Page',
    category: 'content',
    description: 'Facility page for digital classroom with hero image, description paragraphs, and technology features list',
    icon: 'Monitor',
    previewImage: '/cms-previews/DigitalClassroomPage.png',
    component: DigitalClassroomPage,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerTitle: z.string().default('Digital Class Room'),
      headerSubtitle: z.string().optional(),
      heroImage: z.string().default('/images/facilities/digital-classroom.jpg'),
      heroImageAlt: z.string().default('JKKN Digital Classroom'),
      showHeroImage: z.boolean().default(true),
      paragraphs: z.array(z.object({
        text: z.string(),
      })).default([]),
      showFeatures: z.boolean().default(true),
      featuresTitle: z.string().optional(),
      features: z.array(z.object({
        text: z.string(),
        icon: z.string().optional(),
      })).default([]),
      variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
      cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
      showDecorations: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerTitle: 'Digital Class Room',
      headerSubtitle: 'Modern learning spaces with cutting-edge technology',
      heroImage: '/images/facilities/digital-classroom.jpg',
      heroImageAlt: 'JKKN Digital Classroom',
      showHeroImage: true,
      paragraphs: [
        {
          text: 'JKKN Educational Institutions prioritizes exceptional classroom facilities as a crucial aspect of a great learning environment. Our classrooms are thoughtfully designed to offer a comfortable and engaging space for students to thrive and progress in their studies.',
        },
        {
          text: 'Our facilities boast cutting-edge technology, including high-speed internet, multimedia projectors, and interactive whiteboards, providing students with access to a vast array of information at their fingertips. We also ensure that our seating arrangements are comfortable and conducive to learning, eliminating distractions and disruptions.',
        },
        {
          text: 'With modern furnishings, proper ventilation, excellent lighting, and inspiring posters, our classrooms provide a warm and welcoming atmosphere that fosters a passion for learning.',
        },
      ],
      showFeatures: true,
      featuresTitle: '',
      features: [
        { text: 'Digital classrooms are equipped with the latest technology', icon: 'Monitor' },
        { text: 'Interactive whiteboards', icon: 'Presentation' },
        { text: 'High-speed internet', icon: 'Wifi' },
        { text: 'Multimedia resources', icon: 'Video' },
        { text: 'Collaboration tools', icon: 'Users' },
      ],
      variant: 'modern-light',
      cardStyle: 'glass',
      showDecorations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['digital', 'classroom', 'technology', 'smart', 'interactive', 'whiteboard', 'internet', 'multimedia', 'education'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerTitle', type: 'string', label: 'Header Title' },
      { name: 'headerSubtitle', type: 'string', label: 'Header Subtitle' },
      { name: 'heroImage', type: 'image', label: 'Hero Image URL' },
      { name: 'heroImageAlt', type: 'string', label: 'Hero Image Alt Text' },
      { name: 'showHeroImage', type: 'boolean', label: 'Show Hero Image' },
      {
        name: 'paragraphs',
        type: 'array',
        label: 'Content Paragraphs',
        itemType: 'object',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Paragraph Text', required: true },
          },
          required: ['text'],
        },
      },
      { name: 'showFeatures', type: 'boolean', label: 'Show Features List' },
      { name: 'featuresTitle', type: 'string', label: 'Features Section Title' },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        itemType: 'object',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Feature Text', required: true },
            icon: { type: 'string', label: 'Icon Name (Monitor, Wifi, Presentation, Video, Users, CheckCircle2, GraduationCap, Lightbulb, Laptop)' },
          },
          required: ['text'],
        },
      },
      { name: 'variant', type: 'enum', label: 'Color Scheme', options: ['modern-dark', 'modern-light'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glass', 'solid', 'gradient'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
    ],
  },

  TransportPage: {
    name: 'TransportPage',
    displayName: 'Transport Page',
    category: 'content',
    description: 'Specialized transport facility page with bus routes display - shows images, features, and available bus routes',
    icon: 'Bus',
    previewImage: '/cms-previews/TransportPage.png',
    component: TransportPage,
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
      routesTitle: z.string(),
      routes: z.array(z.object({
        name: z.string()
      })),
      conclusion: z.string().optional(),
      backgroundColor: z.string(),
      accentColor: z.string(),
      textColor: z.string()
    }),
    defaultProps: {
      facilityTitle: 'TRANSPORT',
      images: [
        { src: '/images/facilities/transport-1.jpg', alt: 'Transport Facility 1' },
        { src: '/images/facilities/transport-2.jpg', alt: 'Transport Facility 2' },
        { src: '/images/facilities/transport-3.jpg', alt: 'Transport Facility 3' }
      ],
      introduction: '<p>At JKKN, we prioritize the safety and convenience of our students by providing a comprehensive transportation network. Our fleet of well-maintained buses ensures reliable and comfortable travel for students commuting from various locations.</p>',
      features: [
        {
          title: 'Well-Maintained Fleet',
          description: '<p>Our modern fleet of buses undergoes regular maintenance and safety checks to ensure a smooth and secure journey for all students.</p>'
        },
        {
          title: 'Trained Drivers',
          description: '<p>Experienced and licensed drivers who are trained in defensive driving and student safety protocols operate all our buses.</p>'
        },
        {
          title: 'Extensive Coverage',
          description: '<p>We cover 19+ routes across Tamil Nadu, connecting students from various towns and cities to our campus.</p>'
        },
        {
          title: 'GPS Tracking',
          description: '<p>All buses are equipped with GPS tracking systems for real-time monitoring and enhanced safety measures.</p>'
        }
      ],
      routesTitle: 'Bus Routes Available',
      routes: [
        { name: 'Athani' },
        { name: 'Guruvarettyur' },
        { name: 'Poolampatti' },
        { name: 'Edappadi' },
        { name: 'Anthiyur' },
        { name: 'Konganapuram' },
        { name: 'Kolathur' },
        { name: 'Salem' },
        { name: 'Gobichettipalayam' },
        { name: 'Ganapathipalayam' },
        { name: 'Omalur' },
        { name: 'Chennampatti' },
        { name: 'Chithur' },
        { name: 'Nangavalli' },
        { name: 'Thirupur' },
        { name: 'Tiruchengode' },
        { name: 'Paalmadai' },
        { name: 'Erode' },
        { name: 'Elampillai' }
      ],
      conclusion: '<p>Our transportation service is designed to provide safe, affordable, and convenient travel for all students. With extensive route coverage and modern facilities, we ensure that every student can reach campus comfortably and on time.</p>',
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff'
    },
    supportsChildren: false,
    keywords: ['transport', 'bus', 'routes', 'facility', 'transportation', 'travel', 'commute'],
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
      { name: 'routesTitle', type: 'string', label: 'Routes Section Title', required: true },
      {
        name: 'routes',
        type: 'array',
        label: 'Bus Routes',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Route Name', required: true }
          },
          required: ['name'],
        },
      },
      { name: 'conclusion', type: 'string', multiline: true, label: 'Conclusion Paragraph' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },


  AmbulanceServicePage: {
    name: 'AmbulanceServicePage',
    displayName: 'Ambulance Service Page',
    category: 'content',
    description: 'Emergency ambulance services page with contact card and service details - shows emergency contact, features, and service information',
    icon: 'Ambulance',
    previewImage: '/cms-previews/AmbulanceServicePage.png',
    component: AmbulanceServicePage,
    propsSchema: z.object({
      facilityTitle: z.string(),
      contact: z.object({
        name: z.string(),
        designation: z.string().optional(),
        mobile: z.string(),
        alternateContact: z.string().optional(),
        email: z.string().optional(),
      }),
      images: z.array(z.object({
        src: z.string(),
        alt: z.string().optional()
      })),
      introduction: z.string(),
      features: z.array(z.object({
        title: z.string(),
        description: z.string()
      })),
      emergencyNote: z.string().optional(),
      conclusion: z.string().optional(),
      backgroundColor: z.string(),
      accentColor: z.string(),
      textColor: z.string()
    }),
    defaultProps: {
      facilityTitle: 'AMBULANCE SERVICES',
      contact: {
        name: 'Mr. Atchuthan',
        designation: 'Emergency Services Coordinator',
        mobile: '+91 9360987848',
      },
      images: [],
      introduction: `
        <p class="mb-4">
          JKKN Educational Institutions. we prioritize delivering top-notch education to our students, staff, and
          community members. As a testament to our commitment to the community, we take great pride in offering our
          own ambulance services. With round-the-clock availability, our ambulance service cater to emergency situations
          and medical transportation needs of individuals.
        </p>
        <p>
          Our ambulance services are run by a team of certified and well-trained emergency medical technicians who are
          capable of handling various types of medical emergencies. Equipped with state-of-the-art medical equipment
          and supplies, our ambulances ensure that our patients receive the best possible care.
        </p>
      `,
      features: [],
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff'
    },
    supportsChildren: false,
    keywords: ['ambulance', 'emergency', 'medical', 'facility', 'health', 'services', 'ems'],
    editableProps: [
      { name: 'facilityTitle', type: 'string', label: 'Facility Title', required: true },
      {
        name: 'contact',
        type: 'object',
        label: 'Emergency Contact',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Contact Name', required: true },
            designation: { type: 'string', label: 'Designation' },
            mobile: { type: 'string', label: 'Mobile Number', required: true },
            alternateContact: { type: 'string', label: 'Alternate Contact' },
            email: { type: 'string', label: 'Email Address' }
          },
          required: ['name', 'mobile'],
        },
      },
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
      { name: 'emergencyNote', type: 'string', multiline: true, label: 'Emergency Note' },
      { name: 'conclusion', type: 'string', multiline: true, label: 'Conclusion Paragraph' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  FoodCourtPage: {
    name: 'FoodCourtPage',
    displayName: 'Food Court Page',
    category: 'content',
    description: 'Specialized food court/canteen facility page with glassmorphism design - shows images, features, and highlights',
    icon: 'UtensilsCrossed',
    previewImage: '/cms-previews/FoodCourtPage.png',
    component: FoodCourtPage,
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
      highlightsTitle: z.string(),
      highlights: z.array(z.object({
        item: z.string()
      })),
      conclusion: z.string().optional(),
      backgroundColor: z.string(),
      accentColor: z.string(),
      textColor: z.string()
    }),
    defaultProps: {
      facilityTitle: 'FOOD COURT',
      images: [
        { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop', alt: 'Food Court Interior 1' },
        { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop', alt: 'Food Court Interior 2' },
        { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop', alt: 'Food Court Interior 3' }
      ],
      introduction: '<p>Our canteen offers more than just a mere food stop, as it serves as a social hub for students to unwind, catch up with peers, and recharge themselves before resuming their studies. With its cozy seating and inviting ambiance, the canteen provides a comfortable space for students to take a breather and replenish their energy.</p><p>Regarding the food options, you won\'t be disappointed with the wide array of choices available at our canteen. From crisp salads and appetizing sandwiches to substantial hot meals and snacks, we offer something to suit every palate. Our menu is thoughtfully crafted to accommodate diverse dietary needs and preferences, ensuring that everyone can find a delicious and fulfilling meal.</p>',
      features: [
        {
          title: 'Diverse Menu',
          description: '<p>Wide variety of cuisines and food options including South Indian, North Indian, Chinese, and Continental dishes to cater to all taste preferences.</p>'
        },
        {
          title: 'Quality Ingredients',
          description: '<p>Fresh, quality ingredients sourced from trusted suppliers ensure every meal is nutritious, tasty, and prepared with care.</p>'
        },
        {
          title: 'Healthy Options',
          description: '<p>Nutritious choices for health-conscious students including salads, fresh juices, and balanced meal options with proper nutritional value.</p>'
        },
        {
          title: 'Affordable Prices',
          description: '<p>Student-friendly pricing ensures that quality food is accessible to all, with special meal combos and discounts available.</p>'
        }
      ],
      highlightsTitle: 'Key Highlights',
      highlights: [
        { item: 'Diverse menu' },
        { item: 'Quality ingredients' },
        { item: 'Healthy options' },
        { item: 'Affordable prices' },
        { item: 'Hygiene and safety' }
      ],
      conclusion: '<p>Our food court is designed to be more than just a dining facility - it\'s a space where students can enjoy delicious, nutritious meals in a comfortable and hygienic environment. With strict quality standards and a focus on student satisfaction, we ensure that every dining experience is pleasant and fulfilling.</p>',
      backgroundColor: '#0b6d41',
      accentColor: '#ffde59',
      textColor: '#ffffff'
    },
    supportsChildren: false,
    keywords: ['food', 'court', 'canteen', 'cafeteria', 'dining', 'meal', 'restaurant', 'facility'],
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
      { name: 'highlightsTitle', type: 'string', label: 'Highlights Section Title', required: true },
      {
        name: 'highlights',
        type: 'array',
        label: 'Highlights',
        itemType: 'object',
        itemSchema: {
          properties: {
            item: { type: 'string', label: 'Highlight Item', required: true }
          },
          required: ['item'],
        },
      },
      { name: 'conclusion', type: 'string', multiline: true, label: 'Conclusion Paragraph' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'textColor', type: 'color', label: 'Text Color' },
    ],
  },

  SportsPage: {
    name: 'SportsPage',
    displayName: 'Sports Page',
    category: 'content',
    description: 'Modern sports facility page with light background, stats cards, outdoor/indoor games galleries, and feature cards',
    icon: 'Trophy',
    previewImage: '/cms-previews/SportsPage.png',
    component: SportsPage,
    propsSchema: z.object({
      facilityTitle: z.string(),
      subtitle: z.string(),
      introduction: z.string(),
      stats: z.array(z.object({
        value: z.string(),
        label: z.string(),
        icon: z.string().optional()
      })),
      outdoorGamesTitle: z.string(),
      outdoorGamesImages: z.array(z.object({
        src: z.string(),
        alt: z.string().optional()
      })),
      indoorGamesTitle: z.string(),
      indoorGamesImages: z.array(z.object({
        src: z.string(),
        alt: z.string().optional()
      })),
      featuresTitle: z.string(),
      features: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional()
      })),
      conclusion: z.string().optional(),
      primaryColor: z.string(),
      accentColor: z.string(),
      backgroundColor: z.string()
    }),
    defaultProps: {
      facilityTitle: 'SPORTS',
      subtitle: 'Fitness & Athletics Excellence',
      introduction: '<p>Welcome to the Sports Club Facility at JKKN Educational Institutions, where fitness and fun come together! Our top-notch facility is designed to cater to all your sporting and fitness needs. Here\'s why our Sports Club Facility stands out from the rest:</p>',
      stats: [
        { value: '10+', label: 'Sports Disciplines', icon: 'Trophy' },
        { value: '5000+', label: 'Sq.ft Sports Complex', icon: 'Target' },
        { value: '20+', label: 'Expert Coaches', icon: 'Users' }
      ],
      outdoorGamesTitle: 'Outdoor Games',
      outdoorGamesImages: [
        { src: '/images/facilities/sports-outdoor-1.jpg', alt: 'Outdoor Sports 1' },
        { src: '/images/facilities/sports-outdoor-2.jpg', alt: 'Outdoor Sports 2' },
        { src: '/images/facilities/sports-outdoor-3.jpg', alt: 'Outdoor Sports 3' }
      ],
      indoorGamesTitle: 'Indoor Games',
      indoorGamesImages: [
        { src: '/images/facilities/sports-indoor-1.jpg', alt: 'Indoor Sports 1' },
        { src: '/images/facilities/sports-indoor-2.jpg', alt: 'Indoor Sports 2' },
        { src: '/images/facilities/sports-indoor-3.jpg', alt: 'Indoor Sports 3' }
      ],
      featuresTitle: 'Why Choose Our Sports Facility?',
      features: [
        {
          title: 'World-class Facilities',
          description: '<p>State-of-the-art gym, swimming pool, basketball court, tennis court, and football field - all designed to meet international standards.</p>',
          icon: 'Award'
        },
        {
          title: 'Expert Instructors',
          description: '<p>Our certified and experienced trainers are dedicated to helping you achieve your fitness goals with personalized guidance and support.</p>',
          icon: 'Users'
        },
        {
          title: 'Cutting-edge Equipment',
          description: '<p>Access to the latest cardio machines, weight training equipment, and sports gear to enhance your training experience.</p>',
          icon: 'Dumbbell'
        },
        {
          title: 'Free Memberships',
          description: '<p>Complimentary access for all students, staff, and community members - because fitness should be accessible to everyone.</p>',
          icon: 'Heart'
        },
        {
          title: 'Community Spirit',
          description: '<p>Regular events, tournaments, and competitions that foster camaraderie and team spirit among participants.</p>',
          icon: 'Trophy'
        },
        {
          title: 'Holistic Development',
          description: '<p>Focus on physical fitness, mental wellness, and character building through sports and athletic activities.</p>',
          icon: 'Target'
        }
      ],
      conclusion: '<p>So why wait? Join the Sports Club Facility at JKKN Educational Institutions and experience the ultimate fitness and sporting experience. Whether you\'re a beginner or a seasoned pro, we\'ve got something for everyone. Come and join our vibrant community of sports enthusiasts today!</p>',
      primaryColor: '#0b6d41',
      accentColor: '#ffde59',
      backgroundColor: '#ffffff'
    },
    supportsChildren: false,
    keywords: ['sports', 'games', 'outdoor', 'indoor', 'facilities', 'athletics', 'gym', 'fitness', 'basketball', 'football', 'tennis', 'swimming'],
    editableProps: [
      { name: 'facilityTitle', type: 'string', label: 'Facility Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle', required: true },
      { name: 'introduction', type: 'string', multiline: true, label: 'Introduction Paragraph', required: true },
      {
        name: 'stats',
        type: 'array',
        label: 'Stats Cards',
        itemType: 'object',
        itemSchema: {
          properties: {
            value: { type: 'string', label: 'Stat Value', required: true },
            label: { type: 'string', label: 'Stat Label', required: true },
            icon: { type: 'enum', label: 'Icon', options: ['Trophy', 'Target', 'Users', 'Award', 'Dumbbell', 'Heart'] }
          },
          required: ['value', 'label'],
        },
      },
      { name: 'outdoorGamesTitle', type: 'string', label: 'Outdoor Games Section Title', required: true },
      {
        name: 'outdoorGamesImages',
        type: 'array',
        label: 'Outdoor Games Images',
        itemType: 'object',
        itemSchema: {
          properties: {
            src: { type: 'string', label: 'Image URL', required: true, format: 'image' },
            alt: { type: 'string', label: 'Alt Text' }
          },
          required: ['src'],
        },
      },
      { name: 'indoorGamesTitle', type: 'string', label: 'Indoor Games Section Title', required: true },
      {
        name: 'indoorGamesImages',
        type: 'array',
        label: 'Indoor Games Images',
        itemType: 'object',
        itemSchema: {
          properties: {
            src: { type: 'string', label: 'Image URL', required: true, format: 'image' },
            alt: { type: 'string', label: 'Alt Text' }
          },
          required: ['src'],
        },
      },
      { name: 'featuresTitle', type: 'string', label: 'Features Section Title', required: true },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Feature Title', required: true },
            description: { type: 'string', label: 'Feature Description', required: true },
            icon: { type: 'enum', label: 'Icon', options: ['Trophy', 'Target', 'Users', 'Award', 'Dumbbell', 'Heart'] }
          },
          required: ['title', 'description'],
        },
      },
      { name: 'conclusion', type: 'string', multiline: true, label: 'Conclusion Paragraph' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color (Header)' },
      { name: 'accentColor', type: 'color', label: 'Accent Color (Yellow)' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
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
        { id: 'allied', name: 'JKKN College of Allied Health Sciencess', courses: ['BPT', 'BMLT', 'B.Sc Radiology', 'B.Sc Cardiac Technology'] },
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

  EmbedBlock: {
    name: 'EmbedBlock',
    displayName: 'Embed Content',
    category: 'media',
    description: 'Embed external content: YouTube, Google Maps, Forms, or any iframe',
    icon: 'Code2',
    previewImage: '/cms-previews/EmbedBlock.png',
    component: EmbedBlock,
    propsSchema: EmbedBlockPropsSchema,
    defaultProps: {
      embedUrl: '',
      embedType: 'iframe',
      embedCode: '',
      aspectRatio: '16/9',
      allowFullscreen: true,
      autoHeight: false,
      minHeight: '600px',
      borderRadius: '8px',
      showBorder: false,
      title: 'Embedded content',
      fullWidth: false,
    },
    supportsChildren: false,
    keywords: ['embed', 'iframe', 'youtube', 'maps', 'form', 'external'],
    editableProps: [
      {
        name: 'embedType',
        type: 'enum',
        label: 'Embed Type',
        options: ['iframe', 'youtube', 'vimeo', 'google-maps', 'google-forms', 'google-drive', 'html'],
        description: 'Choose the type of content to embed'
      },
      {
        name: 'embedUrl',
        type: 'url',
        label: 'URL',
        description: 'Paste the URL of the content (YouTube, Maps, Forms, etc.)'
      },
      {
        name: 'embedCode',
        type: 'string',
        label: 'Embed Code (HTML)',
        description: 'Or paste embed code/HTML (only if Embed Type is "html")'
      },
      { name: 'title', type: 'string', label: 'Title', description: 'Accessibility title for screen readers' },
      { name: 'fullWidth', type: 'boolean', label: 'Full Width', description: 'Span the full viewport width (breaks out of page container)' },
      { name: 'aspectRatio', type: 'enum', label: 'Aspect Ratio', options: ['16/9', '4/3', '1/1', '21/9', '9/16'] },
      { name: 'autoHeight', type: 'boolean', label: 'Auto Height', description: 'Let content determine height' },
      { name: 'minHeight', type: 'string', label: 'Min Height', description: 'CSS value (e.g., 600px, 80vh)', placeholder: '600px' },
      { name: 'maxHeight', type: 'string', label: 'Max Height', description: 'CSS value (e.g., 800px)' },
      { name: 'allowFullscreen', type: 'boolean', label: 'Allow Fullscreen' },
      { name: 'showBorder', type: 'boolean', label: 'Show Border' },
      { name: 'borderRadius', type: 'string', label: 'Border Radius', description: 'CSS value (e.g., 8px, 1rem)' },
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

  SplitLayout: {
    name: 'SplitLayout',
    displayName: 'Split Layout (Content + Image)',
    category: 'layout',
    description: 'Two-column layout for content and media with automatic responsive stacking',
    icon: 'Columns2',
    previewImage: '/cms-previews/SplitLayout.png',
    component: SplitLayout,
    propsSchema: SplitLayoutPropsSchema,
    defaultProps: {
      proportion: '50-50',
      reverse: false,
      verticalAlign: 'center',
      gap: 8,
      stackOnMobile: true,
      mobileBreakpoint: 'md',
      padding: 0,
    },
    supportsChildren: true,
    isFullWidth: false,
    keywords: ['split', 'two-column', 'content-image', 'side-by-side', 'media-content'],
    editableProps: [
      {
        name: 'proportion',
        type: 'enum',
        label: 'Column Proportion',
        options: ['50-50', '40-60', '60-40', '33-67'],
        description: 'Width ratio between columns (content:media)',
        defaultValue: '50-50',
      },
      {
        name: 'reverse',
        type: 'boolean',
        label: 'Reverse Layout',
        description: 'Swap column positions (image on left)',
        defaultValue: false,
      },
      {
        name: 'verticalAlign',
        type: 'enum',
        label: 'Vertical Alignment',
        options: ['start', 'center', 'end', 'stretch'],
        description: 'How to align content vertically',
        defaultValue: 'center',
      },
      {
        name: 'gap',
        type: 'number',
        label: 'Gap Between Columns',
        min: 0,
        max: 16,
        step: 1,
        unit: '×4px',
        description: 'Spacing between columns (Tailwind scale)',
        defaultValue: 8,
      },
      {
        name: 'stackOnMobile',
        type: 'boolean',
        label: 'Stack on Mobile',
        description: 'Stack columns vertically on mobile devices',
        defaultValue: true,
      },
      {
        name: 'mobileBreakpoint',
        type: 'enum',
        label: 'Mobile Breakpoint',
        options: ['sm', 'md', 'lg'],
        description: 'Screen size for switching to desktop layout',
        defaultValue: 'md',
      },
      {
        name: 'background',
        type: 'color',
        label: 'Background Color',
        description: 'Background color for the entire split layout',
      },
      {
        name: 'padding',
        type: 'number',
        label: 'Padding',
        min: 0,
        max: 16,
        step: 1,
        unit: '×4px',
        description: 'Internal padding around columns',
        defaultValue: 0,
      },
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

  GridContainer: {
    name: 'GridContainer',
    displayName: 'Grid Container',
    category: 'layout',
    description: 'Responsive grid layout container for organizing child blocks in columns',
    icon: 'LayoutGrid',
    previewImage: '/cms-previews/GridContainer.png',
    component: GridContainer,
    propsSchema: GridContainerPropsSchema,
    defaultProps: {
      columns: 2,
      gap: '2rem',
      breakpoint: 'md',
    },
    supportsChildren: true,
    keywords: ['grid', 'columns', 'layout', 'responsive'],
    editableProps: [
      { name: 'columns', type: 'number', label: 'Columns', min: 1, max: 4, description: 'Number of columns in grid' },
      { name: 'gap', type: 'string', label: 'Gap', placeholder: '2rem', description: 'Space between grid items' },
      { name: 'breakpoint', type: 'enum', label: 'Responsive Breakpoint', options: ['sm', 'md', 'lg'], description: 'When to switch from single column to multi-column' },
    ],
  },

  ContentCard: {
    name: 'ContentCard',
    displayName: 'Content Card',
    category: 'layout',
    description: 'Professional card with icon header and HTML content - perfect for institutional pages',
    icon: 'FileText',
    previewImage: '/cms-previews/ContentCard.png',
    component: ContentCard,
    propsSchema: ContentCardPropsSchema,
    defaultProps: {
      title: 'Card Title',
      icon: 'BookOpen',
      iconColor: '#0b6d41',
      iconBackground: 'rgba(234, 241, 226, 0.5)',
      iconSize: 28,
      htmlContent: '<p>Add your content here...</p>',
      backgroundColor: '#ffffff',
    },
    supportsChildren: false,
    keywords: ['card', 'content', 'icon', 'professional', 'institutional'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true, description: 'Card heading' },
      { name: 'icon', type: 'string', label: 'Lucide Icon Name', placeholder: 'BookOpen', description: 'Icon name from Lucide library' },
      { name: 'iconColor', type: 'color', label: 'Icon Color' },
      { name: 'iconBackground', type: 'color', label: 'Icon Background' },
      { name: 'iconSize', type: 'number', label: 'Icon Size (px)', min: 16, max: 64 },
      { name: 'htmlContent', type: 'string', label: 'Content (HTML)', multiline: true, description: 'HTML content for card body' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
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

  OurCoursesSection: {
    name: 'OurCoursesSection',
    displayName: 'Our Courses',
    category: 'content',
    description: 'Display available courses with icons in compact card format',
    icon: 'GraduationCap',
    previewImage: '/cms-previews/OurCoursesSection.png',
    component: OurCoursesSection,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerPart1: z.string().default('OUR'),
      headerPart2: z.string().default('COURSES'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#0b6d41'),
      courses: z.array(z.object({
        name: z.string(),
        icon: z.string().default('GraduationCap'),
        link: z.string().optional(),
        description: z.string().optional(),
        headerColor: z.string().optional(),
      })).default([]),
      layout: z.enum(['grid', 'flex', 'carousel']).default('flex'),
      columns: z.enum(['2', '3', '4']).default('3'),
      variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light'),
      showDecorations: z.boolean().default(true),
      showAnimations: z.boolean().default(true),
      cardStyle: z.enum(['compact', 'detailed', 'icon-only']).default('compact'),
      showArrow: z.boolean().default(true),
    }),
    defaultProps: {
      showHeader: true,
      headerPart1: 'OUR',
      headerPart2: 'COURSES',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#0b6d41',
      courses: [
        { name: 'BACHELOR OF PHARMACY', icon: 'GraduationCap', link: '/courses/b-pharm' },
        { name: 'MASTER OF PHARMACY (5 SPECIALIZATION)', icon: 'Award', link: '/courses/m-pharm' },
        { name: 'PHARM.D (POST-BACCALAUREATE)', icon: 'FlaskConical', link: '/courses/pharm-d' },
      ],
      layout: 'flex',
      columns: '3',
      variant: 'modern-light',
      showDecorations: true,
      showAnimations: true,
      cardStyle: 'compact',
      showArrow: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['courses', 'programs', 'academic', 'pharmacy', 'degrees', 'education'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      {
        name: 'courses',
        type: 'array',
        label: 'Courses',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Course Name', required: true },
            icon: { type: 'string', label: 'Icon (Lucide)' },
            link: { type: 'string', label: 'Link URL' },
            description: { type: 'string', label: 'Description' },
            headerColor: { type: 'string', label: 'Accent Color' },
          },
          required: ['name'],
        },
      },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['grid', 'flex', 'carousel'] },
      { name: 'columns', type: 'enum', label: 'Columns (Grid)', options: ['2', '3', '4'] },
      { name: 'variant', type: 'enum', label: 'Style Variant', options: ['modern-dark', 'modern-light', 'classic'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations' },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['compact', 'detailed', 'icon-only'] },
      { name: 'showArrow', type: 'boolean', label: 'Show Arrow' },
    ],
  },

  AdmissionZoneSection: {
    name: 'AdmissionZoneSection',
    displayName: 'Admission Zone',
    category: 'content',
    description: 'Display admission requirements and eligibility criteria with bullet points',
    icon: 'ClipboardCheck',
    previewImage: '/cms-previews/AdmissionZoneSection.png',
    component: AdmissionZoneSection,
    propsSchema: z.object({
      showHeader: z.boolean().default(true),
      headerPart1: z.string().default('ADMISSION ZONE'),
      headerPart2: z.string().default('2025-2026'),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#D4AF37'),
      bulletPoints: z.array(z.string()).default([]),
      introText: z.string().optional(),
      showCTA: z.boolean().default(true),
      ctaText: z.string().default('Apply Now'),
      ctaLink: z.string().default('/admissions/apply'),
      variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light'),
      showIcon: z.boolean().default(true),
      showDecorations: z.boolean().default(true),
      showAnimations: z.boolean().default(true),
      bulletStyle: z.enum(['check', 'arrow', 'dot', 'number']).default('check'),
      bulletColor: z.string().default('#0b6d41'),
    }),
    defaultProps: {
      showHeader: true,
      headerPart1: 'ADMISSION ZONE',
      headerPart2: '2025-2026',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#D4AF37',
      bulletPoints: [
        'JKKN college of Pharmacy offers Bachelor of Pharmacy (B.Pharm) and Master of Pharmacy (M.Pharm) programs in various specializations.',
        'For M.Pharm programs, candidates must have completed a B.Pharm degree with a minimum percentage of marks.',
        'Bachelor of Pharmacy (Lateral Entry): Candidates must have completed a diploma in pharmacy program from a recognized board or institution with a minimum of 45% marks.',
        'Pharm.D - Eligibility for admission requires completion of 10+2 or equivalent with a minimum percentage of marks in science subjects.',
      ],
      showCTA: true,
      ctaText: 'Apply Now',
      ctaLink: '/admissions/apply',
      variant: 'modern-light',
      showIcon: true,
      showDecorations: true,
      showAnimations: true,
      bulletStyle: 'check',
      bulletColor: '#0b6d41',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['admission', 'eligibility', 'requirements', 'apply', 'enrollment', 'criteria'],
    editableProps: [
      { name: 'showHeader', type: 'boolean', label: 'Show Header' },
      { name: 'headerPart1', type: 'string', label: 'Header Part 1' },
      { name: 'headerPart2', type: 'string', label: 'Header Part 2 (Year)' },
      { name: 'headerPart1Color', type: 'color', label: 'Header Part 1 Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Header Part 2 Color' },
      { name: 'introText', type: 'string', label: 'Intro Text', multiline: true },
      {
        name: 'bulletPoints',
        type: 'array',
        label: 'Admission Requirements',
        itemType: 'string',
        description: 'List of admission criteria/requirements',
      },
      { name: 'showCTA', type: 'boolean', label: 'Show CTA Button' },
      { name: 'ctaText', type: 'string', label: 'CTA Button Text' },
      { name: 'ctaLink', type: 'url', label: 'CTA Button Link' },
      { name: 'variant', type: 'enum', label: 'Style Variant', options: ['modern-dark', 'modern-light', 'classic'] },
      { name: 'showIcon', type: 'boolean', label: 'Show Header Icon' },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations' },
      { name: 'bulletStyle', type: 'enum', label: 'Bullet Style', options: ['check', 'arrow', 'dot', 'number'] },
      { name: 'bulletColor', type: 'color', label: 'Bullet Color' },
    ],
  },

  ContactInfoSection: {
    name: 'ContactInfoSection',
    displayName: 'Contact Info Section',
    category: 'content',
    description: 'Compact contact section with phone, email, address cards and embedded map - perfect for homepage use',
    icon: 'Phone',
    previewImage: '/cms-previews/ContactInfoSection.png',
    component: ContactInfoSection,
    propsSchema: z.object({
      title: z.string().default('Contact Us'),
      subtitle: z.string().optional(),
      headerPart1Color: z.string().default('#0b6d41'),
      headerPart2Color: z.string().default('#D4AF37'),
      phone: z.string().default('+91 93458 55001'),
      email: z.string().default('info@jkkn.ac.in'),
      address: z.string().default('Natarajapuram, NH-544, Kumarapalayam, Namakkal, Tamil Nadu - 638183'),
      workingHours: z.string().optional(),
      showMap: z.boolean().default(true),
      mapEmbedUrl: z.string().default('https://www.google.com/maps?q=JKKN+Educational+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed'),
      variant: z.enum(['modern-light', 'modern-dark', 'cream']).default('modern-light'),
      cardStyle: z.enum(['glassmorphic', 'solid', 'minimal']).default('glassmorphic'),
      showDecorations: z.boolean().default(true),
      layout: z.enum(['horizontal', 'vertical']).default('horizontal'),
    }),
    defaultProps: {
      title: 'Contact Us',
      subtitle: 'Get in touch with us for any inquiries about admissions or programs.',
      headerPart1Color: '#0b6d41',
      headerPart2Color: '#D4AF37',
      phone: '+91 93458 55001',
      email: 'info@jkkn.ac.in',
      address: 'Natarajapuram, NH-544, Kumarapalayam, Namakkal, Tamil Nadu - 638183',
      showMap: true,
      mapEmbedUrl: 'https://www.google.com/maps?q=JKKN+Educational+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed',
      variant: 'modern-light',
      cardStyle: 'glassmorphic',
      showDecorations: true,
      layout: 'horizontal',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['contact', 'phone', 'email', 'address', 'map', 'location', 'reach us'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Section Title' },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'headerPart1Color', type: 'color', label: 'Primary Color' },
      { name: 'headerPart2Color', type: 'color', label: 'Accent Color' },
      { name: 'phone', type: 'string', label: 'Phone Number' },
      { name: 'email', type: 'string', label: 'Email Address' },
      { name: 'address', type: 'string', label: 'Address', multiline: true },
      { name: 'workingHours', type: 'string', label: 'Working Hours' },
      { name: 'showMap', type: 'boolean', label: 'Show Map' },
      { name: 'mapEmbedUrl', type: 'url', label: 'Google Maps Embed URL' },
      { name: 'variant', type: 'enum', label: 'Style Variant', options: ['modern-light', 'modern-dark', 'cream'] },
      { name: 'cardStyle', type: 'enum', label: 'Card Style', options: ['glassmorphic', 'solid', 'minimal'] },
      { name: 'showDecorations', type: 'boolean', label: 'Show Decorations' },
      { name: 'layout', type: 'enum', label: 'Layout', options: ['horizontal', 'vertical'] },
    ],
  },

  ApprovalsAffiliationSection: {
    name: 'ApprovalsAffiliationSection',
    displayName: 'Approvals & Affiliation Section',
    category: 'content',
    description: 'Simple approvals and affiliation page with section headers and green PDF buttons - ideal for AICTE EOA, Anna University Affiliation, RTI Act documents',
    icon: 'FileCheck2',
    previewImage: '/cms-previews/ApprovalsAffiliationSection.png',
    component: ApprovalsAffiliationSection,
    propsSchema: z.object({
      pageTitle: z.string().default('APPROVALS AND AFFILIATION'),
      breadcrumbLabel: z.string().default('APPROVALS AND AFFILIATION'),
      showBreadcrumb: z.boolean().default(true),
      homeUrl: z.string().default('/'),
      sections: z.array(z.object({
        id: z.string(),
        title: z.string(),
        documents: z.array(z.object({
          id: z.string(),
          buttonLabel: z.string(),
          pdfUrl: z.string(),
        })),
      })).default([]),
      buttonStyle: z.enum(['solid', 'gradient']).default('gradient'),
      pdfOpenMode: z.enum(['same-tab', 'new-tab']).default('same-tab'),
      variant: z.enum(['light', 'cream']).default('cream'),
    }),
    defaultProps: {
      pageTitle: 'APPROVALS AND AFFILIATION',
      breadcrumbLabel: 'APPROVALS AND AFFILIATION',
      showBreadcrumb: true,
      homeUrl: '/',
      sections: [
        {
          id: '1',
          title: 'AICTE Extension of Approval (EOA)',
          documents: [
            { id: '1-1', buttonLabel: 'AICTE EOA 2008-2023', pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_1/view' },
            { id: '1-2', buttonLabel: 'AICTE EOA 2024-2025', pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_2/view' },
          ],
        },
        {
          id: '2',
          title: 'Anna University Affiliation order 2008-2023',
          documents: [
            { id: '2-1', buttonLabel: 'Anna-University-Affiliation-order-2023-2024', pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_3/view' },
            { id: '2-2', buttonLabel: 'Anna-University-Affiliation-order-2008-2023', pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_4/view' },
          ],
        },
        {
          id: '3',
          title: 'Statutory Declaration under section 4(1)(b) of the RTI Act-2005',
          documents: [
            { id: '3-1', buttonLabel: 'Section 4(1)(b) of the RTI Act-2005', pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_5/view' },
          ],
        },
      ],
      buttonStyle: 'gradient',
      pdfOpenMode: 'same-tab',
      variant: 'cream',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['approvals', 'affiliation', 'aicte', 'eoa', 'anna university', 'rti', 'statutory', 'recognition', 'accreditation', 'documents', 'pdf'],
    editableProps: [
      { name: 'pageTitle', type: 'string', label: 'Page Title' },
      { name: 'breadcrumbLabel', type: 'string', label: 'Breadcrumb Label' },
      { name: 'showBreadcrumb', type: 'boolean', label: 'Show Breadcrumb' },
      { name: 'homeUrl', type: 'url', label: 'Home URL' },
      {
        name: 'sections',
        type: 'array',
        label: 'Sections',
        itemType: 'object',
        itemSchema: {
          properties: {
            id: { type: 'string', label: 'Section ID', required: true },
            title: { type: 'string', label: 'Section Title', required: true },
            documents: {
              type: 'array',
              label: 'Documents',
              itemType: 'object',
              itemSchema: {
                properties: {
                  id: { type: 'string', label: 'Document ID', required: true },
                  buttonLabel: { type: 'string', label: 'Button Label', required: true },
                  pdfUrl: { type: 'string', label: 'PDF URL', required: true },
                },
                required: ['id', 'buttonLabel', 'pdfUrl'],
              },
            },
          },
          required: ['id', 'title'],
        },
      },
      { name: 'buttonStyle', type: 'enum', label: 'Button Style', options: ['solid', 'gradient'] },
      { name: 'pdfOpenMode', type: 'enum', label: 'PDF Open Mode', options: ['same-tab', 'new-tab'] },
      { name: 'variant', type: 'enum', label: 'Background Style', options: ['light', 'cream'] },
    ],
  },

  // ==========================================
  // Engineering-Specific Blocks
  // ==========================================

  EngineeringCenturySection: {
    name: 'EngineeringCenturySection',
    displayName: 'Engineering Century Section',
    category: 'content',
    description: 'Century of excellence section with large year badge and feature grid - designed for engineering homepage',
    icon: 'Award',
    component: EngineeringCenturySection,
    propsSchema: z.object({
      yearsBadge: z.string().default('100'),
      badgeSubtext: z.string().default('YEARS'),
      title: z.string().default('A Century of Excellence in Progressive Technical Education'),
      subtitle: z.string().default('Building future-ready engineers with world-class infrastructure'),
      features: z.array(z.object({
        icon: z.string(),
        label: z.string(),
      })).default([]),
      primaryColor: z.string().default('#1e3a5f'),
      accentColor: z.string().default('#f97316'),
      backgroundColor: z.string().default('#f9fafb'),
      showAnimations: z.boolean().default(true),
      paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
    }),
    defaultProps: {
      yearsBadge: '100',
      badgeSubtext: 'YEARS',
      title: 'A Century of Excellence in Progressive Technical Education',
      subtitle: 'Building future-ready engineers with world-class infrastructure and industry partnerships',
      features: [
        { icon: 'award', label: 'AICTE Approved' },
        { icon: 'star', label: 'NBA Accredited' },
        { icon: 'award', label: 'NAAC Accredited' },
        { icon: 'building', label: 'Autonomous Status' },
        { icon: 'handshake', label: 'Industry Partnerships' },
        { icon: 'microscope', label: 'Research Excellence' },
      ],
      primaryColor: '#1e3a5f',
      accentColor: '#f97316',
      backgroundColor: '#f9fafb',
      showAnimations: true,
      paddingY: 'lg',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['engineering', 'century', 'excellence', 'badge', 'features', 'accreditation', 'aicte', 'nba', 'naac'],
    editableProps: [
      { name: 'yearsBadge', type: 'string', label: 'Years Badge' },
      { name: 'badgeSubtext', type: 'string', label: 'Badge Subtext' },
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle', multiline: true },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'] },
    ],
  },

  EngineeringProgramsSection: {
    name: 'EngineeringProgramsSection',
    displayName: 'Engineering Programs Section',
    category: 'content',
    description: 'Tabbed programs grid with UG/PG filtering - designed for engineering courses showcase',
    icon: 'GraduationCap',
    component: EngineeringProgramsSection,
    propsSchema: z.object({
      title: z.string().default('Comprehensive Engineering & Technology Programs'),
      subtitle: z.string().default('Choose from our wide range of AICTE approved programs'),
      programs: z.array(z.object({
        name: z.string(),
        type: z.enum(['ug', 'pg']),
        duration: z.string(),
        icon: z.string(),
        description: z.string(),
        link: z.string(),
      })).default([]),
      showTabs: z.boolean().default(true),
      primaryColor: z.string().default('#1e3a5f'),
      accentColor: z.string().default('#f97316'),
      backgroundColor: z.string().default('#ffffff'),
      showAnimations: z.boolean().default(true),
      paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
    }),
    defaultProps: {
      title: 'Comprehensive Engineering & Technology Programs',
      subtitle: 'Choose from our wide range of AICTE approved programs',
      programs: [
        { name: 'B.E. Computer Science & Engineering', type: 'ug', duration: '4 Years', icon: 'code', description: 'AI, Machine Learning, Full Stack Development', link: '/courses/cse' },
        { name: 'B.E. Electronics & Communication', type: 'ug', duration: '4 Years', icon: 'cpu', description: 'Embedded Systems, IoT, VLSI Design', link: '/courses/ece' },
        { name: 'B.E. Electrical & Electronics', type: 'ug', duration: '4 Years', icon: 'zap', description: 'Power Systems, Renewable Energy', link: '/courses/eee' },
        { name: 'B.E. Mechanical Engineering', type: 'ug', duration: '4 Years', icon: 'settings', description: 'Robotics, CAD/CAM, Automation', link: '/courses/mech' },
        { name: 'B.Tech Information Technology', type: 'ug', duration: '4 Years', icon: 'wifi', description: 'Cloud Computing, Cybersecurity, DevOps', link: '/courses/it' },
        { name: 'B.E. Biomedical Engineering', type: 'ug', duration: '4 Years', icon: 'activity', description: 'Healthcare Tech, Medical Instrumentation', link: '/courses/biomedical' },
        { name: 'MBA - Business Administration', type: 'pg', duration: '2 Years', icon: 'briefcase', description: 'Business Analytics, Marketing, Finance', link: '/courses/mba' },
      ],
      showTabs: true,
      primaryColor: '#1e3a5f',
      accentColor: '#f97316',
      backgroundColor: '#ffffff',
      showAnimations: true,
      paddingY: 'lg',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['engineering', 'programs', 'courses', 'ug', 'pg', 'btech', 'mba', 'tabs', 'filter'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'showTabs', type: 'boolean', label: 'Show Filter Tabs' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'] },
    ],
  },

  EngineeringPlacementsSection: {
    name: 'EngineeringPlacementsSection',
    displayName: 'Engineering Placements Section',
    category: 'content',
    description: 'Placement statistics with animated counters and company logo marquee',
    icon: 'Briefcase',
    component: EngineeringPlacementsSection,
    propsSchema: z.object({
      title: z.string().default('Launching Careers, Building Futures'),
      subtitle: z.string().default('Our placement cell works tirelessly to connect students with top companies'),
      stats: z.array(z.object({
        value: z.number(),
        suffix: z.string(),
        prefix: z.string(),
        label: z.string(),
        icon: z.string(),
      })).default([]),
      companies: z.array(z.object({
        name: z.string(),
        logo: z.string(),
        category: z.string(),
      })).default([]),
      showCategoryTabs: z.boolean().default(true),
      marqueeSpeed: z.number().default(30),
      showGrayscale: z.boolean().default(true),
      primaryColor: z.string().default('#1e3a5f'),
      accentColor: z.string().default('#f97316'),
      backgroundColor: z.string().default('#f9fafb'),
      showAnimations: z.boolean().default(true),
      paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
    }),
    defaultProps: {
      title: 'Launching Careers, Building Futures',
      subtitle: 'Our placement cell works tirelessly to connect students with top companies',
      stats: [
        { value: 95, suffix: '%+', prefix: '', label: 'Placement Rate', icon: 'trending' },
        { value: 12, suffix: ' LPA', prefix: '', label: 'Highest Package', icon: 'award' },
        { value: 4.8, suffix: ' LPA', prefix: '', label: 'Average Package', icon: 'users' },
        { value: 200, suffix: '+', prefix: '', label: 'Recruiting Companies', icon: 'building' },
      ],
      companies: [],
      showCategoryTabs: true,
      marqueeSpeed: 30,
      showGrayscale: true,
      primaryColor: '#1e3a5f',
      accentColor: '#f97316',
      backgroundColor: '#f9fafb',
      showAnimations: true,
      paddingY: 'lg',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['engineering', 'placements', 'careers', 'companies', 'stats', 'recruiters', 'package', 'salary'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'showCategoryTabs', type: 'boolean', label: 'Show Category Tabs' },
      { name: 'marqueeSpeed', type: 'number', label: 'Marquee Speed', min: 10, max: 100 },
      { name: 'showGrayscale', type: 'boolean', label: 'Grayscale Logos' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'] },
    ],
  },

  EngineeringAdmissionSection: {
    name: 'EngineeringAdmissionSection',
    displayName: 'Engineering Admission Section',
    category: 'content',
    description: 'Two-column admission section with eligibility criteria and process steps',
    icon: 'ClipboardList',
    component: EngineeringAdmissionSection,
    propsSchema: z.object({
      title: z.string().default('Begin Your Engineering Journey at JKKN'),
      subtitle: z.string().default('Simple admission process with transparent eligibility criteria'),
      eligibility: z.array(z.object({
        program: z.string(),
        criteria: z.array(z.string()),
      })).default([]),
      processSteps: z.array(z.object({
        step: z.number(),
        title: z.string(),
        description: z.string().optional(),
        icon: z.string(),
      })).default([]),
      ctaButton: z.object({
        label: z.string(),
        link: z.string(),
      }).default({ label: 'Apply Now', link: '/admissions/apply' }),
      secondaryCtaButton: z.object({
        label: z.string(),
        link: z.string(),
      }).optional(),
      primaryColor: z.string().default('#1e3a5f'),
      accentColor: z.string().default('#f97316'),
      backgroundColor: z.string().default('#ffffff'),
      showAnimations: z.boolean().default(true),
      paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
    }),
    defaultProps: {
      title: 'Begin Your Engineering Journey at JKKN',
      subtitle: 'Simple admission process with transparent eligibility criteria',
      eligibility: [
        {
          program: 'B.E. / B.Tech Programs',
          criteria: [
            'Passed 10+2 with Physics, Chemistry, and Mathematics',
            'Minimum 45% aggregate marks (40% for reserved categories)',
            'Valid TNEA counselling rank or direct admission',
          ],
        },
        {
          program: 'MBA Program',
          criteria: [
            'Bachelor\'s degree in any discipline with 50% marks',
            'Valid TANCET / CAT / MAT / XAT score',
            'Group discussion and personal interview clearance',
          ],
        },
      ],
      processSteps: [
        { step: 1, title: 'Online Application', description: 'Fill out the online application form', icon: 'file' },
        { step: 2, title: 'Document Submission', description: 'Upload required documents', icon: 'clipboard' },
        { step: 3, title: 'Counselling', description: 'Attend TNEA counselling or direct admission', icon: 'user' },
        { step: 4, title: 'Fee Payment', description: 'Pay admission fees', icon: 'graduation' },
        { step: 5, title: 'Enrollment', description: 'Complete registration', icon: 'badge' },
      ],
      ctaButton: { label: 'Apply Now', link: '/admissions/apply' },
      primaryColor: '#1e3a5f',
      accentColor: '#f97316',
      backgroundColor: '#ffffff',
      showAnimations: true,
      paddingY: 'lg',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['engineering', 'admission', 'eligibility', 'process', 'apply', 'criteria', 'tnea', 'counselling'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color' },
      { name: 'accentColor', type: 'color', label: 'Accent Color' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color' },
      { name: 'showAnimations', type: 'boolean', label: 'Show Animations' },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'] },
    ],
  },

  EngineeringHeroSection: {
    name: 'EngineeringHeroSection',
    displayName: 'Engineering Hero Section',
    category: 'content',
    description: 'Modern engineering college hero section with animated stats and JKKN green gradient',
    icon: 'GraduationCap',
    component: EngineeringHeroSection,
    propsSchema: EngineeringHeroSectionPropsSchema,
    defaultProps: {
      title: 'Shape Your Future in Engineering & Technology',
      subtitle: 'AICTE Approved | Anna University Affiliated | NBA Accredited',
      description: 'Join one of the leading engineering colleges with 100+ years of educational excellence. World-class faculty, state-of-the-art infrastructure, and 95%+ placement record.',
      badge: 'AICTE Approved | Anna University Affiliated | NBA Accredited',
      stats: [
        { value: 3000, suffix: '+', label: 'Learners', icon: 'graduation' },
        { value: 95, suffix: '%', label: 'Placement', icon: 'trending' },
        { value: 50, suffix: '+', label: 'Recruiters', icon: 'building' },
        { value: 12, suffix: '+', label: 'Programs', icon: 'users' },
      ],
      primaryCta: { label: 'Apply Now', link: '/admissions' },
      secondaryCta: { label: 'Explore Programs', link: '/courses' },
      heroImage: '/images/engineering/campus-hero.jpg',
      primaryColor: '#0b6d41',
      accentColor: '#ffde59',
      showAnimations: true,
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['engineering', 'hero', 'stats', 'banner', 'homepage'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Main Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      { name: 'badge', type: 'string', label: 'Badge Text' },
      {
        name: 'stats',
        type: 'array',
        label: 'Statistics',
        description: 'Animated counter statistics',
        itemType: 'object',
        itemSchema: {
          properties: {
            value: { type: 'number', label: 'Value', required: true },
            suffix: { type: 'string', label: 'Suffix', placeholder: '+, %, etc.', defaultValue: '+' },
            label: { type: 'string', label: 'Label', required: true },
            icon: {
              type: 'enum',
              label: 'Icon',
              options: ['graduation', 'trending', 'building', 'users'],
              defaultValue: 'graduation'
            }
          }
        }
      },
      {
        name: 'primaryCta',
        type: 'object',
        label: 'Primary CTA Button',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Button Text', required: true, defaultValue: 'Apply Now' },
            link: { type: 'url', label: 'Button Link', required: true, defaultValue: '/admissions' }
          }
        }
      },
      {
        name: 'secondaryCta',
        type: 'object',
        label: 'Secondary CTA Button',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Button Text', defaultValue: 'Explore Programs' },
            link: { type: 'url', label: 'Button Link', defaultValue: '/courses' }
          }
        }
      },
      { name: 'heroImage', type: 'image', label: 'Hero Image', description: 'Main visual (4:3 aspect ratio)' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color', defaultValue: '#0b6d41' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', defaultValue: '#ffde59' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations', defaultValue: true }
    ],
  },

  EngineeringAccreditationsBar: {
    name: 'EngineeringAccreditationsBar',
    displayName: 'Engineering Accreditations Bar',
    category: 'content',
    description: 'Horizontal bar displaying accreditations and approvals',
    icon: 'Award',
    component: EngineeringAccreditationsBar,
    propsSchema: EngineeringAccreditationsBarPropsSchema,
    defaultProps: {
      label: 'Recognized & Approved By',
      accreditations: [
        { name: 'All India Council for Technical Education', shortName: 'AICTE', description: 'Approved', icon: 'shield' },
        { name: 'Anna University', shortName: 'Anna University', description: 'Affiliated', icon: 'graduation' },
        { name: 'National Board of Accreditation', shortName: 'NBA', description: 'Accredited', icon: 'award' },
        { name: 'National Assessment and Accreditation Council', shortName: 'NAAC', description: 'A+ Grade', icon: 'badge' },
        { name: 'International Organization for Standardization', shortName: 'ISO 9001:2015', description: 'Certified', icon: 'building' },
      ],
      primaryColor: '#0b6d41',
      backgroundColor: '#f8f9fa',
      showAnimations: true,
      paddingY: 'md',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['accreditation', 'aicte', 'nba', 'naac', 'approvals'],
    editableProps: [
      { name: 'label', type: 'string', label: 'Label', required: true },
      {
        name: 'accreditations',
        type: 'array',
        label: 'Accreditations',
        description: 'List of accreditations and approvals',
        itemType: 'object',
        itemSchema: {
          properties: {
            name: { type: 'string', label: 'Full Name', required: true },
            shortName: { type: 'string', label: 'Short Name', required: true },
            description: { type: 'string', label: 'Description' },
            logo: { type: 'image', label: 'Logo (optional)' },
            icon: {
              type: 'enum',
              label: 'Icon',
              options: ['award', 'shield', 'graduation', 'building', 'badge'],
              defaultValue: 'award'
            }
          }
        }
      },
      { name: 'primaryColor', type: 'color', label: 'Primary Color', defaultValue: '#0b6d41' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color', defaultValue: '#f8f9fa' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations', defaultValue: true },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    ],
  },

  EngineeringAboutSection: {
    name: 'EngineeringAboutSection',
    displayName: 'Engineering About Section',
    category: 'content',
    description: 'About section with image, features, and 100 Years Legacy badge',
    icon: 'Info',
    component: EngineeringAboutSection,
    propsSchema: EngineeringAboutSectionPropsSchema,
    defaultProps: {
      badge: { text: '100 Years Legacy', position: 'top-left' },
      title: 'Welcome to JKKN College of Engineering',
      subtitle: 'About Us',
      description: 'Established as part of the prestigious JKKN Educational Institutions with over 100 years of legacy, JKKN College of Engineering is committed to producing industry-ready engineers through quality education, practical training, and holistic development.',
      features: [
        'AICTE Approved & Anna University Affiliated',
        'NBA Accredited Programs',
        'Industry-Academia Partnerships',
        'State-of-the-Art Laboratories',
        '95%+ Placement Record',
        'Experienced Faculty Members',
      ],
      image: '/images/engineering/about-campus.jpg',
      imageAlt: 'JKKN Engineering College Campus',
      cta: { label: 'Learn More About Us', link: '/about' },
      primaryColor: '#0b6d41',
      accentColor: '#ffde59',
      backgroundColor: '#ffffff',
      showAnimations: true,
      paddingY: 'lg',
      imagePosition: 'left',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['about', 'features', 'legacy', 'history'],
    editableProps: [
      {
        name: 'badge',
        type: 'object',
        label: 'Legacy Badge',
        itemSchema: {
          properties: {
            text: { type: 'string', label: 'Badge Text', required: true, defaultValue: '100 Years Legacy' },
            position: {
              type: 'enum',
              label: 'Badge Position',
              options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
              defaultValue: 'top-left'
            }
          }
        }
      },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'description', type: 'string', label: 'Description', multiline: true },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        description: 'List of key features',
        itemType: 'string'
      },
      { name: 'image', type: 'image', label: 'Image' },
      { name: 'imageAlt', type: 'string', label: 'Image Alt Text' },
      {
        name: 'cta',
        type: 'object',
        label: 'Call to Action',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Button Text', defaultValue: 'Learn More About Us' },
            link: { type: 'url', label: 'Button Link', defaultValue: '/about' }
          }
        }
      },
      { name: 'imagePosition', type: 'enum', label: 'Image Position', options: ['left', 'right'], defaultValue: 'left' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color', defaultValue: '#0b6d41' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', defaultValue: '#ffde59' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color', defaultValue: '#ffffff' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations', defaultValue: true },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'], defaultValue: 'lg' },
    ],
  },

  EngineeringWhyChooseSection: {
    name: 'EngineeringWhyChooseSection',
    displayName: 'Engineering Why Choose Section',
    category: 'content',
    description: 'Feature cards grid explaining why choose the college',
    icon: 'CheckCircle',
    component: EngineeringWhyChooseSection,
    propsSchema: EngineeringWhyChooseSectionPropsSchema,
    defaultProps: {
      title: 'Why Choose JKKN Engineering College?',
      subtitle: 'Your Gateway to a Successful Engineering Career',
      features: [
        { title: '100 Years Legacy', description: 'Part of JKKN Educational Institutions with a century of excellence in education', icon: 'award' },
        { title: 'Industry Connect', description: 'Strong partnerships with leading IT and core industry companies', icon: 'building' },
        { title: 'Expert Learning Facilitators', description: 'Highly qualified faculty with industry experience and research background', icon: 'graduation' },
        { title: 'Modern Labs & Infrastructure', description: 'State-of-the-art laboratories equipped with latest technology', icon: 'flask' },
        { title: '95%+ Placements', description: 'Consistently high placement rate with top recruiters visiting campus', icon: 'trending' },
        { title: 'Innovation Hub', description: 'Dedicated centers for AI, ML, IoT, and emerging technologies', icon: 'lightbulb' },
        { title: 'Global Exposure', description: 'International collaborations and student exchange programs', icon: 'globe' },
        { title: 'Excellent Hostel Facilities', description: 'Separate hostels for boys and girls with modern amenities', icon: 'home' },
      ],
      primaryColor: '#0b6d41',
      accentColor: '#ffde59',
      backgroundColor: '#fbfbee',
      showAnimations: true,
      paddingY: 'lg',
      columns: '4',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['features', 'benefits', 'advantages', 'why choose'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'features',
        type: 'array',
        label: 'Features',
        description: 'List of reasons to choose the college',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Title', required: true },
            description: { type: 'string', label: 'Description', required: true },
            icon: {
              type: 'enum',
              label: 'Icon',
              options: ['award', 'building', 'graduation', 'flask', 'trending', 'lightbulb', 'globe', 'home'],
              defaultValue: 'award'
            }
          }
        }
      },
      { name: 'columns', type: 'enum', label: 'Grid Columns', options: ['2', '3', '4'], defaultValue: '4' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color', defaultValue: '#0b6d41' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', defaultValue: '#ffde59' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color', defaultValue: '#fbfbee' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations', defaultValue: true },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'], defaultValue: 'lg' },
    ],
  },

  EngineeringFacilitiesSection: {
    name: 'EngineeringFacilitiesSection',
    displayName: 'Engineering Facilities Section',
    category: 'content',
    description: 'Facilities grid showcasing campus infrastructure',
    icon: 'Building',
    component: EngineeringFacilitiesSection,
    propsSchema: EngineeringFacilitiesSectionPropsSchema,
    defaultProps: {
      title: 'World-Class Infrastructure & Facilities',
      subtitle: 'Everything you need for an exceptional learning experience',
      facilities: [
        { title: 'Computer Centers', description: 'Modern computer labs with high-performance systems', highlight: '500+ Systems', icon: 'monitor' },
        { title: 'Engineering Workshops', description: 'Hands-on training facilities for practical learning', icon: 'wrench' },
        { title: 'Research Labs', description: 'Specialized labs for advanced research', highlight: 'AI/ML, IoT, Robotics', icon: 'flask' },
        { title: 'Digital Library', description: 'Extensive collection of books and digital resources', highlight: '50,000+ Books', icon: 'book' },
        { title: 'Wi-Fi Campus', description: 'High-speed internet connectivity across the campus', icon: 'wifi' },
        { title: 'Hostels', description: 'Comfortable accommodation with all amenities', highlight: 'Men & Women', icon: 'home' },
        { title: 'Cafeteria', description: 'Hygienic food court with variety of cuisines', icon: 'utensils' },
        { title: 'Sports Complex', description: 'Indoor and outdoor sports facilities', icon: 'trophy' },
        { title: 'Transportation', description: 'Fleet of buses covering major routes', icon: 'bus' },
      ],
      cta: { label: 'Explore All Facilities', link: '/facilities' },
      primaryColor: '#0b6d41',
      accentColor: '#ffde59',
      backgroundColor: '#ffffff',
      showAnimations: true,
      paddingY: 'lg',
      columns: '3',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['facilities', 'infrastructure', 'labs', 'library', 'hostel'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'facilities',
        type: 'array',
        label: 'Facilities',
        description: 'List of campus facilities',
        itemType: 'object',
        itemSchema: {
          properties: {
            title: { type: 'string', label: 'Title', required: true },
            description: { type: 'string', label: 'Description', required: true },
            highlight: { type: 'string', label: 'Highlight (optional)' },
            icon: {
              type: 'enum',
              label: 'Icon',
              options: ['monitor', 'wrench', 'flask', 'book', 'wifi', 'home', 'utensils', 'trophy', 'bus'],
              defaultValue: 'monitor'
            },
            image: { type: 'image', label: 'Image (optional)' },
            link: { type: 'url', label: 'Link (optional)' }
          }
        }
      },
      {
        name: 'cta',
        type: 'object',
        label: 'Call to Action',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Button Text', defaultValue: 'Explore All Facilities' },
            link: { type: 'url', label: 'Button Link', defaultValue: '/facilities' }
          }
        }
      },
      { name: 'columns', type: 'enum', label: 'Grid Columns', options: ['2', '3'], defaultValue: '3' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color', defaultValue: '#0b6d41' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', defaultValue: '#ffde59' },
      { name: 'backgroundColor', type: 'color', label: 'Background Color', defaultValue: '#ffffff' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations', defaultValue: true },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'], defaultValue: 'lg' },
    ],
  },

  EngineeringCTASection: {
    name: 'EngineeringCTASection',
    displayName: 'Engineering CTA Section',
    category: 'content',
    description: 'Call-to-action footer section with Apply Now button',
    icon: 'PhoneCall',
    component: EngineeringCTASection,
    propsSchema: EngineeringCTASectionPropsSchema,
    defaultProps: {
      title: 'Ready to Engineer Your Future?',
      subtitle: 'Join JKKN College of Engineering and take the first step towards a successful career in technology',
      primaryCta: { label: 'Apply Now', link: '/admissions' },
      phoneNumber: '+91 98765 43210',
      showPhone: true,
      email: undefined,
      showEmail: false,
      primaryColor: '#0b6d41',
      accentColor: '#ffde59',
      showAnimations: true,
      paddingY: 'lg',
    },
    supportsChildren: false,
    isFullWidth: true,
    keywords: ['cta', 'call to action', 'apply', 'contact'],
    editableProps: [
      { name: 'title', type: 'string', label: 'Title', required: true },
      { name: 'subtitle', type: 'string', label: 'Subtitle' },
      {
        name: 'primaryCta',
        type: 'object',
        label: 'Primary CTA Button',
        itemSchema: {
          properties: {
            label: { type: 'string', label: 'Button Text', required: true, defaultValue: 'Apply Now' },
            link: { type: 'url', label: 'Button Link', required: true, defaultValue: '/admissions' }
          }
        }
      },
      { name: 'showPhone', type: 'boolean', label: 'Show Phone Number', defaultValue: true },
      { name: 'phoneNumber', type: 'string', label: 'Phone Number', defaultValue: '+91 98765 43210' },
      { name: 'showEmail', type: 'boolean', label: 'Show Email', defaultValue: false },
      { name: 'email', type: 'string', label: 'Email Address' },
      { name: 'primaryColor', type: 'color', label: 'Primary Color', defaultValue: '#0b6d41' },
      { name: 'accentColor', type: 'color', label: 'Accent Color', defaultValue: '#ffde59' },
      { name: 'showAnimations', type: 'boolean', label: 'Enable Animations', defaultValue: true },
      { name: 'paddingY', type: 'enum', label: 'Vertical Padding', options: ['sm', 'md', 'lg', 'xl'], defaultValue: 'lg' },
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
