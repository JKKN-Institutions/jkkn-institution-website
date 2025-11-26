'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { BeforeAfterSliderProps } from '@/lib/cms/registry-types'

export default function BeforeAfterSlider({
  beforeImage = '',
  afterImage = '',
  beforeLabel = 'Before',
  afterLabel = 'After',
  startPosition = 50,
  className,
  isEditing,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(startPosition)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const newPosition = ((clientX - rect.left) / rect.width) * 100

    setPosition(Math.max(0, Math.min(100, newPosition)))
  }

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  if ((!beforeImage || !afterImage) && isEditing) {
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <p className="text-sm">Click to add before/after images</p>
        </div>
      </div>
    )
  }

  if (!beforeImage || !afterImage) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg aspect-video select-none cursor-ew-resize',
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before Image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${100 / (position / 100)}%` }}
          draggable={false}
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute w-1 h-full top-0 bg-white shadow-lg z-10"
        style={{
          left: `${position}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="absolute w-10 h-10 -left-5 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
        {beforeLabel}
      </span>
      <span className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
        {afterLabel}
      </span>
    </div>
  )
}
