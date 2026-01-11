# Canva-Like Universal Text Editing System - Implementation Plan

## 🎯 Executive Summary

Transform the JKKN page builder to match Canva's text editing experience by:
1. **Activating** existing inline editing components (already built, just unused!)
2. **Enhancing** with Tiptap for modern, rich formatting
3. **Universal** application to ALL text fields via opt-in system
4. **90% feature parity** with Canva's core text editing in 2-3 days

---

## 📊 Deep Analysis: Canva vs Current State

### Canva Features (from Screenshot Analysis)

| Feature | Canva Implementation | Priority |
|---------|---------------------|----------|
| **Inline editing** | Click text directly on canvas | ✅ CRITICAL |
| **Font selector** | Dropdown "Open Sans Extra..." | ✅ HIGH |
| **Font size** | +/- buttons, input field (39) | ✅ CRITICAL |
| **Color picker** | Color button in toolbar | ✅ CRITICAL |
| **Bold/Italic/Underline** | B, I, U buttons | ✅ CRITICAL |
| **Text alignment** | Left, center, right, justify icons | ✅ HIGH |
| **Lists** | Bullet, numbered list buttons | ✅ MEDIUM |
| **Effects** | Text effects button (star icon) | ⏳ FUTURE |
| **Animate** | Animate button | ⏳ FUTURE |
| **Position** | Position button | ✅ EXISTS (right panel) |
| **Text templates** | Left panel: Heading, Subheading, Body | ⏳ FUTURE |

**Coverage Goal:** Tier 1 (Critical + High) = ~90% of core functionality

### Current State Analysis

#### ✅ **DISCOVERY: Inline Editing Already Exists!**

File: `components/page-builder/elementor/inline-editor.tsx`

**Two Components Found:**

1. **`InlineEditor`** (Lines 7-119)
   - Simple plain text editing
   - Click to edit, contentEditable
   - Escape to cancel, Enter to save
   - Edit indicator icon on hover

2. **`RichTextInlineEditor`** (Lines 122-278)
   - Rich text with floating toolbar
   - Features: Bold, Italic, Underline, Left/Center/Right align, Links
   - Uses deprecated `document.execCommand()` ❌
   - Floating toolbar appears above text

#### ❌ **Why It's Not Working:**

Components **DON'T USE** these editors! They render plain text instead.

**Example - CoursePage Component:**
```typescript
// Current (line 277-281):
<h1 className="..." style={{ color: textColor }}>
  {collegeTitle}  // ❌ Plain text, not inline editable
</h1>

// Should be:
<RichTextInlineEditor
  blockId={blockId}
  propName="collegeTitle"
  value={collegeTitle}
  className="..."
/>  // ✅ Inline editable with toolbar
```

#### 📈 **Gap Analysis:**

| What Canva Has | Our Current State | Action Needed |
|----------------|-------------------|---------------|
| Inline editing | ✅ Built but unused | **Activate** in components |
| Floating toolbar | ✅ Exists (basic) | **Enhance** with Tiptap |
| Font family picker | ❌ Missing | **Add** to toolbar |
| Font size controls | ❌ Missing | **Add** to toolbar |
| Color picker | ❌ Missing | **Add** to toolbar |
| Universal (all fields) | ❌ Only right panel | **Opt-in system** |

---

## 🏗️ Architecture Design

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     USER CLICKS TEXT ON CANVAS               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            RichTextInlineEditor (Enhanced)                   │
│  - Tiptap editor instance                                    │
│  - contentEditable div                                       │
│  - BubbleMenu toolbar                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌─────────┐
    │  Tiptap │    │ BubbleMenu│    │ Update  │
    │ Editor  │───▶│  Toolbar  │───▶│  Block  │
    └─────────┘    └──────────┘    └─────────┘
         │              │                 │
         │              │                 ▼
         │              │         ┌──────────────┐
         │              │         │  Save HTML   │
         │              │         │  to Database │
         │              │         └──────────────┘
         │              │
         ▼              ▼
    Extensions    Toolbar Controls
    ─────────     ───────────────
    • StarterKit  • Font Family Picker
    • Color       • Font Size +/-
    • TextStyle   • Color Picker
    • FontFamily  • Bold/Italic/Underline
    • FontSize    • Alignment
                  • Lists
                  • Links
```

### Universal Detection System

**Opt-In Approach (Recommended):**

```typescript
// 1. Add flag to EditableProp interface (lib/cms/registry-types.ts)
interface EditableProp {
  name: string
  type: 'string' | 'richtext' | ...
  label?: string
  inlineEditable?: boolean  // 🆕 NEW: Enable inline editing on canvas
  // ... other props
}

// 2. Mark fields in component registry (lib/cms/component-registry.ts)
CoursePage: {
  editableProps: [
    {
      name: 'collegeTitle',
      type: 'richtext',
      label: 'College/Department Title',
      inlineEditable: true  // ✅ Enable inline editing
    },
    {
      name: 'description',
      type: 'string',
      multiline: true,
      inlineEditable: true  // ✅ Enable inline editing
    },
    {
      name: 'categories',
      type: 'array',
      // inlineEditable not set → uses right panel only
    }
  ]
}

// 3. Components automatically render inline editor
export function CoursePage({ blockId, collegeTitle, description }) {
  return (
    <div>
      {/* Auto-rendered as inline editable (if inlineEditable: true) */}
      <RichTextInlineEditor
        blockId={blockId}
        propName="collegeTitle"
        value={collegeTitle}
        className="text-5xl font-bold"
      />

      <RichTextInlineEditor
        blockId={blockId}
        propName="description"
        value={description}
        className="text-lg"
      />
    </div>
  )
}
```

**Benefits:**
- ✅ Explicit control (only marked fields get inline editing)
- ✅ Backward compatible (existing components unaffected)
- ✅ Gradual rollout (enable field by field)
- ✅ Clear documentation (developers know which fields are editable)

---

## 🔧 Implementation Plan

### Phase 1: Foundation (Day 1) - Type System & Tiptap Integration

#### Task 1.1: Add `inlineEditable` Flag to Type System

**File:** `lib/cms/registry-types.ts`

**Changes:**
```typescript
// Line ~36 - Add to EditableProp interface
interface EditableProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'object' | 'color' | 'url' | 'image' | 'video' | 'media' | 'table' | 'richtext'
  label?: string
  description?: string
  required?: boolean
  defaultValue?: unknown
  options?: string[]
  placeholder?: string
  multiline?: boolean
  inlineEditable?: boolean  // 🆕 NEW: Enable inline canvas editing
  // ... rest of properties
}
```

**Verification:**
- [ ] TypeScript compilation succeeds
- [ ] No type errors in component-registry.ts

---

#### Task 1.2: Enhance RichTextInlineEditor with Tiptap

**File:** `components/page-builder/elementor/inline-editor.tsx`

**Current Issues:**
- Uses deprecated `document.execCommand()` (line 143)
- Limited browser support
- Can't easily add custom features

**Replace With Tiptap:**

```typescript
// NEW: Tiptap-powered RichTextInlineEditor
'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { Extension } from '@tiptap/core'

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
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
      setFontSize: (fontSize: number) => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run()
      },
    }
  },
})

export function RichTextInlineEditor({
  blockId,
  propName,
  value,
  className,
  placeholder = 'Click to edit...',
}: RichTextInlineEditorProps) {
  const { updateBlock, state } = usePageBuilder()
  const { isPreviewMode, selectedBlockId } = state

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || '<p></p>',
    editable: !isPreviewMode,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      updateBlock(blockId, { [propName]: html })
    },
    editorProps: {
      attributes: {
        class: cn(
          className,
          'outline-none transition-all min-h-[1.5em]',
          'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:rounded-sm'
        ),
      },
    },
  })

  if (!editor || isPreviewMode) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: value || placeholder }}
      />
    )
  }

  return (
    <div className="relative">
      {/* Tiptap BubbleMenu - appears when text is selected */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <CanvaLikeToolbar editor={editor} />
      </BubbleMenu>

      {/* Editable content */}
      <EditorContent editor={editor} />
    </div>
  )
}
```

**Verification:**
- [ ] Tiptap initializes without errors
- [ ] Click text on canvas → edits inline
- [ ] Blur saves changes
- [ ] Preview mode disables editing

---

### Phase 2: Canva Toolbar Features (Day 2)

#### Task 2.1: Create CanvaLikeToolbar Component

**New File:** `components/page-builder/elementor/canva-toolbar.tsx`

```typescript
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

  // Get current font size
  const currentSize = editor.getAttributes('textStyle').fontSize || 16

  return (
    <div className="flex items-center gap-1 p-2 bg-popover border border-border rounded-lg shadow-lg">
      {/* Font Family Picker */}
      <Popover open={showFontPicker} onOpenChange={setShowFontPicker}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Type className="h-4 w-4 mr-1" />
            <span className="text-xs">Font</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <Select
            value={editor.getAttributes('textStyle').fontFamily || 'inherit'}
            onValueChange={(value) => {
              editor.chain().focus().setFontFamily(value).run()
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
          onClick={() => {
            const newSize = Math.max(8, parseInt(currentSize) - 1)
            editor.chain().focus().setFontSize(newSize).run()
          }}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <input
          type="number"
          value={currentSize}
          onChange={(e) => {
            const size = parseInt(e.target.value) || 16
            editor.chain().focus().setFontSize(size).run()
          }}
          className="w-10 text-center text-xs bg-transparent border-0 outline-none"
          min="8"
          max="200"
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => {
            const newSize = Math.min(200, parseInt(currentSize) + 1)
            editor.chain().focus().setFontSize(newSize).run()
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
            style={{
              backgroundColor: editor.getAttributes('textStyle').color || 'transparent',
            }}
          >
            <div className="w-4 h-4 rounded border border-border"
                 style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000' }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <ColorPicker
            color={editor.getAttributes('textStyle').color || '#000000'}
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
        onClick={() => editor.chain().focus().toggleBold().run()}
        data-active={editor.isActive('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-active={editor.isActive('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        data-active={editor.isActive('underline')}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
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
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        data-active={editor.isActive({ textAlign: 'left' })}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        data-active={editor.isActive({ textAlign: 'center' })}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        data-active={editor.isActive({ textAlign: 'right' })}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
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
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        data-active={editor.isActive('bulletList')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
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
```

**Canva Features Implemented:**
- ✅ Font family picker (dropdown with common fonts)
- ✅ Font size controls (+/- buttons like Canva)
- ✅ Color picker (matches Canva's color button)
- ✅ Bold, Italic, Underline, Strikethrough
- ✅ Text alignment (left, center, right, justify)
- ✅ Lists (bullet, numbered)
- ✅ Links

**Verification:**
- [ ] All buttons functional
- [ ] Font changes apply to selected text only
- [ ] Color picker works
- [ ] +/- buttons change font size
- [ ] Active states highlight current formatting

---

### Phase 3: Universal Application (Day 2-3)

#### Task 3.1: Update CoursePage Component

**File:** `components/cms-blocks/content/course-page.tsx`

**Current (Lines 277-281):**
```typescript
<h1
  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
  style={{ color: textColor }}
  dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
/>
```

**Replace With:**
```typescript
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'

// In component body:
<RichTextInlineEditor
  blockId={blockId}  // Pass from BaseBlockProps
  propName="collegeTitle"
  value={collegeTitle}
  className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide"
  placeholder="Enter college title..."
/>
```

**Apply to ALL Text Fields:**
```typescript
export function CoursePage({
  blockId,  // From BaseBlockProps
  collegeTitle,
  description,
  categories,
  // ... other props
}: CoursePageProps) {
  return (
    <div>
      {/* Title - Inline editable */}
      <RichTextInlineEditor
        blockId={blockId}
        propName="collegeTitle"
        value={collegeTitle}
        className="text-5xl font-bold"
      />

      {/* Description - Inline editable */}
      <RichTextInlineEditor
        blockId={blockId}
        propName="description"
        value={description}
        className="text-lg"
      />

      {/* Categories */}
      {categories?.map((category, idx) => (
        <div key={idx}>
          {/* Category title - Inline editable */}
          <RichTextInlineEditor
            blockId={blockId}
            propName={`categories.${idx}.title`}
            value={category.title}
            className="text-2xl font-semibold"
          />

          {category.courses?.map((course, courseIdx) => (
            <div key={courseIdx}>
              {/* Course name - Inline editable */}
              <RichTextInlineEditor
                blockId={blockId}
                propName={`categories.${idx}.courses.${courseIdx}.name`}
                value={course.name}
                className="text-xl"
              />

              {/* Course duration - Inline editable */}
              <RichTextInlineEditor
                blockId={blockId}
                propName={`categories.${idx}.courses.${courseIdx}.duration`}
                value={course.duration}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

**Verification:**
- [ ] All text fields click to edit
- [ ] Toolbar appears on selection
- [ ] Changes save correctly
- [ ] Nested properties work (categories.0.title)

---

#### Task 3.2: Update Component Registry

**File:** `lib/cms/component-registry.ts`

**Mark Fields as Inline Editable:**
```typescript
CoursePage: {
  name: 'CoursePage',
  // ... other config
  editableProps: [
    {
      name: 'collegeTitle',
      type: 'richtext',
      label: 'College/Department Title',
      placeholder: 'Enter college/department title...',
      inlineEditable: true  // ✅ ENABLE inline editing
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      multiline: true,
      inlineEditable: true  // ✅ ENABLE inline editing
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Course Categories',
      itemType: 'object',
      itemSchema: {
        properties: {
          title: {
            type: 'string',
            label: 'Category Title',
            required: true,
            inlineEditable: true  // ✅ ENABLE for nested field
          },
          courses: {
            type: 'array',
            label: 'Courses',
            itemType: 'object',
            itemSchema: {
              properties: {
                name: {
                  type: 'string',
                  label: 'Course Name',
                  required: true,
                  inlineEditable: true  // ✅ ENABLE for nested field
                },
                duration: {
                  type: 'string',
                  label: 'Duration',
                  required: true,
                  inlineEditable: true  // ✅ ENABLE for nested field
                },
                specializations: { type: 'array', label: 'Specializations', itemType: 'string' },
              },
              required: ['name', 'duration'],
            },
          },
        },
        required: ['title'],
      },
    },
    { name: 'backgroundColor', type: 'color', label: 'Background Color' },
    { name: 'accentColor', type: 'color', label: 'Accent Color' },
    { name: 'textColor', type: 'color', label: 'Text Color' },
  ],
}
```

**Repeat for Other Components:**
- HeroSection
- AboutSection
- TestimonialsSection
- ContactSection
- etc.

**Verification:**
- [ ] All marked fields render RichTextInlineEditor
- [ ] Right panel still works for fields without inlineEditable
- [ ] Both editing methods coexist

---

### Phase 4: Polish & Testing (Day 3)

#### Task 4.1: Add Keyboard Shortcuts

**File:** `components/page-builder/elementor/inline-editor.tsx`

**Add to RichTextInlineEditor:**
```typescript
useEffect(() => {
  if (!editor) return

  const handleKeyDown = (e: KeyboardEvent) => {
    // Bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      editor.chain().focus().toggleBold().run()
    }
    // Italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      editor.chain().focus().toggleItalic().run()
    }
    // Underline
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault()
      editor.chain().focus().toggleUnderline().run()
    }
    // Escape to exit editing
    if (e.key === 'Escape') {
      editor.commands.blur()
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [editor])
```

**Verification:**
- [ ] Ctrl+B toggles bold
- [ ] Ctrl+I toggles italic
- [ ] Ctrl+U toggles underline
- [ ] Escape exits editing

---

#### Task 4.2: Improve Toolbar Positioning

**File:** `components/page-builder/elementor/inline-editor.tsx`

**Prevent Toolbar from Going Off-Screen:**
```typescript
<BubbleMenu
  editor={editor}
  tippyOptions={{
    duration: 100,
    placement: 'top',
    maxWidth: 'none',
    boundary: 'viewport',  // Keep toolbar in viewport
    offset: [0, 10],
  }}
>
  <CanvaLikeToolbar editor={editor} />
</BubbleMenu>
```

**Verification:**
- [ ] Toolbar stays within viewport bounds
- [ ] Flips to bottom if no room at top
- [ ] Adjusts horizontally if near edges

---

#### Task 4.3: Add Loading States

**File:** `components/page-builder/elementor/inline-editor.tsx`

**Show Skeleton While Editor Initializes:**
```typescript
export function RichTextInlineEditor({ ... }: RichTextInlineEditorProps) {
  const editor = useEditor({ ... })
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (editor) {
      setIsReady(true)
    }
  }, [editor])

  if (!isReady) {
    return (
      <div className={cn(className, 'animate-pulse bg-muted/20 rounded min-h-[1.5em]')} />
    )
  }

  return (
    <div className="relative">
      <BubbleMenu editor={editor}>
        <CanvaLikeToolbar editor={editor} />
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  )
}
```

**Verification:**
- [ ] Skeleton shows while loading
- [ ] Smooth transition to editor
- [ ] No layout shift

---

#### Task 4.4: Comprehensive Testing

**Test Cases:**

**Functional Tests:**
- [ ] Click text → enters edit mode
- [ ] Select text → toolbar appears
- [ ] Font family changes apply
- [ ] Font size +/- works
- [ ] Color picker changes text color
- [ ] Bold/Italic/Underline work
- [ ] Alignment buttons work
- [ ] Lists create bullet/numbered lists
- [ ] Link insertion works
- [ ] Blur saves changes
- [ ] Escape cancels editing

**Cross-Component Tests:**
- [ ] CoursePage: All text fields editable
- [ ] HeroSection: All text fields editable
- [ ] AboutSection: All text fields editable
- [ ] TestimonialsSection: All text fields editable

**Integration Tests:**
- [ ] Right panel still works for non-inline fields
- [ ] Auto-save triggers after inline edits
- [ ] Preview mode disables inline editing
- [ ] Undo/Redo works correctly

**Edge Cases:**
- [ ] Very long text doesn't break toolbar
- [ ] Special characters save correctly
- [ ] HTML entities handled properly
- [ ] Nested fields (categories.0.title) work
- [ ] Rapid clicks don't cause errors

**Performance Tests:**
- [ ] Page with 50+ text fields loads quickly
- [ ] Editing one field doesn't lag others
- [ ] Memory doesn't leak on repeated edits

---

## 📚 Documentation

### Developer Guide: Adding Inline Editing to New Components

**Step 1: Import RichTextInlineEditor**
```typescript
import { RichTextInlineEditor } from '@/components/page-builder/elementor/inline-editor'
```

**Step 2: Replace Plain Text with Editor**
```typescript
// Before:
<h1>{title}</h1>

// After:
<RichTextInlineEditor
  blockId={blockId}
  propName="title"
  value={title}
  className="text-5xl font-bold"
  placeholder="Enter title..."
/>
```

**Step 3: Mark Field in Registry**
```typescript
editableProps: [
  {
    name: 'title',
    type: 'richtext',
    label: 'Title',
    inlineEditable: true  // Enable inline editing
  },
]
```

**Step 4: Test**
- Click text on canvas → should edit inline
- Toolbar should appear on selection
- Changes should save on blur

---

### User Guide: Canva-Like Text Editing

**To Edit Text:**
1. Click any text on the canvas
2. Text becomes editable (blue ring appears)
3. Select text to show formatting toolbar

**Formatting Options:**
- **Font:** Click "Font" button, choose from dropdown
- **Size:** Use +/- buttons or type size directly
- **Color:** Click color swatch, pick color
- **Bold:** Click B or press Ctrl+B
- **Italic:** Click I or press Ctrl+I
- **Underline:** Click U or press Ctrl+U
- **Align:** Click alignment buttons (left/center/right/justify)
- **Lists:** Click bullet or numbered list buttons
- **Links:** Click link button, enter URL

**Keyboard Shortcuts:**
- Ctrl+B: Bold
- Ctrl+I: Italic
- Ctrl+U: Underline
- Escape: Exit editing
- Ctrl+Z: Undo
- Ctrl+Y: Redo

---

## ✅ Success Criteria

### Feature Completeness

- [x] **Font family picker** - Dropdown with common fonts
- [x] **Font size controls** - +/- buttons like Canva
- [x] **Color picker** - Full color palette
- [x] **Bold/Italic/Underline** - Basic formatting
- [x] **Text alignment** - Left/center/right/justify
- [x] **Lists** - Bullet and numbered
- [x] **Links** - Insert hyperlinks
- [x] **Inline editing** - Click text on canvas to edit
- [x] **Floating toolbar** - Appears on text selection
- [x] **Universal** - Works on ALL text fields with inlineEditable flag

### Quality Standards

- [ ] **Performance:** Page with 50+ editable fields loads in < 2s
- [ ] **UX:** Toolbar appears within 100ms of selection
- [ ] **Stability:** Zero crashes during 100 edit operations
- [ ] **Compatibility:** Works in Chrome, Firefox, Safari, Edge
- [ ] **Accessibility:** Keyboard navigation works
- [ ] **Mobile:** Touch selection works on mobile devices

### Comparison with Canva

| Feature | Canva | Our Implementation | Status |
|---------|-------|--------------------|--------|
| Inline editing | ✅ | ✅ | ✅ Complete |
| Floating toolbar | ✅ | ✅ | ✅ Complete |
| Font family | ✅ | ✅ | ✅ Complete |
| Font size +/- | ✅ | ✅ | ✅ Complete |
| Color picker | ✅ | ✅ | ✅ Complete |
| Bold/Italic/Underline | ✅ | ✅ | ✅ Complete |
| Text alignment | ✅ | ✅ | ✅ Complete |
| Lists | ✅ | ✅ | ✅ Complete |
| Links | ✅ | ✅ | ✅ Complete |
| Effects | ✅ | ⏳ | ⏳ Future |
| Animate | ✅ | ⏳ | ⏳ Future |
| Text templates | ✅ | ⏳ | ⏳ Future |

**Coverage:** 90% of core Canva text editing features

---

## 🎯 Timeline

| Phase | Duration | Tasks | Deliverable |
|-------|----------|-------|-------------|
| **Phase 1** | Day 1 (6-8 hours) | Type system, Tiptap integration | RichTextInlineEditor with Tiptap |
| **Phase 2** | Day 2 (6-8 hours) | Canva toolbar features | CanvaLikeToolbar component |
| **Phase 3** | Day 2-3 (4-6 hours) | Universal application | CoursePage + registry updates |
| **Phase 4** | Day 3 (4-6 hours) | Polish, testing, documentation | Production-ready system |
| **Total** | **2-3 days** | **20-28 hours** | **Universal Canva-like text editing** |

---

## 🚀 Future Enhancements (Post-Launch)

### Tier 2 Features (Next Iteration)

1. **Text Effects**
   - Shadow (drop shadow, inner shadow)
   - Outline (stroke)
   - Glow
   - 3D effects

2. **Text Animations**
   - Fade in/out
   - Slide in
   - Bounce
   - Typewriter effect

3. **Text Templates**
   - Left panel: Heading, Subheading, Body
   - Pre-styled text options
   - One-click apply

4. **Advanced Typography**
   - Letter spacing
   - Line height
   - Text transform (uppercase, lowercase, capitalize)
   - Font weight selector

5. **Magic Write (AI)**
   - AI-powered text generation
   - Expand/shorten text
   - Tone adjustment
   - Grammar correction

### Tier 3 Features (Long-term)

6. **Text Layers Panel**
   - View all text elements
   - Navigate to text by clicking
   - Bulk edit multiple text elements

7. **Find & Replace**
   - Search all text on page
   - Replace with formatting preserved

8. **Text Presets**
   - Save favorite text styles
   - Apply saved styles to new text

9. **Version History**
   - Track text changes
   - Revert to previous versions

10. **Collaboration**
    - Real-time collaborative editing
    - Comments on text
    - Suggestions mode

---

## 📝 Notes & Considerations

### Why Tiptap Over document.execCommand?

| Aspect | document.execCommand | Tiptap |
|--------|---------------------|--------|
| **Browser support** | Deprecated | Modern, maintained |
| **Features** | Limited | Extensive extensions |
| **Customization** | Hard | Easy |
| **Consistency** | Browser-dependent | Consistent |
| **Future-proof** | ❌ No | ✅ Yes |

### Why Opt-In (inlineEditable Flag)?

- **Control:** Not all text fields need inline editing (e.g., IDs, slugs)
- **Performance:** Only initialize editors where needed
- **Backward compatibility:** Existing components work unchanged
- **Flexibility:** Easy to toggle per field

### Migration Path for Existing Pages

**Existing pages with plain text values:**
- ✅ Will continue to work (backward compatible)
- ✅ Can be edited inline once component updated
- ✅ HTML formatting will be preserved going forward

**No database migration needed!**

---

## 🎉 Expected Outcome

After implementing this plan, users will be able to:

1. **Click any text** on the canvas to edit it inline
2. **Select portions of text** to apply formatting
3. **Use Canva-like toolbar** with font, size, color controls
4. **Edit ALL text fields** (not just title) with rich formatting
5. **Work faster** with keyboard shortcuts and intuitive UI
6. **Create professional content** with advanced typography

**Timeline:** 2-3 days
**Effort:** 20-28 hours
**Impact:** 10x improvement in text editing UX
**Canva Feature Parity:** ~90% of core text editing

---

**Ready to transform your page builder into a Canva-like editor!** 🚀
