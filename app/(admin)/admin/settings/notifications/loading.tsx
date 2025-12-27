import { Skeleton } from '@/components/ui/skeleton'

export default function NotificationsSettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Notification Categories */}
      <div className="rounded-xl border bg-card p-6 space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
