import { z } from 'zod'
import type { ComponentType, ReactNode } from 'react'

/**
 * Component categories for the page builder
 */
export type ComponentCategory = 'content' | 'media' | 'layout' | 'data' | 'shadcn' | 'custom' | 'admissions'

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
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object' | 'color' | 'url' | 'image' | 'video' | 'media' | 'table' | 'richtext'
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
  /** Enable inline canvas editing for this field (Canva-like editing) */
  inlineEditable?: boolean
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
  /** Enable inline canvas editing for this field (Canva-like editing) */
  inlineEditable?: boolean
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
  logoPosition: z.enum(['top', 'between-subtitle-button']).default('top'),
  logoSize: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
  showAiBadge: z.boolean().default(true),
  // Title styling
  titleColor: z.string().default('#ffffff'),
  titleFontSize: z.enum(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']).default('5xl'),
  titleFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('bold'),
  titleFontStyle: z.enum(['normal', 'italic']).default('normal'),
  // Title Typography Enhancement
  titleLineHeight: z.number().min(0.5).max(3).default(1.2),
  titleLetterSpacing: z.number().min(-5).max(20).default(0),
  titleTextAlign: z.enum(['left', 'center', 'right', 'justify']).default('center'),
  titleManualBreakPosition: z.number().min(0).optional(),
  // Subtitle styling
  subtitleColor: z.string().default('#e5e5e5'),
  subtitleFontSize: z.number().min(8).max(120).default(24),
  subtitleFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
  subtitleFontStyle: z.enum(['normal', 'italic']).default('normal'),
  // Subtitle Typography Enhancement
  subtitleLineHeight: z.number().min(0.5).max(3).default(1.5),
  subtitleLetterSpacing: z.number().min(-5).max(20).default(0),
  subtitleTextAlign: z.enum(['left', 'center', 'right', 'justify']).default('center'),
  // Trust Badges settings
  showTrustBadges: z.boolean().default(false),
  trustBadgesStyle: z.enum(['glass', 'solid', 'outline']).default('glass'),
  trustBadgesPosition: z.enum(['below-subtitle', 'below-title', 'below-logo']).default('below-subtitle'),
  trustBadge1Text: z.string().default('NAAC Accredited'),
  trustBadge2Text: z.string().default('95%+ Placements'),
  trustBadge3Text: z.string().default('100+ Top Recruiters'),
  trustBadge4Text: z.string().default('39 Years of Excellence'),
  // Background settings
  backgroundType: z.enum(['image', 'video', 'gradient']).default('image'),
  backgroundImage: z.string().optional(),
  backgroundImageAlt: z.string().default(''),
  backgroundVideo: z.string().optional(),
  videoPosterImage: z.string().optional(), // Poster image for video LCP optimization
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
  title: z.string().default('Frequently Asked Questions'),
  subtitle: z.string().default('Everything you need to know'),
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
      answer: 'JKKN offers 50+ programs across multiple disciplines including Dental Sciences (BDS, MDS), Pharmacy (B.Pharm, M.Pharm, Pharm.D), Engineering & Technology (B.E/B.Tech, M.E/M.Tech), Nursing (B.Sc, M.Sc, GNM), Allied Health Sciencess (BPT, BMLT, B.Sc Radiology), Arts & Science (BA, B.Sc, BCA, BBA, M.A, M.Sc), and Education (B.Ed, M.Ed). Each program is designed with industry-integrated curriculum and hands-on learning experiences.',
    },
    {
      question: 'Is JKKN approved by AICTE, UGC, and other regulatory bodies?',
      answer: 'Yes, all JKKN institutions are fully approved and recognized by respective regulatory bodies. Our colleges hold approvals from AICTE (All India Council for Technical Education), UGC (University Grants Commission), NAAC (National Assessment and Accreditation Council), DCI (Dental Council of India), PCI (Pharmacy Council of India), and INC (Indian Nursing Council). JKKN has achieved NAAC A+ Accreditation, reflecting our commitment to quality education.',
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
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
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

export const EmbedBlockPropsSchema = z.object({
  embedUrl: z.string().default(''),
  embedType: z
    .enum(['iframe', 'youtube', 'vimeo', 'google-maps', 'google-forms', 'google-drive', 'html'])
    .default('iframe'),
  embedCode: z.string().default(''),
  aspectRatio: z.string().default('16/9'),
  allowFullscreen: z.boolean().default(true),
  autoHeight: z.boolean().default(false),
  minHeight: z.string().optional(),
  maxHeight: z.string().optional(),
  borderRadius: z.string().default('8px'),
  showBorder: z.boolean().default(false),
  title: z.string().default('Embedded content'),
  fullWidth: z.boolean().default(false), // Enable full-width breakout
})
export type EmbedBlockProps = z.infer<typeof EmbedBlockPropsSchema> & BaseBlockProps

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

export const SplitLayoutPropsSchema = z.object({
  proportion: z.enum(['50-50', '40-60', '60-40', '33-67', '67-33']).default('50-50'),
  reverse: z.boolean().default(false),
  verticalAlign: z.enum(['start', 'center', 'end', 'stretch']).default('center'),
  gap: z.number().default(8),
  stackOnMobile: z.boolean().default(true),
  mobileBreakpoint: z.enum(['sm', 'md', 'lg']).default('md'),
  background: z.string().optional(),
  padding: z.number().default(0),
})
export type SplitLayoutProps = z.infer<typeof SplitLayoutPropsSchema> & BaseBlockProps

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

export const GridContainerPropsSchema = z.object({
  columns: z.number().default(2),
  gap: z.string().default('2rem'),
  className: z.string().optional(),
  breakpoint: z.enum(['sm', 'md', 'lg']).default('md'),
  id: z.string().optional(),
})
export type GridContainerProps = z.infer<typeof GridContainerPropsSchema> & BaseBlockProps

export const ContentCardPropsSchema = z.object({
  title: z.string(),
  icon: z.string().optional(),
  iconColor: z.string().default('#0b6d41'),
  iconBackground: z.string().default('rgba(234, 241, 226, 0.5)'),
  iconSize: z.number().default(28),
  htmlContent: z.string().optional(),
  backgroundColor: z.string().default('#ffffff'),
  className: z.string().optional(),
  id: z.string().optional(),
})
export type ContentCardProps = z.infer<typeof ContentCardPropsSchema> & BaseBlockProps

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

  // Header Typography
  headerFontFamily: z.string().optional().describe('Font family for header'),
  headerFontSize: z.enum(['3xl', '4xl', '5xl', '6xl']).default('5xl').describe('Font size for header'),
  headerFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('bold').describe('Font weight for header'),

  // Typography Colors
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'), // Gold

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
      name: 'NAAC Accredited',
      description: 'National Assessment and Accreditation Council certification for select Engineering and Pharmacy programs, validating outcome-based education standards.',
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
      description: 'Indian Nursing Council approval for all Nursing programs at Sresakthimayeil Institute Of Nursing And Research.',
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
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
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
  subtitle: z.string().default('73+ Years of Transforming Lives Through Progressive Education'),
  tagline: z.string().default('Where Legacy Meets Innovation | Excellence Without Elitism'),
  badgeText: z.string().default('Why Choose Us'),
  additionalUspsHeading: z.string().default('And Much More...'),

  // USP Cards
  uspCards: z.array(USPCardSchema).default([
    { icon: 'heritage', title: '74+ Years of Educational Legacy' },
    { icon: 'career', title: '92% Placement Success Rate' },
    { icon: 'excellence', title: 'NAAC A Accredited Quality' },
    { icon: 'expertise', title: '400+ Expert Learning Facilitators' },
    { icon: 'facilities', title: 'State-of-the-Art Infrastructure' },
    { icon: 'value', title: 'Affordable & Accessible Education' },
  ]),
  additionalUsps: z.array(z.string()).default([
    '50+ Industry-Relevant Programs across Medical, Engineering, Arts & Science',
    'Multi-Specialty Hospital for clinical training and community healthcare',
    'Industry-Integrated Curriculum with internships and live projects',
    'Research & Innovation Hub with funded projects and patent support',
    'Holistic Development through sports, cultural, and social activities',
    'Safe & Secure Campus with 24/7 security and CCTV surveillance',
    'Strong Alumni Network of 50,000+ professionals worldwide',
    'Entrepreneurship Support through incubation centers and startup mentoring',
  ]),

  // === BADGE TYPOGRAPHY ===
  badgeColor: z.string().default('#0b6d41'),
  badgeBgColor: z.string().default('#0b6d411a'),
  badgeFontSize: z.enum(['sm', 'md', 'lg']).default('sm'),
  badgeFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),

  // === TITLE TYPOGRAPHY ===
  titleFontFamily: z.string().optional().describe('Font family for title'),
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
// Admissions Components Schemas
// ==========================================

// --- CollegesGrid ---
export const CollegeItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  headerColor: z.string().default('#0b6d41'),
  link: z.string().optional(),
  logo: z.string().optional(),
})
export type CollegeItem = z.infer<typeof CollegeItemSchema>

export const CollegesGridPropsSchema = z.object({
  // Header
  badge: z.string().default('OUR COLLEGES'),
  title: z.string().default('Our 7 Colleges'),
  titleAccentWord: z.string().optional().default('Colleges'),
  subtitle: z.string().default('Choose from 7 Premier Institutions Offering 50+ Programs'),

  // Colleges data
  colleges: z.array(CollegeItemSchema).default([
    { name: 'JKKN Dental College & Hospital', description: 'Premier dental education with 500-bed teaching hospital', headerColor: '#0b6d41', link: '/colleges/dental' },
    { name: 'JKKN College of Pharmacy', description: 'B.Pharm, M.Pharm & Pharm.D programs with PCI approval', headerColor: '#1e3a8a', link: '/colleges/pharmacy' },
    { name: 'JKKN College of Engineering', description: 'AICTE approved programs in emerging technologies', headerColor: '#7c2d12', link: '/colleges/engineering' },
    { name: 'Sresakthimayeil Institute of Nursing', description: 'INC approved nursing programs with clinical training', headerColor: '#0f766e', link: '/colleges/nursing' },
    { name: 'JKKN College of Arts & Science', description: 'UG & PG programs in arts, science & commerce', headerColor: '#6b21a8', link: '/colleges/arts-science' },
    { name: 'JKKN College of Allied Health Sciencess', description: 'Specialized healthcare professional programs', headerColor: '#b91c1c', link: '/colleges/allied-health' },
    { name: 'JKKN Educational Institutions', description: 'CBSE & State Board schools with holistic development', headerColor: '#0369a1', link: '/schools' },
  ]),

  // Layout
  columns: z.enum(['2', '3', '4']).default('3'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type CollegesGridProps = z.infer<typeof CollegesGridPropsSchema> & BaseBlockProps

// --- AdmissionProcessTimeline ---
export const AdmissionStepSchema = z.object({
  number: z.number(),
  title: z.string(),
  description: z.string(),
  icon: z.string().default('ClipboardCheck'),
})
export type AdmissionStep = z.infer<typeof AdmissionStepSchema>

export const AdmissionProcessTimelinePropsSchema = z.object({
  // Header
  badge: z.string().default('HOW TO APPLY'),
  title: z.string().default('Admission Process'),
  titleAccentWord: z.string().optional().default('Process'),
  subtitle: z.string().default('Your journey to JKKN in 5 simple steps'),

  // Steps
  steps: z.array(AdmissionStepSchema).default([
    { number: 1, title: 'Choose Your Program', description: 'Explore 50+ programs across 7 colleges', icon: 'Search' },
    { number: 2, title: 'Apply Online', description: 'Fill the application form with required documents', icon: 'FileText' },
    { number: 3, title: 'Document Verification', description: 'Submit originals for verification', icon: 'ClipboardCheck' },
    { number: 4, title: 'Counselling', description: 'Attend counselling session for seat allotment', icon: 'Users' },
    { number: 5, title: 'Admission Confirmation', description: 'Pay fees and confirm your admission', icon: 'CheckCircle' },
  ]),

  // Layout
  orientation: z.enum(['horizontal', 'vertical', 'auto']).default('auto'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  stepColor: z.string().default('#0b6d41'),
  activeColor: z.string().default('#D4AF37'),
  completedColor: z.string().default('#22c55e'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type AdmissionProcessTimelineProps = z.infer<typeof AdmissionProcessTimelinePropsSchema> & BaseBlockProps

// --- AdmissionDatesTable ---
export const AdmissionDateItemSchema = z.object({
  event: z.string(),
  date: z.string(),
  status: z.enum(['upcoming', 'open', 'closed', 'extended']).default('upcoming'),
  notes: z.string().optional(),
})
export type AdmissionDateItem = z.infer<typeof AdmissionDateItemSchema>

export const AdmissionDatesTablePropsSchema = z.object({
  // Header
  badge: z.string().default('IMPORTANT DATES'),
  title: z.string().default('Admission Calendar 2025-26'),
  titleAccentWord: z.string().optional().default('Calendar'),
  subtitle: z.string().default('Mark your calendar with these important admission dates'),

  // Dates
  dates: z.array(AdmissionDateItemSchema).default([
    { event: 'Application Opens', date: 'January 15, 2025', status: 'open' },
    { event: 'Early Bird Deadline', date: 'February 28, 2025', status: 'upcoming' },
    { event: 'Regular Application Deadline', date: 'April 30, 2025', status: 'upcoming' },
    { event: 'Document Submission', date: 'May 15, 2025', status: 'upcoming' },
    { event: 'Counselling Phase 1', date: 'June 1-15, 2025', status: 'upcoming' },
    { event: 'Counselling Phase 2', date: 'June 20-30, 2025', status: 'upcoming' },
    { event: 'Classes Commence', date: 'July 15, 2025', status: 'upcoming' },
  ]),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),
  alternatingRows: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type AdmissionDatesTableProps = z.infer<typeof AdmissionDatesTablePropsSchema> & BaseBlockProps

// --- EligibilityCriteriaTable ---
export const EligibilityCriteriaItemSchema = z.object({
  program: z.string(),
  qualification: z.string(),
  ageLimit: z.string(),
  otherRequirements: z.string().optional(),
  category: z.enum(['medical', 'nursing', 'pharmacy', 'engineering', 'arts-science', 'education']).default('arts-science'),
  details: z.string().optional(),
})
export type EligibilityCriteriaItem = z.infer<typeof EligibilityCriteriaItemSchema>

export const EligibilityCriteriaTablePropsSchema = z.object({
  // Header
  badge: z.string().default('ELIGIBILITY'),
  title: z.string().default('Eligibility Criteria'),
  titleAccentWord: z.string().optional().default('Criteria'),
  subtitle: z.string().default('Check if you meet the requirements for your chosen program'),

  // Criteria
  criteria: z.array(EligibilityCriteriaItemSchema).default([
    { program: 'BDS', qualification: '10+2 with PCB (50%)', ageLimit: '17-25 years', category: 'medical', otherRequirements: 'NEET Qualified' },
    { program: 'MDS', qualification: 'BDS from recognized university', ageLimit: 'No limit', category: 'medical', otherRequirements: 'NEET-MDS Qualified' },
    { program: 'B.Pharm', qualification: '10+2 with PCM/PCB (45%)', ageLimit: '17-25 years', category: 'pharmacy' },
    { program: 'Pharm.D', qualification: '10+2 with PCB (50%)', ageLimit: '17-25 years', category: 'pharmacy' },
    { program: 'B.Sc Nursing', qualification: '10+2 with PCB (45%)', ageLimit: '17-35 years', category: 'nursing' },
    { program: 'GNM', qualification: '10+2 with Science (40%)', ageLimit: '17-35 years', category: 'nursing' },
    { program: 'B.E/B.Tech', qualification: '10+2 with PCM (50%)', ageLimit: '17-25 years', category: 'engineering' },
    { program: 'B.Sc/B.Com/BA', qualification: '10+2 Pass (45%)', ageLimit: 'No limit', category: 'arts-science' },
  ]),

  // Layout
  groupByCategory: z.boolean().default(false),
  expandableRows: z.boolean().default(false),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type EligibilityCriteriaTableProps = z.infer<typeof EligibilityCriteriaTablePropsSchema> & BaseBlockProps

// --- FeeStructureTable ---
export const FeeStructureItemSchema = z.object({
  program: z.string(),
  tuitionFee: z.number(),
  hostelFee: z.number().optional(),
  otherFees: z.number().optional(),
  total: z.number(),
  notes: z.string().optional(),
  category: z.enum(['medical', 'nursing', 'pharmacy', 'engineering', 'arts-science', 'education']).default('arts-science'),
})
export type FeeStructureItem = z.infer<typeof FeeStructureItemSchema>

export const FeeStructureTablePropsSchema = z.object({
  // Header
  badge: z.string().default('FEE STRUCTURE'),
  title: z.string().default('Fee Structure Overview'),
  titleAccentWord: z.string().optional().default('Structure'),
  subtitle: z.string().default('Transparent and affordable fee structure for all programs'),

  // Fees
  fees: z.array(FeeStructureItemSchema).default([
    { program: 'BDS', tuitionFee: 500000, hostelFee: 75000, total: 575000, category: 'medical' },
    { program: 'B.Pharm', tuitionFee: 85000, hostelFee: 60000, total: 145000, category: 'pharmacy' },
    { program: 'B.Sc Nursing', tuitionFee: 75000, hostelFee: 55000, total: 130000, category: 'nursing' },
    { program: 'B.E/B.Tech', tuitionFee: 95000, hostelFee: 60000, total: 155000, category: 'engineering' },
    { program: 'B.Sc/B.Com/BA', tuitionFee: 35000, hostelFee: 50000, total: 85000, category: 'arts-science' },
  ]),

  // Currency
  currencySymbol: z.string().default('₹'),
  currencyLocale: z.string().default('en-IN'),

  // Layout
  showHostelFee: z.boolean().default(true),
  showOtherFees: z.boolean().default(false),
  groupByCategory: z.boolean().default(false),

  // Footer
  footerNotes: z.array(z.string()).default([
    '* Fees are subject to revision as per university/regulatory norms',
    '* Hostel fees are optional and include mess charges',
    '* Scholarships and fee concessions available for eligible students',
  ]),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type FeeStructureTableProps = z.infer<typeof FeeStructureTablePropsSchema> & BaseBlockProps

// --- ScholarshipsSection ---
export const ScholarshipItemSchema = z.object({
  icon: z.string().default('Award'),
  title: z.string(),
  description: z.string(),
  eligibility: z.array(z.string()).default([]),
  type: z.enum(['merit', 'government', 'need-based', 'sports-cultural']).default('merit'),
})
export type ScholarshipItem = z.infer<typeof ScholarshipItemSchema>

export const ScholarshipsSectionPropsSchema = z.object({
  // Header
  badge: z.string().default('SCHOLARSHIPS'),
  title: z.string().default('Scholarships & Financial Aid'),
  titleAccentWord: z.string().optional().default('Financial Aid'),
  subtitle: z.string().default('We believe financial constraints should never limit your dreams'),

  // Scholarships
  scholarships: z.array(ScholarshipItemSchema).default([
    {
      icon: 'Trophy',
      title: 'Merit Scholarships',
      description: 'Up to 100% tuition fee waiver for academic excellence',
      eligibility: ['90%+ in qualifying exam', 'Rank holders in entrance exams', 'Academic toppers in JKKN'],
      type: 'merit',
    },
    {
      icon: 'Building2',
      title: 'Government Scholarships',
      description: 'State and central government scholarship schemes',
      eligibility: ['SC/ST/OBC/MBC categories', 'EWS category students', 'Minority community students'],
      type: 'government',
    },
    {
      icon: 'Heart',
      title: 'Need-Based Aid',
      description: 'Financial support for economically disadvantaged students',
      eligibility: ['Family income below threshold', 'Single parent families', 'Orphan students'],
      type: 'need-based',
    },
    {
      icon: 'Medal',
      title: 'Sports & Cultural',
      description: 'Special quota for sports and cultural achievers',
      eligibility: ['State/National level players', 'Cultural competition winners', 'Outstanding performers'],
      type: 'sports-cultural',
    },
  ]),

  // CTA
  showCTA: z.boolean().default(true),
  ctaText: z.string().default('Apply for Scholarship'),
  ctaLink: z.string().default('/scholarships/apply'),

  // Layout
  columns: z.enum(['2', '4']).default('4'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type ScholarshipsSectionProps = z.infer<typeof ScholarshipsSectionPropsSchema> & BaseBlockProps

// --- DocumentsChecklist ---
export const DocumentItemSchema = z.object({
  text: z.string(),
  required: z.boolean().default(true),
})
export type DocumentItem = z.infer<typeof DocumentItemSchema>

export const DocumentsChecklistPropsSchema = z.object({
  // Header
  badge: z.string().default('DOCUMENTS'),
  title: z.string().default('Documents Required'),
  titleAccentWord: z.string().optional().default('Documents'),
  subtitle: z.string().default('Keep these documents ready for a smooth admission process'),

  // Left column
  leftColumnTitle: z.string().default('For All Programs'),
  leftColumnDocuments: z.array(DocumentItemSchema).default([
    { text: '10th Mark Sheet & Certificate (Original + 2 copies)', required: true },
    { text: '12th Mark Sheet & Certificate (Original + 2 copies)', required: true },
    { text: 'Transfer Certificate from last institution', required: true },
    { text: 'Migration Certificate (if applicable)', required: false },
    { text: 'Community Certificate (for quota)', required: false },
    { text: 'Aadhar Card (Original + 2 copies)', required: true },
    { text: 'Passport Size Photos (10 nos)', required: true },
  ]),

  // Right column
  rightColumnTitle: z.string().default('Additional Documents'),
  rightColumnDocuments: z.array(DocumentItemSchema).default([
    { text: 'NEET Score Card (Medical/Dental/Pharmacy)', required: false },
    { text: 'Entrance Exam Admit Card', required: false },
    { text: 'Income Certificate (for scholarship)', required: false },
    { text: 'Caste Certificate (if applicable)', required: false },
    { text: 'Sports/Cultural Achievement Certificates', required: false },
    { text: 'Gap Certificate (if gap in education)', required: false },
    { text: 'Medical Fitness Certificate', required: true },
  ]),

  // CTA
  showCTA: z.boolean().default(true),
  ctaText: z.string().default('Download Complete Checklist'),
  ctaLink: z.string().default('/downloads/admission-checklist.pdf'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),
  checkIcon: z.enum(['check', 'checkbox', 'circle-check']).default('checkbox'),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type DocumentsChecklistProps = z.infer<typeof DocumentsChecklistPropsSchema> & BaseBlockProps

// --- WhyChooseSection ---
export const WhyChooseFeatureSchema = z.object({
  icon: z.string().default('Star'),
  title: z.string(),
  description: z.string(),
})
export type WhyChooseFeature = z.infer<typeof WhyChooseFeatureSchema>

export const WhyChooseSectionPropsSchema = z.object({
  // Header
  badge: z.string().default('WHY CHOOSE JKKN?'),
  title: z.string().default('Why Choose JKKN?'),
  titleAccentWord: z.string().optional().default('JKKN'),
  subtitle: z.string().default('Discover what makes J.K.K. Nattraja Educational Institutions the preferred choice for thousands of Learners every year.'),

  // Features
  features: z.array(WhyChooseFeatureSchema).default([
    { icon: 'Building2', title: '70+ Years of Legacy', description: 'Established by visionary founder J.K.K. Nataraja Chettiar, JKKN has transformed lives through accessible, progressive education for over seven decades.' },
    { icon: 'GraduationCap', title: '7 Specialized Colleges', description: 'From Dental Sciences to Engineering, Pharmacy to Nursing — choose from diverse disciplines under one trusted institution.' },
    { icon: 'Users', title: 'Learner-Centered Approach', description: 'At JKKN, you\'re an active Learner shaping your future. Our Learning Facilitators guide, mentor, and empower you.' },
    { icon: 'Factory', title: 'Industry-Ready Programs', description: 'Our curriculum integrates theory with practice. State-of-the-art Learning Labs and industry partnerships make graduates career-ready.' },
    { icon: 'Briefcase', title: 'Strong Placement Record', description: '500+ recruiting companies, competitive salary packages, and dedicated placement support ensure seamless transition from campus to career.' },
    { icon: 'Star', title: 'Holistic Development', description: 'Beyond academics, JKKN nurtures well-rounded individuals through sports, cultural activities, community service, and leadership opportunities.' },
  ]),

  // Layout
  columns: z.enum(['2', '3']).default('3'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-light'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type WhyChooseSectionProps = z.infer<typeof WhyChooseSectionPropsSchema> & BaseBlockProps

// --- CampusFeaturesGrid ---
export const CampusFeatureItemSchema = z.object({
  emoji: z.string().default('🏠'),
  title: z.string(),
  description: z.string(),
})
export type CampusFeatureItem = z.infer<typeof CampusFeatureItemSchema>

export const CampusFeaturesGridPropsSchema = z.object({
  // Header
  badge: z.string().default('CAMPUS LIFE'),
  title: z.string().default('Campus Life at JKKN'),
  titleAccentWord: z.string().optional().default('Campus Life'),
  subtitle: z.string().default('Beyond academics — experience a vibrant campus life with world-class facilities.'),

  // Features
  features: z.array(CampusFeatureItemSchema).default([
    { emoji: '🏠', title: 'Hostels', description: 'Separate boys & girls hostels with 24/7 security, Wi-Fi, and home-like comfort.' },
    { emoji: '🍽️', title: 'Dining', description: 'Hygienic, nutritious meals. Veg & non-veg options at central canteen.' },
    { emoji: '📚', title: 'Libraries', description: '50,000+ books, journals, digital resources across all campuses.' },
    { emoji: '🔬', title: 'Learning Labs', description: 'State-of-the-art labs, simulation centers, and research facilities.' },
    { emoji: '🏃', title: 'Sports', description: 'Cricket, basketball, volleyball, indoor games, and fitness center.' },
    { emoji: '🏥', title: 'Healthcare', description: 'On-campus health center and attached hospital facilities.' },
    { emoji: '🚌', title: 'Transport', description: 'College buses covering Namakkal, Salem, Erode & surrounding areas.' },
    { emoji: '🛡️', title: 'Security', description: '24/7 CCTV surveillance, security personnel, strict visitor management.' },
  ]),

  // Layout
  columns: z.enum(['2', '4']).default('4'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-light'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type CampusFeaturesGridProps = z.infer<typeof CampusFeaturesGridPropsSchema> & BaseBlockProps

// --- PlacementsHighlights ---
export const PlacementStatItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
})
export type PlacementStatItem = z.infer<typeof PlacementStatItemSchema>

export const PlacementsHighlightsPropsSchema = z.object({
  // Header
  badge: z.string().default('PLACEMENTS'),
  title: z.string().default('Placement Highlights'),
  titleAccentWord: z.string().optional().default('Placement'),
  subtitle: z.string().default('From campus to career — JKKN Learners are recruited by top companies across industries.'),

  // Stats
  stats: z.array(PlacementStatItemSchema).default([
    { value: '500', suffix: '+', label: 'Recruiting Companies' },
    { value: '95', suffix: '%', label: 'Placement Rate' },
    { value: '8.5', prefix: '₹', suffix: ' LPA', label: 'Highest Package' },
    { value: '3.5', prefix: '₹', suffix: ' LPA', label: 'Average Package' },
  ]),

  // Recruiters
  recruitersText: z.string().default('Top Recruiters: Apollo Hospitals • Infosys • TCS • Wipro • HCL • Dr. Reddy\'s • Cipla • Sun Pharma • L&T • Ashok Leyland • Cognizant • Tech Mahindra • and 500+ more'),

  // CTA
  showCTA: z.boolean().default(true),
  ctaText: z.string().default('View Complete Placement Records'),
  ctaLink: z.string().default('/placements/'),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-light'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type PlacementsHighlightsProps = z.infer<typeof PlacementsHighlightsPropsSchema> & BaseBlockProps

// --- AdmissionHero ---
export const AdmissionHeroBadgeSchema = z.object({
  text: z.string().default('Celebrating #JKKN100 — Founder\'s Centenary Year'),
  emoji: z.string().optional().default('🎉'),
})

export const AdmissionHeroCTAButtonSchema = z.object({
  label: z.string(),
  link: z.string(),
  variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
  isExternal: z.boolean().optional().default(false),
  icon: z.enum(['arrow', 'download', 'external', 'none']).optional().default('arrow'),
})

export const AdmissionHeroTrustBadgeSchema = z.object({
  icon: z.string().optional().default('check'),
  label: z.string(),
})

export const AdmissionHeroPropsSchema = z.object({
  // Badge
  badge: AdmissionHeroBadgeSchema.default({
    text: 'Celebrating #JKKN100 — Founder\'s Centenary Year',
    emoji: '🎉',
  }),

  // Content
  title: z.string().default('Admissions 2025-26'),
  titleAccentWord: z.string().optional().default('2025-26'),
  subtitle: z.string().default('Begin your transformative learning journey at J.K.K. Nattraja Educational Institutions — where 5000+ Learners discover their potential across 7 specialized colleges.'),

  // CTAs
  ctaButtons: z.array(AdmissionHeroCTAButtonSchema).default([
    { label: 'Apply Now', link: 'https://apply.jkkn.ac.in', variant: 'primary' as const, isExternal: true, icon: 'external' as const },
    { label: 'Explore Colleges', link: '#colleges', variant: 'secondary' as const, isExternal: false, icon: 'arrow' as const },
    { label: 'Download Prospectus', link: '/prospectus.pdf', variant: 'outline' as const, isExternal: false, icon: 'download' as const },
  ]),

  // Trust badges
  trustBadges: z.array(AdmissionHeroTrustBadgeSchema).default([
    { icon: 'check', label: 'NAAC Accredited' },
    { icon: 'check', label: 'AICTE Approved' },
    { icon: 'check', label: 'UGC Recognized' },
    { icon: 'check', label: 'NAAC Accredited' },
  ]),

  // Styling
  backgroundColor: z.enum(['gradient-dark', 'gradient-light', 'white-professional', 'solid', 'transparent']).default('gradient-dark'),
  showAnimations: z.boolean().default(true),

  // Typography
  titleColor: z.string().optional(),
  subtitleColor: z.string().optional(),
  accentColor: z.string().default('var(--gold-on-light)'),
})
export type AdmissionHeroProps = z.infer<typeof AdmissionHeroPropsSchema> & BaseBlockProps

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

// ==========================================
// Modern Component Schemas
// ==========================================

export const ModernHeroSectionPropsSchema = HeroSectionPropsSchema

export const BentoItemSchema = z.object({
  title: z.string().describe('Item title'),
  excerpt: z.string().optional().describe('Brief excerpt or description'),
  image: z.string().describe('Image URL'),
  date: z.string().optional().describe('Date (e.g., Jan 10, 2025)'),
  category: z.string().optional().describe('Category tag'),
  link: z.string().optional().describe('Link URL'),
  type: z.enum(['news', 'blog', 'update']).default('news').describe('Item type'),
})

export const ModernBentoGridPropsSchema = z.object({
  title: z.string().default('Campus Buzz & Insights').describe('Section title'),
  subtitle: z.string().default('Stay updated with the latest happenings at JKKN').describe('Section subtitle'),
  items: z.array(BentoItemSchema).default([]).describe('Bento grid items'),
})

export const StorySchema = z.object({
  title: z.string().describe('Story title'),
  subtitle: z.string().optional().describe('Story subtitle'),
  image: z.string().describe('Story image URL'),
  videoUrl: z.string().optional().describe('Optional video URL'),
  link: z.string().optional().describe('Link URL'),
})

export const ModernEducationStoriesPropsSchema = z.object({
  title: z.string().default('Education Stories').describe('Section title'),
  subtitle: z.string().default('Real-World Impact Through Learning').describe('Section subtitle'),
  stories: z.array(StorySchema).default([]).describe('Education stories'),
})

export const ModernAboutSectionPropsSchema = z.object({
  title: z.string().default('Founded on a legacy of excellence and innovation').describe('Main title'),
  experienceYear: z.string().default('39+').describe('Years of experience'),
  subtitle: z.string().default('Elevating Minds, Empowering Futures').describe('Subtitle'),
  description: z.string().default('JKKN is committed to shaping the future of engineering. Our world-class faculty, state-of-the-art facilities, and collaborative environment empower students to become leaders and change makers.').describe('Description text'),
  image: z.string().optional().describe('About section image URL'),
})

export const StatSchema = z.object({
  value: z.number().describe('Statistic value'),
  suffix: z.string().optional().describe('Suffix (e.g., %, +, :1)'),
  label: z.string().describe('Statistic label'),
  icon: z.string().optional().describe('Icon name'),
})

export const ModernStatsBarPropsSchema = z.object({
  stats: z.array(StatSchema).default([]).describe('Statistics to display'),
})

export const LogoItemSchema = z.object({
  src: z.string().describe('Logo image URL'),
  alt: z.string().describe('Logo alt text'),
})

export const ModernLogoMarqueePropsSchema = z.object({
  title: z.string().default('Our Global Placement Partners & Recruiters').describe('Marquee section title'),
  logos: z.array(LogoItemSchema).default([]).describe('Partner/recruiter logos'),
})

export const VideoItemSchema = z.object({
  title: z.string().describe('Video title'),
  duration: z.string().optional().describe('Video duration (e.g., 3:45)'),
  thumbnail: z.string().describe('Video thumbnail URL'),
  videoUrl: z.string().describe('Video URL'),
})

export const ModernVideoHubPropsSchema = z.object({
  title: z.string().default('Video Hub: Experience JKKN').describe('Section title'),
  subtitle: z.string().default('A visual journey through our vibrant campus and academic life').describe('Section subtitle'),
  videos: z.array(VideoItemSchema).default([]).describe('Video items'),
})

// Management/Trust schemas
export const ManagementMemberSchema = z.object({
  name: z.string().describe('Member name'),
  title: z.string().describe('Position/Title'),
  image: z.string().describe('Profile image URL'),
  message: z.string().optional().describe('Message or quote'),
})

export const ModernManagementSectionPropsSchema = z.object({
  title: z.string().default('OUR MANAGEMENT').describe('Section title'),
  subtitle: z.string().default('Visionary Leadership Guiding JKKN').describe('Section subtitle'),
  members: z.array(ManagementMemberSchema).default([
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
  ]).describe('Management team members'),
  showPattern: z.boolean().default(true).describe('Show decorative background pattern'),
})

export const TrustStatItemSchema = z.object({
  icon: z.string().describe('Icon name'),
  value: z.string().describe('Stat value'),
  label: z.string().describe('Stat label'),
})

export const ModernTrustSectionPropsSchema = z.object({
  pageTitle: z.string().default('OUR TRUST').describe('Main page title'),
  pageSubtitle: z.string().default('J.K.K. Rangammal Charitable Trust').describe('Page subtitle'),
  founderName: z.string().default('SHRI. J.K.K. NATARAJAH').describe('Founder name'),
  founderTitle: z.string().default('Founder of J.K.K. Rangammal Charitable Trust').describe('Founder title'),
  founderImage: z.string().default('/images/founder.webp').describe('Founder image URL'),
  founderStory: z.string().default("In the sixties, female children in Kumarapalayam had to walk 2.5 km for their schooling to the nearby town of Bhavani. Realizing the need for women's education, a visionary philanthropist of the zone, Shri J.K.K. Natarajah, initiated a girls' school in the town in 1965.").describe('Short bio about the founder'),
  storyTitle: z.string().default('A Legacy of Service').describe('Story section title'),
  storyContent: z.string().default("The J.K.K. Rangammal Charitable Trust was established in 1969 with the motto of providing literacy and women's empowerment. Walking in the footsteps of her father, Smt. N. Sendamaraai, Managing Trustee, expanded the service by providing multi-disciplinary education to both genders. Now, under the umbrella, there are ten institutions, including Dental, Pharmacy, Nursing, Education, Engineering, Arts, and Science colleges.").describe('Main trust story'),
  stats: z.array(TrustStatItemSchema).default([
    { icon: 'Calendar', value: '1969', label: 'Year Established' },
    { icon: 'Building2', value: '10+', label: 'Institutions' },
    { icon: 'GraduationCap', value: '50000+', label: 'Alumni' },
    { icon: 'Users', value: '5000+', label: 'Current Students' },
  ]).describe('Trust statistics'),
  showPattern: z.boolean().default(true).describe('Show decorative background pattern'),
})

export const ModernPrincipalMessagePropsSchema = z.object({
  title: z.string().default("Principal's Message").describe('Section title'),
  name: z.string().default('Dr. C. Kathirvel').describe('Principal Name'),
  role: z.string().default('Principal').describe('Principal Role/Title'),
  image: z.string().default('/images/principal.jpg').describe('Principal Image URL'),
  messagePart1: z.string().default("JKKN College of Engineering and Technology is an emerging AI Powered institute, dedicated to providing top-tier education since its establishment in 2008. Our vision is to be a Leading Global Innovative Solutions provider for the ever-changing needs of society, and we are steadfast in our commitment to this goal. At JKKN, we equip our learners with advanced engineering knowledge and skills, preparing them to tackle complex challenges and contribute effectively to the engineering landscape. Our curriculum is meticulously designed to integrate cutting-edge technology and hands-on learning experiences, ensuring our students are well-prepared for the dynamic demands of the industry.").describe('First paragraph'),
  messagePart2: z.string().default("We pride ourselves on fostering an environment that encourages collaboration and innovation. Our mission is to facilitate students in collaborating with bioconvergence disciplines, nurturing them into leaders who are poised to make significant contributions to sustainable development. We believe that interdisciplinary knowledge and teamwork are essential in solving global issues, and we provide our students with opportunities to engage in such collaborative efforts. Our dedicated faculty members are committed to guiding and mentoring students, instilling in them a passion for continuous learning and excellence. We continuously upgrade our infrastructure and teaching methodologies to stay abreast of the latest advancements in engineering education. As we continue to grow and evolve, we remain focused on our vision and mission, striving to make a positive impact on society through innovative solutions and sustainable practices. I invite you to explore the myriad opportunities that JKKN College of Engineering and Technology offers and join us in our journey towards excellence.").describe('Second paragraph'),
  showPattern: z.boolean().default(true).describe('Show decorative background pattern'),
})

export const OrgMemberSchema = z.object({
  id: z.string().describe('Unique ID'),
  managerId: z.string().optional().describe('Manager ID'),
  name: z.string().describe('Role / Title'),
  role: z.string().optional().describe('Subtitle (Optional)'),
  variant: z.enum(['green', 'orange', 'yellow', 'magenta', 'purple', 'red', 'maroon', 'blue', 'dark-purple']).default('green').describe('Color Theme'),
})

export const ModernOrganogramSectionPropsSchema = z.object({
  title: z.string().default('Institutional Organogram').describe('Chart Title Box'),
  members: z.array(OrgMemberSchema).default([
    // Level 1: Chairman
    { id: 'chairman', name: 'Chairman', variant: 'green' },
    // Level 2: Directors (Siblings reporting to Chairman)
    { id: 'md', managerId: 'chairman', name: 'Managing Director', variant: 'green' },
    { id: 'director', managerId: 'chairman', name: 'Director', variant: 'green' },
    { id: 'jd', managerId: 'chairman', name: 'Joint Director', variant: 'green' },
  ]).describe('Organizational chart members'),
  showPattern: z.boolean().default(true).describe('Show decorative background pattern'),
})

// Modern Transport Section
export const TransportFeatureSchema = z.object({
  icon: z.string().describe('Icon name'),
  title: z.string().describe('Feature title'),
  description: z.string().describe('Feature description'),
})

export const TransportImageSchema = z.object({
  src: z.string().describe('Image URL'),
  alt: z.string().optional().describe('Image alt text'),
})

export const BusRouteSchema = z.object({
  route: z.string().describe('Route name (From College)'),
  distance: z.number().describe('Distance in km'),
  buses: z.number().describe('Number of buses'),
})

export const ModernTransportSectionPropsSchema = z.object({
  pageTitle: z.string().default('TRANSPORT').describe('Main page title'),
  pageSubtitle: z.string().default('Safe & Reliable Transportation').describe('Page subtitle'),
  introduction: z.string().default('Transportation is an essential aspect of any educational institution. It provides students and faculty members with a convenient way to reach the campus and enhances the overall educational experience. JKKN Educational Institutions understand the importance of transportation and have made significant efforts to improve their transport facilities.').describe('Introduction text'),
  images: z.array(TransportImageSchema).default([
    { src: '/images/facilities/transport-1.jpg', alt: 'College bus fleet' },
    { src: '/images/facilities/transport-2.jpg', alt: 'Modern buses' },
  ]).describe('Gallery images'),
  features: z.array(TransportFeatureSchema).default([
    { icon: 'Wrench', title: 'Well-Maintained Buses', description: 'The transport facility at JKKN Educational Institutions is equipped with a well-maintained fleet of buses. These buses are regularly serviced and cleaned to ensure the safety and comfort of the passengers. Moreover, the buses are equipped with modern amenities like air-conditioning, comfortable seating, and GPS tracking.' },
    { icon: 'UserCheck', title: 'Trained Drivers', description: 'The drivers who operate the buses at JKKN Educational Institutions are highly trained and experienced. They have a good understanding of the local routes and traffic conditions, which helps them provide a safe and efficient transportation service. Additionally, they undergo regular training sessions to keep their skills up to date.' },
    { icon: 'Banknote', title: 'Affordable Fees', description: 'The transport facility at JKKN Educational Institutions is available to all students and faculty members at an affordable fee. The fee is calculated based on the distance of the student\'s residence from the campus, ensuring that the transportation cost is reasonable for everyone.' },
    { icon: 'Shield', title: 'Safe and Secure', description: 'The safety and security of the passengers are of utmost importance at JKKN Educational Institutions. The buses are equipped with CCTV cameras, and there are female attendants on board to ensure the safety of female passengers. Additionally, the transport facility operates within a strict set of rules and regulations, ensuring that the passengers are always safe.' },
    { icon: 'Clock', title: 'Timely Service', description: 'The transport facility at JKKN Educational Institutions operates on a strict schedule, ensuring that the buses arrive and depart from the campus on time. This allows the students and faculty members to plan their day accordingly, without worrying about delays or missed buses.' },
    { icon: 'Accessibility', title: 'Accessibility', description: 'The transport facility at JKKN Educational Institutions is accessible to all students, regardless of their physical abilities. The buses are equipped with wheelchair ramps and other accessibility features, making it easy for students with disabilities to use the service.' },
  ]).describe('Transport features'),
  busRoutes: z.array(BusRouteSchema).default([
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
  ]).describe('Bus routes with distance and number of buses'),
  districtsCovered: z.array(z.string()).default(['Namakkal', 'Salem', 'Erode', 'Tiruppur']).describe('Districts covered'),
  transportInchargeName: z.string().default('Mr. Mani').describe('Transport incharge name'),
  transportInchargePhone: z.string().default('+91 9976772223, 9655177177').describe('Transport incharge phone'),
  showPattern: z.boolean().default(true).describe('Show decorative background pattern'),
})


// ==========================================
// Page-Level Settings
// ==========================================

/**
 * Page-level styling settings for the page builder
 * Controls background, glassmorphism, layout, and custom CSS
 */
export interface CmsPageSettings {
  // Background
  background?: {
    type: 'color' | 'gradient' | 'image'
    color?: string
    gradient?: string              // Tailwind class or CSS gradient
    gradientStops?: {              // For visual gradient builder
      color: string
      position: number             // 0-100%
    }[]
    image?: string
    imagePosition?: string
    imageSize?: string
  }

  // Glassmorphism
  glassmorphism?: {
    enabled: boolean
    preset?: 'subtle' | 'medium' | 'intense' | 'colorful'
    blur?: number                  // 4-24
    transparency?: number          // 0-100
    borderGlow?: boolean
  }

  // Page Layout
  layout?: {
    minHeight?: string
    maxWidth?: string
    padding?: {
      top?: number
      bottom?: number
      left?: number
      right?: number
    }
  }

  // Custom Styling
  customCss?: string
}
