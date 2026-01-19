'use client'

import { cn } from '@/lib/utils'
import type { HeroSectionProps } from '@/lib/cms/registry-types'
import { useEffect, useState, useRef, useMemo } from 'react'
import { ChevronDown, ArrowRight, Award, TrendingUp, Users, Calendar } from 'lucide-react'
import Image from 'next/image'

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

/**
 * Splits title into two lines at specified word position
 * @param title - Full title text
 * @param breakPosition - Word index to break after (0-based)
 * @param isMobile - Skip breaks on mobile
 */
const splitTitleAtPosition = (
  title: string,
  breakPosition?: number,
  isMobile?: boolean
): string[] => {
  if (breakPosition === undefined || breakPosition < 0 || isMobile) {
    return [title]
  }

  const words = title.split(' ')
  if (breakPosition >= words.length - 1) {
    return [title]
  }

  const line1 = words.slice(0, breakPosition + 1).join(' ')
  const line2 = words.slice(breakPosition + 1).join(' ')

  return [line1, line2]
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
  // Title styling props
  titleColor = '#ffffff',
  titleFontSize = '6xl',
  titleFontWeight = 'bold',
  titleFontStyle = 'normal',
  titleLineHeight = 1.2,
  titleLetterSpacing = 0,
  titleTextAlign = 'center',
  titleManualBreakPosition,
  // Subtitle styling props
  subtitleColor = '#e5e5e5',
  subtitleFontSize = 24,
  subtitleFontWeight = 'normal',
  subtitleFontStyle = 'normal',
  subtitleLineHeight = 1.5,
  subtitleLetterSpacing = 0,
  subtitleTextAlign = 'center',
  // Trust Badges props
  showTrustBadges = false,
  trustBadgesStyle = 'glass', // 'glass', 'solid', 'outline'
  trustBadgesPosition = 'below-subtitle', // 'below-subtitle', 'below-title'
  // Background props
  backgroundType = 'image',
  backgroundImage,
  backgroundImageAlt = '',
  backgroundGradient,
  backgroundVideo,
  videoPosterImage,
  ctaButtons = [],
  alignment = 'center',
  overlay = true,
  overlayOpacity = 0.5,
  minHeight = '100vh',
  className,
  isEditing,
}: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Mobile detection for responsive line breaks
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setIsLoaded(true)

    // Throttle scroll handler with RAF for better INP
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect()
            if (rect.bottom > 0) {
              setScrollY(window.scrollY * 0.3)
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

  // Trust badges data
  const trustBadges = [
    { icon: Award, text: "NAAC Accredited" },
    { icon: TrendingUp, text: "95%+ Placements" },
    { icon: Users, text: "100+ Top Recruiters" },
    { icon: Calendar, text: "39 Years of Excellence" }
  ]

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
      {/* Parallax Background */}
      <div
        className="absolute inset-0 transition-transform duration-100"
        style={{
          backgroundImage:
            backgroundType === 'image' && backgroundImage
              ? `url(${backgroundImage})`
              : backgroundType === 'gradient'
                ? backgroundGradient
                : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY}px) scale(1.1)`,
        }}
      />

      {/* Video Background - Optimized for LCP */}
      {backgroundType === 'video' && backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={videoPosterImage}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.1)' }}
          onLoadStart={(e) => {
            // Start loading video after user sees the page
            e.currentTarget.setAttribute('preload', 'auto')
          }}
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
        {/* Logo Badge - Custom logo or default AI badge (hidden when trust badges are shown) */}
        {(logoImage || (showAiBadge && !showTrustBadges)) && (
          <div
            className={cn(
              "mb-6 transition-opacity duration-1000 will-change-opacity",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          >
            {logoImage ? (
              /* Custom uploaded logo */
              <div className="inline-block bg-white rounded-xl p-3 sm:p-4 shadow-2xl">
                <Image
                  src={logoImage}
                  alt={logoImageAlt || 'Logo'}
                  width={120}
                  height={120}
                  className="w-auto h-20 sm:h-24 md:h-28 object-contain"
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

        {/* Animated Title with Manual Line Breaks */}
        <h1
          className={cn(
            'tracking-wide transition-opacity duration-1000 delay-200 will-change-opacity',
            fontSizeClasses[titleFontSize] || 'text-5xl',
            fontWeightClasses[titleFontWeight] || 'font-bold',
            titleFontStyle === 'italic' && 'italic',
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{
            color: titleColor,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            lineHeight: titleLineHeight,
            letterSpacing: `${titleLetterSpacing}px`,
            textAlign: titleTextAlign as any,
          }}
        >
          {useMemo(() => {
            const lines = splitTitleAtPosition(title, titleManualBreakPosition, isMobile)
            if (lines.length === 1) return title
            return (
              <>
                {lines[0]}
                <br />
                {lines[1]}
              </>
            )
          }, [title, titleManualBreakPosition, isMobile])}
        </h1>

        {/* Animated Subtitle */}
        {subtitle && (
          <p
            className={cn(
              'mt-4 max-w-2xl transition-opacity duration-1000 delay-300 will-change-opacity',
              alignment === 'center' && 'mx-auto',
              fontWeightClasses[subtitleFontWeight] || 'font-normal',
              subtitleFontStyle === 'italic' && 'italic',
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{
              color: subtitleColor,
              fontSize: getFontSize(subtitleFontSize),
              lineHeight: subtitleLineHeight,
              letterSpacing: `${subtitleLetterSpacing}px`,
              textAlign: subtitleTextAlign as any,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Trust Badges - Configurable Position */}
        {showTrustBadges && trustBadgesPosition === 'below-subtitle' && subtitle && (
          <div
            className={cn(
              'mt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-4xl transition-opacity duration-1000 delay-400 will-change-opacity',
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
              'mt-4 mb-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-4xl transition-opacity duration-1000 delay-300 will-change-opacity',
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
            "mt-8 flex flex-col sm:flex-row flex-wrap gap-4 transition-opacity duration-1000 delay-500 will-change-opacity",
            alignment === 'center' && 'justify-center',
            alignment === 'left' && 'justify-start',
            alignment === 'right' && 'justify-end',
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        >
          {buttons.map((btn, index) => (
            <a
              key={index}
              href={btn.link}
              target={'openInNewTab' in btn && btn.openInNewTab ? '_blank' : undefined}
              rel={'openInNewTab' in btn && btn.openInNewTab ? 'noopener noreferrer' : undefined}
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
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-1000 delay-700 will-change-opacity",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 motion-safe:animate-bounce" />
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
