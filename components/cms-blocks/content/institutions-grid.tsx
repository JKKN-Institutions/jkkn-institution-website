'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ExternalLink, GraduationCap, Building2 } from 'lucide-react'

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
  headerPart2: z.string().default('Institutions').describe('Second part of header (colored)'),
  headerPart1Color: z.string().default('#000000').describe('Color for first part'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Institutions
  institutions: z.array(InstitutionItemSchema).default([]).describe('List of institutions'),

  // Layout
  columns: z.enum(['2', '3', '4']).default('3').describe('Number of columns'),
  gap: z.enum(['sm', 'md', 'lg']).default('md').describe('Gap between cards'),

  // Styling
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  cardStyle: z.enum(['modern', 'minimal', 'bordered']).default('modern').describe('Card design style'),
  showHoverEffect: z.boolean().default(true).describe('Show hover animation'),
  accentColor: z.string().default('#0b6d41').describe('Accent color for hover effects'),
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
 * - Split-color header with section badge
 * - Responsive grid layout with scroll animations
 * - Modern card design with glassmorphism effects
 * - Hover effects with brand colors
 * - Decorative background elements
 */
export function InstitutionsGrid({
  headerPart1 = 'Our JKKN',
  headerPart2 = 'Institutions',
  headerPart1Color = '#000000',
  headerPart2Color = '#0b6d41',
  subtitle,
  institutions = [],
  columns = '3',
  gap = 'md',
  backgroundColor = '#ffffff',
  cardStyle = 'modern',
  showHoverEffect = true,
  accentColor = '#0b6d41',
  className,
  isEditing,
}: InstitutionsGridProps) {
  const headerRef = useInView()
  const gridRef = useInView()

  // Column classes
  const columnClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
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
      className={cn('relative pt-12 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 w-full overflow-hidden', className)}
      style={{ backgroundColor }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlay */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at top left, ${accentColor} 0%, transparent 70%)`
          }}
        />

        {/* Floating decorative circles */}
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-5"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-20 -right-20 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: accentColor }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${accentColor} 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div
          ref={headerRef.ref}
          className={cn(
            "text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-1000",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Section Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            <Building2 className="w-4 h-4" />
            <span>Our Institutions</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span style={{ color: headerPart2Color }}>{headerPart2}</span>
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Decorative line */}
          <div
            className="w-24 h-1 mx-auto mt-6 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
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
                accentColor={accentColor}
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
                  className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
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
    </section>
  )
}

/**
 * Individual Institution Card - Modern Design
 */
function InstitutionCard({
  institution,
  cardStyle,
  showHoverEffect,
  accentColor,
  isEditing,
  index,
  isInView,
}: {
  institution: InstitutionItem
  cardStyle: 'modern' | 'minimal' | 'bordered'
  showHoverEffect: boolean
  accentColor: string
  isEditing?: boolean
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-500 h-full flex flex-col',
        cardStyle === 'modern' && 'bg-white shadow-lg hover:shadow-2xl hover:shadow-black/10',
        cardStyle === 'minimal' && 'bg-white',
        cardStyle === 'bordered' && 'bg-white border-2 border-gray-200 hover:border-primary',
        showHoverEffect && 'hover:-translate-y-3',
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
        style={{ backgroundColor: accentColor }}
      />

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {institution.image ? (
          <Image
            src={institution.image}
            alt={institution.name}
            fill
            className={cn(
              'object-cover transition-transform duration-700',
              showHoverEffect && 'group-hover:scale-110'
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <GraduationCap className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `linear-gradient(to top, ${accentColor}dd 0%, ${accentColor}40 40%, transparent 100%)`,
          }}
        />

        {/* View Link Icon on Hover */}
        {institution.link && showHoverEffect && (
          <div
            className={cn(
              'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-500 shadow-lg',
              isHovered ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 -translate-y-4 rotate-45'
            )}
          >
            <ExternalLink className="h-4 w-4" style={{ color: accentColor }} />
          </div>
        )}

        {/* Hover Title Overlay */}
        {showHoverEffect && institution.link && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-4 transition-all duration-500',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <span className="text-white font-semibold flex items-center gap-2">
              Explore
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="relative p-5 flex-grow flex flex-col bg-white">
        {/* Accent Line Top */}
        <div
          className={cn(
            'absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500',
            isHovered ? 'w-3/4' : 'w-0'
          )}
          style={{ backgroundColor: accentColor }}
        />

        <h3
          className={cn(
            'text-base md:text-lg font-bold text-gray-900 transition-colors duration-300 text-center line-clamp-2 min-h-[3rem] mt-2',
            showHoverEffect && 'group-hover:text-gray-800'
          )}
        >
          {institution.name}
        </h3>

        {institution.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 text-center flex-grow">
            {institution.description}
          </p>
        )}

        {/* View More Link */}
        {institution.link && (
          <div
            className={cn(
              'mt-4 flex items-center justify-center text-sm font-semibold transition-all duration-500',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
            style={{ color: accentColor }}
          >
            <span>Learn More</span>
            <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        )}
      </div>

      {/* Bottom Accent Gradient */}
      {cardStyle === 'modern' && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-1 transition-all duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`
          }}
        />
      )}
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
