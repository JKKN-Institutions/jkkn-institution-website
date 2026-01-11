'use client'

import React from 'react'
import { List, ListOrdered, Star, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ListFormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  value: string
  onChange: (value: string) => void
}

/**
 * Toolbar for inserting list formatting markers into textarea fields
 * Supports: Bullet lists (.), Numbered lists (1.), Stars (★), and Hyphens (-)
 */
export function ListFormatToolbar({ textareaRef, value, onChange }: ListFormatToolbarProps) {
  /**
   * Inserts a list marker at the current cursor position
   * @param marker - The marker to insert (e.g., "\n. ", "\n1. ", etc.)
   */
  const insertMarker = (marker: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = value || ''

    // Insert marker at cursor position
    const newValue = currentValue.substring(0, start) + marker + currentValue.substring(end)

    // Update value
    onChange(newValue)

    // Set cursor position after inserted marker
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + marker.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="flex flex-wrap gap-1 mb-2 p-2 border rounded-md bg-muted/30">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => insertMarker('\n. ')}
        title="Insert bullet point (.)"
        className="h-8 px-2 text-xs"
      >
        <List className="h-3.5 w-3.5 mr-1" />
        Bullet
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          // Calculate next number based on existing numbered items
          const numberedPattern = /\d+\.\s/g
          const matches = (value || '').match(numberedPattern)
          const nextNumber = matches ? matches.length + 1 : 1
          insertMarker(`\n${nextNumber}. `)
        }}
        title="Insert numbered list item (1.)"
        className="h-8 px-2 text-xs"
      >
        <ListOrdered className="h-3.5 w-3.5 mr-1" />
        Number
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => insertMarker('\n★ ')}
        title="Insert star bullet (★)"
        className="h-8 px-2 text-xs"
      >
        <Star className="h-3.5 w-3.5 mr-1" />
        Star
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => insertMarker('\n- ')}
        title="Insert hyphen bullet (-)"
        className="h-8 px-2 text-xs"
      >
        <Minus className="h-3.5 w-3.5 mr-1" />
        Hyphen
      </Button>
    </div>
  )
}
