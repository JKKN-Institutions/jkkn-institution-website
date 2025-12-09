/**
 * Animation Utilities for Page Builder
 *
 * Maps animation configuration to CSS classes from styles/animations.css
 * Provides utility functions for applying animations to blocks
 */

import type {
  BlockAnimation,
  EntranceAnimation,
  HoverEffect,
  AnimationDuration,
  AnimationDelay,
  AnimationEasing,
} from './registry-types'

/**
 * CSS class mappings for entrance animations
 * These classes must exist in styles/animations.css
 */
export const ENTRANCE_ANIMATION_CLASSES: Record<EntranceAnimation, string> = {
  'none': '',
  'fade-in': 'animate-on-scroll fade-in',
  'fade-in-up': 'animate-on-scroll fade-in-up',
  'fade-in-down': 'animate-on-scroll fade-in-down',
  'fade-in-left': 'animate-on-scroll fade-in-left',
  'fade-in-right': 'animate-on-scroll fade-in-right',
  'zoom-in': 'animate-on-scroll zoom-in',
  'zoom-in-up': 'animate-on-scroll zoom-in-up',
  'bounce-in': 'animate-on-scroll bounce-in',
  'slide-up': 'animate-on-scroll slide-up',
  'slide-down': 'animate-on-scroll slide-down',
  'slide-left': 'animate-on-scroll slide-left',
  'slide-right': 'animate-on-scroll slide-right',
  'flip-in': 'animate-on-scroll flip-in',
  'rotate-in': 'animate-on-scroll rotate-in',
}

/**
 * CSS class mappings for hover effects
 */
export const HOVER_EFFECT_CLASSES: Record<HoverEffect, string> = {
  'none': '',
  'lift': 'hover-lift',
  'glow': 'hover-glow',
  'scale': 'hover-scale',
  'float': 'hover-float',
  'pulse': 'hover-pulse',
  'border-glow': 'hover-border-glow',
  'shadow-grow': 'hover-shadow-grow',
}

/**
 * CSS class mappings for animation duration
 */
export const DURATION_CLASSES: Record<AnimationDuration, string> = {
  'fast': 'animate-duration-fast',
  'normal': 'animate-duration-normal',
  'slow': 'animate-duration-slow',
  'very-slow': 'animate-duration-very-slow',
}

/**
 * CSS class mappings for animation delay
 */
export const DELAY_CLASSES: Record<AnimationDelay, string> = {
  '0': '',
  '100': 'animate-delay-100',
  '200': 'animate-delay-200',
  '300': 'animate-delay-300',
  '400': 'animate-delay-400',
  '500': 'animate-delay-500',
  '700': 'animate-delay-700',
  '1000': 'animate-delay-1000',
}

/**
 * CSS class mappings for animation easing
 */
export const EASING_CLASSES: Record<AnimationEasing, string> = {
  'ease': 'animate-ease',
  'ease-in': 'animate-ease-in',
  'ease-out': 'animate-ease-out',
  'ease-in-out': 'animate-ease-in-out',
  'bounce': 'animate-bounce-easing',
  'spring': 'animate-spring',
}

/**
 * Result of getAnimationClasses - includes classes and metadata
 */
export interface AnimationClassResult {
  /** Combined CSS classes to apply */
  className: string
  /** Individual class arrays for debugging */
  classes: {
    entrance: string
    hover: string
    duration: string
    delay: string
    easing: string
  }
  /** Whether Intersection Observer is needed */
  needsObserver: boolean
  /** Whether the animation repeats on scroll */
  repeatsOnScroll: boolean
}

/**
 * Get all CSS classes for a block's animation configuration
 */
export function getAnimationClasses(animation?: BlockAnimation): AnimationClassResult {
  // Return empty if no animation config
  if (!animation) {
    return {
      className: '',
      classes: { entrance: '', hover: '', duration: '', delay: '', easing: '' },
      needsObserver: false,
      repeatsOnScroll: false,
    }
  }

  const entranceClass = animation.entrance ? ENTRANCE_ANIMATION_CLASSES[animation.entrance] : ''
  const hoverClass = animation.hoverEffect ? HOVER_EFFECT_CLASSES[animation.hoverEffect] : ''
  const durationClass = animation.duration ? DURATION_CLASSES[animation.duration] : ''
  const delayClass = animation.entranceDelay ? DELAY_CLASSES[animation.entranceDelay] : ''
  const easingClass = animation.easing ? EASING_CLASSES[animation.easing] : ''

  const allClasses = [entranceClass, hoverClass, durationClass, delayClass, easingClass]
    .filter(Boolean)
    .join(' ')

  return {
    className: allClasses,
    classes: {
      entrance: entranceClass,
      hover: hoverClass,
      duration: durationClass,
      delay: delayClass,
      easing: easingClass,
    },
    needsObserver: animation.animateOnScroll && animation.entrance !== 'none',
    repeatsOnScroll: animation.repeatOnScroll ?? false,
  }
}

/**
 * Get entrance animation class only (for when you need just the animation)
 */
export function getEntranceClass(entrance?: EntranceAnimation): string {
  if (!entrance || entrance === 'none') return ''
  return ENTRANCE_ANIMATION_CLASSES[entrance]
}

/**
 * Get hover effect class only
 */
export function getHoverClass(hover?: HoverEffect): string {
  if (!hover || hover === 'none') return ''
  return HOVER_EFFECT_CLASSES[hover]
}

/**
 * Check if animation configuration has any active animations
 */
export function hasAnimation(animation?: BlockAnimation): boolean {
  if (!animation) return false
  return animation.entrance !== 'none' || animation.hoverEffect !== 'none'
}

/**
 * Create a default animation configuration
 */
export function createDefaultAnimation(): BlockAnimation {
  return {
    entrance: 'none',
    entranceDelay: '0',
    duration: 'normal',
    easing: 'ease-out',
    animateOnScroll: false,
    hoverEffect: 'none',
    repeatOnScroll: false,
  }
}

/**
 * Merge partial animation config with defaults
 */
export function mergeAnimation(partial?: Partial<BlockAnimation>): BlockAnimation {
  return {
    ...createDefaultAnimation(),
    ...partial,
  }
}

/**
 * Presets for common animation combinations
 */
export const ANIMATION_PRESETS = {
  /** Subtle fade in from bottom - great for content sections */
  fadeInSubtle: {
    entrance: 'fade-in-up' as const,
    entranceDelay: '0' as const,
    duration: 'normal' as const,
    easing: 'ease-out' as const,
    animateOnScroll: true,
    hoverEffect: 'none' as const,
    repeatOnScroll: false,
  },
  /** Bounce in with lift on hover - great for cards */
  cardInteractive: {
    entrance: 'fade-in-up' as const,
    entranceDelay: '0' as const,
    duration: 'normal' as const,
    easing: 'ease-out' as const,
    animateOnScroll: true,
    hoverEffect: 'lift' as const,
    repeatOnScroll: false,
  },
  /** Zoom in with glow - great for CTAs */
  ctaAttention: {
    entrance: 'zoom-in' as const,
    entranceDelay: '200' as const,
    duration: 'normal' as const,
    easing: 'spring' as const,
    animateOnScroll: true,
    hoverEffect: 'glow' as const,
    repeatOnScroll: false,
  },
  /** Slide from left - great for lists */
  listItem: {
    entrance: 'slide-left' as const,
    entranceDelay: '0' as const,
    duration: 'fast' as const,
    easing: 'ease-out' as const,
    animateOnScroll: true,
    hoverEffect: 'scale' as const,
    repeatOnScroll: false,
  },
  /** Hero section animation */
  heroEntrance: {
    entrance: 'fade-in' as const,
    entranceDelay: '0' as const,
    duration: 'slow' as const,
    easing: 'ease-out' as const,
    animateOnScroll: false,
    hoverEffect: 'none' as const,
    repeatOnScroll: false,
  },
  /** Stats counter animation */
  statsCounter: {
    entrance: 'fade-in-up' as const,
    entranceDelay: '0' as const,
    duration: 'normal' as const,
    easing: 'ease-out' as const,
    animateOnScroll: true,
    hoverEffect: 'scale' as const,
    repeatOnScroll: false,
  },
} as const satisfies Record<string, BlockAnimation>

/**
 * Get staggered delay for list items
 * @param index Item index in the list
 * @param baseDelay Base delay in ms (default 0)
 * @param increment Increment per item in ms (default 100)
 */
export function getStaggeredDelay(index: number, baseDelay = 0, increment = 100): AnimationDelay {
  const totalDelay = baseDelay + (index * increment)
  const validDelays: AnimationDelay[] = ['0', '100', '200', '300', '400', '500', '700', '1000']

  // Find the closest valid delay
  const closest = validDelays.reduce((prev, curr) => {
    return Math.abs(parseInt(curr) - totalDelay) < Math.abs(parseInt(prev) - totalDelay) ? curr : prev
  })

  return closest
}
