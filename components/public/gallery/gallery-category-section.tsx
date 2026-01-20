'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  HomeCarousel,
  HomeCarouselItem,
  useHomeCarousel,
} from '@/components/ui/home-carousel'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryCategoryWithImages, GalleryImage } from '@/app/actions/cms/gallery'

interface GalleryCategorySectionProps {
  category: GalleryCategoryWithImages
  onImageClick: (images: GalleryImage[], index: number) => void
}

export function GalleryCategorySection({
  category,
  onImageClick,
}: GalleryCategorySectionProps) {
  if (category.images.length === 0) {
    return null
  }

  return (
    <section className="py-6">
      {/* Category Title */}
      <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
        {category.name}
      </h2>

      {/* Carousel with custom arrows */}
      <div className="relative">
        <HomeCarousel
          autoplay={false}
          loop={category.images.length > 3}
          showDots={true}
          className="px-0"
        >
          {category.images.map((image, index) => (
            <HomeCarouselItem key={image.id}>
              <GalleryImageCard
                image={image}
                onClick={() => onImageClick(category.images, index)}
              />
            </HomeCarouselItem>
          ))}

          {/* Custom green navigation arrows */}
          <GalleryCarouselArrows />
        </HomeCarousel>
      </div>
    </section>
  )
}

interface GalleryImageCardProps {
  image: GalleryImage
  onClick: () => void
}

function GalleryImageCard({ image, onClick }: GalleryImageCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-full aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={image.title || image.alt_text || 'View gallery image'}
    >
      <Image
        src={image.image_url}
        alt={image.alt_text || image.title || 'Gallery image'}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

      {/* Optional title overlay on hover */}
      {image.title && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium truncate">{image.title}</p>
        </div>
      )}
    </button>
  )
}

/**
 * Custom green navigation arrows for gallery
 */
function GalleryCarouselArrows() {
  const { api } = useHomeCarousel()

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  return (
    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
      <button
        onClick={scrollPrev}
        className={cn(
          'pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
          'bg-primary hover:bg-primary/90 text-white shadow-lg',
          '-ml-2 sm:-ml-3'
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className={cn(
          'pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
          'bg-primary hover:bg-primary/90 text-white shadow-lg',
          '-mr-2 sm:-mr-3'
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
