/**
 * About Section Skeleton Loader
 *
 * Matches the structure of AboutSection to prevent layout shift
 * Includes mission/vision/values cards and additional value cards
 */

export function AboutSkeleton() {
  return (
    <section className="relative min-h-[600px] md:min-h-[800px] py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-[#085032]/50 to-gray-900">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-primary/20 to-emerald-800/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 animate-pulse">
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 mb-4">
            <div className="h-4 w-24 bg-secondary/40 rounded" />
          </div>
          {/* Title */}
          <div className="h-10 sm:h-12 lg:h-14 bg-white/10 rounded-lg mb-6 mx-auto w-3/4" />
          {/* Paragraph */}
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6 mx-auto" />
          </div>
        </div>

        {/* Mission, Vision, Values Grid Skeleton */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-24">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-full bg-gray-800/90 rounded-3xl p-8 border border-white/20">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 mb-6" />
                {/* Title */}
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4" />
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Values Grid Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full p-6 rounded-2xl bg-gray-800/90 border border-white/20">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-yellow-500/30 mb-4" />
              {/* Title */}
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
              {/* Description */}
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/10 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button Skeleton */}
        <div className="text-center mt-16 animate-pulse">
          <div className="inline-block h-14 w-56 bg-gray-800/90 rounded-2xl border-2 border-white/30" />
        </div>
      </div>
    </section>
  )
}
