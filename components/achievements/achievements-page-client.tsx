'use client'

/**
 * Achievements Page Client Component
 *
 * Handles interactive features:
 * - Tab navigation (All Courses + individual courses)
 * - Search filtering
 * - Year filtering
 * - Category filtering
 * - URL state management
 * - Carousel display for achievements
 */

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X, Trophy, GraduationCap } from 'lucide-react'
import { AchievementList } from './achievement-list'
import { AchievementsCarousel } from './achievements-carousel'
import type {
  AchievementCategory,
  CourseSummary,
  AchievementFilters,
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

  // State
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    initialFilters.courseId
  )
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialFilters.categoryId
  )
  const [selectedYear, setSelectedYear] = useState<number | null>(
    initialFilters.year
  )
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  // Achievements data for carousel
  const [facultyAchievements, setFacultyAchievements] = useState<FacultyAchievementWithRelations[]>([])
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievementWithRelations[]>([])
  const [loadingAchievements, setLoadingAchievements] = useState(false)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedCourseId) params.set('course', selectedCourseId)
    if (selectedCategoryId) params.set('category', selectedCategoryId)
    if (selectedYear) params.set('year', selectedYear.toString())
    if (searchQuery) params.set('search', searchQuery)

    const newUrl = params.toString() ? `/achievements?${params.toString()}` : '/achievements'
    router.push(newUrl, { scroll: false })
  }, [selectedCourseId, selectedCategoryId, selectedYear, searchQuery, router])

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategoryId(null)
    setSelectedYear(null)
    setSearchQuery('')
  }

  // Check if any filters are active
  const hasActiveFilters = selectedCategoryId || selectedYear || searchQuery

  // Build filter object for AchievementList
  const filters: AchievementFilters = useMemo(
    () => ({
      courseId: selectedCourseId,
      categoryId: selectedCategoryId,
      year: selectedYear,
      search: searchQuery || null,
    }),
    [selectedCourseId, selectedCategoryId, selectedYear, searchQuery]
  )

  // Fetch achievements for carousel
  useEffect(() => {
    async function fetchAchievements() {
      setLoadingAchievements(true)
      try {
        // Build query params
        const params = new URLSearchParams()
        if (selectedCourseId === null) {
          params.set('featured', 'true')
        } else {
          params.set('courseId', selectedCourseId)
        }
        if (selectedCategoryId) params.set('categoryId', selectedCategoryId)
        if (selectedYear) params.set('year', selectedYear.toString())
        if (searchQuery) params.set('search', searchQuery)

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
  }, [selectedCourseId, selectedCategoryId, selectedYear, searchQuery])

  return (
    <div className="space-y-8">
      {/* Course Tabs */}
      <div className="border-b border-gray-200 bg-white rounded-lg shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {/* All Courses Tab */}
            <button
              onClick={() => setSelectedCourseId(null)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                selectedCourseId === null
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              All Courses (Highlights)
            </button>

            {/* Individual Course Tabs */}
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  selectedCourseId === course.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {course.name}
              </button>
            ))}

            {/* Empty State */}
            {courses.length === 0 && selectedCourseId === null && (
              <div className="px-6 py-4 text-sm text-gray-500">
                No courses with achievements yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {[selectedCategoryId, selectedYear, searchQuery].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filters Row (Desktop Always Visible, Mobile Toggleable) */}
        <div
          className={`${
            showFilters ? 'block' : 'hidden'
          } md:block space-y-4 md:space-y-0 md:flex md:flex-wrap md:gap-4`}
        >
          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategoryId || ''}
              onChange={(e) => setSelectedCategoryId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedCategoryId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {categories.find((c) => c.id === selectedCategoryId)?.name}
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedYear && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {selectedYear}
                <button
                  onClick={() => setSelectedYear(null)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Achievement Carousels */}
      <div className="space-y-12">
        {/* Faculty Achievements Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Faculty Achievements
              </h2>
              <p className="text-sm text-gray-600">
                Excellence in teaching, research, and innovation
              </p>
            </div>
          </div>
          {loadingAchievements ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
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
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Student Achievements
              </h2>
              <p className="text-sm text-gray-600">
                Outstanding accomplishments in academics, sports, and beyond
              </p>
            </div>
          </div>
          {loadingAchievements ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
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
