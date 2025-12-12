'use client'

import { useEffect, useState } from 'react'
import { Users, UserCheck, MessageSquare, Eye, TrendingUp, TrendingDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface Stats {
  totalUsers: number
  activeUsers: number
  pendingInquiries: number
  pageViews: number
  totalUsersChange: number
  activeUsersChange: number
  pendingInquiriesChange: number
  pageViewsChange: number
}

export function DashboardStatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // Get users created in last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Get users who have logged in recently (active users)
        const { count: activeUsers } = await supabase
          .from('user_activity_logs')
          .select('user_id', { count: 'exact', head: true })
          .eq('action', 'login')
          .gte('created_at', thirtyDaysAgo.toISOString())

        // Get pending inquiries count
        const { count: pendingInquiries } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        // Get page views (simulate for now)
        const pageViews = 2540

        setStats({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          pendingInquiries: pendingInquiries || 0,
          pageViews,
          totalUsersChange: 12,
          activeUsersChange: 5,
          pendingInquiriesChange: -2,
          pageViewsChange: 18,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      change: stats?.totalUsersChange || 0,
      bgColor: 'bg-blue-500',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      change: stats?.activeUsersChange || 0,
      bgColor: 'bg-yellow-500',
    },
    {
      label: 'Pending Inquiries',
      value: stats?.pendingInquiries || 0,
      icon: MessageSquare,
      change: stats?.pendingInquiriesChange || 0,
      bgColor: 'bg-purple-500',
    },
    {
      label: 'Page Views',
      value: stats?.pageViews || 0,
      icon: Eye,
      change: stats?.pageViewsChange || 0,
      bgColor: 'bg-green-500',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border min-w-0">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={cn(
            'relative flex items-center justify-between p-5 rounded-xl transition-all duration-300 min-w-0',
            'bg-card border border-border',
            'hover:shadow-lg hover:-translate-y-0.5'
          )}
        >
          {/* Left side - Stats */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {item.label}
            </p>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {item.value.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              {item.change >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={cn(
                'text-xs font-medium',
                item.change >= 0 ? 'text-green-500' : 'text-red-500'
              )}>
                {item.change >= 0 ? '+' : ''}{item.change}%
              </span>
              <span className="text-xs text-muted-foreground">
                from last week
              </span>
            </div>
          </div>

          {/* Right side - Icon */}
          <div className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full',
            item.bgColor
          )}>
            <item.icon className="h-6 w-6 text-white" />
          </div>
        </div>
      ))}
    </div>
  )
}
