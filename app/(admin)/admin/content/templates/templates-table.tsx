'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback, useEffect, useMemo } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { createColumns, type TemplateRow, type TemplateActionHandlers } from './columns'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTemplates, deleteTemplate, duplicateTemplate, type TemplateCategory } from '@/app/actions/cms/templates'
import { duplicateGlobalTemplate } from '@/app/actions/cms/templates'
import { promoteToGlobalTemplate } from '@/app/actions/cms/export-template'
import type { TemplateSource } from '@/lib/cms/templates/global/types'
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

interface TemplatesTableProps {
  page: number
  limit: number
  search: string
  categoryFilter: string
  sourceFilter?: string
}

export function TemplatesTable({
  page: initialPage,
  limit: initialLimit,
  search: initialSearch,
  categoryFilter: initialCategoryFilter,
  sourceFilter: initialSourceFilter,
}: TemplatesTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [data, setData] = useState<TemplateRow[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [categoryValue, setCategoryValue] = useState(initialCategoryFilter)
  const [sourceValue, setSourceValue] = useState<string>(initialSourceFilter ?? 'all')
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Promote dialog state
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false)
  const [templateToPromote, setTemplateToPromote] = useState<string | null>(null)
  const [isPromoting, setIsPromoting] = useState(false)
  const [promotionResult, setPromotionResult] = useState<{filePath?: string; instructions?: string[]} | null>(null)

  // Get selected template IDs from row selection
  const selectedTemplateIds = useMemo(() => {
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

      router.push(`/admin/content/templates?${newParams.toString()}`)
    },
    [router, searchParams]
  )

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getTemplates({
        page,
        limit,
        search: searchValue,
        category: categoryValue as TemplateCategory | undefined,
        source: sourceValue === 'all' ? undefined : (sourceValue as TemplateSource),
        includeSystem: true,
      })

      setData(result.templates as TemplateRow[])
      setTotal(result.total)
      setPageCount(result.totalPages)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to fetch templates')
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, searchValue, categoryValue, sourceValue])

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
  const handleSourceChange = (value: string) => {
    setSourceValue(value)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ source: value === 'all' ? '' : value, page: 1 })
    })
  }

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value === 'all' ? '' : value)
    setPage(1)
    startTransition(() => {
      updateUrlParams({ category: value === 'all' ? '' : value, page: 1 })
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
    setCategoryValue('')
    setSourceValue('all')
    setPage(1)
    router.push('/admin/content/templates')
  }

  const hasFilters = searchValue || categoryValue || (sourceValue && sourceValue !== 'all')

  // Action handlers
  const handleDuplicate = async (templateId: string) => {
    try {
      const result = await duplicateTemplate(templateId)
      if (result.success) {
        toast.success(result.message || 'Template duplicated successfully')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to duplicate template')
      }
    } catch (error) {
      toast.error('Failed to duplicate template')
    }
  }

  const handleDuplicateGlobal = async (templateId: string) => {
    try {
      const result = await duplicateGlobalTemplate(templateId)
      if (result.success) {
        toast.success(result.message || 'Global template copied to your local templates')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to duplicate global template')
      }
    } catch (error) {
      toast.error('Failed to duplicate global template')
    }
  }

  const handlePromoteToGlobal = (templateId: string) => {
    setTemplateToPromote(templateId)
    setPromotionResult(null)
    setPromoteDialogOpen(true)
  }

  const confirmPromote = async () => {
    if (!templateToPromote) return

    setIsPromoting(true)
    try {
      const result = await promoteToGlobalTemplate(templateToPromote)
      if (result.success) {
        toast.success(result.message || 'Template promoted to global successfully')
        setPromotionResult({
          filePath: result.filePath,
          instructions: result.instructions,
        })
        // Don't close dialog yet - show instructions
      } else {
        toast.error(result.message || 'Failed to promote template')
        setPromoteDialogOpen(false)
        setTemplateToPromote(null)
      }
    } catch (error) {
      toast.error('Failed to promote template')
      setPromoteDialogOpen(false)
      setTemplateToPromote(null)
    } finally {
      setIsPromoting(false)
    }
  }

  const closePromoteDialog = () => {
    setPromoteDialogOpen(false)
    setTemplateToPromote(null)
    setPromotionResult(null)
    fetchData() // Refresh to show updated data
  }

  const handleDelete = (templateId: string) => {
    setTemplateToDelete(templateId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteTemplate(templateToDelete)
      if (result.success) {
        toast.success(result.message || 'Template deleted successfully')
        fetchData()
      } else {
        toast.error(result.message || 'Failed to delete template')
      }
    } catch (error) {
      toast.error('Failed to delete template')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
    }
  }

  // Create columns with action handlers
  const actionHandlers: TemplateActionHandlers = useMemo(() => ({
    onDuplicate: handleDuplicate,
    onDuplicateGlobal: handleDuplicateGlobal,
    onPromoteToGlobal: handlePromoteToGlobal,
    onDelete: handleDelete,
  }), [])

  const tableColumns = useMemo(() => createColumns(actionHandlers), [actionHandlers])

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      {selectedTemplateIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            {selectedTemplateIds.length} template(s) selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => {
                // For bulk delete, we'd need additional logic
                if (selectedTemplateIds.length === 1) {
                  handleDelete(selectedTemplateIds[0])
                } else {
                  toast.info('Bulk delete coming soon')
                }
              }}
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

      {/* Source Filter Tabs */}
      <Tabs
        id="templates-source-tabs"
        value={sourceValue}
        onValueChange={handleSourceChange}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="local">My Templates</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="templates-search"
            name="templates-search"
            placeholder="Search templates..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 rounded-xl focus:border-primary/30 focus:ring-primary/20"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={categoryValue || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[140px] bg-background/50 border-border/50 rounded-xl">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="landing">Landing</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the template. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Promote to Global Dialog */}
      <AlertDialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {promotionResult ? 'Template Promoted Successfully!' : 'Promote to Global Template?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {promotionResult ? (
                <div className="space-y-4 mt-4">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    Your template has been exported to the codebase!
                  </p>
                  {promotionResult.filePath && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-mono">
                        {promotionResult.filePath}
                      </p>
                    </div>
                  )}
                  {promotionResult.instructions && promotionResult.instructions.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium">Next Steps:</p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {promotionResult.instructions.map((instruction, index) => (
                          <li key={index} className="ml-2">
                            {instruction.startsWith('git ') ? (
                              <code className="ml-2 bg-muted px-2 py-1 rounded">
                                {instruction}
                              </code>
                            ) : (
                              <span className="ml-2">{instruction}</span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ) : (
                'This will create a TypeScript file in lib/cms/templates/global/templates/ and make this template available to ALL 6 institutions. After promotion, you must commit and push the file to GitHub.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {promotionResult ? (
              <AlertDialogAction onClick={closePromoteDialog}>
                Done
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel disabled={isPromoting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmPromote}
                  disabled={isPromoting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isPromoting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Promote to Global
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
