import { createServerSupabaseClient } from '@/lib/supabase/server'

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'announcement'

export interface NotificationPayload {
  userId: string
  title: string
  message: string
  type: NotificationType
  link?: string
  metadata?: Record<string, unknown>
}

export interface BulkNotificationPayload {
  userIds: string[]
  title: string
  message: string
  type: NotificationType
  link?: string
  metadata?: Record<string, unknown>
}

/**
 * Send a notification to a single user
 */
export async function sendNotification({
  userId,
  title,
  message,
  type = 'info',
  link,
  metadata,
}: NotificationPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('in_app_notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link,
        metadata,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to send notification:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (error) {
    console.error('Failed to send notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send notifications to multiple users at once
 */
export async function sendBulkNotifications({
  userIds,
  title,
  message,
  type = 'info',
  link,
  metadata,
}: BulkNotificationPayload): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    const now = new Date().toISOString()

    const notifications = userIds.map((userId) => ({
      user_id: userId,
      title,
      message,
      type,
      link,
      metadata,
      is_read: false,
      created_at: now,
    }))

    const { data, error } = await supabase
      .from('in_app_notifications')
      .insert(notifications)
      .select('id')

    if (error) {
      console.error('Failed to send bulk notifications:', error)
      return { success: false, error: error.message }
    }

    return { success: true, count: data?.length || 0 }
  } catch (error) {
    console.error('Failed to send bulk notifications:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send notification to all users with a specific role
 * Uses the user_roles junction table to find users by role name
 */
export async function sendNotificationToRole({
  role,
  title,
  message,
  type = 'info',
  link,
  metadata,
}: Omit<NotificationPayload, 'userId'> & { role: string }): Promise<{
  success: boolean
  count?: number
  error?: string
}> {
  try {
    const supabase = await createServerSupabaseClient()

    // First, get the role ID from the roles table
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role)
      .single()

    if (roleError || !roleData) {
      console.error('Failed to find role:', role, roleError)
      return { success: false, error: `Role "${role}" not found` }
    }

    // Get all users with the specified role from user_roles junction table
    const { data: userRoles, error: usersError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role_id', roleData.id)

    if (usersError) {
      console.error('Failed to fetch users by role:', usersError)
      return { success: false, error: usersError.message }
    }

    if (!userRoles || userRoles.length === 0) {
      return { success: true, count: 0 }
    }

    const userIds = userRoles.map((ur) => ur.user_id)
    return sendBulkNotifications({ userIds, title, message, type, link, metadata })
  } catch (error) {
    console.error('Failed to send notification to role:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Pre-defined notification helpers for common scenarios
export const NotificationHelpers = {
  // Welcome notification for new users
  welcomeUser: (userId: string, userName: string) =>
    sendNotification({
      userId,
      title: 'Welcome to JKKN!',
      message: `Hello ${userName}, welcome to the JKKN Institution portal. We're excited to have you here!`,
      type: 'success',
      link: '/admin',
    }),

  // Role change notification
  roleChanged: (userId: string, newRole: string) =>
    sendNotification({
      userId,
      title: 'Your Role Has Been Updated',
      message: `Your account role has been updated to ${newRole}. You may now have access to new features.`,
      type: 'info',
      link: '/admin',
    }),

  // Content published notification
  contentPublished: (userId: string, pageTitle: string, pageSlug: string) =>
    sendNotification({
      userId,
      title: 'Content Published',
      message: `Your page "${pageTitle}" has been published and is now live.`,
      type: 'success',
      link: `/${pageSlug}`,
    }),

  // Content requires review notification
  contentNeedsReview: (reviewerUserId: string, pageTitle: string, pageId: string) =>
    sendNotification({
      userId: reviewerUserId,
      title: 'Content Pending Review',
      message: `A new page "${pageTitle}" has been submitted for your review.`,
      type: 'info',
      link: `/admin/content/pages/${pageId}`,
    }),

  // System maintenance notification
  systemMaintenance: (userIds: string[], scheduledTime: string) =>
    sendBulkNotifications({
      userIds,
      title: 'Scheduled Maintenance',
      message: `The system will undergo maintenance on ${scheduledTime}. Please save your work before this time.`,
      type: 'warning',
    }),

  // Announcement to all admins
  announcementToAdmins: (title: string, message: string, link?: string) =>
    sendNotificationToRole({
      role: 'super_admin',
      title,
      message,
      type: 'announcement',
      link,
    }),
}
