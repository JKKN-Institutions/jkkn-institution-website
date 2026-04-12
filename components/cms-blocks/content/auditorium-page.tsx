'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import {
  Users,
  Speaker,
  Theater,
  Volume2,
  UserCheck,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

/**
 * Feature item schema
 */
export const FeatureItemSchema = z.object({
  text: z.string(),
  icon: z.string().optional(),
})

export type FeatureItem = z.infer<typeof FeatureItemSchema>

/**
 * Content paragraph schema
 */
export const ContentParagraphSchema = z.object({
  text: z.string(),
})

export type ContentParagraph = z.infer<typeof ContentParagraphSchema>

/**
 * AuditoriumPage props schema
 */
export const AuditoriumPagePropsSchema = z.object({
  showHeader: z.boolean().default(true),
  headerTitle: z.string().default('Auditorium'),
  headerSubtitle: z.string().optional(),
  heroImage: z.string().default('/images/facilities/auditorium.jpg'),
  heroImageAlt: z.string().default('JKKN Auditorium'),
  showHeroImage: z.boolean().default(true),
  paragraphs: z.array(ContentParagraphSchema).default([]),
  showFeatures: z.boolean().default(true),
  featuresTitle: z.string().optional(),
  features: z.array(FeatureItemSchema).default([]),
  variant: z.enum(['modern-dark', 'modern-light']).default('modern-light'),
  cardStyle: z.enum(['glass', 'solid', 'gradient']).default('glass'),
  showDecorations: z.boolean().default(true),
})

export type AuditoriumPageProps = z.infer<typeof AuditoriumPagePropsSchema> & BaseBlockProps

/**
 * Default content
 */
const defaultParagraphs: ContentParagraph[] = [
  { text: 'The JKKN auditorium is a spacious facility that can accommodate a large number of guests comfortably. The seating arrangement is well-designed to provide an uninterrupted view of the stage, and the acoustics are impeccable, ensuring that every note and word is heard clearly.' },
  { text: 'In addition to its impressive features, the auditorium is designed with utmost attention to detail, making it a truly elegant space. The interior decor features a combination of modern and traditional elements that blend perfectly to create a warm and welcoming atmosphere.' },
  { text: 'The JKKN auditorium is not just an impressive facility, but it is also a versatile one. It can be used for various purposes, including graduation ceremonies, workshops, and seminars, making it an essential resource for the institution.' },
]

const defaultFeatures: FeatureItem[] = [
  { text: 'Spacious seating', icon: 'Users' },
  { text: 'High-tech sound and lighting systems', icon: 'Speaker' },
  { text: 'Stage equipment and props', icon: 'Theater' },
  { text: 'Excellent acoustics', icon: 'Volume2' },
  { text: 'Professional staff', icon: 'UserCheck' },
]

/**
 * Get icon component by name
 */
function getIconComponent(iconName: string) {
  const icons: Record<string, typeof Users> = {
    Users, Speaker, Theater, Volume2, UserCheck,
    Sparkles, Award, Calendar, CheckCircle2,
  }
  return icons[iconName] || CheckCircle2
}

/**
 * AuditoriumPage Component
 */
export default function AuditoriumPage({
  showHeader = true,
  headerTitle = 'Auditorium',
  headerSubtitle,
  heroImage = '/images/facilities/auditorium.jpg',
  heroImageAlt = 'JKKN Auditorium',
  showHeroImage = true,
  paragraphs = defaultParagraphs,
  showFeatures = true,
  featuresTitle,
  features = defaultFeatures,
  className,
}: AuditoriumPageProps) {
  const displayParagraphs = paragraphs.length > 0 ? paragraphs : defaultParagraphs
  const displayFeatures = features.length > 0 ? features : defaultFeatures

  return (
    <section
      className={cn('relative w-screen -ml-[calc((100vw-100%)/2)] bg-gray-50/50', className)}
    >
      {/* ─── Hero Banner ─────────────────────────────── */}
      {showHeader && (
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0b6d41 0%, #064d2e 60%, #032818 100%)',
          }}
        >
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold tracking-widest text-white/80 uppercase mb-5">
              <Theater className="w-3.5 h-3.5" />
              Facilities
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ffde59]">
              {headerTitle}
            </h1>

            {/* Subtitle */}
            {headerSubtitle && (
              <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                {headerSubtitle}
              </p>
            )}

            {/* Decorative line */}
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
      )}

      {/* ─── Content Area ────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
          {/* Hero Image */}
          {showHeroImage && heroImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <Image
                src={heroImage}
                alt={heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              />
            </div>
          )}

          {/* Content Paragraphs */}
          {displayParagraphs.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="space-y-5">
                {displayParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[15px] md:text-base leading-[1.8] text-gray-600"
                  >
                    {paragraph.text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Features Section */}
          {showFeatures && displayFeatures.length > 0 && (
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
                {featuresTitle || 'Key Features'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayFeatures.map((feature, index) => {
                  const IconComponent = getIconComponent(feature.icon || 'CheckCircle2')
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#0b6d41]/10 flex items-center justify-center">
                        <IconComponent className="w-[18px] h-[18px] text-[#0b6d41]" />
                      </div>
                      <span className="text-sm md:text-[15px] font-medium text-gray-700">
                        {feature.text}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
