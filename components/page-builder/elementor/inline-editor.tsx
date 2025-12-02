'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { cn } from '@/lib/utils'

interface InlineEditorProps {
  blockId: string
  propName: string
  value: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  placeholder?: string
  multiline?: boolean
}

export function InlineEditor({
  blockId,
  propName,
  value,
  className,
  tag: Tag = 'p',
  placeholder = 'Click to edit...',
  multiline = false,
}: InlineEditorProps) {
  const { updateBlock, state } = usePageBuilder()
  const { isPreviewMode, selectedBlockId } = state
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const editorRef = useRef<HTMLElement>(null)

  // Sync with external value changes
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value)
    }
  }, [value, isEditing])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode) return
    e.stopPropagation()
    setIsEditing(true)
  }, [isPreviewMode])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    if (localValue !== value) {
      updateBlock(blockId, { [propName]: localValue })
    }
  }, [blockId, propName, localValue, value, updateBlock])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || ''
    setLocalValue(text)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setLocalValue(value)
      setIsEditing(false)
      editorRef.current?.blur()
    }
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      editorRef.current?.blur()
    }
  }, [value, multiline])

  // Focus when editing starts
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus()
      // Select all text
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditing])

  if (isPreviewMode) {
    return <Tag className={className}>{value || placeholder}</Tag>
  }

  return (
    <div className="relative group">
      <Tag
        ref={editorRef as React.RefObject<never>}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={handleClick}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          className,
          'cursor-text outline-none transition-all',
          isEditing && 'ring-2 ring-primary ring-offset-2 rounded-sm bg-background/50',
          !isEditing && selectedBlockId === blockId && 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:rounded-sm',
          !value && !isEditing && 'text-muted-foreground/50 italic'
        )}
      >
        {localValue || (isEditing ? '' : placeholder)}
      </Tag>

      {/* Edit indicator */}
      {!isEditing && !isPreviewMode && (
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

// Rich text inline editor with formatting toolbar
interface RichTextInlineEditorProps {
  blockId: string
  propName: string
  value: string
  className?: string
  placeholder?: string
}

export function RichTextInlineEditor({
  blockId,
  propName,
  value,
  className,
  placeholder = 'Click to edit...',
}: RichTextInlineEditorProps) {
  const { updateBlock, state } = usePageBuilder()
  const { isPreviewMode, selectedBlockId } = state
  const [isEditing, setIsEditing] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode) return
    e.stopPropagation()
    setIsEditing(true)
    setShowToolbar(true)
  }, [isPreviewMode])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Check if focus is moving to toolbar
    const relatedTarget = e.relatedTarget as HTMLElement
    if (relatedTarget?.closest('.inline-editor-toolbar')) {
      return
    }

    setIsEditing(false)
    setShowToolbar(false)
    const content = editorRef.current?.innerHTML || ''
    if (content !== value) {
      updateBlock(blockId, { [propName]: content })
    }
  }, [blockId, propName, value, updateBlock])

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus()
    }
  }, [isEditing])

  if (isPreviewMode) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: value || placeholder }}
      />
    )
  }

  return (
    <div className="relative">
      {/* Formatting toolbar */}
      {showToolbar && (
        <div className="inline-editor-toolbar absolute -top-10 left-0 z-50 flex items-center gap-1 p-1 bg-popover border border-border rounded-lg shadow-lg">
          <button
            onClick={() => execCommand('bold')}
            className="p-1.5 hover:bg-accent rounded"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          </button>
          <button
            onClick={() => execCommand('italic')}
            className="p-1.5 hover:bg-accent rounded"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
            </svg>
          </button>
          <button
            onClick={() => execCommand('underline')}
            className="p-1.5 hover:bg-accent rounded"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4v6a6 6 0 0012 0V4M4 20h16" />
            </svg>
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => execCommand('justifyLeft')}
            className="p-1.5 hover:bg-accent rounded"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          </button>
          <button
            onClick={() => execCommand('justifyCenter')}
            className="p-1.5 hover:bg-accent rounded"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          </button>
          <button
            onClick={() => execCommand('justifyRight')}
            className="p-1.5 hover:bg-accent rounded"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
            </svg>
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => {
              const url = prompt('Enter link URL:')
              if (url) execCommand('createLink', url)
            }}
            className="p-1.5 hover:bg-accent rounded"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={handleClick}
        onBlur={handleBlur}
        className={cn(
          className,
          'cursor-text outline-none transition-all min-h-[1.5em]',
          isEditing && 'ring-2 ring-primary ring-offset-2 rounded-sm',
          !value && !isEditing && 'text-muted-foreground/50 italic'
        )}
        dangerouslySetInnerHTML={{ __html: value || (isEditing ? '' : placeholder) }}
      />
    </div>
  )
}
