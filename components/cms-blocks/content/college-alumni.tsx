'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { GraduationCap, Briefcase, MapPin, ChevronLeft, ChevronRight, Quote, Star, ArrowRight } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Alumni item schema
 */
export const AlumniItemSchema = z.object({
  name: z.string().describe('Alumni name'),
  image: z.string().optional().describe('Profile photo URL'),
  batch: z.string().optional().describe('Graduation year/batch'),
  department: z.string().optional().describe('Department/Course'),
  currentRole: z.string().optional().describe('Current job title'),
  company: z.string().optional().describe('Current company'),
  location: z.string().optional().describe('Current location'),
  testimonial: z.string().optional().describe('Quote or testimonial'),
  link: z.string().optional().describe('LinkedIn or profile link'),
})

export type AlumniItem = z.infer<typeof AlumniItemSchema>

/**
 * CollegeAlumni props schema
 */
export const CollegeAlumniPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Our').describe('First part of header'),
  headerPart2: z.string().default('Alumni').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Alumni list
  alumni: z.array(AlumniItemSchema).default([]).describe('List of alumni'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'testimonials']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('3').describe('Number of columns (grid)'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'bordered', 'elevated']).default('elevated').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay'),
  autoplaySpeed: z.number().default(4000).describe('Autoplay speed in ms'),
})

export type CollegeAlumniProps = z.infer<typeof CollegeAlumniPropsSchema> & BaseBlockProps

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
 * CollegeAlumni Component
 *
 * Modern alumni showcase featuring:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Auto-scrolling carousel or grid layout
 * - Glassmorphic or elevated card styles
 * - Gold accent hover effects
 * - Testimonial quotes
 */
export function CollegeAlumni({
  headerPart1 = 'Our',
  headerPart2 = 'Alumni',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  subtitle,
  alumni = [],
  layout = 'carousel',
  columns = '3',
  variant = 'modern-light',
  cardStyle = 'elevated',
  showDecorations = true,
  autoplay = true,
  autoplaySpeed = 4000,
  className,
  isEditing,
}: CollegeAlumniProps) {
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

  // Default alumni for demo - 3 cards
  const defaultAlumni: AlumniItem[] = [
    {
      name: 'Dr. Priya Venkatesh',
      batch: '2015',
      department: 'Dental Sciences',
      currentRole: 'Senior Dentist',
      company: 'Apollo Hospitals',
      location: 'Chennai',
      testimonial: 'JKKN gave me the foundation to pursue my dreams. The faculty support was exceptional.',
    },
    {
      name: 'Rajesh Kumar',
      batch: '2018',
      department: 'Engineering',
      currentRole: 'Software Engineer',
      company: 'Google',
      location: 'Bangalore',
      testimonial: 'The practical learning approach at JKKN prepared me well for the tech industry.',
    },
    {
      name: 'Anitha Sharma',
      batch: '2016',
      department: 'Pharmacy',
      currentRole: 'Research Scientist',
      company: 'Cipla',
      location: 'Mumbai',
      testimonial: 'World-class labs and research facilities at JKKN helped shape my career.',
    },
  ]

  const displayAlumni = alumni.length > 0 ? alumni : defaultAlumni

  // Autoplay carousel
  useEffect(() => {
    if (layout !== 'carousel' || isEditing || isPaused || !autoplay) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const cardWidth = 380

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
      const scrollAmount = 380
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
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
            <GraduationCap className="w-4 h-4" />
            <span>Success Stories</span>
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
              {/* Navigation Buttons */}
              <button
                onClick={() => scroll('left')}
                className={cn(
                  "absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg",
                  isDark ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" : "bg-white text-brand-primary"
                )}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-[1098px] mx-auto">
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {displayAlumni.map((alum, index) => (
                    <AlumniCard
                    key={index}
                    alumni={alum}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    isEditing={isEditing}
                    index={index}
                    isInView={contentRef.isInView}
                      className="snap-start flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[350px]"
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
          ) : layout === 'testimonials' ? (
            <div className="max-w-4xl mx-auto">
              {displayAlumni.slice(0, 3).map((alum, index) => (
                <TestimonialCard
                  key={index}
                  alumni={alum}
                  isDark={isDark}
                  index={index}
                  isInView={contentRef.isInView}
                />
              ))}
            </div>
          ) : (
            <div className={cn('grid gap-6 max-w-7xl mx-auto', columnClasses[columns])}>
              {displayAlumni.map((alum, index) => (
                <AlumniCard
                  key={index}
                  alumni={alum}
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
        <div className="text-center mt-12">
          <Link
            href="/alumni"
            className={cn(
              "group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300",
              isDark
                ? "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                : "bg-brand-primary text-white hover:bg-brand-primary-dark"
            )}
          >
            <GraduationCap className="w-5 h-5" />
            View All Alumni
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Alumni Card
 */
function AlumniCard({
  alumni,
  cardStyle,
  isDark,
  isEditing,
  className,
  index,
  isInView,
}: {
  alumni: AlumniItem
  cardStyle: 'glassmorphic' | 'bordered' | 'elevated'
  isDark: boolean
  isEditing?: boolean
  className?: string
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group rounded-2xl overflow-hidden transition-all duration-500 h-full',
        cardStyle === 'glassmorphic' && isDark && 'glass-card-dark',
        cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-lg',
        cardStyle === 'bordered' && 'bg-white border-2 border-gray-200 hover:border-gold',
        cardStyle === 'elevated' && 'bg-white shadow-lg hover:shadow-2xl',
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
          "absolute -inset-0.5 rounded-2xl opacity-0 blur transition-opacity duration-500 -z-10",
          isHovered && "opacity-30"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      <div className="p-6 relative">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div
            className={cn(
              "relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-offset-2 transition-all duration-300",
              isHovered ? "ring-gold" : "ring-brand-primary/30"
            )}
          >
            {alumni.image ? (
              <Image
                src={alumni.image}
                alt={alumni.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-gold/20">
                <span className="text-xl font-bold text-brand-primary">
                  {alumni.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-lg font-bold truncate transition-colors",
              isDark && cardStyle === 'glassmorphic' ? "text-white" : "text-gray-900"
            )}>
              {alumni.name}
            </h3>
            {alumni.batch && alumni.department && (
              <p className={cn(
                "text-sm",
                isDark && cardStyle === 'glassmorphic' ? "text-white/60" : "text-gray-500"
              )}>
                {alumni.department} &bull; Batch of {alumni.batch}
              </p>
            )}
          </div>
        </div>

        {/* Current Position */}
        {(alumni.currentRole || alumni.company) && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <Briefcase className={cn(
              "w-4 h-4 flex-shrink-0 transition-colors",
              isHovered ? "text-gold" : isDark && cardStyle === 'glassmorphic' ? "text-white/40" : "text-gray-400"
            )} />
            <span className={cn(
              "truncate",
              isDark && cardStyle === 'glassmorphic' ? "text-white/80" : "text-gray-700"
            )}>
              {alumni.currentRole}{alumni.company && ` at ${alumni.company}`}
            </span>
          </div>
        )}

        {/* Location */}
        {alumni.location && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <MapPin className={cn(
              "w-4 h-4 flex-shrink-0",
              isDark && cardStyle === 'glassmorphic' ? "text-white/40" : "text-gray-400"
            )} />
            <span className={cn(
              isDark && cardStyle === 'glassmorphic' ? "text-white/60" : "text-gray-500"
            )}>
              {alumni.location}
            </span>
          </div>
        )}

        {/* Testimonial */}
        {alumni.testimonial && (
          <div className={cn(
            "relative mt-4 pt-4 border-t",
            isDark && cardStyle === 'glassmorphic' ? "border-white/10" : "border-gray-100"
          )}>
            <Quote
              className="absolute -top-3 left-0 w-6 h-6 text-gold opacity-40"
            />
            <p className={cn(
              "text-sm italic line-clamp-3 pl-2",
              isDark && cardStyle === 'glassmorphic' ? "text-white/70" : "text-gray-600"
            )}>
              "{alumni.testimonial}"
            </p>
          </div>
        )}

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-4 h-4 transition-all duration-300",
                isHovered ? "scale-110" : "scale-100"
              )}
              style={{ color: '#ffde59', fill: '#ffde59' }}
            />
          ))}
        </div>

        {/* Bottom gold accent line on hover */}
        <div
          className={cn(
            'absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-t-full transition-all duration-500',
            isHovered ? 'w-3/4' : 'w-0'
          )}
          style={{ backgroundColor: '#ffde59' }}
        />
      </div>
    </div>
  )

  if (alumni.link && !isEditing) {
    return (
      <Link href={alumni.link} className={cn('block', className)} target="_blank">
        {cardContent}
      </Link>
    )
  }

  return <div className={className}>{cardContent}</div>
}

/**
 * Testimonial Card - Full width testimonial layout
 */
function TestimonialCard({
  alumni,
  isDark,
  index,
  isInView,
}: {
  alumni: AlumniItem
  isDark: boolean
  index: number
  isInView: boolean
}) {
  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl mb-6 transition-all duration-700",
        isDark ? "glass-card-dark" : "bg-white shadow-lg",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Large Quote */}
      <Quote className="absolute top-6 left-6 w-12 h-12 text-gold opacity-20" />

      <div className="relative z-10">
        {alumni.testimonial && (
          <p className={cn(
            "text-xl md:text-2xl italic mb-6 pl-8",
            isDark ? "text-white/90" : "text-gray-700"
          )}>
            "{alumni.testimonial}"
          </p>
        )}

        <div className="flex items-center gap-4 pl-8">
          {/* Avatar */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gold ring-offset-2">
            {alumni.image ? (
              <Image
                src={alumni.image}
                alt={alumni.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 to-gold/20">
                <span className="text-lg font-bold text-brand-primary">
                  {alumni.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div>
            <h4 className={cn(
              "font-bold",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {alumni.name}
            </h4>
            <p className={cn(
              "text-sm",
              isDark ? "text-white/60" : "text-gray-500"
            )}>
              {alumni.currentRole}{alumni.company && ` at ${alumni.company}`}
            </p>
            {alumni.batch && (
              <p className="text-xs text-gold font-medium">
                Batch of {alumni.batch}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Decorative gold line */}
      <div
        className="absolute bottom-0 left-8 right-8 h-1 rounded-full"
        style={{ backgroundColor: 'rgba(255, 222, 89, 0.3)' }}
      />
    </div>
  )
}

export default CollegeAlumni
