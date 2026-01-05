'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  FileText,
  ClipboardCheck,
  Users,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { AdmissionProcessTimelineProps } from '@/lib/cms/registry-types'
import { glassStyles, backgroundStyles, isDarkBackground, getStaggerDelay } from './shared/admission-glass-styles'

// Icon mapping
const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  FileText,
  ClipboardCheck,
  Users,
  CheckCircle,
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

export default function AdmissionProcessTimeline({
  badge = 'HOW TO APPLY',
  title = 'Admission Process',
  titleAccentWord = 'Process',
  subtitle = 'Your journey to JKKN in 5 simple steps',
  steps = [],
  orientation = 'auto',
  backgroundColor = 'gradient-dark',
  stepColor = '#0b6d41',
  activeColor = '#D4AF37',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: AdmissionProcessTimelineProps) {
  const sectionRef = useInView()
  const timelineRef = useInView()

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

  // Get icon component
  const getIcon = (iconName: string): LucideIcon => {
    return ICON_MAP[iconName] || CheckCircle
  }

  // Empty state for editing
  if (steps.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">Click to add admission steps</p>
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

        {/* Timeline */}
        <div
          ref={timelineRef.ref}
          className={cn(
            'relative',
            // Auto orientation: horizontal on lg+, vertical on smaller screens
            orientation === 'auto' && 'lg:flex lg:items-start lg:justify-between',
            orientation === 'horizontal' && 'flex items-start justify-between overflow-x-auto pb-4',
            orientation === 'vertical' && 'flex flex-col'
          )}
        >
          {/* Connecting line - Horizontal */}
          {(orientation === 'horizontal' || orientation === 'auto') && (
            <div
              className={cn(
                'hidden absolute top-8 h-0.5 bg-white/20',
                orientation === 'auto' ? 'lg:block' : 'block',
                'left-[10%] right-[10%]'
              )}
            />
          )}

          {steps.map((step, index) => {
            const Icon = getIcon(step.icon)
            const isFirst = index === 0

            return (
              <div
                key={index}
                className={cn(
                  'relative flex',
                  // Layout based on orientation
                  orientation === 'auto' && 'flex-col items-center text-center mb-8 last:mb-0 lg:mb-0 lg:flex-1',
                  orientation === 'horizontal' && 'flex-col items-center text-center flex-shrink-0 px-4 min-w-[180px]',
                  orientation === 'vertical' && 'flex-row items-start mb-8 last:mb-0',
                  // Animations
                  showAnimations && 'transition-all duration-700',
                  showAnimations && timelineRef.isInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                )}
                style={{
                  transitionDelay: showAnimations ? getStaggerDelay(index, 150) : '0ms',
                }}
              >
                {/* Vertical line for vertical orientation */}
                {orientation === 'vertical' && index !== steps.length - 1 && (
                  <div
                    className="absolute left-6 top-16 w-0.5 h-full bg-white/20"
                    style={{ height: 'calc(100% - 32px)' }}
                  />
                )}

                {/* Step number circle */}
                <div
                  className={cn(
                    'relative z-10 w-16 h-16 rounded-full flex items-center justify-center',
                    'border-2 transition-all duration-300',
                    orientation === 'vertical' && 'mr-4 flex-shrink-0',
                    isFirst ? 'scale-110' : ''
                  )}
                  style={{
                    backgroundColor: isFirst ? `${activeColor}20` : `${stepColor}20`,
                    borderColor: isFirst ? activeColor : `${stepColor}50`,
                  }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: isFirst ? activeColor : stepColor }}
                  />
                </div>

                {/* Content */}
                <div className={cn(
                  orientation === 'vertical' ? 'flex-1 pt-1' : 'mt-4'
                )}>
                  {/* Step number badge */}
                  <span
                    className={cn(
                      'inline-block text-xs font-semibold mb-1 px-2 py-0.5 rounded-full',
                      isDark ? 'bg-white/10 text-white/70' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    Step {step.number}
                  </span>

                  {/* Title */}
                  <h3
                    className={cn(
                      'font-semibold text-lg mb-1',
                      isDark ? 'text-white' : 'text-gray-900'
                    )}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      'text-sm max-w-[200px]',
                      isDark ? 'text-white/60' : 'text-gray-600',
                      orientation !== 'vertical' && 'mx-auto'
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
