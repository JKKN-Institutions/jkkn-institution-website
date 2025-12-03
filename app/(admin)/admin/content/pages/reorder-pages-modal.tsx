'use client'

import { useState, useEffect } from 'react'
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
import { Loader2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { reorderPages } from '@/app/actions/cms/pages'
import { toast } from 'sonner'

interface PageItem {
  id: string
  title: string
  slug: string
  status: string
  sort_order: number | null
}

interface ReorderPagesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pages: PageItem[]
  onReorderComplete: () => void
}

export function ReorderPagesModal({
  open,
  onOpenChange,
  pages: initialPages,
  onReorderComplete,
}: ReorderPagesModalProps) {
  const [pages, setPages] = useState<PageItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Reset pages when modal opens with new data
  useEffect(() => {
    if (open) {
      // Sort by current sort_order, then by title
      const sorted = [...initialPages].sort((a, b) => {
        const orderA = a.sort_order ?? 999
        const orderB = b.sort_order ?? 999
        if (orderA !== orderB) return orderA - orderB
        return a.title.localeCompare(b.title)
      })
      setPages(sorted)
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
        sort_order: page.sort_order ?? 0,
        parent_id: null,
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

  // Sort pages by their current order for display
  const sortedPages = [...pages].sort((a, b) => {
    const orderA = a.sort_order ?? 999
    const orderB = b.sort_order ?? 999
    return orderA - orderB
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Set Page Order</DialogTitle>
          <DialogDescription>
            Enter the order number (0, 1, 2, 3...) for each page. Lower numbers appear first in navigation.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2">
            {sortedPages.map((page) => (
              <div
                key={page.id}
                className="flex items-center gap-3 p-3 bg-background border rounded-lg"
              >
                <Input
                  type="number"
                  min="0"
                  value={page.sort_order ?? ''}
                  onChange={(e) => handleOrderChange(page.id, e.target.value)}
                  className="w-16 text-center"
                  placeholder="0"
                />
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{page.title}</p>
                  <p className="text-xs text-muted-foreground truncate">/{page.slug}</p>
                </div>
                <Badge variant="secondary" className={cn('text-xs flex-shrink-0', getStatusColor(page.status))}>
                  {page.status}
                </Badge>
              </div>
            ))}
          </div>

          {pages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No pages to reorder
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
