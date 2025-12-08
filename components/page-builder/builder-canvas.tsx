'use client'

import { Suspense, useCallback, useId } from 'react'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import {
  GripVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Settings2,
} from 'lucide-react'
import { getComponent, getComponentEntry } from '@/lib/cms/component-registry'
import type { BlockData } from '@/lib/cms/registry-types'
import { usePageBuilder } from './page-builder-context'

interface BuilderCanvasProps {
  className?: string
  isPreviewMode?: boolean
}

// Helper to parse custom CSS string into CSSProperties object
function parseCustomCss(cssString: string): React.CSSProperties {
  const styles: Record<string, string> = {}

  cssString.split(';').forEach((rule) => {
    const [property, value] = rule.split(':').map((s) => s.trim())
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      )
      styles[camelProperty] = value
    }
  })

  return styles as React.CSSProperties
}

interface SortableBlockProps {
  block: BlockData
  isSelected: boolean
  isPreview: boolean
  onSelect: () => void
}

function SortableBlock({ block, isSelected, isPreview, onSelect }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const { updateBlock, deleteBlock, duplicateBlock, moveBlock } = usePageBuilder()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Component = getComponent(block.component_name)
  const entry = getComponentEntry(block.component_name)

  if (!Component || !entry) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Component &quot;{block.component_name}&quot; not found
      </div>
    )
  }

  const toggleVisibility = () => {
    updateBlock(block.id, { is_visible: !block.is_visible })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'opacity-50',
        !block.is_visible && 'opacity-40'
      )}
    >
      {/* Block Controls (Edit Mode Only) */}
      {!isPreview && (
        <div
          className={cn(
            'absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10',
            isSelected && 'opacity-100'
          )}
        >
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 rounded bg-background border shadow-sm hover:bg-muted cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => moveBlock(block.id, 'up')}
            className="p-1.5 rounded bg-background border shadow-sm hover:bg-muted"
          >
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => moveBlock(block.id, 'down')}
            className="p-1.5 rounded bg-background border shadow-sm hover:bg-muted"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Block Actions (Edit Mode Only) */}
      {!isPreview && (
        <div
          className={cn(
            'absolute -right-2 -top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10',
            isSelected && 'opacity-100'
          )}
        >
          <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
            {entry.displayName}
          </span>
          <button
            onClick={toggleVisibility}
            className="p-1.5 rounded bg-background border shadow-sm hover:bg-muted"
            title={block.is_visible ? 'Hide' : 'Show'}
          >
            {block.is_visible ? (
              <Eye className="h-3 w-3 text-muted-foreground" />
            ) : (
              <EyeOff className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={() => duplicateBlock(block.id)}
            className="p-1.5 rounded bg-background border shadow-sm hover:bg-muted"
            title="Duplicate"
          >
            <Copy className="h-3 w-3 text-muted-foreground" />
          </button>
          <button
            onClick={onSelect}
            className="p-1.5 rounded bg-background border shadow-sm hover:bg-muted"
            title="Settings"
          >
            <Settings2 className="h-3 w-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => deleteBlock(block.id)}
            className="p-1.5 rounded bg-background border shadow-sm hover:bg-destructive hover:text-white"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Block Content */}
      <div
        onClick={!isPreview ? onSelect : undefined}
        className={cn(
          'relative transition-all duration-200',
          !isPreview && 'cursor-pointer',
          !isPreview && 'ring-2 ring-transparent hover:ring-primary/30',
          isSelected && !isPreview && 'ring-primary'
        )}
      >
        <Suspense
          fallback={
            <div className="p-8 bg-muted animate-pulse rounded-lg">
              Loading {entry.displayName}...
            </div>
          }
        >
          <Component
            {...block.props}
            id={block.id}
            isSelected={isSelected}
            isEditing={!isPreview}
            className={block.custom_classes}
            style={block.custom_css ? parseCustomCss(block.custom_css) : undefined}
          />
        </Suspense>
      </div>
    </div>
  )
}

export function BuilderCanvas({ className, isPreviewMode = false }: BuilderCanvasProps) {
  const { blocks, selectedBlockId, selectBlock, reorderBlocks, addBlock } = usePageBuilder()
  const [activeId, setActiveId] = useState<string | null>(null)

  // Stable ID for DndContext to prevent hydration mismatches
  const dndContextId = useId()

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(oldIndex, newIndex)
      }
    }

    setActiveId(null)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const componentName = e.dataTransfer.getData('component')
      if (componentName) {
        addBlock(componentName)
      }
    },
    [addBlock]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const sortedBlocks = [...blocks].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div
      className={cn(
        'flex-1 overflow-auto p-8 bg-muted/30',
        !isPreviewMode && 'pl-16',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="max-w-5xl mx-auto">
        {sortedBlocks.length === 0 ? (
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-16 text-center">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium mb-2">Start Building Your Page</p>
              <p className="text-sm">
                Drag components from the palette or click to add them here.
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            id={dndContextId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedBlocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sortedBlocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    isPreview={isPreviewMode}
                    onSelect={() => selectBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg shadow-lg">
                  Moving block...
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* Drop Zone at Bottom */}
        {sortedBlocks.length > 0 && !isPreviewMode && (
          <div
            className="mt-4 border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <p className="text-sm text-muted-foreground">
              Drop a component here to add it at the end
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
