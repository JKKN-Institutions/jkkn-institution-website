'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
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
  Cpu,
  Headphones,
  ScreenShare,
  Projector,
  TabletSmartphone,
  CloudCog,
  Zap,
  BookOpen,
  BrainCircuit,
  Sparkles,
} from 'lucide-react'

/* ─── Schemas ──────────────────────────────────── */

export const TechSpecSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
})
export type TechSpec = z.infer<typeof TechSpecSchema>

export const StatItemSchema = z.object({
  icon: z.string(),
  value: z.string(),
  label: z.string(),
})
export type StatItem = z.infer<typeof StatItemSchema>

export const FeatureItemSchema = z.object({
  text: z.string(),
  icon: z.string().optional(),
})
export type FeatureItem = z.infer<typeof FeatureItemSchema>

export const ContentParagraphSchema = z.object({ text: z.string() })
export type ContentParagraph = z.infer<typeof ContentParagraphSchema>

export const DigitalClassroomPagePropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('Digital Classrooms'),
  headerSubtitle: z.string().default('Modern learning spaces powered by cutting-edge technology'),
  badge: z.string().default('Smart Learning'),

  // Images
  images: z
    .array(z.object({ src: z.string(), alt: z.string().optional() }))
    .default([]),

  // Content
  paragraphs: z.array(ContentParagraphSchema).default([]),

  // Stats
  showStats: z.boolean().default(true),
  stats: z.array(StatItemSchema).default([]),

  // Technology specs
  showTechSpecs: z.boolean().default(true),
  techSpecsTitle: z.string().default('Technology That Powers Learning'),
  techSpecs: z.array(TechSpecSchema).default([]),

  // Features
  showFeatures: z.boolean().default(true),
  featuresTitle: z.string().default('Learning Environment'),
  features: z.array(FeatureItemSchema).default([]),

  // CTA
  showCta: z.boolean().default(true),
  ctaTitle: z.string().default('Experience the Future of Learning'),
  ctaDescription: z.string().default(
    'Our digital classrooms combine world-class infrastructure with innovative pedagogy to create an unmatched learning experience.'
  ),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
  showDecorations: z.boolean().default(true),
})

export type DigitalClassroomPageProps = z.infer<typeof DigitalClassroomPagePropsSchema> &
  BaseBlockProps

/* ─── Default Data ─────────────────────────────── */

const defaultParagraphs: ContentParagraph[] = [
  {
    text: 'JKKN Educational Institutions prioritizes exceptional classroom facilities as a crucial aspect of a great learning environment. Our classrooms are thoughtfully designed to offer a comfortable and engaging space for students to thrive and progress in their studies.',
  },
  {
    text: 'Our facilities boast cutting-edge technology, including high-speed internet, multimedia projectors, and interactive whiteboards, providing students with access to a vast array of information at their fingertips.',
  },
  {
    text: 'With modern furnishings, proper ventilation, excellent lighting, and inspiring posters, our classrooms provide a warm and welcoming atmosphere that fosters a passion for learning.',
  },
]

const defaultStats: StatItem[] = [
  { icon: 'Monitor', value: '60+', label: 'Smart Classrooms' },
  { icon: 'Wifi', value: '500+', label: 'Mbps Internet' },
  { icon: 'Projector', value: '4K', label: 'Projectors' },
  { icon: 'Users', value: '5,000+', label: 'Students Served' },
]

const defaultTechSpecs: TechSpec[] = [
  {
    title: 'Interactive Smart Boards',
    description:
      'Touch-enabled 86-inch smart displays with multi-user collaboration, annotation tools, and wireless screen mirroring.',
    icon: 'Presentation',
  },
  {
    title: 'High-Speed Connectivity',
    description:
      'Enterprise-grade 500+ Mbps fibre-optic network with seamless Wi-Fi 6 coverage across every classroom.',
    icon: 'Wifi',
  },
  {
    title: '4K Multimedia Projectors',
    description:
      'Ultra-bright 4K laser projectors with crystal-clear visuals, enabling immersive presentations and video learning.',
    icon: 'Projector',
  },
  {
    title: 'Digital Learning Platform',
    description:
      'Integrated LMS access from every seat, enabling real-time quizzes, resource sharing, and assignment submissions.',
    icon: 'CloudCog',
  },
  {
    title: 'Audio-Visual System',
    description:
      'Professional ceiling-mounted microphone arrays and surround speakers ensure every student hears clearly.',
    icon: 'Headphones',
  },
  {
    title: 'Screen Sharing & Casting',
    description:
      'Students can wirelessly cast their devices to the classroom display for collaborative presentations.',
    icon: 'ScreenShare',
  },
]

const defaultFeatures: FeatureItem[] = [
  { text: 'Ergonomic seating with tablet arms', icon: 'Users' },
  { text: 'Climate-controlled environment', icon: 'Zap' },
  { text: 'Natural and LED hybrid lighting', icon: 'Lightbulb' },
  { text: 'Dedicated charging stations', icon: 'TabletSmartphone' },
  { text: 'AI-powered attendance system', icon: 'BrainCircuit' },
  { text: 'CCTV monitored for safety', icon: 'Monitor' },
  { text: 'Accessible for differently-abled', icon: 'CheckCircle2' },
  { text: 'Soundproof walls for focused learning', icon: 'Headphones' },
]

/* ─── Icon Resolver ────────────────────────────── */

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Wifi,
  Presentation,
  Video,
  Users,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Laptop,
  Cpu,
  Headphones,
  ScreenShare,
  Projector,
  TabletSmartphone,
  CloudCog,
  Zap,
  BookOpen,
  BrainCircuit,
  Sparkles,
}

function getIcon(name: string) {
  return ICON_MAP[name] || CheckCircle2
}

/* ─── Intersection Observer Hook ───────────────── */

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

/* ─── Animated Counter ─────────────────────────── */

function AnimatedCounter({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return

    const match = value.match(/^([\d,]+)(.*)$/)
    if (!match) {
      setDisplay(value)
      return
    }

    const target = parseInt(match[1].replace(/,/g, ''), 10)
    const suffix = match[2] || ''
    const duration = 2000
    const start = Date.now()

    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(target * eased)
      setDisplay(current.toLocaleString() + suffix)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [value, inView])

  return <span>{display}</span>
}

/* ─── Bento Image Gallery ──────────────────────── */

function BentoGallery({ images }: { images: { src: string; alt?: string }[] }) {
  const { ref, isInView } = useInView(0.05)
  const filtered = images.filter((img) => img.src)

  if (filtered.length === 0) return null

  // If 1 image: full-width hero
  if (filtered.length === 1) {
    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-700',
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <div className="relative aspect-[16/7] rounded-2xl overflow-hidden group">
          <Image
            src={filtered[0].src}
            alt={filtered[0].alt || 'Digital classroom'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </div>
    )
  }

  // If 2 images: side-by-side
  if (filtered.length === 2) {
    return (
      <div
        ref={ref}
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700',
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        {filtered.map((img, i) => (
          <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
            <Image
              src={img.src}
              alt={img.alt || `Classroom ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>
    )
  }

  // 3+ images: bento layout — large left, stacked right
  const [hero, ...rest] = filtered
  const sideImages = rest.slice(0, 3)
  const remaining = rest.slice(3)

  return (
    <div
      ref={ref}
      className={cn(
        'space-y-4 transition-all duration-700',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      {/* Bento: large left + stacked right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Featured large image */}
        <div className="lg:col-span-3 relative aspect-[4/3] lg:aspect-auto lg:min-h-[360px] rounded-2xl overflow-hidden group">
          <Image
            src={hero.src}
            alt={hero.alt || 'Digital classroom'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#0b6d41]">
              <Sparkles className="w-3 h-3" />
              Smart Classroom
            </div>
          </div>
        </div>

        {/* Side stack */}
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
          {sideImages.map((img, i) => (
            <div
              key={i}
              className={cn(
                'relative rounded-2xl overflow-hidden group',
                sideImages.length === 1
                  ? 'aspect-[4/3] lg:aspect-auto lg:min-h-[360px]'
                  : sideImages.length === 2
                    ? 'aspect-[4/3] lg:aspect-auto lg:min-h-[170px]'
                    : 'aspect-[4/3] lg:aspect-auto lg:min-h-[108px]'
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `Classroom ${i + 2}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Additional images in a flat grid */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {remaining.map((img, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <Image
                src={img.src}
                alt={img.alt || `Classroom ${i + 5}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ───────────────────────────── */

export default function DigitalClassroomPage({
  showHeader = true,
  headerTitle = 'Digital Classrooms',
  headerSubtitle = 'Modern learning spaces powered by cutting-edge technology',
  badge = 'Smart Learning',
  images = [],
  paragraphs = defaultParagraphs,
  showStats = true,
  stats = defaultStats,
  showTechSpecs = true,
  techSpecsTitle = 'Technology That Powers Learning',
  techSpecs = defaultTechSpecs,
  showFeatures = true,
  featuresTitle = 'Learning Environment',
  features = defaultFeatures,
  showCta = true,
  ctaTitle = 'Experience the Future of Learning',
  ctaDescription = 'Our digital classrooms combine world-class infrastructure with innovative pedagogy to create an unmatched learning experience.',
  showDecorations = true,
  className,
}: DigitalClassroomPageProps) {
  const displayParagraphs = paragraphs.length > 0 ? paragraphs : defaultParagraphs
  const displayStats = stats.length > 0 ? stats : defaultStats
  const displayTechSpecs = techSpecs.length > 0 ? techSpecs : defaultTechSpecs
  const displayFeatures = features.length > 0 ? features : defaultFeatures

  const { ref: introRef, isInView: introInView } = useInView(0.1)
  const { ref: statsRef, isInView: statsInView } = useInView(0.1)
  const { ref: techRef, isInView: techInView } = useInView(0.05)
  const { ref: featRef, isInView: featInView } = useInView(0.1)
  const { ref: ctaRef, isInView: ctaInView } = useInView(0.1)

  return (
    <section
      className={cn('relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50', className)}
    >
      {/* ═══ Hero Banner ═══════════════════════════════ */}
      {showHeader && (
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)',
          }}
        >
          {/* Decorative blurred gradients */}
          {showDecorations && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#ffde59]/10 blur-[100px]" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#0b6d41]/30 blur-[100px]" />
            </div>
          )}

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
              <Monitor className="w-3.5 h-3.5" />
              {badge}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ffde59]">
              {headerTitle}
            </h1>

            {headerSubtitle && (
              <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                {headerSubtitle}
              </p>
            )}

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
              <div className="w-2 h-2 rotate-45 bg-[#ffde59]" />
              <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
            </div>
          </div>

          {/* Bottom curve */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-8 md:h-12"
              preserveAspectRatio="none"
            >
              <path
                d="M0 48h1440V24C1200 0 960 0 720 24S240 48 0 24v24z"
                fill="#f9fafb"
                fillOpacity="0.5"
              />
              <path d="M0 48h1440V32C1200 8 960 8 720 32S240 56 0 32v16z" fill="#f9fafb" />
            </svg>
          </div>
        </div>
      )}

      {/* ═══ Content Area ══════════════════════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          {/* ─── Bento Image Gallery ─────────────────── */}
          <BentoGallery images={images} />

          {/* ─── Introduction ────────────────────────── */}
          {displayParagraphs.length > 0 && (
            <div
              ref={introRef}
              className={cn(
                'bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-700',
                introInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#0b6d41]/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#0b6d41]" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  About Our Classrooms
                </h2>
              </div>
              <div className="space-y-4">
                {displayParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] md:text-base leading-[1.8] text-gray-600"
                  >
                    {p.text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ─── Stats Bar ───────────────────────────── */}
          {showStats && displayStats.length > 0 && (
            <div
              ref={statsRef}
              className={cn(
                'grid gap-4 transition-all duration-700 delay-100',
                displayStats.length <= 2
                  ? 'grid-cols-2'
                  : displayStats.length === 3
                    ? 'grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-4',
                statsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
            >
              {displayStats.map((stat, i) => {
                const Icon = getIcon(stat.icon)
                return (
                  <div
                    key={i}
                    className="relative bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm text-center overflow-hidden group hover:shadow-md transition-all duration-300"
                  >
                    {/* Accent top bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0b6d41] to-[#0b6d41]/60" />

                    <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-3 bg-[#0b6d41]/10 group-hover:bg-[#0b6d41]/15 transition-colors">
                      <Icon className="w-6 h-6 text-[#0b6d41]" />
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

          {/* ─── Technology Specifications ────────────── */}
          {showTechSpecs && displayTechSpecs.length > 0 && (
            <div
              ref={techRef}
              className={cn(
                'transition-all duration-700 delay-200',
                techInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 rounded-full bg-[#0b6d41]" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {techSpecsTitle}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    State-of-the-art infrastructure in every classroom
                  </p>
                </div>
              </div>

              {/* Tech spec cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayTechSpecs.map((spec, i) => {
                  const Icon = getIcon(spec.icon || 'Cpu')
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-400 hover:-translate-y-1 group"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b6d41]/15 to-[#0b6d41]/5 flex items-center justify-center mb-4 group-hover:from-[#0b6d41]/20 group-hover:to-[#0b6d41]/10 transition-all">
                        <Icon className="w-6 h-6 text-[#0b6d41]" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {spec.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-500">
                        {spec.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── Learning Environment Features ────────── */}
          {showFeatures && displayFeatures.length > 0 && (
            <div
              ref={featRef}
              className={cn(
                'transition-all duration-700 delay-300',
                featInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-8 rounded-full bg-[#0b6d41]" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {featuresTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {displayFeatures.map((feature, i) => {
                  const Icon = getIcon(feature.icon || 'CheckCircle2')
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center group-hover:bg-[#0b6d41]/15 transition-colors">
                        <Icon className="w-5 h-5 text-[#0b6d41]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {feature.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ─── CTA / Closing Section ───────────────── */}
          {showCta && (
            <div
              ref={ctaRef}
              className={cn(
                'relative rounded-2xl overflow-hidden transition-all duration-700 delay-200',
                ctaInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              )}
              style={{
                background:
                  'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)',
              }}
            >
              {/* Decorative glow */}
              {showDecorations && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#ffde59]/10 blur-[80px]" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#0b6d41]/30 blur-[80px]" />
                </div>
              )}

              <div className="relative z-10 px-6 md:px-12 py-10 md:py-14 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-[#ffde59]/90 uppercase mb-4">
                  <GraduationCap className="w-3.5 h-3.5" />
                  JKKN Institutions
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {ctaTitle}
                </h2>

                <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                  {ctaDescription}
                </p>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="h-px w-10 bg-[#ffde59]/30" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#ffde59]" />
                  <div className="h-px w-10 bg-[#ffde59]/30" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
