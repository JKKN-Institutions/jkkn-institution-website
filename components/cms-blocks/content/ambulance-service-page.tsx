'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { EmergencyContactCard } from '@/components/cms-blocks/shared/emergency-contact-card'

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

// Schema for the AmbulanceServicePage component
export const AmbulanceServicePageSchema = z.object({
  facilityTitle: z.string().default('AMBULANCE SERVICES'),
  contact: z.object({
    name: z.string(),
    designation: z.string().optional(),
    mobile: z.string(),
    alternateContact: z.string().optional(),
    email: z.string().optional(),
  }),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })).default([]),
  introduction: z.string().default(''),
  features: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).default([]),
  emergencyNote: z.string().optional(),
  conclusion: z.string().optional(),
  backgroundColor: z.string().default('#0a0a0a'),
  accentColor: z.string().default('#10b981'),
  textColor: z.string().default('#ffffff')
})

export type AmbulanceServicePageProps = z.infer<typeof AmbulanceServicePageSchema>

// Feature Card Component
function FeatureCard({
  title,
  description,
  index,
  accentColor,
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
        bg-gray-900 backdrop-blur-sm rounded-2xl p-6 md:p-8
        border border-gray-700
        transition-all duration-700 ease-out
        hover:shadow-xl hover:scale-[1.02]
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
      <div
        className="text-base md:text-lg leading-relaxed prose max-w-none text-gray-300"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  )
}

export function AmbulanceServicePage({
  facilityTitle = 'AMBULANCE SERVICES',
  contact,
  images = [],
  introduction = '',
  features = [],
  emergencyNote,
  conclusion,
  backgroundColor = '#0a0a0a',
  accentColor = '#10b981',
  textColor = '#ffffff',
}: AmbulanceServicePageProps) {
  const { ref: titleRef, isInView: titleInView } = useInView(0.1)
  const { ref: imagesRef, isInView: imagesInView } = useInView(0.1)
  const { ref: contactRef, isInView: contactInView } = useInView(0.1)
  const { ref: introRef, isInView: introInView } = useInView(0.1)
  const { ref: emergencyRef, isInView: emergencyInView } = useInView(0.1)
  const { ref: conclusionRef, isInView: conclusionInView } = useInView(0.1)

  return (
    <div
      className="relative min-h-screen overflow-hidden w-screen -ml-[calc((100vw-100%)/2)]"
      style={{
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
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
            EMERGENCY SERVICES
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

        {/* Ambulance Image - Centered */}
        {images.filter(img => img.src).length > 0 && (
          <div
            ref={imagesRef}
            className={`
              flex justify-center mb-12 md:mb-16
              transition-all duration-1000 ease-out
              ${imagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <div
              className="relative aspect-[4/3] w-full max-w-3xl rounded-2xl overflow-hidden border-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                borderColor: accentColor,
              }}
            >
              <Image
                src={images[0].src}
                alt={images[0].alt || `${facilityTitle} image`}
                fill
                className="object-cover"
              />
            </div>
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
            <div className="bg-gray-900 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-gray-700">
              <div
                className="text-lg md:text-xl leading-relaxed prose max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: introduction }}
              />
            </div>
          </div>
        )}

        {/* Emergency Contact Card */}
        <div
          ref={contactRef}
          className={`
            mb-12 md:mb-16
            transition-all duration-1000 ease-out
            ${contactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <EmergencyContactCard
            title="AMBULANCE CONTACT"
            name={contact.name}
            designation={contact.designation}
            mobile={contact.mobile}
            alternateContact={contact.alternateContact}
            email={contact.email}
            accentColor={accentColor}
          />
        </div>

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

        {/* Emergency Note */}
        {emergencyNote && (
          <div
            ref={emergencyRef}
            className={`
              max-w-4xl mx-auto mb-12 md:mb-16
              transition-all duration-1000 ease-out
              ${emergencyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <div
              className="bg-red-950 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-red-600"
            >
              <div
                className="text-base md:text-lg leading-relaxed font-medium text-red-200"
                dangerouslySetInnerHTML={{ __html: emergencyNote }}
              />
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
              className="bg-gray-900 backdrop-blur-sm rounded-3xl p-6 md:p-10 border-2"
              style={{ borderColor: `${accentColor}40` }}
            >
              <div
                className="text-lg md:text-xl leading-relaxed font-medium prose max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: conclusion }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AmbulanceServicePage
