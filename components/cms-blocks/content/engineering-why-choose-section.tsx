'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import {
  Award,
  Building2,
  GraduationCap,
  FlaskConical,
  TrendingUp,
  Lightbulb,
  Globe,
  Home,
} from 'lucide-react'

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

export const EngineeringWhyChooseSectionPropsSchema = z.object({
  // Title
  title: z.string().default('Why Choose JKKN Engineering College?'),
  subtitle: z.string().default('Your Gateway to a Successful Engineering Career'),

  // Features
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.enum(['award', 'building', 'graduation', 'flask', 'trending', 'lightbulb', 'globe', 'home']).default('award'),
  })).default([
    {
      title: '100 Years Legacy',
      description: 'Part of JKKN Educational Institutions with a century of excellence in education',
      icon: 'award',
    },
    {
      title: 'Industry Connect',
      description: 'Strong partnerships with leading IT and core industry companies',
      icon: 'building',
    },
    {
      title: 'Expert Learning Facilitators',
      description: 'Highly qualified faculty with industry experience and research background',
      icon: 'graduation',
    },
    {
      title: 'Modern Labs & Infrastructure',
      description: 'State-of-the-art laboratories equipped with latest technology',
      icon: 'flask',
    },
    {
      title: '95%+ Placements',
      description: 'Consistently high placement rate with top recruiters visiting campus',
      icon: 'trending',
    },
    {
      title: 'Innovation Hub',
      description: 'Dedicated centers for AI, ML, IoT, and emerging technologies',
      icon: 'lightbulb',
    },
    {
      title: 'Global Exposure',
      description: 'International collaborations and student exchange programs',
      icon: 'globe',
    },
    {
      title: 'Excellent Hostel Facilities',
      description: 'Separate hostels for boys and girls with modern amenities',
      icon: 'home',
    },
  ]),

  // Colors
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  backgroundColor: z.string().default('#fbfbee'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),

  // Grid columns
  columns: z.enum(['2', '3', '4']).default('4'),
})

export type EngineeringWhyChooseSectionProps = z.infer<typeof EngineeringWhyChooseSectionPropsSchema> & BaseBlockProps

// ==========================================
// Icon Component
// ==========================================

function FeatureIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-7 h-7', className) }

  switch (icon) {
    case 'award':
      return <Award {...iconProps} />
    case 'building':
      return <Building2 {...iconProps} />
    case 'graduation':
      return <GraduationCap {...iconProps} />
    case 'flask':
      return <FlaskConical {...iconProps} />
    case 'trending':
      return <TrendingUp {...iconProps} />
    case 'lightbulb':
      return <Lightbulb {...iconProps} />
    case 'globe':
      return <Globe {...iconProps} />
    case 'home':
      return <Home {...iconProps} />
    default:
      return <Award {...iconProps} />
  }
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringWhyChooseSection({
  title = 'Why Choose JKKN Engineering College?',
  subtitle = 'Your Gateway to a Successful Engineering Career',
  features = [
    {
      title: '100 Years Legacy',
      description: 'Part of JKKN Educational Institutions with a century of excellence in education',
      icon: 'award',
    },
    {
      title: 'Industry Connect',
      description: 'Strong partnerships with leading IT and core industry companies',
      icon: 'building',
    },
    {
      title: 'Expert Learning Facilitators',
      description: 'Highly qualified faculty with industry experience and research background',
      icon: 'graduation',
    },
    {
      title: 'Modern Labs & Infrastructure',
      description: 'State-of-the-art laboratories equipped with latest technology',
      icon: 'flask',
    },
    {
      title: '95%+ Placements',
      description: 'Consistently high placement rate with top recruiters visiting campus',
      icon: 'trending',
    },
    {
      title: 'Innovation Hub',
      description: 'Dedicated centers for AI, ML, IoT, and emerging technologies',
      icon: 'lightbulb',
    },
    {
      title: 'Global Exposure',
      description: 'International collaborations and student exchange programs',
      icon: 'globe',
    },
    {
      title: 'Excellent Hostel Facilities',
      description: 'Separate hostels for boys and girls with modern amenities',
      icon: 'home',
    },
  ],
  primaryColor = '#0b6d41',
  accentColor = '#ffde59',
  backgroundColor = '#fbfbee',
  showAnimations = true,
  paddingY = 'lg',
  columns = '4',
  className,
  isEditing,
}: EngineeringWhyChooseSectionProps) {
  const sectionRef = useInView(0.1)

  const paddingClasses = {
    sm: 'py-8 md:py-10',
    md: 'py-10 md:py-14',
    lg: 'py-14 md:py-20',
    xl: 'py-20 md:py-28',
  }

  const columnClasses = {
    '2': 'sm:grid-cols-2',
    '3': 'sm:grid-cols-2 lg:grid-cols-3',
    '4': 'sm:grid-cols-2 lg:grid-cols-4',
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

        {/* Features Grid */}
        <div
          className={cn(
            'grid grid-cols-1 gap-6',
            columnClasses[columns],
            animateClass(200)
          )}
          style={{ transitionDelay: '200ms' }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                transitionDelay: `${(index + 2) * 50}ms`,
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                }}
              >
                <FeatureIcon icon={feature.icon} className="text-white" />
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: primaryColor }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative corner */}
              <div
                className="absolute top-0 right-0 w-20 h-20 opacity-5 rounded-tr-2xl"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${primaryColor} 50%)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && features.length === 0 && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Add features to display</p>
        </div>
      )}
    </section>
  )
}
