'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Calendar } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { AdmissionDatesTableProps } from '@/lib/cms/registry-types'
import {
  glassStyles,
  backgroundStyles,
  isDarkBackground,
  getStaggerDelay,
  statusColors,
  type StatusType,
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

// Status badge component
function StatusBadge({ status }: { status: StatusType }) {
  const colors = statusColors[status]
  const labels: Record<StatusType, string> = {
    upcoming: 'Upcoming',
    open: 'Open',
    closed: 'Closed',
    extended: 'Extended',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        colors.bg,
        colors.text,
        colors.border,
        'border'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {labels[status]}
    </span>
  )
}

export default function AdmissionDatesTable({
  badge = 'IMPORTANT DATES',
  title = 'Admission Calendar 2025-26',
  titleAccentWord = 'Calendar',
  subtitle = 'Mark your calendar with these important admission dates',
  dates = [],
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  alternatingRows = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: AdmissionDatesTableProps) {
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
  if (dates.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">Click to add admission dates</p>
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

        {/* Table */}
        <div
          ref={tableRef.ref}
          className={cn(
            'max-w-4xl mx-auto',
            glassStyles.tableContainer,
            showAnimations && 'transition-all duration-700',
            showAnimations && (tableRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {/* Table Header */}
          <div className={cn(glassStyles.tableHeader, 'hidden sm:grid sm:grid-cols-3 gap-4 px-6 py-4')}>
            <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Event
            </div>
            <div className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Date
            </div>
            <div className={cn('font-semibold text-right', isDark ? 'text-white' : 'text-gray-900')}>
              Status
            </div>
          </div>

          {/* Table Body */}
          <div>
            {dates.map((item, index) => (
              <div
                key={index}
                className={cn(
                  'px-6 py-4',
                  alternatingRows && index % 2 === 0 ? glassStyles.tableRow : glassStyles.tableRowAlt,
                  glassStyles.tableRowHover,
                  // Mobile: stack layout
                  'flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center',
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
                {/* Event */}
                <div className="flex items-center gap-2">
                  <Calendar className={cn('w-4 h-4 sm:hidden', isDark ? 'text-white/50' : 'text-gray-400')} />
                  <span className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                    {item.event}
                  </span>
                </div>

                {/* Date */}
                <div className={cn('text-sm sm:text-base', isDark ? 'text-white/70' : 'text-gray-600')}>
                  <span className="sm:hidden font-medium mr-2">Date:</span>
                  {item.date}
                </div>

                {/* Status */}
                <div className="sm:text-right">
                  <StatusBadge status={item.status as StatusType} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
