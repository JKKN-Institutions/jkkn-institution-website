'use client'

import { useEffect, useCallback, useRef } from 'react'

export interface ShortcutDefinition {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: () => void
  /** Prevent default browser behavior */
  preventDefault?: boolean
  /** Only trigger when not in an input/textarea */
  outsideInputs?: boolean
}

export interface UseKeyboardShortcutsOptions {
  /** Whether shortcuts are enabled */
  enabled?: boolean
  /** Shortcuts to register */
  shortcuts: ShortcutDefinition[]
}

/**
 * Check if the event target is an input-like element
 */
function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    target.isContentEditable
  )
}

/**
 * Hook for registering keyboard shortcuts
 */
export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions) {
  const { enabled = true, shortcuts } = options
  const shortcutsRef = useRef(shortcuts)

  // Keep shortcuts ref updated
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const currentShortcuts = shortcutsRef.current

    for (const shortcut of currentShortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatches = !!shortcut.ctrl === (event.ctrlKey || event.metaKey)
      const shiftMatches = !!shortcut.shift === event.shiftKey
      const altMatches = !!shortcut.alt === event.altKey

      if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
        // Check if we should skip when in inputs
        if (shortcut.outsideInputs && isInputElement(event.target)) {
          continue
        }

        if (shortcut.preventDefault !== false) {
          event.preventDefault()
        }

        shortcut.action()
        return
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}

/**
 * Get a human-readable string for a shortcut
 */
export function getShortcutString(shortcut: ShortcutDefinition): string {
  const parts: string[] = []

  // Use Cmd on Mac, Ctrl on others
  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac')

  if (shortcut.ctrl || shortcut.meta) {
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift')
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt')
  }

  // Format special keys
  let keyDisplay = shortcut.key.toUpperCase()
  switch (shortcut.key.toLowerCase()) {
    case 'delete':
    case 'backspace':
      keyDisplay = isMac ? '⌫' : 'Del'
      break
    case 'escape':
      keyDisplay = 'Esc'
      break
    case 'arrowup':
      keyDisplay = '↑'
      break
    case 'arrowdown':
      keyDisplay = '↓'
      break
    case 'arrowleft':
      keyDisplay = '←'
      break
    case 'arrowright':
      keyDisplay = '→'
      break
  }

  parts.push(keyDisplay)

  return parts.join(isMac ? '' : '+')
}

/**
 * Standard shortcuts for the page builder
 */
export function usePageBuilderShortcuts(options: {
  onSave: () => void
  onUndo: () => void
  onRedo: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onCopy?: () => void
  onCut?: () => void
  onPaste?: () => void
  onTogglePreview?: () => void
  onToggleNavigator?: () => void
  onSelectAll?: () => void
  onDeselect?: () => void
  canSave?: boolean
  canUndo?: boolean
  canRedo?: boolean
  canDelete?: boolean
  canDuplicate?: boolean
  enabled?: boolean
}) {
  const {
    onSave,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onCopy,
    onCut,
    onPaste,
    onTogglePreview,
    onToggleNavigator,
    onSelectAll,
    onDeselect,
    canSave = true,
    canUndo = true,
    canRedo = true,
    canDelete = true,
    canDuplicate = true,
    enabled = true,
  } = options

  const shortcuts: ShortcutDefinition[] = [
    // Save
    {
      key: 's',
      ctrl: true,
      description: 'Save',
      action: () => {
        if (canSave) onSave()
      },
    },
    // Undo
    {
      key: 'z',
      ctrl: true,
      description: 'Undo',
      action: () => {
        if (canUndo) onUndo()
      },
    },
    // Redo (Ctrl+Y)
    {
      key: 'y',
      ctrl: true,
      description: 'Redo',
      action: () => {
        if (canRedo) onRedo()
      },
    },
    // Redo (Ctrl+Shift+Z)
    {
      key: 'z',
      ctrl: true,
      shift: true,
      description: 'Redo',
      action: () => {
        if (canRedo) onRedo()
      },
    },
  ]

  // Delete
  if (onDelete) {
    shortcuts.push({
      key: 'Delete',
      description: 'Delete selected',
      action: () => {
        if (canDelete) onDelete()
      },
      outsideInputs: true,
    })
    shortcuts.push({
      key: 'Backspace',
      description: 'Delete selected',
      action: () => {
        if (canDelete) onDelete()
      },
      outsideInputs: true,
    })
  }

  // Duplicate
  if (onDuplicate) {
    shortcuts.push({
      key: 'd',
      ctrl: true,
      description: 'Duplicate selected',
      action: () => {
        if (canDuplicate) onDuplicate()
      },
    })
  }

  // Copy
  if (onCopy) {
    shortcuts.push({
      key: 'c',
      ctrl: true,
      description: 'Copy selected',
      action: onCopy,
      outsideInputs: true,
    })
  }

  // Cut
  if (onCut) {
    shortcuts.push({
      key: 'x',
      ctrl: true,
      description: 'Cut selected',
      action: onCut,
      outsideInputs: true,
    })
  }

  // Paste
  if (onPaste) {
    shortcuts.push({
      key: 'v',
      ctrl: true,
      description: 'Paste',
      action: onPaste,
      outsideInputs: true,
    })
  }

  // Toggle preview
  if (onTogglePreview) {
    shortcuts.push({
      key: 'p',
      ctrl: true,
      shift: true,
      description: 'Toggle preview',
      action: onTogglePreview,
    })
  }

  // Toggle navigator
  if (onToggleNavigator) {
    shortcuts.push({
      key: 'l',
      ctrl: true,
      description: 'Toggle navigator',
      action: onToggleNavigator,
    })
  }

  // Select all
  if (onSelectAll) {
    shortcuts.push({
      key: 'a',
      ctrl: true,
      description: 'Select all blocks',
      action: onSelectAll,
      outsideInputs: true,
    })
  }

  // Deselect (Escape)
  if (onDeselect) {
    shortcuts.push({
      key: 'Escape',
      description: 'Deselect',
      action: onDeselect,
    })
  }

  useKeyboardShortcuts({
    enabled,
    shortcuts,
  })

  // Return a list of all shortcuts for help dialog
  return shortcuts.map((s) => ({
    key: getShortcutString(s),
    description: s.description,
  }))
}
