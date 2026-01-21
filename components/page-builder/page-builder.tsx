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
import { SeoPanel, FabPanel, FooterPanel, PageTypographyPanel, type FabConfig } from './panels-lazy'
import { UnifiedRightPanel } from './right-panel-unified'
import type { FooterSettings } from '@/app/actions/cms/footer'
import { TopToolbar } from './toolbar/top-toolbar'
import { NavigatorPanel } from './elementor/navigator-panel'
import { updatePageContent, updatePageSeo, updatePageFab, updatePageTypography } from '@/app/actions/cms/pages'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import { updateFooterSettings } from '@/app/actions/settings'
import { toast } from 'sonner'
import type { BlockData } from '@/lib/cms/registry-types'
import { blocksToPageBlocks, type PageBlock } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'
import { getComponentEntry, supportsChildren } from '@/lib/cms/component-registry'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Search, MessageCircle, Component, Settings2, FileText, Type, PanelRightClose, PanelRightOpen } from 'lucide-react'
import type { SeoData } from '@/lib/utils/seo-analyzer'
import type { LayoutPreset } from '@/lib/cms/layout-presets'
import { OfflineBanner } from '@/lib/hooks/use-network-status'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { ResizablePanel } from './resizable-panel'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { StatusBar } from './status-bar'

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
  pageStatus: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived' | 'scheduled'
  initialBlocks: BlockData[]
  initialSeoData?: SeoMetadata | null
  initialFabConfig?: Partial<FabConfig> | null
  initialFooterSettings?: FooterSettings | null
  initialTypography?: Partial<PageTypographySettings> | null
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
  initialFooterSettings,
  initialTypography,
}: {
  pageId: string
  pageSlug: string
  initialSeoData?: SeoMetadata | null
  initialFabConfig?: Partial<FabConfig> | null
  initialFooterSettings?: FooterSettings | null
  initialTypography?: Partial<PageTypographySettings> | null
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
    updateBlockFull,
    // Clipboard and editing actions
    copyBlock,
    cutBlock,
    pasteBlock,
    deleteBlock,
    duplicateBlock,
    selectBlock,
    undo,
    redo,
    // Computed values
    selectedBlock,
    canUndo,
    canRedo,
    hasClipboard,
  } = usePageBuilder()

  const { blocks, isDirty, isSaving, isPreviewMode, device } = state

  // Right panel saving states
  const [isSavingSeo, setIsSavingSeo] = useState(false)
  const [isSavingFab, setIsSavingFab] = useState(false)
  const [isSavingFooter, setIsSavingFooter] = useState(false)
  const [isSavingTypography, setIsSavingTypography] = useState(false)
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(initialFooterSettings || null)
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)
  const [autoSaveFailCount, setAutoSaveFailCount] = useState(0)

  // Mobile panel state
  const [mobileLeftPanel, setMobileLeftPanel] = useState(false)
  const [mobileRightPanel, setMobileRightPanel] = useState(false)

  // Panel collapse state (desktop) - hydration-safe pattern
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [panelStateInitialized, setPanelStateInitialized] = useState(false)

  // Load panel state from localStorage on mount (client-side only)
  useEffect(() => {
    const leftValue = localStorage.getItem('editor-left-panel-collapsed') === 'true'
    const rightValue = localStorage.getItem('editor-right-panel-collapsed') === 'true'
    setLeftPanelCollapsed(leftValue)
    setRightPanelCollapsed(rightValue)
    setPanelStateInitialized(true)
  }, [])

  // Persist panel collapse state (only after initial load to avoid overwriting)
  useEffect(() => {
    if (panelStateInitialized) {
      localStorage.setItem('editor-left-panel-collapsed', String(leftPanelCollapsed))
    }
  }, [leftPanelCollapsed, panelStateInitialized])

  useEffect(() => {
    if (panelStateInitialized) {
      localStorage.setItem('editor-right-panel-collapsed', String(rightPanelCollapsed))
    }
  }, [rightPanelCollapsed, panelStateInitialized])

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

          // Check if dropped onto a split-column drop zone
          if (overId.startsWith('split-') && over.data.current?.type === 'split-column') {
            const { parentId, columnIndex } = over.data.current as { parentId: string; columnIndex: number }
            if (parentId !== undefined && columnIndex !== undefined) {
              // Add block to the specific column with insertAt set to columnIndex
              addBlockToContainer(componentName, parentId, columnIndex)
              return
            }
          }

          // Check if dropped onto a container drop zone
          if (overId.startsWith('container-drop-')) {
            const containerId = over.data.current?.containerId
            if (containerId) {
              // Validate that the container supports children
              const containerBlock = blocks.find((b) => b.id === containerId)
              if (containerBlock && !supportsChildren(containerBlock.component_name)) {
                toast.error('This component does not support nested blocks')
                return
              }
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
            // Validate that the container supports children
            const containerBlock = blocks.find((b) => b.id === containerId)
            if (containerBlock && !supportsChildren(containerBlock.component_name)) {
              toast.error('This component does not support nested blocks')
              return
            }
            // Prevent moving a block into itself or its descendants
            const sourceBlock = blocks.find((b) => b.id === String(active.id))
            if (sourceBlock) {
              let checkId: string | null = containerId
              while (checkId) {
                if (checkId === sourceBlock.id) {
                  toast.error('Cannot move a block into itself')
                  return
                }
                const parent = blocks.find((b) => b.id === checkId)
                checkId = parent?.parent_block_id || null
              }
            }
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

  // Save handler with failure tracking
  const handleSave = useCallback(async (showToast = true) => {
    setSaving(true)
    try {
      const result = await updatePageContent(pageId, blocks)
      if (result.success) {
        markSaved()
        lastSavedBlocksRef.current = JSON.stringify(blocks)
        setAutoSaveFailCount(0) // Reset failure count on success
        if (showToast) {
          toast.success('Page saved successfully')
        }
      } else {
        // Track auto-save failures
        if (!showToast) {
          setAutoSaveFailCount(prev => {
            const newCount = prev + 1
            // Show warning after 2 consecutive failures
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
          toast.error(result.message || 'Failed to save page')
        }
      }
    } catch {
      // Track auto-save failures
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

  // Typography save handler
  const handleSaveTypography = useCallback(async (typography: PageTypographySettings) => {
    setIsSavingTypography(true)
    try {
      const result = await updatePageTypography(pageId, typography)
      if (result.success) {
        toast.success('Typography settings saved')
      } else {
        toast.error(result.message || 'Failed to save typography settings')
      }
    } catch {
      toast.error('An error occurred while saving typography settings')
    } finally {
      setIsSavingTypography(false)
    }
  }, [pageId])

  // Footer save handler
  const handleSaveFooter = useCallback(async (footerSettings: FooterSettings) => {
    console.log('[Footer] Save started with:', footerSettings)
    setIsSavingFooter(true)
    try {
      // Transform FooterSettings to the format expected by updateFooterSettings
      const payload = {
        tagline: footerSettings.tagline,
        description: footerSettings.description,
        institutions: footerSettings.institutions,
        programs: footerSettings.programs,
        resources: footerSettings.resources,
        show_about: footerSettings.sectionsVisibility.show_about,
        show_institutions: footerSettings.sectionsVisibility.show_institutions,
        show_programs: footerSettings.sectionsVisibility.show_programs,
        show_resources: footerSettings.sectionsVisibility.show_resources,
        show_social: footerSettings.sectionsVisibility.show_social,
        section_title_institutions: footerSettings.sectionTitles?.institutions || 'Our Institutions',
        section_title_programs: footerSettings.sectionTitles?.programs || 'Programs',
        section_title_resources: footerSettings.sectionTitles?.resources || 'Resources',
        contactEmail: footerSettings.contactEmail,
        contactPhone: footerSettings.contactPhone,
        address_line1: footerSettings.address.line1,
        address_line2: footerSettings.address.line2,
        address_city: footerSettings.address.city,
        address_state: footerSettings.address.state,
        address_pincode: footerSettings.address.pincode,
        address_country: footerSettings.address.country,
        social_facebook: footerSettings.socialLinks?.facebook,
        social_twitter: footerSettings.socialLinks?.twitter,
        social_instagram: footerSettings.socialLinks?.instagram,
        social_linkedin: footerSettings.socialLinks?.linkedin,
        social_youtube: footerSettings.socialLinks?.youtube,
        map_embed_url: footerSettings.map?.embedUrl,
        map_link_url: footerSettings.map?.linkUrl,
      }
      console.log('[Footer] Sending payload:', payload)
      const result = await updateFooterSettings(payload)
      console.log('[Footer] Save result:', result)
      if (result.success) {
        // Update local state for real-time preview
        setFooterSettings(footerSettings)
        toast.success('Footer settings saved')
      } else {
        toast.error(result.message || 'Failed to save footer settings')
        console.error('[Footer] Save failed:', result.message)
      }
    } catch (error) {
      console.error('[Footer] Save error:', error)
      toast.error('An error occurred while saving footer settings')
    } finally {
      setIsSavingFooter(false)
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea/contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Skip shortcuts in preview mode except for toggling preview
      if (isPreviewMode) return

      const isMac = navigator.platform.includes('Mac')
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey

      // Save: Ctrl/Cmd + S
      if (ctrlKey && e.key === 's') {
        e.preventDefault()
        if (isDirty && !isSaving) {
          handleManualSave()
        }
        return
      }

      // Navigator: Ctrl/Cmd + L
      if (ctrlKey && e.key === 'l') {
        e.preventDefault()
        setIsNavigatorOpen((prev) => !prev)
        return
      }

      // Toggle Left Panel: Ctrl/Cmd + [
      if (ctrlKey && e.key === '[') {
        e.preventDefault()
        setLeftPanelCollapsed((prev) => !prev)
        return
      }

      // Toggle Right Panel: Ctrl/Cmd + ]
      if (ctrlKey && e.key === ']') {
        e.preventDefault()
        setRightPanelCollapsed((prev) => !prev)
        return
      }

      // Undo: Ctrl/Cmd + Z
      if (ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) {
          undo()
        }
        return
      }

      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      if ((ctrlKey && e.key === 'y') || (ctrlKey && e.shiftKey && e.key === 'z') || (ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault()
        if (canRedo) {
          redo()
        }
        return
      }

      // Copy: Ctrl/Cmd + C
      if (ctrlKey && e.key === 'c' && selectedBlock) {
        e.preventDefault()
        copyBlock(selectedBlock.id)
        toast.success('Block copied to clipboard')
        return
      }

      // Cut: Ctrl/Cmd + X
      if (ctrlKey && e.key === 'x' && selectedBlock) {
        e.preventDefault()
        cutBlock(selectedBlock.id)
        toast.success('Block cut to clipboard')
        return
      }

      // Paste: Ctrl/Cmd + V
      if (ctrlKey && e.key === 'v' && hasClipboard) {
        e.preventDefault()
        // Paste as sibling of selected block or at root level
        const parentId = selectedBlock?.parent_block_id ?? null
        pasteBlock(parentId)
        toast.success('Block pasted')
        return
      }

      // Duplicate: Ctrl/Cmd + D
      if (ctrlKey && e.key === 'd' && selectedBlock) {
        e.preventDefault()
        duplicateBlock(selectedBlock.id)
        toast.success('Block duplicated')
        return
      }

      // Delete: Delete or Backspace key
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlock) {
        e.preventDefault()
        deleteBlock(selectedBlock.id)
        return
      }

      // Escape: Deselect block
      if (e.key === 'Escape') {
        e.preventDefault()
        selectBlock(null)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isDirty,
    isSaving,
    isPreviewMode,
    handleManualSave,
    canUndo,
    canRedo,
    hasClipboard,
    selectedBlock,
    undo,
    redo,
    copyBlock,
    cutBlock,
    pasteBlock,
    duplicateBlock,
    deleteBlock,
    selectBlock,
  ])

  // Handle preset selection - adds preset blocks to the page
  const handlePresetSelect = useCallback((preset: LayoutPreset) => {
    // Add each block from the preset to the page
    preset.blocks.forEach((presetBlock) => {
      addBlock(
        presetBlock.component_name,
        undefined,                           // insertAt
        presetBlock.props,                   // props
        undefined,                           // parentId
        presetBlock.responsive_settings,     // responsive_settings
        presetBlock.custom_css,              // custom_css
        presetBlock.custom_classes           // custom_classes
      )
    })
  }, [addBlock])

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
        <TopToolbar
          onSave={handleManualSave}
          onPresetSelect={handlePresetSelect}
          isNavigatorOpen={isNavigatorOpen}
          onNavigatorToggle={() => setIsNavigatorOpen(!isNavigatorOpen)}
        />

        {/* Mobile FAB buttons - only visible on mobile/tablet */}
        {!isPreviewMode && (
          <>
            <div className="fixed bottom-6 pb-[env(safe-area-inset-bottom)] left-6 z-50 flex gap-3 lg:hidden">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={() => setMobileLeftPanel(true)}
                variant="secondary"
              >
                <Component className="h-5 w-5" />
                <span className="sr-only">Components</span>
              </Button>
            </div>

            <div className="fixed bottom-6 pb-[env(safe-area-inset-bottom)] right-6 z-50 flex gap-3 lg:hidden">
              <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={() => setMobileRightPanel(true)}
                variant="secondary"
              >
                <Settings2 className="h-5 w-5" />
                <span className="sr-only">Properties</span>
              </Button>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Component Palette (Desktop only) */}
          {!isPreviewMode && (
            <ResizablePanel
              side="left"
              defaultWidth={280}
              minWidth={200}
              maxWidth={400}
              storageKey="editor-left-panel"
              className="hidden lg:flex border-r border-border bg-card overflow-hidden"
              collapsed={leftPanelCollapsed}
              onToggle={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            >
              <ComponentPalette />
            </ResizablePanel>
          )}

          {/* Left Sidebar - Component Palette (Mobile/Tablet Sheet) */}
          {!isPreviewMode && (
            <Sheet open={mobileLeftPanel} onOpenChange={setMobileLeftPanel}>
              <SheetContent side="left" className="w-[280px] p-0 lg:hidden">
                <SheetTitle className="sr-only">Component Palette</SheetTitle>
                <ComponentPalette />
              </SheetContent>
            </Sheet>
          )}

          {/* Navigator Panel (Elementor-style layer tree) */}
          {!isPreviewMode && (
            <NavigatorPanel
              isOpen={isNavigatorOpen}
              onClose={() => setIsNavigatorOpen(false)}
            />
          )}

          {/* Center - Canvas */}
          <div className="flex-1 overflow-auto bg-muted/30 p-2 sm:p-4 md:p-6">
            <div
              className={cn(
                'mx-auto transition-all duration-300',
                getDeviceWidthClass(),
                device !== 'desktop' && 'shadow-lg my-4 bg-background rounded-lg overflow-hidden',
                isPreviewMode && 'bg-background'
              )}
            >
              {/* Show header/footer in preview mode for full page experience */}
              {isPreviewMode && <SiteHeader isPreview />}
              <BuilderCanvas />
              {isPreviewMode && footerSettings && <SiteFooter settings={footerSettings} />}
            </div>
          </div>

          {/* Right Sidebar - Properties/SEO/FAB Panel (Desktop only) */}
          {!isPreviewMode && (
            <ResizablePanel
              side="right"
              defaultWidth={380}
              minWidth={300}
              maxWidth={500}
              storageKey="editor-right-panel"
              className="hidden lg:flex border-l border-border bg-card min-h-0"
              collapsed={rightPanelCollapsed}
              onToggle={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            >
              <div className="flex flex-col h-full min-h-0">
                {/* Collapse button */}
                <div className="border-b border-border px-2 pt-2 flex-shrink-0 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0 hover:bg-primary/10"
                    onClick={() => setRightPanelCollapsed(true)}
                    title="Collapse panel (Ctrl+])"
                  >
                    <PanelRightOpen className="size-4" />
                  </Button>
                  <div className="flex-1 text-sm font-medium text-muted-foreground px-2">
                    {selectedBlock ? 'Component Settings' : 'Page Settings'}
                  </div>
                </div>

                {/* Unified Right Panel */}
                <UnifiedRightPanel
                  pageId={pageId}
                  pageSlug={pageSlug}
                  onSeoUpdate={handleSaveSeo}
                  onFabUpdate={handleSaveFab}
                  onTypographyUpdate={handleSaveTypography}
                  onFooterUpdate={handleSaveFooter}
                  isSavingSeo={isSavingSeo}
                  isSavingFab={isSavingFab}
                  isSavingTypography={isSavingTypography}
                  isSavingFooter={isSavingFooter}
                  initialSeoData={initialSeoData || undefined}
                  initialFabConfig={initialFabConfig || undefined}
                  initialTypography={initialTypography || undefined}
                  initialFooterSettings={footerSettings || undefined}
                />
              </div>
            </ResizablePanel>
          )}

          {/* Right Sidebar - Unified Panel (Mobile/Tablet Sheet) */}
          {!isPreviewMode && (
            <Sheet open={mobileRightPanel} onOpenChange={setMobileRightPanel}>
              <SheetContent side="right" className="w-full sm:w-[380px] p-0 lg:hidden">
                <SheetTitle className="sr-only">
                  {selectedBlock ? 'Component Settings' : 'Page Settings'}
                </SheetTitle>
                <UnifiedRightPanel
                  pageId={pageId}
                  pageSlug={pageSlug}
                  onSeoUpdate={handleSaveSeo}
                  onFabUpdate={handleSaveFab}
                  onTypographyUpdate={handleSaveTypography}
                  onFooterUpdate={handleSaveFooter}
                  isSavingSeo={isSavingSeo}
                  isSavingFab={isSavingFab}
                  isSavingTypography={isSavingTypography}
                  isSavingFooter={isSavingFooter}
                  initialSeoData={initialSeoData || undefined}
                  initialFabConfig={initialFabConfig || undefined}
                  initialTypography={initialTypography || undefined}
                  initialFooterSettings={footerSettings || undefined}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Bottom Status Bar - hidden in preview mode and on mobile */}
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

export function PageBuilder({
  pageId,
  pageTitle,
  pageSlug,
  pageStatus,
  initialBlocks,
  initialSeoData,
  initialFabConfig,
  initialFooterSettings,
  initialTypography,
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
        initialFooterSettings={initialFooterSettings}
        initialTypography={initialTypography}
      />
    </PageBuilderProvider>
  )
}
