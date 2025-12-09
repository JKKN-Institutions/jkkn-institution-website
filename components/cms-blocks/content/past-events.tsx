'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

/**
 * Event item schema
 */
export const EventItemSchema = z.object({
  title: z.string().describe('Event title'),
  image: z.string().describe('Event image URL'),
  date: z.string().describe('Event date'),
  link: z.string().optional().describe('Link to event details'),
  description: z.string().optional().describe('Event description'),
})

export type EventItem = z.infer<typeof EventItemSchema>

/**
 * PastEvents props schema
 */
export const PastEventsPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Past').describe('First part of header'),
  headerPart2: z.string().default('Events').describe('Second part of header (colored)'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part'),
  headerPart2Italic: z.boolean().default(true).describe('Make second part italic'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Events
  events: z.array(EventItemSchema).default([]).describe('List of past events'),

  // Layout
  layout: z.enum(['carousel', 'grid']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns'),

  // Styling
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  cardBackgroundColor: z.string().default('#ffffff').describe('Card background color'),
  dateBadgeColor: z.string().default('#0b6d41').describe('Date badge background color'),
  accentColor: z.string().default('#0b6d41').describe('Accent color'),

  // Autoplay
  autoplaySpeed: z.number().default(3000).describe('Autoplay speed in ms'),
})

export type PastEventsProps = z.infer<typeof PastEventsPropsSchema> & BaseBlockProps

/**
 * PastEvents Component
 *
 * Event showcase with:
 * - Split-color header with brand colors
 * - Auto-scrolling carousel with pause on hover
 * - Uniform card sizing
 * - Date badges on images
 */
export function PastEvents({
  headerPart1 = 'Past',
  headerPart2 = 'Events',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  headerPart2Italic = true,
  subtitle,
  events = [],
  layout = 'carousel',
  columns = '4',
  backgroundColor = '#ffffff',
  cardBackgroundColor = '#ffffff',
  dateBadgeColor = '#0b6d41',
  accentColor = '#0b6d41',
  autoplaySpeed = 3000,
  className,
  isEditing,
}: PastEventsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  const defaultEvents: EventItem[] = [
    { title: 'Pongal Celebration 2025', image: '', date: 'January 14, 2025', link: '/events/pongal-2025' },
    { title: 'Inauguration of Senior Internship Program', image: '', date: 'February 21, 2025', link: '/events/internship' },
    { title: 'JKKNCET\'s Initiative on Mental Health and Suicide Awareness', image: '', date: 'February 11, 2024', link: '/events/mental-health' },
    { title: 'Annual Day Celebration', image: '', date: 'March 15, 2024', link: '/events/annual-day' },
  ]

  // Always show default events if empty (users can add real data via admin panel)
  const displayEvents = events.length > 0 ? events : defaultEvents

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

        {/* Events Display */}
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
              {displayEvents.map((event, index) => (
                <EventCard
                  key={index}
                  event={event}
                  cardBg={cardBackgroundColor}
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
            {displayEvents.map((event, index) => (
              <EventCard
                key={index}
                event={event}
                cardBg={cardBackgroundColor}
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
 * Individual Event Card - Uniform sizing
 */
function EventCard({
  event,
  cardBg,
  dateBadgeColor,
  accentColor,
  isEditing,
  className,
}: {
  event: EventItem
  cardBg: string
  dateBadgeColor: string
  accentColor: string
  isEditing?: boolean
  className?: string
}) {
  const cardContent = (
    <div
      className={cn(
        'group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col',
        className
      )}
      style={{ backgroundColor: cardBg }}
    >
      {/* Image - Fixed height */}
      <div className="relative h-[180px] overflow-hidden flex-shrink-0">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
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
          {event.date}
        </div>
      </div>

      {/* Content - Flex grow to fill remaining space */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-grow">{event.description}</p>
        )}
      </div>
    </div>
  )

  if (event.link && !isEditing) {
    return (
      <Link href={event.link} className={cn('block', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={className}>{cardContent}</div>
}

export default PastEvents
