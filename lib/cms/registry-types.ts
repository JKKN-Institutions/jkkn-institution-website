import { z } from 'zod'
import type { ComponentType, ReactNode } from 'react'

/**
 * Component categories for the page builder
 */
export type ComponentCategory = 'content' | 'media' | 'layout' | 'data' | 'shadcn' | 'custom'

/**
 * Base props that all CMS block components receive
 */
export interface BaseBlockProps {
  /** Unique block ID */
  id?: string
  /** Custom CSS classes to apply */
  className?: string
  /** Custom inline styles */
  style?: React.CSSProperties
  /** Whether the block is currently selected in the builder */
  isSelected?: boolean
  /** Whether we're in edit mode */
  isEditing?: boolean
  /** Children for container components */
  children?: ReactNode
}

/**
 * Editable property definition for dynamic forms
 */
export interface EditableProp {
  /** Property name matching the props schema */
  name: string
  /** Display label (defaults to formatted name) */
  label?: string
  /** Property type for form field rendering */
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object' | 'color' | 'url' | 'image' | 'video' | 'media'
  /** Description shown below the field */
  description?: string
  /** Whether this field is required */
  required?: boolean
  /** Default value for the field */
  defaultValue?: unknown
  /** Options for enum type */
  options?: string[]
  /** Min value for number type */
  min?: number
  /** Max value for number type */
  max?: number
  /** Step value for number type */
  step?: number
  /** Unit suffix for number inputs (e.g., 'px', 'rem', '%') */
  unit?: string
  /** Whether to show multiline textarea for string type */
  multiline?: boolean
  /** Placeholder text */
  placeholder?: string
  /** For array type: what kind of items (string, image, object) */
  itemType?: 'string' | 'image' | 'object'
  /** For array type with object items: the schema of each item */
  itemSchema?: ItemSchema
  /** For object type: nested properties */
  properties?: EditableProp[]
}

/**
 * Schema for array items - supports nested arrays for complex structures
 */
export interface ItemSchema {
  properties: Record<string, ItemSchemaProperty>
  required?: string[]
}

/**
 * Property definition within an item schema - supports nested arrays
 */
export interface ItemSchemaProperty {
  type: string
  label?: string
  required?: boolean
  format?: string
  /** For multiline text fields */
  multiline?: boolean
  /** Placeholder text for input fields */
  placeholder?: string
  /** Options for enum type */
  options?: string[]
  /** Default value for the field */
  defaultValue?: unknown
  /** Description shown below the field */
  description?: string
  /** For nested array properties */
  itemType?: 'string' | 'image' | 'object'
  /** For nested array with object items */
  itemSchema?: ItemSchema
}

/**
 * Registry entry for a single component
 */
export interface ComponentRegistryEntry {
  /** Internal component name (PascalCase) */
  name: string
  /** Display name for the UI */
  displayName: string
  /** Category for grouping in the palette */
  category: ComponentCategory
  /** Description of what this component does */
  description?: string
  /** Icon name from Lucide icons */
  icon: string
  /** The actual React component - using any to allow different prop types */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>
  /** Zod schema for props validation */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propsSchema: z.ZodSchema<any>
  /** Default props when adding the component */
  defaultProps: Record<string, unknown>
  /** Whether this component can contain other blocks */
  supportsChildren: boolean
  /** Whether this component should span full width (no container wrapper) */
  isFullWidth?: boolean
  /** Preview image URL for the component palette */
  previewImage?: string
  /** Keywords for search */
  keywords?: string[]
  /** Editable properties for the dynamic form */
  editableProps?: EditableProp[]
  /** Whether this is a custom component from the database */
  isCustomComponent?: boolean
  /** Whether this is a shadcn/ui component */
  isShadcnComponent?: boolean
}

/**
 * The complete component registry type
 */
export type ComponentRegistry = Record<string, ComponentRegistryEntry>

/**
 * Block data as stored in the database
 */
export interface BlockData {
  id: string
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  parent_block_id: string | null
  is_visible: boolean
  responsive_settings?: Record<string, unknown>
  custom_css?: string
  custom_classes?: string
}

/**
 * Alias for BlockData used in design enhancement
 * Uses componentName (camelCase) for compatibility with enhancement engine
 */
export interface PageBlock {
  id: string
  componentName: string
  props: Record<string, unknown>
  sortOrder: number
  parentBlockId: string | null
  isVisible: boolean
  responsiveSettings?: Record<string, unknown>
  customCss?: string
  customClasses?: string
}

/**
 * Props for the PageRenderer component
 */
export interface PageRendererProps {
  blocks: BlockData[]
  isEditing?: boolean
}

// ==========================================
// Animation Types and Schemas
// ==========================================

/**
 * Entrance animation types - maps to CSS classes in styles/animations.css
 */
export const EntranceAnimationSchema = z.enum([
  'none',
  'fade-in',
  'fade-in-up',
  'fade-in-down',
  'fade-in-left',
  'fade-in-right',
  'zoom-in',
  'zoom-in-up',
  'bounce-in',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'flip-in',
  'rotate-in',
])
export type EntranceAnimation = z.infer<typeof EntranceAnimationSchema>

/**
 * Hover effect types
 */
export const HoverEffectSchema = z.enum([
  'none',
  'lift',
  'glow',
  'scale',
  'float',
  'pulse',
  'border-glow',
  'shadow-grow',
])
export type HoverEffect = z.infer<typeof HoverEffectSchema>

/**
 * Animation timing options
 */
export const AnimationDurationSchema = z.enum(['fast', 'normal', 'slow', 'very-slow'])
export type AnimationDuration = z.infer<typeof AnimationDurationSchema>

export const AnimationDelaySchema = z.enum(['0', '100', '200', '300', '400', '500', '700', '1000'])
export type AnimationDelay = z.infer<typeof AnimationDelaySchema>

export const AnimationEasingSchema = z.enum(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'bounce', 'spring'])
export type AnimationEasing = z.infer<typeof AnimationEasingSchema>

/**
 * Complete block animation configuration
 */
export const BlockAnimationSchema = z.object({
  /** Entrance animation when block appears */
  entrance: EntranceAnimationSchema.default('none'),
  /** Delay before animation starts (ms) */
  entranceDelay: AnimationDelaySchema.default('0'),
  /** Animation duration */
  duration: AnimationDurationSchema.default('normal'),
  /** Animation easing function */
  easing: AnimationEasingSchema.default('ease-out'),
  /** Whether to animate when scrolled into view */
  animateOnScroll: z.boolean().default(false),
  /** Hover effect for interactive elements */
  hoverEffect: HoverEffectSchema.default('none'),
  /** Whether animation should repeat when re-entering viewport */
  repeatOnScroll: z.boolean().default(false),
})
export type BlockAnimation = z.infer<typeof BlockAnimationSchema>

/**
 * Animation-enabled block props interface
 * Components can extend this to support animations
 */
export interface AnimatableBlockProps extends BaseBlockProps {
  _animation?: BlockAnimation
}

/**
 * Editable props for animation settings (to be added to each component)
 */
export const ANIMATION_EDITABLE_PROPS: EditableProp[] = [
  {
    name: '_animation.entrance',
    label: 'Entrance Animation',
    type: 'enum',
    options: ['none', 'fade-in', 'fade-in-up', 'fade-in-down', 'zoom-in', 'bounce-in', 'slide-up', 'slide-left'],
    description: 'Animation when component appears',
  },
  {
    name: '_animation.entranceDelay',
    label: 'Animation Delay',
    type: 'enum',
    options: ['0', '100', '200', '300', '500'],
    description: 'Delay before animation starts (ms)',
  },
  {
    name: '_animation.animateOnScroll',
    label: 'Animate on Scroll',
    type: 'boolean',
    description: 'Trigger animation when scrolled into view',
  },
  {
    name: '_animation.hoverEffect',
    label: 'Hover Effect',
    type: 'enum',
    options: ['none', 'lift', 'glow', 'scale', 'float'],
    description: 'Effect when hovering over component',
  },
]

// ==========================================
// Zod Schemas for common prop patterns
// ==========================================

export const AlignmentSchema = z.enum(['left', 'center', 'right', 'justify'])
export type Alignment = z.infer<typeof AlignmentSchema>

export const ButtonVariantSchema = z.enum(['primary', 'secondary', 'outline', 'ghost', 'link'])
export type ButtonVariant = z.infer<typeof ButtonVariantSchema>

export const CTAButtonSchema = z.object({
  label: z.string(),
  link: z.string(),
  variant: ButtonVariantSchema.default('primary'),
  openInNewTab: z.boolean().default(false),
})
export type CTAButton = z.infer<typeof CTAButtonSchema>

export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
})
export type ImageData = z.infer<typeof ImageSchema>

export const ResponsiveValueSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    default: valueSchema,
    sm: valueSchema.optional(),
    md: valueSchema.optional(),
    lg: valueSchema.optional(),
    xl: valueSchema.optional(),
  })

// ==========================================
// Component-specific Props Schemas
// ==========================================

// Content Blocks
export const HeroSectionPropsSchema = z.object({
  title: z.string().default('Welcome'),
  subtitle: z.string().optional(),
  // Logo settings
  logoImage: z.string().optional(),
  logoImageAlt: z.string().default(''),
  showAiBadge: z.boolean().default(true),
  // Title styling
  titleColor: z.string().default('#ffffff'),
  titleFontSize: z.enum(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']).default('5xl'),
  titleFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('bold'),
  titleFontStyle: z.enum(['normal', 'italic']).default('normal'),
  // Subtitle styling
  subtitleColor: z.string().default('#e5e5e5'),
  subtitleFontSize: z.number().min(8).max(120).default(24),
  subtitleFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
  subtitleFontStyle: z.enum(['normal', 'italic']).default('normal'),
  // Trust Badges settings
  showTrustBadges: z.boolean().default(false),
  trustBadgesStyle: z.enum(['glass', 'solid', 'outline']).default('glass'),
  trustBadgesPosition: z.enum(['below-subtitle', 'below-title']).default('below-subtitle'),
  // Background settings
  backgroundType: z.enum(['image', 'video', 'gradient']).default('image'),
  backgroundImage: z.string().optional(),
  backgroundImageAlt: z.string().default(''),
  backgroundVideo: z.string().optional(),
  backgroundGradient: z.string().optional(),
  ctaButtons: z.array(CTAButtonSchema).default([]),
  alignment: AlignmentSchema.default('center'),
  overlay: z.boolean().default(true),
  overlayOpacity: z.number().min(0).max(1).default(0.5),
  minHeight: z.string().default('100vh'),
})
export type HeroSectionProps = z.infer<typeof HeroSectionPropsSchema> & BaseBlockProps

export const TextEditorPropsSchema = z.object({
  content: z.string().default(''),
  alignment: AlignmentSchema.default('left'),
  maxWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full', 'prose']).default('prose'),
})
export type TextEditorProps = z.infer<typeof TextEditorPropsSchema> & BaseBlockProps

export const HeadingPropsSchema = z.object({
  text: z.string().default('Heading'),
  level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).default('h2'),
  alignment: AlignmentSchema.default('left'),
  color: z.string().optional(),
})
export type HeadingProps = z.infer<typeof HeadingPropsSchema> & BaseBlockProps

export const CallToActionPropsSchema = z.object({
  title: z.string().default('Ready to Get Started?'),
  description: z.string().optional(),
  buttons: z.array(CTAButtonSchema).default([]),
  background: z.string().optional(),
  alignment: AlignmentSchema.default('center'),
})
export type CallToActionProps = z.infer<typeof CallToActionPropsSchema> & BaseBlockProps

export const TestimonialSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  avatar: z.string().optional(),
  content: z.string(),
  rating: z.number().min(0).max(5).optional(),
})
export type Testimonial = z.infer<typeof TestimonialSchema>

export const TestimonialsPropsSchema = z.object({
  testimonials: z.array(TestimonialSchema).default([]),
  layout: z.enum(['carousel', 'grid']).default('carousel'),
  autoplay: z.boolean().default(true),
  showRating: z.boolean().default(true),
})
export type TestimonialsProps = z.infer<typeof TestimonialsPropsSchema> & BaseBlockProps

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.enum(['general', 'admissions', 'academics', 'facilities', 'placements', 'fees']).default('general').optional(),
})
export type FAQItem = z.infer<typeof FAQItemSchema>

export const FAQAccordionPropsSchema = z.object({
  faqs: z.array(FAQItemSchema).default([]),
  searchEnabled: z.boolean().default(true),
  allowMultiple: z.boolean().default(false),
})
export type FAQAccordionProps = z.infer<typeof FAQAccordionPropsSchema> & BaseBlockProps

export const FAQSectionPropsSchema = z.object({
  // Section Header
  badge: z.string().default('FAQ'),
  title: z.string().default('Frequently Asked Questions'),
  subtitle: z.string().default('Everything you need to know about JKKN Institutions'),

  // FAQ Items - 10 JKKN-specific FAQs as default
  faqs: z.array(FAQItemSchema).default([
    {
      question: 'What is JKKN Institutions and how long has it been established?',
      answer: 'J.K.K. Nattraja Educational Institutions (JKKN) is a premier educational group established in 1969 under the J.K.K. Rangammal Trust. Founded by Kodai Vallal Shri. J.K.K. Natarajah with a vision to empower through education, JKKN has grown into a multi-disciplinary institution spanning 7 colleges and 2 schools, nurturing over 1,00,000+ Learners across 74+ years of educational excellence.',
    },
    {
      question: 'What courses are offered at JKKN Institutions?',
      answer: 'JKKN offers 50+ programs across multiple disciplines including Dental Sciences (BDS, MDS), Pharmacy (B.Pharm, M.Pharm, Pharm.D), Engineering & Technology (B.E/B.Tech, M.E/M.Tech), Nursing (B.Sc, M.Sc, GNM), Allied Health Sciences (BPT, BMLT, B.Sc Radiology), Arts & Science (BA, B.Sc, BCA, BBA, M.A, M.Sc), and Education (B.Ed, M.Ed). Each program is designed with industry-integrated curriculum and hands-on learning experiences.',
    },
    {
      question: 'Is JKKN approved by AICTE, UGC, and other regulatory bodies?',
      answer: 'Yes, all JKKN institutions are fully approved and recognized by respective regulatory bodies. Our colleges hold approvals from AICTE (All India Council for Technical Education), UGC (University Grants Commission), NAAC (National Assessment and Accreditation Council), NBA (National Board of Accreditation), DCI (Dental Council of India), PCI (Pharmacy Council of India), and INC (Indian Nursing Council). JKKN has achieved NAAC A+ Accreditation, reflecting our commitment to quality education.',
    },
    {
      question: 'What is the placement rate at JKKN?',
      answer: 'JKKN maintains an impressive 95%+ placement rate across all colleges. Our dedicated placement cell has strong partnerships with 100+ industry recruiters including TCS, Infosys, Wipro, Zoho, Cognizant, HCL, Dell, and leading hospitals. Over 50,000+ alumni are successfully placed in top organizations worldwide. We offer comprehensive placement training, mock interviews, and industry internship programs.',
    },
    {
      question: 'How can I apply for admission at JKKN for 2025-26?',
      answer: 'Admission to JKKN for the academic year 2025-26 is now open. You can apply through our online admission portal at jkkn.in/admission-form. The process includes online application, document verification, counselling (where applicable), fee payment, and admission confirmation. For direct assistance, call +91 422 266 1100 or email info@jkkn.ac.in.',
    },
    {
      question: 'Does JKKN offer hostel and transportation facilities?',
      answer: 'Yes, JKKN provides separate hostel facilities for boys and girls with 24/7 security, Wi-Fi connectivity, hygienic mess, and recreational areas. Our fleet of 50+ buses covers 30+ routes across Erode, Namakkal, Salem, Karur, and surrounding districts. All hostels and transport are managed with Learner safety as top priority.',
    },
    {
      question: 'What scholarships are available at JKKN?',
      answer: 'JKKN offers multiple scholarship schemes including merit scholarships for academic toppers (up to 100% tuition fee waiver), sports quota scholarships, government scholarships for SC/ST/OBC/MBC categories, economically weaker section (EWS) support, and special scholarships for single girl child and differently-abled Learners. The J.K.K. Rangammal Trust also provides need-based financial assistance.',
    },
    {
      question: 'What are the unique facilities available at JKKN campus?',
      answer: "JKKN's 100+ acre campus features smart Learning Studios, advanced research laboratories, digital library with 50,000+ books, 500-bed multi-specialty hospital, sports complex with indoor and outdoor facilities, auditorium (2000+ seating), food court, bank & post office, ambulance services, and complete Wi-Fi coverage. All facilities are designed to provide a holistic learning environment.",
    },
    {
      question: 'What makes JKKN different from other colleges in Tamil Nadu?',
      answer: 'JKKN stands apart with its 74+ years of educational legacy, industry-integrated curriculum, 95% placement record, NAAC A+ accreditation, 500+ expert Learning Facilitators, affordable fee structure, and a value-based education philosophy. Our Founder\'s vision of "Excellence without Elitism" ensures quality education is accessible to all deserving Learners regardless of their economic background.',
    },
    {
      question: 'Where is JKKN located and how can I visit the campus?',
      answer: 'JKKN Group of Institutions is located at Komarapalayam, Namakkal District, Tamil Nadu - 638183. The campus is well-connected by road and is approximately 50 km from Erode, 35 km from Salem, and 120 km from Coimbatore. Campus visits can be scheduled by contacting our admission office at +91 422 266 1100. We conduct regular open house events for prospective Learners and parents.',
    },
  ]),

  // CTA Configuration
  showCTA: z.boolean().default(true),
  ctaTitle: z.string().default('Still have questions?'),
  ctaDescription: z.string().default("Can't find the answer you're looking for? Our admissions team is here to help."),
  ctaPhone: z.string().default('+91 422 266 1100'),
  ctaEmail: z.string().default('info@jkkn.ac.in'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),

  // Typography Colors
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().optional(),
})
export type FAQSectionProps = z.infer<typeof FAQSectionPropsSchema> & BaseBlockProps

export const TabSchema = z.object({
  label: z.string(),
  content: z.string(),
  icon: z.string().optional(),
})
export type Tab = z.infer<typeof TabSchema>

export const TabsBlockPropsSchema = z.object({
  tabs: z.array(TabSchema).default([]),
  variant: z.enum(['default', 'pills', 'underline']).default('default'),
})
export type TabsBlockProps = z.infer<typeof TabsBlockPropsSchema> & BaseBlockProps

export const TimelineEventSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
})
export type TimelineEvent = z.infer<typeof TimelineEventSchema>

export const TimelinePropsSchema = z.object({
  events: z.array(TimelineEventSchema).default([]),
  alternating: z.boolean().default(true),
})
export type TimelineProps = z.infer<typeof TimelinePropsSchema> & BaseBlockProps

export const PricingPlanSchema = z.object({
  name: z.string(),
  price: z.string(),
  period: z.string().optional(),
  features: z.array(z.string()).default([]),
  cta: CTAButtonSchema.optional(),
  highlighted: z.boolean().default(false),
})
export type PricingPlan = z.infer<typeof PricingPlanSchema>

export const PricingTablesPropsSchema = z.object({
  plans: z.array(PricingPlanSchema).default([]),
  columns: z.number().min(1).max(4).default(3),
})
export type PricingTablesProps = z.infer<typeof PricingTablesPropsSchema> & BaseBlockProps

// Media Blocks
export const ImageBlockPropsSchema = z.object({
  src: z.string().default(''),
  alt: z.string().default(''),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  objectFit: z.enum(['cover', 'contain', 'fill', 'none']).default('cover'),
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  link: z.string().optional(),
  lightbox: z.boolean().default(false),
})
export type ImageBlockProps = z.infer<typeof ImageBlockPropsSchema> & BaseBlockProps

export const ImageGalleryPropsSchema = z.object({
  images: z.array(ImageSchema).default([]),
  layout: z.enum(['grid', 'masonry', 'carousel']).default('grid'),
  columns: z.number().min(1).max(6).default(3),
  lightbox: z.boolean().default(true),
  gap: z.number().default(4),
})
export type ImageGalleryProps = z.infer<typeof ImageGalleryPropsSchema> & BaseBlockProps

export const VideoPlayerPropsSchema = z.object({
  src: z.string().default(''),
  provider: z.enum(['youtube', 'vimeo', 'self']).default('youtube'),
  autoplay: z.boolean().default(false),
  controls: z.boolean().default(true),
  loop: z.boolean().default(false),
  muted: z.boolean().default(false),
  poster: z.string().optional(),
  posterAlt: z.string().default(''),
  aspectRatio: z.string().default('16/9'),
})
export type VideoPlayerProps = z.infer<typeof VideoPlayerPropsSchema> & BaseBlockProps

export const ImageCarouselPropsSchema = z.object({
  images: z.array(ImageSchema).default([]),
  autoplay: z.boolean().default(true),
  interval: z.number().default(5000),
  showDots: z.boolean().default(true),
  showArrows: z.boolean().default(true),
})
export type ImageCarouselProps = z.infer<typeof ImageCarouselPropsSchema> & BaseBlockProps

export const BeforeAfterSliderPropsSchema = z.object({
  beforeImage: z.string().default(''),
  beforeImageAlt: z.string().default(''),
  afterImage: z.string().default(''),
  afterImageAlt: z.string().default(''),
  beforeLabel: z.string().default('Before'),
  afterLabel: z.string().default('After'),
  startPosition: z.number().min(0).max(100).default(50),
})
export type BeforeAfterSliderProps = z.infer<typeof BeforeAfterSliderPropsSchema> & BaseBlockProps

export const LogoSchema = z.object({
  src: z.string(),
  alt: z.string(),
  link: z.string().optional(),
})
export type Logo = z.infer<typeof LogoSchema>

export const LogoCloudPropsSchema = z.object({
  logos: z.array(LogoSchema).default([]),
  layout: z.enum(['grid', 'marquee']).default('grid'),
  grayscale: z.boolean().default(true),
  columns: z.number().min(2).max(8).default(6),
})
export type LogoCloudProps = z.infer<typeof LogoCloudPropsSchema> & BaseBlockProps

// Layout Blocks
export const ContainerPropsSchema = z.object({
  maxWidth: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).default('xl'),
  padding: z.string().default('4'),
  centered: z.boolean().default(true),
  background: z.string().optional(),
})
export type ContainerProps = z.infer<typeof ContainerPropsSchema> & BaseBlockProps

export const GridLayoutPropsSchema = z.object({
  columns: z.number().min(1).max(12).default(3),
  gap: z.number().default(4),
  responsive: z.object({
    sm: z.number().optional(),
    md: z.number().optional(),
    lg: z.number().optional(),
  }).default({ sm: 1, md: 2, lg: 3 }),
})
export type GridLayoutProps = z.infer<typeof GridLayoutPropsSchema> & BaseBlockProps

export const FlexboxLayoutPropsSchema = z.object({
  direction: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).default('row'),
  justify: z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']).default('start'),
  align: z.enum(['start', 'center', 'end', 'stretch', 'baseline']).default('center'),
  wrap: z.boolean().default(true),
  gap: z.number().default(4),
})
export type FlexboxLayoutProps = z.infer<typeof FlexboxLayoutPropsSchema> & BaseBlockProps

export const SpacerPropsSchema = z.object({
  height: z.string().default('8'),
  responsive: z.object({
    sm: z.string().optional(),
    md: z.string().optional(),
    lg: z.string().optional(),
  }).default({ sm: '4', md: '6', lg: '8' }),
})
export type SpacerProps = z.infer<typeof SpacerPropsSchema> & BaseBlockProps

export const DividerPropsSchema = z.object({
  style: z.enum(['solid', 'dashed', 'dotted']).default('solid'),
  color: z.string().optional(),
  thickness: z.number().default(1),
  width: z.enum(['full', '3/4', '1/2', '1/4']).default('full'),
})
export type DividerProps = z.infer<typeof DividerPropsSchema> & BaseBlockProps

export const SectionWrapperPropsSchema = z.object({
  background: z.string().optional(),
  backgroundImage: z.string().optional(),
  backgroundImageAlt: z.string().default(''),
  padding: z.string().default('16'),
  fullWidth: z.boolean().default(true),
  id: z.string().optional(),
})
export type SectionWrapperProps = z.infer<typeof SectionWrapperPropsSchema> & BaseBlockProps

// ==========================================
// Data Blocks
// ==========================================

// Stats Counter Block
export const StatItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  icon: z.string().optional(),
})
export type StatItem = z.infer<typeof StatItemSchema>

export const StatsCounterPropsSchema = z.object({
  stats: z.array(StatItemSchema).default([]),
  layout: z.enum(['row', 'grid']).default('row'),
  columns: z.number().min(1).max(6).default(4),
  animate: z.boolean().default(true),
  showIcons: z.boolean().default(true),
  variant: z.enum(['default', 'cards', 'minimal']).default('default'),
})
export type StatsCounterProps = z.infer<typeof StatsCounterPropsSchema> & BaseBlockProps

// Events List Block
export const EventItemSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  date: z.string(),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  category: z.string().optional(),
})
export type EventItem = z.infer<typeof EventItemSchema>

export const EventsListPropsSchema = z.object({
  title: z.string().default('Upcoming Events'),
  events: z.array(EventItemSchema).default([]),
  layout: z.enum(['list', 'grid', 'calendar']).default('list'),
  showPastEvents: z.boolean().default(false),
  maxItems: z.number().min(1).max(20).default(5),
  showViewAll: z.boolean().default(true),
  viewAllLink: z.string().default('/events'),
  dataSource: z.enum(['manual', 'database']).default('manual'),
})
export type EventsListProps = z.infer<typeof EventsListPropsSchema> & BaseBlockProps

// Faculty Directory Block
export const FacultyMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  designation: z.string(),
  department: z.string().optional(),
  image: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  qualifications: z.array(z.string()).default([]),
  specializations: z.array(z.string()).default([]),
})
export type FacultyMember = z.infer<typeof FacultyMemberSchema>

export const FacultyDirectoryPropsSchema = z.object({
  title: z.string().default('Our Faculty'),
  faculty: z.array(FacultyMemberSchema).default([]),
  layout: z.enum(['grid', 'list', 'compact']).default('grid'),
  columns: z.number().min(1).max(5).default(4),
  showDepartmentFilter: z.boolean().default(true),
  showSearchBox: z.boolean().default(true),
  maxItems: z.number().min(1).max(50).default(12),
  dataSource: z.enum(['manual', 'database']).default('manual'),
  departmentFilter: z.string().optional(),
})
export type FacultyDirectoryProps = z.infer<typeof FacultyDirectoryPropsSchema> & BaseBlockProps

// Announcements Feed Block
export const AnnouncementItemSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  date: z.string(),
  category: z.string().optional(),
  priority: z.enum(['normal', 'important', 'urgent']).default('normal'),
  link: z.string().optional(),
  image: z.string().optional(),
})
export type AnnouncementItem = z.infer<typeof AnnouncementItemSchema>

export const AnnouncementsFeedPropsSchema = z.object({
  title: z.string().default('Announcements'),
  announcements: z.array(AnnouncementItemSchema).default([]),
  layout: z.enum(['list', 'cards', 'ticker']).default('list'),
  maxItems: z.number().min(1).max(20).default(5),
  showDate: z.boolean().default(true),
  showCategory: z.boolean().default(true),
  showViewAll: z.boolean().default(true),
  viewAllLink: z.string().default('/announcements'),
  autoScroll: z.boolean().default(false),
  dataSource: z.enum(['manual', 'database']).default('manual'),
})
export type AnnouncementsFeedProps = z.infer<typeof AnnouncementsFeedPropsSchema> & BaseBlockProps

// Blog Posts Grid Block
export const BlogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  author: z.string().optional(),
  authorImage: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  link: z.string().optional(),
  readTime: z.string().optional(),
})
export type BlogPost = z.infer<typeof BlogPostSchema>

export const BlogPostsGridPropsSchema = z.object({
  title: z.string().default('Latest News'),
  posts: z.array(BlogPostSchema).default([]),
  layout: z.enum(['grid', 'list', 'featured']).default('grid'),
  columns: z.number().min(1).max(4).default(3),
  maxItems: z.number().min(1).max(20).default(6),
  showAuthor: z.boolean().default(true),
  showDate: z.boolean().default(true),
  showCategory: z.boolean().default(true),
  showExcerpt: z.boolean().default(true),
  showViewAll: z.boolean().default(true),
  viewAllLink: z.string().default('/blog'),
  categoryFilter: z.string().optional(),
  dataSource: z.enum(['manual', 'database']).default('manual'),
})
export type BlogPostsGridProps = z.infer<typeof BlogPostsGridPropsSchema> & BaseBlockProps

// Trust Badges Block
export const TrustBadgeItemSchema = z.object({
  icon: z.string().default('Award'),
  text: z.string(),
})
export type TrustBadgeItem = z.infer<typeof TrustBadgeItemSchema>

export const TrustBadgesPropsSchema = z.object({
  badges: z.array(TrustBadgeItemSchema).default([
    { icon: 'Award', text: 'NAAC Accredited' },
    { icon: 'TrendingUp', text: '95%+ Placements' },
    { icon: 'Users', text: '100+ Top Recruiters' },
    { icon: 'Calendar', text: '39 Years of Excellence' }
  ]),
  alignment: AlignmentSchema.default('center'),
  badgeStyle: z.enum(['pill', 'card', 'minimal']).default('pill'),
  backgroundColor: z.string().default('#ffffff'),
  textColor: z.string().default('#171717'),
  iconColor: z.string().default('#0b6d41'),
  borderColor: z.string().default('#ffffff4d'),
  gap: z.enum(['sm', 'md', 'lg']).default('md'),
  animated: z.boolean().default(true),
})
export type TrustBadgesProps = z.infer<typeof TrustBadgesPropsSchema> & BaseBlockProps

// ==========================================
// Accreditations & Approvals Section
// ==========================================

// Accreditation Card Schema
export const AccreditationCardSchema = z.object({
  icon: z.string().default('Award'),
  name: z.string(),
  description: z.string(),
  order: z.number().default(0),
})
export type AccreditationCard = z.infer<typeof AccreditationCardSchema>

// Trust Recognition Badge Schema
export const TrustRecognitionBadgeSchema = z.object({
  icon: z.string().default('Award'),
  text: z.string(),
  subtext: z.string().optional(),
  order: z.number().default(0),
})
export type TrustRecognitionBadge = z.infer<typeof TrustRecognitionBadgeSchema>

// Main Accreditations Section Props Schema
export const AccreditationsSectionPropsSchema = z.object({
  // Section Header
  badge: z.string().default('ACCREDITATIONS'),
  title: z.string().default('Accreditations & Approvals'),
  titleAccentWord: z.string().optional().default('Approvals'),
  subtitle: z.string().default('Recognized for Excellence by India\'s Premier Regulatory Bodies'),
  description: z.string().default('JKKN Institutions proudly holds approvals and accreditations from all major national regulatory bodies, ensuring our Learners receive education that meets the highest standards of quality, compliance, and industry relevance.'),

  // Typography Colors
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('#D4AF37'), // Gold

  // Accreditation Cards (8 cards)
  accreditationCards: z.array(AccreditationCardSchema).default([
    {
      icon: 'Trophy',
      name: 'NAAC A+ Accredited',
      description: 'Awarded the prestigious A+ Grade by the National Assessment and Accreditation Council, recognizing excellence in curriculum, infrastructure, Learning outcomes, and governance.',
      order: 1,
    },
    {
      icon: 'CheckCircle',
      name: 'AICTE Approved',
      description: 'All India Council for Technical Education approval for Engineering, Pharmacy, and Management programs ensuring national standards compliance.',
      order: 2,
    },
    {
      icon: 'CheckCircle',
      name: 'UGC Recognized',
      description: 'University Grants Commission recognition for Arts, Science, and Humanities programs affiliated to reputed universities.',
      order: 3,
    },
    {
      icon: 'CheckCircle',
      name: 'NBA Accredited',
      description: 'National Board of Accreditation certification for select Engineering and Pharmacy programs, validating outcome-based education standards.',
      order: 4,
    },
    {
      icon: 'CheckCircle',
      name: 'DCI Approved',
      description: 'Dental Council of India approval for JKKN Dental College, authorizing BDS and MDS programs with 500-bed teaching hospital.',
      order: 5,
    },
    {
      icon: 'CheckCircle',
      name: 'PCI Approved',
      description: 'Pharmacy Council of India approval for B.Pharm, M.Pharm, and Pharm.D programs ensuring pharmaceutical education excellence.',
      order: 6,
    },
    {
      icon: 'CheckCircle',
      name: 'INC Approved',
      description: 'Indian Nursing Council approval for all Nursing programs at Sresakthimayeil Institute of Nursing and Research.',
      order: 7,
    },
    {
      icon: 'GraduationCap',
      name: 'Affiliated Universities',
      description: 'Programs affiliated to Tamil Nadu Dr. M.G.R. Medical University, Anna University, Periyar University, and Tamil Nadu Teachers Education University.',
      order: 8,
    },
  ]),

  // Trust & Recognition Badges (5 badges)
  trustBadges: z.array(TrustRecognitionBadgeSchema).default([
    {
      icon: 'Calendar',
      text: '74+ Years of Educational Excellence',
      subtext: '(Est. 1951)',
      order: 1,
    },
    {
      icon: 'Heart',
      text: 'J.K.K. Rangammal Charitable Trust',
      subtext: '(Est. 1969)',
      order: 2,
    },
    {
      icon: 'Shield',
      text: 'ISO 9001:2015 Certified',
      subtext: 'Management System',
      order: 3,
    },
    {
      icon: 'Leaf',
      text: 'Green Campus Certification',
      subtext: '',
      order: 4,
    },
    {
      icon: 'TrendingUp',
      text: 'NIRF Ranked Institution',
      subtext: '',
      order: 5,
    },
  ]),

  // Section Toggles
  showAccreditationCards: z.boolean().default(true),
  showTrustBadges: z.boolean().default(true),

  // Layout Configuration
  cardsPerRow: z.enum(['2', '3', '4']).default('4'),
  cardLayout: z.enum(['grid', 'slider']).default('grid'),
  badgeLayout: z.enum(['row', 'grid']).default('row'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'solid', 'transparent']).default('gradient-dark'),
  glassmorphismVariant: z.enum(['dark', 'light', 'dark-elegant']).default('dark'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),

  // Animation
  showAnimations: z.boolean().default(true),
  animationPreset: z.enum(['stagger', 'fade-in-up', 'zoom-in', 'none']).default('stagger'),
  staggerDelay: z.number().min(50).max(300).default(100),
})
export type AccreditationsSectionProps = z.infer<typeof AccreditationsSectionPropsSchema> & BaseBlockProps

// ==========================================
// Why Choose JKKN (USPs) Section
// ==========================================

/**
 * Company Logo schema for placement card
 */
export const CompanyLogoSchema = z.object({
  name: z.string(),
  logo: z.string().optional(),
})
export type CompanyLogo = z.infer<typeof CompanyLogoSchema>

/**
 * Accreditation Badge schema
 */
export const AccreditationBadgeSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  image: z.string().optional(),
})
export type AccreditationBadge = z.infer<typeof AccreditationBadgeSchema>

/**
 * Legacy Card schema (Years of Educational Legacy)
 */
export const LegacyCardSchema = z.object({
  statValue: z.string().default('74+'),
  statLabel: z.string().default('Years of Educational Legacy'),
  bulletPoints: z.array(z.string()).default([
    'Founded in 1951...',
    'Nurturing over 1,00,000+ Learners',
    'Strong alumni networks & stability',
  ]),
  campusImage: z.string().optional(),
})
export type LegacyCard = z.infer<typeof LegacyCardSchema>

/**
 * Placement Card schema (Placement Success Rate)
 */
export const PlacementCardSchema = z.object({
  statValue: z.string().default('95%'),
  statLabel: z.string().default('Placement Success Rate'),
  bulletPoints: z.array(z.string()).default([
    '100+ leading recruiters.',
    'Soft skills training & mock interviews.',
    'Industry internships',
  ]),
  companyLogos: z.array(CompanyLogoSchema).default([
    { name: 'TCS' },
    { name: 'Infosys' },
    { name: 'Wipro' },
    { name: 'Zoho' },
    { name: 'Cognizant' },
    { name: 'HCL' },
  ]),
  accreditation: AccreditationBadgeSchema.default({
    title: 'NAC A+',
    subtitle: 'Validated for Excellence',
  }),
})
export type PlacementCard = z.infer<typeof PlacementCardSchema>

/**
 * USP Card schema for Why Choose JKKN section
 */
export const USPCardSchema = z.object({
  icon: z.enum(['heritage', 'career', 'excellence', 'expertise', 'facilities', 'value']),
  title: z.string(),
  stat: z.string().optional(),
})
export type USPCard = z.infer<typeof USPCardSchema>

/**
 * Why Choose JKKN Section Props
 * Modern card-based layout with typography customization:
 * - Section header with badge, title, subtitle, tagline
 * - 6 USP cards with icons and optional stats
 * - Additional USPs list
 * - Full typography control for all text elements
 */
export const WhyChooseJKKNPropsSchema = z.object({
  // === CONTENT FIELDS ===
  title: z.string().default('Why Choose JKKN?'),
  subtitle: z.string().default('74+ Years of Transforming Lives Through Progressive Education'),
  tagline: z.string().default('Where Legacy Meets Innovation | Excellence Without Elitism'),
  badgeText: z.string().default('Why Choose Us'),
  additionalUspsHeading: z.string().default('And Much More...'),

  // USP Cards
  uspCards: z.array(USPCardSchema).optional(),
  additionalUsps: z.array(z.string()).optional(),

  // === BADGE TYPOGRAPHY ===
  badgeColor: z.string().default('#0b6d41'),
  badgeBgColor: z.string().default('#0b6d411a'),
  badgeFontSize: z.enum(['sm', 'md', 'lg']).default('sm'),
  badgeFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),

  // === TITLE TYPOGRAPHY ===
  titleColor: z.string().default('#171717'),
  titleFontSize: z.enum(['2xl', '3xl', '4xl', '5xl', '6xl']).default('5xl'),
  titleFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('bold'),

  // === SUBTITLE TYPOGRAPHY ===
  subtitleColor: z.string().default('#0b6d41'),
  subtitleFontSize: z.enum(['lg', 'xl', '2xl', '3xl']).default('2xl'),
  subtitleFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),

  // === TAGLINE TYPOGRAPHY ===
  taglineColor: z.string().default('#525252'),
  taglineFontSize: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
  taglineFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),

  // === CARD TYPOGRAPHY ===
  cardTitleColor: z.string().default('#1f2937'),
  cardTitleFontSize: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
  cardTitleFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),
  cardStatColor: z.string().default('#0b6d41'),
  cardStatFontSize: z.enum(['xl', '2xl', '3xl', '4xl']).default('3xl'),
  cardStatFontWeight: z.enum(['medium', 'semibold', 'bold', 'extrabold']).default('bold'),

  // === ADDITIONAL USPS TYPOGRAPHY ===
  additionalUspsHeadingColor: z.string().default('#1f2937'),
  additionalUspsHeadingFontSize: z.enum(['md', 'lg', 'xl']).default('lg'),
  additionalUspsHeadingFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),
  additionalUspsTextColor: z.string().default('#374151'),
  additionalUspsTextFontSize: z.enum(['xs', 'sm', 'md']).default('sm'),
  additionalUspsTextFontWeight: z.enum(['normal', 'medium', 'semibold']).default('normal'),

  // === LEGACY PROPS (keep for compatibility) ===
  legacyCard: LegacyCardSchema.optional(),
  placementCard: PlacementCardSchema.optional(),
  primaryColor: z.string().default('#0b6d41'),
})
export type WhyChooseJKKNProps = z.infer<typeof WhyChooseJKKNPropsSchema> & BaseBlockProps

// ==========================================
// Utility Functions for Type Conversion
// ==========================================

/**
 * Convert BlockData (snake_case) to PageBlock (camelCase)
 * Used when passing blocks to the design enhancement engine
 */
export function blockDataToPageBlock(block: BlockData): PageBlock {
  return {
    id: block.id,
    componentName: block.component_name,
    props: block.props,
    sortOrder: block.sort_order,
    parentBlockId: block.parent_block_id,
    isVisible: block.is_visible,
    responsiveSettings: block.responsive_settings,
    customCss: block.custom_css,
    customClasses: block.custom_classes,
  }
}

/**
 * Convert PageBlock (camelCase) back to BlockData (snake_case)
 * Used when applying enhanced blocks back to the page builder
 */
export function pageBlockToBlockData(block: PageBlock): BlockData {
  return {
    id: block.id,
    component_name: block.componentName,
    props: block.props,
    sort_order: block.sortOrder,
    parent_block_id: block.parentBlockId,
    is_visible: block.isVisible,
    responsive_settings: block.responsiveSettings,
    custom_css: block.customCss,
    custom_classes: block.customClasses,
  }
}

/**
 * Convert array of BlockData to PageBlock
 */
export function blocksToPageBlocks(blocks: BlockData[]): PageBlock[] {
  return blocks.map(blockDataToPageBlock)
}

/**
 * Convert array of PageBlock to BlockData
 */
export function pageBlocksToBlockData(blocks: PageBlock[]): BlockData[] {
  return blocks.map(pageBlockToBlockData)
}
