/**
 * Why Choose JKKN Section Skeleton Loader
 *
 * Matches the structure of WhyChooseJKKN component
 * Card-based layout with 6 USP cards in grid
 */

export function WhyChooseSkeleton() {
  return (
    <section className="min-h-[700px] md:min-h-[900px] py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 animate-pulse">
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 mb-4">
            <div className="h-4 w-28 bg-primary/30 rounded" />
          </div>
          {/* Title */}
          <div className="h-10 sm:h-12 lg:h-14 bg-gray-200 rounded-lg mb-3 mx-auto w-2/3" />
          {/* Subtitle */}
          <div className="h-6 sm:h-7 bg-primary/20 rounded-lg mb-4 mx-auto w-4/5" />
          {/* Tagline */}
          <div className="h-5 bg-gray-200 rounded mx-auto w-3/5" />
        </div>

        {/* USP Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 bg-white/70 backdrop-blur-md flex items-center gap-4 shadow-lg border border-white/50"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0" />
              {/* Text Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
