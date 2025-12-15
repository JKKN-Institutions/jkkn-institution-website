'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    })
  }

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
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Fallback gradient background */
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-emerald-800" />
        )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Green gradient overlay from top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        {/* Logo Badge - India's First AI Empowered College */}
        <div className={cn(
          'mb-6 transition-all duration-1000',
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
          'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-wide transition-all duration-1000 delay-200',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          JKKN INSTITUTIONS
        </h1>

        {/* CTA Buttons */}
        <div className={cn(
          'flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-400',
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

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer animate-bounce"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  )
}
