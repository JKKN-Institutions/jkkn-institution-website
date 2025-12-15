'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Play, Video, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getActiveEducationVideos, type EducationVideo } from '@/app/actions/videos'

/**
 * Video item schema
 */
export const VideoItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().describe('Video title'),
  youtube_video_id: z.string().describe('YouTube video ID'),
  thumbnail_url: z.string().optional().describe('Thumbnail image URL'),
  duration: z.string().optional().describe('Video duration'),
  category: z.string().optional().describe('Video category'),
  description: z.string().optional().describe('Video description'),
})

export type VideoItem = z.infer<typeof VideoItemSchema>

/**
 * EducationVideos props schema - matching CMS registry
 */
export const EducationVideosPropsSchema = z.object({
  // CMS Header Props
  headerPart1: z.string().default('Education').describe('Header part 1'),
  headerPart2: z.string().default('Videos').describe('Header part 2'),
  headerPart1Color: z.string().default('#ffde59').describe('Header part 1 color'),
  headerPart2Color: z.string().default('#ffde59').describe('Header part 2 color'),
  subtitle: z.string().optional().describe('Subtitle text'),
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-dark').describe('Style variant'),
  showDecorations: z.boolean().default(true).describe('Show decorative elements'),
})

export type EducationVideosProps = z.infer<typeof EducationVideosPropsSchema> & BaseBlockProps

/**
 * Transform database videos to VideoItem format
 */
function transformToVideoItems(videos: EducationVideo[]): VideoItem[] {
  return videos.map(video => ({
    id: video.id,
    title: video.title,
    youtube_video_id: video.youtube_video_id,
    thumbnail_url: video.thumbnail_url || undefined,
    duration: video.duration || undefined,
    category: video.category || undefined,
    description: video.description || undefined,
  }))
}

/**
 * EducationVideos Component - jkkn.ac.in Style
 *
 * Full-width video player with playlist sidebar:
 * - Large inline YouTube embed player on left (70%)
 * - Playlist sidebar on right (30%)
 * - "Currently Playing" indicator with green header
 * - Click video in playlist to play inline
 * - Responsive: stacks vertically on mobile
 * - Fetches videos from database automatically
 */
export function EducationVideos({
  headerPart1 = 'Education',
  headerPart2 = 'Videos',
  headerPart1Color = '#ffde59',
  headerPart2Color = '#ffde59',
  subtitle,
  variant = 'modern-dark',
  showDecorations = true,
  className,
  isEditing,
}: EducationVideosProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch videos from database on mount
  useEffect(() => {
    async function fetchVideos() {
      try {
        const dbVideos = await getActiveEducationVideos()
        setVideos(transformToVideoItems(dbVideos))
      } catch (error) {
        console.error('Error fetching videos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // Use database videos only - no demo videos to avoid YouTube blocking issues
  const displayVideos = videos
  const activeVideo = displayVideos[activeVideoIndex]

  // Style variants
  const isDark = variant === 'modern-dark'
  const bgColor = isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
  const headerBg = isDark ? 'bg-[#0d0d0d]' : 'bg-brand-primary'
  const textColor = isDark ? 'text-white' : 'text-gray-900'
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const playlistBg = isDark ? 'bg-[#2a2a2a]' : 'bg-[#f0f0f0]'
  const dividerColor = isDark ? 'divide-gray-700' : 'divide-gray-200'
  const hoverBg = isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'
  const activeBg = isDark ? 'bg-[#333]' : 'bg-gray-200'

  // Show loading state
  if (isLoading && !isEditing) {
    return (
      <section className={cn('w-full', bgColor, className)}>
        <div className={cn(headerBg, 'py-6 px-4')}>
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
              <span style={{ color: headerPart2Color }}>{headerPart2}</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      </section>
    )
  }

  // Hide section if no videos (in production, not editing)
  if (displayVideos.length === 0 && !isEditing) {
    return null
  }

  // Show placeholder in editing mode when no videos
  if (displayVideos.length === 0 && isEditing) {
    return (
      <section className={cn('w-full', bgColor, className)}>
        <div className={cn(headerBg, 'py-6 px-4')}>
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
              <span style={{ color: headerPart2Color }}>{headerPart2}</span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Video className="w-16 h-16 text-gray-400 mb-4" />
          <p className={cn('text-lg font-medium', textColor)}>No videos added yet</p>
          <p className={mutedColor}>Add videos from the Admin → Videos panel</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('w-full', bgColor, className)}>
      {/* Header Section */}
      <div className={cn(headerBg, 'py-6 px-4')}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span style={{ color: headerPart2Color }}>{headerPart2}</span>
          </h2>
          {subtitle && (
            <p className={cn('mt-2 text-lg', isDark ? 'text-gray-300' : 'text-gray-600')}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Video Player Layout - Matching jkkn.ac.in exactly */}
      <div className="flex flex-col lg:flex-row">
        {/* Main Video Player - Left Side (70%) */}
        <div className="lg:w-[70%] bg-black relative">
          {/* Video Title Bar - Top overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
            <div className="flex items-center gap-3 p-3">
              {/* JKKN Logo */}
              <div className="w-12 h-12 rounded bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-brand-primary font-bold text-xs leading-tight text-center">JKKN</span>
              </div>
              {/* Video Title */}
              <h3 className="text-white font-medium text-sm md:text-base line-clamp-1 flex-1">
                {activeVideo?.title}
              </h3>
              {/* Watch Later & Share buttons (visual only) */}
              <div className="hidden md:flex items-center gap-4 text-white/80">
                <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeWidth="2" d="M12 6v6l4 2"/>
                  </svg>
                  <span className="text-xs">Watch Later</span>
                </button>
                <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                  </svg>
                  <span className="text-xs">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Embed */}
          <div className="aspect-video">
            {activeVideo && (
              <iframe
                key={activeVideo.youtube_video_id + activeVideoIndex}
                src={`https://www.youtube.com/embed/${activeVideo.youtube_video_id}?rel=0&modestbranding=1&showinfo=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeVideo.title}
              />
            )}
          </div>

          {/* Bottom overlay with MORE VIDEOS and JKKN logo */}
          {showDecorations && (
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
              <div className="flex items-end justify-between">
                <span className="text-white/70 text-sm font-medium">MORE VIDEOS</span>
                <div className="w-16 h-12 bg-white/90 rounded flex items-center justify-center">
                  <span className="text-brand-primary font-bold text-xs">JKKN</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Playlist Sidebar - Right Side (30%) */}
        <div className={cn('lg:w-[30%] flex flex-col max-h-[500px] lg:max-h-none', playlistBg)}>
          {/* Currently Playing Header - Green */}
          <div className="bg-brand-primary p-4 flex items-center gap-3 relative overflow-hidden">
            {/* Play icon circle */}
            {showDecorations && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center -mr-8">
                <Play className="w-8 h-8 text-white/40 ml-2" fill="currentColor" />
              </div>
            )}

            <div className="flex-1 min-w-0 relative z-10">
              <p className="text-white/90 text-xs font-medium uppercase tracking-wider mb-1">
                Currently Playing
              </p>
              <h4 className="text-white font-bold text-sm line-clamp-2 uppercase">
                {activeVideo?.title}
              </h4>
              {activeVideo?.duration && (
                <p className="text-white/70 text-xs mt-1 font-mono">
                  {activeVideo.duration}
                </p>
              )}
            </div>
          </div>

          {/* Video List */}
          <ScrollArea className="flex-1">
            <div className={cn('divide-y', dividerColor)}>
              {displayVideos.map((video, index) => (
                <button
                  key={video.id || index}
                  onClick={() => !isEditing && setActiveVideoIndex(index)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 text-left transition-all duration-200",
                    hoverBg,
                    index === activeVideoIndex && activeBg
                  )}
                >
                  {/* Play indicator for active item */}
                  {index === activeVideoIndex && (
                    <div className="flex-shrink-0 w-2 self-stretch bg-brand-primary rounded-full" />
                  )}

                  {/* Thumbnail */}
                  <div className="relative w-28 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-300">
                    {video.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-400">
                        <Video className="w-6 h-6 text-white/50" />
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className={cn(
                      "text-sm font-semibold line-clamp-2 leading-tight uppercase",
                      textColor,
                      index === activeVideoIndex && "text-brand-primary"
                    )}>
                      {video.title}
                    </h5>
                    {video.duration && (
                      <p className={cn('text-xs mt-1 font-mono', mutedColor)}>
                        {video.duration}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  )
}

export default EducationVideos
