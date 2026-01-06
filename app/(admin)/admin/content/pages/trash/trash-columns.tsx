'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  RotateCcw,
  Trash2,
  FileText,
  Clock,
  User,
  AlertTriangle,
} from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { format, formatDistanceToNow } from 'date-fns'
import type { PageStatus, PageVisibility } from '@/app/actions/cms/pages'

// Action handlers interface
export interface TrashPageActionHandlers {
  onRestore?: (pageId: string, pageTitle: string) => void
  onPermanentDelete?: (pageId: string, pageTitle: string) => void
}

export type TrashPageRow = {
  id: string
  title: string
  slug: string
  description: string | null
  status: PageStatus
  visibility: PageVisibility
  is_homepage: boolean | null
  show_in_navigation: boolean | null
  sort_order: number | null
  parent_id: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  creator?: {
    full_name: string | null
    email: string
  }
  deleter?: {
    full_name: string | null
    email: string
  }
  cms_seo_metadata?: {
    seo_score: number | null
  } | null
}

const getStatusColor = (status: PageStatus) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'draft':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
  }
}

// Helper to check if page is expiring soon (within 7 days)
const isExpiringSoon = (deletedAt: string | null): boolean => {
  if (!deletedAt) return false
  const deletedDate = new Date(deletedAt)
  const expiryDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from deletion
  const now = new Date()
  const daysUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0
}

// Helper to get days remaining until auto-purge
const getDaysUntilPurge = (deletedAt: string | null): number => {
  if (!deletedAt) return 0
  const deletedDate = new Date(deletedAt)
  const expiryDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, daysRemaining)
}

// Factory function to create columns with action handlers
export const createTrashColumns = (handlers: TrashPageActionHandlers = {}): ColumnDef<TrashPageRow>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Page" />,
    cell: ({ row }) => {
      const page = row.original
      const expiringSoon = isExpiringSoon(page.deleted_at)

      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
            <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{page.title}</span>
              {expiringSoon && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Expiring Soon
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>/</span>
              {page.slug.split('/').map((segment, i, arr) => (
                <React.Fragment key={i}>
                  <span className={i === arr.length - 1 ? 'font-medium text-foreground' : ''}>
                    {segment}
                  </span>
                  {i < arr.length - 1 && <span className="text-muted-foreground/50">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as PageStatus
      return (
        <Badge variant="secondary" className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'deleted_by',
    header: 'Deleted By',
    cell: ({ row }) => {
      const deleter = row.original.deleter

      return (
        <div className="flex flex-col">
          <span className="text-foreground">
            {deleter?.full_name || 'Unknown'}
          </span>
          {deleter?.email && (
            <span className="text-sm text-muted-foreground">{deleter.email}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'deleted_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deleted" />,
    cell: ({ row }) => {
      const deletedAt = row.getValue('deleted_at') as string | null
      const daysRemaining = getDaysUntilPurge(deletedAt)
      const expiringSoon = daysRemaining <= 7 && daysRemaining > 0

      return (
        <div className="flex flex-col">
          <span className="text-foreground">
            {deletedAt ? formatDistanceToNow(new Date(deletedAt), { addSuffix: true }) : '-'}
          </span>
          {deletedAt && (
            <span className={`text-sm flex items-center gap-1 ${expiringSoon ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-muted-foreground'}`}>
              <Clock className="h-3 w-3" />
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} until purge
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const page = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-green-600 cursor-pointer"
              onClick={() => handlers.onRestore?.(page.id, page.title)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => handlers.onPermanentDelete?.(page.id, page.title)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Forever
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Backward compatibility - default columns without handlers
export const trashColumns = createTrashColumns()
