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
import { SeoPanel } from './panels/seo-panel'
import { FabPanel, type FabConfig } from './panels/fab-panel'
import { TopToolbar } from './toolbar/top-toolbar'
import { updatePageContent, updatePageSeo, updatePageFab } from '@/app/actions/cms/pages'
import { toast } from 'sonner'
import type { BlockData } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'
import { getComponentEntry } from '@/lib/cms/component-registry'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Search, MessageCircle } from 'lucide-react'
import type { SeoData } from '@/lib/utils/seo-analyzer'

// Auto-save debounce delay in milliseconds
const AUTO_SAVE_DELAY = 3000

interface SeoMetadata {
  id?: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  canonical_url: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  twitter_title: string | null
  twitter_description: string | null
  twitter_image: string | null
  structured_data: Record<string, unknown>[] | null
}

interface PageBuilderProps {
  pageId: string
  pageTitle: string
  pageSlug: string
  pageStatus: 'draft' | 'published' | 'archived' | 'scheduled'
  initialBlocks: BlockData[]
  initialSeoData?: SeoMetadata | null
  initialFabConfig?: Partial<FabConfig> | null
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

function PageBuilderContent({
  pageId,
  pageSlug,
  initialSeoData,
  initialFabConfig,
}: {
  pageId: string
  pageSlug: string
  initialSeoData?: SeoMetadata | null
  initialFabConfig?: Partial<FabConfig> | null
}) {
  const {
    state,
    addBlock,
    addBlockToContainer,
    reorderBlocks,
    moveBlockToContainer,
    markSaved,
    setSaving,
    getRootBlocks,
  } = usePageBuilder()

  const { blocks, isDirty, isSaving, isPreviewMode, device } = state

  // Right panel tab state
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'seo' | 'fab'>('properties')
  const [isSavingSeo, setIsSavingSeo] = useState(false)
  const [isSavingFab, setIsSavingFab] = useState(false)

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

          // Check if dropped onto a container drop zone
          if (overId.startsWith('container-drop-')) {
            const containerId = over.data.current?.containerId
            if (containerId) {
              addBlockToContainer(componentName, containerId)
              return
            }
          }

          // Dropped on the empty canvas or drop zone at the bottom
          if (overId === 'canvas-drop-zone' || overId === 'empty-canvas-drop-zone') {
            addBlock(componentName)
          } else {
            // Dropped over an existing block - insert before it
            const rootBlocks = getRootBlocks()
            const overIndex = rootBlocks.findIndex((b) => b.id === over.id)
            const insertAt = overIndex >= 0 ? overIndex : rootBlocks.length
            addBlock(componentName, insertAt)
          }
        }
        return
      }

      // Reordering existing blocks
      if (over && active.id !== over.id) {
        const overId = String(over.id)

        // Check if dropped onto a container drop zone
        if (overId.startsWith('container-drop-')) {
          const containerId = over.data.current?.containerId
          if (containerId) {
            moveBlockToContainer(String(active.id), containerId)
            return
          }
        }

        if (overId !== 'canvas-drop-zone' && overId !== 'empty-canvas-drop-zone') {
          // Get the parent of the target block to reorder within the same level
          const targetBlock = blocks.find((b) => b.id === over.id)
          const sourceBlock = blocks.find((b) => b.id === active.id)

          if (targetBlock && sourceBlock && targetBlock.parent_block_id === sourceBlock.parent_block_id) {
            // Same parent - simple reorder within that level
            const siblings = blocks
              .filter((b) => b.parent_block_id === sourceBlock.parent_block_id)
              .sort((a, b) => a.sort_order - b.sort_order)

            const oldIndex = siblings.findIndex((b) => b.id === active.id)
            const newIndex = siblings.findIndex((b) => b.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
              reorderBlocks(oldIndex, newIndex)
            }
          } else if (targetBlock && sourceBlock) {
            // Different parents - move to target's container
            moveBlockToContainer(
              String(active.id),
              targetBlock.parent_block_id,
              targetBlock.sort_order
            )
          }
        }
      }
    },
    [blocks, addBlock, addBlockToContainer, reorderBlocks, moveBlockToContainer, getRootBlocks]
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

  // SEO save handler
  const handleSaveSeo = useCallback(async (seoData: Partial<SeoData>) => {
    setIsSavingSeo(true)
    try {
      const result = await updatePageSeo(pageId, seoData)
      if (result.success) {
        toast.success('SEO settings saved')
      } else {
        toast.error(result.message || 'Failed to save SEO settings')
      }
    } catch {
      toast.error('An error occurred while saving SEO settings')
    } finally {
      setIsSavingSeo(false)
    }
  }, [pageId])

  // FAB save handler
  const handleSaveFab = useCallback(async (fabConfig: Partial<FabConfig>) => {
    setIsSavingFab(true)
    try {
      const result = await updatePageFab(pageId, fabConfig)
      if (result.success) {
        toast.success('FAB settings saved')
      } else {
        toast.error(result.message || 'Failed to save FAB settings')
      }
    } catch {
      toast.error('An error occurred while saving FAB settings')
    } finally {
      setIsSavingFab(false)
    }
  }, [pageId])

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

          {/* Right Sidebar - Properties/SEO/FAB Panel */}
          {!isPreviewMode && (
            <div className="w-[350px] border-l border-border bg-card flex flex-col overflow-hidden">
              <Tabs
                value={rightPanelTab}
                onValueChange={(v) => setRightPanelTab(v as 'properties' | 'seo' | 'fab')}
                className="flex flex-col h-full"
              >
                <div className="border-b border-border px-2 pt-2">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="properties" className="flex items-center gap-1.5 text-xs">
                      <Settings className="h-3.5 w-3.5" />
                      Props
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex items-center gap-1.5 text-xs">
                      <Search className="h-3.5 w-3.5" />
                      SEO
                    </TabsTrigger>
                    <TabsTrigger value="fab" className="flex items-center gap-1.5 text-xs">
                      <MessageCircle className="h-3.5 w-3.5" />
                      FAB
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="properties" className="flex-1 m-0 overflow-y-auto">
                  <PropsPanel />
                </TabsContent>
                <TabsContent value="seo" className="flex-1 m-0 overflow-hidden">
                  <SeoPanel
                    pageId={pageId}
                    pageSlug={pageSlug}
                    initialSeoData={initialSeoData || undefined}
                    onSave={handleSaveSeo}
                    isSaving={isSavingSeo}
                  />
                </TabsContent>
                <TabsContent value="fab" className="flex-1 m-0 overflow-hidden">
                  <FabPanel
                    pageId={pageId}
                    initialConfig={initialFabConfig || undefined}
                    onSave={handleSaveFab}
                    isSaving={isSavingFab}
                  />
                </TabsContent>
              </Tabs>
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
  initialSeoData,
  initialFabConfig,
}: PageBuilderProps) {
  const initialPage = {
    id: pageId,
    title: pageTitle,
    slug: pageSlug,
    status: pageStatus,
  }

  return (
    <PageBuilderProvider initialPage={initialPage} initialBlocks={initialBlocks}>
      <PageBuilderContent
        pageId={pageId}
        pageSlug={pageSlug}
        initialSeoData={initialSeoData}
        initialFabConfig={initialFabConfig}
      />
    </PageBuilderProvider>
  )
}
