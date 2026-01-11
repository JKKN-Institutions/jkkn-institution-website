'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePageBuilder } from '../page-builder-provider'
import { cn } from '@/lib/utils'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import { Link } from '@tiptap/extension-link'
import { CanvaLikeToolbar } from './canva-toolbar'

// Custom FontSize extension for Tiptap
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}
              return { style: `font-size: ${attributes.fontSize}px` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
      },
    }
  },
})

// Custom FontFamily extension
const FontFamily = Extension.create({
  name: 'fontFamily',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily?.replace(/['"]/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontFamily) return {}
              return { style: `font-family: ${attributes.fontFamily}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontFamily: (fontFamily: string) => ({ chain }) => {
        return chain().setMark('textStyle', { fontFamily }).run()
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontFamily: null }).removeEmptyTextStyle().run()
      },
    }
  },
})

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

// Tiptap-powered rich text inline editor with Canva-like toolbar
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
  const { isPreviewMode } = state
  const [isReady, setIsReady] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced update function
  const debouncedUpdate = useCallback((html: string) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    updateTimeoutRef.current = setTimeout(() => {
      updateBlock(blockId, { [propName]: html })
    }, 300) // 300ms debounce
  }, [blockId, propName, updateBlock])

  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    shouldRerenderOnTransaction: false, // Optimize performance
    extensions: [
      StarterKit.configure({
        // Disable default heading command to avoid conflicts
        heading: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['paragraph'], // Only paragraph since heading is disabled
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content: value || '<p></p>',
    editable: !isPreviewMode,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      debouncedUpdate(html)
    },
    editorProps: {
      attributes: {
        class: cn(
          className,
          'outline-none transition-all min-h-[1.5em] focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:rounded-sm'
        ),
      },
    },
  })

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>')
    }
  }, [value, editor])

  // Mark as ready when editor is initialized
  useEffect(() => {
    if (editor) {
      setIsReady(true)
    }
  }, [editor])

  // Show/hide toolbar on selection
  useEffect(() => {
    if (!editor) return

    const updateToolbar = () => {
      const { from, to } = editor.state.selection
      const hasSelection = from !== to
      setShowToolbar(hasSelection && editor.isFocused)
    }

    editor.on('selectionUpdate', updateToolbar)
    editor.on('focus', updateToolbar)
    editor.on('blur', () => setShowToolbar(false))

    return () => {
      editor.off('selectionUpdate', updateToolbar)
      editor.off('focus', updateToolbar)
      editor.off('blur')
    }
  }, [editor])

  // Keyboard shortcuts
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to blur
      if (e.key === 'Escape') {
        editor.commands.blur()
        setShowToolbar(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  // Show loading skeleton while editor initializes
  if (!isReady || !editor) {
    return (
      <div className={cn(className, 'animate-pulse bg-muted/20 rounded min-h-[1.5em]')} />
    )
  }

  // Preview mode: just render HTML
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
      {/* Canva-like floating toolbar - appears when text is selected */}
      {showToolbar && (
        <div className="absolute -top-14 left-0 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CanvaLikeToolbar editor={editor} />
        </div>
      )}

      {/* Editable content */}
      <EditorContent editor={editor} />
    </div>
  )
}
