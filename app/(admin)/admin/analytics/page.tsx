import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KPICards, KPICardsSkeleton } from '@/components/analytics/charts/kpi-cards'
import { UserGrowthChart, UserGrowthChartSkeleton } from '@/components/analytics/charts/user-growth-chart'
import { RoleDistributionChart, RoleDistributionChartSkeleton } from '@/components/analytics/charts/role-distribution-chart'
import { ContentStatsCards } from '@/components/analytics/charts/content-performance-chart'
import { ChartGrid } from '@/components/analytics/analytics-card'

export default function AnalyticsOverviewPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <Suspense fallback={<KPICardsSkeleton />}>
        <KPICards />
      </Suspense>

      {/* Quick Charts */}
      <ChartGrid columns={2}>
        {/* User Growth Preview */}
        <div className="space-y-3">
          <Suspense fallback={<UserGrowthChartSkeleton />}>
            <UserGrowthChart />
          </Suspense>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics/users" className="gap-1">
                View user analytics
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Role Distribution Preview */}
        <div className="space-y-3">
          <Suspense fallback={<RoleDistributionChartSkeleton />}>
            <RoleDistributionChart />
          </Suspense>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics/users" className="gap-1">
                View role details
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </ChartGrid>

      {/* Content Stats Preview */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Content Overview</h3>
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl border bg-card/50 animate-pulse" />
            ))}
          </div>
        }>
          <ContentStatsCards />
        </Suspense>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/analytics/content" className="gap-1">
              View content analytics
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/analytics/visitors"
            className="flex items-center gap-3 p-4 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <ArrowRight className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Website Visitors</p>
              <p className="text-xs text-muted-foreground">Page views, traffic sources</p>
            </div>
          </Link>
          <Link
            href="/admin/analytics/users"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-blue-500/20">
              <ArrowRight className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">User Analytics</p>
              <p className="text-xs text-muted-foreground">Growth, roles, contributors</p>
            </div>
          </Link>
          <Link
            href="/admin/analytics/content"
            className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-green-500/20">
              <ArrowRight className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Content Analytics</p>
              <p className="text-xs text-muted-foreground">Pages, views, performance</p>
            </div>
          </Link>
          <Link
            href="/admin/analytics/engagement"
            className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors group"
          >
            <div className="p-2 rounded-lg bg-purple-500/20">
              <ArrowRight className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Engagement Analytics</p>
              <p className="text-xs text-muted-foreground">Activity heatmap, trends</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
