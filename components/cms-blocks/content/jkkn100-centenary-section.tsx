'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { Play, X, Landmark, ExternalLink, Sparkles } from 'lucide-react'
import { extractYouTubeVideoId } from '@/lib/utils/youtube'

// ==========================================
// Video URL Helper
// ==========================================

function getEmbedUrl(url: string): string {
  const youtubeId = extractYouTubeVideoId(url)
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`
  }
  if (url.includes('/embed/')) {
    return url
  }
  return url
}

// ==========================================
// Intersection Observer Hook
// ==========================================

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

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isInView }
}

// ==========================================
// Zod Schema
// ==========================================

const FontWeightSchema = z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('bold')
const FontStyleSchema = z.enum(['normal', 'italic']).default('normal')

export const JKKN100CentenarySectionPropsSchema = z.object({
  // Badge/Header
  badge: z.string().default('#JKKN100'),
  tagline: z.string().default('CELEBRATING A CENTURY OF EXCELLENCE'),

  // Founder Information
  founderImage: z.string().optional(),
  founderImageAlt: z.string().default('Kodai Vallal Shri. J.K.K. Nataraja Chettiar'),
  founderName: z.string().default('Kodai Vallal Shri. J.K.K. Nataraja Chettiar'),
  founderYears: z.string().default('1895 - 1995'),

  // Quote Section
  quote: z.string().default('Education is the foundation of a prosperous society'),

  // Timeline
  timelineStart: z.string().default('November 2025'),
  timelineEnd: z.string().default('November 2026'),
  timelineSubtitle: z.string().default('Honoring 100 Years of Our Founder\'s Birth'),

  // CTA Buttons - Simplified
  primaryCtaLabel: z.string().default('Watch Tribute Video'),
  tributeVideoUrl: z.string().default(''),
  secondaryCtaLabel: z.string().default('Our Heritage'),
  heritageUrl: z.string().default('/about/heritage'),
  openHeritageInNewTab: z.boolean().default(false),

  // Typography - Badge
  badgeFontWeight: FontWeightSchema,
  badgeFontStyle: FontStyleSchema,
  badgeColor: z.string().default('#0b6d41'),

  // Typography - Tagline
  taglineFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('medium'),
  taglineFontStyle: FontStyleSchema,
  taglineColor: z.string().default('#d4af37'),

  // Typography - Quote
  quoteFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
  quoteFontStyle: z.enum(['normal', 'italic']).default('italic'),
  quoteColor: z.string().default('#1a1a1a'),

  // Typography - Founder Name
  founderNameFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),
  founderNameColor: z.string().default('#1f2937'),

  // Typography - Timeline
  timelineFontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('semibold'),
  timelineColor: z.string().default('#0b6d41'),

  // Styling
  backgroundColor: z.string().default('#ffffff'),
  accentColor: z.string().default('#0b6d41'),
  goldColor: z.string().default('#d4af37'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Sizing
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
})

export type JKKN100CentenarySectionProps = z.infer<typeof JKKN100CentenarySectionPropsSchema> & BaseBlockProps

// ==========================================
// Video Modal
// ==========================================

function VideoModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="aspect-video">
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

// ==========================================
// Main Component - Minimal Elegant Design
// ==========================================

export function JKKN100CentenarySection({
  badge = '#JKKN100',
  tagline = 'CELEBRATING A CENTURY OF EXCELLENCE',
  founderImage,
  founderImageAlt = 'Kodai Vallal Shri. J.K.K. Nataraja Chettiar',
  founderName = 'Kodai Vallal Shri. J.K.K. Nataraja Chettiar',
  founderYears = '1895 - 1995',
  quote = 'Education is the foundation of a prosperous society',
  timelineStart = 'November 2025',
  timelineEnd = 'November 2026',
  timelineSubtitle = 'Honoring 100 Years of Our Founder\'s Birth',
  // CTA Props
  primaryCtaLabel = 'Watch Tribute Video',
  tributeVideoUrl = '',
  secondaryCtaLabel = 'Our Heritage',
  heritageUrl = '/about/heritage',
  openHeritageInNewTab = false,
  // Typography - Badge
  badgeFontWeight = 'bold',
  badgeFontStyle = 'normal',
  badgeColor = '#0b6d41',
  // Typography - Tagline
  taglineFontWeight = 'medium',
  taglineFontStyle = 'normal',
  taglineColor = '#d4af37',
  // Typography - Quote
  quoteFontWeight = 'normal',
  quoteFontStyle = 'italic',
  quoteColor = '#1a1a1a',
  // Typography - Founder Name
  founderNameFontWeight = 'semibold',
  founderNameColor = '#1f2937',
  // Typography - Timeline
  timelineFontWeight = 'semibold',
  timelineColor = '#0b6d41',
  // Styling
  backgroundColor = '#ffffff',
  accentColor = '#0b6d41',
  goldColor = '#d4af37',
  showAnimations = true,
  paddingY = 'lg',
  className,
  isEditing,
}: JKKN100CentenarySectionProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const sectionRef = useInView(0.1)

  // Font weight classes mapping
  const fontWeightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  }

  // Font style classes mapping
  const fontStyleClasses = {
    normal: 'not-italic',
    italic: 'italic',
  }

  const paddingClasses = {
    sm: 'py-8 md:py-10',
    md: 'py-10 md:py-12',
    lg: 'py-12 md:py-16',
    xl: 'py-16 md:py-20',
  }

  const animateClass = (delay: number) =>
    showAnimations
      ? cn(
          'transition-all duration-700',
          sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )
      : ''

  return (
    <>
      <section
        ref={sectionRef.ref}
        className={cn('relative w-full overflow-hidden', paddingClasses[paddingY], className)}
        style={{ backgroundColor }}
      >
        {/* Subtle decorative elements */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}20, transparent)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}20, transparent)` }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge & Tagline */}
          <div
            className={cn('text-center mb-6 md:mb-8', animateClass(0))}
            style={{ transitionDelay: '0ms' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4" style={{ color: goldColor }} />
              <span
                className={cn(
                  'text-xl sm:text-2xl md:text-3xl tracking-tight',
                  fontWeightClasses[badgeFontWeight],
                  fontStyleClasses[badgeFontStyle]
                )}
                style={{ color: badgeColor }}
              >
                {badge}
              </span>
            </div>
            {/* Tagline */}
            <p
              className={cn(
                'text-xs sm:text-sm tracking-[0.3em] uppercase',
                fontWeightClasses[taglineFontWeight],
                fontStyleClasses[taglineFontStyle]
              )}
              style={{ color: taglineColor }}
            >
              {tagline}
            </p>
          </div>

          {/* Main Content Card */}
          <div
            className={cn(
              'max-w-4xl mx-auto rounded-2xl overflow-hidden',
              'border shadow-lg',
              animateClass(100)
            )}
            style={{
              borderColor: `${accentColor}15`,
              boxShadow: `0 4px 40px ${accentColor}08`,
              transitionDelay: '100ms',
            }}
          >
            {/* Top accent bar */}
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${goldColor}, ${accentColor})` }} />

            <div className="p-5 sm:p-6 md:p-8 bg-white">
              {/* Two Column Layout */}
              <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
                {/* Left - Founder Photo */}
                <div
                  className={cn('flex-shrink-0', animateClass(200))}
                  style={{ transitionDelay: '200ms' }}
                >
                  <div
                    className="relative p-1 rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${goldColor}, ${goldColor}80, ${goldColor})`,
                      boxShadow: `0 8px 30px ${goldColor}30`,
                    }}
                  >
                    <div className="w-36 h-44 sm:w-40 sm:h-52 md:w-48 md:h-60 rounded-lg overflow-hidden bg-gray-100 relative">
                      {founderImage ? (
                        <Image
                          src={founderImage}
                          alt={founderImageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 192px"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                          <Landmark className="w-16 h-16 text-gray-300 mb-2" />
                          {isEditing && (
                            <p className="text-xs text-gray-400 px-4 text-center">Upload founder photo</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Founder name below photo */}
                  <div className="text-center mt-4">
                    <p
                      className={cn('text-sm', fontWeightClasses[founderNameFontWeight])}
                      style={{ color: founderNameColor }}
                    >
                      {founderName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{founderYears}</p>
                  </div>
                </div>

                {/* Right - Quote & Info */}
                <div className="flex-1 text-center md:text-left">
                  {/* Quote */}
                  <div
                    className={cn('mb-4', animateClass(300))}
                    style={{ transitionDelay: '300ms' }}
                  >
                    <Sparkles className="w-5 h-5 mb-2 mx-auto md:mx-0" style={{ color: goldColor }} />
                    <blockquote
                      className={cn(
                        'text-lg sm:text-xl md:text-2xl font-serif leading-relaxed',
                        fontWeightClasses[quoteFontWeight],
                        fontStyleClasses[quoteFontStyle]
                      )}
                      style={{ color: quoteColor }}
                    >
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Divider */}
                  <div
                    className={cn('w-16 h-0.5 mx-auto md:mx-0 mb-4', animateClass(400))}
                    style={{ backgroundColor: goldColor, transitionDelay: '400ms' }}
                  />

                  {/* Timeline */}
                  <div
                    className={cn('mb-5', animateClass(500))}
                    style={{ transitionDelay: '500ms' }}
                  >
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <span
                        className={cn('text-sm', fontWeightClasses[timelineFontWeight])}
                        style={{ color: timelineColor }}
                      >
                        {timelineStart}
                      </span>
                      <span className="w-8 h-px" style={{ backgroundColor: goldColor }} />
                      <span
                        className={cn('text-sm', fontWeightClasses[timelineFontWeight])}
                        style={{ color: timelineColor }}
                      >
                        {timelineEnd}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{timelineSubtitle}</p>
                  </div>

                  {/* CTA Buttons */}
                  <div
                    className={cn(
                      'flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3',
                      animateClass(600)
                    )}
                    style={{ transitionDelay: '600ms' }}
                  >
                    {/* Primary CTA - Watch Tribute Video */}
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 4px 14px ${accentColor}40`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 6px 20px ${accentColor}50`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 4px 14px ${accentColor}40`
                      }}
                    >
                      <Play className="w-4 h-4" />
                      <span>{primaryCtaLabel}</span>
                    </button>

                    {/* Secondary CTA - Our Heritage */}
                    <a
                      href={heritageUrl}
                      target={openHeritageInNewTab ? '_blank' : undefined}
                      rel={openHeritageInNewTab ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 border-2"
                      style={{
                        borderColor: accentColor,
                        color: accentColor,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${accentColor}08`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span>{secondaryCtaLabel}</span>
                      {openHeritageInNewTab && <ExternalLink className="w-4 h-4" />}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${accentColor}, ${goldColor}, ${accentColor})` }} />
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && tributeVideoUrl && (
        <VideoModal
          videoUrl={tributeVideoUrl}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </>
  )
}

export default JKKN100CentenarySection
