'use client'

/**
 * Achievement List Component
 *
 * Displays a list of achievements (faculty or student) with:
 * - Loading states
 * - Empty states
 * - Markdown rendering
 * - Category badges
 * - Responsive design
 */

import { useEffect, useState } from 'react'
import { Calendar, User, Award, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type {
  FacultyAchievementWithRelations,
  StudentAchievementWithRelations,
  AchievementFilters,
} from '@/types/achievements'

interface AchievementListProps {
  type: 'faculty' | 'student'
  filters: AchievementFilters
  isFeatured?: boolean
}

export function AchievementList({
  type,
  filters,
  isFeatured = false,
}: AchievementListProps) {
  const [achievements, setAchievements] = useState<
    (FacultyAchievementWithRelations | StudentAchievementWithRelations)[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true)
      setError(null)

      try {
        // Build query params
        const params = new URLSearchParams()
        if (isFeatured) params.set('featured', 'true')
        if (filters.courseId) params.set('courseId', filters.courseId)
        if (filters.categoryId) params.set('categoryId', filters.categoryId)
        if (filters.year) params.set('year', filters.year.toString())
        if (filters.search) params.set('search', filters.search)

        const response = await fetch(
          `/api/achievements/${type}?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch achievements')
        }

        const data = await response.json()
        setAchievements(data)
      } catch (err) {
        console.error('Error fetching achievements:', err)
        setError('Failed to load achievements. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [type, filters, isFeatured])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-lg shadow-sm p-6 space-y-3"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

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
          {isFeatured
            ? `No featured ${type} achievements yet. Check back soon!`
            : `No ${type} achievements match your filters. Try adjusting your search.`}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          type={type}
        />
      ))}
    </div>
  )
}

interface AchievementCardProps {
  achievement: FacultyAchievementWithRelations | StudentAchievementWithRelations
  type: 'faculty' | 'student'
}

function AchievementCard({ achievement, type }: AchievementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isFaculty = type === 'faculty'
  const faculty = isFaculty ? (achievement as FacultyAchievementWithRelations) : null
  const student = !isFaculty ? (achievement as StudentAchievementWithRelations) : null

  return (
    <article className={`w-full group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 flex flex-col ${isExpanded ? 'h-auto min-h-[350px] sm:min-h-[400px]' : 'h-[350px] sm:h-[400px]'}`}>
      {/* Featured Badge */}
      {achievement.is_featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
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
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${achievement.category.color}15`,
                color: achievement.category.color,
              }}
            >
              {achievement.category.icon && (
                <span className="text-sm">{achievement.category.icon}</span>
              )}
              {achievement.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-xl font-bold text-[#171717] group-hover:text-[#0b6d41] transition-colors line-clamp-2 sm:line-clamp-none">
          {achievement.title}
        </h3>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
          {/* Person */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              {isFaculty ? faculty?.faculty_name : student?.student_name}
            </span>
          </div>

          {/* Designation or Roll Number */}
          {isFaculty && faculty?.faculty_designation && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-none">{faculty.faculty_designation}</span>
            </div>
          )}

          {!isFaculty && student?.student_roll_number && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{student.student_roll_number}</span>
            </div>
          )}

          {/* Date */}
          {achievement.achievement_date && (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>
                {new Date(achievement.achievement_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: window.innerWidth < 640 ? undefined : 'numeric',
                })}
              </span>
            </div>
          )}
        </div>

        {/* Course Badge */}
        {achievement.course && (
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md truncate max-w-full">
              <span className="hidden sm:inline">{achievement.course.name} ({achievement.course.code})</span>
              <span className="sm:hidden">{achievement.course.code}</span>
            </span>
          </div>
        )}

        {/* Description (Markdown) */}
        <div className={`prose prose-sm max-w-none text-gray-700 text-xs sm:text-sm ${isExpanded ? '' : 'line-clamp-2 sm:line-clamp-3'}`}>
          <ReactMarkdown
            components={{
              // Customize markdown rendering
              p: ({ children }) => <p className="mb-2">{children}</p>,
              ul: ({ children }) => isExpanded ? <ul className="list-disc list-inside space-y-1">{children}</ul> : null,
              ol: ({ children }) => isExpanded ? <ol className="list-decimal list-inside space-y-1">{children}</ol> : null,
              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
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
