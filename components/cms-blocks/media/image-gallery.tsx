'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ImageGalleryProps } from '@/lib/cms/registry-types'

export default function ImageGallery({
  images = [],
  layout = 'grid',
  columns = 3,
  lightbox = true,
  gap = 4,
  className,
  isEditing,
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0 && isEditing) {
    return (
      <div className={cn('py-8', className)}>
        <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground text-center">Click to add images</p>
        </div>
      </div>
    )
  }

  if (images.length === 0) return null

  const openLightbox = (index: number) => {
    if (lightbox) {
      setActiveIndex(index)
      setLightboxOpen(true)
    }
  }

  return (
    <>
      <div
        className={cn(
          layout === 'grid' && 'grid',
          layout === 'masonry' && 'columns-1 md:columns-2 lg:columns-3',
          layout === 'carousel' && 'flex overflow-x-auto snap-x snap-mandatory pb-4',
          className
        )}
        style={{
          ...(layout === 'grid' && {
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap * 0.25}rem`,
          }),
          ...(layout === 'masonry' && { gap: `${gap * 0.25}rem` }),
          ...(layout === 'carousel' && { gap: `${gap * 0.25}rem` }),
        }}
      >
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => openLightbox(index)}
            className={cn(
              'relative overflow-hidden rounded-lg group',
              layout === 'grid' && 'aspect-square',
              layout === 'masonry' && 'break-inside-avoid mb-4',
              layout === 'carousel' && 'min-w-[300px] flex-shrink-0 snap-center aspect-video',
              lightbox && 'cursor-pointer'
            )}
          >
            <img
              src={image.src}
              alt={image.alt || ''}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {image.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            className="absolute left-4 text-white hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation()
              setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
            }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={images[activeIndex]?.src}
            alt={images[activeIndex]?.alt || ''}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 text-white hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation()
              setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
            }}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {images[activeIndex]?.caption && (
            <p className="absolute bottom-4 text-white text-center px-4">
              {images[activeIndex].caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}
