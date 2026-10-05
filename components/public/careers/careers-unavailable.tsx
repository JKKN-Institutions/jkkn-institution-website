import { CloudOff, RotateCw } from 'lucide-react'

/**
 * Shown when MyJKKN cannot be reached. The rest of the page still renders.
 * "Try again" is a plain link to the same page: a full reload re-requests the
 * feed, and no technical detail is ever shown to the candidate.
 */
export function CareersUnavailable() {
  return (
    <div role="alert" className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
      <CloudOff className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">We couldn&apos;t load jobs right now</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This is usually temporary. Please try again in a moment.
      </p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a hard reload is the point */}
      <a
        href="/careers"
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
      </a>
    </div>
  )
}
