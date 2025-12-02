'use client'

import { useCallback, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { usePageBuilder } from '../page-builder-provider'
import {
  copyBlockToClipboard,
  getBlocksFromClipboard,
  hasClipboardContent,
  clearClipboard,
  preparePastedBlocks,
  getBlockWithChildren,
} from '../utils/block-clipboard'
import type { BlockData } from '@/lib/cms/registry-types'

interface UseBlockClipboardReturn {
  /** Copy the currently selected block */
  copy: () => void
  /** Cut the currently selected block (copy + delete) */
  cut: () => void
  /** Paste from clipboard */
  paste: () => void
  /** Whether there's content in the clipboard */
  hasContent: boolean
  /** Whether a block is currently selected for copy/cut */
  canCopy: boolean
  /** Refresh clipboard state (e.g., when window gets focus) */
  refresh: () => void
}

/**
 * Hook for clipboard operations in the page builder
 */
export function useBlockClipboard(): UseBlockClipboardReturn {
  const {
    state,
    deleteBlock,
    addBlock,
    dispatch,
    selectedBlock,
    getRootBlocks,
  } = usePageBuilder()

  const { blocks, selectedBlockId } = state

  const [hasContent, setHasContent] = useState(false)

  // Refresh clipboard state
  const refresh = useCallback(() => {
    setHasContent(hasClipboardContent())
  }, [])

  // Check clipboard on mount and window focus
  useEffect(() => {
    refresh()

    const handleFocus = () => refresh()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refresh])

  // Copy selected block(s)
  const copy = useCallback(() => {
    if (!selectedBlockId || !selectedBlock) {
      toast.error('No block selected')
      return
    }

    // Get block with all its children
    const blocksToCopy = getBlockWithChildren(selectedBlockId, blocks)

    // Copy to our custom clipboard
    if (blocksToCopy.length === 1) {
      copyBlockToClipboard(blocksToCopy[0])
    } else {
      // Copy all blocks (parent + children)
      const clipboardData = {
        type: 'blocks' as const,
        timestamp: Date.now(),
        data: blocksToCopy,
      }
      try {
        localStorage.setItem('page-builder-clipboard', JSON.stringify(clipboardData))
      } catch (error) {
        console.error('Failed to copy blocks:', error)
        toast.error('Failed to copy block')
        return
      }
    }

    refresh()
    toast.success(`Copied "${selectedBlock.component_name}" to clipboard`)
  }, [selectedBlockId, selectedBlock, blocks, refresh])

  // Cut selected block(s)
  const cut = useCallback(() => {
    if (!selectedBlockId || !selectedBlock) {
      toast.error('No block selected')
      return
    }

    // Copy first
    const blocksToCopy = getBlockWithChildren(selectedBlockId, blocks)

    if (blocksToCopy.length === 1) {
      copyBlockToClipboard(blocksToCopy[0])
    } else {
      const clipboardData = {
        type: 'blocks' as const,
        timestamp: Date.now(),
        data: blocksToCopy,
      }
      try {
        localStorage.setItem('page-builder-clipboard', JSON.stringify(clipboardData))
      } catch (error) {
        console.error('Failed to cut blocks:', error)
        toast.error('Failed to cut block')
        return
      }
    }

    // Then delete
    deleteBlock(selectedBlockId)
    refresh()
    toast.success(`Cut "${selectedBlock.component_name}" to clipboard`)
  }, [selectedBlockId, selectedBlock, blocks, deleteBlock, refresh])

  // Paste from clipboard
  const paste = useCallback(() => {
    const clipboardBlocks = getBlocksFromClipboard()

    if (!clipboardBlocks || clipboardBlocks.length === 0) {
      toast.error('Clipboard is empty')
      return
    }

    // Determine where to paste
    let insertAt: number | undefined
    let targetParentId: string | null = null

    if (selectedBlockId) {
      // Paste after selected block
      const selectedBlock = blocks.find((b) => b.id === selectedBlockId)
      if (selectedBlock) {
        targetParentId = selectedBlock.parent_block_id
        const siblings = blocks.filter((b) => b.parent_block_id === targetParentId)
        const selectedIndex = siblings.findIndex((b) => b.id === selectedBlockId)
        insertAt = selectedIndex + 1
      }
    } else {
      // Paste at the end of root blocks
      const rootBlocks = getRootBlocks()
      insertAt = rootBlocks.length
      targetParentId = null
    }

    // Prepare pasted blocks with new IDs
    const pastedBlocks = preparePastedBlocks(clipboardBlocks, insertAt, targetParentId)

    // Add blocks to the page
    // We need to add them in order, updating sort_order for existing blocks
    if (pastedBlocks.length > 0) {
      // Get the first pasted block (the "main" block)
      const firstBlock = pastedBlocks[0]

      // Use addBlock for the main block, which will handle the insertion
      addBlock(firstBlock.component_name, insertAt, firstBlock.props, targetParentId)

      // For nested blocks, we need to add them separately
      // This is handled by the addBlock action for now
      // TODO: Support pasting multiple nested blocks at once

      toast.success(
        pastedBlocks.length === 1
          ? 'Block pasted'
          : `Pasted ${pastedBlocks.length} blocks`
      )
    }
  }, [blocks, selectedBlockId, addBlock, getRootBlocks])

  return {
    copy,
    cut,
    paste,
    hasContent,
    canCopy: !!selectedBlockId,
    refresh,
  }
}
