'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Loading skeleton for code editor
function CodeEditorSkeleton({ height = '400px' }: { height?: string | number }) {
  return (
    <div
      className="relative border rounded-xl overflow-hidden bg-card"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <Skeleton className="h-4 w-20" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      </div>
      {/* Editor area skeleton */}
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Dynamically import CodeEditor (~3MB Monaco Editor)
export const CodeEditor = dynamic(
  () => import('./code-editor').then((mod) => mod.CodeEditor),
  {
    loading: () => <CodeEditorSkeleton />,
    ssr: false, // Monaco doesn't work on server
  }
)

// Dynamically import CodeDisplay
export const CodeDisplay = dynamic(
  () => import('./code-editor').then((mod) => mod.CodeDisplay),
  {
    loading: () => <CodeEditorSkeleton height="300px" />,
    ssr: false,
  }
)
