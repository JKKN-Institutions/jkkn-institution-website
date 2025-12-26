'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { checkPermission } from './permissions'
import { logActivity } from '@/lib/utils/activity-logger'
import type {
  UserGrowthData,
  RoleDistributionData,
  ActivityHeatmapData,
  ContentStats,
  TopPageData,
  ActivityByModuleData,
  KPIData,
  RecentUser,
  TopContributor,
  DateRangeParams,
  ExportParams
} from '@/lib/analytics/types'

// ============================================
// Validation Schemas
// ============================================

const DateRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
  groupBy: z.enum(['day', 'week', 'month']).optional().default('day')
})

const AnalyticsExportSchema = z.object({
  type: z.enum(['csv', 'pdf']),
  section: z.enum(['overview', 'users', 'content', 'engagement']),
  dateRange: DateRangeSchema
})

// ============================================
// Permission Check Helper
// ============================================

async function requireAnalyticsPermission(userId: string): Promise<void> {
  const hasPermission = await checkPermission(userId, 'dashboard:analytics:view')
  if (!hasPermission) {
    throw new Error('Permission denied: dashboard:analytics:view required')
  }
}

// ============================================
// User Analytics Actions
// ============================================

/**
 * Get user growth data for line chart
 */
export async function getUserGrowthData(
  params: DateRangeParams
): Promise<UserGrowthData[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const validation = DateRangeSchema.parse(params)

  const { data, error } = await supabase.rpc('get_user_growth_data', {
    p_start_date: validation.from,
    p_end_date: validation.to,
    p_group_by: validation.groupBy
  })

  if (error) {
    console.error('getUserGrowthData error:', error)
    throw new Error('Failed to fetch user growth data')
  }

  return (data || []).map((row: {
    period_date: string
    new_users: number
    active_users: number
    cumulative_total: number
  }) => ({
    periodDate: row.period_date,
    newUsers: Number(row.new_users),
    activeUsers: Number(row.active_users),
    cumulativeTotal: Number(row.cumulative_total)
  }))
}

/**
 * Get role distribution for donut chart
 */
export async function getRoleDistribution(): Promise<RoleDistributionData[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const { data, error } = await supabase.rpc('get_role_distribution')

  if (error) {
    console.error('getRoleDistribution error:', error)
    throw new Error('Failed to fetch role distribution')
  }

  return (data || []).map((row: {
    role_id: string
    role_name: string
    display_name: string
    user_count: number
    percentage: number
  }) => ({
    roleId: row.role_id,
    roleName: row.role_name,
    displayName: row.display_name,
    userCount: Number(row.user_count),
    percentage: Number(row.percentage)
  }))
}

/**
 * Get recent users for table display
 */
export async function getRecentUsers(limit: number = 10): Promise<RecentUser[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      avatar_url,
      created_at,
      user_roles (
        roles (
          id,
          name,
          display_name
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getRecentUsers error:', error)
    throw new Error('Failed to fetch recent users')
  }

  return (data || []).map((row) => ({
    id: row.id,
    fullName: row.full_name || 'Unknown',
    email: row.email || '',
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    roles: (row.user_roles || []).map((ur) => {
      // Handle the roles relation (could be object or array depending on Supabase setup)
      const roleData = Array.isArray(ur.roles) ? ur.roles[0] : ur.roles
      return {
        id: roleData?.id || '',
        name: roleData?.name || '',
        displayName: roleData?.display_name || ''
      }
    }).filter((r) => r.id)
  }))
}

/**
 * Get top contributors by activity count
 */
export async function getTopContributors(
  params: DateRangeParams,
  limit: number = 10
): Promise<TopContributor[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const validation = DateRangeSchema.parse(params)

  // Get activity counts by user
  const { data: activityData, error: activityError } = await supabase
    .from('user_activity_logs')
    .select('user_id')
    .gte('created_at', validation.from)
    .lte('created_at', validation.to)

  if (activityError) {
    console.error('getTopContributors activity error:', activityError)
    throw new Error('Failed to fetch activity data')
  }

  // Aggregate counts
  const countMap = new Map<string, number>()
  ;(activityData || []).forEach((log) => {
    const current = countMap.get(log.user_id) || 0
    countMap.set(log.user_id, current + 1)
  })

  // Sort and get top users
  const topUserIds = [...countMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([userId]) => userId)

  if (topUserIds.length === 0) return []

  // Fetch user details
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .in('id', topUserIds)

  if (profileError) {
    console.error('getTopContributors profile error:', profileError)
    throw new Error('Failed to fetch user profiles')
  }

  // Combine with counts and maintain order
  return topUserIds.map((userId, index) => {
    const profile = profiles?.find((p) => p.id === userId)
    return {
      rank: index + 1,
      userId,
      fullName: profile?.full_name || 'Unknown',
      email: profile?.email || '',
      avatarUrl: profile?.avatar_url || null,
      activityCount: countMap.get(userId) || 0
    }
  })
}

// ============================================
// Content Analytics Actions
// ============================================

/**
 * Get content statistics
 */
export async function getContentStats(
  params?: DateRangeParams
): Promise<ContentStats> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const { data, error } = await supabase.rpc('get_content_stats', {
    p_start_date: params?.from || null,
    p_end_date: params?.to || null
  })

  if (error) {
    console.error('getContentStats error:', error)
    throw new Error('Failed to fetch content stats')
  }

  const row = data?.[0] || {}
  return {
    totalPages: Number(row.total_pages) || 0,
    publishedPages: Number(row.published_pages) || 0,
    draftPages: Number(row.draft_pages) || 0,
    archivedPages: Number(row.archived_pages) || 0,
    scheduledPages: Number(row.scheduled_pages) || 0,
    pagesCreatedInPeriod: Number(row.pages_created_in_period) || 0,
    pagesPublishedInPeriod: Number(row.pages_published_in_period) || 0
  }
}

/**
 * Get top pages by view count
 */
export async function getTopPages(limit: number = 10): Promise<TopPageData[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  // Get from blog_posts which has view_count
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, view_count, published_at')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getTopPages error:', error)
    throw new Error('Failed to fetch top pages')
  }

  return (data || []).map((row) => ({
    pageId: row.id,
    pageTitle: row.title,
    slug: row.slug,
    viewCount: Number(row.view_count) || 0,
    publishedAt: row.published_at
  }))
}

// ============================================
// Engagement Analytics Actions
// ============================================

/**
 * Get activity heatmap data
 */
export async function getActivityHeatmapData(
  params: DateRangeParams & { module?: string }
): Promise<ActivityHeatmapData[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const { data, error } = await supabase.rpc('get_activity_heatmap_data', {
    p_start_date: params.from,
    p_end_date: params.to,
    p_module: params.module || null
  })

  if (error) {
    console.error('getActivityHeatmapData error:', error)
    throw new Error('Failed to fetch activity heatmap data')
  }

  return (data || []).map((row: {
    activity_date: string
    activity_count: number
    day_of_week: number
  }) => ({
    activityDate: row.activity_date,
    activityCount: Number(row.activity_count),
    dayOfWeek: Number(row.day_of_week)
  }))
}

/**
 * Get activity breakdown by module
 */
export async function getActivityByModule(
  params: DateRangeParams
): Promise<ActivityByModuleData[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const validation = DateRangeSchema.parse(params)

  const { data, error } = await supabase.rpc('get_activity_by_module', {
    p_start_date: validation.from,
    p_end_date: validation.to
  })

  if (error) {
    console.error('getActivityByModule error:', error)
    throw new Error('Failed to fetch activity by module')
  }

  return (data || []).map((row: {
    module: string
    activity_count: number
    percentage: number
  }) => ({
    module: row.module,
    activityCount: Number(row.activity_count),
    percentage: Number(row.percentage)
  }))
}

/**
 * Get KPI data with trends
 */
export async function getKPIData(params: DateRangeParams): Promise<KPIData[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const validation = DateRangeSchema.parse(params)

  const currentStart = new Date(validation.from)
  const currentEnd = new Date(validation.to)
  const periodDays = Math.ceil((currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate previous period
  const prevEnd = new Date(currentStart.getTime() - 1)
  const prevStart = new Date(prevEnd.getTime() - periodDays * 24 * 60 * 60 * 1000)

  // Fetch all stats in parallel
  const [
    currentUsersResult,
    previousUsersResult,
    currentActivitiesResult,
    previousActivitiesResult,
    contentStatsResult,
    currentInquiriesResult,
    previousInquiriesResult
  ] = await Promise.all([
    // Current period new users
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', validation.from)
      .lte('created_at', validation.to),

    // Previous period new users
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', prevStart.toISOString())
      .lte('created_at', prevEnd.toISOString()),

    // Current period activities
    supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', validation.from)
      .lte('created_at', validation.to),

    // Previous period activities
    supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', prevStart.toISOString())
      .lte('created_at', prevEnd.toISOString()),

    // Content stats
    supabase.rpc('get_content_stats', {
      p_start_date: validation.from,
      p_end_date: validation.to
    }),

    // Current period inquiries
    supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', validation.from)
      .lte('created_at', validation.to),

    // Previous period inquiries
    supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', prevStart.toISOString())
      .lte('created_at', prevEnd.toISOString())
  ])

  const contentStats = contentStatsResult.data?.[0] || {}

  return [
    {
      id: 'new_users',
      label: 'New Users',
      currentValue: currentUsersResult.count || 0,
      previousValue: previousUsersResult.count || 0,
      format: 'number'
    },
    {
      id: 'total_activities',
      label: 'Total Activities',
      currentValue: currentActivitiesResult.count || 0,
      previousValue: previousActivitiesResult.count || 0,
      format: 'number'
    },
    {
      id: 'published_pages',
      label: 'Published Pages',
      currentValue: Number(contentStats.published_pages) || 0,
      previousValue: 0, // Static metric
      format: 'number'
    },
    {
      id: 'inquiries',
      label: 'Contact Inquiries',
      currentValue: currentInquiriesResult.count || 0,
      previousValue: previousInquiriesResult.count || 0,
      format: 'number'
    }
  ]
}

// ============================================
// Export Actions
// ============================================

/**
 * Log analytics export action for audit trail
 */
export async function logAnalyticsExport(
  params: ExportParams
): Promise<{ success: boolean }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Check export permission
  const hasPermission = await checkPermission(user.id, 'dashboard:analytics:export')
  if (!hasPermission) {
    throw new Error('Permission denied: dashboard:analytics:export required')
  }

  const validation = AnalyticsExportSchema.parse(params)

  await logActivity({
    userId: user.id,
    action: 'export',
    module: 'dashboard',
    resourceType: 'analytics',
    metadata: {
      exportType: validation.type,
      section: validation.section,
      dateRange: {
        from: validation.dateRange.from,
        to: validation.dateRange.to
      }
    }
  })

  return { success: true }
}

// ============================================
// Summary/Overview Actions
// ============================================

/**
 * Get analytics overview data (all key metrics)
 */
export async function getAnalyticsOverview(params: DateRangeParams) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  // Fetch all data in parallel
  const [
    userGrowthData,
    roleDistribution,
    contentStats,
    kpiData
  ] = await Promise.all([
    getUserGrowthData(params),
    getRoleDistribution(),
    getContentStats(params),
    getKPIData(params)
  ])

  return {
    userGrowth: userGrowthData,
    roleDistribution,
    contentStats,
    kpis: kpiData
  }
}

/**
 * Get available modules for activity filtering
 */
export async function getAvailableModules(): Promise<string[]> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')
  await requireAnalyticsPermission(user.id)

  const { data, error } = await supabase
    .from('user_activity_logs')
    .select('module')
    .limit(1000)

  if (error) {
    console.error('getAvailableModules error:', error)
    return []
  }

  // Get unique modules
  const modules = [...new Set((data || []).map((row) => row.module))].filter(Boolean)
  return modules.sort()
}
