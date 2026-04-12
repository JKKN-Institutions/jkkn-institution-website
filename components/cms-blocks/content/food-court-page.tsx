'use client'

import Image from 'next/image'
import { z } from 'zod'
import {
  UtensilsCrossed,
  Check,
  Salad,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  CookingPot,
  Leaf,
} from 'lucide-react'
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'

// Map feature titles to icons
function getFeatureIcon(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes('diverse') || lower.includes('menu') || lower.includes('variety'))
    return UtensilsCrossed
  if (lower.includes('quality') || lower.includes('ingredient') || lower.includes('fresh'))
    return CookingPot
  if (lower.includes('healthy') || lower.includes('nutrition') || lower.includes('salad'))
    return Salad
  if (lower.includes('affordable') || lower.includes('price') || lower.includes('cost'))
    return IndianRupee
  if (lower.includes('hygiene') || lower.includes('safe') || lower.includes('clean'))
    return ShieldCheck
  if (lower.includes('organic') || lower.includes('veg'))
    return Leaf
  return Sparkles
}

// Schema for the FoodCourtPage component
export const FoodCourtPageSchema = z.object({
  facilityTitle: z.string().default('FOOD COURT'),
  images: z
    .array(z.object({ src: z.string(), alt: z.string().optional() }))
    .default([]),
  introduction: z.string().default(''),
  features: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .default([]),
  highlightsTitle: z.string().default('Key Highlights'),
  highlights: z.array(z.object({ item: z.string() })).default([]),
  conclusion: z.string().default(''),
  backgroundColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  textColor: z.string().default('#ffffff'),
})

export type FoodCourtPageProps = z.infer<typeof FoodCourtPageSchema>

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
  isEditing,
  id,
}: FoodCourtPageProps & { isEditing?: boolean; id?: string }) {
  const filteredImages = images.filter((img) => img.src)
  const primaryGreen = backgroundColor

  return (
    <div className="relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50">
      {/* ─── Hero Banner ─────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryGreen} 0%, #064d2e 60%, #032818 100%)`,
        }}
      >
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Facilities
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{ color: accentColor }}
          >
            {facilityTitle}
          </h1>

          <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Delicious, nutritious meals in a comfortable and hygienic environment
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="h-px w-12 md:w-20" style={{ backgroundColor: `${accentColor}40` }} />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: accentColor }} />
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
          {/* Images Gallery — 3 column grid */}
          {filteredImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.map((image, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `${facilityTitle} image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Introduction */}
          {(introduction || isEditing) && (
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
          )}

          {/* Features Grid */}
          {features.length > 0 && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
                What We Offer
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = getFeatureIcon(feature.title)
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${primaryGreen}12` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: primaryGreen }} />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      {isEditing && id ? (
                        <RichTextInlineEditor
                          blockId={id}
                          propName={`features.${index}.description`}
                          value={feature.description || '<p></p>'}
                          className="text-sm md:text-[15px] leading-relaxed text-gray-600 prose max-w-none"
                          placeholder="Click to add description..."
                        />
                      ) : (
                        <div
                          className="text-sm md:text-[15px] leading-relaxed text-gray-600 prose max-w-none prose-p:text-gray-600"
                          dangerouslySetInnerHTML={{ __html: feature.description }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
                {highlightsTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryGreen}12` }}
                    >
                      <Check className="w-4 h-4" style={{ color: primaryGreen }} />
                    </div>
                    <p className="text-sm md:text-[15px] font-medium text-gray-700">
                      {highlight.item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conclusion */}
          {(conclusion || isEditing) && (
            <div
              className="rounded-2xl p-6 md:p-8 border shadow-sm"
              style={{
                backgroundColor: `${primaryGreen}08`,
                borderColor: `${primaryGreen}20`,
              }}
            >
              {isEditing && id ? (
                <RichTextInlineEditor
                  blockId={id}
                  propName="conclusion"
                  value={conclusion || '<p></p>'}
                  className="text-[15px] md:text-base leading-[1.8] text-gray-700 prose max-w-none"
                  placeholder="Click to add conclusion..."
                />
              ) : conclusion ? (
                <div
                  className="text-[15px] md:text-base leading-[1.8] text-gray-700 prose max-w-none prose-p:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: conclusion }}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodCourtPage
