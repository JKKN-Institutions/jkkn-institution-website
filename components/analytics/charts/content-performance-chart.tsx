'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { AnalyticsCard, ChartGrid } from '../analytics-card'
import { useDateRange } from '../date-range-selector'
import { getTopPages, getContentStats } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import { exportAnalyticsAsCSV, topPagesColumns } from '@/lib/analytics/export-utils'
import type { TopPageData, ContentStats } from '@/lib/analytics/types'

const STATUS_COLORS = {
  published: 'hsl(142, 76%, 36%)',  // Green
  draft: 'hsl(45, 93%, 47%)',       // Yellow/Amber
  archived: 'hsl(220, 14%, 46%)',   // Gray
  scheduled: 'hsl(262, 83%, 58%)'   // Purple
}

interface ContentPerformanceChartProps {
  className?: string
}

export function ContentPerformanceChart({ className }: ContentPerformanceChartProps) {
  const [topPages, setTopPages] = useState<TopPageData[]>([])
  const [contentStats, setContentStats] = useState<ContentStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const [pagesResult, statsResult] = await Promise.all([
          getTopPages(10),
          getContentStats(params)
        ])
        setTopPages(pagesResult)
        setContentStats(statsResult)
      } catch (error) {
        console.error('Failed to fetch content data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const handleExportCSV = () => {
    exportAnalyticsAsCSV(topPages, topPagesColumns, 'top-pages')
  }

  // Format data for bar chart
  const barChartData = topPages.map((page) => ({
    name: page.pageTitle.length > 25
      ? page.pageTitle.substring(0, 25) + '...'
      : page.pageTitle,
    views: page.viewCount,
    fullTitle: page.pageTitle
  }))

  // Format data for pie chart
  const pieChartData = contentStats ? [
    { name: 'Published', value: contentStats.publishedPages, fill: STATUS_COLORS.published },
    { name: 'Draft', value: contentStats.draftPages, fill: STATUS_COLORS.draft },
    { name: 'Archived', value: contentStats.archivedPages, fill: STATUS_COLORS.archived },
    { name: 'Scheduled', value: contentStats.scheduledPages, fill: STATUS_COLORS.scheduled }
  ].filter(item => item.value > 0) : []

  return (
    <ChartGrid columns={2} className={className}>
      {/* Top Pages Bar Chart */}
      <AnalyticsCard
        title="Top Pages by Views"
        description="Most viewed content pages"
        isLoading={isLoading}
        onExportCSV={handleExportCSV}
      >
        <div className="h-[300px] w-full">
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string, props) => [
                    `${value.toLocaleString()} views`,
                    props.payload.fullTitle
                  ]}
                />
                <Bar
                  dataKey="views"
                  fill="var(--chart-1)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No page view data available
            </div>
          )}
        </div>
      </AnalyticsCard>

      {/* Content Status Pie Chart */}
      <AnalyticsCard
        title="Content Status Distribution"
        description={contentStats ? `${contentStats.totalPages} total pages` : 'Loading...'}
        isLoading={isLoading}
      >
        <div className="h-[300px] w-full">
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieChartData.map((entry, index) => (
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
                  formatter={(value: number, name: string) => [
                    `${value} pages`,
                    name
                  ]}
                />
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  formatter={(value, entry) => {
                    const item = pieChartData.find((d) => d.name === value)
                    return `${value}: ${item?.value || 0}`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No content data available
            </div>
          )}
        </div>
      </AnalyticsCard>
    </ChartGrid>
  )
}

// Simple content stats cards
interface ContentStatsCardsProps {
  className?: string
}

export function ContentStatsCards({ className }: ContentStatsCardsProps) {
  const [stats, setStats] = useState<ContentStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getContentStats(params)
        setStats(result)
      } catch (error) {
        console.error('Failed to fetch content stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  if (isLoading || !stats) {
    return null
  }

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <StatCard label="Total Pages" value={stats.totalPages} />
      <StatCard label="Published" value={stats.publishedPages} color="green" />
      <StatCard label="Drafts" value={stats.draftPages} color="yellow" />
      <StatCard label="Created This Period" value={stats.pagesCreatedInPeriod} color="blue" />
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'default'
}: {
  label: string
  value: number
  color?: 'default' | 'green' | 'yellow' | 'blue'
}) {
  const colorClasses = {
    default: 'text-foreground',
    green: 'text-green-600',
    yellow: 'text-amber-600',
    blue: 'text-blue-600'
  }

  return (
    <div className="rounded-lg border bg-card/50 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  )
}
