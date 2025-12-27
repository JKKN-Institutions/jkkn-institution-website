import { Heart, FolderOpen } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function LifeAtJKKNLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
        </div>

        {/* Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border/50">
              <Skeleton className="h-[200px] w-full" />
              <div className="p-3 flex items-center justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
