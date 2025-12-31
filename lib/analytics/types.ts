/**
 * Analytics Module Type Definitions
 * Types for analytics dashboard components and data structures
 */

// ============================================
// Date Range Types
// ============================================

export type DatePreset =
  | 'today'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'

export interface DateRange {
  from: Date
  to: Date
  preset: DatePreset
}

export interface DateRangeParams {
  from: string // ISO date string
  to: string   // ISO date string
  groupBy?: 'day' | 'week' | 'month'
}

// ============================================
// User Analytics Types
// ============================================

export interface UserGrowthData {
  periodDate: string
  newUsers: number
  activeUsers: number
  cumulativeTotal: number
}

export interface RoleDistributionData {
  roleId: string
  roleName: string
  displayName: string
  userCount: number
  percentage: number
}

export interface TopContributor {
  rank: number
  userId: string
  fullName: string
  email: string
  avatarUrl: string | null
  activityCount: number
}

export interface RecentUser {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  createdAt: string
  roles: Array<{
    id: string
    name: string
    displayName: string
  }>
}

// ============================================
// Content Analytics Types
// ============================================

export interface ContentStats {
  totalPages: number
  publishedPages: number
  draftPages: number
  archivedPages: number
  scheduledPages: number
  pagesCreatedInPeriod: number
  pagesPublishedInPeriod: number
}

export interface TopPageData {
  pageId: string
  pageTitle: string
  slug: string
  viewCount: number
  publishedAt: string | null
}

export interface ContentStatusData {
  status: string
  count: number
  percentage: number
}

// ============================================
// Engagement Analytics Types
// ============================================

export interface ActivityHeatmapData {
  activityDate: string
  activityCount: number
  dayOfWeek: number
}

export interface ActivityByModuleData {
  module: string
  activityCount: number
  percentage: number
}

export interface KPIData {
  id: string
  label: string
  currentValue: number
  previousValue: number
  targetValue?: number
  format: 'number' | 'percentage' | 'currency'
  sparklineData?: number[]
  status?: 'on_track' | 'at_risk' | 'critical'
}

export interface KPITrend {
  value: number
  direction: 'up' | 'down' | 'neutral'
  percentage: number
}

// ============================================
// Export Types
// ============================================

export type ExportFormat = 'csv' | 'pdf'

export type AnalyticsSection = 'overview' | 'users' | 'content' | 'engagement'

export interface ExportParams {
  type: ExportFormat
  section: AnalyticsSection
  dateRange: DateRangeParams
}

// ============================================
// Chart Configuration Types
// ============================================

export interface ChartDataPoint {
  name: string
  [key: string]: string | number
}

export interface LineChartSeries {
  dataKey: string
  name: string
  color: string
  strokeWidth?: number
  strokeDasharray?: string
}

export interface PieChartData {
  name: string
  value: number
  fill: string
}

// ============================================
// Component Props Types
// ============================================

export interface AnalyticsCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  onExport?: () => void
  exportLabel?: string
}

export interface DateRangeSelectorProps {
  value: DateRange
  onChange: (range: DateRange) => void
  presets?: DatePreset[]
  className?: string
}

export interface ExportButtonProps {
  onExportCSV: () => void
  onExportPDF: () => void
  isExporting?: boolean
  disabled?: boolean
}

// ============================================
// Visitor Analytics Types (Public Website)
// ============================================

export interface PageViewStats {
  viewDate: string
  totalViews: number
  uniqueVisitors: number
}

export interface TopPublicPage {
  pagePath: string
  pageTitle: string | null
  viewCount: number
  uniqueVisitors: number
}

export interface TrafficSource {
  referrerDomain: string
  visitCount: number
  percentage: number
}

export interface VisitorOverview {
  totalPageviews: number
  uniqueVisitors: number
  avgViewsPerDay: number
  topPage: string | null
  topReferrer: string | null
}
