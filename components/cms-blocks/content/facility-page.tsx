'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'

// Custom hook for intersection observer animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Schema for the FacilityPage component
export const FacilityPageSchema = z.object({
  facilityTitle: z.string().default('TRANSPORT'),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })).default([]),
  introduction: z.string().default(''),
  features: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).default([]),
  conclusion: z.string().optional(),
  backgroundColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  textColor: z.string().default('#ffffff')
})

export type FacilityPageProps = z.infer<typeof FacilityPageSchema>

// Feature Card Component
function FeatureCard({
  title,
  description,
  index,
  accentColor
}: {
  title: string
  description: string
  index: number
  accentColor: string
}) {
  const { ref, isInView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className={`
        bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8
        border border-white/20
        transition-all duration-700 ease-out
        hover:bg-white/15 hover:shadow-xl hover:scale-[1.02]
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Feature Title */}
      <h3
        className="text-xl md:text-2xl font-bold mb-4"
        style={{ color: accentColor }}
      >
        {title}
      </h3>

      {/* Feature Description */}
      <p className="text-white/90 text-base md:text-lg leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export function FacilityPage({
  facilityTitle = 'TRANSPORT',
  images = [],
  introduction = '',
  features = [],
  conclusion,
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff'
}: FacilityPageProps) {
  const { ref: titleRef, isInView: titleInView } = useInView(0.1)
  const { ref: imagesRef, isInView: imagesInView } = useInView(0.1)
  const { ref: introRef, isInView: introInView } = useInView(0.1)
  const { ref: conclusionRef, isInView: conclusionInView } = useInView(0.1)

  return (
    <div
      className="relative min-h-screen overflow-hidden w-screen -ml-[calc((100vw-100%)/2)]"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #064d2e 50%, #032818 100%)`,
        color: textColor
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-10 animate-[float_15s_ease-in-out_infinite]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-40 left-10 w-96 h-96 rounded-full opacity-5 animate-[float_20s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full opacity-5 animate-[float_18s_ease-in-out_infinite]"
          style={{ backgroundColor: textColor }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Title Section */}
        <div
          ref={titleRef}
          className={`
            text-center mb-12 md:mb-16
            transition-all duration-1000 ease-out
            ${titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {/* Title Badge */}
          <div
            className="inline-block px-6 py-2 rounded-full text-sm font-semibold tracking-widest mb-6"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            FACILITIES
          </div>

          {/* Main Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ color: accentColor }}
          >
            {facilityTitle}
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 md:w-24" style={{ backgroundColor: accentColor }} />
            <div
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: accentColor }}
            />
            <div className="h-px w-16 md:w-24" style={{ backgroundColor: accentColor }} />
          </div>
        </div>

        {/* Images Gallery */}
        {images.length > 0 && (
          <div
            ref={imagesRef}
            className={`
              grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16
              transition-all duration-1000 ease-out
              ${imagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  borderColor: accentColor,
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt || `${facilityTitle} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Introduction Paragraph */}
        {introduction && (
          <div
            ref={introRef}
            className={`
              max-w-4xl mx-auto mb-12 md:mb-16
              transition-all duration-1000 ease-out
              ${introInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20">
              <p className="text-lg md:text-xl leading-relaxed text-white/95">
                {introduction}
              </p>
            </div>
          </div>
        )}

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* Conclusion Paragraph */}
        {conclusion && (
          <div
            ref={conclusionRef}
            className={`
              max-w-4xl mx-auto
              transition-all duration-1000 ease-out
              ${conclusionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <div
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-10 border-2"
              style={{ borderColor: `${accentColor}40` }}
            >
              <p className="text-lg md:text-xl leading-relaxed text-white/95 font-medium">
                {conclusion}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Float Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}

export default FacilityPage
