'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { Bus } from 'lucide-react'
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'

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

// Schema for the TransportPage component
export const TransportPageSchema = z.object({
  facilityTitle: z.string().default('TRANSPORT'),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })).default([
    { src: '/images/facilities/transport-1.jpg', alt: 'Transport Facility 1' },
    { src: '/images/facilities/transport-2.jpg', alt: 'Transport Facility 2' },
    { src: '/images/facilities/transport-3.jpg', alt: 'Transport Facility 3' }
  ]),
  introduction: z.string().default('<p>At JKKN, we prioritize the safety and convenience of our students by providing a comprehensive transportation network. Our fleet of well-maintained buses ensures reliable and comfortable travel for students commuting from various locations.</p>'),
  features: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).default([
    {
      title: 'Well-Maintained Fleet',
      description: '<p>Our modern fleet of buses undergoes regular maintenance and safety checks to ensure a smooth and secure journey for all students.</p>'
    },
    {
      title: 'Trained Drivers',
      description: '<p>Experienced and licensed drivers who are trained in defensive driving and student safety protocols operate all our buses.</p>'
    },
    {
      title: 'Extensive Coverage',
      description: '<p>We cover 19+ routes across Tamil Nadu, connecting students from various towns and cities to our campus.</p>'
    },
    {
      title: 'GPS Tracking',
      description: '<p>All buses are equipped with GPS tracking systems for real-time monitoring and enhanced safety measures.</p>'
    }
  ]),
  routesTitle: z.string().default('Bus Routes Available'),
  routes: z.array(z.object({
    name: z.string()
  })).default([
    { name: 'Athani' },
    { name: 'Guruvarettyur' },
    { name: 'Poolampatti' },
    { name: 'Edappadi' },
    { name: 'Anthiyur' },
    { name: 'Konganapuram' },
    { name: 'Kolathur' },
    { name: 'Salem' },
    { name: 'Gobichettipalayam' },
    { name: 'Ganapathipalayam' },
    { name: 'Omalur' },
    { name: 'Chennampatti' },
    { name: 'Chithur' },
    { name: 'Nangavalli' },
    { name: 'Thirupur' },
    { name: 'Tiruchengode' },
    { name: 'Paalmadai' },
    { name: 'Erode' },
    { name: 'Elampillai' }
  ]),
  conclusion: z.string().default('<p>Our transportation service is designed to provide safe, affordable, and convenient travel for all students. With extensive route coverage and modern facilities, we ensure that every student can reach campus comfortably and on time.</p>'),
  backgroundColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  textColor: z.string().default('#ffffff')
})

export type TransportPageProps = z.infer<typeof TransportPageSchema>

// Feature Card Component
function FeatureCard({
  title,
  description,
  index,
  accentColor,
  isEditing,
  blockId,
  featureIndex
}: {
  title: string
  description: string
  index: number
  accentColor: string
  isEditing?: boolean
  blockId?: string
  featureIndex: number
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
      {isEditing && blockId ? (
        <RichTextInlineEditor
          blockId={blockId}
          propName={`features.${featureIndex}.description`}
          value={description || '<p></p>'}
          className="text-base md:text-lg leading-relaxed prose prose-invert max-w-none"
          placeholder="Click to add feature description..."
        />
      ) : (
        <div
          className="text-base md:text-lg leading-relaxed prose max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  )
}

// Route Card Component
function RouteCard({
  name,
  index,
  accentColor
}: {
  name: string
  index: number
  accentColor: string
}) {
  const { ref, isInView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className={`
        bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6
        border border-white/20
        flex flex-col items-center justify-center
        transition-all duration-700 ease-out
        hover:bg-white/15 hover:shadow-lg hover:scale-105
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Bus
        className="w-8 h-8 md:w-10 md:h-10 mb-3"
        style={{ color: accentColor }}
        aria-label="Bus icon"
      />
      <p className="text-base md:text-lg font-semibold text-white text-center">
        {name}
      </p>
    </div>
  )
}

export function TransportPage({
  facilityTitle = 'TRANSPORT',
  images = [],
  introduction = '',
  features = [],
  routesTitle = 'Bus Routes Available',
  routes = [],
  conclusion,
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff',
  isEditing,
  id
}: TransportPageProps & { isEditing?: boolean; id?: string }) {
  const { ref: titleRef, isInView: titleInView } = useInView(0.1)
  const { ref: imagesRef, isInView: imagesInView } = useInView(0.1)
  const { ref: introRef, isInView: introInView } = useInView(0.1)
  const { ref: routesTitleRef, isInView: routesTitleInView } = useInView(0.1)
  const { ref: conclusionRef, isInView: conclusionInView } = useInView(0.1)

  return (
    <div
      className="relative min-h-screen overflow-hidden w-screen -ml-[calc((100vw-100%)/2)]"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #064d2e 50%, #032818 100%)`,
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
        {images.filter(img => img.src).length > 0 && (
          <div
            ref={imagesRef}
            className={`
              grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16
              transition-all duration-1000 ease-out
              ${imagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
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
                  alt={image.alt || `${facilityTitle} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Introduction Paragraph */}
        {(introduction || isEditing) && (
          <div
            ref={introRef}
            className={`
              max-w-4xl mx-auto mb-12 md:mb-16
              transition-all duration-1000 ease-out
              ${introInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20">
              {isEditing && id ? (
                <RichTextInlineEditor
                  blockId={id}
                  propName="introduction"
                  value={introduction || '<p></p>'}
                  className="text-lg md:text-xl leading-relaxed prose prose-invert max-w-none"
                  placeholder="Click to add introduction..."
                />
              ) : (
                <div
                  className="text-lg md:text-xl leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: introduction }}
                />
              )}
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
                  isEditing={isEditing}
                  blockId={id}
                  featureIndex={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bus Routes Section */}
        {routes.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12 md:mb-16">
            {/* Routes Title */}
            <div
              ref={routesTitleRef}
              className={`
                text-center mb-8 md:mb-12
                transition-all duration-1000 ease-out
                ${routesTitleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: accentColor }}
              >
                {routesTitle}
              </h2>

              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 md:w-16" style={{ backgroundColor: accentColor }} />
                <Bus className="w-5 h-5" style={{ color: accentColor }} />
                <div className="h-px w-12 md:w-16" style={{ backgroundColor: accentColor }} />
              </div>
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {routes.map((route, index) => (
                <RouteCard
                  key={index}
                  name={route.name}
                  index={index}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* Conclusion Paragraph */}
        {(conclusion || isEditing) && (
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
              {isEditing && id ? (
                <RichTextInlineEditor
                  blockId={id}
                  propName="conclusion"
                  value={conclusion || '<p></p>'}
                  className="text-lg md:text-xl leading-relaxed font-medium prose prose-invert max-w-none"
                  placeholder="Click to add conclusion..."
                />
              ) : conclusion ? (
                <div
                  className="text-lg md:text-xl leading-relaxed font-medium prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: conclusion }}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransportPage
