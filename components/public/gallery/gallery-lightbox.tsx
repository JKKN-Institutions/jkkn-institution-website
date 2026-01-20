'use client'

import * as React from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import type { GalleryImage } from '@/app/actions/cms/gallery'

interface GalleryLightboxProps {
  images: GalleryImage[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GalleryLightbox({
  images,
  initialIndex,
  open,
  onOpenChange,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  // Reset to initial index when opening
  React.useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  const currentImage = images[currentIndex]

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case 'Escape':
          onOpenChange(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, goToPrevious, goToNext, onOpenChange])

  if (!currentImage) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none overflow-hidden"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>
            {currentImage.title || currentImage.alt_text || 'Gallery Image'}
          </DialogTitle>
        </VisuallyHidden>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Main image container */}
        <div className="relative w-[90vw] h-[85vh] flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={currentImage.image_url}
              alt={currentImage.alt_text || currentImage.title || 'Gallery image'}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 z-50',
                'w-12 h-12 rounded-full bg-white/10 hover:bg-white/20',
                'flex items-center justify-center text-white transition-colors'
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 z-50',
                'w-12 h-12 rounded-full bg-white/10 hover:bg-white/20',
                'flex items-center justify-center text-white transition-colors'
              )}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Caption */}
        {(currentImage.title || currentImage.caption) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            {currentImage.title && (
              <h3 className="text-white text-lg font-semibold">{currentImage.title}</h3>
            )}
            {currentImage.caption && (
              <p className="text-white/80 text-sm mt-1">{currentImage.caption}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
