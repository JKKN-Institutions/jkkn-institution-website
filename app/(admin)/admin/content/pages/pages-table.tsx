'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect, useMemo } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { createColumns, type PageRow, type PageActionHandlers } from './columns'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Download, Loader2, ArrowUpDown, FileText, Globe, MoreVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPages, publishPage, unpublishPage, archivePage, deletePage, duplicatePage, getAllNavigationPages } from '@/app/actions/cms/pages'
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
import { ReorderPagesModal } from './reorder-pages-modal'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PagesTableProps {
  page: number
  limit: number
  search: string
  statusFilter: string
}

export function PagesTable({
  page: initialPage,
  limit: initialLimit,
  search: initialSearch,
  statusFilter: initialStatusFilter,
}: PagesTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [data, setData] = useState<PageRow[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [statusValue, setStatusValue] = useState(initialStatusFilter)
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

  // Reorder modal state
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false)
  const [allNavigationPages, setAllNavigationPages] = useState<Array<{
    id: string
    title: string
    slug: string
    status: string
    sort_order: number | null
    parent_id: string | null
  }>>([])
  const [isLoadingNavPages, setIsLoadingNavPages] = useState(false)

  // Get selected page IDs from row selection
  const selectedPageIds = useMemo(() => {
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

      router.push(`/admin/content/pages?${newParams.toString()}`)
    },
    [router, searchParams]
  )

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getPages({
        page,
        limit,
        search: searchValue,
        status: statusValue as 'draft' | 'published' | 'archived' | 'scheduled' | undefined,
      })

      setData(result.pages as PageRow[])
      setTotal(result.total)
      setPageCount(result.totalPages)
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast.error('Failed to fetch pages')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, searchValue, statusValue])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== initialSearch) {
        startTransition(() => {
          setPage(1)
          updateUrlParams({ search: searchValue, page: 1 })
        })
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue, initialSearch, updateUrlParams])

  // Handle filter changes
  const handleStatusChange = (value: string) => {
    setStatusValue(value === 'all' ? '' : value)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ status: value === 'all' ? '' : value, page: 1 })
    })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    startTransition(() => {
      updateUrlParams({ page: newPage })
    })
  }

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ limit: newLimit, page: 1 })
    })
  }

  const clearFilters = () => {
    setSearchValue('')
    setStatusValue('')
    setPage(1)
    router.push('/admin/content/pages')
  }

  const hasFilters = searchValue || statusValue

  // Bulk action handlers
  const handleBulkPublish = async () => {
    setIsProcessing(true)
    try {
      let successCount = 0
      let failCount = 0

      for (const pageId of selectedPageIds) {
        const result = await publishPage(pageId)
        if (result.success) {
          successCount++
        } else {
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} page(s) published successfully`)
      }
      if (failCount > 0) {
        toast.error(`${failCount} page(s) failed to publish`)
      }

      handleClearSelection()
      fetchData()
    } catch (error) {
      toast.error('Failed to publish pages')
    } finally {
      setIsProcessing(false)
      setBulkAction({ type: null, isOpen: false })
    }
  }

  const handleBulkUnpublish = async () => {
    setIsProcessing(true)
    try {
      let successCount = 0
      let failCount = 0

      for (const pageId of selectedPageIds) {
        const result = await unpublishPage(pageId)
        if (result.success) {
          successCount++
        } else {
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} page(s) unpublished`)
      }
      if (failCount > 0) {
        toast.error(`${failCount} page(s) failed to unpublish`)
      }

      handleClearSelection()
      fetchData()
    } catch (error) {
      toast.error('Failed to unpublish pages')
    } finally {
      setIsProcessing(false)
      setBulkAction({ type: null, isOpen: false })
    }
  }

  const handleBulkArchive = async () => {
    setIsProcessing(true)
    try {
      let successCount = 0
      let failCount = 0

      for (const pageId of selectedPageIds) {
        const result = await archivePage(pageId)
        if (result.success) {
          successCount++
        } else {
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} page(s) archived`)
      }
      if (failCount > 0) {
        toast.error(`${failCount} page(s) failed to archive`)
      }

      handleClearSelection()
      fetchData()
    } catch (error) {
      toast.error('Failed to archive pages')
    } finally {
      setIsProcessing(false)
      setBulkAction({ type: null, isOpen: false })
    }
  }

  const handleBulkDelete = async () => {
    setIsProcessing(true)
    try {
      let successCount = 0
      let failCount = 0

      for (const pageId of selectedPageIds) {
        const result = await deletePage(pageId)
        if (result.success) {
          successCount++
        } else {
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} page(s) deleted`)
      }
      if (failCount > 0) {
        toast.error(`${failCount} page(s) failed to delete`)
      }

      handleClearSelection()
      fetchData()
    } catch (error) {
      toast.error('Failed to delete pages')
    } finally {
      setIsProcessing(false)
      setBulkAction({ type: null, isOpen: false })
    }
  }

  const executeBulkAction = () => {
    switch (bulkAction.type) {
      case 'publish':
        handleBulkPublish()
        break
      case 'unpublish':
        handleBulkUnpublish()
        break
      case 'archive':
        handleBulkArchive()
        break
      case 'delete':
        handleBulkDelete()
        break
    }
  }

  // Single row action handlers
  const handleDuplicate = async (pageId: string) => {
    try {
      const result = await duplicatePage(pageId)
      if (result.success) {
        toast.success(result.message || 'Page duplicated successfully')
        fetchData()
        // Navigate to edit the new page
        const newPageId = (result.data as { id: string } | undefined)?.id
        if (newPageId) {
          router.push(`/admin/content/pages/${newPageId}/edit`)
        }
      } else {
        toast.error(result.message || 'Failed to duplicate page')
      }
    } catch (error) {
      toast.error('Failed to duplicate page')
    }
  }

  const handleSinglePublish = async (pageId: string) => {
    try {
      const result = await publishPage(pageId)
      if (result.success) {
        toast.success(result.message || 'Page published successfully')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to publish page')
      }
    } catch (error) {
      toast.error('Failed to publish page')
    }
  }

  const handleSingleUnpublish = async (pageId: string) => {
    try {
      const result = await unpublishPage(pageId)
      if (result.success) {
        toast.success(result.message || 'Page unpublished')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to unpublish page')
      }
    } catch (error) {
      toast.error('Failed to unpublish page')
    }
  }

  const handleSingleArchive = async (pageId: string) => {
    try {
      const result = await archivePage(pageId)
      if (result.success) {
        toast.success(result.message || 'Page archived')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to archive page')
      }
    } catch (error) {
      toast.error('Failed to archive page')
    }
  }

  const handleSingleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return
    }
    try {
      const result = await deletePage(pageId)
      if (result.success) {
        toast.success(result.message || 'Page deleted')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to delete page')
      }
    } catch (error) {
      toast.error('Failed to delete page')
    }
  }

  // Handle opening the reorder modal - fetch ALL navigation pages
  const handleOpenReorderModal = async () => {
    setIsLoadingNavPages(true)
    setIsReorderModalOpen(true)
    try {
      const navPages = await getAllNavigationPages()
      setAllNavigationPages(navPages)
    } catch (error) {
      console.error('Error fetching navigation pages:', error)
      toast.error('Failed to load pages for reordering')
    } finally {
      setIsLoadingNavPages(false)
    }
  }

  // Create columns with action handlers
  const actionHandlers: PageActionHandlers = useMemo(() => ({
    onDuplicate: handleDuplicate,
    onPublish: handleSinglePublish,
    onUnpublish: handleSingleUnpublish,
    onArchive: handleSingleArchive,
    onDelete: handleSingleDelete,
  }), [])

  const tableColumns = useMemo(() => createColumns(actionHandlers), [actionHandlers])

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      {selectedPageIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {selectedPageIds.length} page(s) selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkAction({ type: 'publish', isOpen: true })}
            >
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkAction({ type: 'unpublish', isOpen: true })}
            >
              Unpublish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBulkAction({ type: 'archive', isOpen: true })}
            >
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => setBulkAction({ type: 'delete', isOpen: true })}
            >
              Delete
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button variant="ghost" size="sm" onClick={handleClearSelection}>
              Clear selection
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar - Mobile Optimized */}
      <div className="flex flex-col gap-3">
        {/* Search - Full width on mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="pages-search"
            name="pages-search"
            placeholder="Search by title or slug..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 rounded-xl focus:border-primary/30 focus:ring-primary/20"
          />
        </div>

        {/* Filters - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusValue || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[140px] bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {hasFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Reorder Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenReorderModal}
              className="gap-2 flex-1 sm:flex-none"
            >
              <ArrowUpDown className="h-4 w-4" />
              Reorder
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden sm:block">
        <DataTable
          columns={tableColumns}
          data={data}
          pageCount={pageCount}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading || isPending}
          enableRowSelection={true}
          onRowSelectionChange={handleRowSelectionChange}
        />
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {isLoading || isPending ? (
          // Loading skeleton for mobile
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-card animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted rounded-full" />
              </div>
            </div>
          ))
        ) : data.length > 0 ? (
          data.map((pageItem) => (
            <MobilePageCard
              key={pageItem.id}
              page={pageItem}
              onPublish={handleSinglePublish}
              onUnpublish={handleSingleUnpublish}
              onDelete={handleSingleDelete}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No pages found.
          </div>
        )}

        {/* Mobile Pagination */}
        {!isLoading && data.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pageCount}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Confirmation Dialog */}
      <AlertDialog
        open={bulkAction.isOpen}
        onOpenChange={(open) => setBulkAction((prev) => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction.type === 'delete'
                ? 'Delete selected pages?'
                : bulkAction.type === 'publish'
                  ? 'Publish selected pages?'
                  : bulkAction.type === 'unpublish'
                    ? 'Unpublish selected pages?'
                    : 'Archive selected pages?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkAction.type === 'delete'
                ? `This will permanently delete ${selectedPageIds.length} page(s). This action cannot be undone.`
                : `This will ${bulkAction.type} ${selectedPageIds.length} page(s).`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBulkAction}
              disabled={isProcessing}
              className={bulkAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {bulkAction.type === 'delete'
                ? 'Delete'
                : bulkAction.type === 'publish'
                  ? 'Publish'
                  : bulkAction.type === 'unpublish'
                    ? 'Unpublish'
                    : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reorder Pages Modal */}
      <ReorderPagesModal
        open={isReorderModalOpen}
        onOpenChange={setIsReorderModalOpen}
        pages={allNavigationPages}
        isLoading={isLoadingNavPages}
        onReorderComplete={fetchData}
      />
    </div>
  )
}

// Mobile Card Component for Pages
function MobilePageCard({
  page,
  onPublish,
  onUnpublish,
  onDelete,
}: {
  page: PageRow
  onPublish: (id: string) => void
  onUnpublish: (id: string) => void
  onDelete: (id: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-start gap-3">
        {/* Page Icon */}
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {page.is_homepage ? <Globe className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
        </div>

        {/* Page Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/admin/content/pages/${page.id}/edit`}
            className="font-medium text-sm text-foreground hover:text-primary truncate block"
          >
            {page.title}
          </Link>
          <p className="text-xs text-muted-foreground truncate">/{page.slug}</p>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/content/pages/${page.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            {page.status === 'published' ? (
              <DropdownMenuItem onClick={() => onUnpublish(page.id)}>
                <EyeOff className="h-4 w-4 mr-2" />
                Unpublish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onPublish(page.id)}>
                <Eye className="h-4 w-4 mr-2" />
                Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(page.id)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status & Meta */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
          {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
        </span>
        <span className="text-xs text-muted-foreground" suppressHydrationWarning>
          {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : 'N/A'}
        </span>
      </div>
    </div>
  )
}
