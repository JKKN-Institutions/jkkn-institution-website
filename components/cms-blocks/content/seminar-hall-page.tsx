'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useEffect, useState } from 'react'
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
  MapPin,
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
  headerTitle: z.string().default('SENTHURAJA HALL'),
  headerSubtitle: z.string().optional(),

  // Images
  images: z.array(z.object({ src: z.string(), alt: z.string().optional() })).default([]),

  // Hero Image (legacy support)
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
    MapPin,
  }
  return icons[iconName] || CheckCircle2
}

/**
 * SeminarHallPage Component
 *
 * A modern facility page for seminar hall with hero banner, image gallery,
 * description, features grid, and animated stats.
 */
export default function SeminarHallPage({
  showHeader = true,
  badge = 'Premium Facility',
  headerTitle = 'SENTHURAJA HALL',
  headerSubtitle,
  images = [],
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
  showDecorations = true,
  className,
}: SeminarHallPageProps) {
  const { ref: contentRef, isInView: contentInView } = useInView(0.1)
  const { ref: featuresRef, isInView: featuresInView } = useInView(0.1)
  const { ref: statsRef, isInView: statsInView } = useInView(0.1)

  const displayParagraphs = paragraphs.length > 0 ? paragraphs : defaultParagraphs
  const displayFeatures = features.length > 0 ? features : defaultFeatures
  const displayStats = stats.length > 0 ? stats : defaultStats

  // Build gallery images from `images` prop or fallback to single heroImage
  const filteredImages = images.filter((img) => img.src)
  const galleryImages =
    filteredImages.length > 0
      ? filteredImages
      : heroImage
        ? [{ src: heroImage, alt: heroImageAlt }]
        : []

  return (
    <section className={cn('relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50', className)}>
      {/* ─── Hero Banner ─────────────────────────────── */}
      {showHeader && (
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)' }}
        >
          {/* Decorative blurred gradients (no dots) */}
          {showDecorations && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#ffde59]/10 blur-[100px]" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#0b6d41]/30 blur-[100px]" />
            </div>
          )}

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
              <Presentation className="w-3.5 h-3.5" />
              {badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ffde59]">
              {headerTitle}
            </h1>

            {headerSubtitle && (
              <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                {headerSubtitle}
              </p>
            )}

            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
              <div className="w-2 h-2 rotate-45 bg-[#ffde59]" />
              <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" className="w-full h-8 md:h-12" preserveAspectRatio="none">
              <path d="M0 48h1440V24C1200 0 960 0 720 24S240 48 0 24v24z" fill="#f9fafb" fillOpacity="0.5" />
              <path d="M0 48h1440V32C1200 8 960 8 720 32S240 56 0 32v16z" fill="#f9fafb" />
            </svg>
          </div>
        </div>
      )}

      {/* ─── Content Area ────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
          {/* ─── Images Grid ─────────────────────────── */}
          {showHeroImage && galleryImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <Image
                    src={image.src}
                    alt={image.alt || `Seminar hall image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ─── Introduction ─────────────────────────── */}
          <div
            ref={contentRef}
            className={cn(
              'bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-700',
              contentInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            {introduction && (
              <p className="text-base md:text-lg leading-relaxed text-gray-700 font-medium mb-4">
                {introduction}
              </p>
            )}

            <div className="space-y-4">
              {displayParagraphs.map((paragraph, index) => (
                <p key={index} className="text-[15px] md:text-base leading-[1.8] text-gray-600">
                  {paragraph.text}
                </p>
              ))}
            </div>

            {additionalContent && (
              <p className="text-[15px] md:text-base leading-[1.8] text-gray-600 mt-4">
                {additionalContent}
              </p>
            )}
          </div>

          {/* ─── Stats Bar ────────────────────────────── */}
          {showStats && displayStats.length > 0 && (
            <div
              ref={statsRef}
              className={cn(
                'grid gap-4 transition-all duration-700 delay-200',
                displayStats.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4',
                statsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
            >
              {displayStats.map((stat, index) => {
                const IconComponent = getIconComponent(stat.icon)
                return (
                  <div
                    key={index}
                    className="relative bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm text-center overflow-hidden group hover:shadow-md transition-all duration-300"
                  >
                    {/* Subtle accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0b6d41] to-[#0b6d41]/60" />

                    <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 bg-[#0b6d41]/10 group-hover:bg-[#0b6d41]/15 transition-colors">
                      <IconComponent className="w-6 h-6 text-[#0b6d41]" />
                    </div>

                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      <AnimatedCounter value={stat.value} inView={statsInView} />
                    </div>

                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ─── Features Grid ────────────────────────── */}
          {showFeatures && displayFeatures.length > 0 && (
            <div
              ref={featuresRef}
              className={cn(
                'transition-all duration-700 delay-300',
                featuresInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
            >
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
                {featuresTitle}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayFeatures.map((feature, index) => {
                  const IconComponent = getIconComponent(feature.icon || 'CheckCircle2')
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#0b6d41]/10 group-hover:bg-[#0b6d41]/15 transition-colors">
                          <IconComponent className="w-5 h-5 text-[#0b6d41]" />
                        </div>
                        <span className="text-sm md:text-[15px] font-medium text-gray-700">
                          {feature.text}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
