'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImage {
  src: string
  alt?: string
  caption?: string
}

interface GalleryBlockProps {
  images: GalleryImage[]
  layout: 'carousel' | 'grid'
  columns: number
}

export function GalleryBlock({ images, layout, columns }: GalleryBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isLightboxOpen) return

      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i - 1 + images.length) % images.length)
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i + 1) % images.length)
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      }
    },
    [isLightboxOpen, images.length]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Open lightbox
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  if (images.length === 0) return null

  if (layout === 'carousel') {
    return (
      <>
        <div className="relative my-8">
          {/* Main Carousel Image */}
          <div
            className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(currentIndex)}
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt || ''}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex((i) => (i - 1 + images.length) % images.length)
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex((i) => (i + 1) % images.length)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all',
                    idx === currentIndex
                      ? 'bg-primary scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Caption */}
          {images[currentIndex].caption && (
            <p className="text-center text-sm text-gray-600 mt-3 italic">
              {images[currentIndex].caption}
            </p>
          )}

          {/* Thumbnails */}
          {images.length > 1 && images.length <= 8 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'relative w-16 h-16 rounded overflow-hidden transition-all',
                    idx === currentIndex
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || ''}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setIsLightboxOpen(false)}
            onPrev={() =>
              setLightboxIndex((i) => (i - 1 + images.length) % images.length)
            }
            onNext={() =>
              setLightboxIndex((i) => (i + 1) % images.length)
            }
          />
        )}
      </>
    )
  }

  // Grid Layout
  return (
    <>
      <div
        className={cn(
          'grid gap-4 my-8',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-2 md:grid-cols-3',
          columns === 4 && 'grid-cols-2 md:grid-cols-4'
        )}
      >
        {images.map((img, idx) => (
          <figure key={idx} className="relative group">
            <div
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt || ''}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {img.caption && (
              <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onPrev={() =>
            setLightboxIndex((i) => (i - 1 + images.length) % images.length)
          }
          onNext={() =>
            setLightboxIndex((i) => (i + 1) % images.length)
          }
        />
      )}
    </>
  )
}

// Lightbox Component
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main Image */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt || ''}
          fill
          className="object-contain"
        />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/30 hover:bg-black/50 rounded-full p-3"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/30 hover:bg-black/50 rounded-full p-3"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Caption */}
      {images[currentIndex].caption && (
        <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
          <p className="text-lg">{images[currentIndex].caption}</p>
        </div>
      )}
    </div>
  )
}
