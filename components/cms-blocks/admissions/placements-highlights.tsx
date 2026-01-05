'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { PlacementsHighlightsProps } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
} from './shared/admission-glass-styles'

// Intersection Observer hook
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Animated counter component
function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  isInView,
  delay = 0,
}: {
  value: string
  prefix?: string
  suffix?: string
  isInView: boolean
  delay?: number
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
  const isDecimal = value.includes('.')

  useEffect(() => {
    if (!isInView) return

    const timeout = setTimeout(() => {
      const duration = 2000
      const steps = 60
      const increment = numericValue / steps
      let current = 0
      let step = 0

      const timer = setInterval(() => {
        step++
        // Easing function for smooth animation
        const progress = step / steps
        const easeOut = 1 - Math.pow(1 - progress, 3)
        current = numericValue * easeOut

        setDisplayValue(current)

        if (step >= steps) {
          setDisplayValue(numericValue)
          clearInterval(timer)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isInView, numericValue, delay])

  const formattedValue = isDecimal
    ? displayValue.toFixed(1)
    : Math.round(displayValue).toLocaleString()

  return (
    <span>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}

export default function PlacementsHighlights({
  badge = 'PLACEMENTS',
  title = 'Placement Highlights',
  titleAccentWord = 'Placement',
  subtitle = 'From campus to career — JKKN Learners are recruited by top companies across industries.',
  stats = [],
  recruitersText = '',
  showCTA = true,
  ctaText = 'View Complete Placement Records',
  ctaLink = '/placements/',
  backgroundColor = 'gradient-light',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: PlacementsHighlightsProps) {
  const sectionRef = useInView()
  const statsRef = useInView()

  const isDark = isDarkBackground(backgroundColor)

  // Parse title for accent word styling
  const titleParts = useMemo(() => {
    if (!titleAccentWord || !title.includes(titleAccentWord)) {
      return { before: title, accent: '', after: '' }
    }
    const parts = title.split(titleAccentWord)
    return {
      before: parts[0] || '',
      accent: titleAccentWord,
      after: parts[1] || '',
    }
  }, [title, titleAccentWord])

  // Empty state for editing
  if (stats.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-center">Click to add placement stats</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative py-16 md:py-24 overflow-hidden', backgroundStyles[backgroundColor], className)}
    >
      {/* Decorative Patterns */}
      <DecorativePatterns variant="scattered" color={isDark ? 'white' : 'green'} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            'max-w-4xl mx-auto text-center mb-12 lg:mb-16',
            showAnimations && 'transition-all duration-700',
            showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {/* Badge */}
          {badge && (
            <div className="flex justify-center mb-4">
              <span
                className={cn(
                  'inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase',
                  isDark
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                )}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2
            className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ color: titleColor || (isDark ? '#ffffff' : '#0b6d41') }}
          >
            {titleParts.before}
            {titleParts.accent && (
              <span style={{ color: accentColor }}>{titleParts.accent}</span>
            )}
            {titleParts.after}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-lg md:text-xl max-w-3xl mx-auto"
              style={{ color: subtitleColor || (isDark ? 'rgba(255,255,255,0.7)' : '#6b7280') }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef.ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-5xl mx-auto mb-10"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                'group relative text-center',
                isDark ? glassStyles.card : glassStyles.cardLight,
                isDark ? glassStyles.cardHover : 'hover:shadow-xl transition-all duration-300',
                'p-6 md:p-8',
                showAnimations && 'transition-all duration-700',
                showAnimations && statsRef.isInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{
                transitionDelay: showAnimations ? getStaggerDelay(index, 100) : '0ms',
              }}
            >
              {/* Value */}
              <div
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                style={{ color: accentColor }}
              >
                {showAnimations ? (
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    isInView={statsRef.isInView}
                    delay={index * 100}
                  />
                ) : (
                  <>
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </>
                )}
              </div>

              {/* Label */}
              <p
                className={cn(
                  'text-sm md:text-base',
                  isDark ? 'text-white/70' : 'text-gray-600'
                )}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Recruiters Text */}
        {recruitersText && (
          <div
            className={cn(
              'text-center mb-10',
              isDark ? glassStyles.card : glassStyles.cardLight,
              'p-6 max-w-4xl mx-auto',
              showAnimations && 'transition-all duration-700 delay-500',
              showAnimations && (statsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
            )}
          >
            <p
              className={cn(
                'text-sm md:text-base leading-relaxed',
                isDark ? 'text-white/80' : 'text-gray-700'
              )}
            >
              {recruitersText}
            </p>
          </div>
        )}

        {/* CTA Button */}
        {showCTA && (
          <div
            className={cn(
              'flex justify-center',
              showAnimations && 'transition-all duration-700 delay-700',
              showAnimations && (statsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
            )}
          >
            <Link
              href={ctaLink}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-full',
                'font-semibold text-base',
                'border-2 transition-all duration-300',
                'hover:scale-105 hover:shadow-lg',
                isDark
                  ? 'border-white/30 text-white hover:bg-white/10'
                  : 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
              )}
            >
              {ctaText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
