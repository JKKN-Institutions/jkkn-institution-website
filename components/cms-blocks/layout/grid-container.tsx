'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface GridContainerProps {
  /**
   * Number of columns in the grid (default: 2)
   */
  columns?: number

  /**
   * Gap between grid items (default: '2rem')
   */
  gap?: string

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Children to render in grid
   */
  children: ReactNode

  /**
   * Responsive breakpoint for stacking (default: 'md')
   */
  breakpoint?: 'sm' | 'md' | 'lg'

  /**
   * Edit mode flag
   */
  isEditing?: boolean

  /**
   * Block ID for edit mode
   */
  id?: string
}

export default function GridContainer({
  columns = 2,
  gap = '2rem',
  className,
  children,
  breakpoint = 'md',
  isEditing,
  id,
}: GridContainerProps) {
  // Responsive grid classes based on breakpoint
  const gridClasses = cn(
    // Base: Single column on mobile
    'grid grid-cols-1',
    // Breakpoint-based multi-column
    breakpoint === 'sm' && columns === 2 && 'sm:grid-cols-2',
    breakpoint === 'md' && columns === 2 && 'md:grid-cols-2',
    breakpoint === 'lg' && columns === 2 && 'lg:grid-cols-2',
    breakpoint === 'sm' && columns === 3 && 'sm:grid-cols-3',
    breakpoint === 'md' && columns === 3 && 'md:grid-cols-3',
    breakpoint === 'lg' && columns === 3 && 'lg:grid-cols-3',
    breakpoint === 'sm' && columns === 4 && 'sm:grid-cols-4',
    breakpoint === 'md' && columns === 4 && 'md:grid-cols-4',
    breakpoint === 'lg' && columns === 4 && 'lg:grid-cols-4',
    // Width constraints
    'w-full max-w-7xl mx-auto',
    // Padding
    'px-4 sm:px-6 lg:px-8',
    className
  )

  return (
    <div
      className={gridClasses}
      style={{ gap }}
      data-block-id={id}
    >
      {children}
    </div>
  )
}
