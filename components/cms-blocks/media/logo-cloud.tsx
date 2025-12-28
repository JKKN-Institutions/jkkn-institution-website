'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { LogoCloudProps } from '@/lib/cms/registry-types'

export default function LogoCloud({
  logos = [],
  layout = 'grid',
  grayscale = true,
  columns = 6,
  className,
  isEditing,
}: LogoCloudProps) {
  const [isPaused, setIsPaused] = useState(false)

  if (logos.length === 0 && isEditing) {
    return (
      <section className={cn('py-12 px-4', className)}>
        <div className="container mx-auto">
          <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-center">Click to add logos</p>
          </div>
        </div>
      </section>
    )
  }

  if (logos.length === 0) return null

  const filteredLogos = logos.filter(l => l.src)

  // Grid Layout
  if (layout === 'grid') {
    return (
      <section className={cn('py-12 px-4', className)}>
        <div className="container mx-auto">
          <div
            className="grid items-center gap-8"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {filteredLogos.map((logo, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt || ''}
                  className={cn(
                    'max-h-12 w-auto mx-auto object-contain transition-all',
                    grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Marquee Layout with autoplay + touch support
  return (
    <section className={cn('py-12 px-4 overflow-hidden', className)}>
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      >
        {/* Marquee Track */}
        <div
          className="flex w-max py-4 overflow-x-auto scrollbar-hide touch-pan-x"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            animation: isPaused || isEditing ? 'none' : 'marquee-logocloud 20s linear infinite',
          }}
        >
          {/* First set */}
          {filteredLogos.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="flex-shrink-0 w-[80px] sm:w-[100px] md:w-[120px] h-[50px] sm:h-[60px] md:h-[70px] mx-2 sm:mx-3 md:mx-4 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt || ''}
                className={cn(
                  'max-h-[40px] sm:max-h-[50px] md:max-h-[60px] w-auto object-contain transition-all',
                  grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                )}
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {filteredLogos.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="flex-shrink-0 w-[80px] sm:w-[100px] md:w-[120px] h-[50px] sm:h-[60px] md:h-[70px] mx-2 sm:mx-3 md:mx-4 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt || ''}
                className={cn(
                  'max-h-[40px] sm:max-h-[50px] md:max-h-[60px] w-auto object-contain transition-all',
                  grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                )}
              />
            </div>
          ))}
        </div>

        {/* CSS Animation Keyframes */}
        <style jsx>{`
          @keyframes marquee-logocloud {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </section>
  )
}
