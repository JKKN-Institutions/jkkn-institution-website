'use client'

import { useMemo } from 'react'
import { usePageTypography } from '@/lib/cms/page-typography-context'
import type {
  TextTypography,
  BadgeTypography,
  FontSize,
  FontWeight,
  FontStyle,
  FontFamily,
} from '@/lib/cms/page-typography-types'
import {
  getTypographyClasses,
  getTypographyStyles,
  FONT_SIZE_RESPONSIVE_CLASSES,
  FONT_WEIGHT_CLASSES,
  FONT_STYLE_CLASSES,
  FONT_FAMILY_STACKS,
} from '@/lib/cms/page-typography-types'

/**
 * Props that section components can pass to override page-level typography
 */
export interface SectionTypographyOverrides {
  // Title overrides
  titleColor?: string
  titleFontSize?: FontSize | string
  titleFontWeight?: FontWeight | string
  titleFontStyle?: FontStyle | string

  // Subtitle overrides
  subtitleColor?: string
  subtitleFontSize?: FontSize | string
  subtitleFontWeight?: FontWeight | string
  subtitleFontStyle?: FontStyle | string

  // Badge overrides
  badgeColor?: string
  badgeBgColor?: string
  badgeFontSize?: FontSize | string
  badgeFontWeight?: FontWeight | string
  badgeFontStyle?: FontStyle | string
}

/**
 * Computed styles for a typography element
 */
export interface ComputedTypographyStyles {
  /** The merged typography settings */
  settings: TextTypography | BadgeTypography
  /** Tailwind classes for the element */
  className: string
  /** Inline styles (for color, backgroundColor) */
  style: React.CSSProperties
}

/**
 * Return type for useSectionTypography hook
 */
export interface SectionTypographyResult {
  /** Page-level font family */
  fontFamily: FontFamily
  /** Computed title styles */
  title: ComputedTypographyStyles
  /** Computed subtitle styles */
  subtitle: ComputedTypographyStyles
  /** Computed badge styles */
  badge: ComputedTypographyStyles & {
    /** Badge-specific: background color */
    backgroundColor?: string
  }
}

/**
 * Safely cast string to FontSize if valid
 */
function toFontSize(value: FontSize | string | undefined): FontSize | undefined {
  if (!value) return undefined
  const validSizes: FontSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']
  return validSizes.includes(value as FontSize) ? (value as FontSize) : undefined
}

/**
 * Safely cast string to FontWeight if valid
 */
function toFontWeight(value: FontWeight | string | undefined): FontWeight | undefined {
  if (!value) return undefined
  const validWeights: FontWeight[] = ['normal', 'medium', 'semibold', 'bold', 'extrabold']
  return validWeights.includes(value as FontWeight) ? (value as FontWeight) : undefined
}

/**
 * Safely cast string to FontStyle if valid
 */
function toFontStyle(value: FontStyle | string | undefined): FontStyle | undefined {
  if (!value) return undefined
  const validStyles: FontStyle[] = ['normal', 'italic']
  return validStyles.includes(value as FontStyle) ? (value as FontStyle) : undefined
}

/**
 * Hook for section components to get merged typography styles.
 *
 * Merges in order of priority (lowest to highest):
 * 1. Default typography
 * 2. Page-level settings (from cms_pages.metadata.typography)
 * 3. Block-level overrides (from component props)
 *
 * @example
 * ```tsx
 * function AboutSection({ titleColor, subtitleFontSize }: AboutSectionProps) {
 *   const { title, subtitle, badge } = useSectionTypography({
 *     titleColor,
 *     subtitleFontSize,
 *   })
 *
 *   return (
 *     <section>
 *       <span className={badge.className} style={badge.style}>{badgeText}</span>
 *       <h2 className={title.className} style={title.style}>{titleText}</h2>
 *       <p className={subtitle.className} style={subtitle.style}>{subtitleText}</p>
 *     </section>
 *   )
 * }
 * ```
 */
export function useSectionTypography(
  overrides: SectionTypographyOverrides = {}
): SectionTypographyResult {
  const { getTitleStyles, getSubtitleStyles, getBadgeStyles, fontFamily } = usePageTypography()

  return useMemo(() => {
    // Build title styles
    const titleOverrides: Partial<TextTypography> = {}
    if (overrides.titleColor) titleOverrides.color = overrides.titleColor
    if (overrides.titleFontSize) titleOverrides.fontSize = toFontSize(overrides.titleFontSize)
    if (overrides.titleFontWeight) titleOverrides.fontWeight = toFontWeight(overrides.titleFontWeight)
    if (overrides.titleFontStyle) titleOverrides.fontStyle = toFontStyle(overrides.titleFontStyle)

    const titleSettings = getTitleStyles(titleOverrides)
    const titleClasses: string[] = []
    if (titleSettings.fontSize) {
      titleClasses.push(FONT_SIZE_RESPONSIVE_CLASSES[titleSettings.fontSize])
    }
    if (titleSettings.fontWeight) {
      titleClasses.push(FONT_WEIGHT_CLASSES[titleSettings.fontWeight])
    }
    if (titleSettings.fontStyle) {
      titleClasses.push(FONT_STYLE_CLASSES[titleSettings.fontStyle])
    }

    // Build subtitle styles
    const subtitleOverrides: Partial<TextTypography> = {}
    if (overrides.subtitleColor) subtitleOverrides.color = overrides.subtitleColor
    if (overrides.subtitleFontSize) subtitleOverrides.fontSize = toFontSize(overrides.subtitleFontSize)
    if (overrides.subtitleFontWeight) subtitleOverrides.fontWeight = toFontWeight(overrides.subtitleFontWeight)
    if (overrides.subtitleFontStyle) subtitleOverrides.fontStyle = toFontStyle(overrides.subtitleFontStyle)

    const subtitleSettings = getSubtitleStyles(subtitleOverrides)
    const subtitleClasses: string[] = []
    if (subtitleSettings.fontSize) {
      subtitleClasses.push(FONT_SIZE_RESPONSIVE_CLASSES[subtitleSettings.fontSize])
    }
    if (subtitleSettings.fontWeight) {
      subtitleClasses.push(FONT_WEIGHT_CLASSES[subtitleSettings.fontWeight])
    }
    if (subtitleSettings.fontStyle) {
      subtitleClasses.push(FONT_STYLE_CLASSES[subtitleSettings.fontStyle])
    }

    // Build badge styles
    const badgeOverrides: Partial<BadgeTypography> = {}
    if (overrides.badgeColor) badgeOverrides.color = overrides.badgeColor
    if (overrides.badgeBgColor) badgeOverrides.backgroundColor = overrides.badgeBgColor
    if (overrides.badgeFontSize) badgeOverrides.fontSize = toFontSize(overrides.badgeFontSize)
    if (overrides.badgeFontWeight) badgeOverrides.fontWeight = toFontWeight(overrides.badgeFontWeight)
    if (overrides.badgeFontStyle) badgeOverrides.fontStyle = toFontStyle(overrides.badgeFontStyle)

    const badgeSettings = getBadgeStyles(badgeOverrides)
    const badgeClasses: string[] = []
    if (badgeSettings.fontSize) {
      // Use non-responsive for badges (they're typically small)
      badgeClasses.push(`text-${badgeSettings.fontSize}`)
    }
    if (badgeSettings.fontWeight) {
      badgeClasses.push(FONT_WEIGHT_CLASSES[badgeSettings.fontWeight])
    }
    if (badgeSettings.fontStyle) {
      badgeClasses.push(FONT_STYLE_CLASSES[badgeSettings.fontStyle])
    }

    // Get font family stack for inline styles
    const fontFamilyStack = FONT_FAMILY_STACKS[fontFamily]

    return {
      fontFamily,
      title: {
        settings: titleSettings,
        className: titleClasses.join(' '),
        style: {
          ...getTypographyStyles(titleSettings),
          fontFamily: fontFamilyStack,
        },
      },
      subtitle: {
        settings: subtitleSettings,
        className: subtitleClasses.join(' '),
        style: {
          ...getTypographyStyles(subtitleSettings),
          fontFamily: fontFamilyStack,
        },
      },
      badge: {
        settings: badgeSettings,
        className: badgeClasses.join(' '),
        style: {
          ...getTypographyStyles(badgeSettings),
          fontFamily: fontFamilyStack,
        },
        backgroundColor: badgeSettings.backgroundColor,
      },
    }
  }, [
    getTitleStyles,
    getSubtitleStyles,
    getBadgeStyles,
    fontFamily,
    overrides.titleColor,
    overrides.titleFontSize,
    overrides.titleFontWeight,
    overrides.titleFontStyle,
    overrides.subtitleColor,
    overrides.subtitleFontSize,
    overrides.subtitleFontWeight,
    overrides.subtitleFontStyle,
    overrides.badgeColor,
    overrides.badgeBgColor,
    overrides.badgeFontSize,
    overrides.badgeFontWeight,
    overrides.badgeFontStyle,
  ])
}

export default useSectionTypography
