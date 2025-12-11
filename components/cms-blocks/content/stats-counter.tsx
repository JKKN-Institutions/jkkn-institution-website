'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useState, useRef } from 'react'
import { DecorativePatterns, CurveDivider } from '../shared/decorative-patterns'

/**
 * Stat item schema
 */
export const StatItemSchema = z.object({
  value: z.string().describe('Stat value (e.g., "25+", "5000+", "95%")'),
  label: z.string().describe('Stat label'),
})

export type StatItem = z.infer<typeof StatItemSchema>

/**
 * StatsCounter props schema
 */
export const StatsCounterPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Our').describe('First part of header'),
  headerPart2: z.string().default('Strength').describe('Second part of header (gold italic)'),
  subtitle: z.string().default('Numbers that speak volumes about our commitment to excellence').describe('Subtitle below header'),

  // Stats
  stats: z.array(StatItemSchema).default([]).describe('List of statistics'),

  // Tagline
  tagline: z.string().optional().describe('Bottom tagline (italic)'),

  // Layout
  columns: z.enum(['2', '3', '4', '6']).default('6').describe('Number of columns'),
  rows: z.enum(['1', '2']).default('2').describe('Number of rows (1 = single row, 2 = two rows)'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-dark').describe('Visual style'),
  showAnimation: z.boolean().default(true).describe('Animate numbers on scroll'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  showCurve: z.boolean().default(false).describe('Show curved bottom divider'),
})

export type StatsCounterProps = z.infer<typeof StatsCounterPropsSchema> & BaseBlockProps

/**
 * StatsCounter Component
 *
 * Displays key statistics in a modern grid layout with:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Animated number counting
 * - Glassmorphic card backgrounds
 * - Responsive grid
 */
export function StatsCounter({
  headerPart1 = 'Our',
  headerPart2 = 'Strength',
  subtitle = 'Numbers that speak volumes about our commitment to excellence',
  stats = [],
  tagline,
  columns = '6',
  rows = '2',
  variant = 'modern-dark',
  showAnimation = true,
  showDecorations = true,
  showCurve = false,
  className,
  isEditing,
}: StatsCounterProps) {
  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  // Grid classes based on rows setting
  const columnClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 lg:grid-cols-4',
    '6': rows === '1' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3',
  }

  const defaultStats: StatItem[] = [
    { value: '25', label: 'Years of Excellence' },
    { value: '15000', label: 'Students' },
    { value: '95', label: 'Placement Rate' },
    { value: '50', label: 'Courses Offered' },
    { value: '500', label: 'Expert Faculty' },
    { value: '100', label: 'Industry Partners' },
  ]

  const displayStats = stats.length > 0 ? stats : defaultStats

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden py-12 md:py-16 lg:py-20',
        isDark ? 'section-green-gradient' : 'bg-brand-cream',
        className
      )}
    >
      {/* Decorative Patterns */}
      {showDecorations && isModern && (
        <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />
      )}

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        {(headerPart1 || headerPart2) && (
          <div className="text-center mb-10 md:mb-14">
            <h2 className={cn(
              'font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              {headerPart1}{' '}
              <span className={isDark ? "text-gold-italic" : "text-green-accent"}>{headerPart2}</span>
            </h2>
            {subtitle && (
              <p className={cn(
                'text-base sm:text-lg md:text-xl max-w-3xl mx-auto',
                isDark ? 'text-white/70' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className={cn('grid gap-4 sm:gap-6 max-w-6xl mx-auto', columnClasses[columns])}>
          {displayStats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              isDark={isDark}
              animate={showAnimation && !isEditing}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Tagline */}
        {tagline && (
          <p className="text-center mt-12 text-lg md:text-xl font-serif-heading italic text-gold">
            {tagline}
          </p>
        )}
      </div>

      {/* Curved Bottom Divider */}
      {showCurve && (
        <CurveDivider position="bottom" color="#fbfbee" />
      )}
    </section>
  )
}

/**
 * Individual Stat Card with animated counter
 */
function StatCard({
  stat,
  isDark,
  animate,
  delay,
}: {
  stat: StatItem
  isDark: boolean
  animate: boolean
  delay: number
}) {
  const [displayValue, setDisplayValue] = useState(stat.value)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!animate) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [animate, isVisible])

  useEffect(() => {
    if (!animate || !isVisible) return

    const valueStr = String(stat.value || '')
    const match = valueStr.match(/^([\d,]+)(.*)$/)
    if (!match) {
      setDisplayValue(valueStr)
      return
    }

    const targetNum = parseInt(match[1].replace(/,/g, ''), 10)
    const suffix = match[2] || ''

    const duration = 2000
    const startTime = Date.now() + delay

    const animateCount = () => {
      const now = Date.now()
      const elapsed = now - startTime

      if (elapsed < 0) {
        requestAnimationFrame(animateCount)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentNum = Math.floor(targetNum * easeOut)

      setDisplayValue(currentNum.toLocaleString() + suffix)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    requestAnimationFrame(animateCount)
  }, [animate, isVisible, stat.value, delay])

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:scale-105',
        isDark ? 'glass-card-dark' : 'glass-card'
      )}
    >
      <div className={cn(
        'stat-number mb-2',
        isDark ? 'text-white' : 'text-brand-primary'
      )}>
        {displayValue}
        {!displayValue.includes('%') && !displayValue.includes('+') && '+'}
      </div>
      <div className={cn(
        'stat-label',
        isDark ? 'text-white/70' : 'text-gray-600'
      )}>
        {stat.label}
      </div>
    </div>
  )
}

export default StatsCounter
