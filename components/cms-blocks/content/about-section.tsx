'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { DEFAULT_COLOR_SCHEME } from '@/lib/cms/brand-colors'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { DecorativePatterns, GoldRing, CurveDivider } from '../shared/decorative-patterns'
import { useSectionTypography } from '@/lib/cms/hooks/use-section-typography'

/**
 * AboutSection props schema
 */
export const AboutSectionPropsSchema = z.object({
  // Layout mode
  layoutMode: z.enum(['two-column', 'founder-centered']).default('two-column').describe('Layout mode'),

  // Header
  badge: z.string().default('Since 1952').describe('Badge text at top'),
  headerPart1: z.string().default('About').describe('First part of header'),
  headerPart2: z.string().default('JKKN Institution').describe('Second part (gold italic)'),
  subtitle: z.string().optional().describe('Subtitle below the header'),

  // Two-column layout content (previous design)
  sectionTitle: z.string().default('Building Excellence Since 1952').describe('Section title'),
  paragraph1: z.string().default('').describe('First paragraph'),
  paragraph2: z.string().optional().describe('Second paragraph'),

  // Two-column image
  image: z.string().optional().describe('Image URL'),
  imageAlt: z.string().default('About JKKN').describe('Image alt text'),
  imageBadge: z.string().optional().describe('Badge text (e.g., "Est. 1969")'),
  imageTitle: z.string().optional().describe('Image overlay title'),
  imageSubtitle: z.string().optional().describe('Image overlay subtitle'),
  layout: z.enum(['default', 'reversed']).default('default').describe('Layout direction for two-column'),

  // Founder section (new design)
  showFounder: z.boolean().default(false).describe('Show founder profile'),
  founderImage: z.string().optional().describe('Founder image URL'),
  founderName: z.string().default('SHRI. J.K.K. NATARAJAH').describe('Founder name'),
  founderTitle: z.string().default('Founder of J.K.K. Rangammal Charitable Trust').describe('Founder title'),
  founderBadge: z.string().default('VISIONARY PHILANTHROPIST').describe('Founder badge text'),

  // Stats
  showStats: z.boolean().default(false).describe('Show statistics row'),
  stats: z.array(z.object({
    value: z.string().describe('Stat value (e.g., "1,969")'),
    label: z.string().describe('Stat label (e.g., "Year Established")'),
  })).default([
    { value: '1952', label: 'Year Established' },
    { value: '11', label: 'Institutions' },
    { value: '50,000+', label: 'Alumni' },
    { value: '5,000+', label: 'Current Students' },
  ]).describe('Statistics to display'),

  // Story section
  showStory: z.boolean().default(false).describe('Show Our Story section'),
  storyTitle: z.string().default('Our Story').describe('Story section title'),
  storyContent: z.string().default('').describe('Story content paragraphs'),

  // Milestones
  showMilestones: z.boolean().default(false).describe('Show milestones timeline'),
  milestones: z.array(z.object({
    year: z.string().describe('Year'),
    title: z.string().describe('Milestone title'),
    description: z.string().optional().describe('Milestone description'),
  })).default([]).describe('Timeline milestones'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-dark').describe('Visual style variant'),
  showDecorative: z.boolean().default(true).describe('Show decorative patterns'),
  showCurve: z.boolean().default(true).describe('Show curved bottom divider'),

  // Typography Colors
  titleColor: z.string().optional().describe('Main title color'),
  subtitleColor: z.string().optional().describe('Subtitle color'),
  accentColor: z.string().optional().describe('Accent word color'),

  // Typography Fonts
  headerPart1Font: z.string().optional().describe('Font family for header part 1'),
  headerPart2Font: z.string().optional().describe('Font family for header part 2'),
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
 * A flexible about section with two layout modes:
 * 1. Two-column: Text on left, image on right (original design)
 * 2. Founder-centered: Full-width with founder profile (new design)
 *
 * Both modes support:
 * - Modern styling with green gradient/cream background
 * - Decorative circle patterns
 * - Gold accents and serif typography
 * - Stats row
 * - Story section
 */
export function AboutSection({
  layoutMode = 'two-column',
  badge = 'Since 1952',
  headerPart1 = 'About',
  headerPart2 = 'JKKN Institution',
  subtitle,
  // Two-column props
  sectionTitle = 'Building Excellence Since 1952',
  paragraph1 = '',
  paragraph2,
  image,
  imageAlt = 'About JKKN',
  imageBadge,
  imageTitle,
  imageSubtitle,
  layout = 'default',
  // Founder props
  showFounder = false,
  founderImage,
  founderName = 'SHRI. J.K.K. NATARAJAH',
  founderTitle = 'Founder of J.K.K. Rangammal Charitable Trust',
  founderBadge = 'VISIONARY PHILANTHROPIST',
  // Common props
  showStats = false,
  stats = [
    { value: '1952', label: 'Year Established' },
    { value: '11', label: 'Institutions' },
    { value: '50,000+', label: 'Alumni' },
    { value: '5,000+', label: 'Current Students' },
  ],
  showStory = false,
  storyTitle = 'Our Story',
  storyContent = '',
  showMilestones = false,
  milestones = [],
  variant = 'modern-dark',
  showDecorative = true,
  showCurve = true,
  titleColor,
  subtitleColor,
  accentColor,
  headerPart1Font,
  headerPart2Font,
  className,
  isEditing,
}: AboutSectionProps) {
  const headerRef = useInView()
  const contentRef = useInView()
  const founderRef = useInView()
  const statsRef = useInView()
  const storyRef = useInView()
  const milestonesRef = useInView()

  // Get page-level typography with block overrides
  const { title: titleTypo, subtitle: subtitleTypo, badge: badgeTypo } = useSectionTypography({
    titleColor,
    subtitleColor,
  })

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'
  const isReversed = layout === 'reversed'
  const isTwoColumn = layoutMode === 'two-column'

  // Default content
  const defaultParagraph1 = `The J.K.K. Rangammal Charitable Trust was founded with a vision to provide quality education and empower communities. Since our establishment in 1952, we have been committed to building excellence in education across multiple disciplines.`

  const defaultParagraph2 = `Today, our institutions span across medical, engineering, arts, and sciences, nurturing over 50,000 alumni who have made their mark across the globe. We continue to uphold our founder's vision of accessible, quality education.`

  const displayParagraph1 = paragraph1 || defaultParagraph1
  const displayParagraph2 = paragraph2 || defaultParagraph2

  // Default story content
  const defaultStoryContent = `In the 1960s, female children in Komarapalayam had to walk 2.3 km to the nearby town of Bhavani for schooling. Some parents hesitated to send their daughters, while others ceased their children's education altogether, resulting in them staying at home or working in handlooms and dyeing industries.

Recognizing the need for women's education, Shri J.K.K. Natarajah, a visionary philanthropist of the area, initiated a girls' school in this town in 1963, four years before the inception of the trust.

The Trust, J.K.K. Rangammal Charitable Trust (Reg No: 33), was established in 1969 with the mission of providing literacy and empowering women, aiming to upgrade the socio-economic status of the community.`

  const displayStoryContent = storyContent || defaultStoryContent

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        isDark ? 'section-green-gradient' : 'bg-brand-cream',
        className
      )}
    >
      {/* Decorative Patterns */}
      {showDecorative && isModern && (
        <DecorativePatterns variant={isTwoColumn ? 'minimal' : 'dense'} color={isDark ? 'white' : 'green'} />
      )}

      <div className="relative z-10 pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
          {/* Badge */}
          <div
            ref={headerRef.ref}
            className={cn(
              'text-center transition-all duration-700',
              headerRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <span
            className={cn("badge-gold mb-6 inline-block", badgeTypo.className)}
            style={badgeTypo.style}
          >
            {badge}
          </span>

            {/* Header */}
            <h2
              className={cn(
                "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4",
                !headerPart1Font && !headerPart2Font && "font-serif-heading"
              )}
            >
              <span
                style={{
                  color: titleTypo.style.color || (isDark ? '#ffffff' : '#1f2937'),
                  fontFamily: headerPart1Font || undefined,
                }}
              >
                {headerPart1}
              </span>{' '}
              <span
                className={cn(!headerPart2Font && "italic")}
                style={{
                  color: accentColor || (isDark ? '#D4AF37' : '#0b6d41'),
                  fontFamily: headerPart2Font || undefined,
                  fontStyle: headerPart2Font ? 'normal' : 'italic',
                }}
              >
                {headerPart2}
              </span>
            </h2>

            {subtitle && (
              <p
                className={cn("text-lg md:text-xl max-w-2xl mx-auto", isDark ? "text-white/70" : "text-gray-600")}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Two-Column Layout */}
          {isTwoColumn && (
            <div
              ref={contentRef.ref}
              className={cn(
                'mt-16 max-w-7xl mx-auto transition-all duration-700 delay-200',
                contentRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <div
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center',
                  isReversed && 'lg:grid-flow-dense'
                )}
              >
                {/* Left Column - Content */}
                <div className={cn(isReversed && 'lg:col-start-2')}>
                  <h3 className={cn(
                    'font-serif-heading text-2xl md:text-3xl font-bold mb-6',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    {sectionTitle}
                  </h3>

                  {/* Render paragraphs - support line-by-line bullet points */}
                  {displayParagraph1 && (
                    displayParagraph1.includes('\n') ? (
                      <ul className={cn(
                        'space-y-2 mb-4 list-disc list-inside',
                        isDark ? 'text-white/80' : 'text-gray-600'
                      )}>
                        {displayParagraph1.split('\n').filter(Boolean).map((line, index) => (
                          <li key={index} className="leading-relaxed">{line.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn(
                        'leading-relaxed mb-4',
                        isDark ? 'text-white/80' : 'text-gray-600'
                      )}>
                        {displayParagraph1}
                      </p>
                    )
                  )}

                  {displayParagraph2 && (
                    displayParagraph2.includes('\n') ? (
                      <ul className={cn(
                        'space-y-2 list-disc list-inside',
                        isDark ? 'text-white/80' : 'text-gray-600'
                      )}>
                        {displayParagraph2.split('\n').filter(Boolean).map((line, index) => (
                          <li key={index} className="leading-relaxed">{line.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={cn(
                        'leading-relaxed',
                        isDark ? 'text-white/80' : 'text-gray-600'
                      )}>
                        {displayParagraph2}
                      </p>
                    )
                  )}

                  {/* Learn More Link */}
                  <div className="mt-8">
                    <a
                      href="/about/our-trust"
                      className="group inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300"
                    >
                      Learn More About Our Journey
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className={cn('relative', isReversed && 'lg:col-start-1 lg:row-start-1')}>
                  {image ? (
                    <div className="relative">
                      {/* Main Image Container */}
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                          src={image}
                          alt={imageAlt}
                          width={600}
                          height={450}
                          className="w-full h-auto object-cover"
                        />

                        {/* Badge (top-right) */}
                        {imageBadge && (
                          <div className="absolute top-4 right-4 badge-gold shadow-lg">
                            {imageBadge}
                          </div>
                        )}

                        {/* Bottom Overlay */}
                        {(imageTitle || imageSubtitle) && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pt-16">
                            {imageTitle && (
                              <h4 className="text-white text-xl md:text-2xl font-bold font-serif-heading">
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

                      {/* Decorative Gold Ring */}
                      {showDecorative && (
                        <div
                          className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-4 border-gold opacity-30 pointer-events-none hidden lg:block"
                        />
                      )}
                    </div>
                  ) : (
                    /* Placeholder with decorative element */
                    <div className={cn(
                      'rounded-2xl h-[400px] flex items-center justify-center',
                      isDark ? 'bg-white/10' : 'bg-brand-primary/10'
                    )}>
                      <div className="text-center">
                        <GoldRing size="xl" glowEffect>
                          <div className={cn(
                            'w-32 h-32 rounded-full flex items-center justify-center',
                            isDark ? 'bg-white/10' : 'bg-brand-primary/10'
                          )}>
                            <GraduationCap className={cn(
                              'w-16 h-16',
                              isDark ? 'text-white/30' : 'text-brand-primary/30'
                            )} />
                          </div>
                        </GoldRing>
                        {isEditing && (
                          <p className={cn(
                            'mt-4 text-sm',
                            isDark ? 'text-white/40' : 'text-gray-400'
                          )}>
                            Add an image in the properties panel
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Founder-Centered Layout */}
          {!isTwoColumn && showFounder && (
            <div
              ref={founderRef.ref}
              className={cn(
                'mt-16 text-center transition-all duration-700 delay-200',
                founderRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              {/* Founder Image with Gold Ring */}
              <div className="flex justify-center mb-6">
                <GoldRing size="xl" glowEffect>
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-[#064d2e]">
                    {founderImage ? (
                      <Image
                        src={founderImage}
                        alt={founderName}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                  </div>
                </GoldRing>
              </div>

              {/* Founder Badge */}
              <span className="badge-gold-outline text-xs mb-4 inline-block">{founderBadge}</span>

              {/* Founder Name */}
              <h3 className={cn(
                'font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold mt-4',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {founderName}
              </h3>
              <p className={cn(
                'text-base md:text-lg mt-2',
                isDark ? 'text-white/70' : 'text-gray-600'
              )}>
                {founderTitle}
              </p>
            </div>
          )}

          {/* Stats Row */}
          {showStats && stats.length > 0 && (
            <div
              ref={statsRef.ref}
              className={cn(
                'mt-16 transition-all duration-700 delay-300',
                statsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={cn(
                      'stat-number',
                      isDark ? 'text-white' : 'text-brand-primary'
                    )}>
                      {stat.value}
                    </div>
                    <div className={cn(
                      'stat-label',
                      isDark ? 'text-white/60' : 'text-gray-500'
                    )}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Our Story Section */}
          {showStory && (
            <div
              ref={storyRef.ref}
              className={cn(
                'mt-20 max-w-4xl mx-auto transition-all duration-700 delay-400',
                storyRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              {/* Story Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={cn(
                    'w-12 h-px',
                    isDark ? 'bg-white/30' : 'bg-gray-300'
                  )} />
                  <span className={cn(
                    'text-sm uppercase tracking-widest',
                    isDark ? 'text-white/50' : 'text-gray-400'
                  )}>
                    Our Legacy
                  </span>
                  <div className={cn(
                    'w-12 h-px',
                    isDark ? 'bg-white/30' : 'bg-gray-300'
                  )} />
                </div>

                <h3 className={cn(
                  'font-serif-heading text-3xl sm:text-4xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {storyTitle.split(' ').map((word, i) =>
                    i === storyTitle.split(' ').length - 1 ? (
                      <span key={i} className="text-gold-italic">{word}</span>
                    ) : (
                      <span key={i}>{word} </span>
                    )
                  )}
                </h3>
              </div>

              {/* Story Content */}
              <div className={cn(
                'prose prose-lg max-w-none text-center',
                isDark ? 'prose-invert' : ''
              )}>
                {displayStoryContent.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className={cn(
                      'leading-relaxed mb-6',
                      isDark ? 'text-white/80' : 'text-gray-600'
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Learn More Link */}
              <div className="text-center mt-8">
                <a
                  href="/about/our-trust"
                  className="group inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all duration-300"
                >
                  Journey Through Time
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          )}

          {/* Milestones Timeline */}
          {showMilestones && milestones.length > 0 && (
            <div
              ref={milestonesRef.ref}
              className={cn(
                'mt-20 max-w-3xl mx-auto transition-all duration-700 delay-500',
                milestonesRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              {/* Milestones Header */}
              <div className="text-center mb-12">
                <h3 className={cn(
                  'font-serif-heading text-3xl sm:text-4xl font-bold',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Key <span className="text-gold-italic">Milestones</span>
                </h3>
              </div>

              {/* Timeline */}
              <div className="timeline-vertical">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="timeline-item"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="timeline-card">
                      <span className="badge-gold text-xs mb-2 inline-block">{milestone.year}</span>
                      <h4 className={cn(
                        'font-semibold text-lg',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        {milestone.title}
                      </h4>
                      {milestone.description && (
                        <p className={cn(
                          'text-sm mt-1',
                          isDark ? 'text-white/60' : 'text-gray-500'
                        )}>
                          {milestone.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Curved Bottom Divider */}
      {showCurve && (
        <CurveDivider position="bottom" color="#fbfbee" />
      )}

      {/* Editor empty state */}
      {isEditing && !isTwoColumn && !showFounder && !showStats && !showStory && (
        <div className="text-center py-12 text-white/50">
          Enable sections in the properties panel to see content
        </div>
      )}
    </section>
  )
}

export default AboutSection
