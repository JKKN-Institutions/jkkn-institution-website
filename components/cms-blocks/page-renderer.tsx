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
  children?: BlockData[]
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

/**
 * Build a tree structure from flat blocks array using parent_block_id
 */
function buildBlockTree(blocks: BlockData[]): BlockData[] {
  // Create a map for quick lookup
  const blockMap = new Map<string, BlockData>()
  blocks.forEach((block) => {
    blockMap.set(block.id, { ...block, children: [] })
  })

  const rootBlocks: BlockData[] = []

  // Build the tree
  blocks.forEach((block) => {
    const blockWithChildren = blockMap.get(block.id)!
    if (block.parent_block_id && blockMap.has(block.parent_block_id)) {
      // Add as child to parent
      const parent = blockMap.get(block.parent_block_id)!
      if (!parent.children) parent.children = []
      parent.children.push(blockWithChildren)
    } else {
      // Root level block
      rootBlocks.push(blockWithChildren)
    }
  })

  // Sort root blocks and all children by sort_order
  const sortBlocks = (blocks: BlockData[]): BlockData[] => {
    return blocks
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((block) => ({
        ...block,
        children: block.children ? sortBlocks(block.children) : [],
      }))
  }

  return sortBlocks(rootBlocks)
}

/**
 * Recursively render a block and its children
 */
function RenderBlock({ block }: { block: BlockData }) {
  const Component = getComponent(block.component_name)
  const entry = getComponentEntry(block.component_name)

  if (!Component || !entry) {
    return <BlockError componentName={block.component_name} />
  }

  // If component supports children and has children, render them nested
  if (entry.supportsChildren && block.children && block.children.length > 0) {
    return (
      <Suspense fallback={<BlockSkeleton />}>
        <Component {...block.props} id={block.id}>
          {block.children
            .filter((child) => child.is_visible)
            .map((child) => (
              <RenderBlock key={child.id} block={child} />
            ))}
        </Component>
      </Suspense>
    )
  }

  // Regular block without children
  return (
    <Suspense fallback={<BlockSkeleton />}>
      <Component {...block.props} id={block.id} />
    </Suspense>
  )
}

export function PageRenderer({ blocks }: PageRendererProps) {
  // Filter to only visible blocks
  const visibleBlocks = blocks.filter((block) => block.is_visible)

  if (visibleBlocks.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">This page has no content yet.</p>
      </div>
    )
  }

  // Build tree structure from flat blocks
  const blockTree = buildBlockTree(visibleBlocks)

  return (
    <div className="page-content">
      {blockTree.map((block) => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </div>
  )
}
