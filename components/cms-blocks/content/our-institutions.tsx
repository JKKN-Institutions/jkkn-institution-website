'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { Building2 } from 'lucide-react'
import Image from 'next/image'

/**
 * OurInstitutions props schema
 * Simple layout: Title + Large Image + Description Paragraphs
 */
export const OurInstitutionsPropsSchema = z.object({
  // Page Header
  pageTitle: z.string().default('OUR INSTITUTIONS').describe('Main page title'),

  // Main Image
  mainImage: z.string().default('https://jkkn.ac.in/wp-content/uploads/2023/07/JKKN-EI_11zon-1.png').describe('Main institution image URL'),
  mainImageAlt: z.string().default('JKKN Group of Institutions Campus').describe('Image alt text'),

  // Content Paragraphs
  paragraphs: z.array(z.string()).default([
    'At JKKN Institutions, our core teaching objective is to empower students with technical knowledge and essential skills to meet the growing challenges of today\'s competitive world. We implement cutting-edge teaching practices, laying a robust foundation for holistic education.',
    'Our state-of-the-art campus features meticulously designed academic blocks, advanced laboratory facilities, operation centers, knowledge-rich libraries, and comprehensive sports infrastructure. We also provide separate accommodations for boys and girls, as well as general and dental hospitals for healthcare services and practices. Our proactive Placement Cell assures successful placement opportunities for all our students.',
    'With contemporary facilities designed for the continuous enhancement of both students and faculty, we maintain tie-ups with leading manufacturing and commercial enterprises. These connections facilitate valuable industrial and corporate exposure, aligning our educational experiences with real-world applications.',
    'Situated at Komarapalayam, just 15 km from Erode City in Tamil Nadu, India, we are easily accessible via Erode railway station and Salem/Coimbatore airports.',
    'JKKN Institutions are home to some of the region\'s leading institutes of higher learning. We foster a culture that emphasises commitment, transparency, and teamwork. Our continuing success is marked by our reputation as a knowledge center, generating and nurturing exceptional levels of opportunity and initiative.',
  ]).describe('Content paragraphs'),

  // Why JKKN Section
  whyJkknTitle: z.string().default('Why JKKN?').describe('Why JKKN section title'),
  whyJkknContent: z.string().default('At JKKN, we stand at the forefront of educational transformation as an "AI Empowered Institution." We believe in a future where artificial intelligence is not merely a subject to be studied, but a dynamic tool that enhances every facet of our students\' educational journey. We are unique in our approach to integrating AI across disciplines, preparing students to excel in a digitized world. Our commitment to AI extends into every corner of JKKN, where AI empowers events, vital day celebrations, and projects, fostering an environment where technology celebrates tradition and enriches learning. As a JKKN student, you are not just receiving an education; you are being equipped with a toolkit for the future. We nurture thinkers, innovators, and leaders who are ready to take on the challenges of tomorrow. Choosing JKKN means choosing a path where education meets aspiration, and where you can confidently step into a world where AI empowers every ambition.').describe('Why JKKN content'),

  // Styling
  backgroundColor: z.string().default('#0b6d41').describe('Primary background color'),
  accentColor: z.string().default('#ffde59').describe('Accent color (gold/yellow)'),
  textColor: z.string().default('#ffffff').describe('Text color'),
})

export type OurInstitutionsProps = z.infer<typeof OurInstitutionsPropsSchema> & BaseBlockProps

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
 * OurInstitutions Component - Modern Design
 *
 * Simple, elegant institutions page with:
 * - Full-page gradient background (brand green)
 * - Title at top
 * - Large panoramic institution image
 * - Description paragraphs
 * - "Why JKKN?" section
 * - Scroll animations
 */
export function OurInstitutions({
  pageTitle = 'OUR INSTITUTIONS',
  mainImage = 'https://jkkn.ac.in/wp-content/uploads/2023/07/JKKN-EI_11zon-1.png',
  mainImageAlt = 'JKKN Group of Institutions Campus',
  paragraphs = [],
  whyJkknTitle = 'Why JKKN?',
  whyJkknContent = '',
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff',
  className,
}: OurInstitutionsProps) {
  const headerRef = useInView()
  const imageRef = useInView()
  const contentRef = useInView()
  const whyRef = useInView()

  const defaultParagraphs = [
    'At JKKN Institutions, our core teaching objective is to empower students with technical knowledge and essential skills to meet the growing challenges of today\'s competitive world. We implement cutting-edge teaching practices, laying a robust foundation for holistic education.',
    'Our state-of-the-art campus features meticulously designed academic blocks, advanced laboratory facilities, operation centers, knowledge-rich libraries, and comprehensive sports infrastructure. We also provide separate accommodations for boys and girls, as well as general and dental hospitals for healthcare services and practices. Our proactive Placement Cell assures successful placement opportunities for all our students.',
    'With contemporary facilities designed for the continuous enhancement of both students and faculty, we maintain tie-ups with leading manufacturing and commercial enterprises. These connections facilitate valuable industrial and corporate exposure, aligning our educational experiences with real-world applications.',
    'Situated at Komarapalayam, just 15 km from Erode City in Tamil Nadu, India, we are easily accessible via Erode railway station and Salem/Coimbatore airports.',
    'JKKN Institutions are home to some of the region\'s leading institutes of higher learning. We foster a culture that emphasises commitment, transparency, and teamwork. Our continuing success is marked by our reputation as a knowledge center, generating and nurturing exceptional levels of opportunity and initiative.',
  ]

  const defaultWhyContent = 'At JKKN, we stand at the forefront of educational transformation as an "AI Empowered Institution." We believe in a future where artificial intelligence is not merely a subject to be studied, but a dynamic tool that enhances every facet of our students\' educational journey. We are unique in our approach to integrating AI across disciplines, preparing students to excel in a digitized world. Our commitment to AI extends into every corner of JKKN, where AI empowers events, vital day celebrations, and projects, fostering an environment where technology celebrates tradition and enriches learning. As a JKKN student, you are not just receiving an education; you are being equipped with a toolkit for the future. We nurture thinkers, innovators, and leaders who are ready to take on the challenges of tomorrow. Choosing JKKN means choosing a path where education meets aspiration, and where you can confidently step into a world where AI empowers every ambition.'

  const displayParagraphs = paragraphs.length > 0 ? paragraphs : defaultParagraphs
  const displayWhyContent = whyJkknContent || defaultWhyContent

  return (
    <div
      className={cn('w-full min-h-screen relative overflow-hidden', className)}
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #064d2e 50%, #032818 100%)`
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div
          className="absolute top-40 left-20 w-96 h-96 rounded-full opacity-10 animate-[float_12s_ease-in-out_infinite]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-5 animate-[float_10s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-5 animate-[float_14s_ease-in-out_infinite]"
          style={{ backgroundColor: textColor }}
        />

        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${textColor} 0, ${textColor} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">

        {/* Page Title */}
        <div
          ref={headerRef.ref}
          className={cn(
            "mb-10 md:mb-12 transition-all duration-1000",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide"
            style={{ color: textColor }}
          >
            {pageTitle}
          </h1>

          {/* Decorative line */}
          <div
            className="w-32 h-1 mt-6 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Main Institution Image */}
        <div
          ref={imageRef.ref}
          className={cn(
            "relative mb-12 md:mb-16 transition-all duration-1000 delay-200",
            imageRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={mainImageAlt}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}30` }}
              >
                <Building2 className="w-24 h-24" style={{ color: accentColor }} />
              </div>
            )}

            {/* Subtle gradient overlay at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/4"
              style={{
                background: `linear-gradient(to top, ${backgroundColor}80, transparent)`
              }}
            />
          </div>

          {/* Decorative frame effect */}
          <div
            className="absolute -inset-2 rounded-2xl opacity-20 -z-10"
            style={{
              border: `3px solid ${accentColor}`,
              transform: 'translate(8px, 8px)'
            }}
          />
        </div>

        {/* Content Paragraphs */}
        <div
          ref={contentRef.ref}
          className={cn(
            "space-y-6 mb-12 md:mb-16 transition-all duration-1000 delay-300",
            contentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {displayParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base md:text-lg leading-relaxed text-justify"
              style={{ color: `${textColor}dd` }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Why JKKN Section */}
        {(whyJkknTitle || displayWhyContent) && (
          <div
            ref={whyRef.ref}
            className={cn(
              "relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/20 transition-all duration-1000 delay-400",
              whyRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            {/* Decorative accent */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: accentColor }}
            />

            <div className="relative z-10">
              {whyJkknTitle && (
                <h2
                  className="text-2xl md:text-3xl font-bold mb-6"
                  style={{ color: accentColor }}
                >
                  {whyJkknTitle}
                </h2>
              )}

              {displayWhyContent && (
                <p
                  className="text-base md:text-lg leading-relaxed text-justify"
                  style={{ color: `${textColor}dd` }}
                >
                  {displayWhyContent}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Keyframe Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

export default OurInstitutions
