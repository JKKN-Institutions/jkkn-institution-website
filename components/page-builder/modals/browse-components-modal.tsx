'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Search, Loader2, Check, X, Type, Image as ImageIcon, LayoutGrid, Database, Puzzle, Component, ChevronRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  COMPONENT_REGISTRY,
  getComponentsByCategory,
  searchComponents,
  type ComponentCategory,
  type ComponentRegistryEntry,
} from '@/lib/cms/component-registry'
import { SHADCN_COMPONENTS, type ShadcnSubcategory } from '@/lib/cms/shadcn-components-registry'
import { usePageBuilder } from '@/components/page-builder/page-builder-provider'
import { toast } from 'sonner'

// ==========================================
// Types
// ==========================================

type BrowseCategory = 'all' | ComponentCategory | 'custom' | 'shadcn'
type ShadcnSubcategoryFilter = ShadcnSubcategory | 'all'

interface BrowseComponentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ==========================================
// Category Configuration
// ==========================================

const CATEGORY_CONFIG: Record<BrowseCategory, {
  label: string
  icon: LucideIcon
  description: string
  color: string
}> = {
  all: {
    label: 'All Components',
    icon: LayoutGrid,
    description: 'Browse all available components',
    color: 'bg-slate-500/10 text-slate-600 border-slate-200'
  },
  content: {
    label: 'Content',
    icon: Type,
    description: 'Text, headings, and content blocks',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200'
  },
  media: {
    label: 'Media',
    icon: ImageIcon,
    description: 'Images, videos, and galleries',
    color: 'bg-purple-500/10 text-purple-600 border-purple-200'
  },
  layout: {
    label: 'Layout',
    icon: LayoutGrid,
    description: 'Containers, grids, and spacing',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
  },
  data: {
    label: 'Data',
    icon: Database,
    description: 'Dynamic data displays',
    color: 'bg-amber-500/10 text-amber-600 border-amber-200'
  },
  custom: {
    label: 'Custom',
    icon: Puzzle,
    description: 'User-created components',
    color: 'bg-pink-500/10 text-pink-600 border-pink-200'
  },
  shadcn: {
    label: 'shadcn/ui',
    icon: Component,
    description: 'UI primitives from shadcn',
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
  },
}

const SHADCN_SUBCATEGORY_LABELS: Record<ShadcnSubcategory, string> = {
  form: 'Form',
  display: 'Display',
  navigation: 'Navigation',
  feedback: 'Feedback',
  data: 'Data',
  layout: 'Layout',
}

// ==========================================
// Component Card
// ==========================================

interface ComponentCardProps {
  name: string
  displayName: string
  description?: string
  icon: string
  previewImage?: string
  category: string
  source: 'builtin' | 'custom' | 'shadcn'
  isSelected: boolean
  onClick: () => void
}

function ComponentCard({
  name,
  displayName,
  description,
  icon,
  previewImage,
  category,
  source,
  isSelected,
  onClick,
}: ComponentCardProps) {
  const [imageError, setImageError] = useState(false)

  // Get icon component from lucide-react safely
  const iconName = icon as keyof typeof LucideIcons
  const IconComponent = (LucideIcons[iconName] as LucideIcon) || Type

  const categoryConfig = CATEGORY_CONFIG[category as BrowseCategory] || CATEGORY_CONFIG.custom

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex flex-col rounded-lg border-2 overflow-hidden transition-all text-left w-full',
        isSelected
          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
          : 'border-border hover:border-primary/50 hover:shadow-md bg-card'
      )}
    >
      {/* Preview Image / Icon */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {previewImage && !imageError ? (
          <Image
            src={previewImage}
            alt={`${displayName} preview`}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <IconComponent className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-primary rounded-full p-1.5">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        )}

        {/* Source badge */}
        {source === 'shadcn' && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-indigo-500/90 text-white border-0"
          >
            shadcn
          </Badge>
        )}
        {source === 'custom' && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-pink-500/90 text-white border-0"
          >
            Custom
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5 flex-1">
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-sm truncate">{displayName}</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
        <Badge
          variant="outline"
          className={cn('text-[10px] px-1.5 py-0', categoryConfig.color)}
        >
          {categoryConfig.label}
        </Badge>
      </div>
    </button>
  )
}

// ==========================================
// Main Modal Component
// ==========================================

export function BrowseComponentsModal({
  open,
  onOpenChange,
}: BrowseComponentsModalProps) {
  const { addBlock } = usePageBuilder()

  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<BrowseCategory>('all')
  const [selectedShadcnSubcategory, setSelectedShadcnSubcategory] = useState<ShadcnSubcategoryFilter>('all')
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setSelectedCategory('all')
      setSelectedShadcnSubcategory('all')
      setSelectedComponent(null)
      setIsAdding(false)
    }
  }, [open])

  // Get all components based on filters
  const filteredComponents = useMemo(() => {
    const results: {
      name: string
      displayName: string
      description?: string
      icon: string
      previewImage?: string
      category: string
      source: 'builtin' | 'custom' | 'shadcn'
    }[] = []

    // Built-in components
    if (selectedCategory === 'all' || (selectedCategory !== 'custom' && selectedCategory !== 'shadcn')) {
      const builtinComponents = searchQuery
        ? searchComponents(searchQuery)
        : selectedCategory === 'all'
          ? Object.values(COMPONENT_REGISTRY)
          : getComponentsByCategory(selectedCategory as ComponentCategory)

      builtinComponents.forEach((comp) => {
        results.push({
          name: comp.name,
          displayName: comp.displayName,
          description: comp.description,
          icon: comp.icon,
          previewImage: comp.previewImage,
          category: comp.category,
          source: 'builtin',
        })
      })
    }

    // shadcn components
    if (selectedCategory === 'all' || selectedCategory === 'shadcn') {
      Object.values(SHADCN_COMPONENTS).forEach((comp) => {
        // Filter by subcategory if on shadcn tab
        if (selectedCategory === 'shadcn' && selectedShadcnSubcategory !== 'all') {
          if (comp.subcategory !== selectedShadcnSubcategory) return
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          const matchesName = comp.name.toLowerCase().includes(query) ||
            comp.displayName.toLowerCase().includes(query)
          const matchesDescription = comp.description?.toLowerCase().includes(query)
          const matchesKeywords = comp.keywords?.some((kw) => kw.toLowerCase().includes(query))
          if (!matchesName && !matchesDescription && !matchesKeywords) return
        }

        results.push({
          name: comp.name,
          displayName: comp.displayName,
          description: comp.description,
          icon: comp.icon,
          previewImage: comp.previewImage,
          category: 'shadcn',
          source: 'shadcn',
        })
      })
    }

    // Sort alphabetically by display name
    return results.sort((a, b) => a.displayName.localeCompare(b.displayName))
  }, [searchQuery, selectedCategory, selectedShadcnSubcategory])

  // Count components per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: Object.keys(COMPONENT_REGISTRY).length + Object.keys(SHADCN_COMPONENTS).length,
      content: getComponentsByCategory('content').length,
      media: getComponentsByCategory('media').length,
      layout: getComponentsByCategory('layout').length,
      data: getComponentsByCategory('data').length,
      custom: 0, // TODO: Get from custom registry
      shadcn: Object.keys(SHADCN_COMPONENTS).length,
    }
    return counts
  }, [])

  // Count shadcn subcategories
  const shadcnSubcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: Object.keys(SHADCN_COMPONENTS).length }
    Object.values(SHADCN_COMPONENTS).forEach((comp) => {
      counts[comp.subcategory] = (counts[comp.subcategory] || 0) + 1
    })
    return counts
  }, [])

  // Handle component selection
  const handleSelectComponent = (componentName: string) => {
    setSelectedComponent(componentName === selectedComponent ? null : componentName)
  }

  // Handle adding component
  const handleAddComponent = async () => {
    if (!selectedComponent) return

    setIsAdding(true)
    try {
      addBlock(selectedComponent)
      toast.success(`Added ${selectedComponent} to page`)
      onOpenChange(false)
    } catch (error) {
      console.error('Error adding component:', error)
      toast.error('Failed to add component')
    } finally {
      setIsAdding(false)
    }
  }

  // Handle double-click to add directly
  const handleDoubleClick = (componentName: string) => {
    addBlock(componentName)
    toast.success(`Added ${componentName} to page`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Browse Component Library
          </DialogTitle>
          <DialogDescription>
            Select a component to add to your page. Double-click to add immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r bg-muted/30 flex-shrink-0 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-1">
                {/* Main categories */}
                {(['all', 'content', 'media', 'layout', 'data'] as BrowseCategory[]).map((category) => {
                  const config = CATEGORY_CONFIG[category]
                  const Icon = config.icon
                  const isActive = selectedCategory === category

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category)
                        setSelectedShadcnSubcategory('all')
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left truncate">{config.label}</span>
                      <span className="text-xs opacity-60">{categoryCounts[category]}</span>
                    </button>
                  )
                })}

                {/* Separator */}
                <div className="py-2">
                  <div className="border-t border-border" />
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mt-3 mb-1 px-3">
                    Libraries
                  </span>
                </div>

                {/* shadcn category */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('shadcn')
                      setSelectedShadcnSubcategory('all')
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                      selectedCategory === 'shadcn'
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Component className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">shadcn/ui</span>
                    <span className="text-xs opacity-60">{categoryCounts.shadcn}</span>
                    {selectedCategory === 'shadcn' && (
                      <ChevronRight className="h-3 w-3 rotate-90" />
                    )}
                  </button>

                  {/* shadcn subcategories */}
                  {selectedCategory === 'shadcn' && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {(['all', 'form', 'display', 'navigation', 'feedback', 'data', 'layout'] as ShadcnSubcategoryFilter[]).map((sub) => {
                        const isActive = selectedShadcnSubcategory === sub
                        const label = sub === 'all' ? 'All' : SHADCN_SUBCATEGORY_LABELS[sub as ShadcnSubcategory]
                        const count = shadcnSubcategoryCounts[sub] || 0

                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => setSelectedShadcnSubcategory(sub)}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors',
                              isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          >
                            <span className="flex-1 text-left">{label}</span>
                            <span className="opacity-60">{count}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Custom category */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('custom')
                    setSelectedShadcnSubcategory('all')
                  }}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                    selectedCategory === 'custom'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Puzzle className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">Custom</span>
                  <span className="text-xs opacity-60">{categoryCounts.custom}</span>
                </button>
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Component Grid */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {filteredComponents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <LayoutGrid className="h-12 w-12 mb-4 opacity-40" />
                    <p className="text-lg font-medium">No components found</p>
                    <p className="text-sm">
                      {searchQuery
                        ? `No results for "${searchQuery}"`
                        : 'No components in this category'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredComponents.map((comp) => (
                      <ComponentCard
                        key={`${comp.source}-${comp.name}`}
                        name={comp.name}
                        displayName={comp.displayName}
                        description={comp.description}
                        icon={comp.icon}
                        previewImage={comp.previewImage}
                        category={comp.category}
                        source={comp.source}
                        isSelected={selectedComponent === comp.name}
                        onClick={() => handleSelectComponent(comp.name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30 flex items-center justify-between flex-shrink-0">
              <div className="text-sm text-muted-foreground">
                {selectedComponent ? (
                  <span>
                    Selected: <strong className="text-foreground">{selectedComponent}</strong>
                  </span>
                ) : (
                  <span>{filteredComponents.length} components available</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isAdding}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddComponent}
                  disabled={!selectedComponent || isAdding}
                >
                  {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Component
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
