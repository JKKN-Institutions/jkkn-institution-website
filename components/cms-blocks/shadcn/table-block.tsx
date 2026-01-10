'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface ShadcnTableBlockProps {
  caption?: string
  headers?: string[]
  rows?: string[][]
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  compact?: boolean
  responsive?: boolean
  headerStyle?: 'default' | 'dark' | 'accent'
  columnAlignment?: ('left' | 'center' | 'right')[]
  showCaption?: boolean
  captionPosition?: 'top' | 'bottom'
  className?: string
}

export default function ShadcnTableBlock({
  caption = 'Table Caption',
  headers = ['Name', 'Email', 'Role'],
  rows = [
    ['John Doe', 'john@example.com', 'Developer'],
    ['Jane Smith', 'jane@example.com', 'Designer'],
  ],
  striped = true,
  bordered = true,
  hoverable = true,
  compact = false,
  responsive = true,
  headerStyle = 'default',
  columnAlignment = ['left', 'left', 'left'],
  showCaption = true,
  captionPosition = 'bottom',
  className,
}: ShadcnTableBlockProps) {
  // Header style classes
  const headerStyleClasses = {
    default: 'bg-muted/50',
    dark: 'bg-primary text-primary-foreground',
    accent: 'bg-accent text-accent-foreground',
  }

  // Alignment mapping
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // Get alignment for each column (fallback to 'left' if not specified)
  const getAlignment = (index: number) => {
    return columnAlignment[index] || 'left'
  }

  // Table wrapper with responsive scroll
  const TableWrapper = ({ children }: { children: React.ReactNode }) => {
    if (responsive) {
      return (
        <div className="w-full overflow-x-auto rounded-md border">
          {children}
        </div>
      )
    }
    return <div className="w-full rounded-md border">{children}</div>
  }

  return (
    <TableWrapper>
      <Table
        className={cn(
          className,
          // Compact mode
          compact && '[&_td]:p-2 [&_th]:p-2',
          // Bordered
          bordered && 'border-collapse',
        )}
      >
        {/* Caption at top */}
        {showCaption && captionPosition === 'top' && caption && (
          <TableCaption className="caption-top text-lg font-medium mb-2">
            {caption}
          </TableCaption>
        )}

        <TableHeader className={headerStyleClasses[headerStyle]}>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className={cn(
                  alignmentClasses[getAlignment(index)],
                  headerStyle === 'dark' && 'text-primary-foreground',
                  headerStyle === 'accent' && 'text-accent-foreground'
                )}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(
                  // Striped rows
                  striped && 'even:bg-muted/30',
                  // Hoverable
                  hoverable && 'hover:bg-muted/50 transition-colors cursor-pointer'
                )}
              >
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className={alignmentClasses[getAlignment(cellIndex)]}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="h-24 text-center text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {/* Caption at bottom */}
        {showCaption && captionPosition === 'bottom' && caption && (
          <TableCaption className="text-sm text-muted-foreground">
            {caption}
          </TableCaption>
        )}
      </Table>
    </TableWrapper>
  )
}
