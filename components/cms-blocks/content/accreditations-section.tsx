'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  Trophy,
  CheckCircle,
  Award,
  Shield,
  Calendar,
  Heart,
  Leaf,
  TrendingUp,
  Building,
  GraduationCap,
  Stethoscope,
  FlaskConical,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type {
  AccreditationsSectionProps,
  AccreditationCard,
  TrustRecognitionBadge,
} from '@/lib/cms/registry-types'
import { DecorativePatterns, CurveDivider } from '../shared/decorative-patterns'

// Icon mapping for Lucide icons
const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  CheckCircle,
  Award,
  Shield,
  Calendar,
  Heart,
  Leaf,
  TrendingUp,
  Building,
  GraduationCap,
  Stethoscope,
  FlaskConical,
  Star,
  Users,
}

// Grid column classes based on cardsPerRow
const gridColClasses = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Card style classes
const cardStyleClasses = {
  glass: {
    dark: 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20',
    light: 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg hover:bg-white/90 hover:shadow-xl',
    'dark-elegant': 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/15 hover:from-white/15 hover:to-white/10',
  },
  solid: {
    dark: 'bg-gray-900/80 border border-gray-700 hover:bg-gray-800/80',
    light: 'bg-white border border-gray-200 shadow-lg hover:shadow-xl',
    'dark-elegant': 'bg-gray-900/90 border border-gray-600 hover:bg-gray-800/90',
  },
  gradient: {
    dark: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10',
    light: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg',
    'dark-elegant': 'bg-gradient-to-br from-emerald-900/30 to-emerald-950/20 backdrop-blur-md border border-emerald-500/20',
  },
}

// Get icon component from name
function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Award
}

// Section Header Component
function SectionHeader({
  badge,
  title,
  titleAccentWord,
  subtitle,
  description,
  isDark,
  isVisible,
  showAnimations,
}: {
  badge: string
  title: string
  titleAccentWord?: string
  subtitle: string
  description: string
  isDark: boolean
  isVisible: boolean
  showAnimations: boolean
}) {
  // Parse title for accent word styling
  const titleParts = useMemo(() => {
    if (!titleAccentWord || !title.includes(titleAccentWord)) {
      return { before: title, accent: '', after: '' }
    }
    const parts = title.split(titleAccentWord)
    return {
      before: parts[0] || '',
      accent: titleAccentWord,
      after: parts[1] || '',
    }
  }, [title, titleAccentWord])

  return (
    <div
      className={cn(
        'max-w-4xl mx-auto text-center mb-12 lg:mb-16',
        showAnimations && 'transition-all duration-700',
        showAnimations && (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
      )}
    >
      {/* Badge */}
      {badge && (
        <div className="flex justify-center mb-4">
          <span
            className={cn(
              'inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase',
              isDark
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-primary/10 text-primary border border-primary/20'
            )}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Title with accent word */}
      <h2
        className={cn(
          'text-3xl sm:text-4xl lg:text-5xl font-bold mb-4',
          isDark ? 'text-white' : 'text-gray-900'
        )}
      >
        {titleParts.before}
        {titleParts.accent && (
          <span className="text-gold italic"> {titleParts.accent}</span>
        )}
        {titleParts.after}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            'text-lg sm:text-xl mb-4',
            isDark ? 'text-white/80' : 'text-gray-600'
          )}
        >
          {subtitle}
        </p>
      )}

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-base max-w-3xl mx-auto',
            isDark ? 'text-white/60' : 'text-gray-500'
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

// Accreditation Card Component
function AccreditationCardItem({
  card,
  index,
  cardStyle,
  glassmorphismVariant,
  isDark,
  isVisible,
  showAnimations,
  animationPreset,
  staggerDelay,
}: {
  card: AccreditationCard
  index: number
  cardStyle: 'glass' | 'solid' | 'gradient'
  glassmorphismVariant: 'dark' | 'light' | 'dark-elegant'
  isDark: boolean
  isVisible: boolean
  showAnimations: boolean
  animationPreset: string
  staggerDelay: number
}) {
  const IconComponent = getIconComponent(card.icon)
  const styleClasses = cardStyleClasses[cardStyle][glassmorphismVariant]

  return (
    <div
      className={cn(
        'group relative rounded-2xl p-6 lg:p-8 text-center',
        'transition-all duration-500 ease-out',
        'hover:scale-[1.02] hover:-translate-y-1',
        styleClasses,
        showAnimations && animationPreset !== 'none' && (
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        )
      )}
      style={
        showAnimations && animationPreset === 'stagger'
          ? { transitionDelay: `${index * staggerDelay}ms` }
          : undefined
      }
    >
      {/* Icon Container */}
      <div
        className={cn(
          'mx-auto w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-4 lg:mb-6',
          'transition-all duration-300 group-hover:scale-110',
          isDark
            ? 'bg-gold/20 text-gold shadow-lg shadow-gold/10'
            : 'bg-primary/10 text-primary'
        )}
      >
        <IconComponent className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={1.5} />
      </div>

      {/* Card Name */}
      <h3
        className={cn(
          'text-lg lg:text-xl font-bold mb-2 lg:mb-3',
          isDark ? 'text-white' : 'text-gray-900'
        )}
      >
        {card.name}
      </h3>

      {/* Card Description */}
      <p
        className={cn(
          'text-sm lg:text-base leading-relaxed',
          isDark ? 'text-white/70' : 'text-gray-600'
        )}
      >
        {card.description}
      </p>
    </div>
  )
}

// Trust Badge Component
function TrustBadgeItem({
  badge,
  index,
  isDark,
  isVisible,
  showAnimations,
  staggerDelay,
}: {
  badge: TrustRecognitionBadge
  index: number
  isDark: boolean
  isVisible: boolean
  showAnimations: boolean
  staggerDelay: number
}) {
  const IconComponent = getIconComponent(badge.icon)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full',
        'transition-all duration-500 ease-out',
        'hover:scale-105',
        isDark
          ? 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15'
          : 'bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg',
        showAnimations && (
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )
      )}
      style={
        showAnimations
          ? { transitionDelay: `${(index + 8) * staggerDelay}ms` }
          : undefined
      }
    >
      {/* Icon */}
      <div
        className={cn(
          'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0',
          isDark ? 'bg-gold/20 text-gold' : 'bg-primary/10 text-primary'
        )}
      >
        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
      </div>

      {/* Text */}
      <div className="text-left">
        <span
          className={cn(
            'text-sm sm:text-base font-semibold block leading-tight',
            isDark ? 'text-white' : 'text-gray-900'
          )}
        >
          {badge.text}
        </span>
        {badge.subtext && (
          <span
            className={cn(
              'text-xs block',
              isDark ? 'text-white/60' : 'text-gray-500'
            )}
          >
            {badge.subtext}
          </span>
        )}
      </div>
    </div>
  )
}

// Main Component
export default function AccreditationsSection({
  badge = 'ACCREDITATIONS',
  title = 'Accreditations & Approvals',
  titleAccentWord = 'Approvals',
  subtitle = "Recognized for Excellence by India's Premier Regulatory Bodies",
  description = 'JKKN Institutions proudly holds approvals and accreditations from all major national regulatory bodies, ensuring our Learners receive education that meets the highest standards of quality, compliance, and industry relevance.',
  accreditationCards = [],
  trustBadges = [],
  showAccreditationCards = true,
  showTrustBadges = true,
  cardsPerRow = '4',
  cardLayout = 'grid',
  badgeLayout = 'row',
  backgroundColor = 'gradient-dark',
  glassmorphismVariant = 'dark',
  cardStyle = 'glass',
  showAnimations = true,
  animationPreset = 'stagger',
  staggerDelay = 100,
  isEditing = false,
}: AccreditationsSectionProps) {
  const [isVisible, setIsVisible] = useState(!showAnimations || isEditing)
  const sectionRef = useRef<HTMLElement>(null)

  // Sort cards and badges by order
  const sortedCards = useMemo(
    () => [...accreditationCards].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [accreditationCards]
  )

  const sortedBadges = useMemo(
    () => [...trustBadges].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [trustBadges]
  )

  // IntersectionObserver for scroll animations
  useEffect(() => {
    if (!showAnimations || isEditing) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [showAnimations, isEditing])

  const isDark = backgroundColor !== 'gradient-light' && backgroundColor !== 'solid'

  // Empty state for editor
  if (accreditationCards.length === 0 && trustBadges.length === 0 && isEditing) {
    return (
      <section className="relative py-24 lg:py-32 overflow-hidden section-green-gradient">
        <DecorativePatterns variant="minimal" color="white" />
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto p-8 border-2 border-dashed border-white/30 rounded-2xl bg-white/5 backdrop-blur-sm">
            <p className="text-white/60 text-center">
              Click to add accreditation cards and trust badges in the properties panel
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Don't render if no content and not editing
  if (accreditationCards.length === 0 && trustBadges.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full overflow-hidden py-16 md:py-20 lg:py-28',
        backgroundColor === 'gradient-dark' && 'section-green-gradient',
        backgroundColor === 'gradient-light' && 'bg-gradient-to-br from-gray-50 to-white',
        backgroundColor === 'solid' && 'bg-brand-cream',
        backgroundColor === 'transparent' && 'bg-transparent'
      )}
    >
      {/* Decorative Patterns */}
      <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Section Header */}
        <SectionHeader
          badge={badge}
          title={title}
          titleAccentWord={titleAccentWord}
          subtitle={subtitle}
          description={description}
          isDark={isDark}
          isVisible={isVisible}
          showAnimations={showAnimations}
        />

        {/* Accreditation Cards Grid */}
        {showAccreditationCards && sortedCards.length > 0 && (
          <div
            className={cn(
              'grid gap-4 md:gap-6 lg:gap-8 mb-12 lg:mb-16',
              gridColClasses[cardsPerRow]
            )}
          >
            {sortedCards.map((card, index) => (
              <AccreditationCardItem
                key={`card-${index}`}
                card={card}
                index={index}
                cardStyle={cardStyle}
                glassmorphismVariant={glassmorphismVariant}
                isDark={isDark}
                isVisible={isVisible}
                showAnimations={showAnimations}
                animationPreset={animationPreset}
                staggerDelay={staggerDelay}
              />
            ))}
          </div>
        )}

        {/* Trust & Recognition Badges */}
        {showTrustBadges && sortedBadges.length > 0 && (
          <div
            className={cn(
              'flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6',
              badgeLayout === 'grid' && 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            )}
          >
            {sortedBadges.map((badge, index) => (
              <TrustBadgeItem
                key={`badge-${index}`}
                badge={badge}
                index={index}
                isDark={isDark}
                isVisible={isVisible}
                showAnimations={showAnimations}
                staggerDelay={staggerDelay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Curved Bottom Divider */}
      <CurveDivider position="bottom" color="#fbfbee" />
    </section>
  )
}
