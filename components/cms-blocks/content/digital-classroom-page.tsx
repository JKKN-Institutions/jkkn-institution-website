'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Monitor,
  Wifi,
  Presentation,
  Video,
  Users,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Laptop,
} from 'lucide-react'

/**
 * Feature item schema
 */
export const FeatureItemSchema = z.object({
  text: z.string(),
  icon: z.string().optional(),
})

export type FeatureItem = z.infer<typeof FeatureItemSchema>

/**
 * Content paragraph schema
 */
export const ContentParagraphSchema = z.object({
  text: z.string(),
})

export type ContentParagraph = z.infer<typeof ContentParagraphSchema>

/**
 * DigitalClassroomPage props schema
 */
export const DigitalClassroomPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('Digital Class Room'),
  headerSubtitle: z.string().optional(),

  // Hero Image
  heroImage: z.string().default('/images/facilities/digital-classroom.jpg'),
  heroImageAlt: z.string().default('JKKN Digital Classroom'),
  showHeroImage: z.boolean().default(true),

  // Content
  paragraphs: z.array(ContentParagraphSchema).default([]),

  // Features
  showFeatures: z.boolean().default(true),
  featuresTitle: z.string().optional(),
  features: z.array(FeatureItemSchema).default([]),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type DigitalClassroomPageProps = z.infer<typeof DigitalClassroomPagePropsSchema> & BaseBlockProps

/**
 * Default content paragraphs
 */
const defaultParagraphs: ContentParagraph[] = [
  {
    text: 'JKKN Educational Institutions prioritizes exceptional classroom facilities as a crucial aspect of a great learning environment. Our classrooms are thoughtfully designed to offer a comfortable and engaging space for students to thrive and progress in their studies.',
  },
  {
    text: 'Our facilities boast cutting-edge technology, including high-speed internet, multimedia projectors, and interactive whiteboards, providing students with access to a vast array of information at their fingertips. We also ensure that our seating arrangements are comfortable and conducive to learning, eliminating distractions and disruptions.',
  },
  {
    text: 'With modern furnishings, proper ventilation, excellent lighting, and inspiring posters, our classrooms provide a warm and welcoming atmosphere that fosters a passion for learning.',
  },
]

/**
 * Default features
 */
const defaultFeatures: FeatureItem[] = [
  { text: 'Digital classrooms are equipped with the latest technology', icon: 'Monitor' },
  { text: 'Interactive whiteboards', icon: 'Presentation' },
  { text: 'High-speed internet', icon: 'Wifi' },
  { text: 'Multimedia resources', icon: 'Video' },
  { text: 'Collaboration tools', icon: 'Users' },
]

/**
 * Intersection Observer hook
 */
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

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

/**
 * Get icon component by name
 */
function getIconComponent(iconName: string) {
  const icons: Record<string, typeof Monitor> = {
    Monitor,
    Wifi,
    Presentation,
    Video,
    Users,
    CheckCircle2,
    GraduationCap,
    Lightbulb,
    Laptop,
  }
  return icons[iconName] || CheckCircle2
}

/**
 * DigitalClassroomPage Component
 */
export default function DigitalClassroomPage({
  showHeader = true,
  headerTitle = 'Digital Class Room',
  headerSubtitle,
  heroImage = '/images/facilities/digital-classroom.jpg',
  heroImageAlt = 'JKKN Digital Classroom',
  showHeroImage = true,
  paragraphs = defaultParagraphs,
  showFeatures = true,
  featuresTitle,
  features = defaultFeatures,
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
  className,
}: DigitalClassroomPageProps) {
  const { ref: headerRef, isInView: headerInView } = useInView(0.1)
  const { ref: contentRef, isInView: contentInView } = useInView(0.1)
  const { ref: featuresRef, isInView: featuresInView } = useInView(0.1)
  const isDark = variant === 'modern-dark'

  const displayParagraphs = paragraphs.length > 0 ? paragraphs : defaultParagraphs
  const displayFeatures = features.length > 0 ? features : defaultFeatures

  const cardStyles = {
    glass: cn(
      'backdrop-blur-md border',
      isDark
        ? 'bg-white/10 border-white/20'
        : 'bg-white/80 border-white/40 shadow-lg'
    ),
    solid: cn(
      isDark
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white border border-gray-200 shadow-lg'
    ),
    gradient: cn(
      'border',
      isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg'
    ),
  }

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        isDark ? 'bg-gray-900' : 'bg-[#fbfbee]',
        className
      )}
    >
      {/* Background Decorations */}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient overlay */}
          <div
            className={cn(
              'absolute top-0 left-0 w-full h-96',
              'bg-gradient-to-b',
              isDark
                ? 'from-[#0b6d41]/20 to-transparent'
                : 'from-[#0b6d41]/10 to-transparent'
            )}
          />

          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#ffde59]/10 blur-3xl" />
          <div className="absolute top-96 left-10 w-48 h-48 rounded-full bg-[#0b6d41]/10 blur-3xl" />
          <div className="absolute bottom-40 right-20 w-56 h-56 rounded-full bg-[#ffde59]/5 blur-3xl" />
        </div>
      )}

      {/* Hero Header */}
      {showHeader && (
        <div
          ref={headerRef}
          className={cn(
            'relative py-16 md:py-24',
            'bg-gradient-to-br from-[#0b6d41] via-[#0a5c37] to-[#084d2d]'
          )}
        >
          {/* Header decorations */}
          {showDecorations && (
            <>
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute bottom-10 right-20 w-24 h-24 rounded-full bg-[#ffde59]/10" />
              <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white/5" />
            </>
          )}

          <div className="container mx-auto px-4 relative z-10">
            <div
              className={cn(
                'max-w-4xl mx-auto text-center transition-all duration-700',
                headerInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {headerTitle}
              </h1>

              {/* Subtitle */}
              {headerSubtitle && (
                <p className="text-lg md:text-xl text-white/80">
                  {headerSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          {showHeroImage && heroImage && (
            <div
              ref={contentRef}
              className={cn(
                'mb-10 rounded-2xl overflow-hidden transition-all duration-700',
                cardStyles[cardStyle],
                contentInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={heroImage}
                  alt={heroImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                />
              </div>
            </div>
          )}

          {/* Content Paragraphs */}
          <div
            className={cn(
              'mb-10 p-6 md:p-8 rounded-2xl transition-all duration-700',
              cardStyles[cardStyle],
              contentInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="space-y-6">
              {displayParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    'text-base md:text-lg leading-relaxed',
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  )}
                >
                  {paragraph.text}
                </p>
              ))}
            </div>
          </div>

          {/* Features Section */}
          {showFeatures && displayFeatures.length > 0 && (
            <div
              ref={featuresRef}
              className={cn(
                'p-6 md:p-8 rounded-2xl transition-all duration-700',
                cardStyles[cardStyle],
                featuresInView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: '200ms' }}
            >
              {/* Features Title */}
              {featuresTitle && (
                <h2
                  className={cn(
                    'text-xl md:text-2xl font-bold mb-6',
                    isDark ? 'text-white' : 'text-[#0b6d41]'
                  )}
                >
                  {featuresTitle}
                </h2>
              )}

              {/* Features List */}
              <ul className="space-y-4">
                {displayFeatures.map((feature, index) => {
                  const IconComponent = getIconComponent(feature.icon || 'CheckCircle2')
                  return (
                    <li
                      key={index}
                      className={cn(
                        'flex items-center gap-4',
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                          'bg-[#0b6d41]/10'
                        )}
                      >
                        <IconComponent className="w-4 h-4 text-[#0b6d41]" />
                      </div>
                      <span className="text-base md:text-lg">{feature.text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
