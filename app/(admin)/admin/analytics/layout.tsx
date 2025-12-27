import { Suspense } from 'react'
import { BarChart3 } from 'lucide-react'
import { DateRangeSelector } from '@/components/analytics/date-range-selector'
import { AnalyticsNav } from '@/components/analytics/analytics-nav'

interface AnalyticsLayoutProps {
  children: React.ReactNode
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
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
        {/* Sidebar Navigation - Client Component */}
        <AnalyticsNav />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
