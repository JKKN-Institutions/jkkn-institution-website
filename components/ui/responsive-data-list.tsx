'use client'

import { cn } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface DataListColumn<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
  hideOnMobile?: boolean
}

interface DataListAction<T> {
  label: string
  icon?: React.ReactNode
  onClick: (item: T) => void
  variant?: 'default' | 'destructive'
}

interface ResponsiveDataListProps<T> {
  items: T[]
  columns: DataListColumn<T>[]
  actions?: DataListAction<T>[]
  renderMobileCard?: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string
  emptyState?: React.ReactNode
  className?: string
}

export function ResponsiveDataList<T>({
  items,
  columns,
  actions,
  renderMobileCard,
  keyExtractor,
  emptyState,
  className,
}: ResponsiveDataListProps<T>) {
  const getValue = (item: T, accessor: DataListColumn<T>['accessor']) => {
    if (typeof accessor === 'function') {
      return accessor(item)
    }
    return String(item[accessor] ?? '')
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {emptyState || 'No items found'}
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-muted/30 transition-colors"
              >
                {columns.map((col, index) => (
                  <td
                    key={index}
                    className={cn('px-4 py-3 text-sm', col.className)}
                  >
                    {getValue(item, col.accessor)}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-primary/10"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {actions.map((action, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={cn(
                              action.variant === 'destructive' &&
                                'text-destructive focus:text-destructive'
                            )}
                          >
                            {action.icon && (
                              <span className="mr-2">{action.icon}</span>
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {items.map((item, index) => {
          if (renderMobileCard) {
            return (
              <div key={keyExtractor(item)}>{renderMobileCard(item, index)}</div>
            )
          }

          // Default mobile card
          return (
            <div
              key={keyExtractor(item)}
              className="bg-card/50 border border-border/50 rounded-xl p-4 space-y-3"
            >
              {/* Show visible columns */}
              {columns
                .filter((col) => !col.hideOnMobile)
                .map((col, colIndex) => (
                  <div key={colIndex} className="flex justify-between items-start gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {col.header}
                    </span>
                    <span className="text-sm text-right">{getValue(item, col.accessor)}</span>
                  </div>
                ))}

              {/* Actions */}
              {actions && actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                  {actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => action.onClick(item)}
                      className="flex-1 min-h-[44px]"
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
