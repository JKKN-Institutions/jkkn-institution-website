/**
 * Lazy-loaded chart components for analytics dashboard
 *
 * These charts are only loaded when the analytics page is accessed,
 * preventing unnecessary bundle bloat on public pages.
 *
 * Bundle savings: ~100KB (Recharts + dependencies)
 */

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Chart skeleton component
function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  )
}

// Lazy load all chart components
export const UserGrowthChart = dynamic(
  () => import('./user-growth-chart').then(mod => mod.UserGrowthChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false // Charts don't need SSR, save server time
  }
)

export const PageviewsChart = dynamic(
  () => import('./pageviews-chart').then(mod => mod.PageviewsChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
)

export const TrafficSourcesChart = dynamic(
  () => import('./traffic-sources-chart').then(mod => mod.TrafficSourcesChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
)

export const RoleDistributionChart = dynamic(
  () => import('./role-distribution-chart').then(mod => mod.RoleDistributionChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
)

export const ContentPerformanceChart = dynamic(
  () => import('./content-performance-chart').then(mod => mod.ContentPerformanceChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
)
