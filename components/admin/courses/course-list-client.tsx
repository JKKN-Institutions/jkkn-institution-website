'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  Archive,
  GraduationCap,
  ChevronRight,
} from 'lucide-react'
import type { CoursePageRecord } from '@/app/actions/cms/courses/get-course-pages'
import { COURSE_DISPLAY_NAMES } from '@/lib/types/course-pages'

interface CourseListClientProps {
  initialCourses: CoursePageRecord[]
}

export function CourseListClient({ initialCourses }: CourseListClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'undergraduate' | 'postgraduate'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')

  // Filter courses
  const filteredCourses = useMemo(() => {
    return initialCourses.filter(course => {
      const matchesSearch =
        course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.courseType.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === 'all' || course.category === categoryFilter

      const matchesStatus =
        statusFilter === 'all' || course.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [initialCourses, searchQuery, categoryFilter, statusFilter])

  const handleEditCourse = (blockId: string) => {
    router.push(`/admin/content/courses/${blockId}/edit`)
  }

  const handleViewCourse = (slug: string) => {
    window.open(`/${slug}`, '_blank')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Filters Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="undergraduate">Undergraduate (UG)</option>
            <option value="postgraduate">Postgraduate (PG)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || categoryFilter !== 'all' || statusFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>
              Showing {filteredCourses.length} of {initialCourses.length} courses
            </span>
            <button
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
                setStatusFilter('all')
              }}
              className="ml-2 text-green-600 hover:text-green-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Course Grid */}
      <div className="p-6">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No courses found matching your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() => handleEditCourse(course.blockId)}
                onView={() => handleViewCourse(course.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CourseCard({
  course,
  onEdit,
  onView,
}: {
  course: CoursePageRecord
  onEdit: () => void
  onView: () => void
}) {
  const statusConfig = {
    published: {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Published',
      color: 'bg-green-100 text-green-700 border-green-200',
    },
    draft: {
      icon: <Clock className="w-4 h-4" />,
      label: 'Draft',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    archived: {
      icon: <Archive className="w-4 h-4" />,
      label: 'Archived',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
    },
  }

  const categoryBadge = course.category === 'undergraduate'
    ? 'bg-blue-100 text-blue-700 border-blue-200'
    : 'bg-purple-100 text-purple-700 border-purple-200'

  const status = statusConfig[course.status]

  const displayName = COURSE_DISPLAY_NAMES[course.courseType as keyof typeof COURSE_DISPLAY_NAMES] || course.courseName

  return (
    <div className="border-2 border-gray-200 rounded-lg hover:border-green-500 transition-all hover:shadow-lg group">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
            {displayName}
          </h3>
          <GraduationCap className="w-5 h-5 text-green-600 flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${categoryBadge}`}>
            {course.category === 'undergraduate' ? 'UG' : 'PG'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full border font-medium flex items-center gap-1 ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div className="text-xs text-gray-600">
          <p><strong>Course Type:</strong> {course.courseType}</p>
          <p><strong>Last Updated:</strong> {new Date(course.lastUpdated).toLocaleDateString()}</p>
          <p><strong>Content Size:</strong> {(course.contentSize / 1024).toFixed(1)} KB</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onView}
            className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-green-500 hover:text-green-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </div>
  )
}
