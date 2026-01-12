'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Award, TrendingUp, Users, Calendar } from 'lucide-react'
import { useParallax } from '@/lib/hooks/use-parallax'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Use requestAnimationFrame to prevent forced reflow on mount
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  // Trust badges removed - now handled in CMS Hero Section
  // const trustBadges = [
  //   { icon: Award, text: "NAAC Accredited" },
  //   { icon: TrendingUp, text: "95%+ Placements" },
  //   { icon: Users, text: "100+ Top Recruiters" },
  //   { icon: Calendar, text: "39 Years of Excellence" }
  // ]


  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Background Image or Fallback Gradient */}
        {!imageError ? (
          <Image
            src="/images/hero-bg.jpg"
            alt="JKKN Students"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Fallback gradient background - Darker, richer gradient */
          <div className="absolute inset-0 bg-gradient-to-br from-[#085032] via-primary to-emerald-900" />
        )}
        {/* Dark overlay for text readability - Increased opacity */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Green gradient overlay from top and bottom - Enhanced */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-transparent to-primary/50" />
        {/* Aurora-like animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-emerald-600/20 animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        {/* Logo Badge - India's First AI Empowered College */}
        <div className={cn(
          'mb-6 transition-all duration-1000 will-change-transform',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        )}>
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
        </div>

        {/* Main Title */}
        <h1 className={cn(
          'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-wide transition-all duration-1000 delay-200 will-change-transform',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          JKKN INSTITUTIONS
        </h1>

        {/* Subtitle */}
        <p className={cn(
          'text-base sm:text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto px-4 transition-all duration-1000 delay-300 will-change-transform',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
        >
          Empowering Future Leaders Through Innovation and Excellence
        </p>

        {/* Trust Badges - Removed (now in CMS Hero Section) */}
        {/* <div className={cn(
          'flex flex-wrap justify-center items-center gap-3 max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-350',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                  {badge.text}
                </span>
              </div>
            )
          })}
        </div> */}

        {/* CTA Buttons */}
        <div className={cn(
          'flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-400 will-change-transform',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          {/* Online Admissions Button - Yellow */}
          <Link
            href="/admissions"
            className={cn(
              'inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300',
              'bg-secondary text-gray-900 shadow-xl',
              'hover:bg-yellow-400 hover:shadow-2xl hover:scale-105',
              'min-w-[280px]'
            )}
          >
            Online Admissions 2025-2026
          </Link>

          {/* Academic Calendar Button - Green */}
          <Link
            href="/academic-calendar"
            className={cn(
              'inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300',
              'bg-primary text-white shadow-xl border-2 border-white/20',
              'hover:bg-primary/90 hover:shadow-2xl hover:scale-105',
              'min-w-[200px]'
            )}
          >
            Academic Calendar
          </Link>
        </div>
      </div>
    </section>
  )
}
