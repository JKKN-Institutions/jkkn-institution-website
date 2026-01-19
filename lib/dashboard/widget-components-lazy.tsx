import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import type { WidgetProps } from './widget-registry'

// Dynamic imports for all widget components - loads only when needed
const UserStatsWidget = dynamic(
  () =>
    import('@/components/dashboard/widgets/user-stats-widget').then(
      (mod) => mod.UserStatsWidget
    ),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg" />,
  }
)

const ContentMetricsWidget = dynamic(
  () =>
    import('@/components/dashboard/widgets/content-metrics-widget').then(
      (mod) => mod.ContentMetricsWidget
    ),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg" />,
  }
)

const RecentActivityWidget = dynamic(
  () =>
    import('@/components/dashboard/widgets/recent-activity-widget').then(
      (mod) => mod.RecentActivityWidget
    ),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg" />,
  }
)

const QuickActionsWidget = dynamic(
  () =>
    import('@/components/dashboard/widgets/quick-actions-widget').then(
      (mod) => mod.QuickActionsWidget
    ),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg" />,
  }
)

const SystemHealthWidget = dynamic(
  () =>
    import('@/components/dashboard/widgets/system-health-widget').then(
      (mod) => mod.SystemHealthWidget
    ),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg" />,
  }
)

const NotificationsCenterWidget = dynamic(
  () =>
    import('@/components/dashboard/widgets/notifications-widget').then(
      (mod) => mod.NotificationsCenterWidget
    ),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg" />,
  }
)

const WelcomeBannerWidget = dynamic(
  () =>
    import('@/components/dashboard/widgets/welcome-banner-widget').then(
      (mod) => mod.WelcomeBannerWidget
    ),
  {
    loading: () => <div className="h-full w-full animate-pulse bg-muted/10 rounded-lg" />,
  }
)

// Map widget keys to their dynamically imported React components
export const WIDGET_COMPONENTS_LAZY: Record<string, ComponentType<WidgetProps>> = {
  user_stats: UserStatsWidget,
  content_metrics: ContentMetricsWidget,
  recent_activity: RecentActivityWidget,
  quick_actions_general: QuickActionsWidget,
  system_health: SystemHealthWidget,
  notifications_center: NotificationsCenterWidget,
  welcome_banner: WelcomeBannerWidget,
}

// Get widget component by key (dynamically loaded)
export function getWidgetComponent(widgetKey: string): ComponentType<WidgetProps> | null {
  return WIDGET_COMPONENTS_LAZY[widgetKey] || null
}

// Check if widget component exists
export function hasWidgetComponent(widgetKey: string): boolean {
  return widgetKey in WIDGET_COMPONENTS_LAZY
}
