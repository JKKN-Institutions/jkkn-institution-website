import { Suspense } from 'react'
import { ActivityHeatmap, ActivityHeatmapSkeleton, KPICards, KPICardsSkeleton } from '@/components/analytics/charts-lazy'
import { TopContributorsTable, TopContributorsTableSkeleton } from '@/components/analytics/tables/top-contributors-table'
import { ChartGrid } from '@/components/analytics/analytics-card'

export default function EngagementAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          Monitor user engagement patterns, activity trends, and discover when your users are most active.
        </p>
      </div>

      {/* KPI Cards */}
      <Suspense fallback={<KPICardsSkeleton />}>
        <KPICards />
      </Suspense>

      {/* Activity Heatmap - Full Width */}
      <Suspense fallback={<ActivityHeatmapSkeleton />}>
        <ActivityHeatmap />
      </Suspense>

      {/* Top Contributors */}
      <ChartGrid columns={1}>
        <Suspense fallback={<TopContributorsTableSkeleton />}>
          <TopContributorsTable limit={15} />
        </Suspense>
      </ChartGrid>
    </div>
  )
}
