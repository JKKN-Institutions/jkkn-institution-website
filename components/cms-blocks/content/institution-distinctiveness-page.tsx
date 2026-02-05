'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Users,
  Heart,
  Target,
  Award,
  Building2,
} from 'lucide-react'
import { iconMapper } from '@/lib/utils/icon-mapper'

/**
 * Content section schema
 */
export const DistinctivenessSectionSchema = z.object({
  id: z.string().describe('Unique section ID'),
  title: z.string().describe('Section title'),
  icon: z.string().default('BookOpen').describe('Lucide icon name'),
  content: z.string().describe('Section content (markdown/HTML supported)'),
})

export type DistinctivenessSection = z.infer<typeof DistinctivenessSectionSchema>

/**
 * InstitutionDistinctivenessPage props schema
 */
export const InstitutionDistinctivenessPagePropsSchema = z.object({
  // Hero Section
  heroTitle: z.string().default('Institution Distinctiveness').describe('Main page heading'),
  heroSubtitle: z.string().default('').describe('Subtitle below main title'),

  // Introduction
  showIntroduction: z.boolean().default(true).describe('Show introduction section'),
  introductionHeading: z.string().default('Institution Distinctiveness').describe('Introduction heading'),
  introductionContent: z.string().default('').describe('Introduction paragraph'),

  // Highlight Box (J.K.K.N.)
  showHighlightBox: z.boolean().default(true).describe('Show highlight box'),
  highlightTitle: z.string().default('J.K.K.N.').describe('Highlight box title'),
  highlightSubtitle: z.string().default('').describe('Highlight box subtitle'),
  highlightContent: z.string().default('').describe('Highlight box content'),

  // Content Sections
  sections: z.array(DistinctivenessSectionSchema).default([
    {
      id: 'efficiency-programmes',
      title: 'Efficiency of the Programmes',
      icon: 'GraduationCap',
      content: '',
    },
    {
      id: 'harmonizing-learning',
      title: 'Harmonizing Curricular with Extracurricular Learning Experiences',
      icon: 'BookOpen',
      content: '',
    },
    {
      id: 'career-advancement',
      title: 'Assisting with Career Advancement Pathway',
      icon: 'TrendingUp',
      content: '',
    },
    {
      id: 'entrepreneur-ambitions',
      title: 'Enriching Entrepreneur Ambitions through IIC',
      icon: 'Lightbulb',
      content: '',
    },
    {
      id: 'civic-responsibility',
      title: 'Strengthening Civic Responsibility',
      icon: 'Users',
      content: '',
    },
    {
      id: 'social-responsibility',
      title: 'Empowering Social Responsibility',
      icon: 'Heart',
      content: '',
    },
  ]).describe('Content sections with icons'),

  // Footer
  showFooter: z.boolean().default(true).describe('Show footer section'),
  institutionName: z.string().default('').describe('Institution name'),
  address: z.string().default('').describe('Institution address'),
  phone: z.string().default('').describe('Contact phone'),
  email: z.string().default('').describe('Contact email'),
  website: z.string().default('').describe('Website URL'),

  // Styling
  backgroundColor: z.string().default('#fbfbee').describe('Page background color'),
  primaryColor: z.string().default('#0b6d41').describe('Primary color (green)'),
  accentColor: z.string().default('#ffde59').describe('Accent color (gold)'),
  textColor: z.string().default('#333333').describe('Text color'),
})

export type InstitutionDistinctivenessPageProps = z.infer<typeof InstitutionDistinctivenessPagePropsSchema> & BaseBlockProps

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
 * Institution Distinctiveness Page Component
 *
 * Displays the unique features and distinctive qualities of the institution
 * with sections for various aspects like programmes, entrepreneurship, social responsibility, etc.
 */
export function InstitutionDistinctivenessPage(props: InstitutionDistinctivenessPageProps) {
  const {
    heroTitle,
    heroSubtitle,
    showIntroduction,
    introductionHeading,
    introductionContent,
    showHighlightBox,
    highlightTitle,
    highlightSubtitle,
    highlightContent,
    sections,
    showFooter,
    institutionName,
    address,
    phone,
    email,
    website,
    backgroundColor,
    primaryColor,
    accentColor,
    textColor,
    className,
  } = props

  const heroRef = useInView()
  const introRef = useInView()
  const highlightRef = useInView()
  const sectionsRef = useInView(0.05)
  const footerRef = useInView()

  return (
    <div
      className={cn('min-h-screen w-full', className)}
      style={{ backgroundColor }}
    >
      {/* Hero Section */}
      <div
        ref={heroRef.ref}
        className={cn(
          'relative py-16 md:py-24 transition-all duration-1000',
          heroRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: primaryColor }}
            >
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p
                className="text-xl md:text-2xl font-medium"
                style={{ color: textColor }}
              >
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      {showIntroduction && introductionContent && (
        <div
          ref={introRef.ref}
          className={cn(
            'py-12 transition-all duration-1000',
            introRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
              {introductionHeading && (
                <h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: primaryColor }}
                >
                  {introductionHeading}
                </h2>
              )}
              <p
                className="text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                style={{ color: textColor, lineHeight: '1.8' }}
              >
                {introductionContent}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Highlight Box (J.K.K.N.) */}
      {showHighlightBox && highlightContent && (
        <div
          ref={highlightRef.ref}
          className={cn(
            'py-12 transition-all duration-1000',
            highlightRef.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div
              className="relative rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
              }}
            >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="w-12 h-12 text-white" />
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      {highlightTitle}
                    </h3>
                    {highlightSubtitle && (
                      <p className="text-lg md:text-xl text-white/90 mt-1">
                        {highlightSubtitle}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-base md:text-lg text-white/95 leading-relaxed whitespace-pre-wrap">
                  {highlightContent}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div
        ref={sectionsRef.ref}
        className="py-12"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = iconMapper(section.icon)

              return (
                <div
                  key={section.id}
                  className={cn(
                    'transition-all duration-700',
                    sectionsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Section Header */}
                  <div
                    className="flex items-center gap-4 p-6 rounded-xl mb-6"
                    style={{ backgroundColor: `${primaryColor}1a` }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h2
                      className="text-2xl md:text-3xl font-semibold"
                      style={{ color: textColor }}
                    >
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Content */}
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 md:p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div
                      className="prose prose-lg max-w-none"
                      style={{ color: textColor }}
                    >
                      <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      {showFooter && institutionName && (
        <div
          ref={footerRef.ref}
          className={cn(
            'py-12 mt-12 border-t-2 transition-all duration-1000',
            footerRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
          style={{ borderColor: `${primaryColor}40` }}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="flex items-start gap-6 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{ color: primaryColor }}
                  >
                    {institutionName}
                  </h3>
                  {address && (
                    <p className="text-base md:text-lg mb-4" style={{ color: textColor }}>
                      {address}
                    </p>
                  )}
                  <div className="space-y-2">
                    {phone && (
                      <p className="text-base md:text-lg" style={{ color: textColor }}>
                        <span className="font-semibold">Phone:</span> {phone}
                      </p>
                    )}
                    {email && (
                      <p className="text-base md:text-lg" style={{ color: textColor }}>
                        <span className="font-semibold">Email:</span>{' '}
                        <a
                          href={`mailto:${email}`}
                          className="hover:underline"
                          style={{ color: primaryColor }}
                        >
                          {email}
                        </a>
                      </p>
                    )}
                    {website && (
                      <p className="text-base md:text-lg" style={{ color: textColor }}>
                        <span className="font-semibold">Website:</span>{' '}
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          style={{ color: primaryColor }}
                        >
                          {website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstitutionDistinctivenessPage
