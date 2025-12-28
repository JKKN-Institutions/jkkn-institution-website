'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type {
  PageTypographySettings,
  TextTypography,
  BadgeTypography,
  FontFamily,
} from './page-typography-types'
import {
  DEFAULT_TITLE_TYPOGRAPHY,
  DEFAULT_SUBTITLE_TYPOGRAPHY,
  DEFAULT_BADGE_TYPOGRAPHY,
  DEFAULT_FONT_FAMILY,
} from './page-typography-types'

/**
 * Context value interface
 */
interface PageTypographyContextValue {
  /** Page-level font family (applies to entire page) */
  fontFamily: FontFamily

  /** The page-level typography settings */
  typography: PageTypographySettings

  /**
   * Get computed title styles by merging:
   * defaults → page-level → block-level overrides
   */
  getTitleStyles: (blockOverrides?: Partial<TextTypography>) => TextTypography

  /**
   * Get computed subtitle styles by merging:
   * defaults → page-level → block-level overrides
   */
  getSubtitleStyles: (blockOverrides?: Partial<TextTypography>) => TextTypography

  /**
   * Get computed badge styles by merging:
   * defaults → page-level → block-level overrides
   */
  getBadgeStyles: (blockOverrides?: Partial<BadgeTypography>) => BadgeTypography
}

const PageTypographyContext = createContext<PageTypographyContextValue | null>(null)

interface PageTypographyProviderProps {
  children: ReactNode
  /** Typography settings from page metadata */
  typography?: PageTypographySettings
}

/**
 * Merge typography objects, removing undefined values
 */
function mergeTypography<T extends Record<string, unknown>>(
  base: T,
  ...overrides: (Partial<T> | undefined)[]
): T {
  const result = { ...base }

  for (const override of overrides) {
    if (!override) continue
    for (const key of Object.keys(override) as (keyof T)[]) {
      if (override[key] !== undefined) {
        result[key] = override[key] as T[keyof T]
      }
    }
  }

  return result
}

/**
 * Provider component that wraps page content and provides typography settings
 * to all section components via React Context.
 */
export function PageTypographyProvider({
  children,
  typography,
}: PageTypographyProviderProps) {
  const value = useMemo<PageTypographyContextValue>(() => {
    // Get font family with fallback to default
    const fontFamily = typography?.fontFamily || DEFAULT_FONT_FAMILY

    // Merge page-level settings with defaults
    const pageTitle = mergeTypography(
      DEFAULT_TITLE_TYPOGRAPHY,
      typography?.title
    )
    const pageSubtitle = mergeTypography(
      DEFAULT_SUBTITLE_TYPOGRAPHY,
      typography?.subtitle
    )
    const pageBadge = mergeTypography(
      DEFAULT_BADGE_TYPOGRAPHY,
      typography?.badge
    )

    return {
      fontFamily,

      typography: {
        fontFamily,
        title: pageTitle,
        subtitle: pageSubtitle,
        badge: pageBadge,
      },

      getTitleStyles: (blockOverrides?: Partial<TextTypography>): TextTypography => {
        return mergeTypography(pageTitle, blockOverrides)
      },

      getSubtitleStyles: (blockOverrides?: Partial<TextTypography>): TextTypography => {
        return mergeTypography(pageSubtitle, blockOverrides)
      },

      getBadgeStyles: (blockOverrides?: Partial<BadgeTypography>): BadgeTypography => {
        return mergeTypography(pageBadge, blockOverrides)
      },
    }
  }, [typography])

  return (
    <PageTypographyContext.Provider value={value}>
      {children}
    </PageTypographyContext.Provider>
  )
}

/**
 * Hook to access page typography settings in section components.
 *
 * If used outside a PageTypographyProvider, returns default values
 * for backward compatibility.
 *
 * @example
 * ```tsx
 * function MySection({ titleColor }: MySectionProps) {
 *   const { getTitleStyles } = usePageTypography()
 *
 *   // Get styles with block-level override
 *   const titleStyles = getTitleStyles({ color: titleColor })
 *
 *   return <h2 style={{ color: titleStyles.color }}>...</h2>
 * }
 * ```
 */
export function usePageTypography(): PageTypographyContextValue {
  const context = useContext(PageTypographyContext)

  // Return defaults if not within provider (backward compatibility)
  if (!context) {
    return {
      fontFamily: DEFAULT_FONT_FAMILY,
      typography: {
        fontFamily: DEFAULT_FONT_FAMILY,
        title: DEFAULT_TITLE_TYPOGRAPHY,
        subtitle: DEFAULT_SUBTITLE_TYPOGRAPHY,
        badge: DEFAULT_BADGE_TYPOGRAPHY,
      },
      getTitleStyles: (overrides?: Partial<TextTypography>) =>
        mergeTypography(DEFAULT_TITLE_TYPOGRAPHY, overrides),
      getSubtitleStyles: (overrides?: Partial<TextTypography>) =>
        mergeTypography(DEFAULT_SUBTITLE_TYPOGRAPHY, overrides),
      getBadgeStyles: (overrides?: Partial<BadgeTypography>) =>
        mergeTypography(DEFAULT_BADGE_TYPOGRAPHY, overrides),
    }
  }

  return context
}

/**
 * HOC to wrap a component with PageTypographyProvider
 * Useful for testing or when rendering components outside the page context
 */
export function withPageTypography<P extends object>(
  Component: React.ComponentType<P>,
  typography?: PageTypographySettings
) {
  return function WrappedComponent(props: P) {
    return (
      <PageTypographyProvider typography={typography}>
        <Component {...props} />
      </PageTypographyProvider>
    )
  }
}
