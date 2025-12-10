'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { DEFAULT_COLOR_SCHEME } from '@/lib/cms/brand-colors'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Award, ArrowRight } from 'lucide-react'

/**
 * AboutSection props schema
 */
export const AboutSectionPropsSchema = z.object({
  // Header
  headerPart1: z.string().default('About').describe('First part of header (typically black)'),
  headerPart2: z.string().default('JKKN Institution').describe('Second part of header (typically green)'),
  headerPart1Color: z.string().default('#000000').describe('Color for first part'),
  headerPart2Color: z.string().default(DEFAULT_COLOR_SCHEME.primary).describe('Color for second part'),
  subtitle: z.string().optional().describe('Subtitle below the header'),

  // Left column content
  sectionTitle: z.string().default('Building Excellence Since 1998').describe('Section title'),
  paragraph1: z.string().default('').describe('First paragraph'),
  paragraph2: z.string().optional().describe('Second paragraph'),

  // Right column image
  image: z.string().optional().describe('Image URL'),
  imageAlt: z.string().default('About JKKN').describe('Image alt text'),
  imageBadge: z.string().optional().describe('Badge text (e.g., "Est. 1998")'),
  imageTitle: z.string().optional().describe('Image overlay title'),
  imageSubtitle: z.string().optional().describe('Image overlay subtitle'),

  // Styling
  backgroundColor: z.string().default(DEFAULT_COLOR_SCHEME.background).describe('Section background color'),
  badgeColor: z.string().default(DEFAULT_COLOR_SCHEME.primary).describe('Badge background color'),
  showDecorative: z.boolean().default(true).describe('Show decorative circle element'),
  layout: z.enum(['default', 'reversed']).default('default').describe('Layout direction'),
})

export type AboutSectionProps = z.infer<typeof AboutSectionPropsSchema> & BaseBlockProps

/**
 * Intersection Observer hook for animations
 */
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

/**
 * AboutSection Component
 *
 * A modern two-column about section with:
 * - Split-color header with animations
 * - Left: title + paragraphs with scroll animations
 * - Right: image with badge, overlay, and decorative elements
 * - Glassmorphism effects and modern styling
 */
export function AboutSection({
  headerPart1 = 'About',
  headerPart2 = 'JKKN Institution',
  headerPart1Color = '#000000',
  headerPart2Color = DEFAULT_COLOR_SCHEME.primary,
  subtitle,
  sectionTitle = 'Building Excellence Since 1998',
  paragraph1 = '',
  paragraph2,
  image,
  imageAlt = 'About JKKN',
  imageBadge,
  imageTitle,
  imageSubtitle,
  backgroundColor = DEFAULT_COLOR_SCHEME.background,
  badgeColor = DEFAULT_COLOR_SCHEME.primary,
  showDecorative = true,
  layout = 'default',
  className,
  isEditing,
}: AboutSectionProps) {
  const isReversed = layout === 'reversed'
  const headerRef = useInView()
  const contentRef = useInView()
  const imageRef = useInView()

  return (
    <section
      className={cn('relative pt-12 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 w-full overflow-hidden', className)}
      style={{ backgroundColor }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient overlay */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at top right, ${badgeColor} 0%, transparent 70%)`
          }}
        />

        {/* Floating decorative circles */}
        {showDecorative && (
          <>
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-5"
              style={{ backgroundColor: badgeColor }}
            />
            <div
              className="absolute bottom-20 -left-20 w-64 h-64 rounded-full opacity-5"
              style={{ backgroundColor: badgeColor }}
            />
          </>
        )}

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${badgeColor} 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div
          ref={headerRef.ref}
          className={cn(
            "text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-1000",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {/* Section Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: `${badgeColor}15`, color: badgeColor }}
          >
            <Award className="w-4 h-4" />
            <span>Our Legacy</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span style={{ color: headerPart2Color }}>{headerPart2}</span>
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Decorative line */}
          <div
            className="w-24 h-1 mx-auto mt-6 rounded-full"
            style={{ backgroundColor: badgeColor }}
          />
        </div>

        {/* Two-column layout */}
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center max-w-7xl mx-auto',
            isReversed && 'lg:grid-flow-dense'
          )}
        >
          {/* Left Column - Content */}
          <div
            ref={contentRef.ref}
            className={cn(
              isReversed && 'lg:col-start-2',
              "transition-all duration-1000 delay-200",
              contentRef.isInView ? "opacity-100 translate-x-0" : isReversed ? "opacity-0 translate-x-10" : "opacity-0 -translate-x-10"
            )}
          >
            {/* Section Title with accent */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-1 h-12 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: badgeColor }}
              />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {sectionTitle}
              </h3>
            </div>

            {paragraph1 && (
              <p className="text-gray-600 leading-relaxed mb-6 text-base md:text-lg">
                {paragraph1}
              </p>
            )}

            {paragraph2 && (
              <p className="text-gray-600 leading-relaxed mb-8 text-base md:text-lg">
                {paragraph2}
              </p>
            )}

            {/* Learn More Button */}
            <a
              href="/about"
              className="group inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3"
              style={{ color: badgeColor }}
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Empty state for editor */}
            {isEditing && !paragraph1 && !paragraph2 && (
              <div className="text-gray-400 italic">
                Add content paragraphs in the properties panel
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          <div
            ref={imageRef.ref}
            className={cn(
              'relative',
              isReversed && 'lg:col-start-1 lg:row-start-1',
              "transition-all duration-1000 delay-400",
              imageRef.isInView ? "opacity-100 translate-x-0" : isReversed ? "opacity-0 -translate-x-10" : "opacity-0 translate-x-10"
            )}
          >
            {image ? (
              <div className="relative group">
                {/* Decorative background frame */}
                <div
                  className="absolute -inset-4 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundColor: badgeColor }}
                />

                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src={image}
                    alt={imageAlt}
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover"
                  />

                  {/* Badge (top-right) */}
                  {imageBadge && (
                    <div
                      className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg backdrop-blur-sm"
                      style={{ backgroundColor: `${badgeColor}ee` }}
                    >
                      {imageBadge}
                    </div>
                  )}

                  {/* Bottom Overlay with glassmorphism */}
                  {(imageTitle || imageSubtitle) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-20">
                      {imageTitle && (
                        <h4 className="text-white text-xl md:text-2xl font-bold mb-1">
                          {imageTitle}
                        </h4>
                      )}
                      {imageSubtitle && (
                        <p className="text-white/80 text-sm md:text-base">
                          {imageSubtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                {showDecorative && (
                  <>
                    {/* Corner accent */}
                    <div
                      className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-4 opacity-30 pointer-events-none hidden lg:block"
                      style={{ borderColor: badgeColor }}
                    />
                    {/* Small floating badge */}
                    <div
                      className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg hidden lg:flex"
                      style={{ backgroundColor: badgeColor }}
                    >
                      <span className="text-white text-2xl font-bold">55+</span>
                    </div>
                    <span
                      className="absolute -top-4 left-14 text-xs font-medium hidden lg:block"
                      style={{ color: badgeColor }}
                    >
                      Years of Excellence
                    </span>
                  </>
                )}
              </div>
            ) : (
              /* Placeholder for editor */
              isEditing && (
                <div className="bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>Add an image in the properties panel</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
