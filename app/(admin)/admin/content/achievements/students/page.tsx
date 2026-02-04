/**
 * Student Achievements Management Page
 *
 * Admin interface for managing student achievements
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Trophy } from 'lucide-react'
import { getStudentAchievements } from '@/lib/data/achievements'
import { StudentAchievementsTable } from '@/components/admin/achievements/student-achievements-table'

export const metadata: Metadata = {
  title: 'Student Achievements | Admin',
  description: 'Manage student achievements and recognitions',
}

export default async function StudentAchievementsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100 text-purple-600">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Student Achievements
            </h1>
            <p className="mt-1 text-gray-600">
              Manage student accomplishments and recognitions
            </p>
          </div>
        </div>
        <Link
          href="/admin/content/achievements/students/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Achievement
        </Link>
      </div>

      {/* Table */}
      <Suspense
        fallback={
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading achievements...</p>
          </div>
        }
      >
        <StudentTableWrapper />
      </Suspense>
    </div>
  )
}

async function StudentTableWrapper() {
  const achievements = await getStudentAchievements({ isActive: undefined }) // Get all including inactive

  return <StudentAchievementsTable achievements={achievements} />
}
