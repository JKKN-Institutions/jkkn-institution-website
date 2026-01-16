'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  GraduationCap,
  Users,
  Trophy,
  Building2,
  TrendingUp,
} from 'lucide-react'

const stats = [
  {
    icon: Trophy,
    value: 73,
    suffix: '+',
    label: 'Years of Excellence',
    description: 'Educational legacy since 1952',
    useSteppedAnimation: false,
  },
  {
    icon: Users,
    value: 100000,
    suffix: '+',
    label: 'Students Trained',
    description: 'Empowering futures across India',
    useSteppedAnimation: true,
  },
  {
    icon: TrendingUp,
    value: 92,
    suffix: '%+',
    label: 'Placement Rate',
    description: 'Career success stories',
    useSteppedAnimation: false,
  },
  {
    icon: GraduationCap,
    value: 50,
    suffix: '+',
    label: 'Courses Offered',
    description: 'Diverse learning pathways',
    useSteppedAnimation: false,
  },
]

function useCountUp(target: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration, isVisible])

  return count
}

function useSteppedCounter(
  target: number,
  stepSize: number,
  isVisible: boolean
) {
  const [count, setCount] = useState(0)
  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  useEffect(() => {
    if (!isVisible) {
      setCount(0)
      return
    }

    if (prefersReducedMotion) {
      setCount(target)
      return
    }

    // Generate steps array
    const steps = Array.from(
      { length: Math.floor(target / stepSize) },
      (_, i) => (i + 1) * stepSize
    )
    const delays = [300, 280, 250, 220, 190, 160, 130, 100, 70, 50]

    let currentStepIndex = 0
    let timeoutId: NodeJS.Timeout

    const animateStep = () => {
      if (currentStepIndex < steps.length) {
        setCount(steps[currentStepIndex])
        const delay = delays[currentStepIndex] || 50
        timeoutId = setTimeout(animateStep, delay)
        currentStepIndex++
      }
    }

    animateStep()

    // Cleanup timeout to prevent memory leak
    return () => {
      clearTimeout(timeoutId)
      setCount(0)
    }
  }, [target, stepSize, isVisible, prefersReducedMotion])

  return count
}

function StatCard({ stat, index, isVisible }: { stat: typeof stats[0], index: number, isVisible: boolean }) {
  // Use stepped counter for 1L+ (100,000), smooth animation for others
  const smoothCount = useCountUp(stat.value, 2000, isVisible)
  const steppedCount = useSteppedCounter(stat.value, 10000, isVisible)
  const count = stat.useSteppedAnimation ? steppedCount : smoothCount

  // Pulse animation on each step
  const [isPulsing, setIsPulsing] = useState(false)
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  useEffect(() => {
    if (stat.useSteppedAnimation && count > 0 && count < stat.value && !prefersReducedMotion) {
      setIsPulsing(true)
      const timer = setTimeout(() => setIsPulsing(false), 150)
      return () => clearTimeout(timer)
    }
  }, [count, stat.useSteppedAnimation, stat.value, prefersReducedMotion])

  // Better number formatting for display
  const displayValue =
    count >= 100000
      ? '1L'
      : count >= 10000
      ? `${Math.floor(count / 1000)}K`
      : count.toLocaleString()

  return (
    <div
      className={cn(
        'group relative transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-full p-6 lg:p-8 rounded-3xl bg-white border-2 border-gray-100 shadow-xl shadow-gray-400/20 overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-green-500/25 hover:border-green-200 hover:-translate-y-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 will-change-transform">
        {/* Glow effect */}
        <div className="absolute -inset-px bg-gradient-to-r from-green-500/20 via-transparent to-emerald-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Inner gradient layer for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent rounded-3xl pointer-events-none" />

        {/* Noise texture for realistic glass */}
        <div
          className="absolute inset-0 opacity-[0.02] rounded-3xl pointer-events-none"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')`
          }}
        />

        <div className="relative">
          {/* Icon */}
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-500/20 mb-6 group-hover:scale-110 transition-all duration-300">
            <stat.icon className="w-7 h-7 text-green-700" />
          </div>

          {/* Value */}
          <div className="mb-2">
            <span
              className={cn(
                "text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight transition-transform duration-150",
                "tabular-nums", // Prevents CLS by ensuring consistent number width
                isPulsing && "scale-110"
              )}
              aria-live={count === stat.value ? 'polite' : 'off'}
              aria-atomic="true"
              title={stat.useSteppedAnimation ? "1,00,000 students trained" : undefined}
            >
              {displayValue}
            </span>
            <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent tabular-nums">
              {stat.suffix}
            </span>
          </div>

          {/* Label */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {stat.label}
          </h3>
          <p className="text-sm text-gray-600">
            {stat.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to prevent forced reflow
          requestAnimationFrame(() => {
            setIsVisible(true)
          })
        }
      },
      { threshold: 0.2, rootMargin: '50px' } // Trigger slightly earlier
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[700px] md:min-h-[900px] py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-gray-900/80 via-green-100/50 to-gray-900/80"
    >
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
        {/* Section Header */}
        <div className={cn(
          'text-center max-w-3xl mx-auto mb-16 lg:mb-20 transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4 border border-green-300">
            Our Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Numbers That{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Speak
            </span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our achievements reflect our commitment to excellence in education,
            research, and student success.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
