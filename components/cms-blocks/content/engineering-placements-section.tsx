'use client'

import { cn } from '@/lib/utils'
import { z } from 'zod'
import type { BaseBlockProps } from '@/lib/cms/registry-types'
import { useRef, useState, useEffect } from 'react'
import { debounce } from '@/lib/utils/dom-performance'
import { TrendingUp, Award, Users, Building2 } from 'lucide-react'
import Image from 'next/image'

// ==========================================
// Intersection Observer Hook
// ==========================================

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isInView }
}

// ==========================================
// Animated Counter Hook
// ==========================================

function useAnimatedCounter(end: number, duration: number = 2000, isInView: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isInView])

  return count
}

// ==========================================
// Zod Schema
// ==========================================

export const EngineeringPlacementsSectionPropsSchema = z.object({
  // Title
  title: z.string().default('Launching Careers, Building Futures'),
  subtitle: z.string().default('Our placement cell works tirelessly to connect students with top companies'),

  // Stats
  stats: z.array(z.object({
    value: z.number(),
    suffix: z.string().default(''),
    prefix: z.string().default(''),
    label: z.string(),
    icon: z.enum(['trending', 'award', 'users', 'building']).default('trending'),
  })).default([
    { value: 95, suffix: '%+', prefix: '', label: 'Placement Rate', icon: 'trending' },
    { value: 12, suffix: ' LPA', prefix: '', label: 'Highest Package', icon: 'award' },
    { value: 4.5, suffix: ' LPA', prefix: '', label: 'Average Package', icon: 'users' },
    { value: 50, suffix: '+', prefix: '', label: 'Recruiters', icon: 'building' },
  ]),

  // Companies (12 top recruiters)
  companies: z.array(z.object({
    name: z.string(),
    logo: z.string(),
    category: z.enum(['it', 'core', 'manufacturing', 'service', 'all']).default('all'),
  })).default([
    { name: 'TCS', logo: '', category: 'it' },
    { name: 'Infosys', logo: '', category: 'it' },
    { name: 'Wipro', logo: '', category: 'it' },
    { name: 'Cognizant', logo: '', category: 'it' },
    { name: 'HCL', logo: '', category: 'it' },
    { name: 'Amazon', logo: '', category: 'it' },
    { name: 'Zoho', logo: '', category: 'it' },
    { name: 'L&T', logo: '', category: 'core' },
    { name: 'Capgemini', logo: '', category: 'it' },
    { name: 'Tech Mahindra', logo: '', category: 'it' },
    { name: 'IBM', logo: '', category: 'it' },
    { name: 'Accenture', logo: '', category: 'service' },
  ]),

  // Show category tabs
  showCategoryTabs: z.boolean().default(false),

  // Logo marquee settings
  marqueeSpeed: z.number().default(8),
  showGrayscale: z.boolean().default(true),
  enableDrag: z.boolean().default(true),
  pauseOnHover: z.boolean().default(true),
  dragSensitivity: z.number().min(0.1).max(2).default(1.2),
  speedPreset: z.enum(['slow', 'medium', 'fast', 'ultra-fast', 'custom']).default('fast'),

  // Colors (updated to JKKN brand colors)
  primaryColor: z.string().default('#0b6d41'),
  accentColor: z.string().default('#ffde59'),
  backgroundColor: z.string().default('#f9fafb'),

  // Animation
  showAnimations: z.boolean().default(true),

  // Padding
  paddingY: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
})

export type EngineeringPlacementsSectionProps = z.infer<typeof EngineeringPlacementsSectionPropsSchema> & BaseBlockProps

// ==========================================
// Icon Component
// ==========================================

function StatIcon({ icon, className }: { icon: string; className?: string }) {
  const iconProps = { className: cn('w-6 h-6', className) }

  switch (icon) {
    case 'award':
      return <Award {...iconProps} />
    case 'users':
      return <Users {...iconProps} />
    case 'building':
      return <Building2 {...iconProps} />
    case 'trending':
    default:
      return <TrendingUp {...iconProps} />
  }
}

// ==========================================
// Stats Counter Component
// ==========================================

function StatCard({
  stat,
  index,
  isInView,
  primaryColor,
  accentColor,
}: {
  stat: { value: number; suffix: string; prefix: string; label: string; icon: string }
  index: number
  isInView: boolean
  primaryColor: string
  accentColor: string
}) {
  const count = useAnimatedCounter(stat.value, 2000, isInView)

  return (
    <div
      className="relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white shadow-lg border border-gray-100 text-center"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <StatIcon icon={stat.icon} className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <style jsx>{`
          div :global(svg) {
            color: ${accentColor};
          }
        `}</style>
      </div>

      {/* Value */}
      <div
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2"
        style={{ color: primaryColor }}
      >
        {stat.prefix}{count}{stat.suffix}
      </div>

      {/* Label */}
      <div className="text-xs sm:text-sm text-gray-600 font-medium">
        {stat.label}
      </div>
    </div>
  )
}

// ==========================================
// Logo Marquee Component (Enhanced with Drag & Scroll)
// ==========================================

function LogoMarquee({
  companies,
  speed = 15,
  showGrayscale = true,
  enableDrag = true,
  pauseOnHover = true,
  dragSensitivity = 1,
}: {
  companies: Array<{ name: string; logo: string; category: string }>
  speed?: number
  showGrayscale?: boolean
  enableDrag?: boolean
  pauseOnHover?: boolean
  dragSensitivity?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)
  const [momentum, setMomentum] = useState(0)
  const [lastDragX, setLastDragX] = useState(0)
  const [dragVelocity, setDragVelocity] = useState(0)
  const animationFrameRef = useRef<number | null>(null)

  if (companies.length === 0) {
    return (
      <div className="flex justify-center items-center gap-8 py-8 flex-wrap">
        {/* Placeholder logos */}
        {['TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'IBM', 'Zoho', 'L&T'].map((name, i) => (
          <div
            key={i}
            className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            <span className="text-sm font-semibold text-gray-400">{name}</span>
          </div>
        ))}
      </div>
    )
  }

  // Duplicate companies for seamless loop (4 times for smoother infinite scroll)
  const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies]

  // Handle pointer down (start drag)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableDrag) return
    setIsDragging(true)
    setIsPaused(true)
    setDragStartX(e.clientX)
    setLastDragX(e.clientX)
    setDragVelocity(0)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing'
      containerRef.current.setPointerCapture(e.pointerId)
    }
  }

  // Handle pointer move (dragging)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !enableDrag) return

    // Increase sensitivity for touch events (mobile)
    const isTouchEvent = e.pointerType === 'touch'
    const sensitivity = isTouchEvent ? dragSensitivity * 1.5 : dragSensitivity

    const deltaX = (e.clientX - lastDragX) * sensitivity
    setScrollOffset((prev) => prev + deltaX)

    // Calculate velocity for momentum
    setDragVelocity(deltaX)
    setLastDragX(e.clientX)
  }

  // Handle pointer up (end drag)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !enableDrag) return
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
      containerRef.current.releasePointerCapture(e.pointerId)
    }

    // Apply momentum
    setMomentum(dragVelocity * 0.95)

    // Resume auto-scroll after a delay
    setTimeout(() => {
      setIsPaused(false)
    }, 2000)
  }

  // Handle mouse enter (pause on hover)
  const handleMouseEnter = () => {
    if (pauseOnHover && !isDragging) {
      setIsPaused(true)
    }
  }

  // Handle mouse leave (resume)
  const handleMouseLeave = () => {
    if (pauseOnHover && !isDragging) {
      setIsPaused(false)
    }
  }

  // Handle wheel scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!enableDrag) return
    e.preventDefault()
    setScrollOffset((prev) => prev - e.deltaY * 0.5)
    setIsPaused(true)

    // Resume after wheel stops
    setTimeout(() => {
      setIsPaused(false)
    }, 1000)
  }

  // Apply momentum animation
  useEffect(() => {
    if (Math.abs(momentum) < 0.1) {
      setMomentum(0)
      return
    }

    const applyMomentum = () => {
      setScrollOffset((prev) => prev + momentum)
      setMomentum((prev) => prev * 0.95) // Deceleration factor
      animationFrameRef.current = requestAnimationFrame(applyMomentum)
    }

    animationFrameRef.current = requestAnimationFrame(applyMomentum)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [momentum])

  // Cache content width to prevent forced reflows
  const contentWidthRef = useRef<number>(0)

  // Measure once on mount and on resize only
  useEffect(() => {
    if (!contentRef.current) return

    const measureWidth = () => {
      if (contentRef.current) {
        contentWidthRef.current = contentRef.current.scrollWidth / 4
      }
    }

    // Initial measurement
    measureWidth()

    // Update on resize (debounced)
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(measureWidth, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Normalize scroll offset for seamless loop (using cached value)
  useEffect(() => {
    if (!contentWidthRef.current) return

    const contentWidth = contentWidthRef.current

    if (scrollOffset > 0) {
      setScrollOffset((prev) => prev - contentWidth)
    } else if (scrollOffset < -contentWidth) {
      setScrollOffset((prev) => prev + contentWidth)
    }
  }, [scrollOffset])

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300",
        enableDrag && "hover:shadow-lg hover:bg-gray-50/50"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
      style={{
        cursor: enableDrag ? (isDragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
      }}
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative py-4"
      >
        <div
          ref={contentRef}
          className={cn(
            'flex gap-4 sm:gap-6 md:gap-8',
            !isDragging && !isPaused && 'animate-marquee'
          )}
          style={{
            animationDuration: `${speed}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: isPaused || isDragging ? 'paused' : 'running',
            transform: `translateX(${scrollOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            willChange: 'transform',
          }}
        >
          {duplicatedCompanies.map((company, index) => (
            <div
              key={index}
              className={cn(
                'flex-shrink-0 w-24 sm:w-28 md:w-32 h-12 sm:h-14 md:h-16 bg-white rounded-lg shadow-sm border border-gray-100 p-2 sm:p-3 flex items-center justify-center transition-all duration-300',
                showGrayscale && 'grayscale hover:grayscale-0 active:grayscale-0',
                'pointer-events-none' // Prevent image drag
              )}
            >
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={100}
                  height={40}
                  className="object-contain max-h-8 sm:max-h-9 md:max-h-10"
                  draggable={false}
                />
              ) : (
                <span className="text-xs font-semibold text-gray-400">{company.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlays - smaller on mobile */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
    </div>
  )
}

// ==========================================
// Main Component
// ==========================================

export default function EngineeringPlacementsSection({
  title = 'Launching Careers, Building Futures',
  subtitle = 'Our placement cell works tirelessly to connect students with top companies',
  stats = [
    { value: 95, suffix: '%+', prefix: '', label: 'Placement Rate', icon: 'trending' },
    { value: 12, suffix: ' LPA', prefix: '', label: 'Highest Package', icon: 'award' },
    { value: 4.8, suffix: ' LPA', prefix: '', label: 'Average Package', icon: 'users' },
    { value: 200, suffix: '+', prefix: '', label: 'Recruiting Companies', icon: 'building' },
  ],
  companies = [],
  showCategoryTabs = true,
  marqueeSpeed = 8,
  showGrayscale = true,
  enableDrag = true,
  pauseOnHover = true,
  dragSensitivity = 1.2,
  speedPreset = 'fast',
  primaryColor = '#1e3a5f',
  accentColor = '#f97316',
  backgroundColor = '#f9fafb',
  showAnimations = true,
  paddingY = 'lg',
  className,
  isEditing,
}: EngineeringPlacementsSectionProps) {
  const sectionRef = useInView(0.1)
  const statsRef = useInView(0.2)
  const [activeCategory, setActiveCategory] = useState<'all' | 'it' | 'core' | 'manufacturing' | 'service'>('all')
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = debounce(() => {
      setIsMobile(window.innerWidth < 768)
    }, 150)
    setIsMobile(window.innerWidth < 768) // Initial check
    window.addEventListener('resize', checkMobile)
    return () => {
      checkMobile.cancel()
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Speed preset mapping (lower values = faster animation)
  // Mobile gets 20% faster speed for better visual effect
  const speedMapping = {
    slow: isMobile ? 12 : 15,
    medium: isMobile ? 8 : 10,
    fast: isMobile ? 5 : 6,
    'ultra-fast': isMobile ? 3 : 4,
    custom: isMobile ? marqueeSpeed * 0.8 : marqueeSpeed,
  }
  const actualSpeed = speedMapping[speedPreset]

  const paddingClasses = {
    sm: 'py-8 md:py-10',
    md: 'py-10 md:py-14',
    lg: 'py-14 md:py-20',
    xl: 'py-20 md:py-28',
  }

  const animateClass = (delay: number) =>
    showAnimations
      ? cn(
          'transition-opacity duration-700',
          sectionRef.isInView ? 'opacity-100' : 'opacity-0'
        )
      : ''

  const categories = [
    { key: 'all' as const, label: 'All' },
    { key: 'it' as const, label: 'IT' },
    { key: 'core' as const, label: 'Core' },
    { key: 'manufacturing' as const, label: 'Manufacturing' },
    { key: 'service' as const, label: 'Service' },
  ]

  const filteredCompanies = activeCategory === 'all'
    ? companies
    : companies.filter(c => c.category === activeCategory || c.category === 'all')

  return (
    <section
      ref={sectionRef.ref}
      className={cn('relative w-full overflow-hidden', paddingClasses[paddingY], className)}
      style={{ backgroundColor }}
    >
      {/* CSS for marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee var(--duration, 30s) linear infinite;
        }
      `}</style>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <h2
            className={cn(
              'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 px-2',
              animateClass(0)
            )}
            style={{ color: primaryColor, transitionDelay: '0ms' }}
          >
            {title}
          </h2>
          <p
            className={cn(
              'text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2',
              animateClass(100)
            )}
            style={{ transitionDelay: '100ms' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef.ref}
          className={cn(
            'grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-10 sm:mb-12 md:mb-16',
            animateClass(200)
          )}
          style={{ transitionDelay: '200ms' }}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              stat={stat}
              index={index}
              isInView={statsRef.isInView}
              primaryColor={primaryColor}
              accentColor={accentColor}
            />
          ))}
        </div>

        {/* Category Tabs */}
        {showCategoryTabs && companies.length > 0 && (
          <div
            className={cn(
              'flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-2',
              animateClass(300)
            )}
            style={{ transitionDelay: '300ms' }}
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 min-w-[60px] sm:min-w-[70px]',
                  activeCategory === cat.key
                    ? 'text-white shadow-md scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 active:bg-gray-200 border border-gray-200'
                )}
                style={activeCategory === cat.key ? {
                  backgroundColor: primaryColor,
                } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Logo Marquee */}
        <div
          className={cn(
            'rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8',
            animateClass(400)
          )}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
            <p className="text-center text-sm text-gray-500 font-medium">
              Our students are placed in leading companies worldwide
            </p>
            {enableDrag && (
              <>
                {/* Desktop drag indicator */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Drag to scroll
                </span>
                {/* Mobile swipe indicator */}
                <span className="inline-flex sm:hidden items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 animate-pulse">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Swipe to explore
                </span>
              </>
            )}
          </div>
          <LogoMarquee
            companies={filteredCompanies}
            speed={actualSpeed}
            showGrayscale={showGrayscale}
            enableDrag={enableDrag}
            pauseOnHover={pauseOnHover}
            dragSensitivity={dragSensitivity}
          />
        </div>
      </div>

      {/* Empty state for editing */}
      {isEditing && stats.length === 0 && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Configure placement stats and companies</p>
        </div>
      )}
    </section>
  )
}
