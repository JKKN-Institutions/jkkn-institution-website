import { BlogPostForm } from '@/app/(admin)/admin/content/blog/blog-post-form'
import { getBlogCategories } from '@/app/actions/cms/blog-categories'
import { getBlogTags } from '@/app/actions/cms/blog-tags'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function FacultyNewBlogPostPage() {
  const [categories, tags, supabase] = await Promise.all([
    getBlogCategories(),
    getBlogTags(),
    createServerSupabaseClient(),
  ])

  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile (may not exist for faculty admin users)
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('id', user.id)
        .single()
    : { data: null }

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/faculty-admin/manage/blog"
              className="flex items-center gap-1.5 text-[0.78rem] text-gray-400 hover:text-[#0b6d41] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Posts
            </Link>
          </div>
          <h1 className="text-xl font-bold text-gray-800">New Blog Post</h1>
          <p className="text-[0.78rem] text-gray-400">Create a new blog post with rich content</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <BlogPostForm
          categories={categories}
          tags={tags}
          author={profile}
          basePath="/faculty-admin/manage/blog"
        />
      </div>
    </div>
  )
}
