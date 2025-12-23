'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Handshake, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Partner item schema
 */
export const PartnerItemSchema = z.object({
  name: z.string().describe('Partner name'),
  logo: z.string().describe('Partner logo URL'),
  link: z.string().optional().describe('Partner website URL'),
  category: z.string().optional().describe('Partner category'),
})

export type PartnerItem = z.infer<typeof PartnerItemSchema>

/**
 * PartnersLogos props schema
 */
export const PartnersLogosPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Supporting').describe('First part of header'),
  headerPart2: z.string().default('Partners').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Partners
  partners: z.array(PartnerItemSchema).default([]).describe('List of partners'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'marquee']).default('carousel').describe('Display layout'),
  columns: z.enum(['4', '5', '6', '8']).default('6').describe('Number of columns'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'bordered', 'minimal']).default('bordered').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  grayscale: z.boolean().default(false).describe('Display logos in grayscale'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay'),
  autoplaySpeed: z.number().default(3000).describe('Autoplay speed in ms'),

  // Mobile settings
  enableSwipe: z.boolean().default(true).describe('Enable touch swipe on mobile'),
  showNavigationDots: z.boolean().default(true).describe('Show navigation dots'),
  showNavigationArrows: z.boolean().default(true).describe('Show navigation arrows'),
})

export type PartnersLogosProps = z.infer<typeof PartnersLogosPropsSchema> & BaseBlockProps

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
 * PartnersLogos Component
 *
 * Optimized partner logo showcase featuring:
 * - Touch/swipe support for mobile
 * - Performance optimized with CSS transforms
 * - Navigation dots and arrows
 * - Smooth scroll snapping
 * - Reduced repaints and reflows
 * - GPU-accelerated animations
 */
export function PartnersLogos({
  headerPart1 = 'Supporting',
  headerPart2 = 'Partners',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  subtitle,
  partners = [],
  layout = 'carousel',
  columns = '6',
  variant = 'modern-light',
  cardStyle = 'bordered',
  showDecorations = true,
  grayscale = false,
  autoplay = true,
  autoplaySpeed = 3000,
  enableSwipe = true,
  showNavigationDots = true,
  showNavigationArrows = true,
  className,
  isEditing,
}: PartnersLogosProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const headerRef = useInView()
  const contentRef = useInView()

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  const defaultPartners: PartnerItem[] = [
    { name: 'Yi Accessibility', logo: '', link: '#', category: 'Industry' },
    { name: 'Yi Innovation', logo: '', link: '#', category: 'Industry' },
    { name: 'Yi Learning', logo: '', link: '#', category: 'Education' },
    { name: 'Road Safety', logo: '', link: '#', category: 'Government' },
    { name: 'Young Indians', logo: '', link: '#', category: 'Industry' },
    { name: 'CII', logo: '', link: '#', category: 'Industry' },
    { name: 'NASSCOM', logo: '', link: '#', category: 'Technology' },
    { name: 'TCS', logo: '', link: '#', category: 'Technology' },
  ]

  const displayPartners = partners.length > 0 ? partners : defaultPartners

  // Calculate cards per view based on viewport
  const getCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 1
    const width = window.innerWidth
    if (width >= 1024) return 4 // Desktop: 4 cards
    if (width >= 768) return 3 // Tablet: 3 cards
    if (width >= 640) return 2 // Small tablet: 2 cards
    return 1 // Mobile: 1 card
  }, [])

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView())

  // Update cards per view on resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getCardsPerView])

  // Total pages for navigation dots
  const totalPages = Math.ceil(displayPartners.length / cardsPerView)

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return

    const cardWidth = 190 // Card width + gap
    const scrollPosition = index * cardWidth

    scrollRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })

    setCurrentIndex(index)
  }, [])

  // Navigate to next/prev
  const navigateNext = useCallback(() => {
    const nextIndex = (currentIndex + cardsPerView) % displayPartners.length
    scrollToIndex(nextIndex)
  }, [currentIndex, cardsPerView, displayPartners.length, scrollToIndex])

  const navigatePrev = useCallback(() => {
    const prevIndex = currentIndex - cardsPerView
    const newIndex = prevIndex < 0 ? displayPartners.length - cardsPerView : prevIndex
    scrollToIndex(newIndex)
  }, [currentIndex, cardsPerView, displayPartners.length, scrollToIndex])

  // Touch handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe) return
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe) return
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!enableSwipe) return

    const swipeThreshold = 50
    const swipeDistance = touchStart - touchEnd

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped left - go to next
        navigateNext()
      } else {
        // Swiped right - go to previous
        navigatePrev()
      }
    }

    setIsPaused(false)
  }

  // Autoplay carousel
  useEffect(() => {
    if (layout !== 'carousel' || isEditing || isPaused || !autoplay) return

    const interval = setInterval(() => {
      navigateNext()
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [layout, isEditing, isPaused, autoplaySpeed, autoplay, navigateNext])

  // Update current index based on scroll position
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    const cardWidth = 190
    const scrollLeft = scrollRef.current.scrollLeft
    const newIndex = Math.round(scrollLeft / cardWidth)

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }, [currentIndex])

  // Debounced scroll handler
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let timeoutId: NodeJS.Timeout
    const debouncedScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    scrollContainer.addEventListener('scroll', debouncedScroll, { passive: true })
    return () => {
      scrollContainer.removeEventListener('scroll', debouncedScroll)
      clearTimeout(timeoutId)
    }
  }, [handleScroll])

  const columnClasses = {
    '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    '5': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    '6': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    '8': 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
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
        <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />
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
            <Handshake className="w-4 h-4" />
            <span>Trusted Partners</span>
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

        {/* Partners Display */}
        <div
          ref={contentRef.ref}
          className={cn(
            "transition-all duration-700 delay-200",
            contentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {layout === 'carousel' ? (
            <div className="relative">
              {/* Navigation Arrows */}
              {showNavigationArrows && displayPartners.length > cardsPerView && (
                <>
                  <button
                    onClick={navigatePrev}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110",
                      isDark ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white",
                      "hidden md:flex"
                    )}
                    aria-label="Previous partners"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={navigateNext}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110",
                      isDark ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white",
                      "hidden md:flex"
                    )}
                    aria-label="Next partners"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Carousel Container */}
              <div
                ref={scrollRef}
                className={cn(
                  "flex gap-6 overflow-x-auto pb-4 justify-start md:justify-center",
                  "scrollbar-hide",
                  "scroll-smooth",
                  // CSS scroll snap for better mobile UX
                  "snap-x snap-mandatory"
                )}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  // GPU acceleration
                  willChange: 'scroll-position',
                  WebkitOverflowScrolling: 'touch',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {displayPartners.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    partner={partner}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    grayscale={grayscale}
                    isEditing={isEditing}
                    index={index}
                    className="flex-shrink-0 w-[170px] h-[110px] snap-center"
                  />
                ))}
              </div>

              {/* Navigation Dots */}
              {showNavigationDots && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const dotIndex = index * cardsPerView
                    const isActive = currentIndex >= dotIndex && currentIndex < dotIndex + cardsPerView

                    return (
                      <button
                        key={index}
                        onClick={() => scrollToIndex(dotIndex)}
                        className={cn(
                          "transition-all duration-300 rounded-full",
                          isActive
                            ? "w-8 h-2 bg-brand-primary"
                            : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                        )}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          ) : layout === 'marquee' ? (
            <MarqueeLogos
              partners={displayPartners}
              cardStyle={cardStyle}
              isDark={isDark}
              grayscale={grayscale}
              isEditing={isEditing}
            />
          ) : (
            <div className={cn('grid gap-6 max-w-6xl mx-auto', columnClasses[columns])}>
              {displayPartners.map((partner, index) => (
                <PartnerCard
                  key={index}
                  partner={partner}
                  cardStyle={cardStyle}
                  isDark={isDark}
                  grayscale={grayscale}
                  isEditing={isEditing}
                  index={index}
                  className="h-[110px]"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Partner Card - Optimized for Performance
 */
function PartnerCard({
  partner,
  cardStyle,
  isDark,
  grayscale,
  isEditing,
  className,
  index,
}: {
  partner: PartnerItem
  cardStyle: 'glassmorphic' | 'bordered' | 'minimal'
  isDark: boolean
  grayscale: boolean
  isEditing?: boolean
  className?: string
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative p-4 rounded-xl flex items-center justify-center h-full transition-all duration-300',
        cardStyle === 'glassmorphic' && isDark && 'glass-card-dark',
        cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-lg',
        cardStyle === 'bordered' && 'bg-white border border-gray-200 hover:border-gold',
        cardStyle === 'minimal' && 'bg-white',
        'hover:shadow-lg hover:-translate-y-1',
      )}
      style={{
        // GPU acceleration for transforms
        willChange: isHovered ? 'transform, box-shadow' : 'auto',
        boxShadow: isHovered ? '0 8px 30px rgba(255, 222, 89, 0.15)' : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gold accent glow on hover */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl opacity-0 blur transition-opacity duration-300",
          isHovered && "opacity-30"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      <div className="relative z-10">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={partner.name}
            width={120}
            height={60}
            sizes="120px"
            className={cn(
              'object-contain max-h-16 transition-all duration-300',
              grayscale && 'grayscale group-hover:grayscale-0',
              'group-hover:scale-110'
            )}
            loading="lazy"
          />
        ) : (
          <div className="text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-300",
                isHovered ? "scale-110" : "scale-100"
              )}
              style={{
                backgroundColor: isHovered ? 'rgba(255, 222, 89, 0.15)' : isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
              }}
            >
              <span
                className={cn(
                  "text-lg font-bold transition-colors duration-300",
                  isDark ? "text-white" : isHovered ? "text-gold" : "text-gray-400"
                )}
              >
                {partner.name.charAt(0)}
              </span>
            </div>
            <span className={cn(
              "text-xs line-clamp-1 transition-colors",
              isDark ? "text-white/60 group-hover:text-white" : "text-gray-500 group-hover:text-gray-700"
            )}>
              {partner.name}
            </span>
          </div>
        )}
      </div>

      {/* External Link Indicator */}
      {partner.link && (
        <div
          className={cn(
            'absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all duration-300',
            isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm',
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}
        >
          <ExternalLink className="w-3 h-3 text-gold" />
        </div>
      )}

      {/* Bottom gold accent line on hover */}
      <div
        className={cn(
          'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300',
          isHovered ? 'w-3/4' : 'w-0'
        )}
        style={{ backgroundColor: '#ffde59' }}
      />
    </div>
  )

  if (partner.link && !isEditing) {
    return (
      <Link href={partner.link} target="_blank" rel="noopener noreferrer" className={cn('block', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={className}>{cardContent}</div>
}

/**
 * Marquee Animation for Logos - Optimized
 */
function MarqueeLogos({
  partners,
  cardStyle,
  isDark,
  grayscale,
  isEditing,
}: {
  partners: PartnerItem[]
  cardStyle: 'glassmorphic' | 'bordered' | 'minimal'
  isDark: boolean
  grayscale: boolean
  isEditing?: boolean
}) {
  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners]

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          'flex gap-6',
          !isEditing && 'animate-marquee'
        )}
        style={{
          animation: isEditing ? 'none' : 'marquee 30s linear infinite',
          // GPU acceleration
          willChange: isEditing ? 'auto' : 'transform',
        }}
      >
        {duplicatedPartners.map((partner, index) => (
          <PartnerCard
            key={index}
            partner={partner}
            cardStyle={cardStyle}
            isDark={isDark}
            grayscale={grayscale}
            isEditing={isEditing}
            index={index % partners.length}
            className="flex-shrink-0 w-[160px] h-[100px]"
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

export default PartnersLogos
