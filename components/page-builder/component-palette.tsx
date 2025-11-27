'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronRight, GripVertical, Plus } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  COMPONENT_REGISTRY,
  getComponentsByCategory,
  getCategoryDisplayName,
  type ComponentCategory,
  type ComponentRegistryEntry,
} from '@/lib/cms/component-registry'
import { usePageBuilder } from './page-builder-context'

interface ComponentPaletteProps {
  className?: string
}

const CATEGORY_ICONS: Record<ComponentCategory, keyof typeof LucideIcons> = {
  content: 'Type',
  media: 'Image',
  layout: 'LayoutGrid',
  data: 'Database',
}

const CATEGORY_COLORS: Record<ComponentCategory, string> = {
  content: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  media: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  layout: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  data: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
}

export function ComponentPalette({ className }: ComponentPaletteProps) {
  const { addBlock } = usePageBuilder()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<ComponentCategory[]>([
    'content',
    'media',
    'layout',
  ])

  const categories: ComponentCategory[] = ['content', 'media', 'layout', 'data']

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return null

    const query = searchQuery.toLowerCase()
    return Object.values(COMPONENT_REGISTRY).filter((entry) => {
      const matchesName =
        entry.name.toLowerCase().includes(query) ||
        entry.displayName.toLowerCase().includes(query)
      const matchesDescription = entry.description?.toLowerCase().includes(query)
      const matchesKeywords = entry.keywords?.some((kw) =>
        kw.toLowerCase().includes(query)
      )
      return matchesName || matchesDescription || matchesKeywords
    })
  }, [searchQuery])

  const toggleCategory = (category: ComponentCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const handleAddComponent = (componentName: string) => {
    addBlock(componentName)
  }

  const getIcon = (iconName: string) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>
    return Icon || LucideIcons.Box
  }

  const ComponentItem = ({ entry }: { entry: ComponentRegistryEntry }) => {
    const Icon = getIcon(entry.icon)

    return (
      <button
        onClick={() => handleAddComponent(entry.name)}
        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group text-left"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('component', entry.name)
          e.dataTransfer.effectAllowed = 'copy'
        }}
      >
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {entry.displayName}
          </p>
          {entry.description && (
            <p className="text-xs text-muted-foreground truncate">
              {entry.description}
            </p>
          )}
        </div>
        <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    )
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Components */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {searchQuery && filteredComponents ? (
            // Search Results
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {filteredComponents.length} components found
              </p>
              <div className="space-y-1">
                {filteredComponents.map((entry) => (
                  <ComponentItem key={entry.name} entry={entry} />
                ))}
              </div>
            </div>
          ) : (
            // Category View
            categories.map((category) => {
              const components = getComponentsByCategory(category)
              if (components.length === 0) return null

              const isExpanded = expandedCategories.includes(category)
              const CategoryIcon = getIcon(CATEGORY_ICONS[category])

              return (
                <div key={category}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn('p-1.5 rounded-lg', CATEGORY_COLORS[category])}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-left">
                      {getCategoryDisplayName(category)}
                    </span>
                    <span className="text-xs text-muted-foreground mr-2">
                      {components.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 ml-2 space-y-1">
                      {components.map((entry) => (
                        <ComponentItem key={entry.name} entry={entry} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Quick Tips */}
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground">
          <strong>Tip:</strong> Drag components to the canvas or click to add at the end.
        </p>
      </div>
    </div>
  )
}
