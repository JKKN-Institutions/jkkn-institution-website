'use client'

import { v4 as uuidv4 } from 'uuid'
import type { BlockData } from '@/lib/cms/registry-types'

// Clipboard storage key in localStorage
const CLIPBOARD_KEY = 'page-builder-clipboard'

interface ClipboardData {
  type: 'block' | 'blocks'
  timestamp: number
  data: BlockData | BlockData[]
}

/**
 * Copy a block to the clipboard
 */
export function copyBlockToClipboard(block: BlockData): void {
  const clipboardData: ClipboardData = {
    type: 'block',
    timestamp: Date.now(),
    data: { ...block },
  }

  try {
    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(clipboardData))
  } catch (error) {
    console.error('Failed to copy block to clipboard:', error)
  }
}

/**
 * Copy multiple blocks to the clipboard
 */
export function copyBlocksToClipboard(blocks: BlockData[]): void {
  const clipboardData: ClipboardData = {
    type: 'blocks',
    timestamp: Date.now(),
    data: blocks.map((block) => ({ ...block })),
  }

  try {
    localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(clipboardData))
  } catch (error) {
    console.error('Failed to copy blocks to clipboard:', error)
  }
}

/**
 * Get blocks from the clipboard
 * Returns null if clipboard is empty or expired (> 1 hour)
 */
export function getBlocksFromClipboard(): BlockData[] | null {
  try {
    const stored = localStorage.getItem(CLIPBOARD_KEY)
    if (!stored) return null

    const clipboardData: ClipboardData = JSON.parse(stored)

    // Check if clipboard data is expired (1 hour)
    const ONE_HOUR = 60 * 60 * 1000
    if (Date.now() - clipboardData.timestamp > ONE_HOUR) {
      localStorage.removeItem(CLIPBOARD_KEY)
      return null
    }

    if (clipboardData.type === 'block') {
      return [clipboardData.data as BlockData]
    }

    return clipboardData.data as BlockData[]
  } catch (error) {
    console.error('Failed to read clipboard:', error)
    return null
  }
}

/**
 * Check if there's something in the clipboard
 */
export function hasClipboardContent(): boolean {
  try {
    const stored = localStorage.getItem(CLIPBOARD_KEY)
    if (!stored) return false

    const clipboardData: ClipboardData = JSON.parse(stored)

    // Check if clipboard data is expired (1 hour)
    const ONE_HOUR = 60 * 60 * 1000
    if (Date.now() - clipboardData.timestamp > ONE_HOUR) {
      localStorage.removeItem(CLIPBOARD_KEY)
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Clear the clipboard
 */
export function clearClipboard(): void {
  try {
    localStorage.removeItem(CLIPBOARD_KEY)
  } catch (error) {
    console.error('Failed to clear clipboard:', error)
  }
}

/**
 * Prepare pasted blocks with new IDs
 * Handles parent-child relationships by mapping old IDs to new IDs
 */
export function preparePastedBlocks(
  blocks: BlockData[],
  insertAtIndex?: number,
  targetParentId?: string | null
): BlockData[] {
  // Create a map of old IDs to new IDs
  const idMap = new Map<string, string>()

  // First pass: generate new IDs
  blocks.forEach((block) => {
    idMap.set(block.id, uuidv4())
  })

  // Second pass: create new blocks with updated IDs and parent references
  return blocks.map((block, index) => {
    const newId = idMap.get(block.id) || uuidv4()

    // Determine parent ID
    let newParentId: string | null = null
    if (block.parent_block_id) {
      // If the parent was also copied, use the new parent ID
      const mappedParentId = idMap.get(block.parent_block_id)
      if (mappedParentId) {
        newParentId = mappedParentId
      } else if (targetParentId !== undefined) {
        // Otherwise, use the target parent
        newParentId = targetParentId
      }
    } else if (targetParentId !== undefined) {
      // Root block being pasted into a container
      newParentId = targetParentId
    }

    // Calculate sort order
    let sortOrder = block.sort_order
    if (insertAtIndex !== undefined && block.parent_block_id === null) {
      sortOrder = insertAtIndex + index
    }

    return {
      ...block,
      id: newId,
      parent_block_id: newParentId,
      sort_order: sortOrder,
    }
  })
}

/**
 * Get a block and all its children (recursively)
 */
export function getBlockWithChildren(
  blockId: string,
  allBlocks: BlockData[]
): BlockData[] {
  const result: BlockData[] = []
  const block = allBlocks.find((b) => b.id === blockId)

  if (!block) return result

  result.push(block)

  // Find all children recursively
  const children = allBlocks.filter((b) => b.parent_block_id === blockId)
  for (const child of children) {
    result.push(...getBlockWithChildren(child.id, allBlocks))
  }

  return result
}
