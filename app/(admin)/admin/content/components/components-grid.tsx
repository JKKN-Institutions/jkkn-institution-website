'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Search,
  X,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  FolderInput,
  ExternalLink,
  RefreshCw,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComponentWithCollection } from '@/app/actions/cms/components'
import type { CollectionTreeNode } from '@/app/actions/cms/collections'
import type { ComponentCategory } from '@/lib/supabase/database.types'
import Link from 'next/link'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  deleteCustomComponent,
  duplicateComponent,
  toggleComponentActive,
  moveComponentToCollection,
  triggerPreviewGeneration,
} from '@/app/actions/cms/components'
import * as LucideIcons from 'lucide-react'

interface ComponentsGridProps {
  components: ComponentWithCollection[]
  total: number
  page: number
  limit: number
  totalPages: number
  search: string
  category: string
  collectionId: string
  viewMode: string
  selectMode?: boolean
  returnTo?: string
  collections: CollectionTreeNode[]
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'content', label: 'Content' },
  { value: 'media', label: 'Media' },
  { value: 'layout', label: 'Layout' },
  { value: 'data', label: 'Data' },
  { value: 'custom', label: 'Custom' },
]

const CATEGORY_COLORS: Record<string, string> = {
  content: 'bg-blue-500/10 text-blue-600 border-blue-200',
  media: 'bg-purple-500/10 text-purple-600 border-purple-200',
  layout: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  data: 'bg-amber-500/10 text-amber-600 border-amber-200',
  custom: 'bg-pink-500/10 text-pink-600 border-pink-200',
}

export function ComponentsGrid({
  components,
  total,
  page,
  limit,
  totalPages,
  search: initialSearch,
  category: initialCategory,
  collectionId,
  viewMode: initialViewMode,
  selectMode,
  returnTo,
  collections,
}: ComponentsGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [categoryValue, setCategoryValue] = useState(initialCategory)
  const [viewMode, setViewMode] = useState(initialViewMode)

  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; component: ComponentWithCollection | null }>({
    isOpen: false,
    component: null,
  })
  const [moveDialog, setMoveDialog] = useState<{ isOpen: boolean; component: ComponentWithCollection | null }>({
    isOpen: false,
    component: null,
  })
  const [selectedMoveCollection, setSelectedMoveCollection] = useState<string>('')

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

      router.push(`/admin/content/components?${newParams.toString()}`)
    },
    [router, searchParams]
  )

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== initialSearch) {
        startTransition(() => {
          updateUrlParams({ search: searchValue, page: 1 })
        })
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue, initialSearch, updateUrlParams])

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value)
    startTransition(() => {
      updateUrlParams({ category: value, page: 1 })
    })
  }

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode)
    startTransition(() => {
      updateUrlParams({ view: mode })
    })
  }

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      updateUrlParams({ page: newPage })
    })
  }

  const clearFilters = () => {
    setSearchValue('')
    setCategoryValue('')
    router.push('/admin/content/components')
  }

  const hasFilters = searchValue || categoryValue

  // Action handlers
  const handleDelete = async () => {
    if (!deleteDialog.component) return

    const result = await deleteCustomComponent(deleteDialog.component.id)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
    setDeleteDialog({ isOpen: false, component: null })
  }

  const handleDuplicate = async (component: ComponentWithCollection) => {
    const result = await duplicateComponent(component.id)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleToggleActive = async (component: ComponentWithCollection) => {
    const result = await toggleComponentActive(component.id, !component.is_active)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleMove = async () => {
    if (!moveDialog.component) return

    const result = await moveComponentToCollection(
      moveDialog.component.id,
      selectedMoveCollection || null
    )
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
    setMoveDialog({ isOpen: false, component: null })
    setSelectedMoveCollection('')
  }

  const handleRegeneratePreview = async (component: ComponentWithCollection) => {
    const result = await triggerPreviewGeneration(component.id)
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }

  const handleSelectComponent = (component: ComponentWithCollection) => {
    if (selectMode && returnTo) {
      // Navigate back to the page editor with the selected component
      router.push(`/admin/content/pages/${returnTo}/edit?addComponent=${component.name}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 pr-9 rounded-xl"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <Select value={categoryValue || 'all'} onValueChange={(v) => handleCategoryChange(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-40 rounded-xl hidden sm:flex">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hidden sm:flex"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 border rounded-xl p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleViewModeChange('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handleViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {total} component{total !== 1 ? 's' : ''} found
      </div>

      {/* Components Display */}
      {components.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No components found</h3>
          <p className="text-muted-foreground mb-4">
            {hasFilters
              ? 'Try adjusting your filters or search term'
              : 'Get started by adding your first component'}
          </p>
          {!selectMode && (
            <Button asChild>
              <Link href="/admin/content/components/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Component
              </Link>
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {components.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              selectMode={selectMode}
              onSelect={handleSelectComponent}
              onDelete={() => setDeleteDialog({ isOpen: true, component })}
              onDuplicate={() => handleDuplicate(component)}
              onToggleActive={() => handleToggleActive(component)}
              onMove={() => setMoveDialog({ isOpen: true, component })}
              onRegeneratePreview={() => handleRegeneratePreview(component)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {components.map((component) => (
            <ComponentListItem
              key={component.id}
              component={component}
              selectMode={selectMode}
              onSelect={handleSelectComponent}
              onDelete={() => setDeleteDialog({ isOpen: true, component })}
              onDuplicate={() => handleDuplicate(component)}
              onToggleActive={() => handleToggleActive(component)}
              onMove={() => setMoveDialog({ isOpen: true, component })}
              onRegeneratePreview={() => handleRegeneratePreview(component)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1 || isPending}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages || isPending}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, component: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Component</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.component?.display_name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false, component: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={moveDialog.isOpen} onOpenChange={(open) => !open && setMoveDialog({ isOpen: false, component: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Component</DialogTitle>
            <DialogDescription>
              Select a collection to move &quot;{moveDialog.component?.display_name}&quot; to.
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedMoveCollection} onValueChange={setSelectedMoveCollection}>
            <SelectTrigger>
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Uncategorized</SelectItem>
              {flattenCollections(collections).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialog({ isOpen: false, component: null })}>
              Cancel
            </Button>
            <Button onClick={handleMove}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ComponentCardProps {
  component: ComponentWithCollection
  selectMode?: boolean
  onSelect: (component: ComponentWithCollection) => void
  onDelete: () => void
  onDuplicate: () => void
  onToggleActive: () => void
  onMove: () => void
  onRegeneratePreview: () => void
}

function ComponentCard({
  component,
  selectMode,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleActive,
  onMove,
  onRegeneratePreview,
}: ComponentCardProps) {
  const IconComponent = component.icon
    ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[component.icon] ||
      LucideIcons.Puzzle
    : LucideIcons.Puzzle

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-border/50 bg-card/50 overflow-hidden transition-all',
        'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
        !component.is_active && 'opacity-60',
        selectMode && 'cursor-pointer'
      )}
      onClick={() => selectMode && onSelect(component)}
    >
      {/* Preview Image */}
      <div className="relative aspect-[16/10] bg-muted/30">
        {component.preview_image ? (
          <Image
            src={component.preview_image}
            alt={component.display_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Preview Status Badge */}
        {component.preview_status === 'pending' && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
              Generating...
            </Badge>
          </div>
        )}

        {/* Actions Overlay */}
        {!selectMode && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button variant="secondary" size="icon" className="h-7 w-7" asChild>
                <Link href={`/admin/content/components/${component.id}/edit`}>
                  <Edit className="h-3 w-3" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onMove}>
                    <FolderInput className="mr-2 h-4 w-4" />
                    Move to Collection
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onToggleActive}>
                    {component.is_active ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onRegeneratePreview}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Preview
                  </DropdownMenuItem>
                  {component.source_url && (
                    <DropdownMenuItem asChild>
                      <a href={component.source_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Source
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate">{component.display_name}</h4>
            <p className="text-xs text-muted-foreground truncate">{component.name}</p>
          </div>
          <Badge
            variant="outline"
            className={cn('text-[10px] flex-shrink-0', CATEGORY_COLORS[component.category])}
          >
            {component.category}
          </Badge>
        </div>

        {component.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{component.description}</p>
        )}

        {/* Source Badge */}
        {component.source_type !== 'manual' && (
          <Badge variant="secondary" className="text-[10px]">
            {component.source_registry || component.source_type}
          </Badge>
        )}
      </div>
    </div>
  )
}

function ComponentListItem({
  component,
  selectMode,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleActive,
  onMove,
  onRegeneratePreview,
}: ComponentCardProps) {
  const IconComponent = component.icon
    ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[component.icon] ||
      LucideIcons.Puzzle
    : LucideIcons.Puzzle

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card/50 transition-all',
        'hover:border-primary/50 hover:bg-card',
        !component.is_active && 'opacity-60',
        selectMode && 'cursor-pointer'
      )}
      onClick={() => selectMode && onSelect(component)}
    >
      {/* Preview/Icon */}
      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
        {component.preview_image ? (
          <Image
            src={component.preview_image}
            alt={component.display_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">{component.display_name}</h4>
          {!component.is_active && (
            <Badge variant="secondary" className="text-[10px]">
              Inactive
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {component.name}
          {component.cms_component_collections && (
            <> &middot; {component.cms_component_collections.name}</>
          )}
        </p>
      </div>

      {/* Category Badge */}
      <Badge
        variant="outline"
        className={cn('text-[10px] hidden sm:flex', CATEGORY_COLORS[component.category])}
      >
        {component.category}
      </Badge>

      {/* Actions */}
      {!selectMode && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/admin/content/components/${component.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onMove}>
                <FolderInput className="mr-2 h-4 w-4" />
                Move to Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleActive}>
                {component.is_active ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRegeneratePreview}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

/**
 * Flatten collection tree for select options
 */
function flattenCollections(
  collections: CollectionTreeNode[],
  prefix = ''
): Array<{ id: string; name: string }> {
  const result: Array<{ id: string; name: string }> = []

  for (const collection of collections) {
    result.push({
      id: collection.id,
      name: prefix ? `${prefix} / ${collection.name}` : collection.name,
    })

    if (collection.children && collection.children.length > 0) {
      result.push(...flattenCollections(collection.children, prefix ? `${prefix} / ${collection.name}` : collection.name))
    }
  }

  return result
}
