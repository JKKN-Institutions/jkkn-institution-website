import { Suspense } from 'react'
import { BlogPostsTable } from './blog-posts-table'
import { Plus, Newspaper, Tags, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    status?: string
    category?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 20
  const search = params.search || ''
  const status = params.status || ''
  const category = params.category || ''

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Responsive */}
      <ResponsivePageHeader
        icon={<Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Blog Posts"
        description="Create and manage blog posts with rich content editor"
        badge="Blog"
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              asChild
              variant="outline"
              className="min-h-[44px]"
            >
              <Link href="/admin/content/blog/categories">
                <FolderOpen className="mr-2 h-4 w-4" />
                Categories
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-[44px]"
            >
              <Link href="/admin/content/blog/tags">
                <Tags className="mr-2 h-4 w-4" />
                Tags
              </Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 shadow-brand min-h-[44px]"
            >
              <Link href="/admin/content/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        }
      />

      {/* Blog Posts Table with Glass Effect - Responsive padding */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<BlogTableSkeleton />}>
          <BlogPostsTable
            page={page}
            limit={limit}
            search={search}
            statusFilter={status}
            categoryFilter={category}
          />
        </Suspense>
      </div>
    </div>
  )
}

function BlogTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
        <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
        <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-12 w-20 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-4 w-48 rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
