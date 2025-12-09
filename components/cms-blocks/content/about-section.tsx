'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { DEFAULT_COLOR_SCHEME } from '@/lib/cms/brand-colors'
import Image from 'next/image'

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
 * AboutSection Component
 *
 * A two-column about section with:
 * - Split-color header
 * - Left: title + paragraphs
 * - Right: image with badge, overlay, and decorative elements
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

  return (
    <section
      className={cn('pt-6 pb-12 md:pt-8 md:pb-16 lg:pt-10 lg:pb-20 w-full', className)}
      style={{ backgroundColor }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
            <span style={{ color: headerPart2Color }}>{headerPart2}</span>
          </h2>
          {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Two-column layout */}
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center max-w-7xl mx-auto',
            isReversed && 'lg:grid-flow-dense'
          )}
        >
          {/* Left Column - Content */}
          <div className={cn(isReversed && 'lg:col-start-2')}>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {sectionTitle}
            </h3>

            {paragraph1 && (
              <p className="text-gray-600 leading-relaxed mb-4">
                {paragraph1}
              </p>
            )}

            {paragraph2 && (
              <p className="text-gray-600 leading-relaxed">
                {paragraph2}
              </p>
            )}

            {/* Empty state for editor */}
            {isEditing && !paragraph1 && !paragraph2 && (
              <div className="text-gray-400 italic">
                Add content paragraphs in the properties panel
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          <div className={cn('relative', isReversed && 'lg:col-start-1 lg:row-start-1')}>
            {image ? (
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
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
                      className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
                      style={{ backgroundColor: badgeColor }}
                    >
                      {imageBadge}
                    </div>
                  )}

                  {/* Bottom Overlay */}
                  {(imageTitle || imageSubtitle) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pt-16">
                      {imageTitle && (
                        <h4 className="text-white text-xl md:text-2xl font-bold">
                          {imageTitle}
                        </h4>
                      )}
                      {imageSubtitle && (
                        <p className="text-white/80 text-sm md:text-base mt-1">
                          {imageSubtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Decorative Circle Element */}
                {showDecorative && (
                  <div
                    className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-4 opacity-20 pointer-events-none hidden lg:block"
                    style={{ borderColor: badgeColor }}
                  />
                )}
              </div>
            ) : (
              /* Placeholder for editor */
              isEditing && (
                <div className="bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center text-gray-400">
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
