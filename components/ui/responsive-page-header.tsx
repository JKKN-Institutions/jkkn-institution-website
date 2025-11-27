'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface ResponsivePageHeaderProps {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  actions?: React.ReactNode
  className?: string
}

export function ResponsivePageHeader({
  icon,
  title,
  description,
  badge,
  actions,
  className,
}: ResponsivePageHeaderProps) {
  return (
    <div className={cn('glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden', className)}>
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        {/* Mobile-first layout */}
        <div className="flex flex-col gap-4">
          {/* Header content */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 flex-shrink-0">
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate">
                  {title}
                </h1>
                {badge && (
                  <span className="badge-brand text-xs sm:text-sm flex-shrink-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {/* Actions - full width on mobile */}
          {actions && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto sm:w-auto w-full">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
