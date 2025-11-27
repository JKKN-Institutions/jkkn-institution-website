'use client'

import { useEffect, useState } from 'react'
import { FileText, TrendingUp, Eye, Edit3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface ContentMetricsConfig {
  period?: '7d' | '30d' | '90d'
  showChart?: boolean
}

interface Stats {
  totalPages: number
  publishedPages: number
  draftPages: number
  recentEdits: number
}

export function ContentMetricsWidget({ config }: WidgetProps) {
  const { showChart = true } = config as ContentMetricsConfig
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      // Get total pages
      const { count: totalPages } = await supabase
        .from('cms_pages')
        .select('*', { count: 'exact', head: true })

      // Get published pages
      const { count: publishedPages } = await supabase
        .from('cms_pages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

      // Get draft pages
      const { count: draftPages } = await supabase
        .from('cms_pages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft')

      // Get recent edits (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: recentEdits } = await supabase
        .from('cms_pages')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', sevenDaysAgo.toISOString())

      setStats({
        totalPages: totalPages || 0,
        publishedPages: publishedPages || 0,
        draftPages: draftPages || 0,
        recentEdits: recentEdits || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <FileText className="h-6 w-6 animate-pulse text-muted-foreground" />
      </div>
    )
  }

  const statItems = [
    {
      label: 'Total Pages',
      value: stats?.totalPages || 0,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Published',
      value: stats?.publishedPages || 0,
      icon: Eye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Drafts',
      value: stats?.draftPages || 0,
      icon: Edit3,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ]

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
          <h3 className="font-semibold text-sm sm:text-base text-foreground">Content Metrics</h3>
        </div>
        {stats?.recentEdits !== undefined && stats.recentEdits > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-3 w-3" />
            {stats.recentEdits} edits this week
          </div>
        )}
      </div>

      {/* Stats Grid - scrollable if overflow */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/30"
          >
            <div className={cn('p-1.5 sm:p-2 rounded-lg flex-shrink-0', item.bgColor)}>
              <item.icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', item.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Bar Chart - only show on larger cards */}
      {showChart && stats && stats.totalPages > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50 flex-shrink-0 hidden sm:block">
          <div className="flex items-end justify-between gap-2 h-10 sm:h-12">
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary/20 rounded-t"
                style={{ height: `${Math.min((stats.totalPages / 50) * 100, 100)}%` }}
              />
              <span className="text-[10px] text-muted-foreground mt-1">Total</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-green-500/20 rounded-t"
                style={{ height: `${stats.totalPages > 0 ? Math.min((stats.publishedPages / stats.totalPages) * 100, 100) : 0}%` }}
              />
              <span className="text-[10px] text-muted-foreground mt-1">Live</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-orange-500/20 rounded-t"
                style={{ height: `${stats.totalPages > 0 ? Math.min((stats.draftPages / stats.totalPages) * 100, 100) : 0}%` }}
              />
              <span className="text-[10px] text-muted-foreground mt-1">Draft</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
