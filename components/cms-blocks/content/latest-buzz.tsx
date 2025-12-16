'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Zap, ChevronRight, ArrowRight, Sparkles, TrendingUp, Loader2 } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import { getBlogPostsByCategory } from '@/app/actions/cms/homepage-blog'

/**
 * Buzz item schema
 */
export const BuzzItemSchema = z.object({
  title: z.string().describe('Buzz title'),
  image: z.string().describe('Image URL'),
  link: z.string().optional().describe('Link to full content'),
  category: z.string().optional().describe('Category tag'),
})

export type BuzzItem = z.infer<typeof BuzzItemSchema>

/**
 * LatestBuzz props schema
 */
export const LatestBuzzPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Latest').describe('First part of header'),
  headerPart2: z.string().default('Buzz').describe('Second part of header'),
  headerPart1Color: z.string().default('#ffde59').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#ffde59').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Dynamic data
  useDynamicData: z.boolean().default(false).describe('Fetch buzz items dynamically from blog posts'),
  categorySlug: z.string().default('latest-buzz').describe('Blog category slug to fetch posts from'),
  maxItems: z.number().default(6).describe('Maximum number of items to display'),

  // Buzz items (used when useDynamicData is false)
  buzzItems: z.array(BuzzItemSchema).default([]).describe('List of buzz items'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'masonry']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-dark').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'overlay', 'modern']).default('overlay').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  showCategory: z.boolean().default(true).describe('Show category tags'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay'),
  autoplaySpeed: z.number().default(4000).describe('Autoplay speed in ms'),

  // View All Link
  viewAllLink: z.string().default('/blog/category/latest-buzz').describe('Link for View All button'),
  viewAllText: z.string().default('View All Buzz').describe('Text for View All button'),
  showViewAllButton: z.boolean().default(true).describe('Show/hide the View All button'),
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
 * Modern trending content showcase featuring:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Auto-scrolling carousel or grid layout
 * - Glassmorphic or overlay card styles
 * - Scroll-triggered animations
 * - Gold accent hover effects
 */
export function LatestBuzz({
  headerPart1 = 'Latest',
  headerPart2 = 'Buzz',
  headerPart1Color = '#ffde59',
  headerPart2Color = '#ffde59',
  subtitle,
  useDynamicData = false,
  categorySlug = 'latest-buzz',
  maxItems = 6,
  buzzItems = [],
  layout = 'carousel',
  columns = '4',
  variant = 'modern-dark',
  cardStyle = 'overlay',
  showDecorations = true,
  showCategory = true,
  autoplay = true,
  autoplaySpeed = 4000,
  viewAllLink = '/blog/category/latest-buzz',
  viewAllText = 'View All Buzz',
  showViewAllButton = true,
  className,
  isEditing,
}: LatestBuzzProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [dynamicBuzz, setDynamicBuzz] = useState<BuzzItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const headerRef = useInView()
  const contentRef = useInView()

  // Fetch dynamic data from blog posts
  const fetchDynamicData = useCallback(async () => {
    if (!useDynamicData || !categorySlug) return

    setIsLoading(true)
    try {
      const { posts } = await getBlogPostsByCategory(categorySlug, maxItems)
      const buzzData: BuzzItem[] = posts.map((post) => ({
        title: post.title,
        image: post.featured_image || '',
        link: `/blog/${post.slug}`,
        category: post.category?.name || 'Buzz',
      }))
      setDynamicBuzz(buzzData)
    } catch (error) {
      console.error('Error fetching dynamic buzz:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useDynamicData, categorySlug, maxItems])

  useEffect(() => {
    fetchDynamicData()
  }, [fetchDynamicData])

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

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  const defaultBuzz: BuzzItem[] = [
    { title: 'Campus Drive 2025', image: '', link: '/buzz/campus-drive', category: 'Placement' },
    { title: 'Placement Day Celebration', image: '', link: '/buzz/placement-celebration', category: 'Events' },
    { title: 'Industry Immersion Program', image: '', link: '/buzz/industry-immersion', category: 'Learning' },
  ]

  // Priority: dynamic data > props data > default data
  const displayBuzz = useDynamicData && dynamicBuzz.length > 0
    ? dynamicBuzz
    : buzzItems.length > 0
      ? buzzItems
      : defaultBuzz

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

  const columnClasses = {
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
            <TrendingUp className="w-4 h-4" />
            <span>Trending Now</span>
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
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Carousel */}
              <div className="max-w-[1008px] mx-auto">
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {displayBuzz.map((buzz, index) => (
                    <BuzzCard
                    key={index}
                    buzz={buzz}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    showCategory={showCategory}
                    isEditing={isEditing}
                    index={index}
                    isInView={contentRef.isInView}
                      className="snap-start flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[320px]"
                    />
                  ))}
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {displayBuzz.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollTo({ left: index * 340, behavior: 'smooth' })
                      }
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      isDark ? "bg-white/30 hover:bg-white/60" : "bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
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
                  isDark={isDark}
                  showCategory={showCategory}
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
              href={viewAllLink}
              className={cn(
                "group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300",
                isDark
                  ? "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                  : "bg-brand-primary text-white hover:bg-brand-primary-dark"
              )}
            >
              {viewAllText}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Loading indicator for dynamic data */}
        {isLoading && useDynamicData && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
        )}
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
  isDark,
  showCategory,
  isEditing,
  className,
  index,
  isInView,
}: {
  buzz: BuzzItem
  cardStyle: 'glassmorphic' | 'overlay' | 'modern'
  isDark: boolean
  showCategory: boolean
  isEditing?: boolean
  className?: string
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-500 h-[320px] flex flex-col',
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
      {/* Decorative Background Glow on Hover */}
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500",
          isHovered && "opacity-20"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      {/* Image - Full card for overlay, partial for modern */}
      <div className={cn(
        "relative overflow-hidden flex-shrink-0",
        cardStyle === 'overlay' ? "absolute inset-0" : "h-[220px]",
        "rounded-2xl"
      )}>
        {buzz.image ? (
          <Image
            src={buzz.image}
            alt={buzz.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white/30" />
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
              ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
              : 'linear-gradient(to top, rgba(255,222,89,0.8) 0%, rgba(255,222,89,0.2) 40%, transparent 100%)'
          }}
        />

        {/* Category Badge */}
        {showCategory && buzz.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: 'rgba(255, 222, 89, 0.9)' }}
          >
            <span className="text-gray-800">{buzz.category}</span>
          </div>
        )}

        {/* Trending Badge */}
        <div
          className={cn(
            'absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-500 shadow-lg',
            isHovered ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-45'
          )}
        >
          <Zap className="w-5 h-5 text-gold" />
        </div>
      </div>

      {/* Content - Positioned at bottom for overlay, below image for others */}
      <div className={cn(
        "relative flex-grow flex flex-col",
        cardStyle === 'overlay'
          ? "absolute bottom-0 left-0 right-0 p-5"
          : "p-5 bg-white"
      )}>
        {/* Gold accent line on hover (non-overlay only) */}
        {cardStyle !== 'overlay' && (
          <div
            className={cn(
              'absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500',
              isHovered ? 'w-3/4' : 'w-0'
            )}
            style={{ backgroundColor: '#ffde59' }}
          />
        )}

        <h3 className={cn(
          "text-lg font-bold transition-colors duration-300 line-clamp-2",
          cardStyle === 'overlay' ? "text-white" : isDark && cardStyle === 'glassmorphic' ? 'text-white' : 'text-gray-900',
          cardStyle !== 'overlay' && "mt-2"
        )}>
          {buzz.title}
        </h3>

        <div
          className={cn(
            'mt-3 flex items-center text-sm font-semibold transition-all duration-500',
            cardStyle === 'overlay'
              ? "text-white/90"
              : "text-gold",
            isHovered ? 'opacity-100 translate-y-0' : cardStyle === 'overlay' ? 'opacity-80' : 'opacity-0 translate-y-2'
          )}
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Bottom Accent Gradient */}
      {cardStyle !== 'overlay' && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-1 transition-all duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to right, transparent, #ffde59, transparent)'
          }}
        />
      )}
    </div>
  )

  if (buzz.link && !isEditing) {
    return (
      <Link href={buzz.link} className={cn('block h-full', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={cn('h-full', className)}>{cardContent}</div>
}

export default LatestBuzz
