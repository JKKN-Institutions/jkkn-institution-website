'use client'

import { useEffect, useState } from 'react'
import { Activity, ArrowUpRight, RefreshCw, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface ActivityLog {
  id: string
  action: string
  module: string
  resource_type: string | null
  created_at: string
  user_id: string
  metadata: Record<string, unknown> | null
}

interface RecentActivityConfig {
  maxItems?: number
  showFilters?: boolean
}

// Brand colors only - primary (green) for positive actions
const ACTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  create: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  update: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  delete: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
  },
  view: {
    bg: 'bg-muted/50',
    text: 'text-muted-foreground',
    border: 'border-muted',
  },
  login: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  logout: {
    bg: 'bg-muted/50',
    text: 'text-muted-foreground',
    border: 'border-muted',
  },
}

export function RecentActivityWidget({ config }: WidgetProps) {
  const { maxItems = 10 } = config as RecentActivityConfig
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClient()

  const fetchActivities = async () => {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select('id, action, module, resource_type, created_at, user_id, metadata')
      .order('created_at', { ascending: false })
      .limit(maxItems)

    if (error) {
      console.error('Error fetching activities:', error)
      setLoading(false)
      setRefreshing(false)
      return
    }

    setActivities((data as ActivityLog[]) || [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchActivities()

    // Real-time subscription
    const channel = supabase
      .channel('activity-widget')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_activity_logs' },
        (payload) => {
          setActivities((prev) => [payload.new as ActivityLog, ...prev.slice(0, maxItems - 1)])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [maxItems])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchActivities()
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
          <RefreshCw className="relative h-6 w-6 animate-spin text-primary" />
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
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Recent Activity</h3>
            <p className="text-[10px] text-muted-foreground">Live updates</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className={cn(
              'p-2 rounded-lg transition-all duration-200',
              'bg-primary/5 hover:bg-primary/10 backdrop-blur-sm',
              'border border-transparent hover:border-primary/20'
            )}
            disabled={refreshing}
          >
            <RefreshCw className={cn('h-3.5 w-3.5 text-primary', refreshing && 'animate-spin')} />
          </button>
          <Link
            href="/admin/activity"
            className={cn(
              'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium',
              'bg-primary/5 hover:bg-primary/10 text-primary transition-all duration-200',
              'border border-transparent hover:border-primary/20'
            )}
          >
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Activity List - Glass Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const userName = (activity.metadata?.user_name as string) || 'User'
            const actionStyle = ACTION_COLORS[activity.action] || ACTION_COLORS.view

            return (
              <div
                key={activity.id}
                className={cn(
                  'group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-200',
                  'bg-gradient-to-br from-white/40 to-white/20 dark:from-white/5 dark:to-white/[0.02]',
                  'backdrop-blur-sm border border-primary/5 dark:border-primary/10',
                  'hover:border-primary/15 hover:shadow-sm hover:from-white/60 dark:hover:from-white/10'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Action Badge */}
                <div className={cn(
                  'px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex-shrink-0',
                  'backdrop-blur-sm border',
                  actionStyle.bg,
                  actionStyle.text,
                  actionStyle.border
                )}>
                  {activity.action}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">
                    <span className="font-semibold">{userName}</span>{' '}
                    <span className="text-muted-foreground">
                      {activity.resource_type && `${activity.resource_type} in `}
                      <span className="text-primary font-medium">{activity.module}</span>
                    </span>
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span suppressHydrationWarning>
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-3.5 w-3.5 text-primary/50" />
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
              <div className="relative p-4 rounded-2xl bg-primary/5 backdrop-blur-sm">
                <Activity className="h-8 w-8 text-primary/30" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Activities will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
