import { CloudOff } from 'lucide-react'

/** Shown when MyJKKN cannot be reached. The rest of the page still renders. */
export function CareersUnavailable() {
  return (
    <div role="status" className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
      <CloudOff className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Job listings are temporarily unavailable</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t load open positions right now. Please refresh in a few minutes.
      </p>
    </div>
  )
}
