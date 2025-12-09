'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

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
 * PartnersLogos Component
 *
 * Partner logo showcase with:
 * - Split-color header with brand colors
 * - Auto-scrolling carousel with pause on hover
 * - Multiple layout options (carousel, grid, marquee)
 * - Optional grayscale effect
 * - Hover effects
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
      className={cn('py-10 md:py-12 w-full', className)}
      style={{ backgroundColor }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
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
        </div>

        {/* Partners Display */}
        {layout === 'carousel' ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel - No navigation arrows */}
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
                  showBorder={showBorder}
                  grayscale={grayscale}
                  isEditing={isEditing}
                  className="flex-shrink-0 w-[160px] h-[100px]"
                />
              ))}
            </div>
          </div>
        ) : layout === 'marquee' ? (
          <MarqueeLogos
            partners={displayPartners}
            cardBg={cardBackgroundColor}
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
                showBorder={showBorder}
                grayscale={grayscale}
                isEditing={isEditing}
                className="h-[100px]"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Individual Partner Card - Uniform sizing
 */
function PartnerCard({
  partner,
  cardBg,
  showBorder,
  grayscale,
  isEditing,
  className,
}: {
  partner: PartnerItem
  cardBg: string
  showBorder: boolean
  grayscale: boolean
  isEditing?: boolean
  className?: string
}) {
  const cardContent = (
    <div
      className={cn(
        'group p-4 rounded-xl flex items-center justify-center h-full transition-all duration-300 hover:shadow-md',
        showBorder && 'border border-gray-200',
        className
      )}
      style={{ backgroundColor: cardBg }}
    >
      {partner.logo ? (
        <Image
          src={partner.logo}
          alt={partner.name}
          width={120}
          height={60}
          className={cn(
            'object-contain max-h-16 transition-all duration-300',
            grayscale && 'grayscale group-hover:grayscale-0'
          )}
        />
      ) : (
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-2 flex items-center justify-center">
            <span className="text-gray-400 text-xs font-bold">{partner.name.charAt(0)}</span>
          </div>
          <span className="text-xs text-gray-400 line-clamp-1">{partner.name}</span>
        </div>
      )}
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
  cardBg,
  showBorder,
  grayscale,
  isEditing,
}: {
  partners: PartnerItem[]
  cardBg: string
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
            showBorder={showBorder}
            grayscale={grayscale}
            isEditing={isEditing}
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
