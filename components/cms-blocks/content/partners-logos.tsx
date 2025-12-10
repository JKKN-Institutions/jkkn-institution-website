'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { Handshake, ExternalLink } from 'lucide-react'

/**
 * Partner item schema
 */
export const PartnerItemSchema = z.object({
  name: z.string().describe('Partner name'),
  logo: z.string().describe('Partner logo URL'),
  link: z.string().optional().describe('Partner website URL'),
})

export type PartnerItem = z.infer<typeof PartnerItemSchema>

/**
 * PartnersLogos props schema
 */
export const PartnersLogosPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('Supporting').describe('First part of header'),
  headerPart2: z.string().default('Partners').describe('Second part of header (colored)'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part'),
  headerPart2Italic: z.boolean().default(true).describe('Make second part italic'),
  subtitle: z.string().optional().describe('Subtitle below header'),

  // Partners
  partners: z.array(PartnerItemSchema).default([]).describe('List of partners'),

  // Layout
  layout: z.enum(['carousel', 'grid', 'marquee']).default('carousel').describe('Display layout'),
  columns: z.enum(['4', '5', '6', '8']).default('6').describe('Number of columns'),

  // Styling
  backgroundColor: z.string().default('#ffffff').describe('Section background color'),
  cardBackgroundColor: z.string().default('#ffffff').describe('Logo card background'),
  showBorder: z.boolean().default(true).describe('Show border around logos'),
  grayscale: z.boolean().default(false).describe('Display logos in grayscale'),
  accentColor: z.string().default('#0b6d41').describe('Accent color'),

  // Autoplay
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
 * Modern partner logo showcase with:
 * - Section badge with decorative elements
 * - Auto-scrolling carousel with pause on hover
 * - Scroll-triggered animations
 * - Multiple layout options (carousel, grid, marquee)
 * - Modern card hover effects with external link indicator
 */
export function PartnersLogos({
  headerPart1 = 'Supporting',
  headerPart2 = 'Partners',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  headerPart2Italic = true,
  subtitle,
  partners = [],
  layout = 'carousel',
  columns = '6',
  backgroundColor = '#ffffff',
  cardBackgroundColor = '#ffffff',
  showBorder = true,
  grayscale = false,
  accentColor = '#0b6d41',
  autoplaySpeed = 2000,
  className,
  isEditing,
}: PartnersLogosProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const headerRef = useInView()
  const contentRef = useInView()

  const defaultPartners: PartnerItem[] = [
    { name: 'Yi Accessibility', logo: '', link: '#' },
    { name: 'Yi Innovation', logo: '', link: '#' },
    { name: 'Yi Learning', logo: '', link: '#' },
    { name: 'Road Safety', logo: '', link: '#' },
    { name: 'Young Indians', logo: '', link: '#' },
    { name: 'CII', logo: '', link: '#' },
    { name: 'NASSCOM', logo: '', link: '#' },
    { name: 'TCS', logo: '', link: '#' },
  ]

  // Always show default partners if empty (users can add real data via admin panel)
  const displayPartners = partners.length > 0 ? partners : defaultPartners

  // Autoplay carousel
  useEffect(() => {
    if (layout !== 'carousel' || isEditing || isPaused) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const cardWidth = 180

        // If near the end, scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
      }
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [layout, isEditing, isPaused, autoplaySpeed])

  const columnClasses = {
    '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    '5': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    '6': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    '8': 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
  }

  return (
    <section
      className={cn('relative py-12 md:py-16 lg:py-20 w-full overflow-hidden', className)}
      style={{ backgroundColor }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at top right, ${accentColor} 0%, transparent 70%)`
          }}
        />

        {/* Floating circles */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-16 -left-16 w-56 h-56 rounded-full opacity-5"
          style={{ backgroundColor: accentColor }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${accentColor} 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div
          ref={headerRef.ref}
          className={cn(
            "text-center mb-10 md:mb-14 transition-all duration-1000",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Section Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            <Handshake className="w-4 h-4" />
            <span>Trusted Partners</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span
              className={headerPart2Italic ? 'italic' : ''}
              style={{ color: headerPart2Color }}
            >
              {headerPart2}
            </span>
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Decorative line */}
          <div
            className="w-24 h-1 mx-auto mt-6 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Partners Display */}
        <div
          ref={contentRef.ref}
          className={cn(
            "transition-all duration-1000 delay-200",
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
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayPartners.map((partner, index) => (
                  <PartnerCard
                    key={index}
                    partner={partner}
                    cardBg={cardBackgroundColor}
                    accentColor={accentColor}
                    showBorder={showBorder}
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
              cardBg={cardBackgroundColor}
              accentColor={accentColor}
              showBorder={showBorder}
              grayscale={grayscale}
              isEditing={isEditing}
            />
          ) : (
            <div className={cn('grid gap-6 max-w-6xl mx-auto', columnClasses[columns])}>
              {displayPartners.map((partner, index) => (
                <PartnerCard
                  key={index}
                  partner={partner}
                  cardBg={cardBackgroundColor}
                  accentColor={accentColor}
                  showBorder={showBorder}
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
  cardBg,
  accentColor,
  showBorder,
  grayscale,
  isEditing,
  className,
  index,
  isInView,
}: {
  partner: PartnerItem
  cardBg: string
  accentColor: string
  showBorder: boolean
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
        'group p-4 rounded-xl flex items-center justify-center h-full transition-all duration-500 hover:shadow-lg hover:-translate-y-1',
        showBorder && 'border border-gray-200 hover:border-gray-300',
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{
        backgroundColor: cardBg,
        transitionDelay: `${index * 50}ms`,
        boxShadow: isHovered ? `0 8px 30px ${accentColor}15` : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {partner.logo ? (
        <Image
          src={partner.logo}
          alt={partner.name}
          width={120}
          height={60}
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
              backgroundColor: isHovered ? `${accentColor}15` : '#f3f4f6',
            }}
          >
            <span
              className="text-xs font-bold transition-colors duration-300"
              style={{ color: isHovered ? accentColor : '#9ca3af' }}
            >
              {partner.name.charAt(0)}
            </span>
          </div>
          <span className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-700 transition-colors">
            {partner.name}
          </span>
        </div>
      )}

      {/* External Link Indicator */}
      {partner.link && (
        <div
          className={cn(
            'absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-300',
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}
        >
          <ExternalLink className="w-3 h-3" style={{ color: accentColor }} />
        </div>
      )}
    </div>
  )

  if (partner.link && !isEditing) {
    return (
      <Link href={partner.link} target="_blank" rel="noopener noreferrer" className={cn('block relative', className)}>
        {cardContent}
      </Link>
    )
  }

  return <div className={cn('relative', className)}>{cardContent}</div>
}

/**
 * Marquee Animation for Logos
 */
function MarqueeLogos({
  partners,
  cardBg,
  accentColor,
  showBorder,
  grayscale,
  isEditing,
}: {
  partners: PartnerItem[]
  cardBg: string
  accentColor: string
  showBorder: boolean
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
            cardBg={cardBg}
            accentColor={accentColor}
            showBorder={showBorder}
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
