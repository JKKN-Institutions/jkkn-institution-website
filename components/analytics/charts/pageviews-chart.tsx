'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { AnalyticsCard } from '../analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateRange } from '../date-range-selector'
import { getPageViewStats } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import type { PageViewStats } from '@/lib/analytics/types'

interface PageviewsChartProps {
  className?: string
}

export function PageviewsChart({ className }: PageviewsChartProps) {
  const [data, setData] = useState<PageViewStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getPageViewStats(params)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch pageview stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Page Views', 'Unique Visitors'].join(','),
      ...data.map(row => [row.viewDate, row.totalViews, row.uniqueVisitors].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'pageview-stats.csv'
    link.click()
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.viewDate), 'MMM d'),
    fullDate: item.viewDate
  }))

  return (
    <AnalyticsCard
      title="Page Views"
      description="Daily page views and unique visitors"
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  totalViews: 'Page Views',
                  uniqueVisitors: 'Unique Visitors'
                }
                return [value, labels[name] || name]
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  totalViews: 'Page Views',
                  uniqueVisitors: 'Unique Visitors'
                }
                return labels[value] || value
              }}
            />
            <Area
              type="monotone"
              dataKey="totalViews"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#colorViews)"
            />
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              fill="url(#colorVisitors)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  )
}

// Loading skeleton
export function PageviewsChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  )
}
