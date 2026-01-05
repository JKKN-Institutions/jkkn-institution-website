'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { DecorativePatterns } from '../shared/decorative-patterns'
import * as LucideIcons from 'lucide-react'
import { GraduationCap, ChevronRight } from 'lucide-react'

/**
 * Course item schema
 */
export const CourseItemSchema = z.object({
  name: z.string().describe('Course name'),
  icon: z.string().default('GraduationCap').describe('Lucide icon name'),
  link: z.string().optional().describe('Link to course details page'),
  description: z.string().optional().describe('Short course description'),
  headerColor: z.string().optional().describe('Optional header accent color'),
})

export type CourseItem = z.infer<typeof CourseItemSchema>

/**
 * OurCoursesSection props schema
 */
export const OurCoursesSectionPropsSchema = z.object({
  // Header
  showHeader: z.boolean().default(true).describe('Show section header'),
  headerPart1: z.string().default('OUR').describe('First part of header'),
  headerPart2: z.string().default('COURSES').describe('Second part of header'),
  headerPart1Color: z.string().default('#0b6d41').describe('Color for first part of header'),
  headerPart2Color: z.string().default('#0b6d41').describe('Color for second part of header'),

  // Courses
  courses: z.array(CourseItemSchema).default([]).describe('List of courses'),

  // Layout
  layout: z.enum(['grid', 'flex', 'carousel']).default('flex').describe('Layout style'),
  columns: z.enum(['2', '3', '4']).default('3').describe('Number of columns for grid layout'),

  // Styling
  variant: z.enum(['modern-dark', 'modern-light', 'classic']).default('modern-light').describe('Visual style'),
  showDecorations: z.boolean().default(true).describe('Show decorative patterns'),
  showAnimations: z.boolean().default(true).describe('Enable scroll animations'),

  // Card options
  cardStyle: z.enum(['compact', 'detailed', 'icon-only']).default('compact').describe('Card display style'),
  showArrow: z.boolean().default(true).describe('Show arrow indicator on cards'),
})

export type OurCoursesSectionProps = z.infer<typeof OurCoursesSectionPropsSchema> & BaseBlockProps

// Grid column classes
const gridColClasses = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Get Lucide icon component by name
function getIconComponent(iconName: string): React.ComponentType<{ className?: string; style?: React.CSSProperties }> {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName]
  return IconComponent || GraduationCap
}

// Intersection Observer hook for scroll animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Animation delay calculation for staggered animations
function getStaggerDelay(index: number, baseDelay = 100): string {
  return `${index * baseDelay}ms`
}

/**
 * OurCoursesSection Component
 *
 * Displays available courses in a compact card format with icons.
 * Supports grid, flex, and carousel layouts.
 */
export function OurCoursesSection({
  showHeader = true,
  headerPart1 = 'OUR',
  headerPart2 = 'COURSES',
  headerPart1Color = '#0b6d41',
  headerPart2Color = '#0b6d41',
  courses = [],
  layout = 'flex',
  columns = '3',
  variant = 'modern-light',
  showDecorations = true,
  showAnimations = true,
  cardStyle = 'compact',
  showArrow = true,
  className,
  isEditing,
}: OurCoursesSectionProps) {
  const sectionRef = useInView()
  const cardsRef = useInView()

  const isDark = variant === 'modern-dark'
  const isModern = variant !== 'classic'

  // Default courses for pharmacy
  const defaultCourses: CourseItem[] = [
    { name: 'BACHELOR OF PHARMACY', icon: 'GraduationCap', link: '/courses/b-pharm' },
    { name: 'MASTER OF PHARMACY (5 SPECIALIZATION)', icon: 'Award', link: '/courses/m-pharm' },
    { name: 'PHARM.D (POST-BACCALAUREATE)', icon: 'FlaskConical', link: '/courses/pharm-d' },
  ]

  const displayCourses = courses.length > 0 ? courses : defaultCourses

  // Empty state for editing
  if (displayCourses.length === 0 && isEditing) {
    return (
      <section className={cn('py-12 px-4', isDark ? 'bg-brand-primary' : 'bg-brand-cream', className)}>
        <div className="container mx-auto max-w-6xl">
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-center">Click to add courses</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef.ref}
      className={cn(
        'relative py-10 md:py-16 overflow-hidden',
        isDark ? 'section-green-gradient' : 'bg-brand-cream',
        className
      )}
    >
      {/* Decorative Patterns */}
      {showDecorations && isModern && (
        <DecorativePatterns variant="minimal" color={isDark ? 'white' : 'green'} />
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {showHeader && (
          <div
            className={cn(
              'flex items-center justify-center mb-8 md:mb-12',
              showAnimations && 'transition-all duration-700',
              showAnimations && (sectionRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center mr-3',
                isDark ? 'bg-white/10' : 'bg-brand-primary/10'
              )}
            >
              <GraduationCap className={cn('w-5 h-5', isDark ? 'text-white' : 'text-brand-primary')} />
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              <span style={{ color: headerPart1Color }}>{headerPart1}</span>{' '}
              <span style={{ color: headerPart2Color }}>{headerPart2}</span>
            </h2>
          </div>
        )}

        {/* Courses Display */}
        <div
          ref={cardsRef.ref}
          className={cn(
            layout === 'grid' && cn('grid gap-4 md:gap-6', gridColClasses[columns]),
            layout === 'flex' && 'flex flex-wrap justify-center gap-4 md:gap-6',
            layout === 'carousel' && 'flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide'
          )}
        >
          {displayCourses.map((course, index) => {
            const IconComponent = getIconComponent(course.icon)
            const cardContent = (
              <div
                key={index}
                className={cn(
                  // Base styles
                  'group relative overflow-hidden rounded-2xl',
                  // Glassmorphism
                  isDark
                    ? 'bg-white/10 backdrop-blur-[12px] border border-white/20'
                    : 'bg-white/80 backdrop-blur-[12px] border border-gray-200/50',
                  // Hover effects
                  'hover:shadow-xl transition-all duration-300',
                  isDark ? 'hover:bg-white/15 hover:border-white/30' : 'hover:bg-white hover:border-gray-300',
                  // Size based on layout
                  layout === 'flex' && 'w-full sm:w-auto sm:min-w-[280px] sm:max-w-[320px]',
                  layout === 'carousel' && 'flex-shrink-0 w-[280px] snap-start',
                  // Animation
                  showAnimations && 'transition-all duration-700',
                  showAnimations && cardsRef.isInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8',
                  // Cursor
                  course.link && 'cursor-pointer'
                )}
                style={{
                  transitionDelay: showAnimations ? getStaggerDelay(index) : '0ms',
                }}
              >
                {/* Colored top border accent */}
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: course.headerColor || '#0b6d41' }}
                />

                <div className={cn(
                  'p-4 md:p-5',
                  cardStyle === 'detailed' && 'p-5 md:p-6'
                )}>
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                        isDark ? 'bg-white/10' : 'bg-brand-primary/10'
                      )}
                      style={{
                        backgroundColor: `${course.headerColor || '#0b6d41'}20`
                      }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: course.headerColor || '#0b6d41' }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          'font-semibold text-sm md:text-base leading-tight',
                          isDark ? 'text-white' : 'text-gray-900',
                          'group-hover:text-brand-primary transition-colors duration-300'
                        )}
                      >
                        {course.name}
                      </h3>
                      {cardStyle === 'detailed' && course.description && (
                        <p
                          className={cn(
                            'mt-1 text-xs md:text-sm line-clamp-2',
                            isDark ? 'text-white/70' : 'text-gray-600'
                          )}
                        >
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    {showArrow && (
                      <div
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                          'transform group-hover:translate-x-1 transition-transform duration-300',
                          isDark ? 'bg-white/10' : 'bg-gray-100'
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            'w-4 h-4',
                            isDark ? 'text-white' : 'text-gray-600'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )

            // Wrap in Link if link is provided
            if (course.link && !isEditing) {
              return (
                <Link
                  key={index}
                  href={course.link}
                  className={cn(
                    layout === 'flex' && 'w-full sm:w-auto',
                    layout === 'grid' && 'block'
                  )}
                >
                  {cardContent}
                </Link>
              )
            }

            return cardContent
          })}
        </div>
      </div>
    </section>
  )
}

export default OurCoursesSection
