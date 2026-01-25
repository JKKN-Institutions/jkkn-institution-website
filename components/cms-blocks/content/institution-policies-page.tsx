'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  ExternalLink,
  Lightbulb,
  Award,
  BookMarked,
  Beaker,
  Recycle,
  Users,
  Briefcase,
  Calendar,
  Sparkles,
  FileStack,
  TreeDeciduous,
  ClipboardCheck,
  MessageCircle,
  Download,
  Shield,
  GraduationCap,
  Search,
  Filter,
  Home,
  ChevronRight,
  ScrollText,
  type LucideIcon,
} from 'lucide-react'

// ==========================================
// Types & Schemas
// ==========================================

/**
 * Policy categories
 */
export const PolicyCategoryEnum = z.enum([
  'academic',
  'administrative',
  'hr',
  'research',
  'student',
  'environment',
  'communication',
  'general',
])

export type PolicyCategory = z.infer<typeof PolicyCategoryEnum>

/**
 * Individual policy item schema
 */
export const PolicyItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: PolicyCategoryEnum.default('general'),
  icon: z.string().optional(),
  pdfUrl: z.string(),
  fileSize: z.string().optional(),
  lastUpdated: z.string().optional(),
})

export type PolicyItem = z.infer<typeof PolicyItemSchema>

/**
 * InstitutionPoliciesPage props schema
 */
export const InstitutionPoliciesPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('Institution Policies'),
  headerSubtitle: z.string().optional(),
  headerStyle: z.enum(['hero', 'compact', 'minimal']).default('compact'),

  // Breadcrumb
  showBreadcrumb: z.boolean().default(false),
  breadcrumbLabel: z.string().default('Institution Policies'),
  homeUrl: z.string().default('/'),

  // Content
  policies: z.array(PolicyItemSchema).default([]),

  // Display Options
  layout: z.enum(['grid', 'list', 'categorized']).default('grid'),
  columns: z.enum(['2', '3', '4']).default('3'),
  showCategories: z.boolean().default(true),
  showFileSize: z.boolean().default(true),
  showLastUpdated: z.boolean().default(true),
  showDescription: z.boolean().default(true),
  showSearch: z.boolean().default(false),
  showCategoryFilter: z.boolean().default(false),
  showPolicyCount: z.boolean().default(true),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'cream']).default('cream'),
  cardStyle: z.enum(['glass', 'solid', 'gradient', 'outline', 'elevated']).default('elevated'),
  showDecorations: z.boolean().default(true),
  enableAnimations: z.boolean().default(true),
})

export type InstitutionPoliciesPageProps = z.infer<typeof InstitutionPoliciesPagePropsSchema> & BaseBlockProps

// ==========================================
// Icon Mapping
// ==========================================

function getIconComponent(iconName?: string): LucideIcon {
  switch (iconName) {
    case 'Lightbulb':
      return Lightbulb
    case 'Award':
      return Award
    case 'BookMarked':
      return BookMarked
    case 'Beaker':
      return Beaker
    case 'Recycle':
      return Recycle
    case 'Users':
      return Users
    case 'Briefcase':
      return Briefcase
    case 'Calendar':
      return Calendar
    case 'Sparkles':
      return Sparkles
    case 'FileStack':
      return FileStack
    case 'TreeDeciduous':
      return TreeDeciduous
    case 'ClipboardCheck':
      return ClipboardCheck
    case 'MessageCircle':
      return MessageCircle
    case 'Download':
      return Download
    case 'Shield':
      return Shield
    case 'GraduationCap':
      return GraduationCap
    case 'ScrollText':
      return ScrollText
    default:
      return FileText
  }
}

// ==========================================
// Category Styling
// ==========================================

const CATEGORY_CONFIG: Record<
  PolicyCategory,
  {
    label: string
    bgColor: string
    textColor: string
    borderColor: string
    gradientFrom: string
    gradientTo: string
    gradientFromHex: string
    gradientToHex: string
  }
> = {
  academic: {
    label: 'Academic',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-200',
    gradientTo: 'to-primary-300',
    gradientFromHex: '#c7f0dd',
    gradientToHex: '#9fe5c4',
  },
  hr: {
    label: 'HR & Admin',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-600',
    gradientTo: 'to-primary-700',
    gradientFromHex: '#085032',
    gradientToHex: '#064227',
  },
  research: {
    label: 'Research',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-400',
    gradientTo: 'to-primary-500',
    gradientFromHex: '#3ec57b',
    gradientToHex: '#0f8f56',
  },
  student: {
    label: 'Student',
    bgColor: 'bg-primary-100',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-500',
    gradientTo: 'to-primary-600',
    gradientFromHex: '#0f8f56',
    gradientToHex: '#0b6d41',
  },
  environment: {
    label: 'Environment',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-300',
    gradientTo: 'to-primary-400',
    gradientFromHex: '#9fe5c4',
    gradientToHex: '#6dd1a1',
  },
  administrative: {
    label: 'Administrative',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-700',
    gradientTo: 'to-primary-800',
    gradientFromHex: '#064227',
    gradientToHex: '#032816',
  },
  communication: {
    label: 'Communication',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-100',
    gradientTo: 'to-primary-200',
    gradientFromHex: '#e5f7ee',
    gradientToHex: '#c7f0dd',
  },
  general: {
    label: 'General',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-700',
    borderColor: 'border-primary-200',
    gradientFrom: 'from-primary-400',
    gradientTo: 'to-primary-500',
    gradientFromHex: '#3ec57b',
    gradientToHex: '#0f8f56',
  },
}

// ==========================================
// Default Policy Items (Engineering College)
// ==========================================

const defaultPolicies: PolicyItem[] = [
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
]

// ==========================================
// Hooks
// ==========================================

/**
 * Intersection Observer hook for scroll animations
 */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// ==========================================
// Sub-Components
// ==========================================

/**
 * Breadcrumb Component
 */
function Breadcrumb({
  homeUrl,
  currentPage,
}: {
  homeUrl: string
  currentPage: string
}) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link
        href={homeUrl}
        className="flex items-center gap-1.5 text-gray-500 hover:text-[#0b6d41] transition-colors duration-300"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-400" />
      <span className="text-[#0b6d41] font-medium">{currentPage}</span>
    </nav>
  )
}

/**
 * Page Header Component - Compact Style
 */
function CompactHeader({
  title,
  subtitle,
  policyCount,
  showPolicyCount,
  isInView,
  enableAnimations,
}: {
  title: string
  subtitle?: string
  policyCount: number
  showPolicyCount: boolean
  isInView: boolean
  enableAnimations: boolean
}) {
  return (
    <div
      className={cn(
        'mb-8 transition-all duration-700',
        enableAnimations && (isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      )}
    >
      {/* Title Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            {title}
          </h1>
          {/* Decorative underline */}
          <div className="flex items-center gap-2 mt-3">
            <div className="h-1 w-16 bg-gradient-to-r from-[#0b6d41] to-[#0a5c37] rounded-full" />
            <div className="h-1 w-8 bg-[#ffde59] rounded-full" />
            <div className="h-1 w-4 bg-[#0b6d41]/30 rounded-full" />
          </div>
        </div>

        {/* Policy Count Badge */}
        {showPolicyCount && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0b6d41] to-[#0a5c37] text-white shadow-md">
            <ScrollText className="w-4 h-4" />
            <span className="text-sm font-medium">{policyCount} Policies</span>
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-gray-600 text-base md:text-lg max-w-3xl">{subtitle}</p>
      )}
    </div>
  )
}

/**
 * Page Header Component - Hero Style
 */
function HeroHeader({
  title,
  subtitle,
  policyCount,
  showPolicyCount,
  showDecorations,
  isInView,
  enableAnimations,
}: {
  title: string
  subtitle?: string
  policyCount: number
  showPolicyCount: boolean
  showDecorations: boolean
  isInView: boolean
  enableAnimations: boolean
}) {
  return (
    <div className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#0b6d41] via-[#0a5c37] to-[#084d2d] rounded-2xl mb-8 overflow-hidden">
      {/* Header decorations */}
      {showDecorations && (
        <>
          <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute bottom-6 right-12 w-20 h-20 rounded-full bg-[#ffde59]/10" />
          <div className="absolute top-1/2 right-6 w-12 h-12 rounded-full bg-white/5" />
        </>
      )}

      <div className="relative z-10 text-center px-4">
        <div
          className={cn(
            'transition-all duration-700',
            enableAnimations && (isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <ScrollText className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base md:text-lg text-white/80 mb-4 max-w-2xl mx-auto">{subtitle}</p>
          )}

          {/* Policy Count Badge */}
          {showPolicyCount && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-white/70 text-sm">Total Policies:</span>
              <span className="text-[#ffde59] font-semibold">{policyCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Category Badge Component
 */
function CategoryBadge({
  category,
  isDark,
}: {
  category: PolicyCategory
  isDark: boolean
}) {
  const config = CATEGORY_CONFIG[category]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold',
        isDark
          ? 'bg-white/10 text-white/80 border border-white/20'
          : cn(config.bgColor, config.textColor, 'border', config.borderColor)
      )}
    >
      {config.label}
    </span>
  )
}

/**
 * Enhanced Policy Card Component
 */
function PolicyCard({
  policy,
  index,
  variant,
  cardStyle,
  showCategories,
  showFileSize,
  showLastUpdated,
  showDescription,
  enableAnimations,
}: {
  policy: PolicyItem
  index: number
  variant: 'modern-dark' | 'modern-light' | 'cream'
  cardStyle: 'glass' | 'solid' | 'gradient' | 'outline' | 'elevated'
  showCategories: boolean
  showFileSize: boolean
  showLastUpdated: boolean
  showDescription: boolean
  enableAnimations: boolean
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = getIconComponent(policy.icon)
  const isDark = variant === 'modern-dark'
  const categoryConfig = CATEGORY_CONFIG[policy.category]

  const cardStyles = {
    glass: cn(
      'backdrop-blur-md border',
      isDark
        ? 'bg-white/10 border-white/20 hover:bg-white/15'
        : 'bg-white/90 border-primary-100/50 shadow-lg hover:shadow-xl'
    ),
    solid: cn(
      'border',
      isDark
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
        : 'bg-white border-primary-100 shadow-lg hover:shadow-xl'
    ),
    gradient: cn(
      'border',
      isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 border-primary-200 shadow-lg hover:shadow-xl'
    ),
    outline: cn(
      'border-2',
      isDark
        ? 'bg-transparent border-white/30 hover:bg-white/5 hover:border-white/50'
        : 'bg-transparent border-primary-200 hover:bg-white hover:border-primary-400 hover:shadow-lg'
    ),
    elevated: cn(
      'border bg-white border-primary-100/60',
      'shadow-[0_4px_20px_-4px_rgba(11,109,65,0.08)]',
      'hover:shadow-[0_8px_30px_-8px_rgba(11,109,65,0.15)]',
      'hover:border-primary-300'
    ),
  }

  return (
    <div
      ref={ref}
      className={cn(
        'group relative rounded-2xl p-5 md:p-6 transition-all duration-500',
        'hover:-translate-y-1',
        cardStyles[cardStyle],
        enableAnimations && (isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      )}
      style={{ transitionDelay: enableAnimations ? `${index * 80}ms` : '0ms' }}
    >
      {/* Top Row: Icon and Category */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon with Category-based gradient */}
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center',
            'group-hover:scale-110 transition-transform duration-300',
            'shadow-md'
          )}
          style={{
            background: `linear-gradient(to bottom right, ${categoryConfig.gradientFromHex}, ${categoryConfig.gradientToHex})`,
          }}
        >
          <IconComponent className="w-5 h-5 text-white" />
        </div>

        {/* Category Badge */}
        {showCategories && <CategoryBadge category={policy.category} isDark={isDark} />}
      </div>

      {/* Title */}
      <h3
        className={cn(
          'text-base md:text-lg font-bold mb-2 line-clamp-2 min-h-[2.5rem]',
          isDark ? 'text-white' : 'text-gray-900',
          'group-hover:text-[#0b6d41] transition-colors duration-300'
        )}
      >
        {policy.title}
      </h3>

      {/* Description */}
      {showDescription && policy.description && (
        <p
          className={cn(
            'text-sm mb-4 line-clamp-2 min-h-[2.5rem]',
            isDark ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          {policy.description}
        </p>
      )}

      {/* Metadata Row */}
      <div
        className={cn(
          'flex items-center flex-wrap gap-2 text-xs mb-4',
          isDark ? 'text-gray-500' : 'text-primary-700'
        )}
      >
        <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-50/60 text-primary-700 border border-primary-100 rounded-md">
          <FileText className="w-3 h-3" />
          <span className="font-medium">PDF</span>
        </div>
        {showFileSize && policy.fileSize && (
          <span className="px-2 py-1 bg-primary-50/60 text-primary-700 border border-primary-100 rounded-md">{policy.fileSize}</span>
        )}
        {showLastUpdated && policy.lastUpdated && (
          <span className="px-2 py-1 bg-primary-50/60 text-primary-700 border border-primary-100 rounded-md">{policy.lastUpdated}</span>
        )}
      </div>

      {/* View Document Button */}
      <a
        href={policy.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl',
          'font-medium text-sm',
          'bg-gradient-to-r from-[#0b6d41] to-[#0a5c37] text-white',
          'hover:from-[#0a5c37] hover:to-[#084d2d]',
          'shadow-md hover:shadow-lg',
          'transform transition-all duration-300',
          'group-hover:scale-[1.02]'
        )}
      >
        <ExternalLink className="w-4 h-4" />
        View Document
      </a>

      {/* Decorative hover effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100',
          'bg-gradient-to-br from-primary-500/5 to-transparent',
          'transition-opacity duration-300 pointer-events-none'
        )}
      />
    </div>
  )
}

/**
 * Category Filter Component
 */
function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isDark,
}: {
  categories: PolicyCategory[]
  selectedCategory: PolicyCategory | 'all'
  onSelectCategory: (category: PolicyCategory | 'all') => void
  isDark: boolean
}) {
  const uniqueCategories = Array.from(new Set(categories))

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
          selectedCategory === 'all'
            ? 'bg-primary-500 text-white shadow-md'
            : isDark
              ? 'bg-white/10 text-white/70 hover:bg-white/20'
              : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
        )}
      >
        All Policies
      </button>
      {uniqueCategories.map((category) => {
        const config = CATEGORY_CONFIG[category]
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
              selectedCategory === category
                ? 'bg-primary-500 text-white shadow-md'
                : isDark
                  ? 'bg-white/10 text-white/70 hover:bg-white/20'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
            )}
          >
            {config.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Search Input Component
 */
function SearchInput({
  value,
  onChange,
  isDark,
}: {
  value: string
  onChange: (value: string) => void
  isDark: boolean
}) {
  return (
    <div className="relative mb-6">
      <Search
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5',
          isDark ? 'text-gray-500' : 'text-gray-400'
        )}
      />
      <input
        type="text"
        placeholder="Search policies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full pl-12 pr-4 py-3 rounded-xl',
          'border focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          'transition-all duration-300',
          isDark
            ? 'bg-white/10 border-primary-700/50 text-white placeholder-gray-500'
            : 'bg-white border-primary-200 text-gray-900 placeholder-gray-400 shadow-sm'
        )}
      />
    </div>
  )
}

// ==========================================
// Main Component
// ==========================================

export default function InstitutionPoliciesPage({
  showHeader = true,
  headerTitle = 'Institution Policies',
  headerSubtitle,
  headerStyle = 'compact',
  showBreadcrumb = true,
  breadcrumbLabel = 'Institution Policies',
  homeUrl = '/',
  policies = defaultPolicies,
  layout = 'grid',
  columns = '3',
  showCategories = true,
  showFileSize = true,
  showLastUpdated = true,
  showDescription = true,
  showSearch = false,
  showCategoryFilter = false,
  showPolicyCount = true,
  variant = 'cream',
  cardStyle = 'elevated',
  showDecorations = true,
  enableAnimations = true,
  className,
}: InstitutionPoliciesPageProps) {
  const { ref: headerRef, isInView: headerInView } = useInView(0.1)
  const isDark = variant === 'modern-dark'

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory | 'all'>('all')

  const displayPolicies = policies.length > 0 ? policies : defaultPolicies

  // Filter policies
  const filteredPolicies = displayPolicies.filter((policy) => {
    const matchesSearch =
      !searchQuery ||
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories from policies
  const policyCategories = displayPolicies.map((p) => p.category)

  // Column class mapping
  const columnClasses = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const backgroundStyles = {
    'modern-dark': 'bg-gray-900',
    'modern-light': 'bg-gray-50',
    'cream': 'bg-[#fbfbee]',
  }

  return (
    <section
      className={cn(
        'relative w-full min-h-screen overflow-hidden',
        backgroundStyles[variant],
        className
      )}
    >
      {/* Background Decorations */}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient overlay */}
          <div
            className={cn(
              'absolute top-0 left-0 w-full h-96',
              'bg-gradient-to-b',
              isDark ? 'from-primary-500/20 to-transparent' : 'from-primary-500/5 to-transparent'
            )}
          />

          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-secondary-400/8 blur-3xl" />
          <div className="absolute top-96 left-10 w-48 h-48 rounded-full bg-primary-500/5 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-56 h-56 rounded-full bg-primary-300/8 blur-3xl" />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <Breadcrumb homeUrl={homeUrl} currentPage={breadcrumbLabel} />
          )}

          {/* Header */}
          {showHeader && (
            <div ref={headerRef}>
              {headerStyle === 'hero' ? (
                <HeroHeader
                  title={headerTitle}
                  subtitle={headerSubtitle}
                  policyCount={displayPolicies.length}
                  showPolicyCount={showPolicyCount}
                  showDecorations={showDecorations}
                  isInView={headerInView}
                  enableAnimations={enableAnimations}
                />
              ) : headerStyle === 'compact' ? (
                <CompactHeader
                  title={headerTitle}
                  subtitle={headerSubtitle}
                  policyCount={displayPolicies.length}
                  showPolicyCount={showPolicyCount}
                  isInView={headerInView}
                  enableAnimations={enableAnimations}
                />
              ) : (
                /* Minimal header */
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{headerTitle}</h1>
                  {headerSubtitle && <p className="text-gray-600 mt-2">{headerSubtitle}</p>}
                </div>
              )}
            </div>
          )}

          {/* Search and Filter Controls */}
          {(showSearch || showCategoryFilter) && (
            <div className="mb-6">
              {showSearch && (
                <SearchInput value={searchQuery} onChange={setSearchQuery} isDark={isDark} />
              )}
              {showCategoryFilter && (
                <CategoryFilter
                  categories={policyCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  isDark={isDark}
                />
              )}
            </div>
          )}

          {/* No Results Message */}
          {filteredPolicies.length === 0 && (
            <div
              className={cn(
                'text-center py-16',
                isDark ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No policies found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filter.</p>
            </div>
          )}

          {/* Grid Layout */}
          {layout === 'grid' && filteredPolicies.length > 0 && (
            <div className={cn('grid grid-cols-1 gap-5', columnClasses[columns])}>
              {filteredPolicies.map((policy, index) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  index={index}
                  variant={variant}
                  cardStyle={cardStyle}
                  showCategories={showCategories}
                  showFileSize={showFileSize}
                  showLastUpdated={showLastUpdated}
                  showDescription={showDescription}
                  enableAnimations={enableAnimations}
                />
              ))}
            </div>
          )}

          {/* List Layout */}
          {layout === 'list' && filteredPolicies.length > 0 && (
            <div className="space-y-4">
              {filteredPolicies.map((policy, index) => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  index={index}
                  variant={variant}
                  cardStyle={cardStyle}
                  showCategories={showCategories}
                  showFileSize={showFileSize}
                  showLastUpdated={showLastUpdated}
                  showDescription={showDescription}
                  enableAnimations={enableAnimations}
                />
              ))}
            </div>
          )}

          {/* Categorized Layout */}
          {layout === 'categorized' && filteredPolicies.length > 0 && (
            <div className="space-y-10">
              {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
                const categoryPolicies = filteredPolicies.filter(
                  (p) => p.category === category
                )
                if (categoryPolicies.length === 0) return null

                return (
                  <div key={category}>
                    <h2
                      className={cn(
                        'text-xl md:text-2xl font-bold mb-5 flex items-center gap-3',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(to bottom right, ${config.gradientFromHex}, ${config.gradientToHex})`,
                        }}
                      >
                        <ScrollText className="w-4 h-4 text-white" />
                      </span>
                      {config.label}
                      <span className="text-sm font-normal text-gray-500">
                        ({categoryPolicies.length})
                      </span>
                    </h2>
                    <div className={cn('grid grid-cols-1 gap-5', columnClasses[columns])}>
                      {categoryPolicies.map((policy, index) => (
                        <PolicyCard
                          key={policy.id}
                          policy={policy}
                          index={index}
                          variant={variant}
                          cardStyle={cardStyle}
                          showCategories={false}
                          showFileSize={showFileSize}
                          showLastUpdated={showLastUpdated}
                          showDescription={showDescription}
                          enableAnimations={enableAnimations}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
