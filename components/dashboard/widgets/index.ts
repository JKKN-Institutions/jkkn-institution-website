import { ComponentType } from 'react'
import type { WidgetProps, WidgetComponentMap } from '@/lib/dashboard/widget-registry'

// Import all widget components
import { WelcomeBannerWidget } from './welcome-banner-widget'
import { RecentActivityWidget } from './recent-activity-widget'
import { QuickActionsWidget } from './quick-actions-widget'
import { UserStatsWidget } from './user-stats-widget'
import { NotificationsCenterWidget } from './notifications-widget'
import { ContentMetricsWidget } from './content-metrics-widget'
import { SystemHealthWidget } from './system-health-widget'

// Widget component registry
export const WIDGET_COMPONENTS: WidgetComponentMap = {
  WelcomeBannerWidget,
  RecentActivityWidget,
  QuickActionsWidget,
  UserStatsWidget,
  NotificationsCenterWidget,
  ContentMetricsWidget,
  SystemHealthWidget,
  // Placeholder widgets - to be implemented later
  PendingApprovalsWidget: WelcomeBannerWidget,
  MyTasksWidget: WelcomeBannerWidget,
  EventCalendarWidget: WelcomeBannerWidget,
  RecentUsersTableWidget: RecentActivityWidget,
  RecentPagesTableWidget: RecentActivityWidget,
  RecentEventsTableWidget: RecentActivityWidget,
  ContentShortcutsWidget: QuickActionsWidget,
}

// Get widget component by name
export function getWidgetComponent(componentName: string): ComponentType<WidgetProps> | null {
  return WIDGET_COMPONENTS[componentName] || null
}

// Import skeleton components
import { WidgetSkeleton, DashboardSkeleton } from './widget-skeleton'

// Re-export all widgets
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
