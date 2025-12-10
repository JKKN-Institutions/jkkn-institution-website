'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { Play, Video, ArrowRight, X } from 'lucide-react'

/**
 * Video item schema
 */
export const VideoItemSchema = z.object({
  title: z.string().describe('Video title'),
  thumbnail: z.string().describe('Thumbnail image URL'),
  videoUrl: z.string().describe('Video URL (YouTube, Vimeo, or Google Drive)'),
  category: z.string().optional().describe('Video category badge'),
  description: z.string().optional().describe('Video description'),
})

export type VideoItem = z.infer<typeof VideoItemSchema>

/**
 * CampusVideos props schema
 */
export const CampusVideosPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Campus').describe('First part of header'),
  headerPart2: z.string().default('Videos').describe('Second part of header (colored)'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part'),
  headerPart2Italic: z.boolean().default(true).describe('Make second part italic'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Videos
  videos: z.array(VideoItemSchema).default([]).describe('List of videos'),

  // Layout
  layout: z.enum(['carousel', 'grid']).default('carousel').describe('Display layout'),
  columns: z.enum(['2', '3', '4']).default('4').describe('Number of columns'),

  // Styling
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  categoryBadgeColor: z.string().default('#0b6d41').describe('Category badge color'),
  playButtonColor: z.string().default('#0b6d41').describe('Play button color'),
  accentColor: z.string().default('#0b6d41').describe('Accent color'),

  // Autoplay
  autoplaySpeed: z.number().default(3000).describe('Autoplay speed in ms'),
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
 * Modern video gallery with:
 * - Section badge with decorative elements
 * - Auto-scrolling carousel with pause on hover
 * - Scroll-triggered animations
 * - Modern video cards with animated play button
 * - Glassmorphism category badges
 * - Full-screen modal video player
 */
export function CampusVideos({
  headerPart1 = 'Campus',
  headerPart2 = 'Videos',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  headerPart2Italic = true,
  subtitle,
  videos = [],
  layout = 'carousel',
  columns = '4',
  backgroundColor = '#ffffff',
  categoryBadgeColor = '#0b6d41',
  playButtonColor = '#0b6d41',
  accentColor = '#0b6d41',
  autoplaySpeed = 3000,
  className,
  isEditing,
}: CampusVideosProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
  const headerRef = useInView()
  const contentRef = useInView()

  const defaultVideos: VideoItem[] = [
    { title: 'JKKN Centenary Exhibition', thumbnail: '', videoUrl: '', category: 'Founders Day', description: 'JKKN Centenary Exhibition' },
    { title: 'Pongal Celebration', thumbnail: '', videoUrl: '', category: 'Education', description: 'Pongal celebration' },
    { title: 'JKKN Centenary Celebration', thumbnail: '', videoUrl: '', category: 'Founders Day', description: 'Celebrating 100 years' },
    { title: 'Campus Tour', thumbnail: '', videoUrl: '', category: 'Campus Life', description: 'Virtual campus tour' },
  ]

  // Always show default videos if empty (users can add real data via admin panel)
  const displayVideos = videos.length > 0 ? videos : defaultVideos

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

  const handlePlayVideo = (video: VideoItem) => {
    if (!isEditing && video.videoUrl) {
      setActiveVideo(video)
    }
  }

  return (
    <>
      <section
        className={cn('relative py-12 md:py-16 lg:py-20 w-full overflow-hidden', className)}
        style={{ backgroundColor }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient overlay */}
          <div
            className="absolute top-0 left-0 w-1/3 h-full opacity-[0.03]"
            style={{
              background: `radial-gradient(ellipse at top left, ${accentColor} 0%, transparent 70%)`
            }}
          />

          {/* Floating circles */}
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-5"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute bottom-20 -right-20 w-72 h-72 rounded-full opacity-5"
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
              <Video className="w-4 h-4" />
              <span>Watch & Explore</span>
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

          {/* Videos Display */}
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
                  {displayVideos.map((video, index) => (
                    <VideoCard
                      key={index}
                      video={video}
                      categoryBadgeColor={categoryBadgeColor}
                      playButtonColor={playButtonColor}
                      accentColor={accentColor}
                      onPlay={() => handlePlayVideo(video)}
                      index={index}
                      isInView={contentRef.isInView}
                      className="snap-start flex-shrink-0 w-[300px] h-[300px]"
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
                    categoryBadgeColor={categoryBadgeColor}
                    playButtonColor={playButtonColor}
                    accentColor={accentColor}
                    onPlay={() => handlePlayVideo(video)}
                    index={index}
                    isInView={contentRef.isInView}
                    className="h-[300px]"
                  />
                ))}
              </div>
            )}
          </div>

          {/* View All Link */}
          <div className="text-center mt-10">
            <a
              href="/videos"
              className="group inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3"
              style={{ color: accentColor }}
            >
              View All Videos
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
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
                src={activeVideo.videoUrl}
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
  categoryBadgeColor,
  playButtonColor,
  accentColor,
  onPlay,
  className,
  index,
  isInView,
}: {
  video: VideoItem
  categoryBadgeColor: string
  playButtonColor: string
  accentColor: string
  onPlay: () => void
  className?: string
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'group cursor-pointer h-full flex flex-col transition-all duration-700',
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={onPlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail - Fixed height */}
      <div className="relative h-[220px] overflow-hidden rounded-2xl flex-shrink-0 shadow-lg group-hover:shadow-2xl transition-all duration-500">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Video className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-all duration-500',
            isHovered ? 'opacity-100' : 'opacity-60'
          )}
          style={{
            background: `linear-gradient(to top, ${accentColor}dd 0%, ${accentColor}40 30%, transparent 100%)`
          }}
        />

        {/* Category Badge with glassmorphism */}
        {video.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-sm font-medium backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: `${categoryBadgeColor}ee` }}
          >
            {video.category}
          </div>
        )}

        {/* Play Button - Animated */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-500",
              isHovered ? "scale-110" : "scale-100"
            )}
          >
            {/* Animated Ring */}
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-500",
                isHovered ? "animate-ping opacity-30" : "opacity-0"
              )}
              style={{ backgroundColor: playButtonColor }}
            />
            <Play className="w-7 h-7 ml-1 relative z-10" style={{ color: playButtonColor }} fill={playButtonColor} />
          </div>
        </div>

        {/* Watch Now Text on Hover */}
        <div
          className={cn(
            'absolute bottom-4 left-4 transition-all duration-500',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <span className="text-white font-semibold text-sm">Watch Now</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative pt-4 flex-grow">
        {/* Accent Line */}
        <div
          className={cn(
            'absolute top-0 left-0 h-1 rounded-full transition-all duration-500',
            isHovered ? 'w-1/2' : 'w-0'
          )}
          style={{ backgroundColor: accentColor }}
        />

        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{video.description}</p>
        )}
      </div>
    </div>
  )
}

export default CampusVideos
