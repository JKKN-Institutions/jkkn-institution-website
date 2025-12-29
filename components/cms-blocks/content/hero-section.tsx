'use client'

import { cn } from '@/lib/utils'
import type { HeroSectionProps } from '@/lib/cms/registry-types'
import { useEffect, useState, useRef } from 'react'
import { ChevronDown, ArrowRight, Award, TrendingUp, Users, Calendar } from 'lucide-react'
import Image from 'next/image'
import { useSectionTypography } from '@/lib/cms/hooks/use-section-typography'

/**
 * Converts legacy enum font sizes to pixel values
 * Handles backward compatibility for existing pages
 */
const getFontSize = (value: string | number | undefined): string => {
  // Default fallback
  if (value === undefined || value === null) return '24px'

  // Handle legacy enum values from old pages
  if (typeof value === 'string') {
    const legacyMap: Record<string, string> = {
      'sm': '14px',
      'md': '16px',
      'lg': '18px',
      'xl': '20px',
      '2xl': '24px'
    }
    return legacyMap[value] || '24px'
  }

  // Handle new numeric pixel values
  return `${value}px`
}

// Font size mapping for Tailwind classes - RESPONSIVE (used for title only)
const fontSizeClasses: Record<string, string> = {
  sm: 'text-xs sm:text-sm',
  md: 'text-sm sm:text-base',
  lg: 'text-base sm:text-lg',
  xl: 'text-lg sm:text-xl',
  '2xl': 'text-xl sm:text-2xl lg:text-3xl',
  '3xl': 'text-2xl sm:text-3xl lg:text-4xl',
  '4xl': 'text-2xl sm:text-4xl lg:text-5xl',
  '5xl': 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl',
  '6xl': 'text-3xl sm:text-5xl lg:text-6xl xl:text-7xl',
}

const fontWeightClasses: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

export default function HeroSection({
  title = 'JKKN INSTITUTIONS',
  subtitle,
  // Logo props
  logoImage,
  logoImageAlt = '',
  showAiBadge = true,
  logoPosition = 'top', // 'top', 'between-subtitle-button'
  logoSize = 'md', // 'sm', 'md', 'lg', 'xl'
  // Title styling props
  titleColor = '#ffffff',
  titleFontSize = '6xl',
  titleFontWeight = 'bold',
  titleFontStyle = 'normal',
  // Subtitle styling props
  subtitleColor = '#e5e5e5',
  subtitleFontSize = 24,
  subtitleFontWeight = 'normal',
  subtitleFontStyle = 'normal',
  // Trust Badges props
  showTrustBadges = false,
  trustBadgesStyle = 'glass', // 'glass', 'solid', 'outline'
  trustBadgesPosition = 'below-subtitle', // 'below-subtitle', 'below-title', 'below-logo'
  // Editable Trust Badge texts
  trustBadge1Text = 'NAAC Accredited',
  trustBadge2Text = '92%+ Placements',
  trustBadge3Text = '100+ Top Recruiters',
  trustBadge4Text = '73+ Years of Excellence',
  // Background props
  backgroundType = 'image',
  backgroundImage,
  backgroundImageAlt = '',
  backgroundGradient,
  backgroundVideo,
  ctaButtons = [],
  alignment = 'center',
  overlay = true,
  overlayOpacity = 0.5,
  minHeight = '100vh',
  className,
  isEditing,
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Get page-level typography with block overrides
  const { title: titleTypo, subtitle: subtitleTypo } = useSectionTypography({
    titleColor,
    titleFontSize,
    titleFontWeight,
    titleFontStyle,
    subtitleColor,
    subtitleFontSize: typeof subtitleFontSize === 'number' ? undefined : subtitleFontSize,
    subtitleFontWeight,
    subtitleFontStyle,
  })

  // Use CSS custom property for parallax to avoid React re-renders (better INP)
  useEffect(() => {
    setIsLoaded(true)

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect()
            if (rect.bottom > 0) {
              // Use CSS custom property instead of state to avoid re-renders
              heroRef.current.style.setProperty('--scroll-y', `${window.scrollY * 0.3}px`)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const alignmentClasses: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
    justify: 'items-stretch text-justify',
  }

  // Default buttons if none provided
  const defaultButtons = [
    { label: 'Online Admissions 2025-2026', link: '/admissions', variant: 'primary' as const },
    { label: 'Academic Calendar', link: '/academic-calendar', variant: 'secondary' as const },
  ]

  const buttons = ctaButtons.length > 0 ? ctaButtons : defaultButtons

  // Trust badges data - using editable props
  const trustBadges = [
    { icon: Award, text: trustBadge1Text },
    { icon: TrendingUp, text: trustBadge2Text },
    { icon: Users, text: trustBadge3Text },
    { icon: Calendar, text: trustBadge4Text }
  ].filter(badge => badge.text) // Only show badges with text

  // Logo size classes
  const logoSizeClasses = {
    sm: 'h-16 sm:h-20',
    md: 'h-20 sm:h-24 md:h-28',
    lg: 'h-24 sm:h-28 md:h-32',
    xl: 'h-28 sm:h-32 md:h-40',
  }

  return (
    <section
      ref={heroRef}
      className={cn(
        'relative flex flex-col justify-center overflow-hidden',
        alignmentClasses[alignment],
        className
      )}
      style={{ minHeight }}
    >
      {/* Parallax Background - Uses Next.js Image for LCP optimization */}
      {backgroundType === 'image' && backgroundImage && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: 'translateY(var(--scroll-y, 0px)) scale(1.1)',
          }}
        >
          <Image
            src={backgroundImage}
            alt={backgroundImageAlt || 'Hero background'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
        </div>
      )}

      {/* Gradient Background */}
      {backgroundType === 'gradient' && backgroundGradient && (
        <div
          className="absolute inset-0"
          style={{
            background: backgroundGradient,
            transform: 'translateY(var(--scroll-y, 0px)) scale(1.1)',
          }}
        />
      )}

      {/* Video Background */}
      {backgroundType === 'video' && backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.1)' }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Gradient Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(11, 109, 65, ${overlayOpacity}) 0%, rgba(0, 0, 0, ${overlayOpacity * 0.8}) 50%, rgba(6, 77, 46, ${overlayOpacity}) 100%)`,
          }}
        />
      )}


      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 flex flex-col items-center">
        {/* Logo Badge - Custom logo or default AI badge at TOP position */}
        {logoPosition === 'top' && (logoImage || (showAiBadge && !showTrustBadges)) && (
          <div
            className={cn(
              "mb-6 transition-all duration-1000",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            {logoImage ? (
              /* Custom uploaded logo */
              <div className="inline-block bg-white rounded-xl p-3 sm:p-4 shadow-2xl">
                <Image
                  src={logoImage}
                  alt={logoImageAlt || 'Logo'}
                  width={160}
                  height={160}
                  className={cn("w-auto object-contain", logoSizeClasses[logoSize as keyof typeof logoSizeClasses] || logoSizeClasses.md)}
                />
              </div>
            ) : (
              /* Default AI Empowered College badge */
              <div className="inline-flex flex-col items-center bg-white rounded-xl p-3 sm:p-4 shadow-2xl">
                {/* India's First Text */}
                <span className="text-[10px] sm:text-xs font-bold text-primary tracking-wider uppercase">
                  India&apos;s First
                </span>

                {/* Ai Logo */}
                <div className="bg-primary rounded-lg px-4 sm:px-6 py-2 sm:py-3 my-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary">Ai</span>
                </div>

                {/* Empowered College Text */}
                <span className="text-[10px] sm:text-xs font-bold text-primary tracking-wider uppercase">
                  Empowered College
                </span>
              </div>
            )}
          </div>
        )}

        {/* Animated Title */}
        <h1
          className={cn(
            'tracking-wide transition-all duration-1000 delay-200',
            titleTypo.className,
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            ...titleTypo.style,
            color: titleTypo.style.color || titleColor || '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {title}
        </h1>

        {/* Animated Subtitle */}
        {subtitle && (
          <p
            className={cn(
              'mt-4 max-w-2xl transition-all duration-1000 delay-300',
              alignment === 'center' && 'mx-auto',
              subtitleTypo.className,
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{
              ...subtitleTypo.style,
              color: subtitleTypo.style.color || subtitleColor || '#e5e5e5',
              // Support legacy numeric pixel values for subtitleFontSize
              ...(typeof subtitleFontSize === 'number' ? { fontSize: `${subtitleFontSize}px` } : {})
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Logo Badge - Between subtitle and button position */}
        {logoPosition === 'between-subtitle-button' && logoImage && (
          <div
            className={cn(
              "mt-6 mb-2 transition-all duration-1000 delay-350",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="inline-block bg-white rounded-xl p-3 sm:p-4 shadow-2xl">
              <Image
                src={logoImage}
                alt={logoImageAlt || 'Logo'}
                width={160}
                height={160}
                className={cn("w-auto object-contain", logoSizeClasses[logoSize as keyof typeof logoSizeClasses] || logoSizeClasses.md)}
              />
            </div>
          </div>
        )}

        {/* Trust Badges - Below Logo Position */}
        {showTrustBadges && trustBadgesPosition === 'below-logo' && logoPosition === 'between-subtitle-button' && (
          <div
            className={cn(
              'mt-4 flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-4xl transition-all duration-1000 delay-400',
              alignment === 'center' && 'mx-auto',
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon
              if (trustBadgesStyle === 'glass') {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/95"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                )
              }
              if (trustBadgesStyle === 'solid') {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-secondary text-gray-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-yellow-400"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                )
              }
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-transparent border-2 border-white/90 text-white shadow-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                    {badge.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Trust Badges - Configurable Position */}
        {showTrustBadges && trustBadgesPosition === 'below-subtitle' && subtitle && (
          <div
            className={cn(
              'mt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-4xl transition-all duration-1000 delay-400',
              alignment === 'center' && 'mx-auto',
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon

              // Glass style (default)
              if (trustBadgesStyle === 'glass') {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/95"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                )
              }

              // Solid style
              if (trustBadgesStyle === 'solid') {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-secondary text-gray-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-yellow-400"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                )
              }

              // Outline style
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-transparent border-2 border-white/90 text-white shadow-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                    {badge.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Trust Badges - Below Title */}
        {showTrustBadges && trustBadgesPosition === 'below-title' && (
          <div
            className={cn(
              'mt-4 mb-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-4xl transition-all duration-1000 delay-300',
              alignment === 'center' && 'mx-auto',
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon

              if (trustBadgesStyle === 'glass') {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/95"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                )
              }

              if (trustBadgesStyle === 'solid') {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-secondary text-gray-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-yellow-400"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                      {badge.text}
                    </span>
                  </div>
                )
              }

              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-transparent border-2 border-white/90 text-white shadow-lg transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                    {badge.text}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Buttons - Updated Styling */}
        <div
          className={cn(
            "mt-8 flex flex-col sm:flex-row flex-wrap gap-4 transition-all duration-1000 delay-500",
            alignment === 'center' && 'justify-center',
            alignment === 'left' && 'justify-start',
            alignment === 'right' && 'justify-end',
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          {buttons.map((btn, index) => {
            const isAnchorLink = btn.link?.startsWith('#')
            return (
              <a
                key={index}
                href={btn.link}
                target={'openInNewTab' in btn && btn.openInNewTab ? '_blank' : undefined}
                rel={'openInNewTab' in btn && btn.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={isAnchorLink ? (e) => {
                  e.preventDefault()
                  const targetId = btn.link?.slice(1)
                  const targetElement = document.getElementById(targetId || '')
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                } : undefined}
                className={cn(
                  'group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg font-bold transition-all duration-300',
                  btn.variant === 'primary' && 'bg-secondary text-gray-900 hover:bg-yellow-400 hover:shadow-2xl hover:scale-105 min-w-0 sm:min-w-[280px]',
                  btn.variant === 'secondary' && 'bg-primary text-white border-2 border-white/20 hover:bg-primary/90 hover:shadow-2xl hover:scale-105 min-w-0 sm:min-w-[200px]',
                  btn.variant === 'outline' && 'border-2 border-white text-white hover:bg-white hover:text-primary hover:scale-105'
                )}
              >
                {btn.label}
                {btn.variant === 'outline' && (
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </a>
            )
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* Editor Placeholder */}
      {isEditing && !backgroundImage && !backgroundVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 border-2 border-dashed border-muted-foreground/25">
          <p className="text-muted-foreground">Click to configure hero section</p>
        </div>
      )}

    </section>
  )
}
