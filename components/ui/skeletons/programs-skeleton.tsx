/**
 * Programs Section Skeleton Loader
 *
 * Matches ProgramsSection's 6-card grid layout
 */

export function ProgramsSkeleton() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#085032]/40 to-gray-900" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-primary/20 to-emerald-700/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-l from-primary/20 to-emerald-800/30 rounded-full blur-3xl translate-x-1/2" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16 animate-pulse">
          <div className="max-w-2xl space-y-4">
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20">
              <div className="h-4 w-32 bg-secondary/40 rounded" />
            </div>
            {/* Title */}
            <div className="h-12 bg-white/10 rounded-lg w-3/4" />
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-4/5" />
            </div>
          </div>
          {/* CTA Button Skeleton (desktop) */}
          <div className="hidden lg:block h-12 w-48 bg-gray-800/50 rounded-xl border-2 border-white/30" />
        </div>

        {/* Programs Grid Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-full p-6 lg:p-8 rounded-3xl bg-gray-800/90 border border-white/20">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-yellow-400/20 mb-6" />
              {/* Title */}
              <div className="h-6 bg-white/10 rounded w-2/3 mb-2" />
              {/* Description */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/10 rounded w-4/5" />
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="h-4 bg-white/10 rounded w-20" />
                <div className="h-4 bg-white/10 rounded w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA Skeleton */}
        <div className="lg:hidden text-center mt-10 animate-pulse">
          <div className="inline-block h-14 w-56 bg-gradient-to-r from-secondary/30 via-yellow-400/30 to-secondary/30 rounded-2xl" />
        </div>
      </div>
    </section>
  )
}
