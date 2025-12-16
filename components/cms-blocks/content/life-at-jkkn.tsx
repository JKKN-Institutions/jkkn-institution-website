'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import {
  Heart, Camera, ChevronLeft, ChevronRight, Play, ArrowRight,
  Users, Trophy, Music, Book, Coffee, Dumbbell,
  Palette, Globe, Microscope, Utensils
} from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Life item schema
 */
export const LifeItemSchema = z.object({
  title: z.string().describe('Activity title'),
  image: z.string().optional().describe('Image URL'),
  category: z.string().optional().describe('Category (Sports, Culture, etc.)'),
  description: z.string().optional().describe('Short description'),
  video: z.string().optional().describe('Video URL'),
  link: z.string().optional().describe('Link to more details'),
  icon: z.string().optional().describe('Icon name'),
})

export type LifeItem = z.infer<typeof LifeItemSchema>

/**
 * LifeAtJKKN props schema
 */
export const LifeAtJKKNPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Life @').describe('First part of header'),
  headerPart2: z.string().default('JKKN').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Life items
  items: z.array(LifeItemSchema).default([]).describe('List of campus life items'),

  // Layout
  layout: z.enum(['masonry', 'carousel', 'grid']).default('masonry').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('3').describe('Number of columns'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'overlay', 'modern']).default('overlay').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay'),
  autoplaySpeed: z.number().default(3500).describe('Autoplay speed in ms'),

  // View All Button
  showViewAllButton: z.boolean().default(true).describe('Show/hide the Explore Campus Life button'),
})

export type LifeAtJKKNProps = z.infer<typeof LifeAtJKKNPropsSchema> & BaseBlockProps

// Icon mapping
const iconMap: Record<string, typeof Heart> = {
  Heart, Camera, Users, Trophy, Music, Book, Coffee, Dumbbell, Palette, Globe, Microscope, Utensils
}

/**
 * Intersection Observer hook
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
 * LifeAtJKKN Component
 *
 * Modern campus life showcase featuring:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Masonry/grid/carousel layout
 * - Category badges
 * - Video support with play buttons
 * - Gold accent hover effects
 */
export function LifeAtJKKN({
  headerPart1 = 'Life @',
  headerPart2 = 'JKKN',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  subtitle,
  items = [],
  layout = 'masonry',
  columns = '3',
  variant = 'modern-light',
  cardStyle = 'overlay',
  showDecorations = true,
  autoplay = true,
  autoplaySpeed = 3500,
  showViewAllButton = true,
  className,
  isEditing,
}: LifeAtJKKNProps) {
  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const headerRef = useInView()
  const contentRef = useInView()

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Default items for demo - 3 cards
  const defaultItems: LifeItem[] = [
    {
      title: 'Sports & Athletics',
      category: 'Sports',
      description: 'State-of-the-art sports facilities including cricket, football, basketball, and indoor games.',
      icon: 'Trophy',
    },
    {
      title: 'Cultural Events',
      category: 'Culture',
      description: 'Annual festivals, cultural programs, and celebrations that bring the campus alive.',
      icon: 'Music',
    },
    {
      title: 'Student Clubs',
      category: 'Community',
      description: 'Join various clubs - from coding to photography, there\'s something for everyone.',
      icon: 'Users',
    },
  ]

  const displayItems = items.length > 0 ? items : defaultItems

  // Autoplay carousel
  useEffect(() => {
    if (layout !== 'carousel' || isEditing || isPaused || !autoplay) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const cardWidth = 340

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
      }
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [layout, isEditing, isPaused, autoplaySpeed, autoplay])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const columnClasses = {
    '2': 'columns-1 sm:columns-2',
    '3': 'columns-1 sm:columns-2 lg:columns-3',
    '4': 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
  }

  const gridClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <section
      className={cn(
        'relative py-16 md:py-20 lg:py-24 w-full overflow-hidden',
        isDark ? 'section-green-gradient' : 'bg-brand-cream',
        className
      )}
    >
      {/* Decorative Patterns */}
      {showDecorations && isModern && (
        <DecorativePatterns variant="scattered" color={isDark ? 'white' : 'green'} />
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
            <Heart className="w-4 h-4" />
            <span>Campus Experience</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase">
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

        {/* Content */}
        <div
          ref={contentRef.ref}
          className={cn(
            "transition-all duration-700 delay-200",
            contentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {layout === 'carousel' ? (
            <div
              className="relative group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <button
                onClick={() => scroll('left')}
                className={cn(
                  "absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg",
                  isDark ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" : "bg-white text-brand-primary"
                )}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-[1008px] mx-auto">
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {displayItems.map((item, index) => (
                    <LifeCard
                    key={index}
                    item={item}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    isEditing={isEditing}
                    index={index}
                    isInView={contentRef.isInView}
                      className="snap-start flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[320px]"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => scroll('right')}
                className={cn(
                  "absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg",
                  isDark ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" : "bg-white text-brand-primary"
                )}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          ) : layout === 'masonry' ? (
            <div className={cn('gap-6 max-w-7xl mx-auto', columnClasses[columns])}>
              {displayItems.map((item, index) => (
                <LifeCard
                  key={index}
                  item={item}
                  cardStyle={cardStyle}
                  isDark={isDark}
                  isEditing={isEditing}
                  index={index}
                  isInView={contentRef.isInView}
                  className="mb-6 break-inside-avoid"
                  isMasonry
                />
              ))}
            </div>
          ) : (
            <div className={cn('grid gap-6 max-w-7xl mx-auto', gridClasses[columns])}>
              {displayItems.map((item, index) => (
                <LifeCard
                  key={index}
                  item={item}
                  cardStyle={cardStyle}
                  isDark={isDark}
                  isEditing={isEditing}
                  index={index}
                  isInView={contentRef.isInView}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Link */}
        {showViewAllButton && (
          <div className="text-center mt-12">
            <Link
              href="/campus-life"
              className={cn(
                "group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300",
                isDark
                  ? "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                  : "bg-brand-primary text-white hover:bg-brand-primary-dark"
              )}
            >
              <Camera className="w-5 h-5" />
              Explore Campus Life
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Individual Life Card
 */
function LifeCard({
  item,
  cardStyle,
  isDark,
  isEditing,
  className,
  index,
  isInView,
  isMasonry = false,
}: {
  item: LifeItem
  cardStyle: 'glassmorphic' | 'overlay' | 'modern'
  isDark: boolean
  isEditing?: boolean
  className?: string
  index: number
  isInView: boolean
  isMasonry?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = item.icon ? iconMap[item.icon] || Heart : Heart

  // Vary heights for masonry effect
  const masonryHeights = ['h-[280px]', 'h-[350px]', 'h-[300px]', 'h-[380px]', 'h-[260px]', 'h-[320px]']
  const heightClass = isMasonry ? masonryHeights[index % masonryHeights.length] : 'h-[280px]'

  const cardContent = (
    <div
      className={cn(
        'group rounded-2xl overflow-hidden transition-all duration-500',
        cardStyle === 'glassmorphic' && isDark && 'glass-card-dark',
        cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-lg',
        cardStyle === 'overlay' && 'shadow-lg hover:shadow-2xl',
        cardStyle === 'modern' && 'bg-white shadow-lg hover:shadow-2xl',
        'hover:-translate-y-2',
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gold accent glow on hover */}
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 -z-10",
          isHovered && "opacity-20"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      {/* Image */}
      <div className={cn('relative overflow-hidden', heightClass)}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-primary-dark">
            <IconComponent className="w-16 h-16 text-white/30" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            cardStyle === 'overlay' || isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: cardStyle === 'overlay'
              ? 'linear-gradient(to top, rgba(11, 109, 65, 0.9) 0%, rgba(11, 109, 65, 0.4) 50%, transparent 100%)'
              : 'linear-gradient(to top, rgba(255,222,89,0.8) 0%, rgba(255,222,89,0.2) 40%, transparent 100%)'
          }}
        />

        {/* Category Badge */}
        {item.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: 'rgba(255, 222, 89, 0.9)' }}
          >
            <span className="text-gray-800">{item.category}</span>
          </div>
        )}

        {/* Icon Badge */}
        <div
          className={cn(
            'absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg',
            isHovered ? 'bg-white scale-110' : 'bg-white/80 scale-100'
          )}
        >
          <IconComponent className="w-5 h-5 text-brand-primary" />
        </div>

        {/* Video Play Button */}
        {item.video && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500',
                isHovered ? 'bg-white scale-110' : 'bg-white/90 scale-100'
              )}
            >
              <Play className="w-8 h-8 ml-1 text-brand-primary" style={{ fill: 'currentColor' }} />
            </div>
          </div>
        )}

        {/* Content on hover/overlay */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-5 transition-all duration-500',
            cardStyle === 'overlay' ? 'opacity-100 translate-y-0' : isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>
          )}
        </div>
      </div>

      {/* Title (shown when not hovered and not overlay) */}
      {cardStyle !== 'overlay' && (
        <div
          className={cn(
            'p-4 transition-all duration-500',
            isHovered ? 'opacity-0 h-0 p-0' : 'opacity-100'
          )}
        >
          <h3 className={cn(
            "text-lg font-bold",
            isDark && cardStyle === 'glassmorphic' ? "text-white" : "text-gray-900"
          )}>
            {item.title}
          </h3>
        </div>
      )}

      {/* Bottom gold accent line on hover */}
      {cardStyle !== 'overlay' && (
        <div
          className={cn(
            'absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-t-full transition-all duration-500',
            isHovered ? 'w-3/4' : 'w-0'
          )}
          style={{ backgroundColor: '#ffde59' }}
        />
      )}
    </div>
  )

  if (item.link && !isEditing) {
    return (
      <Link href={item.link} className={cn('block', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={className}>{cardContent}</div>
}

export default LifeAtJKKN
