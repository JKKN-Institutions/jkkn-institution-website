/**
 * Testimonials Section Skeleton Loader
 *
 * Matches TestimonialsSection's carousel card layout
 */

export function TestimonialsSkeleton() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-[#085032]/40 to-gray-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-r from-primary/20 to-emerald-700/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-primary/20 to-emerald-800/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 animate-pulse">
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 mb-4">
            <div className="h-4 w-28 bg-secondary/40 rounded" />
          </div>
          {/* Title */}
          <div className="h-12 bg-white/10 rounded-lg mb-6 mx-auto w-2/3" />
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-4/5 mx-auto" />
          </div>
        </div>

        {/* Testimonial Card Skeleton */}
        <div className="relative max-w-4xl mx-auto animate-pulse">
          {/* Main Card */}
          <div className="relative bg-gray-800/90 rounded-3xl shadow-2xl shadow-primary/20 border border-white/20 p-8 lg:p-12">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
              <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-secondary/10" />
            </div>

            {/* Content */}
            <div className="relative">
              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-secondary/20" />
                ))}
              </div>

              {/* Quote */}
              <div className="space-y-3 mb-8">
                <div className="h-6 bg-white/10 rounded w-full" />
                <div className="h-6 bg-white/10 rounded w-full" />
                <div className="h-6 bg-white/10 rounded w-5/6" />
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary/30 to-yellow-400/30" />
                <div className="space-y-2">
                  <div className="h-5 bg-white/10 rounded w-32" />
                  <div className="h-4 bg-secondary/20 rounded w-40" />
                  <div className="h-3 bg-white/10 rounded w-36" />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gray-700/50 border border-white/30" />
              <div className="w-11 h-11 rounded-xl bg-gray-700/50 border border-white/30" />
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-8 h-2 rounded-full bg-secondary/30" />
            <div className="w-2 h-2 rounded-full bg-gray-300/30" />
            <div className="w-2 h-2 rounded-full bg-gray-300/30" />
            <div className="w-2 h-2 rounded-full bg-gray-300/30" />
          </div>
        </div>

        {/* Decorative Avatars */}
        <div className="hidden lg:block animate-pulse">
          {/* Left side */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 space-y-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-yellow-400/20" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-500/20 ml-6" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/20 to-yellow-300/20" />
          </div>
          {/* Right side */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 ml-auto" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary/20 to-yellow-400/20" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-400/20 ml-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
