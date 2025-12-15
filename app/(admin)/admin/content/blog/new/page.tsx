import { Suspense } from 'react'
import { BlogPostForm } from '../blog-post-form'
import { ArrowLeft, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { getBlogCategories } from '@/app/actions/cms/blog-categories'
import { getBlogTags } from '@/app/actions/cms/blog-tags'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function NewBlogPostPage() {
  // Fetch data for form
  const [categories, tags, supabase] = await Promise.all([
    getBlogCategories(),
    getBlogTags(),
    createServerSupabaseClient(),
  ])

  // Get current user for author
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .eq('id', user?.id)
    .single()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Responsive */}
      <ResponsivePageHeader
        icon={<Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="New Blog Post"
        description="Create a new blog post with rich content"
        badge="Blog"
        actions={
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/admin/content/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
        }
      />

      {/* Blog Post Form */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<FormSkeleton />}>
          <BlogPostForm
            categories={categories}
            tags={tags}
            author={profile}
          />
        </Suspense>
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
