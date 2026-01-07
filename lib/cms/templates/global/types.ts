import { z } from 'zod'

/**
 * Template categories supported by the CMS
 */
export type TemplateCategory =
  | 'general'
  | 'landing'
  | 'content'
  | 'blog'
  | 'portfolio'
  | 'ecommerce'

/**
 * Template source identifier
 * - 'global': Stored in codebase, shared across all institutions
 * - 'local': Stored in institution's database, institution-specific
 */
export type TemplateSource = 'global' | 'local'

/**
 * Block data structure for CMS components
 */
export interface BlockData {
  id: string
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  parent_block_id: string | null
  is_visible: boolean
  responsive_settings?: Record<string, unknown>
  custom_css?: string
  custom_classes?: string
}

/**
 * Base template structure matching database schema
 */
export interface BaseTemplate {
  id: string
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  default_blocks: BlockData[]
  is_system: boolean
  category: TemplateCategory
  created_at: string
  updated_at: string
  created_by: string | null
}

/**
 * Global template stored in codebase
 * Available to all institutions via git deployment
 */
export interface GlobalTemplate extends Omit<BaseTemplate, 'created_by' | 'created_at' | 'updated_at'> {
  /**
   * Source identifier (always 'global' for global templates)
   */
  source: 'global'

  /**
   * Version number for tracking changes
   * Format: YYYY-MM-DD (date of last update)
   */
  version: string

  /**
   * Institution that created this global template
   */
  origin_institution: 'main'

  /**
   * Timestamp when template was last modified
   */
  last_updated: string

  /**
   * Author/creator information
   */
  author?: {
    name: string
    email?: string
  }

  /**
   * Tags for categorization and search
   */
  tags?: string[]

  /**
   * Usage instructions or notes for template users
   */
  usage_notes?: string
}

/**
 * Unified template type that can be either global or local
 * This is what the UI and Server Actions work with
 */
export type UnifiedTemplate = (BaseTemplate & {
  source: 'local'
  creator?: {
    full_name: string | null
    email: string
  } | null
}) | GlobalTemplate

/**
 * Validation schema for global template metadata
 */
export const GlobalTemplateMetadataSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100),
  slug: z
    .string()
    .min(1, 'Template slug is required')
    .max(100)
    .regex(/^global-[a-z0-9-]+$/, 'Global template slug must start with "global-" and contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  category: z.enum(['general', 'landing', 'content', 'blog', 'portfolio', 'ecommerce']),
  is_system: z.boolean().default(false),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Version must be in YYYY-MM-DD format'),
  author: z.object({
    name: z.string(),
    email: z.string().email().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  usage_notes: z.string().optional(),
})

/**
 * Validation schema for block data
 */
export const BlockDataSchema = z.object({
  id: z.string().uuid(),
  component_name: z.string().min(1, 'Component name is required'),
  props: z.record(z.string(), z.unknown()),
  sort_order: z.number().int().min(0),
  parent_block_id: z.string().uuid().nullable(),
  is_visible: z.boolean().default(true),
  responsive_settings: z.record(z.string(), z.unknown()).optional(),
  custom_css: z.string().optional(),
  custom_classes: z.string().optional(),
})

/**
 * Full validation schema for global templates
 */
export const GlobalTemplateSchema = GlobalTemplateMetadataSchema.extend({
  id: z.string().uuid(),
  default_blocks: z.array(BlockDataSchema),
  source: z.literal('global'),
  origin_institution: z.literal('main'),
  last_updated: z.string().datetime(),
})

/**
 * Type guard to check if a template is global
 */
export function isGlobalTemplate(template: UnifiedTemplate): template is GlobalTemplate {
  return template.source === 'global'
}

/**
 * Type guard to check if a template is local
 */
export function isLocalTemplate(template: UnifiedTemplate): template is BaseTemplate & { source: 'local' } {
  return template.source === 'local'
}

/**
 * Utility to convert database template to local template format
 */
export function toLocalTemplate(dbTemplate: BaseTemplate): UnifiedTemplate {
  return {
    ...dbTemplate,
    source: 'local' as const,
  }
}

/**
 * Utility to generate global template slug from name
 * Ensures all global templates are prefixed with 'global-'
 */
export function generateGlobalSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return baseSlug.startsWith('global-') ? baseSlug : `global-${baseSlug}`
}

/**
 * Utility to generate current version string (YYYY-MM-DD)
 */
export function getCurrentVersion(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Utility to sanitize template name for filesystem
 * Removes special characters and limits length
 */
export function sanitizeTemplateName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 100)
}
