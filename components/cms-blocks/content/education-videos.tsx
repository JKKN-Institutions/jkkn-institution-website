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
 * EducationVideos props schema - Light theme matching pharmacy.jkkn.ac.in
 */
export const EducationVideosPropsSchema = z.object({
  // Header configuration
  headerText: z.string().default('EDUCATION VIDEO').describe('Section header text'),
  headerTextColor: z.string().default('#0b6d41').describe('Header text color (green)'),
  headerUnderlineColor: z.string().default('#dc2626').describe('Header underline color (red)'),
  showHeader: z.boolean().default(true).describe('Show/hide section header'),

  // Currently Playing section
  currentlyPlayingText: z.string().default('Currently Playing').describe('Currently playing label'),
  currentlyPlayingBgColor: z.string().default('#0b6d41').describe('Currently playing header background'),

  // Player settings
  showLogoOverlay: z.boolean().default(true).describe('Show JKKN logo on video player'),
  logoText: z.string().default('JKKN').describe('Logo text displayed on player'),
  showTitleOverlay: z.boolean().default(true).describe('Show video title overlay on player'),

  // Playlist settings
  showDuration: z.boolean().default(true).describe('Show video duration'),
  showActiveIndicator: z.boolean().default(true).describe('Show green bar on active video'),
  activeIndicatorColor: z.string().default('#0b6d41').describe('Active video indicator color'),

  // Styling
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  playlistBgColor: z.string().default('#f5f5f5').describe('Playlist sidebar background'),
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
 * EducationVideos Component - pharmacy.jkkn.ac.in Style (Light Theme)
 *
 * Full-width video player with playlist sidebar:
 * - Simple green header with red underline
 * - Large inline YouTube embed player on left (70%)
 * - Playlist sidebar on right (30%) with light background
 * - Green "Currently Playing" header with play icon
 * - Click video in playlist to play inline
 * - Green indicator bar on active video
 * - Responsive: stacks vertically on mobile
 * - Fetches videos from database automatically
 */
export function EducationVideos({
  headerText = 'EDUCATION VIDEO',
  headerTextColor = '#0b6d41',
  headerUnderlineColor = '#dc2626',
  showHeader = true,
  currentlyPlayingText = 'Currently Playing',
  currentlyPlayingBgColor = '#0b6d41',
  showLogoOverlay = true,
  logoText = 'JKKN',
  showTitleOverlay = true,
  showDuration = true,
  showActiveIndicator = true,
  activeIndicatorColor = '#0b6d41',
  backgroundColor = '#ffffff',
  playlistBgColor = '#f5f5f5',
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

  const activeVideo = videos[activeVideoIndex]

  // Show loading state
  if (isLoading && !isEditing) {
    return (
      <section className={cn('w-full', className)} style={{ backgroundColor }}>
        {showHeader && (
          <div className="py-6 px-4" style={{ backgroundColor }}>
            <div className="max-w-7xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold uppercase tracking-wide"
                style={{ color: headerTextColor }}
              >
                {headerText}
              </h2>
              <div
                className="w-16 h-1 mt-2"
                style={{ backgroundColor: headerUnderlineColor }}
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#0b6d41]" />
        </div>
      </section>
    )
  }

  // Hide section if no videos (in production, not editing)
  if (videos.length === 0 && !isEditing) {
    return null
  }

  // Show placeholder in editing mode when no videos
  if (videos.length === 0 && isEditing) {
    return (
      <section className={cn('w-full', className)} style={{ backgroundColor }}>
        {showHeader && (
          <div className="py-6 px-4" style={{ backgroundColor }}>
            <div className="max-w-7xl mx-auto">
              <h2
                className="text-2xl md:text-3xl font-bold uppercase tracking-wide"
                style={{ color: headerTextColor }}
              >
                {headerText}
              </h2>
              <div
                className="w-16 h-1 mt-2"
                style={{ backgroundColor: headerUnderlineColor }}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Video className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900">No videos added yet</p>
          <p className="text-gray-500">Add videos from the Admin &rarr; Videos panel</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('w-full', className)} style={{ backgroundColor }}>
      {/* Section Header - Green text with red underline */}
      {showHeader && (
        <div className="py-6 px-4" style={{ backgroundColor }}>
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-wide"
              style={{ color: headerTextColor }}
            >
              {headerText}
            </h2>
            <div
              className="w-16 h-1 mt-2"
              style={{ backgroundColor: headerUnderlineColor }}
            />
          </div>
        </div>
      )}

      {/* Video Player Layout - 70% player | 30% playlist */}
      <div className="flex flex-col lg:flex-row">
        {/* Main Video Player - Left Side (70%) */}
        <div className="w-full lg:w-[70%] bg-black relative">
          {/* Title Bar Overlay - Top */}
          {showTitleOverlay && activeVideo && (
            <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 py-2 px-4 flex items-center gap-3">
              {/* JKKN Logo */}
              {showLogoOverlay && (
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-[#0b6d41] font-bold text-xs leading-tight text-center">
                    {logoText}
                  </span>
                </div>
              )}
              {/* Video Title */}
              <h3 className="text-white text-sm md:text-base font-medium line-clamp-1 flex-1">
                {activeVideo.title}
              </h3>
              {/* Watch Later & Share buttons */}
              <div className="hidden md:flex items-center gap-4 text-white/80">
                <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-xs">Watch Later</span>
                </button>
                <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  <span className="text-xs">Share</span>
                </button>
              </div>
            </div>
          )}

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
        </div>

        {/* Playlist Sidebar - Right Side (30%) */}
        <div
          className="w-full lg:w-[30%] flex flex-col max-h-[400px] lg:max-h-none"
          style={{ backgroundColor: playlistBgColor }}
        >
          {/* Currently Playing Header - Green */}
          {activeVideo && (
            <div
              className="p-4 flex items-center justify-between relative overflow-hidden"
              style={{ backgroundColor: currentlyPlayingBgColor }}
            >
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
                  {currentlyPlayingText}
                </p>
                <h4 className="text-white font-bold text-sm line-clamp-2 uppercase">
                  {activeVideo.title}
                </h4>
              </div>

              {/* Play icon circle on right */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center -mr-6">
                <Play className="w-6 h-6 text-white/40 ml-1" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Video List */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-200">
              {videos.map((video, index) => (
                <button
                  key={video.id || index}
                  onClick={() => !isEditing && setActiveVideoIndex(index)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 text-left transition-all duration-200',
                    'hover:bg-gray-100',
                    index === activeVideoIndex && 'bg-gray-200'
                  )}
                >
                  {/* Active indicator bar */}
                  {showActiveIndicator && index === activeVideoIndex && (
                    <div
                      className="flex-shrink-0 w-1 self-stretch rounded-full"
                      style={{ backgroundColor: activeIndicatorColor }}
                    />
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
                        <Video className="w-5 h-5 text-white/50" />
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h5
                      className={cn(
                        'text-sm font-semibold line-clamp-2 leading-tight uppercase text-gray-900',
                        index === activeVideoIndex && 'text-[#0b6d41]'
                      )}
                    >
                      {video.title}
                    </h5>
                    {showDuration && video.duration && (
                      <p className="text-xs mt-1 font-mono text-gray-500">{video.duration}</p>
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
