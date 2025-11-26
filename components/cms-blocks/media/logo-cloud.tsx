'use client'

import { cn } from '@/lib/utils'
import type { LogoCloudProps } from '@/lib/cms/registry-types'

export default function LogoCloud({
  logos = [],
  layout = 'grid',
  grayscale = true,
  columns = 6,
  className,
  isEditing,
}: LogoCloudProps) {
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

  return (
    <section className={cn('py-12 px-4', className)}>
      <div className="container mx-auto">
        <div
          className={cn(
            layout === 'grid' && 'grid items-center gap-8',
            layout === 'marquee' && 'flex items-center gap-12 overflow-x-auto'
          )}
          style={{
            ...(layout === 'grid' && {
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }),
          }}
        >
          {logos.map((logo, index) => {
            const LogoContent = (
              <img
                src={logo.src}
                alt={logo.alt || ''}
                className={cn(
                  'max-h-12 w-auto mx-auto object-contain transition-all',
                  grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
                )}
              />
            )

            if (logo.link) {
              return (
                <a
                  key={index}
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {LogoContent}
                </a>
              )
            }

            return (
              <div key={index} className="flex justify-center">
                {LogoContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
