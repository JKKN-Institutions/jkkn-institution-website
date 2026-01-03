'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  CheckSquare,
  Square,
  CheckCircle,
  Download,
  FileText,
} from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { DocumentsChecklistProps } from '@/lib/cms/registry-types'
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

// Check icon component based on type
function CheckIcon({
  type,
  checked,
  className,
}: {
  type: 'check' | 'checkbox' | 'circle-check'
  checked: boolean
  className?: string
}) {
  const iconProps = { className: cn('w-5 h-5', className) }

  switch (type) {
    case 'check':
      return checked ? (
        <CheckSquare {...iconProps} className={cn(iconProps.className, 'text-green-400')} />
      ) : (
        <Square {...iconProps} className={cn(iconProps.className, 'text-white/40')} />
      )
    case 'circle-check':
      return (
        <CheckCircle
          {...iconProps}
          className={cn(
            iconProps.className,
            checked ? 'text-green-400' : 'text-white/40'
          )}
        />
      )
    case 'checkbox':
    default:
      return checked ? (
        <CheckSquare {...iconProps} className={cn(iconProps.className, 'text-green-400')} />
      ) : (
        <Square {...iconProps} className={cn(iconProps.className, 'text-white/40')} />
      )
  }
}

export default function DocumentsChecklist({
  badge = 'DOCUMENTS',
  title = 'Documents Required',
  titleAccentWord = 'Documents',
  subtitle = 'Keep these documents ready for a smooth admission process',
  leftColumnTitle = 'For All Programs',
  leftColumnDocuments = [],
  rightColumnTitle = 'Additional Documents',
  rightColumnDocuments = [],
  showCTA = true,
  ctaText = 'Download Complete Checklist',
  ctaLink = '/downloads/admission-checklist.pdf',
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  checkIcon = 'checkbox',
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: DocumentsChecklistProps) {
  const sectionRef = useInView()
  const contentRef = useInView()

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
  if (leftColumnDocuments.length === 0 && rightColumnDocuments.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">Click to add documents checklist</p>
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

        {/* Two Column Checklist */}
        <div
          ref={contentRef.ref}
          className={cn(
            'max-w-5xl mx-auto',
            glassStyles.tableContainer,
            'p-6 md:p-8',
            showAnimations && 'transition-all duration-700',
            showAnimations && (contentRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FileText className={cn('w-5 h-5', isDark ? 'text-white/70' : 'text-gray-500')} />
                <h3
                  className={cn(
                    'font-semibold text-lg',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {leftColumnTitle}
                </h3>
              </div>

              <ul className="space-y-4">
                {leftColumnDocuments.map((doc, index) => (
                  <li
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      showAnimations && 'transition-all duration-500',
                      showAnimations && contentRef.isInView
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-4'
                    )}
                    style={{
                      transitionDelay: showAnimations ? getStaggerDelay(index, 50) : '0ms',
                    }}
                  >
                    <CheckIcon type={checkIcon} checked={doc.required} />
                    <span
                      className={cn(
                        'text-sm leading-relaxed',
                        isDark ? 'text-white/80' : 'text-gray-700',
                        !doc.required && (isDark ? 'text-white/60' : 'text-gray-500')
                      )}
                    >
                      {doc.text}
                      {doc.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FileText className={cn('w-5 h-5', isDark ? 'text-white/70' : 'text-gray-500')} />
                <h3
                  className={cn(
                    'font-semibold text-lg',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {rightColumnTitle}
                </h3>
              </div>

              <ul className="space-y-4">
                {rightColumnDocuments.map((doc, index) => (
                  <li
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      showAnimations && 'transition-all duration-500',
                      showAnimations && contentRef.isInView
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-4'
                    )}
                    style={{
                      transitionDelay: showAnimations ? getStaggerDelay(index + leftColumnDocuments.length, 50) : '0ms',
                    }}
                  >
                    <CheckIcon type={checkIcon} checked={doc.required} />
                    <span
                      className={cn(
                        'text-sm leading-relaxed',
                        isDark ? 'text-white/80' : 'text-gray-700',
                        !doc.required && (isDark ? 'text-white/60' : 'text-gray-500')
                      )}
                    >
                      {doc.text}
                      {doc.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legend */}
          <div
            className={cn(
              'mt-8 pt-6 border-t flex flex-wrap items-center justify-center gap-6 text-xs',
              isDark ? 'border-white/10 text-white/50' : 'border-gray-200 text-gray-500'
            )}
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-green-400" />
              <span>Required Document</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className={cn('w-4 h-4', isDark ? 'text-white/40' : 'text-gray-400')} />
              <span>If Applicable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">*</span>
              <span>Mandatory</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {showCTA && (
          <div
            className={cn(
              'flex justify-center mt-8',
              showAnimations && 'transition-all duration-700 delay-500',
              showAnimations && (contentRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
            )}
          >
            <Link
              href={ctaLink}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-full',
                'font-semibold',
                'transition-all duration-300',
                'hover:scale-105 hover:shadow-xl',
                glassStyles.card,
                glassStyles.cardHover,
                isDark ? 'text-white' : 'text-gray-900'
              )}
            >
              <Download className="w-5 h-5" />
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
