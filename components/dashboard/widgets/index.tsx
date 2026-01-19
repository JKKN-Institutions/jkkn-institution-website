'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import type { WidgetProps, WidgetComponentMap } from '@/lib/dashboard/widget-registry'

// Widget loading fallback
const WidgetLoadingFallback = () => (
  <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg flex items-center justify-center">
    <div className="text-center text-muted-foreground">
      <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-2" />
      <p className="text-sm">Loading widget...</p>
    </div>
  </div>
)

// Dynamically import all widget components - loads only when needed
const WelcomeBannerWidget = dynamic(
  () => import('./welcome-banner-widget').then((mod) => mod.WelcomeBannerWidget),
  { loading: WidgetLoadingFallback, ssr: true }
)

const RecentActivityWidget = dynamic(
  () => import('./recent-activity-widget').then((mod) => mod.RecentActivityWidget),
  { loading: WidgetLoadingFallback, ssr: true }
)

const QuickActionsWidget = dynamic(
  () => import('./quick-actions-widget').then((mod) => mod.QuickActionsWidget),
  { loading: WidgetLoadingFallback, ssr: true }
)

const UserStatsWidget = dynamic(
  () => import('./user-stats-widget').then((mod) => mod.UserStatsWidget),
  { loading: WidgetLoadingFallback, ssr: true }
)

const NotificationsCenterWidget = dynamic(
  () => import('./notifications-widget').then((mod) => mod.NotificationsCenterWidget),
  { loading: WidgetLoadingFallback, ssr: true }
)

const ContentMetricsWidget = dynamic(
  () => import('./content-metrics-widget').then((mod) => mod.ContentMetricsWidget),
  { loading: WidgetLoadingFallback, ssr: true }
)

const SystemHealthWidget = dynamic(
  () => import('./system-health-widget').then((mod) => mod.SystemHealthWidget),
  { loading: WidgetLoadingFallback, ssr: true }
)

// Widget component registry with lazy-loaded components
export const WIDGET_COMPONENTS: WidgetComponentMap = {
  WelcomeBannerWidget,
  RecentActivityWidget,
  QuickActionsWidget,
  UserStatsWidget,
  NotificationsCenterWidget,
  ContentMetricsWidget,
  SystemHealthWidget,
  // Placeholder widgets - to be implemented later (use lazy loaded components)
  PendingApprovalsWidget: WelcomeBannerWidget,
  MyTasksWidget: WelcomeBannerWidget,
  EventCalendarWidget: WelcomeBannerWidget,
  RecentUsersTableWidget: RecentActivityWidget,
  RecentPagesTableWidget: RecentActivityWidget,
  RecentEventsTableWidget: RecentActivityWidget,
  ContentShortcutsWidget: QuickActionsWidget,
}

// Get widget component by name (returns lazy-loaded component)
export function getWidgetComponent(componentName: string): ComponentType<WidgetProps> | null {
  return WIDGET_COMPONENTS[componentName] || null
}

// Import skeleton components (keep static for faster initial render)
import { WidgetSkeleton, DashboardSkeleton } from './widget-skeleton'

// Re-export lazy-loaded widgets
export {
  WelcomeBannerWidget,
  RecentActivityWidget,
  QuickActionsWidget,
  UserStatsWidget,
  NotificationsCenterWidget,
  ContentMetricsWidget,
  SystemHealthWidget,
  WidgetSkeleton,
  DashboardSkeleton,
}
