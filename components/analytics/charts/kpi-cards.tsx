'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  Activity,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatsGrid } from '../analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateRange } from '../date-range-selector'
import { getKPIData } from '@/app/actions/analytics'
import { dateRangeToParams, formatAnalyticsNumber, calculatePercentageChange } from '@/lib/analytics/date-presets'
import type { KPIData } from '@/lib/analytics/types'

interface KPICardsProps {
  className?: string
}

const ICON_MAP: Record<string, React.ReactNode> = {
  new_users: <Users className="h-5 w-5" />,
  total_activities: <Activity className="h-5 w-5" />,
  published_pages: <FileText className="h-5 w-5" />,
  inquiries: <MessageSquare className="h-5 w-5" />
}

const COLOR_MAP: Record<string, string> = {
  new_users: 'bg-blue-500/10 text-blue-500',
  total_activities: 'bg-green-500/10 text-green-500',
  published_pages: 'bg-purple-500/10 text-purple-500',
  inquiries: 'bg-orange-500/10 text-orange-500'
}

export function KPICards({ className }: KPICardsProps) {
  const [data, setData] = useState<KPIData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getKPIData(params)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch KPI data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  if (isLoading) {
    return (
      <StatsGrid className={className}>
        {[1, 2, 3, 4].map((i) => (
          <KPICardSkeleton key={i} />
        ))}
      </StatsGrid>
    )
  }

  return (
    <StatsGrid className={className}>
      {data.map((kpi) => (
        <KPICardItem key={kpi.id} kpi={kpi} />
      ))}
    </StatsGrid>
  )
}

interface KPICardItemProps {
  kpi: KPIData
}

function KPICardItem({ kpi }: KPICardItemProps) {
  const trend = calculatePercentageChange(kpi.currentValue, kpi.previousValue)
  const icon = ICON_MAP[kpi.id] || <Activity className="h-5 w-5" />
  const colorClass = COLOR_MAP[kpi.id] || 'bg-primary/10 text-primary'

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <p className="text-2xl font-bold">
            {formatAnalyticsNumber(kpi.currentValue, kpi.format)}
          </p>
        </div>
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center',
            colorClass
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <TrendBadge direction={trend.direction} value={trend.value} />
        <span className="text-xs text-muted-foreground">vs previous period</span>
      </div>
    </div>
  )
}

interface TrendBadgeProps {
  direction: 'up' | 'down' | 'neutral'
  value: number
}

function TrendBadge({ direction, value }: TrendBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded',
        direction === 'up' && 'bg-green-500/10 text-green-600',
        direction === 'down' && 'bg-red-500/10 text-red-600',
        direction === 'neutral' && 'bg-muted text-muted-foreground'
      )}
    >
      {direction === 'up' && <TrendingUp className="h-3 w-3" />}
      {direction === 'down' && <TrendingDown className="h-3 w-3" />}
      {direction === 'neutral' && <Minus className="h-3 w-3" />}
      <span>{value}%</span>
    </div>
  )
}

function KPICardSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="mt-3">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}

// Exported skeleton for Suspense fallback
export function KPICardsSkeleton() {
  return (
    <StatsGrid>
      {[1, 2, 3, 4].map((i) => (
        <KPICardSkeleton key={i} />
      ))}
    </StatsGrid>
  )
}

// Single KPI Card for custom usage
interface SingleKPICardProps {
  label: string
  value: number
  previousValue?: number
  format?: 'number' | 'percentage' | 'currency'
  icon?: React.ReactNode
  colorClass?: string
  isLoading?: boolean
}

export function SingleKPICard({
  label,
  value,
  previousValue = 0,
  format = 'number',
  icon,
  colorClass = 'bg-primary/10 text-primary',
  isLoading = false
}: SingleKPICardProps) {
  if (isLoading) {
    return <KPICardSkeleton />
  }

  const trend = calculatePercentageChange(value, previousValue)

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">
            {formatAnalyticsNumber(value, format)}
          </p>
        </div>
        {icon && (
          <div
            className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center',
              colorClass
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {previousValue !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <TrendBadge direction={trend.direction} value={trend.value} />
          <span className="text-xs text-muted-foreground">vs previous period</span>
        </div>
      )}
    </div>
  )
}
