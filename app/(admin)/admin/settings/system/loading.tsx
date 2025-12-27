import { Skeleton } from '@/components/ui/skeleton'

export default function SystemSettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-60" />
      </div>

      {/* System Info */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-destructive/20 bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
