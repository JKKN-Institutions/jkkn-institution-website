'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { UtensilsCrossed, Check } from 'lucide-react'
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

// Schema for the FoodCourtPage component
export const FoodCourtPageSchema = z.object({
  facilityTitle: z.string().default('FOOD COURT'),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })).default([
    { src: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop', alt: 'Food Court Interior 1' },
    { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop', alt: 'Food Court Interior 2' },
    { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop', alt: 'Food Court Interior 3' }
  ]),
  introduction: z.string().default('<p>Our canteen offers more than just a mere food stop, as it serves as a social hub for students to unwind, catch up with peers, and recharge themselves before resuming their studies. With its cozy seating and inviting ambiance, the canteen provides a comfortable space for students to take a breather and replenish their energy.</p><p>Regarding the food options, you won\'t be disappointed with the wide array of choices available at our canteen. From crisp salads and appetizing sandwiches to substantial hot meals and snacks, we offer something to suit every palate. Our menu is thoughtfully crafted to accommodate diverse dietary needs and preferences, ensuring that everyone can find a delicious and fulfilling meal.</p>'),
  features: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).default([
    {
      title: 'Diverse Menu',
      description: '<p>Wide variety of cuisines and food options including South Indian, North Indian, Chinese, and Continental dishes to cater to all taste preferences.</p>'
    },
    {
      title: 'Quality Ingredients',
      description: '<p>Fresh, quality ingredients sourced from trusted suppliers ensure every meal is nutritious, tasty, and prepared with care.</p>'
    },
    {
      title: 'Healthy Options',
      description: '<p>Nutritious choices for health-conscious students including salads, fresh juices, and balanced meal options with proper nutritional value.</p>'
    },
    {
      title: 'Affordable Prices',
      description: '<p>Student-friendly pricing ensures that quality food is accessible to all, with special meal combos and discounts available.</p>'
    }
  ]),
  highlightsTitle: z.string().default('Key Highlights'),
  highlights: z.array(z.object({
    item: z.string()
  })).default([
    { item: 'Diverse menu' },
    { item: 'Quality ingredients' },
    { item: 'Healthy options' },
    { item: 'Affordable prices' },
    { item: 'Hygiene and safety' }
  ]),
  conclusion: z.string().default('<p>Our food court is designed to be more than just a dining facility - it\'s a space where students can enjoy delicious, nutritious meals in a comfortable and hygienic environment. With strict quality standards and a focus on student satisfaction, we ensure that every dining experience is pleasant and fulfilling.</p>'),
  backgroundColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  textColor: z.string().default('#ffffff')
})

export type FoodCourtPageProps = z.infer<typeof FoodCourtPageSchema>

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

// Highlight Item Component
function HighlightItem({
  item,
  index,
  accentColor
}: {
  item: string
  index: number
  accentColor: string
}) {
  const { ref, isInView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className={`
        flex items-center gap-3 p-3 md:p-4
        bg-white/10 backdrop-blur-sm rounded-xl
        border border-white/20
        transition-all duration-700 ease-out
        hover:bg-white/15 hover:shadow-lg
        ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${accentColor}30` }}
      >
        <Check
          className="w-5 h-5"
          style={{ color: accentColor }}
          aria-label="Check icon"
        />
      </div>
      <p className="text-base md:text-lg font-medium text-white">
        {item}
      </p>
    </div>
  )
}

export function FoodCourtPage({
  facilityTitle = 'FOOD COURT',
  images = [],
  introduction = '',
  features = [],
  highlightsTitle = 'Key Highlights',
  highlights = [],
  conclusion,
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff',
  isEditing,
  id
}: FoodCourtPageProps & { isEditing?: boolean; id?: string }) {
  const { ref: titleRef, isInView: titleInView } = useInView(0.1)
  const { ref: imagesRef, isInView: imagesInView } = useInView(0.1)
  const { ref: introRef, isInView: introInView } = useInView(0.1)
  const { ref: highlightsTitleRef, isInView: highlightsTitleInView } = useInView(0.1)
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

        {/* Highlights Section */}
        {highlights.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12 md:mb-16">
            {/* Highlights Title */}
            <div
              ref={highlightsTitleRef}
              className={`
                text-center mb-8 md:mb-10
                transition-all duration-1000 ease-out
                ${highlightsTitleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: accentColor }}
              >
                {highlightsTitle}
              </h2>

              {/* Decorative Line */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 md:w-16" style={{ backgroundColor: accentColor }} />
                <UtensilsCrossed className="w-5 h-5" style={{ color: accentColor }} />
                <div className="h-px w-12 md:w-16" style={{ backgroundColor: accentColor }} />
              </div>
            </div>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <HighlightItem
                  key={index}
                  item={highlight.item}
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

export default FoodCourtPage
