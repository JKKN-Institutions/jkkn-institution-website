'use client'

import { cn } from '@/lib/utils'
import type { EmbedBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useState } from 'react'

export default function EmbedBlock({
  embedUrl = '',
  embedType = 'iframe',
  embedCode = '',
  aspectRatio = '16/9',
  allowFullscreen = true,
  autoHeight = false,
  minHeight,
  maxHeight,
  borderRadius = '8px',
  showBorder = false,
  title = 'Embedded content',
  fullWidth = false,
  className,
  isEditing,
}: EmbedBlockProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('')

  // Sanitize and process embed code
  useEffect(() => {
    if (embedType === 'html' && embedCode) {
      // Basic sanitization - remove script tags but keep iframe
      const cleaned = embedCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      setSanitizedHtml(cleaned)
    }
  }, [embedCode, embedType])

  // Get the embed URL based on type
  const getEmbedUrl = (url: string, type: string): string => {
    if (!url) return ''

    switch (type) {
      case 'youtube': {
        // Handle various YouTube URL formats
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        if (youtubeMatch) {
          return `https://www.youtube.com/embed/${youtubeMatch[1]}`
        }
        return url
      }

      case 'vimeo': {
        // Handle Vimeo URLs
        const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
        if (vimeoMatch) {
          return `https://player.vimeo.com/video/${vimeoMatch[1]}`
        }
        return url
      }

      case 'google-maps': {
        // Handle Google Maps URLs
        if (url.includes('google.com/maps')) {
          // Extract coordinates or place ID if available
          return url.includes('/embed') ? url : `${url}`
        }
        return url
      }

      case 'google-forms': {
        // Handle Google Forms URLs
        if (url.includes('docs.google.com/forms')) {
          return url.includes('/viewform?embedded=true')
            ? url
            : url.replace('/viewform', '/viewform?embedded=true')
        }
        return url
      }

      case 'google-drive': {
        // Handle Google Drive video embeds
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
        if (driveMatch) {
          return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
        }
        return url
      }

      case 'iframe':
      default:
        return url
    }
  }

  // Show placeholder in editing mode when no content
  if ((!embedUrl && !embedCode) && isEditing) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/25 rounded-lg',
          className
        )}
        style={{
          aspectRatio: autoHeight ? undefined : aspectRatio,
          minHeight: minHeight || '300px',  // Always apply minHeight with fallback
        }}
      >
        <div className="text-center text-muted-foreground p-8">
          <svg
            className="w-12 h-12 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-medium">Embed Content</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add URL or embed code to display content
          </p>
        </div>
      </div>
    )
  }

  if (!embedUrl && !embedCode) return null

  // Render HTML embed code
  if (embedType === 'html' && embedCode) {
    return (
      <div
        className={cn(
          'relative overflow-hidden',
          showBorder && 'border border-border',
          className
        )}
        style={{
          aspectRatio: autoHeight ? undefined : aspectRatio,
          minHeight: minHeight,  // Always apply minHeight if provided
          maxHeight: maxHeight,
          borderRadius,
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          className="w-full h-full"
        />
      </div>
    )
  }

  // Render iframe embed
  const finalUrl = getEmbedUrl(embedUrl, embedType)

  // Container styles
  const containerStyles: React.CSSProperties = {
    aspectRatio: autoHeight ? undefined : aspectRatio,
    minHeight: minHeight,  // Always apply minHeight if provided
    maxHeight: maxHeight,
    borderRadius,
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fullWidth && 'w-full',
        showBorder && 'border border-border',
        className
      )}
      style={containerStyles}
    >
      <iframe
        src={finalUrl}
        title={title}
        className={cn(
          'w-full h-full',
          autoHeight ? 'min-h-[400px]' : 'absolute inset-0'
        )}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen={allowFullscreen}
        loading="lazy"
        style={{ border: 0 }}
      />
    </div>
  )
}
