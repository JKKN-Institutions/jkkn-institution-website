'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { ImageCarouselProps } from '@/lib/cms/registry-types'

export default function ImageCarousel({
  images = [],
  autoplay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className,
  isEditing,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goToNext = useCallback(() => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  useEffect(() => {
    if (!autoplay || isPaused || images.length <= 1) return

    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoplay, interval, isPaused, goToNext, images.length])

  if (images.length === 0 && isEditing) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/25 rounded-lg aspect-video',
          className
        )}
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">Click to add carousel images</p>
        </div>
      </div>
    )
  }

  if (images.length === 0) return null

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg aspect-video', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {images.filter(img => img.src).map((image, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <img
              src={image.src}
              alt={image.alt || ''}
              className="w-full h-full object-cover"
            />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-white text-lg">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === activeIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
