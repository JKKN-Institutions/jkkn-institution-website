'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { BlockAnimation } from '@/lib/cms/registry-types'
import { getAnimationClasses } from '@/lib/cms/animation-utils'

interface AnimationWrapperProps {
  /** Animation configuration */
  animation?: BlockAnimation
  /** Children to wrap with animation */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
  /** Whether this is in editor mode (animations might be disabled) */
  isEditing?: boolean
  /** Custom threshold for intersection observer (0-1) */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
}

/**
 * AnimationWrapper Component
 *
 * Wraps any CMS block with animation capabilities:
 * - Entrance animations (fade, slide, zoom, etc.)
 * - Scroll-triggered animations using Intersection Observer
 * - Hover effects
 * - Animation delays and durations
 *
 * Usage:
 * <AnimationWrapper animation={block.props._animation}>
 *   <HeroSection {...props} />
 * </AnimationWrapper>
 */
export function AnimationWrapper({
  animation,
  children,
  className,
  isEditing = false,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
}: AnimationWrapperProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  // Get animation classes from configuration
  const animationResult = getAnimationClasses(animation)

  // Determine if we should use Intersection Observer
  const useObserver = animationResult.needsObserver && !isEditing

  useEffect(() => {
    // Skip if not using observer or element doesn't exist
    if (!useObserver || !elementRef.current) {
      // If not using observer, mark as visible immediately
      if (!animation?.animateOnScroll) {
        setIsVisible(true)
      }
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)

            // If not repeating, disconnect after first trigger
            if (!animationResult.repeatsOnScroll) {
              setHasAnimated(true)
              observer.disconnect()
            }
          } else if (animationResult.repeatsOnScroll && hasAnimated) {
            // Reset for repeat animations
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(elementRef.current)

    return () => observer.disconnect()
  }, [useObserver, threshold, rootMargin, animationResult.repeatsOnScroll, hasAnimated, animation?.animateOnScroll])

  // In editor mode, show content without animations for easier editing
  if (isEditing) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  // If no animation config, just render children
  if (!animation || (animation.entrance === 'none' && animation.hoverEffect === 'none')) {
    return (
      <div className={className}>
        {children}
      </div>
    )
  }

  // Build class names
  const wrapperClasses = cn(
    // Base animation classes
    animationResult.className,
    // Is-visible class for scroll-triggered animations
    isVisible && 'is-visible',
    // User-provided classes
    className
  )

  return (
    <div
      ref={elementRef}
      className={wrapperClasses}
    >
      {children}
    </div>
  )
}

/**
 * Hook for using animations programmatically
 */
export function useScrollAnimation(
  animation?: BlockAnimation,
  options?: {
    threshold?: number
    rootMargin?: string
  }
) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const animationResult = getAnimationClasses(animation)
  const shouldObserve = animationResult.needsObserver

  useEffect(() => {
    if (!shouldObserve || !elementRef.current) {
      if (!animation?.animateOnScroll) {
        setIsVisible(true)
      }
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (!animationResult.repeatsOnScroll) {
              setHasAnimated(true)
              observer.disconnect()
            }
          } else if (animationResult.repeatsOnScroll && hasAnimated) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? '0px 0px -50px 0px',
      }
    )

    observer.observe(elementRef.current)

    return () => observer.disconnect()
  }, [shouldObserve, options?.threshold, options?.rootMargin, animationResult.repeatsOnScroll, hasAnimated, animation?.animateOnScroll])

  return {
    ref: elementRef,
    isVisible,
    className: cn(
      animationResult.className,
      isVisible && 'is-visible'
    ),
    animationClasses: animationResult.className,
  }
}

export default AnimationWrapper
