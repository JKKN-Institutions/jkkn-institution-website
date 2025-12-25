'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/public/glass-card'
import Image from 'next/image'

/**
 * WhyChooseJKKN CMS Block Component
 *
 * Displays institutional unique selling points (USPs) with glassmorphism effects.
 * Supports grid and slider layouts with various styling options.
 */

// Type definitions
export interface USPCard {
  icon: string // Emoji or image URL
  title: string
  description: string
  order: number
}

export interface WhyChooseJKKNProps {
  // Section metadata
  sectionTitle?: string
  sectionTagline?: string

  // USP cards
  uspCards?: USPCard[]

  // Additional USPs (bullet list)
  additionalUsps?: string[]

  // Layout configuration
  layout?: 'grid' | 'slider'
  cardsPerRow?: 2 | 3 | 4

  // Display options
  showAdditionalList?: boolean

  // Styling
  glassmorphismVariant?: 'light' | 'dark' | 'dark-elegant' | 'gradient' | 'brand'
  animationPreset?: 'fade-in-up' | 'zoom-in' | 'slide-up' | 'stagger' | 'none'

  // Editor mode
  isEditing?: boolean
}

export default function WhyChooseJKKN({
  sectionTitle = 'Why Choose JKKN?',
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
  const sectionRef = useRef<HTMLElement>(null)

  // Sort USP cards by order
  const sortedCards = [...uspCards].sort((a, b) => a.order - b.order)

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (animationPreset === 'none' || isEditing) {
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
  }, [animationPreset, isEditing])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sortedCards.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sortedCards.length) % sortedCards.length)
  }

  // Grid column classes
  const gridColClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  // Animation classes
  const getAnimationClass = (index: number) => {
    if (animationPreset === 'none' || !isVisible) return ''

    const baseClass = 'transition-all duration-700'
    const visibleClass = 'opacity-100 translate-y-0 scale-100'
    const hiddenClass = 'opacity-0 translate-y-10 scale-95'

    if (animationPreset === 'stagger') {
      return cn(
        baseClass,
        isVisible ? visibleClass : hiddenClass
      )
    }

    if (animationPreset === 'fade-in-up') {
      return cn(
        baseClass,
        isVisible ? visibleClass : 'opacity-0 translate-y-10'
      )
    }

    if (animationPreset === 'zoom-in') {
      return cn(
        baseClass,
        isVisible ? visibleClass : 'opacity-0 scale-75'
      )
    }

    if (animationPreset === 'slide-up') {
      return cn(
        baseClass,
        isVisible ? visibleClass : 'opacity-0 translate-y-20'
      )
    }

    return baseClass
  }

  // Empty state
  if (sortedCards.length === 0 && isEditing) {
    return (
      <section className="py-16 px-4 relative overflow-hidden bg-gray-900/50">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto p-8 border-2 border-dashed border-gray-600 rounded-lg">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-center">
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
      className="py-16 px-4 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 -z-10" />

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div
          className={cn(
            'text-center mb-12',
            getAnimationClass(0)
          )}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold">{sectionTitle}</h2>
          </div>
          {sectionTagline && (
            <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
              {sectionTagline}
            </p>
          )}
        </div>

        {layout === 'slider' ? (
          // Slider Layout
          <div className="relative mb-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sortedCards.map((card, index) => {
                  const isImageUrl = card.icon.startsWith('http') || card.icon.startsWith('/')

                  return (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <GlassCard
                        variant={glassmorphismVariant}
                        blur="lg"
                        hover={true}
                        className="p-8 text-center max-w-2xl mx-auto"
                      >
                        {/* Icon */}
                        <div className="mb-6 flex justify-center">
                          {isImageUrl ? (
                            <div className="relative w-20 h-20">
                              <Image
                                src={card.icon}
                                alt={card.title}
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="text-6xl">{card.icon}</div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-4">{card.title}</h3>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {card.description}
                        </p>
                      </GlassCard>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Slider Controls */}
            {sortedCards.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {sortedCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        currentSlide === index ? 'bg-primary w-8' : 'bg-primary/30'
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          // Grid Layout
          <div
            className={cn(
              'grid gap-6 mb-12',
              gridColClasses[cardsPerRow]
            )}
          >
            {sortedCards.map((card, index) => {
              const isImageUrl = card.icon.startsWith('http') || card.icon.startsWith('/')

              return (
                <GlassCard
                  key={index}
                  variant={glassmorphismVariant}
                  blur="lg"
                  hover={true}
                  className={cn(
                    'p-6 text-center',
                    getAnimationClass(index + 1)
                  )}
                  style={animationPreset === 'stagger' ? { transitionDelay: `${(index + 1) * 100}ms` } : undefined}
                >
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    {isImageUrl ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={card.icon}
                          alt={card.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-5xl">{card.icon}</div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </GlassCard>
              )
            })}
          </div>
        )}

        {/* Additional USPs List */}
        {showAdditionalList && additionalUsps.length > 0 && (
          <div
            className={cn(
              'max-w-4xl mx-auto',
              getAnimationClass(sortedCards.length + 1)
            )}
            style={animationPreset === 'stagger' ? { transitionDelay: `${(sortedCards.length + 1) * 100}ms` } : undefined}
          >
            <GlassCard
              variant={glassmorphismVariant}
              blur="lg"
              className="p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Additional Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalUsps.map((usp, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{usp}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  )
}
