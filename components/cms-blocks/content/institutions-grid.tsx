'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ExternalLink, GraduationCap, Building2 } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Institution item schema
 */
export const InstitutionItemSchema = z.object({
  name: z.string().describe('Institution name'),
  image: z.string().describe('Institution image URL'),
  link: z.string().optional().describe('Link to institution page'),
  description: z.string().optional().describe('Short description'),
})

export type InstitutionItem = z.infer<typeof InstitutionItemSchema>

/**
 * InstitutionsGrid props schema
 */
export const InstitutionsGridPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Our JKKN').describe('First part of header'),
  headerPart2: z.string().default('Institutions').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Header Typography
  headerFontFamily: z.string().optional().describe('Font family for header'),
  headerFontSize: z.enum(['3xl', '4xl', '5xl', '6xl']).default('5xl').describe('Font size for header'),
  headerFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('bold').describe('Font weight for header'),

  // Institutions
  institutions: z.array(InstitutionItemSchema).default([]).describe('List of institutions'),

  // Layout
  columns: z.enum(['2', '3', '4']).default('3').describe('Number of columns'),
  gap: z.enum(['sm', 'md', 'lg']).default('md').describe('Gap between cards'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'modern', 'minimal']).default('glassmorphic').describe('Card design style'),
  showHoverEffect: z.boolean().default(true).describe('Show hover animation'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
})

export type InstitutionsGridProps = z.infer<typeof InstitutionsGridPropsSchema> & BaseBlockProps

/**
 * Intersection Observer hook for animations
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

/**
 * InstitutionsGrid Component
 *
 * A modern grid of institution cards featuring:
 * - Serif header with gold accent
 * - Decorative circle patterns
 * - Glassmorphic or modern card designs
 * - Responsive grid layout with scroll animations
 * - Hover effects with brand colors
 */
export function InstitutionsGrid({
  headerPart1 = 'Our JKKN',
  headerPart2 = 'Institutions',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  subtitle,
  headerFontFamily,
  headerFontSize = '5xl',
  headerFontWeight = 'bold',
  institutions = [],
  columns = '3',
  gap = 'md',
  variant = 'modern-light',
  cardStyle = 'glassmorphic',
  showHoverEffect = true,
  showDecorations = true,
  className,
  isEditing,
}: InstitutionsGridProps) {
  const headerRef = useInView()
  const gridRef = useInView()

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  // Column classes
  const columnClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  // Gap classes
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        className
      )}
    >
      {/* Glassmorphic Background Layer */}
      <div className={cn(
        "absolute inset-0 backdrop-blur-md",
        isDark
          ? "bg-gradient-to-br from-brand-primary/90 via-brand-primary-dark/85 to-brand-primary-darker/90"
          : "bg-gradient-to-br from-brand-cream/95 via-white/90 to-brand-cream/95"
      )} />

      {/* Content Container */}
      <div className="relative py-16 md:py-20 lg:py-24">
        {/* Decorative Patterns */}
        {showDecorations && isModern && (
          <DecorativePatterns variant="default" color={isDark ? 'white' : 'green'} />
        )}

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div
          ref={headerRef.ref}
          className={cn(
            "text-center mb-12 md:mb-16 transition-all duration-700",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Section Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6",
              isDark ? "bg-white/10 backdrop-blur-sm text-white" : "bg-brand-primary/10 text-brand-primary"
            )}
          >
            <Building2 className="w-4 h-4" />
            <span>Our Institutions</span>
          </div>

          <h2
            className={cn(
              "tracking-tight mb-4 uppercase",
              (!headerFontFamily || headerFontFamily === 'Default (Serif)') && "font-serif-heading",
              // Font size classes
              headerFontSize === '3xl' && "text-2xl sm:text-3xl md:text-3xl",
              headerFontSize === '4xl' && "text-2xl sm:text-3xl md:text-4xl",
              headerFontSize === '5xl' && "text-3xl sm:text-4xl md:text-5xl",
              headerFontSize === '6xl' && "text-4xl sm:text-5xl md:text-6xl",
              // Font weight classes
              headerFontWeight === 'normal' && "font-normal",
              headerFontWeight === 'medium' && "font-medium",
              headerFontWeight === 'semibold' && "font-semibold",
              headerFontWeight === 'bold' && "font-bold",
              headerFontWeight === 'extrabold' && "font-extrabold",
            )}
            style={{ fontFamily: (headerFontFamily && headerFontFamily !== 'Default (Serif)') ? headerFontFamily : undefined }}
          >
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span style={{ color: headerPart2Color }}>{headerPart2}</span>
          </h2>

          {subtitle && (
            <p className={cn(
              "text-lg md:text-xl max-w-3xl mx-auto",
              isDark ? "text-white/70" : "text-gray-600"
            )}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Institutions Grid */}
        <div
          ref={gridRef.ref}
          className={cn(
            'grid max-w-7xl mx-auto',
            columnClasses[columns],
            gapClasses[gap]
          )}
        >
          {institutions.length > 0 ? (
            institutions.map((institution, index) => (
              <InstitutionCard
                key={index}
                institution={institution}
                cardStyle={cardStyle}
                showHoverEffect={showHoverEffect}
                isDark={isDark}
                isEditing={isEditing}
                index={index}
                isInView={gridRef.isInView}
              />
            ))
          ) : isEditing ? (
            // Empty state for editor
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl h-72 flex items-center justify-center border-2 border-dashed",
                    isDark ? "bg-white/5 border-white/20 text-white/40" : "bg-gray-100 border-gray-300 text-gray-400"
                  )}
                >
                  <div className="text-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center",
                      isDark ? "bg-white/10" : "bg-gray-200"
                    )}>
                      <GraduationCap className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="text-sm">Add institution {i}</p>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div> {/* Close content container */}
  </section>
  )
}

/**
 * Individual Institution Card
 */
function InstitutionCard({
  institution,
  cardStyle,
  showHoverEffect,
  isDark,
  isEditing,
  index,
  isInView,
}: {
  institution: InstitutionItem
  cardStyle: 'glassmorphic' | 'modern' | 'minimal'
  showHoverEffect: boolean
  isDark: boolean
  isEditing?: boolean
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-500 h-full flex flex-col',
        cardStyle === 'glassmorphic' && isDark && 'glass-card-dark',
        cardStyle === 'glassmorphic' && !isDark && 'bg-white shadow-lg hover:shadow-xl',
        cardStyle === 'modern' && 'bg-white shadow-lg hover:shadow-2xl',
        cardStyle === 'minimal' && 'bg-white',
        showHoverEffect && 'hover:-translate-y-2',
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Background Glow on Hover */}
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500",
          isHovered && "opacity-20"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {institution.image ? (
          <Image
            src={institution.image}
            alt={institution.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-transform duration-700',
              showHoverEffect && 'group-hover:scale-110'
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center">
            <GraduationCap className="w-12 h-12 text-white/40" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
          }}
        />

        {/* View Link Icon on Hover */}
        {institution.link && showHoverEffect && (
          <div
            className={cn(
              'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-500 shadow-lg',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            )}
          >
            <ExternalLink className="h-4 w-4 text-brand-primary" />
          </div>
        )}

        {/* Hover Title Overlay */}
        {showHoverEffect && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-4 transition-all duration-500',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <span className="text-white font-bold text-base md:text-lg line-clamp-3 md:line-clamp-2">
              {institution.name}
            </span>
          </div>
        )}
      </div>

      {/* Card Content - Minimal */}
      <div className={cn(
        "relative p-3",
        isDark && cardStyle === 'glassmorphic' ? 'bg-transparent' : 'bg-white'
      )}>
        {/* Gold accent line on hover */}
        <div
          className={cn(
            'absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500',
            isHovered ? 'w-3/4' : 'w-0'
          )}
          style={{ backgroundColor: '#ffde59' }}
        />

        <h3 className={cn(
          "text-sm md:text-base lg:text-lg font-bold transition-colors duration-300 text-center line-clamp-3 md:line-clamp-2 pt-1",
          isDark && cardStyle === 'glassmorphic' ? 'text-white' : 'text-brand-primary'
        )}>
          {institution.name}
        </h3>
      </div>

      {/* Bottom Accent Gradient */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-1 transition-all duration-500',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'linear-gradient(to right, transparent, #ffde59, transparent)'
        }}
      />
    </div>
  )

  // Wrap in link if link is provided (but not in editing mode)
  if (institution.link && !isEditing) {
    return (
      <Link href={institution.link} className="block h-full">
        {cardContent}
      </Link>
    )
  }

  return <div className="h-full">{cardContent}</div>
}

export default InstitutionsGrid
