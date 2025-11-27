'use client'

import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: React.ReactNode
  columns?: {
    default?: 1 | 2 | 3 | 4 | 5 | 6
    sm?: 1 | 2 | 3 | 4 | 5 | 6
    md?: 1 | 2 | 3 | 4 | 5 | 6
    lg?: 1 | 2 | 3 | 4 | 5 | 6
    xl?: 1 | 2 | 3 | 4 | 5 | 6
  }
  gap?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Responsive Grid Component
 *
 * A grid component that automatically adjusts columns based on screen size.
 *
 * Usage:
 * ```tsx
 * <ResponsiveGrid columns={{ default: 1, sm: 2, lg: 3 }}>
 *   <Card />
 *   <Card />
 *   <Card />
 * </ResponsiveGrid>
 * ```
 */
export function ResponsiveGrid({
  children,
  columns = { default: 1, sm: 2, lg: 3 },
  gap = 'md',
  className,
}: ResponsiveGridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 lg:gap-6',
    lg: 'gap-4 sm:gap-6 lg:gap-8',
  }

  const buildColumnClasses = () => {
    const classes: string[] = []

    if (columns.default) classes.push(columnClasses[columns.default])
    if (columns.sm) classes.push(`sm:${columnClasses[columns.sm]}`)
    if (columns.md) classes.push(`md:${columnClasses[columns.md]}`)
    if (columns.lg) classes.push(`lg:${columnClasses[columns.lg]}`)
    if (columns.xl) classes.push(`xl:${columnClasses[columns.xl]}`)

    return classes.join(' ')
  }

  return (
    <div
      className={cn('grid', buildColumnClasses(), gapClasses[gap], className)}
    >
      {children}
    </div>
  )
}

interface ResponsiveStackProps {
  children: React.ReactNode
  direction?: 'vertical' | 'horizontal' | 'responsive'
  gap?: 'none' | 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  className?: string
}

/**
 * Responsive Stack Component
 *
 * Flexbox stack that can change direction based on screen size.
 *
 * Usage:
 * ```tsx
 * <ResponsiveStack direction="responsive">
 *   <Item />
 *   <Item />
 * </ResponsiveStack>
 * ```
 */
export function ResponsiveStack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className,
}: ResponsiveStackProps) {
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
    responsive: 'flex-col sm:flex-row',
  }

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-6',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Responsive Container Component
 *
 * A container with responsive max-width and padding.
 */
export function ResponsiveContainer({
  children,
  size = 'lg',
  padding = 'md',
  className,
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }

  const paddingClasses = {
    none: '',
    sm: 'px-3 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 lg:px-8 xl:px-12',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveSectionProps {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Responsive Section Component
 *
 * A section with responsive vertical padding.
 */
export function ResponsiveSection({
  children,
  padding = 'md',
  className,
}: ResponsiveSectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8 lg:py-12',
    lg: 'py-8 sm:py-12 lg:py-16',
    xl: 'py-12 sm:py-16 lg:py-24',
  }

  return (
    <section className={cn(paddingClasses[padding], className)}>
      {children}
    </section>
  )
}
