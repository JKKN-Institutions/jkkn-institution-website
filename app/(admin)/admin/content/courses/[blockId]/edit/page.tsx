import { notFound } from 'next/navigation'
import { getCourseByBlockId } from '@/app/actions/cms/courses/get-course-by-type'
import { UniversalCourseEditor } from '@/components/admin/courses/universal-course-editor'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Edit Course | Admin',
  description: 'Edit course page content',
}

interface EditCoursePageProps {
  params: Promise<{
    blockId: string
  }>
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  // Next.js 16: params is now a Promise, must await it
  const { blockId } = await params

  console.log('=== EDIT PAGE DEBUG ===')
  console.log('Block ID:', blockId)

  const result = await getCourseByBlockId(blockId)

  console.log('Result success:', result.success)
  console.log('Result error:', result.error)
  console.log('Has data:', !!result.data)

  if (!result.success || !result.data) {
    console.error('Course fetch failed:', {
      success: result.success,
      error: result.error,
      blockId: blockId
    })

    // Show error page instead of 404
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Course</h1>
          <div className="space-y-2">
            <p><strong>Block ID:</strong> {blockId}</p>
            <p><strong>Error:</strong> {result.error || 'Unknown error'}</p>
            <p><strong>Success:</strong> {String(result.success)}</p>
          </div>
          <div className="mt-6">
            <a href="/admin/content/courses" className="text-blue-600 hover:underline">
              ← Back to Courses
            </a>
          </div>
        </div>
      </div>
    )
  }

  const course = result.data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/content/courses"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.courseName}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {course.category === 'undergraduate' ? 'Undergraduate' : 'Postgraduate'} Course •{' '}
                  <span className="capitalize">{course.status}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                course.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : course.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {course.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto p-6">
        <UniversalCourseEditor course={course} />
      </div>
    </div>
  )
}
