'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Building2 } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import type { CollegesGridProps } from '@/lib/cms/registry-types'
import { glassStyles, backgroundStyles, isDarkBackground, getStaggerDelay } from './shared/admission-glass-styles'

// Grid column classes based on columns prop
const gridColClasses = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Intersection Observer hook for scroll animations
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

export default function CollegesGrid({
  badge = 'OUR COLLEGES',
  title = 'Our 7 Colleges',
  titleAccentWord = 'Colleges',
  subtitle = 'Choose from 7 Premier Institutions Offering 50+ Programs',
  colleges = [],
  columns = '3',
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: CollegesGridProps) {
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

  // Empty state for editing
  if (colleges.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', backgroundStyles[backgroundColor], className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-white/25 rounded-lg">
            <p className="text-white/60 text-center">Click to add colleges</p>
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

        {/* Colleges Grid */}
        <div
          ref={gridRef.ref}
          className={cn('grid gap-6', gridColClasses[columns])}
        >
          {colleges.map((college, index) => (
            <div
              key={index}
              className={cn(
                // Glassmorphism card
                'group relative overflow-hidden rounded-2xl',
                glassStyles.card,
                glassStyles.cardHover,
                showAnimations && 'transition-all duration-700',
                showAnimations && gridRef.isInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{
                transitionDelay: showAnimations ? getStaggerDelay(index) : '0ms',
              }}
            >
              {/* Colored header band */}
              <div
                className="h-2"
                style={{ backgroundColor: college.headerColor || '#0b6d41' }}
              />

              <div className="p-6">
                {/* Logo or Icon */}
                {college.logo ? (
                  <div className="w-16 h-16 mb-4 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                    <Image
                      src={college.logo}
                      alt={college.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${college.headerColor || '#0b6d41'}30` }}
                  >
                    <Building2
                      className="w-6 h-6"
                      style={{ color: college.headerColor || '#0b6d41' }}
                    />
                  </div>
                )}

                {/* Name */}
                <h3
                  className={cn(
                    'font-semibold text-lg mb-2 line-clamp-2',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}
                >
                  {college.name}
                </h3>

                {/* Description */}
                <p
                  className={cn(
                    'text-sm mb-4 line-clamp-2',
                    isDark ? 'text-white/70' : 'text-gray-600'
                  )}
                >
                  {college.description}
                </p>

                {/* Link */}
                {college.link && (
                  <Link
                    href={college.link}
                    className={cn(
                      'inline-flex items-center gap-1.5 text-sm font-medium',
                      'group-hover:translate-x-1 transition-transform duration-300'
                    )}
                    style={{ color: accentColor }}
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
