'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Trophy,
  Building2,
  Heart,
  Medal,
  Award,
  ArrowRight,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { ScholarshipsSectionProps } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
} from './shared/admission-glass-styles'

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  Building2,
  Heart,
  Medal,
  Award,
}

// Get icon component
function getIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Award
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

// Scholarship type colors
const scholarshipTypeColors = {
  merit: { bg: 'bg-amber-500/20', border: 'border-amber-400/30', icon: '#f59e0b' },
  government: { bg: 'bg-blue-500/20', border: 'border-blue-400/30', icon: '#3b82f6' },
  'need-based': { bg: 'bg-rose-500/20', border: 'border-rose-400/30', icon: '#f43f5e' },
  'sports-cultural': { bg: 'bg-emerald-500/20', border: 'border-emerald-400/30', icon: '#10b981' },
}

export default function ScholarshipsSection({
  badge = 'SCHOLARSHIPS',
  title = 'Scholarships & Financial Aid',
  titleAccentWord = 'Financial Aid',
  subtitle = 'We believe financial constraints should never limit your dreams',
  scholarships = [],
  showCTA = true,
  ctaText = 'Apply for Scholarship',
  ctaLink = '/scholarships/apply',
  columns = '4',
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: ScholarshipsSectionProps) {
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
  if (scholarships.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">Click to add scholarships</p>
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
      <DecorativePatterns variant="default" color={isDark ? 'white' : 'green'} />

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
              <span className={glassStyles.sectionBadge}>
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

        {/* Scholarships Grid */}
        <div
          ref={gridRef.ref}
          className={cn('grid gap-6 max-w-6xl mx-auto', gridColClasses[columns])}
        >
          {scholarships.map((scholarship, index) => {
            const Icon = getIcon(scholarship.icon)
            const colors = scholarshipTypeColors[scholarship.type] || scholarshipTypeColors.merit

            return (
              <div
                key={index}
                className={cn(
                  'group relative',
                  glassStyles.card,
                  glassStyles.cardHover,
                  'p-6',
                  showAnimations && 'transition-all duration-700',
                  showAnimations && gridRef.isInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                )}
                style={{
                  transitionDelay: showAnimations ? getStaggerDelay(index) : '0ms',
                }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                    colors.bg,
                    colors.border,
                    'border'
                  )}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: colors.icon }}
                  />
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    'font-semibold text-lg mb-2',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {scholarship.title}
                </h3>

                {/* Description */}
                <p
                  className={cn(
                    'text-sm mb-4',
                    isDark ? 'text-white/70' : 'text-gray-600'
                  )}
                >
                  {scholarship.description}
                </p>

                {/* Eligibility */}
                {scholarship.eligibility && scholarship.eligibility.length > 0 && (
                  <ul className="space-y-2">
                    {scholarship.eligibility.map((item, i) => (
                      <li
                        key={i}
                        className={cn(
                          'flex items-start gap-2 text-sm',
                          isDark ? 'text-white/60' : 'text-gray-500'
                        )}
                      >
                        <CheckCircle
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: colors.icon }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        {showCTA && (
          <div
            className={cn(
              'flex justify-center mt-12',
              showAnimations && 'transition-all duration-700 delay-500',
              showAnimations && (gridRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
            )}
          >
            <Link
              href={ctaLink}
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded-full',
                'font-semibold text-lg',
                'transition-all duration-300',
                'hover:scale-105 hover:shadow-xl'
              )}
              style={{
                backgroundColor: accentColor,
                color: '#1f2937',
              }}
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
