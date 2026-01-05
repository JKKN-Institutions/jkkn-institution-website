/**
 * Style Applicator Utilities
 *
 * Converts block _styles and _motion props into CSS properties and data attributes
 * that can be applied to wrapper elements around CMS components.
 */

import type { CSSProperties } from 'react'

// Type definitions for block styles
export interface BlockTypography {
  fontSize?: string
  fontWeight?: string
  fontFamily?: string
  fontStyle?: 'normal' | 'italic'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  color?: string
  lineHeight?: string
  letterSpacing?: string
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through'
}

export interface BlockSpacing {
  padding?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  paddingLeft?: string | number
  margin?: string | number
  marginTop?: string | number
  marginRight?: string | number
  marginBottom?: string | number
  marginLeft?: string | number
}

export interface BlockBackground {
  color?: string
  image?: string
  position?: string
  size?: 'cover' | 'contain' | 'auto'
  repeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
  attachment?: 'scroll' | 'fixed'
  gradient?: string
}

export interface BlockBorder {
  width?: string | number
  style?: 'solid' | 'dashed' | 'dotted' | 'none'
  color?: string
  radius?: string | number
  radiusTopLeft?: string | number
  radiusTopRight?: string | number
  radiusBottomLeft?: string | number
  radiusBottomRight?: string | number
  // Individual border widths
  borderWidth?: string | number
  borderTopWidth?: string | number
  borderRightWidth?: string | number
  borderBottomWidth?: string | number
  borderLeftWidth?: string | number
  borderRadius?: string | number
  borderTopLeftRadius?: string | number
  borderTopRightRadius?: string | number
  borderBottomRightRadius?: string | number
  borderBottomLeftRadius?: string | number
  borderStyle?: string
  borderColor?: string
}

export interface BlockShadow {
  value?: string
  boxShadow?: string
  // Pre-defined shadows
  preset?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner'
}

export interface BlockStyles {
  typography?: BlockTypography
  spacing?: BlockSpacing
  background?: BlockBackground
  border?: BlockBorder
  shadow?: BlockShadow
  // Additional style properties
  opacity?: number
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block' | 'none'
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  zIndex?: number
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string
}

export interface BlockMotion {
  animation?: string
  duration?: string
  delay?: string
  easing?: string
  iterationCount?: string | number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  // Scroll-triggered animations
  scrollTrigger?: boolean
  scrollThreshold?: number
  // Hover effects
  hoverScale?: number
  hoverRotate?: number
  hoverTranslateY?: number
}

// Shadow preset values
const SHADOW_PRESETS: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}

/**
 * Converts block styles to React CSS properties
 */
export function applyBlockStyles(styles?: BlockStyles): CSSProperties {
  if (!styles) return {}

  const cssProperties: CSSProperties = {}

  // Typography
  if (styles.typography) {
    const { typography } = styles
    if (typography.fontSize) cssProperties.fontSize = typography.fontSize
    if (typography.fontWeight) cssProperties.fontWeight = typography.fontWeight
    if (typography.fontFamily) cssProperties.fontFamily = typography.fontFamily
    if (typography.textAlign) cssProperties.textAlign = typography.textAlign
    if (typography.color) cssProperties.color = typography.color
    if (typography.lineHeight) cssProperties.lineHeight = typography.lineHeight
    if (typography.letterSpacing) cssProperties.letterSpacing = typography.letterSpacing
    if (typography.textTransform) cssProperties.textTransform = typography.textTransform
    if (typography.textDecoration) cssProperties.textDecoration = typography.textDecoration
    if (typography.fontStyle) cssProperties.fontStyle = typography.fontStyle
  }

  // Spacing - convert numeric values to pixels
  if (styles.spacing) {
    const { spacing } = styles
    const toPixels = (value?: string | number): string | undefined => {
      if (value === undefined || value === null) return undefined
      if (typeof value === 'number') return `${value}px`
      return value
    }
    if (spacing.padding !== undefined) cssProperties.padding = toPixels(spacing.padding)
    if (spacing.paddingTop !== undefined) cssProperties.paddingTop = toPixels(spacing.paddingTop)
    if (spacing.paddingRight !== undefined) cssProperties.paddingRight = toPixels(spacing.paddingRight)
    if (spacing.paddingBottom !== undefined) cssProperties.paddingBottom = toPixels(spacing.paddingBottom)
    if (spacing.paddingLeft !== undefined) cssProperties.paddingLeft = toPixels(spacing.paddingLeft)
    if (spacing.margin !== undefined) cssProperties.margin = toPixels(spacing.margin)
    if (spacing.marginTop !== undefined) cssProperties.marginTop = toPixels(spacing.marginTop)
    if (spacing.marginRight !== undefined) cssProperties.marginRight = toPixels(spacing.marginRight)
    if (spacing.marginBottom !== undefined) cssProperties.marginBottom = toPixels(spacing.marginBottom)
    if (spacing.marginLeft !== undefined) cssProperties.marginLeft = toPixels(spacing.marginLeft)
  }

  // Background
  if (styles.background) {
    const { background } = styles
    if (background.color) cssProperties.backgroundColor = background.color
    if (background.image) {
      cssProperties.backgroundImage = background.gradient
        ? `${background.gradient}, url(${background.image})`
        : `url(${background.image})`
    } else if (background.gradient) {
      cssProperties.backgroundImage = background.gradient
    }
    if (background.position) cssProperties.backgroundPosition = background.position
    if (background.size) cssProperties.backgroundSize = background.size
    if (background.repeat) cssProperties.backgroundRepeat = background.repeat
    if (background.attachment) cssProperties.backgroundAttachment = background.attachment
  }

  // Border - convert numeric values to pixels
  if (styles.border) {
    const { border } = styles
    const toPixels = (value?: string | number): string | undefined => {
      if (value === undefined || value === null) return undefined
      if (typeof value === 'number') return `${value}px`
      return value
    }
    // Handle various border property naming conventions
    if (border.width !== undefined) cssProperties.borderWidth = toPixels(border.width)
    if (border.borderWidth !== undefined) cssProperties.borderWidth = toPixels(border.borderWidth)
    if (border.borderTopWidth !== undefined) cssProperties.borderTopWidth = toPixels(border.borderTopWidth)
    if (border.borderRightWidth !== undefined) cssProperties.borderRightWidth = toPixels(border.borderRightWidth)
    if (border.borderBottomWidth !== undefined) cssProperties.borderBottomWidth = toPixels(border.borderBottomWidth)
    if (border.borderLeftWidth !== undefined) cssProperties.borderLeftWidth = toPixels(border.borderLeftWidth)
    if (border.style) cssProperties.borderStyle = border.style
    if (border.borderStyle) cssProperties.borderStyle = border.borderStyle
    if (border.color) cssProperties.borderColor = border.color
    if (border.borderColor) cssProperties.borderColor = border.borderColor
    if (border.radius !== undefined) cssProperties.borderRadius = toPixels(border.radius)
    if (border.borderRadius !== undefined) cssProperties.borderRadius = toPixels(border.borderRadius)
    if (border.radiusTopLeft !== undefined) cssProperties.borderTopLeftRadius = toPixels(border.radiusTopLeft)
    if (border.borderTopLeftRadius !== undefined) cssProperties.borderTopLeftRadius = toPixels(border.borderTopLeftRadius)
    if (border.radiusTopRight !== undefined) cssProperties.borderTopRightRadius = toPixels(border.radiusTopRight)
    if (border.borderTopRightRadius !== undefined) cssProperties.borderTopRightRadius = toPixels(border.borderTopRightRadius)
    if (border.radiusBottomLeft !== undefined) cssProperties.borderBottomLeftRadius = toPixels(border.radiusBottomLeft)
    if (border.radiusBottomRight !== undefined) cssProperties.borderBottomRightRadius = toPixels(border.radiusBottomRight)
    if (border.borderBottomRightRadius !== undefined) cssProperties.borderBottomRightRadius = toPixels(border.borderBottomRightRadius)
    if (border.borderBottomLeftRadius !== undefined) cssProperties.borderBottomLeftRadius = toPixels(border.borderBottomLeftRadius)
  }

  // Shadow
  if (styles.shadow) {
    const { shadow } = styles
    if (shadow.preset && SHADOW_PRESETS[shadow.preset]) {
      cssProperties.boxShadow = SHADOW_PRESETS[shadow.preset]
    } else if (shadow.boxShadow) {
      cssProperties.boxShadow = shadow.boxShadow
    } else if (shadow.value) {
      cssProperties.boxShadow = shadow.value
    }
  }

  // Additional properties
  if (styles.opacity !== undefined) cssProperties.opacity = styles.opacity
  if (styles.overflow) cssProperties.overflow = styles.overflow
  if (styles.display) cssProperties.display = styles.display
  if (styles.position) cssProperties.position = styles.position
  if (styles.zIndex !== undefined) cssProperties.zIndex = styles.zIndex
  if (styles.width) cssProperties.width = styles.width
  if (styles.height) cssProperties.height = styles.height
  if (styles.minWidth) cssProperties.minWidth = styles.minWidth
  if (styles.maxWidth) cssProperties.maxWidth = styles.maxWidth
  if (styles.minHeight) cssProperties.minHeight = styles.minHeight
  if (styles.maxHeight) cssProperties.maxHeight = styles.maxHeight

  return cssProperties
}

/**
 * Generates data attributes for motion/animation settings
 * These can be picked up by animation libraries like Framer Motion or GSAP
 */
export function getMotionDataAttributes(motion?: BlockMotion): Record<string, string | number | undefined> {
  if (!motion) return {}

  return {
    'data-animate': motion.animation,
    'data-duration': motion.duration,
    'data-delay': motion.delay,
    'data-easing': motion.easing,
    'data-iteration': motion.iterationCount?.toString(),
    'data-direction': motion.direction,
    'data-fill-mode': motion.fillMode,
    'data-scroll-trigger': motion.scrollTrigger ? 'true' : undefined,
    'data-scroll-threshold': motion.scrollThreshold?.toString(),
    'data-hover-scale': motion.hoverScale?.toString(),
    'data-hover-rotate': motion.hoverRotate?.toString(),
    'data-hover-translate-y': motion.hoverTranslateY?.toString(),
  }
}

/**
 * Generates inline CSS for motion/animation
 */
export function applyMotionStyles(motion?: BlockMotion): CSSProperties {
  if (!motion) return {}

  const cssProperties: CSSProperties = {}

  // Animation properties
  if (motion.animation) {
    cssProperties.animationName = motion.animation
  }
  if (motion.duration) {
    cssProperties.animationDuration = motion.duration
  }
  if (motion.delay) {
    cssProperties.animationDelay = motion.delay
  }
  if (motion.easing) {
    cssProperties.animationTimingFunction = motion.easing
  }
  if (motion.iterationCount !== undefined) {
    cssProperties.animationIterationCount = motion.iterationCount
  }
  if (motion.direction) {
    cssProperties.animationDirection = motion.direction
  }
  if (motion.fillMode) {
    cssProperties.animationFillMode = motion.fillMode
  }

  // Hover effects (these need to be applied via CSS classes or JS event handlers)
  // For now, we'll add transition for smooth hover effects
  if (motion.hoverScale !== undefined || motion.hoverRotate !== undefined || motion.hoverTranslateY !== undefined) {
    cssProperties.transition = 'transform 0.3s ease'
  }

  return cssProperties
}

/**
 * Generates hover transform string for motion effects
 */
export function getHoverTransform(motion?: BlockMotion): string | undefined {
  if (!motion) return undefined

  const transforms: string[] = []

  if (motion.hoverScale !== undefined) {
    transforms.push(`scale(${motion.hoverScale})`)
  }
  if (motion.hoverRotate !== undefined) {
    transforms.push(`rotate(${motion.hoverRotate}deg)`)
  }
  if (motion.hoverTranslateY !== undefined) {
    transforms.push(`translateY(${motion.hoverTranslateY}px)`)
  }

  return transforms.length > 0 ? transforms.join(' ') : undefined
}

/**
 * Combines all style sources into final CSS properties
 */
export function combineBlockStyles(
  styles?: BlockStyles,
  motion?: BlockMotion,
  customCss?: string
): CSSProperties {
  const baseStyles = applyBlockStyles(styles)
  const motionStyles = applyMotionStyles(motion)

  // Note: customCss is handled separately as inline style string
  // It should be applied via a style element or CSS-in-JS

  return {
    ...baseStyles,
    ...motionStyles,
  }
}

/**
 * Parses custom CSS string into a style object (limited support)
 * For full CSS support, use a CSS parser or apply via style element
 */
export function parseCustomCss(customCss?: string): CSSProperties {
  if (!customCss) return {}

  const styles: Record<string, string> = {}

  // Simple CSS property parser (property: value;)
  const declarations = customCss.split(';').filter(Boolean)

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map(s => s.trim())
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styles[camelProperty] = value
    }
  }

  return styles as CSSProperties
}
