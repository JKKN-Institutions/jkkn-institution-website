'use client'

import { useState, useMemo, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
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
import { toast } from 'sonner'

interface PaletteItemProps {
  name: string
  displayName: string
  description?: string
  icon: string
  previewImage?: string
}

function PaletteItem({ name, displayName, description, icon }: PaletteItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg border border-border bg-card w-full min-w-0',
        'hover:border-primary/50 hover:bg-accent hover:scale-[1.01] cursor-grab transition-all',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-primary'
      )}
    >
      <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
        <IconComponent className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground line-clamp-1">{displayName}</p>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-tight mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0 opacity-50 group-hover:opacity-100">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
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
        'group flex flex-col items-center justify-center gap-2 p-3.5 rounded-lg border border-border bg-card',
        'hover:border-primary/50 hover:bg-accent hover:scale-[1.02] cursor-grab transition-all',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-primary'
      )}
    >
      <div className="flex items-center justify-center h-11 w-11 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
        <IconComponent className="h-5.5 w-5.5 text-muted-foreground group-hover:text-primary transition-colors" />
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

  // View mode state with localStorage persistence (hydration-safe)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [isViewModeInitialized, setIsViewModeInitialized] = useState(false)

  // Load view mode from localStorage after hydration (client-side only)
  useEffect(() => {
    const savedViewMode = localStorage.getItem('palette-view') as 'list' | 'grid'
    if (savedViewMode) {
      setViewMode(savedViewMode)
    }
    setIsViewModeInitialized(true)
  }, [])

  // Persist view mode to localStorage (only after initialization)
  useEffect(() => {
    if (isViewModeInitialized) {
      localStorage.setItem('palette-view', viewMode)
    }
  }, [viewMode, isViewModeInitialized])

  // Fetch custom components from database and register them + real-time subscription
  useEffect(() => {
    const supabase = createClient()

    const fetchCustomComponents = async () => {
      try {
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

    // Initial fetch
    fetchCustomComponents()

    // Set up real-time subscription for new components
    const subscription = supabase
      .channel('custom-components-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cms_custom_components',
          filter: 'is_active=eq.true',
        },
        (payload) => {
          const newComponent = payload.new as CustomComponentPaletteData

          if (process.env.NODE_ENV === 'development') {
            console.log('[ComponentPalette] New component detected:', newComponent.display_name)
          }

          // Add to state
          setCustomComponents((prev) => {
            const exists = prev.find((c) => c.id === newComponent.id)
            if (exists) return prev
            return [...prev, newComponent].sort((a, b) =>
              a.display_name.localeCompare(b.display_name)
            )
          })

          // Register new component in registry
          const registryComponent = {
            id: newComponent.id,
            name: newComponent.name,
            display_name: newComponent.display_name,
            description: newComponent.description || undefined,
            category: newComponent.category,
            icon: newComponent.icon || undefined,
            preview_image: newComponent.preview_image || undefined,
            code: newComponent.code,
            default_props: newComponent.default_props || {},
            props_schema: newComponent.props_schema || undefined,
            is_active: newComponent.is_active,
          } as CustomComponentData

          registerCustomComponents([registryComponent])

          // Show toast notification
          toast.success(`New component "${newComponent.display_name}" is now available!`, {
            description: 'You can now drag it from the component palette',
            duration: 5000,
          })
        }
      )
      .subscribe()

    // Cleanup: unsubscribe and unregister custom components when unmounting
    return () => {
      subscription.unsubscribe()
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
      <div className="border-b border-border p-4 lg:hidden flex-shrink-0 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
            <Component className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Components</h2>
            <p className="text-xs text-muted-foreground">Drag to add to your page</p>
          </div>
        </div>
      </div>

      {/* Header - desktop and mobile */}
      <div className="p-4 border-b border-border lg:border-t-0 flex-shrink-0 bg-muted/20 pt-14">
        <div className="flex items-center justify-between mb-3.5 hidden lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
              <Component className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Components</h2>
          </div>
          {/* View mode toggle */}
          <div className="flex gap-0.5 border rounded-lg p-0.5 bg-muted/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">List view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Grid view</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border h-10 focus-visible:ring-2 focus-visible:ring-primary/20"
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
        <TabsList className="w-full justify-start px-2 py-2.5 h-auto bg-transparent gap-1.5 flex-shrink-0 flex-wrap">
          <TabsTrigger
            value="all"
            className="text-xs px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium"
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
                    className="text-xs px-3 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary gap-1.5"
                  >
                    <Icon className="h-3 w-3" />
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
          <div className="p-4 w-full overflow-hidden">
            {searchQuery ? (
              // Search results
              <div className={cn(
                "w-full",
                viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'
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
              <div className="space-y-7 w-full">
                {(['content', 'media', 'layout', 'custom'] as Array<ComponentCategory | 'custom'>).map((category) => {
                  const components = groupedComponents[category] || []
                  if (components.length === 0 && category !== 'custom') return null

                  const Icon = categoryIcons[category]

                  return (
                    <div key={category} className="w-full">
                      <div className="flex items-center gap-2.5 mb-3.5 pb-2 border-b border-border/50">
                        <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {categoryLabels[category]}
                        </h3>
                        {category === 'custom' && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 ml-auto">
                            {components.length}
                          </Badge>
                        )}
                      </div>
                      {components.length > 0 ? (
                        <div className={cn(
                          "w-full",
                          viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'
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
                        <div className="text-center py-6 border border-dashed rounded-lg bg-muted/20">
                          <Puzzle className="h-7 w-7 mx-auto text-muted-foreground/50 mb-2.5" />
                          <p className="text-xs text-muted-foreground mb-2">No custom components yet</p>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-xs h-auto p-0 text-primary hover:text-primary/80"
                            onClick={() => setBrowseModalOpen(true)}
                          >
                            Browse library to add
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
                  viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'
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
      <div className="p-4 border-t border-border bg-muted/30 flex-shrink-0">
        <Button
          variant="outline"
          className="w-full gap-2.5 h-10 text-sm font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
          onClick={() => setBrowseModalOpen(true)}
        >
          <Library className="h-4 w-4" />
          Browse Component Library
        </Button>
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
