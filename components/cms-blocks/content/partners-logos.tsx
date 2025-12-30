'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Handshake, ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'
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
  mobileAutoplaySpeed: z.number().default(4000).describe('Autoplay speed on mobile in ms'),

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
  mobileAutoplaySpeed = 4000,
  enableSwipe = true,
  showNavigationDots = true,
  showNavigationArrows = true,
  className,
  isEditing,
}: PartnersLogosProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  // Touch/drag state for smooth scrolling
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragScrollLeft, setDragScrollLeft] = useState(0)
  // Mobile detection for responsive autoplay
  const [isMobile, setIsMobile] = useState(false)
  // Swipe hint visibility
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  // Velocity tracking for momentum scrolling
  const velocityRef = useRef(0)
  const lastMoveTimeRef = useRef(0)
  const lastMoveXRef = useRef(0)
  const headerRef = useInView()
  const contentRef = useInView()

  // Detect mobile for responsive autoplay speed
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-hide swipe hint after 3 seconds
  useEffect(() => {
    if (!isMobile) return
    const timer = setTimeout(() => setShowSwipeHint(false), 3000)
    return () => clearTimeout(timer)
  }, [isMobile])

  // Use mobile speed on smaller screens
  const currentAutoplaySpeed = isMobile ? mobileAutoplaySpeed : autoplaySpeed

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
  // On mobile, always show 1 card at a time
  const effectiveCardsPerView = isMobile ? 1 : cardsPerView
  const totalPages = Math.ceil(displayPartners.length / effectiveCardsPerView)

  // Get card width based on device (defined early for use in navigation)
  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return 190
    return isMobile ? window.innerWidth - 64 : 190 // Full width minus padding on mobile
  }, [isMobile])

  // Scroll to specific index
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return

    const cardWidth = getCardWidth() + 24 // Card width + gap
    const scrollPosition = index * cardWidth

    scrollRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })

    setCurrentIndex(index)
  }, [getCardWidth])

  // Navigate to next/prev (1 card at a time on mobile)
  const navigateNext = useCallback(() => {
    const step = isMobile ? 1 : cardsPerView
    const nextIndex = currentIndex + step
    if (nextIndex >= displayPartners.length) {
      scrollToIndex(0) // Loop back to start
    } else {
      scrollToIndex(nextIndex)
    }
  }, [currentIndex, cardsPerView, displayPartners.length, scrollToIndex, isMobile])

  const navigatePrev = useCallback(() => {
    const step = isMobile ? 1 : cardsPerView
    const prevIndex = currentIndex - step
    if (prevIndex < 0) {
      scrollToIndex(displayPartners.length - 1) // Loop to end
    } else {
      scrollToIndex(prevIndex)
    }
  }, [currentIndex, cardsPerView, displayPartners.length, scrollToIndex, isMobile])

  // Touch handlers for smooth real-time scrolling with momentum
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableSwipe || !scrollRef.current) return
    setIsDragging(true)
    setShowSwipeHint(false) // Hide swipe hint on first interaction
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    setDragStartX(x)
    setDragScrollLeft(scrollRef.current.scrollLeft)
    setIsPaused(true)
    // Reset velocity tracking
    velocityRef.current = 0
    lastMoveTimeRef.current = Date.now()
    lastMoveXRef.current = x
  }, [enableSwipe])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - dragStartX) * 1.5 // 1.5x multiplier for natural feel
    scrollRef.current.scrollLeft = dragScrollLeft - walk

    // Calculate velocity for momentum
    const currentTime = Date.now()
    const timeDelta = currentTime - lastMoveTimeRef.current
    if (timeDelta > 0) {
      velocityRef.current = (x - lastMoveXRef.current) / timeDelta
    }
    lastMoveTimeRef.current = currentTime
    lastMoveXRef.current = x
  }, [isDragging, dragStartX, dragScrollLeft])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setIsPaused(false)

    if (!scrollRef.current) return

    const cardWidth = getCardWidth() + 24 // Card width + gap

    // Apply momentum if velocity is significant
    if (Math.abs(velocityRef.current) > 0.3) {
      const momentum = velocityRef.current * 120
      const currentScroll = scrollRef.current.scrollLeft
      const targetScroll = currentScroll - momentum
      const nearestIndex = Math.round(targetScroll / cardWidth)
      const clampedIndex = Math.max(0, Math.min(nearestIndex, displayPartners.length - 1))

      scrollRef.current.scrollTo({
        left: clampedIndex * cardWidth,
        behavior: 'smooth'
      })
      setCurrentIndex(clampedIndex)
    } else {
      // Snap to nearest card
      const scrollLeft = scrollRef.current.scrollLeft
      const newIndex = Math.round(scrollLeft / cardWidth)
      const clampedIndex = Math.max(0, Math.min(newIndex, displayPartners.length - 1))

      scrollRef.current.scrollTo({
        left: clampedIndex * cardWidth,
        behavior: 'smooth'
      })
      setCurrentIndex(clampedIndex)
    }
  }, [getCardWidth, displayPartners.length])

  // Mouse drag handlers for desktop with velocity tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setShowSwipeHint(false)
    const x = e.pageX - scrollRef.current.offsetLeft
    setDragStartX(x)
    setDragScrollLeft(scrollRef.current.scrollLeft)
    setIsPaused(true)
    // Reset velocity tracking
    velocityRef.current = 0
    lastMoveTimeRef.current = Date.now()
    lastMoveXRef.current = x
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - dragStartX) * 1.5
    scrollRef.current.scrollLeft = dragScrollLeft - walk

    // Calculate velocity for momentum
    const currentTime = Date.now()
    const timeDelta = currentTime - lastMoveTimeRef.current
    if (timeDelta > 0) {
      velocityRef.current = (x - lastMoveXRef.current) / timeDelta
    }
    lastMoveTimeRef.current = currentTime
    lastMoveXRef.current = x
  }

  const handleMouseUp = () => {
    if (!scrollRef.current) {
      setIsDragging(false)
      setIsPaused(false)
      return
    }

    const cardWidth = getCardWidth() + 24

    // Apply momentum if velocity is significant
    if (Math.abs(velocityRef.current) > 0.3) {
      const momentum = velocityRef.current * 120
      const currentScroll = scrollRef.current.scrollLeft
      const targetScroll = currentScroll - momentum
      const nearestIndex = Math.round(targetScroll / cardWidth)
      const clampedIndex = Math.max(0, Math.min(nearestIndex, displayPartners.length - 1))

      scrollRef.current.scrollTo({
        left: clampedIndex * cardWidth,
        behavior: 'smooth'
      })
      setCurrentIndex(clampedIndex)
    } else {
      // Snap to nearest card
      const scrollLeft = scrollRef.current.scrollLeft
      const newIndex = Math.round(scrollLeft / cardWidth)
      const clampedIndex = Math.max(0, Math.min(newIndex, displayPartners.length - 1))

      scrollRef.current.scrollTo({
        left: clampedIndex * cardWidth,
        behavior: 'smooth'
      })
      setCurrentIndex(clampedIndex)
    }

    setIsDragging(false)
    setIsPaused(false)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp()
    }
    setIsPaused(false)
  }

  // Autoplay carousel with responsive speed
  useEffect(() => {
    if (layout !== 'carousel' || isEditing || isPaused || !autoplay) return

    const interval = setInterval(() => {
      navigateNext()
    }, currentAutoplaySpeed)

    return () => clearInterval(interval)
  }, [layout, isEditing, isPaused, currentAutoplaySpeed, autoplay, navigateNext])

  // Update current index based on scroll position
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    const cardWidth = getCardWidth() + 24 // Card width + gap
    const scrollLeft = scrollRef.current.scrollLeft
    const newIndex = Math.round(scrollLeft / cardWidth)
    const clampedIndex = Math.max(0, Math.min(newIndex, displayPartners.length - 1))

    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex)
    }
  }, [currentIndex, getCardWidth, displayPartners.length])

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

          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
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
              {/* Navigation Arrows - Visible on all screens */}
              {showNavigationArrows && displayPartners.length > cardsPerView && (
                <>
                  <button
                    onClick={navigatePrev}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "absolute z-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95",
                      // Mobile: smaller, positioned at bottom
                      "w-8 h-8 -left-1 top-1/2 -translate-y-1/2",
                      // Desktop: larger
                      "md:w-10 md:h-10 md:left-0",
                      isDark ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
                    )}
                    aria-label="Previous partners"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={navigateNext}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "absolute z-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95",
                      // Mobile: smaller, positioned at bottom
                      "w-8 h-8 -right-1 top-1/2 -translate-y-1/2",
                      // Desktop: larger
                      "md:w-10 md:h-10 md:right-0",
                      isDark ? "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20" : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
                    )}
                    aria-label="Next partners"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}

              {/* Carousel Container - Enhanced for mobile single-focus */}
              <div
                ref={scrollRef}
                className={cn(
                  "flex gap-6 overflow-x-auto pb-4",
                  // Mobile: center content, Desktop: center if few items
                  isMobile ? "px-8" : "justify-center",
                  "scrollbar-hide",
                  "scroll-smooth",
                  // CSS scroll snap for better mobile UX
                  "snap-x snap-mandatory",
                  // Drag cursor styles
                  isDragging ? "cursor-grabbing select-none" : "cursor-grab"
                )}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  // GPU acceleration
                  willChange: 'scroll-position',
                  WebkitOverflowScrolling: 'touch',
                  // Enhanced mobile snap behavior
                  scrollSnapStop: 'always',
                  overscrollBehaviorX: 'contain',
                  touchAction: 'pan-x',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
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
                    isMobile={isMobile}
                    className={cn(
                      "flex-shrink-0 snap-center",
                      // Mobile: full width card, Desktop: fixed size
                      isMobile ? "w-[calc(100vw-64px)] h-[140px]" : "w-[170px] h-[110px]"
                    )}
                  />
                ))}
              </div>

              {/* Swipe Hint - Mobile only */}
              {showSwipeHint && isMobile && displayPartners.length > 1 && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-500 animate-pulse pointer-events-none">
                  <MoveHorizontal className="w-4 h-4" />
                  <span>Swipe to see more</span>
                </div>
              )}

              {/* Progress Indicator - Mobile only */}
              {isMobile && displayPartners.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-4 text-sm">
                  <span className="font-semibold text-brand-primary">
                    {currentIndex + 1}
                  </span>
                  <span className="text-gray-400">of</span>
                  <span className="text-gray-600">{displayPartners.length}</span>
                </div>
              )}

              {/* Navigation Dots */}
              {showNavigationDots && totalPages > 1 && (
                <div className={cn(
                  "flex items-center justify-center gap-2",
                  isMobile ? "mt-3" : "mt-6"
                )}>
                  {isMobile ? (
                    // Mobile: One dot per card
                    displayPartners.map((_, index) => {
                      const isActive = currentIndex === index

                      return (
                        <button
                          key={index}
                          onClick={() => scrollToIndex(index)}
                          className={cn(
                            "transition-all duration-300 rounded-full",
                            isActive
                              ? "w-6 h-2 bg-brand-primary scale-110"
                              : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                          )}
                          aria-label={`Go to logo ${index + 1}`}
                        />
                      )
                    })
                  ) : (
                    // Desktop: Page-based dots
                    Array.from({ length: totalPages }).map((_, index) => {
                      const dotIndex = index * effectiveCardsPerView
                      const isActive = currentIndex >= dotIndex && currentIndex < dotIndex + effectiveCardsPerView

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
                    })
                  )}
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
  isMobile = false,
}: {
  partner: PartnerItem
  cardStyle: 'glassmorphic' | 'bordered' | 'minimal'
  isDark: boolean
  grayscale: boolean
  isEditing?: boolean
  className?: string
  index: number
  isMobile?: boolean
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

      <div className="relative z-10 flex flex-col items-center justify-center">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={partner.name}
            width={isMobile ? 180 : 120}
            height={isMobile ? 90 : 60}
            sizes={isMobile ? "180px" : "120px"}
            className={cn(
              'object-contain transition-all duration-300',
              isMobile ? 'max-h-20' : 'max-h-16',
              grayscale && 'grayscale group-hover:grayscale-0',
              'group-hover:scale-110'
            )}
            loading="lazy"
          />
        ) : (
          <div className="text-center">
            <div
              className={cn(
                "rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-300",
                isMobile ? "w-16 h-16" : "w-12 h-12",
                isHovered ? "scale-110" : "scale-100"
              )}
              style={{
                backgroundColor: isHovered ? 'rgba(255, 222, 89, 0.15)' : isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
              }}
            >
              <span
                className={cn(
                  "font-bold transition-colors duration-300",
                  isMobile ? "text-2xl" : "text-lg",
                  isDark ? "text-white" : isHovered ? "text-gold" : "text-gray-400"
                )}
              >
                {partner.name.charAt(0)}
              </span>
            </div>
            <span className={cn(
              "line-clamp-1 transition-colors",
              isMobile ? "text-sm" : "text-xs",
              isDark ? "text-white/60 group-hover:text-white" : "text-gray-500 group-hover:text-gray-700"
            )}>
              {partner.name}
            </span>
          </div>
        )}
      </div>

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

  return <div className={className}>{cardContent}</div>
}

/**
 * Marquee Animation for Logos - Optimized with Touch Support
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
  const [isPaused, setIsPaused] = useState(false)

  const handleTouchStart = () => {
    setIsPaused(true)
  }

  const handleTouchEnd = () => {
    // Resume animation after 2 seconds
    setTimeout(() => setIsPaused(false), 2000)
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Marquee Track */}
      <div
        className="flex w-max py-4 overflow-x-auto scrollbar-hide touch-pan-x"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          animation: isPaused || isEditing ? 'none' : 'marquee-partners 18s linear infinite',
          willChange: isPaused || isEditing ? 'auto' : 'transform',
        }}
      >
        {/* First set */}
        {partners.map((partner, index) => (
          <div
            key={`partner-1-${index}`}
            className={cn(
              'flex-shrink-0 w-[90px] sm:w-[120px] md:w-[150px] h-[70px] sm:h-[85px] md:h-[100px] mx-1.5 sm:mx-2 md:mx-2.5 rounded-lg md:rounded-xl',
              'transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95',
              cardStyle === 'glassmorphic' && isDark && 'bg-white/10 backdrop-blur-sm border border-white/20',
              cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-md border border-gray-100',
              cardStyle === 'bordered' && 'bg-white border border-gray-200 hover:border-gold shadow-sm',
              cardStyle === 'minimal' && 'bg-white shadow-sm',
            )}
          >
            <div className="w-full h-full flex items-center justify-center p-2">
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={100}
                  height={60}
                  className={cn(
                    'object-contain max-h-[50px] sm:max-h-[60px] md:max-h-[70px] w-auto',
                    grayscale && 'grayscale hover:grayscale-0'
                  )}
                  loading="lazy"
                />
              ) : (
                <span className={cn(
                  'text-[8px] sm:text-[9px] md:text-xs font-bold text-center leading-tight',
                  isDark ? 'text-white' : 'text-gray-700'
                )}>
                  {partner.name}
                </span>
              )}
            </div>
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {partners.map((partner, index) => (
          <div
            key={`partner-2-${index}`}
            className={cn(
              'flex-shrink-0 w-[90px] sm:w-[120px] md:w-[150px] h-[70px] sm:h-[85px] md:h-[100px] mx-1.5 sm:mx-2 md:mx-2.5 rounded-lg md:rounded-xl',
              'transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95',
              cardStyle === 'glassmorphic' && isDark && 'bg-white/10 backdrop-blur-sm border border-white/20',
              cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-md border border-gray-100',
              cardStyle === 'bordered' && 'bg-white border border-gray-200 hover:border-gold shadow-sm',
              cardStyle === 'minimal' && 'bg-white shadow-sm',
            )}
          >
            <div className="w-full h-full flex items-center justify-center p-2">
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={100}
                  height={60}
                  className={cn(
                    'object-contain max-h-[50px] sm:max-h-[60px] md:max-h-[70px] w-auto',
                    grayscale && 'grayscale hover:grayscale-0'
                  )}
                  loading="lazy"
                />
              ) : (
                <span className={cn(
                  'text-[8px] sm:text-[9px] md:text-xs font-bold text-center leading-tight',
                  isDark ? 'text-white' : 'text-gray-700'
                )}>
                  {partner.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes marquee-partners {
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
