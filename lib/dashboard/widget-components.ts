import { ComponentType } from 'react'
import type { WidgetProps } from './widget-registry'

// Lazy load widget components
import { UserStatsWidget } from '@/components/dashboard/widgets/user-stats-widget'
import { ContentMetricsWidget } from '@/components/dashboard/widgets/content-metrics-widget'
import { RecentActivityWidget } from '@/components/dashboard/widgets/recent-activity-widget'
import { QuickActionsWidget } from '@/components/dashboard/widgets/quick-actions-widget'
import { SystemHealthWidget } from '@/components/dashboard/widgets/system-health-widget'
import { NotificationsCenterWidget } from '@/components/dashboard/widgets/notifications-widget'
import { WelcomeBannerWidget } from '@/components/dashboard/widgets/welcome-banner-widget'

// Map widget keys to their React components
export const WIDGET_COMPONENTS: Record<string, ComponentType<WidgetProps>> = {
  user_stats: UserStatsWidget,
  content_metrics: ContentMetricsWidget,
  recent_activity: RecentActivityWidget,
  quick_actions_general: QuickActionsWidget,
  system_health: SystemHealthWidget,
  notifications_center: NotificationsCenterWidget,
  welcome_banner: WelcomeBannerWidget,
}

// Get widget component by key
export function getWidgetComponent(widgetKey: string): ComponentType<WidgetProps> | null {
  return WIDGET_COMPONENTS[widgetKey] || null
}

// Check if widget component exists
export function hasWidgetComponent(widgetKey: string): boolean {
  return widgetKey in WIDGET_COMPONENTS
}
