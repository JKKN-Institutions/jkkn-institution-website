import { Skeleton } from '@/components/ui/skeleton'

export default function ActivityLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header Skeleton */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Activity List Skeleton */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="space-y-4">
          {/* Filter bar skeleton */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>

          {/* Activity items */}
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-4 w-36" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
