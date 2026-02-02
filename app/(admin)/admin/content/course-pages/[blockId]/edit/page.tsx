import { redirect, notFound } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCoursePageBlock } from '@/app/actions/cms/course-pages'
import { CoursePageEditorWrapper } from './course-page-editor-wrapper'

interface EditCoursePageProps {
  params: Promise<{
    blockId: string
  }>
}

export async function generateMetadata({ params }: EditCoursePageProps) {
  const { blockId } = await params
  const block = await getCoursePageBlock(blockId)

  return {
    title: block?.cms_pages?.title
      ? `Edit: ${block.cms_pages.title} | JKKN Admin`
      : 'Edit Course Page | JKKN Admin',
  }
}

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

export default async function EditCoursePagePage({ params }: EditCoursePageProps) {
  await checkAccess()

  const { blockId } = await params

  const block = await getCoursePageBlock(blockId)

  if (!block) {
    notFound()
  }

  // Validate that this is actually a course page block
  if (block.component_name !== 'BEMechanicalCoursePage') {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Invalid Component Type</h2>
          <p className="text-red-700">
            This editor is only for BEMechanicalCoursePage components.
            The selected block is of type: <code className="bg-red-100 px-2 py-1 rounded">{block.component_name}</code>
          </p>
          <a
            href="/admin/content/pages"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Pages
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Course Page: {block.cms_pages?.title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Editing content for {block.cms_pages?.slug}
            </p>
          </div>
          <a
            href="/admin/content/pages"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Pages
          </a>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CoursePageEditorWrapper blockId={blockId} initialData={block.props as any} />
      </div>
    </div>
  )
}
