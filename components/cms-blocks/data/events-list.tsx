'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { EventsListProps, EventItem } from '@/lib/cms/registry-types'
import { Calendar, MapPin, Clock, ChevronRight, ArrowRight } from 'lucide-react'
import { format, parseISO, isBefore, isToday } from 'date-fns'

// Single event card component
function EventCard({
  event,
  layout,
}: {
  event: EventItem
  layout: 'list' | 'grid' | 'calendar'
}) {
  const eventDate = event.date ? parseISO(event.date) : null
  const [isPast, setIsPast] = useState(false)

  // Calculate isPast on client-side to avoid hydration mismatch
  useEffect(() => {
    if (eventDate) {
      setIsPast(isBefore(eventDate, new Date()) && !isToday(eventDate))
    }
  }, [eventDate])

  if (layout === 'grid') {
    return (
      <div
        className={cn(
          'bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group',
          isPast && 'opacity-60'
        )}
      >
        {event.image && (
          <div className="aspect-video relative overflow-hidden bg-muted">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {event.category && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                {event.category}
              </span>
            )}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>{eventDate ? format(eventDate, 'MMM d, yyyy') : 'TBD'}</span>
            {event.time && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{event.time}</span>
              </>
            )}
          </div>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {event.description}
            </p>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.link && (
            <Link
              href={event.link}
              className="inline-flex items-center text-primary text-sm font-medium mt-3 hover:gap-2 transition-all"
            >
              Learn More <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
      </div>
    )
  }

  // List layout
  return (
    <div
      className={cn(
        'flex gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group',
        isPast && 'opacity-60'
      )}
    >
      {/* Date Badge */}
      <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
          {eventDate ? format(eventDate, 'd') : '--'}
        </span>
        <span className="text-xs text-primary uppercase">
          {eventDate ? format(eventDate, 'MMM') : 'TBD'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {event.category && (
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded">
              {event.category}
            </span>
          )}
          {event.time && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.time}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
          {event.title}
        </h3>
        {event.location && (
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
      </div>

      {/* Arrow */}
      {event.link && (
        <Link
          href={event.link}
          className="flex-shrink-0 self-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      )}
    </div>
  )
}

export default function EventsList({
  title = 'Upcoming Events',
  events = [],
  layout = 'list',
  showPastEvents = false,
  maxItems = 5,
  showViewAll = true,
  viewAllLink = '/events',
  className,
}: EventsListProps) {
  // Filter and sort events
  const now = new Date()
  const filteredEvents = events
    .filter((event) => {
      if (showPastEvents) return true
      const eventDate = event.date ? parseISO(event.date) : new Date()
      return !isBefore(eventDate, now) || isToday(eventDate)
    })
    .sort((a, b) => {
      const dateA = a.date ? parseISO(a.date) : new Date()
      const dateB = b.date ? parseISO(b.date) : new Date()
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, maxItems)

  if (filteredEvents.length === 0) {
    return (
      <div className={cn('py-12', className)}>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">{title}</h2>
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No upcoming events scheduled.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('py-12', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
        {showViewAll && (
          <Link
            href={viewAllLink}
            className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div
        className={cn(
          layout === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-3'
        )}
      >
        {filteredEvents.map((event, index) => (
          <EventCard key={event.id || index} event={event} layout={layout} />
        ))}
      </div>
    </div>
  )
}
