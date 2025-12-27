import { Skeleton } from '@/components/ui/skeleton'

export default function RoleDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back Button + Header */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-20" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Role Info Card */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-28" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-6 w-6 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users with Role */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
