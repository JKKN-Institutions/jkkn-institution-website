'use client'

import { Sparkles, Clock, CalendarDays, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import type { WidgetProps } from '@/lib/dashboard/widget-registry'

interface WelcomeBannerConfig {
  showLastLogin?: boolean
  showQuickStats?: boolean
  userName?: string
  userRole?: string
}

export function WelcomeBannerWidget({ config }: WidgetProps) {
  const { showLastLogin = true, showQuickStats = true, userName = 'User', userRole = 'Member' } = config as WelcomeBannerConfig

  const currentDate = new Date()
  const greeting = getGreeting()

  function getGreeting() {
    const hour = currentDate.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="h-full flex flex-col justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
          <Sparkles className="h-4 w-4" />
          <span>{greeting}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Welcome back, {userName}!
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          You&apos;re logged in as <span className="font-medium text-primary">{userRole}</span>
        </p>

        {(showLastLogin || showQuickStats) && (
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
            {showLastLogin && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{format(currentDate, 'h:mm a')}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{format(currentDate, 'EEEE, MMM d, yyyy')}</span>
            </div>
            {showQuickStats && (
              <div className="flex items-center gap-1.5 text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Platform running smoothly</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
