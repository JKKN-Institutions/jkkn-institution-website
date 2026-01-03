'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { AnalyticsCard } from '../analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { getRoleDistribution } from '@/app/actions/analytics'
import { exportAnalyticsAsCSV, roleDistributionColumns } from '@/lib/analytics/export-utils'
import type { RoleDistributionData } from '@/lib/analytics/types'

// Chart colors - using CSS variables directly (hex format)
const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#22c55e', // Green fallback
  '#8b5cf6', // Purple fallback
  '#f97316'  // Orange fallback
]

interface RoleDistributionChartProps {
  className?: string
  onSliceClick?: (roleId: string) => void
}

export function RoleDistributionChart({
  className,
  onSliceClick
}: RoleDistributionChartProps) {
  const [data, setData] = useState<RoleDistributionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getRoleDistribution()
      setData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch role distribution'
      setError(message)
      console.error('RoleDistributionChart error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExportCSV = () => {
    exportAnalyticsAsCSV(data, roleDistributionColumns, 'role-distribution')
  }

  // Show error state
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Failed to load role distribution</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 gap-2"
          onClick={fetchData}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  // Format data for chart
  const chartData = data.map((item, index) => ({
    name: item.displayName,
    value: item.userCount,
    percentage: item.percentage,
    roleId: item.roleId,
    fill: COLORS[index % COLORS.length]
  }))

  const totalUsers = data.reduce((sum, item) => sum + item.userCount, 0)

  return (
    <AnalyticsCard
      title="Role Distribution"
      description={`${totalUsers} total users across ${data.length} roles`}
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              onClick={(entry) => {
                if (onSliceClick && entry.roleId) {
                  onSliceClick(entry.roleId)
                }
              }}
              style={{ cursor: onSliceClick ? 'pointer' : 'default' }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number, name: string, props) => {
                const item = props.payload
                return [`${value} users (${item.percentage}%)`, name]
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value, entry) => {
                const item = chartData.find((d) => d.name === value)
                return (
                  <span className="text-sm">
                    {value} ({item?.value || 0})
                  </span>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsCard>
  )
}

// Loading skeleton
export function RoleDistributionChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center justify-center h-[300px]">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />
      </div>
    </div>
  )
}
