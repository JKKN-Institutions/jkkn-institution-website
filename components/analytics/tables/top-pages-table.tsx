'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ExternalLink, Eye } from 'lucide-react'
import { AnalyticsCard } from '../analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getTopPages } from '@/app/actions/analytics'
import { exportAnalyticsAsCSV, topPagesColumns } from '@/lib/analytics/export-utils'
import type { TopPageData } from '@/lib/analytics/types'

interface TopPagesTableProps {
  limit?: number
  className?: string
}

export function TopPagesTable({ limit = 10, className }: TopPagesTableProps) {
  const [pages, setPages] = useState<TopPageData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const result = await getTopPages(limit)
        setPages(result)
      } catch (error) {
        console.error('Failed to fetch top pages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [limit])

  const handleExportCSV = () => {
    exportAnalyticsAsCSV(pages, topPagesColumns, 'top-pages')
  }

  return (
    <AnalyticsCard
      title="Top Pages"
      description="Most viewed content pages"
      isLoading={isLoading}
      onExportCSV={handleExportCSV}
      className={className}
    >
      <div className="space-y-1">
        {pages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No pages with views yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    #
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Page
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                    Views
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
                    Published
                  </th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page, index) => (
                  <tr
                    key={page.pageId}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="text-sm text-muted-foreground">
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate max-w-[200px]">
                            {page.pageTitle}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            /{page.slug}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          asChild
                        >
                          <Link href={`/blog/${page.slug}`} target="_blank">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">
                          {page.viewCount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-sm text-muted-foreground">
                        {page.publishedAt
                          ? format(new Date(page.publishedAt), 'MMM d, yyyy')
                          : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AnalyticsCard>
  )
}

// Loading skeleton
export function TopPagesTableSkeleton() {
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
      <div className="space-y-1 mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
