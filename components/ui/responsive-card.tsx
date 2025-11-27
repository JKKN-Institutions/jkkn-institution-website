'use client'

import { cn } from '@/lib/utils'

interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass' | 'outline'
}

/**
 * Responsive Card Component
 *
 * A card component with responsive padding and multiple variants.
 */
export function ResponsiveCard({
  children,
  className,
  padding = 'md',
  variant = 'default',
}: ResponsiveCardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-4 sm:p-6 lg:p-8',
  }

  const variantStyles = {
    default: 'bg-card border border-border/50 shadow-sm',
    glass: 'glass-card',
    outline: 'border border-border/50 bg-transparent',
  }

  return (
    <div
      className={cn(
        'rounded-xl sm:rounded-2xl',
        paddingStyles[padding],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveCardHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function ResponsiveCardHeader({
  title,
  description,
  icon,
  actions,
  className,
}: ResponsiveCardHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4', className)}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">{icon}</div>
        )}
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  )
}

interface ResponsiveCardContentProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveCardContent({
  children,
  className,
}: ResponsiveCardContentProps) {
  return <div className={cn('mt-4', className)}>{children}</div>
}

interface ResponsiveCardFooterProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveCardFooter({
  children,
  className,
}: ResponsiveCardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 pt-4 border-t border-border/50',
        'flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end',
        className
      )}
    >
      {children}
    </div>
  )
}
