'use client'

import dynamic from 'next/dynamic'

// Chart loading fallback
const ChartLoadingFallback = () => (
  <div className="h-64 animate-pulse bg-muted/10 rounded-xl flex items-center justify-center">
    <div className="text-center text-muted-foreground">
      <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-2" />
      <p className="text-sm">Loading chart...</p>
    </div>
  </div>
)

// Dynamically import all chart components - loads only when needed
export const KPICards = dynamic(
  () => import('./charts/kpi-cards').then((mod) => ({ default: mod.KPICards })),
  {
    loading: ChartLoadingFallback,
    ssr: true,
  }
)

export const KPICardsSkeleton = dynamic(
  () => import('./charts/kpi-cards').then((mod) => ({ default: mod.KPICardsSkeleton })),
  {
    ssr: true,
  }
)

export const UserGrowthChart = dynamic(
  () => import('./charts/user-growth-chart').then((mod) => ({ default: mod.UserGrowthChart })),
  {
    loading: ChartLoadingFallback,
    ssr: false, // Recharts doesn't support SSR well
  }
)

export const UserGrowthChartSkeleton = dynamic(
  () => import('./charts/user-growth-chart').then((mod) => ({ default: mod.UserGrowthChartSkeleton })),
  {
    ssr: true,
  }
)

export const RoleDistributionChart = dynamic(
  () => import('./charts/role-distribution-chart').then((mod) => ({ default: mod.RoleDistributionChart })),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  }
)

export const RoleDistributionChartSkeleton = dynamic(
  () => import('./charts/role-distribution-chart').then((mod) => ({ default: mod.RoleDistributionChartSkeleton })),
  {
    ssr: true,
  }
)

export const ContentStatsCards = dynamic(
  () => import('./charts/content-performance-chart').then((mod) => ({ default: mod.ContentStatsCards })),
  {
    loading: ChartLoadingFallback,
    ssr: true,
  }
)

export const ContentPerformanceChart = dynamic(
  () => import('./charts/content-performance-chart').then((mod) => ({ default: mod.ContentPerformanceChart })),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  }
)

export const PageviewsChart = dynamic(
  () => import('./charts/pageviews-chart').then((mod) => ({ default: mod.PageviewsChart })),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  }
)

export const PageviewsChartSkeleton = dynamic(
  () => import('./charts/pageviews-chart').then((mod) => ({ default: mod.PageviewsChartSkeleton })),
  {
    ssr: true,
  }
)

export const TrafficSourcesChart = dynamic(
  () => import('./charts/traffic-sources-chart').then((mod) => ({ default: mod.TrafficSourcesChart })),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  }
)

export const TrafficSourcesChartSkeleton = dynamic(
  () => import('./charts/traffic-sources-chart').then((mod) => ({ default: mod.TrafficSourcesChartSkeleton })),
  {
    ssr: true,
  }
)

export const ActivityHeatmap = dynamic(
  () => import('./charts/activity-heatmap').then((mod) => ({ default: mod.ActivityHeatmap })),
  {
    loading: ChartLoadingFallback,
    ssr: false,
  }
)

export const ActivityHeatmapSkeleton = dynamic(
  () => import('./charts/activity-heatmap').then((mod) => ({ default: mod.ActivityHeatmapSkeleton })),
  {
    ssr: true,
  }
)

export const VisitorStatsCards = dynamic(
  () => import('./charts/visitor-stats-cards').then((mod) => ({ default: mod.VisitorStatsCards })),
  {
    loading: ChartLoadingFallback,
    ssr: true,
  }
)
