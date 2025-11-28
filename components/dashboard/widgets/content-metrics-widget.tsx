'use client'

import { useEffect, useState } from 'react'
import { FileText, Eye, Edit3, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface Stats {
  totalPages: number
  publishedPages: number
  draftPages: number
}

export function ContentMetricsWidget({ config }: WidgetProps) {
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

      setStats({
        totalPages: totalPages || 0,
        publishedPages: publishedPages || 0,
        draftPages: draftPages || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
          <FileText className="relative h-6 w-6 text-primary animate-pulse" />
        </div>
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
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Drafts',
      value: stats?.draftPages || 0,
      icon: Edit3,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header with Glass Effect */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Content Metrics</h3>
            <p className="text-[10px] text-muted-foreground">Page statistics</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/5 text-[10px] font-medium text-primary">
          <Eye className="h-3 w-3" />
          <span>Active</span>
        </div>
      </div>

      {/* Stats Grid - Glassmorphism Cards */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={cn(
              'group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300',
              'bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5',
              'backdrop-blur-sm border border-primary/10 dark:border-primary/20',
              'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5'
            )}
          >
            {/* Icon with glow */}
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={cn('relative p-1.5 rounded-lg transition-colors', item.bgColor, 'group-hover:bg-primary/15')}>
                <item.icon className={cn('h-3.5 w-3.5', item.color)} />
              </div>
            </div>

            {/* Value */}
            <p className="text-xl font-bold text-foreground tabular-nums">
              {item.value}
            </p>

            {/* Label */}
            <p className="text-[9px] text-muted-foreground text-center leading-tight mt-0.5">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
