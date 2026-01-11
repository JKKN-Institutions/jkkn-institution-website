'use client'

import { cn } from '@/lib/utils'

interface DecorativeCircleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right'
  opacity?: number
  className?: string
  animate?: boolean
}

const sizeMap = {
  sm: 'w-32 h-32 md:w-48 md:h-48',
  md: 'w-48 h-48 md:w-64 md:h-64',
  lg: 'w-64 h-64 md:w-96 md:h-96',
  xl: 'w-80 h-80 md:w-[500px] md:h-[500px]',
}

const positionMap = {
  'top-left': '-top-16 -left-16 md:-top-24 md:-left-24',
  'top-right': '-top-16 -right-16 md:-top-24 md:-right-24',
  'bottom-left': '-bottom-16 -left-16 md:-bottom-24 md:-left-24',
  'bottom-right': '-bottom-16 -right-16 md:-bottom-24 md:-right-24',
  'center-left': 'top-1/2 -translate-y-1/2 -left-16 md:-left-32',
  'center-right': 'top-1/2 -translate-y-1/2 -right-16 md:-right-32',
}

/**
 * Single decorative circle
 */
export function DecorativeCircle({
  size = 'md',
  position = 'top-right',
  opacity = 0.05,
  className,
  animate = false,
}: DecorativeCircleProps) {
  // Background decorations removed as per user request
  return null
}

/**
 * Multiple decorative circles pattern
 */
interface DecorativePatternsProps {
  variant?: 'default' | 'dense' | 'minimal' | 'scattered'
  color?: 'white' | 'gold' | 'green' | 'blue'
  className?: string
}

export function DecorativePatterns({
  variant = 'default',
  color = 'white',
  className,
}: DecorativePatternsProps) {
  // Background decorations removed as per user request
  return null
}

/**
 * Curved wave divider for section transitions
 */
interface CurveDividerProps {
  position?: 'top' | 'bottom'
  color?: string
  className?: string
}

export function CurveDivider({
  position = 'bottom',
  color = '#fbfbee',
  className,
}: CurveDividerProps) {
  if (position === 'top') {
    return (
      <div className={cn('absolute top-0 left-0 right-0 w-full overflow-hidden', className)} aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-16 lg:h-20"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80L60 73.3C120 66.7 240 53.3 360 48C480 42.7 600 45.3 720 50.7C840 56 960 64 1080 64C1200 64 1320 56 1380 52L1440 48V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V80Z"
            fill={color}
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('absolute bottom-0 left-0 right-0 w-full overflow-hidden', className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-12 md:h-16 lg:h-20"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0L60 6.7C120 13.3 240 26.7 360 32C480 37.3 600 34.7 720 29.3C840 24 960 16 1080 16C1200 16 1320 24 1380 28L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V0Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

/**
 * Gold ring border for profile images
 */
interface GoldRingProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  glowEffect?: boolean
}

const ringSizeMap = {
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-2',
  xl: 'p-2.5',
}

export function GoldRing({
  children,
  size = 'md',
  className,
  glowEffect = false,
}: GoldRingProps) {
  return (
    <div
      className={cn(
        'rounded-full',
        ringSizeMap[size],
        glowEffect && 'animate-glow',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #ffde59 0%, #ffd700 50%, #ffde59 100%)',
      }}
    >
      <div className="rounded-full bg-[#085032] p-0.5">
        {children}
      </div>
    </div>
  )
}

/**
 * Section heading with gold accent
 */
interface SectionHeadingProps {
  title: string
  accentWord?: string
  subtitle?: string
  badge?: string
  align?: 'left' | 'center' | 'right'
  light?: boolean
  className?: string
}

export function SectionHeading({
  title,
  accentWord,
  subtitle,
  badge,
  align = 'center',
  light = true,
  className,
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // If accentWord is provided, split the title and wrap the accent word
  const renderTitle = () => {
    if (!accentWord) {
      return title
    }

    const parts = title.split(accentWord)
    if (parts.length === 1) {
      return title
    }

    return (
      <>
        {parts[0]}
        <span className="text-gold-italic">{accentWord}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <div className={cn(alignClass[align], className)}>
      {badge && (
        <div className={cn('mb-4', align === 'center' && 'flex justify-center')}>
          <span className="badge-gold">{badge}</span>
        </div>
      )}
      <h2
        className={cn(
          'font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight',
          light ? 'text-white' : 'text-gray-900'
        )}
      >
        {renderTitle()}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-base sm:text-lg max-w-2xl',
            light ? 'text-white/80' : 'text-gray-600',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default DecorativePatterns
