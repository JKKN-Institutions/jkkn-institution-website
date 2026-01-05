'use client'

import * as React from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'

type CarouselApi = UseEmblaCarouselType[1]

interface HomeCarouselProps {
  children: React.ReactNode
  className?: string
  autoplay?: boolean
  autoplaySpeed?: number
  loop?: boolean
  pauseOnHover?: boolean
  isDark?: boolean
  showDots?: boolean
  onSlideChange?: (index: number) => void
}

interface HomeCarouselContextValue {
  api: CarouselApi
  selectedIndex: number
  scrollSnaps: number[]
  scrollTo: (index: number) => void
}

const HomeCarouselContext = React.createContext<HomeCarouselContextValue | null>(null)

export function useHomeCarousel() {
  const context = React.useContext(HomeCarouselContext)
  if (!context) {
    throw new Error('useHomeCarousel must be used within a HomeCarousel')
  }
  return context
}

/**
 * HomeCarousel - Reusable carousel for home page sections
 *
 * Features:
 * - Responsive: 1 slide on mobile, 2 on tablet, 3 on desktop
 * - Autoplay with configurable speed
 * - Pause on hover
 * - Loop support
 * - Active slide tracking
 */
export function HomeCarousel({
  children,
  className,
  autoplay = true,
  autoplaySpeed = 4000,
  loop = true,
  pauseOnHover = true,
  isDark = false,
  showDots = false,
  onSlideChange,
}: HomeCarouselProps) {
  const autoplayPlugin = React.useMemo(
    () =>
      Autoplay({
        delay: autoplaySpeed,
        stopOnInteraction: false,
        stopOnMouseEnter: pauseOnHover,
      }),
    [autoplaySpeed, pauseOnHover]
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
    },
    autoplay ? [autoplayPlugin] : []
  )

  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const scrollTo = React.useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    const index = emblaApi.selectedScrollSnap()
    setSelectedIndex(index)
    onSlideChange?.(index)
  }, [emblaApi, onSlideChange])

  React.useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const contextValue = React.useMemo(
    () => ({
      api: emblaApi,
      selectedIndex,
      scrollSnaps,
      scrollTo,
    }),
    [emblaApi, selectedIndex, scrollSnaps, scrollTo]
  )

  return (
    <HomeCarouselContext.Provider value={contextValue}>
      <div className={cn('relative', className)}>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {children}
          </div>
        </div>
        {showDots && <HomeCarouselDotsInternal isDark={isDark} />}
      </div>
    </HomeCarouselContext.Provider>
  )
}

/**
 * Internal dots component - used by HomeCarousel when showDots=true
 */
function HomeCarouselDotsInternal({ isDark = false }: { isDark?: boolean }) {
  const { scrollSnaps, selectedIndex, scrollTo } = useHomeCarousel()

  if (scrollSnaps.length <= 1) return null

  return (
    <div className="flex justify-center gap-2 mt-6">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            selectedIndex === index
              ? isDark
                ? 'bg-white w-6'
                : 'bg-brand-primary w-6'
              : isDark
                ? 'bg-white/30 hover:bg-white/60'
                : 'bg-gray-300 hover:bg-gray-400'
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

interface HomeCarouselItemProps {
  children: React.ReactNode
  className?: string
}

/**
 * HomeCarouselItem - Individual slide
 *
 * Responsive widths:
 * - Mobile: 100% (1 slide visible)
 * - Tablet (sm): 50% (2 slides visible)
 * - Desktop (lg): 33.33% (3 slides visible)
 */
export function HomeCarouselItem({ children, className }: HomeCarouselItemProps) {
  return (
    <div
      className={cn(
        'min-w-0 shrink-0 grow-0',
        // Responsive: 1 on mobile, 2 on tablet, 3 on desktop
        'basis-full sm:basis-1/2 lg:basis-1/3',
        'px-3',
        className
      )}
    >
      {children}
    </div>
  )
}

interface HomeCarouselDotsProps {
  className?: string
  isDark?: boolean
}

/**
 * HomeCarouselDots - Pagination dots with active indicator
 */
export function HomeCarouselDots({ className, isDark = false }: HomeCarouselDotsProps) {
  const { scrollSnaps, selectedIndex, scrollTo } = useHomeCarousel()

  if (scrollSnaps.length <= 1) return null

  return (
    <div className={cn('flex justify-center gap-2 mt-6', className)}>
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            selectedIndex === index
              ? isDark
                ? 'bg-white w-6'
                : 'bg-brand-primary w-6'
              : isDark
                ? 'bg-white/30 hover:bg-white/60'
                : 'bg-gray-300 hover:bg-gray-400'
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

interface HomeCarouselArrowsProps {
  className?: string
  isDark?: boolean
}

/**
 * HomeCarouselArrows - Previous/Next navigation arrows
 */
export function HomeCarouselArrows({ className, isDark = false }: HomeCarouselArrowsProps) {
  const { api } = useHomeCarousel()

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  return (
    <div className={cn('absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none', className)}>
      <button
        onClick={scrollPrev}
        className={cn(
          'pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 -ml-5',
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-white shadow-lg hover:bg-gray-50 text-gray-800'
        )}
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className={cn(
          'pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 -mr-5',
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-white shadow-lg hover:bg-gray-50 text-gray-800'
        )}
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export { type CarouselApi as HomeCarouselApi }
