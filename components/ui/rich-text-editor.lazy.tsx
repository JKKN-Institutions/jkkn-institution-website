'use client'

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

/**
 * Dynamically imported TipTap Rich Text Editor
 *
 * TipTap with all extensions is ~400KB and only used in blog/content editing.
 * This lazy component reduces initial bundle size significantly.
 *
 * Usage:
 * import { RichTextEditor } from '@/components/ui/rich-text-editor.lazy'
 *
 * The editor will be loaded on-demand when the component mounts.
 */

// Loading skeleton for Rich Text Editor
function RichTextEditorSkeleton() {
  return (
    <div className="border rounded-xl overflow-hidden bg-card animate-pulse">
      {/* Toolbar skeleton */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-8 w-8 bg-muted rounded" />
        ))}
      </div>

      {/* Editor content skeleton */}
      <div className="p-4 min-h-[200px] space-y-3">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dynamically import the actual RichTextEditor component
const RichTextEditorComponent = dynamic(
  () => import('./rich-text-editor').then((mod) => ({ default: mod.RichTextEditor })),
  {
    loading: () => <RichTextEditorSkeleton />,
    ssr: false, // TipTap requires client-side rendering
  }
)

// Re-export with the same API
export function RichTextEditor(props: ComponentProps<typeof RichTextEditorComponent>) {
  return <RichTextEditorComponent {...props} />
}
