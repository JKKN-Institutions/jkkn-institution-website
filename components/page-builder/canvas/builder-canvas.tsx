'use client'

import { Suspense, useCallback } from 'react'
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
import { getComponent, getComponentEntry } from '@/lib/cms/component-registry'
import type { BlockData } from '@/lib/cms/registry-types'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

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

  if (!Component || !entry) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <p className="text-red-600 text-sm">
          Unknown component: {block.component_name}
        </p>
      </div>
    )
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
      >
        <Suspense fallback={<BlockSkeleton />}>
          <Component
            {...block.props}
            id={block.id}
            isEditing={!isPreviewMode}
            isSelected={isSelected}
          />
        </Suspense>
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

export function BuilderCanvas() {
  const {
    state,
    addBlock,
    selectBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    updateBlockVisibility,
  } = usePageBuilder()

  const { blocks, selectedBlockId, isPreviewMode } = state

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

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if clicking directly on canvas, not on a block
      if (e.target === e.currentTarget) {
        selectBlock(null)
      }
    },
    [selectBlock]
  )

  if (blocks.length === 0 && !isPreviewMode) {
    return (
      <EmptyCanvas onAddBlock={(name) => addBlock(name)} />
    )
  }

  return (
    <div
      className={cn(
        'min-h-full',
        !isPreviewMode && 'p-4'
      )}
      onClick={handleCanvasClick}
    >
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-0">
          {blocks.map((block, index) => (
            <SortableBlock
              key={block.id}
              block={block}
              isSelected={selectedBlockId === block.id}
              isPreviewMode={isPreviewMode}
              onSelect={() => handleBlockSelect(block.id)}
              onDelete={() => handleBlockDelete(block.id)}
              onDuplicate={() => handleBlockDuplicate(block.id)}
              onMoveUp={() => handleBlockMoveUp(block.id)}
              onMoveDown={() => handleBlockMoveDown(block.id)}
              onToggleVisibility={() => handleBlockToggleVisibility(block.id)}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drop zone at the end */}
      {!isPreviewMode && (
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
      )}
    </div>
  )
}
