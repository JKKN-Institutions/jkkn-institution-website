import { Skeleton } from '@/components/ui/skeleton'

export default function EditRoleLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Form */}
      <div className="rounded-xl border bg-card p-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Permissions Section */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-28" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-2 ml-auto">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-6 w-6 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  )
}
