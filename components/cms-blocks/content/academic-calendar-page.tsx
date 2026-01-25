'use client'

import { useState } from 'react'
import { Home, ChevronRight } from 'lucide-react'
import { z } from 'zod'

// Zod Schema Definition
export const AcademicCalendarPageSchema = z.object({
  heroTitle: z.string().default('Academic Calendar'),
  heroSubtitle: z.string().optional(),
  calendarEmbedUrl: z.string().url(),
  calendarTitle: z.string().default('JKKN Academic Calendar'),
})

export type AcademicCalendarPageProps = z.infer<
  typeof AcademicCalendarPageSchema
>

// Breadcrumbs Component
function Breadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white border-b border-gray-200 py-3 px-6"
    >
      <div className="container mx-auto max-w-7xl">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <a href="/" className="hover:text-[#0b6d41] transition-colors">
              Home
            </a>
          </li>
          <li>
            <ChevronRight className="h-4 w-4" />
          </li>
          <li className="text-[#0b6d41] font-medium">Academic Calendar</li>
        </ol>
      </div>
    </nav>
  )
}

// Hero Section Component
function HeroSection({ heroTitle, heroSubtitle }: AcademicCalendarPageProps) {
  return (
    <div className="bg-gradient-to-r from-[#0b6d41] to-[#0f8f56] text-white py-12 px-6">
      <div className="container mx-auto max-w-7xl text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            {heroSubtitle}
          </p>
        )}
      </div>
    </div>
  )
}

// Calendar Embed Section Component
function CalendarEmbedSection({
  calendarEmbedUrl,
  calendarTitle,
}: AcademicCalendarPageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="bg-[#fbfbee] py-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Calendar Container */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-white">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-[#0b6d41]/10 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-[#0b6d41] text-lg font-medium flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0b6d41]"></div>
                <span>Loading Academic Calendar...</span>
              </div>
            </div>
          )}

          {/* Google Calendar Iframe */}
          <iframe
            src={calendarEmbedUrl}
            title={calendarTitle}
            className={`w-full h-[600px] md:h-[700px] lg:h-[800px] relative z-20 transition-opacity duration-700 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}

// Main Component Export
export function AcademicCalendarPage(props: AcademicCalendarPageProps) {
  const validatedProps = AcademicCalendarPageSchema.parse(props)

  return (
    <>
      <Breadcrumbs />
      <HeroSection {...validatedProps} />
      <CalendarEmbedSection {...validatedProps} />
    </>
  )
}
