'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  mode?: 'fade' | 'slide' | 'scale' | 'none'
  duration?: 'fast' | 'normal' | 'slow'
}

const transitionClasses = {
  fade: {
    enter: 'animate-in fade-in',
    exit: 'animate-out fade-out',
  },
  slide: {
    enter: 'animate-in fade-in slide-in-from-bottom-4',
    exit: 'animate-out fade-out slide-out-to-top-4',
  },
  scale: {
    enter: 'animate-in fade-in zoom-in-95',
    exit: 'animate-out fade-out zoom-out-95',
  },
  none: {
    enter: '',
    exit: '',
  },
}

const durationClasses = {
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',
}

export function PageTransition({
  children,
  className,
  mode = 'fade',
  duration = 'normal',
}: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // Start exit animation
    setIsTransitioning(true)

    // After a brief delay, swap content and start enter animation
    const timeout = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 150)

    return () => clearTimeout(timeout)
  }, [pathname, children])

  const animationClass = isTransitioning
    ? transitionClasses[mode].exit
    : transitionClasses[mode].enter

  return (
    <div
      className={cn(
        animationClass,
        durationClasses[duration],
        'fill-mode-forwards',
        className
      )}
    >
      {displayChildren}
    </div>
  )
}

// Simpler fade-in animation on mount
interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 300,
}: FadeInProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        'transition-all',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

// Stagger children animation
interface StaggerProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
}

export function Stagger({ children, className, staggerDelay = 50 }: StaggerProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

// Animate on scroll into view
interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale'
  threshold?: number
}

export function AnimateOnScroll({
  children,
  className,
  animation = 'fade',
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(ref)
        }
      },
      { threshold }
    )

    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, threshold])

  const animationClasses = {
    fade: isVisible ? 'opacity-100' : 'opacity-0',
    'slide-up': isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8',
    'slide-left': isVisible
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 translate-x-8',
    'slide-right': isVisible
      ? 'opacity-100 translate-x-0'
      : 'opacity-0 -translate-x-8',
    scale: isVisible
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-95',
  }

  return (
    <div
      ref={setRef}
      className={cn(
        'transition-all duration-500 ease-out',
        animationClasses[animation],
        className
      )}
    >
      {children}
    </div>
  )
}
