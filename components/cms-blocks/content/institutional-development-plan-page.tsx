'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { Target, CheckCircle2, Users, Phone, BookOpen } from 'lucide-react'

/**
 * InstitutionalDevelopmentPlanPage props schema
 */
export const InstitutionalDevelopmentPlanPagePropsSchema = z.object({
  // Content
  pageTitle: z.string().default('Institutional Development Plan (IDP)').describe('Main page heading'),
  subtitle: z.string().default('Commitment to Academic Excellence and National Educational Goals').describe('Subheading below main title'),
  introduction: z.string().default('').describe('Introduction paragraph about the IDP'),
  vision: z.string().default('').describe('Vision statement'),
  highlights: z.array(z.string()).default([]).describe('List of IDP highlights'),
  alignmentItems: z.array(z.string()).default([]).describe('List of organizations/frameworks aligned with'),
  contactInfo: z.string().default('').describe('Contact information'),

  // Styling
  backgroundColor: z.string().default('#fbfbee').describe('Background color (default: cream)'),
  primaryColor: z.string().default('#0b6d41').describe('Primary color (default: green)'),
  accentColor: z.string().default('#ffde59').describe('Accent color (default: gold)'),
  textColor: z.string().default('#333333').describe('Text color (default: dark gray)'),
})

export type InstitutionalDevelopmentPlanPageProps = z.infer<typeof InstitutionalDevelopmentPlanPagePropsSchema> & BaseBlockProps

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
 * Section Card Component
 */
function SectionCard({
  icon: Icon,
  title,
  content,
  items,
  index,
  primaryColor,
  backgroundColor,
  textColor,
  isInView,
  isListView = false,
}: {
  icon: React.ElementType
  title: string
  content?: string
  items?: string[]
  index: number
  primaryColor: string
  backgroundColor: string
  textColor: string
  isInView: boolean
  isListView?: boolean
}) {
  return (
    <div
      className={cn(
        "transition-all duration-700",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Section Header */}
      <div
        className="flex items-center gap-4 p-6 rounded-xl mb-6"
        style={{ backgroundColor: `${primaryColor}1a` }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor }}
        >
          <Icon className="w-7 h-7" style={{ color: primaryColor }} />
        </div>
        <h2
          className="text-2xl md:text-3xl font-semibold"
          style={{ color: textColor }}
        >
          {title}
        </h2>
      </div>

      {/* Content Card */}
      <div
        className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        style={{
          transitionProperty: 'box-shadow, transform',
        }}
      >
        {content && (
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: textColor, lineHeight: '1.75' }}
          >
            {content}
          </p>
        )}

        {items && items.length > 0 && (
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3"
              >
                {isListView ? (
                  <>
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: primaryColor }}
                    />
                    <span
                      className="text-base md:text-lg leading-relaxed"
                      style={{ color: textColor }}
                    >
                      {item}
                    </span>
                  </>
                ) : (
                  <>
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span
                      className="text-base md:text-lg leading-relaxed"
                      style={{ color: textColor }}
                    >
                      {item}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/**
 * InstitutionalDevelopmentPlanPage Component
 *
 * Dedicated page component for displaying Institutional Development Plan with:
 * - Modern card-based layout
 * - Section organization (Vision, Highlights, Alignment, Contact)
 * - Icons in circular backgrounds
 * - Scroll animations
 * - Responsive design
 */
export function InstitutionalDevelopmentPlanPage({
  pageTitle = 'Institutional Development Plan (IDP)',
  subtitle = 'Commitment to Academic Excellence and National Educational Goals',
  introduction = '',
  vision = '',
  highlights = [],
  alignmentItems = [],
  contactInfo = '',
  backgroundColor = '#fbfbee',
  primaryColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#333333',
  className,
}: InstitutionalDevelopmentPlanPageProps) {
  const headerRef = useInView()
  const introRef = useInView()
  const visionRef = useInView()
  const highlightsRef = useInView()
  const alignmentRef = useInView()
  const contactRef = useInView()

  // Default content if not provided
  const defaultIntroduction = introduction || "At JKKN Dental College and Hospital, we are deeply committed to holistic institutional growth guided by the University Grants Commission (UGC) framework for Institutional Development Plans (IDPs). Our IDP is designed to reflect the principles of NEP 2020, ensuring academic innovation, community engagement, digital transformation, and sustainable development."

  const defaultVision = vision || '"To be a Leading Global Innovative Solution Provider for the Ever-Changing Needs of Society."'

  const defaultHighlights = highlights.length > 0 ? highlights : [
    "Strategic goals focused on academic excellence, research, community health, and financial sustainability.",
    "Robust faculty development and interdisciplinary learning initiatives.",
    "Comprehensive community engagement through dental camps and outreach programs.",
    "Integration of digital technologies in learning and administration.",
    "Environmentally responsible infrastructure upgrades with green campus initiatives."
  ]

  const defaultAlignmentItems = alignmentItems.length > 0 ? alignmentItems : [
    "University Grants Commission (UGC)",
    "Dental Council of India (DCI)",
    "Tamil Nadu Dr. M.G.R. Medical University",
    "National Education Policy 2020 (NEP)",
    "NAAC Accreditation Framework"
  ]

  const defaultContactInfo = contactInfo || "For queries related to the Institutional Development Plan, please contact:\nEmail: dental@jkkn.ac.in\nPhone: +91 93458 55001\nOffice: Principal's Office, JKKN Dental College and Hospital"

  return (
    <div
      className={cn('w-full min-h-screen relative', className)}
      style={{ backgroundColor }}
    >
      {/* Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* Page Header */}
        <div
          ref={headerRef.ref}
          className={cn(
            "mb-8 md:mb-12 transition-all duration-1000",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {pageTitle}
          </h1>

          {/* Decorative underline */}
          <div
            className="w-48 md:w-64 h-1 rounded-full mb-6"
            style={{ backgroundColor: primaryColor }}
          />

          <h2
            className="text-xl md:text-2xl font-semibold"
            style={{ color: textColor }}
          >
            {subtitle}
          </h2>
        </div>

        {/* Introduction */}
        <div
          ref={introRef.ref}
          className={cn(
            "mb-12 transition-all duration-700 delay-200",
            introRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <p
              className="text-base md:text-lg leading-relaxed text-justify"
              style={{ color: textColor, lineHeight: '1.75' }}
            >
              {defaultIntroduction}
            </p>
          </div>
        </div>

        {/* Vision Section */}
        <div ref={visionRef.ref} className="mb-12">
          <SectionCard
            icon={Target}
            title="Our Vision"
            content={defaultVision}
            index={0}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            isInView={visionRef.isInView}
          />
        </div>

        {/* Highlights Section */}
        <div ref={highlightsRef.ref} className="mb-12">
          <SectionCard
            icon={CheckCircle2}
            title="Highlights of JKKN IDP"
            items={defaultHighlights}
            index={1}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            isInView={highlightsRef.isInView}
            isListView={true}
          />
        </div>

        {/* Alignment Section */}
        <div ref={alignmentRef.ref} className="mb-12">
          <SectionCard
            icon={Users}
            title="In Alignment With"
            items={defaultAlignmentItems}
            index={2}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            isInView={alignmentRef.isInView}
          />
        </div>

        {/* Contact Section */}
        <div ref={contactRef.ref}>
          <SectionCard
            icon={Phone}
            title="Contact for More Information"
            content={defaultContactInfo}
            index={3}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            isInView={contactRef.isInView}
          />
        </div>
      </div>
    </div>
  )
}

export default InstitutionalDevelopmentPlanPage
