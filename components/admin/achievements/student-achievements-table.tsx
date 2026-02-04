'use client'

/**
 * Student Achievements Table Component (Placeholder)
 * TODO: Implement full table functionality with TanStack Table
 */

import { StudentAchievementWithRelations } from '@/types/achievements'

interface StudentAchievementsTableProps {
  achievements: StudentAchievementWithRelations[]
}

export function StudentAchievementsTable({ achievements }: StudentAchievementsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {achievements.map((achievement) => (
                <tr key={achievement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {achievement.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {achievement.student_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {achievement.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {achievement.achievement_date
                      ? new Date(achievement.achievement_date).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        achievement.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {achievement.is_active ? 'Active' : 'Inactive'}
                    </span>
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
