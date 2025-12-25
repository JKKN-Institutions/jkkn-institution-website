'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Award, Trophy, Users, Building2, GraduationCap, Wallet } from 'lucide-react'
import Image from 'next/image'

/**
 * WhyChooseJKKN CMS Block Component
 *
 * Professional glassmorphism USP section with brand colors and modern animations.
 * Features: Title-first layout, staggered animations, gradient backgrounds, hover effects.
 */

// Icon mapping for professional look
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  '🏛️': Award,
  '💼': Trophy,
  '🏆': Trophy,
  '👨‍🏫': Users,
  '🏫': Building2,
  '💰': Wallet,
}

// Type definitions
export interface USPCard {
  icon: string
  title: string
  description: string
  order: number
}

export interface WhyChooseJKKNProps {
  sectionTitle?: string
  sectionSubtitle?: string
  sectionTagline?: string
  uspCards?: USPCard[]
  additionalUsps?: string[]
  layout?: 'grid' | 'slider'
  cardsPerRow?: 2 | 3 | 4
  showAdditionalList?: boolean
  glassmorphismVariant?: 'light' | 'dark' | 'dark-elegant' | 'gradient' | 'brand'
  animationPreset?: 'fade-in-up' | 'zoom-in' | 'slide-up' | 'stagger' | 'none'
  isEditing?: boolean
}

// Floating particles component for background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-secondary/30"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

// Professional Glass Card Component
function ProfessionalGlassCard({
  children,
  className,
  index = 0,
  isVisible = true,
  animationPreset = 'stagger',
}: {
  children: React.ReactNode
  className?: string
  index?: number
  isVisible?: boolean
  animationPreset?: string
}) {
  const delay = animationPreset === 'stagger' ? index * 120 : 0

  return (
    <div
      className={cn(
        // Base glassmorphism styles
        'relative group rounded-2xl overflow-hidden',
        'bg-white/10 dark:bg-white/5',
        'backdrop-blur-xl',
        'border border-white/20 dark:border-white/10',
        'shadow-[0_8px_32px_rgba(11,109,65,0.15)]',
        // Animation states
        'transition-all duration-700 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95',
        // Hover effects
        'hover:shadow-[0_20px_60px_rgba(11,109,65,0.25)]',
        'hover:border-primary/40',
        'hover:-translate-y-2',
        'hover:bg-white/15 dark:hover:bg-white/10',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  )
}

// USP Card Component with professional design
function USPCardComponent({
  card,
  index,
  isVisible,
  animationPreset,
}: {
  card: USPCard
  index: number
  isVisible: boolean
  animationPreset: string
}) {
  const isImageUrl = card.icon.startsWith('http') || card.icon.startsWith('/')
  const IconComponent = iconMap[card.icon] || GraduationCap

  return (
    <ProfessionalGlassCard
      index={index}
      isVisible={isVisible}
      animationPreset={animationPreset}
      className="p-6 md:p-8 h-full"
    >
      {/* Icon with gradient background */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Icon container */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            {isImageUrl ? (
              <Image
                src={card.icon}
                alt={card.title}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" />
            )}
          </div>

          {/* Floating ring */}
          <div className="absolute -inset-2 rounded-3xl border-2 border-primary/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
        {card.title}
      </h3>

      {/* Subtitle/Description */}
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center">
        {card.description}
      </p>

      {/* Card number badge */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
        <span className="text-xs font-bold text-secondary">{String(card.order).padStart(2, '0')}</span>
      </div>
    </ProfessionalGlassCard>
  )
}

export default function WhyChooseJKKN({
  sectionTitle = 'Why Choose JKKN?',
  sectionSubtitle,
  sectionTagline,
  uspCards = [],
  additionalUsps = [],
  layout = 'grid',
  cardsPerRow = 3,
  showAdditionalList = true,
  glassmorphismVariant = 'brand',
  animationPreset = 'stagger',
  isEditing = false,
}: WhyChooseJKKNProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(animationPreset === 'none' || isEditing)
  const [headerVisible, setHeaderVisible] = useState(animationPreset === 'none' || isEditing)
  const sectionRef = useRef<HTMLElement>(null)

  const sortedCards = [...uspCards].sort((a, b) => a.order - b.order)

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (animationPreset === 'none' || isEditing) {
      setIsVisible(true)
      setHeaderVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
          // Delay cards animation slightly after header
          setTimeout(() => setIsVisible(true), 300)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [animationPreset, isEditing])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sortedCards.length)
  }, [sortedCards.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sortedCards.length) % sortedCards.length)
  }, [sortedCards.length])

  // Auto-advance slider
  useEffect(() => {
    if (layout !== 'slider' || sortedCards.length <= 1) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [layout, sortedCards.length, nextSlide])

  const gridColClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  // Empty state
  if (sortedCards.length === 0 && isEditing) {
    return (
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto p-12 border-2 border-dashed border-primary/30 rounded-2xl bg-white/5 backdrop-blur-sm">
            <Sparkles className="w-16 h-16 text-primary/50 mx-auto mb-6" />
            <p className="text-muted-foreground text-center text-lg">
              Click to add USP cards through the page editor properties panel
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (sortedCards.length === 0 && !isEditing) return null

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-secondary/8" />

        {/* Animated orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(11,109,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(11,109,65,0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <FloatingParticles />

      <div className="container mx-auto max-w-7xl relative">
        {/* Section Header with professional styling */}
        <div
          className={cn(
            'text-center mb-16 transition-all duration-1000',
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          )}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Why Choose Us</span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              {sectionTitle}
            </span>
          </h2>

          {/* Subtitle - larger prominent text */}
          {sectionSubtitle && (
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-6 max-w-4xl mx-auto leading-snug">
              {sectionSubtitle}
            </p>
          )}

          {/* Tagline - smaller muted text */}
          {sectionTagline && (
            <div className="flex items-center justify-center gap-4 text-lg md:text-xl text-muted-foreground">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <p className="max-w-2xl">{sectionTagline}</p>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          )}

          {/* Decorative underline */}
          <div className="mt-8 flex justify-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-12 h-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
            <div className="w-3 h-3 rounded-full bg-secondary" />
          </div>
        </div>

        {/* Cards Section */}
        {layout === 'slider' ? (
          // Slider Layout
          <div className="relative mb-16">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sortedCards.map((card, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4 py-2">
                    <USPCardComponent
                      card={card}
                      index={0}
                      isVisible={true}
                      animationPreset="none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            {sortedCards.length > 1 && (
              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-110"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {sortedCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        currentSlide === index
                          ? 'w-8 bg-gradient-to-r from-primary to-secondary'
                          : 'w-2 bg-primary/30 hover:bg-primary/50'
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-110"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        ) : (
          // Grid Layout
          <div className={cn('grid gap-6 md:gap-8 mb-16', gridColClasses[cardsPerRow])}>
            {sortedCards.map((card, index) => (
              <USPCardComponent
                key={index}
                card={card}
                index={index}
                isVisible={isVisible}
                animationPreset={animationPreset}
              />
            ))}
          </div>
        )}

        {/* Additional USPs List with professional styling */}
        {showAdditionalList && additionalUsps.length > 0 && (
          <div
            className={cn(
              'max-w-5xl mx-auto transition-all duration-700',
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: `${(sortedCards.length + 1) * 120}ms` }}
          >
            <ProfessionalGlassCard className="p-8 md:p-10" index={sortedCards.length} isVisible={isVisible} animationPreset={animationPreset}>
              {/* Section title */}
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="text-foreground">Additional </span>
                  <span className="text-primary">Benefits</span>
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
              </div>

              {/* Benefits grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {additionalUsps.map((usp, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-xl',
                      'bg-white/5 hover:bg-white/10',
                      'border border-transparent hover:border-primary/20',
                      'transition-all duration-300',
                      'group cursor-default'
                    )}
                  >
                    {/* Check icon with gradient */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                      {usp}
                    </span>
                  </div>
                ))}
              </div>
            </ProfessionalGlassCard>
          </div>
        )}

        {/* Bottom decorative element */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <Sparkles className="w-5 h-5 text-primary/50" />
            <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
