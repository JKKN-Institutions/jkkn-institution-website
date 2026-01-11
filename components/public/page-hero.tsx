'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { GlassCard, GlassButton } from './glass-card'

interface PageHeroProps {
  title: string
  subtitle?: string
  description?: string
  badge?: string
  primaryCta?: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  showScrollIndicator?: boolean
  variant?: 'default' | 'gradient' | 'mesh'
  className?: string
  children?: React.ReactNode
}

export function PageHero({
  title,
  subtitle,
  description,
  badge,
  primaryCta,
  secondaryCta,
  showScrollIndicator = false,
  variant = 'mesh',
  className,
  children,
}: PageHeroProps) {
  const backgrounds = {
    default: 'bg-background',
    gradient: 'bg-gradient-to-br from-primary/5 via-background to-secondary/5',
    mesh: '',
  }

  return (
    <section
      className={cn(
        'relative min-h-[60vh] flex items-center overflow-hidden',
        backgrounds[variant],
        className
      )}
    >
      {/* Mesh Gradient Background - Removed as per user request */}
      {/* {variant === 'mesh' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            contain: 'layout paint',
            background: `
              radial-gradient(at 40% 20%, rgba(11,109,65,0.15) 0%, transparent 50%),
              radial-gradient(at 80% 0%, rgba(255,222,89,0.1) 0%, transparent 50%),
              radial-gradient(at 0% 50%, rgba(11,109,65,0.1) 0%, transparent 50%),
              radial-gradient(at 100% 100%, rgba(255,222,89,0.08) 0%, transparent 50%)
            `
          }}
        />
      )} */}

      {/* Grid Pattern Overlay - Removed as per user request */}
      {/* <div
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwYjZkNDEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMi0xMGgydjJoLTJ2LTJ6bTAgNGgydjJoLTJ2LTJ6bTIgMTR2MmgtMnYtMmgyem0tMTItNHYtMmgydjJoLTJ6bTAgNHYtMmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none"
        style={{ contain: 'layout paint' }}
      /> */}

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {badge}
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-primary font-semibold text-lg mb-4 animate-fade-in">
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
              {description}
            </p>
          )}

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <GlassButton variant="secondary" size="lg">
                    {primaryCta.label}
                    <ArrowRight className="h-5 w-5" />
                  </GlassButton>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <GlassButton variant="outline" size="lg">
                    {secondaryCta.label}
                  </GlassButton>
                </Link>
              )}
            </div>
          )}

          {/* Children (custom content) */}
          {children}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
            <ChevronDown className="h-5 w-5 text-primary" />
          </div>
        </div>
      )}
    </section>
  )
}

// Section Header Component
interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }

  return (
    <div className={cn('max-w-3xl mb-12', alignments[align], className)}>
      {subtitle && (
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      )}
      <div className={cn('mt-4 flex gap-1', align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : '')}>
        <div className="w-12 h-1 rounded-full bg-primary" />
        <div className="w-4 h-1 rounded-full bg-secondary" />
      </div>
    </div>
  )
}
