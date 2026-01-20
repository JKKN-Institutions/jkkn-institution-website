'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import {
  ChevronRight,
  Home,
  FileText,
  Award,
  GraduationCap,
  FileCheck2,
  ExternalLink,
  Shield,
  Building2,
  Scale,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

// ==========================================
// Types & Schemas
// ==========================================

/**
 * Individual approval document schema
 */
export const ApprovalDocumentSchema = z.object({
  id: z.string(),
  buttonLabel: z.string(),
  pdfUrl: z.string(),
  fileSize: z.string().optional(),
})

export type ApprovalDocument = z.infer<typeof ApprovalDocumentSchema>

/**
 * Section schema (group of documents)
 */
export const ApprovalSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  documents: z.array(ApprovalDocumentSchema),
})

export type ApprovalSection = z.infer<typeof ApprovalSectionSchema>

/**
 * ApprovalsAffiliationSection props schema
 */
export const ApprovalsAffiliationSectionPropsSchema = z.object({
  // Header
  pageTitle: z.string().default('APPROVALS AND AFFILIATION'),
  pageSubtitle: z.string().optional(),
  breadcrumbLabel: z.string().default('APPROVALS AND AFFILIATION'),
  showBreadcrumb: z.boolean().default(false),
  homeUrl: z.string().default('/'),

  // Content
  sections: z.array(ApprovalSectionSchema).default([]),

  // Layout & Style
  layout: z.enum(['simple', 'cards']).default('cards'),
  cardStyle: z.enum(['glass', 'solid', 'gradient', 'outline']).default('glass'),
  buttonStyle: z.enum(['solid', 'gradient', 'outline']).default('gradient'),

  // Features
  showSectionIcons: z.boolean().default(true),
  showDownloadIcon: z.boolean().default(true),
  enableAnimations: z.boolean().default(true),
  showDecorations: z.boolean().default(true),

  // PDF Behavior
  pdfOpenMode: z.enum(['same-tab', 'new-tab']).default('new-tab'),

  // Background
  variant: z.enum(['light', 'cream', 'gradient']).default('cream'),
})

export type ApprovalsAffiliationSectionProps = z.infer<typeof ApprovalsAffiliationSectionPropsSchema> & BaseBlockProps

// ==========================================
// Icon Mapping
// ==========================================

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  GraduationCap,
  FileCheck2,
  FileText,
  Shield,
  Building2,
  Scale,
}

function getIconComponent(iconName?: string): LucideIcon {
  if (!iconName) return FileText
  return ICON_MAP[iconName] || FileText
}

// ==========================================
// Default Data (Engineering College)
// ==========================================

const defaultSections: ApprovalSection[] = [
  {
    id: '1',
    title: 'AICTE Extension of Approval (EOA)',
    icon: 'Award',
    documents: [
      {
        id: '1-1',
        buttonLabel: 'AICTE EOA 2008-2023',
        pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_1/view',
      },
      {
        id: '1-2',
        buttonLabel: 'AICTE EOA 2024-2025',
        pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_2/view',
      },
    ],
  },
  {
    id: '2',
    title: 'Anna University Affiliation order 2008-2023',
    icon: 'GraduationCap',
    documents: [
      {
        id: '2-1',
        buttonLabel: 'Anna-University-Affiliation-order-2023-2024',
        pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_3/view',
      },
      {
        id: '2-2',
        buttonLabel: 'Anna-University-Affiliation-order-2008-2023',
        pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_4/view',
      },
    ],
  },
  {
    id: '3',
    title: 'Statutory Declaration under section 4(1)(b) of the RTI Act-2005',
    icon: 'FileCheck2',
    documents: [
      {
        id: '3-1',
        buttonLabel: 'Section 4(1)(b) of the RTI Act-2005',
        pdfUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID_5/view',
      },
    ],
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
    <nav className="flex items-center gap-2 text-sm mb-8">
      <Link
        href={homeUrl}
        className="flex items-center gap-1.5 text-gray-600 hover:text-[#0b6d41] transition-colors duration-300"
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
 * Page Header with decorative underline
 */
function PageHeader({
  title,
  subtitle,
  isInView,
  enableAnimations,
}: {
  title: string
  subtitle?: string
  isInView: boolean
  enableAnimations: boolean
}) {
  return (
    <div
      className={cn(
        'mb-10 transition-all duration-700',
        enableAnimations && (isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      )}
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0b6d41] mb-3">
        {title}
      </h1>
      {/* Decorative underline */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-1 w-16 bg-gradient-to-r from-[#0b6d41] to-[#0a5c37] rounded-full" />
        <div className="h-1 w-8 bg-[#ffde59] rounded-full" />
        <div className="h-1 w-4 bg-[#0b6d41]/30 rounded-full" />
      </div>
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}

/**
 * Document Button Component
 */
function DocumentButton({
  document,
  buttonStyle,
  pdfOpenMode,
  showDownloadIcon,
}: {
  document: ApprovalDocument
  buttonStyle: 'solid' | 'gradient' | 'outline'
  pdfOpenMode: 'same-tab' | 'new-tab'
  showDownloadIcon: boolean
}) {
  const buttonStyles = {
    solid: cn(
      'bg-[#0b6d41] text-white',
      'hover:bg-[#0a5c37]',
      'shadow-md hover:shadow-lg'
    ),
    gradient: cn(
      'bg-gradient-to-r from-[#0b6d41] to-[#0a5c37] text-white',
      'hover:from-[#0a5c37] hover:to-[#084d2d]',
      'shadow-md hover:shadow-lg hover:shadow-[#0b6d41]/20'
    ),
    outline: cn(
      'bg-transparent text-[#0b6d41] border-2 border-[#0b6d41]',
      'hover:bg-[#0b6d41] hover:text-white'
    ),
  }

  const linkProps = pdfOpenMode === 'new-tab'
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <a
      href={document.pdfUrl}
      className={cn(
        'inline-flex items-center gap-2.5 px-5 py-3 rounded-xl',
        'font-medium text-sm',
        'transform transition-all duration-300',
        'hover:scale-[1.02]',
        'focus:outline-none focus:ring-2 focus:ring-[#0b6d41]/50 focus:ring-offset-2',
        buttonStyles[buttonStyle]
      )}
      {...linkProps}
    >
      {/* PDF Badge */}
      <span className="inline-flex items-center justify-center px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">
        PDF
      </span>
      <span className="truncate max-w-[200px] md:max-w-[300px]">{document.buttonLabel}</span>
      {showDownloadIcon && <ExternalLink className="w-4 h-4 flex-shrink-0" />}
    </a>
  )
}

/**
 * Section Card Component (Glassmorphism)
 */
function SectionCard({
  section,
  index,
  cardStyle,
  buttonStyle,
  pdfOpenMode,
  showSectionIcons,
  showDownloadIcon,
  enableAnimations,
}: {
  section: ApprovalSection
  index: number
  cardStyle: 'glass' | 'solid' | 'gradient' | 'outline'
  buttonStyle: 'solid' | 'gradient' | 'outline'
  pdfOpenMode: 'same-tab' | 'new-tab'
  showSectionIcons: boolean
  showDownloadIcon: boolean
  enableAnimations: boolean
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = getIconComponent(section.icon)

  const cardStyles = {
    glass: cn(
      'bg-white/80 backdrop-blur-md',
      'border border-white/40',
      'shadow-lg hover:shadow-xl hover:shadow-[#0b6d41]/5'
    ),
    solid: cn(
      'bg-white',
      'border border-gray-200',
      'shadow-lg hover:shadow-xl'
    ),
    gradient: cn(
      'bg-gradient-to-br from-white to-gray-50',
      'border border-gray-200',
      'shadow-lg hover:shadow-xl'
    ),
    outline: cn(
      'bg-transparent',
      'border-2 border-gray-300 hover:border-[#0b6d41]',
      'hover:bg-white/50'
    ),
  }

  return (
    <div
      ref={ref}
      className={cn(
        'group relative rounded-2xl p-6 md:p-8 transition-all duration-500',
        'hover:transform hover:-translate-y-1',
        cardStyles[cardStyle],
        enableAnimations && (isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      )}
      style={{ transitionDelay: enableAnimations ? `${index * 100}ms` : '0ms' }}
    >
      {/* Section Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Icon Container */}
        {showSectionIcons && (
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-[#0b6d41] to-[#0a5c37]',
              'shadow-md shadow-[#0b6d41]/20',
              'group-hover:scale-110 transition-transform duration-300'
            )}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        )}

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#0b6d41] transition-colors duration-300">
            {section.title}
          </h2>
          {/* Decorative line under title */}
          <div className="mt-2 h-0.5 w-12 bg-gradient-to-r from-[#0b6d41] to-transparent rounded-full opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-300" />
        </div>
      </div>

      {/* Document Buttons Grid */}
      <div className="flex flex-wrap gap-3">
        {section.documents.map((doc) => (
          <DocumentButton
            key={doc.id}
            document={doc}
            buttonStyle={buttonStyle}
            pdfOpenMode={pdfOpenMode}
            showDownloadIcon={showDownloadIcon}
          />
        ))}
      </div>

      {/* Decorative hover gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100',
          'bg-gradient-to-br from-[#0b6d41]/5 to-transparent',
          'transition-opacity duration-300 pointer-events-none'
        )}
      />
    </div>
  )
}

/**
 * Simple Section Component (Non-card layout)
 */
function SimpleSection({
  section,
  index,
  buttonStyle,
  pdfOpenMode,
  showSectionIcons,
  showDownloadIcon,
  enableAnimations,
}: {
  section: ApprovalSection
  index: number
  buttonStyle: 'solid' | 'gradient' | 'outline'
  pdfOpenMode: 'same-tab' | 'new-tab'
  showSectionIcons: boolean
  showDownloadIcon: boolean
  enableAnimations: boolean
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = getIconComponent(section.icon)

  return (
    <div
      ref={ref}
      className={cn(
        'mb-10 pb-10 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0',
        'transition-all duration-500',
        enableAnimations && (isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      )}
      style={{ transitionDelay: enableAnimations ? `${index * 100}ms` : '0ms' }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        {showSectionIcons && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#0b6d41] to-[#0a5c37] flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-800">
          {section.title}
        </h2>
      </div>

      {/* Document Buttons */}
      <div className="flex flex-wrap gap-3 pl-0 md:pl-13">
        {section.documents.map((doc) => (
          <DocumentButton
            key={doc.id}
            document={doc}
            buttonStyle={buttonStyle}
            pdfOpenMode={pdfOpenMode}
            showDownloadIcon={showDownloadIcon}
          />
        ))}
      </div>
    </div>
  )
}

// ==========================================
// Main Component
// ==========================================

export default function ApprovalsAffiliationSection({
  pageTitle = 'APPROVALS AND AFFILIATION',
  pageSubtitle,
  breadcrumbLabel = 'APPROVALS AND AFFILIATION',
  showBreadcrumb = true,
  homeUrl = '/',
  sections = defaultSections,
  layout = 'cards',
  cardStyle = 'glass',
  buttonStyle = 'gradient',
  showSectionIcons = true,
  showDownloadIcon = true,
  enableAnimations = true,
  showDecorations = true,
  pdfOpenMode = 'new-tab',
  variant = 'cream',
  className,
}: ApprovalsAffiliationSectionProps) {
  const { ref: headerRef, isInView: headerInView } = useInView(0.1)
  const displaySections = sections.length > 0 ? sections : defaultSections

  const backgroundStyles = {
    light: 'bg-white',
    cream: 'bg-[#fbfbee]',
    gradient: 'bg-gradient-to-br from-[#fbfbee] via-white to-[#f5f5dc]',
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
          {/* Gradient overlay at top */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#0b6d41]/5 to-transparent" />

          {/* Decorative blobs */}
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#ffde59]/10 blur-3xl" />
          <div className="absolute top-1/2 left-5 w-56 h-56 rounded-full bg-[#0b6d41]/5 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full bg-[#ffde59]/5 blur-3xl" />

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230b6d41' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          {showBreadcrumb && (
            <Breadcrumb homeUrl={homeUrl} currentPage={breadcrumbLabel} />
          )}

          {/* Page Header */}
          <div ref={headerRef}>
            <PageHeader
              title={pageTitle}
              subtitle={pageSubtitle}
              isInView={headerInView}
              enableAnimations={enableAnimations}
            />
          </div>

          {/* Sections - Cards Layout */}
          {layout === 'cards' && (
            <div className="space-y-6">
              {displaySections.map((section, index) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  cardStyle={cardStyle}
                  buttonStyle={buttonStyle}
                  pdfOpenMode={pdfOpenMode}
                  showSectionIcons={showSectionIcons}
                  showDownloadIcon={showDownloadIcon}
                  enableAnimations={enableAnimations}
                />
              ))}
            </div>
          )}

          {/* Sections - Simple Layout */}
          {layout === 'simple' && (
            <div>
              {displaySections.map((section, index) => (
                <SimpleSection
                  key={section.id}
                  section={section}
                  index={index}
                  buttonStyle={buttonStyle}
                  pdfOpenMode={pdfOpenMode}
                  showSectionIcons={showSectionIcons}
                  showDownloadIcon={showDownloadIcon}
                  enableAnimations={enableAnimations}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
