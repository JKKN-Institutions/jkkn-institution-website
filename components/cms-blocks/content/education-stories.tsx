'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect, useCallback } from 'react'
import { GraduationCap, ChevronLeft, ChevronRight, Play, Pause, X } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { getInstagramThumbnails } from '@/app/actions/cms/instagram'

/**
 * Story item schema
 */
export const StoryItemSchema = z.object({
  name: z.string().describe('Person name or story title'),
  image: z.string().describe('Profile image URL'),
  role: z.string().optional().describe('Role or subtitle'),

  // Video support
  video: z.string().optional().describe('Video URL for story'),
  instagramUrl: z.string().optional().describe('Instagram Reel/Post URL'),

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

  // Video & Instagram
  mutedAutoplay: z.boolean().default(true).describe('Enable muted autoplay when scrolled into view'),
  showVolumeControl: z.boolean().default(true).describe('Show volume control button'),

  // Glassmorphism
  glassBlur: z.enum(['sm', 'md', 'lg']).default('md').describe('Glass blur intensity'),

  // Animated Background
  animatedBackground: z.boolean().default(true).describe('Enable animated gradient background'),
  backgroundColors: z.array(z.string()).default(['#0b6d41', '#ffde59', '#fbfbee']).describe('Gradient background colors'),
})

export type EducationStoriesProps = z.infer<typeof EducationStoriesPropsSchema> & BaseBlockProps

/**
 * Animated Gradient Background Component
 * Creates a smoothly animating gradient background for the section
 */
function AnimatedGradientBackground({
  colors,
  enabled,
}: {
  colors: string[]
  enabled: boolean
}) {
  if (!enabled) return null

  return (
    <>
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background: `linear-gradient(-45deg, ${colors.join(', ')})`,
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  )
}

/**
 * Glassmorphic Overlay Component
 * Creates a frosted glass effect overlay for UI elements
 */
function GlassmorphicOverlay({
  position,
  blur,
  children,
}: {
  position: 'top' | 'bottom'
  blur: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  }

  return (
    <div
      className={cn(
        position === 'bottom' ? 'absolute inset-x-0 bottom-0' : 'absolute inset-x-0 top-0',
        'bg-white/10',
        blurClasses[blur],
        'border-white/20',
        position === 'bottom' ? 'border-t' : 'border-b'
      )}
    >
      {children}
    </div>
  )
}

/**
 * EducationStories Component - Reels Format
 *
 * Vertical reels-style cards inspired by Instagram Reels/TikTok:
 * - Vertical card format (9:16 aspect ratio)
 * - Horizontal scrolling carousel
 * - Autoplay with pause on hover/interaction
 * - Manual scroll support
 * - Play/pause indicators
 * - Instagram Reels embeds with glassmorphism
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
  mutedAutoplay = true,
  showVolumeControl = true,
  glassBlur = 'md',
  animatedBackground = true,
  backgroundColors = ['#0b6d41', '#ffde59', '#fbfbee'],
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

  // Modal state for Instagram reels
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Instagram thumbnails state
  const [instagramThumbnails, setInstagramThumbnails] = useState<Record<string, string | null>>({})

  // Handle story click - open modal if Instagram URL exists
  const handleStoryClick = useCallback((story: StoryItem) => {
    if (story.instagramUrl) {
      setSelectedStory(story)
      setIsModalOpen(true)
    }
  }, [])

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  // Height configurations for reels - taller mobile stories format
  const heightConfig = {
    short: 'h-[260px] sm:h-[280px]',
    medium: 'h-[300px] sm:h-[320px]',
    tall: 'h-[340px] sm:h-[360px]',
  }

  // Default stories for demo - 5 cards
  const defaultStories: StoryItem[] = [
    { name: 'Rahul Sharma', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', role: 'Medical Student', isNew: true },
    { name: 'Anitha Raj', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop', role: 'Pharmacy Alumni', isNew: false },
    { name: 'Vikram Singh', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop', role: 'Nursing Excellence', isNew: false },
    { name: 'Deepa Nair', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop', role: 'Dental Sciences', isNew: true },
    { name: 'Karthik M', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop', role: 'Arts & Science', isNew: false },
  ]

  // Use all stories (no limit)
  const allStories = stories.length > 0 ? stories : defaultStories
  const displayStories = allStories

  // Fetch Instagram thumbnails for stories with Instagram URLs
  useEffect(() => {
    const instagramUrls = displayStories
      .map((story) => story.instagramUrl || (story.link?.includes('instagram.com') ? story.link : null))
      .filter((url): url is string => !!url)

    if (instagramUrls.length === 0) return

    getInstagramThumbnails(instagramUrls)
      .then((thumbnails) => {
        setInstagramThumbnails(thumbnails)
      })
      .catch((error) => {
        console.error('Failed to fetch Instagram thumbnails:', error)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(stories)])

  // Check scroll position and update active index
  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft: sl, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(sl > 10)
      setCanScrollRight(sl + clientWidth < scrollWidth - 10)

      // Update active index based on scroll position
      const cardWidth = 216 // 200px card + 16px gap
      const newIndex = Math.round(sl / cardWidth)
      setActiveIndex(Math.min(newIndex, displayStories.length - 1))
    }
  }, [displayStories.length])

  // Autoplay - scrolls one card at a time, loops back to start
  useEffect(() => {
    if (!autoplay || isEditing || isPaused || isDragging) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft: sl, scrollWidth, clientWidth } = scrollRef.current
        // Fixed card width for consistent scrolling (matches card width + gap)
        const cardWidth = 216 // 200px card + 16px gap

        // Loop back to start after reaching end
        if (sl + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
          setActiveIndex(0)
        } else {
          // Scroll exactly one card
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

  // Manual scroll with buttons - scroll by one card
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 216 // 200px card + 16px gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
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
      {/* Animated Gradient Background */}
      <AnimatedGradientBackground colors={backgroundColors} enabled={animatedBackground} />

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
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className={cn(
              'absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center',
              'transition-all duration-300 hover:scale-110 shadow-lg',
              isDark ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' : 'bg-white text-brand-primary hover:bg-gray-50',
              canScrollLeft ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Reels Container - scrollable carousel */}
          <div className="w-full">
            <div
              ref={scrollRef}
              className={cn(
                'flex gap-3 sm:gap-4 overflow-x-auto py-2 snap-x snap-mandatory px-1',
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
              {displayStories.map((story, index) => {
                // Get Instagram URL (from instagramUrl field or link field)
                const igUrl = story.instagramUrl || (story.link?.includes('instagram.com') ? story.link : null)
                // Get fetched thumbnail for this story's Instagram URL
                const igThumbnail = igUrl ? instagramThumbnails[igUrl] : null

                return (
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
                    mutedAutoplay={mutedAutoplay}
                    showVolumeControl={showVolumeControl}
                    glassBlur={glassBlur}
                    onStoryClick={handleStoryClick}
                    instagramThumbnail={igThumbnail}
                  />
                )
              })}
            </div>
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className={cn(
              'absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center',
              'transition-all duration-300 hover:scale-110 shadow-lg',
              isDark ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' : 'bg-white text-brand-primary hover:bg-gray-50',
              canScrollRight ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none'
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots - all screens */}
        <div className="flex justify-center gap-1.5 mt-6">
          {displayStories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollRef.current) {
                  const cardWidth = 216 // 200px card + 16px gap
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

      {/* Instagram Reel Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg w-[95vw] p-0 bg-black border-none rounded-2xl overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{selectedStory?.name || 'Instagram Reel'}</DialogTitle>
          </VisuallyHidden>

          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Instagram Embed */}
          {selectedStory?.instagramUrl && (
            <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: '80vh' }}>
              <iframe
                src={`https://www.instagram.com/reel/${extractInstagramId(selectedStory.instagramUrl)}/embed/`}
                className="absolute inset-0 w-full h-full border-0"
                scrolling="no"
                allow="autoplay; encrypted-media"
                title={`Instagram Reel: ${selectedStory.name}`}
              />
            </div>
          )}

          {/* Story Info */}
          {selectedStory && (
            <div className="p-4 bg-gradient-to-t from-black to-black/80">
              <div className="flex items-center gap-3">
                {selectedStory.image && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                    <Image
                      src={selectedStory.image}
                      alt={selectedStory.name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{selectedStory.name}</p>
                  {selectedStory.role && (
                    <p className="text-white/60 text-sm">{selectedStory.role}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

/**
 * Extract Instagram ID from URL
 */
function extractInstagramId(url: string): string | null {
  if (!url) return null
  const match = url.match(/instagram\.com\/(p|reel|reels)\/([A-Za-z0-9_-]+)/)
  return match ? match[2] : null
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
  mutedAutoplay = true,
  showVolumeControl = true,
  glassBlur = 'md',
  onStoryClick,
  instagramThumbnail,
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
  mutedAutoplay?: boolean
  showVolumeControl?: boolean
  glassBlur?: 'sm' | 'md' | 'lg'
  onStoryClick?: (story: StoryItem) => void
  instagramThumbnail?: string | null
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Use Instagram thumbnail if available, otherwise fall back to story.image
  const displayImage = instagramThumbnail || story.image

  const content = (
    <div
      className={cn(
        'relative flex-shrink-0 rounded-xl overflow-hidden snap-start',
        'w-[calc(100vw-3rem)] sm:w-[200px]', // Full width on mobile, wider on desktop
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
      {/* Background Image - Uses Instagram thumbnail if available */}
      <div className="absolute inset-0">
        {displayImage ? (
          <Image
            src={displayImage}
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

      {/* Play Button Overlay for Instagram Reels */}
      {(story.instagramUrl || (story.link && story.link.includes('instagram.com'))) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={cn(
            'w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300',
            isHovered ? 'scale-110 bg-white/30' : 'scale-100'
          )}>
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* New Badge */}
      {story.isNew && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#ffde59] rounded-full">
          <span className="text-[8px] font-bold text-gray-900 uppercase tracking-wide">New</span>
        </div>
      )}

      {/* Instagram Indicator - Shows when story links to Instagram */}
      {(story.instagramUrl || (story.link && story.link.includes('instagram.com'))) && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      )}

      {/* Play/Pause Indicator - Hidden when Instagram link present */}
      <div className={cn(
        'absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center',
        'bg-white/20 backdrop-blur-sm transition-all duration-300',
        isHovered && !(story.instagramUrl || (story.link && story.link.includes('instagram.com'))) ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
        (story.instagramUrl || (story.link && story.link.includes('instagram.com'))) && 'hidden' // Hide when Instagram icon is shown
      )}>
        {isPaused ? (
          <Pause className="w-3 h-3 text-white" />
        ) : (
          <Play className="w-3 h-3 text-white fill-white" />
        )}
      </div>

      {/* Glassmorphic Content Overlay - Bottom */}
      {showName && (
        <GlassmorphicOverlay position="bottom" blur={glassBlur}>
          <div className="p-2.5">
            {/* Profile Info */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/50 flex-shrink-0 relative">
                {displayImage ? (
                  <Image
                    src={displayImage}
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
                {/* Gold ring for new/active */}
                {story.isNew && (
                  <div className="absolute inset-0 rounded-full border-2 border-[#ffde59]" />
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
        </GlassmorphicOverlay>
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

  // Check if this story should open Instagram modal
  // Support both instagramUrl field and Instagram URLs in the link field
  const isInstagramStory = story.instagramUrl || (story.link && story.link.includes('instagram.com'))
  const effectiveInstagramUrl = story.instagramUrl || (story.link && story.link.includes('instagram.com') ? story.link : undefined)

  // Create a modified story for the click handler with the effective Instagram URL
  const storyForClick = effectiveInstagramUrl
    ? { ...story, instagramUrl: effectiveInstagramUrl }
    : story

  // If Instagram URL exists, clicking opens modal (handled by parent)
  if (isInstagramStory && onStoryClick && !isEditing) {
    return (
      <button
        type="button"
        onClick={() => onStoryClick(storyForClick)}
        className="flex-shrink-0 text-left"
      >
        {content}
      </button>
    )
  }

  // If regular link exists (no Instagram), use Link component
  if (story.link && !isEditing) {
    const isExternal = story.link.startsWith('http')
    return (
      <Link
        href={story.link}
        className="flex-shrink-0"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    )
  }

  return content
}

export default EducationStories
