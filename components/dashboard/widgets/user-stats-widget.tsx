'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, UserPlus, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface UserStatsConfig {
  period?: '7d' | '30d' | '90d'
  showChart?: boolean
}

interface Stats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  growthPercentage: number
}

export function UserStatsWidget({ config }: WidgetProps) {
  const { period = '30d', showChart = true } = config as UserStatsConfig
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get users created in last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())

      // Get users who have logged in recently (active users)
      const { count: activeUsers } = await supabase
        .from('user_activity_logs')
        .select('user_id', { count: 'exact', head: true })
        .eq('action', 'login')
        .gte('created_at', thirtyDaysAgo.toISOString())

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsersThisMonth: newUsers || 0,
        growthPercentage: totalUsers ? Math.round(((newUsers || 0) / totalUsers) * 100) : 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [period])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Users className="h-6 w-6 animate-pulse text-muted-foreground" />
      </div>
    )
  }

  const statItems = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'New This Month',
      value: stats?.newUsersThisMonth || 0,
      icon: UserPlus,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
  ]

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h3 className="font-semibold text-sm sm:text-base text-foreground">User Statistics</h3>
        </div>
        {stats?.growthPercentage !== undefined && stats.growthPercentage > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
            <TrendingUp className="h-3 w-3" />
            +{stats.growthPercentage}%
          </div>
        )}
      </div>

      {/* Stats Grid - scrollable if overflow */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/30"
          >
            <div className={cn('p-1.5 sm:p-2 rounded-lg flex-shrink-0', item.bgColor)}>
              <item.icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', item.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Bar Chart - only show on larger cards */}
      {showChart && stats && (
        <div className="mt-3 pt-3 border-t border-border/50 flex-shrink-0 hidden sm:block">
          <div className="flex items-end justify-between gap-2 h-10 sm:h-12">
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary/20 rounded-t"
                style={{ height: `${Math.min((stats.totalUsers / 100) * 100, 100)}%` }}
              />
              <span className="text-[10px] text-muted-foreground mt-1">Total</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-green-500/20 rounded-t"
                style={{ height: `${Math.min((stats.newUsersThisMonth / stats.totalUsers) * 100, 100)}%` }}
              />
              <span className="text-[10px] text-muted-foreground mt-1">New</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500/20 rounded-t"
                style={{ height: `${Math.min((stats.activeUsers / stats.totalUsers) * 100, 100)}%` }}
              />
              <span className="text-[10px] text-muted-foreground mt-1">Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
