'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { AnnouncementsFeedProps, AnnouncementItem } from '@/lib/cms/registry-types'
import { Bell, Calendar, Tag, ChevronRight, AlertCircle, Info, Megaphone, ArrowRight } from 'lucide-react'
import { format, parseISO, formatDistanceToNow } from 'date-fns'

// Priority badge component
function PriorityBadge({ priority }: { priority: 'normal' | 'important' | 'urgent' }) {
  const config = {
    normal: { color: 'bg-secondary text-secondary-foreground', label: 'Normal' },
    important: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', label: 'Important' },
    urgent: { color: 'bg-destructive text-destructive-foreground', label: 'Urgent' },
  }

  const { color, label } = config[priority]
  return (
    <span className={cn('px-2 py-0.5 text-xs font-medium rounded', color)}>
      {label}
    </span>
  )
}

// Single announcement card
function AnnouncementCard({
  announcement,
  layout,
  showDate,
  showCategory,
}: {
  announcement: AnnouncementItem
  layout: 'list' | 'cards' | 'ticker'
  showDate: boolean
  showCategory: boolean
}) {
  const announcementDate = announcement.date ? parseISO(announcement.date) : null
  const [isNew, setIsNew] = useState(false)

  // Calculate isNew on client-side to avoid hydration mismatch
  useEffect(() => {
    if (announcementDate) {
      setIsNew((new Date().getTime() - announcementDate.getTime()) < 7 * 24 * 60 * 60 * 1000)
    }
  }, [announcementDate])

  const Icon = announcement.priority === 'urgent'
    ? AlertCircle
    : announcement.priority === 'important'
      ? Megaphone
      : Info

  if (layout === 'ticker') {
    return (
      <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn(
            'h-4 w-4',
            announcement.priority === 'urgent' && 'text-destructive',
            announcement.priority === 'important' && 'text-amber-500',
            announcement.priority === 'normal' && 'text-primary'
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground text-sm truncate">
              {announcement.title}
            </h4>
            {isNew && (
              <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded">
                NEW
              </span>
            )}
          </div>
          {showDate && announcementDate && (
            <p className="text-xs text-muted-foreground mt-0.5" suppressHydrationWarning>
              {formatDistanceToNow(announcementDate, { addSuffix: true })}
            </p>
          )}
        </div>
        {announcement.link && (
          <Link
            href={announcement.link}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="relative pl-8 pb-8 last:pb-0">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border" />

        {/* Timeline dot */}
        <div className={cn(
          'absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center',
          announcement.priority === 'urgent' && 'bg-destructive',
          announcement.priority === 'important' && 'bg-amber-500',
          announcement.priority === 'normal' && 'bg-primary'
        )}>
          <Icon className="h-3 w-3 text-white" />
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                {isNew && (
                  <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded">
                    NEW
                  </span>
                )}
                <PriorityBadge priority={announcement.priority} />
              </div>
              {showDate && announcementDate && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(announcementDate, 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>

          {announcement.content && (
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {announcement.content}
            </p>
          )}

          {showCategory && announcement.category && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              {announcement.category}
            </div>
          )}

          {announcement.link && (
            <Link
              href={announcement.link}
              className="inline-flex items-center text-primary text-sm font-medium mt-3 hover:gap-2 transition-all"
            >
              Read More <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
      </div>
    )
  }

  // Cards style (default)
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow',
        announcement.priority === 'urgent' && 'border-destructive/50',
        announcement.priority === 'important' && 'border-amber-500/50'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          announcement.priority === 'urgent' && 'bg-destructive/10',
          announcement.priority === 'important' && 'bg-amber-100 dark:bg-amber-900',
          announcement.priority === 'normal' && 'bg-primary/10'
        )}>
          <Icon className={cn(
            'h-5 w-5',
            announcement.priority === 'urgent' && 'text-destructive',
            announcement.priority === 'important' && 'text-amber-600 dark:text-amber-400',
            announcement.priority === 'normal' && 'text-primary'
          )} />
        </div>
        <div className="flex items-center gap-2">
          {isNew && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
              NEW
            </span>
          )}
          <PriorityBadge priority={announcement.priority} />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="font-semibold text-foreground text-lg">{announcement.title}</h3>

        {showDate && announcementDate && (
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {format(announcementDate, 'MMMM d, yyyy')}
          </p>
        )}

        {announcement.content && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
            {announcement.content}
          </p>
        )}

        {showCategory && announcement.category && (
          <div className="flex items-center gap-1.5 mt-3">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{announcement.category}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      {announcement.link && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href={announcement.link}
            className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all"
          >
            Read Full Announcement <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default function AnnouncementsFeed({
  title = 'Announcements',
  announcements = [],
  layout = 'list',
  maxItems = 5,
  showDate = true,
  showCategory = true,
  showViewAll = true,
  viewAllLink = '/announcements',
  className,
}: AnnouncementsFeedProps) {
  // Sort announcements by priority and date
  const sortedAnnouncements = [...announcements]
    .sort((a, b) => {
      // Sort by priority first (urgent > important > normal)
      const priorityOrder = { urgent: 0, important: 1, normal: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Then by date (newest first)
      const dateA = a.date ? parseISO(a.date) : new Date()
      const dateB = b.date ? parseISO(b.date) : new Date()
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, maxItems)

  if (sortedAnnouncements.length === 0) {
    return (
      <div className={cn('py-12', className)}>
        {title && (
          <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        )}
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No announcements at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('py-12', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {showViewAll && (
          <Link
            href={viewAllLink}
            className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Announcements */}
      <div
        className={cn(
          layout === 'cards' && 'grid grid-cols-1 md:grid-cols-2 gap-6',
          layout === 'list' && 'max-w-2xl',
          layout === 'ticker' && 'bg-card border border-border rounded-lg p-4'
        )}
      >
        {sortedAnnouncements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement.id || index}
            announcement={announcement}
            layout={layout}
            showDate={showDate}
            showCategory={showCategory}
          />
        ))}
      </div>
    </div>
  )
}
