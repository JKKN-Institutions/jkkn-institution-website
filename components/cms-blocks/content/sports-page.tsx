'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { Trophy, Dumbbell, Users, Award, Heart, Target } from 'lucide-react'
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

// Schema for the SportsPage component
export const SportsPageSchema = z.object({
  facilityTitle: z.string().default('SPORTS'),
  subtitle: z.string().default('Fitness & Athletics Excellence'),
  introduction: z.string().default('<p>Welcome to the Sports Club Facility at JKKN Educational Institutions, where fitness and fun come together! Our top-notch facility is designed to cater to all your sporting and fitness needs. Here\'s why our Sports Club Facility stands out from the rest:</p>'),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    icon: z.string().optional()
  })).default([
    { value: '10+', label: 'Sports Disciplines', icon: 'Trophy' },
    { value: '5000+', label: 'Sq.ft Sports Complex', icon: 'Target' },
    { value: '20+', label: 'Expert Coaches', icon: 'Users' }
  ]),
  outdoorGamesTitle: z.string().default('Outdoor Games'),
  outdoorGamesImages: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })).default([
    { src: '/images/facilities/sports-outdoor-1.jpg', alt: 'Outdoor Sports 1' },
    { src: '/images/facilities/sports-outdoor-2.jpg', alt: 'Outdoor Sports 2' },
    { src: '/images/facilities/sports-outdoor-3.jpg', alt: 'Outdoor Sports 3' }
  ]),
  indoorGamesTitle: z.string().default('Indoor Games'),
  indoorGamesImages: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })).default([
    { src: '/images/facilities/sports-indoor-1.jpg', alt: 'Indoor Sports 1' },
    { src: '/images/facilities/sports-indoor-2.jpg', alt: 'Indoor Sports 2' },
    { src: '/images/facilities/sports-indoor-3.jpg', alt: 'Indoor Sports 3' }
  ]),
  featuresTitle: z.string().default('Why Choose Our Sports Facility?'),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional()
  })).default([
    {
      title: 'World-class Facilities',
      description: '<p>State-of-the-art gym, swimming pool, basketball court, tennis court, and football field - all designed to meet international standards.</p>',
      icon: 'Award'
    },
    {
      title: 'Expert Instructors',
      description: '<p>Our certified and experienced trainers are dedicated to helping you achieve your fitness goals with personalized guidance and support.</p>',
      icon: 'Users'
    },
    {
      title: 'Cutting-edge Equipment',
      description: '<p>Access to the latest cardio machines, weight training equipment, and sports gear to enhance your training experience.</p>',
      icon: 'Dumbbell'
    },
    {
      title: 'Free Memberships',
      description: '<p>Complimentary access for all students, staff, and community members - because fitness should be accessible to everyone.</p>',
      icon: 'Heart'
    },
    {
      title: 'Community Spirit',
      description: '<p>Regular events, tournaments, and competitions that foster camaraderie and team spirit among participants.</p>',
      icon: 'Trophy'
    },
    {
      title: 'Holistic Development',
      description: '<p>Focus on physical fitness, mental wellness, and character building through sports and athletic activities.</p>',
      icon: 'Target'
    }
  ]),
  conclusion: z.string().default('<p>So why wait? Join the Sports Club Facility at JKKN Educational Institutions and experience the ultimate fitness and sporting experience. Whether you\'re a beginner or a seasoned pro, we\'ve got something for everyone. Come and join our vibrant community of sports enthusiasts today!</p>'),
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  backgroundColor: z.string().default('#ffffff')
})

export type SportsPageProps = z.infer<typeof SportsPageSchema>

// Icon mapping
const IconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Trophy,
  Dumbbell,
  Users,
  Award,
  Heart,
  Target
}

// Stat Card Component
function StatCard({
  value,
  label,
  icon,
  primaryColor,
  accentColor,
  index
}: {
  value: string
  label: string
  icon?: string
  primaryColor: string
  accentColor: string
  index: number
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = icon ? IconMap[icon] : Trophy

  return (
    <div
      ref={ref}
      className={`
        flex flex-col items-center p-6 bg-white rounded-2xl border-2 shadow-sm
        transition-all duration-700 ease-out hover:shadow-lg hover:-translate-y-1
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{
        borderColor: `${accentColor}`,
        transitionDelay: `${index * 100}ms`
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        {IconComponent && (
          <IconComponent className="w-8 h-8" style={{ color: primaryColor }} />
        )}
      </div>
      <span
        className="text-4xl font-bold mb-2"
        style={{ color: primaryColor }}
      >
        {value}
      </span>
      <span className="text-gray-600 text-center font-medium">{label}</span>
    </div>
  )
}

// Feature Card Component
function FeatureCard({
  title,
  description,
  icon,
  index,
  primaryColor,
  isEditing,
  blockId,
  featureIndex
}: {
  title: string
  description: string
  icon?: string
  index: number
  primaryColor: string
  isEditing?: boolean
  blockId?: string
  featureIndex: number
}) {
  const { ref, isInView } = useInView(0.1)
  const IconComponent = icon ? IconMap[icon] : Trophy

  return (
    <div
      ref={ref}
      className={`
        bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm
        transition-all duration-700 ease-out
        hover:shadow-xl hover:border-gray-200 hover:-translate-y-1
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `${primaryColor}10` }}
      >
        {IconComponent && (
          <IconComponent className="w-7 h-7" style={{ color: primaryColor }} />
        )}
      </div>

      {/* Feature Title */}
      <h3
        className="text-xl font-bold mb-3 text-gray-900"
      >
        {title}
      </h3>

      {/* Feature Description */}
      {isEditing && blockId ? (
        <RichTextInlineEditor
          blockId={blockId}
          propName={`features.${featureIndex}.description`}
          value={description || '<p></p>'}
          className="text-gray-600 leading-relaxed prose max-w-none"
          placeholder="Click to add feature description..."
        />
      ) : (
        <div
          className="text-gray-600 leading-relaxed prose max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  )
}

// Image Gallery Section Component
function ImageGallerySection({
  title,
  images,
  primaryColor,
  accentColor,
  facilityTitle
}: {
  title: string
  images: { src: string; alt?: string }[]
  primaryColor: string
  accentColor: string
  facilityTitle: string
}) {
  const { ref: titleRef, isInView: titleInView } = useInView(0.1)
  const { ref: imagesRef, isInView: imagesInView } = useInView(0.1)

  const filteredImages = images.filter(img => img.src)

  if (filteredImages.length === 0) return null

  return (
    <div className="mb-16">
      {/* Section Title */}
      <div
        ref={titleRef}
        className={`
          flex items-center justify-center gap-4 mb-10
          transition-all duration-1000 ease-out
          ${titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <div className="h-0.5 w-12 md:w-20 rounded-full" style={{ backgroundColor: accentColor }} />
        <Trophy className="w-6 h-6" style={{ color: primaryColor }} aria-hidden="true" />
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ color: primaryColor }}
        >
          {title}
        </h2>
        <Trophy className="w-6 h-6" style={{ color: primaryColor }} aria-hidden="true" />
        <div className="h-0.5 w-12 md:w-20 rounded-full" style={{ backgroundColor: accentColor }} />
      </div>

      {/* Images Grid */}
      <div
        ref={imagesRef}
        className={`
          grid grid-cols-1 md:grid-cols-3 gap-6
          transition-all duration-1000 ease-out
          ${imagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {filteredImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group"
            style={{
              transitionDelay: `${index * 150}ms`
            }}
          >
            <Image
              src={image.src}
              alt={image.alt || `${facilityTitle} - ${title} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(to top, ${primaryColor}80, transparent)` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SportsPage({
  facilityTitle = 'SPORTS',
  subtitle = 'Fitness & Athletics Excellence',
  introduction = '',
  stats = [],
  outdoorGamesTitle = 'Outdoor Games',
  outdoorGamesImages = [],
  indoorGamesTitle = 'Indoor Games',
  indoorGamesImages = [],
  featuresTitle = 'Why Choose Our Sports Facility?',
  features = [],
  conclusion,
  primaryColor = '#0b6d41',
  accentColor = '#ffde59',
  backgroundColor = '#ffffff',
  isEditing,
  id
}: SportsPageProps & { isEditing?: boolean; id?: string }) {
  const { ref: heroRef, isInView: heroInView } = useInView(0.1)
  const { ref: introRef, isInView: introInView } = useInView(0.1)
  const { ref: featuresTitleRef, isInView: featuresTitleInView } = useInView(0.1)
  const { ref: conclusionRef, isInView: conclusionInView } = useInView(0.1)

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Hero Section */}
      <div
        className="relative py-16 md:py-24"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={heroRef}
            className={`
              text-center
              transition-all duration-1000 ease-out
              ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              CAMPUS SPORTS
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {facilityTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {subtitle}
            </p>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-0.5 w-16 md:w-24 rounded-full" style={{ backgroundColor: accentColor }} />
              <div
                className="w-3 h-3 rotate-45"
                style={{ backgroundColor: accentColor }}
              />
              <div className="h-0.5 w-16 md:w-24 rounded-full" style={{ backgroundColor: accentColor }} />
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill={backgroundColor}
            />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      {stats.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                primaryColor={primaryColor}
                accentColor={accentColor}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Introduction Section */}
        {(introduction || isEditing) && (
          <div
            ref={introRef}
            className={`
              max-w-4xl mx-auto mb-16
              transition-all duration-1000 ease-out
              ${introInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-1.5 h-8 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <h2
                className="text-2xl font-bold"
                style={{ color: primaryColor }}
              >
                About Sports
              </h2>
            </div>

            {/* Content */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
              {isEditing && id ? (
                <RichTextInlineEditor
                  blockId={id}
                  propName="introduction"
                  value={introduction || '<p></p>'}
                  className="text-gray-700 text-lg leading-relaxed prose max-w-none"
                  placeholder="Click to add introduction..."
                />
              ) : (
                <div
                  className="text-gray-700 text-lg leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: introduction }}
                />
              )}
            </div>
          </div>
        )}

        {/* Outdoor Games Section */}
        <ImageGallerySection
          title={outdoorGamesTitle}
          images={outdoorGamesImages}
          primaryColor={primaryColor}
          accentColor={accentColor}
          facilityTitle={facilityTitle}
        />

        {/* Indoor Games Section */}
        <ImageGallerySection
          title={indoorGamesTitle}
          images={indoorGamesImages}
          primaryColor={primaryColor}
          accentColor={accentColor}
          facilityTitle={facilityTitle}
        />

        {/* Features Section */}
        {features.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            {/* Features Title */}
            <div
              ref={featuresTitleRef}
              className={`
                text-center mb-12
                transition-all duration-1000 ease-out
                ${featuresTitleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: primaryColor }}
              >
                {featuresTitle}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <div className="h-0.5 w-12 md:w-16 rounded-full" style={{ backgroundColor: accentColor }} />
                <div
                  className="w-2 h-2 rotate-45"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="h-0.5 w-12 md:w-16 rounded-full" style={{ backgroundColor: accentColor }} />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  index={index}
                  primaryColor={primaryColor}
                  isEditing={isEditing}
                  blockId={id}
                  featureIndex={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Conclusion Section */}
        {(conclusion || isEditing) && (
          <div
            ref={conclusionRef}
            className={`
              max-w-4xl mx-auto mb-16
              transition-all duration-1000 ease-out
              ${conclusionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <div
              className="rounded-2xl p-8 md:p-10 text-center"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}08, ${primaryColor}15)`,
                border: `2px solid ${accentColor}`
              }}
            >
              {isEditing && id ? (
                <RichTextInlineEditor
                  blockId={id}
                  propName="conclusion"
                  value={conclusion || '<p></p>'}
                  className="text-gray-700 text-lg leading-relaxed prose max-w-none"
                  placeholder="Click to add conclusion..."
                />
              ) : conclusion ? (
                <div
                  className="text-gray-700 text-lg leading-relaxed prose max-w-none"
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

export default SportsPage
