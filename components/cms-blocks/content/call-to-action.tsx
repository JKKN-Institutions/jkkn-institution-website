'use client'

import { cn } from '@/lib/utils'
import type { CallToActionProps } from '@/lib/cms/registry-types'

export default function CallToAction({
  title = 'Ready to Get Started?',
  description,
  buttons = [],
  background,
  alignment = 'center',
  className,
  isEditing,
}: CallToActionProps) {
  return (
    <section
      className={cn(
        'py-16 px-4',
        `text-${alignment}`,
        className
      )}
      style={{
        background: background || undefined,
      }}
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        )}
        {buttons.length > 0 && (
          <div className={cn(
            'mt-8 flex flex-wrap gap-4',
            alignment === 'center' && 'justify-center',
            alignment === 'right' && 'justify-end'
          )}>
            {buttons.map((btn, index) => (
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
        {isEditing && buttons.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">Click to add buttons</p>
        )}
      </div>
    </section>
  )
}
