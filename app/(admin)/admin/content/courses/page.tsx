import { Suspense } from 'react'
import { getCoursePages, getCoursePageStats } from '@/app/actions/cms/courses/get-course-pages'
import { CourseListClient } from '@/components/admin/courses/course-list-client'
import { GraduationCap, BookOpen, BarChart3, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Course Pages | Admin',
  description: 'Manage all UG and PG course pages',
}

export default async function CoursePagesPage() {
  const [coursesResult, statsResult] = await Promise.all([
    getCoursePages(),
    getCoursePageStats(),
  ])

  const courses = coursesResult.success ? coursesResult.data || [] : []
  const stats = statsResult.success ? statsResult.data : null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-green-600" />
            Course Pages Management
          </h1>
          <p className="text-gray-600 mt-2">
            Edit all UG and PG course pages, manage content, images, and SEO
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<BookOpen className="w-5 h-5" />}
              label="Total Courses"
              value={stats.total}
              color="blue"
            />
            <StatCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Undergraduate"
              value={stats.undergraduate}
              color="green"
            />
            <StatCard
              icon={<GraduationCap className="w-5 h-5" />}
              label="Postgraduate"
              value={stats.postgraduate}
              color="purple"
            />
            <StatCard
              icon={<BarChart3 className="w-5 h-5" />}
              label="Published"
              value={stats.published}
              color="emerald"
            />
          </div>
        )}

        {/* Course List */}
        <Suspense fallback={<CoursesLoadingSkeleton />}>
          <CourseListClient initialCourses={courses} />
        </Suspense>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'blue' | 'green' | 'purple' | 'emerald'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  }

  return (
    <div className={`${colorClasses[color]} border-2 rounded-lg p-4`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg">{icon}</div>
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function CoursesLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
