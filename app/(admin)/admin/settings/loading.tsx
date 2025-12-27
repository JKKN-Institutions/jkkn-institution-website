import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border bg-card/50 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
