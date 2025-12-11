'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileText, ChevronRight, FolderTree } from 'lucide-react'
import { cn } from '@/lib/utils'
import { reorderPages } from '@/app/actions/cms/pages'
import { toast } from 'sonner'

interface PageItem {
  id: string
  title: string
  slug: string
  status: string
  sort_order: number | null
  parent_id?: string | null
}

interface ReorderPagesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pages: PageItem[]
  isLoading?: boolean
  onReorderComplete: () => void
}

export function ReorderPagesModal({
  open,
  onOpenChange,
  pages: initialPages,
  isLoading = false,
  onReorderComplete,
}: ReorderPagesModalProps) {
  const [pages, setPages] = useState<PageItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Build hierarchical structure
  const { parentPages, childrenMap, parentOrderMap } = useMemo(() => {
    const parents: PageItem[] = []
    const children: Map<string, PageItem[]> = new Map()
    const orderMap: Map<string, number> = new Map()

    // Separate parents and children
    initialPages.forEach(page => {
      if (!page.parent_id) {
        parents.push(page)
      } else {
        const existing = children.get(page.parent_id) || []
        existing.push(page)
        children.set(page.parent_id, existing)
      }
    })

    // Sort parents by sort_order
    parents.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))

    // Build order map for parents (1, 2, 3...)
    parents.forEach((p, idx) => {
      orderMap.set(p.id, p.sort_order ?? (idx + 1))
    })

    // Sort children within each parent
    children.forEach((childList, parentId) => {
      childList.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    })

    return { parentPages: parents, childrenMap: children, parentOrderMap: orderMap }
  }, [initialPages])

  // Check if we have any hierarchy
  const hasHierarchy = childrenMap.size > 0

  // Reset pages when modal opens with new data
  useEffect(() => {
    if (open) {
      setPages([...initialPages])
      setHasChanges(false)
    }
  }, [open, initialPages])

  const getStatusColor = (status: string) => {
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
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOrderChange = (pageId: string, newOrder: string) => {
    const orderNum = parseInt(newOrder, 10)
    if (isNaN(orderNum) && newOrder !== '') return

    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? { ...page, sort_order: newOrder === '' ? null : orderNum }
          : page
      )
    )
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const pageOrders = pages.map((page) => ({
        id: page.id,
        sort_order: page.sort_order ?? 1,
        parent_id: page.parent_id || null,
      }))

      const result = await reorderPages(pageOrders)

      if (result.success) {
        toast.success('Page order saved successfully')
        setHasChanges(false)
        onReorderComplete()
        onOpenChange(false)
      } else {
        toast.error(result.message || 'Failed to save page order')
      }
    } catch (error) {
      toast.error('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setHasChanges(false)
    onOpenChange(false)
  }

  // Get current page data from state
  const getPage = (id: string) => pages.find(p => p.id === id)

  // Render a single page row
  const renderPageRow = (page: PageItem, parentOrder?: number, isChild: boolean = false) => {
    const currentPage = getPage(page.id) || page
    const displayOrder = currentPage.sort_order ?? ''

    return (
      <div
        key={page.id}
        className={cn(
          "flex items-center gap-3 p-3 bg-background border rounded-lg hover:border-primary/50 transition-colors",
          isChild && "ml-6 border-l-2 border-l-primary/30"
        )}
      >
        {/* Hierarchical order display */}
        <div className="flex items-center gap-0.5 min-w-[80px]">
          {isChild && parentOrder !== undefined && (
            <span className="text-sm text-primary font-semibold">
              {parentOrder}.
            </span>
          )}
          <Input
            id={`page-order-${page.id}`}
            name={`page-order-${page.id}`}
            type="number"
            min="1"
            value={displayOrder}
            onChange={(e) => handleOrderChange(page.id, e.target.value)}
            className={cn("text-center font-medium", isChild ? "w-12" : "w-14")}
            placeholder="1"
          />
        </div>
        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{page.title}</p>
            {!isChild && childrenMap.has(page.id) && (
              <Badge variant="outline" className="text-xs">
                <FolderTree className="h-3 w-3 mr-1" />
                {childrenMap.get(page.id)?.length} subpages
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">/{page.slug}</p>
        </div>
        <Badge variant="secondary" className={cn('text-xs flex-shrink-0', getStatusColor(page.status))}>
          {page.status}
        </Badge>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Set Page Order</DialogTitle>
          <DialogDescription>
            {hasHierarchy ? (
              <span className="flex items-center gap-1 flex-wrap">
                Enter order numbers (1, 2, 3...). Subpages shown as
                <Badge variant="outline" className="mx-1">Parent.Child</Badge>
                format (e.g., 1.1, 1.2)
              </span>
            ) : (
              <>Enter order numbers (1, 2, 3...) for each page. Lower numbers appear first.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading pages...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Render parent pages with their children nested below */}
              {parentPages.map((parent) => {
                const currentParent = getPage(parent.id) || parent
                const parentOrder = currentParent.sort_order ?? 1
                const children = childrenMap.get(parent.id) || []

                return (
                  <div key={parent.id} className="space-y-2">
                    {/* Parent page */}
                    {renderPageRow(parent, undefined, false)}

                    {/* Child pages */}
                    {children.map((child) => renderPageRow(child, parentOrder, true))}
                  </div>
                )
              })}

              {/* If there are pages without parents that aren't in parentPages (orphans) */}
              {initialPages
                .filter(p => p.parent_id && !parentPages.some(pp => pp.id === p.parent_id))
                .map(orphan => renderPageRow(orphan, undefined, false))}

              {pages.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  No pages to reorder
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
