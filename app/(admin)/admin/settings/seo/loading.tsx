import { Skeleton } from '@/components/ui/skeleton'

export default function SEOSettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Meta Tags Section */}
      <div className="rounded-xl border bg-card p-6 space-y-6">
        <Skeleton className="h-5 w-36" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Preview Section */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  )
}
