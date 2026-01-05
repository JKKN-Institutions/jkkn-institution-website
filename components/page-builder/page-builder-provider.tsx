'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getDefaultProps, getComponentEntry } from '@/lib/cms/component-registry'
import type { BlockData } from '@/lib/cms/registry-types'

/**
 * Validate blocks against the component registry.
 *
 * NOTE: Custom components are loaded asynchronously from the database and may not
 * be registered in the registry yet during initial validation. Instead of filtering
 * out unknown components (which would exclude custom components), we keep all blocks
 * and let the canvas renderer handle any truly unknown components gracefully.
 *
 * This allows custom component blocks from the database to render once the
 * ComponentPalette has fetched and registered them in CUSTOM_COMPONENT_REGISTRY.
 */
function validateBlocks(blocks: BlockData[]): BlockData[] {
  // Log warnings for unknown components in development, but don't filter them out
  // They may be custom components that haven't been registered yet
  if (process.env.NODE_ENV === 'development') {
    const unknownComponents: string[] = []

    for (const block of blocks) {
      const entry = getComponentEntry(block.component_name)
      if (!entry) {
        unknownComponents.push(block.component_name)
      }
    }

    if (unknownComponents.length > 0) {
      console.info(
        `[PageBuilder] ${unknownComponents.length} component(s) not found in registry (may be custom components that will be registered later):`,
        [...new Set(unknownComponents)]
      )
    }
  }

  // Return all blocks - let the canvas renderer handle unknown components
  return blocks
}

// Page type (simplified for builder state)
interface CmsPage {
  id: string
  title: string
  slug: string
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived' | 'scheduled'
  scheduled_publish_at?: string | null
}

// State interface
interface PageBuilderState {
  page: CmsPage | null
  blocks: BlockData[]
  selectedBlockId: string | null
  device: 'desktop' | 'tablet' | 'mobile'
  zoom: number
  history: BlockData[][]
  historyIndex: number
  isDirty: boolean
  isSaving: boolean
  isPreviewMode: boolean
  clipboard: BlockData | null
  lastSavedAt: Date | null
}

// Action types
type PageBuilderAction =
  | { type: 'SET_PAGE'; payload: CmsPage }
  | { type: 'SET_BLOCKS'; payload: BlockData[] }
  | { type: 'ADD_BLOCK'; payload: { componentName: string; insertAt?: number; props?: Record<string, unknown>; parentId?: string | null } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; props: Record<string, unknown> } }
  | { type: 'UPDATE_BLOCK_FULL'; payload: { id: string; updates: Partial<BlockData> } }
  | { type: 'UPDATE_BLOCK_VISIBILITY'; payload: { id: string; isVisible: boolean } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'DUPLICATE_BLOCK'; payload: string }
  | { type: 'REORDER_BLOCKS'; payload: { startIndex: number; endIndex: number; parentId?: string | null } }
  | { type: 'MOVE_BLOCK'; payload: { id: string; direction: 'up' | 'down' } }
  | { type: 'MOVE_BLOCK_TO_CONTAINER'; payload: { blockId: string; targetContainerId: string | null; insertAt?: number } }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'COPY_BLOCK'; payload: string }
  | { type: 'CUT_BLOCK'; payload: string }
  | { type: 'PASTE_BLOCK'; payload?: { parentId?: string | null; insertAt?: number } }
  | { type: 'RESET_BLOCKS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_DEVICE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'MARK_DIRTY' }
  | { type: 'MARK_SAVED' }
  | { type: 'SET_SAVING'; payload: boolean }

// Initial state
const initialState: PageBuilderState = {
  page: null,
  blocks: [],
  selectedBlockId: null,
  device: 'desktop',
  zoom: 100,
  history: [],
  historyIndex: -1,
  isDirty: false,
  isSaving: false,
  isPreviewMode: false,
  clipboard: null,
  lastSavedAt: null,
}

// Max history entries
const MAX_HISTORY = 50

// Helper to push to history
function pushToHistory(state: PageBuilderState, blocks: BlockData[]): PageBuilderState {
  // Remove any future history if we're not at the end
  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(blocks)

  // Limit history size
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift()
  }

  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  }
}

// Reducer
function pageBuilderReducer(state: PageBuilderState, action: PageBuilderAction): PageBuilderState {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload,
      }

    case 'SET_BLOCKS': {
      const stateWithHistory = pushToHistory(state, action.payload)
      return {
        ...stateWithHistory,
        blocks: action.payload,
      }
    }

    case 'ADD_BLOCK': {
      const { componentName, insertAt, props, parentId } = action.payload

      // Get component entry - may be null for custom components being added
      // before the registry is fully loaded, but we still allow adding them
      const componentEntry = getComponentEntry(componentName)

      // Get default props from registry, or use empty object for custom components
      const defaultProps = componentEntry ? getDefaultProps(componentName) : {}

      // Get siblings (blocks with same parent)
      const siblings = state.blocks.filter(b => b.parent_block_id === (parentId || null))
      const maxSortOrder = siblings.length > 0
        ? Math.max(...siblings.map(b => b.sort_order)) + 1
        : 0

      const newBlock: BlockData = {
        id: uuidv4(),
        component_name: componentName,
        props: { ...defaultProps, ...props },
        sort_order: insertAt ?? maxSortOrder,
        parent_block_id: parentId || null,
        is_visible: true,
      }

      let newBlocks: BlockData[]
      if (parentId) {
        // Adding to a container - insert and reorder siblings
        const otherBlocks = state.blocks.filter(b => b.parent_block_id !== parentId)
        const siblingBlocks = state.blocks.filter(b => b.parent_block_id === parentId)

        if (insertAt !== undefined && insertAt < siblingBlocks.length) {
          const reorderedSiblings = [
            ...siblingBlocks.slice(0, insertAt),
            newBlock,
            ...siblingBlocks.slice(insertAt),
          ].map((block, index) => ({ ...block, sort_order: index }))
          newBlocks = [...otherBlocks, ...reorderedSiblings]
        } else {
          newBlocks = [...state.blocks, newBlock]
        }
      } else if (insertAt !== undefined) {
        // Root level insertion at specific position
        const rootBlocks = state.blocks.filter(b => b.parent_block_id === null)
        const nestedBlocks = state.blocks.filter(b => b.parent_block_id !== null)

        if (insertAt < rootBlocks.length) {
          const reorderedRoots = [
            ...rootBlocks.slice(0, insertAt),
            newBlock,
            ...rootBlocks.slice(insertAt),
          ].map((block, index) => ({ ...block, sort_order: index }))
          newBlocks = [...reorderedRoots, ...nestedBlocks]
        } else {
          newBlocks = [...state.blocks, newBlock]
        }
      } else {
        // Add at the end of root blocks
        newBlocks = [...state.blocks, newBlock]
      }

      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        selectedBlockId: newBlock.id,
        isDirty: true,
      }
    }

    case 'UPDATE_BLOCK': {
      const { id, props } = action.payload
      const newBlocks = state.blocks.map((block) =>
        block.id === id ? { ...block, props: { ...block.props, ...props } } : block
      )
      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        isDirty: true,
      }
    }

    case 'UPDATE_BLOCK_FULL': {
      const { id, updates } = action.payload
      const newBlocks = state.blocks.map((block) =>
        block.id === id ? { ...block, ...updates, props: { ...block.props, ...(updates.props || {}) } } : block
      )
      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        isDirty: true,
      }
    }

    case 'UPDATE_BLOCK_VISIBILITY': {
      const { id, isVisible } = action.payload
      const newBlocks = state.blocks.map((block) =>
        block.id === id ? { ...block, is_visible: isVisible } : block
      )
      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        isDirty: true,
      }
    }

    case 'DELETE_BLOCK': {
      // Also delete all nested children recursively
      const idsToDelete = new Set<string>([action.payload])
      let foundMore = true
      while (foundMore) {
        foundMore = false
        for (const block of state.blocks) {
          if (block.parent_block_id && idsToDelete.has(block.parent_block_id) && !idsToDelete.has(block.id)) {
            idsToDelete.add(block.id)
            foundMore = true
          }
        }
      }

      const deletedBlock = state.blocks.find(b => b.id === action.payload)
      const parentId = deletedBlock?.parent_block_id || null

      // Filter out deleted blocks and reorder siblings
      const remainingBlocks = state.blocks.filter((block) => !idsToDelete.has(block.id))

      // Reorder siblings with the same parent
      const siblings = remainingBlocks.filter(b => b.parent_block_id === parentId)
      const otherBlocks = remainingBlocks.filter(b => b.parent_block_id !== parentId)
      const reorderedSiblings = siblings
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((block, index) => ({ ...block, sort_order: index }))

      const newBlocks = [...otherBlocks, ...reorderedSiblings]

      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        selectedBlockId: idsToDelete.has(state.selectedBlockId || '') ? null : state.selectedBlockId,
        isDirty: true,
      }
    }

    case 'DUPLICATE_BLOCK': {
      const blockIndex = state.blocks.findIndex((b) => b.id === action.payload)
      if (blockIndex === -1) return state

      const blockToDuplicate = state.blocks[blockIndex]
      const newBlock: BlockData = {
        ...blockToDuplicate,
        id: uuidv4(),
        sort_order: blockIndex + 1,
      }

      const newBlocks = [
        ...state.blocks.slice(0, blockIndex + 1),
        newBlock,
        ...state.blocks.slice(blockIndex + 1),
      ].map((block, index) => ({ ...block, sort_order: index }))

      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        selectedBlockId: newBlock.id,
        isDirty: true,
      }
    }

    case 'REORDER_BLOCKS': {
      const { startIndex, endIndex } = action.payload
      const newBlocks = [...state.blocks]
      const [removed] = newBlocks.splice(startIndex, 1)
      newBlocks.splice(endIndex, 0, removed)

      // Update sort_order for all blocks
      const reorderedBlocks = newBlocks.map((block, index) => ({
        ...block,
        sort_order: index,
      }))

      const stateWithHistory = pushToHistory(state, reorderedBlocks)
      return {
        ...stateWithHistory,
        blocks: reorderedBlocks,
        isDirty: true,
      }
    }

    case 'MOVE_BLOCK': {
      const { id, direction } = action.payload
      const currentIndex = state.blocks.findIndex((b) => b.id === id)
      if (currentIndex === -1) return state

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= state.blocks.length) return state

      const newBlocks = [...state.blocks]
      const [removed] = newBlocks.splice(currentIndex, 1)
      newBlocks.splice(newIndex, 0, removed)

      // Update sort_order for all blocks
      const reorderedBlocks = newBlocks.map((block, index) => ({
        ...block,
        sort_order: index,
      }))

      const stateWithHistory = pushToHistory(state, reorderedBlocks)
      return {
        ...stateWithHistory,
        blocks: reorderedBlocks,
        isDirty: true,
      }
    }

    case 'MOVE_BLOCK_TO_CONTAINER': {
      const { blockId, targetContainerId, insertAt } = action.payload
      const block = state.blocks.find(b => b.id === blockId)
      if (!block) return state

      // Can't move a block into itself or its descendants
      if (targetContainerId) {
        let checkId: string | null = targetContainerId
        while (checkId) {
          if (checkId === blockId) return state // Would create circular reference
          const parent = state.blocks.find(b => b.id === checkId)
          checkId = parent?.parent_block_id || null
        }
      }

      const oldParentId = block.parent_block_id

      // Get all children of the block (they move with it)
      const childIds = new Set<string>()
      let foundMore = true
      while (foundMore) {
        foundMore = false
        for (const b of state.blocks) {
          if (b.parent_block_id && (childIds.has(b.parent_block_id) || b.parent_block_id === blockId) && !childIds.has(b.id)) {
            childIds.add(b.id)
            foundMore = true
          }
        }
      }

      // Calculate new sort order
      const targetSiblings = state.blocks.filter(
        b => b.parent_block_id === targetContainerId && b.id !== blockId && !childIds.has(b.id)
      ).sort((a, b) => a.sort_order - b.sort_order)

      const newSortOrder = insertAt !== undefined
        ? insertAt
        : targetSiblings.length

      // Update the block's parent and sort order
      let newBlocks = state.blocks.map(b => {
        if (b.id === blockId) {
          return { ...b, parent_block_id: targetContainerId, sort_order: newSortOrder }
        }
        return b
      })

      // Reorder old siblings
      if (oldParentId !== targetContainerId) {
        const oldSiblings = newBlocks
          .filter(b => b.parent_block_id === oldParentId && b.id !== blockId && !childIds.has(b.id))
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((b, i) => ({ ...b, sort_order: i }))

        newBlocks = newBlocks.map(b => {
          const updated = oldSiblings.find(s => s.id === b.id)
          return updated || b
        })
      }

      // Reorder new siblings (including the moved block)
      const finalTargetSiblings = newBlocks
        .filter(b => b.parent_block_id === targetContainerId && !childIds.has(b.id))
        .sort((a, b) => {
          if (a.id === blockId) return insertAt !== undefined ? insertAt - 0.5 : Number.MAX_VALUE
          if (b.id === blockId) return insertAt !== undefined ? 0.5 - insertAt : -Number.MAX_VALUE
          return a.sort_order - b.sort_order
        })
        .map((b, i) => ({ ...b, sort_order: i }))

      newBlocks = newBlocks.map(b => {
        const updated = finalTargetSiblings.find(s => s.id === b.id)
        return updated || b
      })

      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        isDirty: true,
      }
    }

    case 'SELECT_BLOCK':
      return {
        ...state,
        selectedBlockId: action.payload,
      }

    case 'COPY_BLOCK': {
      const blockToCopy = state.blocks.find(b => b.id === action.payload)
      if (!blockToCopy) return state

      // Create a copy with a new ID for pasting
      const copiedBlock: BlockData = {
        ...blockToCopy,
        id: uuidv4(),
        // Clear parent since it will be determined on paste
        parent_block_id: null,
      }

      return {
        ...state,
        clipboard: copiedBlock,
      }
    }

    case 'CUT_BLOCK': {
      const blockToCut = state.blocks.find(b => b.id === action.payload)
      if (!blockToCut) return state

      // Create a copy with a new ID for pasting
      const cutBlock: BlockData = {
        ...blockToCut,
        id: uuidv4(),
        parent_block_id: null,
      }

      // Delete the block (including children)
      const idsToDelete = new Set<string>([action.payload])
      let foundMore = true
      while (foundMore) {
        foundMore = false
        for (const block of state.blocks) {
          if (block.parent_block_id && idsToDelete.has(block.parent_block_id) && !idsToDelete.has(block.id)) {
            idsToDelete.add(block.id)
            foundMore = true
          }
        }
      }

      const remainingBlocks = state.blocks.filter(block => !idsToDelete.has(block.id))
      const stateWithHistory = pushToHistory(state, remainingBlocks)

      return {
        ...stateWithHistory,
        blocks: remainingBlocks,
        clipboard: cutBlock,
        selectedBlockId: idsToDelete.has(state.selectedBlockId || '') ? null : state.selectedBlockId,
        isDirty: true,
      }
    }

    case 'PASTE_BLOCK': {
      if (!state.clipboard) return state

      // Note: Custom components may not be registered yet, but we still allow pasting
      // The canvas renderer will handle unknown components gracefully

      const { parentId, insertAt } = action.payload || {}

      // Get siblings (blocks with same parent)
      const targetParentId = parentId || null
      const siblings = state.blocks.filter(b => b.parent_block_id === targetParentId)
      const maxSortOrder = siblings.length > 0
        ? Math.max(...siblings.map(b => b.sort_order)) + 1
        : 0

      const newBlock: BlockData = {
        ...state.clipboard,
        id: uuidv4(), // Generate new ID for the pasted block
        parent_block_id: targetParentId,
        sort_order: insertAt ?? maxSortOrder,
      }

      const newBlocks = [...state.blocks, newBlock]
      const stateWithHistory = pushToHistory(state, newBlocks)

      return {
        ...stateWithHistory,
        blocks: newBlocks,
        selectedBlockId: newBlock.id,
        isDirty: true,
      }
    }

    case 'RESET_BLOCKS': {
      const emptyBlocks: BlockData[] = []
      const stateWithHistory = pushToHistory(state, emptyBlocks)
      return {
        ...stateWithHistory,
        blocks: emptyBlocks,
        selectedBlockId: null,
        isDirty: true,
      }
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state
      const newIndex = state.historyIndex - 1
      return {
        ...state,
        blocks: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      }
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state
      const newIndex = state.historyIndex + 1
      return {
        ...state,
        blocks: state.history[newIndex],
        historyIndex: newIndex,
        isDirty: true,
      }
    }

    case 'SET_DEVICE':
      return {
        ...state,
        device: action.payload,
      }

    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(25, Math.min(200, action.payload)),
      }

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
        selectedBlockId: action.payload ? null : state.selectedBlockId,
      }

    case 'MARK_DIRTY':
      return {
        ...state,
        isDirty: true,
      }

    case 'MARK_SAVED':
      return {
        ...state,
        isDirty: false,
        lastSavedAt: new Date(),
      }

    case 'SET_SAVING':
      return {
        ...state,
        isSaving: action.payload,
      }

    default:
      return state
  }
}

// Context
interface PageBuilderContextValue {
  state: PageBuilderState
  dispatch: Dispatch<PageBuilderAction>
  // Convenience actions
  setPage: (page: CmsPage) => void
  setBlocks: (blocks: BlockData[]) => void
  addBlock: (componentName: string, insertAt?: number, props?: Record<string, unknown>, parentId?: string | null) => void
  addBlockToContainer: (componentName: string, containerId: string, insertAt?: number, props?: Record<string, unknown>) => void
  updateBlock: (id: string, props: Record<string, unknown>) => void
  updateBlockFull: (id: string, updates: Partial<BlockData>) => void
  updateBlockVisibility: (id: string, isVisible: boolean) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
  moveBlock: (id: string, direction: 'up' | 'down') => void
  moveBlockToContainer: (blockId: string, targetContainerId: string | null, insertAt?: number) => void
  selectBlock: (id: string | null) => void
  copyBlock: (id: string) => void
  cutBlock: (id: string) => void
  pasteBlock: (parentId?: string | null, insertAt?: number) => void
  resetBlocks: () => void
  undo: () => void
  redo: () => void
  setDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
  setZoom: (zoom: number) => void
  setPreviewMode: (isPreview: boolean) => void
  markSaved: () => void
  setSaving: (isSaving: boolean) => void
  // Computed values
  canUndo: boolean
  canRedo: boolean
  hasClipboard: boolean
  selectedBlock: BlockData | null
  zoom: number
  lastSavedAt: Date | null
  // Helper functions for nested blocks
  getChildBlocks: (parentId: string | null) => BlockData[]
  getRootBlocks: () => BlockData[]
}

const PageBuilderContext = createContext<PageBuilderContextValue | null>(null)

// Provider component
interface PageBuilderProviderProps {
  children: ReactNode
  initialPage?: CmsPage
  initialBlocks?: BlockData[]
}

export function PageBuilderProvider({
  children,
  initialPage,
  initialBlocks = [],
}: PageBuilderProviderProps) {
  // Validate blocks against registry on load
  const validatedBlocks = validateBlocks(initialBlocks)

  const [state, dispatch] = useReducer(pageBuilderReducer, {
    ...initialState,
    page: initialPage || null,
    blocks: validatedBlocks,
    history: [validatedBlocks],
    historyIndex: 0,
  })

  // Load zoom from localStorage on mount (client-side only)
  useEffect(() => {
    const savedZoom = localStorage.getItem('editor-zoom')
    if (savedZoom) {
      const zoom = parseInt(savedZoom, 10)
      if (!isNaN(zoom) && zoom >= 25 && zoom <= 200) {
        dispatch({ type: 'SET_ZOOM', payload: zoom })
      }
    }
  }, [])

  // Persist zoom to localStorage when it changes
  useEffect(() => {
    if (state.zoom !== 100) {
      localStorage.setItem('editor-zoom', String(state.zoom))
    } else {
      localStorage.removeItem('editor-zoom')
    }
  }, [state.zoom])

  // Convenience actions
  const setPage = useCallback((page: CmsPage) => {
    dispatch({ type: 'SET_PAGE', payload: page })
  }, [])

  const setBlocks = useCallback((blocks: BlockData[]) => {
    dispatch({ type: 'SET_BLOCKS', payload: blocks })
  }, [])

  const addBlock = useCallback((componentName: string, insertAt?: number, props?: Record<string, unknown>, parentId?: string | null) => {
    dispatch({ type: 'ADD_BLOCK', payload: { componentName, insertAt, props, parentId } })
  }, [])

  const addBlockToContainer = useCallback((componentName: string, containerId: string, insertAt?: number, props?: Record<string, unknown>) => {
    dispatch({ type: 'ADD_BLOCK', payload: { componentName, insertAt, props, parentId: containerId } })
  }, [])

  const updateBlock = useCallback((id: string, props: Record<string, unknown>) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, props } })
  }, [])

  const updateBlockFull = useCallback((id: string, updates: Partial<BlockData>) => {
    dispatch({ type: 'UPDATE_BLOCK_FULL', payload: { id, updates } })
  }, [])

  const updateBlockVisibility = useCallback((id: string, isVisible: boolean) => {
    dispatch({ type: 'UPDATE_BLOCK_VISIBILITY', payload: { id, isVisible } })
  }, [])

  const deleteBlock = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BLOCK', payload: id })
  }, [])

  const duplicateBlock = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_BLOCK', payload: id })
  }, [])

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    dispatch({ type: 'REORDER_BLOCKS', payload: { startIndex, endIndex } })
  }, [])

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    dispatch({ type: 'MOVE_BLOCK', payload: { id, direction } })
  }, [])

  const moveBlockToContainer = useCallback((blockId: string, targetContainerId: string | null, insertAt?: number) => {
    dispatch({ type: 'MOVE_BLOCK_TO_CONTAINER', payload: { blockId, targetContainerId, insertAt } })
  }, [])

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: id })
  }, [])

  const copyBlock = useCallback((id: string) => {
    dispatch({ type: 'COPY_BLOCK', payload: id })
  }, [])

  const cutBlock = useCallback((id: string) => {
    dispatch({ type: 'CUT_BLOCK', payload: id })
  }, [])

  const pasteBlock = useCallback((parentId?: string | null, insertAt?: number) => {
    dispatch({ type: 'PASTE_BLOCK', payload: { parentId, insertAt } })
  }, [])

  const resetBlocks = useCallback(() => {
    dispatch({ type: 'RESET_BLOCKS' })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const setDevice = useCallback((device: 'desktop' | 'tablet' | 'mobile') => {
    dispatch({ type: 'SET_DEVICE', payload: device })
  }, [])

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom })
  }, [])

  const setPreviewMode = useCallback((isPreview: boolean) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: isPreview })
  }, [])

  const markSaved = useCallback(() => {
    dispatch({ type: 'MARK_SAVED' })
  }, [])

  const setSaving = useCallback((isSaving: boolean) => {
    dispatch({ type: 'SET_SAVING', payload: isSaving })
  }, [])

  // Computed values
  const canUndo = state.historyIndex > 0
  const canRedo = state.historyIndex < state.history.length - 1
  const hasClipboard = state.clipboard !== null
  const selectedBlock = state.blocks.find((b) => b.id === state.selectedBlockId) || null

  // Helper functions for nested blocks
  const getChildBlocks = useCallback((parentId: string | null) => {
    return state.blocks
      .filter(b => b.parent_block_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [state.blocks])

  const getRootBlocks = useCallback(() => {
    return state.blocks
      .filter(b => b.parent_block_id === null)
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [state.blocks])

  const value: PageBuilderContextValue = {
    state,
    dispatch,
    setPage,
    setBlocks,
    addBlock,
    addBlockToContainer,
    updateBlock,
    updateBlockFull,
    updateBlockVisibility,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    moveBlock,
    moveBlockToContainer,
    selectBlock,
    copyBlock,
    cutBlock,
    pasteBlock,
    resetBlocks,
    undo,
    redo,
    setDevice,
    setZoom,
    setPreviewMode,
    markSaved,
    setSaving,
    canUndo,
    canRedo,
    hasClipboard,
    selectedBlock,
    zoom: state.zoom,
    lastSavedAt: state.lastSavedAt,
    getChildBlocks,
    getRootBlocks,
  }

  return <PageBuilderContext.Provider value={value}>{children}</PageBuilderContext.Provider>
}

// Hook to use the context
export function usePageBuilder() {
  const context = useContext(PageBuilderContext)
  if (!context) {
    throw new Error('usePageBuilder must be used within a PageBuilderProvider')
  }
  return context
}
