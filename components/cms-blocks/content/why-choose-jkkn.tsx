'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Landmark,
  Briefcase,
  Trophy,
  GraduationCap,
  Building2,
  Wallet,
  Check,
  Sparkles,
} from 'lucide-react'
import { useSectionTypography } from '@/lib/cms/hooks/use-section-typography'

/**
 * WhyChooseJKKN CMS Block Component
 *
 * Modern Card-Based Layout with full typography customization:
 * - Section header with badge, title, subtitle, and tagline
 * - 6 USP cards (icon + title + optional stat)
 * - Additional USPs as compact list
 * - Complete font color, size, weight editing for all text elements
 */

/**
 * Normalizes a hex color value to ensure it's valid
 * Handles 3, 4, 6, and 8 digit hex formats
 * Keeps 8-digit format for alpha colors
 */
function normalizeColor(color: string | undefined, fallback: string): string {
  if (!color || typeof color !== 'string') return fallback

  const trimmed = color.trim().toLowerCase()
  if (!trimmed.startsWith('#')) return fallback

  const hex = trimmed.slice(1)

  // Validate hex characters
  if (!/^[0-9a-f]+$/.test(hex)) return fallback

  // Handle different valid formats
  if (hex.length === 3) {
    // 3-digit shorthand (#RGB -> #RRGGBB)
    return '#' + hex.split('').map(c => c + c).join('')
  } else if (hex.length === 4) {
    // 4-digit shorthand with alpha - expand to 8-digit
    return '#' + hex.split('').map(c => c + c).join('')
  } else if (hex.length === 6) {
    // Valid 6-digit format
    return '#' + hex
  } else if (hex.length === 8) {
    // Valid 8-digit format with alpha - keep as is
    return '#' + hex
  } else if (hex.length < 6) {
    // Incomplete - pad with zeros to 6 characters
    return '#' + hex.padEnd(6, '0')
  } else if (hex.length === 7) {
    // 7 characters - trim to 6 (incomplete alpha)
    return '#' + hex.slice(0, 6)
  }

  return fallback
}

// Font size mapping (responsive Tailwind classes)
const fontSizeClasses: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-3xl sm:text-4xl',
  '4xl': 'text-4xl sm:text-5xl',
  '5xl': 'text-4xl sm:text-5xl lg:text-6xl',
  '6xl': 'text-5xl sm:text-6xl lg:text-7xl',
}

const fontWeightClasses: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

// Type definitions
export interface USPCard {
  icon: 'heritage' | 'career' | 'excellence' | 'expertise' | 'facilities' | 'value'
  title: string
  stat?: string
}

export interface WhyChooseJKKNProps {
  // Content
  title?: string
  subtitle?: string
  tagline?: string
  badgeText?: string
  additionalUspsHeading?: string
  uspCards?: USPCard[]
  additionalUsps?: string[]

  // Badge Typography
  badgeColor?: string
  badgeBgColor?: string
  badgeFontSize?: string
  badgeFontWeight?: string

  // Title Typography
  titleFontFamily?: string
  titleColor?: string
  titleFontSize?: string
  titleFontWeight?: string

  // Subtitle Typography
  subtitleColor?: string
  subtitleFontSize?: string
  subtitleFontWeight?: string

  // Tagline Typography
  taglineColor?: string
  taglineFontSize?: string
  taglineFontWeight?: string

  // Card Typography
  cardTitleColor?: string
  cardTitleFontSize?: string
  cardTitleFontWeight?: string
  cardStatColor?: string
  cardStatFontSize?: string
  cardStatFontWeight?: string

  // Additional USPs Typography
  additionalUspsHeadingColor?: string
  additionalUspsHeadingFontSize?: string
  additionalUspsHeadingFontWeight?: string
  additionalUspsTextColor?: string
  additionalUspsTextFontSize?: string
  additionalUspsTextFontWeight?: string

  // Additional USPs Visibility
  showAdditionalUsps?: boolean

  // System
  isEditing?: boolean
  primaryColor?: string
}

// Get icon component based on icon type
function getIconComponent(iconType: USPCard['icon']) {
  switch (iconType) {
    case 'heritage':
      return Landmark
    case 'career':
      return Briefcase
    case 'excellence':
      return Trophy
    case 'expertise':
      return GraduationCap
    case 'facilities':
      return Building2
    case 'value':
      return Wallet
    default:
      return Landmark
  }
}

// Default USP Cards
const defaultUspCards: USPCard[] = [
  { icon: 'heritage', title: 'Years of Educational Legacy', stat: '73+' },
  { icon: 'career', title: 'Placement Success Rate', stat: '92%+' },
  { icon: 'excellence', title: 'NAAC A Accredited Quality' },
  { icon: 'expertise', title: 'Expert Learning Facilitators', stat: '400+' },
  { icon: 'facilities', title: 'State-of-the-Art Infrastructure' },
  { icon: 'value', title: 'Affordable & Accessible Education' },
]

// Default Additional USPs
const defaultAdditionalUsps = [
  '50+ Industry-Relevant Programs across Medical, Engineering, Arts & Science',
  'Multi-Specialty Hospital for clinical training and community healthcare',
  'Industry-Integrated Curriculum with internships and live projects',
  'Research & Innovation Hub with funded projects and patent support',
  'Holistic Development through sports, cultural, and social activities',
  'Safe & Secure Campus with 24/7 security and CCTV surveillance',
  'Strong Alumni Network of 50,000+ professionals worldwide',
  'Entrepreneurship Support through incubation centers and startup mentoring',
]

// Intersection Observer hook - Optimized to prevent forced reflows
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to prevent forced reflow
          requestAnimationFrame(() => {
            setIsInView(true)
          })
        }
      },
      { threshold, rootMargin: '50px' } // Trigger slightly earlier for smoother UX
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// USP Card Component - Horizontal layout with icon left, title right
function USPCardComponent({
  card,
  index,
  isInView,
  cardTitleColor,
  cardTitleFontSize,
  cardTitleFontWeight,
  cardStatColor,
  cardStatFontWeight,
}: {
  card: USPCard
  index: number
  isInView: boolean
  cardTitleColor?: string
  cardTitleFontSize?: string
  cardTitleFontWeight?: string
  cardStatColor?: string
  cardStatFontSize?: string
  cardStatFontWeight?: string
}) {
  const IconComponent = getIconComponent(card.icon)

  return (
    <div
      className={cn(
        'group relative rounded-2xl p-5',
        'bg-white/70 backdrop-blur-md',
        'flex items-center gap-4',
        'shadow-[0_4px_20px_rgba(0,0,0,0.08),0_8px_40px_rgba(11,109,65,0.15)]',
        'hover:shadow-[0_8px_30px_rgba(0,0,0,0.12),0_16px_60px_rgba(11,109,65,0.2)]',
        'hover:-translate-y-1',
        'border border-white/50',
        'transition-all duration-500 ease-out cursor-default',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Icon Container - Left side */}
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center',
          'bg-primary/10',
          'group-hover:bg-primary',
          'transition-all duration-300'
        )}
      >
        <IconComponent
          className={cn(
            'w-6 h-6 text-primary',
            'group-hover:text-white',
            'transition-colors duration-300'
          )}
        />
      </div>

      {/* Text Content - Right side */}
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            'leading-tight',
            fontSizeClasses[cardTitleFontSize || 'md'],
            fontWeightClasses[cardTitleFontWeight || 'semibold']
          )}
          style={{ color: normalizeColor(cardTitleColor, '#1f2937') }}
        >
          {card.stat && (
            <span
              className={fontWeightClasses[cardStatFontWeight || 'bold']}
              style={{ color: normalizeColor(cardStatColor, '#0b6d41') }}
            >
              {card.stat}{' '}
            </span>
          )}
          {card.title}
        </h3>
      </div>

      {/* Decorative corner on hover */}
      <div
        className={cn(
          'absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-2xl',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        )}
      >
        <div className="absolute -top-6 -right-6 w-12 h-12 rotate-45 bg-secondary/20" />
      </div>
    </div>
  )
}

// Main Component
export default function WhyChooseJKKN({
  // Content
  title = 'Why Choose JKKN?',
  subtitle = '73+ Years of Transforming Lives Through Progressive Education',
  tagline = 'Where Legacy Meets Innovation | Excellence Without Elitism',
  badgeText = 'Why Choose Us',
  additionalUspsHeading = 'And Much More...',
  uspCards = defaultUspCards,
  additionalUsps = defaultAdditionalUsps,

  // Badge Typography
  badgeColor = '#0b6d41',
  badgeBgColor = '#0b6d411a',
  badgeFontSize = 'sm',
  badgeFontWeight = 'semibold',

  // Title Typography
  titleFontFamily,
  titleColor = '#171717',
  titleFontSize = '5xl',
  titleFontWeight = 'bold',

  // Subtitle Typography
  subtitleColor = '#0b6d41',
  subtitleFontSize = '2xl',
  subtitleFontWeight = 'semibold',

  // Tagline Typography
  taglineColor = '#525252',
  taglineFontSize = 'lg',
  taglineFontWeight = 'normal',

  // Card Typography
  cardTitleColor = '#1f2937',
  cardTitleFontSize = 'md',
  cardTitleFontWeight = 'semibold',
  cardStatColor = '#0b6d41',
  cardStatFontSize = '3xl',
  cardStatFontWeight = 'bold',

  // Additional USPs Typography
  additionalUspsHeadingColor = '#1f2937',
  additionalUspsHeadingFontSize = 'lg',
  additionalUspsHeadingFontWeight = 'semibold',
  additionalUspsTextColor = '#374151',
  additionalUspsTextFontSize = 'sm',
  additionalUspsTextFontWeight = 'normal',

  // Additional USPs Visibility (hidden by default)
  showAdditionalUsps = false,

  // System
  isEditing = false,
}: WhyChooseJKKNProps) {
  const sectionRef = useInView(0.1)
  const cardsRef = useInView(0.2)
  const listRef = useInView(0.2)

  // Get page-level typography with block overrides
  const { title: titleTypo, subtitle: subtitleTypo, badge: badgeTypo } = useSectionTypography({
    titleColor,
    subtitleColor,
    badgeColor,
    badgeBgColor,
  })

  // Empty state for editing
  if (!uspCards?.length && !additionalUsps?.length && isEditing) {
    return (
      <section className="py-12 px-4 relative overflow-hidden bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto p-12 border-2 border-dashed border-primary/30 rounded-2xl bg-white">
            <Sparkles className="w-16 h-16 text-primary/50 mx-auto mb-6" />
            <p className="text-gray-500 text-center text-lg">
              Configure the Why Choose JKKN section through the page editor properties panel
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decorations using brand colors */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div
          ref={sectionRef.ref}
          className={cn(
            'text-center max-w-4xl mx-auto mb-12 md:mb-16',
            'transition-all duration-700',
            sectionRef.isInView || isEditing
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          )}
        >
          {/* Badge */}
          <span
            className={cn(
              'inline-block px-4 py-1.5 rounded-full mb-4',
              badgeTypo.className || fontSizeClasses[badgeFontSize],
              !badgeTypo.className && fontWeightClasses[badgeFontWeight]
            )}
            style={{
              color: badgeTypo.style.color || normalizeColor(badgeColor, '#0b6d41'),
              backgroundColor: badgeTypo.backgroundColor || normalizeColor(badgeBgColor, '#0b6d411a')
            }}
          >
            {badgeText}
          </span>

          {/* Title */}
          <h2
            className={cn(
              'mb-3',
              (!titleFontFamily || titleFontFamily === 'Default (Serif)') && 'font-serif-heading',
              titleTypo.className || fontSizeClasses[titleFontSize],
              !titleTypo.className && fontWeightClasses[titleFontWeight]
            )}
            style={{
              color: titleTypo.style.color || normalizeColor(titleColor, '#171717'),
              fontFamily: (titleFontFamily && titleFontFamily !== 'Default (Serif)') ? titleFontFamily : undefined,
            }}
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p
            className={cn(
              'mb-4',
              subtitleTypo.className || fontSizeClasses[subtitleFontSize],
              !subtitleTypo.className && fontWeightClasses[subtitleFontWeight]
            )}
            style={{ color: subtitleTypo.style.color || normalizeColor(subtitleColor, '#0b6d41') }}
          >
            {subtitle}
          </p>

          {/* Tagline */}
          <p
            className={cn(
              fontSizeClasses[taglineFontSize],
              fontWeightClasses[taglineFontWeight]
            )}
            style={{ color: normalizeColor(taglineColor, '#525252') }}
          >
            {tagline}
          </p>
        </div>

        {/* USP Cards Grid */}
        <div
          ref={cardsRef.ref}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
            showAdditionalUsps ? "mb-12 md:mb-16" : "mb-0"
          )}
        >
          {uspCards.map((card, index) => (
            <USPCardComponent
              key={index}
              card={card}
              index={index}
              isInView={cardsRef.isInView || isEditing}
              cardTitleColor={cardTitleColor}
              cardTitleFontSize={cardTitleFontSize}
              cardTitleFontWeight={cardTitleFontWeight}
              cardStatColor={cardStatColor}
              cardStatFontSize={cardStatFontSize}
              cardStatFontWeight={cardStatFontWeight}
            />
          ))}
        </div>

        {/* Additional USPs - Compact List (hidden by default, toggle via showAdditionalUsps) */}
        {showAdditionalUsps && additionalUsps && additionalUsps.length > 0 && (
          <div
            ref={listRef.ref}
            className={cn(
              'bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8',
              'shadow-[0_4px_20px_rgba(0,0,0,0.08),0_8px_40px_rgba(11,109,65,0.15)]',
              'hover:shadow-[0_8px_30px_rgba(0,0,0,0.12),0_16px_60px_rgba(11,109,65,0.2)]',
              'border border-white/50',
              'transition-all duration-700 delay-300',
              listRef.isInView || isEditing
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            )}
          >
            <h3
              className={cn(
                'mb-4 text-center',
                fontSizeClasses[additionalUspsHeadingFontSize],
                fontWeightClasses[additionalUspsHeadingFontWeight]
              )}
              style={{ color: normalizeColor(additionalUspsHeadingColor, '#1f2937') }}
            >
              {additionalUspsHeading}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {additionalUsps.map((usp, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg',
                    'hover:bg-gray-50 transition-colors duration-200'
                  )}
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-primary/10">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span
                    className={cn(
                      'leading-relaxed',
                      fontSizeClasses[additionalUspsTextFontSize],
                      fontWeightClasses[additionalUspsTextFontWeight]
                    )}
                    style={{ color: normalizeColor(additionalUspsTextColor, '#374151') }}
                  >
                    {usp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
