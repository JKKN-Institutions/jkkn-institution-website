/**
 * Hero Section Skeleton Loader
 *
 * Matches the structure of HeroSection to prevent layout shift
 * Uses cream glass styling to match JKKN brand
 */

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#085032] via-primary to-emerald-900" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-transparent to-primary/50" />

      {/* Content skeleton */}
      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        {/* Logo Badge Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="inline-flex flex-col items-center bg-white/90 rounded-xl p-3 sm:p-4 shadow-2xl">
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
            <div className="bg-gray-200 rounded-lg px-4 sm:px-6 py-2 sm:py-3 my-1">
              <div className="h-8 w-12 sm:h-10 sm:w-16 bg-gray-300 rounded" />
            </div>
            <div className="h-3 w-24 bg-gray-200 rounded mt-1" />
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="animate-pulse mb-8 w-full max-w-4xl">
          <div className="h-12 sm:h-16 md:h-20 lg:h-24 bg-white/20 rounded-lg mx-auto w-3/4" />
        </div>

        {/* Subtitle Skeleton */}
        <div className="animate-pulse mb-6 w-full max-w-2xl">
          <div className="h-4 sm:h-5 md:h-6 bg-white/15 rounded mx-auto w-full" />
        </div>

        {/* CTA Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 animate-pulse w-full max-w-xl justify-center">
          <div className="h-14 bg-secondary/50 rounded-full min-w-[280px]" />
          <div className="h-14 bg-white/20 rounded-full min-w-[200px] border-2 border-white/30" />
        </div>
      </div>
    </section>
  )
}
