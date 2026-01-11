'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { ImageGallery, type GalleryImage } from './rich-text-editor/extensions/image-gallery'
import { TableCellMerge } from './rich-text-editor/extensions/table-cell-merge'
import { TableTemplatePicker } from './rich-text-editor/table-template-picker'
import { TablePropertiesDialog } from './rich-text-editor/table-properties-dialog'
import { useCallback, useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/admin/settings/color-picker'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Images,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Minus,
  Pilcrow,
  RemoveFormatting,
  Trash2,
  ArrowUp,
  ArrowDown,
  Replace,
  Table as TableIcon,
  Columns,
  Rows,
  Palette,
  Settings,
} from 'lucide-react'
// Note: Using custom floating menu instead of BubbleMenu for better control
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  onImageUpload?: () => void
  onContentImageUpload?: (insertCallback: (src: string, alt?: string) => void) => void
  onGalleryImageSelect?: (onImagesSelected: (images: Array<{src: string, alt?: string}>) => void) => void
}

// Toolbar Button Component
function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  tooltip,
  children,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  tooltip: string
  children: React.ReactNode
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'h-8 w-8 p-0',
              isActive && 'bg-muted text-primary'
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Toolbar Divider
function ToolbarDivider() {
  return <div className="w-px h-6 bg-border mx-1" />
}

// Link Popover
function LinkPopover({ editor }: { editor: Editor }) {
  const [url, setUrl] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const setLink = useCallback(() => {
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url, target: '_blank' })
      .run()

    setUrl('')
    setIsOpen(false)
  }, [editor, url])

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setIsOpen(false)
  }, [editor])

  useEffect(() => {
    if (isOpen) {
      const previousUrl = editor.getAttributes('link').href
      setUrl(previousUrl || '')
    }
  }, [isOpen, editor])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-8 p-0',
            editor.isActive('link') && 'bg-muted text-primary'
          )}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setLink()
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={setLink}>
              {editor.isActive('link') ? 'Update Link' : 'Add Link'}
            </Button>
            {editor.isActive('link') && (
              <Button type="button" size="sm" variant="outline" onClick={removeLink}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Image Popover
function ImagePopover({
  editor,
  onImageUpload,
  onContentImageUpload
}: {
  editor: Editor
  onImageUpload?: () => void
  onContentImageUpload?: (insertCallback: (src: string, alt?: string) => void) => void
}) {
  const [url, setUrl] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  // Store editor selection/position before opening media modal
  const savedSelectionRef = useRef<{ from: number; to: number } | null>(null)

  const addImage = useCallback(() => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
      setUrl('')
      setIsOpen(false)
    }
  }, [editor, url])

  // Handle media library upload - passes insertion callback
  const handleMediaLibraryUpload = useCallback(() => {
    // Store the current selection/cursor position before modal opens
    const { from, to } = editor.state.selection
    savedSelectionRef.current = { from, to }

    if (onContentImageUpload) {
      // Pass a callback that will insert the image into editor at saved cursor position
      onContentImageUpload((src: string, alt?: string) => {
        // Restore selection and insert image at saved position
        if (savedSelectionRef.current) {
          editor
            .chain()
            .focus()
            .setTextSelection(savedSelectionRef.current)
            .setImage({ src, alt })
            .run()
          savedSelectionRef.current = null
        } else {
          editor.chain().focus().setImage({ src, alt }).run()
        }
      })
    } else if (onImageUpload) {
      // Fallback to legacy behavior
      onImageUpload()
    }
    setIsOpen(false)
  }, [editor, onContentImageUpload, onImageUpload])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addImage()
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={addImage}>
              Add Image
            </Button>
            {(onContentImageUpload || onImageUpload) && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleMediaLibraryUpload}
              >
                Upload
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Gallery Button Component
function GalleryButton({
  editor,
  onGalleryImageSelect
}: {
  editor: Editor
  onGalleryImageSelect?: (onImagesSelected: (images: Array<{src: string, alt?: string}>) => void) => void
}) {
  const handleClick = useCallback(() => {
    if (onGalleryImageSelect) {
      onGalleryImageSelect((selectedImages) => {
        if (selectedImages.length > 0) {
          // Insert gallery with selected images
          editor.chain().focus().setImageGallery({
            images: selectedImages.map(img => ({
              src: img.src,
              alt: img.alt || '',
              caption: ''
            })),
            layout: 'carousel',
            columns: 3
          }).run()
        }
      })
    }
  }, [editor, onGalleryImageSelect])

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleClick}
            disabled={!onGalleryImageSelect}
          >
            <Images className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          Insert Image Gallery
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Image Floating Toolbar - appears when image is selected
function ImageFloatingToolbar({
  editor,
  onReplaceImage,
}: {
  editor: Editor
  onReplaceImage?: (insertCallback: (src: string, alt?: string) => void) => void
}) {
  const [isImageSelected, setIsImageSelected] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Check if image is selected and update toolbar position
  useEffect(() => {
    const checkImageSelection = () => {
      const { state } = editor
      const { selection } = state
      const node = state.doc.nodeAt(selection.from)

      if (node?.type.name === 'image') {
        setIsImageSelected(true)

        // Get image element position
        const { view } = editor
        const domNode = view.nodeDOM(selection.from)
        if (domNode instanceof HTMLElement) {
          const rect = domNode.getBoundingClientRect()
          const editorRect = view.dom.getBoundingClientRect()
          setToolbarPosition({
            top: rect.top - editorRect.top - 45,
            left: rect.left - editorRect.left + rect.width / 2,
          })
        }
      } else {
        setIsImageSelected(false)
      }
    }

    editor.on('selectionUpdate', checkImageSelection)
    editor.on('transaction', checkImageSelection)

    return () => {
      editor.off('selectionUpdate', checkImageSelection)
      editor.off('transaction', checkImageSelection)
    }
  }, [editor])

  const deleteImage = useCallback(() => {
    editor.chain().focus().deleteSelection().run()
  }, [editor])

  const moveImageUp = useCallback(() => {
    const { state } = editor
    const { selection } = state
    const pos = selection.from

    if (pos > 1) {
      const resolvedPos = state.doc.resolve(pos)
      const nodeBefore = resolvedPos.nodeBefore

      if (nodeBefore) {
        const node = state.doc.nodeAt(pos)
        if (node) {
          editor.chain()
            .focus()
            .deleteSelection()
            .setTextSelection(pos - nodeBefore.nodeSize)
            .insertContent({ type: 'image', attrs: node.attrs })
            .run()
        }
      }
    }
  }, [editor])

  const moveImageDown = useCallback(() => {
    const { state } = editor
    const { selection } = state
    const pos = selection.from

    const resolvedPos = state.doc.resolve(pos)
    const nodeAfter = resolvedPos.nodeAfter

    if (nodeAfter) {
      const nextNode = state.doc.nodeAt(pos + nodeAfter.nodeSize)
      if (nextNode) {
        const currentNode = state.doc.nodeAt(pos)
        if (currentNode) {
          editor.chain()
            .focus()
            .deleteSelection()
            .setTextSelection(pos + nextNode.nodeSize)
            .insertContent({ type: 'image', attrs: currentNode.attrs })
            .run()
        }
      }
    }
  }, [editor])

  const replaceImage = useCallback(() => {
    if (onReplaceImage) {
      onReplaceImage((src: string, alt?: string) => {
        editor.chain().focus().setImage({ src, alt }).run()
      })
    }
  }, [editor, onReplaceImage])

  const setImageAlign = useCallback((align: 'left' | 'center' | 'right') => {
    const { state } = editor
    const { selection } = state
    const node = state.doc.nodeAt(selection.from)

    if (node && node.type.name === 'image') {
      const attrs = { ...node.attrs }
      let className = 'max-w-full h-auto rounded-lg my-4'
      if (align === 'center') {
        className += ' mx-auto block'
      } else if (align === 'right') {
        className += ' ml-auto block'
      } else {
        className += ' mr-auto block'
      }

      editor.chain()
        .focus()
        .updateAttributes('image', {
          ...attrs,
          class: className,
          'data-align': align
        })
        .run()
    }
  }, [editor])

  if (!isImageSelected) return null

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center gap-1 p-1.5 bg-background border rounded-lg shadow-lg transform -translate-x-1/2"
      style={{
        top: `${toolbarPosition.top}px`,
        left: `${toolbarPosition.left}px`,
      }}
    >
      {/* Replace Image */}
      {onReplaceImage && (
        <>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={replaceImage}
                >
                  <Replace className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Replace
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="w-px h-5 bg-border" />
        </>
      )}

      {/* Alignment */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setImageAlign('left')}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Left
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setImageAlign('center')}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Center
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setImageAlign('right')}
            >
              <AlignRight className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Right
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-px h-5 bg-border" />

      {/* Move Up/Down */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={moveImageUp}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Move Up
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={moveImageDown}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Move Down
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-px h-5 bg-border" />

      {/* Delete */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={deleteImage}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            Delete
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// Text Color Popover
function TextColorPopover({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const currentColor = editor.getAttributes('textStyle').color || '#000000'

  const handleColorChange = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const handleRemoveColor = () => {
    editor.chain().focus().unsetColor().run()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 relative"
        >
          <Palette className="h-4 w-4" />
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded"
            style={{ backgroundColor: currentColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <div className="space-y-3">
          <Label>Text Color</Label>
          <ColorPicker
            value={currentColor}
            onChange={handleColorChange}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRemoveColor}
            className="w-full"
          >
            Remove Color
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Background Color Popover
function BackgroundColorPopover({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const currentBgColor = editor.getAttributes('highlight').color || '#fef08a'

  const handleColorChange = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run()
  }

  const handleRemoveHighlight = () => {
    editor.chain().focus().unsetHighlight().run()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 w-8 p-0 relative',
            editor.isActive('highlight') && 'bg-muted text-primary'
          )}
        >
          <Highlighter className="h-4 w-4" />
          {editor.isActive('highlight') && (
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded"
              style={{ backgroundColor: currentBgColor }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <div className="space-y-3">
          <Label>Background Color</Label>
          <ColorPicker
            value={currentBgColor}
            onChange={handleColorChange}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleRemoveHighlight}
            className="w-full"
          >
            Remove Highlight
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Table Insert Popover
function TableInsertPopover({ editor }: { editor: Editor }) {
  const [isOpen, setIsOpen] = useState(false)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  const insertTable = useCallback((r: number, c: number) => {
    editor.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run()
    setIsOpen(false)
  }, [editor])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] max-h-[600px] overflow-y-auto" align="start">
        <Tabs defaultValue="quick-insert" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick-insert">Quick Insert</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Quick Insert Tab */}
          <TabsContent value="quick-insert" className="space-y-4 mt-4">
            <div>
              <Label>Insert Table</Label>
              <p className="text-xs text-muted-foreground">Select table size or enter custom dimensions</p>
            </div>

            {/* Quick size buttons */}
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={() => insertTable(3, 3)}>
                3×3
              </Button>
              <Button type="button" size="sm" onClick={() => insertTable(4, 4)}>
                4×4
              </Button>
              <Button type="button" size="sm" onClick={() => insertTable(5, 5)}>
                5×5
              </Button>
            </div>

            {/* Custom size */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="table-rows" className="text-xs">Rows</Label>
                  <Input
                    id="table-rows"
                    type="number"
                    min="1"
                    max="20"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="table-cols" className="text-xs">Columns</Label>
                  <Input
                    id="table-cols"
                    type="number"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                    className="h-8"
                  />
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => insertTable(rows, cols)}
                className="w-full"
              >
                Insert {rows}×{cols} Table
              </Button>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-0">
            <TableTemplatePicker editor={editor} onSelect={() => setIsOpen(false)} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

// Main Toolbar Component
function EditorToolbar({
  editor,
  onImageUpload,
  onContentImageUpload,
  onGalleryImageSelect
}: {
  editor: Editor
  onImageUpload?: () => void
  onContentImageUpload?: (insertCallback: (src: string, alt?: string) => void) => void
  onGalleryImageSelect?: (onImagesSelected: (images: Array<{src: string, alt?: string}>) => void) => void
}) {
  const [tablePropsOpen, setTablePropsOpen] = useState(false)
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30 sticky top-0 z-10">
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        tooltip="Undo"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        tooltip="Redo"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        tooltip="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        tooltip="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        tooltip="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        tooltip="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        tooltip="Inline Code"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Colors */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <TextColorPopover editor={editor} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Text Color
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <BackgroundColorPopover editor={editor} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Background Color
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        tooltip="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        tooltip="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        tooltip="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
        tooltip="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        tooltip="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        tooltip="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        tooltip="Quote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        tooltip="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        tooltip="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        tooltip="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        tooltip="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Table Controls */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <TableInsertPopover editor={editor} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Insert Table
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Table Manipulation Controls - Only show when cursor is inside a table */}
      {editor.isActive('table') && (
        <>
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            tooltip="Add Column Before"
          >
            <Columns className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            tooltip="Add Column After"
          >
            <Columns className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteColumn().run()}
            tooltip="Delete Column"
          >
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowBefore().run()}
            tooltip="Add Row Before"
          >
            <Rows className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            tooltip="Add Row After"
          >
            <Rows className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteRow().run()}
            tooltip="Delete Row"
          >
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            tooltip="Delete Table"
          >
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => setTablePropsOpen(true)}
            tooltip="Table Properties"
          >
            <Settings className="h-4 w-4" />
          </ToolbarButton>
        </>
      )}

      {/* Table Properties Dialog */}
      <TablePropertiesDialog
        editor={editor}
        isOpen={tablePropsOpen}
        onClose={() => setTablePropsOpen(false)}
      />

      <ToolbarDivider />

      {/* Link & Image & Gallery */}
      <LinkPopover editor={editor} />
      <ImagePopover editor={editor} onImageUpload={onImageUpload} onContentImageUpload={onContentImageUpload} />
      <GalleryButton editor={editor} onGalleryImageSelect={onGalleryImageSelect} />

      <ToolbarDivider />

      {/* Horizontal Rule & Clear Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        tooltip="Horizontal Line"
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        tooltip="Clear Formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing your content...',
  className,
  onImageUpload,
  onContentImageUpload,
  onGalleryImageSelect,
}: RichTextEditorProps) {
  // Use HTML content directly (Tiptap can parse HTML)
  // If empty, use empty paragraph
  const initialContent = content || '<p></p>'

  // Store the gallery callback in a ref so it can be accessed by the extension
  const galleryCallbackRef = useRef<((onImagesSelected: (images: GalleryImage[]) => void) => void) | undefined>(undefined)
  galleryCallbackRef.current = onGalleryImageSelect

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        // Explicitly enable list extensions (required in TipTap v3.13.0+)
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside ml-4 my-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside ml-4 my-2',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'my-1',
          },
        },
        listKeymap: {
          // Enable keyboard shortcuts: Tab/Shift+Tab for indent/outdent, Enter for new item
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false, // Prevent base64 embedding - use media library URLs instead
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4 cursor-move',
          draggable: 'true',
        },
      }),
      ImageGallery.extend({
        addStorage() {
          return {
            onAddImages: (callback: (images: GalleryImage[]) => void) => {
              if (galleryCallbackRef.current) {
                galleryCallbackRef.current((selectedImages) => {
                  callback(selectedImages.map(img => ({
                    src: img.src,
                    alt: img.alt,
                    caption: ''
                  })))
                })
              }
            }
          }
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            colspan: {
              default: 1,
              parseHTML: element => {
                const colspan = element.getAttribute('colspan')
                return colspan ? parseInt(colspan, 10) : 1
              },
              renderHTML: attributes => {
                return attributes.colspan > 1 ? { colspan: attributes.colspan } : {}
              },
            },
            rowspan: {
              default: 1,
              parseHTML: element => {
                const rowspan = element.getAttribute('rowspan')
                return rowspan ? parseInt(rowspan, 10) : 1
              },
              renderHTML: attributes => {
                return attributes.rowspan > 1 ? { rowspan: attributes.rowspan } : {}
              },
            },
          }
        },
      }),
      TableCellMerge,
    ],
    content: initialContent,
    editorProps: {
      // Handle quote characters that may be blocked on Windows due to IME/dead key handling
      handleKeyDown: (view, event) => {
        // Explicitly handle single and double quote characters
        if (event.key === "'" || event.key === '"') {
          // Manually insert the character to bypass any IME/composition blocking
          const { state, dispatch } = view
          const { tr } = state
          tr.insertText(event.key)
          dispatch(tr)
          return true // Mark as handled
        }
        return false // Let other handlers process other keys
      },
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3',
          'prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
          'prose-p:my-2 prose-ul:my-2 prose-ol:my-2',
          'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
          'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
          'prose-a:text-primary prose-a:underline',
          '[&_.is-empty]:before:content-[attr(data-placeholder)] [&_.is-empty]:before:text-muted-foreground [&_.is-empty]:before:float-left [&_.is-empty]:before:h-0 [&_.is-empty]:before:pointer-events-none'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    immediatelyRender: false,
  })

  // Update editor content when prop changes (for edit mode)
  useEffect(() => {
    if (editor && content) {
      const currentContent = editor.getHTML()

      // Only update if content is different to avoid infinite loops
      if (currentContent !== content) {
        editor.commands.setContent(content)
      }
    }
  }, [editor, content])

  if (!editor) {
    return (
      <div className={cn('border rounded-lg overflow-hidden bg-background flex flex-col', className)}>
        <div className="h-12 bg-muted/30 border-b animate-pulse sticky top-0 z-10" />
        <div className="h-[500px] animate-pulse bg-muted/10 overflow-y-auto" />
      </div>
    )
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden bg-background flex flex-col', className)}>
      <EditorToolbar
        editor={editor}
        onImageUpload={onImageUpload}
        onContentImageUpload={onContentImageUpload}
        onGalleryImageSelect={onGalleryImageSelect}
      />
      <div className="overflow-y-auto max-h-[500px] flex-1 relative">
        <EditorContent editor={editor} />
        {/* Image editing floating toolbar - shows when image is selected */}
        <ImageFloatingToolbar editor={editor} onReplaceImage={onContentImageUpload} />
      </div>
    </div>
  )
}
