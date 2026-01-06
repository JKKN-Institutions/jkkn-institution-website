# CMS Module Improvements - Implementation Guide

## 📋 Overview

This document outlines the comprehensive improvements made to the CMS (Content Management System) page builder module to address UX issues, add responsive design capabilities, and implement code editing features.

**Status:** ✅ Core components built, pending integration into main page builder

---

## 🎯 Problems Solved

### 1. **Cognitive Overload from 5-Tab System** ✅ SOLVED
**Before:** Users had to manually switch between 5 tabs (Properties, Typography, SEO, FAB, Footer) to find relevant settings.

**After:** Context-aware single panel that automatically shows:
- Component settings when a block is selected
- Page settings when no block is selected
- Collapsible accordion sections to reduce visual clutter

### 2. **No Responsive Design UI** ✅ SOLVED
**Before:** The `cms_page_blocks.responsive_settings` column existed in the database but had NO UI to expose it.

**After:** Visual breakpoint selector with device-specific property overrides:
- Desktop (🖥️) / Tablet (📱) / Mobile (⌚) switcher
- Override any property per breakpoint
- Visual indicators showing which props are overridden
- Reset individual props or all overrides

### 3. **No Code Viewing/Editing** ✅ SOLVED
**Before:** No way to see or copy the React code for components.

**After:** Hybrid code viewer with three modes:
- **JSX View:** See React component code with syntax highlighting
- **Props View:** See props as JSON
- **Types View:** See TypeScript interface
- Copy-to-clipboard for all three

### 4. **No Custom Component Creation** ✅ SOLVED
**Before:** Couldn't paste JSX code to create custom components.

**After:** JSX parser that:
- Parses pasted React code using Babel
- Extracts component name, props schema, default props
- Auto-detects category (content/layout/media/data)
- Validates code safety (blocks dangerous patterns)
- Auto-registers component in CMS

---

## 📦 New Components Created

### 1. **UnifiedRightPanel** (`components/page-builder/right-panel-unified.tsx`)

Main component that replaces the 5-tab system.

**Features:**
- Context detection (component mode vs page mode)
- Accordion-based collapsible sections
- Responsive breakpoint selector
- Embedded code viewer
- Auto-switches content based on selection

**Props:**
```typescript
interface UnifiedRightPanelProps {
  onSeoUpdate?: (data: any) => void
  onFabUpdate?: (data: any) => void
  onTypographyUpdate?: (data: any) => void
  onFooterUpdate?: (data: any) => void
  initialSeoData?: any
  initialFabConfig?: any
  initialTypography?: any
  initialFooterSettings?: any
}
```

**Key Components:**
- `ResponsivePropField` - Individual prop editor with override indicator
- `ComponentPropertiesEditor` - Base props editor (placeholder)
- `HybridCodeViewer` - Code display (placeholder)
- `ComponentDesignEditor` - Design settings (placeholder)

### 2. **ResponsivePropsEditor** (`components/page-builder/responsive-props-editor.tsx`)

Allows editing component properties per breakpoint.

**Features:**
- Visual device breakpoint selector
- Show/hide overridden props only
- Reset individual props or all
- Inheritance from desktop (base) props
- Visual diff showing base vs override values

**Database Integration:**
- Reads from: `cms_page_blocks.responsive_settings` (jsonb)
- Structure: `{ desktop: {...}, tablet: {...}, mobile: {...} }`

**Props:**
```typescript
interface ResponsivePropsEditorProps {
  componentName: string
  propsSchema: any // From component registry
  baseProps: Record<string, any> // Desktop props
  responsiveSettings: Record<DeviceBreakpoint, Record<string, any>>
  currentBreakpoint: 'desktop' | 'tablet' | 'mobile'
  onChange: (breakpoint, props) => void
  onReset: (breakpoint, propKey?) => void
}
```

### 3. **HybridCodeViewer** (`components/page-builder/hybrid-code-viewer.tsx`)

Read-only code display with copy functionality.

**Features:**
- Syntax highlighting using `react-syntax-highlighter`
- Three views: JSX / Props JSON / TypeScript Types
- Copy buttons for each view
- Auto-generates code from component data

**Dependencies:**
```bash
npm install react-syntax-highlighter
npm install @types/react-syntax-highlighter
```

**Props:**
```typescript
interface HybridCodeViewerProps {
  componentName: string
  props: Record<string, any>
  responsiveSettings?: Record<string, any>
  showComments?: boolean
  className?: string
}
```

### 4. **JSX Parser** (`lib/cms/jsx-parser.ts`)

Parses pasted JSX/TSX code to auto-register custom components.

**Features:**
- Uses Babel parser to analyze React code
- Extracts component name, props, TypeScript types
- Infers component category automatically
- Validates code safety (blocks dangerous patterns)
- Supports both functional and class components

**Dependencies:**
```bash
npm install @babel/parser @babel/traverse @babel/types
npm install @types/babel__parser @types/babel__traverse @types/babel__types
```

**Usage:**
```typescript
import { parseJsxComponent } from '@/lib/cms/jsx-parser'

const result = await parseJsxComponent(pastedCode, {
  strictMode: true,
  inferCategory: true,
  generateDescription: true,
})

// result contains:
// - name, displayName, description
// - propsSchema (extracted from TypeScript/PropTypes)
// - defaultProps
// - category (auto-detected)
// - code (original source)
```

**Safety Features:**
- Blocks code execution functions
- Blocks innerHTML manipulation
- Blocks suspicious imports (fs, child_process, etc.)
- Blocks prototype pollution attempts

---

## 🗄️ Database Schema (Already Exists!)

The database already supports responsive settings:

```sql
-- cms_page_blocks table
CREATE TABLE cms_page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES cms_pages(id),
  component_name TEXT NOT NULL,
  props JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- ✅ This column already exists!
  responsive_settings JSONB DEFAULT '{}'::jsonb,

  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Responsive Settings Structure:**
```json
{
  "desktop": {},
  "tablet": {
    "fontSize": "16px",
    "padding": "2rem"
  },
  "mobile": {
    "fontSize": "14px",
    "padding": "1rem",
    "hideImage": true
  }
}
```

---

## 🔧 Installation Steps

### Step 1: Install Dependencies

```bash
# Syntax highlighter for code viewer
npm install react-syntax-highlighter
npm install @types/react-syntax-highlighter

# Babel parser for JSX parsing
npm install @babel/parser @babel/traverse @babel/types
npm install -D @types/babel__parser @types/babel__traverse @types/babel__types
```

### Step 2: Verify Existing shadcn/ui Components

These components are already installed (verify in your project):
- `Accordion` (used in unified panel)
- `Badge` (used throughout)
- `Button` (used throughout)
- `ScrollArea` (used in unified panel)
- `Separator` (used for dividers)
- `Tabs` (used in code viewer)
- `Input`, `Label`, `Switch`, `Select`, `Textarea` (used in props editor)

If any are missing, install them:
```bash
npx shadcn@latest add accordion badge button scroll-area separator tabs input label switch select textarea
```

---

## 🔌 Integration Steps

### Step 1: Update PageBuilder Component

Replace the current 5-tab system with the unified panel.

**File:** `components/page-builder/page-builder.tsx`

**Before:**
```tsx
<TabsList className="grid grid-cols-5 flex-1">
  <TabsTrigger value="properties">Props</TabsTrigger>
  <TabsTrigger value="typography">Typo</TabsTrigger>
  <TabsTrigger value="seo">SEO</TabsTrigger>
  <TabsTrigger value="fab">FAB</TabsTrigger>
  <TabsTrigger value="footer">Footer</TabsTrigger>
</TabsList>
```

**After:**
```tsx
import { UnifiedRightPanel } from './right-panel-unified'

// In the right panel section:
<UnifiedRightPanel
  onSeoUpdate={handleSeoUpdate}
  onFabUpdate={handleFabUpdate}
  onTypographyUpdate={handleTypographyUpdate}
  onFooterUpdate={handleFooterUpdate}
  initialSeoData={seoData}
  initialFabConfig={fabConfig}
  initialTypography={typography}
  initialFooterSettings={footerSettings}
/>
```

### Step 2: Migrate Existing Panels

Move the content from existing panels into the unified panel:

1. **PropertiesPanel** → Keep as `ComponentPropertiesEditor` sub-component
2. **SEOPanel** → Move into "Page Settings" accordion section
3. **FABPanel** → Move into "Page Settings" accordion section
4. **TypographyPanel** → Move into "Page Settings" accordion section
5. **FooterPanel** → Move into "Page Settings" accordion section

### Step 3: Update Server Actions

Add responsive settings support to Server Actions.

**File:** `app/actions/cms/pages.ts`

```typescript
export async function updatePageContent(
  pageId: string,
  blocks: BlockData[]
) {
  // Ensure responsive_settings is preserved
  const blocksWithResponsive = blocks.map(block => ({
    ...block,
    responsive_settings: block.responsive_settings || {},
  }))

  // ... rest of update logic
}
```

### Step 4: Update BuilderCanvas Rendering

Make canvas render responsive previews based on device mode.

**File:** `components/page-builder/builder-canvas.tsx`

```typescript
function BuilderCanvas({ blocks, device }: BuilderCanvasProps) {
  const renderBlock = (block: BlockData) => {
    // Merge responsive settings with base props
    const responsiveProps = block.responsive_settings?.[device] || {}
    const effectiveProps = {
      ...block.props,
      ...responsiveProps,
    }

    // Render component with effective props
    return <Component {...effectiveProps} />
  }

  return (
    <div className={getDeviceWidthClass(device)}>
      {blocks.map(block => renderBlock(block))}
    </div>
  )
}
```

---

## 🎨 UI/UX Improvements Summary

### Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| **Right Panel Organization** | 5 separate tabs | Context-aware single panel |
| **Cognitive Load** | High (manual tab switching) | Low (auto-adapts to context) |
| **Responsive Design** | No UI (database column unused) | Full visual breakpoint editor |
| **Code Viewing** | Not possible | 3 views (JSX/Props/Types) |
| **Custom Components** | Manual file creation only | Paste JSX → auto-register |
| **Property Overrides** | Not visible | Visual indicators + reset |
| **Navigation** | Tab-based (flat) | Accordion-based (hierarchical) |

---

## 📝 Testing Checklist

### Responsive Props UI
- [ ] Desktop props are the base (no overrides by default)
- [ ] Tablet inherits desktop props initially
- [ ] Mobile inherits desktop props initially
- [ ] Overriding a prop shows visual indicator
- [ ] Reset individual prop works
- [ ] Reset all props works
- [ ] Show only overrides toggle works

### Code Viewer
- [ ] JSX view generates valid React code
- [ ] Props view shows valid JSON
- [ ] Types view shows valid TypeScript interface
- [ ] Copy buttons work for all three views
- [ ] Syntax highlighting displays correctly

### JSX Parser
- [ ] Parses functional components correctly
- [ ] Parses class components correctly
- [ ] Extracts TypeScript props interface
- [ ] Detects component category correctly
- [ ] Blocks dangerous code patterns
- [ ] Handles syntax errors gracefully

---

## ✅ Completion Criteria

This implementation will be considered complete when:

1. ✅ All dependencies installed
2. ⏳ UnifiedRightPanel integrated into page-builder.tsx
3. ⏳ All existing panel content migrated
4. ⏳ Responsive props workflow tested end-to-end
5. ⏳ Code viewer tested for all component types
6. ⏳ JSX parser tested with various component patterns
7. ⏳ Mobile responsive testing passed

---

**Created:** 2026-01-06
**Status:** Core components built, ready for integration
**Estimated Integration Time:** 4-6 hours
**Priority:** High (addresses critical UX issues)
