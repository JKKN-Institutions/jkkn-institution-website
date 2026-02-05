'use client'

/**
 * Achievements Page Client Component
 *
 * Handles interactive features:
 * - Tab navigation (All Courses + individual courses)
 * - URL state management
 * - Carousel display for achievements
 */

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Trophy, GraduationCap } from 'lucide-react'
import { AchievementsCarousel } from './achievements-carousel'
import type {
  AchievementCategory,
  CourseSummary,
  FacultyAchievementWithRelations,
  StudentAchievementWithRelations,
} from '@/types/achievements'

interface AchievementsPageClientProps {
  courses: CourseSummary[]
  categories: AchievementCategory[]
  years: number[]
  initialFilters: {
    courseId: string | null
    categoryId: string | null
    year: number | null
    search: string | null
  }
}

export function AchievementsPageClient({
  courses,
  categories,
  years,
  initialFilters,
}: AchievementsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State - Default to first course if no course selected
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    initialFilters.courseId || (courses.length > 0 ? courses[0].id : null)
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialFilters.categoryId
  )
  const [selectedYear, setSelectedYear] = useState<number | null>(
    initialFilters.year
  )
  const [searchQuery, setSearchQuery] = useState<string>(
    initialFilters.search || ''
  )

  // Achievements data for carousel
  const [facultyAchievements, setFacultyAchievements] = useState<FacultyAchievementWithRelations[]>([])
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievementWithRelations[]>([])
  const [loadingAchievements, setLoadingAchievements] = useState(false)

  // Update URL when course changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCourseId) params.set('course', selectedCourseId)
    const newUrl = params.toString() ? `/achievements?${params.toString()}` : '/achievements'
    router.push(newUrl, { scroll: false })
  }, [selectedCourseId, router])

  // Fetch achievements for carousel
  useEffect(() => {
    async function fetchAchievements() {
      setLoadingAchievements(true)
      try {
        // Build query params
        const params = new URLSearchParams()
        if (selectedCourseId) {
          params.set('courseId', selectedCourseId)
        }

        // Fetch both faculty and student achievements
        const [facultyRes, studentRes] = await Promise.all([
          fetch(`/api/achievements/faculty?${params.toString()}`),
          fetch(`/api/achievements/student?${params.toString()}`)
        ])

        if (facultyRes.ok && studentRes.ok) {
          const [facultyData, studentData] = await Promise.all([
            facultyRes.json(),
            studentRes.json()
          ])
          setFacultyAchievements(facultyData)
          setStudentAchievements(studentData)
        }
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setLoadingAchievements(false)
      }
    }

    fetchAchievements()
  }, [selectedCourseId])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Course Tabs */}
      {courses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="relative">
            {/* Gradient overlays for scroll indication on desktop */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden sm:block"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden sm:block"></div>

            {/* Scrollable tab container */}
            <div className="overflow-x-auto overflow-y-hidden border-b border-gray-200 rounded-lg">
              <div className="flex" style={{ minWidth: 'max-content' }}>
                {/* Individual Course Tabs */}
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all whitespace-nowrap border-b-2 touch-manipulation ${
                      selectedCourseId === course.id
                        ? 'border-[#0b6d41] text-[#0b6d41] bg-[#0b6d41]/5'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {course.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-500">
            No courses with achievements yet
          </p>
        </div>
      )}

      {/* Achievement Carousels */}
      <div className="space-y-8 sm:space-y-12">
        {/* Faculty Achievements Section */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2 sm:px-0">
            <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-[#0b6d41] to-[#085032] text-white shadow-md flex-shrink-0">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-[#171717]">
                Faculty Achievements
              </h2>
              <p className="text-xs sm:text-sm text-[#4a4a4a]">
                Excellence in teaching, research, and innovation
              </p>
            </div>
          </div>
          {loadingAchievements ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0b6d41] border-t-transparent"></div>
            </div>
          ) : (
            <AchievementsCarousel
              achievements={facultyAchievements}
              type="faculty"
              autoplayDelay={6000}
            />
          )}
        </div>

        {/* Student Achievements Section */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2 sm:px-0">
            <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-[#ffde59] to-[#f5c518] text-[#171717] shadow-md flex-shrink-0">
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-[#171717]">
                Student Achievements
              </h2>
              <p className="text-xs sm:text-sm text-[#4a4a4a]">
                Outstanding accomplishments in academics, sports, and beyond
              </p>
            </div>
          </div>
          {loadingAchievements ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ffde59] border-t-transparent"></div>
            </div>
          ) : (
            <AchievementsCarousel
              achievements={studentAchievements}
              type="student"
              autoplayDelay={6000}
            />
          )}
        </div>
      </div>
    </div>
  )
}
