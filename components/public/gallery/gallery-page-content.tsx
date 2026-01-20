'use client'

import * as React from 'react'
import { GalleryCategorySection } from './gallery-category-section'
import { GalleryLightbox } from './gallery-lightbox'
import type { GalleryCategoryWithImages, GalleryImage } from '@/app/actions/cms/gallery'

interface GalleryPageContentProps {
  categories: GalleryCategoryWithImages[]
}

export function GalleryPageContent({ categories }: GalleryPageContentProps) {
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false)
  const [lightboxImages, setLightboxImages] = React.useState<GalleryImage[]>([])
  const [lightboxIndex, setLightboxIndex] = React.useState(0)

  const handleImageClick = React.useCallback(
    (images: GalleryImage[], index: number) => {
      setLightboxImages(images)
      setLightboxIndex(index)
      setLightboxOpen(true)
    },
    []
  )

  if (categories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          No gallery images available at the moment.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Category sections */}
      <div className="space-y-8">
        {categories.map((category) => (
          <GalleryCategorySection
            key={category.id}
            category={category}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      {/* Lightbox modal */}
      <GalleryLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  )
}
