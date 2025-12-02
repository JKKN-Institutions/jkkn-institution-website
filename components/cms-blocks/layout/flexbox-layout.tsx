'use client'

import { cn } from '@/lib/utils'
import type { FlexboxLayoutProps } from '@/lib/cms/registry-types'

const directionClasses: Record<string, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
}

const justifyClasses: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
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

export default function FlexboxLayout({
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = true,
  gap = 4,
  children,
  className,
  isEditing,
}: FlexboxLayoutProps) {
  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true)

  // Get gap class or fallback to style
  const gapClass = gapClassMap[gap] || undefined
  const gapStyle = gapClass ? undefined : { gap: `${gap * 0.25}rem` }

  // Apply flex-1 to direct children when in row direction
  const isRowDirection = direction === 'row' || direction === 'row-reverse'
  const childrenClass = isRowDirection ? '[&>*]:flex-1 [&>*]:min-w-0' : ''

  return (
    <div
      className={cn(
        'flex w-full',
        directionClasses[direction] || 'flex-row',
        justifyClasses[justify] || 'justify-start',
        alignClasses[align] || 'items-stretch',
        wrap ? 'flex-wrap' : 'flex-nowrap',
        gapClass,
        childrenClass,
        className
      )}
      style={gapStyle}
    >
      {hasChildren ? (
        children
      ) : isEditing ? (
        <>
          {/* Show placeholder columns in editing mode */}
          <div className="flex-1 min-h-[100px] p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm text-center">Item 1</p>
          </div>
          <div className="flex-1 min-h-[100px] p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm text-center">Item 2</p>
          </div>
        </>
      ) : null}
    </div>
  )
}
