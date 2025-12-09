'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { Play } from 'lucide-react'

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
 * CampusVideos Component
 *
 * Video gallery with:
 * - Split-color header with brand colors
 * - Auto-scrolling carousel with pause on hover
 * - Uniform card sizing
 * - Video cards with play button overlay
 * - Category badges
 * - Modal video player
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

          {/* Videos Display */}
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
                {displayVideos.map((video, index) => (
                  <VideoCard
                    key={index}
                    video={video}
                    categoryBadgeColor={categoryBadgeColor}
                    playButtonColor={playButtonColor}
                    onPlay={() => handlePlayVideo(video)}
                    className="snap-start flex-shrink-0 w-[300px] h-[280px]"
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
                  onPlay={() => handlePlayVideo(video)}
                  className="h-[280px]"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              ✕
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
 * Individual Video Card - Uniform sizing
 */
function VideoCard({
  video,
  categoryBadgeColor,
  playButtonColor,
  onPlay,
  className,
}: {
  video: VideoItem
  categoryBadgeColor: string
  playButtonColor: string
  onPlay: () => void
  className?: string
}) {
  return (
    <div className={cn('group cursor-pointer h-full flex flex-col', className)} onClick={onPlay}>
      {/* Thumbnail - Fixed height */}
      <div className="relative h-[200px] overflow-hidden rounded-xl flex-shrink-0">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No thumbnail</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

        {/* Category Badge */}
        {video.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: categoryBadgeColor }}
          >
            {video.category}
          </div>
        )}

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center shadow-lg"
          >
            <Play className="w-7 h-7 ml-1" style={{ color: playButtonColor }} fill={playButtonColor} />
          </div>
        </div>
      </div>

      {/* Content - Flex grow */}
      <div className="pt-4 flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-1">{video.description}</p>
        )}
      </div>
    </div>
  )
}

export default CampusVideos
