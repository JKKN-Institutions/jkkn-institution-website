'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'
import { GraduationCap, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Story item schema
 */
export const StoryItemSchema = z.object({
  name: z.string().describe('Person name or story title'),
  image: z.string().describe('Profile image URL'),
  role: z.string().optional().describe('Role or subtitle'),
  video: z.string().optional().describe('Video URL for story'),
  link: z.string().optional().describe('Link to full story'),
  isNew: z.boolean().optional().default(false).describe('Show as new/unread'),
})

export type StoryItem = z.infer<typeof StoryItemSchema>

/**
 * EducationStories props schema
 */
export const EducationStoriesPropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true).describe('Show section header'),
  headerPart1: z.string().default('Education').describe('First part of header'),
  headerPart2: z.string().default('Stories').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),

  // Stories
  stories: z.array(StoryItemSchema).default([]).describe('List of stories'),

  // Layout
  cardHeight: z.enum(['short', 'medium', 'tall']).default('medium').describe('Reel card height'),
  showNames: z.boolean().default(true).describe('Show names on cards'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay scroll'),
  autoplaySpeed: z.number().default(3000).describe('Autoplay speed in ms'),
})

export type EducationStoriesProps = z.infer<typeof EducationStoriesPropsSchema> & BaseBlockProps

/**
 * EducationStories Component - Reels Format
 *
 * Vertical reels-style cards inspired by Instagram Reels/TikTok:
 * - Vertical card format (9:16 aspect ratio)
 * - Horizontal scrolling carousel
 * - Autoplay with pause on hover/interaction
 * - Manual scroll support
 * - Play/pause indicators
 */
export function EducationStories({
  showHeader = true,
  headerPart1 = 'Education',
  headerPart2 = 'Stories',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  stories = [],
  cardHeight = 'medium',
  showNames = true,
  variant = 'modern-light',
  showDecorations = true,
  autoplay = true,
  autoplaySpeed = 3000,
  className,
  isEditing,
}: EducationStoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  // Height configurations for reels - shorter sizes
  const heightConfig = {
    short: 'h-[180px] sm:h-[200px]',
    medium: 'h-[200px] sm:h-[220px]',
    tall: 'h-[240px] sm:h-[260px]',
  }

  // Default stories for demo - 6 cards
  const defaultStories: StoryItem[] = [
    { name: 'Rahul Sharma', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', role: 'Medical Student', isNew: true },
    { name: 'Anitha Raj', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop', role: 'Pharmacy Alumni', isNew: false },
    { name: 'Vikram Singh', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop', role: 'Nursing Excellence', isNew: false },
    { name: 'Deepa Nair', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop', role: 'Dental Sciences', isNew: true },
    { name: 'Karthik M', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop', role: 'Arts & Science', isNew: false },
    { name: 'Lakshmi P', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop', role: 'Management Studies', isNew: false },
  ]

  // Limit to exactly 6 stories
  const allStories = stories.length > 0 ? stories : defaultStories
  const displayStories = allStories.slice(0, 6)

  // Check scroll position
  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft: sl, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(sl > 10)
      setCanScrollRight(sl + clientWidth < scrollWidth - 10)
    }
  }, [])

  // Autoplay - only on mobile (1 card at a time), disabled on desktop where all cards visible
  useEffect(() => {
    if (!autoplay || isEditing || isPaused || isDragging) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const isMobile = window.innerWidth < 640

        // On desktop, all 6 cards are visible - no autoplay needed
        if (!isMobile) return

        const { scrollLeft: sl, scrollWidth, clientWidth } = scrollRef.current
        const cardWidth = clientWidth + 12 // Full card width + gap on mobile

        // Loop back to start after last card
        if (sl + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          setActiveIndex(0)
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
          setActiveIndex(prev => Math.min(prev + 1, displayStories.length - 1))
        }
      }
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [autoplay, isEditing, isPaused, isDragging, autoplaySpeed, displayStories.length])

  // Update scroll buttons on mount and scroll
  useEffect(() => {
    updateScrollButtons()
    const scrollEl = scrollRef.current
    if (scrollEl) {
      // Reset to start position on mount
      scrollEl.scrollLeft = 0
      scrollEl.addEventListener('scroll', updateScrollButtons)
      return () => scrollEl.removeEventListener('scroll', updateScrollButtons)
    }
  }, [displayStories, updateScrollButtons])

  // Manual scroll with buttons
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350 // Two cards
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Mouse drag handling for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

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

  return (
    <section
      className={cn(
        'relative py-10 md:py-16 w-full overflow-hidden',
        isDark ? 'section-green-gradient' : 'bg-brand-cream',
        className
      )}
    >
      {/* Decorative Patterns */}
      {showDecorations && isModern && (
        <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />
      )}

      <div className="relative z-10 w-full">
        {/* Header */}
        {showHeader && (
          <div className={cn('flex items-center justify-center mb-8 px-4 sm:px-6')}>
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center mr-3',
                isDark ? 'bg-white/10' : 'bg-brand-primary/10'
              )}
            >
              <GraduationCap className={cn('w-5 h-5', isDark ? 'text-white' : 'text-brand-primary')} />
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase">
              <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
              <span style={{ color: headerPart2Color }}>{headerPart2}</span>
            </h2>
          </div>
        )}

        {/* Reels Carousel */}
        <div
          className="relative group mx-4 sm:mx-8 md:mx-12 lg:mx-16 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Scroll Left Button - mobile only */}
          <button
            onClick={() => scroll('left')}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center',
              'transition-all duration-300 hover:scale-110 shadow-lg',
              'sm:hidden', // Hide on desktop - all cards visible
              isDark ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' : 'bg-white text-brand-primary hover:bg-gray-50',
              canScrollLeft ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Reels Container - all 6 cards visible on desktop */}
          <div className="max-w-[1100px] mx-auto">
            <div
              ref={scrollRef}
              className={cn(
                'flex gap-3 sm:gap-4 overflow-x-auto py-2 snap-x snap-mandatory',
                'cursor-grab active:cursor-grabbing select-none',
                '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
              )}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {displayStories.map((story, index) => (
              <ReelCard
                key={index}
                story={story}
                height={heightConfig[cardHeight]}
                showName={showNames}
                isDark={isDark}
                isActive={index === activeIndex}
                isPaused={isPaused}
                isEditing={isEditing}
                index={index}
                autoplaySpeed={autoplaySpeed}
                />
              ))}
            </div>
          </div>

          {/* Scroll Right Button - mobile only */}
          <button
            onClick={() => scroll('right')}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center',
              'transition-all duration-300 hover:scale-110 shadow-lg',
              'sm:hidden', // Hide on desktop - all cards visible
              isDark ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' : 'bg-white text-brand-primary hover:bg-gray-50',
              canScrollRight ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots - mobile only */}
        <div className="flex sm:hidden justify-center gap-1.5 mt-6">
          {displayStories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollRef.current) {
                  const isMobile = window.innerWidth < 640
                  const cardWidth = isMobile ? scrollRef.current.clientWidth + 12 : 181
                  scrollRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
                  setActiveIndex(index)
                }
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === activeIndex
                  ? isDark ? 'bg-[#ffde59] w-6' : 'bg-brand-primary w-6'
                  : isDark ? 'bg-white/30 hover:bg-white/50' : 'bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`Go to story ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Reel Card - Vertical Format
 */
function ReelCard({
  story,
  height,
  showName,
  isDark,
  isActive,
  isPaused,
  isEditing,
  index,
  autoplaySpeed = 3000,
}: {
  story: StoryItem
  height: string
  showName: boolean
  isDark: boolean
  isActive: boolean
  isPaused: boolean
  isEditing?: boolean
  index: number
  autoplaySpeed?: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  const content = (
    <div
      className={cn(
        'relative flex-shrink-0 rounded-xl overflow-hidden snap-start',
        'w-[calc(100vw-3rem)] sm:w-[165px]', // Full width on mobile, fixed on desktop
        'transition-all duration-500 group',
        height,
        isActive && !isEditing && 'scale-[1.02] shadow-2xl',
        isHovered && !isEditing && 'scale-105 shadow-xl',
        'cursor-pointer'
      )}
      style={{
        boxShadow: isActive ? '0 10px 30px rgba(0,0,0,0.2)' : '0 4px 15px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {story.image ? (
          <Image
            src={story.image}
            alt={story.name}
            fill
            sizes="170px"
            className={cn(
              'object-cover transition-transform duration-700',
              isHovered && 'scale-110'
            )}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(180deg, #0b6d41 0%, #032816 100%)' }}
          >
            <span className="text-4xl font-bold text-white/80">
              {story.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Gold Ring Border on Active/New */}
      {(story.isNew || isActive) && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: '2px solid #ffde59',
            boxShadow: 'inset 0 0 15px rgba(255, 222, 89, 0.15)',
          }}
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

      {/* New Badge */}
      {story.isNew && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#ffde59] rounded-full">
          <span className="text-[8px] font-bold text-gray-900 uppercase tracking-wide">New</span>
        </div>
      )}

      {/* Play/Pause Indicator */}
      <div className={cn(
        'absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center',
        'bg-white/20 backdrop-blur-sm transition-all duration-300',
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      )}>
        {isPaused ? (
          <Pause className="w-3 h-3 text-white" />
        ) : (
          <Play className="w-3 h-3 text-white fill-white" />
        )}
      </div>

      {/* Content Overlay */}
      {showName && (
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          {/* Profile Info */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/50 flex-shrink-0">
              {story.image ? (
                <Image
                  src={story.image}
                  alt={story.name}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 100%)' }}
                >
                  {story.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white font-semibold text-xs truncate leading-tight">
                {story.name}
              </p>
              {story.role && (
                <p className="text-white/70 text-[10px] truncate leading-tight">
                  {story.role}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar (when active and playing) */}
      {isActive && !isPaused && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-[#ffde59]"
            style={{
              animation: `progress ${autoplaySpeed}ms linear infinite`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )

  if (story.link && !isEditing) {
    return (
      <Link href={story.link} className="flex-shrink-0">
        {content}
      </Link>
    )
  }

  return content
}

export default EducationStories
