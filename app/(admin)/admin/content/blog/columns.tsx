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
  Archive,
  Trash2,
  Globe,
  FileText,
  Send,
  EyeOff,
  Clock,
  Star,
  Pin,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import type { PostStatus, PostVisibility } from '@/app/actions/cms/blog'
import Image from 'next/image'

// Action handlers interface
export interface BlogPostActionHandlers {
  onPublish?: (postId: string) => void
  onUnpublish?: (postId: string) => void
  onArchive?: (postId: string) => void
  onDelete?: (postId: string) => void
  onToggleFeatured?: (postId: string) => void
  onTogglePinned?: (postId: string) => void
}

export type BlogPostRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  status: PostStatus | null
  visibility: PostVisibility | null
  is_featured: boolean | null
  is_pinned: boolean | null
  allow_comments: boolean | null
  reading_time_minutes: number | null
  view_count: number | null
  created_at: string | null
  updated_at: string | null
  published_at: string | null
  category?: {
    id: string
    name: string
    slug: string
    color: string | null
  } | null
  author?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  } | null
}

const getStatusColor = (status: PostStatus | null) => {
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

const getVisibilityIcon = (visibility: PostVisibility | null) => {
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
export const createColumns = (handlers: BlogPostActionHandlers = {}): ColumnDef<BlogPostRow>[] => [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Post" />,
    cell: ({ row }) => {
      const post = row.original

      return (
        <div className="flex items-center gap-3">
          {/* Featured Image Thumbnail */}
          <div className="relative h-12 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {post.featured_image ? (
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/content/blog/${post.id}`}
                className="font-medium text-foreground hover:text-primary truncate max-w-[200px]"
              >
                {post.title}
              </Link>
              {post.is_featured && (
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
              )}
              {post.is_pinned && (
                <Pin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate max-w-[150px]">/{post.slug}</span>
              {post.reading_time_minutes && (
                <>
                  <span>•</span>
                  <span>{post.reading_time_minutes} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const category = row.original.category
      if (!category) return <span className="text-muted-foreground">—</span>

      return (
        <Badge
          variant="outline"
          className="font-normal"
          style={{
            borderColor: category.color || undefined,
            color: category.color || undefined,
          }}
        >
          {category.name}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'author',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: ({ row }) => {
      const author = row.original.author
      if (!author) return <span className="text-muted-foreground">—</span>

      return (
        <div className="flex items-center gap-2">
          {author.avatar_url ? (
            <Image
              src={author.avatar_url}
              alt={author.full_name || 'Author'}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {(author.full_name || author.email)[0].toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-sm truncate max-w-[100px]">
            {author.full_name || author.email}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status
      const visibility = row.original.visibility

      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`capitalize ${getStatusColor(status)}`}>
            {status === 'scheduled' && <Clock className="mr-1 h-3 w-3" />}
            {status || 'draft'}
          </Badge>
          <span className="text-muted-foreground" title={`Visibility: ${visibility}`}>
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
    accessorKey: 'view_count',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Views" />,
    cell: ({ row }) => {
      const viewCount = row.original.view_count || 0
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>{viewCount.toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'published_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
    cell: ({ row }) => {
      const publishedAt = row.original.published_at
      const createdAt = row.original.created_at

      if (publishedAt) {
        return (
          <div className="flex flex-col text-sm">
            <span>{format(new Date(publishedAt), 'MMM d, yyyy')}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(publishedAt), 'h:mm a')}
            </span>
          </div>
        )
      }

      if (createdAt) {
        return (
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>Created</span>
            <span className="text-xs">{format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </div>
        )
      }

      return <span className="text-muted-foreground">—</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original
      const isPublished = post.status === 'published'
      const isArchived = post.status === 'archived'

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* View */}
            {isPublished && (
              <DropdownMenuItem asChild>
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View Post
                </Link>
              </DropdownMenuItem>
            )}

            {/* Edit */}
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/blog/${post.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Publish / Unpublish */}
            {!isPublished && !isArchived && handlers.onPublish && (
              <DropdownMenuItem onClick={() => handlers.onPublish?.(post.id)}>
                <Send className="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
            )}
            {isPublished && handlers.onUnpublish && (
              <DropdownMenuItem onClick={() => handlers.onUnpublish?.(post.id)}>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
            )}

            {/* Featured / Pinned */}
            {handlers.onToggleFeatured && (
              <DropdownMenuItem onClick={() => handlers.onToggleFeatured?.(post.id)}>
                <Star className={`mr-2 h-4 w-4 ${post.is_featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                {post.is_featured ? 'Unfeature' : 'Feature'}
              </DropdownMenuItem>
            )}
            {handlers.onTogglePinned && (
              <DropdownMenuItem onClick={() => handlers.onTogglePinned?.(post.id)}>
                <Pin className={`mr-2 h-4 w-4 ${post.is_pinned ? 'text-primary' : ''}`} />
                {post.is_pinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Archive */}
            {!isArchived && handlers.onArchive && (
              <DropdownMenuItem onClick={() => handlers.onArchive?.(post.id)}>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            )}

            {/* Delete */}
            {handlers.onDelete && (
              <DropdownMenuItem
                onClick={() => handlers.onDelete?.(post.id)}
                className="text-destructive focus:text-destructive"
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
