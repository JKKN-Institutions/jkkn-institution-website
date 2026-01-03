'use client'

/**
 * React Hooks for Multi-Tenant Institution Features
 *
 * These hooks provide client-side access to institution configuration
 * and feature flags. They use environment variables that are embedded
 * at build time via NEXT_PUBLIC_* prefix.
 */

import React, { useMemo } from 'react'
import type { FeatureFlag, InstitutionConfig } from '@/lib/config/multi-tenant'

// =============================================================================
// INSTITUTION HOOK
// =============================================================================

/**
 * Hook to get current institution configuration.
 * Safe to use in client components.
 *
 * @example
 * ```tsx
 * function Header() {
 *   const institution = useInstitution()
 *   return <h1>{institution.name}</h1>
 * }
 * ```
 */
export function useInstitution(): InstitutionConfig {
  return useMemo(() => {
    const id = process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'

    return {
      id,
      name: process.env.NEXT_PUBLIC_INSTITUTION_NAME || 'JKKN Institutions',
      shortName: process.env.NEXT_PUBLIC_INSTITUTION_SHORT_NAME || 'JKKN',
      domain: process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') || 'jkkn.ac.in',
      type: 'main' as const,
      theme: {
        primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#1e3a8a',
        secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#3b82f6',
        accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#f59e0b',
      },
      features: getFeatures(),
    }
  }, [])
}

/**
 * Hook to get just the institution ID.
 *
 * @example
 * ```tsx
 * const institutionId = useInstitutionId()
 * if (institutionId === 'dental') {
 *   // Show dental-specific content
 * }
 * ```
 */
export function useInstitutionId(): string {
  return process.env.NEXT_PUBLIC_INSTITUTION_ID || 'main'
}

/**
 * Hook to check if current institution matches a specific ID.
 *
 * @example
 * ```tsx
 * const isDental = useIsInstitution('dental')
 * ```
 */
export function useIsInstitution(id: string): boolean {
  const currentId = useInstitutionId()
  return currentId === id
}

/**
 * Hook to check if this is the main/umbrella institution.
 */
export function useIsMainInstitution(): boolean {
  return useIsInstitution('main')
}

// =============================================================================
// FEATURE FLAGS HOOKS
// =============================================================================

/**
 * Get all enabled features as an array.
 */
function getFeatures(): FeatureFlag[] {
  const featuresEnv = process.env.NEXT_PUBLIC_FEATURES || ''

  if (!featuresEnv) {
    return ['blog', 'careers', 'page-builder', 'analytics']
  }

  return featuresEnv.split(',').map(f => f.trim()) as FeatureFlag[]
}

/**
 * Hook to get all enabled features.
 *
 * @example
 * ```tsx
 * const features = useFeatures()
 * // ['blog', 'careers', 'analytics']
 * ```
 */
export function useFeatures(): FeatureFlag[] {
  return useMemo(() => getFeatures(), [])
}

/**
 * Hook to check if a specific feature is enabled.
 *
 * @example
 * ```tsx
 * function BlogLink() {
 *   const hasBlog = useHasFeature('blog')
 *   if (!hasBlog) return null
 *   return <Link href="/blog">Blog</Link>
 * }
 * ```
 */
export function useHasFeature(feature: FeatureFlag): boolean {
  const features = useFeatures()
  return features.includes(feature)
}

/**
 * Hook to check if all specified features are enabled.
 *
 * @example
 * ```tsx
 * const canShowAnalytics = useHasAllFeatures('analytics', 'blog')
 * ```
 */
export function useHasAllFeatures(...requiredFeatures: FeatureFlag[]): boolean {
  const features = useFeatures()
  return requiredFeatures.every(f => features.includes(f))
}

/**
 * Hook to check if any of the specified features are enabled.
 *
 * @example
 * ```tsx
 * const hasAnyContent = useHasAnyFeature('blog', 'careers', 'events')
 * ```
 */
export function useHasAnyFeature(...requiredFeatures: FeatureFlag[]): boolean {
  const features = useFeatures()
  return requiredFeatures.some(f => features.includes(f))
}

// =============================================================================
// THEME HOOK
// =============================================================================

/**
 * Hook to get institution theme colors.
 *
 * @example
 * ```tsx
 * function ThemedButton() {
 *   const theme = useInstitutionTheme()
 *   return (
 *     <button style={{ backgroundColor: theme.primaryColor }}>
 *       Click me
 *     </button>
 *   )
 * }
 * ```
 */
export function useInstitutionTheme() {
  return useMemo(() => ({
    primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#1e3a8a',
    secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#3b82f6',
    accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#f59e0b',
  }), [])
}

// =============================================================================
// CONDITIONAL RENDERING COMPONENTS
// =============================================================================

interface FeatureGateProps {
  feature: FeatureFlag
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component to conditionally render content based on feature flag.
 *
 * @example
 * ```tsx
 * <FeatureGate feature="blog">
 *   <BlogSection />
 * </FeatureGate>
 *
 * <FeatureGate feature="events" fallback={<ComingSoon />}>
 *   <EventsCalendar />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const hasFeature = useHasFeature(feature)
  return hasFeature ? <>{children}</> : <>{fallback}</>
}

interface InstitutionGateProps {
  institution: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Component to conditionally render content based on institution.
 *
 * @example
 * ```tsx
 * <InstitutionGate institution="dental">
 *   <DentalClinicInfo />
 * </InstitutionGate>
 *
 * <InstitutionGate institution={['dental', 'nursing']}>
 *   <HealthcareBanner />
 * </InstitutionGate>
 * ```
 */
export function InstitutionGate({ institution, children, fallback = null }: InstitutionGateProps) {
  const currentId = useInstitutionId()
  const institutions = Array.isArray(institution) ? institution : [institution]
  const matches = institutions.includes(currentId)

  return matches ? <>{children}</> : <>{fallback}</>
}

