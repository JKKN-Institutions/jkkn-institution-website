'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
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
  registerCustomComponents,
  clearCustomComponentRegistry,
  type ComponentCategory,
  type CustomComponentData,
} from '@/lib/cms/component-registry'
import {
  Search,
  LayoutGrid,
  Image as ImageIcon,
  Type,
  Database,
  GripVertical,
  Puzzle,
  Library,
  Component,
  GraduationCap,
  List,
  Grid3X3,
} from 'lucide-react'
import { BrowseComponentsModal } from '@/components/page-builder/modals/browse-components-modal'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface PaletteItemProps {
  name: string
  displayName: string
  description?: string
  icon: string
  previewImage?: string
}

function PaletteItem({ name, displayName, description, icon, previewImage }: PaletteItemProps) {
  const [imageError, setImageError] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // Handle mouse enter with delay (to avoid showing tooltip when quickly moving through items)
  const handleMouseEnter = () => {
    if (hasPreview && !isDragging) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsTooltipOpen(true)
      }, 300)
    }
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsTooltipOpen(false)
  }

  // Close tooltip when dragging starts
  useEffect(() => {
    if (isDragging) {
      setIsTooltipOpen(false)
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }
  }, [isDragging])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  // Create draggable content - optionally with mouse handlers for tooltip
  const createDraggableContent = (withMouseHandlers: boolean) => (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseEnter={withMouseHandlers ? handleMouseEnter : undefined}
      onMouseLeave={withMouseHandlers ? handleMouseLeave : undefined}
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

  // If preview image exists, wrap with controlled tooltip
  if (hasPreview) {
    return (
      <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
        <TooltipTrigger asChild>
          {createDraggableContent(true)}
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

  return createDraggableContent(false)
}

// Grid variant of PaletteItem for compact view
function PaletteItemGrid({ name, displayName, icon }: PaletteItemProps) {
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

  const iconName = icon as keyof typeof LucideIcons
  const IconComponent = (LucideIcons[iconName] as LucideIcon) || Type

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border border-border bg-card',
        'hover:border-primary/50 hover:bg-accent cursor-grab transition-all',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-primary'
      )}
    >
      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
        <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <p className="font-medium text-xs text-foreground text-center line-clamp-2 leading-tight">
        {displayName}
      </p>
    </div>
  )
}

const categoryIcons: Record<ComponentCategory, React.ComponentType<{ className?: string }>> = {
  content: Type,
  media: ImageIcon,
  layout: LayoutGrid,
  data: Database,
  custom: Puzzle,
  shadcn: Component,
  admissions: GraduationCap,
}

const categoryLabels: Record<ComponentCategory, string> = {
  content: 'Content',
  media: 'Media',
  layout: 'Layout',
  data: 'Data',
  custom: 'Custom',
  shadcn: 'shadcn/ui',
  admissions: 'Admissions',
}

// Local interface for palette display (subset of full CustomComponentData)
interface CustomComponentPaletteData {
  id: string
  name: string
  display_name: string
  description: string | null
  category: string
  icon: string
  preview_image: string | null
  is_active: boolean
  code: string
  default_props: Record<string, unknown>
  props_schema: Record<string, unknown> | null
}

interface ComponentPaletteProps {
  pageId?: string
}

export function ComponentPalette({ pageId }: ComponentPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'custom' | 'all'>('all')
  const [customComponents, setCustomComponents] = useState<CustomComponentPaletteData[]>([])
  const [isLoadingCustom, setIsLoadingCustom] = useState(true)
  const [browseModalOpen, setBrowseModalOpen] = useState(false)

  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('palette-view') as 'list' | 'grid') || 'list'
    }
    return 'list'
  })

  // Persist view mode to localStorage
  useEffect(() => {
    localStorage.setItem('palette-view', viewMode)
  }, [viewMode])

  // Fetch custom components from database and register them
  useEffect(() => {
    const fetchCustomComponents = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('cms_custom_components')
          .select('id, name, display_name, description, category, icon, preview_image, is_active, code, default_props, props_schema')
          .eq('is_active', true)
          .order('display_name', { ascending: true })

        if (error) {
          console.error('Failed to fetch custom components:', error)
        } else {
          const components = data || []
          setCustomComponents(components)

          // Clear existing custom component registrations and register new ones
          clearCustomComponentRegistry()

          // Transform to CustomComponentData format and register
          const registryComponents: CustomComponentData[] = components.map(comp => ({
            id: comp.id,
            name: comp.name,
            display_name: comp.display_name,
            description: comp.description || undefined,
            category: comp.category,
            icon: comp.icon || undefined,
            preview_image: comp.preview_image || undefined,
            code: comp.code,
            default_props: comp.default_props || {},
            props_schema: comp.props_schema || undefined,
            is_active: comp.is_active,
          }))

          registerCustomComponents(registryComponents)

          if (process.env.NODE_ENV === 'development') {
            console.log(`[ComponentPalette] Registered ${registryComponents.length} custom components`)
          }
        }
      } catch (err) {
        console.error('Error fetching custom components:', err)
      } finally {
        setIsLoadingCustom(false)
      }
    }

    fetchCustomComponents()

    // Cleanup: unregister custom components when unmounting
    return () => {
      clearCustomComponentRegistry()
    }
  }, [])

  // Convert custom components to palette format
  const customComponentsForPalette = useMemo(() => {
    return customComponents.map((comp) => ({
      name: comp.name,
      displayName: comp.display_name,
      description: comp.description || undefined,
      icon: comp.icon || 'Puzzle',
      previewImage: comp.preview_image || undefined,
      category: 'custom' as const,
      isCustom: true,
    }))
  }, [customComponents])

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    const builtinComponents = searchQuery
      ? searchComponents(searchQuery)
      : activeCategory === 'all'
      ? Object.values(COMPONENT_REGISTRY)
      : activeCategory === 'custom'
      ? []
      : getComponentsByCategory(activeCategory as ComponentCategory)

    // Filter custom components
    const filteredCustom = activeCategory === 'custom' || activeCategory === 'all'
      ? customComponentsForPalette.filter((comp) =>
          !searchQuery ||
          comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comp.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comp.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []

    // Combine built-in and custom
    return [...builtinComponents, ...filteredCustom]
  }, [searchQuery, activeCategory, customComponentsForPalette])

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
      custom: [],
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
      {/* Mobile sheet header - only shown in Sheet component */}
      <div className="border-b border-border p-4 lg:hidden flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Components</h2>
          {/* Close button removed - SheetContent has built-in close button */}
        </div>
      </div>

      {/* Header - desktop and mobile */}
      <div className="p-3 sm:p-4 border-b border-border lg:border-t-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-3 hidden lg:flex">
          <h2 className="font-semibold text-foreground">Components</h2>
          {/* View mode toggle */}
          <div className="flex gap-0.5 border rounded-lg p-0.5 bg-muted/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">List view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Grid view</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 h-9"
            data-palette-search
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as ComponentCategory | 'all')}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-full justify-start px-3 py-2 h-auto bg-transparent gap-1 flex-shrink-0 flex-wrap">
          <TabsTrigger
            value="all"
            className="text-xs px-2.5 py-1.5 data-[state=active]:bg-primary/10"
          >
            All
          </TabsTrigger>
          {(['content', 'media', 'layout', 'custom'] as Array<ComponentCategory | 'custom'>).map((category) => {
            const Icon = categoryIcons[category]
            const count = category === 'custom' ? customComponents.length : 0
            return (
              <Tooltip key={category}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={category}
                    className="text-xs px-2.5 py-1.5 data-[state=active]:bg-primary/10 gap-1"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {category === 'custom' && count > 0 && (
                      <span className="text-[10px] bg-primary/20 text-primary rounded px-1">
                        {count}
                      </span>
                    )}
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
              <div className={cn(
                "w-full",
                viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'
              )}>
                {filteredComponents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 col-span-2">
                    No components found for "{searchQuery}"
                  </p>
                ) : viewMode === 'grid' ? (
                  filteredComponents.map((comp) => (
                    <PaletteItemGrid
                      key={comp.name}
                      name={comp.name}
                      displayName={comp.displayName}
                      description={comp.description}
                      icon={comp.icon}
                      previewImage={comp.previewImage}
                    />
                  ))
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
                {(['content', 'media', 'layout', 'custom'] as Array<ComponentCategory | 'custom'>).map((category) => {
                  const components = groupedComponents[category] || []
                  if (components.length === 0 && category !== 'custom') return null

                  const Icon = categoryIcons[category]

                  return (
                    <div key={category} className="w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {categoryLabels[category]}
                        </h3>
                        {category === 'custom' && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {components.length}
                          </Badge>
                        )}
                      </div>
                      {components.length > 0 ? (
                        <div className={cn(
                          "w-full",
                          viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'
                        )}>
                          {viewMode === 'grid' ? (
                            components.map((comp) => (
                              <PaletteItemGrid
                                key={comp.name}
                                name={comp.name}
                                displayName={comp.displayName}
                                description={comp.description}
                                icon={comp.icon}
                                previewImage={comp.previewImage}
                              />
                            ))
                          ) : (
                            components.map((comp) => (
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
                      ) : category === 'custom' ? (
                        <div className="text-center py-4 border border-dashed rounded-lg">
                          <Puzzle className="h-6 w-6 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-xs text-muted-foreground">No custom components</p>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-xs h-auto p-0 mt-1"
                            onClick={() => setBrowseModalOpen(true)}
                          >
                            Add components
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              // Single category
              <TabsContent
                value={activeCategory}
                className={cn(
                  "mt-0 w-full",
                  viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'
                )}
              >
                {viewMode === 'grid' ? (
                  filteredComponents.map((comp) => (
                    <PaletteItemGrid
                      key={comp.name}
                      name={comp.name}
                      displayName={comp.displayName}
                      description={comp.description}
                      icon={comp.icon}
                      previewImage={comp.previewImage}
                    />
                  ))
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
              </TabsContent>
            )}
          </div>
        </ScrollArea>
      </Tabs>

      {/* Footer with Browse Library button */}
      <div className="p-3 border-t border-border bg-muted/30 flex-shrink-0 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs"
          onClick={() => setBrowseModalOpen(true)}
        >
          <Library className="h-3.5 w-3.5" />
          Browse Component Library
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Drag components to add them to your page
        </p>
      </div>

      {/* Browse Components Modal */}
      <BrowseComponentsModal
        open={browseModalOpen}
        onOpenChange={setBrowseModalOpen}
      />
    </div>
    </TooltipProvider>
  )
}
