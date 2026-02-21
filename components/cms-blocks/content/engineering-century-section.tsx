'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { Check, Award, BookOpen, Building2, Handshake, Microscope, Star } from 'lucide-react'

// ==========================================
// Intersection Observer Hook
// ==========================================

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isInView }
}

// ==========================================
// Zod Schema
// ==========================================

export const EngineeringCenturySectionPropsSchema = z.object({
  // Badge/Year
  yearsBadge: z.string().default('100'),
  badgeSubtext: z.string().default('YEARS'),

  // Title and Subtitle
  title: z.string().default('A Century of Excellence in Progressive Technical Education'),
  subtitle: z.string().default('Building future-ready engineers with world-class infrastructure and industry partnerships'),

  // Feature list
  features: z.array(z.object({
    icon: z.enum(['check', 'award', 'book', 'building', 'handshake', 'microscope', 'star']).default('check'),
    label: z.string(),
  })).default([
    { icon: 'award', label: 'AICTE Approved' },
    { icon: 'star', label: 'NAAC Accredited' },
    { icon: 'award', label: 'NAAC Accredited' },
    { icon: 'building', label: 'Autonomous Status' },
    { icon: 'handshake', label: 'Industry Partnerships' },
    { icon: 'microscope', label: 'Research Excellence' },
  ]),

  // Colors
  primaryColor: z.string().default('#1e3a5f'),
  accentColor: z.string().default('#f97316'),
  backgroundColor: z.string().default('#f9fafb'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
})

export type EngineeringCenturySectionProps = z.infer<typeof EngineeringCenturySectionPropsSchema> & BaseBlockProps

// ==========================================
// Icon Component
// ==========================================

function FeatureIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-5 h-5', className) }

  switch (icon) {
    case 'award':
      return <Award {...iconProps} />
    case 'book':
      return <BookOpen {...iconProps} />
    case 'building':
      return <Building2 {...iconProps} />
    case 'handshake':
      return <Handshake {...iconProps} />
    case 'microscope':
      return <Microscope {...iconProps} />
    case 'star':
      return <Star {...iconProps} />
    case 'check':
    default:
      return <Check {...iconProps} />
  }
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringCenturySection({
  yearsBadge = '100',
  badgeSubtext = 'YEARS',
  title = 'A Century of Excellence in Progressive Technical Education',
  subtitle = 'Building future-ready engineers with world-class infrastructure and industry partnerships',
  features = [
    { icon: 'award', label: 'AICTE Approved' },
    { icon: 'star', label: 'NAAC Accredited' },
    { icon: 'award', label: 'NAAC Accredited' },
    { icon: 'building', label: 'Autonomous Status' },
    { icon: 'handshake', label: 'Industry Partnerships' },
    { icon: 'microscope', label: 'Research Excellence' },
  ],
  primaryColor = '#1e3a5f',
  accentColor = '#f97316',
  backgroundColor = '#f9fafb',
  showAnimations = true,
  paddingY = 'lg',
  className,
  isEditing,
}: EngineeringCenturySectionProps) {
  const sectionRef = useInView(0.1)

  const paddingClasses = {
    sm: 'py-8 md:py-10',
    md: 'py-10 md:py-14',
    lg: 'py-14 md:py-20',
    xl: 'py-20 md:py-28',
  }

  const animateClass = (delay: number) =>
    showAnimations
      ? cn(
          'transition-opacity duration-700',
          sectionRef.isInView ? 'opacity-100' : 'opacity-0'
        )
      : ''

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden', paddingClasses[paddingY], className)}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left - Circular Badge */}
          <div
            className={cn('flex-shrink-0', animateClass(0))}
            style={{ transitionDelay: '0ms' }}
          >
            <div
              className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                boxShadow: `0 20px 60px ${primaryColor}40, inset 0 -10px 30px rgba(0,0,0,0.1)`,
              }}
            >
              {/* Decorative ring */}
              <div
                className="absolute inset-2 rounded-full border-2 border-dashed opacity-30"
                style={{ borderColor: accentColor }}
              />

              {/* Inner content */}
              <span
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none"
                style={{ textShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
              >
                {yearsBadge}
              </span>
              <span
                className="text-xs sm:text-sm font-semibold tracking-[0.2em] mt-1"
                style={{ color: accentColor }}
              >
                {badgeSubtext}
              </span>

              {/* Accent ring */}
              <div
                className="absolute -inset-2 rounded-full border-4 opacity-20"
                style={{ borderColor: accentColor }}
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Title */}
            <h2
              className={cn(
                'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4',
                animateClass(100)
              )}
              style={{ color: primaryColor, transitionDelay: '100ms' }}
            >
              {title}
            </h2>

            {/* Subtitle */}
            <p
              className={cn(
                'text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0',
                animateClass(200)
              )}
              style={{ transitionDelay: '200ms' }}
            >
              {subtitle}
            </p>

            {/* Features Grid */}
            <div
              className={cn(
                'grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4',
                animateClass(300)
              )}
              style={{ transitionDelay: '300ms' }}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300"
                >
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <FeatureIcon
                      icon={feature.icon}
                      className="text-current"
                    />
                    <style jsx>{`
                      div :global(svg) {
                        color: ${accentColor};
                      }
                    `}</style>
                  </div>
                  <span
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: primaryColor }}
                  >
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && !title && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 border-2 border-dashed border-gray-300">
          <p className="text-gray-500">Engineering Century Section</p>
        </div>
      )}
    </section>
  )
}
