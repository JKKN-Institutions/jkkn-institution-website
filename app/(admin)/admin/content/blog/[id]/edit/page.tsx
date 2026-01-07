import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { BlogPostForm } from '../../blog-post-form'
import { ArrowLeft, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { getBlogPostMetadata } from '@/app/actions/cms/blog'
import { getBlogCategories } from '@/app/actions/cms/blog-categories'
import { getBlogTags } from '@/app/actions/cms/blog-tags'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface EditBlogPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params

  // Fetch data in parallel (excluding content to avoid props serialization limit)
  const [post, categories, tags, supabase] = await Promise.all([
    getBlogPostMetadata(id),
    getBlogCategories(),
    getBlogTags(),
    createServerSupabaseClient(),
  ])

  if (!post) {
    notFound()
  }

  // Get current user
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
      {/* Page Header */}
      <ResponsivePageHeader
        icon={<Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title={`Edit: ${post.title}`}
        description="Update blog post content and settings"
        badge="Blog"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href={`/admin/content/blog/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                View Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href="/admin/content/blog">
                Back to Posts
              </Link>
            </Button>
          </div>
        }
      />

      {/* Blog Post Form */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<FormSkeleton />}>
          <BlogPostForm
            post={post}
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
