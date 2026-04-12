'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { z } from 'zod'
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'
import {
  Shield,
  Wifi,
  Utensils,
  BookOpen,
  Droplets,
  HeartPulse,
  Cctv,
  Home,
  Users,
  Sparkles,
} from 'lucide-react'

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

// Map highlight keywords to icons
function getHighlightIcon(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes('security') || lower.includes('cctv') || lower.includes('surveillance'))
    return Cctv
  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet'))
    return Wifi
  if (lower.includes('food') || lower.includes('meal') || lower.includes('menu') || lower.includes('nutritious'))
    return Utensils
  if (lower.includes('study') || lower.includes('academic'))
    return BookOpen
  if (lower.includes('water') || lower.includes('ro '))
    return Droplets
  if (lower.includes('medical') || lower.includes('first-aid') || lower.includes('health'))
    return HeartPulse
  if (lower.includes('room') || lower.includes('furniture') || lower.includes('bathroom'))
    return Home
  if (lower.includes('friend') || lower.includes('community') || lower.includes('social') || lower.includes('common'))
    return Users
  if (lower.includes('shield') || lower.includes('biometric'))
    return Shield
  return Sparkles
}

// Schema for hostel section
const HostelSectionSchema = z.object({
  title: z.string(),
  images: z.array(
    z.object({
      src: z.string(),
      alt: z.string().optional(),
    })
  ),
  paragraphs: z.array(z.string()),
  highlights: z.array(z.string()),
  warden: z
    .object({
      name: z.string(),
      mobile: z.string(),
    })
    .optional(),
})

// Schema for the HostelPage component
export const HostelPageSchema = z.object({
  pageTitle: z.string().default('Hostel'),
  boysHostel: HostelSectionSchema,
  girlsHostel: HostelSectionSchema,
  defaultTab: z.enum(['boys', 'girls']).default('boys'),
  backgroundColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  textColor: z.string().default('#ffffff'),
})

export type HostelPageProps = z.infer<typeof HostelPageSchema>

// ─── Bento Image Gallery ─────────────────────────────────
function BentoGallery({
  images,
  isAnimated,
}: {
  images: { src: string; alt?: string }[]
  isAnimated: boolean
}) {
  const filtered = images.filter((img) => img.src)
  if (filtered.length === 0) return null

  // 3-image bento: 1 large left + 2 stacked right
  if (filtered.length >= 3) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 transition-all duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {/* Large image */}
        <div className="relative aspect-[4/3] md:row-span-2 rounded-2xl overflow-hidden group">
          <Image
            src={filtered[0].src}
            alt={filtered[0].alt || 'Hostel image'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        {/* Two stacked images */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
          {filtered.slice(1, 3).map((image, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
              style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
            >
              <Image
                src={image.src}
                alt={image.alt || `Hostel image ${idx + 2}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Fallback: simple grid for fewer images
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 transition-all duration-700 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {filtered.map((image, idx) => (
        <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
          <Image
            src={image.src}
            alt={image.alt || `Hostel image ${idx + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}

// ─── Feature Card ────────────────────────────────────────
function FeatureCard({
  text,
  index,
  accentColor,
  isAnimated,
}: {
  text: string
  index: number
  accentColor: string
  isAnimated: boolean
}) {
  const Icon = getHighlightIcon(text)

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-0.5 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${accentColor}18` }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: accentColor }} />
      </div>
      <p className="text-sm md:text-[15px] leading-relaxed text-gray-700 pt-1">{text}</p>
    </div>
  )
}

// ─── Hostel Content Section ──────────────────────────────
function HostelContent({
  images,
  paragraphs,
  highlights,
  warden,
  accentColor,
  isVisible,
  tabKey,
  isEditing,
  blockId,
}: {
  images: { src: string; alt?: string }[]
  paragraphs: string[]
  highlights: string[]
  warden?: { name: string; mobile: string }
  accentColor: string
  isVisible: boolean
  tabKey: string
  isEditing?: boolean
  blockId?: string
}) {
  const [isAnimated, setIsAnimated] = useState(false)
  const { ref: sectionRef, isInView } = useInView(0.05)

  // Trigger animation when tab becomes visible
  // Use isInView OR fresh mount (isVisible just became true) to avoid deadlock
  useEffect(() => {
    if (isVisible) {
      setIsAnimated(false)
      const timer = setTimeout(() => setIsAnimated(true), 80)
      return () => clearTimeout(timer)
    }
  }, [isVisible, tabKey])

  // Also trigger when scrolled into view for the first time
  useEffect(() => {
    if (isVisible && isInView && !isAnimated) {
      setIsAnimated(true)
    }
  }, [isInView, isVisible, isAnimated])

  if (!isVisible) return null

  return (
    <div ref={sectionRef} key={tabKey} className="space-y-10 md:space-y-14">
      {/* Bento Image Gallery */}
      <BentoGallery images={images} isAnimated={isAnimated} />

      {/* Description Paragraphs */}
      <div
        className={`space-y-5 transition-all duration-700 delay-200 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm"
          >
            {isEditing && blockId ? (
              <RichTextInlineEditor
                blockId={blockId}
                propName={`${tabKey}Hostel.paragraphs.${index}`}
                value={paragraph || '<p></p>'}
                className="text-[15px] md:text-base leading-relaxed text-gray-600 prose max-w-none"
                placeholder="Click to add paragraph..."
              />
            ) : (
              <div
                className="text-[15px] md:text-base leading-[1.8] text-gray-600 prose max-w-none prose-p:text-gray-600"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Highlights as Feature Cards */}
      {highlights.length > 0 && (
        <div>
          <h3
            className={`text-lg md:text-xl font-semibold mb-5 transition-all duration-700 delay-300 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ color: '#1a1a1a' }}
          >
            Facilities & Amenities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((highlight, index) => (
              <FeatureCard
                key={index}
                text={highlight}
                index={index}
                accentColor={accentColor}
                isAnimated={isAnimated}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hostel Warden Contact */}
      {warden && (
        <div
          className={`bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-700 delay-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Hostel Warden</h3>
          <div className="space-y-1.5 text-[15px] text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Name:</span> {warden.name}
            </p>
            <p>
              <span className="font-medium text-gray-800">Mobile:</span>{' '}
              <a
                href={`tel:${warden.mobile.replace(/\s/g, '')}`}
                className="font-medium hover:underline transition-colors"
                style={{ color: accentColor }}
              >
                {warden.mobile}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main HostelPage Component ───────────────────────────
export function HostelPage({
  pageTitle = 'Hostel',
  boysHostel,
  girlsHostel,
  defaultTab = 'boys',
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  isEditing,
  id,
}: HostelPageProps & { isEditing?: boolean; id?: string }) {
  const [activeTab, setActiveTab] = useState<'boys' | 'girls'>(defaultTab)
  const { ref: heroRef, isInView: heroInView } = useInView(0.1)

  // Use the brand green as the primary accent for this redesign
  const primaryGreen = backgroundColor

  return (
    <div className="relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50">
      {/* ─── Hero Banner ─────────────────────────────── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryGreen} 0%, #064d2e 60%, #032818 100%)`,
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div
          className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
            <Home className="w-3.5 h-3.5" />
            Facilities
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: accentColor }}
          >
            {pageTitle}
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            A home away from home — safe, comfortable, and designed for academic excellence
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-12 md:w-20" style={{ backgroundColor: `${accentColor}40` }} />
            <div
              className="w-2 h-2 rotate-45"
              style={{ backgroundColor: accentColor }}
            />
            <div className="h-px w-12 md:w-20" style={{ backgroundColor: `${accentColor}40` }} />
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-16 md:pb-24">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="inline-flex items-center bg-white rounded-full p-1.5 shadow-md border border-gray-100">
            <button
              onClick={() => setActiveTab('boys')}
              className={`relative px-6 md:px-8 py-2.5 rounded-full text-sm md:text-[15px] font-semibold transition-all duration-300 ${
                activeTab === 'boys'
                  ? 'text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              style={
                activeTab === 'boys'
                  ? { backgroundColor: primaryGreen }
                  : {}
              }
            >
              Boys Hostel
            </button>
            <button
              onClick={() => setActiveTab('girls')}
              className={`relative px-6 md:px-8 py-2.5 rounded-full text-sm md:text-[15px] font-semibold transition-all duration-300 ${
                activeTab === 'girls'
                  ? 'text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              style={
                activeTab === 'girls'
                  ? { backgroundColor: primaryGreen }
                  : {}
              }
            >
              Girls Hostel
            </button>
          </div>
        </div>

        {/* Hostel Content */}
        <div className="max-w-5xl mx-auto">
          <HostelContent
            images={boysHostel?.images || []}
            paragraphs={boysHostel?.paragraphs || []}
            highlights={boysHostel?.highlights || []}
            warden={boysHostel?.warden}
            accentColor={primaryGreen}
            isVisible={activeTab === 'boys'}
            tabKey="boys"
            isEditing={isEditing}
            blockId={id}
          />

          <HostelContent
            images={girlsHostel?.images || []}
            paragraphs={girlsHostel?.paragraphs || []}
            highlights={girlsHostel?.highlights || []}
            warden={girlsHostel?.warden}
            accentColor={primaryGreen}
            isVisible={activeTab === 'girls'}
            tabKey="girls"
            isEditing={isEditing}
            blockId={id}
          />
        </div>
      </div>
    </div>
  )
}

export default HostelPage
