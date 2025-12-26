'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Users,
  FileText,
  Activity,
  ChevronRight
} from 'lucide-react'
import { DateRangeSelector } from '@/components/analytics/date-range-selector'

const analyticsNavItems = [
  {
    title: 'Overview',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Key metrics and summary',
  },
  {
    title: 'Users',
    href: '/admin/analytics/users',
    icon: Users,
    description: 'User growth and distribution',
  },
  {
    title: 'Content',
    href: '/admin/analytics/content',
    icon: FileText,
    description: 'Page views and performance',
  },
  {
    title: 'Engagement',
    href: '/admin/analytics/engagement',
    icon: Activity,
    description: 'Activity heatmap and trends',
  },
]

interface AnalyticsLayoutProps {
  children: React.ReactNode
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Track user engagement, content performance, and key metrics
              </p>
            </div>
          </div>
          <Suspense fallback={<div className="h-10 w-[180px] bg-muted animate-pulse rounded-md" />}>
            <DateRangeSelector />
          </Suspense>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-card rounded-2xl p-4 space-y-1">
            {analyticsNavItems.map((item) => {
              const isActive =
                item.href === '/admin/analytics'
                  ? pathname === '/admin/analytics'
                  : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-brand'
                      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium text-sm',
                      isActive ? 'text-primary-foreground' : ''
                    )}>
                      {item.title}
                    </div>
                    <div className={cn(
                      'text-xs truncate',
                      isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {item.description}
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 flex-shrink-0 transition-transform',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground opacity-0 group-hover:opacity-100',
                      isActive && 'translate-x-0.5'
                    )}
                  />
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
