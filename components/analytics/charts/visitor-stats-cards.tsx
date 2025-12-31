'use client'

import { useEffect, useState } from 'react'
import { Eye, Users, TrendingUp, Globe } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateRange } from '../date-range-selector'
import { getVisitorOverview } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import type { VisitorOverview } from '@/lib/analytics/types'

export function VisitorStatsCards() {
  const [data, setData] = useState<VisitorOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getVisitorOverview(params)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch visitor overview:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  if (isLoading) {
    return <VisitorStatsCardsSkeleton />
  }

  const stats = [
    {
      label: 'Total Page Views',
      value: data?.totalPageviews?.toLocaleString() || '0',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Unique Visitors',
      value: data?.uniqueVisitors?.toLocaleString() || '0',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Avg Views/Day',
      value: data?.avgViewsPerDay?.toFixed(1) || '0',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Top Referrer',
      value: data?.topReferrer || 'Direct',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      isText: true
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              <p className={`font-semibold ${stat.isText ? 'text-sm truncate' : 'text-xl'}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function VisitorStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
