'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { Play, Video, ArrowRight, X, Film } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import { extractYouTubeVideoId } from '@/lib/utils/youtube'

/**
 * Convert video URL to embeddable format
 */
function getEmbedUrl(url: string): string {
  // Check if it's a YouTube URL
  const youtubeId = extractYouTubeVideoId(url)
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`
  }

  // Check if it's already an embed URL
  if (url.includes('/embed/')) {
    return url
  }

  // Return as-is for other video sources (Vimeo, Google Drive, etc.)
  return url
}

/**
 * Video item schema
 */
export const VideoItemSchema = z.object({
  title: z.string().describe('Video title'),
  thumbnail: z.string().describe('Thumbnail image URL'),
  videoUrl: z.string().describe('Video URL (YouTube, Vimeo, or Google Drive)'),
  category: z.string().optional().describe('Video category badge'),
  description: z.string().optional().describe('Video description'),
  duration: z.string().optional().describe('Video duration'),
})

export type VideoItem = z.infer<typeof VideoItemSchema>

/**
 * CampusVideos props schema
 */
export const CampusVideosPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Campus').describe('First part of header'),
  headerPart2: z.string().default('Videos').describe('Second part of header'),
  headerPart1Color: z.string().default('#ffde59').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#ffde59').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Videos
  videos: z.array(VideoItemSchema).default([]).describe('List of videos'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'featured']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-dark').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'modern', 'minimal']).default('modern').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  showCategory: z.boolean().default(true).describe('Show category badges'),
  showDuration: z.boolean().default(true).describe('Show video duration'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay'),
  autoplaySpeed: z.number().default(4000).describe('Autoplay speed in ms'),

  // View All Button
  showViewAllButton: z.boolean().default(true).describe('Show/hide the View All button'),
})

export type CampusVideosProps = z.infer<typeof CampusVideosPropsSchema> & BaseBlockProps

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
 * CampusVideos Component
 *
 * Modern video gallery featuring:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Auto-scrolling carousel or grid layout
 * - Glassmorphic or modern card styles
 * - Animated play buttons
 * - Full-screen modal video player
 */
export function CampusVideos({
  headerPart1 = 'Campus',
  headerPart2 = 'Videos',
  headerPart1Color = '#ffde59',
  headerPart2Color = '#ffde59',
  subtitle,
  videos = [],
  layout = 'carousel',
  columns = '4',
  variant = 'modern-dark',
  cardStyle = 'modern',
  showDecorations = true,
  showCategory = true,
  showDuration = true,
  autoplay = true,
  autoplaySpeed = 4000,
  showViewAllButton = true,
  className,
  isEditing,
}: CampusVideosProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const headerRef = useInView()
  const contentRef = useInView()

  // Cache offsetLeft to avoid forced reflows during drag
  const cachedOffsetLeftRef = useRef(0)

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    cachedOffsetLeftRef.current = scrollRef.current.offsetLeft
    setStartX(e.touches[0].pageX - cachedOffsetLeftRef.current)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - cachedOffsetLeftRef.current
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  const defaultVideos: VideoItem[] = [
    { title: 'JKKN Centenary Exhibition', thumbnail: '', videoUrl: '', category: 'Founders Day', description: 'JKKN Centenary Exhibition', duration: '4:32' },
    { title: 'Pongal Celebration 2025', thumbnail: '', videoUrl: '', category: 'Events', description: 'Pongal celebration', duration: '3:15' },
    { title: 'JKKN Centenary Celebration', thumbnail: '', videoUrl: '', category: 'Founders Day', description: 'Celebrating 100 years', duration: '5:48' },
  ]

  const displayVideos = videos.length > 0 ? videos : defaultVideos

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

  const handlePlayVideo = (video: VideoItem) => {
    if (!isEditing && video.videoUrl) {
      setActiveVideo(video)
    }
  }

  return (
    <>
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
              <Film className="w-4 h-4" />
              <span>Watch & Explore</span>
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

          {/* Videos Display */}
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
                    {displayVideos.map((video, index) => (
                      <VideoCard
                      key={index}
                      video={video}
                      cardStyle={cardStyle}
                      isDark={isDark}
                      showCategory={showCategory}
                      showDuration={showDuration}
                      onPlay={() => handlePlayVideo(video)}
                      index={index}
                      isInView={contentRef.isInView}
                        className="snap-start flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[320px]"
                      />
                    ))}
                  </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {displayVideos.map((_, index) => (
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
              // Featured layout: 1 large + smaller grid
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {displayVideos.slice(0, 1).map((video, index) => (
                  <VideoCard
                    key={index}
                    video={video}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    showCategory={showCategory}
                    showDuration={showDuration}
                    onPlay={() => handlePlayVideo(video)}
                    index={index}
                    isInView={contentRef.isInView}
                    isFeatured
                    className="lg:row-span-2"
                  />
                ))}
                <div className="grid gap-6">
                  {displayVideos.slice(1, 3).map((video, index) => (
                    <VideoCard
                      key={index + 1}
                      video={video}
                      cardStyle={cardStyle}
                      isDark={isDark}
                      showCategory={showCategory}
                      showDuration={showDuration}
                      onPlay={() => handlePlayVideo(video)}
                      index={index + 1}
                      isInView={contentRef.isInView}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className={cn('grid gap-6 max-w-7xl mx-auto', columnClasses[columns])}>
                {displayVideos.map((video, index) => (
                  <VideoCard
                    key={index}
                    video={video}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    showCategory={showCategory}
                    showDuration={showDuration}
                    onPlay={() => handlePlayVideo(video)}
                    index={index}
                    isInView={contentRef.isInView}
                  />
                ))}
              </div>
            )}
          </div>

          {/* View All Link */}
          {showViewAllButton && (
            <div className="text-center mt-12">
              <a
                href="/videos"
                className={cn(
                  "group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300",
                  isDark
                    ? "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                    : "bg-brand-primary text-white hover:bg-brand-primary-dark"
                )}
              >
                View All Videos
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal - Modern Design */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
            {activeVideo.videoUrl && (
              <iframe
                src={getEmbedUrl(activeVideo.videoUrl)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Individual Video Card - Modern Design
 */
function VideoCard({
  video,
  cardStyle,
  isDark,
  showCategory,
  showDuration,
  onPlay,
  className,
  index,
  isInView,
  isFeatured = false,
}: {
  video: VideoItem
  cardStyle: 'glassmorphic' | 'modern' | 'minimal'
  isDark: boolean
  showCategory: boolean
  showDuration: boolean
  onPlay: () => void
  className?: string
  index: number
  isInView: boolean
  isFeatured?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'group cursor-pointer h-full flex flex-col transition-all duration-700',
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={onPlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Background Glow on Hover */}
      <div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 pointer-events-none",
          isHovered && "opacity-20"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      {/* Thumbnail */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl flex-shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-500",
        isFeatured ? "h-full min-h-[400px]" : "h-[220px]"
      )}>
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes={isFeatured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, 320px"}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center">
            <Video className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isHovered ? 'opacity-100' : 'opacity-60'
          )}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)'
          }}
        />

        {/* Category Badge */}
        {showCategory && video.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: 'rgba(11, 109, 65, 0.9)' }}
          >
            {video.category}
          </div>
        )}

        {/* Duration Badge */}
        {showDuration && video.duration && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium text-white bg-black/60 backdrop-blur-sm">
            {video.duration}
          </div>
        )}

        {/* Play Button - Animated */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "relative w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-500",
              isHovered ? "scale-110" : "scale-100"
            )}
          >
            {/* Animated Ring */}
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-gold transition-all duration-500",
                isHovered ? "animate-ping opacity-30" : "opacity-0"
              )}
            />
            <Play className="w-7 h-7 ml-1 relative z-10 text-brand-primary" fill="currentColor" />
          </div>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className={cn(
            "font-bold text-white transition-all duration-300",
            isFeatured ? "text-xl md:text-2xl" : "text-lg",
            "line-clamp-2"
          )}>
            {video.title}
          </h3>
          {video.description && isFeatured && (
            <p className="text-white/70 text-sm mt-2 line-clamp-2">{video.description}</p>
          )}
        </div>
      </div>

      {/* Content below thumbnail (non-featured only) */}
      {!isFeatured && (
        <div className={cn(
          "relative pt-4 flex-grow",
          isDark && cardStyle === 'glassmorphic' ? '' : ''
        )}>
          {/* Accent Line */}
          <div
            className={cn(
              'absolute top-0 left-0 h-1 rounded-full transition-all duration-500',
              isHovered ? 'w-1/2' : 'w-0'
            )}
            style={{ backgroundColor: '#ffde59' }}
          />

          <h3 className={cn(
            "text-lg font-bold transition-colors line-clamp-2",
            isDark ? 'text-white' : 'text-gray-900'
          )}>
            {video.title}
          </h3>
          {video.description && (
            <p className={cn(
              "text-sm mt-1 line-clamp-1",
              isDark ? 'text-white/60' : 'text-gray-500'
            )}>
              {video.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default CampusVideos
