'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

/**
 * Buzz item schema
 */
export const BuzzItemSchema = z.object({
  title: z.string().describe('Buzz title'),
  image: z.string().describe('Image URL'),
  link: z.string().optional().describe('Link to full content'),
})

export type BuzzItem = z.infer<typeof BuzzItemSchema>

/**
 * LatestBuzz props schema
 */
export const LatestBuzzPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Latest').describe('First part of header'),
  headerPart2: z.string().default('Buzz').describe('Second part of header (colored)'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part'),
  headerPart2Italic: z.boolean().default(true).describe('Make second part italic'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Buzz items
  buzzItems: z.array(BuzzItemSchema).default([]).describe('List of buzz items'),

  // Layout
  layout: z.enum(['carousel', 'grid']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns'),

  // Styling
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  cardStyle: z.enum(['simple', 'overlay', 'bordered']).default('simple').describe('Card style'),
  accentColor: z.string().default('#0b6d41').describe('Accent color'),

  // Autoplay
  autoplaySpeed: z.number().default(3000).describe('Autoplay speed in ms'),
})

export type LatestBuzzProps = z.infer<typeof LatestBuzzPropsSchema> & BaseBlockProps

/**
 * LatestBuzz Component
 *
 * Trending content showcase with:
 * - Split-color header with brand colors
 * - Auto-scrolling carousel with pause on hover
 * - Uniform card sizing
 * - Simple image cards with titles
 */
export function LatestBuzz({
  headerPart1 = 'Latest',
  headerPart2 = 'Buzz',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  headerPart2Italic = true,
  subtitle,
  buzzItems = [],
  layout = 'carousel',
  columns = '4',
  backgroundColor = '#ffffff',
  cardStyle = 'simple',
  accentColor = '#0b6d41',
  autoplaySpeed = 3000,
  className,
  isEditing,
}: LatestBuzzProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const defaultBuzz: BuzzItem[] = [
    { title: 'Campus Drive', image: '', link: '/buzz/campus-drive' },
    { title: 'Placement Day Celebration', image: '', link: '/buzz/placement-celebration' },
    { title: 'Industry Immersion', image: '', link: '/buzz/industry-immersion' },
    { title: 'Annual Sports Meet', image: '', link: '/buzz/sports-meet' },
    { title: 'Cultural Festival', image: '', link: '/buzz/cultural-fest' },
  ]

  // Always show default buzz items if empty (users can add real data via admin panel)
  const displayBuzz = buzzItems.length > 0 ? buzzItems : defaultBuzz

  // Autoplay carousel
  useEffect(() => {
    if (layout !== 'carousel' || isEditing || isPaused) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const cardWidth = 320

        // If near the end, scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
      }
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [layout, isEditing, isPaused, autoplaySpeed])

  const columnClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <section
      className={cn('py-10 md:py-12 w-full', className)}
      style={{ backgroundColor }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span
              className={headerPart2Italic ? 'italic' : ''}
              style={{ color: headerPart2Color }}
            >
              {headerPart2}
            </span>
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {layout === 'carousel' ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel - No navigation arrows */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayBuzz.map((buzz, index) => (
                <BuzzCard
                  key={index}
                  buzz={buzz}
                  cardStyle={cardStyle}
                  accentColor={accentColor}
                  isEditing={isEditing}
                  className="snap-start flex-shrink-0 w-[300px] h-[280px]"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={cn('grid gap-6 max-w-7xl mx-auto', columnClasses[columns])}>
            {displayBuzz.map((buzz, index) => (
              <BuzzCard
                key={index}
                buzz={buzz}
                cardStyle={cardStyle}
                accentColor={accentColor}
                isEditing={isEditing}
                className="h-[280px]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Individual Buzz Card - Uniform sizing
 */
function BuzzCard({
  buzz,
  cardStyle,
  accentColor,
  isEditing,
  className,
}: {
  buzz: BuzzItem
  cardStyle: 'simple' | 'overlay' | 'bordered'
  accentColor: string
  isEditing?: boolean
  className?: string
}) {
  const cardContent = (
    <div
      className={cn(
        'group overflow-hidden transition-all duration-300 h-full flex flex-col',
        cardStyle === 'simple' && 'rounded-xl',
        cardStyle === 'overlay' && 'rounded-xl relative',
        cardStyle === 'bordered' && 'rounded-xl border-2 border-gray-200 hover:border-primary',
        className
      )}
    >
      {/* Image - Fixed height */}
      <div className="relative h-[200px] overflow-hidden rounded-xl flex-shrink-0">
        {buzz.image ? (
          <Image
            src={buzz.image}
            alt={buzz.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Overlay for overlay style */}
        {cardStyle === 'overlay' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        )}

        {/* Title overlay for overlay style */}
        {cardStyle === 'overlay' && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-white line-clamp-2">{buzz.title}</h3>
          </div>
        )}
      </div>

      {/* Title for simple/bordered styles */}
      {cardStyle !== 'overlay' && (
        <div className="pt-4 flex-grow flex items-center justify-center">
          <h3
            className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors text-center line-clamp-2"
            style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}
          >
            {buzz.title}
          </h3>
        </div>
      )}
    </div>
  )

  if (buzz.link && !isEditing) {
    return (
      <Link href={buzz.link} className={cn('block', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={className}>{cardContent}</div>
}

export default LatestBuzz
