'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Check, Download, ExternalLink, ChevronRight } from 'lucide-react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import { glassStyles, backgroundStyles, isDarkBackground } from './shared/admission-glass-styles'

// Props interface
export interface TrustBadge {
  icon?: string
  label: string
}

export interface CTAButton {
  label: string
  link: string
  variant: 'primary' | 'secondary' | 'outline'
  isExternal?: boolean
  icon?: 'arrow' | 'download' | 'external' | 'none'
}

export interface AdmissionHeroProps {
  // Badge
  badge?: {
    text: string
    emoji?: string
  }

  // Content
  title?: string
  titleAccentWord?: string
  subtitle?: string

  // CTAs
  ctaButtons?: CTAButton[]

  // Trust badges
  trustBadges?: TrustBadge[]

  // Styling
  backgroundColor?: 'gradient-dark' | 'gradient-light' | 'solid' | 'transparent'
  showAnimations?: boolean
  titleColor?: string
  subtitleColor?: string
  accentColor?: string

  // Page builder
  className?: string
  isEditing?: boolean
}

// Intersection Observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Button icon component
function ButtonIcon({ icon, variant }: { icon: CTAButton['icon'], variant: CTAButton['variant'] }) {
  if (icon === 'none' || !icon) return null

  const iconClass = cn(
    'w-4 h-4 transition-transform duration-300',
    'group-hover:translate-x-0.5'
  )

  switch (icon) {
    case 'download':
      return <Download className={iconClass} />
    case 'external':
      return <ExternalLink className={iconClass} />
    case 'arrow':
    default:
      return <ChevronRight className={iconClass} />
  }
}

export default function AdmissionHero({
  badge = {
    text: 'Celebrating #JKKN100 — Founder\'s Centenary Year',
    emoji: '🎉'
  },
  title = 'Admissions 2025-26',
  titleAccentWord = '2025-26',
  subtitle = 'Begin your transformative learning journey at J.K.K. Nattraja Educational Institutions — where 5000+ Learners discover their potential across 7 specialized colleges.',
  ctaButtons = [
    { label: 'Apply Now', link: 'https://apply.jkkn.ac.in', variant: 'primary', isExternal: true, icon: 'external' },
    { label: 'Explore Colleges', link: '#colleges', variant: 'secondary', icon: 'arrow' },
    { label: 'Download Prospectus', link: '/prospectus.pdf', variant: 'outline', icon: 'download' },
  ],
  trustBadges = [
    { icon: 'check', label: 'NAAC Accredited' },
    { icon: 'check', label: 'AICTE Approved' },
    { icon: 'check', label: 'UGC Recognized' },
    { icon: 'check', label: 'NBA Accredited' },
  ],
  backgroundColor = 'gradient-dark',
  showAnimations = true,
  titleColor,
  subtitleColor,
  accentColor = '#D4AF37',
  className,
  isEditing,
}: AdmissionHeroProps) {
  const sectionRef = useInView()
  const isDark = isDarkBackground(backgroundColor)

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

  // Button styles by variant
  const getButtonStyles = (variant: CTAButton['variant']) => {
    switch (variant) {
      case 'primary':
        return cn(
          'bg-brand-accent hover:bg-brand-accent-dark',
          'text-white font-semibold',
          'shadow-lg shadow-brand-accent/30',
          'hover:shadow-xl hover:shadow-brand-accent/40',
          'hover:-translate-y-0.5'
        )
      case 'secondary':
        return cn(
          'bg-white/10 backdrop-blur-sm',
          'border-2 border-white/30',
          'text-white hover:bg-white/20',
          'hover:border-white/50'
        )
      case 'outline':
        return cn(
          'bg-transparent',
          'border-2 border-white/50',
          'text-white hover:bg-white/10',
          'hover:border-white'
        )
      default:
        return ''
    }
  }

  return (
    <section
      ref={sectionRef.ref}
      className={cn(
        'relative min-h-[60vh] md:min-h-[70vh] py-16 md:py-24 overflow-hidden',
        'flex items-center',
        backgroundStyles[backgroundColor],
        className
      )}
    >
      {/* Decorative Patterns */}
      <DecorativePatterns variant="scattered" color={isDark ? 'white' : 'green'} />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />

      {/* Accent shape */}
      <div
        className="absolute top-0 right-0 w-[40%] h-full opacity-10 pointer-events-none"
        style={{
          background: accentColor,
          clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'max-w-4xl mx-auto text-center',
            showAnimations && 'transition-all duration-700',
            showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
          )}
        >
          {/* Animated Badge */}
          {badge?.text && (
            <div
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6',
                'text-sm font-semibold tracking-wide',
                glassStyles.badge,
                'animate-pulse-subtle',
                isDark ? 'text-white' : 'text-brand-primary'
              )}
              style={{
                animationDuration: '2s',
              }}
            >
              {badge.emoji && <span className="text-lg">{badge.emoji}</span>}
              <span>{badge.text}</span>
            </div>
          )}

          {/* Title */}
          <h1
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6',
              'leading-tight tracking-tight',
              isDark ? 'text-white' : 'text-brand-primary'
            )}
            style={{ color: titleColor }}
          >
            {titleParts.before}
            {titleParts.accent && (
              <span
                className="bg-gradient-to-r from-brand-accent via-gold to-brand-accent bg-clip-text text-transparent"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundSize: '200% auto',
                }}
              >
                {titleParts.accent}
              </span>
            )}
            {titleParts.after}
          </h1>

          {/* Subtitle */}
          <p
            className={cn(
              'text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto',
              'leading-relaxed',
              isDark ? 'text-white/90' : 'text-gray-600'
            )}
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          {ctaButtons && ctaButtons.length > 0 && (
            <div
              className={cn(
                'flex flex-wrap justify-center gap-4 mb-10',
                showAnimations && 'transition-all duration-700 delay-200',
                showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')
              )}
            >
              {ctaButtons.map((button, index) => {
                const ButtonComponent = button.isExternal ? 'a' : Link
                const buttonProps = button.isExternal
                  ? { href: button.link, target: '_blank', rel: 'noopener noreferrer' }
                  : { href: button.link }

                return (
                  <ButtonComponent
                    key={index}
                    {...buttonProps}
                    className={cn(
                      'group inline-flex items-center gap-2',
                      'px-6 py-3 sm:px-8 sm:py-4 rounded-lg',
                      'text-base sm:text-lg font-semibold',
                      'transition-all duration-300',
                      getButtonStyles(button.variant)
                    )}
                    style={{
                      transitionDelay: showAnimations ? `${index * 100}ms` : '0ms',
                    }}
                  >
                    {button.label}
                    <ButtonIcon icon={button.icon} variant={button.variant} />
                  </ButtonComponent>
                )
              })}
            </div>
          )}

          {/* Trust Badges */}
          {trustBadges && trustBadges.length > 0 && (
            <div
              className={cn(
                'flex flex-wrap justify-center gap-4 sm:gap-6',
                showAnimations && 'transition-all duration-700 delay-400',
                showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')
              )}
            >
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2',
                    'rounded-full',
                    glassStyles.badge,
                    isDark ? 'text-white/90' : 'text-gray-700'
                  )}
                  style={{
                    transitionDelay: showAnimations ? `${(index + 3) * 100}ms` : '0ms',
                  }}
                >
                  <span className="text-green-400 flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
