'use client'

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

/**
 * Dynamically imported Monaco Code Editor
 *
 * Monaco Editor is ~500KB and only used in admin code editing pages.
 * This lazy component reduces initial bundle size significantly.
 *
 * Usage:
 * import { CodeEditor } from '@/components/cms/code-editor.lazy'
 *
 * The editor will be loaded on-demand when the component mounts.
 */

// Loading skeleton for Monaco Editor
function CodeEditorSkeleton() {
  return (
    <div className="relative border rounded-xl overflow-hidden bg-card animate-pulse">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-7 w-7 bg-muted rounded" />
          <div className="h-7 w-7 bg-muted rounded" />
          <div className="h-7 w-7 bg-muted rounded" />
        </div>
      </div>
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading code editor...</p>
        </div>
      </div>
    </div>
  )
}

// Dynamically import the actual CodeEditor component
// This delays loading Monaco until the component is actually needed
const CodeEditorComponent = dynamic(
  () => import('./code-editor').then((mod) => ({ default: mod.CodeEditor })),
  {
    loading: () => <CodeEditorSkeleton />,
    ssr: false, // Monaco doesn't work with SSR
  }
)

const CodeDisplayComponent = dynamic(
  () => import('./code-editor').then((mod) => ({ default: mod.CodeDisplay })),
  {
    loading: () => <CodeEditorSkeleton />,
    ssr: false,
  }
)

// Re-export with the same API
export function CodeEditor(props: ComponentProps<typeof CodeEditorComponent>) {
  return <CodeEditorComponent {...props} />
}

export function CodeDisplay(props: ComponentProps<typeof CodeDisplayComponent>) {
  return <CodeDisplayComponent {...props} />
}
