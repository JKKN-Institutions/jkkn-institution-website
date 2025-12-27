/**
 * Analytics Export Utilities
 * PDF and enhanced export functionality for analytics dashboards
 *
 * Note: jsPDF and html2canvas are dynamically imported to reduce initial bundle size
 */

import { format as formatDate } from 'date-fns'
import { generateCSV, downloadCSV } from '@/lib/utils/csv-export'
import type { DateRange, ExportFormat, AnalyticsSection } from './types'

/**
 * Export a DOM element as PDF
 * Libraries are loaded dynamically on first use
 */
export async function exportElementAsPDF(
  element: HTMLElement,
  filename: string,
  options?: {
    title?: string
    subtitle?: string
    orientation?: 'portrait' | 'landscape'
  }
): Promise<void> {
  const { title, subtitle, orientation = 'landscape' } = options || {}

  // Dynamic imports for PDF libraries
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf')
  ])

  // Create canvas from element
  const canvas = await html2canvas(element, {
    scale: 2, // Higher resolution
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false
  })

  // Calculate dimensions
  const imgWidth = orientation === 'landscape' ? 297 : 210 // A4 dimensions in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  // Create PDF
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  })

  // Add title if provided
  let yOffset = 10
  if (title) {
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, 10, yOffset)
    yOffset += 8
  }

  if (subtitle) {
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100)
    pdf.text(subtitle, 10, yOffset)
    yOffset += 10
  }

  // Add timestamp
  pdf.setFontSize(9)
  pdf.setTextColor(128)
  pdf.text(`Generated on ${formatDate(new Date(), 'MMM d, yyyy \'at\' h:mm a')}`, 10, yOffset)
  yOffset += 10

  // Add the canvas image
  const imgData = canvas.toDataURL('image/png')
  const availableHeight = (orientation === 'landscape' ? 210 : 297) - yOffset - 10

  // Scale image to fit
  let finalWidth = imgWidth - 20
  let finalHeight = imgHeight
  if (finalHeight > availableHeight) {
    finalHeight = availableHeight
    finalWidth = (canvas.width * finalHeight) / canvas.height
  }

  pdf.addImage(imgData, 'PNG', 10, yOffset, finalWidth, finalHeight)

  // Save the PDF
  pdf.save(`${filename}.pdf`)
}

/**
 * Export analytics data as CSV
 */
export function exportAnalyticsAsCSV(
  data: object[],
  columns: Array<{ key: string; header: string; accessor?: (row: unknown) => unknown }>,
  filename: string
): void {
  const csvContent = generateCSV(data as Record<string, unknown>[], columns)
  downloadCSV(csvContent, filename)
}

/**
 * Generate filename for analytics export
 */
export function generateExportFilename(
  section: AnalyticsSection,
  dateRange: DateRange,
  exportFormat: ExportFormat
): string {
  const sectionNames: Record<AnalyticsSection, string> = {
    overview: 'analytics-overview',
    users: 'user-analytics',
    content: 'content-analytics',
    engagement: 'engagement-analytics'
  }

  const dateStr = `${formatDate(dateRange.from, 'yyyy-MM-dd')}_to_${formatDate(dateRange.to, 'yyyy-MM-dd')}`

  return `${sectionNames[section]}_${dateStr}`
}

/**
 * Create a printable title for PDF exports
 */
export function getExportTitle(section: AnalyticsSection): string {
  const titles: Record<AnalyticsSection, string> = {
    overview: 'Analytics Overview',
    users: 'User Analytics Report',
    content: 'Content Analytics Report',
    engagement: 'Engagement Analytics Report'
  }

  return titles[section]
}

/**
 * Column definitions for user growth CSV export
 */
export const userGrowthColumns = [
  { key: 'periodDate', header: 'Date' },
  { key: 'newUsers', header: 'New Users' },
  { key: 'activeUsers', header: 'Active Users' },
  { key: 'cumulativeTotal', header: 'Total Users' }
]

/**
 * Column definitions for role distribution CSV export
 */
export const roleDistributionColumns = [
  { key: 'displayName', header: 'Role' },
  { key: 'userCount', header: 'User Count' },
  { key: 'percentage', header: 'Percentage (%)' }
]

/**
 * Column definitions for top contributors CSV export
 */
export const topContributorsColumns = [
  { key: 'rank', header: 'Rank' },
  { key: 'fullName', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'activityCount', header: 'Activity Count' }
]

/**
 * Column definitions for top pages CSV export
 */
export const topPagesColumns = [
  { key: 'pageTitle', header: 'Page Title' },
  { key: 'slug', header: 'URL Slug' },
  { key: 'viewCount', header: 'Views' },
  { key: 'publishedAt', header: 'Published Date' }
]

/**
 * Column definitions for activity heatmap CSV export
 */
export const activityHeatmapColumns = [
  { key: 'activityDate', header: 'Date' },
  { key: 'activityCount', header: 'Activity Count' },
  {
    key: 'dayOfWeek',
    header: 'Day of Week',
    accessor: (row: unknown) => {
      const data = row as { dayOfWeek: number }
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[data.dayOfWeek] || ''
    }
  }
]

/**
 * Column definitions for KPI data CSV export
 */
export const kpiDataColumns = [
  { key: 'label', header: 'Metric' },
  { key: 'currentValue', header: 'Current Value' },
  { key: 'previousValue', header: 'Previous Value' },
  {
    key: 'change',
    header: 'Change (%)',
    accessor: (row: unknown) => {
      const data = row as { currentValue: number; previousValue: number }
      if (data.previousValue === 0) return data.currentValue > 0 ? '+100%' : '0%'
      const change = ((data.currentValue - data.previousValue) / data.previousValue) * 100
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
    }
  }
]

/**
 * Capture and export a specific chart element
 */
export async function exportChartAsImage(
  chartElement: HTMLElement,
  filename: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  // Dynamic import for html2canvas
  const { default: html2canvas } = await import('html2canvas')

  const canvas = await html2canvas(chartElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false
  })

  const link = document.createElement('a')
  link.download = `${filename}.${format}`
  link.href = canvas.toDataURL(`image/${format}`)
  link.click()
}

/**
 * Create a blob from chart for sharing
 */
export async function chartToBlob(
  chartElement: HTMLElement
): Promise<Blob> {
  // Dynamic import for html2canvas
  const { default: html2canvas } = await import('html2canvas')

  const canvas = await html2canvas(chartElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Failed to create blob from canvas'))
      }
    }, 'image/png')
  })
}
