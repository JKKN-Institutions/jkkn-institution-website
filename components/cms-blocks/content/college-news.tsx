'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Calendar, Newspaper, ChevronRight, ArrowRight } from 'lucide-react'

/**
 * News item schema
 */
export const NewsItemSchema = z.object({
  title: z.string().describe('News title'),
  image: z.string().describe('News image URL'),
  date: z.string().describe('Publication date'),
  link: z.string().optional().describe('Link to full article'),
  excerpt: z.string().optional().describe('Short excerpt'),
})

export type NewsItem = z.infer<typeof NewsItemSchema>

/**
 * CollegeNews props schema
 */
export const CollegeNewsPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('College').describe('First part of header'),
  headerPart2: z.string().default('News').describe('Second part of header (colored)'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part'),
  headerPart2Italic: z.boolean().default(true).describe('Make second part italic'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // News items
  newsItems: z.array(NewsItemSchema).default([]).describe('List of news articles'),

  // Layout
  layout: z.enum(['carousel', 'grid']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns for grid'),

  // Styling
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  dateBadgeColor: z.string().default('#0b6d41').describe('Date badge background color'),
  accentColor: z.string().default('#0b6d41').describe('Accent color'),

  // Autoplay
  autoplaySpeed: z.number().default(3000).describe('Autoplay speed in ms'),
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
 * Modern news section with carousel or grid layout featuring:
 * - Section badge and decorative elements
 * - Auto-scrolling carousel with pause on hover
 * - Scroll-triggered animations
 * - Glassmorphism date badges
 */
export function CollegeNews({
  headerPart1 = 'College',
  headerPart2 = 'News',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  headerPart2Italic = true,
  subtitle,
  newsItems = [],
  layout = 'carousel',
  columns = '4',
  backgroundColor = '#ffffff',
  dateBadgeColor = '#0b6d41',
  accentColor = '#0b6d41',
  autoplaySpeed = 3000,
  className,
  isEditing,
}: CollegeNewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const headerRef = useInView()
  const contentRef = useInView()

  const defaultNews: NewsItem[] = [
    { title: 'NAAC A+ Accreditation', image: '', date: 'Jan 15, 2025', link: '/news/naac' },
    { title: 'Students Win National Level Hackathon', image: '', date: 'Jan 10, 2025', link: '/news/hackathon' },
    { title: 'New Research Lab Inaugurated', image: '', date: 'Jan 5, 2025', link: '/news/research-lab' },
    { title: 'Record Breaking Placement Season 2024-25', image: '', date: 'Dec 28, 2024', link: '/news/placements' },
    { title: 'Faculty Excellence Award', image: '', date: 'Dec 20, 2024', link: '/news/faculty-award' },
  ]

  const displayNews = newsItems.length > 0 ? newsItems : defaultNews

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
          className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at top right, ${accentColor} 0%, transparent 70%)`
          }}
        />

        {/* Floating circles */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-5"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-20 -left-16 w-56 h-56 rounded-full opacity-5"
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
            <Newspaper className="w-4 h-4" />
            <span>Latest Updates</span>
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

        {/* News Display */}
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
                {displayNews.map((news, index) => (
                  <NewsCard
                    key={index}
                    news={news}
                    dateBadgeColor={dateBadgeColor}
                    accentColor={accentColor}
                    isEditing={isEditing}
                    index={index}
                    isInView={contentRef.isInView}
                    className="snap-start flex-shrink-0 w-[300px] h-[340px]"
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
                  dateBadgeColor={dateBadgeColor}
                  accentColor={accentColor}
                  isEditing={isEditing}
                  index={index}
                  isInView={contentRef.isInView}
                  className="h-[340px]"
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a
            href="/news"
            className="group inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3"
            style={{ color: accentColor }}
          >
            View All News
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * Individual News Card - Modern Design
 */
function NewsCard({
  news,
  dateBadgeColor,
  accentColor,
  isEditing,
  className,
  index,
  isInView,
}: {
  news: NewsItem
  dateBadgeColor: string
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
        'group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 h-full flex flex-col hover:-translate-y-2',
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image - Fixed height */}
      <div className="relative h-[180px] overflow-hidden flex-shrink-0">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `linear-gradient(to top, ${accentColor}cc 0%, transparent 60%)`
          }}
        />

        {/* Date Badge with glassmorphism */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-1.5 backdrop-blur-sm shadow-lg"
          style={{ backgroundColor: `${dateBadgeColor}ee` }}
        >
          <Calendar className="w-3.5 h-3.5" />
          {news.date}
        </div>

        {/* Read More on Hover */}
        <div
          className={cn(
            'absolute bottom-4 left-4 transition-all duration-500',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <span className="text-white font-semibold flex items-center gap-2">
            Read More
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 flex-grow flex flex-col">
        {/* Accent Line */}
        <div
          className={cn(
            'absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500',
            isHovered ? 'w-3/4' : 'w-0'
          )}
          style={{ backgroundColor: accentColor }}
        />

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-2 mt-2">
          {news.title}
        </h3>
        {news.excerpt && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">{news.excerpt}</p>
        )}

        {/* Hover Link */}
        <div
          className={cn(
            'mt-4 flex items-center text-sm font-semibold transition-all duration-500',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
          style={{ color: accentColor }}
        >
          <span>Read Full Article</span>
          <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  )

  if (news.link && !isEditing) {
    return (
      <Link href={news.link} className={cn('block', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={className}>{cardContent}</div>
}

export default CollegeNews
