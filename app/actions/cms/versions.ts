'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/utils/activity-logger'
import { checkPermission } from '../permissions'

// Type definitions
export type FormState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: unknown
}

export interface PageVersion {
  id: string
  page_id: string
  version_number: number
  title: string
  slug: string
  description: string | null
  blocks_snapshot: unknown[]
  seo_snapshot: Record<string, unknown> | null
  fab_snapshot: Record<string, unknown> | null
  change_summary: string | null
  is_auto_save: boolean
  is_published_version: boolean
  created_by: string
  created_at: string | null
  creator?: {
    full_name: string | null
    email: string
  } | null
}

/**
 * Get all versions for a page
 */
export async function getPageVersions(pageId: string): Promise<PageVersion[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_versions')
    .select(`
      *,
      creator:profiles!cms_page_versions_created_by_fkey (
        full_name,
        email
      )
    `)
    .eq('page_id', pageId)
    .order('version_number', { ascending: false })

  if (error) {
    console.error('Error fetching page versions:', error)
    return []
  }

  return (data as unknown as PageVersion[]) || []
}

/**
 * Get a specific version by ID
 */
export async function getVersionById(versionId: string): Promise<PageVersion | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('cms_page_versions')
    .select(`
      *,
      creator:profiles!cms_page_versions_created_by_fkey (
        full_name,
        email
      )
    `)
    .eq('id', versionId)
    .single()

  if (error) {
    console.error('Error fetching version:', error)
    return null
  }

  return data as unknown as PageVersion
}

/**
 * Create a new version (snapshot) of a page
 */
export async function createPageVersion(
  pageId: string,
  changeSummary?: string,
  isAutoSave: boolean = false
): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to create versions' }
  }

  // Get current page data
  const { data: page, error: pageError } = await supabase
    .from('cms_pages')
    .select(`
      id,
      title,
      slug,
      description,
      status
    `)
    .eq('id', pageId)
    .single()

  if (pageError || !page) {
    return { success: false, message: 'Page not found' }
  }

  // Get current blocks
  const { data: blocks } = await supabase
    .from('cms_page_blocks')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: true })

  // Get SEO metadata
  const { data: seo } = await supabase
    .from('cms_seo_metadata')
    .select('*')
    .eq('page_id', pageId)
    .single()

  // Get FAB config
  const { data: fab } = await supabase
    .from('cms_page_fab_config')
    .select('*')
    .eq('page_id', pageId)
    .single()

  // Get the next version number
  const { data: latestVersion } = await supabase
    .from('cms_page_versions')
    .select('version_number')
    .eq('page_id', pageId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single()

  const nextVersionNumber = (latestVersion?.version_number || 0) + 1

  // Create the version
  const { error: versionError } = await supabase
    .from('cms_page_versions')
    .insert({
      page_id: pageId,
      version_number: nextVersionNumber,
      title: page.title,
      slug: page.slug,
      description: page.description,
      blocks_snapshot: blocks || [],
      seo_snapshot: seo || {},
      fab_snapshot: fab || {},
      change_summary: changeSummary || null,
      is_auto_save: isAutoSave,
      is_published_version: page.status === 'published',
      created_by: user.id,
    })

  if (versionError) {
    console.error('Error creating version:', versionError)
    return { success: false, message: 'Failed to create version' }
  }

  // Log activity
  if (!isAutoSave) {
    await logActivity({
      userId: user.id,
      action: 'create_version',
      module: 'cms',
      resourceType: 'page_version',
      resourceId: pageId,
      metadata: { version_number: nextVersionNumber, change_summary: changeSummary },
    })
  }

  revalidatePath(`/admin/content/pages/${pageId}`)

  return {
    success: true,
    message: `Version ${nextVersionNumber} created successfully`,
    data: { version_number: nextVersionNumber },
  }
}

/**
 * Restore a page to a specific version
 */
export async function restoreVersion(versionId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to restore versions' }
  }

  // Get the version to restore
  const { data: version, error: versionError } = await supabase
    .from('cms_page_versions')
    .select('*')
    .eq('id', versionId)
    .single()

  if (versionError || !version) {
    return { success: false, message: 'Version not found' }
  }

  // First, create a backup version of the current state
  await createPageVersion(version.page_id, `Auto-backup before restoring to version ${version.version_number}`, true)

  // Update page details
  const { error: pageError } = await supabase
    .from('cms_pages')
    .update({
      title: version.title,
      slug: version.slug,
      description: version.description,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', version.page_id)

  if (pageError) {
    console.error('Error updating page:', pageError)
    return { success: false, message: 'Failed to restore page details' }
  }

  // Delete current blocks
  await supabase
    .from('cms_page_blocks')
    .delete()
    .eq('page_id', version.page_id)

  // Restore blocks from snapshot
  const blocksSnapshot = version.blocks_snapshot as Array<Record<string, unknown>>
  if (blocksSnapshot && blocksSnapshot.length > 0) {
    const blocksToInsert = blocksSnapshot.map((block) => ({
      ...block,
      id: undefined, // Let DB generate new IDs
      page_id: version.page_id,
    }))

    const { error: blocksError } = await supabase
      .from('cms_page_blocks')
      .insert(blocksToInsert)

    if (blocksError) {
      console.error('Error restoring blocks:', blocksError)
      return { success: false, message: 'Failed to restore page blocks' }
    }
  }

  // Restore SEO metadata
  const seoSnapshot = version.seo_snapshot as Record<string, unknown> | null
  if (seoSnapshot && Object.keys(seoSnapshot).length > 0) {
    await supabase
      .from('cms_seo_metadata')
      .upsert({
        ...seoSnapshot,
        page_id: version.page_id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page_id' })
  }

  // Restore FAB config
  const fabSnapshot = version.fab_snapshot as Record<string, unknown> | null
  if (fabSnapshot && Object.keys(fabSnapshot).length > 0) {
    await supabase
      .from('cms_page_fab_config')
      .upsert({
        ...fabSnapshot,
        page_id: version.page_id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page_id' })
  }

  // Log activity
  await logActivity({
    userId: user.id,
    action: 'restore_version',
    module: 'cms',
    resourceType: 'page',
    resourceId: version.page_id,
    metadata: { restored_version_number: version.version_number },
  })

  revalidatePath(`/admin/content/pages/${version.page_id}`)

  return {
    success: true,
    message: `Page restored to version ${version.version_number}`,
    data: { version_number: version.version_number },
  }
}

/**
 * Delete a version (only auto-saves can be deleted)
 */
export async function deleteVersion(versionId: string): Promise<FormState> {
  const supabase = await createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  // Check permission
  const hasPermission = await checkPermission(user.id, 'cms:pages:edit')
  if (!hasPermission) {
    return { success: false, message: 'You do not have permission to delete versions' }
  }

  // Get the version
  const { data: version, error: fetchError } = await supabase
    .from('cms_page_versions')
    .select('*')
    .eq('id', versionId)
    .single()

  if (fetchError || !version) {
    return { success: false, message: 'Version not found' }
  }

  // Only allow deleting auto-saves
  if (!version.is_auto_save) {
    return { success: false, message: 'Only auto-save versions can be deleted' }
  }

  // Delete the version
  const { error } = await supabase
    .from('cms_page_versions')
    .delete()
    .eq('id', versionId)

  if (error) {
    console.error('Error deleting version:', error)
    return { success: false, message: 'Failed to delete version' }
  }

  revalidatePath(`/admin/content/pages/${version.page_id}`)

  return { success: true, message: 'Version deleted successfully' }
}

/**
 * Compare two versions and return the differences
 */
export async function compareVersions(
  versionId1: string,
  versionId2: string
): Promise<{
  version1: PageVersion | null
  version2: PageVersion | null
  differences: {
    title: boolean
    slug: boolean
    description: boolean
    blocksCount: { v1: number; v2: number }
    seoChanged: boolean
    fabChanged: boolean
  }
}> {
  const [version1, version2] = await Promise.all([
    getVersionById(versionId1),
    getVersionById(versionId2),
  ])

  if (!version1 || !version2) {
    return {
      version1: null,
      version2: null,
      differences: {
        title: false,
        slug: false,
        description: false,
        blocksCount: { v1: 0, v2: 0 },
        seoChanged: false,
        fabChanged: false,
      },
    }
  }

  const v1Blocks = version1.blocks_snapshot as unknown[]
  const v2Blocks = version2.blocks_snapshot as unknown[]

  return {
    version1,
    version2,
    differences: {
      title: version1.title !== version2.title,
      slug: version1.slug !== version2.slug,
      description: version1.description !== version2.description,
      blocksCount: {
        v1: v1Blocks?.length || 0,
        v2: v2Blocks?.length || 0,
      },
      seoChanged: JSON.stringify(version1.seo_snapshot) !== JSON.stringify(version2.seo_snapshot),
      fabChanged: JSON.stringify(version1.fab_snapshot) !== JSON.stringify(version2.fab_snapshot),
    },
  }
}

/**
 * Get version count for a page
 */
export async function getVersionCount(pageId: string): Promise<number> {
  const supabase = await createServerSupabaseClient()

  const { count, error } = await supabase
    .from('cms_page_versions')
    .select('*', { count: 'exact', head: true })
    .eq('page_id', pageId)

  if (error) {
    console.error('Error counting versions:', error)
    return 0
  }

  return count || 0
}
