'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Zap,
  FilePlus,
  UserPlus,
  CalendarPlus,
  BarChart2,
  Shield,
  Image,
  Settings,
  Activity,
  LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface QuickAction {
  id: string
  action_key: string
  label: string
  icon: string
  link: string
  permission_required: string | null
  is_active: boolean
}

interface QuickActionsConfig {
  layout?: 'grid' | 'list'
  maxActions?: number
  userPermissions?: string[]
}

const ICON_MAP: Record<string, LucideIcon> = {
  'file-plus': FilePlus,
  'user-plus': UserPlus,
  'calendar-plus': CalendarPlus,
  'bar-chart-2': BarChart2,
  shield: Shield,
  image: Image,
  settings: Settings,
  activity: Activity,
  zap: Zap,
}

const ACTION_COLORS: Record<string, string> = {
  'create_page': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50',
  'create_user': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50',
  'create_event': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50',
  'view_analytics': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50',
  'manage_roles': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/50',
  'media_library': 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/50',
  'site_settings': 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-900/50',
  'view_activity': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
}

export function QuickActionsWidget({ config }: WidgetProps) {
  const { layout = 'grid', maxActions = 6, userPermissions = [] } = config as QuickActionsConfig
  const [actions, setActions] = useState<QuickAction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchActions() {
      const { data } = await supabase
        .from('dashboard_quick_actions')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(maxActions)

      setActions((data as QuickAction[]) || [])
      setLoading(false)
    }

    fetchActions()
  }, [maxActions])

  const hasPermission = (permission: string | null): boolean => {
    if (!permission) return true
    if (userPermissions.includes('*:*:*')) return true
    if (userPermissions.includes(permission)) return true

    const [module, resource, action] = permission.split(':')
    for (const perm of userPermissions) {
      const [permModule, permResource, permAction] = perm.split(':')
      if (permModule === '*' && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === '*' && permAction === '*') return true
      if (permModule === module && permResource === resource && permAction === '*') return true
    }
    return false
  }

  const filteredActions = actions.filter((action) => hasPermission(action.permission_required))

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Zap className="h-6 w-6 animate-pulse text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
        <h3 className="font-semibold text-sm sm:text-base text-foreground">Quick Actions</h3>
      </div>

      {/* Actions Grid/List - scrollable if overflow */}
      <div className={cn(
        'flex-1 min-h-0 overflow-y-auto',
        layout === 'grid' ? 'grid grid-cols-2 gap-2 auto-rows-max content-start' : 'flex flex-col gap-2'
      )}>
        {filteredActions.length > 0 ? (
          filteredActions.map((action) => {
            const Icon = ICON_MAP[action.icon] || Zap
            const colorClass = ACTION_COLORS[action.action_key] || 'bg-muted text-muted-foreground hover:bg-muted/80'

            return (
              <Link
                key={action.id}
                href={action.link}
                className={cn(
                  'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 touch-target',
                  colorClass,
                  layout === 'grid' ? 'flex-col text-center' : ''
                )}
              >
                <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0', layout === 'grid' && 'sm:h-6 sm:w-6')} />
                <span className={cn('text-xs sm:text-sm font-medium truncate', layout === 'grid' && 'text-[10px] sm:text-xs')}>
                  {action.label}
                </span>
              </Link>
            )
          })
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center h-full text-center py-4 sm:py-8">
            <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30 mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">No actions available</p>
          </div>
        )}
      </div>
    </div>
  )
}
