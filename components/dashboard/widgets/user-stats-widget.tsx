'use client'

import { useEffect, useState } from 'react'
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface Stats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
}

export function UserStatsWidget({ config }: WidgetProps) {
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
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
          <Users className="relative h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>
    )
  }

  const statItems = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      trend: '+12%',
    },
    {
      label: 'New This Month',
      value: stats?.newUsersThisMonth || 0,
      icon: UserPlus,
      trend: '+5%',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      trend: '+8%',
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header with Glass Effect */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">User Statistics</h3>
            <p className="text-[10px] text-muted-foreground">Last 30 days</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/5 text-[10px] font-medium text-primary">
          <TrendingUp className="h-3 w-3" />
          <span>Growing</span>
        </div>
      </div>

      {/* Stats Grid - Glassmorphism Cards */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {statItems.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300',
              'bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5',
              'backdrop-blur-sm border border-primary/10 dark:border-primary/20',
              'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5'
            )}
          >
            {/* Icon with glow */}
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <item.icon className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>

            {/* Value */}
            <p className="text-xl font-bold text-foreground tabular-nums">
              {item.value}
            </p>

            {/* Label */}
            <p className="text-[9px] text-muted-foreground text-center leading-tight mt-0.5">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
