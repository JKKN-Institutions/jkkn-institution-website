/**
 * Achievements Page (Public)
 *
 * Displays faculty and student achievements with:
 * - Course tabs (including "All Courses" tab)
 * - Search functionality
 * - Year filtering
 * - Category filtering
 * - Responsive design
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import { AchievementsPageClient } from '@/components/achievements/achievements-page-client'
import {
  getCoursesWithAchievements,
  getAchievementCategories,
  getAchievementYears,
} from '@/lib/data/achievements'

export const metadata: Metadata = {
  title: 'Achievements',
  description:
    'Explore the outstanding achievements of our faculty and students across various fields including research, teaching, competitions, and awards.',
  keywords: [
    'achievements',
    'faculty achievements',
    'student achievements',
    'awards',
    'research',
    'competitions',
    'academic excellence',
  ],
}

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  //Extract filter params from URL
  const courseId = typeof params.course === 'string' ? params.course : null
  const categoryId = typeof params.category === 'string' ? params.category : null
  const year = typeof params.year === 'string' ? parseInt(params.year) : null
  const search = typeof params.search === 'string' ? params.search : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-16 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Our Achievements
            </h1>
            <p className="text-lg text-blue-50 md:text-xl">
              Celebrating excellence in academics, research, and innovation
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading achievements...</p>
              </div>
            </div>
          }
        >
          <AchievementsContent
            initialCourseId={courseId}
            initialCategoryId={categoryId}
            initialYear={year}
            initialSearch={search}
          />
        </Suspense>
      </section>
    </div>
  )
}

async function AchievementsContent({
  initialCourseId,
  initialCategoryId,
  initialYear,
  initialSearch,
}: {
  initialCourseId: string | null
  initialCategoryId: string | null
  initialYear: number | null
  initialSearch: string | null
}) {
  // Fetch filter data
  const [courses, categories, years] = await Promise.all([
    getCoursesWithAchievements(),
    getAchievementCategories(),
    getAchievementYears(),
  ])

  return (
    <AchievementsPageClient
      courses={courses}
      categories={categories}
      years={years}
      initialFilters={{
        courseId: initialCourseId,
        categoryId: initialCategoryId,
        year: initialYear,
        search: initialSearch,
      }}
    />
  )
}
