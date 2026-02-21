'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { GraduationCap, Users, TrendingUp, Building2, ChevronRight, Phone } from 'lucide-react'
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
// Animated Counter Hook
// ==========================================

function useAnimatedCounter(end: number, duration: number = 2000, isInView: boolean) {
  const [count, setCount] = useState(end)

  useEffect(() => {
    if (!isInView) return

    // Reset to 0 then animate up
    setCount(0)
    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isInView])

  return count
}

// ==========================================
// Zod Schema
// ==========================================

export const EngineeringHeroSectionPropsSchema = z.object({
  // Title
  title: z.string().default('Shape Your Future in Engineering & Technology'),
  subtitle: z.string().default('AICTE Approved | Anna University Affiliated | NAAC Accredited'),
  description: z.string().default('Join one of the leading engineering colleges with 70+ years of educational excellence. World-class faculty, state-of-the-art infrastructure, and 95%+ placement record.'),

  // Badge
  badge: z.string().default('AICTE Approved | Anna University Affiliated | NAAC Accredited'),

  // Stats
  stats: z.array(z.object({
    value: z.number(),
    suffix: z.string().default('+'),
    label: z.string(),
    icon: z.enum(['graduation', 'trending', 'building', 'users']).default('graduation'),
  })).default([
    { value: 3000, suffix: '+', label: 'Learners', icon: 'graduation' },
    { value: 95, suffix: '%', label: 'Placement', icon: 'trending' },
    { value: 50, suffix: '+', label: 'Recruiters', icon: 'building' },
    { value: 12, suffix: '+', label: 'Programs', icon: 'users' },
  ]),

  // CTAs
  primaryCta: z.object({
    label: z.string().default('Apply Now'),
    link: z.string().default('https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8'),
  }).default({ label: 'Apply Now', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8' }),

  secondaryCta: z.object({
    label: z.string().default('Explore Programs'),
    link: z.string().default('#programs'),
  }).default({ label: 'Explore Programs', link: '#programs' }),

  // Image
  heroImage: z.string().default('/images/engineering/campus-hero.jpg'),

  // Colors (using JKKN brand colors)
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),

  // Animation
  showAnimations: z.boolean().default(true),
})

export type EngineeringHeroSectionProps = z.infer<typeof EngineeringHeroSectionPropsSchema> & BaseBlockProps

// ==========================================
// Stat Icon Component
// ==========================================

function StatIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-5 h-5', className) }

  switch (icon) {
    case 'graduation':
      return <GraduationCap {...iconProps} />
    case 'trending':
      return <TrendingUp {...iconProps} />
    case 'building':
      return <Building2 {...iconProps} />
    case 'users':
      return <Users {...iconProps} />
    default:
      return <GraduationCap {...iconProps} />
  }
}

// ==========================================
// Stat Card Component
// ==========================================

function StatCard({
  stat,
  isInView,
  accentColor,
  primaryColor,
}: {
  stat: { value: number; suffix: string; label: string; icon: string }
  isInView: boolean
  accentColor: string
  primaryColor: string
}) {
  const count = useAnimatedCounter(stat.value, 2000, isInView)

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
      >
        <StatIcon icon={stat.icon} className="text-gray-900" />
      </div>
      <div>
        <div
          className="text-2xl font-bold tabular-nums inline-block"
          style={{ color: primaryColor, minWidth: '4.5rem' }}
        >
          {count}{stat.suffix}
        </div>
        <div className="text-sm text-gray-600">
          {stat.label}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringHeroSection({
  title = 'Shape Your Future in Engineering & Technology',
  subtitle = 'AICTE Approved | Anna University Affiliated | NAAC Accredited',
  description = 'Join one of the leading engineering colleges with 70+ years of educational excellence. World-class faculty, state-of-the-art infrastructure, and 95%+ placement record.',
  badge = 'AICTE Approved | Anna University Affiliated | NAAC Accredited',
  stats = [
    { value: 3000, suffix: '+', label: 'Learners', icon: 'graduation' },
    { value: 95, suffix: '%', label: 'Placement', icon: 'trending' },
    { value: 50, suffix: '+', label: 'Recruiters', icon: 'building' },
    { value: 12, suffix: '+', label: 'Programs', icon: 'users' },
  ],
  primaryCta = { label: 'Apply Now', link: 'https://admission.jkkn.ac.in/form/jkkn-institution-admission-yxs3w8' },
  secondaryCta = { label: 'Explore Programs', link: '#programs' },
  heroImage = '/images/engineering/campus-hero.jpg',
  primaryColor = '#0b6d41',
  accentColor = '#ffde59',
  showAnimations = true,
  className,
  isEditing,
}: EngineeringHeroSectionProps) {
  const sectionRef = useInView(0.1)

  // Animate only below-the-fold elements to avoid penalizing LCP
  const animateClass = (delay: number) =>
    showAnimations
      ? cn(
          'transition-opacity duration-700',
          sectionRef.isInView ? 'opacity-100' : 'opacity-0'
        )
      : ''

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden', className)}
      style={{
        backgroundColor: '#fbfbee',
      }}
    >
      {/* Decorative elements */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${accentColor} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${primaryColor} 0%, transparent 40%)`,
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] pt-2 pb-6 lg:pt-4 lg:pb-10">
          {/* Left Content - No opacity animation on above-the-fold LCP elements */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: primaryColor,
                color: '#ffffff',
              }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{badge}</span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl 2xl:text-6xl font-bold leading-tight mb-6"
              style={{ color: primaryColor }}
            >
              {title}
            </h1>

            {/* Description - LCP element, must render immediately */}
            <p
              className="text-lg sm:text-xl mb-8 max-w-xl"
              style={{ color: '#000000' }}
            >
              {description}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                href={primaryCta.link}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-gray-900 transition-all duration-300 hover:scale-105 shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                <span>{primaryCta.label}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>

              <Link
                href={secondaryCta.link}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-md"
                style={{
                  color: primaryColor,
                  border: `2px solid ${primaryColor}`,
                  backgroundColor: 'transparent'
                }}
              >
                <span>{secondaryCta.label}</span>
              </Link>
            </div>

            {/* Stats Grid */}
            <div
              className={cn(
                'grid grid-cols-2 sm:grid-cols-4 gap-3',
                animateClass(400)
              )}
              style={{ transitionDelay: '400ms' }}
            >
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  stat={stat}
                  isInView={sectionRef.isInView}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          </div>

          {/* Right Content - Image - No opacity animation (LCP critical) */}
          <div
            className="relative block"
          >
            <div className="relative">
              {/* Decorative frame */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${accentColor} 0%, transparent 50%)`,
                }}
              />

              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={heroImage}
                    alt="JKKN Engineering College Campus"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 92vw, (max-width: 1024px) 90vw, 45vw"
                    quality={60}
                  />
                </div>

                {/* Floating info card - responsive visibility */}
                <div
                  className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl backdrop-blur-md bg-white/90 shadow-lg"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500">Admissions Helpline</div>
                      <div className="text-base sm:text-lg font-bold" style={{ color: primaryColor }}>
                        +91 9345855001
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges - responsive sizing */}
              <div
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-gray-900 font-bold text-center text-xs sm:text-sm shadow-xl animate-pulse"
                style={{ backgroundColor: accentColor }}
              >
                70+<br />Years Legacy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      {/* Empty state for editing */}
      {isEditing && !title && (
        <div className="p-8 border-2 border-dashed border-white/30 rounded-lg text-center text-white">
          <p>Configure hero section content</p>
        </div>
      )}
    </section>
  )
}
