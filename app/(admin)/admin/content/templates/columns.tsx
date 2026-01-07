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
  Edit,
  Copy,
  Trash2,
  Layout,
  FileText,
  FolderOpen,
  Newspaper,
  Briefcase,
  ShoppingCart,
  Globe,
  Database,
  Upload,
} from 'lucide-react'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import type { TemplateCategory } from '@/app/actions/cms/templates'
import type { TemplateSource } from '@/lib/cms/templates/global/types'

// Action handlers interface
export interface TemplateActionHandlers {
  onDuplicate?: (templateId: string) => void
  onDuplicateGlobal?: (templateId: string) => void
  onPromoteToGlobal?: (templateId: string) => void
  onDelete?: (templateId: string) => void
}

export type TemplateRow = {
  id: string
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  default_blocks: unknown[]
  is_system: boolean
  category: TemplateCategory
  source?: TemplateSource // 'global' or 'local'
  created_at: string | null
  updated_at: string | null
  created_by: string | null
  creator?: {
    full_name: string | null
    email: string
  } | null
}

const categoryConfig: Record<TemplateCategory, { label: string; icon: React.ReactNode; color: string }> = {
  general: { label: 'General', icon: <FolderOpen className="h-3 w-3" />, color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
  landing: { label: 'Landing', icon: <Layout className="h-3 w-3" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  content: { label: 'Content', icon: <FileText className="h-3 w-3" />, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  blog: { label: 'Blog', icon: <Newspaper className="h-3 w-3" />, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  portfolio: { label: 'Portfolio', icon: <Briefcase className="h-3 w-3" />, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  ecommerce: { label: 'E-commerce', icon: <ShoppingCart className="h-3 w-3" />, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
}

// Factory function to create columns with action handlers
export const createColumns = (handlers: TemplateActionHandlers = {}): ColumnDef<TemplateRow>[] => [
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
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Template" />,
    cell: ({ row }) => {
      const template = row.original

      return (
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="h-16 w-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
            {template.thumbnail_url ? (
              <img
                src={template.thumbnail_url}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Layout className="h-6 w-6 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground truncate">
                {template.name}
              </span>
              {template.is_system && (
                <Badge variant="secondary" className="text-xs">
                  System
                </Badge>
              )}
            </div>
            {template.description && (
              <span className="text-sm text-muted-foreground line-clamp-1">
                {template.description}
              </span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const category = row.getValue('category') as TemplateCategory
      const config = categoryConfig[category]

      return (
        <Badge variant="secondary" className={config?.color}>
          <span className="mr-1">{config?.icon}</span>
          {config?.label || category}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'source',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
    cell: ({ row }) => {
      const source = row.original.source || 'local'

      return source === 'global' ? (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          <Globe className="mr-1 h-3 w-3" />
          Global
        </Badge>
      ) : (
        <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
          <Database className="mr-1 h-3 w-3" />
          Local
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const source = row.original.source || 'local'
      return value.includes(source)
    },
  },
  {
    id: 'blocks',
    header: 'Blocks',
    cell: ({ row }) => {
      const blocks = row.original.default_blocks as unknown[]
      return (
        <span className="text-muted-foreground">
          {blocks?.length || 0} blocks
        </span>
      )
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
            {creator?.full_name || 'System'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updated_at') as string | null

      return (
        <span className="text-foreground">
          {updatedAt ? format(new Date(updatedAt), 'MMM d, yyyy') : '-'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const template = row.original
      const isSystem = template.is_system
      const isGlobal = template.source === 'global'
      const isLocal = !isGlobal
      const isMainInstitution = process.env.NEXT_PUBLIC_INSTITUTION_ID === 'main'

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

            {/* Edit - only for local, non-system templates */}
            {isLocal && !isSystem && (
              <DropdownMenuItem asChild>
                <Link href={`/admin/content/templates/${template.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit template
                </Link>
              </DropdownMenuItem>
            )}

            {/* Duplicate - different actions for global vs local */}
            {isGlobal ? (
              <DropdownMenuItem onClick={() => handlers.onDuplicateGlobal?.(template.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate to Local
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handlers.onDuplicate?.(template.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}

            {/* Promote to Global - only for Main institution, local templates */}
            {isMainInstitution && isLocal && !isSystem && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handlers.onPromoteToGlobal?.(template.id)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Promote to Global
                </DropdownMenuItem>
              </>
            )}

            {/* Delete - only for local, non-system templates */}
            {isLocal && !isSystem && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handlers.onDelete?.(template.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}

            {/* Read-only notice for global templates */}
            {isGlobal && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Global templates are read-only
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Backward compatibility - default columns without handlers
export const columns = createColumns()
