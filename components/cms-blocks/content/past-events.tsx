'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Calendar, CalendarDays, ChevronRight, ArrowRight, MapPin } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Event item schema
 */
export const EventItemSchema = z.object({
  title: z.string().describe('Event title'),
  image: z.string().describe('Event image URL'),
  date: z.string().describe('Event date'),
  link: z.string().optional().describe('Link to event details'),
  description: z.string().optional().describe('Event description'),
  location: z.string().optional().describe('Event location'),
})

export type EventItem = z.infer<typeof EventItemSchema>

/**
 * PastEvents props schema
 */
export const PastEventsPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Past').describe('First part of header'),
  headerPart2: z.string().default('Events').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Events
  events: z.array(EventItemSchema).default([]).describe('List of past events'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'timeline']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'modern', 'minimal']).default('modern').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  showLocation: z.boolean().default(false).describe('Show location on cards'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay'),
  autoplaySpeed: z.number().default(4000).describe('Autoplay speed in ms'),
})

export type PastEventsProps = z.infer<typeof PastEventsPropsSchema> & BaseBlockProps

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
 * PastEvents Component
 *
 * Modern event showcase featuring:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Auto-scrolling carousel or grid layout
 * - Glassmorphic or modern card styles
 * - Scroll-triggered animations
 * - Gold accent date badges
 */
export function PastEvents({
  headerPart1 = 'Past',
  headerPart2 = 'Events',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  subtitle,
  events = [],
  layout = 'carousel',
  columns = '4',
  variant = 'modern-light',
  cardStyle = 'modern',
  showDecorations = true,
  showLocation = false,
  autoplay = true,
  autoplaySpeed = 4000,
  className,
  isEditing,
}: PastEventsProps) {
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

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  const defaultEvents: EventItem[] = [
    { title: 'Pongal Celebration 2025', image: '', date: 'January 14, 2025', link: '/events/pongal-2025', location: 'Main Campus' },
    { title: 'Senior Internship Program Inauguration', image: '', date: 'February 21, 2025', link: '/events/internship', location: 'Auditorium' },
    { title: 'Mental Health & Suicide Awareness Initiative', image: '', date: 'February 11, 2024', link: '/events/mental-health', location: 'Seminar Hall' },
  ]

  const displayEvents = events.length > 0 ? events : defaultEvents

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
            <CalendarDays className="w-4 h-4" />
            <span>Event Highlights</span>
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

        {/* Events Display */}
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
                  {displayEvents.map((event, index) => (
                    <EventCard
                    key={index}
                    event={event}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    showLocation={showLocation}
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
                {displayEvents.map((_, index) => (
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
          ) : layout === 'timeline' ? (
            // Timeline layout
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className={cn(
                  "absolute left-8 top-0 bottom-0 w-0.5",
                  isDark ? "bg-white/20" : "bg-brand-primary/20"
                )} />

                {displayEvents.map((event, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative pl-20 pb-12 last:pb-0 transition-all duration-700",
                      contentRef.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                    )}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-6 w-5 h-5 rounded-full border-4"
                      style={{
                        borderColor: '#ffde59',
                        backgroundColor: isDark ? '#064d2e' : '#ffffff'
                      }}
                    />

                    <EventCard
                      event={event}
                      cardStyle={cardStyle}
                      isDark={isDark}
                      showLocation={showLocation}
                      isEditing={isEditing}
                      index={index}
                      isInView={contentRef.isInView}
                      isCompact
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={cn('grid gap-6 max-w-7xl mx-auto', columnClasses[columns])}>
              {displayEvents.map((event, index) => (
                <EventCard
                  key={index}
                  event={event}
                  cardStyle={cardStyle}
                  isDark={isDark}
                  showLocation={showLocation}
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
            href="/events"
            className={cn(
              "group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300",
              isDark
                ? "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                : "bg-brand-primary text-white hover:bg-brand-primary-dark"
            )}
          >
            View All Events
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Event Card - Modern Design
 */
function EventCard({
  event,
  cardStyle,
  isDark,
  showLocation,
  isEditing,
  className,
  index,
  isInView,
  isCompact = false,
}: {
  event: EventItem
  cardStyle: 'glassmorphic' | 'modern' | 'minimal'
  isDark: boolean
  showLocation: boolean
  isEditing?: boolean
  className?: string
  index: number
  isInView: boolean
  isCompact?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-500 h-full flex',
        isCompact ? 'flex-row h-[140px]' : 'flex-col h-[380px]',
        cardStyle === 'glassmorphic' && isDark && 'glass-card-dark',
        cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl',
        cardStyle === 'modern' && 'bg-white shadow-lg hover:shadow-2xl',
        cardStyle === 'minimal' && 'bg-white border border-gray-100',
        !isCompact && 'hover:-translate-y-1',
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
        isCompact ? "w-[180px] h-full" : "h-[200px]"
      )}>
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className={cn(
              'object-cover transition-transform duration-700',
              'group-hover:scale-110'
            )}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHovered && !isCompact ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          }}
        />

        {/* Date Badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm shadow-lg"
          style={{ backgroundColor: 'rgba(255, 222, 89, 0.95)' }}
        >
          <Calendar className="w-3 h-3 text-gray-800" />
          <span className="text-gray-800">{event.date}</span>
        </div>

        {/* View Details on Hover */}
        {!isCompact && (
          <div
            className={cn(
              'absolute bottom-4 left-4 transition-all duration-500',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <span className="text-white font-semibold flex items-center gap-2">
              View Event
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        )}
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
          isCompact ? "text-base line-clamp-2" : "text-lg line-clamp-2 mt-2",
          isDark && cardStyle === 'glassmorphic' ? 'text-white' : 'text-gray-900'
        )}>
          {event.title}
        </h3>

        {showLocation && event.location && !isCompact && (
          <p className={cn(
            "text-sm mt-2 flex items-center gap-1",
            isDark && cardStyle === 'glassmorphic' ? 'text-white/60' : 'text-gray-500'
          )}>
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </p>
        )}

        {event.description && !isCompact && (
          <p className={cn(
            "text-sm mt-2 line-clamp-2 flex-grow",
            isDark && cardStyle === 'glassmorphic' ? 'text-white/60' : 'text-gray-500'
          )}>
            {event.description}
          </p>
        )}

        {/* View More Link */}
        {!isCompact && (
          <div className="mt-4 flex items-center text-sm font-semibold text-gold">
            <span>Event Details</span>
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

  if (event.link && !isEditing) {
    return (
      <Link href={event.link} className={cn('block h-full', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={cn('h-full', className)}>{cardContent}</div>
}

export default PastEvents
