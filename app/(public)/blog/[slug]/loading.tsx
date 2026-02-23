export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Back button */}
            <div className="h-9 w-32 bg-muted rounded animate-pulse" />
            {/* Category badge */}
            <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
            {/* Title */}
            <div className="space-y-2">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse w-4/5" />
            </div>
            {/* Meta */}
            <div className="flex gap-4">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured image skeleton */}
      <section className="mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-5 bg-muted rounded animate-pulse" />
            <div className="h-5 bg-muted rounded animate-pulse w-11/12" />
            <div className="h-5 bg-muted rounded animate-pulse w-4/5" />
            <div className="h-40 bg-muted rounded-2xl animate-pulse mt-6" />
            <div className="h-5 bg-muted rounded animate-pulse mt-4" />
            <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-5 bg-muted rounded animate-pulse w-5/6" />
          </div>
        </div>
      </section>
    </div>
  )
}
