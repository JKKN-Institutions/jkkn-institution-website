'use client'

import { cn } from '@/lib/utils'
import type { HeroSectionProps } from '@/lib/cms/registry-types'
import { useEffect, useState, useRef } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'

// Font size mapping for Tailwind classes - RESPONSIVE
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
  showAiBadge = true,
  // Title styling props
  titleColor = '#ffffff',
  titleFontSize = '6xl',
  titleFontWeight = 'bold',
  titleFontStyle = 'normal',
  // Subtitle styling props
  subtitleColor = '#e5e5e5',
  subtitleFontSize = 'xl',
  subtitleFontWeight = 'normal',
  subtitleFontStyle = 'normal',
  // Background props
  backgroundType = 'image',
  backgroundImage,
  backgroundGradient,
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
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.bottom > 0) {
          setScrollY(window.scrollY * 0.3)
        }
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

      {/* Gradient Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(11, 109, 65, ${overlayOpacity}) 0%, rgba(0, 0, 0, ${overlayOpacity * 0.8}) 50%, rgba(6, 77, 46, ${overlayOpacity}) 100%)`,
          }}
        />
      )}

      {/* Animated Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10 animate-[float_8s_ease-in-out_infinite]"
          style={{ backgroundColor: '#ffde59' }}
        />
        <div
          className="absolute bottom-40 right-20 w-96 h-96 rounded-full opacity-5 animate-[float_12s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: '#ffde59' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-5 animate-[float_10s_ease-in-out_infinite]"
          style={{ backgroundColor: '#ffffff' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 flex flex-col items-center">
        {/* Logo Badge - Custom logo or default AI badge */}
        {(logoImage || showAiBadge) && (
          <div
            className={cn(
              "mb-6 transition-all duration-1000",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
            )}
          >
            {logoImage ? (
              /* Custom uploaded logo */
              <div className="inline-block bg-white rounded-xl p-3 sm:p-4 shadow-2xl">
                <Image
                  src={logoImage}
                  alt="Logo"
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

        {/* Animated Title */}
        <h1
          className={cn(
            'tracking-wide transition-all duration-1000 delay-200',
            fontSizeClasses[titleFontSize] || 'text-5xl',
            fontWeightClasses[titleFontWeight] || 'font-bold',
            titleFontStyle === 'italic' && 'italic',
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{
            color: titleColor,
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
              fontSizeClasses[subtitleFontSize] || 'text-xl',
              fontWeightClasses[subtitleFontWeight] || 'font-normal',
              subtitleFontStyle === 'italic' && 'italic',
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </p>
        )}

        {/* CTA Buttons - Updated Styling */}
        <div
          className={cn(
            "mt-8 flex flex-col sm:flex-row flex-wrap gap-4 transition-all duration-1000 delay-500",
            alignment === 'center' && 'justify-center',
            alignment === 'left' && 'justify-start',
            alignment === 'right' && 'justify-end',
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {buttons.map((btn, index) => (
            <a
              key={index}
              href={btn.link}
              target={'openInNewTab' in btn && btn.openInNewTab ? '_blank' : undefined}
              rel={'openInNewTab' in btn && btn.openInNewTab ? 'noopener noreferrer' : undefined}
              className={cn(
                'group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base sm:text-lg font-bold transition-all duration-300',
                btn.variant === 'primary' && 'bg-secondary text-gray-900 hover:bg-yellow-400 hover:shadow-2xl hover:scale-105 min-w-[280px]',
                btn.variant === 'secondary' && 'bg-primary text-white border-2 border-white/20 hover:bg-primary/90 hover:shadow-2xl hover:scale-105 min-w-[200px]',
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
      {isEditing && !backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 border-2 border-dashed border-muted-foreground/25">
          <p className="text-muted-foreground">Click to configure hero section</p>
        </div>
      )}

      {/* Custom Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
      `}</style>
    </section>
  )
}
