'use client'

import { useEffect, useState } from 'react'
import { Activity, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'

interface ActivityLog {
  id: string
  action: string
  module: string
  resource_type: string | null
  created_at: string
  user_id: string
  metadata: Record<string, unknown> | null
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500',
  view: 'bg-gray-500',
  login: 'bg-green-500',
  logout: 'bg-gray-500',
}

export function RecentActivitySection() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchActivities() {
      try {
        const { data, error } = await supabase
          .from('user_activity_logs')
          .select('id, action, module, resource_type, created_at, user_id, metadata')
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setActivities(data || [])
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()

    // Real-time subscription
    const channel = supabase
      .channel('recent-activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_activity_logs' },
        (payload) => {
          setActivities((prev) => [payload.new as ActivityLog, ...prev.slice(0, 4)])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full">
      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-2 h-2 rounded-full mt-2" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => {
            const userName = (activity.metadata?.user_name as string) || 'User'
            const dotColor = ACTION_COLORS[activity.action] || 'bg-gray-500'

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', dotColor)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{userName}</span>{' '}
                    <span className="text-muted-foreground">
                      {activity.action} {activity.resource_type && `${activity.resource_type} in `}
                      <span className="text-primary">{activity.module}</span>
                    </span>
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span suppressHydrationWarning>
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 rounded-full bg-muted mb-3">
            <Activity className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Activity logs will appear here
          </p>
        </div>
      )}
    </div>
  )
}
