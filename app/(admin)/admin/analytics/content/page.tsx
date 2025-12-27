import { Suspense } from 'react'
import { ContentPerformanceChart, ContentStatsCards } from '@/components/analytics/charts/content-performance-chart'
import { TopPagesTable, TopPagesTableSkeleton } from '@/components/analytics/tables/top-pages-table'
import { ChartGrid } from '@/components/analytics/analytics-card'
import { Skeleton } from '@/components/ui/skeleton'

function ContentStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

function ContentChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  )
}

export default function ContentAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          Analyze content performance, track page views, and understand what content resonates with your audience.
        </p>
      </div>

      {/* Content Stats Cards */}
      <Suspense fallback={<ContentStatsSkeleton />}>
        <ContentStatsCards />
      </Suspense>

      {/* Content Performance Chart */}
      <Suspense fallback={<ContentChartSkeleton />}>
        <ContentPerformanceChart />
      </Suspense>

      {/* Top Pages Table */}
      <Suspense fallback={<TopPagesTableSkeleton />}>
        <TopPagesTable limit={15} />
      </Suspense>
    </div>
  )
}
