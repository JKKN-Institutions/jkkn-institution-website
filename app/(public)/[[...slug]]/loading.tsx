import { Skeleton } from '@/components/ui/skeleton'

export default function PageLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero section skeleton */}
      <Skeleton className="h-screen w-full" />
      {/* Content sections skeleton */}
      <div className="container mx-auto px-4 py-16 space-y-8 max-w-4xl">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-64 w-full rounded-lg mt-8" />
      </div>
    </div>
  )
}
