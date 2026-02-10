import { Suspense } from 'react'
import { VisitorStatsCards, VisitorStatsCardsSkeleton, PageviewsChart, PageviewsChartSkeleton, TrafficSourcesChart, TrafficSourcesChartSkeleton } from '@/components/analytics/charts-lazy'
import { TopPublicPagesTable, TopPublicPagesTableSkeleton } from '@/components/analytics/tables/top-public-pages-table'
import { ChartGrid } from '@/components/analytics/analytics-card'

export default function VisitorAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Website Visitors</h2>
        <p className="text-muted-foreground">
          Track page views and visitor activity on your public website
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<VisitorStatsCardsSkeleton />}>
        <VisitorStatsCards />
      </Suspense>

      {/* Page Views Chart */}
      <Suspense fallback={<PageviewsChartSkeleton />}>
        <PageviewsChart />
      </Suspense>

      {/* Top Pages & Traffic Sources */}
      <ChartGrid columns={2}>
        <Suspense fallback={<TopPublicPagesTableSkeleton />}>
          <TopPublicPagesTable />
        </Suspense>

        <Suspense fallback={<TrafficSourcesChartSkeleton />}>
          <TrafficSourcesChart />
        </Suspense>
      </ChartGrid>
    </div>
  )
}
