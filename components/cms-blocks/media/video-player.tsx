'use client'

import { cn } from '@/lib/utils'
import type { VideoPlayerProps } from '@/lib/cms/registry-types'

export default function VideoPlayer({
  src = '',
  provider = 'youtube',
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  poster,
  posterAlt = '',
  aspectRatio = '16/9',
  className,
  isEditing,
}: VideoPlayerProps) {
  // Note: posterAlt is available for accessibility documentation
  // Video poster attribute doesn't support alt text natively
  void posterAlt
  // Extract YouTube/Vimeo video ID
  const getEmbedUrl = (url: string, prov: string) => {
    if (prov === 'youtube' || url.includes('youtube') || url.includes('youtu.be')) {
      const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      if (youtubeMatch) {
        const params = new URLSearchParams({
          ...(autoplay && { autoplay: '1' }),
          ...(loop && { loop: '1', playlist: youtubeMatch[1] }),
          ...(muted && { mute: '1' }),
          ...(!controls && { controls: '0' }),
        })
        return `https://www.youtube.com/embed/${youtubeMatch[1]}?${params}`
      }
    }

    if (prov === 'vimeo' || url.includes('vimeo')) {
      const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
      if (vimeoMatch) {
        const params = new URLSearchParams({
          ...(autoplay && { autoplay: '1' }),
          ...(loop && { loop: '1' }),
          ...(muted && { muted: '1' }),
        })
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?${params}`
      }
    }

    return url
  }

  if (!src && isEditing) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/25 rounded-lg',
          className
        )}
        style={{ aspectRatio }}
      >
        <div className="text-center text-muted-foreground">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">Click to add video</p>
        </div>
      </div>
    )
  }

  if (!src) return null

  // Self-hosted video
  if (provider === 'self') {
    return (
      <div className={cn('relative overflow-hidden rounded-lg', className)} style={{ aspectRatio }}>
        <video
          src={src}
          poster={poster}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          preload={autoplay ? "auto" : "metadata"}
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  // Embedded video (YouTube/Vimeo)
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)} style={{ aspectRatio }}>
      <iframe
        src={getEmbedUrl(src, provider)}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
