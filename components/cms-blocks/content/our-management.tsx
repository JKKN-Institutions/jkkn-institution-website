'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { Quote, Award, Users, type LucideIcon } from 'lucide-react'
import Image from 'next/image'

/**
 * Management Member schema
 */
export const ManagementMemberSchema = z.object({
  name: z.string().describe('Member name'),
  title: z.string().describe('Position/Title'),
  image: z.string().describe('Profile image URL'),
  imageAlt: z.string().optional().describe('Image alt text'),
  message: z.string().describe('Message or quote from the member'),
  order: z.number().optional().describe('Display order'),
})

export type ManagementMember = z.infer<typeof ManagementMemberSchema>

/**
 * OurManagement props schema
 */
export const OurManagementPropsSchema = z.object({
  // Page Header
  pageTitle: z.string().default('OUR MANAGEMENT').describe('Main page title'),
  pageSubtitle: z.string().optional().describe('Optional subtitle'),

  // Team Members
  members: z.array(ManagementMemberSchema).default([
    {
      name: 'SMT. N. SENDAMARAAI',
      title: 'CHAIRPERSON - JKKN EDUCATIONAL INSTITUTIONS',
      image: 'https://jkkn.ac.in/wp-content/uploads/2023/04/Sendamaraai-photo.png',
      imageAlt: 'Smt. N. Sendamaraai - Chairperson',
      message: 'As the Chairperson of JKKN Educational Institutions, I am honoured to shoulder this immense responsibility, and I take great pride in our exceptional progress. We have earned the status of one of the most prestigious colleges in the region. "Leadership and Excellence" is not merely our motto but the foundation of our values, a testament to our state-of-the-art infrastructure, distinguished faculty, and unwavering commitment to quality education.',
      order: 1,
    },
    {
      name: 'SHRI. S. OMMSHARRAVANA',
      title: 'DIRECTOR - JKKN EDUCATIONAL INSTITUTIONS',
      image: 'https://jkkn.ac.in/wp-content/uploads/2023/04/Dir-Sharravana-photo.png',
      imageAlt: 'Shri. S. Ommsharravana - Director',
      message: 'I extend my heartfelt congratulations to the college for its fervent and focused dedication to shaping future engineers of distinction. At JKKN, we are committed to innovative education methodologies that enable quality learning, foster independent thinking, and facilitate the development of well-rounded personalities. Our mission empowers students to contribute their best to society and the nation.',
      order: 2,
    },
  ]).describe('Management team members'),

  // Layout
  layout: z.enum(['grid', 'alternating', 'cards']).default('cards').describe('Layout style'),
  columnsDesktop: z.enum(['1', '2', '3']).default('2').describe('Columns on desktop'),

  // Styling
  backgroundColor: z.string().default('#0b6d41').describe('Primary background color'),
  accentColor: z.string().default('#ffde59').describe('Accent color (gold/yellow)'),
  textColor: z.string().default('#ffffff').describe('Text color'),
  cardStyle: z.enum(['elegant', 'modern', 'minimal']).default('elegant').describe('Card style'),
  showFrameDecoration: z.boolean().default(true).describe('Show decorative frame around images'),
})

export type OurManagementProps = z.infer<typeof OurManagementPropsSchema> & BaseBlockProps

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
 * Decorative Frame SVG Component
 */
function DecorativeFrame({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      {/* Outer ornate circle */}
      <circle cx="150" cy="150" r="145" stroke={color} strokeWidth="2" opacity="0.3" />
      <circle cx="150" cy="150" r="140" stroke={color} strokeWidth="1" opacity="0.5" />

      {/* Decorative corner elements */}
      <g opacity="0.6">
        {/* Top decoration */}
        <path d="M150 5 L155 15 L150 10 L145 15 Z" fill={color} />
        <path d="M130 8 Q150 0 170 8" stroke={color} strokeWidth="2" fill="none" />

        {/* Bottom decoration */}
        <path d="M150 295 L155 285 L150 290 L145 285 Z" fill={color} />
        <path d="M130 292 Q150 300 170 292" stroke={color} strokeWidth="2" fill="none" />

        {/* Left decoration */}
        <path d="M5 150 L15 155 L10 150 L15 145 Z" fill={color} />
        <path d="M8 130 Q0 150 8 170" stroke={color} strokeWidth="2" fill="none" />

        {/* Right decoration */}
        <path d="M295 150 L285 155 L290 150 L285 145 Z" fill={color} />
        <path d="M292 130 Q300 150 292 170" stroke={color} strokeWidth="2" fill="none" />
      </g>

      {/* Inner glow circle */}
      <circle cx="150" cy="150" r="125" stroke={color} strokeWidth="3" opacity="0.8" />
    </svg>
  )
}

/**
 * Management Member Card Component
 */
function MemberCard({
  member,
  index,
  accentColor,
  textColor,
  isInView,
  showFrame,
  cardStyle,
}: {
  member: ManagementMember
  index: number
  accentColor: string
  textColor: string
  isInView: boolean
  showFrame: boolean
  cardStyle: 'elegant' | 'modern' | 'minimal'
}) {
  const isEven = index % 2 === 0

  return (
    <div
      className={cn(
        "group relative transition-all duration-1000",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      )}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Card Container */}
      <div
        className={cn(
          "relative bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden",
          "border border-white/20 transition-all duration-500",
          "hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20",
          cardStyle === 'elegant' && "p-8 md:p-10",
          cardStyle === 'modern' && "p-6 md:p-8",
          cardStyle === 'minimal' && "p-6"
        )}
      >
        {/* Decorative Background Gradient */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: accentColor }}
        />

        {/* Content Layout */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Profile Image with Frame */}
          <div className="relative mb-8">
            {/* Animated Ring */}
            <div
              className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-pulse"
              style={{
                background: `conic-gradient(from 0deg, ${accentColor}, transparent, ${accentColor})`
              }}
            />

            {/* Decorative Frame */}
            {showFrame && (
              <div className="absolute -inset-6 md:-inset-8">
                <DecorativeFrame color={accentColor} />
              </div>
            )}

            {/* Image Container */}
            <div
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 transition-transform duration-500 group-hover:scale-105"
              style={{ borderColor: accentColor }}
            >
              <Image
                src={member.image}
                alt={member.imageAlt || member.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Name */}
          <h3
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 tracking-wide"
            style={{ color: textColor }}
          >
            {member.name}
          </h3>

          {/* Title Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-base font-semibold mb-6"
            style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
          >
            <Award className="w-4 h-4" />
            {member.title}
          </div>

          {/* Message/Quote */}
          <div className="relative max-w-xl">
            {/* Quote Icon */}
            <Quote
              className="absolute -top-4 -left-2 w-8 h-8 opacity-30 transform rotate-180"
              style={{ color: accentColor }}
            />

            <p
              className="text-base md:text-lg leading-relaxed text-justify px-4"
              style={{ color: `${textColor}cc` }}
            >
              {member.message}
            </p>

            <Quote
              className="absolute -bottom-4 -right-2 w-8 h-8 opacity-30"
              style={{ color: accentColor }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * OurManagement Component - Modern Design
 *
 * Professional Management Team page with:
 * - Gradient background with decorative elements
 * - Elegant profile cards with ornate frames
 * - Scroll-triggered animations
 * - Flexible layout options
 * - Rich quote/message sections
 */
export function OurManagement({
  pageTitle = 'OUR MANAGEMENT',
  pageSubtitle,
  members = [],
  layout = 'cards',
  columnsDesktop = '2',
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff',
  cardStyle = 'elegant',
  showFrameDecoration = true,
  className,
}: OurManagementProps) {
  const heroRef = useInView()
  const membersRef = useInView()

  const defaultMembers: ManagementMember[] = [
    {
      name: 'SMT. N. SENDAMARAAI',
      title: 'CHAIRPERSON - JKKN EDUCATIONAL INSTITUTIONS',
      image: 'https://jkkn.ac.in/wp-content/uploads/2023/04/Sendamaraai-photo.png',
      imageAlt: 'Smt. N. Sendamaraai - Chairperson',
      message: 'As the Chairperson of JKKN Educational Institutions, I am honoured to shoulder this immense responsibility, and I take great pride in our exceptional progress. We have earned the status of one of the most prestigious colleges in the region. "Leadership and Excellence" is not merely our motto but the foundation of our values, a testament to our state-of-the-art infrastructure, distinguished faculty, and unwavering commitment to quality education.',
      order: 1,
    },
    {
      name: 'SHRI. S. OMMSHARRAVANA',
      title: 'DIRECTOR - JKKN EDUCATIONAL INSTITUTIONS',
      image: 'https://jkkn.ac.in/wp-content/uploads/2023/04/Dir-Sharravana-photo.png',
      imageAlt: 'Shri. S. Ommsharravana - Director',
      message: 'I extend my heartfelt congratulations to the college for its fervent and focused dedication to shaping future engineers of distinction. At JKKN, we are committed to innovative education methodologies that enable quality learning, foster independent thinking, and facilitate the development of well-rounded personalities. Our mission empowers students to contribute their best to society and the nation.',
      order: 2,
    },
  ]

  const displayMembers = members.length > 0 ? members : defaultMembers

  // Sort members by order
  const sortedMembers = [...displayMembers].sort((a, b) => (a.order || 0) - (b.order || 0))

  const gridCols = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 lg:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

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
          className="absolute top-40 left-20 w-96 h-96 rounded-full opacity-10 animate-[float_12s_ease-in-out_infinite]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-5 animate-[float_10s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-5 animate-[float_14s_ease-in-out_infinite]"
          style={{ backgroundColor: textColor }}
        />

        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${textColor} 0, ${textColor} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '30px 30px'
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
          <Users className="w-4 h-4" />
          Leadership Team
        </div>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4"
          style={{ color: textColor }}
        >
          {pageTitle}
        </h1>

        {pageSubtitle && (
          <p
            className="text-xl md:text-2xl font-medium opacity-80 max-w-3xl mx-auto"
            style={{ color: textColor }}
          >
            {pageSubtitle}
          </p>
        )}

        {/* Decorative line */}
        <div
          className="w-32 h-1 mx-auto mt-8 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Members Section */}
      <div
        ref={membersRef.ref}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className={cn('grid gap-8 md:gap-12', gridCols[columnsDesktop])}>
          {sortedMembers.map((member, index) => (
            <MemberCard
              key={index}
              member={member}
              index={index}
              accentColor={accentColor}
              textColor={textColor}
              isInView={membersRef.isInView}
              showFrame={showFrameDecoration}
              cardStyle={cardStyle}
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

export default OurManagement
