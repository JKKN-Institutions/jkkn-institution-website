'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search, Filter, Edit, Trash2, Eye, EyeOff, Loader2, MoreVertical, Plus,
  Heart, Camera, Users, Trophy, Music, Book, Coffee, Dumbbell, Palette, Globe, Microscope, Utensils, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  getLifeAtJKKNItems,
  getLifeAtJKKNCategories,
  deleteLifeAtJKKNItem,
  toggleLifeAtJKKNItemStatus,
  bulkDeleteLifeAtJKKNItems,
  type LifeAtJKKNItem,
} from '@/app/actions/cms/life-at-jkkn'
import type { BlogCategory } from '@/app/actions/cms/blog-categories'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Heart, Camera, Users, Trophy, Music, Book, Coffee, Dumbbell, Palette, Globe, Microscope, Utensils, Calendar
}

interface LifeAtJKKNCardsProps {
  initialData?: {
    data: LifeAtJKKNItem[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function LifeAtJKKNCards({ initialData }: LifeAtJKKNCardsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State
  const [items, setItems] = useState<LifeAtJKKNItem[]>(initialData?.data || [])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [total, setTotal] = useState(initialData?.total || 0)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [deleteItem, setDeleteItem] = useState<LifeAtJKKNItem | null>(null)
  const [showBulkDelete, setShowBulkDelete] = useState(false)

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all')

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [itemsResult, categoriesResult] = await Promise.all([
        getLifeAtJKKNItems({
          page: 1,
          limit: 50,
          status: statusFilter !== 'all' ? (statusFilter as 'draft' | 'published') : undefined,
          category_id: categoryFilter !== 'all' ? categoryFilter : undefined,
          search: search || undefined,
        }),
        getLifeAtJKKNCategories({ includeInactive: true }),
      ])
      setItems(itemsResult.data)
      setTotal(itemsResult.total)
      setCategories(categoriesResult)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter, categoryFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch categories on mount
  useEffect(() => {
    getLifeAtJKKNCategories({ includeInactive: true }).then(setCategories)
  }, [])

  // Handle delete
  const handleDelete = async () => {
    if (!deleteItem) return

    startTransition(async () => {
      const result = await deleteLifeAtJKKNItem(deleteItem.id)
      if (result.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message)
      }
      setDeleteItem(null)
    })
  }

  // Handle toggle status
  const handleToggleStatus = async (item: LifeAtJKKNItem) => {
    startTransition(async () => {
      const result = await toggleLifeAtJKKNItemStatus(item.id)
      if (result.success) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message)
      }
    })
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    startTransition(async () => {
      const result = await bulkDeleteLifeAtJKKNItems(selectedItems)
      if (result.success) {
        toast.success(result.message)
        setSelectedItems([])
        fetchData()
      } else {
        toast.error(result.message)
      }
      setShowBulkDelete(false)
    })
  }

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Select all
  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((i) => i.id))
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
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
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDelete(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Select All */}
      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedItems.length === items.length && items.length > 0}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            Select all ({total} items)
          </span>
        </div>
      )}

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Life@JKKN cards yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first campus life card
          </p>
          <Button asChild>
            <Link href="/admin/content/blog/life-at-jkkn/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Card
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <LifeAtJKKNCard
              key={item.id}
              item={item}
              selected={selectedItems.includes(item.id)}
              onSelect={() => toggleSelection(item.id)}
              onEdit={() => router.push(`/admin/content/blog/life-at-jkkn/${item.id}/edit`)}
              onDelete={() => setDeleteItem(item)}
              onToggleStatus={() => handleToggleStatus(item)}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteItem?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItems.length} Cards</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} selected cards? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Individual Card Component
function LifeAtJKKNCard({
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus,
  isPending,
}: {
  item: LifeAtJKKNItem
  selected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleStatus: () => void
  isPending: boolean
}) {
  const IconComponent = item.icon ? iconMap[item.icon] || Heart : Heart

  return (
    <div
      className={cn(
        'group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300',
        'border border-border/50',
        selected && 'ring-2 ring-primary'
      )}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-20">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          className="bg-white/80 backdrop-blur-sm border-white"
        />
      </div>

      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        {item.featured_image ? (
          <Image
            src={item.featured_image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-primary-dark">
            <IconComponent className="w-16 h-16 text-white/30" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(11, 109, 65, 0.9) 0%, rgba(11, 109, 65, 0.4) 50%, transparent 100%)'
          }}
        />

        {/* Category Badge */}
        {item.category && (
          <div
            className="absolute top-3 left-12 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg"
            style={{ backgroundColor: item.category.color || 'rgba(255, 222, 89, 0.9)' }}
          >
            <span className="text-gray-800">{item.category.name}</span>
          </div>
        )}

        {/* Icon Badge */}
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-lg">
          <IconComponent className="w-5 h-5 text-brand-primary" />
        </div>

        {/* Status Badge */}
        <Badge
          variant={item.status === 'published' ? 'default' : 'secondary'}
          className="absolute bottom-16 right-3"
        >
          {item.status === 'published' ? 'Published' : 'Draft'}
        </Badge>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
          {item.excerpt && (
            <p className="text-sm text-white/90 line-clamp-2">{item.excerpt}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleStatus}
            disabled={isPending}
          >
            {item.status === 'published' ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Publish
              </>
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Card
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleStatus}>
              {item.status === 'published' ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
