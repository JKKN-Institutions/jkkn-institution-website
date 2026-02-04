/**
 * Achievement Categories Management Page
 *
 * Admin interface for managing achievement categories (tags)
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAchievementCategories } from '@/lib/data/achievements'
import { AchievementCategoriesTable } from '@/components/admin/achievements/categories-table'

export const metadata: Metadata = {
  title: 'Achievement Categories | Admin',
  description: 'Manage achievement categories and tags',
}

export default async function AchievementCategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Achievement Categories
          </h1>
          <p className="mt-2 text-gray-600">
            Manage categories for classifying achievements
          </p>
        </div>
        <Link
          href="/admin/content/achievements/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Category
        </Link>
      </div>

      {/* Table */}
      <Suspense
        fallback={
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        }
      >
        <CategoriesTableWrapper />
      </Suspense>
    </div>
  )
}

async function CategoriesTableWrapper() {
  const categories = await getAchievementCategories()

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No categories yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first achievement category to get started.
        </p>
        <Link
          href="/admin/content/achievements/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Create Category
        </Link>
      </div>
    )
  }

  return <AchievementCategoriesTable categories={categories} />
}
