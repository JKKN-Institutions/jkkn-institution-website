import { redirect } from 'next/navigation'
import { checkPermission } from '@/app/actions/permissions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Edit, Eye, BookOpen } from 'lucide-react'
import Link from 'next/link'

async function checkAccess() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const hasPermission = await checkPermission(user.id, 'cms:pages:view')
  if (!hasPermission) {
    redirect('/admin/unauthorized')
  }

  return user
}

async function getCoursePages() {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_blocks')
    .select(`
      *,
      cms_pages(
        id,
        title,
        slug,
        status,
        updated_at
      )
    `)
    .eq('component_name', 'BEMechanicalCoursePage')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching course pages:', error)
    return []
  }

  return data
}

export const metadata = {
  title: 'Course Pages | JKKN Admin',
  description: 'Manage course pages for engineering programs',
}

export default async function CoursePageListPage() {
  await checkAccess()

  const coursePages = await getCoursePages()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Pages</h1>
        <p className="mt-2 text-gray-600">
          Manage detailed course pages for engineering programs
        </p>
      </div>

      {coursePages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Pages Found</h3>
          <p className="text-gray-600 mb-6">
            Course pages use the BEMechanicalCoursePage component.
          </p>
          <Link
            href="/admin/content/pages"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Go to Pages
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coursePages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {page.cms_pages?.title || 'Untitled'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Component: {page.component_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      /{page.cms_pages?.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.cms_pages?.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : page.cms_pages?.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {page.cms_pages?.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {page.cms_pages?.updated_at
                      ? new Date(page.cms_pages.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${page.cms_pages?.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        href={`/admin/content/course-pages/${page.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Content
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Quick Tip</h3>
        <p className="text-sm text-blue-800">
          This page shows all course pages that use the <code className="bg-blue-100 px-1.5 py-0.5 rounded">BEMechanicalCoursePage</code> component.
          To create a new course page, go to{' '}
          <Link href="/admin/content/pages" className="font-semibold underline hover:text-blue-900">
            Pages
          </Link>{' '}
          and add the BEMechanicalCoursePage component to your page.
        </p>
      </div>
    </div>
  )
}
