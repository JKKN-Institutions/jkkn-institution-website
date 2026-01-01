'use client'

import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import { AnalyticsCard } from '../analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateRange } from '../date-range-selector'
import { getTrafficSources } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import type { TrafficSource } from '@/lib/analytics/types'

// Chart colors - using CSS variables directly (hex format)
const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#6b8ab8', // Blue-gray fallback
  '#4db6ac', // Teal fallback
  '#e57373'  // Red fallback
]

interface TrafficSourcesChartProps {
  className?: string
}

export function TrafficSourcesChart({ className }: TrafficSourcesChartProps) {
  const [data, setData] = useState<TrafficSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getTrafficSources(params, 8)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch traffic sources:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const handleExportCSV = () => {
    const csvContent = [
      ['Referrer', 'Visits', 'Percentage'].join(','),
      ...data.map(row => [
        `"${row.referrerDomain}"`,
        row.visitCount,
        row.percentage
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'traffic-sources.csv'
    link.click()
  }

  // Format data for chart
  const chartData = data.map((item, index) => ({
    name: item.referrerDomain,
    value: item.visitCount,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length]
  }))

  const totalVisits = data.reduce((sum, item) => sum + item.visitCount, 0)

  return (
    <AnalyticsCard
      title="Traffic Sources"
      description="Where your visitors come from"
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No traffic data recorded yet
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Pie Chart */}
          <div className="h-[250px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toLocaleString()} visits (${((value / totalVisits) * 100).toFixed(1)}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend List */}
          <div className="flex-1 space-y-2">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium">
                    {item.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnalyticsCard>
  )
}

export function TrafficSourcesChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="h-[250px] flex-1" />
        <div className="flex-1 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
