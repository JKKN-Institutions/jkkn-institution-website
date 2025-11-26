/**
 * CSV Export Utility
 * Provides functions for generating and downloading CSV files
 */

/**
 * Escape a value for CSV format
 * - Wraps in quotes if contains comma, quote, or newline
 * - Escapes existing quotes by doubling them
 */
export function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // Check if value needs quoting
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    // Escape quotes by doubling them and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Generate CSV content from an array of objects
 * @param data - Array of objects to convert
 * @param columns - Column definitions with key and header
 * @returns CSV string
 */
export function generateCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: Array<{ key: keyof T | string; header: string; accessor?: (row: T) => unknown }>
): string {
  if (data.length === 0) {
    return ''
  }

  // Generate header row
  const headers = columns.map((col) => escapeCSVField(col.header))
  const rows = [headers.join(',')]

  // Generate data rows
  for (const row of data) {
    const values = columns.map((col) => {
      let value: unknown
      if (col.accessor) {
        value = col.accessor(row)
      } else if (typeof col.key === 'string' && col.key.includes('.')) {
        // Handle nested keys like "profile.full_name"
        const keys = col.key.split('.')
        value = keys.reduce((obj: unknown, key) => {
          if (obj && typeof obj === 'object') {
            return (obj as Record<string, unknown>)[key]
          }
          return undefined
        }, row)
      } else {
        value = row[col.key as keyof T]
      }
      return escapeCSVField(value)
    })
    rows.push(values.join(','))
  }

  return rows.join('\n')
}

/**
 * Download a CSV string as a file
 * @param csvContent - The CSV content
 * @param filename - The filename (without .csv extension)
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add BOM for Excel UTF-8 compatibility
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  URL.revokeObjectURL(url)
}

/**
 * Format a date for CSV export
 */
export function formatDateForCSV(date: string | Date | null | undefined): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) return ''

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a datetime for CSV export
 */
export function formatDateTimeForCSV(date: string | Date | null | undefined): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) return ''

  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
