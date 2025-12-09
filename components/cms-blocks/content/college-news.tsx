'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Calendar } from 'lucide-react'

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
 * CollegeNews Component
 *
 * News section with carousel or grid layout featuring:
 * - Split-color header with brand colors
 * - Auto-scrolling carousel with pause on hover
 * - Uniform card sizing
 * - Date badges on images
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

        {/* News Display */}
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
              {displayNews.map((news, index) => (
                <NewsCard
                  key={index}
                  news={news}
                  dateBadgeColor={dateBadgeColor}
                  accentColor={accentColor}
                  isEditing={isEditing}
                  className="snap-start flex-shrink-0 w-[300px] h-[320px]"
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
                className="h-[320px]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Individual News Card - Uniform sizing
 */
function NewsCard({
  news,
  dateBadgeColor,
  accentColor,
  isEditing,
  className,
}: {
  news: NewsItem
  dateBadgeColor: string
  accentColor: string
  isEditing?: boolean
  className?: string
}) {
  const cardContent = (
    <div className={cn('group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col', className)}>
      {/* Image - Fixed height */}
      <div className="relative h-[180px] overflow-hidden flex-shrink-0">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Date Badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-1.5"
          style={{ backgroundColor: dateBadgeColor }}
        >
          <Calendar className="w-3.5 h-3.5" />
          {news.date}
        </div>
      </div>

      {/* Content - Flex grow to fill remaining space */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
          {news.title}
        </h3>
        {news.excerpt && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-grow">{news.excerpt}</p>
        )}
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
