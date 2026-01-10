import { NavItem } from '@/components/public/site-header'
import { FeatureFlag, hasFeature } from '@/lib/config/multi-tenant'

/**
 * Feature flag to URL pattern mapping
 * Maps feature flags to their corresponding URL paths
 */
const FEATURE_URL_PATTERNS: Partial<Record<FeatureFlag, string[]>> = {
  careers: ['/careers'],
  blog: ['/blog'],
  events: ['/events'],
  gallery: ['/gallery'],
  admissions: ['/admissions', '/admission'],
  'faculty-directory': ['/faculty'],
  'course-catalog': ['/courses'],
  testimonials: ['/testimonials'],
  newsletter: ['/newsletter'],
  'research-publications': ['/research', '/publications'],
  'alumni-network': ['/alumni'],
  'student-portal': ['/student-portal', '/students'],
  placements: ['/placements', '/placement'],
}

/**
 * Check if a navigation item's href matches a disabled feature
 */
function isFeatureDisabled(href: string): boolean {
  // Check each feature flag
  for (const [feature, patterns] of Object.entries(FEATURE_URL_PATTERNS)) {
    const featureFlag = feature as FeatureFlag

    // If this feature is disabled
    if (!hasFeature(featureFlag)) {
      // Check if the href matches any of this feature's patterns
      const matchesPattern = patterns?.some(pattern =>
        href.toLowerCase().includes(pattern.toLowerCase())
      )

      if (matchesPattern) {
        return true
      }
    }
  }

  return false
}

/**
 * Filter a navigation item and its children based on feature flags
 */
function filterNavItem(item: NavItem): NavItem | null {
  // Check if this item's href is disabled
  if (item.href && isFeatureDisabled(item.href)) {
    return null
  }

  // If item has children, filter them recursively
  if (item.children && item.children.length > 0) {
    const filteredChildren = item.children
      .map(child => filterNavItem(child))
      .filter((child): child is NavItem => child !== null)

    // If all children were filtered out, hide the parent too
    if (filteredChildren.length === 0 && item.children.length > 0) {
      return null
    }

    // Return item with filtered children
    return {
      ...item,
      children: filteredChildren
    }
  }

  // Item passed all checks
  return item
}

/**
 * Filter navigation items based on enabled feature flags
 *
 * This function removes navigation items whose features are disabled
 * in the NEXT_PUBLIC_FEATURES environment variable.
 *
 * @param navigation - Array of navigation items from CMS
 * @returns Filtered navigation array with only enabled features
 *
 * @example
 * ```typescript
 * // If NEXT_PUBLIC_FEATURES="blog,events"
 * // Then careers navigation will be filtered out
 * const filtered = filterNavigationByFeatures(rawNavigation)
 * ```
 */
export function filterNavigationByFeatures(
  navigation: NavItem[]
): NavItem[] {
  return navigation
    .map(item => filterNavItem(item))
    .filter((item): item is NavItem => item !== null)
}

/**
 * Check if a specific URL path is accessible based on feature flags
 * Useful for route protection in middleware
 */
export function isPathAccessible(path: string): boolean {
  return !isFeatureDisabled(path)
}
