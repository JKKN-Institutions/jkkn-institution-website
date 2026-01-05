'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { Award, Quote } from 'lucide-react'
import Image from 'next/image'

/**
 * LeadershipProfile props schema
 */
export const LeadershipProfilePropsSchema = z.object({
  // Personal Info
  name: z.string().describe('Full name with title (e.g., Dr. M. Venkatesan)'),
  title: z.string().describe('Position title (e.g., Principal)'),
  designation: z.string().describe('Institution name (e.g., JKKN College of Pharmacy)'),
  qualification: z.string().optional().describe('Qualifications (e.g., M.Pharm., Ph.D.)'),

  // Image
  image: z.string().describe('Profile photo URL'),
  imageAlt: z.string().optional().describe('Image alt text for accessibility'),

  // Message
  messageTitle: z.string().default("Principal's Message").describe('Message section title'),
  message: z.string().describe('The leadership message content'),
  showDropCap: z.boolean().default(true).describe('Show decorative drop-cap on first letter'),

  // Styling Options
  role: z.enum(['principal', 'vice-principal', 'hod', 'management', 'director']).default('principal').describe('Leadership role for accent color'),
  accentColor: z.string().default('#ffde59').describe('Accent color (default: JKKN gold)'),
  showDecorations: z.boolean().default(true).describe('Show floating decorative shapes'),
  showQuoteIcons: z.boolean().default(true).describe('Show decorative quote icons'),
})

export type LeadershipProfileProps = z.infer<typeof LeadershipProfilePropsSchema> & BaseBlockProps

/**
 * Intersection Observer hook for scroll animations
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
 * Decorative floating circles
 */
function DecorationCircles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top right large circle */}
      <div
        className="leadership-decoration-circle w-96 h-96 -top-20 -right-20 opacity-10"
        style={{ backgroundColor: color }}
      />
      {/* Bottom left circle */}
      <div
        className="leadership-decoration-circle w-72 h-72 -bottom-10 -left-10 opacity-5"
        style={{ backgroundColor: color, animationDelay: '-4s' }}
      />
      {/* Center small circle */}
      <div
        className="leadership-decoration-circle w-48 h-48 top-1/3 left-1/4 opacity-5"
        style={{ backgroundColor: '#ffffff', animationDelay: '-8s' }}
      />
    </div>
  )
}

/**
 * Format message text - split into paragraphs if needed
 */
function formatMessage(message: string): React.ReactNode[] {
  // Split by double newlines or preserve as single paragraph
  const paragraphs = message.split(/\n\n+/).filter(p => p.trim())

  if (paragraphs.length <= 1) {
    return [<span key="0">{message}</span>]
  }

  return paragraphs.map((paragraph, index) => (
    <p key={index} className={index > 0 ? 'mt-4' : ''}>
      {paragraph}
    </p>
  ))
}

/**
 * LeadershipProfile Component
 *
 * A modern, professional profile page for institutional leaders:
 * - Principal, Vice Principal, HODs, Directors, Management
 *
 * Features:
 * - Hero section with background image and dark overlay
 * - Glass card with gold-ringed profile photo
 * - Elegant typography with name, qualification, title badge
 * - Message section with gold border accent and drop-cap
 * - Responsive design with smooth animations
 * - JKKN brand colors integration
 */
export function LeadershipProfile({
  name,
  title,
  designation,
  qualification,
  image,
  imageAlt,
  messageTitle = "Principal's Message",
  message,
  showDropCap = true,
  role = 'principal',
  accentColor = '#ffde59',
  showDecorations = true,
  showQuoteIcons = true,
  className,
}: LeadershipProfileProps) {
  const heroRef = useInView()
  const messageRef = useInView()

  // Default message title based on role if not provided
  const defaultMessageTitle = messageTitle || `${title}'s Message`

  return (
    <div className={cn('w-full', `leadership-role-${role}`, className)}>
      {/* ===== HERO SECTION ===== */}
      <section className="leadership-hero section-green-gradient-diagonal">

        {/* Decorative floating shapes */}
        {showDecorations && <DecorationCircles color={accentColor} />}

        {/* Content */}
        <div
          ref={heroRef.ref}
          className={cn(
            "relative z-10 container mx-auto px-4 py-12 md:py-16",
            "transition-all duration-1000",
            heroRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Glass Profile Card */}
          <div className="leadership-card-glass max-w-2xl mx-auto text-center">
            {/* Profile Photo with Gold Ring */}
            <div className="flex justify-center mb-8">
              <div className="leadership-photo-ring">
                <Image
                  src={image}
                  alt={imageAlt || name}
                  width={224}
                  height={224}
                  className="leadership-photo"
                  priority
                />
              </div>
            </div>

            {/* Name */}
            <h1 className="leadership-name mb-2">
              {name}
              {qualification && (
                <span className="leadership-qualification block mt-1">
                  {qualification}
                </span>
              )}
            </h1>

            {/* Title Badge */}
            <div className="mt-6">
              <span className="leadership-title-badge">
                <Award className="w-4 h-4" />
                {title} - {designation}
              </span>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="leadership-wave-divider" />
      </section>

      {/* ===== MESSAGE SECTION ===== */}
      <section className="leadership-message-section">
        <div
          ref={messageRef.ref}
          className={cn(
            "container mx-auto px-4 max-w-4xl",
            "transition-all duration-1000 delay-200",
            messageRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Section Title */}
          <h2 className="leadership-message-title">
            {defaultMessageTitle}
          </h2>

          {/* Message Card */}
          <div className="leadership-message-card">
            {/* Opening Quote Icon */}
            {showQuoteIcons && (
              <div className="flex justify-start mb-4">
                <Quote
                  className="w-10 h-10 transform rotate-180"
                  style={{ color: `${accentColor}40` }}
                />
              </div>
            )}

            {/* Message Text */}
            <div
              className={cn(
                'leadership-message-text',
                showDropCap && 'with-drop-cap'
              )}
            >
              {formatMessage(message)}
            </div>

            {/* Closing Quote Icon */}
            {showQuoteIcons && (
              <div className="flex justify-end mt-4">
                <Quote
                  className="w-10 h-10"
                  style={{ color: `${accentColor}40` }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LeadershipProfile
