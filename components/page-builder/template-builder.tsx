'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
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
import { NavigatorPanel } from './elementor/navigator-panel'
import { updateTemplateBlocks } from '@/app/actions/cms/templates'
import { toast } from 'sonner'
import type { BlockData } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'
import { getComponentEntry } from '@/lib/cms/component-registry'
import { Button } from '@/components/ui/button'
import { OfflineBanner } from '@/lib/hooks/use-network-status'
import { StatusBar } from './status-bar'
import {
  Save,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

// Auto-save debounce delay in milliseconds
const AUTO_SAVE_DELAY = 3000

interface TemplateBuilderProps {
  templateId: string
  templateName: string
  templateSlug: string
  isSystem: boolean
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

// Simple toolbar for template editing
function TemplateToolbar({
  templateId,
  templateName,
  isSystem,
  onSave,
  isSaving,
  isDirty,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  device,
  onDeviceChange,
  isPreviewMode,
  onPreviewToggle,
  isNavigatorOpen,
  onNavigatorToggle,
}: {
  templateId: string
  templateName: string
  isSystem: boolean
  onSave: () => void
  isSaving: boolean
  isDirty: boolean
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  device: 'desktop' | 'tablet' | 'mobile'
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void
  isPreviewMode: boolean
  onPreviewToggle: () => void
  isNavigatorOpen: boolean
  onNavigatorToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
      {/* Left section - Back button and title */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/content/templates/${templateId}/edit`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="h-6 w-px bg-border" />
        <div>
          <h1 className="text-sm font-medium">
            Editing Template: {templateName}
          </h1>
          {isSystem && (
            <p className="text-xs text-yellow-600">Read-only (system template)</p>
          )}
        </div>
        {isDirty && (
          <span className="text-xs text-muted-foreground">(unsaved changes)</span>
        )}
      </div>

      {/* Center section - Device & Preview */}
      <div className="flex items-center gap-2">
        {/* Device Toggle */}
        <div className="flex items-center rounded-md border border-border bg-muted/50 p-1">
          <Button
            variant={device === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => onDeviceChange('desktop')}
            title="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={device === 'tablet' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => onDeviceChange('tablet')}
            title="Tablet view"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={device === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => onDeviceChange('mobile')}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigator Toggle */}
        <Button
          variant={isNavigatorOpen ? 'secondary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={onNavigatorToggle}
          title="Toggle Navigator (Ctrl+L)"
        >
          <Layers className="h-4 w-4" />
        </Button>

        {/* Preview Toggle */}
        <Button
          variant={isPreviewMode ? 'secondary' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={onPreviewToggle}
          title={isPreviewMode ? 'Exit Preview' : 'Preview'}
        >
          {isPreviewMode ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Save Button */}
        <Button
          onClick={onSave}
          disabled={isSaving || !isDirty || isSystem}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Template
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function TemplateBuilderContent({
  templateId,
  templateName,
  isSystem,
}: {
  templateId: string
  templateName: string
  isSystem: boolean
}) {
  // Stable ID for DndContext to prevent hydration mismatches
  const dndContextId = useId()

  const {
    state,
    addBlock,
    addBlockToContainer,
    reorderBlocks,
    moveBlockToContainer,
    markSaved,
    setSaving,
    getRootBlocks,
    undo,
    redo,
    setDevice,
    setPreviewMode,
    canUndo,
    canRedo,
  } = usePageBuilder()

  const { blocks, isDirty, isSaving, isPreviewMode, device } = state

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [autoSaveFailCount, setAutoSaveFailCount] = useState(0)

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
      const componentName = active.data.current?.componentName
      setActivePaletteItem(componentName)
    } else {
      setActiveId(String(active.id))
    }
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      setActiveId(null)
      setActivePaletteItem(null)

      if (isSystem) return // Don't allow changes on system templates

      if (String(active.id).startsWith('palette-')) {
        const componentName = active.data.current?.componentName
        if (componentName) {
          if (!over) {
            addBlock(componentName)
            return
          }

          const overId = String(over.id)

          if (overId.startsWith('container-drop-')) {
            const containerId = over.data.current?.containerId
            if (containerId) {
              addBlockToContainer(componentName, containerId)
              return
            }
          }

          if (overId === 'canvas-drop-zone' || overId === 'empty-canvas-drop-zone') {
            addBlock(componentName)
          } else {
            const rootBlocks = getRootBlocks()
            const overIndex = rootBlocks.findIndex((b) => b.id === over.id)
            const insertAt = overIndex >= 0 ? overIndex : rootBlocks.length
            addBlock(componentName, insertAt)
          }
        }
        return
      }

      if (over && active.id !== over.id) {
        const overId = String(over.id)

        if (overId.startsWith('container-drop-')) {
          const containerId = over.data.current?.containerId
          if (containerId) {
            moveBlockToContainer(String(active.id), containerId)
            return
          }
        }

        if (overId !== 'canvas-drop-zone' && overId !== 'empty-canvas-drop-zone') {
          const targetBlock = blocks.find((b) => b.id === over.id)
          const sourceBlock = blocks.find((b) => b.id === active.id)

          if (targetBlock && sourceBlock && targetBlock.parent_block_id === sourceBlock.parent_block_id) {
            const siblings = blocks
              .filter((b) => b.parent_block_id === sourceBlock.parent_block_id)
              .sort((a, b) => a.sort_order - b.sort_order)

            const oldIndex = siblings.findIndex((b) => b.id === active.id)
            const newIndex = siblings.findIndex((b) => b.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
              reorderBlocks(oldIndex, newIndex)
            }
          } else if (targetBlock && sourceBlock) {
            moveBlockToContainer(
              String(active.id),
              targetBlock.parent_block_id,
              targetBlock.sort_order
            )
          }
        }
      }
    },
    [blocks, addBlock, addBlockToContainer, reorderBlocks, moveBlockToContainer, getRootBlocks, isSystem]
  )

  // Save handler with failure tracking
  const handleSave = useCallback(async (showToast = true) => {
    if (isSystem) {
      toast.error('System templates cannot be modified')
      return
    }

    setSaving(true)
    try {
      // Prepare blocks for template storage
      const blocksForStorage = blocks.map((block) => ({
        component_name: block.component_name,
        props: block.props,
        sort_order: block.sort_order,
        parent_block_id: block.parent_block_id,
        is_visible: block.is_visible,
        custom_classes: block.custom_classes,
      }))

      const result = await updateTemplateBlocks(templateId, blocksForStorage)
      if (result.success) {
        markSaved()
        lastSavedBlocksRef.current = JSON.stringify(blocks)
        setAutoSaveFailCount(0)
        if (showToast) {
          toast.success('Template saved successfully')
        }
      } else {
        if (!showToast) {
          setAutoSaveFailCount(prev => {
            const newCount = prev + 1
            if (newCount === 2) {
              toast.warning('Auto-save is failing. Your changes may not be saved.', {
                duration: 5000,
                action: {
                  label: 'Save Now',
                  onClick: () => handleSave(true),
                },
              })
            }
            return newCount
          })
        } else {
          toast.error(result.message || 'Failed to save template')
        }
      }
    } catch {
      if (!showToast) {
        setAutoSaveFailCount(prev => {
          const newCount = prev + 1
          if (newCount === 2) {
            toast.warning('Auto-save is failing. Check your connection.', {
              duration: 5000,
              action: {
                label: 'Retry',
                onClick: () => handleSave(true),
              },
            })
          }
          return newCount
        })
      } else {
        toast.error('An error occurred while saving')
      }
    } finally {
      setSaving(false)
    }
  }, [templateId, blocks, markSaved, setSaving, isSystem])

  // Auto-save when blocks change (debounced) - skip for system templates
  useEffect(() => {
    if (isSystem || isSaving || !isDirty) return

    const currentBlocksStr = JSON.stringify(blocks)
    if (currentBlocksStr === lastSavedBlocksRef.current) return

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave(false)
    }, AUTO_SAVE_DELAY)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [blocks, isDirty, isSaving, handleSave, isSystem])

  // Manual save wrapper
  const handleManualSave = useCallback(async () => {
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
        if (isDirty && !isSaving && !isSystem) {
          handleManualSave()
        }
      }
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      }
      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) redo()
      }
      // Navigator: Ctrl/Cmd + L
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault()
        setIsNavigatorOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDirty, isSaving, handleManualSave, canUndo, canRedo, undo, redo, isSystem])

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
      id={dndContextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-background">
        {/* Top Toolbar */}
        <TemplateToolbar
          templateId={templateId}
          templateName={templateName}
          isSystem={isSystem}
          onSave={handleManualSave}
          isSaving={isSaving}
          isDirty={isDirty}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          device={device}
          onDeviceChange={setDevice}
          isPreviewMode={isPreviewMode}
          onPreviewToggle={() => setPreviewMode(!isPreviewMode)}
          isNavigatorOpen={isNavigatorOpen}
          onNavigatorToggle={() => setIsNavigatorOpen(!isNavigatorOpen)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Component Palette */}
          {!isPreviewMode && (
            <div className="w-[280px] border-r border-border bg-card overflow-y-auto">
              <ComponentPalette />
            </div>
          )}

          {/* Navigator Panel */}
          {!isPreviewMode && (
            <NavigatorPanel
              isOpen={isNavigatorOpen}
              onClose={() => setIsNavigatorOpen(false)}
            />
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

          {/* Right Sidebar - Properties Panel (simplified - no SEO/FAB) */}
          {!isPreviewMode && (
            <div className="w-[350px] border-l border-border bg-card overflow-y-auto">
              <PropsPanel />
            </div>
          )}
        </div>

        {/* Bottom Status Bar - hidden in preview mode */}
        {!isPreviewMode && <StatusBar />}
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

      {/* Offline Banner */}
      <OfflineBanner message="You are offline. Changes will be saved when you reconnect." />
    </DndContext>
  )
}

export function TemplateBuilder({
  templateId,
  templateName,
  templateSlug,
  isSystem,
  initialBlocks,
}: TemplateBuilderProps) {
  // Create a pseudo-page object for the provider
  const pseudoPage = {
    id: templateId,
    title: templateName,
    slug: templateSlug,
    status: 'draft' as const,
  }

  return (
    <PageBuilderProvider initialPage={pseudoPage} initialBlocks={initialBlocks}>
      <TemplateBuilderContent
        templateId={templateId}
        templateName={templateName}
        isSystem={isSystem}
      />
    </PageBuilderProvider>
  )
}
