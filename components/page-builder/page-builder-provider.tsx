'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getDefaultProps } from '@/lib/cms/component-registry'
import type { BlockData } from '@/lib/cms/registry-types'

// Page type (simplified for builder state)
interface CmsPage {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived' | 'scheduled'
}

// State interface
interface PageBuilderState {
  page: CmsPage | null
  blocks: BlockData[]
  selectedBlockId: string | null
  device: 'desktop' | 'tablet' | 'mobile'
  history: BlockData[][]
  historyIndex: number
  isDirty: boolean
  isSaving: boolean
  isPreviewMode: boolean
}

// Action types
type PageBuilderAction =
  | { type: 'SET_PAGE'; payload: CmsPage }
  | { type: 'SET_BLOCKS'; payload: BlockData[] }
  | { type: 'ADD_BLOCK'; payload: { componentName: string; insertAt?: number; props?: Record<string, unknown> } }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; props: Record<string, unknown> } }
  | { type: 'UPDATE_BLOCK_VISIBILITY'; payload: { id: string; isVisible: boolean } }
  | { type: 'DELETE_BLOCK'; payload: string }
  | { type: 'DUPLICATE_BLOCK'; payload: string }
  | { type: 'REORDER_BLOCKS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'MOVE_BLOCK'; payload: { id: string; direction: 'up' | 'down' } }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_DEVICE'; payload: 'desktop' | 'tablet' | 'mobile' }
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
  history: [],
  historyIndex: -1,
  isDirty: false,
  isSaving: false,
  isPreviewMode: false,
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
      const { componentName, insertAt, props } = action.payload
      const defaultProps = getDefaultProps(componentName)
      const newBlock: BlockData = {
        id: uuidv4(),
        component_name: componentName,
        props: { ...defaultProps, ...props },
        sort_order: insertAt ?? state.blocks.length,
        parent_block_id: null,
        is_visible: true,
      }

      let newBlocks: BlockData[]
      if (insertAt !== undefined && insertAt < state.blocks.length) {
        // Insert at specific position and update sort_order for all blocks
        newBlocks = [
          ...state.blocks.slice(0, insertAt),
          newBlock,
          ...state.blocks.slice(insertAt),
        ].map((block, index) => ({ ...block, sort_order: index }))
      } else {
        // Add at the end
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
      const newBlocks = state.blocks
        .filter((block) => block.id !== action.payload)
        .map((block, index) => ({ ...block, sort_order: index }))
      const stateWithHistory = pushToHistory(state, newBlocks)
      return {
        ...stateWithHistory,
        blocks: newBlocks,
        selectedBlockId: state.selectedBlockId === action.payload ? null : state.selectedBlockId,
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

    case 'SELECT_BLOCK':
      return {
        ...state,
        selectedBlockId: action.payload,
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
  addBlock: (componentName: string, insertAt?: number, props?: Record<string, unknown>) => void
  updateBlock: (id: string, props: Record<string, unknown>) => void
  updateBlockVisibility: (id: string, isVisible: boolean) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  reorderBlocks: (startIndex: number, endIndex: number) => void
  moveBlock: (id: string, direction: 'up' | 'down') => void
  selectBlock: (id: string | null) => void
  undo: () => void
  redo: () => void
  setDevice: (device: 'desktop' | 'tablet' | 'mobile') => void
  setPreviewMode: (isPreview: boolean) => void
  markSaved: () => void
  setSaving: (isSaving: boolean) => void
  // Computed values
  canUndo: boolean
  canRedo: boolean
  selectedBlock: BlockData | null
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
  const [state, dispatch] = useReducer(pageBuilderReducer, {
    ...initialState,
    page: initialPage || null,
    blocks: initialBlocks,
    history: [initialBlocks],
    historyIndex: 0,
  })

  // Convenience actions
  const setPage = useCallback((page: CmsPage) => {
    dispatch({ type: 'SET_PAGE', payload: page })
  }, [])

  const setBlocks = useCallback((blocks: BlockData[]) => {
    dispatch({ type: 'SET_BLOCKS', payload: blocks })
  }, [])

  const addBlock = useCallback((componentName: string, insertAt?: number, props?: Record<string, unknown>) => {
    dispatch({ type: 'ADD_BLOCK', payload: { componentName, insertAt, props } })
  }, [])

  const updateBlock = useCallback((id: string, props: Record<string, unknown>) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, props } })
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

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: id })
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
  const selectedBlock = state.blocks.find((b) => b.id === state.selectedBlockId) || null

  const value: PageBuilderContextValue = {
    state,
    dispatch,
    setPage,
    setBlocks,
    addBlock,
    updateBlock,
    updateBlockVisibility,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    moveBlock,
    selectBlock,
    undo,
    redo,
    setDevice,
    setPreviewMode,
    markSaved,
    setSaving,
    canUndo,
    canRedo,
    selectedBlock,
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
