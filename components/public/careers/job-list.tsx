import { SearchX } from 'lucide-react'
import type { PublicJob } from '@/lib/schemas/public-careers'
import { JobCard } from './job-card'

export function JobList({ jobs, filtered }: { jobs: PublicJob[]; filtered: boolean }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
        <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          {filtered ? 'No jobs match your filters' : 'No open positions right now'}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {filtered
            ? 'Try clearing the search or choosing a different job type.'
            : 'New roles are posted here as soon as they open. Please check back soon.'}
        </p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map(job => <JobCard key={job.id} job={job} />)}
    </div>
  )
}
