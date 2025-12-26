'use client'

import { useEffect, useState, useMemo } from 'react'
import { format, parseISO, startOfWeek, eachDayOfInterval, getDay } from 'date-fns'
import { cn } from '@/lib/utils'
import { AnalyticsCard } from '../analytics-card'
import { useDateRange } from '../date-range-selector'
import { getActivityHeatmapData, getAvailableModules } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import { exportAnalyticsAsCSV, activityHeatmapColumns } from '@/lib/analytics/export-utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import type { ActivityHeatmapData } from '@/lib/analytics/types'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface ActivityHeatmapProps {
  className?: string
}

export function ActivityHeatmap({ className }: ActivityHeatmapProps) {
  const [data, setData] = useState<ActivityHeatmapData[]>([])
  const [modules, setModules] = useState<string[]>([])
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchModules() {
      try {
        const result = await getAvailableModules()
        setModules(result)
      } catch (error) {
        console.error('Failed to fetch modules:', error)
      }
    }
    fetchModules()
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = {
          ...dateRangeToParams(dateRange),
          module: selectedModule === 'all' ? undefined : selectedModule
        }
        const result = await getActivityHeatmapData(params)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange, selectedModule])

  const handleExportCSV = () => {
    exportAnalyticsAsCSV(data, activityHeatmapColumns, 'activity-heatmap')
  }

  // Calculate max activity for color scaling
  const maxActivity = useMemo(() => {
    return Math.max(...data.map((d) => d.activityCount), 1)
  }, [data])

  // Create a map for quick lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((d) => {
      map.set(d.activityDate, d.activityCount)
    })
    return map
  }, [data])

  // Generate weeks for display
  const weeks = useMemo(() => {
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })

    // Group by week
    const weekMap = new Map<string, Date[]>()
    days.forEach((day) => {
      const weekStart = startOfWeek(day)
      const weekKey = format(weekStart, 'yyyy-MM-dd')
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, [])
      }
      weekMap.get(weekKey)!.push(day)
    })

    return Array.from(weekMap.entries()).map(([weekStart, days]) => ({
      weekStart,
      days
    }))
  }, [dateRange])

  return (
    <AnalyticsCard
      title="Activity Heatmap"
      description="Daily activity intensity over time"
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      headerActions={
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue placeholder="All Modules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module.charAt(0).toUpperCase() + module.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      className={className}
    >
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Day labels */}
          <div className="flex mb-2">
            <div className="w-10" /> {/* Spacer for alignment */}
            {DAY_NAMES.map((day) => (
              <div
                key={day}
                className="flex-1 text-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {weeks.map(({ weekStart, days }) => (
              <div key={weekStart} className="flex items-center">
                {/* Week label */}
                <div className="w-10 text-xs text-muted-foreground pr-2">
                  {format(parseISO(weekStart), 'MMM d')}
                </div>

                {/* Days grid */}
                <div className="flex-1 grid grid-cols-7 gap-1">
                  {DAY_NAMES.map((_, dayIndex) => {
                    const day = days.find((d) => getDay(d) === dayIndex)

                    if (!day) {
                      return <div key={dayIndex} className="aspect-square" />
                    }

                    const dateKey = format(day, 'yyyy-MM-dd')
                    const count = activityMap.get(dateKey) || 0

                    return (
                      <HeatmapCell
                        key={dateKey}
                        date={day}
                        count={count}
                        maxCount={maxActivity}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((level) => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: getColorForLevel(level)
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </AnalyticsCard>
  )
}

interface HeatmapCellProps {
  date: Date
  count: number
  maxCount: number
}

function HeatmapCell({ date, count, maxCount }: HeatmapCellProps) {
  const level = maxCount > 0 ? count / maxCount : 0
  const backgroundColor = getColorForLevel(level)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'aspect-square rounded-sm cursor-default transition-colors',
              count > 0 && 'hover:ring-2 hover:ring-primary/50'
            )}
            style={{ backgroundColor }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{format(date, 'EEEE, MMM d, yyyy')}</p>
            <p className="text-muted-foreground">
              {count} {count === 1 ? 'activity' : 'activities'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function getColorForLevel(level: number): string {
  // Color scale from gray to green
  if (level === 0) {
    return 'hsl(220, 14%, 90%)' // Light gray
  }

  // Interpolate from light green to dark green
  const hue = 142
  const saturation = 40 + level * 36 // 40 to 76
  const lightness = 70 - level * 35 // 70 to 35

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// Activity Heatmap Skeleton
export function ActivityHeatmapSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-[140px]" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-4 w-10" />
            <div className="flex-1 grid grid-cols-7 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <Skeleton key={j} className="aspect-square rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
