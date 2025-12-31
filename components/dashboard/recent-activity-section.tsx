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
  user_full_name: string | null
  user_email: string | null
  user_avatar_url: string | null
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500',
  view: 'bg-gray-500',
  login: 'bg-green-500',
  logout: 'bg-gray-500',
  publish: 'bg-emerald-500',
  unpublish: 'bg-orange-500',
  edit_content: 'bg-blue-500',
  duplicate: 'bg-purple-500',
  upload: 'bg-cyan-500',
  upload_batch: 'bg-cyan-500',
}

export function RecentActivitySection() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchActivities() {
      try {
        // Use database function that bypasses RLS and includes user profiles
        const { data, error } = await supabase.rpc('get_recent_activity_with_profiles', {
          activity_limit: 5
        })

        if (error) throw error
        setActivities((data as ActivityLog[]) || [])
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()

    // Real-time subscription for new activities
    const channel = supabase
      .channel('recent-activity')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_activity_logs' },
        async () => {
          // Refetch all activities to get the new one with profile info
          const { data } = await supabase.rpc('get_recent_activity_with_profiles', {
            activity_limit: 5
          })
          if (data) {
            setActivities(data as ActivityLog[])
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Activity</h2>
      </div>

      {loading ? (
        <div className="space-y-6">
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
        <div className="relative space-y-0 before:absolute before:inset-0 before:ml-[5px] before:h-full before:w-[1px] before:bg-gradient-to-b before:from-gray-200 before:to-transparent dark:before:from-gray-800">
          {activities.map((activity) => {
            // Get user name from the database function response
            const userName = activity.user_full_name || activity.user_email || 'Unknown User'
            const dotColor = ACTION_COLORS[activity.action] || 'bg-gray-400'

            // Get resource title from metadata if available
            const resourceTitle = (activity.metadata?.title as string) ||
                                  (activity.metadata?.name as string) ||
                                  (activity.metadata?.slug as string) ||
                                  activity.resource_type

            return (
              <div key={activity.id} className="relative pl-6 pb-6 last:pb-0 group">
                {/* Timeline Dot */}
                <span className={cn(
                  "absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full border-2 border-white dark:border-zinc-900 bg-white dark:bg-zinc-900 shadow-sm z-10",
                  "after:absolute after:inset-0 after:rounded-full after:bg-current after:content-['']",
                  dotColor.replace('bg-', 'text-')
                )} />

                <div className="flex flex-col gap-1 p-3 -mt-2 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 hover:underline cursor-pointer">{userName}</span>
                    <span className="text-gray-500 mx-1">•</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {activity.action.replace(/_/g, ' ')} {resourceTitle && `"${resourceTitle}"`}
                    </span>
                  </p>

                  {activity.module && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 uppercase tracking-wide">
                        {activity.module.replace(/:/g, ' › ')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-medium text-gray-400">
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-secondary/5 mb-4">
            <Activity className="h-8 w-8 text-secondary/40" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No recent activity</p>
          <p className="text-xs text-gray-500 mt-1">Actions will be logged here.</p>
        </div>
      )}
    </div>
  )
}
