/**
 * Faculty Achievements Management Page
 *
 * Admin interface for managing faculty achievements
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, GraduationCap } from 'lucide-react'
import { getFacultyAchievements } from '@/lib/data/achievements'
import { FacultyAchievementsTable } from '@/components/admin/achievements/faculty-achievements-table'

export const metadata: Metadata = {
  title: 'Faculty Achievements | Admin',
  description: 'Manage faculty achievements and recognitions',
}

export default async function FacultyAchievementsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Faculty Achievements
            </h1>
            <p className="mt-1 text-gray-600">
              Manage faculty accomplishments and recognitions
            </p>
          </div>
        </div>
        <Link
          href="/admin/content/achievements/faculty/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Achievement
        </Link>
      </div>

      {/* Table */}
      <Suspense
        fallback={
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading achievements...</p>
          </div>
        }
      >
        <FacultyTableWrapper />
      </Suspense>
    </div>
  )
}

async function FacultyTableWrapper() {
  const achievements = await getFacultyAchievements({ isActive: undefined }) // Get all including inactive

  return <FacultyAchievementsTable achievements={achievements} />
}
