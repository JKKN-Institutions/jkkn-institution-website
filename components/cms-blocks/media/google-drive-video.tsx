'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { convertToGoogleDriveVideoUrl, extractGoogleDriveFileId } from '@/lib/utils/google-drive'
import { Play } from 'lucide-react'
import { useState } from 'react'

/**
 * GoogleDriveVideo props schema
 */
export const GoogleDriveVideoPropsSchema = z.object({
  // Video source
  videoUrl: z.string().describe('Google Drive video URL or share link'),

  // Display
  title: z.string().optional().describe('Video title'),
  description: z.string().optional().describe('Video description'),

  // Sizing
  aspectRatio: z.enum(['16:9', '4:3', '1:1', '9:16']).default('16:9').describe('Video aspect ratio'),
  maxWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full']).default('lg').describe('Maximum width'),

  // Styling
  rounded: z.boolean().default(true).describe('Rounded corners'),
  shadow: z.boolean().default(true).describe('Show shadow'),
  showThumbnail: z.boolean().default(false).describe('Show thumbnail before playing'),
  thumbnailUrl: z.string().optional().describe('Custom thumbnail image URL'),

  // Layout
  alignment: z.enum(['left', 'center', 'right']).default('center').describe('Video alignment'),
})

export type GoogleDriveVideoProps = z.infer<typeof GoogleDriveVideoPropsSchema> & BaseBlockProps

/**
 * GoogleDriveVideo Component
 *
 * Embeds a video from Google Drive using iframe.
 * Supports:
 * - Auto-conversion of Google Drive share links
 * - Multiple aspect ratios
 * - Optional thumbnail before playing
 * - Responsive sizing
 */
export function GoogleDriveVideo({
  videoUrl = '',
  title,
  description,
  aspectRatio = '16:9',
  maxWidth = 'lg',
  rounded = true,
  shadow = true,
  showThumbnail = false,
  thumbnailUrl,
  alignment = 'center',
  className,
  isEditing,
}: GoogleDriveVideoProps) {
  const [isPlaying, setIsPlaying] = useState(!showThumbnail)

  // Convert to embed URL
  const embedUrl = convertToGoogleDriveVideoUrl(videoUrl)
  const fileId = extractGoogleDriveFileId(videoUrl)

  // Aspect ratio classes
  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
  }

  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-full',
  }

  // Alignment classes
  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  // Generate thumbnail URL from Google Drive file ID
  const defaultThumbnail = fileId
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`
    : null

  const thumbnail = thumbnailUrl || defaultThumbnail

  if (!videoUrl) {
    if (isEditing) {
      return (
        <div className={cn('py-8', className)}>
          <div
            className={cn(
              'bg-muted rounded-lg flex items-center justify-center',
              aspectRatioClasses[aspectRatio],
              maxWidthClasses[maxWidth],
              alignmentClasses[alignment]
            )}
          >
            <div className="text-center text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Add a Google Drive video URL</p>
              <p className="text-xs mt-1">Paste a share link from Google Drive</p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={cn('py-8', className)}>
      <div
        className={cn(
          maxWidthClasses[maxWidth],
          alignmentClasses[alignment],
          'w-full'
        )}
      >
        {/* Video Container */}
        <div
          className={cn(
            'relative overflow-hidden bg-black',
            aspectRatioClasses[aspectRatio],
            rounded && 'rounded-xl',
            shadow && 'shadow-xl'
          )}
        >
          {showThumbnail && !isPlaying && thumbnail ? (
            // Thumbnail with play button
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full group cursor-pointer"
            >
              <img
                src={thumbnail}
                alt={title || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center shadow-lg">
                  <Play className="h-8 w-8 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
            </button>
          ) : (
            // Video iframe
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={title || 'Google Drive Video'}
            />
          )}
        </div>

        {/* Title and Description */}
        {(title || description) && (
          <div className={cn('mt-4', alignment === 'center' && 'text-center')}>
            {title && (
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GoogleDriveVideo
