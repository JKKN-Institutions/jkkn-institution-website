'use client'

import { cn } from '@/lib/utils'
import type { GridLayoutProps } from '@/lib/cms/registry-types'

export default function GridLayout({
  columns = 3,
  gap = 4,
  responsive = { sm: 1, md: 2, lg: 3 },
  children,
  className,
  isEditing,
}: GridLayoutProps) {
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true)

  return (
    <div
      className={cn(
        'grid',
        // Responsive columns
        responsive?.sm === 1 && 'grid-cols-1',
        responsive?.sm === 2 && 'grid-cols-2',
        responsive?.md === 2 && 'md:grid-cols-2',
        responsive?.md === 3 && 'md:grid-cols-3',
        responsive?.md === 4 && 'md:grid-cols-4',
        responsive?.lg === 3 && 'lg:grid-cols-3',
        responsive?.lg === 4 && 'lg:grid-cols-4',
        responsive?.lg === 5 && 'lg:grid-cols-5',
        responsive?.lg === 6 && 'lg:grid-cols-6',
        className
      )}
      style={{
        gap: `${gap * 0.25}rem`,
      }}
    >
      {hasChildren ? (
        children
      ) : isEditing ? (
        <>
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="min-h-[100px] p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center"
            >
              <p className="text-muted-foreground text-sm text-center">
                Column {index + 1}
              </p>
            </div>
          ))}
        </>
      ) : null}
    </div>
  )
}
