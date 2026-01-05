'use client'

import { cn } from '@/lib/utils'
import type { SectionWrapperProps } from '@/lib/cms/registry-types'

export default function SectionWrapper({
  background,
  backgroundImage,
  backgroundImageAlt = '',
  padding = '16',
  fullWidth = true,
  id,
  children,
  className,
  isEditing,
}: SectionWrapperProps) {
  // Note: backgroundImageAlt is available for accessibility documentation
  // CSS background images don't support alt text natively
  void backgroundImageAlt
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true)

  // Build background style without mixing shorthand and non-shorthand properties
  const backgroundStyle: React.CSSProperties = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: background || undefined,
      }
    : {
        backgroundColor: background || undefined,
      }

  return (
    <section
      id={id}
      className={cn(
        'relative',
        className
      )}
      style={{
        padding: `${Number(padding) * 0.25}rem 0`,
        ...backgroundStyle,
      }}
    >
      {/* Content */}
      <div
        className={cn(
          'relative z-10',
          fullWidth ? 'w-full' : 'container mx-auto px-4'
        )}
      >
        {hasChildren ? (
          children
        ) : isEditing ? (
          <div className="min-h-[150px] p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Drop blocks here to build this section
            </p>
          </div>
        ) : (
          <div className="min-h-[20px]" />
        )}
      </div>
    </section>
  )
}
