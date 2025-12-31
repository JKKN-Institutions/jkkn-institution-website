'use client'

import { useEffect, useState } from 'react'
import { Users, UserCheck, MessageSquare, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { getDashboardStats } from '@/app/actions/dashboard-stats'

interface Stats {
  totalUsers: number
  activeUsers: number
  pendingInquiries: number
  totalPages: number
  totalUsersChange: number
  activeUsersChange: number
  pendingInquiriesChange: number
  totalPagesChange: number
}

export function DashboardStatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Use Server Action which bypasses RLS for accurate counts
        const data = await getDashboardStats()
        setStats(data)
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
      color: '#0b6d41',
      glassClasses: 'bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/60 dark:border-zinc-800 shadow-sm hover:border-[#0b6d41]/30',
      iconBg: 'bg-[#0b6d41]/10 text-[#0b6d41]',
      changeColor: 'text-[#0b6d41]',
    },
    {
      label: 'Active Users (30d)',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      change: stats?.activeUsersChange || 0,
      color: '#bfa100',
      glassClasses: 'bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/60 dark:border-zinc-800 shadow-sm hover:border-[#bfa100]/30',
      iconBg: 'bg-[#ffde59]/20 text-[#bfa100]',
      changeColor: 'text-[#bfa100]',
    },
    {
      label: 'Pending Inquiries',
      value: stats?.pendingInquiries || 0,
      icon: MessageSquare,
      change: stats?.pendingInquiriesChange || 0,
      color: '#0f8f56',
      glassClasses: 'bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/60 dark:border-zinc-800 shadow-sm hover:border-[#0f8f56]/30',
      iconBg: 'bg-[#0f8f56]/10 text-[#0f8f56]',
      changeColor: 'text-[#0f8f56]',
    },
    {
      label: 'Total Pages',
      value: stats?.totalPages || 0,
      icon: FileText,
      change: stats?.totalPagesChange || 0,
      color: '#085032',
      glassClasses: 'bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/60 dark:border-zinc-800 shadow-sm hover:border-[#085032]/30',
      iconBg: 'bg-[#085032]/10 text-[#085032]',
      changeColor: 'text-[#085032]',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/50 border border-gray-100 h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            <Skeleton className="w-16 h-6 rounded-full" />
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
            'relative overflow-hidden rounded-2xl transition-all duration-300',
            'hover:shadow-lg hover:-translate-y-0.5 group',
            item.glassClasses
          )}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {item.label}
                </p>
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 tabular-nums">
                  {item.value.toLocaleString()}
                </h3>
              </div>
              <div className={cn(
                "p-2.5 rounded-xl shadow-sm",
                item.iconBg
              )}>
                <item.icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 border border-gray-100 dark:border-white/5",
                item.change >= 0 ? "text-emerald-600" : "text-rose-600"
              )}>
                {item.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                <span>{Math.abs(Math.round(item.change))}%</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
