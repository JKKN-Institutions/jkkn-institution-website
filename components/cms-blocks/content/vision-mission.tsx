'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { Lightbulb, Award, Rocket, Shield, Users, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * Value item schema
 */
export const ValueItemSchema = z.object({
  icon: z.string().describe('Icon name from Lucide'),
  title: z.string().describe('Value title'),
  description: z.string().optional().describe('Value description'),
})

export type ValueItem = z.infer<typeof ValueItemSchema>

/**
 * VisionMission props schema
 */
export const VisionMissionPropsSchema = z.object({
  // Page Title
  pageTitle: z.string().default('OUR VISION AND MISSION').describe('Main page title'),
  pageTitleColor: z.string().default('#ffffff').describe('Page title color'),

  // Vision
  visionTitle: z.string().default('Vision').describe('Vision section title'),
  visionText: z.string().default('To be a Leading Global Innovative Solutions provider for the ever changing needs of the society.').describe('Vision content'),

  // Mission
  missionTitle: z.string().default('Mission').describe('Mission section title'),
  missionText: z.string().default('Enabling a Platform for all to seize exponential opportunities through bioconvergence, thereby facilitating them to become Dynamic Leaders who shape the future.').describe('Mission content'),

  // Values
  valuesTitle: z.string().default('Our Core Values').describe('Values section title'),
  values: z.array(ValueItemSchema).default([
    { icon: 'Lightbulb', title: 'Innovation', description: 'Embracing new ideas and creative solutions' },
    { icon: 'Award', title: 'Commitment to Excellence', description: 'Striving for the highest standards' },
    { icon: 'Rocket', title: 'Think Big', description: 'Aiming for transformative impact' },
    { icon: 'Shield', title: 'Integrity', description: 'Acting with honesty and transparency' },
    { icon: 'Users', title: 'Teamwork', description: 'Collaborating to achieve common goals' },
  ]).describe('List of core values'),

  // Styling
  backgroundColor: z.string().default('#0b6d41').describe('Section background color'),
  accentColor: z.string().default('#ffde59').describe('Accent color (JKKN Yellow)'),
  iconColor: z.string().default('#ffffff').describe('Icon color'),
  textColor: z.string().default('#ffffff').describe('Text color'),
})

export type VisionMissionProps = z.infer<typeof VisionMissionPropsSchema> & BaseBlockProps

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Award,
  Rocket,
  Shield,
  Users,
}

/**
 * Animated Vision Icon with pulse effect
 */
function VisionIcon({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        className="absolute inset-0 blur-2xl opacity-30 animate-pulse"
        style={{ backgroundColor: accentColor }}
      />
      <svg
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-40 h-28 md:w-48 md:h-32 relative z-10"
      >
        {/* Outer eye shape with animation */}
        <path
          d="M60 10C30 10 10 40 10 40C10 40 30 70 60 70C90 70 110 40 110 40C110 40 90 10 60 10Z"
          stroke={color}
          strokeWidth="3"
          fill="none"
          className="animate-[pulse_3s_ease-in-out_infinite]"
        />
        {/* Inner circle */}
        <circle
          cx="60"
          cy="40"
          r="18"
          stroke={accentColor}
          strokeWidth="3"
          fill="none"
        />
        {/* Pupil with glow */}
        <circle
          cx="60"
          cy="40"
          r="10"
          fill={accentColor}
          className="animate-[pulse_2s_ease-in-out_infinite]"
        />
        {/* Decorative rays */}
        <path
          d="M60 10V2M60 78V70M98 22L104 16M22 58L16 64M98 58L104 64M22 22L16 16"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  )
}

/**
 * Animated Mission/Target Icon
 */
function MissionIcon({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div
        className="absolute inset-0 blur-2xl opacity-30 animate-pulse"
        style={{ backgroundColor: accentColor }}
      />
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-40 h-40 md:w-48 md:h-48 relative z-10"
      >
        {/* Outer circle */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        {/* Middle circle */}
        <circle
          cx="60"
          cy="60"
          r="35"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        {/* Inner circle */}
        <circle
          cx="60"
          cy="60"
          r="20"
          stroke={accentColor}
          strokeWidth="3"
          fill="none"
        />
        {/* Center bullseye with pulse */}
        <circle
          cx="60"
          cy="60"
          r="8"
          fill={accentColor}
          className="animate-[pulse_2s_ease-in-out_infinite]"
        />
        {/* Arrow with animation */}
        <g className="animate-[bounce_2s_ease-in-out_infinite]">
          <path
            d="M95 25L67 53"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M95 25L80 25M95 25L95 40"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
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
 * Animated Value Card
 */
function ValueCard({
  value,
  index,
  accentColor,
  isInView
}: {
  value: ValueItem
  index: number
  accentColor: string
  isInView: boolean
}) {
  const IconComponent = iconMap[value.icon] || Lightbulb

  return (
    <div
      className={cn(
        "group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20",
        "transform transition-all duration-700 hover:scale-105 hover:bg-white/20",
        "hover:shadow-2xl hover:shadow-black/20",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
        style={{ backgroundColor: accentColor }}
      />

      {/* Icon container */}
      <div
        className="relative w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        style={{ backgroundColor: `${accentColor}30` }}
      >
        <IconComponent
          className="w-8 h-8 transition-all duration-300 group-hover:scale-110"
          style={{ color: accentColor }}
        />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white text-center mb-2">
        {value.title}
      </h3>

      {/* Description */}
      {value.description && (
        <p className="text-sm text-white/70 text-center leading-relaxed">
          {value.description}
        </p>
      )}
    </div>
  )
}

/**
 * VisionMission Component - Modern Design
 *
 * Professional Vision and Mission page layout with:
 * - Gradient background with decorative elements
 * - Animated icons with glow effects
 * - Scroll-triggered animations
 * - Modern glassmorphism cards
 * - Fully responsive design
 */
export function VisionMission({
  pageTitle = 'OUR VISION AND MISSION',
  pageTitleColor = '#ffffff',
  visionTitle = 'Vision',
  visionText = 'To be a Leading Global Innovative Solutions provider for the ever changing needs of the society.',
  missionTitle = 'Mission',
  missionText = 'Enabling a Platform for all to seize exponential opportunities through bioconvergence, thereby facilitating them to become Dynamic Leaders who shape the future.',
  valuesTitle = 'Our Core Values',
  values = [],
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  iconColor = '#ffffff',
  textColor = '#ffffff',
  className,
}: VisionMissionProps) {
  const defaultValues: ValueItem[] = [
    { icon: 'Lightbulb', title: 'Innovation', description: 'Embracing new ideas and creative solutions' },
    { icon: 'Award', title: 'Commitment to Excellence', description: 'Striving for the highest standards' },
    { icon: 'Rocket', title: 'Think Big', description: 'Aiming for transformative impact' },
    { icon: 'Shield', title: 'Integrity', description: 'Acting with honesty and transparency' },
    { icon: 'Users', title: 'Teamwork', description: 'Collaborating to achieve common goals' },
  ]

  const displayValues = values.length > 0 ? values : defaultValues

  const heroRef = useInView()
  const visionRef = useInView()
  const missionRef = useInView()
  const valuesRef = useInView()

  return (
    <div
      className={cn('w-full min-h-screen relative overflow-hidden', className)}
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #064d2e 50%, #032818 100%)`
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 animate-[float_8s_ease-in-out_infinite]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-40 right-10 w-96 h-96 rounded-full opacity-5 animate-[float_10s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-5 animate-[float_12s_ease-in-out_infinite]"
          style={{ backgroundColor: iconColor }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${iconColor} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
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
        {/* Decorative line */}
        <div
          className="w-24 h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: accentColor }}
        />

        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide"
          style={{ color: pageTitleColor }}
        >
          {pageTitle}
        </h1>

        {/* Decorative underline */}
        <div
          className="w-48 h-1 mx-auto mt-8 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Vision Section */}
        <div
          ref={visionRef.ref}
          className={cn(
            "flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 transition-all duration-1000",
            visionRef.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          {/* Icon */}
          <div className="flex-shrink-0 order-1 lg:order-1">
            <VisionIcon color={iconColor} accentColor={accentColor} />
          </div>

          {/* Text Content */}
          <div className="flex-1 order-2 lg:order-2">
            <div className="relative">
              {/* Section badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                Our Vision
              </div>

              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: textColor }}
              >
                {visionTitle}
              </h2>

              {/* Decorative quote marks */}
              <div className="relative">
                <span
                  className="absolute -left-4 -top-4 text-6xl font-serif opacity-20"
                  style={{ color: accentColor }}
                >
                  "
                </span>
                <p
                  className="text-lg md:text-xl leading-relaxed pl-4 border-l-4"
                  style={{ color: `${textColor}dd`, borderColor: accentColor }}
                >
                  {visionText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div
          ref={missionRef.ref}
          className={cn(
            "flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 transition-all duration-1000",
            missionRef.isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          {/* Text Content */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="relative">
              {/* Section badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                Our Mission
              </div>

              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: textColor }}
              >
                {missionTitle}
              </h2>

              {/* Decorative quote marks */}
              <div className="relative">
                <span
                  className="absolute -left-4 -top-4 text-6xl font-serif opacity-20"
                  style={{ color: accentColor }}
                >
                  "
                </span>
                <p
                  className="text-lg md:text-xl leading-relaxed pl-4 border-l-4"
                  style={{ color: `${textColor}dd`, borderColor: accentColor }}
                >
                  {missionText}
                </p>
              </div>
            </div>
          </div>

          {/* Icon */}
          <div className="flex-shrink-0 order-1 lg:order-2">
            <MissionIcon color={iconColor} accentColor={accentColor} />
          </div>
        </div>

        {/* Values Section */}
        <div ref={valuesRef.ref}>
          {/* Section Header */}
          <div
            className={cn(
              "text-center mb-16 transition-all duration-1000",
              valuesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              What We Stand For
            </div>

            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: textColor }}
            >
              {valuesTitle}
            </h2>

            <div
              className="w-24 h-1 mx-auto mt-6 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {displayValues.map((value, index) => (
              <ValueCard
                key={index}
                value={value}
                index={index}
                accentColor={accentColor}
                isInView={valuesRef.isInView}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Keyframe Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}

export default VisionMission
