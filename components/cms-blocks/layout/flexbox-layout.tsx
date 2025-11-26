'use client'

import { cn } from '@/lib/utils'
import type { FlexboxLayoutProps } from '@/lib/cms/registry-types'

export default function FlexboxLayout({
  direction = 'row',
  justify = 'start',
  align = 'center',
  wrap = true,
  gap = 4,
  children,
  className,
  isEditing,
}: FlexboxLayoutProps) {
  const directionClasses = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    column: 'flex-col',
    'column-reverse': 'flex-col-reverse',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }

  const hasChildren = children && (Array.isArray(children) ? children.length > 0 : true)

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        wrap ? 'flex-wrap' : 'flex-nowrap',
        className
      )}
      style={{
        gap: `${gap * 0.25}rem`,
      }}
    >
      {hasChildren ? (
        children
      ) : isEditing ? (
        <div className="w-full min-h-[100px] p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Drop blocks here to create a flex layout
          </p>
        </div>
      ) : null}
    </div>
  )
}
