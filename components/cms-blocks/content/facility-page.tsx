'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'
import { Sparkles } from 'lucide-react'

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
  primaryColor,
  accentColor,
  isEditing,
  blockId,
  featureIndex
}: {
  title: string
  description: string
  index: number
  primaryColor: string
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
        group relative bg-white rounded-2xl p-6 md:p-7
        border border-gray-100 shadow-sm
        transition-all duration-500 ease-out
        hover:shadow-lg hover:-translate-y-1
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
      `}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Accent top border */}
      <div
        className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Feature Title */}
      <h3
        className="text-lg md:text-xl font-semibold mb-3 text-gray-900"
      >
        {title}
      </h3>

      {/* Feature Description */}
      {isEditing && blockId ? (
        <RichTextInlineEditor
          blockId={blockId}
          propName={`features.${featureIndex}.description`}
          value={description || '<p></p>'}
          className="text-sm md:text-[15px] leading-relaxed text-gray-600 prose max-w-none"
          placeholder="Click to add feature description..."
        />
      ) : (
        <div
          className="text-sm md:text-[15px] leading-relaxed text-gray-600 prose max-w-none prose-p:text-gray-600"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  )
}

// Simple 3-column image gallery (single row)
function ImageGallery({
  images,
  facilityTitle,
}: {
  images: { src: string; alt?: string }[]
  facilityTitle: string
}) {
  const { ref, isInView } = useInView(0.1)
  const filtered = images.filter(img => img.src)

  if (filtered.length === 0) return null

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {filtered.map((image, idx) => (
        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
          <Image
            src={image.src}
            alt={image.alt || `${facilityTitle} image ${idx + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ))}
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
  textColor = '#ffffff',
  isEditing,
  id
}: FacilityPageProps & { isEditing?: boolean; id?: string }) {
  const { ref: introRef, isInView: introInView } = useInView(0.1)
  const { ref: conclusionRef, isInView: conclusionInView } = useInView(0.1)

  const primaryColor = backgroundColor

  return (
    <div className="relative w-screen -ml-[calc((100vw-100%)/2)]">

      {/* ─── Hero Banner ─────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)',
        }}
      >
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Facilities
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ffde59]">
            {facilityTitle}
          </h1>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
            <div className="w-2 h-2 rotate-45 bg-[#ffde59]" />
            <div className="h-px w-12 md:w-20 bg-[#ffde59]/30" />
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 md:h-12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 48h1440V24C1200 0 960 0 720 24S240 48 0 24v24z"
              fill="#f9fafb"
              fillOpacity="0.5"
            />
            <path d="M0 48h1440V32C1200 8 960 8 720 32S240 56 0 32v16z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* ─── Content Area ────────────────────────────── */}
      <div className="bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">

            {/* ─── Image Gallery (Bento Layout) ────────── */}
            <ImageGallery images={images} facilityTitle={facilityTitle} />

            {/* ─── Introduction ─────────────────────────── */}
            {(introduction || isEditing) && (
              <div
                ref={introRef}
                className={`
                  transition-all duration-700 ease-out
                  ${introInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
              >
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  {isEditing && id ? (
                    <RichTextInlineEditor
                      blockId={id}
                      propName="introduction"
                      value={introduction || '<p></p>'}
                      className="text-[15px] md:text-base leading-[1.8] text-gray-600 prose max-w-none"
                      placeholder="Click to add introduction..."
                    />
                  ) : (
                    <div
                      className="text-[15px] md:text-base leading-[1.8] text-gray-600 prose max-w-none prose-p:text-gray-600"
                      dangerouslySetInnerHTML={{ __html: introduction }}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ─── Features Grid ───────────────────────── */}
            {features.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    Key Features
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {features.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      title={feature.title}
                      description={feature.description}
                      index={index}
                      primaryColor={primaryColor}
                      accentColor={accentColor}
                      isEditing={isEditing}
                      blockId={id}
                      featureIndex={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Conclusion ──────────────────────────── */}
            {(conclusion || isEditing) && (
              <div
                ref={conclusionRef}
                className={`
                  transition-all duration-700 ease-out
                  ${conclusionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
              >
                <div
                  className="rounded-2xl p-6 md:p-8 border shadow-sm"
                  style={{
                    backgroundColor: `${primaryColor}08`,
                    borderColor: `${primaryColor}20`,
                  }}
                >
                  {isEditing && id ? (
                    <RichTextInlineEditor
                      blockId={id}
                      propName="conclusion"
                      value={conclusion || '<p></p>'}
                      className="text-[15px] md:text-base leading-[1.8] text-gray-700 font-medium prose max-w-none"
                      placeholder="Click to add conclusion..."
                    />
                  ) : conclusion ? (
                    <div
                      className="text-[15px] md:text-base leading-[1.8] text-gray-700 font-medium prose max-w-none prose-p:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: conclusion }}
                    />
                  ) : null}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default FacilityPage
