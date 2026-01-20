'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useState, useEffect, useRef } from 'react'
import { Phone, Mail, MapPin, Clock, ExternalLink, Building2 } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * ContactInfoSection props schema
 * Compact contact section for homepage use (not full contact page)
 */
export const ContactInfoSectionPropsSchema = z.object({
  // Header
  title: z.string().default('Contact Us').describe('Section title'),
  subtitle: z.string().optional().describe('Subtitle text'),
  headerPart1Color: z.string().default('#0b6d41').describe('Primary header color'),
  headerPart2Color: z.string().default('#D4AF37').describe('Accent color'),

  // Contact Info
  phone: z.string().default('+91 93458 55001').describe('Phone number'),
  email: z.string().default('info@jkkn.ac.in').describe('Email address'),
  address: z.string().default('Natarajapuram, NH-544, Kumarapalayam, Namakkal, Tamil Nadu - 638183').describe('Physical address'),
  workingHours: z.string().optional().describe('Working hours'),

  // Map
  showMap: z.boolean().default(true).describe('Show embedded map'),
  mapEmbedUrl: z.string().default('https://www.google.com/maps?q=JKKN+Educational+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed').describe('Google Maps embed URL'),

  // Styling
  variant: z.enum(['modern-light', 'modern-dark', 'cream']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'solid', 'minimal']).default('glassmorphic').describe('Card design style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  layout: z.enum(['horizontal', 'vertical']).default('horizontal').describe('Layout orientation'),
})

export type ContactInfoSectionProps = z.infer<typeof ContactInfoSectionPropsSchema> & BaseBlockProps

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
 * ContactInfoSection Component
 *
 * A compact, modern contact section for homepages featuring:
 * - Glassmorphic contact cards (phone, email, address)
 * - Embedded Google Map
 * - Responsive horizontal/vertical layouts
 * - Scroll animations
 * - Deep green/gold brand colors
 */
export function ContactInfoSection({
  title = 'Contact Us',
  subtitle,
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#D4AF37',
  phone = '+91 93458 55001',
  email = 'info@jkkn.ac.in',
  address = 'Natarajapuram, NH-544, Kumarapalayam, Namakkal, Tamil Nadu - 638183',
  workingHours,
  showMap = true,
  mapEmbedUrl = 'https://www.google.com/maps?q=JKKN+Educational+Institutions,Komarapalayam,Tamil+Nadu,India&output=embed',
  variant = 'modern-light',
  cardStyle = 'glassmorphic',
  showDecorations = true,
  layout = 'horizontal',
  className,
  isEditing,
}: ContactInfoSectionProps) {
  const headerRef = useInView()
  const contentRef = useInView()

  const isDark = variant === 'modern-dark'
  const isCream = variant === 'cream'
  const isHorizontal = layout === 'horizontal'

  // Card styles based on variant and cardStyle
  const getCardStyles = () => {
    if (cardStyle === 'glassmorphic') {
      return isDark
        ? 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15'
        : 'bg-white/80 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl'
    }
    if (cardStyle === 'solid') {
      return isDark
        ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
        : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
    }
    // minimal
    return isDark
      ? 'bg-transparent border border-white/10 hover:border-white/30'
      : 'bg-transparent border border-gray-200 hover:border-gray-400'
  }

  const contactItems = [
    {
      icon: Phone,
      label: 'Phone',
      value: phone,
      href: `tel:${phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: address,
      href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
    },
    ...(workingHours ? [{
      icon: Clock,
      label: 'Working Hours',
      value: workingHours,
      href: undefined as string | undefined,
    }] : []),
  ]

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        className
      )}
    >
      {/* Background Layer */}
      <div className={cn(
        "absolute inset-0",
        isDark && "bg-gradient-to-br from-brand-primary/95 via-brand-primary-dark/90 to-brand-primary-darker/95",
        isCream && "bg-gradient-to-br from-brand-cream/95 via-amber-50/90 to-brand-cream/95",
        !isDark && !isCream && "bg-gradient-to-br from-gray-50 via-white to-gray-50"
      )} />

      {/* Content Container */}
      <div className="relative py-12 md:py-16 lg:py-20">
        {/* Decorative Patterns */}
        {showDecorations && (
          <DecorativePatterns variant="default" color={isDark ? 'white' : 'green'} />
        )}

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
          {/* Header */}
          <div
            ref={headerRef.ref}
            className={cn(
              "text-center mb-10 md:mb-14 transition-all duration-700",
              headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            {/* Section Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6",
                isDark ? "bg-white/10 backdrop-blur-sm text-white" : "bg-brand-primary/10 text-brand-primary"
              )}
            >
              <Building2 className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span style={{ color: headerPart1Color }}>{title}</span>
            </h2>

            {subtitle && (
              <p className={cn(
                "text-lg md:text-xl max-w-3xl mx-auto",
                isDark ? "text-white/70" : "text-gray-600"
              )}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Content Grid */}
          <div
            ref={contentRef.ref}
            className={cn(
              'max-w-7xl mx-auto',
              isHorizontal ? 'grid lg:grid-cols-2 gap-8 lg:gap-12' : 'space-y-8'
            )}
          >
            {/* Contact Cards */}
            <div className={cn(
              "grid gap-4",
              isHorizontal ? "sm:grid-cols-2 content-start" : "sm:grid-cols-2 lg:grid-cols-4"
            )}>
              {contactItems.map((item, index) => (
                <ContactCard
                  key={index}
                  {...item}
                  cardStyles={getCardStyles()}
                  headerColor={headerPart1Color}
                  isDark={isDark}
                  isInView={contentRef.isInView}
                  index={index}
                />
              ))}
            </div>

            {/* Map Section */}
            {showMap && mapEmbedUrl && (
              <div
                className={cn(
                  "rounded-2xl overflow-hidden transition-all duration-700",
                  getCardStyles(),
                  contentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${contactItems.length * 100}ms` }}
              >
                <div className={cn(
                  "p-4 border-b flex items-center gap-2",
                  isDark ? "border-white/10" : "border-gray-200"
                )}>
                  <MapPin className="w-5 h-5" style={{ color: headerPart1Color }} />
                  <span className={cn(
                    "font-semibold",
                    isDark ? "text-white" : "text-gray-900"
                  )}>
                    Our Location
                  </span>
                </div>
                <div className="aspect-[16/9] lg:aspect-[4/3]">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className={cn(
            "mt-10 md:mt-14 text-center transition-all duration-700 delay-500",
            contentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <p className={cn(
              "text-lg mb-6",
              isDark ? "text-white/70" : "text-gray-600"
            )}>
              Have questions? We&apos;re here to help you on your educational journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: headerPart1Color }}
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
              <a
                href={`mailto:${email}`}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2",
                  isDark ? "text-white border-white hover:bg-white/10" : ""
                )}
                style={{
                  borderColor: isDark ? undefined : headerPart1Color,
                  color: isDark ? undefined : headerPart1Color,
                }}
              >
                <Mail className="w-5 h-5" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Contact Card
 */
function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  cardStyles,
  headerColor,
  isDark,
  isInView,
  index,
}: {
  icon: typeof Phone
  label: string
  value: string
  href?: string
  cardStyles: string
  headerColor: string
  isDark: boolean
  isInView: boolean
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  const content = (
    <div
      className={cn(
        "rounded-xl p-5 transition-all duration-500",
        cardStyles,
        href && "cursor-pointer hover:-translate-y-1",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            "p-3 rounded-lg flex-shrink-0 transition-all duration-300",
            isHovered ? "scale-110" : ""
          )}
          style={{ backgroundColor: `${headerColor}15` }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: headerColor }}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h4 className={cn(
            "font-semibold text-sm mb-1",
            isDark ? "text-white/80" : "text-gray-500"
          )}>
            {label}
          </h4>
          <p className={cn(
            "text-base font-medium leading-relaxed",
            isDark ? "text-white" : "text-gray-900",
            href && "group-hover:underline"
          )}>
            {value}
          </p>
        </div>

        {/* External Link Icon */}
        {href && (
          <ExternalLink className={cn(
            "w-4 h-4 flex-shrink-0 transition-all duration-300",
            isDark ? "text-white/40" : "text-gray-400",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          )} />
        )}
      </div>

      {/* Bottom accent line on hover */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-500",
          isHovered ? "w-3/4" : "w-0"
        )}
        style={{ backgroundColor: headerColor }}
      />
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target={label === 'Address' ? '_blank' : undefined}
        rel={label === 'Address' ? 'noopener noreferrer' : undefined}
        className="group block relative"
      >
        {content}
      </a>
    )
  }

  return <div className="relative">{content}</div>
}

export default ContactInfoSection
