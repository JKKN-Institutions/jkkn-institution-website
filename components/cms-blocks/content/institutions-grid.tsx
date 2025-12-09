'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight, ExternalLink } from 'lucide-react'

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
 * InstitutionsGrid Component
 *
 * A grid of institution cards featuring:
 * - Split-color header
 * - Responsive grid layout (3 columns on desktop)
 * - Modern card design with image and title
 * - Hover effects with brand colors
 * - Links to individual institution pages
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
      className={cn('pt-6 pb-16 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24 w-full', className)}
      style={{ backgroundColor }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span style={{ color: headerPart2Color }}>{headerPart2}</span>
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Institutions Grid */}
        <div
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
              />
            ))
          ) : isEditing ? (
            // Empty state for editor
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold">{i}</span>
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
 * Individual Institution Card
 */
function InstitutionCard({
  institution,
  cardStyle,
  showHoverEffect,
  accentColor,
  isEditing,
}: {
  institution: InstitutionItem
  cardStyle: 'modern' | 'minimal' | 'bordered'
  showHoverEffect: boolean
  accentColor: string
  isEditing?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300 h-full flex flex-col',
        cardStyle === 'modern' && 'bg-white shadow-lg hover:shadow-2xl',
        cardStyle === 'minimal' && 'bg-white',
        cardStyle === 'bordered' && 'bg-white border-2 border-gray-200 hover:border-primary',
        showHoverEffect && 'hover:-translate-y-2'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {institution.image ? (
          <Image
            src={institution.image}
            alt={institution.name}
            fill
            className={cn(
              'object-cover transition-transform duration-500',
              showHoverEffect && 'group-hover:scale-110'
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Hover Overlay */}
        {showHoverEffect && (
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
            style={{
              background: `linear-gradient(to top, ${accentColor}cc 0%, transparent 60%)`,
            }}
          />
        )}

        {/* View Link Icon on Hover */}
        {institution.link && showHoverEffect && (
          <div
            className={cn(
              'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            )}
          >
            <ExternalLink className="h-5 w-5" style={{ color: accentColor }} />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3
          className={cn(
            'text-base font-semibold text-gray-900 transition-colors duration-300 text-center line-clamp-2 min-h-[3rem]',
            showHoverEffect && 'group-hover:text-primary'
          )}
        >
          {institution.name}
        </h3>

        {institution.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 text-center flex-grow">
            {institution.description}
          </p>
        )}

        {/* View More Link */}
        {institution.link && (
          <div
            className={cn(
              'mt-3 flex items-center justify-center text-sm font-medium transition-all duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
            style={{ color: accentColor }}
          >
            <span>Learn More</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      {cardStyle === 'modern' && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-1 transition-all duration-300',
            isHovered ? 'w-full' : 'w-0'
          )}
          style={{ backgroundColor: accentColor }}
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
