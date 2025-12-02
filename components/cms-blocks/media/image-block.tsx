'use client'

import { cn } from '@/lib/utils'
import type { ImageBlockProps } from '@/lib/cms/registry-types'

export default function ImageBlock({
  src = '',
  alt = '',
  caption,
  width,
  height,
  objectFit = 'cover',
  alignment = 'center',
  link,
  lightbox = false,
  className,
  isEditing,
}: ImageBlockProps) {
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  }

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  if (!src && isEditing) {
    return (
      <figure className={cn('relative', className)}>
        <div
          className="flex items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/25 rounded-lg"
          style={{ width: width || '100%', height: height || 200 }}
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
            <p className="text-sm">Click to add image</p>
          </div>
        </div>
      </figure>
    )
  }

  if (!src) return null

  const imageElement = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        'rounded-lg block',
        width ? '' : 'w-full',
        objectFitClasses[objectFit],
        alignmentClasses[alignment]
      )}
      style={{ maxWidth: width, maxHeight: height }}
    />
  )

  const wrappedImage = link ? (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {imageElement}
    </a>
  ) : (
    imageElement
  )

  return (
    <figure className={cn('relative', className)}>
      {wrappedImage}
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
