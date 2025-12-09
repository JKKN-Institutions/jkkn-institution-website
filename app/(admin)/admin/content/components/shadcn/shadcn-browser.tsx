'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Search,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'
import type { CategorizedComponent, ComponentCategory } from './categories'
import { CATEGORIES } from './categories'
import { getIconComponent } from './icon-resolver'
import { ShadcnComponentCard } from './shadcn-component-card'
import { ShadcnComponentDetail } from './shadcn-component-detail'

interface ShadcnBrowserProps {
  components: CategorizedComponent[]
}

const ITEMS_PER_PAGE = 24

export function ShadcnBrowser({ components }: ShadcnBrowserProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [selectedComponent, setSelectedComponent] =
    useState<CategorizedComponent | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const category of CATEGORIES) {
      counts.set(category.id, 0)
    }
    for (const component of components) {
      const count = counts.get(component.category.id) || 0
      counts.set(component.category.id, count + 1)
    }
    return counts
  }, [components])

  // Filter components
  const filteredComponents = useMemo(() => {
    let filtered = components

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category.id === selectedCategory)
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.displayName.toLowerCase().includes(searchLower) ||
          c.category.name.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [components, selectedCategory, search])

  // Pagination
  const totalPages = Math.ceil(filteredComponents.length / ITEMS_PER_PAGE)
  const paginatedComponents = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredComponents.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredComponents, page])

  // Reset page when filters change
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleComponentClick = (component: CategorizedComponent) => {
    setSelectedComponent(component)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-3">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(null)}
            className="flex-shrink-0"
          >
            <Package className="h-4 w-4 mr-2" />
            All
            <Badge variant="secondary" className="ml-2 text-xs">
              {components.length}
            </Badge>
          </Button>
          {CATEGORIES.map((category) => {
            const count = categoryCounts.get(category.id) || 0
            if (count === 0) return null

            const Icon = getIconComponent(category.iconName)
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
                className="flex-shrink-0"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {count}
                </Badge>
              </Button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedComponents.length} of {filteredComponents.length}{' '}
        components
        {selectedCategory && (
          <span>
            {' '}
            in{' '}
            <Badge variant="outline" className="ml-1">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </Badge>
          </span>
        )}
      </div>

      {/* Components Grid/List */}
      {paginatedComponents.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No components found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedComponents.map((component) => (
            <ShadcnComponentCard
              key={component.name}
              component={component}
              viewMode={viewMode}
              onClick={() => handleComponentClick(component)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card divide-y">
          {paginatedComponents.map((component) => (
            <ShadcnComponentCard
              key={component.name}
              component={component}
              viewMode={viewMode}
              onClick={() => handleComponentClick(component)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setPage(pageNum)}
                    className="w-8 h-8"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Component Detail Sheet */}
      <ShadcnComponentDetail
        component={selectedComponent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
