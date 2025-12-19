'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'dark-elegant' | 'gradient' | 'brand'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  glow?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'light', blur = 'md', hover = false, glow = false, children, ...props }, ref) => {
    const blurValues = {
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    }

    const variants = {
      light: 'bg-white/70 border-white/30 shadow-lg',
      dark: 'bg-black/20 border-white/10 shadow-xl',
      'dark-elegant': 'bg-black/30 border-white/10 shadow-2xl shadow-primary/20',
      gradient: 'bg-gradient-to-br from-white/80 to-white/40 border-white/30 shadow-lg',
      brand: 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/10',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-300',
          blurValues[blur],
          variants[variant],
          hover && 'hover:scale-[1.02] hover:shadow-xl cursor-pointer',
          glow && 'hover:shadow-primary/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

// Glass Button Component
interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/25',
      outline: 'bg-white/20 backdrop-blur-sm border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'bg-white/10 backdrop-blur-sm border border-white/20 text-foreground hover:bg-white/20',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GlassButton.displayName = 'GlassButton'

// Stats Counter Component
interface StatsCounterProps {
  value: string
  label: string
  suffix?: string
  className?: string
}

function StatsCounter({ value, label, suffix = '', className }: StatsCounterProps) {
  return (
    <div className={cn('text-center', className)}>
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {value}
        <span className="text-secondary">{suffix}</span>
      </div>
      <p className="text-muted-foreground text-sm md:text-base">{label}</p>
    </div>
  )
}

export { GlassCard, GlassButton, StatsCounter }
