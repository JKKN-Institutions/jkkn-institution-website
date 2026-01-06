'use client'

import { Suspense, useCallback, useState, useEffect, type ReactNode, type CSSProperties } from 'react'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { usePageBuilder } from '../page-builder-provider'
import { BlockWrapper } from './block-wrapper'
import { EmptyCanvas } from './empty-canvas'
import { BlockErrorBoundary } from '../error-boundary'
import {
  getComponent,
  getComponentEntry,
  supportsChildren,
  subscribeToCustomComponentRegistry,
} from '@/lib/cms/component-registry'
import type { BlockData } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Loader2 } from 'lucide-react'
import {
  applyBlockStyles,
  applyMotionStyles,
  getMotionDataAttributes,
  getHoverTransform,
  parseCustomCss,
  type BlockStyles,
  type BlockMotion,
} from '../utils/style-applicator'
import { LivePreviewRenderer } from '../preview/live-preview-renderer'

interface SortableBlockProps {
  block: BlockData
  isSelected: boolean
  isPreviewMode: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onToggleVisibility: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  children?: ReactNode
  depth?: number
}

function SortableBlock({
  block,
  isSelected,
  isPreviewMode,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  canMoveUp,
  canMoveDown,
  children,
  depth = 0,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: isPreviewMode,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Get the component from registry
  const Component = getComponent(block.component_name)
  const entry = getComponentEntry(block.component_name)
  const isContainer = supportsChildren(block.component_name)

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Subscribe to registry updates to re-render when custom components are registered
  const [, forceUpdate] = useState(0)

  // State for hover effect (must be called unconditionally)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Only subscribe if component is not found (might be custom component loading)
    if (!Component || !entry) {
      return subscribeToCustomComponentRegistry(() => {
        forceUpdate(n => n + 1)
      })
    }
  }, [Component, entry])

  // Early return for unknown/loading components (AFTER all hooks)
  if (!Component || !entry) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
      >
        <div className="flex items-center gap-2 text-amber-700 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading component: {block.component_name}...</span>
        </div>
        <p className="text-amber-600 text-xs mt-1">
          Custom component is being loaded from the registry
        </p>
      </div>
    )
  }

  // Check for AI enhancement background gradient
  const backgroundGradient = block.props._backgroundGradient as string | undefined

  // Extract styles and motion from block props
  const blockStyles = block.props._styles as BlockStyles | undefined
  const blockMotion = block.props._motion as BlockMotion | undefined
  const customCss = block.custom_css

  // Combine all styles
  const appliedStyles: CSSProperties = {
    ...applyBlockStyles(blockStyles),
    ...applyMotionStyles(blockMotion),
    ...(customCss ? parseCustomCss(customCss) : {}),
  }

  // Get motion data attributes for JS-based animations
  const motionDataAttrs = getMotionDataAttributes(blockMotion)

  // Get hover transform for motion effects
  const hoverTransform = getHoverTransform(blockMotion)

  // Apply hover transform when hovered (isHovered state is declared at top of component)
  const finalStyles: CSSProperties = {
    ...appliedStyles,
    ...(isHovered && hoverTransform ? { transform: hoverTransform } : {}),
  }

  return (
    <div ref={setNodeRef} style={style}>
      <BlockWrapper
        block={block}
        displayName={entry.displayName}
        isSelected={isSelected}
        isPreviewMode={isPreviewMode}
        isDragging={isDragging}
        onSelect={onSelect}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onToggleVisibility={onToggleVisibility}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        dragHandleProps={{ ...attributes, ...listeners }}
        isContainer={isContainer}
        depth={depth}
      >
        {/* Apply custom_classes wrapper with styles and motion */}
        <div
          className={cn('relative', block.custom_classes)}
          style={finalStyles}
          data-page-builder-block
          onMouseEnter={() => hoverTransform && setIsHovered(true)}
          onMouseLeave={() => hoverTransform && setIsHovered(false)}
          {...motionDataAttrs}
        >
          {/* Background gradient overlay for AI enhancements */}
          {backgroundGradient && (
            <div className={cn('absolute inset-0 pointer-events-none rounded-inherit', backgroundGradient)} />
          )}
          <BlockErrorBoundary blockId={block.id} blockName={entry.displayName}>
            <Suspense fallback={<BlockSkeleton />}>
              <Component
                {...block.props}
                id={block.id}
                isEditing={!isPreviewMode}
                isSelected={isSelected}
              >
                {children}
              </Component>
            </Suspense>
          </BlockErrorBoundary>
        </div>
      </BlockWrapper>
    </div>
  )
}

function BlockSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

// Container drop zone for nested blocks
interface ContainerDropZoneProps {
  containerId: string
  isPreviewMode: boolean
  onAddBlock: (componentName: string) => void
}

function ContainerDropZone({ containerId, isPreviewMode, onAddBlock }: ContainerDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `container-drop-${containerId}`,
    data: { containerId },
  })

  if (isPreviewMode) return null

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer group",
        isOver
          ? "border-primary bg-primary/10"
          : "border-border/30 hover:border-primary/50"
      )}
      onClick={() => onAddBlock('Heading')}
    >
      <div className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
        <Plus className="h-4 w-4" />
        <span className="text-xs">
          {isOver ? 'Drop here' : 'Add block to container'}
        </span>
      </div>
    </div>
  )
}

// Recursive block renderer for nested blocks
interface BlockTreeProps {
  blocks: BlockData[]
  parentId: string | null
  selectedBlockId: string | null
  isPreviewMode: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onToggleVisibility: (id: string) => void
  onAddToContainer: (componentName: string, containerId: string) => void
  depth?: number
}

function BlockTree({
  blocks,
  parentId,
  selectedBlockId,
  isPreviewMode,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onAddToContainer,
  depth = 0,
}: BlockTreeProps) {
  // Get blocks at this level, sorted by sort_order
  const levelBlocks = blocks
    .filter(b => b.parent_block_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <SortableContext items={levelBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
      <div className={cn("space-y-0", depth > 0 && "pl-0")}>
        {levelBlocks.map((block, index) => {
          const isContainer = supportsChildren(block.component_name)
          const childBlocks = blocks.filter(b => b.parent_block_id === block.id)

          return (
            <SortableBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              isPreviewMode={isPreviewMode}
              onSelect={() => onSelect(block.id)}
              onDelete={() => onDelete(block.id)}
              onDuplicate={() => onDuplicate(block.id)}
              onMoveUp={() => onMoveUp(block.id)}
              onMoveDown={() => onMoveDown(block.id)}
              onToggleVisibility={() => onToggleVisibility(block.id)}
              canMoveUp={index > 0}
              canMoveDown={index < levelBlocks.length - 1}
              depth={depth}
            >
              {isContainer && (
                <>
                  {childBlocks.length > 0 ? (
                    <BlockTree
                      blocks={blocks}
                      parentId={block.id}
                      selectedBlockId={selectedBlockId}
                      isPreviewMode={isPreviewMode}
                      onSelect={onSelect}
                      onDelete={onDelete}
                      onDuplicate={onDuplicate}
                      onMoveUp={onMoveUp}
                      onMoveDown={onMoveDown}
                      onToggleVisibility={onToggleVisibility}
                      onAddToContainer={onAddToContainer}
                      depth={depth + 1}
                    />
                  ) : (
                    <ContainerDropZone
                      containerId={block.id}
                      isPreviewMode={isPreviewMode}
                      onAddBlock={(name) => onAddToContainer(name, block.id)}
                    />
                  )}
                </>
              )}
            </SortableBlock>
          )
        })}
      </div>
    </SortableContext>
  )
}

export function BuilderCanvas() {
  const {
    state,
    addBlock,
    addBlockToContainer,
    selectBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    updateBlockVisibility,
    getRootBlocks,
    zoom,
  } = usePageBuilder()

  const { blocks, selectedBlockId, isPreviewMode } = state

  // Calculate zoom transform style
  const zoomStyle: CSSProperties = zoom !== 100
    ? {
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top center',
        width: `${10000 / zoom}%`,
        marginLeft: `${(100 - (10000 / zoom)) / 2}%`,
      }
    : {}

  // Make canvas a drop target for palette items
  const { setNodeRef: setDropZoneRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  })

  const handleBlockSelect = useCallback(
    (blockId: string) => {
      if (!isPreviewMode) {
        selectBlock(blockId)
      }
    },
    [isPreviewMode, selectBlock]
  )

  const handleBlockDelete = useCallback(
    (blockId: string) => {
      deleteBlock(blockId)
    },
    [deleteBlock]
  )

  const handleBlockDuplicate = useCallback(
    (blockId: string) => {
      duplicateBlock(blockId)
    },
    [duplicateBlock]
  )

  const handleBlockMoveUp = useCallback(
    (blockId: string) => {
      moveBlock(blockId, 'up')
    },
    [moveBlock]
  )

  const handleBlockMoveDown = useCallback(
    (blockId: string) => {
      moveBlock(blockId, 'down')
    },
    [moveBlock]
  )

  const handleBlockToggleVisibility = useCallback(
    (blockId: string) => {
      const block = blocks.find((b) => b.id === blockId)
      if (block) {
        updateBlockVisibility(blockId, !block.is_visible)
      }
    },
    [blocks, updateBlockVisibility]
  )

  const handleAddToContainer = useCallback(
    (componentName: string, containerId: string) => {
      addBlockToContainer(componentName, containerId)
    },
    [addBlockToContainer]
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if clicking directly on canvas, not on a block
      if (e.target === e.currentTarget) {
        selectBlock(null)
      }
    },
    [selectBlock]
  )

  const rootBlocks = getRootBlocks()

  // Callbacks for empty canvas quick actions
  const handleBrowseTemplates = useCallback(() => {
    // Dispatch custom event that top-toolbar listens for
    window.dispatchEvent(new CustomEvent('page-builder:open-templates'))
  }, [])

  const handleBrowseBlocks = useCallback(() => {
    // Dispatch custom event to focus the component palette
    window.dispatchEvent(new CustomEvent('page-builder:focus-palette'))
  }, [])

  if (rootBlocks.length === 0 && !isPreviewMode) {
    return (
      <div style={zoomStyle}>
        <EmptyCanvas
          onAddBlock={(name) => addBlock(name)}
          onBrowseTemplates={handleBrowseTemplates}
          onBrowseBlocks={handleBrowseBlocks}
        />
      </div>
    )
  }

  // In preview mode, use LivePreviewRenderer for WYSIWYG experience
  // This renders blocks exactly as they appear on the live site
  if (isPreviewMode) {
    return (
      <div className="min-h-full" style={zoomStyle}>
        <LivePreviewRenderer blocks={blocks} />
      </div>
    )
  }

  // Edit mode - use BlockTree with builder chrome (selection, drag/drop, etc.)
  return (
    <div
      className={cn(
        'min-h-full',
        'p-4'
      )}
      style={zoomStyle}
      onClick={handleCanvasClick}
    >
      <BlockTree
        blocks={blocks}
        parentId={null}
        selectedBlockId={selectedBlockId}
        isPreviewMode={isPreviewMode}
        onSelect={handleBlockSelect}
        onDelete={handleBlockDelete}
        onDuplicate={handleBlockDuplicate}
        onMoveUp={handleBlockMoveUp}
        onMoveDown={handleBlockMoveDown}
        onToggleVisibility={handleBlockToggleVisibility}
        onAddToContainer={handleAddToContainer}
      />

      {/* Drop zone at the end */}
      <div
        ref={setDropZoneRef}
        className={cn(
          "mt-4 p-8 border-2 border-dashed rounded-lg text-center transition-colors",
          isOver
            ? "border-primary bg-primary/10"
            : "border-border/50 hover:border-primary/50"
        )}
        onClick={() => addBlock('Heading')}
      >
        <p className="text-sm text-muted-foreground">
          {isOver ? 'Drop here to add component' : 'Drag components here or click to add a new block'}
        </p>
      </div>
    </div>
  )
}
