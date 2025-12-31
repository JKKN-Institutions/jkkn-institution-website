'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import GridLayout, { WidthProvider, Responsive } from 'react-grid-layout'
import { GripVertical, X, Settings2, Plus, RotateCcw, Lock, Unlock } from 'lucide-react'

// Define layout item type for react-grid-layout
interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
}
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { getWidgetComponent } from './widgets'
import { DEFAULT_LAYOUTS, type DashboardLayoutItem, type WidgetConfig } from '@/lib/dashboard/widget-registry'
import {
  saveDashboardLayout,
  addWidgetToDashboard,
  removeWidgetFromDashboard,
  resetDashboardToDefault,
} from '@/app/actions/dashboard'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

interface DashboardGridProps {
  widgets: WidgetConfig[]
  layout: DashboardLayoutItem[]
  userPermissions: string[]
  userId: string
  userName?: string
  userRole?: string
  isEditing?: boolean
  onLayoutChange?: (layout: DashboardLayoutItem[]) => void
}

export function DashboardGrid({
  widgets,
  layout,
  userPermissions,
  userId,
  userName,
  userRole = 'member',
  isEditing: initialEditMode = false,
  onLayoutChange,
}: DashboardGridProps) {
  const [isEditMode, setIsEditMode] = useState(initialEditMode)
  const [layouts, setLayouts] = useState<{ lg: LayoutItem[] }>({ lg: [] })
  const [currentWidgets, setCurrentWidgets] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false)

  // Filter widgets based on permissions
  const visibleWidgets = useMemo(() => {
    return widgets.filter((widget) => {
      if (!widget.is_active) return false
      if (widget.required_permissions.length === 0) return true
      if (userPermissions.includes('*:*:*')) return true

      return widget.required_permissions.every((required) => {
        if (userPermissions.includes(required)) return true

        const [module, resource, action] = required.split(':')
        for (const perm of userPermissions) {
          const [permModule, permResource, permAction] = perm.split(':')
          if (permModule === '*' && permResource === '*' && permAction === '*') return true
          if (permModule === module && permResource === '*' && permAction === '*') return true
          if (permModule === module && permResource === resource && permAction === '*') return true
        }
        return false
      })
    })
  }, [widgets, userPermissions])

  // Initialize layouts from props or defaults
  useEffect(() => {
    let initialLayout: LayoutItem[]

    if (layout.length > 0) {
      // Use provided layout
      initialLayout = layout.map((item) => {
        const widget = visibleWidgets.find((w) => w.widget_key === item.i)
        return {
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          minW: widget?.min_width ?? 1,
          minH: widget?.min_height ?? 1,
          maxW: widget?.max_width ?? 12,
          maxH: widget?.max_height ?? 8,
        }
      })
      setCurrentWidgets(layout.map((item) => item.i))
    } else {
      // Use default layout for role
      const defaultLayout = DEFAULT_LAYOUTS[userRole] || DEFAULT_LAYOUTS.member || []
      initialLayout = defaultLayout.map((item) => {
        const widget = visibleWidgets.find((w) => w.widget_key === item.i)
        return {
          ...item,
          minW: widget?.min_width ?? 1,
          minH: widget?.min_height ?? 1,
          maxW: widget?.max_width ?? 12,
          maxH: widget?.max_height ?? 8,
        }
      })
      setCurrentWidgets(defaultLayout.map((item) => item.i))
    }

    setLayouts({ lg: initialLayout })
  }, [layout, userRole, visibleWidgets])

  // Handle layout change
  const handleLayoutChange = useCallback(
    (newLayout: LayoutItem[]) => {
      if (!isEditMode) return

      setLayouts({ lg: newLayout })

      // Notify parent of layout change
      if (onLayoutChange) {
        const layoutItems = newLayout.map((item) => ({
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          minW: item.minW,
          minH: item.minH,
          maxW: item.maxW,
          maxH: item.maxH,
        }))
        onLayoutChange(layoutItems)
      }
    },
    [isEditMode, onLayoutChange]
  )

  // Save layout
  const handleSaveLayout = useCallback(async () => {
    setIsSaving(true)
    try {
      const layoutItems: DashboardLayoutItem[] = layouts.lg.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
        maxW: item.maxW,
        maxH: item.maxH,
      }))

      const result = await saveDashboardLayout(layoutItems)

      if (result.error) {
        toast.error('Failed to save layout', { description: result.error })
      } else {
        toast.success('Dashboard layout saved')
        setIsEditMode(false)
      }
    } catch {
      toast.error('Failed to save layout')
    } finally {
      setIsSaving(false)
    }
  }, [layouts])

  // Add widget
  const handleAddWidget = useCallback(
    async (widgetKey: string) => {
      const widget = visibleWidgets.find((w) => w.widget_key === widgetKey)
      if (!widget) return

      // Calculate position for new widget
      const maxY = Math.max(...layouts.lg.map((item) => item.y + item.h), 0)

      const newLayoutItem: LayoutItem = {
        i: widgetKey,
        x: 0,
        y: maxY,
        w: widget.min_width ?? 2,
        h: widget.min_height ?? 2,
        minW: widget.min_width ?? 1,
        minH: widget.min_height ?? 1,
        maxW: widget.max_width ?? 12,
        maxH: widget.max_height ?? 8,
      }

      setLayouts((prev) => ({ lg: [...prev.lg, newLayoutItem] }))
      setCurrentWidgets((prev) => [...prev, widgetKey])

      const result = await addWidgetToDashboard(widgetKey, {
        x: 0,
        y: maxY,
        w: widget.min_width ?? 2,
        h: widget.min_height ?? 2,
      })

      if (result.error) {
        toast.error('Failed to add widget', { description: result.error })
      } else {
        toast.success(`Added ${widget.name}`)
      }

      setIsAddWidgetOpen(false)
    },
    [layouts, visibleWidgets]
  )

  // Remove widget
  const handleRemoveWidget = useCallback(
    async (widgetKey: string) => {
      setLayouts((prev) => ({
        lg: prev.lg.filter((item) => item.i !== widgetKey),
      }))
      setCurrentWidgets((prev) => prev.filter((key) => key !== widgetKey))

      const result = await removeWidgetFromDashboard(widgetKey)

      if (result.error) {
        toast.error('Failed to remove widget', { description: result.error })
      } else {
        toast.success('Widget removed')
      }
    },
    []
  )

  // Reset to defaults
  const handleResetLayout = useCallback(async () => {
    const result = await resetDashboardToDefault()

    if (result.error) {
      toast.error('Failed to reset layout', { description: result.error })
    } else {
      // Reload with defaults
      const defaultLayout = DEFAULT_LAYOUTS[userRole] || DEFAULT_LAYOUTS.member || []
      const newLayout = defaultLayout.map((item) => {
        const widget = visibleWidgets.find((w) => w.widget_key === item.i)
        return {
          ...item,
          minW: widget?.min_width ?? 1,
          minH: widget?.min_height ?? 1,
          maxW: widget?.max_width ?? 12,
          maxH: widget?.max_height ?? 8,
        }
      })
      setLayouts({ lg: newLayout })
      setCurrentWidgets(defaultLayout.map((item) => item.i))
      toast.success('Dashboard reset to default')
    }
  }, [userRole, visibleWidgets])

  // Available widgets (not currently on dashboard)
  const availableWidgets = useMemo(() => {
    return visibleWidgets.filter((w) => !currentWidgets.includes(w.widget_key))
  }, [visibleWidgets, currentWidgets])

  // Get widget for layout item
  const getWidgetForLayoutItem = (layoutItem: LayoutItem) => {
    return visibleWidgets.find((w) => w.widget_key === layoutItem.i)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400">
              <Settings2 className="h-3 w-3" />
              Edit Mode
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditMode ? (
            <>
              <Sheet open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add Widget
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add Widget</SheetTitle>
                    <SheetDescription>Select a widget to add to your dashboard</SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
                    <div className="space-y-2">
                      {availableWidgets.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">
                          All available widgets are already on your dashboard
                        </p>
                      ) : (
                        availableWidgets.map((widget) => (
                          <button
                            key={widget.widget_key}
                            onClick={() => handleAddWidget(widget.widget_key)}
                            className="w-full p-4 text-left rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <p className="font-medium">{widget.name}</p>
                            {widget.description && (
                              <p className="text-sm text-muted-foreground mt-1">{widget.description}</p>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-1.5" />
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleResetLayout}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsEditMode(false)}>
                    <Lock className="h-4 w-4 mr-2" />
                    Exit Edit Mode
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" onClick={handleSaveLayout} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Layout'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)} className="gap-1.5">
              <Unlock className="h-4 w-4" />
              Customize Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 4, sm: 2, xs: 2, xxs: 1 }}
        rowHeight={180}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        onLayoutChange={(layout: LayoutItem[]) => handleLayoutChange(layout)}
        draggableHandle=".widget-drag-handle"
      >
        {layouts.lg.map((layoutItem) => {
          const widget = getWidgetForLayoutItem(layoutItem)
          if (!widget) return null

          const WidgetComponent = getWidgetComponent(widget.component_name)
          if (!WidgetComponent) {
            return (
              <div
                key={layoutItem.i}
                className="bg-muted/30 rounded-xl border border-dashed flex items-center justify-center"
              >
                <p className="text-sm text-muted-foreground">Widget not available: {layoutItem.i}</p>
              </div>
            )
          }

          // Merge default config with user overrides
          const widgetConfig = {
            ...widget.default_config,
            userId,
            userName,
            userRole,
            userPermissions,
          }

          return (
            <div
              key={layoutItem.i}
              className={cn(
                'relative group overflow-hidden transition-all duration-300',
                'bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5',
                'backdrop-blur-xl rounded-2xl',
                'border border-white/40 dark:border-white/10',
                'shadow-[0_8px_32px_rgba(11,109,65,0.08)]',
                isEditMode && 'ring-2 ring-primary/20'
              )}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent pointer-events-none" />

              {/* Edit mode overlay */}
              {isEditMode && (
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-background/90 to-transparent">
                  <div className="widget-drag-handle cursor-grab active:cursor-grabbing flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <GripVertical className="h-4 w-4" />
                    <span className="text-xs font-medium">{widget.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveWidget(layoutItem.i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Widget content */}
              <div className={cn('relative h-full p-4 sm:p-5 overflow-auto', isEditMode && 'pt-10')}>
                <WidgetComponent
                  widgetId={widget.id}
                  config={widgetConfig}
                  isEditing={isEditMode}
                />
              </div>
            </div>
          )
        })}
      </ResponsiveGridLayout>

      {/* Empty state */}
      {layouts.lg.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <Settings2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No widgets configured</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            Click &quot;Customize Dashboard&quot; to add widgets to your dashboard
          </p>
          <Button className="mt-4" onClick={() => setIsEditMode(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Widgets
          </Button>
        </div>
      )}
    </div>
  )
}
