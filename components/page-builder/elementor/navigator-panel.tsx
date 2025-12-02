'use client'

import { useState, useCallback } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { getComponentEntry, supportsChildren } from '@/lib/cms/component-registry'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  GripVertical,
  Search,
  Layers,
  X,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BlockData } from '@/lib/cms/registry-types'

interface NavigatorPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NavigatorPanel({ isOpen, onClose }: NavigatorPanelProps) {
  const {
    state,
    selectBlock,
    deleteBlock,
    duplicateBlock,
    updateBlockVisibility,
    getRootBlocks,
    getChildBlocks,
  } = usePageBuilder()
  const { blocks, selectedBlockId } = state
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleSelect = useCallback((id: string) => {
    selectBlock(id)
  }, [selectBlock])

  const handleDelete = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteBlock(id)
  }, [deleteBlock])

  const handleDuplicate = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    duplicateBlock(id)
  }, [duplicateBlock])

  const handleToggleVisibility = useCallback((e: React.MouseEvent, id: string, isVisible: boolean) => {
    e.stopPropagation()
    updateBlockVisibility(id, !isVisible)
  }, [updateBlockVisibility])

  // Filter blocks based on search
  const filterBlocks = useCallback((blocks: BlockData[]): BlockData[] => {
    if (!searchQuery) return blocks
    const query = searchQuery.toLowerCase()
    return blocks.filter((block) => {
      const entry = getComponentEntry(block.component_name)
      return (
        entry?.displayName.toLowerCase().includes(query) ||
        block.component_name.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  // Recursive tree renderer
  const BlockTreeItem = ({ block, depth = 0 }: { block: BlockData; depth?: number }) => {
    const entry = getComponentEntry(block.component_name)
    const isContainer = supportsChildren(block.component_name)
    const children = getChildBlocks(block.id)
    const isExpanded = expandedIds.has(block.id)
    const isSelected = selectedBlockId === block.id

    // Get icon component
    const iconName = entry?.icon as keyof typeof LucideIcons
    const IconComponent = (LucideIcons[iconName] as LucideIcon) || Layers

    return (
      <div>
        <div
          onClick={() => handleSelect(block.id)}
          className={cn(
            'flex items-center gap-1 py-1.5 px-2 cursor-pointer rounded-md transition-colors group',
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted',
            !block.is_visible && 'opacity-50'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {/* Expand/Collapse */}
          {isContainer && children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(block.id)
              }}
              className="p-0.5 hover:bg-background/20 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Drag Handle */}
          <GripVertical className="h-3 w-3 text-muted-foreground/50 group-hover:text-muted-foreground" />

          {/* Icon */}
          <IconComponent className="h-3.5 w-3.5" />

          {/* Name */}
          <span className="flex-1 text-xs font-medium truncate">
            {entry?.displayName || block.component_name}
          </span>

          {/* Actions - visible on hover */}
          <div className={cn(
            'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
            isSelected && 'opacity-100'
          )}>
            <button
              onClick={(e) => handleToggleVisibility(e, block.id, block.is_visible)}
              className="p-1 hover:bg-background/20 rounded"
              title={block.is_visible ? 'Hide' : 'Show'}
            >
              {block.is_visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={(e) => handleDuplicate(e, block.id)}
              className="p-1 hover:bg-background/20 rounded"
              title="Duplicate"
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => handleDelete(e, block.id)}
              className="p-1 hover:bg-destructive/20 hover:text-destructive rounded"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Children */}
        {isContainer && isExpanded && children.length > 0 && (
          <div>
            {children.map((child) => (
              <BlockTreeItem key={child.id} block={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  const rootBlocks = getRootBlocks()
  const filteredBlocks = filterBlocks(rootBlocks)

  return (
    <div className="fixed left-[280px] top-[57px] bottom-0 w-[260px] bg-card border-r border-border z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Navigator</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredBlocks.length > 0 ? (
            filteredBlocks.map((block) => (
              <BlockTreeItem key={block.id} block={block} />
            ))
          ) : searchQuery ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No elements found</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Layers className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No elements yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag elements from the left panel
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{blocks.length} elements</span>
          <span>
            {blocks.filter((b) => !b.is_visible).length} hidden
          </span>
        </div>
      </div>
    </div>
  )
}
