'use client'

/**
 * Achievement Categories Table Component (Placeholder)
 * TODO: Implement full table functionality with TanStack Table
 */

import { AchievementCategory } from '@/types/achievements'

interface AchievementCategoriesTableProps {
  categories: AchievementCategory[]
}

export function AchievementCategoriesTable({ categories }: AchievementCategoriesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.color && (
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
