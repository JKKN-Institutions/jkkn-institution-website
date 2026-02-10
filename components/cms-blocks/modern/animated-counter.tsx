'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DEFAULT_COLOR_SCHEME } from '@/lib/cms/brand-colors'

/**
 * Individual counter item schema
 */
export const CounterItemSchema = z.object({
  value: z.number().describe('Target number to count to'),
  label: z.string().describe('Label below the number'),
  prefix: z.string().optional().describe('Text before number (e.g., "$", "Rs.")'),
  suffix: z.string().optional().describe('Text after number (e.g., "+", "%", "K")'),
  icon: z.string().optional().describe('Lucide icon name'),
  description: z.string().optional().describe('Optional description text'),
})

export type CounterItem = z.infer<typeof CounterItemSchema>

/**
 * AnimatedCounter props schema
 */
export const AnimatedCounterPropsSchema = z.object({
  // Content
  title: z.string().optional().describe('Section title'),
  subtitle: z.string().optional().describe('Section subtitle'),
  counters: z.array(CounterItemSchema).default([]).describe('Counter items'),

  // Layout
  layout: z.enum(['row', 'grid', 'cards']).default('row').describe('Layout style'),
  columns: z.number().min(2).max(6).default(4).describe('Number of columns for grid layout'),
  alignment: z.enum(['left', 'center', 'right']).default('center').describe('Text alignment'),

  // Animation
  animationDuration: z.number().min(500).max(5000).default(2000).describe('Count animation duration in ms'),
  animateOnScroll: z.boolean().default(true).describe('Animate when scrolled into view'),
  staggerDelay: z.number().min(0).max(500).default(100).describe('Delay between each counter animation'),

  // Styling
  variant: z.enum(['default', 'glass', 'gradient', 'minimal']).default('default').describe('Visual style'),
  colorScheme: z.enum(['brand', 'dark', 'light', 'custom']).default('brand').describe('Color scheme'),
  numberColor: z.string().default(DEFAULT_COLOR_SCHEME.primary).describe('Number text color'),
  labelColor: z.string().default(DEFAULT_COLOR_SCHEME.textMuted).describe('Label text color'),
  backgroundColor: z.string().default('transparent').describe('Background color'),
  showDividers: z.boolean().default(false).describe('Show dividers between items'),
  iconColor: z.string().default(DEFAULT_COLOR_SCHEME.primary).describe('Icon color'),
})

export type AnimatedCounterProps = z.infer<typeof AnimatedCounterPropsSchema> & BaseBlockProps

/**
 * Custom hook for counting animation
 */
function useCountAnimation(
  targetValue: number,
  duration: number,
  shouldStart: boolean
) {
  const [currentValue, setCurrentValue] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)

    setCurrentValue(Math.floor(easeOutQuart * targetValue))

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [duration, targetValue])

  useEffect(() => {
    if (shouldStart) {
      startTimeRef.current = null
      rafRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [shouldStart, animate])

  return currentValue
}

/**
 * Individual Counter Display Component
 */
function CounterDisplay({
  item,
  index,
  duration,
  shouldAnimate,
  staggerDelay,
  variant,
  numberColor,
  labelColor,
  iconColor,
  showDivider,
}: {
  item: CounterItem
  index: number
  duration: number
  shouldAnimate: boolean
  staggerDelay: number
  variant: AnimatedCounterProps['variant']
  numberColor: string
  labelColor: string
  iconColor: string
  showDivider: boolean
}) {
  const [hasStarted, setHasStarted] = useState(false)

  // Stagger the animation start
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setHasStarted(true)
      }, index * staggerDelay)
      return () => clearTimeout(timer)
    }
  }, [shouldAnimate, index, staggerDelay])

  const displayValue = useCountAnimation(item.value, duration, hasStarted)

  // Get Lucide icon component
  const IconComponent = item.icon
    ? (LucideIcons as unknown as Record<string, LucideIcon>)[item.icon]
    : null

  // Format number with commas
  const formattedValue = displayValue.toLocaleString()

  const cardClasses = cn(
    'flex flex-col items-center justify-center p-6 transition-all duration-300',
    variant === 'glass' && 'bg-white/10 backdrop-blur-md rounded-2xl border border-white/20',
    variant === 'gradient' && 'bg-gradient-to-br from-white/20 to-white/5 rounded-2xl',
    variant === 'minimal' && 'bg-transparent'
  )

  return (
    <>
      <div className={cardClasses}>
        {/* Icon */}
        {IconComponent && (
          <div
            className="mb-4 p-3 rounded-full bg-opacity-10"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <IconComponent
              className="h-8 w-8"
              style={{ color: iconColor }}
            />
          </div>
        )}

        {/* Number */}
        <div
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          style={{ color: numberColor }}
        >
          {item.prefix}
          {formattedValue}
          {item.suffix}
        </div>

        {/* Label */}
        <div
          className="mt-2 text-sm md:text-base font-medium uppercase tracking-wider"
          style={{ color: labelColor }}
        >
          {item.label}
        </div>

        {/* Description */}
        {item.description && (
          <p
            className="mt-2 text-sm opacity-70 text-center max-w-[200px]"
            style={{ color: labelColor }}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Divider */}
      {showDivider && (
        <div
          className="hidden md:block w-px h-24 self-center"
          style={{ backgroundColor: `${labelColor}30` }}
        />
      )}
    </>
  )
}

/**
 * AnimatedCounter Component
 *
 * Displays animated counting numbers - perfect for statistics and achievements.
 * Features:
 * - Smooth counting animation from 0 to target
 * - Scroll-triggered animation
 * - Multiple layout options (row, grid, cards)
 * - Brand color integration
 * - Icon support
 */
export function AnimatedCounter({
  title,
  subtitle,
  counters = [],
  layout = 'row',
  columns = 4,
  alignment = 'center',
  animationDuration = 2000,
  animateOnScroll = true,
  staggerDelay = 100,
  variant = 'default',
  colorScheme = 'brand',
  numberColor = DEFAULT_COLOR_SCHEME.primary,
  labelColor = DEFAULT_COLOR_SCHEME.textMuted,
  backgroundColor = 'transparent',
  showDividers = false,
  iconColor = DEFAULT_COLOR_SCHEME.primary,
  className,
  isEditing,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!animateOnScroll)

  // Apply color scheme presets
  const getColorSchemeColors = () => {
    switch (colorScheme) {
      case 'brand':
        return {
          number: '#0b6d41',
          label: '#4a4a4a',
          icon: '#0b6d41',
          bg: '#fbfbee',
        }
      case 'dark':
        return {
          number: '#ffffff',
          label: '#a0a0a0',
          icon: '#ffde59',
          bg: '#171717',
        }
      case 'light':
        return {
          number: '#171717',
          label: '#6b7280',
          icon: '#0b6d41',
          bg: '#ffffff',
        }
      default:
        return {
          number: numberColor,
          label: labelColor,
          icon: iconColor,
          bg: backgroundColor,
        }
    }
  }

  const colors = getColorSchemeColors()

  // Intersection Observer for scroll animation
  useEffect(() => {
    if (!animateOnScroll || !containerRef.current) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Delay state update to next frame to batch reflows
            requestAnimationFrame(() => {
              setIsVisible(true)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [animateOnScroll])

  // If in editor, show static values
  const shouldAnimate = isVisible && !isEditing

  // Layout classes
  const layoutClasses = cn(
    'w-full',
    layout === 'row' && 'flex flex-wrap justify-center items-center gap-8 md:gap-12',
    layout === 'grid' && `grid gap-6`,
    layout === 'cards' && 'grid gap-6'
  )

  const gridColumns = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  return (
    <section
      ref={containerRef}
      className={cn('py-16 px-4', className)}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className={cn('mb-12', alignmentClasses[alignment])}>
            {title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.number }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-lg max-w-2xl"
                style={{ color: colors.label }}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Counters */}
        <div
          className={cn(
            layoutClasses,
            layout !== 'row' && gridColumns[columns as keyof typeof gridColumns]
          )}
        >
          {counters.map((counter, index) => (
            <CounterDisplay
              key={index}
              item={counter}
              index={index}
              duration={animationDuration}
              shouldAnimate={shouldAnimate}
              staggerDelay={staggerDelay}
              variant={variant}
              numberColor={colors.number}
              labelColor={colors.label}
              iconColor={colors.icon}
              showDivider={showDividers && index < counters.length - 1 && layout === 'row'}
            />
          ))}
        </div>

        {/* Empty state for editor */}
        {counters.length === 0 && isEditing && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Add counter items to display animated statistics</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default AnimatedCounter
