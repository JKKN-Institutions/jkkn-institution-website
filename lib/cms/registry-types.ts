import { z } from 'zod'
import type { ComponentType, ReactNode } from 'react'

/**
 * Component categories for the page builder
 */
export type ComponentCategory = 'content' | 'media' | 'layout' | 'data'

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
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'color' | 'url'
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
  /** Whether to show multiline textarea for string type */
  multiline?: boolean
  /** Placeholder text */
  placeholder?: string
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
  /** Preview image URL for the component palette */
  previewImage?: string
  /** Keywords for search */
  keywords?: string[]
  /** Editable properties for the dynamic form */
  editableProps?: EditableProp[]
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
 * Props for the PageRenderer component
 */
export interface PageRendererProps {
  blocks: BlockData[]
  isEditing?: boolean
}

/**
 * Context for the page builder
 */
export interface PageBuilderContextValue {
  blocks: BlockData[]
  selectedBlockId: string | null
  selectBlock: (id: string | null) => void
  addBlock: (componentName: string, props?: Record<string, unknown>, insertAt?: number) => void
  updateBlock: (id: string, updates: Partial<BlockData>) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (id: string, direction: 'up' | 'down') => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  isDirty: boolean
  isSaving: boolean
}

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
  backgroundType: z.enum(['image', 'video', 'gradient']).default('image'),
  backgroundImage: z.string().optional(),
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
})
export type FAQItem = z.infer<typeof FAQItemSchema>

export const FAQAccordionPropsSchema = z.object({
  faqs: z.array(FAQItemSchema).default([]),
  searchEnabled: z.boolean().default(true),
  allowMultiple: z.boolean().default(false),
})
export type FAQAccordionProps = z.infer<typeof FAQAccordionPropsSchema> & BaseBlockProps

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
  afterImage: z.string().default(''),
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
