'use client'

import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { Play, Loader2 } from 'lucide-react'
import Image from 'next/image'

export interface ProgressiveVideoPlayerProps {
  src: string
  poster?: string
  posterAlt?: string
  aspectRatio?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
  onLoadStart?: () => void
  onCanPlay?: () => void
  onError?: (error: Error) => void
}

/**
 * Progressive Video Player with Loading States
 *
 * Optimized for performance:
 * - Defers video loading until user interaction
 * - Shows loading state while video loads
 * - Uses poster image as placeholder
 * - Lazy loads video content
 *
 * Use this for large videos or videos below the fold
 */
export default function ProgressiveVideoPlayer({
  src,
  poster,
  posterAlt = 'Video thumbnail',
  aspectRatio = '16/9',
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  className,
  onLoadStart,
  onCanPlay,
  onError,
}: ProgressiveVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(autoplay) // Autoplay videos load immediately
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // For autoplay videos, start loading immediately
  useEffect(() => {
    if (autoplay && videoRef.current) {
      handleLoadVideo()
    }
  }, [autoplay])

  const handleLoadVideo = () => {
    setIsLoading(true)
    setIsReady(true)
    onLoadStart?.()

    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  const handleCanPlay = () => {
    setIsLoading(false)
    onCanPlay?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.(new Error('Video failed to load'))
  }

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg bg-black', className)}
      style={{ aspectRatio }}
    >
      {/* Poster Image / Placeholder */}
      {!isReady && poster && (
        <div className="absolute inset-0">
          <Image
            src={poster}
            alt={posterAlt}
            fill
            className="object-cover"
            priority
          />

          {/* Play Button Overlay */}
          <button
            onClick={handleLoadVideo}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
            aria-label="Play video"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" />
            </div>
          </button>
        </div>
      )}

      {/* Video Element */}
      {isReady && (
        <>
          <video
            ref={videoRef}
            className={cn(
              'w-full h-full object-cover',
              isLoading && 'opacity-0'
            )}
            autoPlay={autoplay}
            controls={controls}
            loop={loop}
            muted={muted}
            playsInline
            preload="metadata"
            poster={poster}
            onCanPlay={handleCanPlay}
            onError={handleError}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center gap-3 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p className="text-sm font-medium">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white p-4">
                <p className="text-lg font-semibold mb-2">Failed to load video</p>
                <p className="text-sm text-white/70 mb-4">
                  Please check your connection and try again
                </p>
                <button
                  onClick={() => {
                    setHasError(false)
                    handleLoadVideo()
                  }}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
