/**
 * Stats Section Skeleton Loader
 *
 * Matches StatsSection's 4-card grid with glassmorphism
 */

export function StatsSkeleton() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900/80 via-green-100/50 to-gray-900/80">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/25 to-emerald-500/35 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-green-500/30 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 animate-pulse">
          {/* Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 border border-green-300 mb-4">
            <div className="h-4 w-24 bg-green-200 rounded" />
          </div>
          {/* Title */}
          <div className="h-12 bg-gray-200 rounded-lg mb-6 mx-auto w-2/3" />
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-full p-6 lg:p-8 rounded-3xl bg-white border-2 border-gray-100 shadow-xl">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 mb-6" />
              {/* Value */}
              <div className="h-12 lg:h-14 bg-gray-200 rounded w-24 mb-2" />
              {/* Label */}
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
              {/* Description */}
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
