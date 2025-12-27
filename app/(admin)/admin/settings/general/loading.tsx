import { Skeleton } from '@/components/ui/skeleton'

export default function GeneralSettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Form Sections */}
      <div className="rounded-xl border bg-card p-6 space-y-6">
        {/* Form Fields */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
