'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, RotateCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { getDeletedPages, restorePage, permanentlyDeletePage } from '@/app/actions/cms/pages'
import { createTrashColumns, type TrashPageRow } from './trash-columns'
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

export function TrashTable() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('limit') || '30'))
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Data state
  const [data, setData] = useState<TrashPageRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  // Dialog states
  const [restoreDialog, setRestoreDialog] = useState<{
    isOpen: boolean
    pageId: string | null
    pageTitle: string | null
  }>({ isOpen: false, pageId: null, pageTitle: null })

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    pageId: string | null
    pageTitle: string | null
  }>({ isOpen: false, pageId: null, pageTitle: null })

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const result = await getDeletedPages({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
      })

      // Transform data to match TrashPageRow type (arrays to single objects)
      const transformedPages = result.pages.map((page: any) => ({
        ...page,
        creator: Array.isArray(page.creator) ? page.creator[0] : page.creator,
        deleter: Array.isArray(page.deleter) ? page.deleter[0] : page.deleter,
        cms_seo_metadata: Array.isArray(page.cms_seo_metadata) ? page.cms_seo_metadata[0] : page.cms_seo_metadata,
      }))

      setData(transformedPages as TrashPageRow[])
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error fetching deleted pages:', error)
      toast.error('Failed to load deleted pages')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchQuery])

  // Update URL when pagination changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page
    const params = new URLSearchParams(searchParams)
    params.set('limit', newPageSize.toString())
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on search
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  // Handle restore
  const handleRestoreClick = (pageId: string, pageTitle: string) => {
    setRestoreDialog({
      isOpen: true,
      pageId,
      pageTitle,
    })
  }

  const executeRestore = async () => {
    if (!restoreDialog.pageId) return

    try {
      const result = await restorePage(restoreDialog.pageId)
      if (result.success) {
        toast.success(result.message || 'Page restored')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to restore page')
      }
    } catch (error) {
      toast.error('Failed to restore page')
    } finally {
      setRestoreDialog({ isOpen: false, pageId: null, pageTitle: null })
    }
  }

  // Handle permanent delete
  const handleDeleteClick = (pageId: string, pageTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      pageId,
      pageTitle,
    })
  }

  const executeDelete = async () => {
    if (!deleteDialog.pageId) return

    try {
      const result = await permanentlyDeletePage(deleteDialog.pageId)
      if (result.success) {
        toast.success(result.message || 'Page permanently deleted')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to delete page')
      }
    } catch (error) {
      toast.error('Failed to delete page')
    } finally {
      setDeleteDialog({ isOpen: false, pageId: null, pageTitle: null })
    }
  }

  // Create columns with handlers
  const columns = createTrashColumns({
    onRestore: handleRestoreClick,
    onPermanentDelete: handleDeleteClick,
  })

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search deleted pages by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        pageCount={totalPages}
        page={currentPage}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={restoreDialog.isOpen}
        onOpenChange={(open) => !open && setRestoreDialog({ isOpen: false, pageId: null, pageTitle: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore page?</AlertDialogTitle>
            <AlertDialogDescription>
              {restoreDialog.pageTitle ? (
                <>
                  Are you sure you want to restore &quot;<strong>{restoreDialog.pageTitle}</strong>&quot;? The page will be moved back to your pages list.
                </>
              ) : (
                'Are you sure you want to restore this page? The page will be moved back to your pages list.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeRestore}
              className="bg-green-600 hover:bg-green-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, pageId: null, pageTitle: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete page?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.pageTitle ? (
                <>
                  Are you sure you want to permanently delete &quot;<strong>{deleteDialog.pageTitle}</strong>&quot;?{' '}
                  <strong className="text-red-600">This action cannot be undone.</strong> All page content, blocks, and metadata will be lost forever.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete this page?{' '}
                  <strong className="text-red-600">This action cannot be undone.</strong> All page content, blocks, and metadata will be lost forever.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
