'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

interface DashboardStats {
  totalPages: number
  totalPagesLastMonth: number
  totalUsers: number
  totalUsersLastMonth: number
  activeUsers: number
  activeUsersLastMonth: number
  pendingInquiries: number
  newInquiriesThisMonth: number
  newInquiriesLastMonth: number
}

interface DashboardStatsWithChanges {
  totalUsers: number
  activeUsers: number
  pendingInquiries: number
  totalPages: number
  totalUsersChange: number
  activeUsersChange: number
  pendingInquiriesChange: number
  totalPagesChange: number
}

/**
 * Fetches dashboard statistics using a database function that bypasses RLS.
 * This ensures accurate counts regardless of the user's permissions.
 */
export async function getDashboardStats(): Promise<DashboardStatsWithChanges> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.rpc('get_dashboard_stats')

  if (error) {
    console.error('Error fetching dashboard stats:', error)
    // Return zeros if there's an error
    return {
      totalUsers: 0,
      activeUsers: 0,
      pendingInquiries: 0,
      totalPages: 0,
      totalUsersChange: 0,
      activeUsersChange: 0,
      pendingInquiriesChange: 0,
      totalPagesChange: 0,
    }
  }

  const stats = data as DashboardStats

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  return {
    totalUsers: stats.totalUsers,
    activeUsers: stats.activeUsers,
    pendingInquiries: stats.pendingInquiries,
    totalPages: stats.totalPages,
    totalUsersChange: calculateChange(stats.totalUsers, stats.totalUsersLastMonth),
    activeUsersChange: calculateChange(stats.activeUsers, stats.activeUsersLastMonth),
    pendingInquiriesChange: calculateChange(stats.newInquiriesThisMonth, stats.newInquiriesLastMonth),
    totalPagesChange: calculateChange(stats.totalPages, stats.totalPagesLastMonth),
  }
}

/**
 * Fetches recent activity logs with user profile information.
 * Uses a database query that joins with profiles table.
 */
export async function getRecentActivityWithUsers(limit: number = 5) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('user_activity_logs')
    .select(`
      id,
      action,
      module,
      resource_type,
      created_at,
      user_id,
      metadata,
      profiles!user_id (
        full_name,
        email,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }

  return data
}
