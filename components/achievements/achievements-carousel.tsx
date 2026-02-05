'use client'

/**
 * Achievements Carousel Component
 *
 * Auto-scrolling carousel displaying faculty and student achievements.
 * Features:
 * - Auto-play with pause on hover
 * - Navigation dots
 * - Previous/Next buttons
 * - Responsive design
 * - Category badges with colors
 * - Markdown description support
 */

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight, Calendar, User, Award, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type {
  FacultyAchievementWithRelations,
  StudentAchievementWithRelations,
} from '@/types/achievements'

type Achievement = FacultyAchievementWithRelations | StudentAchievementWithRelations

interface AchievementsCarouselProps {
  achievements: Achievement[]
  type: 'faculty' | 'student'
  autoplayDelay?: number
}

export function AchievementsCarousel({
  achievements,
  type,
  autoplayDelay = 5000,
}: AchievementsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
    },
    [Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (achievements.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Award className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No achievements found
        </h3>
        <p className="text-gray-600">
          No {type} achievements available. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="relative px-2 sm:px-8 lg:px-12">
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex -mx-2 sm:-mx-3 items-stretch">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 px-2 sm:px-3 flex"
            >
              <AchievementCarouselCard achievement={achievement} type={type} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {achievements.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-4 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous achievement"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-4 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next achievement"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {achievements.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'w-8 bg-[#0b6d41]'
                  : 'w-2 bg-gray-300 hover:bg-[#0b6d41]/50'
              }`}
              aria-label={`Go to achievement ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface AchievementCarouselCardProps {
  achievement: Achievement
  type: 'faculty' | 'student'
}

function AchievementCarouselCard({ achievement, type }: AchievementCarouselCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isFaculty = type === 'faculty'
  const faculty = isFaculty ? (achievement as FacultyAchievementWithRelations) : null
  const student = !isFaculty ? (achievement as StudentAchievementWithRelations) : null

  return (
    <article className={`w-full group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col ${isExpanded ? 'h-auto min-h-[350px] sm:min-h-[400px]' : 'h-[350px] sm:h-[400px]'}`}>
      {/* Featured Badge */}
      {achievement.is_featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-semibold rounded-full shadow-md">
            <Award className="h-3 w-3" />
            Featured
          </span>
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 overflow-hidden">
        {/* Category Badge */}
        {achievement.category && (
          <div>
            <span
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full shadow-sm"
              style={{
                backgroundColor: `${achievement.category.color}20`,
                color: achievement.category.color,
                border: `1px solid ${achievement.category.color}40`,
              }}
            >
              {achievement.category.icon && (
                <span className="text-sm sm:text-base">{achievement.category.icon}</span>
              )}
              {achievement.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#171717] group-hover:text-[#0b6d41] transition-colors line-clamp-2 sm:line-clamp-3">
          {achievement.title}
        </h3>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
          {/* Person */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="font-medium truncate max-w-[150px] sm:max-w-none">
              {isFaculty ? faculty?.faculty_name : student?.student_name}
            </span>
          </div>

          {/* Date */}
          {achievement.achievement_date && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>
                {new Date(achievement.achievement_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          )}
        </div>

        {/* Designation or Roll Number */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-500">
          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {isFaculty
              ? (faculty?.faculty_designation || 'Faculty')
              : (student?.student_roll_number || 'Student')}
          </span>
        </div>

        {/* Course Badge */}
        {achievement.course && (
          <div>
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-md shadow-sm">
              {achievement.course.code}
            </span>
          </div>
        )}

        {/* Description (Markdown) */}
        <div className={`prose prose-sm max-w-none text-gray-700 text-xs sm:text-sm ${isExpanded ? '' : 'line-clamp-2 sm:line-clamp-3'}`}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-1">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">{children}</strong>
              ),
              ul: ({ children }) => isExpanded ? <ul className="list-disc list-inside space-y-1">{children}</ul> : null,
              ol: ({ children }) => isExpanded ? <ol className="list-decimal list-inside space-y-1">{children}</ol> : null,
              a: ({ children, href }) => isExpanded ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0b6d41] hover:underline hover:text-[#085032]"
                >
                  {children}
                </a>
              ) : null,
            }}
          >
            {achievement.description}
          </ReactMarkdown>
        </div>
      </div>

      {/* Learn More / Show Less Button */}
      <div className="px-4 sm:px-6 pb-3 sm:pb-4 mt-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#0b6d41] hover:text-[#085032] transition-colors group/button"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 group-hover/button:translate-y-[-2px] transition-transform" />
            </>
          ) : (
            <>
              <span>Learn More</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 group-hover/button:translate-y-[2px] transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#0b6d41]/30 rounded-lg pointer-events-none transition-colors"></div>
    </article>
  )
}
