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
  ResponsiveContainer
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { AnalyticsCard } from '../analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateRange } from '../date-range-selector'
import { getUserGrowthData } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import { exportAnalyticsAsCSV, userGrowthColumns } from '@/lib/analytics/export-utils'
import type { UserGrowthData } from '@/lib/analytics/types'

interface UserGrowthChartProps {
  className?: string
}

export function UserGrowthChart({ className }: UserGrowthChartProps) {
  const [data, setData] = useState<UserGrowthData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getUserGrowthData(params)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch user growth data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const handleExportCSV = () => {
    exportAnalyticsAsCSV(data, userGrowthColumns, 'user-growth-data')
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.periodDate), 'MMM d'),
    fullDate: item.periodDate
  }))

  return (
    <AnalyticsCard
      title="User Growth"
      description="New and active users over time"
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
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
                  newUsers: 'New Users',
                  activeUsers: 'Active Users',
                  cumulativeTotal: 'Total Users'
                }
                return [value, labels[name] || name]
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  newUsers: 'New Users',
                  activeUsers: 'Active Users',
                  cumulativeTotal: 'Total Users'
                }
                return labels[value] || value
              }}
            />
            <Line
              type="monotone"
              dataKey="newUsers"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="activeUsers"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="cumulativeTotal"
              stroke="var(--chart-3)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  )
}

// Loading skeleton
export function UserGrowthChartSkeleton() {
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
