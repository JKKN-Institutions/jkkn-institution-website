'use client'

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
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  Globe,
  FileText,
  Home,
  Send,
  EyeOff,
  Clock,
  FolderTree,
  CornerDownRight,
} from 'lucide-react'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import type { PageStatus, PageVisibility } from '@/app/actions/cms/pages'

// Action handlers interface
export interface PageActionHandlers {
  onDuplicate?: (pageId: string) => void
  onPublish?: (pageId: string) => void
  onUnpublish?: (pageId: string) => void
  onArchive?: (pageId: string) => void
  onDelete?: (pageId: string) => void
}

export type PageRow = {
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
  published_at: string | null
  creator?: {
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

const getVisibilityIcon = (visibility: PageVisibility) => {
  switch (visibility) {
    case 'public':
      return <Globe className="h-3 w-3" />
    case 'private':
      return <EyeOff className="h-3 w-3" />
    case 'password_protected':
      return <EyeOff className="h-3 w-3" />
    default:
      return <Globe className="h-3 w-3" />
  }
}

// Factory function to create columns with action handlers
export const createColumns = (handlers: PageActionHandlers = {}): ColumnDef<PageRow>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Page" />,
    cell: ({ row }) => {
      const page = row.original
      const isChild = !!page.parent_id

      return (
        <div className={`flex items-center gap-3 ${isChild ? 'pl-6' : ''}`}>
          {/* Show indent indicator for child pages */}
          {isChild && (
            <CornerDownRight className="h-4 w-4 text-muted-foreground/50 -ml-5 flex-shrink-0" />
          )}
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isChild ? 'bg-muted/50' : 'bg-primary/10'}`}>
            {page.is_homepage ? (
              <Home className="h-4 w-4 text-primary" />
            ) : isChild ? (
              <FileText className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FolderTree className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isChild ? 'text-muted-foreground' : 'text-foreground'}`}>
                {page.title}
              </span>
              {page.is_homepage && (
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                  Homepage
                </Badge>
              )}
              {!isChild && !page.is_homepage && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Menu
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">/{page.slug}</span>
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
      const visibility = row.original.visibility

      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <span className="text-muted-foreground" title={visibility}>
            {getVisibilityIcon(visibility)}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'author',
    header: 'Author',
    cell: ({ row }) => {
      const creator = row.original.creator

      return (
        <div className="flex flex-col">
          <span className="text-foreground">
            {creator?.full_name || 'Unknown'}
          </span>
          {creator?.email && (
            <span className="text-sm text-muted-foreground">{creator.email}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updated_at') as string | null
      const publishedAt = row.original.published_at

      return (
        <div className="flex flex-col">
          <span className="text-foreground">
            {updatedAt ? format(new Date(updatedAt), 'MMM d, yyyy') : '-'}
          </span>
          {publishedAt && (
            <span className="text-sm text-muted-foreground">
              Published: {format(new Date(publishedAt), 'MMM d')}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: 'seo',
    header: 'SEO',
    cell: ({ row }) => {
      const seoScore = row.original.cms_seo_metadata?.seo_score

      if (seoScore === null || seoScore === undefined) {
        return <span className="text-muted-foreground">-</span>
      }

      const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 50) return 'text-amber-600'
        return 'text-red-600'
      }

      return (
        <span className={`font-medium ${getScoreColor(seoScore)}`}>
          {seoScore}%
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const page = row.original
      const isPublished = page.status === 'published'
      const isDraft = page.status === 'draft'
      const isArchived = page.status === 'archived'
      const isScheduled = page.status === 'scheduled'

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
            {isPublished && (
              <DropdownMenuItem asChild>
                <Link href={`/${page.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View live
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={`/editor/${page.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/pages/${page.id}`}>
                <FileText className="mr-2 h-4 w-4" />
                Page details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isDraft && (
              <DropdownMenuItem
                className="text-green-600"
                onClick={() => handlers.onPublish?.(page.id)}
              >
                <Send className="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
            )}
            {isPublished && (
              <DropdownMenuItem
                className="text-amber-600"
                onClick={() => handlers.onUnpublish?.(page.id)}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
            )}
            {isScheduled && (
              <DropdownMenuItem className="text-blue-600" disabled>
                <Clock className="mr-2 h-4 w-4" />
                Scheduled
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handlers.onDuplicate?.(page.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            {!isArchived && (
              <DropdownMenuItem
                className="text-amber-600"
                onClick={() => handlers.onArchive?.(page.id)}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {!page.is_homepage && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handlers.onDelete?.(page.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Backward compatibility - default columns without handlers
export const columns = createColumns()
