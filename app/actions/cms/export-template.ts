'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { checkPermission } from '../permissions'
import { logActivity } from '@/lib/utils/activity-logger'
import { generateGlobalSlug, getCurrentVersion, sanitizeTemplateName } from '@/lib/cms/templates/global/types'
import type { Template } from './templates'
import type { GlobalTemplate } from '@/lib/cms/templates/global/types'

export type PromoteFormState = {
  success?: boolean
  message?: string
  filePath?: string
  instructions?: string[]
}

/**
 * Promote a local template to global status
 * Only available to Main institution super_admins
 */
export async function promoteToGlobalTemplate(templateId: string): Promise<PromoteFormState> {
  const supabase = await createServerSupabaseClient()

  // 1. Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  // 2. Verify this is Main institution
  const institutionId = process.env.NEXT_PUBLIC_INSTITUTION_ID
  if (institutionId !== 'main') {
    return {
      success: false,
      message: 'Global template promotion is only available to Main institution administrators',
    }
  }

  // 3. Check permission: must have cms:templates:export
  const hasExportPermission = await checkPermission(user.id, 'cms:templates:export')
  if (!hasExportPermission) {
    return {
      success: false,
      message: 'You do not have permission to promote templates to global status. This requires super_admin role.',
    }
  }

  // 4. Verify user is super_admin (double-check for security)
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('roles(slug)')
    .eq('user_id', user.id)

  const isSuperAdmin = userRoles?.some((ur: any) => ur.roles?.slug === 'super_admin')
  if (!isSuperAdmin) {
    return {
      success: false,
      message: 'Only super administrators can promote templates to global status',
    }
  }

  // 5. Get template from database
  const { data: template, error: templateError } = await supabase
    .from('cms_page_templates')
    .select('*')
    .eq('id', templateId)
    .single()

  if (templateError || !template) {
    return { success: false, message: 'Template not found' }
  }

  // 6. Validate template data
  if (!template.slug || !template.name) {
    return { success: false, message: 'Template is missing required fields (slug or name)' }
  }

  // 7. Generate global slug (ensure it starts with 'global-')
  const globalSlug = generateGlobalSlug(template.slug)

  // 8. Sanitize template name for filename
  const fileName = sanitizeTemplateName(template.name)

  // 9. Validate component names in blocks
  const blocks = template.default_blocks as any[]
  if (blocks && Array.isArray(blocks)) {
    for (const block of blocks) {
      if (!block.component_name || block.component_name.trim() === '') {
        return {
          success: false,
          message: 'Template contains blocks with invalid component names',
        }
      }
    }
  }

  // 10. Get user details for author info
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  // 11. Build GlobalTemplate object
  const globalTemplate: GlobalTemplate = {
    id: template.id,
    slug: globalSlug,
    name: template.name,
    description: template.description,
    thumbnail_url: template.thumbnail_url,
    default_blocks: blocks || [],
    is_system: false,
    category: template.category,
    source: 'global',
    version: getCurrentVersion(),
    origin_institution: 'main',
    last_updated: new Date().toISOString(),
    author: {
      name: profile?.full_name || 'JKKN Institutions',
      email: profile?.email,
    },
    tags: [], // Can be extended later
    usage_notes: template.description || undefined,
  }

  // 12. Generate TypeScript file content
  const fileContent = generateTemplateFileContent(globalTemplate)

  // 13. Determine file path
  const projectRoot = process.cwd()
  const templatesDir = join(projectRoot, 'lib', 'cms', 'templates', 'global', 'templates')
  const filePath = join(templatesDir, `${fileName}.ts`)

  // 14. Write file to filesystem
  try {
    await writeFile(filePath, fileContent, 'utf-8')
  } catch (error) {
    console.error('Error writing template file:', error)
    return {
      success: false,
      message: `Failed to write template file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }

  // 15. Log activity
  await logActivity({
    userId: user.id,
    action: 'create',
    module: 'cms',
    resourceType: 'global_template',
    resourceId: templateId,
    metadata: {
      name: template.name,
      slug: globalSlug,
      filePath,
      version: globalTemplate.version,
    },
  })

  // 16. Return success with git instructions
  const relativePath = `lib/cms/templates/global/templates/${fileName}.ts`

  return {
    success: true,
    message: `Template "${template.name}" promoted to global status successfully!`,
    filePath: relativePath,
    instructions: [
      'Your global template has been created.',
      'To make it available to all institutions, follow these steps:',
      '',
      '1. Review the generated file:',
      `   ${relativePath}`,
      '',
      '2. Commit the file to git:',
      `   git add ${relativePath}`,
      `   git commit -m "Add global template: ${template.name}"`,
      '',
      '3. Push to GitHub:',
      '   git push',
      '',
      '4. Wait for Vercel deployment (~2-5 minutes)',
      '',
      '5. The template will be available to all 6 institutions!',
    ],
  }
}

/**
 * Generate TypeScript file content for a global template
 */
function generateTemplateFileContent(template: GlobalTemplate): string {
  // Escape strings for TypeScript code
  const escapeString = (str: string | null | undefined): string => {
    if (!str) return 'null'
    return `'${str.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
  }

  // Format blocks as TypeScript code
  const formatBlocks = (blocks: any[]): string => {
    return JSON.stringify(blocks, null, 6)
      .split('\n')
      .map((line, idx) => (idx === 0 ? line : `    ${line}`))
      .join('\n')
  }

  // Format tags array
  const formatTags = (tags?: string[]): string => {
    if (!tags || tags.length === 0) return '[]'
    return `[${tags.map((t) => `'${t}'`).join(', ')}]`
  }

  return `import type { GlobalTemplate } from '../types'

/**
 * ${template.name}
 *
 * ${template.description || 'No description provided'}
 *
 * Usage: ${template.usage_notes || 'Use this template for creating pages'}
 */
const template: GlobalTemplate = {
  id: '${template.id}',
  slug: '${template.slug}',
  name: ${escapeString(template.name)},
  description: ${escapeString(template.description)},
  thumbnail_url: ${escapeString(template.thumbnail_url)},
  category: '${template.category}',
  is_system: ${template.is_system},
  source: 'global',
  version: '${template.version}',
  origin_institution: 'main',
  last_updated: '${template.last_updated}',
  author: {
    name: '${template.author?.name || 'JKKN Institutions'}',
    email: ${template.author?.email ? `'${template.author.email}'` : 'undefined'},
  },
  tags: ${formatTags(template.tags)},
  usage_notes: ${escapeString(template.usage_notes)},
  default_blocks: ${formatBlocks(template.default_blocks)},
}

export default template
`
}

/**
 * Update an existing global template
 * (Re-export with updated content)
 */
export async function updateGlobalTemplate(
  templateId: string,
  fileName: string
): Promise<PromoteFormState> {
  // Similar to promoteToGlobalTemplate but updates existing file
  // Implementation would be similar but checks if file exists first
  return {
    success: false,
    message: 'Update functionality not yet implemented. Delete the file and re-promote to update.',
  }
}

/**
 * Delete a global template file
 * (Requires manual file deletion + git commit)
 */
export async function deleteGlobalTemplate(fileName: string): Promise<PromoteFormState> {
  return {
    success: false,
    message: 'Global template deletion must be done manually via git. Delete the file and commit the change.',
  }
}
