import { Suspense } from 'react'
import { UserGrowthChart, UserGrowthChartSkeleton, RoleDistributionChart, RoleDistributionChartSkeleton } from '@/components/analytics/charts-lazy'
import { RecentUsersTable, RecentUsersTableSkeleton } from '@/components/analytics/tables/recent-users-table'
import { TopContributorsTable, TopContributorsTableSkeleton } from '@/components/analytics/tables/top-contributors-table'
import { ChartGrid } from '@/components/analytics/analytics-card'

export default function UsersAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Description */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          Track user growth trends, role distribution, and identify top contributors across your platform.
        </p>
      </div>

      {/* Charts Row */}
      <ChartGrid columns={2}>
        <Suspense fallback={<UserGrowthChartSkeleton />}>
          <UserGrowthChart />
        </Suspense>
        <Suspense fallback={<RoleDistributionChartSkeleton />}>
          <RoleDistributionChart />
        </Suspense>
      </ChartGrid>

      {/* Tables Row */}
      <ChartGrid columns={2}>
        <Suspense fallback={<RecentUsersTableSkeleton />}>
          <RecentUsersTable limit={10} />
        </Suspense>
        <Suspense fallback={<TopContributorsTableSkeleton />}>
          <TopContributorsTable limit={10} />
        </Suspense>
      </ChartGrid>
    </div>
  )
}
