'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Loading skeleton for rich text editor
function RichTextEditorSkeleton() {
  return (
    <div className="space-y-2">
      {/* Toolbar skeleton */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-t-xl bg-muted/30">
        {/* Text formatting buttons */}
        <div className="flex gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
        <div className="w-px h-8 bg-border mx-1" />
        {/* Heading buttons */}
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
        <div className="w-px h-8 bg-border mx-1" />
        {/* List buttons */}
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>
      {/* Editor content skeleton */}
      <div className="min-h-[200px] p-4 border rounded-b-xl space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Dynamically import RichTextEditor (~2.5MB TipTap)
export const RichTextEditor = dynamic(
  () => import('./rich-text-editor').then((mod) => mod.RichTextEditor),
  {
    loading: () => <RichTextEditorSkeleton />,
    ssr: false, // TipTap uses browser APIs
  }
)
