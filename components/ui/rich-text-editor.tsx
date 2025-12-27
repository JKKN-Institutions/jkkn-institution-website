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
import { ImageGallery, type GalleryImage } from './rich-text-editor/extensions/image-gallery'
import { useCallback, useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30">
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
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        tooltip="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        tooltip="Inline Code"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

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
  // Parse initial content
  const initialContent = (() => {
    try {
      const parsed = JSON.parse(content)
      return parsed
    } catch {
      // If content is not valid JSON, treat it as empty
      return { type: 'doc', content: [] }
    }
  })()

  // Store the gallery callback in a ref so it can be accessed by the extension
  const galleryCallbackRef = useRef<((onImagesSelected: (images: GalleryImage[]) => void) => void) | undefined>(undefined)
  galleryCallbackRef.current = onGalleryImageSelect

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
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
        allowBase64: true,
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
        multicolor: false,
      }),
      TextStyle,
      Color,
    ],
    content: initialContent,
    editorProps: {
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
      const json = editor.getJSON()
      onChange(JSON.stringify(json))
    },
    immediatelyRender: false,
  })

  // Update editor content when prop changes (for edit mode)
  useEffect(() => {
    if (editor && content) {
      try {
        const parsed = JSON.parse(content)
        const currentContent = JSON.stringify(editor.getJSON())
        const newContent = JSON.stringify(parsed)

        // Only update if content is different to avoid infinite loops
        if (currentContent !== newContent) {
          editor.commands.setContent(parsed)
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [editor, content])

  if (!editor) {
    return (
      <div className={cn('border rounded-lg overflow-hidden bg-background', className)}>
        <div className="h-12 bg-muted/30 border-b animate-pulse" />
        <div className="h-[300px] animate-pulse bg-muted/10" />
      </div>
    )
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden bg-background', className)}>
      <EditorToolbar
        editor={editor}
        onImageUpload={onImageUpload}
        onContentImageUpload={onContentImageUpload}
        onGalleryImageSelect={onGalleryImageSelect}
      />
      <EditorContent editor={editor} />
    </div>
  )
}
