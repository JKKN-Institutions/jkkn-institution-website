'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { cn } from '@/lib/utils'
import {
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Clipboard,
  ClipboardPaste,
  Layers,
  Save,
  Code,
  Edit3,
} from 'lucide-react'

interface Position {
  x: number
  y: number
}

interface ContextMenuProps {
  blockId: string | null
  position: Position | null
  onClose: () => void
}

export function BlockContextMenu({ blockId, position, onClose }: ContextMenuProps) {
  const {
    state,
    selectBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    updateBlockVisibility,
  } = usePageBuilder()
  const { blocks, selectedBlockId } = state
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null)

  const block = blocks.find((b) => b.id === blockId)

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Close on click outside
  useEffect(() => {
    const handleClick = () => onClose()
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [onClose])

  const handleCopy = useCallback(() => {
    if (blockId) {
      setCopiedBlockId(blockId)
      localStorage.setItem('copiedBlock', JSON.stringify(block))
      onClose()
    }
  }, [blockId, block, onClose])

  const handleDuplicate = useCallback(() => {
    if (blockId) {
      duplicateBlock(blockId)
      onClose()
    }
  }, [blockId, duplicateBlock, onClose])

  const handleDelete = useCallback(() => {
    if (blockId) {
      deleteBlock(blockId)
      onClose()
    }
  }, [blockId, deleteBlock, onClose])

  const handleMoveUp = useCallback(() => {
    if (blockId) {
      moveBlock(blockId, 'up')
      onClose()
    }
  }, [blockId, moveBlock, onClose])

  const handleMoveDown = useCallback(() => {
    if (blockId) {
      moveBlock(blockId, 'down')
      onClose()
    }
  }, [blockId, moveBlock, onClose])

  const handleToggleVisibility = useCallback(() => {
    if (blockId && block) {
      updateBlockVisibility(blockId, !block.is_visible)
      onClose()
    }
  }, [blockId, block, updateBlockVisibility, onClose])

  const handleEdit = useCallback(() => {
    if (blockId) {
      selectBlock(blockId)
      onClose()
    }
  }, [blockId, selectBlock, onClose])

  if (!position || !blockId || !block) return null

  const menuItems = [
    { type: 'divider' as const, label: 'Actions' },
    {
      icon: Edit3,
      label: 'Edit',
      shortcut: 'Click',
      onClick: handleEdit,
    },
    {
      icon: Copy,
      label: 'Copy',
      shortcut: 'Ctrl+C',
      onClick: handleCopy,
    },
    {
      icon: Clipboard,
      label: 'Duplicate',
      shortcut: 'Ctrl+D',
      onClick: handleDuplicate,
    },
    { type: 'divider' as const, label: 'Arrange' },
    {
      icon: ChevronUp,
      label: 'Move Up',
      shortcut: 'Ctrl+↑',
      onClick: handleMoveUp,
    },
    {
      icon: ChevronDown,
      label: 'Move Down',
      shortcut: 'Ctrl+↓',
      onClick: handleMoveDown,
    },
    { type: 'divider' as const, label: 'Visibility' },
    {
      icon: block.is_visible ? EyeOff : Eye,
      label: block.is_visible ? 'Hide' : 'Show',
      shortcut: 'Ctrl+H',
      onClick: handleToggleVisibility,
    },
    { type: 'divider' as const, label: 'Danger Zone' },
    {
      icon: Trash2,
      label: 'Delete',
      shortcut: 'Del',
      onClick: handleDelete,
      danger: true,
    },
  ]

  return (
    <div
      className="fixed z-[100] min-w-[200px] bg-popover border border-border rounded-lg shadow-xl py-1 animate-in fade-in-0 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'divider') {
          return (
            <div
              key={index}
              className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider"
            >
              {item.label}
            </div>
          )
        }

        const Icon = item.icon
        return (
          <button
            key={index}
            onClick={item.onClick}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
              item.danger
                ? 'hover:bg-destructive/10 hover:text-destructive'
                : 'hover:bg-accent'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-muted-foreground">{item.shortcut}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Hook to manage context menu state
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    blockId: string | null
    position: Position | null
  }>({
    blockId: null,
    position: null,
  })

  const openContextMenu = useCallback((blockId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setContextMenu({
      blockId,
      position: { x: event.clientX, y: event.clientY },
    })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu({ blockId: null, position: null })
  }, [])

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  }
}
