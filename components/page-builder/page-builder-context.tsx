'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { BlockData, PageBuilderContextValue } from '@/lib/cms/registry-types'
import { getDefaultProps } from '@/lib/cms/component-registry'

interface PageBuilderProviderProps {
  children: ReactNode
  initialBlocks?: BlockData[]
  onSave?: (blocks: BlockData[]) => Promise<void>
}

const PageBuilderContext = createContext<PageBuilderContextValue | null>(null)

export function usePageBuilder(): PageBuilderContextValue {
  const context = useContext(PageBuilderContext)
  if (!context) {
    throw new Error('usePageBuilder must be used within a PageBuilderProvider')
  }
  return context
}

export function PageBuilderProvider({
  children,
  initialBlocks = [],
  onSave,
}: PageBuilderProviderProps) {
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [history, setHistory] = useState<BlockData[][]>([initialBlocks])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Track if there are unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(blocks) !== JSON.stringify(initialBlocks)
  }, [blocks, initialBlocks])

  // Add to history
  const addToHistory = useCallback((newBlocks: BlockData[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newBlocks)
      return newHistory.slice(-50) // Keep last 50 states
    })
    setHistoryIndex((prev) => Math.min(prev + 1, 49))
  }, [historyIndex])

  // Select a block
  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id)
  }, [])

  // Add a new block
  const addBlock = useCallback(
    (componentName: string, props?: Record<string, unknown>, insertAt?: number) => {
      const newBlock: BlockData = {
        id: uuidv4(),
        component_name: componentName,
        props: props || getDefaultProps(componentName),
        sort_order: insertAt ?? blocks.length,
        parent_block_id: null,
        is_visible: true,
      }

      setBlocks((prev) => {
        let newBlocks: BlockData[]
        if (insertAt !== undefined) {
          newBlocks = [
            ...prev.slice(0, insertAt),
            newBlock,
            ...prev.slice(insertAt).map((b, i) => ({ ...b, sort_order: insertAt + i + 1 })),
          ]
        } else {
          newBlocks = [...prev, newBlock]
        }
        addToHistory(newBlocks)
        return newBlocks
      })

      setSelectedBlockId(newBlock.id)
    },
    [blocks.length, addToHistory]
  )

  // Update a block
  const updateBlock = useCallback(
    (id: string, updates: Partial<BlockData>) => {
      setBlocks((prev) => {
        const newBlocks = prev.map((block) =>
          block.id === id ? { ...block, ...updates } : block
        )
        addToHistory(newBlocks)
        return newBlocks
      })
    },
    [addToHistory]
  )

  // Delete a block
  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        const newBlocks = prev
          .filter((block) => block.id !== id)
          .map((block, index) => ({ ...block, sort_order: index }))
        addToHistory(newBlocks)
        return newBlocks
      })

      if (selectedBlockId === id) {
        setSelectedBlockId(null)
      }
    },
    [selectedBlockId, addToHistory]
  )

  // Duplicate a block
  const duplicateBlock = useCallback(
    (id: string) => {
      const blockToDuplicate = blocks.find((b) => b.id === id)
      if (!blockToDuplicate) return

      const newBlock: BlockData = {
        ...blockToDuplicate,
        id: uuidv4(),
        sort_order: blockToDuplicate.sort_order + 1,
      }

      setBlocks((prev) => {
        const newBlocks = [
          ...prev.slice(0, blockToDuplicate.sort_order + 1),
          newBlock,
          ...prev.slice(blockToDuplicate.sort_order + 1).map((b) => ({
            ...b,
            sort_order: b.sort_order + 1,
          })),
        ]
        addToHistory(newBlocks)
        return newBlocks
      })

      setSelectedBlockId(newBlock.id)
    },
    [blocks, addToHistory]
  )

  // Move a block up or down
  const moveBlock = useCallback(
    (id: string, direction: 'up' | 'down') => {
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id)
        if (index === -1) return prev

        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= prev.length) return prev

        const newBlocks = [...prev]
        const [removed] = newBlocks.splice(index, 1)
        newBlocks.splice(newIndex, 0, removed)

        const reorderedBlocks = newBlocks.map((block, i) => ({
          ...block,
          sort_order: i,
        }))
        addToHistory(reorderedBlocks)
        return reorderedBlocks
      })
    },
    [addToHistory]
  )

  // Reorder blocks (for drag and drop)
  const reorderBlocks = useCallback(
    (startIndex: number, endIndex: number) => {
      setBlocks((prev) => {
        const newBlocks = [...prev]
        const [removed] = newBlocks.splice(startIndex, 1)
        newBlocks.splice(endIndex, 0, removed)

        const reorderedBlocks = newBlocks.map((block, i) => ({
          ...block,
          sort_order: i,
        }))
        addToHistory(reorderedBlocks)
        return reorderedBlocks
      })
    },
    [addToHistory]
  )

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setBlocks(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setBlocks(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const value: PageBuilderContextValue = {
    blocks,
    selectedBlockId,
    selectBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    reorderBlocks,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    isDirty,
    isSaving,
  }

  return (
    <PageBuilderContext.Provider value={value}>
      {children}
    </PageBuilderContext.Provider>
  )
}
