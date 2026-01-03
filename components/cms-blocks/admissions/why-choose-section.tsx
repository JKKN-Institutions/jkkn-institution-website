'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Building2,
  GraduationCap,
  Users,
  Factory,
  Briefcase,
  Star,
  Award,
  Heart,
  Trophy,
  Lightbulb,
  Target,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { WhyChooseSectionProps } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
} from './shared/admission-glass-styles'

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  GraduationCap,
  Users,
  Factory,
  Briefcase,
  Star,
  Award,
  Heart,
  Trophy,
  Lightbulb,
  Target,
  Shield,
}

// Get icon component
function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Star
}

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

export default function WhyChooseSection({
  badge = 'WHY CHOOSE JKKN?',
  title = 'Why Choose JKKN?',
  titleAccentWord = 'JKKN',
  subtitle = 'Discover what makes J.K.K. Nattraja Educational Institutions the preferred choice for thousands of Learners every year.',
  features = [],
  columns = '3',
  backgroundColor = 'gradient-light',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: WhyChooseSectionProps) {
  const sectionRef = useInView()
  const gridRef = useInView()

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

  // Grid column classes
  const gridColClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  // Empty state for editing
  if (features.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-center">Click to add features</p>
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
            style={{ color: titleColor || (isDark ? '#ffffff' : '#1f2937') }}
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

        {/* Features Grid */}
        <div
          ref={gridRef.ref}
          className={cn('grid gap-6 lg:gap-8 max-w-6xl mx-auto', gridColClasses[columns])}
        >
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon)

            return (
              <div
                key={index}
                className={cn(
                  'group relative',
                  isDark ? glassStyles.card : glassStyles.cardLight,
                  isDark ? glassStyles.cardHover : 'hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
                  'p-6 md:p-8'
                )}
                style={{
                  transitionDelay: showAnimations ? getStaggerDelay(index) : '0ms',
                }}
              >
                {/* Animated background - only on dark */}
                {isDark && showAnimations && (
                  <div
                    className={cn(
                      'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                      'bg-gradient-to-br from-white/5 to-transparent'
                    )}
                  />
                )}

                {/* Icon with gradient background */}
                <div
                  className={cn(
                    'relative w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-5',
                    'bg-gradient-to-br shadow-lg'
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${isDark ? '#0b6d41' : '#1e3a5f'})`,
                  }}
                >
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    'font-semibold text-lg md:text-xl mb-3',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className={cn(
                    'text-sm md:text-base leading-relaxed',
                    isDark ? 'text-white/70' : 'text-gray-600'
                  )}
                >
                  {feature.description}
                </p>

                {/* Decorative corner accent */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 opacity-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${accentColor}, transparent 70%)`,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
