'use client'

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

/**
 * Dynamically imported Recharts components
 *
 * Recharts is ~300KB and only used in analytics pages.
 * This lazy loading reduces initial bundle size significantly.
 *
 * Usage:
 * import { PageviewsChart } from '@/components/analytics/charts/index.lazy'
 */

// Loading skeleton for charts
function ChartSkeleton({ title }: { title?: string }) {
  return (
    <div className="border rounded-xl p-6 bg-card animate-pulse">
      {title && <div className="h-6 w-48 bg-muted rounded mb-4" />}
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading chart...</p>
        </div>
      </div>
    </div>
  )
}

// Dynamically import each chart component
export const PageviewsChart = dynamic(
  () => import('./pageviews-chart').then((mod) => ({ default: mod.PageviewsChart })),
  {
    loading: () => <ChartSkeleton title="Pageviews" />,
    ssr: false,
  }
)

export const UserGrowthChart = dynamic(
  () => import('./user-growth-chart').then((mod) => ({ default: mod.UserGrowthChart })),
  {
    loading: () => <ChartSkeleton title="User Growth" />,
    ssr: false,
  }
)

export const ContentPerformanceChart = dynamic(
  () => import('./content-performance-chart').then((mod) => ({ default: mod.ContentPerformanceChart })),
  {
    loading: () => <ChartSkeleton title="Content Performance" />,
    ssr: false,
  }
)

export const TrafficSourcesChart = dynamic(
  () => import('./traffic-sources-chart').then((mod) => ({ default: mod.TrafficSourcesChart })),
  {
    loading: () => <ChartSkeleton title="Traffic Sources" />,
    ssr: false,
  }
)

export const RoleDistributionChart = dynamic(
  () => import('./role-distribution-chart').then((mod) => ({ default: mod.RoleDistributionChart })),
  {
    loading: () => <ChartSkeleton title="Role Distribution" />,
    ssr: false,
  }
)
