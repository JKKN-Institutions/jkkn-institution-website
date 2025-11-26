'use client'

import { Suspense } from 'react'
import { getComponent, getComponentEntry } from '@/lib/cms/component-registry'
import { Skeleton } from '@/components/ui/skeleton'

interface BlockData {
  id: string
  component_name: string
  props: Record<string, unknown>
  sort_order: number
  parent_block_id: string | null
  is_visible: boolean
}

interface PageRendererProps {
  blocks: BlockData[]
}

function BlockSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

function BlockError({ componentName }: { componentName: string }) {
  // Only show error in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg my-2">
      <p className="text-red-600 text-sm">
        Component "{componentName}" not found in registry
      </p>
    </div>
  )
}

function RenderBlock({ block }: { block: BlockData }) {
  const Component = getComponent(block.component_name)
  const entry = getComponentEntry(block.component_name)

  if (!Component || !entry) {
    return <BlockError componentName={block.component_name} />
  }

  return (
    <Suspense fallback={<BlockSkeleton />}>
      <Component {...block.props} id={block.id} />
    </Suspense>
  )
}

export function PageRenderer({ blocks }: PageRendererProps) {
  // Filter to only visible blocks and sort by sort_order
  const visibleBlocks = blocks
    .filter((block) => block.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)

  if (visibleBlocks.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">This page has no content yet.</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      {visibleBlocks.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  )
}
