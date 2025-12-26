'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartExportButton } from './export-button'

interface AnalyticsCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  onExportCSV?: () => void
  onExportPDF?: () => void
  headerActions?: React.ReactNode
}

export const AnalyticsCard = forwardRef<HTMLDivElement, AnalyticsCardProps>(
  function AnalyticsCard(
    {
      title,
      description,
      children,
      className,
      isLoading = false,
      onExportCSV,
      onExportPDF,
      headerActions
    },
    ref
  ) {
    const hasExport = onExportCSV || onExportPDF

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {hasExport && (
              <ChartExportButton
                onExportCSV={onExportCSV}
                onExportPDF={onExportPDF}
              />
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <AnalyticsCardSkeleton />
        ) : (
          <div className="min-h-[200px]">{children}</div>
        )}
      </div>
    )
  }
)

function AnalyticsCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full" />
    </div>
  )
}

// KPI Card variant
interface KPICardProps {
  label: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  className?: string
  isLoading?: boolean
}

export function KPICard({
  label,
  value,
  trend,
  icon,
  className,
  isLoading = false
}: KPICardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm',
          className
        )}
      >
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' && 'text-green-600',
              trend.direction === 'down' && 'text-red-600',
              trend.direction === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">vs previous period</span>
        </div>
      )}
    </div>
  )
}

// Stats grid for overview
interface StatsGridProps {
  children: React.ReactNode
  className?: string
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}

// Chart grid for layout
interface ChartGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3
}

export function ChartGrid({ children, className, columns = 2 }: ChartGridProps) {
  return (
    <div
      className={cn(
        'grid gap-6',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 lg:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}
