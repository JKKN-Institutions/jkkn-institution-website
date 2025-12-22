import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Extract last segment from slug path
 * @example "facilities/seminar-hall" => "seminar-hall"
 * @example "seminar-hall" => "seminar-hall"
 */
export function extractSlugSegment(slug: string): string {
  if (!slug) return slug
  const segments = slug.split('/')
  return segments[segments.length - 1] || slug
}

/**
 * Recursively builds hierarchical slug by traversing parent_id chain
 * Used during migration and slug preview
 *
 * @param pageId - The page ID to build the slug for
 * @param supabase - Supabase client instance
 * @returns Full hierarchical slug path
 */
export async function buildSlugPath(
  pageId: string,
  supabase: SupabaseClient
): Promise<string> {
  const { data, error } = await supabase
    .from('cms_pages')
    .select('slug, parent_id')
    .eq('id', pageId)
    .single()

  if (error || !data) {
    throw new Error(`Page not found: ${pageId}`)
  }

  // Root page: return segment only
  if (!data.parent_id) {
    return extractSlugSegment(data.slug)
  }

  // Child page: prepend parent path
  const parentPath = await buildSlugPath(data.parent_id, supabase)
  return `${parentPath}/${extractSlugSegment(data.slug)}`
}

/**
 * Recursively updates all descendants when parent slug changes
 * Critical for maintaining URL consistency
 *
 * @param pageId - The parent page ID whose children need updating
 * @param newSlug - The new slug of the parent page
 * @param supabase - Supabase client instance
 */
export async function updateChildSlugs(
  pageId: string,
  newSlug: string,
  supabase: SupabaseClient
): Promise<void> {
  // Get direct children
  const { data: children, error } = await supabase
    .from('cms_pages')
    .select('id, slug')
    .eq('parent_id', pageId)

  if (error) {
    console.error('Error fetching children:', error)
    throw new Error(`Failed to fetch children for page: ${pageId}`)
  }

  if (!children || children.length === 0) {
    return
  }

  // Update each child
  for (const child of children) {
    const childSegment = extractSlugSegment(child.slug)
    const newChildSlug = `${newSlug}/${childSegment}`

    const { error: updateError } = await supabase
      .from('cms_pages')
      .update({
        slug: newChildSlug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', child.id)

    if (updateError) {
      console.error(`Error updating child ${child.id}:`, updateError)
      throw new Error(`Failed to update child page: ${child.id}`)
    }

    // Recursively update grandchildren
    await updateChildSlugs(child.id, newChildSlug, supabase)
  }
}

/**
 * Returns all descendant page IDs recursively
 *
 * @param pageId - The parent page ID
 * @param supabase - Supabase client instance
 * @returns Array of descendant page IDs
 */
export async function getPageChildren(
  pageId: string,
  supabase: SupabaseClient
): Promise<string[]> {
  const { data: children, error } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('parent_id', pageId)

  if (error) {
    console.error('Error fetching children:', error)
    return []
  }

  if (!children || children.length === 0) {
    return []
  }

  const allChildren: string[] = []

  for (const child of children) {
    allChildren.push(child.id)
    const descendants = await getPageChildren(child.id, supabase)
    allChildren.push(...descendants)
  }

  return allChildren
}

/**
 * Prevents setting a page's parent to itself or its descendant
 *
 * @param pageId - The page ID being updated
 * @param newParentId - The proposed new parent ID
 * @param supabase - Supabase client instance
 * @returns Validation result with error message if invalid
 */
export async function preventCircularParent(
  pageId: string,
  newParentId: string | null,
  supabase: SupabaseClient
): Promise<{ valid: boolean; error?: string }> {
  if (!newParentId) {
    return { valid: true }
  }

  // Can't set self as parent
  if (pageId === newParentId) {
    return { valid: false, error: 'A page cannot be its own parent' }
  }

  // Can't set descendant as parent (prevents circular references)
  const descendants = await getPageChildren(pageId, supabase)
  if (descendants.includes(newParentId)) {
    return {
      valid: false,
      error: 'Cannot set a descendant page as parent (circular reference)',
    }
  }

  return { valid: true }
}

/**
 * Validates slug matches parent structure and has no conflicts
 *
 * @param slug - The proposed slug
 * @param parentId - The parent page ID (null for root pages)
 * @param excludePageId - Page ID to exclude from uniqueness check (for updates)
 * @param supabase - Supabase client instance
 * @returns Validation result with error message if invalid
 */
export async function validateSlugHierarchy(
  slug: string,
  parentId: string | null,
  excludePageId: string | null,
  supabase: SupabaseClient
): Promise<{ valid: boolean; error?: string }> {
  // Rule 1: Root pages can't have slashes
  if (!parentId && slug.includes('/')) {
    return { valid: false, error: 'Root pages cannot have nested slugs (no "/" allowed)' }
  }

  // Rule 2: Child slugs must start with parent path
  if (parentId) {
    const { data: parent, error } = await supabase
      .from('cms_pages')
      .select('slug')
      .eq('id', parentId)
      .single()

    if (error || !parent) {
      return { valid: false, error: 'Parent page not found' }
    }

    if (!slug.startsWith(`${parent.slug}/`)) {
      return {
        valid: false,
        error: `Child slug must start with "${parent.slug}/"`,
      }
    }
  }

  // Rule 3: Global uniqueness
  let query = supabase.from('cms_pages').select('id').eq('slug', slug)

  if (excludePageId) {
    query = query.neq('id', excludePageId)
  }

  const { data: existing } = await query.maybeSingle()

  if (existing) {
    return { valid: false, error: 'A page with this slug already exists' }
  }

  // Rule 4: Sibling uniqueness (same segment under same parent)
  const segment = extractSlugSegment(slug)
  const { data: siblings } = await supabase
    .from('cms_pages')
    .select('id, slug')
    .eq('parent_id', parentId)

  if (siblings) {
    for (const sibling of siblings) {
      // Skip the page being updated
      if (excludePageId && sibling.id === excludePageId) {
        continue
      }

      if (extractSlugSegment(sibling.slug) === segment) {
        return {
          valid: false,
          error: 'A sibling page with this slug segment already exists',
        }
      }
    }
  }

  return { valid: true }
}

/**
 * Validates that nesting depth doesn't exceed the maximum allowed
 *
 * @param slug - The proposed slug
 * @param maxDepth - Maximum allowed nesting depth (default: 5)
 * @returns Validation result with error message if invalid
 */
export function validateSlugDepth(
  slug: string,
  maxDepth: number = 5
): { valid: boolean; error?: string } {
  const depth = slug.split('/').length

  if (depth > maxDepth) {
    return {
      valid: false,
      error: `Slug nesting depth (${depth}) exceeds maximum allowed (${maxDepth})`,
    }
  }

  return { valid: true }
}

/**
 * Validates that a homepage must be a root-level page
 *
 * @param isHomepage - Whether the page is marked as homepage
 * @param parentId - The parent page ID
 * @returns Validation result with error message if invalid
 */
export function validateHomepageParent(
  isHomepage: boolean,
  parentId: string | null
): { valid: boolean; error?: string } {
  if (isHomepage && parentId) {
    return {
      valid: false,
      error: 'Homepage must be a root-level page (cannot have a parent)',
    }
  }

  return { valid: true }
}
