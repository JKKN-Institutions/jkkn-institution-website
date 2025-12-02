'use client'

import { useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  COMPONENT_REGISTRY,
  getComponentsByCategory,
  searchComponents,
  type ComponentCategory,
} from '@/lib/cms/component-registry'
import {
  Search,
  LayoutGrid,
  Image as ImageIcon,
  Type,
  Database,
  GripVertical,
  Eye,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaletteItemProps {
  name: string
  displayName: string
  description?: string
  icon: string
  previewImage?: string
}

function PaletteItem({ name, displayName, description, icon, previewImage }: PaletteItemProps) {
  const [imageError, setImageError] = useState(false)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${name}`,
    data: {
      type: 'palette-item',
      componentName: name,
    },
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined

  // Get icon component from lucide-react safely
  const iconName = icon as keyof typeof LucideIcons
  const IconComponent = (LucideIcons[iconName] as LucideIcon) || Type

  const hasPreview = previewImage && !imageError

  const itemContent = (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-lg border border-border bg-card w-full min-w-0',
        'hover:border-primary/50 hover:bg-accent cursor-grab transition-all',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-primary'
      )}
    >
      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-md bg-muted">
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="font-medium text-sm text-foreground truncate">{displayName}</p>
        {description && (
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )

  // If preview image exists, wrap with tooltip
  if (hasPreview) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {itemContent}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="p-0 overflow-hidden bg-background border-2 border-primary/20 shadow-xl rounded-lg"
        >
          <div className="relative w-[320px] h-[240px] bg-muted">
            <Image
              src={previewImage}
              alt={`${displayName} preview`}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="320px"
            />
          </div>
          <div className="px-3 py-2 bg-background border-t border-border">
            <p className="font-medium text-sm">{displayName}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    )
  }

  return itemContent
}

const categoryIcons: Record<ComponentCategory, React.ComponentType<{ className?: string }>> = {
  content: Type,
  media: ImageIcon,
  layout: LayoutGrid,
  data: Database,
}

const categoryLabels: Record<ComponentCategory, string> = {
  content: 'Content',
  media: 'Media',
  layout: 'Layout',
  data: 'Data',
}

export function ComponentPalette() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all')

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    if (searchQuery) {
      return searchComponents(searchQuery)
    }

    if (activeCategory === 'all') {
      return Object.values(COMPONENT_REGISTRY)
    }

    return getComponentsByCategory(activeCategory)
  }, [searchQuery, activeCategory])

  // Group components by category for display
  const groupedComponents = useMemo(() => {
    if (searchQuery || activeCategory !== 'all') {
      return { [activeCategory]: filteredComponents }
    }

    const groups: Record<string, typeof filteredComponents> = {
      content: [],
      media: [],
      layout: [],
      data: [],
    }

    filteredComponents.forEach((comp) => {
      if (groups[comp.category]) {
        groups[comp.category].push(comp)
      }
    })

    return groups
  }, [filteredComponents, searchQuery, activeCategory])

  return (
    <TooltipProvider>
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="font-semibold text-foreground mb-3">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 h-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as ComponentCategory | 'all')}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-full justify-start px-3 py-2 h-auto bg-transparent gap-1 flex-shrink-0">
          <TabsTrigger
            value="all"
            className="text-xs px-2.5 py-1.5 data-[state=active]:bg-primary/10"
          >
            All
          </TabsTrigger>
          {(['content', 'media', 'layout'] as ComponentCategory[]).map((category) => {
            const Icon = categoryIcons[category]
            return (
              <Tooltip key={category}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={category}
                    className="text-xs px-2.5 py-1.5 data-[state=active]:bg-primary/10"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={4}>
                  {categoryLabels[category]}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TabsList>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 w-full overflow-hidden">
            {searchQuery ? (
              // Search results
              <div className="space-y-2 w-full">
                {filteredComponents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No components found for "{searchQuery}"
                  </p>
                ) : (
                  filteredComponents.map((comp) => (
                    <PaletteItem
                      key={comp.name}
                      name={comp.name}
                      displayName={comp.displayName}
                      description={comp.description}
                      icon={comp.icon}
                      previewImage={comp.previewImage}
                    />
                  ))
                )}
              </div>
            ) : activeCategory === 'all' ? (
              // All categories grouped
              <div className="space-y-6 w-full">
                {(['content', 'media', 'layout'] as ComponentCategory[]).map((category) => {
                  const components = groupedComponents[category] || []
                  if (components.length === 0) return null

                  const Icon = categoryIcons[category]

                  return (
                    <div key={category} className="w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {categoryLabels[category]}
                        </h3>
                      </div>
                      <div className="space-y-2 w-full">
                        {components.map((comp) => (
                          <PaletteItem
                            key={comp.name}
                            name={comp.name}
                            displayName={comp.displayName}
                            description={comp.description}
                            icon={comp.icon}
                            previewImage={comp.previewImage}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Single category
              <TabsContent value={activeCategory} className="mt-0 space-y-2 w-full">
                {filteredComponents.map((comp) => (
                  <PaletteItem
                    key={comp.name}
                    name={comp.name}
                    displayName={comp.displayName}
                    description={comp.description}
                    icon={comp.icon}
                    previewImage={comp.previewImage}
                  />
                ))}
              </TabsContent>
            )}
          </div>
        </ScrollArea>
      </Tabs>

      {/* Help text */}
      <div className="p-3 border-t border-border bg-muted/30 flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          Drag to add
        </p>
      </div>
    </div>
    </TooltipProvider>
  )
}
