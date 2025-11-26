'use client'

import { cn } from '@/lib/utils'
import type { TimelineProps } from '@/lib/cms/registry-types'

export default function Timeline({
  events = [],
  alternating = true,
  className,
  isEditing,
}: TimelineProps) {
  if (events.length === 0 && isEditing) {
    return (
      <section className={cn('py-16 px-4', className)}>
        <div className="container mx-auto max-w-4xl">
          <div className="p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-center">Click to add timeline events</p>
          </div>
        </div>
      </section>
    )
  }

  if (events.length === 0) return null

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-4xl">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

          {events.map((event, index) => (
            <div
              key={index}
              className={cn(
                'relative pl-10 md:pl-0 pb-8 last:pb-0',
                alternating && index % 2 === 0 && 'md:pr-[calc(50%+2rem)] md:text-right',
                alternating && index % 2 === 1 && 'md:pl-[calc(50%+2rem)]',
                !alternating && 'md:pl-[calc(50%+2rem)]'
              )}
            >
              {/* Dot */}
              <div className="absolute w-4 h-4 rounded-full bg-primary border-4 border-background left-4 md:left-1/2 -translate-x-1/2" />

              {/* Content */}
              <div className="bg-card rounded-lg p-4 shadow-sm">
                {event.date && (
                  <span className="text-sm text-primary font-medium">
                    {event.date}
                  </span>
                )}
                <h3 className="font-semibold mt-1">{event.title}</h3>
                {event.description && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {event.description}
                  </p>
                )}
                {event.icon && (
                  <span className="text-2xl mt-2 block">{event.icon}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
