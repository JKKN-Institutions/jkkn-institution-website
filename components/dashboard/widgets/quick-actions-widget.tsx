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
  ArrowRight,
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
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
          <Zap className="relative h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header with Glass Effect */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Quick Actions</h3>
            <p className="text-[10px] text-muted-foreground">Shortcuts</p>
          </div>
        </div>
      </div>

      {/* Actions Grid - Glassmorphism Cards */}
      <div className={cn(
        'flex-1 min-h-0 overflow-y-auto',
        layout === 'grid' ? 'grid grid-cols-2 gap-2 auto-rows-max content-start' : 'flex flex-col gap-2'
      )}>
        {filteredActions.length > 0 ? (
          filteredActions.map((action, index) => {
            const Icon = ICON_MAP[action.icon] || Zap

            return (
              <Link
                key={action.id}
                href={action.link}
                className={cn(
                  'group relative flex items-center p-3 rounded-xl transition-all duration-300',
                  'bg-gradient-to-br from-white/50 to-white/20 dark:from-white/10 dark:to-white/5',
                  'backdrop-blur-sm border border-primary/10 dark:border-primary/20',
                  'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5',
                  'hover:from-primary/5 dark:hover:from-primary/15',
                  layout === 'grid' ? 'flex-col text-center gap-2' : 'gap-3'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={cn(
                    'relative p-2 rounded-xl transition-all duration-300',
                    'bg-primary/10 group-hover:bg-primary group-hover:shadow-brand',
                    layout === 'grid' ? 'p-2.5' : 'p-2'
                  )}>
                    <Icon className={cn(
                      'transition-colors duration-300 text-primary group-hover:text-white',
                      layout === 'grid' ? 'h-5 w-5' : 'h-4 w-4'
                    )} />
                  </div>
                </div>

                {/* Label */}
                <span className={cn(
                  'font-medium text-foreground group-hover:text-primary transition-colors',
                  layout === 'grid' ? 'text-xs' : 'text-sm flex-1'
                )}>
                  {action.label}
                </span>

                {/* Arrow for list layout */}
                {layout === 'list' && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                )}
              </Link>
            )
          })
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center h-full text-center py-8">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
              <div className="relative p-4 rounded-2xl bg-primary/5 backdrop-blur-sm">
                <Zap className="h-8 w-8 text-primary/30" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">No actions available</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Actions will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
