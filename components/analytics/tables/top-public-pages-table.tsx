'use client'

import { useEffect, useState } from 'react'
import { AnalyticsCard } from '../analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDateRange } from '../date-range-selector'
import { getTopPublicPages } from '@/app/actions/analytics'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import type { TopPublicPage } from '@/lib/analytics/types'

interface TopPublicPagesTableProps {
  className?: string
  limit?: number
}

export function TopPublicPagesTable({ className, limit = 10 }: TopPublicPagesTableProps) {
  const [data, setData] = useState<TopPublicPage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const dateRange = useDateRange()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const params = dateRangeToParams(dateRange)
        const result = await getTopPublicPages(params, limit)
        setData(result)
      } catch (error) {
        console.error('Failed to fetch top pages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange, limit])

  const handleExportCSV = () => {
    const csvContent = [
      ['Page Path', 'Page Title', 'Views', 'Unique Visitors'].join(','),
      ...data.map(row => [
        `"${row.pagePath}"`,
        `"${row.pageTitle || ''}"`,
        row.viewCount,
        row.uniqueVisitors
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'top-pages.csv'
    link.click()
  }

  return (
    <AnalyticsCard
      title="Top Pages"
      description="Most visited pages on your website"
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Page</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Views</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Visitors</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-muted-foreground">
                  No page views recorded yet
                </td>
              </tr>
            ) : (
              data.map((page, index) => (
                <tr key={page.pagePath} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground w-5">
                        {index + 1}.
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate max-w-[300px]">
                          {page.pageTitle || page.pagePath}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {page.pagePath}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    {page.viewCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-right text-muted-foreground">
                    {page.uniqueVisitors.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AnalyticsCard>
  )
}

export function TopPublicPagesTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
