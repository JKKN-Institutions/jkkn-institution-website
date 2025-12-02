'use client'

import { cn } from '@/lib/utils'
import type { GridLayoutProps } from '@/lib/cms/registry-types'

// Map column count to Tailwind class
const columnClassMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
}

const mdColumnClassMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
}

const lgColumnClassMap: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
}

// Map gap values to Tailwind classes
const gapClassMap: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
}

export default function GridLayout({
  columns = 3,
  gap = 4,
  responsive,
  children,
  className,
  isEditing,
}: GridLayoutProps) {
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true)

  // Use responsive settings if provided, otherwise fallback to columns prop
  const smCols = responsive?.sm ?? 1
  const mdCols = responsive?.md ?? Math.min(columns, 2)
  const lgCols = responsive?.lg ?? columns

  // Get gap class or fallback to style
  const gapClass = gapClassMap[gap] || undefined
  const gapStyle = gapClass ? undefined : { gap: `${gap * 0.25}rem` }

  return (
    <div
      className={cn(
        'grid w-full',
        // Base columns for small screens
        columnClassMap[smCols] || 'grid-cols-1',
        // Medium screen columns
        mdColumnClassMap[mdCols] || 'md:grid-cols-2',
        // Large screen columns
        lgColumnClassMap[lgCols] || 'lg:grid-cols-3',
        // Gap
        gapClass,
        className
      )}
      style={gapStyle}
    >
      {hasChildren ? (
        children
      ) : isEditing ? (
        <>
          {Array.from({ length: lgCols }).map((_, index) => (
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
