'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import {
  Heart,
  GraduationCap,
  Users,
  Building2,
  Stethoscope,
  Award,
  Calendar,
  MapPin,
  type LucideIcon
} from 'lucide-react'
import Image from 'next/image'

/**
 * Milestone item schema
 */
export const MilestoneItemSchema = z.object({
  year: z.string().describe('Year of milestone'),
  title: z.string().describe('Milestone title'),
  description: z.string().optional().describe('Milestone description'),
})

export type MilestoneItem = z.infer<typeof MilestoneItemSchema>

/**
 * Stat item schema
 */
export const TrustStatItemSchema = z.object({
  icon: z.string().describe('Icon name'),
  value: z.string().describe('Stat value'),
  label: z.string().describe('Stat label'),
})

export type TrustStatItem = z.infer<typeof TrustStatItemSchema>

/**
 * OurTrust props schema
 */
export const OurTrustPropsSchema = z.object({
  // Page Header
  pageTitle: z.string().default('OUR TRUST').describe('Main page title'),
  pageSubtitle: z.string().default('J.K.K. Rangammal Charitable Trust').describe('Page subtitle'),

  // Founder Section
  founderName: z.string().default('SHRI. J.K.K. NATARAJAH').describe('Founder name'),
  founderTitle: z.string().default('Founder of J.K.K. Rangammal Charitable Trust').describe('Founder title'),
  founderImage: z.string().default('https://jkkn.ac.in/wp-content/uploads/2023/04/ft1-293x300-1.webp').describe('Founder image URL'),
  founderImageAlt: z.string().default('Shri J.K.K. Natarajah - Founder').describe('Founder image alt text'),

  // Trust Story
  storyTitle: z.string().default('Our Story').describe('Story section title'),
  storyContent: z.string().default(`In the 1960s, female children in Kumarapalayam had to walk 2.5 km to the nearby town of Bhavani for schooling. Some parents hesitated to send their daughters, while others ceased their children's education altogether, resulting in them staying at home or working in handlooms and dyeing industries. Recognizing the need for women's education, Shri J.K.K. Natarajah, a visionary philanthropist of the area, initiated a girls' school in the town in 1965, four years before the inception of the trust.

The Trust, J.K.K. Rangammal Charitable Trust (Reg No: 33), was established in 1969 with the mission of providing literacy and empowering women, aiming to upgrade the socio-economic status of the community. Following in her father's footsteps, Smt. N. Sendamaraai, Managing Trustee, expanded the service to offer multi-disciplinary education to both genders. Now, under the umbrella of the Trust, there are ten institutions, including Dental, Pharmacy, Nursing, Education, Engineering, Arts, and Science colleges, as well as Government-Aided Girls' School and Matriculation schools.

The Trust actively engages in various social service activities, including health-oriented services like free dental camps, treatments, surgeries, blood donation drives, and motivational and entrepreneurship awareness camps. It also extends its charitable efforts to provide medical support to the impoverished, assist the destitute, offer natural calamity support, grant educational scholarships to underprivileged students, and foster cultural enrichment. A pioneering establishment of the region since its inception, the Trust's grand service to society remains immense, not only in terms of education but also in community welfare.`).describe('Trust story content'),

  // Stats
  stats: z.array(TrustStatItemSchema).default([
    { icon: 'Calendar', value: '1969', label: 'Year Established' },
    { icon: 'Building2', value: '10+', label: 'Institutions' },
    { icon: 'GraduationCap', value: '50000+', label: 'Alumni' },
    { icon: 'Users', value: '5000+', label: 'Current Students' },
  ]).describe('Trust statistics'),

  // Milestones
  milestonesTitle: z.string().default('Key Milestones').describe('Milestones section title'),
  milestones: z.array(MilestoneItemSchema).default([
    { year: '1965', title: 'Girls School Founded', description: 'Started the first girls school in Kumarapalayam' },
    { year: '1969', title: 'Trust Established', description: 'J.K.K. Rangammal Charitable Trust officially registered' },
    { year: '1985', title: 'College Expansion', description: 'First professional college established' },
    { year: '2000', title: 'Multi-Disciplinary Growth', description: 'Expanded to 10+ institutions' },
  ]).describe('Key milestones in trust history'),

  // Styling
  backgroundColor: z.string().default('#0b6d41').describe('Primary background color'),
  accentColor: z.string().default('#ffde59').describe('Accent color'),
  textColor: z.string().default('#ffffff').describe('Text color'),
})

export type OurTrustProps = z.infer<typeof OurTrustPropsSchema> & BaseBlockProps

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Heart,
  GraduationCap,
  Users,
  Building2,
  Stethoscope,
  Award,
  Calendar,
  MapPin,
}

/**
 * Intersection Observer hook for animations
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
 * Animated Counter Component
 */
function AnimatedCounter({ value, isInView }: { value: string; isInView: boolean }) {
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!isInView) return

    // Extract number and suffix
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
  }, [value, isInView])

  return <span>{displayValue}</span>
}

/**
 * Stat Card Component
 */
function StatCard({
  stat,
  index,
  accentColor,
  isInView
}: {
  stat: TrustStatItem
  index: number
  accentColor: string
  isInView: boolean
}) {
  const IconComponent = iconMap[stat.icon] || Award

  return (
    <div
      className={cn(
        "relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20",
        "transform transition-all duration-700 hover:scale-105 hover:bg-white/15",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${accentColor}25` }}
      >
        <IconComponent className="w-7 h-7" style={{ color: accentColor }} />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
        <AnimatedCounter value={stat.value} isInView={isInView} />
      </div>
      <div className="text-white/70 font-medium">{stat.label}</div>
    </div>
  )
}

/**
 * Timeline Milestone Component
 */
function TimelineMilestone({
  milestone,
  index,
  accentColor,
  isInView,
  isLast
}: {
  milestone: MilestoneItem
  index: number
  accentColor: string
  isInView: boolean
  isLast: boolean
}) {
  return (
    <div
      className={cn(
        "relative pl-8 pb-8 transition-all duration-700",
        isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Timeline line */}
      {!isLast && (
        <div
          className="absolute left-[11px] top-8 bottom-0 w-0.5"
          style={{ backgroundColor: `${accentColor}40` }}
        />
      )}

      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 flex items-center justify-center"
        style={{ borderColor: accentColor, backgroundColor: '#0b6d41' }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Content */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
        <div
          className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-2"
          style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
        >
          {milestone.year}
        </div>
        <h4 className="text-lg font-bold text-white mb-1">{milestone.title}</h4>
        {milestone.description && (
          <p className="text-white/70 text-sm">{milestone.description}</p>
        )}
      </div>
    </div>
  )
}

/**
 * OurTrust Component - Modern Design
 *
 * Professional Trust page layout with:
 * - Hero section with gradient background
 * - Founder tribute with elegant image presentation
 * - Animated statistics
 * - Interactive timeline
 * - Rich trust story section
 */
export function OurTrust({
  pageTitle = 'OUR TRUST',
  pageSubtitle = 'J.K.K. Rangammal Charitable Trust',
  founderName = 'SHRI. J.K.K. NATARAJAH',
  founderTitle = 'Founder of J.K.K. Rangammal Charitable Trust',
  founderImage = 'https://jkkn.ac.in/wp-content/uploads/2023/04/ft1-293x300-1.webp',
  founderImageAlt = 'Shri J.K.K. Natarajah - Founder',
  storyTitle = 'Our Story',
  storyContent = '',
  stats = [],
  milestonesTitle = 'Key Milestones',
  milestones = [],
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff',
  className,
}: OurTrustProps) {
  const heroRef = useInView()
  const founderRef = useInView()
  const storyRef = useInView()
  const statsRef = useInView()
  const timelineRef = useInView()

  const defaultStats: TrustStatItem[] = [
    { icon: 'Calendar', value: '1969', label: 'Year Established' },
    { icon: 'Building2', value: '10+', label: 'Institutions' },
    { icon: 'GraduationCap', value: '50000+', label: 'Alumni' },
    { icon: 'Users', value: '5000+', label: 'Current Students' },
  ]

  const defaultMilestones: MilestoneItem[] = [
    { year: '1965', title: 'Girls School Founded', description: 'Started the first girls school in Kumarapalayam' },
    { year: '1969', title: 'Trust Established', description: 'J.K.K. Rangammal Charitable Trust officially registered' },
    { year: '1985', title: 'College Expansion', description: 'First professional college established' },
    { year: '2000', title: 'Multi-Disciplinary Growth', description: 'Expanded to 10+ institutions' },
  ]

  const displayStats = stats.length > 0 ? stats : defaultStats
  const displayMilestones = milestones.length > 0 ? milestones : defaultMilestones

  const defaultStoryContent = `In the 1960s, female children in Kumarapalayam had to walk 2.5 km to the nearby town of Bhavani for schooling. Some parents hesitated to send their daughters, while others ceased their children's education altogether, resulting in them staying at home or working in handlooms and dyeing industries. Recognizing the need for women's education, Shri J.K.K. Natarajah, a visionary philanthropist of the area, initiated a girls' school in the town in 1965, four years before the inception of the trust.

The Trust, J.K.K. Rangammal Charitable Trust (Reg No: 33), was established in 1969 with the mission of providing literacy and empowering women, aiming to upgrade the socio-economic status of the community. Following in her father's footsteps, Smt. N. Sendamaraai, Managing Trustee, expanded the service to offer multi-disciplinary education to both genders. Now, under the umbrella of the Trust, there are ten institutions, including Dental, Pharmacy, Nursing, Education, Engineering, Arts, and Science colleges, as well as Government-Aided Girls' School and Matriculation schools.

The Trust actively engages in various social service activities, including health-oriented services like free dental camps, treatments, surgeries, blood donation drives, and motivational and entrepreneurship awareness camps. It also extends its charitable efforts to provide medical support to the impoverished, assist the destitute, offer natural calamity support, grant educational scholarships to underprivileged students, and foster cultural enrichment. A pioneering establishment of the region since its inception, the Trust's grand service to society remains immense, not only in terms of education but also in community welfare.`

  const displayStoryContent = storyContent || defaultStoryContent

  // Split story into paragraphs
  const storyParagraphs = displayStoryContent.split('\n\n').filter(p => p.trim())

  return (
    <div
      className={cn('w-full min-h-screen relative overflow-hidden', className)}
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #064d2e 50%, #032818 100%)`
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div
          className="absolute top-20 right-20 w-80 h-80 rounded-full opacity-10 animate-[float_10s_ease-in-out_infinite]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-5 animate-[float_12s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: accentColor }}
        />

        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${textColor} 0, ${textColor} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Hero Section */}
      <div
        ref={heroRef.ref}
        className={cn(
          "relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000",
          heroRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          <Heart className="w-4 h-4" />
          Since 1969
        </div>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4"
          style={{ color: textColor }}
        >
          {pageTitle}
        </h1>

        <p
          className="text-xl md:text-2xl font-medium opacity-80"
          style={{ color: textColor }}
        >
          {pageSubtitle}
        </p>

        {/* Decorative line */}
        <div
          className="w-32 h-1 mx-auto mt-8 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Founder Section */}
      <div
        ref={founderRef.ref}
        className={cn(
          "relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 transition-all duration-1000",
          founderRef.isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Founder Image */}
            <div className="relative flex-shrink-0">
              {/* Decorative ring */}
              <div
                className="absolute -inset-4 rounded-full opacity-30 animate-pulse"
                style={{
                  background: `linear-gradient(135deg, ${accentColor} 0%, transparent 50%)`
                }}
              />
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4" style={{ borderColor: accentColor }}>
                <Image
                  src={founderImage}
                  alt={founderImageAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Founder Info */}
            <div className="text-center md:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
              >
                <Award className="w-3 h-3" />
                VISIONARY PHILANTHROPIST
              </div>
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                style={{ color: textColor }}
              >
                {founderName}
              </h2>
              <p
                className="text-lg md:text-xl opacity-80"
                style={{ color: textColor }}
              >
                {founderTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div
        ref={statsRef.ref}
        className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayStats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              index={index}
              accentColor={accentColor}
              isInView={statsRef.isInView}
            />
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div
        ref={storyRef.ref}
        className={cn(
          "relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 transition-all duration-1000",
          storyRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            Our Legacy
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: textColor }}
          >
            {storyTitle}
          </h2>
        </div>

        {/* Story Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10">
          {storyParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                "text-base md:text-lg leading-relaxed",
                index < storyParagraphs.length - 1 && "mb-6"
              )}
              style={{ color: `${textColor}cc` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div
        ref={timelineRef.ref}
        className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-12 transition-all duration-1000",
            timelineRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            <Calendar className="w-4 h-4" />
            Journey Through Time
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: textColor }}
          >
            {milestonesTitle}
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {displayMilestones.map((milestone, index) => (
            <TimelineMilestone
              key={index}
              milestone={milestone}
              index={index}
              accentColor={accentColor}
              isInView={timelineRef.isInView}
              isLast={index === displayMilestones.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Custom Keyframe Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

export default OurTrust
