'use client'

import { Suspense } from 'react'
import { getComponent, getComponentEntry, isFullWidthComponent } from '@/lib/cms/component-registry'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { applyBlockStyles, type BlockStyles } from '@/components/page-builder/utils/style-applicator'
import { filterBuilderProps } from '@/lib/cms/filter-builder-props'
import { AnimationWrapper } from '@/components/cms-blocks/animations/animation-wrapper'
import type { BlockAnimation, BlockData, CmsPageSettings } from '@/lib/cms/registry-types'
import { PageTypographyProvider } from '@/lib/cms/page-typography-context'
import type { PageTypographySettings } from '@/lib/cms/page-typography-types'
import { DEFAULT_FONT_FAMILY } from '@/lib/cms/page-typography-types'
import { DynamicFontLoader } from '@/components/cms-blocks/fonts/dynamic-font-loader'
import { BlockErrorBoundary } from '@/components/ui/block-error-boundary'
import { enhanceBlock } from '@/lib/cms/design-enhancer'

/**
 * Extended BlockData with children for tree structure
 */
type BlockDataWithChildren = BlockData & {
  children?: BlockDataWithChildren[]
}

interface LivePreviewRendererProps {
  blocks: BlockData[]
  /** Page-level typography settings */
  pageTypography?: PageTypographySettings
  /** Page-level styling settings (background, glassmorphism, layout) */
  pageSettings?: CmsPageSettings
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

/**
 * Build a tree structure from flat blocks array using parent_block_id
 * This mirrors the buildBlockTree function from page-renderer.tsx
 */
function buildBlockTree(blocks: BlockData[]): BlockDataWithChildren[] {
  // Create a map for quick lookup
  const blockMap = new Map<string, BlockDataWithChildren>()
  blocks.forEach((block) => {
    blockMap.set(block.id, { ...block, children: [] })
  })

  const rootBlocks: BlockDataWithChildren[] = []

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
  const sortBlocks = (blocks: BlockDataWithChildren[]): BlockDataWithChildren[] => {
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
 * This mirrors the RenderBlock function from page-renderer.tsx
 */
function RenderBlock({ block, isNested = false }: { block: BlockDataWithChildren; isNested?: boolean }) {
  const Component = getComponent(block.component_name)
  const entry = getComponentEntry(block.component_name)

  if (!Component || !entry) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg my-2">
        <p className="text-amber-600 text-sm">
          Component "{block.component_name}" not found
        </p>
      </div>
    )
  }

  // Get enhancement from design enhancer
  const enhancement = enhanceBlock({
    id: block.id,
    componentName: block.component_name,
    props: block.props,
    sortOrder: block.sort_order,
    parentBlockId: block.parent_block_id,
    isVisible: block.is_visible,
    customClasses: block.custom_classes,
    customCss: block.custom_css,
  })

  // Check for AI enhancement background gradient
  const backgroundGradient = block.props._backgroundGradient as string | undefined || enhancement.backgroundGradient

  // Get block styles (margin, padding, etc.) from props
  const blockStyles = block.props._styles as BlockStyles | undefined
  const appliedStyles = applyBlockStyles(blockStyles)

  // Get animation settings from props
  const animationSettings = block.props._animation as BlockAnimation | undefined

  // Check if this component is full-width
  const isFullWidth = isFullWidthComponent(block.component_name)

  // Wrapper for custom classes, CSS, animations
  const BlockWrapper = ({ children }: { children: React.ReactNode }) => {
    const combinedClasses = cn(
      'relative',
      block.custom_classes,
      enhancement.wrapperClassName
    )

    const content = (
      <div
        className={combinedClasses}
        style={appliedStyles}
      >
        {/* Background gradient overlay for AI enhancements */}
        {backgroundGradient && (
          <div className={cn('absolute inset-0 pointer-events-none rounded-inherit', backgroundGradient)} />
        )}
        {block.custom_css && (
          <style dangerouslySetInnerHTML={{ __html: `[data-block-id="${block.id}"] { ${block.custom_css} }` }} />
        )}
        <div data-block-id={block.id} className={cn('relative', enhancement.innerClassName)}>
          {children}
        </div>
      </div>
    )

    // If animation settings are present, wrap with AnimationWrapper
    if (animationSettings && (animationSettings.entrance !== 'none' || animationSettings.hoverEffect !== 'none')) {
      return (
        <AnimationWrapper animation={animationSettings}>
          {content}
        </AnimationWrapper>
      )
    }

    return content
  }

  // Responsive container for non-full-width blocks at root level
  const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => {
    if (isNested || isFullWidth) {
      return <>{children}</>
    }
    return (
      <div className="page-content-container">
        {children}
      </div>
    )
  }

  // If component supports children and has children, render them nested
  if (entry.supportsChildren && block.children && block.children.length > 0) {
    return (
      <ResponsiveContainer>
        <BlockWrapper>
          <BlockErrorBoundary componentName={block.component_name}>
            <Suspense fallback={<BlockSkeleton />}>
              <Component {...filterBuilderProps(block.props)} id={block.id} isEditing={false}>
                {block.children
                  .filter((child) => child.is_visible)
                  .map((child) => (
                    <RenderBlock key={child.id} block={child} isNested={true} />
                  ))}
              </Component>
            </Suspense>
          </BlockErrorBoundary>
        </BlockWrapper>
      </ResponsiveContainer>
    )
  }

  // Regular block without children
  return (
    <ResponsiveContainer>
      <BlockWrapper>
        <BlockErrorBoundary componentName={block.component_name}>
          <Suspense fallback={<BlockSkeleton />}>
            <Component {...filterBuilderProps(block.props)} id={block.id} isEditing={false} />
          </Suspense>
        </BlockErrorBoundary>
      </BlockWrapper>
    </ResponsiveContainer>
  )
}

/**
 * LivePreviewRenderer - Renders page builder blocks exactly as they appear on the live site
 *
 * This component mirrors the structure of PageRenderer to ensure WYSIWYG preview:
 * - Uses DynamicFontLoader for custom fonts
 * - Uses PageTypographyProvider for typography context
 * - Uses AnimationWrapper for block animations
 * - Uses same styling and enhancement logic
 * - NO builder chrome (no selection borders, drag handles, etc.)
 */
export function LivePreviewRenderer({ blocks, pageTypography }: LivePreviewRendererProps) {
  // Filter to only visible blocks
  const visibleBlocks = blocks.filter((block) => block.is_visible)

  // Get font family with fallback to default
  const fontFamily = pageTypography?.fontFamily || DEFAULT_FONT_FAMILY

  if (visibleBlocks.length === 0) {
    return (
      <DynamicFontLoader fontFamily={fontFamily}>
        <PageTypographyProvider typography={pageTypography}>
          <div className="min-h-[50vh] flex items-center justify-center">
            <p className="text-muted-foreground">No visible blocks to preview.</p>
          </div>
        </PageTypographyProvider>
      </DynamicFontLoader>
    )
  }

  // Build tree structure from flat blocks
  const blockTree = buildBlockTree(visibleBlocks)

  return (
    <DynamicFontLoader fontFamily={fontFamily}>
      <PageTypographyProvider typography={pageTypography}>
        <div className="page-content">
          {blockTree.map((block) => (
            <RenderBlock key={block.id} block={block} />
          ))}
        </div>
      </PageTypographyProvider>
    </DynamicFontLoader>
  )
}

export default LivePreviewRenderer
