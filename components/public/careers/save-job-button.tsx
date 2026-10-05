'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookmarkCheck, X } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { trackCareersEvent } from '@/lib/analytics/careers-events'
import { useSavedJobs, type SavedJob } from '@/lib/hooks/use-saved-jobs'

interface SaveJobButtonProps {
  job: SavedJob
  /** `icon` sits on a job card; `full` is the labelled button on the job page. */
  variant?: 'icon' | 'full'
}

export function SaveJobButton({ job, variant = 'icon' }: SaveJobButtonProps) {
  const { saved, toggle } = useSavedJobs()
  const isSaved = saved.some(j => j.id === job.id)
  const Icon = isSaved ? BookmarkCheck : Bookmark

  function onClick() {
    const nowSaved = toggle(job)
    trackCareersEvent('careers_job_save', { job_id: job.id, action: nowSaved ? 'save' : 'unsave' })
  }

  if (variant === 'full') {
    return (
      <button
        type="button"
        aria-pressed={isSaved}
        onClick={onClick}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon className={`h-4 w-4 ${isSaved ? 'text-primary' : ''}`} aria-hidden="true" />
        {isSaved ? 'Saved' : 'Save job'}
      </button>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
      onClick={onClick}
      // Above the card's stretched link, so it gets its own click.
      className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Icon className={`h-5 w-5 ${isSaved ? 'text-primary' : ''}`} aria-hidden="true" />
    </button>
  )
}

/** Toolbar entry point: "Saved (n)" opens the list kept in this browser. */
export function SavedJobsButton() {
  const { saved, remove } = useSavedJobs()
  const [open, setOpen] = useState(false)
  if (saved.length === 0) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <BookmarkCheck className="h-4 w-4 text-primary" aria-hidden="true" />
          Saved <span className="tabular-nums">({saved.length})</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Saved jobs</SheetTitle>
          <SheetDescription>Kept in this browser only. Clearing your browser data removes them.</SheetDescription>
        </SheetHeader>
        <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
          {saved.map(job => (
            <li key={job.id} className="flex items-center gap-2 px-4 py-3">
              <Link
                href={`/careers/${job.slug}`}
                className="min-w-0 flex-1 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="block font-medium text-foreground hover:text-primary">{job.title}</span>
                {job.institution && <span className="block truncate text-sm text-muted-foreground">{job.institution}</span>}
              </Link>
              <button
                type="button"
                aria-label={`Remove ${job.title} from saved jobs`}
                onClick={() => remove(job.id)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
