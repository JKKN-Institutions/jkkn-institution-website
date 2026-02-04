'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import {
  Monitor,
  Wrench,
  FlaskConical,
  BookOpen,
  Wifi,
  Home,
  UtensilsCrossed,
  Trophy,
  Bus,
  ChevronRight,
} from 'lucide-react'
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

export const EngineeringFacilitiesSectionPropsSchema = z.object({
  // Title
  title: z.string().default('World-Class Infrastructure & Facilities'),
  subtitle: z.string().default('Everything you need for an exceptional learning experience'),

  // Facilities
  facilities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    highlight: z.string().optional(),
    icon: z.enum(['monitor', 'wrench', 'flask', 'book', 'wifi', 'home', 'utensils', 'trophy', 'bus']).default('monitor'),
    image: z.string().optional(),
    link: z.string().optional(),
  })).default([
    {
      title: 'Computer Centers',
      description: 'Modern computer labs with high-performance systems',
      highlight: '500+ Systems',
      icon: 'monitor',
    },
    {
      title: 'Engineering Workshops',
      description: 'Hands-on training facilities for practical learning',
      icon: 'wrench',
    },
    {
      title: 'Research Labs',
      description: 'Specialized labs for advanced research',
      highlight: 'AI/ML, IoT, Robotics',
      icon: 'flask',
    },
    {
      title: 'Digital Library',
      description: 'Extensive collection of books and digital resources',
      highlight: '50,000+ Books',
      icon: 'book',
    },
    {
      title: 'Wi-Fi Campus',
      description: 'High-speed internet connectivity across the campus',
      icon: 'wifi',
    },
    {
      title: 'Hostels',
      description: 'Comfortable accommodation with all amenities',
      highlight: 'Men & Women',
      icon: 'home',
    },
    {
      title: 'Cafeteria',
      description: 'Hygienic food court with variety of cuisines',
      icon: 'utensils',
    },
    {
      title: 'Sports Complex',
      description: 'Indoor and outdoor sports facilities',
      icon: 'trophy',
    },
    {
      title: 'Transportation',
      description: 'Fleet of buses covering major routes',
      icon: 'bus',
    },
  ]),

  // CTA
  cta: z.object({
    label: z.string().default('Explore All Facilities'),
    link: z.string().default('/facilities'),
  }).default({ label: 'Explore All Facilities', link: '/facilities' }),

  // Colors
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  backgroundColor: z.string().default('#ffffff'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),

  // Grid columns
  columns: z.enum(['2', '3']).default('3'),
})

export type EngineeringFacilitiesSectionProps = z.infer<typeof EngineeringFacilitiesSectionPropsSchema> & BaseBlockProps

// ==========================================
// Icon Component
// ==========================================

function FacilityIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-6 h-6', className) }

  switch (icon) {
    case 'monitor':
      return <Monitor {...iconProps} />
    case 'wrench':
      return <Wrench {...iconProps} />
    case 'flask':
      return <FlaskConical {...iconProps} />
    case 'book':
      return <BookOpen {...iconProps} />
    case 'wifi':
      return <Wifi {...iconProps} />
    case 'home':
      return <Home {...iconProps} />
    case 'utensils':
      return <UtensilsCrossed {...iconProps} />
    case 'trophy':
      return <Trophy {...iconProps} />
    case 'bus':
      return <Bus {...iconProps} />
    default:
      return <Monitor {...iconProps} />
  }
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringFacilitiesSection({
  title = 'World-Class Infrastructure & Facilities',
  subtitle = 'Everything you need for an exceptional learning experience',
  facilities = [
    {
      title: 'Computer Centers',
      description: 'Modern computer labs with high-performance systems',
      highlight: '500+ Systems',
      icon: 'monitor',
    },
    {
      title: 'Engineering Workshops',
      description: 'Hands-on training facilities for practical learning',
      icon: 'wrench',
    },
    {
      title: 'Research Labs',
      description: 'Specialized labs for advanced research',
      highlight: 'AI/ML, IoT, Robotics',
      icon: 'flask',
    },
    {
      title: 'Digital Library',
      description: 'Extensive collection of books and digital resources',
      highlight: '50,000+ Books',
      icon: 'book',
    },
    {
      title: 'Wi-Fi Campus',
      description: 'High-speed internet connectivity across the campus',
      icon: 'wifi',
    },
    {
      title: 'Hostels',
      description: 'Comfortable accommodation with all amenities',
      highlight: 'Men & Women',
      icon: 'home',
    },
    {
      title: 'Cafeteria',
      description: 'Hygienic food court with variety of cuisines',
      icon: 'utensils',
    },
    {
      title: 'Sports Complex',
      description: 'Indoor and outdoor sports facilities',
      icon: 'trophy',
    },
    {
      title: 'Transportation',
      description: 'Fleet of buses covering major routes',
      icon: 'bus',
    },
  ],
  cta = { label: 'Explore All Facilities', link: '/facilities' },
  primaryColor = '#0b6d41',
  accentColor = '#ffde59',
  backgroundColor = '#ffffff',
  showAnimations = true,
  paddingY = 'lg',
  columns = '3',
  className,
  isEditing,
}: EngineeringFacilitiesSectionProps) {
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

        {/* Facilities Grid */}
        <div
          className={cn(
            'grid grid-cols-1 gap-5',
            columnClasses[columns],
            animateClass(200)
          )}
          style={{ transitionDelay: '200ms' }}
        >
          {facilities.map((facility, index) => {
            const CardContent = (
              <div
                className="group relative p-5 sm:p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
                style={{
                  transitionDelay: `${(index + 2) * 50}ms`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${primaryColor}10`,
                    }}
                  >
                    <FacilityIcon icon={facility.icon} />
                    <style jsx>{`
                      div :global(svg) {
                        color: ${primaryColor};
                      }
                    `}</style>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: primaryColor }}
                    >
                      {facility.title}
                    </h3>

                    {facility.highlight && (
                      <div
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2"
                        style={{
                          backgroundColor: `${accentColor}30`,
                          color: primaryColor,
                        }}
                      >
                        {facility.highlight}
                      </div>
                    )}

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {facility.description}
                    </p>

                    {facility.link && (
                      <div
                        className="flex items-center gap-1 text-sm font-medium mt-3 group-hover:gap-2 transition-all duration-300"
                        style={{ color: primaryColor }}
                      >
                        <span>Learn More</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Image overlay for facilities with images */}
                {facility.image && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={facility.image}
                        alt={facility.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )

            return facility.link ? (
              <Link key={index} href={facility.link} className="block h-full">
                {CardContent}
              </Link>
            ) : (
              <div key={index} className="h-full">
                {CardContent}
              </div>
            )
          })}
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && facilities.length === 0 && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Add facilities to display</p>
        </div>
      )}
    </section>
  )
}
