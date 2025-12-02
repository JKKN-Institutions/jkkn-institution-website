import { Suspense } from 'react'
import { TemplatesTable } from './templates-table'
import { Layout } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/ui/responsive-page-header'
import { TemplatesActions } from './templates-actions'

interface TemplatesPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    category?: string
  }>
}

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 20
  const search = params.search || ''
  const category = params.category || ''

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Mobile Responsive */}
      <ResponsivePageHeader
        icon={<Layout className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />}
        title="Templates"
        description="Manage page templates for quick content creation"
        badge="CMS"
        actions={<TemplatesActions />}
      />

      {/* Templates Table with Glass Effect - Responsive padding */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<TemplatesTableSkeleton />}>
          <TemplatesTable
            page={page}
            limit={limit}
            search={search}
            categoryFilter={category}
          />
        </Suspense>
      </div>
    </div>
  )
}

function TemplatesTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
        <div className="p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-16 w-24 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
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
