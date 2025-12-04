'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { StatsCounterProps, StatItem } from '@/lib/cms/registry-types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Animated counter hook
function useCountUp(
  end: number,
  duration: number = 2000,
  shouldAnimate: boolean = true
) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end)
      return
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)

      if (currentCount !== countRef.current) {
        countRef.current = currentCount
        setCount(currentCount)
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      startTimeRef.current = null
    }
  }, [end, duration, shouldAnimate])

  return count
}

// Single stat item component
function StatItemDisplay({
  stat,
  animate,
  showIcon,
  variant,
  isInView,
}: {
  stat: StatItem
  animate: boolean
  showIcon: boolean
  variant: 'default' | 'cards' | 'minimal'
  isInView: boolean
}) {
  // Parse numeric value from string
  const numericValue = parseInt(stat.value.replace(/[^0-9]/g, ''), 10) || 0
  const hasNonNumeric = /[^0-9]/.test(stat.value)

  const animatedValue = useCountUp(
    numericValue,
    2000,
    animate && isInView && !hasNonNumeric
  )

  // Get icon component
  const IconComponent = stat.icon
    ? (LucideIcons[stat.icon as keyof typeof LucideIcons] as LucideIcon)
    : null

  const displayValue = hasNonNumeric
    ? stat.value
    : `${stat.prefix || ''}${animatedValue.toLocaleString()}${stat.suffix || ''}`

  if (variant === 'minimal') {
    return (
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
          {displayValue}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
        {showIcon && IconComponent && (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          {displayValue}
        </div>
        <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex flex-col items-center text-center">
      {showIcon && IconComponent && (
        <IconComponent className="h-8 w-8 text-primary mb-2" />
      )}
      <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-primary">
        {displayValue}
      </div>
      <div className="text-sm md:text-base text-muted-foreground mt-2">
        {stat.label}
      </div>
    </div>
  )
}

export default function StatsCounter({
  stats = [],
  layout = 'row',
  columns = 4,
  animate = true,
  showIcons = true,
  variant = 'default',
  className,
}: StatsCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  // Intersection observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (stats.length === 0) {
    return (
      <div className={cn('py-12 text-center text-muted-foreground', className)}>
        No statistics to display. Add stats in the properties panel.
      </div>
    )
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }

  return (
    <div ref={containerRef} className={cn('py-12', className)}>
      <div
        className={cn(
          'grid gap-8',
          layout === 'row'
            ? 'flex flex-wrap justify-center md:justify-between'
            : gridCols[columns as keyof typeof gridCols]
        )}
      >
        {stats.map((stat, index) => (
          <div key={index} className={layout === 'row' ? 'px-4' : ''}>
            <StatItemDisplay
              stat={stat}
              animate={animate}
              showIcon={showIcons}
              variant={variant}
              isInView={isInView}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
