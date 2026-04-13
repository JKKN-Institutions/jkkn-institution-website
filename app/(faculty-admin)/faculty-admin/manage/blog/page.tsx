import { Newspaper, Globe, FileEdit, Eye } from 'lucide-react'
import { BlogManageTable } from './blog-manage-table'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function FacultyBlogPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch stats
  const [
    { count: totalCount },
    { count: publishedCount },
    { count: draftCount },
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
  ])

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blog Posts</h1>
          <p className="text-[0.78rem] text-gray-400">Create and manage blog posts for the website</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[1.5rem] font-bold text-gray-800 leading-none">{totalCount ?? 0}</p>
            <p className="text-[0.72rem] text-gray-400 mt-0.5">Total Posts</p>
          </div>
        </div>

        {/* Published */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-[1.5rem] font-bold text-gray-800 leading-none">{publishedCount ?? 0}</p>
            <p className="text-[0.72rem] text-gray-400 mt-0.5">Published & Live</p>
          </div>
        </div>

        {/* Drafts */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <FileEdit className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[1.5rem] font-bold text-gray-800 leading-none">{draftCount ?? 0}</p>
            <p className="text-[0.72rem] text-gray-400 mt-0.5">Drafts</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <BlogManageTable />
      </div>
    </div>
  )
}
