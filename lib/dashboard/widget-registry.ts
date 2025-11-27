import { ComponentType } from 'react'

// Widget category types
export type WidgetCategory = 'operational' | 'analytical' | 'data_table' | 'quick_action'

// Widget position in grid layout
export interface WidgetPosition {
  x: number
  y: number
  w: number
  h: number
}

// Widget configuration from database
export interface WidgetConfig {
  id: string
  widget_key: string
  name: string
  description: string | null
  category: WidgetCategory
  component_name: string
  default_config: Record<string, unknown>
  required_permissions: string[]
  min_width: number
  min_height: number
  max_width: number
  max_height: number
  is_active: boolean
}

// User's widget preference
export interface UserWidgetPreference {
  id: string
  widget_id: string
  user_id: string
  position: WidgetPosition
  config: Record<string, unknown> | null
  is_visible: boolean
}

// Props passed to each widget component
export interface WidgetProps {
  widgetId: string
  config: Record<string, unknown>
  onConfigChange?: (config: Record<string, unknown>) => void
  isEditing?: boolean
}

// Widget component registry type
export type WidgetComponentMap = Record<string, ComponentType<WidgetProps>>

// Dashboard layout item
export interface DashboardLayoutItem {
  i: string // Widget ID
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
}

// Permission checker helper
export function hasWidgetPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  if (requiredPermissions.length === 0) return true
  if (userPermissions.includes('*:*:*')) return true

  return requiredPermissions.every((required) => {
    if (userPermissions.includes(required)) return true

    const [module, resource, action] = required.split(':')

    for (const perm of userPermissions) {
      const [permModule, permResource, permAction] = perm.split(':')

      if (permModule === '*' && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === resource && permAction === '*') return true
    }

    return false
  })
}

// Default dashboard layouts per role
export const DEFAULT_LAYOUTS: Record<string, DashboardLayoutItem[]> = {
  super_admin: [
    { i: 'welcome_banner', x: 0, y: 0, w: 4, h: 1 },
    { i: 'user_stats', x: 0, y: 1, w: 2, h: 2 },
    { i: 'content_metrics', x: 2, y: 1, w: 2, h: 2 },
    { i: 'recent_activity', x: 0, y: 3, w: 2, h: 3 },
    { i: 'quick_actions_general', x: 2, y: 3, w: 2, h: 2 },
    { i: 'system_health', x: 2, y: 5, w: 2, h: 1 },
  ],
  director: [
    { i: 'welcome_banner', x: 0, y: 0, w: 4, h: 1 },
    { i: 'pending_approvals', x: 0, y: 1, w: 2, h: 2 },
    { i: 'event_calendar', x: 2, y: 1, w: 2, h: 2 },
    { i: 'recent_activity', x: 0, y: 3, w: 2, h: 3 },
    { i: 'quick_actions_general', x: 2, y: 3, w: 2, h: 2 },
  ],
  member: [
    { i: 'welcome_banner', x: 0, y: 0, w: 4, h: 1 },
    { i: 'my_tasks', x: 0, y: 1, w: 2, h: 2 },
    { i: 'notifications_center', x: 2, y: 1, w: 2, h: 2 },
    { i: 'event_calendar', x: 0, y: 3, w: 4, h: 2 },
  ],
  guest: [
    { i: 'welcome_banner', x: 0, y: 0, w: 4, h: 1 },
    { i: 'notifications_center', x: 0, y: 1, w: 2, h: 2 },
  ],
}

// Widget icons mapping
export const WIDGET_ICONS: Record<string, string> = {
  welcome_banner: 'sparkles',
  pending_approvals: 'clock',
  my_tasks: 'check-square',
  recent_activity: 'activity',
  notifications_center: 'bell',
  user_stats: 'users',
  content_metrics: 'bar-chart-2',
  event_calendar: 'calendar',
  system_health: 'heart-pulse',
  recent_users: 'user-plus',
  recent_pages: 'file-text',
  recent_events: 'calendar-check',
  quick_actions_general: 'zap',
  content_shortcuts: 'link',
}
