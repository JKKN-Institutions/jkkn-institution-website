import { Skeleton } from '@/components/ui/skeleton'

export default function AppearanceSettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Theme Section */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-24" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="grid grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      </div>

      {/* Logo Section */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  )
}
