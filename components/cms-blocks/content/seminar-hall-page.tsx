'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Users,
  Presentation,
  Sun,
  Projector,
  Wifi,
  Armchair,
  Wind,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Sparkles,
  Award,
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
 * Stat item schema
 */
export const StatItemSchema = z.object({
  icon: z.string(),
  value: z.string(),
  label: z.string(),
})

export type StatItem = z.infer<typeof StatItemSchema>

/**
 * Content paragraph schema
 */
export const ContentParagraphSchema = z.object({
  text: z.string(),
})

export type ContentParagraph = z.infer<typeof ContentParagraphSchema>

/**
 * SeminarHallPage props schema
 */
export const SeminarHallPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  badge: z.string().default('Premium Facility'),
  headerTitle: z.string().default('SEMINAR HALL'),
  headerSubtitle: z.string().optional(),

  // Hero Image
  heroImage: z.string().default('/images/facilities/seminar-hall.jpg'),
  heroImageAlt: z.string().default('JKKN Seminar Hall'),
  showHeroImage: z.boolean().default(true),

  // Content
  introduction: z.string().default(
    'Our seminar hall is designed to offer a comfortable and engaging learning environment to all attendees, with a generous seating capacity and modern amenities.'
  ),
  additionalContent: z.string().optional(),
  paragraphs: z.array(ContentParagraphSchema).default([]),

  // Features
  showFeatures: z.boolean().default(true),
  featuresTitle: z.string().default('Key Features'),
  features: z.array(FeatureItemSchema).default([
    { text: 'Spacious and well-lit', icon: 'Sun' },
    { text: 'Audio-visual equipment', icon: 'Projector' },
    { text: 'Internet connectivity', icon: 'Wifi' },
    { text: 'Comfortable seating', icon: 'Armchair' },
    { text: 'Air conditioning', icon: 'Wind' },
    { text: 'Hygiene standards', icon: 'ShieldCheck' },
  ]),

  // Stats (optional)
  showStats: z.boolean().default(true),
  stats: z.array(StatItemSchema).default([
    { icon: 'Users', value: '500+', label: 'Seating Capacity' },
    { icon: 'Calendar', value: '100+', label: 'Events Yearly' },
  ]),

  // Styling
  variant: z.enum(['modern-light', 'modern-dark']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type SeminarHallPageProps = z.infer<typeof SeminarHallPagePropsSchema> & BaseBlockProps

/**
 * Default content paragraphs
 */
const defaultParagraphs: ContentParagraph[] = [
  {
    text: 'Our seminar hall is designed to offer a comfortable and engaging learning environment to all attendees, with a generous seating capacity and modern amenities.',
  },
  {
    text: 'Fully air-conditioned and equipped with a stage, projector, sound system, and lighting equipment.',
  },
  {
    text: 'High-speed Wi-Fi and ample parking facilities.',
  },
  {
    text: 'Team of skilled technicians and support staff available.',
  },
]

/**
 * Default features
 */
const defaultFeatures: FeatureItem[] = [
  { text: 'Spacious and well-lit', icon: 'Sun' },
  { text: 'Audio-visual equipment', icon: 'Projector' },
  { text: 'Internet connectivity', icon: 'Wifi' },
  { text: 'Comfortable seating', icon: 'Armchair' },
  { text: 'Air conditioning', icon: 'Wind' },
  { text: 'Hygiene standards', icon: 'ShieldCheck' },
]

/**
 * Default stats
 */
const defaultStats: StatItem[] = [
  { icon: 'Users', value: '500+', label: 'Seating Capacity' },
  { icon: 'Calendar', value: '100+', label: 'Events Yearly' },
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
 * Animated counter component
 */
function AnimatedCounter({ value, inView }: { value: string; inView: boolean }) {
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!inView) return

    const match = value.match(/^([\d,]+)(.*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const targetNum = parseInt(match[1].replace(/,/g, ''), 10)
    const suffix = match[2] || ''
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(targetNum * easeOut)

      setDisplayValue(current.toLocaleString() + suffix)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, inView])

  return <span>{displayValue}</span>
}

/**
 * Get icon component by name
 */
function getIconComponent(iconName: string) {
  const icons: Record<string, typeof Users> = {
    Users,
    Presentation,
    Sun,
    Projector,
    Wifi,
    Armchair,
    Wind,
    ShieldCheck,
    Calendar,
    CheckCircle2,
    Sparkles,
    Award,
  }
  return icons[iconName] || CheckCircle2
}

/**
 * SeminarHallPage Component
 *
 * A modern facility page for seminar hall with hero image, description, and features.
 * Follows the Modern Trust Section design pattern with glassmorphism effects.
 */
export default function SeminarHallPage({
  showHeader = true,
  badge = 'Premium Facility',
  headerTitle = 'SEMINAR HALL',
  headerSubtitle,
  heroImage = '/images/facilities/seminar-hall.jpg',
  heroImageAlt = 'JKKN Seminar Hall',
  showHeroImage = true,
  introduction,
  additionalContent,
  paragraphs = defaultParagraphs,
  showFeatures = true,
  featuresTitle = 'Key Features',
  features = defaultFeatures,
  showStats = true,
  stats = defaultStats,
  variant = 'modern-light',
  cardStyle = 'glass',
  showDecorations = true,
  className,
}: SeminarHallPageProps) {
  const { ref: sectionRef, isInView: sectionInView } = useInView(0.1)
  const { ref: contentRef, isInView: contentInView } = useInView(0.1)
  const { ref: featuresRef, isInView: featuresInView } = useInView(0.1)
  const { ref: statsRef, isInView: statsInView } = useInView(0.1)

  const isDark = variant === 'modern-dark'

  const displayParagraphs = paragraphs.length > 0 ? paragraphs : defaultParagraphs
  const displayFeatures = features.length > 0 ? features : defaultFeatures
  const displayStats = stats.length > 0 ? stats : defaultStats

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
      ref={sectionRef}
      className={cn(
        'relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden',
        isDark ? 'bg-gray-900' : '',
        className
      )}
      style={
        !isDark
          ? { background: 'linear-gradient(135deg, #fbfbfb 0%, #f0f0f0 100%)' }
          : undefined
      }
    >
      {/* Background Decorations */}
      {showDecorations && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Dot pattern */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{
              backgroundImage: `radial-gradient(${isDark ? '#ffffff' : '#0b6d41'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Decorative blurred circles */}
          <div
            className={cn(
              'absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full filter blur-[100px]',
              isDark ? 'bg-[#0b6d41] opacity-20' : 'bg-[#0b6d41] opacity-10'
            )}
          />
          <div
            className={cn(
              'absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full filter blur-[100px]',
              isDark ? 'bg-[#ffde59] opacity-20' : 'bg-[#ffde59] opacity-10'
            )}
          />
          <div className="absolute top-1/2 right-10 w-48 h-48 rounded-full bg-[#0b6d41]/5 blur-3xl" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 md:space-y-16">
        {/* Header Section */}
        {showHeader && (
          <div
            className={cn(
              'text-center transition-all duration-1000 transform',
              sectionInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            )}
          >
            {/* Badge */}
            <div className="inline-flex items-center justify-center p-2 mb-4 bg-white/50 backdrop-blur-sm rounded-full border border-[#0b6d41]/10 shadow-sm">
              <Presentation className="w-4 h-4 text-[#0b6d41] mr-2" />
              <span
                className={cn(
                  'text-sm font-bold tracking-wider uppercase',
                  isDark ? 'text-white' : 'text-[#0b6d41]'
                )}
              >
                {badge}
              </span>
            </div>

            {/* Title */}
            <h1
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight font-serif',
                isDark ? 'text-white' : 'text-[#0b6d41]'
              )}
            >
              {headerTitle}
            </h1>

            {/* Subtitle */}
            {headerSubtitle && (
              <p
                className={cn(
                  'text-xl max-w-2xl mx-auto font-light',
                  isDark ? 'text-gray-300' : 'text-gray-600'
                )}
              >
                {headerSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Main Content Card */}
        <div
          ref={contentRef}
          className={cn(
            'rounded-[2.5rem] overflow-hidden transition-all duration-1000 delay-300 transform',
            cardStyles[cardStyle],
            contentInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          )}
        >
          {/* Hero Image */}
          {showHeroImage && heroImage && (
            <div className="relative w-full aspect-video">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 md:p-10 lg:p-12">
            {/* Introduction */}
            {introduction && (
              <p
                className={cn(
                  'text-lg md:text-xl leading-relaxed mb-6',
                  isDark ? 'text-gray-200' : 'text-gray-700'
                )}
              >
                {introduction}
              </p>
            )}

            {/* Paragraphs */}
            <div className="space-y-4">
              {displayParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    'text-base md:text-lg leading-relaxed',
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  )}
                >
                  {paragraph.text}
                </p>
              ))}
            </div>

            {/* Additional Content */}
            {additionalContent && (
              <p
                className={cn(
                  'text-base md:text-lg leading-relaxed mt-4',
                  isDark ? 'text-gray-300' : 'text-gray-600'
                )}
              >
                {additionalContent}
              </p>
            )}
          </div>
        </div>

        {/* Features Section */}
        {showFeatures && displayFeatures.length > 0 && (
          <div
            ref={featuresRef}
            className={cn(
              'transition-all duration-1000 delay-500 transform',
              featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            )}
          >
            {/* Features Title */}
            {featuresTitle && (
              <h2
                className={cn(
                  'text-2xl md:text-3xl font-bold mb-8 text-center relative inline-block w-full',
                  isDark ? 'text-white' : 'text-[#0b6d41]'
                )}
              >
                <span className="relative">
                  {featuresTitle}
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#ffde59] rounded-full" />
                </span>
              </h2>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayFeatures.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon || 'CheckCircle2')
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-5 md:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                      cardStyles[cardStyle]
                    )}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                          'bg-[#0b6d41]/10'
                        )}
                      >
                        <IconComponent className="w-6 h-6 text-[#0b6d41]" />
                      </div>
                      <span
                        className={cn(
                          'text-base md:text-lg font-medium',
                          isDark ? 'text-gray-200' : 'text-gray-700'
                        )}
                      >
                        {feature.text}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Stats Section */}
        {showStats && displayStats.length > 0 && (
          <div
            ref={statsRef}
            className={cn(
              'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-1000 delay-700 transform',
              statsInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            )}
          >
            {displayStats.map((stat, index) => {
              const IconComponent = getIconComponent(stat.icon)
              return (
                <div
                  key={index}
                  className={cn(
                    'p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                    cardStyles[cardStyle]
                  )}
                >
                  <div
                    className={cn(
                      'w-14 h-14 rounded-xl mx-auto flex items-center justify-center mb-4',
                      'bg-[#0b6d41]/10'
                    )}
                  >
                    <IconComponent className="w-7 h-7 text-[#0b6d41]" />
                  </div>
                  <div
                    className={cn(
                      'text-3xl md:text-4xl font-bold mb-1',
                      isDark ? 'text-white' : 'text-[#0f172a]'
                    )}
                  >
                    <AnimatedCounter value={stat.value} inView={statsInView} />
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium uppercase tracking-wide',
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    )}
                  >
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
