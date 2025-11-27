'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getWidgetComponent } from './widgets'
import type { DashboardLayoutItem, WidgetConfig } from '@/lib/dashboard/widget-registry'
import { Settings2, GripVertical, X, Plus } from 'lucide-react'

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
  userRole,
  isEditing = false,
  onLayoutChange,
}: DashboardGridProps) {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayoutItem[]>(layout)

  useEffect(() => {
    setCurrentLayout(layout)
  }, [layout])

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

  // Get widget for layout item
  const getWidgetForLayoutItem = (layoutItem: DashboardLayoutItem) => {
    return visibleWidgets.find((w) => w.widget_key === layoutItem.i)
  }

  // Convert grid units to responsive CSS classes
  const getResponsiveGridClasses = (item: DashboardLayoutItem) => {
    // Mobile: full width, Tablet: 2 cols, Desktop: 4 cols
    const desktopSpan = Math.min(item.w, 4)
    const tabletSpan = Math.min(item.w, 2)

    // Map desktop spans to responsive classes
    const colSpanClasses = {
      1: 'col-span-1 sm:col-span-1 lg:col-span-1',
      2: 'col-span-1 sm:col-span-2 lg:col-span-2',
      3: 'col-span-1 sm:col-span-2 lg:col-span-3',
      4: 'col-span-1 sm:col-span-2 lg:col-span-4',
    }

    const rowSpanClasses = {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
    }

    return cn(
      colSpanClasses[desktopSpan as keyof typeof colSpanClasses] || 'col-span-1',
      rowSpanClasses[Math.min(item.h, 3) as keyof typeof rowSpanClasses] || 'row-span-1'
    )
  }

  // Calculate min-height based on row span
  const getMinHeight = (item: DashboardLayoutItem) => {
    const baseHeight = 140 // px per row
    return `${item.h * baseHeight}px`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {currentLayout.map((layoutItem) => {
        const widget = getWidgetForLayoutItem(layoutItem)
        if (!widget) return null

        const WidgetComponent = getWidgetComponent(widget.component_name)
        if (!WidgetComponent) return null

        // Merge default config with user overrides
        const widgetConfig = {
          ...widget.default_config,
          userId,
          userName,
          userRole,
          userPermissions,
        }

        return (
          <Card
            key={layoutItem.i}
            className={cn(
              'glass-card border-0 overflow-hidden relative group transition-all duration-200',
              getResponsiveGridClasses(layoutItem),
              isEditing && 'ring-2 ring-primary/20 ring-offset-2'
            )}
            style={{ minHeight: getMinHeight(layoutItem) }}
          >
            {/* Edit mode controls */}
            {isEditing && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg bg-background/80 hover:bg-background shadow-sm touch-target-sm">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg bg-background/80 hover:bg-background shadow-sm touch-target-sm">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg bg-background/80 hover:bg-destructive hover:text-white shadow-sm touch-target-sm">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <CardContent className="p-3 sm:p-4 h-full overflow-auto">
              <WidgetComponent
                widgetId={widget.id}
                config={widgetConfig}
                isEditing={isEditing}
              />
            </CardContent>
          </Card>
        )
      })}

      {/* Add widget button in edit mode */}
      {isEditing && (
        <Card className="glass-card border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer min-h-[140px]">
          <CardContent className="p-4 h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Plus className="h-8 w-8" />
            <span className="text-sm font-medium">Add Widget</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
