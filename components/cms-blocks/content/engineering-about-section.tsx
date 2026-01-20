'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import Image from 'next/image'
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

export const EngineeringAboutSectionPropsSchema = z.object({
  // Badge
  badge: z.object({
    text: z.string().default('100 Years Legacy'),
    position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']).default('top-left'),
  }).default({ text: '100 Years Legacy', position: 'top-left' }),

  // Title
  title: z.string().default('Welcome to JKKN College of Engineering'),
  subtitle: z.string().default('About Us'),
  description: z.string().default('Established as part of the prestigious JKKN Educational Institutions with over 100 years of legacy, JKKN College of Engineering is committed to producing industry-ready engineers through quality education, practical training, and holistic development.'),

  // Features list
  features: z.array(z.string()).default([
    'AICTE Approved & Anna University Affiliated',
    'NBA Accredited Programs',
    'Industry-Academia Partnerships',
    'State-of-the-Art Laboratories',
    '95%+ Placement Record',
    'Experienced Faculty Members',
  ]),

  // Image
  image: z.string().default('/images/engineering/about-campus.jpg'),
  imageAlt: z.string().default('JKKN Engineering College Campus'),

  // CTA
  cta: z.object({
    label: z.string().default('Learn More About Us'),
    link: z.string().default('/about'),
  }).default({ label: 'Learn More About Us', link: '/about' }),

  // Colors
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  backgroundColor: z.string().default('#ffffff'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),

  // Image position
  imagePosition: z.enum(['left', 'right']).default('left'),
})

export type EngineeringAboutSectionProps = z.infer<typeof EngineeringAboutSectionPropsSchema> & BaseBlockProps

// ==========================================
// Main Component
// ==========================================

export default function EngineeringAboutSection({
  badge = { text: '100 Years Legacy', position: 'top-left' },
  title = 'Welcome to JKKN College of Engineering',
  subtitle = 'About Us',
  description = 'Established as part of the prestigious JKKN Educational Institutions with over 100 years of legacy, JKKN College of Engineering is committed to producing industry-ready engineers through quality education, practical training, and holistic development.',
  features = [
    'AICTE Approved & Anna University Affiliated',
    'NBA Accredited Programs',
    'Industry-Academia Partnerships',
    'State-of-the-Art Laboratories',
    '95%+ Placement Record',
    'Experienced Faculty Members',
  ],
  image = '/images/engineering/about-campus.jpg',
  imageAlt = 'JKKN Engineering College Campus',
  cta = { label: 'Learn More About Us', link: '/about' },
  primaryColor = '#0b6d41',
  accentColor = '#ffde59',
  backgroundColor = '#ffffff',
  showAnimations = true,
  paddingY = 'lg',
  imagePosition = 'left',
  className,
  isEditing,
}: EngineeringAboutSectionProps) {
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
          'transition-all duration-700',
          sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )
      : ''

  const badgePositionClasses = {
    'top-left': '-top-4 -left-4',
    'top-right': '-top-4 -right-4',
    'bottom-left': '-bottom-4 -left-4',
    'bottom-right': '-bottom-4 -right-4',
  }

  const ImageSection = (
    <div
      className={cn(
        'relative',
        animateClass(0)
      )}
      style={{ transitionDelay: '0ms' }}
    >
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <div className="aspect-[4/3] relative">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Badge overlay */}
        <div
          className={cn(
            'absolute px-5 py-3 rounded-xl shadow-lg font-bold text-gray-900 text-center',
            badgePositionClasses[badge.position]
          )}
          style={{ backgroundColor: accentColor }}
        >
          <div className="text-2xl leading-none">{badge.text.split(' ')[0]}</div>
          <div className="text-sm">{badge.text.split(' ').slice(1).join(' ')}</div>
        </div>
      </div>

      {/* Decorative element */}
      <div
        className="absolute -z-10 w-full h-full rounded-2xl top-4 left-4"
        style={{ backgroundColor: `${primaryColor}15` }}
      />
    </div>
  )

  const ContentSection = (
    <div>
      {/* Subtitle */}
      <div
        className={cn(
          'mb-4',
          animateClass(100)
        )}
        style={{ transitionDelay: '100ms' }}
      >
        <span
          className="text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: `${accentColor}30`,
            color: primaryColor,
          }}
        >
          {subtitle}
        </span>
      </div>

      {/* Title */}
      <h2
        className={cn(
          'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6',
          animateClass(200)
        )}
        style={{ color: primaryColor, transitionDelay: '200ms' }}
      >
        {title}
      </h2>

      {/* Description */}
      <p
        className={cn(
          'text-base sm:text-lg text-gray-600 mb-8 leading-relaxed',
          animateClass(300)
        )}
        style={{ transitionDelay: '300ms' }}
      >
        {description}
      </p>

      {/* Features */}
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8',
          animateClass(400)
        )}
        style={{ transitionDelay: '400ms' }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: primaryColor }}
            >
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className={cn(
          animateClass(500)
        )}
        style={{ transitionDelay: '500ms' }}
      >
        <Link
          href={cta.link}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg"
          style={{
            backgroundColor: primaryColor,
            boxShadow: `0 4px 15px ${primaryColor}40`,
          }}
        >
          <span>{cta.label}</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden', paddingClasses[paddingY], className)}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {imagePosition === 'left' ? (
            <>
              {ImageSection}
              {ContentSection}
            </>
          ) : (
            <>
              {ContentSection}
              {ImageSection}
            </>
          )}
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && !title && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Configure about section content</p>
        </div>
      )}
    </section>
  )
}
