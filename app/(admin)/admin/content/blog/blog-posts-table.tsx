'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect, useMemo } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { createColumns, type BlogPostRow, type BlogPostActionHandlers } from './columns'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Loader2, Trash2, Send, Archive, Star, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  archiveBlogPost,
  deleteBlogPost,
  bulkDeleteBlogPosts,
  bulkUpdateBlogPostStatus,
  toggleBlogPostFeatured,
  toggleBlogPostPinned,
} from '@/app/actions/cms/blog'
import { getBlogCategories } from '@/app/actions/cms/blog-categories'
import type { RowSelectionState } from '@tanstack/react-table'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BlogPostsTableProps {
  page: number
  limit: number
  search: string
  statusFilter: string
  categoryFilter: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export function BlogPostsTable({
  page: initialPage,
  limit: initialLimit,
  search: initialSearch,
  statusFilter: initialStatusFilter,
  categoryFilter: initialCategoryFilter,
}: BlogPostsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [data, setData] = useState<BlogPostRow[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  // Filter states
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [statusValue, setStatusValue] = useState(initialStatusFilter)
  const [categoryValue, setCategoryValue] = useState(initialCategoryFilter)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Bulk action dialog state
  const [bulkAction, setBulkAction] = useState<{
    type: 'publish' | 'unpublish' | 'archive' | 'delete' | null
    isOpen: boolean
  }>({ type: null, isOpen: false })
  const [isProcessing, setIsProcessing] = useState(false)

  // Single action dialog state
  const [singleAction, setSingleAction] = useState<{
    type: 'publish' | 'unpublish' | 'archive' | 'delete' | null
    postId: string | null
    isOpen: boolean
  }>({ type: null, postId: null, isOpen: false })

  // Get selected post IDs from row selection
  const selectedPostIds = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => data[parseInt(index)]?.id)
      .filter(Boolean)
  }, [rowSelection, data])

  const handleClearSelection = useCallback(() => {
    setRowSelection({})
  }, [])

  const handleRowSelectionChange = useCallback((selection: RowSelectionState) => {
    setRowSelection(selection)
  }, [])

  // Update URL params
  const updateUrlParams = useCallback(
    (params: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, String(value))
        } else {
          newParams.delete(key)
        }
      })

      router.push(`/admin/content/blog?${newParams.toString()}`)
    },
    [router, searchParams]
  )

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getBlogCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getBlogPosts({
        page,
        limit,
        search: searchValue,
        status: statusValue as 'draft' | 'published' | 'archived' | 'scheduled' | undefined,
        category_id: categoryValue || undefined,
      })

      setData(result.data as BlogPostRow[])
      setTotal(result.total)
      setPageCount(result.totalPages)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      toast.error('Failed to fetch blog posts')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, searchValue, statusValue, categoryValue])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== initialSearch) {
        updateUrlParams({ search: searchValue, page: 1 })
        setPage(1)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue, initialSearch, updateUrlParams])

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? '' : value
    setStatusValue(newStatus)
    updateUrlParams({ status: newStatus, page: 1 })
    setPage(1)
  }

  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    const newCategory = value === 'all' ? '' : value
    setCategoryValue(newCategory)
    updateUrlParams({ category: newCategory, page: 1 })
    setPage(1)
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateUrlParams({ page: newPage })
  }

  // Action handlers for single posts
  const actionHandlers: BlogPostActionHandlers = {
    onPublish: (postId) => {
      setSingleAction({ type: 'publish', postId, isOpen: true })
    },
    onUnpublish: (postId) => {
      setSingleAction({ type: 'unpublish', postId, isOpen: true })
    },
    onArchive: (postId) => {
      setSingleAction({ type: 'archive', postId, isOpen: true })
    },
    onDelete: (postId) => {
      setSingleAction({ type: 'delete', postId, isOpen: true })
    },
    onToggleFeatured: async (postId) => {
      const result = await toggleBlogPostFeatured(postId)
      if (result.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message)
      }
    },
    onTogglePinned: async (postId) => {
      const result = await toggleBlogPostPinned(postId)
      if (result.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message)
      }
    },
  }

  // Handle single action confirmation
  const handleSingleActionConfirm = async () => {
    if (!singleAction.postId || !singleAction.type) return

    setIsProcessing(true)
    try {
      let result
      switch (singleAction.type) {
        case 'publish':
          result = await publishBlogPost(singleAction.postId)
          break
        case 'unpublish':
          result = await unpublishBlogPost(singleAction.postId)
          break
        case 'archive':
          result = await archiveBlogPost(singleAction.postId)
          break
        case 'delete':
          result = await deleteBlogPost(singleAction.postId)
          break
      }

      if (result?.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result?.message || 'Action failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsProcessing(false)
      setSingleAction({ type: null, postId: null, isOpen: false })
    }
  }

  // Handle bulk action confirmation
  const handleBulkActionConfirm = async () => {
    if (selectedPostIds.length === 0 || !bulkAction.type) return

    setIsProcessing(true)
    try {
      let result
      switch (bulkAction.type) {
        case 'publish':
          result = await bulkUpdateBlogPostStatus(selectedPostIds, 'published')
          break
        case 'unpublish':
          result = await bulkUpdateBlogPostStatus(selectedPostIds, 'draft')
          break
        case 'archive':
          result = await bulkUpdateBlogPostStatus(selectedPostIds, 'archived')
          break
        case 'delete':
          result = await bulkDeleteBlogPosts(selectedPostIds)
          break
      }

      if (result?.success) {
        toast.success(result.message)
        handleClearSelection()
        fetchData()
      } else {
        toast.error(result?.message || 'Bulk action failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsProcessing(false)
      setBulkAction({ type: null, isOpen: false })
    }
  }

  const columns = useMemo(() => createColumns(actionHandlers), [])

  const getActionTitle = (type: string | null) => {
    switch (type) {
      case 'publish':
        return 'Publish'
      case 'unpublish':
        return 'Unpublish'
      case 'archive':
        return 'Archive'
      case 'delete':
        return 'Delete'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-9 bg-background/50 border-border/50 rounded-xl min-h-[44px]"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setSearchValue('')
                updateUrlParams({ search: '', page: 1 })
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select value={statusValue || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-border/50 rounded-xl min-h-[44px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryValue || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50 rounded-xl min-h-[44px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bulk Actions */}
        {selectedPostIds.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              {selectedPostIds.length} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-h-[36px]">
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setBulkAction({ type: 'publish', isOpen: true })}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publish
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setBulkAction({ type: 'unpublish', isOpen: true })}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Unpublish
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setBulkAction({ type: 'archive', isOpen: true })}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setBulkAction({ type: 'delete', isOpen: true })}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="min-h-[36px]"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        page={page}
        pageSize={limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setLimit(newSize)
          updateUrlParams({ limit: newSize, page: 1 })
        }}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        isLoading={isLoading}
        total={total}
      />

      {/* Single Action Dialog */}
      <AlertDialog
        open={singleAction.isOpen}
        onOpenChange={(open) => {
          if (!open) setSingleAction({ type: null, postId: null, isOpen: false })
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getActionTitle(singleAction.type)} Post</AlertDialogTitle>
            <AlertDialogDescription>
              {singleAction.type === 'delete'
                ? 'This action cannot be undone. This will permanently delete the post and all associated data.'
                : `Are you sure you want to ${singleAction.type} this post?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSingleActionConfirm}
              disabled={isProcessing}
              className={singleAction.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getActionTitle(singleAction.type)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Action Dialog */}
      <AlertDialog
        open={bulkAction.isOpen}
        onOpenChange={(open) => {
          if (!open) setBulkAction({ type: null, isOpen: false })
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {getActionTitle(bulkAction.type)} {selectedPostIds.length} Posts
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction.type === 'delete'
                ? `This action cannot be undone. This will permanently delete ${selectedPostIds.length} posts and all associated data.`
                : `Are you sure you want to ${bulkAction.type} ${selectedPostIds.length} posts?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkActionConfirm}
              disabled={isProcessing}
              className={bulkAction.type === 'delete' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getActionTitle(bulkAction.type)} All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
