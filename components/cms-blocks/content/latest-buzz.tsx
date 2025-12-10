'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Zap, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'

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
 * LatestBuzz Component
 *
 * Modern trending content showcase with:
 * - Section badge with decorative elements
 * - Auto-scrolling carousel with pause on hover
 * - Scroll-triggered animations
 * - Modern card design with hover effects
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
  const headerRef = useInView()
  const contentRef = useInView()

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
      className={cn('relative py-12 md:py-16 lg:py-20 w-full overflow-hidden', className)}
      style={{ backgroundColor }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div
          className="absolute top-0 left-0 w-1/3 h-full opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at top left, ${accentColor} 0%, transparent 70%)`
          }}
        />

        {/* Floating circles */}
        <div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-20 -right-20 w-72 h-72 rounded-full opacity-5"
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
            "text-center mb-10 md:mb-14 transition-all duration-1000",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Section Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            <Zap className="w-4 h-4" />
            <span>Trending Now</span>
          </div>

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

          {/* Decorative line */}
          <div
            className="w-24 h-1 mx-auto mt-6 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Content */}
        <div
          ref={contentRef.ref}
          className={cn(
            "transition-all duration-1000 delay-200",
            contentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {layout === 'carousel' ? (
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Carousel */}
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
                    index={index}
                    isInView={contentRef.isInView}
                    className="snap-start flex-shrink-0 w-[300px] h-[300px]"
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
                  index={index}
                  isInView={contentRef.isInView}
                  className="h-[300px]"
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="/buzz"
            className="group inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3"
            style={{ color: accentColor }}
          >
            View All Buzz
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Buzz Card - Modern Design
 */
function BuzzCard({
  buzz,
  cardStyle,
  accentColor,
  isEditing,
  className,
  index,
  isInView,
}: {
  buzz: BuzzItem
  cardStyle: 'simple' | 'overlay' | 'bordered'
  accentColor: string
  isEditing?: boolean
  className?: string
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group overflow-hidden transition-all duration-500 h-full flex flex-col hover:-translate-y-2',
        cardStyle === 'simple' && 'rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-black/10',
        cardStyle === 'overlay' && 'rounded-2xl relative shadow-lg hover:shadow-2xl',
        cardStyle === 'bordered' && 'rounded-2xl border-2 border-gray-200 hover:border-primary shadow-lg',
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image - Fixed height */}
      <div className="relative h-[220px] overflow-hidden rounded-2xl flex-shrink-0">
        {buzz.image ? (
          <Image
            src={buzz.image}
            alt={buzz.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            cardStyle === 'overlay' || isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `linear-gradient(to top, ${accentColor}dd 0%, ${accentColor}40 40%, transparent 100%)`
          }}
        />

        {/* Trending Badge */}
        <div
          className={cn(
            'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-500 shadow-lg',
            isHovered ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-45'
          )}
        >
          <Zap className="w-5 h-5" style={{ color: accentColor }} />
        </div>

        {/* Title overlay for overlay style and hover */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-4 transition-all duration-500',
            cardStyle === 'overlay' || isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <h3 className="text-lg font-bold text-white line-clamp-2">{buzz.title}</h3>
          <span className="text-white/80 text-sm flex items-center gap-1 mt-2">
            View Details
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Title for simple/bordered styles (shown below image) */}
      {cardStyle !== 'overlay' && (
        <div className="relative p-4 flex-grow flex flex-col items-center justify-center bg-white">
          {/* Accent Line */}
          <div
            className={cn(
              'absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500',
              isHovered ? 'w-3/4' : 'w-0'
            )}
            style={{ backgroundColor: accentColor }}
          />
          <h3
            className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors text-center line-clamp-2"
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
