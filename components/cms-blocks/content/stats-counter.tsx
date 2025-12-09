'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useState, useRef } from 'react'

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
  headerPart2: z.string().default('Strength').describe('Second part of header'),
  headerPart1Color: z.string().default('#ffffff').describe('Color for first part'),
  headerPart2Color: z.string().default('#ffde59').describe('Color for second part (yellow)'),
  headerPart2Italic: z.boolean().default(true).describe('Make second part italic'),
  subtitle: z.string().default('Numbers that speak volumes about our commitment to excellence').describe('Subtitle below header'),

  // Stats
  stats: z.array(StatItemSchema).default([]).describe('List of statistics'),

  // Tagline
  tagline: z.string().optional().describe('Bottom tagline (italic)'),

  // Layout
  columns: z.enum(['2', '3', '4', '6']).default('6').describe('Number of columns'),

  // Styling
  backgroundColor: z.string().default('#0b6d41').describe('Section background color'),
  backgroundGradient: z.boolean().default(true).describe('Use gradient background'),
  gradientFrom: z.string().default('#0b6d41').describe('Gradient start color'),
  gradientTo: z.string().default('#1a8f5c').describe('Gradient end color'),
  statValueColor: z.string().default('#ffffff').describe('Stat value color'),
  statLabelColor: z.string().default('#ffffff').describe('Stat label color'),
  cardBackgroundColor: z.string().default('rgba(255,255,255,0.1)').describe('Card background'),
  showAnimation: z.boolean().default(true).describe('Animate numbers on scroll'),
  showDecorations: z.boolean().default(true).describe('Show decorative circles'),
  rows: z.enum(['1', '2']).default('2').describe('Number of rows (1 = single row, 2 = two rows)'),
})

export type StatsCounterProps = z.infer<typeof StatsCounterPropsSchema> & BaseBlockProps

/**
 * Decorative Circles Component
 */
function DecorativeCircles() {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-64 overflow-hidden pointer-events-none">
      {/* Large circle */}
      <div
        className="absolute -left-32 top-1/4 w-64 h-64 rounded-full border-2 border-white/20"
        style={{ transform: 'translateY(-50%)' }}
      />
      {/* Medium circle */}
      <div
        className="absolute -left-20 top-1/2 w-48 h-48 rounded-full border-2 border-white/15"
        style={{ transform: 'translateY(-30%)' }}
      />
      {/* Small circle */}
      <div
        className="absolute -left-10 top-2/3 w-32 h-32 rounded-full border-2 border-white/10"
      />
    </div>
  )
}

/**
 * StatsCounter Component
 *
 * Displays key statistics in a grid layout with:
 * - Split-color header with optional italic
 * - Decorative circles on left side
 * - Animated number counting
 * - Responsive grid
 * - Tagline at bottom
 */
export function StatsCounter({
  headerPart1 = 'Our',
  headerPart2 = 'Strength',
  headerPart1Color = '#ffffff',
  headerPart2Color = '#ffde59',
  headerPart2Italic = true,
  subtitle = 'Numbers that speak volumes about our commitment to excellence',
  stats = [],
  tagline,
  columns = '6',
  backgroundColor = '#0b6d41',
  backgroundGradient = true,
  gradientFrom = '#0b6d41',
  gradientTo = '#1a8f5c',
  statValueColor = '#ffffff',
  statLabelColor = '#ffffff',
  cardBackgroundColor = 'rgba(255,255,255,0.1)',
  showAnimation = true,
  showDecorations = true,
  rows = '2',
  className,
  isEditing,
}: StatsCounterProps) {
  // Generate background style
  const backgroundStyle = backgroundGradient
    ? { background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }
    : { backgroundColor }
  // Grid classes based on rows setting
  // rows='1' = all in one row (6 columns), rows='2' = two rows (3 columns each)
  const getGridClass = () => {
    if (rows === '1') {
      return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' // Single row on desktop
    }
    // Default: 2 rows (3 columns each)
    return 'grid-cols-2 sm:grid-cols-3' // 3 columns = 2 rows for 6 items
  }

  const columnClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 lg:grid-cols-4',
    '6': rows === '1' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3',
    'auto': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6',
  }

  const defaultStats: StatItem[] = [
    { value: '25+', label: 'Years of Excellence' },
    { value: '5000+', label: 'Students' },
    { value: '95%', label: 'Placement Rate' },
    { value: '50+', label: 'Courses Offered' },
    { value: '200+', label: 'Expert Faculty' },
    { value: '500+', label: 'Industry Partners' },
  ]

  // Always show default stats if empty (not just in editing mode)
  const displayStats = stats.length > 0 ? stats : defaultStats

  return (
    <section
      className={cn('py-8 sm:py-10 md:py-12 lg:py-16 w-full relative overflow-hidden', className)}
      style={backgroundStyle}
    >
      {/* Decorative Circles */}
      {showDecorations && <DecorativeCircles />}

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 relative z-10">
        {/* Header */}
        {(headerPart1 || headerPart2) && (
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
              <span
                className={headerPart2Italic ? 'italic' : ''}
                style={{ color: headerPart2Color }}
              >
                {headerPart2}
              </span>
            </h2>
            {subtitle && (
              <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: statLabelColor, opacity: 0.9 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className={cn('grid gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto', columnClasses[columns])}>
          {displayStats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              valueColor={statValueColor}
              labelColor={statLabelColor}
              cardBg={cardBackgroundColor}
              animate={showAnimation && !isEditing}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Tagline */}
        {tagline && (
          <p
            className="text-center mt-12 text-lg md:text-xl italic"
            style={{ color: headerPart2Color }}
          >
            {tagline}
          </p>
        )}
      </div>
    </section>
  )
}

/**
 * Individual Stat Card with animated counter
 */
function StatCard({
  stat,
  valueColor,
  labelColor,
  cardBg,
  animate,
  delay,
}: {
  stat: StatItem
  valueColor: string
  labelColor: string
  cardBg: string
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

    // Ensure stat.value is a string
    const valueStr = String(stat.value || '')

    // Parse the value to extract number and suffix
    const match = valueStr.match(/^([\d,]+)(.*)$/)
    if (!match) {
      setDisplayValue(valueStr)
      return
    }

    const targetNum = parseInt(match[1].replace(/,/g, ''), 10)
    const suffix = match[2] || ''

    // Animate counting
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
      className="rounded-xl p-4 sm:p-6 md:p-8 text-center transition-transform duration-300 hover:scale-105"
      style={{ backgroundColor: cardBg }}
    >
      <div
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 sm:mb-2 md:mb-3"
        style={{ color: valueColor }}
      >
        {displayValue}
      </div>
      <div
        className="text-sm sm:text-base md:text-lg font-medium"
        style={{ color: labelColor }}
      >
        {stat.label}
      </div>
    </div>
  )
}

export default StatsCounter
