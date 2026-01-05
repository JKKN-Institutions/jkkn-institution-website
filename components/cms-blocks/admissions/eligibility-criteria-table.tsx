'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { GraduationCap } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { EligibilityCriteriaTableProps } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
  programCategoryColors,
  type ProgramCategory,
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

// Category badge component
function CategoryBadge({ category }: { category: ProgramCategory }) {
  const colors = programCategoryColors[category] || programCategoryColors['arts-science']
  const labels: Record<ProgramCategory, string> = {
    medical: 'Medical',
    nursing: 'Nursing',
    pharmacy: 'Pharmacy',
    engineering: 'Engineering',
    'arts-science': 'Arts & Science',
    education: 'Education',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        colors.bg,
        colors.text,
        colors.border,
        'border'
      )}
    >
      {labels[category]}
    </span>
  )
}

export default function EligibilityCriteriaTable({
  badge = 'ELIGIBILITY',
  title = 'Eligibility Criteria',
  titleAccentWord = 'Criteria',
  subtitle = 'Check if you meet the requirements for your chosen program',
  criteria = [],
  groupByCategory = false,
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: EligibilityCriteriaTableProps) {
  const sectionRef = useInView()
  const tableRef = useInView()

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
  if (criteria.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">Click to add eligibility criteria</p>
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
              <span className={isDark ? glassStyles.sectionBadge : glassStyles.sectionBadgeLight}>
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

        {/* Table */}
        <div
          ref={tableRef.ref}
          className={cn(
            'max-w-6xl mx-auto overflow-x-auto',
            glassStyles.tableContainer,
            showAnimations && 'transition-all duration-700',
            showAnimations && (tableRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {/* Desktop Table Header */}
          <div className={cn(glassStyles.tableHeader, 'hidden lg:grid lg:grid-cols-5 gap-4 px-6 py-4')}>
            <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Program
            </div>
            <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Qualification
            </div>
            <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Age Limit
            </div>
            <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Other Requirements
            </div>
            <div className={cn('font-semibold text-right', isDark ? 'text-white' : 'text-gray-900')}>
              Category
            </div>
          </div>

          {/* Table Body */}
          <div>
            {criteria.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'px-6 py-4',
                  index % 2 === 0 ? glassStyles.tableRow : glassStyles.tableRowAlt,
                  glassStyles.tableRowHover,
                  // Mobile: card layout
                  'flex flex-col gap-3 lg:grid lg:grid-cols-5 lg:gap-4 lg:items-center',
                  // Animation
                  showAnimations && 'transition-all duration-500',
                  showAnimations && tableRef.isInView
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-4'
                )}
                style={{
                  transitionDelay: showAnimations ? getStaggerDelay(index, 50) : '0ms',
                }}
              >
                {/* Program - Mobile header */}
                <div className="flex items-center justify-between lg:block">
                  <div className="flex items-center gap-2">
                    <GraduationCap className={cn('w-5 h-5 lg:hidden', isDark ? 'text-white/50' : 'text-gray-400')} />
                    <span className={cn('font-semibold text-lg lg:text-base', isDark ? 'text-white' : 'text-gray-900')}>
                      {item.program}
                    </span>
                  </div>
                  <div className="lg:hidden">
                    <CategoryBadge category={item.category as ProgramCategory} />
                  </div>
                </div>

                {/* Qualification */}
                <div className={cn('text-sm lg:text-base', isDark ? 'text-white/80' : 'text-gray-700')}>
                  <span className="lg:hidden font-medium text-white/50 mr-2">Qualification:</span>
                  {item.qualification}
                </div>

                {/* Age Limit */}
                <div className={cn('text-sm lg:text-base', isDark ? 'text-white/70' : 'text-gray-600')}>
                  <span className="lg:hidden font-medium text-white/50 mr-2">Age:</span>
                  {item.ageLimit}
                </div>

                {/* Other Requirements */}
                <div className={cn('text-sm lg:text-base', isDark ? 'text-white/70' : 'text-gray-600')}>
                  {item.otherRequirements ? (
                    <>
                      <span className="lg:hidden font-medium text-white/50 mr-2">Requirements:</span>
                      {item.otherRequirements}
                    </>
                  ) : (
                    <span className={cn('hidden lg:block', isDark ? 'text-white/40' : 'text-gray-400')}>—</span>
                  )}
                </div>

                {/* Category - Desktop only */}
                <div className="hidden lg:flex lg:justify-end">
                  <CategoryBadge category={item.category as ProgramCategory} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
