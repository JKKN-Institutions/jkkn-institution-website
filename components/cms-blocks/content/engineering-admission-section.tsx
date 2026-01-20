'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import {
  GraduationCap,
  FileText,
  ClipboardCheck,
  UserCheck,
  BadgeCheck,
  ChevronRight,
  Check,
} from 'lucide-react'
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

export const EngineeringAdmissionSectionPropsSchema = z.object({
  // Title
  title: z.string().default('Begin Your Engineering Journey at JKKN'),
  subtitle: z.string().default('Simple admission process with transparent eligibility criteria'),

  // Eligibility Criteria
  eligibility: z.array(z.object({
    program: z.string(),
    criteria: z.array(z.string()),
  })).default([
    {
      program: 'B.E. / B.Tech Programs',
      criteria: [
        'Passed 10+2 with Physics, Chemistry, and Mathematics',
        'Minimum 45% aggregate marks (40% for reserved categories)',
        'Valid TNEA counselling rank or direct admission',
        'Age limit: Should have completed 17 years as on July 1st',
      ],
    },
    {
      program: 'MBA Program',
      criteria: [
        'Bachelor\'s degree in any discipline with 50% marks',
        'Valid TANCET / CAT / MAT / XAT score',
        'Minimum 2 years work experience (preferred for PGDM)',
        'Group discussion and personal interview clearance',
      ],
    },
  ]),

  // Admission Process Steps
  processSteps: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string().optional(),
    icon: z.enum(['graduation', 'file', 'clipboard', 'user', 'badge']).default('file'),
  })).default([
    { step: 1, title: 'Online Application', description: 'Fill out the online application form', icon: 'file' },
    { step: 2, title: 'Document Submission', description: 'Upload required documents', icon: 'clipboard' },
    { step: 3, title: 'Counselling', description: 'Attend TNEA counselling or direct admission', icon: 'user' },
    { step: 4, title: 'Fee Payment', description: 'Pay admission fees online or at campus', icon: 'graduation' },
    { step: 5, title: 'Enrollment', description: 'Complete registration and start classes', icon: 'badge' },
  ]),

  // CTA Button
  ctaButton: z.object({
    label: z.string().default('Apply Now'),
    link: z.string().default('/admissions/apply'),
  }).default({ label: 'Apply Now', link: '/admissions/apply' }),

  // Secondary CTA
  secondaryCtaButton: z.object({
    label: z.string().default('Download Brochure'),
    link: z.string().default('/brochure'),
  }).optional(),

  // Colors
  primaryColor: z.string().default('#1e3a5f'),
  accentColor: z.string().default('#f97316'),
  backgroundColor: z.string().default('#ffffff'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
})

export type EngineeringAdmissionSectionProps = z.infer<typeof EngineeringAdmissionSectionPropsSchema> & BaseBlockProps

// ==========================================
// Icon Component
// ==========================================

function StepIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-5 h-5', className) }

  switch (icon) {
    case 'graduation':
      return <GraduationCap {...iconProps} />
    case 'clipboard':
      return <ClipboardCheck {...iconProps} />
    case 'user':
      return <UserCheck {...iconProps} />
    case 'badge':
      return <BadgeCheck {...iconProps} />
    case 'file':
    default:
      return <FileText {...iconProps} />
  }
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringAdmissionSection({
  title = 'Begin Your Engineering Journey at JKKN',
  subtitle = 'Simple admission process with transparent eligibility criteria',
  eligibility = [
    {
      program: 'B.E. / B.Tech Programs',
      criteria: [
        'Passed 10+2 with Physics, Chemistry, and Mathematics',
        'Minimum 45% aggregate marks (40% for reserved categories)',
        'Valid TNEA counselling rank or direct admission',
        'Age limit: Should have completed 17 years as on July 1st',
      ],
    },
    {
      program: 'MBA Program',
      criteria: [
        'Bachelor\'s degree in any discipline with 50% marks',
        'Valid TANCET / CAT / MAT / XAT score',
        'Minimum 2 years work experience (preferred for PGDM)',
        'Group discussion and personal interview clearance',
      ],
    },
  ],
  processSteps = [
    { step: 1, title: 'Online Application', description: 'Fill out the online application form', icon: 'file' },
    { step: 2, title: 'Document Submission', description: 'Upload required documents', icon: 'clipboard' },
    { step: 3, title: 'Counselling', description: 'Attend TNEA counselling or direct admission', icon: 'user' },
    { step: 4, title: 'Fee Payment', description: 'Pay admission fees online or at campus', icon: 'graduation' },
    { step: 5, title: 'Enrollment', description: 'Complete registration and start classes', icon: 'badge' },
  ],
  ctaButton = { label: 'Apply Now', link: '/admissions/apply' },
  secondaryCtaButton,
  primaryColor = '#1e3a5f',
  accentColor = '#f97316',
  backgroundColor = '#ffffff',
  showAnimations = true,
  paddingY = 'lg',
  className,
  isEditing,
}: EngineeringAdmissionSectionProps) {
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

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden', paddingClasses[paddingY], className)}
      style={{ backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2
            className={cn(
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
              animateClass(0)
            )}
            style={{ color: primaryColor, transitionDelay: '0ms' }}
          >
            {title}
          </h2>
          <p
            className={cn(
              'text-base sm:text-lg text-gray-600 max-w-2xl mx-auto',
              animateClass(100)
            )}
            style={{ transitionDelay: '100ms' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Left - Eligibility Criteria */}
          <div
            className={cn(animateClass(200))}
            style={{ transitionDelay: '200ms' }}
          >
            <h3
              className="text-xl sm:text-2xl font-bold mb-6"
              style={{ color: primaryColor }}
            >
              Eligibility Criteria
            </h3>
            <div className="space-y-4">
              {eligibility.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-5 sm:p-6 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{
                    background: `linear-gradient(135deg, white 0%, ${primaryColor}05 100%)`,
                  }}
                >
                  {/* Program Header */}
                  <div
                    className="flex items-center gap-3 mb-4 pb-3 border-b"
                    style={{ borderColor: `${primaryColor}15` }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${accentColor}15` }}
                    >
                      <GraduationCap className="w-5 h-5" style={{ color: accentColor }} />
                    </div>
                    <h4 className="text-lg font-semibold" style={{ color: primaryColor }}>
                      {item.program}
                    </h4>
                  </div>

                  {/* Criteria List */}
                  <ul className="space-y-2.5">
                    {item.criteria.map((criterion, criterionIndex) => (
                      <li key={criterionIndex} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${primaryColor}10` }}
                        >
                          <Check className="w-3 h-3" style={{ color: primaryColor }} />
                        </div>
                        <span className="text-sm text-gray-700">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Admission Process */}
          <div
            className={cn(animateClass(300))}
            style={{ transitionDelay: '300ms' }}
          >
            <h3
              className="text-xl sm:text-2xl font-bold mb-6"
              style={{ color: primaryColor }}
            >
              Admission Process
            </h3>

            {/* Process Steps */}
            <div className="relative">
              {/* Vertical Line */}
              <div
                className="absolute left-5 top-8 bottom-8 w-0.5"
                style={{ backgroundColor: `${primaryColor}20` }}
              />

              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex items-start gap-4 group"
                  >
                    {/* Step Number Circle */}
                    <div
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: primaryColor,
                        boxShadow: `0 4px 15px ${primaryColor}40`,
                      }}
                    >
                      {step.step}
                    </div>

                    {/* Content Card */}
                    <div
                      className="flex-1 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <StepIcon icon={step.icon} />
                        <style jsx>{`
                          div :global(svg) {
                            color: ${accentColor};
                          }
                        `}</style>
                        <h4 className="font-semibold" style={{ color: primaryColor }}>
                          {step.title}
                        </h4>
                      </div>
                      {step.description && (
                        <p className="text-sm text-gray-600 ml-8">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className={cn(
                'flex flex-col sm:flex-row gap-3 mt-8',
                animateClass(400)
              )}
              style={{ transitionDelay: '400ms' }}
            >
              <Link
                href={ctaButton.link}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 4px 15px ${accentColor}40`,
                }}
              >
                <span>{ctaButton.label}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>

              {secondaryCtaButton && (
                <Link
                  href={secondaryCtaButton.link}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: primaryColor,
                    color: primaryColor,
                  }}
                >
                  <span>{secondaryCtaButton.label}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && eligibility.length === 0 && processSteps.length === 0 && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Configure eligibility and admission process steps</p>
        </div>
      )}
    </section>
  )
}
