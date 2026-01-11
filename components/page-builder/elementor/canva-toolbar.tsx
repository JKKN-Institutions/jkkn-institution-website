'use client'

import { type Editor } from '@tiptap/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/admin/settings/color-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Plus,
  Type,
} from 'lucide-react'

interface CanvaLikeToolbarProps {
  editor: Editor
}

export function CanvaLikeToolbar({ editor }: CanvaLikeToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)

  // Get current font size (default to 16 if not set)
  const currentSize = editor.getAttributes('textStyle').fontSize || '16'
  const currentSizeNum = parseInt(currentSize)

  return (
    <div className="flex items-center gap-1 p-2 bg-popover border border-border rounded-lg shadow-lg">
      {/* Font Family Picker */}
      <Popover open={showFontPicker} onOpenChange={setShowFontPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setShowFontPicker(!showFontPicker)}
          >
            <Type className="h-4 w-4 mr-1" />
            <span className="text-xs">Font</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <Select
            value={editor.getAttributes('textStyle').fontFamily || 'inherit'}
            onValueChange={(value) => {
              if (value === 'inherit') {
                editor.chain().focus().unsetFontFamily().run()
              } else {
                editor.chain().focus().setFontFamily(value).run()
              }
              setShowFontPicker(false)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inherit">Default</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="'Times New Roman'">Times New Roman</SelectItem>
              <SelectItem value="'Courier New'">Courier New</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
              <SelectItem value="'Comic Sans MS'">Comic Sans MS</SelectItem>
              <SelectItem value="'Trebuchet MS'">Trebuchet MS</SelectItem>
              <SelectItem value="'Arial Black'">Arial Black</SelectItem>
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Font Size Controls (Canva-style +/-) */}
      <div className="flex items-center gap-0.5 bg-muted/50 rounded px-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const newSize = Math.max(8, currentSizeNum - 1)
            editor.chain().focus().setFontSize(newSize.toString()).run()
          }}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <input
          type="number"
          value={currentSizeNum}
          onChange={(e) => {
            const size = parseInt(e.target.value) || 16
            editor.chain().focus().setFontSize(size.toString()).run()
          }}
          className="w-10 text-center text-xs bg-transparent border-0 outline-none"
          min="8"
          max="200"
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const newSize = Math.min(200, currentSizeNum + 1)
            editor.chain().focus().setFontSize(newSize.toString()).run()
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Color Picker */}
      <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <div
              className="w-4 h-4 rounded border border-border"
              style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000' }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <ColorPicker
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(color) => {
              editor.chain().focus().setColor(color).run()
              setShowColorPicker(false)
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-active={editor.isActive('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-active={editor.isActive('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        data-active={editor.isActive('underline')}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        data-active={editor.isActive('strike')}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text Alignment */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        data-active={editor.isActive({ textAlign: 'left' })}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        data-active={editor.isActive({ textAlign: 'center' })}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        data-active={editor.isActive({ textAlign: 'right' })}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        data-active={editor.isActive({ textAlign: 'justify' })}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        data-active={editor.isActive('bulletList')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        data-active={editor.isActive('orderedList')}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Link */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const url = prompt('Enter URL:')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        data-active={editor.isActive('link')}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
