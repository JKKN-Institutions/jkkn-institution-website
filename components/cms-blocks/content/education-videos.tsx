'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
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
  // Section Header visibility
  showHeader: z.boolean().default(true).describe('Show/hide section header'),

  // Label/Badge configuration
  showLabel: z.boolean().default(true).describe('Show label badge above title'),
  labelText: z.string().default('VIDEO GALLERY').describe('Label badge text'),
  labelColor: z.string().default('#1A1A1A').describe('Label text color (dark text for contrast)'),
  labelBgColor: z.string().default('var(--gold-decorative)').describe('Label background color (gold)'),

  // Title configuration
  title: z.string().default('Education Videos').describe('Section title'),
  titleAccentWord: z.string().optional().describe('Word to highlight in accent color'),
  titleAccentColor: z.string().default('var(--gold-on-light)').describe('Accent word color (accessible gold)'),
  titleColor: z.string().default('#0b6d41').describe('Title text color (green)'),
  titleFontSize: z.enum(['3xl', '4xl', '5xl']).default('5xl').describe('Title font size'),

  // Tagline configuration
  showTagline: z.boolean().default(true).describe('Show tagline below title'),
  tagline: z.string().default('Explore our collection of educational content').describe('Tagline text'),
  taglineColor: z.string().default('#6b7280').describe('Tagline text color'),

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
// Font size mapping for title
const titleFontSizeMap = {
  '3xl': 'text-2xl sm:text-3xl md:text-3xl',
  '4xl': 'text-2xl sm:text-3xl md:text-4xl',
  '5xl': 'text-3xl sm:text-4xl md:text-5xl',
}

export function EducationVideos({
  showHeader = true,
  // Label/Badge
  showLabel = true,
  labelText = 'VIDEO GALLERY',
  labelColor = '#D4AF37',
  labelBgColor = 'rgba(212,175,55,0.2)',
  // Title
  title = 'Education Videos',
  titleAccentWord,
  titleAccentColor = '#D4AF37',
  titleColor = '#0b6d41',
  titleFontSize = '5xl',
  // Tagline
  showTagline = true,
  tagline = 'Explore our collection of educational content',
  taglineColor = '#6b7280',
  // Currently Playing section
  currentlyPlayingText = 'Currently Playing',
  currentlyPlayingBgColor = '#0b6d41',
  // Player settings
  showLogoOverlay = true,
  logoText = 'JKKN',
  showTitleOverlay = true,
  // Playlist settings
  showDuration = true,
  showActiveIndicator = true,
  activeIndicatorColor = '#0b6d41',
  // Styling
  backgroundColor = '#ffffff',
  playlistBgColor = '#f5f5f5',
  className,
  isEditing,
}: EducationVideosProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Parse title for accent word styling
  const titleParts = useMemo(() => {
    if (!titleAccentWord || !title.includes(titleAccentWord)) {
      return { before: title, accent: '', after: '' }
    }
    const parts = title.split(titleAccentWord)
    return {
      before: parts[0] || '',
      accent: titleAccentWord,
      after: parts[1] || '',
    }
  }, [title, titleAccentWord])

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

  // Reusable Section Header component
  const SectionHeader = () => (
    <div className="py-8 md:py-12 px-4" style={{ backgroundColor }}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Label/Badge */}
        {showLabel && labelText && (
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
              style={{
                backgroundColor: labelBgColor,
                color: labelColor,
                border: `1px solid ${labelColor}30`,
              }}
            >
              {labelText}
            </span>
          </div>
        )}

        {/* Title with accent word */}
        <h2
          className={cn(
            titleFontSizeMap[titleFontSize],
            'font-bold tracking-tight mb-4'
          )}
          style={{ color: titleColor }}
        >
          {titleParts.before}
          {titleParts.accent && (
            <span style={{ color: titleAccentColor }}>{titleParts.accent}</span>
          )}
          {titleParts.after}
        </h2>

        {/* Tagline */}
        {showTagline && tagline && (
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: taglineColor }}
          >
            {tagline}
          </p>
        )}
      </div>
    </div>
  )

  // Show loading state
  if (isLoading && !isEditing) {
    return (
      <section className={cn('w-full', className)} style={{ backgroundColor }}>
        {showHeader && <SectionHeader />}
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
        {showHeader && <SectionHeader />}
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
      {/* Section Header - Label, Title with accent, Tagline */}
      {showHeader && <SectionHeader />}

      {/* Video Player Layout - 70% player | 30% playlist */}
      <div className="max-w-7xl mx-auto px-4">
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
          className="w-full lg:w-[30%] flex flex-col max-h-none lg:max-h-[500px]"
          style={{ backgroundColor: playlistBgColor }}
        >
          {/* Currently Playing Header - Green (Hidden on mobile) */}
          {activeVideo && (
            <div
              className="hidden lg:flex p-4 items-center justify-between relative overflow-hidden"
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

          {/* Video List - Horizontal on mobile, Vertical on desktop */}
          <div className="flex-1 overflow-x-auto lg:overflow-x-visible overflow-y-visible lg:overflow-y-auto">
            <div className="flex flex-row lg:flex-col gap-2 p-2 lg:p-0 lg:gap-0 lg:divide-y lg:divide-gray-200 min-w-max lg:min-w-0">
              {videos.map((video, index) => (
                <button
                  key={video.id || index}
                  onClick={() => !isEditing && setActiveVideoIndex(index)}
                  className={cn(
                    'flex-shrink-0 w-28 lg:w-full flex flex-col lg:flex-row items-start gap-1 lg:gap-3 p-1 lg:p-3 text-left transition-all duration-200 rounded-lg lg:rounded-none',
                    'hover:bg-gray-100',
                    index === activeVideoIndex && 'bg-gray-200 ring-2 ring-[#0b6d41] lg:ring-0'
                  )}
                >
                  {/* Active indicator bar - Desktop only */}
                  {showActiveIndicator && index === activeVideoIndex && (
                    <div
                      className="hidden lg:block flex-shrink-0 w-1 self-stretch rounded-full"
                      style={{ backgroundColor: activeIndicatorColor }}
                    />
                  )}

                  {/* Thumbnail */}
                  <div className="relative w-full lg:w-28 aspect-video lg:h-16 rounded overflow-hidden flex-shrink-0 bg-gray-300">
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

                  {/* Video Info - Hidden on mobile for compact cards */}
                  <div className="hidden lg:block flex-1 min-w-0">
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
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

export default EducationVideos
