'use client'

import { cn } from '@/lib/utils'
import type { HeroSectionProps } from '@/lib/cms/registry-types'

export default function HeroSection({
  title = 'Welcome',
  subtitle,
  backgroundType = 'image',
  backgroundImage,
  backgroundGradient,
  ctaButtons = [],
  alignment = 'center',
  overlay = true,
  overlayOpacity = 0.5,
  minHeight = '100vh',
  className,
  isEditing,
}: HeroSectionProps) {
  const alignmentClasses: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
    justify: 'items-stretch text-justify',
  }

  return (
    <section
      className={cn(
        'relative flex flex-col justify-center',
        alignmentClasses[alignment],
        className
      )}
      style={{
        minHeight,
        backgroundImage:
          backgroundType === 'image' && backgroundImage
            ? `url(${backgroundImage})`
            : backgroundType === 'gradient'
              ? backgroundGradient
              : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {overlay && backgroundImage && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="container relative z-10 mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            {subtitle}
          </p>
        )}
        {ctaButtons.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {ctaButtons.map((btn, index) => (
              <a
                key={index}
                href={btn.link}
                target={btn.openInNewTab ? '_blank' : undefined}
                rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors',
                  btn.variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  btn.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  btn.variant === 'outline' && 'border border-input bg-background hover:bg-accent'
                )}
              >
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {isEditing && !backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 border-2 border-dashed border-muted-foreground/25">
          <p className="text-muted-foreground">Click to configure hero section</p>
        </div>
      )}
    </section>
  )
}
