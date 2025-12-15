'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Calendar, Newspaper, ChevronRight, ArrowRight, Loader2 } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import { getBlogPostsByCategory } from '@/app/actions/cms/homepage-blog'

/**
 * News item schema
 */
export const NewsItemSchema = z.object({
  title: z.string().describe('News title'),
  image: z.string().describe('News image URL'),
  date: z.string().describe('Publication date'),
  link: z.string().optional().describe('Link to full article'),
  excerpt: z.string().optional().describe('Short excerpt'),
  category: z.string().optional().describe('News category'),
})

export type NewsItem = z.infer<typeof NewsItemSchema>

/**
 * CollegeNews props schema
 */
export const CollegeNewsPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('College').describe('First part of header'),
  headerPart2: z.string().default('News').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Dynamic data
  useDynamicData: z.boolean().default(false).describe('Fetch news dynamically from blog posts'),
  categorySlug: z.string().default('college-news').describe('Blog category slug to fetch posts from'),
  maxItems: z.number().default(6).describe('Maximum number of items to display'),

  // News items (used when useDynamicData is false)
  newsItems: z.array(NewsItemSchema).default([]).describe('List of news articles'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'featured']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns for grid'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'modern', 'minimal']).default('modern').describe('Card design style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  showCategory: z.boolean().default(true).describe('Show category badges'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay for carousel'),
  autoplaySpeed: z.number().default(4000).describe('Autoplay speed in ms'),

  // View All Link
  viewAllLink: z.string().default('/blog/category/college-news').describe('Link for View All button'),
  viewAllText: z.string().default('View All News').describe('Text for View All button'),
})

export type CollegeNewsProps = z.infer<typeof CollegeNewsPropsSchema> & BaseBlockProps

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
 * CollegeNews Component
 *
 * Modern news section featuring:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Auto-scrolling carousel or grid layout
 * - Glassmorphic or modern card styles
 * - Scroll-triggered animations
 * - Gold accent hover effects
 */
export function CollegeNews({
  headerPart1 = 'College',
  headerPart2 = 'News',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  subtitle,
  useDynamicData = false,
  categorySlug = 'college-news',
  maxItems = 6,
  newsItems = [],
  layout = 'carousel',
  columns = '4',
  variant = 'modern-light',
  cardStyle = 'modern',
  showDecorations = true,
  showCategory = true,
  autoplay = true,
  autoplaySpeed = 4000,
  viewAllLink = '/blog/category/college-news',
  viewAllText = 'View All News',
  className,
  isEditing,
}: CollegeNewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const headerRef = useInView()
  const contentRef = useInView()

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  // Fetch dynamic data from blog posts
  const fetchDynamicData = useCallback(async () => {
    if (!useDynamicData || !categorySlug) return

    setIsLoading(true)
    try {
      const { posts } = await getBlogPostsByCategory(categorySlug, maxItems)
      const newsData: NewsItem[] = posts.map((post) => ({
        title: post.title,
        image: post.featured_image || '',
        date: post.published_at
          ? new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        link: `/blog/${post.slug}`,
        excerpt: post.excerpt || undefined,
        category: post.category?.name || 'News',
      }))
      setDynamicNews(newsData)
    } catch (error) {
      console.error('Error fetching dynamic news:', error)
    } finally {
      setIsLoading(false)
    }
  }, [useDynamicData, categorySlug, maxItems])

  useEffect(() => {
    fetchDynamicData()
  }, [fetchDynamicData])

  const defaultNews: NewsItem[] = [
    { title: 'NAAC A+ Accreditation Achieved', image: '', date: 'Jan 15, 2025', link: '/news/naac', category: 'Achievement' },
    { title: 'Students Win National Level Hackathon', image: '', date: 'Jan 10, 2025', link: '/news/hackathon', category: 'Events' },
    { title: 'New Research Lab Inaugurated', image: '', date: 'Jan 5, 2025', link: '/news/research-lab', category: 'Infrastructure' },
  ]

  // Priority: dynamic data > props data > default data
  const displayNews = useDynamicData && dynamicNews.length > 0
    ? dynamicNews
    : newsItems.length > 0
      ? newsItems
      : defaultNews

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
            <Newspaper className="w-4 h-4" />
            <span>Latest Updates</span>
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

        {/* News Display */}
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
              {/* Carousel - max 3 cards visible on desktop */}
              <div className="max-w-[1008px] mx-auto">
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {displayNews.map((news, index) => (
                    <NewsCard
                      key={index}
                      news={news}
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
                {displayNews.map((_, index) => (
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
          ) : layout === 'featured' ? (
            // Featured layout: 1 large + 3 small
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {displayNews.slice(0, 1).map((news, index) => (
                <NewsCard
                  key={index}
                  news={news}
                  cardStyle={cardStyle}
                  isDark={isDark}
                  showCategory={showCategory}
                  isEditing={isEditing}
                  index={index}
                  isInView={contentRef.isInView}
                  isFeatured
                  className="lg:row-span-2"
                />
              ))}
              <div className="grid gap-6">
                {displayNews.slice(1, 4).map((news, index) => (
                  <NewsCard
                    key={index + 1}
                    news={news}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    showCategory={showCategory}
                    isEditing={isEditing}
                    index={index + 1}
                    isInView={contentRef.isInView}
                    isCompact
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={cn('grid gap-6 max-w-7xl mx-auto', columnClasses[columns])}>
              {displayNews.map((news, index) => (
                <NewsCard
                  key={index}
                  news={news}
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
 * Individual News Card - Modern Design
 */
function NewsCard({
  news,
  cardStyle,
  isDark,
  showCategory,
  isEditing,
  className,
  index,
  isInView,
  isFeatured = false,
  isCompact = false,
}: {
  news: NewsItem
  cardStyle: 'glassmorphic' | 'modern' | 'minimal'
  isDark: boolean
  showCategory: boolean
  isEditing?: boolean
  className?: string
  index: number
  isInView: boolean
  isFeatured?: boolean
  isCompact?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-500 h-full flex',
        isFeatured ? 'flex-col min-h-[500px]' : isCompact ? 'flex-row h-[140px]' : 'flex-col h-[380px]',
        cardStyle === 'glassmorphic' && isDark && 'glass-card-dark',
        cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl',
        cardStyle === 'modern' && 'bg-white shadow-lg hover:shadow-2xl',
        cardStyle === 'minimal' && 'bg-white border border-gray-100',
        'hover:-translate-y-1',
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
          isHovered && "opacity-15"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      {/* Image */}
      <div className={cn(
        "relative overflow-hidden flex-shrink-0",
        isFeatured ? "h-[280px]" : isCompact ? "w-[180px] h-full" : "h-[200px]"
      )}>
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, 320px"}
            className={cn(
              'object-cover transition-transform duration-700',
              'group-hover:scale-110'
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          }}
        />

        {/* Category Badge */}
        {showCategory && news.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: 'rgba(11, 109, 65, 0.9)' }}
          >
            {news.category}
          </div>
        )}

        {/* Date Badge */}
        <div
          className={cn(
            "absolute px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm shadow-lg",
            showCategory ? "top-4 right-4" : "top-4 left-4"
          )}
          style={{ backgroundColor: 'rgba(255, 222, 89, 0.95)' }}
        >
          <Calendar className="w-3 h-3 text-gray-800" />
          <span className="text-gray-800">{news.date}</span>
        </div>

        {/* Read More on Hover */}
        <div
          className={cn(
            'absolute bottom-4 left-4 transition-all duration-500',
            isHovered && !isCompact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <span className="text-white font-semibold flex items-center gap-2">
            Read Article
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "relative flex-grow flex flex-col",
        isCompact ? "p-4 justify-center" : "p-5",
        isDark && cardStyle === 'glassmorphic' ? 'bg-transparent' : 'bg-white'
      )}>
        {/* Gold accent line on hover */}
        {!isCompact && (
          <div
            className={cn(
              'absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500',
              isHovered ? 'w-3/4' : 'w-0'
            )}
            style={{ backgroundColor: '#ffde59' }}
          />
        )}

        <h3 className={cn(
          "font-bold transition-colors duration-300",
          isFeatured ? "text-xl md:text-2xl" : isCompact ? "text-base" : "text-lg",
          isCompact ? "line-clamp-2" : "line-clamp-2 mt-2",
          isDark && cardStyle === 'glassmorphic' ? 'text-white' : 'text-gray-900'
        )}>
          {news.title}
        </h3>

        {news.excerpt && !isCompact && (
          <p className={cn(
            "text-sm mt-3 line-clamp-2 flex-grow",
            isDark && cardStyle === 'glassmorphic' ? 'text-white/60' : 'text-gray-500'
          )}>
            {news.excerpt}
          </p>
        )}

        {/* Read More Link */}
        {!isCompact && (
          <div className="mt-4 flex items-center text-sm font-semibold text-gold">
            <span>Read Full Article</span>
            <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        )}
      </div>

      {/* Bottom Accent Gradient */}
      {!isCompact && (
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

  if (news.link && !isEditing) {
    return (
      <Link href={news.link} className={cn('block h-full', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={cn('h-full', className)}>{cardContent}</div>
}

export default CollegeNews
