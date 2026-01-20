'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { ChevronRight, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

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

export const EngineeringCTASectionPropsSchema = z.object({
  // Content
  title: z.string().default('Ready to Engineer Your Future?'),
  subtitle: z.string().default('Join JKKN College of Engineering and take the first step towards a successful career in technology'),

  // Primary CTA
  primaryCta: z.object({
    label: z.string().default('Apply Now'),
    link: z.string().default('/admissions'),
  }).default({ label: 'Apply Now', link: '/admissions' }),

  // Secondary CTA - Phone
  phoneNumber: z.string().default('+91 98765 43210'),
  showPhone: z.boolean().default(true),

  // Optional email
  email: z.string().optional(),
  showEmail: z.boolean().default(false),

  // Colors
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
})

export type EngineeringCTASectionProps = z.infer<typeof EngineeringCTASectionPropsSchema> & BaseBlockProps

// ==========================================
// Main Component
// ==========================================

export default function EngineeringCTASection({
  title = 'Ready to Engineer Your Future?',
  subtitle = 'Join JKKN College of Engineering and take the first step towards a successful career in technology',
  primaryCta = { label: 'Apply Now', link: '/admissions' },
  phoneNumber = '+91 98765 43210',
  showPhone = true,
  email,
  showEmail = false,
  primaryColor = '#0b6d41',
  accentColor = '#ffde59',
  showAnimations = true,
  paddingY = 'lg',
  className,
  isEditing,
}: EngineeringCTASectionProps) {
  const sectionRef = useInView(0.1)

  const paddingClasses = {
    sm: 'py-10 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }

  const animateClass = (delay: number) =>
    showAnimations
      ? cn(
          'transition-all duration-700',
          sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )
      : ''

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden', paddingClasses[paddingY], className)}
      style={{
        backgroundColor: '#fbfbee',
      }}
    >
      {/* Decorative elements */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, ${accentColor} 0%, transparent 30%), radial-gradient(circle at 90% 80%, ${primaryColor} 0%, transparent 30%)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230b6d41' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2
            className={cn(
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6',
              animateClass(0)
            )}
            style={{
              color: primaryColor,
              transitionDelay: '0ms'
            }}
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p
            className={cn(
              'text-base sm:text-lg mb-8 md:mb-10 max-w-2xl mx-auto',
              animateClass(100)
            )}
            style={{
              color: '#000000',
              transitionDelay: '100ms'
            }}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          <div
            className={cn(
              'flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6',
              animateClass(200)
            )}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Primary CTA */}
            <Link
              href={primaryCta.link}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-gray-900 transition-all duration-300 hover:scale-105 shadow-xl"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 8px 30px ${accentColor}50`,
              }}
            >
              <span>{primaryCta.label}</span>
              <ChevronRight className="w-6 h-6" />
            </Link>

            {/* Phone CTA */}
            {showPhone && phoneNumber && (
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-md"
                style={{
                  color: primaryColor,
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'transparent'
                }}
              >
                <Phone className="w-5 h-5" />
                <span>{phoneNumber}</span>
              </a>
            )}

            {/* Email CTA */}
            {showEmail && email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-md"
                style={{
                  color: primaryColor,
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'transparent'
                }}
              >
                <Mail className="w-5 h-5" />
                <span>{email}</span>
              </a>
            )}
          </div>

          {/* Additional info */}
          <p
            className={cn(
              'text-sm mt-6',
              animateClass(300)
            )}
            style={{
              color: '#666666',
              transitionDelay: '300ms'
            }}
          >
            Admissions Open for 2026-27 Academic Year
          </p>
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && !title && (
        <div className="p-8 border-2 border-dashed border-white/30 rounded-lg text-center text-white">
          <p>Configure CTA section content</p>
        </div>
      )}
    </section>
  )
}
