import { Suspense } from 'react'
import { PagesTable } from './pages-table'
import { Plus, FileText, Globe, Clock, Eye, BarChart3, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getTrashStatistics } from '@/app/actions/cms/pages'

interface PagesPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    status?: string
  }>
}

export default async function PagesPage({ searchParams }: PagesPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 20
  const search = params.search || ''
  const status = params.status || ''

  // Fetch page statistics
  const supabase = await createServerSupabaseClient()
  const { data: stats } = await supabase.rpc('get_page_statistics').single()

  const pageStats = (stats as { total: number; published: number; draft: number; scheduled: number } | null) || {
    total: 0,
    published: 0,
    draft: 0,
    scheduled: 0,
  }

  // Fetch trash statistics
  const trashStats = await getTrashStatistics()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Professional Header with Stats */}
      <div className="space-y-4">
        {/* Main Header Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          {/* Decorative gradient background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Content Pages</h1>
                    <span className="badge-brand text-xs whitespace-nowrap">
                      <Globe className="h-3 w-3 mr-1" />
                      CMS
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create and manage website pages with the visual page builder
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:flex-shrink-0">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 sm:flex-initial border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-950/20"
                >
                  <Link href="/admin/content/pages/trash">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Trash</span>
                    <span className="sm:hidden">Trash</span>
                    {trashStats.total_in_trash > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {trashStats.total_in_trash}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 shadow-brand"
                >
                  <Link href="/admin/content/pages/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Page
                  </Link>
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Pages */}
              <div className="group bg-gradient-to-br from-card to-card/50 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {pageStats.total || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">Total Pages</div>
                  <div className="text-xs text-muted-foreground">All content pages</div>
                </div>
              </div>

              {/* Published */}
              <div className="group bg-gradient-to-br from-card to-card/50 rounded-xl p-4 border border-border/50 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Eye className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {pageStats.published || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">Published</div>
                  <div className="text-xs text-muted-foreground">Live on website</div>
                </div>
              </div>

              {/* Drafts */}
              <div className="group bg-gradient-to-br from-card to-card/50 rounded-xl p-4 border border-border/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {pageStats.draft || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">Drafts</div>
                  <div className="text-xs text-muted-foreground">Work in progress</div>
                </div>
              </div>

              {/* Scheduled */}
              <div className="group bg-gradient-to-br from-card to-card/50 rounded-xl p-4 border border-border/50 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {pageStats.scheduled || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">Scheduled</div>
                  <div className="text-xs text-muted-foreground">Future publish</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Table with Glass Effect - Responsive padding */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <Suspense fallback={<PagesTableSkeleton />}>
          <PagesTable
            page={page}
            limit={limit}
            search={search}
            statusFilter={status}
          />
        </Suspense>
      </div>
    </div>
  )
}

function PagesTableSkeleton() {
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
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-lg" />
              <Skeleton className="h-4 w-12 rounded-lg" />
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
