'use client'

import { useState, useRef } from 'react'
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { logAnalyticsExport } from '@/app/actions/analytics'
import { exportElementAsPDF, exportAnalyticsAsCSV, generateExportFilename, getExportTitle } from '@/lib/analytics/export-utils'
import { useDateRange } from './date-range-selector'
import { dateRangeToParams } from '@/lib/analytics/date-presets'
import type { AnalyticsSection, ExportFormat } from '@/lib/analytics/types'

interface ExportButtonProps {
  section?: AnalyticsSection
  contentRef?: React.RefObject<HTMLElement>
  csvData?: unknown[]
  csvColumns?: Array<{ key: string; header: string; accessor?: (row: unknown) => unknown }>
  disabled?: boolean
  className?: string
}

export function ExportButton({
  section = 'overview',
  contentRef,
  csvData,
  csvColumns,
  disabled = false,
  className
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const dateRange = useDateRange()

  const handleExport = async (format: ExportFormat) => {
    if (isExporting) return

    setIsExporting(true)

    try {
      const dateRangeParams = dateRangeToParams(dateRange)
      const filename = generateExportFilename(section, dateRange, format)

      if (format === 'pdf') {
        // Export as PDF
        if (!contentRef?.current) {
          toast.error('No content to export')
          return
        }

        await exportElementAsPDF(contentRef.current, filename, {
          title: getExportTitle(section),
          subtitle: `Data from ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`,
          orientation: 'landscape'
        })

        toast.success('PDF exported successfully')
      } else {
        // Export as CSV
        if (!csvData || !csvColumns) {
          toast.error('No data to export')
          return
        }

        exportAnalyticsAsCSV(csvData as Record<string, unknown>[], csvColumns, filename)
        toast.success('CSV exported successfully')
      }

      // Log the export action
      await logAnalyticsExport({
        type: format,
        section,
        dateRange: dateRangeParams
      })
    } catch (error) {
      console.error('Export error:', error)
      toast.error(`Failed to export ${format.toUpperCase()}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isExporting}
          className={className}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          disabled={!csvData || !csvColumns}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          disabled={!contentRef?.current}
        >
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple export button for individual charts/tables
interface ChartExportButtonProps {
  onExportCSV?: () => void
  onExportPDF?: () => void
  disabled?: boolean
  className?: string
}

export function ChartExportButton({
  onExportCSV,
  onExportPDF,
  disabled = false,
  className
}: ChartExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (handler?: () => void | Promise<void>) => {
    if (!handler || isExporting) return

    setIsExporting(true)
    try {
      await handler()
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || isExporting}
          className={className}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onExportCSV && (
          <DropdownMenuItem onClick={() => handleExport(onExportCSV)}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </DropdownMenuItem>
        )}
        {onExportPDF && (
          <DropdownMenuItem onClick={() => handleExport(onExportPDF)}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
