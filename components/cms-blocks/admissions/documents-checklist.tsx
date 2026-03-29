'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, FileText } from 'lucide-react'
import { backgroundStyles, isDarkBackground, getStaggerDelay } from './shared/admission-glass-styles'
import type { DocumentsChecklistProps } from '@/lib/cms/registry-types'

// Intersection Observer hook
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

export default function DocumentsChecklist({
  badge,
  title = 'Documents Required',
  titleAccentWord = 'Documents',
  subtitle,
  leftColumnTitle,
  leftColumnDocuments = [],
  rightColumnTitle,
  rightColumnDocuments = [],
  showCTA = false,
  ctaText,
  ctaLink,
  backgroundColor = 'gradient-light',
  showAnimations = true,
  checkIcon,
  titleColor,
  subtitleColor,
  accentColor = '#0b6d41',
  className,
  isEditing,
}: DocumentsChecklistProps) {
  const sectionRef = useInView()
  const contentRef = useInView()

  const isDark = isDarkBackground(backgroundColor)

  // Merge both columns into a single flat list
  const allDocuments = [...leftColumnDocuments, ...rightColumnDocuments]

  // Parse title for accent word styling
  const titleParts = useMemo(() => {
    if (!titleAccentWord || !title.includes(titleAccentWord)) {
      return { before: title, accent: '', after: '' }
    }
    const parts = title.split(titleAccentWord)
    return { before: parts[0] || '', accent: titleAccentWord, after: parts[1] || '' }
  }, [title, titleAccentWord])

  if (allDocuments.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-5xl">
          <div className="p-8 border-2 border-dashed border-[#0b6d41]/30 rounded-lg">
            <p className="text-gray-400 text-center">Click to add documents checklist</p>
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
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section heading (centered) ── */}
        <div
          className={cn(
            'max-w-5xl mx-auto mb-8 text-center',
            showAnimations && 'transition-all duration-700',
            showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          <div className="flex items-center justify-center gap-3">
            <FileText
              className="w-8 h-8 flex-shrink-0"
              style={{ color: isDark ? '#ffde59' : '#0b6d41' }}
            />
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: titleColor || (isDark ? '#ffffff' : '#0f172a') }}
            >
              {titleParts.before}
              {titleParts.accent && (
                <span style={{ color: isDark ? '#ffde59' : accentColor }}>{titleParts.accent}</span>
              )}
              {titleParts.after}
            </h2>
          </div>
          {subtitle && (
            <p
              className="mt-3 text-base md:text-lg"
              style={{ color: subtitleColor || (isDark ? 'rgba(255,255,255,0.65)' : '#6b7280') }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* ── Main card with brand green left border ── */}
        <div
          ref={contentRef.ref}
          className={cn(
            'max-w-5xl mx-auto',
            showAnimations && 'transition-all duration-700',
            showAnimations && (contentRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          <div
            className={cn(
              'rounded-2xl px-6 py-8 md:px-10 md:py-10',
              isDark
                ? 'bg-white/8'
                : 'bg-white shadow-sm'
            )}
          >
            {/* Intro paragraph */}
            <p
              className={cn('text-sm md:text-base leading-relaxed mb-8', isDark ? 'text-white/75' : 'text-gray-600')}
            >
              Photocopies of the following documents must be submitted along with the completed application.
              Original documents should be presented during admission for verification:
            </p>

            {/* 2-column document grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {allDocuments.map((doc, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    showAnimations && 'transition-all duration-500',
                    showAnimations && contentRef.isInView
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  )}
                  style={{ transitionDelay: showAnimations ? getStaggerDelay(index, 60) : '0ms' }}
                >
                  <CheckCircle
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: isDark ? '#ffde59' : '#0b6d41' }}
                  />
                  <div>
                    <p className={cn('font-semibold text-sm md:text-base', isDark ? 'text-white' : 'text-gray-900')}>
                      {doc.text}
                    </p>
                    {doc.note && (
                      <p className={cn('text-xs md:text-sm mt-0.5 leading-snug', isDark ? 'text-white/60' : 'text-gray-500')}>
                        {doc.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Important notice (amber left border) ── */}
          <div
            className={cn(
              'mt-4 border-l-4 rounded-r-xl px-5 py-4',
              isDark
                ? 'border-[#ffde59]/70 bg-[#ffde59]/8'
                : 'border-[#ffde59] bg-[#fffdf0]'
            )}
          >
            <p className={cn('text-xs md:text-sm leading-relaxed', isDark ? 'text-white/80' : 'text-gray-700')}>
              <span className="font-bold">Important: </span>
              All documents should be presented upon demand during admission. If any document is not
              readily available, grace time may be granted with the principal&apos;s consent. Failure to
              submit required documents may result in admission cancellation.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
