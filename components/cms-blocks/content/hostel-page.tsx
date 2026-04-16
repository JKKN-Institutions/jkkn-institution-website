'use client'

import { useEffect, useState } from 'react'
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
function BentoGallery({ images }: { images: { src: string; alt?: string }[] }) {
  const filtered = images.filter((img) => img.src)
  if (filtered.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((image, idx) => (
        <div
          key={idx}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
        >
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
  accentColor,
}: {
  text: string
  accentColor: string
}) {
  const Icon = getHighlightIcon(text)

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Small delay for enter animation
      const timer = setTimeout(() => setMounted(true), 50)
      return () => clearTimeout(timer)
    }
    setMounted(false)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className={`space-y-10 md:space-y-14 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Bento Image Gallery */}
      <BentoGallery images={images} />

      {/* Description Paragraphs */}
      <div className="space-y-5">
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
          <h3 className="text-lg md:text-xl font-semibold mb-5 text-gray-900">
            Facilities & Amenities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((highlight, index) => (
              <FeatureCard key={index} text={highlight} accentColor={accentColor} />
            ))}
          </div>
        </div>
      )}

      {/* Hostel Warden Contact */}
      {warden && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
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

  const primaryGreen = accentColor || '#0b6d41'

  return (
    <div className="relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50">
      {/* ─── Hero Banner (always visible, no animation) ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)',
        }}
      >
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
            <Home className="w-3.5 h-3.5" />
            Facilities
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ffde59]">
            {pageTitle}
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            A home away from home — safe, comfortable, and designed for academic excellence
          </p>

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
              style={activeTab === 'boys' ? { backgroundColor: primaryGreen } : {}}
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
              style={activeTab === 'girls' ? { backgroundColor: primaryGreen } : {}}
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
