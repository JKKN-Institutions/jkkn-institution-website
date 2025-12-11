'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Handshake, ExternalLink } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'

/**
 * Partner item schema
 */
export const PartnerItemSchema = z.object({
  name: z.string().describe('Partner name'),
  logo: z.string().describe('Partner logo URL'),
  link: z.string().optional().describe('Partner website URL'),
  category: z.string().optional().describe('Partner category'),
})

export type PartnerItem = z.infer<typeof PartnerItemSchema>

/**
 * PartnersLogos props schema
 */
export const PartnersLogosPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Supporting').describe('First part of header'),
  headerPart2: z.string().default('Partners').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Partners
  partners: z.array(PartnerItemSchema).default([]).describe('List of partners'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'marquee']).default('carousel').describe('Display layout'),
  columns: z.enum(['4', '5', '6', '8']).default('6').describe('Number of columns'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  cardStyle: z.enum(['glassmorphic', 'bordered', 'minimal']).default('bordered').describe('Card style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  grayscale: z.boolean().default(false).describe('Display logos in grayscale'),

  // Autoplay
  autoplay: z.boolean().default(true).describe('Enable autoplay'),
  autoplaySpeed: z.number().default(2000).describe('Autoplay speed in ms'),
})

export type PartnersLogosProps = z.infer<typeof PartnersLogosPropsSchema> & BaseBlockProps

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
 * PartnersLogos Component
 *
 * Modern partner logo showcase featuring:
 * - Serif header with gold italic accent
 * - Decorative circle patterns
 * - Multiple layouts (carousel, grid, marquee)
 * - Glassmorphic or bordered card styles
 * - Hover effects with gold accents
 * - External link indicators
 */
export function PartnersLogos({
  headerPart1 = 'Supporting',
  headerPart2 = 'Partners',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  subtitle,
  partners = [],
  layout = 'carousel',
  columns = '6',
  variant = 'modern-light',
  cardStyle = 'bordered',
  showDecorations = true,
  grayscale = false,
  autoplay = true,
  autoplaySpeed = 2000,
  className,
  isEditing,
}: PartnersLogosProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const headerRef = useInView()
  const contentRef = useInView()

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  const defaultPartners: PartnerItem[] = [
    { name: 'Yi Accessibility', logo: '', link: '#', category: 'Industry' },
    { name: 'Yi Innovation', logo: '', link: '#', category: 'Industry' },
    { name: 'Yi Learning', logo: '', link: '#', category: 'Education' },
    { name: 'Road Safety', logo: '', link: '#', category: 'Government' },
    { name: 'Young Indians', logo: '', link: '#', category: 'Industry' },
    { name: 'CII', logo: '', link: '#', category: 'Industry' },
    { name: 'NASSCOM', logo: '', link: '#', category: 'Technology' },
    { name: 'TCS', logo: '', link: '#', category: 'Technology' },
  ]

  const displayPartners = partners.length > 0 ? partners : defaultPartners

  // Autoplay carousel
  useEffect(() => {
    if (layout !== 'carousel' || isEditing || isPaused || !autoplay) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const cardWidth = 190

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
      }
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [layout, isEditing, isPaused, autoplaySpeed, autoplay])

  const columnClasses = {
    '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    '5': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    '6': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    '8': 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
  }

  return (
    <section
      className={cn(
        'relative py-16 md:py-20 lg:py-24 w-full overflow-hidden',
        isDark ? 'section-green-gradient' : 'bg-brand-cream',
        className
      )}
    >
      {/* Decorative Patterns */}
      {showDecorations && isModern && (
        <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />
      )}

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div
          ref={headerRef.ref}
          className={cn(
            "text-center mb-12 md:mb-16 transition-all duration-700",
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
            <Handshake className="w-4 h-4" />
            <span>Trusted Partners</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span style={{ color: headerPart2Color }}>{headerPart2}</span>
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

        {/* Partners Display */}
        <div
          ref={contentRef.ref}
          className={cn(
            "transition-all duration-700 delay-200",
            contentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {layout === 'carousel' ? (
            <div
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Carousel */}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 justify-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayPartners.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    partner={partner}
                    cardStyle={cardStyle}
                    isDark={isDark}
                    grayscale={grayscale}
                    isEditing={isEditing}
                    index={index}
                    isInView={contentRef.isInView}
                    className="flex-shrink-0 w-[170px] h-[110px]"
                  />
                ))}
              </div>
            </div>
          ) : layout === 'marquee' ? (
            <MarqueeLogos
              partners={displayPartners}
              cardStyle={cardStyle}
              isDark={isDark}
              grayscale={grayscale}
              isEditing={isEditing}
            />
          ) : (
            <div className={cn('grid gap-6 max-w-6xl mx-auto', columnClasses[columns])}>
              {displayPartners.map((partner, index) => (
                <PartnerCard
                  key={index}
                  partner={partner}
                  cardStyle={cardStyle}
                  isDark={isDark}
                  grayscale={grayscale}
                  isEditing={isEditing}
                  index={index}
                  isInView={contentRef.isInView}
                  className="h-[110px]"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Individual Partner Card - Modern Design
 */
function PartnerCard({
  partner,
  cardStyle,
  isDark,
  grayscale,
  isEditing,
  className,
  index,
  isInView,
}: {
  partner: PartnerItem
  cardStyle: 'glassmorphic' | 'bordered' | 'minimal'
  isDark: boolean
  grayscale: boolean
  isEditing?: boolean
  className?: string
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const cardContent = (
    <div
      className={cn(
        'group relative p-4 rounded-xl flex items-center justify-center h-full transition-all duration-500',
        cardStyle === 'glassmorphic' && isDark && 'glass-card-dark',
        cardStyle === 'glassmorphic' && !isDark && 'bg-white/80 backdrop-blur-sm shadow-lg',
        cardStyle === 'bordered' && 'bg-white border border-gray-200 hover:border-gold',
        cardStyle === 'minimal' && 'bg-white',
        'hover:shadow-lg hover:-translate-y-1',
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{
        transitionDelay: `${index * 50}ms`,
        boxShadow: isHovered ? '0 8px 30px rgba(255, 222, 89, 0.15)' : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gold accent glow on hover */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl opacity-0 blur transition-opacity duration-500",
          isHovered && "opacity-30"
        )}
        style={{ backgroundColor: '#ffde59' }}
      />

      <div className="relative z-10">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={partner.name}
            width={120}
            height={60}
            sizes="120px"
            className={cn(
              'object-contain max-h-16 transition-all duration-500',
              grayscale && 'grayscale group-hover:grayscale-0',
              'group-hover:scale-110'
            )}
          />
        ) : (
          <div className="text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center transition-all duration-500",
                isHovered ? "scale-110" : "scale-100"
              )}
              style={{
                backgroundColor: isHovered ? 'rgba(255, 222, 89, 0.15)' : isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
              }}
            >
              <span
                className={cn(
                  "text-lg font-bold transition-colors duration-300",
                  isDark ? "text-white" : isHovered ? "text-gold" : "text-gray-400"
                )}
              >
                {partner.name.charAt(0)}
              </span>
            </div>
            <span className={cn(
              "text-xs line-clamp-1 transition-colors",
              isDark ? "text-white/60 group-hover:text-white" : "text-gray-500 group-hover:text-gray-700"
            )}>
              {partner.name}
            </span>
          </div>
        )}
      </div>

      {/* External Link Indicator */}
      {partner.link && (
        <div
          className={cn(
            'absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all duration-300',
            isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm',
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}
        >
          <ExternalLink className="w-3 h-3 text-gold" />
        </div>
      )}

      {/* Bottom gold accent line on hover */}
      <div
        className={cn(
          'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-500',
          isHovered ? 'w-3/4' : 'w-0'
        )}
        style={{ backgroundColor: '#ffde59' }}
      />
    </div>
  )

  if (partner.link && !isEditing) {
    return (
      <Link href={partner.link} target="_blank" rel="noopener noreferrer" className={cn('block', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={className}>{cardContent}</div>
}

/**
 * Marquee Animation for Logos
 */
function MarqueeLogos({
  partners,
  cardStyle,
  isDark,
  grayscale,
  isEditing,
}: {
  partners: PartnerItem[]
  cardStyle: 'glassmorphic' | 'bordered' | 'minimal'
  isDark: boolean
  grayscale: boolean
  isEditing?: boolean
}) {
  // Duplicate partners for seamless loop
  const duplicatedPartners = [...partners, ...partners]

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          'flex gap-6',
          !isEditing && 'animate-marquee'
        )}
        style={{
          animation: isEditing ? 'none' : 'marquee 30s linear infinite',
        }}
      >
        {duplicatedPartners.map((partner, index) => (
          <PartnerCard
            key={index}
            partner={partner}
            cardStyle={cardStyle}
            isDark={isDark}
            grayscale={grayscale}
            isEditing={isEditing}
            index={index % partners.length}
            isInView={true}
            className="flex-shrink-0 w-[160px] h-[100px]"
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

export default PartnersLogos
