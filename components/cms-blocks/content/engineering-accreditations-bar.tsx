'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { Award, Shield, GraduationCap, Building2, BadgeCheck } from 'lucide-react'
import Image from 'next/image'

// ==========================================
// Intersection Observer Hook
// ==========================================

function useInView(threshold = 0.1, initialVisible = false) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(initialVisible)

  useEffect(() => {
    if (initialVisible) {
      setIsInView(true)
      return
    }

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
  }, [threshold, initialVisible])

  return { ref, isInView }
}

// ==========================================
// Zod Schema
// ==========================================

export const EngineeringAccreditationsBarPropsSchema = z.object({
  // Label
  label: z.string().default('Recognized & Approved By'),

  // Accreditations
  accreditations: z.array(z.object({
    name: z.string(),
    shortName: z.string(),
    description: z.string().optional(),
    logo: z.string().optional(),
    icon: z.enum(['award', 'shield', 'graduation', 'building', 'badge']).default('award'),
  })).default([
    { name: 'All India Council for Technical Education', shortName: 'AICTE', description: 'Approved', icon: 'shield' },
    { name: 'Anna University', shortName: 'Anna University', description: 'Affiliated', icon: 'graduation' },
    { name: 'National Board of Accreditation', shortName: 'NAAC', description: 'Accredited', icon: 'award' },
    { name: 'National Assessment and Accreditation Council', shortName: 'NAAC', description: 'A+ Grade', icon: 'badge' },
    { name: 'International Organization for Standardization', shortName: 'ISO 9001:2015', description: 'Certified', icon: 'building' },
  ]),

  // Colors
  primaryColor: z.string().default('#0b6d41'),
  backgroundColor: z.string().default('#f8f9fa'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg']).default('md'),
})

export type EngineeringAccreditationsBarProps = z.infer<typeof EngineeringAccreditationsBarPropsSchema> & BaseBlockProps

// ==========================================
// Icon Component
// ==========================================

function AccreditationIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-6 h-6', className) }

  switch (icon) {
    case 'shield':
      return <Shield {...iconProps} />
    case 'graduation':
      return <GraduationCap {...iconProps} />
    case 'building':
      return <Building2 {...iconProps} />
    case 'badge':
      return <BadgeCheck {...iconProps} />
    case 'award':
    default:
      return <Award {...iconProps} />
  }
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringAccreditationsBar({
  label = 'Recognized & Approved By',
  accreditations = [
    { name: 'All India Council for Technical Education', shortName: 'AICTE', description: 'Approved', icon: 'shield' },
    { name: 'Anna University', shortName: 'Anna University', description: 'Affiliated', icon: 'graduation' },
    { name: 'National Board of Accreditation', shortName: 'NAAC', description: 'Accredited', icon: 'award' },
    { name: 'National Assessment and Accreditation Council', shortName: 'NAAC', description: 'A+ Grade', icon: 'badge' },
    { name: 'International Organization for Standardization', shortName: 'ISO 9001:2015', description: 'Certified', icon: 'building' },
  ],
  primaryColor = '#0b6d41',
  backgroundColor = '#f8f9fa',
  showAnimations = true,
  paddingY = 'md',
  className,
  isEditing,
}: EngineeringAccreditationsBarProps) {
  // Accreditations bar is directly below hero (above the fold) - initialize visible to prevent CLS
  const sectionRef = useInView(0.1, true)

  const paddingClasses = {
    sm: 'py-6',
    md: 'py-8 md:py-10',
    lg: 'py-10 md:py-14',
  }

  // No entrance animations for above-the-fold content (prevents CLS of 0.719)
  const animateClass = (_delay: number) => ''

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden min-h-[140px] md:min-h-[160px]', paddingClasses[paddingY], className)}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <div
          className={cn(
            'text-center mb-6 md:mb-8',
            animateClass(0)
          )}
          style={{ transitionDelay: '0ms' }}
        >
          <span
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: primaryColor }}
          >
            {label}
          </span>
        </div>

        {/* Accreditations - centered row */}
        <div
          className={cn(
            'flex flex-nowrap justify-center gap-4 md:gap-8 lg:gap-12',
            animateClass(100)
          )}
          style={{ transitionDelay: '100ms' }}
        >
          {accreditations.map((accreditation, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center"
              style={{
                transitionDelay: `${(index + 1) * 100}ms`,
              }}
            >
              {/* Icon or Logo */}
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2 md:mb-3 transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                }}
              >
                {accreditation.logo ? (
                  <Image
                    src={accreditation.logo}
                    alt={accreditation.name}
                    width={40}
                    height={40}
                    className="object-contain"
                    quality={50}
                  />
                ) : (
                  <AccreditationIcon icon={accreditation.icon || 'award'} />
                )}
              </div>

              {/* Short Name */}
              <div
                className="font-bold text-xs md:text-sm"
                style={{ color: primaryColor }}
              >
                {accreditation.shortName}
              </div>

              {/* Description */}
              {accreditation.description && (
                <div className="text-[10px] md:text-xs text-gray-500 mt-0.5">
                  {accreditation.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && accreditations.length === 0 && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Add accreditation badges</p>
        </div>
      )}
    </section>
  )
}
