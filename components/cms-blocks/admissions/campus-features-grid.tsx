'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Home, UtensilsCrossed, BookOpen, FlaskConical,
  Trophy, HeartPulse, Bus, ShieldCheck,
  Wifi, Music2, GraduationCap, Dumbbell,
  type LucideIcon,
} from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { CampusFeaturesGridProps } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
} from './shared/admission-glass-styles'

// Icon map — add more as needed
const ICON_MAP: Record<string, LucideIcon> = {
  Home, UtensilsCrossed, BookOpen, FlaskConical,
  Trophy, HeartPulse, Bus, ShieldCheck,
  Wifi, Music2, GraduationCap, Dumbbell,
}

function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Home
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

export default function CampusFeaturesGrid({
  badge = 'CAMPUS LIFE',
  title = 'Campus Life at JKKN',
  titleAccentWord = 'Campus Life',
  subtitle = 'Beyond academics — experience a vibrant campus life with world-class facilities.',
  features = [],
  columns = '4',
  backgroundColor = 'gradient-light',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: CampusFeaturesGridProps) {
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
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  // Empty state for editing
  if (features.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-center">Click to add campus features</p>
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

        {/* Features Grid */}
        <div
          ref={gridRef.ref}
          className={cn('grid gap-5 lg:gap-6 max-w-6xl mx-auto', gridColClasses[columns])}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'group relative text-center',
                isDark ? glassStyles.card : glassStyles.cardLight,
                isDark ? glassStyles.cardHover : 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
                'p-6 md:p-8',
                showAnimations && 'transition-all duration-700',
                showAnimations && gridRef.isInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{
                transitionDelay: showAnimations ? getStaggerDelay(index, 80) : '0ms',
              }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                {feature.icon ? (
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
                      isDark ? 'bg-white/15' : 'bg-[#0b6d41]/10'
                    )}
                  >
                    {(() => {
                      const Icon = getIcon(feature.icon)
                      return (
                        <Icon
                          className="w-7 h-7"
                          style={{ color: isDark ? '#ffde59' : '#0b6d41' }}
                        />
                      )
                    })()}
                  </div>
                ) : (
                  <div className="text-4xl md:text-5xl transition-transform duration-300 group-hover:scale-110">
                    {feature.emoji}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3
                className={cn(
                  'font-semibold text-base md:text-lg mb-2',
                  isDark ? 'text-white' : 'text-gray-900'
                )}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  isDark ? 'text-white/60' : 'text-gray-500'
                )}
              >
                {feature.description}
              </p>

              {/* Hover glow effect */}
              {showAnimations && (
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                    'bg-gradient-to-t from-transparent via-transparent'
                  )}
                  style={{
                    background: `radial-gradient(circle at center, ${accentColor}10, transparent 70%)`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
