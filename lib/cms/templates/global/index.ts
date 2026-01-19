import type { GlobalTemplate, UnifiedTemplate, TemplateCategory, TemplateSource } from './types'
import { isGlobalTemplate } from './types'

/**
 * In-memory cache for global templates
 * Cleared on deployment/server restart
 */
let globalTemplatesCache: GlobalTemplate[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

/**
 * Import all global templates dynamically
 * This function loads template files from the templates/ directory
 */
import aboutPage from './templates/about-page'
import contactPage from './templates/contact-page'
import homepageHero from './templates/homepage-hero'
import engineeringHome from './templates/engineering-home-template'

/**
 * Import all global templates dynamically
 * This function loads template files from the templates/ directory
 */
async function loadGlobalTemplatesFromFilesystem(): Promise<GlobalTemplate[]> {
  // Check cache first
  const now = Date.now()
  if (globalTemplatesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return globalTemplatesCache
  }

  try {
    const templates: GlobalTemplate[] = []
    const rawTemplates = [aboutPage, contactPage, homepageHero, engineeringHome]

    for (const template of rawTemplates) {
      try {
        // Validate template has required fields
        if (!template || !template.id || !template.slug || !template.name) {
          console.warn(`[Global Templates] Invalid template: missing required fields`)
          continue
        }

        // Ensure source is 'global'
        const globalTemplate = { ...template } as GlobalTemplate
        globalTemplate.source = 'global'

        templates.push(globalTemplate)
      } catch (error) {
        console.error(`[Global Templates] Error loading template:`, error)
      }
    }

    // Update cache
    globalTemplatesCache = templates
    cacheTimestamp = now

    console.log(`[Global Templates] Loaded ${templates.length} global templates`)
    return templates
  } catch (error) {
    console.error('[Global Templates] Failed to load global templates:', error)
    return []
  }
}

/**
 * Get all global templates
 * Returns cached templates if available, otherwise loads from filesystem
 */
export async function getGlobalTemplates(options?: {
  category?: TemplateCategory
  search?: string
}): Promise<GlobalTemplate[]> {
  let templates = await loadGlobalTemplatesFromFilesystem()

  // Apply category filter
  if (options?.category) {
    templates = templates.filter((t) => t.category === options.category)
  }

  // Apply search filter
  if (options?.search) {
    const searchLower = options.search.toLowerCase()
    templates = templates.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.slug.toLowerCase().includes(searchLower) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  }

  return templates
}

/**
 * Get a specific global template by ID
 */
export async function getGlobalTemplateById(id: string): Promise<GlobalTemplate | null> {
  const templates = await getGlobalTemplates()
  return templates.find((t) => t.id === id) || null
}

/**
 * Get a specific global template by slug
 */
export async function getGlobalTemplateBySlug(slug: string): Promise<GlobalTemplate | null> {
  const templates = await getGlobalTemplates()
  return templates.find((t) => t.slug === slug) || null
}

/**
 * Merge global templates with local templates
 * Global templates are placed first, followed by local templates
 *
 * @param localTemplates - Templates from the database
 * @param includeGlobal - Whether to include global templates (default: true)
 * @returns Merged array of unified templates
 */
export async function mergeTemplates<T extends { source?: TemplateSource }>(
  localTemplates: T[],
  includeGlobal: boolean = true
): Promise<UnifiedTemplate[]> {
  // Add source field to local templates if not present
  const localWithSource = localTemplates.map((t) => ({
    ...t,
    source: (t.source || 'local') as TemplateSource,
  })) as unknown as UnifiedTemplate[]

  if (!includeGlobal) {
    return localWithSource
  }

  try {
    const globalTemplates = await getGlobalTemplates()

    // Merge: global templates first, then local templates
    return [...globalTemplates, ...localWithSource]
  } catch (error) {
    console.error('[Global Templates] Error merging templates:', error)
    // Return local templates only if global templates fail to load
    return localWithSource
  }
}

/**
 * Filter templates by source
 */
export function filterTemplatesBySource(
  templates: UnifiedTemplate[],
  source: TemplateSource
): UnifiedTemplate[] {
  return templates.filter((t) => t.source === source)
}

/**
 * Get template count by source
 */
export function getTemplateCountBySource(templates: UnifiedTemplate[]): {
  global: number
  local: number
  total: number
} {
  const global = templates.filter((t) => t.source === 'global').length
  const local = templates.filter((t) => t.source === 'local').length

  return {
    global,
    local,
    total: global + local,
  }
}

/**
 * Validate that all components in a template exist in the registry
 * Returns array of missing component names, or empty array if all valid
 */
export function validateTemplateComponents(template: GlobalTemplate | UnifiedTemplate): string[] {
  const missingComponents: string[] = []

  for (const block of template.default_blocks) {
    // Note: Component registry validation should be done where registry is accessible
    // This is a placeholder that will be enhanced with actual registry checks
    if (!block.component_name || block.component_name.trim() === '') {
      missingComponents.push('(unnamed component)')
    }
  }

  return missingComponents
}

/**
 * Clear the global templates cache
 * Useful for development and testing
 */
export function clearGlobalTemplatesCache(): void {
  globalTemplatesCache = null
  cacheTimestamp = 0
  console.log('[Global Templates] Cache cleared')
}

/**
 * Check if global templates are available
 * Useful for feature flagging
 */
export async function hasGlobalTemplates(): Promise<boolean> {
  const templates = await getGlobalTemplates()
  return templates.length > 0
}

/**
 * Get global templates grouped by category
 */
export async function getGlobalTemplatesByCategory(): Promise<
  Record<TemplateCategory, GlobalTemplate[]>
> {
  const templates = await getGlobalTemplates()

  const grouped: Record<string, GlobalTemplate[]> = {
    general: [],
    landing: [],
    content: [],
    blog: [],
    portfolio: [],
    ecommerce: [],
  }

  for (const template of templates) {
    if (template.category && grouped[template.category]) {
      grouped[template.category].push(template)
    } else {
      grouped.general.push(template)
    }
  }

  return grouped as Record<TemplateCategory, GlobalTemplate[]>
}

/**
 * Search global templates with advanced filters
 */
export async function searchGlobalTemplates(filters: {
  query?: string
  category?: TemplateCategory
  tags?: string[]
  systemOnly?: boolean
}): Promise<GlobalTemplate[]> {
  let templates = await getGlobalTemplates()

  // Apply query filter
  if (filters.query) {
    templates = await getGlobalTemplates({ search: filters.query })
  }

  // Apply category filter
  if (filters.category) {
    templates = templates.filter((t) => t.category === filters.category)
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    templates = templates.filter((t) =>
      filters.tags!.some((tag) => t.tags?.includes(tag))
    )
  }

  // Apply system filter
  if (filters.systemOnly !== undefined) {
    templates = templates.filter((t) => t.is_system === filters.systemOnly)
  }

  return templates
}

/**
 * Get most recently updated global templates
 */
export async function getRecentGlobalTemplates(limit: number = 5): Promise<GlobalTemplate[]> {
  const templates = await getGlobalTemplates()

  return templates
    .sort((a, b) => {
      const dateA = new Date(a.last_updated).getTime()
      const dateB = new Date(b.last_updated).getTime()
      return dateB - dateA // Descending order (newest first)
    })
    .slice(0, limit)
}
