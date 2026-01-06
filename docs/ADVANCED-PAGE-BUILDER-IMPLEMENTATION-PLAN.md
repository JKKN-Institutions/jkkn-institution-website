# Advanced Page Builder Implementation Plan

## Executive Summary

This document outlines a comprehensive 12-week implementation plan to transform the existing JKKN CMS page builder into an advanced, production-ready visual website builder comparable to industry leaders like Webflow, Elementor, Framer, and Builder.io.

### Current State
- ✅ 70-80% complete CMS foundation with 15 database tables
- ✅ Drag-drop interface using @dnd-kit
- ✅ 80+ predefined components with props schema
- ✅ Responsive editing framework in place
- ✅ Public page rendering with PageRenderer

### User Requirements (Priority Order)
1. **Component Code Editor** - Edit TSX code with Monaco editor, Preview/Code toggle
2. **Custom Component Workflow** - shadcn-style: copy TSX → create component
3. **Responsive UI Enhancement** - Desktop/Tablet/Mobile switcher in toolbar
4. **Basic Animations** - Scroll-triggered, fade, slide effects
5. **Advanced Features** - Global styles, templates (deferred: A/B testing)

### Implementation Timeline
- **Phase 1 (Weeks 1-3)**: Component Code Editor with Monaco integration
- **Phase 2 (Weeks 4-5)**: Custom Component Workflow (shadcn-style)
- **Phase 3 (Weeks 6-7)**: Responsive UI Enhancement
- **Phase 4 (Weeks 8-9)**: Basic Animations System
- **Phase 5 (Weeks 10-12)**: Advanced Features (global styles, templates)

---

## Table of Contents

1. [Competitor Analysis](#competitor-analysis)
2. [Gap Analysis](#gap-analysis)
3. [Phase 1: Component Code Editor](#phase-1-component-code-editor-weeks-1-3)
4. [Phase 2: Custom Component Workflow](#phase-2-custom-component-workflow-weeks-4-5)
5. [Phase 3: Responsive UI Enhancement](#phase-3-responsive-ui-enhancement-weeks-6-7)
6. [Phase 4: Basic Animations System](#phase-4-basic-animations-system-weeks-8-9)
7. [Phase 5: Advanced Features](#phase-5-advanced-features-weeks-10-12)
8. [Database Schema Updates](#database-schema-updates)
9. [Testing Strategy](#testing-strategy)
10. [Success Metrics](#success-metrics)

---

## Competitor Analysis

### 1. Webflow (2026 Features)

**Source**: WebSearch results from webflow.com (January 2026)

**Key Features**:
- **Visual CSS Grid/Flexbox Editor**: Direct manipulation of layout properties
- **Class-based Styling System**: Reusable style classes with inheritance
- **Interactions & Animations**: Timeline-based animation editor with triggers
- **CMS with Dynamic Content**: Bind database fields to components
- **Responsive Breakpoints**: 5 breakpoints (base, tablet, mobile landscape, mobile portrait)
- **Component Variants**: Create multiple states of a component
- **Global Swatches**: Centralized color/font management
- **Export Code**: Download production-ready HTML/CSS/JS

**Strengths**:
- Professional CSS control without writing code
- Class-based system prevents style duplication
- Powerful animation timeline editor

**Weaknesses**:
- Steep learning curve for non-technical users
- Limited to Webflow hosting for full features
- Expensive pricing ($29-212/month)

---

### 2. Elementor Pro (2026 Features)

**Source**: WebSearch results from elementor.com (January 2026)

**Key Features**:
- **Theme Builder**: Create headers, footers, archive pages
- **Popup Builder**: Modal/overlay creation with triggers
- **Form Builder**: Drag-drop form creation with validations
- **Dynamic Content Tags**: `{post_title}`, `{user_meta}`, etc.
- **Custom CSS per Element**: Add CSS directly to widgets
- **Motion Effects**: Scroll effects, mouse effects, entrance animations
- **Responsive Editing**: Device-specific visibility and styling
- **Global Widgets**: Reusable widget templates
- **Revision History**: Undo/redo with automatic saving

**Strengths**:
- WordPress integration (huge ecosystem)
- Extensive third-party widget marketplace
- Affordable ($59-399/year)

**Weaknesses**:
- WordPress-only (not standalone)
- Performance issues with complex pages
- Code quality concerns (bloated output)

---

### 3. Framer (2026 Features)

**Source**: WebSearch results from framer.com (January 2026)

**Key Features**:
- **Component Variants**: Multiple states (default, hover, active) with smooth transitions
- **Auto-Layout (Stack)**: CSS Flexbox with visual controls
- **Smart Animations**: Automatic transitions between variants
- **Code Overrides**: Extend components with React code
- **Design Systems**: Shared components, colors, typography across projects
- **Real-time Collaboration**: Multiple users editing simultaneously
- **Responsive Constraints**: Pin/resize behaviors
- **Interactive Components**: Buttons, inputs, forms with built-in states

**Strengths**:
- Design-to-code workflow (Figma-like UX)
- True React components under the hood
- Beautiful default animations

**Weaknesses**:
- Primarily for designers (less CMS-focused)
- Limited e-commerce features
- Requires Framer hosting

---

### 4. Builder.io (2026 Features)

**Source**: WebSearch results from builder.io (January 2026)

**Key Features**:
- **A/B Testing**: Built-in visual experimentation
- **Personalization**: Show different content to user segments
- **Headless CMS**: API-first, framework-agnostic
- **Custom Component Integration**: Register your own React/Vue/Angular components
- **Visual Editing on Live Site**: Edit production site with WYSIWYG overlay
- **Heatmaps & Analytics**: Built-in user behavior tracking
- **Scheduling**: Publish content at specific dates/times
- **Edge Rendering**: Fast global CDN delivery

**Strengths**:
- True headless architecture (works with any framework)
- Advanced targeting and personalization
- Enterprise-grade performance

**Weaknesses**:
- Complex setup for custom components
- Expensive (starts at $99/month)
- Overkill for simple websites

---

## Gap Analysis

### Current JKKN Implementation vs Competitors

| Feature | JKKN (Current) | Webflow | Elementor | Framer | Builder.io | Priority |
|---------|----------------|---------|-----------|--------|------------|----------|
| **Visual Drag-Drop** | ✅ Complete | ✅ | ✅ | ✅ | ✅ | - |
| **Responsive Editing** | 🟡 Basic (data exists, UI incomplete) | ✅ 5 breakpoints | ✅ Device-specific | ✅ Constraints | ✅ Breakpoints | **HIGH** |
| **Component Props Editor** | ✅ Complete | ✅ | ✅ | ✅ | ✅ | - |
| **Preview/Code Toggle** | ❌ Missing | ✅ | ✅ | ✅ | ✅ | **HIGH** |
| **Code Editor (Monaco)** | ❌ Missing | ❌ | ✅ Custom CSS | ✅ Code Overrides | ✅ Custom Code | **HIGH** |
| **Custom Components** | ❌ Missing | ❌ | ✅ Widgets | ✅ Design System | ✅ Register Components | **HIGH** |
| **Animations** | ❌ Missing | ✅ Timeline | ✅ Motion Effects | ✅ Auto-transitions | ✅ A/B tested | **MEDIUM** |
| **Global Styles** | ❌ Missing | ✅ Classes | ✅ Global Widgets | ✅ Design Tokens | ✅ Themes | **MEDIUM** |
| **Templates** | 🟡 Basic (table exists) | ✅ | ✅ | ✅ | ✅ | **MEDIUM** |
| **A/B Testing** | ❌ Missing | ❌ | ❌ | ❌ | ✅ | **LOW (deferred)** |
| **Undo/Redo** | 🟡 Context exists, not wired | ✅ | ✅ | ✅ | ✅ | **MEDIUM** |
| **Real-time Collaboration** | ❌ Missing | ❌ | ❌ | ✅ | ✅ | **LOW (future)** |

**Legend**:
- ✅ Complete
- 🟡 Partial (infrastructure exists, needs UI/logic)
- ❌ Missing

### Priority Breakdown

**CRITICAL (Phase 1-3)**:
1. Component Code Editor with Monaco (user's #1 priority)
2. Custom Component Workflow (shadcn-style import)
3. Responsive UI Enhancement (breakpoint switcher)

**IMPORTANT (Phase 4)**:
4. Basic Animations (scroll-triggered, entrance effects)

**NICE-TO-HAVE (Phase 5)**:
5. Global Styles System
6. Template Management
7. Undo/Redo UI (context exists, needs buttons)

**DEFERRED**:
- A/B Testing (user explicitly deferred)
- Real-time Collaboration (complex, future phase)

---

## Phase 1: Component Code Editor (Weeks 1-3)

### Objective
Add a **Preview/Code toggle** in the main canvas toolbar that allows editing component TSX code with Monaco editor. Remove the code section from the component settings panel (move it to main canvas).

### User Story
> "As a developer, I want to click a 'Code' button in the toolbar to edit the TSX source of the selected component, so I can make advanced customizations beyond the props editor."

### Technical Architecture

#### 1. UI Layout Changes

**Current Layout**:
```
┌─────────────────────────────────────────────────┐
│ Page Builder Header                              │
├───────────┬─────────────────────┬───────────────┤
│ Component │ Main Canvas         │ Settings      │
│ Palette   │ (Preview Only)      │ Panel         │
│           │                     │ - Props       │
│           │                     │ - Styles      │
│           │                     │ - Code ❌      │
└───────────┴─────────────────────┴───────────────┘
```

**New Layout**:
```
┌─────────────────────────────────────────────────┐
│ Page Builder Header                              │
├───────────┬─────────────────────┬───────────────┤
│ Component │ Main Canvas         │ Settings      │
│ Palette   │ ┌─────────────────┐ │ Panel         │
│           │ │ [Preview] [Code]│ │ - Props       │
│           │ └─────────────────┘ │ - Styles      │
│           │ <Preview or Editor> │ (Code removed)│
└───────────┴─────────────────────┴───────────────┘
```

#### 2. State Management

**New Context State**:
```typescript
// components/page-builder/page-builder-context.tsx
interface PageBuilderState {
  // ... existing state
  viewMode: 'preview' | 'code'  // NEW
  codeEditorValue: string        // NEW: Current TSX in editor
  codeErrors: CodeError[]        // NEW: Syntax/type errors
}

interface CodeError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}
```

**New Context Actions**:
```typescript
const actions = {
  // ... existing actions

  setViewMode: (mode: 'preview' | 'code') => void

  loadComponentCode: (blockId: string) => Promise<void>
  // Fetches component TSX from registry or custom_components table

  updateComponentCode: (blockId: string, code: string) => void
  // Updates codeEditorValue, validates syntax

  saveComponentCode: (blockId: string) => Promise<void>
  // Parses TSX, extracts props, updates cms_page_blocks.props
  // If custom component, updates cms_custom_components.code
}
```

#### 3. Component Structure

**New File: `components/page-builder/code-editor-view.tsx`**
```typescript
'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { usePageBuilder } from './page-builder-context'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, AlertCircle } from 'lucide-react'

export function CodeEditorView() {
  const {
    state,
    actions,
    selectedBlock
  } = usePageBuilder()

  const [isSaving, setIsSaving] = useState(false)

  // Load component code when block selected
  useEffect(() => {
    if (selectedBlock && state.viewMode === 'code') {
      actions.loadComponentCode(selectedBlock.id)
    }
  }, [selectedBlock?.id, state.viewMode])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && selectedBlock) {
      actions.updateComponentCode(selectedBlock.id, value)
    }
  }

  const handleSave = async () => {
    if (!selectedBlock) return
    setIsSaving(true)
    try {
      await actions.saveComponentCode(selectedBlock.id)
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setIsSaving(false)
    }
  }

  if (!selectedBlock) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          Select a component to edit its code
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold">{selectedBlock.component_name}</h3>
          <p className="text-xs text-muted-foreground">
            Edit component source code
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || state.codeErrors.length > 0}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {state.codeErrors.length > 0 && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {state.codeErrors.map((err, i) => (
                <li key={i}>
                  Line {err.line}: {err.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language="typescript"
          theme="vs-dark"
          value={state.codeEditorValue}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
          onMount={(editor, monaco) => {
            // Add TypeScript definitions for component props
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              `
              declare module '@/components/ui/*'
              declare module 'react'
              `,
              'global.d.ts'
            )
          }}
        />
      </div>
    </div>
  )
}
```

**Update: `components/page-builder/main-canvas.tsx`**
```typescript
'use client'

import { usePageBuilder } from './page-builder-context'
import { Button } from '@/components/ui/button'
import { Eye, Code } from 'lucide-react'
import { PreviewCanvas } from './preview-canvas'
import { CodeEditorView } from './code-editor-view'

export function MainCanvas() {
  const { state, actions } = usePageBuilder()

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar with Preview/Code Toggle */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Button
          variant={state.viewMode === 'preview' ? 'default' : 'outline'}
          size="sm"
          onClick={() => actions.setViewMode('preview')}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant={state.viewMode === 'code' ? 'default' : 'outline'}
          size="sm"
          onClick={() => actions.setViewMode('code')}
        >
          <Code className="h-4 w-4 mr-2" />
          Code
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {state.viewMode === 'preview' ? (
          <PreviewCanvas />
        ) : (
          <CodeEditorView />
        )}
      </div>
    </div>
  )
}
```

#### 4. Code Parsing and Validation

**New File: `lib/cms/code-parser.ts`**
```typescript
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { z } from 'zod'

export interface ParsedComponent {
  componentName: string
  props: Record<string, any>
  propsSchema: z.ZodObject<any> | null
  dependencies: string[]
  errors: CodeError[]
}

export interface CodeError {
  line: number
  column: number
  message: string
  severity: 'error' | 'warning'
}

/**
 * Parse TSX code to extract component metadata
 *
 * SECURITY NOTE: This uses Babel AST parsing (static analysis), NOT eval() or new Function().
 * The code is never executed during parsing - we only analyze its structure.
 */
export async function parseTSXComponent(code: string): Promise<ParsedComponent> {
  const errors: CodeError[] = []

  try {
    // Parse TSX to AST (does not execute code)
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    })

    let componentName = 'UnknownComponent'
    let propsInterface: any = null
    const dependencies: string[] = []

    // Traverse AST to extract metadata
    traverse(ast, {
      // Find component function/class declaration
      FunctionDeclaration(path) {
        if (path.node.id) {
          componentName = path.node.id.name
        }
      },

      // Find prop type definitions
      TSInterfaceDeclaration(path) {
        if (path.node.id.name.endsWith('Props')) {
          propsInterface = path.node
        }
      },

      // Find imports
      ImportDeclaration(path) {
        dependencies.push(path.node.source.value)
      }
    })

    // Extract props schema from TypeScript interface
    const propsSchema = propsInterface
      ? convertTSInterfaceToZod(propsInterface)
      : null

    return {
      componentName,
      props: {},
      propsSchema,
      dependencies,
      errors
    }

  } catch (error: any) {
    errors.push({
      line: error.loc?.line || 0,
      column: error.loc?.column || 0,
      message: error.message,
      severity: 'error'
    })

    return {
      componentName: 'ErrorComponent',
      props: {},
      propsSchema: null,
      dependencies: [],
      errors
    }
  }
}

/**
 * Convert TypeScript interface to Zod schema
 * Example: interface Props { title: string; count?: number }
 * Becomes: z.object({ title: z.string(), count: z.number().optional() })
 */
function convertTSInterfaceToZod(node: any): z.ZodObject<any> | null {
  // Implementation: Map TS types to Zod validators
  // This is a simplified version - full implementation would handle:
  // - Primitive types (string, number, boolean)
  // - Arrays, objects, unions
  // - Optional vs required
  // - Custom types

  return null // Placeholder for now
}

/**
 * Validate component code for common issues
 */
export function validateComponentCode(code: string): CodeError[] {
  const errors: CodeError[] = []

  // Check for unsafe patterns
  if (code.includes('eval(') || code.includes('new Function(')) {
    errors.push({
      line: 0,
      column: 0,
      message: 'Security violation: eval() and new Function() are not allowed',
      severity: 'error'
    })
  }

  // Check for required exports
  if (!code.includes('export')) {
    errors.push({
      line: 0,
      column: 0,
      message: 'Component must export a function or class',
      severity: 'error'
    })
  }

  return errors
}
```

#### 5. Server Actions

**New File: `app/actions/cms/component-code.ts`**
```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { parseTSXComponent, validateComponentCode } from '@/lib/cms/code-parser'

const updateCodeSchema = z.object({
  blockId: z.string().uuid(),
  code: z.string().min(1),
  pageSlug: z.string()
})

export async function updateComponentCode(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const data = updateCodeSchema.parse({
    blockId: formData.get('blockId'),
    code: formData.get('code'),
    pageSlug: formData.get('pageSlug')
  })

  // Validate code
  const validationErrors = validateComponentCode(data.code)
  if (validationErrors.length > 0) {
    return {
      success: false,
      errors: validationErrors
    }
  }

  // Parse code to extract props
  const parsed = await parseTSXComponent(data.code)
  if (parsed.errors.length > 0) {
    return {
      success: false,
      errors: parsed.errors
    }
  }

  // Check if this is a custom component
  const { data: block } = await supabase
    .from('cms_page_blocks')
    .select('component_name, props')
    .eq('id', data.blockId)
    .single()

  if (!block) throw new Error('Block not found')

  // If component is from cms_custom_components, update its code
  const { data: customComponent } = await supabase
    .from('cms_custom_components')
    .select('id')
    .eq('name', block.component_name)
    .single()

  if (customComponent) {
    // Update custom component code
    const { error } = await supabase
      .from('cms_custom_components')
      .update({
        code: data.code,
        updated_at: new Date().toISOString()
      })
      .eq('id', customComponent.id)

    if (error) throw error
  } else {
    // For built-in components, we can't modify source
    // Instead, store code overrides in a new table (future enhancement)
    return {
      success: false,
      errors: [{
        line: 0,
        column: 0,
        message: 'Cannot edit built-in components. Clone to custom component first.',
        severity: 'error'
      }]
    }
  }

  // Revalidate
  revalidatePath(`/admin/cms/pages/${data.pageSlug}`)

  return { success: true }
}

/**
 * Load component source code
 */
export async function loadComponentCode(blockId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get block
  const { data: block } = await supabase
    .from('cms_page_blocks')
    .select('component_name')
    .eq('id', blockId)
    .single()

  if (!block) throw new Error('Block not found')

  // Check if custom component
  const { data: customComponent } = await supabase
    .from('cms_custom_components')
    .select('code')
    .eq('name', block.component_name)
    .single()

  if (customComponent) {
    return { code: customComponent.code }
  }

  // For built-in components, return placeholder
  return {
    code: '// Built-in components cannot be edited.\n// Clone to custom component to modify.'
  }
}
```

#### 6. Database Schema Updates

**Migration: `add_component_code_tracking.sql`**
```sql
-- Track code modifications for components
CREATE TABLE IF NOT EXISTS public.cms_component_code_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  component_id UUID REFERENCES public.cms_custom_components(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_description TEXT
);

-- Enable RLS
ALTER TABLE public.cms_component_code_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view history of components they can edit
CREATE POLICY "Users can view component code history"
  ON public.cms_component_code_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_custom_components cc
      WHERE cc.id = component_id
      AND (
        cc.created_by = auth.uid()
        OR has_permission(auth.uid(), 'cms:components:edit')
      )
    )
  );

-- Policy: Users can insert history when updating components
CREATE POLICY "Users can create component code history"
  ON public.cms_component_code_history
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cms_custom_components cc
      WHERE cc.id = component_id
      AND (
        cc.created_by = auth.uid()
        OR has_permission(auth.uid(), 'cms:components:edit')
      )
    )
  );

-- Index for performance
CREATE INDEX idx_cms_component_code_history_component
  ON public.cms_component_code_history(component_id, created_at DESC);
```

### Implementation Steps

**Week 1: UI Foundation**
- [ ] Add `viewMode` state to PageBuilderContext
- [ ] Create `CodeEditorView` component with Monaco
- [ ] Update `MainCanvas` with Preview/Code toggle buttons
- [ ] Remove code section from settings panel
- [ ] Test UI navigation (Preview ↔ Code)

**Week 2: Code Parsing & Validation**
- [ ] Implement `parseTSXComponent()` using Babel
- [ ] Implement `validateComponentCode()` security checks
- [ ] Add error display in CodeEditorView
- [ ] Test with valid/invalid TSX code
- [ ] Add TypeScript type definitions for Monaco

**Week 3: Save & Persist**
- [ ] Create Server Actions: `updateComponentCode()`, `loadComponentCode()`
- [ ] Create database migration for code history
- [ ] Wire up Save button to Server Action
- [ ] Add success/error toasts
- [ ] Test full flow: Edit → Save → Refresh → Verify

### Testing Checklist

**Functional Tests**:
- [ ] Selecting a component loads its code in editor
- [ ] Editing code updates `codeEditorValue` state
- [ ] Syntax errors are displayed with line numbers
- [ ] Save button disabled when errors present
- [ ] Saving custom component updates `cms_custom_components.code`
- [ ] Built-in components show "cannot edit" message
- [ ] Switching Preview ↔ Code preserves state

**Security Tests**:
- [ ] `eval()` in code triggers validation error
- [ ] `new Function()` in code triggers validation error
- [ ] Unauthorized users cannot save code
- [ ] RLS policies prevent cross-user modifications

**Edge Cases**:
- [ ] Empty code shows validation error
- [ ] Malformed TSX shows parse errors
- [ ] No component selected shows placeholder message
- [ ] Large files (>10KB) load and save correctly

---

## Phase 2: Custom Component Workflow (Weeks 4-5)

### Objective
Implement a **shadcn-style component import workflow** where users can copy TSX code from anywhere, paste it into a dialog, and the system auto-creates a custom component with detected props.

### User Story
> "As a developer, I want to copy a component from shadcn/ui (or any source), paste the TSX code, give it a name, and have it automatically added to my component palette, so I can reuse it across pages."

### Technical Architecture

#### 1. UI Flow

```
┌─────────────────────────────────────────┐
│ Component Palette (Left Sidebar)        │
│ ┌─────────────────────────────────────┐ │
│ │ + Add Custom Component              │ │ ← Click to open dialog
│ └─────────────────────────────────────┘ │
│                                         │
│ [Built-in Components]                   │
│ [Custom Components] ← New category      │
└─────────────────────────────────────────┘

            ↓ Click "+ Add Custom Component"

┌─────────────────────────────────────────┐
│ Create Custom Component Dialog          │
│                                          │
│ Component Name: [_____________]          │
│ Category: [Select: content/media/...]   │
│ Display Name: [_____________]            │
│                                          │
│ Paste TSX Code:                          │
│ ┌──────────────────────────────────────┐│
│ │ export function MyButton({ ... }) {  ││
│ │   return <button>...</button>        ││
│ │ }                                    ││
│ └──────────────────────────────────────┘│
│                                          │
│ ✅ Auto-detected props:                 │
│    - label: string                       │
│    - onClick: function                   │
│    - variant: 'primary' | 'secondary'   │
│                                          │
│ [Cancel] [Create Component]              │
└─────────────────────────────────────────┘

            ↓ Click "Create Component"

✅ Component saved to cms_custom_components
✅ Added to component palette under "Custom"
✅ Ready to drag onto canvas
```

#### 2. Database Schema

**Table: `cms_custom_components` (already exists, needs validation)**
```sql
CREATE TABLE IF NOT EXISTS public.cms_custom_components (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,              -- e.g., "MyButton"
  display_name TEXT,                      -- e.g., "My Custom Button"
  code TEXT NOT NULL,                     -- Full TSX source
  props_schema JSONB,                     -- Auto-detected Zod schema
  default_props JSONB,                    -- Default values
  category TEXT,                          -- content/media/layout/data/custom
  tags TEXT[],                            -- Searchable tags
  preview_image_url TEXT,                 -- Optional screenshot
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false         -- Share with other users?
);

-- Enable RLS
ALTER TABLE public.cms_custom_components ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own custom components
CREATE POLICY "Users can view own custom components"
  ON public.cms_custom_components
  FOR SELECT
  USING (created_by = auth.uid() OR is_public = true);

-- Policy: Users can create custom components
CREATE POLICY "Users can create custom components"
  ON public.cms_custom_components
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Policy: Users can update their own custom components
CREATE POLICY "Users can update own custom components"
  ON public.cms_custom_components
  FOR UPDATE
  USING (created_by = auth.uid());

-- Policy: Users can delete their own custom components
CREATE POLICY "Users can delete own custom components"
  ON public.cms_custom_components
  FOR DELETE
  USING (created_by = auth.uid());

-- Index for performance
CREATE INDEX idx_cms_custom_components_created_by
  ON public.cms_custom_components(created_by);
CREATE INDEX idx_cms_custom_components_category
  ON public.cms_custom_components(category);
```

#### 3. Props Auto-Detection

**Enhanced: `lib/cms/code-parser.ts`**
```typescript
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { z } from 'zod'

/**
 * Auto-detect props from TSX component code
 * Supports multiple detection methods:
 * 1. TypeScript interface (interface MyButtonProps { ... })
 * 2. Type alias (type MyButtonProps = { ... })
 * 3. Inline props ({ label, onClick }: { label: string; onClick: () => void })
 */
export interface DetectedProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'function' | 'object' | 'array' | 'enum' | 'unknown'
  isOptional: boolean
  defaultValue?: any
  description?: string
  enumValues?: string[]  // For union types: 'primary' | 'secondary'
}

export async function detectPropsFromTSX(code: string): Promise<DetectedProp[]> {
  const props: DetectedProp[] = []

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    })

    traverse(ast, {
      // Method 1: Find interface XxxProps
      TSInterfaceDeclaration(path) {
        if (path.node.id.name.endsWith('Props')) {
          path.node.body.body.forEach((member: any) => {
            if (t.isTSPropertySignature(member) && t.isIdentifier(member.key)) {
              props.push({
                name: member.key.name,
                type: mapTSTypeToSimpleType(member.typeAnnotation?.typeAnnotation),
                isOptional: member.optional || false,
                enumValues: extractEnumValues(member.typeAnnotation?.typeAnnotation)
              })
            }
          })
        }
      },

      // Method 2: Find type XxxProps = { ... }
      TSTypeAliasDeclaration(path) {
        if (path.node.id.name.endsWith('Props') && t.isTSTypeLiteral(path.node.typeAnnotation)) {
          path.node.typeAnnotation.members.forEach((member: any) => {
            if (t.isTSPropertySignature(member) && t.isIdentifier(member.key)) {
              props.push({
                name: member.key.name,
                type: mapTSTypeToSimpleType(member.typeAnnotation?.typeAnnotation),
                isOptional: member.optional || false,
                enumValues: extractEnumValues(member.typeAnnotation?.typeAnnotation)
              })
            }
          })
        }
      },

      // Method 3: Inline props in function declaration
      FunctionDeclaration(path) {
        const firstParam = path.node.params[0]
        if (t.isObjectPattern(firstParam) && firstParam.typeAnnotation) {
          // Extract from inline type annotation
          // This is complex - simplified for now
        }
      }
    })

  } catch (error) {
    console.error('Props detection error:', error)
  }

  return props
}

/**
 * Map TypeScript AST type to simplified type string
 */
function mapTSTypeToSimpleType(typeAnnotation: any): DetectedProp['type'] {
  if (!typeAnnotation) return 'unknown'

  if (t.isTSStringKeyword(typeAnnotation)) return 'string'
  if (t.isTSNumberKeyword(typeAnnotation)) return 'number'
  if (t.isTSBooleanKeyword(typeAnnotation)) return 'boolean'
  if (t.isTSFunctionType(typeAnnotation)) return 'function'
  if (t.isTSArrayType(typeAnnotation)) return 'array'
  if (t.isTSTypeLiteral(typeAnnotation)) return 'object'
  if (t.isTSUnionType(typeAnnotation)) return 'enum'

  return 'unknown'
}

/**
 * Extract enum values from union type
 * Example: 'primary' | 'secondary' | 'tertiary' → ['primary', 'secondary', 'tertiary']
 */
function extractEnumValues(typeAnnotation: any): string[] | undefined {
  if (t.isTSUnionType(typeAnnotation)) {
    return typeAnnotation.types
      .filter((type: any) => t.isTSLiteralType(type))
      .map((type: any) => type.literal.value)
      .filter((val: any) => typeof val === 'string')
  }
  return undefined
}

/**
 * Generate Zod schema from detected props
 */
export function generateZodSchema(props: DetectedProp[]): string {
  const schemaFields = props.map(prop => {
    let zodType = 'z.unknown()'

    switch (prop.type) {
      case 'string':
        zodType = 'z.string()'
        break
      case 'number':
        zodType = 'z.number()'
        break
      case 'boolean':
        zodType = 'z.boolean()'
        break
      case 'array':
        zodType = 'z.array(z.any())'
        break
      case 'object':
        zodType = 'z.object({})'
        break
      case 'enum':
        if (prop.enumValues) {
          zodType = `z.enum([${prop.enumValues.map(v => `'${v}'`).join(', ')}])`
        }
        break
    }

    if (prop.isOptional) {
      zodType += '.optional()'
    }

    return `  ${prop.name}: ${zodType}`
  })

  return `z.object({\n${schemaFields.join(',\n')}\n})`
}
```

#### 4. Component Creation Dialog

**New File: `components/page-builder/create-custom-component-dialog.tsx`**
```typescript
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Check, AlertCircle } from 'lucide-react'
import { detectPropsFromTSX, generateZodSchema } from '@/lib/cms/code-parser'
import { createCustomComponent } from '@/app/actions/cms/custom-components'
import type { DetectedProp } from '@/lib/cms/code-parser'

interface CreateCustomComponentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateCustomComponentDialog({
  open,
  onOpenChange,
  onSuccess
}: CreateCustomComponentDialogProps) {
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [category, setCategory] = useState('custom')
  const [code, setCode] = useState('')
  const [detectedProps, setDetectedProps] = useState<DetectedProp[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCodeChange = async (newCode: string) => {
    setCode(newCode)
    setError(null)

    // Auto-detect props when code changes (debounced in real implementation)
    if (newCode.length > 10) {
      setIsAnalyzing(true)
      try {
        const props = await detectPropsFromTSX(newCode)
        setDetectedProps(props)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('displayName', displayName)
      formData.append('category', category)
      formData.append('code', code)
      formData.append('propsSchema', generateZodSchema(detectedProps))

      const result = await createCustomComponent(formData)

      if (result.success) {
        onSuccess()
        onOpenChange(false)
        // Reset form
        setName('')
        setDisplayName('')
        setCode('')
        setDetectedProps([])
      } else {
        setError(result.error || 'Failed to create component')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Component</DialogTitle>
          <DialogDescription>
            Paste TSX code from shadcn/ui or any source. Props will be auto-detected.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Component Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Component Name*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="MyButton"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                PascalCase, unique identifier
              </p>
            </div>

            <div>
              <Label htmlFor="displayName">Display Name*</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="My Custom Button"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="layout">Layout</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Code Input */}
          <div>
            <Label htmlFor="code">Component Code (TSX)*</Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="export function MyButton({ label, onClick }: MyButtonProps) {
  return <button onClick={onClick}>{label}</button>
}"
              rows={12}
              className="font-mono text-sm"
              required
            />
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Auto-detected Props */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing code...
            </div>
          )}

          {!isAnalyzing && detectedProps.length > 0 && (
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-3">
                <Check className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-sm">Auto-detected Props</h4>
              </div>
              <ul className="space-y-2 text-sm">
                {detectedProps.map((prop) => (
                  <li key={prop.name} className="flex items-baseline gap-2">
                    <code className="px-1.5 py-0.5 rounded bg-background font-mono">
                      {prop.name}
                    </code>
                    <span className="text-muted-foreground">
                      {prop.type}
                      {prop.isOptional && ' (optional)'}
                      {prop.enumValues && ` = ${prop.enumValues.join(' | ')}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !name || !code || detectedProps.length === 0}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Component'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

#### 5. Component Palette Integration

**Update: `components/page-builder/component-palette.tsx`**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateCustomComponentDialog } from './create-custom-component-dialog'
import { getCustomComponents } from '@/app/actions/cms/custom-components'

export function ComponentPalette() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [customComponents, setCustomComponents] = useState([])

  // Load custom components
  useEffect(() => {
    loadCustomComponents()
  }, [])

  const loadCustomComponents = async () => {
    const components = await getCustomComponents()
    setCustomComponents(components)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Component
        </Button>
      </div>

      {/* Component Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Built-in Components */}
        <ComponentCategory title="Content" components={contentComponents} />
        <ComponentCategory title="Media" components={mediaComponents} />
        <ComponentCategory title="Layout" components={layoutComponents} />

        {/* Custom Components */}
        {customComponents.length > 0 && (
          <ComponentCategory
            title="Custom"
            components={customComponents}
            onRefresh={loadCustomComponents}
          />
        )}
      </div>

      {/* Create Dialog */}
      <CreateCustomComponentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadCustomComponents}
      />
    </div>
  )
}
```

#### 6. Server Actions

**New File: `app/actions/cms/custom-components.ts`**
```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { validateComponentCode, parseTSXComponent } from '@/lib/cms/code-parser'

const createComponentSchema = z.object({
  name: z.string().min(1).regex(/^[A-Z][a-zA-Z0-9]*$/, 'Must be PascalCase'),
  displayName: z.string().min(1),
  category: z.enum(['content', 'media', 'layout', 'data', 'custom']),
  code: z.string().min(10),
  propsSchema: z.string()
})

export async function createCustomComponent(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const data = createComponentSchema.parse({
    name: formData.get('name'),
    displayName: formData.get('displayName'),
    category: formData.get('category'),
    code: formData.get('code'),
    propsSchema: formData.get('propsSchema')
  })

  // Validate code
  const validationErrors = validateComponentCode(data.code)
  if (validationErrors.length > 0) {
    return {
      success: false,
      error: validationErrors[0].message
    }
  }

  // Parse to ensure valid TSX
  const parsed = await parseTSXComponent(data.code)
  if (parsed.errors.length > 0) {
    return {
      success: false,
      error: parsed.errors[0].message
    }
  }

  // Check for duplicate name
  const { data: existing } = await supabase
    .from('cms_custom_components')
    .select('id')
    .eq('name', data.name)
    .single()

  if (existing) {
    return {
      success: false,
      error: `Component "${data.name}" already exists`
    }
  }

  // Insert component
  const { error } = await supabase
    .from('cms_custom_components')
    .insert({
      name: data.name,
      display_name: data.displayName,
      category: data.category,
      code: data.code,
      props_schema: JSON.parse(data.propsSchema),
      created_by: user.id
    })

  if (error) throw error

  revalidatePath('/admin/cms')

  return { success: true }
}

export async function getCustomComponents() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('cms_custom_components')
    .select('*')
    .order('created_at', { ascending: false })

  return data || []
}
```

### Implementation Steps

**Week 4: UI & Props Detection**
- [ ] Create `cms_custom_components` table migration
- [ ] Implement `detectPropsFromTSX()` with Babel parsing
- [ ] Create `CreateCustomComponentDialog` component
- [ ] Add "+ Add Custom Component" button to palette
- [ ] Test props auto-detection with various TSX patterns

**Week 5: Integration & Testing**
- [ ] Create `createCustomComponent()` Server Action
- [ ] Wire up dialog to Server Action
- [ ] Add custom components to component palette
- [ ] Test full flow: Paste TSX → Detect Props → Create → Drag onto Canvas
- [ ] Add error handling for duplicate names, invalid code

### Testing Checklist

**Props Auto-Detection Tests**:
- [ ] Detects props from `interface XxxProps { ... }`
- [ ] Detects props from `type XxxProps = { ... }`
- [ ] Detects optional props (`prop?:`)
- [ ] Detects enum types (`'a' | 'b' | 'c'`)
- [ ] Handles complex types (arrays, objects, functions)

**Component Creation Tests**:
- [ ] Valid TSX creates component in database
- [ ] Invalid TSX shows error message
- [ ] Duplicate names rejected
- [ ] Component appears in palette immediately
- [ ] Component can be dragged onto canvas
- [ ] Props editor shows auto-detected props

**Security Tests**:
- [ ] User can only create components for themselves
- [ ] RLS prevents cross-user access
- [ ] Code validation blocks unsafe patterns

---

## Phase 3: Responsive UI Enhancement (Weeks 6-7)

### Objective
Add **Desktop/Tablet/Mobile breakpoint switcher** buttons to the main canvas toolbar, allowing users to preview and edit component props per device size.

### User Story
> "As a content editor, I want to click 'Mobile' in the toolbar and see how my page looks on mobile, then override specific component props (like font size or image) for mobile devices only."

### Technical Architecture

#### 1. Breakpoint System

**Breakpoint Definitions**:
```typescript
// lib/cms/breakpoints.ts
export const BREAKPOINTS = {
  desktop: {
    name: 'Desktop',
    icon: 'Monitor',
    width: 1280,
    minWidth: 1024,
    description: 'Desktop and laptop screens'
  },
  tablet: {
    name: 'Tablet',
    icon: 'Tablet',
    width: 768,
    minWidth: 640,
    maxWidth: 1023,
    description: 'iPad and tablet devices'
  },
  mobile: {
    name: 'Mobile',
    icon: 'Smartphone',
    width: 375,
    maxWidth: 639,
    description: 'Mobile phones'
  }
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

// Responsive settings structure (already defined in responsive-props-editor.tsx)
export interface ResponsiveSettings {
  desktop: Record<string, any>   // Base/default props
  tablet?: Record<string, any>   // Overrides for tablet
  mobile?: Record<string, any>   // Overrides for mobile
}
```

#### 2. UI Layout

**Updated Main Canvas with Breakpoint Switcher**:
```
┌──────────────────────────────────────────────────────┐
│ Main Canvas Toolbar                                   │
│ ┌────────┬──────┬────────┐  ┌─────────┬──────┐      │
│ │ Preview│ Code │        │  │ Desktop │Tablet│Mobile│
│ └────────┴──────┴────────┘  └─────────┴──────┴──────┘│
├──────────────────────────────────────────────────────┤
│                                                       │
│ [Preview Canvas at selected breakpoint width]        │
│                                                       │
└──────────────────────────────────────────────────────┘

Settings Panel (Right Sidebar):
┌──────────────────────────────────────┐
│ Component Settings                    │
│                                       │
│ [Desktop] [Tablet] [Mobile] ← Tabs   │
│                                       │
│ Title: [Welcome_________]             │
│ Font Size: [48___] ← Desktop value   │
│                                       │
│ Switch to "Mobile" tab ↓              │
│                                       │
│ Title: [Welcome_________] (inherited) │
│ Font Size: [24___] ← Mobile override │
│             ↑ Override badge shown    │
└──────────────────────────────────────┘
```

#### 3. State Management

**Update Context State**:
```typescript
// components/page-builder/page-builder-context.tsx
interface PageBuilderState {
  // ... existing state
  currentBreakpoint: Breakpoint  // NEW: desktop | tablet | mobile
  showResponsiveOverrides: boolean  // NEW: Toggle to show override indicators
}

const actions = {
  // ... existing actions

  setBreakpoint: (breakpoint: Breakpoint) => void

  updateResponsiveProp: (
    blockId: string,
    breakpoint: Breakpoint,
    propKey: string,
    value: any
  ) => void

  resetResponsiveProp: (
    blockId: string,
    breakpoint: Breakpoint,
    propKey?: string  // If omitted, reset all overrides for breakpoint
  ) => void
}
```

#### 4. Component Implementation

**New File: `components/page-builder/breakpoint-switcher.tsx`**
```typescript
'use client'

import { usePageBuilder } from './page-builder-context'
import { Button } from '@/components/ui/button'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { BREAKPOINTS, type Breakpoint } from '@/lib/cms/breakpoints'
import { cn } from '@/lib/utils'

export function BreakpointSwitcher() {
  const { state, actions } = usePageBuilder()

  const breakpoints: Breakpoint[] = ['desktop', 'tablet', 'mobile']

  const IconMap = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {breakpoints.map((bp) => {
        const Icon = IconMap[bp]
        const isActive = state.currentBreakpoint === bp

        return (
          <Button
            key={bp}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => actions.setBreakpoint(bp)}
            className={cn(
              'gap-2',
              isActive && 'shadow-sm'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{BREAKPOINTS[bp].name}</span>
          </Button>
        )
      })}
    </div>
  )
}
```

**Update: `components/page-builder/main-canvas.tsx`**
```typescript
'use client'

import { usePageBuilder } from './page-builder-context'
import { Button } from '@/components/ui/button'
import { Eye, Code } from 'lucide-react'
import { PreviewCanvas } from './preview-canvas'
import { CodeEditorView } from './code-editor-view'
import { BreakpointSwitcher } from './breakpoint-switcher'
import { BREAKPOINTS } from '@/lib/cms/breakpoints'

export function MainCanvas() {
  const { state, actions } = usePageBuilder()

  // Get current breakpoint width
  const canvasWidth = BREAKPOINTS[state.currentBreakpoint].width

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        {/* Left: Preview/Code Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={state.viewMode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => actions.setViewMode('preview')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={state.viewMode === 'code' ? 'default' : 'outline'}
            size="sm"
            onClick={() => actions.setViewMode('code')}
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </Button>
        </div>

        {/* Right: Breakpoint Switcher */}
        <BreakpointSwitcher />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-muted">
        {state.viewMode === 'preview' ? (
          <div className="h-full flex items-start justify-center p-8 overflow-auto">
            {/* Canvas with responsive width */}
            <div
              className="bg-background shadow-xl transition-all duration-300"
              style={{
                width: `${canvasWidth}px`,
                minHeight: '100%'
              }}
            >
              <PreviewCanvas />
            </div>
          </div>
        ) : (
          <CodeEditorView />
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-background text-xs text-muted-foreground">
        <span>
          Viewing: {BREAKPOINTS[state.currentBreakpoint].name}
          ({BREAKPOINTS[state.currentBreakpoint].width}px)
        </span>
        <span>
          {state.blocks.length} components
        </span>
      </div>
    </div>
  )
}
```

**Update Settings Panel to Use ResponsivePropsEditor**:
```typescript
// components/page-builder/component-settings-panel.tsx
'use client'

import { usePageBuilder } from './page-builder-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResponsivePropsEditor } from './responsive-props-editor'
import { getComponentEntry } from '@/lib/cms/component-registry'

export function ComponentSettingsPanel() {
  const { state, actions, selectedBlock } = usePageBuilder()

  if (!selectedBlock) {
    return <EmptyState />
  }

  const componentEntry = getComponentEntry(selectedBlock.component_name)
  if (!componentEntry) return null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">{componentEntry.displayName}</h3>
        <p className="text-xs text-muted-foreground">{selectedBlock.component_name}</p>
      </div>

      {/* Responsive Props Editor */}
      <div className="flex-1 overflow-y-auto p-4">
        <ResponsivePropsEditor
          componentName={selectedBlock.component_name}
          propsSchema={componentEntry.propsSchema}
          baseProps={selectedBlock.props}
          responsiveSettings={selectedBlock.responsive_settings || {
            desktop: selectedBlock.props,
            tablet: {},
            mobile: {}
          }}
          currentBreakpoint={state.currentBreakpoint}
          onChange={(breakpoint, props) => {
            actions.updateBlockResponsiveSettings(selectedBlock.id, breakpoint, props)
          }}
          onReset={(breakpoint, propKey) => {
            actions.resetResponsiveProp(selectedBlock.id, breakpoint, propKey)
          }}
        />
      </div>
    </div>
  )
}
```

#### 5. Preview Canvas Responsive Rendering

**Update: `components/page-builder/preview-canvas.tsx`**
```typescript
'use client'

import { usePageBuilder } from './page-builder-context'
import { getComponent, getComponentEntry } from '@/lib/cms/component-registry'
import { cn } from '@/lib/utils'

export function PreviewCanvas() {
  const { state } = usePageBuilder()

  return (
    <div className="min-h-screen p-8">
      {state.blocks.map((block) => (
        <RenderBlock
          key={block.id}
          block={block}
          currentBreakpoint={state.currentBreakpoint}
        />
      ))}
    </div>
  )
}

function RenderBlock({ block, currentBreakpoint }) {
  const Component = getComponent(block.component_name)
  if (!Component) return null

  // Merge props: desktop (base) + breakpoint overrides
  const effectiveProps = {
    ...block.props,  // Desktop/base
    ...(block.responsive_settings?.[currentBreakpoint] || {})  // Overrides
  }

  return (
    <div className={cn('relative', block.custom_classes)}>
      <Component {...effectiveProps} />
    </div>
  )
}
```

#### 6. Database Storage (Already Complete)

The `cms_page_blocks.responsive_settings` JSONB column already exists. No migration needed.

**Data Structure**:
```json
{
  "desktop": {
    "title": "Welcome to JKKN",
    "fontSize": 48,
    "image": "/images/desktop-hero.jpg"
  },
  "tablet": {
    "fontSize": 36
  },
  "mobile": {
    "fontSize": 24,
    "image": "/images/mobile-hero.jpg"
  }
}
```

**Interpretation**:
- Desktop: `{ title: "Welcome to JKKN", fontSize: 48, image: "/images/desktop-hero.jpg" }`
- Tablet: `{ title: "Welcome to JKKN", fontSize: 36, image: "/images/desktop-hero.jpg" }` (inherits title and image)
- Mobile: `{ title: "Welcome to JKKN", fontSize: 24, image: "/images/mobile-hero.jpg" }` (overrides fontSize and image)

### Implementation Steps

**Week 6: Breakpoint Switcher UI**
- [ ] Create `BREAKPOINTS` constants in `lib/cms/breakpoints.ts`
- [ ] Add `currentBreakpoint` to PageBuilderContext
- [ ] Create `BreakpointSwitcher` component
- [ ] Update `MainCanvas` toolbar with switcher
- [ ] Implement canvas width transition animation
- [ ] Test breakpoint switching updates canvas width

**Week 7: Responsive Props Integration**
- [ ] Wire `ResponsivePropsEditor` to settings panel
- [ ] Update `PreviewCanvas` to merge responsive props
- [ ] Add override badges to settings panel
- [ ] Test prop override cascade (desktop → tablet → mobile)
- [ ] Add "Reset All Overrides" button per breakpoint
- [ ] Test save and load with responsive settings

### Testing Checklist

**Breakpoint Switching Tests**:
- [ ] Clicking "Desktop" shows 1280px canvas
- [ ] Clicking "Tablet" shows 768px canvas
- [ ] Clicking "Mobile" shows 375px canvas
- [ ] Canvas width animates smoothly on switch
- [ ] Selected breakpoint highlighted in switcher

**Responsive Props Tests**:
- [ ] Desktop props are base/default
- [ ] Tablet inherits desktop props by default
- [ ] Mobile inherits desktop props by default
- [ ] Overriding tablet prop shows override badge
- [ ] Overriding mobile prop shows override badge
- [ ] Reset button removes override, reverts to desktop value
- [ ] Preview canvas updates immediately when prop changed

**Data Persistence Tests**:
- [ ] Saving page persists responsive_settings to database
- [ ] Loading page restores responsive_settings correctly
- [ ] Public page rendering uses correct props per device
- [ ] Responsive settings survive page refresh

---

## Phase 4: Basic Animations System (Weeks 8-9)

### Objective
Add **scroll-triggered animations** and **entrance effects** (fade, slide, zoom) to components via a simple animation settings panel.

### User Story
> "As a content editor, I want to add a 'Fade In' animation to my hero section that triggers when the user scrolls to it, so the page feels more dynamic."

### Technical Architecture

#### 1. Animation Types

**Supported Animations**:
```typescript
// lib/cms/animations.ts
export const ENTRANCE_ANIMATIONS = {
  none: {
    name: 'None',
    description: 'No animation'
  },
  fadeIn: {
    name: 'Fade In',
    description: 'Fade in from transparent',
    duration: 0.6,
    easing: 'easeOut'
  },
  fadeInUp: {
    name: 'Fade In Up',
    description: 'Fade in while sliding up',
    duration: 0.8,
    easing: 'easeOut'
  },
  fadeInDown: {
    name: 'Fade In Down',
    description: 'Fade in while sliding down',
    duration: 0.8,
    easing: 'easeOut'
  },
  slideInLeft: {
    name: 'Slide In Left',
    description: 'Slide in from left',
    duration: 0.8,
    easing: 'easeOut'
  },
  slideInRight: {
    name: 'Slide In Right',
    description: 'Slide in from right',
    duration: 0.8,
    easing: 'easeOut'
  },
  zoomIn: {
    name: 'Zoom In',
    description: 'Scale up from small',
    duration: 0.6,
    easing: 'easeOut'
  },
  bounceIn: {
    name: 'Bounce In',
    description: 'Bounce in with spring',
    duration: 1.0,
    easing: 'spring'
  }
} as const

export const SCROLL_ANIMATIONS = {
  none: 'None',
  parallax: 'Parallax (slow scroll)',
  reveal: 'Reveal on scroll',
  sticky: 'Sticky until scroll'
} as const

export const HOVER_EFFECTS = {
  none: 'None',
  lift: 'Lift (shadow + translateY)',
  scale: 'Scale up',
  glow: 'Glow effect'
} as const

export interface AnimationSettings {
  entrance: keyof typeof ENTRANCE_ANIMATIONS
  scroll: keyof typeof SCROLL_ANIMATIONS
  hover: keyof typeof HOVER_EFFECTS
  delay: number  // Delay before entrance animation (ms)
  duration: number  // Override default duration (s)
}
```

#### 2. Database Storage

Animations stored in `cms_page_blocks.props._animation` (convention: props starting with `_` are internal, not passed to component).

**Example**:
```json
{
  "props": {
    "title": "Welcome",
    "_animation": {
      "entrance": "fadeInUp",
      "scroll": "reveal",
      "hover": "lift",
      "delay": 200,
      "duration": 0.8
    }
  }
}
```

#### 3. Animation Wrapper Component

**New File: `components/cms-blocks/animations/animation-wrapper.tsx`**
```typescript
'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef } from 'react'
import { ENTRANCE_ANIMATIONS, type AnimationSettings } from '@/lib/cms/animations'

interface AnimationWrapperProps {
  children: React.ReactNode
  animation: AnimationSettings
}

export function AnimationWrapper({ children, animation }: AnimationWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Get animation config
  const entranceConfig = ENTRANCE_ANIMATIONS[animation.entrance]

  if (animation.entrance === 'none') {
    // No animation, render children directly
    return <>{children}</>
  }

  // Define animation variants
  const variants: Variants = {
    hidden: getHiddenState(animation.entrance),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: animation.duration || entranceConfig.duration,
        delay: animation.delay / 1000,
        ease: entranceConfig.easing === 'spring'
          ? [0.25, 0.46, 0.45, 0.94]
          : 'easeOut'
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className="relative"
    >
      {children}
    </motion.div>
  )
}

/**
 * Get initial hidden state for each animation type
 */
function getHiddenState(animation: string): Record<string, any> {
  switch (animation) {
    case 'fadeIn':
      return { opacity: 0 }

    case 'fadeInUp':
      return { opacity: 0, y: 40 }

    case 'fadeInDown':
      return { opacity: 0, y: -40 }

    case 'slideInLeft':
      return { opacity: 0, x: -100 }

    case 'slideInRight':
      return { opacity: 0, x: 100 }

    case 'zoomIn':
      return { opacity: 0, scale: 0.8 }

    case 'bounceIn':
      return { opacity: 0, scale: 0.5 }

    default:
      return { opacity: 0 }
  }
}
```

#### 4. Animation Settings Panel

**New File: `components/page-builder/animation-settings.tsx`**
```typescript
'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { ENTRANCE_ANIMATIONS, SCROLL_ANIMATIONS, HOVER_EFFECTS, type AnimationSettings } from '@/lib/cms/animations'
import { Sparkles } from 'lucide-react'

interface AnimationSettingsPanelProps {
  value: AnimationSettings
  onChange: (settings: AnimationSettings) => void
}

export function AnimationSettingsPanel({ value, onChange }: AnimationSettingsPanelProps) {
  const updateSetting = (key: keyof AnimationSettings, newValue: any) => {
    onChange({ ...value, [key]: newValue })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <h3 className="font-semibold">Animations</h3>
      </div>

      {/* Entrance Animation */}
      <div className="space-y-2">
        <Label htmlFor="entrance">Entrance Animation</Label>
        <Select
          value={value.entrance}
          onValueChange={(v) => updateSetting('entrance', v)}
        >
          <SelectTrigger id="entrance">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ENTRANCE_ANIMATIONS).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {ENTRANCE_ANIMATIONS[value.entrance].description}
        </p>
      </div>

      {/* Scroll Behavior */}
      <div className="space-y-2">
        <Label htmlFor="scroll">Scroll Behavior</Label>
        <Select
          value={value.scroll}
          onValueChange={(v) => updateSetting('scroll', v)}
        >
          <SelectTrigger id="scroll">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SCROLL_ANIMATIONS).map(([key, name]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Hover Effect */}
      <div className="space-y-2">
        <Label htmlFor="hover">Hover Effect</Label>
        <Select
          value={value.hover}
          onValueChange={(v) => updateSetting('hover', v)}
        >
          <SelectTrigger id="hover">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(HOVER_EFFECTS).map(([key, name]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Delay */}
      {value.entrance !== 'none' && (
        <div className="space-y-2">
          <Label htmlFor="delay">Delay (ms)</Label>
          <div className="flex items-center gap-4">
            <Slider
              id="delay"
              min={0}
              max={2000}
              step={100}
              value={[value.delay]}
              onValueChange={([v]) => updateSetting('delay', v)}
              className="flex-1"
            />
            <Input
              type="number"
              value={value.delay}
              onChange={(e) => updateSetting('delay', parseInt(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
      )}

      {/* Duration */}
      {value.entrance !== 'none' && (
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <div className="flex items-center gap-4">
            <Slider
              id="duration"
              min={0.2}
              max={3}
              step={0.1}
              value={[value.duration]}
              onValueChange={([v]) => updateSetting('duration', v)}
              className="flex-1"
            />
            <Input
              type="number"
              step={0.1}
              value={value.duration}
              onChange={(e) => updateSetting('duration', parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 5. Integration with PageRenderer

**Update: `components/cms-blocks/page-renderer.tsx`**
```typescript
import { AnimationWrapper } from './animations/animation-wrapper'
import type { AnimationSettings } from '@/lib/cms/animations'

function RenderBlock({ block }: { block: BlockData }) {
  const Component = getComponent(block.component_name)
  if (!Component) return null

  // Extract animation settings from props
  const animationSettings = block.props._animation as AnimationSettings | undefined

  const componentElement = <Component {...block.props} />

  // Wrap with animations if configured
  if (animationSettings && animationSettings.entrance !== 'none') {
    return (
      <AnimationWrapper animation={animationSettings}>
        {componentElement}
      </AnimationWrapper>
    )
  }

  return componentElement
}
```

#### 6. Settings Panel Integration

**Update: `components/page-builder/component-settings-panel.tsx`**
```typescript
import { AnimationSettingsPanel } from './animation-settings'
import type { AnimationSettings } from '@/lib/cms/animations'

export function ComponentSettingsPanel() {
  const { selectedBlock, actions } = usePageBuilder()

  const currentAnimation: AnimationSettings = selectedBlock?.props._animation || {
    entrance: 'none',
    scroll: 'none',
    hover: 'none',
    delay: 0,
    duration: 0.6
  }

  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="props">Props</TabsTrigger>
        <TabsTrigger value="styles">Styles</TabsTrigger>
        <TabsTrigger value="animations">Animations</TabsTrigger>
      </TabsList>

      <TabsContent value="animations">
        <AnimationSettingsPanel
          value={currentAnimation}
          onChange={(settings) => {
            actions.updateBlockProp(selectedBlock.id, '_animation', settings)
          }}
        />
      </TabsContent>
    </Tabs>
  )
}
```

### Implementation Steps

**Week 8: Animation System Foundation**
- [ ] Define animation constants in `lib/cms/animations.ts`
- [ ] Create `AnimationWrapper` component with Framer Motion
- [ ] Add `AnimationSettingsPanel` to settings panel
- [ ] Test entrance animations (fadeIn, slideIn, zoomIn)
- [ ] Test delay and duration controls

**Week 9: Advanced Effects & Polish**
- [ ] Implement scroll animations (parallax, reveal)
- [ ] Implement hover effects (lift, scale, glow)
- [ ] Add animation preview in settings panel
- [ ] Test animations on public frontend
- [ ] Performance testing with multiple animated components

### Testing Checklist

**Entrance Animations**:
- [ ] Fade In triggers on scroll into view
- [ ] Fade In Up slides from bottom
- [ ] Slide In Left slides from left
- [ ] Zoom In scales up smoothly
- [ ] Delay parameter works correctly
- [ ] Duration parameter works correctly

**Scroll Animations**:
- [ ] Parallax creates depth effect
- [ ] Reveal shows content on scroll
- [ ] Sticky keeps component in viewport

**Hover Effects**:
- [ ] Lift adds shadow and translateY
- [ ] Scale increases size on hover
- [ ] Glow adds glow effect

**Performance**:
- [ ] Page with 20+ animated components loads smoothly
- [ ] Animations don't block main thread
- [ ] Mobile devices handle animations well

---

## Phase 5: Advanced Features (Weeks 10-12)

### Objective
Implement **global styles system**, **page templates**, and **undo/redo UI** to complete the page builder feature set.

### Feature 1: Global Styles System

**User Story**:
> "As a designer, I want to define global color and typography styles once, then apply them across all pages, so I maintain brand consistency."

**Architecture**:

1. **Database Table**:
```sql
CREATE TABLE IF NOT EXISTS public.cms_global_styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,  -- 'color' | 'typography' | 'spacing'
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example rows:
-- { name: 'primary-color', type: 'color', value: { hex: '#3B82F6', rgb: [59, 130, 246] } }
-- { name: 'heading-font', type: 'typography', value: { family: 'Inter', size: 48, weight: 700 } }
```

2. **UI**: Global styles editor in CMS settings
3. **Usage**: Components reference global styles via tokens (e.g., `backgroundColor: 'var(--primary-color)'`)

---

### Feature 2: Page Templates

**User Story**:
> "As a content editor, I want to start from a 'Landing Page' template with pre-built sections, so I don't have to build from scratch."

**Architecture**:

1. **Database**: `cms_page_templates` table already exists
2. **Template Structure**:
```json
{
  "id": "uuid",
  "name": "Landing Page Template",
  "thumbnail_url": "/templates/landing.jpg",
  "category": "marketing",
  "blocks": [
    { "component_name": "HeroSection", "props": { ... } },
    { "component_name": "FeatureGrid", "props": { ... } },
    { "component_name": "CTASection", "props": { ... } }
  ]
}
```

3. **UI**: Template gallery in "Create New Page" flow
4. **Usage**: Copy template blocks to new page on creation

---

### Feature 3: Undo/Redo UI

**User Story**:
> "As a content editor, I want to undo my last change with Ctrl+Z, so I can experiment without fear."

**Architecture**:

1. **State Management** (already exists in context):
```typescript
interface PageBuilderState {
  history: BlockData[][]  // Array of page states
  historyIndex: number    // Current position in history
}
```

2. **UI**: Undo/Redo buttons in toolbar + keyboard shortcuts
3. **Implementation**:
```typescript
const actions = {
  undo: () => {
    if (state.historyIndex > 0) {
      setState({
        ...state,
        historyIndex: state.historyIndex - 1,
        blocks: state.history[state.historyIndex - 1]
      })
    }
  },

  redo: () => {
    if (state.historyIndex < state.history.length - 1) {
      setState({
        ...state,
        historyIndex: state.historyIndex + 1,
        blocks: state.history[state.historyIndex + 1]
      })
    }
  }
}

// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      actions.undo()
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      actions.redo()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

---

### Implementation Steps

**Week 10: Global Styles**
- [ ] Create `cms_global_styles` table
- [ ] Build global styles editor UI
- [ ] Integrate with component props (CSS variables)
- [ ] Test style updates propagate to all pages

**Week 11: Page Templates**
- [ ] Build template gallery UI
- [ ] Create 3 starter templates (Landing, About, Contact)
- [ ] Implement "Create from Template" flow
- [ ] Test template block copying

**Week 12: Undo/Redo & Polish**
- [ ] Add Undo/Redo buttons to toolbar
- [ ] Implement keyboard shortcuts
- [ ] Add history limit (max 50 states)
- [ ] Test undo/redo across all operations
- [ ] Final QA and bug fixes

---

## Database Schema Updates

### Summary of All New Tables

```sql
-- Phase 1: Component Code History
CREATE TABLE public.cms_component_code_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  component_id UUID REFERENCES public.cms_custom_components(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  change_description TEXT
);

-- Phase 2: Custom Components (validate existing table)
-- cms_custom_components should already exist, verify columns:
ALTER TABLE public.cms_custom_components
  ADD COLUMN IF NOT EXISTS preview_image_url TEXT,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Phase 5: Global Styles
CREATE TABLE public.cms_global_styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,  -- 'color' | 'typography' | 'spacing'
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- All tables: Enable RLS and create policies (see individual phase sections)
```

### Existing Tables Used (No Migration Needed)

- `cms_page_blocks.responsive_settings` (JSONB) - Phase 3
- `cms_page_blocks.props._animation` (JSONB) - Phase 4
- `cms_page_templates` - Phase 5

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Phase 1 - Code Editor**:
- `code-parser.ts`: Test TSX parsing with valid/invalid code
- `CodeEditorView`: Test Monaco initialization, error display

**Phase 2 - Custom Components**:
- `detectPropsFromTSX()`: Test with various prop patterns
- `CreateCustomComponentDialog`: Test form validation, submission

**Phase 3 - Responsive**:
- `ResponsivePropsEditor`: Test override detection, reset functionality
- `BreakpointSwitcher`: Test breakpoint state changes

**Phase 4 - Animations**:
- `AnimationWrapper`: Test entrance animations trigger on scroll
- `AnimationSettingsPanel`: Test settings update correctly

---

### Integration Tests (Playwright)

**End-to-End Workflows**:

1. **Custom Component Creation**:
   - Navigate to page builder
   - Click "+ Add Custom Component"
   - Paste TSX code
   - Verify props auto-detected
   - Submit form
   - Verify component appears in palette
   - Drag component onto canvas
   - Verify component renders correctly

2. **Responsive Editing**:
   - Select a component
   - Switch to "Mobile" breakpoint
   - Override a prop value
   - Verify override badge appears
   - Save page
   - Reload page
   - Verify override persisted

3. **Animation Configuration**:
   - Select a component
   - Open "Animations" tab
   - Set entrance animation to "Fade In Up"
   - Set delay to 500ms
   - Save page
   - Open public page
   - Scroll to component
   - Verify animation triggers

---

### Performance Tests

**Metrics to Track**:
- Page builder load time (<2s)
- Component drag-drop responsiveness (<100ms)
- Monaco editor typing latency (<50ms)
- Animation frame rate (60fps)
- Page save operation (<1s)

**Load Testing**:
- Page with 100+ components
- Custom component with 10KB code
- 50 concurrent users editing pages

---

## Success Metrics

### Phase 1: Component Code Editor
- ✅ Users can edit component TSX code in Monaco editor
- ✅ Syntax errors detected and displayed inline
- ✅ Save operation updates component in database
- ✅ Code changes reflect in preview immediately
- **KPI**: 80% of developers use code editor at least once per week

---

### Phase 2: Custom Component Workflow
- ✅ Users can create custom components by pasting TSX
- ✅ Props auto-detected from TypeScript interfaces
- ✅ Custom components appear in palette within 2 seconds
- ✅ Custom components work identically to built-in components
- **KPI**: 20+ custom components created in first month

---

### Phase 3: Responsive UI Enhancement
- ✅ Users can switch between Desktop/Tablet/Mobile views
- ✅ Canvas width updates to match breakpoint
- ✅ Responsive overrides saved to database
- ✅ Public pages render correct props per device
- **KPI**: 50% of pages use responsive overrides

---

### Phase 4: Basic Animations
- ✅ Users can add entrance animations to components
- ✅ Animations trigger on scroll into view
- ✅ Delay and duration controls work correctly
- ✅ Hover effects apply on mouse hover
- **KPI**: 30% of components use animations

---

### Phase 5: Advanced Features
- ✅ Global styles defined and applied across pages
- ✅ Page templates reduce creation time by 70%
- ✅ Undo/Redo works for all operations
- ✅ Keyboard shortcuts improve editing speed
- **KPI**: 90% user satisfaction with page builder

---

## Appendix: Code Examples

### Example 1: Full Custom Component (shadcn Button)

**TSX Code to Paste**:
```tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CustomButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

export function CustomButton({
  children,
  variant = 'default',
  size = 'md',
  onClick,
  className
}: CustomButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
          'border border-input bg-background hover:bg-accent': variant === 'outline',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg'
        },
        className
      )}
    >
      {children}
    </button>
  )
}
```

**Auto-detected Props**:
- `children`: ReactNode (required)
- `variant`: 'default' | 'outline' | 'ghost' (optional, default: 'default')
- `size`: 'sm' | 'md' | 'lg' (optional, default: 'md')
- `onClick`: function (optional)
- `className`: string (optional)

---

### Example 2: Responsive Hero Section

**Desktop Props**:
```json
{
  "title": "Welcome to JKKN Institutions",
  "subtitle": "Empowering students since 1995",
  "backgroundImage": "/images/hero-desktop.jpg",
  "titleFontSize": 56,
  "subtitleFontSize": 24,
  "ctaButtons": [
    { "label": "Apply Now", "link": "/admissions" },
    { "label": "Explore Programs", "link": "/programs" }
  ]
}
```

**Responsive Overrides (Mobile)**:
```json
{
  "titleFontSize": 32,
  "subtitleFontSize": 16,
  "backgroundImage": "/images/hero-mobile.jpg",
  "ctaButtons": [
    { "label": "Apply", "link": "/admissions" }
  ]
}
```

**Result**:
- Desktop: Large text (56px/24px), desktop image, 2 buttons
- Mobile: Smaller text (32px/16px), mobile image, 1 button
- Tablet: Inherits desktop values (no overrides)

---

### Example 3: Animation Configuration

**Component with Entrance + Hover**:
```json
{
  "props": {
    "title": "Our Services",
    "description": "Comprehensive educational programs",
    "_animation": {
      "entrance": "fadeInUp",
      "scroll": "reveal",
      "hover": "lift",
      "delay": 300,
      "duration": 0.8
    }
  }
}
```

**Behavior**:
- Component starts invisible and 40px below final position
- When scrolled into view, fades in while sliding up over 0.8s
- Animation starts after 300ms delay
- On hover, component lifts with shadow effect

---

## Conclusion

This implementation plan transforms the JKKN CMS page builder into a competitive, production-ready visual website builder over 12 weeks. By focusing on the user's prioritized features (Component Code Editor, Custom Components, Responsive Editing, Animations) in Phases 1-4, we deliver immediate value while laying the foundation for advanced features in Phase 5.

**Key Differentiators vs Competitors**:
- **shadcn-style Component Import**: Paste any TSX code → instant custom component (unique to JKKN)
- **Integrated Code Editor**: Edit component source directly in the page builder (rare in visual builders)
- **Developer-First Approach**: Built for technical users who want control + speed
- **Next.js 16 + Supabase**: Modern stack with server actions, real-time, and RLS security

**Next Steps**:
1. Review and approve this implementation plan
2. Create GitHub project with 5 milestones (one per phase)
3. Begin Phase 1 implementation (Weeks 1-3)
4. Weekly progress reviews and demos

---

**Document Version**: 1.0
**Last Updated**: January 6, 2026
**Author**: Claude Code Assistant
**Status**: Ready for Review
