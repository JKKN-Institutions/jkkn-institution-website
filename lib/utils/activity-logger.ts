import { createServerSupabaseClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'publish'
  | 'unpublish'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'unassign'

export type ActivityModule =
  | 'users'
  | 'roles'
  | 'cms'
  | 'pages'
  | 'media'
  | 'events'
  | 'announcements'
  | 'dashboard'
  | 'settings'
  | 'auth'

export interface ActivityLog {
  userId: string
  action: ActivityAction | string
  module: ActivityModule | string
  resourceType?: string
  resourceId?: string
  metadata?: Record<string, unknown>
  description?: string
}

async function getClientIP(): Promise<string | null> {
  const FALLBACK_IP = '0.0.0.0'
  const headersList = await headers()
  const forwardedFor = headersList.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  return headersList.get('x-real-ip') || FALLBACK_IP
}

export async function logActivity({
  userId,
  action,
  module,
  resourceType,
  resourceId,
  metadata = {},
}: ActivityLog): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient()
    const headersList = await headers()

    await supabase.from('user_activity_logs').insert({
      user_id: userId,
      action,
      module,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
      ip_address: await getClientIP(),
      user_agent: headersList.get('user-agent') || 'Unknown',
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    // Log error but don't throw to avoid breaking the main operation
    console.error('Failed to log activity:', error)
  }
}

// Pre-defined activity helpers for common operations
export const ActivityHelpers = {
  // User activities
  userLogin: (userId: string) =>
    logActivity({ userId, action: 'login', module: 'auth', description: 'User logged in' }),

  userLogout: (userId: string) =>
    logActivity({ userId, action: 'logout', module: 'auth', description: 'User logged out' }),

  // CMS activities
  pageCreated: (userId: string, pageId: string, pageTitle: string) =>
    logActivity({
      userId,
      action: 'create',
      module: 'cms',
      resourceType: 'page',
      resourceId: pageId,
      metadata: { title: pageTitle },
      description: `Created page: ${pageTitle}`,
    }),

  pageUpdated: (userId: string, pageId: string, pageTitle: string, changes?: Record<string, unknown>) =>
    logActivity({
      userId,
      action: 'update',
      module: 'cms',
      resourceType: 'page',
      resourceId: pageId,
      metadata: { title: pageTitle, changes },
      description: `Updated page: ${pageTitle}`,
    }),

  pagePublished: (userId: string, pageId: string, pageTitle: string) =>
    logActivity({
      userId,
      action: 'publish',
      module: 'cms',
      resourceType: 'page',
      resourceId: pageId,
      metadata: { title: pageTitle },
      description: `Published page: ${pageTitle}`,
    }),

  pageDeleted: (userId: string, pageId: string, pageTitle: string) =>
    logActivity({
      userId,
      action: 'delete',
      module: 'cms',
      resourceType: 'page',
      resourceId: pageId,
      metadata: { title: pageTitle },
      description: `Deleted page: ${pageTitle}`,
    }),

  // Media activities
  mediaUploaded: (userId: string, mediaId: string, fileName: string) =>
    logActivity({
      userId,
      action: 'create',
      module: 'media',
      resourceType: 'file',
      resourceId: mediaId,
      metadata: { fileName },
      description: `Uploaded file: ${fileName}`,
    }),

  // User management activities
  userCreated: (userId: string, newUserId: string, email: string) =>
    logActivity({
      userId,
      action: 'create',
      module: 'users',
      resourceType: 'user',
      resourceId: newUserId,
      metadata: { email },
      description: `Created user: ${email}`,
    }),

  userRoleChanged: (userId: string, targetUserId: string, oldRole: string, newRole: string) =>
    logActivity({
      userId,
      action: 'update',
      module: 'users',
      resourceType: 'user',
      resourceId: targetUserId,
      metadata: { oldRole, newRole },
      description: `Changed role from ${oldRole} to ${newRole}`,
    }),

  // Role activities
  roleCreated: (userId: string, roleId: string, roleName: string) =>
    logActivity({
      userId,
      action: 'create',
      module: 'roles',
      resourceType: 'role',
      resourceId: roleId,
      metadata: { name: roleName },
      description: `Created role: ${roleName}`,
    }),

  permissionsUpdated: (userId: string, roleId: string, roleName: string, permissionCount: number) =>
    logActivity({
      userId,
      action: 'update',
      module: 'roles',
      resourceType: 'role_permissions',
      resourceId: roleId,
      metadata: { name: roleName, permissionCount },
      description: `Updated permissions for role: ${roleName}`,
    }),
}
