'use client'

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { getWidgetComponent } from './widgets'
import type { DashboardLayoutItem, WidgetConfig } from '@/lib/dashboard/widget-registry'
import { Settings2, GripVertical, X, Plus, Sparkles } from 'lucide-react'

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
    const baseHeight = 160 // px per row - increased for better spacing
    return `${item.h * baseHeight}px`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {currentLayout.map((layoutItem, index) => {
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
          <div
            key={layoutItem.i}
            className={cn(
              'group relative overflow-hidden transition-all duration-300',
              // Glassmorphism card styling
              'rounded-2xl',
              'bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5',
              'backdrop-blur-xl',
              'border border-white/40 dark:border-white/10',
              'shadow-[0_8px_32px_rgba(11,109,65,0.08)]',
              'hover:shadow-[0_12px_40px_rgba(11,109,65,0.12)]',
              'hover:border-primary/20',
              'hover:-translate-y-0.5',
              getResponsiveGridClasses(layoutItem),
              isEditing && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
            )}
            style={{
              minHeight: getMinHeight(layoutItem),
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent pointer-events-none" />

            {/* Edit mode controls */}
            {isEditing && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button className="p-1.5 rounded-lg glass-button touch-target-sm hover:scale-105 transition-transform">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg glass-button touch-target-sm hover:scale-105 transition-transform">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 rounded-lg glass-button touch-target-sm hover:scale-105 hover:bg-destructive/20 hover:text-destructive transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Widget content */}
            <div className="relative p-4 sm:p-5 h-full overflow-auto">
              <WidgetComponent
                widgetId={widget.id}
                config={widgetConfig}
                isEditing={isEditing}
              />
            </div>
          </div>
        )
      })}

      {/* Add widget button in edit mode */}
      {isEditing && (
        <div className={cn(
          'group relative overflow-hidden transition-all duration-300 cursor-pointer',
          'rounded-2xl min-h-[160px]',
          'bg-gradient-to-br from-white/40 to-white/20 dark:from-white/5 dark:to-white/[0.02]',
          'backdrop-blur-sm',
          'border-2 border-dashed border-primary/20 dark:border-primary/30',
          'hover:border-primary/40 hover:bg-primary/5',
          'hover:shadow-[0_8px_32px_rgba(11,109,65,0.1)]'
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-5 h-full flex flex-col items-center justify-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Add Widget</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Customize your dashboard</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
