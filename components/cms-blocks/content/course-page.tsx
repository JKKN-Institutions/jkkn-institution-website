'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useEffect, useRef, useState } from 'react'
import { GraduationCap, BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'

/**
 * Course Category schema (Undergraduate/Postgraduate)
 */
export const CourseCategorySchema = z.object({
  title: z.string().describe('Category title (e.g., Undergraduate, Postgraduate)'),
  courses: z.array(z.object({
    name: z.string().describe('Course name'),
    duration: z.string().describe('Course duration'),
    specializations: z.array(z.string()).optional().describe('List of specializations'),
  })).describe('List of courses in this category'),
})

export type CourseCategory = z.infer<typeof CourseCategorySchema>

/**
 * CoursePage props schema
 */
export const CoursePagePropsSchema = z.object({
  // Header
  collegeTitle: z.string().default('JKKN College').describe('College/Department title'),
  description: z.string().default('').describe('Description paragraph about the college'),

  // Course Categories
  categories: z.array(CourseCategorySchema).default([]).describe('Course categories (Undergraduate, Postgraduate, etc.)'),

  // Styling
  backgroundColor: z.string().default('#0b6d41').describe('Primary background color'),
  accentColor: z.string().default('#ffde59').describe('Accent color (gold/yellow)'),
  textColor: z.string().default('#ffffff').describe('Text color'),
})

export type CoursePageProps = z.infer<typeof CoursePagePropsSchema> & BaseBlockProps

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
 * Course Category Card Component
 */
function CategoryCard({
  category,
  index,
  accentColor,
  textColor,
  isInView,
}: {
  category: CourseCategory
  index: number
  accentColor: string
  textColor: string
  isInView: boolean
}) {
  return (
    <div
      className={cn(
        "relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20 transition-all duration-700",
        "hover:bg-white/15 hover:shadow-2xl hover:shadow-black/20",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Decorative accent */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10">
        {/* Category Title */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}25` }}
          >
            <GraduationCap className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <h3
            className="text-2xl md:text-3xl font-bold"
            style={{ color: textColor }}
          >
            {category.title}
          </h3>
        </div>

        {/* Courses */}
        <div className="space-y-6">
          {category.courses.map((course, courseIndex) => (
            <div key={courseIndex} className="space-y-3">
              {/* Course Name */}
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: accentColor }} />
                <h4
                  className="text-lg md:text-xl font-semibold"
                  style={{ color: textColor }}
                >
                  {course.name}
                </h4>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 ml-8">
                <Clock className="w-4 h-4" style={{ color: `${textColor}99` }} />
                <span
                  className="text-sm md:text-base"
                  style={{ color: `${textColor}cc` }}
                >
                  {course.duration}
                </span>
              </div>

              {/* Specializations */}
              {course.specializations && course.specializations.length > 0 && (
                <ul className="ml-8 mt-3 space-y-2">
                  {course.specializations.map((spec, specIndex) => (
                    <li
                      key={specIndex}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: accentColor }}
                      />
                      <span
                        className="text-sm md:text-base"
                        style={{ color: `${textColor}dd` }}
                      >
                        {spec}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * CoursePage Component - Modern Design
 *
 * Course detail page with:
 * - Full-page gradient background (brand green)
 * - College/Department title
 * - Description paragraph
 * - Course categories in cards (Undergraduate/Postgraduate)
 * - Specializations list
 * - Scroll animations
 */
export function CoursePage({
  id,
  collegeTitle = 'JKKN College',
  description = '',
  categories = [],
  backgroundColor = '#0b6d41',
  accentColor = '#ffde59',
  textColor = '#ffffff',
  className,
  isEditing,
}: CoursePageProps) {
  // Sanitize collegeTitle - support both plain text (backward compatibility) and HTML
  let sanitizedTitle = ''

  if (!collegeTitle || collegeTitle === '<p></p>' || collegeTitle.trim() === '') {
    // Empty or just empty paragraph → use default
    sanitizedTitle = '<span>JKKN College</span>'
  } else if (collegeTitle.includes('<')) {
    // Already contains HTML tags → sanitize as-is
    sanitizedTitle = DOMPurify.sanitize(collegeTitle)
  } else {
    // Plain text → wrap in span (backward compatibility)
    sanitizedTitle = `<span>${DOMPurify.sanitize(collegeTitle)}</span>`
  }

  // Sanitize description - support both plain text and HTML
  let sanitizedDescription = ''

  if (!description || description === '<p></p>' || description.trim() === '') {
    // Empty or just empty paragraph → leave empty
    sanitizedDescription = ''
  } else if (description.includes('<')) {
    // Already contains HTML tags → sanitize as-is
    sanitizedDescription = DOMPurify.sanitize(description)
  } else {
    // Plain text → sanitize as-is (no wrapping needed)
    sanitizedDescription = DOMPurify.sanitize(description)
  }

  const headerRef = useInView()
  const descriptionRef = useInView()
  const categoriesRef = useInView()

  const defaultCategories: CourseCategory[] = [
    {
      title: 'Undergraduate',
      courses: [
        {
          name: 'Bachelor of Dental Surgery (BDS)',
          duration: '4 years + 1 year Internship',
          specializations: [],
        },
      ],
    },
    {
      title: 'Postgraduate',
      courses: [
        {
          name: 'Master of Dental Surgery (MDS)',
          duration: '3 years',
          specializations: [
            'Prosthodontics Crown and Bridge',
            'Conservative Dentistry and Endodontics',
            'Periodontics',
            'Orthodontics and Dentofacial Orthopedics',
          ],
        },
      ],
    },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

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

        {/* College Title */}
        <div
          ref={headerRef.ref}
          className={cn(
            "mb-8 md:mb-10 transition-all duration-1000",
            headerRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          {isEditing && id ? (
            <RichTextInlineEditor
              blockId={id}
              propName="collegeTitle"
              value={collegeTitle}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
              placeholder="Enter college title..."
            />
          ) : (
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
              style={{ color: textColor }}
              dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
            />
          )}

          {/* Decorative line */}
          <div
            className="w-32 h-1 mt-6 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* Description */}
        {(description || (isEditing && id)) && (
          <div
            ref={descriptionRef.ref}
            className={cn(
              "mb-12 md:mb-16 transition-all duration-1000 delay-200",
              descriptionRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            {isEditing && id ? (
              <RichTextInlineEditor
                blockId={id}
                propName="description"
                value={description}
                className="text-base md:text-lg leading-relaxed text-justify max-w-4xl"
                placeholder="Enter description..."
              />
            ) : (
              <div
                className="text-base md:text-lg leading-relaxed text-justify max-w-4xl prose prose-lg"
                style={{ color: `${textColor}dd` }}
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
            )}
          </div>
        )}

        {/* Course Categories */}
        <div
          ref={categoriesRef.ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
        >
          {displayCategories.map((category, index) => (
            <CategoryCard
              key={index}
              category={category}
              index={index}
              accentColor={accentColor}
              textColor={textColor}
              isInView={categoriesRef.isInView}
            />
          ))}
        </div>
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

export default CoursePage
