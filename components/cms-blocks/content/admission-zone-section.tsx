'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import { ClipboardCheck, CheckCircle2, ArrowRight } from 'lucide-react'

/**
 * AdmissionZoneSection props schema
 */
export const AdmissionZoneSectionPropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true).describe('Show section header'),
  headerPart1: z.string().default('ADMISSION ZONE').describe('First part of header'),
  headerPart2: z.string().default('2025-2026').describe('Second part of header (year)'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#D4AF37').describe('Color for second part (gold/yellow)'),

  // Content
  bulletPoints: z.array(z.string()).default([]).describe('Admission requirements/info bullet points'),
  introText: z.string().optional().describe('Optional intro paragraph before bullet points'),

  // CTA
  showCTA: z.boolean().default(true).describe('Show call-to-action button'),
  ctaText: z.string().default('Apply Now').describe('CTA button text'),
  ctaLink: z.string().default('/admissions/apply').describe('CTA button link'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  showIcon: z.boolean().default(true).describe('Show icon next to header'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  showAnimations: z.boolean().default(true).describe('Enable scroll animations'),

  // Bullet style
  bulletStyle: z.enum(['check', 'arrow', 'dot', 'number']).default('check').describe('Bullet point style'),
  bulletColor: z.string().default('#0b6d41').describe('Bullet icon color'),
})

export type AdmissionZoneSectionProps = z.infer<typeof AdmissionZoneSectionPropsSchema> & BaseBlockProps

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

// Animation delay calculation for staggered animations
function getStaggerDelay(index: number, baseDelay = 100): string {
  return `${index * baseDelay}ms`
}

/**
 * AdmissionZoneSection Component
 *
 * Displays admission requirements and eligibility criteria in a clean,
 * scannable bullet point format with optional CTA.
 */
export function AdmissionZoneSection({
  showHeader = true,
  headerPart1 = 'ADMISSION ZONE',
  headerPart2 = '2025-2026',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#D4AF37',
  bulletPoints = [],
  introText,
  showCTA = true,
  ctaText = 'Apply Now',
  ctaLink = '/admissions/apply',
  variant = 'modern-light',
  showIcon = true,
  showDecorations = true,
  showAnimations = true,
  bulletStyle = 'check',
  bulletColor = '#0b6d41',
  className,
  isEditing,
}: AdmissionZoneSectionProps) {
  const sectionRef = useInView()
  const contentRef = useInView()

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  // Default bullet points for pharmacy
  const defaultBulletPoints = [
    'JKKN college of Pharmacy offers Bachelor of Pharmacy (B.Pharm) and Master of Pharmacy (M.Pharm) programs in various specializations.',
    'For M.Pharm programs, candidates must have completed a B.Pharm degree with a minimum percentage of marks.',
    'Bachelor of Pharmacy (Lateral Entry): Candidates must have completed a diploma in pharmacy program from a recognized board or institution with a minimum of 45% marks.',
    'Pharm.D - Eligibility for admission requires completion of 10+2 or equivalent with a minimum percentage of marks in science subjects.',
  ]

  const displayBulletPoints = bulletPoints.length > 0 ? bulletPoints : defaultBulletPoints

  // Get bullet icon based on style
  const getBulletIcon = (index: number) => {
    switch (bulletStyle) {
      case 'check':
        return <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: bulletColor }} />
      case 'arrow':
        return <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: bulletColor }} />
      case 'number':
        return (
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: bulletColor }}
          >
            {index + 1}
          </span>
        )
      case 'dot':
      default:
        return (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
            style={{ backgroundColor: bulletColor }}
          />
        )
    }
  }

  // Empty state for editing
  if (displayBulletPoints.length === 0 && isEditing) {
    return (
      <section className={cn('py-12 px-4', isDark ? 'bg-brand-primary' : 'bg-brand-cream', className)}>
        <div className="container mx-auto max-w-4xl">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-center">Click to add admission requirements</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef.ref}
      className={cn(
        'relative py-10 md:py-16 overflow-hidden',
        isDark ? 'section-green-gradient' : 'bg-brand-cream',
        className
      )}
    >
      {/* Decorative Patterns */}
      {showDecorations && isModern && (
        <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        {showHeader && (
          <div
            className={cn(
              'flex items-center justify-center mb-8 md:mb-10',
              showAnimations && 'transition-all duration-700',
              showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
            )}
          >
            {showIcon && (
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mr-3',
                  isDark ? 'bg-white/10' : 'bg-brand-primary/10'
                )}
              >
                <ClipboardCheck className={cn('w-5 h-5', isDark ? 'text-white' : 'text-brand-primary')} />
              </div>
            )}
            <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
              <span style={{ color: headerPart2Color }}>{headerPart2}</span>
            </h2>
          </div>
        )}

        {/* Content Card */}
        <div
          ref={contentRef.ref}
          className={cn(
            'rounded-2xl overflow-hidden',
            // Glassmorphism
            isDark
              ? 'bg-white/10 backdrop-blur-[12px] border border-white/20'
              : 'bg-white/80 backdrop-blur-[12px] border border-gray-200/50 shadow-lg',
            // Animation
            showAnimations && 'transition-all duration-700',
            showAnimations && contentRef.isInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          )}
        >
          {/* Gold accent bar */}
          <div className="h-1 w-full" style={{ backgroundColor: headerPart2Color }} />

          <div className="p-5 md:p-8">
            {/* Intro text */}
            {introText && (
              <p
                className={cn(
                  'text-base md:text-lg mb-6',
                  isDark ? 'text-white/90' : 'text-gray-700'
                )}
              >
                {introText}
              </p>
            )}

            {/* Bullet points */}
            <ul className="space-y-4">
              {displayBulletPoints.map((point, index) => (
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
                    transitionDelay: showAnimations ? getStaggerDelay(index, 150) : '0ms',
                  }}
                >
                  {getBulletIcon(index)}
                  <span
                    className={cn(
                      'text-sm md:text-base leading-relaxed',
                      isDark ? 'text-white/85' : 'text-gray-700'
                    )}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            {showCTA && (
              <div
                className={cn(
                  'mt-8 flex justify-center',
                  showAnimations && 'transition-all duration-700 delay-500',
                  showAnimations && contentRef.isInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                )}
              >
                {isEditing ? (
                  <button
                    className={cn(
                      'inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white',
                      'transition-all duration-300 hover:scale-105 hover:shadow-lg'
                    )}
                    style={{ backgroundColor: bulletColor }}
                  >
                    {ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={ctaLink}
                    className={cn(
                      'inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white',
                      'transition-all duration-300 hover:scale-105 hover:shadow-lg'
                    )}
                    style={{ backgroundColor: bulletColor }}
                  >
                    {ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdmissionZoneSection
