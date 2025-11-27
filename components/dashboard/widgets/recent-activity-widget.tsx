'use client'

import { useEffect, useState } from 'react'
import { Activity, ArrowUpRight, RefreshCw } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
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
  profiles: { full_name: string | null; email: string } | null
}

interface RecentActivityConfig {
  maxItems?: number
  showFilters?: boolean
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  view: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  login: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  logout: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export function RecentActivityWidget({ config }: WidgetProps) {
  const { maxItems = 10 } = config as RecentActivityConfig
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClient()

  const fetchActivities = async () => {
    const { data } = await supabase
      .from('user_activity_logs')
      .select('*, profiles:user_id(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(maxItems)

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
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h3 className="font-semibold text-sm sm:text-base text-foreground">Recent Activity</h3>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors touch-target-sm"
            disabled={refreshing}
          >
            <RefreshCw className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground', refreshing && 'animate-spin')} />
          </button>
          <Link
            href="/admin/activity"
            className="text-[10px] sm:text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Link>
        </div>
      </div>

      {/* Activity List - scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={cn('px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0', ACTION_COLORS[activity.action] || ACTION_COLORS.view)}>
                {activity.action}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-foreground line-clamp-2">
                  <span className="font-medium">
                    {activity.profiles?.full_name || 'Unknown user'}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {activity.resource_type && `${activity.resource_type} in `}
                    <span className="text-primary">{activity.module}</span>
                  </span>
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-4 sm:py-8">
            <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30 mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  )
}
