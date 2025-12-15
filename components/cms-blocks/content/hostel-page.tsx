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

// Schema for hostel section
const HostelSectionSchema = z.object({
  title: z.string(),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })),
  paragraphs: z.array(z.string()),
  highlights: z.array(z.string())
})

// Schema for the HostelPage component
export const HostelPageSchema = z.object({
  pageTitle: z.string().default('Hostel'),
  boysHostel: HostelSectionSchema,
  girlsHostel: HostelSectionSchema,
  defaultTab: z.enum(['boys', 'girls']).default('boys'),
  backgroundColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  textColor: z.string().default('#ffffff')
})

export type HostelPageProps = z.infer<typeof HostelPageSchema>

// Tab Button Component
function TabButton({
  label,
  isActive,
  onClick,
  accentColor
}: {
  label: string
  isActive: boolean
  onClick: () => void
  accentColor: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-lg font-semibold text-base md:text-lg
        transition-all duration-300 ease-out
        ${isActive
          ? 'text-gray-900 shadow-lg scale-105'
          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
        }
      `}
      style={isActive ? { backgroundColor: accentColor } : {}}
    >
      {label}
    </button>
  )
}

// Hostel Content Section
function HostelContent({
  images,
  paragraphs,
  highlights,
  accentColor,
  isVisible,
  tabKey
}: {
  images: { src: string; alt?: string }[]
  paragraphs: string[]
  highlights: string[]
  accentColor: string
  isVisible: boolean
  tabKey: string
}) {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Reset animation state and trigger after a small delay
      setIsAnimated(false)
      const timer = setTimeout(() => setIsAnimated(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isVisible, tabKey])

  if (!isVisible) return null

  return (
    <div key={tabKey} className="space-y-8 md:space-y-12">
      {/* Images Gallery */}
      {images.filter(img => img.src).length > 0 && (
        <div
          className={`
            grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6
            transition-all duration-1000 ease-out
            ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {images.filter(img => img.src).map((image, index) => (
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
                alt={image.alt || `Hostel image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Paragraphs */}
      <div
        className={`
          space-y-6
          transition-all duration-1000 ease-out delay-200
          ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20"
          >
            <p className="text-base md:text-lg leading-relaxed text-white/95">
              {paragraph}
            </p>
          </div>
        ))}

        {/* Highlights List */}
        {highlights.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-base md:text-lg text-white/95"
                >
                  <span
                    className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export function HostelPage({
  pageTitle = 'Hostel',
  boysHostel,
  girlsHostel,
  defaultTab = 'boys',
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff'
}: HostelPageProps) {
  const [activeTab, setActiveTab] = useState<'boys' | 'girls'>(defaultTab)
  const { ref: titleRef, isInView: titleInView } = useInView(0.1)

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

        {/* Title and Tabs Section */}
        <div
          ref={titleRef}
          className={`
            mb-12 md:mb-16
            transition-all duration-1000 ease-out
            ${titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {/* Title Badge */}
          <div className="text-center mb-6">
            <div
              className="inline-block px-6 py-2 rounded-full text-sm font-semibold tracking-widest mb-6"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              FACILITIES
            </div>
          </div>

          {/* Main Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center"
            style={{ color: accentColor }}
          >
            {pageTitle}
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 md:w-24" style={{ backgroundColor: accentColor }} />
            <div
              className="w-3 h-3 rotate-45"
              style={{ backgroundColor: accentColor }}
            />
            <div className="h-px w-16 md:w-24" style={{ backgroundColor: accentColor }} />
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start max-w-xs">
            <TabButton
              label="Boys Hostel"
              isActive={activeTab === 'boys'}
              onClick={() => setActiveTab('boys')}
              accentColor={accentColor}
            />
            <TabButton
              label="Girls Hostel"
              isActive={activeTab === 'girls'}
              onClick={() => setActiveTab('girls')}
              accentColor={accentColor}
            />
          </div>
        </div>

        {/* Boys Hostel Content */}
        <HostelContent
          images={boysHostel?.images || []}
          paragraphs={boysHostel?.paragraphs || []}
          highlights={boysHostel?.highlights || []}
          accentColor={accentColor}
          isVisible={activeTab === 'boys'}
          tabKey="boys"
        />

        {/* Girls Hostel Content */}
        <HostelContent
          images={girlsHostel?.images || []}
          paragraphs={girlsHostel?.paragraphs || []}
          highlights={girlsHostel?.highlights || []}
          accentColor={accentColor}
          isVisible={activeTab === 'girls'}
          tabKey="girls"
        />
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

export default HostelPage
