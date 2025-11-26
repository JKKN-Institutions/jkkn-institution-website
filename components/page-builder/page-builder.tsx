'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { usePageBuilder, PageBuilderProvider } from './page-builder-provider'
import { ComponentPalette } from './palette/component-palette'
import { BuilderCanvas } from './canvas/builder-canvas'
import { PropsPanel } from './properties/props-panel'
import { TopToolbar } from './toolbar/top-toolbar'
import { updatePageContent } from '@/app/actions/cms/pages'
import { toast } from 'sonner'
import type { BlockData } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'
import { getComponentEntry } from '@/lib/cms/component-registry'

// Auto-save debounce delay in milliseconds
const AUTO_SAVE_DELAY = 3000

interface PageBuilderProps {
  pageId: string
  pageTitle: string
  pageSlug: string
  pageStatus: 'draft' | 'published' | 'archived' | 'scheduled'
  initialBlocks: BlockData[]
}

// Drag overlay content component
function DragOverlayContent({ componentName }: { componentName: string }) {
  const entry = getComponentEntry(componentName)
  if (!entry) return null

  return (
    <div className="p-4 bg-background border border-primary rounded-lg shadow-xl">
      <p className="font-medium text-sm">{entry.displayName}</p>
      <p className="text-xs text-muted-foreground">{entry.description}</p>
    </div>
  )
}

function PageBuilderContent({ pageId }: { pageId: string }) {
  const {
    state,
    addBlock,
    reorderBlocks,
    markSaved,
    setSaving,
  } = usePageBuilder()

  const { blocks, isDirty, isSaving, isPreviewMode, device } = state

  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activePaletteItem, setActivePaletteItem] = useState<string | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Refs for auto-save
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedBlocksRef = useRef<string>(JSON.stringify(blocks))

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event

    if (String(active.id).startsWith('palette-')) {
      // Dragging from palette
      const componentName = active.data.current?.componentName
      setActivePaletteItem(componentName)
    } else {
      // Reordering existing block
      setActiveId(String(active.id))
    }
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      setActiveId(null)
      setActivePaletteItem(null)

      // Check if dragging from palette
      if (String(active.id).startsWith('palette-')) {
        const componentName = active.data.current?.componentName
        if (componentName) {
          if (!over) {
            // Dropped somewhere without a specific target - add to end
            addBlock(componentName)
            return
          }

          const overId = String(over.id)
          // Dropped on the empty canvas or drop zone at the bottom
          if (overId === 'canvas-drop-zone' || overId === 'empty-canvas-drop-zone') {
            addBlock(componentName)
          } else {
            // Dropped over an existing block - insert before it
            const overIndex = blocks.findIndex((b) => b.id === over.id)
            const insertAt = overIndex >= 0 ? overIndex : blocks.length
            addBlock(componentName, insertAt)
          }
        }
        return
      }

      // Reordering existing blocks
      if (over && active.id !== over.id) {
        const overId = String(over.id)
        if (overId !== 'canvas-drop-zone' && overId !== 'empty-canvas-drop-zone') {
          const oldIndex = blocks.findIndex((b) => b.id === active.id)
          const newIndex = blocks.findIndex((b) => b.id === over.id)

          if (oldIndex !== -1 && newIndex !== -1) {
            reorderBlocks(oldIndex, newIndex)
          }
        }
      }
    },
    [blocks, addBlock, reorderBlocks]
  )

  // Save handler
  const handleSave = useCallback(async (showToast = true) => {
    setSaving(true)
    try {
      const result = await updatePageContent(pageId, blocks)
      if (result.success) {
        markSaved()
        lastSavedBlocksRef.current = JSON.stringify(blocks)
        if (showToast) {
          toast.success('Page saved successfully')
        }
      } else {
        if (showToast) {
          toast.error(result.message || 'Failed to save page')
        }
      }
    } catch {
      if (showToast) {
        toast.error('An error occurred while saving')
      }
    } finally {
      setSaving(false)
    }
  }, [pageId, blocks, markSaved, setSaving])

  // Auto-save when blocks change (debounced)
  useEffect(() => {
    // Skip if already saving or no changes
    if (isSaving || !isDirty) return

    // Check if blocks actually changed from last save
    const currentBlocksStr = JSON.stringify(blocks)
    if (currentBlocksStr === lastSavedBlocksRef.current) return

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(false) // Silent auto-save (no toast)
    }, AUTO_SAVE_DELAY)

    // Cleanup
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [blocks, isDirty, isSaving, handleSave])

  // Manual save wrapper (shows toast)
  const handleManualSave = useCallback(async () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
      autoSaveTimeoutRef.current = null
    }
    await handleSave(true)
  }, [handleSave])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (isDirty && !isSaving) {
          handleManualSave()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDirty, isSaving, handleManualSave])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Get device width class for preview
  const getDeviceWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px]'
      case 'tablet':
        return 'max-w-[768px]'
      default:
        return 'w-full'
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-background">
        {/* Top Toolbar */}
        <TopToolbar onSave={handleManualSave} />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Component Palette */}
          {!isPreviewMode && (
            <div className="w-[280px] border-r border-border bg-card overflow-y-auto">
              <ComponentPalette />
            </div>
          )}

          {/* Center - Canvas */}
          <div className="flex-1 overflow-auto bg-muted/30">
            <div
              className={cn(
                'mx-auto transition-all duration-300',
                getDeviceWidthClass(),
                device !== 'desktop' && 'shadow-lg my-4 bg-background rounded-lg overflow-hidden'
              )}
            >
              <BuilderCanvas />
            </div>
          </div>

          {/* Right Sidebar - Properties Panel */}
          {!isPreviewMode && (
            <div className="w-[350px] border-l border-border bg-card overflow-y-auto">
              <PropsPanel />
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && (
          <div className="opacity-80">
            {(() => {
              const block = blocks.find((b) => b.id === activeId)
              if (!block) return null
              const entry = getComponentEntry(block.component_name)
              return (
                <div className="p-4 bg-background border border-primary rounded-lg shadow-xl">
                  <p className="font-medium text-sm">{entry?.displayName || block.component_name}</p>
                </div>
              )
            })()}
          </div>
        )}
        {activePaletteItem && <DragOverlayContent componentName={activePaletteItem} />}
      </DragOverlay>
    </DndContext>
  )
}

export function PageBuilder({
  pageId,
  pageTitle,
  pageSlug,
  pageStatus,
  initialBlocks,
}: PageBuilderProps) {
  const initialPage = {
    id: pageId,
    title: pageTitle,
    slug: pageSlug,
    status: pageStatus,
  }

  return (
    <PageBuilderProvider initialPage={initialPage} initialBlocks={initialBlocks}>
      <PageBuilderContent pageId={pageId} />
    </PageBuilderProvider>
  )
}
