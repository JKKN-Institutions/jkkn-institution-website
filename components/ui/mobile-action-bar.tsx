'use client'

import { cn } from '@/lib/utils'

interface MobileActionBarProps {
  children: React.ReactNode
  className?: string
  position?: 'top' | 'bottom'
  showOnDesktop?: boolean
}

/**
 * Mobile Action Bar Component
 *
 * A fixed action bar for mobile devices that can be positioned at top or bottom.
 * Automatically hides on desktop unless showOnDesktop is true.
 *
 * Usage:
 * ```tsx
 * <MobileActionBar position="bottom">
 *   <Button>Cancel</Button>
 *   <Button>Save</Button>
 * </MobileActionBar>
 * ```
 */
export function MobileActionBar({
  children,
  className,
  position = 'bottom',
  showOnDesktop = false,
}: MobileActionBarProps) {
  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-border/50 px-4 py-3 safe-area-pb',
        position === 'bottom' ? 'bottom-0 border-t' : 'top-0 border-b',
        !showOnDesktop && 'md:hidden',
        className
      )}
    >
      <div className="flex gap-3 max-w-screen-xl mx-auto">
        {children}
      </div>
    </div>
  )
}

interface MobileActionButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  onClick?: () => void
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

/**
 * Mobile Action Button
 *
 * Touch-friendly button with minimum 44px height for use in MobileActionBar
 */
export function MobileActionButton({
  children,
  variant = 'primary',
  onClick,
  disabled,
  className,
  fullWidth = true,
}: MobileActionButtonProps) {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-brand',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'min-h-[44px] px-4 py-2.5 rounded-xl font-medium text-sm transition-colors',
        'flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        fullWidth && 'flex-1',
        className
      )}
    >
      {children}
    </button>
  )
}
